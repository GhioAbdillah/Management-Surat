import React, { useState } from 'react';
import { X, Send, Calendar, UserCheck, AlertCircle } from 'lucide-react';
import { SuratMasuk } from '../../types';
import { useApp } from '../../context/AppContext';
import { INSTRUKSI_PRESETS } from '../../data/initialData';

interface DisposisiModalProps {
  surat: SuratMasuk | null;
  onClose: () => void;
}

export const DisposisiModal: React.FC<DisposisiModalProps> = ({ surat, onClose }) => {
  const { users, currentUser, addDisposisi } = useApp();

  const [kepadaUserId, setKepadaUserId] = useState<string>('');
  const [selectedInstruksi, setSelectedInstruksi] = useState<string[]>([
    'Tindak lanjuti segera sesuai SOP'
  ]);
  const [customInstruksi, setCustomInstruksi] = useState<string>('');
  const [catatanPimpinan, setCatatanPimpinan] = useState<string>('');
  
  // Default deadline 3 days from now
  const defaultDeadline = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];
  const [batasWaktu, setBatasWaktu] = useState<string>(defaultDeadline);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Eligible recipients: Kabid, Sekretaris, Staf
  const eligibleRecipients = users.filter(u => u.status === 'aktif' && u.id !== currentUser.id);

  if (!surat) return null;

  const toggleInstruksi = (item: string) => {
    setSelectedInstruksi(prev => 
      prev.includes(item) 
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kepadaUserId) {
      setErrorMsg('Pilih pejabat / staf penerima disposisi terlebih dahulu.');
      return;
    }

    const allInstruksi = [...selectedInstruksi];
    if (customInstruksi.trim()) {
      allInstruksi.push(customInstruksi.trim());
    }

    if (allInstruksi.length === 0) {
      setErrorMsg('Pilih minimal satu instruksi atau isi instruksi khusus.');
      return;
    }

    const recipient = users.find(u => u.id === kepadaUserId);
    if (!recipient) return;

    addDisposisi(surat.id, {
      dariUserId: currentUser.id,
      dariUserName: currentUser.name,
      dariUserJabatan: currentUser.jabatan,
      kepadaUserId: recipient.id,
      kepadaUserName: recipient.name,
      kepadaUserJabatan: recipient.jabatan,
      instruksi: allInstruksi,
      catatanPimpinan: catatanPimpinan.trim(),
      batasWaktu: batasWaktu
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Penerbitan Disposisi Pimpinan
              </h2>
              <p className="text-xs text-slate-500 font-mono-tabular">
                Agenda: {surat.noAgenda} · {surat.pengirim}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
          
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Letter Summary Card */}
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
            <div className="font-semibold text-slate-800 line-clamp-1 mb-1">
              Perihal: {surat.perihal}
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <span>Sifat: <strong className="text-slate-700">{surat.sifat}</strong></span>
              <span aria-hidden="true">·</span>
              <span>No. Asal: <span className="font-mono">{surat.noSuratAsal}</span></span>
            </div>
          </div>

          {/* Penerima Disposisi */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Diteruskan Kepada (Pejabat / Unit Pelaksana) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                value={kepadaUserId}
                onChange={(e) => {
                  setKepadaUserId(e.target.value);
                  setErrorMsg('');
                }}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                required
              >
                <option value="">-- Pilih Pejabat / Staf Penerima Disposisi --</option>
                {eligibleRecipients.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.jabatan} - {user.bidang})
                  </option>
                ))}
              </select>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Pejabat yang dipilih akan menerima notifikasi real-time seketika pada dasbor mereka.
            </p>
          </div>

          {/* Batas Waktu / Tenggat */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-600" />
              <span>Batas Waktu Penyelesaian (Deadline) <span className="text-rose-500">*</span></span>
            </label>
            <input
              type="date"
              value={batasWaktu}
              onChange={(e) => setBatasWaktu(e.target.value)}
              className="w-full text-xs sm:text-sm px-3.5 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none font-mono-tabular"
              required
            />
          </div>

          {/* Checklist Instruksi Disposisi */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Instruksi / Arahan Disposisi <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1 custom-scrollbar">
              {INSTRUKSI_PRESETS.map((item, idx) => {
                const checked = selectedInstruksi.includes(item);
                return (
                  <label 
                    key={idx}
                    className={`flex items-start gap-2.5 p-2 rounded-lg border text-xs cursor-pointer transition-all ${
                      checked 
                        ? 'border-indigo-500 bg-indigo-50/70 text-indigo-900 font-medium' 
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleInstruksi(item)}
                      className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="leading-tight">{item}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Instruksi Khusus Tambahan */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Instruksi Tambahan (Opsional)
            </label>
            <input
              type="text"
              value={customInstruksi}
              onChange={(e) => setCustomInstruksi(e.target.value)}
              placeholder="Contoh: Sinkronisasikan dengan agenda rapat minggu depan"
              className="w-full text-xs px-3.5 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Catatan / Pesan Pimpinan */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Catatan / Petunjuk Khusus Pimpinan
            </label>
            <textarea
              rows={3}
              value={catatanPimpinan}
              onChange={(e) => setCatatanPimpinan(e.target.value)}
              placeholder="Tuliskan arahan spesifik, penekanan aspek hukum/teknis, atau catatan penting lainnya..."
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none leading-relaxed"
            />
          </div>

          {/* Pemberi Disposisi Indicator */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <span className="flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-slate-500" />
              <span>Diterbitkan Oleh: <strong className="text-slate-900">{currentUser.name}</strong></span>
            </span>
            <span className="text-[11px] text-slate-500">Jabatan: {currentUser.jabatan}</span>
          </div>

          {/* Submit Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Kirimkan Disposisi</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
