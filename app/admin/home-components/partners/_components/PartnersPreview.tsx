import React, { useState } from 'react';
import { Building2, ChevronLeft, ChevronRight, Image as ImageIcon, Plus } from 'lucide-react';
import { cn } from '../../../components/ui';
import { BrowserFrame } from '../../_shared/components/BrowserFrame';
import { PreviewImage } from '../../_shared/components/PreviewImage';
import { PreviewWrapper } from '../../_shared/components/PreviewWrapper';
import { deviceWidths, usePreviewDevice } from '../../_shared/hooks/usePreviewDevice';
import { PARTNERS_STYLES } from '../_lib/constants';
import type { PartnerItem, PartnersStyle } from '../_types';
import { PartnersMarqueeShared } from './PartnersMarqueeShared';
import { PartnersBadgeShared } from './PartnersBadgeShared';

export const PartnersPreview = ({
  items,
  brandColor,
  secondary: _secondary,
  selectedStyle = 'grid',
  onStyleChange,
  title,
}: {
  items: PartnerItem[];
  brandColor: string;
  secondary: string;
  selectedStyle?: PartnersStyle;
  onStyleChange?: (style: PartnersStyle) => void;
  title?: string;
}) => {
  const { device, setDevice } = usePreviewDevice();
  const [carouselIndex, setCarouselIndex] = useState(0);
  const previewStyle = selectedStyle ?? 'grid';
  const setPreviewStyle = (style: string) => onStyleChange?.(style as PartnersStyle);

  const renderEmptyState = () => (
    <section className="w-full py-6 bg-white dark:bg-slate-900">
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-14 h-14 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: `${brandColor}10` }}>
          <Building2 size={28} style={{ color: brandColor }} />
        </div>
        <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-1">Chưa có đối tác nào</h3>
        <p className="text-sm text-slate-500">Thêm logo đối tác đầu tiên</p>
      </div>
    </section>
  );

  const renderGridStyle = () => {
    if (items.length === 0) {return renderEmptyState();}

    const MAX_VISIBLE = device === 'mobile' ? 4 : 8;
    const visibleItems = items.slice(0, MAX_VISIBLE);
    const remainingCount = items.length - MAX_VISIBLE;

    if (items.length <= 2) {
      return (
        <section className="w-full py-6 bg-white dark:bg-slate-900 border-b border-slate-200/40 dark:border-slate-700/40">
          <div className="w-full max-w-7xl mx-auto px-4 md:px-6 space-y-4">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 text-center">Đối tác</h2>
            <div className={cn('mx-auto flex items-center justify-center gap-6', items.length === 1 ? 'max-w-xs' : 'max-w-md')}>
              {items.map((item) => (
                <a key={item.id} href={item.link || '#'} target="_blank" rel="noopener noreferrer" className="p-4 rounded-lg border" style={{ borderColor: `${brandColor}15` }}>
                  {item.url ? <PreviewImage src={item.url} alt="" className="h-14 w-auto object-contain" /> : <ImageIcon size={44} className="text-slate-300" />}
                </a>
              ))}
            </div>
          </div>
        </section>
      );
    }

    return (
      <section className="w-full py-6 bg-white dark:bg-slate-900 border-b border-slate-200/40 dark:border-slate-700/40">
        <div className="w-full max-w-7xl mx-auto px-4 md:px-6 space-y-4">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 relative pl-3">
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-full" style={{ backgroundColor: brandColor }}></span>
            Đối tác
          </h2>
          <div className={cn(
            'grid gap-3 items-center justify-items-center',
            device === 'mobile' ? 'grid-cols-2' : (device === 'tablet' ? 'grid-cols-4' : 'grid-cols-4 lg:grid-cols-8')
          )}>
            {visibleItems.map((item) => (
              <a
                key={item.id}
                href={item.link || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center p-3 rounded-lg border"
                style={{ borderColor: `${brandColor}10` }}
              >
                {item.url ? <PreviewImage src={item.url} alt="" className="h-11 w-auto object-contain" /> : <ImageIcon size={36} className="text-slate-300" />}
              </a>
            ))}
            {remainingCount > 0 && (
              <div className="w-full flex flex-col items-center justify-center p-3 rounded-lg border" style={{ backgroundColor: `${brandColor}05`, borderColor: `${brandColor}20` }}>
                <Plus size={20} style={{ color: brandColor }} />
                <span className="text-xs font-bold" style={{ color: brandColor }}>+{remainingCount}</span>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  };

  const renderMarqueeStyle = () => {
    if (items.length === 0) {return renderEmptyState();}

    return (
      <PartnersMarqueeShared
        items={items}
        brandColor={brandColor}
        title={title ?? 'Đối tác'}
        variant="marquee"
        speed={0.8}
        openInNewTab
        renderImage={(item, className) => (
          <PreviewImage src={item.url} alt={item.name ?? ''} className={className} />
        )}
        className="dark:bg-slate-900 dark:border-slate-700/40"
      />
    );
  };

  const renderMonoStyle = () => {
    if (items.length === 0) {return renderEmptyState();}

    return (
      <PartnersMarqueeShared
        items={items}
        brandColor={brandColor}
        title={title ?? 'Đối tác'}
        variant="mono"
        speed={0.5}
        openInNewTab
        renderImage={(item, className) => (
          <PreviewImage src={item.url} alt={item.name ?? ''} className={className} />
        )}
        className="dark:bg-slate-900 dark:border-slate-700/40"
      />
    );
  };

  const renderBadgeStyle = () => {
    if (items.length === 0) {return renderEmptyState();}

    const maxVisible = device === 'mobile' ? 4 : 6;

    return (
      <PartnersBadgeShared
        items={items}
        brandColor={brandColor}
        title={title ?? 'Đối tác'}
        maxVisible={maxVisible}
        openInNewTab
        variant="preview"
        renderImage={(item, className) => (
          <PreviewImage src={item.url} alt={item.name ?? ''} className={className} />
        )}
      />
    );
  };

  const renderCarouselStyle = () => {
    const itemsPerPage = device === 'mobile' ? 2 : (device === 'tablet' ? 4 : 6);
    const totalPages = Math.ceil(items.length / itemsPerPage);

    if (items.length === 0) {return renderEmptyState();}

    const visibleItems = items.slice(carouselIndex * itemsPerPage, (carouselIndex + 1) * itemsPerPage);
    const canPrev = carouselIndex > 0;
    const canNext = carouselIndex < totalPages - 1;

    return (
      <section className="w-full py-6 bg-white dark:bg-slate-900 border-b border-slate-200/40 dark:border-slate-700/40">
        <div className="w-full max-w-7xl mx-auto px-4 md:px-6 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 relative pl-3">
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-full" style={{ backgroundColor: brandColor }}></span>
              Đối tác
            </h2>
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>{  setCarouselIndex(prev => Math.max(0, prev - 1)); }}
                  disabled={!canPrev}
                  className="w-8 h-8 rounded-full border flex items-center justify-center disabled:opacity-30"
                  style={{ borderColor: `${brandColor}30`, color: brandColor }}
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-xs font-medium text-slate-500 tabular-nums">{carouselIndex + 1}/{totalPages}</span>
                <button
                  onClick={() =>{  setCarouselIndex(prev => Math.min(totalPages - 1, prev + 1)); }}
                  disabled={!canNext}
                  className="w-8 h-8 rounded-full border flex items-center justify-center disabled:opacity-30"
                  style={{ borderColor: `${brandColor}30`, color: brandColor }}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
          <div className={cn('grid gap-3 items-center', device === 'mobile' ? 'grid-cols-2' : (device === 'tablet' ? 'grid-cols-4' : 'grid-cols-6'))}>
            {visibleItems.map((item) => (
              <a
                key={item.id}
                href={item.link || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center p-3 rounded-lg border aspect-[3/2]"
                style={{ backgroundColor: `${brandColor}03`, borderColor: `${brandColor}15` }}
              >
                {item.url ? <PreviewImage src={item.url} alt="" className="h-11 w-auto object-contain" /> : <ImageIcon size={32} className="text-slate-300" />}
              </a>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() =>{  setCarouselIndex(idx); }}
                  className={cn('h-1.5 rounded-full', idx === carouselIndex ? 'w-5' : 'w-1.5 bg-slate-200 dark:bg-slate-700')}
                  style={idx === carouselIndex ? { backgroundColor: brandColor } : {}}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    );
  };

  const renderFeaturedStyle = () => {
    if (items.length === 0) {return renderEmptyState();}

    const featured = items[0];
    const MAX_OTHERS = device === 'mobile' ? 4 : 6;
    const others = items.slice(1, device === 'mobile' ? 5 : 7);
    const remainingCount = Math.max(0, items.length - 1 - MAX_OTHERS);

    if (items.length <= 2) {
      return (
        <section className="w-full py-6 bg-white dark:bg-slate-900 border-b border-slate-200/40 dark:border-slate-700/40">
          <div className="w-full max-w-7xl mx-auto px-4 md:px-6 space-y-4">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 text-center">Đối tác</h2>
            <div className={cn('mx-auto flex items-center justify-center gap-6', items.length === 1 ? 'max-w-xs' : 'max-w-md')}>
              {items.map((item) => (
                <a key={item.id} href={item.link || '#'} target="_blank" rel="noopener noreferrer" className="p-5 rounded-xl border" style={{ borderColor: `${brandColor}20` }}>
                  {item.url ? <PreviewImage src={item.url} alt="" className="h-16 w-auto object-contain" /> : <ImageIcon size={56} className="text-slate-300" />}
                </a>
              ))}
            </div>
          </div>
        </section>
      );
    }

    return (
      <section className="w-full py-6 bg-white dark:bg-slate-900 border-b border-slate-200/40 dark:border-slate-700/40">
        <div className="w-full max-w-7xl mx-auto px-4 md:px-6 space-y-4">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 relative pl-3">
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-full" style={{ backgroundColor: brandColor }}></span>
            Đối tác
          </h2>
          <div className={cn('grid gap-3', device === 'mobile' ? 'grid-cols-1' : 'grid-cols-3')}>
            <a
              href={featured.link || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className={cn('relative rounded-xl border overflow-hidden', device === 'mobile' ? 'aspect-video' : 'row-span-2 aspect-square')}
              style={{ background: `linear-gradient(135deg, ${brandColor}08 0%, ${brandColor}03 100%)`, borderColor: `${brandColor}20` }}
            >
              <div className="absolute top-2 left-2">
                <span className="px-2 py-0.5 text-[10px] font-bold rounded" style={{ backgroundColor: `${brandColor}15`, color: brandColor }}>NỔI BẬT</span>
              </div>
              <div className="w-full h-full flex items-center justify-center p-6">
                {featured?.url ? <PreviewImage src={featured.url} alt="" className="max-h-28 w-auto object-contain" /> : <ImageIcon size={56} className="text-slate-300" />}
              </div>
            </a>
            <div className={cn('grid gap-2', device === 'mobile' ? 'grid-cols-2' : 'col-span-2 grid-cols-3')}>
              {others.slice(0, MAX_OTHERS).map((item) => (
                <a key={item.id} href={item.link || '#'} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center p-3 rounded-lg border aspect-[3/2]" style={{ borderColor: `${brandColor}15` }}>
                  {item.url ? <PreviewImage src={item.url} alt="" className="h-9 w-auto object-contain" /> : <ImageIcon size={28} className="text-slate-300" />}
                </a>
              ))}
              {remainingCount > 0 && (
                <div className="flex flex-col items-center justify-center rounded-lg border aspect-[3/2]" style={{ backgroundColor: `${brandColor}05`, borderColor: `${brandColor}20` }}>
                  <Plus size={20} style={{ color: brandColor }} />
                  <span className="text-sm font-bold" style={{ color: brandColor }}>+{remainingCount}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  };

  return (
    <PreviewWrapper
      title="Preview Partners"
      device={device}
      setDevice={setDevice}
      previewStyle={previewStyle}
      setPreviewStyle={setPreviewStyle}
      styles={PARTNERS_STYLES}
      deviceWidthClass={deviceWidths[device]}
      info={`${items.length} logo`}
    >
      <BrowserFrame>
        {previewStyle === 'grid' && renderGridStyle()}
        {previewStyle === 'marquee' && renderMarqueeStyle()}
        {previewStyle === 'mono' && renderMonoStyle()}
        {previewStyle === 'badge' && renderBadgeStyle()}
        {previewStyle === 'carousel' && renderCarouselStyle()}
        {previewStyle === 'featured' && renderFeaturedStyle()}
      </BrowserFrame>
    </PreviewWrapper>
  );
};
