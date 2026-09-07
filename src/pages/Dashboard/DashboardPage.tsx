import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import { analyticsQueries } from "../../queries/analyticsQueries";

function DashboardPage() {
  const {
    data: analytics,
    isLoading: isAnalyticsLoading,
    isFetching: isAnalyticsFetching,
    isError: isAnalyticsError,
    error: analyticsError,
    refetch: refetchAnalytics,
    dataUpdatedAt: analyticsUpdatedAt,
  } = useQuery(analyticsQueries.dashboard());

  const {
    data: recentActivity,
    isLoading: isActivityLoading,
    isFetching: isActivityFetching,
    isError: isActivityError,
    error: activityError,
    refetch: refetchActivity,
  } = useQuery(analyticsQueries.recentActivity());

  const isInitialLoading = isAnalyticsLoading || isActivityLoading;

  const isFetching = isAnalyticsFetching || isActivityFetching;

  const handleRefresh = async () => {
    await Promise.all([refetchAnalytics(), refetchActivity()]);
  };

  if (isInitialLoading) {
    return (
      <main className="dashboard-page">
        <div className="dashboard-loading">
          <div className="dashboard-loading-spinner" />
          <span>Loading dashboard...</span>
        </div>
      </main>
    );
  }

  if (isAnalyticsError) {
    return (
      <main className="dashboard-page">
        <div className="dashboard-error">
          <h2>Unable to load dashboard</h2>
          <p>
            {analyticsError instanceof Error
              ? analyticsError.message
              : "Something went wrong while loading dashboard data."}
          </p>

          <button
            type="button"
            className="dashboard-primary-button"
            onClick={() => {
              void handleRefresh();
            }}
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  if (!analytics) {
    return (
      <main className="dashboard-page">
        <div className="dashboard-empty">
          <h2>No dashboard data available</h2>
          <p>Dashboard statistics are currently unavailable.</p>
        </div>
      </main>
    );
  }

  const formattedMonthlyRevenue = `$${analytics.monthlyRevenue.toLocaleString()}`;

  const formattedYearlyRevenue = `$${analytics.yearlyRevenue.toLocaleString()}`;

  return (
    <main className="dashboard-page">
      {/* HEADER */}
      <section className="dashboard-header">
        <div className="dashboard-header-content">
          <p className="section-eyebrow">SUPER ADMIN</p>

          <h1>Dashboard</h1>

          <p className="dashboard-subtitle">
            Monitor users, tenants, revenue, and recent activity.
          </p>

          {analyticsUpdatedAt > 0 && (
            <p className="dashboard-last-updated">
              Last updated {new Date(analyticsUpdatedAt).toLocaleString()}
            </p>
          )}
        </div>

        <div className="dashboard-actions">
          {/* USER BUTTON */}
          <Link
            to="/users"
            className="dashboard-navigation-button dashboard-navigation-users"
          >
            <span className="dashboard-navigation-icon">👤</span>
            <span>Users</span>
          </Link>

          {/* TENANT BUTTON */}
          <Link
            to="/tenants"
            className="dashboard-navigation-button dashboard-navigation-tenants"
          >
            <span className="dashboard-navigation-icon">🏢</span>
            <span>Tenants</span>
          </Link>

          {/* AUDIT LOG BUTTON */}
          <Link
            to="/audit-logs"
            className="dashboard-navigation-button dashboard-navigation-audit"
          >
            <span className="dashboard-navigation-icon">📋</span>
            <span>Audit Logs</span>
          </Link>

          {/* REFRESH BUTTON */}
          <button
            type="button"
            className="dashboard-refresh-button"
            onClick={() => {
              void handleRefresh();
            }}
            disabled={isFetching}
          >
            {isFetching ? "Updating..." : "Refresh"}
          </button>
        </div>
      </section>

      {/* TOP STATISTICS */}
      <section className="dashboard-stats">
        <article className="dashboard-stat-card">
          <div className="dashboard-stat-card-top">
            <span className="dashboard-stat-label">Total Users</span>
            <span className="dashboard-stat-icon dashboard-stat-icon-users">
              👤
            </span>
          </div>

          <strong className="dashboard-stat-value">
            {analytics.totalUsers.toLocaleString()}
          </strong>

          <span className="dashboard-stat-description">
            All registered users
          </span>
        </article>

        <article className="dashboard-stat-card">
          <div className="dashboard-stat-card-top">
            <span className="dashboard-stat-label">Active Users</span>
            <span className="dashboard-stat-icon dashboard-stat-icon-active">
              ✓
            </span>
          </div>

          <strong className="dashboard-stat-value">
            {analytics.activeUsers.toLocaleString()}
          </strong>

          <span className="dashboard-stat-description">
            Currently active users
          </span>
        </article>

        <article className="dashboard-stat-card">
          <div className="dashboard-stat-card-top">
            <span className="dashboard-stat-label">Total Tenants</span>
            <span className="dashboard-stat-icon dashboard-stat-icon-tenants">
              🏢
            </span>
          </div>

          <strong className="dashboard-stat-value">
            {analytics.totalTenants.toLocaleString()}
          </strong>

          <span className="dashboard-stat-description">
            All registered tenants
          </span>
        </article>

        <article className="dashboard-stat-card">
          <div className="dashboard-stat-card-top">
            <span className="dashboard-stat-label">Monthly Revenue</span>
            <span className="dashboard-stat-icon dashboard-stat-icon-revenue">
              $
            </span>
          </div>

          <strong className="dashboard-stat-value">
            {formattedMonthlyRevenue}
          </strong>

          <span className="dashboard-stat-description">
            Current monthly revenue
          </span>
        </article>
      </section>

      {/* USER STATISTICS */}
      <section className="dashboard-content-card">
        <div className="dashboard-section-header">
          <div>
            <p className="section-eyebrow">OVERVIEW</p>
            <h2>User Statistics</h2>
          </div>
        </div>

        <div className="dashboard-statistics-grid">
          <div className="dashboard-statistics-item">
            <span>Total Users</span>
            <strong>{analytics.totalUsers.toLocaleString()}</strong>
          </div>

          <div className="dashboard-statistics-item">
            <span>Active Users</span>
            <strong className="dashboard-success-number">
              {analytics.activeUsers.toLocaleString()}
            </strong>
          </div>

          <div className="dashboard-statistics-item">
            <span>Inactive Users</span>
            <strong className="dashboard-warning-number">
              {analytics.inactiveUsers.toLocaleString()}
            </strong>
          </div>
        </div>
      </section>

      {/* TENANT STATISTICS */}
      <section className="dashboard-content-card">
        <div className="dashboard-section-header">
          <div>
            <p className="section-eyebrow">OVERVIEW</p>
            <h2>Tenant Statistics</h2>
          </div>
        </div>

        <div className="dashboard-statistics-grid">
          <div className="dashboard-statistics-item">
            <span>Total Tenants</span>
            <strong>{analytics.totalTenants.toLocaleString()}</strong>
          </div>

          <div className="dashboard-statistics-item">
            <span>Active Tenants</span>
            <strong className="dashboard-success-number">
              {analytics.activeTenants.toLocaleString()}
            </strong>
          </div>

          <div className="dashboard-statistics-item">
            <span>Inactive Tenants</span>
            <strong className="dashboard-warning-number">
              {analytics.inactiveTenants.toLocaleString()}
            </strong>
          </div>
        </div>
      </section>

      {/* REVENUE */}
      <section className="dashboard-content-card">
        <div className="dashboard-section-header">
          <div>
            <p className="section-eyebrow">SUBSCRIPTION</p>
            <h2>Revenue Overview</h2>
          </div>
        </div>

        <div className="dashboard-revenue-grid">
          <div className="dashboard-revenue-item">
            <span>Monthly Revenue</span>
            <strong>{formattedMonthlyRevenue}</strong>
          </div>

          <div className="dashboard-revenue-item">
            <span>Yearly Revenue</span>
            <strong>{formattedYearlyRevenue}</strong>
          </div>
        </div>
      </section>

      {/* RECENT ACTIVITY */}
      <section className="dashboard-content-card">
        <div className="dashboard-section-header">
          <div>
            <p className="section-eyebrow">LATEST</p>
            <h2>Recent Activity</h2>
          </div>

          {isActivityFetching && (
            <span className="dashboard-updating-indicator">Updating...</span>
          )}
        </div>

        {isActivityError ? (
          <div className="dashboard-activity-error">
            <p>
              {activityError instanceof Error
                ? activityError.message
                : "Unable to load recent activity."}
            </p>

            <button
              type="button"
              className="dashboard-secondary-button"
              onClick={() => {
                void refetchActivity();
              }}
            >
              Try Again
            </button>
          </div>
        ) : !recentActivity || recentActivity.length === 0 ? (
          <div className="activity-state">No recent activity available.</div>
        ) : (
          <div className="activity-list">
            {recentActivity.map((activity) => (
              <div className="activity-item" key={activity.id}>
                <div className="activity-content">
                  <strong>{activity.userName}</strong>
                  <span>{activity.action}</span>
                </div>

                <div className="activity-meta">
                  <span
                    className={`activity-status ${
                      activity.status === "Success"
                        ? "activity-status-success"
                        : "activity-status-failed"
                    }`}
                  >
                    {activity.status}
                  </span>

                  <time dateTime={activity.timestamp}>
                    {new Date(activity.timestamp).toLocaleString()}
                  </time>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <footer className="dashboard-footer">
        Super Admin User & Tenant Operations Portal
      </footer>
    </main>
  );
}

export default DashboardPage;
