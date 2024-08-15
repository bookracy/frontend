import { createStore, useStore } from "zustand";

interface SettingsState {
  booksPerSearch: number;
  setBooksPerSearch: (books: number) => void;
  theme: string;
  setTheme: (theme: string) => void;
}

const settingsStore = createStore<SettingsState>((set) => ({
  booksPerSearch: parseInt(localStorage.getItem("booksPerSearch") || "10", 10),
  setBooksPerSearch: (books) => {
    localStorage.setItem("booksPerSearch", books.toString());
    set({ booksPerSearch: Math.max(1, books) });
  },
  theme: "light",
  setTheme: (theme) => set({ theme }),
}));

export const useSettingsStore = () => useStore(settingsStore);