import { motion } from "framer-motion";
import aboutImage from "@/assets/about-section.webp";
import heroMain from "@/assets/hero-main.webp";

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 md:pt-28">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-16">
          <h1 className="font-heading text-4xl md:text-6xl mb-3">About Us</h1>
          <p className="font-body text-xs tracking-[0.3em] uppercase text-muted-foreground">
            Indian Craft Reimagined for Today
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-lg overflow-hidden aspect-[3/4]"
          >
            <img src={heroMain} alt="RUH jewellery collection" className="w-full h-full object-cover" loading="lazy" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="rounded-lg overflow-hidden bg-primary flex items-center justify-center p-8"
          >
            <div className="text-center text-primary-foreground">
              <h2 className="font-heading text-3xl mb-2">RUH</h2>
              <p className="font-body text-sm italic opacity-80">- Ruhi Tulsyan</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="rounded-lg overflow-hidden aspect-[3/4]"
          >
            <img src={aboutImage} alt="About RUH" className="w-full h-full object-cover" loading="lazy" />
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="bg-primary text-primary-foreground">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading text-2xl md:text-3xl mb-8">
              RUH — A Handmade Jewellery Brand by Ruhi Tulsyan
            </h2>
            <div className="space-y-6 font-body text-sm leading-relaxed opacity-85">
              <p>
                RUH is a handmade jewellery brand inspired by Indian culture, ethics, and a deep respect for heritage. Our purpose is simple: to keep tradition alive in a way that still feels relevant today. Every piece carries the warmth of craftsmanship, the memory of culture, and the intention of responsible making.
              </p>
              <p>
                More than a Jewellery brand, RUH is a quiet reminder of our roots — designed to be worn with pride, simplicity, and meaning. Each collection is thoughtfully curated to reflect the spirit of Indian artistry, blending timeless techniques with a modern, wearable aesthetic.
              </p>
              <p>
                At RUH, we value authenticity and thoughtful craftsmanship. Our makers bring patience and skill into every creation, shaping jewellery that feels personal and lasting — made not to follow trends, but to be lived in and loved over time.
              </p>
              <p className="italic opacity-70">
                Welcome to RUH — where heritage meets everyday style, and every piece becomes a story you can wear.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
