'use client';

import React from 'react';

interface FormFieldsSelectorProps {
  selected: string[];
  onChange: (fields: string[]) => void;
}

const FIELD_OPTIONS = [
  { value: 'name', label: 'Tên' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Số điện thoại' },
  { value: 'subject', label: 'Chủ đề' },
  { value: 'message', label: 'Tin nhắn' },
];

export function FormFieldsSelector({ selected, onChange }: FormFieldsSelectorProps) {
  const handleToggle = (fieldValue: string) => {
    const isSelected = selected.includes(fieldValue);
    
    if (isSelected) {
      // Deselect: remove from array
      const updated = selected.filter(f => f !== fieldValue);
      onChange(updated);
    } else {
      // Select: add to array
      const updated = [...selected, fieldValue];
      onChange(updated);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
        Các trường trong form
      </label>
      <div className="space-y-2">
        {FIELD_OPTIONS.map((option) => {
          const isSelected = selected.includes(option.value);
          const isDisabled = isSelected && selected.length === 1;

          return (
            <label
              key={option.value}
              className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={isSelected}
                disabled={isDisabled}
                onChange={() => handleToggle(option.value)}
                className="w-4 h-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <span className={isDisabled ? 'opacity-50' : ''}>
                {option.label}
              </span>
            </label>
          );
        })}
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Phải chọn ít nhất 1 trường
      </p>
    </div>
  );
}
