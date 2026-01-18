# Organisation Feature Design Rules

## 🎯 Core Design Philosophy

**Clear separation by route = Clear user mindset**

---

## 1. User Roles

Identify the user role:
- **Individual** - Personal account only
- **Manager** - Organisation account (can create/manage orgs)
- **Member** - Belongs to other organisations (read-only access)

**A user can have MULTIPLE roles simultaneously:**
- Organisation account user can be:
  - Manager of their own orgs
  - Member of other orgs
  - Individual (personal experiments)

---

## 2. Mode Separation (CRITICAL)

### Two Distinct Modes:

#### 📋 Membership Mode → `/organizations/*`
- **User mindset:** "I'm a MEMBER viewing organisations I belong to"
- **Access level:** READ-ONLY
- **What you can do:** View templates, view insights, browse
- **What you CANNOT do:** Create templates, manage org, delete anything

#### 👔 Management Mode → `/manager/*`
- **User mindset:** "I'm an OWNER managing my organisations"
- **Access level:** FULL ACCESS
- **What you can do:** Create templates, manage org, view insights, delete
- **What you CANNOT do:** N/A (full control)

---

## 3. Route-Based Rules (ENFORCE STRICTLY)

### Rule #1: Route Determines Mode
```
If URL starts with /organizations → MEMBERSHIP MODE (read-only)
If URL starts with /manager → MANAGEMENT MODE (full access)
```

### Rule #2: Never Mix Modes
- ❌ **NEVER** show "Create Template" button on `/organizations/*` pages
- ❌ **NEVER** show "Manage Org" actions on `/organizations/*` pages
- ✅ **ALWAYS** keep actions separated by route

### Rule #3: Consistent Access Control
- `/organizations/*` → Always READ-ONLY mindset
- `/manager/*` → Always FULL ACCESS mindset

---

## 4. Multi-Role Handling

### If a user qualifies for multiple roles:

#### ✅ DO: Separate by Route
```
User is:
  - Manager of "My Company"
  - Member of "Tech Corp"

Access:
  /manager → Manage "My Company" (full access)
  /organizations → View "Tech Corp" (read-only)
```

#### ❌ DON'T: Merge Permissions
```
❌ DON'T create a page like:
  /organizations/manage → This is confusing!

✅ DO keep separate:
  /organizations/[orgId] → View as member (read-only)
  /manager → Manage your orgs (full access)
```

---

## 5. Default Behavior (Safety First)

### When in doubt:
- **Default to READ-ONLY**
- **Show privacy notice**
- **Hide destructive actions**
- **Require explicit upgrade/promotion for management features**

### Privacy Notice Always:
- Show on `/organizations/*` pages: "You're viewing as a member"
- Show on `/manager/*` pages: "You're managing your organisations"

---

## 📋 Route Mapping

### Membership Routes (`/organizations/*`)
```
/organizations
  → List organisations user belongs to (as member)
  → Read-only

/organizations/[orgId]
  → View organisation dashboard (as member)
  → Read-only

/organizations/[orgId]/templates
  → Browse organisation templates (as member)
  → Read-only (can use templates to create experiments)

/organizations/[orgId]/insights
  → View aggregate insights (as member)
  → Read-only
```

### Management Routes (`/manager/*`)
```
/manager
  → Organisation dashboard (as owner/manager)
  → Full access

/manager/templates
  → List templates for organisations you manage
  → Full access (create, edit, delete)

/manager/templates/create
  → Create new organisation template
  → Full access

/manager/insights
  → View insights for organisations you manage
  → Full access
```

---

## 🎨 UI Design Implications

### Membership Mode UI (`/organizations/*`):
- ✅ View buttons ("View Dashboard", "Browse Templates")
- ✅ Privacy notice banner
- ✅ Read-only indicators
- ❌ NO "Create" buttons
- ❌ NO "Edit" buttons
- ❌ NO "Delete" buttons
- ❌ NO management actions

### Management Mode UI (`/manager/*`):
- ✅ Create buttons ("Create Template")
- ✅ Edit buttons ("Edit Template")
- ✅ Delete buttons ("Delete Template")
- ✅ Management actions
- ✅ Full control

---

## 🔒 Access Control Checklist

When building ANY organisation-related page:

- [ ] **Identify the route prefix** (`/organizations/*` or `/manager/*`)
- [ ] **Determine the mode** (Membership or Management)
- [ ] **Apply appropriate access level** (Read-only or Full access)
- [ ] **Show/hide actions based on mode**
- [ ] **Add privacy notice if needed**
- [ ] **Verify no mixing of modes**

---

## 📝 Examples

### ✅ CORRECT: Separate Actions

**Membership Mode (`/organizations/[orgId]/templates`):**
```typescript
// ✅ Show "Start from Template" (creates personal experiment)
<Button>Start from Template</Button>

// ❌ DON'T show "Create Template" (management action)
```

**Management Mode (`/manager/templates`):**
```typescript
// ✅ Show "Create Template" (management action)
<Button>Create Template</Button>

// ✅ Show "Edit Template" (management action)
<Button>Edit Template</Button>
```

### ❌ INCORRECT: Mixed Actions

**DON'T DO THIS:**
```typescript
// ❌ On /organizations/[orgId]/templates
{isManager && <Button>Create Template</Button>} // WRONG!

// ❌ On /manager
{isMember && <Button>View as Member</Button>} // WRONG!
```

---

## 🎯 Navigation Behavior

### Individual Account:
```
Dashboard | Experiments | Templates | Insights | Organizations
                                                      ↑
                                    (only if member of orgs)
```

### Organisation Account (Manager):
```
Dashboard | Experiments | Templates | Insights | Organizations | Manager
                                                        ↑              ↑
                                          (member view)      (manager view)
```

**Key:** Two separate tabs = Two separate mindsets

---

## 💡 Why These Rules?

### Benefits:
1. **Clear user expectations** - Route tells you what you can do
2. **Prevents confusion** - No mixing of member/manager actions
3. **Security by default** - Read-only unless explicitly in management mode
4. **Easy to understand** - Route = Mode = Access level
5. **Scalable** - Easy to add new routes following the same pattern

---

## ✅ Implementation Checklist

When building new organisation features:

1. ✅ **Identify route** → Determines mode
2. ✅ **Set access level** → Read-only or Full access
3. ✅ **Design UI accordingly** → Show/hide actions
4. ✅ **Add privacy notice** → Explain access level
5. ✅ **Test separation** → Verify no mode mixing
6. ✅ **Verify permissions** → Check user role vs. route access

---

**Remember: Route = Mode = Mindset**
