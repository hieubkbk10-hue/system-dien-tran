'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/admin/components/ui';
import type { ContactConfigState } from '../_types';
import { validateContactConfig } from '../_lib/validation';
import { CONTACT_HARMONY_OPTIONS } from '../_lib/constants';
import { FormFieldsSelector } from './FormFieldsSelector';
import { SocialLinksManager } from './SocialLinksManager';
import { DynamicTextFields } from './DynamicTextFields';

interface ConfigEditorProps {
  value: ContactConfigState;
  onChange: (config: ContactConfigState) => void;
  title?: string;
}

interface ValidationErrors {
  mapEmbed?: string;
  email?: string;
  phone?: string;
  socialLinks?: Record<number, { url?: string }>;
}

export function ConfigEditor({ value, onChange, title }: ConfigEditorProps) {
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  // Validate config và track errors
  useEffect(() => {
    const result = validateContactConfig(value);
    setValidationErrors(result.errors);
  }, [value]);

  // Helper để update config không mutate
  const updateConfig = (updates: Partial<ContactConfigState>) => {
    onChange({ ...value, ...updates });
  };

  // Helper để update nested texts
  const updateTexts = (texts: Record<string, string>) => {
    onChange({ ...value, texts });
  };

  // Helper để update socialLinks
  const updateSocialLinks = (socialLinks: typeof value.socialLinks) => {
    onChange({ ...value, socialLinks });
  };

  // Helper để update formFields
  const updateFormFields = (formFields: string[]) => {
    onChange({ ...value, formFields });
  };

  // Handle social links validation errors
  const handleSocialValidationChange = (errors: Record<number, { url?: string }>) => {
    setValidationErrors(prev => ({
      ...prev,
      socialLinks: Object.keys(errors).length > 0 ? errors : undefined,
    }));
  };

  return (
    <div className="space-y-6">
      {title && (
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          {title}
        </h2>
      )}

      {/* Card 1: Map Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Cài đặt bản đồ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Toggle showMap */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Hiển thị bản đồ
            </label>
            <div
              onClick={() => updateConfig({ showMap: !value.showMap })}
              className="relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer transition-colors"
              style={{
                backgroundColor: value.showMap ? '#3b82f6' : '#cbd5e1',
              }}
            >
              <span
                className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                style={{
                  transform: value.showMap ? 'translateX(1.5rem)' : 'translateX(0.25rem)',
                }}
              />
            </div>
          </div>

          {/* Conditional mapEmbed textarea */}
          {value.showMap && (
            <div>
              <label
                htmlFor="mapEmbed"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
              >
                Mã nhúng bản đồ
              </label>
              <textarea
                id="mapEmbed"
                value={value.mapEmbed}
                onChange={(e) => updateConfig({ mapEmbed: e.target.value })}
                placeholder="Nhập iframe embed code từ Google Maps"
                rows={4}
                className={`w-full px-3 py-2 border rounded-md text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  validationErrors.mapEmbed
                    ? 'border-red-500 dark:border-red-500'
                    : 'border-slate-300 dark:border-slate-600'
                }`}
              />
              {validationErrors.mapEmbed && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  {validationErrors.mapEmbed}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Card 2: Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Thông tin liên hệ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              Địa chỉ
            </label>
            <input
              id="address"
              type="text"
              value={value.address}
              onChange={(e) => updateConfig({ address: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              Số điện thoại
            </label>
            <input
              id="phone"
              type="text"
              value={value.phone}
              onChange={(e) => updateConfig({ phone: e.target.value })}
              className={`w-full px-3 py-2 border rounded-md text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                validationErrors.phone
                  ? 'border-red-500 dark:border-red-500'
                  : 'border-slate-300 dark:border-slate-600'
              }`}
            />
            {validationErrors.phone && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                {validationErrors.phone}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="text"
              value={value.email}
              onChange={(e) => updateConfig({ email: e.target.value })}
              className={`w-full px-3 py-2 border rounded-md text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                validationErrors.email
                  ? 'border-red-500 dark:border-red-500'
                  : 'border-slate-300 dark:border-slate-600'
              }`}
            />
            {validationErrors.email && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                {validationErrors.email}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="workingHours"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              Giờ làm việc
            </label>
            <input
              id="workingHours"
              type="text"
              value={value.workingHours}
              onChange={(e) => updateConfig({ workingHours: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </CardContent>
      </Card>

      {/* Card 3: Form Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Cài đặt form liên hệ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Toggle showForm */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Hiển thị form liên hệ
            </label>
            <div
              onClick={() => updateConfig({ showForm: !value.showForm })}
              className="relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer transition-colors"
              style={{
                backgroundColor: value.showForm ? '#3b82f6' : '#cbd5e1',
              }}
            >
              <span
                className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                style={{
                  transform: value.showForm ? 'translateX(1.5rem)' : 'translateX(0.25rem)',
                }}
              />
            </div>
          </div>

          {/* Conditional form fields */}
          {value.showForm && (
            <>
              <FormFieldsSelector
                selected={value.formFields}
                onChange={updateFormFields}
              />

              <div>
                <label
                  htmlFor="formTitle"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                >
                  Tiêu đề form
                </label>
                <input
                  id="formTitle"
                  type="text"
                  value={value.formTitle || ''}
                  onChange={(e) => updateConfig({ formTitle: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="formDescription"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                >
                  Mô tả form
                </label>
                <textarea
                  id="formDescription"
                  value={value.formDescription || ''}
                  onChange={(e) => updateConfig({ formDescription: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="submitButtonText"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                >
                  Text nút submit
                </label>
                <input
                  id="submitButtonText"
                  type="text"
                  value={value.submitButtonText || ''}
                  onChange={(e) => updateConfig({ submitButtonText: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="responseTimeText"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                >
                  Text thời gian phản hồi
                </label>
                <input
                  id="responseTimeText"
                  type="text"
                  value={value.responseTimeText || ''}
                  onChange={(e) => updateConfig({ responseTimeText: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Card 4: Social Links */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Social Links</CardTitle>
        </CardHeader>
        <CardContent>
          <SocialLinksManager
            links={value.socialLinks}
            onChange={updateSocialLinks}
            onValidationChange={handleSocialValidationChange}
          />
        </CardContent>
      </Card>

      {/* Card 5: Color Harmony */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Chế độ màu hài hòa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <label
            htmlFor="harmony"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Chế độ màu hài hòa
          </label>
          <select
            id="harmony"
            value={value.harmony || 'analogous'}
            onChange={(e) => updateConfig({ harmony: e.target.value as typeof value.harmony })}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {CONTACT_HARMONY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option === 'analogous' && 'Analogous (Màu tương tự)'}
                {option === 'complementary' && 'Complementary (Màu bổ sung)'}
                {option === 'triadic' && 'Triadic (Màu tam giác)'}
              </option>
            ))}
          </select>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Chọn cách phối màu phụ từ màu chủ đạo
          </p>
        </CardContent>
      </Card>

      {/* Card 6: Text Customization */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tùy chỉnh văn bản</CardTitle>
        </CardHeader>
        <CardContent>
          <DynamicTextFields
            style={value.style}
            texts={value.texts || {}}
            onChange={updateTexts}
          />
        </CardContent>
      </Card>
    </div>
  );
}
