import type { Metadata } from 'next';
import HomePageClient from './_components/HomePageClient';
import { getSEOSettings, getSiteSettings } from '@/lib/get-settings';
import { buildCanonicalUrl, buildMetadata, buildSeoContext } from '@/lib/seo/metadata';
import { getConvexClient } from '@/lib/convex';
import { api } from '@/convex/_generated/api';

export async function generateMetadata(): Promise<Metadata> {
  const [site, seo] = await Promise.all([
    getSiteSettings(),
    getSEOSettings(),
  ]);
  const context = buildSeoContext(site, seo);

  return buildMetadata({
    canonical: buildCanonicalUrl(context.baseUrl),
    context,
    description: context.description,
    indexable: true,
    title: context.title,
  });
}

export default async function HomePage(): Promise<React.ReactElement> {
  const client = getConvexClient();
  const initialComponents = await client.query(api.homeComponents.listActive);

  return (
    <>
      <HomePageClient initialComponents={initialComponents} />
    </>
  );
}
