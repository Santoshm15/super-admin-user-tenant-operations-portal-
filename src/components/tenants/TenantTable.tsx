import type { Tenant } from "../../types/tenant.types";

interface TenantTableProps {
  tenants: Tenant[];
  updatingTenantId: number | null;
  onView: (tenantId: number) => void;
  onViewHover: (tenantId: number) => void;
  onEdit: (tenant: Tenant) => void;
  onDelete: (tenant: Tenant) => void;
  onStatusToggle: (tenant: Tenant) => void;
}

function TenantTable({
  tenants,
  updatingTenantId,
  onView,
  onViewHover,
  onEdit,
  onDelete,
  onStatusToggle,
}: TenantTableProps) {
  return (
    <div className="tenants-table-wrapper">
      <table className="tenants-table">
        <thead>
          <tr>
            <th>Tenant</th>
            <th>Tenant ID</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Plan</th>
            <th>Users</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {tenants.map((tenant) => {
            const isUpdating = updatingTenantId === tenant.id;

            return (
              <tr key={tenant.id}>
                <td>
                  <div className="tenant-name-cell">
                    <strong>{tenant.name}</strong>
                    <span>{tenant.slug}</span>
                  </div>
                </td>

                <td>
                  <span className="tenant-id-cell">#{tenant.id}</span>
                </td>

                <td>{tenant.email}</td>

                <td>{tenant.phone}</td>

                <td>
                  <span className="tenant-plan-badge">{tenant.plan}</span>
                </td>

                <td>
                  <strong className="tenant-users-count">
                    {tenant.userCount}
                  </strong>
                </td>

                <td>
                  <button
                    type="button"
                    className={`tenant-status-toggle ${
                      tenant.status === "active"
                        ? "tenant-status-toggle-active"
                        : "tenant-status-toggle-inactive"
                    }`}
                    onClick={() => onStatusToggle(tenant)}
                    disabled={isUpdating}
                    aria-label={`Change ${tenant.name} status`}
                  >
                    <span className="tenant-status-toggle-track">
                      <span className="tenant-status-toggle-thumb" />
                    </span>

                    <span className="tenant-status-toggle-label">
                      {isUpdating ? "Updating..." : tenant.status}
                    </span>
                  </button>
                </td>

                <td>
                  <span className="tenant-created-date">
                    {new Date(tenant.createdAt).toLocaleDateString()}
                  </span>
                </td>

                <td>
                  <div className="tenant-actions">
                    <button
                      type="button"
                      className="tenant-action-button tenant-view-button"
                      onMouseEnter={() => onViewHover(tenant.id)}
                      onFocus={() => onViewHover(tenant.id)}
                      onClick={() => onView(tenant.id)}
                    >
                      View
                    </button>

                    <button
                      type="button"
                      className="tenant-action-button tenant-edit-button"
                      onClick={() => onEdit(tenant)}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="tenant-action-button tenant-delete-button"
                      onClick={() => onDelete(tenant)}
                      disabled={isUpdating}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default TenantTable;
