'use client';

import React, { useState } from 'react';
import { ComponentFormWrapper, useBrandColors, useComponentForm } from '../shared';
import { toast } from 'sonner';
import { CTAForm } from '../../cta/_components/CTAForm';
import { CTAPreview } from '../../cta/_components/CTAPreview';
import { DEFAULT_CTA_CONFIG, DEFAULT_CTA_HARMONY } from '../../cta/_lib/constants';
import { getCTAValidationResult } from '../../cta/_lib/colors';
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
  const { primary, secondary, mode } = useBrandColors();

  const [ctaConfig, setCtaConfig] = useState<CTAConfig>(INITIAL_CTA_CONFIG);
  const [ctaStyle, setCtaStyle] = useState<CTAStyle>('banner');
  const [ctaHarmony, _setCtaHarmony] = useState<CTAHarmony>(DEFAULT_CTA_HARMONY);

  const onSubmit = (e: React.FormEvent) => {
    const { harmonyStatus } = getCTAValidationResult({
      config: ctaConfig,
      primary,
      secondary,
      mode,
      harmony: ctaHarmony,
      style: ctaStyle,
    });

    if (mode === 'dual' && harmonyStatus.isTooSimilar) {
      e.preventDefault();
      toast.error(`Không thể lưu CTA: deltaE=${harmonyStatus.deltaE} < 20 (Primary/Secondary quá giống nhau).`);
      return;
    }

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
      />

      <CTAPreview
        config={ctaConfig}
        brandColor={primary}
        secondary={secondary}
        mode={mode}
        harmony={ctaHarmony}
        selectedStyle={ctaStyle}
        onStyleChange={setCtaStyle}
      />
    </ComponentFormWrapper>
  );
}
