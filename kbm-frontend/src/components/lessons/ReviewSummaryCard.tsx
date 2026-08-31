import React from 'react';

interface ReviewSummaryProps {
  title: string;
  projectName: string;
  industry: string;
  description: string;
}

export const ReviewSummaryCard: React.FC<
  ReviewSummaryProps
> = ({
  title,
  projectName,
  industry,
  description,
}) => {
  return (
    <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800/80 dark:bg-[#0b1623]">
      <h3 className="border-b border-slate-100 pb-3 text-xs font-bold uppercase tracking-wider text-slate-900 dark:border-slate-800 dark:text-white">
        Review Summary
      </h3>

      <div className="mt-5 space-y-4 text-xs">
        <SummaryRow
          label="Lesson Title"
          value={title}
        />

        <SummaryRow
          label="Project Name"
          value={projectName}
        />

        <SummaryRow
          label="Industry"
          value={industry}
        />

        <div className="border-t border-slate-100 pt-4 dark:border-slate-800">
          <span className="font-semibold uppercase tracking-wider text-slate-500">
            Description
          </span>

          <p className="mt-2 line-clamp-6 leading-relaxed text-slate-700 dark:text-slate-300">
            {description || 'Not provided'}
          </p>
        </div>
      </div>
    </div>
  );
};

interface SummaryRowProps {
  label: string;
  value: string;
}

const SummaryRow: React.FC<SummaryRowProps> = ({
  label,
  value,
}) => (
  <div className="flex items-start justify-between gap-4">
    <span className="text-slate-400">{label}</span>

    <span className="max-w-[180px] truncate text-right font-medium text-slate-900 dark:text-slate-200">
      {value || 'Not provided'}
    </span>
  </div>
);