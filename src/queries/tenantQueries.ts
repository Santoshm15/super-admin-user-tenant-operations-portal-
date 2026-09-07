import { queryOptions } from "@tanstack/react-query";

import {
  createTenant,
  deleteTenant,
  getTenantById,
  getTenantUsers,
  getTenants,
  updateTenant,
  updateTenantStatus,
} from "../api/tenants.api";

import { tenantKeys } from "./queryKeys";

export const tenantQueries = {
  list: (filters: {
    search: string;
    plan: string;
    status: string;
    page: number;
  }) =>
    queryOptions({
      queryKey: tenantKeys.list(filters),

      queryFn: ({ signal }) =>
        getTenants({
          ...filters,
          limit: 10,
          signal,
        }),

      staleTime: 30 * 1000,

      gcTime: 5 * 60 * 1000,

      retry: 2,

      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

      refetchOnWindowFocus: false,

      placeholderData: (previousData) => previousData,
    }),

  detail: (tenantId: number) =>
    queryOptions({
      queryKey: tenantKeys.detail(tenantId),

      queryFn: () => getTenantById(tenantId),

      staleTime: 30 * 1000,

      gcTime: 5 * 60 * 1000,

      retry: 2,

      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

      refetchOnWindowFocus: false,
    }),

  users: (tenantId: number) =>
    queryOptions({
      queryKey: tenantKeys.userList(tenantId),

      queryFn: () => getTenantUsers(tenantId),

      enabled: !!tenantId,

      staleTime: 30 * 1000,

      gcTime: 5 * 60 * 1000,

      retry: 2,

      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

      refetchOnWindowFocus: false,
    }),
};

export const tenantMutations = {
  create: {
    mutationFn: createTenant,
  },

  update: {
    mutationFn: updateTenant,
  },

  delete: {
    mutationFn: deleteTenant,
  },

  updateStatus: {
    mutationFn: ({
      tenantId,
      status,
    }: {
      tenantId: number;
      status: "active" | "inactive";
    }) => updateTenantStatus(tenantId, status),
  },
};
