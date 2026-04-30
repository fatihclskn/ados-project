import { type ReactNode, useMemo, useState } from 'react';

type ColorName = 'emerald' | 'amber' | 'rose' | 'sky' | 'violet' | 'indigo' | 'teal' | 'gray';
type NewsletterTab = 'overview' | 'segments' | 'campaigns' | 'remarketing';

type Segment = {
  id: number;
  name: string;
  desc: string;
  total: number;
  permitted: number;
  noperm: number;
  source: string;
  lastSent: string;
  lastOpen: number;
  lastClick: number;
  tags: string[];
  status: string;
  stClr: ColorName;
  trend: number[];
};

type Campaign = {
  id: number;
  title: string;
  segment: string;
  segClr: ColorName;
  status: string;
  stClr: ColorName;
  sentDate: string;
  sentTime: string;
  totalSent: number;
  opened: number;
  clicked: number;
  unsubscribed: number;
  subject: string;
  aiScore: number;
};

type RemarketingCustomer = {
  co: string;
  contact: string;
  lastSvc: string;
  lastDate: string;
  value: string;
  status: string;
  stClr: ColorName;
  aiSugg: string;
  score: number;
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

const P = {
  plus: (
    <>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </>
  ),
  send: (
    <>
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </>
  ),
  db: (
    <>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </>
  ),
  newsletter: (
    <>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </>
  ),
  alert: (
    <>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </>
  ),
  edit: (
    <>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </>
  ),
  star: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />,
  ai: (
    <>
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </>
  ),
  undo: (
    <>
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 .49-4.01" />
    </>
  ),
};

const SEGMENTS: Segment[] = [
  { id: 1, name: 'Aktif Müşteriler', desc: 'Hizmet alan ve aktif kayıtlı müşteriler', total: 156, permitted: 142, noperm: 14, source: 'Müşteri Data Kontrol', lastSent: '18 Nis 2026', lastOpen: 64.2, lastClick: 12.8, tags: ['SEO', 'Web Sitesi', 'Google Ads', 'E-Bülten'], status: 'Hazır', stClr: 'emerald', trend: [48, 52, 58, 61, 63, 65, 64] },
  { id: 2, name: 'Potansiyel Müşteriler', desc: 'Görüşme yapılmış, henüz kapanmamış fırsatlar', total: 48, permitted: 31, noperm: 17, source: 'Talep Havuzu', lastSent: '10 Nis 2026', lastOpen: 41.5, lastClick: 8.3, tags: ['Web Sitesi', 'SEO'], status: 'Hazır', stClr: 'emerald', trend: [35, 38, 40, 40, 42, 41, 42] },
  { id: 3, name: 'Yeniden Pazarlama', desc: '6+ aydır hizmet almayan pasif müşteriler', total: 44, permitted: 38, noperm: 6, source: 'Müşteri Data Kontrol', lastSent: '02 Nis 2026', lastOpen: 28.7, lastClick: 5.1, tags: ['Re-Marketing', 'Aktivasyon'], status: 'İzin Güncelle', stClr: 'amber', trend: [30, 28, 29, 27, 29, 28, 29] },
  { id: 4, name: 'E-Ticaret Segmenti', desc: 'E-ticaret hizmeti alan veya isteyen kayıtlar', total: 38, permitted: 35, noperm: 3, source: 'Segment Etiketi', lastSent: '15 Nis 2026', lastOpen: 58.3, lastClick: 14.2, tags: ['E-Ticaret', 'Google Ads', 'Meta'], status: 'Hazır', stClr: 'emerald', trend: [50, 54, 57, 56, 58, 58, 58] },
  { id: 5, name: 'Kurumsal Segment', desc: 'Kurumsal kimlik ve büyük ölçekli hizmet alanlar', total: 29, permitted: 29, noperm: 0, source: 'Segment Etiketi', lastSent: '20 Nis 2026', lastOpen: 71.4, lastClick: 18.9, tags: ['Kurumsal', 'Prodüksiyon'], status: 'Hazır', stClr: 'emerald', trend: [62, 65, 68, 70, 71, 72, 71] },
  { id: 6, name: 'İzin Bekleyenler', desc: 'E-bülten izni eksik veya yenilenmesi gereken kayıtlar', total: 47, permitted: 0, noperm: 47, source: 'Otomatik Tarama', lastSent: '—', lastOpen: 0, lastClick: 0, tags: ['İzin Gerekli'], status: 'İzin Gerekli', stClr: 'rose', trend: [0, 0, 0, 0, 0, 0, 0] },
];

const CAMPAIGNS: Campaign[] = [
  { id: 1, title: 'Bahar Kampanyası 2026 — Dijital Görünürlük Paketi', segment: 'Yeniden Pazarlama', segClr: 'amber', status: 'Gönderildi', stClr: 'emerald', sentDate: '18 Nis 2026', sentTime: '09:00', totalSent: 38, opened: 28, clicked: 12, unsubscribed: 1, subject: 'Dijital görünürlüğünüzü güçlendirin — Özel Bahar Teklifi', aiScore: 87 },
  { id: 2, title: 'SEO Farkındalık Serisi #3 — Teknik SEO Rehberi', segment: 'Aktif Müşteriler', segClr: 'emerald', status: 'Gönderildi', stClr: 'emerald', sentDate: '15 Nis 2026', sentTime: '10:30', totalSent: 142, opened: 91, clicked: 18, unsubscribed: 0, subject: 'Sitenizin teknik SEO skoru nasıl?', aiScore: 92 },
  { id: 3, title: 'E-Ticaret Büyüme Paketi Tanıtımı', segment: 'E-Ticaret Segmenti', segClr: 'indigo', status: 'Planlandı', stClr: 'sky', sentDate: '25 Nis 2026', sentTime: '09:00', totalSent: 0, opened: 0, clicked: 0, unsubscribed: 0, subject: 'E-ticaret satışlarınızı %40 artırmanın yolu', aiScore: 78 },
  { id: 4, title: 'Kurumsal Kimlik & Marka Rehberi 2026', segment: 'Kurumsal Segment', segClr: 'violet', status: 'Taslak', stClr: 'gray', sentDate: '—', sentTime: '—', totalSent: 0, opened: 0, clicked: 0, unsubscribed: 0, subject: 'Taslak hazırlanıyor...', aiScore: 65 },
  { id: 5, title: 'Potansiyel Müşteri Aktivasyon — Özel Teklif', segment: 'Potansiyel Müşteriler', segClr: 'sky', status: 'Planlandı', stClr: 'sky', sentDate: '28 Nis 2026', sentTime: '11:00', totalSent: 0, opened: 0, clicked: 0, unsubscribed: 0, subject: 'Arma Digital ile tanışın — İlk ay %20 indirimli', aiScore: 83 },
];

const REMARKETING: RemarketingCustomer[] = [
  { co: 'Sürdürülebilir Enerji A.Ş.', contact: 'Kemal Arslan', lastSvc: 'Web Sitesi', lastDate: '6 ay önce', value: '₺18.500', status: 'Soğuk', stClr: 'gray', aiSugg: 'Web sitesi yenileme teklifi hazırla. Rakip analizi ekle.', score: 34 },
  { co: 'Oto Bakım Merkezi', contact: 'Ali Yıldırım', lastSvc: 'Google Ads', lastDate: '8 ay önce', value: '₺12.000', status: 'Re-Marketing', stClr: 'amber', aiSugg: 'Google Ads + Instagram kombinasyonu öner. Sezon kampanyası.', score: 61 },
  { co: 'Elektronik Ticaret A.Ş.', contact: 'Hasan Kaya', lastSvc: 'E-Bülten', lastDate: '5 ay önce', value: '₺8.200', status: 'Soğuk', stClr: 'gray', aiSugg: 'E-ticaret SEO paketi ile geri çek. Başarı hikayesi paylaş.', score: 29 },
  { co: 'Eğitim Platform A.Ş.', contact: 'Deniz Kaya', lastSvc: 'Sosyal Medya', lastDate: '7 ay önce', value: '₺22.000', status: 'Re-Marketing', stClr: 'amber', aiSugg: 'Yeni dönem için içerik takvimi teklifi oluştur.', score: 55 },
  { co: 'Plastik Teknolojileri A.Ş.', contact: 'Erdem Ak', lastSvc: 'Web Sitesi', lastDate: '9 ay önce', value: '₺35.000', status: 'Soğuk', stClr: 'gray', aiSugg: 'Sektörel case study ile iletişime geç. Rakip analizi sun.', score: 22 },
];

function Icon({ children, className = 'w-3.5 h-3.5 shrink-0', fill = 'none' }: { children: ReactNode; className?: string; fill?: string }) {
  return (
    <svg className={className} fill={fill} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      {children}
    </svg>
  );
}

function Bdg({ children, color }: { children: ReactNode; color: ColorName }) {
  const tone = CM[color] || CM.gray;
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${tone.bg} ${tone.t} whitespace-nowrap`}>{children}</span>;
}

function Spark({ points, color }: { points: number[]; color: string }) {
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const coords = points.map((value, index) => `${index * (100 / (points.length - 1))},${32 - ((value - min) / range) * 28}`);
  const path = `M${coords.join('L')}`;
  const area = `M${coords.join('L')}L100,36L0,36Z`;
  const gradientId = `nl-${color.replace('#', '')}-${points.join('-')}`;

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

export default function EBultenListeleri() {
  const [activeTab, setActiveTab] = useState<NewsletterTab>('overview');
  const [segmentSearch, setSegmentSearch] = useState('');
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [selectedSegment, setSelectedSegment] = useState<Segment | null>(null);

  const filteredSegments = useMemo(() => {
    const query = segmentSearch.trim().toLocaleLowerCase('tr-TR');
    return SEGMENTS.filter((segment) => !query || [segment.name, segment.desc, segment.source, ...segment.tags].some((item) => item.toLocaleLowerCase('tr-TR').includes(query)));
  }, [segmentSearch]);

  return (
    <div className="relative space-y-5 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-violet-100 dark:bg-violet-900/40 rounded-xl flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5 text-violet-600 dark:text-violet-400">{P.newsletter}</Icon>
          </div>
          <div>
            <h1 className="text-[19px] font-bold text-gray-900 dark:text-gray-100 leading-tight">E-Bülten & Pazarlama</h1>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">Müşteri datası üzerinden segment bazlı kampanya, re-marketing ve toplu iletişim yönetimi</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => setIsCampaignModalOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white text-[12px] font-semibold rounded-lg transition-colors"><Icon className="w-3.5 h-3.5 shrink-0 text-white">{P.plus}</Icon> Yeni Kampanya</button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-[12px] font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"><Icon>{P.db}</Icon> Segmentleri Güncelle</button>
        </div>
      </div>

      <div className="flex border-b border-gray-200 dark:border-gray-800 overflow-x-auto hs">
        {[
          ['overview', 'Genel Bakış'],
          ['segments', 'Segmentler & Listeler'],
          ['campaigns', 'Kampanyalar'],
          ['remarketing', 'Re-Marketing'],
        ].map(([id, label]) => (
          <button key={id} onClick={() => setActiveTab(id as NewsletterTab)} id={`nlt-${id}`} className={`px-4 py-2.5 text-[12px] font-semibold whitespace-nowrap border-b-2 transition-colors ${id === activeTab ? 'border-violet-600 text-violet-600 dark:text-violet-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}>{label}</button>
        ))}
      </div>

      <div id="nl-content" className="space-y-5 md:space-y-6">
        {activeTab === 'overview' ? <NewsletterOverview onTabChange={setActiveTab} onOpenCampaign={() => setIsCampaignModalOpen(true)} onSelectCampaign={setSelectedCampaign} /> : null}
        {activeTab === 'segments' ? <SegmentsView search={segmentSearch} onSearch={setSegmentSearch} segments={filteredSegments} onOpenCampaign={() => setIsCampaignModalOpen(true)} onSelectSegment={setSelectedSegment} /> : null}
        {activeTab === 'campaigns' ? <CampaignsView onOpenCampaign={() => setIsCampaignModalOpen(true)} onSelectCampaign={setSelectedCampaign} /> : null}
        {activeTab === 'remarketing' ? <RemarketingView onOpenCampaign={() => setIsCampaignModalOpen(true)} /> : null}
      </div>

      {isCampaignModalOpen ? <NewCampaignModal onClose={() => setIsCampaignModalOpen(false)} /> : null}
      {selectedCampaign ? <CampaignDetail campaign={selectedCampaign} onClose={() => setSelectedCampaign(null)} /> : null}
      {selectedSegment ? <SegmentDetail segment={selectedSegment} onClose={() => setSelectedSegment(null)} onOpenCampaign={() => setIsCampaignModalOpen(true)} /> : null}
    </div>
  );
}

function NewsletterOverview({ onTabChange, onOpenCampaign, onSelectCampaign }: { onTabChange: (tab: NewsletterTab) => void; onOpenCampaign: () => void; onSelectCampaign: (campaign: Campaign) => void }) {
  const totalPermitted = SEGMENTS.reduce((sum, item) => sum + item.permitted, 0);
  const totalAll = SEGMENTS.reduce((sum, item) => sum + item.total, 0);
  const sentCampaigns = CAMPAIGNS.filter((campaign) => campaign.status === 'Gönderildi');
  const avgOpen = (sentCampaigns.reduce((sum, campaign) => sum + (campaign.opened / campaign.totalSent) * 100, 0) / sentCampaigns.length).toFixed(1);
  const kpis = [
    { l: 'Toplam Kayıt', v: totalAll, trend: '+18', c: '#8b5cf6', d: [280, 295, 300, 305, 310, 316, totalAll] },
    { l: 'İzinli Kayıt', v: totalPermitted, trend: '+12', c: '#10b981', d: [245, 252, 258, 264, 268, 274, totalPermitted] },
    { l: 'İzin Bekleyen', v: 47, trend: '-5', c: '#f59e0b', d: [58, 55, 53, 51, 50, 49, 47] },
    { l: 'Aktif Kampanya', v: CAMPAIGNS.filter((campaign) => campaign.status === 'Planlandı').length, trend: '+2', c: '#06b6d4', d: [0, 1, 1, 1, 2, 2, CAMPAIGNS.filter((campaign) => campaign.status === 'Planlandı').length] },
    { l: 'Ort. Açılma Oranı', v: `${avgOpen}%`, trend: '+3.2%', c: '#6366f1', d: [48, 52, 54, 56, 57, 58, parseFloat(avgOpen)] },
  ];

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {kpis.map((kpi) => (
          <div key={kpi.l} className="bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-800 rounded-xl p-4 hover:shadow-md dark:hover:border-gray-700 transition-all">
            <div className="flex items-center justify-between mb-1"><p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">{kpi.l}</p><span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">{kpi.trend}</span></div>
            <div className="text-[26px] font-bold text-gray-900 dark:text-gray-100 leading-none mb-2">{kpi.v}</div>
            <Spark points={kpi.d} color={kpi.c} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative overflow-hidden bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-900/15 dark:to-[#17171a] border border-violet-200 dark:border-violet-800/40 rounded-xl p-4">
          <div className="absolute -top-5 -right-5 w-20 h-20 bg-violet-400/10 rounded-full aig pointer-events-none" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-violet-600 rounded-lg flex items-center justify-center shrink-0"><Icon className="text-white w-3.5 h-3.5">{P.ai}</Icon></div>
              <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100">AI Kampanya Önerisi</p>
              <div className="flex items-center gap-0.5 ml-0.5"><span className="d1 w-1 h-1 rounded-full bg-violet-500 inline-block" /><span className="d2 w-1 h-1 rounded-full bg-violet-500 inline-block ml-0.5" /><span className="d3 w-1 h-1 rounded-full bg-violet-500 inline-block ml-0.5" /></div>
            </div>
            <div className="space-y-2">
              <AiAction score="87" title="Yeniden Pazarlama segmentine Bahar kampanyası gönder" desc="44 kayıt · İzin oranı %86 · Tahminen 28 açılma bekleniyor" button="Hazırla" onClick={() => onTabChange('remarketing')} />
              <AiAction score="83" title="Potansiyel müşterilere aktivasyon kampanyası" desc="31 izinli kayıt · En iyi gönderim zamanı Salı 09:00" button="Görüntüle" onClick={() => onTabChange('campaigns')} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-800 rounded-xl p-4">
          <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100 mb-3">İzin Durumu Özeti</p>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1.5"><span className="text-[11px] text-gray-600 dark:text-gray-400">İzinli Kayıt</span><span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">{totalPermitted} / {totalAll}</span></div>
              <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.round((totalPermitted / totalAll) * 100)}%` }} /></div>
              <p className="text-[10px] text-gray-400 dark:text-gray-600 mt-1">{Math.round((totalPermitted / totalAll) * 100)}% izin oranı</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <PermissionBox color="emerald" value={totalPermitted} label="İzinli" />
              <PermissionBox color="amber" value={47} label="İzin Bekleyen" />
              <PermissionBox color="rose" value={totalAll - totalPermitted - 47} label="İzinsiz" />
            </div>
            <div className="flex items-start gap-2 p-2.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 rounded-lg">
              <Icon className="text-amber-600 dark:text-amber-400 w-3.5 h-3.5 shrink-0 mt-0.5">{P.alert}</Icon>
              <p className="text-[10px] text-amber-700 dark:text-amber-300">KVKK: 47 kayıt için e-posta izni güncelleme gerekiyor. <button onClick={onOpenCampaign} className="underline font-semibold">İzin Kampanyası Oluştur →</button></p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between"><p className="text-[12px] font-bold text-gray-900 dark:text-gray-100">Son Kampanyalar</p><button onClick={() => onTabChange('campaigns')} className="text-[11px] font-semibold text-violet-600 dark:text-violet-400 hover:underline">Tümünü Gör →</button></div>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {sentCampaigns.slice(0, 2).map((campaign) => <RecentCampaign key={campaign.id} campaign={campaign} onSelect={() => onSelectCampaign(campaign)} />)}
          </div>
        </div>
        <div className="lg:col-span-2 bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between"><p className="text-[12px] font-bold text-gray-900 dark:text-gray-100">Segment Durumu</p><button onClick={() => onTabChange('segments')} className="text-[11px] font-semibold text-violet-600 dark:text-violet-400 hover:underline">Tümünü Gör →</button></div>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {SEGMENTS.slice(0, 5).map((segment) => <div key={segment.id} className="px-4 py-2.5 flex items-center justify-between gap-3"><div className="flex-1 min-w-0"><p className="text-[12px] font-semibold text-gray-900 dark:text-gray-100 truncate">{segment.name}</p><p className="text-[10px] text-gray-400 dark:text-gray-600">{segment.permitted} izinli · {segment.total} toplam</p></div><Bdg color={segment.stClr}>{segment.status}</Bdg></div>)}
          </div>
        </div>
      </div>
    </>
  );
}

function AiAction({ score, title, desc, button, onClick }: { score: string; title: string; desc: string; button: string; onClick: () => void }) {
  return <div className="flex items-center gap-2.5 bg-white/70 dark:bg-white/5 rounded-lg px-3 py-2.5"><div className="shrink-0 w-8 h-8 flex items-center justify-center bg-violet-100 dark:bg-violet-900/40 rounded-lg text-[11px] font-bold text-violet-600 dark:text-violet-400">{score}</div><div className="flex-1 min-w-0"><p className="text-[11px] font-semibold text-gray-900 dark:text-gray-100 leading-snug">{title}</p><p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{desc}</p></div><button onClick={onClick} className="shrink-0 px-2.5 py-1 text-[10px] font-bold bg-violet-600 hover:bg-violet-700 text-white rounded-md transition-colors">{button}</button></div>;
}

function PermissionBox({ color, value, label }: { color: ColorName; value: number; label: string }) {
  const border = color === 'emerald' ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-300' : color === 'amber' ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/40 text-amber-700 dark:text-amber-300' : 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800/40 text-rose-700 dark:text-rose-300';
  return <div className={`py-2.5 px-2 border rounded-lg text-center ${border}`}><p className="text-[16px] font-bold">{value}</p><p className="text-[9px] font-semibold mt-0.5">{label}</p></div>;
}

function RecentCampaign({ campaign, onSelect }: { campaign: Campaign; onSelect: () => void }) {
  return (
    <button type="button" onClick={onSelect} className="w-full text-left px-4 py-3.5 hover:bg-gray-50/70 dark:hover:bg-gray-800/30 transition-colors">
      <div className="flex items-start justify-between gap-3 mb-2"><p className="text-[12px] font-semibold text-gray-900 dark:text-gray-100 leading-snug flex-1">{campaign.title}</p><Bdg color={campaign.stClr}>{campaign.status}</Bdg></div>
      <div className="flex items-center gap-2 mb-3"><Bdg color={campaign.segClr}>{campaign.segment}</Bdg><span className="text-[10px] text-gray-400 dark:text-gray-600">{campaign.sentDate}</span></div>
      <div className="grid grid-cols-3 gap-2 bg-gray-50/70 dark:bg-[#0a0a0c]/40 rounded-lg px-3 py-2"><Metric label="Gönderildi" value={campaign.totalSent} /><Metric label="Açılma Oranı" value={`${Math.round((campaign.opened / campaign.totalSent) * 100)}%`} color="emerald" /><Metric label="Tıklama Oranı" value={`${Math.round((campaign.clicked / campaign.totalSent) * 100)}%`} color="violet" /></div>
    </button>
  );
}

function Metric({ label, value, color = 'gray' }: { label: string; value: ReactNode; color?: ColorName }) {
  const cls = color === 'emerald' ? 'text-emerald-600 dark:text-emerald-400' : color === 'violet' ? 'text-violet-600 dark:text-violet-400' : 'text-gray-900 dark:text-gray-100';
  return <div><p className="text-[9px] font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wide mb-0.5">{label}</p><p className={`text-[14px] font-bold ${cls}`}>{value}</p></div>;
}

function SegmentsView({ search, onSearch, segments, onOpenCampaign, onSelectSegment }: { search: string; onSearch: (value: string) => void; segments: Segment[]; onOpenCampaign: () => void; onSelectSegment: (segment: Segment) => void }) {
  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs"><Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></Icon><input value={search} onChange={(event) => onSearch(event.target.value)} type="text" placeholder="Segment ara..." className="w-full pl-9 pr-4 py-2 text-[12px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0a0a0c] rounded-lg focus:outline-none focus:border-violet-500 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600" /></div>
        <button onClick={onOpenCampaign} className="flex items-center gap-1.5 px-3 py-2 text-[11px] font-semibold bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors shrink-0"><Icon className="w-3.5 h-3.5 shrink-0 text-white">{P.send}</Icon> Kampanya Oluştur</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {segments.map((segment) => <SegmentCard key={segment.id} segment={segment} onOpenCampaign={onOpenCampaign} onSelect={() => onSelectSegment(segment)} />)}
      </div>
    </div>
  );
}

function SegmentCard({ segment, onOpenCampaign, onSelect }: { segment: Segment; onOpenCampaign: () => void; onSelect: () => void }) {
  const openClass = segment.lastOpen > 50 ? 'text-emerald-600 dark:text-emerald-400' : segment.lastOpen > 30 ? 'text-amber-600 dark:text-amber-400' : 'text-gray-400 dark:text-gray-600';
  return (
    <div onClick={onSelect} className="bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-800 rounded-xl p-4 hover:shadow-md dark:hover:border-gray-700 transition-all cursor-pointer">
      <div className="flex items-start justify-between gap-2 mb-3"><div className="flex-1"><div className="flex items-center gap-2 mb-0.5"><p className="text-[13px] font-bold text-gray-900 dark:text-gray-100">{segment.name}</p><Bdg color={segment.stClr}>{segment.status}</Bdg></div><p className="text-[10px] text-gray-400 dark:text-gray-600">{segment.desc}</p></div></div>
      <div className="grid grid-cols-4 gap-3 mb-3 p-3 bg-gray-50/70 dark:bg-[#0a0a0c]/50 rounded-lg">
        <MiniStat value={segment.total} label="Toplam" />
        <MiniStat value={segment.permitted} label="İzinli" color="emerald" />
        <MiniStat value={segment.lastOpen > 0 ? `${segment.lastOpen}%` : '—'} label="Açılma" className={openClass} />
        <MiniStat value={segment.lastClick > 0 ? `${segment.lastClick}%` : '—'} label="Tıklama" color="violet" />
      </div>
      <div className="mb-3"><Spark points={segment.trend} color="#8b5cf6" /></div>
      <div className="flex items-center gap-2 flex-wrap mb-2">{segment.tags.map((tag) => <Bdg key={tag} color="indigo">{tag}</Bdg>)}</div>
      <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-1 text-[10px] text-gray-400 dark:text-gray-600"><Icon className="w-3 h-3">{P.clock}</Icon> Son gönderim: {segment.lastSent}</div>
        <div className="flex items-center gap-1.5">
          {segment.status === 'İzin Gerekli' ? <button onClick={(event) => event.stopPropagation()} className="px-2.5 py-1 text-[10px] font-semibold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40 rounded-md hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors">İzin Kampanyası</button> : <button onClick={(event) => { event.stopPropagation(); onOpenCampaign(); }} className="px-2.5 py-1 text-[10px] font-semibold bg-violet-600 hover:bg-violet-700 text-white rounded-md transition-colors">Kampanya Hazırla</button>}
          <button onClick={(event) => event.stopPropagation()} className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 dark:text-gray-500 transition-colors"><Icon>{P.edit}</Icon></button>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ value, label, color, className = '' }: { value: ReactNode; label: string; color?: ColorName; className?: string }) {
  const colorClass = color === 'emerald' ? 'text-emerald-600 dark:text-emerald-400' : color === 'violet' ? 'text-violet-600 dark:text-violet-400' : className || 'text-gray-900 dark:text-gray-100';
  return <div className="text-center"><p className={`text-[15px] font-bold ${colorClass}`}>{value}</p><p className="text-[9px] text-gray-400 dark:text-gray-600">{label}</p></div>;
}

function CampaignsView({ onOpenCampaign, onSelectCampaign }: { onOpenCampaign: () => void; onSelectCampaign: (campaign: Campaign) => void }) {
  const stats = [
    { l: 'Gönderildi', v: CAMPAIGNS.filter((campaign) => campaign.status === 'Gönderildi').length, c: 'emerald' as ColorName },
    { l: 'Planlandı', v: CAMPAIGNS.filter((campaign) => campaign.status === 'Planlandı').length, c: 'sky' as ColorName },
    { l: 'Taslak', v: CAMPAIGNS.filter((campaign) => campaign.status === 'Taslak').length, c: 'gray' as ColorName },
    { l: 'Toplam Erişim', v: CAMPAIGNS.reduce((sum, campaign) => sum + campaign.totalSent, 0), c: 'violet' as ColorName },
  ];
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">{stats.map((stat) => <KpiStrip key={stat.l} {...stat} />)}</div>
      <div className="space-y-3">{CAMPAIGNS.map((campaign) => <CampaignCard key={campaign.id} campaign={campaign} onSelect={() => onSelectCampaign(campaign)} />)}</div>
      <button onClick={onOpenCampaign} className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-violet-200 dark:border-violet-800/40 rounded-xl text-[12px] font-semibold text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/10 transition-colors"><Icon className="text-violet-600 dark:text-violet-400">{P.plus}</Icon> Yeni Kampanya Oluştur</button>
    </div>
  );
}

function KpiStrip({ l, v, c }: { l: string; v: number; c: ColorName }) {
  const tone = CM[c] || CM.gray;
  return <div className="bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2.5"><p className={`text-[19px] font-bold ${tone.t} leading-none mb-0.5`}>{v}</p><p className="text-[10px] text-gray-500 dark:text-gray-400">{l}</p></div>;
}

function CampaignCard({ campaign, onSelect }: { campaign: Campaign; onSelect: () => void }) {
  const isSent = campaign.status === 'Gönderildi';
  return (
    <div onClick={onSelect} className="bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-800 rounded-xl p-4 hover:shadow-md dark:hover:border-gray-700 transition-all cursor-pointer">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1"><Bdg color={campaign.stClr}>{campaign.status}</Bdg><Bdg color={campaign.segClr}>{campaign.segment}</Bdg><span className="flex items-center gap-1 text-[10px] text-gray-400 dark:text-gray-600 ml-auto"><Icon className="w-3 h-3">{P.star}</Icon> AI Skor: <span className="font-semibold text-violet-600 dark:text-violet-400">{campaign.aiScore}</span></span></div>
          <p className="text-[13px] font-bold text-gray-900 dark:text-gray-100 mb-0.5">{campaign.title}</p>
          <p className="text-[11px] text-gray-500 dark:text-gray-400">{campaign.subject}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0"><button onClick={(event) => { event.stopPropagation(); onSelect(); }} className={`px-3 py-1.5 text-[11px] font-semibold rounded-lg transition-colors ${campaign.status === 'Taslak' || campaign.status === 'Planlandı' ? 'bg-violet-600 hover:bg-violet-700 text-white' : 'bg-white dark:bg-[#0a0a0c] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>{campaign.status === 'Taslak' ? 'Düzenle' : campaign.status === 'Planlandı' ? 'Önizle' : 'Rapor'}</button></div>
      </div>
      {isSent ? <SentStats campaign={campaign} /> : <PlannedInfo campaign={campaign} />}
    </div>
  );
}

function SentStats({ campaign }: { campaign: Campaign }) {
  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-gray-50/70 dark:bg-[#0a0a0c]/50 rounded-lg">
        <Metric label="Gönderildi" value={campaign.totalSent} />
        <Metric label="Açılan" value={<><span>{campaign.opened}</span><span className="text-[10px] text-emerald-600 dark:text-emerald-400"> {Math.round((campaign.opened / campaign.totalSent) * 100)}%</span></>} color="emerald" />
        <Metric label="Tıklayan" value={<><span>{campaign.clicked}</span><span className="text-[10px] text-violet-600 dark:text-violet-400"> {Math.round((campaign.clicked / campaign.totalSent) * 100)}%</span></>} color="violet" />
        <Metric label="İptal" value={campaign.unsubscribed} color={campaign.unsubscribed > 0 ? 'rose' : 'gray'} />
      </div>
      <div className="flex items-center gap-2 mt-2 text-[10px] text-gray-400 dark:text-gray-600"><Icon className="w-3 h-3">{P.clock}</Icon> Gönderildi: {campaign.sentDate} {campaign.sentTime}</div>
    </>
  );
}

function PlannedInfo({ campaign }: { campaign: Campaign }) {
  const isPlanned = campaign.status === 'Planlandı';
  return <div className={`flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400 p-3 ${isPlanned ? 'bg-sky-50 dark:bg-sky-900/20 border-sky-200 dark:border-sky-800/40' : 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800/40'} border rounded-lg`}><Icon className={`w-3.5 h-3.5 ${isPlanned ? 'text-sky-600 dark:text-sky-400' : 'text-gray-600 dark:text-gray-400'} shrink-0`}>{P.clock}</Icon>{isPlanned ? <>Planlandı: <strong>{campaign.sentDate} {campaign.sentTime}</strong></> : 'Taslak hazırlanıyor — içerik ve segment onayı bekliyor'}</div>;
}

function RemarketingView({ onOpenCampaign }: { onOpenCampaign: () => void }) {
  const totalValue = REMARKETING.reduce((sum, item) => sum + parseInt(item.value.replace(/[₺,.]/g, ''), 10), 0);
  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/15 dark:to-[#17171a] border border-amber-200 dark:border-amber-800/40 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center shrink-0"><Icon className="w-4 h-4 text-white">{P.undo}</Icon></div>
          <div className="flex-1"><p className="text-[12px] font-bold text-gray-900 dark:text-gray-100 mb-0.5">Yeniden Pazarlama Listesi</p><p className="text-[11px] text-gray-600 dark:text-gray-400">6+ aydır hizmet almayan <strong>{REMARKETING.length} müşteri</strong> yeniden kazanılabilir. AI önerileri ile segment bazlı aktivasyon kampanyası hazırlayabilirsiniz.</p><div className="flex flex-wrap gap-3 mt-2 text-[11px] text-gray-600 dark:text-gray-400"><span>Toplam potansiyel değer: <strong className="text-amber-700 dark:text-amber-300">₺{totalValue.toLocaleString('tr-TR')}</strong></span><span>Re-marketing: <strong>{REMARKETING.filter((item) => item.status === 'Re-Marketing').length} kayıt</strong></span></div></div>
          <button onClick={onOpenCampaign} className="shrink-0 px-3 py-1.5 text-[11px] font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors">Aktivasyon Kampanyası</button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3"><KpiStrip l="Yeniden Pazarlama Adayı" v={REMARKETING.length} c="amber" /><KpiStrip l="Soğuk Müşteri" v={REMARKETING.filter((item) => item.status === 'Soğuk').length} c="rose" /><div className="bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2.5"><p className="text-[19px] font-bold text-gray-900 dark:text-gray-100 leading-none mb-0.5">₺{Math.round(totalValue / 1000)}K</p><p className="text-[10px] text-gray-500 dark:text-gray-400">Potansiyel Değer</p></div></div>
      <div className="bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between"><p className="text-[12px] font-bold text-gray-900 dark:text-gray-100">Yeniden Kazanılabilir Müşteriler</p><div className="flex items-center gap-2"><span className="text-[10px] text-gray-400 dark:text-gray-600">AI Skora göre sıralı</span></div></div>
        <div className="divide-y divide-gray-100 dark:divide-gray-800">{[...REMARKETING].sort((a, b) => b.score - a.score).map((item) => <RemarketingRow key={item.co} item={item} onOpenCampaign={onOpenCampaign} />)}</div>
      </div>
    </div>
  );
}

function RemarketingRow({ item, onOpenCampaign }: { item: RemarketingCustomer; onOpenCampaign: () => void }) {
  return (
    <div className="p-4 hover:bg-gray-50/70 dark:hover:bg-gray-800/30 transition-colors">
      <div className="flex items-start gap-3">
        <ScoreRing score={item.score} />
        <div className="flex-1 min-w-0"><div className="flex items-start justify-between gap-2 mb-1"><div><p className="text-[13px] font-bold text-gray-900 dark:text-gray-100">{item.co}</p><p className="text-[10px] text-gray-400 dark:text-gray-600">{item.contact}</p></div><div className="flex items-center gap-2 shrink-0"><Bdg color={item.stClr}>{item.status}</Bdg><span className="text-[11px] font-semibold text-gray-600 dark:text-gray-400">{item.value}</span></div></div><div className="flex flex-wrap items-center gap-2 mb-2"><span className="text-[10px] text-gray-500 dark:text-gray-400">Son hizmet:</span><Bdg color="indigo">{item.lastSvc}</Bdg><span className="text-[10px] text-gray-400 dark:text-gray-600">{item.lastDate}</span></div><div className="flex items-start gap-1.5 p-2.5 bg-amber-50/70 dark:bg-amber-900/15 border border-amber-200/60 dark:border-amber-800/30 rounded-lg"><Icon className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5">{P.ai}</Icon><p className="text-[10px] text-amber-700 dark:text-amber-300">{item.aiSugg}</p></div></div>
        <div className="flex flex-col gap-1.5 shrink-0"><button onClick={onOpenCampaign} className="px-2.5 py-1.5 text-[10px] font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-md transition-colors">Kampanya Hazırla</button><button className="px-2.5 py-1.5 text-[10px] font-medium bg-white dark:bg-[#0a0a0c] border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Müşteri Kartı</button></div>
      </div>
    </div>
  );
}

function ScoreRing({ score }: { score: number }) {
  return <div className="w-12 h-12 shrink-0 relative flex items-center justify-center"><svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36"><circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-100 dark:text-gray-800" /><circle cx="18" cy="18" r="15" fill="none" stroke={score > 50 ? '#f59e0b' : '#ef4444'} strokeWidth="2" strokeDasharray={`${score * 0.942} 100`} strokeLinecap="round" /></svg><span className="absolute text-[11px] font-bold text-gray-900 dark:text-gray-100">{score}</span></div>;
}

function NewCampaignModal({ onClose }: { onClose: () => void }) {
  const [segment, setSegment] = useState('aktif');

  return (
    <div id="mNC" className="absolute inset-x-0 top-0 z-30 flex items-start justify-center p-4 bg-black/30 rounded-xl">
      <div className="bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-800"><div><h2 className="text-[14px] font-bold text-gray-900 dark:text-gray-100">Yeni Kampanya Oluştur</h2><p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Segment seç, içerik hazırla, zamanla ve gönder.</p></div><button onClick={onClose} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"><Icon className="w-4 h-4 text-gray-500"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Icon></button></div>
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <div><label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-2">1. Hedef Segment Seç</label><div className="grid grid-cols-2 gap-2" id="segmentSelect">{[
            ['aktif', 'Aktif Müşteriler', '142 izinli kayıt'],
            ['potansiyel', 'Potansiyel Müşteriler', '31 izinli kayıt'],
            ['remarketing', 'Yeniden Pazarlama', '38 izinli kayıt'],
            ['eticaret', 'E-Ticaret Segmenti', '35 izinli kayıt'],
          ].map(([id, title, desc]) => <label key={id} className={`flex items-center gap-2 p-3 ${segment === id ? 'border-2 border-violet-500 bg-violet-50 dark:bg-violet-900/20' : 'border border-gray-200 dark:border-gray-700 hover:border-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/10'} rounded-xl cursor-pointer transition-all`}><input type="radio" name="segment" value={id} checked={segment === id} onChange={() => setSegment(id)} className="text-violet-600" /><div><p className="text-[12px] font-semibold text-gray-900 dark:text-gray-100">{title}</p><p className="text-[10px] text-gray-400 dark:text-gray-600">{desc}</p></div></label>)}</div></div>
          <div><label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-2">2. Kampanya İçeriği</label><div className="space-y-3"><Field label="Kampanya Başlığı (Dahili)"><input type="text" placeholder="Örn: Bahar Kampanyası 2026 — Dijital Görünürlük Paketi" className="w-full px-3 py-2 text-[12px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0a0a0c] rounded-lg focus:outline-none focus:border-violet-500 text-gray-900 dark:text-gray-100 placeholder-gray-400" /></Field><Field label="E-posta Konusu"><input type="text" placeholder="Örn: Dijital görünürlüğünüzü güçlendirin — Özel Teklif" className="w-full px-3 py-2 text-[12px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0a0a0c] rounded-lg focus:outline-none focus:border-violet-500 text-gray-900 dark:text-gray-100 placeholder-gray-400" /></Field><div><div className="flex items-center justify-between mb-1"><label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-500">İçerik Notu / Brifing</label><button className="flex items-center gap-1 text-[10px] font-semibold text-violet-600 dark:text-violet-400 hover:underline"><Icon className="w-3 h-3">{P.ai}</Icon> AI ile Oluştur</button></div><textarea rows={3} placeholder="Kampanya amacı, öne çıkarılacak hizmetler, anahtar mesajlar..." className="w-full px-3 py-2 text-[12px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0a0a0c] rounded-lg focus:outline-none focus:border-violet-500 text-gray-900 dark:text-gray-100 placeholder-gray-400 resize-none" /></div></div></div>
          <div><label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-2">3. Zamanlama</label><div className="grid grid-cols-2 gap-3"><Field label="Gönderim Tarihi"><input type="date" className="w-full px-3 py-2 text-[12px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0a0a0c] rounded-lg focus:outline-none focus:border-violet-500 text-gray-900 dark:text-gray-100" /></Field><Field label="Gönderim Saati"><select defaultValue="11:00" className="w-full px-3 py-2 text-[12px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0a0a0c] rounded-lg focus:outline-none focus:border-violet-500 text-gray-900 dark:text-gray-100"><option>08:00</option><option>09:00</option><option>10:00</option><option>11:00</option><option>14:00</option><option>15:00</option><option>16:00</option></select></Field></div><div className="mt-2 flex items-center gap-2 p-2.5 bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800/40 rounded-lg"><Icon className="w-3.5 h-3.5 text-violet-500 shrink-0">{P.ai}</Icon><p className="text-[10px] text-violet-700 dark:text-violet-300">AI önerisi: Bu segment için en yüksek açılma oranı <strong>Salı 09:00 — 11:00</strong> saatleri arasında gerçekleşiyor.</p></div></div>
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-200 dark:border-gray-800 bg-gray-50/70 dark:bg-[#0a0a0c]/50"><button onClick={onClose} className="px-3 py-1.5 text-[12px] font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">İptal</button><div className="flex gap-2"><button className="px-3 py-1.5 text-[12px] font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50">Taslak Kaydet</button><button onClick={onClose} className="px-4 py-1.5 text-[12px] font-bold text-white bg-violet-600 rounded-lg hover:bg-violet-700">Kampanyayı Planla</button></div></div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <div><label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-500 mb-1">{label}</label>{children}</div>;
}

function CampaignDetail({ campaign, onClose }: { campaign: Campaign; onClose: () => void }) {
  return (
    <div className="absolute inset-x-0 top-0 z-30 flex items-start justify-center p-4 bg-black/30 rounded-xl">
      <div className="bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl w-full max-w-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-800"><div><h2 className="text-[14px] font-bold text-gray-900 dark:text-gray-100">{campaign.title}</h2><p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{campaign.subject}</p></div><button onClick={onClose} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"><Icon className="w-4 h-4 text-gray-500"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Icon></button></div>
        <div className="p-5 space-y-3"><div className="flex items-center gap-2"><Bdg color={campaign.stClr}>{campaign.status}</Bdg><Bdg color={campaign.segClr}>{campaign.segment}</Bdg><span className="text-[11px] font-semibold text-violet-600 dark:text-violet-400">AI Skor: {campaign.aiScore}</span></div><SentStats campaign={{ ...campaign, totalSent: campaign.totalSent || 1 }} /></div>
      </div>
    </div>
  );
}

function SegmentDetail({ segment, onClose, onOpenCampaign }: { segment: Segment; onClose: () => void; onOpenCampaign: () => void }) {
  return (
    <div className="absolute inset-x-0 top-0 z-30 flex items-start justify-center p-4 bg-black/30 rounded-xl">
      <div className="bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-800"><div><h2 className="text-[14px] font-bold text-gray-900 dark:text-gray-100">{segment.name}</h2><p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{segment.desc}</p></div><button onClick={onClose} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"><Icon className="w-4 h-4 text-gray-500"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Icon></button></div>
        <div className="p-5 space-y-4"><div className="grid grid-cols-4 gap-3 p-3 bg-gray-50/70 dark:bg-[#0a0a0c]/50 rounded-lg"><MiniStat value={segment.total} label="Toplam" /><MiniStat value={segment.permitted} label="İzinli" color="emerald" /><MiniStat value={segment.lastOpen > 0 ? `${segment.lastOpen}%` : '—'} label="Açılma" /><MiniStat value={segment.lastClick > 0 ? `${segment.lastClick}%` : '—'} label="Tıklama" color="violet" /></div><div className="flex flex-wrap gap-1.5">{segment.tags.map((tag) => <Bdg key={tag} color="indigo">{tag}</Bdg>)}</div><button onClick={onOpenCampaign} className="w-full px-3 py-2 text-[12px] font-semibold bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors">Kampanya Hazırla</button></div>
      </div>
    </div>
  );
}
