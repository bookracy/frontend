import create from "zustand";

// Define the interface for the settings state
interface SettingsState {
  booksPerSearch: number;
  setBooksPerSearch: (books: number) => void;
  language: string;
  setLanguage: (language: string) => void;
  backendURL: string;
  setBackendURL: (url: string) => void;
  theme: string;
  setTheme: (theme: string) => void;
}

// Create the Zustand store
export const useSettingsStore = create<SettingsState>((set) => ({
  // Default values for each state
  booksPerSearch: 11,
  language: "en", // Default language is English
  backendURL: "https://backend.bookracy.org", // Default backend URL
  theme: "dark", // Default theme is dark

  // Function to update the number of books per search
  setBooksPerSearch: (books) => set({ booksPerSearch: books }),

  // Function to update the language
  setLanguage: (language) => set({ language }),

  // Function to update the backend URL
  setBackendURL: (url) => set({ backendURL: url }),

  // Function to update the theme
  setTheme: (theme) => set({ theme }),
}));
