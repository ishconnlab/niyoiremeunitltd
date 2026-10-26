import React from 'react';

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

export const AdminRecordEditor: React.FC<{ value: Record<string, JsonValue>; onChange: (value: Record<string, JsonValue>) => void }> = ({ value, onChange }) => {
  const renderField = (key: string, fieldValue: JsonValue, path: Array<string | number>): React.ReactNode => {
    if (key === '_id' || key === '__v' || key === 'createdAt' || key === 'updatedAt') return null;
    const id = `admin-field-${path.map(String).join('-')}`;
    const label = humanize(key);
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
              ? <div className="grid min-w-0 gap-3 sm:grid-cols-2">{Object.entries(item).map(([childKey, childValue]) => renderField(childKey, childValue, [...path, index, childKey]))}</div>
              : <input aria-label={`${label} item ${index + 1}`} value={String(item ?? '')} onChange={(event) => { const next = [...fieldValue]; next[index] = event.target.value; set(next); }} className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/25" />}
          </div>)}
        </div>
        <button type="button" disabled={max !== undefined && fieldValue.length >= max} onClick={() => set([...fieldValue, blankArrayItem(key, fieldValue)])} className="mt-3 min-h-10 rounded-full border border-slate-300 px-4 text-sm font-semibold text-slate-700 disabled:opacity-40">Add {label.toLowerCase()} item</button>
      </fieldset>;
    }

    if (typeof fieldValue === 'boolean') return <label key={id} className="flex min-h-11 items-center gap-3 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-800"><input id={id} type="checkbox" checked={fieldValue} onChange={(event) => set(event.target.checked)} className="h-4 w-4 accent-brand-orange" />{label}</label>;

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

  return <div className="space-y-4">{Object.entries(value).map(([key, fieldValue]) => renderField(key, fieldValue, [key]))}</div>;
};
