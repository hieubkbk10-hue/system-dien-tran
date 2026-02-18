'use client';

import React, { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui';
import { ComponentFormWrapper, useBrandColors, useComponentForm } from '../shared';
import { GalleryPreview } from '../../gallery/_components/GalleryPreview';
import { TrustBadgesPreview } from '../../gallery/_components/TrustBadgesPreview';
import type { GalleryStyle, TrustBadgesStyle } from '../../gallery/_types';
import { getGalleryValidationResult, normalizeGalleryHarmony } from '../../gallery/_lib/colors';
import { PartnersPreview } from '../../partners/_components/PartnersPreview';
import type { PartnersStyle } from '../../partners/_types';
import type { ImageItem } from '../../../components/MultiImageUploader';
import { MultiImageUploader } from '../../../components/MultiImageUploader';

interface GalleryItem extends ImageItem {
  id: string | number;
  url: string;
  link: string;
  name?: string;
}

function GalleryCreateContent() {
  const searchParams = useSearchParams();
  const type = (searchParams.get('type') as 'Partners' | 'Gallery' | 'TrustBadges') || 'Gallery';
  
  const titles: Record<string, string> = {
    Gallery: 'Thư viện ảnh',
    Partners: 'Đối tác / Logos',
    TrustBadges: 'Chứng nhận'
  };

  const folders: Record<string, string> = {
    Gallery: 'gallery',
    Partners: 'partners',
    TrustBadges: 'trust-badges'
  };
  
  const { title, setTitle, active, setActive, handleSubmit, isSubmitting } = useComponentForm(titles[type], type);
  const { primary, secondary, mode } = useBrandColors();
  const componentLabel = titles[type];
  
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([
    { id: 'item-1', link: '', name: '', url: '' },
    { id: 'item-2', link: '', name: '', url: '' }
  ]);
  const [galleryStyle, setGalleryStyle] = useState<GalleryStyle>('spotlight');
  const [partnersStyle, setPartnersStyle] = useState<PartnersStyle>('grid');
  const [trustBadgesStyle, setTrustBadgesStyle] = useState<TrustBadgesStyle>('cards');

  const onSubmit = (e: React.FormEvent) => {
    if (type !== 'Partners') {
      const harmony = normalizeGalleryHarmony(undefined);
      const { accessibility, harmonyStatus } = getGalleryValidationResult({ primary, secondary, mode, harmony });

      if (mode === 'dual' && harmonyStatus.isTooSimilar) {
        toast.error(`Không thể lưu ${componentLabel}: deltaE=${harmonyStatus.deltaE} < 20 (Primary/Secondary quá giống nhau).`);
        return;
      }

      if (accessibility.failing.length > 0) {
        const failedPairs = accessibility.failing.map((item) => item.label ?? 'pair').join(', ');
        toast.error(
          `Không thể lưu ${componentLabel}: APCA chưa đạt cho ${failedPairs}. `
          + 'Gợi ý: (1) Chọn màu có contrast cao hơn, (2) Đổi harmony mode, (3) Chuyển Single mode ở /admin/system/brand.',
        );
        return;
      }
    }
    const finalStyle = type === 'TrustBadges'
      ? trustBadgesStyle
      : (type === 'Partners' ? partnersStyle : galleryStyle);
    void handleSubmit(e, { items: galleryItems.map(g => ({ link: g.link, name: g.name, url: g.url })), style: finalStyle });
  };

  return (
    <ComponentFormWrapper
      type={type}
      title={title}
      setTitle={setTitle}
      active={active}
      setActive={setActive}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
    >
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">
            {type === 'Partners' ? 'Logo đối tác' : (type === 'TrustBadges' ? 'Chứng nhận' : 'Thư viện ảnh')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MultiImageUploader<GalleryItem>
            items={galleryItems}
            onChange={setGalleryItems}
            folder={folders[type]}
            imageKey="url"
            extraFields={
              type === 'Partners' 
                ? [{ key: 'link', placeholder: 'Link website đối tác (tùy chọn)', type: 'url' }]
                : (type === 'TrustBadges'
                ? [{ key: 'name', placeholder: 'Tên chứng nhận/bằng cấp', type: 'text' }]
                : [])
            }
            minItems={1}
            maxItems={20}
            aspectRatio={type === 'Partners' ? 'video' : (type === 'Gallery' ? 'video' : 'square')}
            columns={type === 'Gallery' ? 2 : (type === 'TrustBadges' ? 3 : 2)}
            showReorder={true}
            addButtonText={type === 'Partners' ? 'Thêm logo' : (type === 'TrustBadges' ? 'Thêm chứng nhận' : 'Thêm ảnh')}
            emptyText="Chưa có ảnh nào"
            layout="vertical"
          />
        </CardContent>
      </Card>

      {type === 'TrustBadges' ? (
        <TrustBadgesPreview 
          items={galleryItems.map((item, idx) => ({ id: idx + 1, link: item.link, name: item.name, url: item.url }))} 
          brandColor={primary} secondary={secondary}
          mode={mode}
          selectedStyle={trustBadgesStyle}
          onStyleChange={setTrustBadgesStyle}
        />
      ) : (
        <>
          {type === 'Partners' ? (
            <PartnersPreview
              items={galleryItems.map((item, idx) => ({ id: idx + 1, link: item.link, name: item.name, url: item.url }))}
              brandColor={primary}
              secondary={secondary}
              mode={mode}
              selectedStyle={partnersStyle}
              onStyleChange={setPartnersStyle}
            />
          ) : (
            <GalleryPreview 
              items={galleryItems.map((item, idx) => ({ id: idx + 1, link: item.link, url: item.url }))} 
              brandColor={primary} secondary={secondary} 
              mode={mode}
              selectedStyle={galleryStyle}
              onStyleChange={setGalleryStyle}
            />
          )}
          
          {/* Image Guidelines - for Gallery and Partners */}
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-800/50 flex items-center justify-center flex-shrink-0">
                <ImageIcon size={16} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">Kích thước ảnh tối ưu</p>
                <div className="text-xs text-blue-700 dark:text-blue-300">
                  {/* Gallery Image Guidelines - 6 Styles */}
                  {type === 'Gallery' && (
                    <>
                      {galleryStyle === 'spotlight' && (
                        <div className="space-y-1">
                          <p><strong className="text-blue-900 dark:text-blue-100">Tiêu điểm (Spotlight)</strong></p>
                          <p>• Ảnh chính: <strong>1200×800px</strong> (tỷ lệ 3:2)</p>
                          <p>• Ảnh phụ: <strong>600×600px</strong> (tỷ lệ 1:1, vuông)</p>
                          <p className="text-blue-500 dark:text-blue-400 italic">Layout: 1 ảnh lớn bên trái + 3 ảnh vuông bên phải</p>
                        </div>
                      )}
                      {galleryStyle === 'explore' && (
                        <div className="space-y-1">
                          <p><strong className="text-blue-900 dark:text-blue-100">Khám phá (Explore)</strong></p>
                          <p>• Tất cả ảnh: <strong>600×600px</strong> (tỷ lệ 1:1, vuông)</p>
                          <p className="text-blue-500 dark:text-blue-400 italic">Layout: Grid đều kiểu Instagram - 5 cột desktop, 3 cột mobile</p>
                        </div>
                      )}
                      {galleryStyle === 'stories' && (
                        <div className="space-y-1">
                          <p><strong className="text-blue-900 dark:text-blue-100">Câu chuyện (Stories)</strong></p>
                          <p>• Ảnh nhỏ: <strong>800×600px</strong> (tỷ lệ 4:3)</p>
                          <p>• Ảnh lớn: <strong>1200×600px</strong> (tỷ lệ 2:1)</p>
                          <p className="text-blue-500 dark:text-blue-400 italic">Layout: Masonry nhẹ - ảnh 1,4 chiếm 2 cột, còn lại 1 cột</p>
                        </div>
                      )}
                      {galleryStyle === 'grid' && (
                        <div className="space-y-1">
                          <p><strong className="text-blue-900 dark:text-blue-100">Grid</strong></p>
                          <p>• Tất cả ảnh: <strong>800×800px</strong> (tỷ lệ 1:1, vuông)</p>
                          <p className="text-blue-500 dark:text-blue-400 italic">Layout: Grid đều - 4 cột desktop, 2 cột mobile. Click để xem lightbox.</p>
                        </div>
                      )}
                      {galleryStyle === 'marquee' && (
                        <div className="space-y-1">
                          <p><strong className="text-blue-900 dark:text-blue-100">Marquee</strong></p>
                          <p>• Tất cả ảnh: <strong>800×600px</strong> (tỷ lệ 4:3)</p>
                          <p className="text-blue-500 dark:text-blue-400 italic">Layout: Auto scroll horizontal. Hover để dừng. Rounded corners.</p>
                        </div>
                      )}
                      {galleryStyle === 'masonry' && (
                        <div className="space-y-1">
                          <p><strong className="text-blue-900 dark:text-blue-100">Masonry</strong></p>
                          <p>• Ảnh ngang: <strong>600×400px</strong> (tỷ lệ 3:2)</p>
                          <p>• Ảnh dọc: <strong>600×900px</strong> (tỷ lệ 2:3)</p>
                          <p>• Ảnh vuông: <strong>600×600px</strong> (tỷ lệ 1:1)</p>
                          <p className="text-blue-500 dark:text-blue-400 italic">Layout: Pinterest-like - ảnh cao/thấp khác nhau. 4 cột desktop, 2 cột mobile.</p>
                        </div>
                      )}
                    </>
                  )}
                  {/* Partners Image Guidelines - 6 Styles */}
                  {type === 'Partners' && (
                    <>
                      {partnersStyle === 'grid' && (
                        <div className="space-y-1">
                          <p><strong className="text-blue-900 dark:text-blue-100">Grid</strong></p>
                          <p>• Logo: <strong>200×80px</strong> (tỷ lệ 5:2) • PNG nền trong suốt</p>
                          <p className="text-blue-500 dark:text-blue-400 italic">Layout: 8 cột desktop, 2 cột mobile</p>
                        </div>
                      )}
                      {partnersStyle === 'marquee' && (
                        <div className="space-y-1">
                          <p><strong className="text-blue-900 dark:text-blue-100">Marquee</strong></p>
                          <p>• Logo: <strong>160×60px</strong> (tỷ lệ 8:3) • PNG nền trong suốt</p>
                          <p className="text-blue-500 dark:text-blue-400 italic">Layout: Auto scroll. Hover để dừng.</p>
                        </div>
                      )}
                      {partnersStyle === 'mono' && (
                        <div className="space-y-1">
                          <p><strong className="text-blue-900 dark:text-blue-100">Mono</strong></p>
                          <p>• Logo: <strong>160×60px</strong> (tỷ lệ 8:3) • PNG nền trong suốt</p>
                          <p className="text-blue-500 dark:text-blue-400 italic">Layout: Grayscale mặc định, hover để hiện màu. Scroll chậm.</p>
                        </div>
                      )}
                      {partnersStyle === 'badge' && (
                        <div className="space-y-1">
                          <p><strong className="text-blue-900 dark:text-blue-100">Badge</strong></p>
                          <p>• Logo: <strong>120×48px</strong> (tỷ lệ 5:2) • PNG nền trong suốt</p>
                          <p className="text-blue-500 dark:text-blue-400 italic">Layout: Compact badges với logo + tên đối tác</p>
                        </div>
                      )}
                      {partnersStyle === 'carousel' && (
                        <div className="space-y-1">
                          <p><strong className="text-blue-900 dark:text-blue-100">Carousel</strong></p>
                          <p>• Logo: <strong>200×100px</strong> (tỷ lệ 2:1) • PNG nền trong suốt</p>
                          <p className="text-blue-500 dark:text-blue-400 italic">Layout: Cards với navigation. 6 items/trang desktop.</p>
                        </div>
                      )}
                      {partnersStyle === 'featured' && (
                        <div className="space-y-1">
                          <p><strong className="text-blue-900 dark:text-blue-100">Featured</strong></p>
                          <p>• Logo nổi bật: <strong>400×200px</strong> (tỷ lệ 2:1)</p>
                          <p>• Logo khác: <strong>150×75px</strong> (tỷ lệ 2:1)</p>
                          <p className="text-blue-500 dark:text-blue-400 italic">Layout: 1 đối tác nổi bật lớn + grid nhỏ các đối tác khác</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </ComponentFormWrapper>
  );
}

export default function GalleryCreatePage() {
  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <GalleryCreateContent />
    </Suspense>
  );
}
