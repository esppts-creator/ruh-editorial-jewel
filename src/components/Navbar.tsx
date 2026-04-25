import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Menu, X, Instagram, User as UserIcon, LogOut, Package, ShieldCheck, Search } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { motion, AnimatePresence } from "framer-motion";
import SearchOverlay from "@/components/SearchOverlay";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);
  const { itemCount, openDrawer } = useCart();
  const { user, profile, isAdmin, openAuthModal, signOut } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) setAccountOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const textColor = scrolled ? "text-ruh-forest" : "text-ruh-cream";
  const logoColor = scrolled ? "text-ruh-forest" : "text-ruh-cream";
  const displayName = profile?.full_name || user?.email?.split("@")[0] || "Account";

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-[250ms] ease-out ${scrolled ? "bg-ruh-cream/95 backdrop-blur-sm shadow-sm" : "bg-transparent"}`}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[60px] md:h-[72px]">
            <Link to="/" className="flex flex-col leading-none">
              <span className={`font-heading italic text-xl md:text-2xl tracking-wider ${logoColor} transition-colors duration-[250ms]`}>RUH</span>
              <span className={`font-body text-[0.55rem] tracking-[0.15em] uppercase ${logoColor} transition-colors duration-[250ms] opacity-70`}>by Ruhi</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link to="/about" className={`font-body text-xs tracking-[0.15em] uppercase ${textColor} hover:opacity-70 transition-all duration-200`}>About</Link>
              <button
                onClick={() => setSearchOpen(true)}
                className={`${textColor} hover:opacity-70 transition-all duration-200 min-w-[36px] min-h-[36px] flex items-center justify-center`}
                aria-label="Search products"
              >
                <Search size={18} strokeWidth={1.5} />
              </button>
              <div className="relative" ref={accountRef}>
                <button
                  onClick={() => user ? setAccountOpen(o => !o) : openAuthModal("signin")}
                  className={`font-body text-xs tracking-[0.15em] uppercase ${textColor} hover:opacity-70 transition-all duration-200 flex items-center gap-1.5`}
                >
                  {user ? displayName : "Account"}
                </button>
                <AnimatePresence>
                  {accountOpen && user && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-3 w-48 bg-white shadow-lg border border-ruh-mist py-2"
                    >
                      <Link to="/orders" onClick={() => setAccountOpen(false)} className="flex items-center gap-2 px-4 py-2 font-body text-xs uppercase tracking-wider text-ruh-charcoal hover:bg-ruh-mist/30">
                        <Package size={14} /> My Orders
                      </Link>
                      {isAdmin && (
                        <Link to="/admin" onClick={() => setAccountOpen(false)} className="flex items-center gap-2 px-4 py-2 font-body text-xs uppercase tracking-wider text-ruh-charcoal hover:bg-ruh-mist/30">
                          <ShieldCheck size={14} /> Admin
                        </Link>
                      )}
                      <button onClick={() => { setAccountOpen(false); signOut(); }} className="w-full flex items-center gap-2 px-4 py-2 font-body text-xs uppercase tracking-wider text-ruh-charcoal hover:bg-ruh-mist/30">
                        <LogOut size={14} /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <button onClick={openDrawer} className={`relative ${textColor} hover:opacity-70 transition-all duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center`} aria-label="Open cart">
                <ShoppingBag size={20} strokeWidth={1.5} />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-ruh-gold text-ruh-forest text-[10px] flex items-center justify-center font-body font-medium">{itemCount}</span>
                )}
              </button>
            </div>

            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => setSearchOpen(true)}
                className={`${textColor} min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors duration-[250ms]`}
                aria-label="Search products"
              >
                <Search size={20} strokeWidth={1.5} />
              </button>
              <button onClick={openDrawer} className={`relative ${textColor} min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors duration-[250ms]`} aria-label="Open cart">
                <ShoppingBag size={20} strokeWidth={1.5} />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-ruh-gold text-ruh-forest text-[10px] flex items-center justify-center font-body font-medium">{itemCount}</span>
                )}
              </button>
              <button onClick={() => setMobileOpen(true)} className={`${textColor} min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors duration-[250ms]`} aria-label="Open menu">
                <Menu size={22} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            className="fixed inset-0 z-[60] bg-ruh-forest flex flex-col">
            <div className="flex items-center justify-end h-[60px] px-4">
              <button onClick={() => setMobileOpen(false)} className="text-ruh-cream min-w-[44px] min-h-[44px] flex items-center justify-center" aria-label="Close menu">
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center gap-8">
              <Link to="/about" onClick={() => setMobileOpen(false)} className="font-heading italic text-[2.2rem] text-ruh-cream hover:opacity-70 transition-opacity">About</Link>
              {user ? (
                <>
                  <Link to="/orders" onClick={() => setMobileOpen(false)} className="font-heading italic text-[2.2rem] text-ruh-cream hover:opacity-70 transition-opacity">My Orders</Link>
                  {isAdmin && <Link to="/admin" onClick={() => setMobileOpen(false)} className="font-heading italic text-[2.2rem] text-ruh-gold hover:opacity-70 transition-opacity">Admin</Link>}
                  <button onClick={() => { setMobileOpen(false); signOut(); }} className="font-body text-[0.85rem] uppercase tracking-[0.2em] text-ruh-cream/70 hover:text-ruh-cream">Sign Out</button>
                </>
              ) : (
                <button onClick={() => { setMobileOpen(false); openAuthModal("signin"); }} className="font-heading italic text-[2.2rem] text-ruh-cream hover:opacity-70 transition-opacity">Sign In</button>
              )}
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-ruh-cream hover:opacity-70 transition-opacity mt-4">
                <Instagram size={24} strokeWidth={1.5} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
