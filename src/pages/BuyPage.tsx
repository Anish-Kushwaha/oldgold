import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, ArrowLeft, MapPin, Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  condition: string;
  image_url: string | null;
  description: string | null;
  brand: string | null;
  power_rating: string | null;
  size: string | null;
  images?: { image_url: string; display_order: number }[];
}

const categories = [
  { id: "all", label: "All Items" },
  { id: "electronics", label: "Electronics" },
  { id: "furniture", label: "Furniture" },
  { id: "clothes", label: "Clothes" },
  { id: "stationery", label: "Stationery" },
  { id: "other", label: "Other Items" },
];

const ProductDetail = ({ product, onBack }: { product: Product; onBack: () => void }) => {
  const allImages = product.images?.sort((a, b) => a.display_order - b.display_order) || [];
  const [activeImg, setActiveImg] = useState(0);

  return (
    <div className="animate-fade-in">
      <div className="bg-card border-b border-border">
        <div className="container py-4">
          <button onClick={onBack} className="flex items-center gap-2 text-sm font-display text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" /> Back to listings
          </button>
        </div>
      </div>
      <div className="container py-8 max-w-4xl">
        <div className="bg-card rounded-lg border border-border overflow-hidden md:flex">
          <div className="md:w-1/2">
            {allImages.length > 0 ? (
              <div>
                <div className="h-64 md:h-80 bg-secondary flex items-center justify-center">
                  <img src={allImages[activeImg]?.image_url} alt={product.name} className="w-full h-full object-contain" />
                </div>
                {allImages.length > 1 && (
                  <div className="flex gap-1 p-2 overflow-x-auto">
                    {allImages.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImg(i)}
                        className={`w-14 h-14 rounded-md overflow-hidden border-2 flex-shrink-0 ${i === activeImg ? "border-primary" : "border-transparent"}`}
                      >
                        <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : product.image_url ? (
              <div className="h-64 md:h-80 bg-secondary flex items-center justify-center">
                <img src={product.image_url} alt={product.name} className="w-full h-full object-contain" />
              </div>
            ) : (
              <div className="h-64 md:h-80 bg-secondary flex items-center justify-center">
                <Package className="h-16 w-16 text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="md:w-1/2 p-6 space-y-4">
            <span className="text-xs font-display font-semibold uppercase tracking-wider text-muted-foreground">{product.category}</span>
            <h2 className="font-display text-2xl font-bold">{product.name}</h2>
            <p className="font-display font-bold text-accent text-3xl">₹{product.price.toLocaleString("en-IN")}</p>
            {product.description && <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-secondary rounded-md px-3 py-2">
                <span className="text-muted-foreground text-xs">Condition</span>
                <p className="font-display font-semibold">{product.condition}</p>
              </div>
              {product.brand && (
                <div className="bg-secondary rounded-md px-3 py-2">
                  <span className="text-muted-foreground text-xs">Brand</span>
                  <p className="font-display font-semibold">{product.brand}</p>
                </div>
              )}
              {product.power_rating && (
                <div className="bg-secondary rounded-md px-3 py-2">
                  <span className="text-muted-foreground text-xs">Power Rating</span>
                  <p className="font-display font-semibold">{product.power_rating}</p>
                </div>
              )}
              {product.size && (
                <div className="bg-secondary rounded-md px-3 py-2">
                  <span className="text-muted-foreground text-xs">Size</span>
                  <p className="font-display font-semibold">{product.size}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BuyPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const selectedItemId = searchParams.get("item");

  // Fetch approved products from database
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("is_approved", true)
        .eq("is_sold", false)
        .order("created_at", { ascending: false });

      if (data) setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  // Fetch selected product with images
  useEffect(() => {
    if (!selectedItemId) {
      setSelectedProduct(null);
      return;
    }
    const fetchProduct = async () => {
      const { data: prod } = await supabase
        .from("products")
        .select("*")
        .eq("id", selectedItemId)
        .eq("is_approved", true)
        .single();

      if (prod) {
        const { data: imgs } = await supabase
          .from("product_images")
          .select("image_url, display_order")
          .eq("product_id", prod.id)
          .order("display_order");

        setSelectedProduct({ ...prod, images: imgs || [] });
      }
      window.scrollTo(0, 0);
    };
    fetchProduct();
  }, [selectedItemId]);

  if (selectedProduct) {
    return <ProductDetail product={selectedProduct} onBack={() => setSearchParams({})} />;
  }

  const filtered = products.filter((p) => {
    const matchesCat = activeCategory === "all" || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="animate-fade-in">
      <div className="bg-card border-b border-border">
        <div className="container py-6">
          <h2 className="font-display text-3xl font-bold mb-4">Buy Items</h2>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
        </div>
        <div className="container pb-4 flex gap-2 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-display font-medium transition-colors ${
                activeCategory === cat.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-background border border-border hover:border-primary hover:text-primary"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="container py-8">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">No items found. Check back later!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <Link
                key={product.id}
                to={`/buy?item=${product.id}`}
                className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-md transition-shadow group"
              >
                <div className="bg-secondary h-40 flex items-center justify-center">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <Package className="h-10 w-10 text-muted-foreground" />
                  )}
                </div>
                <div className="p-4">
                  <h4 className="font-display font-semibold text-sm mb-1 group-hover:text-primary transition-colors">{product.name}</h4>
                  <p className="text-xs text-muted-foreground mb-2">Condition: {product.condition}</p>
                  <p className="font-display font-bold text-accent text-lg">₹{product.price.toLocaleString("en-IN")}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyPage;
