import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft, BookOpen, Check, ChevronLeft, ChevronRight, CirclePlus, FileText, Image as ImageIcon,
  LayoutDashboard, LoaderCircle, MessageCircle, Pencil, RefreshCw, Search, Settings2, ShieldCheck,
  Trash2, Upload, X,
} from 'lucide-react';
import { apiRequest } from '../utils/api';
import type { CmsBlogPost, CmsService, WhatsAppContact } from '../types/cms';
import { AdminRecordEditor, type JsonValue } from '../components/admin/AdminRecordEditor';
import { parseAdminJsonObject } from '../utils/adminJson';

type Section = 'services' | 'blog' | 'content' | 'whatsapp' | 'registration';
type RecordItem = CmsService | CmsBlogPost | Record<string, unknown>;
type ListResponse<T> = { data: T[]; total?: number; count?: number; page?: number; pages?: number; limit?: number };
type PageInfo = { total: number; page: number; pages: number; limit: number };

const PAGE_SIZES = [10, 25, 50];
const CONTENT_SECTIONS = ['about', 'benefits', 'blog', 'company', 'contact', 'equipment', 'faq', 'footer', 'gallery', 'hero', 'home', 'privacy', 'quote', 'seo', 'services', 'social', 'team', 'workforce'];

const blankFor = (section: Section): Record<string, unknown> => section === 'services'
  ? { slug: '', title: '', overview: '', description: '', problems: [], includedWork: [], materials: [], workflow: [], deliverables: [], benefits: [], customization: [], costFactors: [], faqs: [], relatedServices: [], mainImage: '', gallery: [], seoTitle: '', seoDescription: '', status: 'draft', isActive: false, showOnHomePage: false, order: 0 }
  : section === 'blog'
    ? { title: '', slug: '', excerpt: '', body: '', featuredImage: null, images: [], youtubeVideoId: '', categories: [], tags: [], author: 'NIYO IREME UNIT LTD', status: 'draft', publishedAt: null, seoTitle: '', seoDescription: '' }
    : { section: 'home', key: '', value: '', imageUrl: '', isActive: false, order: 0 };

const NAV_ITEMS: Array<{ id: Section; title: string; description: string; icon: React.ComponentType<{ className?: string }> }> = [
  { id: 'services', title: 'Services', description: 'Manage service details, galleries, visibility and SEO.', icon: LayoutDashboard },
  { id: 'blog', title: 'Blog', description: 'Create and publish articles, images and video.', icon: BookOpen },
  { id: 'content', title: 'Website content', description: 'Manage page copy, FAQs, gallery entries, footer and metadata.', icon: FileText },
  { id: 'whatsapp', title: 'WhatsApp contacts', description: 'Manage company-approved public enquiry numbers.', icon: MessageCircle },
  { id: 'registration', title: 'Registration settings', description: 'Control whether new administrator accounts may be created.', icon: ShieldCheck },
];

const getText = (record: Record<string, unknown>, key: string): string => typeof record[key] === 'string' ? String(record[key]) : '';
const getRecordTitle = (item: RecordItem) => {
  const record = item as Record<string, unknown>;
  const value = record.value && typeof record.value === 'object' ? record.value as Record<string, unknown> : {};
  return getText(record, 'title') || getText(value, 'title') || getText(record, 'key') || getText(record, 'slug') || 'Untitled record';
};
const getRecordImage = (item: RecordItem) => {
  const record = item as Record<string, unknown>;
  const featured = record.featuredImage && typeof record.featuredImage === 'object' ? record.featuredImage as { url?: string } : undefined;
  return getText(record, 'mainImage') || featured?.url || getText(record, 'imageUrl');
};
const getRecordCategory = (item: RecordItem) => {
  const record = item as Record<string, unknown>;
  const categories = Array.isArray(record.categories) ? record.categories.filter((value) => typeof value === 'string').join(', ') : '';
  return getText(record, 'section') || categories || getText(record, 'slug') || 'Website content';
};
const getRecordStatus = (item: RecordItem) => {
  const record = item as Record<string, unknown>;
  if (record.status === 'published') return 'Published';
  if (record.status === 'draft') return 'Draft';
  if (typeof record.section === 'string') return record.isActive === false ? 'Unpublished' : 'Published';
  return record.isActive === false ? 'Inactive' : 'Active';
};

export const AdminWorkspace: React.FC<{
  onLogout: () => void;
  adminLabel?: string;
  registrationEnabled: boolean | null;
  onToggleRegistration: () => Promise<boolean>;
  registrationLoading: boolean;
}> = ({ onLogout, adminLabel = 'Administrator', registrationEnabled, onToggleRegistration, registrationLoading }) => {
  const [section, setSection] = useState<Section>('services');
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo>({ total: 0, page: 1, pages: 1, limit: 10 });
  const [selected, setSelected] = useState<RecordItem | null>(null);
  const [draft, setDraft] = useState<Record<string, unknown> | null>(null);
  const [baseline, setBaseline] = useState('');
  const [advancedJson, setAdvancedJson] = useState('');
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [contacts, setContacts] = useState<WhatsAppContact[]>([]);
  const [contactsBaseline, setContactsBaseline] = useState('');
  const [contactsJson, setContactsJson] = useState('');
  const [contactsJsonOpen, setContactsJsonOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [recordsError, setRecordsError] = useState('');
  const [operationError, setOperationError] = useState('');
  const [notice, setNotice] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [contentSectionFilter, setContentSectionFilter] = useState('all');

  const nav = NAV_ITEMS.find((item) => item.id === section) ?? NAV_ITEMS[0];
  const isEditing = draft !== null;
  const draftSerialized = draft ? JSON.stringify(draft, null, 2) : '';
  const contactsChanged = JSON.stringify(contacts) !== contactsBaseline;
  const hasUnsavedChanges = Boolean((draft && (JSON.stringify(draft) !== baseline || (advancedOpen && advancedJson !== draftSerialized))) || (section === 'whatsapp' && (contactsChanged || (contactsJsonOpen && contactsJson !== JSON.stringify(contacts, null, 2)))));
  const parsedAdvanced = useMemo(() => {
    if (!advancedOpen) return { value: null as Record<string, unknown> | null, error: '' };
    return parseAdminJsonObject(advancedJson);
  }, [advancedJson, advancedOpen]);

  useEffect(() => {
    const timer = window.setTimeout(() => setSearchTerm(search.trim()), 250);
    return () => window.clearTimeout(timer);
  }, [search]);

  const refresh = useCallback(async (page: number) => {
    if (section === 'whatsapp' || section === 'registration') return;
    setLoading(true);
    setRecordsError('');
    const query = new URLSearchParams({ page: String(page), limit: String(pageInfo.limit) });
    if (searchTerm) query.set('search', searchTerm);
    if (statusFilter !== 'all' && section !== 'content') query.set('status', statusFilter);
    if (section === 'content' && statusFilter !== 'all') query.set('active', statusFilter === 'published' ? 'true' : 'false');
    if (section === 'content' && contentSectionFilter !== 'all') query.set('section', contentSectionFilter);
    const endpoint = section === 'services' ? '/services/admin' : section === 'blog' ? '/blog/admin' : '/content/admin';
    try {
      const result = await apiRequest<ListResponse<RecordItem>>(`${endpoint}?${query.toString()}`);
      const nextItems = Array.isArray(result.data) ? result.data : [];
      const nextTotal = Number.isFinite(result.total) ? Number(result.total) : Number(result.count ?? nextItems.length);
      const nextPages = Math.max(1, Number(result.pages) || Math.ceil(nextTotal / pageInfo.limit));
      setRecords(nextItems);
      setPageInfo((current) => ({ ...current, page: Math.min(page, nextPages), pages: nextPages, total: nextTotal }));
    } catch (cause) {
      setRecords([]);
      setPageInfo((current) => ({ ...current, total: 0, pages: 1 }));
      setRecordsError(cause instanceof Error ? cause.message : 'Records could not be loaded.');
    } finally {
      setLoading(false);
    }
  }, [contentSectionFilter, pageInfo.limit, searchTerm, section, statusFilter]);

  const refreshContacts = useCallback(async () => {
    setLoading(true);
    setRecordsError('');
    try {
      const result = await apiRequest<{ data: { whatsappContacts: WhatsAppContact[] } }>('/settings/public');
      const next = Array.isArray(result.data?.whatsappContacts) ? result.data.whatsappContacts : [];
      setContacts(next);
      setContactsBaseline(JSON.stringify(next));
      setContactsJson(JSON.stringify(next, null, 2));
    } catch (cause) {
      setRecordsError(cause instanceof Error ? cause.message : 'WhatsApp contacts could not be loaded.');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    setSelected(null); setDraft(null); setOperationError(''); setNotice(''); setRecordsError('');
    if (section === 'whatsapp') void refreshContacts();
    else if (section !== 'registration') void refresh(pageInfo.page);
  }, [section, searchTerm, statusFilter, contentSectionFilter, pageInfo.page, pageInfo.limit, refresh, refreshContacts]);

  const confirmDiscard = () => !hasUnsavedChanges || window.confirm('Discard your unsaved changes?');
  const changeSection = (next: Section) => {
    if (next === section || !confirmDiscard()) return;
    setSection(next); setPageInfo((current) => ({ ...current, page: 1 })); setSearch(''); setSearchTerm(''); setStatusFilter('all'); setContentSectionFilter('all');
  };

  const startNew = () => {
    const next = blankFor(section);
    setSelected(null); setDraft(next); setBaseline(JSON.stringify(next)); setAdvancedJson(JSON.stringify(next, null, 2));
    setAdvancedOpen(false); setOperationError(''); setNotice('');
  };
  const selectRecord = (record: RecordItem) => {
    if (!confirmDiscard()) return;
    const next = JSON.parse(JSON.stringify(record)) as Record<string, unknown>;
    setSelected(record); setDraft(next); setBaseline(JSON.stringify(next)); setAdvancedJson(JSON.stringify(next, null, 2));
    setAdvancedOpen(false); setOperationError(''); setNotice('');
  };
  const closeEditor = () => {
    if (!confirmDiscard()) return;
    setDraft(null); setSelected(null); setAdvancedOpen(false); setOperationError(''); setNotice('');
  };
  const updateDraft = (next: Record<string, unknown>) => setDraft(next);

  useEffect(() => {
    if (!hasUnsavedChanges) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [hasUnsavedChanges]);

  const save = async () => {
    if (!draft) return;
    setBusy(true); setOperationError(''); setNotice('');
    try {
      const id = (selected as { _id?: string } | null)?._id;
      const url = section === 'services' ? '/services' : section === 'blog' ? '/blog' : '/content';
      const result = await apiRequest<{ data: RecordItem }>(id ? `${url}/${id}` : url, { method: id ? 'PUT' : 'POST', body: JSON.stringify(draft) });
      const saved = JSON.parse(JSON.stringify(result.data)) as Record<string, unknown>;
      setSelected(result.data); setDraft(saved); setBaseline(JSON.stringify(saved)); setAdvancedJson(JSON.stringify(saved, null, 2)); setAdvancedOpen(false);
      setNotice(section === 'blog' && saved.status === 'published' ? 'Article published.' : section === 'content' ? saved.isActive === false ? 'Website content saved as unpublished.' : 'Website content published.' : 'Changes saved.');
      await refresh(pageInfo.page);
      window.dispatchEvent(new Event('niyo:cms-updated'));
    } catch (cause) {
      setOperationError(cause instanceof Error ? cause.message : 'Unable to save. Review the fields and try again.');
    } finally { setBusy(false); }
  };

  const remove = async () => {
    const id = (selected as { _id?: string } | null)?._id;
    if (!id || !window.confirm(`Delete “${getRecordTitle(selected!)}” permanently? This cannot be undone.`)) return;
    setBusy(true); setOperationError(''); setNotice('');
    try {
      const url = section === 'services' ? '/services' : section === 'blog' ? '/blog' : '/content';
      await apiRequest(`${url}/${id}`, { method: 'DELETE' });
      setDraft(null); setSelected(null); setNotice('Record deleted.');
      const nextPage = records.length === 1 && pageInfo.page > 1 ? pageInfo.page - 1 : pageInfo.page;
      setPageInfo((current) => ({ ...current, page: nextPage }));
      if (nextPage === pageInfo.page) await refresh(nextPage);
      window.dispatchEvent(new Event('niyo:cms-updated'));
    } catch (cause) { setOperationError(cause instanceof Error ? cause.message : 'Unable to delete this record.'); }
    finally { setBusy(false); }
  };

  const uploadImage = async (file?: File) => {
    if (!file || !draft) return;
    setOperationError(''); setNotice('');
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) { setOperationError('Choose a JPEG, PNG, or WebP image.'); return; }
    if (file.size > 5 * 1024 * 1024) { setOperationError('Image must be 5 MB or smaller.'); return; }
    if (section === 'services' && Array.isArray(draft.gallery) && draft.gallery.length >= 10) { setOperationError('Service galleries allow up to 10 images.'); return; }
    if (section === 'blog') {
      const images = Array.isArray(draft.images) ? draft.images : [];
      const featured = draft.featuredImage && typeof draft.featuredImage === 'object' ? draft.featuredImage as { url?: string } : null;
      const featuredIncluded = featured?.url && images.some((entry) => entry && typeof entry === 'object' && (entry as { url?: string }).url === featured.url);
      if (images.length + (featured?.url && !featuredIncluded ? 1 : 0) >= 5) { setOperationError('A blog post can have no more than five images, including its featured image.'); return; }
    }
    setUploading(true);
    try {
      const form = new FormData(); form.append('image', file);
      const result = await apiRequest<{ imageUrl: string }>('/upload', { method: 'POST', body: form });
      const image = { url: result.imageUrl, alt: '' };
      const next = { ...draft };
      if (section === 'services') {
        const gallery = Array.isArray(next.gallery) ? next.gallery : [];
        if (gallery.length >= 10) throw new Error('Service galleries allow up to 10 images.');
        next.gallery = [...gallery, image]; if (!next.mainImage) next.mainImage = result.imageUrl;
      } else if (section === 'blog') {
        const images = Array.isArray(next.images) ? next.images : [];
        const featured = next.featuredImage && typeof next.featuredImage === 'object' ? next.featuredImage as { url?: string } : null;
        const featuredIncluded = featured?.url && images.some((entry) => entry && typeof entry === 'object' && (entry as { url?: string }).url === featured.url);
        if (images.length + (featured?.url && !featuredIncluded ? 1 : 0) >= 5) throw new Error('A blog post can have no more than five images, including its featured image.');
        next.images = [...images, image]; if (!next.featuredImage) next.featuredImage = image;
      } else next.imageUrl = result.imageUrl;
      setDraft(next); setNotice('Image uploaded. Add descriptive alternative text before saving.');
    } catch (cause) { setOperationError(cause instanceof Error ? cause.message : 'Image upload failed. Your other changes are preserved.'); }
    finally { setUploading(false); }
  };

  const saveContacts = async () => {
    setBusy(true); setOperationError(''); setNotice('');
    try {
      const result = await apiRequest<{ data: { whatsappContacts: WhatsAppContact[] } }>('/settings/whatsapp-contacts', { method: 'PUT', body: JSON.stringify({ whatsappContacts: contacts }) });
      setContacts(result.data.whatsappContacts); setContactsBaseline(JSON.stringify(result.data.whatsappContacts)); setContactsJson(JSON.stringify(result.data.whatsappContacts, null, 2));
      setNotice('Public WhatsApp contacts updated.'); window.dispatchEvent(new Event('niyo:cms-updated'));
    } catch (cause) { setOperationError(cause instanceof Error ? cause.message : 'Contacts could not be saved.'); }
    finally { setBusy(false); }
  };

  const saveContactsJson = () => {
    try {
      const parsed: unknown = JSON.parse(contactsJson);
      if (!Array.isArray(parsed)) throw new Error('Enter a JSON array of contacts.');
      setContacts(parsed as WhatsAppContact[]); setContactsBaseline(''); setNotice('Advanced contact changes are ready to save.'); setContactsJsonOpen(false);
    } catch (cause) { setOperationError(cause instanceof Error ? cause.message : 'Invalid contact JSON.'); }
  };

  const changePageSize = (limit: number) => setPageInfo((current) => ({ ...current, limit, page: 1 }));
  const openPublic = (item: RecordItem) => {
    const record = item as Record<string, unknown>;
    if (section === 'services' && typeof record.slug === 'string') return `/services/${record.slug}`;
    if (section === 'blog' && typeof record.slug === 'string') return `/blog/${record.slug}`;
    return '';
  };

  const renderRecordCard = (item: RecordItem) => {
    const image = getRecordImage(item);
    const status = getRecordStatus(item);
    const updated = (item as Record<string, unknown>).updatedAt;
    const publicUrl = openPublic(item);
    return <article key={String((item as Record<string, unknown>)._id || getRecordTitle(item))} className="flex min-w-0 items-center gap-3 border-b border-slate-100 px-4 py-3 last:border-b-0 sm:grid sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_140px_120px_100px] sm:gap-4 sm:px-5">
      <div className="flex min-w-0 items-center gap-3 sm:col-span-1">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50 text-slate-400">{image ? <img src={image} alt="" loading="lazy" className="h-full w-full object-cover" /> : <ImageIcon className="h-4 w-4" aria-hidden="true" />}</div>
        <div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-900">{getRecordTitle(item)}</p><p className="mt-0.5 truncate text-xs text-slate-500 sm:hidden">{getRecordCategory(item)}</p><p className="mt-0.5 hidden truncate text-xs text-slate-500 sm:block">{getText(item as Record<string, unknown>, 'slug') || getText(item as Record<string, unknown>, 'key')}</p></div>
      </div>
      <span className="hidden truncate text-sm text-slate-600 sm:block">{getRecordCategory(item)}</span>
      <span className={`hidden w-fit rounded-full px-2.5 py-1 text-xs font-semibold sm:inline-flex ${status === 'Published' || status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{status}</span>
      <span className="hidden text-xs text-slate-500 md:block">{typeof updated === 'string' ? new Date(updated).toLocaleDateString() : '—'}</span>
      <button type="button" onClick={() => selectRecord(item)} className="ml-auto inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-700 hover:border-brand-navy hover:text-brand-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange sm:ml-0"><Pencil className="h-3.5 w-3.5" aria-hidden="true" /><span className="hidden sm:inline">Edit</span><span className="sm:hidden">Edit</span></button>
      {publicUrl && <span className="sr-only">Public page: {publicUrl}</span>}
    </article>;
  };

  return <main className="min-h-screen bg-[#f5f7fa] text-slate-800">
    <div className="mx-auto flex min-h-screen max-w-[1600px]">
      <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white px-4 py-6 lg:flex lg:flex-col">
        <a href="/" className="flex items-center gap-3 rounded-lg px-2 py-2" aria-label="NIYO IREME UNIT LTD home">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0e224e] p-1"><img src="/assets/brand/niyoireme-icon-192.png" alt="" className="h-full w-full object-contain" /></span>
          <span className="min-w-0"><span className="block truncate text-xs font-black tracking-wide text-[#0e224e]">NIYO IREME UNIT</span><span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-wider text-slate-500">Content studio</span></span>
        </a>
        <p className="mb-2 mt-9 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">Workspace</p>
        <nav aria-label="Admin sections" className="space-y-1">
          {NAV_ITEMS.map(({ id, title, icon: Icon }) => <button key={id} type="button" onClick={() => changeSection(id)} aria-current={section === id ? 'page' : undefined} className={`flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange ${section === id ? 'bg-[#0e224e] text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}><Icon className="h-[17px] w-[17px] shrink-0" aria-hidden="true" />{title}</button>)}
        </nav>
        <div className="mt-auto rounded-lg border border-slate-200 bg-slate-50 p-3"><p className="text-xs font-semibold text-slate-700">Admin workspace</p><p className="mt-1 text-xs leading-5 text-slate-500">Changes are saved to the website content system.</p></div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex min-h-[68px] items-center justify-between gap-3 border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3 lg:hidden"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0e224e] p-1"><img src="/assets/brand/niyoireme-icon-192.png" alt="" className="h-full w-full object-contain" /></span><span className="truncate text-xs font-black text-[#0e224e]">NIYO IREME UNIT</span></div>
          <p className="hidden text-xs font-semibold text-slate-500 lg:block">Administration <span className="px-1.5 text-slate-300">/</span> {nav.title}</p>
          <div className="ml-auto flex items-center gap-2"><a href="/" className="hidden min-h-9 items-center rounded-lg px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 sm:inline-flex">View website</a><div className="hidden min-w-0 items-center gap-2 border-l border-slate-200 pl-3 sm:flex"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-[#0e224e]">{adminLabel.slice(0, 1).toUpperCase()}</span><span className="max-w-40 truncate text-xs font-medium text-slate-600" title={adminLabel}>{adminLabel}</span></div><button type="button" onClick={onLogout} className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"><ShieldCheck className="h-4 w-4 text-slate-500" aria-hidden="true" /><span>Sign out</span></button></div>
        </header>

        <div className="border-b border-slate-200 bg-white px-3 py-2 lg:hidden"><nav aria-label="Admin sections" className="flex gap-1 overflow-x-auto">{NAV_ITEMS.map(({ id, title, icon: Icon }) => <button key={id} type="button" onClick={() => changeSection(id)} aria-current={section === id ? 'page' : undefined} className={`inline-flex min-h-10 shrink-0 items-center gap-2 rounded-lg px-3 text-xs font-semibold ${section === id ? 'bg-[#0e224e] text-white' : 'text-slate-600 hover:bg-slate-100'}`}><Icon className="h-4 w-4" aria-hidden="true" />{title}</button>)}</nav></div>

        <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-orange">NIYO IREME UNIT LTD</p><h1 className="mt-1 font-heading text-2xl font-bold tracking-tight text-[#0e224e] sm:text-3xl">{isEditing ? selected ? `Edit ${section === 'blog' ? 'article' : section === 'services' ? 'service' : 'content'}` : `Create ${section === 'blog' ? 'article' : section === 'services' ? 'service' : 'website content'}` : nav.title}</h1><p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-600">{isEditing ? 'Update details, media, visibility and search information in the editor.' : nav.description}</p></div>
            {isEditing && <button type="button" onClick={closeEditor} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"><ArrowLeft className="h-4 w-4" aria-hidden="true" />Back to records</button>}
          </div>

          {!isEditing && section !== 'registration' && section !== 'whatsapp' && <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 px-4 py-4 sm:px-5"><div><h2 className="text-base font-semibold text-slate-900">{nav.title}</h2><p className="mt-1 text-xs text-slate-500">{loading ? 'Loading records…' : `${pageInfo.total} ${pageInfo.total === 1 ? 'record' : 'records'}${searchTerm || statusFilter !== 'all' ? ' matching your filters' : ''}`}</p></div><button type="button" onClick={startNew} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#0e224e] px-4 text-sm font-semibold text-white shadow-sm hover:bg-[#163467] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"><CirclePlus className="h-4 w-4" aria-hidden="true" />{section === 'services' ? 'Create service' : section === 'blog' ? 'New article' : 'Add content'}</button></div>
            <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:px-5"><label className="relative min-w-0 flex-1 sm:max-w-sm"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" /><span className="sr-only">Search records</span><input value={search} onChange={(event) => { setSearch(event.target.value); setPageInfo((current) => ({ ...current, page: 1 })); }} placeholder="Search by title, slug or details" className="min-h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none placeholder:text-slate-400 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20" /></label>{section === 'content' && <label className="flex items-center gap-2 text-xs font-medium text-slate-600">Content area<select value={contentSectionFilter} onChange={(event) => { setContentSectionFilter(event.target.value); setPageInfo((current) => ({ ...current, page: 1 })); }} className="min-h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20"><option value="all">All areas</option>{CONTENT_SECTIONS.map((contentSection) => <option key={contentSection} value={contentSection}>{contentSection.charAt(0).toUpperCase() + contentSection.slice(1)}</option>)}</select></label>}<label className="flex items-center gap-2 text-xs font-medium text-slate-600">Status<select value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setPageInfo((current) => ({ ...current, page: 1 })); }} className="min-h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20"><option value="all">All records</option><option value="published">Published</option><option value="draft">Draft / unpublished</option></select></label><button type="button" onClick={() => void refresh(1)} disabled={loading} aria-label="Refresh records" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"><RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" /><span className="sm:hidden">Refresh</span></button></div>
            {recordsError ? <div className="m-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3" role="alert"><p className="text-sm text-red-800">Could not load records: {recordsError}</p><button type="button" onClick={() => void refresh(pageInfo.page)} className="min-h-9 rounded-lg border border-red-200 bg-white px-3 text-sm font-semibold text-red-800 hover:bg-red-100">Retry</button></div>
              : loading && records.length === 0 ? <div role="status" className="space-y-3 p-5"><div className="h-10 animate-pulse rounded-md bg-slate-100"/><div className="h-10 animate-pulse rounded-md bg-slate-100"/><div className="h-10 animate-pulse rounded-md bg-slate-100"/><span className="sr-only">Loading records</span></div>
              : records.length === 0 ? <div className="px-5 py-14 text-center"><div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-500"><FileText className="h-5 w-5" aria-hidden="true" /></div><h3 className="mt-4 text-sm font-semibold text-slate-900">{searchTerm || statusFilter !== 'all' ? 'No matching records' : `No ${section === 'content' ? 'website content' : section} yet`}</h3><p className="mx-auto mt-1 max-w-md text-sm leading-6 text-slate-500">{searchTerm || statusFilter !== 'all' ? 'Try a different search or status filter.' : 'The database returned no records for this section. Create the first record when you are ready.'}</p>{!searchTerm && statusFilter === 'all' && <button type="button" onClick={startNew} className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#0e224e] px-4 text-sm font-semibold text-white hover:bg-[#163467]"><CirclePlus className="h-4 w-4" aria-hidden="true" />Create first record</button>}</div>
              : <><div className="hidden grid-cols-[minmax(0,2fr)_minmax(0,1fr)_140px_120px_100px] gap-4 bg-slate-50 px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 sm:grid"><span>Name</span><span>Category</span><span>Status</span><span>Updated</span><span>Action</span></div><div>{records.map(renderRecordCard)}</div></>}
            {!recordsError && pageInfo.total > 0 && <footer className="flex flex-col gap-3 border-t border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5"><div className="flex items-center gap-2 text-xs text-slate-500"><label htmlFor="admin-page-size">Rows per page</label><select id="admin-page-size" value={pageInfo.limit} onChange={(event) => changePageSize(Number(event.target.value))} className="min-h-8 rounded-md border border-slate-200 bg-white px-2 text-xs">{PAGE_SIZES.map((size) => <option key={size} value={size}>{size}</option>)}</select><span>Showing {Math.min((pageInfo.page - 1) * pageInfo.limit + 1, pageInfo.total)}–{Math.min(pageInfo.page * pageInfo.limit, pageInfo.total)} of {pageInfo.total}</span></div><div className="flex items-center justify-between gap-2 sm:justify-end"><button type="button" disabled={pageInfo.page <= 1 || loading} onClick={() => setPageInfo((current) => ({ ...current, page: current.page - 1 }))} className="inline-flex min-h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"><ChevronLeft className="h-4 w-4" aria-hidden="true" />Previous</button><span className="min-w-20 text-center text-xs font-medium text-slate-600">Page {pageInfo.page} of {pageInfo.pages}</span><button type="button" disabled={pageInfo.page >= pageInfo.pages || loading} onClick={() => setPageInfo((current) => ({ ...current, page: current.page + 1 }))} className="inline-flex min-h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40">Next<ChevronRight className="h-4 w-4" aria-hidden="true" /></button></div></footer>}
          </section>}

          {isEditing && draft && <div className="space-y-4">
            <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
              <div className="mb-5 flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4"><div><h2 className="text-sm font-semibold text-slate-900">{section === 'services' ? 'Service details' : section === 'blog' ? 'Article details' : 'Website content details'}</h2><p className="mt-1 text-xs leading-5 text-slate-500">Required fields are validated when you save. Your changes stay in this editor until saved.</p></div><label className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-within:ring-2 focus-within:ring-brand-orange"><Upload className="h-4 w-4" aria-hidden="true" />{uploading ? 'Uploading…' : 'Upload image'}<input type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading || busy} onChange={(event) => { void uploadImage(event.target.files?.[0]); event.currentTarget.value = ''; }} className="sr-only" /></label></div>
              <div className="min-w-0"><AdminRecordEditor key={`${section}-${(selected as { _id?: string } | null)?._id ?? 'new'}`} value={draft as Record<string, JsonValue>} onChange={(record) => updateDraft(record as Record<string, unknown>)} onReview={() => setPreviewOpen(true)} /></div>
              {uploading && <div className="mt-4 rounded-lg bg-slate-50 p-3" role="status" aria-live="polite"><div className="flex items-center gap-2 text-xs font-medium text-slate-600"><LoaderCircle className="h-4 w-4 animate-spin text-brand-orange" aria-hidden="true" />Uploading image…</div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200"><span className="block h-full w-2/5 animate-pulse rounded-full bg-brand-orange" /></div></div>}
            </section>

            <details className="rounded-xl border border-slate-200 bg-white shadow-sm" open={advancedOpen} onToggle={(event) => setAdvancedOpen(event.currentTarget.open)}><summary className="flex min-h-12 cursor-pointer list-none items-center justify-between px-4 text-sm font-semibold text-slate-700"><span className="inline-flex items-center gap-2"><Settings2 className="h-4 w-4 text-slate-500" aria-hidden="true" />Advanced JSON editor</span><span className="text-xs font-normal text-slate-400">Optional</span></summary><div className="border-t border-slate-100 p-4"><p className="mb-3 text-xs leading-5 text-slate-500">Edit raw JSON only if needed. Apply valid JSON to transfer it into the visual form; invalid text will not change or block the current form values.</p><textarea aria-label="Record JSON" spellCheck={false} value={advancedJson} onChange={(event) => setAdvancedJson(event.target.value)} className="min-h-64 w-full rounded-lg border border-slate-200 bg-slate-950 p-4 font-mono text-xs leading-5 text-emerald-100 focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/30" />{parsedAdvanced.error && <p className="mt-2 text-xs font-medium text-red-700" role="alert">{parsedAdvanced.error}</p>}<div className="mt-3 flex flex-wrap gap-2"><button type="button" onClick={() => { if (parsedAdvanced.value) { updateDraft(parsedAdvanced.value); setNotice('Valid JSON applied to the visual editor.'); } }} disabled={!parsedAdvanced.value} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-[#0e224e] px-3 text-xs font-semibold text-white disabled:opacity-40"><Check className="h-3.5 w-3.5" aria-hidden="true" />Apply JSON</button><button type="button" onClick={() => setAdvancedJson(JSON.stringify(draft, null, 2))} className="min-h-9 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50">Restore from visual form</button></div></div></details>

            {operationError && <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">{operationError}</p>}{notice && <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800" role="status">{notice}</p>}
            <div className="sticky bottom-0 z-20 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur sm:px-4"><div className="flex flex-wrap gap-2"><button type="button" onClick={() => setPreviewOpen(true)} disabled={busy} className="min-h-10 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">Preview</button>{selected && openPublic(selected) && <a href={openPublic(selected)} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">Open public page</a>}{selected && <button type="button" onClick={() => void remove()} disabled={busy} className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-red-200 px-3 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"><Trash2 className="h-4 w-4" aria-hidden="true" />Delete</button>}</div><div className="ml-auto flex gap-2"><button type="button" onClick={closeEditor} disabled={busy} className="min-h-10 rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</button><button type="button" onClick={() => void save()} disabled={busy || uploading} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#0e224e] px-5 text-sm font-semibold text-white shadow-sm hover:bg-[#163467] disabled:opacity-50">{busy && <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />}{busy ? 'Saving…' : selected ? 'Save changes' : 'Create record'}</button></div></div>
          </div>}

          {!isEditing && section === 'whatsapp' && <section className="max-w-4xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><header className="border-b border-slate-200 px-4 py-4 sm:px-5"><h2 className="text-base font-semibold text-slate-900">Public WhatsApp contacts</h2><p className="mt-1 text-sm leading-6 text-slate-500">Only enter company-approved numbers. Use international format with country code; up to five unique contacts are supported.</p></header>{recordsError ? <div className="m-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800" role="alert">Could not load contacts: {recordsError}<button type="button" onClick={() => void refreshContacts()} className="ml-3 font-semibold underline">Retry</button></div> : loading ? <p className="p-5 text-sm text-slate-500" role="status">Loading contacts…</p> : <div className="space-y-3 p-4 sm:p-5">{contacts.map((contact, index) => <fieldset key={`${index}-${contact.number}`} className="grid gap-3 rounded-lg border border-slate-200 p-3 sm:grid-cols-[1fr_1fr_auto]"><legend className="px-1 text-xs font-semibold text-slate-500">Contact {index + 1}</legend><label className="text-xs font-semibold text-slate-700">Public label<input aria-label={`Contact ${index + 1} name`} value={contact.name} onChange={(event) => setContacts((current) => current.map((entry, itemIndex) => itemIndex === index ? { ...entry, name: event.target.value } : entry))} className="mt-1.5 min-h-10 w-full rounded-lg border border-slate-200 px-3 text-sm font-normal focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20" /></label><label className="text-xs font-semibold text-slate-700">International phone number<input aria-label={`Contact ${index + 1} number`} value={contact.number} inputMode="tel" onChange={(event) => setContacts((current) => current.map((entry, itemIndex) => itemIndex === index ? { ...entry, number: event.target.value } : entry))} className="mt-1.5 min-h-10 w-full rounded-lg border border-slate-200 px-3 text-sm font-normal focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20" /></label><button type="button" aria-label={`Remove contact ${index + 1}`} onClick={() => setContacts((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="min-h-10 self-end rounded-lg border border-red-200 px-3 text-xs font-semibold text-red-700 hover:bg-red-50">Remove</button></fieldset>)}{contacts.length === 0 && <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-600">No public WhatsApp contacts are configured.</p>}<div className="flex flex-wrap items-center justify-between gap-3"><button type="button" onClick={() => setContacts((current) => [...current, { name: '', number: '' }])} disabled={contacts.length >= 5} className="min-h-9 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700 disabled:opacity-40">Add contact</button><span className="text-xs text-slate-500">Changes are public after saving.</span></div><details className="rounded-lg border border-slate-200" open={contactsJsonOpen} onToggle={(event) => { if (event.currentTarget.open && !contactsJsonOpen) setContactsJson(JSON.stringify(contacts, null, 2)); setContactsJsonOpen(event.currentTarget.open); }}><summary className="cursor-pointer px-3 py-2.5 text-xs font-semibold text-slate-600">Advanced JSON</summary><div className="p-3"><textarea aria-label="WhatsApp contacts JSON" value={contactsJson} onChange={(event) => setContactsJson(event.target.value)} className="min-h-32 w-full rounded-lg border border-slate-200 p-3 font-mono text-xs"/><button type="button" onClick={saveContactsJson} className="mt-2 min-h-9 rounded-lg border border-slate-200 px-3 text-xs font-semibold">Apply contact JSON</button></div></details>{operationError && <p className="text-sm text-red-700" role="alert">{operationError}</p>}{notice && <p className="text-sm text-emerald-700" role="status">{notice}</p>}<div className="flex justify-end"><button type="button" onClick={() => void saveContacts()} disabled={busy || loading || contacts.length < 1} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#0e224e] px-4 text-sm font-semibold text-white disabled:opacity-50">{busy && <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />}{busy ? 'Saving…' : 'Save contacts'}</button></div></div>}</section>}

          {!isEditing && section === 'registration' && <section className="max-w-3xl rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div className="flex items-start gap-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600"><ShieldCheck className="h-5 w-5" aria-hidden="true" /></span><div className="min-w-0 flex-1"><h2 className="text-base font-semibold text-slate-900">Administrator registration</h2><p className="mt-1 text-sm leading-6 text-slate-600">When enabled, a person with access to the registration page can create an administrator account. Keep this disabled unless you are actively onboarding an administrator.</p><div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-slate-200 p-4"><div><p className="text-xs font-medium text-slate-500">Current setting</p><p className={`mt-1 text-sm font-bold ${registrationEnabled ? 'text-amber-700' : 'text-emerald-700'}`}>{registrationEnabled === null ? 'Status unavailable' : registrationEnabled ? 'Registration enabled' : 'Registration disabled'}</p></div><button type="button" onClick={() => { if (window.confirm(`${registrationEnabled ? 'Disable' : 'Enable'} new administrator registration?`)) { setOperationError(''); setNotice(''); void onToggleRegistration().then((succeeded) => succeeded ? setNotice('Registration setting updated.') : setOperationError('The registration setting could not be updated. Check your administrator session and try again.')).catch((cause) => setOperationError(cause instanceof Error ? cause.message : 'Registration setting could not be updated.')); } }} disabled={registrationEnabled === null || registrationLoading} className={`min-h-10 rounded-lg px-4 text-sm font-semibold text-white disabled:opacity-50 ${registrationEnabled ? 'bg-amber-700 hover:bg-amber-800' : 'bg-[#0e224e] hover:bg-[#163467]'}`}>{registrationLoading ? 'Updating…' : registrationEnabled ? 'Disable registration' : 'Enable registration'}</button></div>{operationError && <p className="mt-3 text-sm text-red-700" role="alert">{operationError}</p>}{notice && <p className="mt-3 text-sm text-emerald-700" role="status">{notice}</p>}</div></div></section>}
        </div>
      </div>
    </div>

    {previewOpen && draft && <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4" role="dialog" aria-modal="true" aria-labelledby="record-preview-title"><section className="my-5 max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-5 shadow-2xl sm:p-8"><div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4"><div><p className="text-[11px] font-bold uppercase tracking-widest text-brand-orange">Content preview</p><h2 id="record-preview-title" className="mt-1 font-heading text-xl font-bold text-[#0e224e]">{String(draft.title || draft.key || 'Website content')}</h2></div><button type="button" onClick={() => setPreviewOpen(false)} aria-label="Close preview" className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"><X className="h-4 w-4" aria-hidden="true" /></button></div>{typeof draft.overview === 'string' && <p className="mt-4 text-base text-slate-700">{draft.overview}</p>}{typeof draft.excerpt === 'string' && <p className="mt-3 text-sm text-slate-600">{draft.excerpt}</p>}{typeof draft.description === 'string' && <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-700">{draft.description}</p>}{typeof draft.body === 'string' && <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-700">{draft.body}</p>}{typeof draft.mainImage === 'string' && draft.mainImage && <img src={draft.mainImage} alt="Preview" className="mt-5 max-h-80 w-full rounded-lg object-cover"/>}{Array.isArray(draft.gallery) && <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">{draft.gallery.map((entry, index) => { const image = entry as { url?: string; alt?: string }; return image.url ? <img key={`${image.url}-${index}`} src={image.url} alt={image.alt || ''} className="aspect-[4/3] w-full rounded-lg object-cover"/> : null; })}</div>}{Array.isArray(draft.images) && <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">{draft.images.map((entry, index) => { const image = entry as { url?: string; alt?: string }; return image.url ? <img key={`${image.url}-${index}`} src={image.url} alt={image.alt || ''} className="aspect-[4/3] w-full rounded-lg object-cover"/> : null; })}</div>}<button type="button" onClick={() => setPreviewOpen(false)} className="mt-6 min-h-10 rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-700">Close preview</button></section></div>}
  </main>;
};
