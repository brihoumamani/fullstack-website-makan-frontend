'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import LeafletMap with SSR disabled to prevent 'window is not defined' errors in Next.js
const LeafletMap = dynamic(() => import('./LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[300px] bg-[#e8ecf1] dark:bg-slate-900 rounded-[4px] flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 p-6 animate-pulse">
      <div className="w-10 h-10 mb-3 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-xs font-semibold">Chargement de la carte interactive (OpenStreetMap)...</p>
      <p className="text-[11px] text-gray-400 dark:text-gray-400 mt-1">Localisation des propriétés en Algérie</p>
    </div>
  )
});

export default function PropertyMap(props) {
  return <LeafletMap {...props} />;
}
