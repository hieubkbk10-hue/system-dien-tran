'use client';

import { APCAcontrast, sRGBtoY } from 'apca-w3';
import { differenceEuclidean, formatHex, oklch } from 'culori';
import type {
  VoucherPromotionsBrandMode,
  VoucherPromotionsHarmony,
  VoucherPromotionsStyle,
} from '../_types';

const DEFAULT_BRAND_COLOR = '#3b82f6';
const FALLBACK_TEXT = '#0f172a';
const FALLBACK_SURFACE = '#ffffff';

const clampLightness = (value: number) => Math.min(Math.max(value, 0.08), 0.98);

const getAPCAThreshold = (fontSize = 16, fontWeight = 500) => (
  (fontSize >= 18 || fontWeight >= 700) ? 45 : 60
);

const safeParseOklch = (value: string, fallback: string) => (
  oklch(value) ?? oklch(fallback) ?? oklch(DEFAULT_BRAND_COLOR)
);

const normalizeHex = (value: string, fallback: string) => {
  const candidate = typeof value === 'string' && value.trim() ? value.trim() : fallback;
  return formatHex(safeParseOklch(candidate, fallback));
};

const toRgbTuple = (hexColor: string, fallback: string): [number, number, number] => {
  const parsed = safeParseOklch(hexColor, fallback);
  const normalizedHex = formatHex(parsed).replace('#', '');
  const r = Number.parseInt(normalizedHex.slice(0, 2), 16);
  const g = Number.parseInt(normalizedHex.slice(2, 4), 16);
  const b = Number.parseInt(normalizedHex.slice(4, 6), 16);
  return [r, g, b];
};

const getAPCALc = (text: string, background: string) => {
  const textRgb = toRgbTuple(text, '#ffffff');
  const backgroundRgb = toRgbTuple(background, '#0f172a');
  const lc = Math.abs(APCAcontrast(sRGBtoY(textRgb), sRGBtoY(backgroundRgb)));
  return Number.isFinite(lc) ? lc : 0;
};

export const getAPCATextColor = (background: string, fontSize = 16, fontWeight = 500) => {
  const whiteLc = getAPCALc('#ffffff', background);
  const blackLc = getAPCALc('#000000', background);
  const threshold = getAPCAThreshold(fontSize, fontWeight);

  if (whiteLc >= threshold) {return '#ffffff';}
  if (blackLc >= threshold) {return FALLBACK_TEXT;}
  return whiteLc >= blackLc ? '#ffffff' : FALLBACK_TEXT;
};

const ensureAPCATextColor = (
  preferredText: string,
  background: string,
  fontSize = 16,
  fontWeight = 500,
) => {
  const threshold = getAPCAThreshold(fontSize, fontWeight);
  const preferredLc = getAPCALc(preferredText, background);
  if (preferredLc >= threshold) {
    return preferredText;
  }
  return getAPCATextColor(background, fontSize, fontWeight);
};

const getHarmonyColor = (primary: string, harmony: VoucherPromotionsHarmony) => {
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
  mode: VoucherPromotionsBrandMode,
  harmony: VoucherPromotionsHarmony = 'analogous',
) => {
  const primaryNormalized = normalizeHex(primary, DEFAULT_BRAND_COLOR);

  if (mode === 'single') {
    return primaryNormalized;
  }

  if (typeof secondary === 'string' && secondary.trim()) {
    return normalizeHex(secondary, primaryNormalized);
  }

  return getHarmonyColor(primaryNormalized, harmony);
};

const withAlpha = (hex: string, alpha: number, fallback = DEFAULT_BRAND_COLOR) => {
  const color = safeParseOklch(hex, fallback);
  const l = clampLightness(color.l ?? 0.6);
  const c = Math.max(0, Math.min(color.c ?? 0.1, 0.4));
  const h = Number.isFinite(color.h) ? color.h : 0;
  const a = Math.max(0, Math.min(alpha, 1));
  return `oklch(${(l * 100).toFixed(2)}% ${c.toFixed(3)} ${h.toFixed(2)} / ${a.toFixed(3)})`;
};

export interface VoucherPromotionsColorTokens {
  primary: string;
  secondary: string;
  sectionBg: string;
  cardBg: string;
  cardBorder: string;
  neutralBorder: string;
  bodyText: string;
  mutedText: string;
  heading: string;
  description: string;
  ctaText: string;
  ctaBg: string;
  ctaBgHover: string;
  ctaOutlineText: string;
  ctaOutlineBorder: string;
  ctaOutlineBg: string;
  ticketStripeBg: string;
  ticketCodeText: string;
  badgeBg: string;
  badgeText: string;
  accentLine: string;
  accentSoft: string;
  carouselRing: string;
  carouselDotActive: string;
  carouselDotInactive: string;
  copyButtonBg: string;
  copyButtonText: string;
  copyButtonBorder: string;
  copyButtonGhostText: string;
  copyButtonGhostBg: string;
  sectionAccentByStyle: Record<VoucherPromotionsStyle, string>;
}

export interface VoucherPromotionsAccessibilityPair {
  background: string;
  text: string;
  fontSize?: number;
  fontWeight?: number;
  label?: string;
}

export interface VoucherPromotionsAccessibilityScore {
  minLc: number;
  failing: Array<VoucherPromotionsAccessibilityPair & { lc: number; threshold: number }>;
}

export interface VoucherPromotionsHarmonyStatus {
  deltaE: number;
  similarity: number;
  isTooSimilar: boolean;
}

export const getHarmonyStatus = (primary: string, secondary: string): VoucherPromotionsHarmonyStatus => {
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

export const getVoucherPromotionsAccessibilityScore = (
  pairs: VoucherPromotionsAccessibilityPair[],
): VoucherPromotionsAccessibilityScore => {
  const failing: VoucherPromotionsAccessibilityScore['failing'] = [];
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

export const getVoucherPromotionsColorTokens = ({
  primary,
  secondary,
  mode,
  harmony = 'analogous',
}: {
  primary: string;
  secondary: string;
  mode: VoucherPromotionsBrandMode;
  harmony?: VoucherPromotionsHarmony;
}): VoucherPromotionsColorTokens => {
  const primaryNormalized = normalizeHex(primary, DEFAULT_BRAND_COLOR);
  const secondaryResolved = resolveSecondaryForMode(primaryNormalized, secondary, mode, harmony);

  const sectionBg = FALLBACK_SURFACE;
  const cardBg = FALLBACK_SURFACE;
  const cardBorder = '#e2e8f0';
  const neutralBorder = '#e2e8f0';
  const bodyText = '#0f172a';
  const mutedText = '#64748b';

  const heading = ensureAPCATextColor(primaryNormalized, sectionBg, 30, 700);
  const description = ensureAPCATextColor(mutedText, sectionBg, 16, 500);

  const ctaBg = primaryNormalized;
  const primaryOklch = safeParseOklch(primaryNormalized, DEFAULT_BRAND_COLOR);
  const ctaBgHover = formatHex(oklch({ ...primaryOklch, l: clampLightness((primaryOklch.l ?? 0.62) - 0.06) }));

  const copyButtonBg = secondaryResolved;
  const copyButtonText = getAPCATextColor(copyButtonBg, 12, 700);

  return {
    primary: primaryNormalized,
    secondary: secondaryResolved,
    sectionBg,
    cardBg,
    cardBorder,
    neutralBorder,
    bodyText,
    mutedText,
    heading,
    description,
    ctaText: getAPCATextColor(ctaBg, 14, 700),
    ctaBg,
    ctaBgHover,
    ctaOutlineText: ensureAPCATextColor(primaryNormalized, sectionBg, 14, 700),
    ctaOutlineBorder: withAlpha(primaryNormalized, 0.28, primaryNormalized),
    ctaOutlineBg: withAlpha(primaryNormalized, 0.08, primaryNormalized),
    ticketStripeBg: '#0f172a',
    ticketCodeText: '#ffffff',
    badgeBg: withAlpha(secondaryResolved, 0.14, primaryNormalized),
    badgeText: ensureAPCATextColor(secondaryResolved, sectionBg, 12, 700),
    accentLine: secondaryResolved,
    accentSoft: withAlpha(secondaryResolved, 0.16, primaryNormalized),
    carouselRing: withAlpha(secondaryResolved, 0.45, primaryNormalized),
    carouselDotActive: secondaryResolved,
    carouselDotInactive: withAlpha(secondaryResolved, 0.35, primaryNormalized),
    copyButtonBg,
    copyButtonText,
    copyButtonBorder: withAlpha(secondaryResolved, 0.32, primaryNormalized),
    copyButtonGhostText: ensureAPCATextColor(secondaryResolved, sectionBg, 14, 700),
    copyButtonGhostBg: withAlpha(secondaryResolved, 0.1, primaryNormalized),
    sectionAccentByStyle: {
      enterpriseCards: primaryNormalized,
      ticketHorizontal: secondaryResolved,
      couponGrid: secondaryResolved,
      stackedBanner: secondaryResolved,
      carousel: primaryNormalized,
      minimal: secondaryResolved,
    },
  };
};

export const getVoucherPromotionsValidationResult = ({
  primary,
  secondary,
  mode,
  harmony = 'analogous',
}: {
  primary: string;
  secondary: string;
  mode: VoucherPromotionsBrandMode;
  harmony?: VoucherPromotionsHarmony;
}) => {
  const tokens = getVoucherPromotionsColorTokens({ primary, secondary, mode, harmony });
  const resolvedSecondary = resolveSecondaryForMode(primary, secondary, mode, harmony);

  const harmonyStatus = mode === 'single'
    ? { deltaE: 100, similarity: 0, isTooSimilar: false }
    : getHarmonyStatus(tokens.primary, resolvedSecondary);

  const accessibility = getVoucherPromotionsAccessibilityScore([
    { background: tokens.sectionBg, text: tokens.heading, fontSize: 30, fontWeight: 700, label: 'heading' },
    { background: tokens.sectionBg, text: tokens.description, fontSize: 16, fontWeight: 500, label: 'description' },
    { background: tokens.copyButtonBg, text: tokens.copyButtonText, fontSize: 12, fontWeight: 700, label: 'copyButton' },
    { background: tokens.ctaBg, text: tokens.ctaText, fontSize: 14, fontWeight: 700, label: 'cta' },
    { background: tokens.badgeBg, text: tokens.badgeText, fontSize: 12, fontWeight: 700, label: 'badge' },
    { background: tokens.sectionBg, text: tokens.ctaOutlineText, fontSize: 14, fontWeight: 700, label: 'ctaOutline' },
  ]);

  return {
    tokens,
    resolvedSecondary,
    harmonyStatus,
    accessibility,
  };
};
