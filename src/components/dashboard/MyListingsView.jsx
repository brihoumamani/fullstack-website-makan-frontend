'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import EditPropertyModal from './EditPropertyModal';

export default function MyListingsView({ apiBase, onAddClick }) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all' | 'available' | 'sold' | 'rented'
  const [actionMessage, setActionMessage] = useState('');
  const [editingProperty, setEditingProperty] = useState(null);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    const base = apiBase || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    try {
      setLoading(true);
      const res = await fetch(`${base}/api/dashboard/listings`, {
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setListings(data.listings || []);
      }
    } catch (err) {
      console.warn('Could not fetch listings (backend may be starting or offline):', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    const base = apiBase || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    try {
      const res = await fetch(`${base}/api/dashboard/properties/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setListings((prev) =>
          prev.map((item) => (item._id === id ? { ...item, status: newStatus } : item))
        );
        setActionMessage(`Statut mis à jour : ${newStatus}`);
        setTimeout(() => setActionMessage(''), 3000);
      }
    } catch (err) {
      console.warn('Error updating status:', err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) return;
    const base = apiBase || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    try {
      const res = await fetch(`${base}/api/dashboard/properties/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setListings((prev) => prev.filter((item) => item._id !== id));
        setActionMessage('Annonce supprimée avec succès');
        setTimeout(() => setActionMessage(''), 3000);
      }
    } catch (err) {
      console.warn('Error deleting listing:', err.message);
    }
  };

  const filteredListings = listings.filter((item) => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  const availableCount = listings.filter((l) => l.status === 'available').length;
  const soldRentedCount = listings.filter((l) => l.status === 'sold' || l.status === 'rented').length;

  return (
    <div className="space-y-6">
      
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white tracking-tight">
            Gestion de mes Annonces
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Gérez vos biens en ligne, modifiez leurs statuts et suivez leur visibilité.
          </p>
        </div>

        <button
          type="button"
          onClick={onAddClick}
          className="bg-[#E53935] hover:bg-[#d32f2f] text-white text-xs font-bold px-4 py-2 rounded transition-all shadow-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <span>➕</span>
          <span>Ajouter une Annonce</span>
        </button>
      </div>

      {/* Action Banner */}
      {actionMessage && (
        <div className="p-3 bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-900/60 text-green-700 dark:text-green-300 rounded text-xs flex items-center justify-between">
          <span>✓ {actionMessage}</span>
          <button onClick={() => setActionMessage('')} className="font-bold">✕</button>
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-[#1e293b] border border-gray-100 dark:border-slate-800 rounded-lg p-4 shadow-2xs space-y-1">
          <span className="text-[11px] text-gray-500 dark:text-gray-400">Total Annonces</span>
          <div className="text-lg font-extrabold text-gray-900 dark:text-white">{listings.length}</div>
        </div>

        <div className="bg-white dark:bg-[#1e293b] border border-gray-100 dark:border-slate-800 rounded-lg p-4 shadow-2xs space-y-1">
          <span className="text-[11px] text-gray-500 dark:text-gray-400">Disponibles</span>
          <div className="text-lg font-extrabold text-green-600 dark:text-green-400">{availableCount}</div>
        </div>

        <div className="bg-white dark:bg-[#1e293b] border border-gray-100 dark:border-slate-800 rounded-lg p-4 shadow-2xs space-y-1">
          <span className="text-[11px] text-gray-500 dark:text-gray-400">Vendus / Loués</span>
          <div className="text-lg font-extrabold text-amber-600 dark:text-amber-400">{soldRentedCount}</div>
        </div>

        <div className="bg-white dark:bg-[#1e293b] border border-gray-100 dark:border-slate-800 rounded-lg p-4 shadow-2xs space-y-1">
          <span className="text-[11px] text-gray-500 dark:text-gray-400">Vues Estimées</span>
          <div className="text-lg font-extrabold text-blue-600 dark:text-blue-400">{listings.length * 168 + 42}</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-[4px] self-start w-fit text-xs font-semibold">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
            filter === 'all' ? 'bg-white dark:bg-[#1e293b] text-gray-900 dark:text-white shadow-2xs' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Toutes ({listings.length})
        </button>
        <button
          onClick={() => setFilter('available')}
          className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
            filter === 'available' ? 'bg-white dark:bg-[#1e293b] text-green-600 dark:text-green-400 shadow-2xs' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Disponibles ({availableCount})
        </button>
        <button
          onClick={() => setFilter('sold')}
          className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
            filter === 'sold' ? 'bg-white dark:bg-[#1e293b] text-gray-900 dark:text-white shadow-2xs' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Vendus
        </button>
        <button
          onClick={() => setFilter('rented')}
          className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
            filter === 'rented' ? 'bg-white dark:bg-[#1e293b] text-gray-900 dark:text-white shadow-2xs' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Loués
        </button>
      </div>

      {/* Listings Table / Cards */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-24 bg-white dark:bg-[#1e293b] rounded border border-gray-100 dark:border-slate-800 animate-pulse"></div>
          ))}
        </div>
      ) : filteredListings.length === 0 ? (
        <div className="bg-white dark:bg-[#1e293b] border border-gray-100 dark:border-slate-800 rounded-lg p-10 text-center space-y-4">
          <span className="text-3xl">🏠</span>
          <h3 className="text-xs font-bold text-gray-900 dark:text-white">Aucune annonce trouvée dans cette catégorie</h3>
          <p className="text-xs text-gray-500">Commencez par publier votre premier bien immobilier sur Makan.</p>
          <button
            type="button"
            onClick={onAddClick}
            className="bg-[#E53935] hover:bg-[#d32f2f] text-white text-xs font-bold px-6 py-2 rounded transition-colors"
          >
            Ajouter un bien maintenant
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#1e293b] border border-gray-100 dark:border-slate-800 rounded-lg overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 dark:bg-slate-800/80 text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-slate-800 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3">Bien / Annonce</th>
                  <th className="px-4 py-3">Localisation</th>
                  <th className="px-4 py-3">Prix</th>
                  <th className="px-4 py-3">Statut</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                {filteredListings.map((item, idx) => (
                  <tr key={item._id || item.id || `listing-${idx}`} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    
                    {/* Property info */}
                    <td className="px-4 py-3.5 flex items-center space-x-3">
                      <img
                        src={item.images && item.images[0] ? item.images[0] : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=200&q=80'}
                        alt={item.title}
                        className="w-12 h-12 rounded object-cover shrink-0 border border-gray-200 dark:border-slate-700"
                      />
                      <div className="space-y-0.5">
                        <Link
                          href={`/for-sale/${item._id}`}
                          className="font-bold text-gray-900 dark:text-white hover:text-[#E53935] line-clamp-1"
                        >
                          {item.title}
                        </Link>
                        <span className="text-[10px] text-gray-400 uppercase font-semibold">
                          {item.type} • {item.rentOrSale === 'sale' ? 'Vente' : 'Location'}
                        </span>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="px-4 py-3.5 text-gray-600 dark:text-gray-300">
                      <span>{item.commune || 'Centre'}, {item.wilaya || 'Alger'}</span>
                    </td>

                    {/* Price */}
                    <td className="px-4 py-3.5 font-bold text-[#E53935]">
                      {item.price ? item.price.toLocaleString('fr-DZ') : '0'} DZD
                    </td>

                    {/* Status Toggle */}
                    <td className="px-4 py-3.5">
                      <select
                        value={item.status || 'available'}
                        onChange={(e) => handleStatusChange(item._id, e.target.value)}
                        className={`text-[10px] font-bold px-2 py-1 rounded border outline-none cursor-pointer ${
                          item.status === 'available'
                            ? 'bg-green-50 dark:bg-green-950/60 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800'
                            : item.status === 'sold'
                            ? 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800'
                            : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                        }`}
                      >
                        <option value="available">🟢 Disponible</option>
                        <option value="sold">🔴 Vendu</option>
                        <option value="rented">🟡 Loué</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 text-right space-x-2 whitespace-nowrap">
                      <Link
                        href={`/for-sale/${item._id}`}
                        className="text-gray-500 hover:text-gray-900 dark:hover:text-white font-semibold text-[11px] inline-flex items-center gap-1 transition-colors"
                      >
                        <span>👁️</span>
                        <span>Voir</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => setEditingProperty(item)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-semibold text-[11px] inline-flex items-center gap-1 cursor-pointer transition-colors"
                        title="Modifier cette annonce"
                      >
                        <span>✏️</span>
                        <span>Modifier</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item._id)}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-semibold text-[11px] inline-flex items-center gap-1 cursor-pointer transition-colors"
                        title="Supprimer cette annonce"
                      >
                        <span>🗑️</span>
                        <span>Supprimer</span>
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Property Modal */}
      {editingProperty && (
        <EditPropertyModal
          property={editingProperty}
          apiBase={apiBase}
          onClose={() => setEditingProperty(null)}
          onPropertyUpdated={(updatedProperty) => {
            setListings((prev) =>
              prev.map((item) => (item._id === updatedProperty._id ? updatedProperty : item))
            );
            setEditingProperty(null);
            setActionMessage('Annonce modifiée avec succès !');
            setTimeout(() => setActionMessage(''), 4000);
          }}
        />
      )}

    </div>
  );
}
