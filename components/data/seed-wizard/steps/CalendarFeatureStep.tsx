'use client';

import React from 'react';
import { Checkbox } from '@/app/admin/components/ui';

type CalendarFeatureKey =
  | 'enableMonthView'
  | 'enableListView'
  | 'enableRecurring'
  | 'enableAssignee'
  | 'enableReminder'
  | 'enablePriority';

type CalendarFeatureItem = {
  key: CalendarFeatureKey;
  label: string;
  description: string;
};

const CALENDAR_FEATURES: CalendarFeatureItem[] = [
  {
    key: 'enableMonthView',
    label: 'Month View',
    description: 'Hiển thị lịch dạng tháng, tuần, ngày, năm.',
  },
  {
    key: 'enableListView',
    label: 'List View',
    description: 'Danh sách task theo hạn xử lý và trạng thái.',
  },
  {
    key: 'enableRecurring',
    label: 'Lịch lặp (RRULE)',
    description: 'Tạo lịch lặp theo chuẩn RRULE.',
  },
  {
    key: 'enableAssignee',
    label: 'Phân công',
    description: 'Gán người phụ trách cho task.',
  },
  {
    key: 'enableReminder',
    label: 'Nhắc việc',
    description: 'Nhắc việc trước hạn theo cấu hình.',
  },
  {
    key: 'enablePriority',
    label: 'Ưu tiên',
    description: 'Bật mức ưu tiên cho task.',
  },
];

type CalendarFeatureStepProps = {
  value: Record<CalendarFeatureKey, boolean>;
  onChange: (key: CalendarFeatureKey, enabled: boolean) => void;
};

export function CalendarFeatureStep({ value, onChange }: CalendarFeatureStepProps) {
  const hasVisibleView = value.enableMonthView || value.enableListView;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Cấu hình Calendar</h3>
        <p className="text-xs text-slate-500">Bật/tắt các tính năng chính của Calendar nội bộ.</p>
      </div>

      {!hasVisibleView && (
        <div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20 p-3 text-xs text-amber-700 dark:text-amber-300">
          Nên bật ít nhất Month View hoặc List View để có giao diện hiển thị.
        </div>
      )}

      <div className="space-y-3">
        {CALENDAR_FEATURES.map((feature) => (
          <label
            key={feature.key}
            className="flex items-start gap-3 rounded-lg border border-slate-200 dark:border-slate-800 p-3 cursor-pointer"
          >
            <Checkbox
              checked={value[feature.key]}
              onCheckedChange={(checked) => onChange(feature.key, checked === true)}
            />
            <div className="flex-1">
              <div className="text-sm font-medium text-slate-900 dark:text-slate-100">{feature.label}</div>
              <p className="text-xs text-slate-500 mt-1">{feature.description}</p>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
