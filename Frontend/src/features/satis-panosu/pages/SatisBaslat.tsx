import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyzeWebsiteWithAI, type WebsiteAiAnalysis } from '../../../services/aiApi';
import { getCustomers, type CustomerResponse } from '../../../services/customerApi';
import { getSalesPanelRequestsByCustomer, type SalesPanelRequest } from '../../../services/salesPanelRequestApi';

type ColorName = 'emerald' | 'amber' | 'rose' | 'sky' | 'violet' | 'indigo' | 'teal' | 'gray';

type SalesOpp = {
  id: number;
  co: string;
  contact: string;
  email: string;
  phone: string;
  src: string;
  status: string;
  stClr: ColorName;
  rep: string;
  repAv: string;
  upd: string;
  pri: string;
  priClr: ColorName;
  next: string;
  nxtClr: ColorName;
  musNo: string | null;
};

type Customer = {
  id: string;
  company: string;
  contact: string;
  type: string;
  source: string;
  segment: string;
  status: string;
  interest: string;
  tag: string;
  email?: string;
  phone?: string;
  code?: string;
};

type OfferService = {
  id: string;
  name: string;
  type: 'standard' | 'premium';
  icon: ReactNode;
};

type OfferStep = 'list' | 'select' | 'service-details' | 'summary';

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

const SALES_OPPS: SalesOpp[] = [
  { id: 1, co: 'Akdeniz Turizm A.Ş.', contact: 'Ahmet Yılmaz', email: 'ahmet@akdenizturizm.com', phone: '+90 532 000 0001', src: 'Google Ads', status: 'Yeni Atama', stClr: 'sky', rep: 'Ahmet Yılmaz', repAv: 'AY', upd: '2 saat önce', pri: 'Yüksek', priClr: 'rose', next: 'İlk Görüşme', nxtClr: 'sky', musNo: 'MUS-2024-2201' },
  { id: 2, co: 'Deha Teknoloji A.Ş.', contact: 'Mehmet Yılmaz', email: 'mehmet@deha.com.tr', phone: '+90 532 123 4567', src: 'Web Sitesi', status: 'Teklif Hazırlanıyor', stClr: 'sky', rep: 'Ahmet Yılmaz', repAv: 'AY', upd: '2 saat önce', pri: 'Yüksek', priClr: 'rose', next: 'Teklif Güncelle', nxtClr: 'amber', musNo: 'MUS-2024-1847' },
  { id: 3, co: 'Sağlık Plus Merkezi', contact: 'Zeynep Aydın', email: 'zeynep@saglikplus.com', phone: '+90 533 222 3344', src: 'Referans', status: 'Müşteride', stClr: 'amber', rep: 'Ayşe Demir', repAv: 'AD', upd: '1 gün önce', pri: 'Yüksek', priClr: 'rose', next: 'Müşteriyi Ara', nxtClr: 'rose', musNo: 'MUS-2024-1902' },
  { id: 4, co: 'Dijital Ajans Medya', contact: 'Selin Yurt', email: 'selin@dijitalajans.com', phone: '+90 534 555 6677', src: 'Meta Reklam', status: 'Onaylandı', stClr: 'emerald', rep: 'Mehmet Kaya', repAv: 'MK', upd: '3 saat önce', pri: 'Yüksek', priClr: 'rose', next: 'Sözleşmeye Geç', nxtClr: 'emerald', musNo: 'MUS-2024-2105' },
  { id: 5, co: 'Akıllı Yazılım A.Ş.', contact: 'Cem Özkan', email: 'cem@akilliyazilim.com', phone: '+90 535 888 9900', src: 'Organik', status: 'Teklif Hazırlanıyor', stClr: 'sky', rep: 'Ahmet Yılmaz', repAv: 'AY', upd: '5 saat önce', pri: 'Orta', priClr: 'amber', next: 'Teklif Güncelle', nxtClr: 'amber', musNo: 'MUS-2024-1756' },
  { id: 6, co: 'Yıldız Gıda Ltd.', contact: 'Deniz Korkmaz', email: 'deniz@yildizgida.com', phone: '+90 536 777 8899', src: 'Google Ads', status: 'Müşteride', stClr: 'amber', rep: 'Zeynep Şahin', repAv: 'ZŞ', upd: '4 saat önce', pri: 'Yüksek', priClr: 'rose', next: 'Müşteriyi Ara', nxtClr: 'rose', musNo: null },
  { id: 7, co: 'Nova E-Ticaret Ltd.', contact: 'Ayşe Kaya', email: 'ayse@novaeticaret.com', phone: '+90 537 111 2233', src: 'Google Ads', status: 'Revize Bekliyor', stClr: 'amber', rep: 'Can Özkan', repAv: 'CÖ', upd: '2 gün önce', pri: 'Orta', priClr: 'amber', next: 'Talep Notunu Kontrol', nxtClr: 'sky', musNo: 'MUS-2024-2030' },
  { id: 8, co: 'Işık Eğitim Kurumları', contact: 'Can Demir', email: 'can@isikegitim.com', phone: '+90 538 333 4455', src: 'Telefon', status: 'İlk Görüşme', stClr: 'sky', rep: 'Mehmet Kaya', repAv: 'MK', upd: '1 gün önce', pri: 'Düşük', priClr: 'gray', next: 'Detay Gör', nxtClr: 'sky', musNo: null },
  { id: 9, co: 'Deniz Lojistik A.Ş.', contact: 'Elif Şahin', email: 'elif@denizlojistik.com', phone: '+90 539 444 5566', src: 'Web Sitesi', status: 'Teklif Hazırlanıyor', stClr: 'sky', rep: 'Ayşe Demir', repAv: 'AD', upd: '6 saat önce', pri: 'Orta', priClr: 'amber', next: 'Teklif Güncelle', nxtClr: 'amber', musNo: 'MUS-2024-1689' },
  { id: 10, co: 'Beyaz Tekstil San.', contact: 'Murat Arslan', email: 'murat@beyaztekstil.com', phone: '+90 530 666 7788', src: 'Referans', status: 'Müşteride', stClr: 'amber', rep: 'Can Özkan', repAv: 'CÖ', upd: '3 gün önce', pri: 'Yüksek', priClr: 'rose', next: 'Müşteriyi Ara', nxtClr: 'rose', musNo: 'MUS-2024-1523' },
  { id: 11, co: 'Hızlı Kargo Sist.', contact: 'Burak Çetin', email: 'burak@hizlikargo.com', phone: '+90 531 888 9900', src: 'Telefon', status: 'İlk Görüşme', stClr: 'sky', rep: 'Zeynep Şahin', repAv: 'ZŞ', upd: '1 gün önce', pri: 'Orta', priClr: 'amber', next: 'Detay Gör', nxtClr: 'sky', musNo: null },
  { id: 12, co: 'Çelik Yapı İnşaat', contact: 'Ahmet Öztürk', email: 'ahmet@celikinsaat.com', phone: '+90 532 444 5566', src: 'E-Bülten', status: 'Onaylandı', stClr: 'emerald', rep: 'Ahmet Yılmaz', repAv: 'AY', upd: '2 saat önce', pri: 'Yüksek', priClr: 'rose', next: 'Sözleşmeye Geç', nxtClr: 'emerald', musNo: null },
];

const TURKISH_ALPHABET = ['Tümü', 'A', 'B', 'C', 'Ç', 'D', 'E', 'F', 'G', 'Ğ', 'H', 'I', 'İ', 'J', 'K', 'L', 'M', 'N', 'O', 'Ö', 'P', 'R', 'S', 'Ş', 'T', 'U', 'Ü', 'V', 'Y', 'Z'];
const QUICK_SELECT_OPTIONS = [
  { id: 'all', label: 'Tümü', tag: '' },
  { id: 'recent', label: 'Son Kullanılan', tag: 'son-kullanılan' },
  { id: 'discussed', label: 'Son Görüşülen', tag: 'son-görüşülen' },
  { id: 'ready', label: 'Satışa Hazır', tag: 'satışa-hazır' },
  { id: 'quoted', label: 'Teklif Verilmiş', tag: 'teklif-verilmiş' },
];
const REQUIRED_FOR_PREMIUM = ['web', 'seo', 'google-ads', 'social-media', 'social-ads', 'production', 'hosting'];

function safeText(value: unknown) {
  return String(value ?? '').trim();
}

function readCustomerField(customer: CustomerResponse, camelKey: string, pascalKey: string) {
  const record = customer as Record<string, unknown>;
  return safeText(record[camelKey] ?? record[pascalKey]);
}

function mapCustomerResponse(customer: CustomerResponse): Customer {
  const brandName = readCustomerField(customer, 'brandName', 'BrandName');
  const officialTitle = readCustomerField(customer, 'officialTitle', 'OfficialTitle');
  const customerCode = readCustomerField(customer, 'customerCode', 'CustomerCode');
  const companyEmail = readCustomerField(customer, 'companyEmail', 'CompanyEmail');
  const companyPhone = readCustomerField(customer, 'companyPhone', 'CompanyPhone');
  const contactName = readCustomerField(customer, 'contact1FullName', 'Contact1FullName');
  const services = Array.isArray(customer.services) ? customer.services : [];

  return {
    id: readCustomerField(customer, 'id', 'Id'),
    company: brandName || officialTitle || customerCode || 'İsimsiz Müşteri',
    contact: contactName || companyEmail || companyPhone || '-',
    type: officialTitle ? 'Kurumsal' : 'Müşteri',
    source: readCustomerField(customer, 'source', 'Source') || 'Database',
    segment: readCustomerField(customer, 'segment', 'Segment') || '-',
    status: readCustomerField(customer, 'customerStatus', 'CustomerStatus') || 'Aktif',
    interest: safeText(services[0]) || 'Web Sitesi',
    tag: 'database',
    email: companyEmail,
    phone: companyPhone,
    code: customerCode,
  };
}

function getApiErrorMessage(error: unknown, fallback = 'Bilgiler yüklenemedi.') {
  const apiError = error as { message?: string; response?: { data?: { message?: string; title?: string } } };
  return apiError.response?.data?.message || apiError.response?.data?.title || apiError.message || fallback;
}

function logCustomerRequestError(error: unknown) {
  const apiError = error as { response?: { status?: number; data?: unknown } };
  console.error('Müşteri/talep bilgisi yükleme hatası:', error);
  console.error('Status:', apiError.response?.status);
  console.error('Data:', apiError.response?.data);
}

function logSalesRequestInfoError(error: unknown) {
  const apiError = error as { response?: { status?: number; data?: unknown } };
  console.error('Satış talep bilgisi yüklenemedi:', error);
  console.error('Status:', apiError.response?.status);
  console.error('Data:', apiError.response?.data);
}

function Icon({ children, className = 'w-3.5 h-3.5 shrink-0' }: { children: ReactNode; className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      {children}
    </svg>
  );
}

const SERVICE_ICONS: Record<string, ReactNode> = {
  web: <><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></>,
  seo: <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></>,
  'google-ads': <><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></>,
  'social-media': <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>,
  'social-ads': <><path d="M3 11l18-5v12L3 14v-3z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" /></>,
  production: <><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></>,
  domain: <><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /></>,
  hosting: <><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /></>,
  trademark: <><circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></>,
  premium360: <><path d="M2 18l7-14 7 14-7-3z" /><path d="M22 18l-7-14-7 14 7-3z" /><line x1="9" y1="15" x2="15" y2="15" /></>,
};

const OFFER_SERVICES: OfferService[] = [
  { id: 'web', name: 'Web Sitesi', icon: SERVICE_ICONS.web, type: 'standard' },
  { id: 'seo', name: 'SEO', icon: SERVICE_ICONS.seo, type: 'standard' },
  { id: 'google-ads', name: 'Google Ads', icon: SERVICE_ICONS['google-ads'], type: 'standard' },
  { id: 'social-media', name: 'Sosyal Medya Yönetimi', icon: SERVICE_ICONS['social-media'], type: 'standard' },
  { id: 'social-ads', name: 'Sosyal Medya Reklam Yönetimi', icon: SERVICE_ICONS['social-ads'], type: 'standard' },
  { id: 'production', name: 'Prodüksiyon & Fotoğraf', icon: SERVICE_ICONS.production, type: 'standard' },
  { id: 'domain', name: 'Domain', icon: SERVICE_ICONS.domain, type: 'standard' },
  { id: 'hosting', name: 'Hosting & Sunucu', icon: SERVICE_ICONS.hosting, type: 'standard' },
  { id: 'trademark', name: 'Marka Tescili', icon: SERVICE_ICONS.trademark, type: 'standard' },
  { id: 'premium360', name: 'ADOS Premium 360', icon: SERVICE_ICONS.premium360, type: 'premium' },
];

const SERVICE_PRICES: Record<string, { oneTime: number; monthly: number; timeline: string }> = {
  web: { oneTime: 45000, monthly: 0, timeline: '3-4 hafta' },
  seo: { oneTime: 12500, monthly: 22500, timeline: 'Aylik surec' },
  'google-ads': { oneTime: 10000, monthly: 18000, timeline: 'Aylik surec' },
  'social-media': { oneTime: 15000, monthly: 26000, timeline: 'Aylik surec' },
  'social-ads': { oneTime: 10000, monthly: 17500, timeline: 'Aylik surec' },
  production: { oneTime: 32000, monthly: 0, timeline: '1-2 hafta' },
  domain: { oneTime: 2500, monthly: 0, timeline: '1 gun' },
  hosting: { oneTime: 7500, monthly: 3500, timeline: 'Yillik/Aylik' },
  trademark: { oneTime: 18500, monthly: 0, timeline: '4-6 hafta' },
  premium360: { oneTime: 85000, monthly: 95000, timeline: '360 surec' },
};

function computeServicePrice(id: string) {
  return SERVICE_PRICES[id] || { oneTime: 0, monthly: 0, timeline: 'Planlanacak' };
}

function formatCurrency(value: number) {
  return `₺${value.toLocaleString('tr-TR')}`;
}

function Bdg({ txt, c }: { txt: string; c: ColorName }) {
  const m = CM[c] || CM.gray;
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${m.bg} ${m.t} whitespace-nowrap`}>{txt}</span>;
}

function PlusIcon({ className = 'w-3.5 h-3.5 shrink-0' }: { className?: string }) {
  return <Icon className={className}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></Icon>;
}

function SendIcon({ className = 'w-3.5 h-3.5 shrink-0' }: { className?: string }) {
  return <Icon className={className}><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></Icon>;
}

function FileIcon({ className = 'w-3.5 h-3.5 shrink-0' }: { className?: string }) {
  return <Icon className={className}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></Icon>;
}

function CheckIcon({ className = 'w-3.5 h-3.5 shrink-0' }: { className?: string }) {
  return <Icon className={className}><polyline points="20 6 9 17 4 12" /></Icon>;
}

function BackIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return <Icon className={className}><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></Icon>;
}

function SearchIcon({ className = 'text-gray-400 w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none' }: { className?: string }) {
  return <Icon className={className}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></Icon>;
}

function BuildingIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return <Icon className={className}><rect x="4" y="2" width="16" height="20" rx="2" /><path d="M9 22v-4h6v4" /></Icon>;
}

function serviceById(id: string) {
  return OFFER_SERVICES.find((service) => service.id === id) || OFFER_SERVICES[0];
}

function KpiCard({ value, label, icon, iconBg, iconBrd, iconClr }: { value: string; label: string; icon: ReactNode; iconBg: string; iconBrd: string; iconClr: string }) {
  return (
    <div className="relative bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-3.5 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
      <div className="flex items-center justify-between mb-2">
        <div className={`w-8 h-8 ${iconBg} rounded-lg flex items-center justify-center border ${iconBrd}`}>
          <Icon className={`${iconClr} w-4 h-4`}>{icon}</Icon>
        </div>
      </div>
      <div className="text-[22px] font-bold text-gray-900 dark:text-gray-50 leading-none mb-1">{value}</div>
      <div className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight">{label}</div>
    </div>
  );
}

function SalesList({
  onStart,
  onStartFor,
}: {
  onStart: () => void;
  onStartFor: (opp: SalesOpp) => void;
}) {
  const [search, setSearch] = useState('');
  const [source, setSource] = useState('Tümü');
  const [status, setStatus] = useState('Tümü');
  const [priority, setPriority] = useState('Tümü');
  const navigate = useNavigate();

  const filtered = useMemo(() => SALES_OPPS.filter((opp) => {
    const mSearch = !search || opp.co.toLocaleLowerCase('tr-TR').includes(search.toLocaleLowerCase('tr-TR'));
    const mSource = source === 'Tümü' || opp.src === source;
    const mStatus = status === 'Tümü' || opp.status === status;
    const mPri = priority === 'Tümü' || opp.pri === priority;
    return mSearch && mSource && mStatus && mPri;
  }), [priority, search, source, status]);

  return (
    <div className="relative min-h-[calc(100vh-120px)] space-y-4 md:space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-violet-100 dark:bg-violet-500/15 rounded-xl flex items-center justify-center shrink-0 border border-violet-200 dark:border-violet-500/25">
            <SendIcon className="text-violet-600 dark:text-violet-400 w-5 h-5" />
          </div>
          <div>
            <h1 className="text-[19px] font-bold text-gray-900 dark:text-gray-100 leading-tight">Satış Başlat</h1>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">Pazarlama onaylı fırsatlar · Teklif hazırlama ve satış süreci yönetimi</p>
          </div>
        </div>
        <button onClick={onStart} className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-[12px] font-semibold rounded-lg transition-colors shadow-sm">
          <PlusIcon className="w-3.5 h-3.5" /> Yeni Teklif
        </button>
      </div>

      <div className="relative overflow-hidden bg-gradient-to-br from-sky-50 to-blue-50/50 dark:from-sky-500/10 dark:to-blue-500/5 border border-sky-200 dark:border-sky-500/20 rounded-xl p-4">
        <div className="absolute -top-8 -right-8 w-28 h-28 bg-sky-400/10 rounded-full pointer-events-none" />
        <div className="relative flex items-start gap-3">
          <div className="w-9 h-9 bg-sky-100 dark:bg-sky-500/20 rounded-lg flex items-center justify-center shrink-0 border border-sky-200 dark:border-sky-500/30">
            <Icon className="text-sky-600 dark:text-sky-400 w-4 h-4"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></Icon>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[13px] font-bold text-sky-900 dark:text-sky-200 mb-0.5">Satış Yönlendirme Akışı</h3>
            <p className="text-[11px] text-sky-700 dark:text-sky-300/90 leading-relaxed">Satışa yönlendirilen kayıtlar, teklif hazırlığı ve müşteri dönüş süreci tamamlandığında sözleşme aşamasına ilerler.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <KpiCard value="18" label="Bana Atanan Fırsatlar" icon={<><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></>} iconBg="bg-indigo-100 dark:bg-indigo-500/20" iconBrd="border-indigo-200/60 dark:border-indigo-500/30" iconClr="text-indigo-600 dark:text-indigo-300" />
        <KpiCard value="6" label="Teklif Hazırlanıyor" icon={<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></>} iconBg="bg-violet-100 dark:bg-violet-500/20" iconBrd="border-violet-200/60 dark:border-violet-500/30" iconClr="text-violet-600 dark:text-violet-300" />
        <KpiCard value="5" label="Müşteride Bekleyen" icon={<><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>} iconBg="bg-amber-100 dark:bg-amber-500/20" iconBrd="border-amber-200/60 dark:border-amber-500/30" iconClr="text-amber-600 dark:text-amber-300" />
        <KpiCard value="4" label="Onaylanan Satış" icon={<><circle cx="12" cy="12" r="10" /><polyline points="9 12 11 14 15 10" /></>} iconBg="bg-emerald-100 dark:bg-emerald-500/20" iconBrd="border-emerald-200/60 dark:border-emerald-500/30" iconClr="text-emerald-600 dark:text-emerald-300" />
        <KpiCard value="9" label="Bekleyen Aksiyon" icon={<><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></>} iconBg="bg-rose-100 dark:bg-rose-500/20" iconBrd="border-rose-200/60 dark:border-rose-500/30" iconClr="text-rose-600 dark:text-rose-300" />
      </div>

      <button onClick={onStart} className="group w-full relative overflow-hidden bg-gradient-to-br from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 rounded-xl p-5 text-left transition-all shadow-sm hover:shadow-lg">
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full pointer-events-none" />
        <div className="absolute top-6 -right-4 w-24 h-24 bg-white/5 rounded-full pointer-events-none" />
        <div className="relative flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center shrink-0 border border-white/30">
            <PlusIcon className="text-white w-7 h-7" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="text-[16px] font-bold text-white">Yeni Satış / Teklif Oluştur</h3>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/20 text-white backdrop-blur">AI DESTEKLİ</span>
            </div>
            <p className="text-[12px] text-white/90">Kayıtlı müşteriye bağlı satış süreci başlat · hizmet seçimi, modül detayları ve AI teklifi hazırla</p>
          </div>
          <div className="w-10 h-10 bg-white/15 backdrop-blur rounded-lg flex items-center justify-center shrink-0 border border-white/20 group-hover:translate-x-1 transition-transform">
            <Icon className="text-white w-5 h-5"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></Icon>
          </div>
        </div>
      </button>

      <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-3 flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <SearchIcon />
          <input type="text" placeholder="Firma veya yetkili ara..." value={search} onChange={(event) => setSearch(event.target.value)} className="w-full pl-9 pr-3 py-2 text-[12px] border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#17181f] text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:border-violet-500 placeholder:text-gray-400 dark:placeholder:text-gray-500" />
        </div>
        <select value={source} onChange={(event) => setSource(event.target.value)} className="px-3 py-2 text-[11px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#17181f] text-gray-700 dark:text-gray-300 rounded-lg focus:outline-none focus:border-violet-500 font-medium">
          {['Tümü', 'Google Ads', 'Web Sitesi', 'Referans', 'Organik', 'Telefon', 'E-Bülten', 'Meta Reklam'].map((item) => <option key={item}>{item}</option>)}
        </select>
        <select value={status} onChange={(event) => setStatus(event.target.value)} className="px-3 py-2 text-[11px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#17181f] text-gray-700 dark:text-gray-300 rounded-lg focus:outline-none focus:border-violet-500 font-medium">
          {['Tümü', 'Yeni Atama', 'Teklif Hazırlanıyor', 'Müşteride', 'İlk Görüşme', 'Onaylandı', 'Revize Bekliyor'].map((item) => <option key={item}>{item}</option>)}
        </select>
        <select value={priority} onChange={(event) => setPriority(event.target.value)} className="px-3 py-2 text-[11px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#17181f] text-gray-700 dark:text-gray-300 rounded-lg focus:outline-none focus:border-violet-500 font-medium">
          {['Tümü', 'Yüksek', 'Orta', 'Düşük'].map((item) => <option key={item}>{item}</option>)}
        </select>
      </div>

      <div className="hidden md:block bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700/40 bg-gray-50/60 dark:bg-[#17181f]/60">
              {['Firma / Müşteri', 'Kaynak', 'Durum', 'Temsilci', 'Güncelleme', 'Öncelik', 'Sonraki Adım', 'İşlem'].map((head, index) => <th key={head} className={`px-3 py-2.5 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ${index === 7 ? 'text-right' : 'text-left'}`}>{head}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
            {filtered.map((opp) => (
              <tr key={opp.id} className="gr hover:bg-violet-50/30 dark:hover:bg-violet-500/5 cursor-pointer">
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-sky-100 dark:bg-sky-500/15 border border-sky-200/60 dark:border-sky-500/20 rounded-lg flex items-center justify-center shrink-0">
                      <BuildingIcon className="text-sky-600 dark:text-sky-400 w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100">{opp.co}</p>
                      {opp.musNo ? <p className="text-[10px] text-gray-400 dark:text-gray-500 font-mono">{opp.musNo}</p> : null}
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3 text-[12px] text-gray-600 dark:text-gray-400">{opp.src}</td>
                <td className="px-3 py-3"><Bdg txt={opp.status} c={opp.stClr} /></td>
                <td className="px-3 py-3 text-[12px] text-gray-700 dark:text-gray-300">{opp.rep}</td>
                <td className="px-3 py-3 text-[11px] text-gray-500 dark:text-gray-500">{opp.upd}</td>
                <td className="px-3 py-3"><Bdg txt={opp.pri} c={opp.priClr} /></td>
                <td className="px-3 py-3"><Bdg txt={opp.next} c={opp.nxtClr} /></td>
                <td className="px-3 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button title="Görüntüle" className="w-7 h-7 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 flex items-center justify-center transition-colors"><Icon className="w-3.5 h-3.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></Icon></button>
                    <button onClick={() => onStartFor(opp)} title="Teklif Oluştur" className="w-7 h-7 rounded-md hover:bg-violet-100 dark:hover:bg-violet-500/20 text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 flex items-center justify-center transition-colors"><FileIcon className="w-3.5 h-3.5" /></button>
                    {opp.next === 'Sözleşmeye Geç' ? <button onClick={() => navigate('/dashboards/sales/contracts')} title="Sözleşmeye" className="w-7 h-7 rounded-md hover:bg-emerald-100 dark:hover:bg-emerald-500/20 text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center justify-center transition-colors"><SendIcon className="w-3.5 h-3.5" /></button> : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-2.5">
        {filtered.map((opp) => (
          <div key={opp.id} onClick={() => onStartFor(opp)} className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-4 active:bg-gray-50 dark:active:bg-gray-800/50 cursor-pointer">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div className="w-9 h-9 bg-sky-100 dark:bg-sky-500/15 border border-sky-200/60 dark:border-sky-500/20 rounded-lg flex items-center justify-center shrink-0">
                  <BuildingIcon className="text-sky-600 dark:text-sky-400 w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-bold text-gray-900 dark:text-gray-100 truncate">{opp.co}</p>
                  {opp.musNo ? <p className="text-[10px] text-gray-400 dark:text-gray-500 font-mono">{opp.musNo}</p> : null}
                </div>
              </div>
              <Bdg txt={opp.pri} c={opp.priClr} />
            </div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div><p className="text-[10px] text-gray-400 dark:text-gray-500 mb-0.5">Kaynak</p><p className="text-[11px] font-semibold text-gray-700 dark:text-gray-300">{opp.src}</p></div>
              <div><p className="text-[10px] text-gray-400 dark:text-gray-500 mb-0.5">Temsilci</p><p className="text-[11px] font-semibold text-gray-700 dark:text-gray-300">{opp.rep}</p></div>
              <div><p className="text-[10px] text-gray-400 dark:text-gray-500 mb-0.5">Durum</p><Bdg txt={opp.status} c={opp.stClr} /></div>
              <div><p className="text-[10px] text-gray-400 dark:text-gray-500 mb-0.5">Sonraki</p><Bdg txt={opp.next} c={opp.nxtClr} /></div>
            </div>
            <div className="flex items-center justify-between pt-2.5 border-t border-gray-100 dark:border-gray-600/50">
              <span className="text-[10px] text-gray-400 dark:text-gray-500">{opp.upd}</span>
              <button onClick={(event) => { event.stopPropagation(); onStartFor(opp); }} className="flex items-center gap-1 text-[11px] font-semibold text-violet-600 dark:text-violet-400 px-2.5 py-1.5 bg-violet-50 dark:bg-violet-500/15 rounded-md border border-violet-200/60 dark:border-violet-500/25">
                <FileIcon className="w-3 h-3" /> Teklif Oluştur
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-[#1e1f26] border border-dashed border-gray-300 dark:border-gray-600/50 rounded-xl p-10 text-center">
          <div className="w-14 h-14 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center mx-auto mb-3">
            <SearchIcon className="text-gray-400 w-6 h-6 mx-auto mb-2" />
          </div>
          <h3 className="text-[14px] font-bold text-gray-900 dark:text-gray-100 mb-1">Eşleşen Fırsat Bulunamadı</h3>
          <p className="text-[12px] text-gray-500 dark:text-gray-400">Filtre kriterlerini değiştirip tekrar deneyin.</p>
        </div>
      ) : null}
    </div>
  );
}

function OfferSelect({
  selectedCustomer,
  selectedServices,
  customers,
  customersLoading,
  customersError,
  salesRequests,
  salesRequestsLoading,
  salesRequestsError,
  onCancel,
  onSelectCustomer,
  onClearCustomer,
  onToggleService,
  onContinue,
}: {
  selectedCustomer: Customer | null;
  selectedServices: string[];
  customers: Customer[];
  customersLoading: boolean;
  customersError: string;
  salesRequests: SalesPanelRequest[];
  salesRequestsLoading: boolean;
  salesRequestsError: string;
  onCancel: () => void;
  onSelectCustomer: (customer: Customer) => void;
  onClearCustomer: () => void;
  onToggleService: (id: string) => void;
  onContinue: () => void;
}) {
  const navigate = useNavigate();
  const [customerSearch, setCustomerSearch] = useState('');
  const [alphabeticFilter, setAlphabeticFilter] = useState('Tümü');
  const [customerStatusFilter, setCustomerStatusFilter] = useState('Tümü');
  const [customerSourceFilter, setCustomerSourceFilter] = useState('Tümü');
  const [customerSegmentFilter, setCustomerSegmentFilter] = useState('Tümü');
  const [customerServiceFilter, setCustomerServiceFilter] = useState('Tümü');
  const [quickSelectFilter, setQuickSelectFilter] = useState('Tümü');

  const filteredCustomers = useMemo(() => customers.filter((customer) => {
    const search = customerSearch.toLocaleLowerCase('tr-TR');
    const mSearch = !customerSearch ||
      customer.company.toLocaleLowerCase('tr-TR').includes(search) ||
      customer.contact.toLocaleLowerCase('tr-TR').includes(search) ||
      (customer.email ?? '').toLocaleLowerCase('tr-TR').includes(search) ||
      (customer.code ?? '').toLocaleLowerCase('tr-TR').includes(search);
    const mAlpha = alphabeticFilter === 'Tümü' || customer.company.charAt(0).toLocaleUpperCase('tr-TR') === alphabeticFilter;
    const mStatus = customerStatusFilter === 'Tümü' || customer.status === customerStatusFilter;
    const mSource = customerSourceFilter === 'Tümü' || customer.source === customerSourceFilter;
    const mSeg = customerSegmentFilter === 'Tümü' || customer.segment === customerSegmentFilter;
    const mSvc = customerServiceFilter === 'Tümü' || customer.interest === customerServiceFilter;
    const quick = QUICK_SELECT_OPTIONS.find((option) => option.label === quickSelectFilter);
    const mQ = !quick || quick.tag === '' || customer.tag === quick.tag;
    return mSearch && mAlpha && mStatus && mSource && mSeg && mSvc && mQ;
  }), [alphabeticFilter, customerSearch, customerSegmentFilter, customerServiceFilter, customerSourceFilter, customerStatusFilter, quickSelectFilter, customers]);
  const hasRequired = REQUIRED_FOR_PREMIUM.every((id) => selectedServices.includes(id));
  const canContinue = Boolean(selectedCustomer && selectedServices.length > 0);

  return (
    <div className="relative min-h-[calc(100vh-120px)] space-y-4 md:space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <button onClick={onCancel} className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shrink-0"><BackIcon className="text-gray-600 dark:text-gray-400 w-4 h-4" /></button>
          <div className="w-9 h-9 bg-violet-100 dark:bg-violet-900/40 rounded-xl flex items-center justify-center shrink-0">
            <Icon className="text-violet-600 dark:text-violet-400 w-5 h-5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="12" y1="18" x2="12" y2="12" /><line x1="9" y1="15" x2="15" y2="15" /></Icon>
          </div>
          <div><h1 className="text-[19px] font-bold text-gray-900 dark:text-gray-100 leading-tight">Yeni Satış / Teklif Oluştur</h1>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">Kayıtlı müşteriye bağlı satış süreci başlat ve teklifi hazırla</p></div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-5 md:p-6">
        <div className="flex items-start justify-between gap-3 flex-wrap mb-4">
          <div className="flex-1 min-w-[240px]">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1 h-4 bg-violet-600 rounded-full" />
              <h3 className="text-[14px] font-bold text-gray-900 dark:text-gray-100">Müşteri Seçimi</h3>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">Satış süreci kayıtlı müşteri üzerinden başlatılır. Müşteri arayın, alfabetik listeden seçin veya filtreleyin.</p>
          </div>
          <button onClick={() => navigate('/dashboards/sales/customer-data-control')} className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold bg-white dark:bg-[#161720] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-violet-400 dark:hover:border-violet-600 hover:text-violet-600 dark:hover:text-violet-400 rounded-lg transition-colors shrink-0">
            <Icon className="w-3.5 h-3.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></Icon> Müşteri Havuzuna Git
          </button>
        </div>

        <div className="relative mb-3">
          <SearchIcon className="text-gray-400 w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input type="text" value={customerSearch} onChange={(event) => setCustomerSearch(event.target.value)} placeholder="Firma veya kişi ile müşteri ara..." className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#23242c] text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:border-violet-500 focus:bg-white dark:focus:bg-[#0a0a0c] text-[13px] placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-colors" />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap mb-3">
          {QUICK_SELECT_OPTIONS.map((option) => {
            const active = quickSelectFilter === option.label;
            return <button key={option.id} onClick={() => setQuickSelectFilter(option.label)} className={`px-3 py-1.5 text-[11px] font-semibold rounded-lg transition-all ${active ? 'bg-violet-600 text-white shadow-sm' : 'bg-gray-50 dark:bg-gray-800/60 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-600/50'}`}>{option.label}</button>;
          })}
        </div>

        <div className="flex items-center gap-1 flex-wrap mb-4 pb-4 border-b border-gray-100 dark:border-gray-600/50">
          {TURKISH_ALPHABET.map((letter) => {
            const active = alphabeticFilter === letter;
            return <button key={letter} onClick={() => setAlphabeticFilter(letter)} className={`w-7 h-7 text-[11px] font-bold rounded-md transition-all ${active ? 'bg-violet-600 text-white shadow-sm' : 'bg-transparent text-gray-500 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>{letter === 'Tümü' ? '•' : letter}</button>;
          })}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
          <select value={customerStatusFilter} onChange={(event) => setCustomerStatusFilter(event.target.value)} className="px-3 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#23242c] text-gray-700 dark:text-gray-300 rounded-lg text-[11px] font-medium focus:outline-none focus:border-violet-500">
            {['Tümü', 'Aktif', 'Potansiyel', 'Pasif'].map((item) => <option key={item} value={item}>{item === 'Tümü' ? 'Tüm Durumlar' : item}</option>)}
          </select>
          <select value={customerSourceFilter} onChange={(event) => setCustomerSourceFilter(event.target.value)} className="px-3 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#23242c] text-gray-700 dark:text-gray-300 rounded-lg text-[11px] font-medium focus:outline-none focus:border-violet-500">
            {['Tümü', 'Web', 'Referans', 'Google Ads', 'Sosyal Medya'].map((item) => <option key={item} value={item}>{item === 'Tümü' ? 'Tüm Kaynaklar' : item}</option>)}
          </select>
          <select value={customerSegmentFilter} onChange={(event) => setCustomerSegmentFilter(event.target.value)} className="px-3 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#23242c] text-gray-700 dark:text-gray-300 rounded-lg text-[11px] font-medium focus:outline-none focus:border-violet-500">
            {['Tümü', 'Teknoloji', 'Moda', 'Perakende', 'Eğitim', 'Sağlık', 'Turizm', 'İnşaat', 'Lojistik'].map((item) => <option key={item} value={item}>{item === 'Tümü' ? 'Tüm Segmentler' : item}</option>)}
          </select>
          <select value={customerServiceFilter} onChange={(event) => setCustomerServiceFilter(event.target.value)} className="px-3 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#23242c] text-gray-700 dark:text-gray-300 rounded-lg text-[11px] font-medium focus:outline-none focus:border-violet-500">
            {['Tümü', 'Web Sitesi', 'SEO', 'Google Ads', 'Sosyal Medya', 'Prodüksiyon', 'Hosting'].map((item) => <option key={item} value={item}>{item === 'Tümü' ? 'Tüm İlgi Alanları' : item}</option>)}
          </select>
        </div>

        {selectedCustomer ? (
          <>
          <div className="relative overflow-hidden bg-gradient-to-br from-violet-50 to-indigo-50/60 dark:from-violet-900/20 dark:to-indigo-900/10 border border-violet-200 dark:border-violet-800/40 rounded-xl p-4 mb-4">
            <div className="absolute -top-8 -right-8 w-28 h-28 bg-violet-400/10 rounded-full pointer-events-none" />
            <div className="relative">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-11 h-11 bg-violet-600 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                    <BuildingIcon className="text-white w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-gray-900 dark:text-gray-100 text-[15px] mb-0.5">{selectedCustomer.company}</div>
                    <div className="text-[12px] text-gray-500 dark:text-gray-400">{selectedCustomer.contact}</div>
                  </div>
                </div>
                <button onClick={onClearCustomer} className="flex items-center gap-1 text-[11px] font-semibold text-violet-700 dark:text-violet-400 hover:text-violet-900 dark:hover:text-violet-300 shrink-0 px-2.5 py-1 rounded-md hover:bg-violet-100/50 dark:hover:bg-violet-900/30 transition-colors">
                  <Icon className="w-3 h-3"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" /></Icon> Değiştir
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <SelectedInfo label="Müşteri Tipi" value={selectedCustomer.type} />
                <SelectedInfo label="Kaynak" value={selectedCustomer.source} />
                <SelectedInfo label="Segment" value={selectedCustomer.segment} />
                <div className="bg-white/60 dark:bg-white/5 border border-white/40 dark:border-white/5 rounded-lg px-2.5 py-2">
                  <div className="text-[10px] text-gray-500 dark:text-gray-400 mb-0.5 font-medium">Durum</div>
                  <div className="flex items-center gap-1"><CheckIcon className="text-emerald-600 w-3.5 h-3.5" /><span className="text-[12px] font-bold text-emerald-700 dark:text-emerald-400">{selectedCustomer.status}</span></div>
                </div>
              </div>
            </div>
          </div>
          <SalesRequestInfoCard requests={salesRequests} loading={salesRequestsLoading} error={salesRequestsError} />
          </>
        ) : customersLoading ? (
          <div className="text-center py-10 text-[12px] text-gray-500 dark:text-gray-500 bg-gray-50 dark:bg-[#161720]/50 rounded-lg border border-dashed border-gray-200 dark:border-gray-600/50">
            Müşteriler yükleniyor...
          </div>
        ) : customersError ? (
          <div className="text-center py-10 text-[12px] text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/10 rounded-lg border border-dashed border-rose-200 dark:border-rose-800/40">
            {customersError}
          </div>
        ) : filteredCustomers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {filteredCustomers.slice(0, 10).map((customer) => (
              <button key={customer.id} onClick={() => onSelectCustomer(customer)} className="group flex items-center gap-3 p-3 bg-white dark:bg-[#161720] hover:bg-violet-50/50 dark:hover:bg-violet-900/10 border border-gray-200 dark:border-gray-600/50 hover:border-violet-300 dark:hover:border-violet-700 rounded-lg transition-all text-left">
                <div className="w-9 h-9 bg-gray-100 dark:bg-gray-800 group-hover:bg-violet-100 dark:group-hover:bg-violet-900/40 rounded-lg flex items-center justify-center shrink-0 transition-colors">
                  <BuildingIcon className="text-gray-500 dark:text-gray-400 group-hover:text-violet-600 dark:group-hover:text-violet-400 w-4 h-4 transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 dark:text-gray-100 text-[12px] truncate group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">{customer.company}</div>
                  <div className="text-[10px] text-gray-500 dark:text-gray-400 truncate">{customer.contact} · {customer.segment}</div>
                </div>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${customer.status === 'Aktif' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' : customer.status === 'Potansiyel' ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'} shrink-0`}>{customer.status}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-[12px] text-gray-500 dark:text-gray-500 bg-gray-50 dark:bg-[#161720]/50 rounded-lg border border-dashed border-gray-200 dark:border-gray-600/50">
            <SearchIcon className="text-gray-300 dark:text-gray-700 w-8 h-8 mx-auto mb-2" />
            Filtre kriterlerine uygun müşteri bulunamadı
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-5 md:p-6">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1 h-4 bg-violet-600 rounded-full" />
            <h3 className="text-[14px] font-bold text-gray-900 dark:text-gray-100">Hizmet Seçimi</h3>
            {selectedServices.length > 0 ? <span className="ml-2 text-[11px] font-bold px-2 py-0.5 bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 rounded-full">{selectedServices.length} seçili</span> : null}
          </div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">Bu satış sürecinde teklif hazırlanacak hizmetleri seçin. Birden fazla hizmet seçilebilir.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {OFFER_SERVICES.map((service) => {
            const isSelected = selectedServices.includes(service.id);
            const isPremium = service.type === 'premium';
            const isLocked = isPremium && !hasRequired;
            const disabledCls = !selectedCustomer ? 'opacity-50 cursor-not-allowed' : '';
            if (isPremium && isLocked) {
              return (
                <button key={service.id} disabled className="flex items-center gap-3 p-3.5 rounded-xl border border-dashed border-amber-300 dark:border-amber-700/40 bg-amber-50/30 dark:bg-amber-900/10 cursor-not-allowed text-left">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-amber-100/60 dark:bg-amber-900/20"><Icon className="text-amber-400 dark:text-amber-600 w-4 h-4">{service.icon}</Icon></div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-bold text-amber-600/80 dark:text-amber-400/70 flex items-center gap-1.5">{service.name}</div>
                    <div className="text-[10px] mt-0.5 text-amber-600/60 dark:text-amber-400/50">Tüm hizmetler seçildiğinde aktif olur</div>
                  </div>
                  <Icon className="shrink-0 text-amber-400/60 w-4 h-4"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></Icon>
                </button>
              );
            }
            if (isPremium && isSelected) {
              return (
                <button key={service.id} onClick={() => selectedCustomer && onToggleService(service.id)} disabled={!selectedCustomer} className={`relative overflow-hidden flex items-center gap-3 p-3.5 rounded-xl border-2 border-amber-400 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/30 dark:to-yellow-900/20 shadow-sm text-left ${disabledCls}`}>
                  <div className="absolute -top-6 -right-6 w-20 h-20 bg-amber-400/20 rounded-full pointer-events-none" />
                  <div className="relative w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br from-amber-500 to-yellow-600 shadow"><Icon className="text-white w-4 h-4">{service.icon}</Icon></div>
                  <div className="relative flex-1 min-w-0">
                    <div className="text-[12px] font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">{service.name} <span className="text-[9px] bg-amber-600 text-white px-1.5 py-0.5 rounded">PREMIUM</span></div>
                    <div className="text-[10px] mt-0.5 text-amber-700 dark:text-amber-300">Premium paket seçildi</div>
                  </div>
                  <CheckIcon className="relative shrink-0 text-amber-700 dark:text-amber-300 w-4 h-4" />
                </button>
              );
            }
            if (isPremium) {
              return (
                <button key={service.id} onClick={() => selectedCustomer && onToggleService(service.id)} disabled={!selectedCustomer} className={`relative overflow-hidden flex items-center gap-3 p-3.5 rounded-xl border border-amber-300 dark:border-amber-700/50 bg-gradient-to-br from-amber-50/70 to-yellow-50/50 dark:from-amber-900/15 dark:to-yellow-900/10 hover:border-amber-400 dark:hover:border-amber-600 hover:shadow-sm transition-all text-left ${disabledCls}`}>
                  <div className="relative w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br from-amber-400 to-yellow-500"><Icon className="text-white w-4 h-4">{service.icon}</Icon></div>
                  <div className="relative flex-1 min-w-0">
                    <div className="text-[12px] font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">{service.name} <span className="text-[9px] bg-amber-500 text-white px-1.5 py-0.5 rounded">PREMIUM</span></div>
                    <div className="text-[10px] mt-0.5 text-amber-700 dark:text-amber-300">Bağımsız premium hizmet</div>
                  </div>
                  <Icon className="relative shrink-0 text-amber-500 w-4 h-4">{SERVICE_ICONS.premium360}</Icon>
                </button>
              );
            }
            return (
              <button key={service.id} onClick={() => selectedCustomer && onToggleService(service.id)} disabled={!selectedCustomer} className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all text-left ${isSelected ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20 shadow-sm' : 'border-gray-200 dark:border-gray-600/50 bg-white dark:bg-[#161720] hover:border-violet-300 dark:hover:border-violet-700 hover:bg-violet-50/40 dark:hover:bg-violet-900/10'} ${disabledCls}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'bg-violet-600' : 'bg-gray-100 dark:bg-gray-800'}`}><Icon className={`${isSelected ? 'text-white' : 'text-gray-500 dark:text-gray-400'} w-4 h-4`}>{service.icon}</Icon></div>
                <div className="flex-1 min-w-0">
                  <div className={`text-[12px] font-bold ${isSelected ? 'text-violet-700 dark:text-violet-300' : 'text-gray-900 dark:text-gray-100'}`}>{service.name}</div>
                </div>
                {isSelected ? <CheckIcon className="shrink-0 text-violet-600 dark:text-violet-400 w-4 h-4" /> : <div className="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-gray-700 shrink-0" />}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex items-start gap-2.5 p-3 bg-violet-50/50 dark:bg-violet-900/10 border border-violet-200/60 dark:border-violet-800/30 rounded-lg">
          <Icon className="text-violet-600 dark:text-violet-400 shrink-0 mt-0.5 w-4 h-4"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></Icon>
          <div className="flex-1">
            <p className="text-[11px] font-semibold mb-0.5 text-violet-900 dark:text-violet-200">Hizmet Seçim Bilgisi</p>
            <p className="text-[11px] text-violet-700/90 dark:text-violet-400/90 leading-relaxed">Seçilen hizmetlere göre sonraki adımda plan detayları ve teklif kurgusu şekillenir. <span className="font-semibold">Premium paket</span>; Domain ve Marka Tescili hariç tüm hizmetler seçildiğinde aktif olur.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Bugün Verilen Teklif', value: '8', change: '+2', sub: 'dünden', clr: 'emerald' as ColorName },
          { label: 'Son 7 Gün', value: '42', change: '+8', sub: 'önceki 7 gün', clr: 'sky' as ColorName },
          { label: 'Son 15 Gün', value: '79', change: '+12', sub: 'önceki 15 gün', clr: 'violet' as ColorName },
          { label: 'Son 1 Ay', value: '156', change: '+24', sub: 'önceki ay', clr: 'indigo' as ColorName },
        ].map((stat) => {
          const cm = CM[stat.clr] || CM.gray;
          return (
            <div key={stat.label} className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-4 hover:shadow-md dark:hover:border-gray-700 transition-all">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium leading-tight">{stat.label}</p>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${cm.bg} ${cm.t}`}>{stat.change}</span>
              </div>
              <div className="text-[22px] font-bold text-gray-900 dark:text-gray-100 leading-none mb-1">{stat.value}</div>
              <p className="text-[10px] text-gray-400 dark:text-gray-500">{stat.sub}</p>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-3 pt-2">
        <button onClick={onCancel} className="px-4 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-[12px]">İptal</button>
        <button onClick={onContinue} disabled={!canContinue} className={`px-5 py-2.5 ${canContinue ? 'bg-violet-600 hover:bg-violet-700 shadow-sm' : 'bg-gray-300 dark:bg-gray-800 cursor-not-allowed'} text-white rounded-lg font-semibold transition-colors flex items-center gap-2 text-[12px]`}>
          Plan Detaylarına Geç
          <Icon className="w-4 h-4"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></Icon>
        </button>
      </div>
    </div>
  );
}

function SelectedInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/60 dark:bg-white/5 border border-white/40 dark:border-white/5 rounded-lg px-2.5 py-2">
      <div className="text-[10px] text-gray-500 dark:text-gray-400 mb-0.5 font-medium">{label}</div>
      <div className="text-[12px] font-bold text-gray-900 dark:text-gray-100">{value}</div>
    </div>
  );
}

function SalesRequestInfoCard({ requests, loading, error }: { requests: SalesPanelRequest[]; loading: boolean; error: string }) {
  const latestRequest = requests[0];
  const requestCount = requests.length;
  const readRequestValue = (camelKey: string, pascalKey: string) => {
    const record = (latestRequest ?? {}) as Record<string, unknown>;
    return record[camelKey] ?? record[pascalKey];
  };
  const readRequestField = (camelKey: string, pascalKey: string) => {
    return safeText(readRequestValue(camelKey, pascalKey));
  };
  const status = latestRequest
    ? readRequestField('salesStatus', 'SalesStatus') || readRequestField('status', 'Status') || readRequestField('requestStatus', 'RequestStatus') || '-'
    : '-';
  const requestTitle = readRequestField('requestTitle', 'RequestTitle');
  const priority = readRequestField('priority', 'Priority');
  const requestSource = readRequestField('requestSource', 'RequestSource');
  const description = readRequestField('description', 'Description');
  const notes = readRequestField('notes', 'Notes');
  const servicesRaw = readRequestValue('services', 'Services') ?? readRequestValue('service', 'Service') ?? readRequestValue('requestedServices', 'RequestedServices');
  const servicesValue = Array.isArray(servicesRaw)
    ? servicesRaw.map((service) => safeText(service)).filter(Boolean).join(', ')
    : safeText(servicesRaw);

  return (
    <div className="bg-white dark:bg-[#161720] border border-gray-200 dark:border-gray-600/50 rounded-xl p-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-1 h-4 bg-sky-600 rounded-full" />
        <h3 className="text-[13px] font-bold text-gray-900 dark:text-gray-100">Satış Talep Bilgisi</h3>
      </div>

      {loading ? (
        <p className="text-[12px] text-gray-500 dark:text-gray-400">Satış talep bilgisi yükleniyor...</p>
      ) : error ? (
        <p className="text-[12px] text-gray-500 dark:text-gray-400">Bu müşterinin talebi yok</p>
      ) : latestRequest ? (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <SelectedInfo label="Talep Başlığı" value={requestTitle || '-'} />
            <SelectedInfo label="Öncelik" value={priority || '-'} />
            <SelectedInfo label="Talep Kaynağı" value={requestSource || '-'} />
            <SelectedInfo label="Durum" value={status} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="bg-gray-50 dark:bg-[#23242c] border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5">
              <div className="text-[10px] text-gray-500 dark:text-gray-400 mb-1 font-medium">Ne İstediği / Açıklama</div>
              <div className="text-[12px] font-semibold text-gray-900 dark:text-gray-100 leading-relaxed">{description || requestTitle || '-'}</div>
            </div>
            <div className="bg-gray-50 dark:bg-[#23242c] border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5">
              <div className="text-[10px] text-gray-500 dark:text-gray-400 mb-1 font-medium">Notlar</div>
              <div className="text-[12px] font-semibold text-gray-900 dark:text-gray-100 leading-relaxed">{notes || '-'}</div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-[#23242c] border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5">
            <div className="text-[10px] text-gray-500 dark:text-gray-400 mb-1 font-medium">Hizmet Bilgisi</div>
            <div className="text-[12px] font-semibold text-gray-900 dark:text-gray-100 leading-relaxed">{servicesValue || 'Hizmet bilgisi yok'}</div>
          </div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400">Bu müşteriye ait {requestCount} satış talebi bulundu.</p>
        </div>
      ) : (
        <p className="text-[12px] text-gray-500 dark:text-gray-400">Bu müşterinin talebi yok</p>
      )}
    </div>
  );
}

function ServiceDetails({
  selectedCustomer,
  selectedServices,
  activeModule,
  onBack,
  onActiveModule,
  onSummary,
}: {
  selectedCustomer: Customer | null;
  selectedServices: string[];
  activeModule: string;
  onBack: () => void;
  onActiveModule: (id: string) => void;
  onSummary: () => void;
}) {
  const svcs = selectedServices.map(serviceById);
  const activeIdx = selectedServices.indexOf(activeModule);
  const isLast = activeIdx === selectedServices.length - 1;
  const nextServiceId = !isLast ? selectedServices[activeIdx + 1] : null;
  const nextService = nextServiceId ? serviceById(nextServiceId) : null;
  const activeService = serviceById(activeModule);
  const [formData, setFormData] = useState<Record<string, string | boolean | string[]>>({
    webHasWebsite: true,
    webStructure: 'standard',
    webContentMgmt: 'admin-panel',
    webDesignStyle: 'corporate',
    webLangs: ['tr'],
    seoLanguages: ['tr'],
    seoTypes: ['local'],
    seoGoals: ['traffic'],
    adsCurrency: 'TL',
    adsActiveDays: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum'],
    adsLanguages: ['tr'],
    adsLocationMethod: 'region',
    smPlatforms: ['instagram'],
    smLanguages: ['tr'],
    smTargetGender: 'all',
    saPlatforms: ['instagram', 'facebook'],
    saCurrency: 'TL',
    productionType: 'photo-video',
    domainAction: 'new',
    hostingSetupType: 'shared',
    hostingPeriod: '12',
    tmBrandType: 'combined',
    tmCoverageScope: 'turkey',
    p360Priority: 'vip',
  });
  const setField = (key: string, value: string | boolean | string[]) => setFormData((current) => ({ ...current, [key]: value }));
  const toggleList = (key: string, value: string) => setFormData((current) => {
    const list = Array.isArray(current[key]) ? current[key] as string[] : [];
    return { ...current, [key]: list.includes(value) ? list.filter((item) => item !== value) : [...list, value] };
  });
  const [aiLoadingKey, setAiLoadingKey] = useState<string | null>(null);
  const [aiError, setAiError] = useState('');

  const runAiAnalysis = async ({
    analyzedKey,
    context,
    resultKey,
    urlKey,
  }: {
    analyzedKey: string;
    context: string;
    resultKey: string;
    urlKey: string;
  }) => {
    const websiteUrl = getString(formData, urlKey).trim();
    if (!websiteUrl) {
      const message = 'Lütfen analiz edilecek site adresini girin.';
      setAiError(message);
      window.alert(message);
      return;
    }

    try {
      setAiError('');
      setAiLoadingKey(resultKey);
      const analysis = await analyzeWebsiteWithAI(websiteUrl);
      applyAiAnalysisToForm(analysis, context, resultKey, setField);
      setField(analyzedKey, true);
    } catch (error) {
      const apiError = error as { message?: string; response?: { status?: number; data?: { message?: string; title?: string } }; config?: { url?: string } };
      console.error('AI analiz hatası:', error);
      console.error('Status:', apiError.response?.status);
      console.error('Data:', apiError.response?.data);
      const message = apiError.response?.data?.message || apiError.response?.data?.title || apiError.message || 'AI analizi tamamlanamadı.';
      setAiError(message);
      window.alert(message);
    } finally {
      setAiLoadingKey(null);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-120px)] space-y-4 md:space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shrink-0"><BackIcon className="text-gray-600 dark:text-gray-400 w-4 h-4" /></button>
          <div>
            <h1 className="text-[19px] font-bold text-gray-900 dark:text-gray-100 leading-tight">Yeni Satış / Teklif Oluştur</h1>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">Kayıtlı müşteri üzerinden satış sürecini başlatın, hizmetleri seçin ve teklif hazırlık akışını oluşturun.</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-900 dark:bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
            <BuildingIcon className="text-white dark:text-gray-900 w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[14px] font-bold text-gray-900 dark:text-gray-100">{selectedCustomer ? selectedCustomer.company : 'Müşteri Seçilmedi'}</p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">{selectedCustomer ? `${selectedCustomer.contact} · ${selectedCustomer.segment}` : ''}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center"><CheckIcon className="text-white w-3 h-3" /></div>
            <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">Firma & Hizmet</span>
          </div>
          <div className="w-6 h-px bg-gray-300 dark:bg-gray-700" />
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-violet-600 flex items-center justify-center text-white text-[10px] font-bold">2</div>
            <span className="text-[11px] font-semibold text-violet-700 dark:text-violet-400">Hizmet Tercihleri</span>
          </div>
          <div className="w-6 h-px bg-gray-300 dark:bg-gray-700" />
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-500 text-[10px] font-bold">3</div>
            <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-500">Özet & Onay</span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-1 h-4 bg-violet-600 rounded-full" />
          <h3 className="text-[13px] font-bold text-gray-900 dark:text-gray-100">Seçilen Hizmetler</h3>
          <span className="text-[11px] text-gray-500 dark:text-gray-400">· {svcs.length} modül · tıklayarak düzenleyin</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {svcs.map((service) => {
            const isActive = service.id === activeModule;
            return (
              <button key={service.id} onClick={() => onActiveModule(service.id)} className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${isActive ? 'bg-violet-50 dark:bg-violet-900/20 border-violet-500 shadow-sm' : 'bg-white dark:bg-[#161720] border-gray-200 dark:border-gray-600/50 hover:border-violet-300 dark:hover:border-violet-700'}`}>
                <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${isActive ? 'bg-violet-600' : 'bg-gray-100 dark:bg-gray-800'}`}><Icon className={`${isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400'} w-3 h-3`}>{service.icon}</Icon></div>
                <span className={`text-[12px] font-bold ${isActive ? 'text-violet-700 dark:text-violet-300' : 'text-gray-700 dark:text-gray-300'}`}>{service.name}</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-500">Başlanmadı</span>
              </button>
            );
          })}
        </div>
      </div>

      {aiError ? <InfoPanel title="AI Analiz Hatası" color="rose">{aiError}</InfoPanel> : null}

      <ServiceModule activeModule={activeModule} aiLoadingKey={aiLoadingKey} formData={formData} onAnalyze={runAiAnalysis} setField={setField} toggleList={toggleList} />

      <div className="hidden">
        <div className="flex items-start justify-between gap-3 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1 h-4 bg-violet-600 rounded-full" />
              <h3 className="text-[14px] font-bold text-gray-900 dark:text-gray-100">{activeService.name} Detayları</h3>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">Seçilen hizmet için plan detaylarını, kapsamı ve teklif notlarını doldurun.</p>
          </div>
          <Bdg txt="Başlanmadı" c="gray" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Plan / Paket" placeholder={`${activeService.name} için paket seçimi`} />
          <FormField label="Başlangıç Tarihi" type="date" />
          <FormField label="Aylık Bütçe" placeholder="₺15.000" />
          <FormField label="Süre" placeholder="3 ay" />
        </div>
        <div className="mt-4">
          <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">Kapsam / Notlar</label>
          <textarea rows={4} placeholder="Müşteri beklentisi, hizmet kapsamı ve teklif notları..." className="w-full px-3 py-2.5 text-[12px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#23242c] rounded-lg focus:outline-none focus:border-violet-500 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 resize-none" />
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-2">
        <button onClick={onBack} className="px-4 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-[12px] flex items-center justify-center gap-1.5">
          <BackIcon className="w-3.5 h-3.5" />
          Geri
        </button>
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2">
          <button className="px-4 py-2.5 bg-white dark:bg-[#161720] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-[12px]">Taslak Kaydet</button>
          <button className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 text-[12px] shadow-sm">
            <CheckIcon className="w-4 h-4" />
            Kaydet ve Devam Et
          </button>
          {!isLast && nextService ? (
            <button onClick={() => onActiveModule(nextService.id)} className="px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 text-[12px] shadow-sm">
              {nextService.name}
              <Icon className="w-4 h-4"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></Icon>
            </button>
          ) : (
            <button onClick={onSummary} className="px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 text-[12px] shadow-sm">
              Özet & Onaya Geç
              <Icon className="w-4 h-4"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></Icon>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function FormField({ label, placeholder, type = 'text' }: { label: string; placeholder?: string; type?: string }) {
  return (
    <div>
      <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      <input type={type} placeholder={placeholder} className="w-full px-3 py-2.5 text-[12px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#23242c] rounded-lg focus:outline-none focus:border-violet-500 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600" />
    </div>
  );
}

type OfferFormData = Record<string, string | boolean | string[]>;
type SetOfferField = (key: string, value: string | boolean | string[]) => void;
type ToggleOfferList = (key: string, value: string) => void;

const LANG_OPTIONS = [
  { id: 'tr', label: 'Türkçe' },
  { id: 'en', label: 'İngilizce' },
  { id: 'de', label: 'Almanca' },
  { id: 'ru', label: 'Rusça' },
  { id: 'ar', label: 'Arapça' },
  { id: 'fr', label: 'Fransızca' },
  { id: 'es', label: 'İspanyolca' },
];

const SOCIAL_PLATFORMS = [
  { id: 'instagram', label: 'Instagram', gradient: 'bg-gradient-to-br from-pink-500 via-rose-500 to-amber-500' },
  { id: 'facebook', label: 'Facebook', gradient: 'bg-gradient-to-br from-blue-600 to-blue-800' },
  { id: 'linkedin', label: 'LinkedIn', gradient: 'bg-gradient-to-br from-sky-600 to-blue-700' },
  { id: 'tiktok', label: 'TikTok', gradient: 'bg-gradient-to-br from-gray-900 to-gray-700' },
  { id: 'youtube', label: 'YouTube', gradient: 'bg-gradient-to-br from-red-600 to-rose-700' },
];

function getString(data: OfferFormData, key: string) {
  const value = data[key];
  return typeof value === 'string' ? value : '';
}

function getBool(data: OfferFormData, key: string) {
  return data[key] === true;
}

function getArray(data: OfferFormData, key: string) {
  return Array.isArray(data[key]) ? data[key] as string[] : [];
}

function ModuleShell({ serviceId, title, description, children, premium = false }: { serviceId: string; title: string; description: string; children: ReactNode; premium?: boolean }) {
  if (premium) {
    return (
      <div className="space-y-4">
        {children}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-5 md:p-6 space-y-6">
      <div className="flex items-start gap-3 pb-5 border-b border-gray-100 dark:border-gray-700/40">
        <div className="w-11 h-11 bg-violet-600 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
          <Icon className="text-white w-5 h-5">{SERVICE_ICONS[serviceId]}</Icon>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[16px] font-bold text-gray-900 dark:text-gray-100 leading-tight">{title}</h3>
          <p className="text-[11px] text-gray-500 dark:text-gray-400">{description}</p>
        </div>
        <button className="px-3 py-1.5 text-[11px] font-semibold bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800/40 rounded-lg hover:bg-violet-100 dark:hover:bg-violet-900/30 transition-colors flex items-center gap-1.5">
          <Icon className="w-3 h-3"><path d="M12 3c-1 2.5-2.5 4-5 5 2.5 1 4 2.5 5 5 1-2.5 2.5-4 5-5-2.5-1-4-2.5-5-5z" /></Icon>
          AI Önerileri
        </button>
      </div>
      {children}
    </div>
  );
}

function ModuleSection({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <div className="space-y-3">
      <h4 className="text-[13px] font-bold text-gray-900 dark:text-gray-100">
        {title}
        {note ? <span className="text-[11px] font-normal text-gray-500 dark:text-gray-400 ml-1">· {note}</span> : null}
      </h4>
      {children}
    </div>
  );
}

function TextInput({ label, value, onChange, placeholder, type = 'text', prefix }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; type?: string; prefix?: string }) {
  return (
    <div>
      <label className="text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">{label}</label>
      {prefix ? (
        <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-[#23242c] focus-within:border-violet-500">
          <span className="px-3 py-2 text-[12px] text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-[#17181f] border-r border-gray-200 dark:border-gray-700">{prefix}</span>
          <input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="flex-1 px-3 py-2 text-[12px] bg-transparent text-gray-900 dark:text-gray-100 focus:outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500" />
        </div>
      ) : (
        <input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#23242c] text-gray-900 dark:text-gray-100 rounded-lg text-[12px] focus:outline-none focus:border-violet-500 placeholder:text-gray-400 dark:placeholder:text-gray-500" />
      )}
    </div>
  );
}

function TextAreaField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">{label}</label>
      <textarea value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} rows={4} className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#23242c] text-gray-900 dark:text-gray-100 rounded-lg text-[12px] focus:outline-none focus:border-violet-500 resize-none placeholder:text-gray-400 dark:placeholder:text-gray-500" />
    </div>
  );
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <div>
      <label className="text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">{label}</label>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#23242c] text-gray-900 dark:text-gray-100 rounded-lg text-[12px] focus:outline-none focus:border-violet-500">
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </div>
  );
}

function ChoiceGrid({ value, onChange, options, columns = 'md:grid-cols-2' }: { value: string; onChange: (value: string) => void; options: { id: string; title: string; desc: string; icon?: ReactNode; color?: ColorName }[]; columns?: string }) {
  return (
    <div className={`grid grid-cols-1 ${columns} gap-2.5`}>
      {options.map((option) => {
        const selected = value === option.id;
        return (
          <button key={option.id} onClick={() => onChange(option.id)} className={`p-3.5 rounded-xl border transition-all text-left flex items-center gap-3 ${selected ? 'bg-violet-50 dark:bg-violet-900/20 border-violet-500 shadow-sm' : 'bg-white dark:bg-[#161720] border-gray-200 dark:border-gray-600/50 hover:border-violet-300 dark:hover:border-violet-700'}`}>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${selected ? 'bg-violet-600' : 'bg-gray-100 dark:bg-gray-800'}`}>
              {option.icon ? <Icon className={`${selected ? 'text-white' : 'text-gray-400 dark:text-gray-500'} w-4 h-4`}>{option.icon}</Icon> : <span className={`${selected ? 'text-white' : 'text-gray-500'} text-[12px] font-bold`}>{option.title.charAt(0)}</span>}
            </div>
            <div className="flex-1 min-w-0">
              <div className={`text-[13px] font-bold ${selected ? 'text-violet-900 dark:text-violet-200' : 'text-gray-900 dark:text-gray-100'}`}>{option.title}</div>
              <div className={`text-[11px] mt-0.5 ${selected ? 'text-violet-700 dark:text-violet-400' : 'text-gray-500 dark:text-gray-400'}`}>{option.desc}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function MultiChoiceGrid({ selected, onToggle, options, columns = 'md:grid-cols-3' }: { selected: string[]; onToggle: (value: string) => void; options: { id: string; title: string; desc?: string; icon?: ReactNode; gradient?: string }[]; columns?: string }) {
  return (
    <div className={`grid grid-cols-1 ${columns} gap-2.5`}>
      {options.map((option) => {
        const isSelected = selected.includes(option.id);
        return (
          <button key={option.id} onClick={() => onToggle(option.id)} className={`relative p-3 rounded-xl border transition-all text-left ${isSelected ? 'bg-violet-50 dark:bg-violet-900/20 border-violet-500 shadow-sm' : 'bg-white dark:bg-[#161720] border-gray-200 dark:border-gray-600/50 hover:border-violet-300 dark:hover:border-violet-700'}`}>
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${option.gradient || (isSelected ? 'bg-violet-600' : 'bg-gray-100 dark:bg-gray-800')}`}>
                {option.icon ? <Icon className={`${option.gradient || isSelected ? 'text-white' : 'text-gray-500 dark:text-gray-400'} w-4 h-4`}>{option.icon}</Icon> : <span className={`${option.gradient || isSelected ? 'text-white' : 'text-gray-500'} text-[11px] font-bold`}>{option.title.charAt(0)}</span>}
              </div>
              <div className="min-w-0">
                <div className={`text-[12px] font-bold ${isSelected ? 'text-violet-900 dark:text-violet-200' : 'text-gray-900 dark:text-gray-100'}`}>{option.title}</div>
                {option.desc ? <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-violet-700 dark:text-violet-400' : 'text-gray-500 dark:text-gray-400'}`}>{option.desc}</div> : null}
              </div>
            </div>
            {isSelected ? <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-violet-600 rounded-full flex items-center justify-center"><CheckIcon className="text-white w-2.5 h-2.5" /></div> : null}
          </button>
        );
      })}
    </div>
  );
}

function LanguageButtons({ selected, onToggle }: { selected: string[]; onToggle: (value: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {LANG_OPTIONS.map((lang) => {
        const active = selected.includes(lang.id);
        return (
          <button key={lang.id} onClick={() => onToggle(lang.id)} className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-[12px] font-semibold transition-all ${active ? 'bg-violet-600 border-violet-600 text-white shadow-sm' : 'bg-white dark:bg-[#161720] border-gray-200 dark:border-gray-600/50 text-gray-700 dark:text-gray-300 hover:border-violet-300 dark:hover:border-violet-700'}`}>
            {lang.id.toUpperCase()} {lang.label}
          </button>
        );
      })}
    </div>
  );
}

function InfoPanel({ title, children, color = 'violet' }: { title: string; children: ReactNode; color?: ColorName }) {
  const colorMap = {
    violet: 'bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-800/40 text-violet-900 dark:text-violet-200',
    emerald: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-200',
    amber: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-200',
    rose: 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800/40 text-rose-900 dark:text-rose-200',
    sky: 'bg-sky-50 dark:bg-sky-900/20 border-sky-200 dark:border-sky-800/40 text-sky-900 dark:text-sky-200',
    indigo: 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800/40 text-indigo-900 dark:text-indigo-200',
    teal: 'bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800/40 text-teal-900 dark:text-teal-200',
    gray: 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100',
  }[color];

  return (
    <div className={`p-3.5 border rounded-lg flex items-start gap-2.5 ${colorMap}`}>
      <Icon className="shrink-0 mt-0.5 w-4 h-4"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></Icon>
      <div className="flex-1">
        <p className="font-bold mb-0.5 text-[12px]">{title}</p>
        <div className="text-[11px] leading-relaxed opacity-85">{children}</div>
      </div>
    </div>
  );
}

function applyAiAnalysisToForm(analysis: WebsiteAiAnalysis, context: string, resultKey: string, setField: SetOfferField) {
  setField(resultKey, analysis.kisaAnaliz || analysis.mevcutDurum || 'AI analizi tamamlandı.');
  setField(`${context}FirmaAdi`, analysis.firmaAdi || '');
  setField(`${context}Sektor`, analysis.sektor || '');
  setField(`${context}HizmetIhtiyaci`, analysis.hizmetIhtiyaci || '');
  setField(`${context}MevcutDurum`, analysis.mevcutDurum || '');
  setField(`${context}TeklifNotu`, analysis.teklifNotu || '');
  setField(`${context}OnerilenHizmetler`, analysis.onerilenHizmetler || []);
}

function AiAnalysisResult({ context, formData, resultKey }: { context: string; formData: OfferFormData; resultKey: string }) {
  const suggested = getArray(formData, `${context}OnerilenHizmetler`);
  const result = getString(formData, resultKey);

  if (!result && !getString(formData, `${context}Sektor`) && suggested.length === 0) {
    return null;
  }

  return (
    <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/40 rounded-xl space-y-3">
      <div className="flex items-center gap-2">
        <CheckIcon className="text-emerald-600 dark:text-emerald-400 w-4 h-4" />
        <p className="text-[13px] font-bold text-emerald-900 dark:text-emerald-200">AI Analiz Sonucu</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
        <SelectedInfo label="Firma" value={getString(formData, `${context}FirmaAdi`) || '—'} />
        <SelectedInfo label="Sektör" value={getString(formData, `${context}Sektor`) || '—'} />
        <SelectedInfo label="İhtiyaç" value={getString(formData, `${context}HizmetIhtiyaci`) || '—'} />
      </div>
      {result ? <p className="text-[12px] text-emerald-800 dark:text-emerald-200 leading-relaxed">{result}</p> : null}
      {getString(formData, `${context}TeklifNotu`) ? <p className="text-[11px] text-emerald-700 dark:text-emerald-300 leading-relaxed"><span className="font-bold">Teklif Notu:</span> {getString(formData, `${context}TeklifNotu`)}</p> : null}
      {suggested.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {suggested.map((service) => <span key={service} className="px-2 py-1 bg-white dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 rounded text-[10px] font-bold text-emerald-800 dark:text-emerald-200">{service}</span>)}
        </div>
      ) : null}
    </div>
  );
}

type AnalyzeAction = (options: { analyzedKey: string; context: string; resultKey: string; urlKey: string }) => Promise<void>;

function ServiceModule({ activeModule, aiLoadingKey, formData, onAnalyze, setField, toggleList }: { activeModule: string; aiLoadingKey: string | null; formData: OfferFormData; onAnalyze: AnalyzeAction; setField: SetOfferField; toggleList: ToggleOfferList }) {
  if (activeModule === 'web') return <WebModule aiLoadingKey={aiLoadingKey} formData={formData} onAnalyze={onAnalyze} setField={setField} toggleList={toggleList} />;
  if (activeModule === 'seo') return <SeoModule aiLoadingKey={aiLoadingKey} formData={formData} onAnalyze={onAnalyze} setField={setField} toggleList={toggleList} />;
  if (activeModule === 'google-ads') return <GoogleAdsModule aiLoadingKey={aiLoadingKey} formData={formData} onAnalyze={onAnalyze} setField={setField} toggleList={toggleList} />;
  if (activeModule === 'social-media') return <SocialMediaModule aiLoadingKey={aiLoadingKey} formData={formData} onAnalyze={onAnalyze} setField={setField} toggleList={toggleList} />;
  if (activeModule === 'social-ads') return <SocialAdsModule aiLoadingKey={aiLoadingKey} formData={formData} onAnalyze={onAnalyze} setField={setField} toggleList={toggleList} />;
  if (activeModule === 'production') return <ProductionModule formData={formData} setField={setField} toggleList={toggleList} />;
  if (activeModule === 'domain') return <DomainModule formData={formData} setField={setField} toggleList={toggleList} />;
  if (activeModule === 'hosting') return <HostingModule aiLoadingKey={aiLoadingKey} formData={formData} onAnalyze={onAnalyze} setField={setField} toggleList={toggleList} />;
  if (activeModule === 'trademark') return <TrademarkModule formData={formData} setField={setField} toggleList={toggleList} />;
  if (activeModule === 'premium360') return <Premium360Module formData={formData} setField={setField} toggleList={toggleList} />;
  return null;
}

function WebModule({ aiLoadingKey, formData, onAnalyze, setField, toggleList }: { aiLoadingKey: string | null; formData: OfferFormData; onAnalyze: AnalyzeAction; setField: SetOfferField; toggleList: ToggleOfferList }) {
  const hasWebsite = getBool(formData, 'webHasWebsite');
  const contentMgmt = getString(formData, 'webContentMgmt');
  const hasIntegration = getBool(formData, 'webHasIntegration');

  return (
    <ModuleShell serviceId="web" title="Web Sitesi" description="Web sitesi tercihleri ve planlama detayları">
      <ModuleSection title="Web Sitesi Var mı?">
        <ChoiceGrid value={String(hasWebsite)} onChange={(value) => setField('webHasWebsite', value === 'true')} options={[
          { id: 'true', title: 'Web Sitesi Var', desc: 'Mevcut site analiz edilecek', icon: <polyline points="20 6 9 17 4 12" /> },
          { id: 'false', title: 'Web Sitesi Yok', desc: 'Sıfırdan kurulum planlanacak', icon: <circle cx="12" cy="12" r="10" /> },
        ]} />
        {!hasWebsite ? <InfoPanel title="Özel Plan Gerekli" color="rose">Web sitesi olmayan firmalar için standart ADOS web analizi çalışmaz. Sıfırdan kurulum sürecine ait özel plan hazırlanacaktır.</InfoPanel> : null}
      </ModuleSection>

      {hasWebsite ? (
        <ModuleSection title="Web Sitesi Adresi">
          <div className="flex gap-2">
            <div className="flex-1"><TextInput label="" prefix="https://www." value={getString(formData, 'webUrl')} onChange={(value) => setField('webUrl', value)} placeholder="ornek.com" /></div>
            <button onClick={() => onAnalyze({ urlKey: 'webUrl', analyzedKey: 'webAnalyzed', resultKey: 'webAnalysisResult', context: 'web' })} disabled={aiLoadingKey === 'webAnalysisResult'} className={`self-end px-4 py-2 ${aiLoadingKey === 'webAnalysisResult' ? 'bg-violet-400 cursor-not-allowed' : 'bg-violet-600 hover:bg-violet-700'} text-white rounded-lg text-[12px] font-semibold transition-colors shrink-0 flex items-center gap-1.5 shadow-sm`}>{aiLoadingKey === 'webAnalysisResult' ? 'Analiz ediliyor...' : 'AI ile Analiz Et'}</button>
          </div>
          <AiAnalysisResult context="web" formData={formData} resultKey="webAnalysisResult" />
        </ModuleSection>
      ) : null}

      <ModuleSection title="Web Sitesi Yapısı" note="fiyatlandırma maliyet analizine göre şekillenecek">
        <ChoiceGrid value={getString(formData, 'webStructure')} onChange={(value) => setField('webStructure', value)} columns="md:grid-cols-2" options={[
          { id: 'standard', title: 'Standart Web Sitesi', desc: 'Kurumsal tanıtım, iletişim ve hizmet bilgi sayfaları' },
          { id: 'product', title: 'Ürün Tanıtım Sitesi', desc: 'Ürün kataloğu, filtreleme ve talep sepeti modülleri' },
          { id: 'service', title: 'Hizmet Sitesi', desc: 'Rezervasyon, randevu ve sektörel hizmet kurguları' },
          { id: 'association', title: 'Dernek / Vakıf Sitesi', desc: 'Üye yönetimi, bağış ve etkinlik takvimi' },
        ]} />
      </ModuleSection>

      <ModuleSection title="İçerik Yönetimi">
        <ChoiceGrid value={contentMgmt} onChange={(value) => setField('webContentMgmt', value)} options={[
          { id: 'admin-panel', title: 'Admin Paneli ile Yönetim', desc: 'Müşteri içerikleri kendi günceller' },
          { id: 'developer', title: 'Geliştirici Tarafından', desc: 'ADOS ekibi içerik güncellemesi yapar' },
        ]} />
        {contentMgmt === 'admin-panel' ? <TextInput label="İçerik Sayısı" value={getString(formData, 'webContentPageCount')} onChange={(value) => setField('webContentPageCount', value)} placeholder="25 sayfa içerik girişi" type="number" /> : <InfoPanel title="İçerik Firma Tarafından" color="amber">100 sayfa üzerindeki içerikler firma tarafından girilir. Yönetim paneli eğitimi ADOS tarafından verilir.</InfoPanel>}
      </ModuleSection>

      <ModuleSection title="Entegrasyon" note="muhasebe, ERP, CRM, ödeme altyapıları">
        <ChoiceGrid value={String(hasIntegration)} onChange={(value) => setField('webHasIntegration', value === 'true')} options={[
          { id: 'true', title: 'Entegrasyon Var', desc: 'Dış sistem bağlantısı gerekli' },
          { id: 'false', title: 'Entegrasyon Yok', desc: 'Standart kurulum' },
        ]} />
        {hasIntegration ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <TextInput label="Entegrasyon Sistemi" value={getString(formData, 'webIntegrationName')} onChange={(value) => setField('webIntegrationName', value)} placeholder="Logo, Mikro, Netsis, CRM..." />
            <SelectField label="Entegrasyon Tipi" value={getString(formData, 'webIntegrationType')} onChange={(value) => setField('webIntegrationType', value)} options={['API', 'XML', 'Webhook', 'Manuel aktarım']} />
          </div>
        ) : null}
      </ModuleSection>

      <ModuleSection title="Tasarım Stili" note="AI referans alacak">
        <ChoiceGrid value={getString(formData, 'webDesignStyle')} onChange={(value) => setField('webDesignStyle', value)} columns="md:grid-cols-4" options={[
          { id: 'minimal', title: 'Minimal', desc: 'Sade, beyaz alan odaklı' },
          { id: 'corporate', title: 'Kurumsal', desc: 'Profesyonel, güven verici' },
          { id: 'modern', title: 'Modern', desc: 'Gradient, dinamik hareket' },
          { id: 'custom', title: 'Özel Talep', desc: 'Özel referansa göre' },
        ]} />
      </ModuleSection>

      <ModuleSection title="Web Sitesi Dilleri" note={`${getArray(formData, 'webLangs').length} dil seçili`}>
        <LanguageButtons selected={getArray(formData, 'webLangs')} onToggle={(value) => toggleList('webLangs', value)} />
      </ModuleSection>

      <ModuleSection title="Rakip / Referans Siteler" note="AI rakip analizine yön verir">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[1, 2, 3].map((item) => <TextInput key={item} label={`Rakip ${item}`} prefix="https://www." value={getString(formData, `webCompetitor${item}`)} onChange={(value) => setField(`webCompetitor${item}`, value)} placeholder="rakip.com" />)}
        </div>
      </ModuleSection>

      <TextAreaField label="Ek Bilgi / Özel Talepler" value={getString(formData, 'webExtraNotes')} onChange={(value) => setField('webExtraNotes', value)} placeholder="Özel modül, ek sayfa, rezervasyon mantığı, farklı dil yapısı vb." />
    </ModuleShell>
  );
}

function SeoModule({ aiLoadingKey, formData, onAnalyze, setField, toggleList }: { aiLoadingKey: string | null; formData: OfferFormData; onAnalyze: AnalyzeAction; setField: SetOfferField; toggleList: ToggleOfferList }) {
  const seoTypes = getArray(formData, 'seoTypes');
  return (
    <ModuleShell serviceId="seo" title="SEO" description="Arama motoru optimizasyonu tercihleri ve hedefleme">
      <ModuleSection title="Web Sitesi Adresi">
        <div className="flex gap-2">
          <div className="flex-1"><TextInput label="" prefix="https://www." value={getString(formData, 'seoUrl')} onChange={(value) => setField('seoUrl', value)} placeholder="ornek.com" /></div>
          <button onClick={() => onAnalyze({ urlKey: 'seoUrl', analyzedKey: 'seoAnalyzed', resultKey: 'seoAnalysisResult', context: 'seo' })} disabled={aiLoadingKey === 'seoAnalysisResult'} className={`self-end px-4 py-2 ${aiLoadingKey === 'seoAnalysisResult' ? 'bg-violet-400 cursor-not-allowed' : 'bg-violet-600 hover:bg-violet-700'} text-white rounded-lg text-[12px] font-semibold transition-colors shrink-0 flex items-center gap-1.5 shadow-sm`}>{aiLoadingKey === 'seoAnalysisResult' ? 'Analiz ediliyor...' : 'AI ile Analiz Et'}</button>
        </div>
        <AiAnalysisResult context="seo" formData={formData} resultKey="seoAnalysisResult" />
      </ModuleSection>
      <ModuleSection title="SEO Dilleri" note={`${getArray(formData, 'seoLanguages').length} dil seçili`}>
        <LanguageButtons selected={getArray(formData, 'seoLanguages')} onToggle={(value) => toggleList('seoLanguages', value)} />
      </ModuleSection>
      <ModuleSection title="SEO Türü" note="birden fazla seçilebilir">
        <MultiChoiceGrid selected={seoTypes} onToggle={(value) => toggleList('seoTypes', value)} columns="md:grid-cols-2" options={[
          { id: 'local', title: 'Lokal SEO', desc: 'Şehir ve bölge odaklı yerel arama' },
          { id: 'national', title: 'Türkiye Geneli', desc: 'Ulusal çapta genel arama' },
          { id: 'global-lang', title: 'Global Dil Hedefli', desc: 'Çok dilli uluslararası arama' },
          { id: 'country', title: 'Ülke Hedefli', desc: 'Belirli ülkeler için optimize' },
        ]} />
        {seoTypes.includes('local') ? <div className="grid grid-cols-1 md:grid-cols-2 gap-3"><SelectField label="Şehir" value={getString(formData, 'seoCity')} onChange={(value) => setField('seoCity', value)} options={['İstanbul', 'Ankara', 'İzmir', 'Antalya', 'Bursa']} /><TextInput label="İlçe / Bölge" value={getString(formData, 'seoDistrict')} onChange={(value) => setField('seoDistrict', value)} placeholder="Kadıköy, Beşiktaş..." /></div> : null}
        {seoTypes.includes('country') || seoTypes.includes('global-lang') ? <TextInput label="Hedef Ülkeler" value={getString(formData, 'seoCountries')} onChange={(value) => setField('seoCountries', value)} placeholder="Almanya, İngiltere, Hollanda..." /> : null}
      </ModuleSection>
      <ModuleSection title="SEO Hedefleri" note="öncelikli çıktılar">
        <MultiChoiceGrid selected={getArray(formData, 'seoGoals')} onToggle={(value) => toggleList('seoGoals', value)} columns="md:grid-cols-5" options={[
          { id: 'traffic', title: 'Organik Trafik' },
          { id: 'leads', title: 'Lead Üretimi' },
          { id: 'brand', title: 'Marka Bilinirliği' },
          { id: 'ecommerce', title: 'E-Ticaret Dönüşüm' },
          { id: 'local-visibility', title: 'Yerel Görünürlük' },
        ]} />
      </ModuleSection>
      <ModuleSection title="İçerik Stratejisi">
        <ChoiceGrid value={getString(formData, 'seoContentStrategy')} onChange={(value) => setField('seoContentStrategy', value)} columns="md:grid-cols-3" options={[
          { id: 'agency', title: 'ADOS Ekibi Üretir', desc: 'Tüm blog ve sayfa içerikleri ADOS tarafından' },
          { id: 'customer', title: 'Müşteri Üretir', desc: 'İçerikler müşteri tarafından sağlanır' },
          { id: 'hybrid', title: 'Karma Model', desc: 'Strateji ADOS, içerik paylaşımlı' },
        ]} />
      </ModuleSection>
      <TextAreaField label="Ek Bilgi / Özel Talepler" value={getString(formData, 'seoExtraNotes')} onChange={(value) => setField('seoExtraNotes', value)} placeholder="Spesifik anahtar kelimeler, rakip sıralaması hedefleri..." />
    </ModuleShell>
  );
}

function GoogleAdsModule({ aiLoadingKey, formData, onAnalyze, setField, toggleList }: { aiLoadingKey: string | null; formData: OfferFormData; onAnalyze: AnalyzeAction; setField: SetOfferField; toggleList: ToggleOfferList }) {
  const budget = Number(getString(formData, 'adsBudget')) || 0;
  return (
    <ModuleShell serviceId="google-ads" title="Google Ads" description="Kampanya hedefleri, konum ayarları ve reklam yapılandırması">
      <ModuleSection title="Web Sitesi Adresi">
        <div className="flex gap-2">
          <div className="flex-1"><TextInput label="" prefix="https://www." value={getString(formData, 'adsUrl')} onChange={(value) => setField('adsUrl', value)} placeholder="ornek.com" /></div>
          <button onClick={() => onAnalyze({ urlKey: 'adsUrl', analyzedKey: 'adsAnalyzed', resultKey: 'adsAnalysisResult', context: 'ads' })} disabled={aiLoadingKey === 'adsAnalysisResult'} className={`self-end px-4 py-2 ${aiLoadingKey === 'adsAnalysisResult' ? 'bg-violet-400 cursor-not-allowed' : 'bg-violet-600 hover:bg-violet-700'} text-white rounded-lg text-[12px] font-semibold transition-colors shrink-0 shadow-sm`}>{aiLoadingKey === 'adsAnalysisResult' ? 'Analiz ediliyor...' : 'AI ile Analiz Et'}</button>
        </div>
        <AiAnalysisResult context="ads" formData={formData} resultKey="adsAnalysisResult" />
      </ModuleSection>
      <ModuleSection title="Kampanya Temel Ayarları">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <TextInput label="Toplam Reklam Bütçesi" value={getString(formData, 'adsBudget')} onChange={(value) => setField('adsBudget', value)} placeholder="10000" type="number" />
          <SelectField label="Para Birimi" value={getString(formData, 'adsCurrency')} onChange={(value) => setField('adsCurrency', value)} options={['TL', 'USD', 'EUR']} />
          <TextInput label="Kampanya Süresi (gün)" value={getString(formData, 'adsDuration')} onChange={(value) => setField('adsDuration', value)} placeholder="30" type="number" />
        </div>
        <MultiChoiceGrid selected={getArray(formData, 'adsActiveDays')} onToggle={(value) => toggleList('adsActiveDays', value)} columns="md:grid-cols-7" options={['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((day) => ({ id: day, title: day }))} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <TextInput label="Başlangıç Saati" value={getString(formData, 'adsStartHour')} onChange={(value) => setField('adsStartHour', value)} type="time" />
          <TextInput label="Bitiş Saati" value={getString(formData, 'adsEndHour')} onChange={(value) => setField('adsEndHour', value)} type="time" />
        </div>
        {budget > 0 ? <InfoPanel title="AI Canlı Tahmin" color="emerald">Tahmini gösterim: {(budget * 45).toLocaleString('tr-TR')} · tahmini tıklama: {Math.round(budget / 2.8).toLocaleString('tr-TR')} · tahmini dönüşüm: {Math.round((budget / 2.8) * 0.042).toLocaleString('tr-TR')}</InfoPanel> : null}
      </ModuleSection>
      <ModuleSection title="Reklam Dili" note={`${getArray(formData, 'adsLanguages').length} dil seçili`}>
        <LanguageButtons selected={getArray(formData, 'adsLanguages')} onToggle={(value) => toggleList('adsLanguages', value)} />
      </ModuleSection>
      <ModuleSection title="Hedef Lokasyon">
        <ChoiceGrid value={getString(formData, 'adsLocationMethod')} onChange={(value) => setField('adsLocationMethod', value)} options={[
          { id: 'region', title: 'Bölge Seçimi', desc: 'Ülke, şehir ve ilçe bazlı hedefleme' },
          { id: 'radius', title: 'Yarıçap Bazlı Hedefleme', desc: 'Merkez noktadan belirli yarıçap' },
        ]} />
        {getString(formData, 'adsLocationMethod') === 'radius' ? <div className="grid grid-cols-1 md:grid-cols-2 gap-3"><TextInput label="Merkez Adres" value={getString(formData, 'adsRadiusCenter')} onChange={(value) => setField('adsRadiusCenter', value)} placeholder="Kadıköy, İstanbul" /><TextInput label="Yarıçap (km)" value={getString(formData, 'adsRadiusKm')} onChange={(value) => setField('adsRadiusKm', value)} placeholder="15" type="number" /></div> : <TextInput label="Hedef Bölgeler" value={getString(formData, 'adsRegions')} onChange={(value) => setField('adsRegions', value)} placeholder="İstanbul, Ankara, İzmir..." />}
      </ModuleSection>
      <ModuleSection title="Kampanya Hedefi" note="birden fazla seçilebilir">
        <MultiChoiceGrid selected={getArray(formData, 'adsGoals')} onToggle={(value) => toggleList('adsGoals', value)} columns="md:grid-cols-4" options={['Online Satış', 'Lead Toplama', 'Telefon Aramaları', 'WhatsApp Mesajları', 'Web Sitesi Trafiği', 'Mağaza Ziyaretleri', 'Marka Bilinirliği', 'Uygulama İndirme'].map((title) => ({ id: title, title }))} />
      </ModuleSection>
      <ModuleSection title="Dönüşüm Takibi Altyapısı">
        <MultiChoiceGrid selected={getArray(formData, 'adsConversionTracking')} onToggle={(value) => toggleList('adsConversionTracking', value)} columns="md:grid-cols-2" options={['Google Analytics 4', 'Google Ads Pixel', 'Google Tag Manager', 'Call Tracking'].map((title) => ({ id: title, title, desc: 'Reklam verimini ölçmek için' }))} />
      </ModuleSection>
      <ModuleSection title="Google Ads Hesap Erişimi">
        <ChoiceGrid value={getString(formData, 'adsHasAccount')} onChange={(value) => setField('adsHasAccount', value)} options={[
          { id: 'yes', title: 'Evet', desc: 'Mevcut hesaba erişim eklenecek' },
          { id: 'no', title: 'Hayır', desc: 'Yeni hesap kurulumu yapılacak' },
        ]} />
      </ModuleSection>
      <InfoPanel title="Operasyonel Süreç Bilgisi">Google Ads erişimi ve entegrasyon süreci operasyon ekibine görev olarak aktarılır.</InfoPanel>
    </ModuleShell>
  );
}

function SocialMediaModule({ aiLoadingKey, formData, onAnalyze, setField, toggleList }: { aiLoadingKey: string | null; formData: OfferFormData; onAnalyze: AnalyzeAction; setField: SetOfferField; toggleList: ToggleOfferList }) {
  const platforms = getArray(formData, 'smPlatforms');
  return (
    <ModuleShell serviceId="social-media" title="Sosyal Medya Yönetimi" description="Platform seçimi, içerik üretimi ve yönetim paketi">
      <ModuleSection title="Platform Seçimi" note={`${platforms.length} platform seçili`}>
        <MultiChoiceGrid selected={platforms} onToggle={(value) => toggleList('smPlatforms', value)} columns="md:grid-cols-5" options={SOCIAL_PLATFORMS.map((platform) => ({ id: platform.id, title: platform.label, gradient: platform.gradient }))} />
      </ModuleSection>
      {platforms.length > 0 ? platforms.map((platformId) => {
        const platform = SOCIAL_PLATFORMS.find((item) => item.id === platformId);
        return (
          <div key={platformId} className="p-4 bg-gray-50 dark:bg-[#17181f] border border-gray-200 dark:border-gray-600/50 rounded-xl space-y-3">
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 ${platform?.gradient || 'bg-violet-600'} rounded-lg flex items-center justify-center shrink-0 text-white text-[11px] font-bold`}>{platform?.label.charAt(0)}</div>
              <h5 className="text-[13px] font-bold text-gray-900 dark:text-gray-100">{platform?.label} Hesap Bilgileri</h5>
            </div>
            <div className="flex gap-2">
              <div className="flex-1"><TextInput label="" prefix={`${platformId}.com/`} value={getString(formData, `smUrl_${platformId}`)} onChange={(value) => setField(`smUrl_${platformId}`, value)} placeholder="kullanici_adi" /></div>
              <button onClick={() => onAnalyze({ urlKey: `smUrl_${platformId}`, analyzedKey: `smAnalyzed_${platformId}`, resultKey: `smAnalysisResult_${platformId}`, context: `sm${platformId}` })} disabled={aiLoadingKey === `smAnalysisResult_${platformId}`} className={`self-end px-4 py-2 ${aiLoadingKey === `smAnalysisResult_${platformId}` ? 'bg-violet-400 cursor-not-allowed' : 'bg-violet-600 hover:bg-violet-700'} text-white rounded-lg text-[12px] font-semibold transition-colors shrink-0 shadow-sm`}>{aiLoadingKey === `smAnalysisResult_${platformId}` ? 'Analiz ediliyor...' : 'AI Analiz'}</button>
            </div>
            <AiAnalysisResult context={`sm${platformId}`} formData={formData} resultKey={`smAnalysisResult_${platformId}`} />
          </div>
        );
      }) : <InfoPanel title="Platform Seçimi Gerekli" color="gray">Önce yönetilecek sosyal medya platformlarını seçin.</InfoPanel>}
      <ModuleSection title="İçerik Dili" note={`${getArray(formData, 'smLanguages').length} dil seçili`}>
        <LanguageButtons selected={getArray(formData, 'smLanguages')} onToggle={(value) => toggleList('smLanguages', value)} />
      </ModuleSection>
      <ModuleSection title="Hedef Kitle">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <SelectField label="Yaş Aralığı" value={getString(formData, 'smTargetAgeRange')} onChange={(value) => setField('smTargetAgeRange', value)} options={['18-24', '25-34', '35-44', '45-54', '55+']} />
          <ChoiceGrid value={getString(formData, 'smTargetGender')} onChange={(value) => setField('smTargetGender', value)} columns="md:grid-cols-3" options={[{ id: 'all', title: 'Tümü', desc: 'Genel hedef' }, { id: 'female', title: 'Kadın', desc: 'Kadın odaklı' }, { id: 'male', title: 'Erkek', desc: 'Erkek odaklı' }]} />
        </div>
      </ModuleSection>
      <ModuleSection title="İçerik Paketi">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <TextInput label="Aylık Post Sayısı" value={getString(formData, 'smPostCount')} onChange={(value) => setField('smPostCount', value)} placeholder="12" type="number" />
          <TextInput label="Aylık Story/Reels" value={getString(formData, 'smStoryCount')} onChange={(value) => setField('smStoryCount', value)} placeholder="20" type="number" />
          <SelectField label="Tone of Voice" value={getString(formData, 'smTone')} onChange={(value) => setField('smTone', value)} options={['Kurumsal', 'Samimi', 'Premium', 'Eğlenceli', 'Bilgilendirici']} />
        </div>
        <MultiChoiceGrid selected={getArray(formData, 'smContentTypes')} onToggle={(value) => toggleList('smContentTypes', value)} columns="md:grid-cols-4" options={['Görsel Tasarım', 'Reels', 'Carousel', 'Blog Duyurusu', 'Kampanya', 'Video Kurgu', 'Topluluk Yönetimi', 'Raporlama'].map((title) => ({ id: title, title }))} />
      </ModuleSection>
      <TextAreaField label="Ek Bilgi / Özel Talepler" value={getString(formData, 'smExtraNotes')} onChange={(value) => setField('smExtraNotes', value)} placeholder="İçerik tonu, özel günler, sektör hassasiyetleri..." />
    </ModuleShell>
  );
}

function SocialAdsModule({ aiLoadingKey, formData, onAnalyze, setField, toggleList }: { aiLoadingKey: string | null; formData: OfferFormData; onAnalyze: AnalyzeAction; setField: SetOfferField; toggleList: ToggleOfferList }) {
  const budget = Number(getString(formData, 'saBudget')) || 0;
  return (
    <ModuleShell serviceId="social-ads" title="Sosyal Medya Reklam Yönetimi" description="Meta, LinkedIn, TikTok reklam kampanyaları ve hedefleme">
      <ModuleSection title="Hesap / Sayfa URL">
        <div className="flex gap-2">
          <div className="flex-1"><TextInput label="" prefix="instagram.com/" value={getString(formData, 'saUrl')} onChange={(value) => setField('saUrl', value)} placeholder="kullanici_adi" /></div>
          <button onClick={() => onAnalyze({ urlKey: 'saUrl', analyzedKey: 'saAnalyzed', resultKey: 'saAnalysisResult', context: 'sa' })} disabled={aiLoadingKey === 'saAnalysisResult'} className={`self-end px-4 py-2 ${aiLoadingKey === 'saAnalysisResult' ? 'bg-violet-400 cursor-not-allowed' : 'bg-violet-600 hover:bg-violet-700'} text-white rounded-lg text-[12px] font-semibold transition-colors shrink-0 shadow-sm`}>{aiLoadingKey === 'saAnalysisResult' ? 'Analiz ediliyor...' : 'AI Analiz'}</button>
        </div>
        <AiAnalysisResult context="sa" formData={formData} resultKey="saAnalysisResult" />
      </ModuleSection>
      <ModuleSection title="Reklam Platformları" note={`${getArray(formData, 'saPlatforms').length} platform seçili`}>
        <MultiChoiceGrid selected={getArray(formData, 'saPlatforms')} onToggle={(value) => toggleList('saPlatforms', value)} columns="md:grid-cols-4" options={SOCIAL_PLATFORMS.map((platform) => ({ id: platform.id, title: platform.label, gradient: platform.gradient }))} />
      </ModuleSection>
      <ModuleSection title="Kampanya Hedefi" note="birden fazla seçilebilir">
        <MultiChoiceGrid selected={getArray(formData, 'saGoals')} onToggle={(value) => toggleList('saGoals', value)} columns="md:grid-cols-2" options={['Marka Bilinirliği', 'Lead (Form) Toplama', 'WhatsApp Mesajları', 'DM (Instagram / Facebook)', 'Web Sitesi Ziyaretleri', 'Online Satış'].map((title) => ({ id: title, title, desc: 'Kampanya amacı' }))} />
      </ModuleSection>
      <ModuleSection title="Bütçe ve Süre">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <TextInput label="Aylık Reklam Bütçesi" value={getString(formData, 'saBudget')} onChange={(value) => setField('saBudget', value)} placeholder="15000" type="number" />
          <SelectField label="Para Birimi" value={getString(formData, 'saCurrency')} onChange={(value) => setField('saCurrency', value)} options={['TL', 'USD', 'EUR']} />
          <TextInput label="Süre (gün)" value={getString(formData, 'saDuration')} onChange={(value) => setField('saDuration', value)} placeholder="30" type="number" />
        </div>
        {budget > 0 ? <InfoPanel title="Reklam Tahmini" color="emerald">Tahmini erişim: {(budget * 28).toLocaleString('tr-TR')} · tahmini tıklama: {Math.round(budget * 28 * 0.021).toLocaleString('tr-TR')} · tahmini lead: {Math.round(budget * 28 * 0.021 * 0.09).toLocaleString('tr-TR')}</InfoPanel> : null}
      </ModuleSection>
      <ModuleSection title="Hedef Kitle ve Kreatif">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <TextInput label="Hedef Kitle Tanımı" value={getString(formData, 'saAudience')} onChange={(value) => setField('saAudience', value)} placeholder="25-45, turizm ilgisi, İstanbul..." />
          <SelectField label="Kreatif Durumu" value={getString(formData, 'saCreativeStatus')} onChange={(value) => setField('saCreativeStatus', value)} options={['ADOS hazırlayacak', 'Müşteri sağlayacak', 'Karma model']} />
        </div>
        <MultiChoiceGrid selected={getArray(formData, 'saTracking')} onToggle={(value) => toggleList('saTracking', value)} columns="md:grid-cols-3" options={['Meta Pixel', 'Conversion API', 'UTM Takibi', 'WhatsApp Takibi', 'Lead Form CRM', 'Raporlama'].map((title) => ({ id: title, title }))} />
      </ModuleSection>
      <TextAreaField label="Ek Bilgi / Özel Talepler" value={getString(formData, 'saExtraNotes')} onChange={(value) => setField('saExtraNotes', value)} placeholder="Kampanya dönemi, kreatif yönü, teklif/indirim bilgisi..." />
    </ModuleShell>
  );
}

function ProductionModule({ formData, setField, toggleList }: { formData: OfferFormData; setField: SetOfferField; toggleList: ToggleOfferList }) {
  return (
    <ModuleShell serviceId="production" title="Prodüksiyon & Fotoğraf" description="Çekim türü, ekipman, lokasyon ve teslim formatları">
      <ModuleSection title="Prodüksiyon Türü">
        <ChoiceGrid value={getString(formData, 'productionType')} onChange={(value) => setField('productionType', value)} columns="md:grid-cols-3" options={[
          { id: 'photo', title: 'Fotoğraf Çekimi', desc: 'Ürün, mekan, ekip ve kurumsal çekim' },
          { id: 'video', title: 'Video Çekimi', desc: 'Tanıtım filmi, reels, kısa video' },
          { id: 'photo-video', title: 'Fotoğraf + Video', desc: 'Karma prodüksiyon paketi' },
        ]} />
      </ModuleSection>
      <ModuleSection title="Çekim Planı">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <TextInput label="Çekim Günü" value={getString(formData, 'productionDays')} onChange={(value) => setField('productionDays', value)} placeholder="1" type="number" />
          <TextInput label="Lokasyon Sayısı" value={getString(formData, 'productionLocations')} onChange={(value) => setField('productionLocations', value)} placeholder="2" type="number" />
          <SelectField label="Lokasyon" value={getString(formData, 'productionLocationType')} onChange={(value) => setField('productionLocationType', value)} options={['Müşteri lokasyonu', 'Stüdyo', 'Dış mekan', 'Karma']} />
        </div>
      </ModuleSection>
      <ModuleSection title="Teslim Formatları">
        <MultiChoiceGrid selected={getArray(formData, 'productionDeliverables')} onToggle={(value) => toggleList('productionDeliverables', value)} columns="md:grid-cols-4" options={['Ham Fotoğraf', 'Retouch', 'Reels', 'Tanıtım Filmi', 'Drone Çekimi', 'Kurgu', 'Altyazı', 'Dikey Format'].map((title) => ({ id: title, title }))} />
      </ModuleSection>
      <ModuleSection title="Ekip ve Ekipman">
        <MultiChoiceGrid selected={getArray(formData, 'productionTeam')} onToggle={(value) => toggleList('productionTeam', value)} columns="md:grid-cols-3" options={['Fotoğrafçı', 'Videographer', 'Drone Pilot', 'Işık Ekibi', 'Makyaj/Stilist', 'Sanat Yönetmeni'].map((title) => ({ id: title, title }))} />
      </ModuleSection>
      <TextAreaField label="Prodüksiyon Notu" value={getString(formData, 'productionNotes')} onChange={(value) => setField('productionNotes', value)} placeholder="Çekim briefi, referans, teslim tarihi, özel istekler..." />
    </ModuleShell>
  );
}

function DomainModule({ formData, setField, toggleList }: { formData: OfferFormData; setField: SetOfferField; toggleList: ToggleOfferList }) {
  return (
    <ModuleShell serviceId="domain" title="Domain" description="Alan adı araştırma, kayıt ve transfer işlemleri">
      <ModuleSection title="Domain İşlem Türü">
        <ChoiceGrid value={getString(formData, 'domainAction')} onChange={(value) => setField('domainAction', value)} columns="md:grid-cols-3" options={[
          { id: 'new', title: 'Yeni Domain Kaydı', desc: 'Müşteri için yeni alan adı alınacak' },
          { id: 'transfer', title: 'Domain Transferi', desc: 'Mevcut domain ADOS yönetimine geçecek' },
          { id: 'dns', title: 'DNS Yönetimi', desc: 'Sadece DNS ve teknik yönlendirme' },
        ]} />
      </ModuleSection>
      <ModuleSection title="Domain Araştırma">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <TextInput label="İstenen Alan Adı" prefix="https://www." value={getString(formData, 'domainName')} onChange={(value) => setField('domainName', value)} placeholder="markaadi.com" />
          <SelectField label="Uzantı" value={getString(formData, 'domainExtension')} onChange={(value) => setField('domainExtension', value)} options={['.com', '.com.tr', '.net', '.org', '.co', '.io']} />
        </div>
        <button onClick={() => setField('domainChecked', true)} className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-[12px] font-semibold transition-colors shadow-sm">Uygunluk Kontrol Et</button>
        {getBool(formData, 'domainChecked') ? <InfoPanel title="Domain Uygunluk Özeti" color="emerald">Seçilen alan adı uygun görünüyor. Alternatif uzantılar da teklif özetine eklenecek.</InfoPanel> : null}
      </ModuleSection>
      <ModuleSection title="Ek Hizmetler">
        <MultiChoiceGrid selected={getArray(formData, 'domainAddons')} onToggle={(value) => toggleList('domainAddons', value)} columns="md:grid-cols-4" options={['Whois Gizliliği', 'DNS Yönetimi', 'Kurumsal E-posta', 'SSL', 'Yenileme Takibi', 'Transfer Kilidi', 'Nameserver Kurulumu', 'Yönlendirme'].map((title) => ({ id: title, title }))} />
      </ModuleSection>
      <InfoPanel title="Sipariş Özeti" color="sky">Domain uygunluk, kayıt/transfer, DNS ve yenileme takibi operasyon ekibine aktarılacak.</InfoPanel>
    </ModuleShell>
  );
}

function HostingModule({ aiLoadingKey, formData, onAnalyze, setField, toggleList }: { aiLoadingKey: string | null; formData: OfferFormData; onAnalyze: AnalyzeAction; setField: SetOfferField; toggleList: ToggleOfferList }) {
  return (
    <ModuleShell serviceId="hosting" title="Hosting & Sunucu" description="Paylaşımlı hosting, VPS ve co-location yapıları">
      <ModuleSection title="Mevcut Hosting Analizi">
        <div className="flex gap-2">
          <div className="flex-1"><TextInput label="" prefix="https://" value={getString(formData, 'hostingDomain')} onChange={(value) => setField('hostingDomain', value)} placeholder="armad.com" /></div>
          <button onClick={() => onAnalyze({ urlKey: 'hostingDomain', analyzedKey: 'hostingAnalyzed', resultKey: 'hostingAnalysisResult', context: 'hosting' })} disabled={aiLoadingKey === 'hostingAnalysisResult'} className={`self-end px-4 py-2 ${aiLoadingKey === 'hostingAnalysisResult' ? 'bg-violet-400 cursor-not-allowed' : 'bg-violet-600 hover:bg-violet-700'} text-white rounded-lg text-[12px] font-semibold transition-colors shrink-0 shadow-sm`}>{aiLoadingKey === 'hostingAnalysisResult' ? 'Analiz ediliyor...' : 'AI Analiz Et'}</button>
        </div>
        <AiAnalysisResult context="hosting" formData={formData} resultKey="hostingAnalysisResult" />
      </ModuleSection>
      <ModuleSection title="Kurulum Tipi">
        <ChoiceGrid value={getString(formData, 'hostingSetupType')} onChange={(value) => setField('hostingSetupType', value)} columns="md:grid-cols-4" options={[
          { id: 'shared', title: 'Paylaşımlı Hosting', desc: 'Kurumsal site için ekonomik paket' },
          { id: 'vps', title: 'VPS', desc: 'Performans ve kaynak ayrımı' },
          { id: 'colocation', title: 'Co-location', desc: 'Fiziksel sunucu barındırma' },
          { id: 'customer-server', title: 'Müşteri Sunucusu', desc: 'Mevcut altyapı yönetimi' },
        ]} />
      </ModuleSection>
      <ModuleSection title="Paket ve Kaynaklar">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <SelectField label="Paket" value={getString(formData, 'hostingPackage')} onChange={(value) => setField('hostingPackage', value)} options={['Başlangıç', 'Kurumsal', 'Profesyonel', 'Özel']} />
          <TextInput label="Disk Alanı" value={getString(formData, 'hostingStorage')} onChange={(value) => setField('hostingStorage', value)} placeholder="50 GB" />
          <TextInput label="Trafik" value={getString(formData, 'hostingTraffic')} onChange={(value) => setField('hostingTraffic', value)} placeholder="Limitsiz" />
          <TextInput label="E-posta Hesabı" value={getString(formData, 'hostingEmailCount')} onChange={(value) => setField('hostingEmailCount', value)} placeholder="10" type="number" />
        </div>
      </ModuleSection>
      <ModuleSection title="Ek Güvenlik ve Operasyon">
        <MultiChoiceGrid selected={getArray(formData, 'hostingAddons')} onToggle={(value) => toggleList('hostingAddons', value)} columns="md:grid-cols-4" options={['SSL', 'Günlük Yedek', 'WAF', 'CDN', 'Uptime İzleme', 'Malware Taraması', 'E-posta Güvenliği', 'Acil Destek'].map((title) => ({ id: title, title }))} />
      </ModuleSection>
      <ModuleSection title="Periyot ve Özet">
        <ChoiceGrid value={getString(formData, 'hostingPeriod')} onChange={(value) => setField('hostingPeriod', value)} columns="md:grid-cols-3" options={[{ id: '12', title: '12 Ay', desc: 'Standart yıllık yenileme' }, { id: '24', title: '24 Ay', desc: 'İki yıllık avantajlı dönem' }, { id: '36', title: '36 Ay', desc: 'Uzun dönem kilitleme' }]} />
      </ModuleSection>
    </ModuleShell>
  );
}

function TrademarkModule({ formData, setField, toggleList }: { formData: OfferFormData; setField: SetOfferField; toggleList: ToggleOfferList }) {
  return (
    <ModuleShell serviceId="trademark" title="Marka Tescili" description="TürkPatent ve uluslararası marka koruma başvuruları">
      <ModuleSection title="Marka Bilgisi">
        <TextInput label="Marka Adı" value={getString(formData, 'tmBrandName')} onChange={(value) => setField('tmBrandName', value)} placeholder="Arma Digital" />
        <ChoiceGrid value={getString(formData, 'tmBrandType')} onChange={(value) => setField('tmBrandType', value)} columns="md:grid-cols-3" options={[
          { id: 'word', title: 'Kelime Markası', desc: 'Sadece yazı, font bağımsız' },
          { id: 'logo', title: 'Logo / Şekil', desc: 'Sadece grafik veya şekil' },
          { id: 'combined', title: 'Kombine', desc: 'Logo + yazı koruması' },
        ]} />
      </ModuleSection>
      {getString(formData, 'tmBrandName') ? <ModuleSection title="Benzerlik Kontrolü"><button onClick={() => setField('tmSimilarityChecked', true)} className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-[12px] font-semibold transition-colors shadow-sm">TürkPatent Benzerlik Kontrolü</button>{getBool(formData, 'tmSimilarityChecked') ? <InfoPanel title="Benzerlik Sonucu" color="emerald">Yüksek riskli birebir eşleşme bulunmadı. Sınıf bazlı detaylı inceleme önerilir.</InfoPanel> : null}</ModuleSection> : null}
      <ModuleSection title="Nice Sınıfları">
        <MultiChoiceGrid selected={getArray(formData, 'tmNiceClasses')} onToggle={(value) => toggleList('tmNiceClasses', value)} columns="md:grid-cols-4" options={['35 Reklam', '42 Yazılım', '41 Eğitim', '25 Giyim', '43 Restoran', '44 Sağlık', '39 Turizm', '09 Dijital Ürün'].map((title) => ({ id: title, title }))} />
      </ModuleSection>
      <ModuleSection title="Koruma Kapsamı">
        <ChoiceGrid value={getString(formData, 'tmCoverageScope')} onChange={(value) => setField('tmCoverageScope', value)} columns="md:grid-cols-3" options={[
          { id: 'turkey', title: 'Türkiye', desc: 'TürkPatent başvurusu' },
          { id: 'eu', title: 'Avrupa Birliği', desc: 'EUIPO başvurusu' },
          { id: 'international', title: 'Uluslararası', desc: 'Madrid protokolü' },
        ]} />
      </ModuleSection>
      <InfoPanel title="Operasyon Bilgisi" color="violet">Marka sınıfları ve başvuru kapsamı hukuk/operasyon ekibine görev olarak aktarılır.</InfoPanel>
    </ModuleShell>
  );
}

function Premium360Module({ formData, setField, toggleList }: { formData: OfferFormData; setField: SetOfferField; toggleList: ToggleOfferList }) {
  return (
    <ModuleShell serviceId="premium360" title="ADOS Premium 360" description="Ultra premium marka yönetim hizmeti" premium>
      <div className="relative overflow-hidden rounded-2xl border border-amber-300/40 dark:border-amber-500/30 shadow-2xl">
        <div className="relative bg-gradient-to-br from-[#0a0e1a] via-[#1a1530] to-[#0f0820] p-8 md:p-10">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div className="flex items-center gap-2.5">
                <div className="relative w-12 h-12 bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 rounded-lg flex items-center justify-center shadow-lg">
                  <Icon className="text-white w-6 h-6">{SERVICE_ICONS.premium360}</Icon>
                </div>
                <div>
                  <div className="text-[10px] font-bold tracking-[0.2em] text-amber-400 uppercase">ADOS Premium</div>
                  <div className="text-[11px] text-white/60">Exclusive Brand Management</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 border border-amber-400/30 rounded-full backdrop-blur-sm">
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-amber-300 tracking-wider">VIP ACCESS</span>
              </div>
            </div>
            <h1 className="text-[32px] md:text-[42px] font-black leading-none tracking-tight mb-2">
              <span className="bg-gradient-to-r from-amber-300 via-amber-100 to-amber-300 bg-clip-text text-transparent">Premium 360°</span>
            </h1>
            <p className="text-[14px] text-white/70 leading-relaxed max-w-2xl">Markanın dijital evreninin tamamını tek bir AI destekli platformdan yöneten ultra premium marka yönetim hizmeti.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6 mt-6 border-t border-white/10">
              {['10+ Entegre Hizmet', '24/7 AI Destek', '3 Uzman Ekip', '2sa SLA Yanıt'].map((item) => <div key={item} className="text-center p-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl"><div className="text-[18px] font-bold text-white">{item.split(' ')[0]}</div><div className="text-[9px] font-semibold text-amber-300 uppercase tracking-wider mt-0.5">{item.replace(item.split(' ')[0], '').trim()}</div></div>)}
            </div>
          </div>
        </div>
        <div className="h-1 bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-5">
          <ModuleSection title="Premium Kapsam Sütunları">
            <MultiChoiceGrid selected={getArray(formData, 'p360Pillars')} onToggle={(value) => toggleList('p360Pillars', value)} columns="md:grid-cols-2" options={['Web + SEO', 'Google Ads', 'Sosyal Medya', 'Prodüksiyon', 'Hosting + Domain', 'Marka Tescili'].map((title) => ({ id: title, title }))} />
          </ModuleSection>
        </div>
        <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-5">
          <ModuleSection title="Öncelik Seviyesi">
            <ChoiceGrid value={getString(formData, 'p360Priority')} onChange={(value) => setField('p360Priority', value)} columns="md:grid-cols-3" options={[
              { id: 'vip', title: 'VIP', desc: 'Öncelikli SLA' },
              { id: 'executive', title: 'Executive', desc: 'Haftalık yönetim' },
              { id: 'standard', title: 'Standart', desc: 'Aylık planlama' },
            ]} />
          </ModuleSection>
          <TextAreaField label="Dedicated Team Notu" value={getString(formData, 'p360TeamNote')} onChange={(value) => setField('p360TeamNote', value)} placeholder="Marka yöneticisi, performans uzmanı ve kreatif ekip beklentileri..." />
        </div>
      </div>
      <div className="bg-gradient-to-br from-[#0a0e1a] via-[#1a1530] to-[#0f0820] border border-amber-400/40 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="text-[10px] font-bold tracking-[0.2em] text-amber-400 uppercase">Premium Kabul</div>
            <div className="text-[18px] font-black text-white">ADOS Premium 360 teklif kapsamı hazır</div>
            <p className="text-[11px] text-white/60 mt-1">Bu paket seçili tüm hizmetleri tek premium yönetim çatısında birleştirir.</p>
          </div>
          <button className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg font-bold text-[12px] shadow-lg">Premium Paketi Onayla</button>
        </div>
      </div>
    </ModuleShell>
  );
}

function OfferSummaryLegacy({ selectedCustomer, selectedServices, onBack, onCancel }: { selectedCustomer: Customer | null; selectedServices: string[]; onBack: () => void; onCancel: () => void }) {
  return (
    <div className="relative min-h-[calc(100vh-120px)] space-y-4 md:space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shrink-0"><BackIcon className="text-gray-600 dark:text-gray-400 w-4 h-4" /></button>
          <div>
            <h1 className="text-[19px] font-bold text-gray-900 dark:text-gray-100 leading-tight">Özet & Onay</h1>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">Teklif gönderimi öncesi müşteri ve hizmet özetini kontrol edin.</p>
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-5">
        <p className="text-[11px] font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide mb-4">Teklif Özeti</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SelectedInfo label="Müşteri" value={selectedCustomer?.company || '—'} />
          <SelectedInfo label="Yetkili" value={selectedCustomer?.contact || '—'} />
          <SelectedInfo label="Seçilen Hizmet" value={`${selectedServices.length} modül`} />
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {selectedServices.map((id) => <Bdg key={id} txt={serviceById(id).name} c="indigo" />)}
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 pt-2">
        <button onClick={onCancel} className="px-4 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-[12px]">İptal</button>
        <button className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2 text-[12px] shadow-sm">
          Teklifi Oluştur
          <SendIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function OfferSummary({ selectedCustomer, selectedServices, onBack, onCancel }: { selectedCustomer: Customer | null; selectedServices: string[]; onBack: () => void; onCancel: () => void }) {
  const services = selectedServices.map((id) => serviceById(id));
  const totals = services.reduce((acc, service) => {
    const price = computeServicePrice(service.id);
    acc.oneTime += price.oneTime;
    acc.monthly += price.monthly;
    return acc;
  }, { oneTime: 0, monthly: 0 });
  const hasPremium = selectedServices.includes('premium360');
  const offerNo = `TKLF-${new Date().getFullYear()}-${String(7400 + selectedServices.length * 137).padStart(4, '0')}`;

  return (
    <div className="relative min-h-[calc(100vh-120px)] space-y-4 md:space-y-5">
      <div className="relative overflow-hidden rounded-2xl border border-amber-300/40 dark:border-amber-500/30 shadow-2xl">
        <div className="relative bg-gradient-to-br from-[#0a0e1a] via-[#1a1530] to-[#0f0820] p-6 md:p-8">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-violet-600/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
          <div className="relative">
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <div className="flex items-center gap-2.5">
                <button onClick={onBack} className="w-9 h-9 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/20 transition-colors flex items-center justify-center">
                  <BackIcon className="text-white w-4 h-4" />
                </button>
                <div>
                  <div className="text-[10px] font-bold tracking-[0.2em] text-amber-400 uppercase">ADOS Teklif Sistemi</div>
                  <div className="text-[11px] text-white/60">Özet & Onay · Son Aşama</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-400/30 rounded-full backdrop-blur-sm">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-emerald-300 tracking-wider">{services.length} HİZMET HAZIR</span>
              </div>
            </div>

            <div className="mb-5">
              <h1 className="text-[28px] md:text-[36px] font-black leading-none tracking-tight mb-2">
                <span className="bg-gradient-to-r from-amber-300 via-amber-100 to-amber-300 bg-clip-text text-transparent">Teklif Özeti</span>
              </h1>
              <p className="text-[13px] text-white/70 leading-relaxed max-w-2xl">
                {(selectedCustomer?.company || 'Müşteri')} için hazırlanan {services.length} hizmetlik kapsamlı teklif. Müşteriye gönderilmeden önce tüm kalemleri kontrol edin.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
              <div className="p-3.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
                <div className="text-[9px] font-bold text-amber-400/80 uppercase tracking-widest mb-1.5">MÜŞTERİ</div>
                {selectedCustomer ? (
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center shrink-0 shadow-md">
                      <span className="text-white text-[14px] font-bold">{selectedCustomer.company.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[14px] font-bold text-white truncate">{selectedCustomer.company}</div>
                      <div className="text-[11px] text-white/60 truncate">{selectedCustomer.contact} · {selectedCustomer.segment}</div>
                    </div>
                  </div>
                ) : (
                  <p className="text-[12px] text-white/50">Müşteri seçilmedi</p>
                )}
              </div>
              <div className="p-3.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
                <div className="text-[9px] font-bold text-amber-400/80 uppercase tracking-widest mb-1.5">TEKLİF NO</div>
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="text-[14px] font-bold font-mono text-white">{offerNo}</div>
                    <div className="text-[11px] text-white/60">{new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-500/10 border border-amber-400/30 rounded">
                    <span className="text-[9px] font-bold text-amber-300 uppercase tracking-wider">TASLAK</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-5 border-t border-white/10">
              <SummaryHeroMetric value={String(services.length)} label="Hizmet" />
              <SummaryHeroMetric value={formatCurrency(totals.oneTime)} label="Tek Seferlik" />
              <SummaryHeroMetric value={formatCurrency(totals.monthly)} label="Aylık Tekrar" active={totals.monthly > 0} />
              <SummaryHeroMetric value={hasPremium ? 'Premium' : 'Standart'} label="Paket Seviyesi" />
            </div>
          </div>
        </div>
        <div className="h-1 bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500" />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-[15px] font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <FileIcon className="text-amber-600 dark:text-amber-400 w-4 h-4" />
            Hizmet Detayları
          </h3>
          <span className="text-[10px] text-gray-500 dark:text-gray-400">Teklif kapsamı ve fiyat özeti</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {services.map((service, index) => {
            const price = computeServicePrice(service.id);
            const isPremium = service.id === 'premium360';
            return (
              <div key={service.id} className={`relative overflow-hidden rounded-xl border ${isPremium ? 'bg-gradient-to-br from-[#0a0e1a] via-[#1a1530] to-[#0f0820] border-amber-400/40 shadow-lg' : 'bg-white dark:bg-[#1e1f26] border-gray-200 dark:border-gray-600/50'} transition-all`}>
                {isPremium ? (
                  <>
                    <div className="absolute -top-16 -right-16 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
                  </>
                ) : null}
                <div className="relative p-4 flex items-start gap-3">
                  <div className={`w-7 h-7 ${isPremium ? 'bg-gradient-to-br from-amber-400 to-amber-600' : 'bg-violet-100 dark:bg-violet-500/20 border border-violet-200 dark:border-violet-500/30'} rounded-lg flex items-center justify-center shrink-0`}>
                    <span className={`text-[11px] font-bold ${isPremium ? 'text-white' : 'text-violet-700 dark:text-violet-300'}`}>{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h4 className={`text-[14px] font-bold ${isPremium ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}>{service.name}</h4>
                      {isPremium ? <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500 text-white">PREMIUM</span> : null}
                      <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${isPremium ? 'bg-white/10 text-white/90' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
                        {price.monthly > 0 ? 'Kurulum + Aylık' : 'Tek Seferlik'}
                      </span>
                    </div>
                    <div className={`text-[11px] ${isPremium ? 'text-white/60' : 'text-gray-500 dark:text-gray-400'}`}>Tahmini süre: {price.timeline}</div>
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      <div className={`rounded-lg border p-2 ${isPremium ? 'bg-white/5 border-white/10' : 'bg-gray-50 dark:bg-[#17181f] border-gray-200 dark:border-gray-700'}`}>
                        <div className={`text-[9px] font-semibold uppercase ${isPremium ? 'text-amber-300' : 'text-gray-500 dark:text-gray-400'}`}>Tek Seferlik</div>
                        <div className={`text-[13px] font-bold ${isPremium ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}>{formatCurrency(price.oneTime)}</div>
                      </div>
                      <div className={`rounded-lg border p-2 ${isPremium ? 'bg-white/5 border-amber-400/30' : 'bg-gray-50 dark:bg-[#17181f] border-gray-200 dark:border-gray-700'}`}>
                        <div className={`text-[9px] font-semibold uppercase ${isPremium ? 'text-amber-300' : 'text-gray-500 dark:text-gray-400'}`}>Aylık</div>
                        <div className={`text-[13px] font-bold ${isPremium ? 'text-amber-200' : 'text-gray-900 dark:text-gray-100'}`}>{formatCurrency(price.monthly)}</div>
                      </div>
                    </div>
                  </div>
                  <Icon className={`${isPremium ? 'text-amber-300' : 'text-violet-600 dark:text-violet-400'} w-5 h-5 shrink-0`}>{service.icon}</Icon>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-5">
          <h3 className="text-[15px] font-bold text-gray-900 dark:text-gray-100 mb-4">Finansal Özet</h3>
          <div className="space-y-3">
            <SummaryRow label="Tek Seferlik Toplam" value={formatCurrency(totals.oneTime)} />
            <SummaryRow label="Aylık Hizmet Toplamı" value={formatCurrency(totals.monthly)} />
            <SummaryRow label="Tahmini KDV" value={formatCurrency(Math.round((totals.oneTime + totals.monthly) * 0.2))} />
            <div className="pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <span className="text-[13px] font-bold text-gray-900 dark:text-gray-100">İlk Ay Genel Toplam</span>
              <span className="text-[20px] font-black text-violet-700 dark:text-violet-300">{formatCurrency(totals.oneTime + totals.monthly + Math.round((totals.oneTime + totals.monthly) * 0.2))}</span>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-5">
          <h3 className="text-[15px] font-bold text-gray-900 dark:text-gray-100 mb-4">Teklif Zaman Çizelgesi</h3>
          <div className="space-y-3">
            {['Hazırlık', 'Teklif Gönderimi', 'Müşteri Onayı', 'Sözleşme'].map((item, index) => (
              <div key={item} className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold ${index === 0 ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}>{index + 1}</div>
                <div>
                  <div className="text-[12px] font-semibold text-gray-800 dark:text-gray-200">{item}</div>
                  <div className="text-[10px] text-gray-500 dark:text-gray-400">{index === 0 ? 'Bugün tamamlandı' : `${index + 1}. iş günü`}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-5">
        <h3 className="text-[15px] font-bold text-gray-900 dark:text-gray-100 mb-3">İç Not</h3>
        <textarea rows={4} placeholder="Teklif gönderimi öncesi ekip içi not ekleyin..." className="w-full px-3 py-2.5 text-[12px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#23242c] rounded-lg focus:outline-none focus:border-violet-500 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 resize-none" />
      </div>

      <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="text-[13px] font-bold text-gray-900 dark:text-gray-100">Teklif gönderime hazır</div>
          <div className="text-[11px] text-gray-500 dark:text-gray-400">Son kontrolü tamamlayıp teklif sürecini başlatabilirsiniz.</div>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <button onClick={onCancel} className="px-4 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-[12px]">İptal</button>
          <button onClick={onBack} className="px-4 py-2.5 bg-white dark:bg-[#161720] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-[12px]">Geri</button>
          <button className="px-4 py-2.5 bg-white dark:bg-[#161720] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-[12px]">Taslak Kaydet</button>
          <button className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 text-[12px] shadow-sm">
            Teklifi Oluştur
            <SendIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function SummaryHeroMetric({ value, label, active = false }: { value: string; label: string; active?: boolean }) {
  return (
    <div className={`text-center p-3 bg-white/5 backdrop-blur-sm border ${active ? 'border-amber-400/40' : 'border-white/10'} rounded-xl`}>
      <div className={`text-[18px] md:text-[22px] font-bold leading-tight ${active ? 'bg-gradient-to-r from-amber-300 to-amber-100 bg-clip-text text-transparent' : 'text-white'}`}>{value}</div>
      <div className="text-[9px] font-semibold text-amber-300 uppercase tracking-wider mt-0.5">{label}</div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[12px] text-gray-500 dark:text-gray-400">{label}</span>
      <span className="text-[13px] font-bold text-gray-900 dark:text-gray-100">{value}</span>
    </div>
  );
}

export default function SatisBaslat() {
  const [step, setStep] = useState<OfferStep>('list');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [activeModule, setActiveModule] = useState('web');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customersLoading, setCustomersLoading] = useState(false);
  const [customersError, setCustomersError] = useState('');
  const [salesRequests, setSalesRequests] = useState<SalesPanelRequest[]>([]);
  const [salesRequestsLoading, setSalesRequestsLoading] = useState(false);
  const [salesRequestsError, setSalesRequestsError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadCustomers = async () => {
      try {
        setCustomersLoading(true);
        setCustomersError('');
        const data = await getCustomers();
        const items = Array.isArray(data) ? data : [];
        if (isMounted) {
          setCustomers(items.map(mapCustomerResponse).filter((customer) => customer.id));
        }
      } catch (error) {
        logCustomerRequestError(error);
        if (isMounted) {
          setCustomers([]);
          setCustomersError(getApiErrorMessage(error));
        }
      } finally {
        if (isMounted) {
          setCustomersLoading(false);
        }
      }
    };

    loadCustomers();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedCustomer?.id) {
      setSalesRequests([]);
      setSalesRequestsError('');
      setSalesRequestsLoading(false);
      return;
    }

    let isMounted = true;

    const loadSalesRequests = async () => {
      try {
        setSalesRequestsLoading(true);
        setSalesRequestsError('');
        console.log('Seçilen müşteri:', selectedCustomer);
        console.log('Gönderilen customerId:', selectedCustomer.id);
        const data = await getSalesPanelRequestsByCustomer(selectedCustomer.id);
        const items = Array.isArray(data) ? data : [];
        if (isMounted) {
          setSalesRequests(items);
        }
      } catch (error) {
        logSalesRequestInfoError(error);
        if (isMounted) {
          setSalesRequests([]);
          setSalesRequestsError('Bu müşterinin talebi yok');
        }
      } finally {
        if (isMounted) {
          setSalesRequestsLoading(false);
        }
      }
    };

    loadSalesRequests();

    return () => {
      isMounted = false;
    };
  }, [selectedCustomer?.id]);

  const cancelOffer = () => {
    setStep('list');
    setSelectedCustomer(null);
    setSelectedServices([]);
    setActiveModule('web');
    setSalesRequests([]);
    setSalesRequestsError('');
  };

  const startOfferFlow = () => {
    setStep('select');
    setSelectedCustomer(null);
    setSelectedServices([]);
    setActiveModule('web');
    setSalesRequests([]);
    setSalesRequestsError('');
  };

  const startOfferFlowFor = () => {
    setStep('select');
    setSelectedCustomer(null);
    setSelectedServices([]);
    setActiveModule('web');
    setSalesRequests([]);
    setSalesRequestsError('');
  };

  const toggleService = (id: string) => {
    setSelectedServices((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  const goPlanDetails = () => {
    if (!selectedCustomer || selectedServices.length === 0) return;
    setActiveModule(selectedServices[0]);
    setStep('service-details');
  };

  if (step === 'select') {
    return (
      <OfferSelect
        selectedCustomer={selectedCustomer}
        selectedServices={selectedServices}
        customers={customers}
        customersLoading={customersLoading}
        customersError={customersError}
        salesRequests={salesRequests}
        salesRequestsLoading={salesRequestsLoading}
        salesRequestsError={salesRequestsError}
        onCancel={cancelOffer}
        onSelectCustomer={setSelectedCustomer}
        onClearCustomer={() => {
          setSelectedCustomer(null);
          setSalesRequests([]);
          setSalesRequestsError('');
        }}
        onToggleService={toggleService}
        onContinue={goPlanDetails}
      />
    );
  }

  if (step === 'service-details') {
    return <ServiceDetails selectedCustomer={selectedCustomer} selectedServices={selectedServices} activeModule={activeModule} onBack={() => setStep('select')} onActiveModule={setActiveModule} onSummary={() => setStep('summary')} />;
  }

  if (step === 'summary') {
    return <OfferSummary selectedCustomer={selectedCustomer} selectedServices={selectedServices} onBack={() => setStep('service-details')} onCancel={cancelOffer} />;
  }

  return <SalesList onStart={startOfferFlow} onStartFor={startOfferFlowFor} />;
}
