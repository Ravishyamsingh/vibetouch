// Temporary folder-based product images. Database/admin images take priority
// whenever they exist, so this can be expanded while the catalogue is being
// prepared without changing product components again.
const localProductImagePaths = {
  "vibetouch-24vbt-smart-tv": "/uploads/product-images/smart-tv/24vbt/24vbt-hero.png",
};

export function getLocalProductImages(product) {
  const path = product?.slug ? localProductImagePaths[product.slug] : null;
  if (!path) return [];

  return [
    {
      id: `local-${product.slug}-hero`,
      url: path,
      alt_text: `${product.name || product.model_number || "Product"} hero image`,
      sort_order: 0,
    },
  ];
}

export function getLocalProductImage(product) {
  return getLocalProductImages(product)[0]?.url || null;
}
