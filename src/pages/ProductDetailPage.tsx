import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { products } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";

import imgHoop from "@/assets/product-hoop-earring.webp";
import img25pEar from "@/assets/product-25p-earring.webp";
import img25pRing from "@/assets/product-25p-ring.webp";
import imgKhanak from "@/assets/product-khanak-ring.webp";
import imgSpiral from "@/assets/product-spiral-ring.webp";

const productImages: Record<string, string> = {
  "1": imgHoop,
  "2": img25pEar,
  "3": imgHoop,
  "4": img25pRing,
  "5": img25pRing,
  "6": imgKhanak,
  "7": imgSpiral,
  "8": imgSpiral,
  "9": imgKhanak,
};

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-2xl mb-4">Product not found</h1>
          <Link to="/products" className="text-accent font-body text-sm underline">Back to Collections</Link>
        </div>
      </div>
    );
  }

  const image = productImages[product.id] || "";

  const handleAddToCart = () => {
    addToCart(product, image);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="min-h-screen pt-20 md:pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft size={14} /> Back to Collections
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="overflow-hidden rounded-lg bg-muted aspect-[3/4]"
          >
            <img
              src={image}
              alt={product.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col justify-center"
          >
            <p className="font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-2">
              {product.collection} · {product.category}
            </p>
            <h1 className="font-heading text-3xl md:text-4xl mb-4">{product.name}</h1>
            <p className="font-heading text-2xl text-accent mb-6">₹ {product.price.toLocaleString("en-IN")}</p>
            <p className="font-body text-sm text-muted-foreground leading-relaxed mb-8">
              {product.description}
            </p>

            <div className="space-y-3 mb-8 font-body text-sm">
              <div className="flex gap-8">
                <span className="text-muted-foreground uppercase tracking-wider text-xs">Metal Type</span>
                <span>{product.metalType}</span>
              </div>
              <div className="flex gap-8">
                <span className="text-muted-foreground uppercase tracking-wider text-xs">Finish</span>
                <span>{product.finish}</span>
              </div>
              <div className="flex gap-8">
                <span className="text-muted-foreground uppercase tracking-wider text-xs">Size</span>
                <span>{product.size}</span>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full py-4 rounded-lg bg-primary text-primary-foreground font-body text-xs tracking-[0.2em] uppercase hover:bg-primary/90 transition-colors"
            >
              Add to Cart
            </button>

            <p className="mt-4 font-body text-xs text-muted-foreground text-center">
              Limited pieces · Statement fit · Stack-friendly
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
