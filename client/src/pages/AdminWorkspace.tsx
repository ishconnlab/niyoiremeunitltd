import React, { useCallback, useEffect, useState } from 'react';
import { apiRequest } from '../utils/api';
import type { CmsBlogPost, CmsService, WhatsAppContact } from '../types/cms';
import { AdminRecordEditor, type JsonValue } from '../components/admin/AdminRecordEditor';

type Section = 'services' | 'blog' | 'content' | 'whatsapp';
type RecordItem = CmsService | CmsBlogPost | Record<string, unknown>;

const blankFor = (section: Section): Record<string, unknown> => section === 'services'
  ? { slug: '', title: '', overview: '', description: '', problems: [], includedWork: [], materials: [], workflow: [], deliverables: [], benefits: [], customization: [], costFactors: [], faqs: [], relatedServices: [], mainImage: '', gallery: [], seoTitle: '', seoDescription: '', status: 'draft', isActive: false, showOnHomePage: false, order: 0 }
  : section === 'blog'
    ? { title: '', slug: '', excerpt: '', body: '', featuredImage: null, images: [], youtubeVideoId: '', categories: [], tags: [], author: 'NIYO IREME UNIT LTD', status: 'draft', publishedAt: null, seoTitle: '', seoDescription: '' }
    : { section: 'hero', key: '', value: '', imageUrl: '', isActive: false, order: 0 };

const parseList = (data: unknown): RecordItem[] => Array.isArray(data) ? data as RecordItem[] : [];

export const AdminWorkspace: React.FC<{ onLogout: () => void; registrationEnabled: boolean | null; onToggleRegistration: () => void; registrationLoading: boolean }> = ({ onLogout, registrationEnabled, onToggleRegistration, registrationLoading }) => {
  const [section, setSection] = useState<Section>('services');
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [selected, setSelected] = useState<RecordItem | null>(null);
  const [json, setJson] = useState('');
  const [contactJson, setContactJson] = useState('[\n  { "name": "NIYO IREME UNIT LTD", "number": "250781294928" }\n]');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [recordSearch, setRecordSearch] = useState('');

  let parsedRecord: Record<string, unknown> | null = null;
  try {
    const parsed: unknown = JSON.parse(json);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) parsedRecord = parsed as Record<string, unknown>;
  } catch { /* Advanced JSON may be temporarily incomplete while being edited. */ }
  let parsedContacts: WhatsAppContact[] = [];
  try {
    const parsed: unknown = JSON.parse(contactJson);
    if (Array.isArray(parsed)) parsedContacts = parsed as WhatsAppContact[];
  } catch { /* Contact fields remain editable through the advanced JSON section. */ }

  const endpoint = section === 'services' ? '/services/admin' : section === 'blog' ? '/blog/admin' : '/content/admin';
  const refresh = useCallback(async () => {
    setLoading(true);
    if (section === 'whatsapp') {
      try {
        const result = await apiRequest<{ data: { whatsappContacts: WhatsAppContact[] } }>('/settings/public');
        setContactJson(JSON.stringify(result.data.whatsappContacts, null, 2));
      } finally { setLoading(false); }
      return;
    }
    try {
      const result = await apiRequest<{ data: RecordItem[] }>(endpoint);
      setRecords(parseList(result.data));
    } finally { setLoading(false); }
  }, [endpoint, section]);

  useEffect(() => {
    setSelected(null); setJson(''); setError(''); setNotice('');
    void refresh().catch((cause) => setError(cause instanceof Error ? cause.message : 'Unable to load records.'));
  }, [refresh]);

  const startNew = () => { setSelected(null); setJson(JSON.stringify(blankFor(section), null, 2)); setError(''); setNotice(''); };
  const selectRecord = (record: RecordItem) => { setSelected(record); setJson(JSON.stringify(record, null, 2)); setError(''); setNotice(''); };

  const save = async () => {
    setBusy(true); setError(''); setNotice('');
    try {
      const payload = JSON.parse(json) as Record<string, unknown>;
      const id = (selected as { _id?: string } | null)?._id;
      const url = section === 'services' ? '/services' : section === 'blog' ? '/blog' : '/content';
      const result = await apiRequest<{ data: RecordItem }>(id ? `${url}/${id}` : url, { method: id ? 'PUT' : 'POST', body: JSON.stringify(payload) });
      setSelected(result.data); setJson(JSON.stringify(result.data, null, 2));
      setNotice(section === 'blog' && payload.status === 'published'
        ? 'Article published.'
        : section === 'content'
          ? payload.isActive === false ? 'Website content saved as unpublished.' : 'Website content published.'
          : 'Changes saved.');
      await refresh();
      window.dispatchEvent(new Event('niyo:cms-updated'));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not save. Check the JSON and required fields.');
    } finally { setBusy(false); }
  };

  const remove = async () => {
    const id = (selected as { _id?: string } | null)?._id;
    if (!id || !window.confirm('Delete this record permanently? This cannot be undone.')) return;
    setBusy(true); setError('');
    try {
      const url = section === 'services' ? '/services' : section === 'blog' ? '/blog' : '/content';
      await apiRequest(`${url}/${id}`, { method: 'DELETE' });
      setSelected(null); setJson(''); setNotice('Record deleted.'); await refresh(); window.dispatchEvent(new Event('niyo:cms-updated'));
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not delete this record.'); }
    finally { setBusy(false); }
  };

  const saveContacts = async () => {
    setBusy(true); setError(''); setNotice('');
    try {
      const value = JSON.parse(contactJson) as WhatsAppContact[];
      await apiRequest('/settings/whatsapp-contacts', { method: 'PUT', body: JSON.stringify({ whatsappContacts: value }) });
      setNotice('Public WhatsApp contacts updated.');
      window.dispatchEvent(new Event('niyo:cms-updated'));
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Contacts are invalid.'); }
    finally { setBusy(false); }
  };

  const uploadImage = async (file?: File) => {
    if (!file) return;
    setError(''); setNotice('');
    if (file.size > 5 * 1024 * 1024) { setError('Image must be 5 MB or smaller.'); return; }
    setUploading(true);
    try {
      const form = new FormData(); form.append('image', file);
      const payload = JSON.parse(json || '{}') as Record<string, unknown>;
      if (section === 'services' && Array.isArray(payload.gallery) && payload.gallery.length >= 10) throw new Error('Service galleries allow up to 10 images.');
      if (section === 'blog') {
        const galleryLength = Array.isArray(payload.images) ? payload.images.length : 0;
        const featuredUrl = (payload.featuredImage as { url?: string } | null)?.url;
        const featuredInGallery = featuredUrl && Array.isArray(payload.images) && payload.images.some((entry) => (entry as { url?: string }).url === featuredUrl);
        if (galleryLength + (featuredUrl && !featuredInGallery ? 1 : 0) >= 5) throw new Error('A blog post can have no more than five images in total, including its featured image.');
      }
      const result = await apiRequest<{ imageUrl: string }>('/upload', { method: 'POST', body: form });
      const image = { url: result.imageUrl, alt: '' };
      if (section === 'services') {
        const gallery = Array.isArray(payload.gallery) ? payload.gallery : [];
        payload.gallery = [...gallery, image]; if (!payload.mainImage) payload.mainImage = result.imageUrl;
      } else if (section === 'blog') {
        const images = Array.isArray(payload.images) ? payload.images : [];
        payload.images = [...images, image]; if (!payload.featuredImage) payload.featuredImage = image;
      } else {
        payload.imageUrl = result.imageUrl;
      }
      setJson(JSON.stringify(payload, null, 2)); setNotice('Image uploaded. Add descriptive alt text before saving.');
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Image upload failed.'); }
    finally { setUploading(false); }
  };

  const tabs: Array<[Section, string]> = [['services', 'Services'], ['blog', 'Blog'], ['content', 'Website content'], ['whatsapp', 'WhatsApp contacts']];
  const statusOf = (item: RecordItem) => {
    const record = item as { status?: string; isActive?: boolean; section?: string };
    if (record.status) return record.status;
    if (record.section) return record.isActive === false ? 'Unpublished' : 'Published';
    return record.isActive === false ? 'Inactive' : 'Active';
  };
  const filteredRecords = records.filter((item) => {
    const value = item as { title?: string; key?: string; slug?: string; section?: string };
    return `${value.title || ''} ${value.key || ''} ${value.slug || ''} ${value.section || ''}`.toLowerCase().includes(recordSearch.trim().toLowerCase());
  });

  return <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-7xl">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div><p className="text-xs font-bold uppercase tracking-widest text-brand-orange">NIYO IREME UNIT LTD</p><h1 className="mt-1 font-heading text-2xl font-black text-brand-navy sm:text-3xl">Content management</h1><p className="mt-1 text-sm text-slate-600">Update public services, articles, website content and approved WhatsApp contacts.</p></div>
        <button type="button" onClick={onLogout} className="min-h-11 rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100">Sign out</button>
      </header>
      <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label="Content types">{tabs.map(([id, label]) => <button key={id} type="button" role="tab" aria-selected={section === id} onClick={() => setSection(id)} className={`min-h-11 rounded-full px-4 text-sm font-bold ${section === id ? 'bg-brand-navy text-white' : 'border border-slate-300 bg-white text-slate-700'}`}>{label}</button>)}</div>
      {section !== 'whatsapp' && <div className="mt-5 grid gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between gap-2"><h2 className="font-bold text-brand-navy">Records <span className="text-slate-500">({records.length})</span></h2><button type="button" onClick={startNew} className="min-h-10 rounded-full bg-brand-orange px-4 text-sm font-bold text-white hover:bg-brand-orange-dark">New</button></div>
          <label className="mt-3 block text-xs font-semibold text-slate-600">Search records<input aria-label="Search records" value={recordSearch} onChange={(event) => setRecordSearch(event.target.value)} className="mt-1 min-h-10 w-full rounded-lg border border-slate-300 px-3 text-sm font-normal" /></label>
          <ul className="mt-3 max-h-[65vh] space-y-1 overflow-y-auto">{filteredRecords.map((item, index) => { const obj = item as { _id?: string; title?: string; key?: string; slug?: string }; return <li key={obj._id || obj.slug || `${obj.key}-${index}`}><button type="button" onClick={() => selectRecord(item)} className={`w-full rounded-xl p-3 text-left text-sm ${selected === item ? 'bg-brand-orange/10 text-brand-navy' : 'hover:bg-slate-50'}`}><span className="block truncate font-semibold">{obj.title || obj.slug || obj.key || `Record ${index + 1}`}</span><span className="mt-1 block text-xs text-slate-500">{statusOf(item)}</span></button></li>; })}</ul>
          {loading && <p role="status" className="mt-3 text-sm text-slate-500">Loading records…</p>}
          {!loading && records.length === 0 && <p className="mt-4 text-sm text-slate-600">No records yet. Create one to get started.</p>}
          {!loading && records.length > 0 && filteredRecords.length === 0 && <p className="mt-4 text-sm text-slate-600">No records match this search.</p>}
        </aside>
        <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-heading text-xl font-bold text-brand-navy">{selected ? 'Edit record' : `New ${section === 'content' ? 'website content' : section === 'blog' ? 'article' : 'service'}`}</h2><p className="mt-1 text-xs text-slate-500">Edit labelled fields below. Article content is plain text and displayed safely.</p></div><label className="inline-flex min-h-10 cursor-pointer items-center rounded-full border border-slate-300 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50">{uploading ? 'Uploading…' : 'Upload image'}<input type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading} onChange={(event) => { void uploadImage(event.target.files?.[0]); event.currentTarget.value = ''; }} className="sr-only" /></label></div>
          {parsedRecord ? <div className="mt-4"><AdminRecordEditor key={`${section}-${(selected as { _id?: string } | null)?._id ?? 'new'}`} value={parsedRecord as Record<string, JsonValue>} onChange={(record) => setJson(JSON.stringify(record, null, 2))} /></div> : <p role="alert" className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">The advanced JSON has a syntax error. Correct it below to continue editing.</p>}
          {uploading && <div className="mt-4" role="status" aria-live="polite"><p className="mb-2 text-sm font-semibold text-slate-700">Uploading image…</p><div role="progressbar" aria-label="Image upload in progress" aria-valuemin={0} aria-valuemax={100} className="h-2 overflow-hidden rounded-full bg-slate-200"><span className="block h-full w-1/2 animate-pulse rounded-full bg-brand-orange" /></div></div>}
          <details className="mt-4 rounded-xl border border-slate-200"><summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-slate-700">Advanced JSON editor</summary><textarea aria-label="Record JSON" spellCheck={false} value={json} onChange={(event) => setJson(event.target.value)} className="min-h-[320px] w-full rounded-b-xl border-t border-slate-200 bg-slate-950 p-4 font-mono text-xs leading-5 text-emerald-100 focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/30" /></details>
          {error && <p role="alert" className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}{notice && <p role="status" className="mt-3 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">{notice}</p>}
          <div className="mt-4 flex flex-wrap gap-3"><button type="button" onClick={() => void save()} disabled={busy || uploading || !parsedRecord} className="min-h-11 rounded-full bg-brand-navy px-5 font-bold text-white hover:bg-brand-navy-soft disabled:opacity-50">{busy ? 'Saving…' : selected ? 'Save changes' : 'Create record'}</button>{selected && <button type="button" onClick={() => void remove()} disabled={busy} className="min-h-11 rounded-full border border-red-300 px-5 font-bold text-red-700 hover:bg-red-50 disabled:opacity-50">Delete</button>}<button type="button" onClick={() => setPreviewOpen(true)} disabled={!parsedRecord} className="min-h-11 rounded-full border border-slate-300 px-5 font-bold text-slate-700 disabled:opacity-40">Preview</button>{selected && section !== 'content' && <a href={section === 'services' ? `/services/${(selected as CmsService).slug}` : `/blog/${(selected as CmsBlogPost).slug}`} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center rounded-full border border-slate-300 px-5 font-bold text-slate-700 hover:bg-slate-50">Open public page</a>}</div>
        </section>
      </div>}
      {section === 'whatsapp' && <section className="mt-5 max-w-3xl rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
        <h2 className="font-heading text-xl font-bold text-brand-navy">Public WhatsApp contacts</h2><p className="mt-1 text-sm text-slate-600">Only add numbers approved for public enquiries. Use international format with country code. Up to five unique contacts.</p><div className="mt-4 space-y-3">{parsedContacts.map((contact, index) => <fieldset key={`${index}-${contact.number}`} className="grid gap-3 rounded-xl border border-slate-200 p-3 sm:grid-cols-[1fr_1fr_auto]"><legend className="px-1 text-xs font-semibold text-slate-500">Contact {index + 1}</legend><label className="text-sm font-semibold text-slate-800">Public label<input aria-label={`Contact ${index + 1} name`} value={contact.name} onChange={(event) => { const next = [...parsedContacts]; next[index] = { ...contact, name: event.target.value }; setContactJson(JSON.stringify(next, null, 2)); }} className="mt-1 min-h-11 w-full rounded-lg border border-slate-300 px-3 font-normal" /></label><label className="text-sm font-semibold text-slate-800">WhatsApp number<input aria-label={`Contact ${index + 1} number`} value={contact.number} inputMode="tel" onChange={(event) => { const next = [...parsedContacts]; next[index] = { ...contact, number: event.target.value }; setContactJson(JSON.stringify(next, null, 2)); }} className="mt-1 min-h-11 w-full rounded-lg border border-slate-300 px-3 font-normal" /></label><button type="button" onClick={() => setContactJson(JSON.stringify(parsedContacts.filter((_, contactIndex) => contactIndex !== index), null, 2))} className="min-h-11 self-end rounded-lg border border-red-200 px-3 text-sm font-semibold text-red-700">Remove</button></fieldset>)}</div><button type="button" onClick={() => setContactJson(JSON.stringify([...parsedContacts, { name: '', number: '' }], null, 2))} disabled={parsedContacts.length >= 5} className="mt-3 min-h-10 rounded-full border border-slate-300 px-4 text-sm font-semibold disabled:opacity-40">Add contact</button><details className="mt-3"><summary className="cursor-pointer text-sm text-slate-600">Advanced JSON</summary><textarea aria-label="WhatsApp contacts JSON" value={contactJson} onChange={(event) => setContactJson(event.target.value)} className="mt-2 min-h-36 w-full rounded-xl border border-slate-300 p-3 font-mono text-xs" /></details>{loading && <p role="status" className="mt-3 text-sm text-slate-500">Loading contacts…</p>}{error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}{notice && <p role="status" className="mt-3 text-sm text-emerald-800">{notice}</p>}<button type="button" onClick={() => void saveContacts()} disabled={busy || loading || parsedContacts.length < 1} className="mt-4 min-h-11 rounded-full bg-brand-navy px-5 font-bold text-white disabled:opacity-50">{busy ? 'Saving…' : 'Save contacts'}</button></section>}
      <section className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4"><div><h2 className="font-bold text-brand-navy">Admin registration</h2><p className="mt-1 text-sm text-slate-600">Currently {registrationEnabled === null ? 'unavailable' : registrationEnabled ? 'enabled' : 'disabled'}.</p></div><button type="button" onClick={onToggleRegistration} disabled={registrationLoading} className="min-h-11 rounded-full border border-slate-300 px-4 text-sm font-bold text-slate-700 disabled:opacity-50">{registrationLoading ? 'Updating…' : registrationEnabled ? 'Disable registration' : 'Enable registration'}</button></section>
      <p className="mt-4 text-xs text-slate-500">Blog body uses plain text with line breaks. Optional YouTube values must be a supported URL or 11-character video ID. Articles can have up to five optional gallery images.</p>
    </div>
    {previewOpen && parsedRecord && <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/70 p-4" role="dialog" aria-modal="true" aria-labelledby="record-preview-title"><section className="my-6 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-8"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-widest text-brand-orange">Unpublished preview</p><h2 id="record-preview-title" className="mt-1 font-heading text-2xl font-black text-brand-navy">{String(parsedRecord.title || parsedRecord.key || 'Content preview')}</h2></div><button type="button" onClick={() => setPreviewOpen(false)} className="min-h-11 rounded-full border border-slate-300 px-4 text-sm font-semibold">Close</button></div>{typeof parsedRecord.overview === 'string' && <p className="mt-4 text-lg text-slate-700">{parsedRecord.overview}</p>}{typeof parsedRecord.excerpt === 'string' && <p className="mt-4 text-lg text-slate-700">{parsedRecord.excerpt}</p>}{typeof parsedRecord.description === 'string' && <p className="mt-4 whitespace-pre-line leading-7 text-slate-700">{parsedRecord.description}</p>}{typeof parsedRecord.body === 'string' && <p className="mt-4 whitespace-pre-line leading-7 text-slate-700">{parsedRecord.body}</p>}{typeof parsedRecord.mainImage === 'string' && parsedRecord.mainImage && <img src={parsedRecord.mainImage} alt="Preview image" className="mt-5 max-h-80 w-full rounded-xl object-cover" />}{Array.isArray(parsedRecord.gallery) && <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">{parsedRecord.gallery.map((item, index) => { const image = item as { url?: string; alt?: string }; return image.url ? <img key={`${image.url}-${index}`} src={image.url} alt={image.alt || ''} className="aspect-[4/3] w-full rounded-lg object-cover" /> : null; })}</div>}{Array.isArray(parsedRecord.images) && <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">{parsedRecord.images.map((item, index) => { const image = item as { url?: string; alt?: string }; return image.url ? <img key={`${image.url}-${index}`} src={image.url} alt={image.alt || ''} className="aspect-[4/3] w-full rounded-lg object-cover" /> : null; })}</div>}<p className="mt-5 border-t border-slate-200 pt-4 text-xs text-slate-500">This preview shows the current editor values. Save the record to publish or update its public page.</p></section></div>}
  </main>;
};
