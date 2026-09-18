'use client';

import { useState, useEffect } from 'react';
import { ALGERIA_WILAYAS, getCommunesByWilaya } from '@/data/algeriaLocations';
import ImageUploadDropzone from '@/components/ImageUploadDropzone';

export default function EditPropertyModal({
  property,
  apiBase,
  onClose,
  onPropertyUpdated
}) {
  const [formData, setFormData] = useState({
    title: property?.title || '',
    description: property?.description || '',
    price: property?.price !== undefined ? property.price.toString() : '',
    rentOrSale: property?.rentOrSale || 'sale',
    type: property?.type || 'apartment',
    status: property?.status || 'available',
    wilaya: property?.wilaya || 'Alger',
    commune: property?.commune || 'Hydra',
    address: property?.address || '',
    beds: property?.beds !== undefined ? property.beds.toString() : '3',
    baths: property?.baths !== undefined ? property.baths.toString() : '1',
    sqm: property?.sqm !== undefined ? property.sqm.toString() : '120',
    features: Array.isArray(property?.features) ? [...property.features] : [],
    images: Array.isArray(property?.images) ? [...property.images] : []
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const currentCommunes = getCommunesByWilaya(formData.wilaya);

  const availableFeatures = [
    'Climatisation',
    'Chauffage central',
    'Bâche à eau',
    'Ascenseur',
    'Garage / Parking',
    'Meublé',
    'Cuisine équipée',
    'Acte notarié',
    'Livret foncier',
    'Vue sur mer',
    'Jardin / Terrasse',
    'Sécurité 24/7',
    'Interphone vidéo'
  ];

  const handleWilayaChange = (e) => {
    const selectedWilaya = e.target.value;
    const communes = getCommunesByWilaya(selectedWilaya);
    setFormData((prev) => ({
      ...prev,
      wilaya: selectedWilaya,
      commune: communes.length > 0 ? communes[0] : ''
    }));
  };

  const handleFeatureToggle = (feature) => {
    setFormData((prev) => {
      const exists = prev.features.includes(feature);
      return {
        ...prev,
        features: exists
          ? prev.features.filter((f) => f !== feature)
          : [...prev.features, feature]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.title.trim()) {
      setError('Veuillez renseigner le titre de l’annonce.');
      return;
    }
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) {
      setError('Veuillez renseigner un prix valide en Dinars Algériens (DZD).');
      return;
    }

    setLoading(true);
    const base = apiBase || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    try {
      const res = await fetch(`${base}/api/dashboard/properties/${property._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          beds: Number(formData.beds),
          baths: Number(formData.baths),
          sqm: Number(formData.sqm)
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Erreur lors de la modification de l’annonce.');
      }

      setSuccess('Annonce modifiée avec succès !');
      setTimeout(() => {
        if (onPropertyUpdated) {
          onPropertyUpdated(data.property);
        }
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white dark:bg-[#1e293b] rounded-xl shadow-2xl border border-gray-100 dark:border-slate-800 flex flex-col z-10 animate-in zoom-in-95 duration-200 overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-gray-50/50 dark:bg-slate-800/50">
          <div className="flex items-center space-x-2.5">
            <span className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-950/50 text-[#E53935] flex items-center justify-center text-sm font-bold">
              ✏️
            </span>
            <div>
              <h2 className="text-sm font-bold text-gray-900 dark:text-white">
                Modifier l&apos;Annonce
              </h2>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                {property?.title || 'Modification des détails du bien'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700 text-sm font-bold transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Modal Body / Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-xs">
          
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-lg text-red-700 dark:text-red-300 flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-900/60 rounded-lg text-green-700 dark:text-green-300 flex items-center gap-2">
              <span>✓</span>
              <span className="font-semibold">{success}</span>
            </div>
          )}

          <form id="edit-property-form" onSubmit={handleSubmit} className="space-y-5">
            
            {/* 1. Transaction & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 bg-gray-50/50 dark:bg-slate-800/30 p-4 rounded-lg border border-gray-100 dark:border-slate-800">
              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Type de Transaction <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.rentOrSale}
                  onChange={(e) => setFormData({ ...formData, rentOrSale: e.target.value })}
                  className="w-full bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-gray-800 dark:text-gray-200 outline-none cursor-pointer"
                >
                  <option value="sale">Vente</option>
                  <option value="rent">Location</option>
                  <option value="daily_rental">Location Journalière / Vacances</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Catégorie de Bien <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-gray-800 dark:text-gray-200 outline-none cursor-pointer"
                >
                  <option value="apartment">Appartement</option>
                  <option value="villa">Villa</option>
                  <option value="house">Maison Individuelle</option>
                  <option value="commercial">Local Commercial / Bureau</option>
                  <option value="land">Terrain</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Statut de l&apos;Annonce <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-gray-800 dark:text-gray-200 outline-none cursor-pointer"
                >
                  <option value="available">🟢 Disponible</option>
                  <option value="sold">🔴 Vendu</option>
                  <option value="rented">🟡 Loué</option>
                </select>
              </div>
            </div>

            {/* 2. Title & Description */}
            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Titre de l&apos;Annonce <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Titre de votre annonce"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-gray-800 dark:text-gray-200 outline-none focus:border-[#E53935]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={4}
                  placeholder="Description du bien..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-gray-800 dark:text-gray-200 outline-none focus:border-[#E53935]"
                />
              </div>
            </div>

            {/* 3. Specs: Price, Surface, Beds, Baths */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Prix (DZD) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-gray-800 dark:text-gray-200 font-bold outline-none focus:border-[#E53935]"
                />
                {formData.price && (
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    = {Number(formData.price).toLocaleString('fr-DZ')} DZD
                  </span>
                )}
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Surface (m²) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  value={formData.sqm}
                  onChange={(e) => setFormData({ ...formData, sqm: e.target.value })}
                  className="w-full bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-gray-800 dark:text-gray-200 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Pièces
                </label>
                <select
                  value={formData.beds}
                  onChange={(e) => setFormData({ ...formData, beds: e.target.value })}
                  className="w-full bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-gray-800 dark:text-gray-200 outline-none cursor-pointer"
                >
                  <option value="1">F1 (1 Pièce)</option>
                  <option value="2">F2 (2 Pièces)</option>
                  <option value="3">F3 (3 Pièces)</option>
                  <option value="4">F4 (4 Pièces)</option>
                  <option value="5">F5 (5 Pièces)</option>
                  <option value="6">6 Pièces et plus</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Salles de Bain
                </label>
                <select
                  value={formData.baths}
                  onChange={(e) => setFormData({ ...formData, baths: e.target.value })}
                  className="w-full bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-gray-800 dark:text-gray-200 outline-none cursor-pointer"
                >
                  <option value="1">1 Salle de bain</option>
                  <option value="2">2 Salles de bain</option>
                  <option value="3">3 Salles de bain</option>
                  <option value="4">4+</option>
                </select>
              </div>
            </div>

            {/* 4. Location (58 Wilayas & Communes) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Wilaya <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.wilaya}
                  onChange={handleWilayaChange}
                  className="w-full bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-gray-800 dark:text-gray-200 outline-none cursor-pointer"
                >
                  {ALGERIA_WILAYAS.map((w) => (
                    <option key={w.code} value={w.name}>
                      {w.code} - {w.name} ({w.nameAr})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Commune / Baladiya <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.commune}
                  onChange={(e) => setFormData({ ...formData, commune: e.target.value })}
                  className="w-full bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-gray-800 dark:text-gray-200 outline-none cursor-pointer"
                >
                  {currentCommunes.map((c, idx) => (
                    <option key={idx} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Adresse / Quartier
                </label>
                <input
                  type="text"
                  placeholder="ex: Val d'Hydra"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-gray-800 dark:text-gray-200 outline-none focus:border-[#E53935]"
                />
              </div>
            </div>

            {/* 5. Features / Amenities */}
            <div className="space-y-2">
              <label className="block font-semibold text-gray-700 dark:text-gray-300">
                Équipements et Commodités
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {availableFeatures.map((feat) => {
                  const checked = formData.features.includes(feat);
                  return (
                    <label
                      key={feat}
                      className={`flex items-center space-x-2 p-2 rounded-lg border cursor-pointer select-none transition-all ${
                        checked
                          ? 'border-[#E53935] bg-red-50/20 dark:bg-red-950/20 text-gray-900 dark:text-white font-semibold'
                          : 'border-gray-200 dark:border-slate-800 text-gray-600 dark:text-gray-400 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleFeatureToggle(feat)}
                        className="accent-[#E53935]"
                      />
                      <span className="text-[11px] truncate">{feat}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* 6. Photos (ImageUploadDropzone) */}
            <div className="space-y-2">
              <label className="block font-semibold text-gray-700 dark:text-gray-300">
                Photos de l&apos;Annonce
              </label>
              <ImageUploadDropzone
                images={formData.images}
                onChange={(updater) => {
                  if (typeof updater === 'function') {
                    setFormData((prev) => ({ ...prev, images: updater(prev.images) }));
                  } else {
                    setFormData((prev) => ({ ...prev, images: updater }));
                  }
                }}
                maxImages={15}
                title="Modifier les photos"
                subtitle="Ajoutez, réorganisez ou supprimez les photos de votre bien"
              />
            </div>

          </form>

        </div>

        {/* Modal Footer Actions */}
        <div className="px-5 py-4 border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/50 flex items-center justify-end space-x-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            Annuler
          </button>
          
          <button
            type="submit"
            form="edit-property-form"
            disabled={loading}
            className="bg-[#E53935] hover:bg-[#d32f2f] text-white text-xs font-bold px-6 py-2 rounded-lg transition-all shadow-xs disabled:opacity-50 flex items-center gap-2 cursor-pointer"
          >
            {loading && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            <span>{loading ? 'Enregistrement...' : 'Enregistrer les Modifications'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
