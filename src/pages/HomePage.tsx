import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import heroImage from "@/assets/adiva-rings-hero.webp";
import earringsHero from "@/assets/adiva-earrings-hero.webp";
import mainHero from "@/assets/hero-main.webp";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/products";

// Product images map
import imgHoop from "@/assets/product-hoop-earring.webp";
import img25pEar from "@/assets/product-25p-earring.webp";
import img25pRing from "@/assets/product-25p-ring.webp";
import imgKhanak from "@/assets/product-khanak-ring.webp";
import imgSpiral from "@/assets/product-spiral-ring.webp";

const productImages: Record<string, string> = {
  "1": imgHoop,
  "2": img25pEar,
  "4": img25pRing,
  "6": imgKhanak,
  "7": imgSpiral,
};

export default function HomePage() {
  const featuredProducts = products.filter((p) => ["1", "2", "4", "6"].includes(p.id));

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-screen flex items-end">
        <img
          src={heroImage}
          alt="ADIVA Rings Collection - Bold handmade rings by RUH"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/20 to-transparent" />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24 w-full"
        >
          <p className="font-body text-xs tracking-[0.3em] uppercase text-primary-foreground/70 mb-3">
            Tribal Gond Jewellery
          </p>
          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl text-primary-foreground mb-4">
            ADIVA RINGS
          </h1>
          <p className="font-body text-sm md:text-base text-primary-foreground/80 max-w-md mb-8">
            Bold shapes and raw textures inspired by indigenous craftsmanship.
          </p>
          <Link
            to="/products?category=rings"
            className="inline-block bg-primary-foreground text-foreground font-body text-xs tracking-[0.2em] uppercase px-8 py-4 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors duration-300"
          >
            Explore Collection
          </Link>
        </motion.div>
      </section>

      {/* Featured Collection - Earrings */}
      <section className="relative h-[80vh] md:h-screen flex items-center">
        <img
          src={earringsHero}
          alt="ADIVA Earrings - Traditional Gond inspired jewellery"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/50 to-transparent" />
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
        >
          <p className="font-body text-xs tracking-[0.3em] uppercase text-primary-foreground/70 mb-3">
            New Collection
          </p>
          <h2 className="font-heading text-3xl md:text-5xl lg:text-6xl text-primary-foreground mb-4">
            ADIVA EARRINGS
          </h2>
          <p className="font-body text-sm md:text-base text-primary-foreground/80 max-w-lg mb-8">
            Traditional Gond-inspired jewellery crafted with raw metal textures and rhythmic details.
          </p>
          <Link
            to="/products?category=earrings"
            className="inline-block border border-primary-foreground text-primary-foreground font-body text-xs tracking-[0.2em] uppercase px-8 py-4 rounded-lg hover:bg-primary-foreground hover:text-foreground transition-colors duration-300"
          >
            Shop Earrings
          </Link>
        </motion.div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="font-body text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">
            Curated Selection
          </p>
          <h2 className="font-heading text-3xl md:text-4xl">Featured Pieces</h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {featuredProducts.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              image={productImages[product.id] || ""}
              index={i}
            />
          ))}
        </div>
        <div className="text-center mt-12">
          <Link
            to="/products"
            className="inline-block bg-primary text-primary-foreground font-body text-xs tracking-[0.2em] uppercase px-8 py-4 rounded-lg hover:bg-primary/90 transition-colors"
          >
            View All Pieces
          </Link>
        </div>
      </section>

      {/* Brand Story */}
      <section className="bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <p className="font-body text-xs tracking-[0.3em] uppercase opacity-60 mb-4">Our Story</p>
              <h2 className="font-heading text-3xl md:text-4xl mb-6">About RUH</h2>
              <p className="font-body text-sm leading-relaxed opacity-80 mb-4">
                RUH is a handmade jewellery brand inspired by Indian culture, ethics, and a deep respect for heritage. Our purpose is simple: to keep tradition alive in a way that still feels relevant today.
              </p>
              <p className="font-body text-sm leading-relaxed opacity-80 mb-8">
                Every piece carries the warmth of craftsmanship, the memory of culture, and the intention of responsible making. Welcome to RUH — where heritage meets everyday style.
              </p>
              <Link
                to="/about"
                className="inline-block border border-primary-foreground/40 text-primary-foreground font-body text-xs tracking-[0.2em] uppercase px-8 py-4 rounded-lg hover:bg-primary-foreground/10 transition-colors"
              >
                Learn More
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="overflow-hidden rounded-lg"
            >
              <img
                src={mainHero}
                alt="RUH by Ruhi - Handmade jewellery collection"
                className="w-full h-[500px] object-cover"
                loading="lazy"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-xl mx-auto"
        >
          <h2 className="font-heading text-3xl md:text-4xl mb-4">Join the RUH Community</h2>
          <p className="font-body text-sm text-muted-foreground mb-8">
            Be the first to know about new collections and limited pieces.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 rounded-lg border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
              required
            />
            <button
              type="submit"
              className="px-8 py-3 rounded-lg bg-primary text-primary-foreground font-body text-xs tracking-[0.2em] uppercase hover:bg-primary/90 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </motion.div>
      </section>
    </div>
  );
}
