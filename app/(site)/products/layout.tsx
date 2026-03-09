import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLd, generateItemListSchema } from '@/components/seo/JsonLd';
import { api } from '@/convex/_generated/api';
import { getConvexClient } from '@/lib/convex';
import { getSEOSettings, getSiteSettings } from '@/lib/get-settings';
import { buildCanonicalUrl, buildMetadata, buildSeoContext } from '@/lib/seo/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const client = getConvexClient();
  const [site, seo, productsModule] = await Promise.all([
    getSiteSettings(),
    getSEOSettings(),
    client.query(api.admin.modules.getModuleByKey, { key: 'products' }),
  ]);

  if (productsModule?.enabled === false) {
    const context = buildSeoContext(site, seo);
    return buildMetadata({
      context,
      description: 'Trang sản phẩm hiện không khả dụng.',
      indexable: false,
      title: 'Không tìm thấy sản phẩm',
    });
  }

  const context = buildSeoContext(site, seo);
  const title = 'Sản phẩm';
  const description = seo.seo_description || `Danh sách sản phẩm từ ${site.site_name}`;

  return buildMetadata({
    canonical: buildCanonicalUrl(context.baseUrl, '/products'),
    context,
    description,
    indexable: true,
    title,
  });
}

export default async function ProductsListLayout({ children }: { children: React.ReactNode }) {
  const client = getConvexClient();
  const productsModule = await client.query(api.admin.modules.getModuleByKey, { key: 'products' });

  if (productsModule?.enabled === false) {
    notFound();
  }
  const site = await getSiteSettings();
  const baseUrl = (site.site_url || process.env.NEXT_PUBLIC_SITE_URL) ?? '';
  const products = await client.query(api.products.listPublishedWithOffset, {
    limit: 20,
    offset: 0,
    sortBy: 'newest',
  });

  const itemListSchema = generateItemListSchema({
    items: products.map((product) => ({
      name: product.name,
      url: `${baseUrl}/products/${product.slug}`,
    })),
    name: 'Sản phẩm mới nhất',
    url: `${baseUrl}/products`,
  });

  return (
    <>
      {products.length > 0 && <JsonLd data={itemListSchema} />}
      {children}
    </>
  );
}
