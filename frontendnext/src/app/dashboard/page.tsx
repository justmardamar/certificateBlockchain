'use client';

import { useState,useEffect } from 'react';
import { getContract } from '@/lib/blockchain';
import { ethers } from 'ethers';

export default function CertificateDashboard() {

  const [certificateList,setCertificateList] = useState<any[]>([])

  const [studentId, setStudentId] = useState('');
  const [certNumber, setCertNumber] = useState('');
  const [seminarName, setSeminarName] = useState('');
  const [issueStatus, setIssueStatus] = useState('');
  const [isIssuing, setIsIssuing] = useState(false);

  const [vStudentId, setVStudentId] = useState('');
  const [vCertNumber, setVCertNumber] = useState('');
  const [vSeminarName, setVSeminarName] = useState('');
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const loadAllCertifitaces = async () => {
    try {
      const contract = getContract()
      const filter = contract.filters.CertificateIssued()
      const events = await contract.queryFilter(filter,0,"latest")
      const list = await Promise.all(events.map(async (event) => {
        const certHash = event.args[0]
        const certNumber = event.args[1]
        const [isVerified, , timestamp] = await contract.verify(certHash)
        const date = new Date(Number(timestamp) * 1000).toLocaleString()
        return{
          hash : certHash,
          number : certNumber,
          data : date
        }
      }))
      setCertificateList(list)
    } catch (error) {
      console.log('Error Fethcing : ',error)
    }
  }

  const handleIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsIssuing(true);
    setIssueStatus('Memproses Transaksi...');
    try {
      const contract = getContract();
      
      const rawData = `${studentId}-${certNumber}-${seminarName}`;
      const certHash = ethers.keccak256(ethers.toUtf8Bytes(rawData));

      const tx = await contract.issue(certHash, certNumber);
      setIssueStatus('Menunggu Konfirmasi...');
      await tx.wait();
      
      setIssueStatus(`Berhasil ditambahkan ke blockchain. Hash: ${certHash.substring(0, 14)}...`);
    } catch (error: any) {
      setIssueStatus(`Error: ${error.reason || error.message}`);
    } finally {
      setIsIssuing(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setVerificationResult('Memverifikasi...');
    try {
      const contract = getContract();
      
      const rawData = `${vStudentId}-${vCertNumber}-${vSeminarName}`;
      const certHash = ethers.keccak256(ethers.toUtf8Bytes(rawData));

      const [isVerified, certNum, timestamp] = await contract.verify(certHash);
      
      if (isVerified) {
        setVerificationResult({
          valid: true,
          certNumber: certNum,
          date: new Date(Number(timestamp) * 1000).toLocaleString()
        });
      } else {
        setVerificationResult({ valid: false });
      }
    } catch (error) {
      setVerificationResult({ valid: false });
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    loadAllCertifitaces()
  },[])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased font-sans">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <span className="font-bold text-slate-900 tracking-tight">CertifChain</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Seminar Certificate Verifikasi
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          <section className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Tambah Serifikat</h2>
              <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                Admin
              </span>
            </div>
            <p className="text-slate-500 text-sm mb-6">
              Tambah ke jaringan blockchain
            </p>

            <form onSubmit={handleIssue} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">NIM</label>
                <input 
                  type="text" 
                  placeholder="Masukkan NIM" 
                  value={studentId} 
                  onChange={(e) => setStudentId(e.target.value)} 
                  required 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nomor Sertifikat</label>
                <input 
                  type="text" 
                  placeholder="Masukkan Nomor Sertifikat" 
                  value={certNumber} 
                  onChange={(e) => setCertNumber(e.target.value)} 
                  required 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nama Seminar</label>
                <input 
                  type="text" 
                  placeholder="Masukkan Nama Seminar" 
                  value={seminarName} 
                  onChange={(e) => setSeminarName(e.target.value)} 
                  required 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>

              <button 
                type="submit" 
                disabled={isIssuing}
                className="w-full py-3.5 mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl tracking-wide shadow-sm hover:shadow active:scale-[0.99] transition disabled:opacity-50"
              >
                {isIssuing ? 'Proses Transaksi...' : 'Cetak Ke Blockchain'}
              </button>
            </form>

            {issueStatus && (
              <div className={`mt-6 p-4 rounded-xl text-sm border font-medium ${
                issueStatus.startsWith('Error') 
                  ? 'bg-red-50 border-red-100 text-red-700' 
                  : issueStatus.startsWith('Success') 
                  ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                  : 'bg-indigo-50 border-indigo-100 text-indigo-700 animate-pulse'
              }`}>
                {issueStatus}
              </div>
            )}
          </section>
          <section className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Cek Keaslian Sertifikat</h2>
              <span className="text-xs font-semibold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                Mahasiswa
              </span>
            </div>
            <p className="text-slate-500 text-sm mb-6">
              Cek Keaslian sertifikat lewat blockchain
            </p>

            <form onSubmit={handleVerify} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">NIM</label>
                <input 
                  type="text" 
                  placeholder="Masukkan NIM" 
                  value={vStudentId} 
                  onChange={(e) => setVStudentId(e.target.value)} 
                  required 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nomor Sertifikat</label>
                <input 
                  type="text" 
                  placeholder="Masukkan Nomor Sertifikat" 
                  value={vCertNumber} 
                  onChange={(e) => setVCertNumber(e.target.value)} 
                  required 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nama Seminar</label>
                <input 
                  type="text" 
                  placeholder="Masukkan Nama Seminar" 
                  value={vSeminarName} 
                  onChange={(e) => setVSeminarName(e.target.value)} 
                  required 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
                />
              </div>

              <button 
                type="submit" 
                disabled={isVerifying}
                className="w-full py-3.5 mt-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl tracking-wide shadow-sm hover:shadow active:scale-[0.99] transition disabled:opacity-50"
              >
                {isVerifying ? 'Memeriksa...' : 'Verifikasi Keaslian'}
              </button>
            </form>

            {verificationResult && (
              <div className="mt-6">
                {verificationResult.valid ? (
                  <div className="p-5 rounded-xl border bg-emerald-50 border-emerald-200 text-emerald-800">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="h-5 w-5 text-emerald-600 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <h3 className="font-bold text-emerald-900">Terverifikasi!</h3>
                    </div>
                    <div className="text-xs space-y-1 mt-3 font-medium opacity-90 border-t border-emerald-100 pt-3">
                      <p><span className="font-semibold text-emerald-950">Nomor Sertifikat:</span> {verificationResult.certNumber}</p>
                      <p><span className="font-semibold text-emerald-950">Tanggal Masuk:</span> {verificationResult.date}</p>
                      <p><span className="font-semibold text-emerald-950">Status:</span> TERVERIFIKASI DI BLOCKCHAIN</p>
                    </div>
                  </div>
                ) : typeof verificationResult === 'string' ? (
                  <div className="p-4 rounded-xl border bg-slate-50 border-slate-200 text-slate-700 text-sm font-medium animate-pulse text-center">
                    {verificationResult}
                  </div>
                ) : (
                  <div className="p-5 rounded-xl border bg-rose-50 border-rose-200 text-rose-800">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="h-5 w-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <h3 className="font-bold text-rose-900">Peringatan</h3>
                    </div>
                    <p className="text-xs mt-2 font-medium opacity-95">
                      Tidak ada data. Di Ubah atau tidak ditemukan
                    </p>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
        <section className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Riwayat Sertifikat</h2>
            <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
              {certificateList.length} Total
            </span>
          </div>
          {certificateList.length === 0 ? (
            <div className="text-center py-12 rounded-2xl border border-dashed border-slate-300 bg-slate-50">
              <p className="text-slate-500 font-medium">Belum ada data.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
              <table className="w-full text-sm bg-white">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Hash (Potongan)</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Nomor Sertifikat</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Tanggal Dicetak</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status Blockchain</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {certificateList.map((cert, index) => (
                    <tr key={index} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-slate-600 break-all">
                        {cert.hash}
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-800">
                        {cert.number}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-600 font-medium">
                        {cert.data}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                          <span className="text-xs font-semibold text-emerald-700">TERSIMPAN</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}