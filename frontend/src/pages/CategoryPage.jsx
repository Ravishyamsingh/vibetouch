import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "../lib/api.js";
import ProductCard from "../components/ProductCard.jsx";
import BackButton from "../components/BackButton.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import { stagger, fadeUp, viewportOnce } from "../lib/motion.js";

export default function CategoryPage() {
  const { categorySlug } = useParams();
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    setStatus("loading");
    api
      .getProducts({ category: categorySlug })
      .then((data) => {
        setProducts(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, [categorySlug]);

  const categoryName = products[0]?.category_name || categorySlug.replace(/-/g, " ");

  useEffect(() => {
    document.title = `${categoryName} | Vibetouch`;
  }, [categoryName]);

  return (
    <div className="container-x py-16">
      <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
        <BackButton fallbackTo="/" label="Back" />
      </motion.div>

      <SectionHeading eyebrow="Our Products" title={categoryName} />

      {status === "loading" && (
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-80 animate-pulse rounded-3xl bg-ink/5" />
          ))}
        </div>
      )}

      {status === "error" && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-14 rounded-2xl border border-ink/10 bg-deep-card p-8 text-cloud shadow-card"
        >
          Couldn&rsquo;t reach the API. Make sure the backend is running and{" "}
          <code className="text-lime">npm run db:seed</code> has been run — see the project README.
        </motion.p>
      )}

      {status === "ready" && products.length === 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-14 rounded-2xl border border-ink/10 bg-deep-card p-8 text-cloud shadow-card"
        >
          No products in this category yet.
        </motion.p>
      )}

      {status === "ready" && products.length > 0 && (
        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger}
          className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {products.map((p) => (
            <motion.div key={p.slug} variants={fadeUp}>
              <ProductCard product={p} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
