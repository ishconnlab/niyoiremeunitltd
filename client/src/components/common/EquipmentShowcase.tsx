import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Blocks,
  Droplets,
  MessageSquare,
  Phone,
  Ruler,
  ShoppingBag,
  ShieldCheck,
  Truck,
  Wrench,
  type LucideIcon,
} from 'lucide-react';

import { COMPANY_INFO } from '../../data/company';
import { PillButton } from './PillButton';
import { SectionHeading } from './SectionHeading';

type EquipmentAction = 'rental' | 'purchase' | 'both';

type EquipmentItem = {
  title: string;
  body: string;
  use?: string;
  action: EquipmentAction;
  icon: LucideIcon;
};

const EQUIPMENT_ITEMS: EquipmentItem[] = [
  {
    title: 'Earthmoving and site preparation',
    body: 'Available equipment for site preparation, excavation and moving materials, subject to confirmation for your project.',
    use: 'Excavation, site clearing and material movement for building sites.',
    action: 'rental',
    icon: Truck,
  },
  {
    title: 'Concrete and blockwork',
    body: 'Mixers, compactors and related equipment for concrete, blockwork and structural work.',
    use: 'Mixing, compacting and finishing concrete and blockwork.',
    action: 'rental',
    icon: Blocks,
  },
  {
    title: 'Finishing and surface tools',
    body: 'Equipment for surface preparation, grinding, polishing and finishing work.',
    use: 'Surface preparation, grinding, polishing and surface finishing.',
    action: 'rental',
    icon: Wrench,
  },
  {
    title: 'Cleaning and site care',
    body: 'Pressure washers and clean-up equipment for post-renovation and handover cleaning.',
    use: 'Pressure washing and post-construction site clean-up.',
    action: 'rental',
    icon: Droplets,
  },
  {
    title: 'Measuring and quality checks',
    body: 'Levelling, measuring and inspection tools used to check accuracy on site.',
    use: 'Levelling, measuring and inspection for accuracy checks.',
    action: 'rental',
    icon: Ruler,
  },
  {
    title: 'Safety and site support',
    body: 'Safety equipment and site support items for the agreed scope of work.',
    use: 'PPE and site support items for safe work.',
    action: 'rental',
    icon: ShieldCheck,
  },
];

const MATERIALS_ITEMS: EquipmentItem[] = [
  {
    title: 'Building materials sales',
    body: 'We sell available building materials and finishing supplies, and help you choose the right products for your site.',
    use: 'Paint, tools, adhesives and finishing supplies for construction and finishing projects.',
    action: 'purchase',
    icon: ShoppingBag,
  },
];

/**
 * Modern construction equipment section.
 *
 * Only equipment and building materials are shown here â€” no other services.
 * Every card offers a contextual WhatsApp inquiry for the action the item
 * actually supports (rental for equipment, purchase for materials), with the
 * item name prefilled into the message. Content-matched icons replace generic
 * visuals so each card looks like what it actually is.
 */
export const EquipmentShowcase: React.FC = () => {
  const { t } = useTranslation();

  const whatsappUrl = (messageKey: string, params: Record<string, string>) => {
    const text = t(messageKey, params);
    return `https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${encodeURIComponent(text)}`;
  };

  const rentalUrl = (item: EquipmentItem) =>
    whatsappUrl('whatsapp.equipmentRental', { name: item.title });
  const purchaseUrl = (item: EquipmentItem) =>
    whatsappUrl('whatsapp.equipmentPurchase', { name: item.title });

  const allItems = [
    ...EQUIPMENT_ITEMS,
    ...MATERIALS_ITEMS,
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

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {allItems.map((item) => {
            const Icon = item.icon ?? Truck;
            const isRental = item.action === 'rental' || item.action === 'both';
            const isPurchase = item.action === 'purchase' || item.action === 'both';

            return (
              <li
                key={item.title}
                className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 sm:p-6 flex flex-col min-h-[280px]"
              >
                <span className="flex shrink-0 h-11 w-11 items-center justify-center rounded-xl bg-brand-orange text-white">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 shrink-0 font-heading text-base font-bold leading-snug text-white">
                  {item.title}
                </h3>
                {item.use ? (
                  <p className="mt-2 shrink-0 text-xs leading-relaxed text-slate-400">
                    {item.use}
                  </p>
                ) : null}
                <p className="mt-2 shrink-0 text-sm leading-relaxed text-slate-300 line-clamp-3">
                  {item.body}
                </p>
                <div className="mt-auto mt-4 flex flex-col sm:flex-row gap-2 sm:gap-3">
                  {isRental && (
                    <PillButton
                      href={rentalUrl(item)}
                      size="sm"
                      variant="primary"
                      className="text-xs sm:text-sm"
                    >
                      {t('equipment.ctaRental')}
                    </PillButton>
                  )}
                  {isPurchase && (
                    <PillButton
                      href={purchaseUrl(item)}
                      size="sm"
                      variant="outline"
                      className="text-xs sm:text-sm border-white/20 text-white hover:border-white"
                    >
                      {t('equipment.ctaPurchase')}
                    </PillButton>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-8 rounded-2xl border border-white/10 bg-brand-navy/60 p-5 sm:p-6">
          <p className="text-sm leading-relaxed text-slate-300">{t('equipment.note')}</p>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
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

