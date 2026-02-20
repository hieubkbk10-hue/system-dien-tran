'use client';

import React from 'react';
import {
  normalizePricingConfig,
  normalizePricingHarmony,
} from '@/app/admin/home-components/pricing/_lib/constants';
import {
  getPricingColorTokens,
} from '@/app/admin/home-components/pricing/_lib/colors';
import { PricingSectionShared } from '@/app/admin/home-components/pricing/_components/PricingSectionShared';
import type {
  PricingBrandMode,
  PricingConfig,
  PricingStyle,
} from '@/app/admin/home-components/pricing/_types';

interface PricingSectionProps {
  config: Record<string, unknown>;
  brandColor: string;
  secondary: string;
  mode: PricingBrandMode;
  title: string;
}

export function PricingSection({
  config,
  brandColor,
  secondary,
  mode,
  title,
}: PricingSectionProps) {
  const safeConfig = normalizePricingConfig(config as Partial<PricingConfig>);

  const style = safeConfig.style as PricingStyle;
  const subtitle = String(safeConfig.subtitle ?? 'Chọn gói phù hợp với nhu cầu của bạn');
  const harmony = normalizePricingHarmony(safeConfig.harmony);

  const tokens = getPricingColorTokens({
    primary: brandColor,
    secondary,
    mode,
    harmony,
  });

  const [isYearly, setIsYearly] = React.useState(false);

  return (
    <PricingSectionShared
      context="site"
      title={title}
      subtitle={subtitle}
      plans={safeConfig.plans}
      style={style}
      mode={mode}
      tokens={tokens}
      isYearly={isYearly}
      showBillingToggle={safeConfig.showBillingToggle !== false}
      monthlyLabel={String(safeConfig.monthlyLabel ?? 'Hàng tháng')}
      yearlyLabel={String(safeConfig.yearlyLabel ?? 'Hàng năm')}
      yearlySavingText={String(safeConfig.yearlySavingText ?? 'Tiết kiệm 17%')}
      onBillingToggle={setIsYearly}
    />
  );
}
