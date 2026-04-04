import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { X, Minus, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function CartDrawer() {
  const { items, removeFromCart, updateQuantity, total, itemCount, isDrawerOpen, closeDrawer } = useCart();
  const { user, openAuthModal } = useAuth();
  const navigate = useNavigate();

  const shippingThreshold = 999;
  const remaining = Math.max(0, shippingThreshold - total);
  const shippingProgress = Math.min(100, (total / shippingThreshold) * 100);

  const handleCheckout = () => {
    if (!user) {
      openAuthModal("signin");
      return;
    }
    closeDrawer();
    navigate("/checkout");
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/40 z-[70]"
            onClick={closeDrawer}
          />
          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-[400px] bg-ruh-cream z-[80] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-ruh-mist">
              <h2 className="font-heading italic text-xl text-ruh-forest">
                Your Bag ({itemCount})
              </h2>
              <button
                onClick={closeDrawer}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center text-ruh-charcoal hover:opacity-70 transition-opacity"
                aria-label="Close cart"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <p className="font-heading italic text-lg text-ruh-charcoal/50 mb-2">Your bag is empty</p>
                  <p className="font-body text-sm text-ruh-charcoal/40">Explore our collection to find your piece.</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Free shipping nudge */}
                  {total < shippingThreshold && total > 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded p-3">
                      <p className="font-body text-sm text-ruh-charcoal">
                        Add ₹{remaining.toLocaleString("en-IN")} more for free shipping!
                      </p>
                      <div className="mt-2 h-1 bg-amber-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-ruh-gold rounded-full transition-all duration-300"
                          style={{ width: `${shippingProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-4">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-20 h-[100px] object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-[0.7rem] uppercase tracking-[0.1em] text-ruh-copper">
                          {item.product.category === "ring" ? "Ring" : "Earring"}
                        </p>
                        <p className="font-body text-sm text-ruh-charcoal truncate">{item.product.name}</p>
                        <p className="font-body text-[0.7rem] text-ruh-charcoal/50">{item.product.metal}</p>
                        <p className="font-body text-[0.85rem] text-ruh-forest font-medium mt-1">
                          ₹{item.product.price.toLocaleString("en-IN")}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center border border-ruh-mist">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-ruh-mist transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-8 h-8 flex items-center justify-center font-body text-sm">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-ruh-mist transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="font-body text-[0.65rem] text-ruh-charcoal/50 underline hover:text-ruh-charcoal transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-ruh-mist">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-body text-[0.75rem] uppercase tracking-[0.1em] text-ruh-charcoal">Subtotal</span>
                  <span className="font-body text-base text-ruh-forest font-medium">
                    ₹{total.toLocaleString("en-IN")}
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full h-[52px] bg-ruh-forest text-ruh-cream font-body text-[0.75rem] uppercase tracking-[0.15em] hover:bg-ruh-forest/90 transition-colors"
                >
                  {user ? "Checkout" : "Sign In to Checkout"}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
