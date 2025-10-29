// For live

// For development
const apiBase = import.meta.env.VITE_API_BASE || "http://localhost:5271";
export const BASE_URL = `${apiBase.replace(/\/+$/, "")}/api/`;

const signalrBase = import.meta.env.VITE_SIGNALR_URL || `${apiBase.replace(/\/+$/, "")}/bookinghub`;
export const SIGNALR_HUB_URL = signalrBase;