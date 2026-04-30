import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSalesPanelRequestById, getSalesPanelRequests, type SalesPanelRequest } from '../../../services/salesPanelRequestApi';

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
  srcClr: ColorName;
  services: string[];
  note: string;
  date: string;
  time: string;
  status: string;
  stClr: ColorName;
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
};

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

const FILTERS = ['T\u00fcm\u00fc', 'Yeni', 'Devam Ediyor', 'Tamamland\u0131', '\u0130ncelemede', 'Veri Eksik', 'Sat\u0131\u015fa Haz\u0131r', 'Aktar\u0131ld\u0131', 'Geri D\u00f6nd\u00fc'];
const STATUS_FLOW = ['Yeni', 'Devam Ediyor', 'Tamamland\u0131', '\u0130ncelemede', 'Veri Eksik', 'Sat\u0131\u015fa Haz\u0131r', 'Aktar\u0131ld\u0131'];

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

function FileIcon({ className = 'w-3.5 h-3.5 shrink-0' }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </Icon>
  );
}

function EyeIcon() {
  return (
    <Icon>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
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

function SendIcon({ className = 'w-3.5 h-3.5 shrink-0' }: { className?: string }) {
  return (
    <Icon className={className}>
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
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

function GlobeIcon({ className = 'w-3 h-3 text-violet-500' }: { className?: string }) {
  return (
    <Icon className={className}>
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </Icon>
  );
}

function UserIcon({ className = 'w-3 h-3 text-gray-400' }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </Icon>
  );
}

function FlameIcon({ className = 'w-3 h-3 text-rose-500 fill-rose-500 shrink-0' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  );
}

function SearchIcon({ className = 'absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400' }: { className?: string }) {
  return (
    <Icon className={className}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </Icon>
  );
}

function ChevronDownIcon() {
  return (
    <Icon className="w-3 h-3">
      <polyline points="6 9 12 15 18 9" />
    </Icon>
  );
}

function priorityTextClass(color: ColorName) {
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

function formatDateParts(value: string | null | undefined) {
  if (!value) return { date: '—', time: '—' };
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return { date: value, time: '—' };

  return {
    date: new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' }).format(date),
    time: new Intl.DateTimeFormat('tr-TR', { hour: '2-digit', minute: '2-digit' }).format(date),
  };
}

function statusColor(status: string): ColorName {
  if (status === 'Yeni') return 'sky';
  if (status === 'Devam Ediyor' || status === 'İncelemede' || status === 'Satışta') return 'indigo';
  if (status === 'Satışa Aktarıldı' || status === 'Satışa Hazır' || status === 'Tamamlandı') return 'emerald';
  if (status === 'Veri Eksik') return 'amber';
  if (status === 'Geri Döndü') return 'rose';
  return 'gray';
}

function priorityColor(priority: string): ColorName {
  if (priority === 'Yüksek') return 'rose';
  if (priority === 'Orta') return 'amber';
  if (priority === 'Düşük') return 'gray';
  return 'violet';
}

function dataStatusColor(status: string): ColorName {
  if (status === 'Aktarıldı' || status === 'Satışa Hazır' || status === 'Tamamlandı') return 'emerald';
  if (status === 'Veri Eksik' || status === 'İncelemede') return 'amber';
  return 'indigo';
}

function mapSalesPanelRequestToLead(request: SalesPanelRequest): Lead {
  const transferred = formatDateParts(request.transferredAt);
  const status = text(request.salesStatus, 'Yeni');
  const requestStatus = text(request.requestStatus, 'Aktarıldı');
  const priority = text(request.priority, 'Orta');

  return {
    id: request.id,
    requestCode: text(request.requestCode, `REQ-${request.sourceMarketingRequestId}`),
    title: text(request.requestTitle),
    customerId: request.customerId ?? null,
    co: text(request.customerBrandName, 'Müşteri belirtilmedi'),
    contact: text(request.customerContactName ?? request.contactName),
    contactTitle: text(request.customerContactTitle),
    phone: text(request.customerContactPhone ?? request.contactPhone),
    email: text(request.customerContactEmail ?? request.contactEmail),
    source: text(request.requestSource),
    srcClr: 'violet',
    services: Array.isArray(request.services) ? request.services : [],
    note: text(request.notes ?? request.description),
    date: transferred.date,
    time: transferred.time,
    status,
    stClr: statusColor(status),
    hot: priority === 'Yüksek',
    registered: Boolean(request.customerId),
    musNo: text(request.requestCode, `REQ-${request.sourceMarketingRequestId}`),
    dataStatus: requestStatus,
    datClr: dataStatusColor(requestStatus),
    priority,
    prioClr: priorityColor(priority),
    department: text(request.department),
    assignedTo: text(request.assignedTo),
    createdBy: text(request.transferredByUserName),
  };
}

function SourceIcon({ source, className }: { source: string; className?: string }) {
  return source === 'Web Sitesi Formu' ? <GlobeIcon className={className || 'w-3 h-3 text-violet-500'} /> : <UserIcon className={className || 'w-3 h-3 text-gray-400'} />;
}

function LeadTableRow({ lead, onOpen }: { lead: Lead; onOpen: (lead: Lead) => void }) {
  return (
    <tr className="gr border-b border-gray-100 dark:border-gray-600/50 group cursor-pointer" onClick={() => onOpen(lead)}>
      <td className="px-3 py-3">
        <div className="flex items-center gap-1.5">
          <div>
            <div className="flex items-center gap-1">
              <span className="text-[12px] font-semibold text-gray-900 dark:text-gray-100 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">{lead.co}</span>
              {lead.hot ? <FlameIcon /> : null}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] text-gray-400 dark:text-gray-600">{lead.contact}</span>
              {lead.registered ? <Bdg txt="Kayıtlı" c="emerald" /> : <Bdg txt="Yeni" c="sky" />}
            </div>
          </div>
        </div>
      </td>
      <td className="px-3 py-3">
        <div className="flex flex-wrap gap-1">{lead.services.slice(0, 2).map((service) => <Bdg key={service} txt={service} c="indigo" />)}{lead.services.length > 2 ? <span className="text-[10px] text-gray-400 dark:text-gray-600 self-center">+{lead.services.length - 2}</span> : null}</div>
      </td>
      <td className="px-3 py-3">
        <div className="flex items-center gap-1">
          <SourceIcon source={lead.source} />
          <span className="text-[10px] text-gray-600 dark:text-gray-400">{lead.source}</span>
        </div>
      </td>
      <td className="px-3 py-3"><Bdg txt={lead.status} c={lead.stClr} /></td>
      <td className="px-3 py-3"><Bdg txt={lead.dataStatus} c={lead.datClr} /></td>
      <td className="px-3 py-3"><span className={`text-[10px] font-medium ${priorityTextClass(lead.prioClr)}`}>{lead.priority}</span></td>
      <td className="px-3 py-3">
        <div className="text-[10px] text-gray-500 dark:text-gray-400">{lead.date}</div>
        <div className="text-[10px] text-gray-400 dark:text-gray-600">{lead.time}</div>
      </td>
      <td className="px-3 py-3">
        <div className="flex items-center justify-end gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={(event) => { event.stopPropagation(); onOpen(lead); }} title="Detay" className="p-1.5 rounded-md text-violet-500 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors"><EyeIcon /></button>
        </div>
      </td>
    </tr>
  );
}

function LeadMobileCard({ lead, onOpen }: { lead: Lead; onOpen: (lead: Lead) => void }) {
  return (
    <div className="p-3 border-b border-gray-100 dark:border-gray-600/50 hover:bg-gray-50/70 dark:hover:bg-gray-700/40 transition-colors" onClick={() => onOpen(lead)}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <div className="flex items-center gap-1">
            <span className="text-[13px] font-semibold text-gray-900 dark:text-gray-100">{lead.co}</span>
            {lead.hot ? <FlameIcon className="w-3 h-3 text-rose-500 fill-rose-500" /> : null}
          </div>
          <p className="text-[10px] text-gray-400 dark:text-gray-600">{lead.contact} · {lead.date} {lead.time}</p>
        </div>
        <Bdg txt={lead.status} c={lead.stClr} />
      </div>
      <div className="flex flex-wrap gap-1 mb-2">{lead.services.slice(0, 3).map((service) => <Bdg key={service} txt={service} c="indigo" />)}</div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bdg txt={lead.dataStatus} c={lead.datClr} />
          {lead.registered ? <Bdg txt="Kayıtlı" c="emerald" /> : <Bdg txt="Yeni" c="sky" />}
        </div>
        <div className="flex items-center gap-1">
          <EyeIcon />
        </div>
      </div>
    </div>
  );
}

function LeadDetail({ lead, onBack, onNavigateDataControl }: { lead: Lead; onBack: () => void; onNavigateDataControl: () => void }) {
  const curStepIdx = STATUS_FLOW.indexOf(lead.status);

  return (
    <div className="relative min-h-[calc(100vh-120px)] space-y-4 md:space-y-5">
      <div className="flex items-center gap-1.5 text-[11px] text-gray-400 dark:text-gray-600 flex-wrap">
        <button onClick={onBack} className="hover:text-gray-600 dark:hover:text-gray-400 cursor-pointer transition-colors">Talep Havuzu</button>
        <span>/</span>
        <span className="text-gray-700 dark:text-gray-300 font-medium">Talep Detayı</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-violet-100 dark:bg-violet-900/40 rounded-xl flex items-center justify-center shrink-0 relative">
            <FileIcon className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            {lead.hot ? <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-white dark:border-[#17171a]" /> : null}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[19px] font-bold text-gray-900 dark:text-gray-100 leading-tight">{lead.co}</h1>
              {lead.hot ? <span className="text-[10px] font-bold px-2 py-0.5 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 rounded-full flex items-center gap-1"><FlameIcon className="w-2.5 h-2.5 fill-current" /> Sıcak Lead</span> : null}
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">{lead.contact} · {lead.date} {lead.time} · {lead.source}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {lead.registered ? (
            <button onClick={onNavigateDataControl} className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-[12px] font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"><EyeIcon /> Müşteri Kartı</button>
          ) : (
            <button disabled className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 text-[12px] font-medium rounded-lg cursor-not-allowed"><PlusIcon /> Müşteri Bulunamadı</button>
          )}
          <button onClick={onBack} className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-[12px] font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <Icon><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></Icon> Geri Dön
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-4">
        <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wide mb-3">Talep Süreci</p>
        <div className="flex items-center gap-0">
          {STATUS_FLOW.map((status, index) => {
            const done = index < curStepIdx;
            const active = index === curStepIdx;
            return (
              <div key={status} className="flex items-center flex-1 min-w-0">
                <div className="flex flex-col items-center min-w-0 flex-1">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold mb-1 shrink-0 ${done ? 'bg-emerald-500 text-white' : active ? 'bg-violet-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600'}`}>{done ? '✓' : index + 1}</div>
                  <span className={`text-[9px] font-medium text-center leading-tight ${active ? 'text-violet-600 dark:text-violet-400' : done ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-600'} hidden sm:block`}>{status}</span>
                </div>
                {index < STATUS_FLOW.length - 1 ? <div className={`h-0.5 flex-1 mx-1 ${index < curStepIdx ? 'bg-emerald-400' : 'bg-gray-200 dark:bg-gray-800'}`} /> : null}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-4">
            <p className="text-[11px] font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide mb-3">İstenen Hizmetler</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {lead.services.map((service) => <div key={service} className="flex items-center gap-2 px-3 py-2 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800/40 rounded-lg"><span className="text-[12px] font-semibold text-indigo-700 dark:text-indigo-300">{service}</span></div>)}
            </div>
            <div className="border-t border-gray-100 dark:border-gray-600/50 pt-3">
              <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wide mb-1.5">Talep Notu</p>
              <p className="text-[12px] text-gray-700 dark:text-gray-300 leading-relaxed">{lead.note}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-4">
            <p className="text-[11px] font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide mb-3">İletişim Bilgileri</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><p className="text-[10px] text-gray-400 dark:text-gray-600 uppercase tracking-wide mb-1">Yetkili Adı</p><p className="text-[13px] font-semibold text-gray-900 dark:text-gray-100">{lead.contact}</p></div>
              <div><p className="text-[10px] text-gray-400 dark:text-gray-600 uppercase tracking-wide mb-1">Ünvan</p><p className="text-[13px] font-semibold text-gray-900 dark:text-gray-100">{lead.contactTitle}</p></div>
              <div><p className="text-[10px] text-gray-400 dark:text-gray-600 uppercase tracking-wide mb-1">Telefon</p><p className="text-[13px] font-semibold text-gray-900 dark:text-gray-100">{lead.phone}</p></div>
              <div><p className="text-[10px] text-gray-400 dark:text-gray-600 uppercase tracking-wide mb-1">E-posta</p><p className="text-[13px] font-semibold text-violet-600 dark:text-violet-400">{lead.email}</p></div>
              <div><p className="text-[10px] text-gray-400 dark:text-gray-600 uppercase tracking-wide mb-1">Kaynak</p>
                <div className="flex items-center gap-1.5">
                  <SourceIcon source={lead.source} className={lead.source === 'Web Sitesi Formu' ? 'w-3.5 h-3.5 text-violet-500' : 'w-3.5 h-3.5 text-gray-400'} />
                  <p className="text-[13px] font-semibold text-gray-900 dark:text-gray-100">{lead.source}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-4">
            <p className="text-[11px] font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide mb-3">Dahili Not</p>
            <textarea rows={3} placeholder="Bu talep hakkında not ekle..." className="w-full px-3 py-2 text-[12px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#23242c] rounded-lg focus:outline-none focus:border-violet-500 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 resize-none mb-2" />
            <button className="px-3 py-1.5 text-[11px] font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors">Notu Kaydet</button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-4">
            <p className="text-[11px] font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide mb-3">Talep Özeti</p>
            <div className="space-y-3">
              <div><p className="text-[10px] text-gray-400 dark:text-gray-600 uppercase tracking-wide mb-0.5">Talep Durumu</p><Bdg txt={lead.status} c={lead.stClr} /></div>
              <div><p className="text-[10px] text-gray-400 dark:text-gray-600 uppercase tracking-wide mb-0.5">Veri Durumu</p><Bdg txt={lead.dataStatus} c={lead.datClr} /></div>
              <div><p className="text-[10px] text-gray-400 dark:text-gray-600 uppercase tracking-wide mb-0.5">Öncelik</p><span className={`text-[12px] font-semibold ${priorityTextClass(lead.prioClr)}`}>{lead.priority}</span></div>
              <div><p className="text-[10px] text-gray-400 dark:text-gray-600 uppercase tracking-wide mb-0.5">Müşteri Kaydı</p>{lead.registered ? <><Bdg txt="Kayıtlı" c="emerald" /> <span className="text-[10px] font-mono text-gray-400 dark:text-gray-600 ml-1">{lead.musNo || ''}</span></> : <Bdg txt="Yeni Müşteri" c="sky" />}</div>
              <div><p className="text-[10px] text-gray-400 dark:text-gray-600 uppercase tracking-wide mb-0.5">Talep Tarihi</p><p className="text-[12px] font-medium text-gray-700 dark:text-gray-300">{lead.date} {lead.time}</p></div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-4">
            <p className="text-[11px] font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide mb-3">Aksiyonlar</p>
            <div className="space-y-2">
              {lead.registered ? (
                <button onClick={onNavigateDataControl} className="w-full flex items-center gap-2 px-3 py-2 text-[12px] font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#161720] border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"><EyeIcon /> Müşteri Kartını Aç</button>
              ) : (
                <button disabled className="w-full flex items-center gap-2 px-3 py-2 text-[12px] font-medium text-gray-400 dark:text-gray-500 bg-white dark:bg-[#161720] border border-gray-200 dark:border-gray-700 rounded-lg cursor-not-allowed"><PlusIcon /> Müşteri Bulunamadı</button>
              )}
              <button className="w-full flex items-center gap-2 px-3 py-2 text-[12px] font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/40 hover:bg-rose-100 dark:hover:bg-rose-900/30 rounded-lg transition-colors">
                <Icon><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-4.01" /></Icon> Geri Döndür
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-4">
            <p className="text-[11px] font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide mb-2">Durum Güncelle</p>
            <select defaultValue={lead.status} className="w-full px-3 py-2 text-[12px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#23242c] rounded-lg focus:outline-none focus:border-violet-500 text-gray-900 dark:text-gray-100 mb-2">
              {STATUS_FLOW.map((status) => <option key={status}>{status}</option>)}
              <option>Geri Döndü</option>
            </select>
            <button className="w-full px-3 py-1.5 text-[11px] font-semibold text-white bg-gray-900 dark:bg-gray-100 dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 rounded-lg transition-colors">Güncelle</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TalepHavuzu() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('T\u00fcm\u00fc');
  const [search, setSearch] = useState('');
  const [requests, setRequests] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  async function loadRequests() {
    setLoading(true);
    setError('');

    try {
      const data = await getSalesPanelRequests();
      setRequests(Array.isArray(data) ? data.map(mapSalesPanelRequestToLead) : []);
    } catch (requestError) {
      const error = requestError as Error & { response?: { data?: { message?: string; title?: string } | unknown; status?: number }; config?: { url?: string } };
      const data = error.response?.data;
      const responseMessage = data && typeof data === 'object'
        ? (data as { message?: string; title?: string }).message || (data as { message?: string; title?: string }).title
        : undefined;
      const serializedData = data ? JSON.stringify(data) : undefined;

      console.error('SATIŞ TALEP HAVUZU HATASI:', error);
      console.error('URL:', error.config?.url);
      console.error('STATUS:', error.response?.status);
      console.error('DATA:', error.response?.data);
      setRequests([]);
      setError(responseMessage || serializedData || error.message || 'İşlem tamamlanamadı');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadRequests();
  }, []);

  const visibleLeads = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase('tr-TR');

    return requests.filter((lead) => {
      const matchesFilter = filter === 'T\u00fcm\u00fc'
        || lead.status === filter
        || (filter === 'Devam Ediyor' && lead.status === '\u0130ncelemede')
        || (filter === 'Tamamland\u0131' && lead.status === 'Aktar\u0131ld\u0131');
      const matchesSearch = !normalizedSearch || [lead.requestCode, lead.title, lead.co, lead.contact, lead.email, lead.phone, lead.source, lead.priority, lead.department, lead.assignedTo, lead.services.join(' ')].some((item) => item.toLocaleLowerCase('tr-TR').includes(normalizedSearch));
      return matchesFilter && matchesSearch;
    });
  }, [filter, requests, search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, pageSize, search]);

  const totalPages = Math.max(1, Math.ceil(visibleLeads.length / pageSize));
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const pagedLeads = visibleLeads.slice(startIndex, endIndex);

  useEffect(() => {
    if (currentPage !== safeCurrentPage) {
      setCurrentPage(safeCurrentPage);
    }
  }, [currentPage, safeCurrentPage]);

  const navigateDataControl = () => navigate('/dashboards/sales/customer-data-control');

  async function openLead(lead: Lead) {
    setDetailError('');
    setDetailLoading(true);
    setSelectedLead(null);

    try {
      const detail = await getSalesPanelRequestById(lead.id);
      setSelectedLead(mapSalesPanelRequestToLead(detail));
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

  const summary = [
    { l: 'Toplam Talep', v: requests.length, c: 'violet' as ColorName, filter: 'T\u00fcm\u00fc' },
    { l: 'Yeni Talepler', v: requests.filter((lead) => lead.status === 'Yeni').length, c: 'sky' as ColorName, filter: 'Yeni' },
    { l: 'Devam Ediyor', v: requests.filter((lead) => lead.status === 'Devam Ediyor' || lead.status === '\u0130ncelemede').length, c: 'indigo' as ColorName, filter: 'Devam Ediyor' },
    { l: 'Tamamlandi', v: requests.filter((lead) => lead.status === 'Tamamland\u0131' || lead.status === 'Aktar\u0131ld\u0131').length, c: 'emerald' as ColorName, filter: 'Tamamland\u0131' },
    { l: 'Yuksek Oncelik', v: requests.filter((lead) => lead.priority === 'Y\u00fcksek').length, c: 'rose' as ColorName, filter: 'T\u00fcm\u00fc' },
  ];
  const hotLeads = requests.filter((lead) => lead.hot).length;

  if (detailLoading || detailError || selectedLead) {
    if (detailLoading) {
      return <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl px-4 py-8 text-center text-[12px] font-medium text-gray-500 dark:text-gray-400">Talep detayi yukleniyor...</div>;
    }

    if (detailError) {
      return (
        <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-5">
          <p className="text-sm font-semibold text-rose-600 dark:text-rose-400 mb-4">{detailError}</p>
          <button onClick={() => setDetailError('')} className="px-4 py-2 text-sm bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2 font-medium text-gray-700 dark:text-gray-300">
            <Icon className="w-4 h-4"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></Icon>
            <span>Geri Don</span>
          </button>
        </div>
      );
    }

    if (selectedLead) {
      return <LeadDetail lead={selectedLead} onBack={() => setSelectedLead(null)} onNavigateDataControl={navigateDataControl} />;
    }
  }

  return (
    <div className="relative min-h-[calc(100vh-120px)]">
      <div className="space-y-4 md:space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-violet-100 dark:bg-violet-900/40 rounded-xl flex items-center justify-center shrink-0">
              <FileIcon className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <h1 className="text-[19px] font-bold text-gray-900 dark:text-gray-100 leading-tight">Talep Havuzu</h1>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">CustomerRequests verileri ile satis talep listesi</p>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-900/15 dark:to-indigo-900/10 border border-violet-200 dark:border-violet-800/40 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center shrink-0">
              <GlobeIcon className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100">Talep Havuzu Database Entegrasyonu</p>
                <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800/40 rounded-full"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /><span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">Aktif</span></div>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">Liste, Pazarlama Talep Havuzu ile ayni CustomerRequests kaynagindan gelir.</p>
              <div className="flex flex-wrap gap-3 mt-2 text-[11px] text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-1"><Icon className="w-3 h-3"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></Icon> Son talep: <span className="font-semibold text-violet-600 dark:text-violet-400">{requests[0]?.date ?? '-'}</span></span>
                <span className="flex items-center gap-1"><FileIcon className="w-3 h-3" /> Toplam: <span className="font-semibold">{requests.length} talep</span></span>
              </div>
            </div>
          </div>
        </div>

        {hotLeads > 0 ? (
          <div className="flex items-start gap-3 p-3 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/40 rounded-xl">
            <FlameIcon className="w-4 h-4 text-rose-500 fill-rose-500 shrink-0 mt-0.5" />
            <div className="flex-1"><p className="text-[12px] font-semibold text-rose-700 dark:text-rose-300">{hotLeads} sicak lead</p><p className="text-[10px] text-rose-600 dark:text-rose-400 mt-0.5">Yuksek oncelikli talepler hizli takip bekliyor.</p></div>
          </div>
        ) : null}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {summary.map((item) => {
            const cm = CM[item.c] || CM.gray;
            return (
              <button key={item.l} onClick={() => setFilter(item.filter)} className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl px-3 py-2.5 hover:shadow-sm dark:hover:border-gray-700 transition-all cursor-pointer text-left">
                <p className={'text-[19px] font-bold ' + cm.t + ' leading-none mb-0.5'}>{item.v}</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">{item.l}</p>
              </button>
            );
          })}
        </div>

        <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-4">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 max-w-md">
                <SearchIcon />
                <input value={search} onChange={(event) => setSearch(event.target.value)} type="text" placeholder="Firma / yetkili / e-posta / telefon ara..." className="w-full pl-9 pr-4 py-2 text-[12px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#23242c] rounded-lg focus:outline-none focus:border-violet-500 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600" />
              </div>
              <div className="flex flex-wrap gap-2">
                <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"><GlobeIcon className="w-3 h-3" /> Kaynak<ChevronDownIcon /></button>
                <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"><Icon className="w-3 h-3"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></Icon> Hizmet<ChevronDownIcon /></button>
                <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"><Icon className="w-3 h-3"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></Icon> Tarih<ChevronDownIcon /></button>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5" id="leadFilterBtns">
              {FILTERS.map((item) => (
                <button key={item} onClick={() => setFilter(item)} className={'lf-btn px-2.5 py-1 text-[11px] font-medium rounded-md transition-all ' + (filter === item ? 'bg-violet-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700')}>{item}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
          <div className="hidden md:block">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-600/50 bg-gray-50/70 dark:bg-[#161720]/50">
                  <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide">Firma / Yetkili</th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide">Istenen Hizmetler</th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide">Kaynak</th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide">Durum</th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide">Departman</th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide">Oncelik</th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide">Tarih / Saat</th>
                  <th className="px-3 py-2.5 text-right text-[10px] font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide">Islem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700/40">
                {loading ? <tr><td colSpan={8} className="px-3 py-8 text-center text-[12px] text-gray-500 dark:text-gray-400">Talepler yukleniyor...</td></tr> : null}
                {!loading && error ? <tr><td colSpan={8} className="px-3 py-8 text-center text-[12px] text-rose-600 dark:text-rose-400">{error}</td></tr> : null}
                {!loading && !error && pagedLeads.length === 0 ? <tr><td colSpan={8} className="px-3 py-8 text-center text-[12px] text-gray-500 dark:text-gray-400">Kayıt bulunamadı.</td></tr> : null}
                {!loading && !error ? pagedLeads.map((lead) => <LeadTableRow key={lead.id} lead={lead} onOpen={openLead} />) : null}
              </tbody>
            </table>
          </div>
          <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-700/40">
            {loading ? <div className="p-4 text-center text-[12px] text-gray-500 dark:text-gray-400">Talepler yukleniyor...</div> : null}
            {!loading && error ? <div className="p-4 text-center text-[12px] text-rose-600 dark:text-rose-400">{error}</div> : null}
            {!loading && !error && pagedLeads.length === 0 ? <div className="p-4 text-center text-[12px] text-gray-500 dark:text-gray-400">Kayıt bulunamadı.</div> : null}
            {!loading && !error ? pagedLeads.map((lead) => <LeadMobileCard key={lead.id} lead={lead} onOpen={openLead} />) : null}
          </div>
          <div className="px-4 py-2.5 border-t border-gray-100 dark:border-gray-600/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-gray-50/50 dark:bg-[#161720]/30">
            <span className="text-[11px] text-gray-500 dark:text-gray-500">{visibleLeads.length} talep ? toplam {requests.length} kayit</span>
            <div className="flex items-center gap-2 flex-wrap">
              <select value={pageSize} onChange={(event) => setPageSize(Number(event.target.value))} className="px-2.5 py-1 text-[11px] font-medium border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e1f26] rounded-md text-gray-600 dark:text-gray-400 focus:outline-none focus:border-violet-500">
                <option value={10}>10'lu goster</option>
                <option value={50}>50'li goster</option>
              </select>
              <button disabled={safeCurrentPage === 1} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} className="px-2.5 py-1 text-[11px] font-medium border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 disabled:opacity-40 disabled:cursor-not-allowed">Onceki</button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button key={page} onClick={() => setCurrentPage(page)} className={'px-2.5 py-1 text-[11px] font-bold rounded-md ' + (safeCurrentPage === page ? 'bg-violet-600 text-white' : 'border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800')}>{page}</button>
              ))}
              <button disabled={safeCurrentPage === totalPages} onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} className="px-2.5 py-1 text-[11px] font-medium border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 disabled:opacity-40 disabled:cursor-not-allowed">Sonraki</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
