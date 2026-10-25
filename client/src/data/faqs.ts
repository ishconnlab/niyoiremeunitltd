import { FaqDefinition } from '../types';

/**
 * FAQ entries. Questions and answers are translated content and therefore live
 * in the locale files under `faq.items.<id>`.
 */
export const FAQS_DATA: FaqDefinition[] = [
  { id: 'faq-1', category: 'general' },
  { id: 'faq-2', category: 'finishing' },
  { id: 'faq-3', category: 'painting' },
  { id: 'faq-4', category: 'construction' },
  { id: 'faq-5', category: 'workforce' },
  { id: 'faq-6', category: 'general' },
  { id: 'faq-7', category: 'general' },
  { id: 'faq-8', category: 'general' },
  { id: 'faq-9', category: 'general' },
];

export const FAQ_CATEGORIES = [
  { id: 'all', labelKey: 'faq.categories.all' },
  { id: 'general', labelKey: 'faq.categories.general' },
  { id: 'finishing', labelKey: 'faq.categories.finishing' },
  { id: 'painting', labelKey: 'faq.categories.painting' },
  { id: 'construction', labelKey: 'faq.categories.construction' },
  { id: 'workforce', labelKey: 'faq.categories.workforce' },
] as const;

