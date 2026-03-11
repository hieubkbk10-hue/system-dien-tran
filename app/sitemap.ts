import type { MetadataRoute } from 'next';
import { getConvexClient } from '@/lib/convex';
import { api } from '@/convex/_generated/api';
import { collectPaginated } from '@/lib/seo/sitemap';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const client = getConvexClient();
  
  // Get site URL from settings
  const siteUrlSetting = await client.query(api.settings.getByKey, { key: 'site_url' });
  const baseUrl = ((siteUrlSetting?.value as string) || process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/$/, '');

  if (!baseUrl || baseUrl === 'https://example.com') {
    return [];
  }

  const staticPages: MetadataRoute.Sitemap = [
    {
      changeFrequency: 'daily',
      priority: 1,
      url: baseUrl,
    },
    {
      changeFrequency: 'daily',
      priority: 0.8,
      url: `${baseUrl}/posts`,
    },
    {
      changeFrequency: 'daily',
      priority: 0.8,
      url: `${baseUrl}/products`,
    },
    {
      changeFrequency: 'weekly',
      priority: 0.8,
      url: `${baseUrl}/services`,
    },
    {
      changeFrequency: 'weekly',
      priority: 0.7,
      url: `${baseUrl}/contact`,
    },
    {
      changeFrequency: 'daily',
      priority: 0.7,
      url: `${baseUrl}/promotions`,
    },
    {
      changeFrequency: 'monthly',
      priority: 0.6,
      url: `${baseUrl}/stores`,
    },
    // SaaS landing hubs
    {
      changeFrequency: 'weekly',
      priority: 0.8,
      url: `${baseUrl}/features`,
    },
    {
      changeFrequency: 'weekly',
      priority: 0.8,
      url: `${baseUrl}/use-cases`,
    },
    {
      changeFrequency: 'weekly',
      priority: 0.8,
      url: `${baseUrl}/solutions`,
    },
    {
      changeFrequency: 'weekly',
      priority: 0.7,
      url: `${baseUrl}/compare`,
    },
    {
      changeFrequency: 'weekly',
      priority: 0.7,
      url: `${baseUrl}/integrations`,
    },
    {
      changeFrequency: 'weekly',
      priority: 0.7,
      url: `${baseUrl}/templates`,
    },
    {
      changeFrequency: 'weekly',
      priority: 0.8,
      url: `${baseUrl}/guides`,
    },
  ];

  const [posts, products, services, landingPages] = await Promise.all([
    collectPaginated((cursor) => client.query(api.posts.listPublished, {
      paginationOpts: { cursor, numItems: 500 },
    })),
    collectPaginated((cursor) => client.query(api.products.listPublishedPaginated, {
      paginationOpts: { cursor, numItems: 500 },
      sortBy: 'newest',
    })),
    collectPaginated((cursor) => client.query(api.services.listPublishedPaginated, {
      paginationOpts: { cursor, numItems: 500 },
      sortBy: 'newest',
    })),
    collectPaginated((cursor) => client.query(api.landingPages.listAllPublished, {
      paginationOpts: { cursor, numItems: 500 },
    })),
  ]);

  // Generate post URLs
  const postUrls: MetadataRoute.Sitemap = posts.map((post) => ({
    changeFrequency: 'weekly' as const,
    ...(post.publishedAt && { lastModified: new Date(post.publishedAt) }),
    priority: 0.6,
    url: `${baseUrl}/posts/${post.slug}`,
  }));

  // Generate product URLs
  const productUrls: MetadataRoute.Sitemap = products.map((product) => ({
    changeFrequency: 'weekly' as const,
    lastModified: new Date(product._creationTime),
    priority: 0.7,
    url: `${baseUrl}/products/${product.slug}`,
  }));

  // Generate service URLs
  const serviceUrls: MetadataRoute.Sitemap = services.map((service) => ({
    changeFrequency: 'monthly' as const,
    ...(service.publishedAt && { lastModified: new Date(service.publishedAt) }),
    priority: 0.7,
    url: `${baseUrl}/services/${service.slug}`,
  }));

  // Generate landing page URLs (features/use-cases/solutions/compare/integrations/templates/guides)
  const landingUrls: MetadataRoute.Sitemap = landingPages.map((page) => {
    const routeMap: Record<string, string> = {
      feature: '/features',
      'use-case': '/use-cases',
      solution: '/solutions',
      compare: '/compare',
      integration: '/integrations',
      template: '/templates',
      guide: '/guides',
    };
    const basePath = routeMap[page.landingType] || '/features';
    
    return {
      changeFrequency: 'weekly' as const,
      lastModified: new Date(page.updatedAt),
      priority: 0.7,
      url: `${baseUrl}${basePath}/${page.slug}`,
    };
  });

  return [...staticPages, ...postUrls, ...productUrls, ...serviceUrls, ...landingUrls];
}
