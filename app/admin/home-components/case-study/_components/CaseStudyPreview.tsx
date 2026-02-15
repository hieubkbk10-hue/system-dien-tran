'use client';

import React, { useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, FileText, Image as ImageIcon, Plus } from 'lucide-react';
import { cn } from '../../../components/ui';
import { BrowserFrame } from '../../_shared/components/BrowserFrame';
import { PreviewImage } from '../../_shared/components/PreviewImage';
import { PreviewWrapper } from '../../_shared/components/PreviewWrapper';
import { deviceWidths, usePreviewDevice } from '../../_shared/hooks/usePreviewDevice';
import { CASE_STUDY_STYLES } from '../_lib/constants';
import type { CaseStudyProject, CaseStudyStyle } from '../_types';

export const CaseStudyPreview = ({
  projects,
  brandColor,
  secondary: _secondary,
  selectedStyle,
  onStyleChange,
}: {
  projects: CaseStudyProject[];
  brandColor: string;
  secondary: string;
  selectedStyle?: CaseStudyStyle;
  onStyleChange?: (style: CaseStudyStyle) => void;
}) => {
  const { device, setDevice } = usePreviewDevice();
  const [carouselIndex, setCarouselIndex] = useState(0);
  const previewStyle = selectedStyle ?? 'grid';
  const setPreviewStyle = (s: string) => onStyleChange?.(s as CaseStudyStyle);

  const getImageSizeInfo = () => {
    const count = projects.length;
    if (count === 0) {return 'Chưa có dự án';}
    switch (previewStyle) {
      case 'grid':
        return `${count} dự án • Tất cả: 1200×800px (3:2)`;
      case 'featured':
        if (count === 1) {return 'Dự án 1: 1200×800px (3:2)';}
        return `Dự án 1: 1200×800px • Dự án 2-${Math.min(count, 3)}: 600×600px (1:1)`;
      case 'list':
        return `${count} dự án • Tất cả: 800×500px (16:10)`;
      case 'masonry':
        return `${count} dự án • Ngang: 800×500px • Dọc: 600×900px • Vuông: 800×800px`;
      case 'carousel':
        return `${count} dự án • Tất cả: 1000×750px (4:3)`;
      case 'timeline':
        return `${count} dự án • Tất cả: 800×600px (4:3)`;
      default:
        return `${count} dự án`;
    }
  };

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: `${brandColor}10` }}>
        <FileText size={32} style={{ color: brandColor }} />
      </div>
      <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-1">Chưa có dự án nào</h3>
      <p className="text-sm text-slate-500">Thêm dự án đầu tiên để bắt đầu</p>
    </div>
  );

  const renderGridStyle = () => {
    const maxVisible = device === 'mobile' ? 4 : (device === 'tablet' ? 6 : 9);
    const visibleProjects = projects.slice(0, maxVisible);
    const remainingCount = projects.length - maxVisible;

    return (
      <div className={cn("px-4", device === 'mobile' ? 'py-4' : 'py-8')}>
        <h3 className={cn("font-bold text-center mb-6", device === 'mobile' ? 'text-lg' : 'text-xl')}>Dự án tiêu biểu</h3>
        {projects.length === 0 ? <EmptyState /> : (
          <div className="max-w-6xl mx-auto">
            <div className={cn("grid", device === 'mobile' ? 'grid-cols-1 gap-3' : (device === 'tablet' ? 'grid-cols-2 gap-4' : 'grid-cols-3 gap-6'))}>
              {visibleProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden border group transition-all cursor-pointer"
                  style={{ borderColor: `${brandColor}15` }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = `${brandColor}40`;
                    e.currentTarget.style.boxShadow = `0 4px 12px ${brandColor}10`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = `${brandColor}15`;
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div className="aspect-[3/2] bg-slate-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
                    {project.image ? (
                      <PreviewImage src={project.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <ImageIcon size={32} className="text-slate-300" />
                    )}
                  </div>
                  <div className={cn("flex flex-col h-full", device === 'mobile' ? 'p-3' : 'p-4')}>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full w-fit" style={{ backgroundColor: `${brandColor}15`, color: brandColor }}>
                      {project.category || 'Category'}
                    </span>
                    <h4 className="font-semibold mt-2 mb-1 line-clamp-2 min-h-[3rem]">{project.title || 'Tên dự án'}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 min-h-[2.5rem]">{project.description || 'Mô tả dự án...'}</p>
                    <div className="mt-3 flex items-center gap-1 text-sm font-medium transition-all" style={{ color: brandColor }}>
                      Xem chi tiết <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              ))}
              {remainingCount > 0 && (
                <div className="flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-xl aspect-square border" style={{ borderColor: `${brandColor}15` }}>
                  <div className="text-center">
                    <Plus size={32} className="mx-auto mb-2 text-slate-400" />
                    <span className="text-lg font-bold text-slate-600 dark:text-slate-300">+{remainingCount}</span>
                    <p className="text-xs text-slate-400">dự án khác</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderFeaturedStyle = () => (
    <div className={cn("px-4", device === 'mobile' ? 'py-4' : 'py-8')}>
      <h3 className={cn("font-bold text-center mb-6", device === 'mobile' ? 'text-lg' : 'text-xl')}>Dự án nổi bật</h3>
      {projects.length === 0 ? <EmptyState /> : (
        <div className="max-w-6xl mx-auto">
          <div className={cn("grid gap-4", device === 'mobile' ? 'grid-cols-1' : 'grid-cols-2')}>
            {projects[0] && (
              <div
                className={cn(
                  "bg-white dark:bg-slate-800 rounded-xl overflow-hidden border group transition-all cursor-pointer",
                  device === 'mobile' ? '' : 'row-span-2'
                )}
                style={{ borderColor: `${brandColor}15` }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${brandColor}40`;
                  e.currentTarget.style.boxShadow = `0 8px 24px ${brandColor}15`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = `${brandColor}15`;
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div className="aspect-[3/2] bg-slate-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
                  {projects[0].image ? (
                    <PreviewImage src={projects[0].image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <ImageIcon size={48} className="text-slate-300" />
                  )}
                </div>
                <div className="p-5">
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: `${brandColor}15`, color: brandColor }}>
                    {projects[0].category || 'Category'}
                  </span>
                  <h3 className={cn("font-bold mt-2 mb-2", device === 'mobile' ? 'text-lg' : 'text-xl')}>{projects[0].title || 'Dự án chính'}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{projects[0].description || 'Mô tả dự án...'}</p>
                </div>
              </div>
            )}
            <div className="space-y-4">
              {projects.slice(1, 3).map((project) => (
                <div
                  key={project.id}
                  className="bg-white dark:bg-slate-800 rounded-xl p-4 border flex items-center gap-4 group transition-all cursor-pointer"
                  style={{ borderColor: `${brandColor}15` }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = `${brandColor}40`;
                    e.currentTarget.style.boxShadow = `0 4px 12px ${brandColor}10`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = `${brandColor}15`;
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div className="w-20 h-20 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {project.image ? (
                      <PreviewImage src={project.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <ImageIcon size={24} className="text-slate-300" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: `${brandColor}15`, color: brandColor }}>
                      {project.category || 'Category'}
                    </span>
                    <h4 className="font-semibold text-sm mt-1 truncate">{project.title || 'Tên dự án'}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">{project.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderListStyle = () => {
    const maxVisible = device === 'mobile' ? 4 : 6;
    const visibleProjects = projects.slice(0, maxVisible);
    const remainingCount = projects.length - maxVisible;

    return (
      <div className={cn("px-4", device === 'mobile' ? 'py-4' : 'py-8')}>
        <h3 className={cn("font-bold text-center mb-6", device === 'mobile' ? 'text-lg' : 'text-xl')}>Danh sách dự án</h3>
        {projects.length === 0 ? <EmptyState /> : (
          <div className="max-w-6xl mx-auto">
            <div className="space-y-3">
              {visibleProjects.map((project) => (
                <div
                  key={project.id}
                  className={cn(
                    "bg-white dark:bg-slate-800 rounded-xl overflow-hidden border flex group transition-all cursor-pointer",
                    device === 'mobile' ? 'flex-col' : 'items-center'
                  )}
                  style={{ borderColor: `${brandColor}15` }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = `${brandColor}40`;
                    e.currentTarget.style.boxShadow = `0 4px 12px ${brandColor}10`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = `${brandColor}15`;
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div className={cn(
                    "bg-slate-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden",
                    device === 'mobile' ? 'aspect-video w-full' : 'w-40 h-24 flex-shrink-0'
                  )}>
                    {project.image ? (
                      <PreviewImage src={project.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <ImageIcon size={24} className="text-slate-300" />
                    )}
                  </div>
                  <div className="p-4 flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: `${brandColor}15`, color: brandColor }}>
                        {project.category || 'Category'}
                      </span>
                    </div>
                    <h4 className="font-semibold truncate">{project.title || 'Tên dự án'}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{project.description || 'Mô tả...'}</p>
                  </div>
                </div>
              ))}
            </div>
            {remainingCount > 0 && (
              <div className="text-center mt-4">
                <span className="text-sm font-medium" style={{ color: brandColor }}>+{remainingCount} dự án khác</span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderMasonryStyle = () => {
    const maxVisible = device === 'mobile' ? 6 : 9;
    const visibleProjects = projects.slice(0, maxVisible);
    const remainingCount = projects.length - maxVisible;

    return (
      <div className={cn("px-4", device === 'mobile' ? 'py-4' : 'py-8')}>
        <h3 className={cn("font-bold text-center mb-6", device === 'mobile' ? 'text-lg' : 'text-xl')}>Portfolio Masonry</h3>
        {projects.length === 0 ? <EmptyState /> : (
          <div className="max-w-6xl mx-auto">
            <div className={cn("columns-1 gap-4", device === 'tablet' && 'columns-2', device === 'desktop' && 'columns-3')}>
              {visibleProjects.map((project, idx) => {
                const heights = ['aspect-[4/5]', 'aspect-[4/3]', 'aspect-square'];
                const height = heights[idx % 3];
                return (
                  <div
                    key={project.id}
                    className="break-inside-avoid mb-4 bg-white dark:bg-slate-800 rounded-xl overflow-hidden border group transition-all cursor-pointer"
                    style={{ borderColor: `${brandColor}15` }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = `${brandColor}40`;
                      e.currentTarget.style.boxShadow = `0 4px 12px ${brandColor}10`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = `${brandColor}15`;
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div className={cn(height, "bg-slate-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden")}>
                      {project.image ? (
                        <PreviewImage src={project.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <ImageIcon size={32} className="text-slate-300" />
                      )}
                    </div>
                    <div className="p-3">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: `${brandColor}15`, color: brandColor }}>
                        {project.category || 'Category'}
                      </span>
                      <h4 className="font-semibold text-sm mt-2 line-clamp-2">{project.title || 'Tên dự án'}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{project.description || 'Mô tả...'}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            {remainingCount > 0 && (
              <div className="text-center mt-6">
                <span className="text-sm font-medium" style={{ color: brandColor }}>+{remainingCount} dự án khác</span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderCarouselStyle = () => {
    const itemsPerView = device === 'mobile' ? 1 : (device === 'tablet' ? 2 : 3);
    const maxIndex = Math.max(0, projects.length - itemsPerView);

    return (
      <div className={cn("px-4", device === 'mobile' ? 'py-4' : 'py-8')}>
        <h3 className={cn("font-bold text-center mb-6", device === 'mobile' ? 'text-lg' : 'text-xl')}>Portfolio Carousel</h3>
        {projects.length === 0 ? <EmptyState /> : (
          <div className="max-w-6xl mx-auto relative">
            {projects.length > itemsPerView && (
              <>
                <button
                  type="button"
                  onClick={() =>{  setCarouselIndex(Math.max(0, carouselIndex - 1)); }}
                  disabled={carouselIndex === 0}
                  className="absolute -left-2 md:-left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-lg border flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110"
                  style={{ borderColor: `${brandColor}20` }}
                >
                  <ChevronLeft size={20} style={{ color: brandColor }} />
                </button>
                <button
                  type="button"
                  onClick={() =>{  setCarouselIndex(Math.min(maxIndex, carouselIndex + 1)); }}
                  disabled={carouselIndex >= maxIndex}
                  className="absolute -right-2 md:-right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-lg border flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110"
                  style={{ borderColor: `${brandColor}20` }}
                >
                  <ChevronRight size={20} style={{ color: brandColor }} />
                </button>
              </>
            )}
            <div className="overflow-hidden mx-4 md:mx-8">
              <div
                className="flex transition-transform duration-300 ease-out gap-4"
                style={{ transform: `translateX(-${carouselIndex * (100 / itemsPerView)}%)` }}
              >
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="flex-shrink-0 bg-white dark:bg-slate-800 rounded-xl overflow-hidden border group transition-all"
                    style={{
                      borderColor: `${brandColor}15`,
                      width: `calc(${100 / itemsPerView}% - ${(itemsPerView - 1) * 16 / itemsPerView}px)`
                    }}
                  >
                    <div className="aspect-[4/3] bg-slate-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
                      {project.image ? (
                        <PreviewImage src={project.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <ImageIcon size={32} className="text-slate-300" />
                      )}
                    </div>
                    <div className="p-4">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: `${brandColor}15`, color: brandColor }}>
                        {project.category || 'Category'}
                      </span>
                      <h4 className="font-semibold mt-2 line-clamp-2 min-h-[3rem]">{project.title || 'Tên dự án'}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 min-h-[2.5rem]">{project.description || 'Mô tả...'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {projects.length > itemsPerView && (
              <div className="flex justify-center gap-2 mt-4">
                {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() =>{  setCarouselIndex(idx); }}
                    className={cn("h-2 rounded-full transition-all", carouselIndex === idx ? 'w-6' : 'w-2')}
                    style={{ backgroundColor: carouselIndex === idx ? brandColor : `${brandColor}30` }}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderTimelineStyle = () => {
    const maxVisible = device === 'mobile' ? 4 : 6;
    const visibleProjects = projects.slice(0, maxVisible);
    const remainingCount = projects.length - maxVisible;

    return (
      <div className={cn("px-4", device === 'mobile' ? 'py-4' : 'py-8')}>
        <h3 className={cn("font-bold text-center mb-6", device === 'mobile' ? 'text-lg' : 'text-xl')}>Timeline Dự án</h3>
        {projects.length === 0 ? <EmptyState /> : (
          <div className="max-w-4xl mx-auto relative">
            <div
              className={cn("absolute top-0 bottom-0 w-0.5", device === 'mobile' ? 'left-4' : 'left-1/2 -translate-x-px')}
              style={{ backgroundColor: `${brandColor}20` }}
            />
            <div className="space-y-6 md:space-y-8">
              {visibleProjects.map((project, idx) => (
                <div
                  key={project.id}
                  className={cn("relative flex items-start", device === 'mobile' ? 'pl-12' : (idx % 2 === 0 ? 'flex-row' : 'flex-row-reverse'))}
                >
                  <div
                    className={cn(
                      "absolute w-8 h-8 rounded-full border-4 bg-white dark:bg-slate-900 flex items-center justify-center text-xs font-bold z-10",
                      device === 'mobile' ? 'left-0' : 'left-1/2 -translate-x-1/2'
                    )}
                    style={{ borderColor: brandColor, color: brandColor }}
                  >
                    {idx + 1}
                  </div>
                  <div
                    className={cn(
                      "bg-white dark:bg-slate-800 rounded-xl overflow-hidden border transition-all",
                      device === 'mobile' ? 'w-full' : 'w-5/12'
                    )}
                    style={{ borderColor: `${brandColor}15` }}
                  >
                    <div className="aspect-[4/3] bg-slate-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
                      {project.image ? (
                        <PreviewImage src={project.image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon size={32} className="text-slate-300" />
                      )}
                    </div>
                    <div className="p-4">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: `${brandColor}15`, color: brandColor }}>
                        {project.category || 'Category'}
                      </span>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 mt-2 mb-1 line-clamp-2">{project.title || 'Tên dự án'}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">{project.description || 'Mô tả...'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {remainingCount > 0 && (
              <div className="text-center mt-6">
                <span className="text-sm font-medium" style={{ color: brandColor }}>+{remainingCount} dự án khác</span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <PreviewWrapper
      title="Preview Projects"
      device={device}
      setDevice={setDevice}
      previewStyle={previewStyle}
      setPreviewStyle={setPreviewStyle}
      styles={CASE_STUDY_STYLES}
      deviceWidthClass={deviceWidths[device]}
      info={getImageSizeInfo()}
    >
      <BrowserFrame url="yoursite.com/projects">
        {previewStyle === 'grid' && renderGridStyle()}
        {previewStyle === 'featured' && renderFeaturedStyle()}
        {previewStyle === 'list' && renderListStyle()}
        {previewStyle === 'masonry' && renderMasonryStyle()}
        {previewStyle === 'carousel' && renderCarouselStyle()}
        {previewStyle === 'timeline' && renderTimelineStyle()}
      </BrowserFrame>

      <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
        <div className="flex items-start gap-2">
          <ImageIcon size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-slate-600 dark:text-slate-400">
            {previewStyle === 'grid' && (
              <p><strong>1200×800px</strong> (3:2) • Grid layout đều, hover scale effect</p>
            )}
            {previewStyle === 'featured' && (
              <p><strong>Dự án chính:</strong> 1200×800px (3:2) • <strong>Dự án phụ:</strong> 600×600px (1:1)</p>
            )}
            {previewStyle === 'list' && (
              <p><strong>800×500px</strong> (16:10) • Horizontal list, thumb bên trái</p>
            )}
            {previewStyle === 'masonry' && (
              <p><strong>Pinterest-style:</strong> Ngang 800×500px • Dọc 600×900px • Vuông 800×800px</p>
            )}
            {previewStyle === 'carousel' && (
              <p><strong>1000×750px</strong> (4:3) • Carousel với navigation buttons & dots</p>
            )}
            {previewStyle === 'timeline' && (
              <p><strong>800×600px</strong> (4:3) • Timeline dọc, alternate left-right</p>
            )}
          </div>
        </div>
      </div>
    </PreviewWrapper>
  );
};
