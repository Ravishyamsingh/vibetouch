import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, BadgeCheck, Award, Globe2, GitCompareArrows, Check } from "lucide-react";
import { api, imageUrl } from "../lib/api.js";
import ProductGallery from "../components/ProductGallery.jsx";
import PlaceholderImage from "../components/PlaceholderImage.jsx";
import ProductCard from "../components/ProductCard.jsx";
import BackButton from "../components/BackButton.jsx";
import { useCompare } from "../context/CompareContext.jsx";
import { stagger, fadeUp, viewportOnce, EASE } from "../lib/motion.js";
import { fallbackProductForSlug } from "../lib/productFallbacks.js";
import { getLocalProductImages } from "../lib/localProductImages.js";

const trustPoints = [
  { icon: Award, text: "Trusted by many departments of Govt." },
  { icon: BadgeCheck, text: "Trusted OEM & seller on GeM Portal" },
  { icon: Globe2, text: "Pan-India on-site warranty" },
  { icon: ShieldCheck, text: "BIS & BEE certified, ZED Gold certified" },
];

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("loading");
  const { toggle, isSelected } = useCompare();

  useEffect(() => {
    setStatus("loading");
    api
      .getProduct(slug)
      .then((data) => {
        setProduct(data);
        setStatus("ready");
      })
      .catch(() => {
        const fallback = fallbackProductForSlug(slug);
        if (fallback) {
          setProduct(fallback);
          setStatus("ready");
        } else {
          setStatus("error");
        }
      });
  }, [slug]);

  useEffect(() => {
    if (product) document.title = `${product.name} | Vibetouch`;
  }, [product]);

  if (status === "loading") {
    return <div className="container-x py-24 text-center text-cloud">Loading product…</div>;
  }

  if (status === "error" || !product) {
    return (
      <div className="container-x py-24 text-center">
        <BackButton fallbackTo="/" label="Back" />
        <p className="text-cloud">Couldn&rsquo;t load this product. Make sure the backend + database are running.</p>
        <Link to="/" className="btn-lime mt-6 inline-flex">Back to home</Link>
      </div>
    );
  }

  const specEntries = Object.entries(product.specs || {});
  const features = Array.isArray(product.features) ? product.features : [];
  const images = product.images?.length ? product.images : getLocalProductImages(product);
  const galleryExtras = images.slice(1); // everything beyond the main/hero shot
  const photoImages = images.length > 1 ? galleryExtras : images;
  const selected = isSelected(product.slug);
  const inStock = product.stock_quantity > 0;

  return (
    <div className="container-x py-16">
      <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
        <BackButton fallbackTo={`/products/${product.category_slug}`} label={`Back to ${product.category_name}`} />
      </motion.div>

      {/* key={product.slug} remounts this block on navigation between products
          so the entrance animation replays instead of silently no-op'ing. */}
      <div key={product.slug} className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <ProductGallery images={images} categorySlug={product.category_slug} productName={product.name} />
        </motion.div>

        <motion.div initial="hidden" animate="show" variants={stagger}>
          <motion.div variants={fadeUp} className="flex items-center gap-3">
            <span className="rounded-full border border-ink/15 px-3 py-1 text-xs font-semibold text-cloud">
              {product.brand || "Vibetouch"}
            </span>
            {product.model_number && (
              <span className="text-sm font-bold uppercase tracking-wide text-lime">
                Model Number: {product.model_number}
              </span>
            )}
          </motion.div>

          <motion.h1 variants={fadeUp} className="mt-3 text-3xl font-extrabold text-ink sm:text-4xl">
            {product.name}
          </motion.h1>
          {product.tagline && (
            <motion.p variants={fadeUp} className="mt-3 text-lg text-cloud">
              {product.tagline}
            </motion.p>
          )}

          <motion.div variants={fadeUp} className="mt-5 flex items-baseline gap-3">
            {product.price ? (
              <span className="text-3xl font-extrabold text-lime">₹{Number(product.price).toLocaleString("en-IN")}</span>
            ) : (
              <span className="text-lg font-semibold text-cloud">Price on enquiry</span>
            )}
            <span className={`flex items-center gap-1.5 text-sm font-semibold ${inStock ? "text-lime" : "text-red-400"}`}>
              {inStock && (
                <motion.span
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                  className="h-2 w-2 rounded-full bg-lime"
                />
              )}
              {inStock ? `${product.stock_quantity} in stock` : "Out of stock"}
            </span>
          </motion.div>

          {product.description && (
            <motion.p variants={fadeUp} className="mt-5 leading-relaxed text-cloud">
              {product.description}
            </motion.p>
          )}

          {specEntries.length > 0 && (
            <motion.div variants={fadeUp} className="mt-6 rounded-2xl border border-ink/10 bg-deep-card p-5 shadow-card">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-sm font-bold text-ink">Key specifications</h2>
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-lime">At a glance</span>
              </div>
              <div className="mt-4 divide-y divide-ink/5">
                {specEntries.slice(0, 6).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between gap-5 py-2.5 text-sm">
                    <span className="text-cloud">{key}</span>
                    <span className="text-right font-semibold text-ink">{String(value)}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          <motion.div variants={fadeUp} className="mt-6 rounded-2xl border border-ink/10 bg-deep-card p-5 shadow-card">
            <h3 className="text-sm font-bold text-ink">Important &amp; Read Carefully</h3>
            <p className="mt-2 text-sm text-cloud">
              The specifications listed represent our standard model configuration. We manufacture
              to standard specifications and also offer custom development to meet buyer-specific
              requirements.
            </p>
          </motion.div>

          {features.length > 0 && (
            <motion.ul variants={fadeUp} className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-ink/80">
                  <Check className="h-4 w-4 shrink-0 text-lime" /> {f}
                </li>
              ))}
            </motion.ul>
          )}

          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
            <Link to="/contact" className="btn-lime">
              Enquiry Now <ArrowRight className="h-4 w-4" />
            </Link>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => toggle({ slug: product.slug, name: product.name, category_slug: product.category_slug })}
              className={`btn-ghost !px-5 !py-3.5 ${selected ? "border-lime text-lime" : ""}`}
            >
              <GitCompareArrows className="h-4 w-4" /> {selected ? "Added to Compare" : "Add to Compare"}
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {specEntries.length > 0 && (
        <div className="mt-20">
          <SectionTitle>Product overview</SectionTitle>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={stagger}
            className="mt-6 overflow-hidden rounded-2xl border border-ink/10 bg-deep-card shadow-card"
          >
            <div className="grid grid-cols-[minmax(9rem,0.8fr)_minmax(0,2fr)] border-b border-ink/10 bg-deep-soft px-5 py-4 text-xs font-bold uppercase tracking-[0.12em] text-cloud sm:px-7">
              <span>Specification</span>
              <span>Details</span>
            </div>
            {specEntries.map(([key, value]) => (
              <motion.div
                key={key}
                variants={fadeUp}
                className="grid grid-cols-[minmax(9rem,0.8fr)_minmax(0,2fr)] gap-4 border-b border-ink/5 px-5 py-4 text-sm last:border-0 sm:px-7"
              >
                <span className="font-semibold text-ink">{key}</span>
                <span className="text-ink/75">{String(value)}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}

      <div className="mt-20">
        <SectionTitle>Product photos</SectionTitle>
        {photoImages.length > 0 ? (
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={stagger}
            className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {photoImages.map((img) => (
              <motion.img
                key={img.id || img.url}
                variants={fadeUp}
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.3 }}
                src={imageUrl(img.url)}
                alt={img.alt_text || product.name}
                className="aspect-[4/3] w-full rounded-2xl bg-white object-contain p-3"
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={stagger}
            className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {Array.from({ length: 4 }).map((_, index) => (
              <motion.div key={index} variants={fadeUp} className="relative overflow-hidden rounded-2xl">
                <PlaceholderImage categorySlug={product.category_slug} className="aspect-[4/3] w-full rounded-2xl" float={false} />
                <span className="absolute bottom-3 left-3 rounded-full bg-black/45 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur">
                  Product photo placeholder
                </span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportOnce}
        transition={{ duration: 0.6, ease: EASE }}
        className="mt-20 rounded-3xl border border-ink/10 bg-deep-card p-10 shadow-card-lg"
      >
        <h2 className="text-center text-2xl font-bold text-ink">Why Choose Vibetouch?</h2>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={stagger}
          className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {trustPoints.map(({ icon: Icon, text }) => (
            <motion.div key={text} variants={fadeUp} className="flex flex-col items-center gap-3 text-center">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-lime/10 text-lime">
                <Icon className="h-6 w-6" />
              </div>
              <p className="text-sm text-cloud">{text}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {product.related?.length > 0 && (
        <div className="mt-20">
          <div className="flex items-center justify-between">
            <SectionTitle>Recommended for you</SectionTitle>
            <Link to="/compare" className="text-sm font-semibold text-lime hover:underline">
              Go to comparison →
            </Link>
          </div>
          <p className="mt-2 text-sm text-cloud">
            Explore similar Vibetouch models, or add them to compare side-by-side with this one.
          </p>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={stagger}
            className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {product.related.map((p) => (
              <motion.div key={p.slug} variants={fadeUp}>
                <ProductCard product={{ ...p, category_slug: product.category_slug }} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration: 0.5 }}
      className="text-2xl font-bold text-ink"
    >
      {children}
    </motion.h2>
  );
}
