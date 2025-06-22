import * as React from "react";

import { cn } from "@/lib/utils";

export type InputProps = React.ComponentProps<"input"> & {
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
};

function Input({ className, type, iconLeft, iconRight, ...props }: InputProps) {
  return (
    <div className="relative flex items-center">
      {iconLeft && <div className="absolute left-4">{iconLeft}</div>}
      {iconRight && <div className="absolute right-4">{iconRight}</div>}
      <input
        type={type}
        className={cn(
          "border-input bg-background ring-offset-background placeholder:text-muted-foreground flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          iconLeft && "pl-12",
          className,
        )}
        {...props}
      />
    </div>
  );
}

export { Input };
