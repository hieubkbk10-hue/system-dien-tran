'use client';

import React, { useState } from 'react';
import { useMutation } from 'convex/react';
import { toast } from 'sonner';
import { api } from '@/convex/_generated/api';
import { Card, CardContent, CardHeader, CardTitle, Input, Label } from '../../../components/ui';
import { ComponentFormWrapper, useComponentForm } from '../shared';
import { TypeColorOverrideCard } from '../../_shared/components/TypeColorOverrideCard';
import { useTypeColorOverrideState } from '../../_shared/hooks/useTypeColorOverride';
import { getSuggestedSecondary, resolveSecondaryByMode } from '../../_shared/lib/typeColorOverride';
import type { HeroContent, HeroStyle } from '../../hero/_types';
import { DEFAULT_HERO_CONTENT } from '../../hero/_lib/constants';
import { HeroPreview } from '../../hero/_components/HeroPreview';
import type { ImageItem } from '../../../components/MultiImageUploader';
import { MultiImageUploader } from '../../../components/MultiImageUploader';

interface HeroSlide extends ImageItem {
  id: string | number;
  url: string;
  image: string;
  link: string;
}

const needsContentForm = (style: HeroStyle) => ['fullscreen', 'split', 'parallax'].includes(style);

export default function HeroCreatePage() {
  const { title, setTitle, active, setActive, handleSubmit, isSubmitting } = useComponentForm('Hero Banner', 'Hero');
  const { customState, effectiveColors, showCustomBlock, setCustomState } = useTypeColorOverrideState('Hero');
  const setTypeColorOverride = useMutation(api.homeComponentSystemConfig.setTypeColorOverride);

  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([
    { id: 'slide-1', image: '', link: '', url: '' }
  ]);
  const [heroStyle, setHeroStyle] = useState<HeroStyle>('slider');
  const [heroContent, setHeroContent] = useState<HeroContent>(DEFAULT_HERO_CONTENT);

  const handleSlidesChange = (slides: HeroSlide[]) => {
    setHeroSlides(slides.map(s => ({ ...s, image: s.url })));
  };

  const previewSlides = heroSlides.map((s, idx) => ({ 
    id: idx + 1, 
    image: s.url || s.image,
    link: s.link 
  }));

  const onSubmit = (e: React.FormEvent) => {
    void (async () => {
      e.preventDefault();

      if (showCustomBlock) {
        try {
          await setTypeColorOverride({
            type: 'Hero',
            enabled: customState.enabled,
            mode: customState.mode,
            primary: customState.primary,
            secondary: resolveSecondaryByMode(customState.mode, customState.primary, customState.secondary),
          });
        } catch (error) {
          toast.error(error instanceof Error ? error.message : 'Không thể cập nhật custom màu Hero.');
          return;
        }
      }

      await handleSubmit(e, {
        content: needsContentForm(heroStyle) ? heroContent : undefined,
        slides: heroSlides.map(s => ({ image: s.url || s.image, link: s.link })),
        style: heroStyle,
      });
    })();
  };

  return (
    <ComponentFormWrapper
      type="Hero"
      title={title}
      setTitle={setTitle}
      active={active}
      setActive={setActive}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
    >
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Danh sách Banner (Slider)</CardTitle>
        </CardHeader>
        <CardContent>
          <MultiImageUploader<HeroSlide>
            items={heroSlides}
            onChange={handleSlidesChange}
            folder="hero-banners"
            imageKey="url"
            extraFields={[
              { key: 'link', placeholder: 'URL liên kết (khi click vào banner)', type: 'url' }
            ]}
            minItems={1}
            maxItems={10}
            aspectRatio="banner"
            columns={1}
            showReorder={true}
            addButtonText="Thêm Banner"
            emptyText="Chưa có banner nào"
          />
        </CardContent>
      </Card>

      {/* Form nội dung cho styles: fullscreen, split, parallax */}
      {needsContentForm(heroStyle) && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Nội dung Hero ({heroStyle})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Badge / Nhãn</Label>
                <Input 
                  value={heroContent.badge} 
                  onChange={(e) =>{  setHeroContent({...heroContent, badge: e.target.value}); }}
                  placeholder="VD: Nổi bật, Hot, Mới..."
                />
              </div>
              <div className="space-y-2">
                <Label>Tiêu đề chính</Label>
                <Input 
                  value={heroContent.heading} 
                  onChange={(e) =>{  setHeroContent({...heroContent, heading: e.target.value}); }}
                  placeholder="Tiêu đề lớn hiển thị trên hero"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Mô tả</Label>
              <textarea 
                value={heroContent.description} 
                onChange={(e) =>{  setHeroContent({...heroContent, description: e.target.value}); }}
                placeholder="Mô tả ngắn gọn..."
                className="w-full min-h-[60px] rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nút chính</Label>
                <Input 
                  value={heroContent.primaryButtonText} 
                  onChange={(e) =>{  setHeroContent({...heroContent, primaryButtonText: e.target.value}); }}
                  placeholder="VD: Khám phá ngay, Mua ngay..."
                />
              </div>
              {heroStyle === 'fullscreen' && (
                <div className="space-y-2">
                  <Label>Nút phụ</Label>
                  <Input 
                    value={heroContent.secondaryButtonText} 
                    onChange={(e) =>{  setHeroContent({...heroContent, secondaryButtonText: e.target.value}); }}
                    placeholder="VD: Tìm hiểu thêm..."
                  />
                </div>
              )}
              {heroStyle === 'parallax' && (
                <div className="space-y-2">
                  <Label>Text đếm ngược / Phụ</Label>
                  <Input 
                    value={heroContent.countdownText} 
                    onChange={(e) =>{  setHeroContent({...heroContent, countdownText: e.target.value}); }}
                    placeholder="VD: Còn 3 ngày, Chỉ hôm nay..."
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {showCustomBlock && (
        <div className="mb-6">
          <TypeColorOverrideCard
            title="Màu custom Hero"
            enabled={customState.enabled}
            mode={customState.mode}
            primary={customState.primary}
            secondary={customState.secondary}
            compact
            toggleLabel="Custom"
            primaryLabel="Chính"
            secondaryLabel="Phụ"
            onEnabledChange={(next) => setCustomState((prev) => ({ ...prev, enabled: next }))}
            onModeChange={(next) => {
              if (next === 'single') {
                setCustomState((prev) => ({ ...prev, mode: 'single', secondary: prev.primary }));
                return;
              }
              setCustomState((prev) => ({
                ...prev,
                mode: 'dual',
                secondary: prev.mode === 'single' ? getSuggestedSecondary(prev.primary) : prev.secondary,
              }));
            }}
            onPrimaryChange={(value) => {
              setCustomState((prev) => ({
                ...prev,
                primary: value,
                secondary: prev.mode === 'single' ? value : prev.secondary,
              }));
            }}
            onSecondaryChange={(value) => setCustomState((prev) => ({ ...prev, secondary: value }))}
          />
        </div>
      )}

      <HeroPreview 
        slides={previewSlides} 
        brandColor={effectiveColors.primary}
        secondary={effectiveColors.secondary}
        mode={effectiveColors.mode}
        selectedStyle={heroStyle}
        onStyleChange={setHeroStyle}
        content={heroContent}
      />
    </ComponentFormWrapper>
  );
}
