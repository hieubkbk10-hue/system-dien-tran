export interface BenefitItem {
  icon: string;
  title: string;
  description: string;
}

export type BenefitsStyle = 'cards' | 'list' | 'bento' | 'row' | 'carousel' | 'timeline';

export interface BenefitsConfig {
  items: BenefitItem[];
  style: BenefitsStyle;
  subHeading?: string;
  heading?: string;
  buttonText?: string;
  buttonLink?: string;
}
