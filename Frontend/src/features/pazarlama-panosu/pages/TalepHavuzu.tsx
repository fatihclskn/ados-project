import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { getCustomers, type CustomerResponse } from '../../../services/customerApi';
import { createRequest, getRequestById, getRequests, updateRequest, type CustomerRequest, type CustomerRequestPayload } from '../../../services/requestApi';
import { createSalesRoutingFromRequest } from '../../../services/salesRoutingApi';

type ColorName = 'emerald' | 'amber' | 'rose' | 'sky' | 'violet' | 'indigo' | 'teal' | 'gray';

type Lead = {
  id: number;
  requestCode: string;
  title: string;
  customerId: string | null;
  co: string;
  contact: string;
  contactTitle: string;
  phone: string;
  email: string;
  source: string;
  services: string[];
  note: string;
  date: string;
  time: string;
  status: string;
  stClr: ColorName | 'purple';
  hot: boolean;
  registered: boolean;
  musNo: string | null;
  dataStatus: string;
  datClr: ColorName;
  priority: string;
  prioClr: ColorName;
  department: string;
  assignedTo: string;
  createdBy: string;
  isSentToSalesRouting: boolean;
  sentToSalesRoutingAt: string | null;
  isSentToSales: boolean;
  sentToSalesAt: string | null;
  salesStatus: string | null;
};

type ModalType = 'lead' | 'customer' | 'salesRoutingConfirm' | null;

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
  plus: (
    <>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </>
  ),
  send: (
    <>
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </>
  ),
  chk: <polyline points="20 6 9 17 4 12" />,
  file: (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </>
  ),
  alert: (
    <>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </>
  ),
  user: (
    <>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </>
  ),
  trend: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />,
  filter: <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />,
  cal: (
    <>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </>
  ),
  chevron: <polyline points="6 9 12 15 18 9" />,
  back: (
    <>
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </>
  ),
  undo: (
    <>
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 .49-4.01" />
    </>
  ),
  flame: <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />,
};

const SVCS = ['SEO', 'Web Sitesi', 'Google Ads', 'Meta Reklam', 'Sosyal Medya', 'E-Bülten', 'Domain', 'Prodüksiyon', 'Hosting', 'Marka Tescili'];
const FILTERS = ['Tümü', 'Yeni', 'Devam Ediyor', 'Tamamlandı', 'İncelemede', 'Satışa Hazır', 'Aktarıldı', 'Geri Döndü'];
const STATUS_FLOW = ['Yeni', 'Devam Ediyor', 'Tamamlandı', 'İncelemede', 'Satışa Hazır', 'Aktarıldı'];
const DETAIL_STATUS_OPTIONS = STATUS_FLOW.filter((step) => step !== 'Aktarıldı');

function Icon({ children, className = 'w-3.5 h-3.5 shrink-0', fill = 'none' }: { children: ReactNode; className?: string; fill?: string }) {
  return (
    <svg className={className} fill={fill} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      {children}
    </svg>
  );
}

function Bdg({ children, color }: { children: ReactNode; color: ColorName | 'purple' }) {
  const tone = color === 'purple' ? CM.gray : CM[color];
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${tone.bg} ${tone.t} whitespace-nowrap`}>{children}</span>;
}

function priorityClass(color: ColorName) {
  const map: Record<ColorName, string> = {
    emerald: 'text-emerald-600 dark:text-emerald-400',
    amber: 'text-amber-600 dark:text-amber-400',
    rose: 'text-rose-600 dark:text-rose-400',
    sky: 'text-sky-600 dark:text-sky-400',
    violet: 'text-violet-600 dark:text-violet-400',
    indigo: 'text-indigo-600 dark:text-indigo-400',
    teal: 'text-teal-600 dark:text-teal-400',
    gray: 'text-gray-600 dark:text-gray-400',
  };
  return map[color];
}

function text(value: unknown, fallback = '—') {
  const normalized = String(value ?? '').trim();
  return normalized || fallback;
}

function statusColor(status: string): ColorName | 'purple' {
  if (status === 'Yeni') return 'sky';
  if (status === 'İncelemede' || status === 'Devam Ediyor') return 'indigo';
  if (status === 'Veri Eksik') return 'amber';
  if (status === 'Satışa Hazır' || status === 'Tamamlandı') return 'emerald';
  if (status === 'Aktarıldı') return 'purple';
  if (status === 'Geri Döndü') return 'rose';
  return 'gray';
}

function priorityColor(priority: string): ColorName {
  if (priority === 'Yüksek') return 'rose';
  if (priority === 'Orta') return 'amber';
  if (priority === 'Düşük') return 'gray';
  return 'violet';
}

function formatDateParts(value: string | null | undefined) {
  if (!value) return { date: '—', time: '—' };
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return { date: value, time: '—' };

  return {
    date: new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' }).format(date),
    time: new Intl.DateTimeFormat('tr-TR', { hour: '2-digit', minute: '2-digit' }).format(date),
  };
}

function requestCreatedTime(request: CustomerRequest) {
  const rawCreatedAt = request.createdAt ?? (request as CustomerRequest & { CreatedAt?: string }).CreatedAt;
  const createdAt = rawCreatedAt ? new Date(rawCreatedAt).getTime() : 0;
  return Number.isFinite(createdAt) ? createdAt : 0;
}

function requestIdentity(request: CustomerRequest) {
  const rawId = request.id ?? (request as CustomerRequest & { Id?: number }).Id;
  const id = Number(rawId);
  return Number.isFinite(id) ? id : 0;
}

function sortRequestsNewestFirst(requests: CustomerRequest[]) {
  return [...requests].sort((a, b) => {
    const dateDiff = requestCreatedTime(b) - requestCreatedTime(a);
    if (dateDiff !== 0) return dateDiff;

    return requestIdentity(b) - requestIdentity(a);
  });
}

function mapRequestToLead(request: CustomerRequest): Lead {
  const created = formatDateParts(request.createdAt);
  const status = text(request.status, 'Yeni');
  const priority = text(request.priority, 'Orta');

  return {
    id: request.id,
    requestCode: request.requestCode,
    title: text(request.requestTitle),
    customerId: request.customerId ?? null,
    co: text(request.customerBrandName, 'Müşteri belirtilmedi'),
    contact: text(request.customerContactName),
    contactTitle: text(request.customerContactTitle),
    phone: text(request.customerContactPhone),
    email: text(request.customerContactEmail),
    source: text(request.requestSource),
    services: Array.isArray(request.services) ? request.services : [],
    note: text(request.description),
    date: created.date,
    time: created.time,
    status,
    stClr: statusColor(status),
    hot: priority === 'Yüksek',
    registered: Boolean(request.customerId),
    musNo: request.requestCode,
    dataStatus: request.department ? text(request.department) : 'Database',
    datClr: request.department ? 'indigo' : 'gray',
    priority,
    prioClr: priorityColor(priority),
    department: text(request.department),
    assignedTo: text(request.assignedTo),
    createdBy: text(request.createdByUserName),
    isSentToSalesRouting: Boolean(request.isSentToSalesRouting),
    sentToSalesRoutingAt: request.sentToSalesRoutingAt ?? null,
    isSentToSales: Boolean(request.isSentToSales),
    sentToSalesAt: request.sentToSalesAt ?? null,
    salesStatus: request.salesStatus ?? null,
  };
}

function buildCreateRequestPayload(form: LeadFormState, services: string[]): CustomerRequestPayload {
  return {
    customerId: form.customerId || null,
    customerBrandName: form.customerBrandName,
    requestTitle: form.requestTitle,
    requestSource: form.requestSource,
    priority: form.priority,
    status: 'Yeni',
    department: form.department,
    assignedTo: form.assignedTo,
    description: form.description,
    services,
    contactName: form.contactName,
    contactPhone: form.contactPhone,
    contactEmail: form.contactEmail,
  };
}

function buildUpdateRequestPayload(lead: Lead, status: string, note = lead.note): CustomerRequestPayload {
  return {
    customerId: lead.customerId,
    customerBrandName: lead.co === 'Müşteri belirtilmedi' ? null : lead.co,
    requestTitle: lead.title || lead.requestCode,
    requestSource: lead.source || 'Web Sitesi',
    priority: lead.priority || 'Orta',
    status,
    department: lead.department || null,
    assignedTo: lead.assignedTo || null,
    description: note || null,
    services: lead.services,
    contactName: lead.contact || null,
    contactPhone: lead.phone || null,
    contactEmail: lead.email || null,
  };
}

type LeadFormState = {
  customerId: string;
  customerBrandName: string;
  requestTitle: string;
  requestSource: string;
  priority: string;
  department: string;
  assignedTo: string;
  description: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
};

const EMPTY_LEAD_FORM: LeadFormState = {
  customerId: '',
  customerBrandName: '',
  requestTitle: '',
  requestSource: 'Web Sitesi',
  priority: 'Yüksek',
  department: '',
  assignedTo: '',
  description: '',
  contactName: '',
  contactPhone: '',
  contactEmail: '',
};

function getCustomerLabel(customer: CustomerResponse) {
  return text(customer.brandName, '') || text(customer.officialTitle, '') || text(customer.customerCode, 'Kodsuz müşteri');
}

export default function TalepHavuzu() {
  const navigate = useNavigate();
  const [modal, setModal] = useState<ModalType>(null);
  const [activeFilter, setActiveFilter] = useState('Tümü');
  const [search, setSearch] = useState('');
  const [requests, setRequests] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');
  const [leadForm, setLeadForm] = useState<LeadFormState>(EMPTY_LEAD_FORM);
  const [selectedLeadServices, setSelectedLeadServices] = useState<string[]>([]);
  const [customers, setCustomers] = useState<CustomerResponse[]>([]);
  const [customersLoading, setCustomersLoading] = useState(false);
  const [customersError, setCustomersError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  async function loadRequests() {
    setLoading(true);
    setError('');

    try {
      const data = await getRequests();
      setRequests(Array.isArray(data) ? sortRequestsNewestFirst(data).map(mapRequestToLead) : []);
    } catch (requestError) {
      setRequests([]);
      setError(requestError instanceof Error ? requestError.message : 'Talepler alınamadı.');
    } finally {
      setLoading(false);
    }
  }

  async function loadCustomers() {
    setCustomersLoading(true);
    setCustomersError('');

    try {
      const data = await getCustomers();
      setCustomers(Array.isArray(data) ? data : []);
    } catch (customerError) {
      setCustomers([]);
      setCustomersError(customerError instanceof Error ? customerError.message : 'Müşteriler alınamadı.');
    } finally {
      setCustomersLoading(false);
    }
  }

  useEffect(() => {
    void loadRequests();
    void loadCustomers();
  }, []);

  const filteredLeads = useMemo(() => {
    return requests.filter((lead) => {
      const statusMatch = activeFilter === 'Tümü' || lead.status === activeFilter;
      const query = search.trim().toLocaleLowerCase('tr-TR');
      const searchMatch = !query || [lead.requestCode, lead.title, lead.co, lead.contact, lead.email, lead.phone, lead.source, lead.priority].some((item) => item.toLocaleLowerCase('tr-TR').includes(query));
      return statusMatch && searchMatch;
    });
  }, [activeFilter, requests, search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, pageSize, search]);

  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / pageSize));
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const pagedLeads = filteredLeads.slice(startIndex, endIndex);

  useEffect(() => {
    if (currentPage !== safeCurrentPage) {
      setCurrentPage(safeCurrentPage);
    }
  }, [currentPage, safeCurrentPage]);

  function toggleLeadService(service: string) {
    setSelectedLeadServices((current) => (current.includes(service) ? current.filter((item) => item !== service) : [...current, service]));
  }

  async function openLead(lead: Lead) {
    setSelectedLead(null);
    setDetailError('');
    setDetailLoading(true);

    try {
      const detail = await getRequestById(lead.id);
      setSelectedLead(mapRequestToLead(detail));
    } catch (requestError) {
      setDetailError(requestError instanceof Error ? requestError.message : 'Talep detayı alınamadı.');
    } finally {
      setDetailLoading(false);
    }
  }

  function setLeadField(field: keyof LeadFormState, value: string) {
    setLeadForm((current) => ({ ...current, [field]: value }));
  }

  function selectLeadCustomer(customerId: string) {
    const selectedCustomer = customers.find((customer) => customer.id === customerId);
    setLeadForm((current) => ({
      ...current,
      customerId,
      customerBrandName: selectedCustomer ? getCustomerLabel(selectedCustomer) : '',
    }));
  }

  async function handleCreateLead() {
    const created = await createRequest(buildCreateRequestPayload(leadForm, selectedLeadServices));
    setLeadForm(EMPTY_LEAD_FORM);
    setSelectedLeadServices([]);
    setCurrentPage(1);
    await loadRequests();
    return created;
  }

  async function handleUpdateLeadStatus(lead: Lead, status: string) {
    await updateRequest(lead.id, buildUpdateRequestPayload(lead, status));
    const detail = await getRequestById(lead.id);
    setSelectedLead(mapRequestToLead(detail));
    await loadRequests();
  }

  async function handleAddLeadNote(lead: Lead, note: string) {
    const currentNote = lead.note.trim();
    const nextNote = currentNote ? `${currentNote} / ${note}` : note;

    await updateRequest(lead.id, buildUpdateRequestPayload(lead, lead.status, nextNote));
    const detail = await getRequestById(lead.id);
    setSelectedLead(mapRequestToLead(detail));
    await loadRequests();
  }

  function openSelectedLeadCustomer() {
    if (!selectedLead?.customerId) return;
    navigate(`/dashboards/marketing/customer-data-control?customerId=${encodeURIComponent(selectedLead.customerId)}`);
  }

  function openSelectedLeadSalesRouting() {
    if (!selectedLead?.id) return;
    if (selectedLead.isSentToSalesRouting || selectedLead.isSentToSales || selectedLead.status === 'Aktarıldı') {
      setDetailError('Bu talep zaten satışa yönlendirilmiş.');
      return;
    }
    if (selectedLead.status !== 'Satışa Hazır') {
      setDetailError('Satışa yönlendirmek için talep durumu Satışa Hazır olmalıdır.');
      return;
    }

    setModal('salesRoutingConfirm');
  }

  async function confirmSelectedLeadSalesRouting() {
    if (!selectedLead?.id) return;

    setDetailError('');
    setModal(null);
    setDetailLoading(true);

    try {
      await createSalesRoutingFromRequest(selectedLead.id);
      const detail = await getRequestById(selectedLead.id);
      setSelectedLead(mapRequestToLead(detail));
      await loadRequests();
    } catch (requestError) {
      const error = requestError as Error & {
        response?: {
          data?: { message?: string; title?: string } | unknown;
          status?: number;
        };
        config?: { url?: string };
      };
      const data = error.response?.data;
      const dataMessage = data && typeof data === 'object' ? (data as { message?: string; title?: string }).message || (data as { message?: string; title?: string }).title : undefined;
      const serializedData = data ? JSON.stringify(data) : undefined;
      const message = dataMessage || serializedData || error.message || 'İşlem tamamlanamadı';

      console.error('AKTARIM HATASI FULL:', error);
      console.error('STATUS:', error.response?.status);
      console.error('DATA:', error.response?.data);
      console.error('URL:', error.config?.url);
      alert(message);
      setDetailError(message);
    } finally {
      setDetailLoading(false);
    }
  }

  if (selectedLead || detailLoading || detailError) {
    return (
      <div className="relative space-y-4 md:space-y-5">
        {detailLoading ? (
          <div className="bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-8 text-center text-[12px] font-medium text-gray-500 dark:text-gray-400">Talep detayı yükleniyor...</div>
        ) : detailError ? (
          <div className="bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-800 rounded-xl p-5">
            <p className="text-sm font-semibold text-rose-600 dark:text-rose-400 mb-4">{detailError}</p>
            <button onClick={() => setDetailError('')} className="px-4 py-2 text-sm bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2 font-medium text-gray-700 dark:text-gray-300"><Icon className="w-4 h-4">{P.back}</Icon><span>Geri Dön</span></button>
          </div>
        ) : selectedLead ? (
          <LeadDetail lead={selectedLead} onBack={() => { setSelectedLead(null); setModal(null); }} onOpenLead={() => setModal('lead')} onOpenCustomer={openSelectedLeadCustomer} onTransferToSales={openSelectedLeadSalesRouting} onUpdateStatus={handleUpdateLeadStatus} onAddNote={handleAddLeadNote} />
        ) : null}
        {modal === 'lead' ? (
          <LeadModal
            form={leadForm}
            selectedLeadServices={selectedLeadServices}
            onClose={() => setModal(null)}
            onCreate={handleCreateLead}
            onSetField={setLeadField}
            onSelectCustomer={selectLeadCustomer}
            onToggleService={toggleLeadService}
            customers={customers}
            customersLoading={customersLoading}
            customersError={customersError}
          />
        ) : null}
        {modal === 'customer' ? <CustomerNotice onClose={() => setModal(null)} /> : null}
        {modal === 'salesRoutingConfirm' && selectedLead ? (
          <SalesRoutingConfirmModal
            onClose={() => setModal(null)}
            onConfirm={() => void confirmSelectedLeadSalesRouting()}
          />
        ) : null}
      </div>
    );
  }

  const summary = [
    { l: 'Toplam Talep', v: requests.length, c: 'violet' as ColorName, f: 'Tümü' },
    { l: 'Yeni', v: requests.filter((x) => x.status === 'Yeni').length, c: 'sky' as ColorName, f: 'Yeni' },
    { l: 'Devam Ediyor', v: requests.filter((x) => x.status === 'Devam Ediyor' || x.status === 'İncelemede').length, c: 'indigo' as ColorName, f: 'Devam Ediyor' },
    { l: 'Tamamlandı', v: requests.filter((x) => x.status === 'Tamamlandı' || x.status === 'Aktarıldı').length, c: 'emerald' as ColorName, f: 'Tamamlandı' },
    { l: 'Yüksek Öncelik', v: requests.filter((x) => x.priority === 'Yüksek').length, c: 'rose' as ColorName, f: 'Tümü' },
  ];
  const hotLeads = requests.filter((x) => x.hot).length;

  return (
    <div className="relative space-y-4 md:space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-violet-100 dark:bg-violet-900/40 rounded-xl flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5 text-violet-600 dark:text-violet-400">{P.file}</Icon>
          </div>
          <div>
            <h1 className="text-[19px] font-bold text-gray-900 dark:text-gray-100 leading-tight">Talep Havuzu</h1>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">Web sitesi formu ve manuel girişler · armadigital.com.tr entegrasyonu aktif</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => setModal('lead')} className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white text-[12px] font-semibold rounded-lg transition-colors"><Icon className="w-3.5 h-3.5 shrink-0 text-white">{P.plus}</Icon> Yeni Talep Ekle</button>
        </div>
      </div>

      <div className="relative overflow-hidden bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-900/15 dark:to-indigo-900/10 border border-violet-200 dark:border-violet-800/40 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center shrink-0">
            <Icon className="w-4 h-4 text-white">{P.globe}</Icon>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100">armadigital.com.tr Talep Formu Entegrasyonu</p>
              <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800/40 rounded-full"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /><span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">Aktif</span></div>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">Web sitenizdeki talep formu doldurulduğunda kayıtlar buraya otomatik düşer. Müşteri kaydı varsa bağlanır, yoksa yeni kayıt oluşturulur.</p>
            <div className="flex flex-wrap gap-3 mt-2 text-[11px] text-gray-600 dark:text-gray-400">
              <span className="flex items-center gap-1"><Icon className="w-3 h-3 shrink-0">{P.clock}</Icon> Son form: <span className="font-semibold text-violet-600 dark:text-violet-400">Bugün 09:14</span></span>
              <span className="flex items-center gap-1"><Icon className="w-3 h-3 shrink-0">{P.file}</Icon> Bu hafta: <span className="font-semibold">6 form</span></span>
              <span className="flex items-center gap-1"><Icon className="w-3 h-3 shrink-0">{P.trend}</Icon> Ortalama yanıt: <span className="font-semibold">2.4 sa</span></span>
            </div>
          </div>
        </div>
      </div>

      {hotLeads > 0 ? (
        <div className="flex items-start gap-3 p-3 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/40 rounded-xl">
          <Icon className="w-4 h-4 text-rose-500 fill-rose-500 shrink-0 mt-0.5" fill="currentColor">{P.flame}</Icon>
          <div className="flex-1"><p className="text-[12px] font-semibold text-rose-700 dark:text-rose-300">{hotLeads} Sıcak Lead — Hızlı Dönüş Gerekli</p><p className="text-[10px] text-rose-600 dark:text-rose-400 mt-0.5">Bu talepler yüksek öncelikli ve hızlı değerlendirme bekliyor. Satış ekibine aktarmadan önce veri kontrolü yapın.</p></div>
        </div>
      ) : null}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {summary.map((item) => {
          const tone = CM[item.c];
          return (
            <button key={item.l} onClick={() => setActiveFilter(item.f)} className="text-left bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2.5 hover:shadow-sm dark:hover:border-gray-700 transition-all cursor-pointer">
              <p className={`text-[19px] font-bold ${tone.t} leading-none mb-0.5`}>{item.v}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">{item.l}</p>
            </button>
          );
        })}
      </div>

      <div className="bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-800 rounded-xl p-4">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-md">
              <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </Icon>
              <input value={search} onChange={(event) => setSearch(event.target.value)} type="text" placeholder="Firma / yetkili / e-posta / telefon ara..." className="w-full pl-9 pr-4 py-2 text-[12px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0a0a0c] rounded-lg focus:outline-none focus:border-violet-500 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600" />
            </div>
            <div className="flex flex-wrap gap-2">
    
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5" id="leadFilterBtns">
            {FILTERS.map((filter) => (
              <button key={filter} onClick={() => setActiveFilter(filter)} className={`lf-btn px-2.5 py-1 text-[11px] font-medium rounded-md transition-all ${filter === activeFilter ? 'bg-violet-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>{filter}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead><tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50/70 dark:bg-[#0a0a0c]/50">
              <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide">Firma / Yetkili</th>
              <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide">İstenen Hizmetler</th>
              <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide">Kaynak</th>
              <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide">Durum</th>
              <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide">Veri</th>
              <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide">Öncelik</th>
              <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide">Tarih / Saat</th>
              <th className="px-3 py-2.5 text-right text-[10px] font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide">İşlem</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">{pagedLeads.map((lead) => <LeadRow key={lead.id} lead={lead} onSelect={(selected) => void openLead(selected)} />)}</tbody>
          </table>
        </div>
        <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-800">{pagedLeads.map((lead) => <LeadMobileCard key={lead.id} lead={lead} onSelect={(selected) => void openLead(selected)} />)}</div>
        {loading ? <div className="px-4 py-8 text-center text-[12px] font-medium text-gray-500 dark:text-gray-400">Talepler yükleniyor...</div> : null}
        {error ? <div className="px-4 py-8 text-center text-[12px] font-medium text-rose-600 dark:text-rose-400">{error}</div> : null}
        {!loading && !error && filteredLeads.length === 0 ? <div className="px-4 py-8 text-center text-[12px] font-medium text-gray-500 dark:text-gray-400">Talep bulunamadı.</div> : null}
        <div className="px-4 py-2.5 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-gray-50/50 dark:bg-[#0a0a0c]/30">
          <span className="text-[11px] text-gray-500 dark:text-gray-500">{filteredLeads.length} talep içinden {pagedLeads.length} talep gösteriliyor · Toplam {requests.length}</span>
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

      {modal === 'lead' ? (
        <LeadModal
          form={leadForm}
          selectedLeadServices={selectedLeadServices}
          onClose={() => setModal(null)}
          onCreate={handleCreateLead}
          onSetField={setLeadField}
          onSelectCustomer={selectLeadCustomer}
          onToggleService={toggleLeadService}
          customers={customers}
          customersLoading={customersLoading}
          customersError={customersError}
        />
      ) : null}
    </div>
  );
}

function FilterButton({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors">
      <Icon className="w-3 h-3 shrink-0">{icon}</Icon>
      {label}<Icon className="w-3 h-3 shrink-0">{P.chevron}</Icon>
    </button>
  );
}

function LeadRow({ lead, onSelect }: { lead: Lead; onSelect: (lead: Lead) => void }) {
  return (
    <tr className="gr border-b border-gray-100 dark:border-gray-800 group cursor-pointer" onClick={() => onSelect(lead)}>
      <td className="px-3 py-3"><LeadIdentity lead={lead} /></td>
      <td className="px-3 py-3"><Services services={lead.services} limit={2} /></td>
      <td className="px-3 py-3"><Source lead={lead} /></td>
      <td className="px-3 py-3"><Bdg color={lead.stClr}>{lead.status}</Bdg></td>
      <td className="px-3 py-3"><Bdg color={lead.datClr}>{lead.dataStatus}</Bdg></td>
      <td className="px-3 py-3"><span className={`text-[10px] font-medium ${priorityClass(lead.prioClr)}`}>{lead.priority}</span></td>
      <td className="px-3 py-3"><div className="text-[10px] text-gray-500 dark:text-gray-400">{lead.date}</div><div className="text-[10px] text-gray-400 dark:text-gray-600">{lead.time}</div></td>
      <td className="px-3 py-3">
        <div className="flex items-center justify-end gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={(event) => { event.stopPropagation(); onSelect(lead); }} title="Detay" className="p-1.5 rounded-md text-violet-500 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors"><Icon>{P.eye}</Icon></button>
        </div>
      </td>
    </tr>
  );
}

function LeadIdentity({ lead }: { lead: Lead }) {
  return (
    <div className="flex items-center gap-1.5">
      <div>
        <div className="flex items-center gap-1">
          <span className="text-[12px] font-semibold text-gray-900 dark:text-gray-100 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">{lead.co}</span>
          {lead.hot ? <Icon className="w-3 h-3 text-rose-500 fill-rose-500 shrink-0" fill="currentColor">{P.flame}</Icon> : null}
        </div>
        <div className="text-[10px] text-gray-400 dark:text-gray-600 font-mono mt-0.5">{lead.requestCode} · {lead.title}</div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-[10px] text-gray-400 dark:text-gray-600">{lead.contact}</span>
          {lead.registered ? <Bdg color="emerald">Kayıtlı</Bdg> : <Bdg color="sky">Yeni</Bdg>}
        </div>
      </div>
    </div>
  );
}

function Source({ lead }: { lead: Lead }) {
  return (
    <div className="flex items-center gap-1">
      {lead.source === 'Web Sitesi Formu' ? <Icon className="w-3 h-3 text-violet-500">{P.globe}</Icon> : <Icon className="w-3 h-3 text-gray-400">{P.user}</Icon>}
      <span className="text-[10px] text-gray-600 dark:text-gray-400">{lead.source}</span>
    </div>
  );
}

function Services({ services, limit }: { services: string[]; limit: number }) {
  return (
    <div className="flex flex-wrap gap-1">
      {services.slice(0, limit).map((service) => <Bdg key={service} color="indigo">{service}</Bdg>)}
      {services.length > limit ? <span className="text-[10px] text-gray-400 dark:text-gray-600 self-center">+{services.length - limit}</span> : null}
    </div>
  );
}

function LeadMobileCard({ lead, onSelect }: { lead: Lead; onSelect: (lead: Lead) => void }) {
  return (
    <button type="button" onClick={() => onSelect(lead)} className="w-full text-left p-3 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50/70 dark:hover:bg-gray-800/30 transition-colors">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <div className="flex items-center gap-1">
            <span className="text-[13px] font-semibold text-gray-900 dark:text-gray-100">{lead.co}</span>
            {lead.hot ? <Icon className="w-3 h-3 text-rose-500 fill-rose-500" fill="currentColor">{P.flame}</Icon> : null}
          </div>
          <p className="text-[10px] text-gray-400 dark:text-gray-600">{lead.contact} · {lead.date} {lead.time}</p>
        </div>
        <Bdg color={lead.stClr}>{lead.status}</Bdg>
      </div>
      <div className="flex flex-wrap gap-1 mb-2">{lead.services.slice(0, 3).map((service) => <Bdg key={service} color="indigo">{service}</Bdg>)}</div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2"><Bdg color={lead.datClr}>{lead.dataStatus}</Bdg> {lead.registered ? <Bdg color="emerald">Kayıtlı</Bdg> : <Bdg color="sky">Yeni</Bdg>}</div>
        <div className="flex items-center gap-1">
          <Icon className="text-violet-500 dark:text-violet-400 w-3.5 h-3.5">{P.eye}</Icon>
          <Icon className="text-gray-400 dark:text-gray-500 w-3.5 h-3.5">{P.send}</Icon>
        </div>
      </div>
    </button>
  );
}

function LeadDetail({ lead, onBack, onOpenLead, onOpenCustomer, onTransferToSales, onUpdateStatus, onAddNote }: { lead: Lead; onBack: () => void; onOpenLead: () => void; onOpenCustomer: () => void; onTransferToSales: () => void; onUpdateStatus: (lead: Lead, status: string) => Promise<void>; onAddNote: (lead: Lead, note: string) => Promise<void> }) {
  const isTransferred = lead.isSentToSalesRouting || lead.isSentToSales || lead.status === 'Aktarıldı';
  const stepStatus = isTransferred ? 'Aktarıldı' : lead.status;
  const curStepIdx = STATUS_FLOW.indexOf(stepStatus);
  const canTransferToSales = lead.status === 'Satışa Hazır' && !isTransferred;
  const transferredMessage = 'Bu talep satışa aktarıldığı için durum değiştirilemez.';
  const transferBlockedMessage = isTransferred ? transferredMessage : 'Satışa yönlendirmek için talep durumu Satışa Hazır olmalıdır.';
  const [status, setStatus] = useState(lead.status);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusError, setStatusError] = useState('');
  const [internalNote, setInternalNote] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [noteError, setNoteError] = useState('');

  useEffect(() => {
    setStatus(lead.status);
    setStatusError('');
    setInternalNote('');
    setNoteError('');
  }, [lead.id, lead.status]);

  async function handleStatusUpdate() {
    if (isUpdatingStatus) return;
    if (isTransferred) {
      setStatusError(transferredMessage);
      return;
    }

    setStatusError('');
    setIsUpdatingStatus(true);

    try {
      await onUpdateStatus(lead, status);
    } catch (error) {
      console.error('Talep durumu güncellenemedi:', error);
      setStatusError(error instanceof Error ? error.message : 'Talep durumu güncellenemedi.');
    } finally {
      setIsUpdatingStatus(false);
    }
  }

  async function handleNoteSave() {
    if (isSavingNote) return;
    if (isTransferred) {
      setNoteError(transferredMessage);
      return;
    }

    const note = internalNote.trim();
    if (!note) {
      setNoteError('Not alanı boş olamaz.');
      return;
    }

    setNoteError('');
    setIsSavingNote(true);

    try {
      await onAddNote(lead, note);
      setInternalNote('');
    } catch (error) {
      console.error('Dahili not kaydedilemedi:', error);
      setNoteError(error instanceof Error ? error.message : 'Dahili not kaydedilemedi.');
    } finally {
      setIsSavingNote(false);
    }
  }

  return (
    <>
      <div className="flex items-center gap-1.5 text-[11px] text-gray-400 dark:text-gray-600 flex-wrap">
        <button onClick={onBack} className="hover:text-gray-600 dark:hover:text-gray-400 cursor-pointer transition-colors">Talep Havuzu</button>
        <span>/</span>
        <span className="text-gray-700 dark:text-gray-300 font-medium">Talep Detayı</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-violet-100 dark:bg-violet-900/40 rounded-xl flex items-center justify-center shrink-0 relative">
            <Icon className="w-5 h-5 text-violet-600 dark:text-violet-400">{P.file}</Icon>
            {lead.hot ? <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-white dark:border-[#17171a]" /> : null}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[19px] font-bold text-gray-900 dark:text-gray-100 leading-tight">{lead.co}</h1>
              {lead.hot ? <span className="text-[10px] font-bold px-2 py-0.5 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 rounded-full flex items-center gap-1"><Icon className="w-2.5 h-2.5 fill-current" fill="currentColor">{P.flame}</Icon> Sıcak Lead</span> : null}
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">{lead.contact} · {lead.date} {lead.time} · {lead.source}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {lead.customerId ? <button onClick={onOpenCustomer} className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-[12px] font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"><Icon>{P.eye}</Icon> Müşteri Kartı</button> : <button disabled className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 text-[12px] font-medium rounded-lg cursor-not-allowed"><Icon>{P.plus}</Icon> Müşteri Bulunamadı</button>}
          <button onClick={onTransferToSales} disabled={!canTransferToSales || lead.status === 'Aktarıldı'} title={canTransferToSales ? undefined : transferBlockedMessage} className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white text-[12px] font-semibold rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"><Icon className="w-3.5 h-3.5 shrink-0 text-white">{P.send}</Icon> Satışa Aktar</button>
          <button onClick={onBack} className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-[12px] font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"><Icon>{P.back}</Icon> Geri Dön</button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-800 rounded-xl p-4">
        <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wide mb-3">Talep Süreci</p>
        <div className="flex items-center gap-0">
          {STATUS_FLOW.map((step, index) => {
            const done = index < curStepIdx;
            const active = index === curStepIdx;
            return (
              <div key={step} className="flex items-center flex-1 min-w-0">
                <div className="flex flex-col items-center min-w-0 flex-1">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold mb-1 shrink-0 ${done ? 'bg-emerald-500 text-white' : active ? 'bg-violet-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600'}`}>{done ? '✓' : index + 1}</div>
                  <span className={`text-[9px] font-medium text-center leading-tight ${active ? 'text-violet-600 dark:text-violet-400' : done ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-600'} hidden sm:block`}>{step}</span>
                </div>
                {index < STATUS_FLOW.length - 1 ? <div className={`h-0.5 flex-1 mx-1 ${index < curStepIdx ? 'bg-emerald-400' : 'bg-gray-200 dark:bg-gray-800'}`} /> : null}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-800 rounded-xl p-4">
            <p className="text-[11px] font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide mb-3">İstenen Hizmetler</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {lead.services.map((service) => <div key={service} className="flex items-center gap-2 px-3 py-2 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800/40 rounded-lg"><span className="text-[12px] font-semibold text-indigo-700 dark:text-indigo-300">{service}</span></div>)}
            </div>
            <div className="border-t border-gray-100 dark:border-gray-800 pt-3">
              <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wide mb-1.5">Talep Notu</p>
              <p className="text-[12px] text-gray-700 dark:text-gray-300 leading-relaxed">{lead.note}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-800 rounded-xl p-4">
            <p className="text-[11px] font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide mb-3">İletişim Bilgileri</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Info label="Yetkili Adı" value={lead.contact} />
              <Info label="Ünvan" value={lead.contactTitle} />
              <Info label="Telefon" value={lead.phone} />
              <div><p className="text-[10px] text-gray-400 dark:text-gray-600 uppercase tracking-wide mb-1">E-posta</p><p className="text-[13px] font-semibold text-violet-600 dark:text-violet-400">{lead.email}</p></div>
              <div><p className="text-[10px] text-gray-400 dark:text-gray-600 uppercase tracking-wide mb-1">Kaynak</p><div className="flex items-center gap-1.5">{lead.source === 'Web Sitesi Formu' ? <Icon className="w-3.5 h-3.5 text-violet-500">{P.globe}</Icon> : <Icon className="w-3.5 h-3.5 text-gray-400">{P.user}</Icon>}<p className="text-[13px] font-semibold text-gray-900 dark:text-gray-100">{lead.source}</p></div></div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-800 rounded-xl p-4">
            <p className="text-[11px] font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide mb-3">Dahili Not</p>
            <textarea rows={3} value={internalNote} onChange={(event) => setInternalNote(event.target.value)} disabled={isTransferred} placeholder="Bu talep hakkında not ekle..." className="w-full px-3 py-2 text-[12px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0a0a0c] rounded-lg focus:outline-none focus:border-violet-500 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 resize-none mb-2 disabled:opacity-60 disabled:cursor-not-allowed" />
            {noteError ? <p className="text-[10px] font-medium text-rose-600 dark:text-rose-400 mb-2">{noteError}</p> : null}
            {isTransferred ? <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 mb-2">{transferredMessage}</p> : null}
            <button onClick={() => void handleNoteSave()} disabled={isSavingNote || isTransferred} className="px-3 py-1.5 text-[11px] font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed">{isSavingNote ? 'Kaydediliyor...' : 'Notu Kaydet'}</button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-800 rounded-xl p-4">
            <p className="text-[11px] font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide mb-3">Talep Özeti</p>
            <div className="space-y-3">
              <Summary label="Talep Durumu"><Bdg color={lead.stClr}>{lead.status}</Bdg></Summary>
              <Summary label="Veri Durumu"><Bdg color={lead.datClr}>{lead.dataStatus}</Bdg></Summary>
              <Summary label="Öncelik"><span className={`text-[12px] font-semibold ${priorityClass(lead.prioClr)}`}>{lead.priority}</span></Summary>
              <Summary label="Müşteri Kaydı">{lead.registered ? <><Bdg color="emerald">Kayıtlı</Bdg> <span className="text-[10px] font-mono text-gray-400 dark:text-gray-600 ml-1">{lead.musNo}</span></> : <Bdg color="sky">Yeni Müşteri</Bdg>}</Summary>
              <Summary label="Talep Tarihi"><p className="text-[12px] font-medium text-gray-700 dark:text-gray-300">{lead.date} {lead.time}</p></Summary>
            </div>
          </div>

          <div className="bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-800 rounded-xl p-4">
            <p className="text-[11px] font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide mb-3">Aksiyonlar</p>
            <div className="space-y-2">
              <button onClick={onTransferToSales} disabled={!canTransferToSales || lead.status === 'Aktarıldı'} title={canTransferToSales ? undefined : transferBlockedMessage} className="w-full flex items-center gap-2 px-3 py-2 text-[12px] font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"><Icon className="w-3.5 h-3.5 shrink-0 text-white">{P.send}</Icon> Satışa Yönlendir</button>
              {!canTransferToSales ? <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400">{transferBlockedMessage}</p> : null}
              {lead.customerId ? <button onClick={onOpenCustomer} className="w-full flex items-center gap-2 px-3 py-2 text-[12px] font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#0a0a0c] border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"><Icon>{P.eye}</Icon> Müşteri Kartını Aç</button> : <button disabled className="w-full flex items-center gap-2 px-3 py-2 text-[12px] font-medium text-gray-400 dark:text-gray-500 bg-white dark:bg-[#0a0a0c] border border-gray-200 dark:border-gray-700 rounded-lg cursor-not-allowed"><Icon>{P.plus}</Icon> Müşteri Bulunamadı</button>}
              <button onClick={onBack} className="w-full flex items-center gap-2 px-3 py-2 text-[12px] font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/40 hover:bg-rose-100 dark:hover:bg-rose-900/30 rounded-lg transition-colors"><Icon>{P.undo}</Icon> Geri Döndür</button>
            </div>
          </div>

          <div className="bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-800 rounded-xl p-4">
            <p className="text-[11px] font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide mb-2">Durum Güncelle</p>
            <select value={status} onChange={(event) => setStatus(event.target.value)} disabled={isTransferred} className="w-full px-3 py-2 text-[12px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0a0a0c] rounded-lg focus:outline-none focus:border-violet-500 text-gray-900 dark:text-gray-100 mb-2 disabled:opacity-60 disabled:cursor-not-allowed">
              {isTransferred && status === 'Aktarıldı' ? <option value="Aktarıldı" disabled>Aktarıldı</option> : null}
              {DETAIL_STATUS_OPTIONS.map((step) => <option key={step}>{step}</option>)}
            </select>
            {statusError ? <p className="text-[10px] font-medium text-rose-600 dark:text-rose-400 mb-2">{statusError}</p> : null}
            {isTransferred ? <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 mb-2">{transferredMessage}</p> : null}
            <button onClick={() => void handleStatusUpdate()} disabled={isUpdatingStatus || isTransferred} className="w-full px-3 py-1.5 text-[11px] font-semibold text-white bg-gray-900 dark:bg-gray-100 dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed">{isUpdatingStatus ? 'Güncelleniyor...' : 'Güncelle'}</button>
          </div>
        </div>
      </div>
    </>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div><p className="text-[10px] text-gray-400 dark:text-gray-600 uppercase tracking-wide mb-1">{label}</p><p className="text-[13px] font-semibold text-gray-900 dark:text-gray-100">{value}</p></div>;
}

function SalesRoutingConfirmModal({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center bg-black/35 px-4 pt-[90px] pb-10">
      <div className="w-full max-w-md rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#17171a] shadow-2xl">
        <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-gray-200 dark:border-gray-800">
          <div>
            <h2 className="text-[14px] font-bold text-gray-900 dark:text-gray-100">Satışa yönlendirilsin mi?</h2>
            <p className="mt-1 text-[12px] leading-relaxed text-gray-500 dark:text-gray-400">
              Bu talep pazarlama satışa yönlendirme listesine aktarılacak. Emin misiniz?
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <Icon className="w-4 h-4 text-gray-500"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Icon>
          </button>
        </div>
        <div className="flex items-center justify-end gap-2 px-5 py-4">
          <button onClick={onClose} className="px-3 py-2 text-[12px] font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#0a0a0c] border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">Vazgeç</button>
          <button onClick={onConfirm} className="px-3 py-2 text-[12px] font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors">Evet, Satışa Yönlendir</button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

function Summary({ label, children }: { label: string; children: ReactNode }) {
  return <div><p className="text-[10px] text-gray-400 dark:text-gray-600 uppercase tracking-wide mb-0.5">{label}</p>{children}</div>;
}

function LeadModal({
  form,
  selectedLeadServices,
  onClose,
  onCreate,
  onSetField,
  onSelectCustomer,
  onToggleService,
  customers,
  customersLoading,
  customersError,
}: {
  form: LeadFormState;
  selectedLeadServices: string[];
  onClose: () => void;
  onCreate: () => Promise<CustomerRequest>;
  onSetField: (field: keyof LeadFormState, value: string) => void;
  onSelectCustomer: (customerId: string) => void;
  onToggleService: (service: string) => void;
  customers: CustomerResponse[];
  customersLoading: boolean;
  customersError: string;
}) {
  const [saveError, setSaveError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');

  const filteredCustomers = useMemo(() => {
    const query = customerSearch.trim().toLocaleLowerCase('tr-TR');
    if (!query) return customers;

    return customers.filter((customer) => {
      return [customer.brandName, customer.officialTitle, customer.customerCode].some((value) => String(value ?? '').toLocaleLowerCase('tr-TR').includes(query));
    });
  }, [customerSearch, customers]);

  async function handleCreate() {
    if (isSaving) return;

    setSaveError('');

    if (!form.customerId) {
      setSaveError('Müşteri seçimi zorunludur.');
      return;
    }

    setIsSaving(true);

    try {
      await onCreate();
      onClose();
    } catch (requestError) {
      setSaveError(requestError instanceof Error ? requestError.message : 'Talep kaydı oluşturulamadı.');
    } finally {
      setIsSaving(false);
    }
  }

  const modalContent = (
    <div id="mL" className="absolute inset-x-0 top-0 z-30 flex items-start justify-center p-4 bg-black/30 rounded-xl" style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: 70, paddingBottom: 40, paddingLeft: 60, paddingRight: 60, background: 'rgba(0,0,0,0.35)', backdropFilter: 'none', overflow: 'hidden', borderRadius: 0 }}>
      <style>{`
        #mL .request-add-modal-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        #mL .request-add-modal-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className="bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl w-full max-w-xl max-h-[88vh] overflow-hidden flex flex-col request-add-modal-scroll" style={{ width: 'min(1100px, calc(100vw - 120px))', maxWidth: 'none', maxHeight: 'calc(100vh - 110px)', overflowY: 'auto', borderRadius: 16, position: 'relative' }}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-800">
          <div><h2 className="text-[14px] font-bold text-gray-900 dark:text-gray-100">Yeni Talep Ekle</h2><p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Kayıtlı müşteriye talep açın.</p></div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"><Icon className="w-4 h-4 text-gray-500"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Icon></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4 request-add-modal-scroll">
          <div><label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">Müşteri Seç <span className="text-rose-500">*</span></label>
            <div className="relative mb-1.5"><Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></Icon><input type="text" value={customerSearch} onChange={(event) => setCustomerSearch(event.target.value)} placeholder="Firma adı ara..." className="w-full pl-9 pr-4 py-2 text-[13px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0a0a0c] rounded-lg focus:outline-none focus:border-violet-500 text-gray-900 dark:text-gray-100 placeholder-gray-400" /></div>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"><div className="px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700"><p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Kayıtlı Müşteriler</p></div>
              <div className="max-h-[150px] overflow-y-auto request-add-modal-scroll">
                {customersLoading ? <div className="px-3 py-2 text-[11px] text-gray-400 dark:text-gray-500">Müşteriler yükleniyor...</div> : null}
                {!customersLoading && customersError ? <div className="px-3 py-2 text-[11px] text-rose-500 dark:text-rose-400">{customersError}</div> : null}
                {!customersLoading && !customersError && customers.length === 0 ? <div className="px-3 py-2 text-[11px] text-gray-400 dark:text-gray-500">Kayıtlı müşteri bulunamadı</div> : null}
                {!customersLoading && !customersError && customers.length > 0 && filteredCustomers.length === 0 ? <div className="px-3 py-2 text-[11px] text-gray-400 dark:text-gray-500">Müşteri bulunamadı</div> : null}
                {!customersLoading && !customersError ? filteredCustomers.map((customer, index) => {
                  const name = getCustomerLabel(customer);
                  const meta = customer.customerCode ? `${customer.customerCode}${customer.officialTitle ? ` · ${customer.officialTitle}` : ''}` : customer.officialTitle ?? '';
                  return (
                    <button key={customer.id} type="button" onClick={() => onSelectCustomer(customer.id)} className={`w-full px-3 py-2 text-left hover:bg-violet-50 dark:hover:bg-violet-900/20 ${index < filteredCustomers.length - 1 ? 'border-b border-gray-100 dark:border-gray-800' : ''} ${form.customerId === customer.id ? 'bg-violet-50 dark:bg-violet-900/20' : ''} transition-colors`}>
                      <p className="text-[12px] font-medium text-gray-900 dark:text-gray-100">{name}</p>
                      {meta ? <p className="text-[10px] text-gray-400 dark:text-gray-500">{meta}</p> : null}
                    </button>
                  );
                }) : null}
              </div>
            </div>
            {customersError ? <p className="text-[10px] text-rose-500 dark:text-rose-400 mt-1">{customersError}</p> : null}
            {form.customerBrandName ? <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">Seçilen müşteri: {form.customerBrandName}</p> : null}
            </div>
          <Field label="Talep Başlığı" required><input type="text" value={form.requestTitle} onChange={(event) => onSetField('requestTitle', event.target.value)} placeholder="Örn: SEO teklif talebi, Web sitesi yenileme" className="w-full px-3 py-2 text-[13px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0a0a0c] rounded-lg focus:outline-none focus:border-violet-500 text-gray-900 dark:text-gray-100 placeholder-gray-400" /></Field>
          <div><label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-2">Hizmetler <span className="text-rose-500">*</span></label><div className="grid grid-cols-3 gap-1.5" id="lsvcs">{SVCS.map((service) => <label key={service} className="flex items-center gap-1.5 px-2.5 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"><input checked={selectedLeadServices.includes(service)} onChange={() => onToggleService(service)} type="checkbox" className="w-3.5 h-3.5 text-violet-600 rounded" /><span className="text-[11px] text-gray-700 dark:text-gray-300">{service}</span></label>)}</div></div>
          <div className="grid grid-cols-2 gap-4"><Field label="Talep Kaynağı" required><Select options={['Web Sitesi', 'Google Ads', 'Meta Reklam', 'Referans', 'Telefon', 'WhatsApp', 'E-Bülten']} value={form.requestSource} onChange={(value) => onSetField('requestSource', value)} /></Field><Field label="Öncelik"><Select options={['Düşük', 'Orta', 'Yüksek']} value={form.priority} onChange={(value) => onSetField('priority', value)} /></Field></div>
          <div><label className="block text-[11px] font-medium text-gray-700 dark:text-gray-300 mb-1">Talep Açıklaması</label><textarea rows={2} value={form.description} onChange={(event) => onSetField('description', event.target.value)} placeholder="Müşteri ihtiyacı özeti..." className="w-full px-3 py-2 text-[12px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0a0a0c] rounded-lg focus:outline-none focus:border-violet-500 text-gray-900 dark:text-gray-100 placeholder-gray-400 resize-none" /></div>
          {saveError ? <div className="px-3 py-2 text-[11px] font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/40 rounded-lg">{saveError}</div> : null}
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-200 dark:border-gray-800 bg-gray-50/70 dark:bg-[#0a0a0c]/50">
          <button onClick={onClose} className="px-3 py-1.5 text-[12px] font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">İptal</button>
          <div className="flex gap-2"><button className="px-3 py-1.5 text-[12px] font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50">Taslak</button><button onClick={() => void handleCreate()} disabled={isSaving} className="px-4 py-1.5 text-[12px] font-bold text-white bg-violet-600 rounded-lg hover:bg-violet-700 disabled:opacity-60 disabled:cursor-not-allowed">{isSaving ? 'Kaydediliyor...' : 'Talebi Oluştur'}</button></div>
        </div>
      </div>
    </div>
  );

  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(modalContent, document.body);
}

function CustomerNotice({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute inset-x-0 top-0 z-30 flex items-start justify-center p-4 bg-black/30 rounded-xl">
      <div className="bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-800">
          <div><h2 className="text-[14px] font-bold text-gray-900 dark:text-gray-100">Müşteri Kartı</h2><p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Müşteri Data Kontrol ekranında görüntülenecek.</p></div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"><Icon className="w-4 h-4 text-gray-500"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Icon></button>
        </div>
        <div className="p-5 text-[12px] text-gray-600 dark:text-gray-400">Bu aksiyon orijinal HTML’de müşteri detay ekranına geçiş yapıyor. İlgili ekran bağlandığında aynı akışa yönlenecek.</div>
      </div>
    </div>
  );
}

function Field({ label, required = false, children }: { label: string; required?: boolean; children: ReactNode }) {
  return <div><label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">{label} {required ? <span className="text-rose-500">*</span> : null}</label>{children}</div>;
}

function Select({ options, defaultValue, value, onChange }: { options: string[]; defaultValue?: string; value?: string; onChange?: (value: string) => void }) {
  const selectProps = value === undefined ? { defaultValue } : { value };
  return <select {...selectProps} onChange={(event) => onChange?.(event.target.value)} className="w-full px-3 py-2 text-[12px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0a0a0c] rounded-lg focus:outline-none focus:border-violet-500 text-gray-900 dark:text-gray-100">{options.map((option) => <option key={option}>{option}</option>)}</select>;
}
