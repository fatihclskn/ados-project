import { type ReactNode, useMemo, useState } from 'react';

type ColorName = 'rose' | 'indigo' | 'emerald' | 'sky' | 'amber' | 'violet' | 'gray';
type InvoiceStatus = 'paid' | 'pending';

type BoschService = {
  id: string;
  name: string;
  type: 'retainer' | 'altyapi' | 'proje' | 'medya' | 'lisans';
  clr: ColorName;
  monthly: number;
  yearly: number;
  desc: string;
  services: string[];
  contact: string;
  email: string;
  dept: string;
  phone: string;
  lastInvoice: {
    no: string;
    date: string;
    amount: number;
    status: InvoiceStatus;
  };
  icon: ReactNode;
};

type ToastState = {
  title: string;
  text: string;
  color: ColorName;
} | null;

const CM: Record<ColorName, { bg: string; t: string; border: string; bar: string; solid: string; hover: string }> = {
  rose: { bg: 'bg-rose-100 dark:bg-rose-900/30', t: 'text-rose-700 dark:text-rose-300', border: 'border-rose-200 dark:border-rose-500/30', bar: 'bg-gradient-to-r from-rose-400 to-rose-600', solid: 'bg-rose-600', hover: 'hover:bg-rose-700' },
  indigo: { bg: 'bg-indigo-100 dark:bg-indigo-900/30', t: 'text-indigo-700 dark:text-indigo-300', border: 'border-indigo-200 dark:border-indigo-500/30', bar: 'bg-gradient-to-r from-indigo-400 to-indigo-600', solid: 'bg-indigo-600', hover: 'hover:bg-indigo-700' },
  emerald: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', t: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-500/30', bar: 'bg-gradient-to-r from-emerald-400 to-emerald-600', solid: 'bg-emerald-600', hover: 'hover:bg-emerald-700' },
  sky: { bg: 'bg-sky-100 dark:bg-sky-900/30', t: 'text-sky-700 dark:text-sky-300', border: 'border-sky-200 dark:border-sky-500/30', bar: 'bg-gradient-to-r from-sky-400 to-sky-600', solid: 'bg-sky-600', hover: 'hover:bg-sky-700' },
  amber: { bg: 'bg-amber-100 dark:bg-amber-900/30', t: 'text-amber-700 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-500/30', bar: 'bg-gradient-to-r from-amber-400 to-amber-600', solid: 'bg-amber-600', hover: 'hover:bg-amber-700' },
  violet: { bg: 'bg-violet-100 dark:bg-violet-900/30', t: 'text-violet-700 dark:text-violet-300', border: 'border-violet-200 dark:border-violet-500/30', bar: 'bg-gradient-to-r from-violet-400 to-violet-600', solid: 'bg-violet-600', hover: 'hover:bg-violet-700' },
  gray: { bg: 'bg-gray-100 dark:bg-gray-800', t: 'text-gray-700 dark:text-gray-300', border: 'border-gray-200 dark:border-gray-600/50', bar: 'bg-gradient-to-r from-gray-400 to-gray-600', solid: 'bg-gray-600', hover: 'hover:bg-gray-700' },
};

const typeLabel: Record<BoschService['type'], string> = {
  retainer: 'Aylık Retainer',
  altyapi: 'Altyapı',
  proje: 'Proje Bazlı',
  medya: 'Medya Harcaması',
  lisans: 'Yıllık Lisans',
};

const BOSCH_HIZMETLER: BoschService[] = [
  {
    id: 'BSH-01',
    name: 'BCS Digital 360',
    type: 'retainer',
    clr: 'rose',
    monthly: 45000,
    yearly: 540000,
    desc: 'Bosch Consumer Services dijital pazarlama 360°',
    services: ['SEO', 'Google Ads', 'Sosyal Medya', 'İçerik Üretimi', 'Web Bakım'],
    contact: 'Cem Yılmaz',
    email: 'cem.yilmaz@tr.bosch.com',
    dept: 'BCS Marketing',
    phone: '+90 216 000 0001',
    lastInvoice: { no: 'ARB-2026-0412', date: '01.04.2026', amount: 45000, status: 'paid' },
    icon: <><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></>,
  },
  {
    id: 'BSH-02',
    name: 'BDS Digital 360',
    type: 'retainer',
    clr: 'rose',
    monthly: 52000,
    yearly: 624000,
    desc: 'Bosch Drive Solutions dijital pazarlama 360°',
    services: ['SEO', 'SEM', 'Performans Reklam', 'İçerik', 'Analytics'],
    contact: 'Ayşe Demir',
    email: 'ayse.demir@tr.bosch.com',
    dept: 'BDS Marketing',
    phone: '+90 216 000 0002',
    lastInvoice: { no: 'ARB-2026-0413', date: '01.04.2026', amount: 52000, status: 'paid' },
    icon: <><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></>,
  },
  {
    id: 'BSH-03',
    name: 'Bosch Otomotiv Sunucu',
    type: 'altyapi',
    clr: 'indigo',
    monthly: 85000,
    yearly: 1020000,
    desc: 'Otomotiv bölümü sunucu bakım, hosting, güvenlik',
    services: ['Dedicated VDS', 'Yedekleme', 'Güvenlik Duvarı', '7/24 Monitoring', 'Disaster Recovery'],
    contact: 'Mehmet Kaya',
    email: 'mehmet.kaya@tr.bosch.com',
    dept: 'Bosch Otomotiv IT',
    phone: '+90 216 000 0003',
    lastInvoice: { no: 'ARB-2026-0414', date: '01.04.2026', amount: 85000, status: 'paid' },
    icon: <><rect x="2" y="2" width="20" height="8" rx="2" /><rect x="2" y="14" width="20" height="8" rx="2" /><line x1="6" y1="6" x2="6.01" y2="6" /><line x1="6" y1="18" x2="6.01" y2="18" /></>,
  },
  {
    id: 'BSH-04',
    name: 'Bosch Otomotiv Sosyal Medya',
    type: 'retainer',
    clr: 'sky',
    monthly: 35000,
    yearly: 420000,
    desc: 'Otomotiv sosyal medya yönetimi ve topluluk',
    services: ['Instagram', 'LinkedIn', 'YouTube', 'Topluluk Yönetimi', 'Görsel İçerik'],
    contact: 'Zeynep Şahin',
    email: 'zeynep.sahin@tr.bosch.com',
    dept: 'Bosch Otomotiv PR',
    phone: '+90 216 000 0004',
    lastInvoice: { no: 'ARB-2026-0415', date: '01.04.2026', amount: 35000, status: 'paid' },
    icon: <><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></>,
  },
  {
    id: 'BSH-05',
    name: 'Prodüksiyonlar',
    type: 'proje',
    clr: 'violet',
    monthly: 60000,
    yearly: 720000,
    desc: 'Video, fotoğraf çekimi, animasyon, kısa film',
    services: ['Video Prodüksiyon', 'Fotoğraf', 'Animasyon', 'Drone', 'Post-Production'],
    contact: 'Çağlar Özdemir',
    email: 'caglar.ozdemir@tr.bosch.com',
    dept: 'Marketing Communications',
    phone: '+90 216 000 0005',
    lastInvoice: { no: 'ARB-2026-0416', date: '15.04.2026', amount: 78000, status: 'pending' },
    icon: <><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></>,
  },
  {
    id: 'BSH-06',
    name: 'Reklam Ödemeleri',
    type: 'medya',
    clr: 'amber',
    monthly: 420000,
    yearly: 5040000,
    desc: 'Google ADS + Meta Ads medya harcamaları (fatura ile geri fatura)',
    services: ['Google Ads', 'Meta Ads', 'LinkedIn Ads', 'YouTube Ads', 'Demand Gen'],
    contact: 'Burak Yıldız',
    email: 'burak.yildiz@tr.bosch.com',
    dept: 'Digital Marketing',
    phone: '+90 216 000 0006',
    lastInvoice: { no: 'ARB-2026-0417', date: '10.04.2026', amount: 418500, status: 'paid' },
    icon: <><path d="M3 11l18-5v12L3 13v-2z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" /></>,
  },
  {
    id: 'BSH-07',
    name: 'Üyelik & Lisans',
    type: 'lisans',
    clr: 'emerald',
    monthly: 15000,
    yearly: 180000,
    desc: 'Yazılım lisansları, analytics ve araç abonelikleri',
    services: ['SEMrush Enterprise', 'Hotjar Business', 'HubSpot', 'Canva Pro', 'Figma'],
    contact: 'Elif Kara',
    email: 'elif.kara@tr.bosch.com',
    dept: 'Marketing Operations',
    phone: '+90 216 000 0007',
    lastInvoice: { no: 'ARB-2026-0418', date: '01.04.2026', amount: 15000, status: 'paid' },
    icon: <><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>,
  },
];

function money(value: number) {
  return `₺${value.toLocaleString('tr-TR')}`;
}

function initials(name: string) {
  return name.split(' ').map((word) => word[0]).join('');
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

export default function BoschHesabi() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>(null);

  const stats = useMemo(() => {
    const totalYearly = BOSCH_HIZMETLER.reduce((sum, item) => sum + item.yearly, 0);
    const totalMonthly = BOSCH_HIZMETLER.reduce((sum, item) => sum + item.monthly, 0);
    const bilisimYearly = 20000000;
    const ciroYuzde = Math.round((totalYearly / bilisimYearly) * 100);
    const thisMonthBilled = BOSCH_HIZMETLER.reduce((sum, item) => sum + item.lastInvoice.amount, 0);
    const pending = BOSCH_HIZMETLER.filter((item) => item.lastInvoice.status === 'pending');
    const pendingAmount = pending.reduce((sum, item) => sum + item.lastInvoice.amount, 0);
    return { totalYearly, totalMonthly, ciroYuzde, thisMonthBilled, pendingAmount, pendingCount: pending.length };
  }, []);

  const selected = selectedId ? BOSCH_HIZMETLER.find((item) => item.id === selectedId) ?? null : null;

  function showToast(title: string, text: string, color: ColorName = 'rose') {
    setToast({ title, text, color });
    window.setTimeout(() => setToast(null), 2600);
  }

  return (
    <div className="relative space-y-3">
      <ContentToast toast={toast} onClose={() => setToast(null)} />

      <HeaderSection stats={stats} onToast={showToast} />
      <VipInfoCard />
      <KpiGrid stats={stats} />
      <InvoiceCategories onSelect={setSelectedId} />
      <AdsPanel />
      <InvoicesAndDistribution stats={stats} onSelect={setSelectedId} onToast={showToast} />
      <InfoBand />

      {selected ? (
        <BoschDetailModal service={selected} onClose={() => setSelectedId(null)} onToast={showToast} />
      ) : null}
    </div>
  );
}

function HeaderSection({ stats, onToast }: { stats: { totalYearly: number }; onToast: (title: string, text: string, color: ColorName) => void }) {
  return (
    <div className="flex items-center justify-between gap-3 flex-wrap">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 bg-rose-100 dark:bg-rose-500/20 rounded-lg flex items-center justify-center">
          <Svg className="text-rose-600 dark:text-rose-400 w-4 h-4"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></Svg>
        </div>
        <div>
          <h1 className="text-[19px] font-bold text-gray-900 dark:text-gray-100 leading-tight">Bosch Hesabı</h1>
          <p className="text-[11px] text-gray-500 dark:text-gray-400">VIP Müşteri · Arma Bilişim ile sözleşme · {BOSCH_HIZMETLER.length} aktif fatura kategorisi</p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <button type="button" onClick={() => onToast('Bosch Raporu', 'Yıllık Bosch ciro raporu oluşturuluyor', 'rose')} className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-[11px] font-semibold rounded-md hover:bg-gray-50">
          <Svg className="w-3.5 h-3.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></Svg>
          PDF Rapor
        </button>
        <button type="button" onClick={() => onToast('Sözleşme', 'Bosch-Arma Bilişim çerçeve sözleşme görüntüleniyor', 'rose')} className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-[11px] font-semibold rounded-md hover:bg-gray-50">
          <Svg className="w-3.5 h-3.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></Svg>
          Sözleşme
        </button>
        <button type="button" onClick={() => onToast('Yeni Fatura', `Bosch için fatura kesim seçimi açılıyor · yıllık ${money(stats.totalYearly)}`, 'rose')} className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold rounded-md shadow-sm">
          <Svg className="w-3.5 h-3.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></Svg>
          Fatura Kes
        </button>
      </div>
    </div>
  );
}

function VipInfoCard() {
  return (
    <div className="bg-gradient-to-br from-rose-50 via-red-50/60 to-transparent dark:from-rose-500/10 dark:via-red-500/5 border-2 border-rose-200 dark:border-rose-500/30 rounded-xl overflow-hidden">
      <div className="p-4 md:p-5 flex items-start gap-4 flex-wrap">
        <div className="w-16 h-16 bg-gradient-to-br from-rose-600 to-red-700 rounded-xl flex items-center justify-center shrink-0 shadow-lg">
          <span className="text-white font-black text-[24px] tracking-tight">B</span>
        </div>
        <div className="flex-1 min-w-[260px]">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h2 className="text-[18px] font-black text-gray-900 dark:text-gray-100">Bosch Sanayi ve Ticaret A.Ş.</h2>
            <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 bg-rose-600 text-white rounded">
              <Svg className="w-2.5 h-2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></Svg>
              VIP MÜŞTERİ
            </span>
          </div>
          <p className="text-[11px] text-gray-600 dark:text-gray-400 mb-3">Otomotiv · Endüstriyel Teknoloji · Tüketici Ürünleri · Enerji & Bina Teknolojileri</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[10px]">
            <div>
              <p className="text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Fatura Kesilen Şirket</p>
              <p className="font-bold text-indigo-700 dark:text-indigo-300 mt-0.5">Arma Bilişim Ltd. Şti.</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">İletişim</p>
              <p className="font-bold text-gray-900 dark:text-gray-100 mt-0.5">finans@tr.bosch.com</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Ödeme Vadesi</p>
              <p className="font-bold text-gray-900 dark:text-gray-100 mt-0.5">60 gün · otomatik</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Çerçeve Sözleşme</p>
              <p className="font-bold text-emerald-700 dark:text-emerald-300 mt-0.5">01.01.2026 - 31.12.2026</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiGrid({ stats }: { stats: { totalYearly: number; ciroYuzde: number; thisMonthBilled: number; pendingAmount: number; pendingCount: number; totalMonthly: number } }) {
  const cards = [
    { label: 'Yıllık Anlaşma', value: `₺${(stats.totalYearly / 1000000).toFixed(2)}M`, sub: 'Tüm kategoriler toplam', clr: 'rose' as ColorName },
    { label: 'Cirodaki Pay', value: `%${stats.ciroYuzde}`, sub: 'Arma Bilişim toplam ciro', clr: 'indigo' as ColorName },
    { label: 'Aktif Kategori', value: String(BOSCH_HIZMETLER.length), sub: 'Fatura kesim başlığı', clr: 'emerald' as ColorName },
    { label: 'Bu Ay Kesilen', value: `₺${(stats.thisMonthBilled / 1000).toFixed(0)}K`, sub: 'Nisan 2026 fatura toplamı', clr: 'sky' as ColorName },
    { label: 'Bekleyen Tahsilat', value: `₺${(stats.pendingAmount / 1000).toFixed(0)}K`, sub: `${stats.pendingCount} fatura bekliyor`, clr: 'amber' as ColorName },
    { label: 'Aylık Ortalama', value: `₺${(stats.totalMonthly / 1000).toFixed(0)}K`, sub: 'Sabit + değişken', clr: 'violet' as ColorName },
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

function InvoiceCategories({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Svg className="text-rose-600 dark:text-rose-400 w-4 h-4"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></Svg>
          <h3 className="text-[14px] font-bold text-gray-900 dark:text-gray-100">Fatura Kesim Kategorileri</h3>
          <span className="text-[9px] font-bold px-1.5 py-0.5 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 rounded">7 BAŞLIK</span>
        </div>
        <span className="text-[10px] text-gray-500">Her kategori ayrı fatura olarak kesilir</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {BOSCH_HIZMETLER.map((item) => (
          <CategoryCard key={item.id} service={item} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
}

function CategoryCard({ service, onSelect }: { service: BoschService; onSelect: (id: string) => void }) {
  const cm = CM[service.clr];
  const statusClr = service.lastInvoice.status === 'paid' ? 'emerald' : 'amber';
  const scm = CM[statusClr];

  return (
    <div className={`bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden hover:border-${service.clr}-400 dark:hover:border-${service.clr}-500/50 transition-colors cursor-pointer`} onClick={() => onSelect(service.id)}>
      <div className={`p-3 ${cm.bg} border-b border-${service.clr}-200/50 dark:border-${service.clr}-500/20 flex items-start gap-2.5`}>
        <div className="w-9 h-9 bg-white dark:bg-[#1e1f26] rounded-lg flex items-center justify-center shrink-0">
          <Svg className={`${cm.t} w-4 h-4`}>{service.icon}</Svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-bold text-gray-900 dark:text-gray-100 leading-tight">{service.name}</p>
          <p className={`text-[9px] ${cm.t} font-semibold mt-0.5`}>{typeLabel[service.type]}</p>
        </div>
        <span className="text-gray-400 shrink-0"><Svg className="w-3.5 h-3.5"><polyline points="9 18 15 12 9 6" /></Svg></span>
      </div>
      <div className="p-3 space-y-2">
        <p className="text-[10px] text-gray-600 dark:text-gray-400 line-clamp-2 min-h-[28px]">{service.desc}</p>
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 dark:border-gray-700/40">
          <div>
            <p className="text-[9px] text-gray-500 uppercase tracking-wider">Aylık</p>
            <p className="text-[13px] font-black text-gray-900 dark:text-gray-100 font-mono">₺{(service.monthly / 1000).toFixed(0)}K</p>
          </div>
          <div>
            <p className="text-[9px] text-gray-500 uppercase tracking-wider">Yıllık</p>
            <p className={`text-[13px] font-black ${cm.t} font-mono`}>₺{(service.yearly / 1000000).toFixed(2)}M</p>
          </div>
        </div>
        <div className="pt-2 border-t border-gray-100 dark:border-gray-700/40 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[9px] text-gray-500">Son fatura</p>
            <p className="text-[10px] font-mono text-gray-700 dark:text-gray-300 truncate">{service.lastInvoice.no}</p>
          </div>
          <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 ${scm.bg} ${scm.t} rounded shrink-0`}>
            {service.lastInvoice.status === 'pending' ? <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" /> : null}
            {service.lastInvoice.status === 'paid' ? 'ÖDENDİ' : 'BEKLİYOR'}
          </span>
        </div>
      </div>
    </div>
  );
}

function AdsPanel() {
  return (
    <div className="bg-gradient-to-br from-amber-50 via-yellow-50/40 to-transparent dark:from-amber-500/10 dark:via-yellow-500/5 border border-amber-200 dark:border-amber-500/30 rounded-xl overflow-hidden">
      <div className="p-3 border-b border-amber-200/50 dark:border-amber-500/20 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <Svg className="text-amber-600 dark:text-amber-400 w-4 h-4"><path d="M3 11l18-5v12L3 13v-2z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" /></Svg>
          <h3 className="text-[13px] font-bold text-amber-900 dark:text-amber-200">Reklam Ödemeleri · Medya Harcama Detayı</h3>
          <span className="text-[9px] font-bold px-1.5 py-0.5 bg-amber-200 dark:bg-amber-500/30 text-amber-800 dark:text-amber-200 rounded">NİSAN 2026</span>
        </div>
        <span className="text-[10px] text-amber-700 dark:text-amber-300">Fatura kesimi: Arma Bilişim geri fatura · KDV %20</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-amber-200/50 dark:divide-amber-500/20">
        <AdSpendCard title="Google Ads" subtitle="Search + Display + YouTube" amount="₺280K" delta="+%12" positive icon={<><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /></>} iconClass="text-blue-600 w-4 h-4" />
        <AdSpendCard title="Meta Ads" subtitle="Facebook + Instagram" amount="₺140K" delta="-%4" icon={<path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />} iconClass="text-indigo-600 w-4 h-4" />
        <div className="p-4 bg-amber-100/40 dark:bg-amber-500/5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-amber-200 dark:bg-amber-500/30 rounded flex items-center justify-center">
              <Svg className="text-amber-700 dark:text-amber-300 w-4 h-4"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></Svg>
            </div>
            <div>
              <p className="text-[12px] font-bold text-amber-900 dark:text-amber-200">Toplam</p>
              <p className="text-[9px] text-amber-700 dark:text-amber-400">Nisan 2026 geri fatura</p>
            </div>
          </div>
          <p className="text-[24px] font-black font-mono text-amber-900 dark:text-amber-100">₺420K</p>
          <p className="text-[10px] text-amber-700 dark:text-amber-400 mt-1">Yıllık ~₺5.04M</p>
          <div className="mt-3 flex items-center justify-between text-[9px] pt-2 border-t border-amber-300/30">
            <span className="text-amber-700 dark:text-amber-400">Fatura:</span>
            <span className="font-mono font-bold text-amber-800 dark:text-amber-200">ARB-2026-0417</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdSpendCard({ title, subtitle, amount, delta, positive = false, icon, iconClass }: { title: string; subtitle: string; amount: string; delta: string; positive?: boolean; icon: ReactNode; iconClass: string }) {
  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 bg-white dark:bg-[#1e1f26] rounded flex items-center justify-center">
          <Svg className={iconClass}>{icon}</Svg>
        </div>
        <div>
          <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100">{title}</p>
          <p className="text-[9px] text-gray-500">{subtitle}</p>
        </div>
      </div>
      <p className="text-[22px] font-black font-mono text-gray-900 dark:text-gray-100">{amount}</p>
      <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">Bu ay harcama</p>
      <div className="mt-3 flex items-center justify-between text-[9px] pt-2 border-t border-gray-100 dark:border-gray-700/40">
        <span className="text-gray-500">vs geçen ay</span>
        <span className={`${positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'} font-bold`}>{delta}</span>
      </div>
    </div>
  );
}

function InvoicesAndDistribution({ stats, onSelect, onToast }: { stats: { thisMonthBilled: number; totalYearly: number }; onSelect: (id: string) => void; onToast: (title: string, text: string, color: ColorName) => void }) {
  const sortedInvoices = [...BOSCH_HIZMETLER].sort((a, b) => b.lastInvoice.amount - a.lastInvoice.amount);
  const sortedYearly = [...BOSCH_HIZMETLER].sort((a, b) => b.yearly - a.yearly);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
      <div className="lg:col-span-2 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
        <div className="p-3 border-b border-gray-100 dark:border-gray-700/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Svg className="text-rose-600 dark:text-rose-400 w-4 h-4"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></Svg>
            <h3 className="text-[13px] font-bold text-gray-900 dark:text-gray-100">Son Bosch Faturaları</h3>
          </div>
          <button type="button" onClick={() => onToast('Tüm Faturalar', 'Bosch fatura tam listesi', 'rose')} className="text-[10px] font-semibold text-rose-700 dark:text-rose-300 hover:underline">Tümü →</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead className="bg-gray-50 dark:bg-[#17181f]">
              <tr className="border-b border-gray-200 dark:border-gray-700/30">
                <th className="text-left px-3 py-2 font-semibold text-gray-500 dark:text-gray-400">Fatura No</th>
                <th className="text-left px-3 py-2 font-semibold text-gray-500 dark:text-gray-400">Kategori</th>
                <th className="text-left px-3 py-2 font-semibold text-gray-500 dark:text-gray-400 hidden md:table-cell">Tarih</th>
                <th className="text-right px-3 py-2 font-semibold text-gray-500 dark:text-gray-400">Tutar</th>
                <th className="text-center px-3 py-2 font-semibold text-gray-500 dark:text-gray-400 w-24">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/30">
              {sortedInvoices.map((item) => {
                const cm = CM[item.lastInvoice.status === 'paid' ? 'emerald' : 'amber'];
                return (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer" onClick={() => onSelect(item.id)}>
                    <td className="px-3 py-2.5 font-mono text-[10px] text-gray-700 dark:text-gray-300">{item.lastInvoice.no}</td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <Svg className={`${CM[item.clr].t} w-3.5 h-3.5`}>{item.icon}</Svg>
                        <span className="font-semibold text-gray-900 dark:text-gray-100 text-[11px] truncate">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 hidden md:table-cell text-gray-600 dark:text-gray-400 font-mono text-[10px]">{item.lastInvoice.date}</td>
                    <td className="px-3 py-2.5 text-right font-mono font-bold text-gray-900 dark:text-gray-100">{money(item.lastInvoice.amount)}</td>
                    <td className="px-3 py-2.5 text-center">
                      <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 ${cm.bg} ${cm.t} rounded`}>
                        {item.lastInvoice.status === 'pending' ? <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" /> : null}
                        {item.lastInvoice.status === 'paid' ? 'ÖDENDİ' : 'BEKLİYOR'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-[#17181f] border-t border-gray-100 dark:border-gray-700/40 flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-400">
          <span>{BOSCH_HIZMETLER.length} fatura bu ay · <span className="font-bold text-gray-900 dark:text-gray-100 font-mono">{money(stats.thisMonthBilled)}</span> toplam</span>
          <span>KDV dahil: <span className="font-bold text-gray-900 dark:text-gray-100 font-mono">{money(stats.thisMonthBilled * 1.2)}</span></span>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
        <div className="p-3 border-b border-gray-100 dark:border-gray-700/40 flex items-center gap-2">
          <Svg className="text-rose-600 dark:text-rose-400 w-3.5 h-3.5"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></Svg>
          <h3 className="text-[12px] font-bold text-gray-900 dark:text-gray-100">Yıllık Ciro Dağılımı</h3>
        </div>
        <div className="p-3 space-y-2">
          {sortedYearly.map((item) => {
            const cm = CM[item.clr];
            const pct = Math.round((item.yearly / stats.totalYearly) * 100);
            return (
              <div key={item.id}>
                <div className="flex items-center justify-between text-[10px] mb-0.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Svg className={`${cm.t} w-3 h-3 shrink-0`}>{item.icon}</Svg>
                    <span className="text-gray-700 dark:text-gray-300 font-medium truncate">{item.name}</span>
                  </div>
                  <span className="font-mono text-gray-500 dark:text-gray-400 shrink-0"><span className={`font-bold ${cm.t}`}>%{pct}</span></span>
                </div>
                <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className={`h-full ${cm.bar} rounded-full`} style={{ width: `${pct}%` }} />
                </div>
                <p className="text-[9px] text-gray-400 dark:text-gray-500 mt-0.5 font-mono">₺{(item.yearly / 1000000).toFixed(2)}M/yıl</p>
              </div>
            );
          })}
        </div>
        <div className="p-3 border-t border-gray-100 dark:border-gray-700/40 text-center bg-rose-50/50 dark:bg-rose-500/5">
          <p className="text-[9px] text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Toplam Yıllık</p>
          <p className="text-[20px] font-black text-rose-700 dark:text-rose-300 font-mono">₺{(stats.totalYearly / 1000000).toFixed(2)}M</p>
        </div>
      </div>
    </div>
  );
}

function InfoBand() {
  return (
    <div className="bg-gradient-to-br from-indigo-50/50 via-transparent to-rose-50/50 dark:from-indigo-500/5 dark:to-rose-500/5 border border-indigo-200/50 dark:border-indigo-500/20 rounded-xl p-3 flex items-start gap-2.5">
      <Svg className="text-indigo-600 dark:text-indigo-400 w-4 h-4 shrink-0 mt-0.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></Svg>
      <div className="flex-1">
        <p className="text-[11px] text-gray-700 dark:text-gray-300">
          <span className="font-bold text-indigo-700 dark:text-indigo-300">Bosch faturalama:</span>
          {' '}Tüm faturalar <span className="font-bold">Arma Bilişim Ltd. Şti.</span> üzerinden kesilir ·
          {' '}<span className="font-bold">KDV %20</span> uygulanır ·
          {' '}<span className="font-bold">60 gün</span> vadeli e-fatura ·
          {' '}ödemeler Arma Bilişim Garanti hesabına ·
          {' '}çerçeve sözleşme <span className="font-bold text-emerald-700 dark:text-emerald-300">01.01.2026-31.12.2026</span> tarihleri arasında geçerli ·
          {' '}Reklam ödemeleri geri fatura modelinde (Bosch öder · Arma Bilişim fatura keser).
        </p>
      </div>
    </div>
  );
}

function BoschDetailModal({ service, onClose, onToast }: { service: BoschService; onClose: () => void; onToast: (title: string, text: string, color: ColorName) => void }) {
  const cm = CM[service.clr];
  const history = [
    { ay: 'Nisan 2026', no: `ARB-2026-04${service.id.split('-')[1]}`, amount: service.monthly, status: service.id === 'BSH-05' ? 'pending' : 'paid', date: '01.04.2026' },
    { ay: 'Mart 2026', no: `ARB-2026-03${service.id.split('-')[1]}`, amount: service.monthly, status: 'paid', date: '01.03.2026' },
    { ay: 'Şubat 2026', no: `ARB-2026-02${service.id.split('-')[1]}`, amount: service.monthly, status: 'paid', date: '01.02.2026' },
    { ay: 'Ocak 2026', no: `ARB-2026-01${service.id.split('-')[1]}`, amount: service.monthly, status: 'paid', date: '01.01.2026' },
    { ay: 'Aralık 2025', no: `ARB-2025-12${service.id.split('-')[1]}`, amount: Math.round(service.monthly * 0.97), status: 'paid', date: '01.12.2025' },
    { ay: 'Kasım 2025', no: `ARB-2025-11${service.id.split('-')[1]}`, amount: Math.round(service.monthly * 0.97), status: 'paid', date: '01.11.2025' },
  ] as const;

  return (
    <div className="absolute inset-0 z-30">
      <div className="modal-overlay absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="modal-panel absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
        <div className="modal-scroll bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-xl w-full max-w-[760px] max-h-[94vh] overflow-y-auto pointer-events-auto">
          <div className="sticky top-0 z-10 bg-white dark:bg-[#1e1f26] border-b border-gray-100 dark:border-gray-700/60 p-5 flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-11 h-11 bg-gradient-to-br from-rose-600 to-red-700 rounded-lg flex items-center justify-center shrink-0 shadow">
                <span className="text-white font-black text-[18px]">B</span>
              </div>
              <div className="min-w-0">
                <h2 className="text-[16px] font-black text-gray-900 dark:text-gray-100 truncate">{service.name}</h2>
                <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                  <span className="text-[10px] text-gray-500">Bosch ·</span>
                  <span className={`text-[10px] font-semibold ${cm.t}`}>{service.dept}</span>
                </div>
              </div>
            </div>
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-700 p-1 shrink-0">
              <Svg className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Svg>
            </button>
          </div>

          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className={`p-3 bg-gradient-to-br from-${service.clr}-50 to-${service.clr}-50/50 dark:from-${service.clr}-500/10 dark:to-${service.clr}-500/5 border border-${service.clr}-200 dark:border-${service.clr}-500/30 rounded-lg`}>
                <p className={`text-[9px] font-semibold ${cm.t} uppercase tracking-wider`}>Aylık</p>
                <p className={`text-[20px] font-black ${cm.t} font-mono mt-0.5`}>₺{(service.monthly / 1000).toFixed(0)}K</p>
              </div>
              <div className={`p-3 bg-gradient-to-br from-${service.clr}-50 to-${service.clr}-50/50 dark:from-${service.clr}-500/10 dark:to-${service.clr}-500/5 border border-${service.clr}-200 dark:border-${service.clr}-500/30 rounded-lg`}>
                <p className={`text-[9px] font-semibold ${cm.t} uppercase tracking-wider`}>Yıllık</p>
                <p className={`text-[20px] font-black ${cm.t} font-mono mt-0.5`}>₺{(service.yearly / 1000000).toFixed(2)}M</p>
              </div>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-lg">
                <p className="text-[9px] font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">Son 12 Ay</p>
                <p className="text-[20px] font-black text-emerald-700 dark:text-emerald-300 font-mono mt-0.5">11 ödenmiş</p>
              </div>
            </div>

            <div className="p-3 bg-gray-50 dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-lg">
              <p className="text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Bosch Tarafı Sorumlu</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0">{initials(service.contact)}</div>
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 dark:text-gray-100 truncate">{service.contact}</p>
                    <p className="text-[9px] text-gray-500 truncate">{service.dept}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                  <Svg className="w-3.5 h-3.5 shrink-0"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></Svg>
                  <span className="truncate text-[10px]">{service.email}</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                  <Svg className="w-3.5 h-3.5 shrink-0"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72" /></Svg>
                  <span className="font-mono text-[10px]">{service.phone}</span>
                </div>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Bu Kategoride Kapsanan Hizmetler</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {service.services.map((item) => (
                  <div key={item} className="flex items-center gap-2 p-2 bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded text-[11px]">
                    <Svg className="text-emerald-600 dark:text-emerald-400 w-3.5 h-3.5 shrink-0"><polyline points="20 6 9 17 4 12" /></Svg>
                    <span className="text-gray-700 dark:text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <div className="p-3 border-b border-gray-100 dark:border-gray-700/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Svg className="text-rose-600 dark:text-rose-400 w-3.5 h-3.5"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></Svg>
                  <p className="text-[11px] font-bold text-gray-900 dark:text-gray-100">Son 6 Ay Fatura Geçmişi</p>
                </div>
                <span className="text-[9px] text-gray-500">Toplam: <span className="font-mono font-bold text-gray-900 dark:text-gray-100">{money(history.reduce((sum, item) => sum + item.amount, 0))}</span></span>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-700/30">
                {history.map((item) => {
                  const paid = item.status === 'paid';
                  const scm = CM[paid ? 'emerald' : 'amber'];
                  return (
                    <div key={item.no} className={`p-2.5 flex items-center justify-between gap-3 ${paid ? '' : 'bg-amber-50/50 dark:bg-amber-500/5'}`}>
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div className={`w-8 h-8 ${paid ? 'bg-emerald-100 dark:bg-emerald-500/20' : 'bg-amber-100 dark:bg-amber-500/20'} rounded flex items-center justify-center shrink-0`}>
                          <Svg className={`${paid ? 'text-emerald-600' : 'text-amber-600'} w-4 h-4`}>{paid ? <polyline points="20 6 9 17 4 12" /> : <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>}</Svg>
                        </div>
                        <div className="min-w-0">
                          <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100">{item.ay}</p>
                          <p className="text-[9px] font-mono text-gray-500">{item.no} · {item.date}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[13px] font-black font-mono text-gray-900 dark:text-gray-100">{money(item.amount)}</p>
                        <span className={`inline-flex text-[9px] font-bold px-1.5 py-0.5 ${scm.bg} ${scm.t} rounded`}>{paid ? 'ÖDENDİ' : 'BEKLİYOR'}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <DetailAction color="rose" title="Yeni Fatura" icon={<><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>} onClick={() => onToast('Fatura Kes', `${service.name} için yeni fatura kesimi başladı`, 'rose')} />
              <DetailAction color="indigo" title="Sözleşme" icon={<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></>} onClick={() => onToast('Sözleşme', `${service.name} kategori sözleşme detayı açılıyor`, 'indigo')} />
              <DetailAction color="emerald" title="Raporlar" icon={<><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></>} onClick={() => onToast('Raporlar', `${service.name} performans raporu hazırlanıyor`, 'emerald')} />
              <DetailAction color="sky" title="İletişim" icon={<><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></>} onClick={() => onToast('İletişim', 'Bosch sorumlusuna mail hazırlanıyor', 'sky')} />
            </div>
          </div>

          <div className="sticky bottom-0 bg-white dark:bg-[#1e1f26] border-t border-gray-100 dark:border-gray-700/60 p-3 flex items-center justify-between gap-2">
            <div className="text-[10px] text-gray-500">Arma Bilişim Ltd. Şti. üzerinden faturalanıyor</div>
            <button type="button" onClick={onClose} className="px-3 py-2 text-[11px] font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900">Kapat</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailAction({ color, title, icon, onClick }: { color: ColorName; title: string; icon: ReactNode; onClick: () => void }) {
  const cm = CM[color];
  return (
    <button type="button" onClick={onClick} className={`flex flex-col items-center gap-1.5 p-3 bg-${color}-50 dark:bg-${color}-500/10 border border-${color}-200 dark:border-${color}-500/30 hover:bg-${color}-100 dark:hover:bg-${color}-500/20 rounded-lg`}>
      <Svg className={`${cm.t} w-4 h-4`}>{icon}</Svg>
      <span className={`text-[10px] font-bold ${cm.t}`}>{title}</span>
    </button>
  );
}
