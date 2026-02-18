import React from "react";
import { AdminLoginForm } from "@/components/Bible/Admin/AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100 p-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-md">
        <h1 className="mb-4 text-center text-xl font-semibold text-stone-800">Admin Login</h1>
        <AdminLoginForm />
      </div>
    </div>
  );
}
