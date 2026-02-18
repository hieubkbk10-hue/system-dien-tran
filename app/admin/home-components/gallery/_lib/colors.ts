'use client';

import { APCAcontrast } from 'apca-w3';
import { differenceEuclidean, formatHex, oklch } from 'culori';
import type { GalleryStyle } from '../_types';

export type GalleryBrandMode = 'single' | 'dual';
export type GalleryHarmony = 'analogous' | 'complementary' | 'triadic';

export interface GalleryColorTokens {
  primary: string;
  secondary: string;
  heading: string;
  subheading: string;
  bodyText: string;
  mutedText: string;
  neutralBackground: string;
  neutralSurface: string;
  neutralBorder: string;
  iconBg: string;
  iconColor: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  accentSurface: string;
  accentBorder: string;
  sectionAccentBar: string;
  sectionAccentBarByStyle: Record<GalleryStyle, string>;
  cardHoverBorder: string;
  placeholderBg: string;
  placeholderIcon: string;
  lightboxBg: string;
  lightboxText: string;
  lightboxControlBg: string;
  lightboxControlIcon: string;
  lightboxControlBorder: string;
  lightboxCounterBg: string;
  lightboxCounterText: string;
}

export interface GalleryAccessibilityPair {
  background: string;
  text: string;
  fontSize?: number;
  fontWeight?: number;
  label?: string;
}

export interface GalleryAccessibilityScore {
  minLc: number;
  failing: Array<GalleryAccessibilityPair & { lc: number; threshold: number }>;
}

export interface GalleryHarmonyStatus {
  deltaE: number;
  similarity: number;
  isTooSimilar: boolean;
}

export interface GalleryAutoHealInfo {
  didAutoHealHarmony: boolean;
  didAutoHealText: boolean;
  isStillSimilar: boolean;
  resolvedSecondary: string;
  harmonyUsed: GalleryHarmony;
}

const DEFAULT_BRAND_COLOR = '#3b82f6';

const clampLightness = (value: number) => Math.min(Math.max(value, 0.08), 0.98);

const safeParseOklch = (value: string, fallback: string) => (
  oklch(value) ?? oklch(fallback) ?? oklch(DEFAULT_BRAND_COLOR)
);

const normalizeHex = (value: string, fallback: string) => {
  const candidate = value.trim().length > 0 ? value.trim() : fallback;
  return formatHex(safeParseOklch(candidate, fallback));
};

const isValidHexColor = (value: string) => /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(value.trim());

const getAPCAThreshold = (fontSize = 16, fontWeight = 500) => (
  (fontSize >= 18 || fontWeight >= 700) ? 45 : 60
);

const getAPCALc = (text: string, background: string) => {
  const lc = Math.abs(APCAcontrast(text, background));
  return Number.isFinite(lc) ? lc : 0;
};

export const getAPCATextColor = (bg: string, fontSize = 16, fontWeight = 500) => {
  const whiteLc = getAPCALc('#ffffff', bg);
  const blackLc = getAPCALc('#000000', bg);
  const threshold = getAPCAThreshold(fontSize, fontWeight);

  if (whiteLc >= threshold) {return '#ffffff';}
  if (blackLc >= threshold) {return '#0f172a';}
  return whiteLc > blackLc ? '#ffffff' : '#0f172a';
};

const getSolidTint = (hex: string, lightnessIncrease = 0.42) => {
  const color = safeParseOklch(hex, DEFAULT_BRAND_COLOR);
  return formatHex(oklch({ ...color, l: clampLightness((color.l ?? 0.6) + lightnessIncrease) }));
};

const ensureAPCATextColor = (
  preferred: string,
  background: string,
  fontSize = 16,
  fontWeight = 500,
) => {
  void background;
  void fontSize;
  void fontWeight;
  return preferred;
};

export const normalizeGalleryHarmony = (value?: string): GalleryHarmony => {
  if (value === 'complementary' || value === 'triadic' || value === 'analogous') {
    return value;
  }
  return 'analogous';
};

export const getHarmonyColor = (primary: string, harmony: GalleryHarmony) => {
  const color = safeParseOklch(primary, DEFAULT_BRAND_COLOR);
  if (harmony === 'complementary') {
    return formatHex(oklch({ ...color, h: ((color.h ?? 0) + 180) % 360 }));
  }
  if (harmony === 'triadic') {
    return formatHex(oklch({ ...color, h: ((color.h ?? 0) + 120) % 360 }));
  }
  return formatHex(oklch({ ...color, h: ((color.h ?? 0) + 30) % 360 }));
};

export const resolveSecondaryForMode = (
  primary: string,
  secondary: string,
  mode: GalleryBrandMode,
  harmony: GalleryHarmony,
) => {
  const normalizedPrimary = normalizeHex(primary, DEFAULT_BRAND_COLOR);

  if (mode === 'single') {
    return normalizedPrimary;
  }

  if (isValidHexColor(secondary)) {
    return normalizeHex(secondary, normalizedPrimary);
  }

  return getHarmonyColor(normalizedPrimary, harmony);
};

const buildHarmonyFallbackOrder = (harmony: GalleryHarmony): GalleryHarmony[] => {
  const order: GalleryHarmony[] = [harmony, 'complementary', 'triadic', 'analogous'];
  return Array.from(new Set(order));
};

const resolveSecondaryWithHarmonyFallback = (
  primary: string,
  secondary: string,
  mode: GalleryBrandMode,
  harmony: GalleryHarmony,
): GalleryAutoHealInfo => {
  const normalizedPrimary = normalizeHex(primary, DEFAULT_BRAND_COLOR);
  const harmonyResolved = normalizeGalleryHarmony(harmony);

  if (mode === 'single') {
    return {
      didAutoHealHarmony: false,
      didAutoHealText: false,
      isStillSimilar: false,
      resolvedSecondary: normalizedPrimary,
      harmonyUsed: harmonyResolved,
    };
  }

  const initialSecondary = isValidHexColor(secondary)
    ? normalizeHex(secondary, normalizedPrimary)
    : getHarmonyColor(normalizedPrimary, harmonyResolved);
  const initialStatus = getHarmonyStatus(normalizedPrimary, initialSecondary);

  if (!initialStatus.isTooSimilar) {
    return {
      didAutoHealHarmony: false,
      didAutoHealText: false,
      isStillSimilar: false,
      resolvedSecondary: initialSecondary,
      harmonyUsed: harmonyResolved,
    };
  }

  let fallbackSecondary = initialSecondary;
  let fallbackHarmony = harmonyResolved;
  for (const scheme of buildHarmonyFallbackOrder(harmonyResolved)) {
    const candidate = getHarmonyColor(normalizedPrimary, scheme);
    const status = getHarmonyStatus(normalizedPrimary, candidate);
    fallbackSecondary = candidate;
    fallbackHarmony = scheme;
    if (!status.isTooSimilar) {
      return {
        didAutoHealHarmony: true,
        didAutoHealText: false,
        isStillSimilar: false,
        resolvedSecondary: candidate,
        harmonyUsed: scheme,
      };
    }
  }

  return {
    didAutoHealHarmony: true,
    didAutoHealText: false,
    isStillSimilar: true,
    resolvedSecondary: fallbackSecondary,
    harmonyUsed: fallbackHarmony,
  };
};

const autoFixTextTokensForAPCA = (tokens: GalleryColorTokens, mode: GalleryBrandMode) => {
  const heading = ensureAPCATextColor(tokens.primary, tokens.neutralSurface, 24, 700);
  const subheading = ensureAPCATextColor(tokens.secondary, tokens.neutralSurface, 18, 600);
  const badgeText = getAPCATextColor(tokens.badgeBg, 12, 600);
  const lightboxText = getAPCATextColor(tokens.lightboxBg, 16, 500);
  const didAutoHealText = (
    heading !== tokens.heading ||
    (mode === 'dual' && subheading !== tokens.subheading) ||
    badgeText !== tokens.badgeText ||
    lightboxText !== tokens.lightboxText
  );

  return {
    didAutoHealText,
    tokens: {
      ...tokens,
      heading,
      subheading,
      badgeText,
      lightboxText,
    },
  };
};

export const getHarmonyStatus = (primary: string, secondary: string): GalleryHarmonyStatus => {
  const primaryNormalized = normalizeHex(primary, DEFAULT_BRAND_COLOR);
  const secondaryNormalized = normalizeHex(secondary, primaryNormalized);
  const delta = differenceEuclidean('oklch')(primaryNormalized, secondaryNormalized);
  const safeDelta = Number.isFinite(delta) ? delta : 1;
  const similarity = 1 - Math.min(safeDelta, 1);
  const deltaE = Math.round(safeDelta * 100);
  return {
    deltaE,
    similarity,
    isTooSimilar: deltaE < 20,
  };
};

export const getGalleryAccessibilityScore = (pairs: GalleryAccessibilityPair[]): GalleryAccessibilityScore => {
  const failing: GalleryAccessibilityScore['failing'] = [];
  let minLc = Number.POSITIVE_INFINITY;

  pairs.forEach((pair) => {
    const fontSize = pair.fontSize ?? 16;
    const fontWeight = pair.fontWeight ?? 500;
    const threshold = getAPCAThreshold(fontSize, fontWeight);
    const lc = getAPCALc(pair.text, pair.background);
    minLc = Math.min(minLc, lc);

    if (lc < threshold) {
      failing.push({ ...pair, lc, threshold });
    }
  });

  return {
    minLc: Number.isFinite(minLc) ? minLc : 0,
    failing,
  };
};

export const getGalleryColorTokensWithMeta = ({
  primary,
  secondary,
  mode,
  harmony = 'analogous',
}: {
  primary: string;
  secondary: string;
  mode: GalleryBrandMode;
  harmony?: GalleryHarmony;
}): { tokens: GalleryColorTokens; autoHeal: GalleryAutoHealInfo } => {
  const primaryResolved = normalizeHex(primary, DEFAULT_BRAND_COLOR);
  const autoHeal = resolveSecondaryWithHarmonyFallback(primaryResolved, secondary, mode, harmony);
  const secondaryResolved = autoHeal.resolvedSecondary;
  const neutralBackground = '#f8fafc';
  const neutralSurface = '#ffffff';
  const neutralBorder = '#e2e8f0';
  const neutralText = '#0f172a';
  const neutralMuted = '#64748b';

  const primaryTint = getSolidTint(primaryResolved, 0.42);
  const secondaryTint = getSolidTint(secondaryResolved, 0.42);
  const accentSurface = getSolidTint(secondaryResolved, 0.5);
  const accentBorder = neutralBorder;
  const sectionAccentBar = primaryResolved;
  const cardHoverBorder = secondaryResolved;
  const sectionAccentBarByStyle: Record<GalleryStyle, string> = {
    spotlight: primaryResolved,
    explore: secondaryResolved,
    stories: primaryResolved,
    grid: secondaryResolved,
    marquee: primaryResolved,
    masonry: secondaryResolved,
  };
  const lightboxControlBg = '#111827';
  const lightboxControlBorder = secondaryResolved;
  const lightboxControlIcon = ensureAPCATextColor(primaryResolved, lightboxControlBg, 16, 600);
  const lightboxCounterBg = '#111827';
  const lightboxCounterText = getAPCATextColor(lightboxCounterBg, 12, 500);

  const tokens = {
    primary: primaryResolved,
    secondary: secondaryResolved,
    heading: ensureAPCATextColor(primaryResolved, neutralSurface, 24, 700),
    subheading: ensureAPCATextColor(secondaryResolved, neutralSurface, 18, 600),
    bodyText: neutralText,
    mutedText: neutralMuted,
    neutralBackground,
    neutralSurface,
    neutralBorder,
    iconBg: neutralSurface,
    iconColor: primaryResolved,
    badgeBg: secondaryTint,
    badgeText: getAPCATextColor(secondaryTint, 12, 600),
    badgeBorder: accentBorder,
    accentSurface,
    accentBorder,
    sectionAccentBar,
    sectionAccentBarByStyle,
    cardHoverBorder,
    placeholderBg: neutralBackground,
    placeholderIcon: primaryResolved,
    lightboxBg: '#0f172a',
    lightboxText: '#f8fafc',
    lightboxControlBg,
    lightboxControlIcon,
    lightboxControlBorder,
    lightboxCounterBg,
    lightboxCounterText,
  };

  const autoFix = autoFixTextTokensForAPCA(tokens, mode);
  return {
    tokens: autoFix.tokens,
    autoHeal: {
      ...autoHeal,
      didAutoHealText: autoFix.didAutoHealText,
    },
  };
};

export const getGalleryColorTokens = (input: {
  primary: string;
  secondary: string;
  mode: GalleryBrandMode;
  harmony?: GalleryHarmony;
}): GalleryColorTokens => getGalleryColorTokensWithMeta(input).tokens;

export const getGalleryPersistSafeColors = (input: {
  primary: string;
  secondary: string;
  mode: GalleryBrandMode;
  harmony?: GalleryHarmony;
}) => getGalleryColorTokensWithMeta(input);

export const getGalleryValidationResult = ({
  primary,
  secondary,
  mode,
  harmony = 'analogous',
}: {
  primary: string;
  secondary: string;
  mode: GalleryBrandMode;
  harmony?: GalleryHarmony;
}) => {
  const { tokens, autoHeal } = getGalleryColorTokensWithMeta({ primary, secondary, mode, harmony });
  const harmonyStatus = getHarmonyStatus(tokens.primary, autoHeal.resolvedSecondary);
  const accessibilityPairs: GalleryAccessibilityPair[] = [
    { background: tokens.neutralSurface, text: tokens.heading, fontSize: 24, fontWeight: 700, label: 'heading' },
    ...(mode === 'dual'
      ? [{ background: tokens.neutralSurface, text: tokens.subheading, fontSize: 18, fontWeight: 600, label: 'subheading' }]
      : []),
    { background: tokens.badgeBg, text: tokens.badgeText, fontSize: 12, fontWeight: 600, label: 'badge' },
  ];
  const accessibility = getGalleryAccessibilityScore(accessibilityPairs);

  return {
    tokens,
    resolvedSecondary: autoHeal.resolvedSecondary,
    harmonyStatus,
    accessibility,
    autoHeal,
  };
};
