"use client";

import { useState } from "react";

export function PrintControls({ title }: { title: string }) {
  const [downloading, setDownloading] = useState(false);

  const handleExport = async () => {
    setDownloading(true);
    try {
      const printUrl = window.location.href;
      const res = await fetch(`/api/study/print?url=${encodeURIComponent(printUrl)}`);
      if (!res.ok) throw new Error("Failed");
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${title}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(a.href);
    } catch {
      alert("PDF export failed. Try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div
      id="print-controls"
      style={{
        position: "fixed", top: 0, right: 0, left: 0,
        background: "#fafaf9", borderBottom: "1px solid #e5e7eb",
        padding: "8px 20px", display: "flex", alignItems: "center",
        justifyContent: "space-between", zIndex: 100,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{ width: 28, height: 28, background: "#f97316", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="14" height="14" viewBox="0 0 10 10" fill="none">
            <path d="M5 1L6.5 4H9.5L7 6L8 9L5 7L2 9L3 6L0.5 4H3.5L5 1Z" fill="white" />
          </svg>
        </div>
        <span style={{ fontSize: "13px", fontFamily: "system-ui, sans-serif", color: "#111", fontWeight: 700 }}>
          {title}
        </span>
        <span style={{ fontSize: "11px", fontFamily: "system-ui, sans-serif", color: "#aaa" }}>— Preview</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <button
          onClick={handleExport}
          disabled={downloading}
          style={{
            fontFamily: "system-ui, sans-serif", fontSize: "13px",
            background: downloading ? "#e5e7eb" : "#f97316", color: downloading ? "#999" : "#fff",
            border: "none", borderRadius: "8px", padding: "6px 18px",
            cursor: downloading ? "not-allowed" : "pointer", fontWeight: 600,
            display: "flex", alignItems: "center", gap: "6px",
          }}
        >
          {downloading ? (
            <>
              <svg style={{ animation: "spin 1s linear infinite" }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12a9 9 0 11-6.219-8.56" />
              </svg>
              Generating…
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 15V3m0 12l-4-4m4 4l4-4" /><rect x="3" y="17" width="18" height="4" rx="1" />
              </svg>
              Export PDF
            </>
          )}
        </button>
        <button
          onClick={() => window.close()}
          style={{ fontFamily: "system-ui, sans-serif", fontSize: "13px", background: "#e5e7eb", color: "#333", border: "none", borderRadius: "8px", padding: "6px 14px", cursor: "pointer" }}
        >
          Close
        </button>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
