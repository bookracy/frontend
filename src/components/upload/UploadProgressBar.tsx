import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  progress: number;
  showPercentage?: boolean;
}

export function ProgressBar({ progress, showPercentage = true }: ProgressBarProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      {showPercentage && <div className="text-xs text-muted-foreground">Uploading... {progress}%</div>}
      <Progress value={progress} className="h-2" />
    </div>
  );
}
