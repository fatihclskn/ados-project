import { type ReactNode, useMemo, useState } from 'react';

type ColorName = 'rose' | 'indigo' | 'violet' | 'emerald' | 'sky' | 'amber' | 'gray' | 'teal';
type EmployeeType = 'hisseli' | 'personel' | 'kar-ortak' | 'freelance';
type TeamTab = 'liste' | 'bordro' | 'prim' | 'izin' | 'hakedis' | 'raporlar';
type ModalState = { type: 'new' } | { type: 'edit'; employee: Employee } | null;
type ToastState = { title: string; text: string; color: ColorName } | null;

type Employee = {
  id: string;
  ad: string;
  tc: string;
  dogumTarihi: string;
  gorev: string;
  dept: string;
  sirket: 'digital' | 'bilisim';
  netMaas: number;
  sgkMatrah: number;
  ekMesaiSaatUcret?: number;
  tip: EmployeeType;
  hisse?: number;
  baslangic: string;
  ogrenim: string;
  avatar: string;
  clr: ColorName;
  durum: 'aktif' | 'pasif';
  email: string;
  tel: string;
  iban: string;
  sgk: string;
  yanHaklar: string[];
  egitimler: string[];
  sertifikalar: string[];
  notlar: string;
  belgeler: string[];
  zimmetler: string[];
  kidem?: number;
  kidemli?: boolean;
  junior?: boolean;
  asgari?: boolean;
  key?: boolean;
  karKural?: string;
  adamSaat?: number;
};

const CM: Record<ColorName, { bg: string; t: string; border: string; bar: string; solid: string; hover: string; avatar: string }> = {
  rose: { bg: 'bg-rose-100 dark:bg-rose-900/30', t: 'text-rose-700 dark:text-rose-300', border: 'border-rose-200 dark:border-rose-500/30', bar: 'bg-gradient-to-r from-rose-400 to-rose-600', solid: 'bg-rose-600', hover: 'hover:bg-rose-700', avatar: 'bg-gradient-to-br from-rose-500 to-rose-600' },
  indigo: { bg: 'bg-indigo-100 dark:bg-indigo-900/30', t: 'text-indigo-700 dark:text-indigo-300', border: 'border-indigo-200 dark:border-indigo-500/30', bar: 'bg-gradient-to-r from-indigo-400 to-indigo-600', solid: 'bg-indigo-600', hover: 'hover:bg-indigo-700', avatar: 'bg-gradient-to-br from-indigo-500 to-indigo-600' },
  violet: { bg: 'bg-violet-100 dark:bg-violet-900/30', t: 'text-violet-700 dark:text-violet-300', border: 'border-violet-200 dark:border-violet-500/30', bar: 'bg-gradient-to-r from-violet-400 to-violet-600', solid: 'bg-violet-600', hover: 'hover:bg-violet-700', avatar: 'bg-gradient-to-br from-violet-500 to-violet-600' },
  emerald: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', t: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-500/30', bar: 'bg-gradient-to-r from-emerald-400 to-emerald-600', solid: 'bg-emerald-600', hover: 'hover:bg-emerald-700', avatar: 'bg-gradient-to-br from-emerald-500 to-emerald-600' },
  sky: { bg: 'bg-sky-100 dark:bg-sky-900/30', t: 'text-sky-700 dark:text-sky-300', border: 'border-sky-200 dark:border-sky-500/30', bar: 'bg-gradient-to-r from-sky-400 to-sky-600', solid: 'bg-sky-600', hover: 'hover:bg-sky-700', avatar: 'bg-gradient-to-br from-sky-500 to-sky-600' },
  amber: { bg: 'bg-amber-100 dark:bg-amber-900/30', t: 'text-amber-700 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-500/30', bar: 'bg-gradient-to-r from-amber-400 to-amber-600', solid: 'bg-amber-600', hover: 'hover:bg-amber-700', avatar: 'bg-gradient-to-br from-amber-500 to-amber-600' },
  gray: { bg: 'bg-gray-100 dark:bg-gray-800', t: 'text-gray-700 dark:text-gray-300', border: 'border-gray-200 dark:border-gray-600/50', bar: 'bg-gradient-to-r from-gray-400 to-gray-600', solid: 'bg-gray-600', hover: 'hover:bg-gray-700', avatar: 'bg-gradient-to-br from-gray-500 to-gray-600' },
  teal: { bg: 'bg-teal-100 dark:bg-teal-900/30', t: 'text-teal-700 dark:text-teal-300', border: 'border-teal-200 dark:border-teal-500/30', bar: 'bg-gradient-to-r from-teal-400 to-teal-600', solid: 'bg-teal-600', hover: 'hover:bg-teal-700', avatar: 'bg-gradient-to-br from-teal-500 to-teal-600' },
};

const EKIP: Employee[] = [
  { id: 'E-001', ad: 'Osman Atasoy', tc: '12345678901', dogumTarihi: '1982-03-12', gorev: 'CEO & Genel Müdür', dept: 'Yönetim', sirket: 'digital', netMaas: 125000, sgkMatrah: 50000, ekMesaiSaatUcret: 900, tip: 'hisseli', hisse: 30, baslangic: '2003-01-01', ogrenim: 'İşletme Lisans', avatar: 'OA', clr: 'rose', durum: 'aktif', email: 'osman@armadigital.com', tel: '+90 532 000 0001', iban: 'TR33 0006 2000 0000 0062 0001 01', sgk: '4A', yanHaklar: ['SGK', 'Yemek Kartı', 'Özel Sağlık', 'Cep Telefonu'], egitimler: ['Liderlik', 'Finansal Yönetim'], sertifikalar: ['ISO 9001'], notlar: 'Kurucu ortak · genel yönetim ve finansal karar süreçleri.', belgeler: ['Sözleşme', 'Kimlik', 'İmza Sirküleri', 'KVKK'], zimmetler: ['MacBook Pro', 'iPhone', 'Kurumsal GSM', 'Araç Kartı'], kidem: 23, kidemli: true, key: true },
  { id: 'E-002', ad: 'Murat Bak', tc: '22345678901', dogumTarihi: '1985-07-24', gorev: 'Operasyon Ortağı', dept: 'Yönetim · Finans', sirket: 'bilisim', netMaas: 125000, sgkMatrah: 50000, ekMesaiSaatUcret: 850, tip: 'hisseli', hisse: 25, baslangic: '2010-06-15', ogrenim: 'İktisat Lisans', avatar: 'MB', clr: 'indigo', durum: 'aktif', email: 'murat@armabilisim.com', tel: '+90 532 000 0002', iban: 'TR33 0006 2000 0000 0062 0002 02', sgk: '4A', yanHaklar: ['SGK', 'Yemek Kartı', 'BES'], egitimler: ['Operasyon Yönetimi'], sertifikalar: ['Finansal Analiz'], notlar: 'Operasyon ve finans takip sorumlusu.', belgeler: ['Sözleşme', 'Kimlik', 'KVKK'], zimmetler: ['Notebook', 'Kurumsal GSM'], kidem: 16, kidemli: true, key: true },
  { id: 'E-003', ad: 'Fatih Bak', tc: '32345678901', dogumTarihi: '1987-10-03', gorev: 'Teknik Ortak', dept: 'Müşteri İlişkileri', sirket: 'bilisim', netMaas: 125000, sgkMatrah: 50000, ekMesaiSaatUcret: 850, tip: 'hisseli', hisse: 25, baslangic: '2011-03-01', ogrenim: 'Bilgisayar Mühendisliği', avatar: 'FB', clr: 'violet', durum: 'aktif', email: 'fatih@armabilisim.com', tel: '+90 532 000 0003', iban: 'TR33 0006 2000 0000 0062 0003 03', sgk: '4A', yanHaklar: ['SGK', 'Yemek Kartı', 'Özel Sağlık'], egitimler: ['Müşteri Yönetimi'], sertifikalar: ['Google Cloud'], notlar: 'Teknik müşteri ilişkileri ve çözüm mimarisi.', belgeler: ['Sözleşme', 'Kimlik', 'KVKK'], zimmetler: ['MacBook Air', 'Telefon'], kidem: 15, kidemli: true, key: true },
  { id: 'E-004', ad: 'Sacide Ziyaoğlu', tc: '42345678901', dogumTarihi: '1984-02-21', gorev: 'SEO Direktörü', dept: 'SEO', sirket: 'digital', netMaas: 125000, sgkMatrah: 50000, ekMesaiSaatUcret: 800, tip: 'hisseli', hisse: 20, baslangic: '2012-09-10', ogrenim: 'Halkla İlişkiler Lisans', avatar: 'SZ', clr: 'emerald', durum: 'aktif', email: 'sacide@armadigital.com', tel: '+90 532 000 0004', iban: 'TR33 0006 2000 0000 0062 0004 04', sgk: '4A', yanHaklar: ['SGK', 'Yemek Kartı', 'Özel Sağlık'], egitimler: ['SEO Strateji'], sertifikalar: ['Google Analytics'], notlar: 'SEO ekip yönetimi ve stratejik müşteri takibi.', belgeler: ['Sözleşme', 'Kimlik', 'KVKK'], zimmetler: ['Notebook', 'Telefon'], kidem: 14, kidemli: true, key: true },
  { id: 'E-005', ad: 'Erhan Çalışkan', tc: '52345678901', dogumTarihi: '1991-06-18', gorev: 'Kar Ortağı · Sosyal Medya & Prodüksiyon', dept: 'Sosyal Medya', sirket: 'digital', netMaas: 0, sgkMatrah: 0, tip: 'kar-ortak', baslangic: '2018-04-11', ogrenim: 'Grafik Tasarım', avatar: 'EÇ', clr: 'sky', durum: 'aktif', email: 'erhan.c@armadigital.com', tel: '+90 532 000 0005', iban: 'TR33 0006 2000 0000 0062 0005 05', sgk: 'kar ortaklığı', yanHaklar: [], egitimler: ['Prodüksiyon'], sertifikalar: ['Meta Ads'], notlar: 'SM %50 + prodüksiyon %40 net kâr kuralı.', belgeler: ['Kar Ortaklığı Protokolü'], zimmetler: ['Kamera Seti'], karKural: 'SM %50 + Prod %40 (net)' },
  { id: 'E-006', ad: 'Uğur Erten', tc: '62345678901', dogumTarihi: '1990-08-09', gorev: 'Kar Ortağı · Satış & Prodüksiyon', dept: 'Kar Ortaklığı', sirket: 'digital', netMaas: 0, sgkMatrah: 0, tip: 'kar-ortak', baslangic: '2019-02-20', ogrenim: 'Pazarlama', avatar: 'UE', clr: 'amber', durum: 'aktif', email: 'ugur@armadigital.com', tel: '+90 532 000 0006', iban: 'TR33 0006 2000 0000 0062 0006 06', sgk: 'kar ortaklığı', yanHaklar: [], egitimler: ['Satış Yönetimi'], sertifikalar: ['Satış Koçluğu'], notlar: 'Satış %10/%20 + prodüksiyon %50 net kâr kuralı.', belgeler: ['Kar Ortaklığı Protokolü'], zimmetler: ['Notebook'], karKural: 'Satış %10/%20 + Prod %50 (net)' },
  { id: 'E-007', ad: 'Yakup Varol', tc: '72345678901', dogumTarihi: '1989-04-04', gorev: 'Kıdemli Yazılım Geliştirici', dept: 'Yazılım', sirket: 'digital', netMaas: 95000, sgkMatrah: 40000, ekMesaiSaatUcret: 650, tip: 'personel', baslangic: '2011-12-01', ogrenim: 'Bilgisayar Mühendisliği', avatar: 'YV', clr: 'indigo', durum: 'aktif', email: 'yakup@armadigital.com', tel: '+90 532 000 0007', iban: 'TR33 0006 2000 0000 0062 0007 07', sgk: '4A', yanHaklar: ['SGK', 'Yemek Kartı', 'Yol', 'Cep Telefonu'], egitimler: ['React', 'Node.js'], sertifikalar: ['AWS Developer'], notlar: 'Kritik ürün geliştirme ve entegrasyon sorumlusu.', belgeler: ['Sözleşme', 'Kimlik', 'Diploma', 'KVKK', 'SGK Giriş'], zimmetler: ['MacBook Pro', 'Harici Monitör', 'GSM Hattı'], kidem: 15, kidemli: true, key: true },
  { id: 'E-008', ad: 'Yunus Yığcı', tc: '82345678901', dogumTarihi: '1993-09-14', gorev: 'Web Geliştirici', dept: 'Web', sirket: 'digital', netMaas: 55000, sgkMatrah: 30000, ekMesaiSaatUcret: 360, tip: 'personel', baslangic: '2020-01-06', ogrenim: 'Bilgisayar Programcılığı', avatar: 'YY', clr: 'teal', durum: 'aktif', email: 'yunus.y@armadigital.com', tel: '+90 532 000 0008', iban: 'TR33 0006 2000 0000 0062 0008 08', sgk: '4A', yanHaklar: ['SGK', 'Yemek Kartı'], egitimler: ['Frontend'], sertifikalar: ['HTML/CSS'], notlar: 'Web üretim ve bakım işleri.', belgeler: ['Sözleşme', 'Kimlik', 'KVKK'], zimmetler: ['Notebook'], kidem: 6 },
  { id: 'E-009', ad: 'Vedat Yıldırım', tc: '92345678901', dogumTarihi: '1999-01-19', gorev: 'Junior Yazılım Geliştirici', dept: 'Yazılım', sirket: 'digital', netMaas: 28000, sgkMatrah: 22104, ekMesaiSaatUcret: 210, tip: 'personel', baslangic: '2025-02-03', ogrenim: 'Yazılım Mühendisliği', avatar: 'VY', clr: 'violet', durum: 'aktif', email: 'vedat@armadigital.com', tel: '+90 532 000 0009', iban: 'TR33 0006 2000 0000 0062 0009 09', sgk: '4A', yanHaklar: ['SGK', 'Yemek Kartı'], egitimler: ['Onboarding'], sertifikalar: [], notlar: 'Junior yazılım geliştirme ekibinde.', belgeler: ['Sözleşme', 'Kimlik'], zimmetler: ['Notebook'], kidem: 1, junior: true, asgari: true },
  { id: 'E-011', ad: 'Fatih Çalışkan', tc: '11345678901', dogumTarihi: '1998-05-11', gorev: 'AI Otomasyon Uzmanı', dept: 'AI Otomasyon', sirket: 'digital', netMaas: 30000, sgkMatrah: 22104, ekMesaiSaatUcret: 230, tip: 'personel', baslangic: '2024-11-18', ogrenim: 'Bilgisayar Programcılığı', avatar: 'FÇ', clr: 'sky', durum: 'aktif', email: 'fatih.c@armadigital.com', tel: '+90 532 000 0011', iban: 'TR33 0006 2000 0000 0062 0011 11', sgk: '4A', yanHaklar: ['SGK', 'Yemek Kartı'], egitimler: ['AI Otomasyon'], sertifikalar: [], notlar: 'AI otomasyon akışları ve prompt süreçleri.', belgeler: ['Sözleşme', 'Kimlik'], zimmetler: ['Notebook'], kidem: 1, junior: true, asgari: true },
  { id: 'E-013', ad: 'Bilal Bal', tc: '13345678901', dogumTarihi: '1992-12-02', gorev: 'SEO Uzmanı', dept: 'SEO', sirket: 'digital', netMaas: 50000, sgkMatrah: 30000, ekMesaiSaatUcret: 330, tip: 'personel', baslangic: '2019-10-01', ogrenim: 'İletişim Fakültesi', avatar: 'BB', clr: 'emerald', durum: 'aktif', email: 'bilal@armadigital.com', tel: '+90 532 000 0013', iban: 'TR33 0006 2000 0000 0062 0013 13', sgk: '4A', yanHaklar: ['SGK', 'Yemek Kartı'], egitimler: ['SEO Teknik'], sertifikalar: ['Search Console'], notlar: 'Teknik SEO ve raporlama.', belgeler: ['Sözleşme', 'Kimlik', 'KVKK'], zimmetler: ['Notebook'], kidem: 7, kidemli: true },
  { id: 'E-014', ad: 'Sahil Dadashov', tc: '14345678901', dogumTarihi: '1990-06-23', gorev: 'SEO Takım Lideri', dept: 'SEO', sirket: 'digital', netMaas: 60000, sgkMatrah: 32000, ekMesaiSaatUcret: 420, tip: 'personel', baslangic: '2018-03-12', ogrenim: 'İşletme', avatar: 'SD', clr: 'emerald', durum: 'aktif', email: 'sahil@armadigital.com', tel: '+90 532 000 0014', iban: 'TR33 0006 2000 0000 0062 0014 14', sgk: '4A', yanHaklar: ['SGK', 'Yemek Kartı', 'Yol'], egitimler: ['SEO Liderlik'], sertifikalar: ['Ahrefs'], notlar: 'SEO takım liderliği.', belgeler: ['Sözleşme', 'Kimlik', 'KVKK'], zimmetler: ['Notebook', 'GSM Hattı'], kidem: 8, kidemli: true },
  { id: 'E-019', ad: 'Erhan Yavuz', tc: '19345678901', dogumTarihi: '1991-03-27', gorev: 'Web Takım Lideri', dept: 'Web', sirket: 'digital', netMaas: 60000, sgkMatrah: 32000, ekMesaiSaatUcret: 420, tip: 'personel', baslangic: '2019-07-15', ogrenim: 'Bilgisayar Programcılığı', avatar: 'EY', clr: 'teal', durum: 'aktif', email: 'erhan.y@armadigital.com', tel: '+90 532 000 0019', iban: 'TR33 0006 2000 0000 0062 0019 19', sgk: '4A', yanHaklar: ['SGK', 'Yemek Kartı'], egitimler: ['WordPress', 'Frontend'], sertifikalar: [], notlar: 'Web proje teslim takibi.', belgeler: ['Sözleşme', 'Kimlik'], zimmetler: ['Notebook'], kidem: 7, kidemli: true },
  { id: 'E-022', ad: 'Sedanur Soyuk', tc: '22345678902', dogumTarihi: '1996-04-17', gorev: 'Sosyal Medya Uzmanı', dept: 'Sosyal Medya', sirket: 'digital', netMaas: 35000, sgkMatrah: 25000, ekMesaiSaatUcret: 260, tip: 'personel', baslangic: '2022-08-01', ogrenim: 'Görsel İletişim', avatar: 'SS', clr: 'rose', durum: 'aktif', email: 'sedanur@armadigital.com', tel: '+90 532 000 0022', iban: 'TR33 0006 2000 0000 0062 0022 22', sgk: '4A', yanHaklar: ['SGK', 'Yemek Kartı'], egitimler: ['Meta Business'], sertifikalar: ['Meta Ads'], notlar: 'Sosyal medya içerik ve hesap yönetimi.', belgeler: ['Sözleşme', 'Kimlik'], zimmetler: ['Notebook'], kidem: 4 },
  { id: 'E-024', ad: 'Hamza Taşçı', tc: '24345678901', dogumTarihi: '1994-09-05', gorev: 'Sunucu ve Sistem Uzmanı', dept: 'Sunucu ve Sistem', sirket: 'bilisim', netMaas: 45000, sgkMatrah: 28000, ekMesaiSaatUcret: 310, tip: 'personel', baslangic: '2021-05-10', ogrenim: 'Bilgisayar Teknolojileri', avatar: 'HT', clr: 'indigo', durum: 'aktif', email: 'hamza@armabilisim.com', tel: '+90 532 000 0024', iban: 'TR33 0006 2000 0000 0062 0024 24', sgk: '4A', yanHaklar: ['SGK', 'Yemek Kartı'], egitimler: ['Linux Sistem'], sertifikalar: ['cPanel'], notlar: 'Sunucu ve hosting operasyonları.', belgeler: ['Sözleşme', 'Kimlik'], zimmetler: ['Notebook'], kidem: 5 },
  { id: 'E-025', ad: 'Yüksel Atasoy', tc: '25345678901', dogumTarihi: '1979-01-30', gorev: 'İdari İşler Sorumlusu', dept: 'İdari', sirket: 'bilisim', netMaas: 38000, sgkMatrah: 26000, ekMesaiSaatUcret: 280, tip: 'personel', baslangic: '2020-02-17', ogrenim: 'Lise', avatar: 'YA', clr: 'gray', durum: 'aktif', email: 'yuksel@armabilisim.com', tel: '+90 532 000 0025', iban: 'TR33 0006 2000 0000 0062 0025 25', sgk: '4A', yanHaklar: ['SGK', 'Yemek Kartı'], egitimler: [], sertifikalar: [], notlar: 'İdari işler ve ofis koordinasyonu.', belgeler: ['Sözleşme', 'Kimlik'], zimmetler: ['Telefon'], kidem: 6 },
  { id: 'E-026', ad: 'Tülay Atasoy', tc: '26345678901', dogumTarihi: '1981-11-08', gorev: 'Kıdemli Muhasebe Direktörü', dept: 'Finans ve İdari', sirket: 'bilisim', netMaas: 55000, sgkMatrah: 32000, ekMesaiSaatUcret: 390, tip: 'personel', baslangic: '2015-04-06', ogrenim: 'Muhasebe ve Vergi Uygulamaları', avatar: 'TA', clr: 'amber', durum: 'aktif', email: 'tulay@armabilisim.com', tel: '+90 532 000 0026', iban: 'TR33 0006 2000 0000 0062 0026 26', sgk: '4A', yanHaklar: ['SGK', 'Yemek Kartı', 'BES'], egitimler: ['Paraşüt', 'Bordro'], sertifikalar: ['SMMM Staj'], notlar: 'Finans Panosu ana kullanıcısı.', belgeler: ['Sözleşme', 'Kimlik', 'Diploma', 'KVKK'], zimmetler: ['Notebook', 'GSM Hattı'], kidem: 11, kidemli: true, key: true },
  { id: 'E-027', ad: 'Yücel Atasoy', tc: '27345678901', dogumTarihi: '1983-05-13', gorev: 'Finans ve İdari İşler', dept: 'Finans ve İdari', sirket: 'bilisim', netMaas: 50000, sgkMatrah: 30000, ekMesaiSaatUcret: 350, tip: 'personel', baslangic: '2017-01-09', ogrenim: 'İşletme', avatar: 'YÜ', clr: 'amber', durum: 'aktif', email: 'yucel@armabilisim.com', tel: '+90 532 000 0027', iban: 'TR33 0006 2000 0000 0062 0027 27', sgk: '4A', yanHaklar: ['SGK', 'Yemek Kartı'], egitimler: ['Finans Operasyon'], sertifikalar: [], notlar: 'Finans operasyon destek.', belgeler: ['Sözleşme', 'Kimlik'], zimmetler: ['Notebook'], kidem: 9, kidemli: true },
  { id: 'E-028', ad: 'Çiğdem Alataş', tc: '28345678901', dogumTarihi: '1995-03-25', gorev: 'Pazarlama Uzmanı', dept: 'Pazarlama', sirket: 'digital', netMaas: 42000, sgkMatrah: 28000, ekMesaiSaatUcret: 300, tip: 'personel', baslangic: '2021-09-01', ogrenim: 'Pazarlama', avatar: 'ÇA', clr: 'rose', durum: 'aktif', email: 'cigdem@armadigital.com', tel: '+90 532 000 0028', iban: 'TR33 0006 2000 0000 0062 0028 28', sgk: '4A', yanHaklar: ['SGK', 'Yemek Kartı'], egitimler: ['Dijital Pazarlama'], sertifikalar: ['Google Ads'], notlar: 'Pazarlama operasyon ve kampanya takibi.', belgeler: ['Sözleşme', 'Kimlik'], zimmetler: ['Notebook'], kidem: 5 },
  { id: 'E-029', ad: 'Enes Yazılımcı', tc: '29345678901', dogumTarihi: '1997-11-18', gorev: 'Freelance Yazılımcı', dept: 'Yazılım', sirket: 'bilisim', netMaas: 0, sgkMatrah: 0, adamSaat: 500, tip: 'freelance', baslangic: '2024-05-10', ogrenim: 'Bilgisayar Programcılığı', avatar: 'EZ', clr: 'gray', durum: 'aktif', email: 'enes@freelance.com', tel: '+90 532 000 0029', iban: 'TR33 0006 2000 0000 0062 0029 29', sgk: 'freelance', yanHaklar: [], egitimler: [], sertifikalar: [], notlar: 'SMM ile fatura kesiyor · ₺500/saat', belgeler: ['SMM'], zimmetler: [] },
  { id: 'E-030', ad: 'Yunus Sarıbulut', tc: '30345678901', dogumTarihi: '1988-02-28', gorev: 'Freelance Mobil Geliştirici', dept: 'Yazılım', sirket: 'bilisim', netMaas: 0, sgkMatrah: 0, adamSaat: 1000, tip: 'freelance', baslangic: '2015-08-20', ogrenim: 'Bilgisayar Programcılığı', avatar: 'YS', clr: 'gray', durum: 'aktif', email: 'yunus.s@freelance.com', tel: '+90 532 000 0030', iban: 'TR33 0006 2000 0000 0062 0030 30', sgk: 'freelance', yanHaklar: [], egitimler: [], sertifikalar: ['iOS Dev'], notlar: 'SMM ile fatura kesiyor · ₺1000/saat', belgeler: ['SMM'], zimmetler: [] },
];

function money(value: number) {
  return `₺${value.toLocaleString('tr-TR')}`;
}

function Svg({ children, className = 'w-3.5 h-3.5' }: { children: ReactNode; className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      {children}
    </svg>
  );
}

function Tag({ children, color }: { children: ReactNode; color: ColorName }) {
  return <span className={`inline-flex text-[9px] font-bold px-1.5 py-0.5 ${CM[color].bg} ${CM[color].t} rounded`}>{children}</span>;
}

function ModalFrame({ children, onClose, maxWidth = 'max-w-[840px]' }: { children: ReactNode; onClose: () => void; maxWidth?: string }) {
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

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1">{label}</label>
      {children}
    </div>
  );
}

export default function EkipYonetimi() {
  const [tab, setTab] = useState<TeamTab>('liste');
  const [deptFilter, setDeptFilter] = useState('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState>(null);
  const [toast, setToast] = useState<ToastState>(null);

  const selected = selectedId ? EKIP.find((employee) => employee.id === selectedId) ?? null : null;
  const personel = EKIP.filter((employee) => employee.tip === 'personel' || employee.tip === 'hisseli');
  const karOrtak = EKIP.filter((employee) => employee.tip === 'kar-ortak');
  const freelance = EKIP.filter((employee) => employee.tip === 'freelance');
  const toplamMaas = personel.reduce((sum, employee) => sum + employee.netMaas, 0);

  const showToast = (title: string, text: string, color: ColorName = 'emerald') => {
    setToast({ title, text, color });
    window.setTimeout(() => setToast(null), 2200);
  };

  if (selected) {
    return (
      <div className="space-y-3 relative min-h-[calc(100vh-140px)]">
        <PersonelDetail employee={selected} onBack={() => setSelectedId(null)} onEdit={() => setModal({ type: 'edit', employee: selected })} onToast={showToast} />
        {modal && <PersonelModal modal={modal} onClose={() => setModal(null)} onToast={showToast} />}
        {toast && <Toast toast={toast} />}
      </div>
    );
  }

  return (
    <div className="space-y-3 relative min-h-[calc(100vh-140px)]">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-rose-100 dark:bg-rose-500/20 rounded-lg flex items-center justify-center">
            <Svg className="text-rose-600 dark:text-rose-400 w-4 h-4"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></Svg>
          </div>
          <div>
            <h1 className="text-[19px] font-bold text-gray-900 dark:text-gray-100 leading-tight">Ekip Yönetimi</h1>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">{EKIP.length} kişi · {personel.length} personel · {karOrtak.length} kar ortağı · {freelance.length} freelance · aylık bordro ₺{(toplamMaas / 1000).toFixed(0)}K</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button type="button" onClick={() => showToast('Excel Import', 'Tülay Hanım’ın Excel dosyasından son güncelleme yapılıyor', 'emerald')} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold rounded-md hover:bg-emerald-100">
            <Svg><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="9" y1="3" x2="9" y2="21" /><line x1="15" y1="3" x2="15" y2="21" /></Svg>
            Excel İçe Aktar
          </button>
          <button type="button" onClick={() => showToast('Bordro', 'Nisan 2026 bordrosu oluşturuluyor', 'violet')} className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-[11px] font-semibold rounded-md hover:bg-gray-50">
            <Svg><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></Svg>
            Bordro Oluştur
          </button>
          <button type="button" onClick={() => setModal({ type: 'new' })} className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold rounded-md shadow-sm">
            <Svg><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></Svg>
            Yeni Personel
          </button>
        </div>
      </div>

      <TeamTabs tab={tab} setTab={setTab} ekipCount={EKIP.length} freelanceCount={freelance.length} />

      {tab === 'liste' && <EkipListe deptFilter={deptFilter} setDeptFilter={setDeptFilter} onSelect={setSelectedId} onEdit={(employee) => setModal({ type: 'edit', employee })} onToast={showToast} />}
      {tab === 'bordro' && <BordroTab employees={personel} onSelect={setSelectedId} />}
      {tab === 'prim' && <PrimTab employees={personel} onToast={showToast} />}
      {tab === 'izin' && <IzinTab employees={personel} />}
      {tab === 'hakedis' && <HakedisTab employees={freelance} onSelect={setSelectedId} onToast={showToast} />}
      {tab === 'raporlar' && <RaporlarTab employees={EKIP} />}

      {modal && <PersonelModal modal={modal} onClose={() => setModal(null)} onToast={showToast} />}
      {toast && <Toast toast={toast} />}
    </div>
  );
}

function TeamTabs({ tab, setTab, ekipCount, freelanceCount }: { tab: TeamTab; setTab: (tab: TeamTab) => void; ekipCount: number; freelanceCount: number }) {
  const tabs: Array<{ k: TeamTab; lbl: string; badge?: string; clr: ColorName; icon: ReactNode }> = [
    { k: 'liste', lbl: 'Ekip Listesi', badge: String(ekipCount), clr: 'rose', icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></> },
    { k: 'bordro', lbl: 'Maaş Bordrosu', badge: '12', clr: 'emerald', icon: <><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></> },
    { k: 'prim', lbl: 'Prim & Ek Mesai', badge: '8', clr: 'amber', icon: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /> },
    { k: 'izin', lbl: 'İzin & İK', badge: '9', clr: 'sky', icon: <><path d="M20 7h-3V5a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM9 5h6v2H9V5z" /><path d="M12 12v4M10 14h4" /></> },
    { k: 'hakedis', lbl: 'Freelance Hakediş', badge: String(freelanceCount), clr: 'gray', icon: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></> },
    { k: 'raporlar', lbl: 'Ekip Raporları', clr: 'violet', icon: <><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></> },
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
                {item.badge && <span className={`text-[9px] font-bold px-1 py-0.5 ${active ? 'bg-white dark:bg-[#1e1f26]' : 'bg-gray-100 dark:bg-gray-800'} rounded`}>{item.badge}</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function EkipListe({ deptFilter, setDeptFilter, onSelect, onEdit, onToast }: { deptFilter: string; setDeptFilter: (dept: string) => void; onSelect: (id: string) => void; onEdit: (employee: Employee) => void; onToast: (title: string, text: string, color?: ColorName) => void }) {
  const deptMap = useMemo(() => {
    return EKIP.reduce<Record<string, number>>((acc, employee) => {
      const dept = employee.dept.split(' · ')[0].split(' & ')[0].split(' ve ')[0].trim();
      acc[dept] = (acc[dept] ?? 0) + 1;
      return acc;
    }, {});
  }, []);

  const filtered = deptFilter === 'all' ? EKIP : EKIP.filter((employee) => employee.dept.toLowerCase().includes(deptFilter.toLowerCase().split(' ')[0]));
  const toplamPersonel = EKIP.filter((employee) => employee.tip === 'personel').length;
  const toplamHisseli = EKIP.filter((employee) => employee.tip === 'hisseli').length;
  const toplamKarOrtak = EKIP.filter((employee) => employee.tip === 'kar-ortak').length;
  const toplamFreelance = EKIP.filter((employee) => employee.tip === 'freelance').length;
  const toplamMaasPers = EKIP.filter((employee) => employee.tip === 'personel').reduce((sum, employee) => sum + employee.netMaas, 0);
  const ortMaas = Math.round(toplamMaasPers / Math.max(toplamPersonel, 1));
  const juniorSayi = EKIP.filter((employee) => employee.junior).length;

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3">
        {[
          { l: 'Toplam Ekip', v: String(EKIP.length), s: `${toplamPersonel} personel + ${toplamHisseli} ortak`, c: 'rose' as ColorName },
          { l: 'Aylık Bordro', v: `₺${(toplamMaasPers / 1000).toFixed(0)}K`, s: 'Net maaş toplamı', c: 'emerald' as ColorName },
          { l: 'Ortalama Maaş', v: `₺${(ortMaas / 1000).toFixed(0)}K`, s: 'Personel başına', c: 'sky' as ColorName },
          { l: 'Kar Ortağı', v: String(toplamKarOrtak), s: 'Erhan, Uğur', c: 'amber' as ColorName },
          { l: 'Freelance', v: String(toplamFreelance), s: 'Adam/saat bazlı', c: 'gray' as ColorName },
          { l: 'Junior Personel', v: String(juniorSayi), s: '1-2 yıl deneyim', c: 'violet' as ColorName },
        ].map((kpi) => (
          <div key={kpi.l} className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-3.5">
            <p className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">{kpi.l}</p>
            <p className={`text-[22px] font-bold ${CM[kpi.c].t} font-mono leading-none mb-0.5`}>{kpi.v}</p>
            <p className="text-[9px] text-gray-400 dark:text-gray-500">{kpi.s}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300 mr-2">Departman:</span>
          {['all', ...Object.keys(deptMap)].map((dept) => {
            const active = deptFilter === dept;
            const label = dept === 'all' ? `Tümü (${EKIP.length})` : `${dept} (${deptMap[dept] ?? 0})`;
            return (
              <button key={dept} type="button" onClick={() => setDeptFilter(dept)} className={`px-2.5 py-1 text-[10px] font-semibold rounded-md transition-all ${active ? 'bg-rose-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
        <div className="p-3 border-b border-gray-100 dark:border-gray-700/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Svg className="text-rose-600 dark:text-rose-400 w-4 h-4"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></Svg>
            <h3 className="text-[13px] font-bold text-gray-900 dark:text-gray-100">Ekip Listesi</h3>
            <span className="text-[9px] font-bold px-1.5 py-0.5 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 rounded">{filtered.length} KİŞİ</span>
          </div>
          <div className="flex items-center gap-2">
            <input type="text" placeholder="Ara..." className="px-2.5 py-1 text-[11px] bg-gray-50 dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:border-rose-500 w-32" />
            <button type="button" onClick={() => onToast('Export', 'Ekip listesi Excel olarak indiriliyor', 'emerald')} className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 hover:underline">Excel ↓</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead className="bg-gray-50 dark:bg-[#17181f]">
              <tr className="border-b border-gray-200 dark:border-gray-700/30">
                <th className="text-left px-3 py-2 font-semibold text-gray-500 dark:text-gray-400">Personel</th>
                <th className="text-left px-3 py-2 font-semibold text-gray-500 dark:text-gray-400 hidden md:table-cell">Görev</th>
                <th className="text-left px-3 py-2 font-semibold text-gray-500 dark:text-gray-400 hidden lg:table-cell">Departman</th>
                <th className="text-center px-3 py-2 font-semibold text-gray-500 dark:text-gray-400 hidden lg:table-cell w-20">Başlangıç</th>
                <th className="text-right px-3 py-2 font-semibold text-gray-500 dark:text-gray-400">Net Maaş</th>
                <th className="text-center px-3 py-2 font-semibold text-gray-500 dark:text-gray-400 w-24">Tip</th>
                <th className="text-right px-3 py-2 font-semibold text-gray-500 dark:text-gray-400 w-16" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/30">
              {filtered.map((employee) => (
                <EmployeeRow key={employee.id} employee={employee} onSelect={onSelect} onEdit={onEdit} />
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-[#17181f] border-t border-gray-100 dark:border-gray-700/40 flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-400">
          <span>{filtered.length} kişi listelendi · son güncelleme: 03.12.2025 (Tülay Hanım)</span>
          <span>Toplam aylık: <span className="font-mono font-bold text-gray-900 dark:text-gray-100">{money(toplamMaasPers)}</span></span>
        </div>
      </div>
    </>
  );
}

function EmployeeRow({ employee, onSelect, onEdit }: { employee: Employee; onSelect: (id: string) => void; onEdit: (employee: Employee) => void }) {
  const tipInfo: Record<EmployeeType, { lbl: string; clr: ColorName }> = {
    hisseli: { lbl: 'ORTAK', clr: 'rose' },
    'kar-ortak': { lbl: 'KAR ORT.', clr: 'amber' },
    freelance: { lbl: 'FREELANCE', clr: 'gray' },
    personel: { lbl: 'PERSONEL', clr: 'emerald' },
  };
  const type = tipInfo[employee.tip];
  const maasDisplay = employee.tip === 'kar-ortak' ? employee.karKural : employee.tip === 'freelance' ? `₺${employee.adamSaat}/saat` : money(employee.netMaas);

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer" onClick={() => onSelect(employee.id)}>
      <td className="px-3 py-2.5">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 ${CM[employee.clr].avatar} rounded-full flex items-center justify-center shrink-0`}>
            <span className="text-white text-[10px] font-bold">{employee.avatar}</span>
          </div>
          <div className="min-w-0">
            <p className="font-bold text-gray-900 dark:text-gray-100 truncate">{employee.ad}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              {employee.junior && <Tag color="violet">JR</Tag>}
              {employee.kidemli && <Tag color="amber">KIDEMLİ</Tag>}
              {employee.asgari && <Tag color="sky">ASG.</Tag>}
              {employee.key && <Tag color="emerald">ANAHTAR</Tag>}
              <span className="text-[9px] text-gray-500 font-mono">{employee.id}</span>
            </div>
          </div>
        </div>
      </td>
      <td className="px-3 py-2.5 hidden md:table-cell text-gray-600 dark:text-gray-400 text-[10px]">{employee.gorev}</td>
      <td className="px-3 py-2.5 hidden lg:table-cell"><span className={`text-[9px] font-semibold px-1.5 py-0.5 ${CM[employee.clr].bg} ${CM[employee.clr].t} rounded`}>{employee.dept}</span></td>
      <td className="px-3 py-2.5 hidden lg:table-cell text-center font-mono text-[10px] text-gray-600 dark:text-gray-400">{employee.baslangic}</td>
      <td className="px-3 py-2.5 text-right"><span className="font-mono font-bold text-gray-900 dark:text-gray-100">{maasDisplay}</span></td>
      <td className="px-3 py-2.5 text-center"><span className={`inline-flex text-[9px] font-bold px-1.5 py-0.5 ${CM[type.clr].bg} ${CM[type.clr].t} rounded`}>{type.lbl}{employee.tip === 'hisseli' ? ` %${employee.hisse}` : ''}</span></td>
      <td className="px-3 py-2.5 text-right">
        <button type="button" onClick={(event) => { event.stopPropagation(); onEdit(employee); }} className="p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
          <Svg><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></Svg>
        </button>
      </td>
    </tr>
  );
}

function PersonelDetail({ employee, onBack, onEdit, onToast }: { employee: Employee; onBack: () => void; onEdit: () => void; onToast: (title: string, text: string, color?: ColorName) => void }) {
  const sirketInfo = employee.sirket === 'digital' ? { ad: 'Arma Digital Medya A.Ş.', tag: 'TEKNOPARK', clr: 'emerald' as ColorName } : { ad: 'Arma Bilişim Ltd. Şti.', tag: 'STANDART', clr: 'indigo' as ColorName };
  const hasSgk = employee.tip === 'personel' || employee.tip === 'hisseli';
  const brutTahmin = employee.netMaas > 0 ? Math.round(employee.netMaas * 1.42) : 0;
  const sgkIsci = Math.round(employee.sgkMatrah * 0.14);
  const issizlikIsci = Math.round(employee.sgkMatrah * 0.01);
  const sgkIsveren = Math.round(employee.sgkMatrah * 0.205);
  const issizlikIsveren = Math.round(employee.sgkMatrah * 0.02);
  const toplamMaliyet = employee.netMaas + sgkIsci + issizlikIsci + sgkIsveren + issizlikIsveren + Math.round(brutTahmin * 0.15);

  return (
    <>
      <div className="flex items-center gap-2 mb-1">
        <button type="button" onClick={onBack} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 text-gray-700 dark:text-gray-300 text-[11px] font-semibold rounded-md hover:bg-gray-50 dark:hover:bg-white/5">
          <Svg><polyline points="15 18 9 12 15 6" /></Svg>
          Ekip Listesi
        </button>
        <span className="text-[11px] text-gray-400">/</span>
        <span className="text-[11px] text-gray-500 dark:text-gray-400">Personel Detayı</span>
        <span className="text-[11px] text-gray-400">/</span>
        <span className="text-[11px] font-bold text-gray-900 dark:text-gray-100">{employee.ad}</span>
      </div>

      <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
        <div className={`p-5 bg-gradient-to-br ${CM[employee.clr].bg} dark:from-${employee.clr}-500/15 dark:via-${employee.clr}-500/5 flex items-start justify-between gap-3 flex-wrap`}>
          <div className="flex items-start gap-4 min-w-0">
            <div className={`w-20 h-20 ${CM[employee.clr].avatar} rounded-full flex items-center justify-center shrink-0 shadow-lg`}>
              <span className="text-white font-black text-[24px]">{employee.avatar}</span>
            </div>
            <div className="min-w-0">
              <h2 className="text-[22px] font-black text-gray-900 dark:text-gray-100 leading-tight">{employee.ad}</h2>
              <p className={`text-[14px] ${CM[employee.clr].t} font-semibold mt-0.5`}>{employee.gorev}</p>
              <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
                <Tag color={employee.tip === 'kar-ortak' ? 'amber' : employee.tip === 'freelance' ? 'gray' : employee.tip === 'hisseli' ? 'rose' : 'emerald'}>{employee.tip === 'hisseli' ? `HİSSELİ ORTAK · %${employee.hisse}` : employee.tip === 'kar-ortak' ? 'KAR ORTAĞI' : employee.tip === 'freelance' ? 'FREELANCE' : 'TAM ZAMANLI'}</Tag>
                <Tag color={sirketInfo.clr}>{sirketInfo.tag}</Tag>
                <span className="text-[10px] text-gray-500 font-mono">{employee.id}</span>
                <span className="text-[10px] font-mono text-gray-500">TC: {employee.tc}</span>
                {employee.junior && <Tag color="violet">JR</Tag>}
                {employee.kidemli && <Tag color="amber">KIDEMLİ</Tag>}
                {employee.key && <Tag color="emerald">ANAHTAR</Tag>}
                {employee.asgari && <Tag color="sky">ASGARİ</Tag>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button type="button" onClick={onEdit} className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-[#1e1f26] border border-sky-300 dark:border-sky-500/30 text-sky-700 dark:text-sky-300 text-[11px] font-bold rounded-md hover:bg-sky-50">
              <Svg><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></Svg>
              Düzenle
            </button>
            <button type="button" onClick={() => onToast('Prim Ekle', `${employee.ad} için prim kayıt paneli açıldı`, 'amber')} className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-[#1e1f26] border border-amber-300 dark:border-amber-500/30 text-amber-700 dark:text-amber-300 text-[11px] font-bold rounded-md hover:bg-amber-50">
              <Svg><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></Svg>
              Prim Ekle
            </button>
            <button type="button" onClick={() => onToast('Özlük Dosyası', `${employee.belgeler.length} belge listelendi`, 'rose')} className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-[#1e1f26] border border-rose-300 dark:border-rose-500/30 text-rose-700 dark:text-rose-300 text-[11px] font-bold rounded-md hover:bg-rose-50 relative">
              <Svg><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></Svg>
              Özlük Dosyası
              {employee.belgeler.length > 0 && <span className="absolute -top-1 -right-1 text-[8px] font-black px-1.5 py-0.5 bg-rose-600 text-white rounded-full shadow">{employee.belgeler.length}</span>}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2 space-y-3">
          <DetailCard title="Kişisel Bilgiler" icon={<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>}>
            <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-[11px]">
              <Info label="TC Kimlik" value={employee.tc} mono />
              <Info label="Doğum" value={employee.dogumTarihi} />
              <Info label="E-posta" value={employee.email} mono wide />
              <Info label="Telefon" value={employee.tel} mono />
              <div className="col-span-3"><p className="text-gray-500 text-[9px] uppercase tracking-wider">IBAN (Maaş)</p><p className="font-mono text-gray-900 dark:text-gray-100 text-[10px] truncate mt-0.5">{employee.iban}</p></div>
              <div className="col-span-4"><p className="text-gray-500 text-[9px] uppercase tracking-wider">Öğrenim</p><p className="text-gray-700 dark:text-gray-300 mt-0.5">{employee.ogrenim}</p></div>
            </div>
          </DetailCard>

          <DetailCard title="İstihdam Bilgileri" color="indigo" icon={<><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></>}>
            <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              <SmallBox label="Şirket" value={sirketInfo.ad.split(' ').slice(0, 2).join(' ')} sub={sirketInfo.tag} color={sirketInfo.clr} />
              <SmallBox label="Departman" value={employee.dept} />
              <SmallBox label="Başlangıç" value={employee.baslangic} mono />
              <div className="p-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-md">
                <p className="text-[9px] font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider">Kıdem</p>
                <p className="text-[16px] font-black text-amber-700 dark:text-amber-300 mt-0.5 font-mono">{employee.kidem ?? 0} yıl</p>
              </div>
            </div>
          </DetailCard>

          {hasSgk && (
            <DetailCard title="Ücret & SGK Detayı" color="emerald" icon={<><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></>}>
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <PayrollBox label="Net Maaş" value={money(employee.netMaas)} color="emerald" />
                  <PayrollBox label="SGK Matrahı" value={money(employee.sgkMatrah)} color="sky" />
                  <PayrollBox label="Brüt Tahmin" value={money(brutTahmin)} color="amber" />
                  <PayrollBox label="Toplam Maliyet" value={money(toplamMaliyet)} color="rose" />
                </div>
                <div className="p-2.5 bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded">
                  <p className="text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">SGK Prim Hesaplama Önizleme (SGK Matrahı üzerinden)</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px]">
                    <PayrollBox label="SGK İşçi %14" value={money(sgkIsci)} color="sky" compact />
                    <PayrollBox label="İşsizlik İşçi %1" value={money(issizlikIsci)} color="sky" compact />
                    <PayrollBox label="SGK İşveren %20.5" value={money(sgkIsveren)} color="rose" compact />
                    <PayrollBox label="İşsizlik İşveren %2" value={money(issizlikIsveren)} color="rose" compact />
                  </div>
                </div>
                <div className="p-2 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded text-[10px] text-amber-800 dark:text-amber-200">
                  <span className="font-bold">ℹ Not:</span> Net maaş = çalışanın aldığı tutar · SGK matrahı = prime esas kazanç (resmi kayıt) · iki değer farklı olabilir
                </div>
              </div>
            </DetailCard>
          )}
        </div>

        <div className="space-y-3">
          <SidePanel title="Yan Haklar" color="emerald" items={employee.yanHaklar.length ? employee.yanHaklar : ['Tanımlı yan hak yok']} />
          <SidePanel title="Zimmetler" color="indigo" items={employee.zimmetler.length ? employee.zimmetler : ['Aktif zimmet yok']} />
          <SidePanel title="Özlük Belgeleri" color="rose" items={employee.belgeler.length ? employee.belgeler : ['Belge bekleniyor']} />
          <SidePanel title="Eğitim & Sertifika" color="violet" items={[...employee.egitimler, ...employee.sertifikalar].length ? [...employee.egitimler, ...employee.sertifikalar] : ['Kayıt yok']} />
          <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-3">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Notlar</p>
            <p className="text-[11px] text-gray-700 dark:text-gray-300 leading-relaxed">{employee.notlar}</p>
          </div>
        </div>
      </div>
    </>
  );
}

function DetailCard({ title, icon, children, color = 'gray' }: { title: string; icon: ReactNode; children: ReactNode; color?: ColorName }) {
  return (
    <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
      <div className="p-3 border-b border-gray-100 dark:border-gray-700/40 flex items-center gap-2">
        <Svg className={`${CM[color].t} w-4 h-4`}>{icon}</Svg>
        <h3 className="text-[13px] font-bold text-gray-900 dark:text-gray-100">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Info({ label, value, mono = false, wide = false }: { label: string; value: string; mono?: boolean; wide?: boolean }) {
  return <div className={wide ? 'col-span-2' : ''}><p className="text-gray-500 text-[9px] uppercase tracking-wider">{label}</p><p className={`${mono ? 'font-mono text-[10px]' : 'font-bold'} text-gray-900 dark:text-gray-100 mt-0.5 truncate`}>{value}</p></div>;
}

function SmallBox({ label, value, sub, color = 'gray', mono = false }: { label: string; value: string; sub?: string; color?: ColorName; mono?: boolean }) {
  return (
    <div className="p-3 bg-gray-50 dark:bg-[#17181f] rounded-md">
      <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">{label}</p>
      <p className={`text-[12px] font-bold ${color === 'gray' ? 'text-gray-900 dark:text-gray-100' : CM[color].t} mt-0.5 ${mono ? 'font-mono' : ''}`}>{value}</p>
      {sub && <p className="text-[9px] text-gray-500">{sub}</p>}
    </div>
  );
}

function PayrollBox({ label, value, color, compact = false }: { label: string; value: string; color: ColorName; compact?: boolean }) {
  return (
    <div className={`${compact ? 'p-2' : 'p-3'} ${CM[color].bg} border ${CM[color].border} rounded-md`}>
      <p className={`${compact ? 'text-[9px]' : 'text-[9px]'} font-bold ${CM[color].t} uppercase tracking-wider`}>{label}</p>
      <p className={`${compact ? 'text-[11px]' : 'text-[14px]'} font-black ${CM[color].t} mt-0.5 font-mono`}>{value}</p>
    </div>
  );
}

function SidePanel({ title, items, color }: { title: string; items: string[]; color: ColorName }) {
  return (
    <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
      <div className="p-3 border-b border-gray-100 dark:border-gray-700/40 flex items-center justify-between">
        <h3 className="text-[12px] font-bold text-gray-900 dark:text-gray-100">{title}</h3>
        <Tag color={color}>{items.length}</Tag>
      </div>
      <div className="p-3 space-y-2">
        {items.map((item) => (
          <div key={item} className={`p-2 ${CM[color].bg} border ${CM[color].border} rounded-md text-[11px] font-semibold ${CM[color].t}`}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function BordroTab({ employees, onSelect }: { employees: Employee[]; onSelect: (id: string) => void }) {
  const list = employees.slice(0, 12);
  const total = list.reduce((sum, employee) => sum + employee.netMaas, 0);
  return (
    <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
      <div className="p-3 border-b border-gray-100 dark:border-gray-700/40 flex items-center justify-between">
        <div className="flex items-center gap-2"><Svg className="text-emerald-600 dark:text-emerald-400 w-4 h-4"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></Svg><h3 className="text-[13px] font-bold text-gray-900 dark:text-gray-100">Nisan 2026 Maaş Bordrosu</h3></div>
        <Tag color="emerald">{money(total)}</Tag>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[11px]">
          <thead className="bg-gray-50 dark:bg-[#17181f]"><tr><th className="text-left px-3 py-2">Personel</th><th className="text-left px-3 py-2">Şirket</th><th className="text-right px-3 py-2">Net Maaş</th><th className="text-right px-3 py-2">SGK Matrah</th><th className="text-center px-3 py-2">Durum</th></tr></thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700/30">
            {list.map((employee) => <tr key={employee.id} onClick={() => onSelect(employee.id)} className="hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer"><td className="px-3 py-2.5 font-bold text-gray-900 dark:text-gray-100">{employee.ad}</td><td className="px-3 py-2.5 text-gray-600 dark:text-gray-400">{employee.sirket === 'digital' ? 'Arma Digital' : 'Arma Bilişim'}</td><td className="px-3 py-2.5 text-right font-mono font-bold">{money(employee.netMaas)}</td><td className="px-3 py-2.5 text-right font-mono">{money(employee.sgkMatrah)}</td><td className="px-3 py-2.5 text-center"><Tag color="emerald">HAZIR</Tag></td></tr>)}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PrimTab({ employees, onToast }: { employees: Employee[]; onToast: (title: string, text: string, color?: ColorName) => void }) {
  const rows = employees.slice(0, 8).map((employee, index) => ({ employee, mesai: [4, 8, 0, 12, 5, 6, 2, 9][index], prim: [6000, 4500, 0, 12000, 2500, 3800, 0, 7200][index] }));
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
      <div className="lg:col-span-2 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
        <div className="p-3 border-b border-gray-100 dark:border-gray-700/40 flex items-center justify-between">
          <h3 className="text-[13px] font-bold text-gray-900 dark:text-gray-100">Prim & Ek Mesai Listesi</h3>
          <button type="button" onClick={() => onToast('Prim Kaydı', 'Yeni prim/ek mesai formu açıldı', 'amber')} className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold rounded-md">Yeni Kayıt</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead className="bg-gray-50 dark:bg-[#17181f]"><tr><th className="text-left px-3 py-2">Personel</th><th className="text-right px-3 py-2">Ek Mesai</th><th className="text-right px-3 py-2">Prim</th><th className="text-center px-3 py-2">Durum</th></tr></thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/30">{rows.map(({ employee, mesai, prim }) => <tr key={employee.id}><td className="px-3 py-2.5 font-bold text-gray-900 dark:text-gray-100">{employee.ad}</td><td className="px-3 py-2.5 text-right font-mono">{mesai} saat</td><td className="px-3 py-2.5 text-right font-mono font-bold">{money(prim)}</td><td className="px-3 py-2.5 text-center"><Tag color={prim > 0 ? 'amber' : 'gray'}>{prim > 0 ? 'ONAYDA' : 'YOK'}</Tag></td></tr>)}</tbody>
          </table>
        </div>
      </div>
      <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-4">
        <h3 className="text-[13px] font-bold text-gray-900 dark:text-gray-100 mb-3">Dönem Özeti</h3>
        <PayrollBox label="Toplam Prim" value={money(rows.reduce((s, r) => s + r.prim, 0))} color="amber" />
        <div className="h-2" />
        <PayrollBox label="Ek Mesai Saati" value={`${rows.reduce((s, r) => s + r.mesai, 0)} saat`} color="sky" />
      </div>
    </div>
  );
}

function IzinTab({ employees }: { employees: Employee[] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
      {employees.slice(0, 9).map((employee, index) => (
        <div key={employee.id} className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-3"><div className={`w-8 h-8 ${CM[employee.clr].avatar} rounded-full flex items-center justify-center`}><span className="text-white text-[10px] font-bold">{employee.avatar}</span></div><div><p className="text-[12px] font-bold text-gray-900 dark:text-gray-100">{employee.ad}</p><p className="text-[9px] text-gray-500">{employee.dept}</p></div></div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <PayrollBox label="Hak" value={`${14 + (employee.kidem ?? 0)}`} color="emerald" compact />
            <PayrollBox label="Kullanılan" value={`${[2, 4, 6, 1, 3, 0, 5, 7, 2][index]}`} color="amber" compact />
            <PayrollBox label="Kalan" value={`${12 + (employee.kidem ?? 0) - [2, 4, 6, 1, 3, 0, 5, 7, 2][index]}`} color="sky" compact />
          </div>
        </div>
      ))}
    </div>
  );
}

function HakedisTab({ employees, onSelect, onToast }: { employees: Employee[]; onSelect: (id: string) => void; onToast: (title: string, text: string, color?: ColorName) => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {employees.map((employee) => (
        <div key={employee.id} className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
          <div className="p-4 flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className={`w-11 h-11 ${CM.gray.avatar} rounded-full flex items-center justify-center`}><span className="text-white text-[12px] font-bold">{employee.avatar}</span></div>
              <div><h3 className="text-[14px] font-bold text-gray-900 dark:text-gray-100">{employee.ad}</h3><p className="text-[11px] text-gray-500">{employee.gorev}</p><Tag color="gray">₺{employee.adamSaat}/saat</Tag></div>
            </div>
            <button type="button" onClick={() => onSelect(employee.id)} className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-[11px] font-bold rounded-md">Detay</button>
          </div>
          <div className="px-4 pb-4 grid grid-cols-3 gap-2">
            <PayrollBox label="Saat" value="42" color="gray" compact />
            <PayrollBox label="Hakediş" value={money((employee.adamSaat ?? 0) * 42)} color="emerald" compact />
            <button type="button" onClick={() => onToast('Hakediş', `${employee.ad} hakedişi onaya gönderildi`, 'emerald')} className="px-2 py-2 bg-emerald-600 text-white rounded-md text-[10px] font-bold">Onaya Gönder</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function RaporlarTab({ employees }: { employees: Employee[] }) {
  const personel = employees.filter((employee) => employee.tip === 'personel');
  const payroll = personel.reduce((sum, employee) => sum + employee.netMaas, 0);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
      {[
        { title: 'Departman Dağılımı', value: '9 departman', color: 'rose' as ColorName },
        { title: 'Bordro Maliyeti', value: money(payroll), color: 'emerald' as ColorName },
        { title: 'Kıdemli Personel', value: `${employees.filter((employee) => employee.kidemli).length} kişi`, color: 'amber' as ColorName },
        { title: 'Eksik Özlük', value: '3 belge', color: 'violet' as ColorName },
      ].map((card) => (
        <div key={card.title} className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-4">
          <p className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">{card.title}</p>
          <p className={`text-[22px] font-black ${CM[card.color].t} font-mono`}>{card.value}</p>
          <div className={`h-1.5 rounded-full mt-3 ${CM[card.color].bar}`} />
        </div>
      ))}
      <div className="lg:col-span-4 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-4">
        <h3 className="text-[13px] font-bold text-gray-900 dark:text-gray-100 mb-3">Ekip Raporları</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {['Aylık Bordro Raporu', 'SGK Matrah Karşılaştırması', 'Departman Maliyet Analizi'].map((report, index) => <button key={report} type="button" className="p-4 text-left bg-gray-50 dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-lg hover:border-violet-300"><p className="text-[12px] font-bold text-gray-900 dark:text-gray-100">{report}</p><p className="text-[10px] text-gray-500 mt-1">{['PDF · Excel', 'Excel', 'Dashboard'][index]}</p></button>)}
        </div>
      </div>
    </div>
  );
}

function PersonelModal({ modal, onClose, onToast }: { modal: ModalState; onClose: () => void; onToast: (title: string, text: string, color?: ColorName) => void }) {
  if (!modal) return null;
  const employee = modal.type === 'edit' ? modal.employee : null;
  const isNew = modal.type === 'new';

  const save = () => {
    onToast(isNew ? 'Yeni Personel' : 'Personel Güncellendi', isNew ? 'Personel kaydı taslak olarak oluşturuldu' : `${employee?.ad} bilgileri güncellendi`, 'emerald');
    onClose();
  };

  return (
    <ModalFrame onClose={onClose}>
      <div className="sticky top-0 z-10 bg-white dark:bg-[#1e1f26] border-b border-gray-100 dark:border-gray-700/60 p-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-rose-100 dark:bg-rose-500/20 rounded-lg flex items-center justify-center">
            <Svg className="text-rose-600 dark:text-rose-400 w-4 h-4">{isNew ? <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></> : <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />}</Svg>
          </div>
          <div>
            <h2 className="text-[16px] font-bold text-gray-900 dark:text-gray-100">{isNew ? 'Yeni Personel Ekle' : 'Personel Düzenle'}</h2>
            <p className="text-[10px] text-gray-500">{isNew ? 'Tüm detaylı bilgileri girin' : `${employee?.ad} · ${employee?.id}`}</p>
          </div>
        </div>
        <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-700 p-1"><Svg className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Svg></button>
      </div>

      <div className="p-5 space-y-4">
        <FormSection step="1" title="Kişisel Bilgiler">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-3 bg-gray-50 dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md">
            <div className="lg:col-span-2"><Field label="Ad Soyad *"><input type="text" defaultValue={employee?.ad ?? ''} className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100" /></Field></div>
            <Field label="TC Kimlik No *"><input type="text" defaultValue={employee?.tc ?? ''} placeholder="12345678901" maxLength={11} className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono" /></Field>
            <Field label="Doğum Tarihi"><input type="date" defaultValue={employee?.dogumTarihi ?? ''} className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono" /></Field>
            <Field label="Medeni Durum"><select className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100"><option>Evli</option><option>Bekar</option><option>Dul</option><option>Boşanmış</option></select></Field>
            <Field label="Çocuk Sayısı (AGİ)"><input type="number" defaultValue="0" className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono text-right" /></Field>
            <div className="lg:col-span-3"><Field label="İkamet Adresi"><textarea rows={2} placeholder="Mahalle, Cadde, Sokak, İlçe, İl" className="w-full px-3 py-2 text-[11px] bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 resize-none" /></Field></div>
            <Field label="E-posta *"><input type="email" defaultValue={employee?.email ?? ''} className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono" /></Field>
            <Field label="Cep Telefonu *"><input type="text" defaultValue={employee?.tel ?? ''} placeholder="+90 5XX XXX XXXX" className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono" /></Field>
            <Field label="Acil Durum İletişim"><input type="text" placeholder="İsim / telefon" className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100" /></Field>
          </div>
        </FormSection>

        <FormSection step="2" title="İstihdam Bilgileri">
          <div className="p-3 bg-gray-50 dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md space-y-3">
            <div>
              <label className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-2">Çalıştığı Şirket *</label>
              <div className="grid grid-cols-2 gap-2">
                <CompanyRadio title="Arma Digital Medya A.Ş." tag="TEKNOPARK" sub="KDV %0 · Kurumlar muaf · 4691 sayılı kanun" color="emerald" defaultChecked={!employee || employee.sirket === 'digital'} />
                <CompanyRadio title="Arma Bilişim Ltd. Şti." tag="STANDART" sub="KDV %20 · Kurumlar %25" color="indigo" defaultChecked={employee?.sirket === 'bilisim'} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="lg:col-span-2"><Field label="Görev / Pozisyon *"><input type="text" defaultValue={employee?.gorev ?? ''} className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100" /></Field></div>
              <Field label="Departman *"><select defaultValue={employee?.dept ?? 'Yazılım'} className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100">{['Yazılım', 'Web', 'SEO', 'Sosyal Medya', 'Pazarlama', 'Finans ve İdari', 'AI Otomasyon', 'Sunucu ve Sistem', 'Müşteri İlişkileri', 'İdari'].map((dept) => <option key={dept}>{dept}</option>)}</select></Field>
              <Field label="İstihdam Türü *"><select defaultValue={employee?.tip ?? 'personel'} className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100"><option value="personel">Tam Zamanlı Personel</option><option value="freelance">Freelance (Adam/Saat)</option><option value="kar-ortak">Kar Ortağı</option><option value="hisseli">Hisseli Ortak</option></select></Field>
              <Field label="İşe Başlangıç *"><input type="date" defaultValue={employee?.baslangic ?? '2026-01-01'} className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono" /></Field>
              <Field label="Sözleşme Türü"><select className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100"><option>Belirsiz Süreli</option><option>Belirli Süreli</option><option>Deneme Süresi (2 ay)</option><option>Part-Time</option><option>Stajyer</option></select></Field>
            </div>
          </div>
        </FormSection>

        <FormSection step="3" title="Ücret ve SGK">
          <div className="p-3 bg-gradient-to-br from-emerald-50/50 to-sky-50/50 dark:from-emerald-500/5 dark:to-sky-500/5 border border-emerald-200 dark:border-emerald-500/30 rounded-md space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Field label="Net Maaş (₺) *"><input type="text" defaultValue={employee?.netMaas ? employee.netMaas.toLocaleString('tr-TR') : ''} placeholder="35.000" className="w-full px-3 py-2 text-[13px] bg-white dark:bg-[#1e1f26] border-2 border-emerald-300 dark:border-emerald-500/40 rounded-md text-emerald-800 dark:text-emerald-200 font-mono text-right font-bold" /><p className="text-[9px] text-emerald-600 mt-1">Çalışanın eline geçecek tutar</p></Field>
              <Field label="SGK Matrahı (₺) *"><input type="text" defaultValue={employee?.sgkMatrah ? employee.sgkMatrah.toLocaleString('tr-TR') : ''} placeholder="22.104" className="w-full px-3 py-2 text-[13px] bg-white dark:bg-[#1e1f26] border-2 border-sky-300 dark:border-sky-500/40 rounded-md text-sky-800 dark:text-sky-200 font-mono text-right font-bold" /><p className="text-[9px] text-sky-600 mt-1">Prime esas kazanç · SGK'ya bildirilir</p></Field>
              <Field label="Ek Mesai Saat (₺)"><input type="text" defaultValue={employee?.ekMesaiSaatUcret ?? ''} placeholder="250" className="w-full px-3 py-2 text-[13px] bg-white dark:bg-[#1e1f26] border-2 border-amber-300 dark:border-amber-500/40 rounded-md text-amber-800 dark:text-amber-200 font-mono text-right font-bold" /><p className="text-[9px] text-amber-600 mt-1">Normal saat × 1.5</p></Field>
            </div>
          </div>
        </FormSection>

        <FormSection step="4" title="Banka ve Maaş Ödeme">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-gray-50 dark:bg-[#17181f] border border-gray-200 dark:border-gray-700 rounded-md">
            <Field label="Banka"><select className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100"><option>Garanti BBVA</option><option>Enpara (QNB)</option><option>TEB</option><option>İş Bankası</option><option>Akbank</option></select></Field>
            <Field label="Ödeme Günü"><select className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100"><option>Ayın 1'i</option><option>Ayın 5'i</option><option>Ayın 15'i</option><option>Ayın son günü</option></select></Field>
            <div className="md:col-span-2"><Field label="IBAN (maaş yatırılacak)"><input type="text" defaultValue={employee?.iban ?? ''} placeholder="TR__ ____ ____ ____ ____ ____ __" className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 font-mono" /></Field></div>
          </div>
        </FormSection>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700/50">
          {employee ? <button type="button" onClick={() => onToast('Arşiv', `${employee.ad} için arşiv uyarısı oluşturuldu`, 'rose')} className="px-3 py-2 text-[11px] font-semibold text-rose-600 hover:bg-rose-50 rounded-md">Personeli Arşivle</button> : <span />}
          <div className="flex items-center gap-2">
            <button type="button" onClick={onClose} className="px-3 py-2 text-[11px] font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">İptal</button>
            <button type="button" onClick={save} className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold rounded-md shadow-sm">Kaydet</button>
          </div>
        </div>
      </div>
    </ModalFrame>
  );
}

function FormSection({ step, title, children }: { step: string; title: string; children: ReactNode }) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-2">
        <span className="w-6 h-6 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-full flex items-center justify-center text-[11px] font-black">{step}</span>
        <h3 className="text-[12px] font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">{title}</h3>
      </div>
      {children}
    </section>
  );
}

function CompanyRadio({ title, tag, sub, color, defaultChecked }: { title: string; tag: string; sub: string; color: ColorName; defaultChecked?: boolean }) {
  return (
    <label className="cursor-pointer">
      <input type="radio" name="sirket" defaultChecked={defaultChecked} className="sr-only peer" />
      <div className={`p-3 bg-white dark:bg-[#1e1f26] border-2 border-gray-200 peer-checked:${CM[color].border} rounded-md`}>
        <div className="flex items-center justify-between">
          <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100">{title}</p>
          <Tag color={color}>{tag}</Tag>
        </div>
        <p className="text-[9px] text-gray-500 mt-0.5">{sub}</p>
      </div>
    </label>
  );
}

function Toast({ toast }: { toast: Exclude<ToastState, null> }) {
  return (
    <div className={`absolute right-4 top-4 z-50 bg-white dark:bg-[#1e1f26] border ${CM[toast.color].border} rounded-lg shadow-xl p-3 min-w-[260px]`}>
      <p className={`text-[12px] font-bold ${CM[toast.color].t}`}>{toast.title}</p>
      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{toast.text}</p>
    </div>
  );
}
