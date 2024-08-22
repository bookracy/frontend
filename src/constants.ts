import { RoutePaths } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const GITHUB_URL = "https://github.com/bookracy";
export const DISCORD_URL = "https://discord.gg/6YKQn8Sg";
export const X_URL = "https://x.com/bookracy";

export const PAGE_TITLES: Partial<Record<RoutePaths<typeof routeTree>, string>> = {
  "/": "Home",
  "/about": "About",
  "/account": "Account",
  "/contact": "Contact",
  "/featured": "Featured",
  "/library": "Library",
  "/settings": "Settings",
  "/upload": "Upload",
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
