'use client';

import { APCAcontrast } from 'apca-w3';
import { formatHex, oklch } from 'culori';
import type { StatsBrandMode } from '../_types';

const clampLightness = (value: number) => Math.min(Math.max(value, 0.08), 0.98);

const isNonEmptyColor = (value: string) => value.trim().length > 0;

const safeParseOklch = (input: string, fallback: string) => (
  oklch(input) ?? oklch(fallback) ?? oklch('#3b82f6')
);

const resolveStatsSecondary = (
  primary: string,
  secondary: string,
  mode: StatsBrandMode,
) => {
  if (mode === 'single') {
    return primary;
  }

  return isNonEmptyColor(secondary) ? secondary : primary;
};

const getTint = (hex: string, lightness: number, fallback: string) => {
  const color = safeParseOklch(hex, fallback);
  return formatHex(oklch({ ...color, l: clampLightness(color.l + lightness) }));
};

export const getAPCATextColor = (bg: string, fontSize = 16, fontWeight = 500) => {
  const whiteLc = Math.abs(APCAcontrast('#ffffff', bg));
  const blackLc = Math.abs(APCAcontrast('#000000', bg));
  const threshold = (fontSize >= 18 || fontWeight >= 700) ? 45 : 60;

  if (whiteLc >= threshold) {return '#ffffff';}
  if (blackLc >= threshold) {return '#0f172a';}
  return whiteLc > blackLc ? '#ffffff' : '#0f172a';
};

const getTextOnGradient = (primary: string, secondary: string, fontSize = 16, fontWeight = 500) => {
  const whitePrimary = Math.abs(APCAcontrast('#ffffff', primary));
  const whiteSecondary = Math.abs(APCAcontrast('#ffffff', secondary));
  const blackPrimary = Math.abs(APCAcontrast('#000000', primary));
  const blackSecondary = Math.abs(APCAcontrast('#000000', secondary));
  const threshold = (fontSize >= 18 || fontWeight >= 700) ? 45 : 60;
  const whiteMin = Math.min(whitePrimary, whiteSecondary);
  const blackMin = Math.min(blackPrimary, blackSecondary);

  if (whiteMin >= threshold || blackMin >= threshold) {
    return whiteMin >= blackMin ? '#ffffff' : '#0f172a';
  }

  return whiteMin > blackMin ? '#ffffff' : '#0f172a';
};

const ensureAPCATextColor = (
  preferred: string,
  background: string,
  fontSize = 16,
  fontWeight = 500,
) => {
  const threshold = (fontSize >= 18 || fontWeight >= 700) ? 45 : 60;
  const lc = Math.abs(APCAcontrast(preferred, background));
  if (Number.isFinite(lc) && lc >= threshold) { return preferred; }
  return getAPCATextColor(background, fontSize, fontWeight);
};

export const getHorizontalColors = (primary: string, secondary: string, mode: StatsBrandMode) => {
  const secondaryResolved = resolveStatsSecondary(primary, secondary, mode);

  return {
    border: getTint(secondaryResolved, 0.35, primary),
  };
};

export const getCardsColors = (primary: string, secondary: string, mode: StatsBrandMode) => {
  const secondaryResolved = resolveStatsSecondary(primary, secondary, mode);

  return {
    border: getTint(secondaryResolved, 0.35, primary),
    accent: secondaryResolved,
  };
};

export const getIconsColors = (primary: string, secondary: string, mode: StatsBrandMode) => {
  const secondaryResolved = resolveStatsSecondary(primary, secondary, mode);

  return {
    circleBg: primary,
    textOnCircle: getAPCATextColor(primary, 20, 700),
    label: ensureAPCATextColor(secondaryResolved, '#ffffff', 14, 500),
  };
};

export const getGradientColors = (primary: string, secondary: string, mode: StatsBrandMode) => {
  const secondaryResolved = resolveStatsSecondary(primary, secondary, mode);

  return {
    background: `linear-gradient(135deg, ${primary} 0%, ${secondaryResolved} 100%)`,
    border: getTint(secondaryResolved, 0.35, primary),
    text: getTextOnGradient(primary, secondaryResolved, 20, 700),
    label: getTextOnGradient(primary, secondaryResolved, 14, 500),
  };
};

export const getMinimalColors = (primary: string, secondary: string, mode: StatsBrandMode) => {
  const secondaryResolved = resolveStatsSecondary(primary, secondary, mode);

  return {
    accent: ensureAPCATextColor(secondaryResolved, '#ffffff', 14, 500),
    value: ensureAPCATextColor(primary, '#ffffff', 32, 700),
  };
};

export const getCounterColors = (primary: string, secondary: string, mode: StatsBrandMode) => {
  const secondaryResolved = resolveStatsSecondary(primary, secondary, mode);

  return {
    border: getTint(secondaryResolved, 0.35, primary),
    progress: secondaryResolved,
    value: ensureAPCATextColor(primary, '#ffffff', 32, 700),
  };
};
