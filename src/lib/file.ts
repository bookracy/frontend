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
