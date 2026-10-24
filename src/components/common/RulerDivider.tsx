import React from 'react';

interface RulerDividerProps {
  className?: string;
}

/** Architectural ruler / measuring scale divider used between sections. */
export const RulerDivider: React.FC<RulerDividerProps> = ({ className = '' }) => {
  return (
    <div
      className={`pointer-events-none h-3 bg-ruler-scale ${className}`}
      aria-hidden="true"
    />
  );
};

