// Cashfree: get order status + sync DB + send confirmation email on success
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const APP_ID = Deno.env.get("CASHFREE_APP_ID");
    const SECRET_KEY = Deno.env.get("CASHFREE_SECRET_KEY");
    const ENV = (Deno.env.get("CASHFREE_ENVIRONMENT") || "SANDBOX").toUpperCase();
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    if (!APP_ID || !SECRET_KEY) {
      return new Response(JSON.stringify({ error: "Cashfree credentials not configured." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let order_id: string | null = null;
    if (req.method === "GET") {
      order_id = new URL(req.url).searchParams.get("order_id");
    } else {
      const b = await req.json().catch(() => ({}));
      order_id = b?.order_id ?? null;
    }
    if (!order_id) {
      return new Response(JSON.stringify({ error: "order_id is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const baseUrl = ENV === "PRODUCTION" ? "https://api.cashfree.com/pg" : "https://sandbox.cashfree.com/pg";
    const cfRes = await fetch(`${baseUrl}/orders/${order_id}`, {
      method: "GET",
      headers: {
        "x-api-version": "2023-08-01",
        "x-client-id": APP_ID,
        "x-client-secret": SECRET_KEY,
      },
    });
    const data = await cfRes.json();
    if (!cfRes.ok) {
      console.error("Cashfree get order error:", data);
      return new Response(JSON.stringify({ error: data?.message || "Failed to fetch order", details: data }), {
        status: cfRes.status, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Sync DB
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
    const status = String(data.order_status || "").toUpperCase();
    let payment_status: "pending" | "paid" | "failed" = "pending";
    let order_status: "pending" | "paid" | "failed" = "pending";
    if (status === "PAID") { payment_status = "paid"; order_status = "paid"; }
    else if (status === "ACTIVE") { payment_status = "pending"; order_status = "pending"; }
    else if (status === "EXPIRED" || status === "TERMINATED" || status === "TERMINATION_REQUESTED") {
      payment_status = "failed"; order_status = "failed";
    }

    const { data: existing } = await supabase
      .from("orders")
      .select("id, payment_status, customer_email, customer_name, total")
      .eq("cashfree_order_id", order_id)
      .maybeSingle();

    if (existing && existing.payment_status !== payment_status) {
      await supabase
        .from("orders")
        .update({
          payment_status,
          status: order_status,
          paid_at: payment_status === "paid" ? new Date().toISOString() : null,
        })
        .eq("id", existing.id);

      // Fire-and-forget email on first transition to paid
      if (payment_status === "paid" && existing.customer_email) {
        try {
          await supabase.functions.invoke("send-order-confirmation", {
            body: { order_db_id: existing.id },
          });
        } catch (e) { console.error("send-order-confirmation invoke failed:", e); }
      }
    }

    return new Response(JSON.stringify({
      order_id: data.order_id,
      order_status: data.order_status,
      order_amount: data.order_amount,
      order_currency: data.order_currency,
    }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err: any) {
    console.error("pg-get-order exception:", err);
    return new Response(JSON.stringify({ error: String(err?.message || err) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
