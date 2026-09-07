interface UserStatusToggleProps {
  status: "active" | "inactive";
  isUpdating: boolean;
  onToggle: () => void;
}

function UserStatusToggle({
  status,
  isUpdating,
  onToggle,
}: UserStatusToggleProps) {
  const isActive = status === "active";

  return (
    <button
      type="button"
      className={`user-status-toggle ${
        isActive ? "user-status-toggle-active" : "user-status-toggle-inactive"
      }`}
      onClick={onToggle}
      disabled={isUpdating}
      aria-label={isActive ? "Deactivate user" : "Activate user"}
      aria-pressed={isActive}
    >
      <span className="user-status-toggle-track">
        <span className="user-status-toggle-thumb" />
      </span>

      <span className="user-status-toggle-label">
        {isUpdating ? "Updating..." : isActive ? "Active" : "Inactive"}
      </span>
    </button>
  );
}

export default UserStatusToggle;
