import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

export interface BookFormData {
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
}

interface BookMetadataFormProps {
  data: BookFormData;
  onChange: (field: keyof BookFormData, value: string) => void;
  onFileTypeChange: (value: string) => void;
  disabled: boolean;
  fileTypes: string[];
}

export function BookMetadataForm({ data, onChange, onFileTypeChange, disabled, fileTypes }: BookMetadataFormProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange(name as keyof BookFormData, value);
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div>
        <Label htmlFor="title">Title *</Label>
        <Input id="title" name="title" value={data.title} required disabled={disabled} onChange={handleChange} />
      </div>
      <div>
        <Label htmlFor="author">Author *</Label>
        <Input id="author" name="author" value={data.author} required disabled={disabled} onChange={handleChange} />
      </div>
      <div>
        <Label htmlFor="book_filetype">File Type *</Label>
        <Select value={data.book_filetype} onValueChange={onFileTypeChange} disabled={disabled}>
          <SelectTrigger id="book_filetype">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            {fileTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type.toUpperCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="book_lang">Language</Label>
        <Input id="book_lang" name="book_lang" value={data.book_lang} disabled={disabled} onChange={handleChange} placeholder="e.g. en" />
      </div>
      <div>
        <Label htmlFor="year">Year</Label>
        <Input id="year" name="year" value={data.year} disabled={disabled} onChange={handleChange} placeholder="e.g. 2025" />
      </div>
      <div>
        <Label htmlFor="publisher">Publisher</Label>
        <Input id="publisher" name="publisher" value={data.publisher} disabled={disabled} onChange={handleChange} />
      </div>
      <div>
        <Label htmlFor="isbn">ISBN</Label>
        <Input id="isbn" name="isbn" value={data.isbn} disabled={disabled} onChange={handleChange} />
      </div>
      <div>
        <Label htmlFor="file_source">File Source</Label>
        <Input id="file_source" name="file_source" value={data.file_source} disabled={disabled} onChange={handleChange} />
      </div>
      <div>
        <Label htmlFor="cid">Content ID</Label>
        <Input id="cid" name="cid" value={data.cid} disabled={disabled} onChange={handleChange} />
      </div>
      <div className="col-span-full">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          name="description"
          value={data.description}
          disabled={disabled}
          onChange={handleChange}
          className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
    </div>
  );
}
