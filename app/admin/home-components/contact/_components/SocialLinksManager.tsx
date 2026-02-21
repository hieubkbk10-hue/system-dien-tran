'use client';

import React, { useEffect, useState } from 'react';
import type { ContactSocialLink } from '../_types';
import { isValidUrl } from '../_lib/validation';

interface SocialLinksManagerProps {
  links: ContactSocialLink[];
  onChange: (links: ContactSocialLink[]) => void;
  onValidationChange?: (errors: Record<number, { url?: string }>) => void;
}

export function SocialLinksManager({ 
  links, 
  onChange, 
  onValidationChange 
}: SocialLinksManagerProps) {
  const [validationErrors, setValidationErrors] = useState<Record<number, { url?: string }>>({});

  // Validate URLs và emit errors lên parent
  useEffect(() => {
    const errors: Record<number, { url?: string }> = {};
    
    links.forEach((link) => {
      if (link.url && !isValidUrl(link.url)) {
        errors[link.id] = { url: 'URL không hợp lệ' };
      }
    });

    setValidationErrors(errors);
    
    if (onValidationChange) {
      onValidationChange(errors);
    }
  }, [links, onValidationChange]);

  const handleAddLink = () => {
    // Generate unique ID: Math.max(...ids, 0) + 1
    const maxId = links.length > 0 ? Math.max(...links.map(l => l.id), 0) : 0;
    const newId = maxId + 1;

    const newLink: ContactSocialLink = {
      id: newId,
      platform: '',
      url: '',
    };

    // Không mutate array, tạo array mới
    onChange([...links, newLink]);
  };

  const handleDeleteLink = (id: number) => {
    // Không mutate array, tạo array mới
    onChange(links.filter(link => link.id !== id));
  };

  const handleUpdateLink = (id: number, field: 'platform' | 'url', value: string) => {
    // Không mutate array, tạo array mới
    onChange(
      links.map(link => 
        link.id === id 
          ? { ...link, [field]: value }
          : link
      )
    );
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
        Social Links
      </label>

      <div className="space-y-3">
        {links.map((link) => {
          const hasError = validationErrors[link.id]?.url;

          return (
            <div key={link.id} className="flex gap-2 items-start">
              <div className="flex-1">
                <input
                  type="text"
                  value={link.platform}
                  onChange={(e) => handleUpdateLink(link.id, 'platform', e.target.value)}
                  placeholder="Platform (vd: Facebook, Twitter)"
                  className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex-1">
                <input
                  type="text"
                  value={link.url}
                  onChange={(e) => handleUpdateLink(link.id, 'url', e.target.value)}
                  placeholder="URL (https://...)"
                  className={`w-full px-3 py-2 text-sm border rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    hasError 
                      ? 'border-red-500 dark:border-red-500' 
                      : 'border-slate-300 dark:border-slate-600'
                  }`}
                />
                {hasError && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    {validationErrors[link.id].url}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleDeleteLink(link.id)}
                className="px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
              >
                Xóa
              </button>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={handleAddLink}
        className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
      >
        + Thêm link
      </button>

      {links.length === 0 && (
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Chưa có social link nào. Nhấn "Thêm link" để bắt đầu.
        </p>
      )}
    </div>
  );
}
