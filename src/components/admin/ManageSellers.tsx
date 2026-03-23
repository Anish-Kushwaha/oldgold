import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Store, UserPlus, Trash2, Check, X, Search, Clock } from "lucide-react";
import { toast } from "sonner";

interface SellerProfile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  whatsapp: string | null;
  address: string | null;
  is_seller_approved: boolean;
  seller_requested: boolean;
  has_seller_role: boolean;
}

const ManageSellers = () => {
  const { isSupremeAdmin } = useAuth();
  const [sellers, setSellers] = useState<SellerProfile[]>([]);
  const [pendingRequests, setPendingRequests] = useState<SellerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [adding, setAdding] = useState(false);

  const fetchSellers = async () => {
    setLoading(true);

    // Get all users with seller role
    const { data: roles } = await supabase
      .from("user_roles")
      .select("user_id")
      .eq("role", "seller");

    const sellerUserIds = (roles || []).map((r) => r.user_id);

    // Get all profiles
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, email, full_name, phone, whatsapp, address, is_seller_approved, seller_requested");

    if (profiles) {
      // Current sellers (have seller role)
      const currentSellers = profiles
        .filter((p) => sellerUserIds.includes(p.id))
        .map((p) => ({
          ...p,
          has_seller_role: true,
        }));
      setSellers(currentSellers);

      // Pending requests (requested but don't have seller role yet)
      const pending = profiles
        .filter((p) => p.seller_requested && !sellerUserIds.includes(p.id))
        .map((p) => ({
          ...p,
          has_seller_role: false,
        }));
      setPendingRequests(pending);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  const addSeller = async () => {
    if (!email.trim()) return;
    setAdding(true);

    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email.trim().toLowerCase())
      .maybeSingle();

    if (!profile) {
      toast.error("No user found with that email. They must register first.");
      setAdding(false);
      return;
    }

    const { data: existing } = await supabase
      .from("user_roles")
      .select("id")
      .eq("user_id", profile.id)
      .eq("role", "seller")
      .maybeSingle();

    if (existing) {
      toast.error("This user already has the seller role.");
      setAdding(false);
      return;
    }

    const { error: roleError } = await supabase
      .from("user_roles")
      .insert({ user_id: profile.id, role: "seller" });

    if (roleError) {
      toast.error("Failed to add seller role: " + roleError.message);
      setAdding(false);
      return;
    }

    await supabase
      .from("profiles")
      .update({ is_seller_approved: true, seller_requested: false })
      .eq("id", profile.id);

    toast.success("Seller added and approved!");
    setEmail("");
    fetchSellers();
    setAdding(false);
  };

  const approveRequest = async (userId: string) => {
    // Add seller role
    const { error: roleError } = await supabase
      .from("user_roles")
      .insert({ user_id: userId, role: "seller" });

    if (roleError) {
      toast.error("Failed to approve: " + roleError.message);
      return;
    }

    await supabase
      .from("profiles")
      .update({ is_seller_approved: true, seller_requested: false })
      .eq("id", userId);

    toast.success("Seller approved!");
    fetchSellers();
  };

  const rejectRequest = async (userId: string) => {
    await supabase
      .from("profiles")
      .update({ seller_requested: false })
      .eq("id", userId);

    toast.success("Request rejected.");
    fetchSellers();
  };

  const approveSeller = async (userId: string) => {
    const { error } = await supabase
      .from("profiles")
      .update({ is_seller_approved: true })
      .eq("id", userId);

    if (error) {
      toast.error("Failed to approve seller.");
    } else {
      toast.success("Seller approved!");
      fetchSellers();
    }
  };

  const rejectSeller = async (userId: string) => {
    await supabase
      .from("profiles")
      .update({ is_seller_approved: false })
      .eq("id", userId);

    toast.success("Seller rejected.");
    fetchSellers();
  };

  const removeSeller = async (userId: string) => {
    await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", userId)
      .eq("role", "seller");

    await supabase
      .from("profiles")
      .update({ is_seller_approved: false })
      .eq("id", userId);

    toast.success("Seller removed.");
    fetchSellers();
  };

  return (
    <div className="space-y-6">
      <h3 className="font-display text-lg font-bold flex items-center gap-2">
        <Store className="h-5 w-5 text-primary" />
        Manage Sellers
      </h3>

      {/* Pending Seller Requests */}
      {pendingRequests.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold flex items-center gap-2 text-amber-600">
            <Clock className="h-4 w-4" />
            Pending Seller Requests ({pendingRequests.length})
          </h4>
          <div className="space-y-2">
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                className="bg-amber-500/5 rounded-lg border border-amber-500/20 p-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {req.full_name || "No name"}
                    </p>
                    <p className="text-xs text-muted-foreground">{req.email}</p>
                    {req.phone && (
                      <p className="text-xs text-muted-foreground">📞 {req.phone}</p>
                    )}
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600">
                    New Request
                  </span>
                </div>
                <div className="flex gap-2 mt-2 pt-2 border-t border-amber-500/20">
                  <button
                    onClick={() => approveRequest(req.id)}
                    className="flex items-center gap-1 px-3 py-1 rounded-md bg-green-500/10 text-green-600 text-xs font-medium hover:bg-green-500/20 transition-colors"
                  >
                    <Check className="h-3 w-3" /> Approve
                  </button>
                  <button
                    onClick={() => rejectRequest(req.id)}
                    className="flex items-center gap-1 px-3 py-1 rounded-md bg-destructive/10 text-destructive text-xs font-medium hover:bg-destructive/20 transition-colors"
                  >
                    <X className="h-3 w-3" /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Manual add seller form */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="email"
            placeholder="Or manually add by email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <button
          onClick={addSeller}
          disabled={adding || !email.trim()}
          className="flex items-center gap-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-50"
        >
          <UserPlus className="h-4 w-4" />
          Add
        </button>
      </div>

      {/* Current Sellers list */}
      <div>
        <h4 className="text-sm font-semibold mb-2 text-muted-foreground">Current Sellers</h4>
        {loading ? (
          <div className="text-sm text-muted-foreground">Loading sellers...</div>
        ) : sellers.length === 0 ? (
          <p className="text-sm text-muted-foreground">No sellers yet.</p>
        ) : (
          <div className="space-y-2">
            {sellers.map((seller) => (
              <div
                key={seller.id}
                className="bg-background rounded-lg border border-border p-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {seller.full_name || "No name"}
                    </p>
                    <p className="text-xs text-muted-foreground">{seller.email}</p>
                    {seller.phone && (
                      <p className="text-xs text-muted-foreground">📞 {seller.phone}</p>
                    )}
                    {seller.whatsapp && (
                      <p className="text-xs text-muted-foreground">💬 {seller.whatsapp}</p>
                    )}
                    {seller.address && (
                      <p className="text-xs text-muted-foreground">📍 {seller.address}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        seller.is_seller_approved
                          ? "bg-green-500/10 text-green-600"
                          : "bg-yellow-500/10 text-yellow-600"
                      }`}
                    >
                      {seller.is_seller_approved ? "Approved" : "Pending"}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 mt-2 pt-2 border-t border-border">
                  {!seller.is_seller_approved && (
                    <button
                      onClick={() => approveSeller(seller.id)}
                      className="flex items-center gap-1 px-3 py-1 rounded-md bg-green-500/10 text-green-600 text-xs font-medium hover:bg-green-500/20 transition-colors"
                    >
                      <Check className="h-3 w-3" /> Approve
                    </button>
                  )}
                  {seller.is_seller_approved && (
                    <button
                      onClick={() => rejectSeller(seller.id)}
                      className="flex items-center gap-1 px-3 py-1 rounded-md bg-yellow-500/10 text-yellow-600 text-xs font-medium hover:bg-yellow-500/20 transition-colors"
                    >
                      <X className="h-3 w-3" /> Reject
                    </button>
                  )}
                  <button
                    onClick={() => removeSeller(seller.id)}
                    className="flex items-center gap-1 px-3 py-1 rounded-md bg-destructive/10 text-destructive text-xs font-medium hover:bg-destructive/20 transition-colors"
                  >
                    <Trash2 className="h-3 w-3" /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageSellers;
