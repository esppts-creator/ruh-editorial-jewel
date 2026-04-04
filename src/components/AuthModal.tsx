import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function AuthModal() {
  const { isAuthModalOpen, authModalView, closeAuthModal, signIn, signUp, openAuthModal } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (authModalView === "signin") {
        await signIn(email, password);
      } else {
        await signUp(name, email, password);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[90]"
            onClick={closeAuthModal}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] w-full max-w-[400px] bg-white p-12 mx-4"
          >
            <button
              onClick={closeAuthModal}
              className="absolute top-4 right-4 min-w-[44px] min-h-[44px] flex items-center justify-center text-ruh-charcoal/60 hover:text-ruh-charcoal"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <h2 className="font-heading italic text-2xl text-ruh-forest mb-8">
              {authModalView === "signin" ? "Welcome back to RUH" : "Join the Circle"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {authModalView === "signup" && (
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full border-b border-ruh-mist bg-transparent font-body text-[0.85rem] text-ruh-charcoal py-3 focus:border-ruh-forest focus:outline-none transition-colors placeholder:text-ruh-charcoal/30"
                />
              )}
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border-b border-ruh-mist bg-transparent font-body text-[0.85rem] text-ruh-charcoal py-3 focus:border-ruh-forest focus:outline-none transition-colors placeholder:text-ruh-charcoal/30"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border-b border-ruh-mist bg-transparent font-body text-[0.85rem] text-ruh-charcoal py-3 focus:border-ruh-forest focus:outline-none transition-colors placeholder:text-ruh-charcoal/30"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full h-[48px] bg-ruh-forest text-ruh-cream font-body text-[0.75rem] uppercase tracking-[0.15em] hover:bg-ruh-forest/90 transition-colors disabled:opacity-50"
              >
                {loading ? "..." : authModalView === "signin" ? "Sign In" : "Create Account"}
              </button>
            </form>

            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-ruh-mist" />
              <span className="font-body text-xs text-ruh-charcoal/40">or</span>
              <div className="flex-1 h-px bg-ruh-mist" />
            </div>

            <button
              onClick={() => openAuthModal(authModalView === "signin" ? "signup" : "signin")}
              className="w-full h-[48px] border border-ruh-forest text-ruh-forest font-body text-[0.75rem] uppercase tracking-[0.15em] hover:bg-ruh-forest hover:text-ruh-cream transition-colors"
            >
              {authModalView === "signin" ? "Create Account" : "Sign In Instead"}
            </button>

            {authModalView === "signin" && (
              <p className="font-body text-[0.7rem] text-ruh-charcoal/40 text-center mt-4 cursor-pointer hover:text-ruh-charcoal/60">
                Forgot password?
              </p>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
