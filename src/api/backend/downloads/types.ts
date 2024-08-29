export interface ExternalDownloadLink {
  link: string;
  name: string;
}

export interface ExternalDownloadResponse {
  external_downloads: ExternalDownloadLink[];
  ipfs: string[];
}
