import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from "framer-motion";
import { ChevronDown, Menu, X, Phone, Search } from "lucide-react";
import { navData } from "../lib/navData.js";
import SearchOverlay from "./SearchOverlay.jsx";

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => setScrolled(latest > 24));
  useEffect(() => setMobileOpen(false), [location.pathname]);

  return (
    <header className="sticky top-0 z-50">
      {/* Toll-free strip — collapses out of the way once the visitor scrolls,
          so the sticky nav reclaims that space instead of just sitting stacked. */}
      <motion.div
        animate={{ height: scrolled ? 0 : "auto", opacity: scrolled ? 0 : 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="hidden overflow-hidden bg-lime text-xs text-white/90 lg:block"
      >
        <div className="container-x flex justify-end py-1.5">
          <a href="tel:18003097050" className="flex items-center gap-1.5 hover:text-white">
            <Phone className="h-3.5 w-3.5" /> Toll Free: 1800-309-7050
          </a>
        </div>
      </motion.div>

      <div
        className={`border-b transition-colors duration-300 ${
          scrolled ? "border-ink/10 bg-deep/95 shadow-lg shadow-black/10" : "border-ink/5 bg-deep/80"
        } backdrop-blur-md`}
      >
        <motion.div
          className="container-x flex items-center justify-between"
          animate={{ height: scrolled ? 68 : 80 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <Link to="/" className="flex items-center gap-2 text-xl font-extrabold text-ink">
            <motion.span
              whileHover={{ rotate: 15 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="grid h-9 w-9 place-items-center rounded-full bg-lime text-white"
            >
              V
            </motion.span>
            vibetouch
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 lg:flex" onMouseLeave={() => setOpenMenu(null)}>
            {navData.map((item) => (
              <div key={item.label} className="relative" onMouseEnter={() => setOpenMenu(item.label)}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `relative flex items-center gap-1 py-2 text-sm font-semibold transition-colors hover:text-lime ${
                      isActive ? "text-lime" : "text-ink"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {item.label} <ChevronDown className="h-3.5 w-3.5" />
                      {isActive && (
                        <motion.span
                          layoutId="nav-underline"
                          className="absolute -bottom-0.5 left-0 right-0 h-[2px] rounded-full bg-lime"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>

                <AnimatePresence>
                  {openMenu === item.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute left-1/2 top-full z-50 mt-3 w-max min-w-[420px] -translate-x-1/3 rounded-2xl
                                 border border-ink/10 bg-deep-soft p-6 shadow-card-lg"
                    >
                      <motion.div
                        initial="hidden"
                        animate="show"
                        variants={{ show: { transition: { staggerChildren: 0.05 } } }}
                        className="grid grid-flow-col gap-8"
                      >
                        {item.columns.map((col, i) => (
                          <motion.div
                            key={i}
                            variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
                            className="min-w-[140px]"
                          >
                            {col.heading && (
                              <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-lime">
                                {col.heading}
                              </h3>
                            )}
                            <ul className="space-y-2">
                              {col.items.map((sub) => (
                                <li key={sub.label}>
                                  <Link
                                    to={sub.to}
                                    target={sub.newTab ? "_blank" : undefined}
                                    rel={sub.newTab ? "noreferrer" : undefined}
                                    className="text-sm text-cloud transition-colors hover:translate-x-0.5 hover:text-ink inline-block"
                                    onClick={() => setOpenMenu(null)}
                                  >
                                    {sub.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        ))}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="hidden items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-blue-50 hover:text-[#1565c0] lg:inline-flex"
              aria-label="Search products"
            >
              <Search className="h-4 w-4" /> Search
            </button>
            <Link to="/contact" className="hidden btn-lime !px-5 !py-3 text-sm lg:inline-flex">
              Gem Authorization
            </Link>
            <button
              className="grid h-10 w-10 place-items-center rounded-full border border-ink/15 lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Mobile slide-in menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="ml-auto h-full w-[85%] max-w-sm overflow-y-auto bg-deep-soft p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-6 flex items-center justify-between">
                <span className="text-lg font-bold text-ink">Menu</span>
                <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="text-ink">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  setSearchOpen(true);
                }}
                className="mb-6 flex w-full items-center gap-3 rounded-2xl bg-white px-4 py-3 text-left text-sm font-bold text-slate-700 shadow-sm"
              >
                <Search className="h-4 w-4 text-[#1565c0]" /> Search products
              </button>
              <motion.div
                initial="hidden"
                animate="show"
                variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } }}
                className="space-y-6"
              >
                {navData.map((item) => (
                  <motion.div
                    key={item.label}
                    variants={{ hidden: { opacity: 0, x: 24 }, show: { opacity: 1, x: 0 } }}
                  >
                    <Link
                      to={item.to}
                      className="text-base font-bold text-lime"
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </Link>
                    <ul className="mt-2 space-y-2 border-l border-ink/10 pl-4">
                      {item.columns.flatMap((c) => c.items).map((sub) => (
                        <li key={sub.label}>
                          <Link
                            to={sub.to}
                            target={sub.newTab ? "_blank" : undefined}
                            rel={sub.newTab ? "noreferrer" : undefined}
                            className="text-sm text-cloud"
                            onClick={() => setMobileOpen(false)}
                          >
                            {sub.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
