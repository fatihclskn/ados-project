import { type ReactNode, useMemo, useState } from 'react';

type ColorName = 'emerald' | 'amber' | 'rose' | 'sky' | 'violet' | 'indigo' | 'teal' | 'gray' | 'pink';
type ContractType = 'aylik' | 'yillik' | 'tek';
type ContractFilter = ContractType | 'all';
type ContractStatus = 'active' | 'renewal' | 'ending' | 'upcoming';
type ContractCategory = 'seo' | 'ads' | 'sosyal' | 'website' | 'analytics' | 'brand' | 'premium';

type Contract = {
  id: string;
  customer: string;
  service: string;
  category: ContractCategory;
  type: ContractType;
  amount: number;
  start: string;
  end: string;
  status: ContractStatus;
  company: 'digital' | 'bilisim';
  months: number;
  nextInvoice: string;
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
  pink: { bg: 'bg-pink-100 dark:bg-pink-900/30', t: 'text-pink-700 dark:text-pink-300', bar: 'bg-gradient-to-r from-pink-400 to-pink-600' },
};

const contracts: Contract[] = [
  { id: 'CTR-2025-087', customer: 'Bosch Türkiye', service: 'SEO Yönetimi', category: 'seo', type: 'aylik', amount: 48000, start: '01.01.2025', end: '31.12.2025', status: 'active', company: 'digital', months: 4, nextInvoice: '01.05.2026' },
  { id: 'CTR-2025-088', customer: 'Bosch Türkiye', service: 'Google Ads Yönetimi', category: 'ads', type: 'aylik', amount: 52000, start: '01.01.2025', end: '31.12.2025', status: 'active', company: 'digital', months: 4, nextInvoice: '01.05.2026' },
  { id: 'CTR-2025-089', customer: 'Bosch Türkiye', service: 'Sosyal Medya Yönetimi', category: 'sosyal', type: 'aylik', amount: 42000, start: '01.01.2025', end: '31.12.2025', status: 'active', company: 'digital', months: 4, nextInvoice: '01.05.2026' },
  { id: 'CTR-2026-012', customer: 'TechNova Yazılım', service: 'Dijital Pazarlama', category: 'premium', type: 'aylik', amount: 36000, start: '01.02.2026', end: '31.01.2027', status: 'active', company: 'digital', months: 3, nextInvoice: '01.05.2026' },
  { id: 'CTR-2026-018', customer: 'BigBrand Reklam A.Ş.', service: 'Ads Yönetimi', category: 'ads', type: 'aylik', amount: 28000, start: '15.03.2026', end: '15.03.2027', status: 'active', company: 'digital', months: 1, nextInvoice: '15.05.2026' },
  { id: 'CTR-2026-019', customer: 'FastGrow Digital', service: 'SEO Yönetimi', category: 'seo', type: 'aylik', amount: 24500, start: '01.02.2026', end: '31.01.2027', status: 'active', company: 'bilisim', months: 3, nextInvoice: '01.05.2026' },
  { id: 'CTR-2026-024', customer: 'MegaMarka Perakende', service: 'Website Yönetimi', category: 'website', type: 'aylik', amount: 18000, start: '01.03.2026', end: '28.02.2027', status: 'active', company: 'bilisim', months: 2, nextInvoice: '01.05.2026' },
  { id: 'CTR-2026-028', customer: 'Aydın Holding', service: 'Analytics & Data', category: 'analytics', type: 'aylik', amount: 32000, start: '01.04.2026', end: '31.03.2027', status: 'renewal', company: 'digital', months: 1, nextInvoice: '01.05.2026' },
  { id: 'CTR-2026-030', customer: 'Karataş İnşaat', service: 'Sosyal Medya', category: 'sosyal', type: 'aylik', amount: 12000, start: '10.04.2026', end: '10.04.2027', status: 'active', company: 'bilisim', months: 0, nextInvoice: '10.05.2026' },
  { id: 'CTR-2026-031', customer: 'Ekin Tarım', service: 'SEO + Ads Paketi', category: 'premium', type: 'aylik', amount: 22000, start: '15.04.2026', end: '15.04.2027', status: 'active', company: 'bilisim', months: 0, nextInvoice: '15.05.2026' },
  { id: 'CTR-2025-092', customer: 'Platin Otomotiv', service: 'All-in-One Premium', category: 'premium', type: 'aylik', amount: 68000, start: '01.01.2026', end: '31.12.2026', status: 'active', company: 'digital', months: 4, nextInvoice: '01.05.2026' },
  { id: 'CTR-2026-003', customer: 'Platin Otomotiv', service: 'Yıllık CRM Lisansı', category: 'website', type: 'yillik', amount: 180000, start: '15.03.2026', end: '14.03.2027', status: 'active', company: 'digital', months: 1, nextInvoice: '—' },
  { id: 'CTR-2026-007', customer: 'Bosch Türkiye', service: 'Yıllık Hosting + Domain', category: 'website', type: 'yillik', amount: 120000, start: '01.01.2026', end: '31.12.2026', status: 'active', company: 'digital', months: 4, nextInvoice: '—' },
  { id: 'CTR-2025-156', customer: 'BigBrand Reklam A.Ş.', service: 'Yıllık SEO Paketi', category: 'seo', type: 'yillik', amount: 96000, start: '15.06.2025', end: '14.06.2026', status: 'ending', company: 'digital', months: 11, nextInvoice: '—' },
  { id: 'CTR-2026-025', customer: 'MegaMarka Perakende', service: 'Website Redesign', category: 'website', type: 'tek', amount: 68000, start: '15.04.2026', end: '30.05.2026', status: 'active', company: 'bilisim', months: 0, nextInvoice: '—' },
  { id: 'CTR-2026-027', customer: 'Aydın Holding', service: 'SEO Teknik Audit', category: 'seo', type: 'tek', amount: 42000, start: '08.04.2026', end: '30.04.2026', status: 'active', company: 'digital', months: 0, nextInvoice: '—' },
  { id: 'CTR-2026-032', customer: 'BigBrand Reklam A.Ş.', service: 'Facebook Kampanyası', category: 'ads', type: 'tek', amount: 48000, start: '01.05.2026', end: '31.05.2026', status: 'upcoming', company: 'digital', months: 0, nextInvoice: '—' },
  { id: 'CTR-2026-033', customer: 'Ekin Tarım', service: 'Logo + Kurumsal Kimlik', category: 'brand', type: 'tek', amount: 28000, start: '10.04.2026', end: '10.05.2026', status: 'active', company: 'bilisim', months: 0, nextInvoice: '—' },
];

const catConf: Record<ContractCategory, { lbl: string; clr: ColorName; icon: ReactNode }> = {
  seo: { lbl: 'SEO', clr: 'emerald', icon: <><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></> },
  ads: { lbl: 'Ads / SEM', clr: 'sky', icon: <><circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" /></> },
  sosyal: { lbl: 'Sosyal Medya', clr: 'rose', icon: <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></> },
  website: { lbl: 'Website', clr: 'indigo', icon: <><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /></> },
  analytics: { lbl: 'Analytics', clr: 'violet', icon: <><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></> },
  brand: { lbl: 'Marka/Tasarım', clr: 'pink', icon: <><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></> },
  premium: { lbl: 'Premium', clr: 'amber', icon: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /> },
};

const typeConf: Record<ContractType, { lbl: string; clr: ColorName; shortLbl: string }> = {
  aylik: { lbl: 'AYLIK', clr: 'emerald', shortLbl: 'Aylık' },
  yillik: { lbl: 'YILLIK', clr: 'violet', shortLbl: 'Yıllık' },
  tek: { lbl: 'TEK SEFERLİK', clr: 'amber', shortLbl: 'Tek Seferlik' },
};

const statusConf: Record<ContractStatus, { lbl: string; clr: ColorName; dotClass: string }> = {
  active: { lbl: 'Aktif', clr: 'emerald', dotClass: 'bg-emerald-500' },
  renewal: { lbl: 'Yenileme Gerekli', clr: 'amber', dotClass: 'bg-amber-500' },
  ending: { lbl: 'Bitmek Üzere', clr: 'rose', dotClass: 'bg-rose-500' },
  upcoming: { lbl: 'Başlayacak', clr: 'sky', dotClass: 'bg-sky-500' },
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
  return `₺${(value / 1000).toFixed(0)}K`;
}

function ContentToast({ title, message, color = 'sky', onClose }: { title: string; message: string; color?: ColorName; onClose: () => void }) {
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

function NewAgreementModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [agreementType, setAgreementType] = useState<ContractType>('aylik');
  const [months, setMonths] = useState(12);

  return (
    <div className="absolute inset-0 z-30 flex items-start justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="modal-scroll bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-xl w-full max-w-[680px] max-h-[82vh] overflow-y-auto pointer-events-auto">
        <div className="sticky top-0 z-10 bg-white dark:bg-[#1e1f26] border-b border-gray-100 dark:border-gray-700/60 p-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-sky-100 dark:bg-sky-500/20 rounded-lg flex items-center justify-center">
              <Svg className="text-sky-600 dark:text-sky-400 w-4 h-4"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></Svg>
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-gray-900 dark:text-gray-100">Yeni Hizmet Anlaşması</h2>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">Müşteri · hizmet · süre · tutar · otomatik fatura tetikleme</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1">
            <Svg className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Svg>
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wider">Anlaşma Hangi Şirketten? *</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <label className="cursor-pointer">
                <input type="radio" name="anlasmaCompany" value="digital" className="sr-only peer" defaultChecked />
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
                <input type="radio" name="anlasmaCompany" value="bilisim" className="sr-only peer" />
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
            <label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wider">Anlaşma Türü *</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { k: 'aylik' as ContractType, label: 'Aylık', desc: 'Her ay fatura', clr: 'emerald' },
                { k: 'yillik' as ContractType, label: 'Yıllık', desc: 'Tek fatura', clr: 'violet' },
                { k: 'tek' as ContractType, label: 'Tek Seferlik', desc: 'Proje · arşiv', clr: 'amber' },
              ].map((type) => (
                <label key={type.k} className="cursor-pointer">
                  <input type="radio" name="anlasmaType" value={type.k} className="sr-only peer" checked={agreementType === type.k} onChange={() => setAgreementType(type.k)} />
                  <div className={`p-2.5 bg-white dark:bg-[#17181f] border-2 border-gray-200 dark:border-gray-700 peer-checked:border-${type.clr}-500 peer-checked:bg-${type.clr}-50 dark:peer-checked:bg-${type.clr}-500/10 rounded-lg text-center transition-all`}>
                    <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100">{type.label}</p>
                    <p className="text-[9px] text-gray-500 dark:text-gray-400 mt-0.5">{type.desc}</p>
                  </div>
                </label>
              ))}
            </div>

            {agreementType === 'aylik' ? (
              <div id="aylikDetay" className="mt-3 p-3 bg-emerald-50/60 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-lg">
                <div className="flex items-center gap-1.5 mb-2">
                  <Svg className="text-emerald-600 dark:text-emerald-400 w-3.5 h-3.5"><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></Svg>
                  <p className="text-[11px] font-bold text-emerald-800 dark:text-emerald-200">Otomatik Fatura Ayarları</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1">Kaç ay otomatik fatura kesilecek? *</label>
                    <div className="flex items-center gap-1 flex-wrap mb-1.5">
                      {[3, 6, 12, 24].map((month) => (
                        <button
                          key={month}
                          type="button"
                          onClick={() => setMonths(month)}
                          data-ay={month}
                          className={`oto-ay-btn px-2.5 py-1 text-[10px] font-semibold bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:border-emerald-300 dark:hover:border-emerald-500/40 ${months === month ? 'bg-emerald-100 dark:bg-emerald-500/20 border-emerald-400 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-400' : ''}`}
                        >
                          {month} ay
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <input type="number" id="otoAyInput" min="1" max="120" value={months} onChange={(event) => setMonths(Number(event.target.value))} className="w-20 px-2.5 py-1.5 text-[11px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono text-right focus:outline-none focus:border-emerald-500" />
                      <span className="text-[10px] text-gray-500 dark:text-gray-400">ay</span>
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-mono ml-auto" id="faturaSayisi">{months} fatura kesilecek</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1">Her ayın hangi günü fatura kesilsin?</label>
                    <select className="w-full px-2.5 py-1.5 text-[11px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono focus:outline-none focus:border-emerald-500">
                      <option>Ayın 1'i (önerilen)</option>
                      <option>Ayın 5'i</option>
                      <option>Ayın 10'u</option>
                      <option>Ayın 15'i</option>
                      <option>Ayın 20'si</option>
                      <option>Ayın 25'i</option>
                      <option>Ayın son günü</option>
                      <option>Sözleşme başlangıç günü</option>
                    </select>
                    <p className="text-[9px] text-gray-500 dark:text-gray-400 mt-1">Paraşüt her ay bu tarihte otomatik fatura kesecek</p>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-emerald-200 dark:border-emerald-500/30 flex items-start gap-1.5">
                  <Svg className="text-emerald-600 dark:text-emerald-400 w-3 h-3 shrink-0 mt-0.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></Svg>
                  <p className="text-[9px] text-emerald-700 dark:text-emerald-300">Her ayın belirlenen gününde otomatik fatura kesilip müşteriye iletilir · istediğiniz ay sayısı kadar tekrar eder · anlaşma bittiğinde otomatik durur</p>
                </div>
              </div>
            ) : null}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Müşteri (Paraşüt Cari) *</label>
              <select className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:border-sky-500">
                <option>Müşteri seçin...</option>
                <option>Bosch Türkiye</option>
                <option>BigBrand Reklam A.Ş.</option>
                <option>FastGrow Digital</option>
                <option>TechNova Yazılım</option>
                <option>MegaMarka Perakende</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Hizmet Kategorisi</label>
              <select className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:border-sky-500">
                <option>SEO</option>
                <option>Google Ads / SEM</option>
                <option>Sosyal Medya</option>
                <option>Website Tasarım/Geliştirme</option>
                <option>Analytics & Data</option>
                <option>Marka/Tasarım</option>
                <option>Premium (Paket)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Hizmet Adı *</label>
            <input type="text" placeholder="Örn: SEO Yönetimi · Google Ads Kampanya · Website Redesign" className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:border-sky-500" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Tutar *</label><input type="text" placeholder="0,00" className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono text-right focus:outline-none focus:border-sky-500" /></div>
            <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Para Birimi</label><select className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono focus:outline-none focus:border-sky-500"><option>TRY</option><option>USD</option><option>EUR</option></select></div>
            <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Başlangıç</label><input type="date" defaultValue="2026-04-23" className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono focus:outline-none focus:border-sky-500" /></div>
            <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Bitiş</label><input type="date" defaultValue="2027-04-22" className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono focus:outline-none focus:border-sky-500" /></div>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Notlar</label>
            <textarea rows={2} placeholder="Anlaşma detayları, özel şartlar..." className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 resize-none focus:outline-none focus:border-sky-500" />
          </div>

          <div className="p-3 bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/30 rounded-md flex items-start gap-2">
            <Svg className="text-sky-600 dark:text-sky-400 w-4 h-4 shrink-0 mt-0.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></Svg>
            <div className="text-[10px]">
              <p className="font-bold text-sky-900 dark:text-sky-200">Otomatik fatura tetikleme</p>
              <p className="text-sky-700 dark:text-sky-300 mt-0.5">Aylık anlaşmalar her ayın belirli gününde otomatik fatura kesecek şekilde kurulur · Yıllık anlaşmalar başlangıçta tek fatura · Tek seferlik projeler bitince arşive taşınır.</p>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white dark:bg-[#1e1f26] border-t border-gray-100 dark:border-gray-700/60 p-4 flex items-center justify-end gap-2">
          <button type="button" onClick={onClose} className="px-3 py-2 text-[11px] font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">İptal</button>
          <button type="button" onClick={onSaved} className="flex items-center gap-1.5 px-4 py-2 text-[11px] font-bold bg-sky-600 hover:bg-sky-700 text-white rounded-md">
            <Svg className="w-3 h-3"><polyline points="20 6 9 17 4 12" /></Svg>
            Anlaşmayı Oluştur
          </button>
        </div>
      </div>
    </div>
  );
}

export default function HizmetAnlasmalari() {
  const [filter, setFilter] = useState<ContractFilter>('all');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState<{ title: string; message: string; color?: ColorName } | null>(null);

  const filtered = useMemo(() => {
    const term = search.trim().toLocaleLowerCase('tr-TR');
    return contracts.filter((contract) => {
      const matchesType = filter === 'all' || contract.type === filter;
      const matchesSearch = !term || contract.customer.toLocaleLowerCase('tr-TR').includes(term) || contract.service.toLocaleLowerCase('tr-TR').includes(term) || contract.id.toLocaleLowerCase('tr-TR').includes(term);
      return matchesType && matchesSearch;
    });
  }, [filter, search]);

  const stats = {
    total: contracts.length,
    aylik: contracts.filter((x) => x.type === 'aylik').length,
    yillik: contracts.filter((x) => x.type === 'yillik').length,
    tek: contracts.filter((x) => x.type === 'tek').length,
    mrr: contracts.filter((x) => x.type === 'aylik').reduce((a, x) => a + x.amount, 0),
    arr: contracts.filter((x) => x.type === 'yillik').reduce((a, x) => a + x.amount, 0),
    tekAmount: contracts.filter((x) => x.type === 'tek').reduce((a, x) => a + x.amount, 0),
    renewal: contracts.filter((x) => x.status === 'renewal').length,
    ending: contracts.filter((x) => x.status === 'ending').length,
  };

  const categoryCounts = useMemo(() => {
    const counts = contracts.reduce<Partial<Record<ContractCategory, number>>>((acc, contract) => {
      acc[contract.category] = (acc[contract.category] || 0) + 1;
      return acc;
    }, {});
    return (Object.entries(counts) as Array<[ContractCategory, number]>).sort((a, b) => b[1] - a[1]);
  }, []);

  const filterTabs: Array<{ k: ContractFilter; lbl: string; count: number; clr: ColorName }> = [
    { k: 'all', lbl: 'Tümü', count: stats.total, clr: 'gray' },
    { k: 'aylik', lbl: 'Aylık', count: stats.aylik, clr: 'emerald' },
    { k: 'yillik', lbl: 'Yıllık', count: stats.yillik, clr: 'violet' },
    { k: 'tek', lbl: 'Tek Seferlik', count: stats.tek, clr: 'amber' },
  ];

  const kpis: Array<{ label: string; value: string; sub: string; clr: ColorName }> = [
    { label: 'Toplam Aktif', value: String(stats.total), sub: 'Tüm türler birleşik', clr: 'sky' },
    { label: 'Aylık MRR', value: compactMoney(stats.mrr), sub: `${stats.aylik} aylık anlaşma`, clr: 'emerald' },
    { label: 'Yıllık ARR', value: compactMoney(stats.arr), sub: `${stats.yillik} yıllık anlaşma`, clr: 'violet' },
    { label: 'Tek Seferlik', value: compactMoney(stats.tekAmount), sub: `${stats.tek} aktif proje`, clr: 'amber' },
    { label: 'Yenileme', value: String(stats.renewal), sub: 'Müzakere edilmeli', clr: 'amber' },
    { label: 'Bitiyor (30g)', value: String(stats.ending), sub: 'Yenileme fırsatı', clr: 'rose' },
  ];

  const showToast = (title: string, message: string, color: ColorName = 'sky') => setToast({ title, message, color });

  return (
    <div className="relative space-y-5 md:space-y-6">
      {toast ? <ContentToast {...toast} onClose={() => setToast(null)} /> : null}
      {modalOpen ? (
        <NewAgreementModal
          onClose={() => setModalOpen(false)}
          onSaved={() => {
            setModalOpen(false);
            showToast('Anlaşma Kaydedildi', 'Hizmet anlaşması sisteme eklendi · ilk fatura tarihinde otomatik kesilecek', 'sky');
          }}
        />
      ) : null}

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-sky-100 dark:bg-sky-500/20 rounded-lg flex items-center justify-center">
            <Svg className="text-sky-600 dark:text-sky-400 w-4 h-4"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></Svg>
          </div>
          <div>
            <h1 className="text-[19px] font-bold text-gray-900 dark:text-gray-100 leading-tight">Hizmet Anlaşmaları</h1>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">{stats.total} aktif anlaşma · Aylık {stats.aylik} · Yıllık {stats.yillik} · Tek Seferlik {stats.tek}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button type="button" onClick={() => showToast('Sözleşme Yükle', 'PDF sözleşme yükleyin · AI otomatik olarak müşteri, hizmet, tutar, tarihleri çıkaracak', 'sky')} className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-[11px] font-semibold rounded-md hover:bg-gray-50 dark:hover:bg-[#23242c]">
            <Svg className="w-3.5 h-3.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></Svg>
            Sözleşme Yükle
          </button>
          <button type="button" onClick={() => setModalOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-[11px] font-bold rounded-md shadow-sm">
            <Svg className="w-3.5 h-3.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></Svg>
            Yeni Anlaşma Ekle
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
            {filterTabs.map((tab) => {
              const active = filter === tab.k;
              const className = active
                ? tab.clr === 'gray'
                  ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 border-gray-900 dark:border-gray-100'
                  : `bg-${tab.clr}-100 dark:bg-${tab.clr}-500/15 border-2 border-${tab.clr}-500 dark:border-${tab.clr}-500/60 text-${tab.clr}-700 dark:text-${tab.clr}-300`
                : tab.clr === 'gray'
                  ? 'bg-white dark:bg-[#1e1f26] text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-50'
                  : `bg-${tab.clr}-50/40 dark:bg-${tab.clr}-500/5 border-${tab.clr}-200/60 dark:border-${tab.clr}-500/20 text-${tab.clr}-600/80 dark:text-${tab.clr}-400/70 hover:bg-${tab.clr}-50`;
              return (
                <button key={tab.k} type="button" onClick={() => setFilter(tab.k)} className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-md border transition-all ${className}`}>
                  {tab.lbl}
                  <span className={`text-[9px] font-mono ${active ? 'opacity-80' : 'opacity-50'}`}>({tab.count})</span>
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-1">
            <div className="relative">
              <Svg className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 w-3 h-3"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></Svg>
              <input type="text" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Müşteri veya hizmet..." className="pl-7 pr-2 py-1.5 text-[10px] bg-gray-50 dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded text-gray-900 dark:text-gray-100 focus:outline-none focus:border-sky-500 w-44" />
            </div>
            <button type="button" onClick={() => showToast('Export', 'Tüm anlaşmalar CSV/Excel olarak indirilecek', 'sky')} className="p-1.5 bg-gray-50 dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-100 text-gray-600 dark:text-gray-400">
              <Svg className="w-3 h-3"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></Svg>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead className="bg-gray-50 dark:bg-[#17181f]">
              <tr className="border-b border-gray-200 dark:border-gray-700/30">
                <th className="text-left px-3 py-2 font-semibold text-gray-500 dark:text-gray-400">Müşteri</th>
                <th className="text-left px-3 py-2 font-semibold text-gray-500 dark:text-gray-400">Hizmet</th>
                <th className="text-left px-3 py-2 font-semibold text-gray-500 dark:text-gray-400 hidden lg:table-cell">Tür</th>
                <th className="text-left px-3 py-2 font-semibold text-gray-500 dark:text-gray-400 hidden xl:table-cell">Başlangıç — Bitiş</th>
                <th className="text-right px-3 py-2 font-semibold text-gray-500 dark:text-gray-400">Tutar</th>
                <th className="text-center px-3 py-2 font-semibold text-gray-500 dark:text-gray-400 hidden md:table-cell w-20">Şirket</th>
                <th className="text-center px-3 py-2 font-semibold text-gray-500 dark:text-gray-400 w-32">Durum</th>
                <th className="text-right px-3 py-2 font-semibold text-gray-500 dark:text-gray-400 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/30">
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="px-3 py-8 text-center text-gray-400 dark:text-gray-500">Filtreye uygun anlaşma bulunamadı</td></tr>
              ) : filtered.map((contract) => {
                const cat = catConf[contract.category];
                const catCm = CM[cat.clr];
                const typ = typeConf[contract.type];
                const typCm = CM[typ.clr];
                const stt = statusConf[contract.status];
                const sttCm = CM[stt.clr];
                const companyLbl = contract.company === 'digital' ? 'Digital' : 'Bilişim';
                const companyCm = CM[contract.company === 'digital' ? 'emerald' : 'indigo'];
                return (
                  <tr key={contract.id} className="hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer" onClick={() => showToast(`Anlaşma ${contract.id}`, 'Detay modalı · sözleşme PDF · faturalar · ödeme geçmişi · yenileme geçmişi', 'sky')}>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">{contract.customer}</p>
                        {contract.customer.includes('Bosch') ? <span className="text-[8px] font-bold px-1 py-0.5 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 rounded shrink-0">★</span> : null}
                      </div>
                      <p className="text-[9px] text-gray-400 dark:text-gray-500 font-mono">{contract.id}</p>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 ${catCm.bg} rounded flex items-center justify-center shrink-0`}>
                          <Svg className={`${catCm.t} w-3 h-3`}>{cat.icon}</Svg>
                        </div>
                        <div className="min-w-0">
                          <p className="text-gray-700 dark:text-gray-300 font-medium truncate">{contract.service}</p>
                          <p className="text-[9px] text-gray-400 dark:text-gray-500">{cat.lbl}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 hidden lg:table-cell">
                      <span className={`inline-flex items-center text-[9px] font-bold px-1.5 py-0.5 ${typCm.bg} ${typCm.t} rounded`}>{typ.lbl}</span>
                    </td>
                    <td className="px-3 py-2.5 hidden xl:table-cell font-mono text-[10px] text-gray-500 dark:text-gray-400">
                      <p>{contract.start}</p>
                      <p className={contract.status === 'ending' ? 'text-rose-600 dark:text-rose-400 font-bold' : ''}>{contract.end}</p>
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono">
                      <p className="font-bold text-gray-900 dark:text-gray-100">{money(contract.amount)}</p>
                      <p className="text-[9px] text-gray-400 dark:text-gray-500">{contract.type === 'aylik' ? '/ay' : contract.type === 'yillik' ? '/yıl' : 'proje'}</p>
                    </td>
                    <td className="px-3 py-2.5 text-center hidden md:table-cell">
                      <span className={`inline-block min-w-[52px] text-center text-[9px] font-bold px-1.5 py-0.5 ${companyCm.bg} ${companyCm.t} rounded`}>{companyLbl}</span>
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 ${sttCm.bg} ${sttCm.t} rounded`}>
                        <span className={`w-1.5 h-1.5 ${stt.dotClass} rounded-full ${contract.status === 'renewal' || contract.status === 'ending' ? 'animate-pulse' : ''}`}></span>
                        {stt.lbl}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <button type="button" onClick={(event) => { event.stopPropagation(); showToast(`Anlaşma ${contract.id}`, 'Detay modalı · sözleşme PDF · faturalar · ödeme geçmişi · yenileme geçmişi', 'sky'); }} className="text-gray-400 hover:text-sky-600 dark:hover:text-sky-400">
                        <Svg className="w-3.5 h-3.5"><polyline points="9 18 15 12 9 6" /></Svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-gray-50 dark:bg-[#17181f] border-t border-gray-100 dark:border-gray-700/40 flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-400 flex-wrap gap-2">
          <span>{filtered.length} anlaşma gösteriliyor · Aylık toplam: <span className="font-bold text-emerald-700 dark:text-emerald-300 font-mono">{compactMoney(filtered.filter((x) => x.type === 'aylik').reduce((a, x) => a + x.amount, 0))}</span></span>
          <div className="flex items-center gap-1">
            <button type="button" className="px-2 py-0.5 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-100">‹</button>
            <span>1 / 1</span>
            <button type="button" className="px-2 py-0.5 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-100">›</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
          <div className="p-3 border-b border-gray-100 dark:border-gray-700/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Svg className="text-amber-600 dark:text-amber-400 w-3.5 h-3.5"><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></Svg>
              <h3 className="text-[12px] font-bold text-gray-900 dark:text-gray-100">Yaklaşan Yenilemeler</h3>
            </div>
            <span className="text-[9px] font-bold px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded">60 GÜN</span>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700/30">
            {[
              { c: 'BigBrand A.Ş.', s: 'Yıllık SEO Paketi', days: 52, amount: '₺96K' },
              { c: 'Aydın Holding', s: 'Analytics & Data', days: 8, amount: '₺32K' },
              { c: 'TechNova', s: 'Dijital Pazarlama', days: 285, amount: '₺36K' },
            ].map((renewal) => {
              const ucm = CM[renewal.days < 30 ? 'rose' : renewal.days < 90 ? 'amber' : 'gray'];
              return (
                <div key={`${renewal.c}-${renewal.s}`} className="p-2.5 flex items-center justify-between gap-2 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer">
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold text-gray-900 dark:text-gray-100 truncate">{renewal.c}</p>
                    <p className="text-[9px] text-gray-500 dark:text-gray-400 truncate">{renewal.s}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-[11px] font-bold font-mono ${ucm.t}`}>{renewal.days}g</p>
                    <p className="text-[9px] text-gray-500 dark:text-gray-400 font-mono">{renewal.amount}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
          <div className="p-3 border-b border-gray-100 dark:border-gray-700/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Svg className="text-amber-600 dark:text-amber-400 w-3.5 h-3.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></Svg>
              <h3 className="text-[12px] font-bold text-gray-900 dark:text-gray-100">Aktif Tek Seferlik</h3>
            </div>
            <span className="text-[9px] font-bold px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded">PROJE</span>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700/30">
            {[
              { c: 'MegaMarka', s: 'Website Redesign', prog: 45, end: '30 May', amount: '₺68K' },
              { c: 'Aydın Holding', s: 'SEO Teknik Audit', prog: 75, end: '30 Nis', amount: '₺42K' },
              { c: 'Ekin Tarım', s: 'Logo + Kimlik', prog: 30, end: '10 May', amount: '₺28K' },
            ].map((project) => (
              <div key={`${project.c}-${project.s}`} className="p-2.5 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="text-[11px] font-semibold text-gray-900 dark:text-gray-100 truncate">{project.c}</p>
                  <p className="text-[10px] font-mono text-amber-700 dark:text-amber-300 font-bold shrink-0">{project.amount}</p>
                </div>
                <p className="text-[9px] text-gray-500 dark:text-gray-400 mb-1 truncate">{project.s}</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full" style={{ width: `${project.prog}%` }}></div>
                  </div>
                  <span className="text-[9px] font-mono text-gray-500 dark:text-gray-400 shrink-0">{project.prog}% · {project.end}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
          <div className="p-3 border-b border-gray-100 dark:border-gray-700/40 flex items-center gap-2">
            <Svg className="text-indigo-600 dark:text-indigo-400 w-3.5 h-3.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="2" x2="12" y2="22" /><line x1="2" y1="12" x2="22" y2="12" /></Svg>
            <h3 className="text-[12px] font-bold text-gray-900 dark:text-gray-100">Hizmet Dağılımı</h3>
          </div>
          <div className="p-3 space-y-2">
            {categoryCounts.map(([category, count]) => {
              const cc = catConf[category];
              const cm = CM[cc.clr];
              const pct = Math.round((count / contracts.length) * 100);
              return (
                <div key={category}>
                  <div className="flex items-center justify-between text-[10px] mb-0.5">
                    <div className="flex items-center gap-1.5">
                      <Svg className={`${cm.t} w-3 h-3`}>{cc.icon}</Svg>
                      <span className="text-gray-700 dark:text-gray-300 font-medium">{cc.lbl}</span>
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
      </div>

      <div className="bg-gradient-to-br from-sky-50/50 via-transparent to-violet-50/50 dark:from-sky-500/5 dark:to-violet-500/5 border border-sky-200/50 dark:border-sky-500/20 rounded-xl p-3 flex items-start gap-2.5">
        <Svg className="text-sky-600 dark:text-sky-400 w-4 h-4 shrink-0 mt-0.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></Svg>
        <div className="flex-1">
          <p className="text-[11px] text-gray-700 dark:text-gray-300">
            <span className="font-bold text-sky-700 dark:text-sky-300">Nasıl çalışır:</span>{' '}
            <span className="text-emerald-700 dark:text-emerald-300 font-semibold">Aylık</span> anlaşmalar her ay otomatik fatura kesimi tetikler ·{' '}
            <span className="text-violet-700 dark:text-violet-300 font-semibold">Yıllık</span> anlaşmalar başlangıçta tek fatura kesilir, yıl sonuna kadar hizmet sürer ·{' '}
            <span className="text-amber-700 dark:text-amber-300 font-semibold">Tek Seferlik</span> projeler sözleşme tarihinden bitimine kadar bu alanda kalır, bittiğinde arşive gider.
          </p>
        </div>
      </div>
    </div>
  );
}
