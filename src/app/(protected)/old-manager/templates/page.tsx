import { Suspense } from "react";
import ManagerTemplatesContent from "@/components/Templates/template-contents";

export default function ManagerTemplatesPage() {
  return (
    <Suspense fallback={null}>
      <ManagerTemplatesContent />
    </Suspense>
  );
}
