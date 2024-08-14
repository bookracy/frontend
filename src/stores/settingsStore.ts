import { createStore } from "zustand/vanilla";
import { useStore } from "zustand";

interface SettingsState {
  booksPerSearch: number;
  setBooksPerSearch: (books: number) => void;
  theme: string;
  setTheme: (theme: string) => void;
}

// Create the vanilla store with theme settings added
const settingsStore = createStore<SettingsState>((set) => ({
  booksPerSearch: 11,
  setBooksPerSearch: (books) => set({ booksPerSearch: Math.max(1, books) }),
  theme: "light", // Default theme
  setTheme: (theme) => set({ theme }), // Function to set the theme
}));

// Create the hook that you will use in your components
export const useSettingsStore = () => useStore(settingsStore);
