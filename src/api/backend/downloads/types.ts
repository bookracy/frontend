export interface ExternalDownloadLink {
  link: string;
  name: string;
}

export type ExternalDownloadResponse = {
  links: {
    external_downloads: ExternalDownloadLink[];
    ipfs: string[];
  }[];
  md5: string;
}[];
