import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLd, generateItemListSchema } from '@/components/seo/JsonLd';
import { api } from '@/convex/_generated/api';
import { getConvexClient } from '@/lib/convex';
import { getSEOSettings, getSiteSettings } from '@/lib/get-settings';
import { buildCanonicalUrl, buildMetadata, buildSeoContext } from '@/lib/seo/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const client = getConvexClient();
  const [site, seo, postsModule] = await Promise.all([
    getSiteSettings(),
    getSEOSettings(),
    client.query(api.admin.modules.getModuleByKey, { key: 'posts' }),
  ]);

  if (postsModule?.enabled === false) {
    const context = buildSeoContext(site, seo);
    return buildMetadata({
      context,
      description: 'Trang bài viết hiện không khả dụng.',
      indexable: false,
      title: 'Không tìm thấy bài viết',
    });
  }

  const context = buildSeoContext(site, seo);
  const title = 'Bài viết';
  const description = seo.seo_description || `Danh sách bài viết từ ${site.site_name}`;

  return buildMetadata({
    canonical: buildCanonicalUrl(context.baseUrl, '/posts'),
    context,
    description,
    indexable: true,
    title,
  });
}

export default async function PostsListLayout({ children }: { children: React.ReactNode }) {
  const client = getConvexClient();
  const postsModule = await client.query(api.admin.modules.getModuleByKey, { key: 'posts' });

  if (postsModule?.enabled === false) {
    notFound();
  }
  const site = await getSiteSettings();
  const baseUrl = (site.site_url || process.env.NEXT_PUBLIC_SITE_URL) ?? '';
  const posts = await client.query(api.posts.listPublishedWithOffset, {
    limit: 20,
    offset: 0,
    sortBy: 'newest',
  });

  const itemListSchema = generateItemListSchema({
    items: posts.map((post) => ({
      name: post.title,
      url: `${baseUrl}/posts/${post.slug}`,
    })),
    name: 'Bài viết mới nhất',
    url: `${baseUrl}/posts`,
  });

  return (
    <>
      {posts.length > 0 && <JsonLd data={itemListSchema} />}
      {children}
    </>
  );
}
