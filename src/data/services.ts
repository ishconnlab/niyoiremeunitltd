import { ServiceDefinition } from '../types';

/**
 * The nine services the company delivers.
 *
 * `category` maps every service onto one of the four quotation categories used
 * by the calculator and forms, so those working parts stay unchanged. Titles,
 * descriptions and bullet points live in `src/i18n/locales/en.json` and
 * `rw.json` under `services.items.<id>`; the Kinyarwanda copy is the source of
 * truth. Photography is served from the local `public/projects/` folder using
 * URL-safe filenames (no spaces or ampersands) so every path loads everywhere.
 */
export const SERVICES_DATA: ServiceDefinition[] = [
  {
    id: 'finishing',
    category: 'finishing',
    iconName: 'Paintbrush2',
    image: '/projects/interior-finishing.jpg',
    imageAltKey: 'services.items.finishing.imageAlt',
    shortLabelKey: 'services.items.finishing.shortLabel',
  },
  {
    id: 'painting',
    category: 'painting',
    iconName: 'Palette',
    image: '/projects/painting-services.jpg',
    imageAltKey: 'services.items.painting.imageAlt',
    shortLabelKey: 'services.items.painting.shortLabel',
  },
  {
    id: 'construction',
    category: 'construction',
    iconName: 'Building2',
    image: '/projects/construction-renovation.jpg',
    imageAltKey: 'services.items.construction.imageAlt',
    shortLabelKey: 'services.items.construction.shortLabel',
  },
  {
    id: 'ceilings',
    category: 'construction',
    iconName: 'Layers',
    image: '/projects/gypsum-ceilings.jpg',
    imageAltKey: 'services.items.ceilings.imageAlt',
    shortLabelKey: 'services.items.ceilings.shortLabel',
  },
  {
    id: 'tiling',
    category: 'construction',
    iconName: 'Grid3x3',
    image: '/projects/tile-installation-3.jpg',
    imageAltKey: 'services.items.tiling.imageAlt',
    shortLabelKey: 'services.items.tiling.shortLabel',
  },
  {
    id: 'glass',
    category: 'construction',
    iconName: 'PanelTop',
    image: '/projects/glass-installation.jpg',
    imageAltKey: 'services.items.glass.imageAlt',
    shortLabelKey: 'services.items.glass.shortLabel',
  },
  {
    id: 'materials',
    category: 'painting',
    iconName: 'ShoppingBag',
    image: '/projects/painting-renovation.jpg',
    imageAltKey: 'services.items.materials.imageAlt',
    shortLabelKey: 'services.items.materials.shortLabel',
  },
  {
    id: 'plastering',
    category: 'construction',
    iconName: 'BrickWall',
    image: '/projects/wall-plastering.jpg',
    imageAltKey: 'services.items.plastering.imageAlt',
    shortLabelKey: 'services.items.plastering.shortLabel',
  },
  {
    id: 'workforce',
    category: 'workforce',
    iconName: 'Users',
    image: '/projects/at-work.jpg',
    imageAltKey: 'services.items.workforce.imageAlt',
    shortLabelKey: 'services.items.workforce.shortLabel',
  },
];

export const SERVICE_BY_ID = SERVICES_DATA.reduce<Record<string, ServiceDefinition>>(
  (acc, service) => {
    acc[service.id] = service;
    return acc;
  },
  {}
);
