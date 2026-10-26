import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiRequest } from '../utils/api';

export interface CmsContentRecord {
  _id?: string;
  section: string;
  key: string;
  value: unknown;
  imageUrl?: string;
  isActive: boolean;
  order: number;
}

const CmsContentContext = createContext<CmsContentRecord[] | null>(null);

export const CmsContentProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [records, setRecords] = useState<CmsContentRecord[] | null>(null);
  useEffect(() => {
    let live = true;
    const load = () => {
      apiRequest<{ data: CmsContentRecord[] }>('/content')
        .then((result) => { if (live) setRecords(result.data); })
        .catch(() => { if (live) setRecords([]); });
    };
    load();
    window.addEventListener('niyo:cms-updated', load);
    return () => { live = false; window.removeEventListener('niyo:cms-updated', load); };
  }, []);
  return React.createElement(CmsContentContext.Provider, { value: records }, children);
};

export function useCmsContent(section: string) {
  const records = useContext(CmsContentContext);
  return records?.filter((record) => record.section === section) ?? (records === null ? null : []);
}

export function contentValue(record: CmsContentRecord | undefined): Record<string, unknown> {
  return record?.value && typeof record.value === 'object' && !Array.isArray(record.value)
    ? record.value as Record<string, unknown>
    : {};
}
