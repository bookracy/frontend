export interface SearchResultItem {
  authors: string;
  book_content: string;
  book_filetype: string;
  book_image: string;
  book_lang: string;
  book_size: string;
  book_source: string;
  custom_subtitle: string;
  link: string;
  md5: string;
  publication: string[];
  title: string;
}

export interface SearchParams {
  query: string;
  lang: string;
  limit: number;
}
