import { z } from "zod";
import { create } from "zustand";
import { createJSONStorage, persist, subscribeWithSelector } from "zustand/middleware";

interface BookmarksStoreState {
  bookmarks: string[];
  setBookmarks: (bookmarks: string[]) => void;
  addBookmark: (md5: string) => void;
  removeBookmark: (md5: string) => void;
}

const versionOneBookmarkSchema = z.object({
  bookmarks: z.array(z.object({ md5: z.string() })),
});

export const useBookmarksStore = create<BookmarksStoreState>()(
  subscribeWithSelector(
    persist(
      (set) => ({
        bookmarks: [],
        setBookmarks: (bookmarks) => set({ bookmarks }),
        addBookmark: (bookmark) => set((state) => ({ bookmarks: [...state.bookmarks, bookmark] })),
        removeBookmark: (md5) => set((state) => ({ bookmarks: state.bookmarks.filter((b) => b !== md5) })),
      }),
      {
        name: "BR::bookmarks",
        storage: createJSONStorage(() => localStorage),
        version: 1,
        migrate(persistedState, version) {
          if (version === 0) {
            const parsed = versionOneBookmarkSchema.safeParse(persistedState);
            if (parsed.success) {
              return { bookmarks: parsed.data.bookmarks.map((b) => b.md5) };
            }
          }
        },
      },
    ),
  ),
);
