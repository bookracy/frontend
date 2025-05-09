import SparkMD5 from "spark-md5";

// Leaving this here because whatever
export const FILE_TYPES = ["epub", "pdf", "txt", "mobi", "azw3", "fb2", "djvu", "doc", "docx", "rtf", "cbz", "cbr", "html", "htm", "odt"];

// Compute file MD5 hash
export async function computeFileMd5(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunkSize = 2 * 1024 * 1024; // 2MB per chunk
    const chunks = Math.ceil(file.size / chunkSize);
    let currentChunk = 0;
    const spark = new SparkMD5.ArrayBuffer();
    const fileReader = new FileReader();

    fileReader.onload = (e) => {
      if (!e.target?.result) return reject(new Error("Failed to read file"));
      spark.append(e.target.result as ArrayBuffer);
      currentChunk++;
      if (currentChunk < chunks) {
        loadNext();
      } else {
        resolve(spark.end());
      }
    };
    fileReader.onerror = () => reject(new Error("File read error"));

    function loadNext() {
      const start = currentChunk * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      fileReader.readAsArrayBuffer(file.slice(start, end));
    }
    loadNext();
  });
}
