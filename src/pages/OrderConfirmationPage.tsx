import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { products } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

export default function OrderConfirmationPage() {
  const orderNumber = `RUH-${Date.now().toString(36).toUpperCase()}`;
  const deliveryDate = new Date(Date.now() + 7 * 86400000).toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const suggested = products.slice(0, 3);

  return (
    <main className="pt-[72px] md:pt-[84px] bg-ruh-cream min-h-screen">
      <div className="max-w-[600px] mx-auto px-6 py-20 text-center">
        <motion.svg width="64" height="64" viewBox="0 0 64 64" className="mx-auto mb-6">
          <motion.circle cx="32" cy="32" r="30" fill="none" stroke="hsl(158,62%,15%)" strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4 }} />
          <motion.path d="M20 32 L28 40 L44 24" fill="none" stroke="hsl(158,62%,15%)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.3 }} />
        </motion.svg>
        <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="font-heading italic text-[2rem] text-ruh-forest mb-4">Order Confirmed!</motion.h1>
        <p className="font-body text-sm text-ruh-charcoal/60 mb-2">Order #{orderNumber}</p>
        <p className="font-body text-sm text-ruh-charcoal/60 mb-8">Expected delivery: {deliveryDate}</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer" className="bg-ruh-forest text-ruh-cream font-body text-[0.7rem] uppercase tracking-wider px-6 py-3 min-h-[44px]">Track via WhatsApp →</a>
          <Link to="/" className="border border-ruh-forest text-ruh-forest font-body text-[0.7rem] uppercase tracking-wider px-6 py-3 hover:bg-ruh-forest hover:text-ruh-cream transition-colors min-h-[44px]">Continue Shopping →</Link>
        </div>
      </div>
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <h2 className="font-heading italic text-xl text-ruh-forest mb-8 text-center">You May Also Like</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 max-w-[900px] mx-auto">
          {suggested.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </section>
    </main>
  );
}
