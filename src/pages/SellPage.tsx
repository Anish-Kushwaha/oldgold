import { LogIn } from "lucide-react";

const SellPage = () => {
  return (
    <div className="animate-fade-in">
      <div className="bg-card border-b border-border">
        <div className="container py-8">
          <h2 className="font-display text-3xl font-bold mb-2">Sell Your Items</h2>
          <p className="text-muted-foreground">List your pre-owned items and reach buyers directly.</p>
        </div>
      </div>

      <div className="container py-12 max-w-lg mx-auto text-center">
        <div className="bg-card rounded-lg border border-border p-8">
          <LogIn className="h-12 w-12 text-primary mx-auto mb-4" />
          <h3 className="font-display text-xl font-bold mb-2">Seller Login Required</h3>
          <p className="text-sm text-muted-foreground mb-6">
            To sell on OldGold, you need a seller account. Log in or register below. Your account will be reviewed and approved by our admin team.
          </p>
          <div className="space-y-3">
            <input
              type="email"
              placeholder="Email Address"
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <button className="w-full bg-primary text-primary-foreground font-display font-semibold py-2 rounded-lg hover:opacity-90 transition-opacity">
              Login / Register
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            After login, complete your profile with contact details to start listing products.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SellPage;
