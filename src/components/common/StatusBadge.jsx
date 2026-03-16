import './StatusBadge.css';

const StatusBadge = ({ status, type = 'order', label }) => {
  const getStatusConfig = () => {
    if (type === 'order') {
      const configs = {
        pending: { label: 'Pending', className: 'status-pending' },
        confirmed: { label: 'Confirmed', className: 'status-confirmed' },
        preparing: { label: 'Preparing', className: 'status-preparing' },
        ready: { label: 'Ready', className: 'status-ready' },
        out_for_delivery: { label: 'Out for Delivery', className: 'status-out-for-delivery' },
        delivered: { label: 'Delivered', className: 'status-delivered' },
        cancelled: { label: 'Cancelled', className: 'status-cancelled' },
      };
      return configs[status?.toLowerCase()] || { label: status, className: 'status-default' };
    }
    
    if (type === 'payment') {
      const configs = {
        pending: { label: 'Pending', className: 'status-pending' },
        paid: { label: 'Paid', className: 'status-paid' },
        failed: { label: 'Failed', className: 'status-failed' },
      };
      return configs[status?.toLowerCase()] || { label: status, className: 'status-default' };
    }

    if (type === 'availability') {
      return status
        ? { label: 'Available', className: 'status-available' }
        : { label: 'Unavailable', className: 'status-unavailable' };
    }

    if (type === 'itemtype') {
      if (typeof status === 'string') {
        const normalizedStatus = status.trim().toLowerCase();
        const configs = {
          veg: { label: 'Veg', className: 'status-veg' },
          vegetarian: { label: 'Veg', className: 'status-veg' },
          nonveg: { label: 'Non-Veg', className: 'status-nonveg' },
          'non-veg': { label: 'Non-Veg', className: 'status-nonveg' },
          'non veg': { label: 'Non-Veg', className: 'status-nonveg' },
          non_veg: { label: 'Non-Veg', className: 'status-nonveg' },
          jain: { label: 'Jain', className: 'status-jain' },
        };

        return configs[normalizedStatus] || { label: status, className: 'status-default' };
      }

      return status
        ? { label: 'Veg', className: 'status-veg' }
        : { label: 'Non-Veg', className: 'status-nonveg' };
    }

    // Handle restaurant open/closed status
    if (type === 'restaurant') {
      const configs = {
        open: { label: 'Open', className: 'status-open' },
        closed: { label: 'Closed', className: 'status-closed' },
      };
      
      // Handle numeric status (0 = closed, 1 = open)
      if (status === 1 || status === '1') {
        return configs.open;
      }
      if (status === 0 || status === '0') {
        return configs.closed;
      }
      
      // Handle boolean status
      if (status === true) {
        return configs.open;
      }
      if (status === false) {
        return configs.closed;
      }
      
      // Handle string status (check if it's a string before calling toLowerCase)
      if (typeof status === 'string') {
        const statusLower = status.toLowerCase();
        if (statusLower === 'open' || statusLower === 'active' || statusLower === '1') {
          return configs.open;
        }
        if (statusLower === 'closed' || statusLower === 'inactive' || statusLower === '0') {
          return configs.closed;
        }
      }
      
      return configs.closed; // Default to closed
    }

    // Handle delivery partner status online/offline
    if (type === 'delivery_partner') {
      const configs = {
        online: { label: 'Online', className: 'status-open' },
        offline: { label: 'Offline', className: 'status-closed' },
      };
      
      // Handle numeric status (0 = offline, 1 = online)
      if (status === 1 || status === '1') {
        return configs.online;
      }
      if (status === 0 || status === '0') {
        return configs.offline;
      }
      
      // Handle boolean status
      if (status === true) {
        return configs.online;
      }
      if (status === false) {
        return configs.offline;
      }
      
      // Handle string status (check if it's a string before calling toLowerCase)
      if (typeof status === 'string') {
        const statusLower = status.toLowerCase();
        if (statusLower === 'online' || statusLower === 'active' || statusLower === '1') {
          return configs.online;
        }
        if (statusLower === 'offline' || statusLower === 'inactive' || statusLower === '0') {
          return configs.offline;
        }
      }
      
      return configs.offline; // Default to offline
    }

    // Handle active/inactive status (for users and restaurants)
    // If label is explicitly provided, use it (for Open/Closed, etc.)
    if (label && (status === 'active' || status === 'inactive' || status?.toLowerCase() === 'active' || status?.toLowerCase() === 'inactive')) {
      const statusLower = status?.toLowerCase();
      const className = statusLower === 'active' ? 'status-active' : 'status-inactive';
      return { label: label, className: className };
    }
    
    // Handle active/inactive status without custom label
    if (status === 'active' || status === 'inactive' || status?.toLowerCase() === 'active' || status?.toLowerCase() === 'inactive') {
      const statusLower = status?.toLowerCase();
      const configs = {
        active: { label: 'Active', className: 'status-active' },
        inactive: { label: 'Inactive', className: 'status-inactive' },
      };
      return configs[statusLower] || { label: status, className: 'status-default' };
    }

    return { label: label || status, className: 'status-default' };
  };

  const config = getStatusConfig();

  return (
    <span className={`status-badge ${config.className}`}>
      {config.label}
    </span>
  );
};

export default StatusBadge;
