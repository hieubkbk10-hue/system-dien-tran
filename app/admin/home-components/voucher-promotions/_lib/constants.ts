import { DEFAULT_VOUCHER_STYLE, type VoucherPromotionsStyle } from '@/lib/home-components/voucher-promotions';
import type { VoucherPromotionsConfigState, VoucherPromotionsHarmony, VoucherPromotionsTexts } from '../_types';

export const VOUCHER_PROMOTIONS_STYLES: { id: VoucherPromotionsStyle; label: string }[] = [
  { id: 'enterpriseCards', label: 'Enterprise Cards' },
  { id: 'ticketHorizontal', label: 'Ticket Ngang' },
  { id: 'couponGrid', label: 'Coupon Grid' },
  { id: 'stackedBanner', label: 'Stacked Banner' },
  { id: 'carousel', label: 'Carousel' },
  { id: 'minimal', label: 'Minimal' },
];

export const DEFAULT_VOUCHER_PROMOTIONS_HARMONY: VoucherPromotionsHarmony = 'analogous';

export const DEFAULT_VOUCHER_PROMOTIONS_TEXTS: VoucherPromotionsTexts = {
  heading: 'Voucher khuyến mãi',
  description: 'Áp dụng mã để nhận ưu đãi tốt nhất hôm nay.',
  ctaLabel: 'Xem tất cả ưu đãi',
};

export const normalizeVoucherPromotionsHarmony = (value?: string): VoucherPromotionsHarmony => {
  if (value === 'complementary' || value === 'triadic' || value === 'analogous') {
    return value;
  }
  return DEFAULT_VOUCHER_PROMOTIONS_HARMONY;
};

export const normalizeVoucherPromotionsTexts = (texts?: Partial<VoucherPromotionsTexts>): VoucherPromotionsTexts => ({
  heading: texts?.heading?.trim() || DEFAULT_VOUCHER_PROMOTIONS_TEXTS.heading,
  description: texts?.description?.trim() || DEFAULT_VOUCHER_PROMOTIONS_TEXTS.description,
  ctaLabel: texts?.ctaLabel?.trim() || DEFAULT_VOUCHER_PROMOTIONS_TEXTS.ctaLabel,
});

export const DEFAULT_VOUCHER_PROMOTIONS_CONFIG: VoucherPromotionsConfigState = {
  ctaUrl: '/promotions',
  limit: 4,
  style: DEFAULT_VOUCHER_STYLE,
  harmony: DEFAULT_VOUCHER_PROMOTIONS_HARMONY,
  texts: DEFAULT_VOUCHER_PROMOTIONS_TEXTS,
};
