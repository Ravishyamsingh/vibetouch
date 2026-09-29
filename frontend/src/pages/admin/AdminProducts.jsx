import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Plus, Pencil, Trash2, X, Upload, FileImage, Search, Image, PackageCheck, AlertTriangle, Star } from "lucide-react";
import { api, imageUrl } from "../../lib/api.js";
import AdminBackButton from "../../components/AdminBackButton.jsx";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState("loading");
  const [editingId, setEditingId] = useState(undefined); // undefined = list view, "new" | id = form view
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(() => searchParams.get("search") || "");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("all");

  function reload() {
    setStatus("loading");
    Promise.all([api.adminGetProducts(), api.adminGetCategories()])
      .then(([p, c]) => {
        setProducts(p);
        setCategories(c);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }

  useEffect(reload, []);

  useEffect(() => {
    setSearchTerm(searchParams.get("search") || "");
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return products.filter((product) => {
      const searchable = [product.name, product.model_number, product.slug, product.category_name, product.tagline]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const matchesSearch = !query || searchable.includes(query);
      const matchesCategory = !categoryFilter || product.category_slug === categoryFilter;
      const stock = Number(product.stock_quantity || 0);
      const matchesStock = stockFilter === "all" || (stockFilter === "available" && stock > 0) || (stockFilter === "low" && stock > 0 && stock <= 5) || (stockFilter === "out" && stock <= 0);
      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, searchTerm, categoryFilter, stockFilter]);

  const productStats = useMemo(() => ({
    total: products.length,
    withImages: products.filter((product) => Array.isArray(product.images) && product.images.length > 0).length,
    lowStock: products.filter((product) => Number(product.stock_quantity || 0) > 0 && Number(product.stock_quantity || 0) <= 5).length,
    outOfStock: products.filter((product) => Number(product.stock_quantity || 0) <= 0).length,
  }), [products]);

  async function handleDelete(id, name) {
    if (!confirm(`Delete "${name}"? This can't be undone.`)) return;
    await api.adminDeleteProduct(id);
    reload();
  }

  if (editingId !== undefined) {
    return (
      <ProductForm
        productId={editingId}
        categories={categories}
        onDone={() => {
          setEditingId(undefined);
          reload();
        }}
      />
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-lime">Catalogue control</p>
          <h1 className="mt-2 text-3xl font-bold text-ink">Products</h1>
          <p className="mt-1 text-sm text-cloud">Manage product details, stock, images, and visibility.</p>
        </div>
        <button onClick={() => setEditingId("new")} className="btn-lime !py-3">
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </div>

      {status === "loading" && <p className="text-cloud">Loading…</p>}
      {status === "error" && <p className="text-red-700">Couldn&rsquo;t load products.</p>}

      {status === "ready" && (
        <>
          <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <AdminStat label="Total products" value={productStats.total} icon={PackageCheck} tone="blue" />
            <AdminStat label="With images" value={productStats.withImages} icon={Image} tone="lime" />
            <AdminStat label="Low stock" value={productStats.lowStock} icon={AlertTriangle} tone="amber" />
            <AdminStat label="Out of stock" value={productStats.outOfStock} icon={AlertTriangle} tone="red" />
          </div>

          <div className="mb-5 rounded-2xl border border-ink/10 bg-deep-card p-4 shadow-card">
            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_180px_160px_auto]">
              <label className="relative">
                <span className="sr-only">Search product list</span>
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cloud" />
                <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search name, model, category..." className="input !pl-10" />
              </label>
              <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="input">
                <option value="">All categories</option>
                {categories.map((category) => <option key={category.id} value={category.slug}>{category.name}</option>)}
              </select>
              <select value={stockFilter} onChange={(event) => setStockFilter(event.target.value)} className="input">
                <option value="all">All stock</option>
                <option value="available">In stock</option>
                <option value="low">Low stock</option>
                <option value="out">Out of stock</option>
              </select>
              <button type="button" onClick={() => { setSearchTerm(""); setCategoryFilter(""); setStockFilter("all"); }} className="btn-ghost !justify-center !px-4 !py-3 text-sm">
                Clear
              </button>
            </div>
            <p className="mt-3 text-xs text-cloud">Showing {filteredProducts.length} of {products.length} products</p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-ink/10 shadow-card">
          <table className="w-full min-w-[980px] text-sm">
            <thead className="bg-deep-card text-left text-xs uppercase tracking-wide text-cloud">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">Category</th>
                <th className="p-4">Model</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Images</th>
                <th className="p-4" />
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => (
                <tr key={p.id} className="border-t border-ink/5">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-14 shrink-0 overflow-hidden rounded-xl bg-white">
                        {p.images?.[0]?.url ? <img src={imageUrl(p.images[0].url)} alt="" className="h-full w-full object-contain p-1" /> : <div className="grid h-full place-items-center text-cloud"><Image className="h-4 w-4" /></div>}
                      </div>
                      <div className="min-w-0">
                        <p className="max-w-[270px] truncate font-semibold text-ink">{p.name}</p>
                        <div className="mt-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wide text-cloud">
                          {p.is_featured && <span className="flex items-center gap-1 text-amber-500"><Star className="h-3 w-3 fill-current" /> Featured</span>}
                          {!p.is_featured && <span>Standard listing</span>}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-cloud">{p.category_name}</td>
                  <td className="p-4 text-cloud">{p.model_number}</td>
                  <td className="p-4 text-cloud">{p.price ? `₹${Number(p.price).toLocaleString("en-IN")}` : "—"}</td>
                  <td className="p-4"><StockBadge quantity={p.stock_quantity} /></td>
                  <td className="p-4 text-cloud">{p.images?.length || 0}</td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setEditingId(p.id)} className="rounded-lg p-2 hover:bg-ink/5 hover:text-lime">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(p.id, p.name)} className="rounded-lg p-2 hover:bg-ink/5 hover:text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && <tr><td colSpan="7" className="p-10 text-center text-cloud">No products match these filters.</td></tr>}
            </tbody>
          </table>
        </div>
        </>
      )}
    </div>
  );
}

function AdminStat({ label, value, icon: Icon, tone }) {
  const colors = {
    blue: "bg-blue-50 text-[#1565c0]",
    lime: "bg-lime/10 text-lime",
    amber: "bg-amber-50 text-amber-600",
    red: "bg-red-50 text-red-600",
  };
  return <div className="flex items-center gap-3 rounded-2xl border border-ink/10 bg-deep-card p-4 shadow-card"><span className={`grid h-10 w-10 place-items-center rounded-xl ${colors[tone]}`}><Icon className="h-5 w-5" /></span><div><p className="text-2xl font-extrabold text-ink">{value}</p><p className="text-xs text-cloud">{label}</p></div></div>;
}

function StockBadge({ quantity }) {
  const stock = Number(quantity || 0);
  const classes = stock <= 0 ? "bg-red-50 text-red-600" : stock <= 5 ? "bg-amber-50 text-amber-600" : "bg-lime/10 text-lime";
  const label = stock <= 0 ? "Out of stock" : stock <= 5 ? `${stock} low` : `${stock} available`;
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${classes}`}>{label}</span>;
}

const emptyForm = {
  category_id: "", slug: "", model_number: "", name: "", brand: "Vibetouch",
  tagline: "", description: "", price: "", stock_quantity: 0, is_featured: false,
  specs: {}, features: [],
};

function ProductForm({ productId, categories, onDone }) {
  const isNew = productId === "new";
  const [form, setForm] = useState(emptyForm);
  const [images, setImages] = useState([]);
  const [pendingImages, setPendingImages] = useState([]);
  const [specRows, setSpecRows] = useState([]); // [{key, value}]
  const [featureInput, setFeatureInput] = useState("");
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isNew) return;
    api.adminGetProduct(productId).then((p) => {
      setForm({
        ...p,
        price: p.price ?? "",
        specs: p.specs || {},
        features: p.features || [],
      });
      setSpecRows(Object.entries(p.specs || {}).map(([key, value]) => ({ key, value })));
      setImages(p.images || []);
      setLoading(false);
    });
  }, [productId, isNew]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function updateSpecRow(i, field, value) {
    setSpecRows((rows) => rows.map((r, idx) => (idx === i ? { ...r, [field]: value } : r)));
  }
  function removeSpecRow(i) {
    setSpecRows((rows) => rows.filter((_, idx) => idx !== i));
  }
  function addFeature() {
    const val = featureInput.trim();
    if (!val) return;
    update("features", [...form.features, val]);
    setFeatureInput("");
  }
  function removeFeature(i) {
    update("features", form.features.filter((_, idx) => idx !== i));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const specs = Object.fromEntries(specRows.filter((r) => r.key.trim()).map((r) => [r.key.trim(), r.value]));
    const payload = {
      ...form,
      category_id: Number(form.category_id),
      price: form.price === "" ? null : Number(form.price),
      stock_quantity: Number(form.stock_quantity) || 0,
      specs,
    };
    try {
      if (isNew) {
        await api.adminCreateProduct(payload);
      } else {
        await api.adminUpdateProduct(productId, payload);
      }
      onDone();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function handleImageSelect(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setPendingImages((current) => [
      ...current,
      ...files.slice(0, Math.max(0, 6 - current.length)).map((file) => ({ file, name: file.name })),
    ]);
    e.target.value = "";
  }

  function updatePendingImageName(index, name) {
    setPendingImages((current) => current.map((item, i) => (i === index ? { ...item, name } : item)));
  }

  function removePendingImage(index) {
    setPendingImages((current) => current.filter((_, i) => i !== index));
  }

  async function handleImageUpload() {
    if (!pendingImages.length) return;
    setError("");
    try {
      const uploaded = await api.adminUploadImages(
        productId,
        pendingImages.map((item) => item.file),
        pendingImages.map((item) => item.name),
      );
      setImages((imgs) => [...imgs, ...uploaded]);
      setPendingImages([]);
    } catch (err) {
      setError(err.message || "Image upload failed.");
    }
  }

  async function handleImageDelete(imageId) {
    await api.adminDeleteImage(productId, imageId);
    setImages((imgs) => imgs.filter((i) => i.id !== imageId));
  }

  if (loading) return <p className="text-cloud">Loading…</p>;

  return (
    <form onSubmit={handleSave} className="max-w-3xl">
      <AdminBackButton onClick={onDone} fallbackTo="/admin/products" label="Back to products" />
      <h1 className="mb-6 text-2xl font-bold text-ink">{isNew ? "Add Product" : `Edit: ${form.name}`}</h1>

      {error && <p className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-700">{error}</p>}

      <div className="space-y-6 rounded-3xl border border-ink/10 bg-deep-card p-6 shadow-card">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name"><input required value={form.name} onChange={(e) => update("name", e.target.value)} className="input" /></Field>
          <Field label="Slug"><input required value={form.slug} onChange={(e) => update("slug", e.target.value)} className="input" /></Field>
          <Field label="Model Number"><input value={form.model_number || ""} onChange={(e) => update("model_number", e.target.value)} className="input" /></Field>
          <Field label="Brand"><input value={form.brand} onChange={(e) => update("brand", e.target.value)} className="input" /></Field>
          <Field label="Category">
            <select required value={form.category_id} onChange={(e) => update("category_id", e.target.value)} className="input">
              <option value="" disabled>Select…</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </Field>
          <Field label="Price (₹)"><input type="number" step="0.01" value={form.price} onChange={(e) => update("price", e.target.value)} className="input" /></Field>
          <Field label="Stock Quantity"><input type="number" value={form.stock_quantity} onChange={(e) => update("stock_quantity", e.target.value)} className="input" /></Field>
          <label className="flex items-center gap-2 self-end pb-3 text-sm text-ink/80">
            <input type="checkbox" checked={form.is_featured} onChange={(e) => update("is_featured", e.target.checked)} />
            Featured
          </label>
        </div>

        <Field label="Tagline"><input value={form.tagline || ""} onChange={(e) => update("tagline", e.target.value)} className="input" /></Field>
        <Field label="Description"><textarea rows={3} value={form.description || ""} onChange={(e) => update("description", e.target.value)} className="input resize-none" /></Field>

        <div>
          <span className="mb-2 block text-sm font-semibold text-ink/80">Specifications</span>
          <div className="space-y-2">
            {specRows.map((row, i) => (
              <div key={i} className="flex gap-2">
                <input placeholder="Label" value={row.key} onChange={(e) => updateSpecRow(i, "key", e.target.value)} className="input flex-1" />
                <input placeholder="Value" value={row.value} onChange={(e) => updateSpecRow(i, "value", e.target.value)} className="input flex-1" />
                <button type="button" onClick={() => removeSpecRow(i)} className="rounded-xl border border-ink/10 px-3 hover:text-red-500">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => setSpecRows((r) => [...r, { key: "", value: "" }])} className="btn-ghost mt-2 !py-2 text-xs">
            <Plus className="h-3.5 w-3.5" /> Add spec row
          </button>
        </div>

        <div>
          <span className="mb-2 block text-sm font-semibold text-ink/80">Features</span>
          <div className="mb-2 flex flex-wrap gap-2">
            {form.features.map((f, i) => (
              <span key={i} className="flex items-center gap-1 rounded-full border border-ink/15 px-3 py-1.5 text-xs text-ink/80">
                {f}
                <button type="button" onClick={() => removeFeature(i)}><X className="h-3 w-3" /></button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              onKeyDown={(e) => (e.key === "Enter" ? (e.preventDefault(), addFeature()) : null)}
              placeholder="Type a feature and press Enter"
              className="input flex-1"
            />
            <button type="button" onClick={addFeature} className="btn-ghost !py-2 text-xs">Add</button>
          </div>
        </div>

        {!isNew && (
          <div>
            <span className="mb-2 block text-sm font-semibold text-ink/80">Images</span>
            <div className="mb-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {images.map((img) => (
                <div key={img.id} className="group relative overflow-hidden rounded-xl">
                  <img src={imageUrl(img.url)} alt="" className="aspect-square w-full bg-white object-contain p-1" />
                  <span className="block truncate px-1 py-1 text-[10px] text-cloud">{img.url.split("/").pop()}</span>
                  <button
                    type="button"
                    onClick={() => handleImageDelete(img.id)}
                    className="absolute right-1 top-1 rounded-full bg-black/60 p-1 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {pendingImages.length > 0 && (
              <div className="mb-3 rounded-2xl border border-lime/30 bg-lime/5 p-4">
                <p className="text-sm font-semibold text-ink">Review filenames before upload</p>
                <p className="mt-1 text-xs text-cloud">Names are cleaned for safe web URLs. The original file extension will be kept.</p>
                <div className="mt-3 space-y-2">
                  {pendingImages.map((item, index) => (
                    <div key={`${item.file.name}-${index}`} className="flex items-center gap-2">
                      <FileImage className="h-4 w-4 shrink-0 text-lime" />
                      <input
                        value={item.name}
                        onChange={(e) => updatePendingImageName(index, e.target.value)}
                        className="input min-w-0 flex-1 !py-2 text-sm"
                        aria-label={`Filename for ${item.file.name}`}
                      />
                      <button
                        type="button"
                        onClick={() => removePendingImage(index)}
                        className="rounded-xl border border-ink/10 p-2 hover:text-red-500"
                        aria-label={`Remove ${item.name}`}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={handleImageUpload} className="btn-lime mt-3 !py-2 text-xs">
                  <Upload className="h-3.5 w-3.5" /> Upload with these names
                </button>
              </div>
            )}

            <label className="btn-ghost inline-flex cursor-pointer !py-2 text-xs">
              <Upload className="h-3.5 w-3.5" /> Select images
              <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" multiple hidden onChange={handleImageSelect} />
            </label>
            <p className="mt-2 text-xs text-cloud">Select up to 6 images, edit each filename, then upload.</p>
          </div>
        )}
      </div>

      <button type="submit" disabled={saving} className="btn-lime mt-6 disabled:opacity-60">
        {saving ? "Saving…" : "Save Product"}
      </button>
    </form>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-ink/80">{label}</span>
      {children}
    </label>
  );
}
