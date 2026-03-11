import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <h1 className="font-heading text-3xl mb-4">Your Cart is Empty</h1>
          <p className="font-body text-sm text-muted-foreground mb-8">Discover our handmade collections.</p>
          <Link
            to="/products"
            className="inline-block bg-primary text-primary-foreground font-body text-xs tracking-[0.2em] uppercase px-8 py-4 rounded-lg"
          >
            Shop Now
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 md:pt-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <h1 className="font-heading text-3xl md:text-4xl mb-12">Your Cart</h1>

        <div className="space-y-6">
          {items.map((item) => (
            <motion.div
              key={item.product.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex gap-4 md:gap-6 border-b border-border pb-6"
            >
              <Link to={`/product/${item.product.slug}`} className="w-20 h-24 md:w-28 md:h-36 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                <img src={item.image} alt={item.product.name} className="w-full h-full object-cover" />
              </Link>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <p className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground">{item.product.collection}</p>
                  <h3 className="font-heading text-base md:text-lg">{item.product.name}</h3>
                  <p className="font-body text-sm text-accent mt-1">₹ {item.product.price.toLocaleString("en-IN")}</p>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-3 border border-border rounded-lg">
                    <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="p-2 hover:bg-muted transition-colors rounded-l-lg">
                      <Minus size={14} />
                    </button>
                    <span className="font-body text-sm w-6 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="p-2 hover:bg-muted transition-colors rounded-r-lg">
                      <Plus size={14} />
                    </button>
                  </div>
                  <button onClick={() => removeFromCart(item.product.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 border-t border-border pt-8">
          <div className="flex justify-between items-center mb-6">
            <span className="font-body text-sm uppercase tracking-wider text-muted-foreground">Subtotal</span>
            <span className="font-heading text-2xl">₹ {total.toLocaleString("en-IN")}</span>
          </div>
          <Link
            to="/checkout"
            className="block w-full text-center py-4 rounded-lg bg-primary text-primary-foreground font-body text-xs tracking-[0.2em] uppercase hover:bg-primary/90 transition-colors"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
