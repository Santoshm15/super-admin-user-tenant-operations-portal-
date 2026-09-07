export type AuditLogStatus = "Success" | "Failed";

export interface AuditLog {
  id: number;
  userId: number;
  tenantId: number;
  userName: string;
  tenantName: string;
  action: string;
  timestamp: string;
  resource: string;
  previousValue: string;
  newValue: string;
  status: AuditLogStatus;
  details: string;
}

export interface AuditLogsResponse {
  logs: AuditLog[];
  total: number;
  skip: number;
  limit: number;
}

export interface AuditLogFilters {
  search: string;
  userId: string;
  tenantId: string;
  action: string;
  status: string;
  startDate: string;
  endDate: string;
  page: number;
}
