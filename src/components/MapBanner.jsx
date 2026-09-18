import Link from 'next/link';

export default function MapBanner() {
  return (
    <div className="w-full bg-white dark:bg-[#1e293b] border border-gray-200/80 dark:border-slate-800 rounded-[2px] shadow-sm overflow-hidden flex flex-col md:flex-row my-10 transition-colors duration-200">
      {/* Left Text Content */}
      <div className="flex-1 p-8 sm:p-10 lg:p-12 flex flex-col justify-center items-start">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight mb-2.5">
          Search Your Dream House On The Map
        </h2>
        <p className="text-[13px] text-gray-400 dark:text-gray-300 mb-8 max-w-md leading-relaxed">
          Find the house you are looking for easily according to location information.
        </p>
        <Link
          href="/search-map"
          className="bg-[#E53935] hover:bg-[#d32f2f] text-white text-xs font-medium px-6 py-2.5 rounded-[3px] transition-colors shadow-sm"
        >
          Search On Map
        </Link>
      </div>

      {/* Right Map/Mobile Image */}
      <div className="w-full md:w-[45%] h-56 sm:h-64 md:h-auto min-h-[220px] bg-gray-100 dark:bg-slate-800 overflow-hidden relative">
        <img
          src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1000&q=80"
          alt="Hands holding smartphone with map location"
          className="w-full h-full object-cover object-center"
          loading="lazy"
        />
      </div>
    </div>
  );
}
