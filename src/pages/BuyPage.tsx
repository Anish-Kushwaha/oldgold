import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, ArrowLeft, MapPin } from "lucide-react";
import { sampleProducts, type Product } from "@/data/products";

const categories = [
  { id: "all", label: "All Items" },
  { id: "electronics", label: "Electronics" },
  { id: "furniture", label: "Furniture" },
  { id: "clothes", label: "Clothes" },
  { id: "stationery", label: "Stationery" },
  { id: "other", label: "Other Items" },
];

const ProductDetail = ({ product, onBack }: { product: Product; onBack: () => void }) => (
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
        <div className="md:w-1/2 bg-secondary h-64 md:h-auto flex items-center justify-center text-8xl">
          {product.image}
        </div>
        <div className="md:w-1/2 p-6 space-y-4">
          <span className="text-xs font-display font-semibold uppercase tracking-wider text-muted-foreground">{product.category}</span>
          <h2 className="font-display text-2xl font-bold">{product.name}</h2>
          <p className="font-display font-bold text-accent text-3xl">₹{product.price.toLocaleString("en-IN")}</p>
          <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
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
            {product.powerRating && (
              <div className="bg-secondary rounded-md px-3 py-2">
                <span className="text-muted-foreground text-xs">Power Rating</span>
                <p className="font-display font-semibold">{product.powerRating}</p>
              </div>
            )}
            {product.size && (
              <div className="bg-secondary rounded-md px-3 py-2">
                <span className="text-muted-foreground text-xs">Size</span>
                <p className="font-display font-semibold">{product.size}</p>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
            <MapPin className="h-3 w-3" /> Seller location will be visible after backend setup
          </div>
        </div>
      </div>
    </div>
  </div>
);

const BuyPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const selectedItemId = searchParams.get("item");
  const selectedProduct = selectedItemId ? sampleProducts.find((p) => p.id === Number(selectedItemId)) : null;

  // Scroll to top when item selected
  useEffect(() => {
    if (selectedItemId) window.scrollTo(0, 0);
  }, [selectedItemId]);

  if (selectedProduct) {
    return <ProductDetail product={selectedProduct} onBack={() => setSearchParams({})} />;
  }

  const filtered = sampleProducts.filter((p) => {
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
        {filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">No items found. Check back later!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <Link
                key={product.id}
                to={`/buy?item=${product.id}`}
                className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-md transition-shadow group"
              >
                <div className="bg-secondary h-40 flex items-center justify-center text-5xl">
                  {product.image}
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
