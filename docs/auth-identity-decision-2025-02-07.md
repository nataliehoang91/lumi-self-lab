# Auth & Identity Decision — 2025-02-07

This document records the final decisions for authentication and identity in Lumi Self-Lab. It clarifies that there is **one sign-in flow**, that **organization is a context not an identity**, and where organization selection happens.

---

## 1. Identity model: one email = one user

- **One email = one user.** Each Clerk user (and each `User` in our database) corresponds to a single identity.
- Users always sign in **as an individual**. There is no separate “organization account” or “org identity.”
- Sign-up may capture intent (e.g. “Personal use” vs “For my team / organization”), but **both result in the same user account**. Intent may later drive creating an organization and assigning the user `org_admin`; it does not create a different login identity.

---

## 2. Organization is a context, not an identity

- **Organization is a workspace/context**, not a login identity.
- A user may belong to **multiple organizations** (via `OrganisationMember`).
- A user may have different **roles per org** (e.g. `org_admin` in one, `member` in another). Roles are scoped to the org context.
- **Personal is the default context.** After sign-in, the user lands in the personal context (/dashboard). They enter organization context only when they go to **/org** and choose or open an org.

---

## 3. Sign-in and sign-up UX (final decisions)

| Decision | Implementation |
|----------|----------------|
| **Single sign-in flow** | There is only one sign-in page: **/sign-in**. No separate “sign in as organization” or “org sign-in” page. |
| **No organization chooser at sign-in** | The Clerk organization chooser must **not** appear on /sign-in. Organization selection never happens during sign-in. If Clerk Organizations are enabled in the Clerk Dashboard, ensure “Allow Personal Accounts” is on and/or that the “choose organization” session task is not forced at sign-in. |
| **Redirect after sign-in** | After successful sign-in, users are **always** redirected to **/dashboard** (personal default). This is set via `forceRedirectUrl` and `fallbackRedirectUrl` on the `<SignIn />` component. |
| **Redirect after sign-up** | After sign-up, users are redirected to **/dashboard** as well (`forceRedirectUrl` / `fallbackRedirectUrl` on `<SignUp />`). Same identity; personal default. |
| **Sign-up intent** | Sign-up may offer options such as “Personal use” and “For my team / organization.” Both create the **same** user account. “For my team” may later create an organization and assign the user `org_admin`; it does not change how they sign in. |

---

## 4. Where organization selection happens: /org

- Organization selection and switching happen **inside the app**, only on **/org** routes.
- Users reach org context by navigating to **/org** (org list/switcher) and then to **/org/[orgId]** (and optionally **/org/[orgId]/admin** if they are org_admin).
- Middleware and sign-in **do not** redirect to /org by default. Default post–sign-in redirect is **/dashboard**.

---

## 5. Explicit statement: there is no org sign-in

- **There is no “sign in as organization.”**
- **There is no organization chooser during sign-in.**
- **There is no separate org sign-in page.**
- Identity is always the individual (one email = one user). Organization is a context entered only via /org.

---

## 6. Implementation summary

| Location | Behavior |
|----------|----------|
| **/sign-in** | Single sign-in page. `forceRedirectUrl="/dashboard"`, `fallbackRedirectUrl="/dashboard"`. No org selection. |
| **/sign-up** | Single sign-up page. Post–sign-up redirect to `/dashboard`. Same user account regardless of intent. |
| **Middleware (proxy.ts)** | Does not redirect authenticated users to /org. Only enforces “authenticated vs not” and public-route list. |
| **LoginForm / sign-in-form / AlreadyLoginRedirect** | Default redirect is `/dashboard` (not /create or /org). |

---

## 7. Why “Welcome Back” might show an organization form (and how to fix it)

**What you might see:** After entering email/password on `/sign-in`, Clerk shows a “Welcome Back” screen that asks for **Logo** and **Name** (placeholder “My Organization”) with a **Continue** button. The user is already signed in (e.g. “Signed in as …@gmail.com”) but cannot proceed without filling organization details.

**Cause:** This is **Clerk’s Organizations** feature. When Organizations are enabled in the Clerk Dashboard and **“Allow personal accounts”** is **off** (the default for many apps), Clerk inserts a **required** “create organization” step after sign-in. That step runs *before* our `forceRedirectUrl="/dashboard"`, so users never reach the app until they create an org in Clerk.

**Fix (Clerk Dashboard, not code):**

1. Open **[Clerk Dashboard](https://dashboard.clerk.com)** → your application.
2. Go to **Configure → Organizations** (or **Organization settings**).
3. Turn **on** **“Allow personal accounts”** (or **“Enable personal account”**).
4. Save.

With this on, users can use a **personal account** and are not forced to create or choose an organization during sign-in. They land on `/dashboard` as intended; organization context is only entered later via `/org` inside the app.

**Our app does not use Clerk Organizations for identity.** We use our own `Organisation` and `OrganisationMember` in the database. Clerk’s org step must not be required so that sign-in stays personal-only.

---

*Auth & identity consolidation completed 2025-02-07. No new auth flows; clarification and alignment only.*
