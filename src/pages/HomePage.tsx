import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Tag, Shield, Users, ArrowRight, Star, Sparkles, Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const features = [
  { icon: ShoppingBag, title: "Buy Affordable Items", desc: "Find electronics, furniture, clothes and more at unbeatable prices from your community." },
  { icon: Tag, title: "Sell Your Stuff", desc: "List your unused household items and turn them into cash. Simple listing process." },
  { icon: Shield, title: "Trusted Community", desc: "Verified sellers and transparent product details for a safe buying experience." },
  { icon: Users, title: "Direct Connection", desc: "Connect directly with buyers and sellers in your area. No middlemen." },
];

const categories = ["Electronics", "Furniture", "Clothes", "Stationery", "Other Items"];

interface FeaturedProduct {
  id: string;
  name: string;
  price: number;
  category: string;
  condition: string;
  image_url: string | null;
  description: string | null;
}

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      const { data } = await supabase
        .from("products")
        .select("id, name, price, category, condition, image_url, description")
        .eq("is_approved", true)
        .eq("is_sold", false)
        .order("created_at", { ascending: false })
        .limit(6);
      if (data) setFeaturedProducts(data);
    };
    fetchFeatured();
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="container text-center max-w-3xl relative">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-6 tracking-wide">
            <Sparkles className="h-3.5 w-3.5" />
            PREMIUM MARKETPLACE
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
            Give Your Items a{" "}
            <span className="gold-text">Second Life</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            OldGold is a curated marketplace for pre-owned household items, electronics, clothes, and more — all at exceptional prices.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/buy"
              className="inline-flex items-center gap-2 gold-gradient text-primary-foreground font-display font-semibold px-7 py-3 rounded-lg gold-shadow hover:opacity-90 transition-all tracking-wide"
            >
              Start Browsing
            </Link>
            <Link
              to="/sell"
              className="inline-flex items-center gap-2 bg-accent text-accent-foreground font-display font-semibold px-7 py-3 rounded-lg hover:opacity-90 transition-all tracking-wide"
            >
              Sell Now
            </Link>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="h-px gold-gradient opacity-30" />
      </div>

      {/* Featured Products from DB */}
      <section className="container py-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Star className="h-6 w-6 text-primary" />
            <h3 className="font-display text-2xl font-bold">Latest Listings</h3>
          </div>
          <Link to="/buy" className="flex items-center gap-1 text-sm font-display font-semibold text-primary hover:underline">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {featuredProducts.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No products listed yet. Be the first to sell!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                to={`/buy?item=${product.id}`}
                className="bg-card rounded-lg border border-border overflow-hidden hover:gold-shadow hover:border-primary/30 transition-all group"
              >
                <div className="bg-secondary h-44 flex items-center justify-center relative">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <Package className="h-12 w-12 text-muted-foreground" />
                  )}
                  <span className="absolute top-3 left-3 gold-gradient text-primary-foreground text-[10px] font-display font-bold px-2.5 py-0.5 rounded-full uppercase tracking-widest">
                    New
                  </span>
                </div>
                <div className="p-4">
                  <h4 className="font-display font-semibold mb-1 group-hover:text-primary transition-colors">{product.name}</h4>
                  {product.description && <p className="text-xs text-muted-foreground mb-1 line-clamp-2">{product.description}</p>}
                  <p className="text-xs text-muted-foreground mb-2">Condition: {product.condition}</p>
                  <div className="flex items-center justify-between">
                    <p className="font-display font-bold text-primary text-lg">₹{product.price.toLocaleString("en-IN")}</p>
                    <span className="text-xs font-display text-primary font-semibold flex items-center gap-1">
                      View Details <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <div className="container">
        <div className="h-px gold-gradient opacity-30" />
      </div>

      {/* Features */}
      <section className="py-16">
        <div className="container">
          <h3 className="font-display text-2xl font-bold text-center mb-10">How <span className="gold-text">OldGold</span> Works</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-card rounded-lg p-6 text-center border border-border hover:border-primary/30 hover:gold-shadow transition-all">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-display font-semibold mb-2">{f.title}</h4>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container py-16 text-center">
        <h3 className="font-display text-2xl font-bold mb-8">Browse Categories</h3>
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((cat) => (
            <Link
              key={cat}
              to="/buy"
              className="bg-card border border-border rounded-full px-6 py-2 font-display text-sm font-medium hover:border-primary hover:text-primary hover:gold-shadow transition-all"
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
