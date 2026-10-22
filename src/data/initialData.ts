import { User, SuratMasuk, SuratKeluar, AppNotification, AuditLog } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user-pimpinan',
    name: 'Dr. H. Bambang Suryono, M.Si.',
    nip: '19740512 199803 1 004',
    role: 'pimpinan',
    jabatan: 'Kepala Dinas',
    bidang: 'Pimpinan Eksekutif',
    email: 'kadin@instansi.go.id',
    telepon: '0812-3456-7890',
    status: 'aktif'
  },
  {
    id: 'user-sekretaris',
    name: 'Ratna Juwita, S.Sos., M.AP.',
    nip: '19820815 200604 2 007',
    role: 'sekretaris',
    jabatan: 'Sekretaris Dinas & Koordinator TU',
    bidang: 'Sekretariat / Tata Usaha',
    email: 'sekretaris@instansi.go.id',
    telepon: '0813-9876-5432',
    status: 'aktif'
  },
  {
    id: 'user-kabid-ti',
    name: 'Ir. Hendra Wijaya, M.Eng.',
    nip: '19850319 200901 1 003',
    role: 'kabid',
    jabatan: 'Kepala Bidang Infrastruktur & TI',
    bidang: 'Bidang TI & Siber',
    email: 'hendra.ti@instansi.go.id',
    telepon: '0811-2233-4455',
    status: 'aktif'
  },
  {
    id: 'user-kabid-pegawai',
    name: 'Drs. Agus Salim, M.M.',
    nip: '19790910 200501 1 008',
    role: 'kabid',
    jabatan: 'Kepala Bidang Umum & Kepegawaian',
    bidang: 'Bidang Kepegawaian',
    email: 'agus.salim@instansi.go.id',
    telepon: '0812-8877-6655',
    status: 'aktif'
  },
  {
    id: 'user-staf-1',
    name: 'Siti Nurhaliza, S.Kom.',
    nip: '19930402 201801 2 005',
    role: 'staf',
    jabatan: 'Pranata Komputer Ahli Pertama',
    bidang: 'Bidang TI & Siber',
    email: 'siti.nurhaliza@instansi.go.id',
    telepon: '0857-1122-3344',
    status: 'aktif'
  },
  {
    id: 'user-admin',
    name: 'Ahmad Fauzi, S.Kom.',
    nip: '19901124 201502 1 002',
    role: 'admin',
    jabatan: 'Pranata Komputer / Administrator Sistem',
    bidang: 'Subbag Umum & Kepegawaian',
    email: 'admin.persuratan@instansi.go.id',
    telepon: '0821-4455-6677',
    status: 'aktif'
  }
];

export const KLASIFIKASI_LIST = [
  '005 - Undangan & Acara Kedinasan',
  '090 - Perjalanan Dinas & Konsinyering',
  '420 - Pendidikan & Pelatihan Teknis',
  '800 - Kepegawaian, Mutasi & Kinerja ASN',
  '045 - Kearsipan & Dokumentasi Resmi',
  '100 - Tata Pemerintahan & Regulasi Daerah',
  '900 - Keuangan & Anggaran DPA',
  '060 - Organisasi dan Ketatalaksanaan'
];

export const INSTRUKSI_PRESETS = [
  'Tindak lanjuti segera sesuai SOP',
  'Siapkan bahan kajian / telaah staf',
  'Koordinasikan dengan unit kerja terkait',
  'Hadiri dan wakili Dinas',
  'Arsipkan dan masukkan agenda monitoring',
  'Jadwalkan rapat teknis internal',
  'Buat draft surat balasan dinas',
  'Pelajari dan berikan saran pertimbangan'
];

export const INITIAL_SURAT_MASUK: SuratMasuk[] = [
  {
    id: 'sm-001',
    noAgenda: 'AGD/2026/03/0081',
    noSuratAsal: 'B/1420/M.PANRB/03/2026',
    pengirim: 'Kementerian Pendayagunaan Aparatur Negara dan Reformasi Birokrasi RI',
    perihal: 'Undangan Rapat Koordinasi Nasional Penerapan Sistem Pemerintahan Berbasis Elektronik (SPBE) 2026',
    tanggalSurat: '2026-03-18',
    tanggalTerima: '2026-03-20',
    sifat: 'Segera',
    klasifikasi: '005 - Undangan & Acara Kedinasan',
    isiRingkas: 'Sehubungan dengan percepatan transformasi digital instansi pemerintah, diundang Kepala Dinas beserta Koordinator SPBE/TI untuk hadir pada agenda rakornas di Jakarta Convention Center.',
    lampiranNama: 'Undangan_Rakornas_SPBE_2026.pdf',
    lampiranUkuran: '2.4 MB',
    statusDisposisi: 'Dalam Proses',
    createdAt: '2026-03-20T08:30:00Z',
    disposisiList: [
      {
        id: 'disp-001',
        suratId: 'sm-001',
        dariUserId: 'user-pimpinan',
        dariUserName: 'Dr. H. Bambang Suryono, M.Si.',
        dariUserJabatan: 'Kepala Dinas',
        kepadaUserId: 'user-kabid-ti',
        kepadaUserName: 'Ir. Hendra Wijaya, M.Eng.',
        kepadaUserJabatan: 'Kepala Bidang Infrastruktur & TI',
        instruksi: [
          'Hadiri dan wakili Dinas',
          'Siapkan bahan kajian / telaah staf',
          'Koordinasikan dengan unit kerja terkait'
        ],
        catatanPimpinan: 'Mohon Kabid TI mewakili saya bersama Tim Pengembang Sistem. Siapkan paparan kesiapan arsitektur SPBE dinas kita sebelum tanggal 24 Maret.',
        batasWaktu: '2026-03-24',
        tanggalDisposisi: '2026-03-20T10:15:00Z',
        status: 'Dalam Proses',
        tindakLanjutCatatan: 'Materi paparan dan telaah sedang dikonsolidasikan bersama staf teknis. Berkas draf siap ditinjau pimpinan.'
      }
    ]
  },
  {
    id: 'sm-002',
    noAgenda: 'AGD/2026/03/0082',
    noSuratAsal: '700/082/INSP-PROV/III/2026',
    pengirim: 'Inspektorat Daerah Provinsi',
    perihal: 'Permintaan Dokumen Rekapitulasi Tata Kelola Kearsipan dan Surat Dinas Triwulan I',
    tanggalSurat: '2026-03-19',
    tanggalTerima: '2026-03-21',
    sifat: 'Penting',
    klasifikasi: '045 - Kearsipan & Dokumentasi Resmi',
    isiRingkas: 'Pelaksanaan audit ketaatan kearsipan dan kepatuhan kodefikasi naskah dinas elektronik periode Triwulan I Tahun Anggaran 2026.',
    lampiranNama: 'Formulir_Audit_Kearsipan_2026.xlsx',
    lampiranUkuran: '850 KB',
    statusDisposisi: 'Selesai',
    createdAt: '2026-03-21T09:10:00Z',
    disposisiList: [
      {
        id: 'disp-002',
        suratId: 'sm-002',
        dariUserId: 'user-pimpinan',
        dariUserName: 'Dr. H. Bambang Suryono, M.Si.',
        dariUserJabatan: 'Kepala Dinas',
        kepadaUserId: 'user-sekretaris',
        kepadaUserName: 'Ratna Juwita, S.Sos., M.AP.',
        kepadaUserJabatan: 'Sekretaris Dinas & Koordinator TU',
        instruksi: [
          'Tindak lanjuti segera sesuai SOP',
          'Arsipkan dan masukkan agenda monitoring'
        ],
        catatanPimpinan: 'Siapkan data rekapitulasi surat masuk/keluar Triwulan I dan serahkan ke tim auditor Inspektorat.',
        batasWaktu: '2026-03-23',
        tanggalDisposisi: '2026-03-21T11:00:00Z',
        status: 'Selesai',
        tindakLanjutCatatan: 'Seluruh berkas laporan rekapitulasi telah dicetak dan dikirimkan ke Inspektorat beserta tanda terima ekspedisi nomor EXP-042.',
        tanggalSelesai: '2026-03-22T14:30:00Z'
      }
    ]
  },
  {
    id: 'sm-003',
    noAgenda: 'AGD/2026/03/0083',
    noSuratAsal: 'BSSN/PW/029/III/2026',
    pengirim: 'Badan Siber dan Sandi Negara (BSSN)',
    perihal: 'Pemberitahuan Audit Keamanan Informasi dan Simulasi Tanggap Insiden CSIRT',
    tanggalSurat: '2026-03-21',
    tanggalTerima: '2026-03-22',
    sifat: 'Segera',
    klasifikasi: '100 - Tata Pemerintahan & Regulasi Daerah',
    isiRingkas: 'Pelaksanaan vulnerability assessment dan evaluasi kesiapan insiden siber pada portal persuratan dan data center dinas.',
    lampiranNama: 'Panduan_Simulasi_CSIRT_BSSN.pdf',
    lampiranUkuran: '3.1 MB',
    statusDisposisi: 'Belum Didisposisikan',
    createdAt: '2026-03-22T08:00:00Z',
    disposisiList: []
  },
  {
    id: 'sm-004',
    noAgenda: 'AGD/2026/03/0084',
    noSuratAsal: '800/190/BKPSDM/2026',
    pengirim: 'Badan Kepegawaian dan Pengembangan SDM',
    perihal: 'Surat Edaran Pelaksanaan Uji Kompetensi dan Pemetaan Talenta ASN Tahun 2026',
    tanggalSurat: '2026-03-15',
    tanggalTerima: '2026-03-17',
    sifat: 'Biasa',
    klasifikasi: '800 - Kepegawaian, Mutasi & Kinerja ASN',
    isiRingkas: 'Pemberitahuan kepada seluruh pejabat struktural dan fungsional perihal jadwal verifikasi data portofolio kepegawaian mandiri.',
    lampiranNama: 'Jadwal_Uji_Kompetensi_ASN_2026.pdf',
    lampiranUkuran: '1.2 MB',
    statusDisposisi: 'Didisposisikan',
    createdAt: '2026-03-17T09:45:00Z',
    disposisiList: [
      {
        id: 'disp-004',
        suratId: 'sm-004',
        dariUserId: 'user-pimpinan',
        dariUserName: 'Dr. H. Bambang Suryono, M.Si.',
        dariUserJabatan: 'Kepala Dinas',
        kepadaUserId: 'user-kabid-pegawai',
        kepadaUserName: 'Drs. Agus Salim, M.M.',
        kepadaUserJabatan: 'Kepala Bidang Umum & Kepegawaian',
        instruksi: [
          'Tindak lanjuti segera sesuai SOP',
          'Koordinasikan dengan unit kerja terkait'
        ],
        catatanPimpinan: 'Daftarkan pejabat fungsional yang memenuhi syarat dan pastikan berkas administrasi lengkap sebelum batas akhir.',
        batasWaktu: '2026-03-28',
        tanggalDisposisi: '2026-03-17T13:30:00Z',
        status: 'Menunggu'
      }
    ]
  },
  {
    id: 'sm-005',
    noAgenda: 'AGD/2026/03/0085',
    noSuratAsal: 'RH/004/SETDA/III/2026',
    pengirim: 'Sekretariat Daerah - Bagian Hukum',
    perihal: 'Penyampaian Draf Peraturan Walikota tentang Tata Naskah Dinas Elektronik Terintegrasi',
    tanggalSurat: '2026-03-20',
    tanggalTerima: '2026-03-22',
    sifat: 'Rahasia',
    klasifikasi: '100 - Tata Pemerintahan & Regulasi Daerah',
    isiRingkas: 'Permintaan masukan dan paraf koordinasi naskah perwali sebelum penandatanganan kepala daerah.',
    lampiranNama: 'Draf_Perwali_Naskah_Dinas_2026_Confidential.pdf',
    lampiranUkuran: '4.5 MB',
    statusDisposisi: 'Belum Didisposisikan',
    createdAt: '2026-03-22T10:15:00Z',
    disposisiList: []
  }
];

export const INITIAL_SURAT_KELUAR: SuratKeluar[] = [
  {
    id: 'sk-001',
    noAgendaKeluar: 'AGD-OUT/2026/03/0041',
    noSuratKeluar: '005/0312/DISPERSIP/III/2026',
    tujuan: 'Seluruh Kepala Organisasi Perangkat Daerah (OPD) Lingkup Pemda',
    perihal: 'Undangan Workshop Standardisasi Kodefikasi Persuratan dan Disposisi Elektronik',
    tanggalSurat: '2026-03-18',
    sifat: 'Penting',
    klasifikasi: '005 - Undangan & Acara Kedinasan',
    isiRingkas: 'Dalam rangka mewujudkan tertib administrasi persuratan dan implementasi tanda tangan digital, seluruh kepala OPD diharapkan mengutus 2 orang operator persuratan.',
    konseptor: 'Ratna Juwita, S.Sos., M.AP.',
    konseptorId: 'user-sekretaris',
    statusParaf: 'Telah Terkirim',
    metodePengiriman: 'Email Kantor / E-Office',
    namaPenerimaEkspedisi: 'Bagian Administrasi Umum Seluruh OPD',
    tanggalKirim: '2026-03-19T09:00:00Z',
    lampiranNama: 'Jadwal_Workshop_Persuratan_2026.pdf',
    createdAt: '2026-03-18T11:20:00Z'
  },
  {
    id: 'sk-002',
    noAgendaKeluar: 'AGD-OUT/2026/03/0042',
    noSuratKeluar: '090/0315/DISPERSIP/III/2026',
    tujuan: 'Kepala Pusat Data dan Teknologi Informasi Kementerian Komdigi',
    perihal: 'Permohonan Kunjungan Studi Tiru dan Konsultasi Infrastruktur Cloud Persuratan',
    tanggalSurat: '2026-03-21',
    sifat: 'Biasa',
    klasifikasi: '090 - Perjalanan Dinas & Konsinyering',
    isiRingkas: 'Permohonan kesediaan menerima tim studi komparasi mengenai optimalisasi server data center persuratan aman.',
    konseptor: 'Ir. Hendra Wijaya, M.Eng.',
    konseptorId: 'user-kabid-ti',
    statusParaf: 'Disetujui Pimpinan',
    metodePengiriman: 'Pos Kilat Resmi',
    namaPenerimaEkspedisi: 'Subbag Persuratan Pusdatin',
    tanggalKirim: '2026-03-22T08:15:00Z',
    lampiranNama: 'Daftar_Nama_Rombongan_Studi.pdf',
    createdAt: '2026-03-21T14:10:00Z'
  },
  {
    id: 'sk-003',
    noAgendaKeluar: 'AGD-OUT/2026/03/0043',
    noSuratKeluar: '800/0318/DISPERSIP/III/2026',
    tujuan: 'Badan Kepegawaian dan Pengembangan SDM (BKPSDM)',
    perihal: 'Usulan Kebutuhan Formasi Jabatan Fungsional Arsiparis dan Pranata Komputer Tahun 2026',
    tanggalSurat: '2026-03-22',
    sifat: 'Segera',
    klasifikasi: '800 - Kepegawaian, Mutasi & Kinerja ASN',
    isiRingkas: 'Penyampaian analisis beban kerja (ABK) dan peta jabatan teknis untuk pemenuhan formasi ASN.',
    konseptor: 'Drs. Agus Salim, M.M.',
    konseptorId: 'user-kabid-pegawai',
    statusParaf: 'Menunggu Verifikasi',
    metodePengiriman: 'Kurir Kedinasan',
    lampiranNama: 'Lampiran_ABK_Peta_Jabatan_2026.pdf',
    createdAt: '2026-03-22T09:30:00Z'
  },
  {
    id: 'sk-004',
    noAgendaKeluar: 'AGD-OUT/2026/03/0044',
    noSuratKeluar: '420/0320/DISPERSIP/III/2026',
    tujuan: 'Kepala Dinas Pendidikan Provinsi',
    perihal: 'Sosialisasi Program Literasi Arsip Sejarah dan Dokumen Digital Sekolah',
    tanggalSurat: '2026-03-22',
    sifat: 'Biasa',
    klasifikasi: '420 - Pendidikan & Pelatihan Teknis',
    isiRingkas: 'Konsep nota kesepahaman pengelolaan arsip statis dan dinamis pada satuan pendidikan menengah kejuruan.',
    konseptor: 'Siti Nurhaliza, S.Kom.',
    konseptorId: 'user-staf-1',
    statusParaf: 'Draft',
    metodePengiriman: 'Email Kantor / E-Office',
    lampiranNama: 'Konsep_PKS_Arsip_Sekolah.docx',
    createdAt: '2026-03-22T11:00:00Z'
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    suratId: 'sm-003',
    suratType: 'masuk',
    tipe: 'surat_masuk_urgent',
    judul: 'Surat Masuk Sifat Segera',
    pesan: 'Surat masuk dari Badan Siber dan Sandi Negara (BSSN) perihal Simulasi CSIRT membutuhkan disposisi pimpinan.',
    targetUserId: 'all',
    isRead: false,
    timestamp: '2026-03-22T08:05:00Z',
    prioritas: 'kritis'
  },
  {
    id: 'notif-2',
    suratId: 'sm-001',
    suratType: 'masuk',
    tipe: 'jatuh_tempo',
    judul: 'Batas Waktu Disposisi Mendekat',
    pesan: 'Disposisi Rakornas SPBE Kementerian PANRB jatuh tempo pada 24 Maret 2026 (Kabid TI).',
    targetUserId: 'user-kabid-ti',
    isRead: false,
    timestamp: '2026-03-22T07:00:00Z',
    prioritas: 'tinggi'
  },
  {
    id: 'notif-3',
    suratId: 'sm-002',
    suratType: 'masuk',
    tipe: 'disposisi_selesai',
    judul: 'Tindak Lanjut Disposisi Selesai',
    pesan: 'Sekretaris Dinas telah menyelesaikan tindak lanjut permohonan audit Inspektorat Daerah.',
    targetUserId: 'user-pimpinan',
    isRead: true,
    timestamp: '2026-03-22T14:35:00Z',
    prioritas: 'biasa'
  },
  {
    id: 'notif-4',
    suratId: 'sk-003',
    suratType: 'keluar',
    tipe: 'info',
    judul: 'Surat Keluar Menunggu Verifikasi',
    pesan: 'Konsep Usulan Formasi JF BKPSDM oleh Bidang Kepegawaian siap diverifikasi pimpinan.',
    targetUserId: 'user-pimpinan',
    isRead: false,
    timestamp: '2026-03-22T09:40:00Z',
    prioritas: 'biasa'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-001',
    userId: 'user-sekretaris',
    userName: 'Ratna Juwita, S.Sos., M.AP.',
    userRole: 'Sekretaris / TU',
    action: 'Registrasi Surat Masuk',
    detail: 'Mencatat surat masuk nomor BSSN/PW/029/III/2026 dari BSSN (No Agenda AGD/2026/03/0083)',
    timestamp: '2026-03-22T08:00:15Z'
  },
  {
    id: 'log-002',
    userId: 'user-pimpinan',
    userName: 'Dr. H. Bambang Suryono, M.Si.',
    userRole: 'Kepala Dinas',
    action: 'Penerbitan Disposisi',
    detail: 'Mendisposisikan surat Kementerian PANRB (AGD/2026/03/0081) kepada Kabid TI batas waktu 24 Maret',
    timestamp: '2026-03-20T10:15:00Z'
  },
  {
    id: 'log-003',
    userId: 'user-sekretaris',
    userName: 'Ratna Juwita, S.Sos., M.AP.',
    userRole: 'Sekretaris / TU',
    action: 'Penyelesaian Disposisi',
    detail: 'Menyelesaikan berkas audit kearsipan Inspektorat Daerah (AGD/2026/03/0082)',
    timestamp: '2026-03-22T14:30:20Z'
  },
  {
    id: 'log-004',
    userId: 'user-pimpinan',
    userName: 'Dr. H. Bambang Suryono, M.Si.',
    userRole: 'Kepala Dinas',
    action: 'Persetujuan Surat Keluar',
    detail: 'Menyetujui dan menandatangani surat dinas permohonan studi tiru Pusdatin Komdigi (No 090/0315/DISPERSIP/III/2026)',
    timestamp: '2026-03-21T16:00:00Z'
  }
];
