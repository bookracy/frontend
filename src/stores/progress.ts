import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ProgressItem {
  md5: string;
  currentPage: number;
  totalPages: number;
  location: string;
}

interface ReadingProgressStoreState {
  readingProgress: ProgressItem[];
  findReadingProgress: (md5: string) => ProgressItem | undefined;
  setReadingProgress: (progressItem: ProgressItem) => void;
  removeReadingProgress: (md5: string) => void;
}

export const useReadingProgressStore = create<ReadingProgressStoreState>()(
  persist(
    (set, get) => ({
      readingProgress: [],
      findReadingProgress: (md5) => get().readingProgress.find((p) => p.md5 === md5),
      setReadingProgress: (progressItem) =>
        set((state) => {
          const index = state.readingProgress.findIndex((p) => p.md5 === progressItem.md5);
          if (index === -1) {
            return { readingProgress: [...state.readingProgress, progressItem] };
          }
          const newReadingProgress = [...state.readingProgress];
          newReadingProgress[index] = progressItem;
          return { readingProgress: newReadingProgress };
        }),
      removeReadingProgress: (md5) => set((state) => ({ readingProgress: state.readingProgress.filter((p) => p.md5 !== md5) })),
    }),
    {
      name: "BR::progress",
      getStorage: () => localStorage,
    },
  ),
);
