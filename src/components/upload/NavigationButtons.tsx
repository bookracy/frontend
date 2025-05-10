import { Button } from "@/components/ui/button";

interface NavigationButtonsProps {
  onPrevious: () => void;
  onNext: () => void;
  disabled: boolean;
  hasPrevious: boolean;
  hasNext: boolean;
}

export function NavigationButtons({ onPrevious, onNext, disabled, hasPrevious, hasNext }: NavigationButtonsProps) {
  return (
    <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center justify-center gap-4 rounded-full bg-background p-2 shadow-lg">
      <Button type="button" variant="outline" size="icon" onClick={onPrevious} disabled={disabled || !hasPrevious} className="h-10 w-10 rounded-full">
        ↑
      </Button>
      <Button type="button" variant="outline" size="icon" onClick={onNext} disabled={disabled || !hasNext} className="h-10 w-10 rounded-full">
        ↓
      </Button>
    </div>
  );
}
