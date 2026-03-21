import { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, ArrowLeft, MapPin, Package, Phone, MessageCircle, Mail, Globe, User, Heart, ShoppingCart, Share2, GitCompareArrows, Copy, Check, SlidersHorizontal, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import ImageCarousel from "@/components/ImageCarousel";
import ProductReviews from "@/components/ProductReviews";
import RelatedProducts from "@/components/RelatedProducts";
import { ProductSkeletonGrid } from "@/components/ProductSkeleton";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useCompare } from "@/hooks/useCompare";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  price: number;
  discount_price?: number | null;
  category: string;
  condition: string;
  image_url: string | null;
  description: string | null;
  brand: string | null;
  power_rating: string | null;
  size: string | null;
  seller_id: string;
  created_at: string;
  view_count?: number;
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

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
  { value: "name_asc", label: "Name: A-Z" },
];

const CONDITIONS = ["all", "new", "like_new", "used", "fair"];
const ITEMS_PER_PAGE = 12;

const isNewListing = (createdAt: string) => {
  const diff = Date.now() - new Date(createdAt).getTime();
  return diff < 3 * 24 * 60 * 60 * 1000; // 3 days
};

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
  toast.success("Copied to clipboard!");
};

const shareProduct = async (product: Product) => {
  const url = `${window.location.origin}/buy?item=${product.id}`;
  const shareData = { title: product.name, text: `Check out ${product.name} for ₹${product.price} on OldGold!`, url };
  if (navigator.share) {
    try { await navigator.share(shareData); } catch {}
  } else {
    copyToClipboard(url);
  }
};

// ─── Seller Details ───
const SellerDetails = ({ seller }: { seller: SellerProfile }) => {
  const [copied, setCopied] = useState<string | null>(null);
  const mapQuery = seller.address ? encodeURIComponent(seller.address) : null;

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    toast.success(`${field} copied!`);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold">Seller Details</h3>
            {seller.full_name && <p className="text-sm text-foreground font-medium">{seller.full_name}</p>}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary group">
            <Mail className="h-4 w-4 text-primary flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Email</p>
              <a href={`mailto:${seller.email}`} className="text-sm font-medium truncate block hover:text-primary">{seller.email}</a>
            </div>
            <button onClick={() => handleCopy(seller.email, "Email")} className="p-1 rounded hover:bg-background transition-colors">
              {copied === "Email" ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5 text-muted-foreground" />}
            </button>
          </div>
          {seller.phone && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary group">
              <Phone className="h-4 w-4 text-primary flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Phone</p>
                <a href={`tel:${seller.phone}`} className="text-sm font-medium hover:text-primary">{seller.phone}</a>
              </div>
              <button onClick={() => handleCopy(seller.phone!, "Phone")} className="p-1 rounded hover:bg-background transition-colors">
                {copied === "Phone" ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5 text-muted-foreground" />}
              </button>
            </div>
          )}
          {seller.whatsapp && (
            <a href={`https://wa.me/${seller.whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors">
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
              <div className="min-w-0 flex-1">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Address</p>
                <p className="text-sm font-medium">{seller.address}</p>
              </div>
              <button onClick={() => handleCopy(seller.address!, "Address")} className="p-1 rounded hover:bg-background transition-colors">
                {copied === "Address" ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5 text-muted-foreground" />}
              </button>
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
      {mapQuery && (
        <div className="border-t border-border">
          <iframe title="Seller Location" width="100%" height="250" style={{ border: 0 }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={`https://www.openstreetmap.org/export/embed.html?bbox=&layer=mapnik&marker=&query=${mapQuery}`} allowFullScreen />
          <div className="px-4 py-2 bg-secondary/50">
            <a href={`https://www.openstreetmap.org/search?query=${mapQuery}`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary font-display font-semibold hover:underline flex items-center gap-1">
              <MapPin className="h-3 w-3" /> View larger map
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Product Detail ───
const ProductDetail = ({ product, onBack }: { product: Product; onBack: () => void }) => {
  const [seller, setSeller] = useState<SellerProfile | null>(null);
  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCompare, isInCompare } = useCompare();
  const { addItem: addToRecent } = useRecentlyViewed();

  useEffect(() => {
    addToRecent({ id: product.id, name: product.name, price: product.price, image_url: product.image_url });
    // Increment view count
    supabase.rpc("increment_view_count" as any, { product_id: product.id }).then(() => {});
  }, [product.id]);

  useEffect(() => {
    const fetchSeller = async () => {
      const { data } = await supabase.from("profiles").select("full_name, email, phone, whatsapp, address, extra_details").eq("id", product.seller_id).single();
      if (data) setSeller(data);
    };
    fetchSeller();
  }, [product.seller_id]);

  const handleAddToCart = () => {
    addToCart({ id: product.id, name: product.name, price: product.price, discount_price: product.discount_price, image_url: product.image_url, seller_id: product.seller_id });
    toast.success("Added to cart!");
  };

  const handleToggleWishlist = () => {
    toggleWishlist({ id: product.id, name: product.name, price: product.price, discount_price: product.discount_price, image_url: product.image_url, category: product.category, condition: product.condition });
    toast.success(isInWishlist(product.id) ? "Removed from wishlist" : "Added to wishlist!");
  };

  const handleCompare = () => {
    if (isInCompare(product.id)) return;
    addToCompare({ id: product.id, name: product.name, price: product.price, discount_price: product.discount_price, image_url: product.image_url, category: product.category, condition: product.condition, brand: product.brand, power_rating: product.power_rating, size: product.size, description: product.description });
    toast.success("Added to compare!");
  };

  return (
    <div className="animate-fade-in">
      <div className="bg-card border-b border-border">
        <div className="container py-4 flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 text-sm font-display text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" /> Back to listings
          </button>
          <div className="flex items-center gap-1">
            <button onClick={() => shareProduct(product)} className="p-2 rounded-lg hover:bg-secondary transition-colors" title="Share">
              <Share2 className="h-4 w-4 text-muted-foreground" />
            </button>
            <button onClick={handleToggleWishlist} className={`p-2 rounded-lg hover:bg-secondary transition-colors`} title="Wishlist">
              <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
            </button>
            <button onClick={handleCompare} disabled={isInCompare(product.id)} className="p-2 rounded-lg hover:bg-secondary transition-colors disabled:opacity-50" title="Compare">
              <GitCompareArrows className={`h-4 w-4 ${isInCompare(product.id) ? "text-primary" : "text-muted-foreground"}`} />
            </button>
          </div>
        </div>
      </div>
      <div className="container py-8 max-w-4xl space-y-6">
        <div className="bg-card rounded-lg border border-border overflow-hidden md:flex">
          <div className="md:w-1/2">
            <ImageCarousel images={product.images || []} fallbackUrl={product.image_url} altText={product.name} />
          </div>
          <div className="md:w-1/2 p-6 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-display font-semibold uppercase tracking-wider text-muted-foreground">{product.category}</span>
              {isNewListing(product.created_at) && (
                <span className="gold-gradient text-primary-foreground text-[10px] font-display font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">New</span>
              )}
            </div>
            <h2 className="font-display text-2xl font-bold">{product.name}</h2>
            <div className="flex items-center gap-3">
              {product.discount_price ? (
                <>
                  <p className="font-display font-bold text-primary text-3xl">₹{product.discount_price.toLocaleString("en-IN")}</p>
                  <p className="font-display text-lg text-muted-foreground line-through">₹{product.price.toLocaleString("en-IN")}</p>
                  <span className="bg-green-500/10 text-green-600 text-xs font-bold px-2 py-0.5 rounded-full">
                    {Math.round((1 - product.discount_price / product.price) * 100)}% OFF
                  </span>
                </>
              ) : (
                <p className="font-display font-bold text-primary text-3xl">₹{product.price.toLocaleString("en-IN")}</p>
              )}
            </div>
            {product.description && <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-secondary rounded-md px-3 py-2">
                <span className="text-muted-foreground text-xs">Condition</span>
                <p className="font-display font-semibold">{product.condition}</p>
              </div>
              {product.brand && <div className="bg-secondary rounded-md px-3 py-2"><span className="text-muted-foreground text-xs">Brand</span><p className="font-display font-semibold">{product.brand}</p></div>}
              {product.power_rating && <div className="bg-secondary rounded-md px-3 py-2"><span className="text-muted-foreground text-xs">Power Rating</span><p className="font-display font-semibold">{product.power_rating}</p></div>}
              {product.size && <div className="bg-secondary rounded-md px-3 py-2"><span className="text-muted-foreground text-xs">Size</span><p className="font-display font-semibold">{product.size}</p></div>}
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={isInCart(product.id)}
                className="flex-1 flex items-center justify-center gap-2 gold-gradient text-primary-foreground font-display font-semibold py-3 rounded-lg hover:opacity-90 disabled:opacity-60 transition-opacity"
              >
                <ShoppingCart className="h-5 w-5" />
                {isInCart(product.id) ? "In Cart" : "Add to Cart"}
              </button>
              {seller?.whatsapp && (
                <a
                  href={`https://wa.me/${seller.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hi! I'm interested in "${product.name}" listed for ₹${product.price} on OldGold.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-green-600 text-white font-semibold hover:opacity-90 transition-opacity"
                >
                  <MessageCircle className="h-5 w-5" /> Chat
                </a>
              )}
            </div>
          </div>
        </div>
        {seller && <SellerDetails seller={seller} />}
        <ProductReviews productId={product.id} />
        <RelatedProducts currentProductId={product.id} category={product.category} />
      </div>
    </div>
  );
};

// ─── Recently Viewed Section ───
const RecentlyViewedSection = () => {
  const { items } = useRecentlyViewed();
  if (items.length === 0) return null;
  return (
    <div className="mb-8">
      <h3 className="font-display text-lg font-bold mb-3 flex items-center gap-2">
        <Clock className="h-5 w-5 text-primary" /> Recently Viewed
      </h3>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {items.map(item => (
          <Link key={item.id} to={`/buy?item=${item.id}`} className="flex-shrink-0 w-32 bg-card rounded-lg border border-border overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-20 bg-secondary flex items-center justify-center">
              {item.image_url ? <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" /> : <Package className="h-6 w-6 text-muted-foreground" />}
            </div>
            <div className="p-2">
              <p className="text-xs font-semibold truncate">{item.name}</p>
              <p className="text-xs font-bold text-primary">₹{item.price.toLocaleString("en-IN")}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

// ─── Buy Page ───
const BuyPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [sortBy, setSortBy] = useState("newest");
  const [conditionFilter, setConditionFilter] = useState("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 999999]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const selectedItemId = searchParams.get("item");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data } = await supabase.from("products").select("*").eq("is_approved", true).eq("is_sold", false).order("created_at", { ascending: false });
      if (data) setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (!selectedItemId) { setSelectedProduct(null); return; }
    const fetchProduct = async () => {
      const { data: prod } = await supabase.from("products").select("*").eq("id", selectedItemId).eq("is_approved", true).single();
      if (prod) {
        const { data: imgs } = await supabase.from("product_images").select("image_url, display_order").eq("product_id", prod.id).order("display_order");
        setSelectedProduct({ ...prod, images: imgs || [] });
      }
      window.scrollTo(0, 0);
    };
    fetchProduct();
  }, [selectedItemId]);

  const filtered = useMemo(() => {
    let result = products.filter((p) => {
      const matchesCat = activeCategory === "all" || p.category === activeCategory;
      const matchesSearch = p.name.toLowerCase().includes(debouncedSearch.toLowerCase()) || (p.description || "").toLowerCase().includes(debouncedSearch.toLowerCase()) || (p.brand || "").toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesCondition = conditionFilter === "all" || p.condition === conditionFilter;
      const effectivePrice = p.discount_price ?? p.price;
      const matchesPrice = effectivePrice >= priceRange[0] && effectivePrice <= priceRange[1];
      return matchesCat && matchesSearch && matchesCondition && matchesPrice;
    });

    switch (sortBy) {
      case "price_low": result.sort((a, b) => (a.discount_price ?? a.price) - (b.discount_price ?? b.price)); break;
      case "price_high": result.sort((a, b) => (b.discount_price ?? b.price) - (a.discount_price ?? a.price)); break;
      case "oldest": result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()); break;
      case "name_asc": result.sort((a, b) => a.name.localeCompare(b.name)); break;
      default: result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    return result;
  }, [products, activeCategory, debouncedSearch, conditionFilter, priceRange, sortBy]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedProducts = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  useEffect(() => setCurrentPage(1), [activeCategory, debouncedSearch, conditionFilter, sortBy]);

  if (selectedProduct) {
    return <ProductDetail product={selectedProduct} onBack={() => setSearchParams({})} />;
  }

  const categoryCounts = products.reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="animate-fade-in">
      <div className="bg-card border-b border-border">
        <div className="container py-6">
          <h2 className="font-display text-3xl font-bold mb-4">Buy Items</h2>
          <div className="flex gap-2 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input type="text" placeholder="Search items, brands..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className={`p-2.5 rounded-lg border border-border transition-colors ${showFilters ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}>
              <SlidersHorizontal className="h-4 w-4" />
            </button>
          </div>

          {/* Filters panel */}
          {showFilters && (
            <div className="mt-4 p-4 rounded-lg bg-secondary border border-border space-y-3 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sort By</label>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background text-sm">
                    {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Condition</label>
                  <select value={conditionFilter} onChange={(e) => setConditionFilter(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background text-sm">
                    {CONDITIONS.map(c => <option key={c} value={c}>{c === "all" ? "All Conditions" : c.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Max Price (₹)</label>
                  <input type="number" placeholder="Max price" value={priceRange[1] === 999999 ? "" : priceRange[1]} onChange={(e) => setPriceRange([0, e.target.value ? parseInt(e.target.value) : 999999])} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background text-sm" />
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="container pb-4 flex gap-2 overflow-x-auto">
          {categories.map((cat) => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-display font-medium transition-colors ${activeCategory === cat.id ? "bg-primary text-primary-foreground" : "bg-background border border-border hover:border-primary hover:text-primary"}`}>
              {cat.label}
              {cat.id !== "all" && categoryCounts[cat.id] ? <span className="ml-1.5 text-xs opacity-70">({categoryCounts[cat.id]})</span> : null}
              {cat.id === "all" && <span className="ml-1.5 text-xs opacity-70">({products.length})</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="container py-8">
        <RecentlyViewedSection />

        {loading ? (
          <ProductSkeletonGrid />
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground font-display text-lg">No items found matching your criteria.</p>
            <button onClick={() => { setActiveCategory("all"); setConditionFilter("all"); setSearchQuery(""); setPriceRange([0, 999999]); }} className="mt-4 text-primary font-semibold text-sm hover:underline">Clear all filters</button>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-4">{filtered.length} item{filtered.length !== 1 ? "s" : ""} found</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {paginatedProducts.map((product) => (
                <div key={product.id} className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-md transition-shadow group relative">
                  <Link to={`/buy?item=${product.id}`} className="block">
                    <div className="bg-secondary h-40 flex items-center justify-center relative">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <Package className="h-10 w-10 text-muted-foreground" />
                      )}
                      {isNewListing(product.created_at) && (
                        <span className="absolute top-2 left-2 gold-gradient text-primary-foreground text-[10px] font-display font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">New</span>
                      )}
                      {product.discount_price && (
                        <span className="absolute top-2 right-2 bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {Math.round((1 - product.discount_price / product.price) * 100)}% OFF
                        </span>
                      )}
                    </div>
                  </Link>
                  {/* Quick action buttons */}
                  <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => { e.preventDefault(); toggleWishlist({ id: product.id, name: product.name, price: product.price, discount_price: product.discount_price, image_url: product.image_url, category: product.category, condition: product.condition }); toast.success(isInWishlist(product.id) ? "Removed" : "Added to wishlist!"); }} className="p-1.5 rounded-full bg-background/90 backdrop-blur-sm border border-border hover:bg-background transition-colors">
                      <Heart className={`h-3.5 w-3.5 ${isInWishlist(product.id) ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
                    </button>
                  </div>
                  <div className="p-4">
                    <Link to={`/buy?item=${product.id}`}>
                      <h4 className="font-display font-semibold text-sm mb-1 group-hover:text-primary transition-colors">{product.name}</h4>
                    </Link>
                    <p className="text-xs text-muted-foreground mb-2">{product.condition}{product.brand ? ` · ${product.brand}` : ""}</p>
                    <div className="flex items-center gap-2 mb-3">
                      {product.discount_price ? (
                        <>
                          <p className="font-display font-bold text-primary text-lg">₹{product.discount_price.toLocaleString("en-IN")}</p>
                          <p className="text-xs text-muted-foreground line-through">₹{product.price.toLocaleString("en-IN")}</p>
                        </>
                      ) : (
                        <p className="font-display font-bold text-primary text-lg">₹{product.price.toLocaleString("en-IN")}</p>
                      )}
                    </div>
                    <button
                      onClick={() => { addToCart({ id: product.id, name: product.name, price: product.price, discount_price: product.discount_price, image_url: product.image_url, seller_id: product.seller_id }); toast.success("Added to cart!"); }}
                      disabled={isInCart(product.id)}
                      className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity"
                    >
                      <ShoppingCart className="h-3.5 w-3.5" />
                      {isInCart(product.id) ? "In Cart" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-lg border border-border hover:bg-secondary disabled:opacity-30 transition-colors">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button key={page} onClick={() => setCurrentPage(page)} className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${currentPage === page ? "bg-primary text-primary-foreground" : "border border-border hover:bg-secondary"}`}>
                    {page}
                  </button>
                ))}
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg border border-border hover:bg-secondary disabled:opacity-30 transition-colors">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BuyPage;
