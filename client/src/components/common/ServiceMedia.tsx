import React from 'react';
import { useTranslation } from 'react-i18next';

import { ServiceIcon } from './ServiceIcon';
import type { ServiceDefinition } from '../../types';

export interface ServiceMediaProps {
  service: ServiceDefinition;
  imageClassName?: string;
  fallbackClassName?: string;
  iconClassName?: string;
}

/**
 * Renders the service photograph when the company has supplied one. Services
 * without a genuine photograph fall back to a branded icon panel rather than a
 * stock image that could be mistaken for completed company work.
 */
export const ServiceMedia: React.FC<ServiceMediaProps> = ({
  service,
  imageClassName,
  fallbackClassName,
  iconClassName,
}) => {
  const { t } = useTranslation();

  if (service.image) {
    return (
      <img
        src={service.image}
        alt={service.imageAltKey ? t(service.imageAltKey) : ''}
        width={736}
        height={981}
        loading="lazy"
        decoding="async"
        className={imageClassName}
      />
    );
  }

  return (
    <div
      className={fallbackClassName}
      role="img"
      aria-label={t(`services.items.${service.id}.title`)}
    >
      <ServiceIcon name={service.iconName} className={iconClassName} />
    </div>
  );
};

