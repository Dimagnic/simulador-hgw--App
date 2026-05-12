import React from 'react';
import { Badge } from '@/components/ui/badge';

const StatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    const configs = {
      Online: { color: 'bg-success text-success-foreground', label: 'Online' },
      Offline: { color: 'bg-muted text-muted-foreground', label: 'Offline' },
      Secure: { color: 'bg-success text-success-foreground', label: 'Secure' },
      Warning: { color: 'bg-warning text-warning-foreground', label: 'Warning' },
      Critical: { color: 'bg-destructive text-destructive-foreground', label: 'Critical' },
    };
    return configs[status] || { color: 'bg-muted text-muted-foreground', label: status };
  };

  const config = getStatusConfig(status);

  return (
    <Badge className={`${config.color} mono-font text-xs`}>
      {config.label}
    </Badge>
  );
};

export default StatusBadge;