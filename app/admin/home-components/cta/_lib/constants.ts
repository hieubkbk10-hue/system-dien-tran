import type { CTAConfig, CTAHarmony, CTAStyle } from '../_types';

export const DEFAULT_CTA_HARMONY: CTAHarmony = 'analogous';

export const CTA_STYLES: CTAStyle[] = ['banner', 'centered', 'split', 'floating', 'gradient', 'minimal'];
export const CTA_HARMONIES: CTAHarmony[] = ['analogous', 'complementary', 'triadic'];

export const normalizeCTAStyle = (value: unknown): CTAStyle => (
  typeof value === 'string' && CTA_STYLES.includes(value as CTAStyle)
    ? (value as CTAStyle)
    : 'banner'
);

export const normalizeCTAHarmony = (value: unknown): CTAHarmony => (
  typeof value === 'string' && CTA_HARMONIES.includes(value as CTAHarmony)
    ? (value as CTAHarmony)
    : DEFAULT_CTA_HARMONY
);

export const DEFAULT_CTA_CONFIG: CTAConfig = {
  badge: '',
  buttonLink: '',
  buttonText: '',
  description: '',
  secondaryButtonLink: '',
  secondaryButtonText: '',
  title: '',
};
