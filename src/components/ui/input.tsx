import * as React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  iconLeft?: LucideIcon;
  iconRight?: LucideIcon;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type = "text", ...props }, ref) => {
  return (
    <div className="relative flex items-center">
      {props.iconLeft && <props.iconLeft className="absolute left-3" />}
      {props.iconRight && <props.iconRight className="absolute right-3" />}
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          props.iconLeft && "pl-12",
          className,
        )}
        ref={ref}
        {...props}
      />
    </div>
  );
});

Input.displayName = "Input";

export { Input };
