import { syncUserData } from "@/api/backend/auth/sync";
import { useAuthStore } from "@/stores/auth";
import { useBookmarksStore } from "@/stores/bookmarks";

useBookmarksStore.subscribe(
  (state) => state.bookmarks,
  async (bookmarks) => {
    try {
      const accessToken = useAuthStore.getState().accessToken;
      if (!accessToken) return bookmarks;

      console.log("Syncing user data", bookmarks);
      await syncUserData({
        bookmarks,
      });
    } catch (error) {
      console.error("Failed to sync user data", error);
    }
    return bookmarks;
  },
);
