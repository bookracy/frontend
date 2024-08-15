import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type Theme = "dark" | "light";

interface SettingsStoreState {
  booksPerSearch: number;
  language: string;
  backendURL: string;
  theme: Theme;

  setBooksPerSearch: (books: number) => void;
  setLanguage: (language: string) => void;
  setBackendURL: (url: string) => void;
  setTheme: (theme: Theme) => void;
}

export const useSettingsStore = create<SettingsStoreState>()(
  persist(
    (set) => ({
      booksPerSearch: 11,
      language: "en",
      backendURL: "https://backend.bookracy.org",
      theme: "dark",

      setBooksPerSearch: (books) => set({ booksPerSearch: books }),
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
