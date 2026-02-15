export interface FooterLink {
  label: string;
  url: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface FooterSocialLink {
  platform: string;
  url: string;
  icon: string;
}

export type FooterStyle = 'classic' | 'modern' | 'corporate' | 'minimal' | 'centered' | 'stacked';

export interface FooterConfig {
  columns: FooterColumn[];
  copyright: string;
  description: string;
  logo: string;
  showSocialLinks: boolean;
  socialLinks: FooterSocialLink[];
  style: FooterStyle;
}
