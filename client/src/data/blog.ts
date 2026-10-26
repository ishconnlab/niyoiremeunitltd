import type { BlogPost } from '../types';

/** Helpful, general project guides. The examples illustrate work types and do not claim specific completed jobs. */
export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'planning-a-home-renovation',
    title: 'How to plan a home renovation',
    category: 'trends',
    excerpt: 'A clear scope, practical priorities and coordinated decisions make renovation planning easier.',
    content: 'Start by listing the changes you need and separating essential repairs from optional upgrades. Walk through each room and note any visible damage, access constraints and items that need protection.\n\nAgree the work sequence before finishes are selected. Surface repairs, ceiling work and major installations usually need to be coordinated before final decoration and cleaning.\n\nAsk for a written scope that identifies what is included, the materials to be confirmed and any work that depends on a site inspection. This gives everyone a useful reference as the project moves forward.',
    image: '/projects/construction-renovation.jpg',
    date: '2026-10-20',
    readTime: '3 min read',
    author: 'NIYO IREME UNIT LTD',
    featured: true,
  },
  {
    id: 'preparing-walls-for-painting',
    title: 'Preparing walls before painting',
    category: 'trends',
    excerpt: 'A durable paint finish starts with clean, sound and suitably prepared surfaces.',
    content: 'Before painting, inspect walls for loose material, cracks, moisture and uneven areas. The right preparation depends on the existing surface and the finish selected.\n\nProtect floors, furniture, fittings and nearby surfaces. Remove dust and allow repaired areas to dry before applying a compatible primer or finish.\n\nColour, sheen, product choice and the condition of the surface all affect the result. Discuss the room and its use before choosing products, especially for areas exposed to moisture or frequent cleaning.',
    image: '/projects/painting-renovation.jpg',
    date: '2026-10-12',
    readTime: '3 min read',
    author: 'NIYO IREME UNIT LTD',
    featured: true,
  },
  {
    id: 'choosing-tiles-for-a-room',
    title: 'What to consider when choosing tiles',
    category: 'trends',
    excerpt: 'Room use, surface preparation, tile layout and grout selection all matter to a finished installation.',
    content: 'Begin with how the room is used and the surface where tiles will be installed. Wet areas, floors and walls can have different practical requirements, so confirm product suitability with the supplier.\n\nMeasure the area and plan the layout before installation. Tile size, pattern, edge details and cut placement affect the finished appearance. The substrate must also be checked and prepared for the selected tile system.\n\nAllow time to review samples in the room lighting and confirm tile, grout and trim selections before work starts. The quantities and cost depend on the site measurements and chosen materials.',
    image: '/projects/tile-installation-3.jpg',
    date: '2026-10-04',
    readTime: '3 min read',
    author: 'NIYO IREME UNIT LTD',
    featured: false,
  },
];

export const getPostsByCategory = (category: string) => BLOG_POSTS.filter((post) => post.category === category);
export const getFeaturedPosts = () => BLOG_POSTS.filter((post) => post.featured);
export const getBlogCategories = () => ['completed', 'in-progress', 'equipment', 'trends'].map((id) => ({ id, name: id, count: BLOG_POSTS.filter((post) => post.category === id).length }));
