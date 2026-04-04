import { Link } from "react-router-dom";
const NotFound = () => (
  <main className="min-h-screen flex flex-col items-center justify-center bg-ruh-cream px-6">
    <h1 className="font-heading italic text-[3rem] text-ruh-forest mb-4">404</h1>
    <p className="font-body font-light text-ruh-charcoal/60 mb-8">This page doesn't exist.</p>
    <Link to="/" className="bg-ruh-forest text-ruh-cream font-body text-[0.7rem] uppercase tracking-wider px-6 py-3 hover:bg-ruh-forest/90 transition-colors">Return Home</Link>
  </main>
);
export default NotFound;
