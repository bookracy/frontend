import { useRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CoverUploadInputProps {
  coverPreview: string | null;
  disabled: boolean;
  onCoverChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCoverRemove: () => void;
}

export function CoverUploadInput({ coverPreview, disabled, onCoverChange, onCoverRemove }: CoverUploadInputProps) {
  const coverInputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <Label htmlFor="cover">Cover Image</Label>
      <Input ref={coverInputRef} id="cover" name="cover" type="file" accept="image/*" disabled={disabled} onChange={onCoverChange} />
      {coverPreview && (
        <div className="mt-2 flex items-center gap-2">
          <img src={coverPreview} alt="Cover preview" className="h-20 w-16 rounded border object-cover shadow" />
          <Button type="button" size="sm" variant="outline" onClick={onCoverRemove}>
            Remove
          </Button>
        </div>
      )}
    </div>
  );
}
