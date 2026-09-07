import type {
  User,
  UserActivityResponse,
  UsersResponse,
} from "../types/user.types";

const API_BASE_URL = "https://dummyjson.com";

export interface GetUsersParams {
  search: string;
  page: number;
  limit: number;
  role: string;
  status: string;
  tenantId: string;
  signal?: AbortSignal;
}

export interface CreateUserInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  username: string;
  role: string;
}

export interface UpdateUserInput {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  username: string;
  role: string;
}

export const getUsers = async ({
  search,
  page,
  limit,
  signal,
}: GetUsersParams): Promise<UsersResponse> => {
  const skip = (page - 1) * limit;

  const endpoint = search.trim()
    ? `${API_BASE_URL}/users/search?q=${encodeURIComponent(
        search.trim(),
      )}&limit=${limit}&skip=${skip}`
    : `${API_BASE_URL}/users?limit=${limit}&skip=${skip}`;

  const response = await fetch(endpoint, { signal });

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  const data: {
    users: User[];
    total: number;
    skip: number;
    limit: number;
  } = await response.json();

  return {
    users: data.users.map((user) => ({
      ...user,
      status: user.id % 5 === 0 ? "inactive" : "active",
    })),
    total: data.total,
    skip: data.skip,
    limit: data.limit,
  };
};

export const getUserById = async (userId: number): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch user details");
  }

  const user: User = await response.json();

  return {
    ...user,
    status: user.id % 5 === 0 ? "inactive" : "active",
  };
};

export const getUserActivity = async (
  userId: number,
): Promise<UserActivityResponse> => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch user activity");
  }

  const user: User = await response.json();

  return {
    activities: [
      {
        id: user.id * 10 + 1,
        userId: user.id,
        action: "User profile viewed",
        status: "Success",
        timestamp: new Date().toISOString(),
      },
      {
        id: user.id * 10 + 2,
        userId: user.id,
        action: "User account updated",
        status: "Success",
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      },
      {
        id: user.id * 10 + 3,
        userId: user.id,
        action: "User login",
        status: "Success",
        timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      },
    ],
    total: 3,
  };
};

export const createUser = async (input: CreateUserInput): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/users/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      phone: input.phone,
      username: input.username,
      role: input.role,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create user");
  }

  const user: User = await response.json();

  return {
    ...user,
    status: "active",
  };
};

export const updateUser = async (input: UpdateUserInput): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/users/${input.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      phone: input.phone,
      username: input.username,
      role: input.role,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to update user");
  }

  const user: User = await response.json();

  return {
    ...user,
    status: user.id % 5 === 0 ? "inactive" : "active",
  };
};

export const deleteUser = async (userId: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete user");
  }
};
export const updateUserStatus = async (
  userId: number,
  status: "active" | "inactive",
): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to update user status");
  }

  const user: User = await response.json();

  return {
    ...user,
    status,
  };
};
