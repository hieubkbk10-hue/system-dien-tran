import Link from 'next/link';
import type { Metadata } from 'next';
import { JsonLd, generateItemListSchema } from '@/components/seo/JsonLd';
import { api } from '@/convex/_generated/api';
import { getConvexClient } from '@/lib/convex';
import { getSEOSettings, getSiteSettings } from '@/lib/get-settings';
import { parseHreflang } from '@/lib/seo';
import { buildListCanonical } from '@/lib/seo/canonical';

interface MetadataProps {
  searchParams?: Record<string, string | string[] | undefined>;
}

export async function generateMetadata({ searchParams }: MetadataProps): Promise<Metadata> {
  const [site, seo] = await Promise.all([
    getSiteSettings(),
    getSEOSettings(),
  ]);

  const baseUrl = (site.site_url || process.env.NEXT_PUBLIC_SITE_URL) ?? '';
  const title = 'Bài viết';
  const description = seo.seo_description || `Tin tức, kiến thức và xu hướng mới từ ${site.site_name}`;
  const keywords = seo.seo_keywords ? seo.seo_keywords.split(',').map(k => k.trim()) : [];
  const image = seo.seo_og_image;
  const languages = parseHreflang(seo.seo_hreflang);
  const canonical = buildListCanonical({
    baseUrl,
    pathname: '/posts',
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

export default async function PostsListLayout({ children }: { children: React.ReactNode }) {
  const client = getConvexClient();
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
      <section className="px-4 pt-8 pb-4">
        <div className="max-w-6xl mx-auto space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Bài viết</h1>
          <p className="text-base md:text-lg text-slate-600">
            Cập nhật kiến thức hữu ích, hướng dẫn và câu chuyện mới nhất.
          </p>
          <div className="flex flex-wrap gap-3 text-sm font-medium">
            <Link href="/products" className="text-blue-600 hover:underline">Sản phẩm</Link>
            <Link href="/services" className="text-blue-600 hover:underline">Dịch vụ</Link>
            <Link href="/contact" className="text-blue-600 hover:underline">Liên hệ</Link>
          </div>
        </div>
      </section>
      {posts.length > 0 && <JsonLd data={itemListSchema} />}
      {children}
    </>
  );
}
