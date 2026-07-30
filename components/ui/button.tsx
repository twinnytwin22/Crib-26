import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap border font-mono text-[11px] font-semibold uppercase tracking-[0.08em] transition-[background-color,color,border-color,transform] duration-150 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-45 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "border-primary bg-primary text-white hover:-translate-y-0.5 hover:border-[var(--neutral-1000)] hover:bg-[var(--neutral-1000)] hover:text-white",
        destructive: "border-destructive bg-destructive text-white hover:bg-[var(--danger-600)] hover:text-white",
        inverse: "border-white bg-white text-[var(--neutral-1000)] hover:-translate-y-0.5 hover:border-[var(--neutral-1000)] hover:bg-[var(--neutral-1000)] hover:text-white",
        outline: "border-foreground bg-transparent text-foreground hover:-translate-y-0.5 hover:bg-foreground hover:text-background",
        secondary: "border-border bg-secondary text-secondary-foreground hover:border-foreground hover:bg-card",
        ghost: "border-transparent text-foreground hover:border-foreground hover:bg-transparent",
        link: "h-auto border-0 p-0 text-primary underline decoration-1 underline-offset-4 hover:text-[var(--brand-hover)]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-12 px-6",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
