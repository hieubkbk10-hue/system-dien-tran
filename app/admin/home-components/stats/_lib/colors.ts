'use client';

import { APCAcontrast } from 'apca-w3';
import { formatHex, oklch } from 'culori';

const clampLightness = (value: number) => Math.min(Math.max(value, 0.08), 0.98);

const getTint = (hex: string, lightness: number) => {
  const color = oklch(hex);
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

export const getHorizontalColors = (_primary: string, secondary: string) => ({
  border: getTint(secondary, 0.35),
  shadow: getTint(secondary, 0.3),
});

export const getCardsColors = (_primary: string, secondary: string) => ({
  border: getTint(secondary, 0.35),
  accent: secondary,
});

export const getIconsColors = (primary: string, secondary: string) => ({
  circleBg: primary,
  textOnCircle: getAPCATextColor(primary, 20, 700),
  label: secondary,
  shadowStrong: getTint(secondary, 0.25),
  shadowSoft: getTint(secondary, 0.35),
});

export const getGradientColors = (primary: string, secondary: string) => ({
  background: `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`,
  border: getTint(secondary, 0.35),
  text: getTextOnGradient(primary, secondary, 20, 700),
  label: getTextOnGradient(primary, secondary, 14, 500),
});

export const getMinimalColors = (primary: string, secondary: string) => ({
  accent: secondary,
  value: primary,
});

export const getCounterColors = (primary: string, secondary: string) => ({
  border: getTint(secondary, 0.35),
  progress: secondary,
  value: primary,
  watermark: secondary,
});
