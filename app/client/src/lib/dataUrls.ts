/*
 * Centralized data URLs for all JSON data files.
 * These point to the local /data/ directory served alongside the app.
 */
export const DATA_URLS = {
  properties: "/data/properties.json",
  ubos: "/data/ubos.json",
  attributes: "/data/attributes.json",
  stats: "/data/stats.json",
  features: "/data/features.json",
  categories: "/data/categories.json",
} as const;
