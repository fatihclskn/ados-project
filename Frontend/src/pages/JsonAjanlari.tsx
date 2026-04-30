import { type ReactNode, useMemo, useState } from 'react';
import Layout from '../components/Layout';

type ColorName = 'emerald' | 'amber' | 'rose' | 'sky' | 'violet' | 'indigo' | 'teal' | 'pink' | 'gray';
type JsonCategory = 'core' | 'process' | 'service' | 'system';
type JsonStatus = 'active' | 'review' | 'paused';
type EditorView = 'form' | 'code';
type ModalMode = 'view' | 'edit';
type WizardStart = 'upload' | 'scratch' | 'copy';
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
  status: JsonStatus;
  highlight?: boolean;
};

type CustomField =
  | { label: string; type: 'chips'; options: string[]; selected: string[] }
  | { label: string; type: 'select'; options: string[]; value: string }
  | { label: string; type: 'number'; value: string; unit?: string };

type CustomStep = {
  icon: ReactNode;
  customStep: {
    title: string;
    desc: string;
    fields: CustomField[];
  };
};

type Step = {
  key: 'basic' | 'prompts' | 'agent' | 'custom' | 'integrations' | 'triggers' | 'audit';
  title: string;
  desc: string;
  icon: ReactNode;
  isCustom?: boolean;
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

const INITIAL_REGISTRY: RegistryItem[] = [
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

const CUSTOM_STEPS: Record<string, CustomStep> = {
  'SEO_Strateji.JSON': { icon: <><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></>, customStep: { title: 'SEO Hedefleri · Lokal / Ulusal / Global', desc: "Satış Panosu'ndaki SEO modülünün hedefleme yapısını tanımlar", fields: [{ label: 'Kapsam', type: 'chips', options: ['Lokal', 'Ulusal', 'Global'], selected: ['Lokal', 'Ulusal'] }, { label: 'Öncelikli Anahtar Kelime Kategorileri', type: 'chips', options: ['Marka', 'Ürün', 'Bilgilendirici', 'Karşılaştırmalı', 'Satın Alma Niyetli'], selected: ['Marka', 'Ürün', 'Satın Alma Niyetli'] }, { label: 'Hedef Aylık Organik Trafik', type: 'number', value: '15000', unit: 'ziyaretçi' }, { label: 'Rakip Analiz Frekansı', type: 'select', options: ['Haftalık', '2 haftalık', 'Aylık'], value: 'Haftalık' }] } },
  'Google_Ads.JSON': { icon: <><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></>, customStep: { title: 'Reklam Politikası · Platform × Bütçe Eşiği', desc: 'Hangi platformlarda hangi bütçe aralıklarında hangi onaylar gerekir', fields: [{ label: 'Aktif Platformlar', type: 'chips', options: ['Google Ads', 'Meta Ads', 'LinkedIn Ads', 'TikTok Ads', 'X Ads'], selected: ['Google Ads', 'Meta Ads', 'LinkedIn Ads'] }, { label: 'Otomatik Artırma Eşiği (₺)', type: 'number', value: '25000', unit: '₺/gün' }, { label: 'Onay Gerektiren Artırma Eşiği (₺)', type: 'number', value: '100000', unit: '₺/kampanya' }, { label: 'Hedef ROAS', type: 'number', value: '2.8', unit: 'x' }, { label: 'Reklam Dili', type: 'chips', options: ['TR', 'EN', 'DE', 'FR', 'AR'], selected: ['TR', 'EN'] }] } },
  'Sosyal_Medya.JSON': { icon: <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />, customStep: { title: 'Sosyal Medya Politikası · 5 Platform', desc: "Satış Panosu'ndaki Sosyal Medya Yönetimi modülü ile eşleşir", fields: [{ label: 'Aktif Platformlar', type: 'chips', options: ['Instagram', 'Facebook', 'LinkedIn', 'X', 'TikTok', 'YouTube'], selected: ['Instagram', 'Facebook', 'LinkedIn', 'X', 'TikTok'] }, { label: 'Haftalık Paylaşım Hedefi', type: 'number', value: '21', unit: 'post/hafta' }, { label: 'İçerik Türü Dağılımı', type: 'chips', options: ['Reels/Video', 'Carousel', 'Statik Görsel', 'Hikaye', 'Canlı', 'UGC'], selected: ['Reels/Video', 'Carousel', 'Hikaye'] }, { label: 'Marka Ton', type: 'select', options: ['Profesyonel', 'Samimi', 'Teknik', 'Eğlenceli', 'Minimalist'], value: 'Profesyonel' }] } },
  'Produksiyon.JSON': { icon: <><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></>, customStep: { title: 'Prodüksiyon Kapasitesi · Klasik + AI', desc: 'Foto/video/ses üretim kapasitesi ve AI entegrasyonu', fields: [{ label: 'Üretim Tipleri', type: 'chips', options: ['Klasik Foto', 'Klasik Video', 'AI Foto', 'AI Video', 'Ses/Altyazı', 'Tercüme'], selected: ['Klasik Foto', 'Klasik Video', 'AI Foto', 'AI Video'] }, { label: 'AI Foto Modeli', type: 'select', options: ['DALL-E 3', 'Midjourney v6', 'Stable Diffusion XL', 'Ideogram'], value: 'DALL-E 3' }, { label: 'AI Video Modeli', type: 'select', options: ['Runway Gen-3', 'Sora', 'Pika Labs', 'Kling'], value: 'Runway Gen-3' }, { label: 'Aylık Çıktı Hedefi', type: 'number', value: '120', unit: 'kreatif' }] } },
  'Domain_Hosting.JSON': { icon: <><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></>, customStep: { title: 'Domain & Hosting Politikası', desc: 'Metunic API entegrasyonu · 4 setup tipi · paket seçimi', fields: [{ label: 'Domain Sağlayıcı', type: 'select', options: ['Metunic', 'GoDaddy', 'Namecheap'], value: 'Metunic' }, { label: 'Hosting Tipleri', type: 'chips', options: ['Shared', 'VPS', 'Dedicated', 'Cloud', 'Co-Location'], selected: ['Shared', 'VPS', 'Dedicated', 'Co-Location'] }, { label: 'Yönetim Paneli', type: 'chips', options: ['Plesk', 'cPanel', 'DirectAdmin'], selected: ['Plesk', 'cPanel'] }, { label: 'SSL Politikası', type: 'select', options: ["Let's Encrypt (ücretsiz)", 'Positive SSL', 'EV SSL', 'Wildcard'], value: "Let's Encrypt (ücretsiz)" }] } },
  'Marka_Tescili.JSON': { icon: <><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" /><line x1="16" y1="8" x2="2" y2="22" /><line x1="17.5" y1="15" x2="9" y2="15" /></>, customStep: { title: 'Marka Tescil Süreci · TürkPatent & WIPO', desc: 'Benzerlik tarama · NICE sınıflandırma · uluslararası kapsam', fields: [{ label: 'Varsayılan NICE Sınıfları', type: 'chips', options: ['09 (Yazılım)', '35 (Pazarlama)', '38 (Telekom)', '41 (Eğitim)', '42 (Bilişim Hizmetleri)', '45 (Hukuk)'], selected: ['35 (Pazarlama)', '42 (Bilişim Hizmetleri)'] }, { label: 'Benzerlik Eşiği', type: 'number', value: '65', unit: '%' }, { label: 'Başvuru Kapsamı', type: 'chips', options: ['Türkiye', 'AB (EUIPO)', 'WIPO (Madrid)', 'ABD (USPTO)'], selected: ['Türkiye'] }, { label: 'Ret Halinde İtiraz Süreci', type: 'select', options: ['Otomatik itiraz', 'Müşteri onayı ile', 'Manuel'], value: 'Müşteri onayı ile' }] } },
  'Web_Sitesi.JSON': { icon: <><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="2" y1="8" x2="22" y2="8" /><circle cx="5.5" cy="5.5" r="0.5" fill="currentColor" /><circle cx="7.5" cy="5.5" r="0.5" fill="currentColor" /></>, customStep: { title: 'Web Analiz Kapsamı', desc: 'Lighthouse + PageSpeed · SEO audit · ADOS müşteri referansları', fields: [{ label: 'Analiz Boyutları', type: 'chips', options: ['Performans', 'SEO', 'Accessibility', 'Best Practices', 'PWA'], selected: ['Performans', 'SEO', 'Accessibility', 'Best Practices'] }, { label: 'Minimum Performans Skoru', type: 'number', value: '85', unit: '/100' }, { label: 'Cihaz Testi', type: 'chips', options: ['Mobil', 'Tablet', 'Desktop'], selected: ['Mobil', 'Desktop'] }, { label: 'Rapor Sıklığı', type: 'select', options: ['Haftalık', 'Aylık', 'Çeyreklik'], value: 'Aylık' }] } },
  'Premium_360.JSON': { icon: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />, customStep: { title: 'Premium 360 Ayrıcalıklar', desc: 'Dedicated ekip · priority SLA · tüm hizmetlerin entegrasyonu', fields: [{ label: 'Priority Tier', type: 'select', options: ['Standard', 'Gold', 'Platinum', 'Diamond'], value: 'Platinum' }, { label: 'Dedicated Ekip Üyesi', type: 'number', value: '3', unit: 'kişi' }, { label: 'SLA Yanıt Süresi', type: 'select', options: ['4 saat', '2 saat', '1 saat', '30 dakika'], value: '2 saat' }, { label: 'Aylık Strateji Görüşmesi', type: 'chips', options: ['1x', '2x', '4x', 'Haftalık'], selected: ['2x'] }, { label: 'Minimum Taahhüt', type: 'select', options: ['6 ay', '12 ay', '24 ay'], value: '12 ay' }] } },
  'Satis_Talimat.JSON': { icon: <><path d="M3 3h18v18H3z" /><path d="M9 9h6v6H9z" /></>, customStep: { title: 'Satış Akışı · 3 Aşama', desc: 'Lead → Teklif Takibi → Sözleşme Takibi (Satış Panosu ile eşleşir)', fields: [{ label: 'Teklif Geçerlilik Süresi', type: 'number', value: '14', unit: 'gün' }, { label: 'Varsayılan İskonto Üst Limiti', type: 'number', value: '15', unit: '%' }, { label: 'Onay Gerektiren İskonto', type: 'number', value: '18', unit: '% üzeri' }, { label: 'Otomatik Hatırlatma', type: 'chips', options: ['1 gün kala', '3 gün kala', '7 gün kala', 'Teklif onayı'], selected: ['3 gün kala', 'Teklif onayı'] }] } },
  'Finans_Talimat.JSON': { icon: <><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></>, customStep: { title: 'Finansal Kurallar', desc: 'Fatura · tahsilat · bütçe eşikleri', fields: [{ label: 'Fatura Vade Süresi', type: 'number', value: '30', unit: 'gün' }, { label: 'Gecikme Cezası', type: 'number', value: '1.5', unit: '%/ay' }, { label: 'Tahsilat Hatırlatma', type: 'chips', options: ['Vade öncesi 7 gün', 'Vade günü', 'Vade sonrası 3 gün', 'Vade sonrası 7 gün'], selected: ['Vade öncesi 7 gün', 'Vade sonrası 3 gün'] }, { label: 'Alacak Yaşlandırma Eşiği', type: 'number', value: '60', unit: 'gün' }] } },
};

function Icon({ children, className }: { children: ReactNode; className: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      {children}
    </svg>
  );
}

function getCategoryMeta(category: JsonCategory) {
  if (category === 'process') return { clr: 'sky' as ColorName, label: 'Süreç' };
  if (category === 'service') return { clr: 'emerald' as ColorName, label: 'Hizmet' };
  if (category === 'system') return { clr: 'violet' as ColorName, label: 'Sistem' };
  return { clr: 'gray' as ColorName, label: 'Core' };
}

function getStatusMeta(status: JsonStatus) {
  if (status === 'active') return { clr: 'emerald' as ColorName, label: 'Aktif' };
  if (status === 'review') return { clr: 'amber' as ColorName, label: 'Review' };
  return { clr: 'gray' as ColorName, label: 'Pasif' };
}

function buildSteps(item: RegistryItem): Step[] {
  const custom = CUSTOM_STEPS[item.name];
  const steps: Step[] = [
    { key: 'basic', title: 'Temel Ayarlar', desc: 'Şema · versiyon · ad · açıklama', icon: <><circle cx="12" cy="12" r="10" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></> },
    { key: 'prompts', title: 'Prompt Bağlantıları', desc: `${item.prompts.filter((prompt) => prompt !== '—').length} prompt · versiyonlu`, icon: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></> },
    { key: 'agent', title: 'Agent & AI Model', desc: `${item.agent} · ${item.model}`, icon: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83" /></> },
  ];
  if (custom) steps.push({ key: 'custom', title: custom.customStep.title, desc: custom.customStep.desc, icon: custom.icon, isCustom: true });
  steps.push(
    { key: 'integrations', title: 'Entegrasyonlar', desc: `${item.apis[0] === '—' ? 0 : item.apis.length} API bağlı`, icon: <><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></> },
    { key: 'triggers', title: 'Tetikleyiciler', desc: item.trigger, icon: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /> },
    { key: 'audit', title: 'Audit & Governance', desc: 'Loglama · saklama · izinler', icon: <><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></> },
  );
  return steps;
}

export default function JsonAjanlari() {
  const [registry, setRegistry] = useState<RegistryItem[]>(INITIAL_REGISTRY);
  const [selectedJson, setSelectedJson] = useState<RegistryItem | null>(null);
  const [modalMode, setModalMode] = useState<ModalMode>('edit');
  const [editorView, setEditorView] = useState<EditorView>('form');
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardStart, setWizardStart] = useState<WizardStart>('scratch');
  const [uploadedName, setUploadedName] = useState('');
  const [toast, setToast] = useState<ToastState>(null);

  const visibleRegistry = registry.filter((item) => item.category !== 'core');
  const total = visibleRegistry.length;
  const active = visibleRegistry.filter((item) => item.status === 'active').length;
  const byCategory = useMemo(() => ({
    process: visibleRegistry.filter((item) => item.category === 'process').length,
    service: visibleRegistry.filter((item) => item.category === 'service').length,
    system: visibleRegistry.filter((item) => item.category === 'system').length,
  }), [visibleRegistry]);

  function openJson(item: RegistryItem, mode: ModalMode) {
    setSelectedJson(item);
    setModalMode(mode);
    setEditorView('form');
    setToast({ title: item.name, message: mode === 'view' ? `Salt-okunur görünüm · ${item.agent} · ${item.prompts.filter((prompt) => prompt !== '—').length} prompt · ${item.apis[0] === '—' ? 0 : item.apis.length} API` : `Düzenleyici açılıyor · ${item.prompts.filter((prompt) => prompt !== '—').length} prompt · ${item.agent} · ${item.model}`, color: 'violet' });
  }

  function saveNewJson(formData: FormData) {
    const name = String(formData.get('njName') || '').trim();
    const category = String(formData.get('njCategory') || 'service') as Exclude<JsonCategory, 'core'>;
    const version = String(formData.get('njVersion') || 'v1.0.0').trim();
    const desc = String(formData.get('njDesc') || '').trim();
    const agent = String(formData.get('njAgent') || '').trim() || '—';
    const model = String(formData.get('njModel') || 'Claude 4.7');
    const trigger = String(formData.get('njTrigger') || '').trim() || 'Manuel';

    if (!name) {
      setToast({ title: 'Eksik Bilgi', message: 'JSON adı zorunludur', color: 'rose' });
      return;
    }
    if (!desc) {
      setToast({ title: 'Eksik Bilgi', message: 'Açıklama zorunludur', color: 'rose' });
      return;
    }

    const cleanName = name.replace(/\.JSON$/i, '').replace(/\s+/g, '_');
    const newJson: RegistryItem = {
      id: cleanName.toLowerCase().replace(/[^a-z0-9_]/g, ''),
      name: `${cleanName}.JSON`,
      version: version || 'v1.0.0',
      category,
      size: '2KB',
      triggers: 0,
      lastUpdate: 'şimdi',
      description: desc,
      prompts: ['—'],
      agent,
      agentVer: 'v1.0',
      model,
      apis: ['—'],
      trigger,
      status: 'review',
    };

    setRegistry((current) => [...current, newJson]);
    setWizardOpen(false);
    setUploadedName('');
    setToast({ title: 'JSON Oluşturuldu', message: `${newJson.name} ADOS registry'ye eklendi · Review durumunda · JSON'u Düzenle ile yapılandırın`, color: 'emerald' });
  }

  return (
    <Layout activeId="json-agents" breadcrumb="ADOS Mimar · JSON Ajanları">
      <div className="relative min-h-[calc(100vh-120px)]">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg flex items-center justify-center">
              <Icon className="text-indigo-600 dark:text-indigo-400 w-4 h-4"><path d="M4 4h16v16H4z" /><path d="M4 12h16" /><path d="M12 4v16" /></Icon>
            </div>
            <div>
              <h1 className="text-[19px] font-bold text-gray-900 dark:text-gray-100 leading-tight">JSON Ajanları</h1>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">{total} JSON · {active} aktif · her JSON kendi düzenleme adımlarıyla yapılandırılır</p>
            </div>
          </div>
          <button onClick={() => setWizardOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 dark:bg-gray-100 dark:text-gray-900 text-white text-[11px] font-semibold rounded-md hover:opacity-90">
            <Icon className="w-3.5 h-3.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></Icon>
            Yeni JSON Tanımla
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3 mt-5">
          <KpiCard label="Toplam JSON" value={String(total)} sub="Master.JSON hariç" clr="violet" />
          <KpiCard label="Aktif" value={String(active)} sub={`${total - active} pasif/review`} clr="emerald" />
          <KpiCard label="Süreç" value={String(byCategory.process)} sub="İş akışları" clr="sky" />
          <KpiCard label="Hizmet (ADOS)" value={String(byCategory.service)} sub="Satış Panosu servisleri" clr="emerald" />
          <KpiCard label="Sistem" value={String(byCategory.system)} sub="Altyapı servisleri" clr="violet" />
          <KpiCard label="Özel Adım" value={String(Object.keys(CUSTOM_STEPS).length)} sub="JSON'a özel konfigürasyon" clr="amber" />
        </div>

        <div className="bg-gradient-to-br from-indigo-50 via-white to-violet-50/50 dark:from-indigo-500/5 dark:via-transparent dark:to-violet-500/5 border border-indigo-200 dark:border-indigo-500/20 rounded-xl p-3 flex items-start gap-2.5 mt-5">
          <Icon className="text-indigo-600 dark:text-indigo-400 w-4 h-4 shrink-0 mt-0.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></Icon>
          <div className="flex-1">
            <p className="text-[11px] text-gray-700 dark:text-gray-300"><span className="font-bold text-indigo-700 dark:text-indigo-300">Her JSON kendi düzenleme adımlarıyla yapılandırılır:</span> <span className="font-semibold">Ortak adımlar</span> (Temel Ayarlar → Prompt Bağlantıları → Agent & Model → Entegrasyonlar → Tetikleyiciler → Audit) tüm JSON'larda vardır. <span className="font-semibold">Özel adımlar</span> ADOS hizmetlerine özgüdür: SEO hedefleri, reklam politikası, NICE sınıfları, prodüksiyon kapasitesi vb. Bir JSON'u yapılandırmak için <span className="font-mono font-semibold">JSON'u Düzenle</span> butonuna tıklayın.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 mt-5">
          {visibleRegistry.map((item) => <JsonCard key={item.id} item={item} onView={() => openJson(item, 'view')} onEdit={() => openJson(item, 'edit')} />)}
        </div>

        {selectedJson ? (
          <JsonAgentModal
            item={selectedJson}
            mode={modalMode}
            editorView={editorView}
            onClose={() => setSelectedJson(null)}
            onSwitchView={setEditorView}
            onToast={setToast}
          />
        ) : null}

        {wizardOpen ? (
          <NewJsonWizard
            registry={visibleRegistry}
            wizardStart={wizardStart}
            uploadedName={uploadedName}
            onWizardStart={setWizardStart}
            onUploadedName={setUploadedName}
            onClose={() => {
              setWizardOpen(false);
              setUploadedName('');
            }}
            onSubmit={saveNewJson}
          />
        ) : null}

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

function JsonCard({ item, onView, onEdit }: { item: RegistryItem; onView: () => void; onEdit: () => void }) {
  const { clr: catClr, label: catLbl } = getCategoryMeta(item.category);
  const { clr: sClr, label: sLbl } = getStatusMeta(item.status);
  const hasCustomStep = Boolean(CUSTOM_STEPS[item.name]);
  const totalSteps = 6 + (hasCustomStep ? 1 : 0);
  const promptCount = item.prompts.filter((prompt) => prompt !== '—').length;
  const apiCount = item.apis[0] === '—' ? 0 : item.apis.length;

  return (
    <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden hover:shadow-sm hover:-translate-y-0.5 transition-all">
      <button onClick={onView} className="w-full p-3.5 border-b border-gray-100 dark:border-gray-700/40 text-left">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className={`w-8 h-8 bg-${catClr}-100 dark:bg-${catClr}-500/20 rounded-lg flex items-center justify-center shrink-0`}>
              <Icon className={`text-${catClr}-700 dark:text-${catClr}-300 w-4 h-4`}><path d="M4 4h16v16H4z" /><path d="M4 12h16" /><path d="M12 4v16" /></Icon>
            </div>
            <div className="min-w-0">
              <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100 font-mono truncate">{item.name}</p>
              <p className="text-[9px] font-mono text-gray-400 dark:text-gray-500">{item.version}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <span className={`text-[9px] font-semibold px-1.5 py-0.5 bg-${catClr}-100 dark:bg-${catClr}-900/30 text-${catClr}-700 dark:text-${catClr}-300 rounded`}>{catLbl}</span>
            <span className={`text-[9px] font-semibold px-1.5 py-0.5 bg-${sClr}-100 dark:bg-${sClr}-900/30 text-${sClr}-700 dark:text-${sClr}-300 rounded`}>{sLbl}</span>
          </div>
        </div>
        <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-snug line-clamp-2">{item.description}</p>
      </button>
      <div className="p-3.5 space-y-2.5">
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[10px]">
          <div><span className="text-gray-500 dark:text-gray-400">Agent:</span> <span className="font-semibold text-gray-900 dark:text-gray-100 font-mono">{item.agent === '—' ? <span className="text-gray-400">yok</span> : item.agent}</span></div>
          <div><span className="text-gray-500 dark:text-gray-400">Model:</span> <span className="font-semibold text-gray-900 dark:text-gray-100 font-mono">{item.model === '—' ? <span className="text-gray-400">—</span> : item.model}</span></div>
          <div><span className="text-gray-500 dark:text-gray-400">Prompt:</span> <span className="font-semibold text-gray-900 dark:text-gray-100">{promptCount}</span></div>
          <div><span className="text-gray-500 dark:text-gray-400">API:</span> <span className="font-semibold text-gray-900 dark:text-gray-100">{apiCount}</span></div>
          <div><span className="text-gray-500 dark:text-gray-400">Trigger:</span> <span className="font-semibold text-gray-900 dark:text-gray-100">{item.triggers}/24h</span></div>
          <div><span className="text-gray-500 dark:text-gray-400">Son:</span> <span className="font-semibold text-gray-900 dark:text-gray-100">{item.lastUpdate} önce</span></div>
        </div>

        <div className="flex items-center gap-1.5 pt-2 border-t border-gray-100 dark:border-gray-700/40">
          <Icon className="text-indigo-500 dark:text-indigo-400 w-3 h-3"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></Icon>
          <span className="text-[10px] font-semibold text-indigo-700 dark:text-indigo-300">{totalSteps} adım tanımlı</span>
          {hasCustomStep ? <span className="text-[9px] font-semibold px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded ml-auto">+ ÖZEL ADIM</span> : <span className="text-[9px] text-gray-400 dark:text-gray-500 ml-auto">standart</span>}
        </div>

        <div className="flex items-center gap-1.5">
          <button onClick={onView} className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-[10px] font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md transition-colors">
            <Icon className="w-3 h-3"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></Icon>
            Görüntüle
          </button>
          <button onClick={onEdit} className="flex-[1.5] flex items-center justify-center gap-1 px-2 py-1.5 text-[10px] font-bold bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 text-white rounded-md transition-colors">
            <Icon className="w-3 h-3"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></Icon>
            JSON'u Düzenle
          </button>
        </div>
      </div>
    </div>
  );
}

function JsonAgentModal({ item, mode, editorView, onClose, onSwitchView, onToast }: { item: RegistryItem; mode: ModalMode; editorView: EditorView; onClose: () => void; onSwitchView: (view: EditorView) => void; onToast: (toast: ToastState) => void }) {
  const { clr: catClr, label: catLbl } = getCategoryMeta(item.category);
  const steps = buildSteps(item);
  const readOnly = mode === 'view';

  return (
    <>
      <div className="modal-overlay absolute inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose}></div>
      <div className="modal-panel absolute inset-0 flex items-start justify-center p-4 pointer-events-none z-50">
        <div className="modal-scroll bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-xl w-full max-w-[900px] max-h-[92vh] overflow-y-auto pointer-events-auto">
          <div className="sticky top-0 z-10 bg-white dark:bg-[#1e1f26] border-b border-gray-100 dark:border-gray-700/60 p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-11 h-11 bg-${catClr}-100 dark:bg-${catClr}-500/20 rounded-xl flex items-center justify-center shrink-0`}>
                  <Icon className={`text-${catClr}-700 dark:text-${catClr}-300 w-5 h-5`}><path d="M4 4h16v16H4z" /><path d="M4 12h16" /><path d="M12 4v16" /></Icon>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-[16px] font-bold text-gray-900 dark:text-gray-100 font-mono truncate">{item.name}</h2>
                    <span className="text-[10px] font-mono text-gray-500 dark:text-gray-500">{item.version}</span>
                    <span className={`text-[9px] font-semibold px-1.5 py-0.5 bg-${catClr}-100 dark:bg-${catClr}-900/30 text-${catClr}-700 dark:text-${catClr}-300 rounded`}>{catLbl}</span>
                    {readOnly ? <span className="text-[9px] font-semibold px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded">Salt-okunur</span> : null}
                  </div>
                  <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-0.5">{item.description}</p>
                  <p className="text-[9px] text-gray-400 dark:text-gray-500 mt-0.5">{steps.length} adım · {item.lastUpdate} önce güncellendi</p>
                </div>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1 shrink-0">
                <Icon className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Icon>
              </button>
            </div>

            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-0.5 p-0.5 bg-gray-100 dark:bg-[#17181f] border border-gray-200 dark:border-gray-700/40 rounded-md">
                <button id="jaeFormBtn" onClick={() => onSwitchView('form')} className={`px-2.5 py-1 text-[10px] font-semibold rounded flex items-center gap-1 ${editorView === 'form' ? 'bg-white dark:bg-[#2a2b33] text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}`}>
                  <Icon className="w-3 h-3"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></Icon>
                  Form
                </button>
                <button id="jaeCodeBtn" onClick={() => onSwitchView('code')} className={`px-2.5 py-1 text-[10px] font-semibold rounded flex items-center gap-1 ${editorView === 'code' ? 'bg-white dark:bg-[#2a2b33] text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}`}>
                  <Icon className="w-3 h-3"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></Icon>
                  Ham JSON
                </button>
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={() => onToast({ title: 'İndirildi', message: `${item.name} başarıyla bilgisayara indirildi`, color: 'emerald' })} className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-[#23242c]">
                  <Icon className="w-3 h-3"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></Icon>
                  Download
                </button>
                <button onClick={() => onToast({ title: 'JSON Yükle', message: `${item.name} için JSON dosyası seçimi açılıyor`, color: 'violet' })} className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-[#23242c]">
                  <Icon className="w-3 h-3"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></Icon>
                  JSON Yükle
                </button>
              </div>
            </div>
          </div>

          <div id="jaeFormView" className={`${editorView === 'form' ? '' : 'hidden'} p-5 space-y-2.5`}>
            {steps.map((step, index) => <StepDetails key={step.key} step={step} item={item} open={index === 0} readOnly={readOnly} onToast={onToast} />)}
          </div>

          <div id="jaeCodeView" className={editorView === 'code' ? '' : 'hidden'}>
            <div className="px-4 py-2 bg-amber-50 dark:bg-amber-500/10 border-b border-amber-200 dark:border-amber-500/20 flex items-center gap-2">
              <Icon className="text-amber-600 dark:text-amber-400 w-3.5 h-3.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></Icon>
              <p className="text-[10px] text-amber-800 dark:text-amber-300"><span className="font-bold">Gelişmiş:</span> JSON kodunu doğrudan düzenleyin. <span className="font-semibold">Download</span> ile bilgisayara indirip <span className="font-semibold">JSON Yükle</span> ile geri yükleyebilirsiniz.</p>
            </div>
            <div className="p-4 bg-gray-900 dark:bg-[#0a0b0f] font-mono text-[11px] leading-relaxed overflow-x-auto">
              <pre id="jaeJsonEditor" contentEditable={!readOnly} suppressContentEditableWarning spellCheck={false} className="text-gray-300 outline-none">{generateJsonCodePlain(item)}</pre>
            </div>
          </div>

          <div className="sticky bottom-0 bg-white dark:bg-[#1e1f26] border-t border-gray-100 dark:border-gray-700/60 p-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-[10px] text-gray-500 dark:text-gray-400">
              <Icon className="w-3 h-3"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></Icon>
              <span>Son kayıt: <span className="font-semibold text-gray-700 dark:text-gray-300">{item.lastUpdate} önce</span> · <span className="font-mono">{item.version}</span></span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={onClose} className="px-3 py-2 text-[11px] font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">{readOnly ? 'Kapat' : 'İptal'}</button>
              {!readOnly ? <button onClick={() => onToast({ title: 'Validate', message: `${item.name} · şema geçerli · ${steps.length} adım doğrulandı`, color: 'emerald' })} className="px-3 py-2 text-[11px] font-semibold bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-[#23242c]">Validate</button> : null}
              {!readOnly ? (
                <button onClick={() => { onToast({ title: 'Kaydedildi & Deploy', message: `${item.name} yeni versiyonu oluşturuldu · audit log'a yazıldı`, color: 'emerald' }); onClose(); }} className="flex items-center gap-1.5 px-4 py-2 text-[11px] font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-md">
                  <Icon className="w-3 h-3"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /></Icon>
                  Kaydet & Deploy
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function StepDetails({ step, item, open, readOnly, onToast }: { step: Step; item: RegistryItem; open: boolean; readOnly: boolean; onToast: (toast: ToastState) => void }) {
  const bgAccent = step.isCustom ? 'bg-amber-50 dark:bg-amber-500/5 border-amber-300 dark:border-amber-500/30' : 'bg-gray-50 dark:bg-[#17181f] border-gray-200 dark:border-gray-700/40';
  return (
    <details open={open} className={`${bgAccent} border rounded-lg overflow-hidden group`}>
      <summary className="px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-white/40 dark:hover:bg-white/5 list-none">
        <div className={`w-7 h-7 ${step.isCustom ? 'bg-amber-100 dark:bg-amber-500/20 border-amber-300 dark:border-amber-500/40' : 'bg-white dark:bg-[#1e1f26] border-gray-200 dark:border-gray-700'} border rounded-lg flex items-center justify-center shrink-0`}>
          <Icon className={`${step.isCustom ? 'text-amber-700 dark:text-amber-300' : 'text-gray-600 dark:text-gray-400'} w-3.5 h-3.5`}>{step.icon}</Icon>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[10px] font-mono font-bold ${step.isCustom ? 'text-amber-700 dark:text-amber-300' : 'text-gray-500 dark:text-gray-500'}`}>ADIM {buildSteps(item).findIndex((itemStep) => itemStep.key === step.key) + 1}</span>
            <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100">{step.title}</p>
            {step.isCustom ? <span className="text-[9px] font-bold px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded">★ ÖZEL ADIM</span> : null}
          </div>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 truncate">{step.desc}</p>
        </div>
        <Icon className="text-gray-400 dark:text-gray-500 w-4 h-4 shrink-0 transition-transform group-open:rotate-180"><polyline points="6 9 12 15 18 9" /></Icon>
      </summary>
      <div className="p-4 pt-0 border-t border-gray-200/70 dark:border-gray-700/40">
        <StepContent step={step} item={item} readOnly={readOnly} onToast={onToast} />
      </div>
    </details>
  );
}

function StepContent({ step, item, readOnly, onToast }: { step: Step; item: RegistryItem; readOnly: boolean; onToast: (toast: ToastState) => void }) {
  const disabledClass = readOnly ? 'disabled:opacity-80' : '';

  if (step.key === 'basic') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3">
        <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Şema</label><input disabled={readOnly} defaultValue={item.name.replace('.JSON', '.v1').toLowerCase()} className={`w-full px-3 py-2 text-[12px] bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono focus:outline-none focus:border-indigo-500 ${disabledClass}`} /></div>
        <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Versiyon</label><input disabled={readOnly} defaultValue={item.version} className={`w-full px-3 py-2 text-[12px] bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono focus:outline-none focus:border-indigo-500 ${disabledClass}`} /></div>
        <div className="md:col-span-2"><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Ad</label><input disabled={readOnly} defaultValue={item.name.replace('.JSON', '').replace(/_/g, ' ')} className={`w-full px-3 py-2 text-[12px] bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:border-indigo-500 ${disabledClass}`} /></div>
        <div className="md:col-span-2"><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Açıklama</label><textarea disabled={readOnly} rows={2} defaultValue={item.description} className={`w-full px-3 py-2 text-[12px] bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 resize-none focus:outline-none focus:border-indigo-500 ${disabledClass}`} /></div>
        <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Kategori</label><select disabled={readOnly} defaultValue={getCategoryMeta(item.category).label} className={`w-full px-3 py-2 text-[12px] bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:border-indigo-500 ${disabledClass}`}><option>Süreç</option><option>Hizmet</option><option>Sistem</option></select></div>
        <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Durum</label><select disabled={readOnly} defaultValue={getStatusMeta(item.status).label} className={`w-full px-3 py-2 text-[12px] bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:border-indigo-500 ${disabledClass}`}><option>Aktif</option><option>Durduruldu</option><option>Review</option></select></div>
      </div>
    );
  }

  if (step.key === 'prompts') {
    const prompts = item.prompts.filter((prompt) => prompt !== '—');
    return (
      <div className="pt-3 space-y-2">
        {prompts.length === 0 ? <p className="text-[11px] text-gray-400 italic py-3">Bu JSON prompt gerektirmez (veri koordinasyon JSON'u).</p> : prompts.map((prompt, index) => (
          <div key={prompt} className="flex items-center gap-2 p-2.5 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-md">
            <span className="text-[10px] font-bold font-mono text-sky-600 dark:text-sky-400 shrink-0">#{index + 1}</span>
            <span className="flex-1 text-[11px] font-mono text-gray-900 dark:text-gray-100 truncate">{prompt}</span>
            <span className="text-[9px] font-semibold px-1.5 py-0.5 bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 rounded shrink-0">Aktif</span>
            <button onClick={() => onToast({ title: 'Prompt Detay', message: `${prompt} açılıyor`, color: 'sky' })} className="text-[9px] text-sky-700 dark:text-sky-300 hover:underline shrink-0">Aç</button>
            {!readOnly ? <button onClick={() => onToast({ title: 'Kaldırıldı', message: `${prompt} bağlantısı kaldırıldı`, color: 'rose' })} className="text-gray-400 hover:text-rose-600 shrink-0"><Icon className="w-3 h-3"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Icon></button> : null}
          </div>
        ))}
        {!readOnly ? (
          <button onClick={() => onToast({ title: 'Prompt Ekle', message: 'Prompt kütüphanesinden seçim açılıyor', color: 'sky' })} className="w-full p-2.5 border border-dashed border-sky-300 dark:border-sky-500/40 text-sky-700 dark:text-sky-300 text-[11px] font-semibold rounded-md hover:bg-sky-50 dark:hover:bg-sky-500/10 flex items-center justify-center gap-1.5">
            <Icon className="w-3 h-3"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></Icon>
            Prompt Ekle
          </button>
        ) : null}
      </div>
    );
  }

  if (step.key === 'agent') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3">
        <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Agent</label><input disabled={readOnly} defaultValue={item.agent} className={`w-full px-3 py-2 text-[12px] bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono focus:outline-none focus:border-indigo-500 ${disabledClass}`} /></div>
        <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Agent Versiyon</label><input disabled={readOnly} defaultValue={item.agentVer} className={`w-full px-3 py-2 text-[12px] bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono focus:outline-none focus:border-indigo-500 ${disabledClass}`} /></div>
        <div className="md:col-span-2"><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Birincil AI Model</label><select disabled={readOnly} defaultValue={item.model.includes('DALL') ? 'GPT-4 + DALL-E' : item.model === '—' ? 'Model kullanılmıyor' : item.model} className={`w-full px-3 py-2 text-[12px] bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono focus:outline-none focus:border-indigo-500 ${disabledClass}`}><option>Claude 4.7</option><option>GPT-4</option><option>Gemini 2.0</option><option>GPT-4 + DALL-E</option><option>Model kullanılmıyor</option></select></div>
        <div className="md:col-span-2"><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Fallback Zinciri</label><div className="flex items-center gap-1.5 flex-wrap p-2 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-md"><span className="text-[10px] font-mono font-semibold px-2 py-0.5 bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300 rounded">1. {item.model === '—' ? '—' : item.model}</span><span className="text-gray-400">→</span><span className="text-[10px] font-mono font-semibold px-2 py-0.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 rounded">2. GPT-4</span><span className="text-gray-400">→</span><span className="text-[10px] font-mono font-semibold px-2 py-0.5 bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 rounded">3. Gemini 2.0</span></div></div>
      </div>
    );
  }

  if (step.key === 'custom') {
    const custom = CUSTOM_STEPS[item.name];
    return (
      <div className="pt-3 space-y-3">
        {custom.customStep.fields.map((field) => <CustomFieldView key={field.label} field={field} readOnly={readOnly} />)}
      </div>
    );
  }

  if (step.key === 'integrations') {
    const apis = item.apis[0] === '—' ? [] : item.apis;
    return (
      <div className="pt-3 space-y-2">
        {apis.length === 0 ? <p className="text-[11px] text-gray-400 italic py-3">Bu JSON dış entegrasyon gerektirmez.</p> : apis.map((api) => (
          <div key={api} className="flex items-center gap-2 p-2.5 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-md">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0"></span>
            <span className="flex-1 text-[11px] font-semibold text-gray-900 dark:text-gray-100">{api}</span>
            <span className="text-[9px] font-semibold px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded">Bağlı</span>
            <button onClick={() => onToast({ title: 'Yapılandır', message: `${api} yapılandırması açılıyor`, color: 'amber' })} className="text-[9px] text-amber-700 dark:text-amber-300 hover:underline">Yapılandır</button>
            {!readOnly ? <button onClick={() => onToast({ title: 'Kaldırıldı', message: `${api} bağlantısı kaldırıldı`, color: 'rose' })} className="text-gray-400 hover:text-rose-600"><Icon className="w-3 h-3"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Icon></button> : null}
          </div>
        ))}
        {!readOnly ? (
          <button onClick={() => onToast({ title: 'Entegrasyon Ekle', message: 'Entegrasyonlar sayfası açılıyor', color: 'amber' })} className="w-full p-2.5 border border-dashed border-amber-300 dark:border-amber-500/40 text-amber-700 dark:text-amber-300 text-[11px] font-semibold rounded-md hover:bg-amber-50 dark:hover:bg-amber-500/10 flex items-center justify-center gap-1.5">
            <Icon className="w-3 h-3"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></Icon>
            Entegrasyon Ekle (Entegrasyonlar sayfası)
          </button>
        ) : null}
      </div>
    );
  }

  if (step.key === 'triggers') {
    return (
      <div className="pt-3 space-y-3">
        <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Tetikleme Kuralı</label><input disabled={readOnly} defaultValue={item.trigger} className={`w-full px-3 py-2 text-[12px] bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:border-emerald-500 ${disabledClass}`} /></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Tetikleme Tipi</label><select disabled={readOnly} defaultValue="Event-driven" className={`w-full px-3 py-2 text-[12px] bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:border-emerald-500 ${disabledClass}`}><option>Zamanlanmış (cron)</option><option>Event-driven</option><option>Manuel (talep üzerine)</option><option>Hibrit</option></select></div>
          <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Son 24 Saat Tetiklenme</label><input disabled={readOnly} type="number" defaultValue={item.triggers} className={`w-full px-3 py-2 text-[12px] bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono focus:outline-none focus:border-emerald-500 ${disabledClass}`} /></div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-3 space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Audit Endpoint</label><input disabled={readOnly} defaultValue={`timescaledb://audit_stream/${item.id}`} className={`w-full px-3 py-2 text-[12px] bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono focus:outline-none focus:border-indigo-500 ${disabledClass}`} /></div>
        <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Saklama</label><input disabled={readOnly} defaultValue="365 gün" className={`w-full px-3 py-2 text-[12px] bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono focus:outline-none focus:border-indigo-500 ${disabledClass}`} /></div>
        <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Log Level</label><select disabled={readOnly} defaultValue="INFO" className={`w-full px-3 py-2 text-[12px] bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono focus:outline-none focus:border-indigo-500 ${disabledClass}`}><option>INFO</option><option>WARN</option><option>ERROR</option><option>DEBUG</option></select></div>
      </div>
    </div>
  );
}

function CustomFieldView({ field, readOnly }: { field: CustomField; readOnly: boolean }) {
  if (field.type === 'chips') {
    return (
      <div>
        <label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">{field.label}</label>
        <div className="flex flex-wrap gap-1.5 p-2 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-md min-h-[42px]">
          {field.options.map((option) => {
            const selected = field.selected.includes(option);
            return <button key={option} disabled={readOnly} className={`text-[10px] font-semibold px-2 py-1 border rounded transition-colors ${selected ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-500/40' : 'bg-gray-50 dark:bg-[#17181f] text-gray-500 dark:text-gray-500 border-gray-200 dark:border-gray-700'}`}>{option}</button>;
          })}
        </div>
      </div>
    );
  }

  if (field.type === 'select') {
    return (
      <div>
        <label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">{field.label}</label>
        <select disabled={readOnly} defaultValue={field.value} className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:border-amber-500">
          {field.options.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div>
    );
  }

  return (
    <div>
      <label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">{field.label}</label>
      <div className="flex items-center gap-2">
        <input disabled={readOnly} type="number" defaultValue={field.value} className="flex-1 px-3 py-2 text-[12px] bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono focus:outline-none focus:border-amber-500" />
        {field.unit ? <span className="text-[11px] text-gray-500 dark:text-gray-400 shrink-0">{field.unit}</span> : null}
      </div>
    </div>
  );
}

function NewJsonWizard({ registry, wizardStart, uploadedName, onWizardStart, onUploadedName, onClose, onSubmit }: { registry: RegistryItem[]; wizardStart: WizardStart; uploadedName: string; onWizardStart: (start: WizardStart) => void; onUploadedName: (name: string) => void; onClose: () => void; onSubmit: (formData: FormData) => void }) {
  return (
    <>
      <div className="modal-overlay absolute inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose}></div>
      <div className="modal-panel absolute inset-0 flex items-start justify-center p-4 pointer-events-none z-50">
        <form onSubmit={(event) => { event.preventDefault(); onSubmit(new FormData(event.currentTarget)); }} className="modal-scroll bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-xl w-full max-w-[680px] max-h-[92vh] overflow-y-auto pointer-events-auto">
          <div className="sticky top-0 z-10 bg-white dark:bg-[#1e1f26] border-b border-gray-100 dark:border-gray-700/60 p-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg flex items-center justify-center">
                <Icon className="text-indigo-600 dark:text-indigo-400 w-4 h-4"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></Icon>
              </div>
              <div>
                <h2 className="text-[15px] font-bold text-gray-900 dark:text-gray-100">Yeni JSON Tanımla</h2>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">Dosya yükle veya sıfırdan oluştur · ADOS registry'ye eklenecek</p>
              </div>
            </div>
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1">
              <Icon className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Icon>
            </button>
          </div>

          <div className="p-5 space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 rounded-full flex items-center justify-center text-[10px] font-bold">1</span>
                <h3 className="text-[12px] font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Başlangıç Yöntemi</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <WizardOption value="upload" selected={wizardStart === 'upload'} onSelect={onWizardStart} title="Dosya Yükle" desc="Bilgisayardan .json dosyası yükle" icon={<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></>} />
                <WizardOption value="scratch" selected={wizardStart === 'scratch'} onSelect={onWizardStart} title="Sıfırdan" desc="Boş şablondan başla" icon={<><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>} />
                <WizardOption value="copy" selected={wizardStart === 'copy'} onSelect={onWizardStart} title="Kopyala" desc="Mevcut bir JSON'dan başla" icon={<><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></>} />
              </div>

              <div id="njUploadBox" className={`${wizardStart === 'upload' ? '' : 'hidden'} mt-3`}>
                <label className="flex flex-col items-center justify-center gap-2 p-5 border-2 border-dashed border-indigo-300 dark:border-indigo-500/40 rounded-lg cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-500/5">
                  <input id="njFile" type="file" accept=".json,application/json" className="sr-only" onChange={(event) => onUploadedName(event.currentTarget.files?.[0] ? `${event.currentTarget.files[0].name} · ${(event.currentTarget.files[0].size / 1024).toFixed(1)}KB seçildi` : '')} />
                  <Icon className="text-indigo-500 w-8 h-8"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></Icon>
                  <div className="text-center">
                    <p className="text-[12px] font-semibold text-gray-900 dark:text-gray-100">Dosya seçin veya sürükleyin</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">Sadece .json dosyaları · max 5MB</p>
                  </div>
                  <p id="njFileName" className={`${uploadedName ? '' : 'hidden'} text-[11px] font-mono font-semibold text-indigo-700 dark:text-indigo-300`}>{uploadedName}</p>
                </label>
              </div>

              <div id="njCopyBox" className={`${wizardStart === 'copy' ? '' : 'hidden'} mt-3`}>
                <label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Hangi JSON'dan kopyalansın?</label>
                <select className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:border-indigo-500 font-mono">
                  {registry.map((item) => <option key={item.id} value={item.id}>{item.name} ({item.version})</option>)}
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-700/40">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 rounded-full flex items-center justify-center text-[10px] font-bold">2</span>
                <h3 className="text-[12px] font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">JSON Kimliği</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">JSON Adı *</label>
                  <div className="flex items-center gap-2">
                    <input id="njName" name="njName" type="text" placeholder="Ornek_Modul" className="flex-1 px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono focus:outline-none focus:border-indigo-500" />
                    <span className="text-[11px] font-mono text-gray-500 dark:text-gray-400 shrink-0">.JSON</span>
                  </div>
                  <p className="text-[9px] text-gray-400 dark:text-gray-500 mt-1">Alt çizgi ile ayrılmış · örn: <span className="font-mono">Musteri_Destek</span></p>
                </div>
                <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Kategori *</label><select id="njCategory" name="njCategory" defaultValue="service" className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:border-indigo-500"><option value="process">Süreç (iş akışı)</option><option value="service">Hizmet (ADOS servisi)</option><option value="system">Sistem (altyapı)</option></select></div>
                <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Versiyon</label><input id="njVersion" name="njVersion" type="text" defaultValue="v1.0.0" className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono focus:outline-none focus:border-indigo-500" /></div>
                <div className="md:col-span-2"><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Açıklama *</label><textarea id="njDesc" name="njDesc" rows={2} placeholder="Bu JSON neyi yönetir?" className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 resize-none focus:outline-none focus:border-indigo-500" /></div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-700/40">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 rounded-full flex items-center justify-center text-[10px] font-bold">3</span>
                <h3 className="text-[12px] font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">İlk Yapılandırma <span className="text-gray-400 dark:text-gray-500 font-normal normal-case">(opsiyonel)</span></h3>
              </div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-3">Bu alanlar daha sonra <span className="font-semibold">JSON'u Düzenle</span> ile de ayarlanabilir.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Agent Adı</label><input id="njAgent" name="njAgent" type="text" placeholder="MyAgent" className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono focus:outline-none focus:border-indigo-500" /></div>
                <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">AI Model</label><select id="njModel" name="njModel" defaultValue="Claude 4.7" className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono focus:outline-none focus:border-indigo-500"><option value="Claude 4.7">Claude 4.7</option><option value="GPT-4">GPT-4</option><option value="Gemini 2.0">Gemini 2.0</option><option value="—">Model kullanılmıyor</option></select></div>
                <div className="md:col-span-2"><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Tetikleme Kuralı</label><input id="njTrigger" name="njTrigger" type="text" placeholder="ör. Günlük + talep üzerine" className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:border-indigo-500" /></div>
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 bg-white dark:bg-[#1e1f26] border-t border-gray-100 dark:border-gray-700/60 p-4 flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className="px-3 py-2 text-[11px] font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">İptal</button>
            <button type="submit" className="flex items-center gap-1.5 px-4 py-2 text-[11px] font-bold bg-gray-900 dark:bg-gray-100 dark:text-gray-900 text-white rounded-md hover:opacity-90">
              <Icon className="w-3.5 h-3.5"><polyline points="20 6 9 17 4 12" /></Icon>
              Oluştur & ADOS Registry'ye Ekle
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
      <input type="radio" name="njStart" value={value} className="sr-only peer" checked={selected} onChange={() => onSelect(value)} />
      <div className="p-3 bg-white dark:bg-[#17181f] border-2 border-gray-200 dark:border-gray-700 peer-checked:border-indigo-500 peer-checked:bg-indigo-50 dark:peer-checked:bg-indigo-500/10 rounded-lg transition-all">
        <div className="flex items-start gap-2 mb-1">
          <Icon className="text-indigo-600 dark:text-indigo-400 w-4 h-4 shrink-0 mt-0.5">{icon}</Icon>
          <span className="text-[11px] font-bold text-gray-900 dark:text-gray-100">{title}</span>
        </div>
        <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-snug">{desc}</p>
      </div>
    </label>
  );
}

function generateJsonCodePlain(item: RegistryItem) {
  return JSON.stringify({
    schema: item.name.replace('.JSON', '.v1').toLowerCase(),
    version: item.version,
    name: item.name.replace('.JSON', '').replace(/_/g, ' '),
    category: item.category,
    description: item.description,
    agent: { name: item.agent, version: item.agentVer },
    model: { primary: item.model, fallback: ['gpt-4', 'gemini-2.0'] },
    prompts: item.prompts.filter((prompt) => prompt !== '—'),
    integrations: item.apis[0] === '—' ? [] : item.apis,
    trigger: item.trigger,
    status: item.status,
    triggers_24h: item.triggers,
    size: item.size,
    audit: {
      endpoint: `timescaledb://audit_stream/${item.id}`,
      retention_days: 365,
      log_level: 'INFO',
    },
    updated_at: '2026-04-23T21:18:00+03:00',
  }, null, 2);
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
      <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: '13px', color: color.bg, marginBottom: '2px' }}>{toast.title}</div>
          <div style={{ fontSize: '11px', color: '#6b7280' }}>{toast.message}</div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: '16px' }}>×</button>
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, height: '2px', background: color.bg, borderRadius: '0 0 10px 10px', animation: 'toastProgress 3s linear' }}></div>
    </div>
  );
}
