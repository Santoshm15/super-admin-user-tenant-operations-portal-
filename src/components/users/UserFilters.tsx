interface UserFiltersProps {
  search: string;
  role: string;
  status: string;
  tenantId: string;
  onSearchChange: (value: string) => void;
  onRoleChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onTenantChange: (value: string) => void;
}

function UserFilters({
  search,
  role,
  status,
  tenantId,
  onSearchChange,
  onRoleChange,
  onStatusChange,
  onTenantChange,
}: UserFiltersProps) {
  return (
    <div className="users-filters">
      <input
        type="search"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search users..."
        className="users-search"
      />

      <select
        value={role}
        onChange={(event) => onRoleChange(event.target.value)}
        className="users-filter-select"
      >
        <option value="">All Roles</option>
        <option value="admin">Admin</option>
        <option value="moderator">Moderator</option>
        <option value="user">User</option>
      </select>

      <select
        value={status}
        onChange={(event) => onStatusChange(event.target.value)}
        className="users-filter-select"
      >
        <option value="">All Statuses</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>

      <select
        value={tenantId}
        onChange={(event) => onTenantChange(event.target.value)}
        className="users-filter-select"
      >
        <option value="">All Tenants</option>
        <option value="1">Tenant 1</option>
        <option value="2">Tenant 2</option>
        <option value="3">Tenant 3</option>
      </select>
    </div>
  );
}

export default UserFilters;
