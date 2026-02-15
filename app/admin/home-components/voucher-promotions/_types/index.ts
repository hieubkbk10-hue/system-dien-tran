import type { VoucherPromotionsStyle } from '@/lib/home-components/voucher-promotions';

export interface VoucherPromotionsConfig {
  heading?: string;
  description?: string;
  ctaLabel?: string;
  ctaUrl?: string;
}

export interface VoucherPromotionsConfigState extends VoucherPromotionsConfig {
  style: VoucherPromotionsStyle;
  limit: number;
}
