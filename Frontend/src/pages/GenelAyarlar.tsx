import { type ReactNode, useState } from 'react';
import Layout from '../components/Layout';

type TabKey = 'general' | 'account' | 'appearance' | 'notifications' | 'security' | 'audit' | 'backup' | 'license';
type ToastState = { title: string; message: string; color: 'emerald' | 'amber' | 'sky' | 'violet' | 'rose' } | null;

const TABS: Array<{ k: TabKey; label: string; desc: string; icon: ReactNode }> = [
  { k: 'general', label: 'Kurumsal Kimlik', desc: 'Şirket bilgileri · marka · logo', icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /> },
  { k: 'account', label: 'Hesap & Profil', desc: 'Kullanıcı bilgileri · şifre · 2FA', icon: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></> },
  { k: 'appearance', label: 'Görünüm & Tema', desc: 'Tema · dil · zaman dilimi · format', icon: <><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /></> },
  { k: 'notifications', label: 'Bildirimler', desc: 'E-posta · Slack · push · SMS kanalları', icon: <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></> },
  { k: 'security', label: 'Güvenlik & Erişim', desc: 'MFA · oturum · IP · şifre politikası', icon: <><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></> },
  { k: 'audit', label: 'Audit & İzleme', desc: 'Log seviyesi · retention · canlı stream', icon: <><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></> },
  { k: 'backup', label: 'Yedekleme', desc: 'Otomatik yedek · saklama · geri yükleme', icon: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></> },
  { k: 'license', label: 'Lisans & Abonelik', desc: 'ADOS sürümü · plan · faturalama', icon: <><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></> },
];

function Icon({ children, className }: { children: ReactNode; className: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      {children}
    </svg>
  );
}

export default function GenelAyarlar() {
  const [tab, setTab] = useState<TabKey>('general');
  const [toast, setToast] = useState<ToastState>(null);

  const saveSettings = (section: string) => {
    setToast({ title: 'Kaydedildi', message: `${section} ayarları güncellendi · audit log'a yazıldı`, color: 'emerald' });
  };

  const cancelSettings = () => {
    setToast({ title: 'İptal', message: 'Değişiklikler kaydedilmeden bırakıldı', color: 'amber' });
  };

  return (
    <Layout activeId="audit" breadcrumb="ADOS Mimar · Genel Ayarlar">
      <div className="relative min-h-[calc(100vh-120px)]">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <Icon className="text-gray-700 dark:text-gray-300 w-4 h-4"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33" /></Icon>
            </div>
            <div>
              <h1 className="text-[19px] font-bold text-gray-900 dark:text-gray-100 leading-tight">Genel Ayarlar</h1>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">ADOS Panel yapılandırması · kurumsal kimlik · güvenlik · entegrasyonlar · abonelik</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-mono text-gray-500 dark:text-gray-500 flex items-center gap-1 px-2 py-1 bg-gray-50 dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              ADOS v4.1.0 · Enterprise · 12/50 kullanıcı
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-3 mt-4">
          <nav className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-2 space-y-0.5 h-fit sticky top-2">
            {TABS.map((item) => {
              const active = tab === item.k;
              return (
                <button key={item.k} onClick={() => setTab(item.k)} className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-2.5 transition-colors ${active ? 'bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300 border-l-2 border-violet-500' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 border-l-2 border-transparent'}`}>
                  <Icon className={`${active ? 'text-violet-700 dark:text-violet-300' : 'text-gray-500 dark:text-gray-500'} w-4 h-4 shrink-0`}>{item.icon}</Icon>
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-semibold truncate">{item.label}</p>
                    <p className={`text-[9px] text-gray-500 dark:text-gray-500 truncate ${active ? 'text-violet-600/70 dark:text-violet-400/70' : ''}`}>{item.desc}</p>
                  </div>
                </button>
              );
            })}
          </nav>

          <div className="space-y-3">
            {tab === 'general' ? <SettingsGeneral saveSettings={saveSettings} cancelSettings={cancelSettings} /> : null}
            {tab === 'account' ? <SettingsAccount saveSettings={saveSettings} cancelSettings={cancelSettings} setToast={setToast} /> : null}
            {tab === 'appearance' ? <SettingsAppearance saveSettings={saveSettings} cancelSettings={cancelSettings} /> : null}
            {tab === 'notifications' ? <SettingsNotifications saveSettings={saveSettings} cancelSettings={cancelSettings} /> : null}
            {tab === 'security' ? <SettingsSecurity saveSettings={saveSettings} cancelSettings={cancelSettings} setToast={setToast} /> : null}
            {tab === 'audit' ? <SettingsAudit saveSettings={saveSettings} cancelSettings={cancelSettings} setToast={setToast} /> : null}
            {tab === 'backup' ? <SettingsBackup saveSettings={saveSettings} cancelSettings={cancelSettings} setToast={setToast} /> : null}
            {tab === 'license' ? <SettingsLicense saveSettings={saveSettings} cancelSettings={cancelSettings} setToast={setToast} /> : null}
          </div>
        </div>

        {toast ? <Toast toast={toast} onClose={() => setToast(null)} /> : null}
      </div>
    </Layout>
  );
}

function SettingsCard({ title, desc, section, saveSettings, cancelSettings, children }: { title: string; desc?: string; section: string; saveSettings: (section: string) => void; cancelSettings: () => void; children: ReactNode }) {
  return (
    <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-gray-100 dark:border-gray-700/40">
        <h3 className="text-[13px] font-bold text-gray-900 dark:text-gray-100">{title}</h3>
        {desc ? <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{desc}</p> : null}
      </div>
      <div className="p-4">{children}</div>
      <div className="px-4 py-2.5 border-t border-gray-100 dark:border-gray-700/40 bg-gray-50 dark:bg-[#17181f] flex items-center justify-end gap-2">
        <button type="button" onClick={cancelSettings} className="px-3 py-1.5 text-[10px] font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">İptal</button>
        <button type="button" onClick={() => saveSettings(section)} className="flex items-center gap-1 px-3 py-1.5 text-[10px] font-semibold bg-violet-600 hover:bg-violet-700 text-white rounded-md">
          <Icon className="w-3 h-3"><polyline points="20 6 9 17 4 12" /></Icon>
          Kaydet
        </button>
      </div>
    </div>
  );
}

function SettingsGeneral({ saveSettings, cancelSettings }: SettingsSectionProps) {
  return (
    <>
      <SettingsCard title="Şirket Bilgileri" desc="Tüm resmi evrakta ve faturada görünen kurumsal bilgiler" section="kurumsal" saveSettings={saveSettings} cancelSettings={cancelSettings}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="md:col-span-2"><Field label="Şirket Tam Adı"><input defaultValue="Arma Digital Pazarlama ve Reklamcılık A.Ş." className={inputClass()} /></Field></div>
          <Field label="Kısa Ad (Marka)"><input defaultValue="Arma Digital" className={inputClass()} /></Field>
          <Field label="Web Adresi"><input defaultValue="armadigital.com" className={`${inputClass()} font-mono`} /></Field>
          <Field label="Vergi Numarası"><input defaultValue="1234567890" className={`${inputClass()} font-mono`} /></Field>
          <Field label="Vergi Dairesi"><input defaultValue="Beşiktaş" className={inputClass()} /></Field>
          <div className="md:col-span-2"><Field label="Adres"><textarea rows={2} defaultValue="Levent Mah. Büyükdere Cad. No:201 Şişli/İstanbul" className={`${inputClass()} resize-none`} /></Field></div>
          <Field label="Telefon"><input defaultValue="+90 212 555 00 00" className={`${inputClass()} font-mono`} /></Field>
          <Field label="Kurumsal E-Posta"><input defaultValue="info@armadigital.com" className={`${inputClass()} font-mono`} /></Field>
        </div>
      </SettingsCard>

      <SettingsCard title="Marka Görselleri" desc="Logo · favicon · e-posta şablon görselleri" section="markaGorselleri" saveSettings={saveSettings} cancelSettings={cancelSettings}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <BrandAsset title="ADOS Logo" button="Logo Değiştir">
            <div className="flex items-center">
              <span className="bg-[#2D3748] text-white font-bold text-[22px] px-3 py-1.5">A</span>
              <span className="bg-[#4A5568] text-white font-bold text-[22px] px-3 py-1.5">D</span>
              <span className="bg-[#2D3748] text-white font-bold text-[22px] px-3 py-1.5">O</span>
              <span className="bg-[#4A5568] text-white font-bold text-[22px] px-3 py-1.5">S</span>
            </div>
          </BrandAsset>
          <BrandAsset title="Favicon" button="Favicon Yükle" light>
            <div className="w-10 h-10 bg-[#2D3748] rounded text-white flex items-center justify-center font-bold text-[16px]">A</div>
          </BrandAsset>
          <div>
            <label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Marka Rengi</label>
            <div className="flex items-center gap-2 p-3 bg-gray-100 dark:bg-[#17181f] rounded-lg mb-2 min-h-[80px]">
              <div className="w-10 h-10 bg-[#2D3748] rounded"></div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-mono font-semibold text-gray-900 dark:text-gray-100">#2D3748</p>
                <p className="text-[9px] text-gray-500 dark:text-gray-500">Ana marka rengi</p>
              </div>
            </div>
            <input defaultValue="#2D3748" className="w-full px-2 py-1.5 text-[11px] bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono focus:outline-none focus:border-violet-500" />
          </div>
        </div>
      </SettingsCard>
    </>
  );
}

function SettingsAccount({ saveSettings, cancelSettings, setToast }: SettingsSectionProps & ToastProps) {
  return (
    <>
      <SettingsCard title="Profil Bilgileri" desc="ADOS sisteminde görünen kişisel bilgiler" section="profil" saveSettings={saveSettings} cancelSettings={cancelSettings}>
        <div className="flex items-start gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-violet-600 text-white text-[22px] font-bold flex items-center justify-center shrink-0">OA</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <p className="text-[13px] font-bold text-gray-900 dark:text-gray-100">Osman Atasoy</p>
              <span className="text-[9px] font-bold px-1.5 py-0.5 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded">GENEL MÜDÜR</span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded">ADOS MİMARI</span>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">Çift rol · tüm sistem erişimi · CEO onay yetkisi</p>
            <button type="button" onClick={() => setToast({ title: 'Avatar Değiştir', message: 'Avatar yükleme alanı açılacak', color: 'violet' })} className="mt-2 text-[10px] font-semibold text-violet-700 dark:text-violet-300 hover:underline">Avatar Değiştir</button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Ad"><input defaultValue="Osman" className={inputClass()} /></Field>
          <Field label="Soyad"><input defaultValue="Atasoy" className={inputClass()} /></Field>
          <Field label="E-Posta"><input defaultValue="osman.atasoy@armadigital.com" className={`${inputClass()} font-mono`} /></Field>
          <Field label="Telefon"><input defaultValue="+90 532 555 00 00" className={`${inputClass()} font-mono`} /></Field>
          <Field label="Unvan"><input defaultValue="Genel Müdür · ADOS Mimarı" className={inputClass()} /></Field>
          <Field label="ADOS Kullanıcı ID"><input defaultValue="osman.atasoy" disabled className="w-full px-3 py-2 text-[12px] bg-gray-50 dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-500 dark:text-gray-400 font-mono" /></Field>
        </div>
      </SettingsCard>

      <SettingsCard title="Şifre Değiştir" desc="Son değişiklik: 2 ay önce · güçlü şifre zorunlu" section="sifre" saveSettings={saveSettings} cancelSettings={cancelSettings}>
        <div className="space-y-3">
          <Field label="Mevcut Şifre"><input type="password" placeholder="••••••••" className={`${inputClass()} font-mono`} /></Field>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Yeni Şifre"><input type="password" className={`${inputClass()} font-mono`} /></Field>
            <Field label="Yeni Şifre (Tekrar)"><input type="password" className={`${inputClass()} font-mono`} /></Field>
          </div>
          <div className="flex items-center gap-2 text-[9px] text-gray-500 dark:text-gray-500 flex-wrap">
            {['Min. 12 karakter', 'Büyük harf', 'Rakam', 'Özel karakter'].map((item) => <span key={item} className="flex items-center gap-1"><Icon className="text-emerald-500 w-2.5 h-2.5"><polyline points="20 6 9 17 4 12" /></Icon>{item}</span>)}
          </div>
        </div>
      </SettingsCard>

      <SettingsCard title="İki Faktörlü Kimlik Doğrulama (2FA)" desc="Hesabınızı ekstra güvenlik katmanıyla koruyun" section="2FA" saveSettings={saveSettings} cancelSettings={cancelSettings}>
        <div className="flex items-start gap-3 p-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-md">
          <Icon className="text-emerald-600 dark:text-emerald-400 w-5 h-5 shrink-0"><polyline points="20 6 9 17 4 12" /></Icon>
          <div><p className="text-[12px] font-bold text-emerald-900 dark:text-emerald-100">2FA aktif</p><p className="text-[10px] text-emerald-700 dark:text-emerald-300">Son doğrulama: bugün 09:12 · Authenticator app bağlı</p></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-3">
          {[{ k: 'totp', label: 'Authenticator App', active: true }, { k: 'sms', label: 'SMS Yedek', active: false }, { k: 'hw', label: 'Güvenlik Anahtarı', active: false }].map((method) => (
            <div key={method.k} className="p-2.5 bg-gray-50 dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md">
              <p className="text-[11px] font-bold text-gray-900 dark:text-gray-100">{method.label}</p>
              <p className={`text-[9px] font-semibold ${method.active ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'}`}>{method.active ? 'Aktif' : 'Pasif'}</p>
            </div>
          ))}
        </div>
      </SettingsCard>
    </>
  );
}

function SettingsAppearance({ saveSettings, cancelSettings }: SettingsSectionProps) {
  return (
    <>
      <SettingsCard title="Tema" desc="Panelin görsel teması · sistem ayarını takip edebilir" section="tema" saveSettings={saveSettings} cancelSettings={cancelSettings}>
        <div className="grid grid-cols-3 gap-3">
          <ThemeOption name="theme" value="light" label="Açık" desc="Aydınlık ortam için" preview="light" />
          <ThemeOption name="theme" value="dark" label="Koyu" desc="Göze kolay · default" preview="dark" checked />
          <ThemeOption name="theme" value="system" label="Sistem" desc="İşletim sistemi takibi" preview="system" />
        </div>
      </SettingsCard>

      <SettingsCard title="Dil & Bölge" desc="Arayüz dili · zaman dilimi · tarih formatı" section="dilBölge" saveSettings={saveSettings} cancelSettings={cancelSettings}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <SelectField label="Arayüz Dili" options={['Türkçe (TR)', 'English (EN)']} />
          <SelectField label="Zaman Dilimi" options={['Europe/Istanbul (UTC+3)', 'Europe/London (UTC+0)', 'America/New_York (UTC-5)']} />
          <SelectField label="Para Birimi" options={['TRY · Türk Lirası (₺)', 'USD · Amerikan Doları ($)', 'EUR · Euro (€)']} />
          <SelectField label="Tarih Formatı" options={['DD.MM.YYYY (23.04.2026)', 'MM/DD/YYYY (04/23/2026)', 'YYYY-MM-DD (2026-04-23)']} />
          <SelectField label="Sayı Formatı" options={['1.234,56 (Avrupa)', '1,234.56 (US)']} />
          <SelectField label="Haftanın İlk Günü" options={['Pazartesi', 'Pazar']} />
        </div>
      </SettingsCard>

      <SettingsCard title="Yoğunluk & Düzen" desc="Bilgi yoğunluğu · kart boyutu · sidebar davranışı" section="yoğunluk" saveSettings={saveSettings} cancelSettings={cancelSettings}>
        <div className="grid grid-cols-3 gap-2">
          <RadioTile name="density" value="compact" label="Kompakt" desc="Daha fazla bilgi" />
          <RadioTile name="density" value="default" label="Standart" desc="Dengeli · default" checked />
          <RadioTile name="density" value="comfortable" label="Rahat" desc="Geniş aralıklar" />
        </div>
        <div className="mt-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" defaultChecked className="rounded border-gray-300 text-violet-600 focus:ring-violet-500" />
            <span className="text-[11px] text-gray-700 dark:text-gray-300">Sidebar her sayfada açık kalsın</span>
          </label>
        </div>
      </SettingsCard>
    </>
  );
}

function SettingsNotifications({ saveSettings, cancelSettings }: SettingsSectionProps) {
  const events = [
    { label: 'Onay Bekleyen', desc: 'Onayıma düşen yeni talep', email: true, slack: true, push: true, sms: false },
    { label: 'Bütçe Uyarısı', desc: 'Reklam bütçesi %80 doldu', email: true, slack: true, push: true, sms: true },
    { label: 'Sözleşme İmzalandı', desc: "Yeni sözleşme ADOS'a aktarıldı", email: true, slack: true, push: false, sms: false },
    { label: 'Aylık SEO Raporu', desc: 'Yeni rapor üretildi', email: true, slack: false, push: false, sms: false },
    { label: 'Sistem Hatası', desc: 'Kritik hata / entegrasyon koptu', email: true, slack: true, push: true, sms: true },
    { label: 'AI Maliyet Eşiği', desc: 'Günlük AI maliyet limiti %90', email: true, slack: true, push: false, sms: false },
    { label: 'Yeni Lead', desc: "CRM'e yeni müşteri adayı düştü", email: false, slack: true, push: true, sms: false },
    { label: 'Kritik Audit Olayı', desc: 'Yetkisiz erişim denemesi / MFA bypass', email: true, slack: true, push: true, sms: true },
  ];

  return (
    <>
      <SettingsCard title="Kanal Ayarları" desc="Her olay için hangi kanaldan bildirim almak istediğinizi seçin" section="bildirimKanallari" saveSettings={saveSettings} cancelSettings={cancelSettings}>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700/40">
                <th className="text-left pb-2 font-semibold text-gray-600 dark:text-gray-400">Olay</th>
                <th className="text-center pb-2 font-semibold text-gray-600 dark:text-gray-400 w-16">E-posta</th>
                <th className="text-center pb-2 font-semibold text-gray-600 dark:text-gray-400 w-16">Slack</th>
                <th className="text-center pb-2 font-semibold text-gray-600 dark:text-gray-400 w-16">Push</th>
                <th className="text-center pb-2 font-semibold text-gray-600 dark:text-gray-400 w-16">SMS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/40">
              {events.map((event) => <NotificationRow key={event.label} event={event} />)}
            </tbody>
          </table>
        </div>
      </SettingsCard>

      <SettingsCard title="Sessize Al (Do Not Disturb)" desc="Belirli saatlerde bildirim almamak için" section="sessizeAl" saveSettings={saveSettings} cancelSettings={cancelSettings}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded border-gray-300 text-violet-600 focus:ring-violet-500" />
              <span className="text-[12px] font-semibold text-gray-900 dark:text-gray-100">Gece modu aktif</span>
              <span className="text-[10px] text-gray-500 dark:text-gray-500">(acil bildirimler hariç)</span>
            </label>
          </div>
          <Field label="Başlangıç"><input type="time" defaultValue="22:00" className={`${inputClass()} font-mono`} /></Field>
          <Field label="Bitiş"><input type="time" defaultValue="07:00" className={`${inputClass()} font-mono`} /></Field>
          <SelectField label="Hafta Sonu" options={['Sadece kritik', 'Tümü aktif', 'Hiçbiri']} />
        </div>
      </SettingsCard>
    </>
  );
}

function SettingsSecurity({ saveSettings, cancelSettings, setToast }: SettingsSectionProps & ToastProps) {
  return (
    <>
      <SettingsCard title="MFA Politikası" desc="Hangi rollerin 2FA kullanması zorunlu olsun?" section="mfaPolitikasi" saveSettings={saveSettings} cancelSettings={cancelSettings}>
        <div className="space-y-2">
          {[{ role: 'admin', label: 'Admin', forced: true }, { role: 'manager', label: 'Manager', forced: true }, { role: 'lead', label: 'Lead', forced: false }, { role: 'analyst', label: 'Analyst', forced: false }, { role: 'viewer', label: 'Viewer', forced: false }].map((role) => (
            <div key={role.role} className="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-[#17181f] rounded-md">
              <div><p className="text-[12px] font-semibold text-gray-900 dark:text-gray-100">{role.label}</p><p className="text-[9px] text-gray-500 dark:text-gray-500 font-mono">role: {role.role}</p></div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked={role.forced} className="rounded border-gray-300 text-violet-600 focus:ring-violet-500" />
                <span className={`text-[10px] font-semibold ${role.forced ? 'text-emerald-700 dark:text-emerald-300' : 'text-gray-500'}`}>{role.forced ? 'Zorunlu' : 'İsteğe Bağlı'}</span>
              </label>
            </div>
          ))}
        </div>
      </SettingsCard>

      <SettingsCard title="Oturum Yönetimi" desc="Oturum süreleri · güvenlik kontrolleri" section="oturum" saveSettings={saveSettings} cancelSettings={cancelSettings}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <SelectField label="Oturum Süresi" options={['30 dakika', '1 saat', '4 saat', '8 saat', '24 saat']} defaultValue="4 saat" />
          <SelectField label="Hareketsizlik Timeout" options={['15 dakika', '30 dakika', '1 saat', 'Kapalı']} defaultValue="30 dakika" />
          <Field label="Max Eşzamanlı Oturum"><input type="number" defaultValue="3" className={`${inputClass()} font-mono`} /></Field>
          <Field label="Hatalı Giriş Limiti"><input type="number" defaultValue="5" className={`${inputClass()} font-mono`} /><p className="text-[9px] text-gray-400 mt-0.5">Aşılırsa 15 dk kilit</p></Field>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/40">
          <p className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wider">Aktif Oturumlar (3)</p>
          <div className="space-y-1.5">
            {[
              { dev: 'Chrome · macOS', loc: 'İstanbul, TR', ip: '85.105.***.42', time: 'Şu an', current: true },
              { dev: 'Safari · iOS', loc: 'İstanbul, TR', ip: '85.105.***.42', time: '2sa önce' },
              { dev: 'Edge · Windows', loc: 'Ankara, TR', ip: '78.189.***.12', time: '1g önce' },
            ].map((session) => (
              <div key={`${session.dev}-${session.time}`} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-[#17181f] rounded">
                <Icon className="text-gray-500 w-3.5 h-3.5"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /></Icon>
                <div className="flex-1 min-w-0"><p className="text-[11px] font-semibold text-gray-900 dark:text-gray-100">{session.dev}{session.current ? <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-normal"> (bu oturum)</span> : null}</p><p className="text-[9px] text-gray-500 dark:text-gray-500 font-mono">{session.loc} · {session.ip} · {session.time}</p></div>
                {!session.current ? <button type="button" onClick={() => setToast({ title: 'Oturum Sonlandırıldı', message: `${session.dev} oturumu kapatıldı`, color: 'rose' })} className="text-[9px] font-semibold text-rose-700 dark:text-rose-400 hover:underline">Sonlandır</button> : null}
              </div>
            ))}
          </div>
        </div>
      </SettingsCard>

      <SettingsCard title="IP Kısıtlama" desc="Belirli IP'lerden erişime izin ver / engelle" section="ipKısıtlama" saveSettings={saveSettings} cancelSettings={cancelSettings}>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <RadioTile name="ipMode" value="off" label="Kapalı" desc="Tüm IP'ler erişebilir" checked />
            <RadioTile name="ipMode" value="whitelist" label="Whitelist" desc="Sadece listeli IP'ler" />
          </div>
          <Field label="İzinli IP Listesi">
            <div className="flex flex-wrap gap-1.5 p-2 bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md min-h-[42px]">
              <span className="text-[10px] font-mono font-semibold px-2 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 rounded">85.105.0.0/16 (Ofis)</span>
              <span className="text-[10px] font-mono font-semibold px-2 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 rounded">78.189.42.12 (VPN)</span>
              <button type="button" onClick={() => setToast({ title: 'IP Ekle', message: 'Yeni IP kuralı eklenecek', color: 'violet' })} className="text-[10px] font-semibold px-2 py-1 text-violet-700 dark:text-violet-300 hover:bg-violet-50 dark:hover:bg-violet-500/10 border border-dashed border-violet-300 dark:border-violet-500/40 rounded">+ IP Ekle</button>
            </div>
          </Field>
        </div>
      </SettingsCard>
    </>
  );
}

function SettingsAudit({ saveSettings, cancelSettings, setToast }: SettingsSectionProps & ToastProps) {
  const logs = [
    { time: '23:18:42', tag: 'APPROVAL', action: 'Onaylandı: Google Ads kampanya ₺50K', user: 'Osman Atasoy', ip: '85.105.***.42', color: 'emerald' },
    { time: '23:18:38', tag: 'AI', action: 'Claude 4.7 çağrısı · 1.2K token', user: 'AI Router', ip: 'internal', color: 'violet' },
    { time: '23:18:35', tag: 'JSON', action: 'Operasyon_Ekip.JSON güncellendi', user: 'Osman Atasoy', ip: '85.105.***.42', color: 'indigo' },
    { time: '23:15:28', tag: 'AUTH', action: 'Başarılı giriş · 2FA doğrulandı', user: 'Berke Yılmaz', ip: '91.233.***.18', color: 'amber' },
    { time: '23:10:04', tag: 'INTEGR', action: 'Google Ads API · 142 campaign sync', user: 'AdsAgent', ip: 'internal', color: 'sky' },
  ] as const;

  return (
    <>
      <SettingsCard title="Log Yapılandırması" desc="Sistem genelinde audit log davranışı · ADOS her işlemi kaydeder" section="logYapilandirma" saveSettings={saveSettings} cancelSettings={cancelSettings}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <SelectField label="Log Seviyesi" options={['DEBUG (tüm detaylar · geliştirme)', 'INFO (standart · production)', 'WARN (yalnızca uyarılar)', 'ERROR (yalnızca hatalar)']} defaultValue="INFO (standart · production)" />
          <SelectField label="Saklama Süresi" options={['30 gün', '90 gün', '180 gün', '365 gün (1 yıl)', '1095 gün (3 yıl · KVKK önerilen)']} defaultValue="365 gün (1 yıl)" />
          <div className="md:col-span-2"><Field label="Audit Endpoint"><input defaultValue="timescaledb://audit_stream" className={`${inputClass()} font-mono`} /><p className="text-[9px] text-gray-500 dark:text-gray-500 mt-1">Tüm ADOS olayları bu veritabanına yazılır · time-series optimizasyonu</p></Field></div>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/40 grid grid-cols-3 gap-2">
          <AuditMetric title="Toplam Kayıt" value="2.4M" color="violet" />
          <AuditMetric title="Son 24 Saat" value="12.8K" color="sky" />
          <AuditMetric title="DB Boyutu" value="48.2GB" color="emerald" />
        </div>
      </SettingsCard>

      <SettingsCard title="Son Log Olayları" desc="Canlı event stream · son 5 kayıt · tam erişim için aşağıdaki butonu kullanın" section="eventStream" saveSettings={saveSettings} cancelSettings={cancelSettings}>
        <div className="space-y-1.5">
          {logs.map((log) => (
            <div key={`${log.time}-${log.tag}`} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-[#17181f] rounded text-[10px]">
              <span className="font-mono text-gray-400 dark:text-gray-500 shrink-0 w-16">{log.time}</span>
              <span className={`text-[9px] font-bold font-mono px-1.5 py-0.5 bg-${log.color}-100 dark:bg-${log.color}-900/30 text-${log.color}-700 dark:text-${log.color}-300 rounded shrink-0 w-20 text-center`}>{log.tag}</span>
              <span className="flex-1 text-gray-700 dark:text-gray-300 min-w-0 truncate">{log.action}</span>
              <span className="text-[9px] font-mono text-gray-500 dark:text-gray-500 shrink-0 hidden md:inline">{log.user}</span>
              <span className="text-[9px] font-mono text-gray-400 dark:text-gray-500 shrink-0 hidden lg:inline">{log.ip}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <button type="button" onClick={() => setToast({ title: 'Canlı Stream', message: 'TimescaleDB real-time stream açılıyor', color: 'violet' })} className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-semibold bg-violet-600 hover:bg-violet-700 text-white rounded-md">
            <Icon className="w-3 h-3"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></Icon>Canlı Stream'i Aç
          </button>
          <button type="button" onClick={() => setToast({ title: 'Export', message: 'Son 30 gün audit log CSV olarak indirilecek', color: 'sky' })} className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-semibold bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-[#23242c]">
            <Icon className="w-3 h-3"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></Icon>Log Export (CSV)
          </button>
        </div>
      </SettingsCard>
    </>
  );
}

function SettingsBackup({ saveSettings, cancelSettings, setToast }: SettingsSectionProps & ToastProps) {
  const backups = [
    { date: '23 Nis 2026, 03:00', size: '2.4GB', type: 'auto' },
    { date: '22 Nis 2026, 03:00', size: '2.4GB', type: 'auto' },
    { date: '21 Nis 2026, 03:00', size: '2.3GB', type: 'auto' },
    { date: '20 Nis 2026, 18:42', size: '2.3GB', type: 'manual' },
    { date: '20 Nis 2026, 03:00', size: '2.3GB', type: 'auto' },
  ];

  return (
    <>
      <SettingsCard title="Otomatik Yedekleme" desc="ADOS verilerinin otomatik yedeklenmesi · her şey dahil (JSON'lar, promptlar, konfigürasyon)" section="otomatikYedek" saveSettings={saveSettings} cancelSettings={cancelSettings}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <SelectField label="Yedekleme Sıklığı" options={['Saatlik', 'Günlük (03:00)', 'Haftalık']} defaultValue="Günlük (03:00)" />
          <SelectField label="Yedek Saklama" options={['7 gün', '30 gün', '90 gün', '365 gün']} defaultValue="30 gün" />
          <SelectField label="Depolama Konumu" options={['AWS S3 (eu-central-1)', 'Azure Blob Storage', 'Google Cloud Storage', 'Yerel (on-premise)']} />
          <SelectField label="Şifreleme" options={['AES-256 (önerilen)', 'AES-128']} />
        </div>
      </SettingsCard>

      <SettingsCard title="Son Yedekler" desc="Son 5 yedek kaydı · indirme veya geri yükleme" section="sonYedekler" saveSettings={saveSettings} cancelSettings={cancelSettings}>
        <div className="space-y-1.5">
          {backups.map((backup) => (
            <div key={backup.date} className="flex items-center gap-2.5 p-2.5 bg-gray-50 dark:bg-[#17181f] rounded-md">
              <Icon className="text-emerald-600 dark:text-emerald-400 w-4 h-4 shrink-0"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /></Icon>
              <div className="flex-1 min-w-0"><p className="text-[11px] font-semibold text-gray-900 dark:text-gray-100 font-mono">{backup.date}</p><p className="text-[9px] text-gray-500 dark:text-gray-500">{backup.size} · {backup.type === 'auto' ? 'Otomatik' : 'Manuel'}</p></div>
              <span className="text-[9px] font-bold px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded shrink-0">Başarılı</span>
              <button type="button" onClick={() => setToast({ title: 'İndir', message: `${backup.date} yedeği indirilecek`, color: 'sky' })} className="text-[9px] font-semibold text-sky-700 dark:text-sky-300 hover:underline shrink-0">İndir</button>
              <button type="button" onClick={() => setToast({ title: 'Geri Yükleme', message: 'Geri yükleme için CEO onayı gerekir', color: 'amber' })} className="text-[9px] font-semibold text-amber-700 dark:text-amber-400 hover:underline shrink-0">Geri Yükle</button>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <button type="button" onClick={() => setToast({ title: 'Yedekleme Başladı', message: 'Manuel yedekleme tetiklendi · tahmini 4-6 dakika', color: 'violet' })} className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-semibold bg-violet-600 hover:bg-violet-700 text-white rounded-md">
            <Icon className="w-3 h-3"><polygon points="5 3 19 12 5 21 5 3" /></Icon>Şimdi Yedek Al
          </button>
          <button type="button" onClick={() => setToast({ title: 'Geri Yükleme', message: 'Geri yükleme için yedek seçin · onay gerekir', color: 'amber' })} className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-semibold bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-md">
            <Icon className="w-3 h-3"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" /></Icon>Geri Yükleme
          </button>
        </div>
      </SettingsCard>
    </>
  );
}

function SettingsLicense({ saveSettings, cancelSettings, setToast }: SettingsSectionProps & ToastProps) {
  return (
    <>
      <SettingsCard title="ADOS Lisans Bilgisi" desc="Mevcut abonelik · kullanım · yenileme" section="lisansBilgi" saveSettings={saveSettings} cancelSettings={cancelSettings}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-violet-50 to-pink-50 dark:from-violet-500/10 dark:to-pink-500/10 border border-violet-200 dark:border-violet-500/30 rounded-lg">
            <p className="text-[9px] font-semibold text-violet-700 dark:text-violet-300 uppercase tracking-wider mb-1">Mevcut Plan</p>
            <div className="flex items-center gap-2 mb-1"><p className="text-[18px] font-bold text-gray-900 dark:text-gray-100">Enterprise</p><span className="text-[9px] font-bold px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded">PREMIUM</span></div>
            <p className="text-[10px] text-gray-600 dark:text-gray-400">50 kullanıcı · sınırsız JSON · sınırsız integration</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-[#17181f] rounded-lg">
            <p className="text-[9px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">Yıllık Ücret</p>
            <p className="text-[22px] font-bold text-gray-900 dark:text-gray-100 font-mono mb-0.5">₺ 480.000</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-500">Peşin · KDV hariç · sonraki yenileme: 15 Oca 2027</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <LicenseMetric label="Kullanıcı" value="12" suffix="/50" />
          <LicenseMetric label="JSON" value="15" suffix="/∞" />
          <LicenseMetric label="Integration" value="27" suffix="/∞" />
          <LicenseMetric label="Aylık AI" value="₺148K" suffix="/₺295K" />
        </div>
      </SettingsCard>

      <SettingsCard title="Aktif Modüller" desc="Enterprise planına dahil tüm ADOS modülleri" section="aktifModuller" saveSettings={saveSettings} cancelSettings={cancelSettings}>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {[
            { label: 'Orchestrator Core', desc: 'Master.JSON + automation' },
            { label: 'JSON Ajanları', desc: 'Sınırsız JSON · versiyonlu' },
            { label: 'Prompt Kütüphanesi', desc: 'Sınırsız prompt · test' },
            { label: 'AI Yönetimi', desc: 'Claude + GPT + Gemini + multimedia' },
            { label: 'Entegrasyonlar', desc: 'Sınırsız API · webhook' },
            { label: 'Audit Log', desc: 'TimescaleDB · 1 yıl retention' },
            { label: 'Birim Panoları', desc: 'Satış + Pazarlama + Finans + Ads' },
            { label: 'Mobil Panel', desc: 'iOS + Android native' },
            { label: 'ADOS AI SEO', desc: 'Lokal/Ulusal/Global · premium', premium: true },
          ].map((module) => (
            <div key={module.label} className="p-2.5 bg-white dark:bg-[#17181f] border border-emerald-200 dark:border-emerald-500/30 rounded-md">
              <div className="flex items-center gap-2 mb-1">
                <Icon className="text-emerald-600 w-3 h-3 shrink-0"><polyline points="20 6 9 17 4 12" /></Icon>
                <p className="text-[11px] font-bold text-gray-900 dark:text-gray-100 truncate">{module.label}</p>
                {module.premium ? <span className="text-[8px] font-bold px-1 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded">★</span> : null}
              </div>
              <p className="text-[9px] text-gray-500 dark:text-gray-500">{module.desc}</p>
            </div>
          ))}
        </div>
      </SettingsCard>

      <SettingsCard title="Faturalama" desc="Fatura iletişim · ödeme yöntemi · geçmiş faturalar" section="faturalama" saveSettings={saveSettings} cancelSettings={cancelSettings}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <Field label="Fatura E-Postası"><input defaultValue="finance@armadigital.com" className={`${inputClass()} font-mono`} /></Field>
          <SelectField label="Ödeme Yöntemi" options={['Havale / EFT', 'Kredi Kartı', 'Çek']} />
        </div>
        <div className="pt-3 border-t border-gray-100 dark:border-gray-700/40">
          <p className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wider">Son Faturalar</p>
          <div className="space-y-1.5">
            {[
              { date: '15 Oca 2026', amount: '₺480.000', no: 'ADOS-2026-001' },
              { date: '15 Oca 2025', amount: '₺420.000', no: 'ADOS-2025-001' },
              { date: '15 Oca 2024', amount: '₺360.000', no: 'ADOS-2024-001' },
            ].map((invoice) => (
              <div key={invoice.no} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-[#17181f] rounded text-[11px]">
                <span className="font-mono text-gray-500 dark:text-gray-500 shrink-0 w-24">{invoice.date}</span>
                <span className="font-mono text-gray-400 dark:text-gray-500 shrink-0 hidden md:inline">{invoice.no}</span>
                <span className="flex-1 font-semibold text-gray-900 dark:text-gray-100 text-right font-mono">{invoice.amount}</span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded shrink-0">Ödendi</span>
                <button type="button" onClick={() => setToast({ title: 'PDF', message: `${invoice.no} faturası açılacak`, color: 'sky' })} className="text-[9px] font-semibold text-sky-700 dark:text-sky-300 hover:underline shrink-0">PDF</button>
              </div>
            ))}
          </div>
        </div>
      </SettingsCard>
    </>
  );
}

type SettingsSectionProps = {
  saveSettings: (section: string) => void;
  cancelSettings: () => void;
};

type ToastProps = {
  setToast: (toast: ToastState) => void;
};

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">{label}</label>{children}</div>;
}

function SelectField({ label, options, defaultValue }: { label: string; options: string[]; defaultValue?: string }) {
  return (
    <Field label={label}>
      <select defaultValue={defaultValue || options[0]} className={inputClass()}>
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </Field>
  );
}

function RadioTile({ name, value, label, desc, checked }: { name: string; value: string; label: string; desc: string; checked?: boolean }) {
  return (
    <label className="cursor-pointer">
      <input type="radio" name={name} value={value} className="sr-only peer" defaultChecked={checked} />
      <div className="p-3 bg-white dark:bg-[#17181f] border-2 border-gray-200 dark:border-gray-700 peer-checked:border-violet-500 peer-checked:bg-violet-50 dark:peer-checked:bg-violet-500/10 rounded-lg text-center">
        <p className="text-[11px] font-bold text-gray-900 dark:text-gray-100">{label}</p>
        <p className="text-[9px] text-gray-500 dark:text-gray-500">{desc}</p>
      </div>
    </label>
  );
}

function ThemeOption({ name, value, label, desc, preview, checked }: { name: string; value: string; label: string; desc: string; preview: 'light' | 'dark' | 'system'; checked?: boolean }) {
  const shell = preview === 'light' ? 'bg-white border-gray-300' : preview === 'dark' ? 'bg-[#0d0e13] border-violet-500' : 'bg-gradient-to-br from-white to-[#0d0e13] border-gray-300';
  const box = preview === 'light' ? 'bg-gray-100' : preview === 'dark' ? 'bg-[#17181f]' : 'bg-gradient-to-br from-gray-100 to-[#17181f]';
  const text = preview === 'dark' ? 'text-gray-100' : 'text-gray-900';
  const sub = preview === 'dark' ? 'text-gray-400' : 'text-gray-500';
  return (
    <label className="cursor-pointer">
      <input type="radio" name={name} value={value} className="sr-only peer" defaultChecked={checked} />
      <div className={`${shell} border-2 peer-checked:border-violet-500 rounded-lg p-3 transition-all`}>
        <div className={`h-16 rounded mb-2 ${box}`}></div>
        <p className={`text-[12px] font-bold ${text}`}>{label}</p>
        <p className={`text-[9px] ${sub}`}>{desc}</p>
      </div>
    </label>
  );
}

function BrandAsset({ title, button, light, children }: { title: string; button: string; light?: boolean; children: ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">{title}</label>
      <div className={`flex items-center justify-center p-4 ${light ? 'bg-gray-100 dark:bg-[#17181f]' : 'bg-gray-900'} rounded-lg mb-2 min-h-[80px]`}>
        {children}
      </div>
      <button type="button" className="w-full p-1.5 border border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 text-[10px] font-semibold rounded-md hover:bg-gray-50 dark:hover:bg-white/5">{button}</button>
    </div>
  );
}

function NotificationRow({ event }: { event: { label: string; desc: string; email: boolean; slack: boolean; push: boolean; sms: boolean } }) {
  return (
    <tr>
      <td className="py-2.5"><p className="font-semibold text-gray-900 dark:text-gray-100">{event.label}</p><p className="text-[9px] text-gray-500 dark:text-gray-500">{event.desc}</p></td>
      <td className="text-center"><input type="checkbox" defaultChecked={event.email} className="rounded border-gray-300 text-violet-600 focus:ring-violet-500" /></td>
      <td className="text-center"><input type="checkbox" defaultChecked={event.slack} className="rounded border-gray-300 text-violet-600 focus:ring-violet-500" /></td>
      <td className="text-center"><input type="checkbox" defaultChecked={event.push} className="rounded border-gray-300 text-violet-600 focus:ring-violet-500" /></td>
      <td className="text-center"><input type="checkbox" defaultChecked={event.sms} className="rounded border-gray-300 text-violet-600 focus:ring-violet-500" /></td>
    </tr>
  );
}

function AuditMetric({ title, value, color }: { title: string; value: string; color: 'violet' | 'sky' | 'emerald' }) {
  return <div className={`p-2.5 bg-${color}-50 dark:bg-${color}-500/10 rounded-md`}><p className={`text-[9px] font-semibold text-${color}-700 dark:text-${color}-300 uppercase tracking-wider`}>{title}</p><p className={`text-[16px] font-bold text-${color}-900 dark:text-${color}-100 font-mono`}>{value}</p></div>;
}

function LicenseMetric({ label, value, suffix }: { label: string; value: string; suffix: string }) {
  return <div className="p-2.5 bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md"><p className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider mb-1">{label}</p><p className="text-[14px] font-bold text-gray-900 dark:text-gray-100 font-mono">{value}<span className="text-[10px] text-gray-400">{suffix}</span></p></div>;
}

function Toast({ toast, onClose }: { toast: NonNullable<ToastState>; onClose: () => void }) {
  const color = toast.color === 'rose' ? { bg: '#e11d48', bd: '#fecdd3' } : toast.color === 'amber' ? { bg: '#d97706', bd: '#fde68a' } : toast.color === 'sky' ? { bg: '#0284c7', bd: '#bae6fd' } : toast.color === 'violet' ? { bg: '#7c3aed', bd: '#ddd6fe' } : { bg: '#059669', bd: '#a7f3d0' };
  return <div style={{ position: 'absolute', bottom: '24px', right: '24px', zIndex: 9999, minWidth: '280px', maxWidth: '400px', background: 'white', borderLeft: `4px solid ${color.bd}`, borderRadius: '10px', boxShadow: '0 8px 24px rgba(0,0,0,.15)', padding: '14px 16px', animation: 'toastSlide .3s ease-out' }}><div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}><div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: '13px', color: color.bg, marginBottom: '2px' }}>{toast.title}</div><div style={{ fontSize: '11px', color: '#6b7280' }}>{toast.message}</div></div><button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: '16px' }}>×</button></div><div style={{ position: 'absolute', bottom: 0, left: 0, height: '2px', background: color.bg, borderRadius: '0 0 10px 10px', animation: 'toastProgress 3s linear' }}></div></div>;
}

function inputClass() {
  return 'w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:border-violet-500';
}
