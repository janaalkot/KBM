import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-xs text-slate-500 transition-colors dark:border-slate-800 dark:bg-[#060e18] dark:text-slate-400">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="Advansys"
            className="h-5 w-auto object-contain opacity-90"
          />
          <span>© 2026 Advansys Intelligent Solutions. All rights reserved.</span>
        </div>
        <div className="flex gap-6">
          <Link to="/privacy" className="hover:text-sky-600 dark:hover:text-slate-200">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-sky-600 dark:hover:text-slate-200">Terms of Service</Link>
          <Link to="/support" className="hover:text-sky-600 dark:hover:text-slate-200">Support</Link>
        </div>
      </div>
    </footer>
  );
};