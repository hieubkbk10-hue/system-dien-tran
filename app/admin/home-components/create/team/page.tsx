'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { ComponentFormWrapper, useBrandColors, useComponentForm } from '../shared';
import { TeamForm } from '../../team/_components/TeamForm';
import { TeamPreview } from '../../team/_components/TeamPreview';
import {
  DEFAULT_TEAM_CONFIG,
  DEFAULT_TEAM_HARMONY,
  normalizeTeamHarmony,
  normalizeTeamStyle,
  toTeamEditorMembers,
  toTeamPersistMembers,
} from '../../team/_lib/constants';
import { getTeamValidationResult } from '../../team/_lib/colors';
import type {
  TeamBrandMode,
  TeamConfig,
  TeamEditorMember,
  TeamStyle,
} from '../../team/_types';

const createDefaultMembers = (): TeamEditorMember[] => {
  const defaults = toTeamEditorMembers(DEFAULT_TEAM_CONFIG.members);

  if (defaults.length >= 2) {
    return [
      {
        ...defaults[0],
        name: 'Nguyễn Văn A',
        role: 'CEO & Founder',
      },
      {
        ...defaults[1],
        name: 'Trần Thị B',
        role: 'CTO',
      },
    ];
  }

  return [
    {
      id: 1,
      name: 'Nguyễn Văn A',
      role: 'CEO & Founder',
      avatar: '',
      bio: '',
      facebook: '',
      linkedin: '',
      twitter: '',
      email: '',
    },
    {
      id: 2,
      name: 'Trần Thị B',
      role: 'CTO',
      avatar: '',
      bio: '',
      facebook: '',
      linkedin: '',
      twitter: '',
      email: '',
    },
  ];
};

export default function TeamCreatePage() {
  const { title, setTitle, active, setActive, handleSubmit, isSubmitting } = useComponentForm('Đội ngũ của chúng tôi', 'Team');
  const { primary, secondary, mode } = useBrandColors('Team');

  const [members, setMembers] = React.useState<TeamEditorMember[]>(createDefaultMembers);
  const [style, setStyle] = React.useState<TeamStyle>(normalizeTeamStyle(DEFAULT_TEAM_CONFIG.style));
  const [harmony] = React.useState(() => normalizeTeamHarmony(DEFAULT_TEAM_HARMONY));

  const brandMode: TeamBrandMode = mode === 'single' ? 'single' : 'dual';

  const validation = React.useMemo(() => getTeamValidationResult({
    primary,
    secondary,
    mode: brandMode,
    harmony,
  }), [primary, secondary, brandMode, harmony]);

  const warningMessages = React.useMemo(() => {
    if (brandMode !== 'dual') {
      return [] as string[];
    }

    const messages: string[] = [];

    if (validation.harmonyStatus.isTooSimilar) {
      messages.push(`Màu phụ đang gần màu chính (deltaE = ${validation.harmonyStatus.deltaE}).`);
    }

    if (validation.accessibility.failing.length > 0) {
      messages.push(`Một số cặp màu chữ/nền chưa đạt APCA (minLc = ${validation.accessibility.minLc.toFixed(1)}).`);
    }

    return messages;
  }, [brandMode, validation]);

  const onSubmit = (event: React.FormEvent) => {
    const payload: TeamConfig = {
      members: toTeamPersistMembers(members),
      style,
      harmony,
    };

    void handleSubmit(event, payload as unknown as Record<string, unknown>);
  };

  return (
    <ComponentFormWrapper
      type="Team"
      title={title}
      setTitle={setTitle}
      active={active}
      setActive={setActive}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
    >
      <TeamForm
        members={members}
        onChange={setMembers}
        secondary={validation.resolvedSecondary}
      />

      {brandMode === 'dual' && warningMessages.length > 0 ? (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <div className="space-y-1">
              {warningMessages.map((message, idx) => (
                <p key={`team-create-warning-${idx}`}>{message}</p>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <TeamPreview
        members={members}
        brandColor={primary}
        secondary={secondary}
        mode={brandMode}
        harmony={harmony}
        title={title}
        selectedStyle={style}
        onStyleChange={setStyle}
      />
    </ComponentFormWrapper>
  );
}
