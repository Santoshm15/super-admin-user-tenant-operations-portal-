export const userKeys = {
  all: ["users"] as const,

  lists: () => [...userKeys.all, "list"] as const,

  list: (filters: {
    search: string;
    role: string;
    status: string;
    tenantId: string;
    page: number;
  }) => [...userKeys.lists(), filters] as const,

  details: () => [...userKeys.all, "detail"] as const,

  detail: (id: number) => [...userKeys.details(), id] as const,

  activities: () => [...userKeys.all, "activity"] as const,

  activity: (userId: number) => [...userKeys.activities(), userId] as const,
};

export const tenantKeys = {
  all: ["tenants"] as const,

  lists: () => [...tenantKeys.all, "list"] as const,

  list: (filters: {
    search: string;
    plan: string;
    status: string;
    page: number;
  }) => [...tenantKeys.lists(), filters] as const,

  details: () => [...tenantKeys.all, "detail"] as const,

  detail: (id: number) => [...tenantKeys.details(), id] as const,

  users: () => [...tenantKeys.all, "users"] as const,

  userList: (tenantId: number) => [...tenantKeys.users(), tenantId] as const,
};

export const auditLogKeys = {
  all: ["auditLogs"] as const,

  lists: () => [...auditLogKeys.all, "list"] as const,

  list: (filters: {
    search: string;
    userId: string;
    tenantId: string;
    action: string;
    status: string;
    startDate: string;
    endDate: string;
    page: number;
  }) => [...auditLogKeys.lists(), filters] as const,

  details: () => [...auditLogKeys.all, "detail"] as const,

  detail: (id: number) => [...auditLogKeys.details(), id] as const,
};

export const analyticsKeys = {
  all: ["analytics"] as const,

  dashboard: () => [...analyticsKeys.all, "dashboard"] as const,

  recentActivity: () => [...analyticsKeys.all, "recentActivity"] as const,
};
