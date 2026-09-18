'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const translations = {
  en: {
    // Navigation
    forSale: 'For Sale',
    forRent: 'For Rent',
    dailyRental: 'Daily Rental',
    projects: 'Projects',
    advertise: 'Advertise',
    myAccount: 'My Account',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    
    // Search
    rentTab: 'Rent',
    sellTab: 'Sell',
    projectsTab: 'Projects',
    where: 'Where',
    wherePlaceholder: 'Search by Wilaya, Commune, or neighborhood',
    when: 'When',
    whenPlaceholder: 'Select date',
    filters: 'Filters',
    resetFilters: 'Reset',
    applyFilters: 'Apply Filters',
    browseRentals: 'Browse Rentals',
    browseProperties: 'Browse Properties',
    browseProjects: 'Browse Projects',
    popularLocations: 'Popular Locations (Algeria)',
    minPrice: 'Min Price',
    maxPrice: 'Max Price',
    bedrooms: 'Bedrooms',
    bathrooms: 'Bathrooms',
    propertyType: 'Property Type',
    wilaya: 'Wilaya',
    commune: 'Commune',
    clearSearch: 'Clear Search',
    searching: 'Searching properties...',
    propertiesFound: 'Properties Found',
    propertyNotFound: 'Property not found',
    noMatchingTitle: 'Property not found',
    noMatchingDesc: 'No properties match your search criteria. Try adjusting your location or clearing filters.',
    
    // Cards
    popular: 'POPULAR',
    currency: 'DZD',
    month: '/month',
    night: '/night',
    beds: 'Beds',
    baths: 'Bathrooms',
    area: 'm²',
    explore: 'Explore',
    availableFrom: 'Available from',
    
    // Details & Contact
    sendMessage: 'SEND MESSAGE',
    viewPhone: 'VIEW PHONE',
    sendMessageToAdvertiser: 'Send Message to Advertiser',
    sendMessageToCompany: 'Send Message to Building Company',
    yourMessage: 'Your message...',
    send: 'Send',
    generalInfo: 'General Information',
    interiorFeatures: 'Interior Features',
    externalFeatures: 'External Features',
    priceRange: 'Price Range (DZD)',
    location: 'Wilaya & Commune',
    numberOfFlats: 'Number of Flats',
    deliveryDate: 'Delivery Date',
    advertNo: 'Advertise No',
    publishedDate: 'Published Date',
    advertiseStatus: 'Advertise Status',
    housingShape: 'Housing Shape',
    roomsNumber: 'Room + Living Number',
    grossNet: 'Gross / Net M²',
    warmingType: 'Warming Type',
    buildingAge: 'Building Age',
    floorLocation: 'Floor Location',
    furnished: 'Furnished',
    front: 'Front',
    
    // Footer
    footerDesc: 'Real Estate Platform Focused On Algerian Property Discovery, Clarity, And Seamless Living.',
    links: 'Links',
    home: 'Home',
    searchMap: 'Search Map',
    policies: 'Policies',
    privacyPolicy: 'Privacy Policy',
    termsConditions: 'Terms & Conditions',
    userAgreement: 'User Agreement',
    cookiePolicy: 'Cookie Policy',
    contact: 'Contact',
    allRightsReserved: 'All Rights Reserved.',
    
    // Login Modal
    welcomeBack: 'Welcome Back',
    email: 'Email',
    password: 'Password',
    forgotPassword: 'I forgot my password',
    loginBtn: 'LOGIN',
    connectWithGoogle: 'Connect with Google',
    stillNotMember: 'Still not a member?',
    signUpNow: 'Sign Up Now!',
    resetPasswordTitle: 'Reset Your Password',
    resetPasswordDesc: 'Enter your registered email address and we will send you a reset link.',
    sendResetLink: 'Send Reset Link',
    backToLogin: 'Back to Login',
  },
  fr: {
    // Navigation
    forSale: 'À Vendre',
    forRent: 'À Louer',
    dailyRental: 'Location Journalière',
    projects: 'Projets',
    advertise: 'Déposer une annonce',
    myAccount: 'Mon Compte',
    signIn: 'Se Connecter',
    signUp: 'S\'inscrire',
    
    // Search
    rentTab: 'Louer',
    sellTab: 'Vendre',
    projectsTab: 'Projets',
    where: 'Où',
    wherePlaceholder: 'Rechercher par Wilaya, Commune ou quartier',
    when: 'Quand',
    whenPlaceholder: 'Choisir une date',
    filters: 'Filtres',
    resetFilters: 'Réinitialiser',
    applyFilters: 'Appliquer les filtres',
    browseRentals: 'Explorer les Locations',
    browseProperties: 'Explorer les Propriétés',
    browseProjects: 'Explorer les Projets',
    popularLocations: 'Destinations Populaires (Algérie)',
    minPrice: 'Prix Min',
    maxPrice: 'Prix Max',
    bedrooms: 'Chambres',
    bathrooms: 'Salles de bain',
    propertyType: 'Type de bien',
    wilaya: 'Wilaya',
    commune: 'Commune',
    clearSearch: 'Effacer la recherche',
    searching: 'Recherche des biens en cours...',
    propertiesFound: 'Biens trouvés',
    propertyNotFound: 'Propriété non trouvée',
    noMatchingTitle: 'Propriété non trouvée',
    noMatchingDesc: 'Aucun bien ne correspond à vos critères. Essayez d\'ajuster vos critères ou votre localisation.',
    
    // Cards
    popular: 'POPULAIRE',
    currency: 'DA',
    month: '/mois',
    night: '/nuit',
    beds: 'Chambres',
    baths: 'Salles de bain',
    area: 'm²',
    explore: 'Explorer',
    availableFrom: 'Disponible dès le',
    
    // Details & Contact
    sendMessage: 'ENVOYER UN MESSAGE',
    viewPhone: 'VOIR LE TÉLÉPHONE',
    sendMessageToAdvertiser: 'Envoyer un message à l\'annonceur',
    sendMessageToCompany: 'Envoyer un message au promoteur',
    yourMessage: 'Votre message...',
    send: 'Envoyer',
    generalInfo: 'Informations Générales',
    interiorFeatures: 'Équipements Intérieurs',
    externalFeatures: 'Équipements Extérieurs',
    priceRange: 'Fourchette de Prix (DZD)',
    location: 'Wilaya & Commune',
    numberOfFlats: 'Nombre d\'Appartements',
    deliveryDate: 'Date de Livraison',
    advertNo: 'Numéro d\'Annonce',
    publishedDate: 'Date de Publication',
    advertiseStatus: 'Statut de l\'Annonce',
    housingShape: 'Type de Logement',
    roomsNumber: 'Nombre de Pièces',
    grossNet: 'Surface Brute / Nette M²',
    warmingType: 'Type de Chauffage',
    buildingAge: 'Âge du Bâtiment',
    floorLocation: 'Étage',
    furnished: 'Meublé',
    front: 'Façade',
    
    // Footer
    footerDesc: 'Plateforme immobilière d\'excellence en Algérie axée sur la clarté du design et la découverte fluide.',
    links: 'Liens',
    home: 'Accueil',
    searchMap: 'Carte Interactive',
    policies: 'Politiques',
    privacyPolicy: 'Politique de Confidentialité',
    termsConditions: 'Conditions Générales',
    userAgreement: 'Accord d\'Utilisation',
    cookiePolicy: 'Politique des Cookies',
    contact: 'Contact',
    allRightsReserved: 'Tous Droits Réservés.',
    
    // Login Modal
    welcomeBack: 'Bon retour',
    email: 'E-mail',
    password: 'Mot de passe',
    forgotPassword: 'Mot de passe oublié ?',
    loginBtn: 'CONNEXION',
    connectWithGoogle: 'Se connecter avec Google',
    stillNotMember: 'Pas encore membre ?',
    signUpNow: 'Inscrivez-vous maintenant !',
    resetPasswordTitle: 'Réinitialiser votre mot de passe',
    resetPasswordDesc: 'Saisissez votre e-mail pour recevoir un lien de réinitialisation.',
    sendResetLink: 'Envoyer le lien',
    backToLogin: 'Retour à la connexion',
  }
};

const LanguageContext = createContext({
  language: 'en',
  setLanguage: () => {},
  t: (key) => key,
  languages: [
    { code: 'en', label: 'English', short: 'EN', flag: '🇬🇧' },
    { code: 'fr', label: 'Français', short: 'FR', flag: '🇫🇷' },
  ]
});

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState('en');
  const [mounted, setMounted] = useState(false);

  const languages = [
    { code: 'en', label: 'English', short: 'EN', flag: '🇬🇧' },
    { code: 'fr', label: 'Français', short: 'FR', flag: '🇫🇷' },
  ];

  const applyLanguage = (langCode) => {
    document.documentElement.setAttribute('lang', langCode);
    document.documentElement.setAttribute('dir', 'ltr');
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem('makan-lang') || 'en';
    if (['en', 'fr'].includes(savedLanguage)) {
      setLanguageState(savedLanguage);
      applyLanguage(savedLanguage);
    } else {
      setLanguageState('en');
      applyLanguage('en');
    }
    setMounted(true);
  }, []);

  const setLanguage = (langCode) => {
    if (!['en', 'fr'].includes(langCode)) return;
    setLanguageState(langCode);
    localStorage.setItem('makan-lang', langCode);
    applyLanguage(langCode);
  };

  const t = (key) => {
    const langDict = translations[language] || translations.en;
    return langDict[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languages, mounted }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
