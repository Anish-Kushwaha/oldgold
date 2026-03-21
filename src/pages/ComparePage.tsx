import { Link } from "react-router-dom";
import { GitCompareArrows, Trash2, ArrowLeft, Package } from "lucide-react";
import { useCompare } from "@/hooks/useCompare";

const ComparePage = () => {
  const { items, removeFromCompare, clearCompare } = useCompare();

  if (items.length === 0) {
    return (
      <div className="animate-fade-in">
        <div className="container py-16 text-center max-w-lg mx-auto">
          <GitCompareArrows className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold mb-2">No Items to Compare</h2>
          <p className="text-muted-foreground mb-6">Add up to 4 items to compare their details side by side.</p>
          <Link to="/buy" className="inline-flex items-center gap-2 gold-gradient text-primary-foreground font-display font-semibold px-6 py-2.5 rounded-lg">
            <ArrowLeft className="h-4 w-4" /> Browse Items
          </Link>
        </div>
      </div>
    );
  }

  const fields = [
    { label: "Price", render: (i: typeof items[0]) => `₹${i.price.toLocaleString("en-IN")}` },
    { label: "Category", render: (i: typeof items[0]) => i.category },
    { label: "Condition", render: (i: typeof items[0]) => i.condition },
    { label: "Brand", render: (i: typeof items[0]) => i.brand || "—" },
    { label: "Power Rating", render: (i: typeof items[0]) => i.power_rating || "—" },
    { label: "Size", render: (i: typeof items[0]) => i.size || "—" },
  ];

  return (
    <div className="animate-fade-in">
      <div className="bg-card border-b border-border">
        <div className="container py-6 flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold flex items-center gap-2">
            <GitCompareArrows className="h-6 w-6 text-primary" /> Compare ({items.length})
          </h2>
          <button onClick={clearCompare} className="text-sm text-muted-foreground hover:text-destructive transition-colors">Clear All</button>
        </div>
      </div>
      <div className="container py-6 overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr>
              <th className="text-left p-3 text-xs text-muted-foreground font-semibold uppercase">Feature</th>
              {items.map(item => (
                <th key={item.id} className="p-3 text-center min-w-[160px]">
                  <Link to={`/buy?item=${item.id}`} className="block">
                    <div className="w-24 h-24 mx-auto rounded-lg overflow-hidden bg-secondary mb-2">
                      {item.image_url ? <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Package className="h-8 w-8 text-muted-foreground" /></div>}
                    </div>
                    <p className="font-display font-semibold text-sm hover:text-primary transition-colors">{item.name}</p>
                  </Link>
                  <button onClick={() => removeFromCompare(item.id)} className="mt-1 text-xs text-destructive hover:underline flex items-center gap-1 mx-auto">
                    <Trash2 className="h-3 w-3" /> Remove
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fields.map(field => (
              <tr key={field.label} className="border-t border-border">
                <td className="p-3 text-sm font-medium text-muted-foreground">{field.label}</td>
                {items.map(item => (
                  <td key={item.id} className="p-3 text-center text-sm font-semibold">{field.render(item)}</td>
                ))}
              </tr>
            ))}
            <tr className="border-t border-border">
              <td className="p-3 text-sm font-medium text-muted-foreground">Description</td>
              {items.map(item => (
                <td key={item.id} className="p-3 text-center text-xs text-muted-foreground">{item.description || "—"}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComparePage;
