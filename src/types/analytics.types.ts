export interface Analytics {
  users: {
    total: number;
    active: number;
    inactive: number;
  };

  tenants: {
    total: number;
    active: number;
    inactive: number;
  };

  revenue: {
    monthly: number;
    yearly: number;
  };
}

export interface RecentActivity {
  id: number;
  userId: number;
  userName: string;
  action: string;
  status: "Success" | "Failed";
  timestamp: string;
}
