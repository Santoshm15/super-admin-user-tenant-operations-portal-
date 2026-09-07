import type {
  AuditLog,
  AuditLogFilters,
  AuditLogsResponse,
} from "../types/auditLog.types";

interface DummyJsonUser {
  id: number;
  firstName: string;
  lastName: string;
  company?: {
    name?: string;
  };
}

interface DummyJsonUsersResponse {
  users: DummyJsonUser[];
  total: number;
  skip: number;
  limit: number;
}

const AUDIT_LOG_PAGE_SIZE = 10;

const createAuditLog = (user: DummyJsonUser): AuditLog => {
  const failed = user.id % 5 === 0;
  const updated = user.id % 2 === 0;

  return {
    id: user.id,
    userId: user.id,
    tenantId: (user.id % 10) + 1,
    userName: `${user.firstName} ${user.lastName}`,
    tenantName: user.company?.name ?? "Unknown Tenant",
    action: updated ? "Update User" : "Login",
    timestamp: new Date(Date.now() - user.id * 10 * 60 * 1000).toISOString(),
    resource: "User",
    previousValue: updated ? "Previous value" : "",
    newValue: updated ? "Updated value" : "",
    status: failed ? "Failed" : "Success",
    details: failed
      ? "The requested operation failed."
      : "The requested operation completed successfully.",
  };
};

const fetchAuditLogs = async (signal?: AbortSignal): Promise<AuditLog[]> => {
  const response = await fetch("https://dummyjson.com/users?limit=100", {
    signal,
  });

  if (!response.ok) {
    throw new Error("Unable to load audit logs.");
  }

  const data: DummyJsonUsersResponse = await response.json();

  return data.users.map(createAuditLog);
};

const matchesFilters = (log: AuditLog, filters: AuditLogFilters): boolean => {
  const search = filters.search.trim().toLowerCase();

  if (
    search &&
    !`${log.userName} ${log.tenantName} ${log.action} ${log.status}`
      .toLowerCase()
      .includes(search)
  ) {
    return false;
  }

  if (filters.userId && String(log.userId) !== filters.userId) {
    return false;
  }

  if (filters.tenantId && String(log.tenantId) !== filters.tenantId) {
    return false;
  }

  if (filters.action && log.action !== filters.action) {
    return false;
  }

  if (filters.status && log.status !== filters.status) {
    return false;
  }

  if (filters.startDate) {
    const startDate = new Date(`${filters.startDate}T00:00:00`);

    if (new Date(log.timestamp) < startDate) {
      return false;
    }
  }

  if (filters.endDate) {
    const endDate = new Date(`${filters.endDate}T23:59:59.999`);

    if (new Date(log.timestamp) > endDate) {
      return false;
    }
  }

  return true;
};

export const getAuditLogs = async (
  filters: AuditLogFilters,
  signal?: AbortSignal,
): Promise<AuditLogsResponse> => {
  const logs = await fetchAuditLogs(signal);

  const filteredLogs = logs.filter((log) => matchesFilters(log, filters));

  const skip = (filters.page - 1) * AUDIT_LOG_PAGE_SIZE;

  return {
    logs: filteredLogs.slice(skip, skip + AUDIT_LOG_PAGE_SIZE),
    total: filteredLogs.length,
    skip,
    limit: AUDIT_LOG_PAGE_SIZE,
  };
};

export const getAuditLogById = async (
  auditLogId: number,
  signal?: AbortSignal,
): Promise<AuditLog> => {
  const logs = await fetchAuditLogs(signal);

  const auditLog = logs.find((log) => log.id === auditLogId);

  if (!auditLog) {
    throw new Error("Audit log not found.");
  }

  return auditLog;
};
