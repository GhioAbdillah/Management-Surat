import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  ShieldCheck, 
  Edit, 
  Trash2, 
  CheckCircle, 
  UserCheck, 
  Mail, 
  Phone,
  Building
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { User, UserRole } from '../types';

interface PenggunaViewProps {
  onOpenNewUser: () => void;
  onEditUser: (user: User) => void;
}

export const PenggunaView: React.FC<PenggunaViewProps> = ({
  onOpenNewUser,
  onEditUser
}) => {
  const { users, currentUser, setCurrentUser, deleteUser } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const filteredUsers = users.filter(user => {
    const q = searchQuery.toLowerCase();
    const matchQ = 
      user.name.toLowerCase().includes(q) ||
      user.nip.toLowerCase().includes(q) ||
      user.jabatan.toLowerCase().includes(q) ||
      user.bidang.toLowerCase().includes(q) ||
      user.email.toLowerCase().includes(q);

    const matchRole = roleFilter === 'all' || user.role === roleFilter;
    return matchQ && matchRole;
  });

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'pimpinan': return 'Pimpinan (Kepala Dinas)';
      case 'sekretaris': return 'Sekretaris / TU';
      case 'kabid': return 'Kepala Bidang';
      case 'staf': return 'Staf Pelaksana';
      case 'admin': return 'Administrator';
    }
  };

  const getRoleBadgeStyle = (role: UserRole) => {
    switch (role) {
      case 'pimpinan': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'sekretaris': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'kabid': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'staf': return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'admin': return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  const handleDelete = (user: User) => {
    if (user.id === currentUser.id) {
      alert('Tidak dapat menghapus akun yang sedang aktif digunakan saat ini.');
      return;
    }
    if (confirm(`Apakah Anda yakin ingin menghapus data pengguna: ${user.name}?`)) {
      deleteUser(user.id);
    }
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Manajemen Pengguna & Hak Akses
            </h1>
            <span className="text-xs px-2.5 py-0.5 bg-slate-100 text-slate-700 font-semibold rounded-md font-mono-tabular">
              {users.length} Akun
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Pengelolaan pegawai, pejabat struktural, fungsional, dan matriks peran pada sistem e-surat
          </p>
        </div>

        <button
          onClick={onOpenNewUser}
          className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Tambah Pengguna Baru</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari berdasarkan nama, NIP, jabatan, bidang, atau email..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Filter Peran:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="text-xs px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none font-medium text-slate-700 focus:bg-white focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">Semua Peran</option>
              <option value="pimpinan">Pimpinan</option>
              <option value="sekretaris">Sekretaris / TU</option>
              <option value="kabid">Kepala Bidang</option>
              <option value="staf">Staf Pelaksana</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((user) => {
          const isCurrentActive = user.id === currentUser.id;

          return (
            <div 
              key={user.id}
              className={`bg-white border rounded-xl p-5 shadow-xs flex flex-col justify-between transition-all ${
                isCurrentActive ? 'border-indigo-400 ring-2 ring-indigo-100' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                {/* Header user card */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-800 text-white font-bold text-sm flex items-center justify-center shrink-0">
                      {user.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-slate-900 truncate flex items-center gap-1.5">
                        <span className="truncate">{user.name}</span>
                        {isCurrentActive && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 font-bold shrink-0">
                            Aktif
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 font-mono-tabular">
                        NIP. {user.nip}
                      </div>
                    </div>
                  </div>

                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border shrink-0 ${getRoleBadgeStyle(user.role)}`}>
                    {user.role.toUpperCase()}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-1.5 text-xs text-slate-600 mb-4 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-semibold text-slate-800 truncate">{user.jabatan}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{user.bidang}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate text-slate-500">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-mono-tabular text-slate-500">{user.telepon}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Card Controls */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setCurrentUser(user)}
                  disabled={isCurrentActive}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 ${
                    isCurrentActive 
                      ? 'bg-slate-100 text-slate-400 cursor-default'
                      : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>{isCurrentActive ? 'Akun Ini Sedang Dipakai' : 'Masuk Sebagai User Ini'}</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEditUser(user)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                    title="Edit Data Pengguna"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(user)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                    title="Hapus Pengguna"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
