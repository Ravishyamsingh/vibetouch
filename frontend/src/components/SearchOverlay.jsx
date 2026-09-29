import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { LoaderCircle, Search, X } from "lucide-react";
import PlaceholderImage from "./PlaceholderImage.jsx";
import { api, imageUrl } from "../lib/api.js";
import { getLocalProductImage } from "../lib/localProductImages.js";

function searchWords(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => {
      if (word === "tvs" || word === "televisions") return "tv";
      if (word === "panels") return "panel";
      if (word === "inches") return "inch";
      return word;
    });
}

function searchableText(product) {
  return [
    product.name,
    product.model_number,
    product.category_name,
    product.category_slug,
    product.tagline,
    ...(Array.isArray(product.features) ? product.features : []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export default function SearchOverlay({ open, onClose }) {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    if (!open) return;
    setQuery("");
    if (products.length > 0) return;

    setStatus("loading");
    api
      .getProducts()
      .then((data) => {
        setProducts(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, [open, products.length]);

  useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  const results = useMemo(() => {
    const words = searchWords(query);
    if (words.length === 0) return [];

    return products
      .filter((product) => {
        const text = searchableText(product);
        return words.every((word) => text.includes(word));
      })
      .slice(0, 12);
  }, [products, query]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] bg-slate-950/60 px-4 py-6 backdrop-blur-sm sm:py-16"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label="Search products"
    >
      <div className="mx-auto flex max-h-[calc(100vh-3rem)] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl sm:max-h-[calc(100vh-8rem)]">
        <div className="flex items-center gap-3 border-b border-slate-200 p-4 sm:p-5">
          <Search className="h-6 w-6 shrink-0 text-[#1565c0]" />
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search TVs, panels, models, sizes..."
            className="min-w-0 flex-1 text-lg font-semibold text-slate-900 outline-none placeholder:font-normal placeholder:text-slate-400"
          />
          <button type="button" onClick={onClose} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-900" aria-label="Close search">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-4 sm:p-5">
          {!query.trim() && (
            <div className="rounded-2xl bg-blue-50 p-5 text-sm text-slate-600">
              Search by size, model, or category — for example <span className="font-bold text-[#1565c0]">50 inch TV</span>, <span className="font-bold text-[#1565c0]">Smart TV</span>, or <span className="font-bold text-[#1565c0]">Interactive Panel</span>.
            </div>
          )}

          {status === "loading" && (
            <div className="flex items-center gap-2 py-8 text-sm text-slate-500">
              <LoaderCircle className="h-4 w-4 animate-spin" /> Loading products...
            </div>
          )}

          {status === "error" && <p className="py-8 text-sm text-red-600">Search is unavailable because the product service could not be reached.</p>}

          {query.trim() && status === "ready" && results.length === 0 && (
            <p className="py-8 text-center text-sm text-slate-500">No products match “{query}”. Try a model number, size, or category.</p>
          )}

          {results.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {results.map((product) => {
                const productImage = imageUrl(product.image_url || getLocalProductImage(product));
                return (
                  <Link
                    key={product.slug}
                    to={`/product/${product.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-3 rounded-2xl border border-slate-200 p-3 transition-colors hover:border-[#1565c0] hover:bg-blue-50/50"
                  >
                    <div className="h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                      {productImage ? (
                        <img src={productImage} alt="" className="h-full w-full bg-white object-contain p-1" />
                      ) : (
                        <PlaceholderImage categorySlug={product.category_slug} className="h-full w-full rounded-xl" float={false} />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-extrabold text-slate-900">{product.name}</p>
                      <p className="mt-1 text-xs text-slate-500">{product.model_number || product.category_name}</p>
                      {product.price && <p className="mt-1 text-xs font-bold text-[#1565c0]">₹{Number(product.price).toLocaleString("en-IN")}</p>}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
