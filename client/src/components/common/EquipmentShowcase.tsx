import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, MessageSquare, Search, X } from 'lucide-react';

import { COMPANY_INFO } from '../../data/company';
import { EQUIPMENT_ITEMS, EquipmentCategory } from '../../data/equipment';
import { PillButton } from './PillButton';
import { SectionHeading } from './SectionHeading';
import { WhatsAppIcon } from './WhatsAppIcon';

export const EquipmentShowcase: React.FC = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<EquipmentCategory | 'all'>('all');

  const filteredItems = useMemo(() => {
    return EQUIPMENT_ITEMS.filter((item) => {
      const name = t(item.nameKey).toLowerCase();
      const description = t(item.descriptionKey).toLowerCase();
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        searchQuery === '' ||
        name.includes(query) ||
        description.includes(query);
      const matchesCategory =
        activeCategory === 'all' || item.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory, t]);

  const whatsappUrl = (itemName: string) =>
    `https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${encodeURIComponent(
      t('whatsapp.equipmentInquiry', { name: itemName })
    )}`;

  const categoryOptions: { value: EquipmentCategory | 'all'; label: string }[] = [
    { value: 'all', label: t('equipment.filter.all') },
    { value: 'painting', label: t('equipment.filter.painting') },
    { value: 'surface-preparation', label: t('equipment.filter.surfacePreparation') },
    { value: 'additional', label: t('equipment.filter.additional') },
  ];

  return (
    <section
      id="equipment"
      className="relative overflow-hidden bg-brand-navy py-20 text-white sm:py-24"
    >
      <div className="absolute inset-0 bg-grid-pattern-dark" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-blueprint-drawing bg-[url('/assets/brand/blueprint-excavator.svg')] opacity-20"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge={t('equipment.eyebrow')}
          title={t('equipment.title')}
          subtitle={t('equipment.subtitle')}
          dark
        />

        {/* Search and filter controls */}
        <div className="mb-10 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" aria-hidden="true" />
            <input
              type="text"
              placeholder={t('equipment.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange transition-colors"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            {categoryOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setActiveCategory(option.value)}
                className={`
                  px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border
                  ${activeCategory === option.value
                    ? 'bg-brand-orange text-white border-brand-orange'
                    : 'bg-white/10 text-slate-300 border-white/20 hover:bg-white/20 hover:text-white'
                  }
                `}
              >
                {option.label}
              </button>
            ))}
            {searchQuery !== '' && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-slate-300 hover:bg-white/20 hover:text-white transition-colors"
                aria-label={t('equipment.clearSearch')}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-slate-400" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{t('equipment.emptyTitle')}</h3>
            <p className="text-sm text-slate-400 max-w-xs mx-auto">
              {t('equipment.emptyBody')}
            </p>
          </div>
        ) : (
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {filteredItems.map((item) => (
              <li
                key={item.id}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-6 flex flex-col min-h-[420px] group"
              >
                <div className="relative h-48 overflow-hidden rounded-xl bg-white/5 mb-4">
                  <img
                    src={item.image}
                    alt={t(item.imageAltKey)}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                  <span className="absolute top-3 left-3 px-2 py-1 rounded-md text-[10px] font-bold bg-white/90 text-brand-navy uppercase tracking-wider">
                    {item.category === 'painting'
                      ? t('equipment.category.painting')
                      : item.category === 'surface-preparation'
                        ? t('equipment.category.surfacePreparation')
                        : t('equipment.category.additional')}
                  </span>
                </div>
                <h3 className="font-heading text-sm sm:text-base font-bold leading-snug text-white">
                  {t(item.nameKey)}
                </h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-400 line-clamp-3">
                  {t(item.descriptionKey)}
                </p>
                <div className="mt-auto pt-4 flex gap-2">
                  <PillButton
                    href={whatsappUrl(t(item.nameKey))}
                    size="sm"
                    variant="outline"
                    fullWidth
                    icon={<WhatsAppIcon className="h-3.5 w-3.5" />}
                    iconPosition="left"
                  >
                    {t('equipment.ctaInquire')}
                  </PillButton>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-12 rounded-2xl border border-white/10 bg-brand-navy/60 p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm leading-relaxed text-slate-300">
              {t('equipment.note')}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <PillButton to="/contact" size="md">
              {t('equipment.cta')}
            </PillButton>
            <PillButton
              href={`tel:${COMPANY_INFO.phoneRaw}`}
              size="md"
              variant="light"
              icon={<Phone className="h-4 w-4" />}
              iconPosition="left"
            >
              {t('equipment.call')}
            </PillButton>
            <PillButton
              href={`https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${encodeURIComponent(
                t('whatsapp.equipment')
              )}`}
              size="md"
              variant="ghost"
              className="text-white hover:bg-white/10"
              icon={<MessageSquare className="h-4 w-4" />}
              iconPosition="left"
            >
              {t('equipment.whatsapp')}
            </PillButton>
          </div>
        </div>
      </div>
    </section>
  );
};
