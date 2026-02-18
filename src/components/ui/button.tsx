import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary-dark text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-primary/10 hover:border-input",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        primaryLight: "bg-primary-light text-slate-900 hover:bg-primary-light/80",
        secondaryLight: "bg-second hover:bg-second/90 text-second-foreground  transition-all",
        coral: "bg-coral text-coral-foreground hover:bg-coral/90",
        skyBlue: "bg-sky-blue text-sky-blue-foreground hover:bg-sky-blue/90",
        gradientPeach:
          "bg-[linear-gradient(135deg,#FFB38C_0%,#FCA17E_100%)] text-white hover:opacity-90 transition-opacity",
        gradientSecond:
          "bg-[linear-gradient(135deg,#B8A4E8_0%,#9b7ddb_100%)] text-white hover:opacity-90 transition-opacity",
        gradientPrimary:
          "bg-[linear-gradient(135deg,#ffb399_0%,#ff9073_100%)] text-white hover:opacity-90 transition-opacity",
        ghost: "hover:bg-primary/10 hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
