import { type FormEvent, type ReactNode, useState } from 'react';
import Layout from '../components/Layout';

type ColorName = 'emerald' | 'amber' | 'rose' | 'sky' | 'violet' | 'indigo' | 'teal' | 'pink' | 'gray';
type IntegrationStatus = 'connected' | 'warning' | 'error' | 'pending' | 'standby';
type AuthType = 'oauth2' | 'api_key' | 'basic' | 'bearer';
type ToastState = { title: string; message: string; color: ColorName } | null;
type ModalState = { kind: 'edit'; item: Integration } | { kind: 'new' } | null;

type Integration = {
  id: string;
  name: string;
  provider: string;
  category: string;
  categoryClr: ColorName;
  role: string;
  description: string;
  endpoint: string;
  authType: AuthType;
  status: IntegrationStatus;
  lastSync: string;
  callsMonth: string;
  boundJsons: string[];
  boundAgents: string[];
  iconHue: ColorName;
  highlight?: boolean;
  warningNote?: string;
  errorNote?: string;
  pendingNote?: string;
};

type Template = {
  provider: string;
  category: string;
  endpoint: string;
  authType: AuthType;
  iconHue: ColorName;
  role: string;
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

const STATUS: Record<IntegrationStatus, { clr: ColorName; lbl: string; dot?: boolean }> = {
  connected: { clr: 'emerald', lbl: 'Bağlı', dot: true },
  warning: { clr: 'amber', lbl: 'Uyarı' },
  error: { clr: 'rose', lbl: 'Hata' },
  pending: { clr: 'amber', lbl: 'Bekliyor' },
  standby: { clr: 'gray', lbl: 'Standby' },
};

const CATEGORY_COLOR: Record<string, ColorName> = {
  'Hosting & Altyapı': 'violet',
  'Finans & Muhasebe': 'amber',
  'CRM & Satış': 'emerald',
  'SEO & Analitik': 'sky',
  'Reklam Platformları': 'indigo',
  'Sosyal Medya': 'rose',
  'Marka Tescili': 'amber',
  'Operasyon & Ekip': 'teal',
  Pazarlama: 'pink',
};

const INITIAL_INTEGRATIONS: Integration[] = [
  { id: 'metunic', name: 'Metunic', provider: 'Metunic', category: 'Hosting & Altyapı', categoryClr: 'violet', role: 'Domain Tescil & DNS', description: 'Türkiye .com.tr / .tr domain tescil · DNS yönetimi · WHOIS', endpoint: 'https://api.metunic.com.tr/v2', authType: 'api_key', status: 'connected', lastSync: '12sa', callsMonth: '124', boundJsons: ['Domain_Hosting.JSON'], boundAgents: ['DomainAgent'], iconHue: 'violet' },
  { id: 'plesk', name: 'Plesk', provider: 'Plesk', category: 'Hosting & Altyapı', categoryClr: 'violet', role: 'Sunucu Yönetim Paneli', description: 'VPS/Dedicated hosting kontrol paneli · otomatik kurulum · SSL yönetimi', endpoint: 'https://plesk.armadigital.com:8443/api/v2', authType: 'api_key', status: 'connected', lastSync: '3sa', callsMonth: '480', boundJsons: ['Domain_Hosting.JSON'], boundAgents: ['DomainAgent'], iconHue: 'indigo' },
  { id: 'cpanel', name: 'cPanel', provider: 'cPanel', category: 'Hosting & Altyapı', categoryClr: 'violet', role: 'Shared Hosting Panel', description: 'Shared hosting müşteri paneli · e-posta · FTP · veritabanı', endpoint: 'https://cpanel.armadigital.com:2083/api', authType: 'api_key', status: 'connected', lastSync: '1sa', callsMonth: '1.2K', boundJsons: ['Domain_Hosting.JSON'], boundAgents: ['DomainAgent'], iconHue: 'indigo' },
  { id: 'cloudflare', name: 'Cloudflare', provider: 'Cloudflare', category: 'Hosting & Altyapı', categoryClr: 'violet', role: 'CDN & DDoS Koruması', description: 'CDN · DDoS koruma · DNS · SSL yönetimi', endpoint: 'https://api.cloudflare.com/client/v4', authType: 'api_key', status: 'connected', lastSync: '42dk', callsMonth: '3.4K', boundJsons: ['Domain_Hosting.JSON', 'Web_Sitesi.JSON'], boundAgents: ['DomainAgent', 'WebAgent'], iconHue: 'amber' },
  { id: 'parasut', name: 'Paraşüt', provider: 'Paraşüt', category: 'Finans & Muhasebe', categoryClr: 'amber', role: 'E-Fatura · Tahsilat', description: 'Ön muhasebe · e-fatura · e-arşiv · ödeme takibi · GIB entegrasyonu', endpoint: 'https://api.parasut.com/v4', authType: 'oauth2', status: 'connected', lastSync: '12dk', callsMonth: '4.2K', boundJsons: ['Finans_Talimat.JSON'], boundAgents: ['FinanceAgent'], iconHue: 'emerald' },
  { id: 'stripe', name: 'Stripe', provider: 'Stripe', category: 'Finans & Muhasebe', categoryClr: 'amber', role: 'Online Ödeme', description: 'Uluslararası kredi kartı tahsilat · abonelik yönetimi', endpoint: 'https://api.stripe.com/v1', authType: 'api_key', status: 'connected', lastSync: '8dk', callsMonth: '2.8K', boundJsons: ['Finans_Talimat.JSON'], boundAgents: ['FinanceAgent'], iconHue: 'violet' },
  { id: 'iyzico', name: 'İyzico', provider: 'İyzico', category: 'Finans & Muhasebe', categoryClr: 'amber', role: 'Yerel Ödeme', description: 'Türkiye kredi kartı · taksit · havale tahsilat', endpoint: 'https://api.iyzipay.com/payment/auth', authType: 'api_key', status: 'connected', lastSync: '22dk', callsMonth: '1.8K', boundJsons: ['Finans_Talimat.JSON'], boundAgents: ['FinanceAgent'], iconHue: 'sky' },
  { id: 'hubspot', name: 'HubSpot CRM', provider: 'HubSpot', category: 'CRM & Satış', categoryClr: 'emerald', role: 'Müşteri İlişkileri', description: 'Lead yönetimi · kontak veritabanı · satış boru hattı · deal tracking', endpoint: 'https://api.hubapi.com/crm/v3', authType: 'oauth2', status: 'connected', lastSync: '15dk', callsMonth: '6.8K', boundJsons: ['Satis_Talimat.JSON', 'Musteri_Portfoy.JSON'], boundAgents: ['SalesAgent', 'CustomerHealthAgent'], iconHue: 'emerald' },
  { id: 'salesforce', name: 'Salesforce', provider: 'Salesforce', category: 'CRM & Satış', categoryClr: 'emerald', role: 'Enterprise CRM', description: 'Büyük müşteri yönetimi · forecasting · reporting', endpoint: 'https://armadigital.my.salesforce.com/services/data/v58.0', authType: 'oauth2', status: 'standby', lastSync: '—', callsMonth: '0', boundJsons: ['Satis_Talimat.JSON'], boundAgents: ['SalesAgent'], iconHue: 'sky' },
  { id: 'gsc', name: 'Google Search Console', provider: 'Google', category: 'SEO & Analitik', categoryClr: 'sky', role: 'Organik Arama Verisi', description: 'SEO performansı · keyword ranking · indeksleme · crawl hataları', endpoint: 'https://searchconsole.googleapis.com/v1', authType: 'oauth2', status: 'connected', lastSync: '2sa', callsMonth: '1.4K', boundJsons: ['SEO_Strateji.JSON', 'Web_Sitesi.JSON'], boundAgents: ['SeoAgent', 'WebAgent'], iconHue: 'sky', highlight: true },
  { id: 'ahrefs', name: 'Ahrefs', provider: 'Ahrefs', category: 'SEO & Analitik', categoryClr: 'sky', role: 'Backlink & Keyword Analizi', description: 'Backlink profili · keyword araştırma · rakip analizi', endpoint: 'https://api.ahrefs.com/v3', authType: 'api_key', status: 'connected', lastSync: '4sa', callsMonth: '680', boundJsons: ['SEO_Strateji.JSON'], boundAgents: ['SeoAgent'], iconHue: 'emerald' },
  { id: 'semrush', name: 'SEMrush', provider: 'SEMrush', category: 'SEO & Analitik', categoryClr: 'sky', role: 'SEO Rakip & Keyword', description: 'Keyword zorluk · rakip gap analizi · SERP tracking', endpoint: 'https://api.semrush.com', authType: 'api_key', status: 'connected', lastSync: '6sa', callsMonth: '420', boundJsons: ['SEO_Strateji.JSON'], boundAgents: ['SeoAgent'], iconHue: 'pink' },
  { id: 'ga4', name: 'Google Analytics 4', provider: 'Google', category: 'SEO & Analitik', categoryClr: 'sky', role: 'Web Trafik Analizi', description: 'Ziyaretçi davranışı · dönüşüm takibi · event tracking', endpoint: 'https://analyticsdata.googleapis.com/v1beta', authType: 'oauth2', status: 'connected', lastSync: '18dk', callsMonth: '3.2K', boundJsons: ['Web_Sitesi.JSON', 'Pazarlama_Talimat.JSON'], boundAgents: ['WebAgent', 'MarketingAgent'], iconHue: 'amber' },
  { id: 'lighthouse', name: 'Lighthouse / PageSpeed', provider: 'Google', category: 'SEO & Analitik', categoryClr: 'sky', role: 'Performans Ölçümü', description: 'Web sitesi hız · Core Web Vitals · accessibility · SEO skoru', endpoint: 'https://pagespeedonline.googleapis.com/pagespeedonline/v5', authType: 'api_key', status: 'connected', lastSync: '1g', callsMonth: '180', boundJsons: ['Web_Sitesi.JSON'], boundAgents: ['WebAgent'], iconHue: 'emerald' },
  { id: 'google-ads', name: 'Google Ads', provider: 'Google', category: 'Reklam Platformları', categoryClr: 'indigo', role: 'Arama & Display Reklamları', description: 'Search · display · shopping · YouTube kampanyaları · bütçe yönetimi', endpoint: 'https://googleads.googleapis.com/v17', authType: 'oauth2', status: 'connected', lastSync: '5dk', callsMonth: '12.4K', boundJsons: ['Google_Ads.JSON'], boundAgents: ['AdsAgent'], iconHue: 'indigo' },
  { id: 'meta-ads', name: 'Meta Ads', provider: 'Meta', category: 'Reklam Platformları', categoryClr: 'indigo', role: 'Facebook & Instagram Reklamları', description: 'Facebook · Instagram · Messenger reklamları · custom audience', endpoint: 'https://graph.facebook.com/v21.0', authType: 'oauth2', status: 'warning', lastSync: '45dk', callsMonth: '8.6K', boundJsons: ['Google_Ads.JSON', 'Sosyal_Medya.JSON'], boundAgents: ['AdsAgent', 'SocialAgent'], iconHue: 'sky', warningNote: 'OAuth token 7 gün içinde sona erecek' },
  { id: 'linkedin-ads', name: 'LinkedIn Ads', provider: 'LinkedIn', category: 'Reklam Platformları', categoryClr: 'indigo', role: 'B2B Reklamları', description: 'Sponsored content · InMail · B2B lead formu', endpoint: 'https://api.linkedin.com/rest/adAccounts', authType: 'oauth2', status: 'error', lastSync: '2g', callsMonth: '480', boundJsons: ['Google_Ads.JSON'], boundAgents: ['AdsAgent'], iconHue: 'sky', errorNote: 'OAuth refresh token hatası · yeniden yetkilendirme gerekli' },
  { id: 'tiktok-ads', name: 'TikTok Ads', provider: 'TikTok', category: 'Reklam Platformları', categoryClr: 'indigo', role: 'Video Reklam', description: 'TikTok video reklam · trend hashtag kampanyaları', endpoint: 'https://business-api.tiktok.com/open_api/v1.3', authType: 'oauth2', status: 'standby', lastSync: '—', callsMonth: '0', boundJsons: ['Google_Ads.JSON'], boundAgents: ['AdsAgent'], iconHue: 'rose' },
  { id: 'instagram', name: 'Instagram Graph API', provider: 'Meta', category: 'Sosyal Medya', categoryClr: 'rose', role: 'İçerik Yayınlama', description: 'Post · Reels · Story yayınlama · insights · yorumlar', endpoint: 'https://graph.instagram.com/v21.0', authType: 'oauth2', status: 'connected', lastSync: '30dk', callsMonth: '2.8K', boundJsons: ['Sosyal_Medya.JSON'], boundAgents: ['SocialAgent'], iconHue: 'pink' },
  { id: 'linkedin-cms', name: 'LinkedIn Content', provider: 'LinkedIn', category: 'Sosyal Medya', categoryClr: 'rose', role: 'Şirket Sayfa Yönetimi', description: 'Şirket sayfası post · etkileşim analizi', endpoint: 'https://api.linkedin.com/rest/posts', authType: 'oauth2', status: 'connected', lastSync: '1sa', callsMonth: '620', boundJsons: ['Sosyal_Medya.JSON'], boundAgents: ['SocialAgent'], iconHue: 'sky' },
  { id: 'x-api', name: 'X (Twitter) API', provider: 'X', category: 'Sosyal Medya', categoryClr: 'rose', role: 'Tweet & Thread', description: 'Tweet yayınlama · zamanlama · metrik takibi', endpoint: 'https://api.twitter.com/2', authType: 'oauth2', status: 'connected', lastSync: '2sa', callsMonth: '340', boundJsons: ['Sosyal_Medya.JSON'], boundAgents: ['SocialAgent'], iconHue: 'gray' },
  { id: 'turkpatent', name: 'TürkPatent', provider: 'TürkPatent', category: 'Marka Tescili', categoryClr: 'amber', role: 'Türkiye Marka Tescil', description: 'Marka arama · benzerlik analizi · başvuru takibi · NICE sınıflandırma', endpoint: 'https://api.turkpatent.gov.tr/v1', authType: 'api_key', status: 'connected', lastSync: '5sa', callsMonth: '48', boundJsons: ['Marka_Tescili.JSON'], boundAgents: ['TrademarkAgent'], iconHue: 'amber' },
  { id: 'wipo', name: 'WIPO Madrid', provider: 'WIPO', category: 'Marka Tescili', categoryClr: 'amber', role: 'Uluslararası Marka', description: 'Madrid Protokolü uluslararası marka tescil · EUIPO sorgulama', endpoint: 'https://www3.wipo.int/branddb/en/api', authType: 'api_key', status: 'standby', lastSync: '—', callsMonth: '8', boundJsons: ['Marka_Tescili.JSON'], boundAgents: ['TrademarkAgent'], iconHue: 'sky' },
  { id: 'ms-planner', name: 'Microsoft Planner', provider: 'Microsoft', category: 'Operasyon & Ekip', categoryClr: 'teal', role: 'Görev & Ekip Yönetimi', description: 'Personel görev atama · sprint yönetimi · proje takvimi', endpoint: 'https://graph.microsoft.com/v1.0/planner', authType: 'oauth2', status: 'connected', lastSync: '20dk', callsMonth: '1.8K', boundJsons: ['Operasyon_Ekip.JSON'], boundAgents: ['OperationsAgent'], iconHue: 'indigo' },
  { id: 'slack', name: 'Slack', provider: 'Slack', category: 'Operasyon & Ekip', categoryClr: 'teal', role: 'Ekip İletişim', description: 'Kanal mesajları · bot · audit notifications · onay akışları', endpoint: 'https://slack.com/api', authType: 'oauth2', status: 'connected', lastSync: '5dk', callsMonth: '8.4K', boundJsons: ['Master.JSON', 'Operasyon_Ekip.JSON'], boundAgents: ['ApprovalCoordinator', 'OperationsAgent'], iconHue: 'violet' },
  { id: 'mailchimp', name: 'Mailchimp', provider: 'Mailchimp', category: 'Pazarlama', categoryClr: 'pink', role: 'E-Posta Pazarlama', description: 'E-bülten kampanyaları · liste yönetimi · otomatik e-posta', endpoint: 'https://us12.api.mailchimp.com/3.0', authType: 'api_key', status: 'pending', lastSync: '—', callsMonth: '0', boundJsons: ['Pazarlama_Talimat.JSON'], boundAgents: ['MarketingAgent'], iconHue: 'amber', pendingNote: 'Yetkilendirme bekliyor · admin onayı gerekli' },
];

const TEMPLATES: Record<string, Template> = {
  parasut: { provider: 'Paraşüt', category: 'Finans & Muhasebe', endpoint: 'https://api.parasut.com/v4', authType: 'oauth2', iconHue: 'emerald', role: 'E-Fatura · Tahsilat' },
  stripe: { provider: 'Stripe', category: 'Finans & Muhasebe', endpoint: 'https://api.stripe.com/v1', authType: 'api_key', iconHue: 'violet', role: 'Online Ödeme' },
  hubspot: { provider: 'HubSpot', category: 'CRM & Satış', endpoint: 'https://api.hubapi.com/crm/v3', authType: 'oauth2', iconHue: 'emerald', role: 'CRM' },
  gsc: { provider: 'Google', category: 'SEO & Analitik', endpoint: 'https://searchconsole.googleapis.com/v1', authType: 'oauth2', iconHue: 'sky', role: 'SEO Verisi' },
  ahrefs: { provider: 'Ahrefs', category: 'SEO & Analitik', endpoint: 'https://api.ahrefs.com/v3', authType: 'api_key', iconHue: 'emerald', role: 'Backlink Analizi' },
  ga4: { provider: 'Google', category: 'SEO & Analitik', endpoint: 'https://analyticsdata.googleapis.com/v1beta', authType: 'oauth2', iconHue: 'amber', role: 'Web Analitik' },
  googleads: { provider: 'Google', category: 'Reklam Platformları', endpoint: 'https://googleads.googleapis.com/v17', authType: 'oauth2', iconHue: 'indigo', role: 'Arama Reklamı' },
  metaads: { provider: 'Meta', category: 'Reklam Platformları', endpoint: 'https://graph.facebook.com/v21.0', authType: 'oauth2', iconHue: 'sky', role: 'Facebook/Instagram Reklam' },
  instagram: { provider: 'Meta', category: 'Sosyal Medya', endpoint: 'https://graph.instagram.com/v21.0', authType: 'oauth2', iconHue: 'pink', role: 'Instagram İçerik' },
  metunic: { provider: 'Metunic', category: 'Hosting & Altyapı', endpoint: 'https://api.metunic.com.tr/v2', authType: 'api_key', iconHue: 'violet', role: 'Domain Tescil' },
  plesk: { provider: 'Plesk', category: 'Hosting & Altyapı', endpoint: 'https://plesk.example.com:8443/api/v2', authType: 'api_key', iconHue: 'indigo', role: 'Sunucu Yönetimi' },
  cloudflare: { provider: 'Cloudflare', category: 'Hosting & Altyapı', endpoint: 'https://api.cloudflare.com/client/v4', authType: 'api_key', iconHue: 'amber', role: 'CDN & DNS' },
  turkpatent: { provider: 'TürkPatent', category: 'Marka Tescili', endpoint: 'https://api.turkpatent.gov.tr/v1', authType: 'api_key', iconHue: 'amber', role: 'Marka Tescil TR' },
  planner: { provider: 'Microsoft', category: 'Operasyon & Ekip', endpoint: 'https://graph.microsoft.com/v1.0/planner', authType: 'oauth2', iconHue: 'indigo', role: 'Görev Yönetimi' },
  slack: { provider: 'Slack', category: 'Operasyon & Ekip', endpoint: 'https://slack.com/api', authType: 'oauth2', iconHue: 'violet', role: 'Ekip İletişim' },
  custom: { provider: '', category: 'Hosting & Altyapı', endpoint: '', authType: 'api_key', iconHue: 'gray', role: '' },
};

const TEMPLATE_ITEMS = [
  { k: 'parasut', label: 'Paraşüt', clr: 'emerald' as ColorName },
  { k: 'stripe', label: 'Stripe', clr: 'violet' as ColorName },
  { k: 'hubspot', label: 'HubSpot', clr: 'emerald' as ColorName },
  { k: 'gsc', label: 'Search Console', clr: 'sky' as ColorName },
  { k: 'ahrefs', label: 'Ahrefs', clr: 'emerald' as ColorName },
  { k: 'ga4', label: 'Analytics 4', clr: 'amber' as ColorName },
  { k: 'googleads', label: 'Google Ads', clr: 'indigo' as ColorName },
  { k: 'metaads', label: 'Meta Ads', clr: 'sky' as ColorName },
  { k: 'instagram', label: 'Instagram', clr: 'pink' as ColorName },
  { k: 'metunic', label: 'Metunic', clr: 'violet' as ColorName },
  { k: 'plesk', label: 'Plesk', clr: 'indigo' as ColorName },
  { k: 'cloudflare', label: 'Cloudflare', clr: 'amber' as ColorName },
  { k: 'turkpatent', label: 'TürkPatent', clr: 'amber' as ColorName },
  { k: 'planner', label: 'MS Planner', clr: 'indigo' as ColorName },
  { k: 'slack', label: 'Slack', clr: 'violet' as ColorName },
  { k: 'custom', label: 'Özel API', clr: 'gray' as ColorName },
];

function Icon({ children, className }: { children: ReactNode; className: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      {children}
    </svg>
  );
}

function LinkIcon() {
  return <><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></>;
}

export default function Entegrasyonlar() {
  const [integrations, setIntegrations] = useState<Integration[]>(INITIAL_INTEGRATIONS);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | IntegrationStatus>('all');
  const [modal, setModal] = useState<ModalState>(null);
  const [toast, setToast] = useState<ToastState>(null);

  const categories = Array.from(new Set(integrations.map((item) => item.category)));
  const filtered = integrations.filter((item) => (categoryFilter === 'all' || item.category === categoryFilter) && (statusFilter === 'all' || item.status === statusFilter));
  const connected = integrations.filter((item) => item.status === 'connected').length;
  const warnings = integrations.filter((item) => item.status === 'warning').length;
  const errors = integrations.filter((item) => item.status === 'error').length;
  const pending = integrations.filter((item) => item.status === 'pending' || item.status === 'standby').length;
  const totalCalls = integrations.reduce((total, item) => total + parseCalls(item.callsMonth), 0);

  const testIntegration = (item: Integration) => {
    if (item.status === 'error') {
      setToast({ title: `Test · ${item.name}`, message: `Bağlantı başarısız: ${item.errorNote || 'auth hatası'}`, color: 'rose' });
      return;
    }
    setToast({ title: `Test · ${item.name}`, message: `${item.endpoint} · ping başarılı · ${Math.floor(Math.random() * 400 + 50)}ms`, color: 'emerald' });
  };

  const saveNewIntegration = (data: FormData) => {
    const name = String(data.get('intName') || '').trim();
    const provider = String(data.get('intProvider') || '').trim();
    const category = String(data.get('intCategory') || 'Hosting & Altyapı');
    const role = String(data.get('intRole') || '').trim() || 'Servis';
    const description = String(data.get('intDesc') || '').trim();
    const endpoint = String(data.get('intEndpoint') || '').trim();
    const authType = String(data.get('intAuth') || 'api_key') as AuthType;
    const credentials = String(data.get('intCredentials') || '').trim();
    const status = String(data.get('intStatus') || 'standby') as IntegrationStatus;

    if (!name) return setToast({ title: 'Eksik Bilgi', message: 'Servis adı zorunludur', color: 'rose' });
    if (!provider) return setToast({ title: 'Eksik Bilgi', message: 'Sağlayıcı zorunludur', color: 'rose' });
    if (!description) return setToast({ title: 'Eksik Bilgi', message: 'Açıklama zorunludur', color: 'rose' });
    if (!endpoint) return setToast({ title: 'Eksik Bilgi', message: 'Endpoint zorunludur', color: 'rose' });
    if (!credentials && status !== 'standby') return setToast({ title: 'Eksik Bilgi', message: 'Credentials zorunludur (veya Standby seçin)', color: 'rose' });

    const next: Integration = {
      id: name.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 24),
      name,
      provider,
      category,
      categoryClr: CATEGORY_COLOR[category] || 'gray',
      role,
      description,
      endpoint,
      authType,
      status,
      lastSync: status === 'connected' ? 'şimdi' : '—',
      callsMonth: '0',
      boundJsons: [],
      boundAgents: [],
      iconHue: 'gray',
    };

    setIntegrations((current) => [...current, next]);
    setModal(null);
    setToast({ title: 'Entegrasyon Eklendi', message: `${name} (${provider}) havuza eklendi · ${status === 'connected' ? 'Bağlı' : 'Standby'} · Test Et ile doğrulayın`, color: 'emerald' });
  };

  return (
    <Layout activeId="integrations" breadcrumb="ADOS Mimar · Entegrasyonlar">
      <div className="relative min-h-[calc(100vh-120px)]">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-amber-100 dark:bg-amber-500/20 rounded-lg flex items-center justify-center">
              <Icon className="text-amber-600 dark:text-amber-400 w-4 h-4"><LinkIcon /></Icon>
            </div>
            <div>
              <h1 className="text-[19px] font-bold text-gray-900 dark:text-gray-100 leading-tight">Entegrasyonlar</h1>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">{integrations.length} dış servis · {categories.length} kategori · AI dışı tüm veri/işlem API'leri</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={() => setModal({ kind: 'new' })} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 dark:bg-gray-100 dark:text-gray-900 text-white text-[11px] font-semibold rounded-md hover:opacity-90">
              <Icon className="w-3.5 h-3.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></Icon>
              Yeni Entegrasyon Ekle
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3 mt-4">
          <KpiCard label="Toplam" value={String(integrations.length)} sub={`${categories.length} kategori`} color="amber" />
          <KpiCard label="Bağlı" value={String(connected)} sub="Aktif çalışıyor" color="emerald" />
          <KpiCard label="Uyarı" value={String(warnings)} sub="Token/kota uyarısı" color="amber" />
          <KpiCard label="Hata" value={String(errors)} sub="Yeniden yetkilendirme" color="rose" />
          <KpiCard label="Bekleyen" value={String(pending)} sub="Kurulum veya standby" color="gray" />
          <KpiCard label="Aylık Çağrı" value={`${Math.round(totalCalls / 1000)}K`} sub="Tüm entegrasyonlar" color="violet" />
        </div>

        <div className="bg-gradient-to-br from-amber-50 via-white to-emerald-50/50 dark:from-amber-500/5 dark:via-transparent dark:to-emerald-500/5 border border-amber-200 dark:border-amber-500/20 rounded-xl p-3 flex items-start gap-2.5 mt-4">
          <Icon className="text-amber-600 dark:text-amber-400 w-4 h-4 shrink-0 mt-0.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></Icon>
          <div className="flex-1">
            <p className="text-[11px] text-gray-700 dark:text-gray-300"><span className="font-bold text-amber-700 dark:text-amber-300">Dijital ajans API havuzu:</span> AI API'leri <span className="font-semibold">AI Yönetimi</span>'nde yönetilir. Burası hosting (Metunic/Plesk), finans (Paraşüt/Stripe), CRM (HubSpot), SEO (Google Search Console/Ahrefs/SemRush), reklam (Google/Meta/LinkedIn Ads), sosyal medya, marka tescili (TürkPatent/WIPO), operasyon (Microsoft Planner/Slack) servislerini barındırır. Her entegrasyon bir veya daha fazla JSON ajanı tarafından kullanılır.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap mt-4">
          <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-500 mr-1">Kategori:</span>
          <FilterButton active={categoryFilter === 'all'} onClick={() => setCategoryFilter('all')} activeClassName="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 border-gray-900 dark:border-gray-100">
            Tümü ({integrations.length})
          </FilterButton>
          {categories.map((category) => {
            const color = integrations.find((item) => item.category === category)?.categoryClr || 'gray';
            const cm = CM[color];
            return (
              <FilterButton key={category} active={categoryFilter === category} onClick={() => setCategoryFilter(category)} activeClassName={`bg-${color}-600 text-white border-${color}-600`} inactiveClassName={`${cm.bg} ${cm.t} border-${color}-200 dark:border-${color}-500/30`}>
                {category} ({integrations.filter((item) => item.category === category).length})
              </FilterButton>
            );
          })}
        </div>

        <div className="flex items-center gap-2 flex-wrap mt-2">
          <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-500 mr-1">Durum:</span>
          <FilterButton active={statusFilter === 'all'} onClick={() => setStatusFilter('all')} activeClassName="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 border-gray-900 dark:border-gray-100">
            Tümü ({integrations.length})
          </FilterButton>
          {[
            { k: 'connected' as const, label: 'Bağlı', count: connected },
            { k: 'warning' as const, label: 'Uyarı', count: warnings },
            { k: 'error' as const, label: 'Hata', count: errors },
            { k: 'pending' as const, label: 'Bekliyor', count: integrations.filter((item) => item.status === 'pending').length },
            { k: 'standby' as const, label: 'Standby', count: integrations.filter((item) => item.status === 'standby').length },
          ].map((status) => {
            const conf = STATUS[status.k];
            const cm = CM[conf.clr];
            return (
              <FilterButton key={status.k} active={statusFilter === status.k} onClick={() => setStatusFilter(status.k)} activeClassName={`bg-${conf.clr}-600 text-white border-${conf.clr}-600`} inactiveClassName={`${cm.bg} ${cm.t} border-${conf.clr}-200 dark:border-${conf.clr}-500/30`}>
                {status.label} ({status.count})
              </FilterButton>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 mt-4">
          {filtered.length === 0 ? (
            <div className="col-span-full p-10 text-center bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl text-gray-400 dark:text-gray-500 text-[12px]">Filtreye uyan entegrasyon bulunamadı</div>
          ) : filtered.map((item) => (
            <IntegrationCard key={item.id} item={item} onOpen={() => setModal({ kind: 'edit', item })} onTest={() => testIntegration(item)} />
          ))}
        </div>

        {modal?.kind === 'edit' ? <IntegrationEditor item={modal.item} integrations={integrations} onClose={() => setModal(null)} onTest={testIntegration} onToast={setToast} /> : null}
        {modal?.kind === 'new' ? <NewIntegrationWizard onClose={() => setModal(null)} onSubmit={saveNewIntegration} /> : null}
        {toast ? <Toast toast={toast} onClose={() => setToast(null)} /> : null}
      </div>
    </Layout>
  );
}

function KpiCard({ label, value, sub, color }: { label: string; value: string; sub: string; color: ColorName }) {
  const cm = CM[color] || CM.gray;
  return (
    <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-3.5">
      <p className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-[22px] font-bold ${cm.t} font-mono leading-none mb-0.5`}>{value}</p>
      <p className="text-[9px] text-gray-400 dark:text-gray-500">{sub}</p>
    </div>
  );
}

function FilterButton({ active, onClick, children, activeClassName, inactiveClassName = 'bg-white dark:bg-[#1e1f26] text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700' }: { active: boolean; onClick: () => void; children: ReactNode; activeClassName: string; inactiveClassName?: string }) {
  return <button onClick={onClick} className={`px-2.5 py-1 text-[10px] font-semibold rounded-full border ${active ? activeClassName : inactiveClassName}`}>{children}</button>;
}

function IntegrationCard({ item, onOpen, onTest }: { item: Integration; onOpen: () => void; onTest: () => void }) {
  const cm = CM[item.iconHue] || CM.gray;
  const catCm = CM[item.categoryClr] || CM.gray;
  const sConf = STATUS[item.status];
  const sClr = sConf.clr;

  return (
    <div className={`bg-white dark:bg-[#1e1f26] border ${item.highlight ? 'border-amber-300 dark:border-amber-500/40' : 'border-gray-200 dark:border-gray-600/50'} rounded-xl overflow-hidden hover:shadow-sm hover:-translate-y-0.5 transition-all`}>
      <button onClick={onOpen} className="w-full p-3.5 border-b border-gray-100 dark:border-gray-700/40 text-left">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className={`w-9 h-9 ${cm.bg} rounded-lg flex items-center justify-center shrink-0`}>
              <Icon className={`${cm.t} w-4 h-4`}><LinkIcon /></Icon>
            </div>
            <div className="min-w-0">
              <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100 truncate">{item.name}</p>
              <p className="text-[9px] text-gray-500 dark:text-gray-500">{item.provider} · {item.role}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <span className={`text-[9px] font-semibold px-1.5 py-0.5 ${catCm.bg} ${catCm.t} rounded`}>{item.category}</span>
            <span className={`text-[9px] font-semibold px-1.5 py-0.5 bg-${sClr}-100 dark:bg-${sClr}-900/30 text-${sClr}-700 dark:text-${sClr}-300 rounded flex items-center gap-1`}>{sConf.dot ? <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></span> : null}{sConf.lbl}</span>
          </div>
        </div>
        <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-snug line-clamp-2">{item.description}</p>
        {item.highlight ? <div className="mt-1.5"><span className="text-[9px] font-bold px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded">★ ADOS AI SEO · ANA KAYNAK</span></div> : null}
        {item.warningNote ? <Notice color="amber" icon="warning">{item.warningNote}</Notice> : null}
        {item.errorNote ? <Notice color="rose" icon="error">{item.errorNote}</Notice> : null}
        {item.pendingNote ? <Notice color="amber" icon="clock">{item.pendingNote}</Notice> : null}
      </button>
      <div className="p-3.5 space-y-2.5">
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[10px]">
          <div className="col-span-2"><span className="text-gray-500 dark:text-gray-400">Endpoint:</span> <span className="font-mono text-[9px] text-gray-700 dark:text-gray-300 truncate block">{item.endpoint}</span></div>
          <div><span className="text-gray-500 dark:text-gray-400">Auth:</span> <span className="font-semibold text-gray-900 dark:text-gray-100 font-mono uppercase text-[9px]">{item.authType.replace('_', ' ')}</span></div>
          <div><span className="text-gray-500 dark:text-gray-400">Sync:</span> <span className="font-semibold text-gray-900 dark:text-gray-100">{item.lastSync}</span></div>
          <div><span className="text-gray-500 dark:text-gray-400">Aylık:</span> <span className="font-semibold text-gray-900 dark:text-gray-100 font-mono">{item.callsMonth}</span></div>
          <div><span className="text-gray-500 dark:text-gray-400">JSON:</span> <span className="font-semibold text-violet-700 dark:text-violet-300">{item.boundJsons.length}</span></div>
        </div>
        <div className="flex items-center gap-1.5 pt-2 border-t border-gray-100 dark:border-gray-700/40 text-[9px] text-gray-500 dark:text-gray-500">
          <Icon className="text-indigo-500 dark:text-indigo-400 w-3 h-3"><circle cx="12" cy="12" r="3" /></Icon>
          <span>Kullanıcı: <span className="font-mono font-semibold text-indigo-700 dark:text-indigo-300">{item.boundAgents.join(', ') || '—'}</span></span>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={onTest} className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-[10px] font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md transition-colors">
            <Icon className="w-3 h-3"><polygon points="5 3 19 12 5 21 5 3" /></Icon>
            Test Et
          </button>
          <button onClick={onOpen} className="flex-[1.5] flex items-center justify-center gap-1 px-2 py-1.5 text-[10px] font-bold bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-400 text-white rounded-md transition-colors">
            <Icon className="w-3 h-3"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></Icon>
            Entegrasyonu Düzenle
          </button>
        </div>
      </div>
    </div>
  );
}

function Notice({ color, icon, children }: { color: 'amber' | 'rose'; icon: 'warning' | 'error' | 'clock'; children: ReactNode }) {
  return (
    <div className={`mt-1.5 flex items-start gap-1 p-1.5 bg-${color}-50 dark:bg-${color}-500/10 rounded text-[9px] text-${color}-700 dark:text-${color}-300`}>
      <Icon className="w-3 h-3 shrink-0 mt-0.5">
        {icon === 'error' ? <><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></> : icon === 'clock' ? <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></> : <><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></>}
      </Icon>
      <span>{children}</span>
    </div>
  );
}

function IntegrationEditor({ item, integrations, onClose, onTest, onToast }: { item: Integration; integrations: Integration[]; onClose: () => void; onTest: (item: Integration) => void; onToast: (toast: ToastState) => void }) {
  const cm = CM[item.iconHue] || CM.gray;
  const catCm = CM[item.categoryClr] || CM.gray;
  const sConf = STATUS[item.status];
  const steps = [
    { key: 'basic', title: 'Temel Ayarlar', desc: `${item.provider} · ${item.category}`, icon: <circle cx="12" cy="12" r="10" /> },
    { key: 'auth', title: 'Kimlik Doğrulama', desc: `${item.authType.replace('_', ' ').toUpperCase()} · ${item.endpoint.substring(0, 40)}...`, icon: <><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></> },
    { key: 'limits', title: 'Limitler & Quota', desc: `Aylık ${item.callsMonth} çağrı · rate limit kontrolü`, icon: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></> },
    { key: 'sync', title: 'Senkronizasyon', desc: `Son sync: ${item.lastSync} · webhook yapılandırması`, icon: <><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></> },
    { key: 'monitor', title: 'İzleme & Kullanım', desc: `${item.boundJsons.length} JSON · ${item.boundAgents.length} agent kullanıyor`, icon: <path d="M22 12h-4l-3 9L9 3l-3 9H2" /> },
  ];

  return (
    <ModalShell onClose={onClose}>
      <div className="modal-scroll bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-xl w-full max-w-[820px] max-h-[92vh] overflow-y-auto pointer-events-auto">
        <div className="sticky top-0 z-10 bg-white dark:bg-[#1e1f26] border-b border-gray-100 dark:border-gray-700/60 p-5 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-11 h-11 ${cm.bg} rounded-xl flex items-center justify-center shrink-0`}>
              <Icon className={`${cm.t} w-5 h-5`}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /></Icon>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-[15px] font-bold text-gray-900 dark:text-gray-100 truncate">{item.name}</h2>
                <span className="text-[10px] font-mono text-gray-500 dark:text-gray-500">{item.provider}</span>
                <span className={`text-[9px] font-semibold px-1.5 py-0.5 ${catCm.bg} ${catCm.t} rounded`}>{item.category}</span>
                <span className={`text-[9px] font-semibold px-1.5 py-0.5 bg-${sConf.clr}-100 dark:bg-${sConf.clr}-900/30 text-${sConf.clr}-700 dark:text-${sConf.clr}-300 rounded`}>{sConf.lbl}</span>
              </div>
              <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-0.5">{item.description}</p>
              <p className="text-[9px] text-gray-400 dark:text-gray-500 mt-0.5 font-mono">{item.endpoint}</p>
            </div>
          </div>
          <CloseButton onClose={onClose} />
        </div>

        <div className="p-5 space-y-2.5">
          {steps.map((step, index) => (
            <details key={step.key} open={index === 0} className="bg-gray-50 dark:bg-[#17181f] border border-gray-200 dark:border-gray-700/40 rounded-lg overflow-hidden group">
              <summary className="px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-white/40 dark:hover:bg-white/5 list-none">
                <div className="w-7 h-7 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center shrink-0"><Icon className="text-amber-600 dark:text-amber-400 w-3.5 h-3.5">{step.icon}</Icon></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2"><span className="text-[10px] font-mono font-bold text-gray-500 dark:text-gray-500">ADIM {index + 1}</span><p className="text-[12px] font-bold text-gray-900 dark:text-gray-100">{step.title}</p></div>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 truncate">{step.desc}</p>
                </div>
                <Icon className="text-gray-400 dark:text-gray-500 w-4 h-4 shrink-0 transition-transform group-open:rotate-180"><polyline points="6 9 12 15 18 9" /></Icon>
              </summary>
              <div className="p-4 pt-0 border-t border-gray-200/70 dark:border-gray-700/40">
                <IntegrationStepContent stepKey={step.key} item={item} integrations={integrations} onToast={onToast} />
              </div>
            </details>
          ))}
        </div>

        <div className="sticky bottom-0 bg-white dark:bg-[#1e1f26] border-t border-gray-100 dark:border-gray-700/60 p-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-[10px] text-gray-500 dark:text-gray-400">
            <Icon className="w-3 h-3"><circle cx="12" cy="12" r="10" /></Icon>
            <span>Son sync: <span className="font-semibold">{item.lastSync}</span> · {item.callsMonth} çağrı/ay</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <button onClick={onClose} className="px-3 py-2 text-[11px] font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">İptal</button>
            <button onClick={() => onTest(item)} className="flex items-center gap-1 px-3 py-2 text-[11px] font-semibold bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-[#23242c]">
              <Icon className="w-3 h-3"><polygon points="5 3 19 12 5 21 5 3" /></Icon>Test Et
            </button>
            {item.status === 'error' ? <button onClick={() => onToast({ title: 'Yeniden Yetkilendirme', message: `${item.name} · OAuth flow başlatılıyor`, color: 'amber' })} className="flex items-center gap-1 px-3 py-2 text-[11px] font-semibold bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-300 rounded-md hover:bg-rose-100 dark:hover:bg-rose-500/20"><Icon className="w-3 h-3"><polyline points="23 4 23 10 17 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" /></Icon>Yeniden Yetkilendir</button> : null}
            <button onClick={() => { onToast({ title: 'Kaydedildi', message: `${item.name} ayarları güncellendi · audit log'a yazıldı`, color: 'emerald' }); onClose(); }} className="flex items-center gap-1.5 px-4 py-2 text-[11px] font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-md">
              <Icon className="w-3 h-3"><polyline points="20 6 9 17 4 12" /></Icon>Kaydet & Uygula
            </button>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}

function IntegrationStepContent({ stepKey, item, integrations, onToast }: { stepKey: string; item: Integration; integrations: Integration[]; onToast: (toast: ToastState) => void }) {
  const categories = Array.from(new Set(integrations.map((integration) => integration.category)));
  if (stepKey === 'basic') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3">
        <Field label="Servis Adı"><input defaultValue={item.name} className={inputClass()} /></Field>
        <Field label="Sağlayıcı"><input defaultValue={item.provider} className={inputClass()} /></Field>
        <Field label="Kategori"><select defaultValue={item.category} className={inputClass()}>{categories.map((category) => <option key={category}>{category}</option>)}</select></Field>
        <Field label="Rol"><input defaultValue={item.role} className={inputClass()} /></Field>
        <div className="md:col-span-2"><Field label="Açıklama"><textarea rows={2} defaultValue={item.description} className={`${inputClass()} resize-none`} /></Field></div>
        <Field label="Durum"><select defaultValue={item.status} className={inputClass()}><option value="connected">Bağlı</option><option value="warning">Uyarı</option><option value="error">Hata</option><option value="pending">Bekliyor</option><option value="standby">Standby</option></select></Field>
        <Field label="Renk"><select defaultValue={item.iconHue} className={inputClass()}>{Object.keys(CM).map((color) => <option key={color}>{color}</option>)}</select></Field>
      </div>
    );
  }
  if (stepKey === 'auth') {
    return (
      <div className="pt-3 space-y-3">
        <Field label="Kimlik Doğrulama Tipi">
          <div className="grid grid-cols-4 gap-2">
            {[{ k: 'oauth2', label: 'OAuth 2.0', sub: 'Yetkilendirme akışı' }, { k: 'api_key', label: 'API Key', sub: 'Statik anahtar' }, { k: 'basic', label: 'Basic Auth', sub: 'Kullanıcı/şifre' }, { k: 'bearer', label: 'Bearer Token', sub: 'Token header' }].map((auth) => (
              <label key={auth.k} className="cursor-pointer">
                <input type="radio" name="authType" value={auth.k} className="sr-only peer" defaultChecked={item.authType === auth.k} />
                <div className="p-2 bg-white dark:bg-[#1e1f26] border-2 border-gray-200 dark:border-gray-700 peer-checked:border-amber-500 peer-checked:bg-amber-50 dark:peer-checked:bg-amber-500/10 rounded-lg text-center">
                  <p className="text-[10px] font-bold text-gray-900 dark:text-gray-100">{auth.label}</p>
                  <p className="text-[9px] text-gray-500 dark:text-gray-500">{auth.sub}</p>
                </div>
              </label>
            ))}
          </div>
        </Field>
        <Field label="API Endpoint"><input defaultValue={item.endpoint} className={`${inputClass()} font-mono`} /></Field>
        <div>
          <label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">{item.authType === 'oauth2' ? 'OAuth Token' : item.authType === 'api_key' ? 'API Key' : 'Credentials'}</label>
          <div className="flex items-center gap-2">
            <input type="password" defaultValue={item.authType === 'oauth2' ? 'ya29.a0AfH6SMB...' : item.authType === 'api_key' ? 'key_••••••••••••••••' : 'user:•••••'} className={`flex-1 ${inputClass()} font-mono`} />
            <button type="button" onClick={() => onToast({ title: 'Göster', message: 'Credentials güvenlik nedeniyle maskeli kalır', color: 'amber' })} className="px-3 py-2 text-[10px] font-semibold bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-[#23242c]">Göster</button>
            {item.authType === 'oauth2' ? <button type="button" onClick={() => onToast({ title: 'Yenile', message: `${item.name} OAuth token yenileme akışı başlatıldı`, color: 'amber' })} className="px-3 py-2 text-[10px] font-semibold bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-[#23242c]">Yenile</button> : null}
          </div>
          <p className="text-[9px] text-amber-700 dark:text-amber-400 mt-1">Credentials şifrelenmiş saklanır · Vault entegrasyonu · son 4 karakter loglarda</p>
        </div>
        {item.authType === 'oauth2' ? <div className="grid grid-cols-2 gap-3"><Field label="Client ID"><input defaultValue="ados-prod-app" className={`${inputClass()} font-mono`} /></Field><Field label="Scope"><input defaultValue="read write" className={`${inputClass()} font-mono`} /></Field></div> : null}
      </div>
    );
  }
  if (stepKey === 'limits') {
    return (
      <div className="pt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Dakikalık Çağrı Limiti"><input type="number" defaultValue="60" className={`${inputClass()} font-mono`} /></Field>
        <Field label="Saatlik Limit"><input type="number" defaultValue="1200" className={`${inputClass()} font-mono`} /></Field>
        <Field label="Günlük Limit"><input type="number" defaultValue="20000" className={`${inputClass()} font-mono`} /></Field>
        <Field label="Aylık Quota"><input defaultValue="500.000" className={`${inputClass()} font-mono`} /></Field>
        <div className="md:col-span-2">
          <Field label="Retry & Backoff Stratejisi">
            <div className="flex items-center gap-2 p-2 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-md">
              <span className="text-[10px] font-mono font-semibold px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">retry: 3</span>
              <span className="text-[10px] font-mono font-semibold px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">backoff: exponential</span>
              <span className="text-[10px] font-mono font-semibold px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">max_delay: 30s</span>
            </div>
          </Field>
        </div>
      </div>
    );
  }
  if (stepKey === 'sync') {
    return (
      <div className="pt-3 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Sync Sıklığı"><select defaultValue="Saatlik" className={inputClass()}><option>Gerçek zamanlı (webhook)</option><option>Her 5 dakika</option><option>Her 15 dakika</option><option>Saatlik</option><option>Günlük</option><option>Manuel</option></select></Field>
          <Field label="Sync Yönü"><select defaultValue="İki yönlü (read/write)" className={inputClass()}><option>İki yönlü (read/write)</option><option>Sadece okuma (pull)</option><option>Sadece yazma (push)</option></select></Field>
        </div>
        <Field label="Webhook URL"><input defaultValue={`https://webhook.armadigital.com/int/${item.id}`} className={`${inputClass()} font-mono`} /><p className="text-[9px] text-gray-500 dark:text-gray-500 mt-1">Provider'ın ADOS sistemine veri gönderdiği adres</p></Field>
        <Field label="Webhook Event'leri">
          <div className="flex flex-wrap gap-1.5 p-2 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-md">
            <span className="text-[10px] font-mono font-semibold px-2 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 rounded">resource.created</span>
            <span className="text-[10px] font-mono font-semibold px-2 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 rounded">resource.updated</span>
            <span className="text-[10px] font-mono font-semibold px-2 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 rounded">resource.deleted</span>
            <button type="button" onClick={() => onToast({ title: 'Event', message: 'Yeni webhook event kuralı eklenecek', color: 'emerald' })} className="text-[10px] font-semibold px-2 py-1 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 border border-dashed border-emerald-300 dark:border-emerald-500/40 rounded">+ Event</button>
          </div>
        </Field>
      </div>
    );
  }
  return <MonitorGrid item={item} onToast={onToast} />;
}

function MonitorGrid({ item, onToast }: { item: Integration; onToast: (toast: ToastState) => void }) {
  return (
    <div className="pt-3 space-y-3">
      <div className="grid grid-cols-3 gap-3">
        <Metric label="Aylık Çağrı" value={item.callsMonth} color="amber" />
        <Metric label="Son Sync" value={item.lastSync} color="sky" />
        <Metric label="Bağlı JSON" value={String(item.boundJsons.length)} color="violet" />
      </div>
      <Field label="Bu Entegrasyonu Kullanan JSON'lar"><TagList items={item.boundJsons} color="violet" empty="Henüz bağlı JSON yok" /></Field>
      <Field label="Bu Entegrasyonu Kullanan Agent'lar"><TagList items={item.boundAgents} color="indigo" empty="Henüz bağlı agent yok" /></Field>
      <Field label="Uyarı Kuralları">
        <div className="flex flex-wrap gap-1.5 p-2 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-md">
          <span className="text-[10px] font-semibold px-2 py-1 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 rounded">sync gecikmesi &gt; 1sa</span>
          <span className="text-[10px] font-semibold px-2 py-1 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 rounded">quota &gt; %80</span>
          <span className="text-[10px] font-semibold px-2 py-1 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 rounded">token expire &lt; 7g</span>
          <button type="button" onClick={() => onToast({ title: 'Kural', message: 'Yeni uyarı kuralı eklenecek', color: 'amber' })} className="text-[10px] font-semibold px-2 py-1 border border-dashed border-amber-300 dark:border-amber-500/40 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-500/10 rounded">+ Kural</button>
        </div>
      </Field>
    </div>
  );
}

function NewIntegrationWizard({ onClose, onSubmit }: { onClose: () => void; onSubmit: (data: FormData) => void }) {
  const [templateKey, setTemplateKey] = useState('parasut');
  const template = TEMPLATES[templateKey];

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(new FormData(event.currentTarget));
  };

  return (
    <ModalShell onClose={onClose}>
      <form onSubmit={submit} className="modal-scroll bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-xl w-full max-w-[780px] max-h-[92vh] overflow-y-auto pointer-events-auto">
        <div className="sticky top-0 z-10 bg-white dark:bg-[#1e1f26] border-b border-gray-100 dark:border-gray-700/60 p-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-500/20 rounded-lg flex items-center justify-center">
              <Icon className="text-amber-600 dark:text-amber-400 w-4 h-4"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></Icon>
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-gray-900 dark:text-gray-100">Yeni Entegrasyon Ekle</h2>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">Hazır şablondan seç veya özel servis tanımla · ADOS Integration Hub'a eklenecek</p>
            </div>
          </div>
          <CloseButton onClose={onClose} />
        </div>

        <div className="p-5 space-y-5">
          <WizardSection step="1" title="Hazır Şablon Seç">
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-2">Yaygın sağlayıcılar için endpoint + auth tipi otomatik doldurulur</p>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
              {TEMPLATE_ITEMS.map((item) => {
                const cm = CM[item.clr] || CM.gray;
                return (
                  <label key={item.k} className="cursor-pointer">
                    <input type="radio" name="intTemplate" value={item.k} className="sr-only peer" checked={templateKey === item.k} onChange={() => setTemplateKey(item.k)} />
                    <div className="p-2.5 bg-white dark:bg-[#17181f] border-2 border-gray-200 dark:border-gray-700 peer-checked:border-amber-500 peer-checked:bg-amber-50 dark:peer-checked:bg-amber-500/10 rounded-lg text-center transition-all">
                      <div className={`w-7 h-7 ${cm.bg} rounded-lg flex items-center justify-center mx-auto mb-1.5`}><Icon className={`${cm.t} w-3.5 h-3.5`}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /></Icon></div>
                      <p className="text-[10px] font-bold text-gray-900 dark:text-gray-100 truncate">{item.label}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </WizardSection>

          <WizardSection step="2" title="Servis Kimliği" bordered>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Servis Adı *"><input name="intName" type="text" placeholder="Paraşüt" defaultValue={template.provider} key={`name-${templateKey}`} className={wizardInput()} /></Field>
              <Field label="Sağlayıcı *"><input name="intProvider" type="text" placeholder="Paraşüt" defaultValue={template.provider} key={`provider-${templateKey}`} className={wizardInput()} /></Field>
              <Field label="Kategori *"><select name="intCategory" defaultValue={template.category} key={`category-${templateKey}`} className={wizardInput()}>{Object.keys(CATEGORY_COLOR).map((category) => <option key={category}>{category}</option>)}</select></Field>
              <Field label="Rol"><input name="intRole" type="text" placeholder="ör. E-Fatura · Tahsilat" defaultValue={template.role} key={`role-${templateKey}`} className={wizardInput()} /></Field>
              <div className="md:col-span-2"><Field label="Açıklama *"><textarea name="intDesc" rows={2} placeholder="Bu entegrasyon ne iş yapar?" className={`${wizardInput()} resize-none`} /></Field></div>
            </div>
          </WizardSection>

          <WizardSection step="3" title="Bağlantı & Kimlik Doğrulama" bordered>
            <div className="space-y-3">
              <Field label="API Endpoint *"><input name="intEndpoint" type="text" placeholder="https://api.provider.com/v1" defaultValue={template.endpoint} key={`endpoint-${templateKey}`} className={`${wizardInput()} font-mono`} /></Field>
              <Field label="Kimlik Doğrulama *"><select name="intAuth" defaultValue={template.authType} key={`auth-${templateKey}`} className={wizardInput()}><option value="oauth2">OAuth 2.0 (kullanıcı onaylı yetki)</option><option value="api_key">API Key (statik anahtar)</option><option value="basic">Basic Auth (kullanıcı/şifre)</option><option value="bearer">Bearer Token</option></select></Field>
              <Field label="Credentials (API Key / Token)"><input name="intCredentials" type="password" placeholder="Anahtarınızı girin..." className={`${wizardInput()} font-mono`} /><p className="text-[9px] text-amber-700 dark:text-amber-400 mt-1">Vault'a şifrelenmiş kaydedilir · son 4 karakter loglarda</p></Field>
            </div>
          </WizardSection>

          <WizardSection step="4" title="Senkronizasyon" subtitle="(opsiyonel)" bordered>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Sync Sıklığı"><select name="intSyncFreq" defaultValue="Saatlik" className={wizardInput()}><option>Gerçek zamanlı (webhook)</option><option>Her 15 dakika</option><option>Saatlik</option><option>Günlük</option><option>Manuel</option></select></Field>
              <Field label="Başlangıç Durumu"><select name="intStatus" defaultValue="standby" className={wizardInput()}><option value="standby">Standby (test sonrası aktif)</option><option value="connected">Bağlı (hemen aktif)</option><option value="pending">Bekliyor (yetkilendirme)</option></select></Field>
            </div>
          </WizardSection>
        </div>

        <div className="sticky bottom-0 bg-white dark:bg-[#1e1f26] border-t border-gray-100 dark:border-gray-700/60 p-4 flex items-center justify-end gap-2">
          <button type="button" onClick={onClose} className="px-3 py-2 text-[11px] font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">İptal</button>
          <button type="button" className="flex items-center gap-1 px-3 py-2 text-[11px] font-semibold bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-[#23242c]">
            <Icon className="w-3 h-3"><polygon points="5 3 19 12 5 21 5 3" /></Icon>Test Bağlantı
          </button>
          <button type="submit" className="flex items-center gap-1.5 px-4 py-2 text-[11px] font-bold bg-gray-900 dark:bg-gray-100 dark:text-gray-900 text-white rounded-md hover:opacity-90">
            <Icon className="w-3.5 h-3.5"><polyline points="20 6 9 17 4 12" /></Icon>
            Oluştur & Havuza Ekle
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

function ModalShell({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  return (
    <div className="absolute inset-0 z-40">
      <div className="modal-overlay absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="modal-panel absolute inset-0 flex items-start justify-center p-4 pointer-events-none overflow-y-auto">
        {children}
      </div>
    </div>
  );
}

function WizardSection({ step, title, subtitle, bordered, children }: { step: string; title: string; subtitle?: string; bordered?: boolean; children: ReactNode }) {
  return (
    <div className={bordered ? 'pt-4 border-t border-gray-100 dark:border-gray-700/40' : undefined}>
      <div className="flex items-center gap-2 mb-3">
        <span className="w-6 h-6 bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 rounded-full flex items-center justify-center text-[10px] font-bold">{step}</span>
        <h3 className="text-[12px] font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">{title} {subtitle ? <span className="text-gray-400 dark:text-gray-500 font-normal normal-case">{subtitle}</span> : null}</h3>
      </div>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">{label}</label>{children}</div>;
}

function Metric({ label, value, color }: { label: string; value: string; color: ColorName }) {
  return (
    <div className="p-3 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-md">
      <p className="text-[9px] font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-[18px] font-bold text-${color}-700 dark:text-${color}-300 font-mono`}>{value}</p>
    </div>
  );
}

function TagList({ items, color, empty }: { items: string[]; color: ColorName; empty: string }) {
  return (
    <div className="flex flex-wrap gap-1.5 p-2 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-md">
      {items.length ? items.map((item) => <span key={item} className={`text-[10px] font-mono font-semibold px-2 py-1 bg-${color}-50 dark:bg-${color}-500/10 text-${color}-700 dark:text-${color}-300 border border-${color}-200 dark:border-${color}-500/30 rounded`}>{item}</span>) : <span className="text-[10px] text-gray-400 italic">{empty}</span>}
    </div>
  );
}

function CloseButton({ onClose }: { onClose: () => void }) {
  return <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1 shrink-0"><Icon className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Icon></button>;
}

function Toast({ toast, onClose }: { toast: NonNullable<ToastState>; onClose: () => void }) {
  const color = toast.color === 'rose' ? { bg: '#e11d48', bd: '#fecdd3' } : toast.color === 'amber' ? { bg: '#d97706', bd: '#fde68a' } : toast.color === 'violet' ? { bg: '#7c3aed', bd: '#ddd6fe' } : { bg: '#059669', bd: '#a7f3d0' };
  return <div style={{ position: 'absolute', bottom: '24px', right: '24px', zIndex: 9999, minWidth: '280px', maxWidth: '400px', background: 'white', borderLeft: `4px solid ${color.bd}`, borderRadius: '10px', boxShadow: '0 8px 24px rgba(0,0,0,.15)', padding: '14px 16px', animation: 'toastSlide .3s ease-out' }}><div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}><div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: '13px', color: color.bg, marginBottom: '2px' }}>{toast.title}</div><div style={{ fontSize: '11px', color: '#6b7280' }}>{toast.message}</div></div><button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: '16px' }}>×</button></div><div style={{ position: 'absolute', bottom: 0, left: 0, height: '2px', background: color.bg, borderRadius: '0 0 10px 10px', animation: 'toastProgress 3s linear' }}></div></div>;
}

function inputClass() {
  return 'w-full px-3 py-2 text-[12px] bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:border-amber-500';
}

function wizardInput() {
  return 'w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:border-amber-500';
}

function parseCalls(value: string) {
  const number = parseFloat(value.replace(/[^\d.]/g, '')) || 0;
  return value.includes('K') ? number * 1000 : number;
}
