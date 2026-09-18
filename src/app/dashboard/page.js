'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import FavoritesView from '@/components/dashboard/FavoritesView';
import MessagesVisitsView from '@/components/dashboard/MessagesVisitsView';
import AddPropertyView from '@/components/dashboard/AddPropertyView';
import MyListingsView from '@/components/dashboard/MyListingsView';
import ClientRequestsView from '@/components/dashboard/ClientRequestsView';
import ProfileSettingsView from '@/components/dashboard/ProfileSettingsView';
import AdvertiserOnboardingModal from '@/components/dashboard/AdvertiserOnboardingModal';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, isAuthenticated, logout, updateUser, API_BASE } = useAuth();

  const [activeMode, setActiveMode] = useState('client'); // 'client' | 'advertiser'
  const [activeTab, setActiveTab] = useState('favorites'); // 'favorites' | 'messages_visits' | 'add_property' | 'my_listings' | 'client_requests' | 'profile_settings'
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [onboardingModalOpen, setOnboardingModalOpen] = useState(false);

  // Sync mode with user profile on load
  useEffect(() => {
    if (user) {
      const mode = user.activeDashboardMode || 'client';
      setActiveMode(mode);
      if (mode === 'advertiser') {
        setActiveTab((prev) => (prev === 'favorites' || prev === 'messages_visits' ? 'my_listings' : prev));
      } else {
        setActiveTab((prev) => (prev === 'add_property' || prev === 'my_listings' || prev === 'client_requests' ? 'favorites' : prev));
      }
    }
  }, [user]);

  // Mode Toggle Handler
  const handleToggleMode = async () => {
    if (activeMode === 'client') {
      // Switching from Client to Advertiser
      if (!user?.hasAdvertiserProfile) {
        // Open Onboarding Modal
        setOnboardingModalOpen(true);
        return;
      }

      // Switch to advertiser via API
      try {
        const res = await fetch(`${API_BASE}/api/dashboard/toggle-mode`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ targetMode: 'advertiser' })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setActiveMode('advertiser');
          setActiveTab('my_listings');
          updateUser(data.user);
        }
      } catch (err) {
        console.error('Error toggling mode to advertiser:', err);
      }
    } else {
      // Switching from Advertiser to Client
      try {
        const res = await fetch(`${API_BASE}/api/dashboard/toggle-mode`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ targetMode: 'client' })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setActiveMode('client');
          setActiveTab('favorites');
          updateUser(data.user);
        }
      } catch (err) {
        console.error('Error toggling mode to client:', err);
      }
    }
  };

  // Onboarding completed successfully
  const handleOnboardingSuccess = (updatedUser) => {
    updateUser(updatedUser);
    setActiveMode('advertiser');
    setActiveTab('my_listings');
    setOnboardingModalOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-160px)] flex items-center justify-center bg-gray-50 dark:bg-[#0f172a]">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-3 border-[#E53935] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-gray-500 font-medium">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  // Not authenticated fallback
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-[calc(100vh-160px)] flex items-center justify-center bg-gray-50 dark:bg-[#0f172a] p-4">
        <div className="bg-white dark:bg-[#1e293b] border border-gray-100 dark:border-slate-800 rounded-lg p-8 max-w-md w-full text-center space-y-4 shadow-xl">
          <div className="w-14 h-14 mx-auto rounded-full bg-red-50 dark:bg-red-950/40 text-[#E53935] flex items-center justify-center text-2xl">
            🔒
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white">Connexion Requise</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Veuillez vous connecter pour accéder à votre espace de gestion et vos annonces immobilières en Algérie.
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/login"
              className="bg-[#E53935] hover:bg-[#d32f2f] text-white text-xs font-bold py-2.5 rounded transition-colors shadow-xs"
            >
              Se Connecter
            </Link>
            <Link
              href="/signup"
              className="bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-800 dark:text-gray-200 text-xs font-semibold py-2.5 rounded transition-colors"
            >
              Créer un Compte
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] transition-colors duration-200">
      
      {/* Mobile Bar for toggling drawer */}
      <div className="lg:hidden bg-white dark:bg-[#1e293b] border-b border-gray-100 dark:border-slate-800 px-4 py-3 flex items-center justify-between sticky top-20 z-30 shadow-2xs">
        <button
          type="button"
          onClick={() => setMobileDrawerOpen(true)}
          className="flex items-center space-x-2 text-xs font-bold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-slate-800 px-3 py-1.5 rounded-[4px] cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span>Menu Tableau de Bord</span>
        </button>

        <span className={`text-[10px] font-extrabold px-2 py-1 rounded uppercase ${
          activeMode === 'client'
            ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
            : 'bg-red-100 dark:bg-red-950/60 text-[#E53935]'
        }`}>
          {activeMode === 'client' ? '👤 Mode Client' : '🏢 Mode Annonceur'}
        </span>
      </div>

      {/* Main Container */}
      <div className="max-w-[1400px] mx-auto flex">
        
        {/* DESKTOP FIXED/STICKY SIDEBAR */}
        <div className="hidden lg:block w-72 shrink-0 h-[calc(100vh-80px)] sticky top-20 overflow-y-auto">
          <DashboardSidebar
            user={user}
            activeMode={activeMode}
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            onToggleMode={handleToggleMode}
            onLogout={handleLogout}
          />
        </div>

        {/* MOBILE DRAWER SIDEBAR (SLIDE-OVER) */}
        {mobileDrawerOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop Overlay */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
              onClick={() => setMobileDrawerOpen(false)}
            />

            {/* Slide-out Drawer */}
            <div className="relative w-80 max-w-[85vw] h-full bg-white dark:bg-[#1e293b] z-10 shadow-2xl flex flex-col animate-in slide-in-from-left duration-250">
              <div className="p-3 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-800 dark:text-white">MAKAN Dashboard</span>
                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1 rounded text-gray-500 hover:text-gray-800 dark:hover:text-white text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                <DashboardSidebar
                  user={user}
                  activeMode={activeMode}
                  activeTab={activeTab}
                  onSelectTab={setActiveTab}
                  onToggleMode={handleToggleMode}
                  onLogout={handleLogout}
                  onCloseMobile={() => setMobileDrawerOpen(false)}
                />
              </div>
            </div>
          </div>
        )}

        {/* MAIN VIEW CONTENT */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-80px)]">
          
          {/* CLIENT VIEWS */}
          {activeMode === 'client' && (
            <>
              {activeTab === 'favorites' && <FavoritesView apiBase={API_BASE} />}
              {activeTab === 'messages_visits' && <MessagesVisitsView apiBase={API_BASE} />}
            </>
          )}

          {/* ADVERTISER VIEWS */}
          {activeMode === 'advertiser' && (
            <>
              {activeTab === 'add_property' && (
                <AddPropertyView
                  apiBase={API_BASE}
                  onPropertyCreated={() => setActiveTab('my_listings')}
                />
              )}
              {activeTab === 'my_listings' && (
                <MyListingsView
                  apiBase={API_BASE}
                  onAddClick={() => setActiveTab('add_property')}
                />
              )}
              {activeTab === 'client_requests' && <ClientRequestsView apiBase={API_BASE} />}
            </>
          )}

          {/* GLOBAL VIEW */}
          {activeTab === 'profile_settings' && (
            <ProfileSettingsView
              user={user}
              onProfileUpdated={updateUser}
              apiBase={API_BASE}
            />
          )}

        </main>

      </div>

      {/* Advertiser Onboarding Modal */}
      <AdvertiserOnboardingModal
        isOpen={onboardingModalOpen}
        onClose={() => setOnboardingModalOpen(false)}
        onSuccess={handleOnboardingSuccess}
        apiBase={API_BASE}
      />

    </div>
  );
}
