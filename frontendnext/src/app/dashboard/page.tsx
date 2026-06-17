import Transaction from './transaction';
import VerificationCard from './verificationCard';
import IssueCard from './issueCard';

export default function CertificateDashboard() {
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
          <IssueCard />
          <VerificationCard />
          <Transaction />
        </div>
      </main>
    </div>
  );
}