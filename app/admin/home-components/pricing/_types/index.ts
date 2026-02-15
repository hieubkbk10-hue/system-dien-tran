export interface PricingPlan {
  name: string;
  price: string;
  yearlyPrice?: string;
  period: string;
  features: string[];
  isPopular: boolean;
  buttonText: string;
  buttonLink: string;
}

export type PricingStyle = 'cards' | 'horizontal' | 'minimal' | 'comparison' | 'featured' | 'compact';

export interface PricingConfig {
  plans: PricingPlan[];
  style: PricingStyle;
  monthlyLabel?: string;
  yearlyLabel?: string;
  yearlySavingText?: string;
  showBillingToggle?: boolean;
  subtitle?: string;
}
