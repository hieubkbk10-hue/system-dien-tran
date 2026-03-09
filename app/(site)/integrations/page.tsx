import type { Metadata } from 'next';
import { getConvexClient } from '@/lib/convex';
import { api } from '@/convex/_generated/api';
import { getSEOSettings, getSiteSettings, getContactSettings } from '@/lib/get-settings';
import { buildSeoMetadata } from '@/lib/seo/metadata';

export const revalidate = 1800;

export async function generateMetadata(): Promise<Metadata> {
  const [site, seo, contact] = await Promise.all([getSiteSettings(), getSEOSettings(), getContactSettings()]);
  return buildSeoMetadata({ contact, descriptionOverride: 'Tích hợp với các công cụ và nền tảng phổ biến', pathname: '/integrations', routeType: 'list', seo, site, titleOverride: 'Tích hợp' });
}

export default async function IntegrationsPage() {
  const result = await getConvexClient().query(api.landingPages.listPublishedByType, { landingType: 'integration', paginationOpts: { cursor: null, numItems: 50 } });
  const site = await getSiteSettings();
  const baseUrl = (site.site_url || process.env.NEXT_PUBLIC_SITE_URL) ?? '';
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4">Tích hợp</h1>
      <p className="text-xl text-slate-600 dark:text-slate-400 mb-12">Tích hợp với các công cụ và nền tảng phổ biến</p>
      {result.page.length === 0 ? <p className="text-slate-500">Chưa có dữ liệu.</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {result.page.map((item) => (
            <a key={item._id} href={`${baseUrl}/integrations/${item.slug}`} className="block border rounded-lg p-6 hover:border-primary transition-colors">
              {item.heroImage && <img src={item.heroImage} alt={item.title} className="w-full h-40 object-cover rounded mb-4" />}
              <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3">{item.summary}</p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
