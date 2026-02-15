import { DEFAULT_VOUCHER_STYLE } from '@/lib/home-components/voucher-promotions';
import type { VoucherPromotionsConfigState } from '../_types';

export const DEFAULT_VOUCHER_PROMOTIONS_CONFIG: VoucherPromotionsConfigState = {
  ctaLabel: '',
  ctaUrl: '',
  description: '',
  heading: '',
  limit: 4,
  style: DEFAULT_VOUCHER_STYLE,
};
