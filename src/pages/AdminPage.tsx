import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Pencil, Trash2, Plus, X, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "sonner";

type Status = "pending" | "paid" | "failed" | "cancelled" | "shipped" | "delivered" | "refunded";
const STATUSES: Status[] = ["pending", "paid", "failed", "shipped", "delivered", "cancelled", "refunded"];

interface Order { id: string; cashfree_order_id: string; total: number; status: Status; payment_status: string; customer_name: string; customer_email: string; customer_phone: string; shipping_city: string; shipping_state: string; created_at: string; }
interface Product { id: string; slug: string; name: string; category: string; collection: string | null; price: number; mrp: number | null; images: string[]; stock: number; is_new: boolean; is_featured: boolean; is_active: boolean; description: string | null; metal: string | null; dimensions: string | null; weight: string | null; finish: string | null; inspiration: string | null; care: string | null; }
interface Slide { id: string; title: string; subtitle: string | null; eyebrow: string | null; image_url: string; cta_label: string | null; cta_link: string | null; sort_order: number; is_active: boolean; }

const empty: Partial<Product> = { name: "", slug: "", category: "ring", collection: "Adiva", price: 0, stock: 0, images: [], is_new: false, is_featured: false, is_active: true };
const emptySlide: Partial<Slide> = { title: "", subtitle: "", eyebrow: "", image_url: "", cta_label: "Explore", cta_link: "/", sort_order: 0, is_active: true };

export default function AdminPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [tab, setTab] = useState<"orders" | "products" | "billboard">("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Product> | null>(null);
  const [editingSlide, setEditingSlide] = useState<Partial<Slide> | null>(null);

  useEffect(() => {
    if (!isAdmin) return;
    refresh();
  }, [isAdmin]);

  const refresh = async () => {
    setLoading(true);
    const [{ data: o }, { data: p }, { data: s }] = await Promise.all([
      supabase.from("orders").select("*").order("created_at", { ascending: false }),
      supabase.from("products").select("*").order("created_at", { ascending: false }),
      supabase.from("billboard_slides").select("*").order("sort_order", { ascending: true }),
    ]);
    setOrders((o as any) || []);
    setProducts((p as any) || []);
    setSlides((s as any) || []);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: Status) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Status updated"); refresh(); }
  };

  const saveProduct = async () => {
    if (!editing) return;
    const payload: any = { ...editing };
    if (typeof payload.images === "string") payload.images = (payload.images as string).split(/\n|,/).map(s => s.trim()).filter(Boolean);
    if (!payload.name || !payload.slug || !payload.price) { toast.error("Name, slug & price are required"); return; }
    payload.price = Number(payload.price);
    payload.stock = Number(payload.stock || 0);
    if (payload.mrp !== null && payload.mrp !== undefined && payload.mrp !== "") payload.mrp = Number(payload.mrp); else payload.mrp = null;
    const { error } = editing.id
      ? await supabase.from("products").update(payload).eq("id", editing.id)
      : await supabase.from("products").insert(payload);
    if (error) toast.error(error.message);
    else { toast.success("Saved"); setEditing(null); refresh(); }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); refresh(); }
  };

  const saveSlide = async () => {
    if (!editingSlide) return;
    const payload: any = { ...editingSlide };
    if (!payload.title || !payload.image_url) { toast.error("Title & image URL are required"); return; }
    payload.sort_order = Number(payload.sort_order || 0);
    const { error } = editingSlide.id
      ? await supabase.from("billboard_slides").update(payload).eq("id", editingSlide.id)
      : await supabase.from("billboard_slides").insert(payload);
    if (error) toast.error(error.message);
    else { toast.success("Slide saved"); setEditingSlide(null); refresh(); }
  };

  const deleteSlide = async (id: string) => {
    if (!confirm("Delete this slide?")) return;
    const { error } = await supabase.from("billboard_slides").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); refresh(); }
  };

  const moveSlide = async (slide: Slide, direction: -1 | 1) => {
    const sorted = [...slides].sort((a, b) => a.sort_order - b.sort_order);
    const idx = sorted.findIndex(s => s.id === slide.id);
    const swap = sorted[idx + direction];
    if (!swap) return;
    await Promise.all([
      supabase.from("billboard_slides").update({ sort_order: swap.sort_order }).eq("id", slide.id),
      supabase.from("billboard_slides").update({ sort_order: slide.sort_order }).eq("id", swap.id),
    ]);
    refresh();
  };

  const toggleSlideActive = async (slide: Slide) => {
    const { error } = await supabase.from("billboard_slides").update({ is_active: !slide.is_active }).eq("id", slide.id);
    if (error) toast.error(error.message); else refresh();
  };

  if (authLoading) return null;
  if (!user) return <Navigate to="/" replace />;
  if (!isAdmin) return (
    <main className="pt-[100px] pb-20 min-h-screen flex items-center justify-center">
      <p className="font-body text-sm text-ruh-charcoal/60">You don't have access to the admin panel.</p>
    </main>
  );

  return (
    <main className="pt-[80px] md:pt-[100px] pb-20 min-h-screen bg-ruh-cream/30">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="font-heading italic text-3xl md:text-4xl text-ruh-forest mb-6">Admin</h1>
        <div className="flex gap-2 mb-8">
          {(["orders", "products", "billboard"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2 font-body text-xs uppercase tracking-[0.15em] ${tab === t ? "bg-ruh-forest text-ruh-cream" : "border border-ruh-forest text-ruh-forest"}`}>
              {t}
            </button>
          ))}
        </div>

        {loading ? <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-ruh-forest" /></div> :
          tab === "orders" ? (
            <div className="bg-white border border-ruh-mist overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-ruh-mist/40">
                  <tr className="font-body text-[0.65rem] uppercase tracking-wider text-ruh-charcoal/60">
                    <th className="px-4 py-3">Order</th><th className="px-4 py-3">Customer</th><th className="px-4 py-3">Total</th><th className="px-4 py-3">Payment</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center font-body text-sm text-ruh-charcoal/50">No orders yet.</td></tr>}
                  {orders.map(o => (
                    <tr key={o.id} className="border-t border-ruh-mist text-sm">
                      <td className="px-4 py-3 font-mono text-xs">{o.cashfree_order_id}</td>
                      <td className="px-4 py-3">
                        <div className="font-body text-ruh-charcoal">{o.customer_name}</div>
                        <div className="font-body text-xs text-ruh-charcoal/50">{o.customer_email}</div>
                      </td>
                      <td className="px-4 py-3 font-body text-ruh-forest">₹{Number(o.total).toLocaleString("en-IN")}</td>
                      <td className="px-4 py-3"><span className={`px-2 py-0.5 text-[0.6rem] uppercase tracking-wider ${o.payment_status === "paid" ? "bg-ruh-forest text-ruh-cream" : o.payment_status === "failed" ? "bg-red-100 text-red-800" : "bg-ruh-gold/30 text-ruh-forest"}`}>{o.payment_status}</span></td>
                      <td className="px-4 py-3">
                        <select value={o.status} onChange={e => updateStatus(o.id, e.target.value as Status)}
                          className="font-body text-xs border border-ruh-mist px-2 py-1 bg-white">
                          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-3 font-body text-xs text-ruh-charcoal/60">{new Date(o.created_at).toLocaleDateString("en-IN")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div>
              <div className="flex justify-end mb-4">
                <button onClick={() => setEditing({ ...empty })} className="flex items-center gap-2 px-4 py-2 bg-ruh-forest text-ruh-cream font-body text-xs uppercase tracking-wider"><Plus size={14} /> New Product</button>
              </div>
              <div className="bg-white border border-ruh-mist overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-ruh-mist/40">
                    <tr className="font-body text-[0.65rem] uppercase tracking-wider text-ruh-charcoal/60">
                      <th className="px-4 py-3">Image</th><th className="px-4 py-3">Name</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Price</th><th className="px-4 py-3">Stock</th><th className="px-4 py-3">Active</th><th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p.id} className="border-t border-ruh-mist text-sm">
                        <td className="px-4 py-2"><img src={p.images[0]} alt="" className="w-10 h-12 object-cover" /></td>
                        <td className="px-4 py-3 font-body text-ruh-charcoal">{p.name}<div className="text-[0.65rem] text-ruh-charcoal/50">{p.slug}</div></td>
                        <td className="px-4 py-3 font-body text-xs">{p.category}</td>
                        <td className="px-4 py-3 font-body text-ruh-forest">₹{Number(p.price).toLocaleString("en-IN")}</td>
                        <td className="px-4 py-3 font-body text-xs">{p.stock}</td>
                        <td className="px-4 py-3 font-body text-xs">{p.is_active ? "✓" : "—"}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <button onClick={() => setEditing({ ...p, images: (p.images || []).join("\n") as any })} className="p-1.5 hover:bg-ruh-mist/50" aria-label="Edit"><Pencil size={14} /></button>
                            <button onClick={() => deleteProduct(p.id)} className="p-1.5 hover:bg-red-50 text-red-600" aria-label="Delete"><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 overflow-y-auto" onClick={() => setEditing(null)}>
          <div className="bg-white p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading italic text-xl text-ruh-forest">{editing.id ? "Edit Product" : "New Product"}</h3>
              <button onClick={() => setEditing(null)}><X size={20} /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {([
                ["name", "Name *"], ["slug", "Slug *"], ["category", "Category (ring/earring) *"], ["collection", "Collection"],
                ["price", "Price (INR) *", "number"], ["mrp", "MRP (INR)", "number"], ["stock", "Stock", "number"],
                ["metal", "Metal"], ["dimensions", "Dimensions"], ["weight", "Weight"], ["finish", "Finish"],
              ] as const).map(([k, label, type]) => (
                <label key={k} className="block text-xs">
                  <span className="font-body uppercase tracking-wider text-ruh-charcoal/60 text-[0.65rem]">{label}</span>
                  <input type={type || "text"} value={(editing as any)[k] ?? ""} onChange={e => setEditing({ ...editing, [k]: e.target.value })}
                    className="w-full border border-ruh-mist px-3 py-2 mt-1 font-body text-sm focus:outline-none focus:border-ruh-forest" />
                </label>
              ))}
              <label className="block text-xs md:col-span-2">
                <span className="font-body uppercase tracking-wider text-ruh-charcoal/60 text-[0.65rem]">Images (one URL per line)</span>
                <textarea rows={3} value={(editing as any).images ?? ""} onChange={e => setEditing({ ...editing, images: e.target.value as any })}
                  className="w-full border border-ruh-mist px-3 py-2 mt-1 font-body text-xs focus:outline-none focus:border-ruh-forest" />
              </label>
              <label className="block text-xs md:col-span-2">
                <span className="font-body uppercase tracking-wider text-ruh-charcoal/60 text-[0.65rem]">Description</span>
                <textarea rows={3} value={editing.description ?? ""} onChange={e => setEditing({ ...editing, description: e.target.value })}
                  className="w-full border border-ruh-mist px-3 py-2 mt-1 font-body text-sm focus:outline-none focus:border-ruh-forest" />
              </label>
              <label className="block text-xs md:col-span-2">
                <span className="font-body uppercase tracking-wider text-ruh-charcoal/60 text-[0.65rem]">Inspiration</span>
                <input value={editing.inspiration ?? ""} onChange={e => setEditing({ ...editing, inspiration: e.target.value })}
                  className="w-full border border-ruh-mist px-3 py-2 mt-1 font-body text-sm focus:outline-none focus:border-ruh-forest" />
              </label>
              <label className="block text-xs md:col-span-2">
                <span className="font-body uppercase tracking-wider text-ruh-charcoal/60 text-[0.65rem]">Care</span>
                <input value={editing.care ?? ""} onChange={e => setEditing({ ...editing, care: e.target.value })}
                  className="w-full border border-ruh-mist px-3 py-2 mt-1 font-body text-sm focus:outline-none focus:border-ruh-forest" />
              </label>
              <div className="flex gap-4 md:col-span-2 text-xs">
                {(["is_new", "is_featured", "is_active"] as const).map(k => (
                  <label key={k} className="flex items-center gap-2 font-body">
                    <input type="checkbox" checked={!!(editing as any)[k]} onChange={e => setEditing({ ...editing, [k]: e.target.checked })} />
                    {k.replace("is_", "")}
                  </label>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setEditing(null)} className="px-5 py-2 border border-ruh-mist font-body text-xs uppercase tracking-wider">Cancel</button>
              <button onClick={saveProduct} className="px-5 py-2 bg-ruh-forest text-ruh-cream font-body text-xs uppercase tracking-wider">Save</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
