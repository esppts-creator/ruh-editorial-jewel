import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { Navigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Package } from "lucide-react";

interface OrderItem { id: string; product_name: string; product_slug: string; product_image: string | null; quantity: number; line_total: number; }
interface Order { id: string; cashfree_order_id: string; total: number; subtotal: number; shipping: number; status: string; payment_status: string; created_at: string; shipping_city: string; shipping_state: string; order_items: OrderItem[]; }

const statusBadge: Record<string, string> = {
  paid: "bg-ruh-forest text-ruh-cream",
  pending: "bg-ruh-gold/30 text-ruh-forest",
  failed: "bg-red-100 text-red-800",
  shipped: "bg-blue-100 text-blue-800",
  delivered: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-gray-200 text-gray-700",
  refunded: "bg-amber-100 text-amber-800",
};

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .order("created_at", { ascending: false });
      setOrders((data as any) || []);
      setLoading(false);
    })();
  }, [user]);

  if (authLoading) return null;
  if (!user) return <Navigate to="/" replace />;

  return (
    <main className="pt-[80px] md:pt-[100px] pb-20 min-h-screen bg-ruh-cream/30">
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="font-heading italic text-3xl md:text-4xl text-ruh-forest mb-2">My Orders</h1>
        <p className="font-body text-sm text-ruh-charcoal/60 mb-10">Track every piece you've welcomed home.</p>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-ruh-forest" /></div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-white">
            <Package className="w-10 h-10 mx-auto text-ruh-charcoal/30 mb-4" />
            <p className="font-body text-sm text-ruh-charcoal/60 mb-4">No orders yet.</p>
            <Link to="/" className="font-body text-xs uppercase tracking-[0.15em] text-ruh-forest border-b border-ruh-forest hover:opacity-70">Start Shopping →</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(o => (
              <div key={o.id} className="bg-white p-5 md:p-6 border border-ruh-mist">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-ruh-mist mb-4">
                  <div>
                    <p className="font-body text-[0.65rem] uppercase tracking-wider text-ruh-charcoal/50">Order</p>
                    <p className="font-body text-xs text-ruh-charcoal mt-0.5">{o.cashfree_order_id}</p>
                  </div>
                  <div>
                    <p className="font-body text-[0.65rem] uppercase tracking-wider text-ruh-charcoal/50">Placed</p>
                    <p className="font-body text-xs text-ruh-charcoal mt-0.5">{new Date(o.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                  </div>
                  <span className={`px-2.5 py-1 text-[0.6rem] uppercase tracking-wider font-body ${statusBadge[o.status] || "bg-ruh-mist text-ruh-charcoal"}`}>{o.status}</span>
                </div>
                <div className="space-y-3">
                  {o.order_items?.map(it => (
                    <div key={it.id} className="flex gap-3 items-center">
                      {it.product_image && <img src={it.product_image} alt={it.product_name} className="w-12 h-[60px] object-cover" />}
                      <div className="flex-1 min-w-0">
                        <Link to={`/products/${it.product_slug}`} className="font-body text-sm text-ruh-charcoal hover:text-ruh-forest truncate block">{it.product_name}</Link>
                        <p className="font-body text-xs text-ruh-charcoal/50">Qty: {it.quantity}</p>
                      </div>
                      <p className="font-body text-sm text-ruh-forest">₹{Number(it.line_total).toLocaleString("en-IN")}</p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-ruh-mist">
                  <p className="font-body text-[0.65rem] uppercase tracking-wider text-ruh-charcoal/50">Ships to {o.shipping_city}, {o.shipping_state}</p>
                  <p className="font-body text-base font-medium text-ruh-forest">₹{Number(o.total).toLocaleString("en-IN")}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
