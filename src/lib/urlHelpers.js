// Helpers for working with URLs returned by the API
// Many API fields may contain relative paths (e.g. "/storage/photos/..")
// This helper will convert them to absolute URLs using a configurable base.

const DEFAULT_BASE = "http://127.0.0.1:8000/storage";

export function ensureAbsoluteUrl(path, base = DEFAULT_BASE) {
  if (!path) return null;
  if (typeof path !== "string") return path;

  // already absolute (http://, https://, //cdn...)
  if (/^(https?:)?\/\//i.test(path)) return path;

  // join base and path safely
  const trimmedBase = base.replace(/\/$/, "");
  const trimmedPath = path.replace(/^\//, "");
  return `${trimmedBase}/${trimmedPath}`;
}

export default ensureAbsoluteUrl;
