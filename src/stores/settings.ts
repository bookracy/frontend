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

const isOldState = (oldState: unknown): oldState is SettingsStoreState => {
  if (typeof oldState !== "object" || oldState === null) {
    return false;
  }

  return "language" in oldState && "backendURL" in oldState && "theme" in oldState;
};

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
      version: 1,
      migrate(persistedState, version) {
        if (version === 0 && isOldState(persistedState)) {
          return { ...persistedState, backendURL: "https://backend.bookracy.ru" };
        }
      },
    },
  ),
);
