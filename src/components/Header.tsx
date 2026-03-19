import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/Logo.png";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Buy", path: "/buy" },
  { label: "Sell", path: "/sell" },
  { label: "Support", path: "/support" },
  { label: "Contact", path: "/contact" },
];

const Header = () => {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-primary/20">
      {/* Brand Bar */}
      <div className="container flex items-center gap-3 py-2">
        <img src={logo} alt="OldGold Logo" className="h-10 w-10 rounded-full object-cover ring-2 ring-primary/30" />
        <div>
          <h1 className="font-display text-lg font-bold gold-text leading-none tracking-wide">OldGold</h1>
          <p className="text-[10px] text-muted-foreground tracking-widest uppercase">Luxury Vintage & Collectibles</p>
        </div>
      </div>
      {/* Navigation */}
      <nav className="gold-gradient">
        <div className="container flex items-center gap-0.5 overflow-x-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3 py-1.5 text-xs font-display font-semibold tracking-wider transition-all ${
                location.pathname === item.path
                  ? "bg-background/95 text-foreground"
                  : "text-primary-foreground/90 hover:text-primary-foreground hover:bg-background/10"
              }`}
            >
              {item.label.toUpperCase()}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Header;
