import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthStoreState {
  accessToken: string;
  refreshToken: string;

  setTokens: (accessToken: string, refreshToken: string) => void;
}

export const useAuthStore = create<AuthStoreState>()(
  persist(
    (set) => ({
      accessToken: "",
      refreshToken: "",

      setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
    }),
    {
      name: "BR::auth",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
