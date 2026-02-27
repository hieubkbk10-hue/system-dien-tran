import type { Metadata } from 'next';
import HomePageClient from './_components/HomePageClient';
import { getSEOSettings, getSiteSettings } from '@/lib/get-settings';
import { parseHreflang } from '@/lib/seo';

const buildMetadataBase = (baseUrl: string): URL | undefined => {
  if (!baseUrl) {
    return undefined;
  }
  return new URL(baseUrl);
};

export async function generateMetadata(): Promise<Metadata> {
  const [site, seo] = await Promise.all([
    getSiteSettings(),
    getSEOSettings(),
  ]);

  const baseUrl = (site.site_url || process.env.NEXT_PUBLIC_SITE_URL) ?? '';
  const title = seo.seo_title || site.site_name || 'VietAdmin';
  const description = seo.seo_description || site.site_tagline || '';
  const keywords = seo.seo_keywords ? seo.seo_keywords.split(',').map((keyword) => keyword.trim()) : [];
  const languages = parseHreflang(seo.seo_hreflang);

  return {
    alternates: {
      canonical: baseUrl || undefined,
      ...(Object.keys(languages).length > 0 && { languages }),
    },
    description,
    keywords,
    metadataBase: buildMetadataBase(baseUrl),
    openGraph: {
      description,
      images: seo.seo_og_image ? [{ url: seo.seo_og_image }] : undefined,
      locale: site.site_language === 'vi' ? 'vi_VN' : 'en_US',
      siteName: site.site_name || 'VietAdmin',
      title,
      type: 'website',
      url: baseUrl || undefined,
    },
    title,
    twitter: {
      card: 'summary_large_image',
      description,
      images: seo.seo_og_image ? [seo.seo_og_image] : undefined,
      title,
    },
  };
}

export default function HomePage(): React.ReactElement {
  return (
    <>
      <HomePageClient />
    </>
  );
}
