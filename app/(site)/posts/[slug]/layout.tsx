import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getConvexClient } from '@/lib/convex';
import { api } from '@/convex/_generated/api';
import { getSEOSettings, getSiteSettings } from '@/lib/get-settings';
import { JsonLd, generateArticleSchema, generateBreadcrumbSchema } from '@/components/seo/JsonLd';
import { buildCanonicalUrl, buildMetadata, buildSeoContext } from '@/lib/seo/metadata';

interface Props {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const client = getConvexClient();

  const postsModule = await client.query(api.admin.modules.getModuleByKey, { key: 'posts' });
  if (postsModule?.enabled === false) {
    const [site, seo] = await Promise.all([
      getSiteSettings(),
      getSEOSettings(),
    ]);
    const context = buildSeoContext(site, seo);
    return buildMetadata({
      context,
      description: 'Trang bài viết hiện không khả dụng.',
      indexable: false,
      title: 'Không tìm thấy bài viết',
    });
  }
  
  const [post, site, seo] = await Promise.all([
    client.query(api.posts.getBySlug, { slug }),
    getSiteSettings(),
    getSEOSettings(),
  ]);

  if (!post) {
    const context = buildSeoContext(site, seo);
    return buildMetadata({
      context,
      description: 'Bài viết này không tồn tại hoặc đã bị xóa.',
      indexable: false,
      title: 'Không tìm thấy bài viết',
    });
  }

  const context = buildSeoContext(site, seo);
  const title = post.metaTitle ?? post.title;
  const description = (post.metaDescription ?? post.excerpt) ?? seo.seo_description;
  const image = post.thumbnail ?? context.image;

  return buildMetadata({
    canonical: buildCanonicalUrl(context.baseUrl, `/posts/${post.slug}`),
    context,
    description: description || context.description,
    image,
    indexable: true,
    openGraph: {
      publishedTime: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
    },
    openGraphType: 'article',
    title,
  });
}

export default async function PostLayout({ params, children }: Props) {
  const { slug } = await params;
  const client = getConvexClient();

  const postsModule = await client.query(api.admin.modules.getModuleByKey, { key: 'posts' });
  if (postsModule?.enabled === false) {
    notFound();
  }
  
  const [post, site, seo] = await Promise.all([
    client.query(api.posts.getBySlug, { slug }),
    getSiteSettings(),
    getSEOSettings(),
  ]);

  if (!post) {return children;}

  const baseUrl = (site.site_url || process.env.NEXT_PUBLIC_SITE_URL) ?? '';
  const postUrl = `${baseUrl}/posts/${post.slug}`;
  const image = post.thumbnail ?? seo.seo_og_image;

  const articleSchema = generateArticleSchema({
    description: (post.metaDescription ?? post.excerpt) ?? seo.seo_description,
    image,
    publishedAt: post.publishedAt,
    siteName: site.site_name,
    title: post.metaTitle ?? post.title,
    authorName: post.authorName,
    url: postUrl,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Trang chủ', url: baseUrl },
    { name: 'Bài viết', url: `${baseUrl}/posts` },
    { name: post.title, url: postUrl },
  ]);

  return (
    <>
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema} />
      {children}
    </>
  );
}
