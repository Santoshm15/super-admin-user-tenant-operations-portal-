import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import ConfirmDialog from "../../components/common/ConfirmDialog";
import UserFilters from "../../components/users/UserFilters";
import UserForm from "../../components/users/UserForm";
import UserTable from "../../components/users/UserTable";

import type { CreateUserInput, UpdateUserInput } from "../../api/users.api";

import type {
  User,
  UserFilters as UserFiltersType,
} from "../../types/user.types";

import useDebounce from "../../hooks/useDebounce";

import { analyticsKeys, userKeys } from "../../queries/queryKeys";

import { userMutations, userQueries } from "../../queries/userQueries";

function UsersPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [searchInput, setSearchInput] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [tenantId, setTenantId] = useState("");
  const [page, setPage] = useState(1);

  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);

  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);

  const [successMessage, setSuccessMessage] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const debouncedSearch = useDebounce(searchInput, 500);

  const filters = useMemo<UserFiltersType>(
    () => ({
      search: debouncedSearch,
      role,
      status,
      tenantId,
      page,
    }),
    [debouncedSearch, role, status, tenantId, page],
  );

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery(
    userQueries.list(filters),
  );

  const createUserMutation = useMutation({
    mutationFn: userMutations.create.mutationFn,

    onSuccess: async (createdUser) => {
      setIsCreateFormOpen(false);

      setSuccessMessage("User created successfully.");

      setErrorMessage("");

      queryClient.setQueryData(userKeys.detail(createdUser.id), createdUser);

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: userKeys.lists(),
        }),
        queryClient.invalidateQueries({
          queryKey: analyticsKeys.dashboard(),
        }),
      ]);
    },

    onError: (mutationError) => {
      setErrorMessage(
        mutationError instanceof Error
          ? mutationError.message
          : "Failed to create user.",
      );

      setSuccessMessage("");
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: userMutations.update.mutationFn,

    onSuccess: async (updatedUser) => {
      setEditingUser(null);

      setSuccessMessage("User updated successfully.");

      setErrorMessage("");

      queryClient.setQueryData(userKeys.detail(updatedUser.id), updatedUser);

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: userKeys.lists(),
        }),
        queryClient.invalidateQueries({
          queryKey: analyticsKeys.dashboard(),
        }),
      ]);
    },

    onError: (mutationError) => {
      setErrorMessage(
        mutationError instanceof Error
          ? mutationError.message
          : "Failed to update user.",
      );

      setSuccessMessage("");
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: userMutations.delete.mutationFn,

    onSuccess: async (_deletedUser, deletedUserId) => {
      queryClient.removeQueries({
        queryKey: userKeys.detail(deletedUserId),
      });

      setDeletingUser(null);

      setSuccessMessage("User deleted successfully.");

      setErrorMessage("");

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: userKeys.lists(),
        }),
        queryClient.invalidateQueries({
          queryKey: analyticsKeys.dashboard(),
        }),
      ]);
    },

    onError: (mutationError) => {
      setErrorMessage(
        mutationError instanceof Error
          ? mutationError.message
          : "Failed to delete user.",
      );
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: userMutations.updateStatus.mutationFn,

    onMutate: async ({ userId, status: nextStatus }) => {
      setUpdatingUserId(userId);

      setSuccessMessage("");
      setErrorMessage("");

      await queryClient.cancelQueries({
        queryKey: userKeys.lists(),
      });

      await queryClient.cancelQueries({
        queryKey: userKeys.detail(userId),
      });

      const previousLists = queryClient.getQueriesData<{
        users: User[];
        total: number;
        skip: number;
        limit: number;
      }>({
        queryKey: userKeys.lists(),
      });

      const previousDetail = queryClient.getQueryData<User>(
        userKeys.detail(userId),
      );

      queryClient.setQueriesData<{
        users: User[];
        total: number;
        skip: number;
        limit: number;
      }>(
        {
          queryKey: userKeys.lists(),
        },
        (oldData) => {
          if (!oldData) {
            return oldData;
          }

          return {
            ...oldData,
            users: oldData.users.map((user) =>
              user.id === userId
                ? {
                    ...user,
                    status: nextStatus,
                  }
                : user,
            ),
          };
        },
      );

      queryClient.setQueryData<User>(userKeys.detail(userId), (oldUser) => {
        if (!oldUser) {
          return oldUser;
        }

        return {
          ...oldUser,
          status: nextStatus,
        };
      });

      return {
        previousLists,
        previousDetail,
      };
    },

    onError: (mutationError, variables, context) => {
      if (context) {
        context.previousLists.forEach(([queryKey, previousData]) => {
          queryClient.setQueryData(queryKey, previousData);
        });

        queryClient.setQueryData(
          userKeys.detail(variables.userId),
          context.previousDetail,
        );
      }

      setErrorMessage(
        mutationError instanceof Error
          ? mutationError.message
          : "Failed to update user status.",
      );

      setSuccessMessage("");
    },

    onSuccess: (updatedUser) => {
      queryClient.setQueryData(userKeys.detail(updatedUser.id), updatedUser);

      setSuccessMessage(`User status changed to ${updatedUser.status}.`);

      setErrorMessage("");
    },

    onSettled: async (_data, _error, variables) => {
      setUpdatingUserId(null);

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: userKeys.lists(),
        }),

        queryClient.invalidateQueries({
          queryKey: userKeys.detail(variables.userId),
        }),

        queryClient.invalidateQueries({
          queryKey: analyticsKeys.dashboard(),
        }),
      ]);
    },
  });

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    setPage(1);
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleRoleChange = (value: string) => {
    setRole(value);
    setPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    setPage(1);
  };

  const handleTenantChange = (value: string) => {
    setTenantId(value);
    setPage(1);
  };

  const handleView = (userId: number) => {
    navigate(`/users/${userId}`);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsCreateFormOpen(false);
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleDelete = (user: User) => {
    setDeletingUser(user);
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleConfirmDelete = () => {
    if (!deletingUser) {
      return;
    }

    deleteUserMutation.mutate(deletingUser.id);
  };

  const handleCreateUser = (formData: CreateUserInput | UpdateUserInput) => {
    if ("id" in formData) {
      return;
    }

    createUserMutation.mutate(formData);
  };

  const handleUpdateUser = (formData: CreateUserInput | UpdateUserInput) => {
    if (!("id" in formData)) {
      return;
    }

    updateUserMutation.mutate(formData);
  };

  const handleFormSubmit = (formData: CreateUserInput | UpdateUserInput) => {
    if ("id" in formData) {
      handleUpdateUser(formData);
      return;
    }

    handleCreateUser(formData);
  };

  const handleStatusToggle = (user: User) => {
    if (updatingUserId !== null) {
      return;
    }

    const nextStatus = user.status === "active" ? "inactive" : "active";

    updateStatusMutation.mutate({
      userId: user.id,
      status: nextStatus,
    });
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((currentPage) => currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (!data) {
      return;
    }

    const totalPages = Math.ceil(data.total / data.limit);

    if (page < totalPages) {
      setPage((currentPage) => currentPage + 1);
    }
  };

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.limit)) : 1;

  const isFormSubmitting =
    createUserMutation.isPending || updateUserMutation.isPending;

  return (
    <main className="dashboard-page">
      <section className="dashboard-header">
        <div>
          <p className="section-eyebrow">User Management</p>

          <h1>Users</h1>

          <p className="dashboard-subtitle">
            Manage platform users, roles, status, and account information.
          </p>
        </div>

        <div className="dashboard-header-actions">
          <button
            type="button"
            className="dashboard-refresh-button"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            {isFetching ? "Refreshing..." : "Refresh"}
          </button>

          <button
            type="button"
            className="dashboard-primary-button"
            onClick={() => {
              setIsCreateFormOpen(true);
              setEditingUser(null);
              setSuccessMessage("");
              setErrorMessage("");
            }}
          >
            + Create User
          </button>
        </div>
      </section>

      <section className="users-toolbar">
        <UserFilters
          search={searchInput}
          role={role}
          status={status}
          tenantId={tenantId}
          onSearchChange={handleSearchChange}
          onRoleChange={handleRoleChange}
          onStatusChange={handleStatusChange}
          onTenantChange={handleTenantChange}
        />
      </section>

      {successMessage && (
        <div className="users-success-message" role="status">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="users-error-message" role="alert">
          {errorMessage}
        </div>
      )}

      {isLoading && (
        <section className="dashboard-state-card">
          <div className="dashboard-loader" />

          <h3>Loading users...</h3>

          <p>Please wait while we load the user list.</p>
        </section>
      )}

      {isError && (
        <section className="dashboard-state-card dashboard-error-state">
          <h3>Unable to load users</h3>

          <p>
            {error instanceof Error
              ? error.message
              : "Something went wrong while loading users."}
          </p>

          <button
            type="button"
            className="dashboard-primary-button"
            onClick={() => refetch()}
          >
            Try Again
          </button>
        </section>
      )}

      {!isLoading && !isError && data && data.users.length === 0 && (
        <section className="dashboard-state-card">
          <h3>No users found</h3>

          <p>No users match the selected search and filters.</p>
        </section>
      )}

      {!isLoading && !isError && data && data.users.length > 0 && (
        <>
          <section className="dashboard-content-card">
            <div className="users-table-header">
              <div>
                <p className="section-eyebrow">User Directory</p>

                <h2>
                  {data.total} {data.total === 1 ? "User" : "Users"}
                </h2>
              </div>

              {isFetching && (
                <span className="users-updating-indicator">Updating...</span>
              )}
            </div>

            <UserTable
              users={data.users}
              updatingUserId={updatingUserId}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusToggle={handleStatusToggle}
            />
          </section>

          <section className="users-pagination">
            <button
              type="button"
              className="users-pagination-button"
              onClick={handlePreviousPage}
              disabled={page <= 1}
            >
              Previous
            </button>

            <span className="users-pagination-info">
              Page {page} of {totalPages}
            </span>

            <button
              type="button"
              className="users-pagination-button"
              onClick={handleNextPage}
              disabled={page >= totalPages}
            >
              Next
            </button>
          </section>
        </>
      )}

      {(isCreateFormOpen || editingUser) && (
        <UserForm
          user={editingUser}
          isSubmitting={isFormSubmitting}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            if (isFormSubmitting) {
              return;
            }

            setIsCreateFormOpen(false);
            setEditingUser(null);
          }}
        />
      )}

      <ConfirmDialog
        isOpen={Boolean(deletingUser)}
        title="Delete User?"
        message={
          deletingUser
            ? `Are you sure you want to delete ${deletingUser.firstName} ${deletingUser.lastName}? This action cannot be undone.`
            : ""
        }
        confirmText="Delete User"
        cancelText="Cancel"
        isLoading={deleteUserMutation.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          if (deleteUserMutation.isPending) {
            return;
          }

          setDeletingUser(null);
        }}
      />
    </main>
  );
}

export default UsersPage;
