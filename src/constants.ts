import { FileRouteTypes } from "./routeTree.gen";

export const GITHUB_URL = "https://github.com/bookracy";
export const DISCORD_URL = "https://discord.gg/bookracy";
export const X_URL = "https://x.com/bookracy";

export const PAGE_TITLES: Partial<Record<FileRouteTypes["fullPaths"], string>> = {
  "/": "Home",
  "/about": "About",
  "/account": "Account",
  "/lists": "Lists",
  "/contact": "Contact",
  "/featured": "Featured",
  "/library": "Library",
  "/settings": "Settings",
  "/upload": "Upload",
  "/login": "Login",
  "/register": "Register",
};

export const LANGUAGES = [
  { label: "English", value: "en" },
  { label: "Russian", value: "ru" },
  { label: "German", value: "de" },
  { label: "Spanish", value: "es" },
  { label: "Italian", value: "it" },
  { label: "Chinese", value: "zh" },
  { label: "French", value: "fr" },
];
