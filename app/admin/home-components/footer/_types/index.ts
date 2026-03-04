export interface FooterLink {
  label: string;
  url: string;
}

export interface FooterColumn {
  id?: number | string;
  title: string;
  links: FooterLink[];
}

export interface FooterSocialLink {
  id?: number | string;
  platform: string;
  url: string;
  icon: string;
}

export type FooterBrandMode = 'single' | 'dual';

export type FooterStyle = 'classic' | 'modern' | 'corporate' | 'minimal' | 'centered' | 'stacked';

export interface FooterConfig {
  columns: FooterColumn[];
  copyright: string;
  description: string;
  logo: string;
  showCopyright?: boolean;
  showBctLogo?: boolean;
  bctLogoType?: 'thong-bao' | 'dang-ky';
  bctLogoLink?: string;
  showSocialLinks: boolean;
  useOriginalSocialIconColors?: boolean;
  socialLinks: FooterSocialLink[];
  style: FooterStyle;
}
