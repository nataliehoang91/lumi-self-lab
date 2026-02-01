import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

/**
 * POST /api/waitlist
 * Creates a Clerk waitlist entry (email). Requires Waitlist to be enabled in Clerk Dashboard.
 * Entries appear in Dashboard → Waitlist.
 * Route is public (see proxy.ts) so unauthenticated users can submit.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = typeof body?.email === "string" ? body.email.trim() : null;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const client = await clerkClient();
    await client.waitlistEntries.create({
      emailAddress: email,
      notify: false,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Waitlist API error:", error);
    const message = error instanceof Error ? error.message : "Failed to join waitlist";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
