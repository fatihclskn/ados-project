import { type ReactNode, useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { getAiSettings, updateAiSetting, type AiSetting, type UpdateAiSettingPayload } from '../services/aiSettingsApi';

type ColorName = 'emerald' | 'amber' | 'rose' | 'sky' | 'violet' | 'indigo' | 'teal' | 'pink' | 'gray';
type SectionFilter = 'all' | 'apis' | 'agents';
type ApiType = 'llm' | 'image' | 'video' | 'audio';
type ApiStatus = 'active' | 'standby' | 'disabled';
type WizardKind = 'api' | 'agent';
type ToastState = { title: string; message: string; color: ColorName } | null;

type AiApi = {
  id: string;
  settingId: number;
  provider: string;
  model: string;
  role: string;
  type: ApiType;
  sharePercent: number;
  uptime: string;
  avgLatency: number;
  tokens24h: string;
  costToday: string;
  costMonth: string;
  monthlyCap: string;
  rpm: number;
  tpm: number;
  dailyCostLimit: string;
  fallbackTo: string;
  endpoint: string;
  apiBaseUrl: string;
  apiEndpoint: string;
  apiKey: string;
  description: string;
  status: ApiStatus;
  lastCheck: string;
  boundAgentCount: number;
  iconHue: ColorName;
};

type AiAgent = {
  id: string;
  name: string;
  version: string;
  role: string;
  description: string;
  boundJson: string;
  primaryModel: string;
  fallbackModel: string;
  promptsCount: number;
  runsToday: number;
  avgRuntime: string;
  successRate: string;
  status: 'active';
  lastRun: string;
  clr: ColorName;
  highlight?: boolean;
};

type ModalState =
  | { kind: 'api'; item: AiApi }
  | { kind: 'agent'; item: AiAgent }
  | null;

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

const INITIAL_APIS: AiApi[] = [];

const INITIAL_AGENTS: AiAgent[] = [
  { id: 'sales_agent', name: 'SalesAgent', version: 'v3.0', role: 'Satış Süreç Yöneticisi', description: 'Lead → Teklif → Sözleşme akışı · iskonto değerlendirme · CRM entegrasyonu', boundJson: 'Satis_Talimat.JSON', primaryModel: 'Claude 4.7', fallbackModel: 'GPT-4', promptsCount: 4, runsToday: 234, avgRuntime: '1.8s', successRate: '%98.4', status: 'active', lastRun: '3dk önce', clr: 'emerald' },
  { id: 'finance_agent', name: 'FinanceAgent', version: 'v2.8', role: 'Finansal Akış Koordinatörü', description: 'Fatura üretimi · tahsilat takibi · bütçe kontrolü · Parasüt/Stripe', boundJson: 'Finans_Talimat.JSON', primaryModel: 'GPT-4', fallbackModel: 'Claude 4.7', promptsCount: 3, runsToday: 186, avgRuntime: '1.2s', successRate: '%99.2', status: 'active', lastRun: '1sa önce', clr: 'amber' },
  { id: 'marketing_agent', name: 'MarketingAgent', version: 'v2.8', role: 'Pazarlama Operasyon', description: 'Kampanya planlama · içerik takvimi · analitik rapor', boundJson: 'Pazarlama_Talimat.JSON', primaryModel: 'Claude 4.7', fallbackModel: 'GPT-4', promptsCount: 3, runsToday: 142, avgRuntime: '2.1s', successRate: '%97.8', status: 'active', lastRun: '3sa önce', clr: 'pink' },
  { id: 'seo_agent', name: 'SeoAgent', version: 'v1.5', role: 'ADOS AI SEO Analist', description: 'Keyword araştırma · içerik planı · SEO rapor · Lokal/Ulusal/Global hedefleme', boundJson: 'SEO_Strateji.JSON', primaryModel: 'Claude 4.7', fallbackModel: 'GPT-4', promptsCount: 4, runsToday: 96, avgRuntime: '2.4s', successRate: '%97.8', status: 'active', lastRun: '30dk önce', clr: 'sky', highlight: true },
  { id: 'ads_agent', name: 'AdsAgent', version: 'v2.3', role: 'Reklam Operatörü', description: 'Google/Meta/LinkedIn kampanya · bütçe eşiği · kreatif üretim', boundJson: 'Google_Ads.JSON', primaryModel: 'GPT-4', fallbackModel: 'Claude 4.7', promptsCount: 4, runsToday: 128, avgRuntime: '1.6s', successRate: '%98.9', status: 'active', lastRun: '8dk önce', clr: 'indigo' },
  { id: 'social_agent', name: 'SocialAgent', version: 'v1.8', role: 'Sosyal Medya Yönetici', description: '5 platform içerik üretimi + takvim + reklam analizi', boundJson: 'Sosyal_Medya.JSON', primaryModel: 'Claude 4.7', fallbackModel: 'GPT-4', promptsCount: 3, runsToday: 64, avgRuntime: '1.4s', successRate: '%98.2', status: 'active', lastRun: '1sa önce', clr: 'rose' },
  { id: 'production_agent', name: 'ProductionAgent', version: 'v1.3', role: 'Prodüksiyon Operatörü', description: 'Video brief · foto konsept · ses/altyazı · AI kreatif üretim', boundJson: 'Produksiyon.JSON', primaryModel: 'GPT-4 + DALL-E', fallbackModel: 'Claude 4.7', promptsCount: 3, runsToday: 38, avgRuntime: '4.8s', successRate: '%96.1', status: 'active', lastRun: '2sa önce', clr: 'teal' },
  { id: 'domain_agent', name: 'DomainAgent', version: 'v1.0', role: 'Domain & Hosting Yönetici', description: 'Metunic API · 4 setup tipi · SSL yönetimi', boundJson: 'Domain_Hosting.JSON', primaryModel: '—', fallbackModel: '—', promptsCount: 0, runsToday: 12, avgRuntime: '0.8s', successRate: '%99.9', status: 'active', lastRun: '1g önce', clr: 'violet' },
  { id: 'trademark_agent', name: 'TrademarkAgent', version: 'v1.0', role: 'Marka Tescil Uzmanı', description: 'TürkPatent/WIPO benzerlik taraması · NICE sınıfları · itiraz süreci', boundJson: 'Marka_Tescili.JSON', primaryModel: 'Claude 4.7', fallbackModel: 'GPT-4', promptsCount: 2, runsToday: 18, avgRuntime: '3.2s', successRate: '%98.6', status: 'active', lastRun: '5sa önce', clr: 'amber' },
  { id: 'web_agent', name: 'WebAgent', version: 'v2.1', role: 'Web Sitesi Analist', description: 'Lighthouse audit · SEO analizi · performans takibi', boundJson: 'Web_Sitesi.JSON', primaryModel: 'Claude 4.7', fallbackModel: 'GPT-4', promptsCount: 3, runsToday: 72, avgRuntime: '2.8s', successRate: '%97.5', status: 'active', lastRun: '45dk önce', clr: 'sky' },
  { id: 'premium_agent', name: 'PremiumAgent', version: 'v1.5', role: 'Premium 360 Yönetici', description: 'Dedicated ekip koordinasyonu · priority SLA · tüm hizmet entegrasyonu', boundJson: 'Premium_360.JSON', primaryModel: 'Claude 4.7', fallbackModel: 'GPT-4', promptsCount: 2, runsToday: 24, avgRuntime: '3.6s', successRate: '%99.1', status: 'active', lastRun: '12sa önce', clr: 'emerald' },
  { id: 'operations_agent', name: 'OperationsAgent', version: 'v1.0', role: 'Operasyon & Personel', description: 'Personel yönetimi · rol atama · ADOS erişim kontrolü · Microsoft Planner', boundJson: 'Operasyon_Ekip.JSON', primaryModel: '—', fallbackModel: '—', promptsCount: 0, runsToday: 52, avgRuntime: '0.6s', successRate: '%99.8', status: 'active', lastRun: '4sa önce', clr: 'violet' },
  { id: 'cost_analyst', name: 'CostAnalystAgent', version: 'v1.8', role: 'AI Maliyet Analist', description: 'Token tüketimi · maliyet limiti · eşik uyarıları · aşım yönetimi', boundJson: 'Maliyet_Analiz.JSON', primaryModel: 'GPT-4', fallbackModel: 'Claude 4.7', promptsCount: 2, runsToday: 52, avgRuntime: '0.9s', successRate: '%99.5', status: 'active', lastRun: '10dk önce', clr: 'amber' },
  { id: 'ai_router_agent', name: 'AIRouter', version: 'v2.4', role: 'Model Yönlendirici', description: 'LLM seçimi · fallback zinciri · yük dengeleme', boundJson: 'AI_Router.JSON', primaryModel: '—', fallbackModel: '—', promptsCount: 0, runsToday: 6320, avgRuntime: '0.02s', successRate: '%99.99', status: 'active', lastRun: 'şimdi', clr: 'pink' },
  { id: 'integration_hub', name: 'IntegrationHub', version: 'v2.1', role: 'Entegrasyon Koordinatör', description: '11 dış servis · OAuth yenileme · hata yönetimi', boundJson: 'Integrations.JSON', primaryModel: '—', fallbackModel: '—', promptsCount: 0, runsToday: 42, avgRuntime: '0.4s', successRate: '%99.3', status: 'active', lastRun: '6dk önce', clr: 'amber' },
  { id: 'approval_coordinator', name: 'ApprovalCoordinator', version: 'v2.0', role: 'Onay Koordinatörü', description: 'İş + sistem onay yönlendirme · CEO eskalasyonu · SLA takibi', boundJson: 'Master.JSON', primaryModel: 'Claude 4.7', fallbackModel: 'GPT-4', promptsCount: 1, runsToday: 234, avgRuntime: '0.8s', successRate: '%99.7', status: 'active', lastRun: '2sa önce', clr: 'violet' },
  { id: 'customer_health', name: 'CustomerHealthAgent', version: 'v2.0', role: 'Müşteri Sağlık Analist', description: 'Churn tahmini · engagement skoru · retention aksiyonları', boundJson: 'Musteri_Portfoy.JSON', primaryModel: 'Gemini 2.0', fallbackModel: 'Claude 4.7', promptsCount: 1, runsToday: 128, avgRuntime: '1.1s', successRate: '%97.9', status: 'active', lastRun: '1g önce', clr: 'violet' },
];

const JSON_OPTIONS = ['Satis_Talimat.JSON', 'Finans_Talimat.JSON', 'Pazarlama_Talimat.JSON', 'Operasyon_Ekip.JSON', 'SEO_Strateji.JSON', 'Google_Ads.JSON', 'Sosyal_Medya.JSON', 'Produksiyon.JSON', 'Domain_Hosting.JSON', 'Marka_Tescili.JSON', 'Web_Sitesi.JSON', 'Premium_360.JSON', 'Maliyet_Analiz.JSON', 'AI_Router.JSON', 'Integrations.JSON'];

function mapAiSettingToApi(setting: AiSetting): AiApi {
  return {
    id: `ai-setting-${setting.id}`,
    settingId: setting.id,
    provider: setting.providerName,
    model: setting.modelName || setting.providerName,
    role: setting.isActive ? 'Aktif Sağlayıcı' : 'Yedek Sağlayıcı',
    type: 'llm',
    sharePercent: setting.isActive ? 100 : 0,
    uptime: 'DB',
    avgLatency: 0,
    tokens24h: '—',
    costToday: '—',
    costMonth: '—',
    monthlyCap: '—',
    rpm: 0,
    tpm: 0,
    dailyCostLimit: '—',
    fallbackTo: '—',
    endpoint: `${setting.apiBaseUrl}${setting.apiEndpoint}`,
    apiBaseUrl: setting.apiBaseUrl,
    apiEndpoint: setting.apiEndpoint,
    apiKey: setting.apiKey || '',
    description: setting.description || '',
    status: setting.isActive ? 'active' : 'standby',
    lastCheck: setting.updatedAt ? 'güncellendi' : 'varsayılan',
    boundAgentCount: 0,
    iconHue: setting.isActive ? 'pink' : 'gray',
  };
}

function getErrorMessage(error: unknown, fallback: string) {
  const candidate = error as { response?: { data?: { message?: string; title?: string } }; message?: string };
  return candidate.response?.data?.message || candidate.response?.data?.title || candidate.message || fallback;
}

function Icon({ children, className }: { children: ReactNode; className: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      {children}
    </svg>
  );
}

function TypeIcon({ type }: { type: ApiType }) {
  if (type === 'image') return <><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></>;
  if (type === 'video') return <><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" /></>;
  if (type === 'audio') return <><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></>;
  return <><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></>;
}

export default function AiYonetimi() {
  const [apis, setApis] = useState<AiApi[]>(INITIAL_APIS);
  const [agents, setAgents] = useState<AiAgent[]>(INITIAL_AGENTS);
  const [section, setSection] = useState<SectionFilter>('all');
  const [modal, setModal] = useState<ModalState>(null);
  const [wizard, setWizard] = useState<WizardKind | null>(null);
  const [toast, setToast] = useState<ToastState>(null);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsError, setSettingsError] = useState('');

  const loadAiSettings = async () => {
    try {
      setSettingsLoading(true);
      setSettingsError('');
      const response = await getAiSettings();
      const items = Array.isArray(response) ? response : [];
      setApis(items.map(mapAiSettingToApi));
    } catch (error) {
      console.error('AI ayarları yüklenemedi:', error);
      const message = getErrorMessage(error, 'AI ayarları yüklenemedi.');
      setSettingsError(message);
      setApis([]);
    } finally {
      setSettingsLoading(false);
    }
  };

  useEffect(() => {
    void loadAiSettings();
  }, []);

  const totalRunsToday = agents.reduce((total, agent) => total + agent.runsToday, 0);
  const activeAPIs = apis.filter((api) => api.status === 'active').length;
  const activeAgents = agents.filter((agent) => agent.status === 'active').length;
  const llmChain = apis.filter((api) => api.type === 'llm').slice(0, 3);

  const addApi = (data: FormData) => {
    const model = String(data.get('apiModel') || '').trim();
    const provider = String(data.get('apiProvider') || '').trim();
    if (!model || !provider) {
      setToast({ title: 'Eksik Bilgi', message: 'Sağlayıcı ve model adı zorunludur', color: 'rose' });
      return;
    }
    setWizard(null);
    setToast({ title: 'Kalıcı Kayıt Gerekli', message: `${provider} / ${model} için backend POST endpointi yok. Mevcut AI sağlayıcısını düzenleyebilirsiniz.`, color: 'amber' });
  };

  const saveApiSetting = async (api: AiApi, payload: UpdateAiSettingPayload) => {
    try {
      const updated = await updateAiSetting(api.settingId, payload);
      setApis((current) => current.map((item) => (item.settingId === updated.id ? mapAiSettingToApi(updated) : item)));
      await loadAiSettings();
      setModal(null);
      setToast({ title: 'Kaydedildi', message: `${updated.providerName} AI ayarları güncellendi.`, color: 'emerald' });
    } catch (error) {
      console.error('AI ayarı güncellenemedi:', error);
      setToast({ title: 'Kaydedilemedi', message: getErrorMessage(error, 'AI ayarı güncellenemedi.'), color: 'rose' });
    }
  };
  const addAgent = (data: FormData) => {
    const name = String(data.get('agName') || '').trim();
    const role = String(data.get('agRole') || '').trim();
    if (!name || !role) {
      setToast({ title: 'Eksik Bilgi', message: 'Agent adı ve rol zorunludur', color: 'rose' });
      return;
    }
    const next: AiAgent = {
      id: name.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 30),
      name,
      version: String(data.get('agVersion') || 'v1.0'),
      role,
      description: String(data.get('agDesc') || 'Yeni ADOS agent'),
      boundJson: String(data.get('agJson') || '—'),
      primaryModel: String(data.get('agPrimary') || 'Claude 4.7'),
      fallbackModel: String(data.get('agFallback') || 'GPT-4'),
      promptsCount: 0,
      runsToday: 0,
      avgRuntime: '—',
      successRate: '—',
      status: 'active',
      lastRun: 'henüz yok',
      clr: 'indigo',
    };
    setAgents((current) => [...current, next]);
    setWizard(null);
    setToast({ title: 'Agent Oluşturuldu', message: `${next.name} ADOS Agent havuzuna eklendi`, color: 'emerald' });
  };

  return (
    <Layout activeId="ai-router" breadcrumb="ADOS Mimar · AI Yönetimi">
      <div className="relative min-h-[calc(100vh-120px)]">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-pink-100 dark:bg-pink-500/20 rounded-lg flex items-center justify-center">
              <Icon className="text-pink-600 dark:text-pink-400 w-4 h-4"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></Icon>
            </div>
            <div>
              <h1 className="text-[19px] font-bold text-gray-900 dark:text-gray-100 leading-tight">AI Yönetimi</h1>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">{apis.length} AI API · {agents.length} ADOS Agent · tüm yapay zeka altyapısı tek merkezden</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={() => setWizard('api')} className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-[11px] font-semibold rounded-md hover:bg-gray-50 dark:hover:bg-[#23242c]">
              <Icon className="w-3.5 h-3.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></Icon>
              AI API Ekle
            </button>
            <button onClick={() => setWizard('agent')} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 dark:bg-gray-100 dark:text-gray-900 text-white text-[11px] font-semibold rounded-md hover:opacity-90">
              <Icon className="w-3.5 h-3.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></Icon>
              Yeni Agent Tanımla
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3 mt-5">
          <KpiCard label="Toplam AI API" value={String(apis.length)} sub={`${activeAPIs} aktif · ${apis.length - activeAPIs} standby`} clr="pink" />
          <KpiCard label="Toplam Agent" value={String(agents.length)} sub={`${activeAgents} aktif · ADOS geneli`} clr="indigo" />
          <KpiCard label="Token Tüketimi" value="5.5M" sub="Son 24 saat · tüm LLM'ler" clr="violet" />
          <KpiCard label="Günlük Maliyet" value="₺5.285" sub="Limit: ₺10.000 · %52" clr="amber" />
          <KpiCard label="Aylık Maliyet" value="₺148K" sub="Bütçe: ₺295K · %50" clr="emerald" />
          <KpiCard label="Agent Çalıştırma" value={totalRunsToday.toLocaleString('tr-TR')} sub="Son 24h · başarı %98.4" clr="sky" />
        </div>

        {settingsLoading ? <div className="mt-4 p-3 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-xl text-[12px] text-gray-500 dark:text-gray-400">AI ayarları yükleniyor...</div> : null}
        {settingsError ? <div className="mt-4 p-3 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 rounded-xl text-[12px] text-rose-700 dark:text-rose-300">{settingsError}</div> : null}

        <FallbackChain apis={llmChain} />

        <div className="flex items-center gap-2 flex-wrap mt-5">
          <FilterButton active={section === 'all'} onClick={() => setSection('all')} activeClassName="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 border-gray-900 dark:border-gray-100" inactiveClassName="bg-white dark:bg-[#1e1f26] text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700">Tümü ({apis.length + agents.length})</FilterButton>
          <FilterButton active={section === 'apis'} onClick={() => setSection('apis')} activeClassName="bg-pink-600 text-white border-pink-600" inactiveClassName="bg-pink-50 dark:bg-pink-500/10 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-500/30">AI API'leri ({apis.length})</FilterButton>
          <FilterButton active={section === 'agents'} onClick={() => setSection('agents')} activeClassName="bg-indigo-600 text-white border-indigo-600" inactiveClassName="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/30">Agent'lar ({agents.length})</FilterButton>
        </div>

        {section === 'all' || section === 'apis' ? (
          <div className="mt-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1 h-6 bg-pink-500 rounded-full"></span>
              <h2 className="text-[14px] font-bold text-gray-900 dark:text-gray-100">AI Model & API Havuzu</h2>
              <span className="text-[10px] text-gray-500 dark:text-gray-400">{apis.length} servis · LLM + görsel + video + ses</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {apis.map((api) => <ApiCard key={api.id} api={api} onTest={() => setToast({ title: `Test · ${api.model}`, message: `Endpoint: ${api.endpoint} · ping başarılı · ${api.avgLatency}ms latency`, color: 'emerald' })} onEdit={() => setModal({ kind: 'api', item: api })} />)}
              {!settingsLoading && apis.length === 0 ? <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-[12px] text-gray-500 dark:text-gray-400">AI ayarı bulunamadı.</div> : null}
            </div>
          </div>
        ) : null}

        {section === 'all' || section === 'agents' ? (
          <div className="mt-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1 h-6 bg-indigo-500 rounded-full"></span>
              <h2 className="text-[14px] font-bold text-gray-900 dark:text-gray-100">ADOS Agent Havuzu</h2>
              <span className="text-[10px] text-gray-500 dark:text-gray-400">{agents.length} agent · her agent bir JSON'a bağlı · API havuzu kullanır</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {agents.map((agent) => <AgentCard key={agent.id} agent={agent} onLog={() => setToast({ title: `${agent.name} logs`, message: `Son ${agent.runsToday} çalışma · Audit Log sayfasında detay`, color: 'indigo' })} onEdit={() => setModal({ kind: 'agent', item: agent })} />)}
            </div>
          </div>
        ) : null}

        {modal?.kind === 'api' ? <ApiEditorModal api={modal.item} onClose={() => setModal(null)} onSave={saveApiSetting} onToast={setToast} /> : null}
        {modal?.kind === 'agent' ? <AgentEditorModal agent={modal.item} apis={apis} onClose={() => setModal(null)} onToast={setToast} /> : null}
        {wizard === 'api' ? <NewApiWizard apis={apis} onClose={() => setWizard(null)} onSubmit={addApi} /> : null}
        {wizard === 'agent' ? <NewAgentWizard agents={agents} apis={apis} onClose={() => setWizard(null)} onSubmit={addAgent} /> : null}
        <Toast toast={toast} onClose={() => setToast(null)} />
      </div>
    </Layout>
  );
}

function KpiCard({ label, value, sub, clr }: { label: string; value: string; sub: string; clr: ColorName }) {
  const cm = CM[clr] || CM.gray;
  return (
    <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-3.5">
      <p className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-[22px] font-bold ${cm.t} font-mono leading-none mb-0.5`}>{value}</p>
      <p className="text-[9px] text-gray-400 dark:text-gray-500">{sub}</p>
    </div>
  );
}

function FilterButton({ active, onClick, activeClassName, inactiveClassName, children }: { active: boolean; onClick: () => void; activeClassName: string; inactiveClassName: string; children: ReactNode }) {
  return <button onClick={onClick} className={`px-2.5 py-1 text-[10px] font-semibold rounded-full border ${active ? activeClassName : inactiveClassName}`}>{children}</button>;
}

function FallbackChain({ apis }: { apis: AiApi[] }) {
  return (
    <div className="bg-gradient-to-br from-pink-50 via-white to-indigo-50/50 dark:from-pink-500/5 dark:via-transparent dark:to-indigo-500/5 border border-pink-200 dark:border-pink-500/20 rounded-xl p-4 mt-5">
      <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Icon className="text-pink-600 dark:text-pink-400 w-4 h-4"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></Icon>
          <div><h3 className="text-[13px] font-bold text-gray-900 dark:text-gray-100">LLM Fallback Zinciri</h3><p className="text-[10px] text-gray-500 dark:text-gray-400">Birincil başarısız olursa otomatik sıradaki modele geçer</p></div>
        </div>
        <span className="text-[9px] font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-1 px-2 py-1 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>Sağlıklı</span>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        {apis.map((api, index) => {
          const cm = CM[api.iconHue] || CM.gray;
          return (
            <div key={api.id} className="contents">
              <div className={`flex-1 min-w-[180px] bg-white dark:bg-[#1e1f26] border ${index === 0 ? 'border-violet-300 dark:border-violet-500/40' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-3`}>
                <div className="flex items-center justify-between mb-1"><span className={`text-[10px] font-mono font-bold ${index === 0 ? 'text-violet-700 dark:text-violet-300' : 'text-gray-400 dark:text-gray-500'}`}>{index + 1}. {index === 0 ? 'BIRINCIL' : index === 1 ? 'İKİNCİL' : 'YEDEK'}</span><span className={`text-[11px] font-bold font-mono ${cm.t}`}>%{api.sharePercent}</span></div>
                <p className="text-[13px] font-bold text-gray-900 dark:text-gray-100 font-mono">{api.model}</p>
                <div className="flex items-center gap-2 mt-1 text-[9px] text-gray-500 dark:text-gray-500"><span>{api.uptime}</span><span>·</span><span className="font-mono">{api.avgLatency}ms</span><span>·</span><span className="font-mono">{api.tokens24h} token</span></div>
                <div className="mt-2 h-1 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden"><div className={`h-full ${cm.t.replace('text-', 'bg-')} transition-all`} style={{ width: `${api.sharePercent}%` }}></div></div>
              </div>
              {index < apis.length - 1 ? <span className="text-gray-400 text-lg">→</span> : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ApiCard({ api, onTest, onEdit }: { api: AiApi; onTest: () => void; onEdit: () => void }) {
  const cm = CM[api.iconHue] || CM.gray;
  const sClr: ColorName = api.status === 'active' ? 'emerald' : api.status === 'standby' ? 'gray' : 'rose';
  const sLbl = api.status === 'active' ? 'Aktif' : api.status === 'standby' ? 'Standby' : 'Hatalı';
  return (
    <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden hover:shadow-sm hover:-translate-y-0.5 transition-all">
      <button onClick={onEdit} className="w-full p-3.5 border-b border-gray-100 dark:border-gray-700/40 text-left">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 min-w-0"><div className={`w-9 h-9 ${cm.bg} rounded-lg flex items-center justify-center shrink-0`}><Icon className={`${cm.t} w-4 h-4`}><TypeIcon type={api.type} /></Icon></div><div className="min-w-0"><p className="text-[12px] font-bold text-gray-900 dark:text-gray-100 font-mono truncate">{api.model}</p><p className="text-[9px] text-gray-500 dark:text-gray-500">{api.provider}</p></div></div>
          <div className="flex flex-col items-end gap-1 shrink-0"><span className={`text-[9px] font-semibold px-1.5 py-0.5 ${cm.bg} ${cm.t} rounded`}>{api.role}</span><span className={`text-[9px] font-semibold px-1.5 py-0.5 bg-${sClr}-100 dark:bg-${sClr}-900/30 text-${sClr}-700 dark:text-${sClr}-300 rounded flex items-center gap-1`}>{api.status === 'active' ? <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></span> : null}{sLbl}</span></div>
        </div>
      </button>
      <div className="p-3.5 space-y-2.5">
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[10px]">
          <div><span className="text-gray-500 dark:text-gray-400">Uptime:</span> <span className="font-semibold text-emerald-700 dark:text-emerald-300 font-mono">{api.uptime}</span></div>
          <div><span className="text-gray-500 dark:text-gray-400">Latency:</span> <span className="font-semibold text-gray-900 dark:text-gray-100 font-mono">{api.avgLatency}ms</span></div>
          <div><span className="text-gray-500 dark:text-gray-400">Token/24h:</span> <span className="font-semibold text-gray-900 dark:text-gray-100 font-mono">{api.tokens24h}</span></div>
          <div><span className="text-gray-500 dark:text-gray-400">Pay:</span> <span className="font-semibold text-gray-900 dark:text-gray-100 font-mono">%{api.sharePercent}</span></div>
          <div><span className="text-gray-500 dark:text-gray-400">Bugün:</span> <span className="font-semibold text-amber-700 dark:text-amber-300 font-mono">{api.costToday}</span></div>
          <div><span className="text-gray-500 dark:text-gray-400">Ay:</span> <span className="font-semibold text-amber-700 dark:text-amber-300 font-mono">{api.costMonth}</span></div>
        </div>
        <div className="flex items-center gap-1.5 pt-2 border-t border-gray-100 dark:border-gray-700/40 text-[9px] text-gray-500 dark:text-gray-500"><Icon className="w-3 h-3"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" /></Icon><span>Fallback: <span className="font-mono font-semibold text-gray-700 dark:text-gray-300">{api.fallbackTo}</span></span><span className="ml-auto">{api.boundAgentCount} agent bağlı</span></div>
        <div className="flex items-center gap-1.5">
          <button onClick={onTest} className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-[10px] font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md transition-colors"><Icon className="w-3 h-3"><polygon points="5 3 19 12 5 21 5 3" /></Icon>Test Et</button>
          <button onClick={onEdit} className="flex-[1.5] flex items-center justify-center gap-1 px-2 py-1.5 text-[10px] font-bold bg-pink-600 hover:bg-pink-700 dark:bg-pink-500 dark:hover:bg-pink-400 text-white rounded-md transition-colors"><Icon className="w-3 h-3"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></Icon>API'yi Düzenle</button>
        </div>
      </div>
    </div>
  );
}

function AgentCard({ agent, onLog, onEdit }: { agent: AiAgent; onLog: () => void; onEdit: () => void }) {
  const cm = CM[agent.clr] || CM.gray;
  return (
    <div className={`bg-white dark:bg-[#1e1f26] border ${agent.highlight ? 'border-amber-300 dark:border-amber-500/40' : 'border-gray-200 dark:border-gray-600/50'} rounded-xl overflow-hidden hover:shadow-sm hover:-translate-y-0.5 transition-all`}>
      <button onClick={onEdit} className="w-full p-3.5 border-b border-gray-100 dark:border-gray-700/40 text-left">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 min-w-0"><div className={`w-9 h-9 ${cm.bg} rounded-lg flex items-center justify-center shrink-0`}><Icon className={`${cm.t} w-4 h-4`}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83" /></Icon></div><div className="min-w-0"><p className="text-[12px] font-bold text-gray-900 dark:text-gray-100 font-mono truncate">{agent.name}</p><p className="text-[9px] font-mono text-gray-400 dark:text-gray-500">{agent.version} · {agent.role}</p></div></div>
          <div className="flex flex-col items-end gap-1 shrink-0"><span className="text-[9px] font-semibold px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded flex items-center gap-1"><span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></span>Aktif</span>{agent.highlight ? <span className="text-[9px] font-bold px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded">★ AI SEO</span> : null}</div>
        </div>
        <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-snug line-clamp-2">{agent.description}</p>
      </button>
      <div className="p-3.5 space-y-2.5">
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[10px]">
          <div className="col-span-2"><span className="text-gray-500 dark:text-gray-400">JSON:</span> <span className="font-mono font-semibold text-violet-700 dark:text-violet-300">{agent.boundJson}</span></div>
          <div><span className="text-gray-500 dark:text-gray-400">Primary:</span> <span className="font-semibold text-gray-900 dark:text-gray-100 font-mono">{agent.primaryModel}</span></div>
          <div><span className="text-gray-500 dark:text-gray-400">Fallback:</span> <span className="font-semibold text-gray-600 dark:text-gray-400 font-mono">{agent.fallbackModel}</span></div>
          <div><span className="text-gray-500 dark:text-gray-400">Prompt:</span> <span className="font-semibold text-gray-900 dark:text-gray-100">{agent.promptsCount}</span></div>
          <div><span className="text-gray-500 dark:text-gray-400">Çalışma:</span> <span className="font-semibold text-gray-900 dark:text-gray-100">{agent.runsToday}/24h</span></div>
          <div><span className="text-gray-500 dark:text-gray-400">Ort. Süre:</span> <span className="font-semibold text-gray-900 dark:text-gray-100 font-mono">{agent.avgRuntime}</span></div>
          <div><span className="text-gray-500 dark:text-gray-400">Başarı:</span> <span className="font-semibold text-emerald-700 dark:text-emerald-300 font-mono">{agent.successRate}</span></div>
        </div>
        <div className="flex items-center gap-1.5 pt-2 border-t border-gray-100 dark:border-gray-700/40 text-[9px] text-gray-500 dark:text-gray-500"><Icon className="w-3 h-3"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></Icon>Son çalışma: <span className="font-semibold ml-1">{agent.lastRun}</span></div>
        <div className="flex items-center gap-1.5">
          <button onClick={onLog} className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-[10px] font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md transition-colors"><Icon className="w-3 h-3"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></Icon>Log</button>
          <button onClick={onEdit} className="flex-[1.5] flex items-center justify-center gap-1 px-2 py-1.5 text-[10px] font-bold bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 text-white rounded-md transition-colors"><Icon className="w-3 h-3"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></Icon>Agent'i Düzenle</button>
        </div>
      </div>
    </div>
  );
}

function ApiEditorModal({ api, onClose, onSave, onToast }: { api: AiApi; onClose: () => void; onSave: (api: AiApi, payload: UpdateAiSettingPayload) => Promise<void>; onToast: (toast: ToastState) => void }) {
  const cm = CM[api.iconHue] || CM.gray;
  const input = 'w-full px-3 py-2 text-[12px] bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:border-pink-500';
  const [form, setForm] = useState<UpdateAiSettingPayload>({
    providerName: api.provider,
    apiBaseUrl: api.apiBaseUrl,
    apiEndpoint: api.apiEndpoint,
    apiKey: api.apiKey,
    modelName: api.model === api.provider ? '' : api.model,
    isActive: api.status === 'active',
    description: api.description,
  });

  const updateForm = <K extends keyof UpdateAiSettingPayload>(key: K, value: UpdateAiSettingPayload[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!form.providerName.trim() || !form.apiBaseUrl.trim() || !form.apiEndpoint.trim()) {
      onToast({ title: 'Eksik Bilgi', message: 'Sağlayıcı, base URL ve endpoint zorunludur.', color: 'rose' });
      return;
    }

    await onSave(api, {
      ...form,
      providerName: form.providerName.trim(),
      apiBaseUrl: form.apiBaseUrl.trim().replace(/\/+$/, ''),
      apiEndpoint: form.apiEndpoint.trim().startsWith('/') ? form.apiEndpoint.trim() : `/${form.apiEndpoint.trim()}`,
      apiKey: form.apiKey?.trim() || null,
      modelName: form.modelName?.trim() || null,
      description: form.description?.trim() || null,
    });
  };

  return (
    <ModalShell maxWidth="max-w-[820px]" onClose={onClose}>
      <div className="sticky top-0 z-10 bg-white dark:bg-[#1e1f26] border-b border-gray-100 dark:border-gray-700/60 p-5 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0"><div className={`w-11 h-11 ${cm.bg} rounded-xl flex items-center justify-center shrink-0`}><Icon className={`${cm.t} w-5 h-5`}><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></Icon></div><div className="min-w-0"><div className="flex items-center gap-2 flex-wrap"><h2 className="text-[15px] font-bold text-gray-900 dark:text-gray-100 font-mono truncate">{api.model}</h2><span className="text-[10px] font-mono text-gray-500 dark:text-gray-500">{api.provider}</span><span className={`text-[9px] font-semibold px-1.5 py-0.5 ${cm.bg} ${cm.t} rounded`}>{api.role}</span></div><p className="text-[11px] text-gray-600 dark:text-gray-400 mt-0.5 font-mono">{api.endpoint}</p><p className="text-[9px] text-gray-400 dark:text-gray-500 mt-0.5">Veritabanındaki aktif AI sağlayıcısı ayarları</p></div></div>
        <CloseButton onClose={onClose} />
      </div>
      <div className="p-5 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Sağlayıcı"><input value={form.providerName} onChange={(event) => updateForm('providerName', event.target.value)} className={input} /></Field>
          <Field label="Model Adı"><input value={form.modelName || ''} onChange={(event) => updateForm('modelName', event.target.value)} className={`${input} font-mono`} /></Field>
          <Field label="API Base URL"><input value={form.apiBaseUrl} onChange={(event) => updateForm('apiBaseUrl', event.target.value)} className={`${input} font-mono`} /></Field>
          <Field label="API Endpoint"><input value={form.apiEndpoint} onChange={(event) => updateForm('apiEndpoint', event.target.value)} className={`${input} font-mono`} /></Field>
          <div className="md:col-span-2"><Field label="API Key"><input type="password" value={form.apiKey || ''} onChange={(event) => updateForm('apiKey', event.target.value)} placeholder="Boş bırakılabilir" className={`${input} font-mono`} /></Field></div>
          <div className="md:col-span-2"><Field label="Açıklama"><textarea rows={3} value={form.description || ''} onChange={(event) => updateForm('description', event.target.value)} className={`${input} resize-none`} /></Field></div>
          <label className="md:col-span-2 flex items-center gap-2 p-3 bg-gray-50 dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-[12px] font-semibold text-gray-700 dark:text-gray-300">
            <input type="checkbox" checked={form.isActive} onChange={(event) => updateForm('isActive', event.target.checked)} />
            Aktif AI sağlayıcısı olarak kullan
          </label>
        </div>
      </div>
      <div className="sticky bottom-0 bg-white dark:bg-[#1e1f26] border-t border-gray-100 dark:border-gray-700/60 p-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-[10px] text-gray-500 dark:text-gray-400"><Icon className="w-3 h-3"><circle cx="12" cy="12" r="10" /></Icon><span>Son kontrol: <span className="font-semibold">{api.lastCheck}</span> · {api.uptime} kayıt kaynağı</span></div>
        <div className="flex items-center gap-2"><button onClick={onClose} className="px-3 py-2 text-[11px] font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">İptal</button><button onClick={() => onToast({ title: `Test · ${api.model}`, message: `Endpoint: ${form.apiBaseUrl}${form.apiEndpoint} · merkezi ayar test edilmeye hazır`, color: 'emerald' })} className="flex items-center gap-1 px-3 py-2 text-[11px] font-semibold bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-[#23242c]"><Icon className="w-3 h-3"><polygon points="5 3 19 12 5 21 5 3" /></Icon>Test Et</button><button onClick={handleSubmit} className="flex items-center gap-1.5 px-4 py-2 text-[11px] font-bold bg-pink-600 hover:bg-pink-700 text-white rounded-md"><Icon className="w-3 h-3"><polyline points="20 6 9 17 4 12" /></Icon>Kaydet & Uygula</button></div>
      </div>
    </ModalShell>
  );
}
function ApiStepContent({ api, apis, step }: { api: AiApi; apis: AiApi[]; step: string }) {
  const input = 'w-full px-3 py-2 text-[12px] bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:border-pink-500';
  if (step === 'basic') return <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3"><Field label="Sağlayıcı"><input defaultValue={api.provider} className={input} /></Field><Field label="Model Adı"><input defaultValue={api.model} className={`${input} font-mono`} /></Field><Field label="Rol"><select defaultValue={api.role} className={input}>{['Birincil LLM', 'İkincil LLM', 'Yedek LLM', 'Hızlı Görevler', 'Görsel Üretim', 'Görsel Yedek', 'Video Üretim', 'Ses Üretim'].map((role) => <option key={role}>{role}</option>)}</select></Field><Field label="Tip"><select defaultValue={api.type} className={input}><option value="llm">LLM (Language Model)</option><option value="image">Image (Görsel)</option><option value="video">Video</option><option value="audio">Audio (Ses)</option></select></Field><Field label="Durum"><select defaultValue={api.status} className={input}><option value="active">Aktif</option><option value="standby">Standby</option><option value="disabled">Devre Dışı</option></select></Field><Field label="Trafik Payı (%)"><input type="number" min="0" max="100" defaultValue={api.sharePercent} className={`${input} font-mono`} /></Field></div>;
  if (step === 'auth') return <div className="pt-3 space-y-3"><Field label="API Endpoint"><input defaultValue={api.endpoint} className={`${input} font-mono`} /></Field><div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">API Key</label><div className="flex items-center gap-2"><input type="password" defaultValue="sk-ant-api03-••••••••••••••••••••••••••••••••••••••" className={`flex-1 ${input} font-mono`} /><button className="px-3 py-2 text-[10px] font-semibold bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-[#23242c]">Göster</button><button className="px-3 py-2 text-[10px] font-semibold bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-[#23242c]">Yenile</button></div><p className="text-[9px] text-amber-700 dark:text-amber-400 mt-1">⚠ API key'ler şifrelenmiş saklanır · son 4 karakter görünür</p></div><div className="grid grid-cols-2 gap-3"><Field label="Organization ID"><input defaultValue="org-ados-prod" className={`${input} font-mono`} /></Field><Field label="Timeout (sn)"><input type="number" defaultValue="30" className={`${input} font-mono`} /></Field></div></div>;
  if (step === 'limits') return <div className="pt-3 grid grid-cols-1 md:grid-cols-2 gap-3"><Field label="Dakikalık İstek (RPM)"><input type="number" defaultValue={api.rpm} className={`${input} font-mono`} /></Field><Field label="Dakikalık Token (TPM)"><input type="number" defaultValue={api.tpm} className={`${input} font-mono`} /></Field><Field label="Günlük Maliyet Limiti"><input defaultValue={api.dailyCostLimit} className={`${input} font-mono`} /></Field><Field label="Aylık Tavan"><input defaultValue={api.monthlyCap} className={`${input} font-mono`} /></Field><div className="md:col-span-2"><Field label="Limit Aşımında Davranış"><select className={input}><option>Otomatik fallback'e geç</option><option>CEO onayı iste</option><option>İsteği reddet</option></select></Field></div></div>;
  if (step === 'fallback') return <div className="pt-3 space-y-3"><Field label="Hata Halinde Yedek"><select defaultValue={api.fallbackTo} className={`${input} font-mono`}><option>—</option>{apis.filter((item) => item.id !== api.id).map((item) => <option key={item.id}>{item.model}</option>)}</select></Field><div className="grid grid-cols-2 gap-3"><Field label="Fallback Tetikleme"><select defaultValue="Timeout + Hata" className={input}><option>Hata alındığında</option><option>Timeout + Hata</option><option>Latency &gt; 5sn</option></select></Field><Field label="Retry Sayısı"><input type="number" defaultValue="2" className={`${input} font-mono`} /></Field></div><div className="p-3 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-md"><p className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-2">Çalışma Mantığı</p><div className="flex items-center gap-2 flex-wrap text-[10px]"><span className="font-mono font-semibold px-2 py-1 bg-pink-50 dark:bg-pink-500/10 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-500/30 rounded">{api.model}</span><span className="text-gray-400">→ hata →</span><span className="font-mono font-semibold px-2 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 rounded">{api.fallbackTo}</span><span className="text-gray-400">→ hata →</span><span className="text-gray-500 italic">Dur · Uyarı</span></div></div></div>;
  return <MonitorGrid api={api} />;
}

function MonitorGrid({ api }: { api: AiApi }) {
  return <div className="pt-3 grid grid-cols-1 md:grid-cols-3 gap-3"><Metric label="Uptime (30 gün)" value={api.uptime} color="emerald" /><Metric label="Ort. Latency" value={`${api.avgLatency}ms`} color="sky" /><Metric label="Token/24h" value={api.tokens24h} color="violet" /><div className="md:col-span-3"><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Uyarı Kuralları</label><div className="flex flex-wrap gap-1.5 p-2 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-md"><span className="text-[10px] font-semibold px-2 py-1 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 rounded">uptime &lt; %99</span><span className="text-[10px] font-semibold px-2 py-1 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 rounded">latency &gt; 2000ms</span><span className="text-[10px] font-semibold px-2 py-1 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 rounded">cost &gt; günlük limit %80</span><button className="text-[10px] font-semibold px-2 py-1 border border-dashed border-amber-300 dark:border-amber-500/40 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-500/10 rounded">+ Kural</button></div></div></div>;
}

function AgentEditorModal({ agent, apis, onClose, onToast }: { agent: AiAgent; apis: AiApi[]; onClose: () => void; onToast: (toast: ToastState) => void }) {
  const cm = CM[agent.clr] || CM.gray;
  const steps = [
    { key: 'basic', title: 'Temel Ayarlar', desc: `${agent.version} · ${agent.role}`, icon: <circle cx="12" cy="12" r="10" /> },
    { key: 'json', title: 'JSON Bağlantısı', desc: agent.boundJson, icon: <><path d="M4 4h16v16H4z" /><path d="M4 12h16" /><path d="M12 4v16" /></> },
    { key: 'prompts', title: "Kullandığı Prompt'lar", desc: `${agent.promptsCount} prompt bağlı`, icon: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></> },
    { key: 'models', title: 'Model Atamaları', desc: `Primary: ${agent.primaryModel} · Fallback: ${agent.fallbackModel}`, icon: <><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></> },
    { key: 'performance', title: 'Performans & Limitler', desc: `${agent.runsToday} çalışma · ${agent.successRate} başarı`, icon: <path d="M22 12h-4l-3 9L9 3l-3 9H2" /> },
    { key: 'governance', title: 'Kontrol & Onay', desc: 'Hangi işlemler onay gerektirir', icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /> },
  ];
  return (
    <ModalShell maxWidth="max-w-[820px]" onClose={onClose}>
      <div className="sticky top-0 z-10 bg-white dark:bg-[#1e1f26] border-b border-gray-100 dark:border-gray-700/60 p-5 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0"><div className={`w-11 h-11 ${cm.bg} rounded-xl flex items-center justify-center shrink-0`}><Icon className={`${cm.t} w-5 h-5`}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83" /></Icon></div><div className="min-w-0"><div className="flex items-center gap-2 flex-wrap"><h2 className="text-[15px] font-bold text-gray-900 dark:text-gray-100 font-mono truncate">{agent.name}</h2><span className="text-[10px] font-mono text-gray-500 dark:text-gray-500">{agent.version}</span><span className={`text-[9px] font-semibold px-1.5 py-0.5 ${cm.bg} ${cm.t} rounded`}>{agent.role}</span></div><p className="text-[11px] text-gray-600 dark:text-gray-400 mt-0.5">{agent.description}</p><p className="text-[9px] text-gray-400 dark:text-gray-500 mt-0.5">{steps.length} adım · son çalışma {agent.lastRun}</p></div></div>
        <CloseButton onClose={onClose} />
      </div>
      <div className="p-5 space-y-2.5">{steps.map((step, index) => <StepBox key={step.key} index={index} step={step} color="indigo"><AgentStepContent agent={agent} apis={apis} step={step.key} onToast={onToast} /></StepBox>)}</div>
      <div className="sticky bottom-0 bg-white dark:bg-[#1e1f26] border-t border-gray-100 dark:border-gray-700/60 p-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-[10px] text-gray-500 dark:text-gray-400"><Icon className="w-3 h-3"><circle cx="12" cy="12" r="10" /></Icon><span>{agent.runsToday} çalışma · {agent.successRate} başarı · son: <span className="font-semibold">{agent.lastRun}</span></span></div>
        <div className="flex items-center gap-2"><button onClick={onClose} className="px-3 py-2 text-[11px] font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">İptal</button><button onClick={() => onToast({ title: 'Test Çalıştırıldı', message: `${agent.name} örnek görevle test edildi · PASS`, color: 'emerald' })} className="flex items-center gap-1 px-3 py-2 text-[11px] font-semibold bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-[#23242c]"><Icon className="w-3 h-3"><polygon points="5 3 19 12 5 21 5 3" /></Icon>Test Et</button><button onClick={() => { onToast({ title: 'Kaydedildi', message: `${agent.name} yeni versiyonu oluşturuldu · audit log’a yazıldı`, color: 'emerald' }); onClose(); }} className="flex items-center gap-1.5 px-4 py-2 text-[11px] font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"><Icon className="w-3 h-3"><polyline points="20 6 9 17 4 12" /></Icon>Kaydet & Deploy</button></div>
      </div>
    </ModalShell>
  );
}

function AgentStepContent({ agent, apis, step, onToast }: { agent: AiAgent; apis: AiApi[]; step: string; onToast: (toast: ToastState) => void }) {
  const input = 'w-full px-3 py-2 text-[12px] bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:border-indigo-500';
  const llms = apis.filter((api) => api.type === 'llm');
  if (step === 'basic') return <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3"><Field label="Agent Adı"><input defaultValue={agent.name} className={`${input} font-mono`} /></Field><Field label="Versiyon"><input defaultValue={agent.version} className={`${input} font-mono`} /></Field><div className="md:col-span-2"><Field label="Rol"><input defaultValue={agent.role} className={input} /></Field></div><div className="md:col-span-2"><Field label="Açıklama"><textarea rows={2} defaultValue={agent.description} className={`${input} resize-none`} /></Field></div></div>;
  if (step === 'json') return <div className="pt-3 space-y-3"><div className="p-3 bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/30 rounded-md flex items-center gap-3"><Icon className="text-violet-600 dark:text-violet-400 w-5 h-5"><path d="M4 4h16v16H4z" /><path d="M4 12h16" /><path d="M12 4v16" /></Icon><div className="flex-1 min-w-0"><p className="text-[11px] font-bold text-violet-900 dark:text-violet-100 font-mono">{agent.boundJson}</p><p className="text-[9px] text-violet-700 dark:text-violet-400">Bu agent'ın talimatlarını bu JSON tanımlar</p></div><button onClick={() => onToast({ title: "JSON'u Aç", message: `${agent.boundJson} JSON Ajanları ekranında açılacak`, color: 'violet' })} className="text-[10px] font-semibold px-2 py-1 text-violet-700 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-500/20 rounded">JSON'u Aç</button></div><Field label="JSON Değiştir"><select defaultValue={agent.boundJson} className={`${input} font-mono`}>{JSON_OPTIONS.map((option) => <option key={option}>{option}</option>)}</select></Field><p className="text-[9px] text-amber-700 dark:text-amber-400 mt-1">⚠ JSON değişikliği agent'ın tüm davranışını değiştirir · onay gerektirir</p></div>;
  if (step === 'prompts') return <div className="pt-3 space-y-2"><p className="text-[10px] text-gray-500 dark:text-gray-400">Bu agent'ın kullandığı prompt'lar · Prompt Kütüphanesi'nden yönetilir</p>{agent.promptsCount === 0 ? <p className="text-[11px] text-gray-400 italic py-3">Bu agent direkt prompt kullanmıyor (koordinasyon/sistem agent'ı).</p> : Array.from({ length: Math.min(agent.promptsCount, 3) }).map((_, index) => <div key={index} className="flex items-center gap-2 p-2.5 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-md"><span className="w-6 h-6 bg-sky-100 dark:bg-sky-900/30 rounded flex items-center justify-center shrink-0"><Icon className="text-sky-700 dark:text-sky-300 w-3 h-3"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /></Icon></span><div className="flex-1 min-w-0"><p className="text-[11px] font-mono font-semibold text-gray-900 dark:text-gray-100 truncate">prompt_{agent.name.toLowerCase()}_{index + 1}</p><p className="text-[9px] text-gray-500 dark:text-gray-500">{agent.role} prompt bağlantısı</p></div><span className="text-[9px] font-semibold px-1.5 py-0.5 bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 rounded">Prompt</span><button onClick={() => onToast({ title: 'Prompt Aç', message: 'Prompt Kütüphanesi sayfasında açılıyor', color: 'sky' })} className="text-[9px] text-sky-700 dark:text-sky-300 hover:underline">Aç</button></div>)}<button onClick={() => onToast({ title: 'Prompt Bağla', message: 'Prompt Kütüphanesi seçim ekranı açılıyor', color: 'sky' })} className="w-full p-2.5 border border-dashed border-sky-300 dark:border-sky-500/40 text-sky-700 dark:text-sky-300 text-[11px] font-semibold rounded-md hover:bg-sky-50 dark:hover:bg-sky-500/10 flex items-center justify-center gap-1.5"><Icon className="w-3 h-3"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></Icon>Prompt Bağla (Prompt Kütüphanesi)</button></div>;
  if (step === 'models') return <div className="pt-3 space-y-3"><div className="grid grid-cols-1 md:grid-cols-2 gap-3"><Field label="Birincil Model"><select defaultValue={agent.primaryModel} className={`${input} font-mono`}><option>—</option>{llms.map((api) => <option key={api.id}>{api.model}</option>)}<option>GPT-4 + DALL-E</option></select></Field><Field label="Yedek Model"><select defaultValue={agent.fallbackModel} className={`${input} font-mono`}><option>—</option>{llms.map((api) => <option key={api.id}>{api.model}</option>)}</select></Field></div><div className="grid grid-cols-3 gap-3"><Field label="Temperature"><input type="number" step="0.1" min="0" max="1" defaultValue="0.4" className={`${input} font-mono`} /></Field><Field label="Max Tokens"><input type="number" defaultValue="2800" className={`${input} font-mono`} /></Field><Field label="Timeout"><input type="number" defaultValue="60" className={`${input} font-mono`} /></Field></div></div>;
  if (step === 'performance') return <div className="pt-3 grid grid-cols-1 md:grid-cols-3 gap-3"><Metric label="Çalışma/24h" value={String(agent.runsToday)} color="indigo" /><Metric label="Ort. Runtime" value={agent.avgRuntime} color="sky" /><Metric label="Başarı Oranı" value={agent.successRate} color="emerald" /><div className="md:col-span-3 grid grid-cols-2 gap-3"><Field label="Saatlik Çalışma Limiti"><input type="number" defaultValue="100" className={`${input} font-mono`} /></Field><Field label="Runtime Alarm Eşiği"><input defaultValue="10sn" className={`${input} font-mono`} /></Field></div></div>;
  return <div className="pt-3 space-y-3"><Field label="Onay Gerektiren İşlemler"><div className="flex flex-wrap gap-1.5 p-2 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-md"><span className="text-[10px] font-mono font-semibold px-2 py-1 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30 rounded">contract.sign</span><span className="text-[10px] font-mono font-semibold px-2 py-1 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30 rounded">discount.above_15</span><button className="text-[10px] font-semibold px-2 py-1 border border-dashed border-amber-300 dark:border-amber-500/40 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-500/10 rounded">+ Kural</button></div></Field><div className="grid grid-cols-2 gap-3"><Field label="Log Seviyesi"><select className={input}><option>DEBUG</option><option>INFO</option><option>WARN</option><option>ERROR</option></select></Field><Field label="Audit Retention"><input defaultValue="365 gün" className={`${input} font-mono`} /></Field></div></div>;
}

function NewApiWizard({ apis, onClose, onSubmit }: { apis: AiApi[]; onClose: () => void; onSubmit: (data: FormData) => void }) {
  return (
    <ModalForm title="Yeni AI API Ekle" desc="Hazır şablondan başla veya özel API tanımla · ADOS havuzuna eklenecek" color="pink" onClose={onClose} onSubmit={onSubmit} submitLabel="Oluştur & AI Havuzuna Ekle">
      <Field label="Sağlayıcı"><input name="apiProvider" placeholder="OpenAI" className={wizardInput('pink')} /></Field>
      <Field label="Model Adı"><input name="apiModel" placeholder="GPT-4" className={`${wizardInput('pink')} font-mono`} /></Field>
      <Field label="Rol"><select name="apiRole" className={wizardInput('pink')}><option>Birincil LLM</option><option>İkincil LLM</option><option>Yedek LLM</option><option>Görsel Üretim</option><option>Video Üretim</option><option>Ses Üretim</option></select></Field>
      <Field label="Tip"><select name="apiType" className={wizardInput('pink')}><option value="llm">LLM</option><option value="image">Image</option><option value="video">Video</option><option value="audio">Audio</option></select></Field>
      <div className="md:col-span-2"><Field label="Endpoint"><input name="apiEndpoint" placeholder="https://api.openai.com/v1/chat/completions" className={`${wizardInput('pink')} font-mono`} /></Field></div>
      <Field label="Trafik Payı (%)"><input name="apiShare" type="number" defaultValue="0" className={`${wizardInput('pink')} font-mono`} /></Field>
      <Field label="Günlük Maliyet Limiti"><input name="apiDailyLimit" defaultValue="₺500" className={`${wizardInput('pink')} font-mono`} /></Field>
      <Field label="Aylık Tavan"><input name="apiMonthlyCap" defaultValue="₺10.000" className={`${wizardInput('pink')} font-mono`} /></Field>
      <Field label="Fallback"><select name="apiFallback" className={`${wizardInput('pink')} font-mono`}><option value="—">— (yedeksiz)</option>{apis.map((api) => <option key={api.id} value={api.model}>{api.model} ({api.provider})</option>)}</select></Field>
      <Field label="RPM"><input name="apiRpm" type="number" defaultValue="500" className={`${wizardInput('pink')} font-mono`} /></Field>
      <Field label="TPM"><input name="apiTpm" type="number" defaultValue="100000" className={`${wizardInput('pink')} font-mono`} /></Field>
    </ModalForm>
  );
}

function NewAgentWizard({ agents, apis, onClose, onSubmit }: { agents: AiAgent[]; apis: AiApi[]; onClose: () => void; onSubmit: (data: FormData) => void }) {
  const llms = apis.filter((api) => api.type === 'llm');
  return (
    <ModalForm title="Yeni Agent Tanımla" desc="Bir JSON'a bağlı yeni ADOS agent'ı oluştur" color="indigo" onClose={onClose} onSubmit={onSubmit} submitLabel="Oluştur & Agent Havuzuna Ekle">
      <div className="md:col-span-2"><Field label="Kopya Kaynak"><select id="agCopyFrom" className={`${wizardInput('indigo')} font-mono`}><option value="">— Sıfırdan oluştur —</option>{agents.map((agent) => <option key={agent.id} value={agent.id}>{agent.name} ({agent.version}) · {agent.role}</option>)}</select></Field></div>
      <Field label="Agent Adı"><input name="agName" placeholder="MyAgent" className={`${wizardInput('indigo')} font-mono`} /></Field>
      <Field label="Versiyon"><input name="agVersion" defaultValue="v1.0" className={`${wizardInput('indigo')} font-mono`} /></Field>
      <div className="md:col-span-2"><Field label="Rol"><input name="agRole" placeholder="Yeni süreç yöneticisi" className={wizardInput('indigo')} /></Field></div>
      <div className="md:col-span-2"><Field label="Açıklama"><textarea name="agDesc" rows={2} placeholder="Bu agent neyi yönetir?" className={`${wizardInput('indigo')} resize-none`} /></Field></div>
      <div className="md:col-span-2"><Field label="JSON Bağlantısı"><select name="agJson" className={`${wizardInput('indigo')} font-mono`}><option value="">— JSON seçin veya sonra bağlayın —</option>{JSON_OPTIONS.map((item) => <option key={item}>{item}</option>)}</select></Field></div>
      <Field label="Birincil Model"><select name="agPrimary" defaultValue="Claude 4.7" className={`${wizardInput('indigo')} font-mono`}><option value="—">—</option>{llms.map((api) => <option key={api.id}>{api.model}</option>)}</select></Field>
      <Field label="Yedek Model"><select name="agFallback" defaultValue="GPT-4" className={`${wizardInput('indigo')} font-mono`}><option value="—">—</option>{llms.map((api) => <option key={api.id}>{api.model}</option>)}</select></Field>
    </ModalForm>
  );
}

function ModalShell({ children, maxWidth, onClose }: { children: ReactNode; maxWidth: string; onClose: () => void }) {
  return (
    <>
      <div className="modal-overlay absolute inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose}></div>
      <div className="modal-panel absolute inset-0 flex items-start justify-center p-4 pointer-events-none z-50">
        <div className={`modal-scroll bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-xl w-full ${maxWidth} max-h-[92vh] overflow-y-auto pointer-events-auto`}>
          {children}
        </div>
      </div>
    </>
  );
}

function ModalForm({ title, desc, color, onClose, onSubmit, submitLabel, children }: { title: string; desc: string; color: ColorName; onClose: () => void; onSubmit: (data: FormData) => void; submitLabel: string; children: ReactNode }) {
  return (
    <ModalShell maxWidth="max-w-[680px]" onClose={onClose}>
      <form onSubmit={(event) => { event.preventDefault(); onSubmit(new FormData(event.currentTarget)); }}>
        <div className="sticky top-0 z-10 bg-white dark:bg-[#1e1f26] border-b border-gray-100 dark:border-gray-700/60 p-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5"><div className={`w-10 h-10 bg-${color}-100 dark:bg-${color}-500/20 rounded-lg flex items-center justify-center`}><Icon className={`text-${color}-600 dark:text-${color}-400 w-4 h-4`}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></Icon></div><div><h2 className="text-[15px] font-bold text-gray-900 dark:text-gray-100">{title}</h2><p className="text-[11px] text-gray-500 dark:text-gray-400">{desc}</p></div></div>
          <CloseButton onClose={onClose} />
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-3">{children}</div>
        <div className="sticky bottom-0 bg-white dark:bg-[#1e1f26] border-t border-gray-100 dark:border-gray-700/60 p-4 flex items-center justify-end gap-2"><button type="button" onClick={onClose} className="px-3 py-2 text-[11px] font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">İptal</button><button type="submit" className="flex items-center gap-1.5 px-4 py-2 text-[11px] font-bold bg-gray-900 dark:bg-gray-100 dark:text-gray-900 text-white rounded-md hover:opacity-90"><Icon className="w-3.5 h-3.5"><polyline points="20 6 9 17 4 12" /></Icon>{submitLabel}</button></div>
      </form>
    </ModalShell>
  );
}

function StepBox({ step, index, color, children }: { step: { title: string; desc: string; icon: ReactNode }; index: number; color: ColorName; children: ReactNode }) {
  return (
    <details open={index === 0} className="bg-gray-50 dark:bg-[#17181f] border border-gray-200 dark:border-gray-700/40 rounded-lg overflow-hidden group">
      <summary className="px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-white/40 dark:hover:bg-white/5 list-none">
        <div className="w-7 h-7 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center shrink-0"><Icon className={`text-${color}-600 dark:text-${color}-400 w-3.5 h-3.5`}>{step.icon}</Icon></div>
        <div className="flex-1 min-w-0"><div className="flex items-center gap-2"><span className="text-[10px] font-mono font-bold text-gray-500 dark:text-gray-500">ADIM {index + 1}</span><p className="text-[12px] font-bold text-gray-900 dark:text-gray-100">{step.title}</p></div><p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 truncate">{step.desc}</p></div>
        <Icon className="text-gray-400 dark:text-gray-500 w-4 h-4 shrink-0 transition-transform group-open:rotate-180"><polyline points="6 9 12 15 18 9" /></Icon>
      </summary>
      <div className="p-4 pt-0 border-t border-gray-200/70 dark:border-gray-700/40">{children}</div>
    </details>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">{label}</label>{children}</div>;
}

function Metric({ label, value, color }: { label: string; value: string; color: ColorName }) {
  return <div className="p-3 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-md"><p className="text-[9px] font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wider mb-1">{label}</p><p className={`text-[18px] font-bold text-${color}-700 dark:text-${color}-300 font-mono`}>{value}</p></div>;
}

function CloseButton({ onClose }: { onClose: () => void }) {
  return <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1 shrink-0"><Icon className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Icon></button>;
}

function wizardInput(color: ColorName) {
  return `w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:border-${color}-500`;
}

function Toast({ toast, onClose }: { toast: ToastState; onClose: () => void }) {
  if (!toast) return null;
  const clrs: Record<ColorName, { bg: string; bd: string }> = { emerald: { bg: '#10b981', bd: '#059669' }, rose: { bg: '#f43f5e', bd: '#e11d48' }, amber: { bg: '#f59e0b', bd: '#d97706' }, sky: { bg: '#0ea5e9', bd: '#0284c7' }, violet: { bg: '#8b5cf6', bd: '#7c3aed' }, indigo: { bg: '#6366f1', bd: '#4f46e5' }, teal: { bg: '#14b8a6', bd: '#0d9488' }, pink: { bg: '#ec4899', bd: '#db2777' }, gray: { bg: '#6b7280', bd: '#4b5563' } };
  const color = clrs[toast.color] || clrs.pink;
  return <div style={{ position: 'absolute', bottom: '24px', right: '24px', zIndex: 9999, minWidth: '280px', maxWidth: '400px', background: 'white', borderLeft: `4px solid ${color.bd}`, borderRadius: '10px', boxShadow: '0 8px 24px rgba(0,0,0,.15)', padding: '14px 16px', animation: 'toastSlide .3s ease-out' }}><div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}><div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: '13px', color: color.bg, marginBottom: '2px' }}>{toast.title}</div><div style={{ fontSize: '11px', color: '#6b7280' }}>{toast.message}</div></div><button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: '16px' }}>×</button></div><div style={{ position: 'absolute', bottom: 0, left: 0, height: '2px', background: color.bg, borderRadius: '0 0 10px 10px', animation: 'toastProgress 3s linear' }}></div></div>;
}
