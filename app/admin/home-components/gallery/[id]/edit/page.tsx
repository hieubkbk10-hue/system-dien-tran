'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { Image as ImageIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, cn } from '../../../../components/ui';
import { useBrandColors } from '../../../create/shared';
import { GalleryForm } from '../../_components/GalleryForm';
import { GalleryPreview } from '../../_components/GalleryPreview';
import { TrustBadgesPreview } from '../../_components/TrustBadgesPreview';
import { DEFAULT_GALLERY_ITEMS } from '../../_lib/constants';
import type { GalleryItem, GalleryStyle, TrustBadgesStyle } from '../../_types';

const TYPE_TITLES: Record<'Gallery' | 'TrustBadges', string> = {
  Gallery: 'Thư viện ảnh',
  TrustBadges: 'Chứng nhận'
};

export default function GalleryEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { primary, secondary } = useBrandColors();
  const component = useQuery(api.homeComponents.getById, { id: id as Id<'homeComponents'> });
  const updateMutation = useMutation(api.homeComponents.update);

  const [title, setTitle] = useState('');
  const [active, setActive] = useState(true);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(DEFAULT_GALLERY_ITEMS);
  const [galleryStyle, setGalleryStyle] = useState<GalleryStyle>('grid');
  const [trustBadgesStyle, setTrustBadgesStyle] = useState<TrustBadgesStyle>('cards');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!component) {return;}
    if (component.type === 'Partners') {
      router.replace(`/admin/home-components/partners/${id}/edit`);
      return;
    }
    if (component.type !== 'Gallery' && component.type !== 'TrustBadges') {
      router.replace(`/admin/home-components/${id}/edit?type=${component.type.toLowerCase()}`);
      return;
    }

    setTitle(component.title);
    setActive(component.active);

    const config = component.config ?? {};
    const items = (config.items as { url: string; link: string; name?: string }[] | undefined) ?? DEFAULT_GALLERY_ITEMS;
    setGalleryItems(items.map((item, idx) => ({ id: `item-${idx + 1}`, link: item.link || '', name: item.name ?? '', url: item.url })));
    if (component.type === 'TrustBadges') {
      setTrustBadgesStyle((config.style as TrustBadgesStyle) || 'cards');
    } else {
      setGalleryStyle((config.style as GalleryStyle) || 'grid');
    }
  }, [component, id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) {return;}

    setIsSubmitting(true);
    try {
      await updateMutation({
        active,
        config: {
          items: galleryItems.map((item) => ({ link: item.link, name: item.name, url: item.url })),
          style: component?.type === 'TrustBadges' ? trustBadgesStyle : galleryStyle,
        },
        id: id as Id<'homeComponents'>,
        title,
      });
      toast.success('Đã cập nhật component');
      router.push('/admin/home-components');
    } catch (error) {
      toast.error('Lỗi khi cập nhật');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (component === undefined) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (component === null) {
    return <div className="text-center py-8 text-slate-500">Không tìm thấy component</div>;
  }

  const componentType = component.type as 'Gallery' | 'TrustBadges';
  const titleLabel = TYPE_TITLES[componentType];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Chỉnh sửa {titleLabel}</h1>
        <Link href="/admin/home-components" className="text-sm text-blue-600 hover:underline">Quay lại danh sách</Link>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ImageIcon size={20} />
              {titleLabel}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Tiêu đề hiển thị <span className="text-red-500">*</span></Label>
              <Input
                value={title}
                onChange={(e) =>{  setTitle(e.target.value); }}
                required
                placeholder="Nhập tiêu đề component..."
              />
            </div>

            <div className="flex items-center gap-3">
              <Label>Trạng thái:</Label>
              <div
                className={cn(
                  "cursor-pointer inline-flex items-center justify-center rounded-full w-12 h-6 transition-colors",
                  active ? "bg-green-500" : "bg-slate-300 dark:bg-slate-600"
                )}
                onClick={() =>{  setActive(!active); }}
              >
                <div className={cn(
                  "w-5 h-5 bg-white rounded-full transition-transform shadow",
                  active ? "translate-x-2.5" : "-translate-x-2.5"
                )}></div>
              </div>
              <span className="text-sm text-slate-500">{active ? 'Bật' : 'Tắt'}</span>
            </div>
          </CardContent>
        </Card>

        <GalleryForm
          galleryItems={galleryItems}
          setGalleryItems={setGalleryItems}
          componentType={componentType}
          style={galleryStyle}
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,420px] gap-6">
          <div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </div>
          <div className="lg:sticky lg:top-6 lg:self-start">
            {componentType === 'TrustBadges' ? (
              <TrustBadgesPreview 
                items={galleryItems.map((item, idx) => ({ id: idx + 1, link: item.link, name: item.name, url: item.url }))}
                brandColor={primary}
                secondary={secondary}
                selectedStyle={trustBadgesStyle}
                onStyleChange={setTrustBadgesStyle}
              />
            ) : (
              <GalleryPreview 
                items={galleryItems.map((item, idx) => ({ id: idx + 1, link: item.link, url: item.url }))}
                brandColor={primary}
                secondary={secondary}
                selectedStyle={galleryStyle}
                onStyleChange={setGalleryStyle}
              />
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
