import { type ReactNode, useMemo, useState } from 'react';

type ColorName = 'emerald' | 'amber' | 'rose' | 'sky' | 'violet' | 'indigo' | 'teal' | 'gray' | 'pink';
type ReportTab = 'overview' | 'proposals' | 'funnel' | 'team' | 'profitability' | 'services';

type SourceReport = {
  src: string;
  icon: string;
  clr: ColorName;
  proposals: number;
  accepted: number;
  rate: number;
  revenue: number;
  avgDeal: number;
  avgDisc: number;
  trend: number[];
};

type ServiceReport = {
  svc: string;
  sid: string;
  clr: ColorName;
  proposals: number;
  sold: number;
  revenue: number;
  avgDeal: number;
  margin: number;
  discAvg: number;
};

type StaffReport = {
  id: number;
  name: string;
  avatar: string;
  clr: ColorName;
  title: string;
  proposals: number;
  accepted: number;
  rate: number;
  revenue: number;
  mrr: number;
  prim: number;
  primPaid: number;
  avgDisc: number;
  marginAvg: number;
  byMonth: number[];
  bySource: Record<string, number>;
  bySvc: string[];
  avgResponseH: number;
  satisfaction: number;
  contracts: number;
};

type FunnelStage = {
  stage: string;
  count: number;
  rate: number;
  avgH: number;
  clr: ColorName;
  desc: string;
};

type DiscountBucket = {
  range: string;
  proposals: number;
  accepted: number;
  rate: number;
  avgMargin: number;
  clr: ColorName;
};

const REPORT_PERIODS = ['Son 7 Gün', 'Son 30 Gün', 'Son 3 Ay', 'Son 6 Ay', 'Bu Yıl', 'Özel Aralık'];

const CM: Partial<Record<ColorName, { bg: string; t: string }>> = {
  emerald: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', t: 'text-emerald-700 dark:text-emerald-300' },
  amber: { bg: 'bg-amber-100 dark:bg-amber-900/30', t: 'text-amber-700 dark:text-amber-300' },
  rose: { bg: 'bg-rose-100 dark:bg-rose-900/30', t: 'text-rose-700 dark:text-rose-300' },
  sky: { bg: 'bg-sky-100 dark:bg-sky-900/30', t: 'text-sky-700 dark:text-sky-300' },
  violet: { bg: 'bg-violet-100 dark:bg-violet-900/30', t: 'text-violet-700 dark:text-violet-300' },
  indigo: { bg: 'bg-indigo-100 dark:bg-indigo-900/30', t: 'text-indigo-700 dark:text-indigo-300' },
  teal: { bg: 'bg-teal-100 dark:bg-teal-900/30', t: 'text-teal-700 dark:text-teal-300' },
  gray: { bg: 'bg-gray-100 dark:bg-gray-800', t: 'text-gray-600 dark:text-gray-400' },
};

const RPT_SALES_SOURCE_DATA: SourceReport[] = [
  { src: 'Google Ads', icon: 'G', clr: 'sky', proposals: 42, accepted: 18, rate: 42.9, revenue: 1843000, avgDeal: 102389, avgDisc: 8.2, trend: [28, 32, 35, 38, 40, 41, 42] },
  { src: 'Organik / SEO', icon: '🔍', clr: 'emerald', proposals: 31, accepted: 15, rate: 48.4, revenue: 1289000, avgDeal: 85933, avgDisc: 6.1, trend: [18, 22, 25, 27, 29, 30, 31] },
  { src: 'Referans', icon: '👥', clr: 'violet', proposals: 26, accepted: 14, rate: 53.8, revenue: 1540000, avgDeal: 110000, avgDisc: 4.3, trend: [14, 17, 20, 22, 24, 25, 26] },
  { src: 'Meta Reklam', icon: 'M', clr: 'indigo', proposals: 20, accepted: 7, rate: 35.0, revenue: 672000, avgDeal: 96000, avgDisc: 10.5, trend: [10, 13, 15, 17, 18, 19, 20] },
  { src: 'Web Sitesi Form', icon: '🌐', clr: 'violet', proposals: 18, accepted: 6, rate: 33.3, revenue: 498000, avgDeal: 83000, avgDisc: 9.2, trend: [8, 10, 12, 14, 16, 17, 18] },
  { src: 'Talep Havuzu', icon: '📋', clr: 'amber', proposals: 15, accepted: 7, rate: 46.7, revenue: 612000, avgDeal: 87429, avgDisc: 7.5, trend: [6, 8, 10, 12, 13, 14, 15] },
  { src: 'E-Bülten', icon: '✉', clr: 'sky', proposals: 11, accepted: 3, rate: 27.3, revenue: 195000, avgDeal: 65000, avgDisc: 11.0, trend: [4, 5, 7, 8, 9, 10, 11] },
  { src: 'Telefon', icon: '📞', clr: 'gray', proposals: 9, accepted: 4, rate: 44.4, revenue: 312000, avgDeal: 78000, avgDisc: 5.2, trend: [3, 4, 5, 6, 7, 8, 9] },
];

const RPT_SERVICE_SALES_DATA: ServiceReport[] = [
  { svc: 'Web Sitesi', sid: 'web', clr: 'sky', proposals: 38, sold: 16, revenue: 912000, avgDeal: 57000, margin: 38.2, discAvg: 9.1 },
  { svc: 'SEO Yönetim', sid: 'seo', clr: 'violet', proposals: 34, sold: 19, revenue: 684000, avgDeal: 36000, margin: 32.5, discAvg: 6.8 },
  { svc: 'Google Ads', sid: 'google-ads', clr: 'emerald', proposals: 42, sold: 22, revenue: 1056000, avgDeal: 48000, margin: 48.3, discAvg: 5.4 },
  { svc: 'Sosyal Medya', sid: 'social-media', clr: 'pink', proposals: 28, sold: 11, revenue: 462000, avgDeal: 42000, margin: 28.1, discAvg: 11.2 },
  { svc: 'Sosyal Reklam', sid: 'social-ads', clr: 'indigo', proposals: 24, sold: 9, revenue: 378000, avgDeal: 42000, margin: 42.8, discAvg: 7.6 },
  { svc: 'Prodüksiyon', sid: 'production', clr: 'rose', proposals: 19, sold: 8, revenue: 624000, avgDeal: 78000, margin: 25.4, discAvg: 12.3 },
  { svc: 'Marka Tescili', sid: 'trademark', clr: 'amber', proposals: 14, sold: 9, revenue: 198000, avgDeal: 22000, margin: 34.2, discAvg: 3.1 },
  { svc: 'Premium 360', sid: 'premium360', clr: 'amber', proposals: 8, sold: 3, revenue: 558000, avgDeal: 186000, margin: 42.5, discAvg: 2.8 },
  { svc: 'Hosting', sid: 'hosting', clr: 'teal', proposals: 22, sold: 15, revenue: 126000, avgDeal: 8400, margin: 32.0, discAvg: 4.2 },
  { svc: 'Domain', sid: 'domain', clr: 'gray', proposals: 19, sold: 14, revenue: 28000, avgDeal: 2000, margin: 15.8, discAvg: 2.1 },
];

const RPT_SALES_STAFF_DATA: StaffReport[] = [
  { id: 1, name: 'Çiğdem Alataş', avatar: 'ÇA', clr: 'violet', title: 'Kıdemli Satış Temsilcisi', proposals: 28, accepted: 15, rate: 53.6, revenue: 1284000, mrr: 82500, prim: 38520, primPaid: 23112, avgDisc: 7.2, marginAvg: 42.1, byMonth: [14, 18, 21, 23, 25, 27, 28], bySource: { gads: 8, organic: 7, referral: 8, meta: 3, other: 2 }, bySvc: ['Google Ads x8', 'SEO x6', 'Web x4', 'Meta x3'], avgResponseH: 1.8, satisfaction: 4.8, contracts: 13 },
  { id: 2, name: 'Berke Yılmaz', avatar: 'BY', clr: 'sky', title: 'Satış Temsilcisi', proposals: 23, accepted: 11, rate: 47.8, revenue: 938000, mrr: 58400, prim: 28140, primPaid: 16884, avgDisc: 8.5, marginAvg: 38.4, byMonth: [12, 14, 17, 19, 20, 21, 23], bySource: { gads: 9, organic: 5, referral: 5, meta: 4, other: 0 }, bySvc: ['Google Ads x6', 'Prodüksiyon x4', 'Web x3', 'Meta x4'], avgResponseH: 2.2, satisfaction: 4.5, contracts: 10 },
  { id: 3, name: 'Mert Kaya', avatar: 'MK', clr: 'emerald', title: 'Satış Temsilcisi', proposals: 19, accepted: 9, rate: 47.4, revenue: 742000, mrr: 46200, prim: 22260, primPaid: 13356, avgDisc: 6.8, marginAvg: 44.5, byMonth: [10, 12, 14, 15, 17, 18, 19], bySource: { gads: 4, organic: 8, referral: 5, meta: 1, other: 1 }, bySvc: ['SEO x7', 'Hosting x3', 'Domain x3', 'Web x2'], avgResponseH: 2.8, satisfaction: 4.6, contracts: 8 },
  { id: 4, name: 'Deniz Arıcan', avatar: 'DA', clr: 'amber', title: 'Junior Satış Temsilcisi', proposals: 16, accepted: 7, rate: 43.8, revenue: 486000, mrr: 29400, prim: 14580, primPaid: 7290, avgDisc: 10.3, marginAvg: 32.8, byMonth: [6, 8, 10, 11, 13, 14, 16], bySource: { gads: 3, organic: 4, referral: 4, meta: 4, other: 1 }, bySvc: ['SEO x4', 'Marka Tescili x3', 'Sosyal Medya x3', 'Web x2'], avgResponseH: 3.4, satisfaction: 4.2, contracts: 6 },
];

const RPT_SALES_FUNNEL: FunnelStage[] = [
  { stage: 'Talep Havuzu', count: 178, rate: 100, avgH: 0, clr: 'gray', desc: 'Pazarlamadan gelen ham talepler' },
  { stage: 'Satışa Devredildi', count: 142, rate: 79.8, avgH: 4, clr: 'violet', desc: 'Kalifiye fırsat olarak atandı' },
  { stage: 'Teklif Gönderildi', count: 117, rate: 82.4, avgH: 18, clr: 'sky', desc: 'Müşteriye resmi teklif iletildi' },
  { stage: 'Müşteri Açtı', count: 98, rate: 83.8, avgH: 6, clr: 'indigo', desc: 'Link tıklandı, teklif incelendi' },
  { stage: 'Teklif Onaylandı', count: 58, rate: 59.2, avgH: 72, clr: 'amber', desc: 'Müşteri kabul verdi' },
  { stage: 'Sözleşme Aktarıldı', count: 54, rate: 93.1, avgH: 24, clr: 'teal', desc: 'Karlılık onayı geçti' },
  { stage: 'Kaşe + İmza Tamam', count: 49, rate: 90.7, avgH: 96, clr: 'rose', desc: 'İmzalı sözleşme finansa hazır' },
  { stage: 'Finansa Devredildi', count: 47, rate: 95.9, avgH: 12, clr: 'sky', desc: 'Finans panosuna aktarıldı' },
  { stage: 'Aktif Müşteri', count: 45, rate: 95.7, avgH: 48, clr: 'emerald', desc: 'İş süreci başladı' },
];

const RPT_DISCOUNT_BUCKETS: DiscountBucket[] = [
  { range: '0-5%', proposals: 48, accepted: 28, rate: 58.3, avgMargin: 45.8, clr: 'emerald' },
  { range: '5-10%', proposals: 62, accepted: 31, rate: 50.0, avgMargin: 38.2, clr: 'teal' },
  { range: '10-15%', proposals: 38, accepted: 19, rate: 50.0, avgMargin: 31.5, clr: 'amber' },
  { range: '15-20%', proposals: 22, accepted: 11, rate: 50.0, avgMargin: 24.1, clr: 'rose' },
  { range: '20%+', proposals: 8, accepted: 3, rate: 37.5, avgMargin: 17.2, clr: 'rose' },
];

const SERVICE_COSTS: Record<string, { minMargin: number }> = {
  web: { minMargin: 25 },
  seo: { minMargin: 25 },
  'google-ads': { minMargin: 30 },
  'social-media': { minMargin: 20 },
  'social-ads': { minMargin: 28 },
  production: { minMargin: 20 },
  domain: { minMargin: 8 },
  hosting: { minMargin: 15 },
  trademark: { minMargin: 22 },
  premium360: { minMargin: 30 },
};

const REPORT_TABS: Array<{ id: ReportTab; label: string; icon: ReactNode }> = [
  { id: 'overview', label: 'Genel Bakış', icon: <><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></> },
  { id: 'proposals', label: 'Teklif Performansı', icon: <><path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4 20-7z" /></> },
  { id: 'funnel', label: 'Satış Hunisi', icon: <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /> },
  { id: 'team', label: 'Ekip Performansı', icon: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></> },
  { id: 'profitability', label: 'Karlılık Analizi', icon: <><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></> },
  { id: 'services', label: 'Hizmet Mix', icon: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" /></> },
];

const SPARK_COLORS: Record<ColorName, string> = {
  sky: '#0ea5e9',
  emerald: '#10b981',
  violet: '#8b5cf6',
  indigo: '#6366f1',
  amber: '#f59e0b',
  gray: '#6b7280',
  rose: '#f43f5e',
  teal: '#14b8a6',
  pink: '#ec4899',
};

function cm(color: ColorName) {
  return CM[color] || CM.gray!;
}

function Icon({ children, className = 'w-3.5 h-3.5 shrink-0' }: { children: ReactNode; className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      {children}
    </svg>
  );
}

function Sparkline({ data, color }: { data: number[]; color: ColorName }) {
  if (data.length < 2) return null;
  const width = 60;
  const height = 20;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((value, index) => `${index * (width / (data.length - 1))},${height - ((value - min) / range) * height}`).join(' ');

  return (
    <svg width={width} height={height} className="inline-block">
      <polyline fill="none" stroke={SPARK_COLORS[color] || '#6b7280'} strokeWidth="1.5" points={points} />
    </svg>
  );
}

export default function Raporlar() {
  const [reportPeriod, setReportPeriod] = useState('Son 30 Gün');
  const [reportTab, setReportTab] = useState<ReportTab>('overview');

  const totals = useMemo(() => {
    const totalProposals = RPT_SALES_SOURCE_DATA.reduce((sum, item) => sum + item.proposals, 0);
    const totalAccepted = RPT_SALES_SOURCE_DATA.reduce((sum, item) => sum + item.accepted, 0);
    const totalRevenue = RPT_SALES_SOURCE_DATA.reduce((sum, item) => sum + item.revenue, 0);
    const totalMRR = RPT_SALES_STAFF_DATA.reduce((sum, item) => sum + item.mrr, 0);
    const avgRate = totalProposals > 0 ? ((totalAccepted / totalProposals) * 100).toFixed(1) : '0';
    return { totalProposals, totalAccepted, totalRevenue, totalMRR, avgRate };
  }, []);

  return (
    <>
      <div className="relative overflow-hidden rounded-2xl border border-violet-300/40 dark:border-violet-500/30 shadow-lg">
        <div className="relative bg-gradient-to-br from-[#0f0a2a] via-[#1a1040] to-[#0f0a2a] p-5 md:p-6">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-violet-500/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />

          <div className="relative flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-400 to-violet-600 rounded-xl blur-md opacity-60" />
                <div className="relative w-12 h-12 bg-gradient-to-br from-violet-400 via-violet-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Icon className="text-white w-6 h-6">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M3 9h18" />
                    <path d="M9 21V9" />
                  </Icon>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <div className="text-[10px] font-bold tracking-[0.2em] text-violet-300 uppercase">ADOS Satış Analitik</div>
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-500/20 border border-amber-400/40 rounded-full">
                    <Icon className="text-amber-300 w-3 h-3">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </Icon>
                    <span className="text-[9px] font-bold text-amber-200 tracking-wider">DİREKTÖR</span>
                  </span>
                </div>
                <h2 className="text-[24px] md:text-[28px] font-black leading-tight">
                  <span className="bg-gradient-to-r from-violet-200 via-white to-violet-200 bg-clip-text text-transparent">Satış & Teklif Raporları</span>
                </h2>
                <p className="text-[11px] text-white/70 mt-0.5">
                  {totals.totalProposals} teklif · %{totals.avgRate} kazanma oranı · ₺{Math.round(totals.totalRevenue / 1000)}K toplam ciro · ₺{Math.round(totals.totalMRR / 1000)}K aylık MRR
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1 p-1 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg">
                {REPORT_PERIODS.slice(0, 5).map((period) => (
                  <button
                    key={period}
                    onClick={() => setReportPeriod(period)}
                    className={`rp-btn px-2.5 py-1 text-[10px] font-semibold rounded-md transition-all ${period === reportPeriod ? 'bg-white/20 text-white shadow-sm' : 'text-white/60 hover:text-white'}`}
                  >
                    {period}
                  </button>
                ))}
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[11px] font-bold rounded-lg shadow-md hover:shadow-lg transition-all">
                <Icon className="w-3.5 h-3.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </Icon>
                PDF İndir
              </button>
            </div>
          </div>
        </div>
        <div className="h-0.5 bg-gradient-to-r from-violet-500 via-amber-300 to-violet-500" />
      </div>

      <div className="flex flex-wrap gap-1 border-b border-gray-200 dark:border-gray-600/50 -mb-1 overflow-x-auto">
        {REPORT_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setReportTab(tab.id)}
            id={`rpt-${tab.id}`}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-[12px] font-semibold whitespace-nowrap border-b-2 transition-colors ${tab.id === reportTab ? 'border-violet-600 text-violet-600 dark:text-violet-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
            <Icon className="w-3.5 h-3.5">{tab.icon}</Icon>
            {tab.label}
          </button>
        ))}
      </div>

      <div id="rpt-content" className="space-y-4 md:space-y-5">
        {reportTab === 'overview' ? <RptOverview reportPeriod={reportPeriod} onSwitchTab={setReportTab} /> : null}
        {reportTab === 'proposals' ? <RptProposals reportPeriod={reportPeriod} /> : null}
        {reportTab === 'funnel' ? <RptFunnel reportPeriod={reportPeriod} /> : null}
        {reportTab === 'team' ? <RptTeam /> : null}
        {reportTab === 'profitability' ? <RptProfitability reportPeriod={reportPeriod} /> : null}
        {reportTab === 'services' ? <RptServices reportPeriod={reportPeriod} /> : null}
      </div>
    </>
  );
}

function RptOverview({ reportPeriod, onSwitchTab }: { reportPeriod: string; onSwitchTab: (tab: ReportTab) => void }) {
  const totalProposals = RPT_SALES_SOURCE_DATA.reduce((sum, item) => sum + item.proposals, 0);
  const totalAccepted = RPT_SALES_SOURCE_DATA.reduce((sum, item) => sum + item.accepted, 0);
  const totalRevenue = RPT_SALES_SOURCE_DATA.reduce((sum, item) => sum + item.revenue, 0);
  const totalMRR = RPT_SALES_STAFF_DATA.reduce((sum, item) => sum + item.mrr, 0);
  const avgMargin = RPT_SERVICE_SALES_DATA.reduce((sum, item) => sum + item.margin * item.revenue, 0) / RPT_SERVICE_SALES_DATA.reduce((sum, item) => sum + item.revenue, 0);
  const avgRate = totalProposals > 0 ? ((totalAccepted / totalProposals) * 100).toFixed(1) : '0';
  const avgDealSize = totalAccepted > 0 ? Math.round(totalRevenue / totalAccepted) : 0;
  const topSources = [...RPT_SALES_SOURCE_DATA].sort((a, b) => b.revenue - a.revenue).slice(0, 4);
  const topServices = [...RPT_SERVICE_SALES_DATA].sort((a, b) => b.revenue - a.revenue).slice(0, 4);

  const kpis = [
    { label: 'Toplam Teklif', value: totalProposals, sub: 'Son 30 günde gönderilen', clr: 'violet' as ColorName, trend: '+18.2%', icon: <><path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4 20-7z" /></> },
    { label: 'Kazanma Oranı', value: `%${avgRate}`, sub: `${totalAccepted} kabul · ${totalProposals - totalAccepted} diğer`, clr: 'emerald' as ColorName, trend: '+5.4%', icon: <polyline points="20 6 9 17 4 12" /> },
    { label: 'Toplam Ciro', value: `₺${Math.round(totalRevenue / 1000)}K`, sub: '1. yıl bedelleri toplamı', clr: 'amber' as ColorName, trend: '+23.1%', icon: <><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></> },
    { label: 'Ort. Anlaşma', value: `₺${Math.round(avgDealSize / 1000)}K`, sub: 'Kabul edilen başına', clr: 'sky' as ColorName, trend: '+12.7%', icon: <><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /></> },
    { label: 'Aylık MRR', value: `₺${Math.round(totalMRR / 1000)}K`, sub: 'Recurring revenue', clr: 'teal' as ColorName, trend: '+8.3%', icon: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /> },
    { label: 'Ort. Karlılık', value: `%${avgMargin.toFixed(1)}`, sub: 'Maliyet sonrası marj', clr: 'emerald' as ColorName, trend: '+1.8%', icon: <><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></> },
  ];

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
        {kpis.map((kpi) => {
          const color = cm(kpi.clr);
          return (
            <div key={kpi.label} className="relative overflow-hidden bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-3.5 hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className={`absolute -top-6 -right-6 w-16 h-16 bg-${kpi.clr}-500/5 rounded-full pointer-events-none`} />
              <div className="relative flex items-start justify-between mb-2">
                <div className={`w-8 h-8 ${color.bg} rounded-lg flex items-center justify-center`}><Icon className={`${color.t} w-4 h-4`}>{kpi.icon}</Icon></div>
                <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 bg-emerald-50 dark:bg-emerald-500/10 rounded">{kpi.trend}</span>
              </div>
              <div className="relative text-[22px] font-bold text-gray-900 dark:text-gray-50 leading-none mb-1">{kpi.value}</div>
              <div className="relative text-[11px] text-gray-500 dark:text-gray-400 leading-tight">{kpi.label}</div>
              <div className="relative text-[9px] text-gray-400 dark:text-gray-500 mt-0.5">{kpi.sub}</div>
            </div>
          );
        })}
      </div>

      <div className="bg-gradient-to-br from-violet-50 to-indigo-50/50 dark:from-violet-500/10 dark:to-indigo-500/5 border border-violet-200 dark:border-violet-500/20 rounded-xl p-3 flex items-center gap-3 flex-wrap">
        <Icon className="text-violet-600 dark:text-violet-400 w-4 h-4 shrink-0"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></Icon>
        <p className="text-[11px] text-violet-800 dark:text-violet-300 flex-1">
          Bu rapor <strong>ADOS AI tarafından</strong> her gün 07:00'de otomatik derleniyor.
          <span className="text-[10px] text-violet-700/70 dark:text-violet-400/70"> Dönem: <strong>{reportPeriod}</strong> · 23 Mar 2026 — 22 Nis 2026</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <TopSources topSources={topSources} onSwitchTab={onSwitchTab} />
        <TopServices topServices={topServices} onSwitchTab={onSwitchTab} />
      </div>

      <LeadershipSummary onSwitchTab={onSwitchTab} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50/50 dark:from-amber-500/10 dark:to-yellow-500/5 border border-amber-200 dark:border-amber-500/30 rounded-xl p-4">
          <div className="flex items-start gap-2.5">
            <div className="w-9 h-9 bg-amber-100 dark:bg-amber-500/20 rounded-lg flex items-center justify-center shrink-0">
              <Icon className="text-amber-600 dark:text-amber-400 w-4 h-4"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></Icon>
            </div>
            <div className="flex-1">
              <h5 className="text-[12px] font-bold text-amber-900 dark:text-amber-200">AI Öngörü · İskonto Etkisi</h5>
              <p className="text-[10px] text-amber-700 dark:text-amber-300 mt-1 leading-relaxed">%10+ iskonto verilen tekliflerin kabul oranı <strong>%50</strong>, %5 altı iskonto verilenler <strong>%58</strong>. Büyük iskonto müşteri kararını hızlandırmıyor ama karlılığı düşürüyor.</p>
              <button onClick={() => onSwitchTab('profitability')} className="mt-2 text-[10px] font-bold text-amber-700 dark:text-amber-300 hover:underline">Detaylı analiz →</button>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 dark:from-emerald-500/10 dark:to-teal-500/5 border border-emerald-200 dark:border-emerald-500/30 rounded-xl p-4">
          <div className="flex items-start gap-2.5">
            <div className="w-9 h-9 bg-emerald-100 dark:bg-emerald-500/20 rounded-lg flex items-center justify-center shrink-0">
              <Icon className="text-emerald-600 dark:text-emerald-400 w-4 h-4"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></Icon>
            </div>
            <div className="flex-1">
              <h5 className="text-[12px] font-bold text-emerald-900 dark:text-emerald-200">AI Öngörü · Kanal Optimizasyonu</h5>
              <p className="text-[10px] text-emerald-700 dark:text-emerald-300 mt-1 leading-relaxed">Referans kanalı <strong>%53.8</strong> kazanma oranı ile en yüksek. Müşteri tavsiye programına bütçe artırımı +<strong>18%</strong> ek ciro getirebilir.</p>
              <button onClick={() => onSwitchTab('funnel')} className="mt-2 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 hover:underline">Kanal raporu →</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function TopSources({ topSources, onSwitchTab }: { topSources: SourceReport[]; onSwitchTab: (tab: ReportTab) => void }) {
  const maxRevenue = Math.max(...topSources.map((item) => item.revenue));
  return (
    <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-gray-100 dark:border-gray-700/40 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Icon className="text-violet-600 dark:text-violet-400 w-4 h-4"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></Icon>
          <h4 className="text-[13px] font-bold text-gray-900 dark:text-gray-100">En İyi Ciro Kaynakları</h4>
        </div>
        <button onClick={() => onSwitchTab('funnel')} className="text-[10px] font-bold text-violet-600 dark:text-violet-400 hover:underline">Tümü →</button>
      </div>
      <div className="p-4 space-y-2.5">
        {topSources.map((source, index) => (
          <div key={source.src}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 ${cm(source.clr).bg} rounded-lg flex items-center justify-center text-[11px] font-bold ${cm(source.clr).t}`}>{index + 1}</div>
                <div>
                  <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100">{source.src}</p>
                  <p className="text-[9px] text-gray-500 dark:text-gray-400">{source.proposals} teklif · {source.accepted} kabul · %{source.rate.toFixed(1)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[13px] font-bold text-gray-900 dark:text-gray-100">₺{Math.round(source.revenue / 1000)}K</p>
                <p className="text-[9px] text-gray-500 dark:text-gray-400">ort. ₺{Math.round(source.avgDeal / 1000)}K</p>
              </div>
            </div>
            <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden"><div className={`h-full rounded-full bg-gradient-to-r from-${source.clr}-400 to-${source.clr}-600`} style={{ width: `${Math.round((source.revenue / maxRevenue) * 100)}%` }} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TopServices({ topServices, onSwitchTab }: { topServices: ServiceReport[]; onSwitchTab: (tab: ReportTab) => void }) {
  const maxRevenue = Math.max(...topServices.map((item) => item.revenue));
  return (
    <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-gray-100 dark:border-gray-700/40 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Icon className="text-violet-600 dark:text-violet-400 w-4 h-4"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></Icon>
          <h4 className="text-[13px] font-bold text-gray-900 dark:text-gray-100">En Çok Satan Hizmetler</h4>
        </div>
        <button onClick={() => onSwitchTab('services')} className="text-[10px] font-bold text-violet-600 dark:text-violet-400 hover:underline">Tümü →</button>
      </div>
      <div className="p-4 space-y-2.5">
        {topServices.map((service, index) => (
          <div key={service.svc}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 ${cm(service.clr).bg} rounded-lg flex items-center justify-center text-[11px] font-bold ${cm(service.clr).t}`}>{index + 1}</div>
                <div>
                  <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100">{service.svc}</p>
                  <p className="text-[9px] text-gray-500 dark:text-gray-400">{service.sold} sattı · %{service.margin.toFixed(1)} karlılık</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[13px] font-bold text-gray-900 dark:text-gray-100">₺{Math.round(service.revenue / 1000)}K</p>
                <p className="text-[9px] text-gray-500 dark:text-gray-400">ort. ₺{Math.round(service.avgDeal / 1000)}K</p>
              </div>
            </div>
            <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden"><div className={`h-full rounded-full bg-gradient-to-r from-${service.clr}-400 to-${service.clr}-600`} style={{ width: `${Math.round((service.revenue / maxRevenue) * 100)}%` }} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LeadershipSummary({ onSwitchTab }: { onSwitchTab: (tab: ReportTab) => void }) {
  return (
    <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-gray-100 dark:border-gray-700/40 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <Icon className="text-amber-600 dark:text-amber-400 w-4 h-4"><circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></Icon>
          <h4 className="text-[13px] font-bold text-gray-900 dark:text-gray-100">Satış Ekibi Liderlik Tablosu</h4>
        </div>
        <button onClick={() => onSwitchTab('team')} className="text-[10px] font-bold text-violet-600 dark:text-violet-400 hover:underline">Detaylı →</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-gray-700/40">
        {RPT_SALES_STAFF_DATA.map((staff, index) => {
          const rankClr = index === 0 ? 'amber' : index === 1 ? 'gray' : index === 2 ? 'amber' : 'gray';
          return (
            <div key={staff.id} className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="relative">
                  <div className={`w-10 h-10 bg-gradient-to-br from-${staff.clr}-400 to-${staff.clr}-600 rounded-xl flex items-center justify-center text-white text-[11px] font-bold shadow-sm`}>{staff.avatar}</div>
                  {index < 3 ? <div className={`absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-${rankClr}-400 to-${rankClr}-600 rounded-full flex items-center justify-center text-white text-[9px] font-bold shadow`}>{index + 1}</div> : null}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100 truncate">{staff.name}</p>
                  <p className="text-[9px] text-gray-500 dark:text-gray-400 truncate">{staff.title}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div><p className="text-[9px] text-gray-500 dark:text-gray-400">Teklif</p><p className="text-[14px] font-bold text-gray-900 dark:text-gray-100">{staff.proposals}</p></div>
                <div><p className="text-[9px] text-gray-500 dark:text-gray-400">Kabul</p><p className="text-[14px] font-bold text-emerald-700 dark:text-emerald-300">{staff.accepted}</p></div>
                <div><p className="text-[9px] text-gray-500 dark:text-gray-400">Ciro</p><p className="text-[11px] font-bold text-gray-900 dark:text-gray-100">₺{Math.round(staff.revenue / 1000)}K</p></div>
                <div><p className="text-[9px] text-gray-500 dark:text-gray-400">Karlılık</p><p className="text-[11px] font-bold text-violet-700 dark:text-violet-300">%{staff.marginAvg.toFixed(1)}</p></div>
              </div>
              <div className="pt-2 border-t border-gray-100 dark:border-gray-700/40">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-gray-500 dark:text-gray-400">Kazanma</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-300">%{staff.rate.toFixed(1)}</span>
                </div>
                <div className="h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mt-1">
                  <div className={`h-full rounded-full bg-gradient-to-r from-${staff.clr}-400 to-${staff.clr}-600`} style={{ width: `${staff.rate}%` }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RptProposals({ reportPeriod }: { reportPeriod: string }) {
  const totalProp = RPT_SALES_SOURCE_DATA.reduce((sum, item) => sum + item.proposals, 0);
  const totalAcc = RPT_SALES_SOURCE_DATA.reduce((sum, item) => sum + item.accepted, 0);
  const rejected = totalProp - totalAcc - 24;
  const pending = 24;
  const avgDisc = RPT_SALES_SOURCE_DATA.reduce((sum, item) => sum + item.avgDisc * item.proposals, 0) / totalProp;
  const statusDist = [
    { l: 'Kabul Edildi', v: totalAcc, clr: 'emerald' as ColorName, rate: ((totalAcc / totalProp) * 100).toFixed(1) },
    { l: 'Bekliyor', v: pending, clr: 'sky' as ColorName, rate: ((pending / totalProp) * 100).toFixed(1) },
    { l: 'Reddedildi', v: Math.round(rejected * 0.6), clr: 'rose' as ColorName, rate: (((rejected * 0.6) / totalProp) * 100).toFixed(1) },
    { l: 'Süresi Geçti', v: Math.round(rejected * 0.4), clr: 'amber' as ColorName, rate: (((rejected * 0.4) / totalProp) * 100).toFixed(1) },
  ];

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <ProposalKpi color="violet" label="Toplam Teklif" value={totalProp} sub={`${reportPeriod} periyodunda`} icon={<><path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4 20-7z" /></>} />
        <ProposalKpi color="emerald" label="Kazanma Oranı" value={`%${((totalAcc / totalProp) * 100).toFixed(1)}`} sub={`${totalAcc} kabul · ${totalProp - totalAcc} diğer`} icon={<polyline points="20 6 9 17 4 12" />} valueClass="text-emerald-700 dark:text-emerald-300" />
        <ProposalKpi color="amber" label="Ort. Kapama Süresi" value={<>{'4.2 '}<span className="text-[14px] font-semibold text-gray-500">gün</span></>} sub="Gönderimden kabule" icon={<><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>} />
        <ProposalKpi color="rose" label="Ort. İskonto" value={`%${avgDisc.toFixed(1)}`} sub="Hizmet bazlı ortalama" icon={<><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></>} valueClass="text-rose-700 dark:text-rose-300" />
      </div>

      <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700/40">
          <h4 className="text-[13px] font-bold text-gray-900 dark:text-gray-100">Teklif Durum Dağılımı</h4>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{reportPeriod} · {totalProp} teklif üzerinden</p>
        </div>
        <div className="p-4">
          <div className="h-8 flex rounded-lg overflow-hidden shadow-inner">
            {statusDist.map((item) => (
              <div key={item.l} className={`bg-gradient-to-r from-${item.clr}-400 to-${item.clr}-600 flex items-center justify-center`} style={{ width: `${item.rate}%` }} title={`${item.l}: ${item.v}`}>
                <span className="text-[10px] font-bold text-white drop-shadow">%{item.rate}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
            {statusDist.map((item) => (
              <div key={item.l} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded bg-gradient-to-br from-${item.clr}-400 to-${item.clr}-600`} />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold text-gray-900 dark:text-gray-100">{item.l}</p>
                  <p className="text-[9px] text-gray-500 dark:text-gray-400">{item.v} teklif · %{item.rate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700/40 flex items-center justify-between gap-2 flex-wrap">
          <div>
            <h4 className="text-[13px] font-bold text-gray-900 dark:text-gray-100">Kaynak Bazlı Teklif Performansı</h4>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Hangi kanaldan gelen fırsatlar daha iyi kapanıyor?</p>
          </div>
          <button className="text-[10px] font-bold text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1">
            <Icon className="w-3 h-3"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /></Icon>
            Excel
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead className="bg-gray-50 dark:bg-[#17181f]">
              <tr>
                {['Kaynak', 'Teklif', 'Kabul', 'Kazanma', 'Ort. Deal', 'Ort. İskonto', 'Ciro', 'Trend 7g'].map((heading, index) => <th key={heading} className={`${index === 0 ? 'text-left' : 'text-right'} px-4 py-2.5 font-semibold text-gray-600 dark:text-gray-400`}>{heading}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/40">
              {[...RPT_SALES_SOURCE_DATA].sort((a, b) => b.revenue - a.revenue).map((source) => (
                <tr key={source.src} className="hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer">
                  <td className="px-4 py-2.5"><div className="flex items-center gap-2"><span className={`w-6 h-6 ${cm(source.clr).bg} rounded flex items-center justify-center text-[10px] font-bold ${cm(source.clr).t}`}>{source.icon}</span><span className="font-semibold text-gray-900 dark:text-gray-100">{source.src}</span></div></td>
                  <td className="px-4 py-2.5 text-right font-semibold text-gray-700 dark:text-gray-300">{source.proposals}</td>
                  <td className="px-4 py-2.5 text-right font-semibold text-emerald-700 dark:text-emerald-300">{source.accepted}</td>
                  <td className="px-4 py-2.5 text-right"><span className={`font-bold ${source.rate > 45 ? 'text-emerald-700 dark:text-emerald-300' : source.rate > 35 ? 'text-amber-700 dark:text-amber-300' : 'text-gray-700 dark:text-gray-300'}`}>%{source.rate.toFixed(1)}</span></td>
                  <td className="px-4 py-2.5 text-right text-gray-700 dark:text-gray-300">₺{Math.round(source.avgDeal / 1000)}K</td>
                  <td className="px-4 py-2.5 text-right"><span className={source.avgDisc > 10 ? 'text-rose-700 dark:text-rose-300 font-bold' : 'text-gray-700 dark:text-gray-300'}>%{source.avgDisc.toFixed(1)}</span></td>
                  <td className="px-4 py-2.5 text-right font-bold text-gray-900 dark:text-gray-100">₺{Math.round(source.revenue / 1000)}K</td>
                  <td className="px-4 py-2.5 text-right"><Sparkline data={source.trend} color={source.clr} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function ProposalKpi({ color, label, value, sub, icon, valueClass = 'text-gray-900 dark:text-gray-100' }: { color: ColorName; label: string; value: ReactNode; sub: string; icon: ReactNode; valueClass?: string }) {
  return (
    <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-3.5">
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-8 h-8 bg-${color}-100 dark:bg-${color}-500/20 rounded-lg flex items-center justify-center`}><Icon className={`text-${color}-600 dark:text-${color}-400 w-4 h-4`}>{icon}</Icon></div>
        <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400">{label}</span>
      </div>
      <p className={`text-[22px] font-bold ${valueClass} leading-none`}>{value}</p>
      <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">{sub}</p>
    </div>
  );
}

function RptFunnel({ reportPeriod }: { reportPeriod: string }) {
  const totalLeads = RPT_SALES_FUNNEL[0].count;
  const totalActive = RPT_SALES_FUNNEL[RPT_SALES_FUNNEL.length - 1].count;
  const overallRate = ((totalActive / totalLeads) * 100).toFixed(1);

  return (
    <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-gray-100 dark:border-gray-700/40 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <Icon className="text-violet-600 dark:text-violet-400 w-4 h-4"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></Icon>
          <div>
            <h4 className="text-[13px] font-bold text-gray-900 dark:text-gray-100">Satış Hunisi · Uçtan Uca Akış</h4>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">{reportPeriod} · Talepten aktif müşteriye dönüşüm yolculuğu</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[9px] text-gray-500 dark:text-gray-400">Uçtan Uca Dönüşüm</p>
            <p className="text-[20px] font-bold text-emerald-700 dark:text-emerald-300 leading-none">%{overallRate}</p>
          </div>
        </div>
      </div>
      <div className="p-5 space-y-2">
        {RPT_SALES_FUNNEL.map((stage, index) => {
          const widthPct = (stage.count / totalLeads) * 100;
          const dropRate = index > 0 ? RPT_SALES_FUNNEL[index - 1].count - stage.count : 0;
          const conversionRate = index > 0 ? ((stage.count / RPT_SALES_FUNNEL[index - 1].count) * 100).toFixed(1) : '100.0';
          return (
            <div key={stage.stage} className="relative">
              <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-lg ${cm(stage.clr).bg} border border-${stage.clr}-200 dark:border-${stage.clr}-500/30 flex items-center justify-center text-[10px] font-bold ${cm(stage.clr).t}`}>{index + 1}</div>
                  <div>
                    <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100">{stage.stage}</p>
                    <p className="text-[9px] text-gray-500 dark:text-gray-400">{stage.desc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-right">
                  {index > 0 ? <div><p className="text-[9px] text-gray-500 dark:text-gray-400">Dönüşüm</p><p className={`text-[11px] font-bold ${parseFloat(conversionRate) > 85 ? 'text-emerald-700 dark:text-emerald-300' : parseFloat(conversionRate) > 60 ? 'text-amber-700 dark:text-amber-300' : 'text-rose-700 dark:text-rose-300'}`}>%{conversionRate}</p></div> : null}
                  <div><p className="text-[9px] text-gray-500 dark:text-gray-400">Adet</p><p className="text-[14px] font-bold text-gray-900 dark:text-gray-100">{stage.count}</p></div>
                  <div><p className="text-[9px] text-gray-500 dark:text-gray-400">Süre</p><p className="text-[11px] font-semibold text-gray-700 dark:text-gray-300">{stage.avgH > 24 ? `${Math.round(stage.avgH / 24)}g` : `${stage.avgH}s`}</p></div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                  <div className={`h-full bg-gradient-to-r from-${stage.clr}-400 to-${stage.clr}-600 rounded-lg flex items-center justify-end pr-3 transition-all`} style={{ width: `${widthPct}%` }}><span className="text-[10px] font-bold text-white drop-shadow">%{((stage.count / totalLeads) * 100).toFixed(1)}</span></div>
                </div>
                {dropRate > 0 ? <span className="text-[9px] font-bold text-rose-600 dark:text-rose-400 whitespace-nowrap">-{dropRate}</span> : null}
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 border-t border-gray-100 dark:border-gray-700/40 bg-rose-50/30 dark:bg-rose-500/5">
        <h5 className="text-[12px] font-bold text-rose-900 dark:text-rose-200 mb-2 flex items-center gap-1.5">
          <Icon className="text-rose-600 dark:text-rose-400 w-3.5 h-3.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /></Icon>
          Kritik Drop-off Noktaları
        </h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="p-2.5 bg-white dark:bg-[#17181f] border border-rose-200 dark:border-rose-500/30 rounded-lg">
            <p className="text-[11px] font-bold text-gray-900 dark:text-gray-100">Teklif Onayı Aşaması</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">Müşteri açtı (98) → Onayladı (58) · <span className="font-bold text-rose-600 dark:text-rose-400">%40.8 düşüş</span></p>
            <p className="text-[10px] text-rose-700 dark:text-rose-300 mt-1 leading-relaxed">En büyük kayıp burada. Fiyat itirazı veya rakip teklif sebepli. Takip hatırlatma otomasyonu aktifleştirilmeli.</p>
          </div>
          <div className="p-2.5 bg-white dark:bg-[#17181f] border border-rose-200 dark:border-rose-500/30 rounded-lg">
            <p className="text-[11px] font-bold text-gray-900 dark:text-gray-100">Talep → Satış Devir</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">Talep (178) → Satışa devredildi (142) · <span className="font-bold text-rose-600 dark:text-rose-400">%20.2 düşüş</span></p>
            <p className="text-[10px] text-rose-700 dark:text-rose-300 mt-1 leading-relaxed">Kalifiye olmayan lead'ler burada eleniyor. Talep Havuzu filtreleri gözden geçirilebilir.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function RptTeam() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
      {RPT_SALES_STAFF_DATA.map((staff, index) => {
        const rankIcon = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
        const monthMax = Math.max(...staff.byMonth);
        return (
          <div key={staff.id} className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden hover:shadow-lg transition-all">
            <div className={`p-4 border-b border-gray-100 dark:border-gray-700/40 bg-gradient-to-br from-${staff.clr}-50 to-transparent dark:from-${staff.clr}-500/10`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="relative shrink-0">
                    <div className={`w-12 h-12 bg-gradient-to-br from-${staff.clr}-400 to-${staff.clr}-600 rounded-xl flex items-center justify-center text-white font-bold text-[14px] shadow-md`}>{staff.avatar}</div>
                    {rankIcon ? <span className="absolute -top-1 -right-1 text-[16px]">{rankIcon}</span> : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-bold text-gray-900 dark:text-gray-100 truncate">{staff.name}</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">{staff.title}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="flex items-center gap-0.5 text-[9px] text-amber-700 dark:text-amber-300 font-bold">
                        {'★'.repeat(Math.floor(staff.satisfaction))}{staff.satisfaction % 1 >= 0.5 ? '☆' : ''}
                        <span className="ml-0.5">{staff.satisfaction}</span>
                      </span>
                      <span className="text-[9px] text-gray-400">·</span>
                      <span className="text-[9px] text-gray-500 dark:text-gray-400">{staff.avgResponseH}s yanıt</span>
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[18px] font-bold text-gray-900 dark:text-gray-100 leading-none">₺{Math.round(staff.revenue / 1000)}K</p>
                  <p className="text-[9px] text-gray-500 dark:text-gray-400 mt-0.5">Toplam ciro</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 divide-x divide-gray-100 dark:divide-gray-700/40 bg-gray-50/50 dark:bg-[#17181f]">
              <MetricCell label="Teklif" value={staff.proposals} />
              <MetricCell label="Kabul" value={staff.accepted} valueClass="text-emerald-700 dark:text-emerald-300" />
              <MetricCell label="Sözleşme" value={staff.contracts} valueClass="text-sky-700 dark:text-sky-300" />
              <MetricCell label="MRR" value={`₺${Math.round(staff.mrr / 1000)}K`} valueClass="text-violet-700 dark:text-violet-300 text-[13px]" />
            </div>

            <div className="p-4 space-y-2.5">
              <ProgressMetric label="Kazanma Oranı" value={`%${staff.rate.toFixed(1)}`} barClass="bg-gradient-to-r from-emerald-400 to-emerald-600" textClass="text-emerald-700 dark:text-emerald-300" width={staff.rate} />
              <ProgressMetric label="Ortalama Karlılık" value={`%${staff.marginAvg.toFixed(1)}`} barClass={`bg-gradient-to-r from-${staff.marginAvg > 40 ? 'emerald' : staff.marginAvg > 30 ? 'amber' : 'rose'}-400 to-${staff.marginAvg > 40 ? 'emerald' : staff.marginAvg > 30 ? 'amber' : 'rose'}-600`} textClass={staff.marginAvg > 40 ? 'text-emerald-700 dark:text-emerald-300' : staff.marginAvg > 30 ? 'text-amber-700 dark:text-amber-300' : 'text-rose-700 dark:text-rose-300'} width={Math.min(100, staff.marginAvg * 2)} />
              <ProgressMetric label="Verdiği Ortalama İskonto" value={`%${staff.avgDisc.toFixed(1)}`} barClass={`bg-gradient-to-r from-${staff.avgDisc < 7 ? 'emerald' : staff.avgDisc < 10 ? 'amber' : 'rose'}-400 to-${staff.avgDisc < 7 ? 'emerald' : staff.avgDisc < 10 ? 'amber' : 'rose'}-600`} textClass={staff.avgDisc < 7 ? 'text-emerald-700 dark:text-emerald-300' : staff.avgDisc < 10 ? 'text-amber-700 dark:text-amber-300' : 'text-rose-700 dark:text-rose-300'} width={Math.min(100, staff.avgDisc * 8)} />
            </div>

            <div className="p-3 bg-gradient-to-br from-amber-50 to-yellow-50/50 dark:from-amber-500/10 dark:to-yellow-500/5 border-t border-amber-200/50 dark:border-amber-500/20 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-amber-100 dark:bg-amber-500/20 rounded-lg flex items-center justify-center"><Icon className="text-amber-600 dark:text-amber-400 w-3.5 h-3.5"><circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></Icon></div>
                <div>
                  <p className="text-[10px] font-semibold text-amber-900 dark:text-amber-200">Tahakkuk Eden Prim</p>
                  <p className="text-[9px] text-amber-700/80 dark:text-amber-400/80">₺{staff.primPaid.toLocaleString('tr-TR')} ödendi</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[15px] font-bold text-amber-700 dark:text-amber-300">₺{staff.prim.toLocaleString('tr-TR')}</p>
              </div>
            </div>

            <div className="p-3 border-t border-gray-100 dark:border-gray-700/40">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-semibold text-gray-600 dark:text-gray-400">Son 7 Ay Teklif Trendi</span>
                <span className="text-[9px] text-gray-400 dark:text-gray-500">Eki → Nis</span>
              </div>
              <div className="flex items-end gap-1 h-10">
                {staff.byMonth.map((value, monthIndex) => (
                  <div key={`${staff.id}-${monthIndex}`} className={`flex-1 bg-${staff.clr}-100 dark:bg-${staff.clr}-500/20 rounded-t relative group`} style={{ height: `${(value / monthMax) * 100}%` }}>
                    <div className={`absolute inset-0 bg-gradient-to-t from-${staff.clr}-500 to-${staff.clr}-400 opacity-0 group-hover:opacity-100 transition-opacity rounded-t`} />
                    <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] font-bold text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MetricCell({ label, value, valueClass = 'text-gray-900 dark:text-gray-100' }: { label: string; value: ReactNode; valueClass?: string }) {
  return <div className="p-3 text-center"><p className="text-[9px] text-gray-500 dark:text-gray-400">{label}</p><p className={`text-[15px] font-bold ${valueClass}`}>{value}</p></div>;
}

function ProgressMetric({ label, value, textClass, barClass, width }: { label: string; value: string; textClass: string; barClass: string; width: number }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-semibold text-gray-600 dark:text-gray-400">{label}</span>
        <span className={`text-[11px] font-bold ${textClass}`}>{value}</span>
      </div>
      <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden"><div className={`h-full ${barClass} rounded-full`} style={{ width: `${width}%` }} /></div>
    </div>
  );
}

function RptProfitability({ reportPeriod }: { reportPeriod: string }) {
  const totalRev = RPT_SERVICE_SALES_DATA.reduce((sum, item) => sum + item.revenue, 0);
  const avgMargin = RPT_SERVICE_SALES_DATA.reduce((sum, item) => sum + item.margin * item.revenue, 0) / totalRev;
  const healthyCount = RPT_SERVICE_SALES_DATA.filter((item) => item.margin >= 35).length;
  const riskyCount = RPT_SERVICE_SALES_DATA.filter((item) => item.margin < 25).length;
  const minMargin = Math.min(...Object.values(SERVICE_COSTS).map((item) => item.minMargin));
  const maxMargin = Math.max(...Object.values(SERVICE_COSTS).map((item) => item.minMargin));

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 dark:from-emerald-500/10 dark:to-teal-500/5 border border-emerald-200 dark:border-emerald-500/30 rounded-xl p-3.5">
          <KpiHeader color="emerald" label="Ort. Karlılık" icon={<polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />} labelClass="text-emerald-900 dark:text-emerald-200" />
          <p className="text-[22px] font-bold text-emerald-700 dark:text-emerald-300 leading-none">%{avgMargin.toFixed(1)}</p>
          <p className="text-[10px] text-emerald-700/80 dark:text-emerald-400/80 mt-1">Ağırlıklı ortalama</p>
        </div>
        <ProfitKpi color="emerald" label="Sağlıklı Hizmet" value={<>{healthyCount}<span className="text-[14px] font-semibold text-gray-500">/{RPT_SERVICE_SALES_DATA.length}</span></>} sub="%35+ marj" icon={<polyline points="20 6 9 17 4 12" />} />
        <ProfitKpi color="rose" label="Risk Hizmet" value={riskyCount} sub="%25 altı marj" icon={<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />} valueClass="text-rose-700 dark:text-rose-300" />
        <ProfitKpi color="amber" label="Brüt Kar" value={`₺${Math.round((totalRev * avgMargin) / 100 / 1000)}K`} sub={reportPeriod} icon={<><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></>} valueClass="text-gray-900 dark:text-gray-100 text-[18px]" />
      </div>

      <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700/40">
          <h4 className="text-[13px] font-bold text-gray-900 dark:text-gray-100">Hizmet Bazlı Karlılık Dağılımı</h4>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Minimum kar marjı çizgisi (min: %{minMargin} · max: %{maxMargin})</p>
        </div>
        <div className="p-4 space-y-2">
          {[...RPT_SERVICE_SALES_DATA].sort((a, b) => b.margin - a.margin).map((service) => {
            const cfg = SERVICE_COSTS[service.sid] || { minMargin: 20 };
            const isHealthy = service.margin >= cfg.minMargin + 10;
            const isWarning = service.margin >= cfg.minMargin && service.margin < cfg.minMargin + 10;
            const barClr = service.margin < cfg.minMargin ? 'rose' : isWarning ? 'amber' : isHealthy ? 'emerald' : 'emerald';
            return (
              <div key={service.sid} className="p-3 bg-gray-50 dark:bg-[#17181f] border border-gray-200 dark:border-gray-600/50 rounded-lg">
                <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div className={`w-7 h-7 ${cm(service.clr).bg} rounded-lg flex items-center justify-center shrink-0`}><Icon className={`${cm(service.clr).t} w-3.5 h-3.5`}><rect x="3" y="3" width="18" height="18" rx="2" /></Icon></div>
                    <div className="min-w-0">
                      <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100 truncate">{service.svc}</p>
                      <p className="text-[9px] text-gray-500 dark:text-gray-400">{service.sold} satış · ort. ₺{Math.round(service.avgDeal / 1000)}K · ort. iskonto %{service.discAvg}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-[16px] font-bold text-${barClr}-700 dark:text-${barClr}-300`}>%{service.margin.toFixed(1)}</p>
                    <p className="text-[9px] text-gray-500 dark:text-gray-400">min %{cfg.minMargin}</p>
                  </div>
                  <div className="text-right shrink-0 border-l border-gray-200 dark:border-gray-700/40 pl-3">
                    <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100">₺{Math.round(service.revenue / 1000)}K</p>
                    <p className="text-[9px] text-gray-500 dark:text-gray-400">ciro</p>
                  </div>
                </div>
                <div className="relative h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className={`absolute left-0 top-0 bottom-0 bg-gradient-to-r from-${barClr}-400 to-${barClr}-600 rounded-full`} style={{ width: `${Math.min(100, service.margin)}%` }} />
                  <div className="absolute top-0 bottom-0 w-0.5 bg-gray-900 dark:bg-white opacity-50" style={{ left: `${cfg.minMargin}%` }} title={`Min %${cfg.minMargin}`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700/40">
          <h4 className="text-[13px] font-bold text-gray-900 dark:text-gray-100">İskonto Oranı ↔ Kabul Oranı Analizi</h4>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Yüksek iskonto kabul oranını artırıyor mu?</p>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-5 gap-2">
            {RPT_DISCOUNT_BUCKETS.map((bucket) => (
              <div key={bucket.range} className={`relative p-3 ${cm(bucket.clr).bg} border border-${bucket.clr}-200 dark:border-${bucket.clr}-500/30 rounded-lg text-center`}>
                <p className="text-[9px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">İskonto</p>
                <p className={`text-[15px] font-bold ${cm(bucket.clr).t} mb-2`}>{bucket.range}</p>
                <div className="space-y-1">
                  <div><p className="text-[9px] text-gray-500 dark:text-gray-400">Teklif</p><p className="text-[13px] font-bold text-gray-900 dark:text-gray-100">{bucket.proposals}</p></div>
                  <div><p className="text-[9px] text-gray-500 dark:text-gray-400">Kabul</p><p className={`text-[13px] font-bold ${cm(bucket.clr).t}`}>%{bucket.rate.toFixed(1)}</p></div>
                  <div className={`pt-1 border-t border-${bucket.clr}-200/50 dark:border-${bucket.clr}-500/20`}><p className="text-[9px] text-gray-500 dark:text-gray-400">Ort. Marj</p><p className={`text-[11px] font-bold ${cm(bucket.clr).t}`}>%{bucket.avgMargin.toFixed(1)}</p></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-lg flex items-start gap-2.5">
            <Icon className="text-amber-600 dark:text-amber-400 w-4 h-4 shrink-0 mt-0.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /></Icon>
            <div className="flex-1">
              <p className="text-[11px] font-bold text-amber-900 dark:text-amber-200">AI Öngörüsü</p>
              <p className="text-[10px] text-amber-700 dark:text-amber-300 mt-0.5 leading-relaxed">%10'un üzerindeki iskontolarda kabul oranı belirgin artış göstermiyor ama karlılık düşüyor. <strong>%5-10 aralığı</strong> en sağlıklı tradeoff. Satış temsilcilerinin %10 üstü iskonto vermesi için onay mekanizması kurulmalı.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function KpiHeader({ color, label, icon, labelClass = 'text-gray-500 dark:text-gray-400' }: { color: ColorName; label: string; icon: ReactNode; labelClass?: string }) {
  return <div className="flex items-center gap-2 mb-2"><div className={`w-8 h-8 bg-${color}-100 dark:bg-${color}-500/20 rounded-lg flex items-center justify-center`}><Icon className={`text-${color}-600 dark:text-${color}-400 w-4 h-4`}>{icon}</Icon></div><span className={`text-[10px] font-semibold ${labelClass}`}>{label}</span></div>;
}

function ProfitKpi({ color, label, value, sub, icon, valueClass = 'text-gray-900 dark:text-gray-100' }: { color: ColorName; label: string; value: ReactNode; sub: string; icon: ReactNode; valueClass?: string }) {
  return <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-3.5"><KpiHeader color={color} label={label} icon={icon} /><p className={`text-[22px] font-bold ${valueClass} leading-none`}>{value}</p><p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">{sub}</p></div>;
}

function RptServices({ reportPeriod }: { reportPeriod: string }) {
  const totalRev = RPT_SERVICE_SALES_DATA.reduce((sum, item) => sum + item.revenue, 0);
  return (
    <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-gray-100 dark:border-gray-700/40">
        <h4 className="text-[13px] font-bold text-gray-900 dark:text-gray-100">Hizmet Mix Analizi</h4>
        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{reportPeriod} · Hizmet başına teklif sayısı, kabul, ciro ve karlılık</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[11px]">
          <thead className="bg-gray-50 dark:bg-[#17181f]">
            <tr>
              {['Hizmet', 'Teklif', 'Satış', 'Kazanma', 'Ort. Deal', 'Karlılık', 'Ort. İskonto', 'Ciro Payı'].map((heading, index) => <th key={heading} className={`${index === 0 ? 'text-left' : 'text-right'} px-4 py-2.5 font-semibold text-gray-600 dark:text-gray-400`}>{heading}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700/40">
            {[...RPT_SERVICE_SALES_DATA].sort((a, b) => b.revenue - a.revenue).map((service) => {
              const rate = (service.sold / service.proposals) * 100;
              const sharePercent = (service.revenue / totalRev) * 100;
              return (
                <tr key={service.sid} className="hover:bg-gray-50 dark:hover:bg-white/5">
                  <td className="px-4 py-2.5"><div className="flex items-center gap-2"><div className={`w-6 h-6 ${cm(service.clr).bg} rounded flex items-center justify-center shrink-0`}><Icon className={`${cm(service.clr).t} w-3 h-3`}><rect x="3" y="3" width="18" height="18" rx="2" /></Icon></div><div><p className="font-bold text-gray-900 dark:text-gray-100">{service.svc}</p></div></div></td>
                  <td className="px-4 py-2.5 text-right font-semibold text-gray-700 dark:text-gray-300">{service.proposals}</td>
                  <td className="px-4 py-2.5 text-right font-semibold text-emerald-700 dark:text-emerald-300">{service.sold}</td>
                  <td className="px-4 py-2.5 text-right"><span className={`font-bold ${rate > 50 ? 'text-emerald-700 dark:text-emerald-300' : rate > 35 ? 'text-amber-700 dark:text-amber-300' : 'text-gray-700 dark:text-gray-300'}`}>%{rate.toFixed(1)}</span></td>
                  <td className="px-4 py-2.5 text-right text-gray-700 dark:text-gray-300">₺{Math.round(service.avgDeal / 1000)}K</td>
                  <td className="px-4 py-2.5 text-right"><span className={`font-bold ${service.margin >= 35 ? 'text-emerald-700 dark:text-emerald-300' : service.margin >= 25 ? 'text-amber-700 dark:text-amber-300' : 'text-rose-700 dark:text-rose-300'}`}>%{service.margin.toFixed(1)}</span></td>
                  <td className="px-4 py-2.5 text-right"><span className={service.discAvg > 10 ? 'text-rose-700 dark:text-rose-300 font-bold' : 'text-gray-700 dark:text-gray-300'}>%{service.discAvg.toFixed(1)}</span></td>
                  <td className="px-4 py-2.5 text-right">
                    <div className="flex items-center gap-1 justify-end">
                      <div className="w-12 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden"><div className={`h-full bg-gradient-to-r from-${service.clr}-400 to-${service.clr}-600`} style={{ width: `${sharePercent}%` }} /></div>
                      <span className="font-bold text-gray-900 dark:text-gray-100 text-[10px]">%{sharePercent.toFixed(1)}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
            <tr className="bg-gray-50 dark:bg-[#17181f] border-t-2 border-gray-300 dark:border-gray-600">
              <td className="px-4 py-2.5 font-bold text-gray-900 dark:text-gray-100">TOPLAM</td>
              <td className="px-4 py-2.5 text-right font-bold text-gray-900 dark:text-gray-100">{RPT_SERVICE_SALES_DATA.reduce((sum, item) => sum + item.proposals, 0)}</td>
              <td className="px-4 py-2.5 text-right font-bold text-emerald-700 dark:text-emerald-300">{RPT_SERVICE_SALES_DATA.reduce((sum, item) => sum + item.sold, 0)}</td>
              <td className="px-4 py-2.5 text-right">-</td>
              <td className="px-4 py-2.5 text-right">-</td>
              <td className="px-4 py-2.5 text-right">-</td>
              <td className="px-4 py-2.5 text-right">-</td>
              <td className="px-4 py-2.5 text-right font-bold text-gray-900 dark:text-gray-100">₺{Math.round(totalRev / 1000)}K</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
