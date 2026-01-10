// @ts-nocheck
import React from "react";

export function LoadingIcon({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex gap-1 items-center ${className}`}>
      <span className="loading-dot" />
      <span className="loading-dot" style={{ animationDelay: "0.2s" }} />
      <span className="loading-dot" style={{ animationDelay: "0.4s" }} />
      <style jsx>{`
        .loading-dot {
          display: inline-block;
          width: 0.5em;
          height: 0.5em;
          border-radius: 50%;
          background: currentColor;
          opacity: 0.3;
          animation: loading-bounce 1s infinite;
        }
        @keyframes loading-bounce {
          0%,
          80%,
          100% {
            opacity: 0.3;
          }
          40% {
            opacity: 1;
          }
        }
      `}</style>
    </span>
  );
}
