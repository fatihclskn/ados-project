import { type ReactNode, useState } from 'react';

type ColorName = 'emerald' | 'amber' | 'rose' | 'sky' | 'violet' | 'indigo' | 'teal' | 'gray';

type Kpi = {
  l: string;
  v: string;
  s: string;
  tr: string;
  up: number;
  clr: string;
  d: number[];
  t: 'line' | 'bar';
};

type ModuleCard = {
  l: string;
  s: string;
  id: string;
  ic: ColorName;
  svg: ReactNode;
  rows: Array<[string, string, ColorName]>;
};

type ModalType = 'customer' | 'lead' | null;
type CustomerTab = 's' | 'b';

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

const P = {
  send: (
    <>
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </>
  ),
  plus: (
    <>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </>
  ),
  alert: (
    <>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </>
  ),
  chk: <polyline points="20 6 9 17 4 12" />,
  arr: (
    <>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </>
  ),
  db: (
    <>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </>
  ),
  file: (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </>
  ),
  contract: (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </>
  ),
  money: (
    <>
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </>
  ),
  newsletter: (
    <>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </>
  ),
};

const KPIS: Kpi[] = [
  { l: 'Yeni Talepler', v: '24', s: 'Son 7 gün', tr: '+12%', up: 1, clr: '#8b5cf6', d: [10, 14, 12, 18, 15, 20, 24], t: 'line' },
  { l: 'Veri Sorunlu', v: '8', s: 'Eksik alan var', tr: '−3', up: 1, clr: '#f59e0b', d: [14, 12, 11, 10, 9, 9, 8], t: 'bar' },
  { l: 'Aktif Kampanya', v: '5', s: 'Bu ay yayında', tr: '+2', up: 1, clr: '#06b6d4', d: [2, 2, 3, 3, 4, 4, 5], t: 'bar' },
  { l: 'Satışa Hazır', v: '15', s: 'Aktarım bekliyor', tr: '+5', up: 1, clr: '#10b981', d: [8, 9, 10, 11, 12, 13, 15], t: 'line' },
  { l: 'E-Bülten Listesi', v: '1.2K', s: 'Aktif kayıt', tr: '+8%', up: 1, clr: '#6366f1', d: [900, 980, 1040, 1090, 1120, 1160, 1200], t: 'line' },
];

const MODS: ModuleCard[] = [
  { l: 'Talep Havuzu', s: 'Gelen talepler', id: 'leads', ic: 'sky', svg: P.file, rows: [['Yeni Talepler', '8', 'gray'], ["Sıcak Lead'ler", '4', 'rose'], ['Satışa Hazır', '15', 'emerald']] },
  { l: 'Müşteri Datası', s: 'Veri kalitesi', id: 'datacontrol', ic: 'violet', svg: P.db, rows: [['Veri Sorunlu', '27', 'rose'], ['Doğrulanmış', '218', 'emerald'], ['Bülten Uygun', '142', 'gray']] },
  { l: 'E-Bülten & Listeler', s: 'Liste & gönderim', id: 'newsletter', ic: 'indigo', svg: P.newsletter, rows: [['Hazır Segment', '1.245', 'emerald'], ['İzin Eksik', '47', 'amber'], ['Bu Ay Gönderilen', '2', 'gray']] },
  { l: 'Satışa Aktarım', s: 'Handoff durumu', id: 'handoff', ic: 'emerald', svg: P.send, rows: [['Bugün Aktarılan', '4', 'emerald'], ['Geri Bildirim Bekl.', '7', 'amber'], ['Pazarlamaya Dönen', '2', 'rose']] },
  { l: 'Sözleşme Takibi', s: 'Aktif sözleşmeler', id: 'contract', ic: 'sky', svg: P.contract, rows: [['Onay Bekleyen', '8', 'amber'], ['İmza Bekleniyor', '7', 'violet'], ['Finansa Aktarıldı', '9', 'emerald']] },
  { l: 'Prim Yönetimi', s: 'Bu ay hak edişler', id: 'commission', ic: 'amber', svg: P.money, rows: [['Toplam Yük', '₺31.8K', 'gray'], ['Ödenen', '₺17.9K', 'emerald'], ['Bekleyen', '₺13.8K', 'amber']] },
];

const QUICK_QUESTIONS = ['Veri sorunlarını göster', 'Yeni talepleri sırala', "Satışa hazır lead'ler", 'Bülten listelerini kontrol et'];
const SVCS = ['SEO', 'Web Sitesi', 'Google Ads', 'Meta Reklam', 'Sosyal Medya', 'E-Bülten', 'Domain', 'Prodüksiyon', 'Hosting', 'Marka Tescili'];
const RECENT_CUSTOMERS = [
  ['Teknosoft A.Ş.', 'Aktif Müşteri · SEO'],
  ['Dijital Medya Ltd.', 'Aktif Müşteri · Google Ads'],
  ['E-ticaret Pro', 'Potansiyel · Web Sitesi'],
];

function Icon({ children, className = 'w-3.5 h-3.5 shrink-0' }: { children: ReactNode; className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
  const gradientId = `g-${color.replace('#', '')}-${points.length}`;

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

function Bar({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(...values);

  return (
    <div className="flex items-end gap-0.5 h-9">
      {values.map((value, index) => (
        <div key={`${value}-${index}`} className="flex-1 rounded-sm" style={{ height: `${Math.max(8, Math.round((value / max) * 100))}%`, background: color, opacity: 0.65 }} />
      ))}
    </div>
  );
}

function Bdg({ children, color }: { children: ReactNode; color: ColorName }) {
  const tone = CM[color] || CM.gray;
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${tone.bg} ${tone.t} whitespace-nowrap`}>{children}</span>;
}

export default function GenelBakis() {
  const [modal, setModal] = useState<ModalType>(null);
  const [customerTab, setCustomerTab] = useState<CustomerTab>('s');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedLeadServices, setSelectedLeadServices] = useState<string[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState('Teknosoft A.Ş.');
  const [assistantPrompt, setAssistantPrompt] = useState('');
  const [assistantAnswer, setAssistantAnswer] = useState('');
  const [activeModule, setActiveModule] = useState<ModuleCard | null>(null);

  function toggleService(service: string) {
    setSelectedServices((current) => (current.includes(service) ? current.filter((item) => item !== service) : [...current, service]));
  }

  function toggleLeadService(service: string) {
    setSelectedLeadServices((current) => (current.includes(service) ? current.filter((item) => item !== service) : [...current, service]));
  }

  function askAssistant(text = assistantPrompt) {
    if (!text.trim()) return;
    setAssistantPrompt(text);
    setAssistantAnswer(`AI notu: "${text}" için ilgili pazarlama aksiyonları Genel Bakış üzerindeki kartlarda işaretlendi.`);
  }

  function openModule(module: ModuleCard) {
    setActiveModule(module);
  }

  return (
    <div className="relative space-y-5 md:space-y-6">
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
            <h1 className="text-[19px] font-bold text-gray-900 dark:text-gray-100 leading-tight">Pazarlama Panosu</h1>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">Talep yönetimi, müşteri datası ve satış aktarım akışı · Phase-1</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => setModal('customer')} className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white text-[12px] font-semibold rounded-lg transition-colors"><Icon>{P.plus}</Icon> Yeni Müşteri</button>
          <button onClick={() => setModal('lead')} className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-[12px] font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"><Icon>{P.plus}</Icon> Yeni Talep</button>
          <button onClick={() => openModule(MODS[3])} className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-[12px] font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"><Icon>{P.send}</Icon> Satışa Aktar</button>
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
                <p className="text-[13px] font-bold text-gray-900 dark:text-gray-100">Pazarlama AI Yardımcısı</p>
                <div className="flex items-center gap-1"><span className="d1 w-1 h-1 rounded-full bg-violet-500 inline-block" /><span className="d2 w-1 h-1 rounded-full bg-violet-500 inline-block" /><span className="d3 w-1 h-1 rounded-full bg-violet-500 inline-block" /></div>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">Talep akışı, veri kalitesi ve kampanya süreç kontrolü</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-2">Bugün Ne Kritik?</p>
              <div className="space-y-1.5">
                <div className="flex items-start gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 rounded-lg px-2.5 py-1.5"><Icon className="text-amber-600 dark:text-amber-400 w-3 h-3 mt-0.5">{P.alert}</Icon><p className="text-[11px] text-gray-700 dark:text-gray-300"><span className="font-semibold">8 kayıt</span> veri kontrol bekliyor</p></div>
                <div className="flex items-start gap-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/40 rounded-lg px-2.5 py-1.5"><Icon className="text-emerald-600 dark:text-emerald-400 w-3 h-3 mt-0.5">{P.chk}</Icon><p className="text-[11px] text-gray-700 dark:text-gray-300"><span className="font-semibold">15 lead</span> satışa aktarılmayı bekliyor</p></div>
                <div className="flex items-start gap-2 bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800/40 rounded-lg px-2.5 py-1.5"><Icon className="text-sky-600 dark:text-sky-400 w-3 h-3 mt-0.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></Icon><p className="text-[11px] text-gray-700 dark:text-gray-300"><span className="font-semibold">5 kampanya</span> aktif şu anda</p></div>
              </div>
            </div>
            <div className="md:col-span-2">
              <p className="text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-2">Önerilen Aksiyonlar</p>
              <div className="space-y-1.5">
                <ActionRow title="Veri sorunlarını gider" desc="8 kayıt eksik veri veya segment sorunu bekliyor." button="Kontrol Et" onClick={() => openModule(MODS[1])} />
                <ActionRow title="Hazır lead'leri satışa aktar" desc="15 doğrulanmış lead satış ekibine yönlendirilmeyi bekliyor." button="Aktar" onClick={() => openModule(MODS[3])} />
                <ActionRow title="Kampanya performansını gözden geçir" desc="Google Ads kampanyası hedefin %90'ına ulaşmış." button="Görüntüle" onClick={() => askAssistant('Kampanya performansını gözden geçir')} />
              </div>
            </div>
          </div>
          <div className="flex gap-2 border-t border-violet-200/60 dark:border-violet-800/30 pt-3">
            <input value={assistantPrompt} onChange={(event) => setAssistantPrompt(event.target.value)} type="text" placeholder="AI yardımcıya sor... Örn: Bugün satışa hazır lead'leri sırala" className="flex-1 px-3 py-1.5 text-[12px] bg-white/70 dark:bg-white/5 border border-violet-200/70 dark:border-violet-800/50 rounded-lg focus:outline-none focus:border-violet-500 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600" />
            <button onClick={() => askAssistant()} className="px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors"><Icon className="text-white">{P.send}</Icon></button>
          </div>
          {assistantAnswer ? <div className="mt-2 px-3 py-2 bg-white/70 dark:bg-white/5 border border-violet-200/50 dark:border-violet-800/40 rounded-lg text-[11px] text-violet-700 dark:text-violet-300">{assistantAnswer}</div> : null}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {QUICK_QUESTIONS.map((question) => <button key={question} onClick={() => askAssistant(question)} className="px-2.5 py-1 text-[10px] font-medium bg-white/60 dark:bg-white/5 border border-violet-200/50 dark:border-violet-800/40 text-violet-700 dark:text-violet-300 rounded-md hover:bg-violet-50 dark:hover:bg-violet-900/30 transition-colors">{question}</button>)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {KPIS.map((kpi) => (
          <div key={kpi.l} className="bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-800 rounded-xl p-4 hover:shadow-md dark:hover:border-gray-700 transition-all">
            <div className="flex items-start justify-between mb-2">
              <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium leading-tight">{kpi.l}</p>
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${kpi.up ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' : 'bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300'}`}>{kpi.tr}</span>
            </div>
            <div className="text-[26px] font-bold text-gray-900 dark:text-gray-100 leading-none mb-0.5">{kpi.v}</div>
            <p className="text-[10px] text-gray-400 dark:text-gray-600 mb-3">{kpi.s}</p>
            {kpi.t === 'line' ? <Spark points={kpi.d} color={kpi.clr} /> : <Bar values={kpi.d} color={kpi.clr} />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {MODS.map((module) => {
          const tone = CM[module.ic] || CM.gray;
          return (
            <div key={module.id} onClick={() => openModule(module)} className="bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-800 rounded-xl p-4 hover:shadow-md dark:hover:border-gray-700 transition-all cursor-pointer">
              <div className="flex items-start gap-2.5 mb-3">
                <div className={`w-8 h-8 ${tone.bg} rounded-lg flex items-center justify-center shrink-0`}><Icon className={`${tone.t}`}>{module.svg}</Icon></div>
                <div><p className="text-[13px] font-bold text-gray-900 dark:text-gray-100">{module.l}</p><p className="text-[10px] text-gray-400 dark:text-gray-600">{module.s}</p></div>
              </div>
              <div className="space-y-2 mb-3">
                {module.rows.map(([label, value, color]) => (
                  <div key={`${module.id}-${label}`} className="flex items-center justify-between"><span className="text-[11px] text-gray-600 dark:text-gray-400">{label}</span><span className={`text-[13px] font-bold ${CM[color].t}`}>{value}</span></div>
                ))}
              </div>
              <button onClick={(event) => { event.stopPropagation(); openModule(module); }} className="w-full flex items-center justify-center gap-1.5 py-1.5 text-[11px] font-semibold text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-lg transition-colors border border-violet-200 dark:border-violet-800/40"><Icon className="w-3.5 h-3.5 shrink-0 text-violet-600 dark:text-violet-400">{P.arr}</Icon> Detaya Git</button>
            </div>
          );
        })}
      </div>

      {activeModule ? <ModuleDetailPanel module={activeModule} onClose={() => setActiveModule(null)} /> : null}
      {modal === 'customer' ? (
        <CustomerModal
          customerTab={customerTab}
          selectedServices={selectedServices}
          onClose={() => setModal(null)}
          onTabChange={setCustomerTab}
          onToggleService={toggleService}
        />
      ) : null}
      {modal === 'lead' ? (
        <LeadModal
          selectedCustomer={selectedCustomer}
          selectedLeadServices={selectedLeadServices}
          onClose={() => setModal(null)}
          onSelectCustomer={setSelectedCustomer}
          onToggleService={toggleLeadService}
        />
      ) : null}
    </div>
  );
}

function ActionRow({ title, desc, button, onClick }: { title: string; desc: string; button: string; onClick: () => void }) {
  return (
    <div className="flex items-start justify-between gap-3 bg-white/70 dark:bg-white/5 rounded-lg px-3 py-2">
      <div><p className="text-[12px] font-semibold text-gray-900 dark:text-gray-100">{title}</p><p className="text-[10px] text-gray-500 dark:text-gray-400">{desc}</p></div>
      <button onClick={onClick} className="shrink-0 px-2.5 py-1 bg-violet-600 hover:bg-violet-700 text-white text-[10px] font-bold rounded-md transition-colors">{button}</button>
    </div>
  );
}

function ModuleDetailPanel({ module, onClose }: { module: ModuleCard; onClose: () => void }) {
  return (
    <div className="relative z-10 bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-xl">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 ${CM[module.ic].bg} rounded-xl flex items-center justify-center shrink-0`}><Icon className={`${CM[module.ic].t} w-5 h-5`}>{module.svg}</Icon></div>
          <div><h2 className="text-[14px] font-bold text-gray-900 dark:text-gray-100">{module.l}</h2><p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{module.s}</p></div>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"><Icon className="w-4 h-4 text-gray-500"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Icon></button>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {module.rows.map(([label, value, color]) => (
            <div key={label} className="bg-gray-50 dark:bg-[#0a0a0c] border border-gray-100 dark:border-gray-800 rounded-xl p-4">
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-1">{label}</p>
              <p className={`text-[19px] font-bold ${CM[color].t} leading-none`}>{value}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-violet-50 dark:bg-violet-900/30 rounded-2xl flex items-center justify-center mb-4">
            <Icon className="w-8 h-8 text-violet-400 dark:text-violet-500"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></Icon>
          </div>
          <h2 className="text-[16px] font-bold text-gray-900 dark:text-gray-100 mb-1">{module.id}</h2>
          <p className="text-[12px] text-gray-500 dark:text-gray-400">Genel Bakış ve Müşteri Data Kontrol aktif. Onayınız ile bu ekran da hazırlanacak.</p>
        </div>
      </div>
    </div>
  );
}

function CustomerModal({ customerTab, selectedServices, onClose, onTabChange, onToggleService }: { customerTab: CustomerTab; selectedServices: string[]; onClose: () => void; onTabChange: (tab: CustomerTab) => void; onToggleService: (service: string) => void }) {
  return (
    <div id="mC" className="absolute inset-x-0 top-0 z-30 flex items-start justify-center p-4 bg-black/30 rounded-xl">
      <div className="bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[88vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-800">
          <div><h2 className="text-[14px] font-bold text-gray-900 dark:text-gray-100">Yeni Müşteri Ekle</h2><p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Pazarlama kullanımı için müşteri kaydı oluşturun.</p></div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"><Icon className="w-4 h-4 text-gray-500"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Icon></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="flex border-b border-gray-200 dark:border-gray-800 -mt-1 mb-2">
            <button onClick={() => onTabChange('s')} id="ct-s" className={`px-4 py-2 text-[12px] font-semibold border-b-2 ${customerTab === 's' ? 'border-violet-600 text-violet-600' : 'border-transparent text-gray-500 dark:text-gray-400'}`}>Tekil Müşteri</button>
            <button onClick={() => onTabChange('b')} id="ct-b" className={`px-4 py-2 text-[12px] font-semibold border-b-2 ${customerTab === 'b' ? 'border-violet-600 text-violet-600' : 'border-transparent text-gray-500 dark:text-gray-400'}`}>Excel ile Toplu</button>
          </div>
          {customerTab === 's' ? <CustomerSingleForm selectedServices={selectedServices} onToggleService={onToggleService} /> : <CustomerBulkForm />}
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-200 dark:border-gray-800 bg-gray-50/70 dark:bg-[#0a0a0c]/50">
          <button onClick={onClose} className="px-3 py-1.5 text-[12px] font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">İptal</button>
          <div className="flex gap-2"><button className="px-3 py-1.5 text-[12px] font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50">Taslak Kaydet</button><button onClick={onClose} className="px-4 py-1.5 text-[12px] font-bold text-white bg-violet-600 rounded-lg hover:bg-violet-700">Kaydı Oluştur</button></div>
        </div>
      </div>
    </div>
  );
}

function CustomerSingleForm({ selectedServices, onToggleService }: { selectedServices: string[]; onToggleService: (service: string) => void }) {
  return (
    <div id="cf-s" className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Marka / Firma Adı" required><input type="text" placeholder="Örn: Teknosoft A.Ş." className="w-full px-3 py-2 text-[13px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0a0a0c] rounded-lg focus:outline-none focus:border-violet-500 text-gray-900 dark:text-gray-100 placeholder-gray-400" /></Field>
        <Field label="Resmi Ünvan"><input type="text" placeholder="Teknosoft Bilişim A.Ş." className="w-full px-3 py-2 text-[13px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0a0a0c] rounded-lg focus:outline-none focus:border-violet-500 text-gray-900 dark:text-gray-100 placeholder-gray-400" /></Field>
        <Field label="Müşteri Türü" required><Select options={['Seçiniz', 'Aktif Müşteri', 'Potansiyel Müşteri', 'Pasif Müşteri', 'Yeniden Pazarlama']} /></Field>
        <Field label="Kaynak" required><Select options={['Seçiniz', 'Web Sitesi', 'Google Ads', 'Meta Reklam', 'Referans', 'Telefon', 'Organik', 'E-Bülten']} /></Field>
        <Field label="Segment"><Select options={['Seçiniz', 'KOBİ', 'Kurumsal', 'E-Ticaret', 'Sağlık', 'Eğitim', 'Teknik Hizmet', 'Diğer']} /></Field>
        <Field label="E-Bülten İzni"><Select options={['Seçiniz', 'Var', 'Yok', 'Kontrol Edilecek']} /></Field>
        <div className="md:col-span-2">
          <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-2">Hizmetler <span className="text-rose-500">*</span></label>
          <div className="flex flex-wrap gap-1.5">SEO Web Sitesi Google Ads Meta Reklam Sosyal Medya E-Bülten Domain Marka Tescili Kurumsal Kimlik Prodüksiyon</div>
          <div className="flex flex-wrap gap-1.5 mt-1" id="svcs">
            {SVCS.map((service) => {
              const active = selectedServices.includes(service);
              return <button key={service} type="button" onClick={() => onToggleService(service)} className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors ${active ? 'bg-violet-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>{service}</button>;
            })}
          </div>
        </div>
      </div>
      <div className="border-t border-gray-100 dark:border-gray-800 pt-4"><p className="text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-3">1. Yetkili <span className="text-rose-500">*</span></p><div className="grid grid-cols-2 gap-3"><MiniInput label="Ad Soyad" placeholder="Mehmet Yılmaz" /><MiniInput label="Ünvan" placeholder="Genel Müdür" /><MiniInput label="Telefon" placeholder="0555 123 45 67" type="tel" /><MiniInput label="E-posta" placeholder="m@firma.com" type="email" /></div></div>
      <div><label className="block text-[11px] font-medium text-gray-700 dark:text-gray-300 mb-1">Not</label><textarea rows={2} placeholder="İlk görüşme özeti..." className="w-full px-3 py-2 text-[12px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0a0a0c] rounded-lg focus:outline-none focus:border-violet-500 text-gray-900 dark:text-gray-100 placeholder-gray-400 resize-none" /></div>
    </div>
  );
}

function CustomerBulkForm() {
  return <div id="cf-b" className="text-center py-8"><div className="w-16 h-16 bg-violet-50 dark:bg-violet-900/30 rounded-2xl flex items-center justify-center mx-auto mb-3"><Icon className="w-8 h-8 text-violet-600 dark:text-violet-400"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></Icon></div><p className="text-[14px] font-semibold text-gray-900 dark:text-gray-100 mb-1">Excel Dosyası Yükle</p><p className="text-[12px] text-gray-500 dark:text-gray-400 mb-4">20 sütunlu şablona uygun .xlsx dosyası yükleyin</p><label className="cursor-pointer inline-block"><span className="px-4 py-2 bg-violet-600 text-white text-[12px] font-semibold rounded-lg hover:bg-violet-700">Dosya Seç (.xlsx)</span><input type="file" className="hidden" accept=".xlsx,.xls" /></label><div className="mt-3"><button className="text-[12px] text-violet-600 dark:text-violet-400 underline">Örnek şablonu indir</button></div></div>;
}

function LeadModal({ selectedCustomer, selectedLeadServices, onClose, onSelectCustomer, onToggleService }: { selectedCustomer: string; selectedLeadServices: string[]; onClose: () => void; onSelectCustomer: (customer: string) => void; onToggleService: (service: string) => void }) {
  return (
    <div id="mL" className="absolute inset-x-0 top-0 z-30 flex items-start justify-center p-4 bg-black/30 rounded-xl">
      <div className="bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl w-full max-w-xl max-h-[88vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-800">
          <div><h2 className="text-[14px] font-bold text-gray-900 dark:text-gray-100">Yeni Talep Ekle</h2><p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Kayıtlı müşteriye talep açın.</p></div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"><Icon className="w-4 h-4 text-gray-500"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Icon></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div><label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">Müşteri Seç <span className="text-rose-500">*</span></label>
            <div className="relative mb-1.5"><Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></Icon><input type="text" value={selectedCustomer} onChange={(event) => onSelectCustomer(event.target.value)} placeholder="Firma adı ara..." className="w-full pl-9 pr-4 py-2 text-[13px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0a0a0c] rounded-lg focus:outline-none focus:border-violet-500 text-gray-900 dark:text-gray-100 placeholder-gray-400" /></div>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"><div className="px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700"><p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Son Kullanılanlar</p></div>
              {RECENT_CUSTOMERS.map(([name, desc], index) => <button key={name} type="button" onClick={() => onSelectCustomer(name)} className={`w-full px-3 py-2 text-left hover:bg-violet-50 dark:hover:bg-violet-900/20 ${index < RECENT_CUSTOMERS.length - 1 ? 'border-b border-gray-100 dark:border-gray-800' : ''} transition-colors`}><p className="text-[12px] font-medium text-gray-900 dark:text-gray-100">{name}</p><p className="text-[10px] text-gray-400 dark:text-gray-500">{desc}</p></button>)}
            </div>
          </div>
          <Field label="Talep Başlığı" required><input type="text" placeholder="Örn: SEO teklif talebi, Web sitesi yenileme" className="w-full px-3 py-2 text-[13px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0a0a0c] rounded-lg focus:outline-none focus:border-violet-500 text-gray-900 dark:text-gray-100 placeholder-gray-400" /></Field>
          <div><label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-2">Hizmetler <span className="text-rose-500">*</span></label><div className="grid grid-cols-3 gap-1.5" id="lsvcs">{SVCS.map((service) => <label key={service} className="flex items-center gap-1.5 px-2.5 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"><input checked={selectedLeadServices.includes(service)} onChange={() => onToggleService(service)} type="checkbox" className="w-3.5 h-3.5 text-violet-600 rounded" /><span className="text-[11px] text-gray-700 dark:text-gray-300">{service}</span></label>)}</div></div>
          <div className="grid grid-cols-2 gap-4"><Field label="Talep Kaynağı" required><Select options={['Web Sitesi', 'Google Ads', 'Meta Reklam', 'Referans', 'Telefon', 'WhatsApp', 'E-Bülten']} /></Field><Field label="Öncelik"><Select options={['Düşük', 'Orta', 'Yüksek']} defaultValue="Yüksek" /></Field></div>
          <div><label className="block text-[11px] font-medium text-gray-700 dark:text-gray-300 mb-1">Talep Açıklaması</label><textarea rows={2} placeholder="Müşteri ihtiyacı özeti..." className="w-full px-3 py-2 text-[12px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0a0a0c] rounded-lg focus:outline-none focus:border-violet-500 text-gray-900 dark:text-gray-100 placeholder-gray-400 resize-none" /></div>
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-200 dark:border-gray-800 bg-gray-50/70 dark:bg-[#0a0a0c]/50">
          <button onClick={onClose} className="px-3 py-1.5 text-[12px] font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">İptal</button>
          <div className="flex gap-2"><button className="px-3 py-1.5 text-[12px] font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50">Taslak</button><button onClick={onClose} className="px-4 py-1.5 text-[12px] font-bold text-white bg-violet-600 rounded-lg hover:bg-violet-700">Talebi Oluştur</button></div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, required = false, children }: { label: string; required?: boolean; children: ReactNode }) {
  return <div><label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">{label} {required ? <span className="text-rose-500">*</span> : null}</label>{children}</div>;
}

function Select({ options, defaultValue }: { options: string[]; defaultValue?: string }) {
  return <select defaultValue={defaultValue} className="w-full px-3 py-2 text-[13px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0a0a0c] rounded-lg focus:outline-none focus:border-violet-500 text-gray-900 dark:text-gray-100">{options.map((option) => <option key={option}>{option}</option>)}</select>;
}

function MiniInput({ label, placeholder, type = 'text' }: { label: string; placeholder: string; type?: string }) {
  return <div><label className="block text-[10px] font-medium text-gray-500 dark:text-gray-500 mb-1">{label}</label><input type={type} placeholder={placeholder} className="w-full px-3 py-2 text-[12px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0a0a0c] rounded-lg focus:outline-none focus:border-violet-500 text-gray-900 dark:text-gray-100 placeholder-gray-400" /></div>;
}
