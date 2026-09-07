interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

function ErrorState({
  message = "Something went wrong while loading the data.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="common-error-state" role="alert">
      <div className="common-error-icon" aria-hidden="true">
        !
      </div>

      <div className="common-error-content">
        <h3>Unable to load data</h3>
        <p>{message}</p>

        {onRetry ? (
          <button
            type="button"
            className="common-error-retry"
            onClick={onRetry}
          >
            Try Again
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default ErrorState;
