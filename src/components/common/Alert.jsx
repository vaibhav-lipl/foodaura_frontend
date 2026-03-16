import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import './Alert.css';

const Alert = ({ type = 'info', message, onClose }) => {
  const configs = {
    success: {
      icon: CheckCircle,
      className: 'alert-success',
    },
    error: {
      icon: XCircle,
      className: 'alert-error',
    },
    warning: {
      icon: AlertTriangle,
      className: 'alert-warning',
    },
    info: {
      icon: Info,
      className: 'alert-info',
    },
  };

  const config = configs[type] || configs.info;
  const Icon = config.icon;

  return (
    <div className={`alert ${config.className}`}>
      <Icon size={20} className="alert-icon" />
      <span className="alert-message">{message}</span>
      {onClose && (
        <button onClick={onClose} className="alert-close" aria-label="Close">
          <X size={18} />
        </button>
      )}
    </div>
  );
};

export default Alert;
