// Shared motion language for the whole site. Import these instead of
// hand-rolling new variants per page, so every section reveals with the
// same rhythm and easing — that consistency is what reads as "designed"
// rather than "animated in places."

export const EASE = [0.16, 1, 0.3, 1]; // brisk, confident deceleration

export const viewportOnce = { once: true, margin: "-100px" };

// Parent wrapper: staggers whichever `fadeUp`/`scaleIn` children sit inside it.
export const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: EASE } },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: EASE } },
};

// For a single element entering on scroll (no parent stagger needed).
export const revealProps = {
  initial: "hidden",
  whileInView: "show",
  viewport: viewportOnce,
};

// For a whole section that should stagger its own children on scroll.
export const staggerSectionProps = {
  initial: "hidden",
  whileInView: "show",
  viewport: viewportOnce,
  variants: stagger,
};
