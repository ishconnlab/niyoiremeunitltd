/**
 * Equipment catalogue for NIYO IREME UNIT COMPANY LTD.
 *
 * Each item lists a genuine tool name (in English), a short description,
 * and a category. i18n keys are used so names and descriptions translate
 * when the language switcher changes. Photographs are initials-based SVG
 * placeholders. Replace each `/assets/equipment/<id>.svg` path with a
 * verified product photograph once supplied by the company.
 * No quantities, prices, brands, or availability are claimed here ” those
 * change and must be confirmed on request.
 */

export type EquipmentCategory = 'painting' | 'surface-preparation' | 'additional';

export interface EquipmentItem {
  id: string;
  /** i18n key for the equipment name (under equipment.items.<id>.name) */
  nameKey: string;
  /** i18n key for the equipment description (under equipment.items.<id>.description) */
  descriptionKey: string;
  category: EquipmentCategory;
  image: string;
  imageAltKey: string;
}

export const EQUIPMENT_ITEMS: EquipmentItem[] = [
  // Painting tools
  {
    id: 'paint-brush',
    nameKey: 'equipment.items.paint-brush.name',
    descriptionKey: 'equipment.items.paint-brush.description',
    category: 'painting',
    image: '/assets/equipment/paint-brush.svg',
    imageAltKey: 'equipment.items.paint-brush.imageAlt',
  },
  {
    id: 'paint-roller',
    nameKey: 'equipment.items.paint-roller.name',
    descriptionKey: 'equipment.items.paint-roller.description',
    category: 'painting',
    image: '/assets/equipment/paint-roller.svg',
    imageAltKey: 'equipment.items.paint-roller.imageAlt',
  },
  {
    id: 'paint-tray',
    nameKey: 'equipment.items.paint-tray.name',
    descriptionKey: 'equipment.items.paint-tray.description',
    category: 'painting',
    image: '/assets/equipment/paint-tray.svg',
    imageAltKey: 'equipment.items.paint-tray.imageAlt',
  },
  {
    id: 'paint-bucket',
    nameKey: 'equipment.items.paint-bucket.name',
    descriptionKey: 'equipment.items.paint-bucket.description',
    category: 'painting',
    image: '/assets/equipment/paint-bucket.svg',
    imageAltKey: 'equipment.items.paint-bucket.imageAlt',
  },
  {
    id: 'putty-knife',
    nameKey: 'equipment.items.putty-knife.name',
    descriptionKey: 'equipment.items.putty-knife.description',
    category: 'surface-preparation',
    image: '/assets/equipment/putty-knife.svg',
    imageAltKey: 'equipment.items.putty-knife.imageAlt',
  },
  {
    id: 'paint-scraper',
    nameKey: 'equipment.items.paint-scraper.name',
    descriptionKey: 'equipment.items.paint-scraper.description',
    category: 'surface-preparation',
    image: '/assets/equipment/paint-scraper.svg',
    imageAltKey: 'equipment.items.paint-scraper.imageAlt',
  },
  {
    id: 'paint-edger',
    nameKey: 'equipment.items.paint-edger.name',
    descriptionKey: 'equipment.items.paint-edger.description',
    category: 'painting',
    image: '/assets/equipment/paint-edger.svg',
    imageAltKey: 'equipment.items.paint-edger.imageAlt',
  },
  {
    id: 'extension-pole',
    nameKey: 'equipment.items.extension-pole.name',
    descriptionKey: 'equipment.items.extension-pole.description',
    category: 'painting',
    image: '/assets/equipment/extension-pole.svg',
    imageAltKey: 'equipment.items.extension-pole.imageAlt',
  },
  {
    id: 'sandpaper',
    nameKey: 'equipment.items.sandpaper.name',
    descriptionKey: 'equipment.items.sandpaper.description',
    category: 'surface-preparation',
    image: '/assets/equipment/sandpaper.svg',
    imageAltKey: 'equipment.items.sandpaper.imageAlt',
  },
  {
    id: 'paint-mixer',
    nameKey: 'equipment.items.paint-mixer.name',
    descriptionKey: 'equipment.items.paint-mixer.description',
    category: 'painting',
    image: '/assets/equipment/paint-mixer.svg',
    imageAltKey: 'equipment.items.paint-mixer.imageAlt',
  },
  {
    id: 'masking-tape',
    nameKey: 'equipment.items.masking-tape.name',
    descriptionKey: 'equipment.items.masking-tape.description',
    category: 'painting',
    image: '/assets/equipment/masking-tape.svg',
    imageAltKey: 'equipment.items.masking-tape.imageAlt',
  },
  {
    id: 'drop-cloth',
    nameKey: 'equipment.items.drop-cloth.name',
    descriptionKey: 'equipment.items.drop-cloth.description',
    category: 'painting',
    image: '/assets/equipment/drop-cloth.svg',
    imageAltKey: 'equipment.items.drop-cloth.imageAlt',
  },
  {
    id: 'paint-sprayer',
    nameKey: 'equipment.items.paint-sprayer.name',
    descriptionKey: 'equipment.items.paint-sprayer.description',
    category: 'painting',
    image: '/assets/equipment/paint-sprayer.svg',
    imageAltKey: 'equipment.items.paint-sprayer.imageAlt',
  },
  {
    id: 'ladder',
    nameKey: 'equipment.items.ladder.name',
    descriptionKey: 'equipment.items.ladder.description',
    category: 'additional',
    image: '/assets/equipment/ladder.svg',
    imageAltKey: 'equipment.items.ladder.imageAlt',
  },
  {
    id: 'wire-brush',
    nameKey: 'equipment.items.wire-brush.name',
    descriptionKey: 'equipment.items.wire-brush.description',
    category: 'surface-preparation',
    image: '/assets/equipment/wire-brush.svg',
    imageAltKey: 'equipment.items.wire-brush.imageAlt',
  },
  {
    id: 'sponge',
    nameKey: 'equipment.items.sponge.name',
    descriptionKey: 'equipment.items.sponge.description',
    category: 'surface-preparation',
    image: '/assets/equipment/sponge.svg',
    imageAltKey: 'equipment.items.sponge.imageAlt',
  },
  // Additional equipment
  {
    id: 'air-compressor',
    nameKey: 'equipment.items.air-compressor.name',
    descriptionKey: 'equipment.items.air-compressor.description',
    category: 'additional',
    image: '/assets/equipment/air-compressor.svg',
    imageAltKey: 'equipment.items.air-compressor.imageAlt',
  },
  {
    id: 'ibikawa',
    nameKey: 'equipment.items.ibikawa.name',
    descriptionKey: 'equipment.items.ibikawa.description',
    category: 'additional',
    image: '/assets/equipment/ibikawa.svg',
    imageAltKey: 'equipment.items.ibikawa.imageAlt',
  },
];

export const getEquipmentByCategory = (category: EquipmentCategory) =>
  EQUIPMENT_ITEMS.filter((item) => item.category === category);
