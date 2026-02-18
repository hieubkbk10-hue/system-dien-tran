'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Image as ImageIcon, Plus, X } from 'lucide-react';
import { cn } from '../../../components/ui';
import { AutoScrollSlider } from '../../_shared/components/AutoScrollSlider';
import { BrowserFrame } from '../../_shared/components/BrowserFrame';
import { ColorInfoPanel } from '../../_shared/components/ColorInfoPanel';
import { PreviewImage } from '../../_shared/components/PreviewImage';
import { PreviewWrapper } from '../../_shared/components/PreviewWrapper';
import { deviceWidths, usePreviewDevice } from '../../_shared/hooks/usePreviewDevice';
import type { GalleryItem, GalleryStyle } from '../_types';
import { getGalleryColorTokens } from '../_lib/colors';

// Lightbox Component for Gallery - with Arrow Keys Navigation
const GalleryLightbox = ({ 
  photo, 
  onClose,
  photos,
  currentIndex,
  onNavigate
}: { 
  photo: { url: string } | null; 
  onClose: () => void;
  photos?: { url: string }[];
  currentIndex?: number;
  onNavigate?: (direction: 'prev' | 'next') => void;
}) => {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {onClose();}
      if (e.key === 'ArrowLeft' && onNavigate) {onNavigate('prev');}
      if (e.key === 'ArrowRight' && onNavigate) {onNavigate('next');}
    };
    if (photo) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [photo, onClose, onNavigate]);

  if (!photo || !photo.url) {return null;}

  const hasMultiple = photos && photos.length > 1 && onNavigate;

  return (
    <div 
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950 animate-in fade-in duration-200" 
      onClick={onClose}
    >
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-slate-300 hover:text-white transition-colors z-[70]"
        aria-label="Đóng"
      >
        <X size={24} />
      </button>
      
      {/* Navigation Arrows */}
      {hasMultiple && (
        <>
          <button 
            onClick={(e) => { e.stopPropagation(); onNavigate('prev'); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors z-[70]"
            aria-label="Ảnh trước"
          >
            <ChevronLeft size={24} className="text-white" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onNavigate('next'); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors z-[70]"
            aria-label="Ảnh sau"
          >
            <ChevronRight size={24} className="text-white" />
          </button>
        </>
      )}
      
      {/* Counter */}
      {hasMultiple && typeof currentIndex === 'number' && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-slate-200 text-sm z-[70]">
          {currentIndex + 1} / {photos.length}
        </div>
      )}
      
      <div className="w-full h-full p-4 flex flex-col items-center justify-center" onClick={e =>{  e.stopPropagation(); }}>
        <PreviewImage 
          src={photo.url} 
          alt="Lightbox" 
          className="max-h-[90vh] max-w-full object-contain shadow-sm animate-in zoom-in-95 duration-300" 
        />
      </div>
    </div>
  );
};

export const GalleryPreview = ({ items, brandColor, secondary, mode, selectedStyle, onStyleChange }: { 
  items: GalleryItem[]; 
  brandColor: string;
  secondary: string; 
  mode: 'single' | 'dual';
  selectedStyle?: GalleryStyle; 
  onStyleChange?: (style: GalleryStyle) => void;
}): React.ReactElement => {
  const { device, setDevice } = usePreviewDevice();
  const [isPaused, setIsPaused] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);
  const colors = getGalleryColorTokens({ primary: brandColor, secondary, mode });
  const ONE = 1;
  const NEGATIVE_ONE = -1;
  let previewStyle = selectedStyle;
  if (!previewStyle) {
    previewStyle = 'spotlight';
  }
  const setPreviewStyle = (styleKey: string): void => {
    if (onStyleChange) {
      onStyleChange(styleKey as GalleryStyle);
    }
  };
  
  // Lightbox navigation handler
  const handleLightboxNavigate = (direction: 'prev' | 'next'): void => {
    if (!selectedPhoto) {return;}
    const currentIdx = items.findIndex(item => item.id === selectedPhoto.id);
    if (currentIdx === NEGATIVE_ONE) {return;}
    let newIdx = currentIdx + ONE;
    if (direction === 'prev') {
      newIdx = currentIdx - ONE + items.length;
    }
    setSelectedPhoto(items[newIdx % items.length]);
  };

  // Get current photo index for lightbox
  let currentPhotoIndex = NEGATIVE_ONE;
  if (selectedPhoto) {
    currentPhotoIndex = items.findIndex(item => item.id === selectedPhoto.id);
  }

  const styles: { id: string; label: string }[] = [
    { id: 'spotlight', label: 'Tiêu điểm' }, 
    { id: 'explore', label: 'Khám phá' },
    { id: 'stories', label: 'Câu chuyện' },
    { id: 'grid', label: 'Grid' },
    { id: 'marquee', label: 'Marquee' },
    { id: 'masonry', label: 'Masonry' }
  ];

  // ============ GALLERY STYLES (Spotlight, Explore, Stories) ============
  
  // Style 1: Tiêu điểm (Spotlight) - Featured image with 3 smaller
  const renderSpotlightStyle = () => {
    if (items.length === 0) {return renderGalleryEmptyState();}
    const featured = items[0];
    const sub = items.slice(1, 4);

    return (
      <div className={cn(
        "grid gap-1 bg-slate-200 dark:bg-slate-700 border border-transparent",
        device === 'mobile' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'
      )}>
        <div 
          className={cn(
            "bg-slate-100 dark:bg-slate-800 relative group cursor-pointer overflow-hidden",
            device === 'mobile' ? 'aspect-[4/3]' : 'md:col-span-2 aspect-[4/3] md:aspect-auto md:row-span-1'
          )}
          style={device !== 'mobile' ? { minHeight: '300px' } : {}}
          onClick={() =>{  setSelectedPhoto(featured); }}
        >
          {featured.url ? (
            <PreviewImage src={featured.url} alt="" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
          ) : (
            <div className="w-full h-full flex items-center justify-center"><ImageIcon size={48} className="text-slate-300" /></div>
          )}
          <div
            className="absolute inset-0 border-2 opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ borderColor: colors.sectionAccentBar }}
          />
        </div>
        <div className={cn(
          "grid gap-1",
          device === 'mobile' ? 'grid-cols-3' : 'grid-cols-1'
        )}>
          {sub.map((photo) => (
            <div 
              key={photo.id} 
              className="aspect-square bg-slate-100 dark:bg-slate-800 relative group cursor-pointer overflow-hidden"
              onClick={() =>{  setSelectedPhoto(photo); }}
            >
              {photo.url ? (
                <PreviewImage src={photo.url} alt="" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
              ) : (
                <div className="w-full h-full flex items-center justify-center"><ImageIcon size={24} className="text-slate-300" /></div>
              )}
              <div
                className="absolute inset-0 border-2 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ borderColor: colors.sectionAccentBar }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Style 2: Khám phá (Explore) - Instagram-like grid
  const renderExploreStyle = () => {
    if (items.length === 0) {return renderGalleryEmptyState();}

    return (
      <div className={cn(
        "grid gap-0.5 bg-slate-200 dark:bg-slate-700",
        device === 'mobile' ? 'grid-cols-3' : (device === 'tablet' ? 'grid-cols-4' : 'grid-cols-5')
      )}>
        {items.map((photo) => (
          <div 
            key={photo.id} 
            className="aspect-square relative group cursor-pointer overflow-hidden bg-slate-100 dark:bg-slate-800"
            onClick={() =>{  setSelectedPhoto(photo); }}
          >
            {photo.url ? (
              <PreviewImage 
                src={photo.url} 
                alt="" 
                className="w-full h-full object-cover transition-opacity duration-300 hover:opacity-90"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center"><ImageIcon size={24} className="text-slate-300" /></div>
            )}
            <div
              className="absolute inset-0 border-2 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ borderColor: colors.sectionAccentBar }}
            />
          </div>
        ))}
      </div>
    );
  };

  // Style 3: Câu chuyện (Stories) - Masonry-like with varying sizes
  const renderStoriesStyle = () => {
    if (items.length === 0) {return renderGalleryEmptyState();}

    return (
      <div className={cn(
        "grid gap-4",
        device === 'mobile' ? 'grid-cols-1 auto-rows-[200px]' : 'grid-cols-1 md:grid-cols-3 auto-rows-[250px] md:auto-rows-[300px]'
      )}>
        {items.map((photo, i) => {
          const isLarge = i % 4 === 0 || i % 4 === 3;
          const colSpan = device !== 'mobile' && isLarge ? "md:col-span-2" : "md:col-span-1";
          
          return (
            <div 
              key={photo.id} 
              className={`${colSpan} relative group cursor-pointer overflow-hidden rounded-sm`}
              onClick={() =>{  setSelectedPhoto(photo); }}
            >
              {photo.url ? (
                <PreviewImage 
                  src={photo.url} 
                  alt="" 
                  className="w-full h-full object-cover transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <ImageIcon size={32} className="text-slate-300" />
                </div>
              )}
              <div
                className="absolute inset-0 border-2 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ borderColor: colors.sectionAccentBar }}
              />
            </div>
          );
        })}
      </div>
    );
  };

  // ============ GALLERY STYLES 4-6 (Grid, Marquee, Masonry) ============
  // Best Practices: Lightbox with keyboard nav, lazy loading, +N pattern

  // Gallery Empty State with brandColor
  const renderGalleryEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: colors.placeholderBg }}>
        <ImageIcon size={32} style={{ color: colors.placeholderIcon }} />
      </div>
      <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-1">Chưa có hình ảnh nào</h3>
      <p className="text-sm text-slate-500">Thêm ảnh đầu tiên để bắt đầu</p>
    </div>
  );

  // Style 4: Gallery Grid - Clean equal squares grid
  const renderGalleryGridStyle = () => {
    if (items.length === 0) {return renderGalleryEmptyState();}

    const MAX_VISIBLE = device === 'mobile' ? 6 : (device === 'tablet' ? 9 : 12);
    const visibleItems = items.slice(0, MAX_VISIBLE);
    const remainingCount = items.length - MAX_VISIBLE;

    // Centered layout for 1-2 items
    if (items.length <= 2) {
      return (
        <div className="py-8 px-4">
          <div className={cn("mx-auto flex items-center justify-center gap-4", items.length === 1 ? 'max-w-sm' : 'max-w-xl')}>
            {items.map((photo) => (
              <div 
                key={photo.id} 
                className="flex-1 aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-pointer group"
                onClick={() =>{  setSelectedPhoto(photo); }}
              >
                {photo.url ? (
                  <PreviewImage src={photo.url} alt="" className="w-full h-full object-cover transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><ImageIcon size={40} className="text-slate-300" /></div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="py-8 px-4">
        <div className={cn(
          "grid gap-2",
          device === 'mobile' ? 'grid-cols-2' : (device === 'tablet' ? 'grid-cols-3' : 'grid-cols-4')
        )}>
          {visibleItems.map((photo) => (
            <div 
              key={photo.id} 
              className="aspect-square rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-pointer group relative"
              onClick={() =>{  setSelectedPhoto(photo); }}
            >
              {photo.url ? (
                <PreviewImage src={photo.url} alt="" className="w-full h-full object-cover transition-transform duration-500" />
              ) : (
                <div className="w-full h-full flex items-center justify-center"><ImageIcon size={28} className="text-slate-300" /></div>
              )}
              <div
                className="absolute inset-0 border-2 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ borderColor: colors.sectionAccentBar }}
              />
            </div>
          ))}
          {/* +N remaining */}
          {remainingCount > 0 && (
            <div 
              className="aspect-square rounded-lg overflow-hidden flex flex-col items-center justify-center cursor-pointer"
              style={{ backgroundColor: colors.badgeBg }}
            >
              <Plus size={28} style={{ color: colors.iconColor }} className="mb-1" />
              <span className="text-lg font-bold" style={{ color: colors.badgeText }}>+{remainingCount}</span>
              <span className="text-xs" style={{ color: colors.mutedText }}>ảnh khác</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Style 5: Gallery Marquee - Auto scroll horizontal
  const renderGalleryMarqueeStyle = () => {
    if (items.length === 0) {return renderGalleryEmptyState();}

    return (
      <div className="py-8">
        <div className="w-full relative" onMouseEnter={() =>{  setIsPaused(true); }} onMouseLeave={() =>{  setIsPaused(false); }}>
          <AutoScrollSlider speed={0.6} isPaused={isPaused}>
            {items.map((photo) => (
              <div 
                key={`gallery-marquee-${photo.id}`} 
                className="shrink-0 h-48 md:h-64 aspect-[4/3] rounded-xl overflow-hidden cursor-pointer group relative"
                onClick={() =>{  setSelectedPhoto(photo); }}
              >
                {photo.url ? (
                  <PreviewImage src={photo.url} alt="" className="w-full h-full object-cover transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <ImageIcon size={32} className="text-slate-300" />
                  </div>
                )}
                <div
                  className="absolute inset-0 border-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ borderColor: colors.sectionAccentBar }}
                />
              </div>
            ))}
          </AutoScrollSlider>
        </div>
      </div>
    );
  };

  // Style 6: Gallery Masonry - Pinterest-like varying heights
  const renderGalleryMasonryStyle = () => {
    if (items.length === 0) {return renderGalleryEmptyState();}

    const MAX_VISIBLE = device === 'mobile' ? 6 : 10;
    const visibleItems = items.slice(0, MAX_VISIBLE);
    const remainingCount = items.length - MAX_VISIBLE;

    // Centered layout for 1-2 items
    if (items.length <= 2) {
      return (
        <div className="py-8 px-4">
          <div className={cn("mx-auto flex items-center justify-center gap-4", items.length === 1 ? 'max-w-md' : 'max-w-2xl')}>
            {items.map((photo, idx) => (
              <div 
                key={photo.id} 
                className={cn("flex-1 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-pointer group", idx % 2 === 0 ? 'aspect-[3/4]' : 'aspect-[4/3]')}
                onClick={() =>{  setSelectedPhoto(photo); }}
              >
                {photo.url ? (
                  <PreviewImage src={photo.url} alt="" className="w-full h-full object-cover transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><ImageIcon size={40} className="text-slate-300" /></div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Masonry layout with CSS columns
    return (
      <div className="py-8 px-4">
        <div className={cn(
          "gap-3",
          device === 'mobile' ? 'columns-2' : (device === 'tablet' ? 'columns-3' : 'columns-4')
        )}>
          {visibleItems.map((photo, idx) => {
            // Varying heights for masonry effect
            const heights = ['h-48', 'h-64', 'h-56', 'h-72', 'h-52', 'h-60'];
            const heightClass = heights[idx % heights.length];
            
            return (
              <div 
                key={photo.id} 
                className={cn("mb-3 break-inside-avoid rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-pointer group relative", heightClass)}
                onClick={() =>{  setSelectedPhoto(photo); }}
              >
                {photo.url ? (
                <PreviewImage src={photo.url} alt="" className="w-full h-full object-cover transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><ImageIcon size={28} className="text-slate-300" /></div>
                )}
              <div
                className="absolute inset-0 border-2 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ borderColor: colors.sectionAccentBar }}
              />
              </div>
            );
          })}
        </div>
        {/* +N remaining */}
        {remainingCount > 0 && (
          <div className="flex items-center justify-center mt-4">
            <span className="text-sm font-medium px-4 py-2 rounded-full" style={{ backgroundColor: colors.badgeBg, color: colors.badgeText }}>
              +{remainingCount} ảnh khác
            </span>
          </div>
        )}
      </div>
    );
  };

  // Render Gallery styles with container and Lightbox (with keyboard navigation)
  const renderGalleryContent = () => (
    <section className="w-full bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-[1600px] py-8 md:py-12">
        <div className="mx-auto mb-6 h-1 w-12 rounded-full" style={{ backgroundColor: colors.sectionAccentBar }} />
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 ease-out">
          {previewStyle === 'spotlight' && renderSpotlightStyle()}
          {previewStyle === 'explore' && renderExploreStyle()}
          {previewStyle === 'stories' && renderStoriesStyle()}
          {previewStyle === 'grid' && renderGalleryGridStyle()}
          {previewStyle === 'marquee' && renderGalleryMarqueeStyle()}
          {previewStyle === 'masonry' && renderGalleryMasonryStyle()}
        </div>
      </div>
      <GalleryLightbox 
        photo={selectedPhoto} 
        onClose={() =>{  setSelectedPhoto(null); }}
        photos={items}
        currentIndex={currentPhotoIndex}
        onNavigate={handleLightboxNavigate}
      />
    </section>
  );

  // Generate image size info based on style and item count
  const getGalleryImageSizeInfo = () => {
    const count = items.length;
    switch (previewStyle) {
      case 'spotlight': {
        if (count === 0) {return 'Chưa có ảnh';}
        if (count === 1) {return 'Ảnh 1: 1200×800px (3:2)';}
        if (count <= 4) {return `Ảnh 1: 1200×800px • Ảnh 2-${count}: 600×600px`;}
        return `Ảnh 1: 1200×800px • Ảnh 2-4: 600×600px (+${count - 4} ảnh)`;
      }
      case 'explore': {
        return `${count} ảnh • Tất cả: 600×600px (1:1)`;
      }
      case 'stories': {
        if (count === 0) {return 'Chưa có ảnh';}
        const largeCount = Math.ceil(count / 4) * 2; // Ảnh 1,4,5,8... chiếm 2 cột
        const smallCount = count - largeCount;
        return `${largeCount} ảnh lớn: 1200×600px • ${smallCount} ảnh nhỏ: 800×600px`;
      }
      case 'grid': {
        return `${count} ảnh • Tất cả: 800×800px (1:1)`;
      }
      case 'marquee': {
        return `${count} ảnh • Tất cả: 800×600px (4:3)`;
      }
      case 'masonry': {
        return `${count} ảnh • Ngang: 600×400px • Dọc: 600×900px • Vuông: 600×600px`;
      }
      default: {
        return `${count} ảnh`;
      }
    }
  };

  return (
    <>
      <PreviewWrapper 
        title="Preview Thư viện ảnh" 
        device={device} 
        setDevice={setDevice} 
        previewStyle={previewStyle} 
        setPreviewStyle={setPreviewStyle} 
        styles={styles} 
        info={`${getGalleryImageSizeInfo()} • ${mode === 'dual' ? '2 màu' : '1 màu'}`}
        deviceWidthClass={deviceWidths[device]}
      >
        <BrowserFrame>
          {renderGalleryContent()}
        </BrowserFrame>
      </PreviewWrapper>
      {mode === 'dual' ? <ColorInfoPanel brandColor={brandColor} secondary={secondary} /> : null}
    </>
  );
};
