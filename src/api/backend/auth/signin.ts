import { client } from "../base";
import { LoginResponse } from "./types";

export const login = (body: { code: string; ttkn: string }) => {
  return client<LoginResponse>("/_secure/signin/identifier", {
    method: "POST",
    body,
  });
};

export const refresh = (refreshToken: string) => {
  return client<LoginResponse>("/_secure/signin/refresh", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
  });
};
