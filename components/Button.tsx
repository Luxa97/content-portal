import { clsx } from "clsx";
import type { ButtonHTMLAttributes } from "react";

type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "formAction"> & {
  formAction?: string | ((formData: FormData) => void | Promise<void>);
  variant?: "primary" | "secondary" | "danger";
};

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" && "bg-ink text-white hover:bg-black",
        variant === "secondary" && "border border-line bg-white text-ink hover:bg-mist",
        variant === "danger" && "bg-red-600 text-white hover:bg-red-700",
        className
      )}
      {...props}
    />
  );
}
