"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const LOGO_WITH_TEXT_SRC = "/webp/selfwithin-logo-with-text.webp";
const LOGO_WITH_TEXT_SMALLER_SRC = "/webp/selfwithin-logo-with-text-smaller.webp";
const LOGO_ICON_LIGHT_SRC = "/webp/selfwithin-logo-2-for-light.webp";
const LOGO_ICON_DARK_SRC = "/webp/selfwithin-logo-2-for-dark.webp";

export type MainLogoVariant = "logo-with-text" | "logo-with-text-smaller" | "logo";

export interface MainLogoProps {
  /** "logo-with-text" = full logo; "logo-with-text-smaller" = smaller full logo; "logo" = icon only */
  variant: MainLogoVariant;
  /** Optional link href; when set, logo is wrapped in a Link */
  href?: string;
  className?: string;
  /** Image alt text */
  alt?: string;
  /** Width in pixels (height follows for logo-with-text; use height for logo to control size) */
  width?: number;
  /** Height in pixels */
  height?: number;
  priority?: boolean;
}

const defaultAlt: Record<MainLogoVariant, string> = {
  "logo-with-text": "Selfwithin",
  "logo-with-text-smaller": "Selfwithin",
  logo: "Selfwithin logo",
};

/**
 * Shared main logo component.
 * - "logo-with-text": full logo (public/webp/selfwithin-logo-with-text.webp)
 * - "logo-with-text-smaller": smaller full logo (public/webp/selfwithin-logo-with-text-smaller.webp)
 * - "logo": icon only, light/dark aware (public/webp/selfwithin-logo-2-for-*.webp)
 */
export function MainLogo({
  variant,
  href,
  className,
  alt,
  width,
  height,
  priority = false,
}: MainLogoProps) {
  const resolvedAlt = alt ?? defaultAlt[variant];

  const content =
    variant === "logo-with-text" ? (
      <Image
        src={LOGO_WITH_TEXT_SRC}
        alt={resolvedAlt}
        width={width ?? 180}
        height={height ?? 40}
        className={cn("h-auto w-auto", className)}
        priority={priority}
      />
    ) : variant === "logo-with-text-smaller" ? (
      <Image
        src={LOGO_WITH_TEXT_SMALLER_SRC}
        alt={resolvedAlt}
        width={width ?? 140}
        height={height ?? 32}
        className={cn("h-auto w-auto", className)}
        priority={priority}
      />
    ) : (
      <span
        className={cn("relative inline-block size-10 shrink-0", className)}
        style={
          width != null || height != null ? { width: width ?? 40, height: height ?? 40 } : undefined
        }
      >
        <Image
          src={LOGO_ICON_LIGHT_SRC}
          alt={resolvedAlt}
          fill
          className="object-contain dark:hidden"
          priority={priority}
          sizes="40px"
        />
        <Image
          src={LOGO_ICON_DARK_SRC}
          alt=""
          fill
          className="object-contain hidden dark:block"
          priority={priority}
          sizes="40px"
          aria-hidden
        />
      </span>
    );

  if (href) {
    return (
      <Link
        href={href}
        className={cn("inline-flex items-center", variant === "logo" && "flex shrink-0")}
      >
        {content}
      </Link>
    );
  }

  return (
    <span className={cn("inline-flex items-center", variant === "logo" && "flex shrink-0")}>
      {content}
    </span>
  );
}
