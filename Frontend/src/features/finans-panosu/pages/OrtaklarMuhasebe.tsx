import { type ReactNode, useMemo, useState } from 'react';

type ColorName = 'rose' | 'indigo' | 'violet' | 'emerald' | 'sky' | 'amber' | 'gray';
type PartnerTab = 'overview' | string;

type LastPayment = {
  date: string;
  amount: number;
  type: string;
  note: string;
};

type HisseliPartner = {
  id: string;
  name: string;
  role: string;
  sharePct: number;
  avatar: string;
  clr: ColorName;
  gmMaas: number;
  maasStatus: 'gm' | 'hisse';
  ytdReceived: number;
  ytdEntitled: number;
  diff: number;
  lastPayment: LastPayment;
  payFreq: 'aylik' | 'haftalik';
};

type KarRule = {
  area: string;
  basis: string;
  pct: number;
  note: string;
};

type KarPartner = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  clr: ColorName;
  ytdReceived: number;
  ytdEntitled: number;
  diff: number;
  rules: KarRule[];
  lastPayment: LastPayment;
};

type Partner = HisseliPartner | KarPartner;
type ToastState = { title: string; text: string; color: ColorName } | null;

const CM: Record<ColorName, { bg: string; t: string; border: string; bar: string; solid: string; hover: string }> = {
  rose: { bg: 'bg-rose-100 dark:bg-rose-900/30', t: 'text-rose-700 dark:text-rose-300', border: 'border-rose-200 dark:border-rose-500/30', bar: 'bg-gradient-to-r from-rose-400 to-rose-600', solid: 'bg-rose-600', hover: 'hover:bg-rose-700' },
  indigo: { bg: 'bg-indigo-100 dark:bg-indigo-900/30', t: 'text-indigo-700 dark:text-indigo-300', border: 'border-indigo-200 dark:border-indigo-500/30', bar: 'bg-gradient-to-r from-indigo-400 to-indigo-600', solid: 'bg-indigo-600', hover: 'hover:bg-indigo-700' },
  violet: { bg: 'bg-violet-100 dark:bg-violet-900/30', t: 'text-violet-700 dark:text-violet-300', border: 'border-violet-200 dark:border-violet-500/30', bar: 'bg-gradient-to-r from-violet-400 to-violet-600', solid: 'bg-violet-600', hover: 'hover:bg-violet-700' },
  emerald: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', t: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-500/30', bar: 'bg-gradient-to-r from-emerald-400 to-emerald-600', solid: 'bg-emerald-600', hover: 'hover:bg-emerald-700' },
  sky: { bg: 'bg-sky-100 dark:bg-sky-900/30', t: 'text-sky-700 dark:text-sky-300', border: 'border-sky-200 dark:border-sky-500/30', bar: 'bg-gradient-to-r from-sky-400 to-sky-600', solid: 'bg-sky-600', hover: 'hover:bg-sky-700' },
  amber: { bg: 'bg-amber-100 dark:bg-amber-900/30', t: 'text-amber-700 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-500/30', bar: 'bg-gradient-to-r from-amber-400 to-amber-600', solid: 'bg-amber-600', hover: 'hover:bg-amber-700' },
  gray: { bg: 'bg-gray-100 dark:bg-gray-800', t: 'text-gray-700 dark:text-gray-300', border: 'border-gray-200 dark:border-gray-600/50', bar: 'bg-gradient-to-r from-gray-400 to-gray-600', solid: 'bg-gray-600', hover: 'hover:bg-gray-700' },
};

const HISSELI: HisseliPartner[] = [
  { id: 'P-OSM', name: 'Osman Atasoy', role: 'CEO & Genel Müdür', sharePct: 30, avatar: 'OA', clr: 'rose', gmMaas: 50000, maasStatus: 'gm', ytdReceived: 420000, ytdEntitled: 390000, diff: 30000, lastPayment: { date: '01.04.2026', amount: 85000, type: 'monthly', note: 'GM maaş + hisse payı (Nisan)' }, payFreq: 'aylik' },
  { id: 'P-MRT', name: 'Murat Bak', role: 'Ortak · Operasyon', sharePct: 25, avatar: 'MB', clr: 'indigo', gmMaas: 0, maasStatus: 'hisse', ytdReceived: 310000, ytdEntitled: 325000, diff: -15000, lastPayment: { date: '22.04.2026', amount: 18000, type: 'weekly', note: 'Haftalık hisse payı' }, payFreq: 'haftalik' },
  { id: 'P-FTH', name: 'Fatih Bak', role: 'Ortak · Teknik', sharePct: 25, avatar: 'FB', clr: 'violet', gmMaas: 0, maasStatus: 'hisse', ytdReceived: 295000, ytdEntitled: 325000, diff: -30000, lastPayment: { date: '15.04.2026', amount: 72000, type: 'monthly', note: 'Aylık hisse payı' }, payFreq: 'aylik' },
  { id: 'P-SCD', name: 'Sacide Ziyaoğlu', role: 'Ortak · Yönetim', sharePct: 20, avatar: 'SZ', clr: 'emerald', gmMaas: 0, maasStatus: 'hisse', ytdReceived: 245000, ytdEntitled: 260000, diff: -15000, lastPayment: { date: '10.04.2026', amount: 54000, type: 'monthly', note: 'Aylık hisse payı' }, payFreq: 'aylik' },
];

const KAR_ORTAK: KarPartner[] = [
  {
    id: 'KO-ERH',
    name: 'Erhan Çalışkan',
    role: 'Kar Ortağı · Sosyal Medya & Prodüksiyon',
    avatar: 'EÇ',
    clr: 'sky',
    ytdReceived: 185000,
    ytdEntitled: 192000,
    diff: -7000,
    rules: [
      { area: 'Sosyal Medya', basis: 'Toplam ciro', pct: 50, note: 'SM çalışmaları cirodan %50' },
      { area: 'Prodüksiyon', basis: 'KDV + Kurumlar Vergisi sonrası net', pct: 40, note: 'Prod. net kardan %40' },
    ],
    lastPayment: { date: '12.04.2026', amount: 24500, type: 'monthly', note: 'Mart ayı SM %50 + Prod %40 hesaplaması' },
  },
  {
    id: 'KO-UGR',
    name: 'Uğur Erten',
    role: 'Pazarlama & Satış Direktörü · Prodüksiyon Kar Ortağı',
    avatar: 'UİE',
    clr: 'amber',
    ytdReceived: 215000,
    ytdEntitled: 225000,
    diff: -10000,
    rules: [
      { area: 'Satış · ADOS/Arma Talebi', basis: 'Satış cirosu', pct: 10, note: 'Talep Arma/ADOS’tan gelirse %10' },
      { area: 'Satış · Kendi Talebi', basis: 'Satış cirosu', pct: 20, note: 'Talebi kendi oluşturursa %20' },
      { area: 'Prodüksiyon', basis: 'Giderler sonrası net', pct: 50, note: 'Prod. giderler düştükten sonra %50' },
    ],
    lastPayment: { date: '18.04.2026', amount: 32000, type: 'monthly', note: 'Satış %10+%20 + Prod %50 hesaplaması' },
  },
];

const TEFE_ORANI = 3.2;

function isHisseli(partner: Partner): partner is HisseliPartner {
  return 'sharePct' in partner;
}

function money(value: number) {
  return `₺${value.toLocaleString('tr-TR')}`;
}

function diffColor(diff: number): ColorName {
  if (diff > 5000) return 'rose';
  if (diff < -5000) return 'amber';
  return 'emerald';
}

function Svg({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      {children}
    </svg>
  );
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

export default function OrtaklarMuhasebe() {
  const [tab, setTab] = useState<PartnerTab>('overview');
  const [paymentPartnerId, setPaymentPartnerId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>(null);

  const allPartners = useMemo(() => [...HISSELI, ...KAR_ORTAK], []);
  const selectedPartner = tab === 'overview' ? null : allPartners.find((partner) => partner.id === tab) ?? null;

  function showToast(title: string, text: string, color: ColorName = 'violet') {
    setToast({ title, text, color });
    window.setTimeout(() => setToast(null), 2600);
  }

  return (
    <div className="relative space-y-3">
      <ContentToast toast={toast} onClose={() => setToast(null)} />
      <HeaderSection onToast={showToast} onPayment={() => setPaymentPartnerId('P-OSM')} />
      <TabStrip tab={tab} onChange={setTab} />
      {selectedPartner ? (
        <PartnerDetail partner={selectedPartner} onPayment={(id) => setPaymentPartnerId(id)} onToast={showToast} />
      ) : (
        <PartnerOverview onSelect={setTab} />
      )}
      {paymentPartnerId ? (
        <PaymentModal selectedId={paymentPartnerId} onClose={() => setPaymentPartnerId(null)} onToast={showToast} />
      ) : null}
    </div>
  );
}

function HeaderSection({ onToast, onPayment }: { onToast: (title: string, text: string, color: ColorName) => void; onPayment: () => void }) {
  return (
    <div className="flex items-center justify-between gap-3 flex-wrap">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 bg-violet-100 dark:bg-violet-500/20 rounded-lg flex items-center justify-center">
          <Svg className="text-violet-600 dark:text-violet-400 w-4 h-4"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></Svg>
        </div>
        <div>
          <h1 className="text-[19px] font-bold text-gray-900 dark:text-gray-100 leading-tight">Ortaklar Muhasebesi</h1>
          <p className="text-[11px] text-gray-500 dark:text-gray-400">4 hisseli ortak · 2 kar ortağı · Arma Digital + Arma Bilişim · TEFE-TÜFE borçlanma sistemi</p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <button type="button" onClick={() => onToast('TEFE-TÜFE Güncelleme', 'Nisan 2026 TEFE-TÜFE oranı TÜİK’ten çekildi · %3.2', 'amber')} className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-300 text-[11px] font-semibold rounded-md hover:bg-amber-100">
          <Svg className="w-3.5 h-3.5"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></Svg>
          TEFE-TÜFE
        </button>
        <button type="button" onClick={onPayment} className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-[11px] font-semibold rounded-md hover:bg-gray-50">
          <Svg className="w-3.5 h-3.5"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></Svg>
          Ödeme Kaydet
        </button>
        <button type="button" onClick={() => onToast('Rapor', 'Ortaklar yıllık bilanço raporu hazırlanıyor', 'violet')} className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white text-[11px] font-bold rounded-md shadow-sm">
          <Svg className="w-3.5 h-3.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></Svg>
          Yıllık Rapor
        </button>
      </div>
    </div>
  );
}

function TabStrip({ tab, onChange }: { tab: PartnerTab; onChange: (tab: string) => void }) {
  const tabs = [
    { k: 'overview', lbl: 'Genel Bakış', clr: 'gray' as ColorName, icon: <circle cx="12" cy="12" r="10" /> },
    ...HISSELI.map((partner) => ({ k: partner.id, lbl: partner.name.split(' ')[0], clr: partner.clr, icon: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></> })),
    ...KAR_ORTAK.map((partner) => ({ k: partner.id, lbl: partner.name.split(' ')[0], clr: partner.clr, icon: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /> })),
  ];

  return (
    <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <div className="flex items-center gap-0.5 p-1.5 min-w-max">
          {tabs.map((item) => {
            const active = tab === item.k;
            const tClr = item.clr || 'gray';
            const cm = CM[tClr as ColorName];
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

function PartnerOverview({ onSelect }: { onSelect: (id: string) => void }) {
  const totalHisse = HISSELI.reduce((sum, partner) => sum + partner.sharePct, 0);
  const totalYtdReceived = HISSELI.reduce((sum, partner) => sum + partner.ytdReceived, 0);
  const totalYtdEntitled = HISSELI.reduce((sum, partner) => sum + partner.ytdEntitled, 0);
  const toplamDagitilabilir = 1300000;
  const fazlaCeken = HISSELI.filter((partner) => partner.diff > 0);
  const eksikAlan = HISSELI.filter((partner) => partner.diff < 0);

  return (
    <>
      <OwnershipCard totalHisse={totalHisse} totalYtdReceived={totalYtdReceived} />
      <KpiGrid totalYtdReceived={totalYtdReceived} totalYtdEntitled={totalYtdEntitled} toplamDagitilabilir={toplamDagitilabilir} fazlaCeken={fazlaCeken} eksikAlan={eksikAlan} />
      <HisseliCards onSelect={onSelect} />
      <TefePanel fazlaCeken={fazlaCeken} eksikAlan={eksikAlan} />
      <KarOrtakCards onSelect={onSelect} />
      <InfoBand />
    </>
  );
}

function OwnershipCard({ totalHisse, totalYtdReceived }: { totalHisse: number; totalYtdReceived: number }) {
  return (
    <div className="bg-gradient-to-br from-violet-50 via-indigo-50/40 to-transparent dark:from-violet-500/10 dark:via-indigo-500/5 border border-violet-200 dark:border-violet-500/30 rounded-xl p-4 md:p-5">
      <div className="flex items-start justify-between gap-3 flex-wrap mb-4">
        <div>
          <h3 className="text-[14px] font-bold text-gray-900 dark:text-gray-100">Sahiplik Yapısı</h3>
          <p className="text-[11px] text-gray-500 dark:text-gray-400">Arma Digital Medya A.Ş. + Arma Bilişim Ltd. Şti. ortak hisseleri</p>
        </div>
        <div className="flex items-center gap-4 text-[10px]">
          <div>
            <p className="text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Toplam Hisse</p>
            <p className="font-black text-violet-700 dark:text-violet-300 font-mono text-[14px]">%{totalHisse}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Bu Yıl Dağıtılan</p>
            <p className="font-black text-violet-700 dark:text-violet-300 font-mono text-[14px]">₺{(totalYtdReceived / 1000).toFixed(0)}K</p>
          </div>
        </div>
      </div>
      <div className="flex rounded-lg overflow-hidden h-8 mb-3">
        {HISSELI.map((partner) => (
          <div key={partner.id} className={`bg-gradient-to-r from-${partner.clr}-500 to-${partner.clr}-600 flex items-center justify-center text-white text-[10px] font-black`} style={{ width: `${partner.sharePct}%` }} title={`${partner.name} %${partner.sharePct}`}>
            %{partner.sharePct}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {HISSELI.map((partner) => {
          const cm = CM[partner.clr];
          return (
            <div key={partner.id} className="flex items-center gap-2">
              <div className={`w-2 h-2 bg-gradient-to-r from-${partner.clr}-500 to-${partner.clr}-600 rounded-full shrink-0`} />
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-gray-900 dark:text-gray-100 truncate">{partner.name}</p>
                <p className={`text-[9px] ${cm.t} font-mono`}>%{partner.sharePct}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function KpiGrid({ totalYtdReceived, totalYtdEntitled, toplamDagitilabilir, fazlaCeken, eksikAlan }: { totalYtdReceived: number; totalYtdEntitled: number; toplamDagitilabilir: number; fazlaCeken: HisseliPartner[]; eksikAlan: HisseliPartner[] }) {
  const cards = [
    { label: 'Dağıtılabilir Kar', value: `₺${(toplamDagitilabilir / 1000).toFixed(0)}K`, sub: 'YTD net karın payı', clr: 'emerald' as ColorName },
    { label: 'Dağıtılan', value: `₺${(totalYtdReceived / 1000).toFixed(0)}K`, sub: '2026 başından beri', clr: 'sky' as ColorName },
    { label: 'Hak Edilen', value: `₺${(totalYtdEntitled / 1000).toFixed(0)}K`, sub: 'Hisse oranlarına göre', clr: 'violet' as ColorName },
    { label: 'Fazla Çeken', value: String(fazlaCeken.length), sub: fazlaCeken.length > 0 ? `${fazlaCeken[0].name.split(' ')[0]} ₺${(fazlaCeken[0].diff / 1000).toFixed(0)}K fazla` : 'Yok', clr: fazlaCeken.length > 0 ? 'rose' as ColorName : 'emerald' as ColorName },
    { label: 'Eksik Alan', value: String(eksikAlan.length), sub: `${eksikAlan.length} ortak eksik aldı`, clr: 'amber' as ColorName },
    { label: 'TEFE-TÜFE', value: `%${TEFE_ORANI}`, sub: 'Nisan 2026 · TÜİK', clr: 'indigo' as ColorName },
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

function HisseliCards({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Svg className="text-violet-600 dark:text-violet-400 w-4 h-4"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></Svg>
        <h3 className="text-[14px] font-bold text-gray-900 dark:text-gray-100">Hisseli Ortaklar</h3>
        <span className="text-[9px] font-bold px-1.5 py-0.5 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded">4 ORTAK · %100</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {HISSELI.map((partner) => <HisseliCard key={partner.id} partner={partner} onSelect={onSelect} />)}
      </div>
    </div>
  );
}

function HisseliCard({ partner, onSelect }: { partner: HisseliPartner; onSelect: (id: string) => void }) {
  const cm = CM[partner.clr];
  const statusClr = diffColor(partner.diff);
  const scm = CM[statusClr];
  const statusLbl = partner.diff > 5000 ? 'FAZLA ÇEKTİ' : partner.diff < -5000 ? 'EKSİK ALDI' : 'DENGELİ';
  return (
    <div className={`bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden hover:border-${partner.clr}-400 transition-colors cursor-pointer`} onClick={() => onSelect(partner.id)}>
      <div className={`p-4 bg-gradient-to-br from-${partner.clr}-50 to-${partner.clr}-100/40 dark:from-${partner.clr}-500/10 dark:to-${partner.clr}-500/5 border-b border-${partner.clr}-200/50 dark:border-${partner.clr}-500/20 flex items-center gap-3`}>
        <div className={`w-14 h-14 bg-gradient-to-br from-${partner.clr}-500 to-${partner.clr}-600 rounded-full flex items-center justify-center shrink-0 shadow-md`}>
          <span className="text-white font-black text-[16px]">{partner.avatar}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-[14px] font-black text-gray-900 dark:text-gray-100 truncate">{partner.name}</p>
            {partner.maasStatus === 'gm' ? <span className="inline-flex text-[8px] font-bold px-1.5 py-0.5 bg-amber-500 text-white rounded">GM</span> : null}
          </div>
          <p className={`text-[10px] ${cm.t} font-semibold mt-0.5 truncate`}>{partner.role}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 ${cm.bg} ${cm.t} rounded`}>%{partner.sharePct} HİSSE</span>
            <span className={`inline-flex text-[9px] font-bold px-1.5 py-0.5 ${scm.bg} ${scm.t} rounded`}>{statusLbl}</span>
          </div>
        </div>
      </div>
      <div className="p-3 space-y-2">
        {partner.gmMaas > 0 ? (
          <div className="flex items-center justify-between p-2 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-md">
            <div className="flex items-center gap-1.5">
              <Svg className="text-amber-600 dark:text-amber-400 w-3 h-3"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></Svg>
              <span className="text-[10px] font-bold text-amber-800 dark:text-amber-200">Genel Müdür Maaşı</span>
            </div>
            <span className="text-[11px] font-black font-mono text-amber-700 dark:text-amber-300">{money(partner.gmMaas)}/ay</span>
          </div>
        ) : null}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-[9px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">YTD Alınan</p>
            <p className="text-[13px] font-black text-gray-900 dark:text-gray-100 font-mono">₺{(partner.ytdReceived / 1000).toFixed(0)}K</p>
          </div>
          <div>
            <p className="text-[9px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">Hak Edilen</p>
            <p className={`text-[13px] font-black ${cm.t} font-mono`}>₺{(partner.ytdEntitled / 1000).toFixed(0)}K</p>
          </div>
        </div>
        <div className="pt-2 border-t border-gray-100 dark:border-gray-700/40 flex items-center justify-between">
          <div>
            <p className="text-[9px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">Denge</p>
            <p className={`text-[12px] font-bold font-mono ${scm.t}`}>{partner.diff > 0 ? '+' : ''}{money(partner.diff)}</p>
          </div>
          <div className="text-right">
            <p className="text-[9px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">Son Ödeme</p>
            <p className="text-[10px] font-semibold text-gray-700 dark:text-gray-300 font-mono">{partner.lastPayment.date}</p>
            <p className="text-[9px] text-gray-500">{partner.payFreq === 'haftalik' ? 'Haftalık' : 'Aylık'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TefePanel({ fazlaCeken, eksikAlan }: { fazlaCeken: HisseliPartner[]; eksikAlan: HisseliPartner[] }) {
  if (fazlaCeken.length === 0 && eksikAlan.length === 0) return null;
  return (
    <div className="bg-gradient-to-br from-amber-50 via-rose-50/40 to-transparent dark:from-amber-500/10 dark:via-rose-500/5 border-2 border-amber-200 dark:border-amber-500/30 rounded-xl overflow-hidden">
      <div className="p-3 border-b border-amber-200/50 dark:border-amber-500/20 flex items-center gap-2">
        <Svg className="text-amber-600 dark:text-amber-400 w-4 h-4"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></Svg>
        <h3 className="text-[13px] font-bold text-amber-900 dark:text-amber-200">TEFE-TÜFE Borçlanma Sistemi</h3>
        <span className="text-[9px] font-bold px-1.5 py-0.5 bg-amber-200 dark:bg-amber-500/30 text-amber-800 dark:text-amber-200 rounded">%{TEFE_ORANI} · NİSAN 2026</span>
      </div>
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        <PartnerDebtList title="Fazla Çeken Ortaklar (Borçlu)" items={fazlaCeken} kind="debt" />
        <PartnerDebtList title="Eksik Alan Ortaklar (Alacaklı)" items={eksikAlan} kind="credit" />
      </div>
      <div className="p-3 border-t border-amber-200/50 dark:border-amber-500/20 bg-amber-100/30 dark:bg-amber-500/5 text-[10px] text-amber-900 dark:text-amber-200">
        <span className="font-bold">Sistem:</span> Fazla çeken ortak, eksik alan ortaklara TEFE-TÜFE oranında faiz borçlanır. Borç ödenene kadar her ay faiz işler. Denge sağlandığında borç silinir.
      </div>
    </div>
  );
}

function PartnerDebtList({ title, items, kind }: { title: string; items: HisseliPartner[]; kind: 'debt' | 'credit' }) {
  const mainColor = kind === 'debt' ? 'rose' : 'emerald';
  return (
    <div>
      <p className={`text-[10px] font-bold text-${mainColor}-700 dark:text-${mainColor}-300 uppercase tracking-wider mb-2 flex items-center gap-1`}>
        <Svg className="w-3 h-3">{kind === 'debt' ? <><polyline points="17 11 12 6 7 11" /><line x1="12" y1="18" x2="12" y2="6" /></> : <><polyline points="7 13 12 18 17 13" /><line x1="12" y1="6" x2="12" y2="18" /></>}</Svg>
        {title}
      </p>
      {items.length === 0 ? <p className="text-[11px] text-gray-500 italic">Şu an fazla çeken yok</p> : null}
      {items.map((partner) => (
        <div key={partner.id} className={`p-2.5 bg-white dark:bg-[#17181f] border border-${mainColor}-200 dark:border-${mainColor}-500/30 rounded-md mb-2`}>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className={`w-7 h-7 bg-gradient-to-br from-${partner.clr}-500 to-${partner.clr}-600 rounded-full flex items-center justify-center text-white text-[10px] font-bold`}>{partner.avatar}</div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-gray-900 dark:text-gray-100 truncate">{partner.name}</p>
                <p className="text-[9px] text-gray-500">{kind === 'debt' ? 'Fazla çekti' : 'Hak edilenden az aldı'}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-[13px] font-black font-mono text-${mainColor}-700 dark:text-${mainColor}-300`}>{kind === 'debt' ? '+' : ''}₺{(partner.diff / 1000).toFixed(0)}K</p>
              <p className="text-[9px] text-gray-500">TEFE faiz {money(Math.round(Math.abs(partner.diff) * TEFE_ORANI / 100))}/ay</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function KarOrtakCards({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Svg className="text-amber-600 dark:text-amber-400 w-4 h-4"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></Svg>
        <h3 className="text-[14px] font-bold text-gray-900 dark:text-gray-100">Kar Ortakları</h3>
        <span className="text-[9px] font-bold px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded">2 ORTAK · PROJE BAZLI</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {KAR_ORTAK.map((partner) => <KarOrtakCard key={partner.id} partner={partner} onSelect={onSelect} />)}
      </div>
    </div>
  );
}

function KarOrtakCard({ partner, onSelect }: { partner: KarPartner; onSelect: (id: string) => void }) {
  const cm = CM[partner.clr];
  return (
    <div className={`bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden hover:border-${partner.clr}-400 transition-colors cursor-pointer`} onClick={() => onSelect(partner.id)}>
      <div className={`p-4 bg-gradient-to-br from-${partner.clr}-50 to-${partner.clr}-100/40 dark:from-${partner.clr}-500/10 dark:to-${partner.clr}-500/5 border-b border-${partner.clr}-200/50 dark:border-${partner.clr}-500/20 flex items-center gap-3`}>
        <div className={`w-14 h-14 bg-gradient-to-br from-${partner.clr}-500 to-${partner.clr}-600 rounded-full flex items-center justify-center shrink-0 shadow-md`}>
          <span className="text-white font-black text-[13px]">{partner.avatar}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-black text-gray-900 dark:text-gray-100 truncate">{partner.name}</p>
          <p className={`text-[10px] ${cm.t} font-semibold mt-0.5 line-clamp-2`}>{partner.role}</p>
          <span className={`inline-flex mt-1 text-[9px] font-bold px-1.5 py-0.5 ${cm.bg} ${cm.t} rounded`}>KAR ORTAĞI · {partner.rules.length} KURAL</span>
        </div>
      </div>
      <div className="p-3 space-y-1.5">
        <p className="text-[9px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Kar Paylaşım Kuralları</p>
        {partner.rules.map((rule) => (
          <div key={rule.area} className="p-2 bg-gray-50 dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md">
            <div className="flex items-center justify-between gap-2 mb-0.5">
              <p className="text-[11px] font-bold text-gray-900 dark:text-gray-100 truncate">{rule.area}</p>
              <span className={`text-[11px] font-black font-mono ${cm.t} shrink-0`}>%{rule.pct}</span>
            </div>
            <p className="text-[9px] text-gray-500 dark:text-gray-400 truncate">{rule.basis}</p>
          </div>
        ))}
      </div>
      <div className="p-3 border-t border-gray-100 dark:border-gray-700/40 grid grid-cols-2 gap-2 text-[10px]">
        <div>
          <p className="text-gray-500 dark:text-gray-400 uppercase tracking-wider">YTD Alınan</p>
          <p className="font-black text-gray-900 dark:text-gray-100 font-mono text-[12px]">₺{(partner.ytdReceived / 1000).toFixed(0)}K</p>
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400 uppercase tracking-wider">Son Ödeme</p>
          <p className="font-semibold text-gray-700 dark:text-gray-300 font-mono text-[11px]">{partner.lastPayment.date}</p>
          <p className="text-[9px] text-gray-500 truncate">{money(partner.lastPayment.amount)}</p>
        </div>
      </div>
    </div>
  );
}

function InfoBand() {
  return (
    <div className="bg-gradient-to-br from-violet-50/50 via-transparent to-amber-50/50 dark:from-violet-500/5 dark:to-amber-500/5 border border-violet-200/50 dark:border-violet-500/20 rounded-xl p-3 flex items-start gap-2.5">
      <Svg className="text-violet-600 dark:text-violet-400 w-4 h-4 shrink-0 mt-0.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></Svg>
      <div className="flex-1">
        <p className="text-[11px] text-gray-700 dark:text-gray-300">
          <span className="font-bold text-violet-700 dark:text-violet-300">Hisseli ortaklar</span> şirket karından hisse oranlarına göre pay alır ·
          {' '}<span className="font-bold text-amber-700 dark:text-amber-300">Osman Atasoy</span> ayrıca GM olarak ₺50K/ay maaş alır ·
          {' '}<span className="font-bold text-rose-700 dark:text-rose-300">Fazla çeken</span> ortak diğerlerine TEFE-TÜFE ile borçlanır (Nisan 2026: %{TEFE_ORANI}) ·
          {' '}<span className="font-bold text-sky-700 dark:text-sky-300">Kar ortakları</span> kendi alanlarında yapılan işlerin cirosundan/kârından yüzde alır · ay sonu hesaplanır.
        </p>
      </div>
    </div>
  );
}

function PartnerDetail({ partner, onPayment, onToast }: { partner: Partner; onPayment: (id: string) => void; onToast: (title: string, text: string, color: ColorName) => void }) {
  const cm = CM[partner.clr];
  const hisseli = isHisseli(partner);
  const dClr = diffColor(partner.diff);
  const history = paymentHistory(partner);

  return (
    <>
      <div className={`bg-gradient-to-br from-${partner.clr}-50 via-${partner.clr}-100/40 to-transparent dark:from-${partner.clr}-500/15 dark:via-${partner.clr}-500/5 border-2 border-${partner.clr}-200 dark:border-${partner.clr}-500/30 rounded-xl overflow-hidden`}>
        <div className="p-5 md:p-6 flex items-start gap-4 flex-wrap">
          <div className={`w-20 h-20 bg-gradient-to-br from-${partner.clr}-500 to-${partner.clr}-600 rounded-full flex items-center justify-center shrink-0 shadow-lg`}>
            <span className="text-white font-black text-[24px]">{partner.avatar}</span>
          </div>
          <div className="flex-1 min-w-[220px]">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h2 className={`text-[20px] font-black ${cm.t}`}>{partner.name}</h2>
              {hisseli ? <span className="inline-flex text-[9px] font-bold px-2 py-0.5 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded">HİSSELİ ORTAK · %{partner.sharePct}</span> : <span className="inline-flex text-[9px] font-bold px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded">KAR ORTAĞI</span>}
              {hisseli && partner.maasStatus === 'gm' ? <span className="inline-flex text-[9px] font-bold px-2 py-0.5 bg-amber-500 text-white rounded">GM MAAŞLI</span> : null}
            </div>
            <p className="text-[12px] text-gray-600 dark:text-gray-400 mb-3">{partner.role}</p>
            {hisseli ? <HisseliDetailMeta partner={partner} dClr={dClr} /> : <KarDetailMeta partner={partner} cm={cm} />}
          </div>
          <div className="flex flex-col gap-2 min-w-[140px]">
            <button type="button" onClick={() => onPayment(partner.id)} className={`flex items-center justify-center gap-1.5 px-3 py-2 bg-${partner.clr}-600 hover:bg-${partner.clr}-700 text-white text-[11px] font-bold rounded-md shadow-sm`}>
              <Svg className="w-3.5 h-3.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></Svg>
              Yeni Ödeme
            </button>
            <button type="button" onClick={() => onToast('Düzenle', `${partner.name} bilgileri düzenleme formu`, 'violet')} className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-[11px] font-semibold rounded-md hover:bg-gray-50">
              <Svg className="w-3.5 h-3.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></Svg>
              Düzenle
            </button>
          </div>
        </div>
      </div>
      {hisseli ? <HisseliBalancePanel partner={partner} dClr={dClr} /> : <KarRulesPanel partner={partner} />}
      <PaymentHistoryPanel partner={partner} history={history} cm={cm} />
    </>
  );
}

function HisseliDetailMeta({ partner, dClr }: { partner: HisseliPartner; dClr: ColorName }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[10px]">
      <Meta label="Hisse" value={`%${partner.sharePct}`} className={`${CM[partner.clr].t} font-mono text-[14px]`} />
      {partner.gmMaas > 0 ? <Meta label="GM Maaşı" value={`${money(partner.gmMaas / 1000)}K/ay`} className="text-amber-700 dark:text-amber-300 font-mono text-[14px]" /> : <Meta label="Ödeme Sıklığı" value={partner.payFreq === 'haftalik' ? 'Haftalık' : 'Aylık'} className="text-gray-900 dark:text-gray-100 text-[13px]" />}
      <Meta label="YTD Alınan" value={`₺${(partner.ytdReceived / 1000).toFixed(0)}K`} className="text-gray-900 dark:text-gray-100 font-mono text-[14px]" />
      <Meta label="Denge" value={`${partner.diff > 0 ? '+' : ''}₺${(partner.diff / 1000).toFixed(0)}K`} className={`text-${dClr}-700 dark:text-${dClr}-300 font-mono text-[14px]`} />
    </div>
  );
}

function KarDetailMeta({ partner, cm }: { partner: KarPartner; cm: { t: string } }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-[10px]">
      <Meta label="Kural Sayısı" value={String(partner.rules.length)} className={`${cm.t} font-mono text-[14px]`} />
      <Meta label="YTD Alınan" value={`₺${(partner.ytdReceived / 1000).toFixed(0)}K`} className="text-gray-900 dark:text-gray-100 font-mono text-[14px]" />
      <Meta label="Son Ödeme" value={partner.lastPayment.date} className="text-gray-900 dark:text-gray-100 font-mono text-[14px]" />
    </div>
  );
}

function Meta({ label, value, className }: { label: string; value: string; className: string }) {
  return (
    <div>
      <p className="text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">{label}</p>
      <p className={`font-black mt-0.5 ${className}`}>{value}</p>
    </div>
  );
}

function HisseliBalancePanel({ partner, dClr }: { partner: HisseliPartner; dClr: ColorName }) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <BalanceCard label="Hak Edilen (YTD)" value={money(partner.ytdEntitled)} sub={`Net karın %${partner.sharePct}'i`} color="violet" />
        <BalanceCard label="Fiilen Alınan" value={money(partner.ytdReceived)} sub={partner.gmMaas > 0 ? 'GM maaşı + hisse toplamı' : 'Sadece hisse payı'} color="sky" />
        <div className={`p-4 bg-gradient-to-br from-${dClr}-50 to-${dClr}-100/50 dark:from-${dClr}-500/10 dark:to-${dClr}-500/5 border-2 border-${dClr}-300 dark:border-${dClr}-500/40 rounded-xl`}>
          <p className={`text-[10px] font-bold text-${dClr}-700 dark:text-${dClr}-300 uppercase tracking-wider mb-1`}>Fark (Denge)</p>
          <p className={`text-[22px] font-black font-mono text-${dClr}-700 dark:text-${dClr}-300`}>{partner.diff > 0 ? '+' : ''}{money(partner.diff)}</p>
          <p className={`text-[10px] text-${dClr}-700 dark:text-${dClr}-400 mt-1`}>{partner.diff > 5000 ? 'Fazla çekti · TEFE-TÜFE ile borçlu' : partner.diff < -5000 ? 'Eksik aldı · diğerleri borçlu' : 'Dengeli'}</p>
        </div>
      </div>
      {Math.abs(partner.diff) > 5000 ? <TefeInterestPanel partner={partner} dClr={dClr} /> : null}
    </>
  );
}

function BalanceCard({ label, value, sub, color }: { label: string; value: string; sub: string; color: ColorName }) {
  return (
    <div className="p-4 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl">
      <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-[22px] font-black font-mono ${CM[color].t}`}>{value}</p>
      <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">{sub}</p>
    </div>
  );
}

function TefeInterestPanel({ partner, dClr }: { partner: HisseliPartner; dClr: ColorName }) {
  return (
    <div className="bg-gradient-to-br from-amber-50 to-rose-50/50 dark:from-amber-500/10 dark:to-rose-500/5 border border-amber-200 dark:border-amber-500/30 rounded-xl overflow-hidden">
      <div className="p-3 border-b border-amber-200/50 dark:border-amber-500/20 flex items-center gap-2">
        <Svg className="text-amber-600 dark:text-amber-400 w-4 h-4"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /></Svg>
        <h3 className="text-[13px] font-bold text-amber-900 dark:text-amber-200">TEFE-TÜFE Faiz Hesaplaması</h3>
        <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 bg-amber-200 dark:bg-amber-500/30 text-amber-800 dark:text-amber-200 rounded">%{TEFE_ORANI}</span>
      </div>
      <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-3">
        <Calc label="Anapara" value={money(Math.abs(partner.diff))} color="gray" />
        <Calc label="TEFE-TÜFE Oranı" value={`%${TEFE_ORANI}`} color="amber" />
        <Calc label="Aylık Faiz" value={money(Math.round(Math.abs(partner.diff) * TEFE_ORANI / 100))} color="rose" />
        <div>
          <p className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider">{partner.diff > 0 ? 'Borç Durumu' : 'Alacak Durumu'}</p>
          <p className={`text-[14px] font-bold text-${dClr}-700 dark:text-${dClr}-300 mt-0.5`}>{partner.diff > 0 ? 'Diğerlerine borçlu' : 'Diğerlerinden alacaklı'}</p>
        </div>
      </div>
      <div className="p-3 bg-amber-100/30 dark:bg-amber-500/5 border-t border-amber-200/50 dark:border-amber-500/20 text-[10px] text-amber-900 dark:text-amber-200">
        <span className="font-bold">Not:</span> Bu fark kapatılmazsa her ay TEFE-TÜFE oranında faiz işlemeye devam eder. Dengeye getirmek için {partner.diff > 0 ? 'bu ortağa ödeme yapılmamalı veya diğer ortaklara ek ödeme yapılmalı' : 'bu ortağa ek ödeme yapılmalı'}.
      </div>
    </div>
  );
}

function Calc({ label, value, color }: { label: string; value: string; color: ColorName }) {
  return (
    <div>
      <p className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider">{label}</p>
      <p className={`text-[16px] font-black font-mono ${CM[color].t} mt-0.5`}>{value}</p>
    </div>
  );
}

function KarRulesPanel({ partner }: { partner: KarPartner }) {
  const cm = CM[partner.clr];
  return (
    <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
      <div className="p-3 border-b border-gray-100 dark:border-gray-700/40 flex items-center gap-2">
        <Svg className={`${cm.t} w-4 h-4`}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></Svg>
        <h3 className="text-[13px] font-bold text-gray-900 dark:text-gray-100">Kar Paylaşım Kuralları</h3>
      </div>
      <div className="divide-y divide-gray-100 dark:divide-gray-700/30">
        {partner.rules.map((rule, index) => (
          <div key={rule.area} className="p-4 hover:bg-gray-50 dark:hover:bg-white/5">
            <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 ${cm.bg} rounded-lg flex items-center justify-center shrink-0`}>
                  <span className={`text-[12px] font-black ${cm.t}`}>{index + 1}</span>
                </div>
                <div>
                  <p className="text-[13px] font-bold text-gray-900 dark:text-gray-100">{rule.area}</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">Hesap tabanı: {rule.basis}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-[24px] font-black ${cm.t} font-mono leading-none`}>%{rule.pct}</p>
                <p className="text-[9px] text-gray-500 dark:text-gray-400">pay oranı</p>
              </div>
            </div>
            <p className="text-[10px] text-gray-600 dark:text-gray-400 p-2 bg-gray-50 dark:bg-[#17181f] rounded">{rule.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function paymentHistory(partner: Partner) {
  if (isHisseli(partner)) {
    return [
      { ay: 'Nisan 2026', amount: partner.lastPayment.amount, type: partner.payFreq, date: partner.lastPayment.date, note: partner.lastPayment.note },
      { ay: 'Mart 2026', amount: Math.round(partner.ytdReceived / 4.5), type: partner.payFreq, date: '01.03.2026', note: partner.gmMaas > 0 ? 'GM maaş + hisse' : 'Hisse payı' },
      { ay: 'Şubat 2026', amount: Math.round(partner.ytdReceived / 4.5), type: partner.payFreq, date: '01.02.2026', note: partner.gmMaas > 0 ? 'GM maaş + hisse' : 'Hisse payı' },
      { ay: 'Ocak 2026', amount: Math.round(partner.ytdReceived / 4.5), type: partner.payFreq, date: '01.01.2026', note: partner.gmMaas > 0 ? 'GM maaş + hisse' : 'Hisse payı' },
      { ay: 'Aralık 2025', amount: Math.round(partner.ytdReceived / 4.5 * 0.95), type: partner.payFreq, date: '01.12.2025', note: partner.gmMaas > 0 ? 'GM maaş + hisse' : 'Hisse payı' },
      { ay: 'Kasım 2025', amount: Math.round(partner.ytdReceived / 4.5 * 0.95), type: partner.payFreq, date: '01.11.2025', note: partner.gmMaas > 0 ? 'GM maaş + hisse' : 'Hisse payı' },
    ];
  }

  return [
    { ay: 'Nisan 2026', amount: partner.lastPayment.amount, type: 'monthly', date: partner.lastPayment.date, note: partner.lastPayment.note },
    { ay: 'Mart 2026', amount: Math.round(partner.ytdReceived / 4), type: 'monthly', date: '15.03.2026', note: 'Mart ayı kar ortaklığı hesaplaması' },
    { ay: 'Şubat 2026', amount: Math.round(partner.ytdReceived / 4 * 0.9), type: 'monthly', date: '15.02.2026', note: 'Şubat ayı hesaplama' },
    { ay: 'Ocak 2026', amount: Math.round(partner.ytdReceived / 4 * 1.1), type: 'monthly', date: '15.01.2026', note: 'Ocak ayı hesaplama' },
  ];
}

function PaymentHistoryPanel({ history, cm }: { partner: Partner; history: ReturnType<typeof paymentHistory>; cm: { t: string } }) {
  return (
    <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
      <div className="p-3 border-b border-gray-100 dark:border-gray-700/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Svg className={`${cm.t} w-4 h-4`}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></Svg>
          <h3 className="text-[13px] font-bold text-gray-900 dark:text-gray-100">Son 6 Ay Ödeme Geçmişi</h3>
        </div>
        <span className="text-[10px] text-gray-500">Toplam: <span className="font-mono font-bold text-gray-900 dark:text-gray-100">{money(history.reduce((sum, item) => sum + item.amount, 0))}</span></span>
      </div>
      <div className="divide-y divide-gray-100 dark:divide-gray-700/30">
        {history.map((item) => (
          <div key={`${item.ay}-${item.date}`} className="p-3 flex items-center justify-between gap-3 hover:bg-gray-50 dark:hover:bg-white/5">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="w-9 h-9 bg-emerald-100 dark:bg-emerald-500/20 rounded flex items-center justify-center shrink-0">
                <Svg className="text-emerald-600 dark:text-emerald-400 w-4 h-4"><polyline points="20 6 9 17 4 12" /></Svg>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100">{item.ay}</p>
                  <span className="inline-flex text-[9px] font-bold px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 rounded">ÖDENDİ</span>
                  <span className="text-[9px] text-gray-500 font-mono">{item.date}</span>
                </div>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{item.note}</p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[14px] font-black font-mono text-gray-900 dark:text-gray-100">{money(item.amount)}</p>
              <p className="text-[9px] text-gray-500 dark:text-gray-400">{item.type === 'weekly' || item.type === 'haftalik' ? 'Haftalık' : 'Aylık'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PaymentModal({ selectedId, onClose, onToast }: { selectedId: string; onClose: () => void; onToast: (title: string, text: string, color: ColorName) => void }) {
  const partners = [...HISSELI, ...KAR_ORTAK];

  return (
    <div className="absolute inset-0 z-30">
      <div className="modal-overlay absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="modal-panel absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
        <div className="modal-scroll bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-xl w-full max-w-[620px] max-h-[92vh] overflow-y-auto pointer-events-auto">
          <div className="sticky top-0 z-10 bg-white dark:bg-[#1e1f26] border-b border-gray-100 dark:border-gray-700/60 p-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-violet-100 dark:bg-violet-500/20 rounded-lg flex items-center justify-center">
                <Svg className="text-violet-600 dark:text-violet-400 w-4 h-4"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></Svg>
              </div>
              <div>
                <h2 className="text-[15px] font-bold text-gray-900 dark:text-gray-100">Ortağa Ödeme Kaydet</h2>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">Hisseli veya kar ortağına ödeme</p>
              </div>
            </div>
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-700 p-1">
              <Svg className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Svg>
            </button>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wider">Ortak *</label>
              <select defaultValue={selectedId} className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:border-violet-500">
                <optgroup label="Hisseli Ortaklar">
                  {HISSELI.map((partner) => <option key={partner.id} value={partner.id}>{partner.name} · %{partner.sharePct} hisse{partner.gmMaas ? ' + GM' : ''}</option>)}
                </optgroup>
                <optgroup label="Kar Ortakları">
                  {KAR_ORTAK.map((partner) => <option key={partner.id} value={partner.id}>{partner.name}</option>)}
                </optgroup>
              </select>
            </div>
            <PaymentTypeGrid />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1">Dönem</label>
                <select className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:border-violet-500" defaultValue="Nisan 2026">
                  <option>Nisan 2026</option>
                  <option>Mart 2026</option>
                  <option>Şubat 2026</option>
                  <option>Haftalık · 22-28 Nisan</option>
                  <option>Diğer...</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1">Tutar *</label>
                <input type="text" placeholder="85.000,00" className="w-full px-3 py-2 text-[13px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono text-right font-bold focus:outline-none focus:border-violet-500" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1">Ödenecek Hesap</label>
              <select className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:border-violet-500" defaultValue="garanti-digital">
                <option value="garanti-digital">Garanti · Arma Digital (TR••••1234)</option>
                <option value="garanti-bilisim">Garanti · Arma Bilişim (TR••••5678)</option>
                <option value="enpara-digital">Enpara · Arma Digital (TR••••8842)</option>
                <option value="teb-bilisim">TEB · Arma Bilişim (TR••••9451)</option>
              </select>
            </div>
            <div className="p-3 bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/30 rounded-md">
              <p className="text-[10px] font-bold text-sky-900 dark:text-sky-200 mb-2">Kar Ortağı Otomatik Hesaplama (seçildiğinde)</p>
              <div className="space-y-1.5 text-[10px] text-sky-800 dark:text-sky-300">
                <p>• <span className="font-bold">Sosyal Medya</span>: Toplam cironun %50'si otomatik hesaplanır</p>
                <p>• <span className="font-bold">Prodüksiyon (Erhan)</span>: KDV + Kurumlar Vergisi düşüldükten sonra net kârın %40'ı</p>
                <p>• <span className="font-bold">Prodüksiyon (Uğur)</span>: Giderler düşüldükten sonra net kârın %50'si</p>
                <p>• <span className="font-bold">Satış (ADOS talebi)</span>: %10 · <span className="font-bold">Kendi talebi</span>: %20</p>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1">Açıklama / Not</label>
              <textarea rows={2} placeholder="Ödeme hakkında not..." className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 resize-none focus:outline-none focus:border-violet-500" />
            </div>
            <div className="p-3 bg-gradient-to-br from-violet-50 to-amber-50/50 dark:from-violet-500/10 dark:to-amber-500/5 border border-violet-200 dark:border-violet-500/30 rounded-md flex items-start gap-2">
              <Svg className="text-violet-600 dark:text-violet-400 w-4 h-4 shrink-0 mt-0.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /></Svg>
              <div className="text-[10px]">
                <p className="font-bold text-violet-900 dark:text-violet-200">Kayıt sonrası</p>
                <p className="text-violet-700 dark:text-violet-300 mt-0.5">Ödeme banka hareketi olarak işlenir · ortağın YTD'si güncellenir · hisseli ortaklar için denge farkı TEFE-TÜFE ile yeniden hesaplanır · Paraşüt'e gider kaydı açılır</p>
              </div>
            </div>
          </div>
          <div className="sticky bottom-0 bg-white dark:bg-[#1e1f26] border-t border-gray-100 dark:border-gray-700/60 p-4 flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className="px-3 py-2 text-[11px] font-semibold text-gray-600 dark:text-gray-400">İptal</button>
            <button type="button" onClick={() => { onToast('Ödeme Kaydedildi', 'Ortak ödemesi sisteme işlendi · YTD güncellendi · TEFE denge yeniden hesaplandı', 'violet'); onClose(); }} className="flex items-center gap-1.5 px-4 py-2 text-[11px] font-bold bg-violet-600 hover:bg-violet-700 text-white rounded-md">
              <Svg className="w-3 h-3"><polyline points="20 6 9 17 4 12" /></Svg>
              Ödemeyi Kaydet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PaymentTypeGrid() {
  const types = [
    { value: 'hisse', title: 'Hisse Payı', sub: 'Kar dağıtımı', color: 'violet' as ColorName },
    { value: 'gm', title: 'GM Maaşı', sub: 'Sadece Osman', color: 'amber' as ColorName },
    { value: 'kar', title: 'Kar Ortağı', sub: '% hesaplama', color: 'sky' as ColorName },
    { value: 'denge', title: 'Denge Ödemesi', sub: 'TEFE kapanış', color: 'emerald' as ColorName },
  ];
  return (
    <div>
      <label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wider">Ödeme Türü *</label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {types.map((item, index) => (
          <label key={item.value} className="cursor-pointer">
            <input type="radio" name="odemeTuru" value={item.value} className="sr-only peer" defaultChecked={index === 0} />
            <div className={`p-2.5 bg-white dark:bg-[#17181f] border-2 border-gray-200 peer-checked:border-${item.color}-500 peer-checked:bg-${item.color}-50 dark:peer-checked:bg-${item.color}-500/10 rounded-md text-center`}>
              <p className="text-[10px] font-bold text-gray-900 dark:text-gray-100">{item.title}</p>
              <p className="text-[8px] text-gray-500 mt-0.5">{item.sub}</p>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
