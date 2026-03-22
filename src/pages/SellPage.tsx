import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { LogIn, LogOut, Package, Shield, Store, Users, Crown } from "lucide-react";
import { toast } from "sonner";
import ManageAdmins from "@/components/admin/ManageAdmins";
import ManageSellers from "@/components/admin/ManageSellers";
import ManageProducts from "@/components/admin/ManageProducts";
import ManageTeam from "@/components/admin/ManageTeam";
import SellerProfileForm from "@/components/seller/SellerProfileForm";
import AddProductForm from "@/components/seller/AddProductForm";
import MyProducts from "@/components/seller/MyProducts";

const SellPage = () => {
  const { user, loading, signIn, signUp, signOut, isAdmin, isSupremeAdmin, roles } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"admins" | "sellers" | "products" | "team">("sellers");
  const [productRefresh, setProductRefresh] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    if (isRegister) {
      const { error } = await signUp(email, password, fullName);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Account created! You can now log in.");
        setIsRegister(false);
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Logged in successfully!");
      }
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  // Logged in view
  if (user) {
    const isSeller = roles.includes("seller");

    return (
      <div className="animate-fade-in">
        <div className="bg-card border-b border-border">
          <div className="container py-6">
            <h2 className="font-display text-2xl font-bold mb-1">
              {isSupremeAdmin ? "Supreme Admin Dashboard" : isAdmin ? "Admin Dashboard" : "Seller Dashboard"}
            </h2>
            <p className="text-sm text-muted-foreground">Welcome, {user.email}</p>
            <div className="flex gap-2 flex-wrap mt-2">
              {roles.map((role) => (
                <span key={role} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                  <Shield className="h-3 w-3" />
                  {role.replace("_", " ").toUpperCase()}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="container py-6 max-w-2xl mx-auto space-y-6">
          {/* Supreme Admin Panel */}
          {isSupremeAdmin && (
            <>
              <div className="flex gap-1 bg-muted rounded-lg p-1">
                <button
                  onClick={() => setActiveTab("admins")}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "admins" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Users className="h-4 w-4" /> Admins
                </button>
                <button
                  onClick={() => setActiveTab("sellers")}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "sellers" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Store className="h-4 w-4" /> Sellers
                </button>
                <button
                  onClick={() => setActiveTab("products")}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "products" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Package className="h-4 w-4" /> Products
                </button>
              </div>

              <div className="bg-card rounded-lg border border-border p-6">
                {activeTab === "admins" && <ManageAdmins />}
                {activeTab === "sellers" && <ManageSellers />}
                {activeTab === "products" && <ManageProducts />}
              </div>
            </>
          )}

          {/* Secondary Admin Panel */}
          {isAdmin && !isSupremeAdmin && (
            <div className="space-y-6">
              <div className="bg-card rounded-lg border border-border p-6">
                <ManageSellers />
              </div>
              <div className="bg-card rounded-lg border border-border p-6">
                <ManageProducts />
              </div>
            </div>
          )}

          {/* Seller view */}
          {!isAdmin && isSeller && (
            <div className="space-y-6">
              <div className="bg-card rounded-lg border border-border p-6">
                <SellerProfileForm />
              </div>
              <div className="bg-card rounded-lg border border-border p-6">
                <AddProductForm onProductAdded={() => setProductRefresh((r) => r + 1)} />
              </div>
              <div className="bg-card rounded-lg border border-border p-6">
                <MyProducts refreshKey={productRefresh} />
              </div>
            </div>
          )}

          {/* Regular user */}
          {!isAdmin && !isSeller && (
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="font-display text-lg font-bold mb-2">Seller Status</h3>
              <p className="text-sm text-muted-foreground">
                Your account doesn't have seller privileges yet. Contact an admin to get approved as a seller.
              </p>
            </div>
          )}

          <button
            onClick={signOut}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </div>
    );
  }

  // Login/Register form
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
          <h3 className="font-display text-xl font-bold mb-2">
            {isRegister ? "Create Account" : "Seller Login"}
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            {isRegister ? "Create your account to start selling on OldGold." : "Log in to your seller account or register below."}
          </p>
          <form onSubmit={handleSubmit} className="space-y-3">
            {isRegister && (
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            )}
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary text-primary-foreground font-display font-semibold py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {submitting ? "Please wait..." : isRegister ? "Create Account" : "Login"}
            </button>
          </form>
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-xs text-primary mt-4 hover:underline"
          >
            {isRegister ? "Already have an account? Login" : "Don't have an account? Register"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellPage;
