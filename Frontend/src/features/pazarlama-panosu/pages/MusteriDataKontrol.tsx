import { type ChangeEvent, type ReactNode, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useSearchParams } from 'react-router-dom';
import { createCustomer, getCustomerById, getCustomers, updateCustomer, type CreateCustomerPayload, type CustomerResponse } from '../../../services/customerApi';
import { getCustomerOldById, getCustomersOld, transferCustomerOldToCustomers, type CustomerOldResponse } from '../../../services/customerOldApi';
import { normalizeCustomerFormField, validateCustomerForm } from '../../../utils/customerFormValidation';

type ColorName = 'emerald' | 'amber' | 'rose' | 'sky' | 'violet' | 'indigo' | 'teal' | 'gray';
type CustomerTab = 'general' | 'contacts' | 'services' | 'finance' | 'technical' | 'digital' | 'notes';
type NewCustomerTab = 's' | 'b';

type Customer = {
  id: number | string;
  co: string;
  no: string;
  ct: string;
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
};

type DetailContact = {
  key: string;
  contactNumber: number;
  fullName: string;
  title: string;
  phone: string;
  email: string;
};

type CustomerModalForm = Record<string, string>;
type CustomerModalMode = 'create' | 'edit' | 'transfer';

const MAX_CONTACTS = 30;
const CONTACT_TITLE_OPTIONS = ['', 'Genel Müdür', 'Kurucu', 'Pazarlama Müdürü', 'Operasyon Sorumlusu', 'Satın Alma Sorumlusu'];

function createContactFields() {
  const fields: CustomerModalForm = {};

  for (let index = 1; index <= MAX_CONTACTS; index += 1) {
    fields[`contact${index}FullName`] = '';
    fields[`contact${index}Phone`] = '';
    fields[`contact${index}Email`] = '';
    fields[`contact${index}Title`] = '';
  }

  return fields;
}

function createCustomerModalForm(): CustomerModalForm {
  return {
    brandName: '',
    officialTitle: '',
    customerCode: '',
    customerStatus: '',
    dataQualityStatus: '',
    source: '',
    segment: '',
    companyPhone: '',
    companyWhatsapp: '',
    companyEmail: '',
    website: '',
    address: '',
    city: '',
    country: '',
    ...createContactFields(),
    taxNumber: '',
    taxOffice: '',
    iban: '',
    invoiceEmail: '',
    invoiceAddress: '',
    financeResponsible: '',
    financeContactPerson: '',
    lastPaymentInfo: '',
    collectionNote: '',
    financeNote: '',
    instagramUrl: '',
    linkedinUrl: '',
    facebookUrl: '',
    marketingSegmentDetailNote: '',
    newsletterPermissionStatus: '',
    newsletterPermission: '',
    marketingSegmentNote: '',
    summaryNote: '',
    salesHandoverNote: '',
    notes: '',
  };
}

function customerValueToForm(value: unknown) {
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'boolean') return value ? 'Var' : 'Yok';
  return String(value ?? '');
}

function createCustomerModalFormFromCustomer(customer: CustomerResponse): CustomerModalForm {
  const form = createCustomerModalForm();

  Object.keys(form).forEach((key) => {
    form[key] = customerValueToForm(customer[key]);
  });

  form.financeResponsible = customerValueToForm(customer.financeContactPerson ?? customer['financeResponsible']);
  form.newsletterPermissionStatus = customerValueToForm(customer.newsletterPermission);
  form.newsletterPermission = customerValueToForm(customer.newsletterPermission);

  return form;
}

function customerContactIndexes(customer: CustomerResponse) {
  const indexes = Array.from({ length: MAX_CONTACTS }, (_, index) => index + 1).filter((contactIndex) => {
    return ['FullName', 'Phone', 'Email', 'Title'].some((field) => String(customer[`contact${contactIndex}${field}`] ?? '').trim());
  });

  return indexes.length > 0 ? Array.from(new Set([1, ...indexes])) : [1];
}

function customerServices(customer: CustomerResponse) {
  return Array.isArray(customer.services) ? customer.services.filter((service): service is string => typeof service === 'string') : [];
}

function customerOldToModalCustomer(customer: CustomerOldResponse): CustomerResponse {
  return {
    id: String(customer.id),
    customerCode: customer.customerCode ?? '',
    brandName: customer.brandName ?? '',
    officialTitle: customer.officialTitle ?? '',
    customerStatus: customer.customerStatus ?? 'Aktif',
    dataQualityStatus: customer.dataQualityStatus ?? 'Kontrol Gerekli',
    source: customer.source ?? 'CustomersOld',
    segment: customer.segment ?? '',
    companyPhone: customer.companyPhone ?? '',
    companyEmail: customer.companyEmail ?? '',
    city: customer.city ?? '',
    country: customer.country ?? '',
    createdAt: customer.createdAt ?? null,
    updatedAt: customer.updatedAt ?? null,
    isDeleted: customer.isDeleted ?? false,
    services: [],
  };
}

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

const P = {
  eye: (
    <>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  edit: (
    <>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </>
  ),
  send: (
    <>
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </>
  ),
  plus: (
    <>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </>
  ),
  alert: (
    <>
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </>
  ),
  chk: <polyline points="20 6 9 17 4 12" />,
  arr: (
    <>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </>
  ),
  db: (
    <>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </>
  ),
  user: (
    <>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </>
  ),
  file: (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </>
  ),
  x: (
    <>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </>
  ),
  filter: <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />,
  chevron: <polyline points="6 9 12 15 18 9" />,
  back: (
    <>
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </>
  ),
  upload: (
    <>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </>
  ),
};

const STATUS_FILTERS = ['Tümü', 'Aktif', 'Pasif', 'Potansiyel', 'Yeniden Pazarlama'];
const DETAIL_TABS: Array<{ id: CustomerTab; label: string }> = [
  { id: 'general', label: 'Genel Bilgiler' },
  { id: 'contacts', label: 'Yetkililer' },
  { id: 'services', label: 'Hizmetler' },
  { id: 'finance', label: 'Finans' },
  { id: 'technical', label: 'Teknik Varlıklar' },
  { id: 'digital', label: 'Dijital Erişimler' },
  { id: 'notes', label: 'Notlar / Log' },
];
const SERVICE_OPTIONS = ['SEO', 'Web Sitesi', 'Google Ads', 'Meta Reklam', 'Sosyal Medya', 'E-Bülten', 'Domain', 'Marka Tescili', 'Marka Konumlandırma', 'Kurumsal Kimlik', 'Mobil Uygulama', 'Prodüksiyon', 'Bakım Destek', 'Hosting', 'ADOS360'];

function Icon({ children, className = 'w-3.5 h-3.5 shrink-0' }: { children: ReactNode; className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      {children}
    </svg>
  );
}

function Bdg({ children, color }: { children: ReactNode; color: ColorName }) {
  const tone = CM[color] || CM.gray;
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${tone.bg} ${tone.t} whitespace-nowrap`}>{children}</span>;
}

function display(value: unknown, fallback = '—') {
  const text = String(value ?? '').trim();
  return text ? text : fallback;
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

function formatCustomerDate(value: unknown) {
  const textValue = String(value ?? '').trim();
  if (!textValue) return '—';

  const date = new Date(textValue);
  if (Number.isNaN(date.getTime())) return textValue;

  return new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
}

function customerMissingFieldCount(customer: CustomerResponse) {
  const requiredFields = [
    'brandName',
    'officialTitle',
    'customerStatus',
    'source',
    'segment',
    'companyPhone',
    'companyWhatsapp',
    'companyEmail',
    'website',
    'city',
    'country',
    'address',
    'taxNumber',
    'taxOffice',
    'invoiceEmail',
    'contact1FullName',
    'contact1Phone',
    'contact1Email',
    'contact1Title',
  ];

  return requiredFields.filter((field) => String(customer[field] ?? '').trim().length === 0).length;
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
    tp: customerStatus,
    tc: customerColor(customerStatus),
    sv: Array.isArray(customer.services) ? customer.services : [],
    dt: dataQualityStatus,
    dc: qualityColor(dataQualityStatus),
    mx: `Eksik Alan: ${customerMissingFieldCount(customer)}`,
    sg: segment,
    sc: segment === '—' ? 'gray' : 'violet',
    nl: newsletterPermission,
    nc: newsletterPermission === 'Var' ? 'emerald' : 'amber',
    up: formatCustomerDate(customer.lastUpdatedAt ?? customer.updatedAt ?? customer.createdAt),
  };
}

function buildCreateCustomerPayload(form: CustomerModalForm, selectedServices: string[]): CreateCustomerPayload {
  return {
    ...form,
    services: selectedServices,
    dataQualityStatus: form.dataQualityStatus || 'Kontrol Gerekli',
    newsletterPermission: form.newsletterPermissionStatus || form.newsletterPermission,
    financeContactPerson: form.financeContactPerson || form.financeResponsible,
    collectionNote: form.collectionNote || form.financeNote,
  };
}

function customerText(customer: CustomerResponse, key: string, fallback = '—') {
  return display(customer[key], fallback);
}

function customerDate(customer: CustomerResponse, key: string) {
  return formatCustomerDate(customer[key]);
}

function customerContacts(customer: CustomerResponse): DetailContact[] {
  return Array.from({ length: MAX_CONTACTS }, (_, index) => {
    const contactNumber = index + 1;
    const fullName = customerText(customer, `contact${contactNumber}FullName`);
    const phone = customerText(customer, `contact${contactNumber}Phone`);
    const email = customerText(customer, `contact${contactNumber}Email`);
    const title = customerText(customer, `contact${contactNumber}Title`);

    return {
      key: `contact-${contactNumber}`,
      contactNumber,
      fullName,
      title,
      phone,
      email,
    };
  }).filter((contact) => [contact.fullName, contact.phone, contact.email, contact.title].some((value) => value !== '—'));
}

function oldCustomerSearchText(customer: CustomerOldResponse) {
  return [customer.brandName, customer.officialTitle, customer.customerCode, customer.companyEmail, customer.companyPhone]
    .map((value) => String(value ?? '').toLocaleLowerCase('tr-TR'))
    .join(' ');
}

function oldCustomerFilterOptions(customers: CustomerOldResponse[], key: keyof CustomerOldResponse) {
  return Array.from(new Set(customers.map((customer) => String(customer[key] ?? '').trim()).filter(Boolean))).sort((first, second) => first.localeCompare(second, 'tr-TR'));
}

export default function MusteriDataKontrol() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [oldCustomers, setOldCustomers] = useState<CustomerOldResponse[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerResponse | null>(null);
  const [detailTab, setDetailTab] = useState<CustomerTab>('general');
  const [statusFilter, setStatusFilter] = useState('Tümü');
  const [search, setSearch] = useState('');
  const [isOldViewOpen, setIsOldViewOpen] = useState(false);
  const [oldSearch, setOldSearch] = useState('');
  const [oldStatusFilter, setOldStatusFilter] = useState('Tümü');
  const [oldSourceFilter, setOldSourceFilter] = useState('Tümü');
  const [oldSegmentFilter, setOldSegmentFilter] = useState('Tümü');
  const [oldCityFilter, setOldCityFilter] = useState('Tümü');
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [customerModalMode, setCustomerModalMode] = useState<CustomerModalMode>('create');
  const [editingCustomer, setEditingCustomer] = useState<CustomerResponse | null>(null);
  const [transferCustomerOldId, setTransferCustomerOldId] = useState<number | null>(null);
  const [newCustomerTab, setNewCustomerTab] = useState<NewCustomerTab>('s');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [saveMessage, setSaveMessage] = useState('');
  const [isCustomersLoading, setIsCustomersLoading] = useState(false);
  const [customerError, setCustomerError] = useState('');
  const [isOldCustomersLoading, setIsOldCustomersLoading] = useState(false);
  const [oldCustomerError, setOldCustomerError] = useState('');
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');
  const queryCustomerId = searchParams.get('customerId');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [oldCurrentPage, setOldCurrentPage] = useState(1);
  const [oldPageSize, setOldPageSize] = useState(10);

  async function loadCustomers() {
    setIsCustomersLoading(true);
    setCustomerError('');

    try {
      const data = await getCustomers();
      setCustomers(Array.isArray(data) ? data.map(mapCustomerResponseToCustomer) : []);
    } catch (error) {
      setCustomers([]);
      setCustomerError(error instanceof Error ? error.message : 'Müşteri listesi alınamadı.');
    } finally {
      setIsCustomersLoading(false);
    }
  }

  async function loadOldCustomers() {
    setIsOldCustomersLoading(true);
    setOldCustomerError('');

    try {
      const data = await getCustomersOld();
      setOldCustomers(Array.isArray(data) ? data : []);
    } catch (error) {
      setOldCustomers([]);
      setOldCustomerError(error instanceof Error ? error.message : 'Eski müşteri listesi alınamadı.');
    } finally {
      setIsOldCustomersLoading(false);
    }
  }

  useEffect(() => {
    void loadCustomers();
  }, []);

  useEffect(() => {
    if (queryCustomerId) {
      void openCustomerById(queryCustomerId);
    }
  }, [queryCustomerId]);

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const statusMatch =
        statusFilter === 'Tümü' ||
        (statusFilter === 'Aktif' && customer.tp.includes('Aktif')) ||
        (statusFilter === 'Pasif' && customer.tp.includes('Pasif')) ||
        (statusFilter === 'Potansiyel' && customer.tp.includes('Potansiyel')) ||
        (statusFilter === 'Yeniden Pazarlama' && customer.tp.includes('Yeniden Pazarlama'));
      const query = search.trim().toLocaleLowerCase('tr-TR');
      const searchMatch = !query || [customer.co, customer.no, customer.ct, customer.tp, customer.sg].some((item) => item.toLocaleLowerCase('tr-TR').includes(query));
      return statusMatch && searchMatch;
    });
  }, [customers, search, statusFilter]);

  const oldStatusOptions = useMemo(() => oldCustomerFilterOptions(oldCustomers, 'customerStatus'), [oldCustomers]);
  const oldSourceOptions = useMemo(() => oldCustomerFilterOptions(oldCustomers, 'source'), [oldCustomers]);
  const oldSegmentOptions = useMemo(() => oldCustomerFilterOptions(oldCustomers, 'segment'), [oldCustomers]);
  const oldCityOptions = useMemo(() => oldCustomerFilterOptions(oldCustomers, 'city'), [oldCustomers]);

  const filteredOldCustomers = useMemo(() => {
    const query = oldSearch.trim().toLocaleLowerCase('tr-TR');

    return oldCustomers.filter((customer) => {
      const searchMatch = !query || oldCustomerSearchText(customer).includes(query);
      const statusMatch = oldStatusFilter === 'Tümü' || String(customer.customerStatus ?? '') === oldStatusFilter;
      const sourceMatch = oldSourceFilter === 'Tümü' || String(customer.source ?? '') === oldSourceFilter;
      const segmentMatch = oldSegmentFilter === 'Tümü' || String(customer.segment ?? '') === oldSegmentFilter;
      const cityMatch = oldCityFilter === 'Tümü' || String(customer.city ?? '') === oldCityFilter;
      return searchMatch && statusMatch && sourceMatch && segmentMatch && cityMatch;
    });
  }, [oldCustomers, oldSearch, oldStatusFilter, oldSourceFilter, oldSegmentFilter, oldCityFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [pageSize, search, statusFilter]);

  useEffect(() => {
    setOldCurrentPage(1);
  }, [oldPageSize, oldSearch, oldStatusFilter, oldSourceFilter, oldSegmentFilter, oldCityFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / pageSize));
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const pagedCustomers = filteredCustomers.slice(startIndex, endIndex);
  const oldTotalPages = Math.max(1, Math.ceil(filteredOldCustomers.length / oldPageSize));
  const safeOldCurrentPage = Math.min(Math.max(oldCurrentPage, 1), oldTotalPages);
  const oldStartIndex = (safeOldCurrentPage - 1) * oldPageSize;
  const oldEndIndex = oldStartIndex + oldPageSize;
  const pagedOldCustomers = filteredOldCustomers.slice(oldStartIndex, oldEndIndex);
  const oldStartPage = Math.floor((safeOldCurrentPage - 1) / 10) * 10 + 1;
  const oldEndPage = Math.min(oldStartPage + 9, oldTotalPages);
  const visibleOldPages = Array.from({ length: oldEndPage - oldStartPage + 1 }, (_, index) => oldStartPage + index);

  useEffect(() => {
    if (currentPage !== safeCurrentPage) {
      setCurrentPage(safeCurrentPage);
    }
  }, [currentPage, safeCurrentPage]);

  useEffect(() => {
    if (oldCurrentPage !== safeOldCurrentPage) {
      setOldCurrentPage(safeOldCurrentPage);
    }
  }, [oldCurrentPage, safeOldCurrentPage]);

  async function openCustomerById(customerId: string) {
    setDetailTab('general');
    setSelectedCustomer(null);
    setDetailError('');
    setIsDetailLoading(true);

    try {
      const detail = await getCustomerById(customerId);
      setSelectedCustomer(detail);
    } catch (error) {
      setDetailError(error instanceof Error ? error.message : 'Müşteri detayı alınamadı.');
    } finally {
      setIsDetailLoading(false);
    }
  }

  async function openCustomer(customer: Customer) {
    await openCustomerById(String(customer.id));
  }

  function openCreateCustomerModal() {
    setCustomerModalMode('create');
    setEditingCustomer(null);
    setTransferCustomerOldId(null);
    setSelectedServices([]);
    setNewCustomerTab('s');
    setSaveMessage('');
    setIsCustomerModalOpen(true);
  }

  async function openTransferCustomerModal(customer: CustomerOldResponse) {
    setCustomerModalMode('transfer');
    setTransferCustomerOldId(customer.id);
    setSelectedServices([]);
    setNewCustomerTab('s');
    setSaveMessage('');

    try {
      const customerOld = await getCustomerOldById(customer.id);
      setEditingCustomer(customerOldToModalCustomer(customerOld));
      setIsCustomerModalOpen(true);
    } catch (error) {
      setOldCustomerError(error instanceof Error ? error.message : 'Eski müşteri kaydı alınamadı.');
      setTransferCustomerOldId(null);
      setCustomerModalMode('create');
    }
  }

  function openOldCustomersView() {
    setIsOldViewOpen(true);
    setSelectedCustomer(null);
    setSaveMessage('');
    setOldCurrentPage(1);
    if (oldCustomers.length === 0) {
      void loadOldCustomers();
    }
  }

  function closeOldCustomersView() {
    setIsOldViewOpen(false);
    setOldSearch('');
    setOldStatusFilter('Tümü');
    setOldSourceFilter('Tümü');
    setOldSegmentFilter('Tümü');
    setOldCityFilter('Tümü');
    setOldCurrentPage(1);
  }

  async function openEditCustomer(customerId: string) {
    setCustomerModalMode('edit');
    setEditingCustomer(null);
    setTransferCustomerOldId(null);
    setSelectedServices([]);
    setNewCustomerTab('s');
    setSaveMessage('');
    setDetailError('');

    try {
      const customer = await getCustomerById(customerId);
      setEditingCustomer(customer);
      setSelectedServices(customerServices(customer));
      setIsCustomerModalOpen(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Müşteri bilgileri düzenleme için alınamadı.';
      if (selectedCustomer) {
        setDetailError(message);
      } else {
        setCustomerError(message);
      }
    }
  }

  function closeCustomerModal() {
    setIsCustomerModalOpen(false);
    setCustomerModalMode('create');
    setEditingCustomer(null);
    setTransferCustomerOldId(null);
    setSelectedServices([]);
    setNewCustomerTab('s');
  }

  function closeCustomerDetail() {
    setSelectedCustomer(null);
    setDetailError('');
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('customerId');
    setSearchParams(nextParams, { replace: true });
  }

  function toggleService(service: string) {
    setSelectedServices((current) => (current.includes(service) ? current.filter((item) => item !== service) : [...current, service]));
  }

  async function handleCustomerSaved(customer: CustomerResponse, mode: CustomerModalMode) {
    setCustomers((current) => (mode === 'edit' ? current.map((item) => (item.id === customer.id ? mapCustomerResponseToCustomer(customer) : item)) : [mapCustomerResponseToCustomer(customer), ...current]));
    await loadCustomers();
    if (mode === 'transfer') {
      await loadOldCustomers();
      setOldCurrentPage(1);
    }
    setCurrentPage(1);
    setSelectedServices([]);
    setEditingCustomer(null);
    setTransferCustomerOldId(null);

    if (mode === 'edit' && selectedCustomer?.id === customer.id) {
      setSelectedCustomer(customer);
    }
    setSaveMessage('Müşteri başarıyla eklendi.');
    if (mode === 'edit') {
      setSaveMessage('Müşteri başarıyla güncellendi.');
    }
    if (mode === 'transfer') {
      setSaveMessage('Müşteri güncellendi ve ana müşteri listesine aktarıldı.');
    }
  }

  if (selectedCustomer || isDetailLoading || detailError) {
    return (
      <div className="relative space-y-5 md:space-y-6">
        {saveMessage ? <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-[12px] font-medium text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-300">{saveMessage}</div> : null}
        {isDetailLoading ? (
          <div className="bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-8 text-center text-[12px] font-medium text-gray-500 dark:text-gray-400">Müşteri detayı yükleniyor...</div>
        ) : detailError ? (
          <div className="bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-800 rounded-xl p-5">
            <p className="text-sm font-semibold text-rose-600 dark:text-rose-400 mb-4">{detailError}</p>
            <button onClick={closeCustomerDetail} className="px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium text-gray-700"><Icon className="w-4 h-4">{P.back}</Icon><span>Geri Dön</span></button>
          </div>
        ) : selectedCustomer ? (
          <CustomerDetail customer={selectedCustomer} detailTab={detailTab} onBack={closeCustomerDetail} onEdit={() => void openEditCustomer(String(selectedCustomer.id))} onTabChange={setDetailTab} />
        ) : null}
        {isCustomerModalOpen ? <CustomerModal customerTab={newCustomerTab} initialCustomer={editingCustomer} mode={customerModalMode} selectedServices={selectedServices} transferCustomerOldId={transferCustomerOldId} onClose={closeCustomerModal} onSaved={handleCustomerSaved} onTabChange={setNewCustomerTab} onToggleService={toggleService} /> : null}
      </div>
    );
  }

  if (isOldViewOpen) {
    return (
      <div className="relative space-y-5 md:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-violet-100 dark:bg-violet-900/40 rounded-xl flex items-center justify-center shrink-0">
              <Icon className="text-violet-600 dark:text-violet-400 w-5 h-5">{P.chk}</Icon>
            </div>
            <div>
              <h1 className="text-[19px] font-bold text-gray-900 dark:text-gray-100 leading-tight">Veri Kontrol</h1>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">Eski müşteri kayıtlarını kontrol edin ve filtreleyin</p>
            </div>
          </div>
          <button onClick={closeOldCustomersView} className="px-4 py-2 text-sm bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2 font-medium text-gray-700 dark:text-gray-300">
            <Icon className="w-4 h-4">{P.back}</Icon>
            <span>Geri Dön</span>
          </button>
        </div>

        <div className="bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-800 rounded-xl p-4">
          <div className="flex flex-col gap-3">
            <div className="relative max-w-md">
              <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400">{P.search}</Icon>
              <input value={oldSearch} onChange={(event) => setOldSearch(event.target.value)} type="text" placeholder="Firma / e-posta / telefon / müşteri no ara..." className="w-full pl-9 pr-4 py-2 text-[12px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0a0a0c] rounded-lg focus:outline-none focus:border-violet-500 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              <OldFilterSelect label="Durum" options={oldStatusOptions} value={oldStatusFilter} onChange={setOldStatusFilter} />
              <OldFilterSelect label="Kaynak" options={oldSourceOptions} value={oldSourceFilter} onChange={setOldSourceFilter} />
              <OldFilterSelect label="Segment" options={oldSegmentOptions} value={oldSegmentFilter} onChange={setOldSegmentFilter} />
              <OldFilterSelect label="Şehir" options={oldCityOptions} value={oldCityFilter} onChange={setOldCityFilter} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
          {isOldCustomersLoading ? (
            <div className="px-4 py-8 text-center text-[12px] font-medium text-gray-500 dark:text-gray-400">Eski müşteri listesi yükleniyor...</div>
          ) : oldCustomerError ? (
            <div className="px-4 py-8 text-center text-[12px] font-medium text-rose-600 dark:text-rose-400">{oldCustomerError}</div>
          ) : filteredOldCustomers.length === 0 ? (
            <div className="px-4 py-8 text-center text-[12px] font-medium text-gray-500 dark:text-gray-400">Kayıt bulunamadı.</div>
          ) : (
            <>
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50/70 dark:bg-[#0a0a0c]/50">
                      {['Müşteri No', 'Firma', 'Resmi Ünvan', 'Durum', 'Veri Kalite', 'Kaynak', 'Segment', 'Telefon', 'E-posta', 'Şehir / Ülke', 'İşlem'].map((heading, index) => (
                        <th key={heading} className={`px-3 py-2.5 ${index === 10 ? 'text-right' : 'text-left'} text-[10px] font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide`}>{heading}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">{pagedOldCustomers.map((customer) => <CustomerOldRow key={customer.id} customer={customer} onTransfer={openTransferCustomerModal} />)}</tbody>
                </table>
              </div>
              <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-800">{pagedOldCustomers.map((customer) => <CustomerOldMobileCard key={customer.id} customer={customer} onTransfer={openTransferCustomerModal} />)}</div>
            </>
          )}
          <div className="px-4 py-2.5 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-gray-50/50 dark:bg-[#0a0a0c]/30">
            <span className="text-[11px] text-gray-500 dark:text-gray-500">{filteredOldCustomers.length} kayıt içinden {pagedOldCustomers.length} kayıt gösteriliyor · Toplam {oldCustomers.length}</span>
            <div className="flex items-center gap-2 flex-wrap">
              <select value={oldPageSize} onChange={(event) => setOldPageSize(Number(event.target.value))} className="px-2.5 py-1 text-[11px] font-medium border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#17171a] rounded-md text-gray-600 dark:text-gray-400 focus:outline-none focus:border-violet-500">
                <option value={10}>10'lu göster</option>
                <option value={50}>50'li göster</option>
              </select>
              <button disabled={safeOldCurrentPage <= 1} onClick={() => setOldCurrentPage((page) => Math.max(1, page - 1))} className="px-2.5 py-1 text-[11px] font-medium border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed">← Önceki</button>
              {visibleOldPages.map((page) => (
                <button key={page} onClick={() => setOldCurrentPage(page)} className={`px-2.5 py-1 text-[11px] font-medium rounded-md ${page === safeOldCurrentPage ? 'font-bold bg-violet-600 text-white' : 'border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>{page}</button>
              ))}
              <button disabled={safeOldCurrentPage >= oldTotalPages} onClick={() => setOldCurrentPage((page) => Math.min(oldTotalPages, page + 1))} className="px-2.5 py-1 text-[11px] font-medium border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed">Sonraki →</button>
            </div>
          </div>
        </div>
        {isCustomerModalOpen ? <CustomerModal customerTab={newCustomerTab} initialCustomer={editingCustomer} mode={customerModalMode} selectedServices={selectedServices} transferCustomerOldId={transferCustomerOldId} onClose={closeCustomerModal} onSaved={handleCustomerSaved} onTabChange={setNewCustomerTab} onToggleService={toggleService} /> : null}
      </div>
    );
  }

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter((customer) => customer.tp.toLocaleLowerCase('tr-TR').includes('aktif')).length;
  const passiveCustomers = customers.filter((customer) => customer.tp.toLocaleLowerCase('tr-TR').includes('pasif')).length;
  const salesReadyCustomers = customers.filter((customer) => customer.tp.toLocaleLowerCase('tr-TR').includes('satışa uygun') || customer.dc === 'emerald').length;
  const ados360Customers = customers.filter((customer) => customer.sv.some((service) => service.toLocaleLowerCase('tr-TR').includes('ados360')) || customer.sg.toLocaleLowerCase('tr-TR').includes('ados360')).length;
  const kpis = [
    { l: 'Toplam Kayıt', v: String(totalCustomers), c: 'gray' as ColorName },
    { l: 'Aktif Müşteri', v: String(activeCustomers), c: 'emerald' as ColorName },
    { l: 'Pasif Müşteri', v: String(passiveCustomers), c: 'gray' as ColorName },
    { l: 'Satışa Uygun', v: String(salesReadyCustomers), c: 'emerald' as ColorName },
    { l: 'ADOS360', v: String(ados360Customers), c: 'violet' as ColorName },
  ];

  return (
    <div className="relative space-y-5 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-violet-100 dark:bg-violet-900/40 rounded-xl flex items-center justify-center shrink-0">
            <Icon className="text-violet-600 dark:text-violet-400 w-5 h-5">{P.db}</Icon>
          </div>
          <div>
            <h1 className="text-[19px] font-bold text-gray-900 dark:text-gray-100 leading-tight">Müşteri Data Kontrol</h1>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">Veri kalitesi, doğrulama ve satışa aktarım öncesi hazırlık</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button type="button" onClick={openOldCustomersView} className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-[12px] font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <Icon>{P.chk}</Icon> Eski Müşteri
          </button>
          <button onClick={openCreateCustomerModal} className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white text-[12px] font-semibold rounded-lg transition-colors">
            <Icon>{P.plus}</Icon> Yeni Müşteri Ekle
          </button>
        </div>
      </div>

      {saveMessage ? <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-[12px] font-medium text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-300">{saveMessage}</div> : null}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">{kpis.map((kpi) => <KpiCard key={kpi.l} {...kpi} />)}</div>

      <div className="bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-800 rounded-xl p-4">
        <div className="flex flex-col gap-3">
          <div className="relative max-w-md">
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400">{P.search}</Icon>
            <input value={search} onChange={(event) => setSearch(event.target.value)} type="text" placeholder="Firma / yetkili / e-posta / müşteri no ara..." className="w-full pl-9 pr-4 py-2 text-[12px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0a0a0c] rounded-lg focus:outline-none focus:border-violet-500 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600" />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide shrink-0">Müşteri Durumu:</span>
            <div className="flex flex-wrap gap-1.5">
              {STATUS_FILTERS.map((filter) => (
                <button key={filter} onClick={() => setStatusFilter(filter)} className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all ${filter === statusFilter ? 'bg-violet-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
                  {filter}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">{['Hizmet', 'Veri Kalitesi', 'Segment', 'E-Bülten Durumu', 'Son Güncelleme'].map((filter) => <FilterButton key={filter}>{filter}</FilterButton>)}</div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
        {isCustomersLoading ? (
          <div className="px-4 py-8 text-center text-[12px] font-medium text-gray-500 dark:text-gray-400">Müşteri listesi yükleniyor...</div>
        ) : customerError ? (
          <div className="px-4 py-8 text-center text-[12px] font-medium text-rose-600 dark:text-rose-400">{customerError}</div>
        ) : filteredCustomers.length === 0 ? (
          <div className="px-4 py-8 text-center text-[12px] font-medium text-gray-500 dark:text-gray-400">Kayıt bulunamadı.</div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50/70 dark:bg-[#0a0a0c]/50">
                    {['Firma', 'Durum', 'Hizmetler', 'Eksik Alan', 'Segment', 'Ekleme Tarihi', 'İşlem'].map((heading, index) => (
                      <th key={heading} className={`px-3 py-2.5 ${index === 6 ? 'text-right' : 'text-left'} text-[10px] font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide`}>
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">{pagedCustomers.map((customer) => <CustomerRow key={customer.id} customer={customer} onEdit={(item) => void openEditCustomer(String(item.id))} onOpen={openCustomer} />)}</tbody>
              </table>
            </div>
            <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-800">{pagedCustomers.map((customer) => <CustomerMobileCard key={customer.id} customer={customer} onEdit={(item) => void openEditCustomer(String(item.id))} onOpen={openCustomer} />)}</div>
          </>
        )}
        <div className="px-4 py-2.5 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-gray-50/50 dark:bg-[#0a0a0c]/30">
          <span className="text-[11px] text-gray-500 dark:text-gray-500">{filteredCustomers.length} kayıt içinden {pagedCustomers.length} kayıt gösteriliyor · Toplam {customers.length}</span>
          <div className="flex items-center gap-2 flex-wrap">
            <select value={pageSize} onChange={(event) => setPageSize(Number(event.target.value))} className="px-2.5 py-1 text-[11px] font-medium border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#17171a] rounded-md text-gray-600 dark:text-gray-400 focus:outline-none focus:border-violet-500">
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

      {isCustomerModalOpen ? <CustomerModal customerTab={newCustomerTab} initialCustomer={editingCustomer} mode={customerModalMode} selectedServices={selectedServices} transferCustomerOldId={transferCustomerOldId} onClose={closeCustomerModal} onSaved={handleCustomerSaved} onTabChange={setNewCustomerTab} onToggleService={toggleService} /> : null}
    </div>
  );
}

function KpiCard({ l, v, c }: { l: string; v: string; c: ColorName }) {
  const tone = CM[c] || CM.gray;
  return (
    <div className="bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2.5 hover:shadow-sm dark:hover:border-gray-700 transition-all">
      <p className={`text-[19px] font-bold ${tone.t} leading-none mb-0.5`}>{v}</p>
      <p className="text-[10px] text-gray-500 dark:text-gray-400">{l}</p>
    </div>
  );
}

function FilterButton({ children }: { children: ReactNode }) {
  return (
    <button className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors">
      <Icon className="w-3 h-3">{P.filter}</Icon>
      {children}
      <Icon className="w-3 h-3">{P.chevron}</Icon>
    </button>
  );
}

function OldFilterSelect({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (value: string) => void }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="px-3 py-2 text-[12px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0a0a0c] rounded-lg focus:outline-none focus:border-violet-500 text-gray-700 dark:text-gray-300">
        <option value="Tümü">Tümü</option>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

function Services({ services, limit = 2 }: { services: string[]; limit?: number }) {
  return (
    <div className="flex flex-wrap gap-1">
      {services.slice(0, limit).map((service) => <Bdg key={service} color="indigo">{service}</Bdg>)}
      {services.length > limit ? <span className="text-[10px] text-gray-400 dark:text-gray-600 self-center">+{services.length - limit}</span> : null}
    </div>
  );
}

function CustomerRow({ customer, onEdit, onOpen }: { customer: Customer; onEdit: (customer: Customer) => void; onOpen: (customer: Customer) => void }) {
  return (
    <tr className="gr border-b border-gray-100 dark:border-gray-800 group">
      <td className="px-3 py-3">
        <button onClick={() => onOpen(customer)} className="text-[12px] font-semibold text-gray-900 dark:text-gray-100 hover:text-violet-600 dark:hover:text-violet-400 text-left block transition-colors leading-tight">{customer.co}</button>
        <div className="text-[10px] text-gray-400 dark:text-gray-600 font-mono mt-0.5">{customer.no}</div>
      </td>
      <td className="px-3 py-3"><Bdg color={customer.tc}>{customer.tp}</Bdg></td>
      <td className="px-3 py-3"><Services services={customer.sv} /></td>
      <td className="px-3 py-3"><div className="flex items-center gap-1 text-[10px] text-amber-700 dark:text-amber-400"><Icon className="w-3 h-3">{P.alert}</Icon><span>{customer.mx}</span></div></td>
      <td className="px-3 py-3">{customer.sg !== '—' ? <Bdg color={customer.sc}>{customer.sg}</Bdg> : <span className="text-[10px] text-gray-400 dark:text-gray-600">—</span>}</td>
      <td className="px-3 py-3"><div className="flex items-center gap-1 text-[10px] text-gray-400 dark:text-gray-600"><Icon className="w-3 h-3">{P.clock}</Icon> {customer.up}</div></td>
      <td className="px-3 py-3">
        <div className="flex items-center justify-end gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onOpen(customer)} title="Görüntüle" className="p-1.5 rounded-md text-violet-500 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors"><Icon>{P.eye}</Icon></button>
          <IconButton title="Düzenle" onClick={() => onEdit(customer)}>{P.edit}</IconButton>
        </div>
      </td>
    </tr>
  );
}

function IconButton({ title, className = '', onClick, children }: { title: string; className?: string; onClick?: () => void; children: ReactNode }) {
  return <button type="button" title={title} onClick={onClick} className={`p-1.5 rounded-md text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors ${className}`}><Icon>{children}</Icon></button>;
}

function CustomerMobileCard({ customer, onEdit, onOpen }: { customer: Customer; onEdit: (customer: Customer) => void; onOpen: (customer: Customer) => void }) {
  return (
    <div className="p-4">
      <button onClick={() => onOpen(customer)} className="text-[13px] font-bold text-gray-900 dark:text-gray-100 hover:text-violet-600 dark:hover:text-violet-400 text-left">{customer.co}</button>
      <div className="text-[10px] text-gray-400 dark:text-gray-600 font-mono mt-0.5">{customer.no}</div>
      <div className="flex flex-wrap gap-1.5 mt-2"><Bdg color={customer.tc}>{customer.tp}</Bdg>{customer.sg !== '—' ? <Bdg color={customer.sc}>{customer.sg}</Bdg> : null}</div>
      <div className="flex items-center gap-1 text-[10px] text-amber-700 dark:text-amber-400 mt-2"><Icon className="w-3 h-3">{P.alert}</Icon><span>{customer.mx}</span></div>
      <div className="mt-2"><Services services={customer.sv} limit={3} /></div>
      <div className="flex items-center justify-between mt-3">
        <span className="text-[11px] text-gray-500 dark:text-gray-500">{customer.up}</span>
        <div className="flex items-center gap-1.5">
          <button onClick={() => onEdit(customer)} className="px-2.5 py-1 text-[11px] font-semibold text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-md">Düzenle</button>
          <button onClick={() => onOpen(customer)} className="px-2.5 py-1 text-[11px] font-semibold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20 rounded-md">Detay</button>
        </div>
      </div>
    </div>
  );
}

function CustomerOldRow({ customer, onTransfer }: { customer: CustomerOldResponse; onTransfer: (customer: CustomerOldResponse) => void }) {
  const status = display(customer.customerStatus);
  const quality = display(customer.dataQualityStatus, 'Kontrol Gerekli');

  return (
    <tr className="gr border-b border-gray-100 dark:border-gray-800">
      <td className="px-3 py-3 text-[10px] text-gray-400 dark:text-gray-600 font-mono">{display(customer.customerCode)}</td>
      <td className="px-3 py-3 text-[12px] font-semibold text-gray-900 dark:text-gray-100">{display(customer.brandName)}</td>
      <td className="px-3 py-3 text-[11px] text-gray-600 dark:text-gray-400">{display(customer.officialTitle)}</td>
      <td className="px-3 py-3"><Bdg color={customerColor(status)}>{status}</Bdg></td>
      <td className="px-3 py-3"><Bdg color={qualityColor(quality)}>{quality}</Bdg></td>
      <td className="px-3 py-3 text-[11px] text-gray-600 dark:text-gray-400">{display(customer.source)}</td>
      <td className="px-3 py-3 text-[11px] text-gray-600 dark:text-gray-400">{display(customer.segment)}</td>
      <td className="px-3 py-3 text-[11px] text-gray-600 dark:text-gray-400">{display(customer.companyPhone)}</td>
      <td className="px-3 py-3 text-[11px] text-gray-600 dark:text-gray-400">{display(customer.companyEmail)}</td>
      <td className="px-3 py-3 text-[11px] text-gray-600 dark:text-gray-400">{display(`${display(customer.city)} / ${display(customer.country)}`)}</td>
      <td className="px-3 py-3">
        <div className="flex items-center justify-end">
          <button onClick={() => onTransfer(customer)} className="px-2.5 py-1 text-[11px] font-semibold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20 rounded-md hover:bg-violet-100 dark:hover:bg-violet-900/30 transition-colors">Güncelle</button>
        </div>
      </td>
    </tr>
  );
}

function CustomerOldMobileCard({ customer, onTransfer }: { customer: CustomerOldResponse; onTransfer: (customer: CustomerOldResponse) => void }) {
  const status = display(customer.customerStatus);
  const quality = display(customer.dataQualityStatus, 'Kontrol Gerekli');

  return (
    <div className="p-4">
      <div className="text-[13px] font-bold text-gray-900 dark:text-gray-100">{display(customer.brandName)}</div>
      <div className="text-[10px] text-gray-400 dark:text-gray-600 font-mono mt-0.5">{display(customer.customerCode)}</div>
      <div className="flex flex-wrap gap-1.5 mt-2"><Bdg color={customerColor(status)}>{status}</Bdg><Bdg color={qualityColor(quality)}>{quality}</Bdg></div>
      <div className="grid grid-cols-1 gap-1 mt-3 text-[11px] text-gray-600 dark:text-gray-400">
        <span>{display(customer.officialTitle)}</span>
        <span>{display(customer.source)} · {display(customer.segment)}</span>
        <span>{display(customer.companyPhone)} · {display(customer.companyEmail)}</span>
        <span>{display(customer.city)} / {display(customer.country)}</span>
      </div>
      <div className="flex items-center justify-end mt-3">
        <button onClick={() => onTransfer(customer)} className="px-2.5 py-1 text-[11px] font-semibold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20 rounded-md hover:bg-violet-100 dark:hover:bg-violet-900/30 transition-colors">Güncelle</button>
      </div>
    </div>
  );
}

function CustomerDetail({ customer, detailTab, onBack, onEdit, onTabChange }: { customer: CustomerResponse; detailTab: CustomerTab; onBack: () => void; onEdit: () => void; onTabChange: (tab: CustomerTab) => void }) {
  const [contactSearchQuery, setContactSearchQuery] = useState('');
  const [contactTitleFilter, setContactTitleFilter] = useState('Tümü');
  const services = Array.isArray(customer.services) ? customer.services : [];
  const contactCards = customerContacts(customer);
  const contactTitleOptions = Array.from(new Set(contactCards.map((contact) => contact.title).filter((title) => title !== '—')));
  const normalizedContactSearch = contactSearchQuery.trim().toLocaleLowerCase('tr-TR');
  const filteredContactCards = contactCards.filter((contact) => {
    const matchesTitle = contactTitleFilter === 'Tümü' || contact.title === contactTitleFilter;
    const searchableValues = [contact.fullName, contact.title, contact.phone, contact.email].join(' ').toLocaleLowerCase('tr-TR');
    return matchesTitle && (normalizedContactSearch.length === 0 || searchableValues.includes(normalizedContactSearch));
  });
  const financeFields = [
    { label: 'Resmi Ünvan', value: customerText(customer, 'officialTitle') },
    { label: 'Vergi No', value: customerText(customer, 'taxNumber') },
    { label: 'Vergi Dairesi', value: customerText(customer, 'taxOffice') },
    { label: 'IBAN', value: customerText(customer, 'iban') },
    { label: 'Fatura E-posta', value: customerText(customer, 'invoiceEmail') },
    { label: 'Finans Yetkilisi', value: customerText(customer, 'financeContactPerson') },
    { label: 'Son Ödeme Bilgisi', value: customerText(customer, 'lastPaymentInfo') },
    { label: 'Tahsilat Notu', value: customerText(customer, 'collectionNote') },
  ];
  const technicalFields = [
    { label: 'Web Sitesi', value: customerText(customer, 'website') },
    { label: 'Son Fiyat Güncelleme', value: customerDate(customer, 'lastPriceUpdateAt') },
    { label: 'Son Güncelleme', value: customerDate(customer, 'lastUpdatedAt') },
    { label: 'Oluşturma Tarihi', value: customerDate(customer, 'createdAt') },
  ];
  const digitalFields = [
    { label: 'Instagram', value: customerText(customer, 'instagramUrl') },
    { label: 'LinkedIn', value: customerText(customer, 'linkedinUrl') },
    { label: 'Facebook', value: customerText(customer, 'facebookUrl') },
    { label: 'E-Bülten İzni', value: customerText(customer, 'newsletterPermission') },
    { label: 'Pazarlama Segment Detay Notu', value: customerText(customer, 'marketingSegmentDetailNote') },
    { label: 'Satışa Yönlendirme Notu', value: customerText(customer, 'salesHandoverNote') },
  ];
  const notesAndLogs = [
    customerText(customer, 'notes'),
    customerText(customer, 'summaryNote'),
    customerText(customer, 'marketingSegmentNote'),
    customerText(customer, 'salesHandoverNote'),
  ].filter((entry) => entry !== '—');
  const customerStatus = customerText(customer, 'customerStatus');
  const dataQualityStatus = customerText(customer, 'dataQualityStatus');
  const customerStatusColor = customerColor(customerStatus);
  const dataQualityColor = qualityColor(dataQualityStatus);

  return (
    <div className="customer-detail-modal">
      <div className="customer-detail-modal__panel">
        <div className="flex items-center gap-2 text-sm mb-4">
          <span className="text-gray-500">ADOS Panel</span><span className="text-gray-400">/</span><span className="text-gray-500">Pazarlama Panosu</span><span className="text-gray-400">/</span><span className="text-gray-500">Müşteri Data Kontrol</span><span className="text-gray-400">/</span><span className="text-gray-900 font-medium">Müşteri Detayı</span>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 lg:p-6 mb-4 lg:mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center shrink-0"><Icon className="w-6 h-6 text-purple-600">{P.user}</Icon></div>
              <div><h2 className="text-xl font-bold text-gray-900">Müşteri Kartı</h2><p className="text-sm text-gray-600 mt-0.5">{customerText(customer, 'brandName')}</p></div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button onClick={onEdit} className="px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium text-gray-700"><Icon className="w-4 h-4">{P.edit}</Icon><span>Düzenle</span></button>
              <button className="px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium text-gray-700"><Icon className="w-4 h-4">{P.file}</Icon><span>Not Ekle</span></button>
              <button onClick={onBack} className="px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium text-gray-700"><Icon className="w-4 h-4">{P.back}</Icon><span>Geri Dön</span></button>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 lg:p-6 mb-4 lg:mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <DetailValue label="Müşteri Numarası" value={customerText(customer, 'customerCode')} strong />
            <div><p className="text-xs text-gray-500 mb-1">Müşteri Durumu</p><Bdg color={customerStatusColor}>{customerStatus}</Bdg></div>
            <DetailValue label="Segment" value={customerText(customer, 'segment')} />
            <DetailValue label="Kaynak" value={customerText(customer, 'source')} strong />
            <div><p className="text-xs text-gray-500 mb-1">Aldığı Hizmetler</p><Services services={services} /></div>
            <div><p className="text-xs text-gray-500 mb-1">Veri Kalite Durumu</p><Bdg color={dataQualityColor}>{dataQualityStatus}</Bdg></div>
            <DetailValue label="Son Güncelleme" value={formatCustomerDate(customer.lastUpdatedAt ?? customer.updatedAt)} />
            <DetailValue label="Ekleme Tarihi" value={customerDate(customer, 'createdAt')} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl mb-4 lg:mb-6">
          <div className="border-b border-gray-200 overflow-x-auto">
            <div className="flex">
              {DETAIL_TABS.map((tabItem) => (
                <button key={tabItem.id} onClick={() => onTabChange(tabItem.id)} className={`px-5 py-3.5 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 ${detailTab === tabItem.id ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}>{tabItem.label}</button>
              ))}
            </div>
          </div>
          <div className="p-5 lg:p-8">
            <DetailTabContent
              contactCards={contactCards}
              contactSearchQuery={contactSearchQuery}
              contactTitleFilter={contactTitleFilter}
              contactTitleOptions={contactTitleOptions}
              customer={customer}
              digitalFields={digitalFields}
              financeFields={financeFields}
              filteredContactCards={filteredContactCards}
              notesAndLogs={notesAndLogs}
              setContactSearchQuery={setContactSearchQuery}
              setContactTitleFilter={setContactTitleFilter}
              tab={detailTab}
              technicalFields={technicalFields}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailValue({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return <div><p className="text-xs text-gray-500 mb-1">{label}</p><p className={`${strong ? 'font-semibold text-gray-900' : 'text-sm text-gray-700'}`}>{display(value)}</p></div>;
}

function DetailTabContent({
  contactCards,
  contactSearchQuery,
  contactTitleFilter,
  contactTitleOptions,
  customer,
  digitalFields,
  financeFields,
  filteredContactCards,
  notesAndLogs,
  setContactSearchQuery,
  setContactTitleFilter,
  tab,
  technicalFields,
}: {
  contactCards: DetailContact[];
  contactSearchQuery: string;
  contactTitleFilter: string;
  contactTitleOptions: string[];
  customer: CustomerResponse;
  digitalFields: Array<{ label: string; value: ReactNode }>;
  financeFields: Array<{ label: string; value: ReactNode }>;
  filteredContactCards: DetailContact[];
  notesAndLogs: string[];
  setContactSearchQuery: (value: string) => void;
  setContactTitleFilter: (value: string) => void;
  tab: CustomerTab;
  technicalFields: Array<{ label: string; value: ReactNode }>;
}) {
  const services = Array.isArray(customer.services) ? customer.services : [];

  if (tab === 'contacts') {
    return contactCards.length > 0 ? (
      <div className="space-y-4">
        <div className="border border-gray-200 rounded-xl bg-white p-4">
          <div className="relative">
            <Icon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2">{P.search}</Icon>
            <input type="text" value={contactSearchQuery} onChange={(event) => setContactSearchQuery(event.target.value)} placeholder="Yetkili adı, ünvan, telefon veya e-posta ile ara" className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none" />
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {['Tümü', ...contactTitleOptions].map((titleOption) => {
              const isActive = contactTitleFilter === titleOption;
              return <button key={titleOption} type="button" onClick={() => setContactTitleFilter(titleOption)} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${isActive ? 'bg-purple-600 border-purple-600 text-white' : 'bg-white border-gray-200 text-gray-700 hover:border-purple-300 hover:text-purple-700'}`}>{titleOption}</button>;
            })}
          </div>
        </div>
        {filteredContactCards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredContactCards.map((contact, index) => (
              <div key={`${contact.key}-${index}`} className="border border-gray-200 rounded-lg p-5 bg-gray-50/60">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>{contact.fullName !== '—' ? <p className="text-sm font-semibold text-gray-900">{contact.fullName}</p> : null}{contact.title !== '—' ? <p className="text-xs text-gray-500 mt-1">{contact.title}</p> : null}</div>
                  <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700">{contact.title !== '—' ? contact.title : `Yetkili ${contact.contactNumber}`}</span>
                </div>
                <div className="space-y-3">{contact.phone !== '—' ? <InfoLine label="Telefon" value={contact.phone} /> : null}{contact.email !== '—' ? <InfoLine label="E-posta" value={contact.email} /> : null}</div>
              </div>
            ))}
          </div>
        ) : <EmptyBox title="Filtreye uygun yetkili bulunamadı" text="Arama metnini veya seçili ünvan filtresini değiştirerek tekrar deneyebilirsin." />}
      </div>
    ) : <EmptyBox title="Yetkili verisi bulunmuyor" text="Bu müşteri için veritabanından gelen yetkili bilgisi yok." />;
  }

  if (tab === 'services') {
    return services.length > 0 ? (
      <div className="space-y-4">
        {services.map((service) => (
          <div key={service} className="border border-gray-200 rounded-lg p-5">
            <div className="flex items-center justify-between gap-3 mb-3"><h4 className="font-semibold text-gray-900">{service}</h4><span className="inline-flex px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700">{customerText(customer, 'dataQualityStatus')}</span></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><InfoLine label="Son Güncelleme" value={formatCustomerDate(customer.lastUpdatedAt ?? customer.updatedAt)} /><InfoLine label="Ekleme Tarihi" value={customerDate(customer, 'createdAt')} /></div>
          </div>
        ))}
      </div>
    ) : <EmptyBox title="Hizmet verisi bulunmuyor" text="Bu müşteri için veritabanından gelen hizmet kaydı yok." />;
  }

  if (tab === 'finance') return <FieldGrid fields={financeFields} />;
  if (tab === 'technical') return <FieldGrid fields={technicalFields} />;
  if (tab === 'digital') return <FieldGrid fields={digitalFields} />;
  if (tab === 'notes') {
    return (
      <div className="space-y-4">
        <NoteBox label="Genel Not" value={customerText(customer, 'notes')} />
        <NoteBox label="Pazarlama Notu" value={customerText(customer, 'marketingSegmentNote')} />
        {notesAndLogs.map((entry, index) => (
          <div key={entry} className="border border-gray-200 rounded-lg p-4 bg-gray-50/60">
            <div className="flex items-center gap-2 mb-2"><Icon className="w-4 h-4 text-gray-500">{P.clock}</Icon><span className="text-xs font-medium text-gray-500">Kayıt {index + 1}</span></div>
            <p className="text-sm text-gray-700 whitespace-pre-line">{entry}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <InfoLine label="Marka / Firma Adı" value={customerText(customer, 'brandName')} strong />
          <InfoLine label="Resmi Ünvan" value={customerText(customer, 'officialTitle')} />
          <InfoLine label="Müşteri Numarası" value={customerText(customer, 'customerCode')} mono />
          <div><label className="block text-xs font-medium text-gray-500 mb-1">Müşteri Türü</label><Bdg color={customerColor(customerText(customer, 'customerStatus'))}>{customerText(customer, 'customerStatus')}</Bdg></div>
          <InfoLine label="Veri Kalite Durumu" value={customerText(customer, 'dataQualityStatus')} />
          <InfoLine label="Kaynak" value={customerText(customer, 'source')} />
          <InfoLine label="Segment" value={customerText(customer, 'segment')} />
        </div>
        <div className="space-y-4">
          <InfoLine label="Şirket Telefonu" value={customerText(customer, 'companyPhone')} />
          <InfoLine label="Şirket WhatsApp" value={customerText(customer, 'companyWhatsapp')} />
          <InfoLine label="Şirket E-posta" value={customerText(customer, 'companyEmail')} />
          <InfoLine label="Web Sitesi" value={customerText(customer, 'website')} link />
          <InfoLine label="Şehir / Ülke" value={`${customerText(customer, 'city')} / ${customerText(customer, 'country')}`} />
          <InfoLine label="E-Bülten İzni" value={customerText(customer, 'newsletterPermission')} />
        </div>
      </div>
      <InfoLine label="Şirket Adresi" value={customerText(customer, 'address')} />
      <InfoLine label="Pazarlama Segment Notu" value={customerText(customer, 'marketingSegmentNote')} />
      <InfoLine label="Genel Açıklama / Müşteri Özeti" value={customerText(customer, 'summaryNote')} />
    </div>
  );
}

function FieldGrid({ fields }: { fields: Array<{ label: string; value: ReactNode }> }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {fields.map((field) => (
        <div key={field.label} className="border border-gray-200 rounded-lg p-4 bg-gray-50/50"><label className="block text-xs font-medium text-gray-500 mb-1">{field.label}</label><p className="text-sm text-gray-900 break-all">{display(field.value)}</p></div>
      ))}
    </div>
  );
}

function InfoLine({ label, value, strong = false, mono = false, link = false }: { label: string; value: string; strong?: boolean; mono?: boolean; link?: boolean }) {
  return <div><label className="block text-xs font-medium text-gray-500 mb-1">{label}</label><p className={`${strong ? 'font-medium text-gray-900' : link ? 'text-blue-600 break-all' : 'text-gray-700'} ${mono ? 'font-mono text-gray-900' : ''} text-sm whitespace-pre-line`}>{display(value)}</p></div>;
}

function NoteBox({ label, value }: { label: string; value: string }) {
  return <div className="border border-gray-200 rounded-lg p-4"><label className="block text-xs font-medium text-gray-500 mb-1">{label}</label><p className="text-sm text-gray-700 whitespace-pre-line">{value}</p></div>;
}

function EmptyBox({ title, text }: { title: string; text: string }) {
  return <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6"><p className="text-sm font-medium text-gray-900 mb-1">{title}</p><p className="text-sm text-gray-600">{text}</p></div>;
}

function CustomerModal({ customerTab, initialCustomer, mode, selectedServices, transferCustomerOldId, onClose, onSaved, onTabChange, onToggleService }: { customerTab: NewCustomerTab; initialCustomer: CustomerResponse | null; mode: CustomerModalMode; selectedServices: string[]; transferCustomerOldId: number | null; onClose: () => void; onSaved: (customer: CustomerResponse, mode: CustomerModalMode) => void | Promise<void>; onTabChange: (tab: NewCustomerTab) => void; onToggleService: (service: string) => void }) {
  const isEditMode = mode === 'edit';
  const isTransferMode = mode === 'transfer';
  const [form, setForm] = useState<CustomerModalForm>(() => (initialCustomer ? createCustomerModalFormFromCustomer(initialCustomer) : createCustomerModalForm()));
  const [contactIndexes, setContactIndexes] = useState(() => (initialCustomer ? customerContactIndexes(initialCustomer) : [1, 2]));
  const [saveError, setSaveError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setForm(initialCustomer ? createCustomerModalFormFromCustomer(initialCustomer) : createCustomerModalForm());
    setContactIndexes(initialCustomer ? customerContactIndexes(initialCustomer) : [1, 2]);
    setSaveError('');
  }, [initialCustomer, mode]);

  function setField(field: string, value: string) {
    setForm((current) => ({ ...current, [field]: normalizeCustomerFormField(field, value) }));
  }

  function addContact() {
    setContactIndexes((current) => {
      if (current.length >= MAX_CONTACTS) return current;
      const nextIndex = Array.from({ length: MAX_CONTACTS }, (_, index) => index + 1).find((index) => !current.includes(index));
      return nextIndex ? [...current, nextIndex] : current;
    });
  }

  function removeContact(contactIndex: number) {
    setContactIndexes((current) => {
      if (current.length <= 1) return current;
      return current.filter((index) => index !== contactIndex);
    });

    setForm((current) => ({
      ...current,
      [`contact${contactIndex}FullName`]: '',
      [`contact${contactIndex}Phone`]: '',
      [`contact${contactIndex}Email`]: '',
      [`contact${contactIndex}Title`]: '',
    }));
  }

  async function handleSubmit() {
    if (customerTab !== 's' || isSaving) return;

    setSaveError('');
    setIsSaving(true);

    try {
      const validation = validateCustomerForm(form);
      if (!validation.isValid) {
        setForm(validation.values);
        setSaveError(validation.errors.join(' '));
        return;
      }

      const payload = buildCreateCustomerPayload(validation.values, selectedServices);
      let savedCustomer: CustomerResponse;

      if (isTransferMode) {
        if (!transferCustomerOldId) {
          throw new Error('Aktarılacak eski müşteri kaydı bulunamadı.');
        }

        savedCustomer = await transferCustomerOldToCustomers(transferCustomerOldId, payload);
      } else if (isEditMode && initialCustomer?.id) {
        savedCustomer = await updateCustomer(initialCustomer.id, payload);
      } else {
        savedCustomer = await createCustomer(payload);
      }
      await onSaved(savedCustomer, mode);
      onClose();
    } catch (error) {
      console.error(isTransferMode ? 'Customer old transfer failed' : isEditMode ? 'Customer update failed' : 'Customer create failed', {
        customerId: initialCustomer?.id,
        customerOldId: transferCustomerOldId,
        error,
      });
      setSaveError(error instanceof Error ? error.message : isEditMode ? 'Müşteri kaydı güncellenemedi.' : 'Müşteri kaydı oluşturulamadı.');
    } finally {
      setIsSaving(false);
    }
  }

  const modalTitle = isEditMode ? 'Müşteri Düzenle' : 'Yeni Müşteri Ekle';
  const modalDescription = isEditMode ? 'Müşteri kaydını mevcut popup üzerinden güncelleyin.' : 'Yeni müşteri kaydını popup üzerinden oluşturun.';
  const submitText = isSaving ? (isEditMode ? 'Güncelleniyor...' : 'Kaydediliyor...') : isEditMode ? 'Güncelle' : 'Müşteri Ekle';

  const visibleModalTitle = isTransferMode ? 'Eski Müşteriyi Güncelle' : modalTitle;
  const visibleModalDescription = isTransferMode ? 'Eski müşteri kaydını güncelleyip ana müşteri listesine aktarın.' : modalDescription;
  const visibleModalHeroText = isTransferMode ? 'Eski müşteri kaydını kontrol edin, eksik alanları tamamlayın ve ana müşteri listesine aktarın.' : isEditMode ? 'Pazarlama kullanımı için müşteri kaydını güncelleyin, çekirdek bilgileri ve veri kontrol sürecini güncel tutun.' : 'Pazarlama kullanımı için müşteri kaydı oluşturun, çekirdek bilgileri tamamlayın ve veri kontrol sürecine hazırlayın.';
  const visibleSubmitText = isTransferMode ? (isSaving ? 'Aktarılıyor...' : 'Güncelle ve Aktar') : submitText;

  const modalContent = (
    <div className="customer-add-modal fixed inset-0 z-[9999] flex items-start justify-center bg-black/35">
      <div className="customer-add-modal__panel bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <div><h2 className="text-lg font-bold text-gray-900">{visibleModalTitle}</h2><p className="text-sm text-gray-500 mt-0.5">{visibleModalDescription}</p></div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors"><Icon className="w-5 h-5 text-gray-500">{P.x}</Icon></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          <div className="flex items-center gap-2 text-sm mb-4"><span className="text-gray-500">ADOS Panel</span><span className="text-gray-400">/</span><span className="text-gray-500">Pazarlama Panosu</span><span className="text-gray-400">/</span><span className="text-gray-500">Müşteri Data Kontrol</span><span className="text-gray-400">/</span><span className="text-gray-900 font-semibold">{modalTitle}</span></div>
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200 p-5 lg:p-6 mb-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex-1"><h1 className="text-2xl font-bold text-gray-900 mb-2">{modalTitle}</h1><p className="text-sm text-gray-600">{isEditMode ? 'Pazarlama kullanımı için müşteri kaydını güncelleyin, çekirdek bilgileri ve veri kontrol sürecini güncel tutun.' : 'Pazarlama kullanımı için müşteri kaydı oluşturun, çekirdek bilgileri tamamlayın ve veri kontrol sürecine hazırlayın.'}</p></div>
              <div className="flex flex-wrap items-center gap-3">
                <button onClick={onClose} className="px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2"><Icon className="w-4 h-4">{P.back}</Icon><span>Geri Dön</span></button>
                <button className="px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors">Taslak Kaydet</button>
                <button onClick={handleSubmit} disabled={isSaving || customerTab !== 's'} className="px-5 py-2.5 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors shadow-sm flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"><Icon className="w-4 h-4">{P.send}</Icon><span>{visibleSubmitText}</span></button>
              </div>
            </div>
          </div>
          {saveError ? <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700">{saveError}</div> : null}
          <div className="bg-white border border-gray-200 rounded-xl mb-6">
            <div className="border-b border-gray-200"><div className="flex"><TabButton active={customerTab === 's'} onClick={() => onTabChange('s')}>Tekil Müşteri Ekle</TabButton><TabButton active={customerTab === 'b'} onClick={() => onTabChange('b')}>Excel ile Toplu Yükle</TabButton></div></div>
            <div className="p-6 lg:p-8">{customerTab === 's' ? <ReferenceCustomerSingleForm contactIndexes={contactIndexes} form={form} onAddContact={addContact} onRemoveContact={removeContact} setField={setField} selectedServices={selectedServices} onToggleService={onToggleService} /> : <ReferenceCustomerBulkForm />}</div>
          </div>
        </div>
      </div>
    </div>
  );

  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(<div className="pazarlama-panosu">{modalContent}</div>, document.body);
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return <button onClick={onClick} className={`px-5 py-3.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${active ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}>{children}</button>;
}

function ReferenceCustomerSingleForm({ contactIndexes, form, onAddContact, onRemoveContact, setField, selectedServices, onToggleService }: { contactIndexes: number[]; form: CustomerModalForm; onAddContact: () => void; onRemoveContact: (contactIndex: number) => void; setField: (field: string, value: string) => void; selectedServices: string[]; onToggleService: (service: string) => void }) {
  return (
    <div className="space-y-8">
      <FormSection icon={P.db} title="Çekirdek Müşteri Bilgileri">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <ReferenceInput label="Marka / Firma Adı" required value={form.brandName} onChange={(value) => setField('brandName', value)} placeholder="Örn: Teknosoft A.Ş." />
          <ReferenceInput label="Resmi Ünvan" value={form.officialTitle} onChange={(value) => setField('officialTitle', value)} placeholder="Örn: Teknosoft Bilişim Teknolojileri A.Ş." />
          <ReferenceInput label="Müşteri Numarası" value={form.customerCode || 'Kaydettiğinde otomatik üretilecek'} onChange={() => undefined} disabled />
          <ReferenceSelect label="Müşteri Türü" required value={form.customerStatus} onChange={(value) => setField('customerStatus', value)} options={['', 'Aktif', 'Pasif']} />
          <ReferenceSelect label="Kaynak" required value={form.source} onChange={(value) => setField('source', value)} options={['', 'Web Sitesi', 'Google Ads', 'Meta Reklam', 'Referans', 'Telefon', 'Organik', 'E-Bülten']} />
          <ReferenceSelect label="Segment" value={form.segment} onChange={(value) => setField('segment', value)} options={['', 'KOBİ', 'Kurumsal', 'E-Ticaret', 'Sağlık', 'Eğitim', 'Teknik Hizmet', 'Dijital Reklam', 'Diğer']} />
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2.5">Aldığı Hizmetler <span className="text-red-500">*</span></label>
            <div className="flex flex-wrap gap-2">
              {SERVICE_OPTIONS.map((service) => (
                <button key={service} type="button" onClick={() => onToggleService(service)} className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${selectedServices.includes(service) ? 'bg-purple-600 text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{service}</button>
              ))}
            </div>
          </div>
        </div>
      </FormSection>
      <FormSection icon={P.user} title="Genel İletişim Bilgileri"><div className="grid grid-cols-1 md:grid-cols-2 gap-5"><ReferenceInput label="Şirket Telefonu" type="tel" value={form.companyPhone} onChange={(value) => setField('companyPhone', value)} placeholder="0555 555 55 55" /><ReferenceInput label="Şirket WhatsApp" type="tel" value={form.companyWhatsapp} onChange={(value) => setField('companyWhatsapp', value)} placeholder="0555 555 55 55" /><ReferenceInput label="Şirket E-posta" type="email" value={form.companyEmail} onChange={(value) => setField('companyEmail', value)} placeholder="info@firma.com" /><ReferenceInput label="Web Sitesi" type="url" value={form.website} onChange={(value) => setField('website', value)} placeholder="https://www.firma.com" /><div className="md:col-span-2"><ReferenceInput label="Şirket Adresi" value={form.address} onChange={(value) => setField('address', value)} placeholder="Tam adres" /></div><ReferenceInput label="Şehir" value={form.city} onChange={(value) => setField('city', value)} placeholder="Örn: İstanbul" /><ReferenceInput label="Ülke" value={form.country} onChange={(value) => setField('country', value)} placeholder="Örn: Türkiye" /></div></FormSection>
      <FormSection icon={P.user} title="Yetkili Kişiler">
        {contactIndexes.map((contactIndex) => (
          <ReferenceContactBox key={contactIndex} onRemove={contactIndexes.length > 1 ? () => onRemoveContact(contactIndex) : undefined} primary={contactIndex === 1} title={`${contactIndex}. Yetkili`}>
            <ReferenceInput label="Ad Soyad" required={contactIndex === 1} value={form[`contact${contactIndex}FullName`] ?? ''} onChange={(value) => setField(`contact${contactIndex}FullName`, value)} placeholder={contactIndex === 1 ? 'Örn: Mehmet Yılmaz' : ''} compact />
            <ReferenceInput label="Telefon" required={contactIndex === 1} type="tel" value={form[`contact${contactIndex}Phone`] ?? ''} onChange={(value) => setField(`contact${contactIndex}Phone`, value)} placeholder={contactIndex === 1 ? '0555 555 55 55' : ''} compact />
            <ReferenceInput label="E-posta" type="email" value={form[`contact${contactIndex}Email`] ?? ''} onChange={(value) => setField(`contact${contactIndex}Email`, value)} placeholder={contactIndex === 1 ? 'm@firma.com' : ''} compact />
            <ReferenceSelect label="Ünvan" value={form[`contact${contactIndex}Title`] ?? ''} onChange={(value) => setField(`contact${contactIndex}Title`, value)} options={CONTACT_TITLE_OPTIONS} compact />
          </ReferenceContactBox>
        ))}
        <div className="flex items-center gap-3 flex-wrap">
          <button disabled={contactIndexes.length >= MAX_CONTACTS} onClick={onAddContact} type="button" className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-600 hover:bg-purple-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            <Icon className="w-4 h-4">{P.plus}</Icon>
            <span>Yeni Yetkili Ekle</span>
          </button>
          <span className="text-xs text-gray-500">{contactIndexes.length}/{MAX_CONTACTS} yetkili</span>
        </div>
      </FormSection>
      <FormSection icon={P.file} title="Kaşe Bilgileri"><div className="grid grid-cols-1 md:grid-cols-2 gap-5"><ReferenceInput label="Vergi No" value={form.taxNumber} onChange={(value) => setField('taxNumber', value)} placeholder="Örn: 1234567890" /><ReferenceInput label="Vergi Dairesi" value={form.taxOffice} onChange={(value) => setField('taxOffice', value)} placeholder="Örn: Beşiktaş" /><ReferenceInput label="Fatura E-posta" type="email" value={form.invoiceEmail} onChange={(value) => setField('invoiceEmail', value)} placeholder="fatura@firma.com" /><ReferenceInput label="Kaşe Sorumlusu" value={form.financeResponsible} onChange={(value) => setField('financeResponsible', value)} placeholder="Örn: Kaşe Yetkilisi" /><ReferenceTextarea label="Fatura Adresi" value={form.invoiceAddress} onChange={(value) => setField('invoiceAddress', value)} placeholder="Fatura adresini girin" /><ReferenceTextarea label="Kaşe Notu" value={form.financeNote} onChange={(value) => setField('financeNote', value)} placeholder="Kaşe süreci ile ilgili notlar..." /></div></FormSection>
      <FormSection icon={P.send} title="Dijital Kanal ve Pazarlama Uygunluk"><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><ReferenceInput label="Instagram Bağlantısı" type="url" value={form.instagramUrl} onChange={(value) => setField('instagramUrl', value)} placeholder="https://instagram.com/..." compact /><ReferenceInput label="LinkedIn Bağlantısı" type="url" value={form.linkedinUrl} onChange={(value) => setField('linkedinUrl', value)} placeholder="https://linkedin.com/company/..." compact /><ReferenceInput label="Facebook Bağlantısı" type="url" value={form.facebookUrl} onChange={(value) => setField('facebookUrl', value)} placeholder="https://facebook.com/..." compact /><ReferenceInput label="X Bağlantısı" type="url" value={form.marketingSegmentDetailNote} onChange={(value) => setField('marketingSegmentDetailNote', value)} placeholder="https://x.com/..." compact /><div className="md:col-span-2"><ReferenceSelect label="E-Bülten İzni" value={form.newsletterPermissionStatus} onChange={(value) => setField('newsletterPermissionStatus', value)} options={['', 'Var', 'Yok', 'Kontrol Edilecek']} compact /></div><div className="md:col-span-2"><ReferenceTextarea label="Pazarlama Segment Notu" value={form.marketingSegmentNote} onChange={(value) => setField('marketingSegmentNote', value)} placeholder="Segment ve hedef kitle hakkında notlar..." compact /></div><div className="md:col-span-2"><ReferenceTextarea label="Satışa Yönlendirme Notu" value={form.salesHandoverNote} onChange={(value) => setField('salesHandoverNote', value)} placeholder="Satış ekibine aktarılacak önemli notlar..." compact /></div></div></FormSection>
      <FormSection icon={P.file} title="Notlar"><ReferenceTextarea label="Müşteri Hakkında Notlar" value={form.notes} onChange={(value) => setField('notes', value)} placeholder="İlk görüşme, görüşme özeti, takip notları..." rows={3} compact /></FormSection>
    </div>
  );
}

function FormSection({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return <div className="space-y-5"><div className="flex items-center gap-2 pb-3 border-b border-gray-200"><Icon className="w-5 h-5 text-purple-600">{icon}</Icon><h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">{title}</h3></div>{children}</div>;
}

function ReferenceContactBox({ title, primary = false, onRemove, children }: { title: string; primary?: boolean; onRemove?: () => void; children: ReactNode }) {
  return <div className="bg-gray-50 rounded-lg p-5 border border-gray-200"><div className="flex items-center justify-between mb-4"><h4 className="text-sm font-semibold text-gray-900">{title}</h4><div className="flex items-center gap-3">{primary ? <label className="flex items-center gap-2 text-xs font-medium text-gray-700"><input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500" /><span>Birincil Yetkili</span></label> : null}{onRemove ? <button type="button" onClick={onRemove} className="text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg px-2 py-1 transition-colors">Sil</button> : null}</div></div><div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div></div>;
}

function ReferenceInput({ label, value, onChange, placeholder = '', type = 'text', required = false, disabled = false, compact = false }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; type?: string; required?: boolean; disabled?: boolean; compact?: boolean }) {
  return <div><label className={`block ${compact ? 'text-xs' : 'text-sm'} font-semibold text-gray-700 ${compact ? 'mb-1.5' : 'mb-2'}`}>{label} {required ? <span className="text-red-500">*</span> : null}</label><input type={type} value={value} onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)} placeholder={placeholder} disabled={disabled} className={`${disabled ? 'bg-gray-50 text-gray-500' : ''} w-full ${compact ? 'px-3 py-2' : 'px-4 py-2.5'} text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`} /></div>;
}

function ReferenceSelect({ label, value, onChange, options, required = false, compact = false }: { label: string; value: string; onChange: (value: string) => void; options: string[]; required?: boolean; compact?: boolean }) {
  return <div><label className={`block ${compact ? 'text-xs' : 'text-sm'} font-semibold text-gray-700 ${compact ? 'mb-1.5' : 'mb-2'}`}>{label} {required ? <span className="text-red-500">*</span> : null}</label><select value={value} onChange={(event: ChangeEvent<HTMLSelectElement>) => onChange(event.target.value)} className={`w-full ${compact ? 'px-3 py-2' : 'px-4 py-2.5'} text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}>{options.map((option) => <option key={option} value={option}>{option || 'Seçiniz'}</option>)}</select></div>;
}

function ReferenceTextarea({ label, value, onChange, placeholder = '', rows = 2, compact = false }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; rows?: number; compact?: boolean }) {
  return <div><label className={`block ${compact ? 'text-sm font-medium' : 'text-sm font-semibold'} text-gray-700 mb-1.5`}>{label}</label><textarea rows={rows} value={value} onChange={(event: ChangeEvent<HTMLTextAreaElement>) => onChange(event.target.value)} placeholder={placeholder} className={`w-full ${compact ? 'px-3 py-2' : 'px-4 py-2.5'} text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none`} /></div>;
}

function ReferenceCustomerBulkForm() {
  const columns = ['Firma Adı', 'Resmi Ünvan', 'Müşteri Numarası', 'Müşteri Türü', 'Yetkili 1 Ad Soyad', 'Yetkili 1 Telefon', 'Yetkili 1 E-posta', 'Yetkili 1 Ünvan', 'Yetkili 2 Ad Soyad', 'Yetkili 2 Telefon', 'Yetkili 2 E-posta', 'Yetkili 2 Ünvan', 'Şirket Telefonu', 'Şirket E-posta', 'Web Sitesi', 'Hizmetler', 'Kaynak', 'Segment', 'E-Bülten İzni', 'Not'];
  return <div className="space-y-8"><div className="text-center py-8"><div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-5"><Icon className="w-12 h-12 text-purple-600">{P.upload}</Icon></div><h3 className="text-lg font-bold text-gray-900 mb-2">Excel ile Toplu Müşteri Yükle</h3><p className="text-sm text-gray-600 max-w-lg mx-auto">Excel dosyası ile toplu müşteri, yetkili ve iletişim bilgilerini tek seferde sisteme aktarabilirsiniz.</p></div><div className="max-w-3xl mx-auto"><label className="block"><div className="border-2 border-dashed border-gray-300 rounded-xl p-12 hover:border-purple-400 hover:bg-purple-50/30 transition-all cursor-pointer"><input type="file" className="hidden" accept=".xlsx,.xls" /><div className="flex flex-col items-center gap-4"><div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center"><Icon className="w-8 h-8 text-purple-600">{P.upload}</Icon></div><div className="text-center"><p className="text-sm font-semibold text-gray-900 mb-1">Excel Dosyası Seç</p><p className="text-xs text-gray-600">veya sürükleyip bırakın</p><p className="text-xs text-gray-500 mt-2">.xlsx, .xls formatları desteklenir</p></div></div></div></label><button className="mt-5 flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-purple-600 hover:bg-purple-50 rounded-lg transition-colors mx-auto border border-purple-200"><Icon className="w-4 h-4">{P.file}</Icon><span>Örnek Excel Şablonu İndir</span></button></div><div className="max-w-3xl mx-auto bg-gradient-to-br from-gray-50 to-purple-50/30 rounded-xl p-6 border border-gray-200"><div className="flex items-center gap-2 mb-5"><Icon className="w-5 h-5 text-purple-600">{P.file}</Icon><h4 className="text-sm font-bold text-gray-900">Excel Sütun Yapısı (20 Sütun)</h4></div><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">{columns.map((col) => <div key={col} className="bg-white px-3 py-2.5 rounded-lg border border-gray-200 text-center font-medium text-gray-700">{col}</div>)}</div><p className="text-xs text-gray-600 mt-4"><Icon className="w-4 h-4 inline text-blue-600 mr-1">{P.info}</Icon>Zorunlu alanlar: Firma Adı, Müşteri Türü, Kaynak, Yetkili 1 Bilgileri</p></div></div>;
}
