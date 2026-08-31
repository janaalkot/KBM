import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Plus } from 'lucide-react';

import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { LessonFilters } from '../components/lessons/LessonFilters';
import { LessonCard } from '../components/lessons/LessonCard';

import type { Department, Lesson } from '../types';
import {
  LessonService,
  getErrorMessage,
} from '../services/api';

export const LessonsPage: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [departments, setDepartments] =
    useState<Department[]>([]);

  const [search, setSearch] = useState('');
  const [departmentId, setDepartmentId] =
    useState('');

  const [isGrouped, setIsGrouped] =
    useState(false);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] = useState('');

  const loadData = async () => {
    setIsLoading(true);
    setError('');

    try {
      const [lessonsData, departmentsData] =
        await Promise.all([
          LessonService.getLessons(),
          LessonService.getDepartments(),
        ]);

      setLessons(lessonsData);
      setDepartments(departmentsData);
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredLessons = useMemo(() => {
    const query = search.trim().toLowerCase();

    return lessons.filter((lesson) => {
      const matchesDepartment =
        !departmentId ||
        lesson.departmentId === departmentId;

      if (!matchesDepartment) {
        return false;
      }

      if (!query) {
        return true;
      }

      return [
        lesson.title,
        lesson.projectName,
        lesson.departmentName,
        lesson.functionName,
        lesson.industryName,
        lesson.valueProposition,
        lesson.description,
      ].some((value) =>
        value.toLowerCase().includes(query)
      );
    });
  }, [lessons, search, departmentId]);

  const groupedLessons = useMemo(() => {
    return filteredLessons.reduce(
      (groups, lesson) => {
        const name =
          lesson.departmentName || 'Other';

        if (!groups[name]) {
          groups[name] = [];
        }

        groups[name].push(lesson);

        return groups;
      },
      {} as Record<string, Lesson[]>
    );
  }, [filteredLessons]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[{ label: 'Lessons Learned' }]}
      />

      <div className="mb-8 flex flex-col justify-between gap-5 border-b border-slate-200/60 pb-6 dark:border-slate-800/60 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Lessons Learned
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            Documented engineering experiences,
            technical challenges, and verified solutions.
          </p>
        </div>

        <Link
          to="/lessons/create"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-sky-500"
        >
          <Plus className="h-4 w-4" />
          Create Lesson
        </Link>
      </div>

      <LessonFilters
        search={search}
        departmentId={departmentId}
        departments={departments}
        onSearchChange={setSearch}
        onDepartmentChange={setDepartmentId}
        isGrouped={isGrouped}
        onToggleGrouping={() =>
          setIsGrouped((current) => !current)
        }
      />

      <div className="mt-8">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center text-sm text-slate-500">
            Loading lessons...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900/40 dark:bg-red-950/20">
            <p className="text-sm font-semibold text-red-700 dark:text-red-400">
              {error}
            </p>

            <button
              onClick={loadData}
              className="mt-4 rounded-xl bg-sky-600 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-500"
            >
              Try Again
            </button>
          </div>
        ) : filteredLessons.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/50 py-16 text-center dark:border-slate-800 dark:bg-[#0b1623]/50">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800/80">
              <BookOpen className="h-7 w-7" />
            </div>

            <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
              No Lessons Found
            </h3>

            <p className="mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">
              Try changing your search or create the first lesson.
            </p>

            <Link
              to="/lessons/create"
              className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-sky-600 px-4 py-2 text-xs font-semibold text-white"
            >
              <Plus className="h-3.5 w-3.5" />
              Create Lesson
            </Link>
          </div>
        ) : !isGrouped ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredLessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-10">
            {Object.entries(groupedLessons).map(
              ([departmentName, departmentLessons]) => (
                <section
                  key={departmentName}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      {departmentName}
                    </h2>

                    <span className="rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-400">
                      {departmentLessons.length}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {departmentLessons.map((lesson) => (
                      <LessonCard
                        key={lesson.id}
                        lesson={lesson}
                      />
                    ))}
                  </div>
                </section>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};