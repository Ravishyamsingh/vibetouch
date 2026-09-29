const tvSizes = [24, 32, 43, 50, 55, 65, 75, 85, 86, 98];
const panelSizes = [55, 65, 75, 86, 98, 100, 105, 110];

function makeRelated(category, currentSize) {
  const sizes = category === "interactive-panel" ? panelSizes : tvSizes;
  const prefix = category === "interactive-panel" ? "ipc" : "";
  const suffix = category === "interactive-panel" ? "interactive-panel" : "smart-tv";

  return sizes
    .filter((size) => size !== currentSize)
    .slice(0, 4)
    .map((size) => ({
      slug: `vibetouch-${prefix}${size}vbt-${suffix}`,
      name: category === "interactive-panel"
        ? `Vibetouch ${size} inch 4K Interactive Panel`
        : `Vibetouch ${size} inch UHD Smart TV`,
      model_number: `${prefix.toUpperCase()}${size}VBT`,
      tagline: category === "interactive-panel" ? "Interactive 4K panel for collaboration" : "Make in India Smart TV",
      price: category === "interactive-panel" ? 99999 + size * 2000 : 9999 + size * 850,
      category_slug: category,
    }));
}

function buildTv(slug, size) {
  const displayType = size <= 32 ? "HD LED" : size >= 75 ? "QLED" : "4K UHD";
  return {
    slug,
    model_number: `${size}VBT`,
    name: `Vibetouch ${size} inch ${displayType} Smart TV`,
    brand: "Vibetouch",
    category_slug: "smart-tv",
    category_name: "Smart TV",
    tagline: "Make in India Smart TV",
    description: `A ${size}-inch ${displayType} smart television designed for vivid everyday viewing, effortless streaming and a clean, modern living room setup.`,
    price: 9999 + size * 850,
    stock_quantity: 24,
    is_featured: size === 50 || size === 65,
    specs: {
      Brand: "Vibetouch",
      Model: `${size}VBT`,
      "Screen size": `${size} inches / ~${Math.round(size * 2.54)} cm`,
      Series: size >= 75 ? "Cinematic Series" : "Smart Vision Series",
      "Display type": displayType,
      Resolution: size <= 32 ? "HD Ready" : "4K UHD",
      Design: "Slim bezel / bezel-less style",
      Colour: "Black",
      "Smart TV": "Yes",
      "Operating system": "Android TV / Google TV ready",
      Connectivity: "Wi-Fi, HDMI, USB, Bluetooth",
      Warranty: "1 year standard warranty",
      "Model year/listing": "Current listing — placeholder data",
    },
    features: ["Vivid colour display", "Built-in streaming apps", "Screen mirroring", "Wide viewing angle", "Surround sound speakers", "Pan-India support"],
    images: [],
    related: makeRelated("smart-tv", size),
  };
}

function buildPanel(slug, size) {
  return {
    slug,
    model_number: `IPC${size}VBT`,
    name: `Vibetouch ${size} inch 4K Interactive Panel`,
    brand: "Vibetouch",
    category_slug: "interactive-panel",
    category_name: "Interactive Panel",
    tagline: "4K UHD interactive flat panel for smart classrooms and meeting rooms",
    description: `A ${size}-inch interactive panel for teaching, presenting and collaboration. This temporary listing contains representative data that can be replaced with your final product specifications.`,
    price: 99999 + size * 2000,
    stock_quantity: 12,
    is_featured: size === 86,
    specs: {
      Brand: "Vibetouch",
      Model: `IPC${size}VBT`,
      "Screen size": `${size} inches / ~${Math.round(size * 2.54)} cm`,
      Series: "Collaboration Pro Series",
      "Display type": "Interactive 4K UHD",
      Resolution: "3840 × 2160 UHD",
      "Touch technology": "Multi-touch with fast response",
      Glass: "Anti-glare tempered glass",
      Connectivity: "HDMI, USB, Wi-Fi, Bluetooth, LAN",
      Speakers: "2 × 20W integrated speakers",
      "Operating system": "Android / Windows OPS ready",
      Warranty: "1 year standard warranty",
      "Model year/listing": "Current listing — placeholder data",
    },
    features: ["4K anti-glare display", "Multi-touch collaboration", "Wireless screen sharing", "Integrated speakers", "Ultra-thin metal bezel", "Classroom and meeting-room ready"],
    images: [],
    related: makeRelated("interactive-panel", size),
  };
}

export function fallbackProductForSlug(slug) {
  const tvMatch = slug.match(/vibetouch-(\d{2,3})vbt-smart-tv/i);
  if (tvMatch) return buildTv(slug, Number(tvMatch[1]));

  const panelMatch = slug.match(/vibetouch-ipc(\d{2,3})vbt-interactive-panel/i);
  if (panelMatch) return buildPanel(slug, Number(panelMatch[1]));

  return null;
}
