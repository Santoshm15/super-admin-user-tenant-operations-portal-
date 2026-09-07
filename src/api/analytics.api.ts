import type { Analytics, RecentActivity } from "../types/analytics.types";

const API_BASE_URL = "https://dummyjson.com";

export const getDashboardAnalytics = async (): Promise<Analytics> => {
  const [usersResponse, productsResponse] = await Promise.all([
    fetch(`${API_BASE_URL}/users`),
    fetch(`${API_BASE_URL}/products`),
  ]);

  if (!usersResponse.ok || !productsResponse.ok) {
    throw new Error("Failed to fetch dashboard analytics");
  }

  const usersData: {
    total: number;
  } = await usersResponse.json();

  const productsData: {
    total: number;
  } = await productsResponse.json();

  const totalUsers = usersData.total;
  const activeUsers = Math.floor(totalUsers * 0.8);
  const inactiveUsers = totalUsers - activeUsers;

  const totalTenants = Math.max(1, Math.ceil(productsData.total / 10));
  const activeTenants = Math.floor(totalTenants * 0.75);
  const inactiveTenants = totalTenants - activeTenants;

  return {
    users: {
      total: totalUsers,
      active: activeUsers,
      inactive: inactiveUsers,
    },

    tenants: {
      total: totalTenants,
      active: activeTenants,
      inactive: inactiveTenants,
    },

    revenue: {
      monthly: totalUsers * 49,
      yearly: totalUsers * 49 * 12,
    },
  };
};

export const getRecentActivity = async (): Promise<RecentActivity[]> => {
  const response = await fetch(`${API_BASE_URL}/users?limit=5`);

  if (!response.ok) {
    throw new Error("Failed to fetch recent activity");
  }

  const data: {
    users: Array<{
      id: number;
      firstName: string;
      lastName: string;
    }>;
  } = await response.json();

  return data.users.map((user, index) => ({
    id: user.id,
    userId: user.id,
    userName: `${user.firstName} ${user.lastName}`,
    action: index % 2 === 0 ? "Updated User" : "Login",
    status: "Success",
    timestamp: new Date(Date.now() - index * 10 * 60 * 1000).toISOString(),
  }));
};
