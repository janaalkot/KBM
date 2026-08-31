import React from 'react';
import { ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

import type { Lesson } from '../../types';

interface LessonCardProps {
  lesson: Lesson;
}

export const LessonCard: React.FC<LessonCardProps> = ({
  lesson,
}) => {
  return (
    <article className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-sky-500/40 hover:shadow-lg dark:border-slate-800/80 dark:bg-[#0b1623]">
      <div className="p-5">
        <div className="mb-4 flex h-32 items-center justify-center rounded-xl border border-slate-200 bg-gradient-to-b from-sky-500/10 to-transparent dark:border-slate-800 dark:bg-[#060e18]">
          <BookOpen className="h-10 w-10 text-sky-500/70 transition-transform group-hover:scale-110" />
        </div>

        <div className="mb-3 flex flex-wrap gap-2">
          <span className="rounded-md border border-sky-500/30 bg-sky-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400">
            {lesson.departmentName}
          </span>

          <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold text-slate-500 dark:border-slate-800 dark:bg-[#07101a] dark:text-slate-400">
            {lesson.industryName}
          </span>
        </div>

        <h3 className="line-clamp-2 text-base font-bold text-slate-900 group-hover:text-sky-600 dark:text-white dark:group-hover:text-sky-400">
          {lesson.title}
        </h3>

        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          {lesson.valueProposition}
        </p>

        <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800">
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            Project
          </p>

          <p className="truncate text-xs font-semibold text-slate-700 dark:text-slate-300">
            {lesson.projectName}
          </p>
        </div>
      </div>

      <div className="p-5 pt-0">
        <Link
          to={`/lessons/${lesson.id}`}
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-semibold text-slate-700 transition hover:border-sky-500 hover:bg-sky-600 hover:text-white dark:border-slate-800 dark:bg-[#07101a] dark:text-slate-300"
        >
          Open Lesson
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  );
};