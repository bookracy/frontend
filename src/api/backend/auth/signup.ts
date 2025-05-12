import { getPfpInBase64 } from "@/lib/file";
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

export const generateUser = async ({ username, pfp, ttkn }: { username: string; pfp?: File; ttkn: string }) => {
  const verifyAuthKeyResponse = await verifyAuthKey(ttkn);
  if (!verifyAuthKeyResponse?.stk) {
    throw new Error("Invalid auth key");
  }

  let pfpInBase64: string | ArrayBuffer | null = null;
  if (pfp) {
    pfpInBase64 = await getPfpInBase64(pfp);
    if (!pfpInBase64) {
      throw new Error("Failed to read file");
    }
  }

  return client<GenerateUserResponse>("/_secure/signup/generate", {
    method: "POST",
    body: {
      stk: verifyAuthKeyResponse.stk,
      username,
      ...(pfpInBase64 ? { pfp: pfpInBase64 } : {}),
    },
  });
};
