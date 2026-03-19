import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Package, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  is_approved: boolean;
  is_sold: boolean;
  image_url: string | null;
  created_at: string;
}

const MyProducts = ({ refreshKey }: { refreshKey: number }) => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("products")
      .select("id, name, price, category, is_approved, is_sold, image_url, created_at")
      .eq("seller_id", user.id)
      .order("created_at", { ascending: false });
    setProducts(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [user, refreshKey]);

  const deleteProduct = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete: " + error.message);
    } else {
      toast.success("Product deleted.");
      fetchProducts();
    }
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

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold text-foreground">Your Products</h4>
      {products.map((p) => (
        <div key={p.id} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-background">
          {p.image_url ? (
            <img src={p.image_url} alt={p.name} className="w-12 h-12 rounded-md object-cover" />
          ) : (
            <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center">
              <Package className="h-5 w-5 text-muted-foreground" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
            <p className="text-xs text-muted-foreground">₹{p.price} · {p.category}</p>
          </div>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
              p.is_approved
                ? "bg-green-500/10 text-green-600"
                : "bg-yellow-500/10 text-yellow-600"
            }`}
          >
            {p.is_approved ? "Approved" : "Pending"}
          </span>
          <button
            onClick={() => deleteProduct(p.id)}
            className="p-1.5 rounded-md hover:bg-destructive/10 text-destructive transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default MyProducts;
