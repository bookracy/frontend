import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn, useWatch } from "react-hook-form";
import { Trash2 } from "lucide-react";
import { FileUploadField } from "./file-upload-field";
import { FileText, Image as ImageIcon } from "lucide-react";
import { AVAILABLE_FILE_TYPES, getFileType } from "@/lib/file";
import { useEffect } from "react";
import { UploadForm } from "@/routes/upload";

interface BookFormProps {
  form: UseFormReturn<UploadForm>;
  index: number;
  canRemove: boolean;
  onRemove: () => void;
}

export function BookForm({ form, index, canRemove, onRemove }: BookFormProps) {
  const fileValue = useWatch({ control: form.control, name: `books.${index}.file` });

  useEffect(() => {
    if (fileValue && fileValue && typeof fileValue === "object" && "name" in fileValue && "type" in fileValue) {
      const file = fileValue as File;
      const fileType = getFileType(file.name);
      form.setValue(`books.${index}.fileType`, fileType);

      const currentTitle = form.getValues(`books.${index}.title`);
      if (!currentTitle || currentTitle.trim() === "") {
        const title = file.name.replace(/\.[^/.]+$/, "");
        form.setValue(`books.${index}.title`, title);
      }
    } else if (!fileValue) {
      form.setValue(`books.${index}.title`, "");
    }
  }, [fileValue, form, index]);

  return (
    <Card className="relative">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Book {index + 1}</CardTitle>
          {canRemove && (
            <Button type="button" variant="destructive" size="sm" onClick={onRemove}>
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-4">
            <FileUploadField
              form={form}
              name={`books.${index}.file`}
              label="Book File"
              accept=".pdf,.epub,.mobi,.docx,.doc"
              fileTypes={AVAILABLE_FILE_TYPES.map((type) => type.toUpperCase()).join(", ")}
              icon={FileText}
            />

            <FileUploadField
              form={form}
              name={`books.${index}.coverImage`}
              label="Cover Image"
              accept="image/*"
              fileTypes={AVAILABLE_FILE_TYPES.map((type) => type.toUpperCase()).join(", ")}
              icon={ImageIcon}
              showPreview={true}
            />
          </div>

          <div className="space-y-4 lg:col-span-2">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name={`books.${index}.title`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="Book title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`books.${index}.author`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author *</FormLabel>
                    <FormControl>
                      <Input placeholder="Author name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`books.${index}.fileType`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>File Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select file type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {AVAILABLE_FILE_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type.toUpperCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`books.${index}.language`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., English, Spanish" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`books.${index}.year`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Publication Year</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 2023" {...field} onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`books.${index}.publisher`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Publisher</FormLabel>
                    <FormControl>
                      <Input placeholder="Publisher name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`books.${index}.isbn`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ISBN</FormLabel>
                    <FormControl>
                      <Input placeholder="ISBN number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`books.${index}.fileSource`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>File Source</FormLabel>
                    <FormControl>
                      <Input placeholder="File source" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name={`books.${index}.description`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Book description or summary" rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
