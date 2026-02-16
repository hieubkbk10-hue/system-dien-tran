'use client';

import React from 'react';
import { cn } from '../../../components/ui';
import { BrowserFrame } from '../../_shared/components/BrowserFrame';
import { PreviewWrapper } from '../../_shared/components/PreviewWrapper';
import { deviceWidths, usePreviewDevice } from '../../_shared/hooks/usePreviewDevice';
import { STATS_STYLES } from '../_lib/constants';
import {
  getCardsColors,
  getCounterColors,
  getGradientColors,
  getHorizontalColors,
  getIconsColors,
  getMinimalColors,
} from '../_lib/colors';
import type { StatsItem, StatsStyle } from '../_types';

export const StatsPreview = ({
  items,
  brandColor,
  secondary,
  selectedStyle,
  onStyleChange,
}: {
  items: StatsItem[];
  brandColor: string;
  secondary: string;
  selectedStyle?: StatsStyle;
  onStyleChange?: (style: StatsStyle) => void;
}) => {
  const { device, setDevice } = usePreviewDevice();
  const previewStyle = selectedStyle ?? 'horizontal';
  const setPreviewStyle = (style: string) => onStyleChange?.(style as StatsStyle);
  const info = `${items.filter((item) => item.value || item.label).length} số liệu`;

  const renderHorizontalStyle = () => {
    const colors = getHorizontalColors(brandColor, secondary);
    return (
    <section className="w-full rounded-lg shadow-md overflow-hidden border" style={{ backgroundColor: 'white', borderColor: colors.border, boxShadow: `0 4px 6px -1px ${colors.shadow}` }}>
      <div className={cn(
        "flex items-center justify-between",
        device === 'mobile' ? 'flex-col divide-y' : 'flex-row divide-x',
        "divide-slate-200"
      )}>
        {items.slice(0, device === 'mobile' ? 2 : 4).map((item, idx) => (
          <div
            key={idx}
            className={cn(
              "flex-1 w-full flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors duration-200 cursor-default",
              device === 'mobile' ? 'py-5 px-4' : 'py-6 px-4'
            )}
          >
            <span className={cn(
              "font-bold tracking-tight tabular-nums leading-none mb-1",
              device === 'mobile' ? 'text-2xl' : 'text-3xl md:text-4xl'
            )} style={{ color: brandColor }}>
              {item.value || '0'}
            </span>
            <h3 className="text-xs font-medium uppercase tracking-wider text-slate-600">
              {item.label || 'Label'}
            </h3>
          </div>
        ))}
      </div>
    </section>
    );
  };

  const renderCardsStyle = () => {
    const colors = getCardsColors(brandColor, secondary);
    return (
    <section className={cn("w-full", device === 'mobile' ? 'p-3' : 'p-4')}>
      <div className={cn("grid gap-4", device === 'mobile' ? 'grid-cols-2' : 'grid-cols-4')}>
        {items.slice(0, 4).map((item, idx) => (
          <div
            key={idx}
            className="group bg-white dark:bg-slate-800 border rounded-xl p-5 flex flex-col items-center text-center shadow-sm hover:shadow-md hover:border-opacity-50 transition-all duration-200"
            style={{ borderColor: colors.border }}
          >
            <span
              className={cn(
                "font-bold mb-1 tracking-tight tabular-nums group-hover:scale-105 transition-transform duration-200",
                device === 'mobile' ? 'text-2xl' : 'text-3xl'
              )}
              style={{ color: brandColor }}
            >
              {item.value || '0'}
            </span>
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {item.label || 'Label'}
            </h3>
            <div className="w-8 h-0.5 rounded-full mt-3 group-hover:opacity-70 transition-opacity duration-200" style={{ backgroundColor: colors.accent }} />
          </div>
        ))}
      </div>
    </section>
    );
  };

  const renderIconsStyle = () => {
    const colors = getIconsColors(brandColor, secondary);
    return (
    <section className={cn("w-full", device === 'mobile' ? 'py-4 px-3' : 'py-6 px-4')}>
      <div className={cn("grid gap-6", device === 'mobile' ? 'grid-cols-2 gap-4' : 'grid-cols-4 md:gap-8')}>
        {items.slice(0, 4).map((item, idx) => (
          <div key={idx} className="flex flex-col items-center group">
            <div
              className={cn(
                "relative rounded-full flex items-center justify-center mb-3 group-hover:scale-105 transition-all duration-300 ease-out border-[3px] border-white ring-1 ring-slate-100 dark:ring-slate-700",
                device === 'mobile' ? 'w-20 h-20' : 'w-24 h-24 md:w-28 md:h-28'
              )}
              style={{
                backgroundColor: colors.circleBg,
                boxShadow: `0 10px 15px -3px ${colors.shadowStrong}, 0 4px 6px -4px ${colors.shadowSoft}`
              }}
            >
              <span
                className={cn(
                  "font-bold tracking-tight z-10 tabular-nums",
                  device === 'mobile' ? 'text-xl' : 'text-2xl md:text-3xl'
                )}
                style={{ color: colors.textOnCircle }}
              >
                {item.value || '0'}
              </span>
            </div>
            <h3
              className={cn(
                "font-semibold text-slate-800 dark:text-slate-200 group-hover:transition-colors",
                device === 'mobile' ? 'text-sm' : 'text-base'
              )}
              style={{ color: colors.label }}
            >
              {item.label || 'Label'}
            </h3>
          </div>
        ))}
      </div>
    </section>
    );
  };

  const renderGradientStyle = () => {
    const colors = getGradientColors(brandColor, secondary);
    return (
    <section className={cn("w-full", device === 'mobile' ? 'p-3' : 'p-6')}>
      <div
        className="rounded-2xl overflow-hidden border"
        style={{
          background: colors.background,
          borderColor: colors.border
        }}
      >
        <div className={cn(
          "grid backdrop-blur-sm",
          device === 'mobile' ? 'grid-cols-2' : 'grid-cols-4'
        )}>
          {items.slice(0, 4).map((item, idx) => (
            <div
              key={idx}
              className={cn(
                "relative flex flex-col items-center justify-center text-center p-6",
                device === 'mobile' ? 'p-4' : 'p-8',
                idx !== items.slice(0, 4).length - 1 && (device === 'mobile' ? '' : 'border-r border-white/10')
              )}
            >
              <div
                className="absolute top-2 right-2 w-16 h-16 rounded-full bg-white/5 blur-xl"
              />
              <span
                className={cn(
                  "font-extrabold tracking-tight tabular-nums leading-none mb-2 relative z-10 drop-shadow-lg",
                  device === 'mobile' ? 'text-3xl' : 'text-4xl md:text-5xl'
                )}
                style={{ color: colors.text }}
              >
                {item.value || '0'}
              </span>
              <h3
                className={cn(
                  "font-medium opacity-90 relative z-10",
                  device === 'mobile' ? 'text-xs' : 'text-sm'
                )}
                style={{ color: colors.label }}
              >
                {item.label || 'Label'}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
    );
  };

  const renderMinimalStyle = () => {
    const colors = getMinimalColors(brandColor, secondary);
    return (
    <section className={cn("w-full bg-slate-50 dark:bg-slate-900", device === 'mobile' ? 'py-8 px-4' : 'py-12 px-6')}>
      <div className={cn(
        "max-w-5xl mx-auto grid",
        device === 'mobile' ? 'grid-cols-2 gap-6' : 'grid-cols-4 gap-8'
      )}>
        {items.slice(0, 4).map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col items-start"
          >
            <div
              className="w-12 h-1 rounded-full mb-4"
              style={{ backgroundColor: colors.accent }}
            />
            <span
              className={cn(
                "font-bold tracking-tight tabular-nums leading-none text-slate-900 dark:text-white",
                device === 'mobile' ? 'text-3xl' : 'text-4xl md:text-5xl'
              )}
              style={{ color: colors.value }}
            >
              {item.value || '0'}
            </span>
            <h3 className={cn(
              "font-medium text-slate-500 dark:text-slate-400 mt-2",
              device === 'mobile' ? 'text-sm' : 'text-base'
            )}>
              {item.label || 'Label'}
            </h3>
          </div>
        ))}
      </div>
    </section>
    );
  };

  const renderCounterStyle = () => {
    const colors = getCounterColors(brandColor, secondary);
    return (
    <section className={cn("w-full", device === 'mobile' ? 'py-6 px-3' : 'py-10 px-6')}>
      <div className={cn(
        "max-w-5xl mx-auto grid",
        device === 'mobile' ? 'grid-cols-2 gap-4' : 'grid-cols-4 gap-6'
      )}>
        {items.slice(0, 4).map((item, idx) => (
          <div
            key={idx}
            className="relative bg-white dark:bg-slate-800 rounded-2xl border overflow-hidden group"
            style={{ borderColor: colors.border }}
          >
            <div className="h-1 w-full bg-slate-100 dark:bg-slate-700">
              <div
                className="h-full transition-all duration-500"
                style={{
                  backgroundColor: colors.progress,
                  width: `${Math.min(100, (idx + 1) * 25)}%`
                }}
              />
            </div>

            <div className={cn(
              "flex flex-col items-center justify-center text-center",
              device === 'mobile' ? 'p-4' : 'p-6'
            )}>
              <span
                className={cn(
                  "font-black tracking-tighter tabular-nums leading-none group-hover:scale-110 transition-transform duration-300",
                  device === 'mobile' ? 'text-4xl' : 'text-5xl md:text-6xl'
                )}
                style={{ color: colors.value }}
              >
                {item.value || '0'}
              </span>
              <h3 className={cn(
                "font-semibold text-slate-600 dark:text-slate-300 mt-2",
                device === 'mobile' ? 'text-xs' : 'text-sm'
              )}>
                {item.label || 'Label'}
              </h3>
            </div>

            <div
              className="absolute -bottom-4 -right-4 text-[5rem] font-black opacity-[0.03] select-none pointer-events-none leading-none"
              style={{ color: colors.watermark }}
            >
              {idx + 1}
            </div>
          </div>
        ))}
      </div>
    </section>
    );
  };

  return (
    <PreviewWrapper
      title="Preview Stats"
      device={device}
      setDevice={setDevice}
      previewStyle={previewStyle}
      setPreviewStyle={setPreviewStyle}
      styles={STATS_STYLES}
      info={info}
      deviceWidthClass={deviceWidths[device]}
    >
      <BrowserFrame>
        {previewStyle === 'horizontal' && renderHorizontalStyle()}
        {previewStyle === 'cards' && renderCardsStyle()}
        {previewStyle === 'icons' && renderIconsStyle()}
        {previewStyle === 'gradient' && renderGradientStyle()}
        {previewStyle === 'minimal' && renderMinimalStyle()}
        {previewStyle === 'counter' && renderCounterStyle()}
      </BrowserFrame>
    </PreviewWrapper>
  );
};
