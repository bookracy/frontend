import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { buttonVariants } from "./button-variants";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, loading, variant, size, asChild = false, children, ...props }, ref) => {
  if (asChild) {
    return (
      <Slot ref={ref} {...props}>
        <>
          {React.Children.map(children as React.ReactElement, (child: React.ReactElement) => {
            return React.cloneElement(child, {
              className: cn(buttonVariants({ variant, size }), className),
              children: (
                <>
                  {loading && <Loader2 className={cn("h-4 w-4 animate-spin", children && "mr-2")} />}
                  {child.props.children}
                </>
              ),
            });
          })}
        </>
      </Slot>
    );
  }

  return (
    <button className={cn(buttonVariants({ variant, size, className }))} disabled={loading} ref={ref} {...props}>
      <>
        {loading && <Loader2 className={cn("h-4 w-4 animate-spin", children && "mr-2")} />}
        {children}
      </>
    </button>
  );
});
Button.displayName = "Button";

export { Button };
