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
import { getVideoValidationResult } from '../../video/_lib/colors';
import { VideoForm } from '../../video/_components/VideoForm';
import type { VideoConfig, VideoStyle } from '../../video/_types';

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

export default function VideoCreatePage() {
  const { title, setTitle, active, setActive, handleSubmit, isSubmitting } = useComponentForm('Video Giới thiệu', 'Video');
  const { primary, secondary, mode } = useBrandColors();

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

  const warningMessages = React.useMemo(
    () => getWarningMessages(config, selectedStyle, primary, secondary, mode),
    [config, selectedStyle, primary, secondary, mode],
  );

  const onSubmit = (e: React.FormEvent) => {
    const normalized = normalizeVideoConfig({ ...config, style: selectedStyle });
    void handleSubmit(e, normalized as unknown as Record<string, unknown>);
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
    </ComponentFormWrapper>
  );
}
