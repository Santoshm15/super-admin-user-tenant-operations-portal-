import { useQuery } from "@tanstack/react-query";

import type { AuditLog } from "../../types/auditLog.types";
import { userQueries } from "../../queries/userQueries";
import { tenantQueries } from "../../queries/tenantQueries";

interface AuditLogDetailsProps {
  auditLog: AuditLog;
}

function AuditLogDetails({ auditLog }: AuditLogDetailsProps) {
  const { data: relatedUser, isLoading: isUserLoading } = useQuery({
    ...userQueries.detail(auditLog.userId),
    enabled: !!auditLog.userId,
  });

  const { data: relatedTenant, isLoading: isTenantLoading } = useQuery({
    ...tenantQueries.detail(auditLog.tenantId),
    enabled: !!auditLog.tenantId,
  });

  return (
    <div className="audit-log-details">
      <div className="audit-log-details-grid">
        <div className="audit-log-detail-card">
          <span className="audit-log-detail-label">Action</span>
          <strong>{auditLog.action}</strong>
        </div>

        <div className="audit-log-detail-card">
          <span className="audit-log-detail-label">Timestamp</span>
          <strong>{new Date(auditLog.timestamp).toLocaleString()}</strong>
        </div>

        <div className="audit-log-detail-card">
          <span className="audit-log-detail-label">User</span>
          <strong>
            {isUserLoading
              ? "Loading..."
              : relatedUser
                ? `${relatedUser.firstName} ${relatedUser.lastName}`
                : auditLog.userName}
          </strong>
          <span className="audit-log-detail-secondary">
            User ID: {auditLog.userId}
          </span>
        </div>

        <div className="audit-log-detail-card">
          <span className="audit-log-detail-label">Tenant</span>
          <strong>
            {isTenantLoading
              ? "Loading..."
              : relatedTenant
                ? relatedTenant.name
                : auditLog.tenantName}
          </strong>
          <span className="audit-log-detail-secondary">
            Tenant ID: {auditLog.tenantId}
          </span>
        </div>

        <div className="audit-log-detail-card">
          <span className="audit-log-detail-label">Resource</span>
          <strong>{auditLog.resource}</strong>
        </div>

        <div className="audit-log-detail-card">
          <span className="audit-log-detail-label">Result</span>
          <strong>{auditLog.status}</strong>
        </div>
      </div>

      <div className="audit-log-value-section">
        <div className="audit-log-value-card">
          <span className="audit-log-detail-label">Previous Value</span>
          <pre>{auditLog.previousValue || "No previous value"}</pre>
        </div>

        <div className="audit-log-value-card">
          <span className="audit-log-detail-label">New Value</span>
          <pre>{auditLog.newValue || "No new value"}</pre>
        </div>
      </div>

      <div className="audit-log-error-section">
        <span className="audit-log-detail-label">Error Details</span>
        <p>
          {auditLog.status === "Failed"
            ? auditLog.details
            : "No errors reported."}
        </p>
      </div>
    </div>
  );
}

export default AuditLogDetails;
