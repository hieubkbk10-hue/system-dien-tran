import type { Metadata } from 'next';
import { JsonLd, generateItemListSchema } from '@/components/seo/JsonLd';
import { api } from '@/convex/_generated/api';
import { getConvexClient } from '@/lib/convex';
import { getSEOSettings, getSiteSettings } from '@/lib/get-settings';
import { buildListCanonical } from '@/lib/seo/canonical';
import { parseHreflang } from '@/lib/seo';

interface MetadataProps {
  searchParams?: Record<string, string | string[] | undefined>;
}

export async function generateMetadata({ searchParams }: MetadataProps): Promise<Metadata> {
  const [site, seo] = await Promise.all([
    getSiteSettings(),
    getSEOSettings(),
  ]);

  const baseUrl = (site.site_url || process.env.NEXT_PUBLIC_SITE_URL) ?? '';
  const title = 'Dịch vụ';
  const description = seo.seo_description || `Tổng hợp dịch vụ nổi bật từ ${site.site_name}`;
  const keywords = seo.seo_keywords ? seo.seo_keywords.split(',').map(k => k.trim()) : [];
  const image = seo.seo_og_image;
  const languages = parseHreflang(seo.seo_hreflang);
  const canonical = buildListCanonical({
    baseUrl,
    pathname: '/services',
    pageParam: searchParams?.page,
  });

  return {
    alternates: {
      canonical,
      ...(Object.keys(languages).length > 0 && { languages }),
    },
    description,
    keywords,
    openGraph: {
      title: `${title} | ${site.site_name}`,
      description,
      type: 'website',
      url: canonical,
      images: image ? [{ url: image }] : undefined,
      siteName: site.site_name,
      locale: site.site_language === 'vi' ? 'vi_VN' : 'en_US',
    },
    title,
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${site.site_name}`,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ServicesListLayout({ children }: { children: React.ReactNode }) {
  const client = getConvexClient();
  const site = await getSiteSettings();
  const baseUrl = (site.site_url || process.env.NEXT_PUBLIC_SITE_URL) ?? '';
  const services = await client.query(api.services.listPublishedWithOffset, {
    limit: 20,
    offset: 0,
    sortBy: 'newest',
  });

  const itemListSchema = generateItemListSchema({
    items: services.map((service) => ({
      name: service.title,
      url: `${baseUrl}/services/${service.slug}`,
    })),
    name: 'Dịch vụ',
    url: `${baseUrl}/services`,
  });

  return (
    <>
      {services.length > 0 && <JsonLd data={itemListSchema} />}
      {children}
    </>
  );
}
