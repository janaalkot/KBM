import React from 'react';
import { Search, Grid, ListFilter } from 'lucide-react';

import type { Department } from '../../types';

interface LessonFiltersProps {
  search: string;
  departmentId: string;
  keyword: string;
  departments: Department[];
  isGrouped: boolean;
  onSearchChange: (value: string) => void;
  onDepartmentChange: (value: string) => void;
  onKeywordChange: (value: string) => void;
  onToggleGrouping: () => void;
}

export const LessonFilters: React.FC<LessonFiltersProps> = ({
  search,
  departmentId,
  keyword,
  departments,
  isGrouped,
  onSearchChange,
  onDepartmentChange,
  onKeywordChange,
  onToggleGrouping,
}) => {
  return (
    <div className="space-y-4">

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-[#0b1623] sm:flex-row sm:items-center">

        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            placeholder="Search for a lesson, keyword, or problem..."
            value={search}
            onChange={(e) =>
              onSearchChange(e.target.value)
            }
            aria-label="Search lessons"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700/80 dark:bg-[#07101a] dark:text-white dark:placeholder-slate-500"
          />
        </div>

        <select
          value={departmentId}
          onChange={(e) =>
            onDepartmentChange(e.target.value)
          }
          aria-label="Filter by department"
          className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-700 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700/80 dark:bg-[#07101a] dark:text-slate-300"
        >
          <option value="">
            All Departments
          </option>

          {departments.map((dept) => (
            <option
              key={dept.id}
              value={dept.id}
            >
              {dept.name}
            </option>
          ))}
        </select>

        {/* Keyword Filter */}
        <select
          value={keyword}
          onChange={(e) =>
            onKeywordChange(e.target.value)
          }
          aria-label="Filter by keyword"
          className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-700 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700/80 dark:bg-[#07101a] dark:text-slate-300"
        >
          <option value="">
            Keywords
          </option>

          <option value="PLC">
            PLC
          </option>

          <option value="Automation">
            Automation
          </option>

          <option value="Electrical">
            Electrical
          </option>

          <option value="Wiring">
            Wiring
          </option>

          <option value="HMI">
            HMI
          </option>

          <option value="UI/UX">
            UI/UX
          </option>

          <option value="Testing">
            Testing
          </option>

          <option value="Validation">
            Validation
          </option>
        </select>
      </div>

      <div className="flex justify-end">

        <button
          type="button"
          onClick={onToggleGrouping}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-[#0b1623] dark:text-slate-300 dark:hover:bg-[#0f1d2e]"
        >
          {isGrouped ? (
            <>
              <ListFilter className="h-3.5 w-3.5 text-sky-500" />
              Ungroup lessons
            </>
          ) : (
            <>
              <Grid className="h-3.5 w-3.5 text-sky-500" />
              Group by Department
            </>
          )}
        </button>

      </div>
    </div>
  );
};