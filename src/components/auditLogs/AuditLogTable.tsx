import type { AuditLog } from "../../types/auditLog.types";

interface AuditLogTableProps {
  logs: AuditLog[];
  onView: (auditLogId: number) => void;
  onViewHover: (auditLogId: number) => void;
}

function AuditLogTable({ logs, onView, onViewHover }: AuditLogTableProps) {
  return (
    <div className="audit-log-table-wrapper">
      <table className="audit-log-table">
        <thead>
          <tr>
            <th>Time</th>
            <th>User</th>
            <th>Tenant</th>
            <th>Action</th>
            <th>Status</th>
            <th>Details</th>
          </tr>
        </thead>

        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td>{new Date(log.timestamp).toLocaleString()}</td>

              <td>{log.userName}</td>

              <td>{log.tenantName}</td>

              <td>{log.action}</td>

              <td>
                <span
                  className={`audit-log-status audit-log-status-${log.status.toLowerCase()}`}
                >
                  {log.status}
                </span>
              </td>

              <td>
                <button
                  type="button"
                  className="audit-log-view-button"
                  onMouseEnter={() => onViewHover(log.id)}
                  onFocus={() => onViewHover(log.id)}
                  onClick={() => onView(log.id)}
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AuditLogTable;
