import type { FooterConfig } from '../_types';

export const DEFAULT_FOOTER_CONFIG: FooterConfig = {
  columns: [
    {
      links: [{ label: '', url: '' }],
      title: '',
    },
  ],
  copyright: '',
  description: '',
  logo: '',
  showSocialLinks: true,
  socialLinks: [
    {
      icon: 'facebook',
      platform: 'facebook',
      url: '',
    },
  ],
  style: 'classic',
};
