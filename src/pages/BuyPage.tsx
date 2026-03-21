import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, ArrowLeft, MapPin, Package, Phone, MessageCircle, Mail, Globe, User } from "lucide-react";
import ImageCarousel from "@/components/ImageCarousel";
import ProductReviews from "@/components/ProductReviews";
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
  seller_id: string;
  images?: { image_url: string; display_order: number }[];
}

interface SellerProfile {
  full_name: string | null;
  email: string;
  phone: string | null;
  whatsapp: string | null;
  address: string | null;
  extra_details: string | null;
}

const categories = [
  { id: "all", label: "All Items" },
  { id: "electronics", label: "Electronics" },
  { id: "furniture", label: "Furniture" },
  { id: "clothes", label: "Clothes" },
  { id: "stationery", label: "Stationery" },
  { id: "other", label: "Other Items" },
];

const SellerDetails = ({ seller }: { seller: SellerProfile }) => {
  const mapQuery = seller.address ? encodeURIComponent(seller.address) : null;

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold">Seller Details</h3>
            {seller.full_name && (
              <p className="text-sm text-foreground font-medium">{seller.full_name}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            href={`mailto:${seller.email}`}
            className="flex items-center gap-3 p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
          >
            <Mail className="h-4 w-4 text-primary flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Email</p>
              <p className="text-sm font-medium truncate">{seller.email}</p>
            </div>
          </a>

          {seller.phone && (
            <a
              href={`tel:${seller.phone}`}
              className="flex items-center gap-3 p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
            >
              <Phone className="h-4 w-4 text-primary flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Phone</p>
                <p className="text-sm font-medium">{seller.phone}</p>
              </div>
            </a>
          )}

          {seller.whatsapp && (
            <a
              href={`https://wa.me/${seller.whatsapp.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
            >
              <MessageCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">WhatsApp</p>
                <p className="text-sm font-medium">{seller.whatsapp}</p>
              </div>
            </a>
          )}

          {seller.address && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary">
              <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Address</p>
                <p className="text-sm font-medium">{seller.address}</p>
              </div>
            </div>
          )}
        </div>

        {seller.extra_details && (
          <div className="p-3 rounded-lg bg-secondary">
            <div className="flex items-center gap-2 mb-1">
              <Globe className="h-4 w-4 text-primary" />
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Additional Info</p>
            </div>
            <p className="text-sm text-foreground whitespace-pre-wrap">{seller.extra_details}</p>
          </div>
        )}
      </div>

      {/* Map embed */}
      {mapQuery && (
        <div className="border-t border-border">
          <iframe
            title="Seller Location"
            width="100%"
            height="250"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=&layer=mapnik&marker=&query=${mapQuery}`}
            allowFullScreen
          />
          <div className="px-4 py-2 bg-secondary/50">
            <a
              href={`https://www.openstreetmap.org/search?query=${mapQuery}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary font-display font-semibold hover:underline flex items-center gap-1"
            >
              <MapPin className="h-3 w-3" /> View larger map
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

const ProductDetail = ({ product, onBack }: { product: Product; onBack: () => void }) => {
  const [seller, setSeller] = useState<SellerProfile | null>(null);

  useEffect(() => {
    const fetchSeller = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("full_name, email, phone, whatsapp, address, extra_details")
        .eq("id", product.seller_id)
        .single();
      if (data) setSeller(data);
    };
    fetchSeller();
  }, [product.seller_id]);

  return (
    <div className="animate-fade-in">
      <div className="bg-card border-b border-border">
        <div className="container py-4">
          <button onClick={onBack} className="flex items-center gap-2 text-sm font-display text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" /> Back to listings
          </button>
        </div>
      </div>
      <div className="container py-8 max-w-4xl space-y-6">
        {/* Product card */}
        <div className="bg-card rounded-lg border border-border overflow-hidden md:flex">
          <div className="md:w-1/2">
            <ImageCarousel
              images={product.images || []}
              fallbackUrl={product.image_url}
              altText={product.name}
            />
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

        {/* Seller details */}
        {seller && <SellerDetails seller={seller} />}
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
