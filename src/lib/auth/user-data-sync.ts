// This file should only be imported once in the root of the application
import { syncUserData } from "@/api/backend/auth/sync";
import { useBookmarksStore } from "@/stores/bookmarks";

useBookmarksStore.subscribe(
  (state) => state.bookmarks,
  async (bookmarks) => {
    console.log("Syncing user data", bookmarks);
    await syncUserData({
      bookmarks,
    });
  },
);
