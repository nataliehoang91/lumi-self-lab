# Testing User Creation from Clerk

## 🎯 Goal

Test that when a user signs up in Clerk, they are automatically added to your `User` table via webhook.

---

## 📋 Prerequisites

1. ✅ Webhook endpoint configured (see `WEBHOOK_LOCAL_TESTING.md`)
2. ✅ `user.created` event selected in Clerk Dashboard
3. ✅ `CLERK_WEBHOOK_SECRET` set in `.env.local`
4. ✅ ngrok running (for local testing)

---

## 🧪 Test Steps

### Method 1: Create User via Clerk Dashboard (Easiest)

1. **Go to Clerk Dashboard → Users**
2. Click **"+ Add User"** or **"Create User"**
3. Fill in:
   - Email: `test@example.com`
   - Password: (set a password)
4. Click **"Create"**

5. **Check Your Terminal:**
   ```
   📥 Webhook received: user.created
   ✅ User created: user_xxxxx
   📧 Email: test@example.com
   👤 Account type: individual (default)
   ```

6. **Check Your Database:**
   - Open Prisma Studio: `npx prisma studio`
   - Go to `User` table
   - You should see the new user with:
     - `clerkUserId`: `user_xxxxx`
     - `email`: `test@example.com`
     - `accountType`: `individual`

### Method 2: Sign Up via Your App

1. **Start your app:**
   ```bash
   npm run dev
   ```

2. **Start ngrok:**
   ```bash
   ngrok http 3005
   ```

3. **Go to your sign-up page:**
   - `http://localhost:3005/sign-up` (or your sign-up route)

4. **Create a new account:**
   - Fill in email and password
   - Complete sign-up

5. **Check Terminal:**
   - Should see webhook received
   - User created in database

6. **Verify in Database:**
   - Check Prisma Studio or database directly

### Method 3: Test Webhook from Clerk Dashboard

1. **Go to Clerk Dashboard → Webhooks → Your Endpoint**
2. Click **"Test Webhook"** tab
3. Select event: **`user.created`**
4. Click **"Send Test Event"**

5. **Check Terminal:**
   ```
   📥 Webhook received: user.created
   ✅ User created: user_test_xxxxx
   ```

6. **Check Database:**
   - User should be created with test data

---

## 🔍 Verification Checklist

After creating a user, verify:

- [ ] Webhook received in terminal logs
- [ ] User appears in `User` table
- [ ] `clerkUserId` matches Clerk user ID
- [ ] `email` is set correctly
- [ ] `accountType` is `"individual"` (default)
- [ ] `createdAt` timestamp is set

---

## 🐛 Troubleshooting

### Webhook Not Received

1. **Check ngrok is running:**
   ```bash
   # Should show active tunnel
   ngrok http 3005
   ```

2. **Check webhook URL in Clerk:**
   - Should be: `https://YOUR_NGROK_URL/api/webhooks/clerk`
   - Make sure it's HTTPS (not HTTP)

3. **Check webhook secret:**
   ```bash
   # In .env.local
   CLERK_WEBHOOK_SECRET=whsec_xxxxx
   ```

4. **Check Clerk Dashboard → Webhooks → Logs:**
   - See if webhook was sent
   - Check for errors

### User Not Created in Database

1. **Check webhook logs:**
   - Look for errors in terminal
   - Check if webhook verification failed

2. **Check database connection:**
   ```bash
   npx prisma studio
   # Should open without errors
   ```

3. **Check Prisma client:**
   ```bash
   npx prisma generate
   ```

4. **Check webhook handler:**
   - Make sure `user.created` event is handled
   - Check console logs for errors

### User Already Exists Error

If you see "User already exists":
- This is normal if user was created via `/api/users/me` first
- Webhook will skip creation if user exists
- This prevents duplicate users

---

## 📊 Expected Database Record

After successful webhook, `User` table should have:

```json
{
  "id": "cmxxxxx",
  "clerkUserId": "user_xxxxx",
  "email": "test@example.com",
  "accountType": "individual",
  "upgradedAt": null,
  "createdAt": "2026-01-18T...",
  "updatedAt": "2026-01-18T..."
}
```

---

## 🔄 Testing Flow

```
1. User signs up in Clerk
   ↓
2. Clerk sends webhook to /api/webhooks/clerk
   ↓
3. Webhook verified (svix signature)
   ↓
4. user.created event handled
   ↓
5. User created in database
   ↓
6. Console logs show success
   ↓
7. User appears in User table
```

---

## 💡 Pro Tips

1. **Use Prisma Studio for quick checks:**
   ```bash
   npx prisma studio
   # Opens at http://localhost:5555
   ```

2. **Watch ngrok inspector:**
   - Open `http://localhost:4040`
   - See webhook payload in real-time

3. **Check Clerk webhook logs:**
   - Clerk Dashboard → Webhooks → Your Endpoint → Logs
   - See all webhook attempts and responses

4. **Test with different emails:**
   - Create multiple test users
   - Verify all are created correctly

---

## ✅ Success Criteria

You'll know it's working when:

1. ✅ Creating a user in Clerk → User appears in database
2. ✅ Terminal shows webhook received and user created
3. ✅ No errors in webhook logs
4. ✅ User record has correct `clerkUserId` and `email`
