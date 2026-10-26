import type { WhatsAppContact } from '../types/cms';

export const normalizeWhatsAppNumber = (value: string): string => value.replace(/\D/g, '');

export const buildWhatsAppUrl = (contact: WhatsAppContact, serviceName: string): string => {
  const number = normalizeWhatsAppNumber(contact.number);
  if (!/^\d{10,15}$/.test(number)) throw new Error('This WhatsApp contact is unavailable.');
  const message = `Hello NIYO IREME UNIT LTD, I am interested in your ${serviceName}. Please provide more information about the service, estimated cost, and next steps. Thank you.`;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
};

export const buildWhatsAppUrls = (contacts: WhatsAppContact[], serviceName: string): Array<{ contact: WhatsAppContact; url: string }> =>
  contacts.map((contact) => ({ contact, url: buildWhatsAppUrl(contact, serviceName) }));
