import { useEffect, useState } from 'react';
import { COMPANY_INFO } from '../data/company';
import { apiRequest } from '../utils/api';
import type { WhatsAppContact } from '../types/cms';

const defaultContacts: WhatsAppContact[] = [{ name: 'NIYO IREME UNIT LTD', number: COMPANY_INFO.whatsappNumber }];

export function useWhatsAppContacts() {
  const [contacts, setContacts] = useState<WhatsAppContact[]>(defaultContacts);
  useEffect(() => {
    let live = true;
    const load = () => apiRequest<{ data: { whatsappContacts: WhatsAppContact[] } }>('/settings/public')
      .then((result) => {
        if (live && Array.isArray(result.data?.whatsappContacts) && result.data.whatsappContacts.length) {
          setContacts(result.data.whatsappContacts);
        }
      })
      .catch(() => undefined);
    const handleUpdate = () => { void load(); };
    handleUpdate();
    window.addEventListener('niyo:cms-updated', handleUpdate);
    return () => { live = false; window.removeEventListener('niyo:cms-updated', handleUpdate); };
  }, []);
  return contacts;
}
