import { Github, Linkedin, Youtube, Twitter, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-accent text-accent-foreground/70 mt-auto">
      {/* Secondary Nav */}
      <div className="container py-6 flex flex-wrap items-center justify-center gap-6 text-sm font-display">
        <a href="/" className="hover:text-gold-light transition-colors tracking-wide">Home</a>
        <a href="/buy" className="hover:text-gold-light transition-colors tracking-wide">Buy</a>
        <a href="/sell" className="hover:text-gold-light transition-colors tracking-wide">Sell</a>
        <a href="/support" className="hover:text-gold-light transition-colors tracking-wide">Support</a>
        <a href="/contact" className="hover:text-gold-light transition-colors tracking-wide">Contact</a>
      </div>
      <div className="border-t border-accent-foreground/10">
        <div className="container py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <a href="https://github.com/Anish-Kushwaha" target="_blank" rel="noopener noreferrer" className="hover:text-gold-light transition-colors"><Github className="h-5 w-5" /></a>
            <a href="https://www.linkedin.com/in/anish-kushwaha-43a915383" target="_blank" rel="noopener noreferrer" className="hover:text-gold-light transition-colors"><Linkedin className="h-5 w-5" /></a>
            <a href="https://x.com/Anish_Kushwaha_" target="_blank" rel="noopener noreferrer" className="hover:text-gold-light transition-colors"><Twitter className="h-5 w-5" /></a>
            <a href="https://www.youtube.com/@cosmologist_anish" target="_blank" rel="noopener noreferrer" className="hover:text-gold-light transition-colors"><Youtube className="h-5 w-5" /></a>
            <a href="mailto:Anish-Kushwaha@zohomail.in" className="hover:text-gold-light transition-colors"><Mail className="h-5 w-5" /></a>
          </div>
          <p className="text-xs">
            <a href="https://Anish-kushwaha.online" target="_blank" rel="noopener noreferrer" className="hover:text-gold-light transition-colors">
              © 2026 Anish Kushwaha • All rights reserved
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
