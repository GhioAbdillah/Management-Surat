import React, { useState } from 'react';
import { 
  Bell, 
  ChevronDown, 
  FilePlus, 
  Users, 
  Building2,
  CheckCircle,
  Menu,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NotificationDrawer } from './NotificationDrawer';

interface HeaderProps {
  onOpenNewSuratMasuk: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNewSuratMasuk }) => {
  const { 
    currentUser, 
    setCurrentUser, 
    users, 
    notifications,
    activeNavTab, 
    setActiveNavTab 
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'surat-masuk', label: 'Surat Masuk' },
    { id: 'surat-keluar', label: 'Surat Keluar' },
    { id: 'disposisi', label: 'Disposisi' },
    { id: 'laporan', label: 'Laporan & Rekap' },
    { id: 'pengguna', label: 'Pengguna' }
  ];

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'pimpinan': return 'Pimpinan';
      case 'sekretaris': return 'Sekretaris / TU';
      case 'kabid': return 'Kepala Bidang';
      case 'staf': return 'Staf Pelaksana';
      case 'admin': return 'Administrator';
      default: return role;
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-8 h-16">
            
            {/* Zone 1: Brand Wordmark (Single text element) */}
            <div className="flex items-center gap-3 shrink-0">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-1.5 text-slate-500 hover:text-slate-900 rounded-lg"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <div 
                onClick={() => setActiveNavTab('dashboard')}
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-xs group-hover:bg-indigo-700 transition-colors">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0">
                    E-Surat Kedinasan
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium whitespace-nowrap">
                    Tata Kelola Persuratan & Disposisi
                  </span>
                </div>
              </div>
            </div>

            {/* Zone 2: Clean 5-6 Single-line Nav Links */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              {navItems.map((item) => {
                const isActive = activeNavTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveNavTab(item.id)}
                    className={`px-3 py-2 text-xs lg:text-sm font-medium rounded-md whitespace-nowrap shrink-0 transition-colors ${
                      isActive 
                        ? 'bg-slate-100 text-slate-900 font-semibold' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* Zone 3: 1 Primary Action & Profile Switcher */}
            <div className="flex items-center gap-2.5 shrink-0">
              
              {/* Quick Primary Action */}
              <button
                onClick={onOpenNewSuratMasuk}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors whitespace-nowrap shrink-0"
              >
                <FilePlus className="w-3.5 h-3.5" />
                <span>+ Catat Surat Masuk</span>
              </button>

              {/* Notification Bell Button */}
              <button
                onClick={() => setIsNotifOpen(true)}
                className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                title="Notifikasi Disposisi"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center font-mono-tabular ring-2 ring-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* User Switcher Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1.5 pl-2 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors text-left"
                >
                  <div className="w-7 h-7 rounded-md bg-slate-800 text-white text-xs font-semibold flex items-center justify-center shrink-0">
                    {currentUser.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                  </div>
                  <div className="hidden lg:block text-left max-w-[130px]">
                    <div className="text-xs font-semibold text-slate-800 truncate">
                      {currentUser.name}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">
                      {getRoleBadge(currentUser.role)}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-fadeIn"
                    onMouseLeave={() => setIsUserMenuOpen(false)}
                  >
                    <div className="px-3.5 py-2 border-b border-slate-100">
                      <div className="text-[11px] font-medium text-slate-400">Akun Aktif Saat Ini</div>
                      <div className="text-xs font-semibold text-slate-900 mt-0.5 truncate">{currentUser.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono-tabular">NIP. {currentUser.nip}</div>
                      <div className="text-[11px] text-indigo-600 font-medium mt-0.5">{currentUser.jabatan}</div>
                    </div>

                    <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>Ganti Peran Pengguna (Simulasi)</span>
                    </div>

                    <div className="max-h-60 overflow-y-auto custom-scrollbar">
                      {users.map((user) => {
                        const isSelected = user.id === currentUser.id;
                        return (
                          <button
                            key={user.id}
                            onClick={() => {
                              setCurrentUser(user);
                              setIsUserMenuOpen(false);
                            }}
                            className={`w-full px-3.5 py-2 text-left flex items-start justify-between gap-2 hover:bg-slate-50 transition-colors ${
                              isSelected ? 'bg-indigo-50/60' : ''
                            }`}
                          >
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-medium text-slate-800 truncate flex items-center gap-1.5">
                                <span>{user.name}</span>
                                {isSelected && <CheckCircle className="w-3 h-3 text-indigo-600 shrink-0" />}
                              </div>
                              <div className="text-[11px] text-slate-500 truncate">
                                {user.jabatan}
                              </div>
                              <div className="text-[10px] text-slate-400 mt-0.5">
                                Peran: <span className="font-medium text-slate-600">{getRoleBadge(user.role)}</span>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-2 pb-4 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveNavTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm font-medium rounded-lg ${
                  activeNavTab === item.id 
                    ? 'bg-slate-100 text-slate-900 font-semibold' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  onOpenNewSuratMasuk();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2 px-3 text-xs font-semibold text-white bg-indigo-600 rounded-lg flex items-center justify-center gap-1.5"
              >
                <FilePlus className="w-3.5 h-3.5" />
                <span>+ Catat Surat Masuk</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Real-time Notification Drawer */}
      <NotificationDrawer 
        isOpen={isNotifOpen} 
        onClose={() => setIsNotifOpen(false)} 
      />
    </>
  );
};
