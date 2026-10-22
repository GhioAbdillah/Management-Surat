import React from 'react';
import { X, Printer, Download } from 'lucide-react';
import { SuratMasuk } from '../../types';

interface PrintLembarDisposisiModalProps {
  surat: SuratMasuk | null;
  onClose: () => void;
}

export const PrintLembarDisposisiModal: React.FC<PrintLembarDisposisiModalProps> = ({
  surat,
  onClose
}) => {
  if (!surat) return null;

  const handlePrint = () => {
    window.print();
  };

  const latestDisp = surat.disposisiList[0];

  const standardInstructions = [
    'Tindak lanjuti segera sesuai regulasi',
    'Siapkan bahan kajian / telaah staf',
    'Koordinasikan dengan unit kerja terkait',
    'Hadiri dan wakili Dinas',
    'Arsipkan dan masukkan agenda monitoring',
    'Jadwalkan rapat teknis internal',
    'Buat draft surat balasan dinas',
    'Pelajari dan berikan saran pertimbangan'
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div 
        className="bg-white rounded-xl shadow-2xl border border-slate-300 max-w-3xl w-full max-h-[95vh] flex flex-col overflow-hidden animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Action Header (Hidden during actual print) */}
        <div className="no-print px-5 py-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-800">
              Pratinjau Cetak Lembar Disposisi Resmi
            </h2>
            <p className="text-[11px] text-slate-500">
              Format standar tata naskah dinas kedinasan / Permendagri No. 1 Tahun 2023
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Dokumen (Print)</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Sheet Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-white custom-scrollbar print:p-0">
          <div className="border-2 border-slate-900 p-6 sm:p-8 font-serif text-slate-900 bg-white">
            
            {/* Kop Surat Resmi */}
            <div className="text-center border-b-4 border-double border-slate-900 pb-3 mb-4">
              <div className="text-xs font-bold uppercase tracking-widest text-slate-700">
                PEMERINTAH DAERAH PROVINSI
              </div>
              <div className="text-lg sm:text-xl font-black uppercase tracking-normal">
                DINAS PERSURATAN DAN KEARSIPAN DAERAH
              </div>
              <div className="text-[11px] font-sans text-slate-600 mt-0.5">
                Jalan Mayor Oking No. 100 · Telp. (021) 7890-1234 · Fax. (021) 7890-1235 · Laman: www.persuratan.prov.go.id
              </div>
            </div>

            {/* Judul Lembar Disposisi */}
            <div className="text-center mb-4">
              <h1 className="text-base sm:text-lg font-black uppercase tracking-wider underline">
                LEMBAR DISPOSISI
              </h1>
              <div className="text-xs font-sans text-slate-600 mt-0.5">
                PERHATIAN : Dilarang memisahkan sehelai surat pun yang tergabung dalam berkas ini.
              </div>
            </div>

            {/* Grid 1: Indeks & Registrasi */}
            <table className="w-full border-collapse border border-slate-900 text-xs font-sans mb-3">
              <tbody>
                <tr className="border-b border-slate-900">
                  <td className="border-r border-slate-900 p-2 font-semibold w-1/3 bg-slate-50">
                    Indeks / Kode Klasifikasi :
                  </td>
                  <td className="p-2 font-mono font-semibold">
                    {surat.klasifikasi}
                  </td>
                  <td className="border-l border-r border-slate-900 p-2 font-semibold w-1/4 bg-slate-50">
                    Tgl. Penyelesaian :
                  </td>
                  <td className="p-2 font-mono">
                    {latestDisp?.batasWaktu || '-'}
                  </td>
                </tr>
                <tr className="border-b border-slate-900">
                  <td className="border-r border-slate-900 p-2 font-semibold bg-slate-50">
                    Nomor Agenda :
                  </td>
                  <td className="p-2 font-mono font-bold text-slate-900">
                    {surat.noAgenda}
                  </td>
                  <td className="border-l border-r border-slate-900 p-2 font-semibold bg-slate-50">
                    Tanggal Terima :
                  </td>
                  <td className="p-2 font-mono">
                    {surat.tanggalTerima}
                  </td>
                </tr>
                <tr>
                  <td className="border-r border-slate-900 p-2 font-semibold bg-slate-50">
                    Sifat Surat :
                  </td>
                  <td colSpan={3} className="p-2">
                    <div className="flex items-center gap-4">
                      {['Biasa', 'Penting', 'Segera', 'Rahasia'].map((s) => (
                        <label key={s} className="flex items-center gap-1.5 cursor-pointer">
                          <input 
                            type="checkbox" 
                            readOnly 
                            checked={surat.sifat.toLowerCase() === s.toLowerCase()}
                            className="w-3.5 h-3.5"
                          />
                          <span className={surat.sifat.toLowerCase() === s.toLowerCase() ? 'font-bold' : ''}>
                            {s}
                          </span>
                        </label>
                      ))}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Grid 2: Informasi Surat Masuk */}
            <table className="w-full border-collapse border border-slate-900 text-xs font-sans mb-3">
              <tbody>
                <tr className="border-b border-slate-900">
                  <td className="border-r border-slate-900 p-2 font-semibold w-32 bg-slate-50">
                    Asal Surat :
                  </td>
                  <td colSpan={3} className="p-2 font-semibold">
                    {surat.pengirim}
                  </td>
                </tr>
                <tr className="border-b border-slate-900">
                  <td className="border-r border-slate-900 p-2 font-semibold bg-slate-50">
                    Nomor Surat :
                  </td>
                  <td className="p-2 font-mono border-r border-slate-900">
                    {surat.noSuratAsal}
                  </td>
                  <td className="p-2 font-semibold w-28 bg-slate-50 border-r border-slate-900">
                    Tanggal Surat :
                  </td>
                  <td className="p-2 font-mono">
                    {surat.tanggalSurat}
                  </td>
                </tr>
                <tr>
                  <td className="border-r border-slate-900 p-2 font-semibold bg-slate-50">
                    Perihal / Hal :
                  </td>
                  <td colSpan={3} className="p-2 leading-relaxed">
                    <strong>{surat.perihal}</strong>
                    <div className="text-[11px] text-slate-700 mt-1 italic">
                      Ringkasan: {surat.isiRingkas}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Grid 3: Diteruskan Kepada & Instruksi Disposisi */}
            <table className="w-full border-collapse border border-slate-900 text-xs font-sans mb-4">
              <thead>
                <tr className="border-b border-slate-900 bg-slate-100 font-bold">
                  <th className="border-r border-slate-900 p-2 text-left w-1/2">
                    DITERUSKAN KEPADA :
                  </th>
                  <th className="p-2 text-left w-1/2">
                    DENGAN HORMAT HARAP / INSTRUKSI :
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-r border-slate-900 p-3 align-top space-y-2">
                    {latestDisp ? (
                      <div className="bg-slate-50 p-2 border border-slate-300 rounded">
                        <div className="font-bold text-slate-900">
                          {latestDisp.kepadaUserName}
                        </div>
                        <div className="text-[11px] text-slate-700">
                          {latestDisp.kepadaUserJabatan}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1">
                          Tanggal Disposisi: {new Date(latestDisp.tanggalDisposisi).toLocaleDateString('id-ID')}
                        </div>
                      </div>
                    ) : (
                      <div className="text-slate-400 italic">Belum ditentukan</div>
                    )}

                    <div className="pt-2 text-[11px] text-slate-600">
                      <strong>Pejabat Lainnya Terkait:</strong>
                      <div className="grid grid-cols-1 gap-1 mt-1">
                        <div>[ ] Sekretaris Dinas</div>
                        <div>[ ] Ka. Bidang Infrastruktur & TI</div>
                        <div>[ ] Ka. Bidang Umum & Kepegawaian</div>
                        <div>[ ] Kasubbag Tata Usaha</div>
                      </div>
                    </div>
                  </td>

                  <td className="p-3 align-top">
                    <div className="space-y-1.5">
                      {standardInstructions.map((instruksi, i) => {
                        const isChecked = latestDisp?.instruksi?.includes(instruksi);
                        return (
                          <label key={i} className="flex items-start gap-2">
                            <input 
                              type="checkbox" 
                              readOnly 
                              checked={isChecked} 
                              className="mt-0.5 w-3.5 h-3.5"
                            />
                            <span className={isChecked ? 'font-bold text-slate-900' : 'text-slate-700'}>
                              {instruksi}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Catatan Arahan Pimpinan & Tanda Tangan */}
            <div className="grid grid-cols-3 gap-4 border border-slate-900 p-3 text-xs font-sans mb-3">
              <div className="col-span-2 border-r border-slate-900 pr-3">
                <div className="font-bold uppercase tracking-wider mb-1 text-slate-800">
                  CATATAN / ARAHAN PIMPINAN:
                </div>
                <div className="min-h-20 p-2 bg-slate-50 border border-slate-200 rounded leading-relaxed text-slate-800">
                  {latestDisp?.catatanPimpinan ? (
                    latestDisp.catatanPimpinan
                  ) : (
                    <span className="text-slate-400 italic">
                      Mohon dipelajari dan ditindaklanjuti sesuai dengan ketentuan yang berlaku. Laporkan hasilnya.
                    </span>
                  )}
                </div>
              </div>

              <div className="text-center flex flex-col justify-between pl-2">
                <div>
                  <div className="text-[11px]">Ditetapkan di Tempat,</div>
                  <div className="text-[11px] font-mono">
                    Tgl: {latestDisp ? new Date(latestDisp.tanggalDisposisi).toLocaleDateString('id-ID') : '-'}
                  </div>
                  <div className="font-bold mt-1">KEPALA DINAS,</div>
                </div>

                <div className="my-3">
                  <div className="inline-block border border-dashed border-slate-400 px-3 py-1 rounded text-[10px] text-slate-500 font-mono">
                    [ TANDA TANGAN DIGITAL TERVERIFIKASI ]
                  </div>
                </div>

                <div>
                  <div className="font-bold underline">
                    {latestDisp?.dariUserName || 'Dr. H. Bambang Suryono, M.Si.'}
                  </div>
                  <div className="text-[10px] font-mono">
                    NIP. 19740512 199803 1 004
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Form Code */}
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mt-2">
              <span>Formulir Kearsipan Elektronik: E-DISP/{surat.noAgenda.replace(/\//g, '-')}</span>
              <span>Dicetak otomatis oleh Sistem E-Surat Kedinasan</span>
            </div>

          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="no-print px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Tip: Gunakan pengaturan orientasi Portrait (A4) pada jendela printer browser.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
