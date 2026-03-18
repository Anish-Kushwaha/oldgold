import { Link } from "react-router-dom";
import { ShoppingBag, Tag, Shield, Users, ArrowRight, Star } from "lucide-react";
import { sampleProducts } from "@/data/products";

const features = [
  { icon: ShoppingBag, title: "Buy Affordable Items", desc: "Find electronics, furniture, clothes and more at unbeatable prices from your community." },
  { icon: Tag, title: "Sell Your Stuff", desc: "List your unused household items and turn them into cash. Simple listing process." },
  { icon: Shield, title: "Trusted Community", desc: "Verified sellers and transparent product details for a safe buying experience." },
  { icon: Users, title: "Direct Connection", desc: "Connect directly with buyers and sellers in your area. No middlemen." },
];

const categories = ["Electronics", "Furniture", "Clothes", "Stationery", "Other Items"];

const featuredProducts = sampleProducts.filter((p) => p.featured);

const HomePage = () => {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="bg-card py-16 md:py-24">
        <div className="container text-center max-w-3xl">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Give Your Items a <span className="text-primary">Second Life</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            OldGold is a community marketplace where you can buy and sell pre-owned household items, electronics, clothes, and more — all at very affordable prices.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/buy" className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-display font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity">
              Start Browsing
            </Link>
            <Link to="/sell" className="inline-flex items-center gap-2 bg-accent text-accent-foreground font-display font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity">
              Sell Now
            </Link>
          </div>
        </div>
      </section>

      {/* Featured / Most Demanding Items */}
      <section className="container py-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Star className="h-6 w-6 text-primary" />
            <h3 className="font-display text-2xl font-bold">Most Demanding Items</h3>
          </div>
          <Link to="/buy" className="flex items-center gap-1 text-sm font-display font-semibold text-primary hover:underline">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <Link
              key={product.id}
              to={`/buy?item=${product.id}`}
              className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow group"
            >
              <div className="bg-secondary h-44 flex items-center justify-center text-6xl relative">
                {product.image}
                <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] font-display font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                  Hot Deal
                </span>
              </div>
              <div className="p-4">
                <h4 className="font-display font-semibold mb-1 group-hover:text-primary transition-colors">{product.name}</h4>
                <p className="text-xs text-muted-foreground mb-1 line-clamp-2">{product.description}</p>
                <p className="text-xs text-muted-foreground mb-2">Condition: {product.condition}</p>
                <div className="flex items-center justify-between">
                  <p className="font-display font-bold text-accent text-lg">₹{product.price.toLocaleString("en-IN")}</p>
                  <span className="text-xs font-display text-primary font-semibold flex items-center gap-1">
                    View Details <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-card py-16">
        <div className="container">
          <h3 className="font-display text-2xl font-bold text-center mb-10">How OldGold Works</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-background rounded-lg p-6 text-center hover:shadow-md transition-shadow">
                <f.icon className="h-10 w-10 text-primary mx-auto mb-4" />
                <h4 className="font-display font-semibold mb-2">{f.title}</h4>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="container py-16 text-center">
        <h3 className="font-display text-2xl font-bold mb-8">Browse Categories</h3>
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((cat) => (
            <Link
              key={cat}
              to="/buy"
              className="bg-card border border-border rounded-full px-6 py-2 font-display text-sm font-medium hover:border-primary hover:text-primary transition-colors"
            >
              {cat}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
