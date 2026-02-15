export interface CTAConfig {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  badge?: string;
  backgroundImage?: string;
}

export type CTAStyle = 'banner' | 'centered' | 'split' | 'floating' | 'gradient' | 'minimal';
