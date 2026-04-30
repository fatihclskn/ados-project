import { type ReactNode } from 'react';

export type ColorName = 'emerald' | 'amber' | 'rose' | 'sky' | 'violet' | 'indigo' | 'teal' | 'gray';

export const CM: Record<ColorName, { bg: string; t: string; brd: string }> = {
  emerald: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', t: 'text-emerald-700 dark:text-emerald-300', brd: 'border-emerald-200 dark:border-emerald-800/40' },
  amber: { bg: 'bg-amber-100 dark:bg-amber-900/30', t: 'text-amber-700 dark:text-amber-300', brd: 'border-amber-200 dark:border-amber-800/40' },
  rose: { bg: 'bg-rose-100 dark:bg-rose-900/30', t: 'text-rose-700 dark:text-rose-300', brd: 'border-rose-200 dark:border-rose-800/40' },
  sky: { bg: 'bg-sky-100 dark:bg-sky-900/30', t: 'text-sky-700 dark:text-sky-300', brd: 'border-sky-200 dark:border-sky-800/40' },
  violet: { bg: 'bg-violet-100 dark:bg-violet-900/30', t: 'text-violet-700 dark:text-violet-300', brd: 'border-violet-200 dark:border-violet-800/40' },
  indigo: { bg: 'bg-indigo-100 dark:bg-indigo-900/30', t: 'text-indigo-700 dark:text-indigo-300', brd: 'border-indigo-200 dark:border-indigo-800/40' },
  teal: { bg: 'bg-teal-100 dark:bg-teal-900/30', t: 'text-teal-700 dark:text-teal-300', brd: 'border-teal-200 dark:border-teal-800/40' },
  gray: { bg: 'bg-gray-100 dark:bg-gray-800', t: 'text-gray-600 dark:text-gray-400', brd: 'border-gray-200 dark:border-gray-700/50' },
};

export function Icon({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <svg className={`w-3.5 h-3.5 shrink-0 ${className ?? ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      {children}
    </svg>
  );
}

export function PlusIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </Icon>
  );
}

export function SearchIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </Icon>
  );
}

export function ArrowIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </Icon>
  );
}

export function CheckIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <polyline points="20 6 9 17 4 12" />
    </Icon>
  );
}

export function XIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </Icon>
  );
}

export function Badge({ children, color = 'gray' }: { children: ReactNode; color?: ColorName }) {
  const cm = CM[color] || CM.gray;
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${cm.bg} ${cm.t} whitespace-nowrap`}>{children}</span>;
}

export function PageRoot({ children }: { children: ReactNode }) {
  return <div className="relative min-h-[calc(100vh-120px)] space-y-5 md:space-y-6">{children}</div>;
}

export function PageHeader({ icon, title, subtitle, actions }: { icon: ReactNode; title: string; subtitle: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 bg-violet-100 dark:bg-violet-900/40 rounded-xl flex items-center justify-center shrink-0">{icon}</div>
        <div>
          <h1 className="text-[19px] font-bold text-gray-900 dark:text-gray-100 leading-tight">{title}</h1>
          <p className="text-[11px] text-gray-500 dark:text-gray-400">{subtitle}</p>
        </div>
      </div>
      {actions ? <div className="flex items-center gap-2 flex-wrap">{actions}</div> : null}
    </div>
  );
}

export function StatCard({ label, value, sub, color = 'violet' }: { label: string; value: string; sub?: string; color?: ColorName }) {
  const cm = CM[color] || CM.gray;
  return (
    <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl px-3 py-2.5 hover:shadow-sm dark:hover:border-gray-700 transition-all">
      <p className={`text-[19px] font-bold ${cm.t} leading-none mb-0.5`}>{value}</p>
      <p className="text-[10px] text-gray-500 dark:text-gray-400">{label}</p>
      {sub ? <p className="text-[9px] text-gray-400 dark:text-gray-600 mt-1">{sub}</p> : null}
    </div>
  );
}

export function SearchBox({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) {
  return (
    <div className="relative max-w-md">
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        type="text"
        placeholder={placeholder}
        className="w-full pl-9 pr-4 py-2 text-[12px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#23242c] rounded-lg focus:outline-none focus:border-violet-500 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600"
      />
    </div>
  );
}

export function FilterButton({ active, children, onClick }: { active: boolean; children: ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all ${
        active ? 'bg-violet-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
      }`}
    >
      {children}
    </button>
  );
}

export function ContentModal({ title, subtitle, children, footer, onClose, maxWidth = 'max-w-2xl' }: { title: string; subtitle?: string; children: ReactNode; footer?: ReactNode; onClose: () => void; maxWidth?: string }) {
  return (
    <div className="absolute inset-0 z-30 flex items-start justify-center p-4 pt-6 bg-black/40 rounded-xl">
      <div className={`bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl shadow-2xl w-full ${maxWidth} max-h-[calc(100vh-150px)] overflow-hidden flex flex-col`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-600/50">
          <div>
            <h2 className="text-[14px] font-bold text-gray-900 dark:text-gray-100">{title}</h2>
            {subtitle ? <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p> : null}
          </div>
          <button type="button" onClick={onClose} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            <XIcon className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">{children}</div>
        {footer ? <div className="flex items-center justify-between px-5 py-3 border-t border-gray-200 dark:border-gray-600/50 bg-gray-50/70 dark:bg-[#161720]/50">{footer}</div> : null}
      </div>
    </div>
  );
}

export function EmptyActionButton({ children }: { children: ReactNode }) {
  return (
    <button type="button" className="px-3 py-1.5 text-[12px] font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50">
      {children}
    </button>
  );
}

export function PrimaryButton({ children, onClick, color = 'violet' }: { children: ReactNode; onClick?: () => void; color?: ColorName }) {
  const bg = color === 'emerald' ? 'bg-emerald-600 hover:bg-emerald-700' : color === 'sky' ? 'bg-sky-600 hover:bg-sky-700' : color === 'amber' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-violet-600 hover:bg-violet-700';
  return (
    <button type="button" onClick={onClick} className={`flex items-center gap-1.5 px-3 py-1.5 ${bg} text-white text-[12px] font-semibold rounded-lg transition-colors`}>
      {children}
    </button>
  );
}

export function Field({ label, placeholder, type = 'text' }: { label: string; placeholder?: string; type?: string }) {
  return (
    <div>
      <label className="block text-[10px] font-medium text-gray-500 dark:text-gray-500 mb-1">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-[12px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#23242c] rounded-lg focus:outline-none focus:border-violet-500 text-gray-900 dark:text-gray-100 placeholder-gray-400"
      />
    </div>
  );
}

export const customers = [
  { id: 1, co: 'Teknosoft A.Ş.', no: 'MUS-2024-1847', ct: 'Mehmet Yılmaz', tp: 'Aktif Müşteri', tc: 'emerald' as ColorName, sv: ['SEO', 'Web Sitesi'], dt: 'Eksik Veri', dc: 'amber' as ColorName, sg: 'Teknik Hizmet', sc: 'sky' as ColorName, up: '2 sa önce' },
  { id: 2, co: 'Dijital Medya Ltd.', no: 'MUS-2023-0921', ct: 'Ayşe Kara', tp: 'Aktif Müşteri', tc: 'emerald' as ColorName, sv: ['Google Ads', 'Meta Reklam', 'Sosyal Medya'], dt: 'Doğrulandı', dc: 'emerald' as ColorName, sg: 'Dijital Reklam', sc: 'violet' as ColorName, up: '1 gün önce' },
  { id: 3, co: 'E-ticaret Pro', no: 'MUS-2024-2103', ct: 'Can Öztürk', tp: 'Potansiyel', tc: 'sky' as ColorName, sv: ['E-Bülten'], dt: 'Kontrol Gerekli', dc: 'amber' as ColorName, sg: 'E-Ticaret', sc: 'indigo' as ColorName, up: '3 sa önce' },
  { id: 4, co: 'Hızlı Lojistik', no: 'MUS-2022-0145', ct: 'Selin Demir', tp: 'Aktif Müşteri', tc: 'emerald' as ColorName, sv: ['SEO', 'Google Ads'], dt: 'Doğrulandı', dc: 'emerald' as ColorName, sg: 'E-Ticaret', sc: 'indigo' as ColorName, up: '5 sa önce' },
  { id: 5, co: 'Sürdürülebilir Enerji A.Ş.', no: 'MUS-2023-1456', ct: 'Kemal Arslan', tp: 'Pasif Müşteri', tc: 'gray' as ColorName, sv: ['Web Sitesi'], dt: 'Eksik', dc: 'rose' as ColorName, sg: 'Kurumsal', sc: 'violet' as ColorName, up: '1 gün önce' },
];

export const leads = [
  { id: 1, title: 'SEO teklif talebi', company: 'Teknosoft A.Ş.', source: 'Web Sitesi', priority: 'Yüksek', status: 'Yeni', owner: 'Ahmet Y.', service: 'SEO', age: '2 sa' },
  { id: 2, title: 'Google Ads bütçe revizyonu', company: 'Dijital Medya Ltd.', source: 'Google Ads', priority: 'Kritik', status: 'Teklif Hazırlanıyor', owner: 'Çiğdem A.', service: 'Google Ads', age: '1 gün' },
  { id: 3, title: 'Web sitesi yenileme', company: 'E-ticaret Pro', source: 'Referans', priority: 'Orta', status: 'Görüşme', owner: 'Berk K.', service: 'Web Sitesi', age: '3 gün' },
  { id: 4, title: 'Sosyal medya yönetimi', company: 'Mobilya Dünyası Ltd.', source: 'Meta Reklam', priority: 'Yüksek', status: 'Onay Bekliyor', owner: 'Zeynep A.', service: 'Sosyal Medya', age: '4 sa' },
];

export const proposals = [
  { id: 'TKLF-2026-4815', customer: 'Işık Eğitim Kurumları', contact: 'Can Demir', segment: 'Eğitim', services: ['Web', 'Hosting', 'Domain'], total: '₺84.000', status: 'Açıldı', color: 'sky' as ColorName, sent: '8 gün önce' },
  { id: 'TKLF-2026-4812', customer: 'Sağlık Plus Merkezi', contact: 'Zeynep Aydın', segment: 'Sağlık', services: ['SEO', 'Google Ads'], total: '₺216.000', status: 'Reddedildi', color: 'rose' as ColorName, sent: '12 gün önce' },
  { id: 'TKLF-2026-4810', customer: 'Çelik Yapı İnşaat', contact: 'Ahmet Öztürk', segment: 'İnşaat', services: ['Web', 'SEO'], total: '₺126.000', status: 'Süresi Doldu', color: 'amber' as ColorName, sent: '15 gün önce' },
  { id: 'TKLF-2026-4808', customer: 'Akdeniz Turizm A.Ş.', contact: 'Ahmet Yılmaz', segment: 'Turizm', services: ['Premium 360'], total: '₺420.000', status: 'Onaylandı', color: 'emerald' as ColorName, sent: '2 gün önce' },
];

export const contracts = [
  { id: 'SOZ-2026-114', customer: 'Akdeniz Turizm A.Ş.', owner: 'Çiğdem A.', step: 'Kaşe Bilgileri Bekleniyor', status: 'Süreçte', value: '₺420.000', color: 'amber' as ColorName },
  { id: 'SOZ-2026-112', customer: 'Işık Eğitim Kurumları', owner: 'Ahmet Y.', step: 'Müşteri İmzası Bekleniyor', status: 'Süreçte', value: '₺84.000', color: 'sky' as ColorName },
  { id: 'SOZ-2026-108', customer: 'Finans Tech Ltd.', owner: 'Selin D.', step: 'Finans Onayında', status: 'Finansta', value: '₺192.000', color: 'violet' as ColorName },
  { id: 'SOZ-2026-101', customer: 'Hızlı Lojistik', owner: 'Berke Y.', step: 'Aktif Sözleşme', status: 'Aktif', value: '₺156.000', color: 'emerald' as ColorName },
];
