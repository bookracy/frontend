import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { AVAILABLE_FILE_TYPES, getFileType } from "@/lib/file";
import { BookForm, BulkUpload, FloatingActions } from "@/components/upload";
import { useMutation } from "@tanstack/react-query";
import { uploadBooks } from "@/api/backend/upload";
import { toast } from "sonner";
import { useSettingsStore } from "@/stores/settings";

export const Route = createFileRoute("/upload")({
  component: Upload,
  beforeLoad: (ctx) => {
    const beta = useSettingsStore.getState().beta;
    if (import.meta.env.PROD && !beta) throw redirect({ to: "/", search: { q: "" } });
    if (!ctx.context.auth.isLoggedIn) throw redirect({ to: "/login" });
  },
});

export type UploadForm = z.infer<typeof uploadBookFormSchema>;
type UploadFormBook = z.infer<typeof uploadBookFormSchema>["books"][number];

const uploadBookFormSchema = z.object({
  books: z.array(
    z.object({
      title: z.string().min(1, { message: "Title is required" }),
      author: z.string().min(1, { message: "Author is required" }),
      fileType: z.enum(AVAILABLE_FILE_TYPES),
      language: z.string().optional(),
      year: z.number().optional(),
      publisher: z.string().optional(),
      isbn: z.string().optional(),
      fileSource: z.string().optional(),
      contentId: z.string().optional(),
      description: z.string().optional(),
      file: z.instanceof(File).optional(),
      coverImage: z.instanceof(File).optional(),
    }),
  ),
});

const createBaseBook = (book?: Partial<UploadFormBook>): UploadFormBook => {
  return {
    title: "",
    author: "",
    fileType: "pdf",
    language: "",
    year: undefined,
    publisher: "",
    isbn: "",
    fileSource: "",
    contentId: "",
    description: "",
    file: undefined,
    coverImage: undefined,
    ...book,
  };
};

function Upload() {
  const [progress, setProgress] = useState(0);

  const form = useForm<UploadForm>({
    resolver: zodResolver(uploadBookFormSchema),
    defaultValues: {
      books: [createBaseBook()],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "books",
  });

  const books = useWatch({ control: form.control, name: "books" });
  const hasUploadableBooks = books?.some((book) => book.file && book.coverImage) ?? false;

  const uploadMutation = useMutation({
    mutationFn: (books: UploadForm["books"]) =>
      uploadBooks(books, (completed, total, currentBookProgress) => {
        console.log(`Progress: ${completed}/${total} = ${currentBookProgress}%`);
        setProgress(currentBookProgress);
      }),
    onSuccess: (data) => {
      setProgress(100);
      const uploadedCount = data.length;
      toast.success(`${uploadedCount} books uploaded successfully!`, { position: "top-center" });
      form.reset({
        books: [createBaseBook()],
      });
    },
    onError: (error) => {
      console.error("Upload failed:", error);
      toast.error("Failed to upload books", { position: "top-center" });
    },
    onSettled: () => {
      setTimeout(() => setProgress(0), 1000);
    },
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach((file) => {
        const fileType = getFileType(file.name);
        const title = file.name.replace(/\.[^/.]+$/, "");

        const firstBook = form.getValues("books")[0];
        const isFirstBookEmpty = firstBook.title === "" && firstBook.author === "" && !firstBook.file && !firstBook.coverImage;
        if (isFirstBookEmpty) {
          form.setValue("books.0.title", title);
          form.setValue("books.0.fileType", fileType);
          form.setValue("books.0.file", file);
        } else {
          append(createBaseBook({ title, fileType, file }));
        }
      });
    },
    [append, form],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/epub+zip": [".epub"],
      "application/x-mobipocket-ebook": [".mobi"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "application/msword": [".doc"],
    },
    multiple: true,
  });

  const onSubmit = async (data: UploadForm) => {
    toast.info(`Uploading ${data.books.length} books...`, { position: "top-center" });
    await uploadMutation.mutateAsync(data.books);
  };

  return (
    <div className="flex h-full w-full justify-center p-4">
      <div className="flex w-full max-w-6xl flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upload Books</CardTitle>
            <CardDescription>Upload your books one by one or bulk upload multiple files at once</CardDescription>
          </CardHeader>
          <CardContent>
            <BulkUpload isDragActive={isDragActive} getRootProps={getRootProps} getInputProps={getInputProps} />

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {fields.map((field, index) => (
                  <BookForm key={field.id} form={form} index={index} canRemove={fields.length > 1} onRemove={() => remove(index)} />
                ))}

                <FloatingActions
                  bookCount={fields.length}
                  canAddMore={fields.length < 10}
                  canSubmit={hasUploadableBooks && !uploadMutation.isPending}
                  onAddBook={() => append(createBaseBook())}
                  isUploading={uploadMutation.isPending}
                  progress={progress}
                />
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
