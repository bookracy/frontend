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

  setTokens: (accessToken: string, refreshToken: string) => boolean;
  reset: () => void;
}

export const useAuthStore = create<AuthStoreState>()(
  persist(
    (set) => ({
      accessToken: "",
      refreshToken: "",
      tokenInfo: null,

      setTokens: (accessToken, refreshToken) => {
        const payload = decodeJwt(accessToken);
        const parsedPayload = tokenSchema.safeParse(payload);

        if (parsedPayload.success) {
          set({ accessToken, refreshToken, tokenInfo: parsedPayload.data });
        }

        return parsedPayload.success;
      },
      reset: () => set({ accessToken: "", refreshToken: "" }),
    }),
    {
      name: "BR::auth",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
