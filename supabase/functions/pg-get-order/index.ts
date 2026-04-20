// Cashfree: get order status edge function
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const APP_ID = Deno.env.get("CASHFREE_APP_ID");
    const SECRET_KEY = Deno.env.get("CASHFREE_SECRET_KEY");
    const ENV = (Deno.env.get("CASHFREE_ENVIRONMENT") || "SANDBOX").toUpperCase();

    if (!APP_ID || !SECRET_KEY) {
      return new Response(
        JSON.stringify({ error: "Cashfree credentials are not configured." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let order_id: string | null = null;
    if (req.method === "GET") {
      order_id = new URL(req.url).searchParams.get("order_id");
    } else {
      const body = await req.json().catch(() => ({}));
      order_id = body?.order_id ?? null;
    }

    if (!order_id) {
      return new Response(JSON.stringify({ error: "order_id is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
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
        status: cfRes.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        order_id: data.order_id,
        order_status: data.order_status,
        order_amount: data.order_amount,
        order_currency: data.order_currency,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("pg-get-order exception:", err);
    return new Response(JSON.stringify({ error: String(err?.message || err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
