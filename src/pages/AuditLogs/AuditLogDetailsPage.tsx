import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";

import AuditLogDetails from "../../components/auditLogs/AuditLogDetails";
import ErrorState from "../../components/common/ErrorState";
import Loader from "../../components/common/Loader";
import { auditLogQueries } from "../../queries/auditLogQueries";

function AuditLogDetailsPage() {
  const { auditLogId } = useParams();

  const id = Number(auditLogId);

  const {
    data: auditLog,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    ...auditLogQueries.detail(id),
    enabled: Number.isInteger(id) && id > 0,
  });

  if (!Number.isInteger(id) || id <= 0) {
    return (
      <div className="page-container">
        <ErrorState message="Invalid audit log ID." />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="page-container">
        <Loader />
      </div>
    );
  }

  if (isError || !auditLog) {
    return (
      <div className="page-container">
        <ErrorState
          message={
            error instanceof Error
              ? error.message
              : "Unable to load audit log details."
          }
          onRetry={() => {
            void refetch();
          }}
        />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Audit Logs</p>
          <h1>Audit Log Details</h1>
          <p className="page-description">
            Review the complete details of this activity.
          </p>
        </div>

        <Link to="/audit-logs" className="page-header-back-button">
          Back to Audit Logs
        </Link>
      </div>

      <AuditLogDetails auditLog={auditLog} />
    </div>
  );
}

export default AuditLogDetailsPage;
