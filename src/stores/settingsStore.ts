import create from "zustand";

interface SettingsState {
  booksPerSearch: number;
  setBooksPerSearch: (books: number) => void;
}

const useSettingsStore = create<SettingsState>((set) => ({
  booksPerSearch: 11,
  setBooksPerSearch: (books) => set({ booksPerSearch: books }),
}));

export default useSettingsStore;