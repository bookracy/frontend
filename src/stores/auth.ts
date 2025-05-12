import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { decodeJwt } from "jose";
import { z } from "zod";

const tokenSchema = z.object({
  exp: z.number(),
});

interface AuthStoreState {
  accessToken: string;
  refreshToken: string;

  tokenInfo: z.infer<typeof tokenSchema> | null;

  displayName: string;

  setTokens: (accessToken: string, refreshToken: string) => boolean;
  setDisplayName: (displayName: string) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthStoreState>()(
  persist(
    (set) => ({
      accessToken: "",
      refreshToken: "",
      displayName: "Bookracy User",
      tokenInfo: null,

      setTokens: (accessToken, refreshToken) => {
        const payload = decodeJwt(accessToken);
        const parsedPayload = tokenSchema.safeParse(payload);

        if (parsedPayload.success) {
          set({ accessToken, refreshToken, tokenInfo: parsedPayload.data });
        }

        return parsedPayload.success;
      },
      setDisplayName: (displayName) => set({ displayName }),
      reset: () => set({ accessToken: "", refreshToken: "", displayName: "Bookracy User" }),
    }),
    {
      name: "BR::auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ accessToken: state.accessToken, refreshToken: state.refreshToken, displayName: state.displayName }),
    },
  ),
);
