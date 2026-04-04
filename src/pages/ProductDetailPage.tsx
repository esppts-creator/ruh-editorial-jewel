import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductBySlug, getRelatedProducts } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { motion } from "framer-motion";
import { Check, Share2, Copy } from "lucide-react";
import { toast } from "sonner";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import ProductCard from "@/components/ProductCard";
import useEmblaCarousel from "embla-carousel-react";

const sizes = ["S", "M", "L", "XL"];

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const product = getProductBySlug(slug || "");
  const related = product ? getRelatedProducts(product) : [];
  const { addToCart, openDrawer } = useCart();
  const { user, openAuthModal } = useAuth();
  const [mainImage, setMainImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("M");
  const [justAdded, setJustAdded] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const addBtnRef = useRef<HTMLButtonElement>(null);
  const [emblaRef] = useEmblaCarousel({ loop: false });

  useEffect(() => {
    if (!addBtnRef.current) return;
    const observer = new IntersectionObserver(([entry]) => setShowStickyBar(!entry.isIntersecting), { threshold: 0 });
    observer.observe(addBtnRef.current);
    return () => observer.disconnect();
  }, [product]);

  if (!product) return <div className="min-h-screen flex items-center justify-center pt-20"><p className="font-heading italic text-xl text-ruh-charcoal/50">Product not found</p></div>;

  const handleAddToCart = () => {
    addToCart(product);
    setJustAdded(true);
    toast(`${product.name} added to bag`, { duration: 2500, position: "bottom-center" });
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleBuyNow = () => { if (!user) { openAuthModal("signin"); return; } addToCart(product); openDrawer(); };
  const handleShare = () => { navigator.clipboard.writeText(window.location.href); toast("Link copied!", { duration: 2000, position: "bottom-center" }); };

  return (
    <>
      <main className="pt-[60px] md:pt-[72px]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="grid md:grid-cols-[55%_45%] gap-8 md:gap-12">
            <div>
              <div className="hidden md:block">
                <motion.div key={mainImage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className="aspect-[4/5] overflow-hidden mb-3">
                  <img src={product.images[mainImage]} alt={product.name} className="w-full h-full object-cover" />
                </motion.div>
                <div className="flex gap-2">
                  {product.images.map((img, i) => (
                    <button key={i} onClick={() => setMainImage(i)} className={`w-20 h-[100px] overflow-hidden border-2 transition-colors ${i === mainImage ? "border-ruh-forest" : "border-transparent"}`}>
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
              <div className="md:hidden overflow-hidden" ref={emblaRef}>
                <div className="flex">{product.images.map((img, i) => <div key={i} className="flex-[0_0_100%] min-w-0 aspect-[4/5]"><img src={img} alt={product.name} className="w-full h-full object-cover" /></div>)}</div>
              </div>
            </div>

            <div className="md:sticky md:top-24 self-start">
              <p className="font-body text-[0.65rem] uppercase tracking-widest text-ruh-copper mb-3">{product.category === "ring" ? "Rings" : "Earrings"} / {product.collection} Collection</p>
              <h1 className="font-heading italic text-[2rem] text-ruh-forest leading-[1.2] mb-2">{product.name}</h1>
              <div className="flex items-center gap-3 mb-4">
                <span className="font-body text-[1.3rem] text-ruh-forest font-medium">₹{product.price.toLocaleString("en-IN")}</span>
                {product.mrp && <span className="font-body text-base text-ruh-charcoal/40 line-through">₹{product.mrp.toLocaleString("en-IN")}</span>}
              </div>
              <p className="font-body font-light text-[0.85rem] text-ruh-charcoal/75 leading-[1.8] mb-6">{product.description}</p>

              {product.category === "ring" && (
                <div className="mb-6">
                  <p className="font-body text-[0.7rem] uppercase tracking-wider text-ruh-charcoal/60 mb-3">Size</p>
                  <div className="flex gap-2">
                    {sizes.map(s => <button key={s} onClick={() => setSelectedSize(s)} className={`w-10 h-10 font-body text-xs transition-colors ${selectedSize === s ? "bg-ruh-forest text-ruh-cream" : "border border-ruh-forest text-ruh-forest"}`}>{s}</button>)}
                  </div>
                  <p className="font-body text-[0.65rem] text-ruh-copper underline mt-2 cursor-pointer">Ring sizing guide →</p>
                </div>
              )}

              <motion.button ref={addBtnRef} onClick={handleAddToCart} whileTap={{ scale: 0.98 }} className="w-full md:w-[380px] h-[52px] bg-ruh-forest text-ruh-cream font-body text-[0.75rem] uppercase tracking-[0.15em] hover:bg-ruh-forest/90 transition-colors flex items-center justify-center gap-2">
                {justAdded ? <><Check size={16} /> Added!</> : "Add to Bag"}
              </motion.button>
              <button onClick={handleBuyNow} className="font-body text-[0.7rem] text-ruh-forest underline mt-3 block">or Buy Now →</button>

              <div className="flex flex-wrap gap-2 mt-5">
                {["🔒 Secure Checkout", "📦 Free Shipping ₹999+", "↩ 15-Day Returns", "✦ Handcrafted"].map(pill => (
                  <span key={pill} className="bg-ruh-mist rounded-full px-3 py-1 font-body text-[0.6rem] text-ruh-charcoal">{pill}</span>
                ))}
              </div>

              <div className="h-px bg-ruh-mist my-6" />

              <Accordion type="multiple" className="w-full">
                <AccordionItem value="craftsmanship" className="border-b border-ruh-mist">
                  <AccordionTrigger className="font-body text-sm text-ruh-charcoal hover:no-underline py-4">Craftsmanship Details</AccordionTrigger>
                  <AccordionContent className="font-body text-[0.8rem] text-ruh-charcoal/70 leading-relaxed pb-4 space-y-2">
                    <p><span className="text-ruh-charcoal/50">Metal:</span> {product.metal}</p>
                    <p><span className="text-ruh-charcoal/50">Dimensions:</span> {product.dimensions}</p>
                    <p><span className="text-ruh-charcoal/50">Weight:</span> {product.weight}</p>
                    <p><span className="text-ruh-charcoal/50">Finish:</span> {product.finish}</p>
                    <p><span className="text-ruh-charcoal/50">Inspired by:</span> {product.inspiration}</p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="care" className="border-b border-ruh-mist">
                  <AccordionTrigger className="font-body text-sm text-ruh-charcoal hover:no-underline py-4">Care Instructions</AccordionTrigger>
                  <AccordionContent className="font-body text-[0.8rem] text-ruh-charcoal/70 leading-relaxed pb-4">{product.care}</AccordionContent>
                </AccordionItem>
                <AccordionItem value="shipping" className="border-b border-ruh-mist">
                  <AccordionTrigger className="font-body text-sm text-ruh-charcoal hover:no-underline py-4">Shipping & Returns</AccordionTrigger>
                  <AccordionContent className="font-body text-[0.8rem] text-ruh-charcoal/70 leading-relaxed pb-4 space-y-2">
                    <p>Free shipping on orders above ₹999. Standard delivery: 5-7 business days.</p>
                    <p>15-day hassle-free returns. Items must be unworn with original packaging.</p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="flex items-center gap-4 mt-6">
                <a href={`https://wa.me/?text=Check out ${product.name} from RUH: ${window.location.href}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 font-body text-[0.65rem] text-ruh-charcoal/50 hover:text-ruh-charcoal"><Share2 size={14} /> Share</a>
                <button onClick={handleShare} className="flex items-center gap-1.5 font-body text-[0.65rem] text-ruh-charcoal/50 hover:text-ruh-charcoal"><Copy size={14} /> Copy Link</button>
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-ruh-mist">
            <h2 className="font-heading italic text-2xl text-ruh-forest mb-8">From the Same Collection</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">{related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}</div>
          </section>
        )}
      </main>

      {showStickyBar && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-ruh-forest h-16 flex items-center justify-between px-4">
          <div className="min-w-0"><p className="font-body text-xs text-ruh-cream/80 truncate">{product.name}</p><p className="font-body text-sm text-ruh-cream font-medium">₹{product.price.toLocaleString("en-IN")}</p></div>
          <button onClick={handleAddToCart} className="bg-ruh-gold text-ruh-forest font-body text-[0.65rem] uppercase tracking-wider px-6 py-3 min-h-[44px]">Add to Bag</button>
        </div>
      )}
    </>
  );
}