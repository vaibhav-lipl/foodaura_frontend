import './MetricCard.css';

const MetricCard = ({ title, value, icon: Icon, trend, className = '', color = 'primary', link }) => {
  const colorClasses = {
    primary: 'metric-card-primary',
    success: 'metric-card-success',
    warning: 'metric-card-warning',
    info: 'metric-card-info',
  };

  const cardClass = `metric-card ${colorClasses[color] || colorClasses.primary} ${className}`;

  const content = (
    <div className={cardClass}>
      <div className="metric-card-header">
        <div className="metric-card-icon">
          {Icon && <Icon size={24} />}
        </div>
        {trend && (
          <div className={`metric-card-trend ${trend.positive ? 'positive' : 'negative'}`}>
            {trend.positive ? '↑' : '↓'} {trend.value}
          </div>
        )}
      </div>
      <div className="metric-card-body">
        <h3 className="metric-card-value">{value}</h3>
        <p className="metric-card-title">{title}</p>
      </div>
    </div>
  );

  if (link) {
    return (
      <a href={link} className="metric-card-link">
        {content}
      </a>
    );
  }

  return content;
};

export default MetricCard;
