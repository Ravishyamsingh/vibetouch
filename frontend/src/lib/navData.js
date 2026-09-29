// Mirrors the real mega-menu structure from vibetouch.in's header nav.
// Sizes/model numbers are real; destinations that don't have a built page
// yet in this first pass fall back to /contact or /about (see README).

export const navData = [
  {
    label: "Home",
    to: "/",
    columns: [
      { heading: "About Us", items: [{ label: "About Company", to: "/about" }, { label: "Our Vision", to: "/about" }, { label: "Our Mission", to: "/about" }] },
      { heading: "News & Media", items: [{ label: "E-Waste", to: "/about" }] },
    ],
  },
  {
    label: "Smart TV",
    to: "/products/smart-tv",
    columns: [
      { items: [24, 32, 43].map((s) => ({ label: `${s}VBT ${s} inch`, to: `/product/vibetouch-${s}vbt-smart-tv`, newTab: true })) },
      { items: [50, 55, 65].map((s) => ({ label: `${s}VBT ${s} inch`, to: `/product/vibetouch-${s}vbt-smart-tv`, newTab: true })) },
      { items: [75, 85, 86].map((s) => ({ label: `${s}VBT ${s} inch`, to: `/product/vibetouch-${s}vbt-smart-tv`, newTab: true })) },
      { items: [98].map((s) => ({ label: `${s}VBT ${s} inch`, to: `/product/vibetouch-${s}vbt-smart-tv`, newTab: true })) },
    ],
  },
  {
    label: "Interactive Panel",
    to: "/products/interactive-panel",
    columns: [
      { heading: "Interactive Models", items: [55, 65, 75].map((s) => ({ label: `IPC${s}VBT ${s} inch`, to: `/product/vibetouch-ipc${s}vbt-interactive-panel`, newTab: true })) },
      { items: [86, 98, 100].map((s) => ({ label: `IPC${s}VBT ${s} inch`, to: `/product/vibetouch-ipc${s}vbt-interactive-panel`, newTab: true })) },
      { items: [105, 110].map((s) => ({ label: `IPC${s}VBT ${s} inch`, to: `/product/vibetouch-ipc${s}vbt-interactive-panel`, newTab: true })) },
    ],
  },
  {
    label: "PLFD",
    to: "/products/plfd",
    columns: [
      { heading: "LFD Models", items: [32, 43, 50, 55].map((s) => ({ label: `LFD${s}VBT ${s} inch`, to: `/product/vibetouch-lfd${s}vbt-plfd` })) },
      { items: [65, 75, 85, 86].map((s) => ({ label: `LFD${s}VBT ${s} inch`, to: `/product/vibetouch-lfd${s}vbt-plfd` })) },
      { items: [98, 100].map((s) => ({ label: `LFD${s}VBT ${s} inch`, to: `/product/vibetouch-lfd${s}vbt-plfd` })) },
    ],
  },
  {
    label: "Help & Solution",
    to: "/contact",
    columns: [
      { heading: "Support & Solution", items: [{ label: "Sales Enquiry", to: "/contact" }, { label: "Vendor Registration", to: "/contact" }, { label: "Service Partner", to: "/contact" }] },
      { items: [{ label: "Create Ticket", to: "/contact" }, { label: "Contact Us", to: "/contact" }, { label: "Career", to: "/contact" }] },
      { heading: "Service Center", items: [{ label: "Service Center", to: "/contact" }] },
    ],
  },
];

export const categoryTags = [
  { label: "Smart TV", to: "/products/smart-tv" },
  { label: "Interactive Panel", to: "/products/interactive-panel" },
  { label: "LFD", to: "/products/plfd" },
  { label: "Active LED", to: null },
  { label: "Desktop Computer", to: "/products/desktop-computer" },
  { label: "All In One PC", to: "/products/all-in-one-pc" },
  { label: "Workstation", to: "/products/workstation" },
  { label: "Laptop", to: "/products/laptop" },
  { label: "Mini PC", to: null },
  { label: "Server", to: null },
  { label: "Computer Accessories", to: "/products/computer-accessories" },
];
