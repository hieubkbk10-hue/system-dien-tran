import { DEFAULT_VOUCHER_STYLE, type VoucherPromotionsStyle } from '@/lib/home-components/voucher-promotions';
import type { VoucherPromotionsConfigState, VoucherPromotionsHarmony } from '../_types';

export const VOUCHER_PROMOTIONS_STYLES: { id: VoucherPromotionsStyle; label: string }[] = [
  { id: 'enterpriseCards', label: 'Enterprise Cards' },
  { id: 'ticketHorizontal', label: 'Ticket Ngang' },
  { id: 'couponGrid', label: 'Coupon Grid' },
  { id: 'stackedBanner', label: 'Stacked Banner' },
  { id: 'carousel', label: 'Carousel' },
  { id: 'minimal', label: 'Minimal' },
];

export const DEFAULT_VOUCHER_PROMOTIONS_HARMONY: VoucherPromotionsHarmony = 'analogous';

export const normalizeVoucherPromotionsHarmony = (value?: string): VoucherPromotionsHarmony => {
  if (value === 'complementary' || value === 'triadic' || value === 'analogous') {
    return value;
  }
  return DEFAULT_VOUCHER_PROMOTIONS_HARMONY;
};

export const DEFAULT_VOUCHER_PROMOTIONS_CONFIG: VoucherPromotionsConfigState = {
  ctaLabel: '',
  ctaUrl: '',
  description: '',
  heading: '',
  limit: 4,
  style: DEFAULT_VOUCHER_STYLE,
  harmony: DEFAULT_VOUCHER_PROMOTIONS_HARMONY,
};
