'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import LoginModal from './LoginModal';
import LanguageSwitcher from './LanguageSwitcher';
import MakanLogo from './MakanLogo';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { theme, toggleTheme, mounted } = useTheme();
  const { t } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setUserDropdownOpen(false);
    await logout();
  };

  return (
    <>
      <nav className="w-full bg-white dark:bg-[#1e293b] border-b border-gray-100 dark:border-slate-800 sticky top-0 z-40 transition-colors duration-200">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo & Navigation Links */}
            <div className="flex items-center space-x-10">
              {/* Logo */}
              <Link href="/" className="flex items-center group py-1" aria-label="MAKAN Home">
                <MakanLogo className="h-8 sm:h-9 w-auto" />
              </Link>

              {/* Desktop Navigation Links */}
              <div className="hidden md:flex items-center space-x-7 text-[14px] text-gray-800 dark:text-gray-200 font-normal">
                <Link href="/for-sale" className="hover:text-[#E53935] dark:hover:text-[#E53935] transition-colors">
                  {t('forSale')}
                </Link>
                <Link href="/for-rent" className="hover:text-[#E53935] dark:hover:text-[#E53935] transition-colors">
                  {t('forRent')}
                </Link>
                <Link href="/daily-rental" className="hover:text-[#E53935] dark:hover:text-[#E53935] transition-colors">
                  {t('dailyRental')}
                </Link>
                <Link href="/projects" className="hover:text-[#E53935] dark:hover:text-[#E53935] transition-colors">
                  {t('projects')}
                </Link>
              </div>
            </div>

            {/* Right Controls: Language Switcher, Theme Toggle, Advertise button & User Profile */}
            <div className="hidden md:flex items-center space-x-3.5">
              
              {/* Language Switcher Dropdown */}
              <LanguageSwitcher />

              {/* Theme Toggle Button (Light/Dark) */}
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2 rounded-full text-gray-600 dark:text-amber-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Toggle dark mode"
                title={mounted && theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {mounted && theme === 'dark' ? (
                  // Sun Icon for Dark Mode
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  // Moon Icon for Light Mode
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>

              {/* Advertise Button */}
              <Link
                href="/advertise"
                className="bg-[#E53935] hover:bg-[#d32f2f] text-white text-sm font-medium px-5 py-2 rounded-[4px] transition-colors shadow-xs"
              >
                {t('advertise')}
              </Link>

              {/* User Profile Avatar / Dropdown */}
              <div className="relative" ref={dropdownRef}>
                {isAuthenticated && user ? (
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-2 p-1 rounded-full hover:ring-2 hover:ring-blue-400 focus:outline-none transition-all cursor-pointer"
                    aria-label="User menu"
                  >
                    <img
                      src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                      alt={user.name || 'User'}
                      className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-slate-700"
                    />
                  </button>
                ) : (
                  <button 
                    type="button"
                    onClick={() => setLoginModalOpen(true)}
                    className="text-gray-900 dark:text-gray-200 hover:text-black dark:hover:text-white p-1 rounded-full focus:outline-none transition-colors cursor-pointer"
                    aria-label="User profile and login"
                  >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M5.121 17.804A7.5 7.5 0 0112 15c2.486 0 4.735 1.21 6.121 2.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm7 2a10 10 0 11-20 0 10 10 0 0120 0z" />
                    </svg>
                  </button>
                )}

                {/* Dropdown Menu */}
                {userDropdownOpen && isAuthenticated && user && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#1e293b] rounded-[4px] shadow-xl border border-gray-100 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-slate-800">
                      <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{user.name}</p>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded capitalize">
                        {user.membershipType || user.role}
                      </span>
                    </div>

                    {/* 1. Dashboard Button */}
                    <Link
                      href="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="w-full text-left px-4 py-2.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors flex items-center space-x-2.5"
                    >
                      <svg className="w-4 h-4 text-[#E53935]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                      <span className="font-bold text-gray-800 dark:text-gray-200">Tableau de Bord</span>
                    </Link>

                    {/* 2. Separate Profile Button */}
                    <Link
                      href="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="w-full text-left px-4 py-2.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors flex items-center space-x-2.5 border-t border-gray-50 dark:border-slate-800/60"
                    >
                      <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="font-semibold text-gray-800 dark:text-gray-200">Mon Profil</span>
                    </Link>

                    {/* 3. Sign Out Button */}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors flex items-center space-x-2.5 cursor-pointer border-t border-gray-100 dark:border-slate-800"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Controls */}
            <div className="flex md:hidden items-center space-x-2">
              <LanguageSwitcher />

              <button
                type="button"
                onClick={toggleTheme}
                className="p-1.5 rounded-full text-gray-600 dark:text-amber-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle dark mode"
              >
                {mounted && theme === 'dark' ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>

              {isAuthenticated && user ? (
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-1"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                    alt={user.name || 'User'}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setLoginModalOpen(true)}
                  className="text-gray-700 dark:text-gray-200 p-1"
                  aria-label="Login"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M5.121 17.804A7.5 7.5 0 0112 15c2.486 0 4.735 1.21 6.121 2.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm7 2a10 10 0 11-20 0 10 10 0 0120 0z" />
                  </svg>
                </button>
              )}

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-700 dark:text-gray-200 hover:text-black dark:hover:text-white focus:outline-none p-1.5"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Menu Dropdown / Slider Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-[#1e293b] px-4 pt-2 pb-4 space-y-2 text-sm text-gray-800 dark:text-gray-200">
            {isAuthenticated && user && (
              <div className="py-2 border-b border-gray-100 dark:border-slate-800 mb-2">
                <p className="font-bold text-gray-900 dark:text-white text-xs">{user.name}</p>
                <p className="text-[11px] text-gray-400">{user.email}</p>
              </div>
            )}
            <Link href="/for-sale" className="block py-2 hover:text-[#E53935]">{t('forSale')}</Link>
            <Link href="/for-rent" className="block py-2 hover:text-[#E53935]">{t('forRent')}</Link>
            <Link href="/daily-rental" className="block py-2 hover:text-[#E53935]">{t('dailyRental')}</Link>
            <Link href="/projects" className="block py-2 hover:text-[#E53935]">{t('projects')}</Link>
            <Link href="/advertise" className="block py-2 hover:text-[#E53935]">{t('advertise')}</Link>
            
            {isAuthenticated ? (
              <div className="pt-2 space-y-1 border-t border-gray-100 dark:border-slate-800">
                {/* 1. Mobile Dashboard Link */}
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2.5 py-2.5 px-2 rounded hover:bg-gray-50 dark:hover:bg-slate-800 font-bold text-gray-900 dark:text-white"
                >
                  <span className="text-base text-[#E53935]">📊</span>
                  <span>Tableau de Bord</span>
                </Link>

                {/* 2. Mobile Profile Link */}
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2.5 py-2.5 px-2 rounded hover:bg-gray-50 dark:hover:bg-slate-800 font-semibold text-gray-700 dark:text-gray-200"
                >
                  <span className="text-base text-blue-500">👤</span>
                  <span>Mon Profil</span>
                </Link>

                {/* 3. Mobile Sign Out */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center space-x-2.5 w-full text-left py-2.5 px-2 text-red-600 dark:text-red-400 font-semibold hover:bg-red-50 dark:hover:bg-red-950/30 rounded"
                >
                  <span className="text-base">🚪</span>
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setLoginModalOpen(true);
                  }}
                  className="block w-full text-left py-2 hover:text-[#E53935] font-semibold"
                >
                  {t('signIn')}
                </button>
                <Link href="/signup" className="block py-2 hover:text-[#E53935]">{t('signUp')}</Link>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Login Modal Overlay */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
    </>
  );
}
