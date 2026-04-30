import { type ReactNode, useMemo, useState } from 'react';
import Layout from '../components/Layout';

type ColorName = 'emerald' | 'amber' | 'rose' | 'sky' | 'violet' | 'indigo' | 'teal' | 'pink' | 'gray';
type JsonCategory = 'core' | 'process' | 'service' | 'system';
type RegistryFilter = 'all' | 'process' | 'service' | 'system';
type MasterView = 'cards' | 'code';
type ToastState = { title: string; message: string; color: ColorName } | null;

type RegistryItem = {
  id: string;
  name: string;
  version: string;
  category: JsonCategory;
  size: string;
  triggers: number;
  lastUpdate: string;
  description: string;
  prompts: string[];
  agent: string;
  agentVer: string;
  model: string;
  apis: string[];
  trigger: string;
  status: 'active';
  highlight?: boolean;
};

type VersionItem = {
  time: string;
  version: string;
  author: string;
  change: string;
  type: 'major' | 'minor' | 'patch';
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

const REGISTRY: RegistryItem[] = [
  { id: 'master', name: 'Master.JSON', version: 'v4.1.0', category: 'core', size: '142KB', triggers: 847, lastUpdate: '2sa', description: "Tüm alt JSON'ları koordine eden ana orkestratör · karar akışı · audit yönlendirme", prompts: ['prompt_master_coordinator_v4', 'prompt_system_health_check_v2', 'prompt_daily_brief_v1.5'], agent: 'Orchestrator', agentVer: 'v4.1.0', model: 'Claude 4.7', apis: ['—'], trigger: 'Her 15 dk + event-driven', status: 'active' },
  { id: 'satis', name: 'Satis_Talimat.JSON', version: 'v2.1.4', category: 'process', size: '68KB', triggers: 234, lastUpdate: '15dk', description: 'Satış süreçleri · Lead → Teklif → Sözleşme · 3 aşamalı akış yönetimi', prompts: ['prompt_teklif_hazirlama_v3.0', 'prompt_iskonto_onay_v2.0', 'prompt_sozlesme_review_v1.5', 'prompt_kapama_asistani_v2.1'], agent: 'SalesAgent', agentVer: 'v3.0', model: 'Claude 4.7', apis: ['HubSpot CRM', 'Salesforce'], trigger: 'Lead girişi + teklif güncellenmesi', status: 'active' },
  { id: 'finans', name: 'Finans_Talimat.JSON', version: 'v3.0.1', category: 'process', size: '54KB', triggers: 186, lastUpdate: '1sa', description: 'Finansal akışlar · Fatura · Tahsilat · Bütçe · Nakit akışı', prompts: ['prompt_fatura_olustur_v1.2', 'prompt_tahsilat_takip_v1.0', 'prompt_butce_analiz_v2.0'], agent: 'FinanceAgent', agentVer: 'v2.8', model: 'GPT-4', apis: ['Parasüt', 'Stripe'], trigger: 'Günlük · sözleşme aktivasyonu', status: 'active' },
  { id: 'pazarlama', name: 'Pazarlama_Talimat.JSON', version: 'v2.8.0', category: 'process', size: '47KB', triggers: 142, lastUpdate: '3sa', description: 'Pazarlama operasyonları · kampanya · içerik · analitik raporlama', prompts: ['prompt_kampanya_plan_v2.0', 'prompt_icerik_takvimi_v1.8', 'prompt_analitik_rapor_v2.2'], agent: 'MarketingAgent', agentVer: 'v2.8', model: 'Claude 4.7', apis: ['Mailchimp', 'Google Analytics'], trigger: 'Haftalık + kampanya tetiklemesi', status: 'active' },
  { id: 'ekip', name: 'Operasyon_Ekip.JSON', version: 'v1.0.0', category: 'process', size: '29KB', triggers: 52, lastUpdate: '4sa', description: 'Personel · rol · yetki · ADOS erişim yönetimi', prompts: ['—'], agent: 'OperationsAgent', agentVer: 'v1.0', model: '—', apis: ['Microsoft Planner'], trigger: 'Personel değişikliği · rol atama', status: 'active' },
  { id: 'seo', name: 'SEO_Strateji.JSON', version: 'v2.1.0', category: 'service', size: '38KB', triggers: 96, lastUpdate: '30dk', description: 'ADOS AI SEO · Keyword araştırma · içerik planı · rapor üretimi · Lokal/Ulusal/Global hedefleme', prompts: ['prompt_seo_keyword_research_v3.2', 'prompt_seo_icerik_plani_v2.1', 'prompt_seo_rapor_v1.8', 'prompt_seo_rakip_analiz_v1.5'], agent: 'SeoAgent', agentVer: 'v1.5', model: 'Claude 4.7', apis: ['Google Search Console', 'Ahrefs', 'SemRush'], trigger: 'Haftalık rapor + talep', status: 'active', highlight: true },
  { id: 'ads', name: 'Google_Ads.JSON', version: 'v2.3.7', category: 'service', size: '41KB', triggers: 128, lastUpdate: '8dk', description: 'Google + Meta + LinkedIn reklam operasyonları · bütçe · kreatif · ROAS takibi', prompts: ['prompt_ads_budget_v1.5', 'prompt_ads_creative_v2.0', 'prompt_ads_audience_v1.3', 'prompt_ads_budget_emergency_v1'], agent: 'AdsAgent', agentVer: 'v2.3', model: 'GPT-4', apis: ['Google Ads API', 'Meta Ads API', 'LinkedIn Ads API'], trigger: 'Günlük + bütçe eşiği', status: 'active' },
  { id: 'sosyal', name: 'Sosyal_Medya.JSON', version: 'v1.8.0', category: 'service', size: '32KB', triggers: 64, lastUpdate: '1sa', description: 'Sosyal medya yönetimi + reklam · 5 platform · içerik üretimi · takvim', prompts: ['prompt_social_content_v3.0', 'prompt_social_schedule_v1.2', 'prompt_social_ads_analiz_v2.0'], agent: 'SocialAgent', agentVer: 'v1.8', model: 'Claude 4.7', apis: ['Meta', 'LinkedIn', 'X', 'Instagram', 'TikTok'], trigger: 'Saatlik takvim', status: 'active' },
  { id: 'produksiyon', name: 'Produksiyon.JSON', version: 'v1.3.0', category: 'service', size: '28KB', triggers: 38, lastUpdate: '2sa', description: 'Video · foto · ses prodüksiyonu · AI + klasik yöntemler', prompts: ['prompt_video_brief_v2.1', 'prompt_foto_konsept_v1.5', 'prompt_ses_altyazi_v1.0'], agent: 'ProductionAgent', agentVer: 'v1.3', model: 'GPT-4 + DALL-E', apis: ['Runway', 'ElevenLabs'], trigger: 'Talep üzerine', status: 'active' },
  { id: 'domain', name: 'Domain_Hosting.JSON', version: 'v1.2.0', category: 'service', size: '18KB', triggers: 12, lastUpdate: '1g', description: 'Domain tescil · hosting · sunucu yönetimi · 4 setup tipi', prompts: ['—'], agent: 'DomainAgent', agentVer: 'v1.0', model: '—', apis: ['Metunic API', 'Plesk', 'cPanel'], trigger: 'Talep üzerine', status: 'active' },
  { id: 'marka', name: 'Marka_Tescili.JSON', version: 'v1.0.5', category: 'service', size: '22KB', triggers: 18, lastUpdate: '5sa', description: 'Marka tescil süreçleri · benzerlik tarama · NICE sınıfları · uluslararası kapsam', prompts: ['prompt_marka_benzerlik_v1.2', 'prompt_nice_siniflandirma_v1.0'], agent: 'TrademarkAgent', agentVer: 'v1.0', model: 'Claude 4.7', apis: ['TürkPatent API', 'WIPO'], trigger: 'Başvuru + durum güncellemesi', status: 'active' },
  { id: 'web', name: 'Web_Sitesi.JSON', version: 'v2.1.0', category: 'service', size: '34KB', triggers: 72, lastUpdate: '45dk', description: 'Web sitesi analizi · SEO audit · performans · ADOS müşteri referansları', prompts: ['prompt_web_analiz_v2.3', 'prompt_web_seo_audit_v1.5', 'prompt_web_performans_v1.2'], agent: 'WebAgent', agentVer: 'v2.1', model: 'Claude 4.7', apis: ['Lighthouse API', 'PageSpeed Insights'], trigger: 'Aylık + müşteri talebi', status: 'active' },
  { id: 'premium', name: 'Premium_360.JSON', version: 'v2.0.0', category: 'service', size: '45KB', triggers: 24, lastUpdate: '12sa', description: 'ADOS Premium 360 · dedicated ekip · priority SLA · tüm hizmetlerin entegrasyonu', prompts: ['prompt_premium_strateji_v2.0', 'prompt_premium_rapor_v1.8'], agent: 'PremiumAgent', agentVer: 'v1.5', model: 'Claude 4.7', apis: ['Tüm entegrasyonlar'], trigger: 'Aylık rapor + görüşme öncesi', status: 'active' },
  { id: 'maliyet', name: 'Maliyet_Analiz.JSON', version: 'v1.8.2', category: 'system', size: '24KB', triggers: 52, lastUpdate: '10dk', description: 'AI token tüketimi · maliyet limiti · eşik uyarıları · aşım yönetimi', prompts: ['prompt_cost_analysis_v1.3', 'prompt_limit_override_v1'], agent: 'CostAnalystAgent', agentVer: 'v1.8', model: 'GPT-4', apis: ['Anthropic', 'OpenAI', 'Google'], trigger: 'Saatlik + eşik aşımı', status: 'active' },
  { id: 'ai_router', name: 'AI_Router.JSON', version: 'v2.4.0', category: 'system', size: '16KB', triggers: 6320, lastUpdate: 'şimdi', description: 'Claude/GPT/Gemini yönlendirme · model seçimi · fallback kuralları', prompts: ['—'], agent: 'AIRouter', agentVer: 'v2.4', model: '—', apis: ['Anthropic', 'OpenAI', 'Google AI'], trigger: 'Her AI çağrısı', status: 'active' },
  { id: 'integration', name: 'Integrations.JSON', version: 'v2.1.2', category: 'system', size: '21KB', triggers: 42, lastUpdate: '6dk', description: '11 dış servis entegrasyonu · OAuth yenileme · hata yönetimi', prompts: ['—'], agent: 'IntegrationHub', agentVer: 'v2.1', model: '—', apis: ['Çoklu'], trigger: 'API çağrısı + token yenileme', status: 'active' },
];

const VERSION_HISTORY: VersionItem[] = [
  { time: '2sa önce', version: 'v4.1.0', author: 'Osman Atasoy', change: 'Master.JSON #approvals dalına Eisenhower kadran eklendi', type: 'minor' },
  { time: '8sa önce', version: 'v4.0.9', author: 'Orchestrator (auto)', change: 'AI_Router.JSON model payı yeniden dengelendi', type: 'patch' },
  { time: '1g önce', version: 'v4.0.8', author: 'Osman Atasoy', change: "SEO_Strateji.JSON prompt zinciri v3.2'ye güncellendi", type: 'minor' },
  { time: '2g önce', version: 'v4.0.7', author: 'Berke Yılmaz', change: "Google_Ads.JSON bütçe eşiği ₺300K'ya çıkarıldı", type: 'patch' },
  { time: '5g önce', version: 'v4.0.6', author: 'Osman Atasoy', change: 'Operasyon_Ekip.JSON yeni schema (v1.0.0) ile entegre edildi', type: 'major' },
];

const EVENTS = [
  { time: '23:18:42', event: 'Onay Tetiklendi', src: 'Master.JSON', target: 'ApprovalCoordinator', latency: '12ms' },
  { time: '23:18:38', event: 'SEO Analiz Çalıştı', src: 'SEO_Strateji.JSON', target: 'SeoAgent → Claude 4.7', latency: '187ms' },
  { time: '23:18:35', event: 'JSON Sync', src: 'Operasyon_Ekip.JSON', target: 'Master.JSON', latency: '4ms' },
  { time: '23:18:31', event: 'Prompt Yüklendi', src: 'prompt_seo_keyword_v3.2', target: 'SeoAgent', latency: '21ms' },
  { time: '23:18:28', event: 'Integration Çağrı', src: 'Google_Ads.JSON', target: 'Google Ads API', latency: '156ms' },
  { time: '23:18:24', event: 'Audit Write', src: 'Master.JSON', target: 'TimescaleDB', latency: '3ms' },
];

function Icon({ children, className }: { children: ReactNode; className: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      {children}
    </svg>
  );
}

export default function Orchestrator() {
  const [masterView, setMasterView] = useState<MasterView>('cards');
  const [editMode, setEditMode] = useState(false);
  const [registryFilter, setRegistryFilter] = useState<RegistryFilter>('all');
  const [selectedJson, setSelectedJson] = useState<RegistryItem | null>(null);
  const [toast, setToast] = useState<ToastState>(null);
  const [dirty, setDirty] = useState(false);

  const processJsons = REGISTRY.filter((item) => item.category === 'process');
  const serviceJsons = REGISTRY.filter((item) => item.category === 'service');
  const systemJsons = REGISTRY.filter((item) => item.category === 'system');
  const coreJson = REGISTRY.find((item) => item.category === 'core') || REGISTRY[0];
  const totalPrompts = new Set(REGISTRY.flatMap((item) => item.prompts).filter((prompt) => prompt !== '—')).size;
  const totalAgents = new Set(REGISTRY.map((item) => item.agent).filter((agent) => agent !== '—')).size;
  const totalTriggers = REGISTRY.reduce((total, item) => total + item.triggers, 0);

  const filteredRegistry = useMemo(() => {
    const base = REGISTRY.filter((item) => item.category !== 'core');
    if (registryFilter === 'all') return base;
    return base.filter((item) => item.category === registryFilter);
  }, [registryFilter]);

  function toggleMasterEditMode() {
    const next = !editMode;
    setEditMode(next);
    setDirty(next);
    setToast(next
      ? { title: 'Düzenleme Modu Aktif', message: 'Tüm kart alanları düzenlenebilir · değişiklikleri kaydetmeyi unutmayın', color: 'violet' }
      : { title: 'Düzenleme Kapatıldı', message: 'Tüm alanlar salt-okunur moda alındı', color: 'gray' });
  }

  function saveMasterJSON() {
    setEditMode(false);
    setDirty(false);
    setToast({ title: 'Kaydedildi & Deploy Edildi', message: "Master.JSON v4.1.1 oluşturuldu · audit log'a yazıldı · 12 aktif trigger yenilendi", color: 'emerald' });
  }

  function filterRegistry(next: RegistryFilter) {
    setRegistryFilter(next);
    setToast({ title: 'Filtre Uygulandı', message: `Kayıt defterine ${next === 'all' ? 'tüm' : next} JSON'lar yüklendi`, color: 'violet' });
  }

  function openJsonEditor(item: RegistryItem) {
    setSelectedJson(item);
    setToast({ title: item.name, message: `Düzenleyici açılıyor · ${item.prompts.filter((prompt) => prompt !== '—').length} prompt · ${item.agent} · ${item.model}`, color: 'violet' });
  }

  return (
    <Layout activeId="orchestrator" breadcrumb="ADOS Mimar · Orchestrator">
      <div className="relative">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-violet-100 dark:bg-violet-500/20 rounded-lg flex items-center justify-center">
              <Icon className="text-violet-600 dark:text-violet-400 w-4 h-4"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></Icon>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-[19px] font-bold text-gray-900 dark:text-gray-100 leading-tight">Orchestrator</h1>
                <span className="text-[9px] font-bold tracking-wider text-violet-700 dark:text-violet-300 px-1.5 py-0.5 bg-violet-100 dark:bg-violet-900/30 rounded">CORE</span>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">ADOS sisteminin ana mimarisi · <span className="font-mono">Master.JSON {coreJson.version}</span> · {REGISTRY.length} JSON · {totalPrompts} prompt · {totalAgents} agent</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-md">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">Canlı · uptime %99.97</span>
            </div>
            <button onClick={() => setToast({ title: 'Versiyon Geçmişi', message: 'Tam versiyon geçmişi panelı açılıyor · karşılaştırma + rollback', color: 'violet' })} className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-[11px] font-semibold rounded-md hover:bg-gray-50 dark:hover:bg-[#23242c]">
              <Icon className="w-3.5 h-3.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></Icon>
              Versiyon Geçmişi
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3 mt-5">
          <KpiCard label="Toplam JSON" value={String(REGISTRY.length)} sub={`${processJsons.length} süreç · ${serviceJsons.length} hizmet · ${systemJsons.length} sistem`} clr="violet" />
          <KpiCard label="Bağlı Promptlar" value={String(totalPrompts)} sub="Versiyonlu" clr="sky" />
          <KpiCard label="Aktif Agentlar" value={String(totalAgents)} sub="JSON'lara bağlı" clr="indigo" />
          <KpiCard label="Trigger / 24h" value={String(totalTriggers)} sub="Tüm mimari genelinde" clr="emerald" />
          <KpiCard label="Sağlık" value="%99.97" sub="Uptime · son 30 gün" clr="teal" />
          <KpiCard label="Master Versiyon" value={coreJson.version} sub="Son kayıt · 2sa önce" clr="amber" />
        </div>

        <div className="bg-white dark:bg-[#1e1f26] border border-violet-200 dark:border-violet-500/30 rounded-xl overflow-hidden mt-5">
          <div className="p-4 border-b border-violet-100 dark:border-violet-500/20 bg-gradient-to-r from-violet-50 to-transparent dark:from-violet-500/10 flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-violet-100 dark:bg-violet-500/30 rounded-lg flex items-center justify-center">
                <Icon className="text-violet-700 dark:text-violet-300 w-4 h-4"><path d="M4 4h16v16H4z" /><path d="M4 12h16" /><path d="M12 4v16" /></Icon>
              </div>
              <div>
                <h4 className="text-[13px] font-bold text-gray-900 dark:text-gray-100"><span className="font-mono">Master.JSON</span> · Yönetim Paneli</h4>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">Sistemin kalbi · kart bazlı düzenleme · her değişiklik versiyonlu kaydedilir</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span id="masterSaveStatus" className={`${dirty ? 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30' : 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30'} text-[9px] font-semibold flex items-center gap-1 px-2 py-1 border rounded`}>
                {dirty ? <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span> : <Icon className="w-2.5 h-2.5"><polyline points="20 6 9 17 4 12" /></Icon>}
                {dirty ? 'Düzenleniyor' : 'Kaydedildi'}
              </span>
              <div className="flex items-center gap-0.5 p-0.5 bg-gray-100 dark:bg-[#17181f] border border-gray-200 dark:border-gray-700/40 rounded-md">
                <button id="viewCardsBtn" onClick={() => setMasterView('cards')} className={`px-2 py-1 text-[10px] font-semibold rounded flex items-center gap-1 ${masterView === 'cards' ? 'bg-white dark:bg-[#2a2b33] text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}`}>
                  <Icon className="w-3 h-3"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></Icon>
                  Form
                </button>
                <button id="viewCodeBtn" onClick={() => setMasterView('code')} className={`px-2 py-1 text-[10px] font-semibold rounded flex items-center gap-1 ${masterView === 'code' ? 'bg-white dark:bg-[#2a2b33] text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}`}>
                  <Icon className="w-3 h-3"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></Icon>
                  Ham JSON
                </button>
              </div>
              <button onClick={toggleMasterEditMode} id="masterEditBtn" className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-[#23242c]">
                <Icon className="w-3 h-3"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></Icon>
                <span id="masterEditBtnLabel">{editMode ? 'Salt Okunur' : 'Düzenleme Modu'}</span>
              </button>
              <button onClick={saveMasterJSON} className="flex items-center gap-1 px-3 py-1 text-[10px] font-semibold bg-violet-600 text-white rounded-md hover:bg-violet-700">
                <Icon className="w-3 h-3"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></Icon>
                Kaydet & Deploy
              </button>
            </div>
          </div>

          <div id="masterViewCards" className={`${masterView === 'cards' ? '' : 'hidden'} p-4 space-y-3`}>
            <MasterIdentityForm editMode={editMode} onDirty={() => setDirty(true)} />
            <JsonRegistryForm editMode={editMode} onAdd={(category) => setToast({ title: 'JSON Ekleme', message: `${category === 'process' ? 'Süreç' : category === 'service' ? 'Hizmet' : 'Sistem'} kategorisine yeni JSON ekleme ekranı açılıyor`, color: 'violet' })} onRemove={(name) => setToast({ title: 'JSON Kaldırma', message: `${name} registry'den kaldırılacak · onay gerekir`, color: 'amber' })} />
            <OrchestrationRules editMode={editMode} onDirty={() => setDirty(true)} />
            <GovernanceForm editMode={editMode} onDirty={() => setDirty(true)} />
            <div className="flex items-center justify-between gap-2 text-[10px] text-gray-500 dark:text-gray-500 pt-2 border-t border-gray-100 dark:border-gray-700/40">
              <span className="flex items-center gap-2 flex-wrap">
                <span className="font-mono">JSON · 142KB</span><span>·</span><span className="font-mono">42 key</span><span>·</span><span className="font-mono">15 alt JSON referansı</span>
              </span>
              <span>Son kayıt: <span className="font-semibold text-gray-700 dark:text-gray-300">2sa önce</span> · <span className="font-mono">osman.atasoy</span></span>
            </div>
          </div>

          <div id="masterViewCode" className={masterView === 'code' ? '' : 'hidden'}>
            <div className="px-4 py-2 bg-amber-50 dark:bg-amber-500/10 border-b border-amber-200 dark:border-amber-500/20 flex items-center gap-2">
              <Icon className="text-amber-600 dark:text-amber-400 w-3.5 h-3.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></Icon>
              <p className="text-[10px] text-amber-800 dark:text-amber-300"><span className="font-bold">Gelişmiş:</span> Ham JSON görünümü sadece geliştirici referansıdır. Olağan kullanımda <span className="font-semibold">Form</span> görünümünü tercih edin.</p>
            </div>
            <MasterJsonCode editMode={editMode} onDirty={() => setDirty(true)} />
          </div>
        </div>

        <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden mt-5">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700/40 flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <Icon className="text-violet-600 dark:text-violet-400 w-4 h-4"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></Icon>
              <div>
                <h4 className="text-[13px] font-bold text-gray-900 dark:text-gray-100">JSON → Prompt → Agent → Model Bağlantı Zinciri</h4>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">Her hizmet bu zinciri izler · "ADOS AI SEO" örnek olarak vurgulanmıştır</p>
              </div>
            </div>
            <div className="flex items-center gap-1 flex-wrap">
              <RegistryFilterButton active={registryFilter === 'all'} onClick={() => filterRegistry('all')}>Tümü ({REGISTRY.length})</RegistryFilterButton>
              <RegistryFilterButton active={registryFilter === 'process'} color="sky" onClick={() => filterRegistry('process')}>Süreç ({processJsons.length})</RegistryFilterButton>
              <RegistryFilterButton active={registryFilter === 'service'} color="emerald" onClick={() => filterRegistry('service')}>Hizmet ({serviceJsons.length})</RegistryFilterButton>
              <RegistryFilterButton active={registryFilter === 'system'} color="violet" onClick={() => filterRegistry('system')}>Sistem ({systemJsons.length})</RegistryFilterButton>
            </div>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700/40">
            {filteredRegistry.map((item) => <RegistryRow key={item.id} item={item} onOpen={openJsonEditor} />)}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 mt-5">
          <VersionHistory onRollback={(version) => setToast({ title: 'Geri Alma Onayı', message: `Master.JSON ${version}'a geri alınacak · onay gerekir`, color: 'amber' })} />
          <EventStream />
        </div>

        {selectedJson ? <JsonDetailModal item={selectedJson} onClose={() => setSelectedJson(null)} onValidate={() => setToast({ title: 'Validate Başarılı', message: `${selectedJson.name} · şema geçerli · bağlantı zinciri doğrulandı`, color: 'emerald' })} onSave={() => { setSelectedJson(null); setToast({ title: 'Kaydedildi & Deploy', message: `${selectedJson.name} yeni versiyonu oluşturuldu · audit log’a yazıldı`, color: 'emerald' }); }} /> : null}
        <Toast toast={toast} onClose={() => setToast(null)} />
      </div>
    </Layout>
  );
}

function KpiCard({ label, value, sub, clr }: { label: string; value: string; sub: string; clr: ColorName }) {
  const cm = CM[clr] || CM.gray;
  return (
    <div className="relative overflow-hidden bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-3.5 hover:shadow-sm transition-all">
      <div className={`absolute -top-8 -right-8 w-24 h-24 bg-${clr}-500/5 rounded-full blur-xl pointer-events-none`}></div>
      <p className="relative text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">{label}</p>
      <p className={`relative text-[22px] font-bold ${cm.t} font-mono leading-none mb-0.5`}>{value}</p>
      <p className="relative text-[9px] text-gray-400 dark:text-gray-500">{sub}</p>
    </div>
  );
}

function MasterIdentityForm({ editMode, onDirty }: { editMode: boolean; onDirty: () => void }) {
  const inputClass = `mj-input w-full px-3 py-2 text-[12px] bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 disabled:opacity-70 focus:outline-none focus:border-violet-500 ${editMode ? 'ring-2 ring-violet-300 dark:ring-violet-500/40' : ''}`;
  return (
    <div className="bg-gray-50 dark:bg-[#17181f] border border-gray-200 dark:border-gray-700/40 rounded-lg overflow-hidden">
      <div className="px-4 py-2.5 border-b border-gray-200 dark:border-gray-700/40 bg-white dark:bg-[#1e1f26] flex items-center gap-2">
        <Icon className="text-violet-600 dark:text-violet-400 w-3.5 h-3.5"><circle cx="12" cy="12" r="10" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></Icon>
        <h5 className="text-[11px] font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Genel Kimlik</h5>
        <span className="text-[9px] text-gray-500 dark:text-gray-500 ml-auto">4 alan</span>
      </div>
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Şema</label><input data-mj-field="schema" disabled={!editMode} defaultValue="ados.master.v4" onChange={onDirty} className={`${inputClass} font-mono`} /></div>
        <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Versiyon</label><input data-mj-field="version" disabled={!editMode} defaultValue="4.1.0" onChange={onDirty} className={`${inputClass} font-mono`} /></div>
        <div className="md:col-span-2"><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Ad</label><input data-mj-field="name" disabled={!editMode} defaultValue="ADOS Master Orchestrator" onChange={onDirty} className={inputClass} /></div>
        <div className="md:col-span-2"><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Açıklama</label><textarea data-mj-field="description" disabled={!editMode} rows={2} defaultValue="Arma Digital İşletim Sistemi · tüm hizmet ve süreç JSON'larını koordine eder" onChange={onDirty} className={`${inputClass} resize-none`} /></div>
      </div>
    </div>
  );
}

function JsonRegistryForm({ editMode, onAdd, onRemove }: { editMode: boolean; onAdd: (category: Exclude<JsonCategory, 'core'>) => void; onRemove: (name: string) => void }) {
  return (
    <div className="bg-gray-50 dark:bg-[#17181f] border border-gray-200 dark:border-gray-700/40 rounded-lg overflow-hidden">
      <div className="px-4 py-2.5 border-b border-gray-200 dark:border-gray-700/40 bg-white dark:bg-[#1e1f26] flex items-center gap-2">
        <Icon className="text-violet-600 dark:text-violet-400 w-3.5 h-3.5"><path d="M4 4h16v16H4z" /><path d="M4 12h16" /><path d="M12 4v16" /></Icon>
        <h5 className="text-[11px] font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">JSON Registry</h5>
        <span className="text-[9px] text-gray-500 dark:text-gray-500 ml-auto">15 kayıtlı JSON · 3 kategori</span>
      </div>
      <div className="p-4 space-y-3">
        <RegistryGroup title="Süreç JSON'ları" desc="iş akışları" color="sky" items={['Satis_Talimat.JSON', 'Finans_Talimat.JSON', 'Pazarlama_Talimat.JSON', 'Operasyon_Ekip.JSON']} editMode={editMode} onAdd={() => onAdd('process')} onRemove={onRemove} />
        <RegistryGroup title="Hizmet JSON'ları" desc="ADOS servisleri · Satış Panosu hizmetleri" color="emerald" items={['SEO_Strateji.JSON', 'Google_Ads.JSON', 'Sosyal_Medya.JSON', 'Produksiyon.JSON', 'Domain_Hosting.JSON', 'Marka_Tescili.JSON', 'Web_Sitesi.JSON', 'Premium_360.JSON']} editMode={editMode} onAdd={() => onAdd('service')} onRemove={onRemove} />
        <RegistryGroup title="Sistem JSON'ları" desc="altyapı servisleri" color="violet" items={['Maliyet_Analiz.JSON', 'AI_Router.JSON', 'Integrations.JSON']} editMode={editMode} onAdd={() => onAdd('system')} onRemove={onRemove} />
      </div>
    </div>
  );
}

function RegistryGroup({ title, desc, color, items, editMode, onAdd, onRemove }: { title: string; desc: string; color: ColorName; items: string[]; editMode: boolean; onAdd: () => void; onRemove: (name: string) => void }) {
  return (
    <div className={`bg-white dark:bg-[#1e1f26] border border-${color}-200 dark:border-${color}-500/30 rounded-lg p-3`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2"><span className={`w-1.5 h-4 bg-${color}-500 rounded-full`}></span><h6 className={`text-[11px] font-bold text-${color}-700 dark:text-${color}-300`}>{title}</h6><span className="text-[9px] text-gray-500 dark:text-gray-500">{desc}</span></div>
        <button onClick={onAdd} disabled={!editMode} className={`mj-edit-btn ${editMode ? 'opacity-100' : 'opacity-30'} text-[10px] font-semibold text-${color}-700 dark:text-${color}-300 hover:bg-${color}-50 dark:hover:bg-${color}-500/10 px-2 py-0.5 rounded flex items-center gap-1`}><Icon className="w-2.5 h-2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></Icon>Ekle</button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => <span key={item} className={`group inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-1 bg-${color}-50 dark:bg-${color}-500/10 text-${color}-700 dark:text-${color}-300 border border-${color}-200 dark:border-${color}-500/30 rounded`}>{item}<button onClick={() => onRemove(item)} disabled={!editMode} className={`mj-edit-btn hidden ${editMode ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'} text-${color}-500 hover:text-rose-600 transition-colors`}><Icon className="w-2.5 h-2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Icon></button></span>)}
      </div>
    </div>
  );
}

function OrchestrationRules({ editMode, onDirty }: { editMode: boolean; onDirty: () => void }) {
  const inputClass = `mj-input w-full px-3 py-2 text-[12px] bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono disabled:opacity-70 focus:outline-none focus:border-violet-500 ${editMode ? 'ring-2 ring-violet-300 dark:ring-violet-500/40' : ''}`;
  return (
    <div className="bg-gray-50 dark:bg-[#17181f] border border-gray-200 dark:border-gray-700/40 rounded-lg overflow-hidden">
      <div className="px-4 py-2.5 border-b border-gray-200 dark:border-gray-700/40 bg-white dark:bg-[#1e1f26] flex items-center gap-2">
        <Icon className="text-violet-600 dark:text-violet-400 w-3.5 h-3.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></Icon>
        <h5 className="text-[11px] font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Orkestrasyon Kuralları</h5>
        <span className="text-[9px] text-gray-500 dark:text-gray-500 ml-auto">karar & yürütme politikası</span>
      </div>
      <div className="p-4 space-y-3">
        <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Kapalı Döngü</label><div className="flex items-center gap-2 flex-wrap p-2.5 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-md">{['Ölç', 'Analiz', 'Karar', 'Aksiyon', 'Ölçüm'].map((step, index, arr) => <span key={step} className="flex items-center gap-2"><span className="text-[11px] font-bold text-gray-900 dark:text-gray-100">{step}</span>{index < arr.length - 1 ? <span className="text-violet-500">→</span> : null}</span>)}<span className="ml-auto text-[9px] text-gray-400 dark:text-gray-500 italic">mimari sabit</span></div></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Varsayılan Model</label><select data-mj-field="default_model" disabled={!editMode} defaultValue="claude-4.7" onChange={onDirty} className={inputClass}><option value="claude-4.7">claude-4.7</option><option value="gpt-4">gpt-4</option><option value="gemini-2.0">gemini-2.0</option></select></div>
          <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Paralel Trigger Limiti</label><input data-mj-field="max_parallel_triggers" disabled={!editMode} type="number" defaultValue="12" onChange={onDirty} className={inputClass} /></div>
        </div>
        <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Fallback Zinciri</label><div className="flex items-center gap-2 flex-wrap p-2.5 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-md"><span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-1 bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-500/30 rounded">1. claude-4.7</span><span className="text-gray-400">→</span><span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 rounded">2. gpt-4</span><span className="text-gray-400">→</span><span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-1 bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-500/30 rounded">3. gemini-2.0</span><span className="ml-auto text-[9px] text-gray-400 dark:text-gray-500 italic">birincil başarısız olursa sıradaki</span></div></div>
        <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Onay Gereken İşlemler</label><div className="flex flex-wrap gap-1.5 p-2.5 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-md min-h-[42px]">{['budget.*', 'contract.sign', 'discount.above_15', 'cost.limit_override', 'hr.terminate'].map((rule) => <span key={rule} className="group inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-1 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30 rounded">{rule}<button disabled={!editMode} className={`mj-edit-btn ${editMode ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'} text-amber-500 hover:text-rose-600 transition-colors`}><Icon className="w-2.5 h-2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Icon></button></span>)}<button disabled={!editMode} className={`mj-edit-btn ${editMode ? 'opacity-100' : 'opacity-30'} inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-500/10 border border-dashed border-amber-300 dark:border-amber-500/40 rounded`}><Icon className="w-2.5 h-2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></Icon>Kural Ekle</button></div></div>
      </div>
    </div>
  );
}

function GovernanceForm({ editMode, onDirty }: { editMode: boolean; onDirty: () => void }) {
  const inputClass = `mj-input w-full px-3 py-2 text-[12px] bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono disabled:opacity-70 focus:outline-none focus:border-violet-500 ${editMode ? 'ring-2 ring-violet-300 dark:ring-violet-500/40' : ''}`;
  return (
    <div className="bg-gray-50 dark:bg-[#17181f] border border-gray-200 dark:border-gray-700/40 rounded-lg overflow-hidden">
      <div className="px-4 py-2.5 border-b border-gray-200 dark:border-gray-700/40 bg-white dark:bg-[#1e1f26] flex items-center gap-2"><Icon className="text-violet-600 dark:text-violet-400 w-3.5 h-3.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></Icon><h5 className="text-[11px] font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Yönetişim</h5><span className="text-[9px] text-gray-500 dark:text-gray-500 ml-auto">audit · saklama · güvenlik</span></div>
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="md:col-span-2"><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Audit Endpoint</label><input data-mj-field="audit_endpoint" disabled={!editMode} defaultValue="timescaledb://audit_stream" onChange={onDirty} className={inputClass} /></div>
        <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Saklama Süresi</label><div className="flex items-center gap-2"><input data-mj-field="retention_days" disabled={!editMode} type="number" defaultValue="365" onChange={onDirty} className={`${inputClass} flex-1`} /><span className="text-[11px] text-gray-500 dark:text-gray-400">gün</span></div></div>
        <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">MFA Zorunlu Roller</label><div className="flex flex-wrap gap-1 p-2 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-md min-h-[38px]"><span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 rounded">admin</span><span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 rounded">manager</span></div></div>
      </div>
    </div>
  );
}

function MasterJsonCode({ editMode, onDirty }: { editMode: boolean; onDirty: () => void }) {
  return (
    <div className="p-4 bg-gray-900 dark:bg-[#0a0b0f] font-mono text-[11px] leading-relaxed overflow-x-auto">
      <pre id="masterJsonEditor" contentEditable={editMode} suppressContentEditableWarning spellCheck={false} onInput={onDirty} className={`text-gray-300 outline-none ${editMode ? 'bg-violet-500/5' : ''}`}><span className="text-violet-400">{'{'}</span>{'\n'}
  <span className="text-sky-400">"schema"</span>: <span className="text-emerald-400">"ados.master.v4"</span>,{'\n'}
  <span className="text-sky-400">"version"</span>: <span className="text-emerald-400">"4.1.0"</span>,{'\n'}
  <span className="text-sky-400">"name"</span>: <span className="text-emerald-400">"ADOS Master Orchestrator"</span>,{'\n'}
  <span className="text-sky-400">"description"</span>: <span className="text-emerald-400">"Arma Digital İşletim Sistemi · tüm hizmet ve süreç JSON'larını koordine eder"</span>,{'\n\n'}
  <span className="text-sky-400">"registry"</span>: <span className="text-violet-400">{'{'}</span>{'\n'}
    <span className="text-sky-400">"process"</span>: <span className="text-violet-400">[</span><span className="text-emerald-400">"Satis_Talimat.JSON"</span>, <span className="text-emerald-400">"Finans_Talimat.JSON"</span>, <span className="text-emerald-400">"Pazarlama_Talimat.JSON"</span>, <span className="text-emerald-400">"Operasyon_Ekip.JSON"</span><span className="text-violet-400">]</span>,{'\n'}
    <span className="text-sky-400">"services"</span>: <span className="text-violet-400">[</span><span className="text-emerald-400">"SEO_Strateji.JSON"</span>, <span className="text-emerald-400">"Google_Ads.JSON"</span>, <span className="text-emerald-400">"Sosyal_Medya.JSON"</span>, <span className="text-emerald-400">"Produksiyon.JSON"</span>, <span className="text-emerald-400">"Domain_Hosting.JSON"</span>, <span className="text-emerald-400">"Marka_Tescili.JSON"</span>, <span className="text-emerald-400">"Web_Sitesi.JSON"</span>, <span className="text-emerald-400">"Premium_360.JSON"</span><span className="text-violet-400">]</span>,{'\n'}
    <span className="text-sky-400">"system"</span>: <span className="text-violet-400">[</span><span className="text-emerald-400">"Maliyet_Analiz.JSON"</span>, <span className="text-emerald-400">"AI_Router.JSON"</span>, <span className="text-emerald-400">"Integrations.JSON"</span><span className="text-violet-400">]</span>{'\n'}
  <span className="text-violet-400">{'}'}</span>,{'\n\n'}
  <span className="text-sky-400">"orchestration"</span>: <span className="text-violet-400">{'{'}</span>{'\n'}
    <span className="text-sky-400">"loop"</span>: <span className="text-emerald-400">"measure → analyze → decide → act → measure"</span>,{'\n'}
    <span className="text-sky-400">"default_model"</span>: <span className="text-emerald-400">"claude-4.7"</span>,{'\n'}
    <span className="text-sky-400">"fallback_chain"</span>: <span className="text-violet-400">[</span><span className="text-emerald-400">"gpt-4"</span>, <span className="text-emerald-400">"gemini-2.0"</span><span className="text-violet-400">]</span>,{'\n'}
    <span className="text-sky-400">"max_parallel_triggers"</span>: <span className="text-amber-400">12</span>,{'\n'}
    <span className="text-sky-400">"approval_required"</span>: <span className="text-violet-400">[</span><span className="text-emerald-400">"budget.*"</span>, <span className="text-emerald-400">"contract.sign"</span>, <span className="text-emerald-400">"discount.above_15"</span>, <span className="text-emerald-400">"cost.limit_override"</span>, <span className="text-emerald-400">"hr.terminate"</span><span className="text-violet-400">]</span>{'\n'}
  <span className="text-violet-400">{'}'}</span>,{'\n\n'}
  <span className="text-sky-400">"governance"</span>: <span className="text-violet-400">{'{'}</span>{'\n'}
    <span className="text-sky-400">"audit_endpoint"</span>: <span className="text-emerald-400">"timescaledb://audit_stream"</span>,{'\n'}
    <span className="text-sky-400">"retention_days"</span>: <span className="text-amber-400">365</span>,{'\n'}
    <span className="text-sky-400">"mfa_required_for"</span>: <span className="text-violet-400">[</span><span className="text-emerald-400">"admin"</span>, <span className="text-emerald-400">"manager"</span><span className="text-violet-400">]</span>{'\n'}
  <span className="text-violet-400">{'}'}</span>,{'\n\n'}
  <span className="text-sky-400">"updated_at"</span>: <span className="text-emerald-400">"2026-04-23T21:18:00+03:00"</span>,{'\n'}
  <span className="text-sky-400">"updated_by"</span>: <span className="text-emerald-400">"osman.atasoy"</span>{'\n'}
<span className="text-violet-400">{'}'}</span></pre>
    </div>
  );
}

function RegistryFilterButton({ children, active, color = 'gray', onClick }: { children: ReactNode; active: boolean; color?: ColorName; onClick: () => void }) {
  const activeClass = 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 border-gray-900 dark:border-gray-100';
  const inactiveClass = color === 'gray' ? 'bg-white dark:bg-[#17181f] text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700' : `bg-${color}-50 dark:bg-${color}-500/10 text-${color}-700 dark:text-${color}-300 border-${color}-200 dark:border-${color}-500/30`;
  return <button onClick={onClick} className={`px-2.5 py-1 text-[10px] font-semibold rounded-full border ${active ? activeClass : inactiveClass}`}>{children}</button>;
}

function RegistryRow({ item, onOpen }: { item: RegistryItem; onOpen: (item: RegistryItem) => void }) {
  const catClr: ColorName = item.category === 'process' ? 'sky' : item.category === 'service' ? 'emerald' : 'violet';
  const catLbl = item.category === 'process' ? 'Süreç' : item.category === 'service' ? 'Hizmet' : 'Sistem';
  return (
    <div className={`p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${item.highlight ? 'bg-amber-50/40 dark:bg-amber-500/5 border-l-2 border-amber-400 dark:border-amber-500' : ''}`}>
      <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
        <button onClick={() => onOpen(item)} className="flex items-center gap-2.5 min-w-0 text-left">
          <div className={`w-8 h-8 bg-${catClr}-100 dark:bg-${catClr}-500/20 rounded-lg flex items-center justify-center shrink-0`}><Icon className={`text-${catClr}-700 dark:text-${catClr}-300 w-4 h-4`}><path d="M4 4h16v16H4z" /><path d="M4 12h16" /><path d="M12 4v16" /></Icon></div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-[13px] font-bold text-gray-900 dark:text-gray-100 font-mono">{item.name}</p>
              <span className="text-[9px] font-mono text-gray-400 dark:text-gray-500">{item.version}</span>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 bg-${catClr}-100 dark:bg-${catClr}-900/30 text-${catClr}-700 dark:text-${catClr}-300 rounded`}>{catLbl}</span>
              {item.highlight ? <span className="text-[9px] font-bold px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded">★ ADOS AI SEO · ÖRNEK</span> : null}
            </div>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{item.description}</p>
          </div>
        </button>
        <div className="flex items-center gap-1 shrink-0">
          <span className="text-[9px] font-mono text-gray-400 dark:text-gray-500">{item.size} · {item.triggers} trigger · son {item.lastUpdate}</span>
          <button onClick={() => onOpen(item)} className="ml-2 flex items-center gap-1 px-2 py-1 text-[10px] font-semibold text-violet-700 dark:text-violet-300 hover:bg-violet-50 dark:hover:bg-violet-500/10 rounded transition-colors">
            <Icon className="w-3 h-3"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></Icon>
            Düzenle
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
        <ChainBox color="sky" title={`Promptlar (${item.prompts.filter((prompt) => prompt !== '—').length})`} icon={<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />}>{item.prompts.slice(0, 3).map((prompt) => prompt === '—' ? <span key={prompt} className="text-[9px] text-gray-400 dark:text-gray-500 italic">prompt gerektirmiyor</span> : <div key={prompt} className="text-[9px] font-mono text-sky-800 dark:text-sky-200 truncate" title={prompt}>{prompt}</div>)}{item.prompts.length > 3 ? <div className="text-[9px] text-sky-600 dark:text-sky-400 italic">+{item.prompts.length - 3} daha</div> : null}</ChainBox>
        <ChainBox color="indigo" title="Agent" icon={<><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83" /></>}>{item.agent === '—' ? <p className="text-[9px] text-gray-400 dark:text-gray-500 italic">agent yok</p> : <><p className="text-[11px] font-semibold text-indigo-900 dark:text-indigo-100">{item.agent}</p><p className="text-[9px] font-mono text-indigo-600 dark:text-indigo-400">{item.agentVer}</p></>}</ChainBox>
        <ChainBox color="violet" title="AI Model" icon={<><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></>}><p className="text-[11px] font-semibold text-violet-900 dark:text-violet-100">{item.model}</p></ChainBox>
        <ChainBox color="amber" title="Entegrasyonlar" icon={<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />}><div className="space-y-0.5">{item.apis.slice(0, 3).map((api) => <div key={api} className="text-[9px] text-amber-800 dark:text-amber-200 truncate">{api}</div>)}{item.apis.length > 3 ? <div className="text-[9px] text-amber-600 dark:text-amber-400 italic">+{item.apis.length - 3} daha</div> : null}</div></ChainBox>
        <ChainBox color="emerald" title="Tetikleyici" icon={<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />}><p className="text-[10px] text-emerald-800 dark:text-emerald-200 leading-snug">{item.trigger}</p></ChainBox>
      </div>
    </div>
  );
}

function ChainBox({ color, title, icon, children }: { color: ColorName; title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <div className={`bg-${color}-50 dark:bg-${color}-500/5 border border-${color}-200 dark:border-${color}-500/20 rounded-lg p-2.5`}>
      <p className={`text-[8px] font-bold text-${color}-700 dark:text-${color}-300 uppercase tracking-wider mb-1.5 flex items-center gap-1`}><Icon className="w-2.5 h-2.5">{icon}</Icon>{title}</p>
      {children}
    </div>
  );
}

function VersionHistory({ onRollback }: { onRollback: (version: string) => void }) {
  return (
    <div className="lg:col-span-2 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-gray-100 dark:border-gray-700/40 flex items-center justify-between gap-2 flex-wrap"><div className="flex items-center gap-2"><Icon className="text-violet-600 dark:text-violet-400 w-4 h-4"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></Icon><div><h4 className="text-[13px] font-bold text-gray-900 dark:text-gray-100">Versiyon Geçmişi</h4><p className="text-[10px] text-gray-500 dark:text-gray-400">Master.JSON kayıt zinciri</p></div></div></div>
      <div className="divide-y divide-gray-100 dark:divide-gray-700/40">
        {VERSION_HISTORY.map((item, index) => {
          const tClr: ColorName = item.type === 'major' ? 'rose' : item.type === 'minor' ? 'sky' : 'gray';
          return <div key={item.version} className="p-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"><div className="flex items-start gap-2.5"><div className="shrink-0 flex flex-col items-center"><div className={`w-6 h-6 bg-${tClr}-100 dark:bg-${tClr}-900/30 rounded-full flex items-center justify-center`}><span className={`w-1.5 h-1.5 bg-${tClr}-500 rounded-full`}></span></div>{index < VERSION_HISTORY.length - 1 ? <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mt-1"></div> : null}</div><div className="flex-1 min-w-0 pb-1"><div className="flex items-center gap-2 flex-wrap"><span className="text-[11px] font-bold font-mono text-gray-900 dark:text-gray-100">{item.version}</span><span className={`text-[9px] font-semibold px-1.5 py-0.5 bg-${tClr}-100 dark:bg-${tClr}-900/30 text-${tClr}-700 dark:text-${tClr}-300 rounded uppercase tracking-wider`}>{item.type}</span></div><p className="text-[11px] text-gray-700 dark:text-gray-300 leading-snug mt-0.5">{item.change}</p><p className="text-[9px] text-gray-500 dark:text-gray-500 mt-1">{item.time} · {item.author}</p></div><button onClick={() => onRollback(item.version)} className="shrink-0 text-[9px] font-semibold text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors p-1"><Icon className="w-3 h-3"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" /></Icon></button></div></div>;
        })}
      </div>
    </div>
  );
}

function EventStream() {
  return (
    <div className="lg:col-span-3 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-gray-100 dark:border-gray-700/40 flex items-center justify-between gap-2 flex-wrap"><div className="flex items-center gap-2"><Icon className="text-emerald-600 dark:text-emerald-400 w-4 h-4"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></Icon><div><h4 className="text-[13px] font-bold text-gray-900 dark:text-gray-100">Canlı Event Stream</h4><p className="text-[10px] text-gray-500 dark:text-gray-400">Real-time akış · <span className="font-mono">TimescaleDB</span> · son 6 event</p></div></div><span className="text-[9px] font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>Canlı</span></div>
      <div className="divide-y divide-gray-100 dark:divide-gray-700/40">
        {EVENTS.map((item) => <div key={`${item.time}-${item.event}`} className="p-2.5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex items-center gap-2.5 text-[10px]"><span className="font-mono text-gray-400 dark:text-gray-500 shrink-0 w-16">{item.time}</span><span className="font-semibold text-gray-900 dark:text-gray-100 shrink-0 w-28 truncate">{item.event}</span><span className="font-mono text-violet-700 dark:text-violet-300 shrink-0 truncate">{item.src}</span><Icon className="text-gray-400 dark:text-gray-500 w-2.5 h-2.5 shrink-0"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></Icon><span className="font-mono text-sky-700 dark:text-sky-300 flex-1 truncate">{item.target}</span><span className="font-mono text-gray-400 dark:text-gray-500 shrink-0">{item.latency}</span></div>)}
      </div>
    </div>
  );
}

function JsonDetailModal({ item, onClose, onValidate, onSave }: { item: RegistryItem; onClose: () => void; onValidate: () => void; onSave: () => void }) {
  const catClr: ColorName = item.category === 'process' ? 'sky' : item.category === 'service' ? 'emerald' : item.category === 'system' ? 'violet' : 'gray';
  const catLbl = item.category === 'process' ? 'Süreç' : item.category === 'service' ? 'Hizmet' : item.category === 'system' ? 'Sistem' : 'Core';
  return (
    <>
      <div className="modal-overlay absolute inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose}></div>
      <div className="modal-panel absolute inset-0 flex items-start justify-center p-4 pointer-events-none z-50">
        <div className="modal-scroll bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-xl w-full max-w-[760px] max-h-[90vh] overflow-y-auto pointer-events-auto">
          <div className="sticky top-0 z-10 bg-white dark:bg-[#1e1f26] border-b border-gray-100 dark:border-gray-700/60 p-5 flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 bg-${catClr}-100 dark:bg-${catClr}-500/20 rounded-lg flex items-center justify-center shrink-0`}><Icon className={`text-${catClr}-700 dark:text-${catClr}-300 w-5 h-5`}><path d="M4 4h16v16H4z" /><path d="M4 12h16" /><path d="M12 4v16" /></Icon></div>
              <div><div className="flex items-center gap-2 flex-wrap"><h2 className="text-[18px] font-bold text-gray-900 dark:text-gray-100 font-mono">{item.name}</h2><span className={`text-[9px] font-bold px-1.5 py-0.5 bg-${catClr}-100 dark:bg-${catClr}-900/30 text-${catClr}-700 dark:text-${catClr}-300 rounded`}>{catLbl}</span><span className="text-[9px] font-mono text-gray-400 dark:text-gray-500">{item.version}</span></div><p className="text-[12px] text-gray-600 dark:text-gray-400">{item.size} · {item.triggers} trigger · son {item.lastUpdate}</p></div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors p-1"><Icon className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Icon></button>
          </div>
          <div className="p-5 space-y-4">
            <div className="bg-gray-50 dark:bg-[#17181f] border border-gray-200 dark:border-gray-700/40 rounded-lg p-4"><p className="text-[12px] text-gray-700 dark:text-gray-300 leading-relaxed">{item.description}</p></div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
              <ChainBox color="sky" title={`Promptlar (${item.prompts.filter((prompt) => prompt !== '—').length})`} icon={<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />}>{item.prompts.map((prompt) => prompt === '—' ? <span key={prompt} className="text-[9px] text-gray-400 dark:text-gray-500 italic">prompt gerektirmiyor</span> : <div key={prompt} className="text-[9px] font-mono text-sky-800 dark:text-sky-200 break-all">{prompt}</div>)}</ChainBox>
              <ChainBox color="indigo" title="Agent" icon={<circle cx="12" cy="12" r="3" />}><p className="text-[11px] font-semibold text-indigo-900 dark:text-indigo-100">{item.agent}</p><p className="text-[9px] font-mono text-indigo-600 dark:text-indigo-400">{item.agentVer}</p></ChainBox>
              <ChainBox color="violet" title="AI Model" icon={<polyline points="16 18 22 12 16 6" />}><p className="text-[11px] font-semibold text-violet-900 dark:text-violet-100">{item.model}</p></ChainBox>
              <ChainBox color="amber" title="Entegrasyonlar" icon={<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />}><div className="space-y-0.5">{item.apis.map((api) => <div key={api} className="text-[9px] text-amber-800 dark:text-amber-200 truncate">{api}</div>)}</div></ChainBox>
              <ChainBox color="emerald" title="Tetikleyici" icon={<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />}><p className="text-[10px] text-emerald-800 dark:text-emerald-200 leading-snug">{item.trigger}</p></ChainBox>
            </div>
          </div>
          <div className="sticky bottom-0 bg-white dark:bg-[#1e1f26] border-t border-gray-100 dark:border-gray-700/60 p-4 flex items-center justify-between gap-2 flex-wrap">
            <button onClick={onClose} className="px-3 py-2 text-[11px] font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">Kapat</button>
            <div className="flex items-center gap-2"><button onClick={onValidate} className="px-3 py-2 text-[11px] font-semibold bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-[#23242c]">Validate</button><button onClick={onSave} className="flex items-center gap-1.5 px-4 py-2 text-[11px] font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"><Icon className="w-3.5 h-3.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /></Icon>Kaydet & Deploy</button></div>
          </div>
        </div>
      </div>
    </>
  );
}

function Toast({ toast, onClose }: { toast: ToastState; onClose: () => void }) {
  if (!toast) return null;
  const clrs: Record<ColorName, { bg: string; bd: string }> = { emerald: { bg: '#10b981', bd: '#059669' }, rose: { bg: '#f43f5e', bd: '#e11d48' }, amber: { bg: '#f59e0b', bd: '#d97706' }, sky: { bg: '#0ea5e9', bd: '#0284c7' }, violet: { bg: '#8b5cf6', bd: '#7c3aed' }, indigo: { bg: '#6366f1', bd: '#4f46e5' }, teal: { bg: '#14b8a6', bd: '#0d9488' }, pink: { bg: '#ec4899', bd: '#db2777' }, gray: { bg: '#6b7280', bd: '#4b5563' } };
  const color = clrs[toast.color] || clrs.emerald;
  return (
    <div style={{ position: 'absolute', bottom: '24px', right: '24px', zIndex: 9999, minWidth: '280px', maxWidth: '400px', background: 'white', borderLeft: `4px solid ${color.bd}`, borderRadius: '10px', boxShadow: '0 8px 24px rgba(0,0,0,.15)', padding: '14px 16px', animation: 'toastSlide .3s ease-out' }}>
      <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}><div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: '13px', color: color.bg, marginBottom: '2px' }}>{toast.title}</div><div style={{ fontSize: '11px', color: '#6b7280' }}>{toast.message}</div></div><button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: '16px' }}>×</button></div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, height: '2px', background: color.bg, borderRadius: '0 0 10px 10px', animation: 'toastProgress 3s linear' }}></div>
    </div>
  );
}
