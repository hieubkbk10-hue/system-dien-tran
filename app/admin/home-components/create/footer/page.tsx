'use client';

import React, { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { ComponentFormWrapper, useBrandColors, useComponentForm } from '../shared';
import { FooterPreview } from '../../footer/_components/FooterPreview';
import { FooterForm } from '../../footer/_components/FooterForm';
import { normalizeFooterConfig } from '../../footer/_lib/constants';
import type { FooterConfig } from '../../footer/_types';

export default function FooterCreatePage() {
  const { title, setTitle, active, setActive, handleSubmit, isSubmitting } = useComponentForm('Footer', 'Footer');
  const { primary, secondary } = useBrandColors();
  const modeSetting = useQuery(api.settings.getByKey, { key: 'site_brand_mode' });

  const [footerConfig, setFooterConfig] = useState<FooterConfig>(() => normalizeFooterConfig({
    columns: [
      { id: 1, links: [{ label: 'Giới thiệu', url: '/about' }, { label: 'Tuyển dụng', url: '/careers' }], title: 'Về chúng tôi' },
      { id: 2, links: [{ label: 'FAQ', url: '/faq' }, { label: 'Liên hệ', url: '/contact' }], title: 'Hỗ trợ' },
    ],
    copyright: '© 2024 VietAdmin. All rights reserved.',
    description: 'Công ty TNHH ABC - Đối tác tin cậy của bạn',
    logo: '',
    showSocialLinks: true,
    socialLinks: [],
    style: 'classic',
  }));

  const brandMode: 'single' | 'dual' = modeSetting?.value === 'single' ? 'single' : 'dual';

  const onSubmit = (e: React.FormEvent) => {
    void handleSubmit(e, footerConfig as unknown as Record<string, unknown>);
  };

  return (
    <ComponentFormWrapper
      type="Footer"
      title={title}
      setTitle={setTitle}
      active={active}
      setActive={setActive}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
    >
      <FooterForm value={footerConfig} onChange={setFooterConfig} primary={primary} secondary={secondary} mode={brandMode} />

      <FooterPreview
        config={footerConfig as any}
        brandColor={primary}
        secondary={secondary}
        mode={brandMode}
        selectedStyle={footerConfig.style}
        onStyleChange={(style) =>{  setFooterConfig({ ...footerConfig, style }); }}
      />
    </ComponentFormWrapper>
  );
}
