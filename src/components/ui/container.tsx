import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  bleed?: boolean;
};

export function Container({ children, className, bleed = false, ...props }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-7xl",
        bleed ? "px-0" : "page-padding",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
