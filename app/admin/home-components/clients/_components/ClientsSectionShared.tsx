'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, Image as ImageIcon, Plus } from 'lucide-react';
import { PreviewImage } from '../../_shared/components/PreviewImage';
import type { ClientsColorTokens } from '../_lib/colors';
import type { ClientItem, ClientsStyle } from '../_types';

interface NormalizedClientItem {
  key: string;
  url: string;
  link: string;
  name: string;
}

interface ClientsSectionSharedProps {
  context: 'preview' | 'site';
  title: string;
  style: ClientsStyle;
  items: ClientItem[];
  tokens: ClientsColorTokens;
  carouselId?: string;
  device?: 'mobile' | 'tablet' | 'desktop';
}

export const normalizeClientsStyleSafe = (value: unknown): ClientsStyle => {
  if (
    value === 'bento'
    || value === 'staggered'
    || value === 'spotlight'
    || value === 'grid'
    || value === 'carousel'
    || value === 'featured'
  ) {
    return value;
  }
  return 'bento';
};

export const normalizeClientItems = (items: unknown): NormalizedClientItem[] => {
  if (!Array.isArray(items)) {
    return [];
  }

  const seen = new Set<string>();

  return items
    .map((raw, index) => {
      if (!raw || typeof raw !== 'object') {
        return null;
      }

      const source = raw as Record<string, unknown>;
      const url = typeof source.url === 'string' ? source.url.trim() : '';
      const link = typeof source.link === 'string' ? source.link.trim() : '';
      const name = typeof source.name === 'string' ? source.name.trim() : '';

      // Giữ items dù url rỗng (placeholder sẽ được render)
      // Chỉ dedupe items có url để tránh duplicate logos
      if (url && seen.has(url)) {
        return null;
      }
      if (url) {
        seen.add(url);
      }

      return {
        key: `client-${index}`,
        url,
        link,
        name,
      };
    })
    .filter((item): item is NormalizedClientItem => item !== null);
};

const getImageSizeClass = (size: 'sm' | 'md' | 'lg') => {
  if (size === 'lg') {return 'h-16 md:h-[4.5rem]';}
  if (size === 'sm') {return 'h-12 md:h-14';}
  return 'h-14 md:h-16';
};

const renderLogoContent = (
  item: NormalizedClientItem,
  idx: number,
  tokens: ClientsColorTokens,
  size: 'sm' | 'md' | 'lg',
) => (
  item.url ? (
    <PreviewImage
      src={item.url}
      alt={item.name || `Logo ${idx + 1}`}
      className={`${getImageSizeClass(size)} w-auto object-contain select-none`}
    />
  ) : (
    <div
      className={`${getImageSizeClass(size)} w-28 rounded-lg flex items-center justify-center`}
      style={{ backgroundColor: tokens.placeholderBackground }}
    >
      <ImageIcon size={22} style={{ color: tokens.placeholderIcon }} className="opacity-70" />
    </div>
  )
);

const renderLogoItem = (
  item: NormalizedClientItem,
  idx: number,
  tokens: ClientsColorTokens,
  size: 'sm' | 'md' | 'lg' = 'md',
) => {
  const content = renderLogoContent(item, idx, tokens, size);
  const ariaLabel = item.name || `Logo ${idx + 1}`;

  if (!item.link) {
    return (
      <div key={`${item.key}-${idx}`} className="shrink-0" role="listitem" aria-label={ariaLabel}>
        {content}
      </div>
    );
  }

  return (
    <a
      key={`${item.key}-${idx}`}
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="shrink-0"
      role="listitem"
      aria-label={ariaLabel}
    >
      {content}
    </a>
  );
};

const renderSectionTitle = (title: string, accentColor: string, headingColor: string) => (
  <h2 className="text-lg md:text-xl font-bold tracking-tight relative pl-3" style={{ color: headingColor }}>
    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-full" style={{ backgroundColor: accentColor }} />
    {title}
  </h2>
);

export function ClientsSectionShared({
  context,
  title,
  style,
  items,
  tokens,
  carouselId,
  device = 'desktop',
}: ClientsSectionSharedProps) {
  const normalizedItems = React.useMemo(() => normalizeClientItems(items), [items]);
  const selectedStyle = normalizeClientsStyleSafe(style);

  if (normalizedItems.length === 0) {
    return null;
  }

  const sectionTitle = title.trim().length > 0 ? title : 'Khách hàng tin tưởng';

  const bentoStyles = `
    @keyframes bento-scale { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.02); } }
    @keyframes bento-fade-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    .bento-item { animation: bento-fade-in 0.4s ease-out backwards; }
    .bento-item:hover { transform: scale(1.03); box-shadow: 0 8px 24px -4px rgba(0,0,0,0.12); }
    @media (prefers-reduced-motion: reduce) { .bento-item, .bento-item:hover { animation: none !important; transform: none !important; } }
  `;

  // Layout 1: Bento Grid - Modular asymmetric layout
  if (selectedStyle === 'bento') {
    const getBentoClass = (idx: number) => {
      const patterns = ['md:col-span-2 md:row-span-2', 'md:col-span-1', 'md:col-span-1', 'md:col-span-2', 'md:col-span-1', 'md:col-span-1'];
      return patterns[idx % patterns.length];
    };

    return (
      <section className="w-full py-10 border-b" style={{ backgroundColor: tokens.neutralBackground, borderColor: tokens.neutralBorder }} aria-label={sectionTitle}>
        <style>{bentoStyles}</style>
        <div className="w-full max-w-7xl mx-auto px-4 space-y-5">
          <div className="text-center space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider" style={{ backgroundColor: tokens.waveBadgeBackground, color: tokens.waveBadgeText }}>
              Đối tác tin cậy
            </div>
            <h2 className="text-lg md:text-xl font-bold tracking-tight" style={{ color: tokens.heading }}>{sectionTitle}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 auto-rows-fr gap-3 md:gap-4" role="list">
            {normalizedItems.map((item, idx) => (
              <div
                key={`bento-${item.key}-${idx}`}
                className={`bento-item rounded-xl border p-4 md:p-6 flex items-center justify-center transition-all duration-300 ${getBentoClass(idx)}`}
                style={{ backgroundColor: tokens.cardBackground, borderColor: tokens.cardBorder, animationDelay: `${idx * 0.05}s` }}
                role="listitem"
              >
                {renderLogoContent(item, idx, tokens, idx % 6 === 0 ? 'lg' : 'md')}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Layout 2: Staggered/Masonry - Pinterest-style waterfall
  if (selectedStyle === 'staggered') {
    const getStaggeredHeight = (idx: number) => {
      const heights = ['h-24', 'h-28', 'h-32', 'h-24', 'h-28'];
      return heights[idx % heights.length];
    };

    return (
      <section className="w-full py-10 border-b" style={{ backgroundColor: tokens.neutralSurface, borderColor: tokens.neutralBorder }} aria-label={sectionTitle}>
        <style>{bentoStyles}</style>
        <div className="w-full max-w-7xl mx-auto px-4 space-y-5">
          {renderSectionTitle(sectionTitle, tokens.sectionAccent, tokens.heading)}
          <div className="columns-2 md:columns-3 lg:columns-4 gap-3 md:gap-4" role="list">
            {normalizedItems.map((item, idx) => (
              <div
                key={`staggered-${item.key}-${idx}`}
                className={`bento-item break-inside-avoid mb-3 md:mb-4 rounded-lg border p-4 flex items-center justify-center transition-all duration-300 ${getStaggeredHeight(idx)}`}
                style={{ backgroundColor: tokens.cardBackground, borderColor: tokens.cardBorder, animationDelay: `${idx * 0.06}s` }}
                role="listitem"
              >
                {renderLogoContent(item, idx, tokens, 'sm')}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Layout 3: Spotlight - Hero center with orbit
  if (selectedStyle === 'spotlight') {
    const spotlightItems = normalizedItems.slice(0, 2);
    const orbitItems = normalizedItems.slice(2);

    return (
      <section className="w-full py-12 border-b" style={{ backgroundColor: tokens.neutralBackground, borderColor: tokens.neutralBorder }} aria-label={sectionTitle}>
        <style>{bentoStyles}</style>
        <div className="w-full max-w-7xl mx-auto px-4 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight" style={{ color: tokens.heading }}>{sectionTitle}</h2>
            <p className="text-sm" style={{ color: tokens.mutedText }}>Đối tác chiến lược & khách hàng doanh nghiệp</p>
          </div>
          
          {/* Spotlight center */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 py-6" role="list">
            {spotlightItems.map((item, idx) => (
              <div
                key={`spotlight-${item.key}-${idx}`}
                className="bento-item rounded-2xl border-2 p-8 md:p-10 flex items-center justify-center transition-all duration-300 min-w-[200px]"
                style={{ backgroundColor: tokens.cardBackground, borderColor: tokens.primary, animationDelay: `${idx * 0.1}s` }}
                role="listitem"
              >
                {renderLogoContent(item, idx, tokens, 'lg')}
              </div>
            ))}
          </div>

          {/* Orbit items */}
          {orbitItems.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 pt-4" role="list">
              {orbitItems.map((item, idx) => (
                <div
                  key={`orbit-${item.key}-${idx}`}
                  className="bento-item rounded-lg border p-3 flex items-center justify-center transition-all duration-300"
                  style={{ backgroundColor: tokens.cardBackground, borderColor: tokens.cardBorder, animationDelay: `${(idx + 2) * 0.08}s` }}
                  role="listitem"
                >
                  {renderLogoContent(item, idx + 2, tokens, 'sm')}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  if (selectedStyle === 'grid') {
    const maxVisible = context === 'preview' && device === 'mobile' ? 6 : 12;
    const visibleItems = normalizedItems.slice(0, maxVisible);
    const remainingCount = Math.max(0, normalizedItems.length - maxVisible);

    return (
      <section className="w-full py-8 border-b" style={{ backgroundColor: tokens.neutralSurface, borderColor: tokens.neutralBorder }} aria-label={sectionTitle}>
        <div className="w-full max-w-7xl mx-auto px-4 space-y-4">
          <div className="flex items-center justify-between gap-3">
            {renderSectionTitle(sectionTitle, tokens.sectionAccent, tokens.heading)}
            <span className="text-[10px] px-2 py-0.5 rounded-full border" style={{ backgroundColor: tokens.countBadgeBackground, color: tokens.countBadgeText, borderColor: tokens.countBadgeBorder }}>
              {normalizedItems.length} đối tác
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 py-3" role="list">
            {visibleItems.map((item, idx) => (
              <div key={`grid-${item.key}-${idx}`} className="p-3 rounded-lg border transition-colors flex flex-col items-center" style={{ backgroundColor: tokens.cardBackground, borderColor: tokens.cardBorder }} role="listitem">
                {renderLogoContent(item, idx, tokens, 'md')}
                {item.name ? <span className="text-[10px] text-center mt-1.5 truncate max-w-full" style={{ color: tokens.mutedText }}>{item.name}</span> : null}
              </div>
            ))}
            {remainingCount > 0 && (
              <div className="p-3 rounded-lg border flex flex-col items-center justify-center" style={{ backgroundColor: tokens.placeholderBackground, borderColor: tokens.cardBorder }} role="listitem">
                <div className="w-9 h-9 rounded-full flex items-center justify-center mb-1" style={{ backgroundColor: tokens.placeholderIconBackground }}>
                  <Plus size={18} style={{ color: tokens.placeholderIcon }} />
                </div>
                <span className="text-sm font-bold" style={{ color: tokens.countBadgeText }}>+{remainingCount}</span>
                <span className="text-[10px]" style={{ color: tokens.placeholderText }}>khác</span>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  if (selectedStyle === 'carousel') {
    const safeCarouselId = carouselId || 'clients-shared-carousel';

    return (
      <section className="w-full py-8 border-b" style={{ backgroundColor: tokens.neutralSurface, borderColor: tokens.neutralBorder }} aria-label={sectionTitle}>
        <style>{`#${safeCarouselId}::-webkit-scrollbar { display: none; }`}</style>
        <div className="w-full max-w-7xl mx-auto space-y-4">
          <div className="px-4 flex items-center justify-between gap-3">
            <div>
              {renderSectionTitle(sectionTitle, tokens.sectionAccent, tokens.heading)}
              <p className="pl-3 text-xs" style={{ color: tokens.mutedText }}>Vuốt để xem thêm</p>
            </div>
            {normalizedItems.length > 3 && (
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    const el = document.querySelector(`#${safeCarouselId}`);
                    if (el) {el.scrollBy({ behavior: 'smooth', left: -182 });}
                  }}
                  className="w-8 h-8 rounded-full flex items-center justify-center border"
                  style={{ backgroundColor: tokens.navButtonBackground, borderColor: tokens.navButtonBorder, color: tokens.navButtonText }}
                  aria-label="Cuộn trái"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const el = document.querySelector(`#${safeCarouselId}`);
                    if (el) {el.scrollBy({ behavior: 'smooth', left: 182 });}
                  }}
                  className="w-8 h-8 rounded-full flex items-center justify-center border"
                  style={{ backgroundColor: tokens.navButtonBackground, borderColor: tokens.navButtonBorder, color: tokens.navButtonText }}
                  aria-label="Cuộn phải"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>
          <div className="relative overflow-hidden mx-4 rounded-lg">
            <div className="absolute left-0 top-0 bottom-0 w-6 md:w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-6 md:w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
            <div
              id={safeCarouselId}
              className="flex overflow-x-auto snap-x snap-mandatory gap-3 py-3 px-1.5"
              style={{ WebkitOverflowScrolling: 'touch', msOverflowStyle: 'none', scrollbarWidth: 'none' }}
              role="list"
            >
              {normalizedItems.map((item, idx) => (
                <div key={`carousel-${item.key}-${idx}`} className="flex-shrink-0 snap-start w-[170px]" role="listitem">
                  <div className="h-full p-3 rounded-lg border flex flex-col items-center justify-center" style={{ backgroundColor: tokens.cardBackground, borderColor: tokens.cardBorder }}>
                    {renderLogoContent(item, idx, tokens, 'sm')}
                    {item.name ? <span className="text-[10px] text-center mt-1.5 truncate w-full" style={{ color: tokens.mutedText }}>{item.name}</span> : null}
                  </div>
                </div>
              ))}
              <div className="flex-shrink-0 w-3" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  const featuredItems = normalizedItems.slice(0, 4);
  const otherItems = normalizedItems.slice(4);
  const maxOther = context === 'preview' && device === 'mobile' ? 4 : 8;
  const visibleOthers = otherItems.slice(0, maxOther);
  const remainingCount = Math.max(0, otherItems.length - maxOther);

  return (
    <section className="w-full py-10 border-b" style={{ backgroundColor: tokens.neutralBackground, borderColor: tokens.neutralBorder }} aria-label={sectionTitle}>
      <div className="w-full max-w-7xl mx-auto px-4 space-y-5">
        <div className="text-center space-y-1">
          <h2 className="text-lg md:text-xl font-bold tracking-tight" style={{ color: tokens.heading }}>{sectionTitle}</h2>
          <p className="text-xs" style={{ color: tokens.mutedText }}>Được tin tưởng bởi các thương hiệu hàng đầu</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3" role="list">
          {featuredItems.map((item, idx) => (
            <div key={`featured-${item.key}-${idx}`} className="rounded-xl border flex flex-col items-center justify-center p-5" style={{ backgroundColor: tokens.cardBackground, borderColor: tokens.cardBorder }} role="listitem">
              {renderLogoContent(item, idx, tokens, 'lg')}
              {item.name ? <span className="font-medium text-center mt-2 truncate w-full text-xs" style={{ color: tokens.neutralText }}>{item.name}</span> : null}
            </div>
          ))}
        </div>

        {visibleOthers.length > 0 && (
          <div className="pt-4 border-t" style={{ borderColor: tokens.neutralBorder }}>
            <p className="text-center mb-3 text-xs" style={{ color: tokens.mutedText }}>Và nhiều đối tác khác</p>
            <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6" role="list">
              {visibleOthers.map((item, idx) => (
                <div key={`other-${item.key}-${idx}`} role="listitem">
                  {renderLogoContent(item, idx + featuredItems.length, tokens, 'sm')}
                </div>
              ))}
              {remainingCount > 0 ? (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full border" style={{ backgroundColor: tokens.countBadgeBackground, color: tokens.countBadgeText, borderColor: tokens.countBadgeBorder }}>
                  +{remainingCount}
                </span>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

