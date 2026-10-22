import React, { useState } from 'react';
import { X, Inbox, Upload, AlertCircle, FileText } from 'lucide-react';
import { SuratMasuk, SifatSurat } from '../../types';
import { useApp } from '../../context/AppContext';
import { KLASIFIKASI_LIST } from '../../data/initialData';

interface SuratMasukModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: SuratMasuk | null;
}

export const SuratMasukModal: React.FC<SuratMasukModalProps> = ({
  isOpen,
  onClose,
  editData
}) => {
  const { addSuratMasuk, updateSuratMasuk, suratMasukList } = useApp();

  const nextAgendaNumber = () => {
    const pad = String(suratMasukList.length + 86).padStart(4, '0');
    return `AGD/2026/03/${pad}`;
  };

  const today = new Date().toISOString().split('T')[0];

  const [noAgenda, setNoAgenda] = useState(editData?.noAgenda || nextAgendaNumber());
  const [noSuratAsal, setNoSuratAsal] = useState(editData?.noSuratAsal || '');
  const [pengirim, setPengirim] = useState(editData?.pengirim || '');
  const [perihal, setPerihal] = useState(editData?.perihal || '');
  const [tanggalSurat, setTanggalSurat] = useState(editData?.tanggalSurat || today);
  const [tanggalTerima, setTanggalTerima] = useState(editData?.tanggalTerima || today);
  const [sifat, setSifat] = useState<SifatSurat>(editData?.sifat || 'Biasa');
  const [klasifikasi, setKlasifikasi] = useState(editData?.klasifikasi || KLASIFIKASI_LIST[0]);
  const [isiRingkas, setIsiRingkas] = useState(editData?.isiRingkas || '');
  const [lampiranNama, setLampiranNama] = useState(editData?.lampiranNama || 'Dokumen_Naskah_Dinas_Masuk.pdf');
  const [lampiranUkuran, setLampiranUkuran] = useState(editData?.lampiranUkuran || '1.8 MB');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noSuratAsal.trim() || !pengirim.trim() || !perihal.trim()) {
      setErrorMsg('Mohon lengkapi seluruh kolom wajib (No Surat Asal, Pengirim, dan Perihal).');
      return;
    }

    if (editData) {
      updateSuratMasuk(editData.id, {
        noAgenda,
        noSuratAsal: noSuratAsal.trim(),
        pengirim: pengirim.trim(),
        perihal: perihal.trim(),
        tanggalSurat,
        tanggalTerima,
        sifat,
        klasifikasi,
        isiRingkas: isiRingkas.trim(),
        lampiranNama,
        lampiranUkuran
      });
    } else {
      addSuratMasuk({
        noAgenda,
        noSuratAsal: noSuratAsal.trim(),
        pengirim: pengirim.trim(),
        perihal: perihal.trim(),
        tanggalSurat,
        tanggalTerima,
        sifat,
        klasifikasi,
        isiRingkas: isiRingkas.trim() || 'Naskah dinas resmi masuk dan telah terdaftar dalam buku agenda tata usaha.',
        lampiranNama,
        lampiranUkuran
      });
    }

    onClose();
  };

  const handleSimulatedFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLampiranNama(file.name);
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setLampiranUkuran(`${sizeMB} MB`);
    }
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
              <Inbox className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {editData ? 'Edit Data Surat Masuk' : 'Pencatatan Surat Masuk Baru'}
              </h2>
              <p className="text-xs text-slate-500">
                Registrasi naskah dinas ke dalam buku agenda elektronik
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
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Grid 1: No Agenda & Sifat Surat */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                Nomor Agenda Masuk <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={noAgenda}
                onChange={(e) => setNoAgenda(e.target.value)}
                className="w-full text-xs sm:text-sm px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-mono-tabular"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                Sifat Surat <span className="text-rose-500">*</span>
              </label>
              <select
                value={sifat}
                onChange={(e) => setSifat(e.target.value as SifatSurat)}
                className="w-full text-xs sm:text-sm px-3.5 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="Biasa">Biasa (Rutin)</option>
                <option value="Penting">Penting</option>
                <option value="Segera">Segera (Mendesak / Cepat)</option>
                <option value="Rahasia">Rahasia (Terbatas)</option>
              </select>
            </div>
          </div>

          {/* Grid 2: No Surat Asal & Pengirim */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                Nomor Surat Asal <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={noSuratAsal}
                onChange={(e) => setNoSuratAsal(e.target.value)}
                placeholder="Contoh: 005/145/KEMENDIKBUD/2026"
                className="w-full text-xs sm:text-sm px-3.5 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-mono-tabular"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                Instansi / Nama Pengirim <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={pengirim}
                onChange={(e) => setPengirim(e.target.value)}
                placeholder="Contoh: Badan Pengawasan Keuangan dan Pembangunan"
                className="w-full text-xs sm:text-sm px-3.5 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>
          </div>

          {/* Grid 3: Tanggal Surat & Tanggal Diterima */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                Tanggal Tertera Pada Surat <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={tanggalSurat}
                onChange={(e) => setTanggalSurat(e.target.value)}
                className="w-full text-xs sm:text-sm px-3.5 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-mono-tabular"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                Tanggal Diterima TU <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={tanggalTerima}
                onChange={(e) => setTanggalTerima(e.target.value)}
                className="w-full text-xs sm:text-sm px-3.5 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-mono-tabular"
                required
              />
            </div>
          </div>

          {/* Klasifikasi Arsip */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
              Kode Klasifikasi Arsip Surat Dinas <span className="text-rose-500">*</span>
            </label>
            <select
              value={klasifikasi}
              onChange={(e) => setKlasifikasi(e.target.value)}
              className="w-full text-xs sm:text-sm px-3.5 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              {KLASIFIKASI_LIST.map((klas, idx) => (
                <option key={idx} value={klas}>
                  {klas}
                </option>
              ))}
            </select>
          </div>

          {/* Perihal */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
              Perihal / Hal Surat <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              value={perihal}
              onChange={(e) => setPerihal(e.target.value)}
              placeholder="Contoh: Undangan Sosialisasi Kebijakan Kearsipan dan Reformasi Birokrasi Tahun 2026"
              className="w-full text-xs sm:text-sm px-3.5 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none leading-relaxed"
              required
            />
          </div>

          {/* Ringkasan Isi Surat */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Ringkasan Isi / Ekstrak Surat
            </label>
            <textarea
              rows={3}
              value={isiRingkas}
              onChange={(e) => setIsiRingkas(e.target.value)}
              placeholder="Tuliskan pokok bahasan, tanggal kegiatan yang tercantum, atau poin utama naskah..."
              className="w-full text-xs sm:text-sm px-3.5 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none leading-relaxed"
            />
          </div>

          {/* Lampiran Berkas Upload Simulation */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Lampiran Berkas Digital (Scan PDF / Arsip Elektronik)
            </label>
            <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-slate-800 truncate">
                  {lampiranNama}
                </div>
                <div className="text-[11px] text-slate-500 font-mono-tabular">
                  Ukuran: {lampiranUkuran} · Ekstensi Terverifikasi PDF/Docx
                </div>
              </div>
              <label className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg cursor-pointer flex items-center gap-1.5 shrink-0 transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>Pilih Berkas</span>
                <input
                  type="file"
                  onChange={handleSimulatedFileUpload}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                />
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
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
              <Inbox className="w-3.5 h-3.5" />
              <span>{editData ? 'Simpan Perubahan' : 'Catat Surat Masuk'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
