import React from "react";
import { cn } from "@/lib/utils";
import { SearchIcon } from "lucide-react";

export type SearchBarProps = React.InputHTMLAttributes<HTMLInputElement>;

const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(({ className, ...props }, ref) => {
  return (
    <div className="relative flex items-center">
      <SearchIcon className="absolute left-3 h-5 w-5 text-muted-foreground" />
      <input
        type="text"
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-10 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    </div>
  );
});

SearchBar.displayName = "SearchBar";

export { SearchBar };
