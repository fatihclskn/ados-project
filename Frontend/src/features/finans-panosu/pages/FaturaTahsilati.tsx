import { type ReactNode, useMemo, useState } from 'react';

type Status = 'paid' | 'open' | 'partial' | 'overdue';
type StatusFilter = Status | 'all';
type ColorName = 'emerald' | 'amber' | 'rose' | 'sky' | 'violet' | 'indigo' | 'teal' | 'gray';

type Invoice = {
  no: string;
  customer: string;
  type: string;
  date: string;
  due: string;
  amount: number;
  paid: number;
  status: Status;
  parasutId: string;
  cat: string;
  company: 'digital' | 'bilisim';
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

const invoices: Invoice[] = [
  { no: 'INV-2026-0145', customer: 'BigBrand Reklam A.Ş.', type: 'Peşinat', date: '23.04.2026', due: '30.04.2026', amount: 48000, paid: 48000, status: 'paid', parasutId: 'p-8842', cat: 'peşinat', company: 'digital' },
  { no: 'INV-2026-0144', customer: 'Bosch Türkiye', type: 'Aylık', date: '22.04.2026', due: '22.05.2026', amount: 142000, paid: 0, status: 'open', parasutId: 'p-8841', cat: 'aylık', company: 'digital' },
  { no: 'INV-2026-0143', customer: 'FastGrow Digital', type: 'Aylık', date: '20.04.2026', due: '20.05.2026', amount: 24500, paid: 0, status: 'open', parasutId: 'p-8840', cat: 'aylık', company: 'bilisim' },
  { no: 'INV-2026-0142', customer: 'Bosch Türkiye', type: 'Proje', date: '18.04.2026', due: '18.04.2026', amount: 142000, paid: 142000, status: 'paid', parasutId: 'p-8839', cat: 'proje', company: 'digital' },
  { no: 'INV-2026-0141', customer: 'TechNova Yazılım', type: 'Aylık', date: '15.04.2026', due: '15.04.2026', amount: 36000, paid: 36000, status: 'paid', parasutId: 'p-8838', cat: 'aylık', company: 'digital' },
  { no: 'INV-2026-0138', customer: 'FastGrow Digital', type: 'Aylık', date: '10.04.2026', due: '10.04.2026', amount: 48500, paid: 24000, status: 'partial', parasutId: 'p-8835', cat: 'aylık', company: 'bilisim' },
  { no: 'INV-2026-0135', customer: 'MegaMarka Perakende', type: 'SEO Proje', date: '05.04.2026', due: '05.04.2026', amount: 68000, paid: 0, status: 'overdue', parasutId: 'p-8832', cat: 'proje', company: 'bilisim' },
  { no: 'INV-2026-0128', customer: 'Karataş İnşaat', type: 'Aylık', date: '28.03.2026', due: '28.03.2026', amount: 18000, paid: 0, status: 'overdue', parasutId: 'p-8825', cat: 'aylık', company: 'bilisim' },
  { no: 'INV-2026-0124', customer: 'Platin Otomotiv', type: 'Yıllık', date: '15.03.2026', due: '15.04.2026', amount: 180000, paid: 180000, status: 'paid', parasutId: 'p-8821', cat: 'yıllık', company: 'digital' },
  { no: 'INV-2026-0119', customer: 'Aydın Holding', type: 'Proje', date: '08.03.2026', due: '08.04.2026', amount: 42000, paid: 0, status: 'overdue', parasutId: 'p-8816', cat: 'proje', company: 'digital' },
  { no: 'INV-2026-0115', customer: 'Bosch Türkiye', type: 'Aylık', date: '22.03.2026', due: '22.04.2026', amount: 142000, paid: 142000, status: 'paid', parasutId: 'p-8812', cat: 'aylık', company: 'digital' },
  { no: 'INV-2026-0108', customer: 'Ekin Tarım', type: 'Aylık', date: '18.03.2026', due: '18.04.2026', amount: 22000, paid: 0, status: 'overdue', parasutId: 'p-8805', cat: 'aylık', company: 'bilisim' },
];

const statusConf: Record<Status, { lbl: string; clr: ColorName; icon: ReactNode }> = {
  paid: { lbl: 'ÖDENDİ', clr: 'emerald', icon: <polyline points="20 6 9 17 4 12" /> },
  open: { lbl: 'VADEDE', clr: 'sky', icon: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></> },
  partial: { lbl: 'KISMİ', clr: 'amber', icon: <path d="M12 2v20M2 12h20" /> },
  overdue: { lbl: 'GECİKMİŞ', clr: 'rose', icon: <><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></> },
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

function ContentToast({ title, message, color = 'emerald', onClose }: { title: string; message: string; color?: ColorName; onClose: () => void }) {
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

function NewInvoiceModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute inset-0 z-30 flex items-start justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="modal-scroll bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-xl w-full max-w-[680px] max-h-[82vh] overflow-y-auto pointer-events-auto">
        <div className="sticky top-0 z-10 bg-white dark:bg-[#1e1f26] border-b border-gray-100 dark:border-gray-700/60 p-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <Svg className="text-emerald-600 dark:text-emerald-400 w-4 h-4"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></Svg>
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-gray-900 dark:text-gray-100">Yeni Fatura Kes</h2>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">Paraşüt üzerinden e-fatura / e-arşiv · GIB entegre</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1">
            <Svg className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Svg>
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wider">Fatura Hangi Şirketten Kesilecek? *</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <label className="cursor-pointer">
                <input type="radio" name="faturaCompany" value="digital" className="sr-only peer" defaultChecked />
                <div className="relative h-full p-3 bg-white dark:bg-[#17181f] border-2 border-gray-200 dark:border-gray-700 peer-checked:border-emerald-500 peer-checked:bg-emerald-50 dark:peer-checked:bg-emerald-500/10 rounded-lg transition-all">
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
                <input type="radio" name="faturaCompany" value="bilisim" className="sr-only peer" />
                <div className="relative h-full p-3 bg-white dark:bg-[#17181f] border-2 border-gray-200 dark:border-gray-700 peer-checked:border-indigo-500 peer-checked:bg-indigo-50 dark:peer-checked:bg-indigo-500/10 rounded-lg transition-all">
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
            <label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Müşteri (Paraşüt Cari) *</label>
            <select className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:border-emerald-500">
              <option>Müşteri seçin...</option>
              <option>Bosch Türkiye</option>
              <option>BigBrand Reklam A.Ş.</option>
              <option>FastGrow Digital</option>
              <option>TechNova Yazılım</option>
              <option>MegaMarka Perakende</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Fatura Türü</label>
              <select className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:border-emerald-500"><option>E-Fatura (kurumsal)</option><option>E-Arşiv (bireysel)</option></select>
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Kategori</label>
              <select className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:border-emerald-500"><option>Aylık hizmet</option><option>Yıllık hizmet</option><option>Tek seferlik proje</option><option>Peşinat</option></select>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Açıklama</label>
            <textarea rows={2} placeholder="Fatura açıklaması..." className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 resize-none focus:outline-none focus:border-emerald-500" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Tutar *</label><input type="text" placeholder="0,00" className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono text-right focus:outline-none focus:border-emerald-500" /></div>
            <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">KDV</label><select id="kdvSelect" className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:border-emerald-500"><option value="0">%0 (Teknopark)</option><option value="20">%20 (Standart)</option><option value="10">%10</option><option value="1">%1</option><option value="haric">Hariç</option></select></div>
            <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Para Birimi</label><select className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono focus:outline-none focus:border-emerald-500"><option>TRY</option><option>USD</option><option>EUR</option></select></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Fatura Tarihi</label><input type="date" defaultValue="2026-04-23" className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono focus:outline-none focus:border-emerald-500" /></div>
            <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Vade Tarihi</label><input type="date" defaultValue="2026-05-23" className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono focus:outline-none focus:border-emerald-500" /></div>
          </div>
          <div className="p-3 bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/30 rounded-md flex items-start gap-2">
            <Svg className="text-teal-600 dark:text-teal-400 w-4 h-4 shrink-0 mt-0.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></Svg>
            <div className="text-[10px]"><p className="font-bold text-teal-900 dark:text-teal-200">Paraşüt otomatik</p><p className="text-teal-700 dark:text-teal-300 mt-0.5">Fatura Paraşüt’e yazılır · GIB’e otomatik gönderilir · onaydan sonra PDF e-posta ile müşteriye iletilir</p></div>
          </div>
        </div>
        <div className="sticky bottom-0 bg-white dark:bg-[#1e1f26] border-t border-gray-100 dark:border-gray-700/60 p-4 flex items-center justify-end gap-2">
          <button type="button" onClick={onClose} className="px-3 py-2 text-[11px] font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">İptal</button>
          <button type="button" onClick={onClose} className="flex items-center gap-1 px-3 py-2 text-[11px] font-semibold bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-[#23242c]">Taslağa Kaydet</button>
          <button type="button" onClick={onClose} className="flex items-center gap-1.5 px-4 py-2 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-md"><Svg className="w-3 h-3"><polyline points="20 6 9 17 4 12" /></Svg>Kes ve Gönder</button>
        </div>
      </div>
    </div>
  );
}

function CollectionModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute inset-0 z-30 flex items-start justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="modal-scroll bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-xl w-full max-w-[560px] max-h-[82vh] overflow-y-auto pointer-events-auto">
        <div className="sticky top-0 z-10 bg-white dark:bg-[#1e1f26] border-b border-gray-100 dark:border-gray-700/60 p-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5"><div className="w-10 h-10 bg-sky-100 dark:bg-sky-500/20 rounded-lg flex items-center justify-center"><Svg className="text-sky-600 dark:text-sky-400 w-4 h-4"><line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" /></Svg></div><div><h2 className="text-[15px] font-bold text-gray-900 dark:text-gray-100">Tahsilat Gir</h2><p className="text-[11px] text-gray-500 dark:text-gray-400">Bir faturaya ödeme eşleştir · banka hareketiyle bağla</p></div></div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1"><Svg className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Svg></button>
        </div>
        <div className="p-5 space-y-4">
          <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Fatura *</label><select className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono focus:outline-none focus:border-sky-500"><option>Fatura seçin...</option><option>INV-2026-0144 · Bosch · ₺142.000 · Vadede</option><option>INV-2026-0143 · FastGrow · ₺24.500 · Vadede</option><option>INV-2026-0135 · MegaMarka · ₺68.000 · Gecikmiş</option><option>INV-2026-0128 · Karataş · ₺18.000 · Gecikmiş</option></select></div>
          <div className="grid grid-cols-2 gap-3"><div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Tahsilat Tutarı *</label><input type="text" placeholder="0,00" className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono text-right focus:outline-none focus:border-sky-500" /></div><div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Tarih</label><input type="date" defaultValue="2026-04-23" className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono focus:outline-none focus:border-sky-500" /></div></div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Hangi Banka Hesabına *</label>
            <div className="grid grid-cols-3 gap-2">
              {[{ k: 'garanti', lbl: 'Garanti', sub: '₺684K', clr: 'emerald' }, { k: 'enpara', lbl: 'Enpara', sub: '₺348K', clr: 'violet' }, { k: 'teb', lbl: 'TEB', sub: '₺214K', clr: 'sky' }].map((bank, index) => (
                <label key={bank.k} className="cursor-pointer"><input type="radio" name="tahsilatBank" value={bank.k} className="sr-only peer" defaultChecked={index === 0} /><div className={`p-2.5 bg-white dark:bg-[#17181f] border-2 border-gray-200 dark:border-gray-700 peer-checked:border-${bank.clr}-500 peer-checked:bg-${bank.clr}-50 dark:peer-checked:bg-${bank.clr}-500/10 rounded-lg text-center transition-all`}><p className="text-[11px] font-bold text-gray-900 dark:text-gray-100">{bank.lbl}</p><p className="text-[9px] text-gray-500 font-mono">{bank.sub}</p></div></label>
              ))}
            </div>
          </div>
          <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Tahsilat Türü</label><div className="flex items-center gap-1 flex-wrap">{['Havale / EFT', 'Kredi Kartı', 'Nakit', 'Çek', 'Senet'].map((type, index) => <label key={type} className="cursor-pointer"><input type="radio" name="payType" className="sr-only peer" defaultChecked={index === 0} /><span className="inline-block px-2.5 py-1 text-[10px] font-semibold bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 peer-checked:bg-sky-50 dark:peer-checked:bg-sky-500/10 peer-checked:border-sky-300 dark:peer-checked:border-sky-500/40 peer-checked:text-sky-700 dark:peer-checked:text-sky-300 text-gray-600 dark:text-gray-400 rounded-full">{type}</span></label>)}</div></div>
          <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Açıklama (isteğe bağlı)</label><input type="text" placeholder="Havale dekont no vb." className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:border-sky-500" /></div>
        </div>
        <div className="sticky bottom-0 bg-white dark:bg-[#1e1f26] border-t border-gray-100 dark:border-gray-700/60 p-4 flex items-center justify-end gap-2"><button type="button" onClick={onClose} className="px-3 py-2 text-[11px] font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">İptal</button><button type="button" onClick={onClose} className="flex items-center gap-1.5 px-4 py-2 text-[11px] font-bold bg-sky-600 hover:bg-sky-700 text-white rounded-md"><Svg className="w-3 h-3"><polyline points="20 6 9 17 4 12" /></Svg>Tahsilatı Kaydet</button></div>
      </div>
    </div>
  );
}

export default function FaturaTahsilati() {
  const [status, setStatus] = useState<StatusFilter>('all');
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'invoice' | 'collection' | null>(null);
  const [toast, setToast] = useState<{ title: string; message: string; color?: ColorName } | null>(null);

  const filtered = useMemo(() => {
    const term = search.trim().toLocaleLowerCase('tr-TR');
    return invoices.filter((invoice) => (status === 'all' || invoice.status === status) && (!term || invoice.no.toLocaleLowerCase('tr-TR').includes(term) || invoice.customer.toLocaleLowerCase('tr-TR').includes(term)));
  }, [search, status]);

  const stats = {
    total: invoices.length,
    paid: invoices.filter((x) => x.status === 'paid').length,
    open: invoices.filter((x) => x.status === 'open').length,
    partial: invoices.filter((x) => x.status === 'partial').length,
    overdue: invoices.filter((x) => x.status === 'overdue').length,
    totalPaid: invoices.reduce((a, x) => a + x.paid, 0),
    outstanding: invoices.reduce((a, x) => a + (x.amount - x.paid), 0),
    overdueAmount: invoices.filter((x) => x.status === 'overdue').reduce((a, x) => a + x.amount, 0),
  };

  const topDebtors = Object.entries(
    invoices.filter((x) => x.status !== 'paid').reduce<Record<string, number>>((acc, invoice) => {
      acc[invoice.customer] = (acc[invoice.customer] || 0) + invoice.amount - invoice.paid;
      return acc;
    }, {}),
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const filterTabs: Array<{ k: StatusFilter; lbl: string; count: number; clr: ColorName }> = [
    { k: 'all', lbl: 'Tümü', count: stats.total, clr: 'gray' },
    { k: 'paid', lbl: 'Ödendi', count: stats.paid, clr: 'emerald' },
    { k: 'open', lbl: 'Vadede', count: stats.open, clr: 'sky' },
    { k: 'partial', lbl: 'Kısmi', count: stats.partial, clr: 'amber' },
    { k: 'overdue', lbl: 'Gecikmiş', count: stats.overdue, clr: 'rose' },
  ];

  return (
    <div className="relative space-y-5 md:space-y-6">
      {toast ? <ContentToast {...toast} onClose={() => setToast(null)} /> : null}
      {modal === 'invoice' ? <NewInvoiceModal onClose={() => setModal(null)} /> : null}
      {modal === 'collection' ? <CollectionModal onClose={() => setModal(null)} /> : null}

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-emerald-100 dark:bg-emerald-500/20 rounded-lg flex items-center justify-center">
            <Svg className="text-emerald-600 dark:text-emerald-400 w-4 h-4"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></Svg>
          </div>
          <div>
            <h1 className="text-[19px] font-bold text-gray-900 dark:text-gray-100 leading-tight">Fatura & Tahsilat</h1>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">Nisan 2026 · {stats.total} fatura · Paraşüt entegreli · son sync 12dk önce</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button type="button" onClick={() => setToast({ title: 'Paraşüt Senkron', message: '142 fatura + 86 e-arşiv + bankalar dahil · 2.4s', color: 'emerald' })} className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-[11px] font-semibold rounded-md hover:bg-gray-50 dark:hover:bg-[#23242c]"><Svg className="w-3.5 h-3.5"><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></Svg>Paraşüt Senkron</button>
          <button type="button" onClick={() => setModal('collection')} className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-[11px] font-semibold rounded-md hover:bg-gray-50 dark:hover:bg-[#23242c]"><Svg className="w-3.5 h-3.5"><line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" /></Svg>Tahsilat Gir</button>
          <button type="button" onClick={() => setModal('invoice')} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-md shadow-sm"><Svg className="w-3.5 h-3.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></Svg>Yeni Fatura Kes</button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3">
        {[
          { label: 'Kesilen Fatura', value: String(stats.total), sub: 'Nisan 2026 · tümü', clr: 'sky' as const },
          { label: 'Tahsil Edilen', value: `₺${(stats.totalPaid / 1000).toFixed(0)}K`, sub: `${stats.paid} fatura ödendi`, clr: 'emerald' as const },
          { label: 'Bekleyen', value: `₺${(stats.outstanding / 1000).toFixed(0)}K`, sub: `${stats.open + stats.partial} açık fatura`, clr: 'amber' as const },
          { label: 'Gecikmiş', value: String(stats.overdue), sub: `₺${(stats.overdueAmount / 1000).toFixed(0)}K · vade geçti`, clr: 'rose' as const },
          { label: 'GIB Onay', value: '3', sub: 'E-fatura onay bekliyor', clr: 'amber' as const },
          { label: 'Ort. Vade', value: '22 gün', sub: 'Ödeme süre ortalaması', clr: 'violet' as const },
        ].map((item) => {
          const cm = CM[item.clr];
          return <div key={item.label} className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-3.5"><p className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">{item.label}</p><p className={`text-[22px] font-bold ${cm.t} font-mono leading-none mb-0.5`}>{item.value}</p><p className="text-[9px] text-gray-400 dark:text-gray-500">{item.sub}</p></div>;
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
          <div className="p-3 border-b border-gray-100 dark:border-gray-700/40 flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1 flex-wrap">
              {filterTabs.map((tab) => {
                const active = status === tab.k;
                const cm = CM[tab.clr];
                return <button key={tab.k} type="button" onClick={() => setStatus(tab.k)} className={`flex items-center gap-1 px-2 py-1 text-[10px] font-semibold rounded border ${active ? (tab.clr === 'gray' ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 border-gray-900 dark:border-gray-100' : `bg-${tab.clr}-600 text-white border-${tab.clr}-600`) : (tab.clr === 'gray' ? 'bg-white dark:bg-[#1e1f26] text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700' : `${cm.bg} ${cm.t} border-${tab.clr}-200 dark:border-${tab.clr}-500/30`)}`}>{tab.lbl} <span className={`${active ? 'opacity-90' : 'opacity-60'} font-mono`}>({tab.count})</span></button>;
              })}
            </div>
            <div className="flex items-center gap-1">
              <div className="relative">
                <Svg className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 w-3 h-3"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></Svg>
                <input type="text" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Fatura no veya müşteri..." className="pl-7 pr-2 py-1 text-[10px] bg-gray-50 dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded text-gray-900 dark:text-gray-100 focus:outline-none focus:border-emerald-500 w-40" />
              </div>
              <button type="button" onClick={() => setToast({ title: 'Filtre', message: 'Tarih, tutar, müşteri, kategori, vergi filtreleri', color: 'emerald' })} className="p-1.5 bg-gray-50 dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-100 dark:hover:bg-[#23242c] text-gray-600 dark:text-gray-400"><Svg className="w-3 h-3"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></Svg></button>
              <button type="button" onClick={() => setToast({ title: 'Export', message: 'Filtrelenmiş fatura listesi CSV / Excel olarak indirilecek', color: 'sky' })} className="p-1.5 bg-gray-50 dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-100 dark:hover:bg-[#23242c] text-gray-600 dark:text-gray-400"><Svg className="w-3 h-3"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></Svg></button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-[11px]">
              <thead className="bg-gray-50 dark:bg-[#17181f]"><tr className="border-b border-gray-200 dark:border-gray-700/30"><th className="text-left px-3 py-2 font-semibold text-gray-500 dark:text-gray-400">Fatura No</th><th className="text-left px-3 py-2 font-semibold text-gray-500 dark:text-gray-400">Müşteri</th><th className="text-left px-3 py-2 font-semibold text-gray-500 dark:text-gray-400 hidden md:table-cell">Tür</th><th className="text-left px-3 py-2 font-semibold text-gray-500 dark:text-gray-400 hidden lg:table-cell">Vade</th><th className="text-right px-3 py-2 font-semibold text-gray-500 dark:text-gray-400">Tutar</th><th className="text-center px-3 py-2 font-semibold text-gray-500 dark:text-gray-400 w-24">Durum</th><th className="text-right px-3 py-2 font-semibold text-gray-500 dark:text-gray-400 w-16"></th></tr></thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700/30">
                {filtered.map((invoice) => {
                  const sc = statusConf[invoice.status];
                  const isBosch = invoice.customer.includes('Bosch');
                  return (
                    <tr key={invoice.no} onClick={() => setToast({ title: `Fatura ${invoice.no}`, message: 'Detay modalı açılıyor · PDF · ödeme takibi · mutabakat · Paraşüt linki', color: 'emerald' })} className="hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer">
                      <td className="px-3 py-2.5"><p className="font-mono font-semibold text-gray-900 dark:text-gray-100 text-[10px]">{invoice.no}</p><p className="text-[9px] text-gray-400 dark:text-gray-500 font-mono">{invoice.date}</p></td>
                      <td className="px-3 py-2.5"><div className="flex items-center gap-1.5 min-w-0"><span className="text-gray-700 dark:text-gray-300 truncate">{invoice.customer}</span>{isBosch ? <span className="text-[8px] font-bold px-1 py-0.5 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 rounded shrink-0">★</span> : null}</div></td>
                      <td className="px-3 py-2.5 hidden md:table-cell"><span className="text-[10px] font-semibold text-gray-600 dark:text-gray-400">{invoice.type}</span></td>
                      <td className={`px-3 py-2.5 hidden lg:table-cell font-mono text-[10px] ${invoice.status === 'overdue' ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-gray-500 dark:text-gray-500'}`}>{invoice.due}</td>
                      <td className="px-3 py-2.5 text-right font-mono"><p className="font-bold text-gray-900 dark:text-gray-100">{money(invoice.amount)}</p>{invoice.paid > 0 && invoice.paid < invoice.amount ? <p className="text-[9px] text-amber-600 dark:text-amber-400">Ödenen {money(invoice.paid)}</p> : null}</td>
                      <td className="px-3 py-2.5 text-center"><span className={`inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 bg-${sc.clr}-100 dark:bg-${sc.clr}-900/30 text-${sc.clr}-700 dark:text-${sc.clr}-300 rounded`}><Svg className="w-2.5 h-2.5">{sc.icon}</Svg>{sc.lbl}</span></td>
                      <td className="px-3 py-2.5 text-right"><button type="button" onClick={(event) => { event.stopPropagation(); setToast({ title: `Fatura ${invoice.no}`, message: 'Detay modalı açılıyor · PDF · ödeme takibi · mutabakat · Paraşüt linki', color: 'emerald' }); }} className="text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400"><Svg className="w-3.5 h-3.5"><polyline points="9 18 15 12 9 6" /></Svg></button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-[#17181f] border-t border-gray-100 dark:border-gray-700/40 flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-400"><span>{filtered.length} fatura gösteriliyor · Toplam: <span className="font-bold text-gray-900 dark:text-gray-100 font-mono">{money(filtered.reduce((a, x) => a + x.amount, 0))}</span></span><div className="flex items-center gap-1"><button type="button" className="px-2 py-0.5 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-100 dark:hover:bg-[#23242c]">‹</button><span>1 / 1</span><button type="button" className="px-2 py-0.5 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-100 dark:hover:bg-[#23242c]">›</button></div></div>
        </div>

        <div className="space-y-3">
          <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden"><div className="p-3 border-b border-gray-100 dark:border-gray-700/40 flex items-center justify-between"><div className="flex items-center gap-2"><Svg className="text-amber-600 dark:text-amber-400 w-3.5 h-3.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></Svg><h3 className="text-[12px] font-bold text-gray-900 dark:text-gray-100">Alacaklı Müşteriler</h3></div><span className="text-[9px] font-bold px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded">TOP 5</span></div><div className="divide-y divide-gray-100 dark:divide-gray-700/30">{topDebtors.map(([cust, debt], index) => <div key={cust} className="p-2.5 flex items-center justify-between gap-2 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer"><div className="flex items-center gap-2 min-w-0"><span className="text-[9px] font-mono font-bold text-gray-400 dark:text-gray-500 shrink-0">#{index + 1}</span><span className="text-[11px] font-semibold text-gray-900 dark:text-gray-100 truncate">{cust}</span>{cust.includes('Bosch') ? <span className="text-[8px] font-bold px-1 py-0.5 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 rounded shrink-0">★</span> : null}</div><span className="text-[11px] font-bold font-mono text-amber-700 dark:text-amber-300 shrink-0">₺{(debt / 1000).toFixed(0)}K</span></div>)}</div></div>

          <div className="bg-gradient-to-br from-rose-50 to-amber-50/50 dark:from-rose-500/5 dark:to-amber-500/5 border border-rose-200 dark:border-rose-500/30 rounded-xl overflow-hidden"><div className="p-3 border-b border-rose-200/50 dark:border-rose-500/20 flex items-center gap-2"><Svg className="text-rose-600 dark:text-rose-400 w-3.5 h-3.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></Svg><h3 className="text-[12px] font-bold text-rose-900 dark:text-rose-200">Acil Hatırlatmalar</h3></div><div className="p-2.5 space-y-2">{[['4 gecikmiş fatura', 'MegaMarka 19g · Karataş 26g · Aydın 15g · Ekin 5g', 'rose'], ['3 fatura 7 gün içinde vadede', 'Bosch ₺142K · FastGrow ₺24.5K · BigBrand ₺48K', 'amber'], ['GIB onay bekleyen 3 e-fatura', 'Bekleme süresi 2-4 saat · normal', 'amber']].map(([title, text, clr]) => <div key={title} className={`flex items-start gap-2 p-2 bg-white dark:bg-[#1e1f26] border border-${clr}-200 dark:border-${clr}-500/30 rounded text-[10px]`}><Svg className={`text-${clr}-500 w-3 h-3 shrink-0 mt-0.5`}><circle cx="12" cy="12" r="10" />{clr === 'rose' ? <><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></> : <polyline points="12 6 12 12 16 14" />}</Svg><div className="flex-1 min-w-0"><p className="font-semibold text-gray-900 dark:text-gray-100">{title}</p><p className="text-gray-500 dark:text-gray-400">{text}</p></div></div>)}</div></div>

          <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden"><div className="p-3 border-b border-gray-100 dark:border-gray-700/40 flex items-center gap-2"><Svg className="text-emerald-600 dark:text-emerald-400 w-3.5 h-3.5"><polyline points="3 17 9 11 13 15 21 7" /><polyline points="14 7 21 7 21 14" /></Svg><h3 className="text-[12px] font-bold text-gray-900 dark:text-gray-100">Bu Haftaki Tahsilat</h3></div><div className="p-3"><div className="flex items-end justify-between gap-1 mb-2" style={{ height: 80 }}>{[{ d: 'Pzt', v: 42 }, { d: 'Sal', v: 28 }, { d: 'Çar', v: 68 }, { d: 'Per', v: 142, today: true }, { d: 'Cum', v: 0 }, { d: 'Cmt', v: 0 }, { d: 'Pzr', v: 0 }].map((day) => <div key={day.d} className="flex flex-col items-center gap-1 flex-1"><div className={`w-full ${day.today ? 'bg-emerald-500' : 'bg-emerald-300 dark:bg-emerald-500/40'} rounded-t`} style={{ height: `${day.v ? Math.max((day.v / 142) * 100, 10) : 5}%` }} /><span className={`text-[8px] font-mono ${day.today ? 'text-emerald-700 dark:text-emerald-300 font-bold' : 'text-gray-500 dark:text-gray-500'}`}>{day.d}</span></div>)}</div><div className="pt-2 mt-2 border-t border-gray-100 dark:border-gray-700/40 flex items-center justify-between text-[10px]"><span className="text-gray-500 dark:text-gray-400">Haftalık Toplam</span><span className="font-bold font-mono text-emerald-700 dark:text-emerald-300">₺280.000</span></div></div></div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-emerald-50/50 via-transparent to-sky-50/50 dark:from-emerald-500/5 dark:to-sky-500/5 border border-emerald-200/50 dark:border-emerald-500/20 rounded-xl p-3 flex items-start gap-2.5">
        <Svg className="text-teal-600 dark:text-teal-400 w-4 h-4 shrink-0 mt-0.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></Svg>
        <div className="flex-1"><p className="text-[11px] text-gray-700 dark:text-gray-300"><span className="font-bold text-teal-700 dark:text-teal-300">Paraşüt Entegrasyonu:</span> Tüm faturalar <span className="font-mono">api.parasut.com/v4</span> üzerinden otomatik senkron. E-fatura/e-arşiv GIB üzerinden onaylanır. Tahsilat kayıtları banka hesaplarıyla otomatik eşleştirilir. Yeni fatura kesmek, tahsilat girmek veya ödeme eşleştirmek için yukarıdaki butonları kullanın.</p></div>
      </div>
    </div>
  );
}
