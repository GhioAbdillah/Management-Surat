import React from 'react';
import { 
  X, 
  Printer, 
  Send, 
  FileText, 
  Calendar, 
  Building, 
  ShieldCheck, 
  Download, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  Tag
} from 'lucide-react';
import { SuratMasuk } from '../../types';
import { useApp } from '../../context/AppContext';

interface PreviewSuratModalProps {
  surat: SuratMasuk | null;
  onClose: () => void;
  onOpenDisposisi: (surat: SuratMasuk) => void;
  onOpenPrintDisposisi: (surat: SuratMasuk) => void;
}

export const PreviewSuratModal: React.FC<PreviewSuratModalProps> = ({
  surat,
  onClose,
  onOpenDisposisi,
  onOpenPrintDisposisi
}) => {
  const { setTindakLanjutModalData } = useApp();

  if (!surat) return null;

  const getSifatBadge = (sifat: string) => {
    switch (sifat) {
      case 'Segera': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Penting': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Rahasia': return 'bg-purple-50 text-purple-700 border-purple-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-slate-900">
                  Detail Berkas Surat Masuk
                </h2>
                <span className={`text-xs px-2 py-0.5 rounded-md border font-medium ${getSifatBadge(surat.sifat)}`}>
                  {surat.sifat}
                </span>
              </div>
              <div className="text-xs text-slate-500 font-mono-tabular mt-0.5">
                No. Agenda: <span className="font-semibold text-slate-800">{surat.noAgenda}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenPrintDisposisi(surat)}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
              title="Cetak Lembar Disposisi Resmi"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cetak Lembar Disposisi</span>
            </button>
            <button
              onClick={() => onOpenDisposisi(surat)}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Beri Disposisi</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Two column split for preview & disposisi timeline */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          
          {/* Official Letter Document Mockup */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
            
            {/* Header Instansi */}
            <div className="border-b-2 border-slate-900 pb-4 mb-4 text-center">
              <div className="text-[11px] font-semibold text-slate-600 tracking-wider uppercase">
                Pemerintah Daerah Provinsi / Instansi Resmi
              </div>
              <div className="text-base sm:text-lg font-bold text-slate-900 uppercase tracking-tight">
                Dinas Kearsipan, Perpustakaan & Tata Naskah
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Alamat: Jalan Protokol Kedinasan No. 45 · Telp. (021) 7890-1234 · Laman: www.instansi.go.id
              </div>
            </div>

            {/* Letter Metadata Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mb-4 pb-4 border-b border-slate-200">
              <div className="space-y-2">
                <div className="flex">
                  <span className="w-32 text-slate-500">Nomor Asal Surat</span>
                  <span className="font-semibold text-slate-900 font-mono-tabular">{surat.noSuratAsal}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-slate-500">Pengirim / Asal</span>
                  <span className="font-semibold text-slate-900 flex items-center gap-1">
                    <Building className="w-3 h-3 text-slate-400 shrink-0" />
                    {surat.pengirim}
                  </span>
                </div>
                <div className="flex">
                  <span className="w-32 text-slate-500">Tanggal Surat</span>
                  <span className="font-mono-tabular text-slate-800 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                    {surat.tanggalSurat}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex">
                  <span className="w-32 text-slate-500">Tanggal Diterima</span>
                  <span className="font-mono-tabular text-slate-800">{surat.tanggalTerima}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-slate-500">Klasifikasi Arsip</span>
                  <span className="font-medium text-slate-800 flex items-center gap-1">
                    <Tag className="w-3 h-3 text-slate-400 shrink-0" />
                    {surat.klasifikasi}
                  </span>
                </div>
                <div className="flex">
                  <span className="w-32 text-slate-500">Status Disposisi</span>
                  <span className={`font-semibold ${
                    surat.statusDisposisi === 'Selesai' ? 'text-emerald-700' :
                    surat.statusDisposisi === 'Didisposisikan' || surat.statusDisposisi === 'Dalam Proses' ? 'text-indigo-700' : 'text-amber-700'
                  }`}>
                    {surat.statusDisposisi}
                  </span>
                </div>
              </div>
            </div>

            {/* Perihal & Ringkasan */}
            <div className="space-y-3">
              <div>
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Perihal Naskah Dinas:
                </div>
                <p className="text-sm font-semibold text-slate-900 leading-snug">
                  {surat.perihal}
                </p>
              </div>

              <div>
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Ringkasan Isi Surat:
                </div>
                <p className="text-xs text-slate-700 leading-relaxed bg-white p-3.5 rounded-lg border border-slate-200">
                  {surat.isiRingkas}
                </p>
              </div>
            </div>

            {/* Lampiran File Box & QR Verification */}
            <div className="mt-5 pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs">
                  PDF
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-800">
                    {surat.lampiranNama}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono-tabular">
                    Ukuran: {surat.lampiranUkuran} · Terotentikasi Digital
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert(`Mengunduh dokumen: ${surat.lampiranNama}`)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh Berkas</span>
                </button>
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-mono-tabular text-[11px]">QR: {surat.id.toUpperCase()}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Alur & Tracking Disposisi Terkait */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Riwayat & Status Disposisi ({surat.disposisiList.length})
                </h3>
              </div>
              <button
                onClick={() => onOpenDisposisi(surat)}
                className="text-xs font-medium text-indigo-600 hover:text-indigo-800"
              >
                + Tambah Instruksi Disposisi
              </button>
            </div>

            {surat.disposisiList.length === 0 ? (
              <div className="p-6 text-center border border-dashed border-slate-300 rounded-xl bg-slate-50/50">
                <p className="text-xs font-medium text-slate-600">
                  Belum ada disposisi pimpinan untuk surat ini.
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Pimpinan atau Sekretaris dapat mendisposisikan surat ini kepada Kepala Bidang atau Staf pelaksana.
                </p>
                <button
                  onClick={() => onOpenDisposisi(surat)}
                  className="mt-3 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors inline-flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Beri Disposisi Sekarang</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {surat.disposisiList.map((disp, idx) => (
                  <div 
                    key={disp.id} 
                    className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs relative"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <div>
                          <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                            Diteruskan Kepada: {disp.kepadaUserName}
                          </div>
                          <div className="text-[11px] text-slate-500">{disp.kepadaUserJabatan}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2.5 py-0.5 rounded-md font-medium ${
                          disp.status === 'Selesai' ? 'bg-emerald-50 text-emerald-700' :
                          disp.status === 'Dalam Proses' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          Status: {disp.status}
                        </span>
                        <button
                          onClick={() => setTindakLanjutModalData({ surat, disposisi: disp })}
                          className="px-2.5 py-1 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors"
                        >
                          Update Progres
                        </button>
                      </div>
                    </div>

                    {/* Instruksi Checkboxes */}
                    <div className="mt-3">
                      <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                        Instruksi / Arahan Pimpinan:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {disp.instruksi.map((ins, i) => (
                          <span 
                            key={i} 
                            className="text-xs font-medium px-2 py-0.5 bg-slate-100 text-slate-800 rounded border border-slate-200"
                          >
                            ✓ {ins}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Catatan Pimpinan */}
                    {disp.catatanPimpinan && (
                      <div className="mt-3 p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-700">
                        <span className="font-semibold text-slate-800">Catatan Tambahan: </span>
                        {disp.catatanPimpinan}
                      </div>
                    )}

                    {/* Tindak Lanjut Report if any */}
                    {disp.tindakLanjutCatatan && (
                      <div className="mt-3 p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-lg text-xs text-emerald-900">
                        <div className="flex items-center gap-1.5 font-semibold text-emerald-800 mb-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Laporan Tindak Lanjut Staf:</span>
                        </div>
                        <p className="leading-relaxed">{disp.tindakLanjutCatatan}</p>
                        {disp.tanggalSelesai && (
                          <div className="text-[10px] text-emerald-700 font-mono-tabular mt-1">
                            Diselesaikan pada: {new Date(disp.tanggalSelesai).toLocaleString('id-ID')}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Footer Timing */}
                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono-tabular">
                      <span>Tanggal Disposisi: {new Date(disp.tanggalDisposisi).toLocaleDateString('id-ID')}</span>
                      <span className="text-rose-600 font-medium">Batas Waktu: {disp.batasWaktu}</span>
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono-tabular">
            ID Arsip: {surat.id}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors"
          >
            Tutup Pratinjau
          </button>
        </div>
      </div>
    </div>
  );
};
