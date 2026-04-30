import { type ReactNode, useMemo, useState } from 'react';

type ColorName = 'emerald' | 'amber' | 'rose' | 'sky' | 'violet' | 'indigo' | 'teal' | 'gray' | 'pink';
type Company = 'digital' | 'bilisim';
type Category = 'yazilim' | 'reklam' | 'hosting' | 'ofis' | 'yemek' | 'ulasim' | 'egitim' | 'diger';
type CategoryFilter = Category | 'all';

type CreditCard = {
  id: string;
  name: string;
  bank: string;
  last4: string;
  company: Company;
  holder: string;
  limit: number;
  used: number;
  statement: number;
  cutDay: number;
  payDay: number;
  expiry: string;
  gradient: string;
  monthSpend: number;
  lastTx: string;
};

type Transaction = {
  date: string;
  merchant: string;
  amount: number;
  card: string;
  category: Category;
  aiConfidence: number;
  company: Company;
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

const kartlar: CreditCard[] = [
  { id: 'KK-001', name: 'Garanti Bonus Business', bank: 'Garanti Bankası', last4: '4242', company: 'digital', holder: 'Osman Atasoy', limit: 150000, used: 82340, statement: 64200, cutDay: 15, payDay: 25, expiry: '12/28', gradient: 'from-emerald-600 via-teal-600 to-cyan-700', monthSpend: 28400, lastTx: 'Bugün 14:42' },
  { id: 'KK-002', name: 'Enpara Kurumsal', bank: 'Enpara (QNB)', last4: '8842', company: 'digital', holder: 'Arma Digital A.Ş.', limit: 100000, used: 45200, statement: 38100, cutDay: 1, payDay: 11, expiry: '08/27', gradient: 'from-violet-600 via-purple-600 to-fuchsia-700', monthSpend: 12800, lastTx: 'Dün 16:20' },
  { id: 'KK-003', name: 'İş Bankası Maximum Business', bank: 'Türkiye İş Bankası', last4: '9451', company: 'bilisim', holder: 'Arma Bilişim Ltd.', limit: 80000, used: 56720, statement: 42300, cutDay: 20, payDay: 1, expiry: '05/28', gradient: 'from-amber-600 via-orange-600 to-red-700', monthSpend: 18600, lastTx: '2 gün önce' },
  { id: 'KK-004', name: 'Akbank Axess', bank: 'Akbank', last4: '1289', company: 'bilisim', holder: 'Osman Atasoy', limit: 50000, used: 18240, statement: 22100, cutDay: 10, payDay: 20, expiry: '03/29', gradient: 'from-rose-600 via-pink-600 to-purple-700', monthSpend: 7900, lastTx: '3 gün önce' },
];

const harcamalar: Transaction[] = [
  { date: '23.04.2026 14:42', merchant: 'Figma Inc.', amount: 180, card: 'KK-001', category: 'yazilim', aiConfidence: 98, company: 'digital' },
  { date: '23.04.2026 11:15', merchant: 'Meta Ads · Bosch Kampanya', amount: 8500, card: 'KK-001', category: 'reklam', aiConfidence: 99, company: 'digital' },
  { date: '23.04.2026 10:22', merchant: 'Google Workspace', amount: 620, card: 'KK-002', category: 'yazilim', aiConfidence: 97, company: 'digital' },
  { date: '22.04.2026 19:40', merchant: 'Getir · Ofis siparişi', amount: 340, card: 'KK-003', category: 'ofis', aiConfidence: 85, company: 'bilisim' },
  { date: '22.04.2026 16:20', merchant: 'Cloudflare Pro', amount: 240, card: 'KK-002', category: 'hosting', aiConfidence: 99, company: 'digital' },
  { date: '22.04.2026 14:05', merchant: 'Google Ads · MegaMarka', amount: 4800, card: 'KK-003', category: 'reklam', aiConfidence: 99, company: 'bilisim' },
  { date: '22.04.2026 12:30', merchant: 'Yemek Sepeti İşyeri', amount: 420, card: 'KK-001', category: 'yemek', aiConfidence: 92, company: 'digital' },
  { date: '21.04.2026 16:45', merchant: 'Metunic Domain Yenileme', amount: 1240, card: 'KK-002', category: 'hosting', aiConfidence: 98, company: 'digital' },
  { date: '21.04.2026 11:28', merchant: 'Notion Team', amount: 320, card: 'KK-001', category: 'yazilim', aiConfidence: 99, company: 'digital' },
  { date: '20.04.2026 18:15', merchant: 'Uber Business', amount: 180, card: 'KK-004', category: 'ulasim', aiConfidence: 95, company: 'bilisim' },
  { date: '20.04.2026 15:40', merchant: 'Canva Pro', amount: 420, card: 'KK-004', category: 'yazilim', aiConfidence: 99, company: 'bilisim' },
  { date: '20.04.2026 13:22', merchant: 'Bel Muzik Eğitim', amount: 2400, card: 'KK-003', category: 'egitim', aiConfidence: 89, company: 'bilisim' },
];

const catConf: Record<Category, { lbl: string; clr: ColorName; icon: ReactNode }> = {
  yazilim: { lbl: 'Yazılım / SaaS', clr: 'violet', icon: <><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></> },
  reklam: { lbl: 'Reklam / Ads', clr: 'sky', icon: <><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /></> },
  hosting: { lbl: 'Hosting / Domain', clr: 'teal', icon: <><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></> },
  ofis: { lbl: 'Ofis / Kırtasiye', clr: 'amber', icon: <><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="9" y1="9" x2="15" y2="9" /><line x1="9" y1="15" x2="15" y2="15" /></> },
  yemek: { lbl: 'Yemek / İkram', clr: 'rose', icon: <><path d="M12 2l1.09 2.9L16 6l-2.9 1.09L12 10l-1.09-2.9L8 6l2.9-1.09z" /><path d="M22 22s-6-2-10-2-10 2-10 2l3-10c0-1 3-6 7-6s7 5 7 6z" /></> },
  ulasim: { lbl: 'Ulaşım', clr: 'indigo', icon: <><path d="M5 17h14M5 17a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2M5 17v2h14v-2M7 11h10" /></> },
  egitim: { lbl: 'Eğitim / Kurs', clr: 'pink', icon: <><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></> },
  diger: { lbl: 'Diğer', clr: 'gray', icon: <><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12.01" y2="8" /><path d="M11 12h1v4h1" /></> },
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

function compactMoney(value: number, digit = 0) {
  return `₺${(value / 1000).toFixed(digit)}K`;
}

function ContentToast({ title, message, color = 'indigo', onClose }: { title: string; message: string; color?: ColorName; onClose: () => void }) {
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

function AddCardModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  return (
    <div className="absolute inset-0 z-30 flex items-start justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="modal-scroll bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-xl w-full max-w-[640px] max-h-[82vh] overflow-y-auto pointer-events-auto">
        <ModalHeader title="Yeni Kredi Kartı Ekle" subtitle="Kart bilgileri · Paraşüt hesap eşleştirme · güvenli saklama" color="indigo" onClose={onClose}>
          <Svg className="text-indigo-600 dark:text-indigo-400 w-4 h-4"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="11" x2="22" y2="11" /></Svg>
        </ModalHeader>
        <div className="p-5 space-y-4">
          <CompanyPicker name="kartCompany" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Banka *</label>
              <select className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:border-indigo-500">
                <option>Banka seçin...</option>
                <option>Garanti Bankası</option>
                <option>Enpara (QNB)</option>
                <option>Türkiye İş Bankası</option>
                <option>Akbank</option>
                <option>Yapı Kredi</option>
                <option>TEB</option>
                <option>Ziraat Bankası</option>
                <option>Halkbank</option>
                <option>Denizbank</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Kart Tipi</label>
              <select className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:border-indigo-500">
                <option>Business / Kurumsal</option>
                <option>Platinum</option>
                <option>Gold</option>
                <option>Classic</option>
                <option>World</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Kart Adı (kullanıcı takma adı) *</label>
              <input type="text" placeholder="Örn: Garanti Bonus Business" className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Son 4 Hane *</label>
              <input type="text" maxLength={4} placeholder="4242" className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono text-center focus:outline-none focus:border-indigo-500" />
            </div>
          </div>

          <div className="p-2.5 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 rounded-md flex items-start gap-2">
            <Svg className="text-rose-600 dark:text-rose-400 w-3.5 h-3.5 shrink-0 mt-0.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></Svg>
            <p className="text-[10px] text-rose-800 dark:text-rose-200"><span className="font-bold">Güvenlik:</span> Sadece son 4 hane saklanır · tam kart numarası asla sistemde tutulmaz · ekstre için Paraşüt API üzerinden erişilir</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Kart Limiti *</label><input type="text" placeholder="150.000" className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono text-right focus:outline-none focus:border-indigo-500" /></div>
            <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Hesap Sahibi</label><input type="text" placeholder="Ad Soyad / Firma Ünvanı" className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:border-indigo-500" /></div>
            <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Son Kullanma</label><input type="text" placeholder="MM/YY" maxLength={5} className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono text-center focus:outline-none focus:border-indigo-500" /></div>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wider">Ekstre Takvimi</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[9px] text-gray-500 dark:text-gray-500 mb-1">Ekstre Kesim Günü</label>
                <select className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono focus:outline-none focus:border-indigo-500">
                  {Array.from({ length: 28 }, (_, index) => <option key={index}>Ayın {index + 1}'i</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[9px] text-gray-500 dark:text-gray-500 mb-1">Son Ödeme Günü</label>
                <select className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono focus:outline-none focus:border-indigo-500">
                  {Array.from({ length: 28 }, (_, index) => <option key={index}>Ayın {index + 1}'i</option>)}
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Paraşüt Banka Hesabı Eşle</label>
            <select className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:border-indigo-500">
              <option>Yeni kredi kartı hesabı oluştur (önerilen)</option>
              <option>Garanti - Ana Hesap · TR••••0062 1234</option>
              <option>Enpara - Ana Hesap · TR••••0111 8842</option>
              <option>TEB - Ana Hesap · TR••••0032 9451</option>
            </select>
            <p className="text-[9px] text-gray-500 dark:text-gray-400 mt-1">Kart harcamaları bu hesaba gider olarak kaydedilecek</p>
          </div>

          <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30 rounded-md flex items-start gap-2">
            <Svg className="text-indigo-600 dark:text-indigo-400 w-4 h-4 shrink-0 mt-0.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></Svg>
            <div className="text-[10px]">
              <p className="font-bold text-indigo-900 dark:text-indigo-200">Kayıttan sonra</p>
              <p className="text-indigo-700 dark:text-indigo-300 mt-0.5">Paraşüt’te kart hesabı oluşturulur · ekstre yükleyebilir · harcamalar AI ile otomatik kategorize edilir · son ödeme tarihi hatırlatmaları aktif olur</p>
            </div>
          </div>
        </div>
        <ModalFooter onClose={onClose}>
          <button type="button" onClick={onSaved} className="flex items-center gap-1.5 px-4 py-2 text-[11px] font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-md">
            <Svg className="w-3 h-3"><polyline points="20 6 9 17 4 12" /></Svg>
            Kartı Kaydet
          </button>
        </ModalFooter>
      </div>
    </div>
  );
}

function UploadStatementModal({ onClose, onUpload, onFileToast }: { onClose: () => void; onUpload: () => void; onFileToast: (fileName: string) => void }) {
  const [fileName, setFileName] = useState('');

  return (
    <div className="absolute inset-0 z-30 flex items-start justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="modal-scroll bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-xl w-full max-w-[620px] max-h-[82vh] overflow-y-auto pointer-events-auto">
        <ModalHeader title="Kredi Kartı Ekstresi Yükle" subtitle="PDF / Excel · AI otomatik kategorize eder" color="violet" onClose={onClose}>
          <Svg className="text-violet-600 dark:text-violet-400 w-4 h-4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></Svg>
        </ModalHeader>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Hangi Kart İçin? *</label>
            <select className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:border-violet-500">
              <option>Kart seçin...</option>
              {kartlar.map((card) => <option key={card.id}>{card.name} · ••{card.last4} · {card.company === 'digital' ? 'Digital' : 'Bilişim'}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wider">Ekstre Dosyası *</label>
            <label htmlFor="ekstreFile" className="block cursor-pointer">
              <input
                type="file"
                id="ekstreFile"
                accept=".pdf,.xls,.xlsx,.csv"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    setFileName(`${file.name} · ${(file.size / 1024).toFixed(0)} KB`);
                    onFileToast(file.name);
                  }
                }}
              />
              <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-violet-500 hover:bg-violet-50/30 dark:hover:bg-violet-500/5 rounded-lg p-5 text-center transition-all">
                <Svg className="text-gray-400 w-8 h-8 mx-auto mb-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></Svg>
                <p className="text-[12px] font-semibold text-gray-700 dark:text-gray-300">Ekstre dosyasını seçin <span className="text-gray-400">veya sürükleyin</span></p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">PDF · Excel (.xls/.xlsx) · CSV · max 20 MB</p>
                {fileName ? (
                  <div id="ekstreFileInfo" className="mt-3 p-2 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-md flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <Svg className="text-emerald-600 dark:text-emerald-400 w-4 h-4 shrink-0"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></Svg>
                      <span id="ekstreFileName" className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-200 truncate">{fileName}</span>
                    </div>
                  </div>
                ) : null}
              </div>
            </label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Dönem Başlangıç</label><input type="date" defaultValue="2026-03-15" className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono focus:outline-none focus:border-violet-500" /></div>
            <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Dönem Bitiş</label><input type="date" defaultValue="2026-04-14" className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono focus:outline-none focus:border-violet-500" /></div>
          </div>
          <div className="p-3 bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Svg className="text-violet-600 dark:text-violet-400 w-4 h-4"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /></Svg>
              <p className="text-[11px] font-bold text-violet-900 dark:text-violet-200">AI Sınıflandırma Ayarları</p>
              <span className="text-[9px] font-bold px-1.5 py-0.5 bg-violet-200 dark:bg-violet-500/30 text-violet-800 dark:text-violet-200 rounded">GPT-4</span>
            </div>
            <div className="space-y-1.5">
              {['İşyerlerini otomatik kategorize et', 'Mükerrer (tekrarlayan) işlemleri tespit et', 'Paraşüt’e otomatik gider kaydı aç', 'Düşük güvenli işlemleri manuel onay beklet'].map((text, index) => (
                <label key={text} className="flex items-center gap-2 cursor-pointer text-[11px] text-violet-900 dark:text-violet-200">
                  <input type="checkbox" defaultChecked={index < 3} className="rounded border-violet-300 text-violet-600 focus:ring-violet-500" />
                  <span>{text}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="p-2.5 bg-gray-50 dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md flex items-start gap-2">
            <Svg className="text-gray-500 dark:text-gray-400 w-3.5 h-3.5 shrink-0 mt-0.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></Svg>
            <p className="text-[10px] text-gray-600 dark:text-gray-400"><span className="font-bold">Tahmini süre:</span> 50-150 işlem için ~45 saniye · AI işyerini tanıyor, kategorize ediyor, şirket ayrımını yapıyor · KDV dahil tutarlar otomatik hesaplanır</p>
          </div>
        </div>
        <ModalFooter onClose={onClose}>
          <button type="button" onClick={onUpload} className="flex items-center gap-1.5 px-4 py-2 text-[11px] font-bold bg-violet-600 hover:bg-violet-700 text-white rounded-md">
            <Svg className="w-3 h-3"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" /></Svg>
            Yükle ve AI Sınıflandır
          </button>
        </ModalFooter>
      </div>
    </div>
  );
}

function ModalHeader({ title, subtitle, color, onClose, children }: { title: string; subtitle: string; color: ColorName; onClose: () => void; children: ReactNode }) {
  return (
    <div className="sticky top-0 z-10 bg-white dark:bg-[#1e1f26] border-b border-gray-100 dark:border-gray-700/60 p-5 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <div className={`w-10 h-10 bg-${color}-100 dark:bg-${color}-500/20 rounded-lg flex items-center justify-center`}>{children}</div>
        <div>
          <h2 className="text-[15px] font-bold text-gray-900 dark:text-gray-100">{title}</h2>
          <p className="text-[11px] text-gray-500 dark:text-gray-400">{subtitle}</p>
        </div>
      </div>
      <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1">
        <Svg className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Svg>
      </button>
    </div>
  );
}

function ModalFooter({ onClose, children }: { onClose: () => void; children: ReactNode }) {
  return (
    <div className="sticky bottom-0 bg-white dark:bg-[#1e1f26] border-t border-gray-100 dark:border-gray-700/60 p-4 flex items-center justify-end gap-2">
      <button type="button" onClick={onClose} className="px-3 py-2 text-[11px] font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">İptal</button>
      {children}
    </div>
  );
}

function CompanyPicker({ name }: { name: string }) {
  return (
    <div>
      <label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wider">Kart Hangi Şirkete Ait? *</label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <label className="cursor-pointer">
          <input type="radio" name={name} value="digital" className="sr-only peer" defaultChecked />
          <div className="h-full p-3 bg-white dark:bg-[#17181f] border-2 border-gray-200 dark:border-gray-700 peer-checked:border-emerald-500 peer-checked:bg-emerald-50 dark:peer-checked:bg-emerald-500/10 rounded-lg transition-all">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-500/20 rounded-md flex items-center justify-center shrink-0">
                <Svg className="text-emerald-600 dark:text-emerald-400 w-4 h-4"><path d="M3 3h18v18H3z" /><path d="M3 9h18" /><path d="M9 21V9" /></Svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100 leading-tight">Arma Digital Medya A.Ş.</p>
                <span className="inline-block mt-1 min-w-[90px] text-center text-[8px] font-bold px-1.5 py-0.5 bg-emerald-200 dark:bg-emerald-500/30 text-emerald-800 dark:text-emerald-200 rounded">TEKNOPARK</span>
              </div>
            </div>
          </div>
        </label>
        <label className="cursor-pointer">
          <input type="radio" name={name} value="bilisim" className="sr-only peer" />
          <div className="h-full p-3 bg-white dark:bg-[#17181f] border-2 border-gray-200 dark:border-gray-700 peer-checked:border-indigo-500 peer-checked:bg-indigo-50 dark:peer-checked:bg-indigo-500/10 rounded-lg transition-all">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-500/20 rounded-md flex items-center justify-center shrink-0">
                <Svg className="text-indigo-600 dark:text-indigo-400 w-4 h-4"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M7 8h10M7 12h10M7 16h6" /></Svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100 leading-tight">Arma Bilişim Ltd. Şti.</p>
                <span className="inline-block mt-1 min-w-[90px] text-center text-[8px] font-bold px-1.5 py-0.5 bg-indigo-200 dark:bg-indigo-500/30 text-indigo-800 dark:text-indigo-200 rounded">STANDART KDV</span>
              </div>
            </div>
          </div>
        </label>
      </div>
    </div>
  );
}

export default function KrediKartlari() {
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [search, setSearch] = useState('');
  const [bank, setBank] = useState('all');
  const [status, setStatus] = useState<'all' | 'high' | 'normal'>('all');
  const [modal, setModal] = useState<'card' | 'statement' | null>(null);
  const [toast, setToast] = useState<{ title: string; message: string; color?: ColorName } | null>(null);

  const showToast = (title: string, message: string, color: ColorName = 'indigo') => setToast({ title, message, color });

  const visibleCards = useMemo(() => {
    const term = search.trim().toLocaleLowerCase('tr-TR');
    return kartlar.filter((card) => {
      const pct = card.used / card.limit;
      return (!term || card.name.toLocaleLowerCase('tr-TR').includes(term) || card.bank.toLocaleLowerCase('tr-TR').includes(term) || card.holder.toLocaleLowerCase('tr-TR').includes(term) || card.last4.includes(term)) && (bank === 'all' || card.bank === bank) && (status === 'all' || (status === 'high' ? pct > 0.7 : pct <= 0.7));
    });
  }, [bank, search, status]);

  const visibleCardIds = useMemo(() => new Set(visibleCards.map((card) => card.id)), [visibleCards]);
  const filteredTx = useMemo(() => harcamalar.filter((tx) => visibleCardIds.has(tx.card) && (category === 'all' || tx.category === category)), [category, visibleCardIds]);

  const totalLimit = visibleCards.reduce((a, k) => a + k.limit, 0);
  const totalUsed = visibleCards.reduce((a, k) => a + k.used, 0);
  const totalAvail = totalLimit - totalUsed;
  const monthSpend = visibleCards.reduce((a, k) => a + k.monthSpend, 0);
  const statementSum = visibleCards.reduce((a, k) => a + k.statement, 0);

  const categorySums = useMemo(() => {
    const sums = harcamalar.reduce<Partial<Record<Category, number>>>((acc, tx) => {
      acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
      return acc;
    }, {});
    return (Object.entries(sums) as Array<[Category, number]>).sort((a, b) => b[1] - a[1]);
  }, []);

  const kpis: Array<{ label: string; value: string; sub: string; clr: ColorName }> = [
    { label: 'Toplam Limit', value: compactMoney(totalLimit), sub: `${visibleCards.length} kart toplamı`, clr: 'indigo' },
    { label: 'Kullanılan', value: compactMoney(totalUsed), sub: `%${totalLimit ? Math.round((totalUsed / totalLimit) * 100) : 0} doluluk`, clr: totalLimit && totalUsed / totalLimit > 0.7 ? 'rose' : 'amber' },
    { label: 'Kalan Limit', value: compactMoney(totalAvail), sub: 'Kullanılabilir', clr: 'emerald' },
    { label: 'Bu Ay Harcama', value: compactMoney(monthSpend), sub: 'Nisan 2026', clr: 'sky' },
    { label: 'Ekstre Toplam', value: compactMoney(statementSum), sub: 'Ödenmesi beklenen', clr: 'amber' },
    { label: 'AI Sınıflandırma', value: '%96', sub: `${filteredTx.length} işlem sınıflandırıldı`, clr: 'violet' },
  ];

  const banks = Array.from(new Set(kartlar.map((card) => card.bank)));

  return (
    <div className="relative space-y-5 md:space-y-6">
      {toast ? <ContentToast {...toast} onClose={() => setToast(null)} /> : null}
      {modal === 'card' ? <AddCardModal onClose={() => setModal(null)} onSaved={() => { setModal(null); showToast('Kart Eklendi', 'Kredi kartı sisteme eklendi · Paraşüt hesabı oluşturuldu · ekstre yükleyebilirsiniz', 'indigo'); }} /> : null}
      {modal === 'statement' ? <UploadStatementModal onClose={() => setModal(null)} onFileToast={(fileName) => showToast('Dosya Seçildi', `${fileName} ekstre analizine hazır`, 'violet')} onUpload={() => { setModal(null); showToast('Ekstre İşleniyor', 'Dosya yüklendi · AI analiz başladı · tamamlandığında bildirim alırsınız', 'violet'); }} /> : null}

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg flex items-center justify-center">
            <Svg className="text-indigo-600 dark:text-indigo-400 w-4 h-4"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="11" x2="22" y2="11" /></Svg>
          </div>
          <div>
            <h1 className="text-[19px] font-bold text-gray-900 dark:text-gray-100 leading-tight">Kredi Kartları</h1>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">{visibleCards.length} aktif kart · AI destekli ekstre sınıflandırma · Paraşüt banka entegrasyonu</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button type="button" onClick={() => setModal('statement')} className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-[11px] font-semibold rounded-md hover:bg-gray-50 dark:hover:bg-[#23242c]">
            <Svg className="w-3.5 h-3.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></Svg>
            Ekstre Yükle
          </button>
          <button type="button" onClick={() => setModal('card')} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold rounded-md shadow-sm">
            <Svg className="w-3.5 h-3.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></Svg>
            Kart Ekle
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

      <div>
        <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
          <h3 className="text-[13px] font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Svg className="text-indigo-600 dark:text-indigo-400 w-4 h-4"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="11" x2="22" y2="11" /></Svg>
            Aktif Kartlar
          </h3>
          <div className="flex items-center gap-1 flex-wrap">
            <div className="relative">
              <Svg className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 w-3 h-3"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></Svg>
              <input type="text" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Kart, banka, son 4..." className="pl-7 pr-2 py-1.5 text-[10px] bg-gray-50 dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded text-gray-900 dark:text-gray-100 focus:outline-none focus:border-indigo-500 w-40" />
            </div>
            <select value={bank} onChange={(event) => setBank(event.target.value)} className="px-2 py-1.5 text-[10px] bg-gray-50 dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded text-gray-900 dark:text-gray-100 focus:outline-none focus:border-indigo-500">
              <option value="all">Tüm bankalar</option>
              {banks.map((bankName) => <option key={bankName} value={bankName}>{bankName}</option>)}
            </select>
            <select value={status} onChange={(event) => setStatus(event.target.value as 'all' | 'high' | 'normal')} className="px-2 py-1.5 text-[10px] bg-gray-50 dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded text-gray-900 dark:text-gray-100 focus:outline-none focus:border-indigo-500">
              <option value="all">Tüm durumlar</option>
              <option value="high">Yüksek kullanım</option>
              <option value="normal">Normal kullanım</option>
            </select>
            <span className="text-[10px] text-gray-500 dark:text-gray-400">{visibleCards.length} kart · tıklayın detay için</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {visibleCards.map((card) => <CreditCardVisual key={card.id} card={card} onClick={() => showToast(`Kart Detay ${card.id}`, 'Son 30 gün harcamalar · ekstre geçmişi · taksit planları · kart limit değişikliği', 'indigo')} />)}
          <div onClick={() => setModal('card')} className="aspect-[1.6/1] border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50/30 dark:hover:bg-indigo-500/5 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all group">
            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/20 rounded-full flex items-center justify-center mb-2 transition-colors">
              <Svg className="text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 w-5 h-5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></Svg>
            </div>
            <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">Yeni Kart Ekle</p>
            <p className="text-[9px] text-gray-400 mt-0.5">Banka + kart bilgileri</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
          <div className="p-3 border-b border-gray-100 dark:border-gray-700/40">
            <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
              <div className="flex items-center gap-2">
                <Svg className="text-violet-600 dark:text-violet-400 w-4 h-4"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></Svg>
                <h3 className="text-[13px] font-bold text-gray-900 dark:text-gray-100">Son Harcamalar</h3>
                <span className="text-[9px] font-bold px-1.5 py-0.5 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded">AI SINIFLANDIRILDI</span>
              </div>
              <span className="text-[9px] font-mono text-gray-500">Son 7 gün · {filteredTx.length} işlem</span>
            </div>
            <div className="flex items-center gap-1 flex-wrap">
              {(['all', ...Object.keys(catConf)] as CategoryFilter[]).map((cat) => {
                const count = cat === 'all' ? harcamalar.length : harcamalar.filter((tx) => tx.category === cat).length;
                if (count === 0 && cat !== 'all') return null;
                const active = category === cat;
                const clr = cat === 'all' ? 'gray' : catConf[cat].clr;
                const lbl = cat === 'all' ? 'Tümü' : catConf[cat].lbl;
                const activeClass = clr === 'gray' ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 border-gray-900' : `bg-${clr}-100 dark:bg-${clr}-500/15 border-2 border-${clr}-500 text-${clr}-700 dark:text-${clr}-300`;
                const inactiveClass = clr === 'gray' ? 'bg-white dark:bg-[#1e1f26] text-gray-600 border-gray-200 hover:bg-gray-50' : `bg-${clr}-50/40 dark:bg-${clr}-500/5 border-${clr}-200/60 dark:border-${clr}-500/20 text-${clr}-600/80 dark:text-${clr}-400/70 hover:bg-${clr}-50`;
                return (
                  <button key={cat} type="button" onClick={() => setCategory(cat)} className={`flex items-center gap-1 px-2 py-1 text-[10px] font-semibold rounded border ${active ? activeClass : inactiveClass}`}>
                    {lbl}
                    <span className={`${active ? 'opacity-80' : 'opacity-50'} font-mono`}>({count})</span>
                  </button>
                );
              })}
            </div>
          </div>
          <TransactionsTable rows={filteredTx} />
          <div className="p-3 bg-gray-50 dark:bg-[#17181f] border-t border-gray-100 dark:border-gray-700/40 flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-400 flex-wrap gap-2">
            <span>{filteredTx.length} işlem · Toplam: <span className="font-bold text-gray-900 dark:text-gray-100 font-mono">{money(filteredTx.reduce((a, tx) => a + tx.amount, 0))}</span></span>
            <button type="button" onClick={() => showToast('CSV Export', 'Filtrelenmiş harcama listesi indiriliyor', 'indigo')} className="text-[10px] font-semibold text-indigo-700 dark:text-indigo-300 hover:underline">Tümünü İndir ↓</button>
          </div>
        </div>

        <div className="space-y-3">
          <CategoryDistribution rows={categorySums} />
          <UpcomingPayments cards={visibleCards} />
        </div>
      </div>

      <div className="bg-gradient-to-br from-indigo-50/50 via-transparent to-violet-50/50 dark:from-indigo-500/5 dark:to-violet-500/5 border border-indigo-200/50 dark:border-indigo-500/20 rounded-xl p-3 flex items-start gap-2.5">
        <Svg className="text-indigo-600 dark:text-indigo-400 w-4 h-4 shrink-0 mt-0.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></Svg>
        <div className="flex-1">
          <p className="text-[11px] text-gray-700 dark:text-gray-300">
            <span className="font-bold text-indigo-700 dark:text-indigo-300">AI Ekstre Sınıflandırma:</span> Ekstre yükleyin · GPT-4 işyerini tanır, otomatik kategorize eder (Yazılım · Reklam · Hosting · Ofis vb.) · düşük güven skorlu işlemleri Tülay Hanım manuel onaylar · Paraşüt’e gider kaydı otomatik açılır · şirket ayrımı KDV hesabı için kritik.
          </p>
        </div>
      </div>
    </div>
  );
}

function CreditCardVisual({ card, onClick }: { card: CreditCard; onClick: () => void }) {
  const pct = Math.round((card.used / card.limit) * 100);
  const barClr = pct > 80 ? 'bg-rose-400' : pct > 60 ? 'bg-amber-400' : 'bg-emerald-400';
  const companyLbl = card.company === 'digital' ? 'Digital' : 'Bilişim';
  const daysToPay = card.payDay > 23 ? card.payDay - 23 : 30 - 23 + card.payDay;

  return (
    <div onClick={onClick} className="relative cursor-pointer group">
      <div className={`relative aspect-[1.6/1] bg-gradient-to-br ${card.gradient} rounded-xl p-4 text-white overflow-hidden shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all`}>
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-black/10 rounded-full blur-2xl"></div>
        <div className="relative flex items-start justify-between mb-2">
          <div className="min-w-0">
            <p className="text-[9px] font-semibold uppercase tracking-wider opacity-80 truncate">{card.bank}</p>
            <p className="text-[11px] font-bold truncate">{card.name}</p>
          </div>
          <span className="text-[8px] font-bold px-1.5 py-0.5 bg-white/20 backdrop-blur-sm rounded shrink-0">{companyLbl}</span>
        </div>
        <div className="relative my-3">
          <p className="text-[13px] font-mono tracking-widest opacity-90">•••• •••• •••• <span className="font-bold">{card.last4}</span></p>
        </div>
        <div className="relative">
          <div className="flex items-center justify-between text-[9px] mb-1">
            <span className="opacity-80 font-mono">{compactMoney(card.used)} / {compactMoney(card.limit)}</span>
            <span className="font-bold font-mono">%{pct}</span>
          </div>
          <div className="h-1 bg-white/20 rounded-full overflow-hidden">
            <div className={`h-full ${barClr} rounded-full`} style={{ width: `${pct}%` }}></div>
          </div>
          <div className="flex items-center justify-between text-[8px] mt-2 opacity-80">
            <span>{card.holder}</span>
            <span className="font-mono">{card.expiry}</span>
          </div>
        </div>
      </div>
      <div className="mt-2 px-1 flex items-center justify-between text-[9px]">
        <span className="text-gray-500 dark:text-gray-400">Son ödeme: <span className="font-bold text-gray-900 dark:text-gray-100">{card.payDay}.{daysToPay < 5 ? ` · ${daysToPay} gün` : ''}</span></span>
        <span className={`font-mono font-bold ${pct > 80 ? 'text-rose-600 dark:text-rose-400' : 'text-gray-600 dark:text-gray-400'}`}>{compactMoney(card.statement)}</span>
      </div>
    </div>
  );
}

function TransactionsTable({ rows }: { rows: Transaction[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[11px]">
        <thead className="bg-gray-50 dark:bg-[#17181f]">
          <tr className="border-b border-gray-200 dark:border-gray-700/30">
            <th className="text-left px-3 py-2 font-semibold text-gray-500 dark:text-gray-400">Tarih</th>
            <th className="text-left px-3 py-2 font-semibold text-gray-500 dark:text-gray-400">İşyeri</th>
            <th className="text-left px-3 py-2 font-semibold text-gray-500 dark:text-gray-400">Kategori</th>
            <th className="text-left px-3 py-2 font-semibold text-gray-500 dark:text-gray-400 hidden md:table-cell">Kart</th>
            <th className="text-right px-3 py-2 font-semibold text-gray-500 dark:text-gray-400">Tutar</th>
            <th className="text-center px-3 py-2 font-semibold text-gray-500 dark:text-gray-400 hidden lg:table-cell w-16">AI</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700/30">
          {rows.length === 0 ? (
            <tr><td colSpan={6} className="px-3 py-8 text-center text-gray-400 dark:text-gray-500">Bu kategori için harcama yok</td></tr>
          ) : rows.map((tx) => {
            const cat = catConf[tx.category];
            const cm = CM[cat.clr];
            const card = kartlar.find((item) => item.id === tx.card);
            return (
              <tr key={`${tx.date}-${tx.merchant}`} className="hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer">
                <td className="px-3 py-2.5 font-mono text-[10px] text-gray-500 dark:text-gray-500">{tx.date}</td>
                <td className="px-3 py-2.5 text-gray-700 dark:text-gray-300 font-medium">{tx.merchant}</td>
                <td className="px-3 py-2.5">
                  <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 ${cm.bg} ${cm.t} rounded`}>
                    <Svg className="w-2.5 h-2.5">{cat.icon}</Svg>
                    {cat.lbl}
                  </span>
                </td>
                <td className="px-3 py-2.5 hidden md:table-cell text-[10px] font-mono text-gray-500 dark:text-gray-500">{card ? card.bank.split(' ')[0] : '—'} ••{tx.card.split('-')[1]}</td>
                <td className="px-3 py-2.5 text-right font-mono font-bold text-gray-900 dark:text-gray-100">{money(tx.amount)}</td>
                <td className="px-3 py-2.5 text-center hidden lg:table-cell">
                  <span className={`inline-flex items-center gap-1 text-[9px] font-mono ${tx.aiConfidence >= 95 ? 'text-emerald-600 dark:text-emerald-400' : tx.aiConfidence >= 85 ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    <span className="w-1 h-1 rounded-full bg-current"></span>
                    %{tx.aiConfidence}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function CategoryDistribution({ rows }: { rows: Array<[Category, number]> }) {
  const total = rows.reduce((a, [, value]) => a + value, 0) || 1;
  return (
    <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
      <div className="p-3 border-b border-gray-100 dark:border-gray-700/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Svg className="text-violet-600 dark:text-violet-400 w-3.5 h-3.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="2" x2="12" y2="22" /><line x1="2" y1="12" x2="22" y2="12" /></Svg>
          <h3 className="text-[12px] font-bold text-gray-900 dark:text-gray-100">Kategori Dağılımı</h3>
        </div>
        <span className="text-[9px] text-gray-500">Nisan</span>
      </div>
      <div className="p-3 space-y-2">
        {rows.map(([category, sum]) => {
          const cc = catConf[category];
          const cm = CM[cc.clr];
          const pct = Math.round((sum / total) * 100);
          return (
            <div key={category}>
              <div className="flex items-center justify-between text-[10px] mb-0.5">
                <div className="flex items-center gap-1.5 min-w-0">
                  <Svg className={`${cm.t} w-3 h-3 shrink-0`}>{cc.icon}</Svg>
                  <span className="text-gray-700 dark:text-gray-300 font-medium truncate">{cc.lbl}</span>
                </div>
                <span className="font-mono text-gray-500 dark:text-gray-400 shrink-0"><span className={`font-bold ${cm.t}`}>{compactMoney(sum, 1)}</span> · {pct}%</span>
              </div>
              <div className="h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className={`h-full ${cm.bar} rounded-full`} style={{ width: `${pct}%` }}></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function UpcomingPayments({ cards }: { cards: CreditCard[] }) {
  return (
    <div className="bg-gradient-to-br from-amber-50 to-rose-50/50 dark:from-amber-500/5 dark:to-rose-500/5 border border-amber-200 dark:border-amber-500/30 rounded-xl overflow-hidden">
      <div className="p-3 border-b border-amber-200/50 dark:border-amber-500/20 flex items-center gap-2">
        <Svg className="text-amber-600 dark:text-amber-400 w-3.5 h-3.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></Svg>
        <h3 className="text-[12px] font-bold text-amber-900 dark:text-amber-200">Yaklaşan Kart Ödemeleri</h3>
      </div>
      <div className="p-2.5 space-y-1.5">
        {[...cards].sort((a, b) => a.payDay - b.payDay).slice(0, 3).map((card) => {
          const daysLeft = card.payDay > 23 ? card.payDay - 23 : 30 - 23 + card.payDay;
          const urgent = daysLeft <= 5;
          return (
            <div key={card.id} className={`p-2 bg-white dark:bg-[#1e1f26] border ${urgent ? 'border-rose-200 dark:border-rose-500/30' : 'border-amber-200 dark:border-amber-500/30'} rounded text-[10px]`}>
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <span className="font-semibold text-gray-900 dark:text-gray-100 truncate">{card.bank.split(' ')[0]} ••{card.last4}</span>
                <span className={`font-mono font-bold ${urgent ? 'text-rose-700 dark:text-rose-300' : 'text-amber-700 dark:text-amber-300'} shrink-0`}>{compactMoney(card.statement, 1)}</span>
              </div>
              <p className="text-gray-500 dark:text-gray-400">Son ödeme {card.payDay}. · {daysLeft} gün</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
