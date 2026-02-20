'use client';

import { APCAcontrast, sRGBtoY } from 'apca-w3';
import { differenceEuclidean, formatHex, oklch } from 'culori';
import type {
  VideoBrandMode,
  VideoHarmony,
  VideoProvider,
  VideoStyle,
} from '../_types';

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

const toRgbTuple = (value: string, fallback: string): [number, number, number] | null => {
  const parsed = safeParseOklch(value, fallback);
  const normalized = formatHex(parsed).replace('#', '');
  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);

  if ([r, g, b].some((channel) => Number.isNaN(channel))) {
    return null;
  }

  return [r, g, b];
};

const getAPCALc = (text: string, background: string) => {
  const textRgb = toRgbTuple(text, '#ffffff');
  const backgroundRgb = toRgbTuple(background, '#0f172a');

  if (!textRgb || !backgroundRgb) {
    return 0;
  }

  const lc = Math.abs(APCAcontrast(sRGBtoY(textRgb), sRGBtoY(backgroundRgb)));
  return Number.isFinite(lc) ? lc : 0;
};

export const getAPCATextColor = (background: string, fontSize = 16, fontWeight = 500) => {
  const whiteLc = getAPCALc('#ffffff', background);
  const blackLc = getAPCALc('#000000', background);
  const threshold = getAPCAThreshold(fontSize, fontWeight);

  if (whiteLc >= threshold) {return '#ffffff';}
  if (blackLc >= threshold) {return '#0f172a';}
  return whiteLc > blackLc ? '#ffffff' : '#0f172a';
};

const ensureAPCATextColor = (
  preferred: string,
  background: string,
  fontSize = 16,
  fontWeight = 500,
) => {
  const threshold = getAPCAThreshold(fontSize, fontWeight);
  const preferredLc = getAPCALc(preferred, background);

  if (preferredLc >= threshold) {
    return preferred;
  }

  return getAPCATextColor(background, fontSize, fontWeight);
};

const getSolidTint = (hex: string, lightnessIncrease = 0.42) => {
  const color = safeParseOklch(hex, DEFAULT_BRAND_COLOR);
  return formatHex(oklch({ ...color, l: clampLightness((color.l ?? 0.6) + lightnessIncrease) }));
};

const withAlpha = (hex: string, alpha: number, fallback = DEFAULT_BRAND_COLOR) => {
  const color = safeParseOklch(hex, fallback);
  const l = clampLightness(color.l ?? 0.6);
  const c = Math.max(0, Math.min(color.c ?? 0.1, 0.4));
  const h = Number.isFinite(color.h) ? color.h : 0;
  const a = Math.max(0, Math.min(alpha, 1));
  return `oklch(${(l * 100).toFixed(2)}% ${c.toFixed(3)} ${h.toFixed(2)} / ${a.toFixed(3)})`;
};

export const normalizeVideoHarmony = (value?: string): VideoHarmony => {
  if (value === 'complementary' || value === 'triadic' || value === 'analogous') {
    return value;
  }

  return 'analogous';
};

export const getHarmonyColor = (primary: string, harmony: VideoHarmony) => {
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
  mode: VideoBrandMode,
  harmony: VideoHarmony,
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

export interface VideoColorTokens {
  primary: string;
  secondary: string;
  heading: string;
  bodyText: string;
  mutedText: string;
  neutralBackground: string;
  neutralSurface: string;
  neutralBorder: string;
  videoSurface: string;
  videoPlaceholder: string;
  sectionOverlay: string;
  sectionOverlayStrong: string;
  badgeBackground: string;
  badgeText: string;
  badgeBorder: string;
  ctaBackground: string;
  ctaText: string;
  ctaBorder: string;
  iconSurface: string;
  iconText: string;
  frameTopBottom: string;
  frameBackground: string;
  parallaxBackdrop: string;
  playButtonBackground: string;
  playButtonText: string;
}

export interface VideoAccessibilityPair {
  background: string;
  text: string;
  fontSize?: number;
  fontWeight?: number;
  label?: string;
}

export interface VideoAccessibilityScore {
  minLc: number;
  failing: Array<VideoAccessibilityPair & { lc: number; threshold: number }>;
}

export interface VideoHarmonyStatus {
  deltaE: number;
  similarity: number;
  isTooSimilar: boolean;
}

export const getHarmonyStatus = (primary: string, secondary: string): VideoHarmonyStatus => {
  const primaryNormalized = normalizeHex(primary, DEFAULT_BRAND_COLOR);
  const secondaryNormalized = normalizeHex(secondary, primaryNormalized);
  const delta = differenceEuclidean('oklch')(primaryNormalized, secondaryNormalized);
  const safeDelta = Number.isFinite(delta) ? delta : 1;
  const deltaE = Math.round(safeDelta * 100);

  return {
    deltaE,
    similarity: 1 - Math.min(safeDelta, 1),
    isTooSimilar: deltaE < 20,
  };
};

export const getVideoAccessibilityScore = (pairs: VideoAccessibilityPair[]): VideoAccessibilityScore => {
  const failing: VideoAccessibilityScore['failing'] = [];
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

export const getVideoColorTokens = ({
  primary,
  secondary,
  mode,
  harmony = 'analogous',
  style,
}: {
  primary: string;
  secondary: string;
  mode: VideoBrandMode;
  harmony?: VideoHarmony;
  style: VideoStyle;
}): VideoColorTokens => {
  const normalizedHarmony = normalizeVideoHarmony(harmony);
  const primaryResolved = normalizeHex(primary, DEFAULT_BRAND_COLOR);
  const secondaryResolved = resolveSecondaryForMode(primaryResolved, secondary, mode, normalizedHarmony);

  const neutralBackground = '#f8fafc';
  const neutralSurface = '#ffffff';
  const neutralBorder = '#e2e8f0';

  const darkFrameBackground = '#0f172a';
  const headingOnNeutral = ensureAPCATextColor(primaryResolved, neutralSurface, 28, 700);
  const bodyOnNeutral = ensureAPCATextColor('#334155', neutralSurface, 16, 500);
  const mutedOnNeutral = ensureAPCATextColor('#64748b', neutralSurface, 14, 500);
  const badgeBackground = getSolidTint(secondaryResolved, 0.42);
  const badgeText = getAPCATextColor(badgeBackground, 12, 700);
  const ctaBackground = primaryResolved;
  const ctaText = getAPCATextColor(ctaBackground, 14, 600);

  const parallaxBackdrop = style === 'parallax'
    ? `linear-gradient(135deg, ${withAlpha(primaryResolved, 0.9, primaryResolved)} 0%, ${withAlpha(secondaryResolved, 0.88, primaryResolved)} 100%)`
    : `linear-gradient(135deg, ${withAlpha(primaryResolved, 0.85, primaryResolved)} 0%, ${withAlpha(primaryResolved, 0.72, primaryResolved)} 100%)`;

  return {
    primary: primaryResolved,
    secondary: secondaryResolved,
    heading: headingOnNeutral,
    bodyText: bodyOnNeutral,
    mutedText: mutedOnNeutral,
    neutralBackground,
    neutralSurface,
    neutralBorder,
    videoSurface: darkFrameBackground,
    videoPlaceholder: getSolidTint(secondaryResolved, 0.44),
    sectionOverlay: withAlpha('#0f172a', 0.5, '#0f172a'),
    sectionOverlayStrong: withAlpha('#0f172a', 0.76, '#0f172a'),
    badgeBackground,
    badgeText,
    badgeBorder: neutralBorder,
    ctaBackground,
    ctaText,
    ctaBorder: neutralBorder,
    iconSurface: neutralSurface,
    iconText: ensureAPCATextColor(primaryResolved, neutralSurface, 16, 700),
    frameTopBottom: getSolidTint(secondaryResolved, 0.3),
    frameBackground: darkFrameBackground,
    parallaxBackdrop,
    playButtonBackground: primaryResolved,
    playButtonText: getAPCATextColor(primaryResolved, 18, 700),
  };
};

export const getVideoValidationResult = ({
  primary,
  secondary,
  mode,
  harmony = 'analogous',
  style,
}: {
  primary: string;
  secondary: string;
  mode: VideoBrandMode;
  harmony?: VideoHarmony;
  style: VideoStyle;
}) => {
  const colors = getVideoColorTokens({
    primary,
    secondary,
    mode,
    harmony,
    style,
  });
  const harmonyStatus = getHarmonyStatus(colors.primary, colors.secondary);

  const accessibilityPairs: VideoAccessibilityPair[] = [
    { background: colors.neutralSurface, text: colors.heading, fontSize: 28, fontWeight: 700, label: 'heading' },
    { background: colors.badgeBackground, text: colors.badgeText, fontSize: 12, fontWeight: 700, label: 'badge' },
    { background: colors.ctaBackground, text: colors.ctaText, fontSize: 14, fontWeight: 600, label: 'button' },
  ];

  const accessibility = getVideoAccessibilityScore(accessibilityPairs);

  return {
    colors,
    harmonyStatus,
    accessibility,
  };
};

const VIDEO_URL_MATCHERS: Array<{ type: VideoProvider; regex: RegExp }> = [
  { type: 'youtube', regex: /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^&?/]+)/ },
  { type: 'vimeo', regex: /vimeo\.com\/(?:video\/)?(\d+)/ },
  { type: 'drive', regex: /drive\.google\.com\/(?:file\/d\/|open\?id=)([^/&?]+)/ },
];

export const getVideoInfo = (url: string): { type: VideoProvider; id?: string } => {
  if (!url) {return { type: 'direct' };}

  for (const matcher of VIDEO_URL_MATCHERS) {
    const match = url.match(matcher.regex);
    if (match) {
      return { type: matcher.type, id: match[1] };
    }
  }

  return { type: 'direct' };
};

export const getYouTubeThumbnail = (videoId: string): string => `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
