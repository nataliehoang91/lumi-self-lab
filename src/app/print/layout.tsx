import type { ReactNode } from "react";

export default function PrintLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      {children}
    </div>
  );
}
