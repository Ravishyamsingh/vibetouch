import { useState } from "react";
import PlaceholderImage from "./PlaceholderImage.jsx";
import { imageUrl } from "../lib/api.js";

export default function ProductGallery({ images = [], categorySlug, productName }) {
  const [active, setActive] = useState(0);
  const hasRealImages = images.length > 0;

  return (
    <div className="space-y-4">
      <div
        className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-card"
      >
        {hasRealImages ? (
          <img
            src={imageUrl(images[active]?.url)}
            alt={images[active]?.alt_text || productName}
            className="aspect-[4/3] w-full bg-white object-contain p-6"
          />
        ) : (
          <PlaceholderImage categorySlug={categorySlug} className="aspect-[4/3] w-full" />
        )}
      </div>

      {hasRealImages && images.length > 1 && (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
          {images.map((img, i) => (
            <button
              key={img.id || i}
              onClick={() => setActive(i)}
              className={`overflow-hidden rounded-xl border-2 transition-colors ${
                i === active ? "border-lime" : "border-ink/10"
              }`}
              aria-label={`View image ${i + 1}`}
            >
              <img src={imageUrl(img.url)} alt="" className="aspect-square w-full bg-white object-contain p-1" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
