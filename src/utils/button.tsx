import type { ReactNode, ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type Variant = "default" | "outline" | "link";
type Color = "blue" | "red" | "purple" | "green" | "gray";

type ButtonProps = {
  children: ReactNode;
  variant?: Variant;
  color?: Color;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  children,
  variant = "default",
  color = "blue",
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "px-4 py-2 rounded-md font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2";

  const colorStyles: Record<Color, string> = {
    blue: "text-blue-600 hover:text-blue-700",
    red: "text-red-600 hover:text-red-700",
    purple: "text-purple-600 hover:text-purple-700",
    green: "text-green-600 hover:text-green-700",
    gray: "text-gray-600 hover:text-gray-700",
  };

  const variants: Record<Variant, string> = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline:
      "border border-current bg-transparent text-current hover:bg-blue-50",
    link: "bg-transparent underline-offset-2 hover:underline p-0 h-auto shadow-none",
  };

  return (
    <button
      {...props}
      className={clsx(baseStyles, variants[variant], colorStyles[color], className)}
    >
      {children}
    </button>
  );
}

