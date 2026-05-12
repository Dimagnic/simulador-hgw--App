import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

const MetricCard = ({ title, value, icon: Icon, trend, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="cyber-border hover:neon-glow transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mono-font mb-2">{title}</p>
              <p className="text-3xl font-bold text-primary neon-text mono-font">{value}</p>
              {trend && (
                <p className="text-xs text-muted-foreground mt-2 mono-font">{trend}</p>
              )}
            </div>
            {Icon && (
              <div className="p-3 bg-primary/10 rounded-lg">
                <Icon className="w-6 h-6 text-primary" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MetricCard;