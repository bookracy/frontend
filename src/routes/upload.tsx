import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { AVAILABLE_FILE_TYPES, getFileType } from "@/lib/file";
import { BookForm, BulkUpload, FloatingActions } from "@/components/upload";

export const Route = createFileRoute("/upload")({
  component: Upload,
  beforeLoad: () => {
    // Authentication check commented out for development
    // if (!ctx.context.auth.isLoggedIn) {
    //   throw redirect({ to: "/login", search: { q: "" } });
    // }
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
  console.log(book);
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

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach((file) => {
        const fileType = getFileType(file.name);
        const title = file.name.replace(/\.[^/.]+$/, "");

        const firstBook = form.getValues("books")[0];
        const isFirstBookEmpty = firstBook.title === "" && firstBook.author === "" && !firstBook.file && !firstBook.coverImage;
        if (isFirstBookEmpty) {
          console.log("Updating file type");
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

  const onSubmit = (data: z.infer<typeof uploadBookFormSchema>) => {
    console.log("Form data:", data);
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

                <FloatingActions bookCount={fields.length} canAddMore={fields.length < 10} canSubmit={hasUploadableBooks} onAddBook={() => append(createBaseBook())} />
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
