import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, Clock, Share2 } from 'lucide-react';
import { BLOG_POSTS } from '../data/blog';
import { useCmsBlog, useCmsBlogPost } from '../hooks/useCmsBlog';
import { useSeo } from '../hooks/useSeo';
import { LocalizedLink } from '../components/common/LocalizedLink';
import { PillButton } from '../components/common/PillButton';

export const BlogDetail: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const { post: cmsPost, error } = useCmsBlogPost(id);
  const { posts: cmsPosts } = useCmsBlog(1);
  const fallback = BLOG_POSTS.find((item) => item.id === id);
  const post = cmsPost || (error ? fallback : null);
  const title = post?.title || 'Article not found';
  const excerpt = post?.excerpt || '';
  const body = post ? ('body' in post ? post.body : post.content) : '';
  const image = post && 'featuredImage' in post ? (post.featuredImage?.url || post.images?.[0]?.url || '') : fallback?.image || '';
  const featuredImageUrl = post && 'featuredImage' in post ? post.featuredImage?.url : '';
  const articleImages = post && 'images' in post ? (post.images || []).filter((item) => item.url !== featuredImageUrl) : [];
  const videoId = post && 'youtubeVideoId' in post ? post.youtubeVideoId : '';
  const published = post && 'publishedAt' in post ? post.publishedAt || '' : fallback?.date || '';
  const author = post && 'author' in post ? post.author || 'NIYO IREME UNIT LTD' : fallback?.author || '';
  const readTime = post && 'body' in post ? `${Math.max(1, Math.ceil((post.body || '').trim().split(/\s+/).filter(Boolean).length / 200))} min read` : fallback?.readTime || '';
  const postCategories = post && 'categories' in post ? post.categories || [] : fallback ? [fallback.category] : [];

  useSeo({ title: post ? ('seoTitle' in post ? post.seoTitle || `${title} | NIYO IREME UNIT LTD` : `${title} | NIYO IREME UNIT LTD`) : 'Article not found | NIYO IREME UNIT LTD', description: post ? ('seoDescription' in post ? post.seoDescription || excerpt : excerpt) : 'Explore practical renovation and finishing ideas.', path: post ? `/blog/${'slug' in post ? post.slug : post.id}` : `/blog/${id}`, noIndex: !post });

  const related = useMemo(() => (cmsPosts || []).filter((item) => item.slug !== id && item.categories?.some((category) => postCategories.includes(category))).slice(0, 3), [cmsPosts, id, postCategories]);
  const share = async () => {
    const shareData = { title, text: excerpt, url: window.location.href };
    try { if (navigator.share) await navigator.share(shareData); else await navigator.clipboard.writeText(window.location.href); } catch { /* dismissed or clipboard unavailable */ }
  };

  if (!post) return <main className="mx-auto max-w-3xl px-4 py-20 text-center"><h1 className="font-heading text-3xl font-black text-brand-navy">{error ? 'Article not found' : 'Loading article…'}</h1><p className="mt-3 text-slate-600">This article may be unpublished or no longer available.</p><PillButton to="/blog" className="mt-6">Back to articles</PillButton></main>;

  return <main className="min-h-screen bg-slate-50">
    <div className="border-b border-slate-200 bg-white"><div className="mx-auto max-w-5xl px-4 py-4 sm:px-6"><LocalizedLink to="/blog" className="inline-flex min-h-10 items-center gap-2 font-semibold text-brand-navy hover:text-brand-orange"><ArrowLeft className="h-4 w-4" aria-hidden="true" />Back to articles</LocalizedLink></div></div>
    <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <header><p className="text-xs font-bold uppercase tracking-widest text-brand-orange">{postCategories.join(' · ') || 'Guides and ideas'}</p><h1 className="mt-3 font-heading text-3xl font-black leading-tight text-brand-navy sm:text-5xl">{title}</h1><p className="mt-4 max-w-3xl text-lg leading-7 text-slate-600">{excerpt}</p><div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-slate-500">{published && <time dateTime={published}>{new Date(published).toLocaleDateString('en-RW', { year: 'numeric', month: 'long', day: 'numeric' })}</time>}<span>{author}</span>{readTime && <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4" aria-hidden="true" />{readTime}</span>}<button type="button" onClick={() => void share()} className="inline-flex min-h-10 items-center gap-2 font-semibold text-brand-navy hover:text-brand-orange"><Share2 className="h-4 w-4" aria-hidden="true" />Share article</button></div></header>
      {image && <img src={image} alt={'featuredImage' in post ? post.featuredImage?.alt || title : title} width={1200} height={800} loading="eager" decoding="async" className="mt-8 aspect-[3/2] w-full rounded-3xl object-cover" />}
      {videoId && <div className="mt-8 aspect-video overflow-hidden rounded-2xl bg-black"><iframe src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}`} title={`Video: ${title}`} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen className="h-full w-full border-0" /></div>}
      <div className="prose prose-lg mt-10 max-w-none text-slate-700">{renderArticleBody(body)}</div>
      {articleImages.length > 0 && <section className="mt-10" aria-label="Article gallery"><h2 className="mb-4 font-heading text-xl font-bold text-brand-navy">More images</h2><div className="grid gap-4 sm:grid-cols-2">{articleImages.map((item, index) => <img key={`${item.url}-${index}`} src={item.url} alt={item.alt || `${title} image ${index + 1}`} width={720} height={480} loading="lazy" decoding="async" className="aspect-[3/2] w-full rounded-2xl object-cover" />)}</div></section>}
      {related.length > 0 && <section className="mt-14 border-t border-slate-200 pt-8"><h2 className="font-heading text-2xl font-extrabold text-brand-navy">Related articles</h2><ul className="mt-4 grid gap-3 sm:grid-cols-3">{related.map((item) => <li key={item.slug}><LocalizedLink to={`/blog/${item.slug}`} className="block rounded-xl border border-slate-200 bg-white p-4 font-semibold text-brand-navy hover:border-brand-orange">{item.title}<span className="mt-2 block text-sm font-normal text-slate-600">{item.excerpt}</span></LocalizedLink></li>)}</ul></section>}
    </article>
    <section className="bg-brand-navy py-12 text-center text-white"><h2 className="font-heading text-2xl font-extrabold">Talk with us about your project</h2><p className="mx-auto mt-2 max-w-xl px-4 text-sm text-slate-200">Share your project scope and we will discuss the next steps with you.</p><PillButton to="/quote" className="mt-5">Request a quotation</PillButton></section>
  </main>;
};

function renderArticleBody(body: string) {
  const lines = body.split(/\r?\n/);
  const nodes: React.ReactNode[] = [];
  let list: string[] = [];
  const flushList = () => { if (list.length) { nodes.push(<ul key={`list-${nodes.length}`} className="my-5 list-disc space-y-2 pl-6">{list.map((item, index) => <li key={`${index}-${item}`}>{item}</li>)}</ul>); list = []; } };
  lines.forEach((line, index) => {
    const text = line.trim();
    if (text.startsWith('- ') || text.startsWith('* ')) { list.push(text.slice(2)); return; }
    flushList();
    if (!text) return;
    const heading = text.match(/^(#{1,3})\s+(.+)$/);
    if (heading) { const Tag = `h${Math.min(3, heading[1].length + 1)}` as 'h2' | 'h3' | 'h4'; nodes.push(<Tag key={`heading-${index}`} className="mt-8 font-heading font-bold text-brand-navy">{heading[2]}</Tag>); }
    else nodes.push(<p key={`paragraph-${index}`} className="my-5 whitespace-pre-line leading-8">{text}</p>);
  });
  flushList();
  return nodes;
}
