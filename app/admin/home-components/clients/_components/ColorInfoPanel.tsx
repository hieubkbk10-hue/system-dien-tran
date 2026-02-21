'use client';

import React from 'react';
import { Info } from 'lucide-react';
import type { ClientsBrandMode } from '../_types';

interface ColorInfoPanelProps {
  brandColor: string;
  secondary: string;
  mode: ClientsBrandMode;
}

export function ColorInfoPanel({ brandColor, secondary, mode }: ColorInfoPanelProps) {
  if (mode !== 'dual') {
    return null;
  }

  return (
    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-start gap-3">
        <Info size={18} className="text-blue-600 mt-0.5 shrink-0" />
        <div className="space-y-2 text-sm">
          <p className="font-semibold text-blue-900">Phân bổ màu Dual Brand</p>
          <div className="space-y-1 text-blue-800">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border border-blue-300" style={{ backgroundColor: brandColor }} />
              <span><strong>Màu chính:</strong> Heading, section accent, placeholder icon</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border border-blue-300" style={{ backgroundColor: secondary }} />
              <span><strong>Màu phụ:</strong> Badges, nav buttons, card hover, count labels</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
