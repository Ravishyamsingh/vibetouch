import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useCompare } from "../context/CompareContext.jsx";
import { api, imageUrl } from "../lib/api.js";
import PlaceholderImage from "../components/PlaceholderImage.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import BackButton from "../components/BackButton.jsx";
import { stagger, fadeUp } from "../lib/motion.js";
import { fallbackProductForSlug } from "../lib/productFallbacks.js";
import { getLocalProductImage } from "../lib/localProductImages.js";

export default function Compare() {
  const { items, remove, maxCompare } = useCompare();
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    document.title = "Compare Products | Vibetouch";
  }, []);

  useEffect(() => {
    if (items.length === 0) {
      setProducts([]);
      setStatus("empty");
      return;
    }
    setStatus("loading");
    Promise.all(items.map((p) => api.getProduct(p.slug).catch(() => fallbackProductForSlug(p.slug))))
      .then((results) => {
        setProducts(results.filter(Boolean));
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, [items]);

  const specKeys = Array.from(new Set(products.flatMap((p) => Object.keys(p.specs || {}))));

  return (
    <div className="container-x py-16">
      <BackButton fallbackTo="/" label="Back" />

      <SectionHeading eyebrow="Compare Products" title="Side-by-Side Comparison" />

      <AnimatePresence mode="wait">
        {status === "empty" && (
          <motion.p
            key="empty"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-14 rounded-2xl border border-ink/10 bg-deep-card p-8 text-cloud shadow-card"
          >
            Nothing to compare yet — tap &ldquo;Add to Compare&rdquo; on up to {maxCompare} products first.
          </motion.p>
        )}

        {status === "ready" && products.length > 0 && (
          <motion.div
            key="table"
            initial="hidden"
            animate="show"
            variants={stagger}
            className="mt-12 overflow-x-auto pb-2"
          >
            <div
              className="grid min-w-[640px] gap-3"
              style={{ gridTemplateColumns: `180px repeat(${products.length}, minmax(180px, 1fr))` }}
            >
              {/* Header row: blank corner cell + one bordered product box per column */}
              <div />
              {products.map((p, i) => (
                <motion.div
                  key={p.slug}
                  variants={fadeUp}
                  transition={{ delay: i * 0.06 }}
                  className="relative rounded-xl border border-ink/10 bg-deep-card p-4 shadow-card"
                >
                  <button
                    onClick={() => remove(p.slug)}
                    className="absolute -right-2 -top-2 z-10 rounded-full border border-ink/10 bg-deep-card p-1 text-cloud shadow-card hover:text-lime"
                    aria-label={`Remove ${p.name}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                  {imageUrl(p.image_url || p.images?.[0]?.url || getLocalProductImage(p)) ? (
                    <img src={imageUrl(p.image_url || p.images?.[0]?.url || getLocalProductImage(p))} alt={p.name} className="aspect-square w-full rounded-lg bg-white object-contain p-2" />
                  ) : (
                    <PlaceholderImage categorySlug={p.category_slug} className="aspect-square w-full rounded-lg" />
                  )}
                  <Link to={`/product/${p.slug}`} className="mt-3 block text-sm font-bold text-ink hover:text-lime">
                    {p.name}
                  </Link>
                </motion.div>
              ))}

              {/* Spec rows — each label and each value is its own thin-bordered box,
                  grid-aligned into columns so it reads like a real comparison chart. */}
              <CompareRow label="Brand" values={products.map((p) => p.brand)} />
              <CompareRow label="Model" values={products.map((p) => p.model_number || "—")} />
              <CompareRow
                label="Price"
                values={products.map((p) => (p.price ? `₹${Number(p.price).toLocaleString("en-IN")}` : "On enquiry"))}
              />
              <CompareRow
                label="Availability"
                values={products.map((p) => (p.stock_quantity > 0 ? `${p.stock_quantity} in stock` : "Out of stock"))}
              />
              {specKeys.map((key) => (
                <CompareRow key={key} label={key} values={products.map((p) => p.specs?.[key] ?? "—")} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CompareRow({ label, values }) {
  return (
    <>
      <motion.div
        variants={fadeUp}
        className="flex items-center rounded-xl border border-ink/10 bg-deep-soft px-4 py-3 text-sm font-semibold text-cloud"
      >
        {label}
      </motion.div>
      {values.map((v, i) => (
        <motion.div
          key={i}
          variants={fadeUp}
          className="flex items-center rounded-xl border border-ink/10 bg-deep-card px-4 py-3 text-sm text-ink"
        >
          {String(v)}
        </motion.div>
      ))}
    </>
  );
}
