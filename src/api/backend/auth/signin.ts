import { getCookieValue } from "@/lib/cookie";
import { client } from "../base";
import { LoginResponse } from "./types";

export const login = ({ code }: { code: string }) => {
  return client<LoginResponse>("/_secure/signin/identifier", {
    method: "POST",
    body: { code, uid: getCookieValue("userId"), ttkn: getCookieValue("authKey") },
  });
};
