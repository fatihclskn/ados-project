import { type ReactNode, useMemo, useState } from 'react';
import Layout from '../components/Layout';

type ColorName = 'emerald' | 'amber' | 'rose' | 'sky' | 'violet' | 'indigo' | 'teal' | 'pink' | 'gray';
type PromptStatus = 'active' | 'review' | 'deprecated' | 'paused';
type PromptView = 'form' | 'raw';
type ModalMode = 'view' | 'edit';
type WizardStart = 'upload' | 'scratch' | 'copy';
type ToastState = { title: string; message: string; color: ColorName } | null;

type PromptItem = {
  id: string;
  name: string;
  version: string;
  category: string;
  categoryClr: ColorName;
  description: string;
  model: string;
  temperature: number;
  maxTokens: number;
  uses: number;
  lastUpdate: string;
  status: PromptStatus;
  boundJsons: string[];
  boundAgents: string[];
  content: string;
  highlight?: boolean;
};

type PromptStep = {
  key: 'basic' | 'content' | 'model' | 'bindings' | 'tests' | 'versions';
  title: string;
  desc: string;
  icon: ReactNode;
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

const CATEGORY_COLOR: Record<string, ColorName> = {
  Satış: 'emerald',
  Pazarlama: 'pink',
  Finans: 'amber',
  Ads: 'indigo',
  SEO: 'sky',
  'Sosyal Medya': 'rose',
  Prodüksiyon: 'teal',
  'Marka Tescili': 'amber',
  Müşteri: 'violet',
  Sistem: 'violet',
};

const PROMPTS: PromptItem[] = [
  { id: 'p_teklif_v3', name: 'prompt_teklif_hazirlama_v3.0', version: 'v3.0', category: 'Satış', categoryClr: 'emerald', description: 'Müşteri için özel teklif üretimi · hizmet bazlı fiyatlama · iskonto hesabı', model: 'Claude 4.7', temperature: 0.4, maxTokens: 3200, uses: 234, lastUpdate: '3sa', status: 'active', boundJsons: ['Satis_Talimat.JSON'], boundAgents: ['SalesAgent'], content: `# ADOS Teklif Hazırlama

## Rol
Sen Arma Digital'in deneyimli satış uzmanısın. Müşterinin ihtiyaçlarına özel, net ve ikna edici teklif hazırlarsın.

## Girdi
- Müşteri: {{musteri_adi}}
- Sektör: {{sektor}}
- İhtiyaç: {{ihtiyac_listesi}}
- Hedef Bütçe: {{butce_araligi}}

## Görev
1. İhtiyaçları hizmet paketlerine eşle (Web/SEO/Ads/Sosyal/Prodüksiyon/Premium 360)
2. Her hizmet için paket ve fiyat öner
3. İskonto stratejisi (max %15, %15+ için onay gerekli)
4. Teklif metni formatla

## Çıktı Formatı
JSON:
- services[{name, package, price, discount, final}]
- total_before, total_discount, total_final
- recommended_upsell
- proposal_text (müşteriye gönderilecek metin)

## Kurallar
- Hiçbir zaman maliyet altı fiyat önerme
- Premium 360 paket için min 12 ay taahhüt şart
- Sektöre uygun case study referansı ekle` },
  { id: 'p_iskonto_v2', name: 'prompt_iskonto_onay_v2.0', version: 'v2.0', category: 'Satış', categoryClr: 'emerald', description: 'İskonto talebini değerlendirme ve onay kararı · karlılık koruması', model: 'Claude 4.7', temperature: 0.2, maxTokens: 1800, uses: 96, lastUpdate: '1g', status: 'active', boundJsons: ['Satis_Talimat.JSON'], boundAgents: ['ApprovalCoordinator', 'SalesAgent'], content: `# İskonto Onay Değerlendirme

## Rol
Karar verici · karlılık koruyucusu · hızlı ve veriye dayalı.

## Girdi
- Talep edilen iskonto: %{{istenen_iskonto}}
- Teklif tutarı: {{tutar}}
- Müşteri segmenti: {{segment}}
- Hizmet karlılığı: {{karlilik_orani}}
- Rakip teklifi var mı: {{rakip_var}}

## Karar Mantığı
1. İskonto < %10 → OTOMATIK ONAY
2. %10-15 → Koşullu (karlılık kontrolü)
3. %15+ → CEO ONAYI gerekli

## Çıktı
- decision: auto_approve | conditional | requires_ceo
- justification
- counter_offer (varsa)
- risk_level: low/medium/high` },
  { id: 'p_fatura_v1', name: 'prompt_fatura_olustur_v1.2', version: 'v1.2', category: 'Finans', categoryClr: 'amber', description: 'Sözleşmeden fatura üretimi · vade hesabı · KDV · açıklama', model: 'GPT-4', temperature: 0.1, maxTokens: 1200, uses: 142, lastUpdate: '5sa', status: 'active', boundJsons: ['Finans_Talimat.JSON'], boundAgents: ['FinanceAgent'], content: `# Fatura Oluşturma

## Girdi
- Sözleşme ID: {{sozlesme_id}}
- Hizmet kalemleri: {{kalemler}}
- Vade süresi: {{vade_gun}} gün

## Çıktı
- invoice_number (ARM-{{yyyymm}}-{{seq}})
- items[]
- subtotal, kdv (%20), total
- due_date
- description_tr` },
  { id: 'p_kampanya_v2', name: 'prompt_kampanya_plan_v2.0', version: 'v2.0', category: 'Pazarlama', categoryClr: 'pink', description: 'Kampanya planı · hedef kitle · mesaj stratejisi · kanal dağılımı', model: 'Claude 4.7', temperature: 0.7, maxTokens: 3500, uses: 88, lastUpdate: '2g', status: 'active', boundJsons: ['Pazarlama_Talimat.JSON'], boundAgents: ['MarketingAgent'], content: `# Kampanya Planlama

## Rol
Kıdemli pazarlama stratejisti.

## Görev
{{marka}} için {{hedef}} odaklı kampanya planı.

## Çıktı
- objective
- target_audience
- key_message
- channel_mix (Meta/Google/LinkedIn/Email)
- budget_allocation
- kpis
- timeline (6-8 hafta)` },
  { id: 'p_seo_keyword_v32', name: 'prompt_seo_keyword_research_v3.2', version: 'v3.2', category: 'SEO', categoryClr: 'sky', description: 'Keyword araştırma ve analiz · Lokal/Ulusal/Global · rakip analizi', highlight: true, model: 'Claude 4.7', temperature: 0.3, maxTokens: 2800, uses: 186, lastUpdate: '1sa', status: 'active', boundJsons: ['SEO_Strateji.JSON'], boundAgents: ['SeoAgent'], content: `# ADOS AI SEO — Keyword Araştırma

## Rol
Sen SEO uzmanısın. {{kapsam}} seviyesinde (Lokal/Ulusal/Global) keyword analizi yaparsın.

## Girdi
- Müşteri: {{musteri}}
- Sektör: {{sektor}}
- Hedef bölge: {{bolge}}
- Dil: {{dil}}
- Mevcut organik trafik: {{trafik}}
- Rakipler: {{rakip_listesi}}

## Görev
1. Primary keywords (5-10) · yüksek hacim, orta zorluk
2. Secondary keywords (15-25) · long-tail
3. Bilgilendirici keywords
4. Satın alma niyetli keywords
5. Her keyword için: difficulty, search_volume, trend, intent

## Çıktı (JSON)
{
  "primary_keywords": [{keyword, difficulty, volume, trend}],
  "secondary_keywords": [...],
  "intent_distribution": { informational, navigational, transactional },
  "competitor_gap": [...],
  "quick_wins": [...],
  "content_recommendations": [...]
}

## Kurallar
- En az 30 keyword öner
- Zorluk skoru 1-100 arası
- Trend: rising/stable/declining
- Rakip gap analizi dahil et
- Lokal ise coğrafi modifier ekle ("istanbul web tasarım")` },
  { id: 'p_seo_icerik_v21', name: 'prompt_seo_icerik_plani_v2.1', version: 'v2.1', category: 'SEO', categoryClr: 'sky', description: 'SEO uyumlu içerik planı · editorial takvim · internal linking', model: 'Claude 4.7', temperature: 0.5, maxTokens: 3000, uses: 124, lastUpdate: '12sa', status: 'active', boundJsons: ['SEO_Strateji.JSON'], boundAgents: ['SeoAgent'], content: `# SEO İçerik Planı

## Girdi
- Keyword haritası: {{keyword_map}}
- Planlama ufku: {{ay_sayisi}} ay

## Çıktı
- calendar[] (hafta bazlı)
- titles_with_target_kw
- internal_linking_map
- content_pillars` },
  { id: 'p_seo_rapor_v18', name: 'prompt_seo_rapor_v1.8', version: 'v1.8', category: 'SEO', categoryClr: 'sky', description: 'Aylık SEO rapor üretimi · trafik · ranking · öneriler', model: 'Claude 4.7', temperature: 0.3, maxTokens: 4200, uses: 42, lastUpdate: '3g', status: 'active', boundJsons: ['SEO_Strateji.JSON'], boundAgents: ['SeoAgent'], content: `# SEO Aylık Rapor

{{gsc_data}}, {{ahrefs_data}}, {{semrush_data}} girdileriyle
kapsamlı rapor oluştur. Yönetici özeti + detay + aksiyon önerileri.` },
  { id: 'p_ads_budget_v15', name: 'prompt_ads_budget_v1.5', version: 'v1.5', category: 'Ads', categoryClr: 'indigo', description: 'Reklam bütçe optimizasyonu · platform dağılımı · ROAS hedefi', model: 'GPT-4', temperature: 0.2, maxTokens: 2000, uses: 128, lastUpdate: '8dk', status: 'active', boundJsons: ['Google_Ads.JSON'], boundAgents: ['AdsAgent'], content: `# Ads Bütçe Optimizasyonu

## Girdi
- Toplam bütçe: {{butce}}
- Platform performansı son 30 gün
- Hedef ROAS: {{hedef_roas}}x

## Çıktı
- platform_allocation {google, meta, linkedin}
- daily_budgets
- expected_roas
- rationale` },
  { id: 'p_ads_creative_v20', name: 'prompt_ads_creative_v2.0', version: 'v2.0', category: 'Ads', categoryClr: 'indigo', description: 'Reklam kreatif üretimi · başlık · açıklama · CTA varyantları', model: 'GPT-4', temperature: 0.8, maxTokens: 2500, uses: 72, lastUpdate: '1g', status: 'active', boundJsons: ['Google_Ads.JSON'], boundAgents: ['AdsAgent'], content: `# Ads Kreatif Üretimi

4 varyant üret:
- 3 başlık (30 karakter)
- 2 açıklama (90 karakter)
- 3 CTA seçeneği
A/B test için varyasyon farklılaştır.` },
  { id: 'p_ads_emergency_v1', name: 'prompt_ads_budget_emergency_v1', version: 'v1.0', category: 'Ads', categoryClr: 'indigo', description: 'Acil bütçe artırma değerlendirmesi · eşik aşımı onayı', model: 'GPT-4', temperature: 0.1, maxTokens: 1000, uses: 8, lastUpdate: '30dk', status: 'active', boundJsons: ['Google_Ads.JSON'], boundAgents: ['AdsAgent', 'ApprovalCoordinator'], content: 'Performans metriklerini değerlendir, ROAS > {{hedef}} ise öner, değilse reddet.' },
  { id: 'p_social_content_v30', name: 'prompt_social_content_v3.0', version: 'v3.0', category: 'Sosyal Medya', categoryClr: 'rose', description: 'Sosyal medya içerik üretimi · 5 platform · tonuna göre varyasyon', model: 'Claude 4.7', temperature: 0.8, maxTokens: 3200, uses: 156, lastUpdate: '2sa', status: 'active', boundJsons: ['Sosyal_Medya.JSON'], boundAgents: ['SocialAgent'], content: `# Sosyal Medya İçerik

Platform: {{platform}} · Ton: {{ton}} · Konu: {{konu}}
- Başlık/caption
- Görsel briefi
- Hashtag (platform bazlı)
- En uygun paylaşım saati` },
  { id: 'p_social_schedule_v12', name: 'prompt_social_schedule_v1.2', version: 'v1.2', category: 'Sosyal Medya', categoryClr: 'rose', description: 'Haftalık sosyal medya takvimi · 5 platform · optimal saat', model: 'Claude 4.7', temperature: 0.4, maxTokens: 2400, uses: 48, lastUpdate: '4g', status: 'active', boundJsons: ['Sosyal_Medya.JSON'], boundAgents: ['SocialAgent'], content: 'Haftalık 21 post · 5 platform · marka yönergesine uygun takvim oluştur.' },
  { id: 'p_video_brief_v21', name: 'prompt_video_brief_v2.1', version: 'v2.1', category: 'Prodüksiyon', categoryClr: 'teal', description: 'Video brief · hikaye akışı · shot listesi · teknik spec', model: 'GPT-4', temperature: 0.6, maxTokens: 2800, uses: 34, lastUpdate: '1g', status: 'active', boundJsons: ['Produksiyon.JSON'], boundAgents: ['ProductionAgent'], content: `# Video Brief

Reklam/sosyal medya videosu için komple brief oluştur.
Hikaye akışı, shot listesi, süre, müzik önerisi, format.` },
  { id: 'p_marka_benzerlik_v12', name: 'prompt_marka_benzerlik_v1.2', version: 'v1.2', category: 'Marka Tescili', categoryClr: 'amber', description: 'TürkPatent benzerlik tarama analizi · risk skoru', model: 'Claude 4.7', temperature: 0.1, maxTokens: 1800, uses: 18, lastUpdate: '5sa', status: 'active', boundJsons: ['Marka_Tescili.JSON'], boundAgents: ['TrademarkAgent'], content: `# Marka Benzerlik Analizi

TürkPatent API sonuçlarını değerlendir:
- phonetic similarity
- visual similarity
- conceptual similarity
- goods/services overlap
- red_flag_list
- risk_score (1-100)` },
  { id: 'p_churn_v2', name: 'prompt_churn_prediction_v2.0', version: 'v2.0', category: 'Müşteri', categoryClr: 'violet', description: 'Müşteri churn olasılığı tahmini · sinyal analizi · aksiyon önerisi', model: 'Gemini 2.0', temperature: 0.3, maxTokens: 1600, uses: 128, lastUpdate: '1g', status: 'active', boundJsons: ['Musteri_Portfoy.JSON'], boundAgents: ['CustomerHealthAgent'], content: `# Churn Tahmini

Müşteri davranış verilerinden churn olasılığı hesapla (0-100%).
- signals[] (late_payments, low_engagement, support_tickets, nps_drop)
- churn_score
- retention_actions[]
- urgency_level` },
  { id: 'p_discount_approval_v2', name: 'prompt_discount_approval_v2', version: 'v2.0', category: 'Sistem', categoryClr: 'violet', description: 'Master onay koordinatörü · iş/sistem onayı yönlendirme', model: 'Claude 4.7', temperature: 0.2, maxTokens: 1400, uses: 234, lastUpdate: '2sa', status: 'active', boundJsons: ['Master.JSON', 'Satis_Talimat.JSON'], boundAgents: ['ApprovalCoordinator'], content: 'Onay talebini ilgili ajana yönlendir veya CEO onayına al.' },
  { id: 'p_limit_override_v1', name: 'prompt_limit_override_v1', version: 'v1.0', category: 'Sistem', categoryClr: 'violet', description: 'AI maliyet limiti geçici artırma kararı', model: 'GPT-4', temperature: 0.1, maxTokens: 900, uses: 12, lastUpdate: '30dk', status: 'review', boundJsons: ['Maliyet_Analiz.JSON'], boundAgents: ['CostAnalystAgent'], content: 'Limit aşımı durumunda kritik işlem mi değerlendir. Kritikse geçici artırma öner.' },
];

const CATEGORY_ORDER = ['Satış', 'Pazarlama', 'Finans', 'Ads', 'SEO', 'Sosyal Medya', 'Prodüksiyon', 'Marka Tescili', 'Müşteri', 'Sistem'];

function Icon({ children, className }: { children: ReactNode; className: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      {children}
    </svg>
  );
}

function statusMeta(status: PromptStatus) {
  if (status === 'active') return { clr: 'emerald' as ColorName, label: 'Aktif' };
  if (status === 'review') return { clr: 'amber' as ColorName, label: 'Review' };
  if (status === 'deprecated') return { clr: 'rose' as ColorName, label: 'Deprecated' };
  return { clr: 'gray' as ColorName, label: 'Pasif' };
}

function buildSteps(prompt: PromptItem): PromptStep[] {
  return [
    { key: 'basic', title: 'Temel Ayarlar', desc: 'Ad · versiyon · kategori · açıklama · durum', icon: <><circle cx="12" cy="12" r="10" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></> },
    { key: 'content', title: 'Prompt İçeriği', desc: `${prompt.content.split('\n').length} satır · ana metin`, icon: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></> },
    { key: 'model', title: 'Model & Parametreler', desc: `${prompt.model} · temp: ${prompt.temperature} · max_tokens: ${prompt.maxTokens}`, icon: <><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></> },
    { key: 'bindings', title: 'JSON & Agent Bağlantıları', desc: `${prompt.boundJsons.length} JSON · ${prompt.boundAgents.length} agent`, icon: <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /> },
    { key: 'tests', title: 'Test Örnekleri', desc: 'Input/output örnekleri · regresyon testi', icon: <><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></> },
    { key: 'versions', title: 'Versiyon Geçmişi', desc: 'Önceki sürümler · rollback', icon: <><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" /></> },
  ];
}

export default function PromptKutuphane() {
  const [prompts, setPrompts] = useState<PromptItem[]>(PROMPTS);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState<PromptItem | null>(null);
  const [modalMode, setModalMode] = useState<ModalMode>('edit');
  const [promptView, setPromptView] = useState<PromptView>('form');
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardStart, setWizardStart] = useState<WizardStart>('scratch');
  const [uploadedName, setUploadedName] = useState('');
  const [toast, setToast] = useState<ToastState>(null);

  const categories = useMemo(() => CATEGORY_ORDER.map((name) => ({ name, clr: CATEGORY_COLOR[name] || 'gray', count: prompts.filter((prompt) => prompt.category === name).length })).filter((item) => item.count > 0), [prompts]);
  const filtered = useMemo(() => prompts.filter((prompt) => {
    const categoryMatch = category === 'all' || prompt.category === category;
    const query = search.trim().toLowerCase();
    const searchMatch = !query || prompt.name.toLowerCase().includes(query) || prompt.description.toLowerCase().includes(query);
    return categoryMatch && searchMatch;
  }), [category, prompts, search]);

  function openPrompt(prompt: PromptItem, mode: ModalMode) {
    setSelectedPrompt(prompt);
    setModalMode(mode);
    setPromptView('form');
    setToast({ title: prompt.name, message: mode === 'view' ? `Salt-okunur · ${prompt.model} · ${prompt.maxTokens} token · ${prompt.uses} kullanım` : `Düzenleyici açılıyor · ${prompt.model} · ${prompt.maxTokens} token · ${prompt.boundJsons.length} JSON`, color: 'sky' });
  }

  function saveNewPrompt(formData: FormData) {
    const name = String(formData.get('npName') || '').trim();
    const nextCategory = String(formData.get('npCategory') || 'Satış');
    const version = String(formData.get('npVersion') || 'v1.0').trim() || 'v1.0';
    const desc = String(formData.get('npDesc') || '').trim();
    const content = String(formData.get('npContent') || '').trim() || '# Yeni Prompt\n\n## Rol\n\n## Görev';
    const model = String(formData.get('npModel') || 'Claude 4.7');
    const temp = Number.parseFloat(String(formData.get('npTemp') || '0.4')) || 0.4;
    const maxTokens = Number.parseInt(String(formData.get('npMaxTokens') || '2000'), 10) || 2000;

    if (!name) {
      setToast({ title: 'Eksik Bilgi', message: 'Prompt adı zorunludur', color: 'rose' });
      return;
    }
    if (!desc) {
      setToast({ title: 'Eksik Bilgi', message: 'Açıklama zorunludur', color: 'rose' });
      return;
    }

    const newPrompt: PromptItem = {
      id: `p_${name.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 30)}`,
      name,
      version,
      category: nextCategory,
      categoryClr: CATEGORY_COLOR[nextCategory] || 'gray',
      description: desc,
      content,
      model,
      temperature: temp,
      maxTokens,
      uses: 0,
      lastUpdate: 'şimdi',
      status: 'review',
      boundJsons: [],
      boundAgents: [],
    };

    setPrompts((current) => [...current, newPrompt]);
    setWizardOpen(false);
    setUploadedName('');
    setToast({ title: 'Prompt Oluşturuldu', message: `${name} Prompt Kütüphanesi'ne eklendi · Review durumunda · Prompt'u Düzenle ile yapılandırın`, color: 'emerald' });
  }

  return (
    <Layout activeId="prompts" breadcrumb="ADOS Mimar · Prompt Kütüphanesi">
      <div className="relative min-h-[calc(100vh-120px)]">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-sky-100 dark:bg-sky-500/20 rounded-lg flex items-center justify-center">
              <Icon className="text-sky-600 dark:text-sky-400 w-4 h-4"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></Icon>
            </div>
            <div>
              <h1 className="text-[19px] font-bold text-gray-900 dark:text-gray-100 leading-tight">Prompt Kütüphanesi</h1>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">{prompts.length} prompt · {categories.length} kategori · her prompt versiyonlu · <span className="font-mono">Prompt_Library.JSON v3.2</span></p>
            </div>
          </div>
          <button onClick={() => setWizardOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 dark:bg-gray-100 dark:text-gray-900 text-white text-[11px] font-semibold rounded-md hover:opacity-90">
            <Icon className="w-3.5 h-3.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></Icon>
            Yeni Prompt Tanımla
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3 mt-5">
          <KpiCard label="Toplam Prompt" value={String(prompts.length)} sub={`${categories.length} kategori`} clr="sky" />
          <KpiCard label="Aktif" value={String(prompts.filter((prompt) => prompt.status === 'active').length)} sub="Production'da" clr="emerald" />
          <KpiCard label="Review" value={String(prompts.filter((prompt) => prompt.status === 'review').length)} sub="İnceleme bekliyor" clr="amber" />
          <KpiCard label="Toplam Kullanım" value={prompts.reduce((total, prompt) => total + prompt.uses, 0).toLocaleString('tr-TR')} sub="Son 24 saat" clr="indigo" />
          <KpiCard label="Ort. Token" value={Math.round(prompts.reduce((total, prompt) => total + prompt.maxTokens, 0) / prompts.length).toLocaleString('tr-TR')} sub="max_tokens ort." clr="violet" />
          <KpiCard label="Kategori" value={String(categories.length)} sub="Aktif kategori" clr="teal" />
        </div>

        <div className="bg-gradient-to-br from-sky-50 via-white to-violet-50/50 dark:from-sky-500/5 dark:via-transparent dark:to-violet-500/5 border border-sky-200 dark:border-sky-500/20 rounded-xl p-3 flex items-start gap-2.5 mt-5">
          <Icon className="text-sky-600 dark:text-sky-400 w-4 h-4 shrink-0 mt-0.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></Icon>
          <div className="flex-1">
            <p className="text-[11px] text-gray-700 dark:text-gray-300"><span className="font-bold text-sky-700 dark:text-sky-300">Her prompt JSON ajanlarına bağlanır:</span> İçerik (ana prompt metni) · model & parametreler (sıcaklık, max token) · bağlı JSON'lar · test örnekleri · versiyon geçmişi. Bir prompt'u yapılandırmak için <span className="font-mono font-semibold">Prompt'u Düzenle</span> butonuna tıklayın. Yeni prompt eklemek için <span className="font-mono font-semibold">Yeni Prompt Tanımla</span> sihirbazını kullanın.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap mt-5">
          <button onClick={() => setCategory('all')} className={`px-2.5 py-1 text-[10px] font-semibold rounded-full border ${category === 'all' ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 border-gray-900 dark:border-gray-100' : 'bg-white dark:bg-[#1e1f26] text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#23242c]'} transition-colors`}>Tümü ({prompts.length})</button>
          {categories.map((item) => {
            const cm = CM[item.clr] || CM.gray;
            const active = category === item.name;
            return <button key={item.name} onClick={() => setCategory(item.name)} className={`px-2.5 py-1 text-[10px] font-semibold rounded-full border ${active ? `bg-${item.clr}-600 text-white border-${item.clr}-600` : `${cm.bg} ${cm.t} border-${item.clr}-200 dark:border-${item.clr}-500/30 hover:bg-${item.clr}-100 dark:hover:bg-${item.clr}-500/20`} transition-colors`}>{item.name} ({item.count})</button>;
          })}
          <div className="relative flex-1 min-w-[180px] max-w-[260px] ml-auto">
            <Icon className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-3.5 h-3.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></Icon>
            <input type="text" placeholder="Prompt ara..." value={search} onChange={(event) => setSearch(event.currentTarget.value)} className="w-full pl-7 pr-2 py-1 text-[11px] bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:border-gray-900 dark:focus:border-gray-400" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 mt-5">
          {filtered.length === 0 ? <div className="col-span-full p-10 text-center bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl text-gray-400 dark:text-gray-500 text-[12px]">Filtreye uyan prompt bulunamadı</div> : filtered.map((prompt) => <PromptCard key={prompt.id} prompt={prompt} onView={() => openPrompt(prompt, 'view')} onEdit={() => openPrompt(prompt, 'edit')} />)}
        </div>

        {selectedPrompt ? <PromptModal prompt={selectedPrompt} mode={modalMode} view={promptView} onView={setPromptView} onClose={() => setSelectedPrompt(null)} onToast={setToast} /> : null}
        {wizardOpen ? <PromptWizard prompts={prompts} wizardStart={wizardStart} uploadedName={uploadedName} onWizardStart={setWizardStart} onUploadedName={setUploadedName} onClose={() => { setWizardOpen(false); setUploadedName(''); }} onSubmit={saveNewPrompt} /> : null}
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

function PromptCard({ prompt, onView, onEdit }: { prompt: PromptItem; onView: () => void; onEdit: () => void }) {
  const cm = CM[prompt.categoryClr] || CM.gray;
  const { clr: sClr, label: sLbl } = statusMeta(prompt.status);

  return (
    <div className={`bg-white dark:bg-[#1e1f26] border ${prompt.highlight ? 'border-amber-300 dark:border-amber-500/40' : 'border-gray-200 dark:border-gray-600/50'} rounded-xl overflow-hidden hover:shadow-sm hover:-translate-y-0.5 transition-all`}>
      <button onClick={onView} className="w-full p-3.5 border-b border-gray-100 dark:border-gray-700/40 text-left">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className={`w-8 h-8 ${cm.bg} rounded-lg flex items-center justify-center shrink-0`}>
              <Icon className={`${cm.t} w-4 h-4`}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></Icon>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-gray-900 dark:text-gray-100 font-mono truncate">{prompt.name}</p>
              <p className="text-[9px] font-mono text-gray-400 dark:text-gray-500">{prompt.version}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <span className={`text-[9px] font-semibold px-1.5 py-0.5 ${cm.bg} ${cm.t} rounded`}>{prompt.category}</span>
            <span className={`text-[9px] font-semibold px-1.5 py-0.5 bg-${sClr}-100 dark:bg-${sClr}-900/30 text-${sClr}-700 dark:text-${sClr}-300 rounded`}>{sLbl}</span>
          </div>
        </div>
        <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-snug line-clamp-2">{prompt.description}</p>
        {prompt.highlight ? <div className="mt-1.5"><span className="text-[9px] font-bold px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded">★ ADOS AI SEO · ÖRNEK</span></div> : null}
      </button>
      <div className="p-3.5 space-y-2.5">
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[10px]">
          <div><span className="text-gray-500 dark:text-gray-400">Model:</span> <span className="font-semibold text-gray-900 dark:text-gray-100 font-mono">{prompt.model}</span></div>
          <div><span className="text-gray-500 dark:text-gray-400">Token:</span> <span className="font-semibold text-gray-900 dark:text-gray-100 font-mono">{prompt.maxTokens.toLocaleString('tr-TR')}</span></div>
          <div><span className="text-gray-500 dark:text-gray-400">Sıcaklık:</span> <span className="font-semibold text-gray-900 dark:text-gray-100 font-mono">{prompt.temperature}</span></div>
          <div><span className="text-gray-500 dark:text-gray-400">Kullanım:</span> <span className="font-semibold text-gray-900 dark:text-gray-100">{prompt.uses}</span></div>
          <div className="col-span-2"><span className="text-gray-500 dark:text-gray-400">Bağlı JSON:</span> <span className="font-mono font-semibold text-violet-700 dark:text-violet-300">{prompt.boundJsons.join(', ')}</span></div>
        </div>
        <div className="flex items-center gap-1.5 pt-2 border-t border-gray-100 dark:border-gray-700/40">
          <Icon className="text-sky-500 dark:text-sky-400 w-3 h-3"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></Icon>
          <span className="text-[10px] font-semibold text-gray-600 dark:text-gray-400">Son güncelleme: {prompt.lastUpdate} önce</span>
          <span className="text-[9px] text-gray-400 dark:text-gray-500 ml-auto">6 adım tanımlı</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={onView} className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-[10px] font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md transition-colors">
            <Icon className="w-3 h-3"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></Icon>
            Görüntüle
          </button>
          <button onClick={onEdit} className="flex-[1.5] flex items-center justify-center gap-1 px-2 py-1.5 text-[10px] font-bold bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-400 text-white rounded-md transition-colors">
            <Icon className="w-3 h-3"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></Icon>
            Prompt'u Düzenle
          </button>
        </div>
      </div>
    </div>
  );
}

function PromptModal({ prompt, mode, view, onView, onClose, onToast }: { prompt: PromptItem; mode: ModalMode; view: PromptView; onView: (view: PromptView) => void; onClose: () => void; onToast: (toast: ToastState) => void }) {
  const cm = CM[prompt.categoryClr] || CM.gray;
  const { clr: sClr, label: sLbl } = statusMeta(prompt.status);
  const steps = buildSteps(prompt);
  const readOnly = mode === 'view';

  return (
    <>
      <div className="modal-overlay absolute inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose}></div>
      <div className="modal-panel absolute inset-0 flex items-start justify-center p-4 pointer-events-none z-50">
        <div className="modal-scroll bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-xl w-full max-w-[900px] max-h-[92vh] overflow-y-auto pointer-events-auto">
          <div className="sticky top-0 z-10 bg-white dark:bg-[#1e1f26] border-b border-gray-100 dark:border-gray-700/60 p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-11 h-11 ${cm.bg} rounded-xl flex items-center justify-center shrink-0`}>
                  <Icon className={`${cm.t} w-5 h-5`}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></Icon>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-[15px] font-bold text-gray-900 dark:text-gray-100 font-mono truncate">{prompt.name}</h2>
                    <span className="text-[10px] font-mono text-gray-500 dark:text-gray-500">{prompt.version}</span>
                    <span className={`text-[9px] font-semibold px-1.5 py-0.5 ${cm.bg} ${cm.t} rounded`}>{prompt.category}</span>
                    <span className={`text-[9px] font-semibold px-1.5 py-0.5 bg-${sClr}-100 dark:bg-${sClr}-900/30 text-${sClr}-700 dark:text-${sClr}-300 rounded`}>{sLbl}</span>
                    {readOnly ? <span className="text-[9px] font-semibold px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded">Salt-okunur</span> : null}
                  </div>
                  <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-0.5">{prompt.description}</p>
                  <p className="text-[9px] text-gray-400 dark:text-gray-500 mt-0.5">{steps.length} adım · {prompt.uses} kullanım · {prompt.lastUpdate} önce güncellendi</p>
                </div>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1 shrink-0">
                <Icon className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Icon>
              </button>
            </div>

            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-0.5 p-0.5 bg-gray-100 dark:bg-[#17181f] border border-gray-200 dark:border-gray-700/40 rounded-md">
                <button id="ppeFormBtn" onClick={() => onView('form')} className={`px-2.5 py-1 text-[10px] font-semibold rounded flex items-center gap-1 ${view === 'form' ? 'bg-white dark:bg-[#2a2b33] text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}`}>
                  <Icon className="w-3 h-3"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></Icon>
                  Form
                </button>
                <button id="ppeRawBtn" onClick={() => onView('raw')} className={`px-2.5 py-1 text-[10px] font-semibold rounded flex items-center gap-1 ${view === 'raw' ? 'bg-white dark:bg-[#2a2b33] text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}`}>
                  <Icon className="w-3 h-3"><polyline points="4 7 4 4 20 4 20 7" /><line x1="9" y1="20" x2="15" y2="20" /><line x1="12" y1="4" x2="12" y2="20" /></Icon>
                  Ham Metin
                </button>
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={() => onToast({ title: 'İndirildi', message: `${prompt.name}.prompt dosyası bilgisayara indirildi`, color: 'emerald' })} className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-[#23242c]">
                  <Icon className="w-3 h-3"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></Icon>
                  Download
                </button>
                <button onClick={() => onToast({ title: 'Prompt Yükle', message: `${prompt.name} için dosya seçimi açılıyor`, color: 'sky' })} className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-[#23242c]">
                  <Icon className="w-3 h-3"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></Icon>
                  Prompt Yükle
                </button>
              </div>
            </div>
          </div>

          <div id="ppeFormView" className={`${view === 'form' ? '' : 'hidden'} p-5 space-y-2.5`}>
            {steps.map((step, index) => <PromptStepDetails key={step.key} step={step} index={index} prompt={prompt} readOnly={readOnly} onToast={onToast} />)}
          </div>

          <div id="ppeRawView" className={view === 'raw' ? '' : 'hidden'}>
            <div className="px-4 py-2 bg-amber-50 dark:bg-amber-500/10 border-b border-amber-200 dark:border-amber-500/20 flex items-center gap-2">
              <Icon className="text-amber-600 dark:text-amber-400 w-3.5 h-3.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></Icon>
              <p className="text-[10px] text-amber-800 dark:text-amber-300"><span className="font-bold">Ham Metin:</span> Prompt içeriğini direkt düzenleyin · <span className="font-mono">{'{{değişken}}'}</span> şablonlarını koruyun · Markdown destekli.</p>
            </div>
            <div className="p-4 bg-gray-900 dark:bg-[#0a0b0f]">
              <textarea id="ppeRawEditor" disabled={readOnly} spellCheck={false} defaultValue={prompt.content} className="w-full h-[480px] bg-transparent text-gray-200 font-mono text-[12px] leading-relaxed resize-none outline-none" />
            </div>
          </div>

          <div className="sticky bottom-0 bg-white dark:bg-[#1e1f26] border-t border-gray-100 dark:border-gray-700/60 p-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-[10px] text-gray-500 dark:text-gray-400">
              <Icon className="w-3 h-3"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></Icon>
              <span>Son kayıt: <span className="font-semibold text-gray-700 dark:text-gray-300">{prompt.lastUpdate} önce</span> · <span className="font-mono">{prompt.version}</span> · <span className="font-mono">{prompt.uses} kullanım</span></span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={onClose} className="px-3 py-2 text-[11px] font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">{readOnly ? 'Kapat' : 'İptal'}</button>
              {!readOnly ? <button onClick={() => onToast({ title: 'Test Çalıştırıldı', message: `${prompt.name} örnek girdilerle test edildi · 3 senaryo PASS`, color: 'emerald' })} className="flex items-center gap-1 px-3 py-2 text-[11px] font-semibold bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-[#23242c]"><Icon className="w-3 h-3"><polygon points="5 3 19 12 5 21 5 3" /></Icon>Test Et</button> : null}
              {!readOnly ? <button onClick={() => { onToast({ title: 'Kaydedildi & Deploy', message: `${prompt.name} yeni versiyonu oluşturuldu · bağlı ajanlara yayıldı`, color: 'emerald' }); onClose(); }} className="flex items-center gap-1.5 px-4 py-2 text-[11px] font-bold bg-sky-600 hover:bg-sky-700 text-white rounded-md"><Icon className="w-3 h-3"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /></Icon>Kaydet & Deploy</button> : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function PromptStepDetails({ step, index, prompt, readOnly, onToast }: { step: PromptStep; index: number; prompt: PromptItem; readOnly: boolean; onToast: (toast: ToastState) => void }) {
  return (
    <details open={index === 0} className="bg-gray-50 dark:bg-[#17181f] border border-gray-200 dark:border-gray-700/40 rounded-lg overflow-hidden group">
      <summary className="px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-white/40 dark:hover:bg-white/5 list-none">
        <div className="w-7 h-7 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center shrink-0">
          <Icon className="text-sky-600 dark:text-sky-400 w-3.5 h-3.5">{step.icon}</Icon>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-mono font-bold text-gray-500 dark:text-gray-500">ADIM {index + 1}</span>
            <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100">{step.title}</p>
          </div>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 truncate">{step.desc}</p>
        </div>
        <Icon className="text-gray-400 dark:text-gray-500 w-4 h-4 shrink-0 transition-transform group-open:rotate-180"><polyline points="6 9 12 15 18 9" /></Icon>
      </summary>
      <div className="p-4 pt-0 border-t border-gray-200/70 dark:border-gray-700/40">
        <PromptStepContent step={step} prompt={prompt} readOnly={readOnly} onToast={onToast} />
      </div>
    </details>
  );
}

function PromptStepContent({ step, prompt, readOnly, onToast }: { step: PromptStep; prompt: PromptItem; readOnly: boolean; onToast: (toast: ToastState) => void }) {
  if (step.key === 'basic') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3">
        <div className="md:col-span-2"><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Prompt Adı</label><input disabled={readOnly} defaultValue={prompt.name} className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono focus:outline-none focus:border-sky-500" /></div>
        <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Versiyon</label><input disabled={readOnly} defaultValue={prompt.version} className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono focus:outline-none focus:border-sky-500" /></div>
        <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Kategori</label><select disabled={readOnly} defaultValue={prompt.category} className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:border-sky-500">{CATEGORY_ORDER.map((item) => <option key={item}>{item}</option>)}</select></div>
        <div className="md:col-span-2"><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Açıklama</label><textarea disabled={readOnly} rows={2} defaultValue={prompt.description} className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 resize-none focus:outline-none focus:border-sky-500" /></div>
        <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Durum</label><select disabled={readOnly} defaultValue={statusMeta(prompt.status).label} className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:border-sky-500"><option>Aktif</option><option>Review</option><option>Deprecated</option></select></div>
      </div>
    );
  }

  if (step.key === 'content') {
    const variables = [...new Set(prompt.content.match(/\{\{[a-z_]+\}\}/g) || [])];
    return (
      <div className="pt-3 space-y-2">
        <div className="flex items-center justify-between gap-2 text-[10px] text-gray-500 dark:text-gray-400">
          <span>Ana prompt metni · Markdown destekli · <span className="font-mono">{'{{değişken}}'}</span> şablonları</span>
          <span className="font-mono">{prompt.content.split('\n').length} satır · {prompt.content.length} karakter</span>
        </div>
        <textarea disabled={readOnly} spellCheck={false} defaultValue={prompt.content} className="w-full h-[340px] px-3 py-2 text-[11px] bg-gray-900 dark:bg-[#0a0b0f] text-gray-200 font-mono leading-relaxed border border-gray-200 dark:border-gray-700 rounded-md resize-none focus:outline-none focus:border-sky-500" />
        <div className="flex items-center gap-2 flex-wrap text-[9px] text-gray-500 dark:text-gray-400">
          <span className="font-semibold">Değişkenler:</span>
          {variables.length ? variables.map((item) => <span key={item} className="font-mono font-semibold px-1.5 py-0.5 bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 rounded">{item}</span>) : <span className="italic text-gray-400">değişken kullanılmamış</span>}
        </div>
      </div>
    );
  }

  if (step.key === 'model') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3">
        <div className="md:col-span-2"><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Birincil Model</label><select disabled={readOnly} defaultValue={prompt.model} className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono focus:outline-none focus:border-sky-500"><option>Claude 4.7</option><option>GPT-4</option><option>Gemini 2.0</option><option>Claude 3.5 Haiku</option></select></div>
        <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Temperature (0-1)</label><div className="flex items-center gap-2"><input disabled={readOnly} type="range" min="0" max="1" step="0.1" defaultValue={prompt.temperature} className="flex-1 accent-sky-600" /><span className="text-[12px] font-bold text-gray-900 dark:text-gray-100 font-mono w-10 text-right">{prompt.temperature}</span></div><p className="text-[9px] text-gray-400 dark:text-gray-500 mt-1">Düşük = deterministik · Yüksek = yaratıcı</p></div>
        <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Max Tokens</label><input disabled={readOnly} type="number" defaultValue={prompt.maxTokens} className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono focus:outline-none focus:border-sky-500" /><p className="text-[9px] text-gray-400 dark:text-gray-500 mt-1">Çıktı maksimum boyutu</p></div>
        <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Top P</label><input disabled={readOnly} type="number" step="0.1" min="0" max="1" defaultValue="0.95" className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono focus:outline-none focus:border-sky-500" /></div>
        <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Timeout (sn)</label><input disabled={readOnly} type="number" defaultValue="30" className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono focus:outline-none focus:border-sky-500" /></div>
      </div>
    );
  }

  if (step.key === 'bindings') {
    return (
      <div className="pt-3 space-y-4">
        <BindingGroup title="Bağlı JSON'lar" color="violet" items={prompt.boundJsons} emptyAction="JSON Ekle" onToast={onToast} />
        <BindingGroup title="Bağlı Agent'lar" color="indigo" items={prompt.boundAgents} emptyAction="Agent Ekle" onToast={onToast} />
      </div>
    );
  }

  if (step.key === 'tests') {
    return (
      <div className="pt-3 space-y-2">
        <p className="text-[10px] text-gray-500 dark:text-gray-400">Regresyon testleri · her deploy öncesi çalıştırılır · PASS olmalı</p>
        {[
          { name: 'Temel Senaryo', input: 'standart girdi · tüm değişkenler dolu' },
          { name: 'Eksik Veri Senaryosu', input: 'opsiyonel alanlar boş' },
          { name: 'Edge Case', input: 'sınır değerler · uzun metin' },
        ].map((test) => (
          <div key={test.name} className="flex items-center gap-2 p-2.5 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-md">
            <span className="w-6 h-6 bg-emerald-100 dark:bg-emerald-500/20 rounded flex items-center justify-center shrink-0"><Icon className="text-emerald-600 dark:text-emerald-400 w-3 h-3"><polyline points="20 6 9 17 4 12" /></Icon></span>
            <div className="flex-1 min-w-0"><p className="text-[11px] font-semibold text-gray-900 dark:text-gray-100">{test.name}</p><p className="text-[9px] text-gray-500 dark:text-gray-400">{test.input}</p></div>
            <span className="text-[9px] font-bold px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded">PASS</span>
            <button onClick={() => onToast({ title: 'Test Çalıştırıldı', message: `${test.name} yeniden çalıştırıldı · PASS`, color: 'emerald' })} className="text-[9px] text-sky-700 dark:text-sky-300 hover:underline">Çalıştır</button>
          </div>
        ))}
        {!readOnly ? <button onClick={() => onToast({ title: 'Test Ekle', message: 'Yeni test senaryosu tanımlama ekranı açılıyor', color: 'sky' })} className="w-full p-2.5 border border-dashed border-sky-300 dark:border-sky-500/40 text-sky-700 dark:text-sky-300 text-[11px] font-semibold rounded-md hover:bg-sky-50 dark:hover:bg-sky-500/10 flex items-center justify-center gap-1.5"><Icon className="w-3 h-3"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></Icon>Test Senaryosu Ekle</button> : null}
      </div>
    );
  }

  const currentVersion = Number.parseFloat(prompt.version.replace('v', ''));
  const versions = [
    { v: prompt.version, time: 'güncel', author: 'osman.atasoy', note: 'Son kayıtlı versiyon' },
    { v: `v${(currentVersion - 0.1).toFixed(1)}`, time: '5g önce', author: 'osman.atasoy', note: `Temperature 0.5 → ${prompt.temperature} değişikliği` },
    { v: `v${(currentVersion - 0.2).toFixed(1)}`, time: '12g önce', author: 'ahmet.yilmaz', note: 'İlk stabil versiyon' },
  ];

  return (
    <div className="pt-3 space-y-2">
      {versions.map((version, index) => (
        <div key={version.v} className={`flex items-start gap-2.5 p-2.5 ${index === 0 ? 'bg-sky-50 dark:bg-sky-500/10 border-sky-200 dark:border-sky-500/30' : 'bg-white dark:bg-[#1e1f26] border-gray-200 dark:border-gray-700'} border rounded-md`}>
          <span className={`text-[11px] font-bold font-mono ${index === 0 ? 'text-sky-700 dark:text-sky-300' : 'text-gray-500 dark:text-gray-500'} shrink-0`}>{version.v}</span>
          <div className="flex-1 min-w-0"><p className="text-[11px] text-gray-900 dark:text-gray-100">{version.note}</p><p className="text-[9px] text-gray-500 dark:text-gray-500">{version.time} · {version.author}</p></div>
          {index === 0 ? <span className="text-[9px] font-bold px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded">GÜNCEL</span> : <button onClick={() => onToast({ title: 'Geri Al', message: `${version.v} versiyonuna geri alma · onay gerekir`, color: 'amber' })} className="text-[9px] font-semibold text-rose-700 dark:text-rose-400 hover:underline">Geri Al</button>}
        </div>
      ))}
    </div>
  );
}

function BindingGroup({ title, color, items, emptyAction, onToast }: { title: string; color: ColorName; items: string[]; emptyAction: string; onToast: (toast: ToastState) => void }) {
  return (
    <div>
      <label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wider">{title}</label>
      <div className="flex flex-wrap gap-1.5 p-2 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-md min-h-[42px]">
        {items.map((item) => <span key={item} className={`group inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-1 bg-${color}-50 dark:bg-${color}-500/10 text-${color}-700 dark:text-${color}-300 border border-${color}-200 dark:border-${color}-500/30 rounded`}>{item}<button onClick={() => onToast({ title: 'Kaldırıldı', message: `${item} bağlantısı kaldırıldı`, color: 'rose' })} className={`opacity-0 group-hover:opacity-100 text-${color}-500 hover:text-rose-600 transition-colors`}><Icon className="w-2.5 h-2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Icon></button></span>)}
        <button onClick={() => onToast({ title: emptyAction, message: `${emptyAction} seçim ekranı açılıyor`, color })} className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 text-${color}-700 dark:text-${color}-300 hover:bg-${color}-50 dark:hover:bg-${color}-500/10 border border-dashed border-${color}-300 dark:border-${color}-500/40 rounded`}>
          <Icon className="w-2.5 h-2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></Icon>{emptyAction}
        </button>
      </div>
    </div>
  );
}

function PromptWizard({ prompts, wizardStart, uploadedName, onWizardStart, onUploadedName, onClose, onSubmit }: { prompts: PromptItem[]; wizardStart: WizardStart; uploadedName: string; onWizardStart: (start: WizardStart) => void; onUploadedName: (name: string) => void; onClose: () => void; onSubmit: (formData: FormData) => void }) {
  return (
    <>
      <div className="modal-overlay absolute inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose}></div>
      <div className="modal-panel absolute inset-0 flex items-start justify-center p-4 pointer-events-none z-50">
        <form onSubmit={(event) => { event.preventDefault(); onSubmit(new FormData(event.currentTarget)); }} className="modal-scroll bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-xl w-full max-w-[680px] max-h-[92vh] overflow-y-auto pointer-events-auto">
          <div className="sticky top-0 z-10 bg-white dark:bg-[#1e1f26] border-b border-gray-100 dark:border-gray-700/60 p-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-sky-100 dark:bg-sky-500/20 rounded-lg flex items-center justify-center">
                <Icon className="text-sky-600 dark:text-sky-400 w-4 h-4"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></Icon>
              </div>
              <div>
                <h2 className="text-[15px] font-bold text-gray-900 dark:text-gray-100">Yeni Prompt Tanımla</h2>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">Dosya yükle, sıfırdan oluştur veya kopyala · Prompt Kütüphanesi'ne eklenecek</p>
              </div>
            </div>
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1">
              <Icon className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Icon>
            </button>
          </div>

          <div className="p-5 space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-2"><span className="w-6 h-6 bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300 rounded-full flex items-center justify-center text-[10px] font-bold">1</span><h3 className="text-[12px] font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Başlangıç Yöntemi</h3></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <WizardOption value="upload" selected={wizardStart === 'upload'} onSelect={onWizardStart} title="Dosya Yükle" desc=".prompt veya .txt dosyası" icon={<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></>} />
                <WizardOption value="scratch" selected={wizardStart === 'scratch'} onSelect={onWizardStart} title="Sıfırdan" desc="Boş şablondan başla" icon={<><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>} />
                <WizardOption value="copy" selected={wizardStart === 'copy'} onSelect={onWizardStart} title="Kopyala" desc="Mevcut prompt'tan" icon={<><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></>} />
              </div>

              <div id="npUploadBox" className={`${wizardStart === 'upload' ? '' : 'hidden'} mt-3`}>
                <label className="flex flex-col items-center justify-center gap-2 p-5 border-2 border-dashed border-sky-300 dark:border-sky-500/40 rounded-lg cursor-pointer hover:bg-sky-50 dark:hover:bg-sky-500/5">
                  <input id="npFile" type="file" accept=".prompt,.txt,.md,text/plain" className="sr-only" onChange={(event) => onUploadedName(event.currentTarget.files?.[0] ? `${event.currentTarget.files[0].name} · ${(event.currentTarget.files[0].size / 1024).toFixed(1)}KB seçildi` : '')} />
                  <Icon className="text-sky-500 w-8 h-8"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></Icon>
                  <div className="text-center"><p className="text-[12px] font-semibold text-gray-900 dark:text-gray-100">Dosya seçin veya sürükleyin</p><p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">.prompt, .txt, .md · max 2MB</p></div>
                  <p id="npFileName" className={`${uploadedName ? '' : 'hidden'} text-[11px] font-mono font-semibold text-sky-700 dark:text-sky-300`}>{uploadedName}</p>
                </label>
              </div>

              <div id="npCopyBox" className={`${wizardStart === 'copy' ? '' : 'hidden'} mt-3`}>
                <label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Hangi prompt'tan kopyalansın?</label>
                <select id="npCopyFrom" className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:border-sky-500 font-mono">
                  {prompts.map((prompt) => <option key={prompt.id} value={prompt.id}>{prompt.name} ({prompt.version})</option>)}
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-700/40">
              <div className="flex items-center gap-2 mb-3"><span className="w-6 h-6 bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300 rounded-full flex items-center justify-center text-[10px] font-bold">2</span><h3 className="text-[12px] font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Prompt Kimliği</h3></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="md:col-span-2"><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Prompt Adı *</label><input id="npName" name="npName" type="text" placeholder="prompt_yeni_modul_v1" className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono focus:outline-none focus:border-sky-500" /><p className="text-[9px] text-gray-400 dark:text-gray-500 mt-1">Önerilen format: <span className="font-mono">prompt_{'{alan}'}_{'{amac}'}_v{'{versiyon}'}</span></p></div>
                <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Kategori *</label><select id="npCategory" name="npCategory" className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:border-sky-500">{CATEGORY_ORDER.map((item) => <option key={item} value={item}>{item}</option>)}</select></div>
                <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Versiyon</label><input id="npVersion" name="npVersion" type="text" defaultValue="v1.0" className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono focus:outline-none focus:border-sky-500" /></div>
                <div className="md:col-span-2"><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Açıklama *</label><textarea id="npDesc" name="npDesc" rows={2} placeholder="Bu prompt ne işe yarar?" className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 resize-none focus:outline-none focus:border-sky-500" /></div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-700/40">
              <div className="flex items-center gap-2 mb-3"><span className="w-6 h-6 bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300 rounded-full flex items-center justify-center text-[10px] font-bold">3</span><h3 className="text-[12px] font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Prompt İçeriği <span className="text-gray-400 dark:text-gray-500 font-normal normal-case">(opsiyonel · sonra da düzenlenebilir)</span></h3></div>
              <textarea id="npContent" name="npContent" rows={8} placeholder={'# Rol\n\nSen bir...\n\n## Görev\n\n{{değişken}} için...'} className="w-full px-3 py-2 text-[11px] bg-gray-900 dark:bg-[#0a0b0f] text-gray-200 font-mono leading-relaxed border border-gray-200 dark:border-gray-700 rounded-md resize-none focus:outline-none focus:border-sky-500" />
              <p className="text-[9px] text-gray-400 dark:text-gray-500 mt-1"><span className="font-mono">{'{{değişken}}'}</span> şablonları desteklenir · Markdown uyumludur</p>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-700/40">
              <div className="flex items-center gap-2 mb-3"><span className="w-6 h-6 bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300 rounded-full flex items-center justify-center text-[10px] font-bold">4</span><h3 className="text-[12px] font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Model & Parametreler</h3></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Model</label><select id="npModel" name="npModel" className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono focus:outline-none focus:border-sky-500"><option>Claude 4.7</option><option>GPT-4</option><option>Gemini 2.0</option></select></div>
                <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Temperature</label><input id="npTemp" name="npTemp" type="number" step="0.1" min="0" max="1" defaultValue="0.4" className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono focus:outline-none focus:border-sky-500" /></div>
                <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Max Tokens</label><input id="npMaxTokens" name="npMaxTokens" type="number" defaultValue="2000" className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono focus:outline-none focus:border-sky-500" /></div>
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 bg-white dark:bg-[#1e1f26] border-t border-gray-100 dark:border-gray-700/60 p-4 flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className="px-3 py-2 text-[11px] font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">İptal</button>
            <button type="submit" className="flex items-center gap-1.5 px-4 py-2 text-[11px] font-bold bg-gray-900 dark:bg-gray-100 dark:text-gray-900 text-white rounded-md hover:opacity-90">
              <Icon className="w-3.5 h-3.5"><polyline points="20 6 9 17 4 12" /></Icon>
              Oluştur & Kütüphaneye Ekle
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

function WizardOption({ value, selected, onSelect, title, desc, icon }: { value: WizardStart; selected: boolean; onSelect: (value: WizardStart) => void; title: string; desc: string; icon: ReactNode }) {
  return (
    <label className="cursor-pointer">
      <input type="radio" name="npStart" value={value} className="sr-only peer" checked={selected} onChange={() => onSelect(value)} />
      <div className="p-3 bg-white dark:bg-[#17181f] border-2 border-gray-200 dark:border-gray-700 peer-checked:border-sky-500 peer-checked:bg-sky-50 dark:peer-checked:bg-sky-500/10 rounded-lg transition-all">
        <div className="flex items-start gap-2 mb-1"><Icon className="text-sky-600 dark:text-sky-400 w-4 h-4 shrink-0 mt-0.5">{icon}</Icon><span className="text-[11px] font-bold text-gray-900 dark:text-gray-100">{title}</span></div>
        <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-snug">{desc}</p>
      </div>
    </label>
  );
}

function Toast({ toast, onClose }: { toast: ToastState; onClose: () => void }) {
  if (!toast) return null;
  const clrs: Record<ColorName, { bg: string; bd: string }> = { emerald: { bg: '#10b981', bd: '#059669' }, rose: { bg: '#f43f5e', bd: '#e11d48' }, amber: { bg: '#f59e0b', bd: '#d97706' }, sky: { bg: '#0ea5e9', bd: '#0284c7' }, violet: { bg: '#8b5cf6', bd: '#7c3aed' }, indigo: { bg: '#6366f1', bd: '#4f46e5' }, teal: { bg: '#14b8a6', bd: '#0d9488' }, pink: { bg: '#ec4899', bd: '#db2777' }, gray: { bg: '#6b7280', bd: '#4b5563' } };
  const color = clrs[toast.color] || clrs.sky;
  return (
    <div style={{ position: 'absolute', bottom: '24px', right: '24px', zIndex: 9999, minWidth: '280px', maxWidth: '400px', background: 'white', borderLeft: `4px solid ${color.bd}`, borderRadius: '10px', boxShadow: '0 8px 24px rgba(0,0,0,.15)', padding: '14px 16px', animation: 'toastSlide .3s ease-out' }}>
      <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
        <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: '13px', color: color.bg, marginBottom: '2px' }}>{toast.title}</div><div style={{ fontSize: '11px', color: '#6b7280' }}>{toast.message}</div></div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: '16px' }}>×</button>
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, height: '2px', background: color.bg, borderRadius: '0 0 10px 10px', animation: 'toastProgress 3s linear' }}></div>
    </div>
  );
}
