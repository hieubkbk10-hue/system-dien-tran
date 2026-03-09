import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";

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
