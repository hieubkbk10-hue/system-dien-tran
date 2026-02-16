import { apcaContrast } from 'apca-w3';
import { differenceEuclidean, formatHex, oklch } from 'culori';

export interface BrandPalette {
  solid: string;
  surface: string;
  hover: string;
  active: string;
  border: string;
  disabled: string;
  textOnSolid: string;
  textInteractive: string;
}

export interface PlaceholderColors {
  background: string;
  icon: string;
  text: string;
}

export interface BrandColorsResult {
  primary: BrandPalette;
  secondary: BrandPalette;
  placeholder: PlaceholderColors;
  useDualBrand: boolean;
  similarity: number;
}

export const getAPCATextColor = (bg: string, fontSize = 16, fontWeight = 500) => {
  const whiteLc = Math.abs(apcaContrast('#ffffff', bg));
  const blackLc = Math.abs(apcaContrast('#000000', bg));
  const threshold = (fontSize >= 18 || fontWeight >= 700) ? 45 : 60;

  if (whiteLc >= threshold) {return '#ffffff';}
  if (blackLc >= threshold) {return '#0f172a';}
  return whiteLc > blackLc ? '#ffffff' : '#0f172a';
};

export const generatePalette = (hex: string): BrandPalette => {
  const color = oklch(hex);
  const surface = formatHex(oklch({ ...color, l: Math.min(color.l + 0.4, 0.98) }));
  const hover = formatHex(oklch({ ...color, l: Math.max(color.l - 0.1, 0.1) }));
  const active = formatHex(oklch({ ...color, l: Math.max(color.l - 0.15, 0.08) }));
  const border = formatHex(oklch({ ...color, l: Math.min(color.l + 0.3, 0.92) }));
  const disabled = formatHex(oklch({ ...color, l: Math.min(color.l + 0.25, 0.9), c: color.c * 0.5 }));

  return {
    solid: hex,
    surface,
    hover,
    active,
    border,
    disabled,
    textOnSolid: getAPCATextColor(hex, 16, 500),
    textInteractive: formatHex(oklch({ ...color, l: Math.max(color.l - 0.25, 0.2) })),
  };
};

export const getAnalogous = (hex: string): [string, string] => {
  const color = oklch(hex);
  return [
    formatHex(oklch({ ...color, h: (color.h + 30) % 360 })),
    formatHex(oklch({ ...color, h: (color.h - 30 + 360) % 360 }))
  ];
};

export const getComplementary = (hex: string) => {
  const color = oklch(hex);
  return formatHex(oklch({ ...color, h: (color.h + 180) % 360 }));
};

export const getPlaceholderColors = (primary: string): PlaceholderColors => ({
  background: '#f1f5f9',
  icon: primary,
  text: '#64748b',
});

export const getNavButtonColors = (
  brandColor: string,
  mode: 'single' | 'dual',
  secondaryColor?: string,
) => {
  const iconColor = mode === 'dual' && secondaryColor ? secondaryColor : brandColor;
  const color = oklch(iconColor);
  const isLight = color.l >= 0.65;

  return {
    bg: isLight ? '#0f172a' : '#ffffff',
    icon: isLight ? '#ffffff' : iconColor,
    outerRing: isLight ? 'rgba(255,255,255,0.7)' : 'rgba(15,23,42,0.3)',
    bgHover: isLight ? '#1e293b' : '#f8fafc',
  };
};

export const getBrandColors = (
  primary: string,
  secondary: string | undefined,
  mode: 'single' | 'dual',
  harmony: 'analogous' | 'complementary' | 'triadic' = 'analogous'
): BrandColorsResult => {
  let secondaryColor = secondary ?? primary;

  if (mode === 'single') {
    if (harmony === 'complementary') {
      secondaryColor = getComplementary(primary);
    } else {
      secondaryColor = getAnalogous(primary)[0];
    }
  }

  const similarity = 1 - Math.min(differenceEuclidean('oklch')(primary, secondaryColor), 1);
  const placeholder = getPlaceholderColors(primary);

  return {
    primary: generatePalette(primary),
    secondary: generatePalette(secondaryColor),
    placeholder,
    useDualBrand: mode === 'dual',
    similarity,
  };
};