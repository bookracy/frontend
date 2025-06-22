import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { FieldValues, Path, UseFormReturn, useWatch, PathValue } from "react-hook-form";
import { useState, useEffect } from "react";

interface FileUploadFieldProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  accept: string;
  fileTypes: string;
  icon: React.ComponentType<{ className?: string }>;
  showPreview?: boolean;
}

export function FileUploadField<T extends FieldValues>({ form, name, label, accept, fileTypes, icon: Icon, showPreview = false }: FileUploadFieldProps<T>) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fieldValue = useWatch({ control: form.control, name });

  useEffect(() => {
    if (fieldValue && showPreview && fieldValue && typeof fieldValue === "object" && "name" in fieldValue && "type" in fieldValue) {
      const url = URL.createObjectURL(fieldValue as File);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [fieldValue, showPreview]);

  const handleFileChange = (file: File | undefined, onChange: (value: File | undefined) => void) => {
    onChange(file);
  };

  const handleRemoveFile = (onChange: (value: File | undefined) => void) => {
    onChange(undefined);
    form.setValue(name, undefined as PathValue<T, Path<T>>);
    setPreviewUrl("");
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex h-1/2 flex-col">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="flex-1 space-y-2">
              <div
                className={cn(
                  "relative flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed p-6 transition-colors",
                  field.value ? "border-primary bg-primary/5" : "border-muted hover:border-primary/50",
                  "h-full",
                )}
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = accept;
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) {
                      handleFileChange(file, field.onChange);
                    }
                  };
                  input.click();
                }}
              >
                {field.value ? (
                  <>
                    {showPreview && previewUrl ? (
                      <div className="relative mb-2 h-32 w-32 overflow-hidden rounded-md">
                        <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
                      </div>
                    ) : (
                      <Icon className="text-primary mb-2 h-8 w-8" />
                    )}
                    <p className="text-primary text-center text-sm font-medium">{label} Uploaded</p>
                    <p className="text-muted-foreground text-center text-xs">{field.value.name}</p>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleRemoveFile(field.onChange);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Icon className="text-muted-foreground mb-2 h-8 w-8" />
                    <p className="text-muted-foreground text-center text-sm">Click to select {label.toLowerCase()}</p>
                    <p className="text-muted-foreground text-center text-xs">{fileTypes}</p>
                  </>
                )}
              </div>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
