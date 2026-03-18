import { ShoppingBag, Tag, Shield, Users } from "lucide-react";

const features = [
  { icon: ShoppingBag, title: "Buy Affordable Items", desc: "Find electronics, furniture, clothes and more at unbeatable prices from your community." },
  { icon: Tag, title: "Sell Your Stuff", desc: "List your unused household items and turn them into cash. Simple listing process." },
  { icon: Shield, title: "Trusted Community", desc: "Verified sellers and transparent product details for a safe buying experience." },
  { icon: Users, title: "Direct Connection", desc: "Connect directly with buyers and sellers in your area. No middlemen." },
];

const categories = ["Electronics", "Furniture", "Clothes", "Stationery", "Other Items"];

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
            <a href="/buy" className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-display font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity">
              Start Browsing
            </a>
            <a href="/sell" className="inline-flex items-center gap-2 bg-accent text-accent-foreground font-display font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity">
              Sell Now
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-16">
        <h3 className="font-display text-2xl font-bold text-center mb-10">How OldGold Works</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div key={f.title} className="bg-card rounded-lg p-6 text-center hover:shadow-md transition-shadow">
              <f.icon className="h-10 w-10 text-primary mx-auto mb-4" />
              <h4 className="font-display font-semibold mb-2">{f.title}</h4>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Preview */}
      <section className="bg-card py-16">
        <div className="container text-center">
          <h3 className="font-display text-2xl font-bold mb-8">Browse Categories</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <a
                key={cat}
                href="/buy"
                className="bg-background border border-border rounded-full px-6 py-2 font-display text-sm font-medium hover:border-primary hover:text-primary transition-colors"
              >
                {cat}
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
