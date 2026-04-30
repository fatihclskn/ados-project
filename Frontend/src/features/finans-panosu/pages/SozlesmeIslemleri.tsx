import { type ReactNode, useMemo, useRef, useState } from 'react';

type ColorName = 'emerald' | 'amber' | 'rose' | 'sky' | 'violet' | 'indigo' | 'teal' | 'gray';
type PaymentType = 'pesin' | 'pesinat' | 'taksit' | 'aylik';
type ContractStatus = 'new' | 'processing' | 'done';
type StatusFilter = ContractStatus | 'all';
type Urgency = 'high' | 'medium' | 'low';
type ArchiveStatus = 'pending' | 'active' | 'completed' | 'archived';
type Category = 'seo' | 'ads' | 'sosyal' | 'website' | 'analytics' | 'brand' | 'premium';

type SalesContract = {
  id: string;
  customer: string;
  service: string;
  salesRep: string;
  arrivedAt: string;
  dueAction: string;
  company: 'digital' | 'bilisim';
  paymentType: PaymentType;
  amount: number;
  paymentDetail: string;
  pesinatAmount: number;
  status: ContractStatus;
  urgency: Urgency;
  actions: string[];
};

type ArchiveContract = {
  id: string;
  customer: string;
  service: string;
  amount: number;
  paymentType: PaymentType;
  date: string;
  endDate: string;
  status: ArchiveStatus;
  company: 'digital' | 'bilisim';
  category: Category;
};

type ArchiveFilters = {
  period: 'all' | '30' | '90' | '180' | '365';
  customer: string;
  service: 'all' | Category;
  search: string;
};

const CM: Record<ColorName, { bg: string; t: string; bar: string }> = {
  emerald: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', t: 'text-emerald-700 dark:text-emerald-300', bar: 'bg-gradient-to-r from-emerald-400 to-emerald-600' },
  amber: { bg: 'bg-amber-100 dark:bg-amber-900/30', t: 'text-amber-700 dark:text-amber-300', bar: 'bg-gradient-to-r from-amber-400 to-amber-600' },
  rose: { bg: 'bg-rose-100 dark:bg-rose-900/30', t: 'text-rose-700 dark:text-rose-300', bar: 'bg-gradient-to-r from-rose-400 to-rose-600' },
  sky: { bg: 'bg-sky-100 dark:bg-sky-900/30', t: 'text-sky-700 dark:text-sky-300', bar: 'bg-gradient-to-r from-sky-400 to-sky-600' },
  violet: { bg: 'bg-violet-100 dark:bg-violet-900/30', t: 'text-violet-700 dark:text-violet-300', bar: 'bg-gradient-to-r from-violet-400 to-violet-600' },
  indigo: { bg: 'bg-indigo-100 dark:bg-indigo-900/30', t: 'text-indigo-700 dark:text-indigo-300', bar: 'bg-gradient-to-r from-indigo-400 to-indigo-600' },
  teal: { bg: 'bg-teal-100 dark:bg-teal-900/30', t: 'text-teal-700 dark:text-teal-300', bar: 'bg-gradient-to-r from-teal-400 to-teal-600' },
  gray: { bg: 'bg-gray-100 dark:bg-gray-800', t: 'text-gray-600 dark:text-gray-400', bar: 'bg-gradient-to-r from-gray-400 to-gray-600' },
};

const sozlesmeler: SalesContract[] = [
  { id: 'SZL-2026-018', customer: 'BigBrand Reklam A.Ş.', service: 'Facebook Kampanyası', salesRep: 'Mehmet K.', arrivedAt: '23.04.2026 09:14', dueAction: 'bugün', company: 'digital', paymentType: 'pesinat', amount: 48000, paymentDetail: '%50 peşinat (₺24K) + %50 kampanya sonu', pesinatAmount: 24000, status: 'new', urgency: 'high', actions: ['Peşinat Faturası Kes ₺24K', 'Tek Seferlik Projeye Dönüştür'] },
  { id: 'SZL-2026-019', customer: 'MegaMarka Perakende', service: 'Website Redesign', salesRep: 'Ayşe D.', arrivedAt: '22.04.2026 16:32', dueAction: 'bugün', company: 'bilisim', paymentType: 'taksit', amount: 68000, paymentDetail: '3 eşit taksit (₺22.6K x 3) · 0/30/60 gün', pesinatAmount: 22667, status: 'new', urgency: 'high', actions: ['İlk Taksit Faturası Kes ₺22.6K', 'Taksit Planı Oluştur (3 ay)'] },
  { id: 'SZL-2026-020', customer: 'Bosch Türkiye', service: 'Yeni SEO Anlaşması (12 ay)', salesRep: 'Mehmet K.', arrivedAt: '22.04.2026 14:05', dueAction: '2 gün', company: 'digital', paymentType: 'aylik', amount: 576000, paymentDetail: '12 ay × ₺48K · her ayın 1’inde otomatik fatura', pesinatAmount: 48000, status: 'processing', urgency: 'medium', actions: ['Hizmet Anlaşmasına Dönüştür', 'İlk Ay Fatura Kes ₺48K'] },
  { id: 'SZL-2026-017', customer: 'Platin Otomotiv', service: 'CRM Yenileme (yıllık)', salesRep: 'Ayşe D.', arrivedAt: '20.04.2026 11:20', dueAction: '3 gün', company: 'digital', paymentType: 'pesin', amount: 180000, paymentDetail: 'Yıllık peşin ödeme · tek fatura', pesinatAmount: 180000, status: 'processing', urgency: 'low', actions: ['Yıllık Fatura Kes ₺180K', 'Hizmet Anlaşmasına Dönüştür'] },
  { id: 'SZL-2026-015', customer: 'Aydın Holding', service: 'SEO Teknik Audit', salesRep: 'Mehmet K.', arrivedAt: '15.04.2026 10:45', dueAction: 'tamamlandı', company: 'digital', paymentType: 'pesin', amount: 42000, paymentDetail: 'Peşin ödeme · proje başlandı', pesinatAmount: 42000, status: 'done', urgency: 'low', actions: ['✓ Peşin Fatura Kesildi', '✓ Tek Seferlik Projeye Dönüştürüldü'] },
  { id: 'SZL-2026-021', customer: 'TechNova Yazılım', service: 'Analytics Setup (ek hizmet)', salesRep: 'Ayşe D.', arrivedAt: '23.04.2026 11:58', dueAction: 'bugün', company: 'digital', paymentType: 'pesinat', amount: 15000, paymentDetail: '%30 başlangıç (₺4.5K) + %70 teslimat', pesinatAmount: 4500, status: 'new', urgency: 'medium', actions: ['Peşinat Faturası Kes ₺4.5K', 'Tek Seferlik Projeye Dönüştür'] },
];

const archiveOnly: ArchiveContract[] = [
  { id: 'SZL-2025-156', customer: 'BigBrand Reklam A.Ş.', service: 'Yıllık SEO Paketi', amount: 96000, paymentType: 'pesin', date: '15.06.2025', endDate: '14.06.2026', status: 'active', company: 'digital', category: 'seo' },
  { id: 'SZL-2025-092', customer: 'Platin Otomotiv', service: 'All-in-One Premium Aylık', amount: 816000, paymentType: 'aylik', date: '28.12.2025', endDate: '31.12.2026', status: 'active', company: 'digital', category: 'premium' },
  { id: 'SZL-2025-087', customer: 'Bosch Türkiye', service: 'SEO Yönetimi 2025', amount: 576000, paymentType: 'aylik', date: '20.12.2024', endDate: '31.12.2025', status: 'archived', company: 'digital', category: 'seo' },
  { id: 'SZL-2025-088', customer: 'Bosch Türkiye', service: 'Google Ads Yönetimi 2025', amount: 624000, paymentType: 'aylik', date: '20.12.2024', endDate: '31.12.2025', status: 'archived', company: 'digital', category: 'ads' },
  { id: 'SZL-2025-089', customer: 'Bosch Türkiye', service: 'Sosyal Medya Yönetimi 2025', amount: 504000, paymentType: 'aylik', date: '20.12.2024', endDate: '31.12.2025', status: 'archived', company: 'digital', category: 'sosyal' },
  { id: 'SZL-2026-003', customer: 'Platin Otomotiv', service: 'Yıllık CRM Lisansı', amount: 180000, paymentType: 'pesin', date: '15.03.2026', endDate: '14.03.2027', status: 'active', company: 'digital', category: 'website' },
  { id: 'SZL-2026-007', customer: 'Bosch Türkiye', service: 'Yıllık Hosting + Domain', amount: 120000, paymentType: 'pesin', date: '01.01.2026', endDate: '31.12.2026', status: 'active', company: 'digital', category: 'website' },
  { id: 'SZL-2026-012', customer: 'TechNova Yazılım', service: 'Dijital Pazarlama Aylık', amount: 432000, paymentType: 'aylik', date: '01.02.2026', endDate: '31.01.2027', status: 'active', company: 'digital', category: 'premium' },
  { id: 'SZL-2026-019f', customer: 'FastGrow Digital', service: 'SEO Yönetimi Aylık', amount: 294000, paymentType: 'aylik', date: '01.02.2026', endDate: '31.01.2027', status: 'active', company: 'bilisim', category: 'seo' },
  { id: 'SZL-2026-024m', customer: 'MegaMarka Perakende', service: 'Website Yönetimi Aylık', amount: 216000, paymentType: 'aylik', date: '01.03.2026', endDate: '28.02.2027', status: 'active', company: 'bilisim', category: 'website' },
  { id: 'SZL-2025-201', customer: 'Aydın Holding', service: 'Kışa Dönem Ads Kampanyası', amount: 28000, paymentType: 'pesin', date: '15.11.2025', endDate: '15.12.2025', status: 'completed', company: 'digital', category: 'ads' },
  { id: 'SZL-2025-178', customer: 'MegaMarka Perakende', service: 'Tek Seferlik SEO Audit', amount: 24000, paymentType: 'pesin', date: '10.10.2025', endDate: '30.10.2025', status: 'completed', company: 'bilisim', category: 'seo' },
];

const payConf: Record<PaymentType, { lbl: string; clr: ColorName; icon: ReactNode }> = {
  pesin: { lbl: 'Peşin', clr: 'emerald', icon: <polyline points="20 6 9 17 4 12" /> },
  pesinat: { lbl: 'Peşinat + Taksit', clr: 'amber', icon: <><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></> },
  taksit: { lbl: 'Eşit Taksit', clr: 'sky', icon: <><line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" /></> },
  aylik: { lbl: 'Aylık Otomatik', clr: 'violet', icon: <><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></> },
};

const statusConf: Record<ContractStatus, { lbl: string; clr: ColorName; dotClass: string; badge: string }> = {
  new: { lbl: 'Yeni Geldi', clr: 'rose', dotClass: 'bg-rose-500', badge: 'YENİ' },
  processing: { lbl: 'İşleniyor', clr: 'amber', dotClass: 'bg-amber-500', badge: 'İŞLEMDE' },
  done: { lbl: 'Tamamlandı', clr: 'emerald', dotClass: 'bg-emerald-500', badge: 'TAMAM' },
};

const categoryMap: Record<Category, string> = {
  seo: 'SEO',
  ads: 'Ads / SEM',
  sosyal: 'Sosyal Medya',
  website: 'Website',
  analytics: 'Analytics',
  brand: 'Marka/Tasarım',
  premium: 'Premium',
};

const statusLbl: Record<ArchiveStatus, string> = {
  pending: 'Beklemede',
  active: 'Aktif',
  completed: 'Tamamlandı',
  archived: 'Arşiv',
};

const statusClr: Record<ArchiveStatus, ColorName> = {
  pending: 'amber',
  active: 'emerald',
  completed: 'sky',
  archived: 'gray',
};

function Svg({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      {children}
    </svg>
  );
}

function money(value: number) {
  return `₺${value.toLocaleString('tr-TR')}`;
}

function compactMoney(value: number) {
  return `₺${(value / 1000).toFixed(value < 10000 ? 1 : 0)}K`;
}

function inferCategory(service: string): Category {
  const text = service.toLocaleLowerCase('tr-TR');
  if (text.includes('seo')) return 'seo';
  if (text.includes('ads') || text.includes('facebook')) return 'ads';
  if (text.includes('sosyal')) return 'sosyal';
  if (text.includes('website') || text.includes('crm') || text.includes('hosting')) return 'website';
  if (text.includes('analytics')) return 'analytics';
  return 'premium';
}

function parseDate(date: string) {
  const parts = date.split('.');
  return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
}

function ContentToast({ title, message, color = 'violet', onClose }: { title: string; message: string; color?: ColorName; onClose: () => void }) {
  const cm = CM[color];
  return (
    <div className="absolute right-4 top-4 z-40 min-w-[280px] max-w-[400px] bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden">
      <div className={`h-1 ${cm.bg}`} />
      <div className="p-3 flex items-start gap-3">
        <div className="flex-1">
          <div className={`font-bold text-[13px] ${cm.t} mb-0.5`}>{title}</div>
          <div className="text-[11px] text-gray-500 dark:text-gray-400">{message}</div>
        </div>
        <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">×</button>
      </div>
    </div>
  );
}

function ActionModal({ contract, onClose, onAction }: { contract: SalesContract | ArchiveContract; onClose: () => void; onAction: (title: string, message: string, color: ColorName) => void }) {
  const companyLbl = contract.company === 'digital' ? 'Arma Digital Medya A.Ş.' : 'Arma Bilişim Ltd. Şti.';
  const companyClr = contract.company === 'digital' ? 'emerald' : 'indigo';
  const companyCm = CM[companyClr];
  const payType = payConf[contract.paymentType];

  const closeWithAction = (title: string, message: string, color: ColorName) => {
    onAction(title, message, color);
    onClose();
  };

  return (
    <div className="absolute inset-0 z-30 flex items-start justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="modal-scroll bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-xl w-full max-w-[620px] max-h-[82vh] overflow-y-auto pointer-events-auto">
        <div className="sticky top-0 z-10 bg-white dark:bg-[#1e1f26] border-b border-gray-100 dark:border-gray-700/60 p-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-violet-100 dark:bg-violet-500/20 rounded-lg flex items-center justify-center">
              <Svg className="text-violet-600 dark:text-violet-400 w-4 h-4"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></Svg>
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-gray-900 dark:text-gray-100">Sözleşme Aksiyonu</h2>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 font-mono">{contract.id}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1">
            <Svg className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Svg>
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="p-4 bg-gradient-to-br from-violet-50 to-sky-50/50 dark:from-violet-500/10 dark:to-sky-500/5 border border-violet-200 dark:border-violet-500/30 rounded-xl">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <h3 className="text-[14px] font-black text-gray-900 dark:text-gray-100">{contract.customer}</h3>
                <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-0.5">{contract.service}</p>
              </div>
              <div className="text-right">
                <p className="text-[20px] font-black text-gray-900 dark:text-gray-100 font-mono leading-none">{money(contract.amount)}</p>
                <p className="text-[9px] text-gray-500 dark:text-gray-400 mt-1">Toplam sözleşme tutarı</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-violet-200/50 dark:border-violet-500/20">
              <div>
                <p className="text-[9px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ödeme Şekli</p>
                <p className="text-[11px] font-bold text-violet-700 dark:text-violet-300 mt-0.5">{payType.lbl}</p>
              </div>
              <div>
                <p className="text-[9px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Şirket</p>
                <p className={`text-[11px] font-bold ${companyCm.t} mt-0.5`}>{companyLbl}</p>
              </div>
            </div>
            <div className="mt-3 p-2.5 bg-white dark:bg-[#17181f] border border-gray-100 dark:border-gray-700/40 rounded-md">
              <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Ödeme Detayı</p>
              <p className="text-[12px] text-gray-900 dark:text-gray-100">{'paymentDetail' in contract ? contract.paymentDetail : `${payType.lbl} · ${contract.endDate || 'süreç devam ediyor'}`}</p>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wider">Finans Aksiyonları</label>
            <div className="space-y-2">
              {[
                { title: 'Peşinat / İlk Fatura Kes', sub: 'Paraşüt’e yazılır · GIB’e gönderilir · müşteriye iletilir', clr: 'emerald' as ColorName, icon: <><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></>, toastTitle: 'Peşinat Faturası', toastMessage: 'Paraşüt üzerinden peşinat faturası kesiliyor' },
                { title: 'Ödeme Planı Oluştur', sub: 'Taksit tarihleri · otomatik fatura tetikleri', clr: 'sky' as ColorName, icon: <><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>, toastTitle: 'Ödeme Planı', toastMessage: 'Taksit planı oluşturma formu açılıyor' },
                { title: 'Hizmet Anlaşmasına Dönüştür', sub: 'Aylık / Yıllık recurring anlaşma olarak kaydet', clr: 'violet' as ColorName, icon: <><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></>, toastTitle: 'Hizmet Anlaşması', toastMessage: 'Sözleşme hizmet anlaşmasına dönüştürülüyor' },
                { title: 'Sözleşme PDF Görüntüle', sub: 'Orijinal belge · imzalar · ek maddeler', clr: 'gray' as ColorName, icon: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></>, toastTitle: 'Sözleşme PDF', toastMessage: 'PDF görüntüleyici açılıyor' },
                { title: 'Satışa Geri Gönder', sub: 'Revize / düzeltme talebi ile geri iletme', clr: 'rose' as ColorName, icon: <polyline points="15 18 9 12 15 6" />, toastTitle: 'Satışa Geri Gönder', toastMessage: 'Revize talebi satış ekibine gönderiliyor' },
              ].map((action) => {
                const cm = CM[action.clr];
                return (
                  <button key={action.title} type="button" onClick={() => closeWithAction(action.toastTitle, action.toastMessage, action.clr)} className={`w-full flex items-center gap-3 p-3 ${action.clr === 'gray' ? 'bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#23242c]' : `bg-${action.clr}-50 dark:bg-${action.clr}-500/10 border border-${action.clr}-200 dark:border-${action.clr}-500/30 hover:bg-${action.clr}-100 dark:hover:bg-${action.clr}-500/20`} rounded-lg text-left transition-all`}>
                    <div className={`w-9 h-9 ${action.clr === 'gray' ? 'bg-gray-100 dark:bg-gray-800' : `bg-${action.clr}-200 dark:bg-${action.clr}-500/30`} rounded-md flex items-center justify-center shrink-0`}>
                      <Svg className={`${cm.t} w-4 h-4`}>{action.icon}</Svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100">{action.title}</p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">{action.sub}</p>
                    </div>
                    <Svg className={`${cm.t} w-3.5 h-3.5`}><polyline points="9 18 15 12 9 6" /></Svg>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white dark:bg-[#1e1f26] border-t border-gray-100 dark:border-gray-700/60 p-4 flex items-center justify-end">
          <button type="button" onClick={onClose} className="px-3 py-2 text-[11px] font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">Kapat</button>
        </div>
      </div>
    </div>
  );
}

function ManualContractModal({ onClose, onToast }: { onClose: () => void; onToast: (title: string, message: string, color: ColorName) => void }) {
  const [customerMode, setCustomerMode] = useState<'existing' | 'new'>('existing');
  const [fileName, setFileName] = useState('');

  const closeWithToast = (title: string, message: string, color: ColorName) => {
    onToast(title, message, color);
    onClose();
  };

  return (
    <div className="absolute inset-0 z-30 flex items-start justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="modal-scroll bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-xl w-full max-w-[760px] max-h-[82vh] overflow-y-auto pointer-events-auto">
        <div className="sticky top-0 z-10 bg-white dark:bg-[#1e1f26] border-b border-gray-100 dark:border-gray-700/60 p-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-violet-100 dark:bg-violet-500/20 rounded-lg flex items-center justify-center">
              <Svg className="text-violet-600 dark:text-violet-400 w-4 h-4"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></Svg>
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-gray-900 dark:text-gray-100">Manuel Sözleşme Ekle</h2>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">Satış ekibi olmadan doğrudan sözleşme girişi · ADOS Finans sistemine uyumlu</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1">
            <Svg className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Svg>
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <span className="flex items-center justify-center w-5 h-5 bg-violet-600 text-white text-[10px] font-bold rounded-full">1</span>
              <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Sözleşme Hangi Şirketten? *</label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <label className="cursor-pointer">
                <input type="radio" name="mSozCompany" value="digital" className="sr-only peer" defaultChecked />
                <div className="h-full p-3 bg-white dark:bg-[#17181f] border-2 border-gray-200 dark:border-gray-700 peer-checked:border-emerald-500 peer-checked:bg-emerald-50 dark:peer-checked:bg-emerald-500/10 rounded-lg transition-all">
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-500/20 rounded-md flex items-center justify-center shrink-0">
                      <Svg className="text-emerald-600 dark:text-emerald-400 w-4 h-4"><path d="M3 3h18v18H3z" /><path d="M3 9h18" /><path d="M9 21V9" /></Svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100 leading-tight">Arma Digital Medya A.Ş.</p>
                      <span className="inline-block mt-1 min-w-[90px] text-center text-[8px] font-bold px-1.5 py-0.5 bg-emerald-200 dark:bg-emerald-500/30 text-emerald-800 dark:text-emerald-200 rounded">TEKNOPARK</span>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1.5">Yazılım · teknoloji · KDV’siz fatura</p>
                    </div>
                  </div>
                </div>
              </label>
              <label className="cursor-pointer">
                <input type="radio" name="mSozCompany" value="bilisim" className="sr-only peer" />
                <div className="h-full p-3 bg-white dark:bg-[#17181f] border-2 border-gray-200 dark:border-gray-700 peer-checked:border-indigo-500 peer-checked:bg-indigo-50 dark:peer-checked:bg-indigo-500/10 rounded-lg transition-all">
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-500/20 rounded-md flex items-center justify-center shrink-0">
                      <Svg className="text-indigo-600 dark:text-indigo-400 w-4 h-4"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M7 8h10M7 12h10M7 16h6" /></Svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100 leading-tight">Arma Bilişim Ltd. Şti.</p>
                      <span className="inline-block mt-1 min-w-[90px] text-center text-[8px] font-bold px-1.5 py-0.5 bg-indigo-200 dark:bg-indigo-500/30 text-indigo-800 dark:text-indigo-200 rounded">STANDART KDV</span>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1.5">Reklam · tur · inşaat · %20 KDV</p>
                    </div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <span className="flex items-center justify-center w-5 h-5 bg-violet-600 text-white text-[10px] font-bold rounded-full">2</span>
              <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Sözleşme Dosyası</label>
              <span className="text-[9px] text-gray-400 dark:text-gray-500">(PDF · isteğe bağlı ama önerilir)</span>
            </div>
            <label htmlFor="sozlesmeFile" className="block cursor-pointer">
              <input
                type="file"
                id="sozlesmeFile"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    setFileName(`${file.name} · ${(file.size / 1024).toFixed(0)} KB`);
                    onToast('Dosya Yüklendi', `${file.name} analiz ediliyor · müşteri bilgisi, tutar ve tarihler AI ile çıkarılacak`, 'violet');
                  }
                }}
              />
              <div id="fileDropArea" className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-violet-500 dark:hover:border-violet-400 hover:bg-violet-50/30 dark:hover:bg-violet-500/5 rounded-lg p-5 text-center transition-all">
                <Svg className="text-gray-400 w-8 h-8 mx-auto mb-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></Svg>
                <p className="text-[12px] font-semibold text-gray-700 dark:text-gray-300">Dosya seçmek için tıklayın <span className="text-gray-400">veya sürükleyip bırakın</span></p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">PDF · DOC · DOCX · max 10 MB</p>
                {fileName ? (
                  <div id="fileInfo" className="mt-3 p-2 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-md flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <Svg className="text-emerald-600 dark:text-emerald-400 w-4 h-4 shrink-0"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></Svg>
                      <span id="fileName" className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-200 truncate">{fileName}</span>
                    </div>
                    <button type="button" onClick={(event) => { event.preventDefault(); setFileName(''); }} className="text-rose-500 hover:text-rose-600 shrink-0">
                      <Svg className="w-3.5 h-3.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Svg>
                    </button>
                  </div>
                ) : null}
              </div>
            </label>
            <p className="text-[9px] text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
              <Svg className="text-violet-500 w-3 h-3"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></Svg>
              PDF yüklerseniz AI müşteri bilgisi, tutar ve tarihleri otomatik çıkarır
            </p>
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <span className="flex items-center justify-center w-5 h-5 bg-violet-600 text-white text-[10px] font-bold rounded-full">3</span>
              <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Müşteri Eşleştirmesi *</label>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <label className="cursor-pointer flex-1">
                <input type="radio" name="mCustType" value="existing" className="sr-only peer" checked={customerMode === 'existing'} onChange={() => setCustomerMode('existing')} />
                <div className="px-3 py-2 bg-white dark:bg-[#17181f] border-2 border-gray-200 dark:border-gray-700 peer-checked:border-violet-500 peer-checked:bg-violet-50 dark:peer-checked:bg-violet-500/10 rounded-md text-center transition-all">
                  <p className="text-[11px] font-bold text-gray-900 dark:text-gray-100">Mevcut Cari (Paraşüt)</p>
                  <p className="text-[9px] text-gray-500 dark:text-gray-400">Sistemden seç</p>
                </div>
              </label>
              <label className="cursor-pointer flex-1">
                <input type="radio" name="mCustType" value="new" className="sr-only peer" checked={customerMode === 'new'} onChange={() => setCustomerMode('new')} />
                <div className="px-3 py-2 bg-white dark:bg-[#17181f] border-2 border-gray-200 dark:border-gray-700 peer-checked:border-violet-500 peer-checked:bg-violet-50 dark:peer-checked:bg-violet-500/10 rounded-md text-center transition-all">
                  <p className="text-[11px] font-bold text-gray-900 dark:text-gray-100">Yeni Müşteri</p>
                  <p className="text-[9px] text-gray-500 dark:text-gray-400">Yeni cari oluştur</p>
                </div>
              </label>
            </div>

            {customerMode === 'existing' ? (
              <div id="existingCustomerFields" className="space-y-2">
                <div className="relative">
                  <Svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></Svg>
                  <input type="text" list="parasutCari" placeholder="Müşteri ara · Paraşüt carileri otomatik eşleşir..." className="w-full pl-8 pr-2 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:border-violet-500" />
                  <datalist id="parasutCari">
                    <option value="Bosch Türkiye · VN: 1234567890" />
                    <option value="BigBrand Reklam A.Ş. · VN: 2345678901" />
                    <option value="FastGrow Digital · VN: 3456789012" />
                    <option value="TechNova Yazılım · VN: 4567890123" />
                    <option value="MegaMarka Perakende · VN: 5678901234" />
                    <option value="Platin Otomotiv · VN: 6789012345" />
                  </datalist>
                </div>
                <div className="p-2.5 bg-emerald-50/60 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-md flex items-start gap-2">
                  <Svg className="text-emerald-600 dark:text-emerald-400 w-3.5 h-3.5 shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12" /></Svg>
                  <p className="text-[10px] text-emerald-800 dark:text-emerald-200"><span className="font-bold">Paraşüt senkron:</span> Seçilen cari için vergi no, adres, iletişim bilgileri otomatik gelecek</p>
                </div>
              </div>
            ) : (
              <div id="newCustomerFields" className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1">Ünvan / Tam Ad *</label><input type="text" placeholder="Örn: ABC Ticaret A.Ş." className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:border-violet-500" /></div>
                  <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1">Müşteri Türü</label><select className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:border-violet-500"><option>Kurumsal (A.Ş. / Ltd.)</option><option>Şahıs Şirketi</option><option>Bireysel</option><option>Yurtdışı</option></select></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1">Vergi No / TC Kimlik</label><input type="text" placeholder="10 / 11 haneli" className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono focus:outline-none focus:border-violet-500" /></div>
                  <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1">Vergi Dairesi</label><input type="text" placeholder="Örn: Beşiktaş V.D." className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:border-violet-500" /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1">E-posta</label><input type="email" placeholder="fatura@firma.com" className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:border-violet-500" /></div>
                  <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1">Telefon</label><input type="tel" placeholder="+90 212 ..." className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono focus:outline-none focus:border-violet-500" /></div>
                </div>
                <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1">Adres</label><textarea rows={2} placeholder="Fatura adresi..." className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 resize-none focus:outline-none focus:border-violet-500" /></div>
                <div className="p-2.5 bg-amber-50/60 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-md flex items-start gap-2">
                  <Svg className="text-amber-600 dark:text-amber-400 w-3.5 h-3.5 shrink-0 mt-0.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></Svg>
                  <p className="text-[10px] text-amber-800 dark:text-amber-200"><span className="font-bold">Yeni cari:</span> Bu bilgiler Paraşüt'te yeni cari olarak oluşturulacak · sözleşme kaydedilince otomatik senkron</p>
                </div>
              </div>
            )}
          </div>

          <FormSection number="4" title="Hizmet / Ürün Bilgisi *">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
              <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1">Hizmet Kategorisi</label><select className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:border-violet-500"><option>SEO</option><option>Google Ads / SEM</option><option>Sosyal Medya</option><option>Website Tasarım/Geliştirme</option><option>Analytics & Data</option><option>Marka/Tasarım</option><option>Premium / Paket</option><option>Danışmanlık</option><option>Yazılım Lisans</option><option>Diğer</option></select></div>
              <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1">Sözleşme Türü</label><select className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:border-violet-500"><option>Hizmet Sözleşmesi</option><option>Ürün/Lisans Sözleşmesi</option><option>Proje Sözleşmesi</option><option>Çerçeve Sözleşmesi</option><option>Bakım/Destek Sözleşmesi</option></select></div>
            </div>
            <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1">Hizmet Adı / Başlık *</label><input type="text" placeholder="Örn: SEO Yönetimi 12 Ay · Google Ads Kampanya · Website Redesign Projesi" className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:border-violet-500" /></div>
          </FormSection>

          <FormSection number="5" title="Ödeme Şekli *" subtitle="Finans aksiyonunu belirler">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { k: 'pesin', lbl: 'Peşin', clr: 'emerald', sub: 'Tek fatura' },
                { k: 'pesinat', lbl: 'Peşinat + Taksit', clr: 'amber', sub: '%50 + %50' },
                { k: 'taksit', lbl: 'Eşit Taksit', clr: 'sky', sub: '3 / 6 / 12 ay' },
                { k: 'aylik', lbl: 'Aylık Otomatik', clr: 'violet', sub: 'Her ay fatura' },
              ].map((payment, index) => (
                <label key={payment.k} className="cursor-pointer">
                  <input type="radio" name="mSozPayment" value={payment.k} className="sr-only peer" defaultChecked={index === 0} />
                  <div className={`h-full p-2.5 bg-white dark:bg-[#17181f] border-2 border-gray-200 dark:border-gray-700 peer-checked:border-${payment.clr}-500 peer-checked:bg-${payment.clr}-50 dark:peer-checked:bg-${payment.clr}-500/10 rounded-lg text-center transition-all`}>
                    <p className="text-[11px] font-bold text-gray-900 dark:text-gray-100">{payment.lbl}</p>
                    <p className="text-[9px] text-gray-500 dark:text-gray-400 mt-0.5">{payment.sub}</p>
                  </div>
                </label>
              ))}
            </div>
          </FormSection>

          <FormSection number="6" title="Tutar ve Tarihler *">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1">Toplam Tutar *</label><input type="text" placeholder="0,00" className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono text-right focus:outline-none focus:border-violet-500" /></div>
              <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1">Para Birimi</label><select className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono focus:outline-none focus:border-violet-500"><option>TRY</option><option>USD</option><option>EUR</option></select></div>
              <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1">KDV</label><select className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:border-violet-500"><option>%0 (Teknopark)</option><option>%20 (Standart)</option><option>%10</option><option>%1</option></select></div>
              <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1">İmza Tarihi</label><input type="date" defaultValue="2026-04-23" className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono focus:outline-none focus:border-violet-500" /></div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1">Başlangıç Tarihi</label><input type="date" defaultValue="2026-04-23" className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono focus:outline-none focus:border-violet-500" /></div>
              <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1">Bitiş Tarihi</label><input type="date" defaultValue="2027-04-22" className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono focus:outline-none focus:border-violet-500" /></div>
            </div>
          </FormSection>

          <FormSection number="7" title="Ek Bilgiler">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
              <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1">Satış Temsilcisi</label><select className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:border-violet-500"><option>(Yok · manuel giriş)</option><option>Mehmet K.</option><option>Ayşe D.</option><option>Osman Atasoy (CEO)</option></select></div>
              <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1">Öncelik</label><select className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:border-violet-500"><option>Normal</option><option>Orta</option><option>Yüksek / Acil</option></select></div>
            </div>
            <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1">Notlar</label><textarea rows={2} placeholder="Özel şartlar, revize notları, ek ödeme koşulları..." className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 resize-none focus:outline-none focus:border-violet-500" /></div>
          </FormSection>

          <div className="p-3 bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/30 rounded-md flex items-start gap-2">
            <Svg className="text-violet-600 dark:text-violet-400 w-4 h-4 shrink-0 mt-0.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></Svg>
            <div className="text-[10px]">
              <p className="font-bold text-violet-900 dark:text-violet-200">Kayıttan sonra</p>
              <p className="text-violet-700 dark:text-violet-300 mt-0.5">Sözleşme "Yeni Geldi" durumunda listelenir · ödeme şekline göre otomatik aksiyon önerisi gösterilir · Paraşüt'e cari senkron yapılır · PDF dosyası arşivde saklanır</p>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white dark:bg-[#1e1f26] border-t border-gray-100 dark:border-gray-700/60 p-4 flex items-center justify-end gap-2">
          <button type="button" onClick={onClose} className="px-3 py-2 text-[11px] font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">İptal</button>
          <button type="button" onClick={() => closeWithToast('Taslak Kaydedildi', 'Sözleşme taslak olarak kaydedildi · daha sonra tamamlayabilirsiniz', 'gray')} className="flex items-center gap-1 px-3 py-2 text-[11px] font-semibold bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-[#23242c]">Taslağa Kaydet</button>
          <button type="button" onClick={() => closeWithToast('Sözleşme Kaydedildi', 'Sözleşme sisteme eklendi · Paraşüt cari senkron yapıldı · aksiyon önerisi gösteriliyor', 'emerald')} className="flex items-center gap-1.5 px-4 py-2 text-[11px] font-bold bg-violet-600 hover:bg-violet-700 text-white rounded-md">
            <Svg className="w-3 h-3"><polyline points="20 6 9 17 4 12" /></Svg>
            Sözleşmeyi Kaydet
          </button>
        </div>
      </div>
    </div>
  );
}

function FormSection({ number, title, subtitle, children }: { number: string; title: string; subtitle?: string; children: ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-2">
        <span className="flex items-center justify-center w-5 h-5 bg-violet-600 text-white text-[10px] font-bold rounded-full">{number}</span>
        <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">{title}</label>
        {subtitle ? <span className="text-[9px] text-gray-400 dark:text-gray-500">{subtitle}</span> : null}
      </div>
      {children}
    </div>
  );
}

export default function SozlesmeIslemleri() {
  const archiveRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<StatusFilter>('all');
  const [search, setSearch] = useState('');
  const [archiveFilters, setArchiveFilters] = useState<ArchiveFilters>({ period: 'all', customer: 'all', service: 'all', search: '' });
  const [modal, setModal] = useState<{ type: 'action'; contract: SalesContract | ArchiveContract } | { type: 'manual' } | null>(null);
  const [toast, setToast] = useState<{ title: string; message: string; color?: ColorName } | null>(null);

  const showToast = (title: string, message: string, color: ColorName = 'violet') => setToast({ title, message, color });

  const filtered = useMemo(() => {
    const term = search.trim().toLocaleLowerCase('tr-TR');
    return sozlesmeler.filter((contract) => {
      const matchesStatus = status === 'all' || contract.status === status;
      const matchesSearch = !term || contract.id.toLocaleLowerCase('tr-TR').includes(term) || contract.customer.toLocaleLowerCase('tr-TR').includes(term) || contract.service.toLocaleLowerCase('tr-TR').includes(term);
      return matchesStatus && matchesSearch;
    });
  }, [search, status]);

  const stats = {
    total: sozlesmeler.length,
    newCount: sozlesmeler.filter((x) => x.status === 'new').length,
    processing: sozlesmeler.filter((x) => x.status === 'processing').length,
    done: sozlesmeler.filter((x) => x.status === 'done').length,
    totalAmount: sozlesmeler.reduce((a, x) => a + x.amount, 0),
    pesinatPending: sozlesmeler.filter((x) => x.paymentType === 'pesinat' && x.status === 'new').reduce((a, x) => a + x.pesinatAmount, 0),
    highUrgency: sozlesmeler.filter((x) => x.urgency === 'high' && x.status !== 'done').length,
  };

  const activeFormatted: ArchiveContract[] = sozlesmeler.map((contract) => ({
    id: contract.id,
    customer: contract.customer,
    service: contract.service,
    amount: contract.amount,
    paymentType: contract.paymentType,
    date: contract.arrivedAt.split(' ')[0],
    endDate: '',
    status: contract.status === 'done' ? 'completed' : contract.status === 'processing' ? 'active' : 'pending',
    company: contract.company,
    category: inferCategory(contract.service),
  }));

  const allArchive = [...activeFormatted, ...archiveOnly];

  const archiveScope = allArchive;
  const uniqueCustomers = Array.from(new Set(archiveScope.map((x) => x.customer))).sort((a, b) => a.localeCompare(b, 'tr-TR'));
  const uniqueCategories = Array.from(new Set(archiveScope.map((x) => x.category))) as Category[];

  const archiveFiltered = useMemo(() => {
    const today = new Date(2026, 3, 23);
    const term = archiveFilters.search.trim().toLocaleLowerCase('tr-TR');
    return allArchive.filter((contract) => {
      if (archiveFilters.customer !== 'all' && contract.customer !== archiveFilters.customer) return false;
      if (archiveFilters.service !== 'all' && contract.category !== archiveFilters.service) return false;
      if (archiveFilters.period !== 'all') {
        const diffDays = (today.getTime() - parseDate(contract.date).getTime()) / (1000 * 60 * 60 * 24);
        if (diffDays > Number(archiveFilters.period)) return false;
      }
      if (term && !contract.customer.toLocaleLowerCase('tr-TR').includes(term) && !contract.service.toLocaleLowerCase('tr-TR').includes(term) && !contract.id.toLocaleLowerCase('tr-TR').includes(term)) return false;
      return true;
    });
  }, [allArchive, archiveFilters]);

  const statusTabs: Array<{ k: StatusFilter; lbl: string; count: number; clr: ColorName }> = [
    { k: 'all', lbl: 'Tümü', count: stats.total, clr: 'gray' },
    { k: 'new', lbl: 'Yeni Geldi', count: stats.newCount, clr: 'rose' },
    { k: 'processing', lbl: 'İşleniyor', count: stats.processing, clr: 'amber' },
    { k: 'done', lbl: 'Tamamlandı', count: stats.done, clr: 'emerald' },
  ];

  const kpis: Array<{ label: string; value: string; sub: string; clr: ColorName }> = [
    { label: 'Toplam Sözleşme', value: String(stats.total), sub: 'Tüm durumlar', clr: 'violet' },
    { label: 'Yeni Geldi', value: String(stats.newCount), sub: 'İşlem bekliyor', clr: 'rose' },
    { label: 'İşleniyor', value: String(stats.processing), sub: 'Finans işlem yapıyor', clr: 'amber' },
    { label: 'Toplam Değer', value: compactMoney(stats.totalAmount), sub: 'Tüm sözleşmelerin toplamı', clr: 'emerald' },
    { label: 'Peşinat Bekleyen', value: compactMoney(stats.pesinatPending), sub: 'Peşinat faturası kesilmeli', clr: 'amber' },
    { label: 'Acil', value: String(stats.highUrgency), sub: 'Yüksek öncelikli', clr: 'rose' },
  ];

  const paymentDistribution = (Object.entries(payConf) as Array<[PaymentType, (typeof payConf)[PaymentType]]>).map(([key, conf]) => {
    const count = sozlesmeler.filter((contract) => contract.paymentType === key).length;
    return { key, conf, count, pct: Math.round((count / sozlesmeler.length) * 100) };
  });

  const todayActions = sozlesmeler.filter((x) => x.status === 'new' && x.dueAction === 'bugün');

  return (
    <div className="relative space-y-5 md:space-y-6">
      {toast ? <ContentToast {...toast} onClose={() => setToast(null)} /> : null}
      {modal?.type === 'action' ? <ActionModal contract={modal.contract} onClose={() => setModal(null)} onAction={showToast} /> : null}
      {modal?.type === 'manual' ? <ManualContractModal onClose={() => setModal(null)} onToast={showToast} /> : null}

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-violet-100 dark:bg-violet-500/20 rounded-lg flex items-center justify-center">
            <Svg className="text-violet-600 dark:text-violet-400 w-4 h-4"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></Svg>
          </div>
          <div>
            <h1 className="text-[19px] font-bold text-gray-900 dark:text-gray-100 leading-tight">Sözleşme İşlemleri</h1>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">{stats.total} sözleşme · {stats.newCount} yeni · {stats.processing} işlemde · Satış'tan Finans'a otomatik akış</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button type="button" onClick={() => showToast('Satış Panosundan Çek', 'Satış ekibinde imzalanan son sözleşmeler Finansa aktarılıyor · 3 yeni sözleşme tespit edildi', 'violet')} className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-[11px] font-semibold rounded-md hover:bg-gray-50 dark:hover:bg-[#23242c]">
            <Svg className="w-3.5 h-3.5"><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></Svg>
            Satış'tan Çek
          </button>
          <button type="button" onClick={() => archiveRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-[11px] font-semibold rounded-md hover:bg-gray-50 dark:hover:bg-[#23242c]">
            <Svg className="w-3.5 h-3.5"><rect x="2" y="3" width="20" height="5" rx="1" /><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" /><line x1="10" y1="12" x2="14" y2="12" /></Svg>
            Tüm Sözleşmeler
          </button>
          <button type="button" onClick={() => setModal({ type: 'manual' })} className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white text-[11px] font-bold rounded-md shadow-sm">
            <Svg className="w-3.5 h-3.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></Svg>
            Manuel Sözleşme Ekle
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3">
        {kpis.map((kpi) => {
          const cm = CM[kpi.clr];
          return (
            <div key={kpi.label} className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-3.5">
              <p className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">{kpi.label}</p>
              <p className={`text-[22px] font-bold ${cm.t} font-mono leading-none mb-0.5`}>{kpi.value}</p>
              <p className="text-[9px] text-gray-400 dark:text-gray-500">{kpi.sub}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
        <div className="p-3 border-b border-gray-100 dark:border-gray-700/40 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1 flex-wrap">
            {statusTabs.map((tab) => {
              const active = status === tab.k;
              const activeClass = tab.clr === 'gray' ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 border-gray-900 dark:border-gray-100' : `bg-${tab.clr}-100 dark:bg-${tab.clr}-500/15 border-2 border-${tab.clr}-500 dark:border-${tab.clr}-500/60 text-${tab.clr}-700 dark:text-${tab.clr}-300`;
              const inactiveClass = tab.clr === 'gray' ? 'bg-white dark:bg-[#1e1f26] text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-50' : `bg-${tab.clr}-50/40 dark:bg-${tab.clr}-500/5 border-${tab.clr}-200/60 dark:border-${tab.clr}-500/20 text-${tab.clr}-600/80 dark:text-${tab.clr}-400/70 hover:bg-${tab.clr}-50`;
              return (
                <button key={tab.k} type="button" onClick={() => setStatus(tab.k)} className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-md border transition-all ${active ? activeClass : inactiveClass}`}>
                  {tab.lbl}
                  <span className={`text-[9px] font-mono ${active ? 'opacity-80' : 'opacity-50'}`}>({tab.count})</span>
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-1">
            <div className="relative">
              <Svg className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 w-3 h-3"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></Svg>
              <input type="text" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Müşteri veya SZL no..." className="pl-7 pr-2 py-1.5 text-[10px] bg-gray-50 dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded text-gray-900 dark:text-gray-100 focus:outline-none focus:border-violet-500 w-44" />
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-gray-700/30">
          {filtered.length === 0 ? <div className="p-8 text-center text-[11px] text-gray-400 dark:text-gray-500">Filtreye uygun sözleşme bulunamadı</div> : filtered.map((contract) => (
            <SalesContractCard key={contract.id} contract={contract} onAction={showToast} onOpen={() => setModal({ type: 'action', contract })} />
          ))}
        </div>

        <div className="p-3 bg-gray-50 dark:bg-[#17181f] border-t border-gray-100 dark:border-gray-700/40 flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-400 flex-wrap gap-2">
          <span>{filtered.length} sözleşme · Toplam değer: <span className="font-bold font-mono text-gray-900 dark:text-gray-100">{money(filtered.reduce((a, x) => a + x.amount, 0))}</span></span>
          <button type="button" onClick={() => showToast('Export', 'Sözleşme listesi CSV/Excel olarak indiriliyor', 'violet')} className="text-[10px] font-semibold text-violet-700 dark:text-violet-300 hover:underline">Tümünü İndir ↓</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
          <div className="p-3 border-b border-gray-100 dark:border-gray-700/40 flex items-center gap-2">
            <Svg className="text-violet-600 dark:text-violet-400 w-3.5 h-3.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="2" x2="12" y2="22" /></Svg>
            <h3 className="text-[12px] font-bold text-gray-900 dark:text-gray-100">Ödeme Şekli Dağılımı</h3>
          </div>
          <div className="p-3 space-y-2">
            {paymentDistribution.map(({ key, conf, count, pct }) => {
              const cm = CM[conf.clr];
              return (
                <div key={key}>
                  <div className="flex items-center justify-between text-[10px] mb-0.5">
                    <div className="flex items-center gap-1.5">
                      <Svg className={`${cm.t} w-3 h-3`}>{conf.icon}</Svg>
                      <span className="text-gray-700 dark:text-gray-300 font-medium">{conf.lbl}</span>
                    </div>
                    <span className="font-mono text-gray-500 dark:text-gray-400"><span className={`font-bold ${cm.t}`}>{count}</span> · {pct}%</span>
                  </div>
                  <div className="h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className={`h-full ${cm.bar} rounded-full`} style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-gradient-to-br from-rose-50 to-amber-50/50 dark:from-rose-500/5 dark:to-amber-500/5 border border-rose-200 dark:border-rose-500/30 rounded-xl overflow-hidden">
          <div className="p-3 border-b border-rose-200/50 dark:border-rose-500/20 flex items-center gap-2">
            <Svg className="text-rose-600 dark:text-rose-400 w-3.5 h-3.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></Svg>
            <h3 className="text-[12px] font-bold text-rose-900 dark:text-rose-200">Bugün Yapılacaklar</h3>
          </div>
          <div className="p-2.5 space-y-1.5">
            {todayActions.length === 0 ? <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center p-2">Bugün için bekleyen aksiyon yok ✓</p> : todayActions.map((contract) => (
              <div key={contract.id} className="p-2 bg-white dark:bg-[#1e1f26] border border-rose-200 dark:border-rose-500/30 rounded text-[10px]">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <span className="font-semibold text-gray-900 dark:text-gray-100 truncate">{contract.customer}</span>
                  <span className="font-mono font-bold text-rose-700 dark:text-rose-300 shrink-0">{compactMoney(contract.pesinatAmount)}</span>
                </div>
                <p className="text-gray-500 dark:text-gray-400 truncate">{contract.actions[0]}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
          <div className="p-3 border-b border-gray-100 dark:border-gray-700/40 flex items-center gap-2">
            <Svg className="text-indigo-600 dark:text-indigo-400 w-3.5 h-3.5"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></Svg>
            <h3 className="text-[12px] font-bold text-gray-900 dark:text-gray-100">Bu Hafta</h3>
          </div>
          <div className="p-3 space-y-2">
            <WeekStat label="Gelen Sözleşme" value={String(stats.total)} />
            <WeekStat label="İşlenen" value={`${stats.done}/${stats.total}`} className="text-emerald-700 dark:text-emerald-300" />
            <WeekStat label="Peşinat Faturası" value={compactMoney(stats.pesinatPending)} className="text-amber-700 dark:text-amber-300" />
            <WeekStat label="Hizmet Anlaşmasına" value="2 → dönüşecek" className="text-violet-700 dark:text-violet-300" />
            <div className="pt-2 mt-2 border-t border-gray-100 dark:border-gray-700/40 flex items-center justify-between text-[11px]">
              <span className="text-gray-600 dark:text-gray-400 font-semibold">Haftalık Ciro Yazımı</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-300 font-mono">{compactMoney(stats.totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>

      <div ref={archiveRef} id="arsivSection" className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden scroll-mt-4">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700/40">
          <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
            <div className="flex items-center gap-2">
              <Svg className="text-violet-600 dark:text-violet-400 w-4 h-4"><rect x="2" y="3" width="20" height="5" rx="1" /><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" /><line x1="10" y1="12" x2="14" y2="12" /></Svg>
              <div>
                <h3 className="text-[14px] font-bold text-gray-900 dark:text-gray-100">Tüm Sözleşmeler · Arşiv</h3>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">{archiveScope.length} sözleşme · aktif + geçmiş · tarih, müşteri ve hizmet bazlı filtrelenebilir</p>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold text-violet-700 dark:text-violet-300">{archiveFiltered.length} gösteriliyor · {compactMoney(archiveFiltered.reduce((a, x) => a + x.amount, 0))}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
            <div className="relative">
              <Svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></Svg>
              <input type="text" value={archiveFilters.search} onChange={(event) => setArchiveFilters((prev) => ({ ...prev, search: event.target.value }))} placeholder="Müşteri, hizmet veya SZL no..." className="w-full pl-8 pr-2 py-2 text-[11px] bg-gray-50 dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:border-violet-500" />
            </div>
            <select value={archiveFilters.period} onChange={(event) => setArchiveFilters((prev) => ({ ...prev, period: event.target.value as ArchiveFilters['period'] }))} className="w-full px-3 py-2 text-[11px] bg-gray-50 dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:border-violet-500">
              <option value="all">Tüm tarihler</option>
              <option value="30">Son 30 gün</option>
              <option value="90">Son 3 ay</option>
              <option value="180">Son 6 ay</option>
              <option value="365">Son 1 yıl</option>
            </select>
            <select value={archiveFilters.customer} onChange={(event) => setArchiveFilters((prev) => ({ ...prev, customer: event.target.value }))} className="w-full px-3 py-2 text-[11px] bg-gray-50 dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:border-violet-500">
              <option value="all">Tüm müşteriler</option>
              {uniqueCustomers.map((customer) => <option key={customer} value={customer}>{customer}</option>)}
            </select>
            <select value={archiveFilters.service} onChange={(event) => setArchiveFilters((prev) => ({ ...prev, service: event.target.value as ArchiveFilters['service'] }))} className="w-full px-3 py-2 text-[11px] bg-gray-50 dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:border-violet-500">
              <option value="all">Tüm hizmetler</option>
              {uniqueCategories.map((category) => <option key={category} value={category}>{categoryMap[category]}</option>)}
            </select>
          </div>

          {archiveFilters.period !== 'all' || archiveFilters.customer !== 'all' || archiveFilters.service !== 'all' || archiveFilters.search ? (
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="text-[9px] text-gray-500 dark:text-gray-400">Aktif filtreler:</span>
              {archiveFilters.search ? <span className="text-[9px] font-mono px-1.5 py-0.5 bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 rounded">arama: "{archiveFilters.search}"</span> : null}
              {archiveFilters.period !== 'all' ? <span className="text-[9px] font-mono px-1.5 py-0.5 bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300 rounded">tarih: {archiveFilters.period}g</span> : null}
              {archiveFilters.customer !== 'all' ? <span className="text-[9px] font-mono px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 rounded">{archiveFilters.customer}</span> : null}
              {archiveFilters.service !== 'all' ? <span className="text-[9px] font-mono px-1.5 py-0.5 bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 rounded">{categoryMap[archiveFilters.service]}</span> : null}
              <button type="button" onClick={() => setArchiveFilters({ period: 'all', customer: 'all', service: 'all', search: '' })} className="text-[9px] text-gray-500 hover:text-rose-600 dark:hover:text-rose-400 underline ml-1">Temizle</button>
            </div>
          ) : null}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead className="bg-gray-50 dark:bg-[#17181f]">
              <tr className="border-b border-gray-200 dark:border-gray-700/30">
                <th className="text-left px-3 py-2 font-semibold text-gray-500 dark:text-gray-400">SZL No</th>
                <th className="text-left px-3 py-2 font-semibold text-gray-500 dark:text-gray-400 hidden md:table-cell">Tarih</th>
                <th className="text-left px-3 py-2 font-semibold text-gray-500 dark:text-gray-400">Müşteri</th>
                <th className="text-left px-3 py-2 font-semibold text-gray-500 dark:text-gray-400">Hizmet</th>
                <th className="text-right px-3 py-2 font-semibold text-gray-500 dark:text-gray-400">Tutar</th>
                <th className="text-left px-3 py-2 font-semibold text-gray-500 dark:text-gray-400 hidden lg:table-cell">Ödeme</th>
                <th className="text-center px-3 py-2 font-semibold text-gray-500 dark:text-gray-400 hidden md:table-cell w-20">Şirket</th>
                <th className="text-center px-3 py-2 font-semibold text-gray-500 dark:text-gray-400 w-24">Durum</th>
                <th className="text-right px-3 py-2 font-semibold text-gray-500 dark:text-gray-400 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/30">
              {archiveFiltered.length === 0 ? (
                <tr><td colSpan={9} className="px-3 py-8 text-center text-gray-400 dark:text-gray-500">Bu filtrelere uygun sözleşme bulunamadı</td></tr>
              ) : archiveFiltered.map((contract) => {
                const companyCm = CM[contract.company === 'digital' ? 'emerald' : 'indigo'];
                const statusCm = CM[statusClr[contract.status]];
                return (
                  <tr key={contract.id} className={`hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer ${contract.status === 'archived' ? 'opacity-60' : ''}`} onClick={() => setModal({ type: 'action', contract })}>
                    <td className="px-3 py-2.5 font-mono text-[10px] text-gray-500 dark:text-gray-500">{contract.id}</td>
                    <td className="px-3 py-2.5 hidden md:table-cell font-mono text-[10px] text-gray-500 dark:text-gray-500">{contract.date}</td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-gray-700 dark:text-gray-300 font-medium truncate">{contract.customer}</span>
                        {contract.customer.includes('Bosch') ? <span className="text-[8px] font-bold px-1 py-0.5 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 rounded shrink-0">★</span> : null}
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-gray-600 dark:text-gray-400 truncate max-w-xs">{contract.service}</td>
                    <td className="px-3 py-2.5 text-right font-mono font-bold text-gray-900 dark:text-gray-100">{money(contract.amount)}</td>
                    <td className="px-3 py-2.5 hidden lg:table-cell text-[10px] text-gray-600 dark:text-gray-400">{payConf[contract.paymentType].lbl}</td>
                    <td className="px-3 py-2.5 text-center hidden md:table-cell">
                      <span className={`inline-block min-w-[52px] text-center text-[9px] font-bold px-1.5 py-0.5 ${companyCm.bg} ${companyCm.t} rounded`}>{contract.company === 'digital' ? 'Digital' : 'Bilişim'}</span>
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <span className={`inline-block min-w-[66px] text-[9px] font-bold px-1.5 py-0.5 ${statusCm.bg} ${statusCm.t} rounded`}>{statusLbl[contract.status]}</span>
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <span className="text-gray-400 hover:text-violet-600 dark:hover:text-violet-400"><Svg className="w-3.5 h-3.5"><polyline points="9 18 15 12 9 6" /></Svg></span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-gray-50 dark:bg-[#17181f] border-t border-gray-100 dark:border-gray-700/40 flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-400 flex-wrap gap-2">
          <span>{archiveFiltered.length} sözleşme gösteriliyor · Aktif: <span className="font-bold text-emerald-700 dark:text-emerald-300">{archiveFiltered.filter((x) => x.status === 'active').length}</span> · Tamamlanan: <span className="font-bold text-sky-700 dark:text-sky-300">{archiveFiltered.filter((x) => x.status === 'completed').length}</span> · Arşiv: <span className="font-bold text-gray-500">{archiveFiltered.filter((x) => x.status === 'archived').length}</span></span>
          <button type="button" onClick={() => showToast('Arşiv Export', 'Filtrelenmiş sözleşme listesi CSV/Excel olarak indiriliyor · PDF dosyaları ZIP paketi', 'violet')} className="text-[10px] font-semibold text-violet-700 dark:text-violet-300 hover:underline">Arşivi İndir (ZIP) ↓</button>
        </div>
      </div>

      <div className="bg-gradient-to-br from-violet-50/50 via-transparent to-sky-50/50 dark:from-violet-500/5 dark:to-sky-500/5 border border-violet-200/50 dark:border-violet-500/20 rounded-xl p-3 flex items-start gap-2.5">
        <Svg className="text-violet-600 dark:text-violet-400 w-4 h-4 shrink-0 mt-0.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></Svg>
        <div className="flex-1">
          <p className="text-[11px] text-gray-700 dark:text-gray-300">
            <span className="font-bold text-violet-700 dark:text-violet-300">Nasıl çalışır:</span> Satış Panosunda imzalanan sözleşme otomatik olarak Finansa düşer. <span className="text-emerald-700 dark:text-emerald-300 font-semibold">Peşin</span> ödemeler → tek fatura · <span className="text-amber-700 dark:text-amber-300 font-semibold">Peşinat + Taksit</span> → peşinat faturası + kalan için ödeme planı · <span className="text-sky-700 dark:text-sky-300 font-semibold">Eşit Taksit</span> → 3/6/12 ay bölünmüş faturalar · <span className="text-violet-700 dark:text-violet-300 font-semibold">Aylık</span> → Hizmet Anlaşmasına dönüştürülür, her ay otomatik fatura.
          </p>
        </div>
      </div>
    </div>
  );
}

function SalesContractCard({ contract, onAction, onOpen }: { contract: SalesContract; onAction: (title: string, message: string, color: ColorName) => void; onOpen: () => void }) {
  const pay = payConf[contract.paymentType];
  const payCm = CM[pay.clr];
  const stt = statusConf[contract.status];
  const sttCm = CM[stt.clr];
  const companyCm = CM[contract.company === 'digital' ? 'emerald' : 'indigo'];
  const urgency = contract.urgency === 'high' ? { clr: 'rose' as ColorName, lbl: 'ACİL' } : contract.urgency === 'medium' ? { clr: 'amber' as ColorName, lbl: 'Orta' } : { clr: 'gray' as ColorName, lbl: 'Normal' };
  const urgencyCm = CM[urgency.clr];

  return (
    <div className={`p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${contract.status === 'done' ? 'opacity-70' : ''}`}>
      <div className="grid grid-cols-12 gap-3 items-start">
        <div className="col-span-12 lg:col-span-5">
          <div className="flex items-start gap-2.5">
            <div className={`relative w-10 h-10 ${payCm.bg} rounded-lg flex items-center justify-center shrink-0`}>
              <Svg className={`${payCm.t} w-4 h-4`}>{pay.icon}</Svg>
              {contract.urgency === 'high' && contract.status !== 'done' ? <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white dark:border-[#1e1f26] animate-pulse"></span> : null}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                <h3 className="text-[13px] font-bold text-gray-900 dark:text-gray-100 truncate">{contract.customer}</h3>
                {contract.customer.includes('Bosch') ? <span className="text-[8px] font-bold px-1 py-0.5 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 rounded shrink-0">★</span> : null}
                <span className={`inline-block min-w-[52px] text-center text-[9px] font-bold px-1.5 py-0.5 ${companyCm.bg} ${companyCm.t} rounded`}>{contract.company === 'digital' ? 'Digital' : 'Bilişim'}</span>
              </div>
              <p className="text-[11px] text-gray-600 dark:text-gray-400 mb-1">{contract.service}</p>
              <div className="flex items-center gap-2 flex-wrap text-[9px] font-mono text-gray-400 dark:text-gray-500">
                <span>{contract.id}</span>
                <span>·</span>
                <span>Satış: {contract.salesRep}</span>
                <span>·</span>
                <span>{contract.arrivedAt}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4">
          <div className="p-2.5 bg-gray-50 dark:bg-[#17181f] border border-gray-100 dark:border-gray-700/40 rounded-lg">
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-1.5">
                <span className={`text-[9px] font-bold ${payCm.t} uppercase tracking-wider`}>{pay.lbl}</span>
              </div>
              <span className="text-[13px] font-black text-gray-900 dark:text-gray-100 font-mono">{compactMoney(contract.amount)}</span>
            </div>
            <p className="text-[10px] text-gray-600 dark:text-gray-400 leading-snug">{contract.paymentDetail}</p>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-3 flex lg:flex-col items-start lg:items-end gap-2 justify-between">
          <div className="flex items-center gap-1.5">
            <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 ${sttCm.bg} ${sttCm.t} rounded`}>
              <span className={`w-1.5 h-1.5 ${stt.dotClass} rounded-full ${contract.status === 'new' ? 'animate-pulse' : ''}`}></span>
              {stt.badge}
            </span>
            {contract.status !== 'done' ? <span className={`text-[9px] font-bold ${urgencyCm.t}`}>{urgency.lbl === 'ACİL' ? '⚠' : ''}{urgency.lbl}</span> : null}
          </div>
          <button type="button" onClick={onOpen} className={`flex items-center gap-1.5 px-3 py-1.5 ${contract.status === 'done' ? 'bg-gray-100 dark:bg-gray-700/30 text-gray-500 dark:text-gray-400' : 'bg-violet-600 hover:bg-violet-700 text-white'} text-[11px] font-bold rounded-md shadow-sm transition-all`}>
            {contract.status === 'done' ? 'Detay Gör' : 'Aksiyon Seç'}
            <Svg className="w-3 h-3"><polyline points="9 18 15 12 9 6" /></Svg>
          </button>
        </div>
      </div>

      {contract.status !== 'done' ? (
        <div className="mt-3 pt-3 border-t border-dashed border-gray-200 dark:border-gray-700/40">
          <div className="flex items-start gap-2">
            <Svg className="text-amber-500 w-3 h-3 mt-0.5 shrink-0"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></Svg>
            <div className="flex-1">
              <p className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Önerilen Finans Aksiyonları</p>
              <div className="flex items-center gap-2 flex-wrap">
                {contract.actions.map((action, index) => (
                  <button key={action} type="button" onClick={() => onAction('Aksiyon Başlatıldı', `${action} · işlem başlatıldı`, index === 0 ? 'emerald' : 'violet')} className={`flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-semibold ${index === 0 ? 'bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-500/20' : 'bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/30 text-violet-700 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-500/20'} rounded-md`}>
                    {index === 0 ? <Svg className="w-3 h-3"><circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" /></Svg> : <Svg className="w-3 h-3"><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></Svg>}
                    {action}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-3 pt-3 border-t border-dashed border-emerald-200 dark:border-emerald-700/40">
          <div className="flex items-center gap-2">
            <Svg className="text-emerald-500 w-3 h-3 shrink-0"><polyline points="20 6 9 17 4 12" /></Svg>
            <div className="flex items-center gap-2 flex-wrap text-[10px] text-gray-500 dark:text-gray-400">
              {contract.actions.map((action, index) => (
                <span key={action} className={index % 2 === 0 ? 'text-emerald-700 dark:text-emerald-300' : 'text-gray-300 dark:text-gray-600'}>{index % 2 === 0 ? action : `· ${action}`}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function WeekStat({ label, value, className = 'text-gray-900 dark:text-gray-100' }: { label: string; value: string; className?: string }) {
  return (
    <div className="flex items-center justify-between text-[11px]">
      <span className="text-gray-600 dark:text-gray-400">{label}</span>
      <span className={`font-bold font-mono ${className}`}>{value}</span>
    </div>
  );
}
