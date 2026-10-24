import type { BlogPost } from '../types';

/**
 * Blog posts â€” real projects and company updates.
 *
 * Categories:
 *   - completed: Projects worked on (from client reviews)
 *   - in-progress: Projects currently underway
 *   - equipment: Equipment rental and availability
 *   - trends: Industry trends and news
 *
 * All content is verified â€” no invented projects or testimonials.
 */
export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'kimironko-full-interior-finishing',
    title: 'Full Interior Finishing â€” Kimironko Residence',
    category: 'completed',
    excerpt:
      'Complete plastering, gypsum ceiling, tiling and painting for a modern family home in Kimironko, Kigali.',
    content:
      'We recently completed a full interior finishing project for a family home in Kimironko, Kigali. The scope included wall plastering, gypsum ceiling installation, floor and wall tiling, and interior/exterior painting. The client was particularly happy with the clean handover and the durability of the finishes.',
    image: '/projects/interior-finishing.jpg',
    date: '2026-09-15',
    readTime: '4 min read',
    author: 'NIYO IREME Team',
    featured: true,
  },
  {
    id: 'rusororo-ceiling-painting',
    title: 'Ceiling Installation & Painting â€” Rusororo',
    category: 'completed',
    excerpt:
      'Gypsum ceiling installation with full interior and exterior painting for a residential property in Rusororo.',
    content:
      'A recent project in Rusororo involved installing a decorative gypsum ceiling and completing both interior and exterior painting. The team protected all furniture during the work and left the site tidy upon completion.',
    image: '/projects/gypsum-ceilings.jpg',
    date: '2026-08-22',
    readTime: '3 min read',
    author: 'NIYO IREME Team',
    featured: false,
  },
  {
    id: 'murugando-wall-repairs',
    title: 'Wall Repairs & Specialist Coatings â€” Murugando',
    category: 'completed',
    excerpt:
      'Correction of badly finished walls, crack repair, and epoxy coating application in Murugando.',
    content:
      'A home in Murugando had severely cracked and poorly finished walls. Our team corrected the plaster, applied wall master and epoxy, and delivered a properly finished surface that will hold up well over time.',
    image: '/projects/wall-plastering.jpg',
    date: '2026-07-30',
    readTime: '3 min read',
    author: 'NIYO IREME Team',
    featured: false,
  },
  {
    id: 'kicukiro-plastering-painting',
    title: 'Full-house Plastering & Painting â€” Kicukiro',
    category: 'completed',
    excerpt:
      'Complete wall plastering and silk/weatherguard paint finish for a full house in Kicukiro.',
    content:
      'We plastered the entire house, applied wall master inside and out, and finished with a clean coat of silk and weatherguard paint. The work was well organised and the result is beautiful.',
    image: '/projects/painting-services.jpg',
    date: '2026-07-10',
    readTime: '4 min read',
    author: 'NIYO IREME Team',
    featured: false,
  },
  {
    id: 'bumbogo-gypsum-ceiling',
    title: 'Gypsum Ceiling & Decoration â€” Bumbogo',
    category: 'completed',
    excerpt:
      'Gypsum ceiling fitting, wall plastering, and decoration with matt and silk finishes in Bumbogo.',
    content:
      'A transformation project in Bumbogo featuring a new gypsum ceiling, wall plastering, and complete decoration with matt and silk finishes. The house feels completely transformed.',
    image: '/projects/ceiling-design.jpg',
    date: '2026-06-18',
    readTime: '3 min read',
    author: 'NIYO IREME Team',
    featured: false,
  },
  {
    id: 'kigali-commercial-terrace',
    title: 'Commercial Terrace Construction â€” Kigali',
    category: 'in-progress',
    excerpt:
      'Terrace construction for a commercial building in central Kigali â€” currently underway.',
    content:
      'We are currently constructing a terrace for a commercial building in central Kigali. The project includes structural work, waterproofing, and finishing. Expected completion: Q4 2026.',
    image: '/projects/construction-renovation.jpg',
    date: '2026-10-01',
    readTime: '3 min read',
    author: 'NIYO IREME Team',
    featured: true,
  },
  {
    id: 'gasabo-residential-renovation',
    title: 'Residential Renovation â€” Gasabo District',
    category: 'in-progress',
    excerpt:
      'Full renovation of a residential property in Gasabo District â€” demolition, plastering, and finishing in progress.',
    content:
      'An ongoing renovation project in Gasabo District. The team is currently working on demolition, wall preparation, plastering, and preparing for tiling and painting.',
    image: '/projects/construction-renovation.jpg',
    date: '2026-09-28',
    readTime: '3 min read',
    author: 'NIYO IREME Team',
    featured: false,
  },
  {
    id: 'equipment-earthmoving-rental',
    title: 'Earthmoving Equipment Now Available for Rent',
    category: 'equipment',
    excerpt:
      'Excavators, compactors and site preparation equipment available for rental across Kigali and Rwanda.',
    content:
      'We now have earthmoving and site preparation equipment available for rental. This includes excavators, compactors, and related equipment for excavation, site clearing, and material movement. Availability is subject to confirmation â€” contact us with your project dates and location.',
    image: '/projects/construction-renovation.jpg',
    date: '2026-10-10',
    readTime: '2 min read',
    author: 'NIYO IREME Team',
    featured: true,
  },
  {
    id: 'equipment-concrete-blockwork',
    title: 'Concrete & Blockwork Equipment for Hire',
    category: 'equipment',
    excerpt:
      'Mixers, compactors and related equipment for concrete and blockwork now available for rental.',
    content:
      'Our concrete and blockwork equipment fleet is available for hire. We provide mixers, compactors, and related equipment for concrete, blockwork, and structural work. Contact us for availability, specifications, and rental terms.',
    image: '/projects/construction-renovation.jpg',
    date: '2026-10-05',
    readTime: '2 min read',
    author: 'NIYO IREME Team',
    featured: false,
  },
  {
    id: 'rwanda-construction-trends-2026',
    title: 'Construction Trends in Rwanda â€” 2026 Outlook',
    category: 'trends',
    excerpt:
      'What is shaping the construction and finishing industry in Rwanda this year â€” materials, techniques, and regulations.',
    content:
      'The Rwandan construction industry is evolving quickly in 2026. Key trends include increased use of gypsum ceilings, demand for weather-resistant exterior paints, sustainable building materials, and closer supervision standards on residential and commercial sites.',
    image: '/projects/technical-drawing.jpg',
    date: '2026-10-12',
    readTime: '5 min read',
    author: 'NIYO IREME Team',
    featured: true,
  },
  {
    id: 'gypsum-ceiling-demand',
    title: 'Rising Demand for Gypsum Ceilings in Kigali Homes',
    category: 'trends',
    excerpt:
      'Why gypsum ceilings are becoming the preferred finishing choice for homeowners across Kigali.',
    content:
      'Gypsum ceilings are seeing rising demand across Kigali due to their clean finish, design flexibility, and relatively quick installation. Homeowners are choosing decorative gypsum designs for living rooms, bedrooms, and kitchens.',
    image: '/projects/gypsum-ceilings.jpg',
    date: '2026-09-20',
    readTime: '4 min read',
    author: 'NIYO IREME Team',
    featured: false,
  },
];

/**
 * Get posts filtered by category
 */
export const getPostsByCategory = (category: string) => {
  return BLOG_POSTS.filter((post) => post.category === category);
};

/**
 * Get featured posts
 */
export const getFeaturedPosts = () => {
  return BLOG_POSTS.filter((post) => post.featured);
};

/**
 * Get all categories with counts
 */
export const getBlogCategories = () => {
  const categories = ['completed', 'in-progress', 'equipment', 'trends'];
  return categories.map((cat) => ({
    id: cat,
    name: cat,
    count: BLOG_POSTS.filter((p) => p.category === cat).length,
  }));
};

