import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Menu, X, Instagram } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount, openDrawer } = useCart();
  const { user, openAuthModal } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const textColor = scrolled ? "text-ruh-forest" : "text-ruh-cream";
  const logoColor = scrolled ? "text-ruh-forest" : "text-ruh-cream";

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-[250ms] ease-out ${
          scrolled
            ? "bg-ruh-cream/95 backdrop-blur-sm shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[60px] md:h-[72px]">
            {/* Logo */}
            <Link to="/" className="flex flex-col leading-none">
              <span className={`font-heading italic text-xl md:text-2xl tracking-wider ${logoColor} transition-colors duration-[250ms]`}>
                RUH
              </span>
              <span className={`font-body text-[0.55rem] tracking-[0.15em] uppercase ${logoColor} transition-colors duration-[250ms] opacity-70`}>
                by Ruhi
              </span>
            </Link>

            {/* Desktop right nav */}
            <div className="hidden md:flex items-center gap-8">
              <Link
                to="/about"
                className={`font-body text-xs tracking-[0.15em] uppercase ${textColor} hover:opacity-70 transition-all duration-200`}
              >
                About
              </Link>
              <button
                onClick={() => user ? undefined : openAuthModal("signin")}
                className={`font-body text-xs tracking-[0.15em] uppercase ${textColor} hover:opacity-70 transition-all duration-200`}
              >
                {user ? user.name : "Account"}
              </button>
              <button
                onClick={openDrawer}
                className={`relative ${textColor} hover:opacity-70 transition-all duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center`}
                aria-label="Open cart"
              >
                <ShoppingBag size={20} strokeWidth={1.5} />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-ruh-gold text-ruh-forest text-[10px] flex items-center justify-center font-body font-medium">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile right nav */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={openDrawer}
                className={`relative ${textColor} min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors duration-[250ms]`}
                aria-label="Open cart"
              >
                <ShoppingBag size={20} strokeWidth={1.5} />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-ruh-gold text-ruh-forest text-[10px] flex items-center justify-center font-body font-medium">
                    {itemCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setMobileOpen(true)}
                className={`${textColor} min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors duration-[250ms]`}
                aria-label="Open menu"
              >
                <Menu size={22} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile full-screen overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            className="fixed inset-0 z-[60] bg-ruh-forest flex flex-col"
          >
            <div className="flex items-center justify-end h-[60px] px-4">
              <button
                onClick={() => setMobileOpen(false)}
                className="text-ruh-cream min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Close menu"
              >
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center gap-10">
              <Link
                to="/about"
                onClick={() => setMobileOpen(false)}
                className="font-heading italic text-[2.5rem] text-ruh-cream hover:opacity-70 transition-opacity"
              >
                About
              </Link>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  if (!user) openAuthModal("signin");
                }}
                className="font-heading italic text-[2.5rem] text-ruh-cream hover:opacity-70 transition-opacity"
              >
                {user ? "Account" : "Sign In"}
              </button>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ruh-cream hover:opacity-70 transition-opacity mt-4"
              >
                <Instagram size={24} strokeWidth={1.5} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
