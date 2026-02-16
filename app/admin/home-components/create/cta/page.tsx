'use client';

import React, { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { ComponentFormWrapper, useBrandColors, useComponentForm } from '../shared';
import { CTAForm } from '../../cta/_components/CTAForm';
import { CTAPreview } from '../../cta/_components/CTAPreview';
import { DEFAULT_CTA_CONFIG, DEFAULT_CTA_HARMONY } from '../../cta/_lib/constants';
import type { CTAConfig, CTAHarmony, CTAStyle } from '../../cta/_types';

const INITIAL_CTA_CONFIG: CTAConfig = {
  ...DEFAULT_CTA_CONFIG,
  buttonLink: '/register',
  buttonText: 'Đăng ký ngay',
  description: 'Đăng ký ngay hôm nay để nhận ưu đãi đặc biệt',
  secondaryButtonLink: '/about',
  secondaryButtonText: 'Tìm hiểu thêm',
  title: 'Sẵn sàng bắt đầu?',
};

export default function CTACreatePage() {
  const { title, setTitle, active, setActive, handleSubmit, isSubmitting } = useComponentForm('Kêu gọi hành động (CTA)', 'CTA');
  const { primary, secondary } = useBrandColors();
  const modeSetting = useQuery(api.settings.getByKey, { key: 'site_brand_mode' });
  const brandMode = modeSetting?.value === 'single' ? 'single' : 'dual';

  const [ctaConfig, setCtaConfig] = useState<CTAConfig>(INITIAL_CTA_CONFIG);
  const [ctaStyle, setCtaStyle] = useState<CTAStyle>('banner');
  const [ctaHarmony, setCtaHarmony] = useState<CTAHarmony>(DEFAULT_CTA_HARMONY);

  const onSubmit = (e: React.FormEvent) => {
    void handleSubmit(e, { ...ctaConfig, style: ctaStyle, harmony: ctaHarmony });
  };

  return (
    <ComponentFormWrapper
      type="CTA"
      title={title}
      setTitle={setTitle}
      active={active}
      setActive={setActive}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
    >
      <CTAForm
        config={ctaConfig}
        onChange={setCtaConfig}
        brandMode={brandMode}
        harmony={ctaHarmony}
        setHarmony={setCtaHarmony}
      />

      <CTAPreview
        config={ctaConfig}
        brandColor={primary}
        secondary={secondary}
        mode={brandMode}
        harmony={ctaHarmony}
        selectedStyle={ctaStyle}
        onStyleChange={setCtaStyle}
      />
    </ComponentFormWrapper>
  );
}
