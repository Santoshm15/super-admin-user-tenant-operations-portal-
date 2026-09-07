import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

import Loading from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";
import { tenantQueries } from "../../queries/tenantQueries";

function TenantDetailsPage() {
  const navigate = useNavigate();
  const { tenantId } = useParams<{ tenantId: string }>();

  const id = Number(tenantId);

  const tenantQuery = useQuery({
    ...tenantQueries.detail(id),
    enabled: Number.isFinite(id) && id > 0,
  });

  const tenantUsersQuery = useQuery({
    ...tenantQueries.users(id),
    enabled: Number.isFinite(id) && id > 0,
  });

  if (!tenantId || !Number.isFinite(id) || id <= 0) {
    return (
      <div className="page-container">
        <ErrorState message="Invalid tenant ID." />
      </div>
    );
  }

  if (tenantQuery.isLoading) {
    return (
      <div className="page-container">
        <Loading />
      </div>
    );
  }

  if (tenantQuery.isError) {
    return (
      <div className="page-container">
        <ErrorState
          message="Unable to load tenant details."
          onRetry={() => tenantQuery.refetch()}
        />
      </div>
    );
  }

  const tenant = tenantQuery.data;

  if (!tenant) {
    return (
      <div className="page-container">
        <ErrorState message="Tenant details were not found." />
      </div>
    );
  }

  return (
    <div className="page-container tenant-details-page">
      <div className="tenant-details-topbar">
        <button
          type="button"
          className="tenant-back-button"
          onClick={() => navigate(`/tenants?editTenant=${tenant.id}`)}
        >
          ← Back to Tenants
        </button>

        <div className="tenant-details-topbar-actions">
          {tenantQuery.isFetching ? (
            <span className="updating-indicator">Updating...</span>
          ) : null}

          <button
            type="button"
            className="tenant-details-edit-button"
            onClick={() => navigate("/tenants")}
          >
            Edit Tenant
          </button>
        </div>
      </div>

      <div className="page-header tenant-details-header">
        <div>
          <span className="page-eyebrow">Tenant Details</span>

          <h1>{tenant.name}</h1>

          <p>
            View tenant information, subscription details, account status and
            related users.
          </p>
        </div>

        <span
          className={`tenant-details-status ${
            tenant.status === "active"
              ? "tenant-details-status-active"
              : "tenant-details-status-inactive"
          }`}
        >
          <span className="tenant-details-status-dot" />

          {tenant.status === "active" ? "Active" : "Inactive"}
        </span>
      </div>

      <div className="tenant-details-grid">
        <section className="content-card tenant-details-card">
          <div className="tenant-details-card-header">
            <div>
              <span className="tenant-details-card-label">Organization</span>

              <h2>Tenant Information</h2>
            </div>
          </div>

          <div className="tenant-details-info-grid">
            <div className="tenant-details-info-item">
              <span>Tenant Name</span>
              <strong>{tenant.name}</strong>
            </div>

            <div className="tenant-details-info-item">
              <span>Slug</span>
              <strong>{tenant.slug}</strong>
            </div>

            <div className="tenant-details-info-item">
              <span>Email</span>
              <strong>{tenant.email}</strong>
            </div>

            <div className="tenant-details-info-item">
              <span>Phone</span>
              <strong>{tenant.phone}</strong>
            </div>

            <div className="tenant-details-info-item">
              <span>Plan</span>
              <strong>{tenant.plan}</strong>
            </div>

            <div className="tenant-details-info-item">
              <span>Users</span>
              <strong>{tenant.userCount}</strong>
            </div>
          </div>
        </section>

        <section className="content-card tenant-details-card">
          <div className="tenant-details-card-header">
            <div>
              <span className="tenant-details-card-label">Subscription</span>

              <h2>Plan Overview</h2>
            </div>
          </div>

          <div className="tenant-plan-highlight">
            <div>
              <span>Current Plan</span>
              <strong>{tenant.plan}</strong>
            </div>

            <div className="tenant-plan-user-count">
              <strong>{tenant.userCount}</strong>
              <span>Users</span>
            </div>
          </div>
        </section>

        <section className="content-card tenant-details-card">
          <div className="tenant-details-card-header">
            <div>
              <span className="tenant-details-card-label">Account</span>

              <h2>Account Status</h2>
            </div>
          </div>

          <div className="tenant-account-status">
            <div
              className={`tenant-account-status-icon ${
                tenant.status === "active"
                  ? "tenant-account-status-icon-active"
                  : "tenant-account-status-icon-inactive"
              }`}
            >
              {tenant.status === "active" ? "✓" : "!"}
            </div>

            <div>
              <strong>
                {tenant.status === "active"
                  ? "Tenant is active"
                  : "Tenant is inactive"}
              </strong>

              <p>
                {tenant.status === "active"
                  ? "This tenant currently has an active account."
                  : "This tenant account is currently inactive."}
              </p>
            </div>
          </div>
        </section>

        <section className="content-card tenant-details-card">
          <div className="tenant-details-card-header">
            <div>
              <span className="tenant-details-card-label">Timeline</span>

              <h2>Account Dates</h2>
            </div>
          </div>

          <div className="tenant-details-info-grid">
            <div className="tenant-details-info-item">
              <span>Created</span>

              <strong>{new Date(tenant.createdAt).toLocaleDateString()}</strong>
            </div>

            <div className="tenant-details-info-item">
              <span>Last Updated</span>

              <strong>{new Date(tenant.updatedAt).toLocaleDateString()}</strong>
            </div>
          </div>
        </section>
      </div>

      <section className="content-card tenant-related-users-card">
        <div className="tenant-related-users-header">
          <div>
            <span className="tenant-details-card-label">Related Data</span>

            <h2>Tenant Users</h2>

            <p>Users associated with this tenant.</p>
          </div>

          {tenantUsersQuery.data ? (
            <span className="tenant-related-users-count">
              {tenantUsersQuery.data.total} Users
            </span>
          ) : null}
        </div>

        {tenantUsersQuery.isLoading ? (
          <Loading />
        ) : tenantUsersQuery.isError ? (
          <ErrorState
            message="Unable to load tenant users."
            onRetry={() => tenantUsersQuery.refetch()}
          />
        ) : tenantUsersQuery.data?.users.length ? (
          <div className="tenant-related-users-list">
            {tenantUsersQuery.data.users.map((user) => (
              <div className="tenant-related-user-row" key={user.id}>
                <div className="tenant-related-user-avatar">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={`${user.firstName} ${user.lastName}`}
                    />
                  ) : (
                    <span>
                      {user.firstName.charAt(0)}
                      {user.lastName.charAt(0)}
                    </span>
                  )}
                </div>

                <div className="tenant-related-user-info">
                  <strong>
                    {user.firstName} {user.lastName}
                  </strong>

                  <span>{user.email}</span>
                </div>

                <button
                  type="button"
                  className="tenant-related-user-view"
                  onClick={() => navigate(`/users/${user.id}`)}
                >
                  View User
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="tenant-related-users-empty">
            <strong>No users found</strong>

            <span>
              There are currently no users associated with this tenant.
            </span>
          </div>
        )}
      </section>
    </div>
  );
}

export default TenantDetailsPage;
