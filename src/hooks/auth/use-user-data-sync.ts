import { getUserData, syncUserData as syncUserDataApi } from "@/api/backend/auth/sync";
import { useBookmarksStore } from "@/stores/bookmarks";
import { useCallback } from "react";

export const useUserDataSync = () => {
  const bookmarks = useBookmarksStore((state) => state.bookmarks);
  const setBookmarks = useBookmarksStore((state) => state.setBookmarks);

  const syncUserData = useCallback(async () => {
    try {
      const userData = await getUserData().catch(() => ({ bookmarks: [] }));
      setBookmarks([...new Set([...bookmarks, ...userData.bookmarks])]);
      await syncUserDataApi({
        bookmarks: bookmarks,
      });
    } catch {
      // Do nothing, let login continue
    }
  }, [bookmarks, setBookmarks]);

  return { syncUserData } as const;
};
