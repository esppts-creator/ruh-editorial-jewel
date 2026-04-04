import { useState } from "react";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { useNavigate, Navigate } from "react-router-dom";

const steps = ["Shipping", "Payment", "Confirm"];

export default function CheckoutPage() {
  const { user } = useAuth();
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: "", phone: "", email: "", address1: "", address2: "", city: "", state: "", pin: "" });

  if (!user) return <Navigate to="/" replace />;
  if (items.length === 0) return <Navigate to="/" replace />;

  const shipping = total >= 999 ? 0 : 99;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleShippingSubmit = (e: React.FormEvent) => { e.preventDefault(); setStep(1); };
  const handlePayment = () => { clearCart(); navigate("/order-confirmation"); };

  return (
    <main className="pt-[72px] md:pt-[84px] pb-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center gap-4 mb-12">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <span className={`font-body text-[0.65rem] uppercase tracking-wider ${i === step ? "text-ruh-forest font-medium" : "text-ruh-charcoal/30"}`}>{s}</span>
              {i < steps.length - 1 && <span className="text-ruh-charcoal/20">→</span>}
            </div>
          ))}
        </div>
        <div className="grid md:grid-cols-[60%_40%] gap-12">
          <div>
            {step === 0 && (
              <form onSubmit={handleShippingSubmit} className="space-y-5">
                <h2 className="font-heading italic text-xl text-ruh-forest mb-6">Shipping Details</h2>
                {[
                  { name: "name", placeholder: "Full Name *", required: true },
                  { name: "email", placeholder: "Email *", required: true, type: "email" },
                  { name: "address1", placeholder: "Address Line 1 *", required: true },
                  { name: "address2", placeholder: "Address Line 2 (optional)" },
                ].map(f => (
                  <input key={f.name} name={f.name} type={f.type || "text"} placeholder={f.placeholder} value={(form as any)[f.name]} onChange={handleChange} required={f.required}
                    className="w-full border-b border-ruh-mist bg-transparent font-body text-[0.85rem] py-3 focus:border-ruh-forest focus:outline-none placeholder:text-ruh-charcoal/30" />
                ))}
                <div className="flex gap-4">
                  <span className="font-body text-[0.85rem] text-ruh-charcoal/50 py-3">+91</span>
                  <input name="phone" placeholder="Phone *" value={form.phone} onChange={handleChange} required className="flex-1 border-b border-ruh-mist bg-transparent font-body text-[0.85rem] py-3 focus:border-ruh-forest focus:outline-none placeholder:text-ruh-charcoal/30" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[{ name: "city", p: "City *" }, { name: "state", p: "State *" }, { name: "pin", p: "PIN *" }].map(f => (
                    <input key={f.name} name={f.name} placeholder={f.p} value={(form as any)[f.name]} onChange={handleChange} required
                      className="border-b border-ruh-mist bg-transparent font-body text-[0.85rem] py-3 focus:border-ruh-forest focus:outline-none placeholder:text-ruh-charcoal/30" />
                  ))}
                </div>
                <button type="submit" className="w-full h-[52px] bg-ruh-forest text-ruh-cream font-body text-[0.75rem] uppercase tracking-[0.15em] hover:bg-ruh-forest/90 transition-colors mt-6">Continue to Payment →</button>
              </form>
            )}
            {step === 1 && (
              <div>
                <h2 className="font-heading italic text-xl text-ruh-forest mb-6">Payment</h2>
                <div className="bg-ruh-mist p-8 mb-6">
                  <p className="font-body text-sm text-ruh-charcoal mb-4">Pay via UPI</p>
                  <div className="flex items-center gap-3 mb-6">{["PhonePe", "GPay", "Paytm"].map(n => <span key={n} className="bg-white px-3 py-2 font-body text-xs text-ruh-charcoal border border-ruh-mist">{n}</span>)}</div>
                  <p className="font-body text-[0.65rem] text-ruh-charcoal/50">100% Secure. Powered by Cashfree.</p>
                </div>
                <button onClick={handlePayment} className="w-full h-[52px] bg-ruh-forest text-ruh-cream font-body text-[0.75rem] uppercase tracking-[0.15em] hover:bg-ruh-forest/90 transition-colors">Generate UPI Payment Link</button>
                <button onClick={() => setStep(0)} className="font-body text-[0.7rem] text-ruh-charcoal/50 underline mt-4 block">← Back to Shipping</button>
              </div>
            )}
          </div>
          <div className="md:sticky md:top-24 self-start">
            <h3 className="font-heading italic text-base text-ruh-forest mb-6">Your Order ({items.length} {items.length === 1 ? "item" : "items"})</h3>
            <div className="space-y-4 mb-6">
              {items.map(item => (
                <div key={item.product.id} className="flex gap-3">
                  <img src={item.product.images[0]} alt={item.product.name} className="w-14 h-[70px] object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0"><p className="font-body text-sm text-ruh-charcoal truncate">{item.product.name}</p><p className="font-body text-xs text-ruh-charcoal/50">Qty: {item.quantity}</p></div>
                  <p className="font-body text-sm text-ruh-forest">₹{(item.product.price * item.quantity).toLocaleString("en-IN")}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-ruh-mist pt-4 space-y-2">
              <div className="flex justify-between font-body text-sm"><span className="text-ruh-charcoal/60">Subtotal</span><span>₹{total.toLocaleString("en-IN")}</span></div>
              <div className="flex justify-between font-body text-sm"><span className="text-ruh-charcoal/60">Shipping</span><span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span></div>
              <div className="flex justify-between font-body text-base font-medium pt-2 border-t border-ruh-mist"><span>Total</span><span className="text-ruh-forest">₹{(total + shipping).toLocaleString("en-IN")}</span></div>
            </div>
            <p className="font-body text-[0.65rem] text-ruh-charcoal/40 mt-4">↩ Free returns within 15 days</p>
          </div>
        </div>
      </div>
    </main>
  );
}
