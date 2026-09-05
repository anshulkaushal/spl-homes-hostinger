import Link from "next/link";
import { cn } from "@/lib/cn";

const styles = {
  primary:
    "bg-forest text-cream hover:bg-forest-deep border-forest",
  secondary:
    "bg-transparent text-cream border-cream/70 hover:bg-cream hover:text-ink",
  dark: "bg-forest text-cream hover:bg-forest-deep border-forest",
  outline:
    "bg-transparent text-ink border-ink/20 hover:border-forest hover:text-forest",
  timber: "bg-timber text-cream hover:bg-[#815c39] border-timber",
};

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: keyof typeof styles;
  className?: string;
  onClick?: () => void;
};

export function Button({ href, children, variant = "primary", className, onClick }: Props) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "inline-flex min-h-12 items-center justify-center border px-6 text-sm font-semibold tracking-wide uppercase transition-colors duration-200",
        styles[variant],
        className,
      )}
    >
      {children}
    </Link>
  );
}
