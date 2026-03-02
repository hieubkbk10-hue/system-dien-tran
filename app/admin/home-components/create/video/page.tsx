'use client';

import React from 'react';
import { Video as VideoIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Input, Label } from '../../../components/ui';
import { ComponentFormWrapper, useBrandColors, useComponentForm } from '../shared';
import { VideoPreview } from '../../video/_components/VideoPreview';
import {
  DEFAULT_VIDEO_HARMONY,
  DEFAULT_VIDEO_STYLE,
  normalizeVideoConfig,
  normalizeVideoStyle,
} from '../../video/_lib/constants';
import { VideoForm } from '../../video/_components/VideoForm';
import type { VideoConfig } from '../../video/_types';

export default function VideoCreatePage() {
  const { title, setTitle, active, setActive, handleSubmit, isSubmitting } = useComponentForm('Video Giới thiệu', 'Video');
  const { primary, secondary, mode } = useBrandColors('Video');

  const [config, setConfig] = React.useState<VideoConfig>(() => normalizeVideoConfig({
    autoplay: false,
    badge: '',
    buttonLink: '',
    buttonText: '',
    description: 'Xem video để hiểu rõ hơn về những gì chúng tôi mang lại',
    heading: 'Khám phá sản phẩm của chúng tôi',
    harmony: DEFAULT_VIDEO_HARMONY,
    loop: false,
    muted: true,
    style: DEFAULT_VIDEO_STYLE,
    thumbnailUrl: '',
    videoUrl: '',
  }));

  const selectedStyle = normalizeVideoStyle(config.style);

  const onSubmit = (e: React.FormEvent) => {
    const normalized = normalizeVideoConfig({ ...config, style: selectedStyle });
    void handleSubmit(e, normalized);
  };

  return (
    <ComponentFormWrapper
      type="Video"
      title={title}
      setTitle={setTitle}
      active={active}
      setActive={setActive}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
    >
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <VideoIcon size={18} />
            Video
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Label>Style layout</Label>
          <Input value={selectedStyle} readOnly />
          <p className="text-xs text-slate-500">Đổi style trực tiếp ở khối Preview bên dưới.</p>
        </CardContent>
      </Card>

      <VideoForm
        config={config}
        onChange={setConfig}
        selectedStyle={selectedStyle}
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
    </ComponentFormWrapper>
  );
}
