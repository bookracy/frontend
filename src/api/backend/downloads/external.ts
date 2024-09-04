import { useMutation, useQuery } from "@tanstack/react-query";
import { client } from "../base";
import { ExternalDownloadResponse } from "./types";
import { ofetch } from "ofetch";

export const getExternalDownloads = (md5s: string[]) => {
  if (md5s.length === 0) return Promise.resolve([]);
  return client<ExternalDownloadResponse>("/books/external_downloads", {
    query: {
      md5: md5s.join(","),
    },
  });
};

export const useExternalDownloadsQuery = (md5s: string[]) => {
  return useQuery({
    queryKey: ["external_downloads", md5s],
    queryFn: () => getExternalDownloads(md5s),
  });
};

export const useDownloadMutation = () => {
  return useMutation({
    mutationKey: ["download"],
    mutationFn: async (link: string) => {
      if (link.includes("ipfs")) {
        return link;
      }

      const response = await ofetch(link, {
        responseType: "blob",
      });

      return URL.createObjectURL(response);
    },
  });
};
