import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Package, Trash2, Copy, CheckCircle, Tag } from "lucide-react";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  price: number;
  discount_price: number | null;
  category: string;
  condition: string;
  description: string | null;
  brand: string | null;
  power_rating: string | null;
  size: string | null;
  is_approved: boolean;
  is_sold: boolean;
  image_url: string | null;
  created_at: string;
  view_count: number;
}

const MyProducts = ({ refreshKey }: { refreshKey: number }) => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("seller_id", user.id)
      .order("created_at", { ascending: false });
    setProducts(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, [user, refreshKey]);

  const deleteProduct = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) toast.error("Failed: " + error.message);
    else { toast.success("Product deleted."); fetchProducts(); }
  };

  const toggleSold = async (id: string, currentlySold: boolean) => {
    const { error } = await supabase.from("products").update({ is_sold: !currentlySold }).eq("id", id);
    if (error) toast.error("Failed: " + error.message);
    else { toast.success(currentlySold ? "Marked as available" : "Marked as sold!"); fetchProducts(); }
  };

  const duplicateProduct = async (product: Product) => {
    if (!user) return;
    const { error } = await supabase.from("products").insert({
      name: product.name + " (Copy)",
      price: product.price,
      discount_price: product.discount_price,
      category: product.category,
      condition: product.condition,
      description: product.description,
      brand: product.brand,
      power_rating: product.power_rating,
      size: product.size,
      seller_id: user.id,
      image_url: product.image_url,
      is_approved: true,
    });
    if (error) toast.error("Failed: " + error.message);
    else { toast.success("Product duplicated!"); fetchProducts(); }
  };

  const updateDiscountPrice = async (id: string, discountPrice: string) => {
    const price = discountPrice ? parseFloat(discountPrice) : null;
    const { error } = await supabase.from("products").update({ discount_price: price }).eq("id", id);
    if (error) toast.error("Failed: " + error.message);
    else { toast.success("Discount updated!"); fetchProducts(); }
  };

  if (loading) return <div className="text-sm text-muted-foreground">Loading products...</div>;

  if (products.length === 0) {
    return (
      <div className="text-center py-6">
        <Package className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">No products yet. Add your first product above!</p>
      </div>
    );
  }

  const totalViews = products.reduce((s, p) => s + (p.view_count || 0), 0);
  const activeProducts = products.filter(p => !p.is_sold).length;
  const soldProducts = products.filter(p => p.is_sold).length;

  return (
    <div className="space-y-4">
      {/* Analytics summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-secondary rounded-lg p-3 text-center">
          <p className="text-2xl font-display font-bold text-primary">{activeProducts}</p>
          <p className="text-[10px] text-muted-foreground uppercase font-semibold">Active</p>
        </div>
        <div className="bg-secondary rounded-lg p-3 text-center">
          <p className="text-2xl font-display font-bold text-foreground">{soldProducts}</p>
          <p className="text-[10px] text-muted-foreground uppercase font-semibold">Sold</p>
        </div>
        <div className="bg-secondary rounded-lg p-3 text-center">
          <p className="text-2xl font-display font-bold text-foreground">{totalViews}</p>
          <p className="text-[10px] text-muted-foreground uppercase font-semibold">Views</p>
        </div>
      </div>

      <h4 className="text-sm font-semibold text-foreground">Your Products ({products.length})</h4>
      {products.map((p) => (
        <div key={p.id} className={`p-3 rounded-lg border border-border bg-background space-y-2 ${p.is_sold ? "opacity-60" : ""}`}>
          <div className="flex items-center gap-3">
            {p.image_url ? (
              <img src={p.image_url} alt={p.name} className="w-12 h-12 rounded-md object-cover" />
            ) : (
              <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center">
                <Package className="h-5 w-5 text-muted-foreground" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
              <p className="text-xs text-muted-foreground">
                ₹{p.price} · {p.category}
                {p.discount_price && <span className="ml-1 text-green-600">Sale: ₹{p.discount_price}</span>}
              </p>
              <p className="text-[10px] text-muted-foreground">{p.view_count || 0} views</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${p.is_sold ? "bg-muted text-muted-foreground" : "bg-green-500/10 text-green-600"}`}>
                {p.is_sold ? "Sold" : "Active"}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button onClick={() => toggleSold(p.id, p.is_sold)} className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-md border border-border hover:bg-secondary transition-colors">
              <CheckCircle className="h-3 w-3" /> {p.is_sold ? "Mark Available" : "Mark Sold"}
            </button>
            <button onClick={() => duplicateProduct(p)} className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-md border border-border hover:bg-secondary transition-colors">
              <Copy className="h-3 w-3" /> Duplicate
            </button>
            <button onClick={() => {
              const price = prompt("Enter discount price (leave empty to remove):", p.discount_price?.toString() || "");
              if (price !== null) updateDiscountPrice(p.id, price);
            }} className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-md border border-border hover:bg-secondary transition-colors">
              <Tag className="h-3 w-3" /> Discount
            </button>
            <button onClick={() => deleteProduct(p.id)} className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-md border border-border hover:bg-destructive/10 text-destructive transition-colors ml-auto">
              <Trash2 className="h-3 w-3" /> Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyProducts;
