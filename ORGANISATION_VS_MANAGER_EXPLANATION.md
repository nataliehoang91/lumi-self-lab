# Organizations vs Manager - Key Differences

## The Confusion

You have two navigation items that seem similar:
- **"Organizations"** (`/organizations`) - Available to ALL users
- **"Manager"** (`/manager`) - Available to ORGANISATION ACCOUNTS only

Here's the key difference:

---

## 🏢 Organizations (`/organizations`)

### Who can access:
**ALL users** (both individual and organisation accounts)

### What it's for:
**Viewing organisations you BELONG TO as a MEMBER**

### Purpose:
- List organisations where you're a member (`OrganisationMember`)
- View organisation dashboards (read-only member view)
- Browse organisation templates (as a member)
- View organisation insights (as a member)
- Accept organisation invitations

### Access level:
**Member view** - You're viewing an organisation someone else created/manages

### Example flow:
```
Individual User → Joins "Acme Corp" (someone else's organisation) → 
  /organizations → See "Acme Corp" → View dashboard, templates, insights as MEMBER
```

---

## 👔 Manager (`/manager`)

### Who can access:
**ORGANISATION ACCOUNTS only** (upgraded accounts)

### What it's for:
**MANAGING organisations YOU CREATED**

### Purpose:
- Create and manage organisation templates (you're the creator)
- View aggregate insights for organisations you manage
- Create organisations (if you have organisation account)
- Manage organisation settings (future)

### Access level:
**Manager/Owner view** - You're managing YOUR OWN organisations

### Example flow:
```
Organisation Account → /manager → Create templates, view insights for YOUR organisations
```

---

## 🔗 The Relationship

### Scenario 1: Individual User Joins Someone's Organisation

```
User (Individual Account)
  ↓
Joins "Acme Corp" (created by someone else)
  ↓
Access via: /organizations → See "Acme Corp" as MEMBER
  - Can view templates (read-only)
  - Can view insights (read-only)
  - Cannot create templates
  - Cannot manage organisation
```

### Scenario 2: Organisation Account Manages Own Organisation

```
User (Organisation Account)
  ↓
Creates "My Company" (you're the creator/manager)
  ↓
Access via: /manager → Manage "My Company"
  - Can create templates
  - Can view insights
  - Can manage organisation
  ↓
Also: /organizations → See "My Company" as OWNER (if you join it as member too)
```

### Scenario 3: Organisation Account is ALSO a Member of Other Organisations

```
User (Organisation Account)
  ↓
Manages "My Company" (created by you) → /manager
  ↓
ALSO joins "Acme Corp" (created by someone else) → /organizations
```

**So one user can:**
- **Manage** their own organisations via `/manager`
- **View** other organisations they belong to via `/organisations`

---

## 📋 Quick Reference

| Feature | Organizations (`/organizations`) | Manager (`/manager`) |
|---------|----------------------------------|----------------------|
| **Who can access?** | ALL users | Organisation accounts only |
| **What do you see?** | Organisations you're a MEMBER of | Organisations you CREATE/MANAGE |
| **Can create templates?** | ❌ No | ✅ Yes |
| **Can manage org?** | ❌ No (read-only) | ✅ Yes |
| **Can view insights?** | ✅ Yes (read-only) | ✅ Yes (full access) |
| **Account type needed** | Any (individual or organisation) | Organisation account only |

---

## 🎯 Real-World Analogy

Think of it like a company:

- **`/organizations`** = "My Organizations" - Companies you work FOR (as an employee)
  - You can view company resources, templates, insights
  - You're a member, not the owner

- **`/manager`** = "My Companies" - Companies you OWN/Manage (as CEO/Founder)
  - You create templates, manage resources
  - You have full control

### Example:
```
John has Organisation Account:
  - Created "John's Company" → Manages via /manager
  - Joined "Tech Corp" (created by someone else) → Views via /organizations
```

---

## 🔄 Current Navbar Behavior

### Individual Account:
```
Dashboard | Experiments | Templates | Insights | Organizations | Upgrade
                                                                    ↑
                                                      (button to upgrade)
```

### Organisation Account:
```
Dashboard | Experiments | Templates | Insights | Organizations | Manager
                                                        ↑              ↑
                                            (view orgs as member)  (manage your orgs)
```

---

## 💡 Why This Design?

### Separation of Concerns:
- **`/organizations`** = **Membership view** (being part of organisations)
- **`/manager`** = **Management view** (creating/managing organisations)

### Benefits:
1. **Clear roles** - You know if you're a member or manager
2. **Right access** - Managers get create/manage, members get view-only
3. **Multiple roles** - You can manage your orgs AND be a member of others
4. **Upgrade path** - Clear reason to upgrade (get `/manager` access)

---

## 📝 Database Models Involved

### OrganisationMember (Membership):
```typescript
{
  id: string;
  organisationId: string;
  clerkUserId: string;  // YOU (as member)
  role: "member" | "admin";
}
```
**Access via:** `/organizations/[orgId]` (view as member)

### Organisation (Created by Manager):
```typescript
{
  id: string;
  name: string;
  createdBy: string;  // clerkUserId of CREATOR (manager)
}
```
**Access via:** `/manager` (manage if you're creator)

---

## ✅ Summary

**Organizations (`/organizations`):**
- For ALL users
- See organisations you BELONG TO as a MEMBER
- Read-only access (view templates, insights)

**Manager (`/manager`):**
- For ORGANISATION ACCOUNTS only
- Manage organisations YOU CREATED
- Full access (create templates, manage org)

**You can have BOTH:**
- Manage your own orgs (`/manager`)
- View other orgs you belong to (`/organizations`)
