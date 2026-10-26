export interface CmsImage {
  url: string;
  alt: string;
}

export interface CmsFaq {
  question: string;
  answer: string;
}

export interface CmsService {
  _id?: string;
  slug: string;
  title: string;
  overview: string;
  description: string;
  problems?: string[];
  includedWork?: string[];
  materials?: string[];
  workflow?: string[];
  deliverables?: string[];
  benefits?: string[];
  costFactors?: string[];
  customization?: string[];
  faqs?: CmsFaq[];
  relatedServices?: string[];
  mainImage?: string;
  gallery?: CmsImage[];
  seoTitle?: string;
  seoDescription?: string;
  status: 'draft' | 'published';
  isActive: boolean;
  showOnHomePage?: boolean;
  order?: number;
}

export interface CmsBlogPost {
  _id?: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  featuredImage?: CmsImage;
  images?: CmsImage[];
  youtubeVideoId?: string;
  categories?: string[];
  tags?: string[];
  author?: string;
  featured?: boolean;
  status: 'draft' | 'published';
  publishedAt?: string | null;
  seoTitle?: string;
  seoDescription?: string;
}

export interface WhatsAppContact {
  name: string;
  number: string;
}
