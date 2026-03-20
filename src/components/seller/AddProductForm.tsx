import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { ImagePlus, Package, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

const CATEGORIES = [
  { value: "electronics", label: "Electronics" },
  { value: "furniture", label: "Furniture" },
  { value: "clothes", label: "Clothes" },
  { value: "stationery", label: "Stationery" },
  { value: "other", label: "Others" },
];

const CONDITIONS = [
  { value: "new", label: "New" },
  { value: "like_new", label: "Like New" },
  { value: "used", label: "Used" },
  { value: "fair", label: "Fair" },
];

const AddProductForm = ({ onProductAdded }: { onProductAdded?: () => void }) => {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("other");
  const [condition, setCondition] = useState("used");
  const [brand, setBrand] = useState("");
  const [powerRating, setPowerRating] = useState("");
  const [size, setSize] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newImages = [...images, ...files];
    setImages(newImages);

    const newPreviews = files.map((f) => URL.createObjectURL(f));
    setPreviews([...previews, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setImages(images.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!name.trim() || !price.trim()) {
      toast.error("Product name and price are required.");
      return;
    }
    if (images.length === 0) {
      toast.error("Please add at least one photo.");
      return;
    }
    if (category === "electronics" && (!brand.trim() || !powerRating.trim())) {
      toast.error("Brand and Power Rating are required for Electronics.");
      return;
    }
    if (category === "clothes" && (!brand.trim() || !size.trim())) {
      toast.error("Brand and Size are required for Clothes.");
      return;
    }

    setSubmitting(true);

    // Upload first image as main image
    const mainFile = images[0];
    const mainPath = `${user.id}/${Date.now()}_${mainFile.name}`;
    const { error: uploadErr } = await supabase.storage
      .from("product-images")
      .upload(mainPath, mainFile);

    if (uploadErr) {
      toast.error("Failed to upload image: " + uploadErr.message);
      setSubmitting(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(mainPath);

    // Insert product
    const { data: product, error: prodErr } = await supabase
      .from("products")
      .insert({
        name: name.trim(),
        description: description.trim() || null,
        price: parseFloat(price),
        category,
        condition,
        brand: brand.trim() || null,
        power_rating: powerRating.trim() || null,
        size: size.trim() || null,
        seller_id: user.id,
        image_url: urlData.publicUrl,
        is_approved: true,
      })
      .select("id")
      .single();

    if (prodErr || !product) {
      toast.error("Failed to add product: " + (prodErr?.message || "Unknown error"));
      setSubmitting(false);
      return;
    }

    // Upload additional images and insert into product_images
    const imageInserts = [];
    for (let i = 0; i < images.length; i++) {
      let imgUrl = urlData.publicUrl;
      if (i > 0) {
        const path = `${user.id}/${Date.now()}_${i}_${images[i].name}`;
        const { error: upErr } = await supabase.storage
          .from("product-images")
          .upload(path, images[i]);
        if (upErr) continue;
        const { data: u } = supabase.storage.from("product-images").getPublicUrl(path);
        imgUrl = u.publicUrl;
      }
      imageInserts.push({
        product_id: product.id,
        image_url: imgUrl,
        display_order: i,
      });
    }

    if (imageInserts.length > 0) {
      await supabase.from("product_images").insert(imageInserts);
    }

    toast.success("Product listed successfully!");
    // Reset form
    setName("");
    setDescription("");
    setPrice("");
    setCategory("other");
    setCondition("used");
    setBrand("");
    setPowerRating("");
    setSize("");
    previews.forEach((p) => URL.revokeObjectURL(p));
    setImages([]);
    setPreviews([]);
    onProductAdded?.();
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="font-display text-lg font-bold flex items-center gap-2">
        <Package className="h-5 w-5 text-primary" />
        Add New Product
      </h3>

      <div>
        <label className="text-xs font-medium text-muted-foreground">Product Name *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Samsung Galaxy S21"
          required
          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground">Price (₹ INR) *</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0"
            min="0"
            step="1"
            required
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">Condition</label>
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            {CONDITIONS.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-muted-foreground">Category *</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>

      {/* Category-specific fields */}
      {(category === "electronics" || category === "clothes") && (
        <div>
          <label className="text-xs font-medium text-muted-foreground">Brand Name *</label>
          <input
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="e.g. Samsung, Nike..."
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
      )}

      {category === "electronics" && (
        <div>
          <label className="text-xs font-medium text-muted-foreground">Power Rating *</label>
          <input
            type="text"
            value={powerRating}
            onChange={(e) => setPowerRating(e.target.value)}
            placeholder="e.g. 65W, 1500W..."
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
      )}

      {category === "clothes" && (
        <div>
          <label className="text-xs font-medium text-muted-foreground">Size *</label>
          <input
            type="text"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            placeholder="e.g. M, L, XL, 32..."
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
      )}

      <div>
        <label className="text-xs font-medium text-muted-foreground">Description & Details</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your product in detail..."
          rows={4}
          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
        />
      </div>

      {/* Photo upload */}
      <div>
        <label className="text-xs font-medium text-muted-foreground">Product Photos *</label>
        <div className="mt-1 grid grid-cols-3 gap-2">
          {previews.map((src, i) => (
            <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-border bg-muted">
              <img src={src} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 p-1 rounded-full bg-destructive text-destructive-foreground"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
          <label className="aspect-square rounded-lg border-2 border-dashed border-border bg-muted/50 flex flex-col items-center justify-center cursor-pointer hover:bg-muted transition-colors">
            <ImagePlus className="h-6 w-6 text-muted-foreground mb-1" />
            <span className="text-xs text-muted-foreground">Add Photo</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition-opacity"
      >
        <Upload className="h-4 w-4" />
        {submitting ? "Submitting..." : "List Product"}
      </button>
    </form>
  );
};

export default AddProductForm;
