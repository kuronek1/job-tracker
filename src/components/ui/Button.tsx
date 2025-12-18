"use client";

import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "xs" | "sm" | "md" | "lg";

type BaseProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
  disabled?: boolean;
};

type ButtonAsButton = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ButtonAsLink = BaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const baseStyles =
  "inline-flex items-center justify-center font-semibold transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70 hover:-translate-y-0.5 shadow-lg shadow-black/15";

const variantStyles: Record<ButtonVariant, string> = {
  primary: "border border-white/10 bg-white text-slate-900 hover:shadow-xl",
  secondary: "border border-white/20 bg-white/10 text-white hover:bg-white/15",
  ghost: "border border-transparent bg-transparent text-white hover:bg-white/10",
  danger: "border border-rose-300/60 bg-rose-500/15 text-rose-50 hover:bg-rose-500/20",
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: "rounded-xl px-2.5 py-1.5 text-xs",
  sm: "rounded-xl px-4 py-2 text-sm",
  md: "rounded-xl px-5 py-2.5 text-sm",
  lg: "rounded-xl px-6 py-3 text-base",
};

function cn(...values: Array<string | undefined | false | null>) {
  return values.filter(Boolean).join(" ");
}

export default function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    fullWidth,
    className,
    children,
    disabled,
    ...rest
  } = props;

  const classes = cn(baseStyles, variantStyles[variant], sizeStyles[size], fullWidth && "w-full", className, "cursor-pointer!");

  if ("href" in props && props.href) {
    const { href, ...linkProps } = rest as ButtonAsLink;
    return (
      <Link href={props.href} className={classes} {...linkProps}>
        {children}
      </Link>
    );
  }

  const buttonProps = rest as ButtonAsButton;
  return (
    <button type={buttonProps.type ?? "button"} className={classes} {...buttonProps} disabled={disabled}>
      {children}
    </button>
  );
}
