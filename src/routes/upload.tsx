import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useState, useRef, useEffect } from "react";
import { ofetch } from "ofetch";
import { BookItem } from "@/api/backend/types";
import SparkMD5 from "spark-md5";

const FILE_TYPES = ["epub", "pdf", "txt", "mobi", "azw3", "fb2", "djvu", "doc", "docx", "rtf", "cbz", "cbr", "html", "htm", "odt"];

export const Route = createFileRoute("/upload")({
  component: Upload,
  beforeLoad: () => {
    if (import.meta.env.PROD) throw redirect({ to: "/", search: { q: "" } });
  },
});

// Helper: Try to extract metadata from file name (basic, for demo)
function extractMetadataFromFilename(filename: string) {
  // Example: "Author - Title (2023).epub" or "Title - Author.pdf"
  const match = filename.match(/(.+?)\s*-\s*(.+?)(?:\s*\((\d{4})\))?\.[^.]+$/);
  if (match) {
    const author = match[1];
    const title = match[2];
    const year = match[3] || "";
    return { title: title.trim(), author: author.trim(), year };
  }
  // Try: "Title.pdf"
  const simple = filename.match(/(.+)\.[^.]+$/);
  if (simple) return { title: simple[1].trim(), author: "", year: "" };
  return { title: "", author: "", year: "" };
}

async function computeFileMd5(file: File): Promise<string> {
  // Use spark-md5 for browser MD5 calculation
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

async function autofillBookFields(md5: string): Promise<Partial<BookItem> | null> {
  try {
    const res = await ofetch<{ results: BookItem[] }>("https://backend.bookracy.ru/api/books", {
      query: { query: md5, limit: 1 },
    });
    if (res.results && res.results.length > 0) return res.results[0];
    return null;
  } catch {
    return null;
  }
}

type BulkBookForm = {
  file: File;
  cover?: File;
  coverPreview?: string | null;
  title: string;
  author: string;
  book_filetype: string;
  description: string;
  publisher: string;
  year: string;
  book_lang: string;
  isbn: string;
  file_source: string;
  cid: string;
};

function Upload() {
  const [form, setForm] = useState({
    file: undefined as File | undefined,
    cover: undefined as File | undefined,
    title: "",
    author: "",
    book_filetype: "",
    description: "",
    publisher: "",
    year: "",
    book_lang: "",
    isbn: "",
    file_source: "",
    cid: "",
  });
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ success?: boolean; error?: string; md5?: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target;
    const { name, value } = target;
    if (target instanceof HTMLInputElement && target.type === "file" && target.files) {
      setForm((f) => ({ ...f, [name]: target.files![0] }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSelect = (value: string) => {
    setForm((f) => ({ ...f, book_filetype: value }));
  };

  // --- Preview logic ---
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  // Update cover preview
  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setForm((f) => ({ ...f, cover: file }));
      setCoverPreview(URL.createObjectURL(file));
    } else {
      setForm((f) => ({ ...f, cover: undefined }));
      setCoverPreview(null);
    }
  };

  // Update book file preview (show name, size, type)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setForm((f) => ({ ...f, file }));
      setFilePreview(`${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB, ${file.type || file.name.split(".").pop()?.toUpperCase()})`);
    } else {
      setForm((f) => ({ ...f, file: undefined }));
      setFilePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);
    setUploading(true);
    setProgress(0);
    try {
      const data = new FormData();
      if (!form.file || !form.title || !form.author || !form.book_filetype) {
        setResult({ error: "Please fill all required fields." });
        setUploading(false);
        return;
      }
      data.append("file", form.file);
      if (form.cover) data.append("cover", form.cover);
      data.append("title", form.title);
      data.append("author", form.author);
      data.append("book_filetype", form.book_filetype);
      if (form.description) data.append("description", form.description);
      if (form.publisher) data.append("publisher", form.publisher);
      if (form.year) data.append("year", form.year);
      if (form.book_lang) data.append("book_lang", form.book_lang);
      if (form.isbn) data.append("isbn", form.isbn);
      if (form.file_source) data.append("file_source", form.file_source);
      if (form.cid) data.append("cid", form.cid);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", "https://backend.bookracy.ru/upload");
      xhr.upload.onprogress = (evt) => {
        if (evt.lengthComputable) setProgress(Math.round((evt.loaded / evt.total) * 100));
      };
      xhr.onload = () => {
        setUploading(false);
        try {
          const res = JSON.parse(xhr.responseText);
          if (xhr.status === 200 && res.success) {
            setResult({ success: true, md5: res.md5 });
            setForm({
              file: undefined,
              cover: undefined,
              title: "",
              author: "",
              book_filetype: "",
              description: "",
              publisher: "",
              year: "",
              book_lang: "",
              isbn: "",
              file_source: "",
              cid: "",
            });
            if (fileInputRef.current) fileInputRef.current.value = "";
            if (coverInputRef.current) coverInputRef.current.value = "";
            setCoverPreview(null);
            setFilePreview(null);
          } else {
            setResult({ error: res.error || "Upload failed." });
          }
        } catch {
          setResult({ error: "Unexpected server response." });
        }
      };
      xhr.onerror = () => {
        setUploading(false);
        setResult({ error: "Network error." });
      };
      xhr.send(data);
    } catch {
      setUploading(false);
      setResult({ error: "Unexpected error." });
    }
  };

  const [bulk, setBulk] = useState(false);
  const [bulkFiles, setBulkFiles] = useState<File[]>([]);
  const [bulkForm, setBulkForm] = useState<BulkBookForm[]>([]);

  // Handle drag-and-drop or click upload area
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files).filter((f) => FILE_TYPES.includes(f.name.split(".").pop()?.toLowerCase() || ""));
    if (bulk) {
      setBulkFiles((prev) => [...prev, ...files]);
    } else if (files[0]) {
      // @ts-expect-error ts being stupid
      handleFileChange({ target: { files: [files[0]] } } as React.ChangeEvent<HTMLInputElement>);
    }
  };
  const handleAreaClick = () => {
    if (bulk) {
      fileInputRef.current?.click();
    } else {
      fileInputRef.current?.click();
    }
  };
  const handleBulkFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).filter((f) => FILE_TYPES.includes(f.name.split(".").pop()?.toLowerCase() || ""));
      setBulkFiles((prev) => [...prev, ...files]);
    }
  };
  // Autofill metadata for bulk files
  useEffect(() => {
    if (bulk) {
      setBulkForm(
        bulkFiles.map((file) => {
          const meta = extractMetadataFromFilename(file.name);
          return {
            file,
            cover: undefined,
            coverPreview: null,
            title: meta.title,
            author: meta.author,
            book_filetype: file.name.split(".").pop()?.toLowerCase() || "",
            description: "",
            publisher: "",
            year: meta.year,
            book_lang: "",
            isbn: "",
            file_source: "",
            cid: "",
          };
        }),
      );
    }
  }, [bulkFiles, bulk]);

  // --- Bulk upload submission ---
  const [bulkUploading, setBulkUploading] = useState(false);
  const [bulkProgress, setBulkProgress] = useState<number[]>([]);
  const [bulkResult, setBulkResult] = useState<{ success?: boolean; error?: string; md5?: string }[]>([]);

  const handleBulkFieldChange = (idx: number, field: keyof BulkBookForm, value: string | File | undefined) => {
    setBulkForm((prev) =>
      prev.map((item, i) =>
        i === idx
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    );
  };

  const handleBulkCoverChange = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBulkForm((prev) =>
        prev.map((item, i) =>
          i === idx
            ? {
                ...item,
                cover: file,
                coverPreview: URL.createObjectURL(file),
              }
            : item,
        ),
      );
    }
  };

  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBulkUploading(true);
    setBulkProgress(Array(bulkForm.length).fill(0));
    setBulkResult([]);
    const results: { success?: boolean; error?: string; md5?: string }[] = [];
    for (let i = 0; i < bulkForm.length; i++) {
      const book = bulkForm[i];
      const data = new FormData();
      if (!book.file || !book.title || !book.author || !book.book_filetype) {
        results.push({ error: `Missing required fields for file ${book.file.name}` });
        continue;
      }
      data.append("file", book.file);
      if (book.cover) data.append("cover", book.cover);
      data.append("title", book.title);
      data.append("author", book.author);
      data.append("book_filetype", book.book_filetype);
      if (book.description) data.append("description", book.description);
      if (book.publisher) data.append("publisher", book.publisher);
      if (book.year) data.append("year", book.year);
      if (book.book_lang) data.append("book_lang", book.book_lang);
      if (book.isbn) data.append("isbn", book.isbn);
      if (book.file_source) data.append("file_source", book.file_source);
      if (book.cid) data.append("cid", book.cid);
      // Use XMLHttpRequest for progress
      await new Promise<void>((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "https://backend.bookracy.ru/upload");
        xhr.upload.onprogress = (evt) => {
          if (evt.lengthComputable) {
            setBulkProgress((prev) => prev.map((p, idx2) => (idx2 === i ? Math.round((evt.loaded / evt.total) * 100) : p)));
          }
        };
        xhr.onload = () => {
          try {
            const res = JSON.parse(xhr.responseText);
            if (xhr.status === 200 && res.success) {
              results.push({ success: true, md5: res.md5 });
            } else {
              results.push({ error: res.error || "Upload failed." });
            }
          } catch {
            results.push({ error: "Unexpected server response." });
          }
          resolve();
        };
        xhr.onerror = () => {
          results.push({ error: "Network error." });
          resolve();
        };
        xhr.send(data);
      });
    }
    setBulkResult(results);
    setBulkUploading(false);
    setBulkProgress([]);
    // Optionally clear form on success
    // setBulkFiles([]); setBulkForm([]);
  };

  const [autofillLoading, setAutofillLoading] = useState(false);
  const handleAutofill = async () => {
    if (!form.file) return;
    setAutofillLoading(true);
    const md5 = await computeFileMd5(form.file);
    const data = await autofillBookFields(md5);
    setAutofillLoading(false);
    if (data) {
      setForm((f) => ({
        ...f,
        title: data.title || f.title,
        author: data.author || f.author,
        book_filetype: data.book_filetype || f.book_filetype,
        description: data.description || f.description,
        publisher: data.publisher || f.publisher,
        year: data.year || f.year,
        book_lang: data.book_lang || f.book_lang,
        isbn: data.isbn || f.isbn,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        file_source: (data as any).file_source || f.file_source,
        cid: data.cid || f.cid,
      }));
      if (data.book_image || data.external_cover_url) {
        setCoverPreview(data.book_image || data.external_cover_url || null);
      }
    }
  };

  const [bulkAutofillLoading, setBulkAutofillLoading] = useState<number | null>(null);
  const handleBulkAutofill = async (idx: number) => {
    const book = bulkForm[idx];
    if (!book.file) return;
    setBulkAutofillLoading(idx);
    const md5 = await computeFileMd5(book.file);
    const data = await autofillBookFields(md5);
    setBulkAutofillLoading(null);
    if (data) {
      setBulkForm((prev) =>
        prev.map((item, i) =>
          i === idx
            ? {
                ...item,
                title: data.title || item.title,
                author: data.author || item.author,
                book_filetype: data.book_filetype || item.book_filetype,
                description: data.description || item.description,
                publisher: data.publisher || item.publisher,
                year: data.year || item.year,
                book_lang: data.book_lang || item.book_lang,
                isbn: data.isbn || item.isbn,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                file_source: (data as any).file_source || item.file_source,
                cid: data.cid || item.cid,
                coverPreview: data.book_image || data.external_cover_url || item.coverPreview,
              }
            : item,
        ),
      );
    }
  };

  return (
    <div className="flex min-h-[80vh] w-full items-center justify-center bg-gradient-to-b from-background via-background to-muted/40 py-8 dark:to-[#18181b]">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-2 md:px-0">
        <Card className="w-full border border-border bg-card shadow-2xl dark:bg-card">
          <CardHeader>
            <CardTitle>Upload a Book</CardTitle>
            <CardDescription>Share your books with the world. Fill in the details and upload your file. Allowed types: epub, pdf, txt, mobi, etc. Max size: 100MB.</CardDescription>
          </CardHeader>
          <div className="flex flex-col gap-4 p-6 pt-0">
            <div className="mb-2 flex items-center gap-4">
              <Label className="flex cursor-pointer select-none items-center gap-2">
                <input
                  type="checkbox"
                  checked={bulk}
                  onChange={() => {
                    setBulk(!bulk);
                    setBulkFiles([]);
                    setBulkForm([]);
                  }}
                  className="accent-blue-500"
                />
                Bulk Upload
              </Label>
            </div>
            <div
              className="flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-blue-400/60 bg-muted/40 p-8 text-center transition hover:bg-blue-100/40 dark:bg-muted/10 dark:hover:bg-blue-900/30"
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onClick={handleAreaClick}
              role="button"
              tabIndex={0}
            >
              <div className="flex flex-col items-center gap-2 text-lg font-semibold text-blue-500 dark:text-blue-300">
                <span className="text-3xl">📚</span>
                {bulk ? "Drag & drop or click to select multiple book files" : "Drag & drop or click to select a book file"}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept={FILE_TYPES.map((t) => "." + t).join(",")}
                multiple={bulk}
                className="hidden"
                onChange={bulk ? handleBulkFileChange : handleFileChange}
                disabled={uploading}
              />
            </div>
            {bulk && bulkFiles.length > 0 && (
              <form onSubmit={handleBulkSubmit} className="mt-4 flex flex-col gap-6">
                <div className="text-base font-semibold">Files to upload:</div>
                <div className="flex max-h-[60vh] flex-col gap-4 overflow-y-auto">
                  {bulkForm.map((f, idx) => (
                    <Card key={f.file.name + idx} className="flex flex-col gap-2 border bg-muted/30 p-4 dark:bg-muted/10">
                      <div className="flex flex-col gap-4 md:flex-row md:items-center">
                        <div className="min-w-0 flex-1">
                          <div className="break-all font-mono text-xs">{f.file.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {(f.file.size / 1024 / 1024).toFixed(2)} MB, {f.book_filetype.toUpperCase()}
                          </div>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            setBulkFiles(bulkFiles.filter((_, i) => i !== idx));
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                      <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
                        <div>
                          <Label>Cover Image</Label>
                          <Input type="file" accept="image/*" disabled={bulkUploading} onChange={(e) => handleBulkCoverChange(idx, e)} />
                          {f.coverPreview && <img src={f.coverPreview} alt="Cover preview" className="mt-2 h-20 w-16 rounded border object-cover shadow" />}
                        </div>
                        <div>
                          <Label>Title *</Label>
                          <Input value={f.title} required disabled={bulkUploading} onChange={(e) => handleBulkFieldChange(idx, "title", e.target.value)} />
                        </div>
                        <div>
                          <Label>Author *</Label>
                          <Input value={f.author} required disabled={bulkUploading} onChange={(e) => handleBulkFieldChange(idx, "author", e.target.value)} />
                        </div>
                        <div>
                          <Label>File Type *</Label>
                          <Select value={f.book_filetype} onValueChange={(v) => handleBulkFieldChange(idx, "book_filetype", v)} disabled={bulkUploading}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              {FILE_TYPES.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type.toUpperCase()}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Language</Label>
                          <Input value={f.book_lang} disabled={bulkUploading} onChange={(e) => handleBulkFieldChange(idx, "book_lang", e.target.value)} placeholder="e.g. en" />
                        </div>
                        <div>
                          <Label>Year</Label>
                          <Input value={f.year} disabled={bulkUploading} onChange={(e) => handleBulkFieldChange(idx, "year", e.target.value)} placeholder="e.g. 2025" />
                        </div>
                        <div>
                          <Label>Publisher</Label>
                          <Input value={f.publisher} disabled={bulkUploading} onChange={(e) => handleBulkFieldChange(idx, "publisher", e.target.value)} />
                        </div>
                        <div>
                          <Label>ISBN</Label>
                          <Input value={f.isbn} disabled={bulkUploading} onChange={(e) => handleBulkFieldChange(idx, "isbn", e.target.value)} />
                        </div>
                        <div>
                          <Label>File Source</Label>
                          <Input value={f.file_source} disabled={bulkUploading} onChange={(e) => handleBulkFieldChange(idx, "file_source", e.target.value)} />
                        </div>
                        <div>
                          <Label>Content ID</Label>
                          <Input value={f.cid} disabled={bulkUploading} onChange={(e) => handleBulkFieldChange(idx, "cid", e.target.value)} />
                        </div>
                        <div className="col-span-full">
                          <Label>Description</Label>
                          <textarea
                            value={f.description}
                            disabled={bulkUploading}
                            onChange={(e) => handleBulkFieldChange(idx, "description", e.target.value)}
                            className="min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                          />
                        </div>
                      </div>
                      <div className="mb-2 flex items-center gap-2">
                        <Button type="button" variant="outline" size="sm" onClick={() => handleBulkAutofill(idx)} loading={bulkAutofillLoading === idx} disabled={bulkUploading}>
                          Autofill from Bookracy
                        </Button>
                        {bulkAutofillLoading === idx && <span className="text-xs text-muted-foreground">Looking up metadata...</span>}
                      </div>
                      {bulkUploading && (
                        <div className="mt-2 flex w-full flex-col gap-2">
                          <div className="text-xs text-muted-foreground">Uploading... {bulkProgress[idx] || 0}%</div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                            <div className="h-full bg-blue-500 transition-all" style={{ width: `${bulkProgress[idx] || 0}%` }} />
                          </div>
                        </div>
                      )}
                      {bulkResult[idx]?.success && (
                        <div className="mt-1 text-xs text-green-600 dark:text-green-400">
                          Upload successful! Book MD5: <span className="font-mono">{bulkResult[idx]?.md5}</span>
                        </div>
                      )}
                      {bulkResult[idx]?.error && <div className="mt-1 text-xs text-red-600 dark:text-red-400">{bulkResult[idx]?.error}</div>}
                    </Card>
                  ))}
                </div>
                <Button type="submit" className="mt-4 w-full" loading={bulkUploading} disabled={bulkUploading || bulkForm.length === 0}>
                  Upload All
                </Button>
              </form>
            )}
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-6 pt-0">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="file">Book File *</Label>
                <Input ref={fileInputRef} id="file" name="file" type="file" accept={FILE_TYPES.map((t) => "." + t).join(",")} required disabled={uploading} onChange={handleFileChange} />
                {filePreview && <div className="mt-2 break-all text-xs text-muted-foreground">{filePreview}</div>}
              </div>
              <div>
                <Label htmlFor="cover">Cover Image</Label>
                <Input ref={coverInputRef} id="cover" name="cover" type="file" accept="image/*" disabled={uploading} onChange={handleCoverChange} />
                {coverPreview && (
                  <div className="mt-2 flex items-center gap-2">
                    <img src={coverPreview} alt="Cover preview" className="h-20 w-16 rounded border object-cover shadow" />
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setCoverPreview(null);
                        setForm((f) => ({ ...f, cover: undefined }));
                        if (coverInputRef.current) coverInputRef.current.value = "";
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input id="title" name="title" value={form.title} required disabled={uploading} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="author">Author *</Label>
                <Input id="author" name="author" value={form.author} required disabled={uploading} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="book_filetype">File Type *</Label>
                <Select value={form.book_filetype} onValueChange={handleSelect} disabled={uploading}>
                  <SelectTrigger id="book_filetype">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {FILE_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="book_lang">Language</Label>
                <Input id="book_lang" name="book_lang" value={form.book_lang} disabled={uploading} onChange={handleChange} placeholder="e.g. en" />
              </div>
              <div>
                <Label htmlFor="year">Year</Label>
                <Input id="year" name="year" value={form.year} disabled={uploading} onChange={handleChange} placeholder="e.g. 2025" />
              </div>
              <div>
                <Label htmlFor="publisher">Publisher</Label>
                <Input id="publisher" name="publisher" value={form.publisher} disabled={uploading} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="isbn">ISBN</Label>
                <Input id="isbn" name="isbn" value={form.isbn} disabled={uploading} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="file_source">File Source</Label>
                <Input id="file_source" name="file_source" value={form.file_source} disabled={uploading} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="cid">Content ID</Label>
                <Input id="cid" name="cid" value={form.cid} disabled={uploading} onChange={handleChange} />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                disabled={uploading}
                onChange={handleChange}
                className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="mb-2 flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" onClick={handleAutofill} loading={autofillLoading} disabled={uploading || !form.file}>
                Autofill from Bookracy
              </Button>
              {autofillLoading && <span className="text-xs text-muted-foreground">Looking up metadata...</span>}
            </div>
            {uploading && (
              <div className="flex w-full flex-col gap-2">
                <div className="text-xs text-muted-foreground">Uploading... {progress}%</div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-blue-500 transition-all" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}
            {result?.success && (
              <div className="text-sm text-green-600 dark:text-green-400">
                Upload successful! Book MD5: <span className="font-mono">{result.md5}</span>
              </div>
            )}
            {result?.error && <div className="text-sm text-red-600 dark:text-red-400">{result.error}</div>}
            <Button type="submit" className="mt-2 w-full" loading={uploading} disabled={uploading}>
              Upload
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
