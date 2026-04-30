import { type ReactNode, useState } from 'react';

type ColorName = 'indigo' | 'teal' | 'amber' | 'emerald' | 'violet' | 'rose' | 'sky' | 'gray';
type SettingsTab = 'sirketler' | 'entegrasyon' | 'vergi' | 'banka' | 'otomasyon' | 'kullanicilar' | 'bildirimler' | 'denetim';
type ToastState = { title: string; text: string; color: ColorName } | null;

const CM: Record<ColorName, { bg: string; t: string; border: string; bar: string; solid: string; hover: string }> = {
  indigo: { bg: 'bg-indigo-100 dark:bg-indigo-900/30', t: 'text-indigo-700 dark:text-indigo-300', border: 'border-indigo-200 dark:border-indigo-500/30', bar: 'bg-gradient-to-r from-indigo-400 to-indigo-600', solid: 'bg-indigo-600', hover: 'hover:bg-indigo-700' },
  teal: { bg: 'bg-teal-100 dark:bg-teal-900/30', t: 'text-teal-700 dark:text-teal-300', border: 'border-teal-200 dark:border-teal-500/30', bar: 'bg-gradient-to-r from-teal-400 to-teal-600', solid: 'bg-teal-600', hover: 'hover:bg-teal-700' },
  amber: { bg: 'bg-amber-100 dark:bg-amber-900/30', t: 'text-amber-700 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-500/30', bar: 'bg-gradient-to-r from-amber-400 to-amber-600', solid: 'bg-amber-600', hover: 'hover:bg-amber-700' },
  emerald: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', t: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-500/30', bar: 'bg-gradient-to-r from-emerald-400 to-emerald-600', solid: 'bg-emerald-600', hover: 'hover:bg-emerald-700' },
  violet: { bg: 'bg-violet-100 dark:bg-violet-900/30', t: 'text-violet-700 dark:text-violet-300', border: 'border-violet-200 dark:border-violet-500/30', bar: 'bg-gradient-to-r from-violet-400 to-violet-600', solid: 'bg-violet-600', hover: 'hover:bg-violet-700' },
  rose: { bg: 'bg-rose-100 dark:bg-rose-900/30', t: 'text-rose-700 dark:text-rose-300', border: 'border-rose-200 dark:border-rose-500/30', bar: 'bg-gradient-to-r from-rose-400 to-rose-600', solid: 'bg-rose-600', hover: 'hover:bg-rose-700' },
  sky: { bg: 'bg-sky-100 dark:bg-sky-900/30', t: 'text-sky-700 dark:text-sky-300', border: 'border-sky-200 dark:border-sky-500/30', bar: 'bg-gradient-to-r from-sky-400 to-sky-600', solid: 'bg-sky-600', hover: 'hover:bg-sky-700' },
  gray: { bg: 'bg-gray-100 dark:bg-gray-800', t: 'text-gray-700 dark:text-gray-300', border: 'border-gray-200 dark:border-gray-600/50', bar: 'bg-gradient-to-r from-gray-400 to-gray-600', solid: 'bg-gray-600', hover: 'hover:bg-gray-700' },
};

function Svg({ children, className = 'w-3.5 h-3.5' }: { children: ReactNode; className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">{children}</svg>;
}

function Toggle({ checked, onClick }: { checked: boolean; onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick} className={`inline-flex items-center ${checked ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-700'} rounded-full w-9 h-5 relative`} title={checked ? 'Aktif' : 'Pasif'}>
      <span className={`absolute ${checked ? 'right-0.5' : 'left-0.5'} w-4 h-4 bg-white rounded-full shadow`} />
    </button>
  );
}

export default function FinansAyarlari() {
  const [tab, setTab] = useState<SettingsTab>('sirketler');
  const [toast, setToast] = useState<ToastState>(null);

  const showToast = (title: string, text: string, color: ColorName = 'emerald') => {
    setToast({ title, text, color });
    window.setTimeout(() => setToast(null), 2200);
  };

  return (
    <div className="space-y-3 relative min-h-[calc(100vh-140px)]">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
            <Svg className="text-gray-600 dark:text-gray-400 w-4 h-4"><circle cx="12" cy="12" r="3" /><path d="M12 1v6m0 10v6m11-11h-6M7 12H1m15.07-7.07l-4.24 4.24M7.17 16.83l-4.24 4.24M16.83 16.83l4.24 4.24M7.17 7.17L2.93 2.93" /></Svg>
          </div>
          <div>
            <h1 className="text-[19px] font-bold text-gray-900 dark:text-gray-100 leading-tight">Finans Ayarları</h1>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">Sistem yapılandırması · entegrasyonlar · otomasyon kuralları · kullanıcı yönetimi</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => showToast('Kaydet', 'Değişiklikler sisteme uygulanıyor', 'emerald')} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-md shadow-sm">
            <Svg><polyline points="20 6 9 17 4 12" /></Svg>
            Değişiklikleri Kaydet
          </button>
        </div>
      </div>

      <SettingsTabs tab={tab} setTab={setTab} />
      {tab === 'sirketler' && <SirketlerTab onToast={showToast} />}
      {tab === 'entegrasyon' && <EntegrasyonTab onToast={showToast} />}
      {tab === 'vergi' && <VergiTab onToast={showToast} />}
      {tab === 'banka' && <BankaTab onToast={showToast} />}
      {tab === 'otomasyon' && <OtomasyonTab onToast={showToast} />}
      {tab === 'kullanicilar' && <KullanicilarTab onToast={showToast} />}
      {tab === 'bildirimler' && <BildirimlerTab />}
      {tab === 'denetim' && <DenetimTab onToast={showToast} />}
      {toast && <Toast toast={toast} />}
    </div>
  );
}

function SettingsTabs({ tab, setTab }: { tab: SettingsTab; setTab: (tab: SettingsTab) => void }) {
  const tabs: Array<{ k: SettingsTab; lbl: string; clr: ColorName; icon: ReactNode }> = [
    { k: 'sirketler', lbl: 'Şirket Bilgileri', clr: 'indigo', icon: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" /></> },
    { k: 'entegrasyon', lbl: 'Entegrasyonlar', clr: 'teal', icon: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /> },
    { k: 'vergi', lbl: 'Vergi Oranları', clr: 'amber', icon: <><line x1="19" y1="5" x2="5" y2="19" /><circle cx="6.5" cy="6.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" /></> },
    { k: 'banka', lbl: 'Banka Kuralları', clr: 'emerald', icon: <><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></> },
    { k: 'otomasyon', lbl: 'Otomasyon', clr: 'violet', icon: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.65 1.65 0 0 0 15 19.4a1.65 1.65 0 0 0-1 .6l-.09.09a2 2 0 1 1-2.83-2.83l.09-.09A1.65 1.65 0 0 0 10.6 15a1.65 1.65 0 0 0-1.82-.33l-.11.05a2 2 0 1 1-1.54-3.69l.11-.05A1.65 1.65 0 0 0 8.6 9a1.65 1.65 0 0 0-.6-1l-.09-.09a2 2 0 1 1 2.83-2.83l.09.09A1.65 1.65 0 0 0 13 4.6a1.65 1.65 0 0 0 1-.6l.09-.09a2 2 0 1 1 2.83 2.83l-.09.09A1.65 1.65 0 0 0 15.4 9c0 .7.42 1.33 1.07 1.58l.11.05a2 2 0 1 1-1.54 3.69l-.11-.05A1.65 1.65 0 0 0 13.4 15z" /></> },
    { k: 'kullanicilar', lbl: 'Kullanıcılar & Roller', clr: 'rose', icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /></> },
    { k: 'bildirimler', lbl: 'Bildirimler', clr: 'sky', icon: <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></> },
    { k: 'denetim', lbl: 'Denetim İzi', clr: 'gray', icon: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /></> },
  ];

  return (
    <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <div className="flex items-center gap-0.5 p-1.5 min-w-max">
          {tabs.map((item) => {
            const active = tab === item.k;
            return (
              <button key={item.k} type="button" onClick={() => setTab(item.k)} className={`flex items-center gap-1.5 px-3 py-2 text-[11px] font-semibold rounded-md transition-all shrink-0 ${active ? `${CM[item.clr].bg} ${CM[item.clr].t} border-2 ${CM[item.clr].border}` : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}>
                <Svg>{item.icon}</Svg>
                {item.lbl}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SirketlerTab({ onToast }: { onToast: (title: string, text: string, color?: ColorName) => void }) {
  const companies = [
    { name: 'Arma Digital Medya A.Ş.', tag: 'TEKNOPARK', clr: 'emerald' as ColorName, vkn: '0123456789', mersis: '0012300456700015', adres: 'Teknopark İstanbul, Sarıyer', vd: 'Maslak V.D.', kvkk: 'Muaf (4691)', kdv: 'Muaf · %0', tel: '+90 212 000 00 01', email: 'finans@armadigital.com', website: 'armadigital.com', iban: 'TR33 0006 2000 0000 0062 1234 56', logo: 'AD', bank: 'Garanti BBVA' },
    { name: 'Arma Bilişim Ltd. Şti.', tag: 'STANDART', clr: 'indigo' as ColorName, vkn: '9876543210', mersis: '0098765432100018', adres: 'Levent, Beşiktaş', vd: 'Beşiktaş V.D.', kvkk: '%25 Kurumlar', kdv: '%20 Standart', tel: '+90 212 000 00 02', email: 'finans@armabilisim.com', website: 'armabilisim.com', iban: 'TR33 0006 2000 0000 0062 5678 90', logo: 'AB', bank: 'Garanti BBVA' },
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {companies.map((company) => (
          <div key={company.name} className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
            <div className={`p-4 ${CM[company.clr].bg} border-b ${CM[company.clr].border} flex items-center gap-3`}>
              <div className="w-12 h-12 bg-white dark:bg-[#1e1f26] rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                <span className={`font-black text-[16px] ${CM[company.clr].t}`}>{company.logo}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[14px] font-black text-gray-900 dark:text-gray-100 truncate">{company.name}</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 bg-white dark:bg-[#1e1f26] ${CM[company.clr].t} rounded`}>{company.tag}</span>
                  <span className="text-[9px] text-gray-500 font-mono">VKN: {company.vkn}</span>
                </div>
              </div>
              <button type="button" onClick={() => onToast('Düzenle', `${company.name} bilgileri düzenleme formu`, company.clr)} className="p-1.5 text-gray-500 hover:bg-white dark:hover:bg-[#1e1f26] rounded shrink-0">
                <Svg><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></Svg>
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[10px]">
                <Info label="MERSİS No" value={company.mersis} mono />
                <Info label="Vergi Dairesi" value={company.vd} />
                <Info label="Adres" value={company.adres} wide />
                <Info label="Telefon" value={company.tel} mono />
                <Info label="E-posta" value={company.email} mono />
                <Info label="KDV" value={company.kdv} color={company.kdv.includes('Muaf') ? 'emerald' : 'indigo'} />
                <Info label="Kurumlar V." value={company.kvkk} color={company.kvkk.includes('Muaf') ? 'emerald' : 'indigo'} />
              </div>
              <div className="pt-3 border-t border-gray-100 dark:border-gray-700/40 text-[10px]">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Ana Banka Hesabı</p>
                  <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold">{company.bank}</span>
                </div>
                <p className="font-mono text-gray-900 dark:text-gray-100">{company.iban}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-indigo-50/50 to-teal-50/50 dark:from-indigo-500/5 dark:to-teal-500/5 border border-indigo-200/50 dark:border-indigo-500/20 rounded-xl p-3 flex items-start gap-2.5">
        <Svg className="text-indigo-600 dark:text-indigo-400 w-4 h-4 shrink-0 mt-0.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></Svg>
        <p className="text-[11px] text-gray-700 dark:text-gray-300">Bu bilgiler tüm fatura, sözleşme ve resmi belgede otomatik kullanılır. VKN veya adres değişikliği sistem geneli etkiler.</p>
      </div>
    </>
  );
}

function EntegrasyonTab({ onToast }: { onToast: (title: string, text: string, color?: ColorName) => void }) {
  const integrations = [
    { name: 'Paraşüt', desc: 'E-fatura, muhasebe, banka hareketi, vergi', clr: 'teal' as ColorName, status: 'connected', lastSync: '10 dk önce', key: 'clientId: prsut_••••8842', scope: 'sales_invoices, expenses, contacts, bank_transactions, accounts' },
    { name: 'Metunic', desc: 'Domain kayıt, DNS, whois', clr: 'teal' as ColorName, status: 'connected', lastSync: '15 dk önce', key: 'API Key: mtn_••••9451', scope: 'domains, dns, whois, transfer' },
    { name: 'Plesk', desc: 'Hosting + VDS yönetimi', clr: 'indigo' as ColorName, status: 'connected', lastSync: '5 dk önce', key: 'Server: plesk.armadigital.com', scope: 'sites, subscriptions, backups, mail' },
    { name: 'Cloudflare', desc: 'SSL, DNS proxy, CDN', clr: 'amber' as ColorName, status: 'connected', lastSync: '8 dk önce', key: 'Account: cf_••••3842', scope: 'zones, ssl_certs, dns_records, analytics' },
    { name: 'GİB e-Fatura', desc: 'Gelir İdaresi Başkanlığı e-fatura entegrasyonu', clr: 'rose' as ColorName, status: 'connected', lastSync: '2 saat önce', key: 'Mali Mühür: MM••••1234', scope: 'e-fatura, e-arşiv, e-irsaliye' },
    { name: 'Google Workspace', desc: 'Drive, Calendar, Gmail', clr: 'sky' as ColorName, status: 'connected', lastSync: '30 dk önce', key: 'OAuth2: admin@armadigital.com', scope: 'files, events, emails' },
    { name: 'Google Ads', desc: 'Reklam hesap yönetimi ve raporlar', clr: 'sky' as ColorName, status: 'partial', lastSync: 'Yok', key: 'MCC: 123-456-7890', scope: 'campaigns, reports · token yenilenmeli' },
    { name: 'Meta Ads', desc: 'Facebook & Instagram reklamları', clr: 'indigo' as ColorName, status: 'disconnected', lastSync: '—', key: '—', scope: '—' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {integrations.map((integration) => {
        const statusColor: ColorName = integration.status === 'connected' ? 'emerald' : integration.status === 'partial' ? 'amber' : 'rose';
        return (
          <div key={integration.name} className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
            <div className={`p-3 ${CM[integration.clr].bg} border-b ${CM[integration.clr].border} flex items-center justify-between gap-2`}>
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-9 h-9 bg-white dark:bg-[#1e1f26] rounded-lg flex items-center justify-center shrink-0">
                  <Svg className={`${CM[integration.clr].t} w-4 h-4`}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></Svg>
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-bold text-gray-900 dark:text-gray-100 truncate">{integration.name}</p>
                  <p className="text-[9px] text-gray-500 dark:text-gray-400 truncate">{integration.desc}</p>
                </div>
              </div>
              <span className={`inline-flex items-center gap-1 text-[8px] font-bold px-1.5 py-0.5 ${CM[statusColor].bg} ${CM[statusColor].t} rounded shrink-0`}>
                {integration.status !== 'disconnected' && <span className={`w-1.5 h-1.5 bg-${statusColor}-500 rounded-full ${integration.status === 'partial' ? 'animate-pulse' : ''}`} />}
                {integration.status === 'connected' ? 'BAĞLI' : integration.status === 'partial' ? 'UYARI' : 'BAĞLANTISIZ'}
              </span>
            </div>
            <div className="p-3 space-y-2 text-[10px]">
              <Info label="Kimlik" value={integration.key} mono />
              <Info label="İzinler" value={integration.scope} />
              <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700/40">
                <span className="text-gray-500 dark:text-gray-400">Son senkron: <span className="font-semibold">{integration.lastSync}</span></span>
                <button type="button" onClick={() => onToast(integration.name, integration.status === 'disconnected' ? 'Bağlantı kuruluyor...' : 'Yeniden senkron başlatıldı', integration.clr)} className={`text-[10px] font-bold ${CM[integration.clr].t} hover:underline`}>{integration.status === 'disconnected' ? 'Bağlan →' : 'Senkron →'}</button>
              </div>
            </div>
          </div>
        );
      })}
      <button type="button" onClick={() => onToast('Yeni', 'Entegrasyon kataloğu açılıyor', 'teal')} className="border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-teal-500 rounded-xl p-5 flex flex-col items-center justify-center gap-2 hover:bg-teal-50/30 dark:hover:bg-teal-500/5 min-h-[220px]">
        <Svg className="text-gray-400 w-8 h-8"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></Svg>
        <span className="text-[12px] font-bold text-gray-600 dark:text-gray-400">Yeni Entegrasyon</span>
        <span className="text-[10px] text-gray-500 text-center">50+ hazır entegrasyon · API key ile bağlanın</span>
      </button>
    </div>
  );
}

function VergiTab({ onToast }: { onToast: (title: string, text: string, color?: ColorName) => void }) {
  const kdv = [
    { or: '%0', a: 'Teknopark muafiyeti (4691)', h: 'Arma Digital tüm teknolojik hizmetler', aktif: true, emph: true },
    { or: '%1', a: 'Temel gıda, kitap', h: 'Kullanılmıyor', aktif: false, emph: false },
    { or: '%10', a: 'Sağlık, kültür', h: 'Nadiren uygulanıyor', aktif: true, emph: false },
    { or: '%20', a: 'Genel KDV oranı', h: 'Arma Bilişim standart hizmetleri', aktif: true, emph: true },
  ];

  return (
    <>
      <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
        <div className="p-3 border-b border-gray-100 dark:border-gray-700/40 flex items-center gap-2">
          <Svg className="text-indigo-600 dark:text-indigo-400 w-4 h-4"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="9" y1="9" x2="15" y2="9" /><line x1="9" y1="15" x2="15" y2="15" /></Svg>
          <h3 className="text-[13px] font-bold text-gray-900 dark:text-gray-100">KDV Oranları (2026)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead className="bg-gray-50 dark:bg-[#17181f]"><tr className="border-b border-gray-200 dark:border-gray-700/30"><Th>Oran</Th><Th>Açıklama</Th><Th hidden="md">Uygulanan Hizmetler</Th><Th center>Aktif</Th></tr></thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/30">
              {kdv.map((row) => <tr key={row.or} className={`hover:bg-gray-50 dark:hover:bg-white/5 ${row.emph ? 'bg-indigo-50/30 dark:bg-indigo-500/5' : ''}`}><Td className={`font-mono font-black text-[14px] ${row.emph ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300'}`}>{row.or}</Td><Td bold>{row.a}</Td><Td hidden="md">{row.h}</Td><Td center><Toggle checked={row.aktif} /></Td></tr>)}
            </tbody>
          </table>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <TaxCard title="Kurumlar Vergisi" color="violet" items={[['Arma Digital', '%0', 'Teknopark muafiyeti · 4691 sayılı kanun · Aralık 2033\'e kadar', 'emerald'], ['Arma Bilişim', '%25', '2026 standart oran · 4 taksit opsiyonu', 'indigo']]} />
        <TaxList />
      </div>
      <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 dark:from-amber-500/10 dark:to-orange-500/5 border border-amber-200 dark:border-amber-500/30 rounded-xl p-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Svg className="text-amber-600 dark:text-amber-400 w-4 h-4"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></Svg>
            <h3 className="text-[13px] font-bold text-amber-900 dark:text-amber-200">TEFE-TÜFE Oranı (Nisan 2026)</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[24px] font-black text-amber-700 dark:text-amber-300 font-mono">%3.2</span>
            <button type="button" onClick={() => onToast('TÜİK', 'Güncel oran TUIK API’den çekildi', 'amber')} className="px-2.5 py-1.5 bg-amber-600 text-white text-[10px] font-bold rounded hover:bg-amber-700">TÜİK Senkron</button>
          </div>
        </div>
        <p className="text-[10px] text-amber-800 dark:text-amber-300 mt-2">Ortaklar Muhasebesi · TEFE-TÜFE borçlanma sisteminde kullanılır · her ay otomatik güncellenir</p>
      </div>
    </>
  );
}

function BankaTab({ onToast }: { onToast: (title: string, text: string, color?: ColorName) => void }) {
  const rules = [
    { pattern: '"Bosch" içeren havaleler', kategori: 'Bosch Tahsilatı', action: 'Otomatik fatura eşleştir', clr: 'rose' as ColorName, count: 42 },
    { pattern: '"Vergi Dairesi" / "VD" / "GİB"', kategori: 'Vergi Ödemesi', action: 'Gider kaydı aç + Paraşüt senkron', clr: 'amber' as ColorName, count: 28 },
    { pattern: '"Maaş" / "bordo" açıklaması', kategori: 'Personel Maaş', action: 'Personel giderleri hesabına at', clr: 'sky' as ColorName, count: 42 },
    { pattern: '"Google" / "Meta" / "Facebook"', kategori: 'Reklam Gideri', action: 'Reklam gider kategorisine eşle', clr: 'indigo' as ColorName, count: 18 },
    { pattern: 'Kira ödemeleri (sabit tutar)', kategori: 'Ofis Kirası', action: 'Kira gider kaydı · sabit tutar kontrol', clr: 'violet' as ColorName, count: 12 },
  ];

  return (
    <>
      <Panel title="Banka Hareket Eşleştirme Kuralları" color="emerald" action={<button type="button" onClick={() => onToast('Yeni Kural', 'Banka hareketi eşleştirme kuralı oluşturma', 'emerald')} className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 hover:underline">+ Yeni Kural</button>}>
        <div className="divide-y divide-gray-100 dark:divide-gray-700/30">
          {rules.map((rule) => <div key={rule.pattern} className="p-3 hover:bg-gray-50 dark:hover:bg-white/5 flex items-center justify-between gap-3"><div className="flex-1 min-w-0"><div className="flex items-center gap-2 flex-wrap"><p className="text-[11px] font-semibold text-gray-900 dark:text-gray-100">{rule.pattern}</p><span className={`text-[9px] font-bold px-1.5 py-0.5 ${CM[rule.clr].bg} ${CM[rule.clr].t} rounded`}>{rule.kategori}</span></div><p className="text-[9px] text-gray-500 dark:text-gray-400 mt-0.5">→ {rule.action}</p></div><div className="flex items-center gap-2 shrink-0"><span className="text-[9px] text-gray-500 font-mono">{rule.count} kere</span><Toggle checked /></div></div>)}
        </div>
      </Panel>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <SettingsBox title="Otomatik Mutabakat" items={['Her gün 23:00’te otomatik mutabakat çalıştır', 'Fark tespitinde Tülay Hanım’a bildirim gönder', '₺1.000 altı farkları otomatik düzelt', 'Aylık mutabakat raporu otomatik oluştur']} />
        <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-4">
          <h3 className="text-[13px] font-bold text-gray-900 dark:text-gray-100 mb-3">Bakiye Uyarıları</h3>
          <div className="space-y-3">
            <InputAmount label="Minimum bakiye eşiği" value="500.000" help="Bakiye bu tutarın altına düşerse uyarı" />
            <InputAmount label="Büyük hareket eşiği" value="100.000" help="Bu tutar üstü giriş/çıkışta anlık bildirim" />
            <label className="flex items-center gap-2 cursor-pointer p-2 bg-amber-50 dark:bg-amber-500/10 rounded"><input type="checkbox" defaultChecked className="rounded text-amber-600" /><span className="text-[11px] text-amber-800 dark:text-amber-200">Şüpheli işlem tespitinde CEO’ya bildir</span></label>
          </div>
        </div>
      </div>
    </>
  );
}

function OtomasyonTab({ onToast }: { onToast: (title: string, text: string, color?: ColorName) => void }) {
  const sections = [
    { cat: 'Fatura Otomasyonları', clr: 'emerald' as ColorName, rules: ['Aylık retainer otomatik fatura', 'Vadesi geçen fatura hatırlatma', 'GİB e-fatura senkron'] },
    { cat: 'Vergi Otomasyonları', clr: 'amber' as ColorName, rules: ['Beyanname hatırlatma (5 gün kala)', 'Vergi ödeme vade uyarıları', 'Paraşüt vergi senkron'] },
    { cat: 'Hizmet & Uzatma', clr: 'teal' as ColorName, rules: ['Domain otomatik uzatma', 'Hosting otomatik uzatma', 'SSL yenileme uyarısı (30g)'] },
    { cat: 'Ortaklar & Bordro', clr: 'violet' as ColorName, rules: ['Ortak denge TEFE güncelleme', 'Kar ortağı otomatik hesaplama', 'Osman GM maaş ödeme'] },
  ];

  return (
    <div className="space-y-3">
      {sections.map((section) => (
        <div key={section.cat} className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
          <div className={`p-3 ${CM[section.clr].bg} border-b ${CM[section.clr].border} flex items-center justify-between`}>
            <h3 className={`text-[13px] font-bold ${CM[section.clr].t}`}>{section.cat}</h3>
            <span className={`text-[9px] font-bold px-1.5 py-0.5 bg-white dark:bg-[#1e1f26] ${CM[section.clr].t} rounded`}>{section.rules.length} KURAL</span>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700/30">
            {section.rules.map((rule, index) => <div key={rule} className="p-3 flex items-start justify-between gap-3 hover:bg-gray-50 dark:hover:bg-white/5"><div className="flex-1 min-w-0"><p className="text-[12px] font-bold text-gray-900 dark:text-gray-100">{rule}</p><p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">Finans panosu otomasyon kuralı · audit log kaydı oluşturur</p><div className="flex items-center gap-3 mt-1.5 text-[9px] text-gray-500"><span>Son çalışma: <span className="font-mono text-gray-700 dark:text-gray-300">{index === 0 ? '01.04.2026 03:00' : '24.04.2026 14:30'}</span></span><span>Toplam: <span className={`font-mono font-bold ${CM[section.clr].t}`}>{[87, 24, 1840][index]}</span></span></div></div><div className="flex items-center gap-1.5 shrink-0"><button type="button" onClick={() => onToast('Çalıştır', `${rule} şimdi çalışıyor`, section.clr)} className="p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded" title="Şimdi Çalıştır"><Svg><polygon points="5 3 19 12 5 21 5 3" /></Svg></button><Toggle checked /></div></div>)}
          </div>
        </div>
      ))}
    </div>
  );
}

function KullanicilarTab({ onToast }: { onToast: (title: string, text: string, color?: ColorName) => void }) {
  const users = [
    { name: 'Tülay Hanım', role: 'Finans Direktörü', email: 'tulay@armadigital.com', avatar: 'TH', clr: 'emerald' as ColorName, perms: ['Tüm Finans', 'Onaylama', 'Raporlar', 'Ayarlar'], lastLogin: 'Şu anda' },
    { name: 'Osman Atasoy', role: 'CEO', email: 'osman@armadigital.com', avatar: 'OA', clr: 'rose' as ColorName, perms: ['Tüm Sistem', 'Süper Admin'], lastLogin: '2 saat önce' },
    { name: 'Murat Bak', role: 'Operasyon Ortağı', email: 'murat@armadigital.com', avatar: 'MB', clr: 'indigo' as ColorName, perms: ['Operasyon', 'Rapor Görüntüleme'], lastLogin: '1 gün önce' },
    { name: 'Fatih Bak', role: 'Teknik Ortak', email: 'fatih@armadigital.com', avatar: 'FB', clr: 'violet' as ColorName, perms: ['Teknik', 'Rapor Görüntüleme'], lastLogin: '3 saat önce' },
    { name: 'Sacide Ziyaoğlu', role: 'Yönetim Ortağı', email: 'sacide@armadigital.com', avatar: 'SZ', clr: 'emerald' as ColorName, perms: ['Rapor Görüntüleme'], lastLogin: '1 hafta önce' },
    { name: 'Mehmet Kaya', role: 'Satış Temsilcisi', email: 'mehmet@armadigital.com', avatar: 'MK', clr: 'sky' as ColorName, perms: ['Satış', 'Müşteri Ekleme'], lastLogin: '30 dk önce' },
    { name: 'Ayşe Demir', role: 'Satış Temsilcisi', email: 'ayse@armadigital.com', avatar: 'AD', clr: 'sky' as ColorName, perms: ['Satış', 'Müşteri Ekleme'], lastLogin: '4 saat önce' },
  ];

  return (
    <>
      <Panel title="Sistem Kullanıcıları" color="rose" badge={`${users.length} KİŞİ`} action={<button type="button" onClick={() => onToast('Yeni', 'Kullanıcı davet formu açılıyor', 'rose')} className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold rounded">+ Davet Et</button>}>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead className="bg-gray-50 dark:bg-[#17181f]"><tr className="border-b border-gray-200 dark:border-gray-700/30"><Th>Kullanıcı</Th><Th hidden="md">Rol</Th><Th hidden="lg">İzinler</Th><Th hidden="md">Son Giriş</Th><Th center>Durum</Th><Th right></Th></tr></thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/30">
              {users.map((user) => <tr key={user.email} className="hover:bg-gray-50 dark:hover:bg-white/5"><Td><div className="flex items-center gap-2"><div className={`w-8 h-8 bg-gradient-to-br from-${user.clr}-500 to-${user.clr}-600 rounded-full flex items-center justify-center shrink-0`}><span className="text-white text-[10px] font-bold">{user.avatar}</span></div><div className="min-w-0"><p className="font-bold text-gray-900 dark:text-gray-100 truncate">{user.name}</p><p className="text-[9px] text-gray-500 font-mono truncate">{user.email}</p></div></div></Td><Td hidden="md"><span className={`inline-flex text-[9px] font-bold px-1.5 py-0.5 ${CM[user.clr].bg} ${CM[user.clr].t} rounded`}>{user.role}</span></Td><Td hidden="lg"><div className="flex flex-wrap gap-1">{user.perms.slice(0, 2).map((perm) => <span key={perm} className="text-[8px] font-bold px-1 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded">{perm}</span>)}{user.perms.length > 2 && <span className="text-[8px] text-gray-500">+{user.perms.length - 2}</span>}</div></Td><Td hidden="md">{user.lastLogin}</Td><Td center><span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 rounded"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>Aktif</span></Td><Td right><button type="button" onClick={() => onToast('Düzenle', `${user.name} izinleri düzenleme`, 'rose')} className="p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"><Svg><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></Svg></button></Td></tr>)}
            </tbody>
          </table>
        </div>
      </Panel>
      <RoleMatrix />
    </>
  );
}

function BildirimlerTab() {
  const sections = [
    { title: 'Fatura Bildirimleri', clr: 'emerald' as ColorName, items: ['Yeni fatura kesildiğinde', 'Fatura ödendiğinde', 'Vadesi geçmiş fatura uyarısı', '₺100K üstü fatura onay talebi'] },
    { title: 'Vergi Bildirimleri', clr: 'amber' as ColorName, items: ['Beyanname son 7 gün', 'Vergi ödeme tarihi', 'Gecikmiş vergi borcu', 'Yeni vergi düzenlemesi'] },
    { title: 'Banka Bildirimleri', clr: 'indigo' as ColorName, items: ['Büyük giriş (₺100K+)', 'Büyük çıkış (₺100K+)', 'Minimum bakiye uyarısı', 'Mutabakat farkı tespit'] },
    { title: 'Sistem Bildirimleri', clr: 'violet' as ColorName, items: ['Entegrasyon koptu', 'Yeni kullanıcı eklendi', 'Otomasyon kuralı başarısız', 'Haftalık finans özeti (Pzt)'] },
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {sections.map((section) => <div key={section.title} className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden"><div className={`p-3 ${CM[section.clr].bg} border-b ${CM[section.clr].border} flex items-center justify-between`}><h3 className={`text-[12px] font-bold ${CM[section.clr].t}`}>{section.title}</h3><div className="flex items-center gap-2 text-[9px] font-semibold text-gray-600 dark:text-gray-400"><span className="w-6 text-center">Mail</span><span className="w-6 text-center">SMS</span><span className="w-6 text-center">Push</span></div></div><div className="divide-y divide-gray-100 dark:divide-gray-700/30">{section.items.map((item, index) => <div key={item} className="p-2.5 flex items-center justify-between gap-2"><span className="text-[11px] text-gray-700 dark:text-gray-300 flex-1">{item}</span><div className="flex items-center gap-2 shrink-0"><input type="checkbox" defaultChecked className={`rounded text-${section.clr}-600 w-3.5 h-3.5`} /><input type="checkbox" defaultChecked={index !== 3} className={`rounded text-${section.clr}-600 w-3.5 h-3.5`} /><input type="checkbox" defaultChecked={index < 2} className={`rounded text-${section.clr}-600 w-3.5 h-3.5`} /></div></div>)}</div></div>)}
      </div>
      <div className="bg-gray-50 dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-lg p-3 flex items-center gap-4 text-[10px] flex-wrap">
        <span className="flex items-center gap-1"><span className="font-bold">Mail</span><span className="text-gray-600 dark:text-gray-400">E-posta</span></span>
        <span className="flex items-center gap-1"><span className="font-bold">SMS</span><span className="text-gray-600 dark:text-gray-400">SMS</span></span>
        <span className="flex items-center gap-1"><span className="font-bold">Push</span><span className="text-gray-600 dark:text-gray-400">Mobil bildirim</span></span>
        <span className="ml-auto text-gray-500">Önce Tülay Hanım’a gider, CEO’ya cc</span>
      </div>
    </>
  );
}

function DenetimTab({ onToast }: { onToast: (title: string, text: string, color?: ColorName) => void }) {
  const logs = [
    { t: '24.04.2026 14:30', u: 'Tülay H.', a: 'Fatura kesti · F-2026-0089 · ₺125.000', clr: 'emerald' as ColorName, ip: '213.14.•••.23' },
    { t: '24.04.2026 13:15', u: 'Osman B.', a: 'Bosch sözleşmesi onayladı', clr: 'sky' as ColorName, ip: '213.14.•••.45' },
    { t: '24.04.2026 11:42', u: 'Tülay H.', a: 'KDV beyanname ekledi · V-2026-B01', clr: 'amber' as ColorName, ip: '213.14.•••.23' },
    { t: '24.04.2026 10:08', u: 'Mehmet K.', a: 'Yeni müşteri ekledi · TechNova Yazılım', clr: 'sky' as ColorName, ip: '85.96.•••.128' },
    { t: '23.04.2026 17:22', u: 'Osman B.', a: 'Finans Ayarları düzenledi · otomasyon', clr: 'violet' as ColorName, ip: '213.14.•••.45' },
    { t: '22.04.2026 19:30', u: 'Sistem', a: 'Otomasyon: GIB e-fatura senkron · 8 belge alındı', clr: 'teal' as ColorName, ip: 'otomasyon' },
  ];

  return (
    <>
      <Panel title="Sistem Denetim İzi" color="gray" badge="SON 30 GÜN" action={<button type="button" onClick={() => onToast('Export', 'Denetim izi CSV olarak indiriliyor', 'gray')} className="text-[10px] font-semibold text-indigo-700 dark:text-indigo-300 hover:underline">Export ↓</button>}>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead className="bg-gray-50 dark:bg-[#17181f]"><tr className="border-b border-gray-200 dark:border-gray-700/30"><Th hidden="md">Zaman</Th><Th>Kullanıcı</Th><Th>Aksiyon</Th><Th hidden="lg">IP</Th></tr></thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/30">{logs.map((log) => <tr key={`${log.t}-${log.a}`} className="hover:bg-gray-50 dark:hover:bg-white/5"><Td hidden="md" className="font-mono text-[10px] whitespace-nowrap">{log.t}</Td><Td bold className="whitespace-nowrap">{log.u}</Td><Td><span className={`inline-block w-1.5 h-1.5 bg-${log.clr}-500 rounded-full mr-2 align-middle`}></span>{log.a}<p className="text-[9px] text-gray-500 font-mono md:hidden mt-0.5">{log.t}</p></Td><Td hidden="lg" className="font-mono text-[10px]">{log.ip}</Td></tr>)}</tbody>
          </table>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-[#17181f] border-t border-gray-100 dark:border-gray-700/40 flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-400">
          <span>10 kayıt · Son 30 günde toplam 2.847 aksiyon</span>
          <span>Denetim kayıtları 7 yıl saklanır</span>
        </div>
      </Panel>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <SecurityBox title="2FA" value="7/7" sub="Tüm kullanıcılarda aktif" color="emerald" />
        <SecurityBox title="Son Kritik Değişiklik" value="Osman B." sub="23.04.2026 · Finans Ayarları" color="sky" />
        <SecurityBox title="Başarısız Giriş" value="0" sub="Son 30 gün" color="amber" />
      </div>
    </>
  );
}

function Info({ label, value, mono = false, wide = false, color }: { label: string; value: string; mono?: boolean; wide?: boolean; color?: ColorName }) {
  return <div className={wide ? 'md:col-span-2' : ''}><p className="text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">{label}</p><p className={`${mono ? 'font-mono' : 'font-semibold'} ${color ? CM[color].t : 'text-gray-900 dark:text-gray-100'} mt-0.5 truncate`}>{value}</p></div>;
}

function Panel({ title, color, badge, action, children }: { title: string; color: ColorName; badge?: string; action?: ReactNode; children: ReactNode }) {
  return <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden"><div className="p-3 border-b border-gray-100 dark:border-gray-700/40 flex items-center justify-between"><div className="flex items-center gap-2"><Svg className={`${CM[color].t} w-4 h-4`}><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></Svg><h3 className="text-[13px] font-bold text-gray-900 dark:text-gray-100">{title}</h3>{badge && <span className={`text-[9px] font-bold px-1.5 py-0.5 ${CM[color].bg} ${CM[color].t} rounded`}>{badge}</span>}</div>{action}</div>{children}</div>;
}

function Th({ children, center = false, right = false, hidden }: { children?: ReactNode; center?: boolean; right?: boolean; hidden?: 'md' | 'lg' }) {
  const hiddenClass = hidden === 'md' ? 'hidden md:table-cell' : hidden === 'lg' ? 'hidden lg:table-cell' : '';
  return <th className={`${center ? 'text-center' : right ? 'text-right' : 'text-left'} px-3 py-2 font-semibold text-gray-500 dark:text-gray-400 ${hiddenClass}`}>{children}</th>;
}

function Td({ children, center = false, right = false, hidden, bold = false, className = '' }: { children?: ReactNode; center?: boolean; right?: boolean; hidden?: 'md' | 'lg'; bold?: boolean; className?: string }) {
  const hiddenClass = hidden === 'md' ? 'hidden md:table-cell' : hidden === 'lg' ? 'hidden lg:table-cell' : '';
  return <td className={`${center ? 'text-center' : right ? 'text-right' : 'text-left'} px-3 py-2.5 text-gray-600 dark:text-gray-400 ${bold ? 'font-semibold text-gray-900 dark:text-gray-100' : ''} ${hiddenClass} ${className}`}>{children}</td>;
}

function TaxCard({ title, color, items }: { title: string; color: ColorName; items: Array<[string, string, string, string]> }) {
  return <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden"><div className="p-3 border-b border-gray-100 dark:border-gray-700/40 flex items-center gap-2"><Svg className={`${CM[color].t} w-4 h-4`}><path d="M3 21h18M5 21V8l7-5 7 5v13M10 21v-5a2 2 0 0 1 4 0v5" /></Svg><h3 className="text-[13px] font-bold text-gray-900 dark:text-gray-100">{title}</h3></div><div className="p-4 space-y-3">{items.map(([name, value, sub, itemColor]) => <div key={name} className={`p-3 ${CM[itemColor as ColorName].bg} border ${CM[itemColor as ColorName].border} rounded-md`}><div className="flex items-center justify-between mb-1"><span className={`text-[11px] font-bold ${CM[itemColor as ColorName].t}`}>{name}</span><span className={`text-[18px] font-black font-mono ${CM[itemColor as ColorName].t}`}>{value}</span></div><p className={`text-[9px] ${CM[itemColor as ColorName].t}`}>{sub}</p></div>)}</div></div>;
}

function TaxList() {
  return <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden"><div className="p-3 border-b border-gray-100 dark:border-gray-700/40 flex items-center gap-2"><Svg className="text-rose-600 dark:text-rose-400 w-4 h-4"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></Svg><h3 className="text-[13px] font-bold text-gray-900 dark:text-gray-100">Diğer Vergi Oranları</h3></div><div className="p-3 divide-y divide-gray-100 dark:divide-gray-700/30">{[['Gelir Vergisi Stopajı (SM)', '%20', 'Serbest meslek makbuzu'], ['Gelir Vergisi Stopajı (Kira)', '%20', 'İşyeri kirası'], ['Damga Vergisi (sözleşme)', '‰0.00948', 'Binde · sözleşme tutarı'], ['Geçici Vergi', '%25', 'Kurum kazancı · 3 aylık'], ['ÖİV (Özel İletişim Vergisi)', '%7.5', 'GSM · internet']].map(([name, value, sub]) => <div key={name} className="py-2 flex items-center justify-between"><div><p className="text-[11px] font-semibold text-gray-900 dark:text-gray-100">{name}</p><p className="text-[9px] text-gray-500 dark:text-gray-400">{sub}</p></div><p className="font-mono font-bold text-rose-700 dark:text-rose-300 text-[13px]">{value}</p></div>)}</div></div>;
}

function SettingsBox({ title, items }: { title: string; items: string[] }) {
  return <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-4"><h3 className="text-[13px] font-bold text-gray-900 dark:text-gray-100 mb-3">{title}</h3><div className="space-y-2">{items.map((item, index) => <label key={item} className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded"><input type="checkbox" defaultChecked={index !== 2} className="rounded text-emerald-600" /><span className="text-[11px] text-gray-700 dark:text-gray-300 flex-1">{item}</span></label>)}</div></div>;
}

function InputAmount({ label, value, help }: { label: string; value: string; help: string }) {
  return <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1">{label}</label><div className="flex items-center gap-2"><input type="text" defaultValue={value} className="flex-1 px-3 py-1.5 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono" /><span className="text-[11px] text-gray-500">₺</span></div><p className="text-[9px] text-gray-500 mt-1">{help}</p></div>;
}

function RoleMatrix() {
  const roles = [
    { r: 'Süper Admin', clr: 'rose' as ColorName, sayi: 1, izin: 'Tüm sistem · ayarlar · kullanıcı ekleme' },
    { r: 'Finans Direktörü', clr: 'emerald' as ColorName, sayi: 1, izin: 'Tüm finans · onay · raporlar · vergi' },
    { r: 'Ortak', clr: 'violet' as ColorName, sayi: 3, izin: 'Raporlar · ortak muhasebe · kendi veriler' },
    { r: 'Satış Temsilcisi', clr: 'sky' as ColorName, sayi: 2, izin: 'Müşteri ekle · pipeline · satış raporu' },
    { r: 'Muhasebe Yardımcısı', clr: 'amber' as ColorName, sayi: 0, izin: 'Fatura girişi · tahsilat kayıt' },
    { r: 'Görüntüleyici', clr: 'gray' as ColorName, sayi: 0, izin: 'Sadece rapor görüntüleme · yazma yok' },
  ];
  return <Panel title="Rol Tanımları" color="violet"><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 lg:divide-x divide-gray-100 dark:divide-gray-700/30">{roles.map((role) => <div key={role.r} className="p-3"><div className="flex items-center justify-between gap-2 mb-1"><span className={`inline-flex text-[11px] font-bold px-2 py-0.5 ${CM[role.clr].bg} ${CM[role.clr].t} rounded`}>{role.r}</span><span className="text-[9px] text-gray-500 font-mono">{role.sayi} kişi</span></div><p className="text-[10px] text-gray-600 dark:text-gray-400">{role.izin}</p></div>)}</div></Panel>;
}

function SecurityBox({ title, value, sub, color }: { title: string; value: string; sub: string; color: ColorName }) {
  return <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-3.5"><div className="flex items-center gap-2 mb-2"><Svg className={`${CM[color].t} w-4 h-4`}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></Svg><p className="text-[11px] font-bold text-gray-900 dark:text-gray-100">{title}</p></div><p className={`text-[22px] font-black ${CM[color].t} font-mono`}>{value}</p><p className="text-[9px] text-gray-500 mt-1">{sub}</p></div>;
}

function Toast({ toast }: { toast: Exclude<ToastState, null> }) {
  return <div className={`absolute right-4 top-4 z-50 bg-white dark:bg-[#1e1f26] border ${CM[toast.color].border} rounded-lg shadow-xl p-3 min-w-[260px]`}><p className={`text-[12px] font-bold ${CM[toast.color].t}`}>{toast.title}</p><p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{toast.text}</p></div>;
}
