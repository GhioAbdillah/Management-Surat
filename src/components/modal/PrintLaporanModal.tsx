import React from 'react';
import { X, Printer } from 'lucide-react';
import { SuratMasuk, SuratKeluar } from '../../types';

interface PrintLaporanModalProps {
  suratMasuk: SuratMasuk[];
  suratKeluar: SuratKeluar[];
  periodeText: string;
  filterType: 'all' | 'masuk' | 'keluar';
  onClose: () => void;
}

export const PrintLaporanModal: React.FC<PrintLaporanModalProps> = ({
  suratMasuk,
  suratKeluar,
  periodeText,
  filterType,
  onClose
}) => {
  const handlePrint = () => {
    window.print();
  };

  const showMasuk = filterType === 'all' || filterType === 'masuk';
  const showKeluar = filterType === 'all' || filterType === 'keluar';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div 
        className="bg-white rounded-xl shadow-2xl border border-slate-300 max-w-4xl w-full max-h-[95vh] flex flex-col overflow-hidden animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Action Header */}
        <div className="no-print px-5 py-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-800">
              Pratinjau Cetak Laporan Rekapitulasi Persuratan
            </h2>
            <p className="text-[11px] text-slate-500">
              Format buku agenda dan rekapitulasi naskah dinas kedinasan
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Laporan</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Page */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-white custom-scrollbar print:p-0">
          <div className="font-serif text-slate-900 bg-white">
            
            {/* Kop Surat Laporan */}
            <div className="text-center border-b-4 border-double border-slate-900 pb-3 mb-4">
              <div className="text-xs font-bold uppercase tracking-widest text-slate-700">
                PEMERINTAH DAERAH PROVINSI
              </div>
              <div className="text-lg sm:text-xl font-black uppercase tracking-normal">
                DINAS PERSURATAN DAN KEARSIPAN DAERAH
              </div>
              <div className="text-[11px] font-sans text-slate-600 mt-0.5">
                Jalan Mayor Oking No. 100 · Telp. (021) 7890-1234 · Laman: www.persuratan.prov.go.id
              </div>
            </div>

            <div className="text-center mb-6">
              <h1 className="text-base sm:text-lg font-black uppercase tracking-wider underline">
                LAPORAN REKAPITULASI PERSURATAN & DISPOSISI
              </h1>
              <div className="text-xs font-sans text-slate-700 font-semibold mt-1">
                PERIODE: {periodeText.toUpperCase()}
              </div>
            </div>

            {/* Summary Statistics Strip */}
            <div className="grid grid-cols-4 gap-2 mb-6 font-sans text-xs">
              <div className="border border-slate-400 p-2 text-center rounded">
                <div className="text-slate-500 text-[10px] uppercase">Surat Masuk</div>
                <div className="text-base font-bold font-mono">{suratMasuk.length}</div>
              </div>
              <div className="border border-slate-400 p-2 text-center rounded">
                <div className="text-slate-500 text-[10px] uppercase">Surat Keluar</div>
                <div className="text-base font-bold font-mono">{suratKeluar.length}</div>
              </div>
              <div className="border border-slate-400 p-2 text-center rounded">
                <div className="text-slate-500 text-[10px] uppercase">Disposisi Aktif</div>
                <div className="text-base font-bold font-mono">
                  {suratMasuk.filter(s => s.statusDisposisi === 'Dalam Proses' || s.statusDisposisi === 'Didisposisikan').length}
                </div>
              </div>
              <div className="border border-slate-400 p-2 text-center rounded">
                <div className="text-slate-500 text-[10px] uppercase">Disposisi Selesai</div>
                <div className="text-base font-bold font-mono">
                  {suratMasuk.filter(s => s.statusDisposisi === 'Selesai').length}
                </div>
              </div>
            </div>

            {/* Section 1: Surat Masuk */}
            {showMasuk && (
              <div className="mb-6 font-sans">
                <div className="text-xs font-bold uppercase tracking-wider bg-slate-100 p-2 border border-slate-800 mb-1">
                  I. BUKU AGENDA SURAT MASUK ({suratMasuk.length} Berkas)
                </div>
                <table className="w-full border-collapse border border-slate-800 text-[11px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-800 font-semibold text-center">
                      <th className="border-r border-slate-800 p-1.5 w-8">No</th>
                      <th className="border-r border-slate-800 p-1.5 w-24">No. Agenda</th>
                      <th className="border-r border-slate-800 p-1.5 w-28">No. & Tgl Surat</th>
                      <th className="border-r border-slate-800 p-1.5">Pengirim</th>
                      <th className="border-r border-slate-800 p-1.5">Perihal</th>
                      <th className="border-r border-slate-800 p-1.5 w-16">Sifat</th>
                      <th className="p-1.5 w-24">Disposisi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {suratMasuk.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center p-3 text-slate-500 italic">
                          Tidak ada surat masuk pada periode ini.
                        </td>
                      </tr>
                    ) : (
                      suratMasuk.map((s, idx) => (
                        <tr key={s.id} className="border-b border-slate-300">
                          <td className="border-r border-slate-800 p-1.5 text-center font-mono">{idx + 1}</td>
                          <td className="border-r border-slate-800 p-1.5 font-mono">{s.noAgenda}</td>
                          <td className="border-r border-slate-800 p-1.5">
                            <div className="font-mono">{s.noSuratAsal}</div>
                            <div className="text-[10px] text-slate-500 font-mono">{s.tanggalSurat}</div>
                          </td>
                          <td className="border-r border-slate-800 p-1.5">{s.pengirim}</td>
                          <td className="border-r border-slate-800 p-1.5">{s.perihal}</td>
                          <td className="border-r border-slate-800 p-1.5 text-center">{s.sifat}</td>
                          <td className="p-1.5 text-center font-medium">{s.statusDisposisi}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Section 2: Surat Keluar */}
            {showKeluar && (
              <div className="mb-6 font-sans">
                <div className="text-xs font-bold uppercase tracking-wider bg-slate-100 p-2 border border-slate-800 mb-1">
                  II. BUKU AGENDA SURAT KELUAR ({suratKeluar.length} Berkas)
                </div>
                <table className="w-full border-collapse border border-slate-800 text-[11px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-800 font-semibold text-center">
                      <th className="border-r border-slate-800 p-1.5 w-8">No</th>
                      <th className="border-r border-slate-800 p-1.5 w-24">No. Agenda</th>
                      <th className="border-r border-slate-800 p-1.5 w-32">Nomor Surat Dinas</th>
                      <th className="border-r border-slate-800 p-1.5">Tujuan Penerima</th>
                      <th className="border-r border-slate-800 p-1.5">Perihal</th>
                      <th className="border-r border-slate-800 p-1.5 w-20">Konseptor</th>
                      <th className="p-1.5 w-20">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {suratKeluar.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center p-3 text-slate-500 italic">
                          Tidak ada surat keluar pada periode ini.
                        </td>
                      </tr>
                    ) : (
                      suratKeluar.map((s, idx) => (
                        <tr key={s.id} className="border-b border-slate-300">
                          <td className="border-r border-slate-800 p-1.5 text-center font-mono">{idx + 1}</td>
                          <td className="border-r border-slate-800 p-1.5 font-mono">{s.noAgendaKeluar}</td>
                          <td className="border-r border-slate-800 p-1.5 font-mono font-medium">{s.noSuratKeluar}</td>
                          <td className="border-r border-slate-800 p-1.5">{s.tujuan}</td>
                          <td className="border-r border-slate-800 p-1.5">{s.perihal}</td>
                          <td className="border-r border-slate-800 p-1.5">{s.konseptor}</td>
                          <td className="p-1.5 text-center font-medium">{s.statusParaf}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Official Signatures */}
            <div className="grid grid-cols-2 gap-8 font-sans text-xs mt-10 pt-4">
              <div className="text-center">
                <div>Mengetahui,</div>
                <div className="font-bold">KEPALA DINAS</div>
                <div className="h-16" />
                <div className="font-bold underline">Dr. H. Bambang Suryono, M.Si.</div>
                <div className="font-mono text-[10px]">NIP. 19740512 199803 1 004</div>
              </div>

              <div className="text-center">
                <div>Ditetapkan di Tempat, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                <div className="font-bold">KOORDINATOR TATA USAHA & ARSIP</div>
                <div className="h-16" />
                <div className="font-bold underline">Ratna Juwita, S.Sos., M.AP.</div>
                <div className="font-mono text-[10px]">NIP. 19820815 200604 2 007</div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer actions */}
        <div className="no-print px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Dokumen rekapitulasi resmi terverifikasi sistem elektronik.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
