import type { MutationCtx, QueryCtx } from "./_generated/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { HOME_COMPONENT_TYPE_VALUES } from "../lib/home-components/componentTypes";

const GROUP_KEY = "home_components";
const HIDDEN_TYPES_KEY = "create_hidden_types";
const OVERRIDES_KEY = "type_color_overrides";
const DEFAULT_BRAND_COLOR = "#3b82f6";
const SUPPORTED_CUSTOM_TYPES = new Set(HOME_COMPONENT_TYPE_VALUES);

const colorMode = v.union(v.literal("single"), v.literal("dual"));
const colorOverrideDoc = v.object({
  enabled: v.boolean(),
  mode: colorMode,
  primary: v.string(),
  secondary: v.string(),
});

const isValidHexColor = (value: string) => /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(value.trim());

const normalizeHiddenTypes = (value: unknown): string[] => {
  if (!Array.isArray(value)) {return [];}
  const result = value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
  return Array.from(new Set(result));
};

const normalizeColorOverride = (value: unknown) => {
  if (!value || typeof value !== "object") {
    return null;
  }
  const record = value as Record<string, unknown>;
  const enabled = Boolean(record.enabled);
  const mode: "single" | "dual" = record.mode === "single" ? "single" : "dual";
  const primary = typeof record.primary === "string" && isValidHexColor(record.primary)
    ? record.primary
    : DEFAULT_BRAND_COLOR;
  let secondary = typeof record.secondary === "string" && isValidHexColor(record.secondary)
    ? record.secondary
    : primary;
  if (mode === "single") {
    secondary = primary;
  }
  return {
    enabled,
    mode,
    primary,
    secondary,
  };
};

const normalizeOverrides = (value: unknown): Record<string, { enabled: boolean; mode: "single" | "dual"; primary: string; secondary: string }> => {
  if (!value || typeof value !== "object") {return {};}
  const result: Record<string, { enabled: boolean; mode: "single" | "dual"; primary: string; secondary: string }> = {};
  const record = value as Record<string, unknown>;
  Object.entries(record).forEach(([key, entry]) => {
    const normalized = normalizeColorOverride(entry);
    if (normalized) {
      result[key] = normalized;
    }
  });
  return result;
};

const getSettingValue = async (ctx: QueryCtx | MutationCtx, key: string) => {
  const setting = await ctx.db
    .query("settings")
    .withIndex("by_key", (q) => q.eq("key", key))
    .unique();
  return setting?.value ?? null;
};

const upsertSetting = async (ctx: MutationCtx, key: string, value: unknown) => {
  const setting = await ctx.db
    .query("settings")
    .withIndex("by_key", (q) => q.eq("key", key))
    .unique();
  if (setting) {
    await ctx.db.patch(setting._id, { group: GROUP_KEY, value });
    return;
  }
  await ctx.db.insert("settings", { group: GROUP_KEY, key, value });
};

export const getConfig = query({
  args: {},
  handler: async (ctx) => {
    const hiddenTypes = normalizeHiddenTypes(await getSettingValue(ctx, HIDDEN_TYPES_KEY));
    const overrides = normalizeOverrides(await getSettingValue(ctx, OVERRIDES_KEY));
    return {
      hiddenTypes,
      typeColorOverrides: overrides,
    };
  },
  returns: v.object({
    hiddenTypes: v.array(v.string()),
    typeColorOverrides: v.record(v.string(), colorOverrideDoc),
  }),
});

export const setCreateVisibility = mutation({
  args: { hiddenTypes: v.array(v.string()) },
  handler: async (ctx, args) => {
    const normalized = normalizeHiddenTypes(args.hiddenTypes);
    await upsertSetting(ctx, HIDDEN_TYPES_KEY, normalized);
    return null;
  },
  returns: v.null(),
});

export const setTypeColorOverride = mutation({
  args: {
    enabled: v.boolean(),
    mode: colorMode,
    primary: v.string(),
    secondary: v.string(),
    type: v.string(),
  },
  handler: async (ctx, args) => {
    if (!SUPPORTED_CUSTOM_TYPES.has(args.type)) {
      return null;
    }

    const overrides = normalizeOverrides(await getSettingValue(ctx, OVERRIDES_KEY));
    const primary = isValidHexColor(args.primary) ? args.primary : DEFAULT_BRAND_COLOR;
    const mode: "single" | "dual" = args.mode === "single" ? "single" : "dual";
    let secondary = isValidHexColor(args.secondary) ? args.secondary : primary;
    if (mode === "single") {
      secondary = primary;
    }

    overrides[args.type] = {
      enabled: args.enabled,
      mode,
      primary,
      secondary,
    };
    await upsertSetting(ctx, OVERRIDES_KEY, overrides);
    return null;
  },
  returns: v.null(),
});

export const bulkSetTypeColorOverride = mutation({
  args: { enabled: v.boolean(), types: v.array(v.string()) },
  handler: async (ctx, args) => {
    const overrides = normalizeOverrides(await getSettingValue(ctx, OVERRIDES_KEY));
    args.types
      .filter((type) => SUPPORTED_CUSTOM_TYPES.has(type))
      .forEach((type) => {
        const current = normalizeColorOverride(overrides[type]) ?? {
          enabled: false,
          mode: "dual" as const,
          primary: DEFAULT_BRAND_COLOR,
          secondary: DEFAULT_BRAND_COLOR,
        };
        overrides[type] = { ...current, enabled: args.enabled };
      });
    await upsertSetting(ctx, OVERRIDES_KEY, overrides);
    return null;
  },
  returns: v.null(),
});
