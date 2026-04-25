import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Search, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { products as staticProducts } from "@/lib/products";

interface Result {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  image: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ open, onClose }: Props) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const fallback = useMemo<Result[]>(
    () =>
      staticProducts.map((p) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        category: p.category,
        price: p.price,
        image: p.images[0],
      })),
    [],
  );

  useEffect(() => {
    if (open) {
      setQ("");
      setResults([]);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const term = q.trim();
    if (!term) {
      setResults([]);
      return;
    }
    setLoading(true);
    const handle = setTimeout(async () => {
      const like = `%${term}%`;
      const { data, error } = await supabase
        .from("products")
        .select("id, slug, name, category, price, images")
        .eq("is_active", true)
        .or(`name.ilike.${like},category.ilike.${like},collection.ilike.${like},description.ilike.${like}`)
        .limit(8);

      let next: Result[] = [];
      if (!error && data && data.length) {
        next = data.map((p: any) => ({
          id: p.id,
          slug: p.slug,
          name: p.name,
          category: p.category,
          price: Number(p.price),
          image: (p.images || [])[0] || "",
        }));
      } else {
        const lower = term.toLowerCase();
        next = fallback
          .filter(
            (p) =>
              p.name.toLowerCase().includes(lower) ||
              p.category.toLowerCase().includes(lower),
          )
          .slice(0, 8);
      }
      setResults(next);
      setLoading(false);
    }, 220);
    return () => clearTimeout(handle);
  }, [q, open, fallback]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[80] bg-ruh-charcoal/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
            className="bg-ruh-cream w-full max-w-[760px] mx-auto mt-[60px] md:mt-[100px] mx-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-ruh-mist px-4 md:px-6 py-4">
              <Search size={18} className="text-ruh-forest/70 flex-shrink-0" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search rings, earrings, collections…"
                className="flex-1 bg-transparent outline-none font-body text-base md:text-lg text-ruh-charcoal placeholder:text-ruh-charcoal/40"
                aria-label="Search products"
              />
              {loading && <Loader2 size={16} className="animate-spin text-ruh-forest/60" />}
              <button
                onClick={onClose}
                className="text-ruh-charcoal/60 hover:text-ruh-charcoal min-w-[36px] min-h-[36px] flex items-center justify-center"
                aria-label="Close search"
              >
                <X size={18} />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {!q.trim() && (
                <div className="px-4 md:px-6 py-6">
                  <p className="font-body text-[0.65rem] uppercase tracking-[0.2em] text-ruh-charcoal/50 mb-3">
                    Popular
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["rings", "earrings", "Adiva", "hoops", "studs"].map((s) => (
                      <button
                        key={s}
                        onClick={() => setQ(s)}
                        className="px-3 py-1.5 border border-ruh-forest text-ruh-forest font-body text-[0.7rem] uppercase tracking-wider hover:bg-ruh-forest hover:text-ruh-cream transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {q.trim() && !loading && results.length === 0 && (
                <div className="px-4 md:px-6 py-10 text-center font-body text-sm text-ruh-charcoal/60">
                  No matches for "{q}".
                </div>
              )}

              {results.length > 0 && (
                <ul className="divide-y divide-ruh-mist">
                  {results.map((r) => (
                    <li key={r.id}>
                      <Link
                        to={`/products/${r.slug}`}
                        onClick={onClose}
                        className="flex items-center gap-4 px-4 md:px-6 py-3 hover:bg-ruh-mist/40 transition-colors"
                      >
                        <img
                          src={r.image}
                          alt={r.name}
                          className="w-14 h-16 object-cover bg-ruh-mist flex-shrink-0"
                          loading="lazy"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-body text-sm text-ruh-charcoal truncate">{r.name}</p>
                          <p className="font-body text-[0.65rem] uppercase tracking-wider text-ruh-charcoal/50 mt-0.5">
                            {r.category}
                          </p>
                        </div>
                        <p className="font-body text-sm text-ruh-forest flex-shrink-0">
                          ₹{r.price.toLocaleString("en-IN")}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}