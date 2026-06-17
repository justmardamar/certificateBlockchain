'use client'
import { getContract } from "@/lib/blockchain";
import { useState,useEffect } from "react";

export default function Transaction() {
    const [certificateList,setCertificateList] = useState<any[]>([])

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
    useEffect(() => {
        loadAllCertifitaces()
    },[])
    return (
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
    )
}