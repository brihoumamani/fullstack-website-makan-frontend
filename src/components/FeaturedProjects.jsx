import Link from 'next/link';

export default function FeaturedProjects() {
  const projectImage = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80';
  const projectImageVertical = 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80';

  return (
    <section className="w-full my-12">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
          Featured Projects
        </h2>
        <Link
          href="/projects"
          className="border border-gray-300 dark:border-slate-700 hover:border-gray-500 dark:hover:border-slate-500 rounded-[2px] px-3.5 py-0.5 text-xs text-gray-700 dark:text-gray-300 transition-colors"
        >
          All
        </Link>
      </div>

      {/* Top Wide Project Card */}
      <div className="bg-white dark:bg-[#1e293b] border border-gray-200/90 dark:border-slate-800 rounded-[2px] shadow-sm overflow-hidden flex flex-col md:flex-row mb-6 hover:shadow-md transition-all duration-200">
        {/* Left Info */}
        <div className="flex-1 p-6 sm:p-8 lg:p-10 flex flex-col justify-between items-start min-h-[220px]">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
              Résidence Les Pins - Val d’Hydra
            </h3>
            <p className="text-[12px] sm:text-[12.5px] text-gray-400 dark:text-gray-300 leading-relaxed max-w-lg mb-6">
              Emplacement prestigieux au cœur du Val d’Hydra à Alger.<br />
              Proche des ambassades, centres d’affaires, écoles internationales et commerces...
            </p>
          </div>
          <Link
            href="/projects/residence-les-pins"
            className="border border-[#E53935] text-[#E53935] hover:bg-red-50 dark:hover:bg-red-950/40 text-[11.5px] font-medium px-4 py-1.5 rounded-[3px] transition-colors"
          >
            Voir le Projet
          </Link>
        </div>

        {/* Right Image */}
        <div className="w-full md:w-[48%] h-56 sm:h-64 md:h-auto min-h-[220px] bg-gray-100 dark:bg-slate-800 relative overflow-hidden">
          <img
            src={projectImage}
            alt="Résidence Les Pins Val d'Hydra Alger"
            className="w-full h-full object-cover object-center hover:scale-102 transition-transform duration-300"
            loading="lazy"
          />
        </div>
      </div>

      {/* Bottom 2 Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1 */}
        <div className="bg-white dark:bg-[#1e293b] border border-gray-200/90 dark:border-slate-800 rounded-[2px] shadow-sm overflow-hidden flex flex-col sm:flex-row hover:shadow-md transition-all duration-200">
          <div className="flex-1 p-6 sm:p-7 flex flex-col justify-between items-start min-h-[200px]">
            <div>
              <h3 className="text-base sm:text-[17px] font-bold text-gray-900 dark:text-white mb-2.5 tracking-tight">
                Tours El Bahia - Akid Lotfi
              </h3>
              <p className="text-[11.5px] sm:text-[12px] text-gray-400 dark:text-gray-300 leading-relaxed mb-6">
                Complexe résidentiel haut de gamme sur le Boulevard Millénium à Oran.<br />
                Vue panoramique sur la baie, finitions d’exception et parking sécurisé...
              </p>
            </div>
            <Link
              href="/projects/tours-el-bahia"
              className="border border-[#E53935] text-[#E53935] hover:bg-red-50 dark:hover:bg-red-950/40 text-[11.5px] font-medium px-4 py-1.5 rounded-[3px] transition-colors"
            >
              Voir le Projet
            </Link>
          </div>
          <div className="w-full sm:w-[44%] h-48 sm:h-auto min-h-[190px] bg-gray-100 dark:bg-slate-800 relative overflow-hidden">
            <img
              src={projectImageVertical}
              alt="Tours El Bahia Oran"
              className="w-full h-full object-cover object-center hover:scale-102 transition-transform duration-300"
              loading="lazy"
            />
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white dark:bg-[#1e293b] border border-gray-200/90 dark:border-slate-800 rounded-[2px] shadow-sm overflow-hidden flex flex-col sm:flex-row hover:shadow-md transition-all duration-200">
          <div className="flex-1 p-6 sm:p-7 flex flex-col justify-between items-start min-h-[200px]">
            <div>
              <h3 className="text-base sm:text-[17px] font-bold text-gray-900 dark:text-white mb-2.5 tracking-tight">
                Résidence Bessa Horizon - Chéraga
              </h3>
              <p className="text-[11.5px] sm:text-[12px] text-gray-400 dark:text-gray-300 leading-relaxed mb-6">
                Nouvelle promotion immobilière moderne à l’ouest d’Alger.<br />
                Appartements F3, F4 et duplex avec bâche à eau et sécurité 24/7...
              </p>
            </div>
            <Link
              href="/projects/bessa-horizon"
              className="border border-[#E53935] text-[#E53935] hover:bg-red-50 dark:hover:bg-red-950/40 text-[11.5px] font-medium px-4 py-1.5 rounded-[3px] transition-colors"
            >
              Voir le Projet
            </Link>
          </div>
          <div className="w-full sm:w-[44%] h-48 sm:h-auto min-h-[190px] bg-gray-100 dark:bg-slate-800 relative overflow-hidden">
            <img
              src={projectImage}
              alt="Résidence Bessa Horizon Cheraga Alger"
              className="w-full h-full object-cover object-center hover:scale-102 transition-transform duration-300"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
