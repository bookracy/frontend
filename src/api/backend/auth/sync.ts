import { authClient } from "../base";

export const syncUserData = async ({
  username,
  bookmarks,
  preferences,
  readingLists,
}: {
  username?: string;
  bookmarks?: string[];
  preferences?: Record<string, unknown>;
  readingLists?: Record<string, unknown>;
}) => {
  await authClient<{ message: string }>("/_secure/sync", {
    method: "POST",
    body: {
      username,
      bookmarks,
      preferences,
      reading_lists: readingLists,
    },
  });
};

export const getUserData = async () => {
  return authClient<{ bookmarks: string[]; preferences: Record<string, unknown>; reading_lists: Record<string, unknown> }>("/_secure/get", {
    method: "GET",
  });
};
