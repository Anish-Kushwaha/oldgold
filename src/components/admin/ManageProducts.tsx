import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, Package, Eye, Edit2, Save, X } from "lucide-react";
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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ProductWithSeller>>({});

  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
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

  const deleteProduct = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) toast.error("Failed to delete.");
    else {
      toast.success("Product deleted.");
      fetchProducts();
    }
  };

  const startEdit = (product: ProductWithSeller) => {
    setEditingId(product.id);
    setEditForm({
      name: product.name,
      price: product.price,
      category: product.category,
      condition: product.condition,
      brand: product.brand,
      description: product.description,
    });
  };

  const saveEdit = async (id: string) => {
    const { error } = await supabase
      .from("products")
      .update({
        name: editForm.name,
        price: editForm.price,
        category: editForm.category,
        condition: editForm.condition,
        brand: editForm.brand,
        description: editForm.description,
      })
      .eq("id", id);

    if (error) toast.error("Failed to update.");
    else {
      toast.success("Product updated!");
      setEditingId(null);
      fetchProducts();
    }
  };

  if (loading) return <div className="text-sm text-muted-foreground">Loading products...</div>;

  return (
    <div className="space-y-4">
      <h3 className="font-display text-lg font-bold flex items-center gap-2">
        <Package className="h-5 w-5 text-primary" />
        Manage Products ({products.length})
      </h3>

      <div className="space-y-2">
        {products.map((p) => (
          <div key={p.id} className="bg-background rounded-lg border border-border p-3">
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
                <p className="text-xs text-muted-foreground">₹{p.price} · {p.category} · {p.condition}</p>
                <p className="text-xs text-muted-foreground">By: {p.seller_name || p.seller_email}</p>
              </div>
              <button onClick={() => setExpandedId(expandedId === p.id ? null : p.id)} className="p-1.5 rounded-md hover:bg-muted transition-colors">
                <Eye className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            {expandedId === p.id && editingId !== p.id && (
              <div className="mt-3 pt-3 border-t border-border space-y-2">
                {p.description && <p className="text-xs text-foreground">{p.description}</p>}
                {p.brand && <p className="text-xs text-muted-foreground">Brand: {p.brand}</p>}
                {p.power_rating && <p className="text-xs text-muted-foreground">Power Rating: {p.power_rating}</p>}
                {p.size && <p className="text-xs text-muted-foreground">Size: {p.size}</p>}
              </div>
            )}

            {editingId === p.id && (
              <div className="mt-3 pt-3 border-t border-border space-y-2">
                <input value={editForm.name || ""} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} placeholder="Name" className="w-full px-2 py-1 rounded border border-border bg-background text-sm" />
                <input type="number" value={editForm.price || 0} onChange={(e) => setEditForm({ ...editForm, price: parseFloat(e.target.value) })} placeholder="Price" className="w-full px-2 py-1 rounded border border-border bg-background text-sm" />
                <textarea value={editForm.description || ""} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} placeholder="Description" rows={2} className="w-full px-2 py-1 rounded border border-border bg-background text-sm resize-none" />
                <div className="flex gap-2">
                  <button onClick={() => saveEdit(p.id)} className="flex items-center gap-1 px-3 py-1 rounded-md bg-green-500/10 text-green-600 text-xs font-medium hover:bg-green-500/20 transition-colors">
                    <Save className="h-3 w-3" /> Save
                  </button>
                  <button onClick={() => setEditingId(null)} className="flex items-center gap-1 px-3 py-1 rounded-md bg-muted text-muted-foreground text-xs font-medium hover:bg-muted/80 transition-colors">
                    <X className="h-3 w-3" /> Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="flex gap-2 mt-2 pt-2 border-t border-border">
              <button onClick={() => startEdit(p)} className="flex items-center gap-1 px-3 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors">
                <Edit2 className="h-3 w-3" /> Edit
              </button>
              <button onClick={() => deleteProduct(p.id)} className="flex items-center gap-1 px-3 py-1 rounded-md bg-destructive/10 text-destructive text-xs font-medium hover:bg-destructive/20 transition-colors">
                <Trash2 className="h-3 w-3" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <p className="text-sm text-muted-foreground">No products listed yet.</p>
      )}
    </div>
  );
};

export default ManageProducts;
