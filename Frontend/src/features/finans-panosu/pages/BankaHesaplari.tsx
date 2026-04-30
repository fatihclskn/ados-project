import { type ReactNode, useMemo, useState } from 'react';

type ColorName = 'emerald' | 'sky' | 'rose' | 'violet' | 'amber' | 'teal' | 'indigo' | 'gray';
type BankKey = 'garanti' | 'enpara' | 'teb';
type Company = 'digital' | 'bilisim';
type Currency = 'TRY' | 'USD';
type TabKey = 'overview' | string;
type ModalType = 'mutabakat' | 'new' | null;

type BankAccount = {
  id: string;
  bank: BankKey;
  company: Company;
  iban: string;
  branch: string;
  account: string;
  balance: number;
  currency: Currency;
  logo: string;
  brandClr: ColorName;
  type: string;
  lastMovement: string;
  monthlyIn: number;
  monthlyOut: number;
  parasutSync: boolean;
  reconciled: boolean;
  reconDiff: number;
};

type Movement = {
  date: string;
  desc: string;
  amount: number;
  type: 'in' | 'out';
  ref: string;
};

type ToastState = {
  title: string;
  text: string;
  color: ColorName;
} | null;

const CM: Record<ColorName, { bg: string; t: string; border: string; bar: string; solid: string; hover: string }> = {
  emerald: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', t: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-500/30', bar: 'bg-gradient-to-r from-emerald-400 to-emerald-600', solid: 'bg-emerald-600', hover: 'hover:bg-emerald-700' },
  sky: { bg: 'bg-sky-100 dark:bg-sky-900/30', t: 'text-sky-700 dark:text-sky-300', border: 'border-sky-200 dark:border-sky-500/30', bar: 'bg-gradient-to-r from-sky-400 to-sky-600', solid: 'bg-sky-600', hover: 'hover:bg-sky-700' },
  rose: { bg: 'bg-rose-100 dark:bg-rose-900/30', t: 'text-rose-700 dark:text-rose-300', border: 'border-rose-200 dark:border-rose-500/30', bar: 'bg-gradient-to-r from-rose-400 to-rose-600', solid: 'bg-rose-600', hover: 'hover:bg-rose-700' },
  violet: { bg: 'bg-violet-100 dark:bg-violet-900/30', t: 'text-violet-700 dark:text-violet-300', border: 'border-violet-200 dark:border-violet-500/30', bar: 'bg-gradient-to-r from-violet-400 to-violet-600', solid: 'bg-violet-600', hover: 'hover:bg-violet-700' },
  amber: { bg: 'bg-amber-100 dark:bg-amber-900/30', t: 'text-amber-700 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-500/30', bar: 'bg-gradient-to-r from-amber-400 to-amber-600', solid: 'bg-amber-600', hover: 'hover:bg-amber-700' },
  teal: { bg: 'bg-teal-100 dark:bg-teal-900/30', t: 'text-teal-700 dark:text-teal-300', border: 'border-teal-200 dark:border-teal-500/30', bar: 'bg-gradient-to-r from-teal-400 to-teal-600', solid: 'bg-teal-600', hover: 'hover:bg-teal-700' },
  indigo: { bg: 'bg-indigo-100 dark:bg-indigo-900/30', t: 'text-indigo-700 dark:text-indigo-300', border: 'border-indigo-200 dark:border-indigo-500/30', bar: 'bg-gradient-to-r from-indigo-400 to-indigo-600', solid: 'bg-indigo-600', hover: 'hover:bg-indigo-700' },
  gray: { bg: 'bg-gray-100 dark:bg-gray-800', t: 'text-gray-700 dark:text-gray-300', border: 'border-gray-200 dark:border-gray-600/50', bar: 'bg-gradient-to-r from-gray-400 to-gray-600', solid: 'bg-gray-600', hover: 'hover:bg-gray-700' },
};

const BANK_INFO: Record<BankKey, { name: string; clr: ColorName; swift: string }> = {
  garanti: { name: 'Garanti BBVA', clr: 'emerald', swift: 'TGBATRIS' },
  enpara: { name: 'Enpara (QNB)', clr: 'violet', swift: 'FNNBTRIS' },
  teb: { name: 'TEB', clr: 'sky', swift: 'TEBUTRIS' },
};

const hesaplar: BankAccount[] = [
  {
    id: 'B-GRNT-DIG',
    bank: 'garanti',
    company: 'digital',
    iban: 'TR33 0006 2000 0000 0062 1234 56',
    branch: 'Teknopark Şb. (3842)',
    account: '9876543',
    balance: 2840000,
    currency: 'TRY',
    logo: 'GARANTİ',
    brandClr: 'emerald',
    type: 'Ticari Mevduat',
    lastMovement: '2 saat önce',
    monthlyIn: 4200000,
    monthlyOut: 1850000,
    parasutSync: true,
    reconciled: true,
    reconDiff: 0,
  },
  {
    id: 'B-GRNT-BIL',
    bank: 'garanti',
    company: 'bilisim',
    iban: 'TR33 0006 2000 0000 0062 5678 90',
    branch: 'Maslak Şb. (1247)',
    account: '1234567',
    balance: 1920000,
    currency: 'TRY',
    logo: 'GARANTİ',
    brandClr: 'emerald',
    type: 'Ticari Mevduat',
    lastMovement: '5 saat önce',
    monthlyIn: 1580000,
    monthlyOut: 680000,
    parasutSync: true,
    reconciled: true,
    reconDiff: 0,
  },
  {
    id: 'B-ENPR-DIG',
    bank: 'enpara',
    company: 'digital',
    iban: 'TR47 0011 1000 0000 0011 8842 00',
    branch: 'Dijital Şube',
    account: '8842100',
    balance: 450000,
    currency: 'TRY',
    logo: 'ENPARA',
    brandClr: 'violet',
    type: 'Kurumsal Dijital',
    lastMovement: '30 dk önce',
    monthlyIn: 320000,
    monthlyOut: 180000,
    parasutSync: true,
    reconciled: false,
    reconDiff: -12400,
  },
  {
    id: 'B-ENPR-USD',
    bank: 'enpara',
    company: 'digital',
    iban: 'TR47 0011 1000 0000 0011 8842 99',
    branch: 'Dijital Şube',
    account: '8842199',
    balance: 42500,
    currency: 'USD',
    logo: 'ENPARA',
    brandClr: 'violet',
    type: 'Döviz Hesap (USD)',
    lastMovement: '1 gün önce',
    monthlyIn: 18000,
    monthlyOut: 8400,
    parasutSync: true,
    reconciled: true,
    reconDiff: 0,
  },
  {
    id: 'B-TEB-BIL',
    bank: 'teb',
    company: 'bilisim',
    iban: 'TR98 0003 2000 0000 0000 9451 00',
    branch: 'Levent Şb. (0089)',
    account: '9451028',
    balance: 680000,
    currency: 'TRY',
    logo: 'TEB',
    brandClr: 'sky',
    type: 'Ticari Mevduat',
    lastMovement: '1 saat önce',
    monthlyIn: 890000,
    monthlyOut: 420000,
    parasutSync: false,
    reconciled: false,
    reconDiff: 28500,
  },
];

const movements: Movement[] = [
  { date: '24.04.2026 14:32', desc: 'BigBrand Reklam - Fatura Tahsilat', amount: 125400, type: 'in', ref: 'F-2026-0089' },
  { date: '24.04.2026 11:08', desc: 'Vergi Dairesi - KDV Ödemesi', amount: -28400, type: 'out', ref: 'V-2026-B01' },
  { date: '23.04.2026 16:45', desc: 'MegaMarka - Hizmet Anlaşması', amount: 68000, type: 'in', ref: 'F-2026-0091' },
  { date: '23.04.2026 09:22', desc: 'Garanti Maaş Ödemesi', amount: -84500, type: 'out', ref: 'BRD-04-2026' },
  { date: '22.04.2026 17:18', desc: 'TechNova - Domain + Hosting', amount: 2800, type: 'in', ref: 'F-2026-0087' },
  { date: '22.04.2026 14:50', desc: 'Metunic - Domain Yıllık Paket', amount: -4200, type: 'out', ref: 'MT-2026-0412' },
  { date: '21.04.2026 15:33', desc: 'Platin - Peşinat Tahsilat', amount: 45000, type: 'in', ref: 'F-2026-0083' },
  { date: '21.04.2026 11:45', desc: 'Plesk - VDS Aylık', amount: -2800, type: 'out', ref: 'PL-2026-0421' },
];

function Svg({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      {children}
    </svg>
  );
}

function toTry(account: BankAccount) {
  return account.currency === 'USD' ? account.balance * 32 : account.balance;
}

function amountToTry(amount: number, currency: Currency) {
  return currency === 'USD' ? amount * 32 : amount;
}

function money(value: number) {
  return `₺${value.toLocaleString('tr-TR')}`;
}

function balanceDisplay(account: BankAccount) {
  return account.currency === 'USD' ? `$${(account.balance / 1000).toFixed(1)}K` : `₺${(account.balance / 1000000).toFixed(2)}M`;
}

function flowDisplay(value: number, currency: Currency) {
  return currency === 'USD' ? `$${(value / 1000).toFixed(1)}K` : `₺${(value / 1000).toFixed(0)}K`;
}

function ContentToast({ toast, onClose }: { toast: ToastState; onClose: () => void }) {
  if (!toast) return null;
  const cm = CM[toast.color];
  return (
    <div className="absolute right-3 top-3 z-40 w-[280px] bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-3">
      <div className="flex items-start gap-2">
        <div className={`w-8 h-8 ${cm.bg} rounded-lg flex items-center justify-center shrink-0`}>
          <Svg className={`${cm.t} w-4 h-4`}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></Svg>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100">{toast.title}</p>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{toast.text}</p>
        </div>
        <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-700 p-0.5">
          <Svg className="w-3.5 h-3.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Svg>
        </button>
      </div>
    </div>
  );
}

export default function BankaHesaplari() {
  const [tab, setTab] = useState<TabKey>('overview');
  const [modal, setModal] = useState<ModalType>(null);
  const [toast, setToast] = useState<ToastState>(null);

  const stats = useMemo(() => {
    const totalBalance = hesaplar.reduce((sum, account) => sum + toTry(account), 0);
    const totalMonthlyIn = hesaplar.reduce((sum, account) => sum + amountToTry(account.monthlyIn, account.currency), 0);
    const totalMonthlyOut = hesaplar.reduce((sum, account) => sum + amountToTry(account.monthlyOut, account.currency), 0);
    const notReconciled = hesaplar.filter((account) => !account.reconciled).length;
    const notSynced = hesaplar.filter((account) => !account.parasutSync).length;
    return { totalBalance, totalMonthlyIn, totalMonthlyOut, notReconciled, notSynced };
  }, []);

  const selected = tab === 'overview' ? null : hesaplar.find((account) => account.id === tab) ?? null;
  const tabDefs = [
    { k: 'overview', lbl: 'Genel Bakış', icon: <circle cx="12" cy="12" r="10" /> },
    ...hesaplar.map((account) => ({
      k: account.id,
      lbl: `${BANK_INFO[account.bank].name.split(' ')[0]} ${account.company === 'digital' ? 'Digital' : 'Bil.'}${account.currency === 'USD' ? ' $' : ''}`,
      clr: BANK_INFO[account.bank].clr,
      icon: <><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></>,
    })),
  ];

  function showToast(title: string, text: string, color: ColorName = 'indigo') {
    setToast({ title, text, color });
    window.setTimeout(() => setToast(null), 2600);
  }

  return (
    <div className="relative space-y-3">
      <ContentToast toast={toast} onClose={() => setToast(null)} />
      <HeaderSection stats={stats} onToast={showToast} onOpenModal={setModal} />
      <TabStrip tab={tab} tabDefs={tabDefs} onChange={setTab} />
      {selected ? (
        <BankDetail account={selected} onToast={showToast} />
      ) : (
        <BankOverview stats={stats} onSelect={setTab} onOpenNew={() => setModal('new')} />
      )}
      {modal === 'mutabakat' ? <MutabakatModal onClose={() => setModal(null)} onToast={showToast} /> : null}
      {modal === 'new' ? <NewAccountModal onClose={() => setModal(null)} onToast={showToast} /> : null}
    </div>
  );
}

function HeaderSection({ stats, onToast, onOpenModal }: { stats: { notReconciled: number; notSynced: number }; onToast: (title: string, text: string, color: ColorName) => void; onOpenModal: (modal: ModalType) => void }) {
  return (
    <div className="flex items-center justify-between gap-3 flex-wrap">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg flex items-center justify-center">
          <Svg className="text-indigo-600 dark:text-indigo-400 w-4 h-4"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" /></Svg>
        </div>
        <div>
          <h1 className="text-[19px] font-bold text-gray-900 dark:text-gray-100 leading-tight">Banka Hesapları</h1>
          <p className="text-[11px] text-gray-500 dark:text-gray-400">
            {hesaplar.length} hesap · 3 banka · {hesaplar.filter((account) => account.parasutSync).length} Paraşüt senkronize
            {stats.notReconciled > 0 ? <span className="text-amber-600 dark:text-amber-400 font-bold"> · {stats.notReconciled} mutabakat farkı</span> : null}
            {stats.notSynced > 0 ? <span className="text-amber-600 dark:text-amber-400 font-bold"> · {stats.notSynced} senkronsuz</span> : null}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <button type="button" onClick={() => onToast('Paraşüt Banka Senkron', 'Tüm bankalardan son 30 günlük hareketler çekiliyor', 'teal')} className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/30 text-teal-700 dark:text-teal-300 text-[11px] font-semibold rounded-md hover:bg-teal-100">
          <Svg className="w-3.5 h-3.5"><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10" /></Svg>
          Paraşüt Senkron
        </button>
        <button type="button" onClick={() => onOpenModal('mutabakat')} className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-[11px] font-semibold rounded-md hover:bg-gray-50">
          <Svg className="w-3.5 h-3.5"><polyline points="20 6 9 17 4 12" /></Svg>
          Mutabakat
        </button>
        <button type="button" onClick={() => onOpenModal('new')} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold rounded-md shadow-sm">
          <Svg className="w-3.5 h-3.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></Svg>
          Yeni Hesap
        </button>
      </div>
    </div>
  );
}

function TabStrip({ tab, tabDefs, onChange }: { tab: TabKey; tabDefs: { k: string; lbl: string; icon: ReactNode; clr?: ColorName }[]; onChange: (tab: string) => void }) {
  return (
    <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <div className="flex items-center gap-0.5 p-1.5 min-w-max">
          {tabDefs.map((item) => {
            const active = tab === item.k;
            const tClr = item.clr || 'gray';
            const cm = CM[tClr];
            const activeClass = active ? (tClr === 'gray' ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900' : `${cm.bg} ${cm.t} border-2 border-${tClr}-500`) : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50';
            return (
              <button key={item.k} type="button" onClick={() => onChange(item.k)} className={`flex items-center gap-1.5 px-3 py-2 text-[11px] font-semibold rounded-md transition-all shrink-0 ${activeClass}`}>
                <Svg className="w-3.5 h-3.5 shrink-0">{item.icon}</Svg>
                {item.lbl}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function KpiGrid({ stats }: { stats: { totalBalance: number; totalMonthlyIn: number; totalMonthlyOut: number; notReconciled: number; notSynced: number } }) {
  const cards = [
    { label: 'Toplam Bakiye', value: `₺${(stats.totalBalance / 1000000).toFixed(2)}M`, sub: `${hesaplar.length} hesap toplamı`, clr: 'emerald' as ColorName },
    { label: 'Aylık Giriş', value: `₺${(stats.totalMonthlyIn / 1000000).toFixed(2)}M`, sub: 'Nisan 2026 alacak', clr: 'sky' as ColorName },
    { label: 'Aylık Çıkış', value: `₺${(stats.totalMonthlyOut / 1000000).toFixed(2)}M`, sub: 'Nisan 2026 borç', clr: 'rose' as ColorName },
    { label: 'Net Akış', value: `₺${((stats.totalMonthlyIn - stats.totalMonthlyOut) / 1000000).toFixed(2)}M`, sub: 'Bu ay net', clr: 'violet' as ColorName },
    { label: 'Paraşüt Senkron', value: `${hesaplar.length - stats.notSynced}/${hesaplar.length}`, sub: stats.notSynced > 0 ? `${stats.notSynced} senkronsuz` : 'Tümü senkron', clr: stats.notSynced > 0 ? 'amber' as ColorName : 'teal' as ColorName },
    { label: 'Mutabakat', value: `${hesaplar.length - stats.notReconciled}/${hesaplar.length}`, sub: stats.notReconciled > 0 ? `${stats.notReconciled} farklı` : 'Tümü uyumlu', clr: stats.notReconciled > 0 ? 'amber' as ColorName : 'emerald' as ColorName },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3">
      {cards.map((card) => {
        const cm = CM[card.clr];
        return (
          <div key={card.label} className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-3.5">
            <p className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">{card.label}</p>
            <p className={`text-[22px] font-bold ${cm.t} font-mono leading-none mb-0.5`}>{card.value}</p>
            <p className="text-[9px] text-gray-400 dark:text-gray-500">{card.sub}</p>
          </div>
        );
      })}
    </div>
  );
}

function BankOverview({ stats, onSelect, onOpenNew }: { stats: { totalBalance: number; totalMonthlyIn: number; totalMonthlyOut: number; notReconciled: number; notSynced: number }; onSelect: (tab: string) => void; onOpenNew: () => void }) {
  return (
    <>
      <KpiGrid stats={stats} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {hesaplar.map((account) => (
          <BankCard key={account.id} account={account} onSelect={onSelect} />
        ))}
        <button type="button" onClick={onOpenNew} className="border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-indigo-500 dark:hover:border-indigo-400 rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:bg-indigo-50/30 dark:hover:bg-indigo-500/5 transition-all min-h-[260px]">
          <Svg className="text-gray-400 w-8 h-8"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></Svg>
          <span className="text-[12px] font-bold text-gray-600 dark:text-gray-400">Yeni Banka Hesabı Ekle</span>
          <span className="text-[10px] text-gray-500 dark:text-gray-500">Paraşüt ile otomatik bağlanır</span>
        </button>
      </div>
      <CashFlowAndDistribution stats={stats} />
      <InfoBand />
    </>
  );
}

function BankCard({ account, onSelect }: { account: BankAccount; onSelect: (tab: string) => void }) {
  const bi = BANK_INFO[account.bank];
  const cm = CM[bi.clr];
  const companyLbl = account.company === 'digital' ? 'Arma Digital' : 'Arma Bilişim';
  const companyClr = account.company === 'digital' ? 'emerald' : 'indigo';
  const companyCm = CM[companyClr];

  return (
    <div className={`bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden hover:border-${bi.clr}-400 dark:hover:border-${bi.clr}-500/50 transition-colors cursor-pointer`} onClick={() => onSelect(account.id)}>
      <div className={`p-3 bg-gradient-to-br from-${bi.clr}-50 to-${bi.clr}-100/50 dark:from-${bi.clr}-500/10 dark:to-${bi.clr}-500/5 border-b border-${bi.clr}-200/50 dark:border-${bi.clr}-500/20`}>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-white dark:bg-[#1e1f26] rounded-md flex items-center justify-center shrink-0 shadow-sm">
              <Svg className={`${cm.t} w-4 h-4`}><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></Svg>
            </div>
            <div className="min-w-0">
              <p className={`text-[12px] font-black ${cm.t} tracking-tight`}>{bi.name}</p>
              <p className="text-[9px] text-gray-500 dark:text-gray-400">{account.type}</p>
            </div>
          </div>
          <span className={`inline-block text-[9px] font-bold px-1.5 py-0.5 ${companyCm.bg} ${companyCm.t} rounded shrink-0`}>{companyLbl}</span>
        </div>
        <p className={`text-[28px] font-black ${cm.t} font-mono leading-none`}>{balanceDisplay(account)}</p>
        <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">Güncel bakiye · {account.lastMovement}</p>
      </div>
      <div className="p-3 space-y-2">
        <div className="grid grid-cols-2 gap-2 text-[10px]">
          <div>
            <p className="text-gray-500 dark:text-gray-400 uppercase tracking-wider">Aylık Giriş</p>
            <p className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{flowDisplay(account.monthlyIn, account.currency)}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 uppercase tracking-wider">Aylık Çıkış</p>
            <p className="font-mono font-bold text-rose-600 dark:text-rose-400">{flowDisplay(account.monthlyOut, account.currency)}</p>
          </div>
        </div>
        <div className="pt-2 border-t border-gray-100 dark:border-gray-700/40">
          <p className="text-[9px] text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">IBAN</p>
          <p className="text-[10px] font-mono text-gray-700 dark:text-gray-300 truncate">{account.iban}</p>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-gray-100 dark:border-gray-700/40">
          {account.parasutSync ? (
            <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 bg-teal-100 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300 rounded">
              <Svg className="w-2.5 h-2.5"><polyline points="20 6 9 17 4 12" /></Svg>
              PARAŞÜT
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 rounded">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
              SENKRONSUZ
            </span>
          )}
          {account.reconciled ? (
            <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 rounded">
              <Svg className="w-2.5 h-2.5"><polyline points="20 6 9 17 4 12" /></Svg>
              MUTABIK
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 rounded">
              <Svg className="w-2.5 h-2.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></Svg>
              FARK {money(Math.abs(account.reconDiff))}
            </span>
          )}
          <span className="text-gray-400 ml-auto shrink-0"><Svg className="w-3 h-3"><polyline points="9 18 15 12 9 6" /></Svg></span>
        </div>
      </div>
    </div>
  );
}

function CashFlowAndDistribution({ stats }: { stats: { totalBalance: number; totalMonthlyIn: number; totalMonthlyOut: number } }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
      <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
        <div className="p-3 border-b border-gray-100 dark:border-gray-700/40 flex items-center gap-2">
          <Svg className="text-indigo-600 dark:text-indigo-400 w-4 h-4"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></Svg>
          <h3 className="text-[13px] font-bold text-gray-900 dark:text-gray-100">Nakit Akış Özeti</h3>
          <span className="ml-auto text-[9px] text-gray-500">Nisan 2026</span>
        </div>
        <div className="p-4">
          <div className="space-y-3">
            <FlowBox color="emerald" title="Toplam Giriş" sub="Tahsilatlar + havale" value={`+₺${(stats.totalMonthlyIn / 1000000).toFixed(2)}M`} icon={<><polyline points="17 11 12 6 7 11" /><line x1="12" y1="18" x2="12" y2="6" /></>} />
            <FlowBox color="rose" title="Toplam Çıkış" sub="Vergi + maaş + tedarikçi" value={`−₺${(stats.totalMonthlyOut / 1000000).toFixed(2)}M`} icon={<><polyline points="7 13 12 18 17 13" /><line x1="12" y1="6" x2="12" y2="18" /></>} />
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-500/10 dark:to-indigo-500/10 border-2 border-violet-200 dark:border-violet-500/30 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-violet-100 dark:bg-violet-500/20 rounded-lg flex items-center justify-center">
                  <Svg className="text-violet-600 w-4 h-4"><polygon points="22 12 18 12 15 21 9 3 6 12 2 12" /></Svg>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-violet-800 dark:text-violet-200">Net Nakit Akışı</p>
                  <p className="text-[9px] text-violet-600 dark:text-violet-400">Bu ay pozitif</p>
                </div>
              </div>
              <p className="text-[22px] font-black font-mono text-violet-700 dark:text-violet-300">₺{((stats.totalMonthlyIn - stats.totalMonthlyOut) / 1000000).toFixed(2)}M</p>
            </div>
          </div>
        </div>
      </div>
      <BankDistribution stats={stats} />
    </div>
  );
}

function FlowBox({ color, title, sub, value, icon }: { color: ColorName; title: string; sub: string; value: string; icon: ReactNode }) {
  return (
    <div className={`flex items-center justify-between p-3 bg-${color}-50 dark:bg-${color}-500/10 border border-${color}-200 dark:border-${color}-500/30 rounded-lg`}>
      <div className="flex items-center gap-2">
        <div className={`w-8 h-8 bg-${color}-100 dark:bg-${color}-500/20 rounded-lg flex items-center justify-center`}>
          <Svg className={`text-${color}-600 w-4 h-4`}>{icon}</Svg>
        </div>
        <div>
          <p className={`text-[11px] font-bold text-${color}-800 dark:text-${color}-200`}>{title}</p>
          <p className={`text-[9px] text-${color}-600 dark:text-${color}-400`}>{sub}</p>
        </div>
      </div>
      <p className={`text-[18px] font-black font-mono text-${color}-700 dark:text-${color}-300`}>{value}</p>
    </div>
  );
}

function BankDistribution({ stats }: { stats: { totalBalance: number } }) {
  return (
    <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
      <div className="p-3 border-b border-gray-100 dark:border-gray-700/40 flex items-center gap-2">
        <Svg className="text-indigo-600 dark:text-indigo-400 w-4 h-4"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /></Svg>
        <h3 className="text-[13px] font-bold text-gray-900 dark:text-gray-100">Banka Bakiye Dağılımı</h3>
      </div>
      <div className="p-4 space-y-3">
        {Object.entries(BANK_INFO).map(([bankKey, bi]) => {
          const bankAccounts = hesaplar.filter((account) => account.bank === bankKey);
          const bankTotal = bankAccounts.reduce((sum, account) => sum + toTry(account), 0);
          const pct = stats.totalBalance > 0 ? Math.round((bankTotal / stats.totalBalance) * 100) : 0;
          const cm = CM[bi.clr];
          return (
            <div key={bankKey}>
              <div className="flex items-center justify-between text-[11px] mb-1">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 ${cm.bg} rounded flex items-center justify-center`}>
                    <Svg className={`${cm.t} w-3 h-3`}><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></Svg>
                  </div>
                  <span className="font-bold text-gray-900 dark:text-gray-100">{bi.name}</span>
                  <span className="text-[9px] text-gray-500">{bankAccounts.length} hesap</span>
                </div>
                <span className={`font-mono font-bold ${cm.t}`}>₺{(bankTotal / 1000000).toFixed(2)}M · %{pct}</span>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className={`h-full ${cm.bar} rounded-full`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
      <div className="p-3 border-t border-gray-100 dark:border-gray-700/40 bg-gray-50 dark:bg-[#17181f] flex items-center justify-between text-[10px]">
        <span className="text-gray-500 dark:text-gray-400">Toplam Bakiye</span>
        <span className="font-mono font-black text-indigo-700 dark:text-indigo-300 text-[14px]">₺{(stats.totalBalance / 1000000).toFixed(2)}M</span>
      </div>
    </div>
  );
}

function InfoBand() {
  return (
    <div className="bg-gradient-to-br from-teal-50/50 via-transparent to-indigo-50/50 dark:from-teal-500/5 dark:to-indigo-500/5 border border-teal-200/50 dark:border-teal-500/20 rounded-xl p-3 flex items-start gap-2.5">
      <Svg className="text-teal-600 dark:text-teal-400 w-4 h-4 shrink-0 mt-0.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></Svg>
      <div className="flex-1">
        <p className="text-[11px] text-gray-700 dark:text-gray-300">
          <span className="font-bold text-teal-700 dark:text-teal-300">Paraşüt Entegrasyonu:</span>
          {' '}Banka hareketleri her gün 08:00 ve 18:00'de otomatik senkron edilir · tahsilatlar faturalarla eşleştirilir · vergi/maaş ödemeleri kategorilendirilir ·
          {' '}<span className="font-bold text-amber-700 dark:text-amber-300">Mutabakat:</span>
          {' '}ay sonu Paraşüt defter bakiyesi ile banka ekstresi karşılaştırılır · fark varsa manuel inceleme gerekir ·
          {' '}<span className="font-bold text-indigo-700 dark:text-indigo-300">Vergi ödemeleri:</span>
          {' '}her iki şirketin vergi ödemeleri kendi Garanti hesabından çekilir.
        </p>
      </div>
    </div>
  );
}

function BankDetail({ account, onToast }: { account: BankAccount; onToast: (title: string, text: string, color: ColorName) => void }) {
  const bi = BANK_INFO[account.bank];
  const cm = CM[bi.clr];
  const companyLbl = account.company === 'digital' ? 'Arma Digital Medya A.Ş.' : 'Arma Bilişim Ltd. Şti.';
  const companyClr = account.company === 'digital' ? 'emerald' : 'indigo';
  const ccm = CM[companyClr];
  const balDisplay = account.currency === 'USD' ? `$${account.balance.toLocaleString('en-US')}` : money(account.balance);

  return (
    <>
      <div className={`bg-gradient-to-br from-${bi.clr}-50 via-${bi.clr}-100/40 to-transparent dark:from-${bi.clr}-500/15 dark:via-${bi.clr}-500/5 border-2 border-${bi.clr}-200 dark:border-${bi.clr}-500/30 rounded-xl overflow-hidden`}>
        <div className="p-5 md:p-6 flex items-start gap-4 flex-wrap">
          <div className="w-16 h-16 bg-white dark:bg-[#1e1f26] rounded-xl flex items-center justify-center shrink-0 shadow-lg">
            <Svg className={`${cm.t} w-8 h-8`}><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></Svg>
          </div>
          <div className="flex-1 min-w-[240px]">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h2 className={`text-[20px] font-black ${cm.t}`}>{bi.name}</h2>
              <span className={`inline-block text-[9px] font-bold px-2 py-0.5 ${ccm.bg} ${ccm.t} rounded`}>{companyLbl}</span>
              {account.currency === 'USD' ? <span className="inline-block text-[9px] font-bold px-2 py-0.5 bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 rounded">DÖVİZ HESAP · USD</span> : null}
            </div>
            <p className="text-[11px] text-gray-600 dark:text-gray-400 mb-3">{account.type} · {account.branch} · Hesap: {account.account}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-[10px]">
              <div>
                <p className="text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">IBAN</p>
                <p className="font-mono font-bold text-gray-900 dark:text-gray-100 mt-0.5">{account.iban}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">SWIFT / BIC</p>
                <p className="font-mono font-bold text-gray-900 dark:text-gray-100 mt-0.5">{bi.swift}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Son Hareket</p>
                <p className="font-bold text-gray-900 dark:text-gray-100 mt-0.5">{account.lastMovement}</p>
              </div>
            </div>
          </div>
          <div className="text-right min-w-[180px]">
            <p className={`text-[10px] font-semibold ${cm.t} uppercase tracking-wider`}>Güncel Bakiye</p>
            <p className={`text-[32px] md:text-[38px] font-black ${cm.t} font-mono leading-none mt-1`}>{balDisplay}</p>
            {account.currency === 'USD' ? <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 font-mono">≈ {money(account.balance * 32)}</p> : null}
          </div>
        </div>
      </div>
      <DetailBadges account={account} bi={bi} cm={cm} onToast={onToast} />
      <DetailKpis account={account} />
      <MovementsTable account={account} cm={cm} onToast={onToast} />
    </>
  );
}

function DetailBadges({ account, bi, cm, onToast }: { account: BankAccount; bi: { name: string; clr: ColorName; swift: string }; cm: { t: string }; onToast: (title: string, text: string, color: ColorName) => void }) {
  return (
    <div className="flex items-center justify-between gap-2 flex-wrap">
      <div className="flex items-center gap-2 flex-wrap">
        {account.parasutSync ? (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 bg-teal-100 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300 rounded">
            <Svg className="w-3 h-3"><polyline points="20 6 9 17 4 12" /></Svg>
            Paraşüt senkronize · son: 2 saat önce
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 rounded">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
            Paraşüt bağlantısı kurulmamış
          </span>
        )}
        {account.reconciled ? (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 rounded">
            <Svg className="w-3 h-3"><polyline points="20 6 9 17 4 12" /></Svg>
            Mutabakat sağlandı · 31.03.2026
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 rounded">
            <Svg className="w-3 h-3"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /></Svg>
            Mutabakat farkı: {money(Math.abs(account.reconDiff))}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => onToast('Ekstre İndir', `${bi.name} hesabı için ay ekstresi PDF indiriliyor`, 'indigo')} className="flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-[10px] font-semibold rounded-md hover:bg-gray-50">
          <Svg className="w-3 h-3"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></Svg>
          Ekstre
        </button>
        <button type="button" onClick={() => onToast('Mutabakat', `${bi.name} hesabı mutabakat ekranı açılıyor`, 'emerald')} className={`flex items-center gap-1 px-3 py-1.5 bg-${bi.clr}-600 hover:bg-${bi.clr}-700 text-white text-[10px] font-bold rounded-md shadow-sm`}>
          <Svg className="w-3 h-3"><polyline points="20 6 9 17 4 12" /></Svg>
          Mutabakat Yap
        </button>
      </div>
    </div>
  );
}

function DetailKpis({ account }: { account: BankAccount }) {
  const cards = [
    { label: 'Aylık Giriş', value: flowDisplay(account.monthlyIn, account.currency), sub: 'Nisan 2026', clr: 'emerald' as ColorName },
    { label: 'Aylık Çıkış', value: flowDisplay(account.monthlyOut, account.currency), sub: 'Nisan 2026', clr: 'rose' as ColorName },
    { label: 'Net Akış', value: flowDisplay(account.monthlyIn - account.monthlyOut, account.currency), sub: 'Pozitif', clr: 'violet' as ColorName },
    { label: 'Bu Ay Hareket', value: String(movements.length), sub: 'İşlem sayısı', clr: 'sky' as ColorName },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
      {cards.map((card) => {
        const cm = CM[card.clr];
        return (
          <div key={card.label} className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-3.5">
            <p className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">{card.label}</p>
            <p className={`text-[20px] font-bold ${cm.t} font-mono leading-none mb-0.5`}>{card.value}</p>
            <p className="text-[9px] text-gray-400 dark:text-gray-500">{card.sub}</p>
          </div>
        );
      })}
    </div>
  );
}

function MovementsTable({ cm, onToast }: { account: BankAccount; cm: { t: string }; onToast: (title: string, text: string, color: ColorName) => void }) {
  return (
    <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
      <div className="p-3 border-b border-gray-100 dark:border-gray-700/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Svg className={`${cm.t} w-4 h-4`}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></Svg>
          <h3 className="text-[13px] font-bold text-gray-900 dark:text-gray-100">Son Hareketler</h3>
          <span className={`text-[9px] font-bold px-1.5 py-0.5 ${CM.indigo.bg} ${CM.indigo.t} rounded`}>{movements.length} işlem</span>
        </div>
        <button type="button" onClick={() => onToast('Tümü', 'Tüm hareketler listeleniyor', 'indigo')} className={`text-[10px] font-semibold ${cm.t} hover:underline`}>Tümü →</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[11px]">
          <thead className="bg-gray-50 dark:bg-[#17181f]">
            <tr className="border-b border-gray-200 dark:border-gray-700/30">
              <th className="text-left px-3 py-2 font-semibold text-gray-500 dark:text-gray-400 hidden md:table-cell">Tarih</th>
              <th className="text-left px-3 py-2 font-semibold text-gray-500 dark:text-gray-400">Açıklama</th>
              <th className="text-left px-3 py-2 font-semibold text-gray-500 dark:text-gray-400 hidden lg:table-cell">Referans</th>
              <th className="text-right px-3 py-2 font-semibold text-gray-500 dark:text-gray-400">Tutar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700/30">
            {movements.map((item) => {
              const inClr = item.type === 'in' ? 'emerald' : 'rose';
              const icm = CM[inClr];
              return (
                <tr key={`${item.date}-${item.ref}`} className="hover:bg-gray-50 dark:hover:bg-white/5">
                  <td className="px-3 py-2.5 hidden md:table-cell font-mono text-[10px] text-gray-600 dark:text-gray-400">{item.date}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 ${icm.bg} rounded flex items-center justify-center shrink-0`}>
                        <Svg className={`${icm.t} w-3.5 h-3.5`}>{item.type === 'in' ? <><polyline points="17 11 12 6 7 11" /><line x1="12" y1="18" x2="12" y2="6" /></> : <><polyline points="7 13 12 18 17 13" /><line x1="12" y1="6" x2="12" y2="18" /></>}</Svg>
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">{item.desc}</p>
                        <p className="text-[9px] text-gray-400 dark:text-gray-500 md:hidden">{item.date}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 hidden lg:table-cell font-mono text-[10px] text-gray-500 dark:text-gray-400">{item.ref}</td>
                  <td className={`px-3 py-2.5 text-right font-mono font-bold ${item.type === 'in' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>{item.type === 'in' ? '+' : ''}{money(item.amount)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="p-3 bg-gray-50 dark:bg-[#17181f] border-t border-gray-100 dark:border-gray-700/40 flex items-center justify-between text-[10px]">
        <span className="text-gray-500 dark:text-gray-400">{movements.length} hareket listelendi · son 7 gün</span>
        <span className="text-gray-500">Net: <span className="font-mono font-bold text-violet-700 dark:text-violet-300">{money(movements.reduce((sum, item) => sum + item.amount, 0))}</span></span>
      </div>
    </div>
  );
}

function ModalFrame({ children, maxWidth, onClose }: { children: ReactNode; maxWidth: string; onClose: () => void }) {
  return (
    <div className="absolute inset-0 z-30">
      <div className="modal-overlay absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="modal-panel absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
        <div className={`modal-scroll bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-xl w-full ${maxWidth} max-h-[92vh] overflow-y-auto pointer-events-auto`}>
          {children}
        </div>
      </div>
    </div>
  );
}

function ModalHeader({ title, subtitle, color, icon, onClose }: { title: string; subtitle: string; color: ColorName; icon: ReactNode; onClose: () => void }) {
  const cm = CM[color];
  return (
    <div className="sticky top-0 z-10 bg-white dark:bg-[#1e1f26] border-b border-gray-100 dark:border-gray-700/60 p-5 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <div className={`w-10 h-10 ${cm.bg} rounded-lg flex items-center justify-center`}>
          <Svg className={`${cm.t} w-4 h-4`}>{icon}</Svg>
        </div>
        <div>
          <h2 className="text-[15px] font-bold text-gray-900 dark:text-gray-100">{title}</h2>
          <p className="text-[11px] text-gray-500 dark:text-gray-400">{subtitle}</p>
        </div>
      </div>
      <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-700 p-1">
        <Svg className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Svg>
      </button>
    </div>
  );
}

function MutabakatModal({ onClose, onToast }: { onClose: () => void; onToast: (title: string, text: string, color: ColorName) => void }) {
  return (
    <ModalFrame maxWidth="max-w-[680px]" onClose={onClose}>
      <ModalHeader title="Banka Mutabakatı" subtitle="Paraşüt defter bakiyesi ile banka ekstresi karşılaştırması" color="emerald" icon={<polyline points="20 6 9 17 4 12" />} onClose={onClose} />
      <div className="p-5 space-y-4">
        <div className="p-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-md flex items-start gap-2">
          <Svg className="text-amber-600 dark:text-amber-400 w-4 h-4 shrink-0 mt-0.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></Svg>
          <div className="text-[11px] text-amber-900 dark:text-amber-200">
            <p className="font-bold">2 hesapta mutabakat farkı tespit edildi</p>
            <p className="mt-0.5">Enpara Digital · TEB Bilişim hesaplarında banka ekstresi ile Paraşüt defter bakiyesi arasında tutarsızlık var</p>
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wider">Mutabakat Yapılacak Hesap</label>
          <select className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:border-emerald-500" defaultValue="enpara">
            <option value="enpara">Enpara Digital · Fark: -₺12.400 (ekstre Paraşüt'ten düşük)</option>
            <option value="teb">TEB Bilişim · Fark: +₺28.500 (ekstre Paraşüt'ten yüksek)</option>
            <option value="all">Tüm hesapları kontrol et</option>
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3 bg-gray-50 dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md">
            <p className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider">Paraşüt Defter Bakiyesi</p>
            <p className="text-[18px] font-black font-mono text-gray-900 dark:text-gray-100 mt-1">₺462.400</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md">
            <p className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider">Banka Ekstre Bakiyesi</p>
            <p className="text-[18px] font-black font-mono text-gray-900 dark:text-gray-100 mt-1">₺450.000</p>
          </div>
        </div>
        <div className="p-3 bg-rose-50 dark:bg-rose-500/10 border-2 border-rose-300 dark:border-rose-500/40 rounded-md">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold text-rose-800 dark:text-rose-200">Tespit Edilen Fark</p>
            <p className="text-[18px] font-black font-mono text-rose-700 dark:text-rose-300">−₺12.400</p>
          </div>
          <p className="text-[10px] text-rose-700 dark:text-rose-300 mt-1">Büyük ihtimalle: henüz işlenmemiş bir çek veya havale · AI analiz ediyor...</p>
        </div>
        <div>
          <label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1">Mutabakat Tarihi</label>
          <input type="date" defaultValue="2026-04-24" className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono focus:outline-none focus:border-emerald-500" />
        </div>
      </div>
      <div className="sticky bottom-0 bg-white dark:bg-[#1e1f26] border-t border-gray-100 dark:border-gray-700/60 p-4 flex items-center justify-end gap-2">
        <button type="button" onClick={onClose} className="px-3 py-2 text-[11px] font-semibold text-gray-600 dark:text-gray-400">İptal</button>
        <button type="button" onClick={() => { onToast('Mutabakat Tamamlandı', 'Paraşüt defter bakiyesi güncellendi · fark açıklandı', 'emerald'); onClose(); }} className="flex items-center gap-1.5 px-4 py-2 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-md">
          <Svg className="w-3 h-3"><polyline points="20 6 9 17 4 12" /></Svg>
          Mutabakatı Kaydet
        </button>
      </div>
    </ModalFrame>
  );
}

function NewAccountModal({ onClose, onToast }: { onClose: () => void; onToast: (title: string, text: string, color: ColorName) => void }) {
  return (
    <ModalFrame maxWidth="max-w-[640px]" onClose={onClose}>
      <ModalHeader title="Yeni Banka Hesabı Ekle" subtitle="Paraşüt otomatik bağlanacak" color="indigo" icon={<><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" /></>} onClose={onClose} />
      <div className="p-5 space-y-4">
        <div>
          <label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wider">Şirket *</label>
          <div className="grid grid-cols-2 gap-2">
            <label className="cursor-pointer">
              <input type="radio" name="bankCompany" value="digital" className="sr-only peer" defaultChecked />
              <div className="p-2.5 bg-white dark:bg-[#17181f] border-2 border-gray-200 peer-checked:border-emerald-500 peer-checked:bg-emerald-50 dark:peer-checked:bg-emerald-500/10 rounded-md text-center">
                <p className="text-[11px] font-bold text-gray-900 dark:text-gray-100">Arma Digital</p>
                <p className="text-[9px] text-gray-500">Teknopark</p>
              </div>
            </label>
            <label className="cursor-pointer">
              <input type="radio" name="bankCompany" value="bilisim" className="sr-only peer" />
              <div className="p-2.5 bg-white dark:bg-[#17181f] border-2 border-gray-200 peer-checked:border-indigo-500 peer-checked:bg-indigo-50 dark:peer-checked:bg-indigo-500/10 rounded-md text-center">
                <p className="text-[11px] font-bold text-gray-900 dark:text-gray-100">Arma Bilişim</p>
                <p className="text-[9px] text-gray-500">Standart</p>
              </div>
            </label>
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wider">Banka *</label>
          <select className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:border-indigo-500" defaultValue="Garanti BBVA">
            <option>Garanti BBVA</option>
            <option>Enpara (QNB)</option>
            <option>Türkiye Ekonomi Bankası (TEB)</option>
            <option>İş Bankası</option>
            <option>Yapı Kredi</option>
            <option>Akbank</option>
            <option>Ziraat Bankası</option>
            <option>Diğer...</option>
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <FormSelect label="Hesap Türü" values={['Ticari Mevduat', 'Kurumsal Dijital', 'Döviz (USD)', 'Döviz (EUR)', 'Döviz (GBP)']} />
          <FormSelect label="Para Birimi" values={['TRY', 'USD', 'EUR', 'GBP']} />
          <div>
            <label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1">Şube Kodu</label>
            <input type="text" placeholder="0089" className="w-full px-2 py-2 text-[11px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono focus:outline-none focus:border-indigo-500" />
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1">IBAN *</label>
          <input type="text" placeholder="TR__ ____ ____ ____ ____ ____ __" className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono focus:outline-none focus:border-indigo-500" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1">Hesap No</label>
            <input type="text" placeholder="1234567" className="w-full px-3 py-2 text-[11px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono focus:outline-none focus:border-indigo-500" />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1">Açılış Bakiyesi</label>
            <input type="text" placeholder="0,00" className="w-full px-3 py-2 text-[11px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono text-right focus:outline-none focus:border-indigo-500" />
          </div>
        </div>
        <label className="flex items-center gap-2 cursor-pointer p-3 bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/30 rounded-md">
          <input type="checkbox" defaultChecked className="rounded text-teal-600" />
          <div className="flex-1">
            <p className="text-[11px] font-bold text-teal-900 dark:text-teal-200">Paraşüt Otomatik Senkron</p>
            <p className="text-[9px] text-teal-700 dark:text-teal-300">Hesap Paraşüt'e bağlanacak · banka hareketleri otomatik çekilecek</p>
          </div>
        </label>
      </div>
      <div className="sticky bottom-0 bg-white dark:bg-[#1e1f26] border-t border-gray-100 dark:border-gray-700/60 p-4 flex items-center justify-end gap-2">
        <button type="button" onClick={onClose} className="px-3 py-2 text-[11px] font-semibold text-gray-600 dark:text-gray-400">İptal</button>
        <button type="button" onClick={() => { onToast('Hesap Eklendi', 'Banka hesabı sisteme eklendi · Paraşüt bağlantısı kuruluyor', 'indigo'); onClose(); }} className="flex items-center gap-1.5 px-4 py-2 text-[11px] font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-md">
          <Svg className="w-3 h-3"><polyline points="20 6 9 17 4 12" /></Svg>
          Hesabı Kaydet
        </button>
      </div>
    </ModalFrame>
  );
}

function FormSelect({ label, values }: { label: string; values: string[] }) {
  return (
    <div>
      <label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1">{label}</label>
      <select className="w-full px-2 py-2 text-[11px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:border-indigo-500" defaultValue={values[0]}>
        {values.map((value) => <option key={value}>{value}</option>)}
      </select>
    </div>
  );
}
