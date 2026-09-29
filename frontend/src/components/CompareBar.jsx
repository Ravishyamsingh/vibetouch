import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X, GitCompareArrows } from "lucide-react";
import { useCompare } from "../context/CompareContext.jsx";

export default function CompareBar() {
  const { items, remove, clear, atCapacity, maxCompare } = useCompare();

  return (
    <>
      <AnimatePresence>
        {atCapacity && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="fixed inset-x-0 z-40 flex justify-center px-4"
            style={{ bottom: items.length > 0 ? "5.5rem" : "1.5rem" }}
          >
            <div className="rounded-full border border-lime/30 bg-blue-pale px-5 py-2.5 text-sm font-semibold text-lime shadow-card-lg">
              You can compare up to {maxCompare} at a time — remove one to add another.
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {items.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "tween", duration: 0.25 }}
            className="fixed inset-x-0 bottom-0 z-40 border-t border-lime/20 bg-deep-soft/95 shadow-card-lg backdrop-blur"
          >
            <div className="container-x flex flex-wrap items-center gap-4 py-4">
              <div className="flex items-center gap-2 text-sm font-bold text-lime">
                <GitCompareArrows className="h-4 w-4" /> Compare ({items.length}/{maxCompare})
              </div>
              <div className="flex flex-1 flex-wrap gap-2">
                {items.map((p) => (
                  <span
                    key={p.slug}
                    className="flex items-center gap-2 rounded-full border border-ink/15 py-1.5 pl-3 pr-1.5 text-xs text-ink/80"
                  >
                    {p.name}
                    <button onClick={() => remove(p.slug)} aria-label={`Remove ${p.name}`}>
                      <X className="h-3.5 w-3.5 hover:text-lime" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={clear} className="text-xs text-cloud hover:text-ink">
                  Clear
                </button>
                <Link
                  to="/compare"
                  className={`btn-lime !px-5 !py-2.5 text-sm ${items.length < 2 ? "pointer-events-none opacity-40" : ""}`}
                >
                  Compare
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
