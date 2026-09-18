'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ProfileContactPage() {
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    province: '',
    district: '',
    mobile1: '',
    mobile2: '',
    address: '',
    emailConsent: false,
    smsConsent: false
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
    if (savedSuccess) setSavedSuccess(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 4000);
  };

  return (
    <div className="w-full bg-[#FAFAFA] dark:bg-[#0f172a] min-h-[calc(100vh-160px)] py-8 pb-20 transition-colors duration-200">
      <div className="max-w-[1060px] mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        
        {/* Navigation Breadcrumb / Dashboard Link Bar */}
        <div className="flex items-center justify-between bg-white dark:bg-[#1e293b] border border-gray-100 dark:border-slate-800 rounded px-5 py-3 shadow-2xs">
          <div className="flex items-center space-x-2">
            <span className="text-base">👤</span>
            <span className="text-xs font-bold text-gray-800 dark:text-white">Mon Profil & Coordonnées</span>
          </div>
          <Link
            href="/dashboard"
            className="text-xs font-bold text-[#E53935] hover:text-[#d32f2f] flex items-center space-x-1 transition-colors"
          >
            <span>Accéder au Tableau de Bord</span>
            <span>➔</span>
          </Link>
        </div>

        {/* Success Alert Banner */}
        {savedSuccess && (
          <div className="bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-900/60 text-green-700 dark:text-green-300 text-xs px-4 py-3 rounded-[2px] flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="text-base">✓</span>
              <span className="font-medium">Information saved successfully!</span>
            </div>
            <button
              onClick={() => setSavedSuccess(false)}
              className="text-green-700 dark:text-green-300 hover:text-green-900 font-bold"
            >
              ✕
            </button>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          
          {/* 1. Main Membership Information Card */}
          <div className="bg-white dark:bg-[#1e293b] border border-gray-200/90 dark:border-slate-800 rounded-[2px] shadow-2xs p-6 sm:p-9 space-y-6 transition-colors">
            
            <h1 className="text-xs font-bold text-gray-900 dark:text-white tracking-tight">
              Membership Information
            </h1>

            <div className="space-y-5">
              
              {/* Row 1: Name / Surname */}
              <div className="max-w-[240px]">
                <div className="relative">
                  <input
                    type="text"
                    id="fullName"
                    value={profileData.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    className="w-full bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-slate-700 hover:border-gray-400 dark:hover:border-slate-500 focus:border-gray-500 rounded-[2px] h-9 px-3 text-xs text-gray-800 dark:text-gray-200 outline-none transition-colors"
                  />
                  <label
                    htmlFor="fullName"
                    className="absolute -top-2 left-2.5 bg-white dark:bg-[#1e293b] px-1 text-[10px] text-gray-400 dark:text-gray-400 pointer-events-none"
                  >
                    Name / Surname
                  </label>
                </div>
              </div>

              {/* Row 2: E-mail */}
              <div className="max-w-[240px]">
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    value={profileData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-slate-700 hover:border-gray-400 dark:hover:border-slate-500 focus:border-gray-500 rounded-[2px] h-9 px-3 text-xs text-gray-800 dark:text-gray-200 outline-none transition-colors"
                  />
                  <label
                    htmlFor="email"
                    className="absolute -top-2 left-2.5 bg-white dark:bg-[#1e293b] px-1 text-[10px] text-gray-400 dark:text-gray-400 pointer-events-none"
                  >
                    E-mail
                  </label>
                </div>
              </div>

              {/* Row 3: Wilaya & Commune */}
              <div className="grid grid-cols-1 sm:grid-cols-2 max-w-[500px] gap-4">
                {/* Wilaya */}
                <div className="relative">
                  <select
                    id="province"
                    value={profileData.province}
                    onChange={(e) => handleChange('province', e.target.value)}
                    className="w-full appearance-none bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-slate-700 hover:border-gray-400 dark:hover:border-slate-500 focus:border-gray-500 rounded-[2px] h-9 pl-3 pr-8 text-xs text-gray-800 dark:text-gray-200 outline-none cursor-pointer"
                  >
                    <option value="" className="dark:bg-[#1e293b]"></option>
                    <option value="Alger" className="dark:bg-[#1e293b]">Alger</option>
                    <option value="Oran" className="dark:bg-[#1e293b]">Oran</option>
                    <option value="Constantine" className="dark:bg-[#1e293b]">Constantine</option>
                    <option value="Annaba" className="dark:bg-[#1e293b]">Annaba</option>
                    <option value="Setif" className="dark:bg-[#1e293b]">Sétif</option>
                    <option value="Blida" className="dark:bg-[#1e293b]">Blida</option>
                  </select>
                  <label
                    htmlFor="province"
                    className="absolute -top-2 left-2.5 bg-white dark:bg-[#1e293b] px-1 text-[10px] text-gray-400 dark:text-gray-400 pointer-events-none"
                  >
                    Wilaya
                  </label>
                  <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Commune */}
                <div className="relative">
                  <select
                    id="district"
                    value={profileData.district}
                    onChange={(e) => handleChange('district', e.target.value)}
                    className="w-full appearance-none bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-slate-700 hover:border-gray-400 dark:hover:border-slate-500 focus:border-gray-500 rounded-[2px] h-9 pl-3 pr-8 text-xs text-gray-800 dark:text-gray-200 outline-none cursor-pointer"
                  >
                    <option value="" className="dark:bg-[#1e293b]"></option>
                    <option value="Hydra" className="dark:bg-[#1e293b]">Hydra</option>
                    <option value="Sidi Yahia" className="dark:bg-[#1e293b]">Sidi Yahia</option>
                    <option value="El Biar" className="dark:bg-[#1e293b]">El Biar</option>
                    <option value="Akid Lotfi" className="dark:bg-[#1e293b]">Akid Lotfi</option>
                    <option value="Canastel" className="dark:bg-[#1e293b]">Canastel</option>
                    <option value="Ali Mendjeli" className="dark:bg-[#1e293b]">Ali Mendjeli</option>
                    <option value="Sidi Aissa" className="dark:bg-[#1e293b]">Sidi Aissa</option>
                  </select>
                  <label
                    htmlFor="district"
                    className="absolute -top-2 left-2.5 bg-white dark:bg-[#1e293b] px-1 text-[10px] text-gray-400 dark:text-gray-400 pointer-events-none"
                  >
                    Commune
                  </label>
                  <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Row 4: Mobile Numbers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 max-w-[500px] gap-4">
                <div className="relative">
                  <input
                    type="tel"
                    id="mobile1"
                    value={profileData.mobile1}
                    onChange={(e) => handleChange('mobile1', e.target.value)}
                    className="w-full bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-slate-700 hover:border-gray-400 dark:hover:border-slate-500 focus:border-gray-500 rounded-[2px] h-9 px-3 text-xs text-gray-800 dark:text-gray-200 outline-none transition-colors"
                  />
                  <label
                    htmlFor="mobile1"
                    className="absolute -top-2 left-2.5 bg-white dark:bg-[#1e293b] px-1 text-[10px] text-gray-400 dark:text-gray-400 pointer-events-none"
                  >
                    Mobile Number
                  </label>
                </div>

                <div className="relative">
                  <input
                    type="tel"
                    id="mobile2"
                    value={profileData.mobile2}
                    onChange={(e) => handleChange('mobile2', e.target.value)}
                    className="w-full bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-slate-700 hover:border-gray-400 dark:hover:border-slate-500 focus:border-gray-500 rounded-[2px] h-9 px-3 text-xs text-gray-800 dark:text-gray-200 outline-none transition-colors"
                  />
                  <label
                    htmlFor="mobile2"
                    className="absolute -top-2 left-2.5 bg-white dark:bg-[#1e293b] px-1 text-[10px] text-gray-400 dark:text-gray-400 pointer-events-none"
                  >
                    Mobile Number 2
                  </label>
                </div>
              </div>

              {/* Row 5: Address */}
              <div className="pt-1">
                <div className="relative">
                  <textarea
                    id="address"
                    rows={5}
                    value={profileData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    className="w-full bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-slate-700 hover:border-gray-400 dark:hover:border-slate-500 focus:border-gray-500 rounded-[2px] p-3 text-xs text-gray-800 dark:text-gray-200 outline-none resize-y transition-colors"
                  />
                  <label
                    htmlFor="address"
                    className="absolute -top-2 left-2.5 bg-white dark:bg-[#1e293b] px-1 text-[10px] text-gray-400 dark:text-gray-400 pointer-events-none"
                  >
                    Address
                  </label>
                </div>
              </div>

            </div>

          </div>

          {/* 2. Notification & Marketing Consent Strip */}
          <div className="bg-white dark:bg-[#1e293b] border border-gray-200/90 dark:border-slate-800 rounded-[2px] shadow-2xs px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
            <p className="text-[11px] text-gray-400 dark:text-gray-400 leading-tight">
              I want to be informed about all announcements and campaigns via commercial electronic mail.
            </p>

            <div className="flex items-center space-x-6 shrink-0">
              {/* E-mail Toggle */}
              <div className="flex flex-col items-center space-y-1">
                <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">E-mail</span>
                <button
                  type="button"
                  onClick={() => handleChange('emailConsent', !profileData.emailConsent)}
                  className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                    profileData.emailConsent ? 'bg-[#E53935] justify-end' : 'bg-gray-300 dark:bg-slate-700 justify-start'
                  }`}
                  aria-label="Toggle E-mail"
                >
                  <div className="bg-white w-4 h-4 rounded-full shadow-xs flex items-center justify-center text-[7px] font-bold text-gray-400">
                    {profileData.emailConsent ? '' : 'No'}
                  </div>
                </button>
              </div>

              {/* SMS Toggle */}
              <div className="flex flex-col items-center space-y-1">
                <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">SMS</span>
                <button
                  type="button"
                  onClick={() => handleChange('smsConsent', !profileData.smsConsent)}
                  className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                    profileData.smsConsent ? 'bg-[#E53935] justify-end' : 'bg-gray-300 dark:bg-slate-700 justify-start'
                  }`}
                  aria-label="Toggle SMS"
                >
                  <div className="bg-white w-4 h-4 rounded-full shadow-xs flex items-center justify-center text-[7px] font-bold text-gray-400">
                    {profileData.smsConsent ? '' : 'No'}
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* 3. Bottom Centered Save Button */}
          <div className="flex justify-center pt-2 pb-6">
            <button
              type="submit"
              className="bg-[#E53935] hover:bg-[#d32f2f] text-white font-medium text-xs py-2 px-14 rounded-[3px] transition-colors shadow-xs cursor-pointer"
            >
              Save
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
