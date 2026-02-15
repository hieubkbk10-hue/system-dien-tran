import type { PricingConfig } from '../_types';

export const DEFAULT_PRICING_CONFIG: PricingConfig = {
  monthlyLabel: 'Hàng tháng',
  plans: [
    {
      buttonLink: '',
      buttonText: '',
      features: [''],
      isPopular: false,
      name: '',
      period: '',
      price: '',
      yearlyPrice: '',
    },
  ],
  showBillingToggle: true,
  style: 'cards',
  subtitle: 'Chọn gói phù hợp với nhu cầu của bạn',
  yearlyLabel: 'Hàng năm',
  yearlySavingText: 'Tiết kiệm 17%',
};
