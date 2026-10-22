import { GalleryItem } from '../types';

/**
 * Gallery imagery.
 *
 * Each photograph is a local file from `public/projects/` showing the type of
 * finish and workmanship the company delivers. Captions live in the locale
 * files under `gallery.captions.*`. Filenames are URL-safe so every path loads
 * everywhere.
 */
export const GALLERY_DATA: GalleryItem[] = [
  {
    id: 'project-1',
    category: 'finishing',
    image: '/projects/interior-finishing.jpg',
    captionKey: 'gallery.captions.project1',
  },
  {
    id: 'project-2',
    category: 'finishing',
    image: '/projects/interior-living-space.jpg',
    captionKey: 'gallery.captions.project2',
  },
  {
    id: 'project-3',
    category: 'finishing',
    image: '/projects/interior-finishing-detail.jpg',
    captionKey: 'gallery.captions.project3',
  },
  {
    id: 'project-4',
    category: 'painting',
    image: '/projects/painting-services.jpg',
    captionKey: 'gallery.captions.project4',
  },
  {
    id: 'project-5',
    category: 'painting',
    image: '/projects/painting-renovation.jpg',
    captionKey: 'gallery.captions.project5',
  },
  {
    id: 'project-6',
    category: 'painting',
    image: '/projects/wall-paint-facebook.jpg',
    captionKey: 'gallery.captions.project6',
  },
  {
    id: 'project-7',
    category: 'construction',
    image: '/projects/construction-renovation.jpg',
    captionKey: 'gallery.captions.project7',
  },
  {
    id: 'project-8',
    category: 'construction',
    image: '/projects/technical-drawing.jpg',
    captionKey: 'gallery.captions.project8',
  },
  {
    id: 'project-9',
    category: 'construction',
    image: '/projects/gypsum-ceilings.jpg',
    captionKey: 'gallery.captions.project9',
  },
  {
    id: 'project-10',
    category: 'construction',
    image: '/projects/ceiling-design.jpg',
    captionKey: 'gallery.captions.project10',
  },
  {
    id: 'project-11',
    category: 'construction',
    image: '/projects/tile-installation-2.jpg',
    captionKey: 'gallery.captions.project11',
  },
  {
    id: 'project-12',
    category: 'construction',
    image: '/projects/tile-installation-3.jpg',
    captionKey: 'gallery.captions.project12',
  },
  {
    id: 'project-13',
    category: 'construction',
    image: '/projects/tile-installation-masons.jpg',
    captionKey: 'gallery.captions.project13',
  },
  {
    id: 'project-14',
    category: 'construction',
    image: '/projects/glass-installation.jpg',
    captionKey: 'gallery.captions.project14',
  },
  {
    id: 'project-15',
    category: 'construction',
    image: '/projects/glass-installation-1.jpg',
    captionKey: 'gallery.captions.project15',
  },
  {
    id: 'project-16',
    category: 'construction',
    image: '/projects/wall-plastering.jpg',
    captionKey: 'gallery.captions.project16',
  },
  {
    id: 'project-17',
    category: 'workforce',
    image: '/projects/at-work.jpg',
    captionKey: 'gallery.captions.project17',
  },
];

export const GALLERY_CATEGORIES = [
  { id: 'all', labelKey: 'gallery.categories.all' },
  { id: 'finishing', labelKey: 'gallery.categories.finishing' },
  { id: 'painting', labelKey: 'gallery.categories.painting' },
  { id: 'construction', labelKey: 'gallery.categories.construction' },
  { id: 'workforce', labelKey: 'gallery.categories.workforce' },
] as const;
