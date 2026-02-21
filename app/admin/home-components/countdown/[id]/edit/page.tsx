'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from '../../../../components/ui';
import { CountdownForm } from '../../_components/CountdownForm';
import { CountdownPreview } from '../../_components/CountdownPreview';
import { DEFAULT_COUNTDOWN_CONFIG } from '../../_lib/constants';
import { normalizeCountdownConfig, toCountdownPersistConfig } from '../../_lib/normalize';
import type { CountdownConfigState } from '../../_types';
import { useBrandColors } from '../../../create/shared';

const createSnapshot = (title: string, active: boolean, config: CountdownConfigState) => JSON.stringify({
  title: title.trim(),
  active,
  config,
});

export default function EditCountdownPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();
  const updateMutation = useMutation(api.homeComponents.update);

  const component = useQuery(api.homeComponents.getById, id ? { id: id as any } : 'skip');
  const { primary, secondary, mode } = useBrandColors();

  const [title, setTitle] = React.useState('Khuyến mãi đặc biệt');
  const [active, setActive] = React.useState(true);
  const [config, setConfig] = React.useState<CountdownConfigState>(() => normalizeCountdownConfig(DEFAULT_COUNTDOWN_CONFIG));
  const [initialSnapshot, setInitialSnapshot] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (!component) {
      return;
    }

    const normalized = normalizeCountdownConfig(component.config ?? DEFAULT_COUNTDOWN_CONFIG);
    setTitle(component.title || 'Khuyến mãi đặc biệt');
    setActive(component.active !== false);
    setConfig(normalized);
    setInitialSnapshot(createSnapshot(component.title || 'Khuyến mãi đặc biệt', component.active !== false, normalized));
  }, [component]);

  const currentSnapshot = React.useMemo(
    () => createSnapshot(title, active, config),
    [title, active, config],
  );

  const hasChanges = initialSnapshot !== null && currentSnapshot !== initialSnapshot;

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!component || isSubmitting || !hasChanges) {
      return;
    }

    setIsSubmitting(true);
    try {
      await updateMutation({
        id: component._id,
        title,
        active,
        config: toCountdownPersistConfig(config),
      });

      setInitialSnapshot(currentSnapshot);
      toast.success('Đã lưu Countdown');
    } catch (error) {
      toast.error('Lỗi khi lưu Countdown');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (component === undefined) {
    return <div className="p-6 text-sm text-slate-500">Đang tải...</div>;
  }

  if (!component) {
    return <div className="p-6 text-sm text-slate-500">Không tìm thấy component.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Chỉnh sửa Countdown</h1>
        <Link href="/admin/home-components" className="text-sm text-blue-600 hover:underline">
          ← Quay lại danh sách
        </Link>
      </div>

      <form onSubmit={handleSave}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Thông tin cơ bản</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Tiêu đề hiển thị <span className="text-red-500">*</span></Label>
              <Input
                value={title}
                onChange={(event) => { setTitle(event.target.value); }}
                required
                placeholder="Nhập tiêu đề component..."
              />
            </div>
            <div className="flex items-center gap-3">
              <Label>Trạng thái:</Label>
              <button
                type="button"
                className={`inline-flex h-5 w-10 rounded-full p-0.5 transition-colors ${active ? 'bg-green-500' : 'bg-slate-300'}`}
                onClick={() => { setActive((prev) => !prev); }}
                aria-label="Toggle active"
              >
                <span className={`h-4 w-4 rounded-full bg-white transition-transform ${active ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
              <span className="text-sm text-slate-500">{active ? 'Bật' : 'Tắt'}</span>
            </div>
          </CardContent>
        </Card>

        <CountdownForm
          value={config}
          onChange={setConfig}
          brandColor={primary}
          secondary={secondary}
          mode={mode}
        />

        <CountdownPreview
          config={config}
          brandColor={primary}
          secondary={secondary}
          mode={mode}
          selectedStyle={config.style}
          onStyleChange={(style) => {
            setConfig((prev) => ({
              ...prev,
              style,
            }));
          }}
        />

        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="ghost" onClick={() => { router.push('/admin/home-components'); }} disabled={isSubmitting}>
            Hủy bỏ
          </Button>
          <Button type="submit" variant="accent" disabled={isSubmitting || !hasChanges}>
            {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </div>
      </form>
    </div>
  );
}
