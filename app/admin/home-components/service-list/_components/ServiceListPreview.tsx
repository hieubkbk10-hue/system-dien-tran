'use client';

import React from 'react';
import { ArrowRight, ArrowUpRight, Briefcase, Plus } from 'lucide-react';
import { BrandBadge } from '@/components/site/shared/BrandColorHelpers';
import { cn } from '../../../components/ui';
import { BrowserFrame } from '../../_shared/components/BrowserFrame';
import { ColorInfoPanel } from '../../_shared/components/ColorInfoPanel';
import { PreviewImage } from '../../_shared/components/PreviewImage';
import { PreviewWrapper } from '../../_shared/components/PreviewWrapper';
import { deviceWidths, usePreviewDevice } from '../../_shared/hooks/usePreviewDevice';
import { SERVICE_LIST_STYLES } from '../_lib/constants';
import type { ServiceListPreviewItem, ServiceListStyle } from '../_types';

// Badge component for service tags
const ServiceBadge = ({ tag, brandColor, secondary }: { tag?: 'new' | 'hot'; brandColor: string; secondary: string }) => {
  if (!tag) {return null;}
  if (tag === 'hot') {
    return <BrandBadge text="Hot" variant="solid" brandColor={brandColor} secondary={secondary} className="text-[10px] px-2 py-1" />;
  }
  return <BrandBadge text="New" variant="outline" brandColor={brandColor} secondary={secondary} className="text-[10px] px-2 py-1" />;
};

// Format price helper
const formatServicePrice = (price?: string | number) => {
  if (!price) {return 'Liên hệ';}
  if (typeof price === 'string') {
    const num = Number.parseInt(price.replaceAll(/\D/g, ''));
    if (isNaN(num) || num === 0) {return 'Liên hệ';}
    return new Intl.NumberFormat('vi-VN', { currency: 'VND', maximumFractionDigits: 0, style: 'currency' }).format(num);
  }
  if (price === 0) {return 'Liên hệ';}
  return new Intl.NumberFormat('vi-VN', { currency: 'VND', maximumFractionDigits: 0, style: 'currency' }).format(price);
};

export const ServiceListPreview = ({ brandColor, secondary, itemCount, selectedStyle, onStyleChange, items, title: propTitle }: { 
  brandColor: string;
  secondary: string; 
  itemCount: number; 
  selectedStyle?: ServiceListStyle; 
  onStyleChange?: (style: ServiceListStyle) => void;
  items?: ServiceListPreviewItem[];
  title?: string;
}) => {
  const { device, setDevice } = usePreviewDevice();
  const previewStyle = selectedStyle ?? 'grid';
  const setPreviewStyle = (s: string) => onStyleChange?.(s as ServiceListStyle);
  const title = propTitle ?? 'Dịch vụ';

  // Mock data for preview - always show at least 6 items
  const mockServices: ServiceListPreviewItem[] = [
    { description: 'Phong cách hiện đại, tối giản với vật liệu cao cấp nhập khẩu từ Ý.', id: 1, name: 'Thiết kế Nội thất Penthouse', price: '0', tag: 'hot' as const },
    { description: 'Giải pháp bền vững cho đô thị.', id: 2, name: 'Kiến trúc Xanh Vertical', price: '15000000', tag: 'new' as const },
    { description: 'Không gian thiền định tại gia.', id: 3, name: 'Cảnh quan Sân vườn Zen', price: '8500000' },
    { description: 'Tự động hóa toàn diện.', id: 4, name: 'Smart Home Hub', price: '25000000' },
    { description: 'Phục dựng di sản.', id: 5, name: 'Biệt thự Cổ', price: '0' },
    { description: 'Nghệ thuật ánh sáng.', id: 6, name: 'Lighting Art', price: '12000000', tag: 'new' as const }
  ];

  // Use real items if provided, otherwise fallback to mock (luxury services)
  const targetCount = Math.max(itemCount, 6);
  const displayItems: ServiceListPreviewItem[] = items && items.length > 0 
    ? items 
    : mockServices.slice(0, targetCount);

  // Style 1: Grid - Clean cards với hover lift và arrow icon
  const renderGridStyle = () => (
    <section className="py-6 md:py-8 px-3 md:px-6">
      {/* Header */}
      <div className="flex flex-row items-center justify-between gap-3 border-b border-slate-200/40 dark:border-slate-700/40 pb-3 mb-4">
        <h2 className="text-xl md:text-2xl font-light tracking-tight text-slate-900 dark:text-slate-100">
          {title}
        </h2>
        <button className="group flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
          Xem tất cả 
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
      
      {/* Grid */}
      <div className={cn(
        "grid gap-4",
        device === 'mobile' ? 'grid-cols-1' : (device === 'tablet' ? 'grid-cols-2' : 'grid-cols-3')
      )}>
        {displayItems.slice(0, device === 'mobile' ? 3 : 6).map((item) => (
          <div 
            key={item.id} 
            className="group cursor-pointer relative bg-white dark:bg-slate-800 border rounded-lg flex flex-col hover:-translate-y-1 transition-all duration-300 h-full p-3"
            style={{ borderColor: `${secondary}10` }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${secondary}30`; e.currentTarget.style.boxShadow = `0 4px 12px ${secondary}10`; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${secondary}10`; e.currentTarget.style.boxShadow = 'none'; }}
          >
            {/* Badge */}
            {item.tag && (
              <div className="absolute z-20 top-5 left-5">
                <ServiceBadge tag={item.tag} brandColor={brandColor} secondary={secondary} />
              </div>
            )}

            {/* Image Container */}
            <div className="relative overflow-hidden bg-slate-100 dark:bg-slate-700 mb-3 rounded-lg aspect-[4/3] w-full">
              {item.image ? (
                <PreviewImage 
                  src={item.image} 
                  alt={item.name}
                  draggable={false}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Briefcase size={32} className="text-slate-300 dark:text-slate-500" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex flex-col justify-between flex-shrink-0 pt-1">
              <h3 className="font-medium text-base text-slate-900 dark:text-slate-100 leading-tight group-hover:opacity-70 transition-colors line-clamp-2">
                {item.name}
              </h3>

              <div className="flex items-end justify-between mt-3">
                <span className="text-sm font-semibold tracking-wide" style={{ color: secondary }}>
                  {formatServicePrice(item.price)}
                </span>
                <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" style={{ color: secondary }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  // Style 2: Bento - Asymmetric grid với featured large card
  const renderBentoStyle = () => {
    const bentoItems = displayItems.slice(0, 4);
    const remainingCount = displayItems.length - 4;
    
    return (
      <section className="py-6 md:py-8 px-3 md:px-6">
        {/* Header */}
        <div className="flex flex-row items-center justify-between gap-3 border-b border-slate-200/40 dark:border-slate-700/40 pb-3 mb-4">
          <h2 className="text-xl md:text-2xl font-light tracking-tight text-slate-900 dark:text-slate-100">
            {title}
          </h2>
          <button className="group flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
            Xem tất cả 
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
        
        {/* Bento Grid */}
        {device === 'mobile' ? (
          <div className="grid grid-cols-2 gap-3">
            {bentoItems.map((item) => (
              <div key={item.id} className="group cursor-pointer h-[160px] relative">
                <div 
                  className="h-full border rounded-xl p-3 transition-all flex flex-col"
                  style={{ borderColor: `${secondary}15` }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${secondary}40`; e.currentTarget.style.boxShadow = `0 4px 12px ${secondary}10`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${secondary}15`; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  {item.tag && (
                    <div className="absolute z-20 top-4 left-4">
                      <ServiceBadge tag={item.tag} brandColor={brandColor} secondary={secondary} />
                    </div>
                  )}
                  <div className="flex-1 rounded-md overflow-hidden bg-slate-100 dark:bg-slate-700 min-h-[80px] mb-2">
                    {item.image ? (
                      <PreviewImage src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Briefcase size={20} className="text-slate-300" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-sm font-medium leading-tight line-clamp-1">{item.name}</h3>
                  <span className="text-xs font-semibold mt-1" style={{ color: secondary }}>{formatServicePrice(item.price)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={cn(
            "grid gap-4 auto-rows-[300px]",
            device === 'tablet' ? 'grid-cols-3' : 'grid-cols-4'
          )}>
            {bentoItems.map((item, i) => {
              const isLastItem = i === 3;
              
              return (
                <div 
                  key={item.id}
                  className={cn(
                    "h-full min-h-[240px] relative group/bento",
                    i === 0 ? "col-span-2 row-span-2" : "",
                    i === 3 ? "col-span-2" : ""
                  )}
                >
                  <div 
                    className="h-full border rounded-xl p-4 transition-all flex flex-col cursor-pointer"
                    style={{ borderColor: `${secondary}15`, boxShadow: i === 0 ? `0 4px 20px ${secondary}08` : 'none' }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${secondary}40`; e.currentTarget.style.boxShadow = `0 8px 24px ${secondary}12`; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${secondary}15`; e.currentTarget.style.boxShadow = i === 0 ? `0 4px 20px ${secondary}08` : 'none'; }}
                  >
                    {item.tag && (
                      <div className="absolute z-20 top-6 left-6">
                        <ServiceBadge tag={item.tag} brandColor={brandColor} secondary={secondary} />
                      </div>
                    )}
                    
                    {/* Image */}
                    <div className="flex-1 min-h-[160px] w-full rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700 mb-3">
                      {item.image ? (
                        <PreviewImage 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover group-hover/bento:scale-105 transition-transform duration-700 ease-out"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Briefcase size={i === 0 ? 48 : 28} className="text-slate-300" />
                        </div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="space-y-1">
                      <h3 className={cn(
                        "font-medium text-slate-900 dark:text-slate-100 leading-tight group-hover/bento:opacity-70 transition-colors",
                        i === 0 ? 'text-lg' : 'text-base'
                      )}>
                        {item.name}
                      </h3>
                      {i === 0 && item.description && (
                        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                          {item.description}
                        </p>
                      )}
                      <div className="flex items-end justify-between mt-2">
                        <span className="text-sm font-semibold tracking-wide" style={{ color: secondary }}>
                          {formatServicePrice(item.price)}
                        </span>
                        <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover/bento:opacity-100 group-hover/bento:translate-x-0 transition-all duration-300" style={{ color: secondary }} />
                      </div>
                    </div>
                  </div>
                  
                  {/* "+N more" overlay on last item */}
                  {isLastItem && remainingCount > 0 && (
                    <div className="absolute inset-0 bg-slate-900/90 dark:bg-slate-100/90 backdrop-blur-[2px] rounded-xl flex items-center justify-center cursor-pointer transition-opacity opacity-100 md:opacity-0 md:group-hover/bento:opacity-100 z-30">
                      <div className="text-white dark:text-slate-900 text-center">
                        <span className="text-4xl font-light flex items-center justify-center gap-1">
                          <Plus className="w-8 h-8" />{remainingCount}
                        </span>
                        <p className="text-sm font-medium mt-1">Dịch vụ khác</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    );
  };

  // Style 3: List - Horizontal row layout với divider
  const renderListStyle = () => (
    <section className="py-6 md:py-8 px-3 md:px-6">
      {/* Header */}
      <div className="flex flex-row items-center justify-between gap-3 border-b border-slate-200/40 dark:border-slate-700/40 pb-3 mb-4">
        <h2 className="text-xl md:text-2xl font-light tracking-tight text-slate-900 dark:text-slate-100">
          {title}
        </h2>
        <button className="group flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
          Xem tất cả 
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
      
      {/* List */}
      <div className="flex flex-col gap-2 max-w-4xl mx-auto">
        {displayItems.slice(0, device === 'mobile' ? 4 : 6).map((item) => (
          <div 
            key={item.id}
            className="group cursor-pointer flex flex-row items-center gap-4 md:gap-6 py-4 border-b px-2 rounded-lg transition-all"
            style={{ borderColor: `${secondary}10` }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = `${secondary}05`; e.currentTarget.style.borderColor = `${secondary}20`; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = `${secondary}10`; }}
          >
            {/* Image */}
            <div className={cn(
              "flex-shrink-0 rounded-md overflow-hidden bg-slate-100 dark:bg-slate-700",
              device === 'mobile' ? 'w-20 h-20' : 'w-24 h-24'
            )}>
              {item.image ? (
                <PreviewImage 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Briefcase size={24} className="text-slate-300" />
                </div>
              )}
            </div>
            
            {/* Content */}
            <div className="py-1 flex-1">
              {item.tag && (
                <div className="mb-1">
                  <ServiceBadge tag={item.tag} brandColor={brandColor} secondary={secondary} />
                </div>
              )}
              <h3 className="font-medium text-base md:text-lg text-slate-900 dark:text-slate-100 leading-tight group-hover:opacity-70 transition-colors">
                {item.name}
              </h3>
              <div className="flex items-end justify-between mt-2">
                <span className="text-sm font-semibold tracking-wide" style={{ color: secondary }}>
                  {formatServicePrice(item.price)}
                </span>
                <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" style={{ color: secondary }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  // Style 4: Carousel - Horizontal scroll với snap (best practice: wider cards, snap-start, smooth scroll)
  const renderCarouselStyle = () => (
    <section className="py-6 md:py-8">
      {/* Header */}
      <div className="flex flex-row items-center justify-between gap-3 border-b border-slate-200/40 dark:border-slate-700/40 pb-3 mb-4 px-3 md:px-6">
        <h2 className="text-xl md:text-2xl font-light tracking-tight text-slate-900 dark:text-slate-100">
          {title}
        </h2>
        <button className="group flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
          Xem tất cả 
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
      
      {/* Carousel Container */}
      <div 
        className="flex gap-4 overflow-x-auto pb-4 px-3 md:px-6 snap-x snap-mandatory scroll-smooth"
        style={{ WebkitOverflowScrolling: 'touch', msOverflowStyle: 'none', scrollbarWidth: 'none' }}
      >
        {displayItems.map((item) => (
          <div 
            key={item.id} 
            className={cn(
              "snap-start flex-shrink-0",
              device === 'mobile' ? 'w-[75vw]' : 'w-[280px]'
            )}
          >
            <div 
              className="group cursor-pointer relative bg-white dark:bg-slate-800 border rounded-xl p-3 flex flex-col hover:-translate-y-1 transition-all duration-300 h-full"
              style={{ borderColor: `${secondary}10` }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${secondary}30`; e.currentTarget.style.boxShadow = `0 8px 20px ${secondary}12`; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${secondary}10`; e.currentTarget.style.boxShadow = 'none'; }}
            >
              {/* Badge */}
              {item.tag && (
                <div className="absolute z-20 top-5 left-5">
                  <ServiceBadge tag={item.tag} brandColor={brandColor} secondary={secondary} />
                </div>
              )}

              {/* Image Container */}
              <div className="relative overflow-hidden bg-slate-100 dark:bg-slate-700 mb-3 rounded-lg aspect-[4/3] w-full">
                {item.image ? (
                  <PreviewImage 
                    src={item.image} 
                    alt={item.name}
                    draggable={false}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Briefcase size={32} className="text-slate-300 dark:text-slate-500" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex flex-col justify-between flex-shrink-0 pt-1">
                <h3 className="font-medium text-base text-slate-900 dark:text-slate-100 leading-tight group-hover:opacity-70 transition-colors line-clamp-2">
                  {item.name}
                </h3>

                <div className="flex items-end justify-between mt-3">
                  <span className="text-sm font-semibold tracking-wide" style={{ color: secondary }}>
                    {formatServicePrice(item.price)}
                  </span>
                  <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" style={{ color: secondary }} />
                </div>
              </div>
            </div>
          </div>
        ))}
        {/* Spacer at end for last item visibility */}
        <div className="snap-start flex-shrink-0 w-3 md:w-6" aria-hidden="true" />
      </div>
    </section>
  );

  // Style 5: Minimal - Clean typography-first design with subtle cards
  const renderMinimalStyle = () => (
    <section className="py-6 md:py-8 px-3 md:px-6">
      {/* Header */}
      <div className="flex flex-row items-center justify-between gap-3 border-b border-slate-200/40 dark:border-slate-700/40 pb-3 mb-6">
        <h2 className="text-xl md:text-2xl font-light tracking-tight text-slate-900 dark:text-slate-100">
          {title}
        </h2>
        <button className="group flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
          Xem tất cả 
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
      {/* Minimal Grid */}
      <div className={cn(
        "grid gap-6",
        device === 'mobile' ? 'grid-cols-1' : (device === 'tablet' ? 'grid-cols-2' : 'grid-cols-3')
      )}>
        {displayItems.slice(0, device === 'mobile' ? 3 : 6).map((item) => (
          <div 
            key={item.id} 
            className="group cursor-pointer"
            onMouseEnter={(e) => { const img = e.currentTarget.querySelector('.img-wrapper'); if (img) {(img as HTMLElement).style.boxShadow = `0 8px 24px ${secondary}15`;} }}
            onMouseLeave={(e) => { const img = e.currentTarget.querySelector('.img-wrapper'); if (img) {(img as HTMLElement).style.boxShadow = 'none';} }}
          >
            {/* Image - More minimal, rounded corners */}
            <div className="img-wrapper relative overflow-hidden bg-slate-100 dark:bg-slate-800 rounded-2xl aspect-[3/2] mb-4 transition-shadow duration-300">
              {item.image ? (
                <PreviewImage src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Briefcase size={40} className="text-slate-300 dark:text-slate-600" />
                </div>
              )}
              {item.tag && (
                <div className="absolute top-3 left-3">
                  <ServiceBadge tag={item.tag} brandColor={brandColor} secondary={secondary} />
                </div>
              )}
            </div>
            {/* Content - Typography focused */}
            <div className="space-y-2">
              <h3 className="font-medium text-lg text-slate-900 dark:text-slate-100 leading-snug group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                {item.name}
              </h3>
              {item.description && (
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{item.description}</p>
              )}
              <div className="flex items-center justify-between pt-2">
                <span className="text-base font-semibold" style={{ color: secondary }}>{formatServicePrice(item.price)}</span>
                <span className="text-sm transition-colors flex items-center gap-1" style={{ color: `${secondary}80` }}>
                  Chi tiết <ArrowUpRight className="w-4 h-4" style={{ color: secondary }} />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  // Style 6: Showcase - Featured large item + grid of smaller items
  const renderShowcaseStyle = () => {
    const featuredItem = displayItems[0];
    const otherItems = displayItems.slice(1, 5);
    return (
      <section className="py-6 md:py-8 px-3 md:px-6">
        {/* Header */}
        <div className="flex flex-row items-center justify-between gap-3 border-b border-slate-200/40 dark:border-slate-700/40 pb-3 mb-6">
          <h2 className="text-xl md:text-2xl font-light tracking-tight text-slate-900 dark:text-slate-100">{title}</h2>
          <button className="group flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
            Xem tất cả <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
        {/* Showcase Layout */}
        {device === 'mobile' ? (
          <div className="space-y-4">
            {featuredItem && (
              <div className="group cursor-pointer relative rounded-2xl overflow-hidden aspect-[4/3]" style={{ boxShadow: `0 4px 20px ${secondary}15` }}>
                {featuredItem.image ? (
                  <PreviewImage src={featuredItem.image} alt={featuredItem.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center"><Briefcase size={48} className="text-slate-300" /></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                {featuredItem.tag && <div className="absolute top-3 left-3"><ServiceBadge tag={featuredItem.tag} brandColor={brandColor} secondary={secondary} /></div>}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <span className="text-xs uppercase tracking-wider font-medium" style={{ color: `${secondary}cc` }}>Nổi bật</span>
                  <h3 className="text-lg font-semibold text-white mt-1">{featuredItem.name}</h3>
                  <span className="text-sm font-medium text-white/90 mt-1 block">{formatServicePrice(featuredItem.price)}</span>
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              {otherItems.map((item) => (
                <div key={item.id} className="group cursor-pointer rounded-xl p-2 transition-all" style={{ backgroundColor: 'transparent' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = `${secondary}05`; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}>
                  <div className="relative overflow-hidden bg-slate-100 dark:bg-slate-800 rounded-xl aspect-square mb-2">
                    {item.image ? <PreviewImage src={item.image} alt={item.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Briefcase size={24} className="text-slate-300" /></div>}
                  </div>
                  <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100 line-clamp-1">{item.name}</h4>
                  <span className="text-xs font-semibold" style={{ color: secondary }}>{formatServicePrice(item.price)}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className={cn("grid gap-4", device === 'tablet' ? 'grid-cols-2' : 'grid-cols-3')}>
            {featuredItem && (
              <div className={cn("group cursor-pointer relative rounded-2xl overflow-hidden", device === 'desktop' ? 'row-span-2' : 'col-span-1')} style={{ boxShadow: `0 8px 30px ${secondary}20` }}>
                <div className="h-full min-h-[400px]">
                  {featuredItem.image ? (
                    <PreviewImage src={featuredItem.image} alt={featuredItem.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center"><Briefcase size={64} className="text-slate-300" /></div>
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                {featuredItem.tag && <div className="absolute top-4 left-4"><ServiceBadge tag={featuredItem.tag} brandColor={brandColor} secondary={secondary} /></div>}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="text-xs uppercase tracking-wider font-medium" style={{ color: `${secondary}cc` }}>Dịch vụ nổi bật</span>
                  <h3 className="text-xl md:text-2xl font-semibold text-white mt-2 leading-tight">{featuredItem.name}</h3>
                  {featuredItem.description && <p className="text-sm text-white/80 mt-2 line-clamp-2">{featuredItem.description}</p>}
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-lg font-semibold text-white">{formatServicePrice(featuredItem.price)}</span>
                    <button className="px-5 py-2.5 text-white text-sm font-medium rounded-lg transition-all hover:opacity-90 whitespace-nowrap" style={{ backgroundColor: secondary, boxShadow: `0 4px 12px ${secondary}40` }}>Xem chi tiết</button>
                  </div>
                </div>
              </div>
            )}
            <div className={cn("grid gap-3", device === 'desktop' ? 'col-span-2 grid-cols-2' : 'grid-cols-2')}>
              {otherItems.map((item) => (
                <div 
                  key={item.id} 
                  className="group cursor-pointer bg-white dark:bg-slate-800 border rounded-xl p-3 transition-all" 
                  style={{ borderColor: `${secondary}15` }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${secondary}40`; e.currentTarget.style.boxShadow = `0 4px 12px ${secondary}10`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${secondary}15`; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div className="relative overflow-hidden bg-slate-100 dark:bg-slate-700 rounded-lg aspect-[4/3] mb-3">
                    {item.image ? <PreviewImage src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <div className="w-full h-full flex items-center justify-center"><Briefcase size={28} className="text-slate-300" /></div>}
                    {item.tag && <div className="absolute top-2 left-2"><ServiceBadge tag={item.tag} brandColor={brandColor} secondary={secondary} /></div>}
                  </div>
                  <h4 className="font-medium text-sm text-slate-900 dark:text-slate-100 line-clamp-1 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">{item.name}</h4>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-semibold" style={{ color: secondary }}>{formatServicePrice(item.price)}</span>
                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: secondary }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    );
  };

  return (
    <>
      <PreviewWrapper title="Preview Dịch vụ" device={device} setDevice={setDevice} previewStyle={previewStyle} setPreviewStyle={setPreviewStyle} styles={SERVICE_LIST_STYLES} info={`${displayItems.length} dịch vụ`} deviceWidthClass={deviceWidths[device]}>
        <BrowserFrame url="yoursite.com/services">
          {previewStyle === 'grid' && renderGridStyle()}
          {previewStyle === 'bento' && renderBentoStyle()}
          {previewStyle === 'list' && renderListStyle()}
          {previewStyle === 'carousel' && renderCarouselStyle()}
          {previewStyle === 'minimal' && renderMinimalStyle()}
          {previewStyle === 'showcase' && renderShowcaseStyle()}
        </BrowserFrame>
      </PreviewWrapper>
      <ColorInfoPanel brandColor={brandColor} secondary={secondary} />
    </>
  );
};
