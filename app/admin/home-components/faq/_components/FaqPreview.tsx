'use client';

import React from 'react';
import { BrowserFrame } from '../../_shared/components/BrowserFrame';
import { PreviewWrapper } from '../../_shared/components/PreviewWrapper';
import { deviceWidths, usePreviewDevice } from '../../_shared/hooks/usePreviewDevice';
import { FAQ_STYLES } from '../_lib/constants';
import { getFaqColors } from '../_lib/colors';
import { FaqSectionShared } from './FaqSectionShared';
import type { FaqBrandMode, FaqConfig, FaqItem, FaqStyle } from '../_types';

export const FaqPreview = ({
  items,
  brandColor,
  secondary,
  mode = 'dual',
  selectedStyle = 'accordion',
  onStyleChange,
  config,
  title,
}: {
  items: FaqItem[];
  brandColor: string;
  secondary: string;
  mode?: FaqBrandMode;
  selectedStyle?: FaqStyle;
  onStyleChange?: (style: FaqStyle) => void;
  config?: FaqConfig;
  title?: string;
}) => {
  const { device, setDevice } = usePreviewDevice();
  const style = selectedStyle;
  const maxVisible = device === 'mobile' ? 4 : 6;

  const tokens = getFaqColors({
    primary: brandColor,
    secondary,
    mode,
    style,
  });

  return (
    <PreviewWrapper
      title="Preview FAQ"
      device={device}
      setDevice={setDevice}
      previewStyle={style}
      setPreviewStyle={(nextStyle) => onStyleChange?.(nextStyle as FaqStyle)}
      styles={FAQ_STYLES}
      info={`${items.length} câu hỏi • ${mode.toUpperCase()}`}
      deviceWidthClass={deviceWidths[device]}
    >
      <BrowserFrame url="yoursite.com/faq">
        <FaqSectionShared
          items={items}
          title={title}
          style={style}
          config={config}
          tokens={tokens}
          context="preview"
          maxVisible={maxVisible}
        />
      </BrowserFrame>
    </PreviewWrapper>
  );
};
