import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Save, User } from "lucide-react";
import { toast } from "sonner";

interface Profile {
  phone: string;
  whatsapp: string;
  address: string;
  extra_details: string;
}

const SellerProfileForm = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile>({
    phone: "",
    whatsapp: "",
    address: "",
    extra_details: "",
  });
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("phone, whatsapp, address, extra_details")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setProfile({
            phone: data.phone || "",
            whatsapp: data.whatsapp || "",
            address: data.address || "",
            extra_details: (data as any).extra_details || "",
          });
        }
        setLoaded(true);
      });
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    if (!profile.phone.trim() || !profile.whatsapp.trim() || !profile.address.trim()) {
      toast.error("Phone, WhatsApp, and Address are required.");
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        phone: profile.phone.trim(),
        whatsapp: profile.whatsapp.trim(),
        address: profile.address.trim(),
        extra_details: profile.extra_details.trim() || null,
      } as any)
      .eq("id", user.id);

    if (error) {
      toast.error("Failed to save: " + error.message);
    } else {
      toast.success("Profile saved!");
    }
    setSaving(false);
  };

  const isComplete = profile.phone.trim() && profile.whatsapp.trim() && profile.address.trim();

  if (!loaded) return <div className="text-sm text-muted-foreground">Loading profile...</div>;

  return (
    <div className="space-y-4">
      <h3 className="font-display text-lg font-bold flex items-center gap-2">
        <User className="h-5 w-5 text-primary" />
        Your Contact Details
      </h3>
      {!isComplete && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
          <p className="text-sm text-yellow-600 font-medium">
            ⚠️ Please complete your contact details before listing products.
          </p>
        </div>
      )}
      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground">Email Address</label>
          <input
            type="email"
            value={user?.email || ""}
            disabled
            className="w-full px-3 py-2 rounded-lg border border-border bg-muted text-foreground text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">Phone No. *</label>
          <input
            type="tel"
            placeholder="+91 XXXXXXXXXX"
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">WhatsApp No. *</label>
          <input
            type="tel"
            placeholder="+91 XXXXXXXXXX"
            value={profile.whatsapp}
            onChange={(e) => setProfile({ ...profile, whatsapp: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">Address Details *</label>
          <textarea
            placeholder="Full address..."
            value={profile.address}
            onChange={(e) => setProfile({ ...profile, address: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">Other Details (Social media, website, etc.)</label>
          <textarea
            placeholder="Instagram, Facebook, website URL, or any other info..."
            value={profile.extra_details}
            onChange={(e) => setProfile({ ...profile, extra_details: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
          />
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </div>
  );
};

export default SellerProfileForm;
