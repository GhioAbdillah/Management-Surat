import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { 
  User, 
  SuratMasuk, 
  SuratKeluar, 
  AppNotification, 
  AuditLog, 
  DisposisiItem, 
  SystemStats 
} from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_SURAT_MASUK, 
  INITIAL_SURAT_KELUAR, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_AUDIT_LOGS 
} from '../data/initialData';

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  users: User[];
  addUser: (userData: Omit<User, 'id'>) => void;
  updateUser: (id: string, userData: Partial<User>) => void;
  deleteUser: (id: string) => void;

  suratMasukList: SuratMasuk[];
  addSuratMasuk: (data: Omit<SuratMasuk, 'id' | 'createdAt' | 'disposisiList' | 'statusDisposisi'>) => SuratMasuk;
  updateSuratMasuk: (id: string, data: Partial<SuratMasuk>) => void;
  deleteSuratMasuk: (id: string) => void;

  suratKeluarList: SuratKeluar[];
  addSuratKeluar: (data: Omit<SuratKeluar, 'id' | 'createdAt'>) => SuratKeluar;
  updateSuratKeluar: (id: string, data: Partial<SuratKeluar>) => void;
  deleteSuratKeluar: (id: string) => void;

  addDisposisi: (suratId: string, disposisiData: Omit<DisposisiItem, 'id' | 'suratId' | 'tanggalDisposisi' | 'status'>) => void;
  updateDisposisiStatus: (suratId: string, disposisiId: string, status: DisposisiItem['status'], tindakLanjut?: string) => void;

  notifications: AppNotification[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotification: (id: string) => void;
  sendNotification: (notif: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>) => void;
  simulateRealTimeIncoming: () => void;

  auditLogs: AuditLog[];
  stats: SystemStats;
  resetToSampleData: () => void;

  // Selected item modal / quick action state
  previewSuratMasuk: SuratMasuk | null;
  setPreviewSuratMasuk: (surat: SuratMasuk | null) => void;
  disposisiModalSurat: SuratMasuk | null;
  setDisposisiModalSurat: (surat: SuratMasuk | null) => void;
  tindakLanjutModalData: { surat: SuratMasuk; disposisi: DisposisiItem } | null;
  setTindakLanjutModalData: (data: { surat: SuratMasuk; disposisi: DisposisiItem } | null) => void;
  activeNavTab: string;
  setActiveNavTab: (tab: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Web Audio API notification chime generator (subtle and pleasant)
const playChime = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    
    // Smooth chime two-tone
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.setValueAtTime(880, now + 0.12); // A5
    
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.45);
  } catch {
    // Audio might be blocked by browser policy until gesture
  }
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('esurat_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    return users.find(u => u.role === 'sekretaris') || users[0];
  });

  const [suratMasukList, setSuratMasukList] = useState<SuratMasuk[]>(() => {
    const saved = localStorage.getItem('esurat_surat_masuk');
    return saved ? JSON.parse(saved) : INITIAL_SURAT_MASUK;
  });

  const [suratKeluarList, setSuratKeluarList] = useState<SuratKeluar[]>(() => {
    const saved = localStorage.getItem('esurat_surat_keluar');
    return saved ? JSON.parse(saved) : INITIAL_SURAT_KELUAR;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('esurat_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('esurat_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [activeNavTab, setActiveNavTab] = useState<string>('dashboard');
  const [previewSuratMasuk, setPreviewSuratMasuk] = useState<SuratMasuk | null>(null);
  const [disposisiModalSurat, setDisposisiModalSurat] = useState<SuratMasuk | null>(null);
  const [tindakLanjutModalData, setTindakLanjutModalData] = useState<{ surat: SuratMasuk; disposisi: DisposisiItem } | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('esurat_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('esurat_surat_masuk', JSON.stringify(suratMasukList));
  }, [suratMasukList]);

  useEffect(() => {
    localStorage.setItem('esurat_surat_keluar', JSON.stringify(suratKeluarList));
  }, [suratKeluarList]);

  useEffect(() => {
    localStorage.setItem('esurat_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('esurat_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  const addLog = useCallback((action: string, detail: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.jabatan,
      action,
      detail,
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [newLog, ...prev.slice(0, 99)]);
  }, [currentUser]);

  const sendNotification = useCallback((notif: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      isRead: false
    };
    setNotifications(prev => [newNotif, ...prev]);
    playChime();
  }, []);

  // Surat Masuk CRUD
  const addSuratMasuk = (data: Omit<SuratMasuk, 'id' | 'createdAt' | 'disposisiList' | 'statusDisposisi'>) => {
    const newSurat: SuratMasuk = {
      ...data,
      id: `sm-${Date.now()}`,
      createdAt: new Date().toISOString(),
      statusDisposisi: 'Belum Didisposisikan',
      disposisiList: []
    };
    setSuratMasukList(prev => [newSurat, ...prev]);
    addLog('Registrasi Surat Masuk', `Menambahkan surat masuk No: ${newSurat.noSuratAsal} dari ${newSurat.pengirim} (${newSurat.noAgenda})`);

    // Emit notification if urgent
    if (newSurat.sifat === 'Segera' || newSurat.sifat === 'Penting') {
      sendNotification({
        suratId: newSurat.id,
        suratType: 'masuk',
        tipe: 'surat_masuk_urgent',
        judul: `Surat Masuk Sifat ${newSurat.sifat}`,
        pesan: `Surat masuk baru dari ${newSurat.pengirim} perihal "${newSurat.perihal}" memerlukan penanganan segera.`,
        targetUserId: 'all',
        prioritas: newSurat.sifat === 'Segera' ? 'kritis' : 'tinggi'
      });
    }

    return newSurat;
  };

  const updateSuratMasuk = (id: string, data: Partial<SuratMasuk>) => {
    setSuratMasukList(prev => prev.map(item => item.id === id ? { ...item, ...data } : item));
    addLog('Ubah Data Surat Masuk', `Memperbarui data surat masuk ID ${id}`);
  };

  const deleteSuratMasuk = (id: string) => {
    const target = suratMasukList.find(s => s.id === id);
    setSuratMasukList(prev => prev.filter(item => item.id !== id));
    addLog('Hapus Surat Masuk', `Menghapus surat masuk ${target?.noAgenda || id}`);
  };

  // Surat Keluar CRUD
  const addSuratKeluar = (data: Omit<SuratKeluar, 'id' | 'createdAt'>) => {
    const newSurat: SuratKeluar = {
      ...data,
      id: `sk-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setSuratKeluarList(prev => [newSurat, ...prev]);
    addLog('Registrasi Surat Keluar', `Menambahkan draft surat keluar No: ${newSurat.noSuratKeluar} ke ${newSurat.tujuan}`);

    sendNotification({
      suratId: newSurat.id,
      suratType: 'keluar',
      tipe: 'info',
      judul: 'Surat Keluar Baru Dibuat',
      pesan: `Draft surat keluar untuk "${newSurat.tujuan}" perihal "${newSurat.perihal}" siap ditinjau.`,
      targetUserId: 'user-pimpinan',
      prioritas: 'biasa'
    });

    return newSurat;
  };

  const updateSuratKeluar = (id: string, data: Partial<SuratKeluar>) => {
    setSuratKeluarList(prev => prev.map(item => item.id === id ? { ...item, ...data } : item));
    addLog('Ubah Surat Keluar', `Memperbarui surat keluar ID ${id} (Status: ${data.statusParaf || 'Diperbarui'})`);
    
    if (data.statusParaf === 'Disetujui Pimpinan') {
      sendNotification({
        suratId: id,
        suratType: 'keluar',
        tipe: 'info',
        judul: 'Surat Keluar Disetujui Pimpinan',
        pesan: `Pimpinan telah menyetujui dan menandatangani surat dinas ID ${id}. Siap untuk ekspedisi.`,
        targetUserId: 'all',
        prioritas: 'tinggi'
      });
    }
  };

  const deleteSuratKeluar = (id: string) => {
    const target = suratKeluarList.find(s => s.id === id);
    setSuratKeluarList(prev => prev.filter(item => item.id !== id));
    addLog('Hapus Surat Keluar', `Menghapus surat keluar ${target?.noSuratKeluar || id}`);
  };

  // Disposisi Workflow
  const addDisposisi = (suratId: string, disposisiData: Omit<DisposisiItem, 'id' | 'suratId' | 'tanggalDisposisi' | 'status'>) => {
    const targetSurat = suratMasukList.find(s => s.id === suratId);
    if (!targetSurat) return;

    const newDisposisi: DisposisiItem = {
      ...disposisiData,
      id: `disp-${Date.now()}`,
      suratId,
      tanggalDisposisi: new Date().toISOString(),
      status: 'Dalam Proses'
    };

    const updatedList = [newDisposisi, ...targetSurat.disposisiList];
    const newStatus: SuratMasuk['statusDisposisi'] = 'Didisposisikan';

    setSuratMasukList(prev => prev.map(s => s.id === suratId ? {
      ...s,
      statusDisposisi: newStatus,
      disposisiList: updatedList
    } : s));

    addLog(
      'Pemberian Disposisi Pimpinan',
      `Mendisposisikan surat ${targetSurat.noAgenda} kepada ${newDisposisi.kepadaUserName} (${newDisposisi.kepadaUserJabatan})`
    );

    // Notify recipient user
    sendNotification({
      suratId,
      suratType: 'masuk',
      tipe: 'disposisi_baru',
      judul: 'Disposisi Surat Masuk Baru',
      pesan: `Pimpinan telah mendisposisikan surat dari ${targetSurat.pengirim} kepada Anda. Batas waktu: ${newDisposisi.batasWaktu}.`,
      targetUserId: newDisposisi.kepadaUserId,
      prioritas: 'kritis'
    });
  };

  const updateDisposisiStatus = (suratId: string, disposisiId: string, status: DisposisiItem['status'], tindakLanjut?: string) => {
    const targetSurat = suratMasukList.find(s => s.id === suratId);
    if (!targetSurat) return;

    const updatedDisposisiList = targetSurat.disposisiList.map(disp => {
      if (disp.id === disposisiId) {
        return {
          ...disp,
          status,
          tindakLanjutCatatan: tindakLanjut || disp.tindakLanjutCatatan,
          tanggalSelesai: status === 'Selesai' ? new Date().toISOString() : disp.tanggalSelesai
        };
      }
      return disp;
    });

    // Check if all are finished
    const allDone = updatedDisposisiList.length > 0 && updatedDisposisiList.every(d => d.status === 'Selesai');
    const updatedStatus: SuratMasuk['statusDisposisi'] = allDone ? 'Selesai' : 'Dalam Proses';

    setSuratMasukList(prev => prev.map(s => s.id === suratId ? {
      ...s,
      statusDisposisi: updatedStatus,
      disposisiList: updatedDisposisiList
    } : s));

    addLog('Update Status Disposisi', `Mengubah status disposisi surat ${targetSurat.noAgenda} menjadi ${status}`);

    if (status === 'Selesai') {
      sendNotification({
        suratId,
        suratType: 'masuk',
        tipe: 'disposisi_selesai',
        judul: 'Disposisi Telah Diselesaikan',
        pesan: `Tindak lanjut disposisi surat dari ${targetSurat.pengirim} telah diselesaikan oleh staf pelaksana.`,
        targetUserId: 'user-pimpinan',
        prioritas: 'biasa'
      });
    } else {
      sendNotification({
        suratId,
        suratType: 'masuk',
        tipe: 'tindak_lanjut',
        judul: 'Tindak Lanjut Disposisi Diperbarui',
        pesan: `Progres disposisi ${targetSurat.noAgenda}: "${tindakLanjut?.slice(0, 60) || 'Dalam pengerjaan'}"`,
        targetUserId: 'user-pimpinan',
        prioritas: 'biasa'
      });
    }
  };

  // Notification management
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // User Management
  const addUser = (userData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`
    };
    setUsers(prev => [...prev, newUser]);
    addLog('Tambah Pengguna', `Menambahkan pengguna baru: ${newUser.name} (${newUser.jabatan})`);
  };

  const updateUser = (id: string, userData: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...userData } : u));
    if (currentUser.id === id) {
      setCurrentUser(prev => ({ ...prev, ...userData }));
    }
    addLog('Ubah Pengguna', `Memperbarui data pengguna ID ${id}`);
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    addLog('Hapus Pengguna', `Menghapus data pengguna ID ${id}`);
  };

  // Real-Time Simulation Generator for testing
  const simulateRealTimeIncoming = () => {
    const sampleAgencies = [
      'Gubernur Jawa Barat / Sekretariat Daerah',
      'Kementerian Keuangan RI - Ditjen Perbendaharaan',
      'Badan Riset dan Inovasi Nasional (BRIN)',
      'Dinas Komunikasi, Informatika dan Statistik Provinsi'
    ];
    const samplePerihal = [
      'Undangan Sidang Pleno Koordinasi Evaluasi Transformasi Kinerja Instansi',
      'Surat Edaran Petunjuk Teknis Pelaporan Akuntabilitas Kinerja 2026',
      'Pemberitahuan Verifikasi Lapangan Sertifikasi Tata Naskah Kearsipan',
      'Permohonan Fasilitasi Rapat Koordinasi Lintas Sektoral Kebijakan Publik'
    ];

    const pickIdx = Math.floor(Math.random() * sampleAgencies.length);
    const randomPengirim = sampleAgencies[pickIdx];
    const randomPerihal = samplePerihal[pickIdx];
    const agendaNum = `AGD/2026/03/00${Math.floor(86 + Math.random() * 40)}`;
    const noSurat = `B/${Math.floor(100 + Math.random() * 900)}/DINAS/III/2026`;

    const newSurat: SuratMasuk = {
      id: `sm-${Date.now()}`,
      noAgenda: agendaNum,
      noSuratAsal: noSurat,
      pengirim: randomPengirim,
      perihal: randomPerihal,
      tanggalSurat: new Date().toISOString().split('T')[0],
      tanggalTerima: new Date().toISOString().split('T')[0],
      sifat: 'Segera',
      klasifikasi: '005 - Undangan & Acara Kedinasan',
      isiRingkas: `Surat resmi masuk secara otomatis via gateway e-office dari ${randomPengirim}. Memerlukan perhatian pimpinan.`,
      lampiranNama: `Surat_Resmi_${agendaNum.replace(/\//g, '_')}.pdf`,
      lampiranUkuran: '1.8 MB',
      statusDisposisi: 'Belum Didisposisikan',
      disposisiList: [],
      createdAt: new Date().toISOString()
    };

    setSuratMasukList(prev => [newSurat, ...prev]);
    addLog('Simulasi Surat Masuk Real-Time', `Surat masuk baru: ${randomPengirim} (${agendaNum})`);

    sendNotification({
      suratId: newSurat.id,
      suratType: 'masuk',
      tipe: 'surat_masuk_urgent',
      judul: '⚡ SURAT MASUK SEGERA BARU!',
      pesan: `Surat masuk baru dari ${randomPengirim}: "${randomPerihal}". Klik untuk melihat detail & memberi disposisi.`,
      targetUserId: 'all',
      prioritas: 'kritis'
    });
  };

  const resetToSampleData = () => {
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[1]); // Sekretaris
    setSuratMasukList(INITIAL_SURAT_MASUK);
    setSuratKeluarList(INITIAL_SURAT_KELUAR);
    setNotifications(INITIAL_NOTIFICATIONS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    localStorage.clear();
  };

  // Stats calculation
  const stats: SystemStats = {
    totalSuratMasuk: suratMasukList.length,
    totalSuratKeluar: suratKeluarList.length,
    disposisiAktif: suratMasukList.filter(s => s.statusDisposisi === 'Didisposisikan' || s.statusDisposisi === 'Dalam Proses').length,
    disposisiSelesai: suratMasukList.filter(s => s.statusDisposisi === 'Selesai').length,
    suratSegera: suratMasukList.filter(s => s.sifat === 'Segera' || s.sifat === 'Penting').length,
    suratHariIni: suratMasukList.filter(s => s.tanggalTerima === new Date().toISOString().split('T')[0]).length
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users,
        addUser,
        updateUser,
        deleteUser,

        suratMasukList,
        addSuratMasuk,
        updateSuratMasuk,
        deleteSuratMasuk,

        suratKeluarList,
        addSuratKeluar,
        updateSuratKeluar,
        deleteSuratKeluar,

        addDisposisi,
        updateDisposisiStatus,

        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearNotification,
        sendNotification,
        simulateRealTimeIncoming,

        auditLogs,
        stats,
        resetToSampleData,

        previewSuratMasuk,
        setPreviewSuratMasuk,
        disposisiModalSurat,
        setDisposisiModalSurat,
        tindakLanjutModalData,
        setTindakLanjutModalData,
        activeNavTab,
        setActiveNavTab
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
