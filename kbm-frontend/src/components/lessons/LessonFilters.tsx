import React from 'react';
import { Grid, ListFilter, Search } from 'lucide-react';

import type { Department } from '../../types';

interface LessonFiltersProps {
  search: string;
  departmentId: string;
  departments: Department[];
  isGrouped: boolean;

  onSearchChange: (value: string) => void;
  onDepartmentChange: (value: string) => void;
  onToggleGrouping: () => void;
}

export const LessonFilters: React.FC<
  LessonFiltersProps
> = ({
  search,
  departmentId,
  departments,
  isGrouped,
  onSearchChange,
  onDepartmentChange,
  onToggleGrouping,
}) => {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-[#0b1623] sm:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

        <input
          type="text"
          value={search}
          onChange={(event) =>
            onSearchChange(event.target.value)
          }
          placeholder="Search lessons..."
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-[#07101a] dark:text-white"
        />
      </div>

      <select
        value={departmentId}
        onChange={(event) =>
          onDepartmentChange(event.target.value)
        }
        className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm dark:border-slate-700 dark:bg-[#07101a] dark:text-slate-300"
      >
        <option value="">All Departments</option>

        {departments.map((department) => (
          <option
            key={department.id}
            value={department.id}
          >
            {department.name}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={onToggleGrouping}
        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-[#0b1623] dark:text-slate-300"
      >
        {isGrouped ? (
          <>
            <ListFilter className="h-3.5 w-3.5 text-sky-500" />
            Ungroup
          </>
        ) : (
          <>
            <Grid className="h-3.5 w-3.5 text-sky-500" />
            Group by Department
          </>
        )}
      </button>
    </div>
  );
};