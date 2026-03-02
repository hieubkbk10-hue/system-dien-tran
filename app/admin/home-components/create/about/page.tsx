'use client';

import React from 'react';
import { Eye } from 'lucide-react';
import { ComponentFormWrapper, useBrandColors, useComponentForm } from '../shared';
import { AboutForm } from '../../about/_components/AboutForm';
import { AboutPreview } from '../../about/_components/AboutPreview';
import {
  DEFAULT_ABOUT_EDITOR_STATE,
  normalizeAboutHarmony,
  toAboutPersistStats,
} from '../../about/_lib/constants';
import {
  buildAboutWarningMessages,
  getAboutValidationResult,
} from '../../about/_lib/colors';

export default function AboutCreatePage() {
  const { title, setTitle, active, setActive, handleSubmit, isSubmitting } = useComponentForm('Về chúng tôi', 'About');
  const { primary, secondary, mode } = useBrandColors('About');

  const [state, setState] = React.useState(DEFAULT_ABOUT_EDITOR_STATE);

  const harmony = normalizeAboutHarmony(state.harmony);

  const validation = React.useMemo(
    () => getAboutValidationResult({
      primary,
      secondary,
      mode,
      harmony,
      style: state.style,
    }),
    [primary, secondary, mode, harmony, state.style],
  );

  const warningMessages = React.useMemo(
    () => buildAboutWarningMessages({ mode, validation }),
    [mode, validation],
  );

  const onSubmit = (event: React.FormEvent) => {
    void handleSubmit(event, {
      subHeading: state.subHeading,
      heading: state.heading,
      description: state.description,
      image: state.image,
      imageCaption: state.imageCaption,
      buttonText: state.buttonText,
      buttonLink: state.buttonLink,
      stats: toAboutPersistStats(state.stats),
      style: state.style,
      harmony,
    });
  };

  return (
    <ComponentFormWrapper
      type="About"
      title={title}
      setTitle={setTitle}
      active={active}
      setActive={setActive}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
    >
      <AboutForm state={state} onChange={setState} />

      {mode === 'dual' && warningMessages.length > 0 ? (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
          <div className="space-y-2">
            {warningMessages.map((message, idx) => (
              <div key={`${idx}-${message}`} className="flex items-start gap-2">
                <Eye size={14} className="mt-0.5 flex-shrink-0" />
                <p>{message}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <AboutPreview
        config={{
          subHeading: state.subHeading,
          heading: state.heading,
          description: state.description,
          image: state.image,
          imageCaption: state.imageCaption,
          buttonText: state.buttonText,
          buttonLink: state.buttonLink,
          stats: toAboutPersistStats(state.stats),
          style: state.style,
          harmony,
        }}
        brandColor={validation.tokens.primary}
        secondary={validation.tokens.secondary}
        mode={mode}
        selectedStyle={state.style}
        onStyleChange={(style) => {
          setState((prev) => ({ ...prev, style }));
        }}
      />
    </ComponentFormWrapper>
  );
}
