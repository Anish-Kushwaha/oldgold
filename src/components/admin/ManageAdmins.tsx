import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Shield, UserPlus, Trash2, Search, KeyRound, Edit2, X, Save } from "lucide-react";
import { toast } from "sonner";

interface AdminUser {
  user_id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  whatsapp: string | null;
  address: string | null;
}

const ManageAdmins = () => {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ full_name: "", phone: "", whatsapp: "", address: "" });
  const [passwordModal, setPasswordModal] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

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
        .select("id, email, full_name, phone, whatsapp, address")
        .in("id", userIds);

      setAdmins(
        (profiles || []).map((p) => ({
          user_id: p.id,
          email: p.email,
          full_name: p.full_name,
          phone: p.phone,
          whatsapp: p.whatsapp,
          address: p.address,
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

  const startEdit = (admin: AdminUser) => {
    setEditingId(admin.user_id);
    setEditForm({
      full_name: admin.full_name || "",
      phone: admin.phone || "",
      whatsapp: admin.whatsapp || "",
      address: admin.address || "",
    });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: editForm.full_name || null,
        phone: editForm.phone || null,
        whatsapp: editForm.whatsapp || null,
        address: editForm.address || null,
      })
      .eq("id", editingId);

    if (error) {
      toast.error("Failed to update: " + error.message);
    } else {
      toast.success("Admin details updated!");
      setEditingId(null);
      fetchAdmins();
    }
  };

  const changePassword = async () => {
    if (!passwordModal || !newPassword.trim() || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    setChangingPassword(true);

    const { data, error } = await supabase.functions.invoke("admin-update-user", {
      body: { target_user_id: passwordModal, new_password: newPassword },
    });

    if (error || data?.error) {
      toast.error("Failed to change password: " + (data?.error || error?.message));
    } else {
      toast.success("Password changed successfully!");
      setPasswordModal(null);
      setNewPassword("");
    }
    setChangingPassword(false);
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
              className="bg-background rounded-lg border border-border p-3 space-y-2"
            >
              {editingId === admin.user_id ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editForm.full_name}
                    onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                    placeholder="Full Name"
                    className="w-full px-3 py-1.5 rounded-md border border-border bg-background text-foreground text-sm"
                  />
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    placeholder="Phone"
                    className="w-full px-3 py-1.5 rounded-md border border-border bg-background text-foreground text-sm"
                  />
                  <input
                    type="text"
                    value={editForm.whatsapp}
                    onChange={(e) => setEditForm({ ...editForm, whatsapp: e.target.value })}
                    placeholder="WhatsApp"
                    className="w-full px-3 py-1.5 rounded-md border border-border bg-background text-foreground text-sm"
                  />
                  <input
                    type="text"
                    value={editForm.address}
                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                    placeholder="Address"
                    className="w-full px-3 py-1.5 rounded-md border border-border bg-background text-foreground text-sm"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={saveEdit}
                      className="flex items-center gap-1 px-3 py-1 rounded-md bg-green-500/10 text-green-600 text-xs font-medium hover:bg-green-500/20"
                    >
                      <Save className="h-3 w-3" /> Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="flex items-center gap-1 px-3 py-1 rounded-md bg-muted text-muted-foreground text-xs font-medium hover:bg-muted/80"
                    >
                      <X className="h-3 w-3" /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {admin.full_name || "No name"}
                      </p>
                      <p className="text-xs text-muted-foreground">{admin.email}</p>
                      {admin.phone && <p className="text-xs text-muted-foreground">📞 {admin.phone}</p>}
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2 border-t border-border">
                    <button
                      onClick={() => startEdit(admin)}
                      className="flex items-center gap-1 px-3 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
                      title="Edit details"
                    >
                      <Edit2 className="h-3 w-3" /> Edit
                    </button>
                    <button
                      onClick={() => { setPasswordModal(admin.user_id); setNewPassword(""); }}
                      className="flex items-center gap-1 px-3 py-1 rounded-md bg-amber-500/10 text-amber-600 text-xs font-medium hover:bg-amber-500/20 transition-colors"
                      title="Change password"
                    >
                      <KeyRound className="h-3 w-3" /> Password
                    </button>
                    <button
                      onClick={() => removeAdmin(admin.user_id)}
                      className="flex items-center gap-1 px-3 py-1 rounded-md bg-destructive/10 text-destructive text-xs font-medium hover:bg-destructive/20 transition-colors"
                      title="Remove admin"
                    >
                      <Trash2 className="h-3 w-3" /> Remove
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Password Change Modal */}
      {passwordModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg border border-border p-6 w-full max-w-sm space-y-4">
            <h4 className="font-display font-bold text-foreground">Change Admin Password</h4>
            <input
              type="password"
              placeholder="New password (min 6 characters)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength={6}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <div className="flex gap-2">
              <button
                onClick={changePassword}
                disabled={changingPassword || newPassword.length < 6}
                className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-50"
              >
                {changingPassword ? "Changing..." : "Change Password"}
              </button>
              <button
                onClick={() => { setPasswordModal(null); setNewPassword(""); }}
                className="px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAdmins;
