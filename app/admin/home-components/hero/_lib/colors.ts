'use client';

import { APCAcontrast } from 'apca-w3';
import { differenceEuclidean, formatHex, oklch } from 'culori';
import { getShade, getTint } from '@/lib/utils/colors';
import type { HeroHarmony } from '../_types';

export interface HeroColorScheme {
  primarySolid: string;
  primaryHover: string;
  primaryTintSubtle: string;
  primaryTintLight: string;
  primaryTintMedium: string;
  secondarySolid: string;
  secondaryTintVeryLight: string;
  secondaryTintLight: string;
  secondaryTintMedium: string;
  secondaryTintStrong: string;
  secondaryTintRing: string;
  overlayGradient: string;
  brandGradient: string;
}

export interface SliderColorScheme {
  navButtonBg: string;
  navButtonBgHover: string;
  navButtonIconColor: string;
  navButtonBorderColor: string;
  dotActive: string;
  dotInactive: string;
  placeholderBg: string;
  placeholderIconColor: string;
  similarity: number;
}

export const getAPCATextColor = (bg: string, fontSize = 16, fontWeight = 500) => {
  const whiteLc = Math.abs(APCAcontrast('#ffffff', bg));
  const blackLc = Math.abs(APCAcontrast('#000000', bg));
  const threshold = (fontSize >= 18 || fontWeight >= 700) ? 45 : 60;

  if (whiteLc >= threshold) {return '#ffffff';}
  if (blackLc >= threshold) {return '#0f172a';}
  return whiteLc > blackLc ? '#ffffff' : '#0f172a';
};

export const generatePalette = (hex: string) => {
  const color = oklch(hex);
  return {
    solid: hex,
    surface: formatHex(oklch({ ...color, l: Math.min(color.l + 0.4, 0.98) })),
    hover: formatHex(oklch({ ...color, l: Math.max(color.l - 0.1, 0.1) })),
    active: formatHex(oklch({ ...color, l: Math.max(color.l - 0.15, 0.08) })),
    border: formatHex(oklch({ ...color, l: Math.min(color.l + 0.3, 0.92) })),
    disabled: formatHex(oklch({ ...color, l: Math.min(color.l + 0.25, 0.9), c: color.c * 0.5 })),
    textOnSolid: getAPCATextColor(hex, 16, 500),
    textInteractive: formatHex(oklch({ ...color, l: Math.max(color.l - 0.25, 0.2) })),
  };
};

export const getAnalogous = (hex: string): [string, string] => {
  const color = oklch(hex);
  return [
    formatHex(oklch({ ...color, h: (color.h + 30) % 360 })),
    formatHex(oklch({ ...color, h: (color.h - 30 + 360) % 360 })),
  ];
};

export const getComplementary = (hex: string) => {
  const color = oklch(hex);
  return formatHex(oklch({ ...color, h: (color.h + 180) % 360 }));
};

export const getTriadic = (hex: string): [string, string] => {
  const color = oklch(hex);
  return [
    formatHex(oklch({ ...color, h: (color.h + 120) % 360 })),
    formatHex(oklch({ ...color, h: (color.h - 120 + 360) % 360 })),
  ];
};

export function getSliderColors(
  primary: string,
  secondary: string,
  mode: 'single' | 'dual',
  harmony: HeroHarmony = 'analogous',
): SliderColorScheme {
  let secondaryColor = secondary;

  if (mode === 'single') {
    if (harmony === 'complementary') {
      secondaryColor = getComplementary(primary);
    } else if (harmony === 'triadic') {
      secondaryColor = getTriadic(primary)[0];
    } else {
      secondaryColor = getAnalogous(primary)[0];
    }
  }

  const primaryPalette = generatePalette(primary);
  const secondaryPalette = generatePalette(secondaryColor);
  const similarity = 1 - Math.min(differenceEuclidean('oklch')(primary, secondaryColor), 1);

  return {
    navButtonBg: '#ffffff',
    navButtonBgHover: '#ffffff',
    navButtonIconColor: secondaryPalette.solid,
    navButtonBorderColor: secondaryPalette.surface,
    dotActive: primaryPalette.solid,
    dotInactive: 'rgba(255, 255, 255, 0.5)',
    placeholderBg: primaryPalette.surface,
    placeholderIconColor: primaryPalette.solid,
    similarity,
  };
}

export function getHeroColors(
  primary: string,
  secondary: string,
  useDualBrand: boolean,
): HeroColorScheme {
  const secondaryBase = useDualBrand ? secondary : primary;
  const overlayGradient = 'linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)';
  const brandGradient = useDualBrand
    ? `linear-gradient(135deg, ${getTint(primary, 0.8)} 0%, ${getTint(secondary, 0.6)} 100%)`
    : `linear-gradient(135deg, ${getTint(primary, 0.8)} 0%, ${getTint(primary, 0.5)} 100%)`;

  return {
    primarySolid: primary,
    primaryHover: getShade(primary, 10),
    primaryTintSubtle: getTint(primary, 0.1),
    primaryTintLight: getTint(primary, 0.15),
    primaryTintMedium: getTint(primary, 0.25),
    secondarySolid: secondaryBase,
    secondaryTintVeryLight: getTint(secondaryBase, useDualBrand ? 0.1 : 0.08),
    secondaryTintLight: getTint(secondaryBase, useDualBrand ? 0.15 : 0.12),
    secondaryTintMedium: getTint(secondaryBase, useDualBrand ? 0.3 : 0.2),
    secondaryTintStrong: getTint(secondaryBase, useDualBrand ? 0.4 : 0.25),
    secondaryTintRing: getTint(secondaryBase, useDualBrand ? 0.6 : 0.35),
    overlayGradient,
    brandGradient,
  };
}
