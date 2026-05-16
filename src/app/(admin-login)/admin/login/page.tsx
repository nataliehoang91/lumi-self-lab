import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Shield } from "lucide-react";
import { verifyAdminSessionToken, COOKIE_NAME } from "@/lib/admin-auth";
import { AdminLoginForm } from "./AdminLoginForm";

export default async function AdminLoginPage() {
  // Already have a valid session → go straight in
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (token && verifyAdminSessionToken(token)) {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-muted-foreground">lumi · self</p>
          <h1 className="mt-1 text-xl font-semibold text-foreground">Admin Portal</h1>
        </div>

        <AdminLoginForm />

        <p className="mt-4 text-center text-[10px] text-muted-foreground">
          Restricted access · lumi self admin
        </p>
      </div>
    </div>
  );
}
