import React from 'react';
import {
  BrickWall,
  Building2,
  Grid3x3,
  Layers,
  Palette,
  PanelTop,
  Paintbrush2,
  ShoppingBag,
  Users,
  type LucideIcon,
} from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  Paintbrush2,
  Palette,
  Building2,
  Users,
  Layers,
  Grid3x3,
  PanelTop,
  ShoppingBag,
  BrickWall,
};

export interface ServiceIconProps {
  name: string;
  className?: string;
}

export const ServiceIcon: React.FC<ServiceIconProps> = ({ name, className }) => {
  const Icon = ICONS[name] ?? Building2;
  return <Icon className={className} aria-hidden="true" />;
};
