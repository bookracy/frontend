interface CoverPreviewProps {
  imageUrl: string;
}

export function CoverPreview({ imageUrl }: CoverPreviewProps) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <img src={imageUrl} alt="Cover preview" className="max-h-[120px] max-w-full rounded border object-contain shadow" />
    </div>
  );
}
