import React from 'react';

export const ColorInfoPanel = ({
  brandColor,
  secondary,
  description = 'Màu phụ được áp dụng cho: nav buttons, borders, badges, accents.',
}: {
  brandColor: string;
  secondary: string;
  description?: string;
}) => {
  if (!secondary) {return null;}

  return (
    <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-500 dark:text-slate-400">Màu chính:</span>
          <div
            className="w-8 h-8 rounded border-2 border-slate-300 dark:border-slate-600 shadow-sm"
            style={{ backgroundColor: brandColor }}
            title={brandColor}
          />
          <span className="font-mono text-slate-600 dark:text-slate-400">{brandColor}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-500 dark:text-slate-400">Màu phụ:</span>
          <div
            className="w-8 h-8 rounded border-2 border-slate-300 dark:border-slate-600 shadow-sm"
            style={{ backgroundColor: secondary }}
            title={secondary}
          />
          <span className="font-mono text-slate-600 dark:text-slate-400">{secondary}</span>
        </div>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
        {description}
      </p>
    </div>
  );
};
