'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { Briefcase, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, cn } from '../../../../components/ui';
import { useBrandColors } from '../../../create/shared';
import { ConfigJsonForm } from '../../../_shared/components/ConfigJsonForm';
import { CareerPreview } from '../../_components/CareerPreview';
import { DEFAULT_CAREER_CONFIG } from '../../_lib/constants';
import type { CareerConfig, CareerStyle } from '../../_types';

export default function CareerEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { primary, secondary } = useBrandColors();
  const component = useQuery(api.homeComponents.getById, { id: id as Id<'homeComponents'> });
  const updateMutation = useMutation(api.homeComponents.update);

  const [title, setTitle] = useState('');
  const [active, setActive] = useState(true);
  const [config, setConfig] = useState<CareerConfig>(DEFAULT_CAREER_CONFIG);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (component) {
      if (component.type !== 'Career') {
        router.replace(`/admin/home-components/${id}/edit?type=${component.type.toLowerCase()}`);
        return;
      }

      setTitle(component.title);
      setActive(component.active);

      const rawConfig = component.config ?? {};
      setConfig({
        jobs: Array.isArray(rawConfig.jobs) ? rawConfig.jobs : DEFAULT_CAREER_CONFIG.jobs,
        style: (rawConfig.style as CareerStyle) || 'cards',
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
        config,
        id: id as Id<'homeComponents'>,
        title,
      });
      toast.success('Đã cập nhật Career');
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

  const jobs = Array.isArray(config.jobs) ? config.jobs : [];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Chỉnh sửa Career</h1>
        <Link href="/admin/home-components" className="text-sm text-blue-600 hover:underline">Quay lại danh sách</Link>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Briefcase size={20} />
              Career
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

        <ConfigJsonForm value={config} onChange={(next) =>{  setConfig(next as CareerConfig); }} title="Cấu hình Career" />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,420px] gap-6">
          <div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </div>
          <div className="lg:sticky lg:top-6 lg:self-start">
            <CareerPreview
              jobs={jobs as any}
              brandColor={primary}
              secondary={secondary}
              selectedStyle={config.style as any}
              onStyleChange={(style) =>{  setConfig({ ...config, style: style as CareerStyle }); }}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
