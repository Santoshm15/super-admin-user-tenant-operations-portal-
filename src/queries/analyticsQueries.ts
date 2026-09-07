import { queryOptions } from "@tanstack/react-query";
import { getDashboardAnalytics, getRecentActivity } from "../api/analytics.api";
import { analyticsKeys } from "./queryKeys";

export const analyticsQueries = {
  dashboard: () =>
    queryOptions({
      queryKey: analyticsKeys.dashboard(),
      queryFn: getDashboardAnalytics,
      staleTime: 30 * 1000,
      gcTime: 5 * 60 * 1000,
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      select: (data) => ({
        totalUsers: data.users.total,
        activeUsers: data.users.active,
        inactiveUsers: data.users.inactive,
        totalTenants: data.tenants.total,
        activeTenants: data.tenants.active,
        inactiveTenants: data.tenants.inactive,
        monthlyRevenue: data.revenue.monthly,
        yearlyRevenue: data.revenue.yearly,
      }),
    }),

  recentActivity: () =>
    queryOptions({
      queryKey: analyticsKeys.recentActivity(),
      queryFn: getRecentActivity,
      staleTime: 30 * 1000,
      gcTime: 5 * 60 * 1000,
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
    }),
};
