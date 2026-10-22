export type ServiceCategory = 'finishing' | 'painting' | 'construction' | 'workforce';

export type FinishingTier = 'standard' | 'premium' | 'luxury_executive';

export type ProjectType = 'residential' | 'commercial' | 'renovation' | 'exterior';

export type ServiceIconName =
  | 'Paintbrush2'
  | 'Palette'
  | 'Building2'
  | 'Users'
  | 'Layers'
  | 'Grid3x3'
  | 'PanelTop'
  | 'ShoppingBag'
  | 'BrickWall';

export interface ServiceDefinition {
  /** Stable URL slug, also the i18n key under `services.items`. */
  id: string;
  category: ServiceCategory;
  /** Lucide icon name used for the visual marker. */
  iconName: ServiceIconName;
  /** Representative local photography for the service (`/projects/...`). */
  image: string;
  /** i18n key for the service-specific image alt text. */
  imageAltKey: string;
  /** Short label used on compact cards. */
  shortLabelKey: string;
}

export interface GalleryItem {
  id: string;
  category: ServiceCategory;
  image: string;
  /** i18n key describing what the sample shows. */
  captionKey: string;
}

export interface FaqDefinition {
  id: string;
  category: 'general' | 'finishing' | 'painting' | 'construction' | 'workforce';
}

export interface WhyChooseItem {
  id: string;
  iconName: 'Sparkles' | 'ShieldCheck' | 'Award' | 'Handshake' | 'Clock';
}

export interface TeamMember {
  id: string;
  /** i18n keys — every string lives in the locale files. */
  roleKey: string;
  specialtyKey: string;
  bioKey: string;
  badgeKey: string;
  responsibilityKeys: string[];
  /** Illustrative photography of the type of work the team carries out. */
  image: string;
  /** Description of the photograph, read by screen readers. */
  imageAltKey: string;
  /** Optional note when the photograph is a placeholder. */
  photoNoteKey?: string;
}

export interface QuotationCalculationInput {
  serviceCategory: ServiceCategory;
  projectType: ProjectType;
  areaSquareMeters?: number;
  tier: FinishingTier;
  workforceCount?: number;
  workforceDurationWeeks?: number;
  locationDistrict?: string;
  needMaterialsIncluded?: boolean;
}

export interface QuotationEstimateResult {
  estimatedMinRWF: number;
  estimatedMaxRWF: number;
  formattedRangeRWF: string;
  suggestedDurationWeeks: number;
  breakdown: {
    labelKey: string;
    params?: Record<string, string | number>;
    amountRWF: number;
  }[];
  noteKeys: string[];
}
