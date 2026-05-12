import React from 'react';
import { motion } from 'framer-motion';

const SecurityScoreGauge = ({ score = 0, size = 200 }) => {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getScoreColor = (score) => {
    if (score >= 80) return 'hsl(120 100% 50%)';
    if (score >= 60) return 'hsl(35 100% 50%)';
    return 'hsl(0 85% 60%)';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Secure';
    if (score >= 60) return 'Warning';
    return 'Critical';
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="hsl(var(--muted))"
            strokeWidth="10"
            fill="none"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={getScoreColor(score)}
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            style={{
              filter: `drop-shadow(0 0 8px ${getScoreColor(score)})`,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-5xl font-bold mono-font"
            style={{ color: getScoreColor(score) }}
          >
            {score}
          </motion.div>
          <div className="text-sm text-muted-foreground mono-font">SCORE</div>
        </div>
      </div>
      <div
        className="text-lg font-semibold mono-font"
        style={{ color: getScoreColor(score) }}
      >
        {getScoreLabel(score)}
      </div>
    </div>
  );
};

export default SecurityScoreGauge;