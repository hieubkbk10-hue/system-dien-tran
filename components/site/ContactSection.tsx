'use client';

import React from 'react';
import { ContactSectionShared } from '@/app/admin/home-components/contact/_components/ContactSectionShared';
import { DEFAULT_CONTACT_HARMONY } from '@/app/admin/home-components/contact/_lib/constants';
import { getContactValidationResult } from '@/app/admin/home-components/contact/_lib/colors';
import { normalizeContactConfig } from '@/app/admin/home-components/contact/_lib/normalize';
import type { ContactBrandMode } from '@/app/admin/home-components/contact/_types';

interface ContactSectionProps {
  config: Record<string, unknown>;
  brandColor: string;
  secondary: string;
  mode: ContactBrandMode;
  title: string;
}

export function ContactSection({ config, brandColor, secondary, mode, title }: ContactSectionProps) {
  const normalizedConfig = React.useMemo(() => normalizeContactConfig(config), [config]);

  const validation = React.useMemo(() => getContactValidationResult({
    primary: brandColor,
    secondary,
    mode,
    harmony: normalizedConfig.harmony ?? DEFAULT_CONTACT_HARMONY,
  }), [brandColor, secondary, mode, normalizedConfig.harmony]);

  return (
    <ContactSectionShared
      config={normalizedConfig}
      style={normalizedConfig.style}
      tokens={validation.tokens}
      mode={mode}
      context="site"
      title={title}
    />
  );
}
