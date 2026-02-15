export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

export type FeaturesStyle = 'iconGrid' | 'alternating' | 'compact' | 'cards' | 'carousel' | 'timeline';

export interface FeaturesConfig {
  items: FeatureItem[];
  style: FeaturesStyle;
}
