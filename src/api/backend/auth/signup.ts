import { client } from "../base";
import { GenerateUserResponse, VerifyAuthKeyResponse } from "./types";

export const verifyAuthKey = (ttkn: string) => {
  return client<VerifyAuthKeyResponse>("/_secure/signup/verify", {
    method: "POST",
    body: {
      ttkn,
    },
  });
};

export const generateUser = async ({ username, ttkn }: { username: string; ttkn: string }) => {
  const verifyAuthKeyResponse = await verifyAuthKey(ttkn);
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
