import { queryOptions } from "@tanstack/react-query";

import { getAuditLogById, getAuditLogs } from "../api/auditLogs.api";
import { auditLogKeys } from "./queryKeys";
import type { AuditLogFilters } from "../types/auditLog.types";

export const auditLogQueries = {
  list: (filters: AuditLogFilters) =>
    queryOptions({
      queryKey: auditLogKeys.list(filters),
      queryFn: ({ signal }) => getAuditLogs(filters, signal),
      placeholderData: (previousData) => previousData,
      staleTime: 30 * 1000,
      gcTime: 5 * 60 * 1000,
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
    }),

  detail: (auditLogId: number) =>
    queryOptions({
      queryKey: auditLogKeys.detail(auditLogId),
      queryFn: ({ signal }) => getAuditLogById(auditLogId, signal),
      staleTime: 30 * 1000,
      gcTime: 5 * 60 * 1000,
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
    }),
};
