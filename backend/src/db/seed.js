// Seeds categories + products.
// Safe to re-run: every insert is ON CONFLICT (slug) DO UPDATE, so editing a
// row here and re-running `npm run db:seed` just updates it in place.
//
// Two products (50VBT TV, IPC86VBT panel) carry the real copy/specs pulled
// from vibetouch.in screenshots. Every other row uses the REAL model numbers
// and sizes from the site's own navigation menu, with starter specs/prices
// you should swap for the real thing — search "PLACEHOLDER" to find them,
// or just edit prices/stock straight from the admin dashboard once it's up.

import { pool } from "./pool.js";

const categories = [
  { slug: "smart-tv", name: "Smart TV", tagline: "Make in India smart TVs with vivid displays and Android TV", sort_order: 1 },
  { slug: "interactive-panel", name: "Interactive Panel", tagline: "Interactive flat panels for smart classrooms and meeting rooms", sort_order: 2 },
  { slug: "plfd", name: "PLFD", tagline: "Professional large-format displays for signage and business", sort_order: 3 },
  { slug: "desktop-computer", name: "Desktop Computer", tagline: "High-performance desktops with expandable memory and graphics", sort_order: 4 },
  { slug: "all-in-one-pc", name: "All In One PC", tagline: "Sleek all-in-one PCs with powerful performance", sort_order: 5 },
  { slug: "workstation", name: "Workstation", tagline: "Engineered for creators who demand ultimate performance", sort_order: 6 },
  { slug: "laptop", name: "Laptop", tagline: "Lightweight laptops for productivity on the move", sort_order: 7 },
  { slug: "computer-accessories", name: "Computer Accessories", tagline: "Accessories to complete your setup", sort_order: 8 },
];

// Placeholder INR price ladders, scaled by screen size — edit freely from
// the admin dashboard once it's running; these just seed something sane.
const tvPrice = { 24: 9999, 32: 13999, 43: 21999, 50: 27999, 55: 32999, 65: 45999, 75: 62999, 85: 89999, 86: 92999, 98: 149999 };
const panelPrice = { 55: 99999, 65: 129999, 75: 169999, 86: 229999, 98: 299999, 100: 319999, 105: 359999, 110: 399999 };
const plfdPrice = { 32: 34999, 43: 44999, 50: 54999, 55: 64999, 65: 89999, 75: 119999, 85: 159999, 86: 164999, 98: 219999, 100: 239999 };

// --- Smart TV: 24 to 98 inch (real sizes from the nav) ---------------------
const tvSizes = [24, 32, 43, 50, 55, 65, 75, 85, 86, 98];
const smartTvProducts = tvSizes.map((size, i) => {
  const isRealDetailed = size === 50;
  return {
    category: "smart-tv",
    slug: `vibetouch-${size}vbt-smart-tv`,
    model_number: `${size}VBT`,
    name: isRealDetailed
      ? "Vibetouch 50 Inch UHD Smart OLED TV With 1 Year Warranty"
      : `Vibetouch ${size} Inch ${size <= 32 ? "HD LED" : "UHD Smart"} TV`,
    tagline: "Make in India Smart TV",
    description: isRealDetailed
      ? "50-inch UHD smart TV with an FHD|IPS panel, bezel-less design, Android TV and HDR support — built and warrantied in India."
      : `PLACEHOLDER — ${size}-inch ${size <= 32 ? "HD LED" : "UHD Smart"} TV. Swap in the real panel spec, warranty terms and box copy for this size.`,
    specs: isRealDetailed
      ? {
          "Resolution": "2160p 4K",
          "Panel": "FHD | IPS",
          "Operating System": "Android TV 9.0 (Google TV)",
          "Sound": "16W surround speakers",
          "Processor": "Quad-core",
          "Refresh Rate": "60Hz",
          "Viewing Angle": "178°",
          "Width": "43.50 in",
          "Height (without stand)": "25.27 in",
          "Weight (with base)": "12.2 kg",
          "Weight (without base)": "11.9 kg",
        }
      : { "Screen Size": `${size} inch`, "Warranty": "1 year (PLACEHOLDER)" },
    features: isRealDetailed
      ? ["Bezel-less design", "HDR", "Vivid color", "Multi-viewing mode", "Chromecast built-in", "178° wide viewing angle"]
      : ["PLACEHOLDER feature 1", "PLACEHOLDER feature 2"],
    price: tvPrice[size],
    stock_quantity: isRealDetailed ? 40 : 15,
    is_featured: isRealDetailed,
    sort_order: i,
  };
});

// --- Interactive Panel: 55 to 110 inch --------------------------------------
const panelSizes = [55, 65, 75, 86, 98, 100, 105, 110];
const interactivePanelProducts = panelSizes.map((size, i) => {
  const isRealDetailed = size === 86;
  return {
    category: "interactive-panel",
    slug: `vibetouch-ipc${size}vbt-interactive-panel`,
    model_number: `IPC${size}VBT`,
    name: `Vibetouch IPC${size}VBT ${size} inch Interactive Panel`,
    tagline: "4K UHD interactive flat panel for smart classrooms and meeting rooms",
    description: isRealDetailed
      ? `Vibetouch IPC${size}VBT ${size} inch interactive flat panel display with 4K UHD resolution and multi-touch technology for smart classrooms and meeting rooms.`
      : `PLACEHOLDER — ${size}-inch interactive flat panel. Swap in the real touch-point count, OS and connectivity spec for this size.`,
    specs: isRealDetailed
      ? {
          "Display": "86 inch, 4K UHD",
          "Touch": "Multi-touch, superior touch response",
          "Body": "Metal body, ultra-thin bezel",
          "Glass": "Anti-glare tempered glass",
          "Speakers": "2 x 20W",
          "Connectivity": "Wireless screen mirroring",
        }
      : { "Display Size": `${size} inch`, "Touch Points": "PLACEHOLDER" },
    features: isRealDetailed
      ? ["Anti-glare 4K display", "Multi-touch", "Wireless screen mirroring", "2x20W speakers", "Metal ultra-thin bezel"]
      : ["PLACEHOLDER feature 1", "PLACEHOLDER feature 2"],
    price: panelPrice[size],
    stock_quantity: isRealDetailed ? 20 : 8,
    is_featured: isRealDetailed,
    sort_order: i,
  };
});

// --- PLFD (large format display): 32 to 100 inch ----------------------------
const plfdSizes = [32, 43, 50, 55, 65, 75, 85, 86, 98, 100];
const plfdProducts = plfdSizes.map((size, i) => ({
  category: "plfd",
  slug: `vibetouch-lfd${size}vbt-plfd`,
  model_number: `LFD${size}VBT`,
  name: `Vibetouch LFD${size}VBT ${size} inch Smart PLFD`,
  tagline: "Professional large-format display, 1 year warranty",
  description: `PLACEHOLDER — ${size}-inch professional large-format display for signage, retail and corporate lobbies. Swap in the real brightness, panel and mounting spec.`,
  specs: { "Display Size": `${size} inch`, "Orientation": "Landscape / Portrait (PLACEHOLDER)", "Warranty": "1 year" },
  features: ["PLACEHOLDER feature 1", "PLACEHOLDER feature 2"],
  price: plfdPrice[size],
  stock_quantity: 10,
  is_featured: false,
  sort_order: i,
}));

// --- Everything else: one flagship + one placeholder per category ----------
const otherProducts = [
  {
    category: "desktop-computer", slug: "vibetouch-desktop-elite",
    model_number: "DT-ELITE", name: "Vibetouch Desktop Elite",
    tagline: "High-performance desktop with advanced graphics and expandable memory",
    description: "PLACEHOLDER — swap in real CPU/GPU/RAM/storage configuration options.",
    specs: { "Form Factor": "Mini tower", "Expandability": "PLACEHOLDER" },
    features: ["Expandable memory", "Advanced graphics option", "Seamless computing"],
    price: 42999, stock_quantity: 18, is_featured: true, sort_order: 0,
  },
  {
    category: "all-in-one-pc", slug: "vibetouch-aio-slim",
    model_number: "AIO-SLIM", name: "Vibetouch All-In-One Slim",
    tagline: "Sleek all-in-one PC with powerful performance and versatile storage",
    description: "PLACEHOLDER — swap in the real screen size, CPU and storage spec.",
    specs: { "Form Factor": "All-in-one", "Display": "PLACEHOLDER" },
    features: ["Stunning display options", "Versatile storage", "Space-saving design"],
    price: 54999, stock_quantity: 12, is_featured: true, sort_order: 0,
  },
  {
    category: "workstation", slug: "vibetouch-workstation-pro",
    model_number: "WS-PRO", name: "Vibetouch Workstation Pro",
    tagline: "Engineered for creators who demand ultimate performance",
    description: "PLACEHOLDER — swap in real CPU/GPU/certification spec for creative + engineering workloads.",
    specs: { "Target Use": "Creative & engineering workloads (PLACEHOLDER)" },
    features: ["Advanced processing", "Expansive display support", "Unmatched reliability"],
    price: 124999, stock_quantity: 6, is_featured: false, sort_order: 0,
  },
  {
    category: "laptop", slug: "vibetouch-laptop-air",
    model_number: "LT-AIR", name: "Vibetouch Laptop Air",
    tagline: "Your partner for productivity and entertainment on the move",
    description: "PLACEHOLDER — swap in real CPU/RAM/battery-life spec.",
    specs: { "Weight": "PLACEHOLDER", "Battery Life": "PLACEHOLDER" },
    features: ["Lightweight chassis", "Cutting-edge performance", "Vibrant display"],
    price: 48999, stock_quantity: 22, is_featured: false, sort_order: 0,
  },
  {
    category: "computer-accessories", slug: "vibetouch-accessory-bundle",
    model_number: "ACC-BUNDLE", name: "Vibetouch Accessory Bundle",
    tagline: "Keyboards, mice and mounts to complete your setup",
    description: "PLACEHOLDER — list the real accessories you carry.",
    specs: {},
    features: ["PLACEHOLDER feature 1"],
    price: 2499, stock_quantity: 50, is_featured: false, sort_order: 0,
  },
];

const allProducts = [
  ...smartTvProducts,
  ...interactivePanelProducts,
  ...plfdProducts,
  ...otherProducts,
];

async function seed() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const categoryIds = {};
    for (const c of categories) {
      const { rows } = await client.query(
        `INSERT INTO categories (slug, name, tagline, sort_order)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (slug) DO UPDATE
           SET name = EXCLUDED.name, tagline = EXCLUDED.tagline, sort_order = EXCLUDED.sort_order
         RETURNING id, slug`,
        [c.slug, c.name, c.tagline, c.sort_order]
      );
      categoryIds[rows[0].slug] = rows[0].id;
    }

    for (const p of allProducts) {
      await client.query(
        `INSERT INTO products
           (category_id, slug, model_number, name, tagline, description, specs, features, price, stock_quantity, is_featured, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         ON CONFLICT (slug) DO UPDATE SET
           category_id = EXCLUDED.category_id,
           model_number = EXCLUDED.model_number,
           name = EXCLUDED.name,
           tagline = EXCLUDED.tagline,
           description = EXCLUDED.description,
           specs = EXCLUDED.specs,
           features = EXCLUDED.features,
           price = EXCLUDED.price,
           stock_quantity = EXCLUDED.stock_quantity,
           is_featured = EXCLUDED.is_featured,
           sort_order = EXCLUDED.sort_order`,
        [
          categoryIds[p.category],
          p.slug,
          p.model_number,
          p.name,
          p.tagline,
          p.description,
          JSON.stringify(p.specs),
          JSON.stringify(p.features),
          p.price,
          p.stock_quantity,
          p.is_featured,
          p.sort_order,
        ]
      );
    }

    await client.query("COMMIT");
    console.log(`Seeded ${categories.length} categories and ${allProducts.length} products.`);
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
