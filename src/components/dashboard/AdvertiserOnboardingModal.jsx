'use client';

import { useState } from 'react';
import { ALGERIA_WILAYAS, getCommunesByWilaya } from '@/data/algeriaLocations';

export default function AdvertiserOnboardingModal({ isOpen, onClose, onSuccess, apiBase }) {
  const [formData, setFormData] = useState({
    agencyName: '',
    phone: '',
    wilaya: 'Alger',
    commune: 'Hydra',
    licenseNumber: '',
    bio: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const currentCommunes = getCommunesByWilaya(formData.wilaya);

  const handleWilayaChange = (e) => {
    const selectedWilaya = e.target.value;
    const communes = getCommunesByWilaya(selectedWilaya);
    setFormData((prev) => ({
      ...prev,
      wilaya: selectedWilaya,
      commune: communes.length > 0 ? communes[0] : ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.agencyName.trim()) {
      setError('Veuillez saisir le nom de votre agence ou enseigne.');
      return;
    }
    if (!formData.phone.trim()) {
      setError('Veuillez renseigner un numéro de téléphone joignable en Algérie.');
      return;
    }

    setLoading(true);
    const base = apiBase || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    try {
      const res = await fetch(`${base}/api/dashboard/onboarding`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Erreur lors de l’activation de votre profil annonceur.');
      }

      onSuccess(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1e293b] border border-gray-100 dark:border-slate-800 rounded-lg shadow-2xl w-full max-w-lg overflow-hidden transition-all">
        
        {/* Header */}
        <div className="bg-[#E53935] px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <span className="text-xl">🏢</span>
            <div>
              <h2 className="text-sm font-bold tracking-tight">Activer mon Compte Annonceur</h2>
              <p className="text-[11px] text-white/80">Espace dédié aux agences, promoteurs et particuliers vendeurs</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-full text-lg font-bold"
          >
            ✕
          </button>
        </div>

        {/* Content & Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <p className="text-gray-600 dark:text-gray-300 text-[12px] leading-relaxed">
            Pour publier et gérer des biens immobiliers sur <strong className="text-gray-900 dark:text-white">MAKAN Algérie</strong>, veuillez renseigner vos coordonnées professionnelles.
          </p>

          {error && (
            <div className="p-2.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded text-red-600 dark:text-red-400 text-xs">
              ⚠️ {error}
            </div>
          )}

          {/* Agency Name */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
              Nom de l'Agence ou Particulier Vendeur <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="ex: Agence Immobilière El Bahdja, Promotion Immobilière..."
              value={formData.agencyName}
              onChange={(e) => setFormData({ ...formData, agencyName: e.target.value })}
              className="w-full bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-slate-700 rounded px-3 py-2 text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-[#E53935]"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
              Numéro de téléphone joignable <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              required
              placeholder="+213 550 12 34 56"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-slate-700 rounded px-3 py-2 text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-[#E53935]"
            />
          </div>

          {/* Wilaya & Commune */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
                Wilaya <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.wilaya}
                onChange={handleWilayaChange}
                className="w-full bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-slate-700 rounded px-3 py-2 text-xs text-gray-800 dark:text-gray-200 outline-none cursor-pointer"
              >
                {ALGERIA_WILAYAS.map((w) => (
                  <option key={w.code} value={w.name}>
                    {w.code} - {w.name} ({w.nameAr})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
                Baladiya / Commune
              </label>
              <select
                value={formData.commune}
                onChange={(e) => setFormData({ ...formData, commune: e.target.value })}
                className="w-full bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-slate-700 rounded px-3 py-2 text-xs text-gray-800 dark:text-gray-200 outline-none cursor-pointer"
              >
                {currentCommunes.map((c, idx) => (
                  <option key={idx} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* License / Register # */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
              Registre de Commerce / Agrément (optionnel)
            </label>
            <input
              type="text"
              placeholder="ex: RC-16/00-1234567"
              value={formData.licenseNumber}
              onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
              className="w-full bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-slate-700 rounded px-3 py-2 text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-[#E53935]"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
              Description de votre activité
            </label>
            <textarea
              rows={2}
              placeholder="Spécialiste de la vente et location d'appartements et villas à Alger..."
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-slate-700 rounded px-3 py-2 text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-[#E53935]"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 flex items-center justify-end space-x-2 border-t border-gray-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#E53935] hover:bg-[#d32f2f] text-white px-5 py-2 rounded text-xs font-bold transition-all shadow-xs disabled:opacity-50"
            >
              {loading ? 'Activation en cours...' : 'Valider & Activer'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
