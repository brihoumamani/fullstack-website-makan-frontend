'use client';

import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import Link from 'next/link';
import 'leaflet/dist/leaflet.css';

// Fix default Leaflet marker icon asset issue in modern bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// ─────────────────────────────────────────────────────────────────────────────
// 🇩🇿 ALGERIA GEOGRAPHIC RESTRICTION CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────
export const ALGERIA_BOUNDS = {
  minLat: 18.96, // Southernmost border (In Guezzam / Mali)
  maxLat: 37.10, // Northern Mediterranean coastline
  minLng: -8.67, // Westernmost border (Tindouf)
  maxLng: 12.00  // Easternmost border (Djanet / Ghat)
};

// Leaflet bounds framing the national territory of Algeria
export const ALGERIA_LEAFLET_MAX_BOUNDS = [
  [18.5, -9.0], // South-West corner
  [37.5, 12.5]  // North-East corner
];

// Default center of Algerian residential & metropolitan territory (Algiers / Central Region)
export const ALGERIA_DEFAULT_CENTER = [36.7538, 3.0588];

// Precise geographic validation helper: is location strictly inside Algeria?
export function isInsideAlgeria(lat, lng) {
  if (
    typeof lat !== 'number' ||
    typeof lng !== 'number' ||
    isNaN(lat) ||
    isNaN(lng)
  ) {
    return false;
  }

  // 1. Overall national bounding box
  if (lat < ALGERIA_BOUNDS.minLat || lat > ALGERIA_BOUNDS.maxLat || lng < ALGERIA_BOUNDS.minLng || lng > ALGERIA_BOUNDS.maxLng) {
    return false;
  }

  // 2. Zone-specific border constraints to strictly reject adjacent countries:
  // Northern Coastal & Tell Atlas Region (Lat >= 34.5°N)
  // Morocco is west of -2.3°W, Tunisia is east of 8.7°E
  if (lat >= 34.5) {
    if (lng < -2.3 || lng > 8.7) return false;
  }
  // High Plateaus & Saharan Atlas (32.0°N <= Lat < 34.5°N)
  // Morocco is west of -2.6°W, Tunisia is east of 8.8°E
  else if (lat >= 32.0) {
    if (lng < -2.6 || lng > 8.8) return false;
  }
  // Northern Sahara (29.0°N <= Lat < 32.0°N)
  // Morocco is west of -3.8°W, Tunisia/Libya is east of 10.0°E
  else if (lat >= 29.0) {
    if (lng < -3.8 || lng > 10.0) return false;
  }
  // Tindouf & Mid-Sahara (26.0°N <= Lat < 29.0°N)
  // Western Sahara/Mauritania is west of -8.67°W, Libya is east of 10.2°E
  else if (lat >= 26.0) {
    if (lng < -8.67 || lng > 10.2) return false;
  }
  // Deep South (Hoggar / Tassili / BBM / In Guezzam) (18.96°N <= Lat < 26.0°N)
  // Mali/Mauritania is west of -4.5°W, Niger/Libya is east of 12.0°E
  else {
    if (lng < -4.5 || lng > 12.0) return false;
  }

  return true;
}

// Helper to safely extract and validate [latitude, longitude] strictly inside Algeria
export function extractCoordinates(property) {
  if (!property) return null;

  let lat = null;
  let lng = null;

  // 1. Check GeoJSON location: { type: 'Point', coordinates: [longitude, latitude] }
  if (
    property.location &&
    Array.isArray(property.location.coordinates) &&
    property.location.coordinates.length >= 2
  ) {
    lng = Number(property.location.coordinates[0]);
    lat = Number(property.location.coordinates[1]);
  }
  // 2. Check direct coordinates array
  else if (Array.isArray(property.coordinates) && property.coordinates.length >= 2) {
    // GeoJSON standard: [longitude, latitude]
    if (Math.abs(property.coordinates[0]) > 20 && Math.abs(property.coordinates[1]) < 20) {
      lat = Number(property.coordinates[0]);
      lng = Number(property.coordinates[1]);
    } else {
      lng = Number(property.coordinates[0]);
      lat = Number(property.coordinates[1]);
    }
  }
  // 3. Check coordinates object { lat, lng } or { latitude, longitude }
  else if (property.coordinates && typeof property.coordinates === 'object') {
    lat = Number(property.coordinates.lat ?? property.coordinates.latitude);
    lng = Number(property.coordinates.lng ?? property.coordinates.longitude);
  }
  // 4. Check direct latitude / longitude fields
  else if (property.latitude !== undefined && property.longitude !== undefined) {
    lat = Number(property.latitude);
    lng = Number(property.longitude);
  } else if (property.lat !== undefined && property.lng !== undefined) {
    lat = Number(property.lat);
    lng = Number(property.lng);
  }

  // Strict Algeria validation check
  if (isInsideAlgeria(lat, lng)) {
    return [lat, lng];
  }

  // Skip properties outside Algeria without throwing
  if (lat !== null && lng !== null && process.env.NODE_ENV !== 'production') {
    console.warn(`[MAKAN Algeria Map] Property skipped: location outside Algerian territory [${lat}, ${lng}]`, property.title || property._id);
  }

  return null;
}

// Create custom HTML price-pill icon matching MAKAN UI
function createPriceIcon(priceText, isSelected = false) {
  const html = `
    <div class="makan-marker-container ${isSelected ? 'selected' : ''}" style="transform: translate(-50%, -100%);">
      <div style="
        background: #E53935;
        color: white;
        font-family: inherit;
        font-size: 11px;
        font-weight: 700;
        padding: 4px 8px;
        border-radius: 4px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        white-space: nowrap;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid rgba(255,255,255,0.4);
        cursor: pointer;
        transition: transform 0.15s ease, background-color 0.15s ease;
      ">
        ${priceText}
      </div>
      <div style="
        width: 0;
        height: 0;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-top: 6px solid #E53935;
        margin: 0 auto;
      "></div>
    </div>
  `;

  return L.divIcon({
    html: html,
    className: 'makan-custom-price-marker',
    iconSize: [0, 0],
    iconAnchor: [0, 0],
    popupAnchor: [0, -32]
  });
}

// Create POI Pin Icon
function createPoiIcon(emoji, bg = '#4CAF50') {
  const html = `
    <div style="
      transform: translate(-50%, -50%);
      background: ${bg};
      color: white;
      width: 26px;
      height: 26px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.25);
      border: 2px solid white;
    ">
      ${emoji}
    </div>
  `;
  return L.divIcon({
    html: html,
    className: 'makan-poi-marker',
    iconSize: [0, 0],
    iconAnchor: [0, 0]
  });
}

// Controller component to auto-adjust bounds or center within Algeria
function MapController({ validProperties, singlePropertyMode, defaultCenter, defaultZoom }) {
  const map = useMap();

  useEffect(() => {
    // Keep map bounds locked to Algerian territory
    map.setMaxBounds(ALGERIA_LEAFLET_MAX_BOUNDS);

    if (!validProperties || validProperties.length === 0) {
      map.setView(defaultCenter || ALGERIA_DEFAULT_CENTER, defaultZoom || 7);
      return;
    }

    if (singlePropertyMode && validProperties.length === 1) {
      const coords = validProperties[0].coords;
      map.setView(coords, 15, { animate: true });
    } else if (validProperties.length === 1) {
      map.setView(validProperties[0].coords, 13, { animate: true });
    } else if (validProperties.length > 1) {
      const bounds = L.latLngBounds(validProperties.map((p) => p.coords));
      map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 14,
        animate: true
      });
    }
  }, [validProperties, singlePropertyMode, map, defaultCenter, defaultZoom]);

  return null;
}

// Format price into Algerian Dinars (DZD / DA)
function formatPrice(price, rentOrSale) {
  if (price === undefined || price === null) return 'Prix sur demande';
  const numPrice = Number(price);
  if (isNaN(numPrice)) return String(price);

  const formatted = numPrice.toLocaleString('fr-DZ');
  if (rentOrSale === 'daily_rental' || rentOrSale === 'daily') {
    return `${formatted} DA / nuit`;
  }
  if (rentOrSale === 'rent') {
    return `${formatted} DA / mois`;
  }
  return `${formatted} DA`;
}

export default function LeafletMap({
  properties = [],
  singlePropertyMode = false,
  height = '100%',
  width = '100%',
  className = '',
  defaultCenter = ALGERIA_DEFAULT_CENTER,
  defaultZoom = 7,
  pois = null, // { transportation, schools, health, restaurants, markets }
  onPropertySelect = null
}) {
  // Extract and filter valid properties strictly located inside Algeria
  const validProperties = useMemo(() => {
    if (!Array.isArray(properties)) return [];

    return properties
      .map((p) => {
        const coords = extractCoordinates(p);
        if (!coords) return null;
        return {
          ...p,
          coords
        };
      })
      .filter(Boolean);
  }, [properties]);

  // Initial center determination
  const initialCenter = useMemo(() => {
    if (validProperties.length > 0) {
      return validProperties[0].coords;
    }
    return defaultCenter || ALGERIA_DEFAULT_CENTER;
  }, [validProperties, defaultCenter]);

  // Sample Algerian POIs strictly verified within Algerian territory (Algiers & Oran)
  const samplePois = useMemo(
    () => [
      // Transit
      { id: 'poi-t1', type: 'transportation', name: 'Station Métro Tafourah - Grande Poste (Alger)', coords: [36.7725, 3.0588], emoji: '🚇', bg: '#4CAF50' },
      { id: 'poi-t2', type: 'transportation', name: 'Station Métro Place des Martyrs (Alger)', coords: [36.7842, 3.0612], emoji: '🚇', bg: '#4CAF50' },
      { id: 'poi-t3', type: 'transportation', name: 'Station Tramway Bab Ezzouar (Alger)', coords: [36.7214, 3.1824], emoji: '🚊', bg: '#4CAF50' },
      // Schools & Universities
      { id: 'poi-s1', type: 'schools', name: 'Université d’Alger 1 Benyoucef Benkhedda (Fac Centrale)', coords: [36.7695, 3.0535], emoji: '🎓', bg: '#FFB300' },
      { id: 'poi-s2', type: 'schools', name: 'USTHB Université des Sciences et de la Technologie Houari Boumediene', coords: [36.7132, 3.1818], emoji: '🎓', bg: '#FFB300' },
      { id: 'poi-s3', type: 'schools', name: 'Université Oran 1 Ahmed Ben Bella', coords: [35.7012, -0.6324], emoji: '🎓', bg: '#FFB300' },
      // Health & Hospitals
      { id: 'poi-h1', type: 'health', name: 'CHU Mustapha Pacha (Alger)', coords: [36.7582, 3.0528], emoji: '🏥', bg: '#E53935' },
      { id: 'poi-h2', type: 'health', name: 'Hôpital Central de l’Armée d’Aïn Naâdja (Alger)', coords: [36.7051, 3.0762], emoji: '🏥', bg: '#E53935' },
      { id: 'poi-h3', type: 'health', name: 'EHU Oran 1er Novembre 1954 (Oran)', coords: [35.7042, -0.5891], emoji: '🏥', bg: '#E53935' },
      // Restaurants & Cafes
      { id: 'poi-r1', type: 'restaurants', name: 'Restaurants & Salons Sidi Yahia (Alger)', coords: [36.7382, 3.0335], emoji: '☕', bg: '#3F51B5' },
      { id: 'poi-r2', type: 'restaurants', name: 'Espaces Gastronomiques Front de Mer Canastel (Oran)', coords: [35.7335, -0.5645], emoji: '☕', bg: '#3F51B5' },
      // Markets & Shopping
      { id: 'poi-m1', type: 'markets', name: 'Centre Commercial & de Loisirs Bab Ezzouar (Alger)', coords: [36.7208, 3.1852], emoji: '🛒', bg: '#0288D1' },
      { id: 'poi-m2', type: 'markets', name: 'Hypermarché Ardis (Alger)', coords: [36.7345, 3.1558], emoji: '🛒', bg: '#0288D1' },
      { id: 'poi-m3', type: 'markets', name: 'Senia Center (Oran)', coords: [35.6512, -0.6124], emoji: '🛒', bg: '#0288D1' }
    ].filter((poi) => isInsideAlgeria(poi.coords[0], poi.coords[1])),
    []
  );

  return (
    <div
      className={`relative w-full overflow-hidden rounded-[4px] ${className}`}
      style={{ height, width }}
    >
      <MapContainer
        center={initialCenter}
        zoom={singlePropertyMode ? 15 : defaultZoom}
        minZoom={5}
        maxZoom={19}
        maxBounds={ALGERIA_LEAFLET_MAX_BOUNDS}
        maxBoundsViscosity={1.0}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%', zIndex: 10 }}
      >
        {/* OpenStreetMap Tile Layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors | MAKAN 🇩🇿'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        {/* Dynamic Bounds & Pan Controller with Algeria Lock */}
        <MapController
          validProperties={validProperties}
          singlePropertyMode={singlePropertyMode}
          defaultCenter={defaultCenter}
          defaultZoom={defaultZoom}
        />

        {/* POI Layer Markers */}
        {pois &&
          samplePois
            .filter((poi) => pois[poi.type])
            .map((poi) => (
              <Marker
                key={poi.id}
                position={poi.coords}
                icon={createPoiIcon(poi.emoji, poi.bg)}
              >
                <Popup className="makan-custom-popup">
                  <div className="p-1 text-xs font-semibold text-gray-800">
                    <span className="mr-1">{poi.emoji}</span>
                    <span>{poi.name}</span>
                  </div>
                </Popup>
              </Marker>
            ))}

        {/* Real Property Markers in Algeria */}
        {validProperties.map((property) => {
          const propertyId = property._id || property.id || `prop-${Math.random()}`;
          const priceDisplay = formatPrice(property.price, property.rentOrSale);
          const icon = createPriceIcon(priceDisplay);

          const propertyLocation =
            property.commune && property.wilaya
              ? `${property.commune}, Wilaya d’${property.wilaya}`
              : property.address || property.city || 'Algérie';

          const image =
            (Array.isArray(property.images) && property.images[0]) ||
            property.image ||
            'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80';

          const detailHref = property.rentOrSale === 'daily_rental'
            ? `/daily-rental/${propertyId}`
            : property.rentOrSale === 'rent'
            ? `/for-rent/${propertyId}`
            : `/for-sale/${propertyId}`;

          return (
            <Marker
              key={propertyId}
              position={property.coords}
              icon={icon}
              eventHandlers={{
                click: () => {
                  if (onPropertySelect) {
                    onPropertySelect(property);
                  }
                }
              }}
            >
              <Popup className="makan-custom-popup" minWidth={220} maxWidth={280}>
                <div className="overflow-hidden rounded-[3px] font-sans">
                  {/* Property Image */}
                  <div className="relative w-full h-28 bg-gray-100 overflow-hidden mb-2 rounded-[2px]">
                    <img
                      src={image}
                      alt={property.title || 'Propriété'}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1.5 left-1.5 bg-[#E53935] text-white text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-[2px] shadow-xs">
                      {property.rentOrSale === 'daily_rental'
                        ? 'Courte Durée'
                        : property.rentOrSale === 'rent'
                        ? 'Location'
                        : 'Vente'}
                    </div>
                  </div>

                  {/* Property Details */}
                  <h4 className="font-bold text-gray-900 text-xs leading-tight line-clamp-1 mb-0.5">
                    {property.title || 'Propriété MAKAN'}
                  </h4>

                  <p className="text-[11px] text-gray-500 mb-1 flex items-center gap-1">
                    <span>📍</span>
                    <span className="truncate">{propertyLocation}</span>
                  </p>

                  {/* Specs & Area */}
                  {(property.sqm || property.beds) && (
                    <div className="text-[10px] text-gray-600 mb-2 flex items-center gap-2">
                      {property.beds && <span>🛏️ {property.beds} Pièces</span>}
                      {property.sqm && <span>📐 {property.sqm} m²</span>}
                    </div>
                  )}

                  {/* Price & Action Link */}
                  <div className="flex items-center justify-between pt-1.5 border-t border-gray-100">
                    <span className="font-extrabold text-[#E53935] text-xs">
                      {priceDisplay}
                    </span>
                    <Link
                      href={detailHref}
                      className="bg-[#E53935] hover:bg-[#d32f2f] text-white text-[10.5px] font-semibold px-2.5 py-1 rounded-[2px] transition-colors shadow-xs"
                    >
                      Voir détails
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
