'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import MakanLogo from './MakanLogo';

export default function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#0B0D12] dark:bg-[#050608] text-gray-300 border-t border-white/10 dark:border-white/5 pt-14 pb-8 transition-colors duration-200">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-12">
          
          {/* 1. Brand Column (Wider on desktop - 4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            {/* MAKAN Logo */}
            <Link href="/" className="inline-flex items-center group py-1" aria-label="MAKAN Home">
              <MakanLogo variant="white" className="h-8 sm:h-9 w-auto" />
            </Link>

            {/* Description */}
            <p className="text-xs sm:text-[13px] text-gray-400 leading-relaxed max-w-sm">
              {t('footerDesc')}
            </p>

            {/* Social Icons */}
            <div className="flex items-center space-x-2.5 pt-2">
              {/* X / Twitter */}
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter / X"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs transition-colors"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs transition-colors"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.6 1.6 0 0 0-1.6 1.6 1.6 1.6 0 0 0 1.6 1.6 1.6 1.6 0 0 0 1.6-1.6 1.6 1.6 0 0 0-1.6-1.6z"/>
                </svg>
              </a>

              {/* Instagram / Global */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs transition-colors"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* 2. Links Column (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-white font-semibold text-xs sm:text-sm tracking-wider">
              {t('links')}
            </h4>
            <ul className="space-y-2 text-xs sm:text-[13px] text-gray-400">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  {t('home')}
                </Link>
              </li>
              <li>
                <Link href="/for-rent" className="hover:text-white transition-colors">
                  {t('forRent')}
                </Link>
              </li>
              <li>
                <Link href="/for-sale" className="hover:text-white transition-colors">
                  {t('forSale')}
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-white transition-colors">
                  {t('projects')}
                </Link>
              </li>
              <li>
                <Link href="/daily-rental" className="hover:text-white transition-colors">
                  {t('dailyRental')}
                </Link>
              </li>
              <li>
                <Link href="/search-map" className="hover:text-white transition-colors">
                  {t('searchMap')}
                </Link>
              </li>
              <li>
                <Link href="/advertise" className="hover:text-white transition-colors">
                  {t('advertise')}
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. Policies Column (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-white font-semibold text-xs sm:text-sm tracking-wider">
              {t('policies')}
            </h4>
            <ul className="space-y-2 text-xs sm:text-[13px] text-gray-400">
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  {t('privacyPolicy')}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  {t('termsConditions')}
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-white transition-colors">
                  {t('userAgreement')}
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="hover:text-white transition-colors">
                  {t('cookiePolicy')}
                </Link>
              </li>
            </ul>
          </div>

          {/* 4. Contact Column (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-white font-semibold text-xs sm:text-sm tracking-wider">
              {t('contact')}
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-[13px] text-gray-400">
              {/* Phone */}
              <li className="flex items-center space-x-2.5">
                <svg className="w-4 h-4 text-gray-400 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21c1.12.45 2.33.69 3.48.69a1 1 0 011 1v3.5a1 1 0 01-1 1A17.91 17.91 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.15.24 2.36.69 3.48a1 1 0 01-.21 1.11l-2.2 2.2z"/>
                </svg>
                <a href="tel:+21323456789" className="hover:text-white transition-colors">
                  +213 (0) 23 45 67 89
                </a>
              </li>

              {/* Email */}
              <li className="flex items-center space-x-2.5">
                <svg className="w-4 h-4 text-gray-400 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                <a href="mailto:contact@makan.dz" className="hover:text-white transition-colors">
                  contact@makan.dz
                </a>
              </li>

              {/* Address */}
              <li className="flex items-start space-x-2.5">
                <svg className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <span className="leading-relaxed">
                  12 Boulevard du 11 Décembre 1960, Val d’Hydra, Alger, Algérie
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Thin Divider & Bottom Copyright */}
        <div className="pt-6 border-t border-white/10 dark:border-slate-800 text-center text-xs text-gray-500">
          <p>© {currentYear} MAKAN. {t('allRightsReserved')}</p>
        </div>

      </div>
    </footer>
  );
}
