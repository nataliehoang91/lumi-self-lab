# Debug Webhook Issues

## 🔍 If User Table is Still Empty After Creating User

### Step 1: Check Terminal Logs

Look for these logs in your terminal where `npm run dev` is running:

```
📥 Webhook received: user.created
📋 Full webhook payload (data only): { ... }
✅ User created: user_xxxxx
```

**If you don't see these logs:**
- Webhook isn't reaching your server
- Check ngrok is running
- Check webhook URL in Clerk Dashboard

### Step 2: Check for Errors

Look for error messages in terminal:
- `❌ Database error creating user:` - Database issue
- `Error verifying webhook:` - Webhook secret mismatch
- `Missing CLERK_WEBHOOK_SECRET` - Environment variable not set

### Step 3: Check ngrok Inspector

Open `http://localhost:4040` while ngrok is running:

1. Go to the **"Requests"** tab
2. Look for requests to `/api/webhooks/clerk`
3. Click on the request
4. Check:
   - **Request Headers**: Should have `svix-id`, `svix-timestamp`, `svix-signature`
   - **Request Body**: Should show full webhook payload
   - **Response**: Check status code and response body

### Step 4: Check Clerk Webhook Logs

In Clerk Dashboard → Webhooks → Your Endpoint → **"Logs"** tab:

1. Find the `user.created` event
2. Click on it to see details
3. Check:
   - **Status**: Should be "Succeeded" (green)
   - **Response**: Should show success message
   - **Request**: Check if webhook was sent correctly

**If status is "Failed" (red):**
- Click on the failed webhook
- Check the error message
- Common issues:
  - Webhook verification failed (check `CLERK_WEBHOOK_SECRET`)
  - Endpoint not reachable (check ngrok)
  - Server error (check terminal logs)

### Step 5: Verify Database Connection

Test if Prisma can connect to database:

```bash
npx prisma studio
```

If this opens without errors, database connection is OK.

### Step 6: Check Environment Variables

Make sure `.env.local` has:

```bash
DATABASE_URL=postgresql://...
CLERK_WEBHOOK_SECRET=whsec_xxxxx
```

**Verify in terminal:**
```bash
# Check if variables are loaded (don't commit this!)
cat .env.local | grep CLERK_WEBHOOK_SECRET
```

### Step 7: Manual Test

Try creating a user manually to test database:

```bash
# Via Prisma Studio
# Or via API:
curl -X POST http://localhost:3005/api/users/me
```

---

## 🐛 Common Issues & Solutions

### Issue 1: Webhook Not Received

**Symptoms:**
- No logs in terminal
- Clerk shows webhook as "Failed"

**Solutions:**
1. Check ngrok is running: `ngrok http 3005`
2. Verify webhook URL in Clerk: Should be `https://YOUR_NGROK_URL/api/webhooks/clerk`
3. Restart dev server: `npm run dev`

### Issue 2: Webhook Verification Failed

**Symptoms:**
- Terminal shows: `Error verifying webhook`
- Clerk shows webhook as "Failed"

**Solutions:**
1. Check `CLERK_WEBHOOK_SECRET` matches Clerk Dashboard
2. Restart dev server after changing `.env.local`
3. Make sure secret starts with `whsec_`

### Issue 3: Database Error

**Symptoms:**
- Terminal shows: `❌ Database error creating user:`
- Webhook received but user not created

**Solutions:**
1. Check `DATABASE_URL` is correct in `.env.local`
2. Test database connection: `npx prisma studio`
3. Check Prisma client is generated: `npx prisma generate`
4. Check database schema is migrated: `npx prisma migrate status`

### Issue 4: User Already Exists

**Symptoms:**
- Terminal shows: `ℹ️  User already exists: user_xxxxx`
- User not in database (confusing!)

**Solutions:**
1. User might have been created via `/api/users/me` first
2. Check if user exists: `npx prisma studio` → User table
3. If empty, webhook might have failed silently before

---

## 🧪 Quick Debug Test

Run this to see what's happening:

```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Start ngrok
ngrok http 3005

# Terminal 3: Watch ngrok inspector
open http://localhost:4040

# Then create a user in Clerk Dashboard
# Watch all 3 terminals for activity
```

---

## 📝 Expected Flow (Working)

1. ✅ User created in Clerk Dashboard
2. ✅ Clerk sends webhook to ngrok URL
3. ✅ ngrok forwards to `localhost:3005/api/webhooks/clerk`
4. ✅ Webhook verified (svix signature)
5. ✅ `user.created` event handled
6. ✅ User created in database
7. ✅ Success response sent back
8. ✅ Terminal shows success logs
9. ✅ User appears in Prisma Studio

---

## 💡 Debug Tips

1. **Add more logging**: The webhook handler now logs the full payload - check terminal for this

2. **Check ngrok inspector**: `http://localhost:4040` shows all requests in real-time

3. **Test with manual webhook**: Use Clerk's "Test Webhook" feature to send test events

4. **Check database directly**: `npx prisma studio` to see if user exists

5. **Verify Prisma schema**: Make sure `email` field exists in User model (it should now!)
