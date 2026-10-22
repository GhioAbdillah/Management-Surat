import React, { useState } from 'react';
import { X, UserPlus, AlertCircle } from 'lucide-react';
import { User, UserRole } from '../../types';
import { useApp } from '../../context/AppContext';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  editUser?: User | null;
}

export const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, editUser }) => {
  const { addUser, updateUser } = useApp();

  const [name, setName] = useState(editUser?.name || '');
  const [nip, setNip] = useState(editUser?.nip || '');
  const [role, setRole] = useState<UserRole>(editUser?.role || 'staf');
  const [jabatan, setJabatan] = useState(editUser?.jabatan || '');
  const [bidang, setBidang] = useState(editUser?.bidang || 'Sekretariat');
  const [email, setEmail] = useState(editUser?.email || '');
  const [telepon, setTelepon] = useState(editUser?.telepon || '0812-0000-0000');
  const [status, setStatus] = useState<'aktif' | 'nonaktif'>(editUser?.status || 'aktif');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !jabatan.trim()) {
      setErrorMsg('Nama lengkap dan jabatan wajib diisi.');
      return;
    }

    if (editUser) {
      updateUser(editUser.id, {
        name: name.trim(),
        nip: nip.trim() || '19900101 201501 1 001',
        role,
        jabatan: jabatan.trim(),
        bidang: bidang.trim(),
        email: email.trim() || `${name.toLowerCase().replace(/[^a-z]/g, '')}@instansi.go.id`,
        telepon: telepon.trim(),
        status
      });
    } else {
      addUser({
        name: name.trim(),
        nip: nip.trim() || '19900101 201501 1 001',
        role,
        jabatan: jabatan.trim(),
        bidang: bidang.trim(),
        email: email.trim() || `${name.toLowerCase().replace(/[^a-z]/g, '')}@instansi.go.id`,
        telepon: telepon.trim(),
        status
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {editUser ? 'Edit Data Pengguna' : 'Tambah Pengguna Baru'}
              </h2>
              <p className="text-xs text-slate-500">
                Konfigurasi akun ASN, jabatan kedinasan, dan hak akses sistem
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

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
              Nama Lengkap Beserta Gelar <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Muhammad Ridwan, S.STP., M.AP."
              className="w-full text-xs sm:text-sm px-3.5 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                NIP (Nomor Induk Pegawai)
              </label>
              <input
                type="text"
                value={nip}
                onChange={(e) => setNip(e.target.value)}
                placeholder="19870512 201001 1 005"
                className="w-full text-xs sm:text-sm px-3.5 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-mono-tabular"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                Peran / Role Akses <span className="text-rose-500">*</span>
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full text-xs sm:text-sm px-3.5 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="pimpinan">Pimpinan (Kepala Dinas / Badan)</option>
                <option value="sekretaris">Sekretaris / Koordinator TU</option>
                <option value="kabid">Kepala Bidang / Subbag</option>
                <option value="staf">Staf Pelaksana Teknis</option>
                <option value="admin">Administrator Sistem</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
              Jabatan Kedinasan <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={jabatan}
              onChange={(e) => setJabatan(e.target.value)}
              placeholder="Contoh: Analis Kebijakan Ahli Muda"
              className="w-full text-xs sm:text-sm px-3.5 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                Bidang / Unit Kerja
              </label>
              <input
                type="text"
                value={bidang}
                onChange={(e) => setBidang(e.target.value)}
                placeholder="Contoh: Bidang Pembinaan & Mutasi"
                className="w-full text-xs sm:text-sm px-3.5 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                Status Akun
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'aktif' | 'nonaktif')}
                className="w-full text-xs sm:text-sm px-3.5 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="aktif">Aktif</option>
                <option value="nonaktif">Non-aktif / Cuti</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                Email Kedinasan
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ridwan@instansi.go.id"
                className="w-full text-xs sm:text-sm px-3.5 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                No. Telepon / WhatsApp
              </label>
              <input
                type="text"
                value={telepon}
                onChange={(e) => setTelepon(e.target.value)}
                placeholder="0812-3456-7890"
                className="w-full text-xs sm:text-sm px-3.5 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-mono-tabular"
              />
            </div>
          </div>

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
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs"
            >
              {editUser ? 'Simpan Perubahan' : 'Tambah Pengguna'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
