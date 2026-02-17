'use client';

import React from 'react';
import { cn } from '../../../components/ui';
import { normalizeCTAStyle } from '../_lib/constants';
import type { CTAStyleTokens } from '../_lib/colors';
import type { CTAConfig, CTAStyle } from '../_types';

interface CTASectionSharedProps {
  config: CTAConfig;
  style: CTAStyle;
  tokens: CTAStyleTokens;
  context: 'preview' | 'site';
}

const CTA_FALLBACKS = {
  buttonLink: '#',
  buttonText: 'Bắt đầu ngay',
  description: 'Đăng ký ngay để nhận ưu đãi đặc biệt',
  title: 'Sẵn sàng bắt đầu?',
};

const getValue = (value?: string) => {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : undefined;
};

const buttonBaseClass = 'inline-flex min-h-[44px] items-center justify-center rounded-lg px-5 py-2.5 text-sm font-bold transition-colors duration-200';

export function CTASectionShared({ config, style, tokens, context }: CTASectionSharedProps) {
  const normalizedStyle = normalizeCTAStyle(style);
  const HeadingTag = context === 'site' ? 'h2' : 'h3';

  const badge = getValue(config.badge);
  const title = getValue(config.title) ?? CTA_FALLBACKS.title;
  const description = getValue(config.description) ?? CTA_FALLBACKS.description;
  const primaryButtonText = getValue(config.buttonText) ?? CTA_FALLBACKS.buttonText;
  const primaryButtonLink = getValue(config.buttonLink) ?? CTA_FALLBACKS.buttonLink;
  const secondaryButtonText = getValue(config.secondaryButtonText);
  const secondaryButtonLink = getValue(config.secondaryButtonLink) ?? CTA_FALLBACKS.buttonLink;

  const sectionClass = context === 'preview' ? 'w-full' : '';

  const primaryButton = (
    <a
      href={primaryButtonLink}
      className={cn(buttonBaseClass, 'whitespace-nowrap')}
      style={{
        backgroundColor: tokens.primaryButtonBg,
        border: tokens.primaryButtonBorder ? `1px solid ${tokens.primaryButtonBorder}` : undefined,
        color: tokens.primaryButtonText,
      }}
    >
      {primaryButtonText}
    </a>
  );

  const secondaryButton = secondaryButtonText ? (
    <a
      href={secondaryButtonLink}
      className={cn(buttonBaseClass, 'whitespace-nowrap border')}
      style={{
        backgroundColor: tokens.secondaryButtonBg ?? 'transparent',
        borderColor: tokens.secondaryButtonBorder,
        color: tokens.secondaryButtonText,
      }}
    >
      {secondaryButtonText}
    </a>
  ) : null;

  const badgeNode = badge ? (
    <span
      className="mb-3 inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide"
      style={{
        backgroundColor: tokens.badgeBg,
        color: tokens.badgeText,
      }}
    >
      {badge}
    </span>
  ) : null;

  if (normalizedStyle === 'banner') {
    return (
      <section className={cn('py-10 md:py-14', sectionClass)} style={{ background: tokens.sectionBg, borderColor: tokens.sectionBorder }}>
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 md:flex-row md:gap-8">
          <div className="max-w-xl text-center md:text-left">
            {badgeNode}
            <HeadingTag className="text-2xl font-bold md:text-3xl" style={{ color: tokens.title }}>
              {title}
            </HeadingTag>
            <p className="mt-2 text-sm md:text-base" style={{ color: tokens.description }}>
              {description}
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            {primaryButton}
            {secondaryButton}
          </div>
        </div>
      </section>
    );
  }

  if (normalizedStyle === 'centered') {
    return (
      <section className={cn('py-12 md:py-16', sectionClass)} style={{ background: tokens.sectionBg, borderColor: tokens.sectionBorder }}>
        <div className="mx-auto max-w-3xl text-center">
          {badgeNode}
          <HeadingTag className="text-2xl font-bold md:text-4xl" style={{ color: tokens.title }}>
            {title}
          </HeadingTag>
          <p className="mx-auto mt-3 max-w-2xl text-sm md:text-base" style={{ color: tokens.description }}>
            {description}
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {primaryButton}
            {secondaryButton}
          </div>
        </div>
      </section>
    );
  }

  if (normalizedStyle === 'split') {
    return (
      <section className={cn('bg-slate-50 py-10 md:py-14', sectionClass)} style={{ background: tokens.sectionBg, borderColor: tokens.sectionBorder }}>
        <div
          className="mx-auto max-w-5xl rounded-xl border p-5 md:p-8"
          style={{
            backgroundColor: tokens.cardBg,
            borderColor: tokens.cardBorder,
            boxShadow: tokens.cardShadow,
          }}
        >
          <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-[1fr,auto]">
            <div>
              {badgeNode}
              <div className="mb-4 h-1 w-16 rounded-full" style={{ backgroundColor: tokens.accentLine ?? tokens.secondaryButtonBorder }} />
              <HeadingTag className="text-xl font-bold md:text-2xl" style={{ color: tokens.title }}>
                {title}
              </HeadingTag>
              <p className="mt-2 text-sm md:text-base" style={{ color: tokens.description }}>
                {description}
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row md:flex-col">
              {primaryButton}
              {secondaryButton}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (normalizedStyle === 'floating') {
    return (
      <section className={cn('bg-slate-50 py-10 md:py-16', sectionClass)} style={{ background: tokens.sectionBg }}>
        <div className="mx-auto max-w-5xl">
          <div
            className="rounded-xl border p-5 md:p-8"
            style={{
              backgroundColor: tokens.cardBg,
              borderColor: tokens.cardBorder,
              boxShadow: tokens.cardShadow,
            }}
          >
            <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
              <div className="max-w-2xl">
                {badgeNode}
                <HeadingTag className="text-xl font-bold md:text-3xl" style={{ color: tokens.title }}>
                  {title}
                </HeadingTag>
                <p className="mt-2 text-sm md:text-base" style={{ color: tokens.description }}>
                  {description}
                </p>
              </div>
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                {primaryButton}
                {secondaryButton}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (normalizedStyle === 'gradient') {
    return (
      <section className={cn('px-4 py-8 md:py-12 lg:py-16', sectionClass)} style={{ background: tokens.sectionBg }}>
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          {badgeNode}
          <HeadingTag className="text-xl font-bold sm:text-2xl md:text-3xl lg:text-4xl" style={{ color: tokens.title }}>
            {title}
          </HeadingTag>
          <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed sm:mt-3 sm:text-base" style={{ color: tokens.description }}>
            {description}
          </p>
          <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:mt-6 sm:flex-row md:mt-7">
            {primaryButton}
            {secondaryButton}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={cn('border-y py-8 md:py-10', sectionClass)}
      style={{
        background: tokens.sectionBg,
        borderColor: tokens.sectionBorder,
      }}
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-5 md:flex-row md:gap-8">
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="hidden h-14 w-1 rounded-full md:block" style={{ backgroundColor: tokens.accentLine }} />
          <div>
            <HeadingTag className="text-xl font-bold" style={{ color: tokens.title }}>
              {title}
            </HeadingTag>
            <p className="mt-1 text-sm md:text-base" style={{ color: tokens.description }}>
              {description}
            </p>
          </div>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          {primaryButton}
          {secondaryButton}
        </div>
      </div>
    </section>
  );
}
