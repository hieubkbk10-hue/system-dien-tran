import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLd, generateItemListSchema } from '@/components/seo/JsonLd';
import { api } from '@/convex/_generated/api';
import { getConvexClient } from '@/lib/convex';
import { getSEOSettings, getSiteSettings } from '@/lib/get-settings';
import { buildCanonicalUrl, buildMetadata, buildSeoContext } from '@/lib/seo/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const client = getConvexClient();
  const [site, seo, servicesModule] = await Promise.all([
    getSiteSettings(),
    getSEOSettings(),
    client.query(api.admin.modules.getModuleByKey, { key: 'services' }),
  ]);

  if (servicesModule?.enabled === false) {
    const context = buildSeoContext(site, seo);
    return buildMetadata({
      context,
      description: 'Trang dịch vụ hiện không khả dụng.',
      indexable: false,
      title: 'Không tìm thấy dịch vụ',
    });
  }

  const context = buildSeoContext(site, seo);
  const title = 'Dịch vụ';
  const description = seo.seo_description || `Danh sách dịch vụ từ ${site.site_name}`;

  return buildMetadata({
    canonical: buildCanonicalUrl(context.baseUrl, '/services'),
    context,
    description,
    indexable: true,
    title,
  });
}

export default async function ServicesListLayout({ children }: { children: React.ReactNode }) {
  const client = getConvexClient();
  const servicesModule = await client.query(api.admin.modules.getModuleByKey, { key: 'services' });

  if (servicesModule?.enabled === false) {
    notFound();
  }
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
    name: 'Dịch vụ mới nhất',
    url: `${baseUrl}/services`,
  });

  return (
    <>
      {services.length > 0 && <JsonLd data={itemListSchema} />}
      {children}
    </>
  );
}
