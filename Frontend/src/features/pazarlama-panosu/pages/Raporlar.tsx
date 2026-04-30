import { type ReactNode, useMemo, useState } from 'react';

type ColorName = 'emerald' | 'amber' | 'rose' | 'sky' | 'violet' | 'indigo' | 'gray' | 'pink' | 'teal';
type ReportTab = 'overview' | 'sources' | 'services' | 'team' | 'conversion';

type SourceData = {
  src: string;
  icon: string;
  clr: ColorName;
  leads: number;
  conv: number;
  rate: number;
  revenue: number;
  trend: number[];
};

type ServiceData = {
  svc: string;
  clr: ColorName;
  leads: number;
  conv: number;
  revenue: number;
  avgDeal: number;
  months: number;
};

type StaffData = {
  id: number;
  name: string;
  avatar: string;
  clr: ColorName;
  title: string;
  leads: number;
  conv: number;
  convRate: number;
  revenue: number;
  prim: number;
  primPaid: number;
  byMonth: number[];
  bySource: { gads: number; organic: number; referral: number; meta: number; other: number };
  bySvc: string[];
  avgResponseH: number;
  satisfaction: number;
};

const REPORT_PERIODS = ['Son 7 Gün', 'Son 30 Gün', 'Son 3 Ay', 'Son 6 Ay', 'Bu Yıl', 'Özel Aralık'];
const TABS: { id: ReportTab; label: string }[] = [
  { id: 'overview', label: 'Genel Bakış' },
  { id: 'sources', label: 'Kaynak Analizi' },
  { id: 'services', label: 'Hizmet Bazlı' },
  { id: 'team', label: 'Ekip Performansı' },
  { id: 'conversion', label: 'Dönüşüm Hunisi' },
];

const CM: Record<ColorName, { bg: string; t: string; hex: string }> = {
  emerald: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', t: 'text-emerald-700 dark:text-emerald-300', hex: '#10b981' },
  amber: { bg: 'bg-amber-100 dark:bg-amber-900/30', t: 'text-amber-700 dark:text-amber-300', hex: '#f59e0b' },
  rose: { bg: 'bg-rose-100 dark:bg-rose-900/30', t: 'text-rose-700 dark:text-rose-300', hex: '#f43f5e' },
  sky: { bg: 'bg-sky-100 dark:bg-sky-900/30', t: 'text-sky-700 dark:text-sky-300', hex: '#0ea5e9' },
  violet: { bg: 'bg-violet-100 dark:bg-violet-900/30', t: 'text-violet-700 dark:text-violet-300', hex: '#8b5cf6' },
  indigo: { bg: 'bg-indigo-100 dark:bg-indigo-900/30', t: 'text-indigo-700 dark:text-indigo-300', hex: '#6366f1' },
  gray: { bg: 'bg-gray-100 dark:bg-gray-800', t: 'text-gray-600 dark:text-gray-400', hex: '#6b7280' },
  pink: { bg: 'bg-pink-100 dark:bg-pink-900/30', t: 'text-pink-700 dark:text-pink-300', hex: '#ec4899' },
  teal: { bg: 'bg-teal-100 dark:bg-teal-900/30', t: 'text-teal-700 dark:text-teal-300', hex: '#14b8a6' },
};

const P = {
  report: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18" />
      <path d="M9 21V9" />
    </>
  ),
  shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  upload: (
    <>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </>
  ),
  cal: (
    <>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </>
  ),
  star: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />,
  trend: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />,
  up: (
    <>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </>
  ),
  chk: <polyline points="20 6 9 17 4 12" />,
};

const RPT_SOURCE_DATA: SourceData[] = [
  { src: 'Google Ads', icon: 'G', clr: 'sky', leads: 38, conv: 14, rate: 36.8, revenue: 642000, trend: [28, 31, 35, 36, 38, 38, 38] },
  { src: 'Organik / SEO', icon: 'SEO', clr: 'emerald', leads: 29, conv: 12, rate: 41.4, revenue: 487000, trend: [18, 21, 24, 26, 28, 29, 29] },
  { src: 'Referans', icon: 'R', clr: 'violet', leads: 24, conv: 11, rate: 45.8, revenue: 398000, trend: [14, 17, 19, 21, 23, 24, 24] },
  { src: 'Meta Reklam', icon: 'M', clr: 'indigo', leads: 18, conv: 6, rate: 33.3, revenue: 264000, trend: [10, 12, 14, 15, 17, 18, 18] },
  { src: 'Web Sitesi Form', icon: 'W', clr: 'violet', leads: 16, conv: 5, rate: 31.3, revenue: 196000, trend: [8, 10, 12, 13, 15, 16, 16] },
  { src: 'Google Business', icon: 'GB', clr: 'amber', leads: 12, conv: 4, rate: 33.3, revenue: 148000, trend: [6, 8, 9, 10, 11, 12, 12] },
  { src: 'E-Bülten', icon: 'E', clr: 'sky', leads: 9, conv: 2, rate: 22.2, revenue: 78000, trend: [4, 5, 6, 7, 8, 9, 9] },
  { src: 'Telefon', icon: 'T', clr: 'gray', leads: 7, conv: 3, rate: 42.9, revenue: 124000, trend: [3, 4, 5, 5, 6, 7, 7] },
];

const RPT_SERVICE_DATA: ServiceData[] = [
  { svc: 'SEO', clr: 'violet', leads: 52, conv: 22, revenue: 548000, avgDeal: 24909, months: 6 },
  { svc: 'Web Sitesi', clr: 'sky', leads: 44, conv: 18, revenue: 486000, avgDeal: 27000, months: 8 },
  { svc: 'Google Ads', clr: 'emerald', leads: 38, conv: 14, revenue: 642000, avgDeal: 45857, months: 12 },
  { svc: 'Meta Reklam', clr: 'indigo', leads: 28, conv: 10, revenue: 312000, avgDeal: 31200, months: 6 },
  { svc: 'Sosyal Medya', clr: 'pink', leads: 24, conv: 9, revenue: 228000, avgDeal: 25333, months: 6 },
  { svc: 'E-Bülten', clr: 'amber', leads: 18, conv: 5, revenue: 108000, avgDeal: 21600, months: 4 },
  { svc: 'Marka & Kimlik', clr: 'rose', leads: 14, conv: 6, revenue: 276000, avgDeal: 46000, months: 12 },
  { svc: 'Prodüksiyon / Video', clr: 'gray', leads: 11, conv: 4, revenue: 188000, avgDeal: 47000, months: 6 },
  { svc: 'Hosting & Domain', clr: 'teal', leads: 8, conv: 5, revenue: 48000, avgDeal: 9600, months: 12 },
];

const RPT_STAFF_DATA: StaffData[] = [
  { id: 1, name: 'Zeynep Acar', avatar: 'ZA', clr: 'violet', title: 'Pazarlama Uzmanı', leads: 31, conv: 14, convRate: 45.2, revenue: 892000, prim: 35680, primPaid: 21408, byMonth: [18, 22, 25, 28, 29, 31], bySource: { gads: 8, organic: 7, referral: 9, meta: 4, other: 3 }, bySvc: ['SEO x8', 'Web Sitesi x5', 'Google Ads x4'], avgResponseH: 2.1, satisfaction: 4.7 },
  { id: 2, name: 'Ayşe Demir', avatar: 'AD', clr: 'sky', title: 'Dijital Pazarlama Uzmanı', leads: 26, conv: 11, convRate: 42.3, revenue: 734000, prim: 29360, primPaid: 22020, byMonth: [14, 17, 20, 22, 24, 26], bySource: { gads: 10, organic: 6, referral: 4, meta: 6, other: 0 }, bySvc: ['Google Ads x6', 'Meta Reklam x5', 'SEO x4'], avgResponseH: 1.8, satisfaction: 4.5 },
  { id: 3, name: 'Mert Kaya', avatar: 'MK', clr: 'emerald', title: 'İçerik & Lead Uzmanı', leads: 21, conv: 8, convRate: 38.1, revenue: 528000, prim: 18480, primPaid: 11088, byMonth: [10, 13, 15, 17, 19, 21], bySource: { gads: 4, organic: 9, referral: 5, meta: 2, other: 1 }, bySvc: ['SEO x7', 'Marka & Kimlik x3', 'Web Sitesi x2'], avgResponseH: 3.4, satisfaction: 4.3 },
  { id: 4, name: 'Seda Yılmaz', avatar: 'SY', clr: 'amber', title: 'Sosyal Medya Uzmanı', leads: 15, conv: 5, convRate: 33.3, revenue: 318000, prim: 9540, primPaid: 4770, byMonth: [6, 8, 10, 12, 13, 15], bySource: { gads: 2, organic: 3, referral: 4, meta: 6, other: 0 }, bySvc: ['Meta Reklam x4', 'Sosyal Medya x4', 'E-Bülten x2'], avgResponseH: 4.2, satisfaction: 4.1 },
];

function Icon({ children, className = 'w-3.5 h-3.5 shrink-0', fill = 'none' }: { children: ReactNode; className?: string; fill?: string }) {
  return (
    <svg className={className} fill={fill} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      {children}
    </svg>
  );
}

function Spark({ points, color }: { points: number[]; color: string }) {
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const coords = points.map((value, index) => `${index * (100 / (points.length - 1))},${32 - ((value - min) / range) * 28}`);
  const path = `M${coords.join('L')}`;
  const area = `M${coords.join('L')}L100,36L0,36Z`;
  const gradientId = `rpt-${color.replace('#', '')}-${points.join('-')}`;

  return (
    <svg viewBox="0 0 100 36" preserveAspectRatio="none" className="w-full h-9" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity=".22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradientId})`} />
      <path d={path} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function moneyK(value: number) {
  return `₺${Math.round(value / 1000)}K`;
}

export default function Raporlar() {
  const [reportPeriod, setReportPeriod] = useState('Son 30 Gün');
  const [reportTab, setReportTab] = useState<ReportTab>('overview');
  const [reportStaffFilter, setReportStaffFilter] = useState('Tümü');

  return (
    <div className="relative space-y-4 md:space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-violet-100 dark:bg-violet-900/40 rounded-xl flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5 text-violet-600 dark:text-violet-400">{P.report}</Icon>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[19px] font-bold text-gray-900 dark:text-gray-100 leading-tight">Pazarlama Raporları</h1>
              <span className="flex items-center gap-1 px-2 py-0.5 bg-violet-100 dark:bg-violet-900/40 border border-violet-200 dark:border-violet-800/40 rounded-full">
                <Icon className="w-3 h-3 text-violet-600 dark:text-violet-400">{P.shield}</Icon>
                <span className="text-[9px] font-bold text-violet-700 dark:text-violet-300 uppercase tracking-wide">Direktör</span>
              </span>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">Kaynak, hizmet, ekip ve dönüşüm bazlı pazarlama performans analizleri</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
            {REPORT_PERIODS.slice(0, 5).map((period) => (
              <button key={period} onClick={() => setReportPeriod(period)} className={`rp-btn px-2.5 py-1 text-[10px] font-semibold rounded-md transition-all ${period === reportPeriod ? 'bg-white dark:bg-[#17171a] text-violet-700 dark:text-violet-300 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}>
                {period}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 dark:bg-gray-100 dark:text-gray-900 text-white text-[12px] font-semibold rounded-lg hover:bg-gray-800 transition-colors">
            <Icon className="w-3.5 h-3.5">{P.upload}</Icon>
            PDF İndir
          </button>
        </div>
      </div>

      <div className="flex border-b border-gray-200 dark:border-gray-800 overflow-x-auto hs -mb-1">
        {TABS.map((tab) => (
          <button key={tab.id} onClick={() => setReportTab(tab.id)} id={`rpt-${tab.id}`} className={`px-4 py-2.5 text-[12px] font-semibold whitespace-nowrap border-b-2 transition-colors ${tab.id === reportTab ? 'border-violet-600 text-violet-600 dark:text-violet-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      <div id="rpt-content" className="space-y-5 md:space-y-6">
        {reportTab === 'overview' ? <Overview reportPeriod={reportPeriod} onPeriod={setReportPeriod} onTab={setReportTab} /> : null}
        {reportTab === 'sources' ? <Sources reportPeriod={reportPeriod} /> : null}
        {reportTab === 'services' ? <Services reportPeriod={reportPeriod} /> : null}
        {reportTab === 'team' ? <Team reportStaffFilter={reportStaffFilter} onStaffFilter={setReportStaffFilter} /> : null}
        {reportTab === 'conversion' ? <Conversion reportPeriod={reportPeriod} /> : null}
      </div>
    </div>
  );
}

function Overview({ reportPeriod, onPeriod, onTab }: { reportPeriod: string; onPeriod: (period: string) => void; onTab: (tab: ReportTab) => void }) {
  const totalLeads = RPT_SOURCE_DATA.reduce((sum, item) => sum + item.leads, 0);
  const totalConv = RPT_SOURCE_DATA.reduce((sum, item) => sum + item.conv, 0);
  const totalRevenue = RPT_SOURCE_DATA.reduce((sum, item) => sum + item.revenue, 0);
  const avgRate = ((totalConv / totalLeads) * 100).toFixed(1);
  const topSources = [...RPT_SOURCE_DATA].sort((a, b) => b.conv - a.conv).slice(0, 4);
  const topServices = [...RPT_SERVICE_DATA].sort((a, b) => b.revenue - a.revenue).slice(0, 4);

  const kpis = [
    { l: 'Toplam Talep', v: totalLeads, sub: 'Tüm kaynaklar', trend: '+18%', up: true, c: '#8b5cf6', d: [98, 107, 118, 127, 141, 153, totalLeads] },
    { l: 'Satışa Dönen', v: totalConv, sub: 'İşe dönüşen', trend: '+22%', up: true, c: '#10b981', d: [38, 43, 48, 53, 57, 62, totalConv] },
    { l: 'Dönüşüm Oranı', v: `${avgRate}%`, sub: 'Ortalama', trend: '+1.4%', up: true, c: '#06b6d4', d: [30, 31, 32, 33, 34, 35, parseFloat(avgRate)] },
    { l: 'Toplam Satış Değeri', v: moneyK(totalRevenue), sub: 'Pazarlama kaynaklı', trend: '+31%', up: true, c: '#f59e0b', d: [1800, 2000, 2200, 2400, 2600, 2800, Math.round(totalRevenue / 1000)] },
    { l: 'Aktif Kampanya', v: '5', sub: 'Bu dönem', trend: '+2', up: true, c: '#6366f1', d: [2, 2, 3, 3, 4, 4, 5] },
    { l: 'Ort. Yanıt Süresi', v: '2.9 sa', sub: 'İlk temas', trend: '-0.8', up: true, c: '#22c55e', d: [4.2, 3.9, 3.6, 3.4, 3.2, 3.0, 2.9] },
  ];

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.map((kpi) => (
          <div key={kpi.l} className="bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-800 rounded-xl p-4 hover:shadow-md dark:hover:border-gray-700 transition-all">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium leading-tight">{kpi.l}</p>
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${kpi.up ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' : 'bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300'}`}>{kpi.trend}</span>
            </div>
            <div className="text-[22px] font-bold text-gray-900 dark:text-gray-100 leading-none mb-0.5">{kpi.v}</div>
            <p className="text-[10px] text-gray-400 dark:text-gray-600 mb-2">{kpi.sub}</p>
            <Spark points={kpi.d} color={kpi.c} />
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 px-3 py-2 bg-violet-50 dark:bg-violet-900/15 border border-violet-200 dark:border-violet-800/40 rounded-lg">
        <Icon className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400 shrink-0">{P.cal}</Icon>
        <span className="text-[11px] text-violet-700 dark:text-violet-300 font-medium">Dönem: <strong>{reportPeriod}</strong> · 1 Nis 2026 — 22 Nis 2026</span>
        <button onClick={() => onPeriod('Özel Aralık')} className="ml-auto text-[10px] font-semibold text-violet-600 dark:text-violet-400 hover:underline">Tarih Seç →</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100">En Verimli Kaynaklar</p>
            <button onClick={() => onTab('sources')} className="text-[11px] font-semibold text-violet-600 dark:text-violet-400 hover:underline">Tümü →</button>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {topSources.map((source) => <SourceMini key={source.src} source={source} />)}
          </div>
        </div>

        <div className="bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100">En Yüksek Gelirli Hizmetler</p>
            <button onClick={() => onTab('services')} className="text-[11px] font-semibold text-violet-600 dark:text-violet-400 hover:underline">Tümü →</button>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {topServices.map((service) => <ServiceMini key={service.svc} service={service} />)}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100">Ekip Performans Özeti</p>
          <button onClick={() => onTab('team')} className="text-[11px] font-semibold text-violet-600 dark:text-violet-400 hover:underline">Detay →</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-100 dark:divide-gray-800">
          {RPT_STAFF_DATA.map((staff) => <StaffSummary key={staff.id} staff={staff} />)}
        </div>
      </div>
    </>
  );
}

function SourceMini({ source }: { source: SourceData }) {
  const tone = CM[source.clr] || CM.gray;
  const pct = Math.round((source.conv / source.leads) * 100);
  return (
    <div className="px-4 py-3 flex items-center gap-3">
      <div className={`w-8 h-8 ${tone.bg} rounded-lg flex items-center justify-center shrink-0 text-[12px]`}>{source.icon}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[12px] font-semibold text-gray-900 dark:text-gray-100">{source.src}</p>
          <div className="flex items-center gap-2"><span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">{source.conv} satış</span><span className="text-[10px] text-gray-400 dark:text-gray-600">%{pct}</span></div>
        </div>
        <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden"><div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: tone.hex }} /></div>
        <p className="text-[10px] text-gray-400 dark:text-gray-600 mt-0.5">{source.leads} talep · {moneyK(source.revenue)} gelir</p>
      </div>
    </div>
  );
}

function ServiceMini({ service }: { service: ServiceData }) {
  const tone = CM[service.clr] || CM.gray;
  const maxRev = RPT_SERVICE_DATA.reduce((max, item) => Math.max(max, item.revenue), 0);
  const pct = Math.round((service.revenue / maxRev) * 100);
  return (
    <div className="px-4 py-3 flex items-center gap-3">
      <div className="w-2 h-10 rounded-full shrink-0" style={{ background: tone.hex }} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1"><p className="text-[12px] font-semibold text-gray-900 dark:text-gray-100">{service.svc}</p><span className="text-[12px] font-bold text-gray-900 dark:text-gray-100">{moneyK(service.revenue)}</span></div>
        <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${pct}%`, background: tone.hex }} /></div>
        <p className="text-[10px] text-gray-400 dark:text-gray-600 mt-0.5">{service.conv} kapatılan · Ort. {moneyK(service.avgDeal)}/anlaşma</p>
      </div>
    </div>
  );
}

function StaffSummary({ staff }: { staff: StaffData }) {
  const tone = CM[staff.clr] || CM.gray;
  const maxRevenue = RPT_STAFF_DATA.reduce((max, item) => Math.max(max, item.revenue), 0);
  const width = Math.round((staff.revenue / maxRevenue) * 100);
  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-3"><div className={`w-8 h-8 ${tone.bg} rounded-full flex items-center justify-center shrink-0`}><span className={`text-[10px] font-bold ${tone.t}`}>{staff.avatar}</span></div><div><p className="text-[11px] font-bold text-gray-900 dark:text-gray-100">{staff.name.split(' ')[0]}</p><p className="text-[9px] text-gray-400 dark:text-gray-600">{staff.leads} talep</p></div></div>
      <div className="grid grid-cols-2 gap-2">
        <div className="text-center p-2 bg-gray-50 dark:bg-[#0a0a0c]/50 rounded-lg"><p className="text-[13px] font-bold text-emerald-600 dark:text-emerald-400">{staff.conv}</p><p className="text-[9px] text-gray-400 dark:text-gray-600">Dönüşüm</p></div>
        <div className="text-center p-2 bg-gray-50 dark:bg-[#0a0a0c]/50 rounded-lg"><p className="text-[13px] font-bold text-violet-600 dark:text-violet-400">%{staff.convRate}</p><p className="text-[9px] text-gray-400 dark:text-gray-600">Oran</p></div>
      </div>
      <div className="mt-2.5"><p className="text-[10px] text-gray-400 dark:text-gray-600 mb-1">Satış Katkısı</p><div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${width}%`, background: tone.hex }} /></div><p className={`text-[10px] font-semibold ${tone.t} mt-0.5`}>{moneyK(staff.revenue)}</p></div>
    </div>
  );
}

function Sources({ reportPeriod }: { reportPeriod: string }) {
  const total = RPT_SOURCE_DATA.reduce((sum, item) => sum + item.leads, 0);
  const totalConv = RPT_SOURCE_DATA.reduce((sum, item) => sum + item.conv, 0);
  const totalRev = RPT_SOURCE_DATA.reduce((sum, item) => sum + item.revenue, 0);
  const insights = [
    { t: 'En Verimli Kaynak', v: 'Referans', sub: '%45.8 dönüşüm oranı ile lider', c: 'violet' as ColorName, icon: P.star },
    { t: 'En Yüksek Hacim', v: 'Google Ads', sub: '38 talep, ₺642K gelir', c: 'sky' as ColorName, icon: P.trend },
    { t: 'Büyüme Odağı', v: 'Organik / SEO', sub: 'Maliyet sıfır, oran %41.4', c: 'emerald' as ColorName, icon: P.up },
  ];

  return (
    <>
      <div className="grid grid-cols-3 gap-3">
        {[{ l: 'Toplam Talep', v: total, c: 'violet' as ColorName }, { l: 'Satışa Dönen', v: totalConv, c: 'emerald' as ColorName }, { l: 'Toplam Gelir', v: moneyK(totalRev), c: 'amber' as ColorName }].map((item) => <MetricCard key={item.l} {...item} />)}
      </div>
      <div className="bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800"><p className="text-[12px] font-bold text-gray-900 dark:text-gray-100">Kaynak Bazlı Talep & Dönüşüm Analizi</p><p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{reportPeriod} · Google Ads, Organik, Referans, Meta, Web Formu ve diğer kanallar</p></div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead><tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50/70 dark:bg-[#0a0a0c]/50"><th className="px-4 py-2.5 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Kaynak</th><th className="px-4 py-2.5 text-right text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Talep</th><th className="px-4 py-2.5 text-right text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Satışa Dönen</th><th className="px-4 py-2.5 text-right text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Dönüşüm %</th><th className="px-4 py-2.5 text-right text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Gelir</th><th className="px-4 py-2.5 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Talep Trendi</th><th className="px-4 py-2.5 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Talep Payı</th></tr></thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {[...RPT_SOURCE_DATA].sort((a, b) => b.conv - a.conv).map((source) => {
                const tone = CM[source.clr] || CM.gray;
                const share = Math.round((source.leads / total) * 100);
                return (
                  <tr key={source.src} className="gr group">
                    <td className="px-4 py-3"><div className="flex items-center gap-2.5"><div className={`w-8 h-8 ${tone.bg} rounded-lg flex items-center justify-center shrink-0 text-[13px]`}>{source.icon}</div><span className="text-[13px] font-semibold text-gray-900 dark:text-gray-100">{source.src}</span></div></td>
                    <td className="px-4 py-3 text-right text-[13px] font-bold text-gray-900 dark:text-gray-100">{source.leads}</td>
                    <td className="px-4 py-3 text-right text-[13px] font-bold text-emerald-600 dark:text-emerald-400">{source.conv}</td>
                    <td className="px-4 py-3 text-right"><span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${source.rate >= 40 ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' : source.rate >= 30 ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' : 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300'}`}>%{source.rate}</span></td>
                    <td className="px-4 py-3 text-right text-[13px] font-bold text-violet-700 dark:text-violet-300">{moneyK(source.revenue)}</td>
                    <td className="px-4 py-3 w-28"><Spark points={source.trend} color={tone.hex} /></td>
                    <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${share}%`, background: tone.hex }} /></div><span className="text-[11px] text-gray-500 dark:text-gray-400 w-8 text-right">%{share}</span></div></td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot><tr className="border-t-2 border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-[#0a0a0c]/50"><td className="px-4 py-3 text-[12px] font-bold text-gray-900 dark:text-gray-100">TOPLAM</td><td className="px-4 py-3 text-right text-[13px] font-bold text-gray-900 dark:text-gray-100">{total}</td><td className="px-4 py-3 text-right text-[13px] font-bold text-emerald-600 dark:text-emerald-400">{totalConv}</td><td className="px-4 py-3 text-right"><span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300">%{((totalConv / total) * 100).toFixed(1)}</span></td><td className="px-4 py-3 text-right text-[13px] font-bold text-violet-700 dark:text-violet-300">{moneyK(totalRev)}</td><td className="px-4 py-3" /><td className="px-4 py-3" /></tr></tfoot>
          </table>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {insights.map((item) => {
          const tone = CM[item.c] || CM.gray;
          return <div key={item.t} className="flex items-start gap-3 p-4 bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-800 rounded-xl"><div className={`w-8 h-8 ${tone.bg} rounded-lg flex items-center justify-center shrink-0`}><Icon className={tone.t}>{item.icon}</Icon></div><div><p className="text-[10px] font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide mb-0.5">{item.t}</p><p className="text-[14px] font-bold text-gray-900 dark:text-gray-100">{item.v}</p><p className="text-[11px] text-gray-500 dark:text-gray-400">{item.sub}</p></div></div>;
        })}
      </div>
    </>
  );
}

function MetricCard({ l, v, c, sub }: { l: string; v: ReactNode; c: ColorName; sub?: string }) {
  const tone = CM[c] || CM.gray;
  return <div className="bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3"><p className={`text-[22px] font-bold ${tone.t} leading-none mb-0.5`}>{v}</p><p className="text-[11px] text-gray-500 dark:text-gray-400">{l}{sub ? ` · ${sub}` : ''}</p></div>;
}

function Services({ reportPeriod }: { reportPeriod: string }) {
  const totalRev = RPT_SERVICE_DATA.reduce((sum, item) => sum + item.revenue, 0);
  return (
    <>
      <div className="grid grid-cols-3 gap-3">
        {[{ l: 'Toplam Hizmet Geliri', v: moneyK(totalRev), c: 'violet' as ColorName }, { l: 'En Yüksek Ort. Anlaşma', v: '₺47K', c: 'emerald' as ColorName, sub: 'Prodüksiyon' }, { l: 'En Çok Talep Gören', v: 'SEO', c: 'sky' as ColorName, sub: '52 talep' }].map((item) => <MetricCard key={item.l} {...item} />)}
      </div>
      <div className="bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800"><p className="text-[12px] font-bold text-gray-900 dark:text-gray-100">Hizmet Bazlı Satış & Gelir Analizi</p><p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{reportPeriod} · SEO, Web Sitesi, Google Ads, Meta Reklam ve diğer hizmetler</p></div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead><tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50/70 dark:bg-[#0a0a0c]/50"><th className="px-4 py-2.5 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Hizmet</th><th className="px-4 py-2.5 text-right text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Talep</th><th className="px-4 py-2.5 text-right text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Kapatılan</th><th className="px-4 py-2.5 text-right text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Ort. Süre</th><th className="px-4 py-2.5 text-right text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Ort. Anlaşma</th><th className="px-4 py-2.5 text-right text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Toplam Gelir</th><th className="px-4 py-2.5 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Gelir Payı</th></tr></thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {[...RPT_SERVICE_DATA].sort((a, b) => b.revenue - a.revenue).map((service) => {
                const tone = CM[service.clr] || CM.gray;
                const pct = Math.round((service.revenue / totalRev) * 100);
                return <tr key={service.svc} className="gr group"><td className="px-4 py-3"><div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: tone.hex }} /><span className="text-[13px] font-semibold text-gray-900 dark:text-gray-100">{service.svc}</span></div></td><td className="px-4 py-3 text-right text-[13px] font-bold text-gray-900 dark:text-gray-100">{service.leads}</td><td className="px-4 py-3 text-right text-[13px] font-bold text-emerald-600 dark:text-emerald-400">{service.conv}</td><td className="px-4 py-3 text-right text-[12px] text-gray-600 dark:text-gray-400">{service.months} ay</td><td className="px-4 py-3 text-right text-[13px] font-bold text-violet-700 dark:text-violet-300">{moneyK(service.avgDeal)}</td><td className="px-4 py-3 text-right text-[13px] font-bold text-gray-900 dark:text-gray-100">{moneyK(service.revenue)}</td><td className="px-4 py-3"><div className="flex items-center gap-2"><div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${pct}%`, background: tone.hex }} /></div><span className="text-[11px] text-gray-500 dark:text-gray-400 w-7 text-right">%{pct}</span></div></td></tr>;
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function Team({ reportStaffFilter, onStaffFilter }: { reportStaffFilter: string; onStaffFilter: (filter: string) => void }) {
  const filters = ['Tümü', ...RPT_STAFF_DATA.map((staff) => staff.name)];
  const filtered = reportStaffFilter === 'Tümü' ? RPT_STAFF_DATA : RPT_STAFF_DATA.filter((staff) => staff.name === reportStaffFilter);
  return (
    <>
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => <button key={filter} onClick={() => onStaffFilter(filter)} className={`rsf-btn px-3 py-1.5 text-[11px] font-semibold rounded-lg border transition-all ${filter === reportStaffFilter ? 'bg-violet-600 text-white border-violet-600' : 'bg-white dark:bg-[#17171a] border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-violet-400 hover:text-violet-600'}`}>{filter}</button>)}
      </div>
      {filtered.map((staff) => <StaffDetail key={staff.id} staff={staff} />)}
    </>
  );
}

function StaffDetail({ staff }: { staff: StaffData }) {
  const tone = CM[staff.clr] || CM.gray;
  const srcEntries = Object.entries({ 'Google Ads': staff.bySource.gads, Organik: staff.bySource.organic, Referans: staff.bySource.referral, Meta: staff.bySource.meta, Diğer: staff.bySource.other }).filter(([, value]) => value > 0);
  const srcTotal = srcEntries.reduce((sum, [, value]) => sum + value, 0);
  return (
    <div className="bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-3"><div className={`w-10 h-10 ${tone.bg} rounded-full flex items-center justify-center shrink-0`}><span className={`text-[13px] font-bold ${tone.t}`}>{staff.avatar}</span></div><div><p className="text-[14px] font-bold text-gray-900 dark:text-gray-100">{staff.name}</p><p className="text-[11px] text-gray-500 dark:text-gray-400">{staff.title}</p></div></div>
        <div className="flex items-center gap-4"><div className="text-center"><p className="text-[18px] font-bold text-emerald-600 dark:text-emerald-400">{staff.conv}</p><p className="text-[10px] text-gray-400 dark:text-gray-600">Dönüşüm</p></div><div className="text-center"><p className="text-[18px] font-bold text-violet-600 dark:text-violet-400">%{staff.convRate}</p><p className="text-[10px] text-gray-400 dark:text-gray-600">Oran</p></div><div className="text-center"><p className="text-[18px] font-bold text-gray-900 dark:text-gray-100">{staff.avgResponseH}sa</p><p className="text-[10px] text-gray-400 dark:text-gray-600">Ort. Yanıt</p></div><div className="text-center"><p className="text-[18px] font-bold text-amber-600 dark:text-amber-400">★ {staff.satisfaction}</p><p className="text-[10px] text-gray-400 dark:text-gray-600">Memnuniyet</p></div></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-gray-800">
        <div className="p-4"><p className="text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-3">Aylık Talep Trendi</p><div className="flex items-end gap-1.5 h-16">{staff.byMonth.map((value, index) => { const mx = Math.max(...staff.byMonth); return <div key={`${value}-${index}`} className="flex-1 flex flex-col items-center gap-1"><div className="w-full rounded-sm transition-all" style={{ height: `${Math.max(4, Math.round((value / mx) * 56))}px`, background: tone.hex, opacity: index === staff.byMonth.length - 1 ? 1 : 0.55 }} /><span className="text-[8px] text-gray-400 dark:text-gray-600">{['K', 'Ş', 'M', 'N', 'M', 'H'][index] || ''}</span></div>; })}</div><div className="mt-3 flex items-center justify-between"><span className="text-[11px] text-gray-500 dark:text-gray-400">Bu dönem: <strong className="text-gray-900 dark:text-gray-100">{staff.leads} talep</strong></span><span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">{moneyK(staff.revenue)} gelir</span></div></div>
        <div className="p-4"><p className="text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-3">Kaynak Dağılımı</p><div className="space-y-2">{srcEntries.map(([src, val]) => <div key={src} className="flex items-center gap-2"><span className="text-[11px] text-gray-600 dark:text-gray-400 w-24 truncate">{src}</span><div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${Math.round((val / srcTotal) * 100)}%`, background: tone.hex }} /></div><span className="text-[11px] font-semibold text-gray-900 dark:text-gray-100 w-6 text-right">{val}</span></div>)}</div></div>
        <div className="p-4"><p className="text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-3">Kapattığı Hizmetler</p><div className="space-y-1.5 mb-3">{staff.bySvc.map((svc) => <div key={svc} className="flex items-center gap-2 px-2.5 py-1.5 bg-gray-50 dark:bg-[#0a0a0c]/50 rounded-lg"><span className="w-2 h-2 rounded-full shrink-0" style={{ background: tone.hex }} /><span className="text-[11px] text-gray-700 dark:text-gray-300">{svc}</span></div>)}</div><div className="border-t border-gray-100 dark:border-gray-800 pt-3"><p className="text-[10px] text-gray-400 dark:text-gray-600 mb-0.5">Hak Edilen Prim</p><p className="text-[14px] font-bold text-violet-700 dark:text-violet-300">₺{staff.prim.toLocaleString('tr-TR')}</p><div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full mt-1.5 overflow-hidden"><div className="h-full rounded-full" style={{ width: `${Math.round((staff.primPaid / staff.prim) * 100)}%`, background: tone.hex }} /></div><p className="text-[10px] text-gray-400 dark:text-gray-600 mt-0.5">Ödenen: ₺{staff.primPaid.toLocaleString('tr-TR')} · %{Math.round((staff.primPaid / staff.prim) * 100)}</p></div></div>
      </div>
    </div>
  );
}

function Conversion({ reportPeriod }: { reportPeriod: string }) {
  const stages = [
    { label: 'Gelen Talep', v: 153, pct: 100, drop: null, c: '#8b5cf6' },
    { label: 'Veri Kontrolü', v: 138, pct: 90, drop: '−10%', c: '#6366f1' },
    { label: 'Satışa Yönlendirme', v: 112, pct: 73, drop: '−19%', c: '#0ea5e9' },
    { label: 'Teklif Gönderildi', v: 89, pct: 58, drop: '−21%', c: '#10b981' },
    { label: 'Sözleşme Aşaması', v: 74, pct: 48, drop: '−17%', c: '#f59e0b' },
    { label: 'İmzalandı', v: 57, pct: 37, drop: '−23%', c: '#f59e0b' },
    { label: 'Finansa Aktarıldı', v: 57, pct: 37, drop: '—', c: '#10b981' },
  ];
  const lostAt = [
    { stage: 'Veri Kontrolü → Satışa Yön.', reason: 'Eksik veri / segment sorunu', count: 26, fix: 'Veri kalitesi skorunu artır' },
    { stage: 'Teklif → Sözleşme', reason: 'Fiyat uyumsuzluğu / rakip', count: 15, fix: 'AI fiyatlama optimizasyonu' },
    { stage: 'Sözleşme → İmza', reason: 'Karar gecikme / iç onay', count: 17, fix: 'Ön onay sürecini hızlandır' },
  ];

  return (
    <>
      <div className="bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-5"><div><p className="text-[13px] font-bold text-gray-900 dark:text-gray-100">Dönüşüm Hunisi</p><p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{reportPeriod} · Talepten finans aktarımına tam akış</p></div><div className="flex items-center gap-4"><div className="text-center"><p className="text-[18px] font-bold text-violet-600 dark:text-violet-400">%37.3</p><p className="text-[10px] text-gray-400 dark:text-gray-600">Uçtan Uca Oran</p></div><div className="text-center"><p className="text-[18px] font-bold text-gray-900 dark:text-gray-100">153→57</p><p className="text-[10px] text-gray-400 dark:text-gray-600">Talep → Kapatılan</p></div></div></div>
        <div className="space-y-2">
          {stages.map((stage, index) => <div key={stage.label} className="flex items-center gap-3"><div className="w-28 text-right shrink-0"><p className="text-[11px] font-medium text-gray-700 dark:text-gray-300">{stage.label}</p></div><div className="flex-1 relative"><div className="h-10 rounded-lg flex items-center px-3 transition-all" style={{ width: `${stage.pct}%`, background: stage.c, opacity: 0.65 + index * 0.05 }}><span className="text-[11px] font-bold text-white">{stage.v}</span></div></div><div className="w-16 shrink-0">{stage.drop ? <span className="text-[10px] font-semibold text-rose-600 dark:text-rose-400">{stage.drop}</span> : <span className="text-[10px] text-gray-400 dark:text-gray-600">—</span>}</div></div>)}
        </div>
      </div>
      <div className="bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800"><p className="text-[12px] font-bold text-gray-900 dark:text-gray-100">Kayıp Analizi — Nerede Kaybediyoruz?</p></div>
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {lostAt.map((lost) => <div key={lost.stage} className="px-4 py-4 flex items-start gap-4"><div className="w-9 h-9 bg-rose-100 dark:bg-rose-900/30 rounded-lg flex items-center justify-center shrink-0"><span className="text-[13px] font-bold text-rose-600 dark:text-rose-400">{lost.count}</span></div><div className="flex-1"><p className="text-[12px] font-bold text-gray-900 dark:text-gray-100 mb-0.5">{lost.stage}</p><p className="text-[11px] text-gray-500 dark:text-gray-400 mb-2">{lost.reason}</p><div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/40 rounded-lg inline-flex"><Icon className="text-emerald-600 dark:text-emerald-400 w-3 h-3">{P.chk}</Icon><span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">{lost.fix}</span></div></div></div>)}
        </div>
      </div>
    </>
  );
}
