import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Users, Trash2, Edit2, Save, X, Plus, Upload, Image } from "lucide-react";
import { toast } from "sonner";

interface TeamMember {
  id: string;
  name: string;
  title: string;
  role_label: string;
  description: string | null;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  photo_url: string | null;
  display_order: number;
  is_founder: boolean;
}

const emptyForm = {
  name: "", title: "", role_label: "", description: "", email: "", phone: "", whatsapp: "", photo_url: "", display_order: 0, is_founder: false,
};

const ManageTeam = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<typeof emptyForm>(emptyForm);
  const [adding, setAdding] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMembers = async () => {
    setLoading(true);
    const { data } = await supabase.from("team_members").select("*").order("display_order");
    if (data) setMembers(data as unknown as TeamMember[]);
    setLoading(false);
  };

  useEffect(() => { fetchMembers(); }, []);

  const uploadPhoto = async (file: File) => {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("team-photos").upload(fileName, file, { upsert: true });
    if (error) {
      toast.error("Photo upload failed");
      setUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage.from("team-photos").getPublicUrl(fileName);
    setForm((prev) => ({ ...prev, photo_url: urlData.publicUrl }));
    toast.success("Photo uploaded!");
    setUploading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadPhoto(file);
    e.target.value = "";
  };

  const startEdit = (m: TeamMember) => {
    setEditingId(m.id);
    setAdding(false);
    setForm({
      name: m.name, title: m.title, role_label: m.role_label,
      description: m.description || "", email: m.email || "",
      phone: m.phone || "", whatsapp: m.whatsapp || "",
      photo_url: m.photo_url || "", display_order: m.display_order,
      is_founder: m.is_founder,
    });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    const { error } = await supabase.from("team_members").update({
      name: form.name, title: form.title, role_label: form.role_label,
      description: form.description || null, email: form.email || null,
      phone: form.phone || null, whatsapp: form.whatsapp || null,
      photo_url: form.photo_url || null, display_order: form.display_order,
      is_founder: form.is_founder,
    }).eq("id", editingId);
    if (error) toast.error("Failed to update");
    else { toast.success("Updated!"); setEditingId(null); fetchMembers(); }
  };

  const addMember = async () => {
    const { error } = await supabase.from("team_members").insert({
      name: form.name, title: form.title, role_label: form.role_label,
      description: form.description || null, email: form.email || null,
      phone: form.phone || null, whatsapp: form.whatsapp || null,
      photo_url: form.photo_url || null, display_order: form.display_order,
      is_founder: form.is_founder,
    });
    if (error) toast.error("Failed to add");
    else { toast.success("Member added!"); setAdding(false); setForm(emptyForm); fetchMembers(); }
  };

  const deleteMember = async (id: string) => {
    const { error } = await supabase.from("team_members").delete().eq("id", id);
    if (error) toast.error("Failed to delete");
    else { toast.success("Removed!"); fetchMembers(); }
  };

  const inputCls = "w-full px-2 py-1 rounded border border-border bg-background text-sm";

  const renderForm = (onSave: () => void) => (
    <div className="space-y-2 mt-3 pt-3 border-t border-border">
      <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" className={inputCls} />
      <input value={form.role_label} onChange={(e) => setForm({ ...form, role_label: e.target.value })} placeholder="Role Label (e.g. CEO)" className={inputCls} />
      <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Full Title" className={inputCls} />
      <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={2} className={`${inputCls} resize-none`} />
      <div className="grid grid-cols-2 gap-2">
        <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className={inputCls} />
        <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" className={inputCls} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <input value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} placeholder="WhatsApp" className={inputCls} />
        <input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })} placeholder="Order" className={inputCls} />
      </div>

      {/* Photo upload */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground">Photo</label>
        <div className="flex items-center gap-2">
          {form.photo_url && (
            <img src={form.photo_url} alt="Preview" className="w-10 h-10 rounded-full object-cover border border-border" />
          )}
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-1 px-3 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <>Uploading...</>
            ) : (
              <><Upload className="h-3 w-3" /> {form.photo_url ? "Change Photo" : "Upload Photo"}</>
            )}
          </button>
          {form.photo_url && (
            <button
              type="button"
              onClick={() => setForm({ ...form, photo_url: "" })}
              className="text-xs text-destructive hover:underline"
            >
              Remove
            </button>
          )}
        </div>
      </div>

      <label className="flex items-center gap-2 text-xs">
        <input type="checkbox" checked={form.is_founder} onChange={(e) => setForm({ ...form, is_founder: e.target.checked })} />
        Founder (premium card)
      </label>
      <div className="flex gap-2">
        <button onClick={onSave} className="flex items-center gap-1 px-3 py-1 rounded-md bg-green-500/10 text-green-600 text-xs font-medium hover:bg-green-500/20 transition-colors">
          <Save className="h-3 w-3" /> Save
        </button>
        <button onClick={() => { setEditingId(null); setAdding(false); }} className="flex items-center gap-1 px-3 py-1 rounded-md bg-muted text-muted-foreground text-xs font-medium hover:bg-muted/80 transition-colors">
          <X className="h-3 w-3" /> Cancel
        </button>
      </div>
    </div>
  );

  if (loading) return <div className="text-sm text-muted-foreground">Loading team...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-bold flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" /> Manage Team ({members.length})
        </h3>
        <button
          onClick={() => { setAdding(true); setEditingId(null); setForm(emptyForm); }}
          className="flex items-center gap-1 px-3 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
        >
          <Plus className="h-3 w-3" /> Add Member
        </button>
      </div>

      {adding && (
        <div className="bg-background rounded-lg border border-border p-3">
          <p className="text-sm font-medium mb-1">New Team Member</p>
          {renderForm(addMember)}
        </div>
      )}

      <div className="space-y-2">
        {members.map((m) => (
          <div key={m.id} className="bg-background rounded-lg border border-border p-3">
            <div className="flex items-center gap-3">
              {m.photo_url && (
                <img src={m.photo_url} alt={m.name} className="w-8 h-8 rounded-full object-cover border border-border" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {m.name} {m.is_founder && <span className="text-primary text-xs">★ Founder</span>}
                </p>
                <p className="text-xs text-muted-foreground">{m.role_label} · {m.title}</p>
              </div>
              <button onClick={() => startEdit(m)} className="flex items-center gap-1 px-2 py-1 rounded-md bg-primary/10 text-primary text-xs hover:bg-primary/20 transition-colors">
                <Edit2 className="h-3 w-3" /> Edit
              </button>
              <button onClick={() => deleteMember(m.id)} className="flex items-center gap-1 px-2 py-1 rounded-md bg-destructive/10 text-destructive text-xs hover:bg-destructive/20 transition-colors">
                <Trash2 className="h-3 w-3" /> Delete
              </button>
            </div>
            {editingId === m.id && renderForm(saveEdit)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageTeam;
