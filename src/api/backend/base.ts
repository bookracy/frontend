import { useAuthStore } from "@/stores/auth";
import { useSettingsStore } from "@/stores/settings";
import { redirect } from "@tanstack/react-router";
import { ofetch } from "ofetch";

export type BaseResponse<T> = {
  results: T[];
};

const backendURL = useSettingsStore.getState().backendURL;

export const client = ofetch.create({
  baseURL: backendURL + `/api`,
});

export const authClient = ofetch.create({
  baseURL: backendURL + `/api`,
  onRequest(context) {
    const token = useAuthStore.getState().accessToken;
    if (!token) {
      useAuthStore.getState().reset();
      throw redirect({ to: "/login" });
    }
    context.options.headers = {
      ...context.options.headers,
      Authorization: `Bearer ${token}`,
    };
  },
  onResponseError(context) {
    if (context.response?.status === 401) {
      useAuthStore.getState().reset();
      throw redirect({ to: "/login" });
    }
  },
});
