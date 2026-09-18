'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Hero from '@/components/Hero';
import PropertyCard from '@/components/PropertyCard';
import MapBanner from '@/components/MapBanner';
import FeaturedProjects from '@/components/FeaturedProjects';
import SearchResultsSection from '@/components/SearchResultsSection';
import { getApiBase } from '@/utils/apiConfig';

const API_BASE = getApiBase();

// Initial Figma Mock Data
const figmaSalesProperties = [
  {
    _id: 'sale-1',
    title: 'Appartement Haut Standing F4',
    price: 38000000,
    rentOrSale: 'sale',
    type: 'apartment',
    address: 'Boulevard du 11 Décembre',
    commune: 'Hydra',
    wilaya: 'Alger',
    city: 'Hydra',
    date: '26 Novembre 2026',
    rooms: '4 (F4)',
    baths: 2,
    sqft: 145,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80'
  },
  {
    _id: 'sale-2',
    title: 'Villa Moderne avec Piscine',
    price: 65000000,
    rentOrSale: 'sale',
    type: 'villa',
    address: 'Front de Mer Canastel',
    commune: 'Canastel',
    wilaya: 'Oran',
    city: 'Canastel',
    date: '15 Octobre 2026',
    rooms: '5 (F5)',
    baths: 3,
    sqft: 260,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80'
  },
  {
    _id: 'sale-3',
    title: 'Duplex Vue Dégagée',
    price: 48000000,
    rentOrSale: 'sale',
    type: 'apartment',
    address: 'Rue Sidi Yahia',
    commune: 'Sidi Yahia',
    wilaya: 'Alger',
    city: 'Sidi Yahia',
    date: '18 Octobre 2026',
    rooms: '4 (F4)',
    baths: 2,
    sqft: 180,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80'
  },
  {
    _id: 'sale-4',
    title: 'Appartement F3 Résidence Clôturée',
    price: 26000000,
    rentOrSale: 'sale',
    type: 'apartment',
    address: 'Boulevard Akid Lotfi',
    commune: 'Akid Lotfi',
    wilaya: 'Oran',
    city: 'Akid Lotfi',
    date: '20 Octobre 2026',
    rooms: '3 (F3)',
    baths: 2,
    sqft: 125,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80'
  }
];

const figmaRentalProperties = [
  {
    _id: 'rent-1',
    title: 'Appartement Meublé F3 Haut Standing',
    price: 160000,
    rentOrSale: 'rent',
    type: 'apartment',
    address: 'Val d’Hydra',
    commune: 'Hydra',
    wilaya: 'Alger',
    city: 'Hydra',
    date: '15 Octobre 2026',
    rooms: '3 (F3)',
    baths: 2,
    sqft: 110,
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80'
  },
  {
    _id: 'rent-2',
    title: 'Bel F3 Moderne Équipé',
    price: 190000,
    rentOrSale: 'rent',
    type: 'apartment',
    address: 'Résidence Sidi Yahia',
    commune: 'Sidi Yahia',
    wilaya: 'Alger',
    city: 'Sidi Yahia',
    date: '30 Novembre 2026',
    rooms: '3 (F3)',
    baths: 2,
    sqft: 130,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80'
  },
  {
    _id: 'rent-3',
    title: 'Appartement F2 Proche Commodités',
    price: 75000,
    rentOrSale: 'rent',
    type: 'apartment',
    address: 'Boulevard Akid Lotfi',
    commune: 'Akid Lotfi',
    wilaya: 'Oran',
    city: 'Akid Lotfi',
    date: '14 Octobre 2026',
    rooms: '2 (F2)',
    baths: 1,
    sqft: 65,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80'
  },
  {
    _id: 'rent-4',
    title: 'Penthouse F4 Vue Panoramique',
    price: 220000,
    rentOrSale: 'rent',
    type: 'apartment',
    address: 'Boulevard des Lions',
    commune: 'Bir El Djir',
    wilaya: 'Oran',
    city: 'Bir El Djir',
    date: '01 Novembre 2026',
    rooms: '4 (F4)',
    baths: 2,
    sqft: 175,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80'
  }
];

const mockProjectsList = [
  {
    _id: 'proj-1',
    title: 'Résidence Les Pins - Val d’Hydra',
    description: 'Programme résidentiel haut de standing au cœur d’Alger avec finitions nobles et domotique intégrée.',
    location: 'Hydra, Alger',
    type: 'residential',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'
  },
  {
    _id: 'proj-2',
    title: 'Tours El Bahia Business & Living',
    description: 'Complexe immobilier d’exception à Oran combinant espaces bureaux premium et appartements de luxe.',
    location: 'Akid Lotfi, Oran',
    type: 'mixed',
    image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80'
  },
  {
    _id: 'proj-3',
    title: 'Résidence Bessa Horizon',
    description: 'Projet résidentiel moderne avec piscine, salle de sport privative et vue sur la baie d’Alger.',
    location: 'Chéraga, Alger',
    type: 'residential',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
  }
];

export default function Home() {
  // In-Place Search State
  const [searchState, setSearchState] = useState({
    hasSearched: false,
    isSearching: false,
    mode: 'rent',
    location: '',
    whenDate: null,
    filters: {},
    results: [],
    error: null
  });

  const [backendProperties, setBackendProperties] = useState([]);

  // Fetch initial properties from backend
  useEffect(() => {
    async function loadProperties() {
      try {
        const res = await fetch(`${API_BASE}/api/properties`);
        if (res.ok) {
          const data = await res.json();
          if (data.data && Array.isArray(data.data)) {
            setBackendProperties(data.data);
          }
        }
      } catch (err) {
        // Fallback to initial mock datasets
      }
    }
    loadProperties();
  }, []);

  // Handle Search Trigger from NewSearchSection
  const handleSearch = async ({ mode, location, whenDate, filters }) => {
    setSearchState((prev) => ({
      ...prev,
      hasSearched: true,
      isSearching: true,
      mode,
      location,
      whenDate,
      filters,
      error: null
    }));

    try {
      if (mode === 'projects') {
        // Project mode search logic
        const queryLoc = location ? location.toLowerCase().trim() : '';
        const filteredProjects = mockProjectsList.filter((proj) => {
          if (filters.projectType && filters.projectType !== 'all' && proj.type !== filters.projectType) {
            return false;
          }
          if (filters.status && filters.status !== 'all' && proj.status !== filters.status) {
            return false;
          }
          if (queryLoc) {
            const queryParts = queryLoc.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
            const projLoc = `${proj.location || ''} ${proj.city || ''} ${proj.wilaya || ''}`.toLowerCase();
            const matchesLoc = queryParts.some((part) => projLoc.includes(part));
            if (!matchesLoc) return false;
          }
          return true;
        });

        // Set matching project results
        setSearchState((prev) => ({
          ...prev,
          isSearching: false,
          results: filteredProjects
        }));
      } else {
        // Property mode search logic (Rent or Sell)
        const targetRentOrSale = mode === 'rent' ? 'rent' : 'sale';
        
        // Build query string
        const params = new URLSearchParams();
        params.append('rentOrSale', targetRentOrSale);
        if (location) params.append('location', location.split(',')[0].trim());
        if (filters.type && filters.type !== 'all') params.append('type', filters.type);
        if (filters.beds && filters.beds !== 'all') params.append('beds', filters.beds);
        if (filters.baths && filters.baths !== 'all') params.append('baths', filters.baths);
        if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);

        let liveResults = [];
        let fetchedFromBackend = false;

        try {
          const res = await fetch(`${API_BASE}/api/properties?${params.toString()}`);
          if (res.ok) {
            const json = await res.json();
            liveResults = json.data || [];
            fetchedFromBackend = true;
          }
        } catch (apiErr) {
          // Fallback to local filtering
        }

        // If backend returned results, use them, otherwise filter the local dataset
        if (!fetchedFromBackend) {
          const baseList = backendProperties.length > 0
            ? backendProperties.filter((p) => p.rentOrSale === targetRentOrSale)
            : (mode === 'rent' ? figmaRentalProperties : figmaSalesProperties);

          const locLower = location ? location.toLowerCase().trim() : '';

          liveResults = baseList.filter((item) => {
            if (locLower) {
              const queryParts = locLower.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
              const itemLoc = `${item.commune || ''} ${item.wilaya || ''} ${item.city || ''} ${item.address || ''}`.toLowerCase();
              const matchesLoc = queryParts.some((part) => itemLoc.includes(part));
              if (!matchesLoc) return false;
            }

            if (filters.type && filters.type !== 'all' && item.type !== filters.type) return false;
            if (filters.beds && filters.beds !== 'all' && Number(String(item.rooms || '').charAt(0) || 1) < Number(filters.beds)) return false;
            if (filters.baths && filters.baths !== 'all' && Number(item.baths || 1) < Number(filters.baths)) return false;
            if (filters.maxPrice && Number(item.price) > Number(filters.maxPrice)) return false;
            return true;
          });
        }

        setSearchState((prev) => ({
          ...prev,
          isSearching: false,
          results: liveResults
        }));
      }

      // Smoothly scroll down to results section
      setTimeout(() => {
        const el = document.getElementById('search-results-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);

    } catch (err) {
      setSearchState((prev) => ({
        ...prev,
        isSearching: false,
        error: 'Failed to retrieve search results. Please try again.'
      }));
    }
  };

  const handleResetSearch = () => {
    setSearchState({
      hasSearched: false,
      isSearching: false,
      mode: 'rent',
      location: '',
      whenDate: null,
      filters: {},
      results: [],
      error: null
    });
  };

  // Featured sections properties
  const salesProperties = backendProperties.filter((p) => p.rentOrSale === 'sale').length > 0
    ? backendProperties.filter((p) => p.rentOrSale === 'sale').slice(0, 4)
    : figmaSalesProperties;

  const rentalProperties = backendProperties.filter((p) => p.rentOrSale === 'rent').length > 0
    ? backendProperties.filter((p) => p.rentOrSale === 'rent').slice(0, 4)
    : figmaRentalProperties;

  return (
    <div className="w-full bg-[#FAFAFA] dark:bg-[#0f172a] transition-colors duration-200">
      
      {/* 1. Hero with Brand-New Multi-Mode Search Component */}
      <Hero onSearch={handleSearch} isSearching={searchState.isSearching} />

      {/* Main Page Container */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-12">
        
        {/* 2. In-Place Dynamic Search Results Section (Directly underneath search) */}
        <SearchResultsSection
          searchState={searchState}
          onResetSearch={handleResetSearch}
        />

        {/* 3. Featured Sales Section */}
        <section className="w-full">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
              Featured Sales
            </h2>
            <Link
              href="/for-sale"
              className="border border-gray-300 dark:border-slate-700 hover:border-gray-500 dark:hover:border-slate-500 rounded-[2px] px-3.5 py-0.5 text-xs text-gray-700 dark:text-gray-300 transition-colors"
            >
              All
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {salesProperties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        </section>

        {/* 4. Featured Rental Section */}
        <section className="w-full">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
              Featured Rental
            </h2>
            <Link
              href="/for-rent"
              className="border border-gray-300 dark:border-slate-700 hover:border-gray-500 dark:hover:border-slate-500 rounded-[2px] px-3.5 py-0.5 text-xs text-gray-700 dark:text-gray-300 transition-colors"
            >
              All
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {rentalProperties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        </section>

        {/* 5. Search On Map Discovery Banner */}
        <MapBanner />

        {/* 6. Featured Projects Section */}
        <FeaturedProjects />

      </div>
    </div>
  );
}