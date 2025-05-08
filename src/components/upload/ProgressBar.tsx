interface ProgressBarProps {
  progress: number;
  showPercentage?: boolean;
}

export function ProgressBar({ progress, showPercentage = true }: ProgressBarProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      {showPercentage && <div className="text-xs text-muted-foreground">Uploading... {progress}%</div>}
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full bg-blue-500 transition-all" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
