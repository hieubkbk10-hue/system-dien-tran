'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { getBrandColors } from '@/lib/utils/colors';
import { cn } from '../../../components/ui';
import { BrowserFrame } from '../../_shared/components/BrowserFrame';
import { PreviewImage } from '../../_shared/components/PreviewImage';
import { PreviewWrapper } from '../../_shared/components/PreviewWrapper';
import { deviceWidths, usePreviewDevice } from '../../_shared/hooks/usePreviewDevice';
import { getHeroColors, getSliderColors } from '../_lib/colors';
import { HERO_STYLES } from '../_lib/constants';
import type { HeroContent, HeroHarmony, HeroStyle } from '../_types';

export const HeroPreview = ({ 
  slides, 
  brandColor,
  secondary,
  mode = 'dual',
  selectedStyle = 'slider',
  onStyleChange,
  content,
  harmony = 'analogous',
}: { 
  slides: { id: number; image: string; link: string }[]; 
  brandColor: string;
  secondary: string;
  mode?: 'single' | 'dual';
  selectedStyle?: HeroStyle;
  onStyleChange?: (style: HeroStyle) => void;
  content?: HeroContent;
  harmony?: HeroHarmony;
}) => {
  const { device, setDevice } = usePreviewDevice();
  const [currentSlide, setCurrentSlide] = useState(0);
  const previewStyle = selectedStyle ?? 'slider';
  const setPreviewStyle = (style: string) => onStyleChange?.(style as HeroStyle);
  const info = previewStyle !== 'bento' ? `Slide ${currentSlide + 1} / ${slides.length || 1}` : undefined;
  const brandColors = getBrandColors({
    mode,
    primary: brandColor,
    secondary,
  });
  const colors = getHeroColors(brandColors.primary, brandColors.secondary, brandColors.useDualBrand);
  const sliderColors = getSliderColors(brandColors.primary, brandColors.secondary, mode, harmony);

  const nextSlide = () =>{  setCurrentSlide((prev) => (prev + 1) % slides.length); };
  const prevSlide = () =>{  setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length); };

  const renderSlideWithBlur = (slide: { image: string }, idx: number) => (
    <div className="block w-full h-full relative">
      <div 
        className="absolute inset-0 scale-110"
        style={{
          backgroundImage: `url(${slide.image})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          filter: 'blur(30px)',
        }}
      />
      <div className="absolute inset-0 bg-black/20" />
      <PreviewImage 
        src={slide.image} 
        alt={`Slide ${idx + 1}`}
        className="relative w-full h-full object-contain z-10"
      />
    </div>
  );

  const renderPlaceholder = (idx: number, useSliderColors = false) => {
    const placeholderBg = useSliderColors ? sliderColors.placeholderBg : colors.primaryTintMedium;
    const placeholderIconColor = useSliderColors ? sliderColors.placeholderIconColor : colors.primarySolid;
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-2" style={{ backgroundColor: placeholderBg }}>
          <ImageIcon size={24} style={{ color: placeholderIconColor }} />
        </div>
        <div className="text-sm font-medium text-slate-400">Banner #{idx + 1}</div>
        <div className="text-xs text-slate-500 mt-1">Khuyến nghị: 1920x600px</div>
      </div>
    );
  };

  const renderSliderStyle = () => (
    <section className="relative w-full bg-slate-900 overflow-hidden">
      <div className={cn(
        "relative w-full",
        device === 'mobile' ? 'aspect-[16/9] max-h-[200px]' : (device === 'tablet' ? 'aspect-[16/9] max-h-[250px]' : 'aspect-[21/9] max-h-[280px]')
      )}>
        {slides.length > 0 ? (
          <>
            {slides.map((slide, idx) => (
              <div key={slide.id} className={cn("absolute inset-0 transition-opacity duration-700", idx === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none")}>
                {slide.image ? renderSlideWithBlur(slide, idx) : renderPlaceholder(idx, true)}
              </div>
            ))}
            {slides.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prevSlide}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full shadow-lg flex items-center justify-center transition-all z-20 border-2 hover:scale-105"
                  style={{
                    backgroundColor: sliderColors.navButtonBg,
                    borderColor: sliderColors.navButtonBorderColor,
                  }}
                >
                  <ChevronLeft size={14} style={{ color: sliderColors.navButtonIconColor }} />
                </button>
                <button
                  type="button"
                  onClick={nextSlide}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full shadow-lg flex items-center justify-center transition-all z-20 border-2 hover:scale-105"
                  style={{
                    backgroundColor: sliderColors.navButtonBgHover,
                    borderColor: sliderColors.navButtonBorderColor,
                  }}
                >
                  <ChevronRight size={14} style={{ color: sliderColors.navButtonIconColor }} />
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() =>{  setCurrentSlide(idx); }}
                      className={cn("w-2 h-2 rounded-full transition-all", idx === currentSlide ? "w-6" : "")}
                      style={{
                        backgroundColor: idx === currentSlide ? sliderColors.dotActive : sliderColors.dotInactive,
                      }}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-800"><span className="text-slate-400 text-sm">Chưa có banner</span></div>
        )}
      </div>
    </section>
  );

  const renderFadeStyle = () => (
    <section className="relative w-full bg-slate-900 overflow-hidden">
      <div className={cn(
        "relative w-full",
        device === 'mobile' ? 'aspect-[16/9] max-h-[220px]' : (device === 'tablet' ? 'aspect-[16/9] max-h-[270px]' : 'aspect-[21/9] max-h-[300px]')
      )}>
        {slides.length > 0 ? (
          <>
            {slides.map((slide, idx) => (
              <div key={slide.id} className={cn("absolute inset-0 transition-opacity duration-700", idx === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none")}>
                {slide.image ? renderSlideWithBlur(slide, idx) : renderPlaceholder(idx)}
              </div>
            ))}
            {slides.length > 1 && (
              <div className="absolute bottom-0 left-0 right-0 p-2 flex justify-center gap-2 bg-gradient-to-t from-black/60 to-transparent z-20">
                {slides.map((slide, idx) => (
                  <button key={idx} type="button" onClick={() =>{  setCurrentSlide(idx); }}
                    className={cn("rounded overflow-hidden transition-all border-2", idx === currentSlide ? "scale-105" : "border-transparent opacity-70 hover:opacity-100", device === 'mobile' ? 'w-10 h-7' : 'w-14 h-9')}
                    style={idx === currentSlide ? { borderColor: colors.secondarySolid } : {}}>
                    {slide.image ? <PreviewImage src={slide.image} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full" style={{ backgroundColor: colors.primarySolid }}></div>}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-800"><span className="text-slate-400 text-sm">Chưa có banner</span></div>
        )}
      </div>
    </section>
  );

  const renderBentoStyle = () => {
    const bentoSlides = slides.slice(0, 4);
    const mobileBentoTints = [
      colors.primaryTintLight,
      colors.primaryTintMedium,
      brandColors.getTint(0.3),
      brandColors.getTint(0.35),
    ];
    return (
      <section className="relative w-full bg-slate-900 overflow-hidden p-2">
        <div className={cn(
          "relative w-full",
          device === 'mobile' ? 'max-h-[240px]' : (device === 'tablet' ? 'max-h-[280px]' : 'max-h-[300px]')
        )}>
          {device === 'mobile' ? (
            <div className="grid grid-cols-2 gap-2 h-full">
              {bentoSlides.slice(0, 4).map((slide, idx) => (
                <div key={slide.id} className="relative rounded-xl overflow-hidden aspect-video">
                  {slide.image ? (
                    <div className="w-full h-full relative">
                      <div className="absolute inset-0 scale-110" style={{ backgroundImage: `url(${slide.image})`, backgroundPosition: 'center', backgroundSize: 'cover', filter: 'blur(20px)' }} />
                      <div className="absolute inset-0 bg-black/20" />
                      <PreviewImage src={slide.image} alt="" className="relative w-full h-full object-contain z-10" />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: mobileBentoTints[idx] ?? colors.primaryTintMedium }}><ImageIcon size={20} className="text-white/50" /></div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-4 grid-rows-2 gap-2 h-full" style={{ height: device === 'desktop' ? '280px' : '260px' }}>
              <div className="col-span-2 row-span-2 relative rounded-xl overflow-hidden ring-2 ring-offset-1 ring-offset-slate-900" style={{ '--tw-ring-color': colors.secondaryTintRing } as React.CSSProperties}>
                {bentoSlides[0]?.image ? (
                  <div className="w-full h-full relative">
                    <div className="absolute inset-0 scale-110" style={{ backgroundImage: `url(${bentoSlides[0].image})`, backgroundPosition: 'center', backgroundSize: 'cover', filter: 'blur(25px)' }} />
                    <div className="absolute inset-0 bg-black/20" />
                    <PreviewImage src={bentoSlides[0].image} alt="" className="relative w-full h-full object-contain z-10" />
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center" style={{ backgroundColor: colors.primaryTintLight }}>
                    <ImageIcon size={28} style={{ color: colors.primarySolid }} /><span className="text-xs text-slate-400 mt-1">Banner chính</span>
                  </div>
                )}
              </div>
              <div className="col-span-2 relative rounded-xl overflow-hidden">
                {bentoSlides[1]?.image ? (
                  <div className="w-full h-full relative">
                    <div className="absolute inset-0 scale-110" style={{ backgroundImage: `url(${bentoSlides[1].image})`, backgroundPosition: 'center', backgroundSize: 'cover', filter: 'blur(20px)' }} />
                    <div className="absolute inset-0 bg-black/20" />
                    <PreviewImage src={bentoSlides[1].image} alt="" className="relative w-full h-full object-contain z-10" />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: brandColors.getTint(0.2) }}><ImageIcon size={20} className="text-white/50" /></div>
                )}
              </div>
              <div className="relative rounded-xl overflow-hidden">
                {bentoSlides[2]?.image ? (
                  <div className="w-full h-full relative">
                    <div className="absolute inset-0 scale-110" style={{ backgroundImage: `url(${bentoSlides[2].image})`, backgroundPosition: 'center', backgroundSize: 'cover', filter: 'blur(15px)' }} />
                    <div className="absolute inset-0 bg-black/20" />
                    <PreviewImage src={bentoSlides[2].image} alt="" className="relative w-full h-full object-contain z-10" />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: colors.primaryTintMedium }}><ImageIcon size={16} className="text-white/50" /></div>
                )}
              </div>
              <div className="relative rounded-xl overflow-hidden">
                {bentoSlides[3]?.image ? (
                  <div className="w-full h-full relative">
                    <div className="absolute inset-0 scale-110" style={{ backgroundImage: `url(${bentoSlides[3].image})`, backgroundPosition: 'center', backgroundSize: 'cover', filter: 'blur(15px)' }} />
                    <div className="absolute inset-0 bg-black/20" />
                    <PreviewImage src={bentoSlides[3].image} alt="" className="relative w-full h-full object-contain z-10" />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: brandColors.getTint(0.3) }}><ImageIcon size={16} className="text-white/50" /></div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    );
  };

  const renderFullscreenStyle = () => {
    const mainSlide = slides[currentSlide] || slides[0];
    const c = content ?? {};
    return (
      <section className="relative w-full bg-slate-900 overflow-hidden">
        <div className={cn(
          "relative w-full",
          device === 'mobile' ? 'h-[280px]' : (device === 'tablet' ? 'h-[350px]' : 'h-[400px]')
        )}>
          {slides.length > 0 && mainSlide ? (
            <>
              {slides.map((slide, idx) => (
                <div key={slide.id} className={cn("absolute inset-0 transition-opacity duration-1000", idx === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none")}>
                  {slide.image ? (
                    <div className="w-full h-full relative">
                      <PreviewImage src={slide.image} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
                    </div>
                  ) : renderPlaceholder(idx)}
                </div>
              ))}
              <div className={cn(
                "absolute inset-0 z-10 flex flex-col justify-center",
                device === 'mobile' ? 'px-4' : 'px-8 md:px-16'
              )}>
                <div className={cn("max-w-xl", device === 'mobile' ? 'space-y-3' : 'space-y-4')}>
                  {c.badge && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: colors.secondaryTintMedium, color: colors.secondarySolid }}>
                      <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: colors.primarySolid }} />
                      {c.badge}
                    </div>
                  )}
                  <h1 className={cn("font-bold text-white leading-tight", device === 'mobile' ? 'text-xl' : (device === 'tablet' ? 'text-2xl' : 'text-3xl md:text-4xl'))}>
                    {c.heading ?? 'Tiêu đề chính'}
                  </h1>
                  {c.description && (
                    <p className={cn("text-white/80", device === 'mobile' ? 'text-sm line-clamp-2' : 'text-base')}>
                      {c.description}
                    </p>
                  )}
                  <div className={cn("flex gap-3", device === 'mobile' ? 'flex-col' : 'flex-row')}>
                    {c.primaryButtonText && (
                      <button className={cn("font-medium rounded-lg text-white", device === 'mobile' ? 'px-4 py-2 text-sm' : 'px-6 py-2.5')} style={{ backgroundColor: colors.primarySolid }}>
                        {c.primaryButtonText}
                      </button>
                    )}
                    {c.secondaryButtonText && (
                      <button className={cn("font-medium rounded-lg border border-white/30 text-white hover:bg-white/10", device === 'mobile' ? 'px-4 py-2 text-sm' : 'px-6 py-2.5')}>
                        {c.secondaryButtonText}
                      </button>
                    )}
                  </div>
                </div>
              </div>
              {slides.length > 1 && (
                <div className="absolute bottom-4 right-4 flex gap-2 z-20">
                  {slides.map((_, idx) => (
                    <button key={idx} type="button" onClick={() =>{  setCurrentSlide(idx); }} 
                      className={cn("w-2 h-2 rounded-full transition-all", idx === currentSlide ? "w-6" : "bg-white/50")} 
                      style={idx === currentSlide ? { backgroundColor: colors.primarySolid } : {}} />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-800">
              <span className="text-slate-400 text-sm">Chưa có banner</span>
            </div>
          )}
        </div>
      </section>
    );
  };

  const renderSplitStyle = () => {
    const mainSlide = slides[currentSlide] || slides[0];
    const c = content ?? {};
    return (
      <section className="relative w-full bg-white dark:bg-slate-900 overflow-hidden">
        <div className={cn(
          "relative w-full flex",
          device === 'mobile' ? 'flex-col h-auto' : 'flex-row h-[320px]'
        )}>
          {slides.length > 0 && mainSlide ? (
            <>
              <div className={cn(
                "flex flex-col justify-center bg-slate-50 dark:bg-slate-800/50",
                device === 'mobile' ? 'p-4 order-2' : 'w-1/2 p-8 lg:p-12'
              )}>
                <div className={cn("space-y-3", device === 'mobile' ? '' : 'max-w-md')}>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide" style={{ backgroundColor: colors.secondaryTintLight, color: colors.secondarySolid }}>
                    {c.badge ?? `Banner ${currentSlide + 1}/${slides.length}`}
                  </span>
                  <h2 className={cn("font-bold text-slate-900 dark:text-white leading-tight", device === 'mobile' ? 'text-lg' : 'text-2xl lg:text-3xl')}>
                    {c.heading ?? 'Tiêu đề nổi bật'}
                  </h2>
                  {c.description && (
                    <p className={cn("text-slate-600 dark:text-slate-300", device === 'mobile' ? 'text-sm' : 'text-base')}>
                      {c.description}
                    </p>
                  )}
                  {c.primaryButtonText && (
                    <div className="pt-2">
                      <button className={cn("font-medium rounded-lg text-white", device === 'mobile' ? 'px-4 py-2 text-sm' : 'px-6 py-2.5')} style={{ backgroundColor: colors.primarySolid }}>
                        {c.primaryButtonText}
                      </button>
                    </div>
                  )}
                </div>
                {slides.length > 1 && device !== 'mobile' && (
                  <div className="flex gap-2 mt-6">
                    {slides.map((_, idx) => (
                      <button key={idx} type="button" onClick={() =>{  setCurrentSlide(idx); }}
                        className={cn("h-1 rounded-full transition-all", idx === currentSlide ? "w-8" : "w-4 bg-slate-300 dark:bg-slate-600")}
                        style={idx === currentSlide ? { backgroundColor: colors.primarySolid } : {}} />
                    ))}
                  </div>
                )}
              </div>
              <div className={cn(
                "relative overflow-hidden",
                device === 'mobile' ? 'w-full h-[200px] order-1' : 'w-1/2'
              )}>
                {slides.map((slide, idx) => (
                  <div key={slide.id} className={cn("absolute inset-0 transition-all duration-700", idx === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none")}>
                    {slide.image ? (
                      <PreviewImage src={slide.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-200 dark:bg-slate-700">
                        <ImageIcon size={40} className="text-slate-400" />
                      </div>
                    )}
                  </div>
                ))}
                {slides.length > 1 && (
                  <>
                    <button type="button" onClick={prevSlide} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow-lg flex items-center justify-center z-10">
                      <ChevronLeft size={16} style={{ color: colors.secondarySolid }} />
                    </button>
                    <button type="button" onClick={nextSlide} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow-lg flex items-center justify-center z-10">
                      <ChevronRight size={16} style={{ color: colors.secondarySolid }} />
                    </button>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="w-full h-[300px] flex items-center justify-center bg-slate-100 dark:bg-slate-800">
              <span className="text-slate-400 text-sm">Chưa có banner</span>
            </div>
          )}
        </div>
      </section>
    );
  };

  const renderParallaxStyle = () => {
    const mainSlide = slides[currentSlide] || slides[0];
    const c = content ?? {};
    return (
      <section className="relative w-full bg-slate-900 overflow-hidden">
        <div className={cn(
          "relative w-full",
          device === 'mobile' ? 'h-[260px]' : (device === 'tablet' ? 'h-[320px]' : 'h-[380px]')
        )}>
          {slides.length > 0 && mainSlide ? (
            <>
              {slides.map((slide, idx) => (
                <div key={slide.id} className={cn("absolute inset-0 transition-opacity duration-700", idx === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none")}>
                  {slide.image ? (
                    <div className="w-full h-full relative">
                      <div className="absolute inset-0 scale-110 transform-gpu" style={{ backgroundImage: `url(${slide.image})`, backgroundPosition: 'center', backgroundSize: 'cover' }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
                    </div>
                  ) : renderPlaceholder(idx)}
                </div>
              ))}
              <div className={cn(
                "absolute z-10 flex items-end",
                device === 'mobile' ? 'inset-x-3 bottom-3' : 'inset-x-6 bottom-6'
              )}>
                <div className={cn(
                  "bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-xl shadow-2xl",
                  device === 'mobile' ? 'p-3 w-full' : 'p-5 max-w-lg'
                )}>
                  {c.badge && (
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: colors.primarySolid }} />
                      <span className="text-xs font-semibold uppercase tracking-wide px-2.5 py-0.5 rounded-full" style={{ backgroundColor: colors.secondaryTintLight, color: colors.secondarySolid }}>{c.badge}</span>
                    </div>
                  )}
                  <h3 className={cn("font-bold text-slate-900 dark:text-white", device === 'mobile' ? 'text-base' : 'text-xl')}>
                    {c.heading ?? 'Tiêu đề nổi bật'}
                  </h3>
                  {c.description && (
                    <p className={cn("text-slate-600 dark:text-slate-300 mt-1", device === 'mobile' ? 'text-xs' : 'text-sm')}>
                      {c.description}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-3">
                    {c.primaryButtonText && (
                      <button className={cn("font-medium rounded-lg text-white", device === 'mobile' ? 'px-3 py-1.5 text-xs' : 'px-5 py-2 text-sm')} style={{ backgroundColor: colors.primarySolid }}>
                        {c.primaryButtonText}
                      </button>
                    )}
                    {c.countdownText && (
                      <span className={cn("text-slate-500", device === 'mobile' ? 'text-xs' : 'text-sm')}>{c.countdownText}</span>
                    )}
                  </div>
                </div>
              </div>
              {slides.length > 1 && (
                <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
                  <button type="button" onClick={prevSlide} className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
                    <ChevronLeft size={16} className="text-white" />
                  </button>
                  <span className="text-white/80 text-xs font-medium px-2">{currentSlide + 1} / {slides.length}</span>
                  <button type="button" onClick={nextSlide} className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
                    <ChevronRight size={16} className="text-white" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-800">
              <span className="text-slate-400 text-sm">Chưa có banner</span>
            </div>
          )}
        </div>
      </section>
    );
  };

  return (
    <>
      <PreviewWrapper
        title="Preview Hero"
        device={device}
        setDevice={setDevice}
        previewStyle={previewStyle}
        setPreviewStyle={setPreviewStyle}
        styles={HERO_STYLES}
        info={info}
        deviceWidthClass={deviceWidths[device]}
      >
        <BrowserFrame url="yoursite.com">
          <div className="relative px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ backgroundColor: colors.primarySolid, opacity: 0.6 }} />
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: colors.primarySolid }}></div>
              <div className="w-20 h-3 bg-slate-200 dark:bg-slate-700 rounded"></div>
            </div>
            {device !== 'mobile' && <div className="flex gap-4">{[1,2,3,4].map(i => (<div key={i} className="w-12 h-2 bg-slate-100 dark:bg-slate-800 rounded"></div>))}</div>}
          </div>
          {previewStyle === 'slider' && renderSliderStyle()}
          {previewStyle === 'fade' && renderFadeStyle()}
          {previewStyle === 'bento' && renderBentoStyle()}
          {previewStyle === 'fullscreen' && renderFullscreenStyle()}
          {previewStyle === 'split' && renderSplitStyle()}
          {previewStyle === 'parallax' && renderParallaxStyle()}
          <div className="p-4 space-y-3">
            <div className="flex gap-3">{[1,2,3,4].slice(0, device === 'mobile' ? 2 : 4).map(i => (<div key={i} className="flex-1 h-16 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>))}</div>
          </div>
        </BrowserFrame>
      </PreviewWrapper>
      {previewStyle === 'slider' && mode === 'dual' && sliderColors.similarity > 0.9 && (
        <div className="mt-3 p-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-xs text-amber-700 dark:text-amber-300">
          ⚠️ Hai màu quá giống nhau (similarity: {(sliderColors.similarity * 100).toFixed(0)}%). Khuyến nghị chọn màu phụ khác biệt hơn.
        </div>
      )}
      {mode === 'dual' && (
        <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 dark:text-slate-400">Màu chính:</span>
              <div
                className="w-8 h-8 rounded border-2 border-slate-300 dark:border-slate-600 shadow-sm"
                style={{ backgroundColor: brandColor }}
                title={brandColor}
              />
              <span className="font-mono text-slate-600 dark:text-slate-400">{brandColor}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500 dark:text-slate-400">Màu phụ:</span>
              <div
                className="w-8 h-8 rounded border-2 border-slate-300 dark:border-slate-600 shadow-sm"
                style={{ backgroundColor: secondary }}
                title={secondary}
              />
              <span className="font-mono text-slate-600 dark:text-slate-400">{secondary}</span>
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Màu phụ được áp dụng cho: nav buttons, borders, badges, accents.
          </p>
        </div>
      )}
      <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
        <div className="flex items-start gap-2">
          <ImageIcon size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-slate-600 dark:text-slate-400">
            {previewStyle === 'slider' && (
              <p><strong>1920×600px</strong> (16:5) • Nhiều ảnh, auto slide</p>
            )}
            {previewStyle === 'fade' && (
              <p><strong>1920×600px</strong> (16:5) • Nhiều ảnh, thumbnail navigation</p>
            )}
            {previewStyle === 'bento' && (
              <p><strong>Slot 1:</strong> 800×500 • <strong>Slot 2:</strong> 800×250 • <strong>Slot 3-4:</strong> 400×250 • Tối đa 4 ảnh</p>
            )}
            {previewStyle === 'fullscreen' && (
              <p><strong>1920×1080px</strong> (16:9) • Subject đặt bên phải (trái có overlay text)</p>
            )}
            {previewStyle === 'split' && (
              <p><strong>960×600px</strong> (8:5) • Ảnh bên phải 50%, subject đặt giữa/trái</p>
            )}
            {previewStyle === 'parallax' && (
              <p><strong>1920×1080px</strong> (16:9) • Để trống góc dưới trái cho card nổi</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
