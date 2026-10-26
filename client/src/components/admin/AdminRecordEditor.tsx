import React, { useState } from 'react';

export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

const updateAt = (root: JsonValue, path: Array<string | number>, value: JsonValue): JsonValue => {
  if (path.length === 0) return value;
  const [head, ...tail] = path;
  if (Array.isArray(root)) {
    const next = [...root];
    next[Number(head)] = updateAt(next[Number(head)], tail, value);
    return next;
  }
  if (root && typeof root === 'object') return { ...root, [String(head)]: updateAt(root[String(head)], tail, value) };
  return root;
};

const blankArrayItem = (key: string, items: JsonValue[]): JsonValue => {
  const existing = items.find((item) => item !== null && typeof item === 'object' && !Array.isArray(item));
  if (existing && typeof existing === 'object' && !Array.isArray(existing)) return Object.fromEntries(Object.keys(existing).map((field) => [field, ''])) as JsonValue;
  if (['gallery', 'images'].includes(key)) return { url: '', alt: '' };
  if (key === 'faqs') return { question: '', answer: '' };
  return '';
};

const humanize = (key: string) => key.replace(/([A-Z])/g, ' $1').replace(/[_-]/g, ' ').replace(/^./, (letter) => letter.toUpperCase());

export const AdminRecordEditor: React.FC<{ value: Record<string, JsonValue>; onChange: (value: Record<string, JsonValue>) => void; onReview?: () => void }> = ({ value, onChange, onReview }) => {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageError, setPageError] = useState('');
  const fields = Object.entries(value).filter(([key]) => !['_id', '__v', 'createdAt', 'updatedAt'].includes(key));
  const groups: Array<{ title: string; keys: string[] }> = [
    { title: 'Basic information', keys: ['section', 'key', 'title', 'slug', 'overview', 'excerpt', 'description', 'body', 'value', 'eyebrow', 'subtitle', 'question', 'answer', 'caption', 'author', 'category', 'categories', 'tags'] },
    { title: 'Service details', keys: ['problems', 'includedWork', 'materials', 'workflow', 'deliverables', 'benefits', 'costFactors', 'customization', 'faqs', 'relatedServices', 'points', 'steps'] },
    { title: 'Images and media', keys: ['imageUrl', 'mainImage', 'heroImage', 'featuredImage', 'images', 'gallery', 'youtubeVideoId', 'videoUrl'] },
    { title: 'Publishing and SEO', keys: ['status', 'isActive', 'showOnHomePage', 'featured', 'publishedAt', 'order', 'seoTitle', 'seoDescription'] },
  ];
  const groupedFields = groups.map((group) => ({ ...group, entries: fields.filter(([key]) => group.keys.includes(key)) })).filter((group) => group.entries.length > 0);
  const assigned = new Set(groupedFields.flatMap((group) => group.entries.map(([key]) => key)));
  const otherFields = fields.filter(([key]) => !assigned.has(key));
  if (otherFields.length > 0) groupedFields.push({ title: 'Other fields', keys: [], entries: otherFields });
  const pages = fields.length > 10
    ? [...groupedFields, { title: 'Review', keys: [], entries: [] as Array<[string, JsonValue]> }]
    : [{ title: 'Content details', keys: [], entries: fields }];
  const activePageIndex = Math.min(pageIndex, pages.length - 1);
  const isReview = pages[activePageIndex]?.title === 'Review';
  const canContinue = () => {
    const required = typeof value.title === 'string'
      ? ['title', 'slug', ...(typeof value.overview === 'string' ? ['overview', 'description'] : []), ...(typeof value.excerpt === 'string' ? ['excerpt', 'body'] : [])]
      : typeof value.section === 'string' ? ['section', 'key', 'value'] : [];
    const fieldsOnPage = new Set(pages[activePageIndex]?.entries.map(([key]) => key) ?? []);
    const missing = required.filter((key) => fieldsOnPage.has(key) && (value[key] === null || value[key] === undefined || value[key] === '' || (Array.isArray(value[key]) && value[key].length === 0)));
    if (missing.length) {
      setPageError(`Complete the required ${missing.map(humanize).join(', ')} field${missing.length === 1 ? '' : 's'} before continuing.`);
      return false;
    }
    setPageError('');
    return true;
  };
  const goToPage = (index: number) => {
    if (index > activePageIndex && !canContinue()) return;
    setPageError('');
    setPageIndex(index);
  };
  const renderField = (key: string, fieldValue: JsonValue, path: Array<string | number>): React.ReactNode => {
    if (key === '_id' || key === '__v' || key === 'createdAt' || key === 'updatedAt') return null;
    const id = `admin-field-${path.map(String).join('-')}`;
    const isWebsiteContent = typeof value.section === 'string';
    const label = key === 'isActive' && isWebsiteContent ? 'Publish on website' : humanize(key);
    const set = (next: JsonValue) => {
      const updated = updateAt(value, path, next) as Record<string, JsonValue>;
      if (path[0] === 'gallery' && Array.isArray(updated.gallery)) {
        const first = updated.gallery[0];
        updated.mainImage = first && typeof first === 'object' && !Array.isArray(first) && typeof first.url === 'string' ? first.url : '';
      }
      onChange(updated);
    };

    if (Array.isArray(fieldValue)) {
      const feature = value.featuredImage;
      const featuredUrl = feature && typeof feature === 'object' && !Array.isArray(feature) && typeof feature.url === 'string' ? feature.url : '';
      const isFeatureInGallery = featuredUrl && fieldValue.some((item) => item && typeof item === 'object' && !Array.isArray(item) && item.url === featuredUrl);
      const max = key === 'images' ? 5 - (featuredUrl && !isFeatureInGallery ? 1 : 0) : key === 'gallery' ? 10 : undefined;
      return <fieldset key={id} className="min-w-0 rounded-xl border border-slate-200 p-3 sm:p-4">
        <legend className="px-1 text-sm font-bold text-slate-800">{label}{max ? ` (up to ${max})` : ''}</legend>
        <div className="space-y-3">
          {fieldValue.map((item, index) => <div key={`${id}-${index}`} className="rounded-lg bg-slate-50 p-3">
            <div className="mb-2 flex items-center justify-between gap-2"><span className="text-xs font-semibold text-slate-500">Item {index + 1}</span><div className="flex gap-1">
              <button type="button" aria-label={`Move ${label} item ${index + 1} up`} disabled={index === 0} onClick={() => { const next = [...fieldValue]; [next[index - 1], next[index]] = [next[index], next[index - 1]]; set(next); }} className="min-h-9 rounded-lg border border-slate-300 px-2 text-xs disabled:opacity-40">Up</button>
              <button type="button" aria-label={`Move ${label} item ${index + 1} down`} disabled={index === fieldValue.length - 1} onClick={() => { const next = [...fieldValue]; [next[index + 1], next[index]] = [next[index], next[index + 1]]; set(next); }} className="min-h-9 rounded-lg border border-slate-300 px-2 text-xs disabled:opacity-40">Down</button>
              <button type="button" aria-label={`Remove ${label} item ${index + 1}`} onClick={() => set(fieldValue.filter((_, itemIndex) => itemIndex !== index))} className="min-h-9 rounded-lg border border-red-200 px-2 text-xs font-semibold text-red-700">Remove</button>
            </div></div>
            {item && typeof item === 'object' && !Array.isArray(item)
              ? <>{typeof item.url === 'string' && item.url && <img src={item.url} alt={typeof item.alt === 'string' ? item.alt : ''} loading="lazy" className="mb-3 aspect-[16/7] max-h-48 w-full rounded-lg border border-slate-200 bg-white object-cover" />}<div className="grid min-w-0 gap-3 sm:grid-cols-2">{Object.entries(item).map(([childKey, childValue]) => renderField(childKey, childValue, [...path, index, childKey]))}</div></>
              : <input aria-label={`${label} item ${index + 1}`} value={String(item ?? '')} onChange={(event) => { const next = [...fieldValue]; next[index] = event.target.value; set(next); }} className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/25" />}
          </div>)}
        </div>
        <button type="button" disabled={max !== undefined && fieldValue.length >= max} onClick={() => set([...fieldValue, blankArrayItem(key, fieldValue)])} className="mt-3 min-h-10 rounded-full border border-slate-300 px-4 text-sm font-semibold text-slate-700 disabled:opacity-40">Add {label.toLowerCase()} item</button>
      </fieldset>;
    }

    if (typeof fieldValue === 'boolean') return <label key={id} className="flex min-h-11 items-center gap-3 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-800"><input id={id} type="checkbox" checked={fieldValue} onChange={(event) => set(event.target.checked)} className="h-4 w-4 accent-brand-orange" /><span>{label}{key === 'isActive' && isWebsiteContent && <span className="mt-0.5 block text-xs font-normal text-slate-500">{fieldValue ? 'Published content is visible on the website.' : 'Unpublished content stays hidden from public pages.'}</span>}</span></label>;

    if (typeof fieldValue === 'number') return <label key={id} className="block min-w-0 text-sm font-semibold text-slate-800">{label}<input id={id} type="number" value={fieldValue} onChange={(event) => set(Number(event.target.value))} className="mt-1 min-h-11 w-full rounded-lg border border-slate-300 px-3 font-normal focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/25" /></label>;

    if (key === 'featuredImage' && fieldValue && typeof fieldValue === 'object' && !Array.isArray(fieldValue)) return <fieldset key={id} className="min-w-0 rounded-xl border border-slate-200 p-3"><legend className="px-1 text-sm font-bold text-slate-800">Featured image</legend><label className="flex min-h-10 items-center gap-3 text-sm font-semibold text-slate-800"><input type="checkbox" checked onChange={() => set(null)} className="h-4 w-4 accent-brand-orange" />Use featured image</label><div className="mt-3 grid min-w-0 gap-3 sm:grid-cols-2">{Object.entries(fieldValue).map(([childKey, childValue]) => renderField(childKey, childValue, [...path, childKey]))}</div></fieldset>;

    if (fieldValue && typeof fieldValue === 'object') return <fieldset key={id} className="min-w-0 rounded-xl border border-slate-200 p-3 sm:p-4"><legend className="px-1 text-sm font-bold text-slate-800">{label}</legend><div className="grid min-w-0 gap-3 sm:grid-cols-2">{Object.entries(fieldValue).map(([childKey, childValue]) => renderField(childKey, childValue, [...path, childKey]))}</div></fieldset>;

    if (fieldValue === null && key === 'featuredImage') return <div key={id} className="rounded-xl border border-slate-200 p-3"><label className="flex min-h-10 items-center gap-3 text-sm font-semibold text-slate-800"><input type="checkbox" checked={false} onChange={(event) => { if (event.target.checked) set({ url: '', alt: '' }); }} className="h-4 w-4 accent-brand-orange" />Add optional featured image</label></div>;
    if (fieldValue === null) return <label key={id} className="block min-w-0 text-sm font-semibold text-slate-800">{label}<input id={id} value="" onChange={(event) => set(event.target.value)} className="mt-1 min-h-11 w-full rounded-lg border border-slate-300 px-3 font-normal focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/25" /></label>;

    const text = String(fieldValue ?? '');
    const multiline = ['body', 'description', 'overview', 'excerpt', 'answer', 'summary', 'value'].includes(key);
    const options = key === 'status' ? ['draft', 'published'] : key === 'section' ? ['hero', 'about', 'contact', 'footer', 'gallery', 'faq', 'services', 'equipment', 'workforce', 'home', 'benefits', 'company', 'social', 'quote', 'privacy', 'team', 'blog', 'seo'] : [];
    return <label key={id} className="block min-w-0 text-sm font-semibold text-slate-800">{label}{options.length ? <select id={id} value={text} onChange={(event) => set(event.target.value)} className="mt-1 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 font-normal focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/25">{options.map((option) => <option key={option} value={option}>{humanize(option)}</option>)}</select> : multiline ? <textarea id={id} rows={key === 'body' || key === 'description' ? 8 : 4} value={text} onChange={(event) => set(event.target.value)} className="mt-1 min-h-24 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/25" /> : <input id={id} value={text} onChange={(event) => set(event.target.value)} className="mt-1 min-h-11 w-full rounded-lg border border-slate-300 px-3 font-normal focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/25" />}</label>;
  };

  return <div className="space-y-4">
    {pages.length > 1 && <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 sm:p-4">
      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-500">Form sections · {activePageIndex + 1} of {pages.length}</p>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Editor form sections">{pages.map((page, index) => <button key={page.title} type="button" role="tab" aria-selected={index === activePageIndex} onClick={() => goToPage(index)} className={`min-h-9 rounded-lg px-3 text-xs font-semibold transition-colors ${index === activePageIndex ? 'bg-brand-navy text-white' : 'border border-slate-300 bg-white text-slate-700 hover:border-brand-navy'}`}>{page.title}</button>)}</div>
    </div>}
    <h3 className="font-heading text-lg font-bold text-brand-navy">{pages[activePageIndex]?.title}</h3>
    {pageError && <p role="alert" className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">{pageError}</p>}
    {isReview ? <div className="rounded-xl border border-slate-200 bg-slate-50 p-4"><p className="text-sm font-semibold text-slate-800">Review before saving</p><p className="mt-1 text-sm leading-6 text-slate-600">Check the title, content, images and publication status. Use Preview to see the current content, then save to create or update the record.</p><dl className="mt-4 grid gap-3 sm:grid-cols-2">{[['Title', value.title], ['Slug / key', value.slug || value.key], ['Status', value.status || (value.isActive === false ? 'Unpublished' : 'Published')], ['Images', Array.isArray(value.gallery) ? value.gallery.length : Array.isArray(value.images) ? value.images.length : value.mainImage ? 1 : 0]].map(([label, fieldValue]) => <div key={String(label)} className="rounded-lg border border-slate-200 bg-white p-3"><dt className="text-[11px] font-medium uppercase tracking-wide text-slate-500">{String(label)}</dt><dd className="mt-1 truncate text-sm font-semibold text-slate-800">{String(fieldValue ?? '—')}</dd></div>)}</dl><button type="button" onClick={onReview} className="mt-4 min-h-10 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50">Open preview</button></div>
      : <div className="space-y-4">{pages[activePageIndex]?.entries.map(([key, fieldValue]) => renderField(key, fieldValue, [key]))}</div>}
    {pages.length > 1 && <div className="flex items-center justify-between border-t border-slate-200 pt-3"><button type="button" disabled={activePageIndex === 0} onClick={() => goToPage(activePageIndex - 1)} className="min-h-10 rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-700 disabled:opacity-40">Previous</button><span className="text-xs text-slate-500">Step {activePageIndex + 1} of {pages.length}</span><button type="button" disabled={activePageIndex === pages.length - 1} onClick={() => goToPage(activePageIndex + 1)} className="min-h-10 rounded-lg bg-brand-navy px-4 text-sm font-semibold text-white disabled:opacity-40">Continue</button></div>}
  </div>;
};
