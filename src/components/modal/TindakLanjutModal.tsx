import React, { useState } from 'react';
import { X, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { SuratMasuk, DisposisiItem } from '../../types';
import { useApp } from '../../context/AppContext';

interface TindakLanjutModalProps {
  data: { surat: SuratMasuk; disposisi: DisposisiItem } | null;
  onClose: () => void;
}

export const TindakLanjutModal: React.FC<TindakLanjutModalProps> = ({ data, onClose }) => {
  const { updateDisposisiStatus } = useApp();

  const [tindakLanjutText, setTindakLanjutText] = useState(data?.disposisi.tindakLanjutCatatan || '');
  const [status, setStatus] = useState<DisposisiItem['status']>(data?.disposisi.status || 'Dalam Proses');
  const [errorMsg, setErrorMsg] = useState('');

  if (!data) return null;
  const { surat, disposisi } = data;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tindakLanjutText.trim()) {
      setErrorMsg('Mohon isi uraian tindak lanjut atau keterangan progres pelaksanaan tugas.');
      return;
    }

    updateDisposisiStatus(surat.id, disposisi.id, status, tindakLanjutText.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Pembaruan Tindak Lanjut Disposisi
              </h2>
              <p className="text-xs text-slate-500 font-mono-tabular">
                Surat: {surat.noAgenda} · Kepada: {disposisi.kepadaUserName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Instruksi Pimpinan Summary */}
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-2">
            <div>
              <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
                Instruksi dari Pimpinan:
              </span>
              <div className="flex flex-wrap gap-1 mt-1">
                {disposisi.instruksi.map((ins, i) => (
                  <span key={i} className="px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-800 font-medium text-[11px]">
                    ✓ {ins}
                  </span>
                ))}
              </div>
            </div>

            {disposisi.catatanPimpinan && (
              <div className="pt-2 border-t border-slate-200/60">
                <span className="font-semibold text-slate-700">Catatan Pimpinan: </span>
                <span className="text-slate-600">{disposisi.catatanPimpinan}</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400 font-mono-tabular">
              <span>Batas Waktu: {disposisi.batasWaktu}</span>
              <span>Diterbitkan: {new Date(disposisi.tanggalDisposisi).toLocaleDateString('id-ID')}</span>
            </div>
          </div>

          {/* Status Disposisi Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Pilih Status Pelaksanaan <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label 
                className={`p-3 rounded-lg border text-xs cursor-pointer flex items-center gap-2.5 transition-all ${
                  status === 'Dalam Proses'
                    ? 'border-amber-500 bg-amber-50 text-amber-900 font-semibold'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value="Dalam Proses"
                  checked={status === 'Dalam Proses'}
                  onChange={() => setStatus('Dalam Proses')}
                  className="text-amber-600 focus:ring-amber-500"
                />
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>Sedang Diproses</span>
                </div>
              </label>

              <label 
                className={`p-3 rounded-lg border text-xs cursor-pointer flex items-center gap-2.5 transition-all ${
                  status === 'Selesai'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value="Selesai"
                  checked={status === 'Selesai'}
                  onChange={() => setStatus('Selesai')}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Tuntas / Selesai</span>
                </div>
              </label>
            </div>
          </div>

          {/* Uraian Tindak Lanjut Textarea */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Laporan / Uraian Tindak Lanjut <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              value={tindakLanjutText}
              onChange={(e) => {
                setTindakLanjutText(e.target.value);
                setErrorMsg('');
              }}
              placeholder="Jelaskan tindakan yang telah dilaksanakan, dokumen telaahan yang disusun, nomor surat balasan, atau bukti koordinasi..."
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none leading-relaxed"
              required
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Pembaruan ini akan dicatat dalam riwayat audit trail dan dikirimkan sebagai notifikasi kepada Pimpinan.
            </p>
          </div>

          {/* Submit Actions */}
          <div className="pt-3 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Simpan Pembaruan</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
