# Super Admin User & Tenant Operations Portal

A professional and responsive Super Admin portal for managing users, tenants, analytics, and audit activities.

The application is built with React, TypeScript, and TanStack Query, with a focus on efficient server-state management, caching, pagination, filtering, CRUD operations, optimistic updates, and a clean admin dashboard experience.

## 🔗 Project Links

- **GitHub Repository:** https://github.com/Santoshm15/super-admin-user-tenant-operations-portal-
- **Live Demo:** https://santoshm15.github.io/super-admin-user-tenant-operations-portal-/

## 🚀 Features

### Dashboard

- Total users overview
- Active and inactive users
- Tenant statistics
- Revenue and subscription statistics
- Recent activity
- Refresh and background fetching states
- Loading, error, and empty states

### User Management

- User listing
- Search and filtering
- Role and status filters
- Tenant filtering
- Server-side pagination
- User details
- User activity
- Create user
- Edit user
- Delete user
- User status toggle
- Optimistic updates
- Query caching and cache synchronization

### Tenant Management

- Tenant listing
- Search and filtering
- Plan and status filters
- Pagination
- Tenant details
- Tenant users
- Create tenant
- Edit tenant
- Delete tenant
- Tenant status toggle
- Optimistic updates
- Query caching and cache synchronization

### Audit Logs

- Audit log listing
- Search and filtering
- User and tenant filters
- Action and status filters
- Date range filtering
- Pagination
- Audit log details
- Related user information
- Related tenant information

## 🛠️ Tech Stack

- React
- TypeScript
- Vite
- TanStack Query
- React Router DOM
- CSS
- DummyJSON API
- GitHub Pages

## 📁 Project Structure

```text
src/
├── api/
│   ├── analytics.api.ts
│   ├── users.api.ts
│   ├── tenants.api.ts
│   └── auditLogs.api.ts
│
├── components/
│   ├── common/
│   ├── dashboard/
│   ├── users/
│   ├── tenants/
│   └── auditLogs/
│
├── hooks/
│   └── useDebounce.ts
│
├── lib/
│   └── queryClient.ts
│
├── pages/
│   ├── Dashboard/
│   ├── Users/
│   ├── Tenants/
│   └── AuditLogs/
│
├── queries/
│   ├── queryKeys.ts
│   ├── userQueries.ts
│   ├── tenantQueries.ts
│   ├── analyticsQueries.ts
│   └── auditLogQueries.ts
│
├── routes/
│   └── AppRoutes.tsx
│
├── types/
│   ├── user.types.ts
│   ├── tenant.types.ts
│   ├── analytics.types.ts
│   └── auditLog.types.ts
│
├── App.tsx
├── main.tsx
└── index.css
```
