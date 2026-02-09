# Phase 1 — Individual experiment feature: current state (2026-02-07)

**Scope:** Read and audit only. No code changes. Focus on personal experiments (clerkUserId); organisation/teams/roles/invites are out of scope.

---

## 1. High-level summary

### What the experiment feature can do TODAY (as-is)

- **Create experiment:** User can create an experiment via the creation form (title, whyMatters, hypothesis, durationDays, frequency, faithEnabled, scriptureNotes, custom fields). The main creation entry points are `/create` (split view with AI chat + form) and `/experiments/new` → “Personal” → “Manual” → `/experiments/new/create`. The form POSTs to `POST /api/experiments` with `status: "active"` (create flow sends active, not draft).
- **List experiments:** `/experiments` (server component) loads experiments by `clerkUserId` from Prisma, sorts active first, maps to UI shape (id, title, status, duration, frequency, daysCompleted, startDate, hypothesis). Client `ExperimentsList` filters by All / Active / Draft / Completed and shows Start / View Details.
- **View experiment:** `/experiments/[id]` loads experiment by id + clerkUserId, returns 404 if not owner. Detail page shows status, title, duration, frequency, progress (if active + started), whyMatters, hypothesis, faith block, field preview, org-linking placeholder, status dropdown (draft | active | completed), Start/Publish/Check-in/View Results, check-in history.
- **Check-in:** Check-in button is shown only when `status === "active"`, `startDate` is set, and `fields.length > 0`. User opens a dialog and submits date + notes + field responses to `POST /api/experiments/[id]/checkins`. API enforces one check-in per date (409 if duplicate date).
- **Update experiment:** PATCH updates title, whyMatters, hypothesis, durationDays, frequency, faithEnabled, scriptureNotes, status, startedAt, completedAt, and fields (upsert/delete). Ownership enforced; clerkUserId and organisationId are not accepted in body.
- **Delete experiment:** DELETE allowed for owner; Prisma cascade deletes fields and check-ins.

### What a user can realistically complete end-to-end

1. Sign in → go to `/create` or `/experiments` → New Experiment / Create.
2. Choose “Personal” (or “With an organisation” — UI present but Phase 1 ignores org).
3. Fill form (title, duration, frequency, fields, etc.) and submit → experiment created as **active** (not draft).
4. On list or detail, “Start” sets status to active and startedAt to today (if not already).
5. On detail, “Check-in” opens dialog; submit date + responses → check-in created.
6. Change status via dropdown (draft / active / completed); completed can set completedAt.
7. View check-in history on detail page.
8. Delete experiment from… **unclear / not found** — no Delete button found on detail or list in the audited UI; API supports DELETE.

So: create → start → check-in → change status → view history works. Delete is supported by API but no obvious UI path found.

---

## 2. Data model reality

### Experiment

- **Schema:** id, clerkUserId, title, whyMatters, hypothesis, durationDays, frequency (string), faithEnabled, scriptureNotes, status (draft | active | completed), organisationId (optional), createdAt, updatedAt, startedAt, completedAt. Relations: user, organisation, fields, checkIns.
- **Ownership:** Experiment is always owned by one user via clerkUserId. No org/manager access; APIs use `requireExperimentOwner(id, userId)` or `where: { clerkUserId: userId }`.
- **Reality:** organisationId is stored and optional; Phase 1 does not set or use it in the create/update flows. Status is stored and used in UI; API does not validate status transitions or block updates.

### ExperimentField

- **Schema:** id, experimentId, label, type (text | number | select | emoji | yesno), required, order, textType, minValue, maxValue, emojiCount, selectOptions. Cascade delete when experiment is deleted.
- **Reality:** All five types are supported in UI and API. Required is enforced in CheckInForm (client-side). API does not validate value ranges (min/max, emoji count, select option membership); any value is accepted.

### ExperimentCheckIn

- **Schema:** id, experimentId, clerkUserId, checkInDate, notes, aiSummary, createdAt. Responses relation.
- **Reality:** One check-in per experiment per calendar date is enforced in API by `findFirst` + 409 if exists. There is no DB unique on (experimentId, checkInDate); duplicate could occur under race. checkInDate is stored as DateTime; date comparison uses `new Date(checkInDate)` (see gaps).

### ExperimentFieldResponse

- **Schema:** checkInId, fieldId, responseText, responseNumber, responseBool, selectedOption, aiFeedback. Cascade delete when check-in or field is deleted.
- **Reality:** One response per field per check-in. API accepts whatever the client sends; no server-side validation against field type or constraints.

### Ownership rules

- **Enforced:** GET/PATCH/DELETE experiment and all sub-routes (fields, checkins) use `getAuthenticatedUserId()` then `requireExperimentOwner(experimentId, userId)` or equivalent. Only the owner can read/update/delete.
- **Not used:** Organisation, OrganisationMember, roles (org_admin, etc.) are not used for experiment access. Personal-only.

---

## 3. API reality

### GET /api/experiments

- **Enforces:** Auth (401 if no userId). Filter by clerkUserId. Optional query: status, search (title/whyMatters/hypothesis).
- **Returns:** Experiments with fields (ordered) and latest check-in (take: 1). Sorted active first, then by updatedAt desc.
- **Gaps:** No pagination. Search is case-insensitive contains; no limit on result size.

### POST /api/experiments

- **Enforces:** Auth. Required: title (string), durationDays (number), frequency (string). Optional: whyMatters, hypothesis, faithEnabled, scriptureNotes, status, fields. User upserted (clerkUserId, accountType "individual") before create. clerkUserId set from auth; organisationId not set.
- **Gaps:** frequency not validated (e.g. daily | every-2-days | weekly). status accepted as-is (default "draft" if omitted); create form sends "active". Field type and options (min/max, selectOptions, emojiCount) not validated. No server-side validation of field shape per type.

### GET /api/experiments/[id]

- **Enforces:** Auth; experiment must match id and clerkUserId. Returns 404 if not owner.
- **Returns:** Experiment with fields (ordered) and all checkIns (ordered by checkInDate desc) with responses and field.

### PATCH /api/experiments/[id]

- **Enforces:** Auth; requireExperimentOwner. Body: title, whyMatters, hypothesis, durationDays, frequency, faithEnabled, scriptureNotes, status, startedAt, completedAt, fields (upsert/delete by id). clerkUserId and organisationId explicitly not accepted.
- **Gaps:** status and startedAt/completedAt not validated (e.g. can set completed without completedAt). frequency and status not restricted to enum. Fields upsert: deleting fields not in body; no check that response data won’t reference removed fields (existing responses remain until check-in is edited).

### DELETE /api/experiments/[id]

- **Enforces:** Auth; requireExperimentOwner. Deletes experiment; Prisma cascade deletes fields and check-ins (and their responses).
- **Reality:** Works as intended. No soft delete.

### GET /api/experiments/[id]/checkins

- **Enforces:** Auth; requireExperimentOwner. Optional query: date (YYYY-MM-DD).
- **Gaps:** Date filter builds startOfDay/endOfDay with `new Date(dateFilter)` then setHours; setHours mutates the date object and timezone is server default (no explicit timezone). Duplicate check-in for same date is prevented in POST, not here.

### POST /api/experiments/[id]/checkins

- **Enforces:** Auth; requireExperimentOwner. Required: checkInDate. Rejects if check-in already exists for that date (findFirst + 409).
- **Gaps:** **Experiment status not checked** — API allows check-in for draft or completed experiments. Date: `new Date(checkInDate)` used for uniqueness; no normalization to a single “calendar day” timezone (e.g. UTC vs local can allow two entries for same user day in different zones). responses array not validated against experiment fields (fieldId, type, required, min/max, options).

### GET/PATCH/DELETE /api/experiments/[id]/checkins/[checkInId]

- **Enforces:** Auth; requireExperimentOwner(experimentId); check-in must match checkInId, experimentId, clerkUserId. PATCH/DELETE verify check-in exists and belong to user.
- **Gaps:** PATCH allows changing checkInDate (could create logical duplicate “same day” with another check-in if not normalized). No status check on experiment.

### GET/POST /api/experiments/[id]/fields and GET/PATCH/DELETE /api/experiments/[id]/fields/[fieldId]

- **Enforces:** Auth; requireExperimentOwner. POST requires label, type, order. PATCH/DELETE verify field belongs to experiment.
- **Gaps:** type not validated against (text | number | select | emoji | yesno). Deleting a field cascades to ExperimentFieldResponse (Prisma); existing check-in responses for that field are removed. No warning or guard for “field in use.”

---

## 4. UI reality

### Screens that exist

- **List:** `/experiments` — server fetches by clerkUserId, client filters (All / Active / Draft / Completed), cards with Start / View Details. Link “New Experiment” goes to `/create`.
- **Create entry:** `/create` (form + AI panel), `/experiments/new` (location: Personal / Organisation → method → manual → `/experiments/new/create`). `/experiments` “New Experiment” points to `/create`; empty state “Create Your First Experiment” also points to `/create`.
- **Create form:** `/experiments/new/create` and `/create` both use `ExperimentFormPanel`. Form submits with status `"active"`; no “save as draft” in the main flow.
- **Detail:** `/experiments/[id]` — server loads by id + clerkUserId, 404 if not owner. Client shows status badge, status dropdown, Start/Publish/Check-in/View Results, check-in history, org-linking card (placeholder), preview template dialog.
- **Check-in:** Dialog on detail page; `CheckInForm` with date (default today), notes, and field responses. Submit to POST checkins.
- **Org-linking:** `/experiments/[id]/org-linking` exists; link/unlink API commented out (Phase 1 ignore).

### Flows that work end-to-end

1. **Create (manual):** Experiments → New → (from `/experiments/new`) Personal → Continue → Manual → form → submit → experiment created (active). Redirect after create: **unclear / not found** (form may redirect to list or detail; not fully traced).
2. **List and filter:** View experiments, filter by status, open detail.
3. **Start:** From list or detail, “Start” sets status active and startedAt; progress bar appears when startDate exists.
4. **Check-in:** Detail → Check-in (only if active + startDate + fields) → fill form → submit → 201, dialog closes, refresh.
5. **Status change:** Dropdown on detail (draft / active / completed); completed sets completedAt.
6. **View history:** Check-in history listed on detail with day number and formatted date.

### What is confusing or broken

- **Two create entry points:** `/create` (with AI) vs `/experiments/new` (location chooser then method then form). Both end at the same form component; navigation and “recommended” path not obvious.
- **New experiment created as active:** Form sends `status: "active"`; user may expect “draft” until they press Start. List/detail then show “Start” for “active but no startedAt” which can be confusing.
- **Check-in allowed by API for draft/completed:** UI hides Check-in unless active + startDate + fields; API does not enforce status. Direct API calls can create check-ins for draft/completed.
- **No delete in UI:** DELETE is implemented and enforced; no Delete button found on list or detail.
- **Mock org data in new experiment page:** `userOrganisations = [{ id: "org1", name: "Acme Corp" }, ...]` is hardcoded; “With an organisation” shows fake orgs. Phase 1 ignores this.
- **Detail page console.log:** `console.log(uiExperiment)` in experiment detail page (server component) logs on every load.
- **“View Results” for completed:** Button exists; onClick is TODO (console.log only).
- **Options vs selectOptions:** UI/types use `options` in some places; schema uses `selectOptions`; mapping exists in detail page.

---

## 5. Missing or unsafe areas

### Logic gaps

- **Status lifecycle:** No server-side rule that check-ins are only for active experiments. No validation of status transitions (e.g. completed → draft). startedAt/completedAt can be set independently of status.
- **One check-in per day:** Enforced only by findFirst + 409. No DB unique on (experimentId, checkInDate). Race can allow duplicates. Date compared with `new Date(checkInDate)` — no timezone normalization (e.g. “2026-02-08” may be different calendar days in different zones).
- **Check-ins GET date filter:** Uses mutable setHours on the same date object; timezone is environment default; edge cases possible for UTC vs local.
- **Field validation:** API does not validate response value for number (min/max), select (option in list), emoji (1..emojiCount), or required. Client CheckInForm validates required only.
- **frequency:** Stored as string; not validated against allowed values (daily | every-2-days | weekly).

### UX gaps

- No delete experiment in UI.
- “View Results” for completed is a stub.
- Create flow sends active by default; no explicit “Save as draft” in the main form.
- Two entry points for creation without clear guidance.

### Data consistency risks

- Deleting a field removes all responses for that field (cascade); no confirmation or “field in use” check.
- PATCH experiment fields: removing a field id from the list deletes that field and its responses; easy to do by mistake if client sends partial list.
- Check-in date as DateTime: storing “date only” as midnight UTC vs local can cause “same day” to differ across clients/servers.

---

## 6. Explicit non-goals

- **Organisation / team / admin logic:** Not in scope for this audit. Experiment API and UI do not grant access by org membership or role. organisationId exists on Experiment but is not set in the create flow and is not accepted in PATCH. Org-linking page and “With an organisation” UI exist but are placeholder or mock for Phase 1.
- **Invites, templates, assignments:** Ignored. No logic in the audited experiment CRUD or check-in flows that depends on organisation, teams, or invites.
- **Super_admin / Manager:** Experiment access is ownership-only (clerkUserId). No admin override in the reviewed experiment routes.

This document is the baseline for Phase 1 implementation. No code changes were made.
