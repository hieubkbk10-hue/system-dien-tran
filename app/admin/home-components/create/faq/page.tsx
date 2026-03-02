'use client';

import React, { useState } from 'react';
import { ComponentFormWrapper, useBrandColors, useComponentForm } from '../shared';
import { FaqForm } from '../../faq/_components/FaqForm';
import { FaqPreview } from '../../faq/_components/FaqPreview';
import { DEFAULT_FAQ_CONFIG, DEFAULT_FAQ_HARMONY } from '../../faq/_lib/constants';
import type { FaqConfig, FaqItem, FaqStyle } from '../../faq/_types';

const INITIAL_FAQ_ITEMS: FaqItem[] = [
  { id: 1, question: 'Làm thế nào để đặt hàng?', answer: 'Bạn có thể đặt hàng trực tuyến qua website hoặc gọi hotline.' },
  { id: 2, question: 'Chính sách đổi trả ra sao?', answer: 'Chúng tôi hỗ trợ đổi trả trong vòng 30 ngày.' },
];

export default function FaqCreatePage() {
  const { title, setTitle, active, setActive, handleSubmit, isSubmitting } = useComponentForm('Câu hỏi thường gặp', 'FAQ');
  const { primary, secondary, mode } = useBrandColors('FAQ');
  const brandMode = mode === 'single' ? 'single' : 'dual';

  const [faqItems, setFaqItems] = useState<FaqItem[]>(INITIAL_FAQ_ITEMS);
  const [style, setStyle] = useState<FaqStyle>('accordion');
  const [faqConfig, setFaqConfig] = useState<FaqConfig>(DEFAULT_FAQ_CONFIG);

  const onSubmit = (e: React.FormEvent) => {
    void handleSubmit(e, {
      items: faqItems.map((item) => ({ answer: item.answer, question: item.question })),
      style,
      ...faqConfig,
      harmony: faqConfig.harmony ?? DEFAULT_FAQ_HARMONY,
    });
  };

  return (
    <ComponentFormWrapper
      type="FAQ"
      title={title}
      setTitle={setTitle}
      active={active}
      setActive={setActive}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
    >
      <FaqForm
        faqItems={faqItems}
        setFaqItems={setFaqItems}
        faqStyle={style}
        brandColor={primary}
        faqConfig={faqConfig}
        setFaqConfig={setFaqConfig}
      />

      <FaqPreview
        items={faqItems}
        brandColor={primary}
        secondary={secondary}
        mode={brandMode}
        selectedStyle={style}
        onStyleChange={setStyle}
        config={faqConfig}
        title={title}
      />
    </ComponentFormWrapper>
  );
}
