const SITE_ORIGIN = "https://dashboard.shajerghor.com";
const FALLBACK_AVATAR =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><rect width="80" height="80" fill="#e2e8f0"/><circle cx="40" cy="31" r="14" fill="#94a3b8"/><path d="M12 72c3-16 15-24 28-24s25 8 28 24z" fill="#94a3b8"/></svg>'
  );

// Backend returns image paths relative to the site root (or null); make them usable in <img src>
export const resolveImageUrl = (path) => {
  if (!path) return FALLBACK_AVATAR;
  if (/^(https?:|data:|blob:)/i.test(path)) return path;
  return `${SITE_ORIGIN}/${String(path).replace(/^\/+/, "")}`;
};
