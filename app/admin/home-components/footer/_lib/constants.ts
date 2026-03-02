import type { FooterConfig, FooterStyle } from '../_types';

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
  useOriginalSocialIconColors: true,
  socialLinks: [
    {
      icon: 'facebook',
      platform: 'facebook',
      url: '',
    },
  ],
  style: 'classic',
};

const FOOTER_STYLES: FooterStyle[] = ['classic', 'modern', 'corporate', 'minimal', 'centered', 'stacked'];

export const normalizeFooterConfig = (raw: Partial<FooterConfig> | null | undefined): FooterConfig => {
  const safe = raw ?? {};
  const columns = Array.isArray(safe.columns) && safe.columns.length > 0
    ? safe.columns
    : DEFAULT_FOOTER_CONFIG.columns;
  const socialLinks = Array.isArray(safe.socialLinks) && safe.socialLinks.length > 0
    ? safe.socialLinks
    : DEFAULT_FOOTER_CONFIG.socialLinks;
  const styleCandidate = safe.style && FOOTER_STYLES.includes(safe.style as FooterStyle)
    ? (safe.style as FooterStyle)
    : DEFAULT_FOOTER_CONFIG.style;

  return {
    columns: columns.map((column, index) => ({
      id: column.id ?? index + 1,
      links: Array.isArray(column.links) && column.links.length > 0
        ? column.links.map((link) => ({
          label: typeof link.label === 'string' ? link.label : '',
          url: typeof link.url === 'string' ? link.url : '',
        }))
        : [{ label: '', url: '' }],
      title: typeof column.title === 'string' ? column.title : '',
    })),
    copyright: typeof safe.copyright === 'string' ? safe.copyright : DEFAULT_FOOTER_CONFIG.copyright,
    description: typeof safe.description === 'string' ? safe.description : DEFAULT_FOOTER_CONFIG.description,
    logo: typeof safe.logo === 'string' ? safe.logo : DEFAULT_FOOTER_CONFIG.logo,
    showSocialLinks: safe.showSocialLinks !== false,
    useOriginalSocialIconColors: safe.useOriginalSocialIconColors !== false,
    socialLinks: socialLinks.map((social, index) => ({
      icon: typeof social.icon === 'string' ? social.icon : (typeof social.platform === 'string' ? social.platform : 'facebook'),
      id: social.id ?? index + 1,
      platform: typeof social.platform === 'string' ? social.platform : 'facebook',
      url: typeof social.url === 'string' ? social.url : '',
    })),
    style: styleCandidate,
  };
};
