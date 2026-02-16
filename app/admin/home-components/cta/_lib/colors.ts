'use client';

import { APCAcontrast, sRGBtoY } from 'apca-w3';
import { differenceEuclidean, formatHex, oklch } from 'culori';
import type { CTAHarmony, CTAStyle } from '../_types';

type BrandMode = 'single' | 'dual';

interface Palette {
  solid: string;
  surface: string;
  hover: string;
  active: string;
  border: string;
  disabled: string;
  textOnSolid: string;
  textInteractive: string;
}

export interface CTAStyleTokens {
  sectionBg: string;
  sectionBorder?: string;
  title: string;
  description: string;
  badgeBg: string;
  badgeText: string;
  primaryButtonBg: string;
  primaryButtonText: string;
  primaryButtonBorder?: string;
  secondaryButtonBg?: string;
  secondaryButtonText: string;
  secondaryButtonBorder: string;
  cardBg?: string;
  cardBorder?: string;
  cardShadow?: string;
  accentLine?: string;
}

export interface CTAAccessibilityPair {
  background: string;
  text: string;
  fontSize?: number;
  fontWeight?: number;
  label?: string;
}

export interface CTAAccessibilityScore {
  minLc: number;
  failing: Array<CTAAccessibilityPair & { lc: number; threshold: number }>;
}

export interface CTAHarmonyStatus {
  deltaE: number;
  similarity: number;
  isTooSimilar: boolean;
}

export interface CTAAccentBalance {
  primary: number;
  secondary: number;
  neutral: number;
  warnings: string[];
}

const clampLightness = (value: number) => Math.min(Math.max(value, 0.08), 0.98);

const hexToRgb = (hex: string): [number, number, number] | null => {
  const cleaned = hex.trim().replace('#', '');
  if (cleaned.length !== 6 && cleaned.length !== 8) {return null;}

  const normalized = cleaned.length === 8 ? cleaned.slice(0, 6) : cleaned;
  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);

  if ([r, g, b].some((value) => Number.isNaN(value))) {return null;}
  return [r, g, b];
};

const getAPCALc = (textHex: string, backgroundHex: string) => {
  const textRgb = hexToRgb(textHex);
  const backgroundRgb = hexToRgb(backgroundHex);

  if (!textRgb || !backgroundRgb) {return 0;}

  const lc = Math.abs(APCAcontrast(sRGBtoY(textRgb), sRGBtoY(backgroundRgb)));
  return Number.isFinite(lc) ? lc : 0;
};

const getOKLCH = (hex: string) => {
  const parsed = oklch(hex);
  return {
    l: parsed.l ?? 0.6,
    c: parsed.c ?? 0.12,
    h: parsed.h ?? 0,
    mode: 'oklch' as const,
  };
};

export const getAPCATextColor = (bg: string, fontSize = 16, fontWeight = 500) => {
  const whiteLc = getAPCALc('#ffffff', bg);
  const blackLc = getAPCALc('#000000', bg);
  const threshold = (fontSize >= 18 || fontWeight >= 700) ? 45 : 60;

  if (whiteLc >= threshold) {return '#ffffff';}
  if (blackLc >= threshold) {return '#0f172a';}
  return whiteLc > blackLc ? '#ffffff' : '#0f172a';
};

export const generatePalette = (hex: string): Palette => {
  const color = getOKLCH(hex);
  return {
    solid: hex,
    surface: formatHex(oklch({ ...color, l: clampLightness(color.l + 0.38) })),
    hover: formatHex(oklch({ ...color, l: clampLightness(color.l - 0.08) })),
    active: formatHex(oklch({ ...color, l: clampLightness(color.l - 0.14) })),
    border: formatHex(oklch({ ...color, l: clampLightness(color.l + 0.28), c: color.c * 0.9 })),
    disabled: formatHex(oklch({ ...color, l: clampLightness(color.l + 0.22), c: color.c * 0.55 })),
    textOnSolid: getAPCATextColor(hex, 16, 600),
    textInteractive: formatHex(oklch({ ...color, l: clampLightness(color.l - 0.26), c: color.c * 0.92 })),
  };
};

export const getAnalogous = (hex: string): [string, string] => {
  const color = getOKLCH(hex);
  return [
    formatHex(oklch({ ...color, h: (color.h + 30) % 360 })),
    formatHex(oklch({ ...color, h: (color.h - 30 + 360) % 360 })),
  ];
};

export const getComplementary = (hex: string) => {
  const color = getOKLCH(hex);
  return formatHex(oklch({ ...color, h: (color.h + 180) % 360 }));
};

export const getTriadic = (hex: string): [string, string] => {
  const color = getOKLCH(hex);
  return [
    formatHex(oklch({ ...color, h: (color.h + 120) % 360 })),
    formatHex(oklch({ ...color, h: (color.h - 120 + 360) % 360 })),
  ];
};

export const resolveSecondaryColor = (
  primary: string,
  secondary: string,
  mode: BrandMode,
  harmony: CTAHarmony,
) => {
  if (mode === 'single') {
    if (harmony === 'complementary') {return getComplementary(primary);}
    if (harmony === 'triadic') {return getTriadic(primary)[0];}
    return getAnalogous(primary)[0];
  }
  return secondary;
};

export const getHarmonyStatus = (primary: string, secondary: string): CTAHarmonyStatus => {
  const delta = differenceEuclidean('oklch')(primary, secondary);
  const similarity = 1 - Math.min(delta, 1);
  const deltaE = Math.round(delta * 100);
  return {
    deltaE,
    similarity,
    isTooSimilar: deltaE < 20,
  };
};

export const getCTAAccessibilityScore = (pairs: CTAAccessibilityPair[]): CTAAccessibilityScore => {
  const failing: CTAAccessibilityScore['failing'] = [];
  let minLc = Number.POSITIVE_INFINITY;

  pairs.forEach((pair) => {
    const fontSize = pair.fontSize ?? 16;
    const fontWeight = pair.fontWeight ?? 500;
    const threshold = (fontSize >= 18 || fontWeight >= 700) ? 45 : 60;
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

const ACCENT_BALANCE_BY_STYLE: Record<CTAStyle, { primary: number; secondary: number; neutral: number }> = {
  banner: { primary: 34, secondary: 8, neutral: 58 },
  centered: { primary: 30, secondary: 10, neutral: 60 },
  split: { primary: 32, secondary: 9, neutral: 59 },
  floating: { primary: 30, secondary: 10, neutral: 60 },
  gradient: { primary: 31, secondary: 11, neutral: 58 },
  minimal: { primary: 27, secondary: 8, neutral: 65 },
};

export const getCTAAccentBalance = (style: CTAStyle): CTAAccentBalance => {
  const target = ACCENT_BALANCE_BY_STYLE[style];
  const warnings: string[] = [];

  if (target.primary < 25) {warnings.push(`Primary < 25% (hiện ${target.primary}%)`);}
  if (target.secondary < 5) {warnings.push(`Secondary < 5% (hiện ${target.secondary}%)`);}

  return {
    primary: target.primary,
    secondary: target.secondary,
    neutral: target.neutral,
    warnings,
  };
};

const applyAlpha = (hex: string, alphaHex: string) => `${hex}${alphaHex}`;

const getGradientBg = (from: string, to: string) => {
  const fromColor = getOKLCH(from);
  const toColor = getOKLCH(to);
  const fromTint = formatHex(oklch({ ...fromColor, l: clampLightness(fromColor.l + 0.12), c: fromColor.c * 0.85 }));
  const toTint = formatHex(oklch({ ...toColor, l: clampLightness(toColor.l + 0.1), c: toColor.c * 0.85 }));
  return `linear-gradient(135deg, ${fromTint} 0%, ${toTint} 100%)`;
};

export const getCTAColors = ({
  primary,
  secondary,
  mode,
  harmony = 'analogous',
  style,
}: {
  primary: string;
  secondary: string;
  mode: BrandMode;
  harmony?: CTAHarmony;
  style: CTAStyle;
}): CTAStyleTokens => {
  const secondaryColor = resolveSecondaryColor(primary, secondary, mode, harmony);
  const primaryPalette = generatePalette(primary);
  const secondaryPalette = generatePalette(secondaryColor);

  const base: CTAStyleTokens = {
    sectionBg: '#ffffff',
    sectionBorder: applyAlpha(secondaryPalette.solid, '2A'),
    title: primaryPalette.solid,
    description: '#475569',
    badgeBg: secondaryPalette.surface,
    badgeText: secondaryPalette.textInteractive,
    primaryButtonBg: primaryPalette.solid,
    primaryButtonText: primaryPalette.textOnSolid,
    primaryButtonBorder: primaryPalette.active,
    secondaryButtonBg: '#ffffff',
    secondaryButtonText: secondaryPalette.textInteractive,
    secondaryButtonBorder: secondaryPalette.border,
    cardBg: '#ffffff',
    cardBorder: applyAlpha(secondaryPalette.solid, '24'),
    cardShadow: `0 1px 3px ${applyAlpha(secondaryPalette.solid, '1F')}`,
    accentLine: secondaryPalette.solid,
  };

  if (style === 'banner') {
    return {
      ...base,
      sectionBg: primaryPalette.solid,
      sectionBorder: primaryPalette.active,
      title: primaryPalette.textOnSolid,
      description: getAPCATextColor(primaryPalette.solid, 16, 500) === '#ffffff' ? '#ffffff' : '#1e293b',
      badgeBg: applyAlpha(secondaryPalette.solid, '2A'),
      badgeText: getAPCATextColor(applyAlpha(secondaryPalette.solid, '2A'), 12, 600),
      primaryButtonBg: '#ffffff',
      primaryButtonText: primaryPalette.textInteractive,
      primaryButtonBorder: applyAlpha(primaryPalette.active, '80'),
      secondaryButtonBg: 'transparent',
      secondaryButtonText: primaryPalette.textOnSolid,
      secondaryButtonBorder: applyAlpha(primaryPalette.textOnSolid === '#ffffff' ? '#ffffff' : '#0f172a', '66'),
      cardBg: undefined,
      cardBorder: undefined,
      cardShadow: undefined,
      accentLine: undefined,
    };
  }

  if (style === 'centered') {
    return {
      ...base,
      sectionBg: '#ffffff',
      sectionBorder: undefined,
      cardBg: undefined,
      cardBorder: undefined,
      cardShadow: undefined,
      accentLine: undefined,
    };
  }

  if (style === 'split') {
    return {
      ...base,
      sectionBg: '#f8fafc',
      sectionBorder: undefined,
      cardBg: '#ffffff',
      cardBorder: applyAlpha(secondaryPalette.solid, '1F'),
      cardShadow: `0 1px 3px ${applyAlpha(secondaryPalette.solid, '1A')}`,
      accentLine: primaryPalette.solid,
    };
  }

  if (style === 'floating') {
    return {
      ...base,
      sectionBg: '#f8fafc',
      cardBg: '#ffffff',
      cardBorder: applyAlpha(secondaryPalette.solid, '2A'),
      cardShadow: `0 2px 6px ${applyAlpha(secondaryPalette.solid, '26')}`,
    };
  }

  if (style === 'gradient') {
    const gradientBg = getGradientBg(primaryPalette.solid, secondaryPalette.solid);
    const textOnGradient = getAPCATextColor(primaryPalette.solid, 24, 700);

    return {
      ...base,
      sectionBg: gradientBg,
      sectionBorder: undefined,
      title: textOnGradient,
      description: textOnGradient === '#ffffff' ? '#f8fafc' : '#1e293b',
      badgeBg: applyAlpha('#ffffff', '2E'),
      badgeText: textOnGradient,
      primaryButtonBg: '#ffffff',
      primaryButtonText: secondaryPalette.textInteractive,
      primaryButtonBorder: applyAlpha('#ffffff', '80'),
      secondaryButtonBg: 'transparent',
      secondaryButtonText: textOnGradient,
      secondaryButtonBorder: applyAlpha('#ffffff', '7A'),
      cardBg: undefined,
      cardBorder: undefined,
      cardShadow: undefined,
      accentLine: undefined,
    };
  }

  return {
    ...base,
    sectionBg: '#ffffff',
    sectionBorder: applyAlpha(secondaryPalette.solid, '2A'),
    cardBg: undefined,
    cardBorder: undefined,
    cardShadow: undefined,
  };
};
