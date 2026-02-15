'use client';

import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui';
import { MultiImageUploader } from '../../../components/MultiImageUploader';
import type { GalleryItem } from '../_types';

export const GalleryForm = ({
  galleryItems,
  setGalleryItems,
  componentType,
  style,
}: {
  galleryItems: GalleryItem[];
  setGalleryItems: (items: GalleryItem[]) => void;
  componentType: 'Gallery' | 'Partners' | 'TrustBadges';
  style?: string;
}) => {
  const folders: Record<'Gallery' | 'Partners' | 'TrustBadges', string> = {
    Gallery: 'gallery',
    Partners: 'partners',
    TrustBadges: 'trust-badges'
  };

  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">
            {componentType === 'Partners' ? 'Logo đối tác' : (componentType === 'TrustBadges' ? 'Chứng nhận' : 'Thư viện ảnh')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MultiImageUploader<GalleryItem>
            items={galleryItems}
            onChange={setGalleryItems}
            folder={folders[componentType]}
            imageKey="url"
            extraFields={
              componentType === 'Partners' 
                ? [{ key: 'link', placeholder: 'Link website đối tác (tùy chọn)', type: 'url' }]
                : (componentType === 'TrustBadges'
                ? [{ key: 'name', placeholder: 'Tên chứng nhận/bằng cấp', type: 'text' }]
                : [])
            }
            minItems={1}
            maxItems={20}
            aspectRatio={componentType === 'Partners' ? 'video' : (componentType === 'Gallery' ? 'video' : 'square')}
            columns={componentType === 'Gallery' ? 2 : (componentType === 'TrustBadges' ? 3 : 2)}
            showReorder={true}
            addButtonText={componentType === 'Partners' ? 'Thêm logo' : (componentType === 'TrustBadges' ? 'Thêm chứng nhận' : 'Thêm ảnh')}
            emptyText="Chưa có ảnh nào"
            layout="vertical"
          />
        </CardContent>
      </Card>

      {componentType !== 'TrustBadges' && (
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-800/50 flex items-center justify-center flex-shrink-0">
              <ImageIcon size={16} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">Kích thước ảnh tối ưu</p>
              <div className="text-xs text-blue-700 dark:text-blue-300">
                {/* Gallery Image Guidelines - 6 Styles */}
                {componentType === 'Gallery' && (
                  <>
                    {style === 'spotlight' && (
                      <div className="space-y-1">
                        <p><strong className="text-blue-900 dark:text-blue-100">Tiêu điểm (Spotlight)</strong></p>
                        <p>• Ảnh chính: <strong>1200×800px</strong> (tỷ lệ 3:2)</p>
                        <p>• Ảnh phụ: <strong>600×600px</strong> (tỷ lệ 1:1, vuông)</p>
                        <p className="text-blue-500 dark:text-blue-400 italic">Layout: 1 ảnh lớn bên trái + 3 ảnh vuông bên phải</p>
                      </div>
                    )}
                    {style === 'explore' && (
                      <div className="space-y-1">
                        <p><strong className="text-blue-900 dark:text-blue-100">Khám phá (Explore)</strong></p>
                        <p>• Tất cả ảnh: <strong>600×600px</strong> (tỷ lệ 1:1, vuông)</p>
                        <p className="text-blue-500 dark:text-blue-400 italic">Layout: Grid đều kiểu Instagram - 5 cột desktop, 3 cột mobile</p>
                      </div>
                    )}
                    {style === 'stories' && (
                      <div className="space-y-1">
                        <p><strong className="text-blue-900 dark:text-blue-100">Câu chuyện (Stories)</strong></p>
                        <p>• Ảnh nhỏ: <strong>800×600px</strong> (tỷ lệ 4:3)</p>
                        <p>• Ảnh lớn: <strong>1200×600px</strong> (tỷ lệ 2:1)</p>
                        <p className="text-blue-500 dark:text-blue-400 italic">Layout: Masonry nhẹ - ảnh 1,4 chiếm 2 cột, còn lại 1 cột</p>
                      </div>
                    )}
                    {style === 'grid' && (
                      <div className="space-y-1">
                        <p><strong className="text-blue-900 dark:text-blue-100">Grid</strong></p>
                        <p>• Tất cả ảnh: <strong>800×800px</strong> (tỷ lệ 1:1, vuông)</p>
                        <p className="text-blue-500 dark:text-blue-400 italic">Layout: Grid đều - 4 cột desktop, 2 cột mobile. Click để xem lightbox.</p>
                      </div>
                    )}
                    {style === 'marquee' && (
                      <div className="space-y-1">
                        <p><strong className="text-blue-900 dark:text-blue-100">Marquee</strong></p>
                        <p>• Tất cả ảnh: <strong>800×600px</strong> (tỷ lệ 4:3)</p>
                        <p className="text-blue-500 dark:text-blue-400 italic">Layout: Auto scroll horizontal. Hover để dừng. Rounded corners.</p>
                      </div>
                    )}
                    {style === 'masonry' && (
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
                {componentType === 'Partners' && (
                  <>
                    {style === 'grid' && (
                      <div className="space-y-1">
                        <p><strong className="text-blue-900 dark:text-blue-100">Grid</strong></p>
                        <p>• Logo: <strong>200×80px</strong> (tỷ lệ 5:2) • PNG nền trong suốt</p>
                        <p className="text-blue-500 dark:text-blue-400 italic">Layout: 8 cột desktop, 2 cột mobile</p>
                      </div>
                    )}
                    {style === 'marquee' && (
                      <div className="space-y-1">
                        <p><strong className="text-blue-900 dark:text-blue-100">Marquee</strong></p>
                        <p>• Logo: <strong>160×60px</strong> (tỷ lệ 8:3) • PNG nền trong suốt</p>
                        <p className="text-blue-500 dark:text-blue-400 italic">Layout: Auto scroll. Hover để dừng.</p>
                      </div>
                    )}
                    {style === 'mono' && (
                      <div className="space-y-1">
                        <p><strong className="text-blue-900 dark:text-blue-100">Mono</strong></p>
                        <p>• Logo: <strong>160×60px</strong> (tỷ lệ 8:3) • PNG nền trong suốt</p>
                        <p className="text-blue-500 dark:text-blue-400 italic">Layout: Grayscale mặc định, hover để hiện màu. Scroll chậm.</p>
                      </div>
                    )}
                    {style === 'badge' && (
                      <div className="space-y-1">
                        <p><strong className="text-blue-900 dark:text-blue-100">Badge</strong></p>
                        <p>• Logo: <strong>120×48px</strong> (tỷ lệ 5:2) • PNG nền trong suốt</p>
                        <p className="text-blue-500 dark:text-blue-400 italic">Layout: Compact badges với logo + tên đối tác</p>
                      </div>
                    )}
                    {style === 'carousel' && (
                      <div className="space-y-1">
                        <p><strong className="text-blue-900 dark:text-blue-100">Carousel</strong></p>
                        <p>• Logo: <strong>200×100px</strong> (tỷ lệ 2:1) • PNG nền trong suốt</p>
                        <p className="text-blue-500 dark:text-blue-400 italic">Layout: Cards với navigation. 6 items/trang desktop.</p>
                      </div>
                    )}
                    {style === 'featured' && (
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
      )}
    </>
  );
};
