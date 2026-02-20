'use client';

import React from 'react';
import { ColorInfoPanel } from '../../_shared/components/ColorInfoPanel';
import { BrowserFrame } from '../../_shared/components/BrowserFrame';
import { PreviewWrapper } from '../../_shared/components/PreviewWrapper';
import { deviceWidths, usePreviewDevice } from '../../_shared/hooks/usePreviewDevice';
import {
  getVideoColorTokens,
  type VideoColorTokens,
} from '../_lib/colors';
import { DEFAULT_VIDEO_HARMONY, VIDEO_STYLES, normalizeVideoHarmony } from '../_lib/constants';
import type {
  VideoBrandMode,
  VideoConfig,
  VideoHarmony,
  VideoStyle,
} from '../_types';
import { VideoSectionShared } from './VideoSectionShared';

interface VideoPreviewProps {
  config: VideoConfig;
  brandColor: string;
  secondary: string;
  selectedStyle?: VideoStyle;
  onStyleChange?: (style: VideoStyle) => void;
  mode?: VideoBrandMode;
  harmony?: VideoHarmony;
}

const getPreviewInfo = (style: VideoStyle, videoUrl: string) => {
  if (!videoUrl.trim()) {return 'Chưa có video';}

  switch (style) {
    case 'centered':
    case 'split':
    case 'minimal':
      return 'Tỉ lệ khuyến nghị: 1280×720 (16:9)';
    case 'fullwidth':
    case 'cinema':
      return 'Tỉ lệ khuyến nghị: 1920×820 (21:9)';
    case 'parallax':
      return 'Tỉ lệ khuyến nghị: 1920×1080 (16:9)';
    default:
      return 'Video preview';
  }
};

export const VideoPreview = ({
  config,
  brandColor,
  secondary,
  selectedStyle,
  onStyleChange,
  mode = 'dual',
  harmony = DEFAULT_VIDEO_HARMONY,
}: VideoPreviewProps) => {
  const { device, setDevice } = usePreviewDevice();

  const previewStyle = selectedStyle ?? config.style ?? 'centered';
  const resolvedHarmony = normalizeVideoHarmony(harmony);

  const tokens: VideoColorTokens = React.useMemo(
    () => getVideoColorTokens({
      primary: brandColor,
      secondary,
      mode,
      harmony: resolvedHarmony,
      style: previewStyle,
    }),
    [brandColor, secondary, mode, resolvedHarmony, previewStyle],
  );

  return (
    <>
      <PreviewWrapper
        title="Preview Video"
        device={device}
        setDevice={setDevice}
        previewStyle={previewStyle}
        setPreviewStyle={(next) => onStyleChange?.(next as VideoStyle)}
        styles={VIDEO_STYLES}
        info={getPreviewInfo(previewStyle, config.videoUrl)}
        deviceWidthClass={deviceWidths[device]}
      >
        <BrowserFrame>
          <VideoSectionShared
            context="preview"
            isPreview
            device={device}
            config={{ ...config, style: previewStyle }}
            style={previewStyle}
            title={config.heading}
            tokens={tokens}
          />
        </BrowserFrame>
      </PreviewWrapper>
      {mode === 'dual' ? (
        <ColorInfoPanel brandColor={tokens.primary} secondary={tokens.secondary} />
      ) : null}
    </>
  );
};
