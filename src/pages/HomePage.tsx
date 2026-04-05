import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { products, getFeaturedProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Instagram, Star } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";

function BillboardHero() {
  const featured = getFeaturedProducts();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const autoplayRef = useRef<ReturnType<typeof setInterval>>();
  const isPaused = useRef(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const startAutoplay = useCallback(() => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(() => {
      if (!isPaused.current) emblaApi?.scrollNext();
    }, 3500);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    startAutoplay();
    return () => {
      emblaApi.off("select", onSelect);
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [emblaApi, startAutoplay]);

  return (
    <section
      className="relative h-screen"
      style={{ minHeight: "85vh" }}
      onMouseEnter={() => { isPaused.current = true; }}
      onMouseLeave={() => { isPaused.current = false; }}
      onTouchStart={() => { isPaused.current = true; }}
      onTouchEnd={() => { setTimeout(() => { isPaused.current = false; }, 2000); }}
    >
      <div className="overflow-hidden h-full" ref={emblaRef}>
        <div className="flex h-full">
          {featured.map((product, i) => (
            <div key={product.id} className="relative flex-[0_0_100%] min-w-0 h-full">
              <Link to={`/products/${product.slug}`} className="block w-full h-full">
                <motion.img
                  key={`img-${selectedIndex === i ? "active" : "idle"}-${product.id}`}
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover object-top"
                  loading={i === 0 ? "eager" : "lazy"}
                  initial={{ scale: 1 }}
                  animate={selectedIndex === i ? { scale: 1.04 } : { scale: 1 }}
                  transition={{ duration: 6, ease: "easeOut" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ruh-forest/75 via-transparent to-transparent" />
                <motion.div
                  className="absolute bottom-16 md:bottom-20 left-6 md:left-12 max-w-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={selectedIndex === i ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                >
                  <p className="font-body text-[0.65rem] uppercase tracking-[0.2em] text-ruh-gold mb-2">
                    {product.collection} Collection · Limited
                  </p>
                  <h2 className="font-heading italic text-[2.5rem] md:text-[4rem] text-ruh-cream leading-[1.1] mb-3">
                    {product.name}
                  </h2>
                  <p className="font-body font-light text-[1.1rem] text-ruh-cream/85 mb-5">
                    ₹{product.price.toLocaleString("en-IN")}
                  </p>
                  <span className="inline-block border border-ruh-cream text-ruh-cream px-6 py-2.5 text-xs uppercase tracking-widest font-body hover:bg-ruh-cream hover:text-ruh-forest transition-colors duration-200">
                    Explore →
                  </span>
                </motion.div>
              </Link>
            </div>
          ))}
        </div>
      </div>
      <button onClick={scrollPrev} className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors w-8 h-8 items-center justify-center" aria-label="Previous"><ChevronLeft size={32} strokeWidth={1} /></button>
      <button onClick={scrollNext} className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors w-8 h-8 items-center justify-center" aria-label="Next"><ChevronRight size={32} strokeWidth={1} /></button>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {featured.map((_, i) => (
          <button key={i} onClick={() => emblaApi?.scrollTo(i)} className={`w-1.5 h-1.5 rounded-full transition-colors ${i === selectedIndex ? "bg-ruh-gold" : "bg-white/30"}`} aria-label={`Slide ${i+1}`} />
        ))}
      </div>
    </section>
  );
}

function TrustBar() {
  const items = ["✦ Handcrafted in India", "✦ Ethically Made", "✦ Free Shipping ₹999+", "✦ 15-Day Returns"];
  return (
    <div className="bg-ruh-forest text-ruh-cream h-12 overflow-hidden">
      <div className="hidden md:flex items-center justify-center h-full max-w-[1400px] mx-auto">
        {items.map((item, i) => (
          <div key={i} className="flex items-center">
            <span className="font-body text-[0.65rem] uppercase tracking-[0.15em] px-6">{item}</span>
            {i < items.length - 1 && <div className="w-px h-4 bg-ruh-cream/20" />}
          </div>
        ))}
      </div>
      <div className="md:hidden flex items-center h-full overflow-hidden">
        <div className="ruh-marquee whitespace-nowrap">
          {[...items, ...items].map((item, i) => (
            <span key={i} className="font-body text-[0.65rem] uppercase tracking-[0.15em] mx-6 inline-block">{item}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductGrid() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("newest");

  useEffect(() => { if (categoryParam) setFilter(categoryParam); }, [categoryParam]);

  const filters = [
    { label: "All", value: "all" }, { label: "Rings", value: "ring" }, { label: "Earrings", value: "earring" },
    { label: "Under ₹1,500", value: "under1500" }, { label: "Under ₹2,500", value: "under2500" },
  ];

  let filtered = [...products];
  if (filter === "ring") filtered = filtered.filter(p => p.category === "ring");
  else if (filter === "earring") filtered = filtered.filter(p => p.category === "earring");
  else if (filter === "under1500") filtered = filtered.filter(p => p.price < 1500);
  else if (filter === "under2500") filtered = filtered.filter(p => p.price < 2500);
  if (sort === "price-low") filtered.sort((a, b) => a.price - b.price);
  else if (sort === "price-high") filtered.sort((a, b) => b.price - a.price);

  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16" id="products">
      <div className="text-center mb-4">
        <h2 className="font-heading italic text-[2.5rem] text-ruh-forest">The Adiva Collection</h2>
      </div>
      <p className="font-body font-light text-[0.8rem] uppercase tracking-[0.15em] text-ruh-copper text-center mb-14">
        Handcrafted Rings & Earrings — Limited Editions
      </p>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-10">
        <div className="flex flex-wrap gap-2">
          {filters.map(f => (
            <button key={f.value} onClick={() => setFilter(f.value)}
              className={`rounded-full px-4 py-1.5 text-xs uppercase tracking-wider font-body transition-colors min-h-[36px] ${
                filter === f.value ? "bg-ruh-forest text-white" : "border border-ruh-forest text-ruh-forest bg-transparent hover:bg-ruh-forest/5"
              }`}>{f.label}</button>
          ))}
        </div>
        <select value={sort} onChange={e => setSort(e.target.value)}
          className="font-body text-xs text-ruh-charcoal bg-transparent border border-ruh-mist px-3 py-2 min-h-[36px] focus:outline-none">
          <option value="newest">Sort: Newest</option>
          <option value="price-low">Price: Low → High</option>
          <option value="price-high">Price: High → Low</option>
        </select>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
        {filtered.map((product, i) => <ProductCard key={product.id} product={product} index={i} />)}
      </div>
    </section>
  );
}

function BrandStory() {
  return (
    <section className="max-w-[1400px] mx-auto">
      <div className="grid md:grid-cols-2">
        <motion.div initial={{ opacity: 0, x: -60 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <img src="https://images.unsplash.com/photo-1515562141589-67f0d569b6fc?w=800&q=80&auto=format" alt="Artisan crafting" loading="lazy" className="w-full h-full object-cover aspect-[4/5]" />
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 60 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="bg-ruh-forest p-12 md:p-16 flex flex-col justify-center">
          <h2 className="font-heading italic text-[2rem] text-ruh-cream mb-6">The Gond Legacy</h2>
          <div className="space-y-4 font-body font-light text-[0.85rem] text-ruh-cream/80 leading-[1.8]">
            <p>For over 1,400 years, the Gond people of central India have painted their world — trees that speak, rivers that sing, birds that carry prayers.</p>
            <p>RUH translates this ancient visual language into wearable form. Every curve in our rings, every pattern on our earrings, is drawn from Gond cosmology.</p>
            <p>We work directly with tribal artisan families in Madhya Pradesh, ensuring fair wages and sustainable practices.</p>
          </div>
          <Link to="/about" className="mt-8 inline-block border-b border-ruh-gold text-ruh-gold font-body text-[0.7rem] uppercase tracking-widest self-start hover:opacity-70 transition-opacity">Read Our Story →</Link>
        </motion.div>
      </div>
    </section>
  );
}

function SocialProof() {
  const testimonials = [
    { quote: "I wore the Adiva Forest Ring to a gallery opening and received more compliments than the art on the walls.", name: "Priya M.", stars: 5 },
    { quote: "The craftsmanship is extraordinary. You can feel the intention in every detail — this isn't mass-produced jewellery.", name: "Ananya K.", stars: 5 },
    { quote: "I gifted the Nilam Drops to my mother. She said it reminded her of the jewelry her grandmother wore.", name: "Roshni D.", stars: 5 },
  ];
  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <h2 className="font-heading italic text-2xl text-ruh-forest text-center mb-12">Worn & Loved</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} className="bg-ruh-mist p-8">
            <div className="flex gap-1 mb-4">{Array.from({ length: t.stars }).map((_, j) => <Star key={j} size={14} className="fill-ruh-gold text-ruh-gold" />)}</div>
            <p className="font-heading italic text-base text-ruh-charcoal leading-[1.7] mb-4">"{t.quote}"</p>
            <p className="font-body text-[0.7rem] uppercase tracking-wider text-ruh-copper">{t.name}</p>
            <p className="font-body text-[0.6rem] text-ruh-charcoal/50 mt-1">Verified Buyer</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function InstagramGallery() {
  const igPosts = [
    { img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80&auto=format", likes: "2,847", caption: "The Adiva Forest Ring in its element ✦" },
    { img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80&auto=format", likes: "3,120", caption: "Handcrafted with intention 🤎" },
    { img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80&auto=format", likes: "1,956", caption: "Nilam Drops — worn by @priyam" },
    { img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80&auto=format", likes: "4,203", caption: "Behind the craft — MP artisan workshop" },
    { img: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600&q=80&auto=format", likes: "2,541", caption: "Stack your story ✦ Prithvi Band" },
    { img: "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=600&q=80&auto=format", likes: "1,782", caption: "Gond-inspired textures up close" },
    { img: "https://images.unsplash.com/photo-1515562141589-67f0d569b6fc?w=600&q=80&auto=format", likes: "3,450", caption: "New arrivals — Vana Statement Ring" },
    { img: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&q=80&auto=format", likes: "2,190", caption: "Earthy tones, timeless craft 🌿" },
  ];

  return (
    <section className="py-14 md:py-20">
      {/* Header */}
      <div className="text-center mb-6 md:mb-10 px-4">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <p className="font-body text-[0.6rem] uppercase tracking-[0.2em] text-ruh-copper mb-2">As seen on Instagram</p>
          <h2 className="font-heading italic text-2xl md:text-3xl text-ruh-forest">@ruh.byruhi</h2>
          <p className="font-body font-light text-[0.75rem] text-ruh-charcoal/50 mt-2 max-w-xs mx-auto">
            Follow our world of handcrafted heritage jewellery
          </p>
        </motion.div>
      </div>

      {/* Mobile: Horizontal scroll strip — optimized for thumb swiping */}
      <div className="md:hidden">
        <div className="flex gap-2.5 overflow-x-auto snap-x snap-mandatory px-4 pb-4 scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
          {igPosts.map((post, i) => (
            <motion.a
              key={i}
              href="https://instagram.com/ruh.byruhi"
              target="_blank"
              rel="noopener noreferrer"
              className="relative flex-shrink-0 w-[72vw] snap-center rounded-sm overflow-hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <div className="aspect-[4/5] relative">
                <img src={post.img} alt={post.caption} loading="lazy" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <div className="w-5 h-5 rounded-full bg-ruh-forest flex items-center justify-center">
                      <Instagram size={10} className="text-ruh-cream" />
                    </div>
                    <span className="font-body text-[0.6rem] font-medium text-white/90">ruh.byruhi</span>
                  </div>
                  <p className="font-body text-[0.7rem] text-white/80 leading-snug line-clamp-2">{post.caption}</p>
                  <p className="font-body text-[0.55rem] text-white/50 mt-1">♥ {post.likes} likes</p>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
        {/* Scroll hint */}
        <p className="text-center font-body text-[0.6rem] text-ruh-charcoal/40 mt-1">
          Swipe to explore →
        </p>
      </div>

      {/* Desktop: Masonry-style grid */}
      <div className="hidden md:block max-w-[1400px] mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-4 gap-3">
          {igPosts.map((post, i) => (
            <motion.a
              key={i}
              href="https://instagram.com/ruh.byruhi"
              target="_blank"
              rel="noopener noreferrer"
              className={`relative overflow-hidden group ${i === 0 || i === 5 ? 'row-span-2' : ''}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
            >
              <div className={`${i === 0 || i === 5 ? 'aspect-[3/5]' : 'aspect-square'} relative`}>
                <img
                  src={post.img}
                  alt={post.caption}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-ruh-forest/0 group-hover:bg-ruh-forest/50 transition-colors duration-300 flex flex-col items-center justify-center">
                  <Instagram size={28} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  <p className="font-body text-[0.65rem] text-white/80 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 px-4 text-center line-clamp-2">{post.caption}</p>
                  <p className="font-body text-[0.55rem] text-white/50 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">♥ {post.likes}</p>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center mt-8 md:mt-10 px-4">
        <a
          href="https://instagram.com/ruh.byruhi"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 border border-ruh-forest text-ruh-forest px-6 py-3 font-body text-[0.7rem] uppercase tracking-widest hover:bg-ruh-forest hover:text-ruh-cream transition-colors duration-200 min-h-[48px]"
        >
          <Instagram size={16} />
          Follow @ruh.byruhi
        </a>
      </div>
    </section>
  );
}

function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); if (email) setSubmitted(true); };
  return (
    <section className="bg-ruh-forest py-20 px-6">
      <div className="max-w-[1400px] mx-auto text-center">
        <h2 className="font-heading italic text-[2rem] text-ruh-cream mb-4">Join the Circle</h2>
        <p className="font-body font-light text-[0.8rem] text-ruh-cream/70 max-w-[480px] mx-auto mb-8">First access to new collections, artisan stories, and exclusive drops.</p>
        {submitted ? (
          <p className="font-heading italic text-ruh-gold text-lg">You're in. Welcome to RUH. ✦</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex items-end justify-center gap-4 flex-wrap">
            <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} required className="border-b border-ruh-gold bg-transparent text-ruh-cream placeholder:text-ruh-cream/40 font-body text-[0.85rem] py-2.5 w-[300px] focus:outline-none" />
            <button type="submit" className="bg-ruh-gold text-ruh-forest font-body text-[0.65rem] uppercase tracking-widest px-8 py-3 hover:bg-ruh-gold/90 transition-colors min-h-[44px]">Subscribe</button>
          </form>
        )}
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <main>
      <BillboardHero />
      <TrustBar />
      <ProductGrid />
      <BrandStory />
      <SocialProof />
      <InstagramGallery />
      <Newsletter />
    </main>
  );
}