import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Package, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  currentProductId: string;
  category: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  condition: string;
}

const RelatedProducts = ({ currentProductId, category }: Props) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("products")
        .select("id, name, price, image_url, condition")
        .eq("is_approved", true)
        .eq("is_sold", false)
        .eq("category", category)
        .neq("id", currentProductId)
        .limit(4);
      if (data) setProducts(data);
    };
    fetch();
  }, [currentProductId, category]);

  if (products.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="font-display text-lg font-bold flex items-center gap-2">
        Related Products
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {products.map(p => (
          <Link key={p.id} to={`/buy?item=${p.id}`} className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-md transition-shadow group">
            <div className="bg-secondary h-28 flex items-center justify-center">
              {p.image_url ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" /> : <Package className="h-8 w-8 text-muted-foreground" />}
            </div>
            <div className="p-3">
              <h4 className="font-display text-xs font-semibold truncate group-hover:text-primary transition-colors">{p.name}</h4>
              <p className="font-display font-bold text-primary text-sm">₹{p.price.toLocaleString("en-IN")}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
