import type {
  CreateTenantInput,
  Tenant,
  TenantUsersResponse,
  TenantsResponse,
  UpdateTenantInput,
} from "../types/tenant.types";

const API_BASE_URL = "https://dummyjson.com";

export interface GetTenantsParams {
  search: string;
  page: number;
  limit: number;
  plan: string;
  status: string;
  signal?: AbortSignal;
}

export const getTenants = async ({
  search,
  page,
  limit,
  plan,
  status,
  signal,
}: GetTenantsParams): Promise<TenantsResponse> => {
  const skip = (page - 1) * limit;

  const endpoint = search.trim()
    ? `${API_BASE_URL}/products/search?q=${encodeURIComponent(
        search.trim(),
      )}&limit=${limit}&skip=${skip}`
    : `${API_BASE_URL}/products?limit=${limit}&skip=${skip}`;

  const response = await fetch(endpoint, {
    signal,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch tenants");
  }

  const data: {
    products: Array<{
      id: number;
      title: string;
      description: string;
      category: string;
      price: number;
      stock: number;
    }>;
    total: number;
    skip: number;
    limit: number;
  } = await response.json();

  let tenants: Tenant[] = data.products.map((product) => ({
    id: product.id,
    name: product.title,
    slug: product.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, ""),
    email: `admin${product.id}@example.com`,
    phone: `+1 555 000 ${String(product.id).padStart(4, "0")}`,
    plan:
      product.id % 3 === 0
        ? "Enterprise"
        : product.id % 2 === 0
          ? "Pro"
          : "Basic",
    status: product.id % 5 === 0 ? "inactive" : "active",
    createdAt: new Date(
      Date.now() - product.id * 24 * 60 * 60 * 1000,
    ).toISOString(),
    updatedAt: new Date().toISOString(),
    userCount: (product.stock % 20) + 5,
  }));

  if (plan) {
    tenants = tenants.filter((tenant) => tenant.plan === plan);
  }

  if (status) {
    tenants = tenants.filter((tenant) => tenant.status === status);
  }

  return {
    tenants,
    total: data.total,
    skip: data.skip,
    limit: data.limit,
  };
};

export const getTenantById = async (tenantId: number): Promise<Tenant> => {
  const response = await fetch(`${API_BASE_URL}/products/${tenantId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch tenant details");
  }

  const product: {
    id: number;
    title: string;
    stock: number;
  } = await response.json();

  return {
    id: product.id,
    name: product.title,
    slug: product.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, ""),
    email: `admin${product.id}@example.com`,
    phone: `+1 555 000 ${String(product.id).padStart(4, "0")}`,
    plan:
      product.id % 3 === 0
        ? "Enterprise"
        : product.id % 2 === 0
          ? "Pro"
          : "Basic",
    status: product.id % 5 === 0 ? "inactive" : "active",
    createdAt: new Date(
      Date.now() - product.id * 24 * 60 * 60 * 1000,
    ).toISOString(),
    updatedAt: new Date().toISOString(),
    userCount: (product.stock % 20) + 5,
  };
};

export const getTenantUsers = async (
  tenantId: number,
): Promise<TenantUsersResponse> => {
  const response = await fetch(`${API_BASE_URL}/users?limit=10`);

  if (!response.ok) {
    throw new Error("Failed to fetch tenant users");
  }

  const data: {
    users: Array<{
      id: number;
      firstName: string;
      lastName: string;
      email: string;
      image: string;
    }>;
    total: number;
  } = await response.json();

  const users = data.users.filter((user) => user.id % 5 === tenantId % 5);

  return {
    users,
    total: users.length,
  };
};

export const createTenant = async (
  input: CreateTenantInput,
): Promise<Tenant> => {
  const response = await fetch(`${API_BASE_URL}/products/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: input.name,
      description: input.slug,
      price: 99,
      stock: 10,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create tenant");
  }

  const product: {
    id: number;
    title: string;
  } = await response.json();

  return {
    id: product.id,
    name: input.name,
    slug: input.slug,
    email: input.email,
    phone: input.phone,
    plan: input.plan,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userCount: 0,
  };
};

export const updateTenant = async (
  input: UpdateTenantInput,
): Promise<Tenant> => {
  const response = await fetch(`${API_BASE_URL}/products/${input.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: input.name,
      description: input.slug,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to update tenant");
  }

  return {
    id: input.id,
    name: input.name,
    slug: input.slug,
    email: input.email,
    phone: input.phone,
    plan: input.plan,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userCount: 0,
  };
};

export const deleteTenant = async (tenantId: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/products/${tenantId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete tenant");
  }
};

export const updateTenantStatus = async (
  tenantId: number,
  status: "active" | "inactive",
): Promise<Tenant> => {
  const response = await fetch(`${API_BASE_URL}/products/${tenantId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to update tenant status");
  }

  const product: {
    id: number;
    title: string;
  } = await response.json();

  return {
    id: product.id,
    name: product.title,
    slug: product.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, ""),
    email: `admin${product.id}@example.com`,
    phone: "",
    plan: "Basic",
    status,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userCount: 0,
  };
};
