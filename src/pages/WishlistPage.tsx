import { Link } from "react-router-dom";
import { Heart, Trash2, ShoppingCart, ArrowLeft, Package } from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";

const WishlistPage = () => {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart, isInCart } = useCart();

  const handleAddToCart = (item: typeof items[0]) => {
    addToCart({ id: item.id, name: item.name, price: item.price, discount_price: item.discount_price, image_url: item.image_url, seller_id: "" });
    toast.success("Added to cart!");
  };

  if (items.length === 0) {
    return (
      <div className="animate-fade-in">
        <div className="container py-16 text-center max-w-lg mx-auto">
          <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold mb-2">Your Wishlist is Empty</h2>
          <p className="text-muted-foreground mb-6">Save items you love and come back to them later.</p>
          <Link to="/buy" className="inline-flex items-center gap-2 gold-gradient text-primary-foreground font-display font-semibold px-6 py-2.5 rounded-lg">
            <ArrowLeft className="h-4 w-4" /> Browse Items
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="bg-card border-b border-border">
        <div className="container py-6">
          <h2 className="font-display text-2xl font-bold flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" /> Wishlist ({items.length} items)
          </h2>
        </div>
      </div>
      <div className="container py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map(item => (
            <div key={item.id} className="bg-card rounded-lg border border-border overflow-hidden group">
              <Link to={`/buy?item=${item.id}`} className="block bg-secondary h-40 flex items-center justify-center">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <Package className="h-10 w-10 text-muted-foreground" />
                )}
              </Link>
              <div className="p-4">
                <Link to={`/buy?item=${item.id}`}>
                  <h4 className="font-display font-semibold text-sm mb-1 group-hover:text-primary transition-colors">{item.name}</h4>
                </Link>
                <p className="text-xs text-muted-foreground mb-2">{item.condition} · {item.category}</p>
                <p className="font-display font-bold text-primary text-lg mb-3">₹{item.price.toLocaleString("en-IN")}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddToCart(item)}
                    disabled={isInCart(item.id)}
                    className="flex-1 flex items-center justify-center gap-1 text-xs font-semibold py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity"
                  >
                    <ShoppingCart className="h-3.5 w-3.5" /> {isInCart(item.id) ? "In Cart" : "Add to Cart"}
                  </button>
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="p-2 rounded-md border border-border hover:bg-destructive/10 text-destructive transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
