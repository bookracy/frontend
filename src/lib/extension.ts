export const getFileExtensionByContentType = (contentType: string): string => {
  switch (contentType) {
    case "application/pdf":
      return ".pdf";
    case "application/epub+zip":
      return ".epub";
    case "application/x-mobipocket-ebook":
      return ".mobi";
    case "application/x-rar-compressed":
      return ".rar";
    case "application/vnd.rar":
      return ".rar";
    case "application/msword":
      return ".doc";
    case "application/vnd.comicbook+zip":
      return ".cbz";
    case "application/vnd.comicbook-rar":
      return ".cbr";
    default:
      return "";
  }
};
