import { Link } from "react-router-dom";
import { GitCompareArrows, Heart, Star } from "lucide-react";
import PlaceholderImage from "./PlaceholderImage.jsx";
import { useCompare } from "../context/CompareContext.jsx";
import { imageUrl } from "../lib/api.js";
import { getLocalProductImage } from "../lib/localProductImages.js";

export default function ProductCard({ product, openInNewTab = false }) {
  const { toggle, isSelected } = useCompare();
  const selected = isSelected(product.slug);
  const size = String(product.model_number || product.name || "").match(/\d{2,3}/)?.[0];
  const displayType = product.category_slug === "interactive-panel" ? "Interactive 4K" : size && Number(size) <= 32 ? "HD LED" : "4K UHD";
  const productImage = imageUrl(product.image_url || getLocalProductImage(product));
  const productLinkProps = openInNewTab ? { target: "_blank", rel: "noreferrer" } : {};

  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-[22px] border border-slate-200/90 bg-white p-4 shadow-[0_5px_24px_rgba(15,23,42,0.045)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#1565c0]/45 hover:shadow-[0_18px_42px_rgba(15,23,42,0.12)]">
      <div className="flex items-center justify-between pb-3 text-[10px] font-bold uppercase tracking-[0.14em]">
        <span className="text-[#1565c0]">{product.is_featured ? "Featured" : "New"}</span>
        <button type="button" aria-label={`Save ${product.name}`} className="grid h-7 w-7 place-items-center rounded-full text-slate-400 transition-colors hover:bg-blue-50 hover:text-[#1565c0]">
          <Heart className="h-3.5 w-3.5" />
        </button>
      </div>

      <Link to={`/product/${product.slug}`} {...productLinkProps} className="relative block overflow-hidden rounded-2xl bg-slate-100">
        {productImage ? (
          <img src={productImage} alt={product.image_alt || product.name} className="aspect-[1.42/1] w-full bg-white object-contain p-2" />
        ) : (
          <PlaceholderImage categorySlug={product.category_slug} className="aspect-[1.42/1] w-full rounded-2xl" float={false} />
        )}
        {size && <span className="absolute bottom-2.5 left-2.5 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-extrabold text-slate-700 shadow-sm backdrop-blur">{size}&quot;</span>}
      </Link>

      <div className="flex flex-1 flex-col pt-4">
        <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-400">
          <span>{product.model_number || "VBT SERIES"}</span>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <span>{displayType}</span>
        </div>
        <Link to={`/product/${product.slug}`} {...productLinkProps}>
          <h3 className="mt-2 min-h-[3rem] text-base font-extrabold leading-[1.32] text-slate-900 transition-colors group-hover:text-[#1565c0]">{product.name}</h3>
        </Link>
        <div className="mt-3 flex items-center gap-1.5 text-xs">
          <span className="flex items-center gap-1 font-bold text-amber-500"><Star className="h-3.5 w-3.5 fill-current" /> 4.8</span>
          <span className="text-slate-400">(24)</span>
        </div>
        <p className="mt-3 line-clamp-2 min-h-[2.25rem] text-xs leading-relaxed text-slate-500">{product.tagline || "Designed for a smarter everyday."}</p>

        <div className="mt-auto pt-5">
          {product.price && <p className="text-[15px] font-extrabold text-slate-900">From ₹{Number(product.price).toLocaleString("en-IN")}</p>}
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Link to="/contact" className="rounded-full bg-slate-950 px-2 py-2.5 text-center text-[11px] font-bold text-white transition-colors hover:bg-[#1565c0]">Buy now</Link>
            <Link to={`/product/${product.slug}`} {...productLinkProps} className="rounded-full border border-slate-300 px-2 py-2.5 text-center text-[11px] font-bold text-slate-800 transition-colors hover:border-[#1565c0] hover:text-[#1565c0]">Learn more</Link>
          </div>
          <button type="button" onClick={() => toggle({ slug: product.slug, name: product.name, category_slug: product.category_slug })} className={`mt-3 flex w-full items-center justify-center gap-2 rounded-full border-2 px-3 py-2.5 text-xs font-bold transition-all ${selected ? "border-[#1565c0] bg-blue-50 text-[#1565c0]" : "border-slate-200 text-slate-500 hover:border-[#1565c0] hover:bg-blue-50 hover:text-[#1565c0]"}`}>
            <GitCompareArrows className="h-4 w-4" /> {selected ? "Added to compare" : "Compare products"}
          </button>
        </div>
      </div>
    </article>
  );
}
