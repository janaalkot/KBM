import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';

import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { LessonFilters } from '../components/lessons/LessonFilters';
import { LessonCard } from '../components/lessons/LessonCard';

import type { Lesson, Department } from '../types';
import { LessonService } from '../services/api';

const TARGET_DEPARTMENTS: Department[] = [
  { id: '1', name: 'Automation' },
  { id: '2', name: 'Electrical' },
  { id: '3', name: 'HMI Design' },
  { id: '4', name: 'Software Engineering' },
  { id: '5', name: 'Quality Assurance' },
];

const ITEMS_PER_PAGE = 6;

export const LessonsPage: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [departments, setDepartments] =
    useState<Department[]>(TARGET_DEPARTMENTS);

  const [search, setSearch] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [keyword, setKeyword] = useState('');

  const [isGrouped, setIsGrouped] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');


  useEffect(() => {
    loadDepartments();
    fetchLessons();
  }, []);


  useEffect(() => {
    setCurrentPage(1);
  }, [search, departmentId, keyword]);

  const loadDepartments = async () => {
    try {
      const data = await LessonService.getDepartments();

      if (data.length > 0) {
        setDepartments(data);
      }
    } catch (error) {
      console.error('Failed to load departments:', error);

      // Keep the default departments if the API fails.
      setDepartments(TARGET_DEPARTMENTS);
    }
  };

  const fetchLessons = async () => {
    setIsLoading(true);
    setError('');

    try {
      const data = await LessonService.getLessons();

      setLessons(data);
    } catch (error) {
      console.error('Failed to fetch lessons:', error);

      setLessons([]);
      setError('Failed to load lessons.');
    } finally {
      setIsLoading(false);
    }
  };


  const filteredLessons = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const normalizedKeyword = keyword.trim().toLowerCase();

    return lessons.filter((lesson) => {
      const searchableText = [
        lesson.title,
        lesson.projectName,
        lesson.description,
        lesson.valueProposition,
        lesson.personToContact ?? '',
      ]
        .join(' ')
        .toLowerCase();

      const matchesSearch =
        !normalizedSearch ||
        searchableText.includes(normalizedSearch);

      const matchesDepartment =
        !departmentId ||
        lesson.departmentId === departmentId;

      const matchesKeyword =
        !normalizedKeyword ||
        searchableText.includes(normalizedKeyword);

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesKeyword
      );
    });
  }, [
    lessons,
    search,
    departmentId,
    keyword,
  ]);


  const totalPages = Math.ceil(
    filteredLessons.length / ITEMS_PER_PAGE
  );

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const startIndex =
    (currentPage - 1) * ITEMS_PER_PAGE;

  const paginatedLessons = filteredLessons.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );


  const groupedLessons = useMemo(() => {
    return departments.reduce(
      (acc, department) => {
        const matchedLessons = filteredLessons.filter(
          (lesson) =>
            lesson.departmentId === department.id
        );

        if (matchedLessons.length > 0) {
          acc[department.name] = matchedLessons;
        }

        return acc;
      },
      {} as Record<string, Lesson[]>
    );
  }, [departments, filteredLessons]);

  const hasGroupedLessons =
    Object.keys(groupedLessons).length > 0;

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  const goToPreviousPage = () => {
    setCurrentPage((page) =>
      Math.max(page - 1, 1)
    );
  };

  const goToNextPage = () => {
    setCurrentPage((page) =>
      Math.min(page + 1, totalPages)
    );
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

      <Breadcrumbs
        items={[{ label: 'Lessons Learned' }]}
      />

      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-5 border-b border-slate-200/60 pb-6 dark:border-slate-800/60 md:flex-row md:items-end">

        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Lessons Learned
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            A dedicated space for engineers to reflect,
            share, and grow documenting key takeaways,
           and verified solutions.
          </p>
        </div>

        <Link
          to="/lessons/create"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-sky-500"
        >
          <Plus className="h-4 w-4" />
          Create Lesson
        </Link>
      </div>

      <LessonFilters
        search={search}
        departmentId={departmentId}
        keyword={keyword}
        departments={departments}
        isGrouped={isGrouped}
        onSearchChange={setSearch}
        onDepartmentChange={setDepartmentId}
        onKeywordChange={setKeyword}
        onToggleGrouping={() =>
          setIsGrouped((prev) => !prev)
        }
      />

      <div className="mt-8">

        {isLoading ? (

          <div className="flex h-64 items-center justify-center text-sm font-medium text-slate-500">
            Loading lessons...
          </div>

        ) : error ? (

          <div className="flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 py-16 text-center dark:border-red-900/40 dark:bg-red-950/20">

            <h3 className="text-lg font-bold text-red-700 dark:text-red-400">
              {error}
            </h3>

            <button
              onClick={fetchLessons}
              className="mt-4 rounded-xl bg-sky-600 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-500"
            >
              Try Again
            </button>

          </div>

        ) : filteredLessons.length === 0 ? (

          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/50 py-16 text-center dark:border-slate-800 dark:bg-[#0b1623]/50">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800/80 dark:text-slate-500">
              <BookOpen className="h-7 w-7" />
            </div>

            <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
              No Lessons Found
            </h3>

            <p className="mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">
              There are no lessons matching your
              current search or filter criteria.
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

          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {paginatedLessons.map((lesson) => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                />
              ))}

            </div>

            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">

                <button
                  type="button"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:bg-[#0b1623] dark:text-slate-400 dark:hover:bg-[#0f1d2e]"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                {pageNumbers.map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => goToPage(page)}
                    aria-label={`Go to page ${page}`}
                    aria-current={
                      currentPage === page
                        ? 'page'
                        : undefined
                    }
                    className={`inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-3 text-sm font-semibold transition ${
                      currentPage === page
                        ? 'bg-sky-600 text-white shadow-sm'
                        : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-[#0b1623] dark:text-slate-400 dark:hover:bg-[#0f1d2e]'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:bg-[#0b1623] dark:text-slate-400 dark:hover:bg-[#0f1d2e]"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>

              </div>
            )}

            {filteredLessons.length > 0 && (
              <p className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">
                Showing{' '}
                {startIndex + 1}
                {'–'}
                {Math.min(
                  startIndex + ITEMS_PER_PAGE,
                  filteredLessons.length
                )}{' '}
                of {filteredLessons.length} lessons
              </p>
            )}
          </>

        ) : (

          <div className="space-y-10">

            {hasGroupedLessons ? (
              Object.entries(groupedLessons).map(
                ([departmentName, departmentLessons]) => (

                  <div
                    key={departmentName}
                    className="space-y-4"
                  >

                    <div className="flex items-center gap-3">

                      <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                        {departmentName}
                      </h2>

                      <span className="rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-400">
                        {departmentLessons.length}{' '}
                        {departmentLessons.length === 1
                          ? 'lesson'
                          : 'lessons'}
                      </span>

                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

                      {departmentLessons.map(
                        (lesson) => (
                          <LessonCard
                            key={lesson.id}
                            lesson={lesson}
                          />
                        )
                      )}

                    </div>

                  </div>
                )
              )
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/50 py-16 text-center dark:border-slate-800 dark:bg-[#0b1623]/50">

                <BookOpen className="h-7 w-7 text-slate-400" />

                <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
                  No Lessons Found
                </h3>

                <p className="mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">
                  No lessons match the selected filters.
                </p>

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};