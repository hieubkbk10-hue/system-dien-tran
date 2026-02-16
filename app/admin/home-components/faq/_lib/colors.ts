'use client';

import { APCAcontrast, sRGBtoY } from 'apca-w3';
import { formatHex, oklch } from 'culori';
import type { FaqBrandMode, FaqStyle } from '../_types';

interface FaqPalette {
  solid: string;
  surface: string;
  surfaceSoft: string;
  hover: string;
  active: string;
  border: string;
  textOnSolid: string;
  textInteractive: string;
}

export interface FaqStyleTokens {
  sectionBg: string;
  heading: string;
  body: string;
  panelBg: string;
  panelBgMuted: string;
  panelBorder: string;
  panelBorderStrong: string;
  chevron: string;
  iconBg: string;
  iconText: string;
  number: string;
  timelineLine: string;
  timelineDotBorder: string;
  timelineDotBg: string;
  tabActiveBg: string;
  tabActiveText: string;
  tabInactiveBg: string;
  tabInactiveText: string;
  ctaBg: string;
  ctaText: string;
  ctaShadow: string;
}

const clampLightness = (value: number) => Math.min(Math.max(value, 0.08), 0.98);
const clampChroma = (value: number) => Math.min(Math.max(value, 0.02), 0.37);

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

const getAPCAThreshold = (fontSize = 16, fontWeight = 500) => (
  (fontSize >= 18 || fontWeight >= 700) ? 45 : 60
);

const getOKLCH = (hex: string) => {
  const parsed = oklch(hex);
  return {
    l: parsed.l ?? 0.6,
    c: parsed.c ?? 0.12,
    h: parsed.h ?? 0,
    mode: 'oklch' as const,
  };
};

const oklchShift = (
  hex: string,
  options: {
    l?: number;
    c?: number;
    h?: number;
  },
) => {
  const color = getOKLCH(hex);
  const next = {
    ...color,
    ...(options.h !== undefined ? { h: options.h } : {}),
    ...(options.l !== undefined ? { l: clampLightness(color.l + options.l) } : {}),
    ...(options.c !== undefined ? { c: clampChroma(color.c + options.c) } : {}),
  };
  return formatHex(oklch(next));
};

const applyAlpha = (hex: string, alphaHex: string) => `${hex}${alphaHex}`;

export const getAPCATextColor = (bg: string, fontSize = 16, fontWeight = 500) => {
  const whiteLc = getAPCALc('#ffffff', bg);
  const blackLc = getAPCALc('#000000', bg);
  const threshold = getAPCAThreshold(fontSize, fontWeight);

  if (whiteLc >= threshold) {return '#ffffff';}
  if (blackLc >= threshold) {return '#0f172a';}
  return whiteLc > blackLc ? '#ffffff' : '#0f172a';
};

const generatePalette = (hex: string): FaqPalette => ({
  solid: hex,
  surface: oklchShift(hex, { l: 0.4, c: -0.03 }),
  surfaceSoft: oklchShift(hex, { l: 0.46, c: -0.04 }),
  hover: oklchShift(hex, { l: -0.08 }),
  active: oklchShift(hex, { l: -0.12 }),
  border: oklchShift(hex, { l: 0.26, c: -0.02 }),
  textOnSolid: getAPCATextColor(hex, 14, 700),
  textInteractive: oklchShift(hex, { l: -0.24, c: -0.02 }),
});

const getAnalogous = (hex: string): [string, string] => {
  const color = getOKLCH(hex);
  return [
    formatHex(oklch({ ...color, h: (color.h + 30) % 360 })),
    formatHex(oklch({ ...color, h: (color.h - 30 + 360) % 360 })),
  ];
};

const getComplementary = (hex: string) => {
  const color = getOKLCH(hex);
  return formatHex(oklch({ ...color, h: (color.h + 180) % 360 }));
};

const getTriadic = (hex: string): [string, string] => {
  const color = getOKLCH(hex);
  return [
    formatHex(oklch({ ...color, h: (color.h + 120) % 360 })),
    formatHex(oklch({ ...color, h: (color.h - 120 + 360) % 360 })),
  ];
};

export const resolveFaqSecondary = (
  primary: string,
  secondary: string,
  mode: FaqBrandMode,
  harmony: 'analogous' | 'complementary' | 'triadic' = 'analogous',
) => {
  if (mode === 'single') {
    if (harmony === 'complementary') {return getComplementary(primary);}
    if (harmony === 'triadic') {return getTriadic(primary)[0];}
    return getAnalogous(primary)[0];
  }

  return secondary.trim() || getAnalogous(primary)[0];
};

export const getFaqColors = ({
  primary,
  secondary,
  mode,
  style,
}: {
  primary: string;
  secondary: string;
  mode: FaqBrandMode;
  style: FaqStyle;
}): FaqStyleTokens => {
  const resolvedSecondary = resolveFaqSecondary(primary, secondary, mode);
  const primaryPalette = generatePalette(primary);
  const secondaryPalette = generatePalette(resolvedSecondary);

  const base: FaqStyleTokens = {
    sectionBg: '#ffffff',
    heading: primaryPalette.solid,
    body: '#475569',
    panelBg: '#ffffff',
    panelBgMuted: '#f8fafc',
    panelBorder: applyAlpha(secondaryPalette.solid, '26'),
    panelBorderStrong: applyAlpha(secondaryPalette.solid, '52'),
    chevron: secondaryPalette.solid,
    iconBg: primaryPalette.surface,
    iconText: primaryPalette.textInteractive,
    number: secondaryPalette.textInteractive,
    timelineLine: applyAlpha(secondaryPalette.solid, '33'),
    timelineDotBorder: secondaryPalette.solid,
    timelineDotBg: '#ffffff',
    tabActiveBg: secondaryPalette.solid,
    tabActiveText: secondaryPalette.textOnSolid,
    tabInactiveBg: '#f1f5f9',
    tabInactiveText: '#475569',
    ctaBg: primaryPalette.solid,
    ctaText: primaryPalette.textOnSolid,
    ctaShadow: `0 2px 8px ${applyAlpha(primaryPalette.active, '3D')}`,
  };

  if (style === 'cards') {
    return {
      ...base,
      panelBg: '#ffffff',
      panelBgMuted: '#ffffff',
      iconBg: primaryPalette.surface,
      iconText: primaryPalette.textInteractive,
    };
  }

  if (style === 'two-column') {
    return {
      ...base,
      panelBg: '#ffffff',
      panelBgMuted: '#ffffff',
      panelBorder: applyAlpha(secondaryPalette.solid, '29'),
      ctaBg: primaryPalette.solid,
      ctaText: primaryPalette.textOnSolid,
      ctaShadow: `0 4px 12px ${applyAlpha(primaryPalette.active, '42')}`,
    };
  }

  if (style === 'minimal') {
    return {
      ...base,
      panelBg: '#ffffff',
      panelBgMuted: '#ffffff',
      panelBorder: applyAlpha(secondaryPalette.solid, '1F'),
      number: secondaryPalette.solid,
    };
  }

  if (style === 'timeline') {
    return {
      ...base,
      panelBg: '#ffffff',
      panelBgMuted: secondaryPalette.surfaceSoft,
      timelineLine: applyAlpha(secondaryPalette.solid, '3D'),
      timelineDotBorder: secondaryPalette.solid,
      timelineDotBg: '#ffffff',
    };
  }

  if (style === 'tabbed') {
    return {
      ...base,
      panelBg: secondaryPalette.surfaceSoft,
      panelBgMuted: secondaryPalette.surface,
      panelBorder: applyAlpha(secondaryPalette.solid, '33'),
      tabActiveBg: secondaryPalette.solid,
      tabActiveText: secondaryPalette.textOnSolid,
      tabInactiveBg: '#f1f5f9',
      tabInactiveText: '#475569',
    };
  }

  return base;
};
