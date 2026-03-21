import { Link } from "react-router-dom";
import { ShoppingCart, Trash2, Plus, Minus, MessageCircle, ArrowLeft, Package } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const CartPage = () => {
  const { items, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } = useCart();
  const [sellerPhones, setSellerPhones] = useState<Record<string, string>>({});

  useEffect(() => {
    const sellerIds = [...new Set(items.map(i => i.seller_id))];
    if (sellerIds.length === 0) return;
    const fetchSellers = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id, whatsapp, phone")
        .in("id", sellerIds);
      if (data) {
        const map: Record<string, string> = {};
        data.forEach(s => { map[s.id] = s.whatsapp || s.phone || ""; });
        setSellerPhones(map);
      }
    };
    fetchSellers();
  }, [items]);

  const handleBulkInquiry = () => {
    const grouped: Record<string, typeof items> = {};
    items.forEach(item => {
      if (!grouped[item.seller_id]) grouped[item.seller_id] = [];
      grouped[item.seller_id].push(item);
    });

    Object.entries(grouped).forEach(([sellerId, sellerItems]) => {
      const phone = sellerPhones[sellerId]?.replace(/[^0-9]/g, "");
      if (!phone) { toast.error("Seller contact not available for some items"); return; }
      const msg = `Hi! I'm interested in these items from OldGold:\n${sellerItems.map(i => `• ${i.name} (₹${i.price}) x${i.quantity}`).join("\n")}\n\nTotal: ₹${sellerItems.reduce((s, i) => s + i.price * i.quantity, 0).toLocaleString("en-IN")}`;
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, "_blank");
    });
  };

  if (items.length === 0) {
    return (
      <div className="animate-fade-in">
        <div className="container py-16 text-center max-w-lg mx-auto">
          <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold mb-2">Your Cart is Empty</h2>
          <p className="text-muted-foreground mb-6">Browse our listings and add items you're interested in.</p>
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
            <ShoppingCart className="h-6 w-6 text-primary" /> Cart ({totalItems} items)
          </h2>
        </div>
      </div>
      <div className="container py-6 max-w-2xl mx-auto space-y-4">
        {items.map(item => (
          <div key={item.id} className="flex gap-4 p-4 bg-card rounded-lg border border-border">
            <Link to={`/buy?item=${item.id}`} className="w-20 h-20 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
              {item.image_url ? (
                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center"><Package className="h-8 w-8 text-muted-foreground" /></div>
              )}
            </Link>
            <div className="flex-1 min-w-0">
              <Link to={`/buy?item=${item.id}`} className="font-display font-semibold text-sm hover:text-primary transition-colors">{item.name}</Link>
              <div className="flex items-center gap-2 mt-1">
                {item.discount_price ? (
                  <>
                    <span className="font-display font-bold text-primary">₹{item.discount_price.toLocaleString("en-IN")}</span>
                    <span className="text-xs text-muted-foreground line-through">₹{item.price.toLocaleString("en-IN")}</span>
                  </>
                ) : (
                  <span className="font-display font-bold text-primary">₹{item.price.toLocaleString("en-IN")}</span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 rounded-md border border-border hover:bg-secondary transition-colors">
                  <Minus className="h-3 w-3" />
                </button>
                <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 rounded-md border border-border hover:bg-secondary transition-colors">
                  <Plus className="h-3 w-3" />
                </button>
                <button onClick={() => removeFromCart(item.id)} className="ml-auto p-1.5 rounded-md hover:bg-destructive/10 text-destructive transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        <div className="bg-card rounded-lg border border-border p-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal ({totalItems} items)</span>
            <span className="font-display font-bold">₹{totalPrice.toLocaleString("en-IN")}</span>
          </div>
          <div className="h-px bg-border" />
          <div className="flex justify-between">
            <span className="font-display font-semibold">Total</span>
            <span className="font-display font-bold text-primary text-xl">₹{totalPrice.toLocaleString("en-IN")}</span>
          </div>
          <button
            onClick={handleBulkInquiry}
            className="w-full flex items-center justify-center gap-2 gold-gradient text-primary-foreground font-display font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            <MessageCircle className="h-5 w-5" /> Inquire via WhatsApp
          </button>
          <button onClick={clearCart} className="w-full text-sm text-muted-foreground hover:text-destructive transition-colors py-1">
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
