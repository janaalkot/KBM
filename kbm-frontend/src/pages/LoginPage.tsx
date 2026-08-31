import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  AuthService,
  getErrorMessage,
} from '../services/api';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] = useState('');

  const from =
    (location.state as { from?: string } | null)
      ?.from || '/lessons';

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setIsSubmitting(true);
    setError('');

    try {
      const response =
        await AuthService.login(
          email,
          password
        );

      localStorage.setItem(
        'kbm_token',
        response.token
      );

      navigate(from, { replace: true });
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4">
      <div className="w-full rounded-2xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-[#0b1623]">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Sign in
        </h1>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Sign in to create and manage lessons.
        </p>

        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-5"
        >
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Email
            </label>

            <input
              type="email"
              required
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-[#07101a] dark:text-white"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Password
            </label>

            <input
              type="password"
              required
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-[#07101a] dark:text-white"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-sky-600 py-2.5 text-sm font-semibold text-white hover:bg-sky-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
};