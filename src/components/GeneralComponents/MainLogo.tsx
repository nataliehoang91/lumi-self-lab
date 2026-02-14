"use client";

import { LogoWithText } from "./LogoWithText";

/** Main logo (full with text). Use LogoWithSmallerText or Logo for other variants. */
export function MainLogo(props: React.ComponentProps<typeof LogoWithText>) {
  return <LogoWithText {...props} />;
}
