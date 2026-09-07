import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";

import TenantFilters from "../../components/tenants/TenantFilters";
import TenantTable from "../../components/tenants/TenantTable";
import TenantForm from "../../components/tenants/TenantForm";

import Loading from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";
import Pagination from "../../components/common/Pagination";

import useDebounce from "../../hooks/useDebounce";

import { tenantQueries, tenantMutations } from "../../queries/tenantQueries";

import { tenantKeys, analyticsKeys } from "../../queries/queryKeys";

import type { CreateTenantInput, Tenant } from "../../types/tenant.types";

function TenantsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState("");
  const [plan, setPlan] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const [showForm, setShowForm] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);

  const [deletingTenantId, setDeletingTenantId] = useState<number | null>(null);

  const [deleteError, setDeleteError] = useState("");
  const [statusError, setStatusError] = useState("");

  const debouncedSearch = useDebounce(search, 500);

  const filters = {
    search: debouncedSearch,
    plan,
    status,
    page,
  };

  const tenantsQuery = useQuery(tenantQueries.list(filters));

  useEffect(() => {
    const editTenantId = Number(searchParams.get("editTenant"));

    if (!Number.isFinite(editTenantId) || editTenantId <= 0) {
      return;
    }

    const tenant = tenantsQuery.data?.tenants.find(
      (item) => item.id === editTenantId,
    );

    if (!tenant) {
      return;
    }

    setEditingTenant(tenant);
    setShowForm(true);

    const nextSearchParams = new URLSearchParams(searchParams);

    nextSearchParams.delete("editTenant");

    setSearchParams(nextSearchParams, {
      replace: true,
    });
  }, [searchParams, setSearchParams, tenantsQuery.data]);

  const createTenantMutation = useMutation({
    ...tenantMutations.create,

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: tenantKeys.lists(),
        }),

        queryClient.invalidateQueries({
          queryKey: analyticsKeys.all,
        }),
      ]);

      handleCloseForm();
    },
  });

  const updateTenantMutation = useMutation({
    ...tenantMutations.update,

    onSuccess: async (updatedTenant) => {
      queryClient.setQueryData(
        tenantKeys.detail(updatedTenant.id),
        updatedTenant,
      );

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: tenantKeys.lists(),
        }),

        queryClient.invalidateQueries({
          queryKey: analyticsKeys.all,
        }),
      ]);

      handleCloseForm();
    },
  });

  const deleteTenantMutation = useMutation({
    ...tenantMutations.delete,

    onMutate: (tenantId) => {
      setDeletingTenantId(tenantId);
      setDeleteError("");
    },

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: tenantKeys.lists(),
        }),

        queryClient.invalidateQueries({
          queryKey: analyticsKeys.all,
        }),
      ]);
    },

    onError: () => {
      setDeleteError("Unable to delete tenant. Please try again.");
    },

    onSettled: () => {
      setDeletingTenantId(null);
    },
  });

  const statusMutation = useMutation({
    ...tenantMutations.updateStatus,

    onMutate: async ({ tenantId, status: nextStatus }) => {
      setStatusError("");

      await queryClient.cancelQueries({
        queryKey: tenantKeys.lists(),
      });

      await queryClient.cancelQueries({
        queryKey: tenantKeys.detail(tenantId),
      });

      const previousLists = queryClient.getQueriesData({
        queryKey: tenantKeys.lists(),
      });

      const previousDetail = queryClient.getQueryData<Tenant>(
        tenantKeys.detail(tenantId),
      );

      queryClient.setQueriesData(
        {
          queryKey: tenantKeys.lists(),
        },
        (oldData: unknown) => {
          if (!oldData || typeof oldData !== "object") {
            return oldData;
          }

          const data = oldData as {
            tenants: Tenant[];
            total: number;
            skip: number;
            limit: number;
          };

          return {
            ...data,

            tenants: data.tenants.map((tenant) =>
              tenant.id === tenantId
                ? {
                    ...tenant,
                    status: nextStatus,
                  }
                : tenant,
            ),
          };
        },
      );

      if (previousDetail) {
        queryClient.setQueryData<Tenant>(tenantKeys.detail(tenantId), {
          ...previousDetail,
          status: nextStatus,
        });
      }

      return {
        previousLists,
        previousDetail,
      };
    },

    onError: (_error, variables, context) => {
      if (context?.previousLists) {
        context.previousLists.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      if (context?.previousDetail) {
        queryClient.setQueryData(
          tenantKeys.detail(variables.tenantId),
          context.previousDetail,
        );
      }

      setStatusError(
        "Unable to update tenant status. The previous status has been restored.",
      );
    },

    onSuccess: (updatedTenant) => {
      queryClient.setQueryData(
        tenantKeys.detail(updatedTenant.id),
        updatedTenant,
      );
    },

    onSettled: async (_data, _error, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: tenantKeys.lists(),
        }),

        queryClient.invalidateQueries({
          queryKey: tenantKeys.detail(variables.tenantId),
        }),

        queryClient.invalidateQueries({
          queryKey: analyticsKeys.all,
        }),
      ]);
    },
  });

  const handleOpenCreateForm = () => {
    setEditingTenant(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTenant(null);
  };

  const handleFormSubmit = (input: CreateTenantInput) => {
    if (editingTenant) {
      updateTenantMutation.mutate({
        id: editingTenant.id,
        ...input,
      });

      return;
    }

    createTenantMutation.mutate(input);
  };

  const handleView = (tenantId: number) => {
    navigate(`/tenants/${tenantId}`);
  };

  const handlePrefetch = (tenantId: number) => {
    void queryClient.prefetchQuery(tenantQueries.detail(tenantId));
  };

  const handleEdit = (tenant: Tenant) => {
    setEditingTenant(tenant);
    setShowForm(true);
  };

  const handleDelete = (tenant: Tenant) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${tenant.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    deleteTenantMutation.mutate(tenant.id);
  };

  const handleStatusToggle = (tenant: Tenant) => {
    if (statusMutation.isPending) {
      return;
    }

    const nextStatus = tenant.status === "active" ? "inactive" : "active";

    statusMutation.mutate({
      tenantId: tenant.id,
      status: nextStatus,
    });
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handlePlanChange = (value: string) => {
    setPlan(value);
    setPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    setPage(1);
  };

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
  };

  const isFormSubmitting =
    createTenantMutation.isPending || updateTenantMutation.isPending;

  const isAnyMutationPending =
    createTenantMutation.isPending ||
    updateTenantMutation.isPending ||
    deleteTenantMutation.isPending ||
    statusMutation.isPending;

  const updatingTenantId = statusMutation.isPending
    ? (statusMutation.variables?.tenantId ?? null)
    : null;

  const total = tenantsQuery.data?.total ?? 0;

  const limit = tenantsQuery.data?.limit ?? 10;

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <main className="dashboard-page">
      <section className="dashboard-header">
        <div>
          <p className="section-eyebrow">Tenant Management</p>

          <h1>Tenants</h1>

          <p className="dashboard-subtitle">
            Manage organizations, subscriptions, users, and tenant account
            status.
          </p>
        </div>

        <div className="dashboard-header-actions">
          <button
            type="button"
            className="dashboard-primary-button"
            onClick={handleOpenCreateForm}
            disabled={isAnyMutationPending}
          >
            + Create Tenant
          </button>
        </div>
      </section>

      <section className="users-toolbar tenant-toolbar">
        <TenantFilters
          search={search}
          plan={plan}
          status={status}
          onSearchChange={handleSearchChange}
          onPlanChange={handlePlanChange}
          onStatusChange={handleStatusChange}
        />
      </section>

      {deleteError ? (
        <div className="tenant-message tenant-error-message" role="alert">
          {deleteError}
        </div>
      ) : null}

      {statusError ? (
        <div
          className="tenant-message tenant-status-error-message"
          role="alert"
        >
          {statusError}
        </div>
      ) : null}

      {tenantsQuery.isLoading ? (
        <section className="dashboard-state-card">
          <Loading />
        </section>
      ) : tenantsQuery.isError ? (
        <section className="dashboard-state-card">
          <ErrorState
            message="Unable to load tenants. Please try again."
            onRetry={() => {
              void tenantsQuery.refetch();
            }}
          />
        </section>
      ) : !tenantsQuery.data?.tenants.length ? (
        <section className="dashboard-state-card">
          <EmptyState
            message={
              debouncedSearch || plan || status
                ? "No tenants match the selected filters."
                : "There are no tenants available."
            }
          />
        </section>
      ) : (
        <>
          <section className="dashboard-content-card">
            <div className="users-table-header">
              <div>
                <p className="section-eyebrow">Tenant Directory</p>

                <h2>
                  {total} {total === 1 ? "Tenant" : "Tenants"}
                </h2>
              </div>

              {tenantsQuery.isFetching ? (
                <span className="users-updating-indicator">Updating...</span>
              ) : null}
            </div>

            <TenantTable
              tenants={tenantsQuery.data.tenants}
              updatingTenantId={updatingTenantId}
              onView={handleView}
              onViewHover={handlePrefetch}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusToggle={handleStatusToggle}
            />
          </section>

          <section className="users-pagination">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </section>
        </>
      )}

      {showForm ? (
        <TenantForm
          tenant={editingTenant}
          isSubmitting={isFormSubmitting}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseForm}
        />
      ) : null}

      {deletingTenantId !== null ? (
        <div className="tenant-delete-status" aria-live="polite">
          Deleting tenant...
        </div>
      ) : null}
    </main>
  );
}

export default TenantsPage;
