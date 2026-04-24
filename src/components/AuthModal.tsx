import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function AuthModal() {
  const { isAuthModalOpen, authModalView, closeAuthModal, signIn, signUp, signInWithGoogle, openAuthModal } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (authModalView === "signin") await signIn(email, password);
      else await signUp(name, email, password);
    } catch {} finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try { await signInWithGoogle(); } finally { setLoading(false); }
  };

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[90]" onClick={closeAuthModal} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] w-full max-w-[400px] bg-white p-10 mx-4 max-h-[90vh] overflow-y-auto">
            <button onClick={closeAuthModal} className="absolute top-4 right-4 min-w-[44px] min-h-[44px] flex items-center justify-center text-ruh-charcoal/60 hover:text-ruh-charcoal" aria-label="Close">
              <X size={18} />
            </button>
            <h2 className="font-heading italic text-2xl text-ruh-forest mb-6">
              {authModalView === "signin" ? "Welcome back to RUH" : "Join the Circle"}
            </h2>

            <button type="button" onClick={handleGoogle} disabled={loading}
              className="w-full h-[48px] border border-ruh-mist text-ruh-charcoal font-body text-[0.75rem] uppercase tracking-[0.15em] hover:bg-ruh-mist/40 transition-colors flex items-center justify-center gap-3 disabled:opacity-50">
              <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Continue with Google
            </button>

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-ruh-mist" />
              <span className="font-body text-xs text-ruh-charcoal/40">or</span>
              <div className="flex-1 h-px bg-ruh-mist" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {authModalView === "signup" && (
                <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required
                  className="w-full border-b border-ruh-mist bg-transparent font-body text-[0.85rem] text-ruh-charcoal py-3 focus:border-ruh-forest focus:outline-none transition-colors placeholder:text-ruh-charcoal/30" />
              )}
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full border-b border-ruh-mist bg-transparent font-body text-[0.85rem] text-ruh-charcoal py-3 focus:border-ruh-forest focus:outline-none transition-colors placeholder:text-ruh-charcoal/30" />
              <input type="password" placeholder="Password (min 6 chars)" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
                className="w-full border-b border-ruh-mist bg-transparent font-body text-[0.85rem] text-ruh-charcoal py-3 focus:border-ruh-forest focus:outline-none transition-colors placeholder:text-ruh-charcoal/30" />
              <button type="submit" disabled={loading}
                className="w-full h-[48px] bg-ruh-forest text-ruh-cream font-body text-[0.75rem] uppercase tracking-[0.15em] hover:bg-ruh-forest/90 transition-colors disabled:opacity-50">
                {loading ? "..." : authModalView === "signin" ? "Sign In" : "Create Account"}
              </button>
            </form>

            <button onClick={() => openAuthModal(authModalView === "signin" ? "signup" : "signin")}
              className="w-full font-body text-[0.7rem] text-ruh-charcoal/60 underline hover:text-ruh-charcoal mt-5">
              {authModalView === "signin" ? "Don't have an account? Create one" : "Already have an account? Sign in"}
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
