import { BookItemResponse } from "@/api/backend/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BookmarksStoreState {
  bookmarks: BookItemResponse[];
  addBookmark: (bookmark: BookItemResponse) => void;
  removeBookmark: (md5: string) => void;
}

export const useBookmarksStore = create<BookmarksStoreState>()(
  persist(
    (set) => ({
      bookmarks: [],
      addBookmark: (bookmark) => set((state) => ({ bookmarks: [...state.bookmarks, bookmark] })),
      removeBookmark: (md5) => set((state) => ({ bookmarks: state.bookmarks.filter((b) => b.md5 !== md5) })),
    }),
    {
      name: "BR::bookmarks",
      getStorage: () => localStorage,
    },
  ),
);
