import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Heart, GitCompareArrows } from "lucide-react";
import logo from "@/assets/Logo.png";
import DarkModeToggle from "./DarkModeToggle";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useCompare } from "@/hooks/useCompare";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Buy", path: "/buy" },
  { label: "Sell", path: "/sell" },
  { label: "Support", path: "/support" },
  { label: "Contact", path: "/contact" },
];

const Header = () => {
  const location = useLocation();
  const { totalItems: cartCount } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const { totalItems: compareCount } = useCompare();

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-primary/20">
      <div className="container flex items-center gap-3 py-2">
        <img src={logo} alt="OldGold Logo" className="h-10 w-10 rounded-full object-cover ring-2 ring-primary/30" />
        <div className="flex-1">
          <h1 className="font-display text-lg font-bold gold-text leading-none tracking-wide">OldGold</h1>
          <p className="text-[10px] text-muted-foreground tracking-widest uppercase">Luxury Vintage & Collectibles</p>
        </div>
        <div className="flex items-center gap-1">
          <DarkModeToggle />
          <Link to="/wishlist" className="relative p-2 rounded-lg hover:bg-secondary transition-colors">
            <Heart className="h-4 w-4 text-muted-foreground" />
            {wishlistCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">{wishlistCount}</span>}
          </Link>
          <Link to="/compare" className="relative p-2 rounded-lg hover:bg-secondary transition-colors">
            <GitCompareArrows className="h-4 w-4 text-muted-foreground" />
            {compareCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">{compareCount}</span>}
          </Link>
          <Link to="/cart" className="relative p-2 rounded-lg hover:bg-secondary transition-colors">
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            {cartCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full gold-gradient text-primary-foreground text-[10px] font-bold flex items-center justify-center">{cartCount}</span>}
          </Link>
        </div>
      </div>
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
