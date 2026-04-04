import { motion } from "framer-motion";
import { Gem, Users, Leaf } from "lucide-react";

export default function AboutPage() {
  const stats = [
    { number: "12", label: "Artisan Families" },
    { number: "240+", label: "Pieces Made" },
    { number: "3", label: "Tribal Regions" },
    { number: "100%", label: "Handcrafted" },
  ];

  return (
    <main className="pt-[60px] md:pt-[72px]">
      <section className="relative h-[70vh] overflow-hidden">
        <img src="https://images.unsplash.com/photo-1515562141589-67f0d569b6fc?w=1200&q=80&auto=format" alt="Artisan crafting" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-center px-6">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="font-heading italic text-[3rem] text-ruh-cream mb-3">Craft. Culture. Continuity.</motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="font-body font-light text-[0.9rem] text-ruh-cream/80">The story of RUH by Ruhi</motion.p>
          </div>
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="aspect-[3/4] overflow-hidden">
            <img src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80&auto=format" alt="Ruhi — Founder" loading="lazy" className="w-full h-full object-cover" />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="font-heading italic text-[2rem] text-ruh-forest mb-6">Meet Ruhi</h2>
            <div className="space-y-4 font-body font-light text-[0.9rem] text-ruh-charcoal/80 leading-[1.9]">
              <p>Ruhi grew up between two worlds — the steel and glass of Mumbai, and the terracotta villages of Madhya Pradesh where her grandmother lived.</p>
              <p>After studying design and working with luxury brands, she realized something was missing: jewellery that honored Indian craft without turning it into a museum piece.</p>
              <p>RUH was born from that gap — a bridge between 1,400-year-old Gond artistry and the modern Indian woman who wants meaning without compromising on style.</p>
            </div>
            <blockquote className="border-l-4 border-ruh-gold pl-6 mt-8">
              <p className="font-heading italic text-[1.3rem] text-ruh-forest leading-[1.6]">"Heritage doesn't belong in a vitrine. It belongs on your hands, close to your pulse."</p>
            </blockquote>
          </motion.div>
        </div>
      </section>

      <section className="bg-ruh-forest py-20 px-6">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="font-heading italic text-[2rem] text-ruh-cream text-center mb-14">Rooted in Gond Tradition</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Gem size={32} strokeWidth={1} />, title: "The Art", desc: "Gond art dates back over a millennium — a visual language of dots, lines, and organic forms mapping the tribal relationship with nature." },
              { icon: <Users size={32} strokeWidth={1} />, title: "The Artisans", desc: "We partner with 12 artisan families across Dindori, Mandla, and Shahdol districts. Each brings generational knowledge." },
              { icon: <Leaf size={32} strokeWidth={1} />, title: "The Ethics", desc: "Fair wages, no middlemen, sustainable materials. We use recycled metals and ensure every artisan is credited directly." },
            ].map((card, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} className="text-center">
                <div className="text-ruh-gold mb-4 flex justify-center">{card.icon}</div>
                <h3 className="font-heading italic text-lg text-ruh-cream mb-3">{card.title}</h3>
                <p className="font-body font-light text-[0.85rem] text-ruh-cream/70 leading-[1.7]">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ruh-cream py-20 px-6">
        <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} className="text-center">
              <p className="font-heading italic text-[3rem] text-ruh-gold">{stat.number} ✦</p>
              <p className="font-body text-[0.7rem] uppercase tracking-wider text-ruh-charcoal/60 mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
