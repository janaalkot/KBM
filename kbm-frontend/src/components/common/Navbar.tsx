import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Bell, Sparkles, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import logo from '../../assets/logo.png';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Lessons Learned', path: '/lessons' },
    { name: 'Processes', path: '/' },
    { name: 'Projects and Libraries', path: '/' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-colors duration-200 dark:border-slate-800/80 dark:bg-[#07101a]/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8 lg:gap-12">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Advansys" className="h-8 w-auto object-contain"/>
          </Link>

          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link key={link.name} to={link.path} className={`text-sm font-medium transition-all duration-150 relative py-1 ${isActive? 'text-sky-600 dark:text-sky-400 font-semibold': 'text-slate-600 hover:text-sky-600 dark:text-slate-300 dark:hover:text-sky-400'}`}>
                  {link.name}
                  {isActive && (<span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-sky-500" />)}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button type="button" title="Search" className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white">
            <Search className="h-4.5 w-4.5" />
          </button>

          <Link to="/chatbot"  title="AI Knowledge Assistant"  className="flex items-center gap-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 px-3.5 py-1.5 text-xs font-semibold text-sky-600 transition hover:bg-sky-500/20 dark:text-sky-400"  >
            <Sparkles className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">AI Copilot</span>
          </Link>

          <button type="button"  onClick={toggleTheme}  title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}  aria-label="Toggle theme"  className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"  >
            {theme === 'dark' ? (<Sun className="h-4.5 w-4.5 text-amber-400" /> ) : (<Moon className="h-4.5 w-4.5 text-slate-600" />  )}
          </button>

          <button  type="button"  title="Notifications"  className="relative rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"  >
            <Bell className="h-4.5 w-4.5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-[#07101a]" />
          </button>

          <div className="flex items-center pl-2 border-l border-slate-200 dark:border-slate-800">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-sky-600 to-sky-400 text-xs font-bold text-white shadow-sm">
              J
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};