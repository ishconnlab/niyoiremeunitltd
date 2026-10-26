import React, { useMemo, useState } from 'react';
import { ArrowRight, Clock, Search } from 'lucide-react';
import { BLOG_POSTS } from '../data/blog';
import type { BlogPost, BlogCategory } from '../types';
import type { CmsBlogPost } from '../types/cms';
import { useCmsBlog } from '../hooks/useCmsBlog';
import { contentValue, useCmsContent } from '../hooks/useCmsContent';
import { useSeo } from '../hooks/useSeo';
import { LocalizedLink } from '../components/common/LocalizedLink';
import { PillButton } from '../components/common/PillButton';

export const CATEGORY_LABELS: Record<BlogCategory, { en: string; rw: string }> = {
  completed: { en: 'Project stories', rw: 'Project stories' },
  'in-progress': { en: 'Project updates', rw: 'Project updates' },
  equipment: { en: 'Equipment', rw: 'Equipment' },
  trends: { en: 'Guides and ideas', rw: 'Guides and ideas' },
};

const toCardPost = (post: CmsBlogPost): BlogPost => {
  const category = (post.categories?.[0] || 'trends') as BlogCategory;
  const body = post.body || '';
  const minutes = Math.max(1, Math.ceil(body.trim().split(/\s+/).filter(Boolean).length / 200));
  return {
    id: post.slug,
    title: post.title,
    category: category in CATEGORY_LABELS ? category : 'trends',
    excerpt: post.excerpt,
    content: body,
    image: post.featuredImage?.url || post.images?.[0]?.url || '',
    date: post.publishedAt || new Date().toISOString(),
    readTime: `${minutes} min read`,
    author: post.author || 'NIYO IREME UNIT LTD',
    featured: Boolean(post.featured),
  };
};

export const Blog: React.FC = () => {
  const [category, setCategory] = useState<BlogCategory | 'all'>('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const { posts, pages, total, error } = useCmsBlog(page, category === 'all' ? undefined : category);
  const blogContent = useCmsContent('blog');
  const listing = contentValue(blogContent?.find((record) => record.key === 'listing'));
  const text = (key: string, fallback: string) => typeof listing[key] === 'string' && listing[key] ? String(listing[key]) : fallback;
  const visiblePosts = posts ? posts.map(toCardPost) : error ? BLOG_POSTS : [];
  const filtered = useMemo(() => visiblePosts.filter((post) => `${post.title} ${post.excerpt} ${post.author}`.toLowerCase().includes(search.trim().toLowerCase())), [visiblePosts, search]);
  const featured = page === 1 && category === 'all' && !search ? filtered.filter((post) => post.featured).slice(0, 3) : [];
  const categories: Array<BlogCategory | 'all'> = ['all', 'completed', 'in-progress', 'equipment', 'trends'];

  useSeo({ title: text('title', 'Renovation and finishing guides | NIYO IREME UNIT LTD'), description: text('subtitle', 'Practical ideas about renovation planning, painting, tiling and finishing work from NIYO IREME UNIT LTD.'), path: '/blog' });

  const dateLabel = (date: string) => new Date(date).toLocaleDateString('en-RW', { year: 'numeric', month: 'long', day: 'numeric' });
  const card = (post: BlogPost) => <article key={post.id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-lg">
    {post.image ? <img src={post.image} alt={post.title} width={720} height={480} loading="lazy" decoding="async" className="aspect-[3/2] w-full object-cover" /> : <div className="flex aspect-[3/2] items-center justify-center bg-slate-100 text-sm text-slate-500">Article image not provided</div>}
    <div className="p-5"><p className="text-xs font-bold uppercase tracking-wide text-brand-orange">{CATEGORY_LABELS[post.category].en}</p><h2 className="mt-2 font-heading text-xl font-extrabold text-brand-navy">{post.title}</h2><p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{post.excerpt}</p><div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500"><span>{dateLabel(post.date)}</span><span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" aria-hidden="true" />{post.readTime}</span><span>{post.author}</span></div><LocalizedLink to={`/blog/${post.id}`} className="mt-4 inline-flex min-h-10 items-center gap-2 font-bold text-brand-navy hover:text-brand-orange">Read article <ArrowRight className="h-4 w-4" aria-hidden="true" /></LocalizedLink></div>
  </article>;

  return <main className="min-h-screen bg-slate-50">
    <section className="bg-brand-navy py-14 text-white sm:py-20"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-orange">{text('eyebrow', 'NIYO IREME UNIT LTD')}</p><h1 className="mt-3 max-w-3xl font-heading text-4xl font-black sm:text-5xl">{text('title', 'Renovation and finishing guides')}</h1><p className="mt-4 max-w-2xl text-base leading-7 text-slate-200">{text('subtitle', 'Ideas to help you plan home improvements, choose finishes and prepare for construction work.')}</p><label className="mt-7 flex max-w-xl items-center gap-3 rounded-xl bg-white px-4 text-slate-700"><Search className="h-4 w-4" aria-hidden="true" /><span className="sr-only">Search articles</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={text('searchPlaceholder', 'Search articles')} className="min-h-12 w-full bg-transparent text-sm outline-none" /></label><div className="mt-5 flex flex-wrap gap-2">{categories.map((value) => <button key={value} type="button" aria-pressed={category === value} onClick={() => { setCategory(value); setPage(1); }} className={`min-h-10 rounded-full px-4 text-sm font-semibold ${category === value ? 'bg-brand-orange text-white' : 'border border-white/30 bg-white/10 text-white hover:bg-white/20'}`}>{value === 'all' ? text('allLabel', 'All articles') : CATEGORY_LABELS[value].en}</button>)}</div></div></section>
    <section className="py-12 sm:py-16"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{featured.length > 0 && <section aria-labelledby="featured-articles"><h2 id="featured-articles" className="mb-5 font-heading text-2xl font-extrabold text-brand-navy">{text('featuredTitle', 'Featured articles')}</h2><div className="grid gap-5 md:grid-cols-3">{featured.map(card)}</div></section>}<div className="mb-5 mt-10 flex flex-wrap items-end justify-between gap-3"><div><h2 className="font-heading text-2xl font-extrabold text-brand-navy">{text('allTitle', 'All articles')}</h2><p className="mt-1 text-sm text-slate-600">{posts ? total : visiblePosts.length} articles</p></div></div>{!error && posts === null ? <p role="status" className="rounded-xl bg-white p-8 text-slate-600">Loading articles…</p> : filtered.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{filtered.map(card)}</div> : <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center"><h3 className="font-heading text-xl font-bold text-brand-navy">{text('emptyTitle', 'No articles found')}</h3><p className="mt-2 text-sm text-slate-600">{text('emptyBody', 'Try another search or contact us to discuss a project.')}</p></div>}{pages > 1 && <div className="mt-8 flex justify-center gap-3"><button type="button" disabled={page <= 1} onClick={() => setPage((value) => value - 1)} className="min-h-11 rounded-full border border-slate-300 px-5 font-semibold disabled:opacity-40">Previous</button><span className="inline-flex items-center text-sm text-slate-600">Page {page} of {pages}</span><button type="button" disabled={page >= pages} onClick={() => setPage((value) => value + 1)} className="min-h-11 rounded-full border border-slate-300 px-5 font-semibold disabled:opacity-40">Next</button></div>}</div></section>
    <section className="bg-white py-12"><div className="mx-auto flex max-w-4xl flex-col items-center gap-4 px-4 text-center"><h2 className="font-heading text-2xl font-extrabold text-brand-navy">{text('callToActionTitle', 'Planning a project?')}</h2><p className="max-w-2xl text-sm leading-6 text-slate-600">{text('callToActionBody', 'Tell us about the work you have in mind. We can review the requirements and discuss next steps.')}</p><div className="flex flex-wrap justify-center gap-3"><PillButton to="/quote">Request a quotation</PillButton><LocalizedLink to="/contact" className="inline-flex min-h-11 items-center rounded-full border border-slate-300 px-5 font-bold text-brand-navy hover:bg-slate-50">Contact us</LocalizedLink></div></div></section>
  </main>;
};
