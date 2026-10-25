export type ServiceCategory = 'finishing' | 'painting' | 'construction' | 'workforce';

export type FinishingTier = 'standard' | 'premium' | 'luxury_executive';

export type ProjectType = 'residential' | 'commercial' | 'renovation' | 'exterior';

export type ServiceIconName =
  | 'Paintbrush2'
  | 'Palette'
  | 'Building2'
  | 'Users'
  | 'Layers'
  | 'Layers3'
  | 'Grid3x3'
  | 'PanelTop'
  | 'ShoppingBag'
  | 'BrickWall'
  | 'Wallpaper'
  | 'BrushCleaning'
  | 'Truck'
  | 'ClipboardList';

export interface ServiceDefinition {
  /** Stable URL slug, also the i18n key under `services.items`. */
  id: string;
  category: ServiceCategory;
  /** Lucide icon name used for the visual marker. */
  iconName: ServiceIconName;
  /**
   * Representative local photography for the service (`/projects/...`).
   * Omitted when the company has not supplied a genuine photograph yet, so the
   * card falls back to an icon panel instead of presenting a stock image as
   * completed company work.
   */
  image?: string;
  /** i18n key for the service-specific image alt text. */
  imageAltKey?: string;
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
  /** Displayed full name of the team member. */
  name: string;
  /** i18n keys â€” every string lives in the locale files. */
  roleKey: string;
  specialtyKey: string;
  bioKey: string;
  badgeKey: string;
  responsibilityKeys: string[];
  /** Photography of the team member. Local path preferred; replace placeholder once real photos are supplied. */
  image: string;
  /** Description of the photograph, read by screen readers. */
  imageAltKey: string;
  /** Optional note when the photograph is a placeholder. */
  photoNoteKey?: string;
  /** International format phone number with + prefix (e.g. +250781294928). Omit when unverified. */
  phone?: string;
  /** Digits-only phone number for WhatsApp URLs (e.g. 250781294928). Omit when unverified. */
  whatsapp?: string;
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

export type BlogCategory = 'completed' | 'in-progress' | 'equipment' | 'trends';

export interface BlogPost {
  id: string;
  title: string;
  category: BlogCategory;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  readTime: string;
  author: string;
  featured: boolean;
}

