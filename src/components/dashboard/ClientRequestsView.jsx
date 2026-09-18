'use client';

import { useState, useEffect } from 'react';

function getWhatsAppUrl(phone, clientName = '', propertyTitle = '') {
  if (!phone) return '';
  let digits = String(phone).replace(/\D/g, '');
  if (!digits) return '';

  if (digits.startsWith('0') && digits.length === 10) {
    digits = '213' + digits.substring(1);
  } else if (!digits.startsWith('213') && digits.length === 9) {
    digits = '213' + digits;
  }

  const defaultMsg = `Bonjour ${clientName || ''}, suite à votre message sur MAKAN concernant "${propertyTitle || 'votre recherche'}", je reste à votre entière disposition.`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(defaultMsg.trim())}`;
}

export default function ClientRequestsView({ apiBase }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyingLead, setReplyingLead] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const base = apiBase || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    try {
      setLoading(true);
      const res = await fetch(`${base}/api/dashboard/requests`, {
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setRequests(data.leads || []);
      }
    } catch (err) {
      console.warn('Error fetching client requests (backend may be offline):', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !replyingLead) return;
    const base = apiBase || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    try {
      setSendingReply(true);
      const res = await fetch(`${base}/api/dashboard/requests/${replyingLead._id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ replyMessage: replyText.trim() })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setFeedback('Réponse transmise avec succès au client !');
        setReplyText('');
        fetchRequests();
        setTimeout(() => {
          setReplyingLead(null);
          setFeedback('');
        }, 1500);
      } else {
        setFeedback(data.message || 'Erreur lors de l’envoi de la réponse');
      }
    } catch (err) {
      console.error('Error sending reply:', err);
      setFeedback('Erreur réseau');
    } finally {
      setSendingReply(false);
    }
  };

  // Fallback demo requests if database leads are empty
  const defaultLeads = [
    {
      _id: 'req-1',
      name: 'Walid Benali',
      phone: '+213 554 89 12 30',
      email: 'walid.benali@gmail.com',
      message: 'Bonjour, je suis très intéressé par cet appartement. Est-il toujours disponible pour une visite cette semaine ?',
      createdAt: new Date().toISOString(),
      propertyId: {
        title: 'Appartement Haut Standing F4 avec Vue Mer',
        wilaya: 'Alger',
        commune: 'Hydra'
      },
      status: 'Nouveau'
    },
    {
      _id: 'req-2',
      name: 'Samia Khelifi',
      phone: '+213 661 45 67 89',
      email: 'samia.khelifi@yahoo.fr',
      message: 'Salam, quel est le dernier prix pour le duplex à Oran ? Est-ce que le paiement par crédit bancaire est accepté ?',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      propertyId: {
        title: 'Villa Moderne avec Jardin & Piscine',
        wilaya: 'Oran',
        commune: 'Canastel'
      },
      status: 'Contacté'
    }
  ];

  const displayList = requests.length > 0 ? requests : defaultLeads;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="border-b border-gray-100 dark:border-slate-800 pb-4">
        <div className="flex items-center space-x-2">
          <h1 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white tracking-tight">
            Demandes de Renseignements & Prospects
          </h1>
          <span className="text-xs font-semibold bg-red-100 dark:bg-red-950/60 text-[#E53935] px-2 py-0.5 rounded-full">
            {displayList.length}
          </span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Consultez les messages et demandes de contact des acquéreurs et locataires potentiels.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-[#1e293b] border border-gray-100 dark:border-slate-800 rounded-lg p-4 shadow-2xs space-y-1">
          <span className="text-[11px] text-gray-500 dark:text-gray-400">Total Demandes</span>
          <div className="text-lg font-extrabold text-gray-900 dark:text-white">{displayList.length}</div>
        </div>

        <div className="bg-white dark:bg-[#1e293b] border border-gray-100 dark:border-slate-800 rounded-lg p-4 shadow-2xs space-y-1">
          <span className="text-[11px] text-gray-500 dark:text-gray-400">Nouvelles (Non traitées)</span>
          <div className="text-lg font-extrabold text-red-600 dark:text-red-400">
            {displayList.filter((d) => d.status === 'Nouveau' || !d.status).length}
          </div>
        </div>

        <div className="bg-white dark:bg-[#1e293b] border border-gray-100 dark:border-slate-800 rounded-lg p-4 shadow-2xs space-y-1">
          <span className="text-[11px] text-gray-500 dark:text-gray-400">Contactés</span>
          <div className="text-lg font-extrabold text-green-600 dark:text-green-400">
            {displayList.filter((d) => d.status === 'Contacté').length}
          </div>
        </div>

        <div className="bg-white dark:bg-[#1e293b] border border-gray-100 dark:border-slate-800 rounded-lg p-4 shadow-2xs space-y-1">
          <span className="text-[11px] text-gray-500 dark:text-gray-400">Taux de Conversion</span>
          <div className="text-lg font-extrabold text-blue-600 dark:text-blue-400">18.4%</div>
        </div>
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((n) => (
            <div key={n} className="h-32 bg-white dark:bg-[#1e293b] rounded border border-gray-100 dark:border-slate-800 animate-pulse"></div>
          ))}
        </div>
      ) : displayList.length === 0 ? (
        <div className="bg-white dark:bg-[#1e293b] border border-gray-100 dark:border-slate-800 rounded-lg p-10 text-center space-y-3">
          <span className="text-3xl">📬</span>
          <h3 className="text-xs font-bold text-gray-900 dark:text-white">Aucune demande reçue pour le moment</h3>
          <p className="text-xs text-gray-500">Les messages des acheteurs intéressés par vos annonces apparaîtront directement ici.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayList.map((lead, idx) => {
            const cleanPhone = (lead.phone || '').replace(/\D/g, '');
            const hasReplied = !!lead.replyMessage;
            const leadKey = lead._id || lead.id || `lead-${idx}`;

            return (
              <div
                key={leadKey}
                className="bg-white dark:bg-[#1e293b] border border-gray-100 dark:border-slate-800 rounded-lg p-5 shadow-2xs hover:shadow-xs transition-all space-y-3"
              >
                {/* Top bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-950/60 text-[#E53935] flex items-center justify-center font-bold text-xs">
                      {lead.name ? lead.name.charAt(0).toUpperCase() : 'U'}
                    </span>
                    <div>
                      <h3 className="text-xs font-bold text-gray-900 dark:text-white">{lead.name}</h3>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400">{lead.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] text-gray-400">
                      {new Date(lead.createdAt).toLocaleDateString('fr-DZ', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      lead.status === 'Contacté'
                        ? 'bg-green-50 dark:bg-green-950/60 text-green-600 dark:text-green-300'
                        : 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300'
                    }`}>
                      {lead.status || 'Nouveau'}
                    </span>
                  </div>
                </div>

                {/* Property referenced */}
                {lead.propertyId && (
                  <div className="p-2.5 bg-gray-50 dark:bg-slate-800/60 rounded text-[11px] flex items-center space-x-2">
                    <span className="text-gray-400">Concernant:</span>
                    <strong className="text-gray-800 dark:text-gray-200 truncate">
                      {lead.propertyId.title || 'Annonce Immobilière'}
                    </strong>
                    <span className="text-gray-400">({lead.propertyId.commune || 'Centre'}, {lead.propertyId.wilaya || 'Alger'})</span>
                  </div>
                )}

                {/* Message body */}
                <p className="text-xs text-gray-700 dark:text-gray-300 bg-white dark:bg-[#0f172a] p-3 rounded border border-gray-100 dark:border-slate-800/60 leading-relaxed">
                  "{lead.message}"
                </p>

                {/* Existing Reply if already sent */}
                {hasReplied && (
                  <div className="bg-emerald-50/60 dark:bg-emerald-950/30 border-l-3 border-emerald-500 p-2.5 rounded-r text-xs text-emerald-900 dark:text-emerald-200">
                    <span className="text-[10px] font-bold block">✓ Votre réponse envoyée :</span>
                    "{lead.replyMessage}"
                  </div>
                )}

                {/* Actions: Call, WhatsApp & Reply */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-gray-100 dark:border-slate-800/60">
                  <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    📞 {lead.phone || 'Non renseigné'}
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setReplyingLead(lead)}
                      className="bg-[#E53935] hover:bg-[#d32f2f] text-white px-3.5 py-1.5 rounded text-xs font-bold transition-colors shadow-xs cursor-pointer"
                    >
                      💬 Répondre
                    </button>
                    {lead.phone && (
                      <a
                        href={`tel:${lead.phone}`}
                        className="bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-800 dark:text-gray-200 px-3 py-1.5 rounded text-xs font-bold transition-colors"
                      >
                        Appeler
                      </a>
                    )}
                    {lead.phone && (
                      <a
                        href={getWhatsAppUrl(lead.phone, lead.name, lead.propertyId?.title)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#25D366] hover:bg-[#20ba59] text-white px-3.5 py-1.5 rounded text-xs font-bold transition-colors shadow-xs flex items-center space-x-1"
                      >
                        <span>WhatsApp</span>
                      </a>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* In-app Reply Modal */}
      {replyingLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#1e293b] rounded-lg shadow-2xl border border-gray-100 dark:border-slate-800 p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                  Répondre à {replyingLead.name}
                </h3>
                <p className="text-xs text-gray-500">
                  {replyingLead.propertyId?.title || 'Demande d’information'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setReplyingLead(null)}
                className="w-7 h-7 rounded-full bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 text-gray-500 flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            {feedback && (
              <div className="p-3 bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300 rounded text-xs font-bold">
                {feedback}
              </div>
            )}

            <form onSubmit={handleSendReply} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Votre réponse au client :
                </label>
                <textarea
                  rows={4}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Rédigez votre réponse ou proposez un rendez-vous..."
                  required
                  className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded p-3 text-xs text-gray-800 dark:text-gray-200 focus:border-[#E53935] outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReplyingLead(null)}
                  className="px-4 py-2 rounded text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={sendingReply || !replyText.trim()}
                  className="bg-[#E53935] hover:bg-[#d32f2f] text-white px-5 py-2 rounded text-xs font-bold transition-colors disabled:opacity-50"
                >
                  {sendingReply ? 'Envoi...' : 'Envoyer la réponse'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

