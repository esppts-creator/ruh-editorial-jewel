import { useSearchParams } from "react-router-dom";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/products";

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

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get("category");
  const [sortBy, setSortBy] = useState("newest");

  const filtered = useMemo(() => {
    let result = categoryFilter
      ? products.filter((p) => p.category === categoryFilter)
      : products;

    if (sortBy === "price-asc") result = [...result].sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") result = [...result].sort((a, b) => b.price - a.price);

    return result;
  }, [categoryFilter, sortBy]);

  return (
    <div className="min-h-screen pt-24 md:pt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-12"
        >
          <h1 className="font-heading text-3xl md:text-5xl mb-2">
            {categoryFilter ? categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1) : "All Collections"}
          </h1>
          <p className="font-body text-sm text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
          </p>
        </motion.div>

        {/* Sort */}
        <div className="flex justify-end mb-8">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="font-body text-xs tracking-wider uppercase bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent/50"
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {filtered.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              image={productImages[product.id] || ""}
              index={i}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
