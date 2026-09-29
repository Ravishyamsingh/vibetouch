/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        // Body font — VOLTRIQ's "--font". Headings should use font-display.
        sans: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
        display: ["Outfit", "Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
      colors: {
        // Restructured to match voltriq.com's real theme (from their
        // production style.css). Token NAMES are kept the same as the old
        // vibetouch dark/lime theme on purpose, so every existing
        // className string across the app (bg-deep, text-lime, text-cloud,
        // text-ink, hover:bg-lime-bright) keeps resolving — only the
        // underlying hex values change, dark+lime -> light+blue.
        ink: "#0f172a", // was near-black button text -> now VOLTRIQ's main dark navy text (--text)
        lime: {
          DEFAULT: "#1565c0", // was lime accent -> now VOLTRIQ primary blue (--blue)
          bright: "#1e88e5", // was lime hover -> now the lighter hover blue (--blue-2)
        },
        cloud: "#64748b", // was muted light text on dark -> now muted gray text on light (--muted)
        deep: {
          DEFAULT: "#ffffff", // was near-black page bg -> now white page background (--bg)
          soft: "#f8fafc", // was dark section tint -> now the pale gray-blue section tint (--soft)
          card: "#ffffff", // was dark card surface -> now white card surface (paired with border + shadow)
        },
        // New tokens for VOLTRIQ-specific accents that have no old equivalent.
        blue: {
          pale: "#e3f2fd", // --blue-pale
          deep: "#0d47a1", // --blue-deep
        },
        border: "#e2e8f0", // --border
      },
      boxShadow: {
        lime: "0 12px 32px -8px rgba(21, 101, 192, 0.28)", // was a lime glow -> now a soft blue glow
        card: "0 4px 24px rgba(15, 23, 42, 0.06)", // VOLTRIQ --shadow
        "card-lg": "0 20px 50px rgba(15, 23, 42, 0.1)", // VOLTRIQ --shadow-lg
      },
    },
  },
  plugins: [],
};
