import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Check, X, Trash2, Package, Eye } from "lucide-react";
import { toast } from "sonner";

interface ProductWithSeller {
  id: string;
  name: string;
  price: number;
  category: string;
  condition: string;
  brand: string | null;
  power_rating: string | null;
  size: string | null;
  description: string | null;
  image_url: string | null;
  is_approved: boolean;
  is_sold: boolean;
  seller_id: string;
  created_at: string;
  seller_email?: string;
  seller_name?: string;
}

const ManageProducts = () => {
  const [products, setProducts] = useState<ProductWithSeller[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      // Fetch seller profiles
      const sellerIds = [...new Set(data.map((p) => p.seller_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, email, full_name")
        .in("id", sellerIds);

      const profileMap = new Map(profiles?.map((p) => [p.id, p]) || []);

      const enriched = data.map((p) => ({
        ...p,
        seller_email: profileMap.get(p.seller_id)?.email || "Unknown",
        seller_name: profileMap.get(p.seller_id)?.full_name || "",
      }));
      setProducts(enriched);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const approveProduct = async (id: string) => {
    const { error } = await supabase.from("products").update({ is_approved: true }).eq("id", id);
    if (error) toast.error("Failed to approve.");
    else {
      toast.success("Product approved!");
      fetchProducts();
    }
  };

  const rejectProduct = async (id: string) => {
    const { error } = await supabase.from("products").update({ is_approved: false }).eq("id", id);
    if (error) toast.error("Failed to reject.");
    else {
      toast.success("Product rejected.");
      fetchProducts();
    }
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) toast.error("Failed to delete.");
    else {
      toast.success("Product deleted.");
      fetchProducts();
    }
  };

  if (loading) return <div className="text-sm text-muted-foreground">Loading products...</div>;

  const pending = products.filter((p) => !p.is_approved);
  const approved = products.filter((p) => p.is_approved);

  return (
    <div className="space-y-4">
      <h3 className="font-display text-lg font-bold flex items-center gap-2">
        <Package className="h-5 w-5 text-primary" />
        Manage Products
      </h3>

      {pending.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-yellow-600 mb-2">⏳ Pending Approval ({pending.length})</h4>
          <div className="space-y-2">
            {pending.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                expanded={expandedId === p.id}
                onToggle={() => setExpandedId(expandedId === p.id ? null : p.id)}
                onApprove={() => approveProduct(p.id)}
                onReject={() => rejectProduct(p.id)}
                onDelete={() => deleteProduct(p.id)}
              />
            ))}
          </div>
        </div>
      )}

      {approved.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-green-600 mb-2">✅ Approved ({approved.length})</h4>
          <div className="space-y-2">
            {approved.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                expanded={expandedId === p.id}
                onToggle={() => setExpandedId(expandedId === p.id ? null : p.id)}
                onApprove={() => approveProduct(p.id)}
                onReject={() => rejectProduct(p.id)}
                onDelete={() => deleteProduct(p.id)}
              />
            ))}
          </div>
        </div>
      )}

      {products.length === 0 && (
        <p className="text-sm text-muted-foreground">No products submitted yet.</p>
      )}
    </div>
  );
};

const ProductCard = ({
  product,
  expanded,
  onToggle,
  onApprove,
  onReject,
  onDelete,
}: {
  product: ProductWithSeller;
  expanded: boolean;
  onToggle: () => void;
  onApprove: () => void;
  onReject: () => void;
  onDelete: () => void;
}) => (
  <div className="bg-background rounded-lg border border-border p-3">
    <div className="flex items-center gap-3">
      {product.image_url ? (
        <img src={product.image_url} alt={product.name} className="w-12 h-12 rounded-md object-cover" />
      ) : (
        <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center">
          <Package className="h-5 w-5 text-muted-foreground" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
        <p className="text-xs text-muted-foreground">₹{product.price} · {product.category} · {product.condition}</p>
        <p className="text-xs text-muted-foreground">By: {product.seller_name || product.seller_email}</p>
      </div>
      <button onClick={onToggle} className="p-1.5 rounded-md hover:bg-muted transition-colors">
        <Eye className="h-4 w-4 text-muted-foreground" />
      </button>
    </div>

    {expanded && (
      <div className="mt-3 pt-3 border-t border-border space-y-2">
        {product.description && <p className="text-xs text-foreground">{product.description}</p>}
        {product.brand && <p className="text-xs text-muted-foreground">Brand: {product.brand}</p>}
        {product.power_rating && <p className="text-xs text-muted-foreground">Power Rating: {product.power_rating}</p>}
        {product.size && <p className="text-xs text-muted-foreground">Size: {product.size}</p>}
      </div>
    )}

    <div className="flex gap-2 mt-2 pt-2 border-t border-border">
      {!product.is_approved && (
        <button
          onClick={onApprove}
          className="flex items-center gap-1 px-3 py-1 rounded-md bg-green-500/10 text-green-600 text-xs font-medium hover:bg-green-500/20 transition-colors"
        >
          <Check className="h-3 w-3" /> Approve
        </button>
      )}
      {product.is_approved && (
        <button
          onClick={onReject}
          className="flex items-center gap-1 px-3 py-1 rounded-md bg-yellow-500/10 text-yellow-600 text-xs font-medium hover:bg-yellow-500/20 transition-colors"
        >
          <X className="h-3 w-3" /> Reject
        </button>
      )}
      <button
        onClick={onDelete}
        className="flex items-center gap-1 px-3 py-1 rounded-md bg-destructive/10 text-destructive text-xs font-medium hover:bg-destructive/20 transition-colors"
      >
        <Trash2 className="h-3 w-3" /> Delete
      </button>
    </div>
  </div>
);

export default ManageProducts;
