interface TenantFiltersProps {
  search: string;
  plan: string;
  status: string;
  onSearchChange: (value: string) => void;
  onPlanChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

function TenantFilters({
  search,
  plan,
  status,
  onSearchChange,
  onPlanChange,
  onStatusChange,
}: TenantFiltersProps) {
  return (
    <div className="tenant-filters">
      <input
        type="search"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search tenants..."
        className="tenant-search"
      />

      <select
        value={plan}
        onChange={(event) => onPlanChange(event.target.value)}
        className="tenant-filter-select"
      >
        <option value="">All Plans</option>
        <option value="Basic">Basic</option>
        <option value="Pro">Pro</option>
        <option value="Enterprise">Enterprise</option>
      </select>

      <select
        value={status}
        onChange={(event) => onStatusChange(event.target.value)}
        className="tenant-filter-select"
      >
        <option value="">All Statuses</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
    </div>
  );
}

export default TenantFilters;
