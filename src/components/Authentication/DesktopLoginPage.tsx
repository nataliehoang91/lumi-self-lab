"use client";

import { LoginForm } from "./LoginForm";

interface DesktopLoginPageProps {
  callbackUrl?: string;
}

export default function DesktopLoginPage({ callbackUrl }: DesktopLoginPageProps) {
  return <LoginForm callbackUrl={callbackUrl} />;
}
