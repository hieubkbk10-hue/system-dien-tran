'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from 'convex/react';
import { Loader2, Video as VideoIcon } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, cn } from '../../../../components/ui';
import { useBrandColors } from '../../../create/shared';
import { VideoPreview } from '../../_components/VideoPreview';
import { VideoForm } from '../../_components/VideoForm';
import {
  DEFAULT_VIDEO_HARMONY,
  normalizeVideoConfig,
  normalizeVideoStyle,
} from '../../_lib/constants';
import { getVideoValidationResult } from '../../_lib/colors';
import type { VideoConfig, VideoStyle } from '../../_types';

const getWarningMessages = (
  config: VideoConfig,
  style: VideoStyle,
  primary: string,
  secondary: string,
  mode: 'single' | 'dual',
) => {
  if (mode !== 'dual') {return [] as string[];}

  const validation = getVideoValidationResult({
    primary,
    secondary,
    mode,
    harmony: config.harmony,
    style,
  });

  const warnings: string[] = [];

  if (validation.harmonyStatus.isTooSimilar) {
    warnings.push('Màu chính và màu phụ đang quá giống nhau (deltaE thấp), điểm nhấn dual mode có thể khó nhận thấy.');
  }

  if (validation.accessibility.failing.length > 0) {
    warnings.push(`Một số cặp màu chưa đạt APCA tối thiểu (LC thấp nhất: ${validation.accessibility.minLc.toFixed(1)}).`);
  }

  return warnings;
};

export default function VideoEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const { primary, secondary, mode } = useBrandColors();
  const component = useQuery(api.homeComponents.getById, { id: id as Id<'homeComponents'> });
  const updateMutation = useMutation(api.homeComponents.update);

  const [title, setTitle] = React.useState('');
  const [active, setActive] = React.useState(true);
  const [config, setConfig] = React.useState<VideoConfig>(() => normalizeVideoConfig({
    autoplay: false,
    badge: '',
    buttonLink: '',
    buttonText: '',
    description: '',
    heading: '',
    harmony: DEFAULT_VIDEO_HARMONY,
    loop: false,
    muted: true,
    style: 'centered',
    thumbnailUrl: '',
    videoUrl: '',
  }));
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [snapshot, setSnapshot] = React.useState<string>('');

  React.useEffect(() => {
    if (!component) {return;}

    if (component.type !== 'Video') {
      router.replace(`/admin/home-components/${id}/edit`);
      return;
    }

    const normalized = normalizeVideoConfig(component.config);

    setTitle(component.title);
    setActive(component.active);
    setConfig(normalized);

    const nextSnapshot = JSON.stringify({
      active: component.active,
      config: normalized,
      title: component.title,
    });

    setSnapshot(nextSnapshot);
  }, [component, id, router]);

  const selectedStyle = normalizeVideoStyle(config.style);

  const warningMessages = React.useMemo(
    () => getWarningMessages(config, selectedStyle, primary, secondary, mode),
    [config, selectedStyle, primary, secondary, mode],
  );

  const hasChanges = React.useMemo(() => {
    const current = JSON.stringify({
      active,
      config: normalizeVideoConfig({ ...config, style: selectedStyle }),
      title,
    });

    return snapshot !== '' && current !== snapshot;
  }, [active, config, selectedStyle, title, snapshot]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting || !hasChanges) {return;}

    setIsSubmitting(true);

    try {
      const normalized = normalizeVideoConfig({ ...config, style: selectedStyle });

      await updateMutation({
        id: id as Id<'homeComponents'>,
        title,
        active,
        config: normalized,
      });

      setConfig(normalized);
      setSnapshot(JSON.stringify({ title, active, config: normalized }));
      toast.success('Đã cập nhật Video');
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
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Chỉnh sửa Video</h1>
        <Link href="/admin/home-components" className="text-sm text-blue-600 hover:underline">Quay lại danh sách</Link>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <VideoIcon size={20} />
              Video
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Tiêu đề hiển thị <span className="text-red-500">*</span></Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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
                onClick={() => setActive(!active)}
              >
                <div className={cn(
                  'w-5 h-5 bg-white rounded-full transition-transform shadow',
                  active ? 'translate-x-2.5' : '-translate-x-2.5',
                )} />
              </div>
              <span className="text-sm text-slate-500">{active ? 'Bật' : 'Tắt'}</span>
            </div>
          </CardContent>
        </Card>

        <VideoForm
          config={config}
          onChange={setConfig}
          selectedStyle={selectedStyle}
          mode={mode}
          warningMessages={warningMessages}
        />

        <VideoPreview
          config={config}
          brandColor={primary}
          secondary={secondary}
          selectedStyle={selectedStyle}
          onStyleChange={(style) => setConfig((prev) => ({ ...prev, style }))}
          mode={mode}
          harmony={config.harmony}
        />

        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="ghost" onClick={() => router.push('/admin/home-components')} disabled={isSubmitting}>
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
