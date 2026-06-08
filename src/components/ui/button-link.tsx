import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { MouseEventHandler, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "outline" | "light" | "ghost";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
  showIcon?: boolean;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
};

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-blue001 text-white shadow-[0_14px_32px_rgba(25,39,114,0.24)] hover:bg-blue002",
  secondary:
    "bg-ink text-white shadow-[0_14px_32px_rgba(11,16,32,0.16)] hover:bg-blue001",
  outline:
    "border border-blue001/20 bg-white text-blue001 hover:border-blue001 hover:bg-blue001 hover:text-white",
  light:
    "bg-white text-blue001 shadow-[0_14px_32px_rgba(255,255,255,0.16)] hover:bg-blue-50",
  ghost: "text-blue001 hover:bg-blue001/5"
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className,
  showIcon = true,
  onClick
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-semibold transition duration-200",
        variants[variant],
        className
      )}
      onClick={onClick}
    >
      <span>{children}</span>
      {showIcon ? <ArrowRight className="h-4 w-4" aria-hidden="true" /> : null}
    </Link>
  );
}
