# Testing Clerk Webhooks Locally

## 🚀 Quick Setup with ngrok

### 1. Install ngrok

**Option A: Via npm (recommended)**

```bash
npm install -g ngrok
```

**Option B: Via Homebrew (macOS)**

```bash
brew install ngrok
```

**Option C: Download from [ngrok.com](https://ngrok.com/download)**

### 2. Get ngrok Auth Token (Free)

1. Sign up at [ngrok.com](https://dashboard.ngrok.com/signup) (free account)
2. Go to [Auth Token](https://dashboard.ngrok.com/get-started/your-authtoken)
3. Copy your auth token
4. Run: `ngrok config add-authtoken YOUR_TOKEN_HERE`

### 3. Start Your Local Server

```bash
npm run dev
```

Your app should be running on `http://localhost:3005`

### 4. Start ngrok Tunnel

In a **new terminal window**:

```bash
ngrok http 3005
```

You'll see output like:

```
Forwarding   https://abc123.ngrok-free.app -> http://localhost:3005
```

**Copy the HTTPS URL** (e.g., `https://abc123.ngrok-free.app`)

### 5. Configure Clerk Webhook

1. Go to [Clerk Dashboard → Webhooks](https://dashboard.clerk.com/webhooks)
2. Click **"+ Add Endpoint"**
3. Set endpoint URL: `https://YOUR_NGROK_URL/api/webhooks/clerk`
   - Example: `https://abc123.ngrok-free.app/api/webhooks/clerk`
4. Select events:
   - ✅ `user.deleted` (for user cleanup)
   - ✅ `user.created` (optional, for testing)
   - ✅ `user.updated` (optional, for testing)
5. Copy the **Signing Secret** (starts with `whsec_`)
6. Add to `.env.local`:
   ```bash
   CLERK_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
   ```

### 6. Test the Webhook

**Option A: Use Clerk's Test Webhook**

1. In Clerk Dashboard → Webhooks → Your Endpoint
2. Click **"Test Webhook"**
3. Select an event (e.g., `user.deleted`)
4. Click **"Send Test Event"**
5. Check your terminal/logs to see if webhook was received

**Option B: Delete a Test User**

1. Create a test user in Clerk
2. Note their `clerkUserId`
3. Delete the user in Clerk Dashboard
4. Check your database - user should be deleted automatically

### 7. View Webhook Logs

**In Clerk Dashboard:**

- Go to Webhooks → Your Endpoint → **"Logs"** tab
- See all webhook requests (successful and failed)

**In Your Terminal:**

- Check your Next.js dev server logs
- Look for webhook processing messages

**In ngrok Dashboard:**

- Go to [ngrok Dashboard → Inspection](http://localhost:4040)
- See all HTTP requests including webhook payloads

---

## 🔍 Debugging Tips

### Check Webhook Secret

Make sure `CLERK_WEBHOOK_SECRET` is set correctly:

```bash
# In your .env.local
CLERK_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

### Verify Webhook Endpoint

Test that your endpoint is reachable:

```bash
curl https://YOUR_NGROK_URL/api/webhooks/clerk
```

Should return error (expected - webhook needs POST with proper headers)

### Check Webhook Verification

If webhook fails verification, check:

1. `CLERK_WEBHOOK_SECRET` matches Clerk Dashboard
2. `svix` package is installed: `npm install svix`
3. Webhook headers are being received correctly

### View ngrok Traffic

ngrok provides a web interface to inspect traffic:

1. Keep ngrok running
2. Open: `http://localhost:4040`
3. See all requests including:
   - Request headers
   - Request body (webhook payload)
   - Response status

---

## 🔄 Alternative: Clerk CLI (Coming Soon)

Clerk might have a CLI for testing webhooks locally. Check their documentation for the latest options.

---

## 📝 Testing Checklist

- [ ] ngrok installed and authenticated
- [ ] Local server running on `http://localhost:3005`
- [ ] ngrok tunnel active (`ngrok http 3005`)
- [ ] Webhook endpoint configured in Clerk Dashboard
- [ ] `CLERK_WEBHOOK_SECRET` added to `.env.local`
- [ ] Test webhook sent from Clerk Dashboard
- [ ] Check logs/terminal for webhook processing
- [ ] Verify database changes (if applicable)

---

## 🎯 Quick Test Script

After setup, you can test with:

```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Start ngrok
ngrok http 3005

# Then:
# 1. Copy ngrok HTTPS URL
# 2. Add to Clerk webhook endpoint
# 3. Send test webhook from Clerk Dashboard
# 4. Check terminal/logs for success
```

---

## 🚨 Important Notes

1. **ngrok URLs Change**: Free ngrok URLs change each time you restart ngrok. You'll need to update the Clerk webhook endpoint URL each time.

2. **ngrok Pro (Optional)**: For stable URLs, consider ngrok Pro (paid plan) which provides fixed domain names.

3. **Development Only**: Never use ngrok URLs in production. Use your actual domain in production.

4. **Security**: Always verify webhook signatures using `svix` - the webhook handler already does this.
