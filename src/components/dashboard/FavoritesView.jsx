'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

// Helper to verify if favorites are already populated objects
const getPopulatedFavorites = (list) => {
  if (!Array.isArray(list)) return [];
  return list.filter((item) => item && typeof item === 'object' && (item._id || item.id));
};

export default function FavoritesView({ apiBase }) {
  const { user, toggleFavorite } = useAuth();
  
  // Only use user.favorites initially if they are already populated objects
  const initialPopulated = getPopulatedFavorites(user?.favorites);
  const [favorites, setFavorites] = useState(initialPopulated);
  const [loading, setLoading] = useState(initialPopulated.length === 0);
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    const base = apiBase || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    try {
      setLoading(true);
      const res = await fetch(`${base}/api/dashboard/favorites`, {
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.favorites)) {
        const validItems = getPopulatedFavorites(data.favorites);
        setFavorites(validItems);
      } else if (user?.favorites) {
        setFavorites(getPopulatedFavorites(user.favorites));
      }
    } catch (err) {
      console.warn('Could not fetch favorites from backend (backend may be offline):', err.message);
      if (user?.favorites) {
        setFavorites(getPopulatedFavorites(user.favorites));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (propertyId, e) => {
    if (!propertyId) return;
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await toggleFavorite(propertyId);
      if (res.success) {
        setFavorites((prev) => prev.filter((p) => (p._id || p.id) !== propertyId));
        setActionMessage('Bien retiré de vos favoris');
        setTimeout(() => setActionMessage(''), 3000);
      }
    } catch (err) {
      console.warn('Error toggling favorite:', err.message);
    }
  };

  const formatPrice = (price) => {
    if (!price) return 'Prix sur demande';
    return price.toLocaleString('fr-DZ') + ' DZD';
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Metric */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white tracking-tight">
              Biens Favoris
            </h1>
            <span className="text-xs font-semibold bg-red-100 dark:bg-red-950/60 text-[#E53935] px-2 py-0.5 rounded-full">
              {favorites.length}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Vos annonces sauvegardées et biens immobiliers coups de cœur
          </p>
        </div>

        <Link
          href="/for-sale"
          className="inline-flex items-center space-x-1 text-xs font-semibold text-[#E53935] hover:text-[#d32f2f] transition-colors"
        >
          <span>Explorer d’autres annonces</span>
          <span>➔</span>
        </Link>
      </div>

      {/* Action Message Banner */}
      {actionMessage && (
        <div className="p-3 bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-900/60 text-green-700 dark:text-green-300 rounded text-xs flex items-center justify-between">
          <span>✓ {actionMessage}</span>
          <button onClick={() => setActionMessage('')} className="font-bold">✕</button>
        </div>
      )}

      {/* Content Area */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white dark:bg-[#1e293b] rounded border border-gray-100 dark:border-slate-800 p-4 space-y-3 animate-pulse">
              <div className="h-44 bg-gray-200 dark:bg-slate-700 rounded"></div>
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : favorites.length === 0 ? (
        <div className="bg-white dark:bg-[#1e293b] border border-gray-100 dark:border-slate-800 rounded-lg p-10 text-center space-y-4 shadow-2xs">
          <div className="w-14 h-14 mx-auto rounded-full bg-red-50 dark:bg-red-950/40 text-[#E53935] flex items-center justify-center text-2xl">
            ❤️
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-800 dark:text-white">Aucun bien favori enregistré</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm mx-auto">
              Parcourez les annonces immobilières en Algérie et cliquez sur l'icône cœur pour enregistrer vos biens préférés.
            </p>
          </div>
          <Link
            href="/for-sale"
            className="inline-block bg-[#E53935] hover:bg-[#d32f2f] text-white text-xs font-semibold px-6 py-2.5 rounded transition-all shadow-xs"
          >
            Découvrir les annonces
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {favorites.map((prop, index) => {
            const propId = prop?._id || prop?.id || `fav-item-${index}`;
            return (
              <div
                key={propId}
                className="bg-white dark:bg-[#1e293b] border border-gray-100 dark:border-slate-800 rounded-lg overflow-hidden shadow-2xs hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div>
                  {/* Photo & Badge */}
                  <div className="relative h-44 w-full bg-gray-100 dark:bg-slate-800 overflow-hidden">
                    <img
                      src={prop.images && prop.images[0] ? prop.images[0] : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'}
                      alt={prop.title || 'Propriété'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded capitalize">
                      {prop.rentOrSale === 'sale' ? 'Vente' : prop.rentOrSale === 'rent' ? 'Location' : 'Location Jour'}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleRemoveFavorite(propId, e)}
                      className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 dark:bg-slate-800/90 text-[#E53935] hover:bg-white flex items-center justify-center shadow-xs transition-transform hover:scale-110 cursor-pointer"
                      title="Retirer des favoris"
                    >
                      ❤️
                    </button>
                  </div>

                  {/* Body Details */}
                  <div className="p-4 space-y-2">
                    <div className="text-sm font-bold text-[#E53935] tracking-tight">
                      {formatPrice(prop.price)}
                    </div>
                    <h3 className="text-xs font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-[#E53935] transition-colors">
                      {prop.title || 'Bien Immobilier'}
                    </h3>
                    <div className="flex items-center text-[11px] text-gray-500 dark:text-gray-400">
                      <span className="mr-1">📍</span>
                      <span className="truncate">{prop.commune || 'Centre'}, {prop.wilaya || 'Alger'}</span>
                    </div>

                    {/* Specs */}
                    <div className="flex items-center gap-3 pt-2 text-[11px] text-gray-600 dark:text-gray-300 border-t border-gray-50 dark:border-slate-800/80">
                      <span className="flex items-center gap-1 font-medium">🛏️ {prop.beds || 3} Chambres</span>
                      <span className="flex items-center gap-1 font-medium">🚿 {prop.baths || 1} SDB</span>
                      <span className="flex items-center gap-1 font-medium">📐 {prop.sqm || prop.sqft || 120} m²</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-4 pt-0 flex items-center gap-2">
                  <Link
                    href={
                      prop.rentOrSale === 'daily_rental' || prop.rentOrSale === 'daily'
                        ? `/daily-rental/${propId}`
                        : prop.rentOrSale === 'rent'
                        ? `/for-rent/${propId}`
                        : `/for-sale/${propId}`
                    }
                    className="flex-1 text-center bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-800 dark:text-gray-200 text-xs font-semibold py-2 rounded transition-colors"
                  >
                    Voir Détails
                  </Link>
                  {prop.agentId?.phone && (
                    <a
                      href={`tel:${prop.agentId.phone}`}
                      className="bg-[#E53935] hover:bg-[#d32f2f] text-white p-2 rounded text-xs transition-colors flex items-center justify-center"
                      title={`Appeler : ${prop.agentId.phone}`}
                    >
                      📞
                    </a>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
