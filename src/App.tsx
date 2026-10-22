import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { SuratMasukView } from './components/SuratMasukView';
import { SuratKeluarView } from './components/SuratKeluarView';
import { DisposisiView } from './components/DisposisiView';
import { LaporanView } from './components/LaporanView';
import { PenggunaView } from './components/PenggunaView';
import { SuratMasukModal } from './components/modal/SuratMasukModal';
import { SuratKeluarModal } from './components/modal/SuratKeluarModal';
import { DisposisiModal } from './components/modal/DisposisiModal';
import { TindakLanjutModal } from './components/modal/TindakLanjutModal';
import { PreviewSuratModal } from './components/modal/PreviewSuratModal';
import { PrintLembarDisposisiModal } from './components/modal/PrintLembarDisposisiModal';
import { UserModal } from './components/modal/UserModal';
import { SuratMasuk, SuratKeluar, User } from './types';

function MainAppContent() {
  const { 
    activeNavTab, 
    previewSuratMasuk, 
    setPreviewSuratMasuk,
    disposisiModalSurat,
    setDisposisiModalSurat,
    tindakLanjutModalData,
    setTindakLanjutModalData
  } = useApp();

  // Modal open states
  const [isSuratMasukModalOpen, setIsSuratMasukModalOpen] = useState(false);
  const [editingSuratMasuk, setEditingSuratMasuk] = useState<SuratMasuk | null>(null);

  const [isSuratKeluarModalOpen, setIsSuratKeluarModalOpen] = useState(false);
  const [editingSuratKeluar, setEditingSuratKeluar] = useState<SuratKeluar | null>(null);

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [printDisposisiSurat, setPrintDisposisiSurat] = useState<SuratMasuk | null>(null);

  // Handlers
  const handleOpenNewSuratMasuk = () => {
    setEditingSuratMasuk(null);
    setIsSuratMasukModalOpen(true);
  };

  const handleEditSuratMasuk = (surat: SuratMasuk) => {
    setEditingSuratMasuk(surat);
    setIsSuratMasukModalOpen(true);
  };

  const handleOpenNewSuratKeluar = () => {
    setEditingSuratKeluar(null);
    setIsSuratKeluarModalOpen(true);
  };

  const handleEditSuratKeluar = (surat: SuratKeluar) => {
    setEditingSuratKeluar(surat);
    setIsSuratKeluarModalOpen(true);
  };

  const handleOpenNewUser = () => {
    setEditingUser(null);
    setIsUserModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsUserModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Header */}
      <Header onOpenNewSuratMasuk={handleOpenNewSuratMasuk} />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeNavTab === 'dashboard' && (
          <DashboardView 
            onOpenNewSuratMasuk={handleOpenNewSuratMasuk}
            onOpenNewSuratKeluar={handleOpenNewSuratKeluar}
          />
        )}

        {activeNavTab === 'surat-masuk' && (
          <SuratMasukView
            onOpenNew={handleOpenNewSuratMasuk}
            onEdit={handleEditSuratMasuk}
            onOpenPrintDisposisi={(s) => setPrintDisposisiSurat(s)}
          />
        )}

        {activeNavTab === 'surat-keluar' && (
          <SuratKeluarView
            onOpenNew={handleOpenNewSuratKeluar}
            onEdit={handleEditSuratKeluar}
          />
        )}

        {activeNavTab === 'disposisi' && (
          <DisposisiView
            onOpenPrintDisposisi={(s) => setPrintDisposisiSurat(s)}
          />
        )}

        {activeNavTab === 'laporan' && (
          <LaporanView />
        )}

        {activeNavTab === 'pengguna' && (
          <PenggunaView
            onOpenNewUser={handleOpenNewUser}
            onEditUser={handleEditUser}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="no-print border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            Sistem Informasi Manajemen Persuratan & Disposisi Elektronik (E-Surat)
          </div>
          <div className="font-mono-tabular text-[11px] text-slate-400">
            Standar Tata Kearsipan Kedinasan · Versi Produksi 2026
          </div>
        </div>
      </footer>

      {/* Modals */}
      <SuratMasukModal
        isOpen={isSuratMasukModalOpen}
        onClose={() => {
          setIsSuratMasukModalOpen(false);
          setEditingSuratMasuk(null);
        }}
        editData={editingSuratMasuk}
      />

      <SuratKeluarModal
        isOpen={isSuratKeluarModalOpen}
        onClose={() => {
          setIsSuratKeluarModalOpen(false);
          setEditingSuratKeluar(null);
        }}
        editData={editingSuratKeluar}
      />

      <DisposisiModal
        surat={disposisiModalSurat}
        onClose={() => setDisposisiModalSurat(null)}
      />

      <TindakLanjutModal
        data={tindakLanjutModalData}
        onClose={() => setTindakLanjutModalData(null)}
      />

      <PreviewSuratModal
        surat={previewSuratMasuk}
        onClose={() => setPreviewSuratMasuk(null)}
        onOpenDisposisi={(s) => {
          setPreviewSuratMasuk(null);
          setDisposisiModalSurat(s);
        }}
        onOpenPrintDisposisi={(s) => {
          setPreviewSuratMasuk(null);
          setPrintDisposisiSurat(s);
        }}
      />

      <PrintLembarDisposisiModal
        surat={printDisposisiSurat}
        onClose={() => setPrintDisposisiSurat(null)}
      />

      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => {
          setIsUserModalOpen(false);
          setEditingUser(null);
        }}
        editUser={editingUser}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
