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
import { useBrandColors } from '../../../create/shared';
import { FaqForm } from '../../_components/FaqForm';
import { FaqPreview } from '../../_components/FaqPreview';
import { DEFAULT_FAQ_ITEMS } from '../../_lib/constants';
import type { FaqConfig, FaqItem, FaqStyle } from '../../_types';

export default function FaqEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { primary, secondary } = useBrandColors();
  const component = useQuery(api.homeComponents.getById, { id: id as Id<'homeComponents'> });
  const updateMutation = useMutation(api.homeComponents.update);

  const [title, setTitle] = useState('');
  const [active, setActive] = useState(true);
  const [faqItems, setFaqItems] = useState<FaqItem[]>(DEFAULT_FAQ_ITEMS);
  const [faqStyle, setFaqStyle] = useState<FaqStyle>('accordion');
  const [faqConfig, setFaqConfig] = useState<FaqConfig>({ description: '', buttonText: '', buttonLink: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (component) {
      if (component.type !== 'FAQ') {
        router.replace(`/admin/home-components/${id}/edit`);
        return;
      }

      setTitle(component.title);
      setActive(component.active);

      const config = component.config ?? {};
      const items = (config.items as { question: string; answer: string }[] | undefined) ?? DEFAULT_FAQ_ITEMS;
      setFaqItems(items.map((item, idx) => ({ id: `faq-${idx}`, question: item.question ?? '', answer: item.answer ?? '' })));
      setFaqStyle((config.style as FaqStyle) || 'accordion');
      setFaqConfig({
        buttonLink: (config.buttonLink as string | undefined) ?? '',
        buttonText: (config.buttonText as string | undefined) ?? '',
        description: (config.description as string | undefined) ?? '',
      });
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
          buttonLink: faqConfig.buttonLink,
          buttonText: faqConfig.buttonText,
          description: faqConfig.description,
          items: faqItems.map((item) => ({ answer: item.answer, question: item.question })),
          style: faqStyle,
        },
        id: id as Id<'homeComponents'>,
        title,
      });
      toast.success('Đã cập nhật FAQ');
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

        <FaqForm
          faqItems={faqItems}
          setFaqItems={setFaqItems}
          faqStyle={faqStyle}
          brandColor={primary}
          faqConfig={faqConfig}
          setFaqConfig={setFaqConfig}
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,420px] gap-6">
          <div></div>
          <div className="lg:sticky lg:top-6 lg:self-start">
            <FaqPreview
              items={faqItems as any}
              brandColor={primary}
              secondary={secondary}
              selectedStyle={faqStyle as any}
              onStyleChange={(style) =>{  setFaqStyle(style as FaqStyle); }}
              config={faqConfig as any}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="ghost" onClick={() =>{  router.push('/admin/home-components'); }} disabled={isSubmitting}>
            Hủy bỏ
          </Button>
          <Button type="submit" variant="accent" disabled={isSubmitting}>
            {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </div>
      </form>
    </div>
  );
}
