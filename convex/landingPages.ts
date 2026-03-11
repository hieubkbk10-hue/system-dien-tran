import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { buildProgrammaticLandingPlan } from "../lib/seo/programmatic-landing";

const landingPageDoc = v.object({
  _creationTime: v.number(),
  _id: v.id("landingPages"),
  slug: v.string(),
  title: v.string(),
  summary: v.string(),
  content: v.optional(v.string()),
  heroImage: v.optional(v.string()),
  status: v.union(v.literal("draft"), v.literal("published")),
  landingType: v.union(
    v.literal("feature"),
    v.literal("use-case"),
    v.literal("solution"),
    v.literal("compare"),
    v.literal("integration"),
    v.literal("template"),
    v.literal("guide")
  ),
  primaryIntent: v.optional(v.string()),
  faqItems: v.optional(v.array(v.object({
    question: v.string(),
    answer: v.string(),
  }))),
  relatedSlugs: v.optional(v.array(v.string())),
  relatedProductSlugs: v.optional(v.array(v.string())),
  relatedServiceSlugs: v.optional(v.array(v.string())),
  updatedAt: v.number(),
  publishedAt: v.optional(v.number()),
  order: v.optional(v.number()),
});

const paginatedLandingPages = v.object({
  continueCursor: v.string(),
  isDone: v.boolean(),
  page: v.array(landingPageDoc),
  pageStatus: v.optional(v.union(v.literal("SplitRecommended"), v.literal("SplitRequired"), v.null())),
  splitCursor: v.optional(v.union(v.string(), v.null())),
});

const getSettingValue = async (ctx: { db: any }, key: string): Promise<string | undefined> => {
  const setting = await ctx.db
    .query("settings")
    .withIndex("by_key", (q: any) => q.eq("key", key))
    .unique();
  return setting?.value as string | undefined;
};

const resolveProgrammaticStatus = (params: {
  content: string;
  existingStatus?: "draft" | "published";
}): "draft" | "published" => {
  if (params.existingStatus === "published") {
    return "published";
  }
  return "draft";
};

// Public: list published by type
export const listPublishedByType = query({
  args: {
    landingType: v.union(
      v.literal("feature"),
      v.literal("use-case"),
      v.literal("solution"),
      v.literal("compare"),
      v.literal("integration"),
      v.literal("template"),
      v.literal("guide")
    ),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    return ctx.db
      .query("landingPages")
      .withIndex("by_type_status", (q) => q.eq("landingType", args.landingType).eq("status", "published"))
      .order("desc")
      .paginate(args.paginationOpts);
  },
  returns: paginatedLandingPages,
});

// Public: get by slug
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return ctx.db
      .query("landingPages")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .filter((q) => q.eq(q.field("status"), "published"))
      .first();
  },
  returns: v.union(landingPageDoc, v.null()),
});

// Public: list all published (for sitemap)
export const listAllPublished = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    return ctx.db
      .query("landingPages")
      .withIndex("by_status_updatedAt", (q) => q.eq("status", "published"))
      .order("desc")
      .paginate(args.paginationOpts);
  },
  returns: paginatedLandingPages,
});

// Admin: list all
export const listAll = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    return ctx.db
      .query("landingPages")
      .order("desc")
      .paginate(args.paginationOpts);
  },
  returns: paginatedLandingPages,
});

// Admin: get by id
export const getById = query({
  args: { id: v.id("landingPages") },
  handler: async (ctx, args) => {
    return ctx.db.get(args.id);
  },
  returns: v.union(landingPageDoc, v.null()),
});

// Admin: create
export const create = mutation({
  args: {
    slug: v.string(),
    title: v.string(),
    summary: v.string(),
    content: v.optional(v.string()),
    heroImage: v.optional(v.string()),
    landingType: v.union(
      v.literal("feature"),
      v.literal("use-case"),
      v.literal("solution"),
      v.literal("compare"),
      v.literal("integration"),
      v.literal("template"),
      v.literal("guide")
    ),
    primaryIntent: v.optional(v.string()),
    faqItems: v.optional(v.array(v.object({
      question: v.string(),
      answer: v.string(),
    }))),
    relatedSlugs: v.optional(v.array(v.string())),
    relatedProductSlugs: v.optional(v.array(v.string())),
    relatedServiceSlugs: v.optional(v.array(v.string())),
    status: v.optional(v.union(v.literal("draft"), v.literal("published"))),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return ctx.db.insert("landingPages", {
      ...args,
      status: args.status ?? "draft",
      updatedAt: now,
      publishedAt: args.status === "published" ? now : undefined,
    });
  },
  returns: v.id("landingPages"),
});

// Admin: update
export const update = mutation({
  args: {
    id: v.id("landingPages"),
    slug: v.optional(v.string()),
    title: v.optional(v.string()),
    summary: v.optional(v.string()),
    content: v.optional(v.string()),
    heroImage: v.optional(v.string()),
    landingType: v.optional(v.union(
      v.literal("feature"),
      v.literal("use-case"),
      v.literal("solution"),
      v.literal("compare"),
      v.literal("integration"),
      v.literal("template"),
      v.literal("guide")
    )),
    primaryIntent: v.optional(v.string()),
    faqItems: v.optional(v.array(v.object({
      question: v.string(),
      answer: v.string(),
    }))),
    relatedSlugs: v.optional(v.array(v.string())),
    relatedProductSlugs: v.optional(v.array(v.string())),
    relatedServiceSlugs: v.optional(v.array(v.string())),
    status: v.optional(v.union(v.literal("draft"), v.literal("published"))),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const existing = await ctx.db.get(id);
    if (!existing) {
      throw new Error("Landing page not found");
    }

    const now = Date.now();
    const publishedAt =
      updates.status === "published" && existing.status !== "published"
        ? now
        : existing.publishedAt;

    await ctx.db.patch(id, {
      ...updates,
      updatedAt: now,
      publishedAt,
    });

    return id;
  },
  returns: v.id("landingPages"),
});

// Admin: delete
export const remove = mutation({
  args: { id: v.id("landingPages") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
  returns: v.null(),
});

export const previewProgrammaticPlan = mutation({
  args: {},
  handler: async (ctx) => {
    const [siteName, modules, productsResult, servicesResult, postsResult, homeComponentsResult] = await Promise.all([
      getSettingValue(ctx, "site_name"),
      ctx.db.query("adminModules").withIndex("by_enabled_order", (q) => q.eq("enabled", true)).collect(),
      ctx.db
        .query("products")
        .withIndex("by_status_order", (q) => q.eq("status", "Active"))
        .order("desc")
        .paginate({ cursor: null, numItems: 6 }),
      ctx.db
        .query("services")
        .withIndex("by_status_publishedAt", (q) => q.eq("status", "Published"))
        .order("desc")
        .paginate({ cursor: null, numItems: 6 }),
      ctx.db
        .query("posts")
        .withIndex("by_status_publishedAt", (q) => q.eq("status", "Published"))
        .order("desc")
        .paginate({ cursor: null, numItems: 6 }),
      ctx.db
        .query("homeComponents")
        .withIndex("by_active_order", (q) => q.eq("active", true))
        .order("desc")
        .paginate({ cursor: null, numItems: 6 }),
    ]);

    const plan = buildProgrammaticLandingPlan({
      homeComponents: homeComponentsResult.page.map((item) => ({
        title: item.title,
        type: item.type,
      })),
      modules: modules.map((moduleItem) => ({
        category: moduleItem.category,
        description: moduleItem.description,
        key: moduleItem.key,
        name: moduleItem.name,
      })),
      posts: postsResult.page.map((post) => ({ slug: post.slug, title: post.title })),
      products: productsResult.page.map((product) => ({ name: product.name, slug: product.slug })),
      services: servicesResult.page.map((service) => ({ slug: service.slug, title: service.title })),
      siteName: siteName ?? "Website",
    });

    const existing = await ctx.db.query("landingPages").collect();
    const existingBySlug = new Map(existing.map((page) => [page.slug, page]));

    const byType: Record<string, number> = {};
    let createCount = 0;
    let updateCount = 0;
    let draftCount = 0;
    let publishedCount = 0;

    for (const item of plan.items) {
      byType[item.landingType] = (byType[item.landingType] ?? 0) + 1;
      const existingItem = existingBySlug.get(item.slug);
      if (existingItem) {
        updateCount += 1;
      } else {
        createCount += 1;
      }
      const status = resolveProgrammaticStatus({
        content: item.content,
        existingStatus: existingItem?.status,
      });
      if (status === "published") {
        publishedCount += 1;
      } else {
        draftCount += 1;
      }
    }

    return {
      byType,
      createCount,
      draftCount,
      publishedCount,
      total: plan.items.length,
      updateCount,
    };
  },
  returns: v.object({
    byType: v.record(v.string(), v.number()),
    createCount: v.number(),
    draftCount: v.number(),
    publishedCount: v.number(),
    total: v.number(),
    updateCount: v.number(),
  }),
});

export const upsertProgrammaticFromModules = mutation({
  args: {},
  handler: async (ctx) => {
    const [siteName, modules, productsResult, servicesResult, postsResult, homeComponentsResult] = await Promise.all([
      getSettingValue(ctx, "site_name"),
      ctx.db.query("adminModules").withIndex("by_enabled_order", (q) => q.eq("enabled", true)).collect(),
      ctx.db
        .query("products")
        .withIndex("by_status_order", (q) => q.eq("status", "Active"))
        .order("desc")
        .paginate({ cursor: null, numItems: 6 }),
      ctx.db
        .query("services")
        .withIndex("by_status_publishedAt", (q) => q.eq("status", "Published"))
        .order("desc")
        .paginate({ cursor: null, numItems: 6 }),
      ctx.db
        .query("posts")
        .withIndex("by_status_publishedAt", (q) => q.eq("status", "Published"))
        .order("desc")
        .paginate({ cursor: null, numItems: 6 }),
      ctx.db
        .query("homeComponents")
        .withIndex("by_active_order", (q) => q.eq("active", true))
        .order("desc")
        .paginate({ cursor: null, numItems: 6 }),
    ]);

    const plan = buildProgrammaticLandingPlan({
      homeComponents: homeComponentsResult.page.map((item) => ({
        title: item.title,
        type: item.type,
      })),
      modules: modules.map((moduleItem) => ({
        category: moduleItem.category,
        description: moduleItem.description,
        key: moduleItem.key,
        name: moduleItem.name,
      })),
      posts: postsResult.page.map((post) => ({ slug: post.slug, title: post.title })),
      products: productsResult.page.map((product) => ({ name: product.name, slug: product.slug })),
      services: servicesResult.page.map((service) => ({ slug: service.slug, title: service.title })),
      siteName: siteName ?? "Website",
    });

    const existing = await ctx.db.query("landingPages").collect();
    const existingBySlug = new Map(existing.map((page) => [page.slug, page]));
    const now = Date.now();

    let created = 0;
    let updated = 0;
    let draftCount = 0;
    let publishedCount = 0;

    for (const item of plan.items) {
      const existingItem = existingBySlug.get(item.slug);
      const status = resolveProgrammaticStatus({
        content: item.content,
        existingStatus: existingItem?.status,
      });

      if (status === "published") {
        publishedCount += 1;
      } else {
        draftCount += 1;
      }

      if (existingItem) {
        const publishedAt =
          status === "published" && existingItem.status !== "published"
            ? now
            : existingItem.publishedAt;
        await ctx.db.patch(existingItem._id, {
          content: item.content,
          faqItems: item.faqItems,
          landingType: item.landingType,
          order: item.order,
          primaryIntent: item.primaryIntent,
          relatedProductSlugs: item.relatedProductSlugs,
          relatedServiceSlugs: item.relatedServiceSlugs,
          relatedSlugs: item.relatedSlugs,
          slug: item.slug,
          status,
          summary: item.summary,
          title: item.title,
          updatedAt: now,
          publishedAt,
        });
        updated += 1;
      } else {
        await ctx.db.insert("landingPages", {
          content: item.content,
          faqItems: item.faqItems,
          landingType: item.landingType,
          order: item.order,
          primaryIntent: item.primaryIntent,
          relatedProductSlugs: item.relatedProductSlugs,
          relatedServiceSlugs: item.relatedServiceSlugs,
          relatedSlugs: item.relatedSlugs,
          slug: item.slug,
          status: "draft",
          summary: item.summary,
          title: item.title,
          updatedAt: now,
          publishedAt: undefined,
        });
        created += 1;
      }
    }

    return {
      created,
      draftCount,
      publishedCount,
      total: plan.items.length,
      updated,
    };
  },
  returns: v.object({
    created: v.number(),
    draftCount: v.number(),
    publishedCount: v.number(),
    total: v.number(),
    updated: v.number(),
  }),
});
