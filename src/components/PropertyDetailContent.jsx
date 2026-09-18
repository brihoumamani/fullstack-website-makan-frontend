'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import SendMessageModal from './SendMessageModal';
import PropertyMap from './PropertyMap';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

function getWhatsAppUrl(phone, propertyTitle = '') {
  if (!phone) return '';
  let digits = String(phone).replace(/\D/g, '');
  if (!digits) return '';

  if (digits.startsWith('0') && digits.length === 10) {
    digits = '213' + digits.substring(1);
  } else if (!digits.startsWith('213') && digits.length === 9) {
    digits = '213' + digits;
  }

  const defaultMsg = propertyTitle
    ? `Bonjour, je vous contacte via MAKAN concernant votre annonce : "${propertyTitle}". Est-elle toujours disponible ?`
    : `Bonjour, je vous contacte via la plateforme MAKAN Immobilier Algérie.`;

  return `https://wa.me/${digits}?text=${encodeURIComponent(defaultMsg)}`;
}

export default function PropertyDetailContent({ propertyId = '1', rentOrSale = 'sale' }) {
  const { user, isAuthenticated, toggleFavorite } = useAuth();
  const isDaily = rentOrSale === 'daily' || rentOrSale === 'daily_rental' || String(propertyId).startsWith('daily');
  const isRental = rentOrSale === 'rent' || String(propertyId).startsWith('rent');

  // Modals & Interactivity State
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [dbProperty, setDbProperty] = useState(null);

  // Fetch real property by ID from backend
  useEffect(() => {
    async function fetchProperty() {
      if (!propertyId) return;
      try {
        const res = await fetch(`${API_BASE}/api/properties/${propertyId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.data) {
            setDbProperty(data.data);
          }
        }
      } catch (err) {
        // Continue with localized default property
      }
    }

    fetchProperty();
  }, [propertyId]);

  // Specific image sets for Sales vs Rental vs Daily Rental
  const dailyImages = [
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80'
  ];

  const salesImages = [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80'
  ];

  const rentalImages = [
    'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80'
  ];

  const images = (dbProperty?.images && dbProperty.images.length > 0)
    ? dbProperty.images
    : (isDaily ? dailyImages : (isRental ? rentalImages : salesImages));

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Property Details according to page type (100% Localized to Algeria)
  const title = dbProperty?.title || (
    isDaily 
      ? 'Studio & Suite Meublée Standing - Sidi Yahia' 
      : (isRental ? 'Villa Moderne Contemporaine - Canastel' : 'Appartement Haut Standing F4 - Val d’Hydra')
  );

  const location = dbProperty?.commune && dbProperty?.wilaya
    ? `${dbProperty.commune}, Wilaya d’${dbProperty.wilaya}`
    : (
      isDaily 
        ? 'Alger, Sidi Yahia, Wilaya d’Alger' 
        : (isRental ? 'Oran, Canastel, Wilaya d’Oran' : 'Alger, Val d’Hydra, Wilaya d’Alger')
    );

  const price = dbProperty?.price
    ? (isDaily ? `${Number(dbProperty.price).toLocaleString('fr-DZ')} DZD / nuit` : isRental ? `${Number(dbProperty.price).toLocaleString('fr-DZ')} DZD / mois` : `${Number(dbProperty.price).toLocaleString('fr-DZ')} DZD`)
    : (
      isDaily 
        ? '12.000 DZD / nuit' 
        : (isRental ? '280.000 DZD / mois' : '42.000.000 DZD')
    );

  const advertNo = `DZ-16-${String(propertyId).slice(-4) || '4029'}`;
  const advertDate = isDaily ? '28 Février 2026' : (isRental ? '15 Janvier 2026' : '10 Mars 2026');
  const realEstateStatus = isDaily ? 'Location Journalière' : (isRental ? 'Location Mensuelle' : 'Vente');
  const housingShape = isDaily ? 'Studio Meublé' : (isRental ? 'Villa R+2' : 'Appartement F4');
  const rooms = dbProperty?.beds ? `${dbProperty.beds} Pièces` : (isDaily ? '1 + 1' : (isRental ? '4 + 1' : '3 + 1'));
  const floorLocation = isDaily ? '2ème étage' : (isRental ? 'R+2' : '4ème étage');
  const grossNet = dbProperty?.sqm ? `${dbProperty.sqm} m²` : (isDaily ? '65 m² / 55 m²' : (isRental ? '380 m² / 320 m²' : '150 m² / 135 m²'));
  const warmingType = 'Chauffage Central (Gaz de ville)';
  const buildingAge = '2 ans (Neuf)';
  const furnished = isDaily ? 'Oui (Haut Standing)' : (isRental ? 'Semi-meublé' : 'Non');
  const front = 'Sud-Est (Vue Dégagée)';
  const loanAppropriate = 'Acte Notarié & Livret Foncier';
  const dues = '8.000 DZD / mois';
  const swap = 'Non';
  const rentalIncome = '250.000 DZD / mois';

  const agentName = dbProperty?.agentId?.name || 'Karim Mansouri';
  const agentRole = 'Agent Immobilier Agréé (Makan Algérie)';
  const agentAvatar = dbProperty?.agentId?.photo || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80';
  const agentPhone = dbProperty?.agentId?.phone || '+213 550 12 34 56';

  // Coordinate setup for the property-specific Leaflet map
  const propertyCoordinates = useMemo(() => {
    if (dbProperty?.location?.coordinates && Array.isArray(dbProperty.location.coordinates)) {
      return dbProperty.location.coordinates; // [lng, lat]
    }
    // Specific coordinates per property type / location
    if (isDaily) return [3.0335, 36.7382]; // Sidi Yahia, Algiers
    if (isRental) return [-0.5645, 35.7335]; // Canastel, Oran
    return [3.0418, 36.7441]; // Hydra, Algiers
  }, [dbProperty, isDaily, isRental]);

  const singlePropertyMapData = useMemo(() => {
    return [
      {
        _id: propertyId,
        title: title,
        price: dbProperty?.price || (isDaily ? 12000 : (isRental ? 280000 : 42000000)),
        rentOrSale: isDaily ? 'daily_rental' : (isRental ? 'rent' : 'sale'),
        type: isRental ? 'villa' : 'apartment',
        address: location,
        commune: isDaily ? 'Sidi Yahia' : (isRental ? 'Canastel' : 'Hydra'),
        wilaya: isRental ? 'Oran' : 'Alger',
        beds: dbProperty?.beds || (isDaily ? 1 : 4),
        sqm: dbProperty?.sqm || (isDaily ? 65 : 150),
        images: images,
        location: {
          type: 'Point',
          coordinates: propertyCoordinates
        }
      }
    ];
  }, [propertyId, title, dbProperty, isDaily, isRental, location, images, propertyCoordinates]);

  const effectivePropertyData = useMemo(() => {
    return dbProperty || {
      _id: propertyId,
      title,
      price: dbProperty?.price || (isDaily ? 12000 : (isRental ? 280000 : 42000000)),
      rentOrSale: isDaily ? 'daily_rental' : (isRental ? 'rent' : 'sale'),
      type: isRental ? 'villa' : 'apartment',
      address: location,
      commune: isDaily ? 'Sidi Yahia' : (isRental ? 'Canastel' : 'Hydra'),
      wilaya: isRental ? 'Oran' : 'Alger',
      beds: dbProperty?.beds || (isDaily ? 1 : 4),
      sqm: dbProperty?.sqm || (isDaily ? 65 : 150),
      images: images
    };
  }, [dbProperty, propertyId, title, isDaily, isRental, location, images]);

  const isLiked = Boolean(
    user?.favorites?.some((fav) => {
      if (!fav) return false;
      const favId = typeof fav === 'object' ? (fav._id || fav.id) : fav;
      if (String(favId) === String(propertyId) || (dbProperty && String(favId) === String(dbProperty._id))) return true;
      if (typeof fav === 'object' && fav.title && title) {
        return fav.title.trim().toLowerCase() === title.trim().toLowerCase();
      }
      return false;
    })
  );

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      alert('Veuillez vous connecter pour enregistrer ce bien dans vos favoris.');
      return;
    }

    await toggleFavorite(dbProperty?._id || propertyId, effectivePropertyData);
  };

  return (
    <div className="w-full bg-[#FAFAFA] dark:bg-[#0f172a] min-h-screen py-8 transition-colors duration-200 relative">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* 1. Header: Title, Address, Price & Favorite Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              {title}
            </h1>
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span className="text-amber-500 mr-1">📍</span>
              <span>{location}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:justify-end">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              {price}
            </div>
            <button
              type="button"
              onClick={handleFavoriteClick}
              aria-label={isLiked ? "Retirer des favoris" : "Enregistrer dans les favoris"}
              title={isLiked ? "Retirer des favoris" : "Enregistrer dans les favoris"}
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all shrink-0 cursor-pointer shadow-xs ${
                isLiked
                  ? 'bg-red-50 dark:bg-red-950/60 border-red-200 dark:border-red-900/60 text-[#E53935]'
                  : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-400 hover:text-[#E53935] hover:border-red-200 hover:bg-red-50/50 dark:hover:bg-red-950/30'
              }`}
            >
              <svg
                className={`w-5 h-5 transition-transform active:scale-125 ${
                  isLiked ? 'fill-[#E53935] text-[#E53935]' : 'fill-none stroke-current'
                }`}
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* 2. Media Gallery + Agent Contact Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Gallery (Left 9 cols on desktop) */}
          <div className="lg:col-span-9 space-y-3">
            {/* Big Main Image */}
            <div className="relative w-full aspect-[16/10] bg-gray-200 dark:bg-slate-800 rounded-[2px] overflow-hidden group">
              <img
                src={images[activeImageIndex]}
                alt="Property main preview"
                className="w-full h-full object-cover transition-all duration-300"
              />
              
              {/* Previous Arrow */}
              <button
                type="button"
                onClick={prevImage}
                aria-label="Previous photo"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm transition-colors cursor-pointer z-10"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Next Arrow */}
              <button
                type="button"
                onClick={nextImage}
                aria-label="Next photo"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm transition-colors cursor-pointer z-10"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Thumbnails Row */}
            <div className="grid grid-cols-5 gap-3">
              {images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`aspect-[4/3] rounded-[2px] overflow-hidden border-2 transition-all cursor-pointer ${
                    activeImageIndex === idx
                      ? 'border-[#0088cc] scale-[1.02]'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Agent Card Matching Reference Screenshot (Right 3 cols on desktop) */}
          <div className="lg:col-span-3 bg-white dark:bg-[#1e293b] border border-gray-200/90 dark:border-slate-800 rounded-[2px] shadow-sm p-6 flex flex-col items-center text-center space-y-4 relative overflow-hidden transition-colors">
            
            {/* Top-Left Ribbon Tag */}
            <div className="absolute top-0 left-3 z-10">
              <div className="bg-[#EF5350] text-white text-[9px] font-bold px-1.5 py-1.5 shadow-sm">
                ★
              </div>
            </div>

            {/* Agent Avatar with Golden Ring */}
            <div className="relative mt-2">
              <div className="w-24 h-24 rounded-full border-[3px] border-[#FBC02D] p-0.5 overflow-hidden shadow-sm">
                <img
                  src={agentAvatar}
                  alt={agentName}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-[#FBC02D] text-white text-[9px] font-extrabold uppercase px-2 py-0.2 rounded-full tracking-wider shadow-xs">
                PREMIUM
              </div>
            </div>

            {/* Agent Info */}
            <div className="pt-1">
              <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                {agentName}
              </h3>
              <p className="text-xs text-gray-400 dark:text-gray-400 mt-0.5">
                {agentRole}
              </p>
            </div>

            {/* Contact Action Buttons */}
            <div className="w-full space-y-2.5 pt-2">
              {/* 1. CHAT ON WHATSAPP Button */}
              {agentPhone && (
                <a
                  href={getWhatsAppUrl(agentPhone, title)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white py-2.5 px-4 rounded-[2px] text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs"
                >
                  <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.991.54 1.777.834 2.796.834 3.185 0 5.772-2.586 5.772-5.766 0-3.18-2.587-5.766-5.772-5.766zm9.969 5.766c0 5.405-4.394 9.799-9.799 9.799-1.636 0-3.167-.406-4.524-1.121l-5.677 1.488 1.516-5.539c-.808-1.428-1.272-3.08-1.272-4.839 0-5.405 4.394-9.799 9.799-9.799 5.405 0 9.799 4.394 9.799 9.799zm-4.706 3.864c-.218-.109-1.288-.636-1.488-.709-.199-.073-.344-.109-.489.109-.145.218-.562.709-.689.855-.127.145-.254.164-.472.055-.218-.109-.92-.339-1.752-1.08-.648-.577-1.085-1.29-1.212-1.508-.127-.218-.014-.336.095-.444.098-.098.218-.255.327-.382.109-.127.145-.218.218-.364.073-.145.036-.273-.018-.382-.055-.109-.489-1.181-.67-1.617-.177-.425-.357-.367-.489-.374l-.417-.008c-.145 0-.382.055-.581.273-.199.218-.763.746-.763 1.82 0 1.074.781 2.11 0.89 2.256.109.145 1.536 2.345 3.722 3.289.52.224.926.358 1.243.458.523.166.999.143 1.375.087.419-.063 1.288-.527 1.469-1.036.181-.509.181-.945.127-1.036-.054-.09-.199-.145-.417-.254z"/>
                  </svg>
                  <span>CHAT ON WHATSAPP</span>
                </a>
              )}

              {/* 2. VIEW PHONE Button */}
              <button
                type="button"
                onClick={() => setShowPhone(!showPhone)}
                className="w-full bg-[#66BB6A] hover:bg-[#57a95b] text-white py-2 px-4 rounded-[2px] text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21c1.12.45 2.33.69 3.48.69a1 1 0 011 1v3.5a1 1 0 01-1 1A17.91 17.91 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.15.24 2.36.69 3.48a1 1 0 01-.21 1.11l-2.2 2.2z"/>
                </svg>
                <span>{showPhone ? agentPhone : 'VIEW PHONE'}</span>
              </button>

              {/* 3. SEND MESSAGE Button */}
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

        {/* 3. General Information Specs Card */}
        <div className="bg-white dark:bg-[#1e293b] border border-gray-200/90 dark:border-slate-800 rounded-[2px] shadow-sm p-6 sm:p-8 transition-colors">
          <h2 className="text-base font-bold text-gray-900 dark:text-white mb-5 border-b border-gray-100 dark:border-slate-800 pb-3">
            General Information
          </h2>
          
          {isDaily ? (
            /* Daily Rental Specific 2-Column Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-12 text-xs max-w-2xl">
              <div className="space-y-2.5">
                <div className="flex justify-between py-1 border-b border-gray-50 dark:border-slate-800/80">
                  <span className="text-gray-400 dark:text-gray-400">Advertise No</span>
                  <span className="font-medium text-[#E53935]">{advertNo}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-50 dark:border-slate-800/80">
                  <span className="text-gray-400 dark:text-gray-400">Published Date</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">{advertDate}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-50 dark:border-slate-800/80">
                  <span className="text-gray-400 dark:text-gray-400">Advertise Status</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">{realEstateStatus}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-50 dark:border-slate-800/80">
                  <span className="text-gray-400 dark:text-gray-400">Housing Shape</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">{housingShape}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-50 dark:border-slate-800/80">
                  <span className="text-gray-400 dark:text-gray-400">Room + Living Number</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">{rooms}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-50 dark:border-slate-800/80">
                  <span className="text-gray-400 dark:text-gray-400">Gross / Net M²</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">{grossNet}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-50 dark:border-slate-800/80">
                  <span className="text-gray-400 dark:text-gray-400">Warming Type</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">{warmingType}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-50 dark:border-slate-800/80">
                  <span className="text-gray-400 dark:text-gray-400">Building Age</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">{buildingAge}</span>
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="flex justify-between py-1 border-b border-gray-50 dark:border-slate-800/80">
                  <span className="text-gray-400 dark:text-gray-400">Floor Location</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">{floorLocation}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-50 dark:border-slate-800/80">
                  <span className="text-gray-400 dark:text-gray-400">Furnished</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">{furnished}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-50 dark:border-slate-800/80">
                  <span className="text-gray-400 dark:text-gray-400">Front</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">{front}</span>
                </div>
              </div>
            </div>
          ) : (
            /* Standard 3-Column Grid for Sale / Rent */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-3 gap-x-8 text-xs">
              <div className="flex justify-between py-1.5 border-b border-gray-50 dark:border-slate-800/80">
                <span className="text-gray-400 dark:text-gray-400">Advertise No</span>
                <span className="font-medium text-[#E53935]">{advertNo}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-50 dark:border-slate-800/80">
                <span className="text-gray-400 dark:text-gray-400">Floor Location</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{floorLocation}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-50 dark:border-slate-800/80">
                <span className="text-gray-400 dark:text-gray-400">Published Date</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{advertDate}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-50 dark:border-slate-800/80">
                <span className="text-gray-400 dark:text-gray-400">Available for Loan</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{loanAppropriate}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-gray-50 dark:border-slate-800/80">
                <span className="text-gray-400 dark:text-gray-400">Advertise Status</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{realEstateStatus}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-50 dark:border-slate-800/80">
                <span className="text-gray-400 dark:text-gray-400">Furnished</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{furnished}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-50 dark:border-slate-800/80">
                <span className="text-gray-400 dark:text-gray-400">Housing Shape</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{housingShape}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-50 dark:border-slate-800/80">
                <span className="text-gray-400 dark:text-gray-400">Dues</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{dues}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-gray-50 dark:border-slate-800/80">
                <span className="text-gray-400 dark:text-gray-400">Room + Living Number</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{rooms}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-50 dark:border-slate-800/80">
                <span className="text-gray-400 dark:text-gray-400">Swap</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{swap}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-50 dark:border-slate-800/80">
                <span className="text-gray-400 dark:text-gray-400">Gross / Net M²</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{grossNet}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-50 dark:border-slate-800/80">
                <span className="text-gray-400 dark:text-gray-400">Front</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{front}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-gray-50 dark:border-slate-800/80">
                <span className="text-gray-400 dark:text-gray-400">Warming Type</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{warmingType}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-50 dark:border-slate-800/80">
                <span className="text-gray-400 dark:text-gray-400">Rental Income</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{rentalIncome}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-50 dark:border-slate-800/80">
                <span className="text-gray-400 dark:text-gray-400">Building Age</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{buildingAge}</span>
              </div>
            </div>
          )}
        </div>

        {/* 4. Explanation / Description */}
        <div className="bg-white dark:bg-[#1e293b] border border-gray-200/90 dark:border-slate-800 rounded-[2px] shadow-sm p-6 sm:p-8 transition-colors">
          <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-slate-800 pb-3">
            Description du Bien
          </h2>
          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed max-w-4xl">
            {dbProperty?.description || (
              isDaily
                ? 'Charmant studio haut standing meublé situé dans le quartier prisé de Sidi Yahia à Alger. Idéal pour séjours professionnels, touristiques ou vacances. Équipé d’une connexion Wi-Fi fibre optique, kitchenette moderne, smart TV, literie hôtelière et climatisation réversible. Proximité immédiate des commerces, restaurants et accès autoroutiers.'
                : isRental
                ? 'Superbe villa moderne contemporaine R+2 située dans le quartier résidentiel calme et sécurisé de Canastel à Oran. Comprend un grand salon lumineux avec baies vitrées, cuisine moderne équipée, 4 chambres spacieuses dont une suite parentale avec dressing, jardin avec piscine privative et garage double.'
                : 'Magnifique appartement F4 haut standing situé au Val d’Hydra, Alger. Belles finitions modernes, salon spacieux avec vue dégagée sans vis-à-vis, cuisine équipée haut de gamme, chauffage central, bâche à eau collective, ascenseur et place de parking en sous-sol. Quartier résidentiel ultra sécurisé.'
            )}
          </p>
        </div>

        {/* 5. Features Grid (Interior & External) */}
        <div className="bg-white dark:bg-[#1e293b] border border-gray-200/90 dark:border-slate-800 rounded-[2px] shadow-sm p-6 sm:p-8 transition-colors">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Interior Features */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-slate-800 pb-2">
                Équipements Intérieurs
              </h3>
              <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs text-gray-600 dark:text-gray-300">
                <span className="flex items-center gap-1.5"><span className="text-green-600">✓</span> Wi-Fi Fibre Optique</span>
                <span className="flex items-center gap-1.5"><span className="text-green-600">✓</span> Chauffage Central</span>
                <span className="flex items-center gap-1.5"><span className="text-green-600">✓</span> Climatisation Split</span>
                <span className="flex items-center gap-1.5"><span className="text-green-600">✓</span> Cuisine Équipée</span>
                <span className="flex items-center gap-1.5"><span className="text-green-600">✓</span> Porte Blindée</span>
                <span className="flex items-center gap-1.5"><span className="text-green-600">✓</span> Vidéophone</span>
                <span className="flex items-center gap-1.5"><span className="text-green-600">✓</span> Dressing Intégré</span>
                <span className="flex items-center gap-1.5"><span className="text-green-600">✓</span> Double Vitrage</span>
              </div>
            </div>

            {/* External Features */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-slate-800 pb-2">
                Équipements Extérieurs & Sécurité
              </h3>
              <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs text-gray-600 dark:text-gray-300">
                <span className="flex items-center gap-1.5"><span className="text-green-600">✓</span> Bâche à Eau (Réservoir)</span>
                <span className="flex items-center gap-1.5"><span className="text-green-600">✓</span> Ascenseur</span>
                <span className="flex items-center gap-1.5"><span className="text-green-600">✓</span> Gardiennage 24/7</span>
                <span className="flex items-center gap-1.5"><span className="text-green-600">✓</span> Caméras de Surveillance</span>
                <span className="flex items-center gap-1.5"><span className="text-green-600">✓</span> Place de Parking Sous-sol</span>
                <span className="flex items-center gap-1.5"><span className="text-green-600">✓</span> Groupe Électrogène</span>
              </div>
            </div>
          </div>
        </div>

        {/* 6. Property-Specific Location on Map (Leaflet + OpenStreetMap) */}
        <div className="bg-white dark:bg-[#1e293b] border border-gray-200/90 dark:border-slate-800 rounded-[2px] shadow-sm p-6 sm:p-8 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b border-gray-100 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                Localisation sur la carte
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                📍 {location}
              </p>
            </div>
            <Link
              href="/search-map"
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold flex items-center gap-1"
            >
              <span>Ouvrir dans la carte interactive</span>
              <span>→</span>
            </Link>
          </div>

          <div className="w-full h-80 rounded-[4px] overflow-hidden border border-gray-200 dark:border-slate-700 shadow-inner">
            <PropertyMap
              properties={singlePropertyMapData}
              singlePropertyMode={true}
              height="100%"
              width="100%"
            />
          </div>
        </div>

      </div>

      {/* Floating Bottom-Right Phone Badge */}
      {showPhone && (
        <div className="fixed bottom-5 right-5 z-40 bg-[#66BB6A] text-white px-4 py-2.5 rounded-full shadow-2xl flex items-center space-x-2 text-xs font-bold animate-in slide-in-from-bottom-3 duration-200">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21c1.12.45 2.33.69 3.48.69a1 1 0 011 1v3.5a1 1 0 01-1 1A17.91 17.91 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.15.24 2.36.69 3.48a1 1 0 01-.21 1.11l-2.2 2.2z"/>
          </svg>
          <span>{agentPhone}</span>
        </div>
      )}

      {/* Send Message to Advertiser Modal */}
      <SendMessageModal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        agentName={agentName}
        agentRole={agentRole}
        agentAvatar={agentAvatar}
        advertNo={advertNo}
      />
    </div>
  );
}
