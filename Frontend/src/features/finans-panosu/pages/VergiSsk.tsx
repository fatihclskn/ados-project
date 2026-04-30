import { type ChangeEvent, type ReactNode, useMemo, useState } from 'react';

type ColorName = 'amber' | 'emerald' | 'indigo' | 'rose' | 'violet' | 'sky' | 'gray' | 'red' | 'teal';
type Company = 'digital' | 'bilisim';
type CompanyFilter = Company | 'all';
type TaxType = 'kdv' | 'muhsgk' | 'gecici' | 'kurumlar' | 'stopaj' | 'damga';
type TaxTypeFilter = TaxType | 'all';
type TaxStatus = 'paid' | 'pending' | 'urgent' | 'late' | 'muaf';
type TaxStatusFilter = TaxStatus | 'all';
type ModalType = 'beyanname' | 'odeme' | null;

type VergiKaydi = {
  id: string;
  type: TaxType;
  period: string;
  company: Company;
  amount: number;
  declareDate: string;
  payDate: string;
  status: TaxStatus;
  notes: string;
};

const CM: Record<ColorName, { bg: string; t: string; border: string; bar: string }> = {
  amber: { bg: 'bg-amber-100 dark:bg-amber-900/30', t: 'text-amber-700 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-500/30', bar: 'bg-gradient-to-r from-amber-400 to-amber-600' },
  emerald: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', t: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-500/30', bar: 'bg-gradient-to-r from-emerald-400 to-emerald-600' },
  indigo: { bg: 'bg-indigo-100 dark:bg-indigo-900/30', t: 'text-indigo-700 dark:text-indigo-300', border: 'border-indigo-200 dark:border-indigo-500/30', bar: 'bg-gradient-to-r from-indigo-400 to-indigo-600' },
  rose: { bg: 'bg-rose-100 dark:bg-rose-900/30', t: 'text-rose-700 dark:text-rose-300', border: 'border-rose-200 dark:border-rose-500/30', bar: 'bg-gradient-to-r from-rose-400 to-rose-600' },
  violet: { bg: 'bg-violet-100 dark:bg-violet-900/30', t: 'text-violet-700 dark:text-violet-300', border: 'border-violet-200 dark:border-violet-500/30', bar: 'bg-gradient-to-r from-violet-400 to-violet-600' },
  sky: { bg: 'bg-sky-100 dark:bg-sky-900/30', t: 'text-sky-700 dark:text-sky-300', border: 'border-sky-200 dark:border-sky-500/30', bar: 'bg-gradient-to-r from-sky-400 to-sky-600' },
  gray: { bg: 'bg-gray-100 dark:bg-gray-800', t: 'text-gray-700 dark:text-gray-300', border: 'border-gray-200 dark:border-gray-600/50', bar: 'bg-gradient-to-r from-gray-400 to-gray-600' },
  red: { bg: 'bg-red-100 dark:bg-red-900/30', t: 'text-red-700 dark:text-red-300', border: 'border-red-200 dark:border-red-500/30', bar: 'bg-gradient-to-r from-red-400 to-red-600' },
  teal: { bg: 'bg-teal-100 dark:bg-teal-900/30', t: 'text-teal-700 dark:text-teal-300', border: 'border-teal-200 dark:border-teal-500/30', bar: 'bg-gradient-to-r from-teal-400 to-teal-600' },
};

const vergiler: VergiKaydi[] = [
  { id: 'V-2026-D01', type: 'kdv', period: 'Nisan 2026', company: 'digital', amount: 0, declareDate: '26.04.2026', payDate: '28.04.2026', status: 'muaf', notes: 'Teknopark muafiyeti · KDV’siz fatura kesiminden' },
  { id: 'V-2026-D02', type: 'muhsgk', period: 'Nisan 2026', company: 'digital', amount: 84500, declareDate: '26.04.2026', payDate: '30.04.2026', status: 'pending', notes: '5 personel SSK primi + stopaj birleşik beyan' },
  { id: 'V-2026-D03', type: 'gecici', period: 'Q1 2026 (Oca-Şub-Mar)', company: 'digital', amount: 0, declareDate: '17.05.2026', payDate: '17.05.2026', status: 'muaf', notes: 'Teknopark faaliyet geliri muafiyet (4691 sayılı kanun)' },
  { id: 'V-2026-D04', type: 'stopaj', period: 'Nisan 2026 (SM)', company: 'digital', amount: 6200, declareDate: '26.04.2026', payDate: '30.04.2026', status: 'paid', notes: 'Freelance hakediş stopajı · %20 oran' },
  { id: 'V-2026-D05', type: 'damga', period: 'Nisan 2026', company: 'digital', amount: 1850, declareDate: '26.04.2026', payDate: '30.04.2026', status: 'paid', notes: 'Sözleşme + bordro damga vergisi' },
  { id: 'V-2026-B01', type: 'kdv', period: 'Nisan 2026', company: 'bilisim', amount: 28400, declareDate: '26.04.2026', payDate: '28.04.2026', status: 'urgent', notes: '5 gün kaldı! Hesaplanan KDV - İndirilecek KDV' },
  { id: 'V-2026-B02', type: 'muhsgk', period: 'Nisan 2026', company: 'bilisim', amount: 32800, declareDate: '26.04.2026', payDate: '30.04.2026', status: 'pending', notes: '3 personel SSK + stopaj' },
  { id: 'V-2026-B03', type: 'gecici', period: 'Q1 2026 (Oca-Şub-Mar)', company: 'bilisim', amount: 18750, declareDate: '17.05.2026', payDate: '17.05.2026', status: 'pending', notes: 'Kurum kazancı %25 üzerinden · 1. dönem' },
  { id: 'V-2026-B04', type: 'kurumlar', period: '2025 Yıllık', company: 'bilisim', amount: 42500, declareDate: '30.04.2026', payDate: '30.04.2026', status: 'pending', notes: '2025 kırmızı karda %25 · 4 taksit opsiyonu mevcut' },
  { id: 'V-2026-B05', type: 'stopaj', period: 'Nisan 2026', company: 'bilisim', amount: 3400, declareDate: '26.04.2026', payDate: '30.04.2026', status: 'pending', notes: 'Kira stopajı + serbest meslek' },
  { id: 'V-2026-B06', type: 'damga', period: 'Nisan 2026', company: 'bilisim', amount: 1240, declareDate: '26.04.2026', payDate: '30.04.2026', status: 'pending', notes: 'Sözleşme damga vergisi' },
  { id: 'V-2026-B07', type: 'kdv', period: 'Mart 2026', company: 'bilisim', amount: 24800, declareDate: '26.03.2026', payDate: '28.03.2026', status: 'paid', notes: 'Ödendi' },
  { id: 'V-2026-D06', type: 'muhsgk', period: 'Mart 2026', company: 'digital', amount: 82100, declareDate: '26.03.2026', payDate: '31.03.2026', status: 'paid', notes: 'Ödendi' },
  { id: 'V-2025-B99', type: 'kdv', period: 'Şubat 2026', company: 'bilisim', amount: 22100, declareDate: '26.02.2026', payDate: '28.02.2026', status: 'late', notes: '10 gün gecikti · faiz ₺184' },
];

const typeConf: Record<TaxType, { lbl: string; sub: string; clr: ColorName; icon: ReactNode }> = {
  kdv: { lbl: 'KDV', sub: 'Katma Değer Vergisi', clr: 'indigo', icon: <><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="9" y1="9" x2="15" y2="9" /><line x1="9" y1="15" x2="15" y2="15" /></> },
  muhsgk: { lbl: 'MUHSGK', sub: 'Muhtasar + SSK Primi', clr: 'rose', icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /></> },
  gecici: { lbl: 'Geçici Vergi', sub: '3 Aylık Kurum Kazancı', clr: 'amber', icon: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></> },
  kurumlar: { lbl: 'Kurumlar Vergisi', sub: 'Yıllık · Nisan beyan', clr: 'violet', icon: <path d="M3 21h18M5 21V8l7-5 7 5v13M10 21v-5a2 2 0 0 1 4 0v5" /> },
  stopaj: { lbl: 'Stopaj', sub: 'Gelir vergisi kesinti', clr: 'sky', icon: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /> },
  damga: { lbl: 'Damga Vergisi', sub: 'Sözleşme · bordro', clr: 'gray', icon: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /> },
};

const statusConf: Record<TaxStatus, { lbl: string; clr: ColorName; dot: boolean }> = {
  paid: { lbl: 'Ödendi', clr: 'emerald', dot: false },
  pending: { lbl: 'Bekliyor', clr: 'amber', dot: false },
  urgent: { lbl: 'YAKLAŞIYOR', clr: 'rose', dot: true },
  late: { lbl: 'GECİKMİŞ', clr: 'red', dot: true },
  muaf: { lbl: 'Muaf', clr: 'gray', dot: false },
};

const kdvHesap: Record<Company, { satisKDV: number; alisKDV: number; netKDV: number; satisCount: number; alisCount: number; muaf: boolean }> = {
  digital: { satisKDV: 0, alisKDV: 8420, netKDV: -8420, satisCount: 0, alisCount: 28, muaf: true },
  bilisim: { satisKDV: 52800, alisKDV: 24400, netKDV: 28400, satisCount: 12, alisCount: 34, muaf: false },
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

function shortMoney(value: number, decimals = 0) {
  return `₺${(value / 1000).toFixed(decimals)}K`;
}

function companyLabel(company: Company) {
  return company === 'digital' ? 'Digital' : 'Bilişim';
}

function companyFull(company: Company) {
  return company === 'digital' ? 'Arma Digital Medya A.Ş.' : 'Arma Bilişim Ltd. Şti.';
}

function companyColor(company: Company): ColorName {
  return company === 'digital' ? 'emerald' : 'indigo';
}

function daysLeft(payDate: string) {
  const [day, month, year] = payDate.split('.').map(Number);
  const today = new Date(2026, 3, 23);
  const pay = new Date(year, month - 1, day);
  return Math.round((pay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function ContentToast({ toast, onClose }: { toast: { title: string; text: string; color: ColorName } | null; onClose: () => void }) {
  if (!toast) return null;
  const cm = CM[toast.color];
  return (
    <div className="absolute right-4 top-4 z-50 w-[310px] bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-3">
      <div className="flex items-start gap-2">
        <div className={`w-8 h-8 ${cm.bg} rounded-md flex items-center justify-center shrink-0`}>
          <Svg className={`${cm.t} w-4 h-4`}>
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </Svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100">{toast.title}</p>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{toast.text}</p>
        </div>
        <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1">
          <Svg className="w-3.5 h-3.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </Svg>
        </button>
      </div>
    </div>
  );
}

function ModalFrame({ children, onClose, maxWidth = 'max-w-[720px]' }: { children: ReactNode; onClose: () => void; maxWidth?: string }) {
  return (
    <div className="absolute inset-0 z-40">
      <div className="modal-overlay absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="modal-panel absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
        <div className={`modal-scroll bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-xl w-full ${maxWidth} max-h-[94%] overflow-y-auto pointer-events-auto`}>
          {children}
        </div>
      </div>
    </div>
  );
}

function ModalCloseButton({ onClose }: { onClose: () => void }) {
  return (
    <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1">
      <Svg className="w-5 h-5">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </Svg>
    </button>
  );
}

function OdemeModal({ record, onClose, onToast }: { record?: VergiKaydi; onClose: () => void; onToast: (title: string, text: string, color: ColorName) => void }) {
  const d = record ?? vergiler.find((item) => item.id === 'V-2026-B01') ?? vergiler[0];
  const cClr = companyColor(d.company);
  const kalan = daysLeft(d.payDate);

  return (
    <ModalFrame onClose={onClose} maxWidth="max-w-[560px]">
      <div className="sticky top-0 z-10 bg-white dark:bg-[#1e1f26] border-b border-gray-100 dark:border-gray-700/60 p-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-amber-100 dark:bg-amber-500/20 rounded-lg flex items-center justify-center">
            <Svg className="text-amber-600 dark:text-amber-400 w-4 h-4">
              <polyline points="20 6 9 17 4 12" />
            </Svg>
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-gray-900 dark:text-gray-100">Vergi Ödemesi Kaydet</h2>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">{d.id} · {typeConf[d.type].lbl}</p>
          </div>
        </div>
        <ModalCloseButton onClose={onClose} />
      </div>

      <div className="p-5 space-y-4">
        <div className="p-4 bg-gradient-to-br from-amber-50 to-rose-50/50 dark:from-amber-500/10 dark:to-rose-500/5 border-2 border-amber-200 dark:border-amber-500/40 rounded-xl">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <p className="text-[10px] font-semibold text-amber-800 dark:text-amber-200 uppercase tracking-wider">{typeConf[d.type].lbl} · {d.period}</p>
              <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-0.5">{d.notes}</p>
            </div>
            <div className="text-right">
              <p className="text-[22px] font-black font-mono text-amber-800 dark:text-amber-200 leading-none">{money(d.amount)}</p>
            </div>
          </div>
          <div className="pt-3 mt-3 border-t border-amber-200 dark:border-amber-500/30 grid grid-cols-2 gap-2 text-[10px]">
            <div>
              <p className="font-semibold text-gray-500 dark:text-gray-400">Şirket</p>
              <p className={`font-bold ${CM[cClr].t} mt-0.5`}>{companyFull(d.company)}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-500 dark:text-gray-400">Son Ödeme</p>
              <p className={`font-bold font-mono ${kalan <= 5 ? 'text-rose-700 dark:text-rose-300' : 'text-gray-900 dark:text-gray-100'} mt-0.5`}>{d.payDate} ({Math.max(kalan, 0)} gün)</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Ödeme Tarihi *</label>
            <input type="date" defaultValue="2026-04-23" className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono focus:outline-none focus:border-amber-500" />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Ödenecek Banka Hesabı *</label>
            <select defaultValue="garanti" className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:border-amber-500">
              <option value="garanti">Garanti · TR••••0062 1234</option>
              <option value="enpara">Enpara · TR••••0111 8842</option>
              <option value="teb">TEB · TR••••0032 9451</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wider">Ödeme Yöntemi</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 'eft', title: 'EFT / Havale', sub: 'Banka üzerinden', color: 'amber' },
              { value: 'gib', title: 'GİB Kredi K.', sub: 'interaktif.gib.gov', color: 'indigo' },
              { value: 'taksit', title: 'Taksitlendirme', sub: 'Yapılandırma', color: 'violet' },
            ].map((item, index) => (
              <label key={item.value} className="cursor-pointer">
                <input type="radio" name="vergiPay" value={item.value} className="sr-only peer" defaultChecked={index === 0} />
                <div className={`p-2.5 bg-white dark:bg-[#17181f] border-2 border-gray-200 dark:border-gray-700 peer-checked:border-${item.color}-500 peer-checked:bg-${item.color}-50 dark:peer-checked:bg-${item.color}-500/10 rounded-lg text-center transition-all`}>
                  <p className="text-[11px] font-bold text-gray-900 dark:text-gray-100">{item.title}</p>
                  <p className="text-[9px] text-gray-500 dark:text-gray-400">{item.sub}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Tahakkuk / Dekont No</label>
            <input type="text" placeholder="Örn: TK-2026-4-8842" className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono focus:outline-none focus:border-amber-500" />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Ödenen Tutar *</label>
            <input type="text" defaultValue={d.amount.toLocaleString('tr-TR')} className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono text-right font-bold focus:outline-none focus:border-amber-500" />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wider">Dekont / Ödeme Belgesi</label>
          <label className="block cursor-pointer">
            <input type="file" accept=".pdf,.jpg,.png" className="hidden" />
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-amber-500 rounded-lg p-3 text-center transition-all">
              <Svg className="text-gray-400 w-5 h-5 mx-auto mb-1">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </Svg>
              <p className="text-[11px] font-semibold text-gray-700 dark:text-gray-300">Dekont yükle</p>
              <p className="text-[9px] text-gray-500 dark:text-gray-400">PDF · JPG · PNG</p>
            </div>
          </label>
        </div>

        <div>
          <label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Notlar</label>
          <textarea rows={2} placeholder="Ödeme hakkında not..." className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 resize-none focus:outline-none focus:border-amber-500" />
        </div>

        <div className="p-3 bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/30 rounded-md flex items-start gap-2">
          <Svg className="text-teal-600 dark:text-teal-400 w-4 h-4 shrink-0 mt-0.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </Svg>
          <div className="text-[10px]">
            <p className="font-bold text-teal-900 dark:text-teal-200">Paraşüt’e otomatik kaydet</p>
            <p className="text-teal-700 dark:text-teal-300 mt-0.5">Vergi ödemesi banka hareketi olarak kaydedilecek · gider hesabı otomatik seçilecek · muhasebe kapanışı güncelleniyor</p>
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 bg-white dark:bg-[#1e1f26] border-t border-gray-100 dark:border-gray-700/60 p-4 flex items-center justify-end gap-2">
        <button type="button" onClick={onClose} className="px-3 py-2 text-[11px] font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">İptal</button>
        <button
          type="button"
          onClick={() => {
            onToast('Ödeme Kaydedildi', 'Vergi ödemesi sisteme işlendi · Paraşüt’e banka hareketi yazıldı · beyanname kapandı', 'emerald');
            onClose();
          }}
          className="flex items-center gap-1.5 px-4 py-2 text-[11px] font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-md"
        >
          <Svg className="w-3 h-3">
            <polyline points="20 6 9 17 4 12" />
          </Svg>
          Ödemeyi Kaydet
        </button>
      </div>
    </ModalFrame>
  );
}

function BeyannameModal({ companyFilter, onClose, onToast }: { companyFilter: CompanyFilter; onClose: () => void; onToast: (title: string, text: string, color: ColorName) => void }) {
  const [belgeTuru, setBelgeTuru] = useState<'beyanname' | 'tahakkuk'>('beyanname');
  const [fileInfo, setFileInfo] = useState<string | null>(null);
  const [aiDone, setAiDone] = useState(false);
  const [belgeNo, setBelgeNo] = useState('');
  const [netTutar, setNetTutar] = useState('');

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setFileInfo(`${file.name} · ${(file.size / 1024).toFixed(0)} KB`);
    setAiDone(false);
    onToast('Dosya Yüklendi', 'AI analiz başladı · belge içeriği okunuyor', 'violet');
    window.setTimeout(() => {
      setAiDone(true);
      setBelgeNo((current) => current || 'BYN-2026-04-8842-0012');
      setNetTutar((current) => current || '28.400,00');
    }, 800);
  }

  return (
    <ModalFrame onClose={onClose}>
      <div className="sticky top-0 z-10 bg-white dark:bg-[#1e1f26] border-b border-gray-100 dark:border-gray-700/60 p-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-amber-100 dark:bg-amber-500/20 rounded-lg flex items-center justify-center">
            <Svg className="text-amber-600 dark:text-amber-400 w-4 h-4">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </Svg>
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-gray-900 dark:text-gray-100">Beyanname / Tahakkuk Fişi Ekle</h2>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">Belgeden veritabanına vergi borcu kaydı oluşturulur</p>
          </div>
        </div>
        <ModalCloseButton onClose={onClose} />
      </div>

      <div className="p-5 space-y-5">
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <span className="flex items-center justify-center w-5 h-5 bg-amber-600 text-white text-[10px] font-bold rounded-full">1</span>
            <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Belge Türü *</label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <label className="cursor-pointer">
              <input type="radio" name="belgeTuru" value="beyanname" className="sr-only peer" checked={belgeTuru === 'beyanname'} onChange={() => setBelgeTuru('beyanname')} />
              <div className="h-full p-3 bg-white dark:bg-[#17181f] border-2 border-gray-200 dark:border-gray-700 peer-checked:border-amber-500 peer-checked:bg-amber-50 dark:peer-checked:bg-amber-500/10 rounded-lg transition-all">
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 bg-amber-100 dark:bg-amber-500/20 rounded-md flex items-center justify-center shrink-0">
                    <Svg className="text-amber-600 dark:text-amber-400 w-4 h-4">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                    </Svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100 leading-tight">Beyanname</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1.5">KDV · MUHSGK · Geçici · Kurumlar · mükellef beyanı</p>
                  </div>
                </div>
              </div>
            </label>
            <label className="cursor-pointer">
              <input type="radio" name="belgeTuru" value="tahakkuk" className="sr-only peer" checked={belgeTuru === 'tahakkuk'} onChange={() => setBelgeTuru('tahakkuk')} />
              <div className="h-full p-3 bg-white dark:bg-[#17181f] border-2 border-gray-200 dark:border-gray-700 peer-checked:border-rose-500 peer-checked:bg-rose-50 dark:peer-checked:bg-rose-500/10 rounded-lg transition-all">
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 bg-rose-100 dark:bg-rose-500/20 rounded-md flex items-center justify-center shrink-0">
                    <Svg className="text-rose-600 dark:text-rose-400 w-4 h-4">
                      <path d="M20 6L9 17l-5-5" />
                      <path d="M9 7h.01M13 7h.01M17 7h.01" />
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                    </Svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100 leading-tight">Tahakkuk Fişi</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1.5">Vergi dairesi resmi belgesi · tahakkuk eden borç</p>
                  </div>
                </div>
              </div>
            </label>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <span className="flex items-center justify-center w-5 h-5 bg-amber-600 text-white text-[10px] font-bold rounded-full">2</span>
            <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Belge Dosyası</label>
            <span className="text-[9px] text-gray-400 dark:text-gray-500">(PDF önerilir · AI alanları doldurur)</span>
          </div>
          <label htmlFor="beyannameFile" className="block cursor-pointer">
            <input type="file" id="beyannameFile" accept=".pdf,.jpg,.png,.xml" className="hidden" onChange={handleFile} />
            <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-amber-500 dark:hover:border-amber-400 hover:bg-amber-50/30 dark:hover:bg-amber-500/5 rounded-lg p-5 text-center transition-all">
              <Svg className="text-gray-400 w-8 h-8 mx-auto mb-2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </Svg>
              <p className="text-[12px] font-semibold text-gray-700 dark:text-gray-300">Beyanname / Tahakkuk fişini yükleyin</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">PDF · JPG · PNG · XML (e-Beyanname) · max 10 MB</p>
              {fileInfo && (
                <div id="beyannameFileInfo" className="mt-3 p-2.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-md">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <Svg className="text-emerald-600 dark:text-emerald-400 w-4 h-4 shrink-0">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </Svg>
                      <span id="beyannameFileName" className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-200 truncate">{fileInfo}</span>
                    </div>
                    <button type="button" onClick={(event) => { event.preventDefault(); setFileInfo(null); setAiDone(false); }} className="text-rose-500 hover:text-rose-600 shrink-0">
                      <Svg className="w-3.5 h-3.5">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </Svg>
                    </button>
                  </div>
                  <div id="beyannameAiStatus" className="text-[9px] text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                    {aiDone ? (
                      <>
                        <Svg className="w-3 h-3"><polyline points="20 6 9 17 4 12" /></Svg>
                        <span className="font-bold">Tamamlandı!</span> Vergi türü, dönem, tarihler ve tutar otomatik dolduruldu · kontrol edip kaydedin
                      </>
                    ) : (
                      <>
                        <Svg className="w-3 h-3 animate-pulse"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" /></Svg>
                        AI analiz ediyor · alan bilgileri otomatik dolduruluyor...
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </label>
        </div>

        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <span className="flex items-center justify-center w-5 h-5 bg-amber-600 text-white text-[10px] font-bold rounded-full">3</span>
            <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Şirket ve Vergi Türü *</label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
            <label className="cursor-pointer">
              <input type="radio" name="beyCompany" value="digital" className="sr-only peer" defaultChecked={companyFilter === 'digital' || companyFilter === 'all'} />
              <div className="h-full p-2.5 bg-white dark:bg-[#17181f] border-2 border-gray-200 dark:border-gray-700 peer-checked:border-emerald-500 peer-checked:bg-emerald-50 dark:peer-checked:bg-emerald-500/10 rounded-md transition-all">
                <div className="flex items-center gap-2">
                  <Svg className="text-emerald-600 dark:text-emerald-400 w-4 h-4 shrink-0">
                    <path d="M3 3h18v18H3z" />
                    <path d="M3 9h18" />
                    <path d="M9 21V9" />
                  </Svg>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-gray-900 dark:text-gray-100 truncate">Arma Digital A.Ş.</p>
                    <p className="text-[9px] text-emerald-700 dark:text-emerald-400">TEKNOPARK · muafiyetli</p>
                  </div>
                </div>
              </div>
            </label>
            <label className="cursor-pointer">
              <input type="radio" name="beyCompany" value="bilisim" className="sr-only peer" defaultChecked={companyFilter === 'bilisim'} />
              <div className="h-full p-2.5 bg-white dark:bg-[#17181f] border-2 border-gray-200 dark:border-gray-700 peer-checked:border-indigo-500 peer-checked:bg-indigo-50 dark:peer-checked:bg-indigo-500/10 rounded-md transition-all">
                <div className="flex items-center gap-2">
                  <Svg className="text-indigo-600 dark:text-indigo-400 w-4 h-4 shrink-0">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M7 8h10M7 12h10M7 16h6" />
                  </Svg>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-gray-900 dark:text-gray-100 truncate">Arma Bilişim Ltd.</p>
                    <p className="text-[9px] text-indigo-700 dark:text-indigo-400">Standart · %20 KDV</p>
                  </div>
                </div>
              </div>
            </label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1">Vergi Türü *</label>
              <select id="vergiTuruSelect" className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:border-amber-500">
                <option value="kdv">KDV (Katma Değer Vergisi)</option>
                <option value="kdv2">KDV-2 (Sorumlu sıfatıyla)</option>
                <option value="muhsgk">MUHSGK (Muhtasar + Prim)</option>
                <option value="gecici">Geçici Vergi (3 aylık)</option>
                <option value="kurumlar">Kurumlar Vergisi (yıllık)</option>
                <option value="stopaj">Stopaj (gelir vergisi)</option>
                <option value="damga">Damga Vergisi</option>
                <option value="oiv">ÖİV (Özel İletişim Vergisi)</option>
                <option value="diger">Diğer</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1">Dönem *</label>
              <div className="flex items-center gap-1">
                <select id="donemAySelect" defaultValue="04" className="flex-1 px-2 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:border-amber-500">
                  {['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'].map((month, index) => (
                    <option key={month} value={String(index + 1).padStart(2, '0')}>{month}</option>
                  ))}
                  <option value="Q1">Q1 (Oca-Şub-Mar)</option>
                  <option value="Q2">Q2 (Nis-May-Haz)</option>
                  <option value="Q3">Q3 (Tem-Ağu-Eyl)</option>
                  <option value="Q4">Q4 (Eki-Kas-Ara)</option>
                  <option value="yillik">Yıllık</option>
                </select>
                <select defaultValue="2026" className="w-20 px-2 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono focus:outline-none focus:border-amber-500">
                  <option>2026</option>
                  <option>2025</option>
                  <option>2024</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <span className="flex items-center justify-center w-5 h-5 bg-amber-600 text-white text-[10px] font-bold rounded-full">4</span>
            <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Belge Numaraları ve Tarihleri *</label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
            <div>
              <label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                <span id="lblBelgeNo">{belgeTuru === 'tahakkuk' ? 'İlgili Beyanname No' : 'Beyanname Kayıt No'}</span> *
              </label>
              <input type="text" id="belgeNoInput" value={belgeNo} onChange={(event) => setBelgeNo(event.target.value)} placeholder="Örn: BYN-2026-04-8842 veya 2026040412345678" className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono focus:outline-none focus:border-amber-500" />
            </div>
            {belgeTuru === 'tahakkuk' && (
              <div id="tahakkukNoDiv">
                <label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1">Tahakkuk Fişi No *</label>
                <input type="text" placeholder="Örn: TK-2026-4-123456" className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono focus:outline-none focus:border-amber-500" />
              </div>
            )}
            <div id="vdKoduField">
              <label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1">Vergi Dairesi</label>
              <select className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:border-amber-500">
                <option>Beşiktaş V.D.</option>
                <option>Şişli V.D.</option>
                <option>Kadıköy V.D.</option>
                <option>Maslak V.D.</option>
                <option>Büyük Mükellefler V.D.</option>
                <option>Çankaya V.D. (Ankara)</option>
                <option>Diğer...</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div>
              <label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1" id="lblBeyanTarihi">{belgeTuru === 'tahakkuk' ? 'Düzenleme Tarihi *' : 'Beyan Tarihi *'}</label>
              <input type="date" defaultValue="2026-04-26" className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono focus:outline-none focus:border-amber-500" />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1">Tahakkuk Tarihi</label>
              <input type="date" defaultValue="2026-04-26" className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono focus:outline-none focus:border-amber-500" />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1">Son Ödeme Tarihi *</label>
              <input type="date" defaultValue="2026-04-28" className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono focus:outline-none focus:border-amber-500" />
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <span className="flex items-center justify-center w-5 h-5 bg-amber-600 text-white text-[10px] font-bold rounded-full">5</span>
            <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Tahakkuk Eden Tutar *</label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div>
              <label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1">Matrah / Brüt</label>
              <input type="text" placeholder="142.000,00" className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono text-right focus:outline-none focus:border-amber-500" />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1">İndirim / Mahsup</label>
              <input type="text" placeholder="0,00" className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono text-right focus:outline-none focus:border-amber-500" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-rose-700 dark:text-rose-300 mb-1 uppercase tracking-wider">Ödenecek Net Tutar *</label>
              <input type="text" id="netTutarInput" value={netTutar} onChange={(event) => setNetTutar(event.target.value)} placeholder="28.400,00" className="w-full px-3 py-2 text-[13px] bg-rose-50 dark:bg-rose-500/10 border-2 border-rose-300 dark:border-rose-500/40 rounded-md text-rose-900 dark:text-rose-200 font-mono text-right font-bold focus:outline-none focus:border-rose-500" />
            </div>
          </div>
          <p className="text-[9px] text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
            <Svg className="text-amber-500 w-3 h-3">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </Svg>
            Net tutar veritabanına borç olarak yazılacak · Paraşüt’e gider olarak işlenecek · ödeme tarihi yaklaştığında hatırlatma gönderilir
          </p>
        </div>

        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <span className="flex items-center justify-center w-5 h-5 bg-amber-600 text-white text-[10px] font-bold rounded-full">6</span>
            <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Açıklama / Notlar</label>
          </div>
          <textarea rows={2} placeholder="Beyanname detayı, özel durum, mahsup kaynağı..." className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 resize-none focus:outline-none focus:border-amber-500" />
        </div>

        <InfoBlocks />
      </div>

      <div className="sticky bottom-0 bg-white dark:bg-[#1e1f26] border-t border-gray-100 dark:border-gray-700/60 p-4 flex items-center justify-end gap-2">
        <button type="button" onClick={onClose} className="px-3 py-2 text-[11px] font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">İptal</button>
        <button
          type="button"
          onClick={() => {
            onToast('Taslak Kaydedildi', 'Belge taslak olarak saklandı · daha sonra tamamlanabilir', 'gray');
            onClose();
          }}
          className="flex items-center gap-1 px-3 py-2 text-[11px] font-semibold bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50"
        >
          Taslağa Kaydet
        </button>
        <button
          type="button"
          onClick={() => {
            onToast('Beyanname Kaydedildi', 'Belge veritabanına kaydedildi · vergi borcu oluşturuldu · Vergi/SSK tablosunda "Bekleyen" olarak görünüyor', 'emerald');
            onClose();
          }}
          className="flex items-center gap-1.5 px-4 py-2 text-[11px] font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-md"
        >
          <Svg className="w-3 h-3">
            <polyline points="20 6 9 17 4 12" />
          </Svg>
          Belgeyi Kaydet
        </button>
      </div>
    </ModalFrame>
  );
}

function InfoBlocks() {
  return (
    <>
      <div className="p-3 bg-gradient-to-br from-violet-50 to-sky-50 dark:from-violet-500/10 dark:to-sky-500/5 border border-violet-200 dark:border-violet-500/30 rounded-lg flex items-start gap-2">
        <Svg className="text-violet-600 dark:text-violet-400 w-4 h-4 shrink-0 mt-0.5">
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        </Svg>
        <div className="text-[10px]">
          <p className="font-bold text-violet-900 dark:text-violet-200">AI Otomatik Okuma</p>
          <p className="text-violet-700 dark:text-violet-300 mt-0.5">Beyanname veya tahakkuk fişi PDF'ini yüklerseniz GPT-4 belgeyi parse ederek vergi türü, dönem, belge numaraları, tarihler ve tahakkuk tutarlarını otomatik doldurur · e-Beyanname XML formatı da desteklenir</p>
        </div>
      </div>
      <div className="p-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-md flex items-start gap-2">
        <Svg className="text-amber-600 dark:text-amber-400 w-4 h-4 shrink-0 mt-0.5">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </Svg>
        <div className="text-[10px]">
          <p className="font-bold text-amber-900 dark:text-amber-200">Kayıttan sonra</p>
          <p className="text-amber-700 dark:text-amber-300 mt-0.5">Belge <span className="font-bold">veritabanına</span> kaydedilir · tahakkuk eden tutar Vergi/SSK tablosunda <span className="font-bold">"Bekleyen borç"</span> olarak görünür · Paraşüt’e gider kaydı açılır · son ödeme günü yaklaşınca <span className="font-bold">"Yaklaşıyor" uyarısı</span> otomatik tetiklenir · PDF arşivde saklanır</p>
        </div>
      </div>
    </>
  );
}

export default function VergiSsk() {
  const [companyFilter, setCompanyFilter] = useState<CompanyFilter>('all');
  const [statusFilter, setStatusFilter] = useState<TaxStatusFilter>('all');
  const [typeFilter, setTypeFilter] = useState<TaxTypeFilter>('all');
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<ModalType>(null);
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [toast, setToast] = useState<{ title: string; text: string; color: ColorName } | null>(null);

  function showToast(title: string, text: string, color: ColorName) {
    setToast({ title, text, color });
    window.setTimeout(() => setToast(null), 2800);
  }

  const scope = useMemo(() => (companyFilter === 'all' ? vergiler : vergiler.filter((item) => item.company === companyFilter)), [companyFilter]);
  const filtered = useMemo(() => {
    const q = search.trim().toLocaleLowerCase('tr-TR');
    return scope.filter((item) => {
      const statusOk = statusFilter === 'all' || item.status === statusFilter;
      const typeOk = typeFilter === 'all' || item.type === typeFilter;
      const searchOk = !q || `${item.id} ${item.period} ${item.notes} ${typeConf[item.type].lbl}`.toLocaleLowerCase('tr-TR').includes(q);
      return statusOk && typeOk && searchOk;
    });
  }, [scope, statusFilter, typeFilter, search]);

  const stats = useMemo(() => ({
    totalBorc: scope.filter((item) => item.status === 'pending' || item.status === 'urgent').reduce((sum, item) => sum + item.amount, 0),
    totalPaid: scope.filter((item) => item.status === 'paid').reduce((sum, item) => sum + item.amount, 0),
    urgent: scope.filter((item) => item.status === 'urgent').length,
    late: scope.filter((item) => item.status === 'late').length,
    kdvBorc: scope.filter((item) => item.type === 'kdv' && (item.status === 'pending' || item.status === 'urgent')).reduce((sum, item) => sum + item.amount, 0),
    muhsgkBorc: scope.filter((item) => item.type === 'muhsgk' && (item.status === 'pending' || item.status === 'urgent')).reduce((sum, item) => sum + item.amount, 0),
    geciciBorc: scope.filter((item) => item.type === 'gecici' && (item.status === 'pending' || item.status === 'urgent')).reduce((sum, item) => sum + item.amount, 0),
    kurumlarBorc: scope.filter((item) => item.type === 'kurumlar' && (item.status === 'pending' || item.status === 'urgent')).reduce((sum, item) => sum + item.amount, 0),
  }), [scope]);

  const selectedRecord = selectedId ? vergiler.find((item) => item.id === selectedId) : undefined;

  return (
    <div className="relative space-y-4">
      <ContentToast toast={toast} onClose={() => setToast(null)} />
      {modal === 'odeme' && <OdemeModal record={selectedRecord} onClose={() => setModal(null)} onToast={showToast} />}
      {modal === 'beyanname' && <BeyannameModal companyFilter={companyFilter} onClose={() => setModal(null)} onToast={showToast} />}

      <HeaderActions
        stats={stats}
        onSync={() => showToast('Paraşüt Senkron', 'Nisan 2026 faturaları ve fişleri Paraşüt’ten çekiliyor · KDV hesabı güncelleniyor', 'teal')}
        onBeyanname={() => setModal('beyanname')}
        onPayment={() => {
          setSelectedId(undefined);
          setModal('odeme');
        }}
      />

      <CompanyTabs companyFilter={companyFilter} setCompanyFilter={setCompanyFilter} />
      <KpiGrid stats={stats} scope={scope} />
      <UpcomingPayments
        scope={scope}
        onPay={(id) => {
          setSelectedId(id);
          setModal('odeme');
        }}
      />
      <KdvPanels companyFilter={companyFilter} />
      <TaxTable
        filtered={filtered}
        scope={scope}
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        onPay={(id) => {
          setSelectedId(id);
          setModal('odeme');
        }}
        onExport={() => showToast('Vergi Export', 'PDF rapor oluşturuluyor · tüm beyannameler ekleniyor', 'amber')}
      />
      <BottomPanels scope={scope} onDetail={() => showToast('Paraşüt Detay', 'Tüm faturalar ve fişler ayrıntılı görünüm', 'teal')} />
      <TeknoparkInfo />
    </div>
  );
}

function HeaderActions({ stats, onSync, onBeyanname, onPayment }: { stats: { urgent: number; late: number }; onSync: () => void; onBeyanname: () => void; onPayment: () => void }) {
  return (
    <div className="flex items-center justify-between gap-3 flex-wrap">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 bg-amber-100 dark:bg-amber-500/20 rounded-lg flex items-center justify-center">
          <Svg className="text-amber-600 dark:text-amber-400 w-4 h-4">
            <line x1="19" y1="5" x2="5" y2="19" />
            <circle cx="6.5" cy="6.5" r="2.5" />
            <circle cx="17.5" cy="17.5" r="2.5" />
          </Svg>
        </div>
        <div>
          <h1 className="text-[19px] font-bold text-gray-900 dark:text-gray-100 leading-tight">Vergi / SSK Takibi</h1>
          <p className="text-[11px] text-gray-500 dark:text-gray-400">
            KDV · MUHSGK · Geçici Vergi · Kurumlar · Stopaj · Damga
            {stats.urgent > 0 && <span className="text-rose-600 dark:text-rose-400 font-bold"> · {stats.urgent} ödeme yaklaşıyor</span>}
            {stats.late > 0 && <span className="text-red-600 dark:text-red-400 font-bold"> · {stats.late} gecikmiş</span>}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <button type="button" onClick={onSync} className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-[11px] font-semibold rounded-md hover:bg-gray-50 dark:hover:bg-[#23242c]">
          <Svg className="w-3.5 h-3.5">
            <polyline points="23 4 23 10 17 10" />
            <polyline points="1 20 1 14 7 14" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </Svg>
          Paraşüt Senkron
        </button>
        <button type="button" onClick={onBeyanname} className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-[11px] font-semibold rounded-md hover:bg-gray-50 dark:hover:bg-[#23242c]">
          <Svg className="w-3.5 h-3.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </Svg>
          Beyanname Ekle
        </button>
        <button type="button" onClick={onPayment} className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold rounded-md shadow-sm">
          <Svg className="w-3.5 h-3.5">
            <polyline points="20 6 9 17 4 12" />
          </Svg>
          Ödeme Kaydet
        </button>
      </div>
    </div>
  );
}

function CompanyTabs({ companyFilter, setCompanyFilter }: { companyFilter: CompanyFilter; setCompanyFilter: (value: CompanyFilter) => void }) {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {[
        { key: 'all' as const, label: 'Tüm Şirketler', color: 'gray' as ColorName },
        { key: 'digital' as const, label: 'Arma Digital', color: 'emerald' as ColorName },
        { key: 'bilisim' as const, label: 'Arma Bilişim', color: 'indigo' as ColorName },
      ].map((item) => {
        const active = companyFilter === item.key;
        const cm = CM[item.color];
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => setCompanyFilter(item.key)}
            className={`px-3 py-1.5 text-[11px] font-semibold rounded-md border transition-all ${active ? `${cm.bg} ${cm.t} ${cm.border} border-2` : 'bg-white dark:bg-[#1e1f26] border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#23242c]'}`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

function KpiGrid({ stats, scope }: { stats: { totalBorc: number; totalPaid: number; kdvBorc: number; muhsgkBorc: number; geciciBorc: number; kurumlarBorc: number }; scope: VergiKaydi[] }) {
  const cards = [
    { label: 'Toplam Borç', value: shortMoney(stats.totalBorc, 1), sub: `${scope.filter((item) => item.status === 'pending' || item.status === 'urgent').length} beyan`, clr: 'amber' as ColorName },
    { label: 'KDV Borç', value: shortMoney(stats.kdvBorc, 1), sub: 'Ayın 28’i son ödeme', clr: 'indigo' as ColorName },
    { label: 'MUHSGK Borç', value: shortMoney(stats.muhsgkBorc), sub: 'Ay sonu son iş günü', clr: 'rose' as ColorName },
    { label: 'Geçici Vergi', value: shortMoney(stats.geciciBorc, 1), sub: '17 Mayıs’a kadar', clr: 'amber' as ColorName },
    { label: 'Kurumlar V.', value: shortMoney(stats.kurumlarBorc), sub: '2025 yıllık · 30 Nisan', clr: 'violet' as ColorName },
    { label: 'Bu Yıl Ödenen', value: shortMoney(stats.totalPaid + stats.totalBorc * 0.4), sub: '2026 kümülatif', clr: 'emerald' as ColorName },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3">
      {cards.map((card) => {
        const cm = CM[card.clr];
        return (
          <div key={card.label} className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-3.5">
            <p className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">{card.label}</p>
            <p className={`text-[22px] font-bold ${cm.t} font-mono leading-none mb-0.5`}>{card.value}</p>
            <p className="text-[9px] text-gray-400 dark:text-gray-500">{card.sub}</p>
          </div>
        );
      })}
    </div>
  );
}

function UpcomingPayments({ scope, onPay }: { scope: VergiKaydi[]; onPay: (id: string) => void }) {
  const upcoming = [...scope]
    .filter((item) => item.status === 'pending' || item.status === 'urgent' || item.status === 'late')
    .sort((a, b) => {
      const [da, ma, ya] = a.payDate.split('.').map(Number);
      const [db, mb, yb] = b.payDate.split('.').map(Number);
      return new Date(ya, ma - 1, da).getTime() - new Date(yb, mb - 1, db).getTime();
    })
    .slice(0, 5);

  return (
    <div className="bg-gradient-to-br from-rose-50 via-amber-50/50 to-transparent dark:from-rose-500/10 dark:via-amber-500/5 border-2 border-rose-200 dark:border-rose-500/30 rounded-xl overflow-hidden">
      <div className="p-3 border-b border-rose-200/50 dark:border-rose-500/20 flex items-center gap-2">
        <Svg className="text-rose-600 dark:text-rose-400 w-4 h-4 animate-pulse">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </Svg>
        <h3 className="text-[13px] font-bold text-rose-900 dark:text-rose-200">Yaklaşan Ödemeler · Bu Ay</h3>
        <span className="text-[9px] font-bold px-1.5 py-0.5 bg-rose-200 dark:bg-rose-500/30 text-rose-800 dark:text-rose-200 rounded">NİSAN 2026</span>
      </div>
      <div className="divide-y divide-rose-100 dark:divide-rose-500/20">
        {upcoming.map((item) => {
          const tc = typeConf[item.type];
          const tcm = CM[tc.clr];
          const ccm = CM[companyColor(item.company)];
          const kalan = daysLeft(item.payDate);
          return (
            <div key={item.id} className="p-3 flex items-center justify-between gap-3 hover:bg-white/50 dark:hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className={`w-9 h-9 ${tcm.bg} rounded-lg flex items-center justify-center shrink-0`}>
                  <Svg className={`${tcm.t} w-4 h-4`}>{tc.icon}</Svg>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-[13px] font-bold text-gray-900 dark:text-gray-100">{tc.lbl}</p>
                    <span className={`inline-block min-w-[52px] text-center text-[9px] font-bold px-1.5 py-0.5 ${ccm.bg} ${ccm.t} rounded`}>{companyLabel(item.company)}</span>
                    <span className="text-[10px] text-gray-500 dark:text-gray-400">{item.period}</span>
                  </div>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 truncate">{item.notes}</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className={`text-[16px] font-black font-mono ${item.status === 'urgent' || item.status === 'late' ? 'text-rose-700 dark:text-rose-300' : 'text-gray-900 dark:text-gray-100'}`}>{money(item.amount)}</p>
                <p className={`text-[9px] ${kalan < 0 ? 'text-red-600 font-bold' : kalan <= 5 ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-gray-500 dark:text-gray-400'} font-mono`}>
                  {item.payDate} {kalan < 0 ? `(${Math.abs(kalan)} gün gecikmiş!)` : kalan === 0 ? '(BUGÜN!)' : `(${kalan} gün kaldı)`}
                </p>
              </div>
              <button type="button" onClick={() => onPay(item.id)} className="px-2.5 py-1.5 text-[10px] font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-md shadow-sm shrink-0">Öde</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function KdvPanels({ companyFilter }: { companyFilter: CompanyFilter }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
      {(['digital', 'bilisim'] as Company[]).filter((company) => companyFilter === 'all' || companyFilter === company).map((company) => {
        const data = kdvHesap[company];
        const isDigital = company === 'digital';
        const clr = companyColor(company);
        const cm = CM[clr];
        return (
          <div key={company} className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
            <div className="p-3 border-b border-gray-100 dark:border-gray-700/40 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className={`w-8 h-8 ${cm.bg} rounded-md flex items-center justify-center shrink-0`}>
                  <Svg className={`${cm.t} w-4 h-4`}>
                    {isDigital ? <><path d="M3 3h18v18H3z" /><path d="M3 9h18" /><path d="M9 21V9" /></> : <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M7 8h10M7 12h10M7 16h6" /></>}
                  </Svg>
                </div>
                <div className="min-w-0">
                  <h3 className="text-[12px] font-bold text-gray-900 dark:text-gray-100 truncate">{companyFull(company)}</h3>
                  <p className="text-[9px] text-gray-500 dark:text-gray-400">Nisan 2026 KDV hesabı</p>
                </div>
              </div>
              <span className={`text-[8px] font-bold px-1.5 py-0.5 ${cm.bg} ${cm.t} rounded shrink-0`}>{isDigital ? 'TEKNOPARK' : 'STANDART'}</span>
            </div>
            {data.muaf ? <KdvMuaf data={data} /> : <KdvStandart data={data} />}
          </div>
        );
      })}
    </div>
  );
}

function KdvMuaf({ data }: { data: typeof kdvHesap.digital }) {
  return (
    <div className="p-5 text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 dark:bg-emerald-500/20 rounded-full mb-2">
        <Svg className="text-emerald-600 dark:text-emerald-400 w-6 h-6">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <polyline points="9 12 11 14 15 10" />
        </Svg>
      </div>
      <p className="text-[14px] font-bold text-emerald-700 dark:text-emerald-300 mb-1">KDV Muafiyeti</p>
      <p className="text-[10px] text-gray-600 dark:text-gray-400 mb-3">4691 sayılı Teknopark Kanunu kapsamında teknoloji/yazılım faaliyet gelirleri KDV'den muaf</p>
      <div className="grid grid-cols-2 gap-2 text-[10px] pt-3 border-t border-gray-100 dark:border-gray-700/40">
        <div>
          <p className="text-gray-500 dark:text-gray-400">Satış Faturası</p>
          <p className="font-mono font-bold text-gray-400">KDV Yok</p>
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400">Alış ({data.alisCount} fiş)</p>
          <p className="font-mono font-bold text-amber-600 dark:text-amber-400">{money(data.alisKDV)}</p>
        </div>
      </div>
      <p className="text-[9px] text-gray-500 dark:text-gray-400 mt-2">İndirilecek KDV iade talebi hakkı doğmuş olabilir</p>
    </div>
  );
}

function KdvStandart({ data }: { data: typeof kdvHesap.bilisim }) {
  return (
    <div className="p-3 space-y-2">
      <div className="flex items-center justify-between p-2 bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/30 rounded-md">
        <div>
          <p className="text-[10px] font-semibold text-sky-800 dark:text-sky-200">Satış KDV (hesaplanan)</p>
          <p className="text-[8px] text-gray-500 dark:text-gray-400">{data.satisCount} fatura · Paraşüt</p>
        </div>
        <p className="text-[14px] font-black font-mono text-sky-700 dark:text-sky-300">{money(data.satisKDV)}</p>
      </div>
      <div className="flex items-center justify-center">
        <Svg className="text-gray-400 w-4 h-4">
          <line x1="12" y1="5" x2="12" y2="19" />
          <polyline points="19 12 12 19 5 12" />
        </Svg>
      </div>
      <div className="flex items-center justify-between p-2 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-md">
        <div>
          <p className="text-[10px] font-semibold text-amber-800 dark:text-amber-200">Alış KDV (indirilecek)</p>
          <p className="text-[8px] text-gray-500 dark:text-gray-400">{data.alisCount} gider fişi · Paraşüt</p>
        </div>
        <p className="text-[14px] font-black font-mono text-amber-700 dark:text-amber-300">−{money(data.alisKDV)}</p>
      </div>
      <div className="flex items-center justify-between p-2.5 bg-gradient-to-r from-rose-50 to-rose-100 dark:from-rose-500/10 dark:to-rose-500/20 border-2 border-rose-300 dark:border-rose-500/50 rounded-md">
        <div>
          <p className="text-[10px] font-bold text-rose-900 dark:text-rose-200">Ödenecek Net KDV</p>
          <p className="text-[8px] text-rose-700 dark:text-rose-300">28 Nisan’a kadar</p>
        </div>
        <p className="text-[17px] font-black font-mono text-rose-800 dark:text-rose-200">{money(data.netKDV)}</p>
      </div>
    </div>
  );
}

function TaxTable({ filtered, scope, search, setSearch, statusFilter, setStatusFilter, typeFilter, setTypeFilter, onPay, onExport }: {
  filtered: VergiKaydi[];
  scope: VergiKaydi[];
  search: string;
  setSearch: (value: string) => void;
  statusFilter: TaxStatusFilter;
  setStatusFilter: (value: TaxStatusFilter) => void;
  typeFilter: TaxTypeFilter;
  setTypeFilter: (value: TaxTypeFilter) => void;
  onPay: (id: string) => void;
  onExport: () => void;
}) {
  const tabs = [
    { k: 'all' as const, lbl: 'Tümü', count: scope.length, clr: 'gray' as ColorName },
    { k: 'urgent' as const, lbl: 'Yaklaşıyor', count: scope.filter((item) => item.status === 'urgent').length, clr: 'rose' as ColorName },
    { k: 'pending' as const, lbl: 'Bekleyen', count: scope.filter((item) => item.status === 'pending').length, clr: 'amber' as ColorName },
    { k: 'paid' as const, lbl: 'Ödenen', count: scope.filter((item) => item.status === 'paid').length, clr: 'emerald' as ColorName },
    { k: 'late' as const, lbl: 'Gecikmiş', count: scope.filter((item) => item.status === 'late').length, clr: 'red' as ColorName },
    { k: 'muaf' as const, lbl: 'Muaf', count: scope.filter((item) => item.status === 'muaf').length, clr: 'gray' as ColorName },
  ].filter((tab) => tab.k === 'all' || tab.count > 0);

  return (
    <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
      <div className="p-3 border-b border-gray-100 dark:border-gray-700/40">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1 flex-wrap">
            {tabs.map((tab) => {
              const active = statusFilter === tab.k;
              const cm = CM[tab.clr];
              return (
                <button
                  key={tab.k}
                  type="button"
                  onClick={() => setStatusFilter(tab.k)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-md border transition-all ${active ? `${cm.bg} ${cm.t} ${cm.border} border-2` : 'bg-white dark:bg-[#1e1f26] text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#23242c]'}`}
                >
                  {tab.lbl}
                  <span className={`text-[9px] font-mono ${active ? 'opacity-80' : 'opacity-50'}`}>({tab.count})</span>
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-1">
            <div className="relative">
              <Svg className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </Svg>
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Kayıt ara..." className="pl-7 pr-2 py-1.5 text-[10px] bg-gray-50 dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded text-gray-900 dark:text-gray-100 focus:outline-none focus:border-amber-500 w-36" />
            </div>
            <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value as TaxTypeFilter)} className="px-2 py-1.5 text-[10px] bg-gray-50 dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded text-gray-900 dark:text-gray-100 focus:outline-none focus:border-amber-500">
              <option value="all">Tüm Vergi Türleri</option>
              {Object.entries(typeConf).map(([key, conf]) => (
                <option key={key} value={key}>{conf.lbl}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-[11px]">
          <thead className="bg-gray-50 dark:bg-[#17181f]">
            <tr className="border-b border-gray-200 dark:border-gray-700/30">
              <th className="text-left px-3 py-2 font-semibold text-gray-500 dark:text-gray-400">Vergi Türü</th>
              <th className="text-left px-3 py-2 font-semibold text-gray-500 dark:text-gray-400">Dönem</th>
              <th className="text-center px-3 py-2 font-semibold text-gray-500 dark:text-gray-400 hidden md:table-cell w-20">Şirket</th>
              <th className="text-left px-3 py-2 font-semibold text-gray-500 dark:text-gray-400 hidden lg:table-cell">Beyan</th>
              <th className="text-left px-3 py-2 font-semibold text-gray-500 dark:text-gray-400">Ödeme Tarihi</th>
              <th className="text-right px-3 py-2 font-semibold text-gray-500 dark:text-gray-400">Tutar</th>
              <th className="text-center px-3 py-2 font-semibold text-gray-500 dark:text-gray-400 w-28">Durum</th>
              <th className="text-right px-3 py-2 font-semibold text-gray-500 dark:text-gray-400 w-20"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700/30">
            {filtered.length === 0 ? (
              <tr><td colSpan={8} className="px-3 py-8 text-center text-gray-400 dark:text-gray-500">Filtreye uygun vergi kaydı yok</td></tr>
            ) : filtered.map((item) => <TaxRow key={item.id} item={item} onPay={onPay} />)}
          </tbody>
        </table>
      </div>
      <div className="p-3 bg-gray-50 dark:bg-[#17181f] border-t border-gray-100 dark:border-gray-700/40 flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-400 flex-wrap gap-2">
        <span>{filtered.length} kayıt · Borç: <span className="font-bold text-amber-700 dark:text-amber-300 font-mono">{money(filtered.filter((item) => item.status === 'pending' || item.status === 'urgent').reduce((sum, item) => sum + item.amount, 0))}</span></span>
        <button type="button" onClick={onExport} className="text-[10px] font-semibold text-amber-700 dark:text-amber-300 hover:underline">Rapor İndir (PDF) ↓</button>
      </div>
    </div>
  );
}

function TaxRow({ item, onPay }: { item: VergiKaydi; onPay: (id: string) => void }) {
  const tc = typeConf[item.type];
  const tcm = CM[tc.clr];
  const sc = statusConf[item.status];
  const scm = CM[sc.clr];
  const companyCm = CM[companyColor(item.company)];

  return (
    <tr className={`hover:bg-gray-50 dark:hover:bg-white/5 ${item.status === 'paid' || item.status === 'muaf' ? 'opacity-60' : ''}`}>
      <td className="px-3 py-2.5">
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 ${tcm.bg} rounded flex items-center justify-center shrink-0`}>
            <Svg className={`${tcm.t} w-3.5 h-3.5`}>{tc.icon}</Svg>
          </div>
          <div>
            <p className="font-bold text-gray-900 dark:text-gray-100">{tc.lbl}</p>
            <p className="text-[9px] text-gray-400 dark:text-gray-500">{tc.sub}</p>
          </div>
        </div>
      </td>
      <td className="px-3 py-2.5 text-gray-600 dark:text-gray-400">{item.period}</td>
      <td className="px-3 py-2.5 text-center hidden md:table-cell">
        <span className={`inline-block min-w-[52px] text-center text-[9px] font-bold px-1.5 py-0.5 ${companyCm.bg} ${companyCm.t} rounded`}>{companyLabel(item.company)}</span>
      </td>
      <td className="px-3 py-2.5 hidden lg:table-cell font-mono text-[10px] text-gray-500 dark:text-gray-400">{item.declareDate}</td>
      <td className={`px-3 py-2.5 font-mono text-[10px] ${item.status === 'urgent' || item.status === 'late' ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-gray-600 dark:text-gray-400'}`}>{item.payDate}</td>
      <td className={`px-3 py-2.5 text-right font-mono font-bold ${item.amount === 0 ? 'text-gray-400' : item.status === 'urgent' || item.status === 'late' ? 'text-rose-700 dark:text-rose-300' : 'text-gray-900 dark:text-gray-100'}`}>{money(item.amount)}</td>
      <td className="px-3 py-2.5 text-center">
        <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 ${scm.bg} ${scm.t} rounded`}>
          {sc.dot && <span className={`w-1.5 h-1.5 ${sc.clr === 'red' ? 'bg-red-500' : 'bg-rose-500'} rounded-full animate-pulse`} />}
          {sc.lbl}
        </span>
      </td>
      <td className="px-3 py-2.5 text-right">
        {item.status === 'pending' || item.status === 'urgent' || item.status === 'late' ? (
          <button type="button" onClick={() => onPay(item.id)} className="px-2 py-1 text-[10px] font-bold bg-amber-100 dark:bg-amber-500/20 hover:bg-amber-200 dark:hover:bg-amber-500/30 text-amber-700 dark:text-amber-300 rounded">Öde</button>
        ) : item.status === 'paid' ? (
          <span className="text-emerald-600 dark:text-emerald-400">
            <Svg className="w-3.5 h-3.5 inline">
              <polyline points="20 6 9 17 4 12" />
            </Svg>
          </span>
        ) : (
          <span className="text-gray-300">—</span>
        )}
      </td>
    </tr>
  );
}

function BottomPanels({ scope, onDetail }: { scope: VergiKaydi[]; onDetail: () => void }) {
  const sums = scope.reduce<Record<TaxType, number>>((acc, item) => {
    if (item.amount > 0) acc[item.type] = (acc[item.type] ?? 0) + item.amount;
    return acc;
  }, {} as Record<TaxType, number>);
  const total = Object.values(sums).reduce((sum, amount) => sum + amount, 0) || 1;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
      <div className="lg:col-span-2 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
        <div className="p-3 border-b border-gray-100 dark:border-gray-700/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Svg className="text-teal-600 dark:text-teal-400 w-4 h-4">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </Svg>
            <h3 className="text-[13px] font-bold text-gray-900 dark:text-gray-100">Paraşüt Faturalar / Fişler · Nisan 2026</h3>
          </div>
          <span className="text-[9px] font-bold px-1.5 py-0.5 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded">SENKRON 14:42</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-100 dark:divide-gray-700/30">
          {[
            { lbl: 'Satış Faturası', count: 12, amount: 264000, sub: 'Sadece Bilişim', clr: 'emerald' as ColorName },
            { lbl: 'Alış Faturası', count: 62, amount: 142800, sub: 'Her iki şirket', clr: 'amber' as ColorName },
            { lbl: 'Gider Fişi', count: 28, amount: 18400, sub: 'Ofis · yemek · ulaşım', clr: 'sky' as ColorName },
            { lbl: 'Serbest Meslek', count: 8, amount: 52000, sub: 'Freelance hakedişler', clr: 'violet' as ColorName },
          ].map((item) => {
            const cm = CM[item.clr];
            return (
              <div key={item.lbl} className="p-3">
                <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{item.lbl}</p>
                <p className={`text-[18px] font-black ${cm.t} font-mono`}>{shortMoney(item.amount)}</p>
                <div className="flex items-center justify-between mt-1 text-[9px]">
                  <span className="text-gray-500 dark:text-gray-500">{item.count} kayıt</span>
                  <span className="text-gray-400 dark:text-gray-500">{item.sub}</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="p-3 border-t border-gray-100 dark:border-gray-700/40 flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-400 flex-wrap gap-2">
          <span>Vergi hesabına esas toplam: <span className="font-bold text-gray-900 dark:text-gray-100 font-mono">₺477.200</span> · KDV dahil net: <span className="font-bold font-mono text-amber-700 dark:text-amber-300">₺520.448</span></span>
          <button type="button" onClick={onDetail} className="text-[10px] font-semibold text-teal-700 dark:text-teal-300 hover:underline">Detay →</button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
        <div className="p-3 border-b border-gray-100 dark:border-gray-700/40 flex items-center gap-2">
          <Svg className="text-amber-600 dark:text-amber-400 w-3.5 h-3.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="2" x2="12" y2="22" />
            <line x1="2" y1="12" x2="22" y2="12" />
          </Svg>
          <h3 className="text-[12px] font-bold text-gray-900 dark:text-gray-100">Vergi Türü Dağılımı</h3>
        </div>
        <div className="p-3 space-y-2">
          {Object.entries(sums).sort((a, b) => b[1] - a[1]).map(([type, sum]) => {
            const tc = typeConf[type as TaxType];
            const cm = CM[tc.clr];
            const pct = Math.round((sum / total) * 100);
            return (
              <div key={type}>
                <div className="flex items-center justify-between text-[10px] mb-0.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Svg className={`${cm.t} w-3 h-3 shrink-0`}>{tc.icon}</Svg>
                    <span className="text-gray-700 dark:text-gray-300 font-medium truncate">{tc.lbl}</span>
                  </div>
                  <span className="font-mono text-gray-500 dark:text-gray-400 shrink-0"><span className={`font-bold ${cm.t}`}>{shortMoney(sum)}</span> · {pct}%</span>
                </div>
                <div className="h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className={`h-full ${cm.bar} rounded-full`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function TeknoparkInfo() {
  return (
    <div className="bg-gradient-to-br from-emerald-50/50 via-transparent to-amber-50/50 dark:from-emerald-500/5 dark:to-amber-500/5 border border-emerald-200/50 dark:border-emerald-500/20 rounded-xl p-3 flex items-start gap-2.5">
      <Svg className="text-emerald-600 dark:text-emerald-400 w-4 h-4 shrink-0 mt-0.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </Svg>
      <div className="flex-1">
        <p className="text-[11px] text-gray-700 dark:text-gray-300">
          <span className="font-bold text-emerald-700 dark:text-emerald-300">Teknopark Muafiyetleri (Arma Digital):</span>
          <span className="text-emerald-700 dark:text-emerald-300 font-semibold"> KDV %0</span> yazılım satışı ·
          <span className="text-emerald-700 dark:text-emerald-300 font-semibold"> Kurumlar Vergisi muaf</span> (4691 sayılı kanun) ·
          <span className="text-emerald-700 dark:text-emerald-300 font-semibold"> SSK işveren payında teşvik</span> ·
          personel gelir vergisi stopajında muafiyet ·
          <span className="text-amber-700 dark:text-amber-300 font-semibold"> MUHSGK ve Damga Vergisi</span> ödenir.
          Arma Bilişim → tüm standart vergiler geçerli.
        </p>
      </div>
    </div>
  );
}
