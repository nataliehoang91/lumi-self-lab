"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const SRC = "/images/webp/selfwithin-logo-2-for-light.webp";

export interface LogoProps {
  href?: string;
  className?: string;
  alt?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export function Logo({
  href,
  className,
  alt = "Selfwithin logo",
  width,
  height,
  priority = false,
}: LogoProps) {
  const size = width ?? height ?? 40;
  const hasExplicitSize = width != null || height != null;
  const content = (
    <span
      className={cn("relative inline-block shrink-0", className)}
      style={
        hasExplicitSize
          ? { width: size, height: "auto", aspectRatio: "auto" }
          : undefined
      }
    >
      <Image
        src={SRC}
        alt={alt}
        width={size}
        height={size}
        className="h-auto w-full object-contain"
        priority={priority}
        sizes={`${size}px`}
      />
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex shrink-0">
        {content}
      </Link>
    );
  }
  return <span className="inline-flex shrink-0">{content}</span>;
}
