'use client';

import { useState, useEffect, useMemo } from 'react';
import PropertyCard from '@/components/PropertyCard';
import { getApiBase } from '@/utils/apiConfig';

const API_BASE = getApiBase();

// Sample mock rental properties localized to Algeria
const algerianRentLocations = [
  { commune: 'Hydra', wilaya: 'Alger', address: 'Val d’Hydra' },
  { commune: 'Sidi Yahia', wilaya: 'Alger', address: 'Résidence Sidi Yahia' },
  { commune: 'El Biar', wilaya: 'Alger', address: 'Boulevard Bougara' },
  { commune: 'Chéraga', wilaya: 'Alger', address: 'Djenane Achabou' },
  { commune: 'Kouba', wilaya: 'Alger', address: 'Vieux Kouba' },
  { commune: 'Akid Lotfi', wilaya: 'Oran', address: 'Boulevard Akid Lotfi' },
  { commune: 'Canastel', wilaya: 'Oran', address: 'Résidence Bel Horizon' },
  { commune: 'Bir El Djir', wilaya: 'Oran', address: 'Boulevard des Lions' },
  { commune: 'Ali Mendjeli', wilaya: 'Constantine', address: 'UV 13' },
  { commune: 'Sidi Mabrouk', wilaya: 'Constantine', address: 'Cité Universitaire' },
  { commune: 'Sidi Aissa', wilaya: 'Annaba', address: 'Résidence Mont d’Or' },
  { commune: 'Seraïdi', wilaya: 'Annaba', address: 'Route Principale' }
];

const rentalTypes = ['apartment', 'villa', 'duplex', 'commercial'];

const initialRentalProperties = Array.from({ length: 20 }, (_, index) => {
  const loc = algerianRentLocations[index % algerianRentLocations.length];
  const type = rentalTypes[index % rentalTypes.length];
  const priceBase = type === 'villa' ? 350000 : type === 'duplex' ? 220000 : type === 'commercial' ? 180000 : 90000;
  const price = priceBase + (index * 8000);
  const sqm = type === 'villa' ? 300 : type === 'duplex' ? 180 : type === 'commercial' ? 90 : 100 + (index * 5);
  const roomsCount = type === 'villa' ? 6 : type === 'duplex' ? 4 : type === 'commercial' ? 2 : (index % 3) + 2;

  return {
    _id: `rent-${index + 1}`,
    title: type === 'villa' ? `Villa Meublée Haut Standing à ${loc.commune}` : type === 'duplex' ? `Duplex Vue Mer F4 à ${loc.commune}` : type === 'commercial' ? `Bureaux / Local Professionnel à ${loc.commune}` : `Appartement F${roomsCount} Équipé à ${loc.commune}`,
    price: price,
    rentOrSale: 'rent',
    type: type,
    address: loc.address,
    commune: loc.commune,
    wilaya: loc.wilaya,
    city: loc.commune,
    date: '05 Novembre 2026',
    rooms: `${roomsCount} (F${roomsCount})`,
    baths: type === 'villa' ? 3 : 2,
    sqm: sqm,
    sqft: sqm,
    image: [
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80'
    ][index % 4]
  };
});

export default function ForRentPage() {
  const [propertyType, setPropertyType] = useState('all');
  const [location, setLocation] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [rooms, setRooms] = useState('all');
  const [area, setArea] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('price-asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [propertiesList, setPropertiesList] = useState(initialRentalProperties);

  useEffect(() => {
    async function loadProperties() {
      try {
        const res = await fetch(`${API_BASE}/api/properties?rentOrSale=rent`);
        if (res.ok) {
          const data = await res.json();
          if (data.data && Array.isArray(data.data) && data.data.length > 0) {
            const apiItems = data.data;
            const fallbackFiltered = initialRentalProperties.filter(
              (mock) => !apiItems.some((item) => item.title?.trim().toLowerCase() === mock.title?.trim().toLowerCase())
            );
            setPropertiesList([...apiItems, ...fallbackFiltered]);
          }
        }
      } catch (err) {
        // use fallback
      }
    }
    loadProperties();
  }, []);

  // Filter properties
  const filteredProperties = useMemo(() => {
    let result = propertiesList.filter((property) => {
      if (propertyType !== 'all' && property.type !== propertyType) return false;
      const propWilaya = (property.wilaya || property.city || '').toLowerCase();
      const propCommune = (property.commune || '').toLowerCase();
      if (location !== 'all' && propWilaya !== location.toLowerCase() && propCommune !== location.toLowerCase()) return false;
      
      if (priceRange !== 'all') {
        if (priceRange === '0-80k' && property.price >= 80000) return false;
        if (priceRange === '80k-200k' && (property.price < 80000 || property.price > 200000)) return false;
        if (priceRange === '200k+' && property.price <= 200000) return false;
      }

      if (area !== 'all') {
        const propSqm = property.sqm || property.sqft || 0;
        if (area === '50-100' && (propSqm < 50 || propSqm > 100)) return false;
        if (area === '100-150' && (propSqm < 100 || propSqm > 150)) return false;
        if (area === '150+' && propSqm <= 150) return false;
      }

      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesTitle = (property.title || '').toLowerCase().includes(query);
        const matchesCommune = (property.commune || '').toLowerCase().includes(query);
        const matchesWilaya = (property.wilaya || property.city || '').toLowerCase().includes(query);
        const matchesAddress = (property.address || '').toLowerCase().includes(query);
        if (!matchesTitle && !matchesCommune && !matchesWilaya && !matchesAddress) return false;
      }
      return true;
    });

    // Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [propertiesList, propertyType, location, priceRange, area, searchQuery, sortBy]);

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
              placeholder="Search by Wilaya, Commune or title..."
              className="w-full bg-white dark:bg-[#141720] border border-gray-300 dark:border-slate-700 rounded-md py-2.5 pl-10 pr-4 text-xs sm:text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:border-[#6366F1] dark:focus:border-[#818CF8] transition-colors"
            />
          </div>

          {/* Filter Dropdowns (Right) */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
            {/* Dropdown 1: Property Type */}
            <div className="relative min-w-[120px] sm:min-w-[130px] flex-1 sm:flex-initial">
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full appearance-none bg-white dark:bg-[#141720] border border-gray-300 dark:border-slate-700 rounded-md py-2.5 pl-3.5 pr-8 text-xs sm:text-sm text-gray-800 dark:text-gray-100 outline-none focus:border-[#6366F1] dark:focus:border-[#818CF8] cursor-pointer transition-colors font-normal"
              >
                <option value="all" className="dark:bg-[#141720]">Property Type</option>
                <option value="apartment" className="dark:bg-[#141720]">Appartement</option>
                <option value="villa" className="dark:bg-[#141720]">Villa</option>
                <option value="duplex" className="dark:bg-[#141720]">Duplex</option>
                <option value="commercial" className="dark:bg-[#141720]">Commercial</option>
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
                <option value="all" className="dark:bg-[#141720]">Prix / Mois (DZD)</option>
                <option value="0-80k" className="dark:bg-[#141720]">&lt; 80.000 DA</option>
                <option value="80k-200k" className="dark:bg-[#141720]">80.000 - 200.000 DA</option>
                <option value="200k+" className="dark:bg-[#141720]">&gt; 200.000 DA</option>
              </select>
              <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-700 dark:text-gray-300">
                <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Dropdown 4: Room */}
            <div className="relative min-w-[95px] sm:min-w-[105px] flex-1 sm:flex-initial">
              <select
                value={rooms}
                onChange={(e) => setRooms(e.target.value)}
                className="w-full appearance-none bg-white dark:bg-[#141720] border border-gray-300 dark:border-slate-700 rounded-md py-2.5 pl-3.5 pr-8 text-xs sm:text-sm text-gray-800 dark:text-gray-100 outline-none focus:border-[#6366F1] dark:focus:border-[#818CF8] cursor-pointer transition-colors font-normal"
              >
                <option value="all" className="dark:bg-[#141720]">Pièces</option>
                <option value="1" className="dark:bg-[#141720]">F1</option>
                <option value="2" className="dark:bg-[#141720]">F2</option>
                <option value="3" className="dark:bg-[#141720]">F3</option>
                <option value="4" className="dark:bg-[#141720]">F4</option>
                <option value="5" className="dark:bg-[#141720]">F5+</option>
              </select>
              <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-700 dark:text-gray-300">
                <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Dropdown 5: Area */}
            <div className="relative min-w-[110px] sm:min-w-[120px] flex-1 sm:flex-initial">
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full appearance-none bg-white dark:bg-[#141720] border border-gray-300 dark:border-slate-700 rounded-md py-2.5 pl-3.5 pr-8 text-xs sm:text-sm text-gray-800 dark:text-gray-100 outline-none focus:border-[#6366F1] dark:focus:border-[#818CF8] cursor-pointer transition-colors font-normal"
              >
                <option value="all" className="dark:bg-[#141720]">Superficie</option>
                <option value="50-100" className="dark:bg-[#141720]">50 - 100 m²</option>
                <option value="100-150" className="dark:bg-[#141720]">100 - 150 m²</option>
                <option value="150+" className="dark:bg-[#141720]">150+ m²</option>
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
              Locations Immobilières
            </h1>
            <span className="text-xs text-gray-400">
              ({filteredProperties.length} résultats)
            </span>
          </div>

          {/* Sorting Dropdown */}
          <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-300 self-end sm:self-auto">
            <span className="text-gray-400">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent border-b border-gray-300 dark:border-slate-700 py-1 text-xs text-gray-800 dark:text-gray-200 font-medium outline-none cursor-pointer"
            >
              <option value="price-asc" className="dark:bg-[#1e293b]">Price (Low to High)</option>
              <option value="price-desc" className="dark:bg-[#1e293b]">Price (High to Low)</option>
              <option value="newest" className="dark:bg-[#1e293b]">Newest Listed</option>
            </select>
          </div>
        </div>

        {/* 3. 20 Property Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredProperties.map((property) => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>

        {/* 4. Pagination Component */}
        <div className="flex items-center justify-center space-x-1.5 pt-8 pb-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-7 h-7 flex items-center justify-center text-xs rounded-[2px] transition-colors cursor-pointer ${
                currentPage === page
                  ? 'bg-[#E53935] text-white font-bold'
                  : 'bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, 10))}
            className="px-2.5 h-7 flex items-center justify-center text-xs bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-200 rounded-[2px] hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Next
          </button>
        </div>

      </div>
    </div>
  );
}
