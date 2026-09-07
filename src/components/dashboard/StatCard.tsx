interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
}

function StatCard({ title, value, description }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="stat-card-content">
        <p className="stat-card-title">{title}</p>

        <h3 className="stat-card-value">{value}</h3>

        {description && <p className="stat-card-description">{description}</p>}
      </div>
    </div>
  );
}

export default StatCard;
