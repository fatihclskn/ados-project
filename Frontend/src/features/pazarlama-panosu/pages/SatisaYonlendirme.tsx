import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getSalesRoutingRequestById, getSalesRoutingRequests, updateSalesRoutingHandoff, type SalesRoutingRequest } from '../../../services/salesRoutingApi';
import { transferSalesRoutingToSalesPanel } from '../../../services/salesPanelRequestApi';

type ColorName = 'emerald' | 'amber' | 'rose' | 'sky' | 'violet' | 'indigo' | 'gray';

type HandoffLead = {
  id: number;
  requestId?: number;
  requestCode?: string;
  co: string;
  contact: string;
  contactTitle?: string;
  phone?: string;
  email?: string;
  services: string[];
  note?: string;
  leadStatus?: string;
  dataStatus?: string;
  datClr?: ColorName;
  priority?: string;
  prioClr?: ColorName;
  source?: string;
  date?: string;
  salesStatus?: string;
  ssClr?: ColorName;
  star?: boolean;
  musNo?: string | null;
  registered?: boolean;
  returnReason?: string;
  lastSvc?: string;
  lastDate?: string;
  lastAmount?: string;
  segment?: string;
  aiScore?: number;
  aiSugg?: string;
  isSentToSales?: boolean;
  isSentToSalesRouting?: boolean;
  sentToSalesAt?: string | null;
};

const CM: Record<ColorName, { bg: string; t: string }> = {
  emerald: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', t: 'text-emerald-700 dark:text-emerald-300' },
  amber: { bg: 'bg-amber-100 dark:bg-amber-900/30', t: 'text-amber-700 dark:text-amber-300' },
  rose: { bg: 'bg-rose-100 dark:bg-rose-900/30', t: 'text-rose-700 dark:text-rose-300' },
  sky: { bg: 'bg-sky-100 dark:bg-sky-900/30', t: 'text-sky-700 dark:text-sky-300' },
  violet: { bg: 'bg-violet-100 dark:bg-violet-900/30', t: 'text-violet-700 dark:text-violet-300' },
  indigo: { bg: 'bg-indigo-100 dark:bg-indigo-900/30', t: 'text-indigo-700 dark:text-indigo-300' },
  gray: { bg: 'bg-gray-100 dark:bg-gray-800', t: 'text-gray-600 dark:text-gray-400' },
};

const P = {
  send: (
    <>
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </>
  ),
  chk: <polyline points="20 6 9 17 4 12" />,
  alert: (
    <>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </>
  ),
  file: (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </>
  ),
  eye: (
    <>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  ai: (
    <>
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </>
  ),
  undo: (
    <>
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 .49-4.01" />
    </>
  ),
  back: (
    <>
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </>
  ),
};

const HANDOFF_REMARKET: HandoffLead[] = [
  { id: 101, co: 'Sürdürülebilir Enerji A.Ş.', contact: 'Kemal Arslan', lastSvc: 'Web Sitesi', lastDate: '8 ay önce', lastAmount: '₺18.500', segment: 'Teknik Hizmet', aiScore: 72, aiSugg: 'Web sitesi modernizasyonu + SEO paketi öner. Rakip analizi ekle.', services: ['Web Sitesi', 'SEO'], musNo: 'MUS-2023-1456' },
  { id: 102, co: 'Oto Bakım Merkezi', contact: 'Ali Yıldırım', lastSvc: 'Google Ads', lastDate: '10 ay önce', lastAmount: '₺12.000', segment: 'Lokal İşletme', aiScore: 61, aiSugg: 'Google Ads + Google Business optimizasyon paketi. Sezon kampanyası ekle.', services: ['Google Ads', 'SEO'], musNo: 'MUS-2022-0887' },
  { id: 103, co: 'Eğitim Platform A.Ş.', contact: 'Deniz Kaya', lastSvc: 'Sosyal Medya', lastDate: '7 ay önce', lastAmount: '₺22.000', segment: 'Eğitim', aiScore: 55, aiSugg: 'Yeni dönem için içerik takvimi + sosyal medya paketi teklifi hazırla.', services: ['Sosyal Medya', 'E-Bülten'], musNo: 'MUS-2024-3078' },
  { id: 104, co: 'Plastik Teknolojileri A.Ş.', contact: 'Erdem Ak', lastSvc: 'Web Sitesi', lastDate: '11 ay önce', lastAmount: '₺35.000', segment: 'Üretim & Sanayi', aiScore: 48, aiSugg: 'Sektörel case study ile iletişime geç. Rakip analizi sun.', services: ['Web Sitesi', 'SEO', 'Kurumsal Kimlik'], musNo: 'MUS-2021-0441' },
  { id: 105, co: 'Elektronik Ticaret A.Ş.', contact: 'Hasan Kaya', lastSvc: 'E-Bülten', lastDate: '6 ay önce', lastAmount: '₺8.200', segment: 'E-Ticaret', aiScore: 44, aiSugg: 'E-ticaret SEO + Google Ads kombinasyonu ile geri çek. Başarı hikayesi paylaş.', services: ['SEO', 'Google Ads', 'E-Bülten'], musNo: 'MUS-2023-1892' },
];

const FILTERS = ['Tümü', 'Bekliyor', 'Satışta', 'Satışa Aktarıldı', 'Revize Gerekli'];
const READY_FOR_SALES_STATUS = 'Satışa Hazır';
const READY_FOR_SALES_MESSAGE = 'Talep satışa yönlendirilmeden önce Satışa Hazır yapılmalıdır.';

function Icon({ children, className = 'w-3.5 h-3.5 shrink-0', fill = 'none' }: { children: ReactNode; className?: string; fill?: string }) {
  return (
    <svg className={className} fill={fill} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      {children}
    </svg>
  );
}

function Bdg({ children, color = 'gray' }: { children: ReactNode; color?: ColorName }) {
  const tone = CM[color] || CM.gray;
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${tone.bg} ${tone.t} whitespace-nowrap`}>{children}</span>;
}

function ActionIconButton({ children, title, onClick }: { children: ReactNode; title: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} title={title} className="w-7 h-7 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-md transition-all">
      {children}
    </button>
  );
}

function priorityClass(color: ColorName = 'gray') {
  const map: Record<ColorName, string> = {
    emerald: 'text-emerald-600 dark:text-emerald-400',
    amber: 'text-amber-600 dark:text-amber-400',
    rose: 'text-rose-600 dark:text-rose-400',
    sky: 'text-sky-600 dark:text-sky-400',
    violet: 'text-violet-600 dark:text-violet-400',
    indigo: 'text-indigo-600 dark:text-indigo-400',
    gray: 'text-gray-600 dark:text-gray-400',
  };
  return map[color];
}

function text(value: unknown, fallback = '—') {
  const normalized = String(value ?? '').trim();
  return normalized || fallback;
}

function formatDate(value: string | null | undefined) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
}

function priorityColor(priority: string): ColorName {
  if (priority === 'Yüksek') return 'rose';
  if (priority === 'Orta') return 'amber';
  if (priority === 'Düşük') return 'gray';
  return 'violet';
}

function salesStatusFromRequest(request: SalesRoutingRequest, status: string) {
  if (request.sentToSalesAt) return text(request.salesStatus, 'Satışta');
  if (request.salesStatus && request.salesStatus !== 'Yeni') return text(request.salesStatus, 'Bekliyor');
  if (status === 'Satışta') return 'Satışta';
  if (status === 'Geri Döndü' || status === 'Veri Eksik' || status === 'Revize Gerekli') return 'Revize Gerekli';
  return 'Bekliyor';
}

function salesStatusColor(status: string): ColorName {
  if (status === 'Satışta') return 'violet';
  if (status === 'Satışa Aktarıldı') return 'emerald';
  if (status === 'Revize Gerekli') return 'amber';
  return 'sky';
}

function dataStatusColor(status: string): ColorName {
  if (status === 'Tamamlandı' || status === 'Satışa Hazır' || status === 'Aktarıldı') return 'emerald';
  if (status === 'Veri Eksik' || status === 'İncelemede') return 'amber';
  return 'indigo';
}

function mapRequestToHandoffLead(request: SalesRoutingRequest): HandoffLead {
  const status = text(request.requestStatus ?? request.routingStatus, 'Aktarıldı');
  const salesStatus = salesStatusFromRequest(request, status);
  const priority = text(request.priority, 'Orta');
  const customerName = text(request.customerBrandName, 'Müşteri belirtilmedi');

  return {
    id: request.id,
    requestId: request.requestId,
    requestCode: `REQ-${request.requestId}`,
    co: customerName,
    contact: text(request.customerContactName),
    contactTitle: text(request.customerContactTitle, ''),
    phone: text(request.customerContactPhone, ''),
    email: text(request.customerContactEmail, ''),
    services: [],
    note: text(request.notes, ''),
    leadStatus: status,
    dataStatus: text(request.routingStatus, status),
    datClr: dataStatusColor(status),
    priority,
    prioClr: priorityColor(priority),
    source: text(request.requestSource),
    date: formatDate(request.routedAt),
    salesStatus,
    ssClr: salesStatusColor(salesStatus),
    star: priority === 'Yüksek',
    musNo: `REQ-${request.requestId}`,
    registered: Boolean(request.customerId),
    returnReason: salesStatus === 'Revize Gerekli' ? text(request.notes, '') : undefined,
    isSentToSales: Boolean(request.sentToSalesAt || salesStatus === 'Satışta'),
    isSentToSalesRouting: true,
    sentToSalesAt: request.sentToSalesAt ?? null,
  };
}

export default function SatisaYonlendirme() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const requestIdParam = searchParams.get('requestId');
  const [activeFilter, setActiveFilter] = useState('Tümü');
  const [selectedHandoff, setSelectedHandoff] = useState<HandoffLead | null>(null);
  const [requests, setRequests] = useState<HandoffLead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');
  const [sendingRequestIds, setSendingRequestIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  async function loadRequests() {
    setLoading(true);
    setError('');

    try {
      const data = await getSalesRoutingRequests();
      setRequests(Array.isArray(data) ? data.map((request) => mapRequestToHandoffLead(request)) : []);
    } catch (requestError) {
      const error = requestError as Error & { response?: { data?: { message?: string; title?: string }; status?: number }; config?: { url?: string } };
      console.error('API hata:', error);
      console.error('Status:', error.response?.status);
      console.error('Data:', error.response?.data);
      console.error('Url:', error.config?.url);
      setRequests([]);
      setError(error.response?.data?.message || error.response?.data?.title || error.message || 'İşlem tamamlanamadı');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadRequests();
  }, []);

  useEffect(() => {
    if (!requestIdParam) return;

    const requestId = Number(requestIdParam);
    if (!Number.isInteger(requestId) || requestId <= 0) {
      setDetailError('Geçersiz talep numarası.');
      return;
    }

    void openHandoffById(requestId);
  }, [requestIdParam]);

  const waitingLeads = requests.filter((x) => x.salesStatus === 'Bekliyor');
  const activeSales = requests.filter((x) => x.salesStatus === 'Satışta');
  const returnedLeads = requests.filter((x) => x.salesStatus === 'Revize Gerekli');
  const filteredLeads = useMemo(() => (activeFilter === 'Tümü' ? requests : requests.filter((lead) => lead.salesStatus === activeFilter)), [activeFilter, requests]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, pageSize]);

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

  async function openHandoffById(id: number) {
    setSelectedHandoff(null);
    setDetailError('');
    setDetailLoading(true);

    try {
      const detail = await getSalesRoutingRequestById(id);
      setSelectedHandoff(mapRequestToHandoffLead(detail));
    } catch (requestError) {
      const error = requestError as Error & { response?: { data?: { message?: string; title?: string }; status?: number }; config?: { url?: string } };
      console.error('API hata:', error);
      console.error('Status:', error.response?.status);
      console.error('Data:', error.response?.data);
      console.error('Url:', error.config?.url);
      setDetailError(error.response?.data?.message || error.response?.data?.title || error.message || 'Talep detayı alınamadı.');
    } finally {
      setDetailLoading(false);
    }
  }

  async function openHandoff(lead: HandoffLead) {
    if (!lead.requestCode) {
      setSelectedHandoff(lead);
      return;
    }

    setSelectedHandoff(null);
    setDetailError('');
    setDetailLoading(true);

    try {
      const detail = await getSalesRoutingRequestById(lead.id);
      setSelectedHandoff(mapRequestToHandoffLead(detail));
    } catch (requestError) {
      const error = requestError as Error & { response?: { data?: { message?: string; title?: string }; status?: number }; config?: { url?: string } };
      console.error('API hata:', error);
      console.error('Status:', error.response?.status);
      console.error('Data:', error.response?.data);
      console.error('Url:', error.config?.url);
      setDetailError(error.response?.data?.message || error.response?.data?.title || error.message || 'Talep detayı alınamadı.');
    } finally {
      setDetailLoading(false);
    }
  }

  async function sendHandoffToSales(lead: HandoffLead) {
    if (lead.isSentToSales || sendingRequestIds.includes(lead.id)) return;
    if (!lead.isSentToSalesRouting && lead.leadStatus !== READY_FOR_SALES_STATUS) {
      setDetailError(READY_FOR_SALES_MESSAGE);
      return;
    }

    setSendingRequestIds((current) => [...current, lead.id]);
    setDetailError('');

    try {
      await transferSalesRoutingToSalesPanel(lead.id);
      const updated = await getSalesRoutingRequestById(lead.id);
      const mapped = mapRequestToHandoffLead(updated);
      setSelectedHandoff(mapped);
      await loadRequests();
    } catch (requestError) {
      const error = requestError as Error & { response?: { data?: { message?: string; title?: string }; status?: number }; config?: { url?: string } };
      console.error('Satış paneline aktarım hatası:', error);
      console.error('Status:', error.response?.status);
      console.error('Data:', error.response?.data);
      console.error('Url:', error.config?.url);
      setDetailError(error.response?.data?.message || error.response?.data?.title || error.message || 'Talep satışa aktarılamadı.');
    } finally {
      setSendingRequestIds((current) => current.filter((id) => id !== lead.id));
    }
  }

  async function saveHandoffDetails(lead: HandoffLead, handoffNote: string, expectedOfferDate: string) {
    const updated = await updateSalesRoutingHandoff(lead.id, {
      handoffNote,
      expectedOfferDate,
    });
    const mapped = mapRequestToHandoffLead(updated);
    setSelectedHandoff(mapped);
    await loadRequests();
  }

  function closeHandoffDetail() {
    setSelectedHandoff(null);
    setDetailError('');
    if (requestIdParam) {
      setSearchParams({}, { replace: true });
    }
  }

  if (selectedHandoff || detailLoading || detailError) {
    if (detailLoading) {
      return <div className="bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-8 text-center text-[12px] font-medium text-gray-500 dark:text-gray-400">Talep detayı yükleniyor...</div>;
    }

    if (detailError) {
      return (
        <div className="bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-800 rounded-xl p-5">
          <p className="text-sm font-semibold text-rose-600 dark:text-rose-400 mb-4">{detailError}</p>
          <button onClick={closeHandoffDetail} className="px-4 py-2 text-sm bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2 font-medium text-gray-700 dark:text-gray-300"><Icon className="w-4 h-4">{P.back}</Icon><span>Geri Dön</span></button>
        </div>
      );
    }

    if (selectedHandoff) {
      return <HandoffDetail handoff={selectedHandoff} onBack={closeHandoffDetail} onSendToSales={sendHandoffToSales} onSaveHandoff={saveHandoffDetails} isSending={sendingRequestIds.includes(selectedHandoff.id)} />;
    }
  }

  const kpis = [
    { l: 'Satışa Hazır', v: waitingLeads.length, c: 'emerald' as ColorName },
    { l: 'Satış Sürecinde', v: activeSales.length, c: 'violet' as ColorName },
    { l: 'Geri Dönen', v: returnedLeads.length, c: 'rose' as ColorName },
    { l: 'Re-Marketing Kuyruğu', v: HANDOFF_REMARKET.length, c: 'amber' as ColorName },
    { l: 'Bu Hafta Aktarılan', v: activeSales.length, c: 'sky' as ColorName },
  ];

  return (
    <div className="relative space-y-4 md:space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-violet-100 dark:bg-violet-900/40 rounded-xl flex items-center justify-center shrink-0">
            <Icon className="text-violet-600 dark:text-violet-400 w-5 h-5">{P.send}</Icon>
          </div>
          <div>
            <h1 className="text-[19px] font-bold text-gray-900 dark:text-gray-100 leading-tight">Satışa Yönlendirme</h1>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">Talep havuzu + mevcut müşteri datası → satış ekibine handoff</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => {
            const lead = waitingLeads[0] || requests[0];
            if (lead) void openHandoff(lead);
          }} className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white text-[12px] font-semibold rounded-lg transition-colors">
            <Icon className="text-white w-3.5 h-3.5">{P.send}</Icon> Toplu Aktar
          </button>
          
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {kpis.map((kpi) => {
          const tone = CM[kpi.c] || CM.gray;
          return (
            <div key={kpi.l} className="bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2.5 hover:shadow-sm dark:hover:border-gray-700 transition-all">
              <p className={`text-[19px] font-bold ${tone.t} leading-none mb-0.5`}>{kpi.v}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">{kpi.l}</p>
            </div>
          );
        })}
      </div>

      {returnedLeads.length > 0 ? (
        <div className="flex items-start gap-3 p-3.5 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/40 rounded-xl">
          <Icon className="text-rose-500 dark:text-rose-400 w-4 h-4 shrink-0 mt-0.5">{P.alert}</Icon>
          <div className="flex-1">
            <p className="text-[12px] font-semibold text-rose-700 dark:text-rose-300 mb-1">{returnedLeads.length} Lead Satıştan Geri Döndü — Revize Gerekiyor</p>
            <div className="flex flex-wrap gap-2">
              {returnedLeads
                .filter((lead) => lead.returnReason)
                .map((lead) => (
                  <span key={lead.id} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-rose-100 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800/40 rounded-lg text-[10px] font-medium text-rose-700 dark:text-rose-300">
                    <Icon className="w-3 h-3">{P.alert}</Icon> {lead.returnReason}
                  </span>
                ))}
            </div>
          </div>
        </div>
      ) : null}

      <div className="bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="text-violet-600 dark:text-violet-400 w-3.5 h-3.5">{P.file}</Icon>
            <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100">Talep Havuzu — Satışa Hazır</p>
            <span className="px-1.5 py-0.5 bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 text-[10px] font-bold rounded-full">{waitingLeads.length} bekliyor</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {FILTERS.map((filter) => (
              <button key={filter} onClick={() => setActiveFilter(filter)} className={`hf-btn px-2.5 py-1 text-[10px] font-medium rounded-md transition-all ${activeFilter === filter ? 'bg-violet-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50/70 dark:bg-[#0a0a0c]/50">
                <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide">Firma / Yetkili</th>
                <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide">İstenen Hizmetler</th>
                <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide">Veri</th>
                <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide">Satış Durumu</th>
                <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide">Öncelik</th>
                <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide">Tarih</th>
                <th className="px-3 py-2.5 text-right text-[10px] font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {pagedLeads.map((lead) => (
                <tr key={lead.id} onClick={() => void openHandoff(lead)} className="gr group cursor-pointer">
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1.5">
                      {lead.star ? (
                        <Icon className="w-3 h-3 text-violet-500 fill-violet-500 shrink-0" fill="currentColor">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </Icon>
                      ) : (
                        <span className="w-3 h-3 shrink-0" />
                      )}
                      <div>
                        <p className="text-[12px] font-semibold text-gray-900 dark:text-gray-100 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">{lead.co}</p>
                        <p className="text-[10px] text-gray-400 dark:text-gray-600">{lead.contact}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-1">
                      {lead.services.slice(0, 2).map((service) => (
                        <Bdg key={service} color="indigo">{service}</Bdg>
                      ))}
                      {lead.services.length > 2 ? <span className="text-[10px] text-gray-400 dark:text-gray-600">+{lead.services.length - 2}</span> : null}
                    </div>
                  </td>
                  <td className="px-3 py-3"><Bdg color={lead.datClr}>{lead.dataStatus}</Bdg></td>
                  <td className="px-3 py-3"><Bdg color={lead.ssClr}>{lead.salesStatus}</Bdg></td>
                  <td className="px-3 py-3"><span className={`text-[10px] font-semibold ${priorityClass(lead.prioClr)}`}>{lead.priority}</span></td>
                  <td className="px-3 py-3"><span className="text-[10px] text-gray-400 dark:text-gray-600">{lead.date}</span></td>
                  <td className="px-3 py-3">
                    <div className="flex items-center justify-end gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          if (lead.isSentToSales) {
                            void openHandoff(lead);
                          } else {
                            void sendHandoffToSales(lead);
                          }
                        }}
                        disabled={sendingRequestIds.includes(lead.id)}
                        className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-colors ${
                          lead.isSentToSales
                            ? 'bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50'
                            : lead.salesStatus === 'Bekliyor'
                            ? 'bg-violet-600 hover:bg-violet-700 text-white'
                            : lead.salesStatus === 'Revize Gerekli'
                              ? 'bg-amber-500 hover:bg-amber-600 text-white'
                              : 'bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50'
                        }`}
                      >
                        {sendingRequestIds.includes(lead.id) ? 'Aktarılıyor' : lead.isSentToSales ? 'Satışta' : lead.salesStatus === 'Bekliyor' ? 'Aktar' : lead.salesStatus === 'Revize Gerekli' ? 'Revize Et' : 'Detay'}
                      </button>
                      <ActionIconButton title="Görüntüle" onClick={() => void openHandoff(lead)}>
                        <Icon className="w-3.5 h-3.5">{P.eye}</Icon>
                      </ActionIconButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-800">
          {pagedLeads.map((lead) => (
            <div key={lead.id} className="p-3 hover:bg-gray-50/70 dark:hover:bg-gray-800/30 transition-colors" onClick={() => void openHandoff(lead)}>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-1 mb-0.5">
                    {lead.star ? (
                      <Icon className="w-3 h-3 text-violet-500 fill-violet-500" fill="currentColor">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </Icon>
                    ) : null}
                    <p className="text-[13px] font-semibold text-gray-900 dark:text-gray-100">{lead.co}</p>
                  </div>
                  <p className="text-[10px] text-gray-400 dark:text-gray-600">{lead.contact} · {lead.date}</p>
                </div>
                <Bdg color={lead.ssClr}>{lead.salesStatus}</Bdg>
              </div>
              <div className="flex flex-wrap gap-1 mb-2">
                {lead.services.map((service) => (
                  <Bdg key={service} color="indigo">{service}</Bdg>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bdg color={lead.datClr}>{lead.dataStatus}</Bdg>
                  <span className={`text-[10px] font-semibold ${priorityClass(lead.prioClr)}`}>{lead.priority}</span>
                </div>
                <button className={`px-2.5 py-1 text-[10px] rounded-md ${lead.salesStatus === 'Bekliyor' ? 'font-bold bg-violet-600 text-white' : 'font-medium border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'}`}>
                  {lead.salesStatus === 'Bekliyor' ? 'Aktar' : 'Detay'}
                </button>
              </div>
            </div>
          ))}
        </div>
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

      {/* <div className="bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="w-3.5 h-3.5 text-amber-500 shrink-0">{P.undo}</Icon>
            <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100">Mevcut Müşteri — Yeniden Teklif</p>
            <span className="px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-[10px] font-bold rounded-full">{HANDOFF_REMARKET.length} aday</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-gray-500 dark:text-gray-400">
            <Icon className="w-3 h-3 text-violet-500">{P.ai}</Icon>
            AI Skora göre sıralı
          </div>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {[...HANDOFF_REMARKET].sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0)).map((lead) => (
            <div key={lead.id} className="px-4 py-3.5 hover:bg-gray-50/70 dark:hover:bg-gray-800/30 transition-colors">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 shrink-0 relative flex items-center justify-center">
                  <svg className="w-11 h-11 -rotate-90" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-100 dark:text-gray-800" />
                    <circle cx="18" cy="18" r="14" fill="none" stroke={(lead.aiScore || 0) >= 60 ? '#f59e0b' : '#ef4444'} strokeWidth="2.5" strokeDasharray={`${(lead.aiScore || 0) * 0.88} 100`} strokeLinecap="round" />
                  </svg>
                  <span className="absolute text-[10px] font-bold text-gray-900 dark:text-gray-100">{lead.aiScore}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100">{lead.co}</p>
                      <p className="text-[10px] text-gray-400 dark:text-gray-600">{lead.contact} · <span className="font-mono">{lead.musNo}</span></p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] font-bold text-gray-600 dark:text-gray-400">{lead.lastAmount}</span>
                      <Bdg color="indigo">{lead.segment}</Bdg>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-2 text-[10px] text-gray-500 dark:text-gray-400">
                    <span>Son hizmet: <Bdg color="gray">{lead.lastSvc}</Bdg></span>
                    <span className="text-gray-300 dark:text-gray-700">·</span>
                    <span>{lead.lastDate}</span>
                  </div>
                  <div className="flex items-start gap-1.5 p-2.5 bg-amber-50/70 dark:bg-amber-900/15 border border-amber-200/60 dark:border-amber-800/30 rounded-lg mb-2.5">
                    <Icon className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5">{P.ai}</Icon>
                    <p className="text-[10px] text-amber-700 dark:text-amber-300">{lead.aiSugg}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex flex-wrap gap-1">
                      {lead.services.map((service) => (
                        <Bdg key={service} color="indigo">{service}</Bdg>
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5 ml-auto">
                      <button onClick={() => setSelectedHandoff(lead)} className="px-2.5 py-1.5 text-[10px] font-semibold bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors">Satışa Yönlendir</button>
                      <button onClick={() => setSelectedHandoff(lead)} className="px-2.5 py-1.5 text-[10px] font-medium bg-white dark:bg-[#0a0a0c] border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Müşteri Kartı</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
}

function HandoffDetail({ handoff, onBack, onSendToSales, onSaveHandoff, isSending }: { handoff: HandoffLead; onBack: () => void; onSendToSales: (handoff: HandoffLead) => Promise<void>; onSaveHandoff: (handoff: HandoffLead, handoffNote: string, expectedOfferDate: string) => Promise<void>; isSending: boolean }) {
  const isRemarket = !handoff.requestCode;
  const [handoffNote, setHandoffNote] = useState('');
  const [expectedOfferDate, setExpectedOfferDate] = useState('');
  const [isSavingHandoff, setIsSavingHandoff] = useState(false);
  const [handoffError, setHandoffError] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);

  async function handleSaveHandoff() {
    if (isSavingHandoff) return;

    setHandoffError('');
    if (!handoffNote.trim() && !expectedOfferDate) {
      setHandoffError('Kaydetmek için handoff notu veya beklenen teklif tarihi girilmelidir.');
      return;
    }

    setIsSavingHandoff(true);

    try {
      await onSaveHandoff(handoff, handoffNote, expectedOfferDate);
      setHandoffNote('');
      setExpectedOfferDate('');
    } catch (requestError) {
      const error = requestError as Error & { response?: { data?: { message?: string; title?: string }; status?: number }; config?: { url?: string } };
      console.error('API hata:', error);
      console.error('Status:', error.response?.status);
      console.error('Data:', error.response?.data);
      console.error('Url:', error.config?.url);
      setHandoffError(error.response?.data?.message || error.response?.data?.title || error.message || 'Handoff bilgileri kaydedilemedi.');
    } finally {
      setIsSavingHandoff(false);
    }
  }

  async function handleConfirmedSendToSales() {
    try {
      await onSendToSales(handoff);
      setConfirmOpen(false);
    } catch (requestError) {
      console.error('Satışa aktar hatası:', requestError);
    }
  }

  return (
    <div className="relative space-y-4 md:space-y-5">
      <div className="flex items-center gap-1.5 text-[11px] text-gray-400 dark:text-gray-600 flex-wrap">
        <button onClick={onBack} className="hover:text-gray-600 dark:hover:text-gray-400 cursor-pointer transition-colors">Satışa Yönlendirme</button>
        <span>/</span>
        <span className="text-gray-700 dark:text-gray-300 font-medium">Handoff Detay</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-violet-100 dark:bg-violet-900/40 rounded-xl flex items-center justify-center shrink-0">
            {isRemarket ? <Icon className="w-5 h-5 text-amber-500">{P.undo}</Icon> : <Icon className="text-violet-600 dark:text-violet-400 w-5 h-5">{P.send}</Icon>}
          </div>
          <div>
            <h1 className="text-[19px] font-bold text-gray-900 dark:text-gray-100 leading-tight">{handoff.co}</h1>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">{handoff.contact} · {isRemarket ? 'Mevcut Müşteri — Yeniden Teklif' : 'Talep Havuzundan'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={onBack} className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-[12px] font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <Icon>{P.back}</Icon> Geri Dön
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-800 rounded-xl p-4">
            <p className="text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-3">Talep Özeti</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              <div><p className="text-[10px] text-gray-400 dark:text-gray-600 uppercase tracking-wide mb-0.5">Firma</p><p className="text-[13px] font-semibold text-gray-900 dark:text-gray-100">{handoff.co}</p></div>
              <div><p className="text-[10px] text-gray-400 dark:text-gray-600 uppercase tracking-wide mb-0.5">Yetkili</p><p className="text-[13px] font-semibold text-gray-900 dark:text-gray-100">{handoff.contact}</p></div>
              <div><p className="text-[10px] text-gray-400 dark:text-gray-600 uppercase tracking-wide mb-0.5">Telefon</p><p className="text-[13px] font-semibold text-gray-900 dark:text-gray-100">{handoff.phone || '—'}</p></div>
              <div><p className="text-[10px] text-gray-400 dark:text-gray-600 uppercase tracking-wide mb-0.5">E-posta</p><p className="text-[13px] font-semibold text-gray-900 dark:text-gray-100">{handoff.email || '—'}</p></div>
              <div><p className="text-[10px] text-gray-400 dark:text-gray-600 uppercase tracking-wide mb-0.5">Ünvan</p><p className="text-[13px] font-semibold text-gray-900 dark:text-gray-100">{handoff.contactTitle || '—'}</p></div>
              {!isRemarket ? (
                <>
                  <div><p className="text-[10px] text-gray-400 dark:text-gray-600 uppercase tracking-wide mb-0.5">Kaynak</p><p className="text-[13px] text-gray-700 dark:text-gray-300">{handoff.source}</p></div>
                  <div><p className="text-[10px] text-gray-400 dark:text-gray-600 uppercase tracking-wide mb-0.5">Veri Durumu</p><Bdg color={handoff.datClr}>{handoff.dataStatus}</Bdg></div>
                  <div><p className="text-[10px] text-gray-400 dark:text-gray-600 uppercase tracking-wide mb-0.5">Öncelik</p><span className={`text-[12px] font-semibold ${priorityClass(handoff.prioClr)}`}>{handoff.priority}</span></div>
                </>
              ) : (
                <>
                  <div><p className="text-[10px] text-gray-400 dark:text-gray-600 uppercase tracking-wide mb-0.5">Son Hizmet</p><p className="text-[13px] text-gray-700 dark:text-gray-300">{handoff.lastSvc} · {handoff.lastDate}</p></div>
                  <div><p className="text-[10px] text-gray-400 dark:text-gray-600 uppercase tracking-wide mb-0.5">Son Tutar</p><p className="text-[13px] font-semibold text-gray-900 dark:text-gray-100">{handoff.lastAmount}</p></div>
                  <div><p className="text-[10px] text-gray-400 dark:text-gray-600 uppercase tracking-wide mb-0.5">AI Skoru</p><p className="text-[13px] font-bold text-amber-600 dark:text-amber-400">{handoff.aiScore}/100</p></div>
                </>
              )}
            </div>
            <div>
              <p className="text-[10px] text-gray-400 dark:text-gray-600 uppercase tracking-wide mb-1.5">İstenen / Önerilen Hizmetler</p>
              <div className="flex flex-wrap gap-1.5">
                {handoff.services.map((service) => (
                  <div key={service} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800/40 rounded-lg">
                    <span className="text-[12px] font-semibold text-indigo-700 dark:text-indigo-300">{service}</span>
                  </div>
                ))}
              </div>
            </div>
            {!isRemarket && handoff.note ? (
              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                <p className="text-[10px] text-gray-400 dark:text-gray-600 uppercase tracking-wide mb-1">Talep Notu</p>
                <p className="text-[12px] text-gray-700 dark:text-gray-300">{handoff.note}</p>
              </div>
            ) : null}
            {isRemarket && handoff.aiSugg ? (
              <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/15 border border-amber-200/60 dark:border-amber-800/30 rounded-lg flex items-start gap-2">
                <Icon className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5">{P.ai}</Icon>
                <p className="text-[11px] text-amber-700 dark:text-amber-300"><strong>AI Öneri:</strong> {handoff.aiSugg}</p>
              </div>
            ) : null}
          </div>

          <div className="bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-800 rounded-xl p-4">
            <p className="text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-3">Satış Ekibine Handoff Notu</p>
            <textarea rows={4} value={handoffNote} onChange={(event) => setHandoffNote(event.target.value)} placeholder="Satış temsilcisine aktarılacak bağlam notu... Müşteri beklentisi, kritik detaylar, öncelikli konular, dikkat edilmesi gerekenler." className="w-full px-3 py-2.5 text-[12px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0a0a0c] rounded-lg focus:outline-none focus:border-violet-500 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 resize-none mb-3" />
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-500 mb-1">Beklenen Teklif Tarihi</label>
                <input type="date" value={expectedOfferDate} onChange={(event) => setExpectedOfferDate(event.target.value)} className="w-full px-3 py-2 text-[12px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0a0a0c] rounded-lg focus:outline-none focus:border-violet-500 text-gray-900 dark:text-gray-100" />
              </div>
            </div>
            {handoffError ? <p className="text-[10px] font-medium text-rose-600 dark:text-rose-400 mt-2">{handoffError}</p> : null}
            <button onClick={() => void handleSaveHandoff()} disabled={isSavingHandoff} className="mt-3 px-3 py-1.5 text-[11px] font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed">{isSavingHandoff ? 'Kaydediliyor...' : 'Kaydet'}</button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-800 rounded-xl p-4">
            <p className="text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-3">Aksiyon</p>
            <div className="space-y-2">
              <button onClick={() => setConfirmOpen(true)} disabled={isRemarket || handoff.isSentToSales || isSending} className="w-full flex items-center justify-center gap-2 py-2.5 text-[12px] font-bold text-white bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"><Icon className="text-white w-3.5 h-3.5">{P.send}</Icon> {isSending ? 'Aktarılıyor...' : handoff.isSentToSales ? 'Satışa Aktarıldı' : 'Satışa Aktar'}</button>
              <button onClick={onBack} className="w-full flex items-center justify-center gap-2 py-2 text-[11px] font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/40 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-colors">
                <Icon>{P.undo}</Icon>
                Geri Dön / İptal
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-900/10 dark:to-[#17171a] border border-violet-200 dark:border-violet-800/40 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Icon className="w-4 h-4 text-violet-600 dark:text-violet-400">{P.ai}</Icon>
              <p className="text-[11px] font-bold text-gray-900 dark:text-gray-100">Aktarımdan Sonra</p>
            </div>
            <div className="space-y-2 text-[11px] text-gray-600 dark:text-gray-400">
              <div className="flex items-start gap-2"><div className="w-4 h-4 rounded-full bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center text-[8px] font-bold text-violet-600 dark:text-violet-400 shrink-0 mt-0.5">1</div><p>Satış ekibi handoff notunu görür ve müşteri ile iletişime geçer</p></div>
              <div className="flex items-start gap-2"><div className="w-4 h-4 rounded-full bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center text-[8px] font-bold text-violet-600 dark:text-violet-400 shrink-0 mt-0.5">2</div><p>AI API üzerinden müşteriye özel teklif hazırlanır</p></div>
              <div className="flex items-start gap-2"><div className="w-4 h-4 rounded-full bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center text-[8px] font-bold text-violet-600 dark:text-violet-400 shrink-0 mt-0.5">3</div><p>Müşteriye URL ile teklif & sunum gönderilir</p></div>
              <div className="flex items-start gap-2"><div className="w-4 h-4 rounded-full bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center text-[8px] font-bold text-violet-600 dark:text-violet-400 shrink-0 mt-0.5">4</div><p>Onay → Sözleşme Takibi'ne geçer</p></div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-800 rounded-xl p-4">
            <p className="text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-2">Satış Durumu</p>
            <select className="w-full px-3 py-2 text-[12px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0a0a0c] rounded-lg focus:outline-none focus:border-violet-500 text-gray-900 dark:text-gray-100 mb-2" defaultValue={handoff.salesStatus || 'Bekliyor'}>
              <option>Bekliyor</option>
              <option>Satışta</option>
              <option>Teklif Gönderildi</option>
              <option>Revize Gerekli</option>
              <option>Kazanıldı</option>
              <option>Kaybedildi</option>
            </select>
            <button className="w-full px-3 py-1.5 text-[11px] font-semibold text-white bg-gray-900 dark:bg-gray-100 dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 rounded-lg transition-colors">Güncelle</button>
          </div>
        </div>
      </div>
      {confirmOpen ? (
        <div className="fixed inset-0 z-[9999] flex items-start justify-center bg-black/35 px-4 pt-[90px] pb-10">
          <div className="w-full max-w-md rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#17171a] shadow-2xl">
            <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-gray-200 dark:border-gray-800">
              <div>
                <h3 className="text-[14px] font-bold text-gray-900 dark:text-gray-100">Satışa aktar?</h3>
                <p className="mt-1 text-[12px] leading-relaxed text-gray-500 dark:text-gray-400">Bu talep satış panelindeki talep havuzuna aktarılacaktır. Emin misiniz?</p>
              </div>
              <button onClick={() => setConfirmOpen(false)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <Icon className="w-4 h-4 text-gray-500"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Icon>
              </button>
            </div>
            <div className="flex items-center justify-end gap-2 px-5 py-4">
              <button onClick={() => setConfirmOpen(false)} className="px-3 py-2 text-[12px] font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#0a0a0c] border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">Vazgeç</button>
              <button onClick={() => void handleConfirmedSendToSales()} disabled={isSending} className="px-3 py-2 text-[12px] font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed">{isSending ? 'Aktarılıyor...' : 'Evet, Satışa Aktar'}</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
