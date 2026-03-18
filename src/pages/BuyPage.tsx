import { useState } from "react";
import { Search } from "lucide-react";

const categories = [
  { id: "all", label: "All Items" },
  { id: "electronics", label: "Electronics", examples: "Fan, TV, Refrigerator, Cooler, AC" },
  { id: "furniture", label: "Furniture", examples: "Chair, Table, Bed, Desk" },
  { id: "clothes", label: "Clothes", examples: "Shirt, T-shirt, Jeans, Shoes" },
  { id: "stationery", label: "Stationery", examples: "Pen, Pencil, Books, Geometry Box" },
  { id: "other", label: "Other Items", examples: "Household items & more" },
];

// Placeholder products (will be replaced with DB data)
const sampleProducts = [
  { id: 1, name: "Samsung 32\" LED TV", price: 4500, category: "electronics", condition: "Good", image: "📺" },
  { id: 2, name: "Wooden Study Table", price: 1200, category: "furniture", condition: "Fair", image: "🪑" },
  { id: 3, name: "Levi's Denim Jacket", price: 800, category: "clothes", condition: "Like New", image: "🧥" },
  { id: 4, name: "Geometry Box Set", price: 150, category: "stationery", condition: "Good", image: "📐" },
  { id: 5, name: "Ceiling Fan - Havells", price: 600, category: "electronics", condition: "Working", image: "🌀" },
  { id: 6, name: "Queen Size Bed Frame", price: 3500, category: "furniture", condition: "Good", image: "🛏️" },
  { id: 7, name: "Nike Running Shoes (Size 9)", price: 1000, category: "clothes", condition: "Lightly Used", image: "👟" },
  { id: 8, name: "Kitchen Utensils Set", price: 350, category: "other", condition: "Good", image: "🍳" },
];

const BuyPage = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

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
          {/* Search */}
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
        {/* Category Filter */}
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
              <div key={product.id} className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-md transition-shadow group">
                <div className="bg-secondary h-40 flex items-center justify-center text-5xl">
                  {product.image}
                </div>
                <div className="p-4">
                  <h4 className="font-display font-semibold text-sm mb-1 group-hover:text-primary transition-colors">{product.name}</h4>
                  <p className="text-xs text-muted-foreground mb-2">Condition: {product.condition}</p>
                  <p className="font-display font-bold text-accent text-lg">₹{product.price.toLocaleString("en-IN")}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyPage;
