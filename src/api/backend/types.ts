import { ExternalDownloadLink } from "./downloads/types";

export interface BookItem {
  authors: string;
  book_content: string;
  book_filetype: string;
  book_image: string;
  book_lang: string;
  book_size: string;
  book_source: string;
  description: string;
  link: string;
  md5: string;
  publication: string[];
  title: string;
}

export interface BookItemWithExternalDownloads extends BookItem {
  externalDownloads?: ExternalDownloadLink[];
}
