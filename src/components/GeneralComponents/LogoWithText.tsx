"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const SRC = "/images/webp/selfwithin-logo-with-text.webp";

export interface LogoWithTextProps {
  href?: string;
  className?: string;
  alt?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export function LogoWithText({
  href,
  className,
  alt = "Selfwithin",
  width = 180,
  height = 40,
  priority = false,
}: LogoWithTextProps) {
  const img = (
    <Image
      src={SRC}
      alt={alt}
      width={width}
      height={height}
      className={cn("h-auto w-auto", className)}
      priority={priority}
    />
  );

  if (href) return <Link href={href}>{img}</Link>;
  return img;
}
