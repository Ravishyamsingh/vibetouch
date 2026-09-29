import { motion } from "framer-motion";

export default function SectionHeading({ eyebrow, title, align = "left", className = "", noMotion = false }) {
  const wrapperClass = `${align === "center" ? "mx-auto text-center max-w-2xl" : ""} ${className}`;

  const inner = (
    <>
      {eyebrow && (
        <span className="eyebrow">
          <motion.span
            aria-hidden
            animate={{ scaleX: [0.6, 1, 0.6] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="inline-block h-[2px] w-4 bg-lime align-middle"
          />
          {"  "}
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl font-bold leading-tight text-ink sm:text-4xl lg:text-[2.75rem]">
        {title}
      </h2>
    </>
  );

  // When used inside a parent's own scroll-triggered stagger group, skip the
  // duplicate viewport animation and just render — the parent already
  // handles the reveal timing for this element.
  if (noMotion) {
    return <div className={wrapperClass}>{inner}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={wrapperClass}
    >
      {inner}
    </motion.div>
  );
}
