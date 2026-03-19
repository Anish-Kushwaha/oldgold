import { Link, useLocation } from "react-router-dom";
import { Home, ShoppingBag, Tag, LifeBuoy, UserCircle } from "lucide-react";

const navItems = [
  { label: "Home", path: "/", icon: Home },
  { label: "Buy", path: "/buy", icon: ShoppingBag },
  { label: "Sell", path: "/sell", icon: Tag },
  { label: "Support", path: "/support", icon: LifeBuoy },
  { label: "Contact", path: "/contact", icon: UserCircle },
];

const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-primary/20 safe-bottom">
      <div className="flex items-center justify-around py-1.5">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-all ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              <item.icon className={`h-5 w-5 ${isActive ? "stroke-[2.5] drop-shadow-[0_0_6px_hsl(38_72%_50%/0.4)]" : ""}`} />
              <span className="text-[10px] font-display font-semibold tracking-wide">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
