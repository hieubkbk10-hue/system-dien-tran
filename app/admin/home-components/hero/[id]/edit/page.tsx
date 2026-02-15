'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { LayoutTemplate, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, cn } from '../../../../components/ui';
import { useBrandColors } from '../../../create/shared';
import { HeroForm } from '../../_components/HeroForm';
import { HeroPreview } from '../../_components/HeroPreview';
import { DEFAULT_HERO_CONTENT } from '../../_lib/constants';
import type { HeroContent, HeroSlide, HeroStyle } from '../../_types';

export default function HeroEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { primary, secondary } = useBrandColors();
  const modeSetting = useQuery(api.settings.getByKey, { key: 'site_brand_mode' });
  const brandMode = modeSetting?.value === 'single' ? 'single' : 'dual';
  const component = useQuery(api.homeComponents.getById, { id: id as Id<"homeComponents"> });
  const updateMutation = useMutation(api.homeComponents.update);

  const [title, setTitle] = useState('');
  const [active, setActive] = useState(true);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [heroStyle, setHeroStyle] = useState<HeroStyle>('slider');
  const [heroContent, setHeroContent] = useState<HeroContent>(DEFAULT_HERO_CONTENT);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (component) {
      if (component.type !== 'Hero') {
        router.replace(`/admin/home-components/${id}/edit?type=${component.type.toLowerCase()}`);
        return;
      }

      setTitle(component.title);
      setActive(component.active);

      const config = component.config ?? {};
      setHeroSlides(config.slides?.map((s: { image: string; link: string }, i: number) => ({ id: `slide-${i}`, link: s.link || '', url: s.image })) ?? [{ id: 'slide-1', link: '', url: '' }]);
      setHeroStyle((config.style as HeroStyle) || 'slider');
      if (config.content) {
        setHeroContent(config.content as HeroContent);
      }
    }
  }, [component, id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) {return;}

    setIsSubmitting(true);
    try {
      const needsContent = ['fullscreen', 'split', 'parallax'].includes(heroStyle);
      await updateMutation({
        active,
        config: {
          content: needsContent ? heroContent : undefined,
          slides: heroSlides.map(s => ({ image: s.url, link: s.link })),
          style: heroStyle,
        },
        id: id as Id<"homeComponents">,
        title,
      });
      toast.success('Đã cập nhật Hero Banner');
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

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Chỉnh sửa Hero Banner</h1>
        <Link href="/admin/home-components" className="text-sm text-blue-600 hover:underline">Quay lại danh sách</Link>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <LayoutTemplate size={20} />
              Hero Banner
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

        <HeroForm
          heroSlides={heroSlides}
          setHeroSlides={setHeroSlides}
          heroStyle={heroStyle}
          heroContent={heroContent}
          setHeroContent={setHeroContent}
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,420px] gap-6">
          <div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </div>
          <div className="lg:sticky lg:top-6 lg:self-start">
            <HeroPreview
              slides={heroSlides.map((s, idx) => ({ id: idx + 1, image: s.url, link: s.link }))}
              brandColor={primary}
              secondary={secondary}
              mode={brandMode}
              selectedStyle={heroStyle}
              onStyleChange={setHeroStyle}
              content={heroContent}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
