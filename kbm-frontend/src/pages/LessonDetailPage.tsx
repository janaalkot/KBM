import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  CalendarDays,
  UserRound,
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

import { Breadcrumbs } from '../components/common/Breadcrumbs';
import type { Lesson } from '../types';
import {
  LessonService,
  getErrorMessage,
} from '../services/api';

export const LessonDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [lesson, setLesson] =
    useState<Lesson | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) {
      setError('Lesson ID is missing.');
      setIsLoading(false);
      return;
    }

    const loadLesson = async () => {
      setIsLoading(true);
      setError('');

      try {
        const data =
          await LessonService.getLessonById(id);

        setLesson(data);
      } catch (error) {
        setError(getErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    };

    loadLesson();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center text-sm font-medium text-slate-500">
        Loading lesson...
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 dark:border-red-900/40 dark:bg-red-950/20">
          <h2 className="text-lg font-bold text-red-700 dark:text-red-400">
            Unable to load lesson
          </h2>

          <p className="mt-2 text-sm text-red-600 dark:text-red-400">
            {error || 'Lesson was not found.'}
          </p>

          <Link
            to="/lessons"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-sky-500"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Lessons
          </Link>
        </div>
      </div>
    );
  }

  const createdDate = new Date(
    lesson.createdDate
  ).toLocaleDateString();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[{ label: 'Lesson Details' }]}
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <main className="space-y-6 lg:col-span-2">
          <div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-md border border-sky-500/30 bg-sky-500/10 px-2.5 py-1 text-xs font-semibold text-sky-700 dark:text-sky-400">
                {lesson.departmentName}
              </span>

              <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-slate-800 dark:bg-[#0b1623] dark:text-slate-400">
                {lesson.industryName}
              </span>
            </div>

            <h1 className="mt-4 text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">
              {lesson.title}
            </h1>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Project: {lesson.projectName}
            </p>
          </div>

          <div className="flex flex-wrap gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-[#0b1623]">
            <MetaItem
              icon={UserRound}
              label="Function"
              value={lesson.functionName}
            />

            <MetaItem
              icon={CalendarDays}
              label="Created"
              value={createdDate}
            />
          </div>

          <section className="rounded-2xl border border-sky-500/30 bg-sky-500/5 p-6 dark:bg-sky-950/20">
            <h2 className="text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400">
              Value Proposition
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {lesson.valueProposition}
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800/80 dark:bg-[#0b1623]">
            <h2 className="border-b border-slate-100 pb-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:text-slate-400">
              Description
            </h2>

            <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {lesson.description}
            </p>
          </section>

          {lesson.personToContact && (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800/80 dark:bg-[#0b1623]">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Person to Contact
              </h2>

              <p className="mt-2 text-sm font-medium text-slate-800 dark:text-slate-200">
                {lesson.personToContact}
              </p>
            </section>
          )}

          {lesson.imageUrl && (
            <img
              src={lesson.imageUrl}
              alt={lesson.title}
              className="max-h-[500px] w-full rounded-2xl border border-slate-200 object-cover dark:border-slate-800"
            />
          )}

          <Link
            to="/lessons"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-[#0b1623] dark:text-slate-300"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Lessons
          </Link>
        </main>

        <aside>
          <div className="rounded-2xl border border-sky-500/20 bg-gradient-to-b from-sky-50 to-white p-6 text-center shadow-sm dark:from-[#0c1c2e] dark:to-[#08121d]">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Have a similar lesson?
            </h3>

            <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              Share another engineering experience with the team.
            </p>

            <Link
              to="/lessons/create"
              className="mt-5 inline-flex w-full justify-center rounded-xl bg-sky-600 py-2.5 text-xs font-semibold text-white hover:bg-sky-500"
            >
              Create Lesson
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
};

interface MetaItemProps {
  icon: React.ElementType;
  label: string;
  value: string;
}

const MetaItem: React.FC<MetaItemProps> = ({
  icon: Icon,
  label,
  value,
}) => (
  <div className="flex items-center gap-3">
    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
      <Icon className="h-4 w-4" />
    </div>

    <div>
      <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
        {value}
      </p>
    </div>
  </div>
);