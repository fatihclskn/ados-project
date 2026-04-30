import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { getCustomerById, getCustomers, type CustomerResponse } from '../../../services/customerApi';

type ColorName = 'emerald' | 'amber' | 'rose' | 'sky' | 'violet' | 'indigo' | 'teal' | 'gray';

type Customer = {
  id: string;
  co: string;
  no: string;
  ct: string;
  officialTitle: string;
  phone: string;
  email: string;
  source: string;
  city: string;
  country: string;
  address: string;
  website: string;
  tp: string;
  tc: ColorName;
  sv: string[];
  dt: string;
  dc: ColorName;
  mx: string;
  sg: string;
  sc: ColorName;
  nl: string;
  nc: ColorName;
  up: string;
  raw?: CustomerResponse;
};

type DetailTab = 'general' | 'contacts' | 'services' | 'finance' | 'technical' | 'digital' | 'notes';

const DETAIL_TABS: { id: DetailTab; label: string }[] = [
  { id: 'general', label: 'Genel Bilgiler' },
  { id: 'contacts', label: 'Yetkililer' },
  { id: 'services', label: 'Hizmetler' },
  { id: 'finance', label: 'Finans' },
  { id: 'technical', label: 'Teknik Varlıklar' },
  { id: 'digital', label: 'Dijital Erişimler' },
  { id: 'notes', label: 'Notlar / Log' },
];

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

const SVCS = ['SEO', 'Web Sitesi', 'Google Ads', 'Meta Reklam', 'Sosyal Medya', 'E-Bülten', 'Domain', 'Prodüksiyon', 'Hosting', 'Marka Tescili'];
const KPIS = [
  { l: 'Toplam Kayıt', v: '245', c: 'gray' as ColorName },
  { l: 'Aktif Müşteri', v: '156', c: 'emerald' as ColorName },
  { l: 'Eksik Veri', v: '18', c: 'amber' as ColorName },
  { l: 'Satışa Uygun', v: '85', c: 'emerald' as ColorName },
  { l: 'Segmentlenmiş', v: '218', c: 'violet' as ColorName },
];
const TFS = ['Tümü', 'Aktif', 'Pasif', 'Potansiyel', 'Yeniden Pazarlama'];
const QUALITY = [
  { l: 'Doğrulandı', v: '156', p: 64, c: 'emerald' as ColorName, d: 'Satışa ve bültene hazır kayıtlar', barClr: 'bg-emerald-500' },
  { l: 'Eksik Veri', v: '18', p: 7, c: 'amber' as ColorName, d: 'Bir veya daha fazla zorunlu alan eksik', barClr: 'bg-amber-500' },
  { l: 'Kontrol Gerekli', v: '27', p: 11, c: 'rose' as ColorName, d: 'Veri doğrulaması gerekiyor', barClr: 'bg-rose-500' },
  { l: 'Pasif / Yeniden Pazarlama', v: '44', p: 18, c: 'gray' as ColorName, d: 'Re-marketing hedef kitlesi', barClr: 'bg-gray-400' },
];

function Icon({ children, className = 'w-3.5 h-3.5 shrink-0' }: { children: ReactNode; className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      {children}
    </svg>
  );
}

function Bdg({ txt, c }: { txt: string; c: ColorName }) {
  const m = CM[c] || CM.gray;
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${m.bg} ${m.t} whitespace-nowrap`}>{txt}</span>;
}

function display(value: unknown, fallback = '—') {
  const text = String(value ?? '').trim();
  return text || fallback;
}

function customerColor(status: string): ColorName {
  const normalizedStatus = status.toLocaleLowerCase('tr-TR');
  if (normalizedStatus.includes('aktif')) return 'emerald';
  if (normalizedStatus.includes('pasif')) return 'gray';
  if (normalizedStatus.includes('potansiyel')) return 'sky';
  if (normalizedStatus.includes('yeniden')) return 'amber';
  return 'violet';
}

function qualityColor(status: string): ColorName {
  const normalizedStatus = status.toLocaleLowerCase('tr-TR');
  if (normalizedStatus.includes('doğrulandı') || normalizedStatus.includes('dogrulandi')) return 'emerald';
  if (normalizedStatus.includes('eksik')) return 'amber';
  if (normalizedStatus.includes('kontrol')) return 'rose';
  return 'gray';
}

function newsletterColor(status: string): ColorName {
  const normalizedStatus = status.toLocaleLowerCase('tr-TR');
  if (normalizedStatus.includes('var') || normalizedStatus.includes('gönderildi') || normalizedStatus.includes('hazır')) return 'emerald';
  if (normalizedStatus.includes('yok') || normalizedStatus.includes('eksik') || normalizedStatus.includes('kontrol')) return 'amber';
  return 'gray';
}

function formatCustomerDate(value: unknown) {
  const textValue = String(value ?? '').trim();
  if (!textValue) return '—';

  const date = new Date(textValue);
  if (Number.isNaN(date.getTime())) return textValue;

  return new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
}

function mapCustomerResponseToCustomer(customer: CustomerResponse): Customer {
  const customerStatus = display(customer.customerStatus, 'Aktif Müşteri');
  const dataQualityStatus = display(customer.dataQualityStatus, 'Kontrol Gerekli');
  const segment = display(customer.segment);
  const newsletterPermission = display(customer.newsletterPermission, 'Kontrol Edilecek');

  return {
    id: customer.id,
    co: display(customer.brandName),
    no: display(customer.customerCode),
    ct: display(customer.contact1FullName),
    officialTitle: display(customer.officialTitle),
    phone: display(customer.companyPhone),
    email: display(customer.companyEmail),
    source: display(customer.source),
    city: display(customer.city),
    country: display(customer.country),
    address: display(customer.address),
    website: display(customer.website),
    tp: customerStatus,
    tc: customerColor(customerStatus),
    sv: Array.isArray(customer.services) ? customer.services : [],
    dt: dataQualityStatus,
    dc: qualityColor(dataQualityStatus),
    mx: dataQualityStatus === 'Doğrulandı' ? '—' : dataQualityStatus,
    sg: segment,
    sc: segment === '—' ? 'gray' : 'violet',
    nl: newsletterPermission,
    nc: newsletterColor(newsletterPermission),
    up: formatCustomerDate(customer.lastUpdatedAt ?? customer.updatedAt ?? customer.createdAt),
    raw: customer,
  };
}

function customerValue(customer: Customer, key: string, fallback = '—') {
  return display(customer.raw?.[key], fallback);
}

function customerContacts(customer: Customer) {
  return Array.from({ length: 30 }, (_, index) => {
    const number = index + 1;
    const fullName = customerValue(customer, `contact${number}FullName`);
    const phone = customerValue(customer, `contact${number}Phone`);
    const email = customerValue(customer, `contact${number}Email`);
    const title = customerValue(customer, `contact${number}Title`);

    return {
      key: `contact-${number}`,
      number,
      fullName,
      phone,
      email,
      title,
    };
  }).filter((contact) => [contact.fullName, contact.phone, contact.email, contact.title].some((value) => value !== '—'));
}

function EyeIcon() {
  return (
    <Icon>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </Icon>
  );
}

function EditIcon() {
  return (
    <Icon>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </Icon>
  );
}

function SendIcon({ className = 'w-3.5 h-3.5 shrink-0' }: { className?: string }) {
  return (
    <Icon className={className}>
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </Icon>
  );
}

function UserIcon({ className = 'w-5 h-5 text-violet-600 dark:text-violet-400' }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </Icon>
  );
}

function FileIcon() {
  return (
    <Icon>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </Icon>
  );
}

function BackIcon() {
  return (
    <Icon>
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </Icon>
  );
}

function CheckIcon({ className = 'w-3.5 h-3.5 shrink-0' }: { className?: string }) {
  return (
    <Icon className={className}>
      <polyline points="20 6 9 17 4 12" />
    </Icon>
  );
}

function PlusIcon({ className = 'w-3.5 h-3.5 shrink-0' }: { className?: string }) {
  return (
    <Icon className={className}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </Icon>
  );
}

function ClockIcon() {
  return (
    <Icon className="w-3 h-3">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </Icon>
  );
}

function AlertIcon() {
  return (
    <Icon className="w-3 h-3">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </Icon>
  );
}

function ActionButton({ title, children, extraClass = '' }: { title: string; children: ReactNode; extraClass?: string }) {
  return (
    <button title={title} className={`p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors ${extraClass}`}>
      {children}
    </button>
  );
}

function DetailField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide mb-1">{label}</label>
      <p className="text-[13px] font-medium text-gray-900 dark:text-gray-100">{children}</p>
    </div>
  );
}

function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] text-gray-400 dark:text-gray-600 uppercase tracking-wide">{label}</span>
      <span className="text-[12px] font-medium text-gray-900 dark:text-gray-100">{children}</span>
    </div>
  );
}

function ContactCard({
  initials,
  name,
  role,
  primary,
  accent,
  phone,
  email,
  date,
  note,
}: {
  initials: string;
  name: string;
  role: string;
  primary?: boolean;
  accent: 'violet' | 'sky';
  phone: string;
  email: string;
  date: string;
  note: string;
}) {
  const color = accent === 'violet'
    ? 'bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400'
    : 'bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400';

  return (
    <div className="border border-gray-200 dark:border-gray-600/50 rounded-xl p-4">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 ${color} rounded-full flex items-center justify-center shrink-0`}>
            <span className="text-[14px] font-bold">{initials}</span>
          </div>
          <div>
            <p className="text-[13px] font-bold text-gray-900 dark:text-gray-100">{name}</p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">{role}</p>
          </div>
        </div>
        {primary ? (
          <div className="flex items-center gap-2">
            <Bdg txt="Birincil Yetkili" c="emerald" />
          </div>
        ) : null}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <DetailRow label="Telefon">{phone}</DetailRow>
        <DetailRow label="E-posta">{email}</DetailRow>
        <DetailRow label="Son İletişim">{date}</DetailRow>
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] text-gray-400 dark:text-gray-600 uppercase tracking-wide">İletişim Durumu</span>
          <Bdg txt="Aktif" c="emerald" />
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-600/50">
        <p className="text-[11px] text-gray-500 dark:text-gray-400">{note}</p>
      </div>
    </div>
  );
}

function DetailTabContent({ customer, tab }: { customer: Customer; tab: DetailTab }) {
  if (tab === 'general') {
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
          <div className="space-y-5">
            <DetailField label="Marka / Firma Adı">{customer.co}</DetailField>
            <DetailField label="Resmi Ünvan">{customer.officialTitle}</DetailField>
            <DetailField label="Müşteri Numarası"><span className="font-mono text-[12px]">{customer.no}</span></DetailField>
            <div>
              <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide mb-1">Müşteri Türü</label>
              <Bdg txt={customer.tp} c={customer.tc} />
            </div>
            <DetailField label="Kaynak">{customer.source}</DetailField>
            <div>
              <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide mb-1">Segment</label>
              {customer.sg !== '—' ? <Bdg txt={customer.sg} c={customer.sc} /> : <span className="text-[12px] text-gray-400 dark:text-gray-600">—</span>}
            </div>
          </div>
          <div className="space-y-5">
            <DetailField label="Şirket Telefonu">{customer.phone}</DetailField>
            <DetailField label="Şirket WhatsApp">{customerValue(customer, 'companyWhatsapp')}</DetailField>
            <DetailField label="Şirket E-posta">{customer.email}</DetailField>
            <div>
              <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide mb-1">Web Sitesi</label>
              {customer.website !== '—' ? <a href={customer.website} className="text-[13px] text-violet-600 dark:text-violet-400 hover:underline">{customer.website}</a> : <span className="text-[13px] text-gray-400 dark:text-gray-600">—</span>}
            </div>
            <DetailField label="Şehir / Ülke">{[customer.city, customer.country].filter((value) => value !== '—').join(', ') || '—'}</DetailField>
          </div>
        </div>
        <div className="border-t border-gray-100 dark:border-gray-600/50 pt-5 mt-5 space-y-4">
          <div>
            <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide mb-1.5">Şirket Adresi</label>
            <p className="text-[13px] text-gray-700 dark:text-gray-300">{customer.address}</p>
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide mb-1.5">Pazarlama Segment Notu</label>
            <p className="text-[13px] text-gray-700 dark:text-gray-300">{customerValue(customer, 'marketingSegmentNote')}</p>
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide mb-1.5">Satışa Yönlendirme Notu</label>
            <p className="text-[13px] text-gray-700 dark:text-gray-300">{customerValue(customer, 'salesHandoverNote')}</p>
          </div>
        </div>
      </>
    );
  }

  if (tab === 'contacts') {
    const contacts = customerContacts(customer);
    return (
      <div className="space-y-4">
        {contacts.length > 0 ? contacts.map((contact) => (
          <ContactCard
            key={contact.key}
            initials={contact.fullName.split(' ').map((part) => part[0]).join('').slice(0, 2).toLocaleUpperCase('tr-TR') || String(contact.number)}
            name={contact.fullName}
            role={contact.title}
            primary={contact.number === 1}
            accent={contact.number === 1 ? 'violet' : 'sky'}
            phone={contact.phone}
            email={contact.email}
            date={customer.up}
            note={`${contact.number}. yetkili bilgisi Customers tablosundan alınmıştır.`}
          />
        )) : (
          <div className="border border-dashed border-gray-200 dark:border-gray-600/50 rounded-xl p-6 text-center text-[12px] text-gray-500 dark:text-gray-400">Kayıtlı yetkili bilgisi bulunamadı.</div>
        )}
      </div>
    );
  }

  if (tab === 'services') {
    const statuses = ['Aktif', 'Aktif', 'Yenileme Yaklaşıyor'];
    const statusColors: ColorName[] = ['emerald', 'emerald', 'amber'];
    return (
      <div className="space-y-3">
        {customer.sv.map((service, index) => (
          <div key={`${service}-${index}`} className="border border-gray-200 dark:border-gray-600/50 rounded-xl p-4">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-[13px] font-bold text-gray-900 dark:text-gray-100 mb-1">{service}</p>
                <Bdg txt={statuses[index % statuses.length]} c={statusColors[index % statusColors.length]} />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <DetailRow label="Başlangıç Tarihi">15.01.2024</DetailRow>
              <DetailRow label="Son Güncelleme">12.03.2026</DetailRow>
              <DetailRow label="Son Fiyat Güncelleme">01.01.2026</DetailRow>
              <DetailRow label="Aylık Tutar">{`₺${(3500 + index * 1200).toLocaleString('tr-TR')}`}</DetailRow>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-600/50">
              <p className="text-[11px] text-gray-500 dark:text-gray-400">Hizmet düzenli devam ediyor. Performans iyi.</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (tab === 'finance') {
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/40 rounded-xl">
          <CheckIcon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div className="flex-1"><p className="text-[12px] font-semibold text-gray-900 dark:text-gray-100">Finans Veri Durumu</p></div>
          <Bdg txt="Tam" c="emerald" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
          <div className="space-y-5">
            <DetailField label="Resmi Ünvan">{customer.officialTitle}</DetailField>
            <DetailField label="Vergi No"><span className="font-mono">{customerValue(customer, 'taxNumber')}</span></DetailField>
            <DetailField label="Vergi Dairesi">{customerValue(customer, 'taxOffice')}</DetailField>
            <DetailField label="IBAN 1"><span className="font-mono text-[11px]">{customerValue(customer, 'iban')}</span></DetailField>
            <DetailField label="IBAN 2"><span className="text-gray-400 dark:text-gray-600">—</span></DetailField>
          </div>
          <div className="space-y-5">
            <DetailField label="Fatura E-posta">{customerValue(customer, 'invoiceEmail')}</DetailField>
            <DetailField label="Finans Sorumlusu">{customerValue(customer, 'financeContactPerson')}</DetailField>
            <DetailField label="Son Ödeme Bilgisi">{customerValue(customer, 'lastPaymentInfo')}</DetailField>
            <DetailField label="Tahsilat Notu">{customerValue(customer, 'collectionNote')}</DetailField>
          </div>
        </div>
        <div className="border-t border-gray-100 dark:border-gray-600/50 pt-4">
          <DetailField label="Fatura Adresi">{customer.address}</DetailField>
        </div>
      </div>
    );
  }

  if (tab === 'technical') {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 p-3 bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800/40 rounded-xl">
          <CheckIcon className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
          <p className="text-[12px] font-semibold text-gray-900 dark:text-gray-100 flex-1">Entegrasyon Hazırlık Durumu</p>
          <Bdg txt="Hazır" c="sky" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 dark:border-gray-600/50 rounded-xl p-4">
            <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100 mb-3">Domain Bilgileri</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between"><span className="text-[12px] text-gray-700 dark:text-gray-300">interyol.com</span><Bdg txt="Aktif" c="emerald" /></div>
              <p className="text-[10px] text-gray-400 dark:text-gray-600">Kayıt: 15.01.2020 · Son Yenileme: 15.01.2026</p>
            </div>
          </div>
          <div className="border border-gray-200 dark:border-gray-600/50 rounded-xl p-4">
            <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100 mb-3">Hosting & Sunucu</p>
            <div className="grid grid-cols-2 gap-3">
              <DetailRow label="Hosting">Cloud Hosting Pro</DetailRow>
              <DetailRow label="Panel">Plesk</DetailRow>
              <div className="flex flex-col gap-0.5"><span className="text-[10px] text-gray-400 dark:text-gray-600 uppercase tracking-wide">Plesk Durumu</span><Bdg txt="Aktif" c="emerald" /></div>
              <div className="flex flex-col gap-0.5"><span className="text-[10px] text-gray-400 dark:text-gray-600 uppercase tracking-wide">SSL Durumu</span><Bdg txt="Geçerli" c="emerald" /></div>
            </div>
          </div>
          <div className="border border-gray-200 dark:border-gray-600/50 rounded-xl p-4">
            <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100 mb-3">Sistem İlişkileri</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between"><span className="text-[12px] text-gray-700 dark:text-gray-300">WISECP Müşteri İlişkisi</span><Bdg txt="Bağlı" c="emerald" /></div>
              <div className="flex items-center justify-between"><span className="text-[12px] text-gray-700 dark:text-gray-300">Metunic Domain İlişkisi</span><Bdg txt="Bağlı" c="emerald" /></div>
              <DetailRow label="Teknik Sorumlu">Mehmet Yıldız</DetailRow>
            </div>
          </div>
          <div className="border border-gray-200 dark:border-gray-600/50 rounded-xl p-4">
            <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100 mb-3">DNS & Nameserver</p>
            <div className="space-y-2">
              <DetailRow label="NS1">ns1.ados.com.tr</DetailRow>
              <DetailRow label="NS2">ns2.ados.com.tr</DetailRow>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (tab === 'digital') {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 p-3 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800/40 rounded-xl">
          <CheckIcon className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <p className="text-[12px] font-semibold text-gray-900 dark:text-gray-100 flex-1">Dijital Veri Kalite Durumu</p>
          <Bdg txt="Hazır" c="indigo" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-200 dark:border-gray-600/50 rounded-xl p-4">
            <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100 mb-3">Sosyal Medya</p>
            <div className="space-y-2">
              <div className="flex justify-between"><span className="text-[11px] text-gray-500">Instagram</span><Bdg txt="Bağlı" c="emerald" /></div>
              <div className="flex justify-between"><span className="text-[11px] text-gray-500">LinkedIn</span><Bdg txt="Bağlı" c="emerald" /></div>
              <div className="flex justify-between"><span className="text-[11px] text-gray-500">Facebook</span><Bdg txt="Kontrol Edilecek" c="amber" /></div>
            </div>
          </div>
          <div className="border border-gray-200 dark:border-gray-600/50 rounded-xl p-4">
            <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100 mb-3">Google Hizmetleri</p>
            <div className="space-y-2">
              <div className="flex justify-between"><span className="text-[11px] text-gray-500">Google Business</span><Bdg txt="Erişim Var" c="emerald" /></div>
              <div className="flex justify-between"><span className="text-[11px] text-gray-500">Google Analytics</span><Bdg txt="Erişim Var" c="emerald" /></div>
              <div className="flex justify-between"><span className="text-[11px] text-gray-500">Search Console</span><Bdg txt="Erişim Var" c="emerald" /></div>
            </div>
          </div>
          <div className="border border-gray-200 dark:border-gray-600/50 rounded-xl p-4">
            <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100 mb-3">Pazarlama İzinleri</p>
            <div className="space-y-2">
              <div className="flex justify-between"><span className="text-[11px] text-gray-500">E-Bülten İzni</span><Bdg txt="Var" c="emerald" /></div>
              <div className="flex justify-between"><span className="text-[11px] text-gray-500">Pazarlama Kullanımı</span><Bdg txt="Uygun" c="emerald" /></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {[
        { name: 'Ahmet Demir', date: '28.03.2026 14:30', type: 'Pazarlama Notu', color: 'violet' as ColorName, text: 'Müşteri SEO hizmetine ek olarak Google Ads kampanyasıyla ilgileniyor. Bütçe bilgisi alınacak.' },
        { name: 'Zeynep Kaya', date: '20.03.2026 10:15', type: 'Satışa Yönlendirme', color: 'emerald' as ColorName, text: 'Satış ekibine yönlendirildi. Teklif hazırlığı başlatıldı.' },
        { name: 'Sistem', date: '15.03.2026 09:00', type: 'Teknik Uyarı', color: 'amber' as ColorName, text: 'Domain yenileme tarihi yaklaşıyor. Teknik ekip bilgilendirildi.' },
        { name: 'Sistem', date: '12.03.2026 16:45', type: 'Güncelleme', color: 'gray' as ColorName, text: 'Müşteri veri kalitesi durumu doğrulandı olarak güncellendi.' },
      ].map((note) => (
        <div key={`${note.name}-${note.date}`} className="border border-gray-200 dark:border-gray-600/50 rounded-xl p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-[12px] font-semibold text-gray-900 dark:text-gray-100">{note.name}</p>
              <p className="text-[10px] text-gray-400 dark:text-gray-600">{note.date}</p>
            </div>
            <Bdg txt={note.type} c={note.color} />
          </div>
          <p className="text-[12px] text-gray-600 dark:text-gray-400">{note.text}</p>
        </div>
      ))}
    </div>
  );
}

function CustomerDetail({
  customer,
  tab,
  onTabChange,
  onBack,
}: {
  customer: Customer;
  tab: DetailTab;
  onTabChange: (tab: DetailTab) => void;
  onBack: () => void;
}) {
  const qualityItems: { l: string; v: string; vc: ColorName }[] = [
    { l: 'Çekirdek Veri', v: customer.dc === 'emerald' ? 'Tamam' : 'Eksik', vc: customer.dc === 'emerald' ? 'emerald' : 'amber' },
    { l: 'Yetkili Bilgileri', v: 'Yeterli', vc: 'emerald' },
    { l: 'Pazarlama Kullanımı', v: customer.dc === 'emerald' ? 'Uygun' : 'Kontrol Gerekli', vc: customer.dc === 'emerald' ? 'emerald' : 'amber' },
    { l: 'Bülten İzni', v: customer.nc === 'emerald' ? 'Net' : 'Eksik', vc: customer.nc === 'emerald' ? 'emerald' : 'amber' },
    { l: 'Satışa Hazırlık', v: customer.dc === 'emerald' ? 'Hazır' : 'Bekliyor', vc: customer.dc === 'emerald' ? 'emerald' : 'amber' },
    { l: 'Finans Verisi', v: customer.dc === 'emerald' ? 'Tamam' : 'Eksik', vc: customer.dc === 'emerald' ? 'emerald' : 'amber' },
  ];

  return (
    <div className="relative min-h-[calc(100vh-120px)] space-y-5 md:space-y-6">
      <div className="flex items-center gap-1.5 text-[11px] text-gray-400 dark:text-gray-600 flex-wrap">
        <button onClick={onBack} className="hover:text-gray-600 dark:hover:text-gray-400 cursor-pointer transition-colors">Satış Panosu</button>
        <span>/</span>
        <button onClick={onBack} className="hover:text-gray-600 dark:hover:text-gray-400 cursor-pointer transition-colors">Müşteri Data Kontrol</button>
        <span>/</span>
        <span className="text-gray-700 dark:text-gray-300 font-medium">Müşteri Detayı</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-violet-100 dark:bg-violet-900/40 rounded-xl flex items-center justify-center shrink-0">
            <UserIcon />
          </div>
          <div>
            <h1 className="text-[19px] font-bold text-gray-900 dark:text-gray-100 leading-tight">Müşteri Kartı</h1>
            <p className="text-[12px] text-gray-500 dark:text-gray-400">{customer.co}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={onBack} className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-[12px] font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"><BackIcon /> Geri Dön</button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div><p className="text-[10px] text-gray-400 dark:text-gray-600 uppercase tracking-wide mb-1">Müşteri Numarası</p><p className="text-[12px] font-semibold font-mono text-gray-900 dark:text-gray-100">{customer.no}</p></div>
          <div><p className="text-[10px] text-gray-400 dark:text-gray-600 uppercase tracking-wide mb-1">Müşteri Durumu</p><Bdg txt={customer.tp} c={customer.tc} /></div>
          <div><p className="text-[10px] text-gray-400 dark:text-gray-600 uppercase tracking-wide mb-1">Veri Kalite Durumu</p><Bdg txt={customer.dt} c={customer.dc} /></div>
          <div><p className="text-[10px] text-gray-400 dark:text-gray-600 uppercase tracking-wide mb-1">Segment</p>{customer.sg !== '—' && customer.sg !== 'â€”' ? <Bdg txt={customer.sg} c={customer.sc} /> : <span className="text-[11px] text-gray-400 dark:text-gray-600">—</span>}</div>
          <div><p className="text-[10px] text-gray-400 dark:text-gray-600 uppercase tracking-wide mb-1">Kaynak</p><p className="text-[12px] font-medium text-gray-700 dark:text-gray-300">Web Sitesi</p></div>
          <div><p className="text-[10px] text-gray-400 dark:text-gray-600 uppercase tracking-wide mb-1">Aldığı Hizmetler</p><div className="flex flex-wrap gap-1">{customer.sv.slice(0, 2).map((service) => <Bdg key={service} txt={service} c="indigo" />)}{customer.sv.length > 2 ? <span className="text-[10px] text-gray-400 dark:text-gray-600 self-center">+{customer.sv.length - 2}</span> : null}</div></div>
          <div><p className="text-[10px] text-gray-400 dark:text-gray-600 uppercase tracking-wide mb-1">Son Güncelleme</p><p className="text-[12px] font-medium text-gray-700 dark:text-gray-300">{customer.up}</p></div>
          <div><p className="text-[10px] text-gray-400 dark:text-gray-600 uppercase tracking-wide mb-1">Son Fiyat Güncelleme</p><p className="text-[12px] font-medium text-gray-700 dark:text-gray-300">12.02.2026</p></div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-600/50">
          <div className="flex min-w-max">
            {DETAIL_TABS.map((item) => (
              <button
                key={item.id}
                data-tab={item.id}
                onClick={() => onTabChange(item.id)}
                className={`dtab px-4 py-2.5 text-[12px] font-semibold border-b-2 whitespace-nowrap transition-colors ${item.id === tab ? 'border-violet-600 text-violet-600 dark:text-violet-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <div id="dtab-content" className="p-5 lg:p-6">
          <DetailTabContent customer={customer} tab={tab} />
        </div>
      </div>

      <div className="bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-900/10 dark:to-[#17171a] border border-violet-200 dark:border-violet-800/40 rounded-xl p-4">
        <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
          <CheckIcon className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
          Veri Kalitesi &amp; Hazırlık Durumu
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {qualityItems.map((item) => (
            <div key={item.l} className="flex items-center justify-between bg-white/70 dark:bg-white/5 rounded-lg px-3 py-2">
              <span className="text-[11px] text-gray-700 dark:text-gray-300">{item.l}</span>
              <Bdg txt={item.v} c={item.vc} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CustomerRow({ customer, onShowCustomer }: { customer: Customer; onShowCustomer: (customer: Customer) => void }) {
  return (
    <tr className="gr border-b border-gray-100 dark:border-gray-600/50 group">
      <td className="px-3 py-3">
        <button onClick={() => onShowCustomer(customer)} className="text-[12px] font-semibold text-gray-900 dark:text-gray-100 hover:text-violet-600 dark:hover:text-violet-400 text-left block transition-colors leading-tight">
          {customer.co}
        </button>
        <div className="text-[10px] text-gray-400 dark:text-gray-600 font-mono mt-0.5">{customer.no}</div>
      </td>
      <td className="px-3 py-3"><Bdg txt={customer.tp} c={customer.tc} /></td>
      <td className="px-3 py-3">
        <div className="flex flex-wrap gap-1">
          {customer.sv.slice(0, 2).map((service) => <Bdg key={service} txt={service} c="indigo" />)}
          {customer.sv.length > 2 ? <span className="text-[10px] text-gray-400 dark:text-gray-600 self-center">+{customer.sv.length - 2}</span> : null}
        </div>
      </td>
      <td className="px-3 py-3"><Bdg txt={customer.dt} c={customer.dc} /></td>
      <td className="px-3 py-3">
        {customer.mx !== '—' ? (
          <div className="flex items-center gap-1 text-[10px] text-amber-700 dark:text-amber-400">
            <AlertIcon />
            <span>{customer.mx}</span>
          </div>
        ) : (
          <span className="text-[10px] text-gray-400 dark:text-gray-600">—</span>
        )}
      </td>
      <td className="px-3 py-3">{customer.sg !== '—' ? <Bdg txt={customer.sg} c={customer.sc} /> : <span className="text-[10px] text-gray-400 dark:text-gray-600">—</span>}</td>
      <td className="px-3 py-3">
        <div className="flex items-center gap-1 text-[10px] text-gray-400 dark:text-gray-600">
          <ClockIcon /> {customer.up}
        </div>
      </td>
      <td className="px-3 py-3">
        <div className="flex items-center justify-end gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onShowCustomer(customer)} title="Görüntüle" className="p-1.5 rounded-md text-violet-500 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors">
            <EyeIcon />
          </button>
        </div>
      </td>
    </tr>
  );
}

function CustomerMobileCard({ customer, onShowCustomer }: { customer: Customer; onShowCustomer: (customer: Customer) => void }) {
  return (
    <div className="p-3 border-b border-gray-100 dark:border-gray-600/50 hover:bg-gray-50/70 dark:hover:bg-gray-700/40 transition-colors">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <button onClick={() => onShowCustomer(customer)} className="text-[13px] font-semibold text-gray-900 dark:text-gray-100 hover:text-violet-600 dark:hover:text-violet-400 text-left block transition-colors">
            {customer.co}
          </button>
          <p className="text-[10px] text-gray-400 dark:text-gray-600 font-mono">{customer.no}</p>
        </div>
        <Bdg txt={customer.tp} c={customer.tc} />
      </div>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {customer.sv.slice(0, 2).map((service) => <Bdg key={service} txt={service} c="indigo" />)}
        <Bdg txt={customer.dt} c={customer.dc} />
        {customer.sg !== '—' ? <Bdg txt={customer.sg} c={customer.sc} /> : null}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-[10px] text-gray-400 dark:text-gray-600">
          <ClockIcon /> {customer.up}
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => onShowCustomer(customer)} title="Görüntüle" className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
            <EyeIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

function NewCustomerModal({ tab, onTabChange, onClose }: { tab: 'single' | 'bulk'; onTabChange: (tab: 'single' | 'bulk') => void; onClose: () => void }) {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-black/60 rounded-xl">
      <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl shadow-2xl w-full max-w-2xl max-h-[88vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-600/50">
          <div>
            <h2 className="text-[14px] font-bold text-gray-900 dark:text-gray-100">Yeni Müşteri Ekle</h2>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Pazarlama kullanımı için müşteri kaydı oluşturun.</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            <Icon className="w-4 h-4 text-gray-500">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </Icon>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="flex border-b border-gray-200 dark:border-gray-600/50 -mt-1 mb-2">
            <button onClick={() => onTabChange('single')} className={`px-4 py-2 text-[12px] font-semibold border-b-2 ${tab === 'single' ? 'border-violet-600 text-violet-600' : 'border-transparent text-gray-500 dark:text-gray-400'}`}>Tekil Müşteri</button>
            <button onClick={() => onTabChange('bulk')} className={`px-4 py-2 text-[12px] font-semibold border-b-2 ${tab === 'bulk' ? 'border-violet-600 text-violet-600' : 'border-transparent text-gray-500 dark:text-gray-400'}`}>Excel ile Toplu</button>
          </div>
          {tab === 'single' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Marka / Firma Adı" required placeholder="Örn: Teknosoft A.Ş." />
                <FormField label="Resmi Ünvan" placeholder="Teknosoft Bilişim A.Ş." />
                <SelectField label="Müşteri Türü" required options={['Seçiniz', 'Aktif Müşteri', 'Potansiyel Müşteri', 'Pasif Müşteri', 'Yeniden Pazarlama']} />
                <SelectField label="Kaynak" required options={['Seçiniz', 'Web Sitesi', 'Google Ads', 'Meta Reklam', 'Referans', 'Telefon', 'Organik', 'E-Bülten']} />
                <SelectField label="Segment" options={['Seçiniz', 'KOBİ', 'Kurumsal', 'E-Ticaret', 'Sağlık', 'Eğitim', 'Teknik Hizmet', 'Diğer']} />
                <SelectField label="E-Bülten İzni" options={['Seçiniz', 'Var', 'Yok', 'Kontrol Edilecek']} />
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-2">Hizmetler <span className="text-rose-500">*</span></label>
                  <div className="flex flex-wrap gap-1.5">SEO Web&#32;Sitesi Google&#32;Ads Meta&#32;Reklam Sosyal&#32;Medya E-Bülten Domain Marka&#32;Tescili Kurumsal&#32;Kimlik Prodüksiyon</div>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {SVCS.map((service) => (
                      <button key={service} type="button" className="px-2.5 py-1 text-[11px] font-medium rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        {service}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-100 dark:border-gray-600/50 pt-4">
                <p className="text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-3">1. Yetkili <span className="text-rose-500">*</span></p>
                <div className="grid grid-cols-2 gap-3">
                  <SmallField label="Ad Soyad" placeholder="Mehmet Yılmaz" />
                  <SmallField label="Ünvan" placeholder="Genel Müdür" />
                  <SmallField label="Telefon" type="tel" placeholder="0555 123 45 67" />
                  <SmallField label="E-posta" type="email" placeholder="m@firma.com" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-gray-700 dark:text-gray-300 mb-1">Not</label>
                <textarea rows={2} placeholder="İlk görüşme özeti..." className="w-full px-3 py-2 text-[12px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#23242c] rounded-lg focus:outline-none focus:border-violet-500 text-gray-900 dark:text-gray-100 placeholder-gray-400 resize-none" />
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-violet-50 dark:bg-violet-900/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Icon className="w-8 h-8 text-violet-600 dark:text-violet-400">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </Icon>
              </div>
              <p className="text-[14px] font-semibold text-gray-900 dark:text-gray-100 mb-1">Excel Dosyası Yükle</p>
              <p className="text-[12px] text-gray-500 dark:text-gray-400 mb-4">20 sütunlu şablona uygun .xlsx dosyası yükleyin</p>
              <label className="cursor-pointer inline-block">
                <span className="px-4 py-2 bg-violet-600 text-white text-[12px] font-semibold rounded-lg hover:bg-violet-700">Dosya Seç (.xlsx)</span>
                <input type="file" className="hidden" accept=".xlsx,.xls" />
              </label>
              <div className="mt-3">
                <button className="text-[12px] text-violet-600 dark:text-violet-400 underline">Örnek şablonu indir</button>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-200 dark:border-gray-600/50 bg-gray-50/70 dark:bg-[#161720]/50">
          <button onClick={onClose} className="px-3 py-1.5 text-[12px] font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">İptal</button>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-[12px] font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50">Taslak Kaydet</button>
            <button className="px-4 py-1.5 text-[12px] font-bold text-white bg-violet-600 rounded-lg hover:bg-violet-700">Kaydı Oluştur</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, placeholder, required = false }: { label: string; placeholder: string; required?: boolean }) {
  return (
    <div>
      <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">{label} {required ? <span className="text-rose-500">*</span> : null}</label>
      <input type="text" placeholder={placeholder} className="w-full px-3 py-2 text-[13px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#23242c] rounded-lg focus:outline-none focus:border-violet-500 text-gray-900 dark:text-gray-100 placeholder-gray-400" />
    </div>
  );
}

function SelectField({ label, options, required = false }: { label: string; options: string[]; required?: boolean }) {
  return (
    <div>
      <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">{label} {required ? <span className="text-rose-500">*</span> : null}</label>
      <select className="w-full px-3 py-2 text-[13px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#23242c] rounded-lg focus:outline-none focus:border-violet-500 text-gray-900 dark:text-gray-100">
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </div>
  );
}

function SmallField({ label, placeholder, type = 'text' }: { label: string; placeholder: string; type?: string }) {
  return (
    <div>
      <label className="block text-[10px] font-medium text-gray-500 dark:text-gray-500 mb-1">{label}</label>
      <input type={type} placeholder={placeholder} className="w-full px-3 py-2 text-[12px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#23242c] rounded-lg focus:outline-none focus:border-violet-500 text-gray-900 dark:text-gray-100 placeholder-gray-400" />
    </div>
  );
}

export default function MusteriDataKontrol() {
  const [filter, setFilter] = useState('Tümü');
  const [search, setSearch] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isCustomersLoading, setIsCustomersLoading] = useState(false);
  const [customerError, setCustomerError] = useState('');
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [detailTab, setDetailTab] = useState<DetailTab>('general');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  async function loadCustomers() {
    setIsCustomersLoading(true);
    setCustomerError('');

    try {
      const data = await getCustomers();
      setCustomers(Array.isArray(data) ? data.map(mapCustomerResponseToCustomer) : []);
    } catch (error) {
      setCustomers([]);
      setCustomerError(error instanceof Error ? error.message : 'Müşteriler alınamadı.');
    } finally {
      setIsCustomersLoading(false);
    }
  }

  useEffect(() => {
    void loadCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('tr-TR');

    return customers.filter((customer) => {
      const statusMatch = filter === 'Tümü' || customer.tp.toLocaleLowerCase('tr-TR').includes(filter.toLocaleLowerCase('tr-TR'));
      const searchMatch = !query || [
        customer.co,
        customer.no,
        customer.ct,
        customer.officialTitle,
        customer.phone,
        customer.email,
        customer.source,
        customer.sg,
      ].some((value) => value.toLocaleLowerCase('tr-TR').includes(query));

      return statusMatch && searchMatch;
    });
  }, [customers, filter, search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, pageSize, search]);

  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / pageSize));
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
  const pagedCustomers = filteredCustomers.slice((safeCurrentPage - 1) * pageSize, safeCurrentPage * pageSize);

  useEffect(() => {
    if (currentPage !== safeCurrentPage) {
      setCurrentPage(safeCurrentPage);
    }
  }, [currentPage, safeCurrentPage]);

  const kpis = [
    { l: 'Toplam Kayıt', v: String(customers.length), c: 'gray' as ColorName },
    { l: 'Aktif Müşteri', v: String(customers.filter((customer) => customer.tp.toLocaleLowerCase('tr-TR').includes('aktif')).length), c: 'emerald' as ColorName },
    { l: 'Eksik Veri', v: String(customers.filter((customer) => customer.dt.toLocaleLowerCase('tr-TR').includes('eksik')).length), c: 'amber' as ColorName },
    { l: 'Satışa Uygun', v: String(customers.filter((customer) => customer.dc === 'emerald').length), c: 'emerald' as ColorName },
    { l: 'Segmentlenmiş', v: String(customers.filter((customer) => customer.sg !== '—').length), c: 'violet' as ColorName },
  ];

  const qualityItems = [
    { l: 'Doğrulandı', v: customers.filter((customer) => customer.dc === 'emerald').length, c: 'emerald' as ColorName, d: 'Satışa ve bültene hazır kayıtlar', barClr: 'bg-emerald-500' },
    { l: 'Eksik Veri', v: customers.filter((customer) => customer.dt.toLocaleLowerCase('tr-TR').includes('eksik')).length, c: 'amber' as ColorName, d: 'Bir veya daha fazla zorunlu alan eksik', barClr: 'bg-amber-500' },
    { l: 'Kontrol Gerekli', v: customers.filter((customer) => customer.dt.toLocaleLowerCase('tr-TR').includes('kontrol')).length, c: 'rose' as ColorName, d: 'Veri doğrulaması gerekiyor', barClr: 'bg-rose-500' },
    { l: 'Pasif / Yeniden Pazarlama', v: customers.filter((customer) => customer.tp.toLocaleLowerCase('tr-TR').includes('pasif') || customer.tp.toLocaleLowerCase('tr-TR').includes('yeniden')).length, c: 'gray' as ColorName, d: 'Re-marketing hedef kitlesi', barClr: 'bg-gray-400' },
  ].map((item) => ({
    ...item,
    value: String(item.v),
    p: customers.length > 0 ? Math.round((item.v / customers.length) * 100) : 0,
  }));

  async function openCustomerDetail(customer: Customer) {
    setIsDetailLoading(true);
    setDetailError('');

    try {
      const detail = await getCustomerById(customer.id);
      setSelectedCustomer(mapCustomerResponseToCustomer(detail));
      setDetailTab('general');
    } catch (error) {
      setDetailError(error instanceof Error ? error.message : 'Müşteri detayı alınamadı.');
    } finally {
      setIsDetailLoading(false);
    }
  }

  if (selectedCustomer) {
    return <CustomerDetail customer={selectedCustomer} tab={detailTab} onTabChange={setDetailTab} onBack={() => setSelectedCustomer(null)} />;
  }

  if (isDetailLoading) {
    return <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl px-4 py-8 text-center text-[12px] font-medium text-gray-500 dark:text-gray-400">Müşteri detayı yükleniyor...</div>;
  }

  return (
    <div className="relative min-h-[calc(100vh-120px)] space-y-5 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-violet-100 dark:bg-violet-900/40 rounded-xl flex items-center justify-center shrink-0">
            <Icon className="text-violet-600 dark:text-violet-400 w-5 h-5">
              <ellipse cx="12" cy="5" rx="9" ry="3" />
              <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
              <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
            </Icon>
          </div>
          <div>
            <h1 className="text-[19px] font-bold text-gray-900 dark:text-gray-100 leading-tight">Müşteri Data Kontrol</h1>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">Veri kalitesi, doğrulama ve satışa aktarım öncesi hazırlık</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {kpis.map((kpi) => {
          const cm = CM[kpi.c] || CM.gray;
          return (
            <div key={kpi.l} className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl px-3 py-2.5 hover:shadow-sm dark:hover:border-gray-700 transition-all">
              <p className={`text-[19px] font-bold ${cm.t} leading-none mb-0.5`}>{kpi.v}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">{kpi.l}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-4">
        <div className="flex flex-col gap-3">
          <div className="relative max-w-md">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input type="text" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Firma / yetkili / e-posta / müşteri no ara..." className="w-full pl-9 pr-4 py-2 text-[12px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#23242c] rounded-lg focus:outline-none focus:border-violet-500 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600" />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide shrink-0">Müşteri Durumu:</span>
            <div className="flex flex-wrap gap-1.5">
              {TFS.map((item, index) => (
                <button
                  key={item}
                  onClick={() => setFilter(item)}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all ${
                    filter === item || (index === 0 && filter === '') ? 'bg-violet-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {['Hizmet', 'Veri Kalitesi', 'Segment', 'E-Bülten Durumu', 'Son Güncelleme'].map((item) => (
              <button key={item} className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
                {item}
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
        <div className="hidden md:block">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-600/50 bg-gray-50/70 dark:bg-[#161720]/50">
                {['Firma', 'Durum', 'Hizmetler', 'Veri Kalite', 'Eksik Alan', 'Segment', 'Güncelleme', 'İşlem'].map((head) => (
                  <th key={head} className={`px-3 py-2.5 ${head === 'İşlem' ? 'text-right' : 'text-left'} text-[10px] font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide`}>
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/40">
              {pagedCustomers.map((customer) => <CustomerRow key={customer.id} customer={customer} onShowCustomer={(selected) => void openCustomerDetail(selected)} />)}
            </tbody>
          </table>
        </div>
        <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-700/40">
          {pagedCustomers.map((customer) => <CustomerMobileCard key={customer.id} customer={customer} onShowCustomer={(selected) => void openCustomerDetail(selected)} />)}
        </div>
        {isCustomersLoading ? <div className="px-4 py-8 text-center text-[12px] font-medium text-gray-500 dark:text-gray-400">Müşteriler yükleniyor...</div> : null}
        {customerError || detailError ? <div className="px-4 py-8 text-center text-[12px] font-medium text-rose-600 dark:text-rose-400">{customerError || detailError}</div> : null}
        {!isCustomersLoading && !customerError && !detailError && filteredCustomers.length === 0 ? <div className="px-4 py-8 text-center text-[12px] font-medium text-gray-500 dark:text-gray-400">Müşteri bulunamadı.</div> : null}
        <div className="px-4 py-2.5 border-t border-gray-100 dark:border-gray-600/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-gray-50/50 dark:bg-[#161720]/30">
          <span className="text-[11px] text-gray-500 dark:text-gray-500">{filteredCustomers.length} kayıt içinden {pagedCustomers.length} kayıt gösteriliyor · Toplam {customers.length}</span>
          <div className="flex items-center gap-2 flex-wrap">
            <select value={pageSize} onChange={(event) => setPageSize(Number(event.target.value))} className="px-2.5 py-1 text-[11px] font-medium border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e1f26] rounded-md text-gray-600 dark:text-gray-400 focus:outline-none focus:border-violet-500">
              <option value={10}>10'lu göster</option>
              <option value={50}>50'li göster</option>
            </select>
            <button disabled={safeCurrentPage <= 1} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} className="px-2.5 py-1 text-[11px] font-medium border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed">← Önceki</button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <button key={page} onClick={() => setCurrentPage(page)} className={`px-2.5 py-1 text-[11px] font-medium rounded-md ${page === safeCurrentPage ? 'font-bold bg-violet-600 text-white' : 'border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>{page}</button>
            ))}
            <button disabled={safeCurrentPage >= totalPages} onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} className="px-2.5 py-1 text-[11px] font-medium border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed">Sonraki →</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {qualityItems.map((item) => {
          const cm = CM[item.c] || CM.gray;
          return (
            <div key={item.l} className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] text-gray-500 dark:text-gray-400">{item.l}</p>
                <span className={`text-[19px] font-bold ${cm.t}`}>{item.value}</span>
              </div>
              <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full mb-2 overflow-hidden">
                <div className={`h-full rounded-full ${item.barClr} transition-all`} style={{ width: `${item.p}%` }} />
              </div>
              <p className="text-[10px] text-gray-400 dark:text-gray-600">{item.d}</p>
            </div>
          );
        })}
      </div>

    </div>
  );
}
