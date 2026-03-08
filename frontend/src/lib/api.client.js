const DEFAULT_API_URL = "http://localhost:3001";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL;

const ensureLeadingSlash = (path) => (path.startsWith("/") ? path : `/${path}`);

export const buildApiUrl = (path) => `${API_URL}${ensureLeadingSlash(path)}`;

export const apiFetch = (path, options) => fetch(buildApiUrl(path), options);
