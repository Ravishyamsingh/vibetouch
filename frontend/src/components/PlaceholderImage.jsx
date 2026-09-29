import { motion } from "framer-motion";
import { Tv, Monitor, Laptop, MonitorSmartphone, Server, MousePointer2 } from "lucide-react";

const ICONS = {
  "smart-tv": Tv,
  "interactive-panel": MonitorSmartphone,
  plfd: MonitorSmartphone,
  "desktop-computer": Monitor,
  "all-in-one-pc": Monitor,
  workstation: Server,
  laptop: Laptop,
  "computer-accessories": MousePointer2,
};

/**
 * Tasteful stand-in for real product photography, which we don't have.
 * Animated like a powered-on screen (glow pulse + scanline sheen + gentle
 * float) so it reads as a display product, not a blank placeholder card.
 * Swap for <img src="..." /> once real shots are ready — every call site
 * only needs categorySlug + className, so the change is local.
 */
export default function PlaceholderImage({ categorySlug, className = "", float = true }) {
  const Icon = ICONS[categorySlug] || Monitor;
  return (
    <motion.div
      animate={float ? { y: [0, -10, 0] } : undefined}
      transition={float ? { duration: 5, repeat: Infinity, ease: "easeInOut" } : undefined}
      className={`group relative flex items-center justify-center overflow-hidden rounded-3xl
                  bg-gradient-to-br from-[#0f172a] to-[#1e293b] ${className}`}
    >
      {/* Pulsing blue glow — reads as "screen is on" for a TV/panel brand */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(21,101,192,0.35),transparent_60%)]"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_85%,rgba(30,136,229,0.18),transparent_55%)]" />

      {/* Diagonal sheen sweep on hover — like light catching a glass panel */}
      <div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent
                   transition-transform duration-1000 ease-out group-hover:translate-x-full"
        style={{ transform: "skewX(-20deg)" }}
      />

      <Icon className="relative h-1/3 w-1/3 text-white/25 transition-colors duration-500 group-hover:text-lime/40" strokeWidth={1} />

      {/* Thin animated border to suggest a screen bezel */}
      <div className="pointer-events-none absolute inset-3 rounded-2xl border border-white/5" />
    </motion.div>
  );
}
