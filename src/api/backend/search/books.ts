import { queryOptions } from "@tanstack/react-query";
import { BaseResponse, client } from "../base";
import { BookItem } from "../types";

export const searchBooksByMd5 = async (md5s: string[]) => {
  return client<BaseResponse<BookItem>>("/_secure/translate", {
    query: {
      md5: md5s.join(","),
    },
  });
};

export const searchBooksByMd5QueryOptions = (md5s: string[]) =>
  queryOptions({
    queryKey: ["search"],
    queryFn: () => searchBooksByMd5(md5s),
    enabled: md5s.length > 0,
  });
