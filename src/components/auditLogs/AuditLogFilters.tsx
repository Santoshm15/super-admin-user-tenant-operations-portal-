interface AuditLogFiltersProps {
  search: string;
  userId: string;
  tenantId: string;
  action: string;
  status: string;
  startDate: string;
  endDate: string;
  onSearchChange: (value: string) => void;
  onUserIdChange: (value: string) => void;
  onTenantIdChange: (value: string) => void;
  onActionChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
}

function AuditLogFilters({
  search,
  userId,
  tenantId,
  action,
  status,
  startDate,
  endDate,
  onSearchChange,
  onUserIdChange,
  onTenantIdChange,
  onActionChange,
  onStatusChange,
  onStartDateChange,
  onEndDateChange,
}: AuditLogFiltersProps) {
  return (
    <div className="audit-log-filters">
      <div className="audit-log-filter-group audit-log-search-group">
        <label htmlFor="audit-log-search">Search</label>

        <input
          id="audit-log-search"
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search user, tenant or action..."
        />
      </div>

      <div className="audit-log-filter-group">
        <label htmlFor="audit-log-user">User</label>

        <input
          id="audit-log-user"
          type="text"
          value={userId}
          onChange={(event) => onUserIdChange(event.target.value)}
          placeholder="User ID"
        />
      </div>

      <div className="audit-log-filter-group">
        <label htmlFor="audit-log-tenant">Tenant</label>

        <input
          id="audit-log-tenant"
          type="text"
          value={tenantId}
          onChange={(event) => onTenantIdChange(event.target.value)}
          placeholder="Tenant ID"
        />
      </div>

      <div className="audit-log-filter-group">
        <label htmlFor="audit-log-action">Action</label>

        <select
          id="audit-log-action"
          value={action}
          onChange={(event) => onActionChange(event.target.value)}
        >
          <option value="">All Actions</option>
          <option value="User Login">User Login</option>
          <option value="User Created">User Created</option>
          <option value="User Updated">User Updated</option>
          <option value="User Deleted">User Deleted</option>
          <option value="Tenant Created">Tenant Created</option>
          <option value="Tenant Updated">Tenant Updated</option>
          <option value="Tenant Deleted">Tenant Deleted</option>
          <option value="Status Changed">Status Changed</option>
        </select>
      </div>

      <div className="audit-log-filter-group">
        <label htmlFor="audit-log-status">Status</label>

        <select
          id="audit-log-status"
          value={status}
          onChange={(event) => onStatusChange(event.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Success">Success</option>
          <option value="Failed">Failed</option>
        </select>
      </div>

      <div className="audit-log-filter-group">
        <label htmlFor="audit-log-start-date">Start Date</label>

        <input
          id="audit-log-start-date"
          type="date"
          value={startDate}
          onChange={(event) => onStartDateChange(event.target.value)}
        />
      </div>

      <div className="audit-log-filter-group">
        <label htmlFor="audit-log-end-date">End Date</label>

        <input
          id="audit-log-end-date"
          type="date"
          value={endDate}
          onChange={(event) => onEndDateChange(event.target.value)}
        />
      </div>
    </div>
  );
}

export default AuditLogFilters;
