'use client';

import React, { useState } from 'react';
import { ArrowRight, ArrowUpRight, ChevronRight, Image as ImageIcon, Package, Plus } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { cn } from '../../../components/ui';
import { BrowserFrame } from '../../_shared/components/BrowserFrame';
import { PreviewImage } from '../../_shared/components/PreviewImage';
import { PreviewWrapper } from '../../_shared/components/PreviewWrapper';
import { deviceWidths, usePreviewDevice } from '../../_shared/hooks/usePreviewDevice';
import { getCategoryIcon } from '@/app/admin/components/CategoryImageSelector';
import { PRODUCT_CATEGORIES_STYLES } from '../_lib/constants';
import type { CategoryData, ProductCategoriesConfig, ProductCategoriesStyle } from '../_types';

export const ProductCategoriesPreview = ({ 
  config, 
  brandColor, 
  secondary,
  selectedStyle, 
  onStyleChange,
  categoriesData
}: { 
  config: ProductCategoriesConfig;
  brandColor: string;
  secondary: string;
  selectedStyle?: ProductCategoriesStyle;
  onStyleChange?: (style: ProductCategoriesStyle) => void;
  categoriesData: CategoryData[];
}) => {
  const { device, setDevice } = usePreviewDevice();
  const isMobile = device === 'mobile';
  const isTablet = device === 'tablet';
  const previewStyle = (selectedStyle ?? config.style) || 'grid';
  const setPreviewStyle = (s: string) => onStyleChange?.(s as ProductCategoriesStyle);
  const [isCircularDown, setIsCircularDown] = useState(false);
  const [isCircularDragging, setIsCircularDragging] = useState(false);
  const [circularStartX, setCircularStartX] = useState(0);
  const [circularScrollLeft, setCircularScrollLeft] = useState(0);
  const [circularScrollPosition, setCircularScrollPosition] = useState(0);
  const circularScrollRef = React.useRef<HTMLDivElement>(null);
  
  const productsData = useQuery(api.products.listAll, { limit: 100 });
  const categoryMap = React.useMemo(() => {
    const map: Record<string, CategoryData> = {};
    for (const cat of categoriesData) {
      map[cat._id] = cat;
    }
    return map;
  }, [categoriesData]);
  const productImageMap = React.useMemo(() => {
    const map: Record<string, { image?: string }> = {};
    if (productsData) {
      for (const product of productsData) {
        map[product._id] = { image: product.image };
      }
    }
    return map;
  }, [productsData]);

  const resolvedCategories = config.categories
    .map((item, idx) => {
      const cat = categoryMap[item.categoryId];
      if (!cat) {return null;}
      const imageMode = item.imageMode ?? 'default';
      let displayImage = cat.image;
      let displayIcon: string | undefined;
      
      if (imageMode === 'icon' && item.customImage?.startsWith('icon:')) {
        displayIcon = item.customImage.replace('icon:', '');
        displayImage = undefined;
      } else if (imageMode === 'product-image' && item.customImage?.startsWith('product:')) {
        const productId = item.customImage.replace('product:', '');
        displayImage = productImageMap[productId]?.image ?? cat.image;
      } else if (imageMode === 'upload' || imageMode === 'url') {
        displayImage = item.customImage ?? cat.image;
      }
      
      return {
        ...cat,
        itemId: item.id || idx,
        displayImage,
        displayIcon,
        imageMode,
      };
    })
    .filter(Boolean) as (CategoryData & { itemId: number; displayImage?: string; displayIcon?: string; imageMode: string })[];

  const getGridCols = () => {
    if (isMobile) {return config.columnsMobile === 3 ? 'grid-cols-3' : 'grid-cols-2';}
    if (isTablet) {return 'grid-cols-3';}
    switch (config.columnsDesktop) {
      case 3: { return 'grid-cols-3';
      }
      case 5: { return 'grid-cols-5';
      }
      case 6: { return 'grid-cols-6';
      }
      default: { return 'grid-cols-4';
      }
    }
  };

  const MAX_VISIBLE = isMobile ? 4 : (isTablet ? 6 : 8);
  const visibleCategories = resolvedCategories.slice(0, MAX_VISIBLE);
  const remainingCount = resolvedCategories.length - MAX_VISIBLE;

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div 
        className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
        style={{ backgroundColor: `${secondary}10` }}
      >
        <Package size={32} style={{ color: secondary }} />
      </div>
      <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-1">Chưa có danh mục nào</h3>
      <p className="text-sm text-slate-500">Thêm danh mục để bắt đầu hiển thị</p>
    </div>
  );

  const renderCategoryVisual = (cat: typeof resolvedCategories[0], size: 'sm' | 'md' | 'lg' = 'md') => {
    const iconData = cat.displayIcon ? getCategoryIcon(cat.displayIcon) : null;
    const iconSizes = { lg: isMobile ? 40 : 56, md: isMobile ? 32 : 40, sm: isMobile ? 24 : 28 };
    const iconSize = iconSizes[size];
    
    if (cat.displayIcon && iconData) {
      return (
        <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: brandColor }}>
          {React.createElement(iconData.icon, { className: 'text-white', size: iconSize })}
        </div>
      );
    }
    if (cat.displayImage) {
      return <PreviewImage src={cat.displayImage} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />;
    }
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800">
        <Package size={iconSize} className="text-slate-300" />
      </div>
    );
  };

  const renderGridStyle = () => {
    const gridItems = resolvedCategories.length <= 2 
      ? resolvedCategories 
      : visibleCategories;
    const containerClass = resolvedCategories.length === 1 
      ? 'max-w-xs mx-auto' 
      : (resolvedCategories.length === 2 
        ? 'max-w-lg mx-auto grid grid-cols-2 gap-4'
        : cn("grid gap-4", getGridCols()));

    return (
      <section className={cn("w-full", isMobile ? 'py-6 px-3' : 'py-10 px-6')}>
        <div className="max-w-7xl mx-auto">
          <h2 className={cn("font-bold mb-6 text-center text-slate-900 dark:text-slate-100", isMobile ? 'text-lg' : 'text-xl md:text-2xl')}>
            Danh mục sản phẩm
          </h2>
          
          {resolvedCategories.length === 0 ? renderEmptyState() : (
            <div className={containerClass}>
              {gridItems.map((cat) => (
                <div 
                  key={cat.itemId} 
                  className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer transition-all duration-300"
                  style={{ 
                    boxShadow: '0 2px 8px rgb(226 232 240 / 0.5)',
                    border: '1px solid rgb(226 232 240)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `0 8px 24px ${secondary}25`;
                    e.currentTarget.style.borderColor = secondary;
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 2px 8px rgb(226 232 240 / 0.5)';
                    e.currentTarget.style.borderColor = 'rgb(226 232 240)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {renderCategoryVisual(cat, 'lg')}
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"
                    style={{ height: '60%' }}
                  />
                  <div className={cn("absolute bottom-0 left-0 right-0 text-white z-10", isMobile ? 'p-3' : 'p-4')}>
                    <h3 className={cn("font-semibold line-clamp-1", isMobile ? 'text-sm' : 'text-base')}>{cat.name}</h3>
                    {config.showProductCount && (
                      <p className="text-xs mt-0.5" style={{ color: secondary }}>12 sản phẩm</p>
                    )}
                  </div>
                </div>
              ))}
              
              {remainingCount > 0 && resolvedCategories.length > 2 && (
                <div 
                  className="flex flex-col items-center justify-center aspect-square rounded-xl cursor-pointer transition-all"
                  style={{ backgroundColor: `${secondary}05`, border: `2px dashed ${secondary}20` }}
                >
                  <Plus size={isMobile ? 24 : 32} style={{ color: secondary }} className="mb-2" />
                  <span className={cn("font-bold", isMobile ? 'text-base' : 'text-lg')} style={{ color: secondary }}>
                    +{remainingCount}
                  </span>
                  <p className="text-xs text-slate-500 mt-1">danh mục khác</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    );
  };

  const renderCarouselStyle = () => (
    <section className={cn("w-full", isMobile ? 'py-6' : 'py-10')}>
      <div className="max-w-7xl mx-auto">
        <div className={cn("flex items-center justify-between mb-6", isMobile ? 'px-3' : 'px-6')}>
          <h2 className={cn("font-bold", isMobile ? 'text-lg' : 'text-xl md:text-2xl')}>Danh mục sản phẩm</h2>
          <button 
            className="text-sm font-medium flex items-center gap-1 hover:underline whitespace-nowrap"
            style={{ color: secondary }}
          >
            Xem tất cả <ChevronRight size={16} />
          </button>
        </div>
        
        {resolvedCategories.length === 0 ? (
          <div className={cn(isMobile ? 'px-3' : 'px-6')}>{renderEmptyState()}</div>
        ) : (
          <div className={cn("overflow-x-auto pb-4 scrollbar-hide", isMobile ? 'px-3' : 'px-6')}>
            <div className={cn("flex", isMobile ? 'gap-3' : 'gap-4')}>
              {resolvedCategories.map((cat) => (
                <div 
                  key={cat.itemId} 
                  className={cn("flex-shrink-0 group cursor-pointer", isMobile ? 'w-28' : 'w-40')}
                >
                  <div 
                    className="aspect-square rounded-xl overflow-hidden mb-2 transition-all"
                    style={{ border: `2px solid ${secondary}15` }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${secondary}40`; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${secondary}15`; }}
                  >
                    {renderCategoryVisual(cat, 'md')}
                  </div>
                  <h3 className={cn("font-medium text-center line-clamp-1", isMobile ? 'text-xs' : 'text-sm')}>
                    {cat.name}
                  </h3>
                  {config.showProductCount && (
                    <p className="text-xs text-slate-500 text-center">12 sản phẩm</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );

  const renderCardsStyle = () => {
    const displayItems = isMobile ? resolvedCategories.slice(0, 3) : resolvedCategories.slice(0, 6);
    
    return (
      <section className={cn("w-full", isMobile ? 'py-6 px-3' : 'py-10 px-6')} style={{ backgroundColor: `${secondary}05` }}>
        <div className="max-w-7xl mx-auto">
          <h2 className={cn("font-bold mb-6 text-center", isMobile ? 'text-lg' : 'text-xl md:text-2xl')}>
            Khám phá theo danh mục
          </h2>
          
          {resolvedCategories.length === 0 ? renderEmptyState() : (
            <div className={cn("grid", isMobile ? 'grid-cols-1 gap-3' : (isTablet ? 'grid-cols-2 gap-4' : 'grid-cols-3 gap-4'))}>
              {displayItems.map((cat) => (
                <div 
                  key={cat.itemId} 
                  className="group bg-white dark:bg-slate-800 rounded-xl overflow-hidden flex cursor-pointer transition-all"
                  style={{ border: `1px solid ${secondary}15` }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = `${secondary}40`;
                    e.currentTarget.style.boxShadow = `0 4px 12px ${secondary}15`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = `${secondary}15`;
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div className={cn("flex-shrink-0", isMobile ? 'w-20 h-20' : 'w-28 h-28')}>
                    {renderCategoryVisual(cat, 'sm')}
                  </div>
                  <div className={cn("flex-1 flex flex-col justify-center", isMobile ? 'p-3' : 'p-4')}>
                    <h3 className={cn("font-semibold line-clamp-1 mb-1", isMobile ? 'text-sm' : 'text-base')}>{cat.name}</h3>
                    {cat.description && (
                      <p className="text-xs text-slate-500 line-clamp-2 mb-2 min-h-[2rem]">{cat.description}</p>
                    )}
                    <span className="text-xs font-medium flex items-center gap-1" style={{ color: secondary }}>
                      Xem sản phẩm <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  };

  const renderMinimalStyle = () => (
    <section className={cn("w-full", isMobile ? 'py-6 px-3' : 'py-10 px-6')}>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className={cn("font-bold", isMobile ? 'text-lg' : 'text-xl')}>Danh mục</h2>
          <button className="text-sm font-medium hover:underline" style={{ color: secondary }}>
            Tất cả →
          </button>
        </div>
        
        {resolvedCategories.length === 0 ? renderEmptyState() : (
          <div className={cn("flex flex-wrap", isMobile ? 'gap-2' : 'gap-3')}>
            {resolvedCategories.map((cat) => {
              const iconData = cat.displayIcon ? getCategoryIcon(cat.displayIcon) : null;
              return (
                <div 
                  key={cat.itemId} 
                  className={cn(
                    "flex items-center gap-2 rounded-full cursor-pointer transition-all",
                    isMobile ? 'px-3 py-2' : 'px-4 py-2.5'
                  )}
                  style={{ 
                    backgroundColor: `${secondary}08`,
                    border: `1px solid ${secondary}20`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = `${brandColor}10`;
                    e.currentTarget.style.borderColor = `${brandColor}40`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = `${secondary}08`;
                    e.currentTarget.style.borderColor = `${secondary}20`;
                  }}
                >
                  {cat.displayIcon && iconData ? (
                    React.createElement(iconData.icon, { size: isMobile ? 14 : 16, style: { color: brandColor } })
                  ) : (cat.displayImage ? (
                    <PreviewImage src={cat.displayImage} alt="" className={cn("rounded-full object-cover", isMobile ? 'w-5 h-5' : 'w-6 h-6')} />
                  ) : (
                    <Package size={isMobile ? 14 : 16} style={{ color: brandColor }} />
                  ))}
                  <span className={cn("font-medium whitespace-nowrap", isMobile ? 'text-xs' : 'text-sm')}>
                    {cat.name}
                  </span>
                  {config.showProductCount && (
                    <span className="text-xs text-slate-400">(12)</span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );

  const renderMarqueeStyle = () => (
    <section className={cn("w-full overflow-hidden", isMobile ? 'py-6' : 'py-10')}>
      <div className="max-w-7xl mx-auto">
        <h2 className={cn("font-bold mb-6 text-center", isMobile ? 'text-lg px-3' : 'text-xl md:text-2xl')}>
          Khám phá danh mục
        </h2>
        
        {resolvedCategories.length === 0 ? (
          <div className={cn(isMobile ? 'px-3' : 'px-6')}>{renderEmptyState()}</div>
        ) : (
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-12 z-10 bg-gradient-to-r from-white dark:from-slate-900 to-transparent pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-12 z-10 bg-gradient-to-l from-white dark:from-slate-900 to-transparent pointer-events-none" />
            
            <div className="flex animate-marquee">
              {[...resolvedCategories, ...resolvedCategories].map((cat, idx) => (
                <div 
                  key={`${cat._id}-${idx}`} 
                  className={cn(
                    "flex-shrink-0 flex items-center gap-3 rounded-full cursor-pointer mx-2 transition-all",
                    isMobile ? 'px-3 py-2' : 'px-4 py-3'
                  )}
                  style={{ 
                    backgroundColor: 'white',
                    border: `2px solid ${secondary}20`,
                    boxShadow: `0 2px 8px ${secondary}10`
                  }}
                >
                  <div className={cn("rounded-full overflow-hidden flex-shrink-0", isMobile ? 'w-8 h-8' : 'w-10 h-10')}>
                    {renderCategoryVisual(cat, 'sm')}
                  </div>
                  <div className="min-w-0">
                    <h3 className={cn("font-semibold whitespace-nowrap", isMobile ? 'text-xs' : 'text-sm')}>
                      {cat.name}
                    </h3>
                    {config.showProductCount && (
                      <p className="text-xs text-slate-400 whitespace-nowrap">12 sản phẩm</p>
                    )}
                  </div>
                  <ArrowUpRight size={14} style={{ color: secondary }} className="flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );

  const handleCircularMouseDown = (e: React.MouseEvent) => {
    if (!circularScrollRef.current) {return;}
    setIsCircularDown(true);
    setIsCircularDragging(false);
    setCircularStartX(e.pageX - circularScrollRef.current.offsetLeft);
    setCircularScrollLeft(circularScrollRef.current.scrollLeft);
  };

  const handleCircularMouseMove = (e: React.MouseEvent) => {
    if (!isCircularDown || !circularScrollRef.current) {return;}
    e.preventDefault();
    const x = e.pageX - circularScrollRef.current.offsetLeft;
    const walk = (x - circularStartX) * 2;
    circularScrollRef.current.scrollLeft = circularScrollLeft - walk;

    if (Math.abs(x - circularStartX) > 5) {
      setIsCircularDragging(true);
    }
  };

  const handleCircularMouseUp = () => {
    setIsCircularDown(false);
    setTimeout(() => {
      setIsCircularDragging(false);
    }, 50);
  };

  const handleCircularMouseLeave = () => {
    setIsCircularDown(false);
    setIsCircularDragging(false);
  };

  const handleCircularScroll = () => {
    if (!circularScrollRef.current) {return;}
    const { scrollLeft, scrollWidth, clientWidth } = circularScrollRef.current;
    const maxScroll = scrollWidth - clientWidth;

    if (maxScroll <= 0) {
      setCircularScrollPosition(0);
      return;
    }

    const percentage = scrollLeft / maxScroll;

    if (percentage < 0.3) {
      setCircularScrollPosition(0);
    } else if (percentage > 0.7) {
      setCircularScrollPosition(2);
    } else {
      setCircularScrollPosition(1);
    }
  };

  const handleCircularPageChange = (index: number) => {
    if (!circularScrollRef.current) {return;}
    const { scrollWidth, clientWidth } = circularScrollRef.current;
    const maxScroll = scrollWidth - clientWidth;

    let targetLeft = 0;
    if (index === 1) {targetLeft = maxScroll / 2;}
    if (index === 2) {targetLeft = maxScroll;}

    circularScrollRef.current.scrollTo({ left: targetLeft, behavior: 'smooth' });
  };

  const renderCircularStyle = () => (
    <section className={cn("w-full", isMobile ? 'py-6' : 'py-10')}>
      <div className="max-w-7xl mx-auto">
        <h2 className={cn("font-bold mb-6 text-center px-3", isMobile ? 'text-lg' : 'text-xl md:text-2xl')}>
          Danh mục sản phẩm
        </h2>

        {resolvedCategories.length === 0 ? (
          <div className={cn(isMobile ? 'px-3' : 'px-6')}>{renderEmptyState()}</div>
        ) : (
          <>
            <div
              ref={circularScrollRef}
              className={cn(
                "flex overflow-x-auto scrollbar-hide pb-4 gap-5 snap-x snap-mandatory select-none",
                isMobile ? 'px-3' : 'px-6 md:px-11',
                isCircularDown ? 'cursor-grabbing' : 'cursor-grab'
              )}
              onMouseDown={handleCircularMouseDown}
              onMouseLeave={handleCircularMouseLeave}
              onMouseUp={handleCircularMouseUp}
              onMouseMove={handleCircularMouseMove}
              onScroll={handleCircularScroll}
              style={{ scrollBehavior: 'auto', WebkitOverflowScrolling: 'touch' }}
            >
              {resolvedCategories.map((cat) => (
                <div
                  key={cat.itemId}
                  className={cn("flex-shrink-0 snap-start group", isMobile ? 'w-[125px]' : 'w-[140px]')}
                  onClick={(e) => { if (isCircularDragging) {e.preventDefault();} }}
                >
                  <div
                    className="rounded-full overflow-hidden transition-all duration-300"
                    style={{
                      border: `1px solid ${secondary}15`,
                      padding: isMobile ? '15px' : '20px',
                      backgroundColor: `${secondary}05`
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = `0 2px 8px ${secondary}15`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div className="relative pb-[100%]">
                      <div className="absolute inset-0 rounded-full overflow-hidden">
                        {renderCategoryVisual(cat, 'md')}
                      </div>
                    </div>
                  </div>

                  <div className="text-center pt-3">
                    <h3 className={cn("font-semibold line-clamp-2 mb-1 leading-tight", isMobile ? 'text-sm min-h-[2rem]' : 'text-base min-h-[2.8rem]')}>
                      {cat.name}
                    </h3>

                    <div className="relative h-[27px] overflow-hidden w-full">
                      <span className={cn("block w-full text-slate-500 absolute top-0 left-0 transition-transform duration-300 group-hover:translate-y-full group-hover:opacity-0", isMobile ? 'text-xs' : 'text-sm')}>
                        {config.showProductCount ? '12 sản phẩm' : '\u00A0'}
                      </span>
                      <span
                        className={cn("block w-full underline absolute top-0 left-0 transition-transform duration-300 -translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100", isMobile ? 'text-xs' : 'text-sm')}
                        style={{ color: secondary }}
                      >
                        Xem chi tiết
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {resolvedCategories.length > 3 && (
              <div className="flex items-center justify-center mt-8 gap-[10px]">
                {[0, 1, 2].map((index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() =>{  handleCircularPageChange(index); }}
                    className={cn(
                      "inline-block h-[8px] rounded-[10px] cursor-pointer transition-all duration-300",
                      circularScrollPosition === index ? 'w-[28px]' : 'w-[8px] border'
                    )}
                    style={
                      circularScrollPosition === index
                        ? { backgroundColor: secondary }
                        : { borderColor: secondary, backgroundColor: 'transparent' }
                    }
                    aria-label={`Go to page ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );

  const getPreviewInfo = () => {
    const count = resolvedCategories.length;
    if (count === 0) {return 'Chưa có danh mục';}
    
    const sizeRecommendations: Record<string, string> = {
      cards: `${count} danh mục • Ảnh: 200×200px (1:1)`,
      carousel: `${count} danh mục • Ảnh: 300×300px (1:1)`,
      grid: `${count} danh mục • Ảnh: 400×400px (1:1)`,
      marquee: `${count} danh mục • Ảnh: 80×80px (1:1)`,
      minimal: `${count} danh mục • Icon/Ảnh: 48×48px`,
      circular: `${count} danh mục • Ảnh: 500×500px (1:1, tròn)`
    };
    return sizeRecommendations[previewStyle] || `${count} danh mục`;
  };

  return (
    <>
      <PreviewWrapper 
        title="Preview Danh mục sản phẩm" 
        device={device} 
        setDevice={setDevice} 
        previewStyle={previewStyle} 
        setPreviewStyle={setPreviewStyle} 
        styles={PRODUCT_CATEGORIES_STYLES} 
        info={getPreviewInfo()}
        deviceWidthClass={deviceWidths[device]}
      >
        <BrowserFrame>
          {previewStyle === 'grid' && renderGridStyle()}
          {previewStyle === 'carousel' && renderCarouselStyle()}
          {previewStyle === 'cards' && renderCardsStyle()}
          {previewStyle === 'minimal' && renderMinimalStyle()}
          {previewStyle === 'marquee' && renderMarqueeStyle()}
          {previewStyle === 'circular' && renderCircularStyle()}
        </BrowserFrame>
      </PreviewWrapper>
      
      <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
        <div className="flex items-start gap-2">
          <ImageIcon size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-slate-600 dark:text-slate-400">
            {previewStyle === 'grid' && (
              <p><strong>400×400px</strong> (1:1) • Ảnh vuông cho grid đều, overlay gradient tự động</p>
            )}
            {previewStyle === 'carousel' && (
              <p><strong>300×300px</strong> (1:1) • Ảnh vuông nhỏ gọn cho carousel horizontal</p>
            )}
            {previewStyle === 'cards' && (
              <p><strong>200×200px</strong> (1:1) • Thumbnail nhỏ bên trái card</p>
            )}
            {previewStyle === 'minimal' && (
              <p><strong>48×48px</strong> hoặc icon • Style text-based, ảnh chỉ làm accent</p>
            )}
            {previewStyle === 'marquee' && (
              <p><strong>80×80px</strong> (1:1) • Avatar nhỏ trong pill, auto-scroll animation</p>
            )}
            {previewStyle === 'circular' && (
              <p><strong>500×500px</strong> (1:1) • Ảnh vuông, tự động crop tròn</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
