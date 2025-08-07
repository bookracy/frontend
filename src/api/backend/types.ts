import { ExternalDownloadLink } from "./downloads/types";

export interface BookItem {
  author: string;
  book_filetype: string;
  book_image: string;
  book_lang: string;
  book_length: string;
  book_size: string;
  cid: string;
  description: string;
  external_cover_url: string;
  id: number;
  isbn: string;
  link: string;
  md5: string;
  other_titles: string;
  publisher: string;
  series: string;
  title: string;
  year: string;
}

export interface BookItemWithExternalDownloads extends BookItem {
  externalDownloads?: ExternalDownloadLink[];
  externalDownloadsFetched?: boolean;
}
