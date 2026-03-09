/**
 * Internal Linking Engine
 * Tự động lấy related pages theo slug refs và landingType cùng nhóm
 */

import { getConvexClient } from '@/lib/convex';
import { api } from '@/convex/_generated/api';

export type RelatedPageItem = {
  title: string;
  slug: string;
  summary: string;
  href: string;
  type: 'landing' | 'post' | 'product' | 'service';
};

const LANDING_TYPE_ROUTES: Record<string, string> = {
  'feature': '/features',
  'use-case': '/use-cases',
  'solution': '/solutions',
  'compare': '/compare',
  'integration': '/integrations',
  'template': '/templates',
  'guide': '/guides',
};

/**
 * Lấy related landing pages theo relatedSlugs + cùng landingType (max 6)
 */
export const getRelatedLandingPages = async (params: {
  currentSlug: string;
  landingType: string;
  relatedSlugs?: string[];
  limit?: number;
}): Promise<RelatedPageItem[]> => {
  const { currentSlug, landingType, relatedSlugs = [], limit = 6 } = params;
  const client = getConvexClient();
  const basePath = LANDING_TYPE_ROUTES[landingType] || '/features';

  // 1. Lấy explicitly linked pages trước
  const explicitItems: RelatedPageItem[] = [];
  if (relatedSlugs.length > 0) {
    const explicitPages = await Promise.all(
      relatedSlugs.slice(0, limit).map((slug) =>
        client.query(api.landingPages.getBySlug, { slug })
      )
    );
    for (const page of explicitPages) {
      if (page && page.slug !== currentSlug) {
        const pagePath = LANDING_TYPE_ROUTES[page.landingType] || basePath;
        explicitItems.push({
          href: `${pagePath}/${page.slug}`,
          slug: page.slug,
          summary: page.summary,
          title: page.title,
          type: 'landing',
        });
      }
    }
  }

  // 2. Nếu chưa đủ, fill bằng same-type pages
  const remaining = limit - explicitItems.length;
  if (remaining > 0) {
    const sameTypeResult = await client.query(api.landingPages.listPublishedByType, {
      landingType: landingType as any,
      paginationOpts: { cursor: null, numItems: limit + 5 },
    });

    const existingSlugs = new Set([currentSlug, ...explicitItems.map((i) => i.slug)]);
    for (const page of sameTypeResult.page) {
      if (explicitItems.length + (sameTypeResult.page.indexOf(page) + 1) > limit) break;
      if (!existingSlugs.has(page.slug)) {
        existingSlugs.add(page.slug);
        explicitItems.push({
          href: `${basePath}/${page.slug}`,
          slug: page.slug,
          summary: page.summary,
          title: page.title,
          type: 'landing',
        });
        if (explicitItems.length >= limit) break;
      }
    }
  }

  return explicitItems;
};

/**
 * Lấy related posts theo productSlugs + recent posts (for cross-linking)
 */
export const getRelatedPosts = async (params: {
  limit?: number;
}): Promise<RelatedPageItem[]> => {
  const { limit = 3 } = params;
  const client = getConvexClient();

  const result = await client.query(api.posts.listPublished, {
    paginationOpts: { cursor: null, numItems: limit },
  });

  return result.page.map((post) => ({
    href: `/posts/${post.slug}`,
    slug: post.slug,
    summary: post.excerpt || '',
    title: post.title,
    type: 'post' as const,
  }));
};
