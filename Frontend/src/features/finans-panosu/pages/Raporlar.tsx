import { type ReactNode, useState } from 'react';

type ColorName = 'emerald' | 'rose' | 'sky' | 'amber' | 'teal' | 'violet' | 'indigo' | 'gray' | 'pink';
type ReportCategory = 'talep' | 'bonus';
type ReportId =
  | 'dashboard'
  | 'tahsilat'
  | 'gider'
  | 'alinan-isler'
  | 'devreden-borc'
  | 'devreden-alacak'
  | 'kar-ciro'
  | 'ugur-raporu'
  | 'erhan-raporu'
  | 'nakit-akis'
  | 'musteri-sagligi'
  | 'bosch-raporu'
  | 'vergi-ozet'
  | 'hizmet-marj'
  | 'ortak-denge';

type Report = {
  id: Exclude<ReportId, 'dashboard'>;
  name: string;
  desc: string;
  clr: ColorName;
  cat: ReportCategory;
  usage?: string;
  badge?: string;
  icon: ReactNode;
};

type DateRange = {
  dateRange: string;
  startDate: string;
  endDate: string;
};

type ToastState = { title: string; text: string; color: ColorName } | null;

const CM: Record<ColorName, { bg: string; t: string; border: string; bar: string; solid: string; hover: string }> = {
  emerald: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', t: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-500/30', bar: 'bg-gradient-to-r from-emerald-400 to-emerald-600', solid: 'bg-emerald-600', hover: 'hover:bg-emerald-700' },
  rose: { bg: 'bg-rose-100 dark:bg-rose-900/30', t: 'text-rose-700 dark:text-rose-300', border: 'border-rose-200 dark:border-rose-500/30', bar: 'bg-gradient-to-r from-rose-400 to-rose-600', solid: 'bg-rose-600', hover: 'hover:bg-rose-700' },
  sky: { bg: 'bg-sky-100 dark:bg-sky-900/30', t: 'text-sky-700 dark:text-sky-300', border: 'border-sky-200 dark:border-sky-500/30', bar: 'bg-gradient-to-r from-sky-400 to-sky-600', solid: 'bg-sky-600', hover: 'hover:bg-sky-700' },
  amber: { bg: 'bg-amber-100 dark:bg-amber-900/30', t: 'text-amber-700 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-500/30', bar: 'bg-gradient-to-r from-amber-400 to-amber-600', solid: 'bg-amber-600', hover: 'hover:bg-amber-700' },
  teal: { bg: 'bg-teal-100 dark:bg-teal-900/30', t: 'text-teal-700 dark:text-teal-300', border: 'border-teal-200 dark:border-teal-500/30', bar: 'bg-gradient-to-r from-teal-400 to-teal-600', solid: 'bg-teal-600', hover: 'hover:bg-teal-700' },
  violet: { bg: 'bg-violet-100 dark:bg-violet-900/30', t: 'text-violet-700 dark:text-violet-300', border: 'border-violet-200 dark:border-violet-500/30', bar: 'bg-gradient-to-r from-violet-400 to-violet-600', solid: 'bg-violet-600', hover: 'hover:bg-violet-700' },
  indigo: { bg: 'bg-indigo-100 dark:bg-indigo-900/30', t: 'text-indigo-700 dark:text-indigo-300', border: 'border-indigo-200 dark:border-indigo-500/30', bar: 'bg-gradient-to-r from-indigo-400 to-indigo-600', solid: 'bg-indigo-600', hover: 'hover:bg-indigo-700' },
  gray: { bg: 'bg-gray-100 dark:bg-gray-800', t: 'text-gray-700 dark:text-gray-300', border: 'border-gray-200 dark:border-gray-600/50', bar: 'bg-gradient-to-r from-gray-400 to-gray-600', solid: 'bg-gray-600', hover: 'hover:bg-gray-700' },
  pink: { bg: 'bg-pink-100 dark:bg-pink-900/30', t: 'text-pink-700 dark:text-pink-300', border: 'border-pink-200 dark:border-pink-500/30', bar: 'bg-gradient-to-r from-pink-400 to-pink-600', solid: 'bg-pink-600', hover: 'hover:bg-pink-700' },
};

const REPORTS: Report[] = [
  { id: 'tahsilat', name: 'Tahsilat Raporu', desc: 'Müşteri bazlı tahsilat performansı · vadeli/vadesi geçmiş analizi', clr: 'emerald', cat: 'talep', usage: 'Çok kullanılan', icon: <><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></> },
  { id: 'gider', name: 'Aylık Gider Raporu', desc: 'Kategori gider + bütçe hedef tutturma + olağandışı analizi', clr: 'rose', cat: 'talep', usage: 'Çok kullanılan', icon: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /> },
  { id: 'alinan-isler', name: 'Alınan İşler / Anlaşmalar', desc: 'Yeni sözleşmeler · pipeline dönüşüm oranı · müşteri başı ortalama', clr: 'sky', cat: 'talep', icon: <><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></> },
  { id: 'devreden-borc', name: 'Devreden Borçlar', desc: 'Toplam borç durumu · tedarikçi bazlı · vade sıralama', clr: 'amber', cat: 'talep', icon: <><line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="16" /></> },
  { id: 'devreden-alacak', name: 'Devreden Alacaklar', desc: 'Toplam alacak durumu · müşteri bazlı · yaşlandırma analizi', clr: 'teal', cat: 'talep', icon: <><line x1="6" y1="20" x2="6" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="18" y1="20" x2="18" y2="14" /></> },
  { id: 'kar-ciro', name: 'Kar - Ciro Raporu', desc: 'Brüt ciro · net kar · marj analizi · şirket karşılaştırma', clr: 'violet', cat: 'talep', icon: <><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></> },
  { id: 'ugur-raporu', name: 'Uğur Erten Raporu', desc: 'Satış %10/%20 + Prodüksiyon %50 · kar ortaklığı kazanç detayı', clr: 'amber', cat: 'talep', icon: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /> },
  { id: 'erhan-raporu', name: 'Erhan Çalışkan Raporu', desc: 'SM ciro %50 + Prodüksiyon KDV’siz %40 · kar ortaklığı kazanç detayı', clr: 'sky', cat: 'talep', icon: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /> },
  { id: 'nakit-akis', name: 'Nakit Akış Raporu', desc: 'Haftalık/aylık nakit akış projeksiyonu · likidite seviyesi · kritik günler', clr: 'indigo', cat: 'bonus', badge: 'AI', icon: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /> },
  { id: 'musteri-sagligi', name: 'Müşteri Sağlığı Raporu', desc: 'Ödeme alışkanlığı · risk skoru · tek müşteri yoğunlaşması · churn riski', clr: 'rose', cat: 'bonus', badge: 'AI', icon: <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></> },
  { id: 'bosch-raporu', name: 'Bosch Özel Raporu', desc: 'VIP müşteri detay · 7 kategori bazlı tablo · medya harcama analizi', clr: 'rose', cat: 'bonus', badge: 'VIP', icon: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /> },
  { id: 'vergi-ozet', name: 'Vergi Özet Raporu', desc: 'KDV · MUHSGK · Kurumlar · beyan dönemi vergi yükü analizi', clr: 'amber', cat: 'bonus', icon: <><line x1="19" y1="5" x2="5" y2="19" /><circle cx="6.5" cy="6.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" /></> },
  { id: 'hizmet-marj', name: 'Hizmet Marj Analizi', desc: 'Hizmet kategorisi bazında kârlılık · personel başı marj', clr: 'violet', cat: 'bonus', icon: <><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></> },
  { id: 'ortak-denge', name: 'Ortak Denge Raporu', desc: 'TEFE-TÜFE borçlanma matrisi · hisseli ortaklar bilanço', clr: 'violet', cat: 'bonus', icon: <><path d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></> },
];

const RANGE_OPTIONS = [
  { k: 'thisMonth', lbl: 'Bu Ay', s: '2026-04-01', e: '2026-04-30' },
  { k: 'lastMonth', lbl: 'Geçen Ay', s: '2026-03-01', e: '2026-03-31' },
  { k: 'last30', lbl: 'Son 30 Gün', s: '2026-03-25', e: '2026-04-24' },
  { k: 'thisQuarter', lbl: 'Bu Çeyrek', s: '2026-04-01', e: '2026-06-30' },
  { k: 'lastQuarter', lbl: 'Geçen Çeyrek', s: '2026-01-01', e: '2026-03-31' },
  { k: 'ytd', lbl: 'Yıl Başından', s: '2026-01-01', e: '2026-04-24' },
  { k: 'lastYear', lbl: 'Geçen Yıl', s: '2025-01-01', e: '2025-12-31' },
  { k: 'custom', lbl: 'Özel Aralık', s: '2026-04-01', e: '2026-04-30' },
];

function Svg({ children, className = 'w-3.5 h-3.5' }: { children: ReactNode; className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">{children}</svg>;
}

function money(value: number) {
  return `₺${value.toLocaleString('tr-TR')}`;
}

export default function Raporlar() {
  const [reportId, setReportId] = useState<ReportId>('dashboard');
  const [filters, setFilters] = useState<DateRange>({ dateRange: 'thisMonth', startDate: '2026-04-01', endDate: '2026-04-30' });
  const [toast, setToast] = useState<ToastState>(null);
  const report = reportId === 'dashboard' ? null : REPORTS.find((item) => item.id === reportId) ?? null;

  const showToast = (title: string, text: string, color: ColorName = 'indigo') => {
    setToast({ title, text, color });
    window.setTimeout(() => setToast(null), 2200);
  };

  const setDateRange = (range: string) => {
    const option = RANGE_OPTIONS.find((item) => item.k === range);
    if (option) setFilters({ dateRange: option.k, startDate: option.s, endDate: option.e });
  };

  return (
    <div className="space-y-3 relative min-h-[calc(100vh-140px)]">
      {report ? (
        <>
          <ReportHeader report={report} onBack={() => setReportId('dashboard')} onToast={showToast} />
          <DateRangeFilter filters={filters} setFilters={setFilters} setDateRange={setDateRange} onToast={showToast} />
          <ReportContent report={report} />
        </>
      ) : (
        <ReportDashboard setReportId={setReportId} onToast={showToast} />
      )}
      {toast && <Toast toast={toast} />}
    </div>
  );
}

function ReportDashboard({ setReportId, onToast }: { setReportId: (id: ReportId) => void; onToast: (title: string, text: string, color?: ColorName) => void }) {
  const talepEdilen = REPORTS.filter((report) => report.cat === 'talep');
  const bonus = REPORTS.filter((report) => report.cat === 'bonus');

  return (
    <>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg flex items-center justify-center">
            <Svg className="text-indigo-600 dark:text-indigo-400 w-4 h-4"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></Svg>
          </div>
          <div>
            <h1 className="text-[19px] font-bold text-gray-900 dark:text-gray-100 leading-tight">Finans Raporları</h1>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">{REPORTS.length} hazır rapor · istenilen tarih aralığında · PDF/Excel/mail export</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button type="button" onClick={() => onToast('Özel Rapor', 'AI destekli özel rapor oluşturucu açılıyor', 'violet')} className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/30 text-violet-700 dark:text-violet-300 text-[11px] font-semibold rounded-md hover:bg-violet-100">
            <Svg><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" /></Svg>
            AI Özel Rapor
          </button>
          <button type="button" onClick={() => onToast('Zamanlanmış', 'Otomatik rapor planlama', 'emerald')} className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-[11px] font-semibold rounded-md hover:bg-gray-50">
            <Svg><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></Svg>
            Zamanlanmış
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-3">
        {[
          { label: 'Tahsilat (Nisan)', value: '₺2.14M', sub: '+%12 geçen aya göre', clr: 'emerald' as ColorName },
          { label: 'Aylık Gider', value: '₺1.48M', sub: '%92 bütçe tutturma', clr: 'rose' as ColorName },
          { label: 'Devreden Borç', value: '₺384K', sub: '14 tedarikçi', clr: 'amber' as ColorName },
          { label: 'Devreden Alacak', value: '₺612K', sub: '8 müşteri', clr: 'teal' as ColorName },
          { label: 'Aylık Net Kar', value: '₺720K', sub: 'Marj %33.6', clr: 'violet' as ColorName },
          { label: 'YTD Ciro', value: '₺6.8M', sub: 'Hedefin %57’si', clr: 'indigo' as ColorName },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-3.5">
            <p className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">{kpi.label}</p>
            <p className={`text-[20px] font-bold ${CM[kpi.clr].t} font-mono leading-none mb-0.5`}>{kpi.value}</p>
            <p className="text-[9px] text-gray-400 dark:text-gray-500">{kpi.sub}</p>
          </div>
        ))}
      </div>

      <ReportSection title="Temel Finans Raporları" badge={`${talepEdilen.length} RAPOR`} color="indigo" icon={<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></>}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {talepEdilen.map((report) => <ReportCard key={report.id} report={report} onClick={() => setReportId(report.id)} />)}
        </div>
      </ReportSection>

      <ReportSection title="Akıllı Raporlar · Mathilda Önerileri" badge={`+${bonus.length} EK RAPOR`} color="violet" icon={<><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /></>}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {bonus.map((report) => <BonusReportCard key={report.id} report={report} onClick={() => setReportId(report.id)} />)}
        </div>
      </ReportSection>

      <RecentReports onToast={onToast} />
    </>
  );
}

function ReportSection({ title, badge, color, icon, children }: { title: string; badge: string; color: ColorName; icon: ReactNode; children: ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Svg className={`${CM[color].t} w-4 h-4`}>{icon}</Svg>
        <h3 className="text-[14px] font-bold text-gray-900 dark:text-gray-100">{title}</h3>
        <span className={`text-[9px] font-bold px-1.5 py-0.5 ${CM[color].bg} ${CM[color].t} rounded`}>{badge}</span>
      </div>
      {children}
    </div>
  );
}

function ReportCard({ report, onClick }: { report: Report; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={`text-left bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden hover:${CM[report.clr].border} transition-colors cursor-pointer`}>
      <div className={`p-3 ${CM[report.clr].bg} border-b ${CM[report.clr].border}`}>
        <div className="flex items-center justify-between gap-2">
          <div className="w-9 h-9 bg-white dark:bg-[#1e1f26] rounded-lg flex items-center justify-center shrink-0">
            <Svg className={`${CM[report.clr].t} w-4 h-4`}>{report.icon}</Svg>
          </div>
          {report.usage && <span className={`text-[8px] font-bold px-1.5 py-0.5 bg-white dark:bg-[#1e1f26] ${CM[report.clr].t} rounded`}>{report.usage}</span>}
        </div>
      </div>
      <div className="p-3">
        <p className="text-[13px] font-bold text-gray-900 dark:text-gray-100 leading-tight mb-1">{report.name}</p>
        <p className="text-[10px] text-gray-500 dark:text-gray-400 line-clamp-2 min-h-[28px]">{report.desc}</p>
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-gray-700/40">
          <span className="text-[9px] text-gray-500">Son güncelleme: 2 saat</span>
          <span className={`${CM[report.clr].t} text-[10px] font-bold flex items-center gap-1`}>
            Aç <Svg className="w-3 h-3"><polyline points="9 18 15 12 9 6" /></Svg>
          </span>
        </div>
      </div>
    </button>
  );
}

function BonusReportCard({ report, onClick }: { report: Report; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={`text-left bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden hover:${CM[report.clr].border} transition-colors cursor-pointer`}>
      <div className="p-3 flex items-start gap-2.5">
        <div className={`w-9 h-9 ${CM[report.clr].bg} rounded-lg flex items-center justify-center shrink-0`}>
          <Svg className={`${CM[report.clr].t} w-4 h-4`}>{report.icon}</Svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
            <p className="text-[13px] font-bold text-gray-900 dark:text-gray-100 truncate">{report.name}</p>
            {report.badge && <span className="text-[8px] font-bold px-1.5 py-0.5 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded">{report.badge}</span>}
          </div>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 line-clamp-2">{report.desc}</p>
        </div>
        <span className="text-gray-400 shrink-0"><Svg><polyline points="9 18 15 12 9 6" /></Svg></span>
      </div>
    </button>
  );
}

function RecentReports({ onToast }: { onToast: (title: string, text: string, color?: ColorName) => void }) {
  const rows = [
    { rep: 'Tahsilat Raporu', date: '24.04.2026 10:15', range: '01-23 Nisan 2026', user: 'Tülay H.', format: 'PDF' },
    { rep: 'Kar - Ciro Raporu', date: '22.04.2026 16:40', range: 'Q1 2026', user: 'Osman B.', format: 'Excel' },
    { rep: 'Uğur Erten Raporu', date: '22.04.2026 14:20', range: 'Mart 2026', user: 'Tülay H.', format: 'PDF' },
    { rep: 'Devreden Alacaklar', date: '20.04.2026 11:30', range: '31.03.2026 itibarıyla', user: 'Tülay H.', format: 'PDF' },
    { rep: 'Aylık Gider Raporu', date: '15.04.2026 09:45', range: 'Mart 2026', user: 'Tülay H.', format: 'Excel' },
  ];

  return (
    <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
      <div className="p-3 border-b border-gray-100 dark:border-gray-700/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Svg className="text-gray-600 dark:text-gray-400 w-4 h-4"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></Svg>
          <h3 className="text-[13px] font-bold text-gray-900 dark:text-gray-100">Son Çalıştırılan Raporlar</h3>
        </div>
        <span className="text-[10px] text-gray-500">Tülay Hanım tarafından</span>
      </div>
      <div className="divide-y divide-gray-100 dark:divide-gray-700/30">
        {rows.map((row) => (
          <div key={`${row.rep}-${row.date}`} className="p-2.5 flex items-center justify-between gap-3 hover:bg-gray-50 dark:hover:bg-white/5">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center shrink-0">
                <Svg className="text-gray-500 w-3.5 h-3.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></Svg>
              </div>
              <div className="min-w-0">
                <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100 truncate">{row.rep}</p>
                <p className="text-[9px] text-gray-500 dark:text-gray-400">{row.range} · {row.user}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[9px] font-bold px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded font-mono">{row.format}</span>
              <span className="text-[9px] text-gray-500 font-mono">{row.date}</span>
              <button type="button" onClick={() => onToast('Yeniden Çalıştır', 'Rapor yeniden oluşturuluyor', 'sky')} className="text-[9px] font-semibold text-sky-700 dark:text-sky-300 hover:underline">↻ Tekrarla</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReportHeader({ report, onBack, onToast }: { report: Report; onBack: () => void; onToast: (title: string, text: string, color?: ColorName) => void }) {
  return (
    <div className="flex items-center justify-between gap-3 flex-wrap">
      <div className="flex items-center gap-3">
        <button type="button" onClick={onBack} className="flex items-center gap-1 px-2.5 py-1.5 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-[11px] font-semibold rounded-md hover:bg-gray-50">
          <Svg><polyline points="15 18 9 12 15 6" /></Svg>
          Rapor Merkezi
        </button>
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 ${CM[report.clr].bg} rounded-lg flex items-center justify-center`}>
            <Svg className={`${CM[report.clr].t} w-4 h-4`}>{report.icon}</Svg>
          </div>
          <div>
            <h1 className="text-[19px] font-bold text-gray-900 dark:text-gray-100 leading-tight">{report.name}</h1>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">{report.desc}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <button type="button" onClick={() => onToast('PDF', 'Rapor PDF olarak indiriliyor', 'rose')} className="flex items-center gap-1 px-2.5 py-1.5 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-[11px] font-semibold rounded-md hover:bg-gray-50">
          <Svg><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></Svg>
          PDF
        </button>
        <button type="button" onClick={() => onToast('CSV', 'Veriler CSV olarak indiriliyor', 'emerald')} className="flex items-center gap-1 px-2.5 py-1.5 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-[11px] font-semibold rounded-md hover:bg-gray-50">
          <Svg><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="9" y1="3" x2="9" y2="21" /><line x1="15" y1="3" x2="15" y2="21" /></Svg>
          Excel
        </button>
        <button type="button" onClick={() => onToast('Mail', 'Rapor mail olarak gönderiliyor', 'sky')} className="flex items-center gap-1 px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold rounded-md">
          <Svg><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></Svg>
          Mail Gönder
        </button>
      </div>
    </div>
  );
}

function DateRangeFilter({ filters, setFilters, setDateRange, onToast }: { filters: DateRange; setFilters: (filters: DateRange) => void; setDateRange: (range: string) => void; onToast: (title: string, text: string, color?: ColorName) => void }) {
  return (
    <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-3">
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 shrink-0 mr-1">
          <Svg className="text-indigo-600 dark:text-indigo-400 w-4 h-4"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></Svg>
          <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300">Tarih Aralığı:</span>
        </div>
        {RANGE_OPTIONS.map((range) => {
          const active = filters.dateRange === range.k;
          return (
            <button key={range.k} type="button" onClick={() => setDateRange(range.k)} className={`px-2.5 py-1.5 text-[10px] font-semibold rounded-md transition-all ${active ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
              {range.lbl}
            </button>
          );
        })}
        <div className="flex items-center gap-1.5 ml-auto">
          <input type="date" value={filters.startDate} onChange={(event) => setFilters({ ...filters, startDate: event.target.value, dateRange: 'custom' })} className="px-2 py-1 text-[10px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded text-gray-900 dark:text-gray-100 font-mono focus:outline-none focus:border-indigo-500" />
          <span className="text-gray-400">→</span>
          <input type="date" value={filters.endDate} onChange={(event) => setFilters({ ...filters, endDate: event.target.value, dateRange: 'custom' })} className="px-2 py-1 text-[10px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded text-gray-900 dark:text-gray-100 font-mono focus:outline-none focus:border-indigo-500" />
          <button type="button" onClick={() => onToast('Filtre', 'Özel tarih aralığı uygulandı', 'indigo')} className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold rounded">Uygula</button>
        </div>
      </div>
    </div>
  );
}

function ReportContent({ report }: { report: Report }) {
  if (report.id === 'tahsilat') return <TahsilatReport />;
  if (report.id === 'gider') return <GiderReport />;
  if (report.id === 'alinan-isler') return <AlinanIslerReport />;
  if (report.id === 'devreden-borc') return <DebtReport kind="borc" />;
  if (report.id === 'devreden-alacak') return <DebtReport kind="alacak" />;
  if (report.id === 'kar-ciro') return <KarCiroReport />;
  if (report.id === 'ugur-raporu' || report.id === 'erhan-raporu') return <PartnerReport report={report} />;
  return <BonusDetail report={report} />;
}

function KpiGrid({ items }: { items: Array<{ l: string; v: string; s: string; c: ColorName }> }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
      {items.map((item) => (
        <div key={item.l} className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-3.5">
          <p className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">{item.l}</p>
          <p className={`text-[22px] font-bold ${CM[item.c].t} font-mono leading-none mb-0.5`}>{item.v}</p>
          <p className="text-[9px] text-gray-400 dark:text-gray-500">{item.s}</p>
        </div>
      ))}
    </div>
  );
}

function TahsilatReport() {
  const rows = [
    { m: 'Bosch Türkiye★', f: 7, t: 729000, b: 78000, v: '45 gün', s: 95, sc: 'emerald' as ColorName },
    { m: 'BigBrand Reklam', f: 4, t: 280000, b: 125000, v: '68 gün', s: 72, sc: 'amber' as ColorName },
    { m: 'MegaMarka Perakende', f: 3, t: 180000, b: 0, v: '30 gün', s: 98, sc: 'emerald' as ColorName },
    { m: 'TechNova Yazılım', f: 5, t: 165000, b: 45000, v: '55 gün', s: 85, sc: 'sky' as ColorName },
    { m: 'Platin Otomotiv', f: 6, t: 295000, b: 82000, v: '72 gün', s: 68, sc: 'amber' as ColorName },
    { m: 'FastGrow Digital', f: 4, t: 112000, b: 30000, v: '40 gün', s: 88, sc: 'sky' as ColorName },
    { m: 'Aydın Holding', f: 3, t: 285000, b: 0, v: '25 gün', s: 99, sc: 'emerald' as ColorName },
  ];

  return (
    <>
      <KpiGrid items={[{ l: 'Toplam Tahsilat', v: '₺2.14M', s: '32 fatura', c: 'emerald' }, { l: 'Vadesinde Ödenen', v: '₺1.78M', s: '%83 zamanında', c: 'sky' }, { l: 'Geciken Tahsilat', v: '₺360K', s: '6 fatura · 7+ gün', c: 'rose' }, { l: 'Ort. Tahsilat Süresi', v: '18 gün', s: '60 gün vadeli fatura', c: 'amber' }]} />
      <DataTable title="Müşteri Bazlı Tahsilat Performansı" footerLeft="7 müşteri · Bosch VIP ★" footerRight="Toplam: ₺2.046.000">
        <thead className="bg-gray-50 dark:bg-[#17181f]"><tr className="border-b border-gray-200 dark:border-gray-700/30"><Th>Müşteri</Th><Th right hidden="md">Fatura</Th><Th right>Tahsil Edilen</Th><Th right hidden="md">Bekleyen</Th><Th right hidden="lg">Ort. Vade</Th><Th center>Skor</Th></tr></thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700/30">
          {rows.map((row) => <tr key={row.m} className="hover:bg-gray-50 dark:hover:bg-white/5"><Td bold>{row.m}</Td><Td right hidden="md">{row.f}</Td><Td right className="font-mono font-bold text-emerald-700 dark:text-emerald-300">₺{(row.t / 1000).toFixed(0)}K</Td><Td right hidden="md" className={`font-mono ${row.b > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-gray-400'}`}>₺{(row.b / 1000).toFixed(0)}K</Td><Td right hidden="lg">{row.v}</Td><Td center><span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 ${CM[row.sc].bg} ${CM[row.sc].t} rounded font-mono`}>{row.s}/100</span></Td></tr>)}
        </tbody>
      </DataTable>
      <TrendChart title="Günlük Tahsilat Trendi" values={[85, 120, 95, 140, 175, 88, 65, 155, 210, 180, 125, 95, 168, 245, 190, 135, 145, 210, 165, 88, 195, 280, 145, 118]} />
    </>
  );
}

function GiderReport() {
  const rows = [
    { kat: 'Personel Maaşları', btc: 480000, gercek: 462000, diff: -18000, olagandisi: false, note: '' },
    { kat: 'Ofis Kirası', btc: 85000, gercek: 85000, diff: 0, olagandisi: false, note: '' },
    { kat: 'Domain & Hosting', btc: 65000, gercek: 68500, diff: 3500, olagandisi: false, note: '' },
    { kat: 'Yazılım & Lisanslar', btc: 42000, gercek: 58000, diff: 16000, olagandisi: true, note: 'HubSpot yıllık ödemesi' },
    { kat: 'Pazarlama', btc: 120000, gercek: 95000, diff: -25000, olagandisi: false, note: '' },
    { kat: 'Freelance Ödemeleri', btc: 180000, gercek: 210000, diff: 30000, olagandisi: false, note: '' },
    { kat: 'Vergi & SSK', btc: 285000, gercek: 288400, diff: 3400, olagandisi: false, note: '' },
    { kat: 'Olağandışı · Hukuk', btc: 0, gercek: 45000, diff: 45000, olagandisi: true, note: 'Dava masrafı' },
  ];
  const toplamBtc = rows.reduce((sum, row) => sum + row.btc, 0);
  const toplamGer = rows.reduce((sum, row) => sum + row.gercek, 0);
  const olaganDisiTop = rows.filter((row) => row.olagandisi).reduce((sum, row) => sum + row.gercek, 0);
  const hedefTutturma = Math.round((toplamBtc / toplamGer) * 100);

  return (
    <>
      <KpiGrid items={[{ l: 'Toplam Bütçe', v: `₺${(toplamBtc / 1000).toFixed(0)}K`, s: 'Plan', c: 'indigo' }, { l: 'Gerçekleşen', v: `₺${(toplamGer / 1000).toFixed(0)}K`, s: 'Fiili', c: 'rose' }, { l: 'Hedef Tutturma', v: `%${hedefTutturma}`, s: 'İyi', c: 'amber' }, { l: 'Olağandışı Gider', v: `₺${(olaganDisiTop / 1000).toFixed(0)}K`, s: `%${Math.round((olaganDisiTop / toplamGer) * 100)} toplam`, c: 'amber' }]} />
      <DataTable title="Kategori Bazlı Bütçe Karşılaştırma">
        <thead className="bg-gray-50 dark:bg-[#17181f]"><tr className="border-b border-gray-200 dark:border-gray-700/30"><Th>Kategori</Th><Th right hidden="md">Bütçe</Th><Th right>Gerçekleşen</Th><Th right hidden="md">Fark</Th><Th center>Durum</Th></tr></thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700/30">
          {rows.map((row) => {
            const color: ColorName = row.diff <= 0 ? 'emerald' : row.diff <= row.btc * 0.1 ? 'amber' : 'rose';
            return <tr key={row.kat} className={`hover:bg-gray-50 dark:hover:bg-white/5 ${row.olagandisi ? 'bg-amber-50/40 dark:bg-amber-500/5' : ''}`}><Td bold>{row.kat}{row.olagandisi && <span className="ml-1 text-[8px] font-bold px-1 py-0.5 bg-amber-200 dark:bg-amber-500/30 text-amber-800 dark:text-amber-200 rounded">OLAĞANDIŞI</span>}{row.note && <p className="text-[9px] text-gray-500 dark:text-gray-400 italic mt-0.5">{row.note}</p>}</Td><Td right hidden="md">₺{(row.btc / 1000).toFixed(0)}K</Td><Td right className="font-mono font-bold text-gray-900 dark:text-gray-100">₺{(row.gercek / 1000).toFixed(0)}K</Td><Td right hidden="md" className={`font-mono font-bold ${row.diff > 0 ? 'text-rose-600 dark:text-rose-400' : row.diff < 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'}`}>{row.diff > 0 ? '+' : ''}₺{(row.diff / 1000).toFixed(1)}K</Td><Td center><span className={`inline-flex text-[9px] font-bold px-1.5 py-0.5 ${CM[color].bg} ${CM[color].t} rounded`}>{row.diff <= 0 ? 'İYİ' : row.diff <= row.btc * 0.1 ? 'UYARI' : 'AŞIM'}</span></Td></tr>;
          })}
        </tbody>
      </DataTable>
    </>
  );
}

function AlinanIslerReport() {
  const rows = [
    { d: '02.04.2026', m: 'TechNova Yazılım', h: 'SEO + G. Ads', t: 'aylik', a: 85000, s: 'Mehmet K.' },
    { d: '05.04.2026', m: 'BigBrand Reklam', h: 'Marka Stratejisi', t: 'tek', a: 180000, s: 'Ayşe D.' },
    { d: '08.04.2026', m: 'MegaMarka Perakende', h: 'E-ticaret Site', t: 'tek', a: 320000, s: 'Mehmet K.' },
    { d: '10.04.2026', m: 'Platin Otomotiv', h: 'CRM Entegrasyon', t: 'tek', a: 180000, s: 'Ayşe D.' },
    { d: '18.04.2026', m: 'BCS Digital (Bosch)', h: 'Prodüksiyon', t: 'proje', a: 125000, s: 'Ayşe D.' },
  ];

  return (
    <>
      <KpiGrid items={[{ l: 'Yeni Anlaşmalar', v: '12', s: 'Bu dönem', c: 'emerald' }, { l: 'Anlaşma Değeri', v: '₺1.84M', s: 'Toplam sözleşme', c: 'sky' }, { l: 'Pipeline Dönüşüm', v: '%32', s: 'Fırsat → anlaşma', c: 'violet' }, { l: 'Ortalama Deal', v: '₺153K', s: 'Anlaşma başı', c: 'amber' }]} />
      <DataTable title="Dönem İçinde Alınan Yeni Anlaşmalar" footerLeft="12 kayıt">
        <thead className="bg-gray-50 dark:bg-[#17181f]"><tr className="border-b border-gray-200 dark:border-gray-700/30"><Th>Tarih</Th><Th>Müşteri</Th><Th hidden="md">Hizmet</Th><Th hidden="lg">Tür</Th><Th right>Tutar</Th><Th hidden="md">Temsilci</Th></tr></thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700/30">{rows.map((row) => <tr key={`${row.d}-${row.m}`} className="hover:bg-gray-50 dark:hover:bg-white/5"><Td className="font-mono text-[10px]">{row.d}</Td><Td bold>{row.m}</Td><Td hidden="md">{row.h}</Td><Td hidden="lg"><span className="text-[9px] font-bold px-1.5 py-0.5 bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 rounded uppercase">{row.t}</span></Td><Td right className="font-mono font-bold text-emerald-700 dark:text-emerald-300">₺{(row.a / 1000).toFixed(0)}K</Td><Td hidden="md">{row.s}</Td></tr>)}</tbody>
      </DataTable>
    </>
  );
}

function DebtReport({ kind }: { kind: 'borc' | 'alacak' }) {
  const isDebt = kind === 'borc';
  const rows = isDebt
    ? [{ name: 'Paraşüt', total: 84000, age: '0-30 gün', color: 'emerald' as ColorName }, { name: 'Hosting Tedarikçileri', total: 69000, age: '30-60 gün', color: 'amber' as ColorName }, { name: 'Hukuk Danışmanlığı', total: 45000, age: '60+ gün', color: 'rose' as ColorName }, { name: 'Freelance Hakediş', total: 186000, age: '0-30 gün', color: 'emerald' as ColorName }]
    : [{ name: 'Bosch Türkiye★', total: 78000, age: '0-30 gün', color: 'emerald' as ColorName }, { name: 'BigBrand Reklam', total: 125000, age: '30-60 gün', color: 'amber' as ColorName }, { name: 'Platin Otomotiv', total: 82000, age: '60+ gün', color: 'rose' as ColorName }, { name: 'TechNova Yazılım', total: 45000, age: '0-30 gün', color: 'emerald' as ColorName }];

  return (
    <>
      <KpiGrid items={[{ l: isDebt ? 'Toplam Borç' : 'Toplam Alacak', v: isDebt ? '₺384K' : '₺612K', s: isDebt ? '14 tedarikçi' : '8 müşteri', c: 'rose' }, { l: '0-30 Gün', v: isDebt ? '₺195K' : '₺330K', s: '%51 · düzenli', c: 'emerald' }, { l: '30-60 Gün', v: isDebt ? '₺120K' : '₺185K', s: '%31 · takip', c: 'amber' }, { l: '60+ Gün', v: isDebt ? '₺69K' : '₺97K', s: '%18 · acil', c: 'rose' }]} />
      <DataTable title={isDebt ? 'Devreden Borç Yaşlandırma' : 'Devreden Alacak Yaşlandırma'}>
        <thead className="bg-gray-50 dark:bg-[#17181f]"><tr><Th>{isDebt ? 'Tedarikçi' : 'Müşteri'}</Th><Th right>Tutar</Th><Th center>Vade</Th><Th center>Durum</Th></tr></thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700/30">{rows.map((row) => <tr key={row.name} className="hover:bg-gray-50 dark:hover:bg-white/5"><Td bold>{row.name}</Td><Td right className="font-mono font-bold">{money(row.total)}</Td><Td center>{row.age}</Td><Td center><span className={`text-[9px] font-bold px-1.5 py-0.5 ${CM[row.color].bg} ${CM[row.color].t} rounded`}>{row.color === 'rose' ? 'ACİL' : row.color === 'amber' ? 'TAKİP' : 'DÜZENLİ'}</span></Td></tr>)}</tbody>
      </DataTable>
    </>
  );
}

function KarCiroReport() {
  return (
    <>
      <KpiGrid items={[{ l: 'Brüt Ciro', v: '₺2.92M', s: 'Nisan toplam', c: 'indigo' }, { l: 'Net Kar', v: '₺720K', s: 'Vergi sonrası', c: 'emerald' }, { l: 'Kar Marjı', v: '%24.6', s: '+2.1 puan', c: 'violet' }, { l: 'Şirket Payı', v: '%62', s: 'Digital ağırlıklı', c: 'sky' }]} />
      <TrendChart title="Ciro / Kar Trendi" values={[120, 180, 150, 240, 280, 210, 310, 260, 350, 410, 380, 460]} />
    </>
  );
}

function PartnerReport({ report }: { report: Report }) {
  const isUgur = report.id === 'ugur-raporu';
  return (
    <>
      <KpiGrid items={[{ l: 'Satış Payı', v: isUgur ? '₺84K' : '₺0', s: isUgur ? '%10/%20 kuralı' : 'SM bazlı', c: 'amber' }, { l: 'Prodüksiyon Payı', v: isUgur ? '₺146K' : '₺118K', s: isUgur ? '%50 net' : '%40 KDV’siz', c: 'sky' }, { l: 'Toplam Hakediş', v: isUgur ? '₺230K' : '₺192K', s: 'Bu dönem', c: 'emerald' }, { l: 'Ödenen', v: isUgur ? '₺180K' : '₺185K', s: 'YTD', c: 'violet' }]} />
      <DataTable title={`${report.name} · Kazanç Detayı`}>
        <thead className="bg-gray-50 dark:bg-[#17181f]"><tr><Th>Kalem</Th><Th right>Matrah</Th><Th center>Oran</Th><Th right>Hakediş</Th></tr></thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700/30">
          {['Satış Komisyonu', 'Prodüksiyon Geliri', 'Düzeltme / Stopaj'].map((label, index) => <tr key={label}><Td bold>{label}</Td><Td right className="font-mono">₺{[420000, 292000, 18000][index].toLocaleString('tr-TR')}</Td><Td center>{['%20', '%50', '-'][index]}</Td><Td right className="font-mono font-bold text-emerald-700 dark:text-emerald-300">₺{[84000, 146000, -18000][index].toLocaleString('tr-TR')}</Td></tr>)}
        </tbody>
      </DataTable>
    </>
  );
}

function BonusDetail({ report }: { report: Report }) {
  return (
    <>
      <KpiGrid items={[{ l: 'Analiz Skoru', v: '92/100', s: 'Mathilda önerisi', c: report.clr }, { l: 'Risk Seviyesi', v: 'Düşük', s: 'Kontrol altında', c: 'emerald' }, { l: 'İyileştirme', v: '₺84K', s: 'Potansiyel etki', c: 'violet' }, { l: 'Güncellik', v: '2 saat', s: 'Son veri çekimi', c: 'sky' }]} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-4">
          <h3 className="text-[13px] font-bold text-gray-900 dark:text-gray-100 mb-3">{report.name} · Grafik Alanı</h3>
          <div className="flex items-end justify-between gap-1 h-40">{[34, 62, 48, 88, 72, 96, 64, 78, 91, 70, 84, 100].map((v, index) => <div key={`${v}-${index}`} className={`flex-1 ${CM[report.clr].bar} rounded-sm`} style={{ height: `${v}%` }} />)}</div>
        </div>
        <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-4">
          <h3 className="text-[13px] font-bold text-gray-900 dark:text-gray-100 mb-3">Öneriler</h3>
          <div className="space-y-2">{['Tarih aralığı bazında kırılım incelenmeli', 'Yüksek etkili müşteriler ayrı takip edilmeli', 'Haftalık otomatik rapor planı önerilir'].map((item) => <div key={item} className={`p-3 ${CM[report.clr].bg} border ${CM[report.clr].border} rounded-md text-[11px] ${CM[report.clr].t} font-semibold`}>{item}</div>)}</div>
        </div>
      </div>
    </>
  );
}

function TrendChart({ title, values }: { title: string; values: number[] }) {
  const max = Math.max(...values);
  return (
    <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
      <div className="p-3 border-b border-gray-100 dark:border-gray-700/40 flex items-center justify-between">
        <h3 className="text-[13px] font-bold text-gray-900 dark:text-gray-100">{title}</h3>
        <span className="text-[9px] text-gray-500 font-mono">Nisan 2026</span>
      </div>
      <div className="p-4">
        <div className="flex items-end justify-between gap-0.5 h-32">
          {values.map((value, index) => {
            const color = value > max * 0.72 ? 'emerald' : value > max * 0.54 ? 'sky' : value > max * 0.36 ? 'amber' : 'rose';
            return <div key={`${value}-${index}`} className="flex-1 flex flex-col items-center gap-0.5"><div className={`w-full ${CM[color].bar} rounded-sm`} style={{ height: `${(value / max) * 100}%` }} title={`${index + 1} Nisan · ₺${value}K`} /></div>;
          })}
        </div>
        <div className="flex items-center justify-between text-[9px] text-gray-400 mt-1 font-mono"><span>1 Nis</span><span>8 Nis</span><span>15 Nis</span><span>22 Nis</span></div>
      </div>
    </div>
  );
}

function DataTable({ title, footerLeft, footerRight, children }: { title: string; footerLeft?: string; footerRight?: string; children: ReactNode }) {
  return (
    <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
      <div className="p-3 border-b border-gray-100 dark:border-gray-700/40"><h3 className="text-[13px] font-bold text-gray-900 dark:text-gray-100">{title}</h3></div>
      <div className="overflow-x-auto"><table className="w-full text-[11px]">{children}</table></div>
      {(footerLeft || footerRight) && <div className="p-3 bg-gray-50 dark:bg-[#17181f] border-t border-gray-100 dark:border-gray-700/40 flex items-center justify-between text-[10px]"><span className="text-gray-500 dark:text-gray-400">{footerLeft}</span><span className="font-bold text-emerald-700 dark:text-emerald-300 font-mono">{footerRight}</span></div>}
    </div>
  );
}

function Th({ children, right = false, center = false, hidden }: { children: ReactNode; right?: boolean; center?: boolean; hidden?: 'md' | 'lg' }) {
  const hiddenClass = hidden === 'md' ? 'hidden md:table-cell' : hidden === 'lg' ? 'hidden lg:table-cell' : '';
  return <th className={`${right ? 'text-right' : center ? 'text-center' : 'text-left'} px-3 py-2 font-semibold text-gray-500 dark:text-gray-400 ${hiddenClass}`}>{children}</th>;
}

function Td({ children, right = false, center = false, hidden, bold = false, className = '' }: { children: ReactNode; right?: boolean; center?: boolean; hidden?: 'md' | 'lg'; bold?: boolean; className?: string }) {
  const hiddenClass = hidden === 'md' ? 'hidden md:table-cell' : hidden === 'lg' ? 'hidden lg:table-cell' : '';
  return <td className={`${right ? 'text-right' : center ? 'text-center' : 'text-left'} px-3 py-2.5 text-gray-600 dark:text-gray-400 ${bold ? 'font-semibold text-gray-900 dark:text-gray-100' : ''} ${hiddenClass} ${className}`}>{children}</td>;
}

function Toast({ toast }: { toast: Exclude<ToastState, null> }) {
  return (
    <div className={`absolute right-4 top-4 z-50 bg-white dark:bg-[#1e1f26] border ${CM[toast.color].border} rounded-lg shadow-xl p-3 min-w-[260px]`}>
      <p className={`text-[12px] font-bold ${CM[toast.color].t}`}>{toast.title}</p>
      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{toast.text}</p>
    </div>
  );
}
