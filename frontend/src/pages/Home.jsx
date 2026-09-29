import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronDown,
  GitCompareArrows,
  Heart,
  RotateCcw,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  Truck,
} from "lucide-react";

import HeroSlider from "../components/HeroSlider.jsx";
import PlaceholderImage from "../components/PlaceholderImage.jsx";
import { useCompare } from "../context/CompareContext.jsx";
import { api, imageUrl } from "../lib/api.js";
import { getLocalProductImage } from "../lib/localProductImages.js";
import { fadeUp, stagger, viewportOnce } from "../lib/motion.js";

const tvSizes = [24, 32, 43, 50, 55, 65, 75, 85, 86, 98];
const panelSizes = [55, 65, 75, 86, 98, 100, 105, 110];
const CARE_IMAGE_PATH = "/care/care-plus.png";

// A complete visual fallback keeps the catalogue useful before the API is
// connected. Replace these with real records/images in the admin dashboard.
const fallbackTvProducts = [
  ["24VBT", "Vibetouch 24 inch HD LED Smart TV", 9999, "HD LED"],
  ["32VBT", "Vibetouch 32 inch HD LED Smart TV", 13999, "HD LED"],
  ["43VBT", "Vibetouch 43 inch UHD Smart TV", 21999, "4K UHD"],
  ["50VBT", "Vibetouch 50 inch UHD Smart OLED TV", 27999, "4K UHD"],
  ["55VBT", "Vibetouch 55 inch Crystal UHD Smart TV", 32999, "4K UHD"],
  ["65VBT", "Vibetouch 65 inch Crystal UHD Smart TV", 45999, "4K UHD"],
  ["75VBT", "Vibetouch 75 inch QLED Smart TV", 62999, "QLED"],
  ["85VBT", "Vibetouch 85 inch Neo QLED Smart TV", 89999, "QLED"],
  ["86VBT", "Vibetouch 86 inch UHD Smart TV", 92999, "4K UHD"],
  ["98VBT", "Vibetouch 98 inch Crystal UHD Smart TV", 149999, "4K UHD"],
].map(([model_number, name, price, displayType], index) => ({
  slug: `vibetouch-${model_number.toLowerCase()}-smart-tv`,
  model_number,
  name,
  price,
  displayType,
  tagline: "Make in India Smart TV",
  category_slug: "smart-tv",
  is_featured: index === 3 || index === 6,
  rating: index % 3 === 0 ? "4.9" : "4.8",
  reviewCount: 18 + index * 7,
}));

const fallbackPanelProducts = [
  ["IPC55VBT", "Vibetouch 55 inch 4K Interactive Panel", 99999],
  ["IPC65VBT", "Vibetouch 65 inch 4K Interactive Panel", 129999],
  ["IPC75VBT", "Vibetouch 75 inch 4K Interactive Panel", 169999],
  ["IPC86VBT", "Vibetouch 86 inch 4K Interactive Panel", 229999],
  ["IPC98VBT", "Vibetouch 98 inch 4K Interactive Panel", 299999],
  ["IPC100VBT", "Vibetouch 100 inch 4K Interactive Panel", 319999],
  ["IPC105VBT", "Vibetouch 105 inch 4K Interactive Panel", 359999],
  ["IPC110VBT", "Vibetouch 110 inch 4K Interactive Panel", 399999],
].map(([model_number, name, price], index) => ({
  slug: `vibetouch-${model_number.toLowerCase()}-interactive-panel`,
  model_number,
  name,
  price,
  displayType: "Interactive 4K",
  tagline: "4K UHD interactive flat panel for smart classrooms and meeting rooms",
  category_slug: "interactive-panel",
  is_featured: index === 3,
  rating: index % 2 === 0 ? "4.9" : "4.8",
  reviewCount: 8 + index * 3,
}));

function productSize(product) {
  const value = String(product.model_number || product.name || "").match(/\d{2,3}/);
  return value ? Number(value[0]) : null;
}

function ProductCard({ product }) {
  const { toggle, isSelected } = useCompare();
  const selected = isSelected(product.slug);
  const size = productSize(product);
  const rating = product.rating || "4.8";
  const reviewCount = product.reviewCount || 24;
  const displayType = product.displayType || (product.category_slug === "interactive-panel" ? "Interactive 4K" : size && size <= 32 ? "HD LED" : "4K UHD");
  const productImage = imageUrl(product.image_url || getLocalProductImage(product));

  return (
    <motion.article
      variants={fadeUp}
      whileHover={{ y: -7 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      className="group flex min-w-0 flex-col rounded-[22px] border border-slate-200/90 bg-white p-3.5 shadow-[0_5px_24px_rgba(15,23,42,0.045)] transition-shadow duration-300 hover:border-[#1565c0]/45 hover:shadow-[0_18px_42px_rgba(15,23,42,0.12)] sm:p-4"
    >
      <div className="flex items-center justify-between px-1 pb-3 text-[10px] font-bold uppercase tracking-[0.14em]">
        <span className="text-[#1565c0]">{product.is_featured ? "Featured" : "New"}</span>
        <button
          type="button"
          aria-label={`Save ${product.name}`}
          className="grid h-7 w-7 place-items-center rounded-full text-slate-400 transition-colors hover:bg-blue-50 hover:text-[#1565c0]"
        >
          <Heart className="h-3.5 w-3.5" />
        </button>
      </div>

      <Link to={`/product/${product.slug}`} className="relative block overflow-hidden rounded-2xl bg-slate-100">
        {productImage ? (
          <img src={productImage} alt={product.image_alt || product.name} className="aspect-[1.42/1] w-full bg-white object-contain p-2" />
        ) : (
          <PlaceholderImage
            categorySlug={product.category_slug || "smart-tv"}
            className="aspect-[1.42/1] w-full rounded-2xl"
            float={false}
          />
        )}
        {size && (
          <span className="absolute bottom-2.5 left-2.5 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-extrabold text-slate-700 shadow-sm backdrop-blur">
            {size}&quot;
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col px-1 pt-4">
        <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-400">
          <span>{product.model_number || "VBT SERIES"}</span>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <span>{displayType}</span>
        </div>
        <Link to={`/product/${product.slug}`}>
          <h3 className="mt-2 min-h-[3rem] text-[15px] font-extrabold leading-[1.32] text-slate-900 transition-colors group-hover:text-[#1565c0] sm:text-base">
            {product.name}
          </h3>
        </Link>

        <div className="mt-3 flex items-center gap-1.5 text-xs">
          <span className="flex items-center gap-1 font-bold text-amber-500">
            <Star className="h-3.5 w-3.5 fill-current" /> {rating}
          </span>
          <span className="text-slate-400">({reviewCount})</span>
        </div>
        <p className="mt-3 line-clamp-2 min-h-[2.25rem] text-xs leading-relaxed text-slate-500">
          {product.tagline || "Designed for a smarter everyday."}
        </p>

        <div className="mt-auto pt-5">
          <p className="text-sm font-extrabold text-slate-900 sm:text-[15px]">
            {product.price ? `From ₹${Number(product.price).toLocaleString("en-IN")}` : "Price on enquiry"}
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Link
              to="/contact"
              className="rounded-full bg-slate-950 px-2 py-2.5 text-center text-[11px] font-bold text-white transition-colors hover:bg-[#1565c0]"
            >
              Buy now
            </Link>
            <Link
              to={`/product/${product.slug}`}
              className="rounded-full border border-slate-300 px-2 py-2.5 text-center text-[11px] font-bold text-slate-800 transition-colors hover:border-[#1565c0] hover:text-[#1565c0]"
            >
              Learn more
            </Link>
          </div>
          <button
            type="button"
            onClick={() => toggle({ slug: product.slug, name: product.name, category_slug: product.category_slug })}
            className={`mt-3 flex w-full items-center justify-center gap-2 rounded-full border-2 px-3 py-2.5 text-xs font-bold transition-all ${
              selected
                ? "border-[#1565c0] bg-blue-50 text-[#1565c0]"
                : "border-slate-200 text-slate-500 hover:border-[#1565c0] hover:bg-blue-50 hover:text-[#1565c0]"
            }`}
          >
            <GitCompareArrows className="h-4 w-4" /> {selected ? "Added to compare" : "Compare products"}
          </button>
        </div>
      </div>
    </motion.article>
  );
}

function CareCard() {
  const [hasCareImage, setHasCareImage] = useState(true);

  return (
    <motion.article
      variants={fadeUp}
      className="relative flex min-h-[470px] flex-col overflow-hidden rounded-[22px] bg-[#0d47a1] p-6 text-white shadow-[0_18px_42px_rgba(13,71,161,0.18)] sm:p-7"
    >
      <Sparkles className="absolute -right-4 -top-5 h-32 w-32 text-white/10" strokeWidth={1} />
      <span className="relative text-[10px] font-bold uppercase tracking-[0.17em] text-blue-100">Vibetouch Care+</span>
      <h3 className="relative mt-4 max-w-[11rem] text-2xl font-extrabold leading-tight text-white">More care for your screen.</h3>
      <p className="relative mt-3 max-w-[15rem] text-xs leading-relaxed text-blue-100/80">
        Installation, extended support and a smoother smart TV experience from day one.
      </p>
      <div className="relative mt-auto aspect-[3/2] w-full overflow-hidden rounded-2xl bg-[#071a35]">
        {hasCareImage ? (
          <img
            src={CARE_IMAGE_PATH}
            alt="Vibetouch Care+ installation and support"
            onError={() => setHasCareImage(false)}
            className="h-full w-full object-contain"
          />
        ) : (
          <PlaceholderImage categorySlug="smart-tv" className="h-28 w-44 rounded-xl" float={false} />
        )}
      </div>
      <Link to="/contact" className="relative mt-5 inline-flex items-center gap-2 text-xs font-bold text-white transition-colors hover:text-blue-100">
        Explore Care+ <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </motion.article>
  );
}

function SizeTileImage({ product, categorySlug }) {
  const productImage = imageUrl(product?.image_url || getLocalProductImage(product));

  return productImage ? (
    <img src={productImage} alt={product?.name || `${categorySlug} product`} className="h-full w-full bg-white object-contain p-1" />
  ) : (
    <PlaceholderImage categorySlug={categorySlug} className="h-full w-full rounded-xl" float={false} />
  );
}

function SizeBrowser({ selectedSize, onSelect, products = [], sizes = tvSizes, categorySlug = "smart-tv", allLabel = "All TVs", allDescription = "View collection", itemLabel = "TVs", itemDescription = "Explore size" }) {
  const productsBySize = new Map(products.map((product) => [productSize(product), product]));
  const allProduct = products.find((product) => imageUrl(product.image_url || getLocalProductImage(product))) || products[0];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-9">
      <button
        type="button"
        onClick={() => onSelect("All")}
        className={`group rounded-2xl border p-3 text-left transition-all hover:-translate-y-1 hover:border-[#1565c0] hover:shadow-[0_14px_30px_rgba(15,23,42,0.08)] xl:p-3.5 ${
          selectedSize === "All" ? "border-[#1565c0] bg-blue-50/70" : "border-slate-200 bg-white"
        }`}
      >
        <span className="relative mb-3 block aspect-[1.45/1] overflow-hidden rounded-xl bg-slate-100">
          <SizeTileImage product={allProduct} categorySlug={categorySlug} />
          <span className="absolute bottom-2 left-2 rounded-full bg-white/90 px-2 py-1 text-[10px] font-extrabold text-slate-700 shadow-sm">All</span>
        </span>
        <span className="block text-xs font-extrabold text-slate-900">{allLabel}</span>
        <span className="mt-1 block text-[10px] text-slate-400">{allDescription}</span>
      </button>
      {sizes.map((size) => (
        <button
          key={size}
          type="button"
          onClick={() => onSelect(size)}
          className={`group rounded-2xl border p-3 text-left transition-all hover:-translate-y-1 hover:border-[#1565c0] hover:shadow-[0_14px_30px_rgba(15,23,42,0.08)] xl:p-3.5 ${
            selectedSize === size ? "border-[#1565c0] bg-blue-50/70" : "border-slate-200 bg-white"
          }`}
      >
        <span className="relative mb-3 block aspect-[1.45/1] overflow-hidden rounded-xl bg-slate-100">
            <SizeTileImage product={productsBySize.get(size)} categorySlug={categorySlug} />
            <span className="absolute bottom-2 left-2 rounded-full bg-white/90 px-2 py-1 text-[10px] font-extrabold text-slate-700 shadow-sm">{size}&quot;</span>
          </span>
          <span className="block text-xs font-extrabold text-slate-900">{size}&quot; {itemLabel}</span>
          <span className="mt-1 block text-[10px] text-slate-400">{itemDescription}</span>
        </button>
      ))}
    </div>
  );
}

function PanelCatalog() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [selectedSize, setSelectedSize] = useState("All");
  const [sortBy, setSortBy] = useState("featured");

  useEffect(() => {
    api.getProducts({ category: "interactive-panel" })
      .then((data) => {
        setProducts(data.length ? data : fallbackPanelProducts);
        setStatus("ready");
      })
      .catch(() => {
        setProducts(fallbackPanelProducts);
        setStatus("ready");
      });
  }, []);

  const filteredProducts = useMemo(() => {
    const next = products.filter((product) => selectedSize === "All" || productSize(product) === selectedSize);
    return [...next].sort((a, b) => {
      if (sortBy === "price-low") return Number(a.price || 0) - Number(b.price || 0);
      if (sortBy === "price-high") return Number(b.price || 0) - Number(a.price || 0);
      return Number(b.is_featured) - Number(a.is_featured);
    });
  }, [products, selectedSize, sortBy]);

  return (
    <section className="border-t border-slate-200 bg-white" id="interactive-panels">
      <div className="container-x py-20 sm:py-28">
        <motion.div initial="hidden" whileInView="show" viewport={viewportOnce} variants={fadeUp} className="max-w-2xl">
          <span className="eyebrow">Interactive panel collection</span>
          <h2 className="text-3xl font-extrabold leading-[1.08] text-slate-900 sm:text-5xl">Ideas look better together</h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-500 sm:text-base">
            Bring classrooms, meeting rooms and shared spaces to life with a Vibetouch panel built for collaboration.
          </p>
        </motion.div>

        <motion.div initial="hidden" whileInView="show" viewport={viewportOnce} variants={stagger} className="mt-10">
          <SizeBrowser
            selectedSize={selectedSize}
            onSelect={setSelectedSize}
            products={products}
            sizes={panelSizes}
            categorySlug="interactive-panel"
            allLabel="All panels"
            allDescription="View collection"
            itemLabel="panels"
            itemDescription="Explore size"
          />
        </motion.div>

        <div className="mt-10 flex flex-col gap-4 border-y border-slate-200 py-4 text-xs sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 font-extrabold text-slate-900">
            <SlidersHorizontal className="h-4 w-4 text-[#1565c0]" /> Filters
          </div>
          <button type="button" onClick={() => setSelectedSize("All")} className="self-start rounded-full border border-slate-200 bg-white px-3 py-2 text-[11px] font-semibold text-slate-600 transition-colors hover:border-[#1565c0] hover:text-[#1565c0]">Clear size</button>
          <label className="relative sm:ml-auto">
            <span className="sr-only">Sort panels</span>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="appearance-none rounded-full border border-slate-200 bg-white py-2 pl-3 pr-8 text-[11px] font-semibold text-slate-600 outline-none transition-colors hover:border-[#1565c0]">
              <option value="featured">Sort by: Featured</option><option value="price-low">Price: Low to high</option><option value="price-high">Price: High to low</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
          </label>
          <span className="text-[11px] text-slate-400">{filteredProducts.length} panels</span>
        </div>

        {status === "loading" ? (
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-[510px] animate-pulse rounded-[22px] bg-slate-100" />)}
          </div>
        ) : (
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} variants={stagger} className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {filteredProducts.map((product) => <ProductCard key={product.slug} product={product} />)}
          </motion.div>
        )}
      </div>
    </section>
  );
}

function TrustBand() {
  const items = [
    [ShieldCheck, "1-year warranty", "Peace of mind, built in"],
    [Truck, "Pan-India delivery", "We bring it to your door"],
    [RotateCcw, "Easy installation", "Set up by our experts"],
    [Check, "Made for India", "Thoughtful, reliable design"],
  ];

  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      variants={stagger}
      className="border-y border-slate-200 bg-white"
    >
      <div className="container-x grid grid-cols-2 divide-x divide-slate-200 sm:grid-cols-4">
        {items.map(([Icon, title, copy]) => (
          <motion.div key={title} variants={fadeUp} className="flex items-center gap-3 px-3 py-6 sm:px-5 lg:py-7">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-blue-50 text-[#1565c0]">
              <Icon className="h-4 w-4" strokeWidth={1.8} />
            </span>
            <div>
              <p className="text-xs font-extrabold text-slate-900">{title}</p>
              <p className="mt-1 text-[10px] leading-relaxed text-slate-400">{copy}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

function TelevisionGuide() {
  return (
    <section className="container-x py-24 sm:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <span className="eyebrow justify-center">Find your fit</span>
        <h2 className="text-3xl font-extrabold leading-tight text-slate-900 sm:text-5xl">Let&apos;s find your television</h2>
        <p className="mt-4 text-sm leading-relaxed text-slate-500 sm:text-base">
          The right screen makes the room. Start with your space, then discover the picture that belongs in it.
        </p>
      </div>
      <div className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_36px_rgba(15,23,42,0.06)]">
        <div className="grid grid-cols-3 border-b border-slate-200 bg-slate-50 px-5 py-4 text-[10px] font-extrabold uppercase tracking-[0.13em] text-slate-500 sm:px-7">
          <span>Room size</span><span>Recommended TV size</span><span>Start exploring</span>
        </div>
        {[
          ["Cosy bedroom", "24–43 inch", 32],
          ["Living room", "50–65 inch", 55],
          ["Statement space", "75–98 inch", 85],
        ].map(([room, range, size]) => (
          <div key={room} className="grid grid-cols-3 items-center border-b border-slate-100 px-5 py-5 last:border-0 sm:px-7">
            <span className="text-xs font-bold text-slate-900 sm:text-sm">{room}</span>
            <span className="text-xs text-slate-500 sm:text-sm">{range}</span>
            <button type="button" onClick={() => document.getElementById("tv-catalog")?.scrollIntoView({ behavior: "smooth" })} className="justify-self-start text-xs font-bold text-[#1565c0] hover:underline">
              View {size}&quot; TVs <ArrowRight className="ml-1 inline h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [selectedSize, setSelectedSize] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [resolution, setResolution] = useState("All resolutions");

  useEffect(() => {
    document.title = "Vibetouch | Explore television";
    api.getProducts({ category: "smart-tv" })
      .then((data) => {
        setProducts(data.length ? data : fallbackTvProducts);
        setStatus("ready");
      })
      .catch(() => {
        setProducts(fallbackTvProducts);
        setStatus("ready");
      });
  }, []);

  const filteredProducts = useMemo(() => {
    const next = products.filter((product) => {
      const size = productSize(product);
      const matchesSize = selectedSize === "All" || size === selectedSize;
      const type = product.displayType || (size && size <= 32 ? "HD LED" : "4K UHD");
      const matchesResolution = resolution === "All resolutions" || type === resolution;
      return matchesSize && matchesResolution;
    });

    return [...next].sort((a, b) => {
      if (sortBy === "price-low") return Number(a.price || 0) - Number(b.price || 0);
      if (sortBy === "price-high") return Number(b.price || 0) - Number(a.price || 0);
      return Number(b.is_featured) - Number(a.is_featured);
    });
  }, [products, resolution, selectedSize, sortBy]);

  function handleTvSizeSelect(size) {
    setSelectedSize(size);
    if (size === "All") setResolution("All resolutions");
  }

  return (
    <div className="bg-slate-50">
      <HeroSlider />

      <main>
        <section className="container-x pb-12 pt-16 sm:pb-16 sm:pt-24" id="tv-catalog">
          <motion.div initial="hidden" whileInView="show" viewport={viewportOnce} variants={fadeUp} className="max-w-2xl">
            <span className="eyebrow">Smart TV collection</span>
            <h1 className="text-3xl font-extrabold leading-[1.08] text-slate-900 sm:text-5xl">Explore TVs by size</h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-500 sm:text-base">
              From compact corners to cinematic living rooms, find a Vibetouch display made for the way you watch.
            </p>
          </motion.div>

          <motion.div initial="hidden" whileInView="show" viewport={viewportOnce} variants={stagger} className="mt-10">
            <SizeBrowser selectedSize={selectedSize} onSelect={handleTvSizeSelect} products={products} />
          </motion.div>

          <div className="mt-10 flex flex-col gap-4 border-y border-slate-200 py-4 text-xs sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 font-extrabold text-slate-900">
              <SlidersHorizontal className="h-4 w-4 text-[#1565c0]" /> Filters
            </div>
            <div className="flex flex-wrap gap-2">
              <label className="relative">
                <span className="sr-only">Resolution</span>
                <select value={resolution} onChange={(e) => setResolution(e.target.value)} className="appearance-none rounded-full border border-slate-200 bg-white py-2 pl-3 pr-8 text-[11px] font-semibold text-slate-600 outline-none transition-colors hover:border-[#1565c0]">
                  <option>All resolutions</option><option>HD LED</option><option>4K UHD</option><option>QLED</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
              </label>
              <button type="button" onClick={() => setSelectedSize("All")} className="rounded-full border border-slate-200 bg-white px-3 py-2 text-[11px] font-semibold text-slate-600 transition-colors hover:border-[#1565c0] hover:text-[#1565c0]">Clear size</button>
            </div>
            <label className="relative sm:ml-auto">
              <span className="sr-only">Sort products</span>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="appearance-none rounded-full border border-slate-200 bg-white py-2 pl-3 pr-8 text-[11px] font-semibold text-slate-600 outline-none transition-colors hover:border-[#1565c0]">
                <option value="featured">Sort by: Featured</option><option value="price-low">Price: Low to high</option><option value="price-high">Price: High to low</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
            </label>
            <span className="text-[11px] text-slate-400">{filteredProducts.length} TVs</span>
          </div>

          {status === "loading" ? (
            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => <div key={index} className="h-[510px] animate-pulse rounded-[22px] bg-slate-200/60" />)}
            </div>
          ) : (
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} variants={stagger} className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {filteredProducts.map((product) => <ProductCard key={product.slug} product={product} />)}
              {filteredProducts.length > 5 && <CareCard />}
            </motion.div>
          )}

          {status === "ready" && filteredProducts.length === 0 && (
            <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
              <p className="text-sm font-bold text-slate-900">No TVs match those filters yet.</p>
              <button type="button" onClick={() => { setSelectedSize("All"); setResolution("All resolutions"); }} className="mt-3 text-xs font-bold text-[#1565c0] hover:underline">Reset filters</button>
            </div>
          )}
        </section>

        <PanelCatalog />
        <TrustBand />
        <TelevisionGuide />
      </main>
    </div>
  );
}
