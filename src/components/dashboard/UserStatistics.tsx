interface UserStatisticsProps {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
}

function UserStatistics({
  totalUsers,
  activeUsers,
  inactiveUsers,
}: UserStatisticsProps) {
  return (
    <section className="statistics-section">
      <div className="section-header">
        <div>
          <p className="section-eyebrow">Overview</p>
          <h2>User Statistics</h2>
        </div>
      </div>

      <div className="statistics-grid">
        <div className="statistics-item">
          <span className="statistics-label">Total Users</span>
          <strong className="statistics-value">{totalUsers}</strong>
        </div>

        <div className="statistics-item">
          <span className="statistics-label">Active Users</span>
          <strong className="statistics-value">{activeUsers}</strong>
        </div>

        <div className="statistics-item">
          <span className="statistics-label">Inactive Users</span>
          <strong className="statistics-value">{inactiveUsers}</strong>
        </div>
      </div>
    </section>
  );
}

export default UserStatistics;
