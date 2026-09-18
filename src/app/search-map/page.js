'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import PropertyMap from '@/components/PropertyMap';
import { getApiBase } from '@/utils/apiConfig';

const API_BASE = getApiBase();

// Fallback Algerian properties with accurate GeoJSON coordinates
const fallbackProperties = [
  {
    _id: 'prop-hydra-1',
    title: 'Appartement Haut Standing F4 à Hydra',
    price: 42000000,
    rentOrSale: 'sale',
    type: 'apartment',
    address: '14 Boulevard du 11 Décembre 1960, Val d’Hydra',
    commune: 'Hydra',
    wilaya: 'Alger',
    city: 'Hydra',
    beds: 4,
    baths: 2,
    sqm: 145,
    location: {
      type: 'Point',
      coordinates: [3.0418, 36.7441] // [lng, lat] - Hydra, Algiers
    },
    images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80']
  },
  {
    _id: 'prop-canastel-2',
    title: 'Villa Contemporaine Vue sur Mer - Canastel',
    price: 350000,
    rentOrSale: 'rent',
    type: 'villa',
    address: '28 Rue des Palmiers, Canastel',
    commune: 'Canastel',
    wilaya: 'Oran',
    city: 'Canastel',
    beds: 5,
    baths: 4,
    sqm: 380,
    location: {
      type: 'Point',
      coordinates: [-0.5645, 35.7335] // [lng, lat] - Canastel, Oran
    },
    images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80']
  },
  {
    _id: 'prop-akid-3',
    title: 'Bel Appartement Moderne - Akid Lotfi',
    price: 21000000,
    rentOrSale: 'sale',
    type: 'apartment',
    address: 'Résidence El Bahia, Boulevard Millénium, Akid Lotfi',
    commune: 'Akid Lotfi',
    wilaya: 'Oran',
    city: 'Akid Lotfi',
    beds: 3,
    baths: 2,
    sqm: 125,
    location: {
      type: 'Point',
      coordinates: [-0.5892, 35.7088] // [lng, lat] - Akid Lotfi, Oran
    },
    images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80']
  },
  {
    _id: 'prop-sidi-yahia-4',
    title: 'Studio Cosy Meublé - Sidi Yahia',
    price: 12000,
    rentOrSale: 'daily_rental',
    type: 'apartment',
    address: 'Résidence Les Pins, Rue Sidi Yahia',
    commune: 'Sidi Yahia',
    wilaya: 'Alger',
    city: 'Sidi Yahia',
    beds: 1,
    baths: 1,
    sqm: 55,
    location: {
      type: 'Point',
      coordinates: [3.0335, 36.7382] // [lng, lat] - Sidi Yahia, Algiers
    },
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80']
  },
  {
    _id: 'prop-elbiar-5',
    title: 'Duplex Lumineux F4 avec Vue Dégagée - El Biar',
    price: 48000000,
    rentOrSale: 'sale',
    type: 'apartment',
    address: 'Avenue Ali Khodja, El Biar',
    commune: 'El Biar',
    wilaya: 'Alger',
    city: 'El Biar',
    beds: 4,
    baths: 2,
    sqm: 180,
    location: {
      type: 'Point',
      coordinates: [3.0315, 36.7695] // [lng, lat] - El Biar, Algiers
    },
    images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80']
  },
  {
    _id: 'prop-cheraga-6',
    title: 'Appartement F3 Résidence Bessa - Chéraga',
    price: 28000000,
    rentOrSale: 'sale',
    type: 'apartment',
    address: 'Route de Bouchaoui, Chéraga',
    commune: 'Chéraga',
    wilaya: 'Alger',
    city: 'Chéraga',
    beds: 3,
    baths: 1,
    sqm: 110,
    location: {
      type: 'Point',
      coordinates: [2.9567, 36.7681] // [lng, lat] - Chéraga, Algiers
    },
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80']
  }
];

export default function SearchOnMapPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [province, setProvince] = useState('All');
  const [housing, setHousing] = useState('All');
  const [priceRange, setPriceRange] = useState('All');
  const [rooms, setRooms] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // POI Layer Toggles
  const [pois, setPois] = useState({
    transportation: true,
    schools: true,
    health: true,
    restaurants: true,
    markets: true
  });

  const togglePoi = (key) => {
    setPois((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Fetch real property data from Database via Express API
  useEffect(() => {
    async function fetchProperties() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/api/properties`);
        if (res.ok) {
          const data = await res.json();
          if (data.data && Array.isArray(data.data) && data.data.length > 0) {
            setProperties(data.data);
            return;
          }
        }
        // If empty or offline, use fallback properties with real Algerian coordinates
        setProperties(fallbackProperties);
      } catch (err) {
        console.warn('Could not fetch from backend, using localized database fallback:', err.message);
        setProperties(fallbackProperties);
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, []);

  // Filter properties based on active UI filters
  const filteredProperties = useMemo(() => {
    return properties.filter((item) => {
      // Wilaya filter
      if (province !== 'All') {
        const wilaya = (item.wilaya || item.city || '').toLowerCase();
        if (!wilaya.includes(province.toLowerCase())) return false;
      }

      // Housing type filter
      if (housing !== 'All') {
        const itemType = (item.type || '').toLowerCase();
        if (itemType !== housing.toLowerCase()) return false;
      }

      // Rooms filter
      if (rooms !== 'All') {
        const beds = Number(item.beds);
        if (rooms === '5' && beds < 5) return false;
        if (rooms !== '5' && beds !== Number(rooms)) return false;
      }

      // Search keyword filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const title = (item.title || '').toLowerCase();
        const address = (item.address || '').toLowerCase();
        const commune = (item.commune || '').toLowerCase();
        const wilaya = (item.wilaya || '').toLowerCase();
        if (
          !title.includes(query) &&
          !address.includes(query) &&
          !commune.includes(query) &&
          !wilaya.includes(query)
        ) {
          return false;
        }
      }

      return true;
    });
  }, [properties, province, housing, priceRange, rooms, searchQuery]);

  return (
    <div className="w-full bg-[#FAFAFA] dark:bg-[#0f172a] flex flex-col transition-colors duration-200">
      
      {/* 1. Top Filter Bar */}
      <div className="max-w-[1240px] w-full mx-auto px-4 pt-4 pb-3">
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
              placeholder="Rechercher par Wilaya, Commune ou mot-clé..."
              className="w-full bg-white dark:bg-[#141720] border border-gray-300 dark:border-slate-700 rounded-md py-2.5 pl-10 pr-4 text-xs sm:text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:border-[#6366F1] dark:focus:border-[#818CF8] transition-colors"
            />
          </div>

          {/* Filter Dropdowns (Right) */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
            {/* Dropdown 1: Wilaya */}
            <div className="relative min-w-[110px] sm:min-w-[120px] flex-1 sm:flex-initial">
              <select
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full appearance-none bg-white dark:bg-[#141720] border border-gray-300 dark:border-slate-700 rounded-md py-2.5 pl-3.5 pr-8 text-xs sm:text-sm text-gray-800 dark:text-gray-100 outline-none focus:border-[#6366F1] dark:focus:border-[#818CF8] cursor-pointer transition-colors font-normal"
              >
                <option value="All" className="dark:bg-[#141720]">Toutes Wilayas</option>
                <option value="Alger" className="dark:bg-[#141720]">Alger</option>
                <option value="Oran" className="dark:bg-[#141720]">Oran</option>
                <option value="Constantine" className="dark:bg-[#141720]">Constantine</option>
                <option value="Annaba" className="dark:bg-[#141720]">Annaba</option>
              </select>
              <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-700 dark:text-gray-300">
                <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Dropdown 2: Housing */}
            <div className="relative min-w-[110px] sm:min-w-[120px] flex-1 sm:flex-initial">
              <select
                value={housing}
                onChange={(e) => setHousing(e.target.value)}
                className="w-full appearance-none bg-white dark:bg-[#141720] border border-gray-300 dark:border-slate-700 rounded-md py-2.5 pl-3.5 pr-8 text-xs sm:text-sm text-gray-800 dark:text-gray-100 outline-none focus:border-[#6366F1] dark:focus:border-[#818CF8] cursor-pointer transition-colors font-normal"
              >
                <option value="All" className="dark:bg-[#141720]">Type de bien</option>
                <option value="apartment" className="dark:bg-[#141720]">Appartement</option>
                <option value="villa" className="dark:bg-[#141720]">Villa</option>
                <option value="commercial" className="dark:bg-[#141720]">Local Commercial</option>
              </select>
              <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-700 dark:text-gray-300">
                <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Dropdown 3: Rooms */}
            <div className="relative min-w-[110px] sm:min-w-[125px] flex-1 sm:flex-initial">
              <select
                value={rooms}
                onChange={(e) => setRooms(e.target.value)}
                className="w-full appearance-none bg-white dark:bg-[#141720] border border-gray-300 dark:border-slate-700 rounded-md py-2.5 pl-3.5 pr-8 text-xs sm:text-sm text-gray-800 dark:text-gray-100 outline-none focus:border-[#6366F1] dark:focus:border-[#818CF8] cursor-pointer transition-colors font-normal"
              >
                <option value="All" className="dark:bg-[#141720]">Pièces</option>
                <option value="1" className="dark:bg-[#141720]">F1 (1 pièce)</option>
                <option value="2" className="dark:bg-[#141720]">F2 (2 pièces)</option>
                <option value="3" className="dark:bg-[#141720]">F3 (3 pièces)</option>
                <option value="4" className="dark:bg-[#141720]">F4 (4 pièces)</option>
                <option value="5" className="dark:bg-[#141720]">F5+ (5+ pièces)</option>
              </select>
              <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-700 dark:text-gray-300">
                <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Interactive Leaflet OpenStreetMap Canvas */}
      <div className="max-w-[1240px] w-full mx-auto px-4 pb-8">
        <div className="relative w-full h-[620px] rounded-[4px] overflow-hidden border border-gray-300 dark:border-slate-800 shadow-sm bg-[#e8ecf1] dark:bg-slate-900">
          
          {/* Real Leaflet Map */}
          <PropertyMap
            properties={filteredProperties}
            pois={pois}
            height="100%"
            width="100%"
          />

          {/* 3. Top Ribbon Controls (POI & Back) */}
          <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-20 pointer-events-auto">
            
            {/* Turn Back Button */}
            <Link
              href="/"
              className="bg-[#3F51B5] hover:bg-[#303F9F] text-white text-[11px] font-medium px-3 py-1.5 rounded-[2px] flex items-center gap-1 shadow-xs transition-colors"
            >
              <span>❮</span>
              <span>Retour</span>
            </Link>

            {/* Transportation */}
            <button
              type="button"
              onClick={() => togglePoi('transportation')}
              className={`bg-white/95 dark:bg-[#1e293b]/95 hover:bg-white dark:hover:bg-[#1e293b] text-gray-700 dark:text-gray-200 text-[11px] px-2.5 py-1.5 rounded-[2px] flex items-center gap-1.5 shadow-xs border border-gray-200/80 dark:border-slate-700 transition-colors cursor-pointer ${
                pois.transportation ? 'border-green-500 dark:border-green-500 font-semibold' : 'opacity-70'
              }`}
            >
              <span className="text-green-600 text-xs">🚆</span>
              <span>Transports / Métro</span>
            </button>

            {/* Schools */}
            <button
              type="button"
              onClick={() => togglePoi('schools')}
              className={`bg-white/95 dark:bg-[#1e293b]/95 hover:bg-white dark:hover:bg-[#1e293b] text-gray-700 dark:text-gray-200 text-[11px] px-2.5 py-1.5 rounded-[2px] flex items-center gap-1.5 shadow-xs border border-gray-200/80 dark:border-slate-700 transition-colors cursor-pointer ${
                pois.schools ? 'border-amber-500 dark:border-amber-500 font-semibold' : 'opacity-70'
              }`}
            >
              <span className="text-amber-500 text-xs">🎓</span>
              <span>Écoles & Universités</span>
            </button>

            {/* Health Institutions */}
            <button
              type="button"
              onClick={() => togglePoi('health')}
              className={`bg-white/95 dark:bg-[#1e293b]/95 hover:bg-white dark:hover:bg-[#1e293b] text-gray-700 dark:text-gray-200 text-[11px] px-2.5 py-1.5 rounded-[2px] flex items-center gap-1.5 shadow-xs border border-gray-200/80 dark:border-slate-700 transition-colors cursor-pointer ${
                pois.health ? 'border-red-500 dark:border-red-500 font-semibold' : 'opacity-70'
              }`}
            >
              <span className="text-red-500 text-xs">🏥</span>
              <span>Santé & Hôpitaux</span>
            </button>

            {/* Cafe / Restaurants */}
            <button
              type="button"
              onClick={() => togglePoi('restaurants')}
              className={`bg-white/95 dark:bg-[#1e293b]/95 hover:bg-white dark:hover:bg-[#1e293b] text-gray-700 dark:text-gray-200 text-[11px] px-2.5 py-1.5 rounded-[2px] flex items-center gap-1.5 shadow-xs border border-gray-200/80 dark:border-slate-700 transition-colors cursor-pointer ${
                pois.restaurants ? 'border-indigo-500 dark:border-indigo-500 font-semibold' : 'opacity-70'
              }`}
            >
              <span className="text-indigo-500 text-xs">☕</span>
              <span>Cafés & Restaurants</span>
            </button>

            {/* Markets */}
            <button
              type="button"
              onClick={() => togglePoi('markets')}
              className={`bg-white/95 dark:bg-[#1e293b]/95 hover:bg-white dark:hover:bg-[#1e293b] text-gray-700 dark:text-gray-200 text-[11px] px-2.5 py-1.5 rounded-[2px] flex items-center gap-1.5 shadow-xs border border-gray-200/80 dark:border-slate-700 transition-colors cursor-pointer ${
                pois.markets ? 'border-sky-500 dark:border-sky-500 font-semibold' : 'opacity-70'
              }`}
            >
              <span className="text-sky-500 text-xs">🛒</span>
              <span>Supermarchés & Malls</span>
            </button>

          </div>

          {/* Results Counter Badge (Bottom Left) */}
          <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs px-3 py-1.5 rounded-[2px] shadow-sm border border-gray-200 dark:border-slate-700 text-xs font-semibold text-gray-800 dark:text-gray-200 z-20 pointer-events-none">
            📍 {filteredProperties.length} {filteredProperties.length === 1 ? 'propriété trouvée' : 'propriétés trouvées'}
          </div>

        </div>
      </div>

    </div>
  );
}
