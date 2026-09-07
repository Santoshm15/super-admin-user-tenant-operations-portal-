export interface Tenant {
  id: number;
  name: string;
  slug: string;
  email: string;
  phone: string;
  plan: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
  userCount: number;
}

export interface TenantsResponse {
  tenants: Tenant[];
  total: number;
  skip: number;
  limit: number;
}

export interface TenantUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
}

export interface TenantUsersResponse {
  users: TenantUser[];
  total: number;
}

export interface TenantFilters {
  search: string;
  plan: string;
  status: string;
  page: number;
}

export interface CreateTenantInput {
  name: string;
  slug: string;
  email: string;
  phone: string;
  plan: string;
}

export interface UpdateTenantInput {
  id: number;
  name: string;
  slug: string;
  email: string;
  phone: string;
  plan: string;
}
