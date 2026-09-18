'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

// Popular Location Presets (Algerian Cities and Communes)
const POPULAR_LOCATIONS = [
  { city: 'Hydra', country: 'Alger', label: 'Hydra, Alger', icon: '📍' },
  { city: 'Sidi Yahia', country: 'Alger', label: 'Sidi Yahia, Alger', icon: '📍' },
  { city: 'Akid Lotfi', country: 'Oran', label: 'Akid Lotfi, Oran', icon: '📍' },
  { city: 'Canastel', country: 'Oran', label: 'Canastel, Oran', icon: '📍' },
  { city: 'El Biar', country: 'Alger', label: 'El Biar, Alger', icon: '📍' },
  { city: 'Ali Mendjeli', country: 'Constantine', label: 'Ali Mendjeli, Constantine', icon: '📍' },
  { city: 'Sidi Aissa', country: 'Annaba', label: 'Sidi Aissa, Annaba', icon: '📍' },
  { city: 'Centre Ville', country: 'Bejaia', label: 'Centre Ville, Bejaia', icon: '📍' }
];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const DAYS_SHORT = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default function NewSearchSection({ onSearch, isSearching }) {
  const { t } = useLanguage();

  // 1. Core Modes: ONLY 'rent' | 'sell' | 'projects' (NEVER 'buy')
  const [activeMode, setActiveMode] = useState('rent');

  // 2. Mandatory Fields
  const [location, setLocation] = useState('Hydra, Alger');
  const [locationInput, setLocationInput] = useState('Hydra, Alger');
  const [whenDate, setWhenDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14); // default 2 weeks out
    return d;
  });

  // Calendar Navigation
  const [calendarMonthOffset, setCalendarMonthOffset] = useState(0);

  // 3. Dynamic Mode-Specific Filters
  const [rentFilters, setRentFilters] = useState({
    type: 'all',
    maxPrice: '',
    beds: 'all',
    baths: 'all',
    furnished: 'all'
  });

  const [sellFilters, setSellFilters] = useState({
    type: 'all',
    maxPrice: '',
    beds: 'all',
    baths: 'all',
    loanReady: 'all'
  });

  const [projectFilters, setProjectFilters] = useState({
    projectType: 'all',
    status: 'all',
    developer: 'all',
    priceRange: 'all'
  });

  // Dropdown Popovers: 'location' | 'when' | 'filters' | null
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [hasAttemptedSearch, setHasAttemptedSearch] = useState(false);

  const containerRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format Date for Display: "15 Oct 2026"
  const formatDateDisplay = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // Validation
  const isLocationValid = location && location.trim().length > 0;
  const isWhenValid = whenDate !== null && whenDate !== '';
  const isSearchValid = isLocationValid && isWhenValid;

  // Active filters count for badge
  const getActiveFilterCount = () => {
    if (activeMode === 'rent') {
      let count = 0;
      if (rentFilters.type !== 'all') count++;
      if (rentFilters.maxPrice !== '') count++;
      if (rentFilters.beds !== 'all') count++;
      if (rentFilters.baths !== 'all') count++;
      if (rentFilters.furnished !== 'all') count++;
      return count;
    }
    if (activeMode === 'sell') {
      let count = 0;
      if (sellFilters.type !== 'all') count++;
      if (sellFilters.maxPrice !== '') count++;
      if (sellFilters.beds !== 'all') count++;
      if (sellFilters.baths !== 'all') count++;
      if (sellFilters.loanReady !== 'all') count++;
      return count;
    }
    if (activeMode === 'projects') {
      let count = 0;
      if (projectFilters.projectType !== 'all') count++;
      if (projectFilters.status !== 'all') count++;
      if (projectFilters.developer !== 'all') count++;
      if (projectFilters.priceRange !== 'all') count++;
      return count;
    }
    return 0;
  };

  const activeFilterCount = getActiveFilterCount();

  // Primary Button Label by Mode
  const getButtonLabel = () => {
    switch (activeMode) {
      case 'rent':
        return t('browseRentals');
      case 'sell':
        return t('browseProperties');
      case 'projects':
        return t('browseProjects');
      default:
        return t('browseProperties');
    }
  };

  // When Label by Mode
  const getWhenLabel = () => {
    return t('whenPlaceholder');
  };

  // Label for Selected Filter Type in Segment 3
  const getFilterTypeLabel = () => {
    if (activeMode === 'rent') {
      if (!rentFilters.type || rentFilters.type === 'all') return 'All Types';
      const map = {
        apartment: 'Apartment',
        house: 'House',
        villa: 'Villa',
        commercial: 'Commercial'
      };
      return map[rentFilters.type] || rentFilters.type.charAt(0).toUpperCase() + rentFilters.type.slice(1);
    }
    if (activeMode === 'sell') {
      if (!sellFilters.type || sellFilters.type === 'all') return 'All Types';
      const map = {
        apartment: 'Apartment',
        house: 'House',
        villa: 'Villa',
        land: 'Land',
        commercial: 'Commercial'
      };
      return map[sellFilters.type] || sellFilters.type.charAt(0).toUpperCase() + sellFilters.type.slice(1);
    }
    if (activeMode === 'projects') {
      if (!projectFilters.projectType || projectFilters.projectType === 'all') return 'All Projects';
      const map = {
        residential: 'Residential',
        commercial: 'Commercial',
        mixed: 'Mixed Use'
      };
      return map[projectFilters.projectType] || projectFilters.projectType.charAt(0).toUpperCase() + projectFilters.projectType.slice(1);
    }
    return 'All Types';
  };

  // Handle Search Execution
  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    setHasAttemptedSearch(true);

    if (!isSearchValid) {
      return;
    }

    setActiveDropdown(null);

    const currentFilters =
      activeMode === 'rent'
        ? rentFilters
        : activeMode === 'sell'
        ? sellFilters
        : projectFilters;

    if (onSearch) {
      onSearch({
        mode: activeMode,
        location: location.trim(),
        whenDate,
        filters: currentFilters
      });
    }
  };

  // Calendar rendering for When popover
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const renderCalendar = () => {
    const targetDate = new Date(today.getFullYear(), today.getMonth() + calendarMonthOffset, 1);
    const year = targetDate.getFullYear();
    const month = targetDate.getMonth();
    const monthName = MONTH_NAMES[month];

    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDayIndex; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));

    return (
      <div className="p-4 w-[300px]">
        {/* Month Header with Navigation */}
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setCalendarMonthOffset((p) => Math.max(0, p - 1))}
            disabled={calendarMonthOffset === 0}
            className={`p-1 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white rounded ${
              calendarMonthOffset === 0 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
            }`}
          >
            ‹
          </button>
          <span className="text-xs font-bold text-gray-900 dark:text-white">
            {monthName} {year}
          </span>
          <button
            type="button"
            onClick={() => setCalendarMonthOffset((p) => p + 1)}
            className="p-1 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white rounded cursor-pointer"
          >
            ›
          </button>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-7 gap-1 text-center text-[10.5px] font-semibold text-gray-400 dark:text-gray-400 mb-1">
          {DAYS_SHORT.map((d, idx) => (
            <div key={idx}>{d}</div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs">
          {days.map((d, idx) => {
            if (!d) return <div key={`empty-${idx}`} className="h-7 w-7" />;
            const isPast = d < today;
            const isSelected =
              whenDate &&
              d.getFullYear() === whenDate.getFullYear() &&
              d.getMonth() === whenDate.getMonth() &&
              d.getDate() === whenDate.getDate();

            let dayStyle = 'text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 rounded-full cursor-pointer';
            if (isPast) {
              dayStyle = 'text-gray-300 dark:text-gray-600 cursor-not-allowed';
            } else if (isSelected) {
              dayStyle = 'bg-[#7C3AED] text-white font-bold rounded-full shadow-xs cursor-pointer';
            }

            return (
              <button
                type="button"
                key={d.toISOString()}
                disabled={isPast}
                onClick={() => {
                  setWhenDate(d);
                  setActiveDropdown(null);
                }}
                className={`h-7 w-7 mx-auto flex items-center justify-center transition-all ${dayStyle}`}
              >
                {d.getDate()}
              </button>
            );
          })}
        </div>

        {/* Quick presets */}
        <div className="mt-3 pt-2.5 border-t border-gray-100 dark:border-slate-700 flex items-center justify-between text-[11px]">
          <button
            type="button"
            onClick={() => {
              const d = new Date(today);
              d.setDate(d.getDate() + 7);
              setWhenDate(d);
              setActiveDropdown(null);
            }}
            className="text-[#7C3AED] font-medium hover:underline cursor-pointer"
          >
            Next Week
          </button>
          <button
            type="button"
            onClick={() => {
              const d = new Date(today);
              d.setDate(d.getDate() + 30);
              setWhenDate(d);
              setActiveDropdown(null);
            }}
            className="text-[#7C3AED] font-medium hover:underline cursor-pointer"
          >
            Next Month
          </button>
        </div>
      </div>
    );
  };

  const filteredPopularLocations = POPULAR_LOCATIONS.filter((loc) =>
    loc.label.toLowerCase().includes(locationInput.toLowerCase())
  );

  return (
    <div ref={containerRef} className="w-full max-w-[960px] mx-auto transition-all">
      {/* ========================================================================= */}
      {/* 1. TOP TABS: Rent | Sell | Projects (NO BUY)                              */}
      {/* ========================================================================= */}
      <div className="flex items-center space-x-6 sm:space-x-8 px-4 sm:px-6 mb-[-1px] relative z-20">
        
        {/* Tab 1: Rent */}
        <button
          type="button"
          onClick={() => {
            setActiveMode('rent');
            setActiveDropdown(null);
          }}
          className={`pb-3 text-sm sm:text-base font-bold transition-all relative cursor-pointer ${
            activeMode === 'rent'
              ? 'text-[#7C3AED] dark:text-[#A78BFA]'
              : 'text-gray-300 dark:text-gray-400 hover:text-white'
          }`}
        >
          <span>{t('rentTab')}</span>
          {activeMode === 'rent' && (
            <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#7C3AED] dark:bg-[#A78BFA] rounded-t-full transition-all" />
          )}
        </button>

        {/* Tab 2: Sell (Searching properties for sale) */}
        <button
          type="button"
          onClick={() => {
            setActiveMode('sell');
            setActiveDropdown(null);
          }}
          className={`pb-3 text-sm sm:text-base font-bold transition-all relative cursor-pointer ${
            activeMode === 'sell'
              ? 'text-[#7C3AED] dark:text-[#A78BFA]'
              : 'text-gray-300 dark:text-gray-400 hover:text-white'
          }`}
        >
          <span>{t('sellTab')}</span>
          {activeMode === 'sell' && (
            <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#7C3AED] dark:bg-[#A78BFA] rounded-t-full transition-all" />
          )}
        </button>

        {/* Tab 3: Projects (Searching real-estate developments) */}
        <button
          type="button"
          onClick={() => {
            setActiveMode('projects');
            setActiveDropdown(null);
          }}
          className={`pb-3 text-sm sm:text-base font-bold transition-all relative cursor-pointer ${
            activeMode === 'projects'
              ? 'text-[#7C3AED] dark:text-[#A78BFA]'
              : 'text-gray-300 dark:text-gray-400 hover:text-white'
          }`}
        >
          <span>{t('projectsTab')}</span>
          {activeMode === 'projects' && (
            <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#7C3AED] dark:bg-[#A78BFA] rounded-t-full transition-all" />
          )}
        </button>

      </div>

      {/* ========================================================================= */}
      {/* 2. DYNAMIC SEARCH CARD CONTAINER                                         */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-2xl border border-gray-150 dark:border-slate-800 p-3 sm:p-4 transition-all relative z-10">
        
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5">
          
          {/* --------------------------------------------------------------------- */}
          {/* SEGMENT 1: LOCATION (Mandatory)                                       */}
          {/* --------------------------------------------------------------------- */}
          <div className="relative flex-1">
            <div
              onClick={() => setActiveDropdown(activeDropdown === 'location' ? null : 'location')}
              className={`p-2.5 sm:p-3 rounded-xl transition-all cursor-pointer text-left border ${
                activeDropdown === 'location'
                  ? 'border-[#7C3AED] bg-purple-50/40 dark:bg-purple-950/20'
                  : hasAttemptedSearch && !isLocationValid
                  ? 'border-red-500 bg-red-50/40 dark:bg-red-950/20'
                  : 'border-transparent hover:bg-gray-50 dark:hover:bg-slate-800/80'
              }`}
            >
              <div className="text-[11px] sm:text-[12px] font-semibold text-gray-500 dark:text-gray-400">
                {t('where')} <span className="text-red-500 font-bold">*</span>
              </div>
              <div className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate mt-0.5">
                {location || (
                  <span className="text-gray-400 dark:text-gray-500 font-normal">
                    {t('wherePlaceholder')}
                  </span>
                )}
              </div>
            </div>

            {/* Location Suggestions Popover */}
            {activeDropdown === 'location' && (
              <div className="absolute top-full left-0 mt-2 w-full sm:w-[320px] bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-slate-700 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <input
                  type="text"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  placeholder={t('wherePlaceholder')}
                  autoFocus
                  className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl py-2 px-3 text-xs sm:text-sm text-gray-900 dark:text-white outline-none focus:border-[#7C3AED] mb-2"
                />

                <div className="text-[10.5px] font-bold uppercase text-gray-400 dark:text-gray-500 px-1 mb-1">
                  {t('popularLocations')}
                </div>

                <div className="max-h-[220px] overflow-y-auto space-y-1">
                  {filteredPopularLocations.length > 0 ? (
                    filteredPopularLocations.map((item, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => {
                          setLocation(item.label);
                          setLocationInput(item.label);
                          setActiveDropdown(null);
                        }}
                        className="w-full flex items-center space-x-2.5 p-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-950/40 text-left transition-colors cursor-pointer text-xs"
                      >
                        <span className="text-sm">{item.icon}</span>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {item.city}
                          </div>
                          <div className="text-[10.5px] text-gray-400 dark:text-gray-400">
                            {item.country}
                          </div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setLocation(locationInput);
                        setActiveDropdown(null);
                      }}
                      className="w-full p-2.5 text-center text-xs text-purple-600 dark:text-purple-400 font-bold hover:bg-purple-50 dark:hover:bg-slate-800 rounded-lg"
                    >
                      Use &quot;{locationInput}&quot;
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="hidden lg:block w-[1px] h-9 bg-gray-200 dark:bg-slate-700" />

          {/* --------------------------------------------------------------------- */}
          {/* SEGMENT 2: WHEN / DATE (Mandatory)                                    */}
          {/* --------------------------------------------------------------------- */}
          <div className="relative flex-1">
            <div
              onClick={() => setActiveDropdown(activeDropdown === 'when' ? null : 'when')}
              className={`p-2.5 sm:p-3 rounded-xl transition-all cursor-pointer text-left border ${
                activeDropdown === 'when'
                  ? 'border-[#7C3AED] bg-purple-50/40 dark:bg-purple-950/20'
                  : hasAttemptedSearch && !isWhenValid
                  ? 'border-red-500 bg-red-50/40 dark:bg-red-950/20'
                  : 'border-transparent hover:bg-gray-50 dark:hover:bg-slate-800/80'
              }`}
            >
              <div className="text-[11px] sm:text-[12px] font-semibold text-gray-500 dark:text-gray-400 flex items-center justify-between">
                <span>
                  {t('when')} <span className="text-red-500 font-bold">*</span>
                </span>
                <span className="text-[10px] text-gray-400 dark:text-gray-500">
                  {activeMode === 'rent' ? 'Move-in' : activeMode === 'sell' ? 'Available' : 'Delivery'}
                </span>
              </div>
              <div className="flex items-center justify-between mt-0.5">
                <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate">
                  {whenDate ? formatDateDisplay(whenDate) : getWhenLabel()}
                </span>
                <svg className="w-4 h-4 text-[#7C3AED] dark:text-[#A78BFA] ml-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            {/* Calendar Popover */}
            {activeDropdown === 'when' && (
              <div className="absolute top-full left-0 sm:left-auto sm:right-0 mt-2 bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-slate-700 rounded-2xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                {renderCalendar()}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="hidden lg:block w-[1px] h-9 bg-gray-200 dark:bg-slate-700" />

          {/* --------------------------------------------------------------------- */}
          {/* SEGMENT 3: DYNAMIC MODE FILTERS                                       */}
          {/* --------------------------------------------------------------------- */}
          <div className="relative flex-1">
            <div
              onClick={() => setActiveDropdown(activeDropdown === 'filters' ? null : 'filters')}
              className={`p-2.5 sm:p-3 rounded-xl transition-all cursor-pointer text-left border ${
                activeDropdown === 'filters'
                  ? 'border-[#7C3AED] bg-purple-50/40 dark:bg-purple-950/20'
                  : 'border-transparent hover:bg-gray-50 dark:hover:bg-slate-800/80'
              }`}
            >
              <div className="text-[11px] sm:text-[12px] font-semibold text-gray-500 dark:text-gray-400 flex items-center justify-between">
                <span>
                  {t('filters')}
                </span>
                {activeFilterCount > 0 && (
                  <span className="bg-[#7C3AED] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between mt-0.5 text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate">
                <span className="truncate">
                  {getFilterTypeLabel()}
                </span>
                <svg className="w-4 h-4 text-gray-400 dark:text-gray-500 ml-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
            </div>

            {/* Mode-Specific Filters Popover */}
            {activeDropdown === 'filters' && (
              <div className="absolute top-full right-0 mt-2 w-full sm:w-[340px] max-w-[92vw] max-h-[75vh] overflow-y-auto bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-slate-700 rounded-2xl shadow-2xl p-4 z-50 text-left animate-in fade-in slide-in-from-top-2 duration-150">
                
                {/* 1. RENT FILTERS */}
                {activeMode === 'rent' && (
                  <div className="space-y-3.5 text-xs">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1">
                        PROPERTY TYPE
                      </label>
                      <select
                        value={rentFilters.type}
                        onChange={(e) => setRentFilters({ ...rentFilters, type: e.target.value })}
                        className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-2 text-xs text-gray-900 dark:text-white outline-none"
                      >
                        <option value="all">All Property Types</option>
                        <option value="apartment">Apartment</option>
                        <option value="house">House</option>
                        <option value="villa">Villa</option>
                        <option value="commercial">Commercial</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1">
                          BEDROOMS
                        </label>
                        <select
                          value={rentFilters.beds}
                          onChange={(e) => setRentFilters({ ...rentFilters, beds: e.target.value })}
                          className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-2 text-xs text-gray-900 dark:text-white outline-none"
                        >
                          <option value="all">Any Beds</option>
                          <option value="1">1+ Beds</option>
                          <option value="2">2+ Beds</option>
                          <option value="3">3+ Beds</option>
                          <option value="4">4+ Beds</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1">
                          BATHROOMS
                        </label>
                        <select
                          value={rentFilters.baths}
                          onChange={(e) => setRentFilters({ ...rentFilters, baths: e.target.value })}
                          className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-2 text-xs text-gray-900 dark:text-white outline-none"
                        >
                          <option value="all">Any Baths</option>
                          <option value="1">1+ Baths</option>
                          <option value="2">2+ Baths</option>
                          <option value="3">3+ Baths</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1">
                        MAX MONTHLY RENT (DZD)
                      </label>
                      <input
                        type="number"
                        value={rentFilters.maxPrice}
                        onChange={(e) => setRentFilters({ ...rentFilters, maxPrice: e.target.value })}
                        placeholder="e.g. 150000"
                        className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-2 text-xs text-gray-900 dark:text-white outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* 2. SELL FILTERS */}
                {activeMode === 'sell' && (
                  <div className="space-y-3.5 text-xs">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1">
                        PROPERTY TYPE FOR SALE
                      </label>
                      <select
                        value={sellFilters.type}
                        onChange={(e) => setSellFilters({ ...sellFilters, type: e.target.value })}
                        className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-2 text-xs text-gray-900 dark:text-white outline-none"
                      >
                        <option value="all">All Property Types</option>
                        <option value="apartment">Apartment</option>
                        <option value="house">House</option>
                        <option value="villa">Villa</option>
                        <option value="land">Land</option>
                        <option value="commercial">Commercial</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1">
                          BEDROOMS
                        </label>
                        <select
                          value={sellFilters.beds}
                          onChange={(e) => setSellFilters({ ...sellFilters, beds: e.target.value })}
                          className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-2 text-xs text-gray-900 dark:text-white outline-none"
                        >
                          <option value="all">Any Beds</option>
                          <option value="1">1+ Beds</option>
                          <option value="2">2+ Beds</option>
                          <option value="3">3+ Beds</option>
                          <option value="4">4+ Beds</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1">
                          BATHROOMS
                        </label>
                        <select
                          value={sellFilters.baths}
                          onChange={(e) => setSellFilters({ ...sellFilters, baths: e.target.value })}
                          className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-2 text-xs text-gray-900 dark:text-white outline-none"
                        >
                          <option value="all">Any Baths</option>
                          <option value="1">1+ Baths</option>
                          <option value="2">2+ Baths</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1">
                        MAX SALE PRICE (DZD)
                      </label>
                      <input
                        type="number"
                        value={sellFilters.maxPrice}
                        onChange={(e) => setSellFilters({ ...sellFilters, maxPrice: e.target.value })}
                        placeholder="e.g. 45000000"
                        className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-2 text-xs text-gray-900 dark:text-white outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* 3. PROJECT FILTERS */}
                {activeMode === 'projects' && (
                  <div className="space-y-3.5 text-xs">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1">
                        PROJECT TYPE
                      </label>
                      <select
                        value={projectFilters.projectType}
                        onChange={(e) => setProjectFilters({ ...projectFilters, projectType: e.target.value })}
                        className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-2 text-xs text-gray-900 dark:text-white outline-none"
                      >
                        <option value="all">All Project Types</option>
                        <option value="residential">Residential</option>
                        <option value="commercial">Commercial</option>
                        <option value="mixed">Mixed Use</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1">
                        DELIVERY STAGE
                      </label>
                      <select
                        value={projectFilters.status}
                        onChange={(e) => setProjectFilters({ ...projectFilters, status: e.target.value })}
                        className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-2 text-xs text-gray-900 dark:text-white outline-none"
                      >
                        <option value="all">Any Status</option>
                        <option value="ready">Ready to Move</option>
                        <option value="under_construction">Under Construction</option>
                        <option value="off_plan">Off Plan</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Reset & Apply Filter Actions */}
                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-slate-700 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      if (activeMode === 'rent') {
                        setRentFilters({ type: 'all', maxPrice: '', beds: 'all', baths: 'all', furnished: 'all' });
                      } else if (activeMode === 'sell') {
                        setSellFilters({ type: 'all', maxPrice: '', beds: 'all', baths: 'all', loanReady: 'all' });
                      } else {
                        setProjectFilters({ projectType: 'all', status: 'all', developer: 'all', priceRange: 'all' });
                      }
                    }}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 font-medium text-[11px]"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveDropdown(null)}
                    className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-4 py-1.5 rounded-lg font-semibold text-xs transition-colors"
                  >
                    Apply Filters
                  </button>
                </div>

              </div>
            )}
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* SEGMENT 4: DYNAMIC SEARCH BUTTON                                      */}
          {/* --------------------------------------------------------------------- */}
          <button
            type="button"
            onClick={handleSearchSubmit}
            disabled={!isSearchValid || isSearching}
            className={`px-7 py-3.5 sm:py-3.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center space-x-2 shrink-0 ${
              isSearchValid
                ? 'bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-md hover:shadow-lg cursor-pointer active:scale-95'
                : 'bg-gray-200 dark:bg-slate-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
            }`}
          >
            {isSearching ? (
              <div className="flex items-center space-x-2">
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Searching...</span>
              </div>
            ) : (
              <span>{getButtonLabel()}</span>
            )}
          </button>

        </div>

        {/* Mandatory Validation Banner */}
        {hasAttemptedSearch && !isSearchValid && (
          <div className="mt-2.5 px-2 text-[11.5px] text-red-500 dark:text-red-400 font-medium flex items-center space-x-1.5 animate-in fade-in">
            <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>
              Please provide both <strong>Location</strong> and <strong>When</strong> date to perform search.
            </span>
          </div>
        )}

      </div>
    </div>
  );
}
