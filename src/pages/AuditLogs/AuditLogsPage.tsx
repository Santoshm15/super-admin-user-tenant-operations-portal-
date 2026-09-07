import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import AuditLogFilters from "../../components/auditLogs/AuditLogFilters";
import AuditLogTable from "../../components/auditLogs/AuditLogTable";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import Loader from "../../components/common/Loader";
import useDebounce from "../../hooks/useDebounce";
import { auditLogQueries } from "../../queries/auditLogQueries";
import type { AuditLogFilters as AuditLogFiltersType } from "../../types/auditLog.types";

const PAGE_SIZE = 10;

function AuditLogsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState<AuditLogFiltersType>({
    search: "",
    userId: "",
    tenantId: "",
    action: "",
    status: "",
    startDate: "",
    endDate: "",
    page: 1,
  });

  const debouncedSearch = useDebounce(filters.search, 400);

  const queryFilters: AuditLogFiltersType = {
    ...filters,
    search: debouncedSearch,
  };

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery(
    auditLogQueries.list(queryFilters),
  );

  const updateFilter = (
    key: keyof Omit<AuditLogFiltersType, "page">,
    value: string,
  ) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [key]: value,
      page: 1,
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      page,
    }));
  };

  const handlePrefetch = (auditLogId: number) => {
    void queryClient.prefetchQuery(auditLogQueries.detail(auditLogId));
  };

  const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">System Activity</p>
          <h1>Audit Logs</h1>
          <p className="page-description">
            Search and review user and tenant activity.
          </p>
        </div>

        {isFetching && !isLoading ? (
          <span className="background-fetching-indicator">Updating...</span>
        ) : null}
      </div>

      <div className="audit-log-page">
        <AuditLogFilters
          search={filters.search}
          userId={filters.userId}
          tenantId={filters.tenantId}
          action={filters.action}
          status={filters.status}
          startDate={filters.startDate}
          endDate={filters.endDate}
          onSearchChange={(value) => updateFilter("search", value)}
          onUserIdChange={(value) => updateFilter("userId", value)}
          onTenantIdChange={(value) => updateFilter("tenantId", value)}
          onActionChange={(value) => updateFilter("action", value)}
          onStatusChange={(value) => updateFilter("status", value)}
          onStartDateChange={(value) => updateFilter("startDate", value)}
          onEndDateChange={(value) => updateFilter("endDate", value)}
        />

        {isLoading ? <Loader /> : null}

        {isError ? (
          <ErrorState
            message={
              error instanceof Error
                ? error.message
                : "Unable to load audit logs."
            }
            onRetry={() => {
              void refetch();
            }}
          />
        ) : null}

        {!isLoading && !isError && data && data.logs.length === 0 ? (
          <EmptyState message="No audit logs found for the selected filters." />
        ) : null}

        {!isLoading && !isError && data && data.logs.length > 0 ? (
          <>
            <AuditLogTable
              logs={data.logs}
              onView={(auditLogId) => {
                navigate(`/audit-logs/${auditLogId}`);
              }}
              onViewHover={handlePrefetch}
            />

            <div className="audit-log-pagination">
              <button
                type="button"
                className="audit-log-pagination-button"
                disabled={filters.page <= 1}
                onClick={() => handlePageChange(filters.page - 1)}
              >
                Previous
              </button>

              <span className="audit-log-pagination-info">
                Page {filters.page} of {totalPages}
              </span>

              <button
                type="button"
                className="audit-log-pagination-button"
                disabled={filters.page >= totalPages}
                onClick={() => handlePageChange(filters.page + 1)}
              >
                Next
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default AuditLogsPage;
