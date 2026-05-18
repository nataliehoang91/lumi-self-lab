import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LearnHeroImageProps {
  src: string;
  alt: string;
  /** Photographer name shown as caption */
  credit?: string;
  /** Link for the credit (e.g. Unsplash photo URL) */
  creditHref?: string;
  className?: string;
  /** Optional overlay element rendered centered on top of the image */
  overlay?: React.ReactNode;
}

export function LearnHeroImage({
  src,
  alt,
  credit,
  creditHref,
  className,
  overlay,
}: LearnHeroImageProps) {
  return (
    <figure className={cn("my-8 overflow-hidden rounded-2xl shadow-sm", className)}>
      <div className="relative aspect-[16/7] w-full">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 800px"
          priority={false}
        />
        {overlay && (
          <div className="absolute inset-0 flex items-center justify-center">
            {overlay}
          </div>
        )}
      </div>
      {credit && (
        <figcaption className="mt-2 text-center text-xs text-muted-foreground">
          {creditHref ? (
            <a
              href={creditHref}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 transition-opacity hover:opacity-70"
            >
              {credit}
            </a>
          ) : (
            credit
          )}
        </figcaption>
      )}
    </figure>
  );
}
