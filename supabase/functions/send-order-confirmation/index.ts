// Send branded order confirmation email after successful payment.
// Uses Resend if RESEND_API_KEY is configured; otherwise logs and returns ok.
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

    const { order_db_id } = await req.json();
    if (!order_db_id) {
      return new Response(JSON.stringify({ error: "order_db_id required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: order, error } = await supabase
      .from("orders").select("*").eq("id", order_db_id).maybeSingle();
    if (error || !order) {
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { data: items } = await supabase
      .from("order_items").select("*").eq("order_id", order_db_id);

    const itemsHtml = (items || []).map((it: any) => `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #EAE5DC;">
          <table cellpadding="0" cellspacing="0" border="0"><tr>
            ${it.product_image ? `<td valign="top" style="padding-right:14px;"><img src="${it.product_image}" width="56" height="70" style="display:block;object-fit:cover;border-radius:2px;" /></td>` : ""}
            <td valign="top" style="font-family:Arial,sans-serif;font-size:13px;color:#3A3A3A;">
              <div style="font-weight:500;">${it.product_name}</div>
              <div style="font-size:11px;color:#888;margin-top:2px;">Qty: ${it.quantity}</div>
            </td>
            <td valign="top" align="right" style="font-family:Arial,sans-serif;font-size:13px;color:#1F4F3D;white-space:nowrap;">
              ₹${Number(it.line_total).toLocaleString("en-IN")}
            </td>
          </tr></table>
        </td>
      </tr>`).join("");

    const subject = `Your RUH order is confirmed — ${order.cashfree_order_id}`;
    const html = `<!doctype html><html><body style="margin:0;padding:0;background:#FFFFFF;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FFFFFF;">
        <tr><td align="center" style="padding:40px 20px;">
          <table width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;">
            <tr><td align="center" style="padding-bottom:24px;">
              <div style="font-family:Georgia,serif;font-style:italic;font-size:32px;color:#1F4F3D;letter-spacing:2px;">RUH</div>
              <div style="font-family:Arial,sans-serif;font-size:10px;letter-spacing:2px;color:#A8866C;text-transform:uppercase;margin-top:4px;">by Ruhi</div>
            </td></tr>
            <tr><td style="background:#F5F1EA;padding:32px;text-align:center;">
              <div style="font-family:Georgia,serif;font-style:italic;font-size:24px;color:#1F4F3D;margin-bottom:8px;">Thank you, ${order.customer_name}</div>
              <div style="font-family:Arial,sans-serif;font-size:13px;color:#55575d;line-height:1.6;">Your order has been confirmed and is being lovingly prepared by our artisans.</div>
            </td></tr>
            <tr><td style="padding:32px 0 16px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:1.5px;color:#888;text-transform:uppercase;">Order ${order.cashfree_order_id}</td></tr>
            <tr><td><table width="100%" cellpadding="0" cellspacing="0" border="0">${itemsHtml}</table></td></tr>
            <tr><td style="padding-top:16px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,sans-serif;font-size:13px;color:#3A3A3A;">
                <tr><td>Subtotal</td><td align="right">₹${Number(order.subtotal).toLocaleString("en-IN")}</td></tr>
                <tr><td style="padding-top:6px;">Shipping</td><td align="right" style="padding-top:6px;">${Number(order.shipping) === 0 ? "FREE" : `₹${Number(order.shipping).toLocaleString("en-IN")}`}</td></tr>
                <tr><td colspan="2" style="border-top:1px solid #EAE5DC;padding-top:10px;"></td></tr>
                <tr><td style="font-size:15px;font-weight:600;color:#1F4F3D;">Total</td><td align="right" style="font-size:15px;font-weight:600;color:#1F4F3D;">₹${Number(order.total).toLocaleString("en-IN")}</td></tr>
              </table>
            </td></tr>
            <tr><td style="padding-top:32px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:1.5px;color:#888;text-transform:uppercase;">Shipping to</td></tr>
            <tr><td style="padding-top:8px;font-family:Arial,sans-serif;font-size:13px;color:#3A3A3A;line-height:1.6;">
              ${order.customer_name}<br/>
              ${order.shipping_address_line1}${order.shipping_address_line2 ? ", " + order.shipping_address_line2 : ""}<br/>
              ${order.shipping_city}, ${order.shipping_state} ${order.shipping_pin}<br/>
              ${order.customer_phone}
            </td></tr>
            <tr><td style="padding:40px 0 20px;text-align:center;font-family:Arial,sans-serif;font-size:12px;color:#888;line-height:1.6;">
              Questions? Reply to this email or message us on WhatsApp.<br/>
              <span style="font-style:italic;color:#A8866C;">Handcrafted with intention. RUH by Ruhi.</span>
            </td></tr>
          </table>
        </td></tr>
      </table>
    </body></html>`;

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const FROM_EMAIL = Deno.env.get("ORDER_EMAIL_FROM") || "RUH by Ruhi <onboarding@resend.dev>";

    if (!RESEND_API_KEY) {
      console.warn("RESEND_API_KEY not set — order confirmation email NOT sent. Order:", order.cashfree_order_id);
      return new Response(JSON.stringify({ ok: true, sent: false, reason: "email_not_configured" }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [order.customer_email],
        subject,
        html,
      }),
    });
    const body = await resp.json();
    if (!resp.ok) {
      console.error("Resend error:", body);
      return new Response(JSON.stringify({ ok: false, error: body }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ ok: true, sent: true, id: body.id }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("send-order-confirmation exception:", err);
    return new Response(JSON.stringify({ error: String(err?.message || err) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
