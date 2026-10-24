import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Clock, Image } from 'lucide-react';

import { BLOG_POSTS, getPostsByCategory, getFeaturedPosts } from '../data/blog';
import type { BlogCategory } from '../types';
import { useSeo } from '../hooks/useSeo';
import { LocalizedLink } from '../components/common/LocalizedLink';
import { PillButton } from '../components/common/PillButton';
import { cn } from '../utils/cn';

export const CATEGORY_LABELS: Record<BlogCategory, { en: string; rw: string }> = {
  completed: { en: 'Completed Projects', rw: 'Imirimo Yarabayeje' },
  'in-progress': { en: 'Projects in Progress', rw: 'Imirimo Inyenyeranyije' },
  equipment: { en: 'Equipment Rental', rw: 'Gukodesha Ibikoresho' },
  trends: { en: 'Industry Trends', rw: 'Ibitekerezo by’Indama' },
};

export const Blog: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isKinyarwanda = i18n.language === 'rw';
  const [activeCategory, setActiveCategory] = useState<BlogCategory | 'all'>('all');

  useSeo({
    title: t('meta.routes.blog.title'),
    description: t('meta.routes.blog.description'),
    path: '/blog',
  });

  const featuredPosts = useMemo(() => getFeaturedPosts(), []);
  const filteredPosts = useMemo(() => {
    if (activeCategory === 'all') return BLOG_POSTS;
    return getPostsByCategory(activeCategory);
  }, [activeCategory]);

  const categories: Array<{ id: BlogCategory | 'all'; label: string }> = [
    { id: 'all', label: t('blog.categories.all') },
    { id: 'completed', label: t('blog.categories.completed') },
    { id: 'in-progress', label: t('blog.categories.inProgress') },
    { id: 'equipment', label: t('blog.categories.equipment') },
    { id: 'trends', label: t('blog.categories.trends') },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(isKinyarwanda ? 'rw-RW' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-brand-navy text-white py-16 sm:py-20 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-blueprint-drawing bg-[url('/assets/brand/blueprint-crane.svg')] opacity-20 pointer-events-none"
        />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-orange-400 border border-white/20 text-xs font-bold uppercase tracking-wider mb-6">
              <Image className="w-3.5 h-3.5 text-brand-orange" />
              {t('blog.hero.badge')}
            </div>
            <h1 className="text-4xl sm:text-5xl font-black font-heading text-white leading-tight mb-4">
              {t('blog.hero.title')}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-8 max-w-lg">
              {t('blog.hero.subtitle')}
            </p>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id as BlogCategory | 'all')}
                  className={cn(
                    'px-4 py-2 rounded-full text-xs font-semibold transition-colors whitespace-nowrap',
                    activeCategory === cat.id
                      ? 'bg-brand-orange text-white shadow-sm'
                      : 'bg-white/10 text-slate-300 hover:bg-white/20 border border-white/20'
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-16 sm:py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <h2 className="font-heading text-3xl font-black text-brand-navy">
                {t('blog.featured.title')}
              </h2>
              <LocalizedLink
                to="/blog"
                className="text-sm font-bold text-brand-orange transition-colors hover:text-brand-orange-dark"
              >
                {t('blog.featured.viewAll')}
                <ArrowRight className="h-4 w-4 ml-1" aria-hidden="true" />
              </LocalizedLink>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              {featuredPosts.map((post) => (
                <article
                  key={post.id}
                  className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-brand-navy/90 text-white text-[10px] font-bold uppercase tracking-wider">
                      {CATEGORY_LABELS[post.category][isKinyarwanda ? 'rw' : 'en']}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <div className="text-white">
                        <h3 className="font-heading text-xl font-black mb-1">
                          {post.title}
                        </h3>
                        <p className="text-sm text-slate-200">
                          {post.excerpt}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                      <span className="text-xs text-slate-500">
                        {formatDate(post.date)} • {post.readTime}
                      </span>
                    </div>
                    <h3 className="font-heading text-lg font-black text-brand-navy mb-2 group-hover:text-brand-orange transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <LocalizedLink
                      to={`/blog/${post.id}`}
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-orange transition-colors hover:text-brand-orange-dark"
                    >
                      {t('blog.readMore')}
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </LocalizedLink>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Posts Grid */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-heading text-3xl font-black text-brand-navy">
                {activeCategory === 'all'
                  ? t('blog.allPosts.title')
                  : CATEGORY_LABELS[activeCategory as BlogCategory][
                      isKinyarwanda ? 'rw' : 'en'
                    ]}
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                {filteredPosts.length} {t('blog.allPosts.postsCount')}
              </p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <article
                  key={post.id}
                  className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-brand-navy/90 text-white text-[10px] font-bold uppercase tracking-wider">
                      {CATEGORY_LABELS[post.category][isKinyarwanda ? 'rw' : 'en']}
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                      <span className="text-xs text-slate-500">
                        {formatDate(post.date)} • {post.readTime}
                      </span>
                    </div>
                    <h3 className="font-heading text-lg font-black text-brand-navy mb-2 group-hover:text-brand-orange transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <LocalizedLink
                      to={`/blog/${post.id}`}
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-orange transition-colors hover:text-brand-orange-dark"
                    >
                      {t('blog.readMore')}
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </LocalizedLink>
                  </div>
                </article>
              ))
            ) : (
              <div className="col-span-3 text-center py-20">
                <p className="text-slate-600">{t('blog.allPosts.noPosts')}</p>
                <LocalizedLink
                  to="/blog"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand-orange transition-colors"
                >
                  {t('blog.allPosts.viewAll')}
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </LocalizedLink>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-brand-navy py-16 text-white sm:py-20">
        <div
          className="absolute inset-0 bg-hazard-stripes opacity-10 pointer-events-none"
        />
        <div className="relative z-10 mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-black font-heading text-white mb-4">
            {t('blog.cta.title')}
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-8 max-w-lg mx-auto">
            {t('blog.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <PillButton to="/quote" size="md">
              {t('blog.cta.primary')}
            </PillButton>
            <LocalizedLink
              to="/contact"
              className="px-6 py-3 rounded-full border border-white text-white font-semibold hover:bg-white hover:text-brand-navy transition-colors"
            >
              {t('blog.cta.secondary')}
            </LocalizedLink>
          </div>
        </div>
      </section>
    </div>
  );
};
