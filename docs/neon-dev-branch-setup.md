# Neon development branch setup

Use a separate Neon branch for local development so production data stays untouched.

## 1. Create the branch (done in Neon dashboard)

- In Neon: **Branches** → **Create child branch** from `main` (e.g. name it `development`).
- Copy the **connection string** from the modal (use “Connection pooling” on for pooler URL).

## 2. Point local app at the dev branch

In `.env` or `.env.local` (do **not** commit this file):

```env
# Development branch (Neon) – replace with your branch’s connection string
DATABASE_URL="postgresql://neondb_owner:YOUR_PASSWORD@ep-xxx-pooler.ap-southeast-2.aws.neon.tech/neondb?sslmode=require"
```

- Use the **pooler** URL (host contains `-pooler`) for serverless/Next.js.
- Keep production `DATABASE_URL` in Vercel (or similar) pointing at your **main** branch.

## 3. Apply migrations to the dev branch

After setting `DATABASE_URL` to the dev-branch URL:

```bash
npx prisma migrate deploy
```

Then generate the client if needed:

```bash
npx prisma generate
```

## 4. Optional: seed or copy data

- Run any seed script, or
- Use Neon’s branch-from-main so the dev branch starts with a copy of main’s data (then run migrations on that branch as above).

## Security

- Never commit `.env` or `.env.local` (they are in `.gitignore`).
- Rotate the branch password in Neon **Roles** if it’s ever exposed.
- The dev branch in the screenshot expires; create a new branch or extend before expiry if needed.
