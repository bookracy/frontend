import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type Theme = "dark" | "light";

interface SettingsStoreState {
  language: string;
  backendURL: string;
  theme: Theme;

  setLanguage: (language: string) => void;
  setBackendURL: (url: string) => void;
  setTheme: (theme: Theme) => void;
}

export const useSettingsStore = create<SettingsStoreState>()(
  persist(
    (set) => ({
      language: "en",
      backendURL: "https://backend.bookracy.ru",
      theme: "dark",

      setLanguage: (language) => set({ language }),
      setBackendURL: (url) => set({ backendURL: url }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "BR::settings",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
