import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthStoreState {
  accessToken: string;
  refreshToken: string;
  isLoggedIn: boolean;

  displayName: string;

  setTokens: (accessToken: string, refreshToken: string) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthStoreState>()(
  persist(
    (set) => ({
      accessToken: "",
      refreshToken: "",
      isLoggedIn: false,

      displayName: "",

      setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken, isLoggedIn: true }),
      reset: () => set({ accessToken: "", refreshToken: "", isLoggedIn: false }),
    }),
    {
      name: "BR::auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ accessToken: state.accessToken, refreshToken: state.refreshToken }),
    },
  ),
);
