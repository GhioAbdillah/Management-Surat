import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  Calendar, 
  Filter, 
  Inbox, 
  Send, 
  CheckCircle2, 
  Clock, 
  Layers,
  ArrowDownToLine
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PrintLaporanModal } from './modal/PrintLaporanModal';
import { KLASIFIKASI_LIST } from '../data/initialData';

export const LaporanView: React.FC = () => {
  const { suratMasukList, suratKeluarList } = useApp();

  const [periode, setPeriode] = useState<'bulan' | 'triwulan' | 'tahun' | 'custom'>('bulan');
  const [filterType, setFilterType] = useState<'all' | 'masuk' | 'keluar'>('all');
  const [selectedKlasifikasi, setSelectedKlasifikasi] = useState<string>('all');
  const [customStart, setCustomStart] = useState('2026-03-01');
  const [customEnd, setCustomEnd] = useState('2026-03-31');
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Compute date ranges
  const filterByDate = (dateStr: string) => {
    if (periode === 'bulan') {
      return dateStr.startsWith('2026-03');
    }
    if (periode === 'triwulan') {
      return dateStr >= '2026-01-01' && dateStr <= '2026-03-31';
    }
    if (periode === 'tahun') {
      return dateStr.startsWith('2026');
    }
    if (periode === 'custom') {
      return dateStr >= customStart && dateStr <= customEnd;
    }
    return true;
  };

  const filteredMasuk = suratMasukList.filter(s => {
    const matchDate = filterByDate(s.tanggalTerima);
    const matchKlas = selectedKlasifikasi === 'all' || s.klasifikasi === selectedKlasifikasi;
    return matchDate && matchKlas;
  });

  const filteredKeluar = suratKeluarList.filter(s => {
    const matchDate = filterByDate(s.tanggalSurat);
    const matchKlas = selectedKlasifikasi === 'all' || s.klasifikasi === selectedKlasifikasi;
    return matchDate && matchKlas;
  });

  const getPeriodeText = () => {
    switch (periode) {
      case 'bulan': return 'Bulan Maret 2026';
      case 'triwulan': return 'Triwulan I (Januari - Maret 2026)';
      case 'tahun': return 'Tahun Anggaran 2026';
      case 'custom': return `${customStart} s/d ${customEnd}`;
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    
    // Header
    csvContent += 'Tipe,Nomor Agenda,Nomor Surat,Tanggal,Pengirim/Tujuan,Perihal,Sifat,Status\n';
    
    if (filterType === 'all' || filterType === 'masuk') {
      filteredMasuk.forEach(s => {
        const row = [
          'SURAT MASUK',
          `"${s.noAgenda}"`,
          `"${s.noSuratAsal}"`,
          s.tanggalTerima,
          `"${s.pengirim.replace(/"/g, '""')}"`,
          `"${s.perihal.replace(/"/g, '""')}"`,
          s.sifat,
          s.statusDisposisi
        ].join(',');
        csvContent += row + '\n';
      });
    }

    if (filterType === 'all' || filterType === 'keluar') {
      filteredKeluar.forEach(s => {
        const row = [
          'SURAT KELUAR',
          `"${s.noAgendaKeluar}"`,
          `"${s.noSuratKeluar}"`,
          s.tanggalSurat,
          `"${s.tujuan.replace(/"/g, '""')}"`,
          `"${s.perihal.replace(/"/g, '""')}"`,
          s.sifat,
          s.statusParaf
        ].join(',');
        csvContent += row + '\n';
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekapitulasi_Persuratan_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Laporan & Rekapitulasi Persuratan
            </h1>
            <span className="text-xs px-2.5 py-0.5 bg-slate-100 text-slate-700 font-semibold rounded-md font-mono-tabular">
              {getPeriodeText()}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Laporan pertanggungjawaban tata naskah dinas, volume surat masuk keluar, dan efektivitas disposisi
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <ArrowDownToLine className="w-4 h-4 text-slate-600" />
            <span>Ekspor CSV / Excel</span>
          </button>
          <button
            onClick={() => setIsPrintModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Laporan Resmi</span>
          </button>
        </div>
      </div>

      {/* Filter Parameters Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Periode */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Pilihan Periode Waktu
            </label>
            <select
              value={periode}
              onChange={(e) => setPeriode(e.target.value as 'bulan' | 'triwulan' | 'tahun' | 'custom')}
              className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500"
            >
              <option value="bulan">Bulan Ini (Maret 2026)</option>
              <option value="triwulan">Triwulan I 2026 (Jan - Mar)</option>
              <option value="tahun">Tahun Berjalan 2026</option>
              <option value="custom">Rentang Tanggal Khusus</option>
            </select>
          </div>

          {/* Jenis Surat */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Filter Jenis Naskah
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'all' | 'masuk' | 'keluar')}
              className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">Semua (Surat Masuk & Keluar)</option>
              <option value="masuk">Hanya Surat Masuk</option>
              <option value="keluar">Hanya Surat Keluar</option>
            </select>
          </div>

          {/* Klasifikasi */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Klasifikasi Kode Arsip
            </label>
            <select
              value={selectedKlasifikasi}
              onChange={(e) => setSelectedKlasifikasi(e.target.value)}
              className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">Semua Klasifikasi</option>
              {KLASIFIKASI_LIST.map((klas, idx) => (
                <option key={idx} value={klas}>{klas}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Custom Date Pickers */}
        {periode === 'custom' && (
          <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
            <span className="text-xs text-slate-500 font-medium">Mulai Tanggal:</span>
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md outline-none font-mono-tabular"
            />
            <span className="text-xs text-slate-500 font-medium">Sampai:</span>
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md outline-none font-mono-tabular"
            />
          </div>
        )}
      </div>

      {/* 4 Summary Stat Strips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono-tabular">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs text-slate-500 font-sans font-medium flex items-center justify-between">
            <span>Surat Masuk</span>
            <Inbox className="w-3.5 h-3.5 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {filteredMasuk.length}
          </div>
          <div className="text-[11px] text-slate-400 font-sans mt-1">
            Sifat Segera: {filteredMasuk.filter(s => s.sifat === 'Segera').length} berkas
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs text-slate-500 font-sans font-medium flex items-center justify-between">
            <span>Surat Keluar</span>
            <Send className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {filteredKeluar.length}
          </div>
          <div className="text-[11px] text-slate-400 font-sans mt-1">
            Terkirim: {filteredKeluar.filter(s => s.statusParaf === 'Telah Terkirim').length} berkas
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs text-slate-500 font-sans font-medium flex items-center justify-between">
            <span>Disposisi Tuntas</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {filteredMasuk.filter(s => s.statusDisposisi === 'Selesai').length}
          </div>
          <div className="text-[11px] text-slate-400 font-sans mt-1">
            Selesai 100% tepat waktu
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs text-slate-500 font-sans font-medium flex items-center justify-between">
            <span>Disposisi Berjalan</span>
            <Clock className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {filteredMasuk.filter(s => s.statusDisposisi === 'Dalam Proses' || s.statusDisposisi === 'Didisposisikan').length}
          </div>
          <div className="text-[11px] text-slate-400 font-sans mt-1">
            Dalam penanganan staf
          </div>
        </div>
      </div>

      {/* Rekapitulasi Data Tables */}
      <div className="space-y-6">
        
        {/* Table 1: Surat Masuk */}
        {(filterType === 'all' || filterType === 'masuk') && (
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Inbox className="w-4 h-4 text-indigo-600" />
                <h2 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Buku Agenda Surat Masuk ({filteredMasuk.length} Berkas)
                </h2>
              </div>
            </div>

            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase">
                    <th className="py-2.5 px-4 w-12 text-center">No</th>
                    <th className="py-2.5 px-4 w-32">No. Agenda</th>
                    <th className="py-2.5 px-4 min-w-[200px]">Pengirim & Asal</th>
                    <th className="py-2.5 px-4 min-w-[240px]">Perihal Naskah</th>
                    <th className="py-2.5 px-4 w-28">Tgl Terima</th>
                    <th className="py-2.5 px-4 w-24">Sifat</th>
                    <th className="py-2.5 px-4 w-32">Status Disposisi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredMasuk.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        Tidak ada data surat masuk untuk kriteria ini.
                      </td>
                    </tr>
                  ) : (
                    filteredMasuk.map((s, idx) => (
                      <tr key={s.id} className="hover:bg-slate-50/70">
                        <td className="py-3 px-4 text-center font-mono-tabular text-slate-500">{idx + 1}</td>
                        <td className="py-3 px-4 font-mono-tabular font-bold text-slate-900">{s.noAgenda}</td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900 line-clamp-1">{s.pengirim}</div>
                          <div className="text-[11px] text-slate-500 font-mono-tabular">{s.noSuratAsal}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-slate-800 line-clamp-1">{s.perihal}</div>
                          <div className="text-[11px] text-slate-400">{s.klasifikasi}</div>
                        </td>
                        <td className="py-3 px-4 font-mono-tabular text-slate-600">{s.tanggalTerima}</td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-slate-800">{s.sifat}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`font-semibold ${
                            s.statusDisposisi === 'Selesai' ? 'text-emerald-700' :
                            s.statusDisposisi === 'Dalam Proses' ? 'text-amber-700' : 'text-slate-600'
                          }`}>
                            {s.statusDisposisi}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Table 2: Surat Keluar */}
        {(filterType === 'all' || filterType === 'keluar') && (
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-emerald-600" />
                <h2 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Buku Agenda Surat Keluar ({filteredKeluar.length} Berkas)
                </h2>
              </div>
            </div>

            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase">
                    <th className="py-2.5 px-4 w-12 text-center">No</th>
                    <th className="py-2.5 px-4 w-32">No. Agenda</th>
                    <th className="py-2.5 px-4 min-w-[210px]">Nomor Surat Dinas</th>
                    <th className="py-2.5 px-4 min-w-[240px]">Tujuan & Perihal</th>
                    <th className="py-2.5 px-4 w-28">Tgl Surat</th>
                    <th className="py-2.5 px-4 w-32">Konseptor</th>
                    <th className="py-2.5 px-4 w-32">Status Paraf</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredKeluar.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        Tidak ada data surat keluar untuk kriteria ini.
                      </td>
                    </tr>
                  ) : (
                    filteredKeluar.map((s, idx) => (
                      <tr key={s.id} className="hover:bg-slate-50/70">
                        <td className="py-3 px-4 text-center font-mono-tabular text-slate-500">{idx + 1}</td>
                        <td className="py-3 px-4 font-mono-tabular font-bold text-slate-900">{s.noAgendaKeluar}</td>
                        <td className="py-3 px-4 font-mono-tabular font-semibold text-slate-900">{s.noSuratKeluar}</td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900 line-clamp-1">{s.tujuan}</div>
                          <div className="text-[11px] text-slate-600 line-clamp-1">{s.perihal}</div>
                        </td>
                        <td className="py-3 px-4 font-mono-tabular text-slate-600">{s.tanggalSurat}</td>
                        <td className="py-3 px-4 text-slate-700 font-medium">{s.konseptor}</td>
                        <td className="py-3 px-4">
                          <span className={`font-semibold ${
                            s.statusParaf === 'Telah Terkirim' ? 'text-emerald-700' :
                            s.statusParaf === 'Disetujui Pimpinan' ? 'text-teal-700' : 'text-slate-600'
                          }`}>
                            {s.statusParaf}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* Official Print Modal */}
      {isPrintModalOpen && (
        <PrintLaporanModal
          suratMasuk={filteredMasuk}
          suratKeluar={filteredKeluar}
          periodeText={getPeriodeText()}
          filterType={filterType}
          onClose={() => setIsPrintModalOpen(false)}
        />
      )}
    </div>
  );
};
