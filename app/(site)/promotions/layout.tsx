import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLd, generateBreadcrumbSchema } from '@/components/seo/JsonLd';
import { api } from '@/convex/_generated/api';
import { getConvexClient } from '@/lib/convex';
import { getSEOSettings, getSiteSettings } from '@/lib/get-settings';
import { parseHreflang } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const client = getConvexClient();
  const [site, seo, promotionsModule] = await Promise.all([
    getSiteSettings(),
    getSEOSettings(),
    client.query(api.admin.modules.getModuleByKey, { key: 'promotions' }),
  ]);

  if (promotionsModule?.enabled === false) {
    return {
      description: 'Trang khuyến mãi hiện không khả dụng.',
      robots: { follow: false, index: false },
      title: 'Không tìm thấy khuyến mãi',
    };
  }

  const baseUrl = (site.site_url || process.env.NEXT_PUBLIC_SITE_URL) ?? '';
  const title = 'Khuyến mãi';
  const description = `Chương trình khuyến mãi hấp dẫn từ ${site.site_name} - Săn deal hot, giảm giá sốc`;
  const image = seo.seo_og_image;
  const languages = parseHreflang(seo.seo_hreflang);

  return {
    alternates: {
      canonical: `${baseUrl}/promotions`,
      ...(Object.keys(languages).length > 0 && { languages }),
    },
    description,
    openGraph: {
      title: `${title} | ${site.site_name}`,
      description,
      type: 'website',
      url: `${baseUrl}/promotions`,
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

export default async function PromotionsLayout({ children }: { children: React.ReactNode }) {
  const client = getConvexClient();
  const promotionsModule = await client.query(api.admin.modules.getModuleByKey, { key: 'promotions' });

  if (promotionsModule?.enabled === false) {
    notFound();
  }
  const site = await getSiteSettings();
  const baseUrl = (site.site_url || process.env.NEXT_PUBLIC_SITE_URL) ?? '';

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Trang chủ', url: baseUrl },
    { name: 'Khuyến mãi', url: `${baseUrl}/promotions` },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      {children}
    </>
  );
}
