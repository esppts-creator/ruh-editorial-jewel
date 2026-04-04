import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-ruh-charcoal text-ruh-cream/70 pt-16 pb-8 px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="mb-4"><span className="font-heading italic text-2xl text-ruh-cream">RUH</span><p className="font-body text-[0.6rem] tracking-[0.15em] uppercase text-ruh-cream/50 mt-0.5">by Ruhi</p></div>
            <p className="font-body text-sm text-ruh-cream/50 leading-relaxed max-w-[280px]">Handcrafted jewellery rooted in Indian heritage. Each piece tells a story of Gond tribal artistry reimagined for modern wear.</p>
          </div>
          <div>
            <h4 className="font-body text-[0.65rem] uppercase tracking-[0.15em] text-ruh-cream/40 mb-4">Shop</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="font-body text-sm hover:text-ruh-cream transition-colors">All Products</Link></li>
              <li><Link to="/?category=ring" className="font-body text-sm hover:text-ruh-cream transition-colors">Rings</Link></li>
              <li><Link to="/?category=earring" className="font-body text-sm hover:text-ruh-cream transition-colors">Earrings</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-body text-[0.65rem] uppercase tracking-[0.15em] text-ruh-cream/40 mb-4">Company</h4>
            <ul className="space-y-3">
              <li><Link to="/about" className="font-body text-sm hover:text-ruh-cream transition-colors">About RUH</Link></li>
              <li><Link to="/about" className="font-body text-sm hover:text-ruh-cream transition-colors">Our Story</Link></li>
              <li><Link to="/about" className="font-body text-sm hover:text-ruh-cream transition-colors">Artisan Partners</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-body text-[0.65rem] uppercase tracking-[0.15em] text-ruh-cream/40 mb-4">Support</h4>
            <ul className="space-y-3">
              <li><span className="font-body text-sm cursor-pointer hover:text-ruh-cream transition-colors">Shipping Policy</span></li>
              <li><span className="font-body text-sm cursor-pointer hover:text-ruh-cream transition-colors">Returns</span></li>
              <li><a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer" className="font-body text-sm hover:text-ruh-cream transition-colors">Contact (WhatsApp)</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-ruh-cream/10 pt-6"><p className="font-body text-[0.65rem] text-ruh-cream/40 text-center tracking-wider">© 2026 RUH by Ruhi. Made with love in India. ✦ All pieces handcrafted.</p></div>
      </div>
    </footer>
  );
}
