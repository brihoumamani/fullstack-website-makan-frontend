'use client';

import { useState } from 'react';
import { ALGERIA_WILAYAS, getCommunesByWilaya } from '@/data/algeriaLocations';
import ImageUploadDropzone from '@/components/ImageUploadDropzone';

export default function AddPropertyView({ apiBase, onPropertyCreated }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    rentOrSale: 'sale',
    type: 'apartment',
    wilaya: 'Alger',
    commune: 'Hydra',
    address: '',
    beds: '3',
    baths: '1',
    sqm: '120',
    features: ['Climatisation', 'Chauffage central', 'Bâche à eau', 'Ascenseur'],
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80'
    ]
  });

  const [imageUrlInput, setImageUrlInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  const handleAddImage = (e) => {
    e.preventDefault();
    if (imageUrlInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, imageUrlInput.trim()]
      }));
      setImageUrlInput('');
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.title.trim()) {
      setError('Veuillez saisir un titre pour l’annonce.');
      return;
    }
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) {
      setError('Veuillez renseigner un prix valide en Dinars Algériens (DZD).');
      return;
    }

    setLoading(true);
    const base = apiBase || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    try {
      const res = await fetch(`${base}/api/dashboard/properties`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Erreur lors de la publication de l’annonce.');
      }

      setSuccess('Votre annonce a été publiée avec succès !');
      setTimeout(() => {
        if (onPropertyCreated) onPropertyCreated();
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="border-b border-gray-100 dark:border-slate-800 pb-4">
        <h1 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
          <span>➕</span>
          <span>Ajouter une Nouvelle Annonce</span>
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Publiez votre bien immobilier pour la vente ou la location à travers les 58 wilayas d’Algérie.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded text-red-700 dark:text-red-300 text-xs">
          ⚠️ {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-900/60 text-green-700 dark:text-green-300 rounded text-xs flex items-center gap-2">
          <span>✓</span>
          <span className="font-semibold">{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        
        {/* Section 1: Type & Category */}
        <div className="bg-white dark:bg-[#1e293b] border border-gray-100 dark:border-slate-800 rounded-lg p-5 sm:p-6 shadow-2xs space-y-4">
          <h2 className="text-xs font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-2">
            1. Type d'Offre et Catégorie
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Type de Transaction <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.rentOrSale}
                onChange={(e) => setFormData({ ...formData, rentOrSale: e.target.value })}
                className="w-full bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-slate-700 rounded px-3 py-2 text-gray-800 dark:text-gray-200 outline-none cursor-pointer"
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
                className="w-full bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-slate-700 rounded px-3 py-2 text-gray-800 dark:text-gray-200 outline-none cursor-pointer"
              >
                <option value="apartment">Appartement</option>
                <option value="villa">Villa</option>
                <option value="house">Maison Individuelle</option>
                <option value="commercial">Local Commercial / Bureau</option>
                <option value="land">Terrain</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Property Details */}
        <div className="bg-white dark:bg-[#1e293b] border border-gray-100 dark:border-slate-800 rounded-lg p-5 sm:p-6 shadow-2xs space-y-4">
          <h2 className="text-xs font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-2">
            2. Informations Générales
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Titre de l'Annonce <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="ex: Bel Appartement F4 Haut Standing avec Vue Panoramique à Hydra"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-slate-700 rounded px-3 py-2 text-gray-800 dark:text-gray-200 outline-none focus:border-[#E53935]"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Description détaillée
              </label>
              <textarea
                rows={4}
                placeholder="Décrivez les atouts de votre bien (ensoleillement, proximité des commerces, écoles, état de finition...)"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-slate-700 rounded px-3 py-2 text-gray-800 dark:text-gray-200 outline-none focus:border-[#E53935]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Prix (en Dinar DZD / DA) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  placeholder="35000000"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-slate-700 rounded px-3 py-2 text-gray-800 dark:text-gray-200 font-bold outline-none focus:border-[#E53935]"
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
                  placeholder="120"
                  value={formData.sqm}
                  onChange={(e) => setFormData({ ...formData, sqm: e.target.value })}
                  className="w-full bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-slate-700 rounded px-3 py-2 text-gray-800 dark:text-gray-200 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Nombre de Pièces
                </label>
                <select
                  value={formData.beds}
                  onChange={(e) => setFormData({ ...formData, beds: e.target.value })}
                  className="w-full bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-slate-700 rounded px-3 py-2 text-gray-800 dark:text-gray-200 outline-none cursor-pointer"
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
                  className="w-full bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-slate-700 rounded px-3 py-2 text-gray-800 dark:text-gray-200 outline-none cursor-pointer"
                >
                  <option value="1">1 Salle de bain</option>
                  <option value="2">2 Salles de bain</option>
                  <option value="3">3 Salles de bain</option>
                  <option value="4">4+</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Algerian Location (58 Wilayas) */}
        <div className="bg-white dark:bg-[#1e293b] border border-gray-100 dark:border-slate-800 rounded-lg p-5 sm:p-6 shadow-2xs space-y-4">
          <h2 className="text-xs font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-2">
            3. Localisation en Algérie (58 Wilayas)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Wilaya <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.wilaya}
                onChange={handleWilayaChange}
                className="w-full bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-slate-700 rounded px-3 py-2 text-gray-800 dark:text-gray-200 outline-none cursor-pointer"
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
                className="w-full bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-slate-700 rounded px-3 py-2 text-gray-800 dark:text-gray-200 outline-none cursor-pointer"
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
                Quartier / Adresse
              </label>
              <input
                type="text"
                placeholder="ex: Val d'Hydra, Résidence les Pins"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-slate-700 rounded px-3 py-2 text-gray-800 dark:text-gray-200 outline-none focus:border-[#E53935]"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Features & Amenities */}
        <div className="bg-white dark:bg-[#1e293b] border border-gray-100 dark:border-slate-800 rounded-lg p-5 sm:p-6 shadow-2xs space-y-4">
          <h2 className="text-xs font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-2">
            4. Équipements et Commodités
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {availableFeatures.map((feat) => {
              const checked = formData.features.includes(feat);
              return (
                <label
                  key={feat}
                  className={`flex items-center space-x-2 p-2 rounded border cursor-pointer select-none transition-all ${
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

        {/* Section 5: Photos du Bien (Drag & Drop + File Upload) */}
        <div className="bg-white dark:bg-[#1e293b] border border-gray-100 dark:border-slate-800 rounded-lg p-5 sm:p-6 shadow-2xs space-y-4">
          <h2 className="text-xs font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-2">
            5. Photos du Bien
          </h2>

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
            title="Photos de la Propriété"
            subtitle="Ajoutez les meilleures photos pour valoriser votre bien"
          />
        </div>

        {/* Submit Action */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#E53935] hover:bg-[#d32f2f] text-white font-bold text-xs py-3 px-10 rounded transition-all shadow-md disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Publication en cours...' : 'Publier mon Annonce ➔'}
          </button>
        </div>

      </form>
    </div>
  );
}
