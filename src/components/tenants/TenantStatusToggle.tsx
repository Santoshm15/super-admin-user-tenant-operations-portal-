interface TenantStatusToggleProps {
  status: "active" | "inactive";
  isUpdating: boolean;
  onToggle: () => void;
}

function TenantStatusToggle({
  status,
  isUpdating,
  onToggle,
}: TenantStatusToggleProps) {
  const isActive = status === "active";

  return (
    <button
      type="button"
      className={`tenant-status-toggle ${
        isActive
          ? "tenant-status-toggle-active"
          : "tenant-status-toggle-inactive"
      }`}
      onClick={onToggle}
      disabled={isUpdating}
      aria-label={isActive ? "Deactivate tenant" : "Activate tenant"}
      aria-pressed={isActive}
    >
      <span className="tenant-status-toggle-track">
        <span className="tenant-status-toggle-thumb" />
      </span>

      <span className="tenant-status-toggle-label">
        {isUpdating ? "Updating..." : isActive ? "Active" : "Inactive"}
      </span>
    </button>
  );
}

export default TenantStatusToggle;
