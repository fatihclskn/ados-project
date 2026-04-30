import { type ReactNode, useMemo, useState } from 'react';
import Layout from '../components/Layout';

type ColorName = 'emerald' | 'amber' | 'rose' | 'sky' | 'violet' | 'indigo' | 'teal' | 'pink' | 'gray';
type Period = 'Çeyrek' | 'Yıllık' | '2 Yıllık';
type ReportFilter = 'Tümü' | 'Çeyrek' | 'Aylık' | 'Board';
type ToastState = { title: string; message: string; color: ColorName } | null;

type Okr = {
  title: string;
  target: string;
  current: string;
  percent: number;
  status: 'track' | 'risk' | 'late';
  quarter: string;
  clr: ColorName;
};

type Initiative = {
  name: string;
  owner: string;
  progress: number;
  deadline: string;
  status: 'on-track' | 'risk' | 'planning' | 'waiting';
  impact: 'high' | 'medium' | 'low';
  clr: ColorName;
};

type RiskItem = {
  name: string;
  prob: string;
  impact: string;
  score: number;
  mitigation: string;
  clr: ColorName;
};

type StrategicReport = {
  name: string;
  date: string;
  type: 'Çeyrek' | 'Aylık' | 'Board' | 'Operasyonel' | 'Strateji' | 'Risk';
  pages: number;
  icon: string;
  clr: ColorName;
};

const CM: Record<ColorName, { bg: string; t: string }> = {
  emerald: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', t: 'text-emerald-700 dark:text-emerald-300' },
  amber: { bg: 'bg-amber-100 dark:bg-amber-900/30', t: 'text-amber-700 dark:text-amber-300' },
  rose: { bg: 'bg-rose-100 dark:bg-rose-900/30', t: 'text-rose-700 dark:text-rose-300' },
  sky: { bg: 'bg-sky-100 dark:bg-sky-900/30', t: 'text-sky-700 dark:text-sky-300' },
  violet: { bg: 'bg-violet-100 dark:bg-violet-900/30', t: 'text-violet-700 dark:text-violet-300' },
  indigo: { bg: 'bg-indigo-100 dark:bg-indigo-900/30', t: 'text-indigo-700 dark:text-indigo-300' },
  teal: { bg: 'bg-teal-100 dark:bg-teal-900/30', t: 'text-teal-700 dark:text-teal-300' },
  pink: { bg: 'bg-pink-100 dark:bg-pink-900/30', t: 'text-pink-700 dark:text-pink-300' },
  gray: { bg: 'bg-gray-100 dark:bg-gray-800', t: 'text-gray-600 dark:text-gray-400' },
};

const OKRS: Okr[] = [
  { title: '2026 Yıllık Ciro Hedefi', target: '₺12M', current: '₺3.2M', percent: 27, status: 'track', quarter: 'Yıl sonu', clr: 'emerald' },
  { title: 'Aktif Müşteri Sayısı', target: '120', current: '87', percent: 73, status: 'track', quarter: 'Yıl sonu', clr: 'violet' },
  { title: 'Premium 360 Müşteri', target: '15', current: '8', percent: 53, status: 'risk', quarter: 'Q2 sonu', clr: 'amber' },
  { title: 'Ekip Büyüklüğü', target: '60', current: '42', percent: 70, status: 'track', quarter: 'Q3 sonu', clr: 'sky' },
  { title: 'MFA Compliance', target: '%100', current: '%87', percent: 87, status: 'track', quarter: 'Q2 sonu', clr: 'teal' },
  { title: 'Brüt Kar Marjı', target: '%40', current: '%38.4', percent: 96, status: 'track', quarter: 'Yıl sonu', clr: 'indigo' },
];

const INITIATIVES: Initiative[] = [
  { name: 'ADOS v5 Mimar Revizyonu', owner: 'Osman A.', progress: 45, deadline: 'Q3 2026', status: 'on-track', impact: 'high', clr: 'violet' },
  { name: 'Premium 360 v2 Lansmanı', owner: 'Zeynep A.', progress: 72, deadline: 'Q2 2026', status: 'on-track', impact: 'high', clr: 'amber' },
  { name: 'AI Maliyet Optimizasyonu', owner: 'Berke Y.', progress: 58, deadline: 'Q2 2026', status: 'risk', impact: 'medium', clr: 'rose' },
  { name: 'Çift Dil Destek (EN/TR)', owner: 'Ahmet Y.', progress: 20, deadline: 'Q4 2026', status: 'planning', impact: 'medium', clr: 'indigo' },
  { name: 'API Marketplace', owner: 'Sistem Mimarı', progress: 15, deadline: 'Q4 2026', status: 'planning', impact: 'high', clr: 'sky' },
  { name: 'Avrupa Pazarı Girişi', owner: 'Osman A.', progress: 10, deadline: '2027 Q1', status: 'planning', impact: 'high', clr: 'pink' },
];

const RISKS: RiskItem[] = [
  { name: 'Yetenek Kaybı (Satış ekibi)', prob: 'orta', impact: 'yüksek', score: 6.8, mitigation: 'Maaş revizyonu + gelişim programı', clr: 'rose' },
  { name: 'Müşteri Konsantrasyonu', prob: 'orta', impact: 'yüksek', score: 6.5, mitigation: 'Müşteri tabanı genişletme · segment çeşitliliği', clr: 'amber' },
  { name: 'AI Model Maliyet Artışı', prob: 'yüksek', impact: 'orta', score: 5.8, mitigation: 'Çoklu sağlayıcı + prompt önbellekleme', clr: 'amber' },
  { name: 'Rekabet (yerel ajanslar)', prob: 'orta', impact: 'orta', score: 4.5, mitigation: 'Premium 360 diferansiyasyonu · ADOS avantajı', clr: 'sky' },
  { name: 'Regülasyon (KVKK değişiklik)', prob: 'düşük', impact: 'yüksek', score: 3.8, mitigation: 'Audit log · veri anonimleştirme', clr: 'emerald' },
];

const REPORTS: StrategicReport[] = [
  { name: 'Q1 2026 Executive Summary', date: '15 Nis 2026', type: 'Çeyrek', pages: 24, icon: 'doc', clr: 'violet' },
  { name: 'Nisan Aylık Finansal Rapor', date: '22 Nis 2026', type: 'Aylık', pages: 18, icon: 'chart', clr: 'emerald' },
  { name: 'Board Meeting Hazırlık Paketi', date: '20 Nis 2026', type: 'Board', pages: 12, icon: 'briefcase', clr: 'amber' },
  { name: 'AI Tüketim Analizi 30-gün', date: '23 Nis 2026', type: 'Operasyonel', pages: 10, icon: 'zap', clr: 'indigo' },
  { name: 'Sektör Benchmark Raporu', date: '10 Nis 2026', type: 'Strateji', pages: 32, icon: 'target', clr: 'sky' },
  { name: 'Risk Değerlendirmesi (Çeyrek)', date: '18 Nis 2026', type: 'Risk', pages: 16, icon: 'shield', clr: 'rose' },
];

function Icon({ children, className }: { children: ReactNode; className: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      {children}
    </svg>
  );
}

export default function StratejikRaporlar() {
  const [period, setPeriod] = useState<Period>('Yıllık');
  const [reportFilter, setReportFilter] = useState<ReportFilter>('Tümü');
  const [selectedReport, setSelectedReport] = useState<StrategicReport | null>(null);
  const [toast, setToast] = useState<ToastState>(null);

  const averageOkr = Math.round(OKRS.reduce((a, o) => a + o.percent, 0) / OKRS.length);
  const riskScore = (RISKS.reduce((a, r) => a + r.score, 0) / RISKS.length).toFixed(1);

  const kpis = [
    { label: 'Aktif Stratejik Girişim', value: String(INITIATIVES.length), sub: `${INITIATIVES.filter((i) => i.status === 'on-track').length} rotada · ${INITIATIVES.filter((i) => i.status === 'risk').length} riskli`, trend: '—', clr: 'violet' as ColorName, icon: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /> },
    { label: 'OKR Gerçekleşme', value: `%${averageOkr}`, sub: `${OKRS.length} hedef · çeyrek ortalaması`, trend: '+%4', clr: 'emerald' as ColorName, icon: <polyline points="20 6 9 17 4 12" /> },
    { label: 'Risk Skoru', value: riskScore, sub: '/10 · düşük risk seviyesi', trend: '-0.3', clr: 'amber' as ColorName, icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /> },
    { label: 'Sektör Karşılaştırma', value: '+%12', sub: 'Kazanma oranı · büyüme', trend: '+%3', clr: 'sky' as ColorName, icon: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /> },
    { label: 'Board Rapor Sayısı', value: '4', sub: 'Bu çeyrek · 3 sunum', trend: '+1', clr: 'indigo' as ColorName, icon: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /></> },
    { label: 'Karar Hızı', value: '4.2sa', sub: 'Ort. onay bekleme', trend: '-0.8sa', clr: 'teal' as ColorName, icon: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></> },
  ];

  const filteredReports = useMemo(() => {
    if (reportFilter === 'Tümü') return REPORTS;
    return REPORTS.filter((report) => report.type === reportFilter);
  }, [reportFilter]);

  function selectPeriod(nextPeriod: Period) {
    setPeriod(nextPeriod);
    setToast({ title: 'Tarih Seçimi', message: `${nextPeriod} görünümü uygulandı · stratejik metrikler güncelleniyor`, color: 'indigo' });
  }

  function downloadReport(report: StrategicReport) {
    setToast({ title: 'Rapor İndiriliyor', message: `${report.name} (${report.pages} sayfa) PDF olarak hazırlanıyor`, color: report.clr });
  }

  return (
    <Layout activeId="reports" breadcrumb="Genel Müdür · Stratejik Raporlar">
      <div className="relative">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg flex items-center justify-center">
              <Icon className="text-indigo-600 dark:text-indigo-400 w-4 h-4"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" /></Icon>
            </div>
            <div>
              <h1 className="text-[19px] font-bold text-gray-900 dark:text-gray-100 leading-tight">Stratejik Raporlar</h1>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">OKR · Girişimler · Risk haritası · Board raporları</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700/40 rounded-lg">
              {(['Çeyrek', 'Yıllık', '2 Yıllık'] as Period[]).map((item) => (
                <button key={item} onClick={() => selectPeriod(item)} className={`px-2.5 py-1 text-[10px] font-semibold rounded-md ${period === item ? 'bg-white dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-bold' : 'text-gray-500 dark:text-gray-400'}`}>
                  {item}
                </button>
              ))}
            </div>
            <button onClick={() => setToast({ title: 'Yeni Rapor', message: 'Rapor şablonu seçim ekranı açılıyor', color: 'indigo' })} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 dark:bg-gray-100 dark:text-gray-900 text-white text-[11px] font-semibold rounded-md hover:opacity-90 transition-opacity">
              <Icon className="w-3.5 h-3.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></Icon>
              Yeni Rapor
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3 mt-5">
          {kpis.map((kpi) => <KpiCard key={kpi.label} {...kpi} />)}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 mt-5">
          <div className="lg:col-span-3 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700/40 flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <Icon className="text-emerald-600 dark:text-emerald-400 w-4 h-4"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></Icon>
                <div>
                  <h4 className="text-[13px] font-bold text-gray-900 dark:text-gray-100">OKR Takibi · 2026</h4>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">{OKRS.length} hedef · ortalama %{averageOkr} gerçekleşme</p>
                </div>
              </div>
              <button onClick={() => setToast({ title: 'OKR Düzenleme', message: 'Hedefler & Sonuçlar düzenleme ekranı açılıyor', color: 'emerald' })} className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 hover:underline">OKR'ları Düzenle →</button>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700/40">
              {OKRS.map((okr) => <OkrRow key={okr.title} okr={okr} />)}
            </div>
          </div>

          <div className="lg:col-span-2 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700/40 flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <Icon className="text-rose-600 dark:text-rose-400 w-4 h-4"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></Icon>
                <div>
                  <h4 className="text-[13px] font-bold text-gray-900 dark:text-gray-100">Risk Haritası</h4>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">{RISKS.length} izlenen risk</p>
                </div>
              </div>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700/40">
              {RISKS.map((risk) => <RiskRow key={risk.name} risk={risk} />)}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden mt-5">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700/40 flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <Icon className="text-violet-600 dark:text-violet-400 w-4 h-4"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></Icon>
              <div>
                <h4 className="text-[13px] font-bold text-gray-900 dark:text-gray-100">Stratejik Girişimler</h4>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">{INITIATIVES.length} aktif proje · uzun vadeli etki</p>
              </div>
            </div>
            <button onClick={() => setToast({ title: 'Yeni Girişim', message: 'Stratejik girişim tanımlama ekranı açılıyor', color: 'violet' })} className="text-[10px] font-semibold text-violet-700 dark:text-violet-400 hover:underline flex items-center gap-1">
              <Icon className="w-3 h-3"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></Icon>
              Yeni Girişim
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-gray-700/40">
            {INITIATIVES.map((initiative) => <InitiativeCard key={initiative.name} initiative={initiative} />)}
          </div>
        </div>

        <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden mt-5">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700/40 flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <Icon className="text-indigo-600 dark:text-indigo-400 w-4 h-4"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></Icon>
              <div>
                <h4 className="text-[13px] font-bold text-gray-900 dark:text-gray-100">Rapor Arşivi</h4>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">{REPORTS.length} rapor · son 30 gün</p>
              </div>
            </div>
            <div className="flex items-center gap-1 p-0.5 bg-gray-100 dark:bg-[#17181f] border border-gray-200 dark:border-gray-700/40 rounded-md">
              {(['Tümü', 'Çeyrek', 'Aylık', 'Board'] as ReportFilter[]).map((filter) => (
                <button key={filter} onClick={() => setReportFilter(filter)} className={`px-2 py-0.5 text-[10px] font-semibold rounded ${reportFilter === filter ? 'bg-white dark:bg-[#2a2b33] text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}`}>
                  {filter}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-gray-700/40">
            {filteredReports.length === 0 ? (
              <div className="p-8 text-center text-gray-400 dark:text-gray-500 text-[11px] lg:col-span-3 md:col-span-2">Filtreye uyan rapor bulunamadı</div>
            ) : filteredReports.map((report) => (
              <ReportCard key={report.name} report={report} onOpen={setSelectedReport} onDownload={downloadReport} />
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl border border-amber-200/70 dark:border-amber-500/30 mt-5">
          <div className="relative bg-gradient-to-br from-amber-50 via-white to-violet-50 dark:from-[#1a1530] dark:via-[#0f0820] dark:to-[#1a0e3a] p-4">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none aig"></div>
            <div className="relative flex items-start gap-3">
              <div className="relative shrink-0">
                <div className="w-9 h-9 bg-gradient-to-br from-amber-400 via-amber-500 to-violet-600 rounded-lg flex items-center justify-center">
                  <Icon className="text-white w-4 h-4"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></Icon>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <h5 className="text-[12px] font-bold text-gray-900 dark:text-white">Jenny'nin Stratejik Değerlendirmesi</h5>
                  <span className="text-[9px] font-mono text-gray-500 dark:text-white/60">Master.JSON#strategy · OKR_Tracker.JSON v2.1</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div className="p-2.5 bg-white/70 dark:bg-white/5 border border-emerald-200 dark:border-emerald-400/30 rounded-lg">
                    <p className="text-[11px] text-gray-800 dark:text-white/90"><span className="font-bold text-emerald-700 dark:text-emerald-300">✓ Güçlü:</span> OKR ortalaması %{averageOkr} · ciro ve ekip büyümesi rotada · Premium 360 v2 %72 ilerleme.</p>
                  </div>
                  <div className="p-2.5 bg-white/70 dark:bg-white/5 border border-amber-200 dark:border-amber-400/30 rounded-lg">
                    <p className="text-[11px] text-gray-800 dark:text-white/90"><span className="font-bold text-amber-700 dark:text-amber-300">⚠ İzle:</span> Premium 360 müşteri hedefi %53 · yetenek kaybı riski yüksek · AI maliyeti optimizasyon bekliyor.</p>
                  </div>
                  <div className="p-2.5 bg-white/70 dark:bg-white/5 border border-violet-200 dark:border-violet-400/30 rounded-lg">
                    <p className="text-[11px] text-gray-800 dark:text-white/90"><span className="font-bold text-violet-700 dark:text-violet-300">◆ Fırsat:</span> Q3'te API Marketplace lansmanı · Avrupa pazarı hazırlıkları paralel yürütülebilir.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {selectedReport ? <ReportDetailModal report={selectedReport} onClose={() => setSelectedReport(null)} onDownload={downloadReport} /> : null}
        <Toast toast={toast} onClose={() => setToast(null)} />
      </div>
    </Layout>
  );
}

function KpiCard({ label, value, sub, trend, clr, icon }: { label: string; value: string; sub: string; trend: string; clr: ColorName; icon: ReactNode }) {
  const cm = CM[clr] || CM.gray;
  return (
    <div className="relative overflow-hidden bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-3.5 hover:shadow-sm hover:-translate-y-0.5 transition-all">
      <div className={`absolute -top-8 -right-8 w-24 h-24 bg-${clr}-500/5 rounded-full blur-xl pointer-events-none`}></div>
      <div className="relative flex items-start justify-between mb-2">
        <div className={`w-8 h-8 ${cm.bg} rounded-lg flex items-center justify-center`}><Icon className={`${cm.t} w-4 h-4`}>{icon}</Icon></div>
        {trend === '—' ? <span className="text-[9px] font-semibold text-gray-400 dark:text-gray-500 px-1.5 py-0.5">—</span> : <span className="text-[9px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded">{trend}</span>}
      </div>
      <div className="relative text-[22px] font-bold text-gray-900 dark:text-gray-50 leading-none mb-1">{value}</div>
      <div className="relative text-[11px] font-semibold text-gray-600 dark:text-gray-400 leading-tight">{label}</div>
      <div className="relative text-[9px] text-gray-400 dark:text-gray-500 mt-0.5">{sub}</div>
    </div>
  );
}

function OkrRow({ okr }: { okr: Okr }) {
  const cm = CM[okr.clr] || CM.gray;
  const sClr = okr.status === 'track' ? 'emerald' : okr.status === 'risk' ? 'amber' : 'rose';
  const sLbl = okr.status === 'track' ? 'Rotada' : okr.status === 'risk' ? 'Risk' : 'Gecikmiş';
  return (
    <div className="p-3">
      <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={`w-7 h-7 ${cm.bg} rounded-lg flex items-center justify-center shrink-0`}><Icon className={`${cm.t} w-3.5 h-3.5`}><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></Icon></div>
          <div className="min-w-0">
            <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100">{okr.title}</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">{okr.quarter} · hedef {okr.target}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-[10px] font-semibold px-1.5 py-0.5 bg-${sClr}-100 dark:bg-${sClr}-900/30 text-${sClr}-700 dark:text-${sClr}-300 rounded`}>{sLbl}</span>
          <div className="text-right">
            <p className={`text-[14px] font-bold ${cm.t}`}>{okr.current}</p>
            <p className="text-[9px] text-gray-500 dark:text-gray-400">%{okr.percent}</p>
          </div>
        </div>
      </div>
      <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <div className={`h-full bg-gradient-to-r from-${okr.clr}-400 to-${okr.clr}-600 rounded-full`} style={{ width: `${okr.percent}%` }}></div>
      </div>
    </div>
  );
}

function RiskRow({ risk }: { risk: RiskItem }) {
  const scoreClr: ColorName = risk.score >= 6 ? 'rose' : risk.score >= 4 ? 'amber' : 'emerald';
  return (
    <div className="p-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
      <div className="flex items-start gap-2.5">
        <div className="shrink-0 text-center">
          <div className={`w-10 h-10 bg-${scoreClr}-100 dark:bg-${scoreClr}-900/30 rounded-lg flex items-center justify-center`}>
            <span className={`text-[13px] font-black text-${scoreClr}-700 dark:text-${scoreClr}-300`}>{risk.score}</span>
          </div>
          <p className="text-[8px] text-gray-500 dark:text-gray-400 mt-0.5 uppercase tracking-wider">skor</p>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100 leading-tight">{risk.name}</p>
          <div className="flex items-center gap-2 text-[9px] text-gray-500 dark:text-gray-400 mt-0.5">
            <span>Olasılık: <span className="font-semibold">{risk.prob}</span></span>
            <span>·</span>
            <span>Etki: <span className="font-semibold">{risk.impact}</span></span>
          </div>
          <p className="text-[10px] text-emerald-700 dark:text-emerald-300 mt-1.5 leading-snug flex items-start gap-1">
            <Icon className="w-2.5 h-2.5 shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12" /></Icon>
            <span>{risk.mitigation}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function InitiativeCard({ initiative }: { initiative: Initiative }) {
  const cm = CM[initiative.clr] || CM.gray;
  const sClr = initiative.status === 'on-track' ? 'emerald' : initiative.status === 'risk' ? 'amber' : initiative.status === 'planning' ? 'sky' : 'gray';
  const sLbl = initiative.status === 'on-track' ? 'Rotada' : initiative.status === 'risk' ? 'Risk' : initiative.status === 'planning' ? 'Planlama' : 'Beklemede';
  const impLbl = initiative.impact === 'high' ? 'Yüksek Etki' : initiative.impact === 'medium' ? 'Orta Etki' : 'Düşük Etki';
  return (
    <div className="p-4 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className={`w-8 h-8 ${cm.bg} rounded-lg flex items-center justify-center shrink-0`}><Icon className={`${cm.t} w-4 h-4`}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></Icon></div>
          <div className="min-w-0">
            <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100 leading-tight">{initiative.name}</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">{initiative.owner} · {initiative.deadline}</p>
          </div>
        </div>
        <span className={`text-[9px] font-semibold px-1.5 py-0.5 bg-${sClr}-100 dark:bg-${sClr}-900/30 text-${sClr}-700 dark:text-${sClr}-300 rounded shrink-0`}>{sLbl}</span>
      </div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[9px] text-gray-500 dark:text-gray-400">{impLbl}</span>
        <span className={`text-[11px] font-bold ${cm.t}`}>%{initiative.progress}</span>
      </div>
      <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <div className={`h-full bg-gradient-to-r from-${initiative.clr}-400 to-${initiative.clr}-600 rounded-full`} style={{ width: `${initiative.progress}%` }}></div>
      </div>
    </div>
  );
}

function ReportCard({ report, onOpen, onDownload }: { report: StrategicReport; onOpen: (report: StrategicReport) => void; onDownload: (report: StrategicReport) => void }) {
  const cm = CM[report.clr] || CM.gray;
  return (
    <div className="p-4 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors group cursor-pointer" onClick={() => onOpen(report)}>
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2.5">
          <div className={`w-10 h-12 ${cm.bg} rounded flex items-center justify-center shrink-0 relative`}>
            <Icon className={`${cm.t} w-5 h-5`}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></Icon>
            <span className={`absolute -bottom-1 -right-1 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded text-[8px] font-bold ${cm.t} px-1 py-0.5`}>PDF</span>
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100 leading-tight">{report.name}</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{report.type} · {report.pages} sayfa</p>
            <p className="text-[9px] text-gray-400 dark:text-gray-500 font-mono mt-0.5">{report.date}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-100 dark:border-gray-700/40">
        <button onClick={(event) => { event.stopPropagation(); onOpen(report); }} className={`flex items-center gap-1 text-[10px] font-semibold ${cm.t} hover:underline`}>
          <Icon className="w-3 h-3"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></Icon>
          Görüntüle
        </button>
        <button onClick={(event) => { event.stopPropagation(); onDownload(report); }} className={`flex items-center gap-1 text-[10px] font-semibold text-gray-600 dark:text-gray-400 group-hover:text-${report.clr}-700 dark:group-hover:text-${report.clr}-300 transition-colors`}>
          <Icon className="w-3 h-3"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></Icon>
          İndir
        </button>
      </div>
    </div>
  );
}

function ReportDetailModal({ report, onClose, onDownload }: { report: StrategicReport; onClose: () => void; onDownload: (report: StrategicReport) => void }) {
  const cm = CM[report.clr] || CM.gray;
  return (
    <>
      <div className="modal-overlay absolute inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose}></div>
      <div className="modal-panel absolute inset-0 flex items-start justify-center p-4 pointer-events-none z-50">
        <div className="modal-scroll bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-xl w-full max-w-[640px] max-h-[90vh] overflow-y-auto pointer-events-auto">
          <div className="sticky top-0 z-10 bg-white dark:bg-[#1e1f26] border-b border-gray-100 dark:border-gray-700/60 p-5 flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-12 ${cm.bg} rounded flex items-center justify-center shrink-0 relative`}>
                <Icon className={`${cm.t} w-5 h-5`}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></Icon>
                <span className={`absolute -bottom-1 -right-1 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded text-[8px] font-bold ${cm.t} px-1 py-0.5`}>PDF</span>
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-[18px] font-bold text-gray-900 dark:text-gray-100">{report.name}</h2>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 ${cm.bg} ${cm.t} rounded`}>{report.type}</span>
                </div>
                <p className="text-[12px] text-gray-600 dark:text-gray-400">{report.date} · {report.pages} sayfa · PDF</p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 font-mono">Master.JSON#strategy · OKR_Tracker.JSON v2.1</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors p-1">
              <Icon className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Icon>
            </button>
          </div>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <InfoCard label="Tip" value={report.type} color={report.clr} />
              <InfoCard label="Sayfa" value={String(report.pages)} color="indigo" />
              <InfoCard label="Format" value="PDF" color="rose" />
              <InfoCard label="Tarih" value={report.date} color="amber" />
            </div>
            <div className="bg-gray-50 dark:bg-[#17181f] border border-gray-200 dark:border-gray-700/40 rounded-lg p-4">
              <h3 className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Rapor Özeti</h3>
              <p className="text-[12px] text-gray-700 dark:text-gray-300 leading-relaxed">
                {report.name} · {report.type} raporu · {report.pages} sayfa · {report.date}. OKR, girişim, risk ve board karar hazırlığı bağlamında arşivlenen stratejik rapor kaydı.
              </p>
            </div>
          </div>
          <div className="sticky bottom-0 bg-white dark:bg-[#1e1f26] border-t border-gray-100 dark:border-gray-700/60 p-4 flex items-center justify-between gap-2 flex-wrap">
            <button onClick={onClose} className="px-3 py-2 text-[11px] font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">Kapat</button>
            <button onClick={() => onDownload(report)} className="flex items-center gap-1.5 px-4 py-2 text-[11px] font-semibold bg-gray-900 dark:bg-gray-100 dark:text-gray-900 text-white rounded-md hover:opacity-90 transition-opacity">
              <Icon className="w-3.5 h-3.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></Icon>
              İndir
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function InfoCard({ label, value, color }: { label: string; value: string; color: ColorName }) {
  return <div className={`p-3 bg-gradient-to-br from-${color}-50 to-transparent dark:from-${color}-500/10 border border-${color}-200 dark:border-${color}-500/30 rounded-lg`}><p className={`text-[9px] font-bold text-${color}-700 dark:text-${color}-300 uppercase tracking-wider`}>{label}</p><p className="text-[18px] font-black text-gray-900 dark:text-gray-100 leading-none mt-1">{value}</p></div>;
}

function Toast({ toast, onClose }: { toast: ToastState; onClose: () => void }) {
  if (!toast) return null;
  const clrs: Record<ColorName, { bg: string; bd: string }> = {
    emerald: { bg: '#10b981', bd: '#059669' },
    rose: { bg: '#f43f5e', bd: '#e11d48' },
    amber: { bg: '#f59e0b', bd: '#d97706' },
    sky: { bg: '#0ea5e9', bd: '#0284c7' },
    violet: { bg: '#8b5cf6', bd: '#7c3aed' },
    indigo: { bg: '#6366f1', bd: '#4f46e5' },
    teal: { bg: '#14b8a6', bd: '#0d9488' },
    pink: { bg: '#ec4899', bd: '#db2777' },
    gray: { bg: '#6b7280', bd: '#4b5563' },
  };
  const color = clrs[toast.color] || clrs.emerald;
  return (
    <div style={{ position: 'absolute', bottom: '24px', right: '24px', zIndex: 9999, minWidth: '280px', maxWidth: '400px', background: 'white', borderLeft: `4px solid ${color.bd}`, borderRadius: '10px', boxShadow: '0 8px 24px rgba(0,0,0,.15)', padding: '14px 16px', animation: 'toastSlide .3s ease-out' }}>
      <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}><div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: '13px', color: color.bg, marginBottom: '2px' }}>{toast.title}</div><div style={{ fontSize: '11px', color: '#6b7280' }}>{toast.message}</div></div><button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: '16px' }}>×</button></div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, height: '2px', background: color.bg, borderRadius: '0 0 10px 10px', animation: 'toastProgress 3s linear' }}></div>
    </div>
  );
}
