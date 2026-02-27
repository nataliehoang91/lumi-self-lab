"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useRead } from "./context/ReadContext";
import { BibleLoader } from "./BibleLoader";
import { ReadMainBody } from "./ReadMainBody/ReadMainBody";

export function ReadMain() {
  const { focusMode } = useRead();
  const [showBibleLoader, setShowBibleLoader] = useState(false);

  return (
    <main className={cn("transition-all duration-300", focusMode ? "py-8" : "py-6")}>
      <div className={cn("mx-auto", focusMode ? "max-w-6xl px-6" : "max-w-7xl px-4 sm:px-6")}>
        <ReadMainBody />

        {showBibleLoader && (
          <BibleLoader
            onComplete={() => {
              setShowBibleLoader(false);
            }}
          />
        )}
      </div>
    </main>
  );
}
