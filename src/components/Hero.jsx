'use client';

import NewSearchSection from './NewSearchSection';

export default function Hero({ onSearch, isSearching }) {
  return (
    <section className="relative z-20 w-full min-h-[520px] sm:min-h-[560px] lg:min-h-[600px] flex items-center justify-center py-14 sm:py-20">
      {/* Background Image & Soft Dark Gradient Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=2000&q=85"
          alt="Modern residential building"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/55 dark:bg-black/70 transition-colors"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center">
        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-normal text-white tracking-tight leading-[1.12] mb-8 drop-shadow-sm">
          Your dream <br />
          house is here.
        </h1>

        {/* Brand-New Multi-Mode Search Component */}
        <NewSearchSection onSearch={onSearch} isSearching={isSearching} />
      </div>
    </section>
  );
}
