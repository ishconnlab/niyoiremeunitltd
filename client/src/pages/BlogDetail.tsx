import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Clock, ChevronLeft } from 'lucide-react';

import { BLOG_POSTS } from '../data/blog';
import { useSeo } from '../hooks/useSeo';
import { LocalizedLink } from '../components/common/LocalizedLink';
import { PillButton } from '../components/common/PillButton';
import { CATEGORY_LABELS } from '../pages/Blog';

export const BlogDetail: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isKinyarwanda = i18n.language === 'rw';
  const { id } = useParams<{ id: string }>();

  const post = BLOG_POSTS.find((p) => p.id === id);

  useSeo({
    title: post ? `${post.title} | NIYO IREME UNIT COMPANY LTD` : 'Blog Post | NIYO IREME UNIT COMPANY LTD',
    description: post ? post.excerpt : 'Read our latest blog post.',
    path: post ? `/blog/${post.id}` : '/blog',
  });

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-3xl font-black text-brand-navy mb-4">
            {t('blog.allPosts.noPosts') || 'Post not found'}
          </h1>
          <PillButton to="/blog">{t('blog.allPosts.viewAll') || 'Back to blog'}</PillButton>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(isKinyarwanda ? 'rw-RW' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Get related posts (same category, not current)
  const relatedPosts = useMemo(() => {
    return BLOG_POSTS.filter(
      (p) => p.category === post.category && p.id !== post.id
    ).slice(0, 3);
  }, [post]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Back navigation */}
      <section className="bg-white border-b border-slate-200 py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <LocalizedLink
            to="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-navy hover:text-brand-orange transition-colors"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            {t('blog.allPosts.viewAll') || 'Back to blog'}
          </LocalizedLink>
        </div>
      </section>

      {/* Post Hero */}
      <section className="bg-white py-12 sm:py-16 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-blueprint-drawing bg-[url('/assets/brand/blueprint-truss.svg')] opacity-10 pointer-events-none"
        />
        <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-brand-navy/90 text-white text-[10px] font-bold uppercase tracking-wider mb-4 block">
            {CATEGORY_LABELS[post.category][isKinyarwanda ? 'rw' : 'en']}
          </span>
          <h1 className="text-3xl sm:text-4xl font-black font-heading text-brand-navy leading-tight mb-4">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-slate-500 mb-8">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
              <span>{formatDate(post.date)}</span>
            </div>
            <span className="h-[1px] w-4 bg-slate-300" aria-hidden="true" />
            <span>{post.readTime}</span>
          </div>
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-64 sm:h-80 object-cover rounded-3xl shadow-lg mb-8"
            loading="eager"
            decoding="async"
          />
        </div>
      </section>

      {/* Post Content */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg prose-brand-navy max-w-none">
            <p className="text-lg text-slate-600 leading-relaxed mb-6 font-semibold">
              {post.excerpt}
            </p>
            {post.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-base text-slate-700 leading-relaxed mb-6">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-16 border-t border-slate-200 pt-12">
              <h2 className="font-heading text-2xl font-black text-brand-navy mb-8">
                {t('blog.featured.title') || 'Related Stories'}
              </h2>
              <div className="grid gap-6 sm:grid-cols-3">
                {relatedPosts.map((related) => (
                  <article
                    key={related.id}
                    className="group rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={related.image}
                        alt={related.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-brand-navy/90 text-white text-[10px] font-bold uppercase tracking-wider">
                        {CATEGORY_LABELS[related.category][
                          isKinyarwanda ? 'rw' : 'en'
                        ]}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-heading text-base font-black text-brand-navy mb-2 group-hover:text-brand-orange transition-colors">
                        {related.title}
                      </h3>
                      <LocalizedLink
                        to={`/blog/${related.id}`}
                        className="text-sm font-bold text-brand-orange transition-colors hover:text-brand-orange-dark"
                      >
                        {t('blog.readMore') || 'Read more'}
                        <ArrowRight className="h-3.5 w-3.5 ml-1" aria-hidden="true" />
                      </LocalizedLink>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-navy py-12 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-black font-heading mb-4">
            {t('blog.cta.title') || 'Ready to start your project?'}
          </h2>
          <p className="text-slate-300 mb-8 max-w-md mx-auto">
            {t('blog.cta.subtitle') || 'Tell us what you need and we will arrange a free site visit.'}
          </p>
          <PillButton to="/quote" size="md">
            {t('blog.cta.primary') || 'Request a free quotation'}
          </PillButton>
        </div>
      </section>
    </div>
  );
};

