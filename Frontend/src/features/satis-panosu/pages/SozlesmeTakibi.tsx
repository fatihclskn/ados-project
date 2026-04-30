import { type ReactNode, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type ColorName = 'gray' | 'sky' | 'violet' | 'emerald' | 'teal' | 'rose' | 'amber' | 'indigo';
type ContractsTab = 'process' | 'active';
type ContractStatus =
  | 'stamp-pending'
  | 'sent-to-customer'
  | 'awaiting-signed'
  | 'awaiting-finance-review'
  | 'at-finance'
  | 'active'
  | 'completed';

type StampInfo = {
  companyName: string;
  taxNo: string;
  taxOffice: string;
  address: string;
  signerName: string;
  signerTitle: string;
  stampFile: string | null;
};

type Contract = {
  id: string;
  proposalId: string;
  customer: string;
  contact: string;
  segment: string;
  services: string[];
  monthlyTotal: number;
  oneTimeTotal: number;
  year1Total: number;
  originalTotal?: number;
  totalCost?: number;
  profitMargin?: number;
  createdAt: string;
  status: ContractStatus;
  stampInfo: StampInfo | null;
  customerSentAt: string | null;
  signedFile: string | null;
  signedFileUploadedAt: string | null;
  financeSubmittedAt: string | null;
  workStartedAt?: string | null;
  activatedAt?: string | null;
  kickoffCompletedAt?: string | null;
  completedAt?: string | null;
};

type OfferService = {
  id: string;
  name: string;
  icon: ReactNode;
};

const DAY = 24 * 60 * 60 * 1000;

const CM: Record<ColorName, { bg: string; t: string }> = {
  gray: { bg: 'bg-gray-50 dark:bg-gray-500/10', t: 'text-gray-700 dark:text-gray-300' },
  sky: { bg: 'bg-sky-50 dark:bg-sky-500/10', t: 'text-sky-700 dark:text-sky-300' },
  violet: { bg: 'bg-violet-50 dark:bg-violet-500/10', t: 'text-violet-700 dark:text-violet-300' },
  emerald: { bg: 'bg-emerald-50 dark:bg-emerald-500/10', t: 'text-emerald-700 dark:text-emerald-300' },
  teal: { bg: 'bg-teal-50 dark:bg-teal-500/10', t: 'text-teal-700 dark:text-teal-300' },
  rose: { bg: 'bg-rose-50 dark:bg-rose-500/10', t: 'text-rose-700 dark:text-rose-300' },
  amber: { bg: 'bg-amber-50 dark:bg-amber-500/10', t: 'text-amber-700 dark:text-amber-300' },
  indigo: { bg: 'bg-indigo-50 dark:bg-indigo-500/10', t: 'text-indigo-700 dark:text-indigo-300' },
};

const BORDER_ACTIVE: Record<ColorName, string> = {
  gray: 'border-gray-300 dark:border-gray-500/40',
  sky: 'border-sky-300 dark:border-sky-500/40',
  violet: 'border-violet-300 dark:border-violet-500/40',
  emerald: 'border-emerald-300 dark:border-emerald-500/40',
  teal: 'border-teal-300 dark:border-teal-500/40',
  rose: 'border-rose-300 dark:border-rose-500/40',
  amber: 'border-amber-300 dark:border-amber-500/40',
  indigo: 'border-indigo-300 dark:border-indigo-500/40',
};

const EMPTY_STAMP_FORM: StampInfo = {
  companyName: '',
  taxNo: '',
  taxOffice: '',
  address: '',
  signerName: '',
  signerTitle: '',
  stampFile: null,
};

const OFFER_SERVICES: OfferService[] = [
  { id: 'web', name: 'Web Sitesi', icon: <><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></> },
  { id: 'seo', name: 'SEO', icon: <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></> },
  { id: 'google-ads', name: 'Google Ads', icon: <><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></> },
  { id: 'social-media', name: 'Sosyal Medya Yönetimi', icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></> },
  { id: 'social-ads', name: 'Sosyal Medya Reklam Yönetimi', icon: <><path d="M3 11l18-5v12L3 14v-3z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" /></> },
  { id: 'production', name: 'Prodüksiyon & Fotoğraf', icon: <><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></> },
  { id: 'domain', name: 'Domain', icon: <><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /></> },
  { id: 'hosting', name: 'Hosting & Sunucu', icon: <><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /></> },
];

const INITIAL_CONTRACTS: Contract[] = [
  { id: 'SZL-2026-3204', proposalId: 'TKLF-2026-4805', customer: 'Maya Kozmetik A.Ş.', contact: 'Burak Şahin', segment: 'E-Ticaret', services: ['web', 'seo', 'social-media', 'production'], monthlyTotal: 28500, oneTimeTotal: 115000, year1Total: 457000, originalTotal: 480000, totalCost: 210000, profitMargin: 54, createdAt: new Date(Date.now() - 45 * DAY).toISOString(), status: 'active', stampInfo: { companyName: 'Maya Kozmetik A.Ş.', taxNo: '1234567890', taxOffice: 'Beşiktaş', address: 'Levent Mah. Büyükdere Cd. No:123/45 Şişli/İstanbul', signerName: 'Burak Şahin', signerTitle: 'Genel Müdür', stampFile: 'mkc-kase.png' }, customerSentAt: new Date(Date.now() - 44 * DAY).toISOString(), signedFile: 'mkc-szl-imzali.pdf', signedFileUploadedAt: new Date(Date.now() - 42 * DAY).toISOString(), financeSubmittedAt: new Date(Date.now() - 41 * DAY).toISOString(), workStartedAt: new Date(Date.now() - 41 * DAY).toISOString(), activatedAt: new Date(Date.now() - 40 * DAY).toISOString(), kickoffCompletedAt: new Date(Date.now() - 38 * DAY).toISOString() },
  { id: 'SZL-2026-3198', proposalId: 'TKLF-2026-4798', customer: 'Orion Eğitim Kurumları', contact: 'Nilgün Demir', segment: 'Eğitim', services: ['web', 'seo', 'google-ads'], monthlyTotal: 12500, oneTimeTotal: 65000, year1Total: 215000, originalTotal: 230000, totalCost: 95000, profitMargin: 56, createdAt: new Date(Date.now() - 2 * DAY).toISOString(), status: 'at-finance', stampInfo: { companyName: 'Orion Eğitim Kurumları A.Ş.', taxNo: '9876543210', taxOffice: 'Kadıköy', address: 'Bağdat Cd. No:234 Kadıköy/İstanbul', signerName: 'Nilgün Demir', signerTitle: 'Yönetim Kurulu Başkanı', stampFile: 'orion-kase.png' }, customerSentAt: new Date(Date.now() - 1.5 * DAY).toISOString(), signedFile: 'orion-szl-imzali.pdf', signedFileUploadedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), financeSubmittedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), workStartedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), activatedAt: null, kickoffCompletedAt: null },
  { id: 'SZL-2026-3195', proposalId: 'TKLF-2026-4791', customer: 'BestTaste Restoran', contact: 'Ömer Kaya', segment: 'Gastronomi', services: ['social-media', 'social-ads', 'production'], monthlyTotal: 18000, oneTimeTotal: 35000, year1Total: 251000, createdAt: new Date(Date.now() - 1 * DAY).toISOString(), status: 'awaiting-signed', stampInfo: { companyName: 'BestTaste Gıda Hiz. Ltd. Şti.', taxNo: '5555555555', taxOffice: 'Ataşehir', address: 'Barbaros Mah. Mimar Sinan Cd. Palladium AVM · Ataşehir/İstanbul', signerName: 'Ömer Kaya', signerTitle: 'Kurucu Ortak', stampFile: 'besttaste-kase.png' }, customerSentAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(), signedFile: null, signedFileUploadedAt: null, financeSubmittedAt: null, completedAt: null },
  { id: 'SZL-2026-3192', proposalId: 'TKLF-2026-4786', customer: 'Alpha Lojistik', contact: 'Hakan Tekin', segment: 'Lojistik', services: ['web', 'hosting'], monthlyTotal: 1200, oneTimeTotal: 48000, year1Total: 62400, createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), status: 'sent-to-customer', stampInfo: { companyName: 'Alpha Lojistik Hizmetleri A.Ş.', taxNo: '1111222233', taxOffice: 'Bakırköy', address: 'Ataköy 7-8. Kısım Kültür Sk. No:5 Bakırköy/İstanbul', signerName: 'Hakan Tekin', signerTitle: 'İcra Kurulu Başkanı', stampFile: 'alpha-kase.png' }, customerSentAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(), signedFile: null, signedFileUploadedAt: null, financeSubmittedAt: null, completedAt: null },
  { id: 'SZL-2026-3189', proposalId: 'TKLF-2026-4782', customer: 'Vitra Mimarlık', contact: 'Ayşegül Can', segment: 'Mimari', services: ['web', 'seo', 'production'], monthlyTotal: 8500, oneTimeTotal: 85000, year1Total: 187000, createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), status: 'stamp-pending', stampInfo: null, customerSentAt: null, signedFile: null, signedFileUploadedAt: null, financeSubmittedAt: null, completedAt: null },
];

function Icon({ children, className = 'w-3.5 h-3.5' }: { children: ReactNode; className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      {children}
    </svg>
  );
}

function serviceById(id: string) {
  return OFFER_SERVICES.find((service) => service.id === id) ?? { id, name: id, icon: <rect x="3" y="3" width="18" height="18" rx="2" /> };
}

function getTimeAgo(date: Date) {
  const diff = (Date.now() - date.getTime()) / 1000;
  if (diff < 60) return 'az önce';
  if (diff < 3600) return `${Math.floor(diff / 60)} dk önce`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} saat önce`;
  return `${Math.floor(diff / 86400)} gün önce`;
}

function statusInfo(status: ContractStatus) {
  const map: Record<ContractStatus, { l: string; c: ColorName; step: number; icon: ReactNode }> = {
    'stamp-pending': { l: 'Kaşe Bilgileri Bekleniyor', c: 'amber', step: 1, icon: <><path d="M12 2v4" /><path d="M12 18v4" /><path d="M4.93 4.93l2.83 2.83" /><path d="M16.24 16.24l2.83 2.83" /><circle cx="12" cy="12" r="6" /></> },
    'sent-to-customer': { l: 'Müşteride · İmza Bekleniyor', c: 'violet', step: 2, icon: <><path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4 20-7z" /></> },
    'awaiting-signed': { l: 'İmzalı Yüklenmesi Bekleniyor', c: 'rose', step: 3, icon: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /></> },
    'awaiting-finance-review': { l: 'Finans Onayına Hazır', c: 'sky', step: 4, icon: <><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></> },
    'at-finance': { l: 'Finansta', c: 'sky', step: 5, icon: <><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></> },
    active: { l: 'Aktif İş Sürecinde', c: 'emerald', step: 5, icon: <polyline points="20 6 9 17 4 12" /> },
    completed: { l: 'Tamamlandı', c: 'emerald', step: 5, icon: <polyline points="20 6 9 17 4 12" /> },
  };
  return map[status];
}

function Field({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  return (
    <div>
      <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1.5 block">{label} {required ? <span className="text-rose-500">*</span> : null}</label>
      {children}
    </div>
  );
}

export default function SozlesmeTakibi() {
  const navigate = useNavigate();
  const [contracts, setContracts] = useState<Contract[]>(INITIAL_CONTRACTS);
  const [contractsFilter, setContractsFilter] = useState<ContractStatus | 'all'>('all');
  const [contractsSearch, setContractsSearch] = useState('');
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);
  const [contractsTab, setContractsTab] = useState<ContractsTab>('process');
  const [stampForm, setStampForm] = useState<StampInfo>(EMPTY_STAMP_FORM);
  const [signedFileForm, setSignedFileForm] = useState<string | null>(null);

  const selectedContract = selectedContractId ? contracts.find((contract) => contract.id === selectedContractId) : null;

  const openContractDetail = (id: string) => {
    setSelectedContractId(id);
    setTimeout(() => document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' }), 0);
  };

  const closeContractDetail = () => setSelectedContractId(null);

  const updateContract = (id: string, patch: Partial<Contract>) => {
    setContracts((current) => current.map((contract) => contract.id === id ? { ...contract, ...patch } : contract));
  };

  const saveStampAndSendContract = (contract: Contract) => {
    if (!stampForm.companyName || !stampForm.taxNo || !stampForm.signerName) return;
    updateContract(contract.id, { stampInfo: { ...stampForm }, status: 'sent-to-customer', customerSentAt: new Date().toISOString() });
    setStampForm(EMPTY_STAMP_FORM);
  };

  const submitSignedContract = (contract: Contract) => {
    if (!signedFileForm) return;
    updateContract(contract.id, { signedFile: signedFileForm, signedFileUploadedAt: new Date().toISOString(), status: 'awaiting-finance-review' });
    setSignedFileForm(null);
  };

  const sendToFinance = (contract: Contract) => {
    updateContract(contract.id, { status: 'at-finance', financeSubmittedAt: new Date().toISOString(), workStartedAt: new Date().toISOString() });
    setContractsTab('active');
    setContractsFilter('all');
    setSelectedContractId(null);
  };

  const completeContract = (contract: Contract) => {
    updateContract(contract.id, { status: 'active', activatedAt: new Date().toISOString(), workStartedAt: contract.workStartedAt || new Date().toISOString() });
  };

  if (selectedContract) {
    return (
      <ContractDetailView
        closeContractDetail={closeContractDetail}
        completeContract={completeContract}
        contract={selectedContract}
        contractsTab={contractsTab}
        navigate={navigate}
        removeStampFile={() => setStampForm((current) => ({ ...current, stampFile: null }))}
        saveStampAndSendContract={saveStampAndSendContract}
        sendToFinance={sendToFinance}
        setSignedFileForm={setSignedFileForm}
        setStampForm={setStampForm}
        signedFileForm={signedFileForm}
        simulateCustomerSigned={(contract) => updateContract(contract.id, { status: 'awaiting-signed' })}
        stampForm={stampForm}
        submitSignedContract={submitSignedContract}
      />
    );
  }

  const processStatuses: ContractStatus[] = ['stamp-pending', 'sent-to-customer', 'awaiting-signed', 'awaiting-finance-review'];
  const activeStatuses: ContractStatus[] = ['at-finance', 'active'];
  const processContracts = contracts.filter((contract) => processStatuses.includes(contract.status));
  const activeContracts = contracts.filter((contract) => activeStatuses.includes(contract.status));
  const stats = {
    total: contracts.length,
    stampPending: contracts.filter((contract) => contract.status === 'stamp-pending').length,
    sentToCustomer: contracts.filter((contract) => contract.status === 'sent-to-customer').length,
    awaitingSigned: contracts.filter((contract) => contract.status === 'awaiting-signed').length,
    readyForFinance: contracts.filter((contract) => contract.status === 'awaiting-finance-review').length,
    atFinance: contracts.filter((contract) => contract.status === 'at-finance').length,
    active: contracts.filter((contract) => contract.status === 'active').length,
  };
  const totalMRR = activeContracts.reduce((a, c) => a + c.monthlyTotal, 0);

  const visibleContracts = (contractsTab === 'process' ? processContracts : activeContracts).filter((contract) => {
    if (contractsFilter !== 'all' && contract.status !== contractsFilter) return false;
    if (!contractsSearch) return true;
    const q = contractsSearch.toLowerCase();
    return contract.customer.toLowerCase().includes(q) || contract.id.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-2xl border border-sky-300/40 dark:border-sky-500/30 shadow-lg">
        <div className="relative bg-gradient-to-br from-[#0a1a2e] via-[#10253d] to-[#0a1a2e] p-5 md:p-6">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-sky-500/25 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)', backgroundSize: '40px 40px' }}></div>
          <div className="relative flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-sky-400 to-sky-600 rounded-xl blur-md opacity-60"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-sky-400 via-sky-500 to-sky-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Icon className="text-white w-6 h-6"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></Icon>
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold tracking-[0.2em] text-sky-300 uppercase">ADOS Sözleşme Takibi</div>
                <h2 className="text-[24px] md:text-[28px] font-black leading-tight">
                  <span className="bg-gradient-to-r from-sky-200 via-white to-sky-200 bg-clip-text text-transparent">Aktif Sözleşmeler</span>
                </h2>
                <p className="text-[11px] text-white/70 mt-0.5">{processContracts.length} işlem sürecinde · {activeContracts.length} aktif sözleşme · ₺{Math.round(totalMRR / 1000)}K aylık MRR</p>
              </div>
            </div>
          </div>
        </div>
        <div className="h-0.5 bg-gradient-to-r from-sky-500 via-emerald-300 to-sky-500"></div>
      </div>

      <div className="flex items-center gap-1 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-1">
        <button onClick={() => { setContractsTab('process'); setContractsFilter('all'); }} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-[12px] font-bold transition-all ${contractsTab === 'process' ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
          <Icon className="w-4 h-4"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></Icon>
          Sözleşme Sürecindeki İşlemler
          <span className={`text-[10px] px-1.5 py-0.5 rounded ${contractsTab === 'process' ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-700'}`}>{processContracts.length}</span>
        </button>
        <button onClick={() => { setContractsTab('active'); setContractsFilter('all'); }} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-[12px] font-bold transition-all ${contractsTab === 'active' ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
          <Icon className="w-4 h-4"><polyline points="20 6 9 17 4 12" /></Icon>
          Aktif Sözleşmeler
          <span className={`text-[10px] px-1.5 py-0.5 rounded ${contractsTab === 'active' ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-700'}`}>{activeContracts.length}</span>
        </button>
      </div>

      {contractsTab === 'process' ? (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {[
            { l: 'Tümü', v: processContracts.length, c: 'gray' as ColorName, f: 'all' as const },
            { l: 'Kaşe Bekliyor', v: stats.stampPending, c: 'amber' as ColorName, f: 'stamp-pending' as const },
            { l: 'Müşteride', v: stats.sentToCustomer, c: 'violet' as ColorName, f: 'sent-to-customer' as const },
            { l: 'İmza Bekliyor', v: stats.awaitingSigned, c: 'rose' as ColorName, f: 'awaiting-signed' as const },
            { l: 'Finansa Hazır', v: stats.readyForFinance, c: 'sky' as ColorName, f: 'awaiting-finance-review' as const },
          ].map((st) => <StatFilterCard key={st.f} active={contractsFilter === st.f} color={st.c} label={st.l} onClick={() => setContractsFilter(st.f)} value={st.v} />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { l: 'Tümü', v: activeContracts.length, c: 'gray' as ColorName, f: 'all' as const },
            { l: 'Finansta · Onay Bekliyor', v: stats.atFinance, c: 'sky' as ColorName, f: 'at-finance' as const },
            { l: 'Aktif İş Sürecinde', v: stats.active, c: 'emerald' as ColorName, f: 'active' as const },
          ].map((st) => <StatFilterCard key={st.f} active={contractsFilter === st.f} color={st.c} label={st.l} onClick={() => setContractsFilter(st.f)} value={st.v} />)}
          <div className="p-3 rounded-xl border transition-all text-left bg-white dark:bg-[#1e1f26] border-gray-200 dark:border-gray-600/50">
            <div className="text-[20px] font-bold text-gray-900 dark:text-gray-100 leading-none">₺{Math.round(totalMRR / 1000)}K</div>
            <div className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 mt-1">Aylık MRR</div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-3 flex items-center gap-2 flex-wrap">
        <div className="flex-1 min-w-[200px] relative">
          <Icon className="text-gray-400 dark:text-gray-500 w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></Icon>
          <input type="text" onChange={(event) => setContractsSearch(event.target.value)} placeholder="Sözleşme no, müşteri adı ara..." value={contractsSearch} className="w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-gray-600/50 bg-white dark:bg-[#23242c] text-gray-900 dark:text-gray-100 rounded-lg text-[12px] focus:outline-none focus:border-sky-500 placeholder:text-gray-400 dark:placeholder:text-gray-500" />
        </div>
      </div>

      <div data-contracts-list className="space-y-2">
        {visibleContracts.length === 0 ? (
          <EmptyList active={contractsTab === 'active'} />
        ) : visibleContracts.map((contract) => contractsTab === 'process'
          ? <ProcessContractRow key={contract.id} contract={contract} onOpen={openContractDetail} />
          : <ActiveContractRow key={contract.id} contract={contract} onOpen={openContractDetail} />)}
      </div>
    </div>
  );
}

function StatFilterCard({ label, value, color, active, onClick }: { label: string; value: ReactNode; color: ColorName; active: boolean; onClick: () => void }) {
  const cm = CM[color] || CM.gray;
  return (
    <button onClick={onClick} className={`p-3 rounded-xl border transition-all text-left ${active ? `${cm.bg} ${BORDER_ACTIVE[color]} shadow-sm` : 'bg-white dark:bg-[#1e1f26] border-gray-200 dark:border-gray-600/50 hover:border-gray-300 dark:hover:border-gray-500/40'}`}>
      <div className={`text-[20px] font-bold ${active ? cm.t : 'text-gray-900 dark:text-gray-100'} leading-none`}>{value}</div>
      <div className={`text-[10px] font-semibold ${active ? `${cm.t} opacity-80` : 'text-gray-500 dark:text-gray-400'} mt-1`}>{label}</div>
    </button>
  );
}

function EmptyList({ active }: { active: boolean }) {
  return (
    <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-12 text-center">
      <Icon className="text-gray-300 dark:text-gray-600 w-12 h-12 mx-auto mb-3">{active ? <polyline points="20 6 9 17 4 12" /> : <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>}</Icon>
      <p className="text-[13px] font-bold text-gray-700 dark:text-gray-300">{active ? 'Aktif sözleşme yok' : 'Süreçte sözleşme yok'}</p>
      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{active ? 'Finans onayından geçen sözleşmeler burada görünür' : 'Onaylanan teklifler otomatik olarak buraya gelecek'}</p>
    </div>
  );
}

function ProcessContractRow({ contract, onOpen }: { contract: Contract; onOpen: (id: string) => void }) {
  const st = statusInfo(contract.status);
  const stcm = CM[st.c] || CM.gray;
  const createdAgo = getTimeAgo(new Date(contract.createdAt));
  return (
    <div onClick={() => onOpen(contract.id)} className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-4 hover:border-sky-300 dark:hover:border-sky-500/40 hover:shadow-md transition-all cursor-pointer">
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
          <span className="text-white text-[14px] font-bold">{(contract.customer || 'X').charAt(0)}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h4 className="text-[13px] font-bold text-gray-900 dark:text-gray-100 truncate">{contract.customer}</h4>
            <span className="text-[9px] font-mono text-gray-500 dark:text-gray-500">{contract.id}</span>
            <span className={`px-1.5 py-0.5 ${stcm.bg} ${BORDER_ACTIVE[st.c]} border rounded text-[9px] font-bold ${stcm.t} flex items-center gap-1`}>
              <Icon className="w-2.5 h-2.5">{st.icon}</Icon>{st.l}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400 mb-2">
            <span>{contract.contact}</span>
            <span className="text-gray-300 dark:text-gray-600">·</span>
            <span>{contract.services.length} hizmet</span>
            <span className="text-gray-300 dark:text-gray-600">·</span>
            <span>{createdAgo} oluşturuldu</span>
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((i) => {
              const done = i <= st.step;
              const current = i === st.step;
              return <div key={i} className="flex items-center gap-0.5 flex-1"><div className={`h-1 flex-1 rounded-full ${done ? (current ? `bg-gradient-to-r from-${st.c}-400 to-${st.c}-600` : `bg-${st.c}-500`) : 'bg-gray-200 dark:bg-gray-700'}`}></div></div>;
            })}
            <span className={`text-[9px] font-bold ${stcm.t} ml-1.5 whitespace-nowrap`}>Aşama {st.step}/5</span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-[16px] font-bold text-gray-900 dark:text-gray-100 leading-tight">₺{Math.round(contract.year1Total / 1000)}K</div>
          <div className="text-[9px] text-gray-500 dark:text-gray-400">1. yıl bedeli</div>
        </div>
        <Icon className="text-gray-300 dark:text-gray-600 w-4 h-4 shrink-0 mt-1"><polyline points="9 18 15 12 9 6" /></Icon>
      </div>
    </div>
  );
}

function ActiveContractRow({ contract, onOpen }: { contract: Contract; onOpen: (id: string) => void }) {
  const st = statusInfo(contract.status);
  const stcm = CM[st.c] || CM.gray;
  const workDays = contract.workStartedAt ? Math.floor((Date.now() - new Date(contract.workStartedAt).getTime()) / DAY) : 0;
  const kickoffDone = Boolean(contract.kickoffCompletedAt);
  return (
    <div onClick={() => onOpen(contract.id)} className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-4 hover:border-emerald-300 dark:hover:border-emerald-500/40 hover:shadow-md transition-all cursor-pointer">
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
          <span className="text-white text-[14px] font-bold">{(contract.customer || 'X').charAt(0)}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h4 className="text-[13px] font-bold text-gray-900 dark:text-gray-100 truncate">{contract.customer}</h4>
            <span className="text-[9px] font-mono text-gray-500 dark:text-gray-500">{contract.id}</span>
            <span className={`px-1.5 py-0.5 ${stcm.bg} ${BORDER_ACTIVE[st.c]} border rounded text-[9px] font-bold ${stcm.t} flex items-center gap-1`}>
              <Icon className="w-2.5 h-2.5">{st.icon}</Icon>{st.l}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400 mb-2 flex-wrap">
            <span>{contract.contact}</span>
            <span className="text-gray-300 dark:text-gray-600">·</span>
            <span>{contract.services.length} hizmet</span>
            <span className="text-gray-300 dark:text-gray-600">·</span>
            {contract.workStartedAt ? <span className="flex items-center gap-1"><Icon className="text-emerald-500 w-2.5 h-2.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></Icon>İş günü <span className="font-bold text-emerald-700 dark:text-emerald-300">{workDays}</span></span> : null}
            {kickoffDone ? <><span className="text-gray-300 dark:text-gray-600">·</span><span className="text-emerald-700 dark:text-emerald-300 font-semibold">Kick-off tamam</span></> : null}
          </div>
          {contract.status === 'active' ? (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[9px] text-gray-500 dark:text-gray-400">Aktif:</span>
              {contract.services.slice(0, 4).map((sid) => <span key={sid} className="px-1.5 py-0.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded text-[9px] font-semibold text-emerald-700 dark:text-emerald-300">{serviceById(sid).name}</span>)}
              {contract.services.length > 4 ? <span className="text-[9px] text-gray-500">+{contract.services.length - 4}</span> : null}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-[10px] text-sky-700 dark:text-sky-300 font-semibold">
              <Icon className="w-3 h-3"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></Icon>
              Finans Panosu'nda onay bekleniyor
            </div>
          )}
        </div>
        <div className="text-right shrink-0">
          <div className="text-[16px] font-bold text-gray-900 dark:text-gray-100 leading-tight">₺{Math.round(contract.year1Total / 1000)}K</div>
          <div className="text-[9px] text-gray-500 dark:text-gray-400">{contract.profitMargin ? `Karlılık %${contract.profitMargin.toFixed(0)}` : '1. yıl bedeli'}</div>
          <div className="text-[9px] text-emerald-700 dark:text-emerald-300 font-bold mt-0.5">₺{contract.monthlyTotal.toLocaleString('tr-TR')}/ay MRR</div>
        </div>
        <Icon className="text-gray-300 dark:text-gray-600 w-4 h-4 shrink-0 mt-1"><polyline points="9 18 15 12 9 6" /></Icon>
      </div>
    </div>
  );
}

function ContractDetailView(props: {
  contract: Contract;
  contractsTab: ContractsTab;
  stampForm: StampInfo;
  signedFileForm: string | null;
  setStampForm: React.Dispatch<React.SetStateAction<StampInfo>>;
  removeStampFile: () => void;
  setSignedFileForm: (file: string | null) => void;
  closeContractDetail: () => void;
  saveStampAndSendContract: (contract: Contract) => void;
  simulateCustomerSigned: (contract: Contract) => void;
  submitSignedContract: (contract: Contract) => void;
  sendToFinance: (contract: Contract) => void;
  completeContract: (contract: Contract) => void;
  navigate: ReturnType<typeof useNavigate>;
}) {
  const { contract, contractsTab, closeContractDetail } = props;
  const svcs = contract.services.map(serviceById);
  const tabName = contractsTab === 'active' ? 'Aktif Sözleşmeler' : 'Sözleşme Süreci';
  const sm = statusInfo(contract.status);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <button onClick={closeContractDetail} className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 text-gray-700 dark:text-gray-300 rounded-lg text-[11px] font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <Icon className="w-3.5 h-3.5"><polyline points="15 18 9 12 15 6" /></Icon>
          {tabName}'a Dön
        </button>
        <div className="flex items-center gap-1.5 text-[10px] text-gray-400 dark:text-gray-500">
          <Icon className="w-3 h-3"><polyline points="9 18 15 12 9 6" /></Icon>
          <span className="font-mono">{contract.id}</span>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-sky-300/40 dark:border-sky-500/30 shadow-lg">
        <div className="relative bg-gradient-to-br from-[#0a1a2e] via-[#10253d] to-[#0a1a2e] p-5 md:p-6">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-sky-500/25 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)', backgroundSize: '40px 40px' }}></div>
          <div className="relative">
            <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
              <div>
                <div className="text-[10px] font-bold tracking-[0.2em] text-sky-300 uppercase">Sözleşme Detayı</div>
                <div className="text-[11px] text-white/60 font-mono">{contract.id} · Teklif: {contract.proposalId}</div>
              </div>
              <HeroStatus status={contract.status} />
            </div>
            <div className="mb-5">
              <h1 className="text-[24px] md:text-[30px] font-black leading-none tracking-tight mb-2">
                <span className="bg-gradient-to-r from-sky-200 via-white to-sky-200 bg-clip-text text-transparent">{contract.customer}</span>
              </h1>
              <p className="text-[12px] text-white/70">{contract.contact} · {contract.segment} · {svcs.length} hizmet · ₺{Math.round(contract.year1Total).toLocaleString('tr-TR')}</p>
            </div>
            <FiveStepProgress currentStep={sm.step} />
          </div>
        </div>
        <div className="h-0.5 bg-gradient-to-r from-sky-500 via-emerald-300 to-sky-500"></div>
      </div>

      {sm.step === 1 ? <StampInfoForm {...props} /> : null}
      {sm.step === 2 ? <AwaitingCustomerSignature {...props} /> : null}
      {sm.step === 3 ? <SignedUploadForm {...props} /> : null}
      {sm.step === 4 ? <FinanceApprovalStep {...props} /> : null}
      {sm.step === 5 && contract.status === 'at-finance' ? <AtFinanceView {...props} /> : null}
      {sm.step === 5 && contract.status === 'active' ? <ActiveContractDetail {...props} /> : null}
      {sm.step === 5 && contract.status === 'completed' ? <ContractCompleted {...props} /> : null}
    </div>
  );
}

function HeroStatus({ status }: { status: ContractStatus }) {
  if (status === 'active') return <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 border border-emerald-400/40 rounded-full"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span><span className="text-[10px] font-bold text-emerald-300 tracking-wider">AKTİF İŞ SÜRECİNDE</span></div>;
  if (status === 'at-finance') return <div className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-500/20 border border-sky-400/40 rounded-full"><span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-pulse"></span><span className="text-[10px] font-bold text-sky-300 tracking-wider">FİNANS PANOSUNDA</span></div>;
  if (status === 'completed') return <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 border border-emerald-400/40 rounded-full"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span><span className="text-[10px] font-bold text-emerald-300 tracking-wider">TAMAMLANDI</span></div>;
  return <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 border border-amber-400/40 rounded-full"><span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse"></span><span className="text-[10px] font-bold text-amber-300 tracking-wider">AKTİF SÜREÇ</span></div>;
}

function FiveStepProgress({ currentStep }: { currentStep: number }) {
  const steps = [
    { n: 1, label: 'Kaşe Bilgileri' },
    { n: 2, label: 'Müşteriye Gönderildi' },
    { n: 3, label: 'İmzalı Yüklendi' },
    { n: 4, label: 'Finans Onayı' },
    { n: 5, label: 'Tamamlandı' },
  ];
  return (
    <div className="flex items-center gap-1">
      {steps.map((st) => {
        const done = st.n < currentStep;
        const active = st.n === currentStep;
        const color = st.n === 5 ? 'emerald' : 'sky';
        return (
          <div key={st.n} className="flex-1 flex items-center gap-1">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${done ? 'bg-emerald-500 text-white' : active ? `bg-gradient-to-br from-${color}-400 to-${color}-600 text-white shadow-lg ring-2 ring-${color}-400/50` : 'bg-white/10 text-white/40 border border-white/20'}`}>{done ? '✓' : st.n}</div>
                <div className={`flex-1 h-1 rounded-full ${done ? 'bg-emerald-500' : active ? `bg-gradient-to-r from-${color}-400 to-white/20` : 'bg-white/10'}`}></div>
              </div>
              <p className={`text-[8px] font-bold ${active ? `text-${color}-300` : done ? 'text-emerald-300' : 'text-white/40'} uppercase tracking-wider truncate pr-1`}>{st.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function StampInfoForm({ contract, stampForm, setStampForm, removeStampFile, closeContractDetail, saveStampAndSendContract }: Parameters<typeof ContractDetailView>[0]) {
  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-xl border border-amber-300 dark:border-amber-500/40 bg-gradient-to-br from-amber-50 to-yellow-50/60 dark:from-amber-500/10 dark:to-yellow-500/5 p-4">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-400/15 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative flex items-start gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center shrink-0 shadow-md">
            <Icon className="text-white w-5 h-5"><path d="M12 2v4" /><path d="M12 18v4" /><path d="M4.93 4.93l2.83 2.83" /><path d="M16.24 16.24l2.83 2.83" /><circle cx="12" cy="12" r="6" /></Icon>
          </div>
          <div className="flex-1">
            <p className="text-[13px] font-bold text-amber-900 dark:text-amber-200">Aşama 1 · Kaşe Bilgileri</p>
            <p className="text-[11px] text-amber-700 dark:text-amber-300 leading-relaxed mt-0.5">Müşterinin resmi sözleşmede yer alacak <span className="font-bold">firma kaşe bilgilerini</span> girin. Bu bilgiler sözleşme şablonuna otomatik yerleştirilir ve müşteriye imzalı versiyon için gönderilir.</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700/40">
          <h4 className="text-[14px] font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Icon className="text-sky-600 dark:text-sky-400 w-4 h-4"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></Icon>
            Firma Kaşe ve İmza Bilgileri
          </h4>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">Sözleşmede yer alacak yetkili bilgileri</p>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Firma Tam Ünvanı" required><input type="text" value={stampForm.companyName} onChange={(e) => setStampForm((f) => ({ ...f, companyName: e.target.value }))} placeholder="Örn: Arma Digital Ajans A.Ş." className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600/50 bg-white dark:bg-[#23242c] text-gray-900 dark:text-gray-100 rounded-lg text-[12px] focus:outline-none focus:border-sky-500 placeholder:text-gray-400 dark:placeholder:text-gray-500" /></Field>
            <Field label="Vergi Numarası" required><input type="text" value={stampForm.taxNo} onChange={(e) => setStampForm((f) => ({ ...f, taxNo: e.target.value }))} placeholder="10 haneli" maxLength={11} className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600/50 bg-white dark:bg-[#23242c] text-gray-900 dark:text-gray-100 rounded-lg text-[12px] font-mono focus:outline-none focus:border-sky-500 placeholder:text-gray-400 dark:placeholder:text-gray-500" /></Field>
          </div>
          <Field label="Vergi Dairesi"><input type="text" value={stampForm.taxOffice} onChange={(e) => setStampForm((f) => ({ ...f, taxOffice: e.target.value }))} placeholder="Örn: Beşiktaş Vergi Dairesi" className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600/50 bg-white dark:bg-[#23242c] text-gray-900 dark:text-gray-100 rounded-lg text-[12px] focus:outline-none focus:border-sky-500 placeholder:text-gray-400 dark:placeholder:text-gray-500" /></Field>
          <Field label="Adres"><textarea value={stampForm.address} onChange={(e) => setStampForm((f) => ({ ...f, address: e.target.value }))} placeholder="Tam açık adres · mahalle, cadde, no, ilçe, il" rows={2} className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600/50 bg-white dark:bg-[#23242c] text-gray-900 dark:text-gray-100 rounded-lg text-[12px] focus:outline-none focus:border-sky-500 resize-none placeholder:text-gray-400 dark:placeholder:text-gray-500" /></Field>

          <div className="pt-3 border-t border-gray-100 dark:border-gray-700/40">
            <h5 className="text-[12px] font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <Icon className="text-sky-600 dark:text-sky-400 w-3.5 h-3.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></Icon>
              İmza Yetkili Kişi
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Ad Soyad" required><input type="text" value={stampForm.signerName} onChange={(e) => setStampForm((f) => ({ ...f, signerName: e.target.value }))} placeholder="Örn: Mehmet Yılmaz" className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600/50 bg-white dark:bg-[#23242c] text-gray-900 dark:text-gray-100 rounded-lg text-[12px] focus:outline-none focus:border-sky-500 placeholder:text-gray-400 dark:placeholder:text-gray-500" /></Field>
              <Field label="Ünvanı"><input type="text" value={stampForm.signerTitle} onChange={(e) => setStampForm((f) => ({ ...f, signerTitle: e.target.value }))} placeholder="Örn: Genel Müdür, Yönetim Kurulu Başkanı" className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600/50 bg-white dark:bg-[#23242c] text-gray-900 dark:text-gray-100 rounded-lg text-[12px] focus:outline-none focus:border-sky-500 placeholder:text-gray-400 dark:placeholder:text-gray-500" /></Field>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 dark:border-gray-700/40">
            <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1.5 block flex items-center gap-1.5">
              <Icon className="text-sky-600 dark:text-sky-400 w-3.5 h-3.5"><circle cx="12" cy="12" r="10" /><polyline points="16 12 12 8 8 12" /><line x1="12" y1="16" x2="12" y2="8" /></Icon>
              Firma Kaşe / Logo Yükle <span className="font-normal text-gray-500">· opsiyonel</span>
            </label>
            {stampForm.stampFile ? (
              <div className="p-3 bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/30 rounded-xl flex items-center gap-3">
                <div className="w-10 h-10 bg-sky-600 rounded-lg flex items-center justify-center shrink-0"><Icon className="text-white w-5 h-5"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></Icon></div>
                <div className="flex-1 min-w-0"><p className="text-[12px] font-bold text-sky-900 dark:text-sky-200 truncate">{stampForm.stampFile}</p><p className="text-[10px] text-sky-700 dark:text-sky-400">Kaşe yüklendi · sözleşme PDF'inde kullanılacak</p></div>
                <button onClick={removeStampFile} className="shrink-0 p-1.5 rounded-lg hover:bg-sky-200 dark:hover:bg-sky-500/20 text-sky-700 dark:text-sky-300 transition-colors"><Icon className="w-4 h-4"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Icon></button>
              </div>
            ) : (
              <label className="cursor-pointer block">
                <div className="p-5 border-2 border-dashed border-gray-300 dark:border-gray-600/60 rounded-xl text-center hover:border-sky-400 dark:hover:border-sky-500/60 hover:bg-sky-50/30 dark:hover:bg-sky-500/5 transition-all">
                  <Icon className="text-gray-400 dark:text-gray-500 w-7 h-7 mx-auto mb-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></Icon>
                  <p className="text-[12px] font-bold text-gray-700 dark:text-gray-300 mb-0.5">Kaşe veya logo yükleyin</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">PNG, JPG veya SVG · 300 dpi · max 5MB</p>
                </div>
                <input type="file" accept="image/*,.svg" onChange={(e) => setStampForm((f) => ({ ...f, stampFile: e.target.files?.[0]?.name || null }))} className="hidden" />
              </label>
            )}
          </div>
        </div>
      </div>

      {stampForm.companyName && stampForm.signerName ? <StampPreview stampForm={stampForm} /> : null}

      <div className="flex items-center justify-between gap-3">
        <button onClick={closeContractDetail} className="px-4 py-2.5 text-[12px] font-semibold text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600/50 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">İptal · Listeye Dön</button>
        <button onClick={() => saveStampAndSendContract(contract)} className="relative overflow-hidden px-5 py-2.5 bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500 text-white rounded-lg font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 text-[12px]">
          <Icon className="w-4 h-4"><path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4 20-7z" /></Icon>
          Kaşeyi Kaydet ve Müşteriye Gönder
        </button>
      </div>
    </div>
  );
}

function StampPreview({ stampForm }: { stampForm: StampInfo }) {
  return (
    <div className="bg-gradient-to-br from-sky-50 to-indigo-50/60 dark:from-sky-500/10 dark:to-indigo-500/5 border border-sky-200 dark:border-sky-500/30 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="text-sky-600 dark:text-sky-400 w-4 h-4"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></Icon>
        <h5 className="text-[12px] font-bold text-sky-900 dark:text-sky-200">Sözleşme Önizleme · Kaşe Alanı</h5>
      </div>
      <div className="p-4 bg-white dark:bg-[#23242c] border-2 border-dashed border-sky-300 dark:border-sky-500/40 rounded-lg font-serif">
        <p className="text-[11px] text-gray-700 dark:text-gray-300 leading-relaxed">
          <span className="font-bold">{stampForm.companyName || '[Firma Ünvanı]'}</span>{stampForm.taxNo ? <><br /><span className="text-[10px] text-gray-600 dark:text-gray-400">Vergi No: {stampForm.taxNo}</span></> : null}{stampForm.taxOffice ? <> · <span className="text-[10px] text-gray-600 dark:text-gray-400">{stampForm.taxOffice} V.D.</span></> : null}{stampForm.address ? <><br /><span className="text-[10px] text-gray-600 dark:text-gray-400">{stampForm.address}</span></> : null}
        </p>
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700/50 flex items-center justify-between gap-3">
          <div><p className="text-[10px] text-gray-500 dark:text-gray-400">İmza Yetkilisi</p><p className="text-[12px] font-bold text-gray-900 dark:text-gray-100">{stampForm.signerName}</p>{stampForm.signerTitle ? <p className="text-[10px] text-gray-600 dark:text-gray-400">{stampForm.signerTitle}</p> : null}</div>
          {stampForm.stampFile ? <div className="w-16 h-16 bg-sky-100 dark:bg-sky-500/20 border-2 border-dashed border-sky-300 dark:border-sky-500/40 rounded-full flex items-center justify-center text-[8px] text-sky-600 dark:text-sky-400 font-bold text-center">KAŞE<br />YÜKLENDİ</div> : <div className="w-16 h-16 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-full flex items-center justify-center text-[8px] text-gray-400 dark:text-gray-500 font-semibold text-center">KAŞE<br />ALANI</div>}
        </div>
      </div>
    </div>
  );
}

function StampInfoSummary({ contract }: { contract: Contract }) {
  if (!contract.stampInfo) return null;
  const s = contract.stampInfo;
  return (
    <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
      <div className="p-3 border-b border-gray-100 dark:border-gray-700/40 flex items-center gap-2">
        <Icon className="text-sky-600 dark:text-sky-400 w-3.5 h-3.5"><path d="M12 2v4" /><path d="M12 18v4" /><path d="M4.93 4.93l2.83 2.83" /><path d="M16.24 16.24l2.83 2.83" /><circle cx="12" cy="12" r="6" /></Icon>
        <h5 className="text-[12px] font-bold text-gray-900 dark:text-gray-100">Kaşe Bilgileri</h5>
      </div>
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
        <div><span className="text-gray-500 dark:text-gray-400">Firma:</span> <span className="font-bold text-gray-900 dark:text-gray-100">{s.companyName}</span></div>
        <div><span className="text-gray-500 dark:text-gray-400">Vergi No:</span> <span className="font-mono font-bold text-gray-900 dark:text-gray-100">{s.taxNo}</span></div>
        {s.taxOffice ? <div><span className="text-gray-500 dark:text-gray-400">V.D.:</span> <span className="font-bold text-gray-900 dark:text-gray-100">{s.taxOffice}</span></div> : null}
        <div><span className="text-gray-500 dark:text-gray-400">İmza Yetkilisi:</span> <span className="font-bold text-gray-900 dark:text-gray-100">{s.signerName}{s.signerTitle ? ` · ${s.signerTitle}` : ''}</span></div>
        {s.address ? <div className="md:col-span-2"><span className="text-gray-500 dark:text-gray-400">Adres:</span> <span className="text-gray-700 dark:text-gray-300">{s.address}</span></div> : null}
      </div>
    </div>
  );
}

function AwaitingCustomerSignature({ contract, simulateCustomerSigned }: Parameters<typeof ContractDetailView>[0]) {
  const sentAt = contract.customerSentAt ? new Date(contract.customerSentAt).toLocaleString('tr-TR') : '';
  const hoursAgo = contract.customerSentAt ? Math.floor((Date.now() - new Date(contract.customerSentAt).getTime()) / (60 * 60 * 1000)) : 0;
  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-2xl border-2 border-violet-400/60 dark:border-violet-500/40 shadow-xl">
        <div className="relative bg-gradient-to-br from-[#1a0e3a] via-[#2a1550] to-[#1a0e3a] p-6">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-violet-500/30 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative text-center">
            <div className="inline-flex relative mb-3"><div className="absolute inset-0 bg-violet-500 rounded-full blur-xl opacity-40 animate-pulse"></div><div className="relative w-16 h-16 bg-gradient-to-br from-violet-400 to-violet-600 rounded-full flex items-center justify-center shadow-2xl"><Icon className="text-white w-8 h-8"><path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4 20-7z" /></Icon></div></div>
            <h2 className="text-[22px] font-black text-white mb-1"><span className="bg-gradient-to-r from-violet-200 via-white to-violet-200 bg-clip-text text-transparent">Müşteride İmza Bekleniyor</span></h2>
            <p className="text-[12px] text-white/70">Sözleşme müşteriye iletildi · {hoursAgo} saat önce ({sentAt})</p>
          </div>
        </div>
        <div className="h-1 bg-gradient-to-r from-violet-500 via-amber-300 to-violet-500"></div>
      </div>
      <StampInfoSummary contract={contract} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <ActionCard color="violet" icon={<><path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4 20-7z" /></>} title="Hatırlatma Gönder" desc="Müşteriyi imza için takibe al" />
        <ActionCard color="sky" icon={<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07" />} title="Telefonla Ara" desc="Müşteriyi direkt arama planla" />
        <button onClick={() => simulateCustomerSigned(contract)} className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-500/10 dark:to-teal-500/5 border border-emerald-300 dark:border-emerald-500/40 rounded-xl text-left hover:border-emerald-500 transition-all">
          <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center mb-2 shadow-sm"><Icon className="text-white w-4 h-4"><polyline points="20 6 9 17 4 12" /></Icon></div>
          <h5 className="text-[12px] font-bold text-emerald-900 dark:text-emerald-200">Müşteri İmzaladı</h5>
          <p className="text-[10px] text-emerald-700 dark:text-emerald-400">Demo: bir sonraki aşama</p>
        </button>
      </div>
    </div>
  );
}

function SignedUploadForm({ contract, signedFileForm, setSignedFileForm, closeContractDetail, submitSignedContract }: Parameters<typeof ContractDetailView>[0]) {
  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-xl border border-rose-300 dark:border-rose-500/40 bg-gradient-to-br from-rose-50 to-pink-50/60 dark:from-rose-500/10 dark:to-pink-500/5 p-4">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-rose-400/15 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative flex items-start gap-3"><div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-rose-600 rounded-lg flex items-center justify-center shrink-0 shadow-md"><Icon className="text-white w-5 h-5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></Icon></div><div className="flex-1"><p className="text-[13px] font-bold text-rose-900 dark:text-rose-200">Aşama 3 · İmzalı Sözleşmeyi Yükle</p><p className="text-[11px] text-rose-700 dark:text-rose-300 leading-relaxed mt-0.5">Müşteri sözleşmeyi imzaladı. İmzalı ve kaşeli versiyonu PDF olarak yükleyin. Yüklenen dosya finansa iletilecek.</p></div></div>
      </div>
      <StampInfoSummary contract={contract} />
      <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700/40"><h4 className="text-[14px] font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2"><Icon className="text-sky-600 dark:text-sky-400 w-4 h-4"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></Icon>İmzalı Sözleşme Dosyası</h4></div>
        <div className="p-5">
          {signedFileForm ? (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 border-2 border-emerald-200 dark:border-emerald-500/30 rounded-xl flex items-center gap-3">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shrink-0 shadow-md"><Icon className="text-white w-6 h-6"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><polyline points="9 13 11 15 15 11" /></Icon></div>
              <div className="flex-1 min-w-0"><p className="text-[14px] font-bold text-emerald-900 dark:text-emerald-200 truncate">{signedFileForm}</p><p className="text-[11px] text-emerald-700 dark:text-emerald-400">İmzalı sözleşme hazır · finansa gönderime hazırlanıyor</p></div>
              <button onClick={() => setSignedFileForm(null)} className="shrink-0 p-2 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 transition-colors"><Icon className="w-4 h-4"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Icon></button>
            </div>
          ) : (
            <label className="cursor-pointer block">
              <div className="p-8 border-2 border-dashed border-gray-300 dark:border-gray-600/60 rounded-xl text-center hover:border-sky-400 dark:hover:border-sky-500/60 hover:bg-sky-50/30 dark:hover:bg-sky-500/5 transition-all">
                <Icon className="text-gray-400 dark:text-gray-500 w-10 h-10 mx-auto mb-3"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></Icon>
                <p className="text-[14px] font-bold text-gray-700 dark:text-gray-300 mb-1">İmzalı sözleşmeyi buraya yükleyin</p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">PDF formatında · max 10MB · taratıp yükleyin</p>
              </div>
              <input type="file" accept=".pdf,application/pdf" onChange={(e) => setSignedFileForm(e.target.files?.[0]?.name || null)} className="hidden" />
            </label>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between gap-3">
        <button onClick={closeContractDetail} className="px-4 py-2.5 text-[12px] font-semibold text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600/50 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">İptal</button>
        <button onClick={() => submitSignedContract(contract)} disabled={!signedFileForm} className={`relative overflow-hidden px-5 py-2.5 bg-gradient-to-r from-sky-500 via-sky-400 to-sky-500 text-white rounded-lg font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 text-[12px] ${signedFileForm ? '' : 'opacity-60 cursor-not-allowed'}`}><Icon className="w-4 h-4"><polyline points="20 6 9 17 4 12" /></Icon>Dosyayı Kaydet</button>
      </div>
    </div>
  );
}

function FinanceApprovalStep({ contract, closeContractDetail, sendToFinance }: Parameters<typeof ContractDetailView>[0]) {
  return (
    <div className="space-y-3">
      <StampInfoSummary contract={contract} />
      <SignedFileSummary contract={contract} />
      <div className="relative overflow-hidden rounded-xl border-2 border-sky-300 dark:border-sky-500/40 bg-gradient-to-br from-sky-50 to-indigo-50/60 dark:from-sky-500/10 dark:to-indigo-500/5 p-5">
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-sky-400/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-sky-600 rounded-xl flex items-center justify-center shrink-0 shadow-md"><Icon className="text-white w-6 h-6"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></Icon></div>
          <div className="flex-1"><h4 className="text-[14px] font-bold text-sky-900 dark:text-sky-200 mb-1">Finans Ekibine Gönderilmeye Hazır</h4><p className="text-[11px] text-sky-700 dark:text-sky-400 leading-relaxed mb-3">İmzalı sözleşme yüklendi. Finans ekibi bu sözleşmeyi inceleyecek, ilk faturayı kesecek ve müşteri aktivasyonunu tamamlayacak.</p><Checklist items={['Finans ekibi bildirim alır (e-posta + Slack)', 'İlk ay faturalama tetiklenir', 'Müşteri ERP sistemine aktif olarak eklenir', 'Sözleşme değeri MRR hesabına eklenir', 'Satış temsilcisi prim tetiklenir']} /></div>
        </div>
      </div>
      <div className="flex items-center justify-between gap-3">
        <button onClick={closeContractDetail} className="px-4 py-2.5 text-[12px] font-semibold text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600/50 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Geri</button>
        <button onClick={() => sendToFinance(contract)} className="relative overflow-hidden px-5 py-2.5 bg-gradient-to-r from-sky-500 via-sky-400 to-sky-500 text-white rounded-lg font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 text-[12px]"><Icon className="w-4 h-4"><path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4 20-7z" /></Icon>Finans Onayına Gönder</button>
      </div>
    </div>
  );
}

function SignedFileSummary({ contract }: { contract: Contract }) {
  return (
    <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-4">
      <h4 className="text-[13px] font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-3"><Icon className="text-emerald-600 dark:text-emerald-400 w-3.5 h-3.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></Icon>İmzalı Sözleşme</h4>
      <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-lg flex items-center gap-3">
        <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center shrink-0"><Icon className="text-white w-5 h-5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><polyline points="9 13 11 15 15 11" /></Icon></div>
        <div className="flex-1 min-w-0"><p className="text-[12px] font-bold text-emerald-900 dark:text-emerald-200 truncate">{contract.signedFile || '-'}</p><p className="text-[10px] text-emerald-700 dark:text-emerald-400">{contract.signedFileUploadedAt ? new Date(contract.signedFileUploadedAt).toLocaleString('tr-TR') : ''}</p></div>
        <button className="px-2.5 py-1.5 bg-white dark:bg-emerald-500/20 border border-emerald-300 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-300 rounded-md text-[10px] font-bold hover:bg-emerald-50 transition-colors">Önizle</button>
      </div>
    </div>
  );
}

function AtFinanceView(props: Parameters<typeof ContractDetailView>[0]) {
  const { contract, completeContract } = props;
  const hoursAtFinance = contract.financeSubmittedAt ? Math.floor((Date.now() - new Date(contract.financeSubmittedAt).getTime()) / (60 * 60 * 1000)) : 0;
  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-2xl border-2 border-sky-400/60 dark:border-sky-500/40 shadow-2xl">
        <div className="relative bg-gradient-to-br from-[#0a1a2e] via-[#10253d] to-[#0a1a2e] p-6 md:p-8">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-sky-500/25 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative text-center">
            <div className="inline-flex relative mb-4"><div className="absolute inset-0 bg-sky-500 rounded-full blur-2xl opacity-60 animate-pulse"></div><div className="relative w-20 h-20 bg-gradient-to-br from-sky-400 to-sky-600 rounded-full flex items-center justify-center shadow-2xl"><Icon className="text-white w-10 h-10"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></Icon></div></div>
            <div className="text-[10px] font-bold tracking-[0.3em] text-sky-400 uppercase mb-2">Satış Süreci Tamamlandı</div>
            <h1 className="text-[28px] md:text-[36px] font-black leading-none tracking-tight mb-3"><span className="bg-gradient-to-r from-sky-300 via-white to-sky-300 bg-clip-text text-transparent">Finans Panosu'nda</span></h1>
            <p className="text-[13px] text-white/80 max-w-lg mx-auto leading-relaxed mb-4">Tüm satış aşamaları tamamlandı. Sözleşme şu an Finans Panosu'nda inceleniyor · {hoursAtFinance} saat önce gönderildi.</p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500/20 border border-sky-400/40 rounded-full"><span className="w-2 h-2 bg-sky-400 rounded-full animate-pulse"></span><span className="text-[11px] font-bold text-sky-200 tracking-wider">FİNANS İNCELEMESİNDE</span></div>
          </div>
        </div>
        <div className="h-1 bg-gradient-to-r from-sky-500 via-emerald-300 to-sky-500"></div>
      </div>
      <ProcessInfo title="Finans Panosu'nda Yürütülen Süreçler" subtitle="Bu adımlar sizin kontrolünüz dışında, finans ekibi tarafından yönetiliyor" items={['Sözleşme inceleme', 'Mali uygunluk kontrolü', 'İlk fatura hazırlığı', 'ERP müşteri kaydı', 'Müşteri aktivasyon onayı']} color="sky" />
      <SalesCompletedTimeline contract={contract} />
      <StampInfoSummary contract={contract} />
      <div className="p-3 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-500/10 dark:to-teal-500/5 border border-emerald-300 dark:border-emerald-500/40 rounded-xl flex items-center gap-3">
        <Icon className="text-emerald-600 dark:text-emerald-400 shrink-0 w-4 h-4"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></Icon>
        <div className="flex-1"><p className="text-[11px] font-bold text-emerald-900 dark:text-emerald-200">Simülasyon</p><p className="text-[10px] text-emerald-700 dark:text-emerald-400">Normalde Finans Panosu'ndan onay gelir. Demo için butona basabilirsiniz.</p></div>
        <button onClick={() => completeContract(contract)} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1"><Icon className="w-3 h-3"><polyline points="20 6 9 17 4 12" /></Icon>Finans Onayladı</button>
      </div>
    </div>
  );
}

function ActiveContractDetail({ contract, navigate }: Parameters<typeof ContractDetailView>[0]) {
  const workDays = contract.workStartedAt ? Math.floor((Date.now() - new Date(contract.workStartedAt).getTime()) / DAY) : 0;
  const kickoffDone = Boolean(contract.kickoffCompletedAt);
  const svcs = contract.services.map(serviceById);
  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-2xl border-2 border-emerald-400/60 dark:border-emerald-500/40 shadow-2xl">
        <div className="relative bg-gradient-to-br from-[#0a2e1a] via-[#1a3530] to-[#0a2e1a] p-6 md:p-8">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-500/25 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative">
            <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
              <div><div className="text-[10px] font-bold tracking-[0.3em] text-emerald-400 uppercase">Aktif Müşteri</div><h1 className="text-[28px] md:text-[36px] font-black leading-tight tracking-tight mt-1"><span className="bg-gradient-to-r from-emerald-300 via-white to-emerald-300 bg-clip-text text-transparent">{contract.customer}</span></h1><p className="text-[12px] text-white/70 mt-1">{contract.contact} · {contract.segment} · {svcs.length} aktif hizmet</p></div>
              <div className="text-right"><div className="text-[9px] font-bold tracking-widest text-emerald-400 uppercase mb-1">İş Sürecinde</div><div className="text-[32px] font-black text-emerald-300 leading-none">{workDays} gün</div></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-4 border-t border-white/10">
              <HeroMetric label="Yıllık Bedel" value={`₺${Math.round(contract.year1Total).toLocaleString('tr-TR')}`} />
              <HeroMetric label="MRR" value={`₺${contract.monthlyTotal.toLocaleString('tr-TR')}/ay`} emerald />
              <HeroMetric label="Karlılık" value={`%${contract.profitMargin ? contract.profitMargin.toFixed(1) : '-'}`} />
              <HeroMetric label="Başlangıç" value={contract.workStartedAt ? new Date(contract.workStartedAt).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: '2-digit' }) : '-'} />
            </div>
          </div>
        </div>
        <div className="h-1 bg-gradient-to-r from-emerald-500 via-amber-300 to-emerald-500"></div>
      </div>
      <ActiveWorkStatus contract={contract} kickoffDone={kickoffDone} />
      <ActiveServices svcs={svcs} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <FinanceCard contract={contract} workDays={workDays} />
        <CommissionCard contract={contract} navigate={navigate} />
      </div>
      <StampInfoSummary contract={contract} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <ActionCard color="violet" icon={<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></>} title="İmzalı Sözleşme" desc={contract.signedFile || '-'} />
        <ActionCard color="sky" icon={<><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></>} title="Fatura Geçmişi" desc="Finans Panosunda aç" />
        <ActionCard color="emerald" icon={<><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /></>} title="Müşteri Detayı" desc="Müşteri Data Kontrolde aç" />
      </div>
    </div>
  );
}

function ContractCompleted({ contract, closeContractDetail }: Parameters<typeof ContractDetailView>[0]) {
  const completedDate = contract.completedAt ? new Date(contract.completedAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-2xl border-2 border-emerald-400/60 dark:border-emerald-500/40 shadow-2xl">
        <div className="relative bg-gradient-to-br from-[#0a2e1a] via-[#1a3530] to-[#0a2e1a] p-6 md:p-8">
          <div className="relative text-center">
            <div className="inline-flex relative mb-4"><div className="absolute inset-0 bg-emerald-500 rounded-full blur-2xl opacity-60 animate-pulse"></div><div className="relative w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl"><Icon className="text-white w-10 h-10"><polyline points="20 6 9 17 4 12" /></Icon></div></div>
            <div className="text-[10px] font-bold tracking-[0.3em] text-emerald-400 uppercase mb-2">Süreç Tamamlandı</div>
            <h1 className="text-[32px] md:text-[42px] font-black leading-none tracking-tight mb-3"><span className="bg-gradient-to-r from-emerald-300 via-white to-emerald-300 bg-clip-text text-transparent">Sözleşme Aktif</span></h1>
            <p className="text-[13px] text-white/80 mb-4">{contract.customer} ile sözleşme başarıyla tamamlandı · {completedDate}</p>
            <div className="inline-flex flex-col p-5 bg-white/5 backdrop-blur-sm border border-emerald-400/30 rounded-xl"><div className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase mb-1">Toplam Sözleşme Bedeli</div><div className="text-[36px] font-black bg-gradient-to-r from-emerald-200 via-white to-emerald-200 bg-clip-text text-transparent">₺{Math.round(contract.year1Total).toLocaleString('tr-TR')}</div><div className="text-[11px] text-white/60 mt-1">1. yıl toplam · aylık ₺{contract.monthlyTotal.toLocaleString('tr-TR')}</div></div>
          </div>
        </div>
        <div className="h-1 bg-gradient-to-r from-emerald-500 via-amber-300 to-emerald-500"></div>
      </div>
      <SalesCompletedTimeline contract={contract} completed />
      <StampInfoSummary contract={contract} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <ActionCard color="violet" icon={<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></>} title="Sözleşme PDF" desc="İmzalı dosyayı indir" />
        <ActionCard color="sky" icon={<><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></>} title="Fatura Geçmişi" desc="Ödeme & fatura kayıtları" />
        <button onClick={closeContractDetail} className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-500/10 dark:to-teal-500/5 border border-emerald-300 dark:border-emerald-500/40 rounded-xl text-left hover:border-emerald-500 transition-all"><div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center mb-2 shadow-sm"><Icon className="text-white w-4 h-4"><polyline points="15 18 9 12 15 6" /></Icon></div><h5 className="text-[12px] font-bold text-emerald-900 dark:text-emerald-200">Sözleşmeler Listesi</h5><p className="text-[10px] text-emerald-700 dark:text-emerald-400">Takip ekranına dön</p></button>
      </div>
    </div>
  );
}

function Checklist({ items }: { items: string[] }) {
  return <div className="space-y-1.5 text-[11px]">{items.map((item) => <div key={item} className="flex items-center gap-2 text-sky-800 dark:text-sky-300"><Icon className="text-emerald-600 dark:text-emerald-400 w-3 h-3 shrink-0"><polyline points="20 6 9 17 4 12" /></Icon>{item}</div>)}</div>;
}

function ProcessInfo({ title, subtitle, items, color }: { title: string; subtitle: string; items: string[]; color: ColorName }) {
  return (
    <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-gray-100 dark:border-gray-700/40"><h4 className="text-[14px] font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2"><Icon className={`text-${color}-600 dark:text-${color}-400 w-4 h-4`}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></Icon>{title}</h4><p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p></div>
      <div className="p-5 space-y-1.5">{items.map((item) => <div key={item} className={`flex items-start gap-3 p-2.5 ${CM[color].bg} border border-${color}-200 dark:border-${color}-500/30 rounded-lg`}><div className={`w-7 h-7 rounded-full bg-${color}-600 flex items-center justify-center shrink-0`}><Icon className="text-white w-3.5 h-3.5"><polyline points="20 6 9 17 4 12" /></Icon></div><div className="flex-1"><div className={`text-[12px] font-bold ${CM[color].t}`}>{item}</div><div className={`text-[10px] ${CM[color].t} opacity-80`}>Finans ekibi tarafından yürütülüyor</div></div><div className="flex items-center gap-1"><span className={`w-1 h-1 bg-${color}-500 rounded-full animate-pulse`}></span><span className={`text-[9px] font-bold ${CM[color].t}`}>BEKLEMEDE</span></div></div>)}</div>
    </div>
  );
}

function SalesCompletedTimeline({ contract, completed = false }: { contract: Contract; completed?: boolean }) {
  const events = [
    { t: contract.createdAt, title: 'Sözleşme oluşturuldu', desc: 'Teklif onayı sonrası otomatik olarak yaratıldı' },
    { t: contract.customerSentAt, title: 'Müşteriye gönderildi', desc: 'Kaşe bilgileri tamamlandı, sözleşme iletildi' },
    { t: contract.signedFileUploadedAt, title: 'İmzalı dosya yüklendi', desc: 'Müşteri imzaladı, PDF sistemde kayıtlı' },
    { t: contract.financeSubmittedAt, title: 'Finans ekibine iletildi', desc: 'Sözleşme finans onayı için aktarıldı' },
    ...(completed ? [{ t: contract.completedAt, title: 'Finans onayladı', desc: 'İlk fatura kesildi · müşteri aktif' }] : []),
  ].filter((event) => event.t);
  return (
    <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-gray-100 dark:border-gray-700/40"><h4 className="text-[14px] font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2"><Icon className="text-emerald-600 dark:text-emerald-400 w-4 h-4"><polyline points="20 6 9 17 4 12" /></Icon>{completed ? 'Sözleşme Süreci' : 'Satış Ekibinin Tamamladıkları'}</h4></div>
      <div className="p-5"><div className="relative"><div className="absolute left-[15px] top-3 bottom-3 w-0.5 bg-emerald-300 dark:bg-emerald-500/30 pointer-events-none"></div><div className="space-y-2.5">{events.map((ev) => <TimelineItem key={ev.title} title={ev.title} desc={ev.desc} time={ev.t || ''} />)}</div></div></div>
    </div>
  );
}

function TimelineItem({ title, desc, time }: { title: string; desc: string; time: string }) {
  return <div className="flex items-start gap-3 relative"><div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-500/20 border-2 border-emerald-300 dark:border-emerald-500/40 flex items-center justify-center shrink-0 relative z-10 shadow-sm"><Icon className="text-emerald-600 dark:text-emerald-400 w-3.5 h-3.5"><polyline points="20 6 9 17 4 12" /></Icon></div><div className="flex-1 pt-0.5"><div className="flex items-center justify-between gap-2 flex-wrap"><h5 className="text-[12px] font-bold text-gray-900 dark:text-gray-100">{title}</h5><span className="text-[9px] font-mono text-emerald-700 dark:text-emerald-400 font-bold">{new Date(time).toLocaleString('tr-TR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}</span></div><p className="text-[10px] text-gray-500 dark:text-gray-400">{desc}</p></div></div>;
}

function HeroMetric({ label, value, emerald }: { label: string; value: string; emerald?: boolean }) {
  return <div className={`p-2.5 bg-white/5 backdrop-blur-sm border ${emerald ? 'border-emerald-400/30' : 'border-white/10'} rounded-lg`}><div className={`text-[9px] font-bold ${emerald ? 'text-emerald-400' : 'text-emerald-400/80'} uppercase tracking-widest`}>{label}</div><div className={`text-[14px] font-bold ${emerald ? 'text-emerald-300' : 'text-white'} mt-0.5`}>{value}</div></div>;
}

function ActiveWorkStatus({ contract, kickoffDone }: { contract: Contract; kickoffDone: boolean }) {
  return (
    <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-gray-100 dark:border-gray-700/40"><h4 className="text-[14px] font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2"><Icon className="text-emerald-600 dark:text-emerald-400 w-4 h-4"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></Icon>İş Süreci Durumu</h4></div>
      <div className="p-5"><div className="relative mb-4"><div className="absolute left-[15px] top-3 bottom-3 w-0.5 bg-emerald-300 dark:bg-emerald-500/30 pointer-events-none"></div><div className="space-y-2.5">
        <TimelineItem title="Sözleşme aktif" desc="Finans onayı sonrası iş süreci başladı" time={contract.activatedAt || contract.workStartedAt || contract.createdAt} />
        {kickoffDone ? <TimelineItem title="Kick-off toplantısı tamamlandı" desc="Marka ekibi atandı, brief alındı, proje başladı" time={contract.kickoffCompletedAt || ''} /> : <div className="flex items-start gap-3 relative"><div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-500/20 border-2 border-amber-300 dark:border-amber-500/40 flex items-center justify-center shrink-0 relative z-10 animate-pulse"><Icon className="text-amber-600 dark:text-amber-400 w-3.5 h-3.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></Icon></div><div className="flex-1 pt-0.5"><div className="flex items-center gap-2 flex-wrap"><h5 className="text-[12px] font-bold text-gray-900 dark:text-gray-100">Kick-off toplantısı planlanıyor</h5><span className="text-[9px] font-bold text-amber-700 dark:text-amber-300 px-1.5 py-0.5 bg-amber-50 dark:bg-amber-500/10 rounded">BEKLEMEDE</span></div><p className="text-[10px] text-gray-500 dark:text-gray-400">Ekip atanması ve ilk brief için toplantı kuruluyor</p></div></div>}
        <div className="flex items-start gap-3 relative"><div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center shrink-0 relative z-10"><Icon className="text-gray-400 dark:text-gray-600 w-3.5 h-3.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></Icon></div><div className="flex-1 pt-0.5"><h5 className="text-[12px] font-bold text-gray-500 dark:text-gray-500">Üretim / operasyonel akış</h5><p className="text-[10px] text-gray-400 dark:text-gray-600">Her hizmet için üretim Pazarlama Panosu'ndan takip edilir</p></div></div>
      </div></div></div>
    </div>
  );
}

function ActiveServices({ svcs }: { svcs: OfferService[] }) {
  return (
    <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-gray-100 dark:border-gray-700/40 flex items-center justify-between gap-2 flex-wrap"><h4 className="text-[14px] font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2"><Icon className="text-emerald-600 dark:text-emerald-400 w-4 h-4"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></Icon>Aktif Hizmetler</h4><span className="text-[10px] text-gray-500 dark:text-gray-400">{svcs.length} hizmet · canlı · Pazarlama Panosu'nda takipte</span></div>
      <div className="p-5"><div className="grid grid-cols-1 md:grid-cols-2 gap-2">{svcs.map((svc, index) => { const stat = ['Aktif', 'Kurulum', 'Aktif', 'Aktif'][index % 4]; const clr: ColorName = stat === 'Aktif' ? 'emerald' : 'amber'; const cm = CM[clr]; return <div key={svc.id} className="p-3 bg-gray-50 dark:bg-[#17181f] border border-gray-200 dark:border-gray-600/50 rounded-lg flex items-center gap-3"><div className={`w-9 h-9 ${cm.bg} rounded-lg flex items-center justify-center shrink-0`}><Icon className={`${cm.t} w-4 h-4`}>{svc.icon}</Icon></div><div className="flex-1 min-w-0"><div className="text-[12px] font-bold text-gray-900 dark:text-gray-100 truncate">{svc.name}</div><div className={`text-[10px] ${cm.t} font-semibold`}>{stat} · aylık rapor hazır</div></div><div className="text-right shrink-0"><div className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${cm.bg} ${cm.t} uppercase tracking-wider`}>{stat}</div></div></div>; })}</div></div>
    </div>
  );
}

function FinanceCard({ contract, workDays }: { contract: Contract; workDays: number }) {
  const collected = Math.round(contract.monthlyTotal * Math.floor(workDays / 30));
  return <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-4"><h4 className="text-[12px] font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2"><Icon className="text-amber-600 dark:text-amber-400 w-3.5 h-3.5"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></Icon>Finans Durumu</h4><div className="space-y-1.5 text-[11px]"><div className="flex items-center justify-between"><span className="text-gray-500 dark:text-gray-400">Toplam bedel</span><span className="font-bold text-gray-900 dark:text-gray-100">₺{Math.round(contract.year1Total).toLocaleString('tr-TR')}</span></div><div className="flex items-center justify-between"><span className="text-gray-500 dark:text-gray-400">Tahsil edilen</span><span className="font-bold text-emerald-700 dark:text-emerald-300">₺{collected.toLocaleString('tr-TR')}</span></div><div className="flex items-center justify-between"><span className="text-gray-500 dark:text-gray-400">Bekleyen</span><span className="font-bold text-amber-700 dark:text-amber-300">₺{Math.round(contract.year1Total - collected).toLocaleString('tr-TR')}</span></div><div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700/50 flex items-center justify-between"><span className="text-[10px] text-gray-500 dark:text-gray-400">Detay:</span><button className="text-[10px] font-bold text-amber-700 dark:text-amber-300 hover:underline">Finans Panosunda Aç →</button></div></div></div>;
}

function CommissionCard({ contract, navigate }: { contract: Contract; navigate: ReturnType<typeof useNavigate> }) {
  return <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-4"><h4 className="text-[12px] font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2"><Icon className="text-violet-600 dark:text-violet-400 w-3.5 h-3.5"><circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></Icon>Prim Durumu</h4><div className="space-y-1.5 text-[11px]"><div className="flex items-center justify-between"><span className="text-gray-500 dark:text-gray-400">Satış temsilcisi</span><span className="font-bold text-gray-900 dark:text-gray-100">Çiğdem A.</span></div><div className="flex items-center justify-between"><span className="text-gray-500 dark:text-gray-400">Prim oranı</span><span className="font-bold text-violet-700 dark:text-violet-300">%3</span></div><div className="flex items-center justify-between"><span className="text-gray-500 dark:text-gray-400">Hesaplanan</span><span className="font-bold text-emerald-700 dark:text-emerald-300">₺{Math.round(contract.year1Total * 0.03).toLocaleString('tr-TR')}</span></div><div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700/50 flex items-center justify-between"><span className="text-[10px] text-gray-500 dark:text-gray-400">Detay:</span><button onClick={() => navigate('/dashboards/sales/commissions')} className="text-[10px] font-bold text-violet-700 dark:text-violet-300 hover:underline">Prim Yönetimine Git →</button></div></div></div>;
}

function ActionCard({ color, icon, title, desc }: { color: ColorName; icon: ReactNode; title: string; desc: string }) {
  return <button className={`p-4 bg-white dark:bg-[#1e1f26] border border-${color}-200 dark:border-${color}-500/30 rounded-xl text-left hover:border-${color}-400 transition-all`}><div className={`w-9 h-9 bg-${color}-100 dark:bg-${color}-500/20 rounded-lg flex items-center justify-center mb-2`}><Icon className={`text-${color}-600 dark:text-${color}-400 w-4 h-4`}>{icon}</Icon></div><h5 className="text-[12px] font-bold text-gray-900 dark:text-gray-100">{title}</h5><p className="text-[10px] text-gray-500 dark:text-gray-400">{desc}</p></button>;
}
