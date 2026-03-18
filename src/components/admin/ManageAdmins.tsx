import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Shield, UserPlus, Trash2, Search } from "lucide-react";
import { toast } from "sonner";

interface AdminUser {
  user_id: string;
  email: string;
  full_name: string | null;
}

const ManageAdmins = () => {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [adding, setAdding] = useState(false);

  const fetchAdmins = async () => {
    setLoading(true);
    const { data: roles } = await supabase
      .from("user_roles")
      .select("user_id, role")
      .eq("role", "admin");

    if (roles && roles.length > 0) {
      const userIds = roles.map((r) => r.user_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, email, full_name")
        .in("id", userIds);

      setAdmins(
        (profiles || []).map((p) => ({
          user_id: p.id,
          email: p.email,
          full_name: p.full_name,
        }))
      );
    } else {
      setAdmins([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const addAdmin = async () => {
    if (!email.trim()) return;
    setAdding(true);

    // Find user by email
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

    // Check if already admin
    const { data: existing } = await supabase
      .from("user_roles")
      .select("id")
      .eq("user_id", profile.id)
      .eq("role", "admin")
      .maybeSingle();

    if (existing) {
      toast.error("This user is already an admin.");
      setAdding(false);
      return;
    }

    const { error } = await supabase
      .from("user_roles")
      .insert({ user_id: profile.id, role: "admin" });

    if (error) {
      toast.error("Failed to add admin: " + error.message);
    } else {
      toast.success("Admin added successfully!");
      setEmail("");
      fetchAdmins();
    }
    setAdding(false);
  };

  const removeAdmin = async (userId: string) => {
    const { error } = await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", userId)
      .eq("role", "admin");

    if (error) {
      toast.error("Failed to remove admin: " + error.message);
    } else {
      toast.success("Admin removed.");
      fetchAdmins();
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-display text-lg font-bold flex items-center gap-2">
        <Shield className="h-5 w-5 text-primary" />
        Manage Secondary Admins
      </h3>

      {/* Add admin form */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="email"
            placeholder="Enter user email to add as admin..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <button
          onClick={addAdmin}
          disabled={adding || !email.trim()}
          className="flex items-center gap-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-50"
        >
          <UserPlus className="h-4 w-4" />
          Add
        </button>
      </div>

      {/* Admin list */}
      {loading ? (
        <div className="text-sm text-muted-foreground">Loading admins...</div>
      ) : admins.length === 0 ? (
        <p className="text-sm text-muted-foreground">No secondary admins yet.</p>
      ) : (
        <div className="space-y-2">
          {admins.map((admin) => (
            <div
              key={admin.user_id}
              className="flex items-center justify-between bg-background rounded-lg border border-border p-3"
            >
              <div>
                <p className="text-sm font-medium text-foreground">
                  {admin.full_name || "No name"}
                </p>
                <p className="text-xs text-muted-foreground">{admin.email}</p>
              </div>
              <button
                onClick={() => removeAdmin(admin.user_id)}
                className="p-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                title="Remove admin"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageAdmins;
