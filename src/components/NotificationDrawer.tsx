import React from 'react';
import { 
  Bell, 
  CheckCheck, 
  Trash2, 
  Clock, 
  AlertTriangle, 
  FileText, 
  Send, 
  CheckCircle2, 
  X,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AppNotification } from '../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const { 
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    clearNotification,
    suratMasukList,
    setPreviewSuratMasuk,
    setActiveNavTab,
    simulateRealTimeIncoming
  } = useApp();

  const [filter, setFilter] = React.useState<'all' | 'unread' | 'urgent'>('all');

  if (!isOpen) return null;

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.isRead;
    if (filter === 'urgent') return n.prioritas === 'kritis' || n.prioritas === 'tinggi';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleNotificationClick = (notif: AppNotification) => {
    markNotificationAsRead(notif.id);
    if (notif.suratId) {
      if (notif.suratType === 'masuk') {
        const found = suratMasukList.find(s => s.id === notif.suratId);
        if (found) {
          setPreviewSuratMasuk(found);
          setActiveNavTab('surat-masuk');
        }
      } else {
        setActiveNavTab('surat-keluar');
      }
      onClose();
    }
  };

  const getIcon = (type: AppNotification['tipe']) => {
    switch (type) {
      case 'surat_masuk_urgent':
        return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      case 'disposisi_baru':
        return <Send className="w-4 h-4 text-amber-600" />;
      case 'disposisi_selesai':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'jatuh_tempo':
        return <Clock className="w-4 h-4 text-rose-600" />;
      default:
        return <FileText className="w-4 h-4 text-indigo-600" />;
    }
  };

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' · ' +
        date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Notifikasi Disposisi & Surat</h2>
              <p className="text-xs text-slate-500">
                {unreadCount > 0 ? `${unreadCount} notifikasi baru belum dibaca` : 'Semua notifikasi telah dibaca'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Toolbar & Filter Tabs */}
        <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                filter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Semua ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                filter === 'unread' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Belum Dibaca ({unreadCount})
            </button>
            <button
              onClick={() => setFilter('urgent')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                filter === 'urgent' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Mendesak
            </button>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllNotificationsAsRead}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
              title="Tandai semua dibaca"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Baca Semua</span>
            </button>
          )}
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 custom-scrollbar">
          {filteredNotifications.length === 0 ? (
            <div className="py-16 text-center px-6">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
                <Bell className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-slate-700">Tidak ada notifikasi</p>
              <p className="text-xs text-slate-400 mt-1">
                Semua pembaruan alur disposisi dan surat masuk keluar akan muncul di sini.
              </p>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`p-4 transition-colors cursor-pointer group flex items-start gap-3 relative ${
                  notif.isRead ? 'bg-white hover:bg-slate-50/80' : 'bg-indigo-50/40 hover:bg-indigo-50/70'
                }`}
              >
                {!notif.isRead && (
                  <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-indigo-600" />
                )}
                <div className={`p-2 rounded-lg mt-0.5 shrink-0 ${
                  notif.prioritas === 'kritis' ? 'bg-rose-50' : 
                  notif.prioritas === 'tinggi' ? 'bg-amber-50' : 'bg-slate-100'
                }`}>
                  {getIcon(notif.tipe)}
                </div>

                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-semibold text-slate-900 truncate">
                      {notif.judul}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {notif.pesan}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-400 font-mono-tabular">
                    <span>{formatTime(notif.timestamp)}</span>
                    {notif.prioritas === 'kritis' && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-rose-600 font-medium">Prioritas Mendesak</span>
                      </>
                    )}
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    clearNotification(notif.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-slate-600 transition-opacity p-1"
                  title="Hapus notifikasi"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Real-Time Trigger Demo */}
        <div className="p-4 bg-slate-50 border-t border-slate-100">
          <button
            onClick={() => {
              simulateRealTimeIncoming();
            }}
            className="w-full py-2 px-3 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2 shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Simulasikan Surat Masuk Baru (Real-Time)</span>
          </button>
          <p className="text-[11px] text-slate-400 text-center mt-2">
            Klik tombol di atas untuk menguji notifikasi masuk seketika dengan audio chime.
          </p>
        </div>
      </div>
    </div>
  );
};
