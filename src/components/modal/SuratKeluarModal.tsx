import React, { useState } from 'react';
import { X, Send, AlertCircle, FileText, Upload } from 'lucide-react';
import { SuratKeluar, SifatSurat, StatusSuratKeluar, MetodePengiriman } from '../../types';
import { useApp } from '../../context/AppContext';
import { KLASIFIKASI_LIST } from '../../data/initialData';

interface SuratKeluarModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: SuratKeluar | null;
}

export const SuratKeluarModal: React.FC<SuratKeluarModalProps> = ({
  isOpen,
  onClose,
  editData
}) => {
  const { addSuratKeluar, updateSuratKeluar, suratKeluarList, users, currentUser } = useApp();

  const nextAgendaOut = () => {
    const pad = String(suratKeluarList.length + 45).padStart(4, '0');
    return `AGD-OUT/2026/03/${pad}`;
  };

  const generateNomorDinas = (klas: string) => {
    const code = klas.split(' - ')[0] || '005';
    const seq = String(suratKeluarList.length + 322).padStart(4, '0');
    return `${code}/${seq}/DISPERSIP/III/2026`;
  };

  const today = new Date().toISOString().split('T')[0];

  const [noAgendaKeluar, setNoAgendaKeluar] = useState(editData?.noAgendaKeluar || nextAgendaOut());
  const [klasifikasi, setKlasifikasi] = useState(editData?.klasifikasi || KLASIFIKASI_LIST[0]);
  const [noSuratKeluar, setNoSuratKeluar] = useState(editData?.noSuratKeluar || generateNomorDinas(KLASIFIKASI_LIST[0]));
  const [tujuan, setTujuan] = useState(editData?.tujuan || '');
  const [perihal, setPerihal] = useState(editData?.perihal || '');
  const [tanggalSurat, setTanggalSurat] = useState(editData?.tanggalSurat || today);
  const [sifat, setSifat] = useState<SifatSurat>(editData?.sifat || 'Biasa');
  const [konseptorId, setKonseptorId] = useState(editData?.konseptorId || currentUser.id);
  const [statusParaf, setStatusParaf] = useState<StatusSuratKeluar>(editData?.statusParaf || 'Draft');
  const [metodePengiriman, setMetodePengiriman] = useState<MetodePengiriman>(editData?.metodePengiriman || 'Email Kantor / E-Office');
  const [namaPenerimaEkspedisi, setNamaPenerimaEkspedisi] = useState(editData?.namaPenerimaEkspedisi || '');
  const [isiRingkas, setIsiRingkas] = useState(editData?.isiRingkas || '');
  const [lampiranNama, setLampiranNama] = useState(editData?.lampiranNama || 'Draft_Naskah_Surat_Dinas_Keluar.pdf');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleKlasifikasiChange = (newKlas: string) => {
    setKlasifikasi(newKlas);
    if (!editData) {
      setNoSuratKeluar(generateNomorDinas(newKlas));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tujuan.trim() || !perihal.trim() || !noSuratKeluar.trim()) {
      setErrorMsg('Mohon lengkapi seluruh kolom wajib (Tujuan, Perihal, dan Nomor Surat).');
      return;
    }

    const selectedKonseptor = users.find(u => u.id === konseptorId) || currentUser;

    if (editData) {
      updateSuratKeluar(editData.id, {
        noAgendaKeluar,
        noSuratKeluar: noSuratKeluar.trim(),
        tujuan: tujuan.trim(),
        perihal: perihal.trim(),
        tanggalSurat,
        sifat,
        klasifikasi,
        isiRingkas: isiRingkas.trim(),
        konseptor: selectedKonseptor.name,
        konseptorId: selectedKonseptor.id,
        statusParaf,
        metodePengiriman,
        namaPenerimaEkspedisi: namaPenerimaEkspedisi.trim(),
        lampiranNama
      });
    } else {
      addSuratKeluar({
        noAgendaKeluar,
        noSuratKeluar: noSuratKeluar.trim(),
        tujuan: tujuan.trim(),
        perihal: perihal.trim(),
        tanggalSurat,
        sifat,
        klasifikasi,
        isiRingkas: isiRingkas.trim() || 'Naskah surat dinas keluar resmi untuk didistribusikan kepada instansi tujuan.',
        konseptor: selectedKonseptor.name,
        konseptorId: selectedKonseptor.id,
        statusParaf,
        metodePengiriman,
        namaPenerimaEkspedisi: namaPenerimaEkspedisi.trim(),
        lampiranNama
      });
    }

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
            <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {editData ? 'Edit Data Surat Keluar' : 'Pembuatan Surat Keluar Baru'}
              </h2>
              <p className="text-xs text-slate-500">
                Registrasi naskah dinas keluar, kodefikasi penomoran, dan paraf persetujuan
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

          {/* Grid 1: Klasifikasi & Nomor Surat Kedinasan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                Klasifikasi Naskah Dinas <span className="text-rose-500">*</span>
              </label>
              <select
                value={klasifikasi}
                onChange={(e) => handleKlasifikasiChange(e.target.value)}
                className="w-full text-xs sm:text-sm px-3.5 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                {KLASIFIKASI_LIST.map((klas, idx) => (
                  <option key={idx} value={klas}>
                    {klas}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                Nomor Surat Resmi Keluar <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={noSuratKeluar}
                onChange={(e) => setNoSuratKeluar(e.target.value)}
                className="w-full text-xs sm:text-sm px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none font-mono-tabular"
                required
              />
            </div>
          </div>

          {/* Grid 2: Instansi Tujuan & Sifat */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                Tujuan Penerima Surat <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={tujuan}
                onChange={(e) => setTujuan(e.target.value)}
                placeholder="Contoh: Kepala Badan Kepegawaian Daerah"
                className="w-full text-xs sm:text-sm px-3.5 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
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
                className="w-full text-xs sm:text-sm px-3.5 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="Biasa">Biasa (Rutin)</option>
                <option value="Penting">Penting</option>
                <option value="Segera">Segera (Mendesak)</option>
                <option value="Rahasia">Rahasia</option>
              </select>
            </div>
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
              placeholder="Contoh: Permohonan Delegasi Peserta Bimtek Kearsipan Digital Tahun 2026"
              className="w-full text-xs sm:text-sm px-3.5 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none leading-relaxed"
              required
            />
          </div>

          {/* Grid 3: Konseptor & Tanggal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                Konseptor Pembuat <span className="text-rose-500">*</span>
              </label>
              <select
                value={konseptorId}
                onChange={(e) => setKonseptorId(e.target.value)}
                className="w-full text-xs sm:text-sm px-3.5 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.jabatan})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                Tanggal Surat Dinas <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={tanggalSurat}
                onChange={(e) => setTanggalSurat(e.target.value)}
                className="w-full text-xs sm:text-sm px-3.5 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none font-mono-tabular"
                required
              />
            </div>
          </div>

          {/* Grid 4: Status Persetujuan Paraf & Metode Ekspedisi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                Status Verifikasi / Paraf Pimpinan
              </label>
              <select
                value={statusParaf}
                onChange={(e) => setStatusParaf(e.target.value as StatusSuratKeluar)}
                className="w-full text-xs sm:text-sm px-3.5 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="Draft">Draft Konseptor</option>
                <option value="Menunggu Verifikasi">Menunggu Verifikasi & Paraf</option>
                <option value="Disetujui Pimpinan">Disetujui & Ditandatangani Pimpinan</option>
                <option value="Telah Terkirim">Telah Terkirim (Selesai Ekspedisi)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                Metode Pengiriman / Ekspedisi
              </label>
              <select
                value={metodePengiriman}
                onChange={(e) => setMetodePengiriman(e.target.value as MetodePengiriman)}
                className="w-full text-xs sm:text-sm px-3.5 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="Email Kantor / E-Office">Email Kantor / E-Office</option>
                <option value="Kurir Kedinasan">Kurir Kedinasan</option>
                <option value="Pos Kilat Resmi">Pos Kilat Resmi</option>
                <option value="Diambil Langsung">Diambil Langsung</option>
              </select>
            </div>
          </div>

          {/* Penerima Ekspedisi */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Nama Petugas / Tanda Terima Ekspedisi (Opsional)
            </label>
            <input
              type="text"
              value={namaPenerimaEkspedisi}
              onChange={(e) => setNamaPenerimaEkspedisi(e.target.value)}
              placeholder="Contoh: Diterima oleh Bpk. Hendri (Bagian Persuratan BKD)"
              className="w-full text-xs px-3.5 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* Ringkasan Isi Surat */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Ringkasan Naskah Surat Keluar
            </label>
            <textarea
              rows={2}
              value={isiRingkas}
              onChange={(e) => setIsiRingkas(e.target.value)}
              placeholder="Poin-poin kesimpulan atau muatan dalam naskah dinas..."
              className="w-full text-xs px-3.5 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none leading-relaxed"
            />
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
              className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{editData ? 'Simpan Perubahan' : 'Terbitkan Surat Keluar'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
