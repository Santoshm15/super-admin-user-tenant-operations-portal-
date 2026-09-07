interface EmptyStateProps {
  message?: string;
}

function EmptyState({ message = "No data available." }: EmptyStateProps) {
  return (
    <div className="common-empty-state">
      <div className="common-empty-icon" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <div className="common-empty-content">
        <h3>No results found</h3>
        <p>{message}</p>
      </div>
    </div>
  );
}

export default EmptyState;
