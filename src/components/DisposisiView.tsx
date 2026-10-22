import React, { useState } from 'react';
import { 
  Layers, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  UserCheck, 
  Printer, 
  FileText, 
  Calendar, 
  Building,
  ArrowRight,
  Send
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SuratMasuk, DisposisiItem } from '../types';

interface DisposisiViewProps {
  onOpenPrintDisposisi: (surat: SuratMasuk) => void;
}

export const DisposisiView: React.FC<DisposisiViewProps> = ({ onOpenPrintDisposisi }) => {
  const { 
    suratMasukList, 
    setPreviewSuratMasuk, 
    setDisposisiModalSurat,
    setTindakLanjutModalData,
    currentUser 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusTab, setStatusTab] = useState<'all' | 'menunggu' | 'proses' | 'selesai' | 'urgent'>('all');

  // Flatten all disposisi items across all surat masuk
  const allDisposisiRows: { surat: SuratMasuk; disposisi: DisposisiItem }[] = [];
  suratMasukList.forEach(surat => {
    surat.disposisiList.forEach(disp => {
      allDisposisiRows.push({ surat, disposisi: disp });
    });
  });

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredRows = allDisposisiRows.filter(({ surat, disposisi }) => {
    const q = searchQuery.toLowerCase();
    const matchSearch = 
      surat.noAgenda.toLowerCase().includes(q) ||
      surat.pengirim.toLowerCase().includes(q) ||
      surat.perihal.toLowerCase().includes(q) ||
      disposisi.kepadaUserName.toLowerCase().includes(q) ||
      disposisi.kepadaUserJabatan.toLowerCase().includes(q) ||
      disposisi.instruksi.some(ins => ins.toLowerCase().includes(q));

    if (!matchSearch) return false;

    if (statusTab === 'menunggu') return disposisi.status === 'Menunggu';
    if (statusTab === 'proses') return disposisi.status === 'Dalam Proses';
    if (statusTab === 'selesai') return disposisi.status === 'Selesai';
    if (statusTab === 'urgent') {
      // Due within 2 days or overdue
      return disposisi.status !== 'Selesai' && disposisi.batasWaktu <= todayStr;
    }
    return true;
  });

  const getStatusBadge = (status: DisposisiItem['status']) => {
    switch (status) {
      case 'Selesai':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
            <CheckCircle2 className="w-3 h-3" />
            <span>Selesai</span>
          </span>
        );
      case 'Dalam Proses':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
            <Clock className="w-3 h-3" />
            <span>Dalam Proses</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
            <span>Menunggu</span>
          </span>
        );
    }
  };

  const isDueSoonOrOverdue = (deadline: string, status: string) => {
    if (status === 'Selesai') return false;
    return deadline <= todayStr;
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Monitoring Status Disposisi
            </h1>
            <span className="text-xs px-2.5 py-0.5 bg-indigo-50 text-indigo-700 font-semibold rounded-md font-mono-tabular">
              {allDisposisiRows.length} Total Instruksi
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Pelacakan alur berjenjang disposisi pimpinan, arahan tindak lanjut, tenggat waktu, dan penyelesaian tugas
          </p>
        </div>

        {/* Info on current role */}
        <div className="text-xs bg-white border border-slate-200 px-3 py-2 rounded-lg text-slate-600 shadow-xs flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-indigo-600" />
          <span>Pengguna Aktif: <strong>{currentUser.name}</strong> ({currentUser.jabatan})</span>
        </div>
      </div>

      {/* Segmented Filter Controls & Search */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Status Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto custom-scrollbar">
            <button
              onClick={() => setStatusTab('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                statusTab === 'all' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua ({allDisposisiRows.length})
            </button>
            <button
              onClick={() => setStatusTab('proses')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                statusTab === 'proses' ? 'bg-white text-amber-800 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Dalam Pengerjaan ({allDisposisiRows.filter(r => r.disposisi.status === 'Dalam Proses').length})
            </button>
            <button
              onClick={() => setStatusTab('selesai')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                statusTab === 'selesai' ? 'bg-white text-emerald-800 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tuntas / Selesai ({allDisposisiRows.filter(r => r.disposisi.status === 'Selesai').length})
            </button>
            <button
              onClick={() => setStatusTab('urgent')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                statusTab === 'urgent' ? 'bg-white text-rose-800 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mendekati / Lewat Tenggat
            </button>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari penerima, no agenda, instruksi..."
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

        </div>
      </div>

      {/* Disposisi List / Cards */}
      <div className="space-y-4">
        {filteredRows.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-400">
            <Layers className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p className="font-semibold text-slate-700">Tidak ada instruksi disposisi ditemukan</p>
            <p className="text-xs text-slate-400 mt-1">Gunakan filter status di atas atau cari dengan kata kunci lain.</p>
          </div>
        ) : (
          filteredRows.map(({ surat, disposisi }) => {
            const isUrgent = isDueSoonOrOverdue(disposisi.batasWaktu, disposisi.status);

            return (
              <div 
                key={disposisi.id}
                className={`bg-white border rounded-xl p-5 shadow-xs transition-all ${
                  isUrgent ? 'border-rose-300 ring-1 ring-rose-200' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Top Row: Surat Info & Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-mono-tabular font-bold text-xs px-2.5 py-1 bg-slate-100 text-slate-900 rounded-md">
                      {surat.noAgenda}
                    </span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="text-xs text-slate-500 font-mono-tabular">
                      No Asal: {surat.noSuratAsal}
                    </span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      {surat.pengirim}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {getStatusBadge(disposisi.status)}
                    {isUrgent && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200 font-mono-tabular">
                        <AlertCircle className="w-3 h-3" />
                        Perlu Perhatian Cepat!
                      </span>
                    )}
                  </div>
                </div>

                {/* Perihal Naskah Dinas */}
                <div className="my-3">
                  <div 
                    onClick={() => setPreviewSuratMasuk(surat)}
                    className="text-sm font-bold text-slate-900 hover:text-indigo-600 cursor-pointer line-clamp-2"
                  >
                    {surat.perihal}
                  </div>
                </div>

                {/* Flow: Dari Siapa ke Siapa */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs mb-3">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Pemberi Disposisi:</span>
                    <div className="font-bold text-slate-800 mt-0.5">{disposisi.dariUserName}</div>
                    <div className="text-[11px] text-slate-500">{disposisi.dariUserJabatan}</div>
                  </div>

                  <div>
                    <span className="text-[10px] text-indigo-600 uppercase font-semibold">Pejabat / Staf Penerima:</span>
                    <div className="font-bold text-indigo-900 mt-0.5 flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{disposisi.kepadaUserName}</span>
                    </div>
                    <div className="text-[11px] text-slate-600">{disposisi.kepadaUserJabatan}</div>
                  </div>
                </div>

                {/* Instruksi Checklist */}
                <div className="mb-3">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Instruksi Arahan Pimpinan:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {disposisi.instruksi.map((ins, i) => (
                      <span 
                        key={i} 
                        className="text-xs font-medium px-2 py-1 bg-white text-slate-800 rounded-md border border-slate-200 shadow-2xs"
                      >
                        ✓ {ins}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Catatan Arahan Pimpinan */}
                {disposisi.catatanPimpinan && (
                  <div className="p-3 bg-amber-50/50 rounded-lg border border-amber-200/70 text-xs text-amber-950 mb-3 leading-relaxed">
                    <strong>Catatan Pimpinan: </strong> {disposisi.catatanPimpinan}
                  </div>
                )}

                {/* Tindak Lanjut Report from recipient */}
                {disposisi.tindakLanjutCatatan ? (
                  <div className="p-3 bg-emerald-50/70 rounded-lg border border-emerald-200 text-xs text-emerald-950 mb-3 leading-relaxed">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-800 mb-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Laporan Tindak Lanjut Pelaksanaan:</span>
                    </div>
                    <p>{disposisi.tindakLanjutCatatan}</p>
                    {disposisi.tanggalSelesai && (
                      <div className="text-[10px] text-emerald-700 font-mono-tabular mt-1.5">
                        Diselesaikan pada: {new Date(disposisi.tanggalSelesai).toLocaleString('id-ID')}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-dashed border-slate-200 text-xs text-slate-400 italic mb-3">
                    Belum ada catatan laporan tindak lanjut dari penerima tugas.
                  </div>
                )}

                {/* Bottom Timing & Action Buttons */}
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3 text-slate-500 font-mono-tabular flex-wrap">
                    <span>Diterbitkan: {new Date(disposisi.tanggalDisposisi).toLocaleDateString('id-ID')}</span>
                    <span aria-hidden="true">·</span>
                    <span className={isUrgent ? 'text-rose-600 font-bold' : 'text-slate-700 font-medium'}>
                      Batas Waktu: {disposisi.batasWaktu}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenPrintDisposisi(surat)}
                      className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg flex items-center gap-1.5 transition-colors"
                      title="Cetak Lembar Disposisi"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Lembar Disposisi</span>
                    </button>
                    <button
                      onClick={() => setPreviewSuratMasuk(surat)}
                      className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg flex items-center gap-1.5 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Lihat Surat</span>
                    </button>
                    <button
                      onClick={() => setTindakLanjutModalData({ surat, disposisi })}
                      className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Update Tindak Lanjut</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
