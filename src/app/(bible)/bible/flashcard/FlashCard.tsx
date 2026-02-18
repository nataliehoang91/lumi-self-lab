"use client";

import { useState } from "react";
import type { FlashVerse } from "./FlashCardGrid";
import "./FlashCard.css";

export function FlashCard({ verse }: { verse: FlashVerse }) {
  const [flipped, setFlipped] = useState(false);

  const frontLabel = `${verse.book} ${verse.chapter}:${verse.verse} (${verse.version})`;

  return (
    <div
      className="flash-card"
      onClick={() => setFlipped((f) => !f)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setFlipped((f) => !f);
        }
      }}
      aria-label={flipped ? "Show reference" : "Show verse"}
    >
      <div className={`flash-card-inner ${flipped ? "flipped" : ""}`}>
        <div className="flash-card-front">
          <span className="flash-card-label">{frontLabel}</span>
        </div>
        <div className="flash-card-back">
          <p className="flash-card-content">{verse.content}</p>
        </div>
      </div>
    </div>
  );
}
