import { useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";

export default function CheckoutPage() {
  const { items, total } = useCart();
  const [form, setForm] = useState({
    name: "", email: "", phone: "", address: "", city: "", postal: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Order placed! We'll contact you shortly.");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <p className="font-body text-muted-foreground">No items in cart.</p>
      </div>
    );
  }

  const fields = [
    { key: "name", label: "Full Name", type: "text" },
    { key: "email", label: "Email", type: "email" },
    { key: "phone", label: "Phone", type: "tel" },
    { key: "address", label: "Shipping Address", type: "text" },
    { key: "city", label: "City", type: "text" },
    { key: "postal", label: "Postal Code", type: "text" },
  ] as const;

  return (
    <div className="min-h-screen pt-24 md:pt-28">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="font-heading text-3xl md:text-4xl mb-8">Checkout</h1>

          <div className="bg-card rounded-lg p-6 mb-8 border border-border">
            <h2 className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">Order Summary</h2>
            {items.map((item) => (
              <div key={item.product.id} className="flex justify-between font-body text-sm py-2">
                <span>{item.product.name} × {item.quantity}</span>
                <span>₹ {(item.product.price * item.quantity).toLocaleString("en-IN")}</span>
              </div>
            ))}
            <div className="border-t border-border mt-4 pt-4 flex justify-between">
              <span className="font-body text-sm uppercase tracking-wider">Total</span>
              <span className="font-heading text-xl">₹ {total.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map((f) => (
              <div key={f.key}>
                <label className="block font-body text-xs tracking-wider uppercase text-muted-foreground mb-1">
                  {f.label}
                </label>
                <input
                  type={f.type}
                  value={form[f.key]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>
            ))}
            <button
              type="submit"
              className="w-full py-4 mt-4 rounded-lg bg-primary text-primary-foreground font-body text-xs tracking-[0.2em] uppercase hover:bg-primary/90 transition-colors"
            >
              Place Order
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
