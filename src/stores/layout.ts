import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface LayoutStoreState {
  sidebar: {
    isOpen: boolean;
    setIsOpen: () => void;
  };
  page: {
    title: string;
    setTitle: (title: string) => void;
  };
}

export const useLayoutStore = create<LayoutStoreState>()(
  persist(
    (set) => ({
      sidebar: {
        isOpen: true,
        setIsOpen: () => {
          set((state) => ({ sidebar: { ...state.sidebar, isOpen: !state.sidebar.isOpen } }));
        },
      },
      page: {
        title: "",
        setTitle: (title) => {
          set((state) => ({ page: { ...state.page, title } }));
        },
      },
    }),
    {
      name: "layout",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ isOpen: state.sidebar.isOpen }),
    },
  ),
);
