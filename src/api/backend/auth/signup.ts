import { getCookieValue } from "@/lib/cookie";
import { client } from "../base";
import { GenerateUserResponse, VerifyAuthKeyResponse } from "./types";

export const verifyAuthKey = () => {
  return client<VerifyAuthKeyResponse>("/_secure/signup/verify", {
    method: "POST",
    body: {
      ttkn: getCookieValue("authKey"),
      uid: getCookieValue("userId"),
    },
  });
};

export const generateUser = async ({ username }: { username: string }) => {
  const verifyAuthKeyResponse = await verifyAuthKey();
  if (!verifyAuthKeyResponse?.stk) {
    throw new Error("Invalid auth key");
  }

  return client<GenerateUserResponse>("/_secure/signup/generate", {
    method: "POST",
    body: {
      stk: verifyAuthKeyResponse.stk,
      username,
    },
  });
};
