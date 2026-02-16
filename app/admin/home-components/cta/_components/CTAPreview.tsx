'use client';

import React from 'react';
import { AlertTriangle, Eye } from 'lucide-react';
import { BrowserFrame } from '../../_shared/components/BrowserFrame';
import { PreviewWrapper } from '../../_shared/components/PreviewWrapper';
import { deviceWidths, usePreviewDevice } from '../../_shared/hooks/usePreviewDevice';
import {
  getCTAAccessibilityScore,
  getCTAAccentBalance,
  getCTAColors,
  getHarmonyStatus,
  resolveSecondaryColor,
} from '../_lib/colors';
import { CTASectionShared } from './CTASectionShared';
import type { CTAConfig, CTAHarmony, CTAStyle } from '../_types';

const CTA_STYLES: { id: CTAStyle; label: string }[] = [
  { id: 'banner', label: 'Banner' },
  { id: 'centered', label: 'Centered' },
  { id: 'split', label: 'Split' },
  { id: 'floating', label: 'Floating' },
  { id: 'gradient', label: 'Gradient' },
  { id: 'minimal', label: 'Minimal' },
];

export const CTAPreview = ({
  config,
  brandColor,
  secondary,
  mode = 'dual',
  harmony = 'analogous',
  selectedStyle = 'banner',
  onStyleChange,
}: {
  config: CTAConfig;
  brandColor: string;
  secondary: string;
  mode?: 'single' | 'dual';
  harmony?: CTAHarmony;
  selectedStyle?: CTAStyle;
  onStyleChange?: (style: CTAStyle) => void;
}) => {
  const { device, setDevice } = usePreviewDevice();
  const style = selectedStyle;

  const tokens = getCTAColors({
    primary: brandColor,
    secondary,
    mode,
    harmony,
    style,
  });

  const resolvedSecondary = resolveSecondaryColor(brandColor, secondary, mode, harmony);
  const harmonyStatus = getHarmonyStatus(brandColor, resolvedSecondary);
  const sectionBgForCheck = tokens.sectionBg.startsWith('linear-gradient') ? brandColor : tokens.sectionBg;
  const secondaryButtonBgForCheck = !tokens.secondaryButtonBg || tokens.secondaryButtonBg === 'transparent'
    ? sectionBgForCheck
    : tokens.secondaryButtonBg;

  const hasBadge = Boolean(config.badge?.trim());
  const hasSecondaryButton = Boolean(config.secondaryButtonText?.trim());

  const accessibilityPairs: Array<{
    background: string;
    text: string;
    fontSize: number;
    fontWeight: number;
    label: string;
  }> = [
    { background: sectionBgForCheck, text: tokens.title, fontSize: 32, fontWeight: 700, label: 'title' },
    { background: sectionBgForCheck, text: tokens.description, fontSize: 16, fontWeight: 500, label: 'description' },
    { background: tokens.primaryButtonBg, text: tokens.primaryButtonText, fontSize: 14, fontWeight: 700, label: 'primaryButton' },
  ];

  if (hasBadge) {
    accessibilityPairs.push({ background: tokens.badgeBg, text: tokens.badgeText, fontSize: 12, fontWeight: 600, label: 'badge' });
  }

  if (hasSecondaryButton) {
    accessibilityPairs.push({ background: secondaryButtonBgForCheck, text: tokens.secondaryButtonText, fontSize: 14, fontWeight: 700, label: 'secondaryButton' });
  }

  const accessibility = getCTAAccessibilityScore(accessibilityPairs);

  const accentBalance = getCTAAccentBalance(style);

  return (
    <>
      <PreviewWrapper
        title="Preview CTA"
        device={device}
        setDevice={setDevice}
        previewStyle={style}
        setPreviewStyle={(s) => onStyleChange?.(s as CTAStyle)}
        styles={CTA_STYLES}
        info={`${mode.toUpperCase()} • ${harmony}`}
        deviceWidthClass={deviceWidths[device]}
      >
        <BrowserFrame url="yoursite.com">
          <CTASectionShared config={config} style={style} tokens={tokens} context="preview" />
        </BrowserFrame>
      </PreviewWrapper>

      {harmonyStatus.isTooSimilar && (
        <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
          <div className="flex items-start gap-2">
            <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold">Harmony warning</p>
              <p>deltaE = {harmonyStatus.deltaE} (&lt; 20) • Primary/Secondary đang quá giống nhau.</p>
            </div>
          </div>
        </div>
      )}

      {accessibility.failing.length > 0 && (
        <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
          <div className="flex items-start gap-2">
            <Eye size={14} className="mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold">Accessibility warning</p>
              <p>minLc: {accessibility.minLc.toFixed(1)} • fail: {accessibility.failing.map((item) => item.label ?? 'pair').join(', ')}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs dark:border-slate-700 dark:bg-slate-800/50">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Primary</span>
            <span className="h-5 w-5 rounded border" style={{ backgroundColor: brandColor }} />
            <span className="font-mono text-slate-600 dark:text-slate-300">{brandColor}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Secondary</span>
            <span className="h-5 w-5 rounded border" style={{ backgroundColor: resolvedSecondary }} />
            <span className="font-mono text-slate-600 dark:text-slate-300">{resolvedSecondary}</span>
          </div>
          <div className="text-slate-500 dark:text-slate-400">
            Accent: P {accentBalance.primary}% / S {accentBalance.secondary}% / N {accentBalance.neutral}%
          </div>
        </div>
      </div>
    </>
  );
};
