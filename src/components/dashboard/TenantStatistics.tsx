interface TenantStatisticsProps {
  totalTenants: number;
  activeTenants: number;
  inactiveTenants: number;
}

function TenantStatistics({
  totalTenants,
  activeTenants,
  inactiveTenants,
}: TenantStatisticsProps) {
  return (
    <section className="statistics-section">
      <div className="section-header">
        <div>
          <p className="section-eyebrow">Overview</p>
          <h2>Tenant Statistics</h2>
        </div>
      </div>

      <div className="statistics-grid">
        <div className="statistics-item">
          <span className="statistics-label">Total Tenants</span>
          <strong className="statistics-value">{totalTenants}</strong>
        </div>

        <div className="statistics-item">
          <span className="statistics-label">Active Tenants</span>
          <strong className="statistics-value">{activeTenants}</strong>
        </div>

        <div className="statistics-item">
          <span className="statistics-label">Inactive Tenants</span>
          <strong className="statistics-value">{inactiveTenants}</strong>
        </div>
      </div>
    </section>
  );
}

export default TenantStatistics;
