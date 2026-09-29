import { useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, BadgeCheck, Award, Globe2 } from "lucide-react";
import SectionHeading from "../components/SectionHeading.jsx";
import PlaceholderImage from "../components/PlaceholderImage.jsx";
import { stagger, fadeUp, scaleIn, viewportOnce } from "../lib/motion.js";

const certs = [
  { icon: Award, text: "Trusted by many departments of Govt." },
  { icon: BadgeCheck, text: "Trusted OEM & seller on GeM Portal" },
  { icon: Globe2, text: "Pan-India on-site warranty" },
  { icon: ShieldCheck, text: "BIS & BEE certified, ZED Gold certified" },
  { icon: ShieldCheck, text: "RoHS compliant" },
  { icon: BadgeCheck, text: "ISO 9001 certified" },
];

export default function About() {
  useEffect(() => {
    document.title = "About Us | Vibetouch";
  }, []);

  return (
    <div className="container-x py-16">
      <SectionHeading eyebrow="About Vibetouch" title="Vibetouch: Innovation in Every Touch" />

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        variants={stagger}
        className="mt-12 grid items-center gap-14 lg:grid-cols-2"
      >
        <motion.div variants={fadeUp}>
          <p className="text-cloud">
            Established in 2024, Vibetouch stands as a premier name in India&rsquo;s consumer
            durable and IT product landscape. As an OEM, ODM, and OBM manufacturer, we combine
            advanced technology, innovative design, and impeccable craftsmanship to deliver
            products that resonate with modern needs and lifestyles.
          </p>
          <p className="mt-4 text-cloud">
            At Vibetouch, we merge advanced touch technology with tailored IT solutions,
            revolutionizing the way businesses engage and grow in today&rsquo;s digital world. Our
            touch-enabled products are designed to streamline operations, boost efficiency, and
            deliver an exceptional user experience.
          </p>
          <p className="mt-4 text-cloud">
            From concept to execution, Vibetouch is committed to providing state-of-the-art
            technology that not only drives business growth but also elevates customer
            interactions with ease and accuracy.
          </p>
        </motion.div>
        <motion.div variants={scaleIn}>
          <PlaceholderImage categorySlug="interactive-panel" className="aspect-square w-full" />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportOnce}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mt-20 rounded-3xl border border-ink/10 bg-deep-card p-10 shadow-card-lg"
      >
        <h2 className="text-center text-2xl font-bold text-ink">Why Choose Vibetouch?</h2>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={stagger}
          className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {certs.map(({ icon: Icon, text }) => (
            <motion.div
              key={text}
              variants={fadeUp}
              whileHover={{ y: -4, borderColor: "rgba(21,101,192,0.4)" }}
              className="flex items-center gap-4 rounded-2xl border border-ink/10 p-5 transition-shadow hover:shadow-lime"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-lime/10 text-lime">
                <Icon className="h-5 w-5" />
              </span>
              <p className="text-sm text-cloud">{text}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
