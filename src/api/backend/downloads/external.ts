import { useMutation, useQuery } from "@tanstack/react-query";
import { client } from "../base";
import { ExternalDownloadResponse } from "./types";

export const getExternalDownloads = (md5: string) => {
  return client<ExternalDownloadResponse>("/books/external_downloads", {
    query: {
      md5,
    },
  });
};

export const useExternalDownloadsQuery = (md5: string) => {
  return useQuery({
    queryKey: ["external_downloads", md5],
    queryFn: () => getExternalDownloads(md5),
  });
};

export const useDownloadMutation = () => {
  return useMutation({
    mutationKey: ["download"],
    mutationFn: async (link: string) => {
      const response = await fetch(link);

      if (!response.ok) {
        throw new Error("Failed to download file");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      return url;
    },
  });
};
