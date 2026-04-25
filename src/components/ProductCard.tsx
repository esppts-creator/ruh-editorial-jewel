import { Link } from "react-router-dom";
import { Product } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { motion } from "framer-motion";
import { toast } from "sonner";
import SmartImage from "@/components/SmartImage";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast(`${product.name} added to bag`, {
      duration: 2500,
      position: "bottom-center",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
    >
      <Link to={`/products/${product.slug}`} className="group block">
        <div className="relative mb-3">
          <SmartImage
            src={product.images[0]}
            alt={product.name}
            wrapperClassName="aspect-[3/4]"
            width={400}
            height={533}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
          />
          {/* Badges */}
          {product.stock < 5 && (
            <span className="absolute top-3 left-3 bg-ruh-gold text-white text-[0.55rem] uppercase tracking-widest px-2 py-0.5 font-body">
              Limited
            </span>
          )}
          {product.isNew && (
            <span className="absolute top-3 right-3 bg-ruh-forest text-ruh-cream text-[0.55rem] uppercase tracking-widest px-2 py-0.5 font-body">
              New
            </span>
          )}
          {/* Add to Bag - desktop hover, mobile always visible */}
          <motion.button
            onClick={handleAddToCart}
            className="absolute bottom-0 left-0 right-0 bg-ruh-forest text-ruh-cream h-9 font-body text-[0.65rem] uppercase tracking-[0.15em] opacity-100 md:opacity-0 md:translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-200 ease-out min-h-[44px] flex items-center justify-center"
          >
            Add to Bag
          </motion.button>
        </div>
        <div className="px-1 py-2 space-y-0.5">
          <p className="font-body text-[0.55rem] md:text-[0.6rem] uppercase tracking-[0.15em] text-ruh-copper">
            {product.category === "ring" ? "Ring" : "Earring"} · {product.collection}
          </p>
          <h3 className="font-heading text-[0.82rem] md:text-[0.95rem] font-semibold text-ruh-charcoal leading-tight">{product.name}</h3>
          <p className="font-body text-[0.65rem] md:text-[0.7rem] text-ruh-charcoal/60 hidden md:block">{product.metal}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-body text-[0.8rem] md:text-[0.9rem] text-ruh-forest font-medium">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {product.mrp && (
              <span className="font-body text-[0.65rem] md:text-[0.75rem] text-ruh-charcoal/40 line-through">
                ₹{product.mrp.toLocaleString("en-IN")}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
