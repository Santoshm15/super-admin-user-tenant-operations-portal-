import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import DashboardPage from "../pages/Dashboard/DashboardPage";
import UsersPage from "../pages/Users/UsersPage";
import UserDetailsPage from "../pages/Users/UserDetailsPage";
import TenantsPage from "../pages/Tenants/TenantsPage";
import TenantDetailsPage from "../pages/Tenants/TenantDetailsPage";
import AuditLogsPage from "../pages/AuditLogs/AuditLogsPage";
import AuditLogDetailsPage from "../pages/AuditLogs/AuditLogDetailsPage";

function AppRoutes() {
  return (
    <BrowserRouter basename="/super-admin-user-tenant-operations-portal-">
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="/dashboard" element={<DashboardPage />} />

        <Route path="/users" element={<UsersPage />} />
        <Route path="/users/:userId" element={<UserDetailsPage />} />

        <Route path="/tenants" element={<TenantsPage />} />
        <Route path="/tenants/:tenantId" element={<TenantDetailsPage />} />

        <Route path="/audit-logs" element={<AuditLogsPage />} />
        <Route
          path="/audit-logs/:auditLogId"
          element={<AuditLogDetailsPage />}
        />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
