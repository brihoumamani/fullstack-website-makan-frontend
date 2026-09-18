'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

// Mock project items localized to Algeria
const topFeaturedProject = {
  _id: 'project-top',
  title: 'Résidence Les Pins - Val d’Hydra',
  description: 'Programme résidentiel d’exception situé à Val d’Hydra, Alger. Emplacement prestigieux à proximité des ambassades, des centres d’affaires et des axes autoroutiers majeurs...',
  location: 'Alger',
  commune: 'Hydra',
  type: 'residential',
  developer: 'bessa',
  price: '38.000.000 DA - 75.000.000 DA',
  image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'
};

const algerianProjectsList = [
  {
    _id: 'project-1',
    title: 'Tours El Bahia Business & Living',
    description: 'Complexe immobilier moderne alliant appartements résidentiels de luxe et centre d’affaires ultra-moderne.',
    location: 'Oran',
    commune: 'Akid Lotfi',
    type: 'mixed',
    developer: 'hasnaoui',
    image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80'
  },
  {
    _id: 'project-2',
    title: 'Résidence Bessa Horizon',
    description: 'Nouvelle promotion immobilière haut de standing avec vue dégagée, finitions nobles et piscine collective.',
    location: 'Alger',
    commune: 'Chéraga',
    type: 'residential',
    developer: 'bessa',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'
  },
  {
    _id: 'project-3',
    title: 'Le Belvédère de Canastel',
    description: 'Villas et duplex privatifs face à la mer méditerranée offrant un cadre de vie calme et sécurisé.',
    location: 'Oran',
    commune: 'Canastel',
    type: 'residential',
    developer: 'promotech',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
  },
  {
    _id: 'project-4',
    title: 'Résidence Les Palmiers',
    description: 'Programme résidentiel exclusif au cœur de Sidi Yahia avec commerces en rez-de-chaussée et parking privatif.',
    location: 'Alger',
    commune: 'Sidi Yahia',
    type: 'mixed',
    developer: 'soummam',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
  },
  {
    _id: 'project-5',
    title: 'Constantine Sky Heights',
    description: 'Tours résidentielles modernes à Ali Mendjeli équipées de doubles ascenseurs et domotique connectée.',
    location: 'Constantine',
    commune: 'Ali Mendjeli',
    type: 'residential',
    developer: 'bessa',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'
  },
  {
    _id: 'project-6',
    title: 'Résidence Mont d’Or',
    description: 'Appartements F3 et F4 vue panoramique sur la côte annabie avec matériaux d’importation et sécurité 24h/24.',
    location: 'Annaba',
    commune: 'Sidi Aissa',
    type: 'residential',
    developer: 'hasnaoui',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'
  },
  {
    _id: 'project-7',
    title: 'Les Jardins du Sahel',
    description: 'Havre de paix résidentiel à El Biar comprenant des appartements spacieux avec grands balcons et loggias.',
    location: 'Alger',
    commune: 'El Biar',
    type: 'residential',
    developer: 'promotech',
    image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80'
  },
  {
    _id: 'project-8',
    title: 'Résidence Marina View',
    description: 'Complexe balnéaire de grand standing à Ain El Turk pour résidences secondaires ou investissements locatifs.',
    location: 'Oran',
    commune: 'Ain El Turk',
    type: 'mixed',
    developer: 'soummam',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
  }
];

export default function ProjectsPage() {
  const [projectType, setProjectType] = useState('all');
  const [location, setLocation] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [deliveryStage, setDeliveryStage] = useState('all');
  const [developer, setDeveloper] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('smart');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter grid projects
  const filteredGridProjects = useMemo(() => {
    return algerianProjectsList.filter((project) => {
      if (projectType !== 'all' && project.type !== projectType) return false;
      if (location !== 'all' && project.location.toLowerCase() !== location.toLowerCase() && project.commune.toLowerCase() !== location.toLowerCase()) return false;
      if (developer !== 'all' && project.developer !== developer) return false;
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesTitle = project.title.toLowerCase().includes(query);
        const matchesDesc = project.description.toLowerCase().includes(query);
        const matchesLoc = project.location.toLowerCase().includes(query);
        const matchesComm = project.commune.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesLoc && !matchesComm) return false;
      }
      return true;
    });
  }, [projectType, location, developer, searchQuery]);

  return (
    <div className="w-full bg-[#FAFAFA] dark:bg-[#0f172a] min-h-screen py-8 transition-colors duration-200">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 space-y-7">
        
        {/* 1. Top Filter Bar */}
        <div className="bg-white dark:bg-[#0E1016] border border-gray-200 dark:border-slate-800 rounded-xl shadow-xs p-3 sm:p-3.5 flex flex-col lg:flex-row items-stretch lg:items-center gap-3 transition-colors">
          
          {/* Search Input (Left - flex-1) */}
          <div className="relative flex-1">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="7" strokeWidth="2" />
                <path strokeLinecap="round" strokeWidth="2" d="M16.5 16.5L20 20" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Wilaya, Commune or project name..."
              className="w-full bg-white dark:bg-[#141720] border border-gray-300 dark:border-slate-700 rounded-md py-2.5 pl-10 pr-4 text-xs sm:text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:border-[#6366F1] dark:focus:border-[#818CF8] transition-colors"
            />
          </div>

          {/* Filter Dropdowns (Right) */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
            {/* Dropdown 1: Project Type */}
            <div className="relative min-w-[120px] sm:min-w-[130px] flex-1 sm:flex-initial">
              <select
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                className="w-full appearance-none bg-white dark:bg-[#141720] border border-gray-300 dark:border-slate-700 rounded-md py-2.5 pl-3.5 pr-8 text-xs sm:text-sm text-gray-800 dark:text-gray-100 outline-none focus:border-[#6366F1] dark:focus:border-[#818CF8] cursor-pointer transition-colors font-normal"
              >
                <option value="all" className="dark:bg-[#141720]">Type de projet</option>
                <option value="residential" className="dark:bg-[#141720]">Résidentiel</option>
                <option value="commercial" className="dark:bg-[#141720]">Commercial</option>
                <option value="mixed" className="dark:bg-[#141720]">Mixte (Résidence & Bureaux)</option>
              </select>
              <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-700 dark:text-gray-300">
                <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Dropdown 2: Wilaya */}
            <div className="relative min-w-[110px] sm:min-w-[120px] flex-1 sm:flex-initial">
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full appearance-none bg-white dark:bg-[#141720] border border-gray-300 dark:border-slate-700 rounded-md py-2.5 pl-3.5 pr-8 text-xs sm:text-sm text-gray-800 dark:text-gray-100 outline-none focus:border-[#6366F1] dark:focus:border-[#818CF8] cursor-pointer transition-colors font-normal"
              >
                <option value="all" className="dark:bg-[#141720]">Wilaya</option>
                <option value="alger" className="dark:bg-[#141720]">Alger</option>
                <option value="oran" className="dark:bg-[#141720]">Oran</option>
                <option value="constantine" className="dark:bg-[#141720]">Constantine</option>
                <option value="annaba" className="dark:bg-[#141720]">Annaba</option>
              </select>
              <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-700 dark:text-gray-300">
                <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Dropdown 3: Price */}
            <div className="relative min-w-[120px] sm:min-w-[130px] flex-1 sm:flex-initial">
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full appearance-none bg-white dark:bg-[#141720] border border-gray-300 dark:border-slate-700 rounded-md py-2.5 pl-3.5 pr-8 text-xs sm:text-sm text-gray-800 dark:text-gray-100 outline-none focus:border-[#6366F1] dark:focus:border-[#818CF8] cursor-pointer transition-colors font-normal"
              >
                <option value="all" className="dark:bg-[#141720]">Prix (DZD)</option>
                <option value="20m-40m" className="dark:bg-[#141720]">20M - 40M DA</option>
                <option value="40m-70m" className="dark:bg-[#141720]">40M - 70M DA</option>
                <option value="70m+" className="dark:bg-[#141720]">&gt; 70M DA</option>
              </select>
              <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-700 dark:text-gray-300">
                <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Dropdown 4: Delivery Stage */}
            <div className="relative min-w-[115px] sm:min-w-[125px] flex-1 sm:flex-initial">
              <select
                value={deliveryStage}
                onChange={(e) => setDeliveryStage(e.target.value)}
                className="w-full appearance-none bg-white dark:bg-[#141720] border border-gray-300 dark:border-slate-700 rounded-md py-2.5 pl-3.5 pr-8 text-xs sm:text-sm text-gray-800 dark:text-gray-100 outline-none focus:border-[#6366F1] dark:focus:border-[#818CF8] cursor-pointer transition-colors font-normal"
              >
                <option value="all" className="dark:bg-[#141720]">Livraison</option>
                <option value="ready" className="dark:bg-[#141720]">Clés en main</option>
                <option value="construction" className="dark:bg-[#141720]">En construction</option>
                <option value="off-plan" className="dark:bg-[#141720]">Vente sur plan (VEFA)</option>
              </select>
              <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-700 dark:text-gray-300">
                <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Dropdown 5: Developer */}
            <div className="relative min-w-[125px] sm:min-w-[135px] flex-1 sm:flex-initial">
              <select
                value={developer}
                onChange={(e) => setDeveloper(e.target.value)}
                className="w-full appearance-none bg-white dark:bg-[#141720] border border-gray-300 dark:border-slate-700 rounded-md py-2.5 pl-3.5 pr-8 text-xs sm:text-sm text-gray-800 dark:text-gray-100 outline-none focus:border-[#6366F1] dark:focus:border-[#818CF8] cursor-pointer transition-colors font-normal"
              >
                <option value="all" className="dark:bg-[#141720]">Promoteur</option>
                <option value="bessa" className="dark:bg-[#141720]">Bessa Promotion</option>
                <option value="hasnaoui" className="dark:bg-[#141720]">Groupe Hasnaoui</option>
                <option value="soummam" className="dark:bg-[#141720]">Eurl Soummam</option>
                <option value="promotech" className="dark:bg-[#141720]">Promotech Algérie</option>
              </select>
              <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-700 dark:text-gray-300">
                <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

        </div>

        {/* 2. Sub-Header: Title, Results Count & Sorting */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div className="flex items-baseline space-x-2">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              Projets Immobiliers Neufs
            </h1>
            <span className="text-xs text-gray-400">
              ({filteredGridProjects.length + 1} projets trouvés)
            </span>
          </div>

          {/* Sorting Dropdown */}
          <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-300 self-end sm:self-auto">
            <span className="text-gray-400">Trier:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent border-b border-gray-300 dark:border-slate-700 py-1 text-xs text-gray-800 dark:text-gray-200 font-medium outline-none cursor-pointer"
            >
              <option value="smart" className="dark:bg-[#1e293b]">Recommandés</option>
              <option value="newest" className="dark:bg-[#1e293b]">Récents</option>
              <option value="price-asc" className="dark:bg-[#1e293b]">Prix croissant</option>
              <option value="price-desc" className="dark:bg-[#1e293b]">Prix décroissant</option>
            </select>
          </div>
        </div>

        {/* 3. Top Full-Width Project Card */}
        <div className="bg-white dark:bg-[#1e293b] border border-gray-200/90 dark:border-slate-800 rounded-[2px] shadow-sm overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-shadow duration-200">
          <div className="flex-1 p-6 sm:p-8 lg:p-10 flex flex-col justify-between items-start min-h-[220px]">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
                {topFeaturedProject.title}
              </h2>
              <p className="text-[12px] sm:text-[12.5px] text-gray-500 dark:text-gray-400 leading-relaxed max-w-lg mb-6">
                {topFeaturedProject.description}
              </p>
            </div>
            <Link
              href="/projects/residence-les-pins"
              className="border border-[#E53935] text-[#E53935] hover:bg-red-50 dark:hover:bg-red-950/30 text-[11.5px] font-medium px-4 py-1.5 rounded-[3px] transition-colors"
            >
              Découvrir le Projet
            </Link>
          </div>
          <div className="w-full md:w-[48%] h-56 sm:h-64 md:h-auto min-h-[220px] bg-gray-100 dark:bg-slate-800 relative overflow-hidden">
            <img
              src={topFeaturedProject.image}
              alt={topFeaturedProject.title}
              className="w-full h-full object-cover object-center hover:scale-102 transition-transform duration-300"
              loading="lazy"
            />
          </div>
        </div>

        {/* 4. Two-Column Grid Project Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredGridProjects.map((project, index) => (
            <div
              key={project._id}
              className="bg-white dark:bg-[#1e293b] border border-gray-200/90 dark:border-slate-800 rounded-[2px] shadow-sm overflow-hidden flex flex-col sm:flex-row hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex-1 p-6 sm:p-7 flex flex-col justify-between items-start min-h-[200px]">
                <div>
                  <h3 className="text-base sm:text-[17px] font-bold text-gray-900 dark:text-white mb-2.5 tracking-tight">
                    {project.title}
                  </h3>
                  <p className="text-[11.5px] sm:text-[12px] text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
                    {project.description}
                  </p>
                </div>
                <Link
                  href={`/projects/project-${index + 1}`}
                  className="border border-[#E53935] text-[#E53935] hover:bg-red-50 dark:hover:bg-red-950/30 text-[11.5px] font-medium px-4 py-1.5 rounded-[3px] transition-colors"
                >
                  Découvrir le Projet
                </Link>
              </div>
              <div className="w-full sm:w-[44%] h-48 sm:h-auto min-h-[190px] bg-gray-100 dark:bg-slate-800 relative overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover object-center hover:scale-102 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>

        {/* 5. Pagination Component */}
        <div className="flex items-center justify-center space-x-1.5 pt-8 pb-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-7 h-7 flex items-center justify-center text-xs rounded-[2px] transition-colors ${
                currentPage === page
                  ? 'bg-[#E53935] text-white font-bold'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, 10))}
            className="px-2.5 h-7 flex items-center justify-center text-xs bg-white border border-gray-200 text-gray-700 rounded-[2px] hover:bg-gray-100 transition-colors"
          >
            Next
          </button>
        </div>

      </div>
    </div>
  );
}
