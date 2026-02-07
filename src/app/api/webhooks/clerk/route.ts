import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

// Clerk webhook secret from environment variable
const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

export async function POST(request: Request) {
  if (!WEBHOOK_SECRET) {
    console.error("Missing CLERK_WEBHOOK_SECRET environment variable");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  // Get the headers (Next.js 15+ returns a Promise)
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json(
      { error: "Error occurred -- no svix headers" },
      { status: 400 }
    );
  }

  // Get the body
  const payload = await request.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);

  type ClerkWebhookEvent = {
    type: string;
    data: {
      id?: string;
      primary_email_address_id?: string;
      email_addresses?: Array<{ id: string; email_address?: string }>;
    };
  };

  let evt: ClerkWebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as ClerkWebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return NextResponse.json(
      { error: "Error occurred -- webhook verification failed" },
      { status: 400 }
    );
  }

  const eventType = evt.type;

  try {
    if (eventType === "user.created") {
      const clerkUserId = evt.data.id;
      let email: string | null = null;
      if (evt.data.email_addresses && Array.isArray(evt.data.email_addresses)) {
        const primaryEmail = evt.data.email_addresses.find(
          (e) => e.id === evt.data.primary_email_address_id
        );
        email = primaryEmail?.email_address ?? null;
      }

      if (!clerkUserId) {
        return NextResponse.json(
          { error: "Missing user ID in webhook payload" },
          { status: 400 }
        );
      }

      await prisma.user.upsert({
        where: { clerkUserId },
        update: { email },
        create: {
          clerkUserId,
          email,
          accountType: "individual",
          role: "user",
        },
      });

      return NextResponse.json({
        success: true,
        message: `User ${clerkUserId} upserted successfully`,
      });
    }

    if (eventType === "user.deleted") {
      const clerkUserId = evt.data.id;
      if (!clerkUserId) {
        return NextResponse.json(
          { error: "Missing user ID in webhook payload" },
          { status: 400 }
        );
      }
      // TODO: prefer soft delete when User.deletedAt exists; for now hard-delete
      await prisma.user.deleteMany({
        where: { clerkUserId },
      });
      return NextResponse.json({
        success: true,
        message: `User ${clerkUserId} deleted successfully`,
      });
    }

    if (eventType === "user.updated") {
      const clerkUserId = evt.data.id;
      const email =
        evt.data.email_addresses?.find(
          (e) => e.id === evt.data.primary_email_address_id
        )?.email_address ?? null;

      if (!clerkUserId) {
        return NextResponse.json(
          { error: "Missing user ID in webhook payload" },
          { status: 400 }
        );
      }

      const user = await prisma.user.findUnique({
        where: { clerkUserId },
      });
      if (user && user.email !== email) {
        await prisma.user.update({
          where: { clerkUserId },
          data: { email },
        });
      }

      return NextResponse.json({
        success: true,
        message: `User ${clerkUserId} updated successfully`,
      });
    }

    // Handle other webhook events
    console.log(`ℹ️  Unhandled event type: ${eventType}`);
    return NextResponse.json({ received: true, eventType });
  } catch (error) {
    console.error("Error handling webhook:", error);
    return NextResponse.json(
      {
        error: "Error processing webhook",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
