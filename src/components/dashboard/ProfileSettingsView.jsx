'use client';

import { useState } from 'react';
import { ALGERIA_WILAYAS, getCommunesByWilaya } from '@/data/algeriaLocations';

export default function ProfileSettingsView({ user, onProfileUpdated, apiBase }) {
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    wilaya: user?.wilaya || 'Alger',
    commune: user?.commune || 'Hydra',
    address: user?.address || '',
    companyName: user?.companyName || user?.advertiserProfile?.agencyName || '',
    licenseNumber: user?.advertiserProfile?.licenseNumber || '',
    bio: user?.advertiserProfile?.bio || '',
    emailConsent: user?.emailConsent || false,
    smsConsent: user?.smsConsent || false
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const currentCommunes = getCommunesByWilaya(profileData.wilaya);

  const handleWilayaChange = (e) => {
    const selectedWilaya = e.target.value;
    const communes = getCommunesByWilaya(selectedWilaya);
    setProfileData((prev) => ({
      ...prev,
      wilaya: selectedWilaya,
      commune: communes.length > 0 ? communes[0] : ''
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    setLoading(true);
    const base = apiBase || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    try {
      const res = await fetch(`${base}/api/dashboard/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          name: profileData.name,
          phone: profileData.phone,
          wilaya: profileData.wilaya,
          commune: profileData.commune,
          address: profileData.address,
          companyName: profileData.companyName,
          emailConsent: profileData.emailConsent,
          smsConsent: profileData.smsConsent,
          advertiserProfile: {
            agencyName: profileData.companyName,
            phone: profileData.phone,
            wilaya: profileData.wilaya,
            commune: profileData.commune,
            licenseNumber: profileData.licenseNumber,
            bio: profileData.bio
          }
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Erreur lors de la mise à jour du profil.');
      }

      setSuccess(true);
      if (onProfileUpdated) onProfileUpdated(data.user);
      setTimeout(() => setSuccess(false), 4000);
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
        <h1 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white tracking-tight">
          Mon Profil & Paramètres du Compte
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Mettez à jour vos coordonnées personnelles, votre adresse en Algérie et vos préférences de notification.
        </p>
      </div>

      {success && (
        <div className="p-3 bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-900/60 text-green-700 dark:text-green-300 rounded text-xs flex items-center justify-between shadow-2xs">
          <span>✓ Vos informations ont été mises à jour avec succès !</span>
          <button onClick={() => setSuccess(false)} className="font-bold">✕</button>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 rounded text-xs shadow-2xs">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        
        {/* 1. Personal & Contact Info */}
        <div className="bg-white dark:bg-[#1e293b] border border-gray-100 dark:border-slate-800 rounded-lg p-5 sm:p-6 shadow-2xs space-y-4">
          <h2 className="text-xs font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-2">
            1. Informations Personnelles
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Nom & Prénom <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="w-full bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-slate-700 rounded px-3 py-2 text-gray-800 dark:text-gray-200 outline-none focus:border-[#E53935]"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Adresse E-mail
              </label>
              <input
                type="email"
                disabled
                value={profileData.email}
                className="w-full bg-gray-100 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 rounded px-3 py-2 text-gray-500 dark:text-gray-400 outline-none cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Numéro de Téléphone (Algérie)
              </label>
              <input
                type="tel"
                placeholder="+213 550 12 34 56"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                className="w-full bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-slate-700 rounded px-3 py-2 text-gray-800 dark:text-gray-200 outline-none focus:border-[#E53935]"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Type de Compte
              </label>
              <div className="py-2 text-gray-800 dark:text-gray-200 font-bold capitalize">
                {user?.role === 'admin' ? 'Administrateur' : user?.hasAdvertiserProfile ? 'Annonceur / Agence Immobilière' : 'Client Particulier'}
              </div>
            </div>
          </div>
        </div>

        {/* 2. Algerian Address */}
        <div className="bg-white dark:bg-[#1e293b] border border-gray-100 dark:border-slate-800 rounded-lg p-5 sm:p-6 shadow-2xs space-y-4">
          <h2 className="text-xs font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-2">
            2. Localisation en Algérie (58 Wilayas)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Wilaya
              </label>
              <select
                value={profileData.wilaya}
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
                Baladiya / Commune
              </label>
              <select
                value={profileData.commune}
                onChange={(e) => setProfileData({ ...profileData, commune: e.target.value })}
                className="w-full bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-slate-700 rounded px-3 py-2 text-gray-800 dark:text-gray-200 outline-none cursor-pointer"
              >
                {currentCommunes.map((c, idx) => (
                  <option key={idx} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Adresse Complète
              </label>
              <textarea
                rows={2}
                placeholder="ex: 14 Rue Didouche Mourad, Alger Centre"
                value={profileData.address}
                onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                className="w-full bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-slate-700 rounded px-3 py-2 text-gray-800 dark:text-gray-200 outline-none focus:border-[#E53935]"
              />
            </div>
          </div>
        </div>

        {/* 3. Advertiser Details (if applicable) */}
        {user?.hasAdvertiserProfile && (
          <div className="bg-white dark:bg-[#1e293b] border border-gray-100 dark:border-slate-800 rounded-lg p-5 sm:p-6 shadow-2xs space-y-4">
            <h2 className="text-xs font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-2">
              3. Profil Professionnel / Agence
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Nom Commercial de l'Agence
                </label>
                <input
                  type="text"
                  value={profileData.companyName}
                  onChange={(e) => setProfileData({ ...profileData, companyName: e.target.value })}
                  className="w-full bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-slate-700 rounded px-3 py-2 text-gray-800 dark:text-gray-200 outline-none focus:border-[#E53935]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  N° Registre de Commerce / Agrément
                </label>
                <input
                  type="text"
                  value={profileData.licenseNumber}
                  onChange={(e) => setProfileData({ ...profileData, licenseNumber: e.target.value })}
                  className="w-full bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-slate-700 rounded px-3 py-2 text-gray-800 dark:text-gray-200 outline-none focus:border-[#E53935]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Présentation / Bio
                </label>
                <textarea
                  rows={2}
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  className="w-full bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-slate-700 rounded px-3 py-2 text-gray-800 dark:text-gray-200 outline-none focus:border-[#E53935]"
                />
              </div>
            </div>
          </div>
        )}

        {/* 4. Notification Preferences */}
        <div className="bg-white dark:bg-[#1e293b] border border-gray-100 dark:border-slate-800 rounded-lg p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-[11px] text-gray-500 dark:text-gray-400">
            Recevoir les alertes de nouveaux biens correspondants et notifications par SMS & E-mail.
          </p>

          <div className="flex items-center space-x-6 shrink-0">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={profileData.emailConsent}
                onChange={(e) => setProfileData({ ...profileData, emailConsent: e.target.checked })}
                className="accent-[#E53935] w-4 h-4"
              />
              <span className="font-semibold text-gray-700 dark:text-gray-300">E-mail</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={profileData.smsConsent}
                onChange={(e) => setProfileData({ ...profileData, smsConsent: e.target.checked })}
                className="accent-[#E53935] w-4 h-4"
              />
              <span className="font-semibold text-gray-700 dark:text-gray-300">SMS</span>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#E53935] hover:bg-[#d32f2f] text-white font-bold text-xs py-2.5 px-10 rounded transition-all shadow-md disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Enregistrement...' : 'Enregistrer les Modifications'}
          </button>
        </div>

      </form>
    </div>
  );
}
