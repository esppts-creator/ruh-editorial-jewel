import { Link } from "react-router-dom";
import { Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <h3 className="font-heading text-2xl mb-4">RUH</h3>
            <p className="font-body text-sm leading-relaxed opacity-80">
              Indian Craft Reimagined for Today. Handmade jewellery inspired by heritage, ethics, and timeless craftsmanship.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-body text-xs tracking-[0.2em] uppercase mb-6 opacity-60">Quick Links</h4>
            <div className="space-y-3">
              {[
                { label: "Collections", to: "/products" },
                { label: "Earrings", to: "/products?category=earrings" },
                { label: "Rings", to: "/products?category=rings" },
                { label: "About Us", to: "/about" },
              ].map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="block font-body text-sm opacity-80 hover:opacity-100 transition-opacity"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-body text-xs tracking-[0.2em] uppercase mb-6 opacity-60">Connect</h4>
            <a
              href="https://instagram.com/ruhbyruhi"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-body text-sm opacity-80 hover:opacity-100 transition-opacity"
            >
              <Instagram size={16} />
              @ruhbyruhi
            </a>
            <p className="mt-4 font-body text-sm opacity-60">DM for availability</p>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-primary-foreground/20 text-center">
          <p className="font-body text-xs opacity-50 tracking-wider">
            © 2025–2026 RUH by Ruhi Tulsyan. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
