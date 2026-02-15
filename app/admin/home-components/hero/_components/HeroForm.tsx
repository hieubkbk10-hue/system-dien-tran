'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Input, Label } from '../../../components/ui';
import { MultiImageUploader } from '../../../components/MultiImageUploader';
import type { HeroContent, HeroHarmony, HeroSlide, HeroStyle } from '../_types';

export const HeroForm = ({
  heroSlides,
  setHeroSlides,
  heroStyle,
  heroContent,
  setHeroContent,
  brandMode,
  harmony,
  setHarmony,
}: {
  heroSlides: HeroSlide[];
  setHeroSlides: (slides: HeroSlide[]) => void;
  heroStyle: HeroStyle;
  heroContent: HeroContent;
  setHeroContent: (content: HeroContent) => void;
  brandMode: 'single' | 'dual';
  harmony: HeroHarmony;
  setHarmony: (value: HeroHarmony) => void;
}) => (
  <>
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-base">Danh sách Banner (Slider)</CardTitle>
      </CardHeader>
      <CardContent>
        <MultiImageUploader<HeroSlide>
          items={heroSlides}
          onChange={setHeroSlides}
          folder="hero-banners"
          imageKey="url"
          extraFields={[{ key: 'link', placeholder: 'URL liên kết (khi click vào banner)', type: 'url' }]}
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

    {brandMode === 'single' && heroStyle === 'slider' && (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Color Harmony (Single Mode)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label>Harmony Scheme</Label>
            <select
              value={harmony}
              onChange={(e) =>{  setHarmony(e.target.value as HeroHarmony); }}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
            >
              <option value="analogous">Analogous (+30°)</option>
              <option value="complementary">Complementary (180°)</option>
              <option value="triadic">Triadic (120°)</option>
            </select>
            <p className="text-xs text-slate-500">Tự động tạo màu phụ hài hòa từ màu chính.</p>
          </div>
        </CardContent>
      </Card>
    )}

    {['fullscreen', 'split', 'parallax'].includes(heroStyle) && (
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
                onChange={(e) =>{  setHeroContent({ ...heroContent, badge: e.target.value }); }}
                placeholder="VD: Nổi bật, Hot, Mới..."
              />
            </div>
            <div className="space-y-2">
              <Label>Tiêu đề chính</Label>
              <Input 
                value={heroContent.heading} 
                onChange={(e) =>{  setHeroContent({ ...heroContent, heading: e.target.value }); }}
                placeholder="Tiêu đề lớn hiển thị trên hero"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Mô tả</Label>
            <textarea 
              value={heroContent.description} 
              onChange={(e) =>{  setHeroContent({ ...heroContent, description: e.target.value }); }}
              placeholder="Mô tả ngắn gọn..."
              className="w-full min-h-[60px] rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nút chính</Label>
              <Input 
                value={heroContent.primaryButtonText} 
                onChange={(e) =>{  setHeroContent({ ...heroContent, primaryButtonText: e.target.value }); }}
                placeholder="VD: Khám phá ngay, Mua ngay..."
              />
            </div>
            {heroStyle === 'fullscreen' && (
              <div className="space-y-2">
                <Label>Nút phụ</Label>
                <Input 
                  value={heroContent.secondaryButtonText} 
                  onChange={(e) =>{  setHeroContent({ ...heroContent, secondaryButtonText: e.target.value }); }}
                  placeholder="VD: Tìm hiểu thêm..."
                />
              </div>
            )}
            {heroStyle === 'parallax' && (
              <div className="space-y-2">
                <Label>Text đếm ngược / Phụ</Label>
                <Input 
                  value={heroContent.countdownText} 
                  onChange={(e) =>{  setHeroContent({ ...heroContent, countdownText: e.target.value }); }}
                  placeholder="VD: Còn 3 ngày, Chỉ hôm nay..."
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )}
  </>
);
