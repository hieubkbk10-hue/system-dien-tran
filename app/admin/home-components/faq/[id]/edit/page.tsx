'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { HelpCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, cn } from '../../../../components/ui';
import { TypeColorOverrideCard } from '../../../_shared/components/TypeColorOverrideCard';
import { useTypeColorOverrideState } from '../../../_shared/hooks/useTypeColorOverride';
import { getSuggestedSecondary, resolveSecondaryByMode } from '../../../_shared/lib/typeColorOverride';
import { FaqForm } from '../../_components/FaqForm';
import { FaqPreview } from '../../_components/FaqPreview';
import { DEFAULT_FAQ_CONFIG, DEFAULT_FAQ_HARMONY, DEFAULT_FAQ_ITEMS, FAQ_STYLES } from '../../_lib/constants';
import type { FaqConfig, FaqHarmony, FaqItem, FaqStyle } from '../../_types';

const COMPONENT_TYPE = 'FAQ';

const FALLBACK_FAQ_ITEMS: FaqItem[] = DEFAULT_FAQ_ITEMS.map((item, idx) => ({
  ...item,
  id: `faq-${idx}`,
}));

const toFaqStyle = (value: unknown): FaqStyle => {
  if (typeof value !== 'string') {return 'accordion';}
  const matchedStyle = FAQ_STYLES.find((style) => style.id === value);
  return matchedStyle?.id ?? 'accordion';
};

const toFaqItems = (value: unknown): FaqItem[] => {
  if (!Array.isArray(value)) {return FALLBACK_FAQ_ITEMS;}

  const mapped = value.map((item, idx) => {
    if (!item || typeof item !== 'object') {
      return {
        id: `faq-${idx}`,
        question: '',
        answer: '',
      };
    }

    const data = item as { question?: unknown; answer?: unknown };

    return {
      id: `faq-${idx}`,
      question: typeof data.question === 'string' ? data.question : '',
      answer: typeof data.answer === 'string' ? data.answer : '',
    };
  });

  return mapped.length > 0 ? mapped : FALLBACK_FAQ_ITEMS;
};

const isFaqHarmony = (value: unknown): value is FaqHarmony => (
  value === 'analogous' || value === 'complementary' || value === 'triadic'
);

const toFaqConfig = (value: Record<string, unknown> | null | undefined): FaqConfig => {
  const config = value ?? {};
  return {
    description: typeof config.description === 'string' ? config.description : DEFAULT_FAQ_CONFIG.description,
    buttonText: typeof config.buttonText === 'string' ? config.buttonText : DEFAULT_FAQ_CONFIG.buttonText,
    buttonLink: typeof config.buttonLink === 'string' ? config.buttonLink : DEFAULT_FAQ_CONFIG.buttonLink,
    harmony: isFaqHarmony(config.harmony) ? config.harmony : DEFAULT_FAQ_HARMONY,
  };
};

export default function FaqEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { customState, effectiveColors, initialCustom, setCustomState, setInitialCustom, showCustomBlock } = useTypeColorOverrideState(COMPONENT_TYPE);
  const brandMode = effectiveColors.mode === 'single' ? 'single' : 'dual';
  const setTypeColorOverride = useMutation(api.homeComponentSystemConfig.setTypeColorOverride);

  const component = useQuery(api.homeComponents.getById, { id: id as Id<'homeComponents'> });
  const updateMutation = useMutation(api.homeComponents.update);

  const [title, setTitle] = useState('');
  const [active, setActive] = useState(true);
  const [faqItems, setFaqItems] = useState<FaqItem[]>(FALLBACK_FAQ_ITEMS);
  const [faqStyle, setFaqStyle] = useState<FaqStyle>('accordion');
  const [faqConfig, setFaqConfig] = useState<FaqConfig>(DEFAULT_FAQ_CONFIG);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [initialData, setInitialData] = useState<{
    title: string;
    active: boolean;
    faqItems: FaqItem[];
    faqStyle: FaqStyle;
    faqConfig: FaqConfig;
  } | null>(null);

  useEffect(() => {
    if (!component) {return;}

    if (component.type !== 'FAQ') {
      router.replace(`/admin/home-components/${id}/edit`);
      return;
    }

    setTitle(component.title);
    setActive(component.active);

    const config = component.config ?? {};
    const nextFaqItems = toFaqItems(config.items);
    const nextFaqStyle = toFaqStyle(config.style);
    const nextFaqConfig = toFaqConfig(config);

    setFaqItems(nextFaqItems);
    setFaqStyle(nextFaqStyle);
    setFaqConfig(nextFaqConfig);
    setInitialData({
      title: component.title,
      active: component.active,
      faqItems: nextFaqItems,
      faqStyle: nextFaqStyle,
      faqConfig: nextFaqConfig,
    });
    setHasChanges(false);
  }, [component, id, router]);

  useEffect(() => {
    if (!initialData) {return;}

    const resolvedCustomSecondary = resolveSecondaryByMode(customState.mode, customState.primary, customState.secondary);
    const resolvedInitialSecondary = resolveSecondaryByMode(initialCustom.mode, initialCustom.primary, initialCustom.secondary);
    const customChanged = showCustomBlock
      ? customState.enabled !== initialCustom.enabled
        || customState.mode !== initialCustom.mode
        || customState.primary !== initialCustom.primary
        || resolvedCustomSecondary !== resolvedInitialSecondary
      : false;
    const changed = title !== initialData.title
      || active !== initialData.active
      || faqStyle !== initialData.faqStyle
      || JSON.stringify(faqItems) !== JSON.stringify(initialData.faqItems)
      || JSON.stringify(faqConfig) !== JSON.stringify(initialData.faqConfig)
      || customChanged;

    setHasChanges(changed);
  }, [title, active, faqItems, faqStyle, faqConfig, initialData, customState, initialCustom, showCustomBlock]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) {return;}

    setIsSubmitting(true);
    try {
      const nextConfig: FaqConfig = {
        buttonLink: faqConfig.buttonLink,
        buttonText: faqConfig.buttonText,
        description: faqConfig.description,
        harmony: faqConfig.harmony ?? DEFAULT_FAQ_HARMONY,
      };

      await updateMutation({
        active,
        config: {
          buttonLink: nextConfig.buttonLink,
          buttonText: nextConfig.buttonText,
          description: nextConfig.description,
          harmony: nextConfig.harmony,
          items: faqItems.map((item) => ({ answer: item.answer, question: item.question })),
          style: faqStyle,
        },
        id: id as Id<'homeComponents'>,
        title,
      });
      if (showCustomBlock) {
        const resolvedCustomSecondary = resolveSecondaryByMode(customState.mode, customState.primary, customState.secondary);
        await setTypeColorOverride({
          enabled: customState.enabled,
          mode: customState.mode,
          primary: customState.primary,
          secondary: resolvedCustomSecondary,
          type: COMPONENT_TYPE,
        });
      }
      toast.success('Đã cập nhật FAQ');
      setFaqConfig(nextConfig);
      setInitialData({
        title,
        active,
        faqItems,
        faqStyle,
        faqConfig: nextConfig,
      });
      if (showCustomBlock) {
        const resolvedCustomSecondary = resolveSecondaryByMode(customState.mode, customState.primary, customState.secondary);
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
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Chỉnh sửa FAQ</h1>
        <Link href="/admin/home-components" className="text-sm text-blue-600 hover:underline">Quay lại danh sách</Link>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <HelpCircle size={20} />
              FAQ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Tiêu đề hiển thị <span className="text-red-500">*</span></Label>
              <Input
                value={title}
                onChange={(e) => { setTitle(e.target.value); }}
                required
                placeholder="Nhập tiêu đề component..."
              />
            </div>

            <div className="flex items-center gap-3">
              <Label>Trạng thái:</Label>
              <div
                className={cn(
                  'cursor-pointer inline-flex items-center justify-center rounded-full w-12 h-6 transition-colors',
                  active ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600',
                )}
                onClick={() => { setActive(!active); }}
              >
                <div
                  className={cn(
                    'w-5 h-5 bg-white rounded-full transition-transform shadow',
                    active ? 'translate-x-2.5' : '-translate-x-2.5',
                  )}
                />
              </div>
              <span className="text-sm text-slate-500">{active ? 'Bật' : 'Tắt'}</span>
            </div>
          </CardContent>
        </Card>

        <FaqForm
          faqItems={faqItems}
          setFaqItems={setFaqItems}
          faqStyle={faqStyle}
          brandColor={effectiveColors.primary}
          faqConfig={faqConfig}
          setFaqConfig={setFaqConfig}
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,420px] gap-6">
          <div></div>
          <div className="lg:sticky lg:top-6 lg:self-start space-y-4">
            {showCustomBlock && (
              <TypeColorOverrideCard
                title="Màu custom cho FAQ"
                enabled={customState.enabled}
                mode={customState.mode}
                primary={customState.primary}
                secondary={customState.secondary}
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
                onPrimaryChange={(value) => setCustomState((prev) => ({
                  ...prev,
                  primary: value,
                  secondary: prev.mode === 'single' ? value : prev.secondary,
                }))}
                onSecondaryChange={(value) => setCustomState((prev) => ({ ...prev, secondary: value }))}
              />
            )}
            <FaqPreview
              items={faqItems}
              brandColor={effectiveColors.primary}
              secondary={effectiveColors.secondary}
              mode={brandMode}
              selectedStyle={faqStyle}
              onStyleChange={setFaqStyle}
              config={faqConfig}
              title={title}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="ghost" onClick={() => { router.push('/admin/home-components'); }} disabled={isSubmitting}>
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
