import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthStoreState {
  accessToken: string;
  refreshToken: string;
  displayName: string;

  setTokens: (accessToken: string, refreshToken: string) => void;
  setDisplayName: (displayName: string) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthStoreState>()(
  persist(
    (set) => ({
      accessToken: "",
      refreshToken: "",
      displayName: "",

      setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
      setDisplayName: (displayName) => set({ displayName }),
      reset: () => set({ accessToken: "", refreshToken: "", displayName: "" }),
    }),
    {
      name: "BR::auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ accessToken: state.accessToken, refreshToken: state.refreshToken }),
    },
  ),
);
