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
      <div className="container flex items-center gap-4 py-4">
        <img src={logo} alt="OldGold Logo" className="h-14 w-14 rounded-full object-cover" />
        <div>
          <h1 className="font-display text-2xl font-bold text-primary leading-none">OldGold</h1>
          <p className="text-xs text-muted-foreground">Luxury Vintage & Collectibles</p>
        </div>
      </div>
      {/* Navigation */}
      <nav className="bg-foreground">
        <div className="container flex items-center gap-1 overflow-x-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-5 py-3 text-sm font-display font-semibold tracking-wide transition-colors ${
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
