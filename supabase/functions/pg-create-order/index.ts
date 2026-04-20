// Cashfree: create order edge function
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
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
        JSON.stringify({
          error: "Cashfree credentials are not configured. Add CASHFREE_APP_ID and CASHFREE_SECRET_KEY as project secrets.",
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const { order_amount, order_currency = "INR", customer_details, return_url } = body || {};

    if (!order_amount || !customer_details?.customer_id || !customer_details?.customer_phone) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: order_amount, customer_details.customer_id, customer_details.customer_phone" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const baseUrl = ENV === "PRODUCTION" ? "https://api.cashfree.com/pg" : "https://sandbox.cashfree.com/pg";
    const order_id = `order_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const payload: Record<string, unknown> = {
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

    if (return_url) {
      payload.order_meta = { return_url };
    }

    const cfRes = await fetch(`${baseUrl}/orders`, {
      method: "POST",
      headers: {
        "x-api-version": "2023-08-01",
        "x-client-id": APP_ID,
        "x-client-secret": SECRET_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await cfRes.json();

    if (!cfRes.ok) {
      console.error("Cashfree create order error:", data);
      return new Response(JSON.stringify({ error: data?.message || "Failed to create order", details: data }), {
        status: cfRes.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        order_id: data.order_id,
        payment_session_id: data.payment_session_id,
        order_status: data.order_status,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("pg-create-order exception:", err);
    return new Response(JSON.stringify({ error: String(err?.message || err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
