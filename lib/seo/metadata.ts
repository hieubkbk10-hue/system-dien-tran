import type { Metadata } from 'next';
import type { SEOSettings, SiteSettings } from '@/lib/get-settings';

export type SeoContext = {
  baseUrl: string;
  description: string;
  image: string;
  keywords: string[];
  locale: string;
  siteName: string;
  title: string;
};

const buildMetadataBase = (baseUrl: string): URL | undefined => {
  if (!baseUrl) {
    return undefined;
  }
  return new URL(baseUrl);
};

const resolveLocale = (language: string): string => {
  if (language === 'vi') {
    return 'vi_VN';
  }
  return 'en_US';
};

export const buildSeoContext = (site: SiteSettings, seo: SEOSettings): SeoContext => {
  const baseUrl = (site.site_url || process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/$/, '');
  const siteName = site.site_name || 'Website';
  const title = seo.seo_title || siteName;
  const description = seo.seo_description || site.site_tagline || '';
  const keywords = seo.seo_keywords
    ? seo.seo_keywords.split(',').map((keyword) => keyword.trim()).filter(Boolean)
    : [];

  return {
    baseUrl,
    description,
    image: seo.seo_og_image || site.site_logo || '',
    keywords,
    locale: resolveLocale(site.site_language || 'vi'),
    siteName,
    title,
  };
};

export const buildCanonicalUrl = (baseUrl: string, path = ''): string | undefined => {
  if (!baseUrl) {
    return undefined;
  }
  if (!path) {
    return baseUrl;
  }
  return `${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
};

export const buildMetadata = (params: {
  canonical?: string;
  context: SeoContext;
  description: string;
  image?: string;
  indexable: boolean;
  keywords?: string[];
  openGraphType?: 'website' | 'article';
  openGraph?: Partial<NonNullable<Metadata['openGraph']>>;
  title: string;
  useTitleTemplate?: boolean;
}): Metadata => {
  const resolvedImage = params.image || params.context.image;
  const resolvedKeywords = params.keywords ?? params.context.keywords;
  const openGraphTitle = params.useTitleTemplate
    ? params.title
    : `${params.title} | ${params.context.siteName}`;

  return {
    alternates: params.canonical ? { canonical: params.canonical } : undefined,
    description: params.description,
    keywords: resolvedKeywords.length > 0 ? resolvedKeywords : undefined,
    metadataBase: buildMetadataBase(params.context.baseUrl),
    openGraph: {
      description: params.description,
      images: resolvedImage ? [{ url: resolvedImage }] : undefined,
      locale: params.context.locale,
      siteName: params.context.siteName,
      title: openGraphTitle,
      type: params.openGraphType ?? 'website',
      url: params.canonical,
      ...(params.openGraph ?? {}),
    },
    robots: {
      follow: params.indexable,
      index: params.indexable,
    },
    title: params.useTitleTemplate
      ? { default: params.title, template: `%s | ${params.context.siteName}` }
      : params.title,
    twitter: {
      card: 'summary_large_image',
      description: params.description,
      images: resolvedImage ? [resolvedImage] : undefined,
      title: openGraphTitle,
    },
  };
};
