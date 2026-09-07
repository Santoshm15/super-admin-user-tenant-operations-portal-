import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { userQueries } from "../../queries/userQueries";

function UserDetailsPage() {
  const navigate = useNavigate();
  const { userId } = useParams();

  const parsedUserId = Number(userId);

  const hasValidUserId = Number.isInteger(parsedUserId) && parsedUserId > 0;

  const {
    data: user,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    ...userQueries.detail(parsedUserId),
    enabled: hasValidUserId,
  });

  const {
    data: activityData,
    isLoading: isActivityLoading,
    isError: isActivityError,
  } = useQuery({
    ...userQueries.activity(parsedUserId),
    enabled: hasValidUserId,
  });

  if (isLoading) {
    return (
      <main className="dashboard-page">
        <div className="dashboard-loading">
          <div className="dashboard-loading-spinner" />
          <p>Loading user details...</p>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="dashboard-page">
        <div className="dashboard-error">
          <h2>Unable to load user</h2>

          <p>
            {error instanceof Error
              ? error.message
              : "Something went wrong while loading this user."}
          </p>

          <button type="button" onClick={() => refetch()}>
            Try Again
          </button>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="dashboard-page">
        <div className="dashboard-empty">
          <h2>User not found</h2>

          <p>The requested user could not be found.</p>

          <button type="button" onClick={() => navigate("/users")}>
            Back to Users
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">User Management</p>

          <h1>
            {user.firstName} {user.lastName}
          </h1>

          <p className="dashboard-subtitle">
            Complete user profile and account information.
          </p>
        </div>

        <div className="dashboard-actions">
          <button
            type="button"
            className="dashboard-refresh-button"
            onClick={() => navigate("/users")}
          >
            Back to Users
          </button>
        </div>
      </header>

      <section className="user-details-card">
        <div className="user-details-header">
          <div className="user-details-avatar">
            {user.firstName.charAt(0)}
            {user.lastName.charAt(0)}
          </div>

          <div className="user-details-heading">
            <h2>
              {user.firstName} {user.lastName}
            </h2>

            <p>@{user.username}</p>
          </div>

          <span className={`user-status user-status-${user.status}`}>
            {user.status}
          </span>
        </div>

        <div className="user-details-grid">
          <div className="user-detail-item">
            <span>Email</span>
            <strong>{user.email}</strong>
          </div>

          <div className="user-detail-item">
            <span>Phone</span>
            <strong>{user.phone}</strong>
          </div>

          <div className="user-detail-item">
            <span>Gender</span>
            <strong>{user.gender}</strong>
          </div>

          <div className="user-detail-item">
            <span>Birth Date</span>
            <strong>{user.birthDate}</strong>
          </div>

          <div className="user-detail-item">
            <span>Age</span>
            <strong>{user.age}</strong>
          </div>

          <div className="user-detail-item">
            <span>Role</span>
            <strong>{user.role}</strong>
          </div>
        </div>
      </section>

      <section className="user-details-card">
        <div className="section-header">
          <div>
            <p className="section-eyebrow">Organization</p>

            <h2>Company Information</h2>
          </div>
        </div>

        <div className="user-details-grid">
          <div className="user-detail-item">
            <span>Company</span>
            <strong>{user.company.name}</strong>
          </div>

          <div className="user-detail-item">
            <span>Job Title</span>
            <strong>{user.company.title}</strong>
          </div>

          <div className="user-detail-item">
            <span>Department</span>
            <strong>{user.company.department}</strong>
          </div>

          <div className="user-detail-item">
            <span>University</span>
            <strong>{user.university}</strong>
          </div>
        </div>
      </section>

      <section className="user-details-card">
        <div className="section-header">
          <div>
            <p className="section-eyebrow">Location</p>

            <h2>Address</h2>
          </div>
        </div>

        <div className="user-details-grid">
          <div className="user-detail-item">
            <span>Address</span>
            <strong>{user.address.address}</strong>
          </div>

          <div className="user-detail-item">
            <span>City</span>
            <strong>{user.address.city}</strong>
          </div>

          <div className="user-detail-item">
            <span>State</span>
            <strong>{user.address.state}</strong>
          </div>

          <div className="user-detail-item">
            <span>Country</span>
            <strong>{user.address.country}</strong>
          </div>

          <div className="user-detail-item">
            <span>Postal Code</span>
            <strong>{user.address.postalCode}</strong>
          </div>
        </div>
      </section>

      <section className="user-details-card">
        <div className="section-header">
          <div>
            <p className="section-eyebrow">Account History</p>

            <h2>User Activity</h2>
          </div>
        </div>

        {isActivityLoading ? (
          <div className="activity-state">
            <p>Loading user activity...</p>
          </div>
        ) : isActivityError ? (
          <div className="activity-state">
            <p>Unable to load user activity.</p>
          </div>
        ) : !activityData || activityData.activities.length === 0 ? (
          <div className="activity-state">
            <p>No activity available for this user.</p>
          </div>
        ) : (
          <div className="activity-list">
            {activityData.activities.map((activity) => (
              <div className="activity-item" key={activity.id}>
                <div className="activity-content">
                  <strong>{activity.action}</strong>

                  <span>User ID: {activity.userId}</span>
                </div>

                <div className="activity-meta">
                  <span
                    className={`activity-status activity-status-${activity.status.toLowerCase()}`}
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
    </main>
  );
}

export default UserDetailsPage;
