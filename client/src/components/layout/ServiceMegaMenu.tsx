import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

import { SERVICES_DATA } from '../../data/services';
import { groupServicesForMenu } from '../../data/serviceMenu';
import { LocalizedLink } from '../common/LocalizedLink';
import { ServiceIcon } from '../common/ServiceIcon';
import { useCmsServices } from '../../hooks/useCmsServices';

export const ServiceMegaMenu: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const panelRef = useRef<HTMLDivElement>(null);
  const { services: cmsServices } = useCmsServices();
  const fallbackServices = SERVICES_DATA.map((service) => ({
    slug: service.id,
    title: service.id.replace(/-/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase()),
  }));
  const services = cmsServices ?? fallbackServices;
  const groups = groupServicesForMenu(services);
  const [activeGroup, setActiveGroup] = useState('renovation');
  const selectedGroup = groups.find((group) => group.id === activeGroup) ?? groups[0];

  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) onClose();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return <>
    <button type="button" aria-label="Close services menu" tabIndex={-1} onClick={onClose} className="fixed inset-0 z-[59] cursor-default bg-slate-950/20" />
    <section ref={panelRef} id="services-mega-menu" aria-label="Browse services" className="absolute left-1/2 top-full z-[60] mt-3 w-[min(56rem,calc(100vw-2rem))] -translate-x-1/2 overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-4 sm:px-5">
        <div><p className="text-xs font-bold uppercase tracking-widest text-brand-orange">NIYO IREME UNIT LTD</p><h2 className="mt-1 font-heading text-lg font-extrabold text-brand-navy">Browse our services</h2></div>
        <LocalizedLink to="/services" onClick={onClose} className="inline-flex min-h-10 items-center gap-1 rounded-full border border-slate-200 px-4 text-sm font-bold text-brand-navy hover:border-brand-orange hover:text-brand-orange">View all services <ChevronRight className="h-4 w-4" aria-hidden="true" /></LocalizedLink>
      </div>
      <div className="grid max-h-[min(70vh,34rem)] min-h-64 grid-cols-1 overflow-y-auto sm:grid-cols-[minmax(12rem,0.8fr)_minmax(0,1.8fr)] sm:overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50 p-2 sm:border-b-0 sm:border-r sm:p-3" aria-label="Service categories">
          {groups.map((group) => <button key={group.id} type="button" onMouseEnter={() => setActiveGroup(group.id)} onFocus={() => setActiveGroup(group.id)} onClick={() => setActiveGroup(group.id)} aria-expanded={selectedGroup?.id === group.id} className={`flex min-h-12 w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-bold transition-colors ${selectedGroup?.id === group.id ? 'bg-white text-brand-navy shadow-sm ring-1 ring-slate-200' : 'text-slate-600 hover:bg-white hover:text-brand-navy'}`}>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-orange/10 text-brand-orange"><ServiceIcon name={group.iconName} className="h-4 w-4" /></span><span className="min-w-0 flex-1">{group.title}</span><span className="text-xs text-slate-400">{group.services.length}</span><ChevronRight className="h-4 w-4 text-slate-400" aria-hidden="true" />
          </button>)}
        </div>
        <div className="min-w-0 p-3 sm:p-4">
          {selectedGroup ? <>
            <h3 className="mb-3 px-1 text-xs font-bold uppercase tracking-widest text-slate-500">{selectedGroup.title}</h3>
            <ul className="grid gap-2 sm:grid-cols-2">
              {selectedGroup.services.map((service) => <li key={service.slug}>
                <LocalizedLink to={`/services/${service.slug}`} onClick={onClose} aria-current={location.pathname === `/services/${service.slug}` ? 'page' : undefined} className="group flex min-h-14 items-start gap-3 rounded-xl border border-slate-100 p-3 transition-colors hover:border-brand-orange/40 hover:bg-orange-50/50">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-navy/5 text-brand-navy group-hover:bg-brand-orange group-hover:text-white"><ServiceIcon name="Building2" className="h-4 w-4" /></span>
                  <span className="min-w-0"><span className="block text-sm font-bold text-brand-navy group-hover:text-brand-orange">{service.title}</span>{service.overview && <span className="mt-1 line-clamp-2 block text-xs leading-5 text-slate-500">{service.overview}</span>}</span>
                </LocalizedLink>
              </li>)}
            </ul>
          </> : <p className="p-4 text-sm text-slate-600">Services are being updated. Please visit the services page.</p>}
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 bg-slate-50 px-4 py-3 text-xs text-slate-600 sm:px-5"><span>Choose a category to browse related work.</span><LocalizedLink to="/contact" onClick={onClose} className="font-bold text-brand-navy hover:text-brand-orange">Ask us about your project</LocalizedLink></div>
    </section>
  </>;
};
