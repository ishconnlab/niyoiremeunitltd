import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronRight, X } from 'lucide-react';

import { SERVICES_DATA } from '../../data/services';
import { LocalizedLink } from '../common/LocalizedLink';
import { ServiceIcon } from '../common/ServiceIcon';
import { cn } from '../../utils/cn';

/**
 * Multi-level nested service dropdown.
 *
 * Level 1: Service category (e.g. Painting, Construction & Renovation)
 * Level 2: Specific services / sub-options within each category
 *
 * Supports hover to open submenus, click to navigate, Escape to close,
 * click outside to close, and full keyboard accessibility.
 */
export const ServiceMegaMenu: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setOpenSubmenu(null);
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenSubmenu(null);
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  /**
   * Build nested menu structure from SERVICES_DATA.
   * Groups services by category and defines sub-items per service.
   */
  const buildNestedMenu = () => {
    return SERVICES_DATA.map((service) => {
      const subItems = getSubItems(service.id);
      return {
        ...service,
        subItems,
        hasChildren: subItems.length > 0,
      };
    });
  };

  const getSubItems = (serviceId: string) => {
    const SUB_ITEMS: Record<string, Array<{ id: string; titleKey: string; path: string }>> = {
      painting: [
        { id: 'painting-interior', titleKey: 'nav.sub.paintingInterior', path: '/services/painting?type=interior' },
        { id: 'painting-exterior', titleKey: 'nav.sub.paintingExterior', path: '/services/painting?type=exterior' },
        { id: 'painting-decorative', titleKey: 'nav.sub.paintingDecorative', path: '/services/painting?type=decorative' },
      ],
      construction: [
        { id: 'construction-house', titleKey: 'nav.sub.constructionHouse', path: '/services/construction?type=house' },
        { id: 'construction-renovation', titleKey: 'nav.sub.constructionRenovation', path: '/services/construction?type=renovation' },
        { id: 'construction-terrace', titleKey: 'nav.sub.constructionTerrace', path: '/services/construction?type=terrace' },
      ],
      tiling: [
        { id: 'tiling-floor', titleKey: 'nav.sub.tilingFloor', path: '/services/tiling?type=floor' },
        { id: 'tiling-wall', titleKey: 'nav.sub.tilingWall', path: '/services/tiling?type=wall' },
      ],
      wallpaper: [
        { id: 'wallpaper-install', titleKey: 'nav.sub.wallpaperInstall', path: '/services/wallpaper?type=install' },
      ],
      ceilings: [
        { id: 'ceilings-gypsum', titleKey: 'nav.sub.ceilingsGypsum', path: '/services/ceilings?type=gypsum' },
        { id: 'ceilings-decorative', titleKey: 'nav.sub.ceilingsDecorative', path: '/services/ceilings?type=decorative' },
      ],
      terrazzo: [
        { id: 'terrazzo-floor', titleKey: 'nav.sub.terrazzoFloor', path: '/services/terrazzo?type=floor' },
      ],
      glass: [
        { id: 'glass-windows', titleKey: 'nav.sub.glassWindows', path: '/services/glass?type=windows' },
        { id: 'glass-panels', titleKey: 'nav.sub.glassPanels', path: '/services/glass?type=panels' },
        { id: 'glass-partitions', titleKey: 'nav.sub.glassPartitions', path: '/services/glass?type=partitions' },
      ],
      cleaning: [
        { id: 'cleaning-post', titleKey: 'nav.sub.cleaningPost', path: '/services/cleaning?type=post' },
        { id: 'cleaning-office', titleKey: 'nav.sub.cleaningOffice', path: '/services/cleaning?type=office' },
        { id: 'cleaning-home', titleKey: 'nav.sub.cleaningHome', path: '/services/cleaning?type=home' },
      ],
      workforce: [
        { id: 'workforce-request', titleKey: 'nav.sub.workforceRequest', path: '/services/workforce?type=request' },
        { id: 'workforce-jobs', titleKey: 'nav.sub.workforceJobs', path: '/services/workforce?type=jobs' },
      ],
      supervision: [
        { id: 'supervision-daily', titleKey: 'nav.sub.supervisionDaily', path: '/services/supervision?type=daily' },
        { id: 'supervision-quality', titleKey: 'nav.sub.supervisionQuality', path: '/services/supervision?type=quality' },
        { id: 'supervision-reporting', titleKey: 'nav.sub.supervisionReporting', path: '/services/supervision?type=reporting' },
      ],
      equipment: [
        { id: 'equipment-earthmoving', titleKey: 'nav.sub.equipmentEarthmoving', path: '/services/equipment?type=earthmoving' },
        { id: 'equipment-concrete', titleKey: 'nav.sub.equipmentConcrete', path: '/services/equipment?type=concrete' },
        { id: 'equipment-safety', titleKey: 'nav.sub.equipmentSafety', path: '/services/equipment?type=safety' },
      ],
      materials: [
        { id: 'materials-paint', titleKey: 'nav.sub.materialsPaint', path: '/services/materials?type=paint' },
        { id: 'materials-tools', titleKey: 'nav.sub.materialsTools', path: '/services/materials?type=tools' },
        { id: 'materials-adhesives', titleKey: 'nav.sub.materialsAdhesives', path: '/services/materials?type=adhesives' },
      ],
      plastering: [
        { id: 'plastering-wall', titleKey: 'nav.sub.plasteringWall', path: '/services/plastering?type=wall' },
        { id: 'plastering-repair', titleKey: 'nav.sub.plasteringRepair', path: '/services/plastering?type=repair' },
      ],
      finishing: [
        { id: 'finishing-interior', titleKey: 'nav.sub.finishingInterior', path: '/services/finishing?type=interior' },
        { id: 'finishing-exterior', titleKey: 'nav.sub.finishingExterior', path: '/services/finishing?type=exterior' },
      ],
    };
    return SUB_ITEMS[serviceId] || [];
  };

  const nestedMenu = buildNestedMenu();

  return (
    <nav
      ref={menuRef}
      id="services-mega-menu"
      aria-label={t('header.servicesMenu')}
      aria-expanded={isOpen}
      className="relative inline-block w-full xl:w-auto"
    >
      {/* Backdrop â€” covers viewport when open, closes on click */}
      {isOpen ? (
        <div
          className="fixed inset-0 z-[59] bg-black/25 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />
      ) : null}

      {/* Trigger button â€” always visible */}
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls="services-mega-menu-panel"
        aria-haspopup="menu"
        className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-semibold transition-colors text-slate-700 hover:text-brand-orange hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
        onMouseEnter={() => {}}
      >
        {t('nav.services')}
        <ChevronRight
          className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-90')}
          aria-hidden="true"
        />
      </button>

      {/* Panel â€” nested dropdown below trigger */}
      {isOpen ? (
        <div
          ref={menuRef}
          id="services-mega-menu-panel"
          role="menu"
          className="absolute left-1/2 -translate-x-1/2 z-[60] mt-1 w-full max-w-[26rem] min-w-[20rem] max-w-[calc(100vw-2rem)] rounded-2xl border border-slate-200 bg-white shadow-2xl opacity-0 translate-y-1 pointer-events-none transition-all duration-200 ease-out"
          style={{
            opacity: isOpen ? 1 : 0,
            transform: isOpen ? 'translate(-50%, 0)' : 'translate(-50%, 8px)',
            pointerEvents: isOpen ? 'auto' : 'none',
          }}
        >
          <div className="p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
              {t('header.servicesMenu')}
            </p>
            <ul className="space-y-1">
              {nestedMenu.map((service) => (
                <li key={service.id}>
                  {service.hasChildren ? (
                    // Parent item with submenu trigger
                    <div
                      key={service.id}
                      className="relative group"
                      onMouseEnter={() => setOpenSubmenu(service.id)}
                      onMouseLeave={() => {
                        if (openSubmenu === service.id) setOpenSubmenu(null);
                      }}
                    >
                      <LocalizedLink
                        to={`/services/${service.id}`}
                        role="menuitem"
                        onClick={onClose}
                        aria-current={
                          isActive(`/services/${service.id}`) ? 'page' : undefined
                        }
                        className="flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-left transition-all duration-150 hover:bg-slate-50 hover:border-brand-navy/10"
                      >
                        <span className="shrink-0 flex h-9 w-9 items-center justify-center rounded-lg bg-brand-orange/5 text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-colors">
                          <ServiceIcon name={service.iconName} className="h-4 w-4" />
                        </span>
                        <span className="block font-heading text-sm font-black text-brand-navy transition-colors group-hover:text-brand-orange">
                          {t(`services.items.${service.id}.title`)}
                        </span>
                        <ChevronRight className="shrink-0 h-3.5 w-3.5 text-slate-400 transition-colors group-hover:text-brand-orange" aria-hidden="true" />
                      </LocalizedLink>

                      {/* Submenu panel */}
                      {openSubmenu === service.id && (
                        <div
                          className="absolute left-full top-0 z-[70] w-full max-w-[20rem] min-w-[16rem] rounded-2xl border border-slate-200 bg-white shadow-2xl ml-1 opacity-0 translate-y-1 pointer-events-none transition-all duration-200 ease-out"
                          style={{
                            opacity: openSubmenu === service.id ? 1 : 0,
                            transform: openSubmenu === service.id ? 'translateY(0)' : 'translateY(-8px)',
                            pointerEvents: openSubmenu === service.id ? 'auto' : 'none',
                          }}
                        >
                          <div className="p-3">
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                              {t(`services.items.${service.id}.title`)}
                            </p>
                            <ul className="space-y-1">
                              {service.subItems.map((sub) => (
                                <li key={sub.id}>
                                  <a
                                    href={sub.path}
                                    role="menuitem"
                                    className="flex items-center gap-2 rounded-lg border border-transparent px-3 py-2 text-left text-sm transition-colors hover:bg-slate-50 hover:text-brand-orange hover:border-brand-navy/10"
                                  >
                                    <span className="block truncate font-medium text-brand-navy group-hover:text-brand-orange transition-colors">
                                      {t(sub.titleKey)}
                                    </span>
                                    <ChevronRight className="shrink-0 h-3 w-3 text-slate-400" aria-hidden="true" />
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    // Leaf item - direct link
                    <LocalizedLink
                      key={service.id}
                      to={`/services/${service.id}`}
                      role="menuitem"
                      onClick={onClose}
                      aria-current={
                        isActive(`/services/${service.id}`) ? 'page' : undefined
                      }
                      className="flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-left transition-all duration-150 hover:bg-slate-50 hover:border-brand-navy/10 group"
                    >
                      <span className="shrink-0 flex h-9 w-9 items-center justify-center rounded-lg bg-brand-orange/5 text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-colors">
                        <ServiceIcon name={service.iconName} className="h-4 w-4" />
                      </span>
                      <span className="block font-heading text-sm font-black text-brand-navy group-hover:text-brand-orange transition-colors">
                        {t(`services.items.${service.id}.title`)}
                      </span>
                      <ChevronRight className="shrink-0 h-3.5 w-3.5 text-slate-400 group-hover:text-brand-orange transition-colors" aria-hidden="true" />
                    </LocalizedLink>
                  )}
                </li>
              ))}
              <li className="mt-3 pt-3 border-t border-slate-200">
                <LocalizedLink
                  to="/services"
                  role="menuitem"
                  onClick={onClose}
                  className="flex items-center justify-between w-full rounded-xl border border-transparent px-3 py-2.5 text-left transition-all duration-150 hover:bg-slate-50 hover:border-brand-navy/10 group"
                >
                  <span className="text-sm font-black text-brand-navy group-hover:text-brand-orange transition-colors">
                    {t('megaMenu.exploreAll')}
                  </span>
                  <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-brand-orange transition-colors" aria-hidden="true" />
                </LocalizedLink>
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t('common.closeMenu')}
            className="absolute top-4 right-4 z-[10] flex h-10 w-10 items-center justify-center rounded-full text-slate-400 hover:text-brand-navy hover:bg-slate-100 transition-colors"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      ) : null}
    </nav>
  );
};

