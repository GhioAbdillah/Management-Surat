export type UserRole = 'admin' | 'pimpinan' | 'sekretaris' | 'kabid' | 'staf';

export interface User {
  id: string;
  name: string;
  nip: string;
  role: UserRole;
  jabatan: string;
  bidang: string;
  email: string;
  telepon: string;
  status: 'aktif' | 'nonaktif';
}

export type SifatSurat = 'Biasa' | 'Penting' | 'Segera' | 'Rahasia';

export interface DisposisiItem {
  id: string;
  suratId: string;
  dariUserId: string;
  dariUserName: string;
  dariUserJabatan: string;
  kepadaUserId: string;
  kepadaUserName: string;
  kepadaUserJabatan: string;
  instruksi: string[];
  catatanPimpinan: string;
  batasWaktu: string; // YYYY-MM-DD
  tanggalDisposisi: string; // ISO
  status: 'Menunggu' | 'Dalam Proses' | 'Selesai' | 'Ditolak';
  tindakLanjutCatatan?: string;
  tanggalSelesai?: string;
}

export interface SuratMasuk {
  id: string;
  noAgenda: string;
  noSuratAsal: string;
  pengirim: string;
  perihal: string;
  tanggalSurat: string;
  tanggalTerima: string;
  sifat: SifatSurat;
  klasifikasi: string;
  isiRingkas: string;
  lampiranNama: string;
  lampiranUkuran: string;
  statusDisposisi: 'Belum Didisposisikan' | 'Didisposisikan' | 'Dalam Proses' | 'Selesai';
  disposisiList: DisposisiItem[];
  createdAt: string;
}

export type StatusSuratKeluar = 'Draft' | 'Menunggu Verifikasi' | 'Disetujui Pimpinan' | 'Telah Terkirim';
export type MetodePengiriman = 'Kurir Kedinasan' | 'Pos Kilat Resmi' | 'Email Kantor / E-Office' | 'Diambil Langsung';

export interface SuratKeluar {
  id: string;
  noAgendaKeluar: string;
  noSuratKeluar: string;
  tujuan: string;
  perihal: string;
  tanggalSurat: string;
  sifat: SifatSurat;
  klasifikasi: string;
  isiRingkas: string;
  konseptor: string;
  konseptorId: string;
  statusParaf: StatusSuratKeluar;
  metodePengiriman: MetodePengiriman;
  namaPenerimaEkspedisi?: string;
  tanggalKirim?: string;
  lampiranNama: string;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  suratId?: string;
  suratType?: 'masuk' | 'keluar';
  tipe: 'disposisi_baru' | 'surat_masuk_urgent' | 'tindak_lanjut' | 'disposisi_selesai' | 'jatuh_tempo' | 'info';
  judul: string;
  pesan: string;
  targetUserId: string | 'all';
  isRead: boolean;
  timestamp: string;
  prioritas: 'biasa' | 'tinggi' | 'kritis';
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  detail: string;
  timestamp: string;
}

export interface SystemStats {
  totalSuratMasuk: number;
  totalSuratKeluar: number;
  disposisiAktif: number;
  disposisiSelesai: number;
  suratSegera: number;
  suratHariIni: number;
}
