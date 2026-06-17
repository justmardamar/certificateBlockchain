"use client"
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { getContract } from "@/lib/blockchain";

export default function IssueCard() {
    const [nim, setNim] = useState('')
    const [certNumber, setCertNumber] = useState('')
    const [seminarName, setSeminarName] = useState('')
    const [isIssuing, setIsIssuing] = useState(false)
    const [issueStatus, setIssueStatus] = useState('')
    
    const handleIssue = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsIssuing(true);
        setIssueStatus('Memproses Transaksi...');
        try {
          const contract = getContract();
          
          const rawData = `${nim}-${certNumber}-${seminarName}`;
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

    return(
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
                  value={nim} 
                  onChange={(e) => setNim(e.target.value)} 
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
                {status ? 'Proses Transaksi...' : 'Cetak Ke Blockchain'}
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
    )
}