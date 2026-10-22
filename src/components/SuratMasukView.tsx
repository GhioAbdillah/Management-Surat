import React, { useState } from 'react';
import { 
  Inbox, 
  Search, 
  Plus, 
  Filter, 
  FileText, 
  Printer, 
  Send, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Building,
  Calendar
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SuratMasuk, SifatSurat } from '../types';

interface SuratMasukViewProps {
  onOpenNew: () => void;
  onEdit: (surat: SuratMasuk) => void;
  onOpenPrintDisposisi: (surat: SuratMasuk) => void;
}

export const SuratMasukView: React.FC<SuratMasukViewProps> = ({
  onOpenNew,
  onEdit,
  onOpenPrintDisposisi
}) => {
  const { 
    suratMasukList, 
    deleteSuratMasuk, 
    setPreviewSuratMasuk, 
    setDisposisiModalSurat,
    setTindakLanjutModalData
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [sifatFilter, setSifatFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredList = suratMasukList.filter(item => {
    const query = searchQuery.toLowerCase();
    const matchQuery = 
      item.noAgenda.toLowerCase().includes(query) ||
      item.noSuratAsal.toLowerCase().includes(query) ||
      item.pengirim.toLowerCase().includes(query) ||
      item.perihal.toLowerCase().includes(query) ||
      item.klasifikasi.toLowerCase().includes(query);

    const matchSifat = sifatFilter === 'all' || item.sifat === sifatFilter;
    const matchStatus = statusFilter === 'all' || item.statusDisposisi === statusFilter;

    return matchQuery && matchSifat && matchStatus;
  });

  const getSifatBadge = (sifat: SifatSurat) => {
    switch (sifat) {
      case 'Segera': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Penting': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Rahasia': return 'bg-purple-50 text-purple-700 border-purple-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusBadge = (status: SuratMasuk['statusDisposisi']) => {
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
      case 'Didisposisikan':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
            <Send className="w-3 h-3" />
            <span>Didisposisikan</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
            <AlertTriangle className="w-3 h-3 text-slate-400" />
            <span>Belum Disposisi</span>
          </span>
        );
    }
  };

  const handleDelete = (id: string, agenda: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus surat masuk nomor agenda ${agenda}?`)) {
      deleteSuratMasuk(id);
    }
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Manajemen Surat Masuk
            </h1>
            <span className="text-xs px-2.5 py-0.5 bg-slate-100 text-slate-700 font-semibold rounded-md font-mono-tabular">
              {suratMasukList.length} Total
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Pencatatan naskah dinas masuk, penerbitan lembar disposisi, dan pelacakan tindak lanjut
          </p>
        </div>

        <button
          onClick={onOpenNew}
          className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Catat Surat Masuk Baru</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari berdasarkan No Agenda, No Surat Asal, Pengirim, atau Perihal..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>

          {/* Sifat Surat Filter */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Sifat:</span>
            <select
              value={sifatFilter}
              onChange={(e) => setSifatFilter(e.target.value)}
              className="text-xs px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none font-medium text-slate-700 focus:bg-white focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">Semua Sifat</option>
              <option value="Biasa">Biasa</option>
              <option value="Penting">Penting</option>
              <option value="Segera">Segera</option>
              <option value="Rahasia">Rahasia</option>
            </select>
          </div>

          {/* Status Disposisi Filter */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none font-medium text-slate-700 focus:bg-white focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">Semua Status</option>
              <option value="Belum Didisposisikan">Belum Didisposisikan</option>
              <option value="Didisposisikan">Didisposisikan</option>
              <option value="Dalam Proses">Dalam Proses</option>
              <option value="Selesai">Selesai</option>
            </select>
          </div>

        </div>

        {/* Quick filter summary */}
        {(sifatFilter !== 'all' || statusFilter !== 'all' || searchQuery) && (
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              Menampilkan <strong>{filteredList.length}</strong> dari {suratMasukList.length} berkas
            </span>
            <button
              onClick={() => {
                setSearchQuery('');
                setSifatFilter('all');
                setStatusFilter('all');
              }}
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Reset Filter
            </button>
          </div>
        )}
      </div>

      {/* High Density Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4 w-32">No. Agenda</th>
                <th className="py-3 px-4 min-w-[190px]">Pengirim & Asal Surat</th>
                <th className="py-3 px-4 min-w-[260px]">Perihal & Klasifikasi</th>
                <th className="py-3 px-4 w-28">Tgl Terima</th>
                <th className="py-3 px-4 w-24">Sifat</th>
                <th className="py-3 px-4 w-36">Status Disposisi</th>
                <th className="py-3 px-4 w-36 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Inbox className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="font-medium text-slate-600">Tidak ada surat masuk yang cocok</p>
                    <p className="text-xs text-slate-400 mt-1">Coba sesuaikan kata kunci pencarian atau filter.</p>
                  </td>
                </tr>
              ) : (
                filteredList.map((surat) => (
                  <tr 
                    key={surat.id}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    {/* No Agenda */}
                    <td className="py-3.5 px-4 font-mono-tabular font-bold text-slate-900 whitespace-nowrap">
                      {surat.noAgenda}
                    </td>

                    {/* Pengirim & No Surat Asal */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 flex items-center gap-1.5 line-clamp-1">
                        <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{surat.pengirim}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono-tabular mt-0.5 truncate">
                        No. Asal: {surat.noSuratAsal}
                      </div>
                    </td>

                    {/* Perihal & Klasifikasi */}
                    <td className="py-3.5 px-4">
                      <div 
                        onClick={() => setPreviewSuratMasuk(surat)}
                        className="font-medium text-slate-900 hover:text-indigo-600 cursor-pointer line-clamp-1"
                        title={surat.perihal}
                      >
                        {surat.perihal}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 truncate">
                        {surat.klasifikasi}
                      </div>
                    </td>

                    {/* Tgl Terima */}
                    <td className="py-3.5 px-4 font-mono-tabular text-slate-600 whitespace-nowrap">
                      {surat.tanggalTerima}
                    </td>

                    {/* Sifat */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${getSifatBadge(surat.sifat)}`}>
                        {surat.sifat}
                      </span>
                    </td>

                    {/* Status Disposisi */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getStatusBadge(surat.statusDisposisi)}
                      {surat.disposisiList.length > 0 && (
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {surat.disposisiList.length} instruksi aktif
                        </div>
                      )}
                    </td>

                    {/* Aksi Controls */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        
                        {/* Preview */}
                        <button
                          onClick={() => setPreviewSuratMasuk(surat)}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                          title="Lihat Pratinjau Naskah"
                        >
                          <FileText className="w-4 h-4" />
                        </button>

                        {/* Lembar Disposisi Print */}
                        <button
                          onClick={() => onOpenPrintDisposisi(surat)}
                          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
                          title="Cetak Lembar Disposisi"
                        >
                          <Printer className="w-4 h-4" />
                        </button>

                        {/* Beri Disposisi */}
                        <button
                          onClick={() => setDisposisiModalSurat(surat)}
                          className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                          title="Terbitkan Disposisi Pimpinan"
                        >
                          <Send className="w-4 h-4" />
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => onEdit(surat)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                          title="Edit Surat Masuk"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(surat.id, surat.noAgenda)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                          title="Hapus Surat Masuk"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Menampilkan seluruh arsip surat masuk terdaftar</span>
          <span className="font-mono-tabular font-medium">Buku Agenda Tahun Anggaran 2026</span>
        </div>
      </div>
    </div>
  );
};
