'use client';

import PropertyCard from './PropertyCard';
import { useLanguage } from '@/context/LanguageContext';

export default function SearchResultsSection({
  searchState,
  onResetSearch
}) {
  const { t } = useLanguage();

  const {
    hasSearched,
    isSearching,
    mode,
    location,
    whenDate,
    results = [],
    error
  } = searchState || {};

  if (!hasSearched && !isSearching) {
    return null;
  }

  const formattedDate = whenDate instanceof Date
    ? whenDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
    : whenDate;

  const modeBadge =
    mode === 'rent'
      ? t('forRent')
      : mode === 'sell'
      ? t('forSale')
      : t('projects');

  return (
    <section id="search-results-section" className="w-full mt-10 mb-12 scroll-mt-24 transition-all">
      
      {/* Results Header Bar */}
      <div className="bg-white dark:bg-[#1e293b] border border-gray-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 mb-7 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5 mb-1.5">
              <span className="bg-[#6366F1] text-white text-[11px] uppercase font-extrabold tracking-wider px-3 py-0.5 rounded-full shadow-xs">
                {modeBadge}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                📍 {location} &nbsp;•&nbsp; 📅 {formattedDate}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              {isSearching
                ? t('searching')
                : results.length === 0
                ? t('propertyNotFound')
                : `${results.length} ${t('propertiesFound')}`}
            </h2>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onResetSearch}
              className="text-xs font-semibold text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white px-3.5 py-2 rounded-xl border border-gray-200 dark:border-slate-700 hover:border-gray-400 transition-colors cursor-pointer"
            >
              {t('clearSearch')}
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 p-4 rounded-2xl text-xs sm:text-sm mb-6">
          {error}
        </div>
      )}

      {/* 1. Loading Skeletons */}
      {isSearching && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-slate-800 rounded-2xl overflow-hidden h-[360px] flex flex-col">
              <div className="w-full aspect-[16/11] bg-gray-200 dark:bg-slate-700" />
              <div className="p-5 space-y-3 flex-1">
                <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-1/2" />
                <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-3/4" />
                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. Results Grid */}
      {!isSearching && results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {results.map((item) => (
            <PropertyCard
              key={item._id}
              property={{
                ...item,
                rentOrSale: mode === 'rent' ? 'rent' : 'sale'
              }}
            />
          ))}
        </div>
      )}

      {/* 3. Empty State */}
      {!isSearching && results.length === 0 && (
        <div className="bg-white dark:bg-[#1e293b] border border-gray-200/90 dark:border-slate-800 rounded-2xl p-10 text-center max-w-lg mx-auto shadow-sm">
          <div className="w-14 h-14 bg-purple-50 dark:bg-purple-950/50 text-[#6366F1] rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
            🔍
          </div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2">
            {t('propertyNotFound')}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
            {t('noMatchingDesc')}
          </p>
          <button
            type="button"
            onClick={onResetSearch}
            className="bg-[#6366F1] hover:bg-[#4F46E5] text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            {t('resetFilters')}
          </button>
        </div>
      )}

    </section>
  );
}
