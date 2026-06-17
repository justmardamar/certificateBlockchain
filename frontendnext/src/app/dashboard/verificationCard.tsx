"use client"
import { useState } from "react";
import { getContract } from "@/lib/blockchain";
import { ethers } from "ethers";

export default function VerificationCard(){
    const [vStudentId, setVStudentId] = useState('');
    const [vCertNumber, setVCertNumber] = useState('');
    const [vSeminarName, setVSeminarName] = useState('');
    const [verificationResult, setVerificationResult] = useState<any>(null);
    const [isVerifying, setIsVerifying] = useState(false);

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
    return(
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
    )
}