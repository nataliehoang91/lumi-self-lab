"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const SRC = "/images/webp/selfwithin-logo-with-text-smaller.webp";

export interface LogoWithSmallerTextProps {
  href?: string;
  className?: string;
  alt?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export function LogoWithSmallerText({
  href,
  className,
  alt = "Selfwithin",
  width = 140,
  height = 32,
  priority = false,
}: LogoWithSmallerTextProps) {
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
