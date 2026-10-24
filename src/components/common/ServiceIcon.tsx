import React from 'react';
import {
  BrickWall,
  BrushCleaning,
  Building2,
  ClipboardList,
  Grid3x3,
  Layers,
  Layers3,
  Palette,
  PanelTop,
  Paintbrush2,
  ShoppingBag,
  Truck,
  Users,
  Wallpaper,
  type LucideIcon,
} from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  Paintbrush2,
  Palette,
  Building2,
  Users,
  Layers,
  Layers3,
  Grid3x3,
  PanelTop,
  ShoppingBag,
  BrickWall,
  Wallpaper,
  BrushCleaning,
  Truck,
  ClipboardList,
};

export interface ServiceIconProps {
  name: string;
  className?: string;
}

export const ServiceIcon: React.FC<ServiceIconProps> = ({ name, className }) => {
  const Icon = ICONS[name] ?? Building2;
  return <Icon className={className} aria-hidden="true" />;
};
