import { getPfpInBase64 } from "@/lib/file";
import { authClient } from "../base";

export type UserData = {
  username: string;
  pfp: string;
  bookmarks: string[];
  preferences: Record<string, unknown>;
  reading_lists: Record<string, unknown>;
};

export const syncUserData = async (
  data: Partial<
    | UserData
    | {
        pfp: File | string;
      }
  >,
) => {
  if (data.pfp && data.pfp instanceof File) {
    const pfpInBase64 = await getPfpInBase64(data.pfp);

    if (!pfpInBase64) {
      throw new Error("Failed to read file");
    }

    data.pfp = pfpInBase64.toString();
  }

  await authClient<{ message: string }>("/_secure/sync", {
    method: "POST",
    body: data,
  });
};

export const getUserData = async () => {
  return authClient<UserData>("/_secure/get", {
    method: "GET",
  });
};
