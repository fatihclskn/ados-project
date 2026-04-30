import { type ReactNode } from 'react';

type ColorName = 'emerald' | 'amber' | 'rose' | 'sky' | 'violet' | 'indigo' | 'teal' | 'gray';
type ManagementColor = 'violet' | 'emerald' | 'amber' | 'sky' | 'gray';

type Kpi = {
  label: string;
  v: string;
  sub: string;
  up: boolean;
  c: string;
  d: number[];
};

type ManagementCard = {
  icon: ReactNode;
  title: string;
  desc: string;
  cta: string;
  stats: string;
  clr: ManagementColor;
};

type SummaryBlock = {
  title: string;
  items: Array<{ label: string; value: string; clr: ColorName | 'orange' }>;
};

const CM: Record<ColorName, { bg: string; t: string }> = {
  emerald: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', t: 'text-emerald-700 dark:text-emerald-300' },
  amber: { bg: 'bg-amber-100 dark:bg-amber-900/30', t: 'text-amber-700 dark:text-amber-300' },
  rose: { bg: 'bg-rose-100 dark:bg-rose-900/30', t: 'text-rose-700 dark:text-rose-300' },
  sky: { bg: 'bg-sky-100 dark:bg-sky-900/30', t: 'text-sky-700 dark:text-sky-300' },
  violet: { bg: 'bg-violet-100 dark:bg-violet-900/30', t: 'text-violet-700 dark:text-violet-300' },
  indigo: { bg: 'bg-indigo-100 dark:bg-indigo-900/30', t: 'text-indigo-700 dark:text-indigo-300' },
  teal: { bg: 'bg-teal-100 dark:bg-teal-900/30', t: 'text-teal-700 dark:text-teal-300' },
  gray: { bg: 'bg-gray-100 dark:bg-gray-800', t: 'text-gray-600 dark:text-gray-400' },
};

const MANAGEMENT_COLOR_MAP: Record<ManagementColor, { bg: string; t: string; btn: string }> = {
  violet: { bg: 'bg-violet-100 dark:bg-violet-900/40', t: 'text-violet-600 dark:text-violet-400', btn: 'bg-violet-600 hover:bg-violet-700' },
  emerald: { bg: 'bg-emerald-100 dark:bg-emerald-900/40', t: 'text-emerald-600 dark:text-emerald-400', btn: 'bg-emerald-600 hover:bg-emerald-700' },
  amber: { bg: 'bg-amber-100 dark:bg-amber-900/40', t: 'text-amber-600 dark:text-amber-400', btn: 'bg-amber-600 hover:bg-amber-700' },
  sky: { bg: 'bg-sky-100 dark:bg-sky-900/40', t: 'text-sky-600 dark:text-sky-400', btn: 'bg-sky-600 hover:bg-sky-700' },
  gray: { bg: 'bg-gray-100 dark:bg-gray-800', t: 'text-gray-600 dark:text-gray-400', btn: 'bg-gray-900 dark:bg-gray-100 dark:text-gray-900' },
};

const KPIS: Kpi[] = [
  { label: 'Aktif Müşteri', v: '142', sub: '+8 bu ay', up: true, c: '#8b5cf6', d: [118, 124, 128, 133, 137, 140, 142] },
  { label: 'Talebe Dönüşen Kayıt', v: '78', sub: '+12 bu ay', up: true, c: '#10b981', d: [54, 58, 63, 67, 71, 75, 78] },
  { label: 'Açık Satış Fırsatı', v: '34', sub: '+5 bu hafta', up: true, c: '#f59e0b', d: [22, 25, 27, 29, 31, 33, 34] },
  { label: 'Teklif Bekleyen', v: '18', sub: '6 kritik', up: false, c: '#ef4444', d: [12, 14, 15, 16, 17, 18, 18] },
  { label: 'İmza Bekleyen Sözleşme', v: '9', sub: '3 bu hafta', up: true, c: '#6366f1', d: [4, 5, 6, 7, 7, 8, 9] },
  { label: 'Bu Ay Kapanan Satış', v: '24', sub: '+6 geçen aya göre', up: true, c: '#22c55e', d: [14, 16, 17, 19, 20, 22, 24] },
];

const MANAGEMENT_CARDS: ManagementCard[] = [
  {
    icon: (
      <>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
      </>
    ),
    title: 'Müşteri Havuzu',
    desc: 'Kayıtlı firmaları, segmentleri ve ilişki durumunu yönetin.',
    cta: 'Yönet',
    stats: '142 kayıt',
    clr: 'violet',
  },
  {
    icon: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </>
    ),
    title: 'Talep Havuzu',
    desc: 'Müşterilere bağlı açılan talepleri filtreleyin.',
    cta: 'Detaya Git',
    stats: '37 açık talep',
    clr: 'violet',
  },
  {
    icon: (
      <>
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
      </>
    ),
    title: 'Satış Başlat',
    desc: 'Teklif hazırlama ve satış süreci yönetimi.',
    cta: 'Görüntüle',
    stats: '18 aktif',
    clr: 'emerald',
  },
  {
    icon: (
      <>
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </>
    ),
    title: 'Prim Yönetimi',
    desc: 'Satış temsilcisi hak ediş ve ödeme durumları.',
    cta: 'Yönet',
    stats: '12 beklemede',
    clr: 'amber',
  },
  {
    icon: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <polyline points="9 15 11 17 15 13" />
      </>
    ),
    title: 'Sözleşme Takibi',
    desc: 'İmza, teknik şartname ve finans aktarımı süreci.',
    cta: 'Görüntüle',
    stats: '9 işlemde',
    clr: 'sky',
  },
  {
    icon: (
      <>
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </>
    ),
    title: 'Raporlar',
    desc: 'Kazanma oranı, kapanan satışlar ve bekleyen aksiyonlar.',
    cta: 'İncele',
    stats: '%67 başarı',
    clr: 'gray',
  },
];

const SUMMARY_BLOCKS: SummaryBlock[] = [
  {
    title: 'Bekleyen Aksiyonlar',
    items: [
      { label: 'Teklif güncellemesi bekleyen', value: '6', clr: 'orange' },
      { label: 'Müşteri geri dönüşü beklenen', value: '4', clr: 'rose' },
      { label: 'İmza aşamasında', value: '3', clr: 'emerald' },
    ],
  },
  {
    title: 'Kapanışa Yakın Fırsatlar',
    items: [
      { label: 'Bu hafta kapanabilir', value: '8', clr: 'emerald' },
      { label: 'Öncelikli takip', value: '5', clr: 'amber' },
      { label: 'Sıcak müşteri', value: '12', clr: 'rose' },
    ],
  },
  {
    title: 'Teklif Geri Dönüş Bekleyen',
    items: [
      { label: 'Gönderilen teklif', value: '18', clr: 'sky' },
      { label: '7 günden eski', value: '6', clr: 'amber' },
      { label: 'Hatırlatma gerekli', value: '4', clr: 'rose' },
    ],
  },
  {
    title: 'İmza ve Finans Devri',
    items: [
      { label: 'İmza bekleyen', value: '9', clr: 'sky' },
      { label: 'Finansa gönderilecek', value: '2', clr: 'emerald' },
      { label: 'Teknik şartname eksik', value: '1', clr: 'amber' },
    ],
  },
];

const QUICK_PROMPTS = ['Bugün aksiyon gerekenler', 'Kapanışa yakın fırsatlar', 'Teklif bekleyen müşteriler', 'Sıcak leadleri sırala'];

function Icon({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <svg className={`w-3.5 h-3.5 shrink-0 ${className ?? ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      {children}
    </svg>
  );
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </Icon>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </Icon>
  );
}

function SendIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </Icon>
  );
}

function Sparkline({ points, color, gradientId }: { points: number[]; color: string; gradientId: string }) {
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const coords = points.map((value, index) => `${index * (100 / (points.length - 1))},${32 - ((value - min) / range) * 28}`);
  const path = `M${coords.join('L')}`;
  const area = `M${coords.join('L')}L100,36L0,36Z`;

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

function SalesPageStyles() {
  return (
    <style>{`
      @keyframes typing{0%{opacity:.2}40%{opacity:1}80%{opacity:.2}}
      .d1{animation:typing 1.2s infinite;}
      .d2{animation:typing 1.2s infinite;animation-delay:.18s;}
      .d3{animation:typing 1.2s infinite;animation-delay:.36s;}
    `}</style>
  );
}

export default function SatisPanosu() {
  return (
    <>
      <SalesPageStyles />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-violet-100 dark:bg-violet-900/40 rounded-xl flex items-center justify-center shrink-0">
            <Icon className="text-violet-600 dark:text-violet-400 w-5 h-5">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
            </Icon>
          </div>
          <div>
            <h1 className="text-[19px] font-bold text-gray-900 dark:text-gray-100 leading-tight">Satış Panosu</h1>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">Müşteri yönetimi, teklif süreçleri ve satış hedefleri · Phase-1</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button type="button" className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white text-[12px] font-semibold rounded-lg transition-colors">
            <PlusIcon className="text-white" /> Yeni Teklif
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-[#17171a] border border-violet-200 dark:border-violet-800/40 rounded-xl p-5">
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-violet-400/10 rounded-full aig pointer-events-none" />
        <div className="relative">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-9 h-9 bg-violet-600 rounded-xl flex items-center justify-center shrink-0">
              <Icon className="text-white w-4 h-4">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </Icon>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-[13px] font-bold text-gray-900 dark:text-gray-100">Satış AI Yardımcısı</p>
                <div className="flex items-center gap-1">
                  <span className="d1 w-1 h-1 rounded-full bg-violet-500 inline-block" />
                  <span className="d2 w-1 h-1 rounded-full bg-violet-500 inline-block" />
                  <span className="d3 w-1 h-1 rounded-full bg-violet-500 inline-block" />
                </div>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">Fırsat takibi, teklif süreçleri ve kapanış hedefleri</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-2">Bugün Ne Kritik?</p>
              <div className="space-y-1.5">
                <div className="flex items-start gap-2 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/40 rounded-lg px-2.5 py-1.5">
                  <Icon className="text-rose-600 dark:text-rose-400 w-3 h-3 mt-0.5">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </Icon>
                  <p className="text-[11px] text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">6 teklif</span> müşteri yanıtı bekliyor
                  </p>
                </div>
                <div className="flex items-start gap-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/40 rounded-lg px-2.5 py-1.5">
                  <Icon className="text-emerald-600 dark:text-emerald-400 w-3 h-3 mt-0.5">
                    <polyline points="20 6 9 17 4 12" />
                  </Icon>
                  <p className="text-[11px] text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">4 fırsat</span> kapanışa yakın
                  </p>
                </div>
                <div className="flex items-start gap-2 bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800/40 rounded-lg px-2.5 py-1.5">
                  <Icon className="text-sky-600 dark:text-sky-400 w-3 h-3 mt-0.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </Icon>
                  <p className="text-[11px] text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">3 sözleşme</span> imza aşamasında
                  </p>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <p className="text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-2">Önerilen Aksiyonlar</p>
              <div className="space-y-1.5">
                <div className="flex items-start justify-between gap-3 bg-white/70 dark:bg-white/5 rounded-lg px-3 py-2">
                  <div>
                    <p className="text-[12px] font-semibold text-gray-900 dark:text-gray-100">Müşteri geri dönüşlerini hızlandır</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">6 teklif müşteri yanıtı bekliyor, hatırlatma e-postası önerilir.</p>
                  </div>
                  <button type="button" className="shrink-0 px-2.5 py-1 bg-violet-600 hover:bg-violet-700 text-white text-[10px] font-bold rounded-md transition-colors">
                    İncele
                  </button>
                </div>
                <div className="flex items-start justify-between gap-3 bg-white/70 dark:bg-white/5 rounded-lg px-3 py-2">
                  <div>
                    <p className="text-[12px] font-semibold text-gray-900 dark:text-gray-100">Kapanışa yakın fırsatları tamamla</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">4 fırsat yüksek olasılıkla kapanacak, önceliklendir.</p>
                  </div>
                  <button type="button" className="shrink-0 px-2.5 py-1 bg-violet-600 hover:bg-violet-700 text-white text-[10px] font-bold rounded-md transition-colors">
                    Listele
                  </button>
                </div>
                <div className="flex items-start justify-between gap-3 bg-white/70 dark:bg-white/5 rounded-lg px-3 py-2">
                  <div>
                    <p className="text-[12px] font-semibold text-gray-900 dark:text-gray-100">İmza bekleyen sözleşmeleri takip et</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">3 sözleşme imza aşamasında, müşteri aramayı unutma.</p>
                  </div>
                  <button type="button" className="shrink-0 px-2.5 py-1 bg-violet-600 hover:bg-violet-700 text-white text-[10px] font-bold rounded-md transition-colors">
                    Görüntüle
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2 border-t border-violet-200/60 dark:border-violet-800/30 pt-3">
            <input
              type="text"
              placeholder="AI yardımcıya sor... Örn: Bu hafta kapanması muhtemel fırsatları listele"
              className="flex-1 px-3 py-1.5 text-[12px] bg-white/70 dark:bg-white/5 border border-violet-200/70 dark:border-violet-800/50 rounded-lg focus:outline-none focus:border-violet-500 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600"
            />
            <button type="button" className="px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors">
              <SendIcon className="text-white" />
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                className="px-2.5 py-1 text-[10px] font-medium bg-white/60 dark:bg-white/5 border border-violet-200/50 dark:border-violet-800/40 text-violet-700 dark:text-violet-300 rounded-md hover:bg-violet-50 dark:hover:bg-violet-900/30 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {KPIS.map((kpi) => (
          <div key={kpi.label} className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-4 hover:shadow-md dark:hover:border-gray-700 transition-all">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium leading-tight">{kpi.label}</p>
              <span
                className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                  kpi.up ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' : 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                }`}
              >
                {kpi.sub}
              </span>
            </div>
            <div className="text-[22px] font-bold text-gray-900 dark:text-gray-100 leading-none mb-0.5">{kpi.v}</div>
            <Sparkline points={kpi.d} color={kpi.c} gradientId={`sales-kpi-${kpi.label.replace(/\s+/g, '-').toLowerCase()}`} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MANAGEMENT_CARDS.map((card) => {
          const mc = MANAGEMENT_COLOR_MAP[card.clr] || MANAGEMENT_COLOR_MAP.gray;
          return (
            <div
              key={card.title}
              className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-5 hover:shadow-md dark:hover:border-gray-700 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 ${mc.bg} rounded-xl flex items-center justify-center shrink-0`}>
                  <Icon className={`${mc.t} w-5 h-5`}>{card.icon}</Icon>
                </div>
                <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-600">{card.stats}</span>
              </div>
              <h3 className="text-[14px] font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">{card.title}</h3>
              <p className="text-[12px] text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">{card.desc}</p>
              <button type="button" className={`w-full flex items-center justify-center gap-2 px-4 py-2 ${mc.btn} text-white rounded-lg transition-colors text-[12px] font-semibold`}>
                <span>{card.cta}</span>
                <ArrowIcon className="text-white w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {SUMMARY_BLOCKS.map((block) => (
          <div key={block.title} className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-5">
            <h3 className="text-[12px] font-bold text-gray-900 dark:text-gray-100 mb-4">{block.title}</h3>
            <div className="space-y-3">
              {block.items.map((item) => {
                const cm = item.clr === 'orange' ? CM.gray : CM[item.clr] || CM.gray;
                return (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-[11px] text-gray-600 dark:text-gray-400 leading-snug flex-1 mr-2">{item.label}</span>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg shrink-0 ${cm.bg} ${cm.t}`}>{item.value}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
