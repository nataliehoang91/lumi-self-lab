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

  // Create a new Svix instance with your secret
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: any;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as any;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return NextResponse.json(
      { error: "Error occurred -- webhook verification failed" },
      { status: 400 }
    );
  }

  // Handle the webhook event
  const eventType = evt.type;
  console.log(`📥 Webhook received: ${eventType}`);
  console.log(
    `📋 Full webhook payload (data only):`,
    JSON.stringify(evt.data, null, 2)
  );

  try {
    if (eventType === "user.created") {
      // Handle user creation
      const clerkUserId = evt.data.id;

      // Extract email from webhook payload
      // Clerk webhook payload structure:
      // evt.data.email_addresses[] - array of email addresses
      // evt.data.primary_email_address_id - ID of primary email
      let email = null;

      if (evt.data.email_addresses && Array.isArray(evt.data.email_addresses)) {
        const primaryEmailId = evt.data.primary_email_address_id;
        const primaryEmail = evt.data.email_addresses.find(
          (e: any) => e.id === primaryEmailId
        );
        email = primaryEmail?.email_address || null;
      }

      console.log(
        `📋 Webhook payload data:`,
        JSON.stringify(
          {
            id: clerkUserId,
            email_addresses_count: evt.data.email_addresses?.length || 0,
            primary_email_address_id: evt.data.primary_email_address_id,
            extracted_email: email,
          },
          null,
          2
        )
      );

      if (!clerkUserId) {
        console.error(`❌ Missing user ID in webhook payload`);
        return NextResponse.json(
          { error: "Missing user ID in webhook payload" },
          { status: 400 }
        );
      }

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { clerkUserId },
      });

      if (existingUser) {
        console.log(`ℹ️  User already exists: ${clerkUserId}`);
        return NextResponse.json({
          success: true,
          message: `User ${clerkUserId} already exists`,
        });
      }

      // Create user in database (default to individual account)
      try {
        const newUser = await prisma.user.create({
          data: {
            clerkUserId,
            email,
            accountType: "individual",
          },
        });

        console.log(`✅ User created successfully: ${clerkUserId}`);
        console.log(`📧 Email: ${email || "No email"}`);
        console.log(`👤 Account type: individual (default)`);
        console.log(`🆔 Database ID: ${newUser.id}`);

        return NextResponse.json({
          success: true,
          message: `User ${clerkUserId} created successfully`,
        });
      } catch (dbError) {
        console.error(`❌ Database error creating user:`, dbError);
        throw dbError;
      }
    }

    if (eventType === "user.deleted") {
      // Handle user deletion
      const clerkUserId = evt.data.id;

      if (!clerkUserId) {
        return NextResponse.json(
          { error: "Missing user ID in webhook payload" },
          { status: 400 }
        );
      }

      // Delete user from database (cascade will handle related records)
      await prisma.user.deleteMany({
        where: { clerkUserId },
      });

      console.log(`✅ User deleted: ${clerkUserId}`);
      console.log(
        `🗑️  Deleted user from database and related records (cascade)`
      );

      return NextResponse.json({
        success: true,
        message: `User ${clerkUserId} deleted successfully`,
      });
    }

    if (eventType === "user.updated") {
      // Handle user update (e.g., email change)
      const clerkUserId = evt.data.id;
      const email =
        evt.data.email_addresses?.find(
          (e: any) => e.id === evt.data.primary_email_address_id
        )?.email_address || null;

      if (!clerkUserId) {
        return NextResponse.json(
          { error: "Missing user ID in webhook payload" },
          { status: 400 }
        );
      }

      // Update user email if changed
      const user = await prisma.user.findUnique({
        where: { clerkUserId },
      });

      if (user && user.email !== email) {
        await prisma.user.update({
          where: { clerkUserId },
          data: { email },
        });
        console.log(`✅ User updated: ${clerkUserId}`);
        console.log(`📧 Email updated: ${email || "No email"}`);
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
