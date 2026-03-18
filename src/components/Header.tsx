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
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      {/* Brand Bar */}
      <div className="container flex items-center gap-3 py-2">
        <img src={logo} alt="OldGold Logo" className="h-10 w-10 rounded-full object-cover" />
        <div>
          <h1 className="font-display text-lg font-bold text-primary leading-none">OldGold</h1>
          <p className="text-[10px] text-muted-foreground">Luxury Vintage & Collectibles</p>
        </div>
      </div>
      {/* Navigation */}
      <nav className="bg-foreground">
        <div className="container flex items-center gap-0.5 overflow-x-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3 py-1.5 text-xs font-display font-semibold tracking-wide transition-colors ${
                location.pathname === item.path
                  ? "bg-primary text-primary-foreground"
                  : "text-background/80 hover:text-background hover:bg-primary/20"
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
