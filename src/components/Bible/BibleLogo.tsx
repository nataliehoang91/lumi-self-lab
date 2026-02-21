"use client";

import Image from "next/image";
import Link from "next/link";

export function BibleLogo() {
  return (
    <Link
      href="/bible"
      className="size-8 sm:size-10 rounded-lg bg-linear-to-br from-primary-light via-coral to-yellow-200 text-stone-800 flex items-center justify-center shrink-0 overflow-hidden"
      aria-label="Scripture Memory home"
    >
      <Image
        src="/images/webp/cross-icon-black.webp"
        alt=""
        width={40}
        height={40}
        className="size-full object-contain p-0.5"
      />
    </Link>
  );
}
