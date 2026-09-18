'use client';

import React, { useState, useMemo } from 'react';

// Default initial dataset matching the reference layout exactly
const DEFAULT_CONVERSATIONS = [
  {
    id: 'conv-1',
    name: 'Alice Dupont',
    initials: 'AD',
    phone: '+213 555 123 456',
    isOnline: true,
    isVerified: true,
    badgeType: 'verified', // 'verified' (cyan) | 'security' (red)
    roleTag: 'Admin',
    tagColor: 'red', // 'red' | 'amber' | 'blue' | 'emerald'
    avatarBg: 'bg-[#8B5CF6]', // Purple
    lastMessage: 'Toujours chiffré de bout en bout 👍',
    lastMessageTime: '01:13',
    isEncrypted: true,
    hasCheck: true,
    propertyTitle: 'Villa Moderne Val d’Hydra - Alger',
    propertyPrice: '85 000 000 DZD'
  },
  {
    id: 'conv-2',
    name: 'Marc Leroy',
    initials: 'ML',
    phone: '+213 661 789 012',
    isOnline: true,
    isVerified: true,
    badgeType: 'verified',
    roleTag: 'Modérateur',
    tagColor: 'amber',
    avatarBg: 'bg-[#EC4899]', // Pink
    lastMessage: "Oui, c'est confirmé.",
    lastMessageTime: '20:28',
    isEncrypted: true,
    hasCheck: true,
    propertyTitle: 'Appartement F4 Vue Mer - Oran',
    propertyPrice: '28 000 000 DZD'
  },
  {
    id: 'conv-3',
    name: 'Sophie Martin',
    initials: 'SM',
    phone: '+213 770 445 566',
    isOnline: true,
    isVerified: true,
    badgeType: 'security', // Red shield
    roleTag: 'Staff',
    tagColor: 'blue',
    avatarBg: 'bg-[#F97316]', // Orange
    lastMessage: "N'oublie pas de vérifier mon empreinte de clé !",
    lastMessageTime: '00:18',
    isEncrypted: true,
    hasCheck: false,
    propertyTitle: 'Duplex Haut Standing - Sidi Yahia',
    propertyPrice: '45 000 000 DZD'
  },
  {
    id: 'conv-4',
    name: 'Karim Mansouri',
    initials: 'KM',
    phone: '+213 550 123 456',
    isOnline: false,
    isVerified: true,
    badgeType: 'verified',
    roleTag: 'Propriétaire',
    tagColor: 'emerald',
    avatarBg: 'bg-[#10B981]', // Emerald
    lastMessage: 'Le dossier notarié et le livret foncier sont prêts.',
    lastMessageTime: 'Hier',
    isEncrypted: true,
    hasCheck: true,
    propertyTitle: 'Terrain Résidentiel 400m² - Dely Ibrahim',
    propertyPrice: '62 000 000 DZD'
  },
  {
    id: 'conv-5',
    name: 'Yacine Belkacem',
    initials: 'YB',
    phone: '+213 660 334 455',
    isOnline: true,
    isVerified: false,
    badgeType: 'none',
    roleTag: 'Client',
    tagColor: 'blue',
    avatarBg: 'bg-[#3B82F6]', // Blue
    lastMessage: 'Est-il possible de visiter les lieux ce samedi ?',
    lastMessageTime: '14:20',
    isEncrypted: false,
    hasCheck: true,
    propertyTitle: 'Studio Meublé - Centre Alger',
    propertyPrice: '12 000 DZD / nuit'
  },
  {
    id: 'conv-6',
    name: 'Amina Khelifi',
    initials: 'AK',
    phone: '+213 554 112 233',
    isOnline: false,
    isVerified: true,
    badgeType: 'verified',
    roleTag: 'Annonceur',
    tagColor: 'amber',
    avatarBg: 'bg-[#8B5CF6]',
    lastMessage: 'Les clés sont à l’agence dès 9h.',
    lastMessageTime: '09:45',
    isEncrypted: true,
    hasCheck: true,
    propertyTitle: 'Villa R+2 avec Piscine - Tipaza',
    propertyPrice: '95 000 000 DZD'
  },
  {
    id: 'conv-7',
    name: 'Farid Zerrouki',
    initials: 'FZ',
    phone: '+213 771 998 877',
    isOnline: true,
    isVerified: true,
    badgeType: 'verified',
    roleTag: 'Agent',
    tagColor: 'emerald',
    avatarBg: 'bg-[#06B6D4]', // Cyan
    lastMessage: 'Offre reçue et transmise au propriétaire.',
    lastMessageTime: '08:12',
    isEncrypted: true,
    hasCheck: true,
    propertyTitle: 'Local Commercial 120m² - Cheraga',
    propertyPrice: '35 000 000 DZD'
  }
];

/**
 * Format Algerian and international phone numbers into clean WhatsApp wa.me links
 * e.g., '+213 555 123 456' or '0555123456' -> 'https://wa.me/213555123456'
 */
function getWhatsAppUrl(phone, ownerName = '', propertyTitle = '') {
  if (!phone) return '#';
  let digits = String(phone).replace(/\D/g, '');
  if (!digits) return '#';

  if (digits.startsWith('0') && digits.length === 10) {
    digits = '213' + digits.substring(1);
  } else if (!digits.startsWith('213') && digits.length === 9) {
    digits = '213' + digits;
  }

  const defaultMsg = propertyTitle
    ? `Bonjour ${ownerName}, je vous contacte via MAKAN concernant : "${propertyTitle}".`
    : `Bonjour ${ownerName}, je vous contacte via la plateforme MAKAN Immobilier.`;

  return `https://wa.me/${digits}?text=${encodeURIComponent(defaultMsg)}`;
}

export default function ConversationList({
  conversations = DEFAULT_CONVERSATIONS,
  activeId,
  onSelectConversation,
  className = ''
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState(activeId || (conversations[0]?.id || ''));

  // Filter conversations specifically by property owner's name
  const filteredList = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const q = searchQuery.toLowerCase().trim();
    return conversations.filter((c) =>
      c.name.toLowerCase().includes(q) || (c.propertyTitle && c.propertyTitle.toLowerCase().includes(q))
    );
  }, [conversations, searchQuery]);

  const handleSelect = (item) => {
    setSelectedId(item.id || item._id);
    if (onSelectConversation) onSelectConversation(item);
  };

  return (
    <div className={`w-full max-w-md h-full flex flex-col bg-[#111827] text-gray-200 rounded-xl border border-gray-800 shadow-2xl overflow-hidden select-none font-sans ${className}`}>
      
      {/* 1. TOP SEARCH BAR CONTAINER */}
      <div className="p-3.5 pb-2.5">
        <div className="relative flex items-center">
          {/* Search Icon */}
          <div className="absolute left-3.5 flex items-center pointer-events-none text-gray-400">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search property owner..."
            className="w-full bg-[#1f2937] hover:bg-[#283548] focus:bg-[#1f2937] text-gray-100 placeholder-gray-400 text-xs rounded-lg pl-10 pr-8 py-2.5 outline-none border border-transparent focus:border-gray-600 transition-colors"
          />

          {/* Clear Search button */}
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 text-gray-400 hover:text-gray-200 text-xs p-1"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 2. SECTION HEADER & COUNT */}
      <div className="px-4 py-2 flex items-center justify-between">
        <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
          MESSAGES ({filteredList.length})
        </span>
      </div>

      {/* 3. CONVERSATION LIST ITEMS */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1 divide-y divide-gray-800/30">
        {filteredList.length === 0 ? (
          <div className="text-center py-12 px-4 space-y-2">
            <p className="text-xs font-semibold text-gray-400">Aucun propriétaire trouvé</p>
            <p className="text-[11px] text-gray-500">Aucun résultat pour "{searchQuery}"</p>
          </div>
        ) : (
          filteredList.map((item) => {
            const currentId = item.id || item._id;
            const isSelected = selectedId === currentId;

            return (
              <div
                key={currentId}
                onClick={() => handleSelect(item)}
                className={`group relative flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-150 ${
                  isSelected
                    ? 'bg-[#1e293b] text-white shadow-sm'
                    : 'hover:bg-[#1f2937]/70 text-gray-300'
                }`}
              >
                {/* ── COL 1: AVATAR WITH INITIALS ── */}
                <div className="relative shrink-0">
                  <div
                    className={`w-11 h-11 rounded-full ${item.avatarBg || 'bg-purple-600'} text-white font-bold text-xs flex items-center justify-center shadow-inner tracking-wider`}
                  >
                    {item.initials || (item.name ? item.name.substring(0, 2).toUpperCase() : 'U')}
                  </div>
                </div>

                {/* ── COL 2: CENTER TEXT STACK (NAME & LATEST MESSAGE PREVIEW) ── */}
                <div className="flex-1 min-w-0 pr-1">
                  {/* Top Line: Owner Name */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-gray-100 truncate group-hover:text-white">
                      {item.name}
                    </span>
                  </div>

                  {/* Bottom Line: Message Preview */}
                  <div className="text-[11px] text-gray-400 truncate mt-0.5">
                    <span className="truncate">{item.lastMessage}</span>
                  </div>
                </div>

                {/* ── COL 3: TIME ── */}
                <div className="flex flex-col items-end shrink-0 pl-1 text-right">
                  <span className="text-[10.5px] font-medium text-gray-400">
                    {item.lastMessageTime}
                  </span>
                </div>

                {/* ── COL 4: EXTREME RIGHT - WHATSAPP QUICK ACTION BUTTON ── */}
                <div className="shrink-0 pl-1">
                  <a
                    href={getWhatsAppUrl(item.phone, item.name, item.propertyTitle)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()} // Prevents row selection trigger
                    className="w-8 h-8 rounded-lg bg-[#25D366]/15 hover:bg-[#25D366] text-[#25D366] hover:text-white flex items-center justify-center transition-all duration-200 group/wa shadow-2xs cursor-pointer"
                    title={`Discuter sur WhatsApp avec ${item.name}`}
                  >
                    <svg
                      className="w-4 h-4 fill-current transition-transform group-hover/wa:scale-110"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.991.54 1.777.834 2.796.834 3.185 0 5.772-2.586 5.772-5.766 0-3.18-2.587-5.766-5.772-5.766zm9.969 5.766c0 5.405-4.394 9.799-9.799 9.799-1.636 0-3.167-.406-4.524-1.121l-5.677 1.488 1.516-5.539c-.808-1.428-1.272-3.08-1.272-4.839 0-5.405 4.394-9.799 9.799-9.799 5.405 0 9.799 4.394 9.799 9.799zm-4.706 3.864c-.218-.109-1.288-.636-1.488-.709-.199-.073-.344-.109-.489.109-.145.218-.562.709-.689.855-.127.145-.254.164-.472.055-.218-.109-.92-.339-1.752-1.08-.648-.577-1.085-1.29-1.212-1.508-.127-.218-.014-.336.095-.444.098-.098.218-.255.327-.382.109-.127.145-.218.218-.364.073-.145.036-.273-.018-.382-.055-.109-.489-1.181-.67-1.617-.177-.425-.357-.367-.489-.374l-.417-.008c-.145 0-.382.055-.581.273-.199.218-.763.746-.763 1.82 0 1.074.781 2.11 0.89 2.256.109.145 1.536 2.345 3.722 3.289.52.224.926.358 1.243.458.523.166.999.143 1.375.087.419-.063 1.288-.527 1.469-1.036.181-.509.181-.945.127-1.036-.054-.09-.199-.145-.417-.254z" />
                    </svg>
                  </a>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
