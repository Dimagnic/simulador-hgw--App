import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Info, AlertTriangle, AlertCircle } from 'lucide-react';

const SeverityBadge = ({ severity }) => {
  const getSeverityConfig = (severity) => {
    const configs = {
      Info: {
        color: 'bg-secondary text-secondary-foreground',
        icon: Info,
        label: 'Info',
      },
      Warning: {
        color: 'bg-warning text-warning-foreground',
        icon: AlertTriangle,
        label: 'Warning',
      },
      Critical: {
        color: 'bg-destructive text-destructive-foreground',
        icon: AlertCircle,
        label: 'Critical',
      },
    };
    return configs[severity] || configs.Info;
  };

  const config = getSeverityConfig(severity);
  const Icon = config.icon;

  return (
    <Badge className={`${config.color} mono-font text-xs flex items-center gap-1`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </Badge>
  );
};

export default SeverityBadge;