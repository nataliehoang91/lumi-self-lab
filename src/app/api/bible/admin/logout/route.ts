import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "is_admin";

export async function POST(request: NextRequest) {
  const res = NextResponse.redirect(new URL("/bible/admin/login", request.nextUrl.origin));
  res.cookies.set(COOKIE_NAME, "", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 0,
  });
  return res;
}
