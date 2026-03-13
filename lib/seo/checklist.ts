export type SeoChecklistCategory = 'crawl' | 'entity' | 'content' | 'speed' | 'external';
export type SeoChecklistSeverity = 'critical' | 'high' | 'medium' | 'low';
export type SeoChecklistStatus = 'pass' | 'warning' | 'fail' | 'info';

export type SeoQuickAction = {
  label: string;
  href: string;
  external?: boolean;
};

export type SeoChecklistItem = {
  id: string;
  category: SeoChecklistCategory;
  severity: SeoChecklistSeverity;
  status: SeoChecklistStatus;
  title: string;
  whyItMatters: string;
  howToFix: string;
  quickActions?: SeoQuickAction[];
  learnMoreUrl?: string;
  steps?: string[];
  isExternal?: boolean;
  autoCheck?: boolean;
};

export type SeoChecklistBuildInput = {
  baseUrl: string;
  siteName?: string;
  siteLogo?: string;
  siteTagline?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoOgImage?: string;
  seoKeywords?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactAddress?: string;
  contactTaxId?: string;
  socialLinks?: string[];
  postsCount?: number;
  productsCount?: number;
  servicesCount?: number;
  landingPagesCount?: number;
};

export type SeoChecklistResult = {
  items: SeoChecklistItem[];
  criticalItems: SeoChecklistItem[];
  quickWins: SeoChecklistItem[];
  externalItems: SeoChecklistItem[];
};

const sanitizeUrl = (value?: string): string => {
  if (!value) {
    return '';
  }
  return value.trim().replace(/\/$/, '');
};

const isValidBaseUrl = (value: string): boolean => {
  if (!value || value === 'https://example.com') {
    return false;
  }
  return value.startsWith('http://') || value.startsWith('https://');
};

const buildQuickActions = (actions: SeoQuickAction[]): SeoQuickAction[] => {
  return actions.filter((action) => Boolean(action.href));
};

export const buildSeoChecklist = (input: SeoChecklistBuildInput): SeoChecklistResult => {
  const baseUrl = sanitizeUrl(input.baseUrl);
  const hasValidBaseUrl = isValidBaseUrl(baseUrl);
  const sitemapUrl = baseUrl ? `${baseUrl}/sitemap.xml` : '';
  const robotsUrl = baseUrl ? `${baseUrl}/robots.txt` : '';
  const llmsUrl = baseUrl ? `${baseUrl}/llms.txt` : '';

  const hasSeoDescription = Boolean(input.seoDescription?.trim());
  const hasOgImage = Boolean((input.seoOgImage || input.siteLogo)?.trim());
  const hasSiteName = Boolean(input.siteName?.trim());
  const hasContactPhone = Boolean(input.contactPhone?.trim());
  const hasContactEmail = Boolean(input.contactEmail?.trim());
  const hasContactAddress = Boolean(input.contactAddress?.trim());
  const hasAnyContact = hasContactPhone || hasContactEmail;
  const hasSocialLinks = (input.socialLinks ?? []).some((link) => link.startsWith('http'));

  const postsCount = input.postsCount ?? 0;
  const productsCount = input.productsCount ?? 0;
  const servicesCount = input.servicesCount ?? 0;
  const landingPagesCount = input.landingPagesCount ?? 0;

  const items: SeoChecklistItem[] = [
    {
      id: 'site-url',
      category: 'crawl',
      severity: 'critical',
      status: hasValidBaseUrl ? 'pass' : 'fail',
      title: 'Có URL website chuẩn để bot hiểu đúng domain',
      whyItMatters: 'Nếu thiếu URL chuẩn, canonical và sitemap dễ sai, bot khó index nhanh.',
      howToFix: 'Điền Site URL đúng domain đang dùng.',
      quickActions: buildQuickActions([
        { label: 'Mở Settings', href: '/admin/settings' },
      ]),
      autoCheck: true,
    },
    {
      id: 'robots',
      category: 'crawl',
      severity: 'high',
      status: hasValidBaseUrl ? 'pass' : 'warning',
      title: 'Robots.txt hoạt động và không chặn nhầm trang public',
      whyItMatters: 'Robots sai khiến bot không crawl được dù nội dung tốt.',
      howToFix: 'Mở robots.txt để kiểm tra và đảm bảo không chặn trang public.',
      quickActions: buildQuickActions([
        { label: 'Mở robots.txt', href: robotsUrl, external: true },
      ]),
      autoCheck: hasValidBaseUrl,
    },
    {
      id: 'sitemap',
      category: 'crawl',
      severity: 'high',
      status: hasValidBaseUrl ? 'pass' : 'warning',
      title: 'Sitemap có URL quan trọng để bot crawl nhanh',
      whyItMatters: 'Sitemap giúp bot biết URL mới và ưu tiên đúng trang.',
      howToFix: 'Mở sitemap để kiểm tra URL chính và dọn URL rỗng.',
      quickActions: buildQuickActions([
        { label: 'Mở sitemap', href: sitemapUrl, external: true },
      ]),
      autoCheck: hasValidBaseUrl,
      learnMoreUrl: 'https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap',
    },
    {
      id: 'sitemap-hubs',
      category: 'crawl',
      severity: 'medium',
      status: landingPagesCount > 0 ? 'pass' : 'warning',
      title: 'Landing hub có nội dung thật để tránh sitemap loãng',
      whyItMatters: 'Hub rỗng làm bot crawl nhiều nhưng index kém.',
      howToFix: 'Tạo/publish landing pages hoặc tắt hub rỗng khỏi sitemap.',
      quickActions: buildQuickActions([
        { label: 'Mở Landing Pages', href: '/system/seo?tab=landing-pages' },
      ]),
      autoCheck: true,
    },
    {
      id: 'site-name',
      category: 'entity',
      severity: 'critical',
      status: hasSiteName ? 'pass' : 'fail',
      title: 'Tên website/brand đã có',
      whyItMatters: 'Thiếu tên thương hiệu làm giảm tín hiệu thực thể.',
      howToFix: 'Điền Site Name trong Settings.',
      quickActions: buildQuickActions([
        { label: 'Mở Settings', href: '/admin/settings' },
      ]),
      autoCheck: true,
    },
    {
      id: 'seo-description',
      category: 'entity',
      severity: 'medium',
      status: hasSeoDescription ? 'pass' : 'warning',
      title: 'Có mô tả SEO mặc định rõ ràng',
      whyItMatters: 'Mô tả giúp bot hiểu bạn bán gì và phục vụ ai.',
      howToFix: 'Điền Meta Description ngắn gọn, tự nhiên.',
      quickActions: buildQuickActions([
        { label: 'Mở Settings SEO', href: '/admin/settings' },
      ]),
      autoCheck: true,
    },
    {
      id: 'og-image',
      category: 'entity',
      severity: 'low',
      status: hasOgImage ? 'pass' : 'warning',
      title: 'Có logo/OG image đại diện thương hiệu',
      whyItMatters: 'Hình đại diện giúp tăng trust khi share và khi bot hiểu brand.',
      howToFix: 'Upload OG image hoặc logo.',
      quickActions: buildQuickActions([
        { label: 'Mở Settings SEO', href: '/admin/settings' },
      ]),
      autoCheck: true,
    },
    {
      id: 'contact-info',
      category: 'entity',
      severity: 'high',
      status: hasAnyContact ? 'pass' : 'warning',
      title: 'Có số điện thoại hoặc email liên hệ',
      whyItMatters: 'Thiếu liên hệ khiến bot khó xác nhận đây là site thật.',
      howToFix: 'Điền ít nhất 1 thông tin liên hệ.',
      quickActions: buildQuickActions([
        { label: 'Mở Settings Contact', href: '/admin/settings' },
      ]),
      autoCheck: true,
    },
    {
      id: 'address-info',
      category: 'entity',
      severity: 'medium',
      status: hasContactAddress ? 'pass' : 'warning',
      title: 'Có địa chỉ để phát LocalBusiness schema',
      whyItMatters: 'Địa chỉ giúp bot hiểu bạn là doanh nghiệp thật và local.',
      howToFix: 'Điền địa chỉ nếu có.',
      quickActions: buildQuickActions([
        { label: 'Mở Settings Contact', href: '/admin/settings' },
      ]),
      autoCheck: true,
    },
    {
      id: 'social-links',
      category: 'entity',
      severity: 'low',
      status: hasSocialLinks ? 'pass' : 'info',
      title: 'Có link social để tăng trust',
      whyItMatters: 'Social giúp bot xác nhận brand và tăng tín hiệu thật.',
      howToFix: 'Thêm link Facebook/YouTube/Instagram nếu có.',
      quickActions: buildQuickActions([
        { label: 'Mở Settings Social', href: '/admin/settings' },
      ]),
      autoCheck: true,
    },
    {
      id: 'posts-count',
      category: 'content',
      severity: 'medium',
      status: postsCount > 0 ? 'pass' : 'warning',
      title: 'Có bài viết published',
      whyItMatters: 'Bài viết giúp bot hiểu nội dung và chủ đề site.',
      howToFix: 'Publish ít nhất 1-3 bài viết thật.',
      quickActions: buildQuickActions([
        { label: 'Mở Posts', href: '/admin/posts' },
      ]),
      autoCheck: true,
    },
    {
      id: 'products-count',
      category: 'content',
      severity: 'medium',
      status: productsCount > 0 ? 'pass' : 'warning',
      title: 'Có sản phẩm published',
      whyItMatters: 'Sản phẩm là nguồn traffic và index quan trọng nhất.',
      howToFix: 'Publish ít nhất 1-3 sản phẩm thật.',
      quickActions: buildQuickActions([
        { label: 'Mở Products', href: '/admin/products' },
      ]),
      autoCheck: true,
    },
    {
      id: 'services-count',
      category: 'content',
      severity: 'medium',
      status: servicesCount > 0 ? 'pass' : 'warning',
      title: 'Có dịch vụ published',
      whyItMatters: 'Dịch vụ giúp bot hiểu business scope và tăng index.',
      howToFix: 'Publish ít nhất 1-3 dịch vụ thật.',
      quickActions: buildQuickActions([
        { label: 'Mở Services', href: '/admin/services' },
      ]),
      autoCheck: true,
    },
    {
      id: 'internal-links',
      category: 'content',
      severity: 'high',
      status: 'info',
      title: 'Homepage có link tới trang quan trọng',
      whyItMatters: 'Bot ưu tiên URL được link rõ từ homepage.',
      howToFix: 'Thêm link từ homepage tới Products/Services/Posts.',
      quickActions: buildQuickActions([
        { label: 'Mở Homepage', href: baseUrl, external: true },
      ]),
      autoCheck: false,
    },
    {
      id: 'rendering',
      category: 'speed',
      severity: 'medium',
      status: 'info',
      title: 'Trang public có text rõ ràng khi load',
      whyItMatters: 'Bot cần đọc được text mà không phụ thuộc JS quá nhiều.',
      howToFix: 'Đảm bảo nội dung chính render từ server.',
      quickActions: buildQuickActions([
        { label: 'Mở Homepage', href: baseUrl, external: true },
      ]),
      autoCheck: false,
      learnMoreUrl: 'https://developers.google.com/search/docs/crawling-indexing',
    },
    {
      id: 'gsc',
      category: 'external',
      severity: 'high',
      status: 'info',
      title: 'Submit sitemap trong Google Search Console',
      whyItMatters: 'Giúp Google biết URL mới nhanh hơn.',
      howToFix: 'Mở GSC, add property, rồi submit sitemap.',
      quickActions: buildQuickActions([
        { label: 'Mở GSC', href: 'https://search.google.com/search-console', external: true },
        { label: 'Copy Sitemap URL', href: sitemapUrl },
      ]),
      steps: [
        'Mở Google Search Console',
        'Add property → nhập domain',
        `Vào Sitemaps → dán ${sitemapUrl || 'URL sitemap'}`,
        'Bấm Submit',
      ],
      isExternal: true,
      autoCheck: false,
      learnMoreUrl: 'https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap',
    },
    {
      id: 'bing-webmaster',
      category: 'external',
      severity: 'medium',
      status: 'info',
      title: 'Submit sitemap trong Bing Webmaster',
      whyItMatters: 'Bing/Edge index nhanh hơn khi có sitemap.',
      howToFix: 'Đăng nhập Bing Webmaster và submit sitemap.',
      quickActions: buildQuickActions([
        { label: 'Mở Bing Webmaster', href: 'https://www.bing.com/webmasters', external: true },
        { label: 'Copy Sitemap URL', href: sitemapUrl },
      ]),
      steps: [
        'Mở Bing Webmaster',
        'Add site → nhập domain',
        `Submit sitemap: ${sitemapUrl || 'URL sitemap'}`,
        'Lưu lại',
      ],
      isExternal: true,
      autoCheck: false,
      learnMoreUrl: 'https://www.bing.com/webmasters/help/why-is-my-site-not-in-the-index-2141dfab',
    },
    {
      id: 'indexnow',
      category: 'external',
      severity: 'medium',
      status: 'info',
      title: 'Bật IndexNow để báo URL mới/cập nhật',
      whyItMatters: 'IndexNow giúp Bing/Edge nhận biết URL mới nhanh hơn.',
      howToFix: 'Tạo key IndexNow và gửi ping khi có content mới.',
      quickActions: buildQuickActions([
        { label: 'Mở IndexNow', href: 'https://www.bing.com/indexnow/getstarted', external: true },
      ]),
      steps: [
        'Mở IndexNow guide',
        'Tạo key và đặt file key tại root domain',
        'Ping IndexNow khi publish content mới',
      ],
      isExternal: true,
      autoCheck: false,
      learnMoreUrl: 'https://www.bing.com/indexnow/getstarted',
    },
    {
      id: 'llms',
      category: 'external',
      severity: 'low',
      status: llmsUrl ? 'info' : 'warning',
      title: 'Có llms.txt để AI hiểu site rõ hơn',
      whyItMatters: 'AI search ngày càng quan trọng, llms.txt giúp hiểu nội dung nhanh.',
      howToFix: 'Mở llms.txt và bổ sung thông tin nếu cần.',
      quickActions: buildQuickActions([
        { label: 'Mở llms.txt', href: llmsUrl, external: true },
      ]),
      isExternal: true,
      autoCheck: Boolean(llmsUrl),
    },
  ];

  const criticalItems = items.filter(
    (item) => item.severity === 'critical' && item.status !== 'pass'
  );

  const quickWins = items
    .filter((item) => item.status !== 'pass' && item.quickActions && item.quickActions.length > 0)
    .sort((a, b) => {
      const weight = { critical: 4, high: 3, medium: 2, low: 1 };
      return weight[b.severity] - weight[a.severity];
    })
    .slice(0, 5);

  const externalItems = items.filter((item) => item.category === 'external');

  return {
    items,
    criticalItems,
    quickWins,
    externalItems,
  };
};
