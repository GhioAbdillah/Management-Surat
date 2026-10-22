import React from 'react';
import { 
  Inbox, 
  Send, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowUpRight, 
  FileText, 
  UserCheck, 
  Sparkles,
  Calendar,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SuratMasuk } from '../types';

interface DashboardViewProps {
  onOpenNewSuratMasuk: () => void;
  onOpenNewSuratKeluar: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ 
  onOpenNewSuratMasuk,
  onOpenNewSuratKeluar
}) => {
  const { 
    currentUser, 
    stats, 
    suratMasukList, 
    suratKeluarList, 
    auditLogs,
    setPreviewSuratMasuk,
    setDisposisiModalSurat,
    setTindakLanjutModalData,
    setActiveNavTab,
    simulateRealTimeIncoming
  } = useApp();

  // Find urgent incoming mail that hasn't been disposed yet
  const urgentUndisposed = suratMasukList.filter(
    s => s.statusDisposisi === 'Belum Didisposisikan' && (s.sifat === 'Segera' || s.sifat === 'Penting')
  );

  // Active disposisi needing follow-up
  const activeDisposisiEntries = suratMasukList.flatMap(s => 
    s.disposisiList
      .filter(d => d.status !== 'Selesai')
      .map(d => ({ surat: s, disposisi: d }))
  );

  // Month labels for trend chart
  const monthsData = [
    { month: 'Okt', masuk: 18, keluar: 14 },
    { month: 'Nov', masuk: 24, keluar: 19 },
    { month: 'Des', masuk: 32, keluar: 28 },
    { month: 'Jan', masuk: 21, keluar: 17 },
    { month: 'Feb', masuk: 27, keluar: 22 },
    { month: 'Mar', masuk: suratMasukList.length + 15, keluar: suratKeluarList.length + 12 }
  ];

  const maxVal = Math.max(...monthsData.map(m => Math.max(m.masuk, m.keluar)), 40);

  const getSifatColor = (sifat: string) => {
    switch (sifat) {
      case 'Segera': return 'text-rose-700 bg-rose-50 border-rose-200';
      case 'Penting': return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Rahasia': return 'text-purple-700 bg-purple-50 border-purple-200';
      default: return 'text-slate-700 bg-slate-100 border-slate-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Selesai': return 'text-emerald-700 bg-emerald-50';
      case 'Dalam Proses': return 'text-amber-700 bg-amber-50';
      case 'Didisposisikan': return 'text-indigo-700 bg-indigo-50';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner / Welcome */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
            <span>
              {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <span aria-hidden="true">·</span>
            <span>Instansi Pemerintah Daerah</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Selamat Datang, {currentUser.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Sistem informasi persuratan aktif. Memantau distribusi surat dinas, disposisi berjenjang, dan percepatan tindak lanjut staf.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => simulateRealTimeIncoming()}
            className="px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
            title="Uji simulasi notifikasi"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Simulasi Masuk</span>
          </button>
          <button
            onClick={onOpenNewSuratMasuk}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>Catat Masuk</span>
          </button>
          <button
            onClick={onOpenNewSuratKeluar}
            className="px-3.5 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5 text-slate-600" />
            <span>Surat Keluar</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards with Tabular Numerals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Surat Masuk */}
        <div 
          onClick={() => setActiveNavTab('surat-masuk')}
          className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-slate-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Total Surat Masuk</span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 transition-colors">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono-tabular">
            {stats.totalSuratMasuk}
          </div>
          <div className="flex items-center gap-1 mt-2 text-xs text-slate-500">
            <span className="text-emerald-600 font-semibold font-mono-tabular">+{stats.suratHariIni} baru</span>
            <span>hari ini</span>
          </div>
        </div>

        {/* Surat Keluar */}
        <div 
          onClick={() => setActiveNavTab('surat-keluar')}
          className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-slate-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Total Surat Keluar</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100 transition-colors">
              <Send className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono-tabular">
            {stats.totalSuratKeluar}
          </div>
          <div className="flex items-center gap-1 mt-2 text-xs text-slate-500">
            <span className="text-slate-700 font-medium font-mono-tabular">
              {suratKeluarList.filter(s => s.statusParaf === 'Telah Terkirim').length} terkirim
            </span>
            <span aria-hidden="true">·</span>
            <span>{suratKeluarList.filter(s => s.statusParaf === 'Disetujui Pimpinan').length} ttd</span>
          </div>
        </div>

        {/* Disposisi Aktif */}
        <div 
          onClick={() => setActiveNavTab('disposisi')}
          className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-slate-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Disposisi Berjalan</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600 group-hover:bg-amber-100 transition-colors">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono-tabular">
            {stats.disposisiAktif}
          </div>
          <div className="flex items-center gap-1 mt-2 text-xs text-slate-500">
            <span className="text-amber-700 font-semibold font-mono-tabular">
              {activeDisposisiEntries.length} instruksi
            </span>
            <span>sedang diproses</span>
          </div>
        </div>

        {/* Disposisi Selesai */}
        <div 
          onClick={() => setActiveNavTab('disposisi')}
          className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-slate-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Tindak Lanjut Selesai</span>
            <div className="p-2 rounded-lg bg-teal-50 text-teal-600 group-hover:bg-teal-100 transition-colors">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono-tabular">
            {stats.disposisiSelesai}
          </div>
          <div className="flex items-center gap-1 mt-2 text-xs text-slate-500">
            <span className="text-teal-700 font-semibold font-mono-tabular">100% tuntas</span>
            <span>terarsipkan</span>
          </div>
        </div>

      </div>

      {/* Urgent Action Alert Section if any */}
      {urgentUndisposed.length > 0 && (
        <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-rose-100 text-rose-700 shrink-0 mt-0.5">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-rose-900">
                Perhatian: Terdapat {urgentUndisposed.length} Surat Masuk Sifat Segera / Penting Belum Didisposisikan
              </h2>
              <p className="text-xs text-rose-700 mt-0.5">
                Surat dari <span className="font-semibold">{urgentUndisposed[0].pengirim}</span> memerlukan disposisi arahan pimpinan segera.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setDisposisiModalSurat(urgentUndisposed[0]);
            }}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded-lg shrink-0 transition-colors shadow-xs"
          >
            Beri Disposisi Sekarang
          </button>
        </div>
      )}

      {/* Two Column Grid: Disposisi Status Queue & Volume Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Active Disposisi Workflow Monitoring */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  <span>Antrean Disposisi & Instruksi Pimpinan</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pemantauan real-time status tindak lanjut pejabat dan staf pelaksana
                </p>
              </div>
              <button
                onClick={() => setActiveNavTab('disposisi')}
                className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
              >
                <span>Lihat Semua</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {activeDisposisiEntries.length === 0 ? (
              <div className="py-12 text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-800">Semua disposisi telah tuntas!</p>
                <p className="text-xs text-slate-500 mt-0.5">Tidak ada antrean disposisi tertunda saat ini.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activeDisposisiEntries.slice(0, 4).map(({ surat, disposisi }) => (
                  <div
                    key={disposisi.id}
                    className="p-3.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-white transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-mono-tabular text-xs font-semibold text-slate-800">
                          {surat.noAgenda}
                        </span>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${getSifatColor(surat.sifat)}`}>
                          {surat.sifat}
                        </span>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <span className="text-xs text-slate-500 truncate max-w-[200px]">
                          {surat.pengirim}
                        </span>
                      </div>
                      
                      <div className="text-xs font-medium text-slate-900 line-clamp-1 mb-1">
                        {surat.perihal}
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-slate-600 flex-wrap">
                        <span className="font-medium text-indigo-700 flex items-center gap-1">
                          <UserCheck className="w-3 h-3" />
                          Kepada: {disposisi.kepadaUserName}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="text-rose-600 font-mono-tabular font-medium">
                          Tenggat: {disposisi.batasWaktu}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-md ${getStatusColor(disposisi.status)}`}>
                        {disposisi.status}
                      </span>
                      <button
                        onClick={() => setTindakLanjutModalData({ surat, disposisi })}
                        className="px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors"
                      >
                        Tindak Lanjut
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Standar Waktu Penyelesaian Disposisi: Maksimal 3 Hari Kerja</span>
            <span className="font-mono-tabular font-medium text-slate-700">SOP Persuratan No. 045/TU/2026</span>
          </div>
        </div>

        {/* Right 1 Col: Volume Surat Monthly Trend (SVG Chart) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-slate-100 mb-4">
              <h2 className="text-base font-semibold text-slate-900">
                Volume Surat 6 Bulan Terakhir
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Perbandingan arus surat masuk vs surat keluar
              </p>
            </div>

            {/* SVG Interactive Bars */}
            <div className="pt-2">
              <div className="flex items-end justify-between h-44 gap-2 px-2 border-b border-slate-200 pb-2">
                {monthsData.map((d, i) => {
                  const heightMasuk = (d.masuk / maxVal) * 100;
                  const heightKeluar = (d.keluar / maxVal) * 100;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                      {/* Tooltip */}
                      <div className="opacity-0 group-hover:opacity-100 pointer-events-none absolute -top-10 bg-slate-800 text-white text-[10px] py-1 px-1.5 rounded shadow whitespace-nowrap transition-opacity z-20 font-mono-tabular">
                        Masuk: {d.masuk} | Keluar: {d.keluar}
                      </div>

                      <div className="w-full flex items-end justify-center gap-1 h-36">
                        <div 
                          style={{ height: `${heightMasuk}%` }} 
                          className="w-2.5 sm:w-3 bg-indigo-600 rounded-t-xs hover:bg-indigo-700 transition-all"
                          title={`Surat Masuk: ${d.masuk}`}
                        />
                        <div 
                          style={{ height: `${heightKeluar}%` }} 
                          className="w-2.5 sm:w-3 bg-emerald-500 rounded-t-xs hover:bg-emerald-600 transition-all"
                          title={`Surat Keluar: ${d.keluar}`}
                        />
                      </div>
                      <span className="text-[11px] font-medium text-slate-500 mt-1">
                        {d.month}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-4 mt-3 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-xs bg-indigo-600" />
                  <span>Surat Masuk ({stats.totalSuratMasuk})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-xs bg-emerald-500" />
                  <span>Surat Keluar ({stats.totalSuratKeluar})</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-center">
            <button
              onClick={() => setActiveNavTab('laporan')}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1 transition-colors"
            >
              <span>Buka Rekapitulasi Laporan Lengkap</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Bottom Section: Recent Letters & Audit Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Surat Masuk */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Inbox className="w-4 h-4 text-indigo-600" />
              <span>Surat Masuk Terbaru</span>
            </h2>
            <button
              onClick={() => setActiveNavTab('surat-masuk')}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              Kelola Surat Masuk
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {suratMasukList.slice(0, 4).map((surat) => (
              <div 
                key={surat.id}
                onClick={() => setPreviewSuratMasuk(surat)}
                className="py-3 flex items-start justify-between gap-3 hover:bg-slate-50/70 px-2 rounded-lg cursor-pointer transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono-tabular font-semibold text-slate-800">{surat.noAgenda}</span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="text-slate-500 truncate">{surat.pengirim}</span>
                  </div>
                  <div className="text-xs font-medium text-slate-900 mt-1 truncate">
                    {surat.perihal}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1 font-mono-tabular">
                    <span>Tgl Terima: {surat.tanggalTerima}</span>
                    <span aria-hidden="true">·</span>
                    <span className={`font-medium ${
                      surat.statusDisposisi === 'Selesai' ? 'text-emerald-600' :
                      surat.statusDisposisi === 'Didisposisikan' ? 'text-indigo-600' : 'text-amber-600'
                    }`}>
                      {surat.statusDisposisi}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 text-slate-400 p-1">
                  <FileText className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Trail Log */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-600" />
              <span>Log Aktivitas Sistem Persuratan</span>
            </h2>
            <span className="text-xs text-slate-400">Audit Trail Aman</span>
          </div>

          <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto custom-scrollbar">
            {auditLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="py-2.5 px-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-800">{log.action}</span>
                  <span className="text-[11px] text-slate-400 font-mono-tabular">
                    {new Date(log.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  {log.detail}
                </p>
                <div className="text-[10px] text-slate-400 mt-1 font-medium">
                  Oleh: {log.userName} ({log.userRole})
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
