'use client';

import { useState } from 'react';
import Link from 'next/link';
import ImageUploadDropzone from '@/components/ImageUploadDropzone';
import { getApiBase } from '@/utils/apiConfig';

const API_BASE = getApiBase();

export default function DynamicAdvertiseWizard() {
  // Wizard Step State: 1 = Form (Pen), 2 = Preview (Eye), 3 = Contact (Phone), 4 = Finish (Checkmark)
  const [currentStep, setCurrentStep] = useState(1);
  const [isPublishing, setIsPublishing] = useState(false);
  const [createdProperty, setCreatedProperty] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    listingType: 'For Sale',
    category: 'Apartment',
    title: '',
    description: '',
    price: '',
    currency: 'DZD',
    grossM2: '',
    netM2: '',
    rooms: '4 + 1',
    buildingAge: '',
    floorLocation: '',
    totalFloors: '',
    heatingType: 'Natural Gas',
    loanEligible: 'Appropriate',
    furnished: 'Not',
    dues: '',
    swap: 'Not',
    front: 'Northwest',
    rentalIncome: '',
    city: 'Alger',
    district: 'Hydra',
    neighborhood: '',
    images: [
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80'
    ]
  });

  // Contact State (Only Mobile Number required)
  const [contactData, setContactData] = useState({
    mobile1: ''
  });

  // Validation Error States
  const [step1Errors, setStep1Errors] = useState({});
  const [step3Errors, setStep3Errors] = useState({});
  const [showErrorBanner, setShowErrorBanner] = useState('');

  const [activePhoto, setActivePhoto] = useState(0);

  const displayPhotos = formData.images && formData.images.length > 0
    ? formData.images
    : [
        'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80'
      ];

  const prevPhoto = () => {
    setActivePhoto((prev) => (prev === 0 ? displayPhotos.length - 1 : prev - 1));
  };

  const nextPhoto = () => {
    setActivePhoto((prev) => (prev === displayPhotos.length - 1 ? 0 : prev + 1));
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (step1Errors[field]) {
      setStep1Errors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    if (showErrorBanner) setShowErrorBanner('');
  };

  const handleContactChange = (field, value) => {
    setContactData((prev) => ({ ...prev, [field]: value }));
    if (step3Errors[field]) {
      setStep3Errors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    if (showErrorBanner) setShowErrorBanner('');
  };

  // Validate Step 1 (Pen)
  const validateStep1 = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.description.trim()) errors.description = 'Explanation is required';
    if (!formData.price || isNaN(formData.price.replace(/[.,\s]/g, '')) || Number(formData.price.replace(/[.,\s]/g, '')) <= 0) {
      errors.price = 'Valid price is required';
    }
    if (!formData.grossM2 || Number(formData.grossM2) <= 0) errors.grossM2 = 'Gross M² is required';
    if (!formData.netM2 || Number(formData.netM2) <= 0) errors.netM2 = 'Net M² is required';
    if (!formData.buildingAge.trim()) errors.buildingAge = 'Building Age is required';
    if (!formData.floorLocation.trim()) errors.floorLocation = 'Floor Location is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.district.trim()) errors.district = 'District is required';
    if (!formData.neighborhood.trim()) errors.neighborhood = 'Street / Neighborhood is required';

    setStep1Errors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate Step 3 (Phone / Mobile Number)
  // Must be in one of two forms: 0799999999 (10 digits) OR +213777777777 (+213 followed by 9 digits)
  const validateStep3 = () => {
    const errors = {};
    const rawMobile = (contactData.mobile1 || '').trim().replace(/[\s\-_()]/g, '');
    const algeriaPhoneRegex = /^(0[0-9]{9}|\+213[0-9]{9})$/;

    if (!rawMobile) {
      errors.mobile1 = 'Veuillez renseigner votre numéro de mobile.';
    } else if (!algeriaPhoneRegex.test(rawMobile)) {
      errors.mobile1 = 'Le numéro mobile doit être au format 0799999999 ou +213777777777.';
    }

    setStep3Errors(errors);
    return Object.keys(errors).length === 0;
  };

  // Publish announcement to Backend API & MongoDB
  const handlePublish = async () => {
    setShowErrorBanner('');
    if (!validateStep1()) {
      setCurrentStep(1);
      setShowErrorBanner('Veuillez renseigner tous les champs obligatoires (*) sur le formulaire.');
      return;
    }
    if (!validateStep3()) {
      setCurrentStep(3);
      setShowErrorBanner('Veuillez renseigner un numéro de téléphone mobile valide.');
      return;
    }

    setIsPublishing(true);
    try {
      const res = await fetch(`${API_BASE}/api/properties`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          contactData
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Erreur lors de la publication de l’annonce.');
      }

      setCreatedProperty(data.property);
      setCurrentStep(4);
    } catch (err) {
      console.error('Publish error:', err);
      setShowErrorBanner(err.message || 'Impossible de publier l’annonce. Vérifiez votre connexion.');
    } finally {
      setIsPublishing(false);
    }
  };

  // Handle Wizard Step Navigation
  const goToStep = (targetStep) => {
    setShowErrorBanner('');

    // Allow moving backwards freely
    if (targetStep < currentStep) {
      setCurrentStep(targetStep);
      return;
    }

    // Moving from 1 -> 2
    if (currentStep === 1 && targetStep >= 2) {
      if (!validateStep1()) {
        setShowErrorBanner('Please fill in all required (*) fields before proceeding to preview.');
        return;
      }
    }

    // Moving from 2 -> 3
    if (currentStep === 2 && targetStep >= 3) {
      if (!validateStep1()) {
        setCurrentStep(1);
        setShowErrorBanner('Please complete all required fields on the advert form.');
        return;
      }
    }

    // Moving to 4: Trigger real API publication
    if (targetStep === 4) {
      handlePublish();
      return;
    }

    setCurrentStep(targetStep);
  };

  return (
    <div className="w-full bg-[#FAFAFA] dark:bg-[#0f172a] min-h-screen pb-20 transition-colors duration-200">
      
      {/* 1. TOP STEPPER WIZARD */}
      <div className="max-w-[1060px] mx-auto px-4 pt-6 pb-4">
        <div className="flex items-center justify-center space-x-3 sm:space-x-6">
          
          {/* STEP 1: Pen */}
          <button
            type="button"
            onClick={() => goToStep(1)}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              currentStep >= 1
                ? 'bg-[#E53935] text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-400'
            }`}
            title="Step 1: Form Information"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 000-1.41l-2.34-2.34a.996.996 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
            </svg>
          </button>

          {/* Line 1 -> 2 */}
          <div className={`w-12 sm:w-20 h-0.5 transition-colors ${currentStep >= 2 ? 'bg-[#E53935]' : 'bg-gray-200 dark:bg-slate-700'}`}></div>

          {/* STEP 2: Eye */}
          <button
            type="button"
            onClick={() => goToStep(2)}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              currentStep >= 2
                ? 'bg-[#E53935] text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-400'
            }`}
            title="Step 2: Preview Listing"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
            </svg>
          </button>

          {/* Line 2 -> 3 */}
          <div className={`w-12 sm:w-20 h-0.5 transition-colors ${currentStep >= 3 ? 'bg-[#E53935]' : 'bg-gray-200 dark:bg-slate-700'}`}></div>

          {/* STEP 3: Phone */}
          <button
            type="button"
            onClick={() => goToStep(3)}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              currentStep >= 3
                ? 'bg-[#E53935] text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-400'
            }`}
            title="Step 3: Contact Information"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57a1.02 1.02 0 00-1.02.24l-2.2 2.2a15.045 15.045 0 01-6.59-6.59l2.2-2.21a.96.96 0 00.25-1A11.36 11.36 0 018.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1zM12 3v10l3-3h6V3h-9z" />
            </svg>
          </button>

          {/* Line 3 -> 4 */}
          <div className={`w-12 sm:w-20 h-0.5 transition-colors ${currentStep >= 4 ? 'bg-[#E53935]' : 'bg-gray-200 dark:bg-slate-700'}`}></div>

          {/* STEP 4: Checkmark */}
          <button
            type="button"
            onClick={() => goToStep(4)}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              currentStep >= 4
                ? 'bg-[#E53935] text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-400'
            }`}
            title="Step 4: Published Confirmation"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          </button>

        </div>
      </div>

      {/* Global Validation Error Banner */}
      {showErrorBanner && (
        <div className="max-w-[950px] mx-auto px-4 mb-4">
          <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 text-xs px-4 py-3 rounded-[3px] flex items-center gap-2 shadow-xs">
            <span className="text-base">⚠️</span>
            <span className="font-medium">{showErrorBanner}</span>
          </div>
        </div>
      )}

      {/* 2. STEP 1: FORM INPUT (✏️ PEN) */}
      {currentStep === 1 && (
        <div className="max-w-[950px] mx-auto px-4 sm:px-6 mt-2 space-y-6">
          
          {/* Category & Tips Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-9 bg-white dark:bg-[#1e293b] border border-gray-200/90 dark:border-slate-800 rounded-[2px] shadow-2xs p-5 sm:p-6 space-y-4 transition-colors">
              <h2 className="text-xs font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-2">Category</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-gray-600 dark:text-gray-300 mb-1 font-medium">Real Estate Type <span className="text-red-500">*</span></label>
                  <select
                    value={formData.listingType}
                    onChange={(e) => handleFormChange('listingType', e.target.value)}
                    className="w-full bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-slate-700 hover:border-gray-400 dark:hover:border-slate-500 rounded-[2px] py-2 px-3 text-gray-800 dark:text-gray-200 outline-none cursor-pointer"
                  >
                    <option value="For Sale">For Sale</option>
                    <option value="For Rent">For Rent</option>
                    <option value="Daily Rental">Daily Rental</option>
                    <option value="Projects">Projects</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-600 dark:text-gray-300 mb-1 font-medium">Category <span className="text-red-500">*</span></label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleFormChange('category', e.target.value)}
                    className="w-full bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-slate-700 hover:border-gray-400 dark:hover:border-slate-500 rounded-[2px] py-2 px-3 text-gray-800 dark:text-gray-200 outline-none cursor-pointer"
                  >
                    <option value="Apartment">Apartment</option>
                    <option value="House">House</option>
                    <option value="Villa">Villa</option>
                    <option value="Studio">Studio</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3 bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-800/40 rounded-[2px] p-4 text-xs space-y-2">
              <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-400 font-bold">
                <span className="text-base">💡</span> Tips for Advert
              </div>
              <p className="text-[11px] text-amber-900/80 dark:text-amber-300/80 leading-relaxed">
                All marked <span className="text-red-500 font-bold">*</span> fields are mandatory. Complete details ensure faster verification and 5x more inquiries!
              </p>
            </div>
          </div>

          {/* Advert Information */}
          <div className="bg-white dark:bg-[#1e293b] border border-gray-200/90 dark:border-slate-800 rounded-[2px] shadow-2xs p-5 sm:p-6 space-y-4 text-xs transition-colors">
            <h2 className="text-xs font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-2">Advert Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-600 dark:text-gray-300 mb-1 font-medium">
                  Advert Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Family House For Sale"
                  value={formData.title}
                  onChange={(e) => handleFormChange('title', e.target.value)}
                  className={`w-full bg-white dark:bg-[#1e293b] border rounded-[2px] py-2 px-3 text-gray-800 dark:text-gray-200 outline-none font-medium transition-colors ${
                    step1Errors.title ? 'border-red-500 bg-red-50/20' : 'border-gray-200 dark:border-slate-700 hover:border-gray-400 dark:hover:border-slate-500'
                  }`}
                />
                {step1Errors.title && <span className="text-[10.5px] text-red-500 mt-1 block">{step1Errors.title}</span>}
              </div>

              <div>
                <label className="block text-gray-600 dark:text-gray-300 mb-1 font-medium">
                  Explanation <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Detailed property description..."
                  value={formData.description}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  className={`w-full bg-white dark:bg-[#1e293b] border rounded-[2px] py-2 px-3 text-gray-800 dark:text-gray-200 outline-none leading-relaxed transition-colors ${
                    step1Errors.description ? 'border-red-500 bg-red-50/20' : 'border-gray-200 dark:border-slate-700 hover:border-gray-400 dark:hover:border-slate-500'
                  }`}
                />
                {step1Errors.description && <span className="text-[10.5px] text-red-500 mt-1 block">{step1Errors.description}</span>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-1">
                <div>
                  <label className="block text-gray-600 dark:text-gray-300 mb-1 font-medium">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      placeholder="25.000.000"
                      value={formData.price}
                      onChange={(e) => handleFormChange('price', e.target.value)}
                      className={`flex-1 bg-white dark:bg-[#1e293b] border border-r-0 rounded-l-[2px] py-2 px-3 text-gray-800 dark:text-gray-200 outline-none font-bold ${
                        step1Errors.price ? 'border-red-500 bg-red-50/20' : 'border-gray-200 dark:border-slate-700'
                      }`}
                    />
                    <select
                      value={formData.currency}
                      onChange={(e) => handleFormChange('currency', e.target.value)}
                      className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-r-[2px] px-2.5 text-gray-700 dark:text-gray-200 outline-none font-bold cursor-pointer"
                    >
                      <option value="DZD">DZD (DA)</option>
                    </select>
                  </div>
                  {step1Errors.price && <span className="text-[10.5px] text-red-500 mt-1 block">{step1Errors.price}</span>}
                </div>

                <div>
                  <label className="block text-gray-600 dark:text-gray-300 mb-1 font-medium">
                    Gross M² <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="150"
                    value={formData.grossM2}
                    onChange={(e) => handleFormChange('grossM2', e.target.value)}
                    className={`w-full bg-white dark:bg-[#1e293b] border rounded-[2px] py-2 px-3 text-gray-800 dark:text-gray-200 outline-none ${
                      step1Errors.grossM2 ? 'border-red-500 bg-red-50/20' : 'border-gray-200 dark:border-slate-700 hover:border-gray-400 dark:hover:border-slate-500'
                    }`}
                  />
                  {step1Errors.grossM2 && <span className="text-[10.5px] text-red-500 mt-1 block">{step1Errors.grossM2}</span>}
                </div>

                <div>
                  <label className="block text-gray-600 dark:text-gray-300 mb-1 font-medium">
                    Net M² <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="135"
                    value={formData.netM2}
                    onChange={(e) => handleFormChange('netM2', e.target.value)}
                    className={`w-full bg-white dark:bg-[#1e293b] border rounded-[2px] py-2 px-3 text-gray-800 dark:text-gray-200 outline-none ${
                      step1Errors.netM2 ? 'border-red-500 bg-red-50/20' : 'border-gray-200 dark:border-slate-700 hover:border-gray-400 dark:hover:border-slate-500'
                    }`}
                  />
                  {step1Errors.netM2 && <span className="text-[10.5px] text-red-500 mt-1 block">{step1Errors.netM2}</span>}
                </div>

                <div>
                  <label className="block text-gray-600 dark:text-gray-300 mb-1 font-medium">
                    Room + Living Number <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.rooms}
                    onChange={(e) => handleFormChange('rooms', e.target.value)}
                    className="w-full bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-slate-700 rounded-[2px] py-2 px-3 text-gray-800 dark:text-gray-200 outline-none cursor-pointer"
                  >
                    <option value="1 + 0">1 + 0 (Studio)</option>
                    <option value="1 + 1">1 + 1</option>
                    <option value="2 + 1">2 + 1</option>
                    <option value="3 + 1">3 + 1</option>
                    <option value="4 + 1">4 + 1</option>
                    <option value="5 + 1">5 + 1</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-600 dark:text-gray-300 mb-1 font-medium">
                    Building Age <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 5"
                    value={formData.buildingAge}
                    onChange={(e) => handleFormChange('buildingAge', e.target.value)}
                    className={`w-full bg-white dark:bg-[#1e293b] border rounded-[2px] py-2 px-3 text-gray-800 dark:text-gray-200 outline-none ${
                      step1Errors.buildingAge ? 'border-red-500 bg-red-50/20' : 'border-gray-200 dark:border-slate-700 hover:border-gray-400 dark:hover:border-slate-500'
                    }`}
                  />
                  {step1Errors.buildingAge && <span className="text-[10.5px] text-red-500 mt-1 block">{step1Errors.buildingAge}</span>}
                </div>

                <div>
                  <label className="block text-gray-600 dark:text-gray-300 mb-1 font-medium">
                    Floor Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 3"
                    value={formData.floorLocation}
                    onChange={(e) => handleFormChange('floorLocation', e.target.value)}
                    className={`w-full bg-white dark:bg-[#1e293b] border rounded-[2px] py-2 px-3 text-gray-800 dark:text-gray-200 outline-none ${
                      step1Errors.floorLocation ? 'border-red-500 bg-red-50/20' : 'border-gray-200 dark:border-slate-700 hover:border-gray-400 dark:hover:border-slate-500'
                    }`}
                  />
                  {step1Errors.floorLocation && <span className="text-[10.5px] text-red-500 mt-1 block">{step1Errors.floorLocation}</span>}
                </div>

                <div>
                  <label className="block text-gray-600 dark:text-gray-300 mb-1 font-medium">Warming Type *</label>
                  <select
                    value={formData.heatingType}
                    onChange={(e) => handleFormChange('heatingType', e.target.value)}
                    className="w-full bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-slate-700 rounded-[2px] py-2 px-3 text-gray-800 dark:text-gray-200 outline-none cursor-pointer"
                  >
                    <option value="Natural Gas">Natural Gas</option>
                    <option value="Central">Central</option>
                    <option value="Central Gas">Central Gas</option>
                    <option value="Underfloor">Underfloor Heating</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-600 dark:text-gray-300 mb-1 font-medium">Available For Loan</label>
                  <select
                    value={formData.loanEligible}
                    onChange={(e) => handleFormChange('loanEligible', e.target.value)}
                    className="w-full bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-slate-700 rounded-[2px] py-2 px-3 text-gray-800 dark:text-gray-200 outline-none cursor-pointer"
                  >
                    <option value="Appropriate">Appropriate</option>
                    <option value="Not">Not</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-600 dark:text-gray-300 mb-1 font-medium">Furnished</label>
                  <select
                    value={formData.furnished}
                    onChange={(e) => handleFormChange('furnished', e.target.value)}
                    className="w-full bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-slate-700 rounded-[2px] py-2 px-3 text-gray-800 dark:text-gray-200 outline-none cursor-pointer"
                  >
                    <option value="Not">Not</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-600 dark:text-gray-300 mb-1 font-medium">Dues</label>
                  <input
                    type="text"
                    placeholder="1.200 $"
                    value={formData.dues}
                    onChange={(e) => handleFormChange('dues', e.target.value)}
                    className="w-full bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-slate-700 rounded-[2px] py-2 px-3 text-gray-800 dark:text-gray-200 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 dark:text-gray-300 mb-1 font-medium">Front</label>
                  <input
                    type="text"
                    placeholder="Northwest"
                    value={formData.front}
                    onChange={(e) => handleFormChange('front', e.target.value)}
                    className="w-full bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-slate-700 rounded-[2px] py-2 px-3 text-gray-800 dark:text-gray-200 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 dark:text-gray-300 mb-1 font-medium">Rental Income</label>
                  <input
                    type="text"
                    placeholder="2.000 $"
                    value={formData.rentalIncome}
                    onChange={(e) => handleFormChange('rentalIncome', e.target.value)}
                    className="w-full bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-slate-700 rounded-[2px] py-2 px-3 text-gray-800 dark:text-gray-200 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-white dark:bg-[#1e293b] border border-gray-200/90 dark:border-slate-800 rounded-[2px] shadow-2xs p-5 sm:p-6 space-y-4 text-xs transition-colors">
            <h2 className="text-xs font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-2">Localisation du Bien</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-600 dark:text-gray-300 mb-1 font-medium">
                  Wilaya <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Alger"
                  value={formData.city}
                  onChange={(e) => handleFormChange('city', e.target.value)}
                  className={`w-full bg-white dark:bg-[#1e293b] border rounded-[2px] py-2 px-3 text-gray-800 dark:text-gray-200 outline-none ${
                    step1Errors.city ? 'border-red-500 bg-red-50/20' : 'border-gray-200 dark:border-slate-700 hover:border-gray-400 dark:hover:border-slate-500'
                  }`}
                />
                {step1Errors.city && <span className="text-[10.5px] text-red-500 mt-1 block">{step1Errors.city}</span>}
              </div>

              <div>
                <label className="block text-gray-600 dark:text-gray-300 mb-1 font-medium">
                  Commune <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Hydra"
                  value={formData.district}
                  onChange={(e) => handleFormChange('district', e.target.value)}
                  className={`w-full bg-white dark:bg-[#1e293b] border rounded-[2px] py-2 px-3 text-gray-800 dark:text-gray-200 outline-none ${
                    step1Errors.district ? 'border-red-500 bg-red-50/20' : 'border-gray-200 dark:border-slate-700 hover:border-gray-400 dark:hover:border-slate-500'
                  }`}
                />
                {step1Errors.district && <span className="text-[10.5px] text-red-500 mt-1 block">{step1Errors.district}</span>}
              </div>

              <div>
                <label className="block text-gray-600 dark:text-gray-300 mb-1 font-medium">
                  Quartier / Adresse <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Val d’Hydra, Résidence les Pins"
                  value={formData.neighborhood}
                  onChange={(e) => handleFormChange('neighborhood', e.target.value)}
                  className={`w-full bg-white dark:bg-[#1e293b] border rounded-[2px] py-2 px-3 text-gray-800 dark:text-gray-200 outline-none ${
                    step1Errors.neighborhood ? 'border-red-500 bg-red-50/20' : 'border-gray-200 dark:border-slate-700 hover:border-gray-400 dark:hover:border-slate-500'
                  }`}
                />
                {step1Errors.neighborhood && <span className="text-[10.5px] text-red-500 mt-1 block">{step1Errors.neighborhood}</span>}
              </div>
            </div>
          </div>

          {/* Photos du Bien (Drag & Drop + File Upload) */}
          <div className="bg-white dark:bg-[#1e293b] border border-gray-200/90 dark:border-slate-800 rounded-[2px] shadow-2xs p-5 sm:p-6 space-y-4 transition-colors">
            <div className="border-b border-gray-100 dark:border-slate-800 pb-2 flex items-center justify-between">
              <h2 className="text-xs font-bold text-gray-900 dark:text-white">
                Photos de l&apos;Annonce (Photos du Bien)
              </h2>
              <span className="text-[11px] text-gray-400">
                {formData.images?.length || 0} photo(s) ajoutée(s)
              </span>
            </div>

            <ImageUploadDropzone
              images={formData.images || []}
              onChange={(updater) => {
                if (typeof updater === 'function') {
                  setFormData((prev) => ({ ...prev, images: updater(prev.images || []) }));
                } else {
                  setFormData((prev) => ({ ...prev, images: updater }));
                }
              }}
              maxImages={15}
              title="Photos du Bien"
              subtitle="Sélectionnez ou déposez vos photos pour valoriser votre annonce"
            />
          </div>

          {/* Proceed to Preview Button */}
          <div className="flex justify-center pt-2 pb-6">
            <button
              type="button"
              onClick={() => goToStep(2)}
              className="bg-[#E53935] hover:bg-[#d32f2f] text-white font-medium text-xs py-2.5 px-12 rounded-[3px] transition-colors shadow-xs cursor-pointer"
            >
              Proceed to Preview ➔
            </button>
          </div>

        </div>
      )}

      {/* 3. STEP 2: PREVIEW VIEW (👁️ EYE) */}
      {currentStep === 2 && (
        <div className="space-y-4">
          
          {/* Top Photo Preview Grid / Carousel */}
          <div className="max-w-[1060px] mx-auto px-4 sm:px-6 lg:px-8 mt-2">
            <div className="relative w-full rounded-[2px] overflow-hidden">
              <div className={`grid gap-3 h-64 sm:h-72 ${
                displayPhotos.length >= 3
                  ? 'grid-cols-1 sm:grid-cols-3'
                  : displayPhotos.length === 2
                  ? 'grid-cols-1 sm:grid-cols-2'
                  : 'grid-cols-1'
              }`}>
                {displayPhotos.slice(0, 3).map((photoUrl, idx) => (
                  <div key={idx} className="h-full overflow-hidden bg-gray-100 dark:bg-slate-800">
                    <img
                      src={photoUrl}
                      alt={`Photo ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>

              {displayPhotos.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevPhoto}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/70 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 text-gray-800 dark:text-white flex items-center justify-center shadow-sm cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <button
                    type="button"
                    onClick={nextPhoto}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/70 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 text-gray-800 dark:text-white flex items-center justify-center shadow-sm cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Main 900px Cards Container with Overlap */}
          <div className="max-w-[900px] mx-auto px-4 sm:px-6 space-y-4">
            
            {/* General Information Floating Card */}
            <div className="relative z-10 -mt-12 sm:-mt-16 bg-white dark:bg-[#1e293b] border border-gray-200/90 dark:border-slate-800 rounded-[2px] shadow-sm p-6 sm:p-8 space-y-5 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-gray-100 dark:border-slate-800 pb-4">
                <div>
                  <h1 className="text-xl sm:text-[22px] font-bold text-gray-900 dark:text-white tracking-tight">{formData.title}</h1>
                  <div className="flex items-center text-xs text-gray-400 dark:text-gray-400 mt-1">
                    <span className="text-amber-500 mr-1.5 text-sm">📍</span>
                    <span>{formData.city}, {formData.district}, {formData.neighborhood}</span>
                  </div>
                </div>
                <div className="text-xl sm:text-[22px] font-bold text-gray-900 dark:text-white sm:text-right">
                  {formData.price} {formData.currency}
                </div>
              </div>

              <div>
                <h2 className="text-xs font-bold text-gray-900 dark:text-white mb-3.5 tracking-tight">General Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-2 text-xs">
                  <div className="space-y-2">
                    <div className="flex justify-between py-0.5"><span className="text-gray-400 dark:text-gray-400">Advertise No</span><span className="font-semibold text-[#E53935]">O-1234</span></div>
                    <div className="flex justify-between py-0.5"><span className="text-gray-400 dark:text-gray-400">Published Date</span><span className="font-medium text-gray-800 dark:text-gray-200">2 December 2020</span></div>
                    <div className="flex justify-between py-0.5"><span className="text-gray-400 dark:text-gray-400">Advertise Status</span><span className="font-medium text-gray-800 dark:text-gray-200">{formData.listingType}</span></div>
                    <div className="flex justify-between py-0.5"><span className="text-gray-400 dark:text-gray-400">Housing Shape</span><span className="font-medium text-gray-800 dark:text-gray-200">{formData.category}</span></div>
                    <div className="flex justify-between py-0.5"><span className="text-gray-400 dark:text-gray-400">Room + Living Number</span><span className="font-medium text-gray-800 dark:text-gray-200">{formData.rooms}</span></div>
                    <div className="flex justify-between py-0.5"><span className="text-gray-400 dark:text-gray-400">Gross / Net M²</span><span className="font-medium text-gray-800 dark:text-gray-200">{formData.grossM2} M² / {formData.netM2} M²</span></div>
                    <div className="flex justify-between py-0.5"><span className="text-gray-400 dark:text-gray-400">Warming Type</span><span className="font-medium text-gray-800 dark:text-gray-200">{formData.heatingType}</span></div>
                    <div className="flex justify-between py-0.5"><span className="text-gray-400 dark:text-gray-400">Building Age</span><span className="font-medium text-gray-800 dark:text-gray-200">{formData.buildingAge}</span></div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between py-0.5"><span className="text-gray-400 dark:text-gray-400">Floor Location</span><span className="font-medium text-gray-800 dark:text-gray-200">{formData.floorLocation}</span></div>
                    <div className="flex justify-between py-0.5"><span className="text-gray-400 dark:text-gray-400">Available For Loan</span><span className="font-medium text-gray-800 dark:text-gray-200">{formData.loanEligible}</span></div>
                    <div className="flex justify-between py-0.5"><span className="text-gray-400 dark:text-gray-400">Furnished</span><span className="font-medium text-gray-800 dark:text-gray-200">{formData.furnished}</span></div>
                    <div className="flex justify-between py-0.5"><span className="text-gray-400 dark:text-gray-400">Dues</span><span className="font-medium text-gray-800 dark:text-gray-200">{formData.dues || '1.200 $'}</span></div>
                    <div className="flex justify-between py-0.5"><span className="text-gray-400 dark:text-gray-400">Swap</span><span className="font-medium text-gray-800 dark:text-gray-200">{formData.swap}</span></div>
                    <div className="flex justify-between py-0.5"><span className="text-gray-400 dark:text-gray-400">Front</span><span className="font-medium text-gray-800 dark:text-gray-200">{formData.front}</span></div>
                    <div className="flex justify-between py-0.5"><span className="text-gray-400 dark:text-gray-400">Rental Income</span><span className="font-medium text-gray-800 dark:text-gray-200">{formData.rentalIncome || '2.000 $'}</span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Explanation Card */}
            <div className="bg-white dark:bg-[#1e293b] border border-gray-200/90 dark:border-slate-800 rounded-[2px] shadow-sm p-6 sm:p-8 space-y-2.5 transition-colors">
              <h2 className="text-xs font-bold text-gray-900 dark:text-white">Explanation</h2>
              <p className="text-xs text-gray-400 dark:text-gray-300 leading-relaxed">{formData.description}</p>
            </div>

            {/* Features Card */}
            <div className="bg-white dark:bg-[#1e293b] border border-gray-200/90 dark:border-slate-800 rounded-[2px] shadow-sm p-6 sm:p-8 transition-colors">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-xs font-bold text-gray-900 dark:text-white mb-3.5">Interior Features</h2>
                  <div className="grid grid-cols-2 gap-y-2 text-xs text-gray-500 dark:text-gray-400">
                    {['ADSL', 'Alarm', 'Balcony', 'Barbecue', 'Laundry room', 'Wallpaper', 'Dressing Room', 'Video Intercom', 'Shower', 'Laminate', 'Panel Door', 'Blinds', 'Sauna', 'Satin Plaster', 'Satin Color', 'Ceramic Floor'].map((feat, idx) => (
                      <span key={idx} className="flex items-center gap-1.5"><span className="text-gray-400 dark:text-gray-500 text-[10px]">✓</span> {feat}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h2 className="text-xs font-bold text-gray-900 dark:text-white mb-3.5">External Features</h2>
                  <div className="grid grid-cols-2 gap-y-2 text-xs text-gray-500 dark:text-gray-400">
                    {['Elevator', 'Gardened', 'Fitness', 'Security', 'Thermal Insulation', 'Generator', 'Tennis Court', 'Car Park', 'PVC', 'Basketball Field', 'Market'].map((feat, idx) => (
                      <span key={idx} className="flex items-center gap-1.5"><span className="text-gray-400 dark:text-gray-500 text-[10px]">✓</span> {feat}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Actions */}
            <div className="flex justify-center gap-3 pt-2 pb-6">
              <button
                type="button"
                onClick={() => goToStep(1)}
                className="border border-gray-300 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-gray-700 dark:text-gray-200 font-medium text-xs py-2 px-10 rounded-[3px] transition-colors cursor-pointer"
              >
                Back to Edit
              </button>
              <button
                type="button"
                onClick={() => goToStep(3)}
                className="bg-[#E53935] hover:bg-[#d32f2f] text-white font-medium text-xs py-2 px-14 rounded-[3px] transition-colors shadow-xs cursor-pointer"
              >
                Next
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 4. STEP 3: CONTACT FORM (📞 PHONE) */}
      {/* 4. STEP 3: CONTACT FORM (📱 PHONE) */}
      {currentStep === 3 && (
        <div className="max-w-[650px] mx-auto px-4 sm:px-6 mt-4 space-y-4">
          
          {/* Main Contact Card */}
          <div className="bg-white dark:bg-[#1e293b] border border-gray-200/90 dark:border-slate-800 rounded-xl shadow-sm p-6 sm:p-8 space-y-6 transition-colors">
            <div className="border-b border-gray-100 dark:border-slate-800 pb-4">
              <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                <span>📱</span>
                <span>Numéro de Téléphone Mobile / Contact</span>
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Renseignez votre numéro de mobile pour permettre aux acheteurs et locataires de vous contacter directement (Appel &amp; WhatsApp).
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="mobile1" className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Numéro de Téléphone Mobile <span className="text-red-500">*</span>
                </label>
                
                <div className="relative">
                  <input
                    type="tel"
                    id="mobile1"
                    value={contactData.mobile1}
                    onChange={(e) => handleContactChange('mobile1', e.target.value)}
                    placeholder="ex: 0799999999 ou +213777777777"
                    className={`w-full bg-gray-50 dark:bg-slate-900 border rounded-xl py-3 pl-4 pr-10 text-sm text-gray-900 dark:text-white outline-none transition-all ${
                      step3Errors.mobile1
                        ? 'border-red-500 bg-red-50/30 dark:bg-red-950/20'
                        : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 focus:border-[#E53935] focus:ring-2 focus:ring-[#E53935]/15'
                    }`}
                  />
                  
                  {/* Live checkmark when format is valid */}
                  {contactData.mobile1 && !step3Errors.mobile1 && /^(0[0-9]{9}|\+213[0-9]{9})$/.test(contactData.mobile1.trim().replace(/[\s\-_()]/g, '')) && (
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-green-500 text-sm font-bold">
                      ✓
                    </span>
                  )}
                </div>

                {step3Errors.mobile1 && (
                  <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1 font-medium">
                    <span>⚠️</span>
                    <span>{step3Errors.mobile1}</span>
                  </p>
                )}

                {/* Format Guidance Box */}
                <div className="mt-3.5 bg-gray-50 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-700/80 rounded-lg p-3 text-[11.5px] text-gray-600 dark:text-gray-400 space-y-1.5">
                  <div className="font-semibold text-gray-700 dark:text-gray-300">
                    Formats acceptés :
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-white dark:bg-slate-700 px-2 py-0.5 rounded border border-gray-200 dark:border-slate-600 font-mono text-gray-800 dark:text-gray-200">
                      0799999999
                    </span>
                    <span className="text-[11px] text-gray-400">Format national à 10 chiffres (ex: 05..., 06..., 07...)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-white dark:bg-slate-700 px-2 py-0.5 rounded border border-gray-200 dark:border-slate-600 font-mono text-gray-800 dark:text-gray-200">
                      +213777777777
                    </span>
                    <span className="text-[11px] text-gray-400">Format international (+213 suivi de 9 chiffres)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Actions */}
          <div className="flex justify-center gap-3 pt-3 pb-6">
            <button
              type="button"
              onClick={() => goToStep(2)}
              disabled={isPublishing}
              className="border border-gray-300 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-gray-700 dark:text-gray-200 font-medium text-xs py-2.5 px-10 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              ← Retour à la Prévisualisation
            </button>
            <button
              type="button"
              onClick={handlePublish}
              disabled={isPublishing}
              className="bg-[#E53935] hover:bg-[#d32f2f] text-white font-bold text-xs py-2.5 px-14 rounded-lg transition-colors shadow-sm disabled:opacity-50 cursor-pointer flex items-center gap-2"
            >
              {isPublishing ? (
                <>
                  <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Publication en cours...</span>
                </>
              ) : (
                <span>Publier l&apos;Annonce ➔</span>
              )}
            </button>
          </div>

        </div>
      )}

      {/* 5. STEP 4: PUBLISHED SUCCESS (✔️ CHECKMARK) */}
      {currentStep === 4 && (
        <div className="max-w-[700px] mx-auto px-4 text-center pt-20 sm:pt-24 space-y-5">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-950/60 flex items-center justify-center text-green-600 dark:text-green-400">
              <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white tracking-tight">
            Votre annonce a été publiée avec succès !
          </h1>

          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-normal max-w-md mx-auto">
            Votre bien immobilier est désormais visible par des milliers d’acheteurs et locataires sur Makan Algérie ainsi que dans votre tableau de bord.
          </p>

          {createdProperty && (
            <div className="max-w-[420px] mx-auto bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-slate-800 rounded-lg p-4 shadow-xs text-left text-xs space-y-1">
              <div className="font-bold text-gray-900 dark:text-white line-clamp-1">{createdProperty.title}</div>
              <div className="text-gray-500 dark:text-gray-400">{createdProperty.commune || 'Centre'}, {createdProperty.wilaya || 'Alger'} • <span className="text-[#E53935] font-semibold">{createdProperty.price?.toLocaleString('fr-DZ')} DZD</span></div>
            </div>
          )}

          <div className="pt-4 flex flex-wrap justify-center gap-3">
            <Link
              href={
                createdProperty
                  ? (createdProperty.rentOrSale === 'daily_rental'
                      ? `/daily-rental/${createdProperty._id}`
                      : createdProperty.rentOrSale === 'rent'
                      ? `/for-rent/${createdProperty._id}`
                      : `/for-sale/${createdProperty._id}`)
                  : '/for-sale'
              }
              className="bg-[#E53935] hover:bg-[#d32f2f] text-white text-xs font-semibold px-6 py-2.5 rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
            >
              <span>👁️</span>
              <span>Voir dans les annonces</span>
            </Link>

            <Link
              href="/dashboard"
              className="bg-gray-900 hover:bg-gray-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-semibold px-6 py-2.5 rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
            >
              <span>📊</span>
              <span>Gestion de mes Annonces</span>
            </Link>

            <button
              type="button"
              onClick={() => {
                setFormData({
                  listingType: 'For Sale',
                  category: 'Apartment',
                  title: '',
                  description: '',
                  price: '',
                  currency: 'DZD',
                  grossM2: '',
                  netM2: '',
                  rooms: '4 + 1',
                  buildingAge: '',
                  floorLocation: '',
                  totalFloors: '',
                  heatingType: 'Natural Gas',
                  loanEligible: 'Appropriate',
                  furnished: 'Not',
                  dues: '',
                  swap: 'Not',
                  front: 'Northwest',
                  rentalIncome: '',
                  city: 'Alger',
                  district: 'Hydra',
                  neighborhood: '',
                  images: []
                });
                setContactData({
                  mobile1: ''
                });
                setCreatedProperty(null);
                setStep1Errors({});
                setStep3Errors({});
                setCurrentStep(1);
              }}
              className="border border-gray-300 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-gray-700 dark:text-gray-200 text-xs font-semibold px-6 py-2.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>➕</span>
              <span>Publier une autre annonce</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
