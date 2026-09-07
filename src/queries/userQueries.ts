import { queryOptions } from "@tanstack/react-query";
import {
  createUser,
  deleteUser,
  getUserActivity,
  getUserById,
  getUsers,
  updateUser,
  updateUserStatus,
} from "../api/users.api";
import { userKeys } from "./queryKeys";

export const userQueries = {
  list: (filters: {
    search: string;
    role: string;
    status: string;
    tenantId: string;
    page: number;
  }) =>
    queryOptions({
      queryKey: userKeys.list(filters),
      queryFn: ({ signal }) =>
        getUsers({
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

  detail: (userId: number) =>
    queryOptions({
      queryKey: userKeys.detail(userId),
      queryFn: () => getUserById(userId),
      staleTime: 30 * 1000,
      gcTime: 5 * 60 * 1000,
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
    }),

  activity: (userId: number) =>
    queryOptions({
      queryKey: userKeys.activity(userId),
      queryFn: () => getUserActivity(userId),
      enabled: !!userId,
      staleTime: 30 * 1000,
      gcTime: 5 * 60 * 1000,
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
    }),
};

export const userMutations = {
  create: {
    mutationFn: createUser,
  },

  update: {
    mutationFn: updateUser,
  },

  delete: {
    mutationFn: deleteUser,
  },

  updateStatus: {
    mutationFn: ({
      userId,
      status,
    }: {
      userId: number;
      status: "active" | "inactive";
    }) => updateUserStatus(userId, status),
  },
};
