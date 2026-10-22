import React, { useState } from 'react';
import { 
  Send, 
  Search, 
  Plus, 
  FileText, 
  Edit, 
  Trash2, 
  CheckCircle, 
  Clock, 
  Truck, 
  CheckCircle2, 
  AlertCircle,
  Building2,
  Calendar
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SuratKeluar, StatusSuratKeluar } from '../types';

interface SuratKeluarViewProps {
  onOpenNew: () => void;
  onEdit: (surat: SuratKeluar) => void;
}

export const SuratKeluarView: React.FC<SuratKeluarViewProps> = ({
  onOpenNew,
  onEdit
}) => {
  const { 
    suratKeluarList, 
    deleteSuratKeluar, 
    updateSuratKeluar, 
    currentUser 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedSuratPreview, setSelectedSuratPreview] = useState<SuratKeluar | null>(null);

  const filteredList = suratKeluarList.filter(item => {
    const query = searchQuery.toLowerCase();
    const matchQuery = 
      item.noAgendaKeluar.toLowerCase().includes(query) ||
      item.noSuratKeluar.toLowerCase().includes(query) ||
      item.tujuan.toLowerCase().includes(query) ||
      item.perihal.toLowerCase().includes(query) ||
      item.konseptor.toLowerCase().includes(query);

    const matchStatus = statusFilter === 'all' || item.statusParaf === statusFilter;
    return matchQuery && matchStatus;
  });

  const getStatusBadge = (status: StatusSuratKeluar) => {
    switch (status) {
      case 'Telah Terkirim':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
            <CheckCircle2 className="w-3 h-3" />
            <span>Terkirim</span>
          </span>
        );
      case 'Disetujui Pimpinan':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
            <CheckCircle className="w-3 h-3" />
            <span>Disetujui / TTD</span>
          </span>
        );
      case 'Menunggu Verifikasi':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
            <Clock className="w-3 h-3" />
            <span>Verifikasi Paraf</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
            <span>Konsep / Draft</span>
          </span>
        );
    }
  };

  const handleDelete = (id: string, noSurat: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus surat keluar nomor ${noSurat}?`)) {
      deleteSuratKeluar(id);
    }
  };

  const handleApproveParaf = (surat: SuratKeluar) => {
    updateSuratKeluar(surat.id, {
      statusParaf: 'Disetujui Pimpinan'
    });
  };

  const handleSendEkspedisi = (surat: SuratKeluar) => {
    const namaPetugas = prompt('Masukkan Nama Petugas / Catatan Ekspedisi Pengiriman:', 'Petugas Ekspedisi Kantor Pos / Kurir Internal');
    if (namaPetugas !== null) {
      updateSuratKeluar(surat.id, {
        statusParaf: 'Telah Terkirim',
        namaPenerimaEkspedisi: namaPetugas || 'Terkirim via E-Office / Kurir',
        tanggalKirim: new Date().toISOString()
      });
    }
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Manajemen Surat Keluar
            </h1>
            <span className="text-xs px-2.5 py-0.5 bg-slate-100 text-slate-700 font-semibold rounded-md font-mono-tabular">
              {suratKeluarList.length} Total
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Penyusunan naskah dinas keluar, penomoran resmi klasifikasi, paraf pimpinan, dan ekspedisi
          </p>
        </div>

        <button
          onClick={onOpenNew}
          className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Surat Keluar Baru</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari berdasarkan No Surat Keluar, Tujuan, Perihal, atau Konseptor..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Status Paraf:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none font-medium text-slate-700 focus:bg-white focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">Semua Status</option>
              <option value="Draft">Draft</option>
              <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
              <option value="Disetujui Pimpinan">Disetujui Pimpinan</option>
              <option value="Telah Terkirim">Telah Terkirim</option>
            </select>
          </div>

        </div>

        {(statusFilter !== 'all' || searchQuery) && (
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              Menampilkan <strong>{filteredList.length}</strong> dari {suratKeluarList.length} berkas
            </span>
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
              }}
              className="text-emerald-600 hover:text-emerald-800 font-medium"
            >
              Reset Filter
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4 w-32">No. Agenda</th>
                <th className="py-3 px-4 min-w-[210px]">Nomor Surat Dinas</th>
                <th className="py-3 px-4 min-w-[240px]">Tujuan Penerima & Perihal</th>
                <th className="py-3 px-4 w-32">Konseptor</th>
                <th className="py-3 px-4 w-28">Tgl Surat</th>
                <th className="py-3 px-4 w-36">Status Paraf</th>
                <th className="py-3 px-4 w-36 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Send className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="font-medium text-slate-600">Tidak ada surat keluar yang cocok</p>
                    <p className="text-xs text-slate-400 mt-1">Gunakan tombol "Buat Surat Keluar Baru" untuk menerbitkan.</p>
                  </td>
                </tr>
              ) : (
                filteredList.map((surat) => (
                  <tr 
                    key={surat.id}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    {/* No Agenda Keluar */}
                    <td className="py-3.5 px-4 font-mono-tabular font-bold text-slate-900 whitespace-nowrap">
                      {surat.noAgendaKeluar}
                    </td>

                    {/* No Surat Dinas */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono-tabular font-semibold text-slate-900">
                        {surat.noSuratKeluar}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                        Klas: {surat.klasifikasi}
                      </div>
                    </td>

                    {/* Tujuan & Perihal */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 line-clamp-1 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{surat.tujuan}</span>
                      </div>
                      <div 
                        onClick={() => setSelectedSuratPreview(surat)}
                        className="text-slate-600 hover:text-emerald-700 cursor-pointer line-clamp-1 mt-0.5"
                        title={surat.perihal}
                      >
                        {surat.perihal}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                        <span>Kirim: {surat.metodePengiriman}</span>
                        {surat.namaPenerimaEkspedisi && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="truncate max-w-[150px]">{surat.namaPenerimaEkspedisi}</span>
                          </>
                        )}
                      </div>
                    </td>

                    {/* Konseptor */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800 line-clamp-1">
                        {surat.konseptor}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Sifat: {surat.sifat}
                      </div>
                    </td>

                    {/* Tgl Surat */}
                    <td className="py-3.5 px-4 font-mono-tabular text-slate-600 whitespace-nowrap">
                      {surat.tanggalSurat}
                    </td>

                    {/* Status Paraf */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getStatusBadge(surat.statusParaf)}
                    </td>

                    {/* Aksi Controls */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        
                        {/* Preview Naskah */}
                        <button
                          onClick={() => setSelectedSuratPreview(surat)}
                          className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                          title="Lihat Pratinjau Naskah Surat Keluar"
                        >
                          <FileText className="w-4 h-4" />
                        </button>

                        {/* Paraf Approval Button (Pimpinan) */}
                        {currentUser.role === 'pimpinan' && surat.statusParaf === 'Menunggu Verifikasi' && (
                          <button
                            onClick={() => handleApproveParaf(surat)}
                            className="px-2 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md transition-colors shadow-xs"
                            title="Tandatangani / Setujui Surat Keluar"
                          >
                            Paraf TTD
                          </button>
                        )}

                        {/* Ekspedisi Pengiriman Button */}
                        {surat.statusParaf === 'Disetujui Pimpinan' && (
                          <button
                            onClick={() => handleSendEkspedisi(surat)}
                            className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors"
                            title="Catat Ekspedisi Pengiriman Surat"
                          >
                            <Truck className="w-4 h-4" />
                          </button>
                        )}

                        {/* Edit */}
                        <button
                          onClick={() => onEdit(surat)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                          title="Edit Data Surat Keluar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(surat.id, surat.noSuratKeluar)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                          title="Hapus Surat Keluar"
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
          <span>Sistem Ekspedisi & Tanda Tangan Elektronik Aktif</span>
          <span className="font-mono-tabular font-medium">Buku Agenda Surat Keluar 2026</span>
        </div>
      </div>

      {/* Pratinjau Naskah Surat Keluar Modal */}
      {selectedSuratPreview && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div 
            className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Pratinjau Naskah Surat Dinas Keluar
                </h2>
                <div className="text-xs text-slate-500 font-mono-tabular">
                  {selectedSuratPreview.noSuratKeluar} · Status: {selectedSuratPreview.statusParaf}
                </div>
              </div>
              <button
                onClick={() => setSelectedSuratPreview(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              <div className="border-2 border-slate-900 p-6 font-serif bg-white text-slate-900">
                <div className="text-center border-b-2 border-slate-900 pb-3 mb-4">
                  <div className="text-xs font-bold uppercase tracking-widest text-slate-600">
                    PEMERINTAH DAERAH PROVINSI
                  </div>
                  <div className="text-base font-black uppercase">
                    DINAS PERSURATAN DAN KEARSIPAN DAERAH
                  </div>
                  <div className="text-[11px] font-sans text-slate-500">
                    Jalan Mayor Oking No. 100 · Telp. (021) 7890-1234 · Laman: www.persuratan.prov.go.id
                  </div>
                </div>

                <div className="flex justify-between text-xs font-sans mb-4">
                  <div>
                    <div>Nomor : <span className="font-mono font-semibold">{selectedSuratPreview.noSuratKeluar}</span></div>
                    <div>Sifat : {selectedSuratPreview.sifat}</div>
                    <div>Lampiran : 1 (satu) berkas</div>
                    <div>Perihal : <strong>{selectedSuratPreview.perihal}</strong></div>
                  </div>
                  <div className="text-right">
                    <div>Di Tempat, {selectedSuratPreview.tanggalSurat}</div>
                    <div className="mt-2 text-left">
                      <div>Kepada Yth.</div>
                      <div className="font-bold">{selectedSuratPreview.tujuan}</div>
                      <div>di Tempat</div>
                    </div>
                  </div>
                </div>

                <div className="text-xs font-sans leading-relaxed my-4 p-3 bg-slate-50 rounded border border-slate-200">
                  {selectedSuratPreview.isiRingkas}
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs font-sans mt-8">
                  <div>
                    <div className="text-[11px] text-slate-500">Konseptor:</div>
                    <div className="font-medium">{selectedSuratPreview.konseptor}</div>
                    <div className="text-[10px] text-slate-400 font-mono">Status: {selectedSuratPreview.statusParaf}</div>
                  </div>

                  <div className="text-center">
                    <div>KEPALA DINAS,</div>
                    <div className="h-14 flex items-center justify-center">
                      {selectedSuratPreview.statusParaf === 'Disetujui Pimpinan' || selectedSuratPreview.statusParaf === 'Telah Terkirim' ? (
                        <span className="border border-emerald-500 text-emerald-700 bg-emerald-50 px-3 py-1 rounded text-[10px] font-mono">
                          [ TANDATANGAN DIGITAL TERVERIFIKASI ]
                        </span>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">[ Menunggu Tanda Tangan Pimpinan ]</span>
                      )}
                    </div>
                    <div className="font-bold underline">Dr. H. Bambang Suryono, M.Si.</div>
                    <div className="text-[10px] font-mono">NIP. 19740512 199803 1 004</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <span className="text-xs text-slate-500">Metode Pengiriman: {selectedSuratPreview.metodePengiriman}</span>
              <button
                onClick={() => setSelectedSuratPreview(null)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
