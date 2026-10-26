import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import type { WhatsAppContact } from '../../types/cms';
import { buildWhatsAppUrls } from '../../utils/whatsapp';

export const WhatsAppInquiry: React.FC<{ serviceName: string; contacts: WhatsAppContact[] }> = ({ serviceName, contacts }) => {
  const [selected, setSelected] = useState<string[]>(contacts.length === 1 ? [contacts[0].number] : []);
  const [error, setError] = useState('');
  const openSelected = (numbers: string[]) => {
    setError('');
    const chosen = contacts.filter((contact) => numbers.includes(contact.number));
    if (!chosen.length) { setError('Choose at least one contact.'); return; }
    try {
      buildWhatsAppUrls(chosen, serviceName).forEach(({ url }) => window.open(url, '_blank', 'noopener,noreferrer'));
    } catch {
      setError('A WhatsApp contact is unavailable. Please use the company phone number.');
    }
  };

  if (contacts.length === 1) {
    return <button type="button" onClick={() => openSelected([contacts[0].number])} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"><MessageCircle className="h-4 w-4" aria-hidden="true" />WhatsApp inquiry</button>;
  }

  return <div className="rounded-2xl border border-slate-200 bg-white p-4">
    <p className="text-sm font-bold text-slate-900">Choose who to contact on WhatsApp</p>
    <div className="mt-2 flex flex-wrap gap-3">
      {contacts.map((contact) => <label key={contact.number} className="inline-flex min-h-10 items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" checked={selected.includes(contact.number)} onChange={(event) => setSelected((current) => event.target.checked ? [...current, contact.number] : current.filter((number) => number !== contact.number))} />{contact.name}
      </label>)}
    </div>
    <p className="mt-2 text-xs text-slate-500">Each selection opens a separate conversation with a prepared message. WhatsApp does not send a group message to these contacts.</p>
    <div className="mt-3 flex flex-wrap gap-2">
      <button type="button" onClick={() => openSelected(selected)} className="inline-flex min-h-10 items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700"><MessageCircle className="h-4 w-4" aria-hidden="true" />Open selected</button>
      <button type="button" onClick={() => { setSelected(contacts.map((contact) => contact.number)); openSelected(contacts.map((contact) => contact.number)); }} className="min-h-10 rounded-full border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">Contact all</button>
    </div>
    {error && <p role="alert" className="mt-2 text-sm text-red-700">{error}</p>}
  </div>;
};
