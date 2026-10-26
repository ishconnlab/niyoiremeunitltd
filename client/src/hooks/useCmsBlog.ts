import { useEffect, useState } from 'react';
import { apiRequest } from '../utils/api';
import type { CmsBlogPost } from '../types/cms';

export function useCmsBlog(page = 1, category?: string) {
  const [posts, setPosts] = useState<CmsBlogPost[] | null>(null);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(false);
  useEffect(() => {
    let live = true;
    const params = new URLSearchParams({ page: String(page), limit: '12' });
    if (category) params.set('category', category);
    const load = () => apiRequest<{ data: CmsBlogPost[]; pages: number; total: number }>(`/blog?${params}`)
      .then((result) => { if (live) { setPosts(result.data); setPages(result.pages); setTotal(result.total); } })
      .catch(() => { if (live) setError(true); });
    const handleUpdate = () => { void load(); };
    handleUpdate();
    window.addEventListener('niyo:cms-updated', handleUpdate);
    return () => { live = false; window.removeEventListener('niyo:cms-updated', handleUpdate); };
  }, [page, category]);
  return { posts, pages, total, error };
}

export function useCmsBlogPost(slug?: string) {
  const [post, setPost] = useState<CmsBlogPost | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    if (!slug) return;
    let live = true;
    const load = () => apiRequest<{ data: CmsBlogPost }>(`/blog/${encodeURIComponent(slug)}`)
      .then((result) => { if (live) setPost(result.data); })
      .catch(() => { if (live) setError(true); });
    const handleUpdate = () => { void load(); };
    handleUpdate();
    window.addEventListener('niyo:cms-updated', handleUpdate);
    return () => { live = false; window.removeEventListener('niyo:cms-updated', handleUpdate); };
  }, [slug]);
  return { post, error };
}
