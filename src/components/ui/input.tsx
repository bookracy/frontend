import * as React from "react";
import { cn } from "@/lib/utils";
import { SearchIcon, XIcon } from "lucide-react";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  isDisabled?: boolean;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type = "text", isDisabled = false, ...props }, ref) => {
  const [hasText, setHasText] = React.useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasText(e.target.value.length > 0);
    if (props.onChange) {
      props.onChange(e);
    }
  };

  const clearInput = () => {
    setHasText(false);
    if (ref && typeof ref === "object" && ref.current) {
      ref.current.value = "";
    }
    if (props.onChange) {
      props.onChange({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <div className="relative max-w-[50rem]">
      {/* Search Icon on the far left */}
      <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background py-2 pl-10 pr-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        disabled={isDisabled}
        {...props}
        onChange={handleInputChange}
      />
      {/* Clear (X) Button on the far right */}
      {hasText && (
        <button type="button" className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground hover:text-purple-600 focus:outline-none" onClick={clearInput}>
          <XIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  );
});

Input.displayName = "Input";

export { Input };
