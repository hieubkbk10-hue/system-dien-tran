'use client';

import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { normalizeVoucherLimit, normalizeVoucherStyle } from '@/lib/home-components/voucher-promotions';
import {
  normalizeVoucherPromotionsHarmony,
  normalizeVoucherPromotionsTexts,
  DEFAULT_VOUCHER_PROMOTIONS_HARMONY,
} from '@/app/admin/home-components/voucher-promotions/_lib/constants';
import { getVoucherPromotionsColorTokens } from '@/app/admin/home-components/voucher-promotions/_lib/colors';
import { VoucherPromotionsSectionShared } from '@/app/admin/home-components/voucher-promotions/_components/VoucherPromotionsSectionShared';
import type {
  VoucherPromotionItem,
  VoucherPromotionsBrandMode,
  VoucherPromotionsHarmony,
  VoucherPromotionsTexts,
} from '@/app/admin/home-components/voucher-promotions/_types';

interface VoucherPromotionsSectionProps {
  config: Record<string, unknown>;
  brandColor: string;
  secondary: string;
  mode: VoucherPromotionsBrandMode;
  title: string;
}

export function VoucherPromotionsSection({
  config,
  brandColor,
  secondary,
  mode,
  title,
}: VoucherPromotionsSectionProps) {
  const texts = normalizeVoucherPromotionsTexts({
    heading: (config.texts as VoucherPromotionsTexts | undefined)?.heading ?? (config.heading as string | undefined),
    description: (config.texts as VoucherPromotionsTexts | undefined)?.description ?? (config.description as string | undefined),
    ctaLabel: (config.texts as VoucherPromotionsTexts | undefined)?.ctaLabel ?? (config.ctaLabel as string | undefined),
  });

  const heading = texts.heading || title || 'Voucher khuyến mãi';
  const description = texts.description;
  const ctaLabel = texts.ctaLabel;
  const ctaUrl = (config.ctaUrl as string) || '/promotions';
  const limit = normalizeVoucherLimit(config.limit as number | undefined);
  const style = normalizeVoucherStyle(config.style as string | undefined);
  const harmony = normalizeVoucherPromotionsHarmony((config.harmony as string | undefined) ?? DEFAULT_VOUCHER_PROMOTIONS_HARMONY);

  const vouchers = useQuery(api.promotions.listPublicVouchers, { limit }) as VoucherPromotionItem[] | undefined;
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const tokens = React.useMemo(() => getVoucherPromotionsColorTokens({
    primary: brandColor,
    secondary,
    mode,
    harmony: harmony as VoucherPromotionsHarmony,
  }), [brandColor, secondary, mode, harmony]);

  if (!vouchers || vouchers.length === 0) {
    return null;
  }

  const handleCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      window.setTimeout(() => {
        setCopiedCode((prev) => (prev === code ? null : prev));
      }, 1800);
    } catch {
      setCopiedCode(null);
    }
  };

  return (
    <VoucherPromotionsSectionShared
      context="site"
      style={style}
      heading={heading}
      description={description}
      ctaLabel={ctaLabel}
      ctaUrl={ctaUrl}
      vouchers={vouchers}
      tokens={tokens}
      copiedCode={copiedCode}
      onCopy={(code) => {
        void handleCopy(code);
      }}
      currentIndex={currentIndex}
      onCurrentIndexChange={setCurrentIndex}
    />
  );
}
