'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import SendMessageModal from '@/components/SendMessageModal';
import PropertyMap from '@/components/PropertyMap';

export default function ProjectDetailPage({ params }) {
  const images = [
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80'
  ];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [showPhone, setShowPhone] = useState(false);

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const companyName = 'Bessa Promotion Immobilière';
  const companyRole = 'Promoteur Immobilier Agréé';
  const companyPhone = '+213 (0) 21 60 12 34';
  const projectNumber = 'PR-DZ-2026';
  const projectTitle = 'Résidence Les Pins - Val d’Hydra';
  const projectLocation = 'Val d’Hydra, Alger';

  // Project map pin coordinates
  const projectMapData = useMemo(() => [
    {
      _id: 'proj-val-hydra',
      title: projectTitle,
      price: 28000000,
      rentOrSale: 'sale',
      type: 'apartment',
      address: projectLocation,
      commune: 'Hydra',
      wilaya: 'Alger',
      location: {
        type: 'Point',
        coordinates: [3.0418, 36.7441] // [lng, lat] - Hydra, Algiers
      },
      images: images
    }
  ], [images]);

  return (
    <div className="w-full bg-[#FAFAFA] dark:bg-[#0f172a] min-h-screen pb-16 transition-colors duration-200 relative">
      
      {/* 1. Full-Width Top Panoramic Banner Carousel */}
      <div className="relative w-full h-80 sm:h-96 md:h-[460px] bg-gray-900 overflow-hidden group">
        <img
          src={images[activeImageIndex]}
          alt="Project Skyline Panoramic View"
          className="w-full h-full object-cover opacity-90 transition-all duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none"></div>

        {/* Carousel Arrow Controls */}
        <button
          type="button"
          onClick={prevImage}
          aria-label="Previous photo"
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/75 hover:bg-white text-gray-900 flex items-center justify-center backdrop-blur-sm transition-all shadow-md cursor-pointer z-10"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          type="button"
          onClick={nextImage}
          aria-label="Next photo"
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/75 hover:bg-white text-gray-900 flex items-center justify-center backdrop-blur-sm transition-all shadow-md cursor-pointer z-10"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* 2. Key Specs Horizontal Ribbon */}
      <div className="w-full bg-white dark:bg-[#1e293b] border-b border-gray-200/90 dark:border-slate-800 shadow-xs py-4 mb-8">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs divide-y sm:divide-y-0 sm:divide-x divide-gray-100 dark:divide-slate-800">
          
          {/* Price Range */}
          <div className="flex flex-col items-center justify-center text-center p-2">
            <span className="text-gray-400 dark:text-gray-400 mb-0.5">Fourchette de Prix</span>
            <span className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">
              28.000.000 DA - 68.000.000 DA
            </span>
          </div>

          {/* Location */}
          <div className="flex flex-col items-center justify-center text-center p-2">
            <span className="text-gray-400 dark:text-gray-400 mb-0.5">Emplacement</span>
            <span className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-1">
              <span className="text-emerald-500">📍</span> Val d’Hydra, Alger
            </span>
          </div>

          {/* Number of Flats */}
          <div className="flex flex-col items-center justify-center text-center p-2">
            <span className="text-gray-400 dark:text-gray-400 mb-0.5">Nombre de Logements</span>
            <span className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-1">
              <span>🏢</span> 72 Logements F3/F4/F5
            </span>
          </div>

          {/* Delivery Date */}
          <div className="flex flex-col items-center justify-center text-center p-2">
            <span className="text-gray-400 dark:text-gray-400 mb-0.5">Date de Livraison</span>
            <span className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-1">
              <span className="text-emerald-500">📅</span> 30 Juin 2026
            </span>
          </div>

        </div>
      </div>

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* 3. Features & Building Company Sidebar Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Features Lists (Left 9 cols on desktop) */}
          <div className="lg:col-span-9 space-y-6">
            <div className="bg-white dark:bg-[#1e293b] border border-gray-200/90 dark:border-slate-800 rounded-[2px] shadow-sm p-6 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Interior Features */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-slate-800 pb-2">
                    Équipements Intérieurs & Finitions
                  </h3>
                  <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-xs text-gray-600 dark:text-gray-300">
                    <span className="flex items-center gap-1.5"><span className="text-gray-400">✓</span> Chauffage central individuel</span>
                    <span className="flex items-center gap-1.5"><span className="text-gray-400">✓</span> Climatisation centralisée</span>
                    <span className="flex items-center gap-1.5"><span className="text-gray-400">✓</span> Cuisine équipée moderne</span>
                    <span className="flex items-center gap-1.5"><span className="text-gray-400">✓</span> Bâche à eau individuelle</span>
                    <span className="flex items-center gap-1.5"><span className="text-gray-400">✓</span> Vidéophone IP couleur</span>
                    <span className="flex items-center gap-1.5"><span className="text-gray-400">✓</span> Double vitrage phonique</span>
                    <span className="flex items-center gap-1.5"><span className="text-gray-400">✓</span> Suite parentale dressing</span>
                    <span className="flex items-center gap-1.5"><span className="text-gray-400">✓</span> Volets roulants électriques</span>
                    <span className="flex items-center gap-1.5"><span className="text-gray-400">✓</span> Sanitaires importés</span>
                    <span className="flex items-center gap-1.5"><span className="text-gray-400">✓</span> Sol en porcelaine espagnole</span>
                    <span className="flex items-center gap-1.5"><span className="text-gray-400">✓</span> Portes blindées 1er choix</span>
                    <span className="flex items-center gap-1.5"><span className="text-gray-400">✓</span> Fibre optique (FTTH)</span>
                    <span className="flex items-center gap-1.5"><span className="text-gray-400">✓</span> Isolation thermo-acoustique</span>
                    <span className="flex items-center gap-1.5"><span className="text-gray-400">✓</span> Plafonds avec spots LED</span>
                    <span className="flex items-center gap-1.5"><span className="text-gray-400">✓</span> Balcons spacieux</span>
                    <span className="flex items-center gap-1.5"><span className="text-gray-400">✓</span> Domotique intelligente</span>
                  </div>
                </div>

                {/* External Features */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-slate-800 pb-2">
                    Commodités de la Résidence
                  </h3>
                  <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-xs text-gray-600 dark:text-gray-300">
                    <span className="flex items-center gap-1.5"><span className="text-gray-400">✓</span> Double ascenseur Otis</span>
                    <span className="flex items-center gap-1.5"><span className="text-gray-400">✓</span> Gardiennage 24h/24 & 7j/7</span>
                    <span className="flex items-center gap-1.5"><span className="text-gray-400">✓</span> Vidéosurveillance CCTV</span>
                    <span className="flex items-center gap-1.5"><span className="text-gray-400">✓</span> Parking privé en sous-sol</span>
                    <span className="flex items-center gap-1.5"><span className="text-gray-400">✓</span> Groupe électrogène de secours</span>
                    <span className="flex items-center gap-1.5"><span className="text-gray-400">✓</span> Grande bâche à eau collective</span>
                    <span className="flex items-center gap-1.5"><span className="text-gray-400">✓</span> Salle de sport privative</span>
                    <span className="flex items-center gap-1.5"><span className="text-gray-400">✓</span> Espaces verts & jardin</span>
                    <span className="flex items-center gap-1.5"><span className="text-gray-400">✓</span> Aire de jeux pour enfants</span>
                    <span className="flex items-center gap-1.5"><span className="text-gray-400">✓</span> Accès sécurisé par badge</span>
                    <span className="flex items-center gap-1.5"><span className="text-gray-400">✓</span> Local syndic de copropriété</span>
                    <span className="flex items-center gap-1.5"><span className="text-gray-400">✓</span> Commerces de proximité</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Location Map */}
            <div className="bg-white dark:bg-[#1e293b] border border-gray-200/90 dark:border-slate-800 rounded-[2px] shadow-sm p-6 sm:p-8">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2 border-b border-gray-100 dark:border-slate-800 pb-2">
                Localisation du Projet
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                📍 {projectLocation}
              </p>
              <div className="w-full h-72 rounded-[4px] overflow-hidden border border-gray-200 dark:border-slate-700 shadow-inner">
                <PropertyMap
                  properties={projectMapData}
                  singlePropertyMode={true}
                  height="100%"
                  width="100%"
                />
              </div>
            </div>
          </div>

          {/* Building Company Card (Right 3 cols on desktop) */}
          <div className="lg:col-span-3 bg-white dark:bg-[#1e293b] border border-gray-200/90 dark:border-slate-800 rounded-[2px] shadow-sm p-6 flex flex-col items-center text-center space-y-4">
            
            {/* Company Building Logo */}
            <div className="w-24 h-24 rounded-full bg-[#374151] flex items-center justify-center p-3 shadow-sm">
              <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none">
                <path d="M50 10L25 90H45L60 35L50 10Z" fill="#38BDF8" opacity="0.9" />
                <path d="M55 25L42 90H62L75 45L55 25Z" fill="#818CF8" opacity="0.8" />
                <path d="M65 40L55 90H75L85 60L65 40Z" fill="#2DD4BF" opacity="0.7" />
              </svg>
            </div>

            {/* Company Info */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                {companyName}
              </h3>
              <p className="text-xs text-gray-400 dark:text-gray-400 mt-0.5">
                {companyRole}
              </p>
            </div>

            {/* Contact Action Buttons */}
            <div className="w-full space-y-2.5 pt-2">
              {/* 1. VIEW PHONE Button */}
              <button
                type="button"
                onClick={() => setShowPhone(!showPhone)}
                className="w-full bg-[#66BB6A] hover:bg-[#57a95b] text-white py-2 px-4 rounded-[2px] text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21c1.12.45 2.33.69 3.48.69a1 1 0 011 1v3.5a1 1 0 01-1 1A17.91 17.91 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.15.24 2.36.69 3.48a1 1 0 01-.21 1.11l-2.2 2.2z"/>
                </svg>
                <span>{showPhone ? companyPhone : 'VIEW PHONE'}</span>
              </button>

              {/* 2. SEND MESSAGE Button */}
              <button
                type="button"
                onClick={() => setIsMessageModalOpen(true)}
                className="w-full border border-[#9FA8DA] dark:border-indigo-800/80 bg-[#E8EAF6]/40 dark:bg-indigo-950/30 hover:bg-[#E8EAF6] text-[#5C6BC0] dark:text-[#9FA8DA] py-2 px-4 rounded-[2px] text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                <span>SEND MESSAGE</span>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Floating Bottom-Right Phone Badge */}
      {showPhone && (
        <div className="fixed bottom-5 right-5 z-40 bg-[#66BB6A] text-white px-4 py-2.5 rounded-full shadow-2xl flex items-center space-x-2 text-xs font-bold animate-in slide-in-from-bottom-3 duration-200">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21c1.12.45 2.33.69 3.48.69a1 1 0 011 1v3.5a1 1 0 01-1 1A17.91 17.91 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.15.24 2.36.69 3.48a1 1 0 01-.21 1.11l-2.2 2.2z"/>
          </svg>
          <span>{companyPhone}</span>
        </div>
      )}

      {/* Send Message to Building Company Modal */}
      <SendMessageModal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        agentName={companyName}
        agentRole={companyRole}
        agentAvatar="https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=300&q=80"
        advertNo={projectNumber}
      />

    </div>
  );
}
