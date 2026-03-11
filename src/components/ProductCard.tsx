import { Link } from "react-router-dom";
import { Product } from "@/lib/products";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
  image: string;
  index?: number;
}

export default function ProductCard({ product, image, index = 0 }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link to={`/product/${product.slug}`} className="group block">
        <div className="overflow-hidden rounded-lg bg-muted aspect-[3/4] mb-4">
          <img
            src={image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        <div className="space-y-1">
          <p className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
            {product.collection}
          </p>
          <h3 className="font-heading text-base">{product.name}</h3>
          <p className="font-body text-sm text-accent font-medium">₹ {product.price.toLocaleString("en-IN")}</p>
        </div>
      </Link>
    </motion.div>
  );
}
