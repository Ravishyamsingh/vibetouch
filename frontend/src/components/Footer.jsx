import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Facebook, Instagram, Youtube, Linkedin, Phone, Mail } from "lucide-react";
import { stagger, fadeUp, viewportOnce } from "../lib/motion.js";

const XIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.9 2H22l-7.6 8.7L23.3 22h-7l-5.5-7.2L4.5 22H1.4l8.1-9.3L1 2h7.2l5 6.6L18.9 2Zm-1.2 18h1.7L6.4 3.9H4.6L17.7 20Z" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-ink/5 bg-deep-soft">
      {/* Faint ambient glow, consistent with the hero, so the footer doesn't
          feel like a bolted-on flat panel at the end of an animated page. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime/5 blur-[120px]"
      />

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        variants={stagger}
        className="container-x relative grid grid-cols-1 gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4"
      >
        <motion.div variants={fadeUp}>
          <Link to="/" className="flex items-center gap-2 text-xl font-extrabold text-ink">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-lime text-white">V</span>
            vibetouch
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-cloud">
            Established in 2024, Vibetouch stands as a premier name in India&rsquo;s consumer
            durable and IT product landscape. As an OEM, ODM, and OBM manufacturer, we combine
            advanced technology, innovative design, and impeccable craftsmanship to deliver
            products that resonate with modern needs and lifestyles.
          </p>
          <div className="mt-5 flex gap-3">
            {[
              { Icon: Facebook, href: "https://www.facebook.com/profile.php?id=61582855432569" },
              { Icon: Instagram, href: "https://www.instagram.com/vibetouchindia/" },
              { Icon: XIcon, href: "https://x.com/ivibetouch" },
              { Icon: Youtube, href: "https://www.youtube.com/@vibetouchindia" },
              { Icon: Linkedin, href: "https://www.linkedin.com/in/vibetouch-vibetouch-493b3038b/" },
            ].map(({ Icon, href }, i) => (
              <motion.a
                key={i}
                href={href}
                target="_blank"
                rel="noreferrer"
                whileHover={{ y: -3, scale: 1.08 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="grid h-9 w-9 place-items-center rounded-full border border-ink/15 text-cloud
                           transition-colors hover:border-lime hover:text-lime hover:shadow-lime"
              >
                <Icon className="h-4 w-4" />
              </motion.a>
            ))}
          </div>
        </motion.div>

        <motion.div variants={fadeUp}>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-ink">Products</h3>
          <ul className="space-y-3 text-sm text-cloud">
            <li><Link to="/products/interactive-panel" className="inline-block transition-transform hover:translate-x-1 hover:text-lime">Interactive Panel</Link></li>
            <li><Link to="/products/desktop-computer" className="inline-block transition-transform hover:translate-x-1 hover:text-lime">Desktop Computer</Link></li>
            <li><Link to="/products/all-in-one-pc" className="inline-block transition-transform hover:translate-x-1 hover:text-lime">All In One PC</Link></li>
            <li><Link to="/contact" className="inline-block transition-transform hover:translate-x-1 hover:text-lime">Service Center</Link></li>
          </ul>
        </motion.div>

        <motion.div variants={fadeUp}>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-ink">Useful Links</h3>
          <ul className="space-y-3 text-sm text-cloud">
            <li><Link to="/about" className="inline-block transition-transform hover:translate-x-1 hover:text-lime">About Us</Link></li>
            <li><Link to="/products/smart-tv" className="inline-block transition-transform hover:translate-x-1 hover:text-lime">Our Products</Link></li>
            <li><Link to="/contact" className="inline-block transition-transform hover:translate-x-1 hover:text-lime">Blog &amp; News</Link></li>
            <li><Link to="/contact" className="inline-block transition-transform hover:translate-x-1 hover:text-lime">Contact Us</Link></li>
            <li><Link to="/contact" className="inline-block transition-transform hover:translate-x-1 hover:text-lime">Website Sitemap</Link></li>
            <li><Link to="/contact" className="inline-block transition-transform hover:translate-x-1 hover:text-lime">Gem Authorization</Link></li>
          </ul>
        </motion.div>

        <motion.div variants={fadeUp}>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-ink">Contact Us</h3>
          <ul className="space-y-3 text-sm text-cloud">
            <li>
              <a href="tel:+919810711398" className="flex items-center gap-2 hover:text-lime">
                <Phone className="h-4 w-4 shrink-0" /> +91 98107 11398
              </a>
            </li>
            <li>
              <a href="tel:18003097050" className="flex items-center gap-2 hover:text-lime">
                <Phone className="h-4 w-4 shrink-0" /> Toll Free: 1800-309-7050
              </a>
            </li>
            <li>
              <a href="mailto:info@vibetouch.in" className="flex items-center gap-2 hover:text-lime">
                <Mail className="h-4 w-4 shrink-0" /> info@vibetouch.in
              </a>
            </li>
            <li>
              <a href="mailto:care@vibetouch.in" className="flex items-center gap-2 hover:text-lime">
                <Mail className="h-4 w-4 shrink-0" /> care@vibetouch.in
              </a>
            </li>
          </ul>
        </motion.div>
      </motion.div>

      <div className="relative border-t border-ink/5">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-6 text-xs text-cloud sm:flex-row">
          <p>Copyright @2026 Vibetouch. All Rights Reserved</p>
          <div className="flex gap-6">
            <Link to="/contact" className="hover:text-lime">Terms &amp; Conditions</Link>
            <Link to="/contact" className="hover:text-lime">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
