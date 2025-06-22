export const AVAILABLE_FILE_TYPES = ["pdf", "epub", "mobi", "docx", "doc"] as const;

export const getPfpInBase64 = async (pfp: File): Promise<string | ArrayBuffer | null> => {
  return new Promise((resolve) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(pfp);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = () => {
      resolve(null);
    };
  });
};

export const getFileType = (filename: string): (typeof AVAILABLE_FILE_TYPES)[number] => {
  const ext = filename.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "pdf":
      return "pdf";
    case "epub":
      return "epub";
    case "mobi":
      return "mobi";
    case "docx":
      return "docx";
    case "doc":
      return "doc";
    default:
      return "pdf";
  }
};
