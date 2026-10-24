import React from 'react';
import { Link, type LinkProps } from 'react-router-dom';

import { useLocalizedPath } from '../../hooks/useLocalizedPath';

export type LocalizedLinkProps = Omit<LinkProps, 'to'> & { to: string };

/**
 * `Link` that keeps the active language in the URL, so navigation always
 * stays in the language that was selected.
 */
export const LocalizedLink: React.FC<LocalizedLinkProps> = ({ to, ...rest }) => {
  const localize = useLocalizedPath();

  return <Link to={localize(to)} {...rest} />;
};

