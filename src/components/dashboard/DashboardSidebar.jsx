'use client';

export default function DashboardSidebar({
  user,
  activeMode, // 'client' | 'advertiser'
  activeTab,
  onSelectTab,
  onToggleMode,
  onLogout,
  onCloseMobile
}) {
  const isClient = activeMode === 'client';

  const clientNavItems = [
    {
      id: 'favorites',
      labelFr: 'Biens Favoris',
      icon: '❤️',
      badge: user?.favorites?.length || 0
    },
    {
      id: 'messages_visits',
      labelFr: 'Messages & Visites',
      icon: '📅'
    }
  ];

  const advertiserNavItems = [
    {
      id: 'add_property',
      labelFr: 'Ajouter une Annonce',
      icon: '➕',
      highlight: true
    },
    {
      id: 'my_listings',
      labelFr: 'Mes Annonces',
      icon: '🏠'
    },
    {
      id: 'client_requests',
      labelFr: 'Demandes Clients',
      icon: '📬'
    }
  ];

  const currentNavItems = isClient ? clientNavItems : advertiserNavItems;

  const handleNavClick = (tabId) => {
    onSelectTab(tabId);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <aside className="w-full h-full flex flex-col justify-between bg-white dark:bg-[#1e293b] border-r border-gray-100 dark:border-slate-800 p-4 space-y-4 select-none">
      
      {/* Top Section: User Summary & Mode Toggle */}
      <div className="space-y-4">
        
        {/* User Mini Profile Header */}
        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-slate-800/80 rounded-lg border border-gray-100 dark:border-slate-800">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
            alt={user?.name || 'User'}
            className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-slate-700 shrink-0"
          />
          <div className="overflow-hidden">
            <h2 className="text-xs font-bold text-gray-900 dark:text-white truncate">
              {user?.name || 'Utilisateur MAKAN'}
            </h2>
            <p className="text-[10.5px] text-gray-400 truncate">{user?.email}</p>
            <span className={`inline-block mt-1 text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider ${
              isClient
                ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                : 'bg-red-100 dark:bg-red-950/60 text-[#E53935]'
            }`}>
              {isClient ? '👤 Espace Client' : '🏢 Espace Annonceur'}
            </span>
          </div>
        </div>

        {/* THE DUAL-MODE TOGGLE SWITCHER */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-gray-400 dark:text-gray-400 uppercase tracking-wider px-1">
            Mode Tableau de Bord
          </label>
          <button
            type="button"
            onClick={onToggleMode}
            className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-800/60 hover:border-[#E53935] dark:hover:border-[#E53935] transition-all flex items-center justify-between group cursor-pointer shadow-2xs"
          >
            <div className="flex items-center space-x-2 text-left">
              <span className="text-base">{isClient ? '🏢' : '👤'}</span>
              <div>
                <p className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-[#E53935] transition-colors">
                  {isClient ? 'Passer en Mode Annonceur' : 'Passer en Mode Client'}
                </p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">
                  {isClient ? 'Gestion des biens & prospects' : 'Recherche & favoris'}
                </p>
              </div>
            </div>

            {/* Toggle icon pill */}
            <div className={`w-8 h-4 rounded-full transition-colors flex items-center p-0.5 ${
              isClient ? 'bg-gray-300 dark:bg-slate-700 justify-start' : 'bg-[#E53935] justify-end'
            }`}>
              <div className="w-3 h-3 rounded-full bg-white shadow-xs"></div>
            </div>
          </button>
        </div>

        {/* Navigation Items for Active Mode */}
        <div className="space-y-1 pt-1">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 py-1">
            {isClient ? 'Navigation Client' : 'Gestion Annonces'}
          </div>

          {currentNavItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-[4px] text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#E53935] text-white shadow-xs'
                    : item.highlight
                    ? 'bg-red-50 dark:bg-red-950/30 text-[#E53935] hover:bg-red-100 dark:hover:bg-red-950/50'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <span className="text-sm">{item.icon}</span>
                  <div className="text-left">
                    <span>{item.labelFr}</span>
                  </div>
                </div>

                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-white text-[#E53935]' : 'bg-red-100 dark:bg-red-950 text-[#E53935]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

      </div>

      {/* Bottom Section: Profile Settings & Sign Out */}
      <div className="pt-4 border-t border-gray-100 dark:border-slate-800 space-y-1">
        <button
          type="button"
          onClick={() => handleNavClick('profile_settings')}
          className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-[4px] text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'profile_settings'
              ? 'bg-[#E53935] text-white shadow-xs'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
          }`}
        >
          <span className="text-sm">⚙️</span>
          <div className="text-left">
            <span>Profil & Paramètres</span>
          </div>
        </button>

        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-[4px] text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all cursor-pointer"
        >
          <span className="text-sm">🚪</span>
          <div className="text-left">
            <span>Déconnexion</span>
          </div>
        </button>
      </div>

    </aside>
  );
}
