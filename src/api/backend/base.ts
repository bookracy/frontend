import { router } from "@/main";
import { useAuthStore } from "@/stores/auth";
import { useSettingsStore } from "@/stores/settings";
import { ofetch } from "ofetch";
import { refresh } from "./auth/signin";

export type BaseResponse<T> = {
  results: T[];
};

const backendURL = useSettingsStore.getState().backendURL;

export const client = ofetch.create({
  baseURL: backendURL + `/api`,
});

export const authClient = ofetch.create({
  baseURL: backendURL + `/api`,
  async onRequest(context) {
    function handleLogout() {
      useAuthStore.getState().reset();
      router.navigate({
        to: "/login",
      });
    }

    const { accessToken, refreshToken, tokenInfo } = useAuthStore.getState();

    let accessTokenToSend = accessToken;

    if (!tokenInfo) {
      handleLogout();
      return;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const expirationTime = tokenInfo.exp;
    const timeLeft = expirationTime - currentTime;

    if (timeLeft <= 10) {
      try {
        const response = await refresh(refreshToken);
        if (response.access_token && response.refresh_token) {
          const valid = useAuthStore.getState().setTokens(response.access_token, response.refresh_token);

          if (!valid) {
            handleLogout();
            return;
          }
        }
        accessTokenToSend = response.access_token;
      } catch {
        handleLogout();
        return;
      }
    }

    context.options.headers = {
      ...context.options.headers,
      Authorization: `Bearer ${accessTokenToSend}`,
    };
  },
  onResponseError(context) {
    if (context.response?.status === 401) {
      useAuthStore.getState().reset();
      router.navigate({
        to: "/login",
      });
    }
  },
});
