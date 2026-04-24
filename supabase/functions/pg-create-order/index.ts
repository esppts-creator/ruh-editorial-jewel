// Cashfree: create order + persist to DB
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
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

    const body = await req.json();
    const {
      order_amount, order_currency = "INR", customer_details, return_url,
      shipping, items, // [{ product_id?, slug, name, image, unit_price, quantity }]
    } = body || {};

    if (!order_amount || !customer_details?.customer_id || !customer_details?.customer_phone) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const baseUrl = ENV === "PRODUCTION" ? "https://api.cashfree.com/pg" : "https://sandbox.cashfree.com/pg";
    const order_id = `order_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const cfPayload: Record<string, unknown> = {
      order_id,
      order_amount: Number(order_amount),
      order_currency,
      customer_details: {
        customer_id: customer_details.customer_id,
        customer_phone: customer_details.customer_phone,
        ...(customer_details.customer_email ? { customer_email: customer_details.customer_email } : {}),
        ...(customer_details.customer_name ? { customer_name: customer_details.customer_name } : {}),
      },
    };
    if (return_url) cfPayload.order_meta = { return_url };

    const cfRes = await fetch(`${baseUrl}/orders`, {
      method: "POST",
      headers: {
        "x-api-version": "2023-08-01",
        "x-client-id": APP_ID,
        "x-client-secret": SECRET_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cfPayload),
    });

    const cfData = await cfRes.json();
    if (!cfRes.ok) {
      console.error("Cashfree create order error:", cfData);
      return new Response(JSON.stringify({ error: cfData?.message || "Failed to create order", details: cfData }), {
        status: cfRes.status, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Persist order to DB
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

    // Resolve user from JWT (if present)
    let user_id: string | null = null;
    const authHeader = req.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.slice(7);
      const { data: { user } } = await supabase.auth.getUser(token);
      if (user) user_id = user.id;
    }

    const ship = body.shipping_address || {};
    const subtotal = (items || []).reduce((s: number, it: any) => s + Number(it.unit_price) * Number(it.quantity), 0) || Number(order_amount);
    const shippingFee = Number(shipping ?? Math.max(0, Number(order_amount) - subtotal));

    const { data: orderRow, error: orderErr } = await supabase
      .from("orders")
      .insert({
        user_id,
        cashfree_order_id: cfData.order_id,
        cashfree_payment_session_id: cfData.payment_session_id,
        subtotal,
        shipping: shippingFee,
        total: Number(order_amount),
        currency: order_currency,
        status: "pending",
        payment_status: "pending",
        customer_name: customer_details.customer_name || "Guest",
        customer_email: customer_details.customer_email || "",
        customer_phone: customer_details.customer_phone,
        shipping_address_line1: ship.address1 || "",
        shipping_address_line2: ship.address2 || null,
        shipping_city: ship.city || "",
        shipping_state: ship.state || "",
        shipping_pin: ship.pin || "",
      })
      .select("id")
      .single();

    if (orderErr) {
      console.error("Order persistence error:", orderErr);
    } else if (Array.isArray(items) && items.length && orderRow) {
      const rows = items.map((it: any) => ({
        order_id: orderRow.id,
        product_id: it.product_id || null,
        product_slug: it.slug,
        product_name: it.name,
        product_image: it.image || null,
        unit_price: Number(it.unit_price),
        quantity: Number(it.quantity),
        line_total: Number(it.unit_price) * Number(it.quantity),
      }));
      const { error: itemsErr } = await supabase.from("order_items").insert(rows);
      if (itemsErr) console.error("Order items insert error:", itemsErr);
    }

    return new Response(JSON.stringify({
      order_id: cfData.order_id,
      payment_session_id: cfData.payment_session_id,
      order_status: cfData.order_status,
    }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err: any) {
    console.error("pg-create-order exception:", err);
    return new Response(JSON.stringify({ error: String(err?.message || err) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
