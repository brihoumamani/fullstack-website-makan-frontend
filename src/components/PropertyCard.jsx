'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';

// Sample curated gallery pool for rich card slideshow
const CURATED_GALLERY = [
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'
];

export default function PropertyCard({ property }) {
  const { t } = useLanguage();
  const { user, isAuthenticated, toggleFavorite } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const {
    _id = '1',
    title = 'Appartement Haut Standing',
    price = 25000000,
    rentOrSale = 'sale',
    type = 'apartment',
    address = '14 Boulevard du 11 Décembre',
    commune = 'Hydra',
    wilaya = 'Alger',
    city = 'Alger',
    rooms = '3+1',
    beds = 3,
    baths = 2,
    sqm,
    sqft = 120,
    image = 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
    images = []
  } = property || {};

  // Form a multi-image gallery for this property
  const propertyGallery = (images && images.length > 1)
    ? images
    : image
    ? [image, ...CURATED_GALLERY.filter((img) => img !== image).slice(0, 3)]
    : CURATED_GALLERY.slice(0, 4);

  const formattedPrice = typeof price === 'number'
    ? `${price.toLocaleString('fr-DZ')} DZD`
    : `${price} DZD`;

  const isDaily = rentOrSale === 'daily_rental' || rentOrSale === 'daily';
  const isRent = rentOrSale === 'rent';

  const targetLink = isDaily
    ? `/daily-rental/${_id}`
    : isRent
    ? `/for-rent/${_id}`
    : `/for-sale/${_id}`;

  const areaValue = sqm || sqft;
  const displayLocation = commune
    ? `${commune}, ${wilaya || city || 'Alger'}`
    : `${address}, ${city || wilaya || 'Alger'}`;

  const bedCount = typeof rooms === 'string' && rooms.includes('+') ? rooms.split('+')[0] : rooms;

  // Next / Prev Image Handlers
  const handlePrevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? propertyGallery.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === propertyGallery.length - 1 ? 0 : prev + 1));
  };

  // Touch Swipe Handlers
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 35) {
      // Swiped Left -> Next Image
      e.preventDefault();
      setCurrentImageIndex((prev) => (prev === propertyGallery.length - 1 ? 0 : prev + 1));
    } else if (diff < -35) {
      // Swiped Right -> Prev Image
      e.preventDefault();
      setCurrentImageIndex((prev) => (prev === 0 ? propertyGallery.length - 1 : prev - 1));
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  const isLiked = Boolean(
    user?.favorites?.some((fav) => {
      if (!fav) return false;
      const favId = typeof fav === 'object' ? (fav._id || fav.id) : fav;
      if (String(favId) === String(_id)) return true;
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

    await toggleFavorite(_id, property);
  };

  return (
    <div className="bg-white dark:bg-[#1e293b] border border-gray-200/80 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden h-full group select-none">
      
      {/* Top Image Container with Multi-Photo Swipe Carousel */}
      <div
        className="relative w-full aspect-[16/11] bg-gray-100 dark:bg-slate-800 overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Link href={targetLink} className="block w-full h-full">
          <img
            src={propertyGallery[currentImageIndex]}
            alt={`${title} - Photo ${currentImageIndex + 1}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
        </Link>

        {/* POPULAR Ribbon Badge (Bottom Left of Image) */}
        <div className="absolute bottom-0 left-0 z-10 pointer-events-none">
          <div className="bg-[#6366F1] text-white text-[10.5px] font-extrabold uppercase px-3.5 py-1.5 rounded-tr-xl flex items-center space-x-1.5 shadow-md tracking-wider">
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2l2.4 7.4h7.6l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4-6.2-4.5h7.6z" />
            </svg>
            <span>{t('popular')}</span>
          </div>
        </div>

        {/* Swipe Arrow Buttons on Hover */}
        {propertyGallery.length > 1 && (
          <>
            {/* Left Arrow */}
            <button
              type="button"
              onClick={handlePrevImage}
              aria-label="Previous photo"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/45 hover:bg-black/75 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-20 backdrop-blur-xs cursor-pointer active:scale-90 shadow-md"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Right Arrow */}
            <button
              type="button"
              onClick={handleNextImage}
              aria-label="Next photo"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/45 hover:bg-black/75 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-20 backdrop-blur-xs cursor-pointer active:scale-90 shadow-md"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Carousel Pagination Dots */}
            <div className="absolute bottom-2.5 right-3 z-20 flex items-center space-x-1.5 bg-black/35 backdrop-blur-xs px-2 py-1 rounded-full">
              {propertyGallery.map((_, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentImageIndex(idx);
                  }}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === currentImageIndex
                      ? 'w-3.5 bg-white shadow-xs'
                      : 'w-1.5 bg-white/50 hover:bg-white/90'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Card Body */}
      <div className="p-5 flex flex-col justify-between flex-grow">
        <div>
          {/* Top Row: Price + Circular Heart Button */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-baseline">
              <span className="text-[20px] sm:text-[22px] font-extrabold text-[#6366F1] dark:text-[#818CF8] tracking-tight">
                {formattedPrice}
              </span>
              <span className="text-xs sm:text-[13px] font-medium text-gray-400 dark:text-gray-400 ml-1">
                {isDaily ? t('night') : isRent ? t('month') : ''}
              </span>
            </div>

            <button
              type="button"
              onClick={handleFavoriteClick}
              aria-label={isLiked ? "Retirer des favoris" : "Enregistrer dans les favoris"}
              className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                isLiked
                  ? 'bg-red-50 dark:bg-red-950/60 border-red-200 dark:border-red-900/60 text-[#E53935]'
                  : 'border-purple-100 dark:border-purple-900/40 text-[#6366F1] dark:text-[#818CF8] hover:bg-purple-50 dark:hover:bg-purple-950/50'
              }`}
            >
              <svg
                className={`w-4 h-4 transition-transform active:scale-125 ${
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

          {/* Title */}
          <Link href={targetLink} className="block">
            <h3 className="text-lg sm:text-[19px] font-extrabold text-gray-900 dark:text-white tracking-tight mb-1 group-hover:text-[#6366F1] dark:group-hover:text-[#818CF8] transition-colors line-clamp-1">
              {title}
            </h3>
          </Link>

          {/* Address */}
          <p className="text-xs sm:text-[13px] text-gray-400 dark:text-gray-400 mb-3.5 truncate">
            {displayLocation}
          </p>
        </div>

        {/* Divider & Specs Strip */}
        <div className="pt-3.5 border-t border-gray-100 dark:border-slate-800/80 flex items-center justify-between text-[11.5px] sm:text-xs text-gray-600 dark:text-gray-300 font-medium">
          
          {/* 1. Beds */}
          <div className="flex items-center space-x-1.5">
            <svg className="w-4 h-4 text-[#6366F1] dark:text-[#818CF8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12v6m0-3h18m0 3v-6M3 9a2 2 0 012-2h4a2 2 0 012 2v3H3V9zm18 0a2 2 0 00-2-2h-4a2 2 0 00-2 2v3h8V9z" />
            </svg>
            <span>{bedCount} {t('beds')}</span>
          </div>

          {/* 2. Bathrooms */}
          <div className="flex items-center space-x-1.5">
            <svg className="w-4 h-4 text-[#6366F1] dark:text-[#818CF8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 12v4a4 4 0 004 4h8a4 4 0 004-4v-4M4 12h16M7 12V7a3 3 0 016 0v5" />
            </svg>
            <span>{baths} {t('baths')}</span>
          </div>

          {/* 3. Area */}
          <div className="flex items-center space-x-1.5">
            <svg className="w-4 h-4 text-[#6366F1] dark:text-[#818CF8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8l8-4 8 4v8l-8 4-8-4V8z" />
            </svg>
            <span>{areaValue} {t('area')}</span>
          </div>

        </div>

      </div>
    </div>
  );
}
