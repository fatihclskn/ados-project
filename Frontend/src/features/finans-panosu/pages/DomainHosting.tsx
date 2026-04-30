import { type ReactNode, useMemo, useState } from 'react';

type ColorName = 'teal' | 'indigo' | 'violet' | 'emerald' | 'amber' | 'sky' | 'rose' | 'gray';
type Company = 'digital' | 'bilisim';
type CompanyFilter = Company | 'all';
type ServiceType = 'domain' | 'hosting' | 'vds' | 'ssl' | 'bakim' | 'magaza' | 'antispam';
type DomainTab = 'overview' | ServiceType;
type Provider = 'metunic' | 'plesk' | 'cloudflare' | 'manual';
type ServiceStatus = 'active' | 'expiring' | 'expired' | 'stopped';
type StatusFilter = ServiceStatus | 'all';
type ModalType = 'detail' | 'extend' | 'stop' | 'new' | null;

type Payment = {
  year: number;
  amount: number;
  paid: boolean;
  date: string | null;
  inv: string | null;
  note?: string;
};

type ServiceItem = {
  id: string;
  customer: string;
  service: string;
  type: ServiceType;
  provider: Provider;
  start: string;
  end: string;
  amount: number;
  period: 'yillik' | 'aylik';
  autoRenew: boolean;
  status: ServiceStatus;
  company: Company;
  meta: Record<string, string | number | boolean>;
  payments: Payment[];
};

const CM: Record<ColorName, { bg: string; t: string; border: string; bar: string; solid: string; hover: string }> = {
  teal: { bg: 'bg-teal-100 dark:bg-teal-900/30', t: 'text-teal-700 dark:text-teal-300', border: 'border-teal-200 dark:border-teal-500/30', bar: 'bg-gradient-to-r from-teal-400 to-teal-600', solid: 'bg-teal-600', hover: 'hover:bg-teal-700' },
  indigo: { bg: 'bg-indigo-100 dark:bg-indigo-900/30', t: 'text-indigo-700 dark:text-indigo-300', border: 'border-indigo-200 dark:border-indigo-500/30', bar: 'bg-gradient-to-r from-indigo-400 to-indigo-600', solid: 'bg-indigo-600', hover: 'hover:bg-indigo-700' },
  violet: { bg: 'bg-violet-100 dark:bg-violet-900/30', t: 'text-violet-700 dark:text-violet-300', border: 'border-violet-200 dark:border-violet-500/30', bar: 'bg-gradient-to-r from-violet-400 to-violet-600', solid: 'bg-violet-600', hover: 'hover:bg-violet-700' },
  emerald: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', t: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-500/30', bar: 'bg-gradient-to-r from-emerald-400 to-emerald-600', solid: 'bg-emerald-600', hover: 'hover:bg-emerald-700' },
  amber: { bg: 'bg-amber-100 dark:bg-amber-900/30', t: 'text-amber-700 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-500/30', bar: 'bg-gradient-to-r from-amber-400 to-amber-600', solid: 'bg-amber-600', hover: 'hover:bg-amber-700' },
  sky: { bg: 'bg-sky-100 dark:bg-sky-900/30', t: 'text-sky-700 dark:text-sky-300', border: 'border-sky-200 dark:border-sky-500/30', bar: 'bg-gradient-to-r from-sky-400 to-sky-600', solid: 'bg-sky-600', hover: 'hover:bg-sky-700' },
  rose: { bg: 'bg-rose-100 dark:bg-rose-900/30', t: 'text-rose-700 dark:text-rose-300', border: 'border-rose-200 dark:border-rose-500/30', bar: 'bg-gradient-to-r from-rose-400 to-rose-600', solid: 'bg-rose-600', hover: 'hover:bg-rose-700' },
  gray: { bg: 'bg-gray-100 dark:bg-gray-800', t: 'text-gray-700 dark:text-gray-300', border: 'border-gray-200 dark:border-gray-600/50', bar: 'bg-gradient-to-r from-gray-400 to-gray-600', solid: 'bg-gray-600', hover: 'hover:bg-gray-700' },
};

const HIZMET_TYPES: Record<ServiceType, { lbl: string; clr: ColorName; integ: Exclude<Provider, 'manual'> | null; icon: ReactNode }> = {
  domain: { lbl: 'Domain', clr: 'teal', integ: 'metunic', icon: <><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></> },
  hosting: { lbl: 'Hosting', clr: 'indigo', integ: 'plesk', icon: <><rect x="2" y="2" width="20" height="8" rx="2" /><rect x="2" y="14" width="20" height="8" rx="2" /><line x1="6" y1="6" x2="6.01" y2="6" /><line x1="6" y1="18" x2="6.01" y2="18" /></> },
  vds: { lbl: 'VDS Sunucu', clr: 'violet', integ: 'plesk', icon: <><rect x="2" y="2" width="20" height="8" rx="2" /><rect x="2" y="14" width="20" height="8" rx="2" /><path d="M6 6h.01M10 6h.01M6 18h.01M10 18h.01" /></> },
  ssl: { lbl: 'SSL Sertifika', clr: 'emerald', integ: 'cloudflare', icon: <><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></> },
  bakim: { lbl: 'Bakım & Destek', clr: 'amber', integ: null, icon: <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /> },
  magaza: { lbl: 'Mağaza Yayın', clr: 'sky', integ: null, icon: <path d="M3 9l1-5h16l1 5M3 9h18M3 9v11a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V9" /> },
  antispam: { lbl: 'Antispam', clr: 'rose', integ: null, icon: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" /></> },
};

const INTEG_CONF: Record<Exclude<Provider, 'manual'>, { lbl: string; desc: string; clr: ColorName; status: string; lastSync: string; icon: ReactNode }> = {
  metunic: { lbl: 'Metunic', desc: 'Domain kayıt & DNS', clr: 'teal', status: 'connected', lastSync: '10 dk önce', icon: <><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10" /></> },
  plesk: { lbl: 'Plesk', desc: 'Hosting & VDS', clr: 'indigo', status: 'connected', lastSync: '15 dk önce', icon: <><rect x="2" y="2" width="20" height="8" rx="2" /><rect x="2" y="14" width="20" height="8" rx="2" /><line x1="6" y1="6" x2="6.01" y2="6" /></> },
  cloudflare: { lbl: 'Cloudflare', desc: 'SSL & DNS Proxy', clr: 'amber', status: 'connected', lastSync: '5 dk önce', icon: <path d="M17 9.5a7 7 0 0 0-13 3.5c0 2.5 2 4.5 4.5 4.5h8.5a5 5 0 1 0 0-10z" /> },
};

const STATUS_CONF: Record<ServiceStatus, { lbl: string; clr: ColorName; dot: boolean }> = {
  active: { lbl: 'Açık', clr: 'emerald', dot: false },
  expiring: { lbl: 'Bitiyor', clr: 'amber', dot: true },
  expired: { lbl: 'Süresi Doldu', clr: 'rose', dot: true },
  stopped: { lbl: 'Kapalı', clr: 'gray', dot: false },
};

const hizmetler: ServiceItem[] = [
  { id: 'DM-001', customer: 'Bosch Türkiye', service: 'bosch.tr', type: 'domain', provider: 'metunic', start: '01.01.2026', end: '01.01.2027', amount: 10, period: 'yillik', autoRenew: true, status: 'active', company: 'digital', meta: { registrar: 'Metunic', dns: 'cloudflare', nameservers: 'ns1.metunic.com, ns2.metunic.com', whois: 'Bosch Türkiye San. Tic.' }, payments: [{ year: 2024, amount: 10, paid: true, date: '28.12.2023', inv: 'F-2024-0012' }, { year: 2025, amount: 10, paid: true, date: '30.12.2024', inv: 'F-2025-0014' }, { year: 2026, amount: 10, paid: true, date: '29.12.2025', inv: 'F-2026-0011' }] },
  { id: 'DM-002', customer: 'BigBrand Reklam A.Ş.', service: 'bigbrand.com', type: 'domain', provider: 'metunic', start: '15.03.2025', end: '15.03.2026', amount: 12, period: 'yillik', autoRenew: true, status: 'expired', company: 'digital', meta: { registrar: 'Metunic', dns: 'cloudflare', nameservers: 'ns1.metunic.com, ns2.metunic.com', whois: 'BigBrand Reklam A.Ş.' }, payments: [{ year: 2024, amount: 12, paid: true, date: '10.03.2024', inv: 'F-2024-0082' }, { year: 2025, amount: 12, paid: true, date: '13.03.2025', inv: 'F-2025-0089' }, { year: 2026, amount: 12, paid: false, date: null, inv: null, note: 'Son ödeme yapılmadı · hesap hatırlatıldı' }] },
  { id: 'DM-003', customer: 'MegaMarka Perakende', service: 'megamarka.com.tr', type: 'domain', provider: 'metunic', start: '20.05.2025', end: '20.05.2026', amount: 12, period: 'yillik', autoRenew: true, status: 'expiring', company: 'bilisim', meta: { registrar: 'Metunic', dns: 'metunic', nameservers: 'ns1.metunic.com, ns2.metunic.com', whois: 'MegaMarka Perakende Ltd.' }, payments: [{ year: 2024, amount: 12, paid: true, date: '17.05.2024', inv: 'F-2024-0156' }, { year: 2025, amount: 12, paid: true, date: '19.05.2025', inv: 'F-2025-0178' }] },
  { id: 'DM-004', customer: 'TechNova Yazılım', service: 'technova.com', type: 'domain', provider: 'metunic', start: '10.02.2026', end: '10.02.2027', amount: 15, period: 'yillik', autoRenew: true, status: 'active', company: 'digital', meta: { registrar: 'Metunic', dns: 'cloudflare', nameservers: 'ns1.cloudflare.com, ns2.cloudflare.com', whois: 'TechNova Yazılım A.Ş.' }, payments: [{ year: 2025, amount: 15, paid: true, date: '08.02.2025', inv: 'F-2025-0042' }, { year: 2026, amount: 15, paid: true, date: '07.02.2026', inv: 'F-2026-0038' }] },
  { id: 'DM-005', customer: 'Platin Otomotiv', service: 'platinoto.com', type: 'domain', provider: 'manual', start: '05.07.2025', end: '05.07.2026', amount: 12, period: 'yillik', autoRenew: false, status: 'active', company: 'digital', meta: { registrar: 'GoDaddy (harici)', dns: 'Route53', nameservers: 'ns-123.awsdns.com', whois: 'Platin Otomotiv Ltd.' }, payments: [{ year: 2024, amount: 12, paid: true, date: '03.07.2024', inv: 'F-2024-0201' }, { year: 2025, amount: 12, paid: true, date: '04.07.2025', inv: 'F-2025-0245' }] },
  { id: 'DM-006', customer: 'FastGrow Digital', service: 'fastgrow.net', type: 'domain', provider: 'metunic', start: '12.08.2025', end: '12.08.2026', amount: 10, period: 'yillik', autoRenew: true, status: 'active', company: 'bilisim', meta: { registrar: 'Metunic', dns: 'metunic', nameservers: 'ns1.metunic.com, ns2.metunic.com', whois: 'FastGrow Dig. Ltd.' }, payments: [{ year: 2025, amount: 10, paid: true, date: '10.08.2025', inv: 'F-2025-0281' }] },
  { id: 'HS-001', customer: 'Bosch Türkiye', service: 'Business Plan Hosting', type: 'hosting', provider: 'plesk', start: '01.01.2026', end: '01.01.2027', amount: 75, period: 'yillik', autoRenew: true, status: 'active', company: 'digital', meta: { cpu: '%24 kullanım', ram: '3.2GB/8GB', disk: '42GB/100GB', bandwidth: '180GB/1TB', sslEnabled: true, phpVersion: '8.2' }, payments: [{ year: 2024, amount: 75, paid: true, date: '28.12.2023', inv: 'F-2024-0013' }, { year: 2025, amount: 75, paid: true, date: '30.12.2024', inv: 'F-2025-0015' }, { year: 2026, amount: 75, paid: true, date: '29.12.2025', inv: 'F-2026-0012' }] },
  { id: 'HS-002', customer: 'BigBrand Reklam A.Ş.', service: 'Premium Hosting', type: 'hosting', provider: 'plesk', start: '15.03.2025', end: '15.03.2026', amount: 120, period: 'yillik', autoRenew: true, status: 'expired', company: 'digital', meta: { cpu: '%68 kullanım', ram: '11GB/16GB', disk: '180GB/250GB', bandwidth: '850GB/2TB', sslEnabled: true, phpVersion: '8.2' }, payments: [{ year: 2024, amount: 120, paid: true, date: '10.03.2024', inv: 'F-2024-0083' }, { year: 2025, amount: 120, paid: true, date: '13.03.2025', inv: 'F-2025-0090' }, { year: 2026, amount: 120, paid: false, date: null, inv: null, note: 'Süresi doldu · servis askıya alınmadan önce uzatılmalı' }] },
  { id: 'HS-003', customer: 'MegaMarka Perakende', service: 'Standard Hosting', type: 'hosting', provider: 'manual', start: '01.04.2026', end: '01.04.2027', amount: 60, period: 'yillik', autoRenew: true, status: 'active', company: 'bilisim', meta: { cpu: 'n/a', ram: 'n/a', disk: 'n/a', bandwidth: 'n/a', sslEnabled: true, phpVersion: '8.1', externalProvider: 'Hostinger' }, payments: [{ year: 2025, amount: 60, paid: true, date: '29.03.2025', inv: 'F-2025-0112' }, { year: 2026, amount: 60, paid: true, date: '30.03.2026', inv: 'F-2026-0098' }] },
  { id: 'VDS-01', customer: 'Bosch Türkiye', service: 'Dedicated VDS 8CPU/32GB', type: 'vds', provider: 'plesk', start: '01.01.2026', end: '01.01.2027', amount: 600, period: 'yillik', autoRenew: true, status: 'active', company: 'digital', meta: { cpu: '%38 ortalama', ram: '18GB/32GB', disk: '320GB/500GB SSD', uptime: '99.98%', os: 'Ubuntu 22.04', location: 'Frankfurt' }, payments: [{ year: 2024, amount: 600, paid: true, date: '27.12.2023', inv: 'F-2024-0014' }, { year: 2025, amount: 600, paid: true, date: '29.12.2024', inv: 'F-2025-0016' }, { year: 2026, amount: 600, paid: true, date: '28.12.2025', inv: 'F-2026-0013' }] },
  { id: 'VDS-02', customer: 'Platin Otomotiv', service: 'VDS Pro 4CPU/16GB', type: 'vds', provider: 'plesk', start: '15.03.2026', end: '15.03.2027', amount: 400, period: 'yillik', autoRenew: true, status: 'active', company: 'digital', meta: { cpu: '%52 ortalama', ram: '9.8GB/16GB', disk: '220GB/250GB SSD', uptime: '99.94%', os: 'Ubuntu 22.04', location: 'Frankfurt' }, payments: [{ year: 2025, amount: 400, paid: true, date: '13.03.2025', inv: 'F-2025-0091' }, { year: 2026, amount: 400, paid: true, date: '14.03.2026', inv: 'F-2026-0088' }] },
  { id: 'SSL-01', customer: 'Bosch Türkiye', service: 'SSL Wildcard Certificate', type: 'ssl', provider: 'cloudflare', start: '01.01.2026', end: '01.01.2027', amount: 40, period: 'yillik', autoRenew: true, status: 'active', company: 'digital', meta: { type: 'Wildcard', issuer: 'Cloudflare', domains: '*.bosch.tr', algo: 'RSA 2048', grade: 'A+' }, payments: [{ year: 2025, amount: 40, paid: true, date: '28.12.2024', inv: 'F-2025-0017' }, { year: 2026, amount: 40, paid: true, date: '27.12.2025', inv: 'F-2026-0014' }] },
  { id: 'SSL-02', customer: 'MegaMarka Perakende', service: 'SSL Standard', type: 'ssl', provider: 'cloudflare', start: '20.04.2026', end: '20.04.2027', amount: 15, period: 'yillik', autoRenew: false, status: 'active', company: 'bilisim', meta: { type: 'Domain Validated', issuer: 'Let’s Encrypt', domains: 'megamarka.com.tr', algo: 'ECC 256', grade: 'A' }, payments: [{ year: 2025, amount: 15, paid: true, date: '18.04.2025', inv: 'F-2025-0134' }, { year: 2026, amount: 15, paid: true, date: '17.04.2026', inv: 'F-2026-0105' }] },
  { id: 'SSL-03', customer: 'TechNova Yazılım', service: 'SSL Extended Validation', type: 'ssl', provider: 'manual', start: '10.05.2025', end: '10.05.2026', amount: 90, period: 'yillik', autoRenew: true, status: 'expiring', company: 'digital', meta: { type: 'Extended Validation', issuer: 'DigiCert (harici)', domains: 'technova.com', algo: 'RSA 4096', grade: 'A+' }, payments: [{ year: 2024, amount: 90, paid: true, date: '08.05.2024', inv: 'F-2024-0143' }, { year: 2025, amount: 90, paid: true, date: '09.05.2025', inv: 'F-2025-0167' }] },
  { id: 'BK-001', customer: 'BigBrand Reklam A.Ş.', service: 'Yıllık Bakım & Destek', type: 'bakim', provider: 'manual', start: '15.03.2025', end: '15.03.2026', amount: 250, period: 'yillik', autoRenew: false, status: 'stopped', company: 'digital', meta: { slaLevel: 'Gold', responseTime: '4 saat', ticketsThisMonth: 0, ticketsTotal: 28, lastTicket: '2 ay önce' }, payments: [{ year: 2024, amount: 180, paid: true, date: '10.03.2024', inv: 'F-2024-0084' }, { year: 2025, amount: 250, paid: true, date: '13.03.2025', inv: 'F-2025-0092' }] },
  { id: 'BK-002', customer: 'MegaMarka Perakende', service: 'Aylık Destek Paketi', type: 'bakim', provider: 'manual', start: '01.04.2026', end: '30.04.2026', amount: 60, period: 'aylik', autoRenew: true, status: 'active', company: 'bilisim', meta: { slaLevel: 'Silver', responseTime: '12 saat', ticketsThisMonth: 3, ticketsTotal: 42, lastTicket: 'dün' }, payments: [{ year: 2026, amount: 60, paid: true, date: '01.04.2026', inv: 'F-2026-0099' }] },
  { id: 'MZ-001', customer: 'FastGrow Digital', service: 'Shopify Mağaza Yayın', type: 'magaza', provider: 'manual', start: '01.04.2026', end: '30.04.2026', amount: 75, period: 'aylik', autoRenew: true, status: 'active', company: 'bilisim', meta: { platform: 'Shopify', products: 248, ordersThisMonth: 86, revenue: '$4K', lastSync: '1 saat önce' }, payments: [{ year: 2026, amount: 75, paid: true, date: '01.04.2026', inv: 'F-2026-0100' }] },
  { id: 'MZ-002', customer: 'Aydın Holding', service: 'Opencart Mağaza Yayın', type: 'magaza', provider: 'manual', start: '15.04.2026', end: '14.05.2026', amount: 40, period: 'aylik', autoRenew: true, status: 'active', company: 'digital', meta: { platform: 'Opencart', products: 612, ordersThisMonth: 34, revenue: '$2K', lastSync: '2 saat önce' }, payments: [{ year: 2026, amount: 40, paid: true, date: '15.04.2026', inv: 'F-2026-0103' }] },
  { id: 'AS-001', customer: 'Bosch Türkiye', service: 'Enterprise Antispam', type: 'antispam', provider: 'manual', start: '01.01.2026', end: '01.01.2027', amount: 120, period: 'yillik', autoRenew: true, status: 'active', company: 'digital', meta: { blockedThisMonth: 24800, falsePositives: 18, whitelistCount: 145, lastUpdate: '2 saat önce' }, payments: [{ year: 2024, amount: 120, paid: true, date: '29.12.2023', inv: 'F-2024-0015' }, { year: 2025, amount: 120, paid: true, date: '30.12.2024', inv: 'F-2025-0018' }, { year: 2026, amount: 120, paid: true, date: '28.12.2025', inv: 'F-2026-0016' }] },
  { id: 'AS-002', customer: 'Platin Otomotiv', service: 'Standard Antispam', type: 'antispam', provider: 'manual', start: '05.07.2025', end: '05.07.2026', amount: 40, period: 'yillik', autoRenew: true, status: 'active', company: 'digital', meta: { blockedThisMonth: 8400, falsePositives: 42, whitelistCount: 68, lastUpdate: '30 dk önce' }, payments: [{ year: 2024, amount: 40, paid: true, date: '02.07.2024', inv: 'F-2024-0202' }, { year: 2025, amount: 40, paid: true, date: '04.07.2025', inv: 'F-2025-0246' }] },
];

const META_LABELS: Record<string, string> = {
  registrar: 'Registrar', dns: 'DNS', nameservers: 'Name Server', whois: 'Whois', cpu: 'CPU', ram: 'RAM', disk: 'Disk', bandwidth: 'Bandwidth', sslEnabled: 'SSL', phpVersion: 'PHP', externalProvider: 'Sağlayıcı', uptime: 'Uptime', os: 'OS', location: 'Lokasyon', type: 'Sertifika Türü', issuer: 'Sertifika Veren', domains: 'Domainler', algo: 'Algoritma', grade: 'SSL Grade', slaLevel: 'SLA', responseTime: 'Yanıt Süresi', ticketsThisMonth: 'Bu Ay Ticket', ticketsTotal: 'Toplam Ticket', lastTicket: 'Son Ticket', platform: 'Platform', products: 'Ürün Sayısı', ordersThisMonth: 'Bu Ay Sipariş', revenue: 'Aylık Gelir', lastSync: 'Son Senkron', blockedThisMonth: 'Bu Ay Blok', falsePositives: 'False Positive', whitelistCount: 'Beyaz Liste', lastUpdate: 'Son Güncelleme',
};

function Svg({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">{children}</svg>;
}

function computeDaysLeft(endStr: string) {
  const [day, month, year] = endStr.split('.').map(Number);
  return Math.round((new Date(year, month - 1, day).getTime() - new Date(2026, 3, 24).getTime()) / (1000 * 60 * 60 * 24));
}

function money(value: number) {
  return `$${value.toLocaleString('tr-TR')}`;
}

function companyLabel(company: Company) {
  return company === 'digital' ? 'Digital' : 'Bilişim';
}

function companyFull(company: Company) {
  return company === 'digital' ? 'Arma Digital' : 'Arma Bilişim';
}

function companyColor(company: Company): ColorName {
  return company === 'digital' ? 'emerald' : 'indigo';
}

function providerConf(provider: Provider) {
  return provider !== 'manual' ? INTEG_CONF[provider] : null;
}

function ContentToast({ toast, onClose }: { toast: { title: string; text: string; color: ColorName } | null; onClose: () => void }) {
  if (!toast) return null;
  const cm = CM[toast.color];
  return (
    <div className="absolute right-4 top-4 z-50 w-[310px] bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-3">
      <div className="flex items-start gap-2">
        <div className={`w-8 h-8 ${cm.bg} rounded-md flex items-center justify-center shrink-0`}>
          <Svg className={`${cm.t} w-4 h-4`}><polyline points="20 6 9 17 4 12" /></Svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100">{toast.title}</p>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{toast.text}</p>
        </div>
        <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1">
          <Svg className="w-3.5 h-3.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Svg>
        </button>
      </div>
    </div>
  );
}

function ModalFrame({ children, onClose, maxWidth = 'max-w-[680px]' }: { children: ReactNode; onClose: () => void; maxWidth?: string }) {
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

function CloseButton({ onClose }: { onClose: () => void }) {
  return (
    <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1 shrink-0">
      <Svg className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Svg>
    </button>
  );
}

export default function DomainHosting() {
  const [tab, setTab] = useState<DomainTab>('overview');
  const [companyFilter, setCompanyFilter] = useState<CompanyFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [termFilter, setTermFilter] = useState<'all' | '30' | '60' | 'expired'>('all');
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<ModalType>(null);
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [preselectedType, setPreselectedType] = useState<ServiceType | undefined>();
  const [toast, setToast] = useState<{ title: string; text: string; color: ColorName } | null>(null);

  function showToast(title: string, text: string, color: ColorName) {
    setToast({ title, text, color });
    window.setTimeout(() => setToast(null), 2800);
  }

  function openModal(type: ModalType, id?: string, serviceType?: ServiceType) {
    setSelectedId(id);
    setPreselectedType(serviceType);
    setModal(type);
  }

  const scope = useMemo(() => (companyFilter === 'all' ? hizmetler : hizmetler.filter((item) => item.company === companyFilter)), [companyFilter]);
  const selectedService = selectedId ? hizmetler.find((item) => item.id === selectedId) : undefined;

  return (
    <div className="relative space-y-4">
      <ContentToast toast={toast} onClose={() => setToast(null)} />
      {modal === 'detail' && selectedService && <DetailModal service={selectedService} onClose={() => setModal(null)} onOpen={openModal} onToast={showToast} />}
      {modal === 'extend' && selectedService && <ExtendModal service={selectedService} onClose={() => setModal(null)} onToast={showToast} />}
      {modal === 'stop' && selectedService && <StopModal service={selectedService} onClose={() => setModal(null)} onToast={showToast} />}
      {modal === 'new' && <NewServiceModal preselectedType={preselectedType} onClose={() => setModal(null)} onToast={showToast} />}

      <HeaderSection
        scope={scope}
        onSync={() => showToast('Tüm Entegrasyonlar', 'Metunic, Plesk ve Cloudflare API’leri senkronize ediliyor · 18 kayıt güncellendi', 'teal')}
        onNew={() => openModal('new')}
      />
      <CompanyTabs companyFilter={companyFilter} setCompanyFilter={setCompanyFilter} />
      <TabStrip tab={tab} setTab={setTab} scope={scope} />
      <FilterBar search={search} setSearch={setSearch} statusFilter={statusFilter} setStatusFilter={setStatusFilter} termFilter={termFilter} setTermFilter={setTermFilter} />
      {tab === 'overview' ? (
        <Overview scope={scope} setTab={setTab} openDetail={(id) => openModal('detail', id)} />
      ) : (
        <ServiceTab
          type={tab}
          scope={scope}
          search={search}
          statusFilter={statusFilter}
          termFilter={termFilter}
          openDetail={(id) => openModal('detail', id)}
          openNew={(type) => openModal('new', undefined, type)}
          openExtend={(id) => openModal('extend', id)}
          openStop={(id) => openModal('stop', id)}
          onToast={showToast}
        />
      )}
    </div>
  );
}

function HeaderSection({ scope, onSync, onNew }: { scope: ServiceItem[]; onSync: () => void; onNew: () => void }) {
  return (
    <div className="flex items-center justify-between gap-3 flex-wrap">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 bg-teal-100 dark:bg-teal-500/20 rounded-lg flex items-center justify-center">
          <Svg className="text-teal-600 dark:text-teal-400 w-4 h-4">{HIZMET_TYPES.domain.icon}</Svg>
        </div>
        <div>
          <h1 className="text-[19px] font-bold text-gray-900 dark:text-gray-100 leading-tight">Domain / Hosting</h1>
          <p className="text-[11px] text-gray-500 dark:text-gray-400">{scope.length} hizmet · 3 entegrasyon · {scope.filter((item) => item.provider !== 'manual').length} otomatik yönetilen · {scope.filter((item) => item.provider === 'manual').length} manuel</p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <button type="button" onClick={onSync} className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-[11px] font-semibold rounded-md hover:bg-gray-50">
          <Svg className="w-3.5 h-3.5"><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></Svg>
          Tümünü Senkron Et
        </button>
        <button type="button" onClick={onNew} className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-bold rounded-md shadow-sm">
          <Svg className="w-3.5 h-3.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></Svg>
          Yeni Hizmet Ekle
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
          <button key={item.key} type="button" onClick={() => setCompanyFilter(item.key)} className={`px-3 py-1.5 text-[11px] font-semibold rounded-md border transition-all ${active ? `${cm.bg} ${cm.t} ${cm.border} border-2` : 'bg-white dark:bg-[#1e1f26] border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#23242c]'}`}>
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

function TabStrip({ tab, setTab, scope }: { tab: DomainTab; setTab: (tab: DomainTab) => void; scope: ServiceItem[] }) {
  const tabDefs = [
    { k: 'overview' as const, lbl: 'Genel Bakış', icon: <><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></>, clr: 'gray' as ColorName },
    ...Object.entries(HIZMET_TYPES).map(([key, value]) => ({ k: key as ServiceType, lbl: value.lbl, icon: value.icon, count: scope.filter((item) => item.type === key).length, clr: value.clr })),
  ];
  return (
    <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <div className="flex items-center gap-0.5 p-1.5 min-w-max">
          {tabDefs.map((item) => {
            const active = tab === item.k;
            const cm = CM[item.clr];
            return (
              <button key={item.k} type="button" onClick={() => setTab(item.k)} className={`flex items-center gap-1.5 px-3 py-2 text-[11px] font-semibold rounded-md transition-all shrink-0 ${active ? `${cm.bg} ${cm.t} ${cm.border} border-2` : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}>
                <Svg className="w-3.5 h-3.5 shrink-0">{item.icon}</Svg>
                {item.lbl}
                {'count' in item && item.count !== undefined && <span className={`text-[9px] font-mono ${active ? 'opacity-80' : 'opacity-60'}`}>({item.count})</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function FilterBar({ search, setSearch, statusFilter, setStatusFilter, termFilter, setTermFilter }: {
  search: string;
  setSearch: (value: string) => void;
  statusFilter: StatusFilter;
  setStatusFilter: (value: StatusFilter) => void;
  termFilter: 'all' | '30' | '60' | 'expired';
  setTermFilter: (value: 'all' | '30' | '60' | 'expired') => void;
}) {
  return (
    <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-2.5 flex items-center justify-between gap-2 flex-wrap">
      <div className="relative">
        <Svg className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></Svg>
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Müşteri, domain, hizmet ara..." className="pl-7 pr-2 py-1.5 text-[10px] bg-gray-50 dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded text-gray-900 dark:text-gray-100 focus:outline-none focus:border-teal-500 w-60 max-w-full" />
      </div>
      <div className="flex items-center gap-1 flex-wrap">
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as StatusFilter)} className="px-2 py-1.5 text-[10px] bg-gray-50 dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded text-gray-900 dark:text-gray-100 focus:outline-none focus:border-teal-500">
          <option value="all">Tüm Durumlar</option>
          <option value="active">Açık</option>
          <option value="expiring">Bitiyor</option>
          <option value="expired">Süresi Doldu</option>
          <option value="stopped">Kapalı</option>
        </select>
        <select value={termFilter} onChange={(event) => setTermFilter(event.target.value as 'all' | '30' | '60' | 'expired')} className="px-2 py-1.5 text-[10px] bg-gray-50 dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded text-gray-900 dark:text-gray-100 focus:outline-none focus:border-teal-500">
          <option value="all">Tüm Bitişler</option>
          <option value="30">30 gün içinde</option>
          <option value="60">60 gün içinde</option>
          <option value="expired">Süresi geçmiş</option>
        </select>
      </div>
    </div>
  );
}

function Overview({ scope, setTab, openDetail }: { scope: ServiceItem[]; setTab: (tab: DomainTab) => void; openDetail: (id: string) => void }) {
  const activeScope = scope.filter((item) => item.status === 'active' || item.status === 'expiring');
  const yillikTop = activeScope.reduce((sum, item) => sum + (item.period === 'yillik' ? item.amount : item.amount * 12), 0);
  const aylikTop = activeScope.reduce((sum, item) => sum + (item.period === 'yillik' ? item.amount / 12 : item.amount), 0);
  const expiring30 = scope.filter((item) => {
    const days = computeDaysLeft(item.end);
    return days >= 0 && days <= 30 && (item.status === 'active' || item.status === 'expiring');
  }).length;

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3">
        {[
          { label: 'Toplam Hizmet', value: String(scope.length), sub: `${scope.filter((item) => item.status === 'active').length} aktif`, clr: 'teal' as ColorName },
          { label: 'Yıllık Ciro', value: `$${(yillikTop / 1000).toFixed(0)}K`, sub: 'Aktif hizmetler toplamı', clr: 'emerald' as ColorName },
          { label: 'Aylık Ortalama', value: `$${(aylikTop / 1000).toFixed(1)}K`, sub: `Hizmet başı $${Math.round(aylikTop / Math.max(1, activeScope.length))}`, clr: 'sky' as ColorName },
          { label: 'Otomatik Yönetilen', value: String(scope.filter((item) => item.provider !== 'manual').length), sub: 'Metunic+Plesk+Cloudflare', clr: 'indigo' as ColorName },
          { label: 'Manuel Yönetilen', value: String(scope.filter((item) => item.provider === 'manual').length), sub: 'Dış sağlayıcı', clr: 'violet' as ColorName },
          { label: 'Bitmek Üzere', value: String(expiring30), sub: '30 gün içinde yenilenmeli', clr: 'amber' as ColorName },
        ].map((card) => {
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
      <IntegrationsPanel scope={scope} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <DistributionPanel scope={scope} setTab={setTab} />
        <UpcomingRenewals scope={scope} openDetail={openDetail} />
      </div>
    </>
  );
}

function IntegrationsPanel({ scope }: { scope: ServiceItem[] }) {
  return (
    <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
      <div className="p-3 border-b border-gray-100 dark:border-gray-700/40 flex items-center gap-2">
        <Svg className="text-teal-600 dark:text-teal-400 w-4 h-4"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></Svg>
        <h3 className="text-[13px] font-bold text-gray-900 dark:text-gray-100">Bağlı Entegrasyonlar</h3>
        <span className="ml-auto text-[9px] text-gray-500">3 sağlayıcı aktif</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3">
        {Object.entries(INTEG_CONF).map(([key, item]) => {
          const provider = key as Exclude<Provider, 'manual'>;
          const cm = CM[item.clr];
          const count = scope.filter((service) => service.provider === provider).length;
          const types = Object.values(HIZMET_TYPES).filter((type) => type.integ === provider).map((type) => type.lbl).join(' · ');
          return (
            <div key={key} className={`p-3 ${cm.bg} border ${cm.border} rounded-lg`}>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-9 h-9 bg-white dark:bg-[#1e1f26] rounded-lg flex items-center justify-center shrink-0">
                    <Svg className={`${cm.t} w-4 h-4`}>{item.icon}</Svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold text-gray-900 dark:text-gray-100">{item.lbl}</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">{item.desc}</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 rounded shrink-0">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />BAĞLI
                </span>
              </div>
              <div className={`grid grid-cols-2 gap-2 pt-2 border-t ${cm.border} text-[10px]`}>
                <div><p className="text-gray-500 dark:text-gray-400">Hizmet</p><p className={`font-bold ${cm.t} font-mono`}>{count}</p></div>
                <div><p className="text-gray-500 dark:text-gray-400">Son senkron</p><p className="font-semibold text-gray-700 dark:text-gray-300">{item.lastSync}</p></div>
              </div>
              <p className="text-[9px] text-gray-500 dark:text-gray-400 mt-2 truncate">{types}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DistributionPanel({ scope, setTab }: { scope: ServiceItem[]; setTab: (tab: DomainTab) => void }) {
  return (
    <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
      <div className="p-3 border-b border-gray-100 dark:border-gray-700/40 flex items-center gap-2">
        <Svg className="text-teal-600 dark:text-teal-400 w-3.5 h-3.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="2" x2="12" y2="22" /></Svg>
        <h3 className="text-[12px] font-bold text-gray-900 dark:text-gray-100">Hizmet Türü Dağılımı</h3>
      </div>
      <div className="p-3 space-y-2">
        {Object.entries(HIZMET_TYPES).map(([key, item]) => {
          const type = key as ServiceType;
          const count = scope.filter((service) => service.type === type).length;
          const active = scope.filter((service) => service.type === type && (service.status === 'active' || service.status === 'expiring')).length;
          const pct = scope.length ? Math.round((count / scope.length) * 100) : 0;
          const cm = CM[item.clr];
          return (
            <button key={key} type="button" onClick={() => setTab(type)} className="w-full flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 p-1.5 rounded text-left">
              <div className={`w-7 h-7 ${cm.bg} rounded flex items-center justify-center shrink-0`}><Svg className={`${cm.t} w-3.5 h-3.5`}>{item.icon}</Svg></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between text-[10px] mb-0.5">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">{item.lbl}</span>
                  <span className="font-mono text-gray-500 dark:text-gray-400"><span className={`font-bold ${cm.t}`}>{count}</span> · {active} aktif</span>
                </div>
                <div className="h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className={`h-full ${cm.bar} rounded-full`} style={{ width: `${pct}%` }} />
                </div>
              </div>
              <span className="text-gray-400 shrink-0"><Svg className="w-3 h-3"><polyline points="9 18 15 12 9 6" /></Svg></span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function UpcomingRenewals({ scope, openDetail }: { scope: ServiceItem[]; openDetail: (id: string) => void }) {
  const items = scope.filter((item) => {
    const days = computeDaysLeft(item.end);
    return days <= 60 && (item.status === 'active' || item.status === 'expiring' || item.status === 'expired');
  }).sort((a, b) => computeDaysLeft(a.end) - computeDaysLeft(b.end));

  return (
    <div className="bg-gradient-to-br from-amber-50 to-rose-50/50 dark:from-amber-500/5 dark:to-rose-500/5 border border-amber-200 dark:border-amber-500/30 rounded-xl overflow-hidden">
      <div className="p-3 border-b border-amber-200/50 dark:border-amber-500/20 flex items-center gap-2">
        <Svg className="text-amber-600 dark:text-amber-400 w-3.5 h-3.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></Svg>
        <h3 className="text-[12px] font-bold text-amber-900 dark:text-amber-200">Yaklaşan Yenilemeler (60 gün)</h3>
      </div>
      <div className="divide-y divide-amber-100 dark:divide-amber-500/20">
        {items.map((item) => {
          const days = computeDaysLeft(item.end);
          const tc = HIZMET_TYPES[item.type];
          const cm = CM[tc.clr];
          const ucm = CM[days < 0 || days <= 7 ? 'rose' : days <= 30 ? 'amber' : 'gray'];
          return (
            <button key={item.id} type="button" onClick={() => openDetail(item.id)} className="w-full p-2.5 flex items-center justify-between gap-2 hover:bg-white/50 dark:hover:bg-white/5 cursor-pointer text-left">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <div className={`w-7 h-7 ${cm.bg} rounded flex items-center justify-center shrink-0`}><Svg className={`${cm.t} w-3 h-3`}>{tc.icon}</Svg></div>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold text-gray-900 dark:text-gray-100 truncate">{item.customer}</p>
                  <p className="text-[9px] text-gray-500 dark:text-gray-400 truncate">{item.service}</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className={`text-[11px] font-bold font-mono ${ucm.t}`}>{days < 0 ? `${Math.abs(days)}g geçti` : `${days}g`}</p>
                <p className="text-[9px] text-gray-500 dark:text-gray-400 font-mono">{money(item.amount / 1000)}K</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ServiceTab({ type, scope, search, statusFilter, termFilter, openDetail, openNew, openExtend, openStop, onToast }: {
  type: ServiceType;
  scope: ServiceItem[];
  search: string;
  statusFilter: StatusFilter;
  termFilter: 'all' | '30' | '60' | 'expired';
  openDetail: (id: string) => void;
  openNew: (type: ServiceType) => void;
  openExtend: (id: string) => void;
  openStop: (id: string) => void;
  onToast: (title: string, text: string, color: ColorName) => void;
}) {
  const tc = HIZMET_TYPES[type];
  const cm = CM[tc.clr];
  const services = scope.filter((item) => {
    if (item.type !== type) return false;
    if (statusFilter !== 'all' && item.status !== statusFilter) return false;
    const days = computeDaysLeft(item.end);
    if (termFilter === '30' && !(days >= 0 && days <= 30)) return false;
    if (termFilter === '60' && !(days >= 0 && days <= 60)) return false;
    if (termFilter === 'expired' && days >= 0) return false;
    const q = search.trim().toLocaleLowerCase('tr-TR');
    return !q || `${item.customer} ${item.service} ${item.id}`.toLocaleLowerCase('tr-TR').includes(q);
  });
  const integrated = services.filter((item) => item.provider !== 'manual');
  const manual = services.filter((item) => item.provider === 'manual');
  const active = services.filter((item) => item.status === 'active' || item.status === 'expiring');
  const yearlyTotal = active.reduce((sum, item) => sum + (item.period === 'yillik' ? item.amount : item.amount * 12), 0);

  return (
    <>
      <KpiForType type={type} services={services} active={active} yearlyTotal={yearlyTotal} />
      {tc.integ && <IntegrationBanner type={type} services={services} onToast={onToast} />}
      {integrated.length > 0 && <TablePanel title={`Otomatik Yönetilen ${tc.lbl}`} badge={`${integrated.length} kayıt`} integrated items={integrated} type={type} openDetail={openDetail} openExtend={openExtend} openStop={openStop} onToast={onToast} />}
      {manual.length > 0 && <TablePanel title={`Manuel Yönetilen ${tc.lbl}`} badge={`${manual.length} kayıt`} items={manual} type={type} openDetail={openDetail} openExtend={openExtend} openStop={openStop} onToast={onToast} />}
      {services.length === 0 && (
        <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-12 text-center">
          <div className={`w-16 h-16 ${cm.bg} rounded-full flex items-center justify-center mx-auto mb-3`}>
            <Svg className={`${cm.t} w-8 h-8`}>{tc.icon}</Svg>
          </div>
          <p className="text-[14px] font-bold text-gray-900 dark:text-gray-100 mb-1">Henüz {tc.lbl} eklenmemiş</p>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-4">Bu kategoriye ilk hizmetinizi ekleyin</p>
          <button type="button" onClick={() => openNew(type)} className={`inline-flex items-center gap-1.5 px-4 py-2 ${cm.solid} ${cm.hover} text-white text-[11px] font-bold rounded-md`}>
            <Svg className="w-3.5 h-3.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></Svg>
            {tc.lbl} Ekle
          </button>
        </div>
      )}
    </>
  );
}

function KpiForType({ type, services, active, yearlyTotal }: { type: ServiceType; services: ServiceItem[]; active: ServiceItem[]; yearlyTotal: number }) {
  const tc = HIZMET_TYPES[type];
  const totalTickets = services.reduce((sum, item) => sum + Number(item.meta.ticketsThisMonth || 0), 0);
  const totalOrders = services.reduce((sum, item) => sum + Number(item.meta.ordersThisMonth || 0), 0);
  const totalBlocked = services.reduce((sum, item) => sum + Number(item.meta.blockedThisMonth || 0), 0);
  const cardsByType: Record<ServiceType, { label: string; value: string; sub: string; clr: ColorName }[]> = {
    domain: [{ label: 'Toplam Domain', value: String(services.length), sub: `${active.length} aktif`, clr: tc.clr }, { label: 'Yıllık Maliyet', value: `$${(yearlyTotal / 1000).toFixed(1)}K`, sub: 'Tüm domainler', clr: 'emerald' }, { label: 'Ortalama .com', value: `$${Math.round(yearlyTotal / Math.max(1, active.length))}`, sub: 'Domain başı/yıl', clr: 'sky' }, { label: 'Otomatik Uzatma', value: `${services.filter((item) => item.autoRenew).length}/${services.length}`, sub: 'AÇIK olan', clr: 'indigo' }],
    hosting: [{ label: 'Toplam Hosting', value: String(services.length), sub: `${active.length} aktif`, clr: tc.clr }, { label: 'Yıllık Gelir', value: `$${(yearlyTotal / 1000).toFixed(0)}K`, sub: 'Tüm planlar', clr: 'emerald' }, { label: 'Ort. CPU', value: '%38', sub: 'Plesk sunucularda', clr: 'sky' }, { label: 'SSL Aktif', value: `${active.filter((item) => item.meta.sslEnabled).length}/${active.length}`, sub: 'HTTPS sertifikalı', clr: 'emerald' }],
    vds: [{ label: 'Toplam VDS', value: String(services.length), sub: `${active.length} çalışan`, clr: tc.clr }, { label: 'Yıllık Maliyet', value: `$${(yearlyTotal / 1000).toFixed(0)}K`, sub: 'Tüm serverlar', clr: 'emerald' }, { label: 'Ort. Uptime', value: '99.96%', sub: 'Son 30 gün', clr: 'emerald' }, { label: 'Ort. CPU Kullanım', value: '%45', sub: 'Plesk monitor', clr: 'sky' }],
    ssl: [{ label: 'Toplam Sertifika', value: String(services.length), sub: `${active.length} geçerli`, clr: tc.clr }, { label: 'Yıllık Maliyet', value: `$${(yearlyTotal / 1000).toFixed(1)}K`, sub: 'Tüm SSL', clr: 'emerald' }, { label: 'Wildcard', value: String(services.filter((item) => item.meta.type === 'Wildcard').length), sub: '*.domain şeklinde', clr: 'violet' }, { label: 'Bitmek Üzere', value: String(services.filter((item) => item.status === 'expiring').length), sub: '30 gün içinde', clr: 'amber' }],
    bakim: [{ label: 'Aktif Kontrat', value: String(active.length), sub: `${services.length} toplam`, clr: tc.clr }, { label: 'Yıllık Gelir', value: `$${(yearlyTotal / 1000).toFixed(0)}K`, sub: 'Bakım paketi', clr: 'emerald' }, { label: 'Bu Ay Ticket', value: String(totalTickets), sub: 'Açık talepler', clr: 'sky' }, { label: 'Ort. Yanıt Süresi', value: '4.8 saat', sub: 'SLA hedefi', clr: 'violet' }],
    magaza: [{ label: 'Aktif Mağaza', value: String(active.length), sub: `${services.length} toplam`, clr: tc.clr }, { label: 'Aylık Gelir', value: `$${(active.reduce((sum, item) => sum + item.amount, 0) / 1000).toFixed(1)}K`, sub: 'Platform ücreti', clr: 'emerald' }, { label: 'Bu Ay Sipariş', value: String(totalOrders), sub: 'Tüm mağazalar toplam', clr: 'sky' }, { label: 'Platform', value: '2', sub: 'Shopify · Opencart', clr: 'violet' }],
    antispam: [{ label: 'Aktif Hizmet', value: String(active.length), sub: `${services.length} toplam`, clr: tc.clr }, { label: 'Yıllık Gelir', value: `$${(yearlyTotal / 1000).toFixed(1)}K`, sub: 'Antispam paketi', clr: 'emerald' }, { label: 'Bu Ay Blok', value: `${(totalBlocked / 1000).toFixed(1)}K`, sub: 'Spam engellenen', clr: 'rose' }, { label: 'False Positive', value: '<%1', sub: 'İyi filtreleme', clr: 'emerald' }],
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
      {cardsByType[type].map((card) => {
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

function IntegrationBanner({ type, services, onToast }: { type: ServiceType; services: ServiceItem[]; onToast: (title: string, text: string, color: ColorName) => void }) {
  const tc = HIZMET_TYPES[type];
  if (!tc.integ) return null;
  const ic = INTEG_CONF[tc.integ];
  const cm = CM[ic.clr];
  const integrated = services.filter((item) => item.provider !== 'manual');
  return (
    <div className={`bg-gradient-to-br from-${ic.clr}-50 to-${ic.clr}-50/50 dark:from-${ic.clr}-500/10 dark:to-${ic.clr}-500/5 border ${cm.border} rounded-xl p-3 flex items-center justify-between gap-3 flex-wrap`}>
      <div className="flex items-center gap-3 min-w-0">
        <div className={`w-11 h-11 ${cm.bg} rounded-lg flex items-center justify-center shrink-0`}><Svg className={`${cm.t} w-5 h-5`}>{ic.icon}</Svg></div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className="text-[13px] font-bold text-gray-900 dark:text-gray-100">{ic.lbl} Entegrasyonu</p>
            <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 rounded"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />BAĞLI</span>
          </div>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{ic.desc} · {integrated.length} {tc.lbl} otomatik yönetiliyor · son senkron {ic.lastSync}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button type="button" onClick={() => onToast(`${ic.lbl} Senkron`, 'API’den güncel veriler çekiliyor', ic.clr)} className={`flex items-center gap-1 px-2.5 py-1.5 bg-white dark:bg-[#1e1f26] border ${cm.border} ${cm.t} text-[10px] font-semibold rounded hover:bg-${ic.clr}-50`}>
          <Svg className="w-3 h-3"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></Svg>
          Senkron
        </button>
        <button type="button" onClick={() => onToast(`${ic.lbl} Panel`, `${ic.lbl} paneli açılıyor`, ic.clr)} className={`flex items-center gap-1 px-2.5 py-1.5 ${cm.solid} ${cm.hover} text-white text-[10px] font-bold rounded`}>
          Panel Aç
          <Svg className="w-3 h-3"><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></Svg>
        </button>
      </div>
    </div>
  );
}

function TablePanel({ title, badge, items, type, integrated = false, openDetail, openExtend, openStop, onToast }: {
  title: string;
  badge: string;
  items: ServiceItem[];
  type: ServiceType;
  integrated?: boolean;
  openDetail: (id: string) => void;
  openExtend: (id: string) => void;
  openStop: (id: string) => void;
  onToast: (title: string, text: string, color: ColorName) => void;
}) {
  return (
    <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
      <div className="p-3 border-b border-gray-100 dark:border-gray-700/40 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Svg className={`${integrated ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-600 dark:text-gray-400'} w-4 h-4`}>{integrated ? <polyline points="20 6 9 17 4 12" /> : <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />}</Svg>
          <h3 className="text-[13px] font-bold text-gray-900 dark:text-gray-100">{title}</h3>
          <span className={`${integrated ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'} text-[9px] font-bold px-1.5 py-0.5 rounded`}>{badge}</span>
        </div>
        <span className="text-[9px] text-gray-500">{integrated ? 'Entegre panel' : 'Dış sağlayıcı veya bağımsız takip'}</span>
      </div>
      <ServiceTable items={items} type={type} integrated={integrated} openDetail={openDetail} openExtend={openExtend} openStop={openStop} onToast={onToast} />
    </div>
  );
}

function ServiceTable({ items, type, integrated, openDetail, openExtend, openStop, onToast }: {
  items: ServiceItem[];
  type: ServiceType;
  integrated: boolean;
  openDetail: (id: string) => void;
  openExtend: (id: string) => void;
  openStop: (id: string) => void;
  onToast: (title: string, text: string, color: ColorName) => void;
}) {
  const secondHeader = type === 'domain' ? 'Domain' : type === 'hosting' ? 'Plan' : type === 'vds' ? 'Spesifikasyon' : type === 'ssl' ? 'Sertifika' : type === 'bakim' ? 'Paket' : type === 'magaza' ? 'Platform' : 'Paket';
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[11px]">
        <thead className="bg-gray-50 dark:bg-[#17181f]">
          <tr className="border-b border-gray-200 dark:border-gray-700/30">
            <th className="text-left px-3 py-2 font-semibold text-gray-500 dark:text-gray-400">Müşteri</th>
            <th className="text-left px-3 py-2 font-semibold text-gray-500 dark:text-gray-400">{secondHeader}</th>
            <th className="text-left px-3 py-2 font-semibold text-gray-500 dark:text-gray-400 hidden lg:table-cell">{integrated ? 'Sağlayıcı' : 'Kaynak'}</th>
            <th className="text-center px-3 py-2 font-semibold text-gray-500 dark:text-gray-400 hidden md:table-cell w-20">Şirket</th>
            <th className="text-left px-3 py-2 font-semibold text-gray-500 dark:text-gray-400 hidden md:table-cell">Bitiş</th>
            <th className="text-right px-3 py-2 font-semibold text-gray-500 dark:text-gray-400">Tutar</th>
            <th className="text-center px-3 py-2 font-semibold text-gray-500 dark:text-gray-400 hidden md:table-cell w-20">Oto. Uzat</th>
            <th className="text-center px-3 py-2 font-semibold text-gray-500 dark:text-gray-400 w-28">Durum</th>
            <th className="text-right px-3 py-2 font-semibold text-gray-500 dark:text-gray-400 w-24">İşlem</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700/30">
          {items.map((item) => <ServiceRow key={item.id} item={item} openDetail={openDetail} openExtend={openExtend} openStop={openStop} onToast={onToast} />)}
        </tbody>
      </table>
    </div>
  );
}

function ServiceRow({ item, openDetail, openExtend, openStop, onToast }: { item: ServiceItem; openDetail: (id: string) => void; openExtend: (id: string) => void; openStop: (id: string) => void; onToast: (title: string, text: string, color: ColorName) => void }) {
  const sc = STATUS_CONF[item.status];
  const scm = CM[sc.clr];
  const ccm = CM[companyColor(item.company)];
  const pc = providerConf(item.provider);
  const pcm = pc ? CM[pc.clr] : null;
  const days = computeDaysLeft(item.end);
  const metaLine = item.meta.platform || item.meta.type || item.meta.slaLevel;
  return (
    <tr className={`hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer ${item.status === 'stopped' || item.status === 'expired' ? 'opacity-70' : ''}`} onClick={() => openDetail(item.id)}>
      <td className="px-3 py-2.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-gray-700 dark:text-gray-300 font-medium truncate">{item.customer}</span>
          {item.customer.includes('Bosch') && <span className="text-[8px] font-bold px-1 py-0.5 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 rounded shrink-0">★</span>}
        </div>
        <p className="text-[9px] text-gray-400 dark:text-gray-500 font-mono">{item.id}</p>
      </td>
      <td className="px-3 py-2.5">
        <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">{item.service}</p>
        {metaLine && <p className="text-[9px] text-gray-400 dark:text-gray-500">{String(metaLine)}</p>}
      </td>
      <td className="px-3 py-2.5 hidden lg:table-cell">
        {pc && pcm ? (
          <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 ${pcm.bg} ${pcm.t} rounded font-mono`}>{pc.lbl}</span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded">{String(item.meta.externalProvider || item.meta.registrar || 'Manuel')}</span>
        )}
      </td>
      <td className="px-3 py-2.5 text-center hidden md:table-cell"><span className={`inline-block min-w-[52px] text-center text-[9px] font-bold px-1.5 py-0.5 ${ccm.bg} ${ccm.t} rounded`}>{companyLabel(item.company)}</span></td>
      <td className="px-3 py-2.5 hidden md:table-cell">
        <p className={`font-mono text-[10px] ${item.status === 'expired' ? 'text-rose-600 dark:text-rose-400 font-bold' : item.status === 'expiring' ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-gray-600 dark:text-gray-400'}`}>{item.end}</p>
        <p className="text-[9px] text-gray-400 dark:text-gray-500">{days < 0 ? `${Math.abs(days)}g geçti` : days === 0 ? 'BUGÜN!' : `${days} gün`}</p>
      </td>
      <td className="px-3 py-2.5 text-right">
        <p className="font-mono font-bold text-gray-900 dark:text-gray-100">{money(item.amount)}</p>
        <p className="text-[9px] text-gray-400 dark:text-gray-500">/{item.period === 'yillik' ? 'yıl' : 'ay'}</p>
      </td>
      <td className="px-3 py-2.5 text-center hidden md:table-cell">
        <button type="button" onClick={(event) => { event.stopPropagation(); onToast('Otomatik Uzatma', `${item.id} için ayar güncellendi`, 'teal'); }} className={`inline-flex items-center ${item.autoRenew ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-700'} rounded-full w-9 h-5 transition-colors relative`} title={item.autoRenew ? 'Otomatik uzatma AÇIK' : 'Otomatik uzatma KAPALI'}>
          <span className={`absolute ${item.autoRenew ? 'right-0.5' : 'left-0.5'} w-4 h-4 bg-white rounded-full shadow`} />
        </button>
      </td>
      <td className="px-3 py-2.5 text-center">
        <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 ${scm.bg} ${scm.t} rounded`}>
          {sc.dot && <span className={`w-1.5 h-1.5 ${sc.clr === 'rose' ? 'bg-rose-500' : 'bg-amber-500'} rounded-full animate-pulse`} />}
          {sc.lbl}
        </span>
      </td>
      <td className="px-3 py-2.5 text-right">
        <div className="flex items-center justify-end gap-1">
          {item.status !== 'stopped' ? (
            <button type="button" onClick={(event) => { event.stopPropagation(); openStop(item.id); }} className="p-1 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/20 rounded" title="Durdur">
              <Svg className="w-3.5 h-3.5"><rect x="6" y="6" width="12" height="12" rx="1" /></Svg>
            </button>
          ) : (
            <button type="button" onClick={(event) => { event.stopPropagation(); onToast('Aktif Edildi', `${item.service} yeniden aktif`, 'emerald'); }} className="p-1 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 rounded" title="Aktif Et">
              <Svg className="w-3.5 h-3.5"><polygon points="5 3 19 12 5 21 5 3" /></Svg>
            </button>
          )}
          {(item.status === 'expired' || item.status === 'expiring') && (
            <button type="button" onClick={(event) => { event.stopPropagation(); openExtend(item.id); }} className="p-1 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 rounded" title="Uzat">
              <Svg className="w-3.5 h-3.5"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></Svg>
            </button>
          )}
          <button type="button" onClick={(event) => { event.stopPropagation(); openDetail(item.id); }} className="p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded" title="Detay">
            <Svg className="w-3.5 h-3.5"><polyline points="9 18 15 12 9 6" /></Svg>
          </button>
        </div>
      </td>
    </tr>
  );
}

function DetailModal({ service, onClose, onOpen, onToast }: { service: ServiceItem; onClose: () => void; onOpen: (modal: ModalType, id?: string) => void; onToast: (title: string, text: string, color: ColorName) => void }) {
  const tc = HIZMET_TYPES[service.type];
  const cm = CM[tc.clr];
  const sc = STATUS_CONF[service.status];
  const scm = CM[sc.clr];
  const pc = providerConf(service.provider);
  const days = computeDaysLeft(service.end);
  const totalPaid = service.payments.filter((payment) => payment.paid).reduce((sum, payment) => sum + payment.amount, 0);
  const totalUnpaid = service.payments.filter((payment) => !payment.paid).reduce((sum, payment) => sum + payment.amount, 0);
  const actions = getActionsForType(service.type);

  return (
    <ModalFrame onClose={onClose} maxWidth="max-w-[820px]">
      <div className="sticky top-0 z-10 bg-white dark:bg-[#1e1f26] border-b border-gray-100 dark:border-gray-700/60 p-5 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className={`w-12 h-12 ${cm.bg} rounded-lg flex items-center justify-center shrink-0`}><Svg className={`${cm.t} w-6 h-6`}>{tc.icon}</Svg></div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
              <h2 className="text-[16px] font-black text-gray-900 dark:text-gray-100 truncate">{service.service}</h2>
              <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 ${scm.bg} ${scm.t} rounded`}>{sc.lbl}</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap text-[11px] text-gray-500 dark:text-gray-400">
              <span className="font-mono">{service.id}</span><span>·</span><span>{tc.lbl}</span>{pc && <><span>·</span><span className={`${CM[pc.clr].t} font-semibold`}>{pc.lbl}</span></>}
            </div>
          </div>
        </div>
        <CloseButton onClose={onClose} />
      </div>
      <div className="p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3 bg-gray-50 dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-lg">
            <p className="text-[9px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Müşteri</p>
            <div className="flex items-center gap-1.5 mb-1">
              <p className="text-[14px] font-bold text-gray-900 dark:text-gray-100">{service.customer}</p>
              {service.customer.includes('Bosch') && <span className="text-[8px] font-bold px-1 py-0.5 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 rounded">★ VIP</span>}
            </div>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">Şirket: <span className={`font-semibold ${CM[companyColor(service.company)].t}`}>{companyFull(service.company)}</span></p>
          </div>
          <div className={`p-3 ${cm.bg} border ${cm.border} rounded-lg`}>
            <p className={`text-[9px] font-semibold ${cm.t} uppercase tracking-wider mb-1`}>Sözleşme</p>
            <div className="flex items-baseline gap-2">
              <p className={`text-[18px] font-black ${cm.t} font-mono`}>{money(service.amount)}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">/{service.period === 'yillik' ? 'yıl' : 'ay'}</p>
            </div>
            <p className="text-[10px] text-gray-600 dark:text-gray-400 mt-0.5">{service.start} → <span className={service.status === 'expired' ? 'text-rose-600 font-bold' : service.status === 'expiring' ? 'text-amber-600 font-bold' : ''}>{service.end}</span> {days >= 0 ? `(${days}g)` : `(${Math.abs(days)}g geçti)`}</p>
          </div>
        </div>
        <div className="p-3 bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">{tc.lbl} Hızlı Aksiyonlar</p>
            <span className="text-[9px] text-gray-500">{pc ? `${pc.lbl} API ile` : 'Manuel'}</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {actions.map((action) => {
              const acm = CM[action.clr];
              return (
                <button key={action.lbl} type="button" onClick={() => onToast(action.lbl, `${service.service} üzerinde ${action.lbl} işlemi başlatıldı`, action.clr)} className={`flex flex-col items-center justify-center gap-1.5 p-3 ${acm.bg} border ${acm.border} rounded-lg transition-all`}>
                  <Svg className={`${acm.t} w-4 h-4`}>{action.icon}</Svg>
                  <span className={`text-[10px] font-bold ${acm.t}`}>{action.lbl}</span>
                </button>
              );
            })}
          </div>
        </div>
        <MetaPanel service={service} />
        <PaymentsPanel service={service} totalPaid={totalPaid} totalUnpaid={totalUnpaid} onToast={onToast} onClose={onClose} />
        <div className={`p-3 bg-gradient-to-br from-${tc.clr}-50 to-${tc.clr}-50/50 dark:from-${tc.clr}-500/10 dark:to-${tc.clr}-500/5 border ${cm.border} rounded-lg`}>
          <p className={`text-[10px] font-bold ${cm.t} uppercase tracking-wider mb-2`}>Hizmet Yönetimi</p>
          <div className="flex items-center gap-2 flex-wrap">
            <button type="button" onClick={() => onOpen('extend', service.id)} className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-md">
              <Svg className="w-3.5 h-3.5"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></Svg>
              Manuel Uzat
            </button>
            <button type="button" onClick={() => onToast('Otomatik Uzatma', `${service.id} için ayar güncellendi`, 'teal')} className={`flex items-center gap-1.5 px-3 py-2 ${service.autoRenew ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'} border border-emerald-200 dark:border-emerald-500/30 text-[11px] font-bold rounded-md hover:bg-emerald-200`}>
              <span className={`inline-flex items-center ${service.autoRenew ? 'bg-emerald-500' : 'bg-gray-400'} rounded-full w-7 h-4 relative shrink-0`}><span className={`absolute ${service.autoRenew ? 'right-0.5' : 'left-0.5'} w-3 h-3 bg-white rounded-full`} /></span>
              Oto. Uzatma {service.autoRenew ? 'AÇIK' : 'KAPALI'}
            </button>
            {service.status !== 'stopped' ? (
              <button type="button" onClick={() => onOpen('stop', service.id)} className="flex items-center gap-1.5 px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold rounded-md ml-auto">
                <Svg className="w-3.5 h-3.5"><rect x="6" y="6" width="12" height="12" rx="1" /></Svg>
                Hizmeti Durdur
              </button>
            ) : (
              <button type="button" onClick={() => { onToast('Aktif Edildi', `${service.service} yeniden aktif edildi`, 'emerald'); onClose(); }} className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-md ml-auto">
                <Svg className="w-3.5 h-3.5"><polygon points="5 3 19 12 5 21 5 3" /></Svg>
                Aktif Et
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="sticky bottom-0 bg-white dark:bg-[#1e1f26] border-t border-gray-100 dark:border-gray-700/60 p-3 flex items-center justify-between gap-2">
        <button type="button" onClick={() => onToast('Düzenle', `${service.service} düzenleme formu açılıyor`, 'teal')} className="flex items-center gap-1 px-3 py-2 text-[11px] font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
          <Svg className="w-3.5 h-3.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></Svg>
          Düzenle
        </button>
        <button type="button" onClick={onClose} className="px-3 py-2 text-[11px] font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900">Kapat</button>
      </div>
    </ModalFrame>
  );
}

function MetaPanel({ service }: { service: ServiceItem }) {
  if (!service.meta || Object.keys(service.meta).length === 0) return null;
  return (
    <div className="p-3 bg-gray-50 dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-lg">
      <p className="text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Teknik Bilgiler</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {Object.entries(service.meta).map(([key, raw]) => {
          const value = typeof raw === 'boolean' ? (raw ? 'Aktif' : 'Pasif') : typeof raw === 'number' ? raw.toLocaleString('tr-TR') : raw;
          return (
            <div key={key}>
              <p className="text-[9px] text-gray-500 dark:text-gray-500 uppercase tracking-wider">{META_LABELS[key] || key}</p>
              <p className="text-[11px] font-semibold text-gray-900 dark:text-gray-100 font-mono truncate">{String(value)}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PaymentsPanel({ service, totalPaid, totalUnpaid, onToast, onClose }: { service: ServiceItem; totalPaid: number; totalUnpaid: number; onToast: (title: string, text: string, color: ColorName) => void; onClose: () => void }) {
  return (
    <div className="bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <div className="p-3 border-b border-gray-100 dark:border-gray-700/40 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Svg className="text-emerald-600 dark:text-emerald-400 w-4 h-4"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></Svg>
          <p className="text-[11px] font-bold text-gray-900 dark:text-gray-100">Önceki Yıl Ödemeleri</p>
          <span className="text-[9px] font-bold px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 rounded">{service.payments.length} yıl</span>
        </div>
        <div className="flex items-center gap-2 text-[9px]">
          <span className="text-gray-500">Toplam ödenen:</span>
          <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300">{money(totalPaid)}</span>
          {totalUnpaid > 0 && <><span className="text-gray-300">·</span><span className="text-gray-500">Bekleyen:</span><span className="font-mono font-bold text-rose-700 dark:text-rose-300">{money(totalUnpaid)}</span></>}
        </div>
      </div>
      <div className="divide-y divide-gray-100 dark:divide-gray-700/30">
        {[...service.payments].reverse().map((payment) => (
          <div key={payment.year} className={`p-2.5 flex items-center justify-between gap-3 ${payment.paid ? '' : 'bg-rose-50/50 dark:bg-rose-500/5'}`}>
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className={`w-8 h-8 ${payment.paid ? 'bg-emerald-100 dark:bg-emerald-500/20' : 'bg-rose-100 dark:bg-rose-500/20'} rounded flex items-center justify-center shrink-0`}>
                <Svg className={`${payment.paid ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'} w-4 h-4`}>{payment.paid ? <polyline points="20 6 9 17 4 12" /> : <><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></>}</Svg>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100">{payment.year}</p>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 ${payment.paid ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' : 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300'} rounded`}>{payment.paid ? 'ÖDENDİ' : 'BEKLİYOR'}</span>
                  {payment.inv && <span className="text-[9px] font-mono text-gray-400 dark:text-gray-500">{payment.inv}</span>}
                </div>
                <p className="text-[9px] text-gray-500 dark:text-gray-400 mt-0.5">{payment.paid ? `Ödeme tarihi: ${payment.date}` : payment.note || 'Ödeme bekleniyor'}</p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className={`text-[13px] font-black font-mono ${payment.paid ? 'text-gray-900 dark:text-gray-100' : 'text-rose-700 dark:text-rose-300'}`}>{money(payment.amount)}</p>
              {!payment.paid && <button type="button" onClick={() => { onToast('Fatura Kes', `${service.customer} için fatura kesiliyor`, 'emerald'); onClose(); }} className="text-[9px] font-bold text-rose-700 dark:text-rose-300 hover:underline">Fatura Kes →</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExtendModal({ service, onClose, onToast }: { service: ServiceItem; onClose: () => void; onToast: (title: string, text: string, color: ColorName) => void }) {
  const pc = providerConf(service.provider);
  const providerLabel = pc ? pc.lbl : 'Manuel';
  return (
    <ModalFrame onClose={onClose} maxWidth="max-w-[560px]">
      <div className="sticky top-0 z-10 bg-white dark:bg-[#1e1f26] border-b border-gray-100 dark:border-gray-700/60 p-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-500/20 rounded-lg flex items-center justify-center">
            <Svg className="text-emerald-600 dark:text-emerald-400 w-4 h-4"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></Svg>
          </div>
          <div><h2 className="text-[15px] font-bold text-gray-900 dark:text-gray-100">Manuel Uzatma</h2><p className="text-[11px] text-gray-500 dark:text-gray-400">{service.id} · {providerLabel}</p></div>
        </div>
        <CloseButton onClose={onClose} />
      </div>
      <div className="p-5 space-y-4">
        <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50/50 dark:from-emerald-500/10 dark:to-teal-500/5 border-2 border-emerald-200 dark:border-emerald-500/40 rounded-xl">
          <p className="text-[15px] font-black text-gray-900 dark:text-gray-100">{service.service}</p>
          <p className="text-[11px] text-gray-600 dark:text-gray-400">{service.customer}</p>
          <div className="mt-2 pt-2 border-t border-emerald-200/50 dark:border-emerald-500/30 flex items-center justify-between text-[11px]">
            <span className="text-gray-500 dark:text-gray-400">Mevcut bitiş: <span className="font-bold font-mono text-gray-900 dark:text-gray-100">{service.end}</span></span>
            <span className="font-bold font-mono text-gray-900 dark:text-gray-100">{money(service.amount)}/{service.period === 'yillik' ? 'yıl' : 'ay'}</span>
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wider">Uzatma Süresi *</label>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 5].map((year, index) => (
              <label key={year} className="cursor-pointer">
                <input type="radio" name="uzatmaSure" value={year} className="sr-only peer" defaultChecked={index === 0} />
                <div className="p-2.5 bg-white dark:bg-[#17181f] border-2 border-gray-200 dark:border-gray-700 peer-checked:border-emerald-500 peer-checked:bg-emerald-50 dark:peer-checked:bg-emerald-500/10 rounded-lg text-center transition-all">
                  <p className="text-[14px] font-bold text-gray-900 dark:text-gray-100 font-mono">{year}</p>
                  <p className="text-[9px] text-gray-500">{service.period === 'yillik' ? 'yıl' : 'ay'}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1">Uzatma Tutarı</label><input type="text" defaultValue={service.amount} className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono text-right focus:outline-none focus:border-emerald-500" /></div>
          <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1">Fatura Durumu</label><select className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:border-emerald-500"><option>Ödendi · uzatmayı gerçekleştir</option><option>Fatura kesilecek · ödeme sonrası uzat</option><option>Manuel · Paraşüt’e yazma</option></select></div>
        </div>
        {pc ? (
          <div className={`p-3 ${CM[pc.clr].bg} border ${CM[pc.clr].border} rounded-md flex items-start gap-2`}>
            <Svg className={`${CM[pc.clr].t} w-4 h-4 shrink-0 mt-0.5`}>{pc.icon}</Svg>
            <div className="text-[10px]"><p className={`font-bold ${CM[pc.clr].t}`}>{pc.lbl} API ile Uzatma</p><p className={`${CM[pc.clr].t} mt-0.5`}>Onayladığınızda {pc.lbl} paneline uzatma isteği gönderilir · müşteriye otomatik bildirim gider</p></div>
          </div>
        ) : (
          <div className="p-3 bg-gray-50 dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md flex items-start gap-2">
            <Svg className="text-gray-600 dark:text-gray-400 w-4 h-4 shrink-0 mt-0.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /></Svg>
            <div className="text-[10px]"><p className="font-bold text-gray-900 dark:text-gray-200">Manuel Uzatma</p><p className="text-gray-700 dark:text-gray-400 mt-0.5">Bu hizmet manuel yönetildiği için dış sağlayıcıda uzatmayı kendiniz yapmanız gerekir · sistem sadece kayıt tutar</p></div>
          </div>
        )}
      </div>
      <div className="sticky bottom-0 bg-white dark:bg-[#1e1f26] border-t border-gray-100 dark:border-gray-700/60 p-4 flex items-center justify-end gap-2">
        <button type="button" onClick={onClose} className="px-3 py-2 text-[11px] font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900">İptal</button>
        <button type="button" onClick={() => { onToast('Uzatıldı', `${service.service} uzatıldı · yeni bitiş tarihi güncellendi`, 'emerald'); onClose(); }} className="flex items-center gap-1.5 px-4 py-2 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-md">
          <Svg className="w-3 h-3"><polyline points="20 6 9 17 4 12" /></Svg>
          Uzatmayı Onayla
        </button>
      </div>
    </ModalFrame>
  );
}

function StopModal({ service, onClose, onToast }: { service: ServiceItem; onClose: () => void; onToast: (title: string, text: string, color: ColorName) => void }) {
  return (
    <ModalFrame onClose={onClose} maxWidth="max-w-[480px]">
      <div className="p-5 border-b border-gray-100 dark:border-gray-700/60 flex items-center gap-2.5">
        <div className="w-10 h-10 bg-rose-100 dark:bg-rose-500/20 rounded-lg flex items-center justify-center"><Svg className="text-rose-600 dark:text-rose-400 w-4 h-4"><rect x="6" y="6" width="12" height="12" rx="1" /></Svg></div>
        <div><h2 className="text-[15px] font-bold text-gray-900 dark:text-gray-100">Hizmeti Durdur</h2><p className="text-[11px] text-gray-500 dark:text-gray-400">{service.service}</p></div>
      </div>
      <div className="p-5 space-y-3">
        <div className="p-3 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 rounded-md flex items-start gap-2">
          <Svg className="text-rose-600 dark:text-rose-400 w-4 h-4 shrink-0 mt-0.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></Svg>
          <p className="text-[11px] text-rose-800 dark:text-rose-200"><span className="font-bold">Dikkat:</span> Hizmet durdurulduğunda müşteri servise erişemez. Tekrar aktif edilebilir.</p>
        </div>
        <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Sebep *</label><select className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:border-rose-500"><option>Ödeme yapılmadı</option><option>Müşteri talep etti</option><option>Sözleşme sona erdi</option><option>İletişim kopuk</option><option>Diğer</option></select></div>
        <label className="flex items-center gap-2 cursor-pointer p-2 bg-gray-50 dark:bg-[#17181f] rounded"><input type="checkbox" defaultChecked className="rounded text-rose-600" /><span className="text-[11px] text-gray-700 dark:text-gray-300">Müşteriye bildirim e-postası gönder</span></label>
        <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1">Açıklama</label><textarea rows={2} className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 resize-none focus:outline-none focus:border-rose-500" placeholder="Müşteriye gönderilecek açıklama..." /></div>
      </div>
      <div className="p-4 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-end gap-2">
        <button type="button" onClick={onClose} className="px-3 py-2 text-[11px] font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900">İptal</button>
        <button type="button" onClick={() => { onToast('Durduruldu', 'Hizmet kapatıldı · sağlayıcı API bildirildi', 'rose'); onClose(); }} className="flex items-center gap-1.5 px-4 py-2 text-[11px] font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-md">
          <Svg className="w-3 h-3"><rect x="6" y="6" width="12" height="12" rx="1" /></Svg>
          Durdur
        </button>
      </div>
    </ModalFrame>
  );
}

function NewServiceModal({ preselectedType, onClose, onToast }: { preselectedType?: ServiceType; onClose: () => void; onToast: (title: string, text: string, color: ColorName) => void }) {
  return (
    <ModalFrame onClose={onClose}>
      <div className="sticky top-0 z-10 bg-white dark:bg-[#1e1f26] border-b border-gray-100 dark:border-gray-700/60 p-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-teal-100 dark:bg-teal-500/20 rounded-lg flex items-center justify-center"><Svg className="text-teal-600 dark:text-teal-400 w-4 h-4"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></Svg></div>
          <div><h2 className="text-[15px] font-bold text-gray-900 dark:text-gray-100">Yeni Hizmet Ekle</h2><p className="text-[11px] text-gray-500 dark:text-gray-400">Entegre panel veya manuel takip</p></div>
        </div>
        <CloseButton onClose={onClose} />
      </div>
      <div className="p-5 space-y-4">
        <div>
          <label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wider">Hizmet Türü *</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Object.entries(HIZMET_TYPES).map(([key, item], index) => {
              const cm = CM[item.clr];
              const checked = preselectedType ? preselectedType === key : index === 0;
              return (
                <label key={key} className="cursor-pointer">
                  <input type="radio" name="hizmetType" value={key} className="sr-only peer" defaultChecked={checked} />
                  <div className={`p-2.5 bg-white dark:bg-[#17181f] border-2 border-gray-200 dark:border-gray-700 peer-checked:border-${item.clr}-500 peer-checked:bg-${item.clr}-50 dark:peer-checked:bg-${item.clr}-500/10 rounded-lg text-center transition-all`}>
                    <div className={`w-8 h-8 ${cm.bg} rounded-md flex items-center justify-center mx-auto mb-1`}><Svg className={`${cm.t} w-4 h-4`}>{item.icon}</Svg></div>
                    <p className="text-[10px] font-bold text-gray-900 dark:text-gray-100">{item.lbl}</p>
                    {item.integ ? <p className="text-[8px] text-gray-500 dark:text-gray-400">{INTEG_CONF[item.integ].lbl} destekli</p> : <p className="text-[8px] text-gray-500 dark:text-gray-400">Manuel</p>}
                  </div>
                </label>
              );
            })}
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wider">Takip Şekli *</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <label className="cursor-pointer">
              <input type="radio" name="takipSekli" value="integrated" className="sr-only peer" defaultChecked />
              <div className="h-full p-3 bg-white dark:bg-[#17181f] border-2 border-gray-200 dark:border-gray-700 peer-checked:border-teal-500 peer-checked:bg-teal-50 dark:peer-checked:bg-teal-500/10 rounded-lg transition-all">
                <div className="flex items-start gap-2"><Svg className="text-teal-600 dark:text-teal-400 w-4 h-4 shrink-0 mt-0.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></Svg><div className="min-w-0"><p className="text-[12px] font-bold text-gray-900 dark:text-gray-100">Entegre Panel</p><p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">Metunic / Plesk / Cloudflare API ile otomatik senkron</p></div></div>
              </div>
            </label>
            <label className="cursor-pointer">
              <input type="radio" name="takipSekli" value="manual" className="sr-only peer" />
              <div className="h-full p-3 bg-white dark:bg-[#17181f] border-2 border-gray-200 dark:border-gray-700 peer-checked:border-gray-500 peer-checked:bg-gray-50 dark:peer-checked:bg-gray-500/10 rounded-lg transition-all">
                <div className="flex items-start gap-2"><Svg className="text-gray-600 dark:text-gray-400 w-4 h-4 shrink-0 mt-0.5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></Svg><div className="min-w-0"><p className="text-[12px] font-bold text-gray-900 dark:text-gray-100">Manuel Takip</p><p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">Dış sağlayıcıda olan hizmet · sadece kayıt tut</p></div></div>
              </div>
            </label>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1">Müşteri *</label><input type="text" list="hizmetMusteri" placeholder="Müşteri seçin veya yazın..." className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:border-teal-500" /><datalist id="hizmetMusteri"><option value="Bosch Türkiye" /><option value="BigBrand Reklam A.Ş." /><option value="MegaMarka Perakende" /><option value="TechNova Yazılım" /><option value="Platin Otomotiv" /><option value="FastGrow Digital" /><option value="Aydın Holding" /></datalist></div>
          <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1">Şirket</label><select className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:border-teal-500"><option>Arma Digital Medya A.Ş. (Teknopark)</option><option>Arma Bilişim Ltd. Şti. (Standart)</option></select></div>
        </div>
        <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1">Hizmet Adı / Ürün *</label><input type="text" placeholder="Örn: bosch.tr · Business Plan Hosting · Wildcard SSL" className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:border-teal-500" /></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1">Başlangıç</label><input type="date" defaultValue="2026-04-24" className="w-full px-2.5 py-2 text-[11px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono focus:outline-none focus:border-teal-500" /></div>
          <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1">Bitiş</label><input type="date" defaultValue="2027-04-24" className="w-full px-2.5 py-2 text-[11px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono focus:outline-none focus:border-teal-500" /></div>
          <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1">Tutar</label><input type="text" placeholder="50.00" className="w-full px-2.5 py-2 text-[11px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono text-right focus:outline-none focus:border-teal-500" /></div>
          <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1">Dönem</label><select className="w-full px-2.5 py-2 text-[11px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:border-teal-500"><option>yıllık</option><option>aylık</option></select></div>
        </div>
        <label className="flex items-center gap-2 cursor-pointer p-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-md">
          <input type="checkbox" defaultChecked className="rounded text-emerald-600" />
          <div className="flex-1"><p className="text-[11px] font-bold text-emerald-900 dark:text-emerald-200">Otomatik Uzatma AÇIK</p><p className="text-[9px] text-emerald-700 dark:text-emerald-300">Fatura ödendiğinde sağlayıcı API üzerinden hizmet otomatik uzatılır</p></div>
        </label>
        <div><label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1">Notlar</label><textarea rows={2} placeholder="Özel şartlar, notlar..." className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 resize-none focus:outline-none focus:border-teal-500" /></div>
      </div>
      <div className="sticky bottom-0 bg-white dark:bg-[#1e1f26] border-t border-gray-100 dark:border-gray-700/60 p-4 flex items-center justify-end gap-2">
        <button type="button" onClick={onClose} className="px-3 py-2 text-[11px] font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900">İptal</button>
        <button type="button" onClick={() => { onToast('Hizmet Eklendi', 'Yeni hizmet sisteme kaydedildi · entegre ise panel API senkronizasyonu başladı', 'teal'); onClose(); }} className="flex items-center gap-1.5 px-4 py-2 text-[11px] font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-md">
          <Svg className="w-3 h-3"><polyline points="20 6 9 17 4 12" /></Svg>
          Hizmeti Kaydet
        </button>
      </div>
    </ModalFrame>
  );
}

function getActionsForType(type: ServiceType): { lbl: string; icon: ReactNode; clr: ColorName }[] {
  const actions: Record<ServiceType, { lbl: string; icon: ReactNode; clr: ColorName }[]> = {
    domain: [{ lbl: 'DNS Düzenle', icon: <><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /></>, clr: 'teal' }, { lbl: 'Whois', icon: <><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></>, clr: 'sky' }, { lbl: 'NS Değiştir', icon: <><path d="M17 3l4 4-4 4M3 7h18M7 21l-4-4 4-4M21 17H3" /></>, clr: 'violet' }, { lbl: 'Transfer Çıkış', icon: <><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></>, clr: 'amber' }],
    hosting: [{ lbl: 'Panel Aç', icon: <><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></>, clr: 'indigo' }, { lbl: 'Yedek Al', icon: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></>, clr: 'emerald' }, { lbl: 'DB Yönet', icon: <><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /></>, clr: 'violet' }, { lbl: 'E-posta', icon: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></>, clr: 'sky' }],
    vds: [{ lbl: 'SSH Aç', icon: <><polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" /></>, clr: 'violet' }, { lbl: 'Yeniden Başlat', icon: <><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></>, clr: 'amber' }, { lbl: 'Snapshot', icon: <><circle cx="12" cy="13" r="4" /><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /></>, clr: 'sky' }, { lbl: 'Monitoring', icon: <><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></>, clr: 'emerald' }],
    ssl: [{ lbl: 'Sertifika', icon: <><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>, clr: 'emerald' }, { lbl: 'Yenile', icon: <><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></>, clr: 'sky' }, { lbl: 'CSR', icon: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></>, clr: 'violet' }, { lbl: 'Revoke', icon: <><circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" /></>, clr: 'rose' }],
    bakim: [{ lbl: 'Ticket Aç', icon: <path d="M12 5v14M5 12h14" />, clr: 'emerald' }, { lbl: 'SLA Durum', icon: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />, clr: 'amber' }, { lbl: 'Geçmiş', icon: <><path d="M3 3v5h5" /><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" /><line x1="12" y1="7" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></>, clr: 'sky' }, { lbl: 'Rapor', icon: <><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></>, clr: 'violet' }],
    magaza: [{ lbl: 'Mağaza', icon: <path d="M3 9l1-5h16l1 5M3 9h18M3 9v11a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V9" />, clr: 'sky' }, { lbl: 'Siparişler', icon: <><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></>, clr: 'emerald' }, { lbl: 'Ürün Senkron', icon: <path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c2.5-2.5 3-6 3-9s-.5-6.5-3-9m0 18c-2.5-2.5-3-6-3-9s.5-6.5 3-9" />, clr: 'violet' }, { lbl: 'Stok', icon: <><path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" /><polyline points="16 21 12 17 8 21" /></>, clr: 'amber' }],
    antispam: [{ lbl: 'Kara Liste', icon: <><circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" /></>, clr: 'rose' }, { lbl: 'Beyaz Liste', icon: <polyline points="20 6 9 17 4 12" />, clr: 'emerald' }, { lbl: 'Kural Ekle', icon: <path d="M12 5v14M5 12h14" />, clr: 'violet' }, { lbl: 'Raporlar', icon: <><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></>, clr: 'sky' }],
  };
  return actions[type];
}
