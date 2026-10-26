import { useEffect, useState } from 'react';
import { apiRequest } from '../utils/api';
import type { CmsService } from '../types/cms';

export function useCmsServices() {
  const [services, setServices] = useState<CmsService[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let live = true;
    const load = () => apiRequest<{ data: CmsService[] }>('/services')
      .then((result) => { if (live) { setServices(result.data); setError(false); } })
      .catch(() => { if (live) setError(true); });
    const handleUpdate = () => { void load(); };
    handleUpdate();
    window.addEventListener('niyo:cms-updated', handleUpdate);
    return () => { live = false; window.removeEventListener('niyo:cms-updated', handleUpdate); };
  }, []);

  return { services, error };
}
