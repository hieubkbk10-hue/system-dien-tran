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
import { TypeColorOverrideCard } from '../../../_shared/components/TypeColorOverrideCard';
import { useTypeColorOverrideState } from '../../../_shared/hooks/useTypeColorOverride';
import { HeroForm } from '../../_components/HeroForm';
import { HeroPreview } from '../../_components/HeroPreview';
import { DEFAULT_HERO_CONTENT } from '../../_lib/constants';
import type { HeroContent, HeroHarmony, HeroSlide, HeroStyle } from '../../_types';
import { getSuggestedSecondary, resolveSecondaryByMode } from '../../../_shared/lib/typeColorOverride';

export default function HeroEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { customState, effectiveColors, showCustomBlock, setCustomState, initialCustom, setInitialCustom } = useTypeColorOverrideState('Hero');
  const component = useQuery(api.homeComponents.getById, { id: id as Id<"homeComponents"> });
  const updateMutation = useMutation(api.homeComponents.update);
  const setTypeColorOverride = useMutation(api.homeComponentSystemConfig.setTypeColorOverride);

  const [title, setTitle] = useState('');
  const [active, setActive] = useState(true);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [heroStyle, setHeroStyle] = useState<HeroStyle>('slider');
  const [heroContent, setHeroContent] = useState<HeroContent>(DEFAULT_HERO_CONTENT);
  const [heroHarmony, setHeroHarmony] = useState<HeroHarmony>('analogous');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [initialData, setInitialData] = useState<{
    title: string;
    active: boolean;
    slides: HeroSlide[];
    style: HeroStyle;
    content: HeroContent;
    harmony: HeroHarmony;
  } | null>(null);
  const resolvedCustomSecondary = resolveSecondaryByMode(
    customState.mode,
    customState.primary,
    customState.secondary,
  );

  useEffect(() => {
    if (component) {
      if (component.type !== 'Hero') {
        router.replace(`/admin/home-components/${id}/edit`);
        return;
      }

      setTitle(component.title);
      setActive(component.active);

      const config = component.config ?? {};
      const slides = config.slides?.map((s: { image: string; link: string }, i: number) => ({ id: `slide-${i}`, link: s.link || '', url: s.image })) ?? [{ id: 'slide-1', link: '', url: '' }];
      const style = (config.style as HeroStyle) || 'slider';
      const harmony = (config.harmony as HeroHarmony) || 'analogous';
      const content = (config.content as HeroContent) ?? DEFAULT_HERO_CONTENT;

      setHeroSlides(slides);
      setHeroStyle(style);
      setHeroHarmony(harmony);
      setHeroContent(content);
      setInitialData({
        title: component.title,
        active: component.active,
        slides,
        style,
        content,
        harmony,
      });
      setHasChanges(false);
    }
  }, [component, id, router]);

  useEffect(() => {
    if (!initialData) {return;}

    const currentSlides = JSON.stringify(heroSlides);
    const initialSlides = JSON.stringify(initialData.slides);
    const currentContent = JSON.stringify(heroContent);
    const initialContent = JSON.stringify(initialData.content);

    const customChanged = showCustomBlock && initialCustom
      ? customState.enabled !== initialCustom.enabled
        || customState.mode !== initialCustom.mode
        || customState.primary !== initialCustom.primary
        || resolvedCustomSecondary !== initialCustom.secondary
      : false;

    const changed = title !== initialData.title
      || active !== initialData.active
      || currentSlides !== initialSlides
      || heroStyle !== initialData.style
      || currentContent !== initialContent
      || heroHarmony !== initialData.harmony
      || customChanged;

    setHasChanges(changed);
  }, [title, active, heroSlides, heroStyle, heroContent, heroHarmony, initialData, showCustomBlock, customState, resolvedCustomSecondary, initialCustom]);

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
          harmony: heroHarmony,
          slides: heroSlides.map(s => ({ image: s.url, link: s.link })),
          style: heroStyle,
        },
        id: id as Id<"homeComponents">,
        title,
      });
      if (showCustomBlock) {
        await setTypeColorOverride({
          enabled: customState.enabled,
          mode: customState.mode,
          primary: customState.primary,
          secondary: resolvedCustomSecondary,
          type: 'Hero',
        });
      }
      toast.success('Đã cập nhật Hero Banner');
      setInitialData({
        title,
        active,
        slides: heroSlides,
        style: heroStyle,
        content: heroContent,
        harmony: heroHarmony,
      });
      if (showCustomBlock) {
        setInitialCustom({
          enabled: customState.enabled,
          mode: customState.mode,
          primary: customState.primary,
          secondary: resolvedCustomSecondary,
        });
      }
      setHasChanges(false);
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
          <div></div>
          <div className="lg:sticky lg:top-6 lg:self-start space-y-4">
            {showCustomBlock && (
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
            )}
            <HeroPreview
              slides={heroSlides.map((s, idx) => ({ id: idx + 1, image: s.url, link: s.link }))}
              brandColor={effectiveColors.primary}
              secondary={effectiveColors.secondary}
              mode={effectiveColors.mode}
              selectedStyle={heroStyle}
              onStyleChange={setHeroStyle}
              content={heroContent}
              harmony={heroHarmony}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="ghost" onClick={() =>{  router.push('/admin/home-components'); }} disabled={isSubmitting}>
            Hủy bỏ
          </Button>
          <Button type="submit" variant="accent" disabled={isSubmitting || !hasChanges}>
            {isSubmitting ? 'Đang lưu...' : (hasChanges ? 'Lưu thay đổi' : 'Đã lưu')}
          </Button>
        </div>
      </form>
    </div>
  );
}
