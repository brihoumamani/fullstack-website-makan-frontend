'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ConversationList from './ConversationList';

export default function MessagesVisitsView({ apiBase }) {
  const [activeTab, setActiveTab] = useState('messages'); // 'messages' | 'visits'
  const [contacts, setContacts] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [visits, setVisits] = useState([]);
  const [loadingVisits, setLoadingVisits] = useState(true);

  useEffect(() => {
    fetchContacts();
    fetchVisits();
  }, []);

  const fetchContacts = async () => {
    const base = apiBase || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    try {
      setLoadingContacts(true);
      const res = await fetch(`${base}/api/dashboard/my-messages`, {
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok && data.success && data.messages) {
        // Transform backend leads into standard conversation item format
        const formatted = data.messages.map((lead, idx) => {
          const agent = lead.recipientAgentId || {};
          const prop = lead.propertyId || {};
          const name = agent.name || lead.name || 'Propriétaire Anonyme';
          const initials = name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() || 'MA';
          const colors = ['bg-[#8B5CF6]', 'bg-[#EC4899]', 'bg-[#F97316]', 'bg-[#10B981]', 'bg-[#3B82F6]'];
          
          return {
            id: lead._id || `conv-${idx}`,
            name: name,
            initials: initials,
            phone: agent.phone || lead.phone || '+213 550 12 34 56',
            isOnline: idx % 2 === 0,
            isVerified: true,
            badgeType: 'verified',
            roleTag: agent.company ? 'Agent' : 'Propriétaire',
            tagColor: 'emerald',
            avatarBg: colors[idx % colors.length],
            lastMessage: lead.replyMessage || lead.message || 'Demande d’information envoyée',
            lastMessageTime: new Date(lead.createdAt || Date.now()).toLocaleTimeString('fr-DZ', { hour: '2-digit', minute: '2-digit' }),
            isEncrypted: true,
            hasCheck: true,
            propertyTitle: prop.title || 'Bien Immobilier en Algérie',
            propertyPrice: prop.price ? `${Number(prop.price).toLocaleString('fr-DZ')} DZD` : 'Prix sur demande',
            propertyCommune: prop.commune || 'Centre',
            propertyWilaya: prop.wilaya || 'Alger',
            propertyImage: (prop.images && prop.images[0]) || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
            originalLead: lead
          };
        });
        setContacts(formatted);
        if (formatted.length > 0) setSelectedConversation(formatted[0]);
      }
    } catch (err) {
      console.warn('Error fetching contacts (backend may be offline):', err.message);
    } finally {
      setLoadingContacts(false);
    }
  };

  const fetchVisits = async () => {
    const base = apiBase || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    try {
      setLoadingVisits(true);
      const res = await fetch(`${base}/api/dashboard/visits`, {
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setVisits(data.visits || []);
      }
    } catch (err) {
      console.warn('Error fetching visits (backend may be offline):', err.message);
    } finally {
      setLoadingVisits(false);
    }
  };

  // Sample contacts if none exist in database yet
  const defaultContacts = [
    {
      _id: 'demo-c1',
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      message: 'Bonjour, je souhaite avoir plus de détails sur cette villa et convenir d’une date de visite ce weekend.',
      status: 'Contacté',
      replyMessage: 'Bonjour ! La visite est possible samedi à 14h30. N’hésitez pas à me joindre directement sur WhatsApp.',
      recipientAgentId: {
        name: 'Karim Mansouri',
        company: 'Agence El Bahdja Immobilier',
        phone: '+213 550 12 34 56',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
        address: 'Hydra, Alger'
      },
      propertyId: {
        _id: 'prop-101',
        title: 'Villa Contemporaine avec Piscine & Jardin',
        price: 85000000,
        rentOrSale: 'sale',
        commune: 'Hydra',
        wilaya: 'Alger',
        beds: 5,
        baths: 3,
        sqm: 380,
        images: [
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80'
        ]
      }
    },
    {
      _id: 'demo-c2',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      message: 'Salam, est-ce que le prix de location de cet appartement F4 est négociable pour un bail de longue durée ?',
      status: 'Nouveau',
      recipientAgentId: {
        name: 'Amina Belkacem',
        company: 'Promotion Immobilière Oran Ouest',
        phone: '+213 661 78 90 12',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
        address: 'Akid Lotfi, Oran'
      },
      propertyId: {
        _id: 'prop-102',
        title: 'Appartement Haut Standing F4 Vue Dégagée',
        price: 180000,
        rentOrSale: 'rent',
        commune: 'Akid Lotfi',
        wilaya: 'Oran',
        beds: 4,
        baths: 2,
        sqm: 145,
        images: [
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80'
        ]
      }
    }
  ];

  const displayContacts = contacts.length > 0 ? contacts : defaultContacts;

  return (
    <div className="space-y-6">
      
      {/* Top Header & Sub-tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white tracking-tight">
            Contacts & Rendez-vous
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Contactez directement les agents immobiliers sur WhatsApp ou par téléphone
          </p>
        </div>

        {/* Sub-tabs switcher */}
        <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-[4px] self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('messages')}
            className={`px-3.5 py-1.5 rounded-[3px] text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'messages'
                ? 'bg-white dark:bg-[#1e293b] text-gray-900 dark:text-white shadow-2xs'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            💬 Mes Contacts ({displayContacts.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('visits')}
            className={`px-3.5 py-1.5 rounded-[3px] text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'visits'
                ? 'bg-white dark:bg-[#1e293b] text-gray-900 dark:text-white shadow-2xs'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            📅 Visites Prévues ({visits.length})
          </button>
        </div>
      </div>

      {/* CONTACTS / WHATSAPP MESSAGING TAB */}
      {activeTab === 'messages' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT: CONVERSATION LIST (Reference Layout) */}
          <div className="lg:col-span-6 xl:col-span-5 w-full">
            <ConversationList
              conversations={contacts.length > 0 ? contacts : undefined}
              activeId={selectedConversation?.id}
              onSelectConversation={(item) => setSelectedConversation(item)}
            />
          </div>

          {/* RIGHT: SELECTED OWNER & PROPERTY DETAIL CARD */}
          <div className="lg:col-span-6 xl:col-span-7 w-full">
            {selectedConversation ? (
              <div className="bg-white dark:bg-[#1e293b] border border-gray-100 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
                
                {/* Header: Owner Profile */}
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-4">
                  <div className="flex items-center space-x-3.5">
                    <div className="relative">
                      <div className={`w-12 h-12 rounded-full ${selectedConversation.avatarBg || 'bg-purple-600'} text-white font-bold text-sm flex items-center justify-center shadow-md`}>
                        {selectedConversation.initials || 'AD'}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-sm font-bold text-gray-900 dark:text-white">
                          {selectedConversation.name}
                        </h2>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        📞 {selectedConversation.phone}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Property Context Box */}
                <div className="bg-gray-50 dark:bg-[#0f172a] rounded-lg p-4 border border-gray-100 dark:border-slate-800 flex gap-4">
                  <img
                    src={selectedConversation.propertyImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80'}
                    alt="Property"
                    className="w-24 h-24 rounded-lg object-cover border border-gray-200 dark:border-slate-700 shrink-0"
                  />
                  <div className="flex flex-col justify-between overflow-hidden">
                    <div>
                      <span className="text-[10px] font-bold text-[#E53935] uppercase tracking-wider">
                        Bien Associé
                      </span>
                      <h3 className="text-xs font-bold text-gray-900 dark:text-white line-clamp-1 mt-0.5">
                        {selectedConversation.propertyTitle}
                      </h3>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400">
                        📍 {selectedConversation.propertyCommune || 'Hydra'}, {selectedConversation.propertyWilaya || 'Alger'}
                      </p>
                    </div>
                    <div className="text-xs font-extrabold text-[#E53935]">
                      {selectedConversation.propertyPrice}
                    </div>
                  </div>
                </div>

                {/* Latest Exchanged Message */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                    Dernier message :
                  </label>
                  <div className="p-3.5 bg-gray-50 dark:bg-[#0f172a] border border-gray-100 dark:border-slate-800 rounded-lg text-xs text-gray-700 dark:text-gray-300 leading-relaxed italic">
                    "{selectedConversation.lastMessage}"
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <a
                    href={`https://wa.me/${String(selectedConversation.phone).replace(/\D/g, '').replace(/^0/, '213')}?text=${encodeURIComponent(`Bonjour ${selectedConversation.name}, je vous contacte via MAKAN.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-[#25D366] hover:bg-[#20ba59] text-white px-5 py-3 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center space-x-2 text-center"
                  >
                    <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.991.54 1.777.834 2.796.834 3.185 0 5.772-2.586 5.772-5.766 0-3.18-2.587-5.766-5.772-5.766zm9.969 5.766c0 5.405-4.394 9.799-9.799 9.799-1.636 0-3.167-.406-4.524-1.121l-5.677 1.488 1.516-5.539c-.808-1.428-1.272-3.08-1.272-4.839 0-5.405 4.394-9.799 9.799-9.799 5.405 0 9.799 4.394 9.799 9.799zm-4.706 3.864c-.218-.109-1.288-.636-1.488-.709-.199-.073-.344-.109-.489.109-.145.218-.562.709-.689.855-.127.145-.254.164-.472.055-.218-.109-.92-.339-1.752-1.08-.648-.577-1.085-1.29-1.212-1.508-.127-.218-.014-.336.095-.444.098-.098.218-.255.327-.382.109-.127.145-.218.218-.364.073-.145.036-.273-.018-.382-.055-.109-.489-1.181-.67-1.617-.177-.425-.357-.367-.489-.374l-.417-.008c-.145 0-.382.055-.581.273-.199.218-.763.746-.763 1.82 0 1.074.781 2.11 0.89 2.256.109.145 1.536 2.345 3.722 3.289.52.224.926.358 1.243.458.523.166.999.143 1.375.087.419-.063 1.288-.527 1.469-1.036.181-.509.181-.945.127-1.036-.054-.09-.199-.145-.417-.254z" />
                    </svg>
                    <span>Discuter sur WhatsApp</span>
                  </a>

                  <a
                    href={`tel:${selectedConversation.phone}`}
                    className="bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-800 dark:text-gray-200 px-5 py-3 rounded-lg text-xs font-bold transition-colors flex items-center justify-center space-x-1.5 text-center"
                  >
                    <span>📞 Appeler</span>
                  </a>
                </div>

              </div>
            ) : (
              <div className="bg-white dark:bg-[#1e293b] border border-gray-100 dark:border-slate-800 rounded-xl p-12 text-center space-y-3">
                <span className="text-3xl">💬</span>
                <h3 className="text-xs font-bold text-gray-900 dark:text-white">Sélectionnez une conversation</h3>
                <p className="text-xs text-gray-500">Cliquez sur un propriétaire à gauche pour afficher ses détails ou lancer une discussion WhatsApp.</p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* VISITS TAB */}
      {activeTab === 'visits' && (
        <div className="space-y-4">
          {loadingVisits ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-28 bg-white dark:bg-[#1e293b] rounded border border-gray-100 dark:border-slate-800 animate-pulse"></div>
              ))}
            </div>
          ) : visits.length === 0 ? (
            <div className="bg-white dark:bg-[#1e293b] border border-gray-100 dark:border-slate-800 rounded-lg p-10 text-center space-y-3">
              <span className="text-3xl">📅</span>
              <h3 className="text-xs font-bold text-gray-900 dark:text-white">Aucune visite programmée</h3>
              <p className="text-xs text-gray-500">Lorsque vous planifiez une visite avec un agent immobilier, elle s'affichera ici.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {visits.map((visit) => (
                <div
                  key={visit.id}
                  className="bg-white dark:bg-[#1e293b] border border-gray-100 dark:border-slate-800 rounded-lg p-5 shadow-2xs hover:shadow-xs transition-all space-y-3.5 flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                        visit.status === 'confirmed'
                          ? 'bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-300'
                          : visit.status === 'pending'
                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                          : 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                      }`}>
                        {visit.status === 'confirmed' ? '✓ Confirmé' : visit.status === 'pending' ? '⏳ En attente' : 'Terminé'}
                      </span>
                      <span className="text-[11px] text-gray-400 dark:text-gray-500">
                        {visit.type}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold text-gray-900 dark:text-white">
                        {visit.propertyName}
                      </h3>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 flex items-center">
                        <span className="mr-1">📍</span> {visit.location}
                      </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-slate-800/60 rounded p-2.5 text-xs grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] text-gray-400 block">Date de visite</span>
                        <span className="font-semibold text-gray-800 dark:text-gray-200">🗓️ {visit.date}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 block">Heure</span>
                        <span className="font-semibold text-gray-800 dark:text-gray-200">⏰ {visit.time}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <div className="text-[11px] text-gray-600 dark:text-gray-400">
                      <span>Agent: <strong>{visit.clientName}</strong></span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {visit.clientPhone && (
                        <a
                          href={getWhatsAppUrl(visit.clientPhone, visit.propertyName)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 text-xs font-bold bg-[#25D366] hover:bg-[#20ba59] text-white px-2.5 py-1.5 rounded transition-colors shadow-2xs"
                        >
                          <span>WhatsApp</span>
                        </a>
                      )}
                      <a
                        href={`tel:${visit.clientPhone}`}
                        className="inline-flex items-center space-x-1 text-xs font-bold text-[#E53935] hover:text-[#d32f2f] bg-red-50 dark:bg-red-950/40 px-2.5 py-1.5 rounded transition-colors"
                      >
                        <span>📞 Appeler</span>
                      </a>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}


