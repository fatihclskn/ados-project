import { type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

type ColorName = 'emerald' | 'amber' | 'rose' | 'sky' | 'violet' | 'indigo' | 'teal' | 'pink' | 'gray';
type PanelStatus = 'active' | 'development' | 'planning' | 'concept';

type Panel = {
  id: string;
  name: string;
  lead: string;
  role: string;
  icon: ReactNode;
  clr: ColorName;
  phase: 1 | 2 | 3 | 4;
  status: PanelStatus;
  kpis?: Array<{ l: string; v: string }>;
  releaseQ?: string;
  premium?: string;
  desc: string;
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

const PANELS: Panel[] = [
  {
    id: 'pano-satis',
    name: 'Satış Panosu',
    lead: 'Çiğdem Alataş',
    role: 'Satış Direktörü',
    icon: (
      <>
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
      </>
    ),
    clr: 'emerald',
    phase: 1,
    status: 'active',
    kpis: [
      { l: 'Teklif', v: '178' },
      { l: 'Kazanma', v: '%42' },
      { l: 'MRR', v: '₺216K' },
      { l: 'Pipeline', v: '₺4.2M' },
    ],
    desc: 'Lead → Teklif → Sözleşme akışı · 8 hizmet türü · tüm CRM entegrasyonu',
  },
  {
    id: 'pano-pazarlama',
    name: 'Pazarlama Panosu',
    lead: 'Zeynep Acar',
    role: 'Pazarlama Direktörü',
    icon: (
      <>
        <path d="M3 11l18-5v12L3 14v-3z" />
        <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
      </>
    ),
    clr: 'pink',
    phase: 1,
    status: 'active',
    kpis: [
      { l: 'Lead', v: '178' },
      { l: 'Kalifiye', v: '37' },
      { l: 'CAC', v: '₺1.2K' },
      { l: 'Kampanya', v: '8' },
    ],
    desc: 'Pazarlama stratejisi · lead generation · içerik takvimi · analitik rapor',
  },
  {
    id: 'pano-finans',
    name: 'Finans Panosu',
    lead: 'Ali Berksoy',
    role: 'Finans Direktörü',
    icon: (
      <>
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </>
    ),
    clr: 'amber',
    phase: 1,
    status: 'active',
    kpis: [
      { l: 'Tahsilat', v: '%96' },
      { l: 'Alacak', v: '₺312K' },
      { l: 'Gecikmiş', v: '4' },
      { l: 'Runway', v: '60g' },
    ],
    desc: 'E-fatura · tahsilat takibi · bütçe yönetimi · nakit akışı · GIB',
  },
  {
    id: 'pano-ads',
    name: 'Ads Operasyon',
    lead: 'Berke Yılmaz',
    role: 'Reklam Operasyon Şefi',
    icon: (
      <>
        <path d="M11 5 6 9H2v6h4l5 4V5z" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      </>
    ),
    clr: 'sky',
    phase: 1,
    status: 'active',
    kpis: [
      { l: 'Hesap', v: '24' },
      { l: 'Spend', v: '₺1.8M' },
      { l: 'ROAS', v: '2.4x' },
      { l: 'CTR', v: '%3.2' },
    ],
    desc: 'Google Ads · Meta Ads · LinkedIn · TikTok · bütçe & kreatif yönetimi',
  },
  {
    id: 'pano-seo',
    name: 'SEO Operasyon',
    lead: '',
    role: 'Atama Bekliyor',
    icon: (
      <>
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </>
    ),
    clr: 'indigo',
    phase: 2,
    status: 'development',
    releaseQ: 'Q3 2026',
    premium: 'ADOS AI SEO',
    desc: 'Keyword araştırma · içerik planı · SERP tracking · Ahrefs/SEMrush · Lokal/Ulusal/Global',
  },
  {
    id: 'pano-sosyal',
    name: 'Sosyal Medya Operasyon',
    lead: '',
    role: 'Atama Bekliyor',
    icon: (
      <>
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
      </>
    ),
    clr: 'rose',
    phase: 2,
    status: 'development',
    releaseQ: 'Q3 2026',
    desc: '5 platform içerik üretimi · takvim · reklam analizi · etkileşim takibi',
  },
  {
    id: 'pano-webprod',
    name: 'Web Prodüksiyon',
    lead: '',
    role: 'Atama Bekliyor',
    icon: (
      <>
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </>
    ),
    clr: 'violet',
    phase: 2,
    status: 'development',
    releaseQ: 'Q4 2026',
    desc: 'Web sitesi üretimi · Lighthouse audit · Core Web Vitals · performans takibi',
  },
  {
    id: 'pano-prodksn',
    name: 'Prodüksiyon (Foto/Video)',
    lead: '',
    role: 'Atama Bekliyor',
    icon: (
      <>
        <polygon points="23 7 16 12 23 17 23 7" />
        <rect x="1" y="5" width="15" height="14" rx="2" />
      </>
    ),
    clr: 'teal',
    phase: 2,
    status: 'development',
    releaseQ: 'Q4 2026',
    desc: 'AI foto · AI video · ses/altyazı · DALL-E · Runway Gen-3 · ElevenLabs',
  },
  {
    id: 'pano-marka',
    name: 'Marka Tescili Operasyon',
    lead: '',
    role: 'Atama Bekliyor',
    icon: <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />,
    clr: 'amber',
    phase: 2,
    status: 'development',
    releaseQ: 'Q4 2026',
    desc: 'TürkPatent API · WIPO Madrid · benzerlik taraması · NICE sınıfları · itiraz süreci',
  },
  {
    id: 'pano-domain',
    name: 'Domain & Hosting',
    lead: '',
    role: 'Atama Bekliyor',
    icon: (
      <>
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </>
    ),
    clr: 'indigo',
    phase: 2,
    status: 'development',
    releaseQ: 'Q4 2026',
    desc: 'Metunic · Plesk · cPanel · Cloudflare · 4 setup tipi · SSL yönetimi',
  },
  {
    id: 'pano-musteri',
    name: 'Müşteri Başarı',
    lead: '',
    role: 'Atama Bekliyor',
    icon: (
      <>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    clr: 'emerald',
    phase: 3,
    status: 'planning',
    releaseQ: 'Q1 2027',
    desc: 'Churn tahmini · NPS · engagement skoru · retention aksiyonları · renewal',
  },
  {
    id: 'pano-ik',
    name: 'İnsan Kaynakları',
    lead: '',
    role: 'Atama Bekliyor',
    icon: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 11l-3-3m0 0l-3 3m3-3v8" />
      </>
    ),
    clr: 'rose',
    phase: 3,
    status: 'planning',
    releaseQ: 'Q1 2027',
    desc: 'İşe alım · performans · bordro · izin yönetimi · eğitim planı',
  },
  {
    id: 'pano-hukuk',
    name: 'Hukuk & Sözleşme',
    lead: '',
    role: 'Atama Bekliyor',
    icon: (
      <>
        <path d="M12 3v18" />
        <path d="M6 8l6-5 6 5" />
        <path d="M4 22h16" />
        <path d="M6 15l6 5 6-5" />
      </>
    ),
    clr: 'gray',
    phase: 3,
    status: 'planning',
    releaseQ: 'Q2 2027',
    desc: 'Sözleşme şablonları · KVKK · GDPR · hukuki risk takibi',
  },
  {
    id: 'pano-raporlama',
    name: 'Raporlama & BI',
    lead: '',
    role: 'Atama Bekliyor',
    icon: (
      <>
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </>
    ),
    clr: 'sky',
    phase: 3,
    status: 'planning',
    releaseQ: 'Q2 2027',
    desc: 'İş zekası · custom dashboards · export · veri ambarı · forecasting',
  },
  {
    id: 'pano-premium',
    name: 'Premium 360',
    lead: '',
    role: 'Atama Bekliyor',
    icon: <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />,
    clr: 'amber',
    phase: 4,
    status: 'concept',
    releaseQ: '2027+',
    premium: 'VIP',
    desc: 'Dedicated ekip · priority SLA · tüm hizmet entegrasyonu · VIP müşteri yönetimi',
  },
  {
    id: 'pano-tedarikci',
    name: 'Tedarikçi Yönetimi',
    lead: '',
    role: 'Atama Bekliyor',
    icon: (
      <>
        <rect x="1" y="3" width="15" height="13" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </>
    ),
    clr: 'indigo',
    phase: 4,
    status: 'concept',
    releaseQ: '2027+',
    desc: 'Vendor yönetimi · satın alma · stok takibi · ödeme planlama',
  },
  {
    id: 'pano-akademi',
    name: 'ADOS Akademi',
    lead: '',
    role: 'Atama Bekliyor',
    icon: (
      <>
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </>
    ),
    clr: 'violet',
    phase: 4,
    status: 'concept',
    releaseQ: '2027+',
    desc: 'Dahili eğitim · video kütüphanesi · sertifika · beceri geliştirme',
  },
  {
    id: 'pano-yazilim',
    name: 'Yazılım & Geliştirme',
    lead: '',
    role: 'Atama Bekliyor',
    icon: (
      <>
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </>
    ),
    clr: 'teal',
    phase: 4,
    status: 'concept',
    releaseQ: '2027+',
    desc: 'ADOS kod tabanı · sprint yönetimi · CI/CD · bug tracking · release plan',
  },
];

const PHASES = [
  { n: 1, label: 'FAZ 1', title: 'Aktif Operasyon', sub: 'Canlı çalışan birim panoları · tüm yöneticiler atandı', accent: 'emerald' as const },
  { n: 2, label: 'FAZ 2', title: 'Geliştirme Aşaması', sub: 'Q3-Q4 2026 yayın planı · hizmet birim panoları', accent: 'sky' as const },
  { n: 3, label: 'FAZ 3', title: 'Kurumsal Planlama', sub: 'Q1-Q2 2027 yol haritası · destek & altyapı birimleri', accent: 'amber' as const },
  { n: 4, label: 'FAZ 4', title: 'Premium & Strateji', sub: '2027+ uzun vade · konsept & premium ek modüller', accent: 'violet' as const },
];

const STATUS_CONF: Record<PanelStatus, { lbl: string; clr: ColorName; dot: boolean; btn: string; btnClr: boolean }> = {
  active: { lbl: 'AKTİF', clr: 'emerald', dot: true, btn: 'Panoya Git', btnClr: true },
  development: { lbl: 'GELİŞTİRMEDE', clr: 'sky', dot: false, btn: 'Önizleme', btnClr: false },
  planning: { lbl: 'PLANLAMADA', clr: 'amber', dot: false, btn: 'Roadmap', btnClr: false },
  concept: { lbl: 'KONSEPT', clr: 'gray', dot: false, btn: 'Bilgi Al', btnClr: false },
};

function Icon({ children, className }: { children: ReactNode; className: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      {children}
    </svg>
  );
}

function DashboardIcon({ className }: { className: string }) {
  return (
    <Icon className={className}>
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </Icon>
  );
}

function ArrowIcon({ className }: { className: string }) {
  return (
    <Icon className={className}>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </Icon>
  );
}

function ClockIcon({ className }: { className: string }) {
  return (
    <Icon className={className}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </Icon>
  );
}

function InfoIcon({ className }: { className: string }) {
  return (
    <Icon className={className}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </Icon>
  );
}

function PanelCard({ panel, onOpen }: { panel: Panel; onOpen?: () => void }) {
  const cm = CM[panel.clr] || CM.gray;
  const sConf = STATUS_CONF[panel.status];
  const isActive = panel.status === 'active';

  return (
    <div
      className={`group relative overflow-hidden bg-white dark:bg-[#1a1b22] border border-gray-200 dark:border-gray-700/50 rounded-xl ${
        isActive ? `hover:border-${panel.clr}-300 dark:hover:border-${panel.clr}-500/50` : 'hover:border-amber-300/60 dark:hover:border-amber-500/30'
      } transition-all ${isActive ? 'cursor-pointer' : ''}`}
    >
      <div
        className={`absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-${panel.clr}-${
          isActive ? '500' : '500/30'
        } via-${panel.clr}-${isActive ? '500/80' : '500/15'} to-transparent`}
      />

      {isActive ? (
        <div
          className={`absolute -top-16 -right-16 w-32 h-32 bg-${panel.clr}-500/8 dark:bg-${panel.clr}-500/12 rounded-full blur-2xl pointer-events-none group-hover:bg-${panel.clr}-500/15 dark:group-hover:bg-${panel.clr}-500/20 transition-colors`}
        />
      ) : null}

      <div className="relative p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`w-10 h-10 ${isActive ? cm.bg : 'bg-gray-100 dark:bg-white/5'} rounded-lg flex items-center justify-center shrink-0 border ${
                isActive ? `border-${panel.clr}-200 dark:border-${panel.clr}-500/30` : 'border-gray-200 dark:border-white/10'
              }`}
            >
              <Icon className={`${isActive ? cm.t : 'text-gray-400 dark:text-gray-500'} w-4 h-4`}>{panel.icon}</Icon>
            </div>
            <div className="min-w-0">
              <h3 className="text-[13px] font-bold text-gray-900 dark:text-gray-100 leading-tight truncate">{panel.name}</h3>
              <p className={`text-[10px] ${panel.lead ? 'text-gray-600 dark:text-gray-400' : 'text-gray-400 dark:text-gray-500 italic'} leading-tight mt-0.5 truncate`}>
                {panel.lead ? `${panel.lead} · ${panel.role}` : panel.role}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <span className="text-[8px] font-bold font-mono tracking-widest text-gray-400 dark:text-gray-500 uppercase">FAZ {panel.phase}</span>
            <span
              className={`flex items-center gap-1 px-1.5 py-0.5 bg-${sConf.clr}-100 dark:bg-${sConf.clr}-500/10 border border-${sConf.clr}-200 dark:border-${sConf.clr}-500/30 rounded`}
            >
              {sConf.dot ? <span className={`w-1 h-1 bg-${sConf.clr}-500 rounded-full animate-pulse`} /> : null}
              <span className={`text-[8px] font-bold text-${sConf.clr}-700 dark:text-${sConf.clr}-300 tracking-wider`}>{sConf.lbl}</span>
            </span>
          </div>
        </div>

        <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-snug mb-3 line-clamp-2 min-h-[28px]">{panel.desc}</p>

        {isActive ? (
          <div className="grid grid-cols-4 gap-1 mb-3">
            {panel.kpis?.map((kpi) => (
              <div key={`${panel.id}-${kpi.l}`} className="p-1.5 bg-gray-50 dark:bg-[#0f1015] border border-gray-100 dark:border-gray-700/30 rounded text-center">
                <p className="text-[8px] text-gray-500 dark:text-gray-500 uppercase tracking-wider leading-tight">{kpi.l}</p>
                <p className="text-[11px] font-bold text-gray-900 dark:text-gray-100 leading-tight mt-0.5 font-mono">{kpi.v}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2 mb-3 p-2 bg-gray-50 dark:bg-[#0f1015] border border-gray-100 dark:border-gray-700/30 rounded">
            <div className="flex items-center gap-1.5 text-[9px] text-gray-500 dark:text-gray-500">
              <ClockIcon className="w-3 h-3" />
              <span className="uppercase tracking-wider font-semibold">Yayın Planı</span>
            </div>
            <span className="text-[10px] font-mono font-bold text-amber-700 dark:text-amber-300">{panel.releaseQ}</span>
            {panel.premium ? (
              <span className="text-[8px] font-bold px-1.5 py-0.5 bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30 rounded">
                ★ {panel.premium}
              </span>
            ) : null}
          </div>
        )}

        <button
          type="button"
          onClick={onOpen}
          className={`w-full flex items-center justify-center gap-1.5 py-2 text-[11px] font-bold rounded-lg transition-all ${
            sConf.btnClr
              ? `bg-gradient-to-r from-${panel.clr}-500 to-${panel.clr}-600 hover:from-${panel.clr}-400 hover:to-${panel.clr}-500 text-white shadow-sm`
              : 'bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10'
          }`}
        >
          {panel.id === 'pano-satis' ? 'Satış Panosuna Git' : panel.id === 'pano-pazarlama' ? 'Pazarlama Panosuna Git' : panel.id === 'pano-finans' ? 'Finans Panosuna Git' : panel.id === 'pano-ads' ? 'Google Ads Paneline Git' : sConf.btn} <ArrowIcon className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

export default function Panolar() {
  const navigate = useNavigate();
  const activeCount = PANELS.filter((panel) => panel.status === 'active').length;
  const devCount = PANELS.filter((panel) => panel.status === 'development').length;
  const planCount = PANELS.filter((panel) => panel.status === 'planning').length;
  const conceptCount = PANELS.filter((panel) => panel.status === 'concept').length;

  return (
    <Layout activeId="panels" breadcrumb="ADOS İşletim Sistemi · Panolar">
      <div className="relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-amber-50/30 dark:from-[#1a1b22] dark:via-[#17181f] dark:to-[#1e1a14] border border-amber-200/60 dark:border-amber-500/20 rounded-2xl p-6">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500/10 dark:bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-violet-500/10 dark:bg-violet-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20">
              <DashboardIcon className="text-white w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-[22px] font-black text-gray-900 dark:text-gray-100 tracking-tight leading-none">Pano Haritası</h1>
                <span className="text-[9px] font-bold tracking-widest text-amber-700 dark:text-amber-300 uppercase px-2 py-0.5 bg-amber-100 dark:bg-amber-500/15 border border-amber-200/60 dark:border-amber-500/30 rounded-full">
                  ADOS İşletim Sistemi
                </span>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                {PANELS.length} birim panosu · 4 fazlı yol haritası · {activeCount} aktif · {devCount + planCount + conceptCount} geliştirilme aşamasında
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { c: activeCount, lbl: 'Aktif', clr: 'emerald' as const },
              { c: devCount, lbl: 'Geliştirme', clr: 'sky' as const },
              { c: planCount, lbl: 'Planlama', clr: 'amber' as const },
              { c: conceptCount, lbl: 'Konsept', clr: 'gray' as const },
            ].map((summary) => {
              const cm = CM[summary.clr] || CM.gray;
              return (
                <div key={summary.lbl} className="px-2.5 py-1.5 bg-white/70 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-lg">
                  <p className={`text-[18px] font-black ${cm.t} font-mono leading-none`}>{summary.c}</p>
                  <p className="text-[8px] font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wider mt-0.5">{summary.lbl}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {PHASES.map((phase) => {
        const phasePanels = PANELS.filter((panel) => panel.phase === phase.n);
        const accCm = CM[phase.accent] || CM.gray;
        return (
          <div key={phase.n} className="space-y-3">
            <div className="flex items-center gap-3 py-2">
              <div className="flex items-center gap-3">
                <span className={`text-[10px] font-black tracking-[0.15em] ${accCm.t} font-mono`}>{phase.label}</span>
                <span className={`h-px w-8 bg-gradient-to-r from-${phase.accent}-500/60 to-transparent`} />
              </div>
              <div className="flex-1">
                <h2 className="text-[15px] font-bold text-gray-900 dark:text-gray-100 leading-none">{phase.title}</h2>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{phase.sub}</p>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 ${accCm.bg} ${accCm.t} rounded-full`}>{phasePanels.length} PANO</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {phasePanels.map((panel) => (
                <PanelCard
                  key={panel.id}
                  panel={panel}
                  onOpen={panel.id === 'pano-satis' ? () => navigate('/dashboards/sales') : panel.id === 'pano-pazarlama' ? () => navigate('/dashboards/marketing') : panel.id === 'pano-finans' ? () => navigate('/dashboards/finance') : panel.id === 'pano-ads' ? () => navigate('/dashboards/google-ads') : undefined}
                />
              ))}
            </div>
          </div>
        );
      })}

      <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-violet-50/40 dark:from-amber-500/5 dark:via-[#17181f] dark:to-violet-500/5 border border-amber-200/60 dark:border-amber-500/20 rounded-xl p-4">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
        <div className="flex items-start gap-3">
          <InfoIcon className="text-amber-600 dark:text-amber-400 w-4 h-4 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-[12px] font-bold text-amber-900 dark:text-amber-200">ADOS İşletim Sistemi · Her pano bağımsız bir birim modülüdür</p>
            <p className="text-[10px] text-amber-700/80 dark:text-amber-300/80 mt-1 leading-relaxed">
              Her birim panosu kendi JSON ajanlarını, AI modellerini ve entegrasyonlarını kullanarak çalışır. Komuta Merkezi'nden tüm panoların özet göstergelerini takip edebilir,
              Onay Kuyruğu'ndan birimler arası talepleri yönetebilirsiniz. Geliştirme aşamasındaki panolar için yayın planı yukarıda belirtilmiştir; faz ilerledikçe pano
              yöneticileri atanacaktır.
            </p>
          </div>
          <span className="text-[9px] font-mono text-amber-600/70 dark:text-amber-400/70 shrink-0">ADOS Panel · v4.1.0</span>
        </div>
      </div>
    </Layout>
  );
}
