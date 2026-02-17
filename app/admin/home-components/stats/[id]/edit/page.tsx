'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, cn } from '../../../../components/ui';
import { useBrandColors } from '../../../create/shared';
import { StatsForm, type StatsFormItem } from '../../_components/StatsForm';
import { StatsPreview } from '../../_components/StatsPreview';
import { DEFAULT_STATS_ITEMS } from '../../_lib/constants';
import type { StatsBrandMode, StatsItem, StatsStyle } from '../../_types';

export default function StatsEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { primary, secondary } = useBrandColors();
  const modeSetting = useQuery(api.settings.getByKey, { key: 'site_brand_mode' });
  const brandMode: StatsBrandMode = modeSetting?.value === 'single' ? 'single' : 'dual';
  const component = useQuery(api.homeComponents.getById, { id: id as Id<'homeComponents'> });
  const updateMutation = useMutation(api.homeComponents.update);

  const [title, setTitle] = useState('');
  const [active, setActive] = useState(true);
  const [statsItems, setStatsItems] = useState<StatsFormItem[]>([]);
  const [statsStyle, setStatsStyle] = useState<StatsStyle>('horizontal');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [initialData, setInitialData] = useState<{
    title: string;
    active: boolean;
    items: StatsFormItem[];
    style: StatsStyle;
  } | null>(null);

  useEffect(() => {
    if (component) {
      if (component.type !== 'Stats') {
        router.replace(`/admin/home-components/${id}/edit`);
        return;
      }

      setTitle(component.title);
      setActive(component.active);

      const config = component.config ?? {};
      const items = (config.items as StatsItem[] | undefined) ?? DEFAULT_STATS_ITEMS;
      const mappedItems = items.map((item, idx) => ({ id: `stat-${idx}`, label: item.label, value: item.value }));
      const style = (config.style as StatsStyle) || 'horizontal';

      setStatsItems(mappedItems);
      setStatsStyle(style);
      setInitialData({
        title: component.title,
        active: component.active,
        items: mappedItems,
        style,
      });
      setHasChanges(false);
    }
  }, [component, id, router]);

  useEffect(() => {
    if (!initialData) {return;}

    const currentItems = JSON.stringify(statsItems);
    const initialItems = JSON.stringify(initialData.items);
    const changed = title !== initialData.title
      || active !== initialData.active
      || statsStyle !== initialData.style
      || currentItems !== initialItems;

    setHasChanges(changed);
  }, [title, active, statsItems, statsStyle, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) {return;}

    setIsSubmitting(true);
    try {
      await updateMutation({
        active,
        config: {
          items: statsItems.map((item) => ({ label: item.label, value: item.value })),
          style: statsStyle,
        },
        id: id as Id<'homeComponents'>,
        title,
      });
      toast.success('Đã cập nhật Thống kê');
      setInitialData({
        title,
        active,
        items: statsItems,
        style: statsStyle,
      });
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
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Chỉnh sửa Thống kê</h1>
        <Link href="/admin/home-components" className="text-sm text-blue-600 hover:underline">Quay lại danh sách</Link>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertCircle size={20} />
              Thống kê
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

        <StatsForm items={statsItems} onChange={setStatsItems} />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,420px] gap-6">
          <div></div>
          <div className="lg:sticky lg:top-6 lg:self-start">
            <StatsPreview
              items={statsItems.map((item) => ({ label: item.label, value: item.value }))}
              brandColor={primary}
              secondary={secondary}
              mode={brandMode}
              selectedStyle={statsStyle}
              onStyleChange={setStatsStyle}
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
