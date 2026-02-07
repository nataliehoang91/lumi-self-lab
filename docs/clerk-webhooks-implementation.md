# Clerk webhooks – implementation guide

Based on [Clerk webhooks overview](https://clerk.com/docs/guides/development/webhooks/overview) and [Syncing Clerk data with webhooks](https://clerk.com/docs/guides/development/webhooks/syncing).

---

## How Clerk webhooks work

- **Event-driven**: Clerk sends an HTTP `POST` to your endpoint when events occur (e.g. `user.created`, `user.updated`, `user.deleted`). No polling.
- **Async**: Delivery is not guaranteed to be immediate. Use webhooks for syncing DB or notifications, not for blocking the sign-up flow.
- **Signed**: Requests are signed by [Svix](https://www.svix.com/). You **must** verify the signature so only Clerk can trigger your handler.
- **Retries**: On 4xx/5xx or no response, Clerk/Svix retries. Return **2xx** only when the event is handled successfully so retries stop.

---

## Payload shape

Each request body is JSON with:

- **`type`** – Event type (e.g. `user.created`, `user.updated`, `user.deleted`).
- **`data`** – Payload for that event (e.g. for `user.*` it’s the [User object](https://clerk.com/docs/reference/javascript/user)).
- **`object`** – Always `"event"`.
- **`timestamp`** – When the event happened (ms).
- **`instance_id`** – Your Clerk instance.

Treat the body as untrusted until **after** signature verification.

---

## Implementation checklist

### 1. Clerk Dashboard

1. Go to [Webhooks](https://dashboard.clerk.com/~/webhooks) → **Add Endpoint**.
2. **Endpoint URL**:
   - **Local**: ngrok URL + path, e.g. `https://your-subdomain.ngrok-free.app/api/webhooks/clerk`.
   - **Production**: Your app URL, e.g. `https://yourdomain.com/api/webhooks/clerk`.
3. **Subscribe to events**: At least `user.created`, `user.updated`, `user.deleted` for DB sync.
4. Copy the **Signing Secret** (starts with `whsec_`).

### 2. Environment variable

In `.env` (local) and in your host (e.g. Vercel) for production:

```env
CLERK_WEBHOOK_SECRET=whsec_xxxxx
```

Clerk docs sometimes call this `CLERK_WEBHOOK_SIGNING_SECRET`; our app uses `CLERK_WEBHOOK_SECRET`. Either name works if your code reads the same variable.

### 3. Webhook route must be public

Webhooks are sent by Clerk’s servers (no user session). If your middleware requires auth for `/api/*`, the webhook would get 401.

- In this app, **`/api/webhooks(.*)`** is in the public list in `src/proxy.ts`, so the route is reachable without auth.
- Verification is done inside the route using the **signing secret**, not cookies/session.

### 4. Verify the request

**Option A – Clerk helper (recommended in docs)**  
Use Clerk’s `verifyWebhook()` so you don’t handle raw body or headers yourself:

```ts
import { verifyWebhook } from "@clerk/nextjs/webhooks";

export async function POST(req: Request) {
  try {
    const evt = await verifyWebhook(req); // uses CLERK_WEBHOOK_SIGNING_SECRET by default
    if (evt.type === "user.created") {
      // evt.data is typed; sync to DB
    }
    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return new Response("Bad request", { status: 400 });
  }
}
```

**Option B – Svix directly (what this app does)**  
We use the `svix` package and read `svix-id`, `svix-timestamp`, `svix-signature` headers and the raw body, then call `wh.verify(body, headers)`. That is equivalent to signature verification; just keep the secret in `CLERK_WEBHOOK_SECRET` (or `CLERK_WEBHOOK_SIGNING_SECRET` if you switch to `verifyWebhook`).

### 5. Handle events and sync DB

- **`user.created`**: Create a row in your `User` table (e.g. `clerkUserId`, `email` from `evt.data`). Idempotency: check if user already exists (e.g. by `clerkUserId`) to avoid duplicates on retries.
- **`user.updated`**: Update your user row (e.g. email) when Clerk user changes.
- **`user.deleted`**: Delete the user row (or soft-delete) so your DB matches Clerk.

Return **200** only after DB write succeeds so Clerk marks the attempt as successful and doesn’t keep retrying.

### 6. Local testing with ngrok

1. Run your app (e.g. `npm run dev`).
2. Run ngrok: `ngrok http 3005` (or your dev port).
3. In Clerk Dashboard, set the endpoint URL to `https://<ngrok-host>/api/webhooks/clerk`.
4. Use **Testing** tab → **Send Example** for `user.created` (or create a real user) and confirm your handler runs and DB updates.

### 7. Production

1. Add a **production** webhook endpoint in the Clerk Dashboard with URL `https://your-production-domain.com/api/webhooks/clerk`.
2. Set the **Signing Secret** for that endpoint in your production env (e.g. Vercel) as `CLERK_WEBHOOK_SECRET` (or `CLERK_WEBHOOK_SIGNING_SECRET`).
3. Redeploy so the route and env are live.

---

## This app’s implementation

- **Route**: `src/app/api/webhooks/clerk/route.ts` (POST).
- **Public**: `/api/webhooks(.*)` is public in `src/proxy.ts`.
- **Secret**: `CLERK_WEBHOOK_SECRET` in `.env` / Vercel.
- **Verification**: Svix `Webhook` with the secret; we verify using `svix-id`, `svix-timestamp`, `svix-signature` and the JSON body.
- **Events**: `user.created` → create User in Prisma; `user.updated` → update email; `user.deleted` → delete User. Other events return `{ received: true, eventType }` with 200.

For more detail, see [Clerk webhooks overview](https://clerk.com/docs/guides/development/webhooks/overview) and [syncing guide](https://clerk.com/docs/guides/development/webhooks/syncing).
