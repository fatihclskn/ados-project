import { type ReactNode, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type ColorName = 'gray' | 'sky' | 'violet' | 'emerald' | 'teal' | 'rose' | 'amber' | 'indigo';
type ProposalStatus = 'sent' | 'opened' | 'reviewing' | 'accepted' | 'converted' | 'rejected' | 'expired';
type ProposalFilter = 'all' | 'active' | 'accepted' | 'converted' | 'rejected' | 'expired';
type TrackingEventType = 'sent' | 'opened' | 'viewed' | 'accepted' | 'converted' | 'rejected' | 'expired' | 'reminder1' | 'reminder2' | 'expire';

type TrackingEvent = {
  type: TrackingEventType;
  t?: string;
  title: string;
  desc: string;
  time?: string;
  status: 'done' | 'pending';
};

type Proposal = {
  id: string;
  customer: string;
  contact: string;
  segment: string;
  services: string[];
  monthlyTotal: number;
  oneTimeTotal: number;
  year1Total: number;
  sentAt: string;
  link: string;
  channels: string[];
  status: ProposalStatus;
  expiresAt: string;
  trackingEvents: TrackingEvent[];
  serviceDiscounts?: Record<string, number>;
  globalDiscount?: number;
  servicePrices?: Record<string, { oneTime: number; monthly: number }>;
};

type OfferService = {
  id: string;
  name: string;
  icon: ReactNode;
  type: 'standard' | 'premium';
};

const DAY = 24 * 60 * 60 * 1000;

const CM: Record<ColorName, { bg: string; t: string }> = {
  gray: { bg: 'bg-gray-50 dark:bg-gray-500/10', t: 'text-gray-700 dark:text-gray-300' },
  sky: { bg: 'bg-sky-50 dark:bg-sky-500/10', t: 'text-sky-700 dark:text-sky-300' },
  violet: { bg: 'bg-violet-50 dark:bg-violet-500/10', t: 'text-violet-700 dark:text-violet-300' },
  emerald: { bg: 'bg-emerald-50 dark:bg-emerald-500/10', t: 'text-emerald-700 dark:text-emerald-300' },
  teal: { bg: 'bg-teal-50 dark:bg-teal-500/10', t: 'text-teal-700 dark:text-teal-300' },
  rose: { bg: 'bg-rose-50 dark:bg-rose-500/10', t: 'text-rose-700 dark:text-rose-300' },
  amber: { bg: 'bg-amber-50 dark:bg-amber-500/10', t: 'text-amber-700 dark:text-amber-300' },
  indigo: { bg: 'bg-indigo-50 dark:bg-indigo-500/10', t: 'text-indigo-700 dark:text-indigo-300' },
};

const BORDER_ACTIVE: Record<ColorName, string> = {
  gray: 'border-gray-300 dark:border-gray-500/40',
  sky: 'border-sky-300 dark:border-sky-500/40',
  violet: 'border-violet-300 dark:border-violet-500/40',
  emerald: 'border-emerald-300 dark:border-emerald-500/40',
  teal: 'border-teal-300 dark:border-teal-500/40',
  rose: 'border-rose-300 dark:border-rose-500/40',
  amber: 'border-amber-300 dark:border-amber-500/40',
  indigo: 'border-indigo-300 dark:border-indigo-500/40',
};

const SERVICE_COSTS: Record<string, { costRatio: number; minMargin: number; name: string; costLabel: string }> = {
  web: { costRatio: 0.42, minMargin: 25, name: 'Web Sitesi', costLabel: 'Tasarım + geliştirme + altyapı' },
  seo: { costRatio: 0.35, minMargin: 25, name: 'SEO Yönetim', costLabel: 'Uzman saatleri + araç lisansları' },
  'google-ads': { costRatio: 0.3, minMargin: 30, name: 'Google Ads', costLabel: 'Uzman yönetimi + raporlama' },
  'social-media': { costRatio: 0.45, minMargin: 20, name: 'Sosyal Medya', costLabel: 'Tasarım + içerik + moderasyon' },
  'social-ads': { costRatio: 0.32, minMargin: 28, name: 'Sosyal Reklam', costLabel: 'Uzman yönetimi + creative' },
  production: { costRatio: 0.55, minMargin: 20, name: 'Prodüksiyon', costLabel: 'Ekipman + post-prodüksiyon + ses' },
  domain: { costRatio: 0.75, minMargin: 8, name: 'Domain', costLabel: 'Registrar ücretleri' },
  hosting: { costRatio: 0.5, minMargin: 15, name: 'Hosting', costLabel: 'Sunucu + yönetim + SLA' },
  trademark: { costRatio: 0.48, minMargin: 22, name: 'Marka Tescili', costLabel: 'Başvuru + vekillik + izleme' },
  premium360: { costRatio: 0.48, minMargin: 30, name: 'ADOS Premium 360', costLabel: 'Dedicated team + AI tools' },
};

const OFFER_SERVICES: OfferService[] = [
  { id: 'web', name: 'Web Sitesi', icon: <><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></>, type: 'standard' },
  { id: 'seo', name: 'SEO', icon: <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></>, type: 'standard' },
  { id: 'google-ads', name: 'Google Ads', icon: <><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></>, type: 'standard' },
  { id: 'social-media', name: 'Sosyal Medya Yönetimi', icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>, type: 'standard' },
  { id: 'social-ads', name: 'Sosyal Medya Reklam Yönetimi', icon: <><path d="M3 11l18-5v12L3 14v-3z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" /></>, type: 'standard' },
  { id: 'production', name: 'Prodüksiyon & Fotoğraf', icon: <><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></>, type: 'standard' },
  { id: 'domain', name: 'Domain', icon: <><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /></>, type: 'standard' },
  { id: 'hosting', name: 'Hosting & Sunucu', icon: <><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /></>, type: 'standard' },
  { id: 'trademark', name: 'Marka Tescili', icon: <><circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></>, type: 'standard' },
  { id: 'premium360', name: 'ADOS Premium 360', icon: <><path d="M2 18l7-14 7 14-7-3z" /><path d="M22 18l-7-14-7 14 7-3z" /><line x1="9" y1="15" x2="15" y2="15" /></>, type: 'premium' },
];

const INITIAL_PROPOSALS: Proposal[] = [
  { id: 'TKLF-2026-4821', customer: 'Deha Teknoloji A.Ş.', contact: 'Mehmet Yılmaz', segment: 'Kurumsal', services: ['web', 'seo', 'google-ads'], monthlyTotal: 15500, oneTimeTotal: 55000, year1Total: 241000, sentAt: new Date(Date.now() - 3 * DAY).toISOString(), link: 'ados.ai/t/A3X7K2', channels: ['email', 'sms'], status: 'reviewing', expiresAt: new Date(Date.now() + 11 * DAY).toISOString(), trackingEvents: [{ type: 'sent', t: new Date(Date.now() - 3 * DAY).toISOString(), title: 'Teklif gönderildi', desc: 'E-posta + SMS', status: 'done' }, { type: 'opened', t: new Date(Date.now() - 2.5 * DAY).toISOString(), title: 'Müşteri teklifi açtı', desc: 'Mobilden · İstanbul', status: 'done' }, { type: 'viewed', t: new Date(Date.now() - 1 * DAY).toISOString(), title: '2. kez inceleme', desc: '6dk 22sn · masaüstü', status: 'done' }] },
  { id: 'TKLF-2026-4818', customer: 'Nova E-Ticaret Ltd.', contact: 'Ayşe Kaya', segment: 'E-Ticaret', services: ['web', 'social-media', 'production'], monthlyTotal: 23500, oneTimeTotal: 92000, year1Total: 374000, sentAt: new Date(Date.now() - 5 * DAY).toISOString(), link: 'ados.ai/t/B7Y9M4', channels: ['email', 'whatsapp'], status: 'accepted', expiresAt: new Date(Date.now() + 9 * DAY).toISOString(), trackingEvents: [{ type: 'sent', t: new Date(Date.now() - 5 * DAY).toISOString(), title: 'Teklif gönderildi', desc: 'E-posta + WhatsApp', status: 'done' }, { type: 'opened', t: new Date(Date.now() - 4.8 * DAY).toISOString(), title: 'Müşteri teklifi açtı', desc: 'Masaüstü · Ankara', status: 'done' }, { type: 'viewed', t: new Date(Date.now() - 3 * DAY).toISOString(), title: 'Detaylar incelendi', desc: '12dk 40sn', status: 'done' }, { type: 'accepted', t: new Date(Date.now() - 1 * DAY).toISOString(), title: 'Teklif kabul edildi', desc: 'Müşteri onayı alındı', status: 'done' }] },
  { id: 'TKLF-2026-4815', customer: 'Işık Eğitim Kurumları', contact: 'Can Demir', segment: 'Eğitim', services: ['web', 'hosting', 'domain'], monthlyTotal: 3500, oneTimeTotal: 42000, year1Total: 84000, sentAt: new Date(Date.now() - 8 * DAY).toISOString(), link: 'ados.ai/t/C1P8N3', channels: ['email'], status: 'opened', expiresAt: new Date(Date.now() + 6 * DAY).toISOString(), trackingEvents: [{ type: 'sent', t: new Date(Date.now() - 8 * DAY).toISOString(), title: 'Teklif gönderildi', desc: 'E-posta', status: 'done' }, { type: 'opened', t: new Date(Date.now() - 7 * DAY).toISOString(), title: 'Müşteri teklifi açtı', desc: '1dk 12sn', status: 'done' }] },
  { id: 'TKLF-2026-4812', customer: 'Sağlık Plus Merkezi', contact: 'Zeynep Aydın', segment: 'Sağlık', services: ['seo', 'google-ads', 'social-ads'], monthlyTotal: 18000, oneTimeTotal: 0, year1Total: 216000, sentAt: new Date(Date.now() - 12 * DAY).toISOString(), link: 'ados.ai/t/D5Q3L7', channels: ['email', 'sms'], status: 'rejected', expiresAt: new Date(Date.now() + 2 * DAY).toISOString(), trackingEvents: [{ type: 'sent', t: new Date(Date.now() - 12 * DAY).toISOString(), title: 'Teklif gönderildi', desc: 'E-posta + SMS', status: 'done' }, { type: 'opened', t: new Date(Date.now() - 11 * DAY).toISOString(), title: 'Müşteri teklifi açtı', desc: '2 kez', status: 'done' }, { type: 'rejected', t: new Date(Date.now() - 6 * DAY).toISOString(), title: 'Müşteri reddetti', desc: 'Bütçe sebebiyle ertelendi', status: 'done' }] },
  { id: 'TKLF-2026-4810', customer: 'Çelik Yapı İnşaat', contact: 'Ahmet Öztürk', segment: 'İnşaat', services: ['web', 'seo'], monthlyTotal: 6500, oneTimeTotal: 48000, year1Total: 126000, sentAt: new Date(Date.now() - 15 * DAY).toISOString(), link: 'ados.ai/t/E9R4T1', channels: ['email', 'whatsapp'], status: 'expired', expiresAt: new Date(Date.now() - 1 * DAY).toISOString(), trackingEvents: [{ type: 'sent', t: new Date(Date.now() - 15 * DAY).toISOString(), title: 'Teklif gönderildi', desc: 'E-posta + WhatsApp', status: 'done' }, { type: 'opened', t: new Date(Date.now() - 14 * DAY).toISOString(), title: 'Müşteri teklifi açtı', desc: 'Kısa süre', status: 'done' }, { type: 'expired', t: new Date(Date.now() - 1 * DAY).toISOString(), title: 'Süresi doldu', desc: '14 gün geçti, yenilenmesi gerekli', status: 'done' }] },
];

function Icon({ children, className = 'w-3.5 h-3.5' }: { children: ReactNode; className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      {children}
    </svg>
  );
}

function serviceById(id: string) {
  return OFFER_SERVICES.find((service) => service.id === id) ?? OFFER_SERVICES[0];
}

function getServiceCost(svcId: string, salePrice: number) {
  const cfg = SERVICE_COSTS[svcId] || { costRatio: 0.5, minMargin: 20, name: svcId, costLabel: '' };
  return {
    cost: Math.round(salePrice * cfg.costRatio),
    minMargin: cfg.minMargin,
    costRatio: cfg.costRatio,
    name: cfg.name || svcId,
    costLabel: cfg.costLabel || '',
  };
}

function computeMarginForService(salePrice: number, svcId: string) {
  const info = getServiceCost(svcId, salePrice);
  if (salePrice <= 0) return { margin: 0, cost: info.cost, minMargin: info.minMargin, isRed: false, isYellow: false };
  const margin = ((salePrice - info.cost) / salePrice) * 100;
  return {
    margin,
    cost: info.cost,
    minMargin: info.minMargin,
    isRed: margin < info.minMargin,
    isYellow: margin < info.minMargin + 10 && margin >= info.minMargin,
  };
}

function computeProposalTotals(p: Proposal) {
  let totalSale = 0;
  let totalCost = 0;
  let allRed = false;
  let someYellow = false;
  const globalDisc = (p.globalDiscount || 0) / 100;

  p.services.forEach((sid) => {
    const orig = p.servicePrices?.[sid] ?? defaultServicePrice(p, sid);
    const serviceDisc = ((p.serviceDiscounts || {})[sid] || 0) / 100;
    const finalMultiplier = (1 - serviceDisc) * (1 - globalDisc);
    const sale = (orig.oneTime + orig.monthly * 12) * finalMultiplier;
    const mInfo = computeMarginForService(sale, sid);
    totalSale += sale;
    totalCost += mInfo.cost;
    if (mInfo.isRed) allRed = true;
    else if (mInfo.isYellow) someYellow = true;
  });

  const overallMargin = totalSale > 0 ? ((totalSale - totalCost) / totalSale) * 100 : 0;
  return {
    year1Total: totalSale,
    totalCost,
    overallMargin,
    marginIsRed: allRed,
    marginIsYellow: !allRed && (someYellow || overallMargin < 20),
    marginIsGreen: !allRed && !someYellow && overallMargin >= 20,
  };
}

function defaultServicePrice(p: Proposal, sid: string) {
  const defaultPrice = Math.round(p.year1Total / p.services.length);
  const oneTimeOnly = sid === 'seo' || sid === 'google-ads' || sid === 'social-media' || sid === 'premium360';
  const noMonthly = sid === 'web' || sid === 'production' || sid === 'trademark' || sid === 'domain';
  return {
    oneTime: oneTimeOnly ? 0 : Math.round(defaultPrice * 0.3),
    monthly: noMonthly ? 0 : Math.round((defaultPrice * 0.7) / 12),
  };
}

function getTimeAgo(date: Date) {
  const diff = (Date.now() - date.getTime()) / 1000;
  if (diff < 60) return 'az önce';
  if (diff < 3600) return `${Math.floor(diff / 60)} dk önce`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} saat önce`;
  return `${Math.floor(diff / 86400)} gün önce`;
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' });
}

function statusInfo(status: ProposalStatus) {
  const map: Record<ProposalStatus, { l: string; c: ColorName; icon: ReactNode }> = {
    sent: { l: 'Gönderildi', c: 'sky', icon: <><path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4 20-7z" /></> },
    opened: { l: 'Açıldı', c: 'sky', icon: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></> },
    reviewing: { l: 'İnceleniyor', c: 'violet', icon: <><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></> },
    accepted: { l: 'Onaylandı', c: 'emerald', icon: <polyline points="20 6 9 17 4 12" /> },
    converted: { l: 'Sözleşmeye Döndü', c: 'teal', icon: <><path d="M17 1l4 4-4 4" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /></> },
    rejected: { l: 'Reddedildi', c: 'rose', icon: <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></> },
    expired: { l: 'Süresi Geçti', c: 'amber', icon: <><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></> },
  };
  return map[status];
}

function EventIcon({ type, className }: { type: TrackingEventType; className: string }) {
  const icons: Record<TrackingEventType, ReactNode> = {
    sent: <><path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4 20-7z" /></>,
    opened: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></>,
    viewed: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>,
    accepted: <polyline points="20 6 9 17 4 12" />,
    converted: <polyline points="20 6 9 17 4 12" />,
    rejected: <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>,
    expired: <><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /></>,
    reminder1: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>,
    reminder2: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07" />,
    expire: <><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /></>,
  };
  return <Icon className={className}>{icons[type]}</Icon>;
}

export default function TeklifTakibi() {
  const navigate = useNavigate();
  const [proposals, setProposals] = useState<Proposal[]>(INITIAL_PROPOSALS);
  const [proposalsFilter, setProposalsFilter] = useState<ProposalFilter>('all');
  const [proposalsSearch, setProposalsSearch] = useState('');
  const [proposalDetailOpen, setProposalDetailOpen] = useState<string | null>(null);

  const selectedProposal = proposalDetailOpen ? proposals.find((proposal) => proposal.id === proposalDetailOpen) : null;

  const stats = useMemo(() => ({
    total: proposals.length,
    active: proposals.filter((p) => ['sent', 'opened', 'reviewing'].includes(p.status)).length,
    accepted: proposals.filter((p) => p.status === 'accepted').length,
    converted: proposals.filter((p) => p.status === 'converted').length,
    rejected: proposals.filter((p) => p.status === 'rejected').length,
    expired: proposals.filter((p) => p.status === 'expired').length,
  }), [proposals]);

  const filteredProposals = useMemo(() => {
    let filtered = proposals.filter((p) => {
      if (proposalsFilter === 'active') return ['sent', 'opened', 'reviewing'].includes(p.status);
      if (proposalsFilter === 'accepted') return p.status === 'accepted';
      if (proposalsFilter === 'converted') return p.status === 'converted';
      if (proposalsFilter === 'rejected') return p.status === 'rejected';
      if (proposalsFilter === 'expired') return p.status === 'expired';
      return true;
    });
    if (proposalsSearch) {
      const q = proposalsSearch.toLowerCase();
      filtered = filtered.filter((p) => p.customer.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || p.services.some((service) => serviceById(service).name.toLowerCase().includes(q)));
    }
    return filtered;
  }, [proposals, proposalsFilter, proposalsSearch]);

  const totalValueActive = proposals
    .filter((p) => ['sent', 'opened', 'reviewing', 'accepted'].includes(p.status))
    .reduce((sum, proposal) => sum + proposal.year1Total, 0);

  const openProposalDetail = (id: string) => {
    setProposalDetailOpen(id);
    setTimeout(() => document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' }), 0);
  };

  const simulateProposalAccept = (id: string) => {
    setProposals((current) => current.map((proposal) => (
      proposal.id === id
        ? {
          ...proposal,
          status: 'accepted',
          trackingEvents: [
            ...proposal.trackingEvents,
            { type: 'accepted', t: new Date().toISOString(), title: 'Teklif kabul edildi', desc: 'Müşteri onayı alındı · ADOS AI tarafından doğrulandı', status: 'done' },
          ],
        }
        : proposal
    )));
  };

  const convertToContract = (id: string) => {
    setProposals((current) => current.map((proposal) => (
      proposal.id === id
        ? {
          ...proposal,
          status: 'converted',
          trackingEvents: [
            ...proposal.trackingEvents,
            { type: 'converted', t: new Date().toISOString(), title: 'Sözleşmeye aktarıldı', desc: 'Sözleşme kaydı oluşturuldu', status: 'done' },
          ],
        }
        : proposal
    )));
  };

  const setServiceDiscount = (proposalId: string, serviceId: string, value: number) => {
    setProposals((current) => current.map((proposal) => (
      proposal.id === proposalId
        ? { ...proposal, serviceDiscounts: { ...(proposal.serviceDiscounts || {}), [serviceId]: value } }
        : proposal
    )));
  };

  const setProposalGlobalDiscount = (proposalId: string, value: number) => {
    setProposals((current) => current.map((proposal) => (
      proposal.id === proposalId ? { ...proposal, globalDiscount: value } : proposal
    )));
  };

  if (selectedProposal) {
    return (
      <ProposalDetailView
        onBack={() => setProposalDetailOpen(null)}
        onConvert={convertToContract}
        onCopyLink={(link) => navigator.clipboard?.writeText(link)}
        onGlobalDiscount={setProposalGlobalDiscount}
        onGoContracts={() => navigate('/dashboards/sales/contracts')}
        onServiceDiscount={setServiceDiscount}
        onSimulateAccept={simulateProposalAccept}
        proposal={selectedProposal}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-2xl border border-violet-300/40 dark:border-violet-500/30 shadow-lg">
        <div className="relative bg-gradient-to-br from-[#0f0a2a] via-[#1a1040] to-[#0f0a2a] p-5 md:p-6">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-violet-500/25 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)', backgroundSize: '40px 40px' }}></div>

          <div className="relative flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-400 to-violet-600 rounded-xl blur-md opacity-60"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-violet-400 via-violet-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Icon className="text-white w-6 h-6"><path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4 20-7z" /></Icon>
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold tracking-[0.2em] text-violet-300 uppercase">ADOS Teklif Takibi</div>
                <h2 className="text-[24px] md:text-[28px] font-black leading-tight">
                  <span className="bg-gradient-to-r from-violet-200 via-white to-violet-200 bg-clip-text text-transparent">Gönderilen Teklifler</span>
                </h2>
                <p className="text-[11px] text-white/70 mt-0.5">{stats.active} aktif takipte · {stats.accepted} onay bekleyen · toplam ₺{Math.round(totalValueActive / 1000)}K potansiyel</p>
              </div>
            </div>
            <button onClick={() => navigate('/dashboards/sales/start-sales')} className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg font-bold text-[12px] shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
              <Icon className="w-4 h-4"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></Icon>
              Yeni Teklif Oluştur
            </button>
          </div>
        </div>
        <div className="h-0.5 bg-gradient-to-r from-violet-500 via-amber-300 to-violet-500"></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
        {[
          { l: 'Toplam', v: stats.total, c: 'gray' as ColorName, f: 'all' as ProposalFilter },
          { l: 'Aktif', v: stats.active, c: 'sky' as ColorName, f: 'active' as ProposalFilter },
          { l: 'Onaylandı', v: stats.accepted, c: 'emerald' as ColorName, f: 'accepted' as ProposalFilter },
          { l: 'Dönüştü', v: stats.converted, c: 'violet' as ColorName, f: 'converted' as ProposalFilter },
          { l: 'Reddedildi', v: stats.rejected, c: 'rose' as ColorName, f: 'rejected' as ProposalFilter },
          { l: 'Süresi Geçti', v: stats.expired, c: 'amber' as ColorName, f: 'expired' as ProposalFilter },
        ].map((st) => {
          const active = proposalsFilter === st.f;
          const cm = CM[st.c] || CM.gray;
          return (
            <button key={st.f} onClick={() => setProposalsFilter(st.f)} className={`p-3 rounded-xl border transition-all text-left ${active ? `${cm.bg} ${BORDER_ACTIVE[st.c]} shadow-sm` : 'bg-white dark:bg-[#1e1f26] border-gray-200 dark:border-gray-600/50 hover:border-gray-300 dark:hover:border-gray-500/40'}`}>
              <div className={`text-[20px] font-bold ${active ? cm.t : 'text-gray-900 dark:text-gray-100'} leading-none`}>{st.v}</div>
              <div className={`text-[10px] font-semibold ${active ? `${cm.t} opacity-80` : 'text-gray-500 dark:text-gray-400'} mt-1`}>{st.l}</div>
            </button>
          );
        })}
      </div>

      <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-3 flex items-center gap-2 flex-wrap">
        <div className="flex-1 min-w-[200px] relative">
          <Icon className="text-gray-400 dark:text-gray-500 w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></Icon>
          <input type="text" onChange={(event) => setProposalsSearch(event.target.value)} placeholder="Müşteri adı, teklif no veya hizmet ara..." value={proposalsSearch} className="w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-gray-600/50 bg-white dark:bg-[#23242c] text-gray-900 dark:text-gray-100 rounded-lg text-[12px] focus:outline-none focus:border-violet-500 placeholder:text-gray-400 dark:placeholder:text-gray-500" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-gray-500 dark:text-gray-400">Sırala:</span>
          <select className="px-3 py-2 bg-white dark:bg-[#23242c] border border-gray-200 dark:border-gray-600/50 rounded-lg text-[11px] font-semibold text-gray-700 dark:text-gray-300 focus:outline-none focus:border-violet-500">
            <option>En yeni</option>
            <option>En eski</option>
            <option>Tutar: Yüksek → Düşük</option>
            <option>Tutar: Düşük → Yüksek</option>
            <option>Süre biten</option>
          </select>
        </div>
      </div>

      <div data-proposals-list className="space-y-2">
        {filteredProposals.length === 0 ? (
          <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-12 text-center">
            <Icon className="text-gray-300 dark:text-gray-600 w-12 h-12 mx-auto mb-3"><path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4 20-7z" /></Icon>
            <p className="text-[13px] font-bold text-gray-700 dark:text-gray-300">Teklif bulunamadı</p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Filtreleri değiştirmeyi veya yeni teklif oluşturmayı deneyin</p>
          </div>
        ) : filteredProposals.map((proposal) => (
          <ProposalRow key={proposal.id} onConvert={convertToContract} onOpen={openProposalDetail} onSimulateAccept={simulateProposalAccept} proposal={proposal} />
        ))}
      </div>
    </div>
  );
}

function ProposalRow({ proposal, onOpen, onSimulateAccept, onConvert }: { proposal: Proposal; onOpen: (id: string) => void; onSimulateAccept: (id: string) => void; onConvert: (id: string) => void }) {
  const st = statusInfo(proposal.status);
  const stcm = CM[st.c] || CM.gray;
  const lastEvent = proposal.trackingEvents[proposal.trackingEvents.length - 1];
  const timeAgo = lastEvent.t ? getTimeAgo(new Date(lastEvent.t)) : '';

  return (
    <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-4 hover:border-violet-300 dark:hover:border-violet-500/40 hover:shadow-md transition-all cursor-pointer" onClick={() => onOpen(proposal.id)}>
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
          <span className="text-white text-[14px] font-bold">{(proposal.customer || 'X').charAt(0)}</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <h4 className="text-[13px] font-bold text-gray-900 dark:text-gray-100 truncate">{proposal.customer}</h4>
            <span className="text-[9px] font-mono text-gray-500 dark:text-gray-500">{proposal.id}</span>
            <span className={`px-1.5 py-0.5 ${stcm.bg} ${BORDER_ACTIVE[st.c]} border rounded text-[9px] font-bold ${stcm.t} flex items-center gap-1`}>
              <Icon className="w-2.5 h-2.5">{st.icon}</Icon>{st.l}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400 flex-wrap">
            <span>{proposal.contact}</span>
            <span className="text-gray-300 dark:text-gray-600">·</span>
            <span>{proposal.services.length} hizmet</span>
            <span className="text-gray-300 dark:text-gray-600">·</span>
            <span>{timeAgo}</span>
          </div>
          <div className="mt-1.5 text-[10px] text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
            <Icon className="text-gray-400 dark:text-gray-500 w-2.5 h-2.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></Icon>
            <span><span className="font-semibold">Son aktivite:</span> {lastEvent.title}</span>
          </div>
        </div>

        <div className="text-right shrink-0">
          <div className="text-[16px] font-bold text-gray-900 dark:text-gray-100 leading-tight">₺{Math.round(proposal.year1Total / 1000)}K</div>
          <div className="text-[9px] text-gray-500 dark:text-gray-400">1. yıl · ₺{Math.round(proposal.monthlyTotal / 1000)}K/ay</div>
        </div>

        <div className="shrink-0 flex flex-col gap-1">
          {proposal.status === 'accepted' ? (
            <button onClick={(event) => { event.stopPropagation(); onConvert(proposal.id); }} className="px-2.5 py-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-[10px] font-bold rounded-md hover:shadow-md transition-all flex items-center gap-1">
              <Icon className="w-3 h-3"><polyline points="20 6 9 17 4 12" /></Icon>Sözleşmeye Dönüştür
            </button>
          ) : null}
          {['sent', 'opened', 'reviewing'].includes(proposal.status) ? (
            <button onClick={(event) => { event.stopPropagation(); onSimulateAccept(proposal.id); }} className="px-2.5 py-1.5 bg-violet-600 hover:bg-violet-700 text-white text-[10px] font-bold rounded-md transition-colors flex items-center gap-1">
              <Icon className="w-3 h-3"><polyline points="20 6 9 17 4 12" /></Icon>Kabul Simüle Et
            </button>
          ) : null}
          <Icon className="text-gray-300 dark:text-gray-600 w-4 h-4"><polyline points="9 18 15 12 9 6" /></Icon>
        </div>
      </div>
    </div>
  );
}

function ProposalDetailView({
  proposal,
  onBack,
  onSimulateAccept,
  onConvert,
  onGoContracts,
  onServiceDiscount,
  onGlobalDiscount,
  onCopyLink,
}: {
  proposal: Proposal;
  onBack: () => void;
  onSimulateAccept: (id: string) => void;
  onConvert: (id: string) => void;
  onGoContracts: () => void;
  onServiceDiscount: (proposalId: string, serviceId: string, value: number) => void;
  onGlobalDiscount: (proposalId: string, value: number) => void;
  onCopyLink: (link: string) => void;
}) {
  const svcs = OFFER_SERVICES.filter((service) => proposal.services.includes(service.id));
  const sentDate = formatDateTime(proposal.sentAt);
  const daysLeft = Math.floor((new Date(proposal.expiresAt).getTime() - Date.now()) / DAY);
  const st = statusInfo(proposal.status);
  const calc = computeProposalTotals(proposal);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <button onClick={onBack} className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 text-gray-700 dark:text-gray-300 rounded-lg text-[11px] font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <Icon className="w-3.5 h-3.5"><polyline points="15 18 9 12 15 6" /></Icon>
          Teklif Takibine Dön
        </button>
        <div className="flex items-center gap-1.5 text-[10px] text-gray-400 dark:text-gray-500">
          <Icon className="w-3 h-3"><polyline points="9 18 15 12 9 6" /></Icon>
          <span className="font-mono">{proposal.id}</span>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-violet-300/40 dark:border-violet-500/30 shadow-lg">
        <div className="relative bg-gradient-to-br from-[#0f0a2a] via-[#1a1040] to-[#0f0a2a] p-5 md:p-6">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-violet-500/25 rounded-full blur-3xl pointer-events-none"></div>
          <div className={`absolute -bottom-20 -left-20 w-60 h-60 bg-${st.c}-500/20 rounded-full blur-3xl pointer-events-none`}></div>
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)', backgroundSize: '40px 40px' }}></div>

          <div className="relative">
            <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
              <div>
                <div className="text-[10px] font-bold tracking-[0.2em] text-violet-300 uppercase">Teklif Detayı</div>
                <div className="text-[11px] text-white/60 font-mono">{proposal.id}</div>
              </div>
              <div className={`flex items-center gap-1.5 px-3 py-1.5 bg-${st.c}-500/20 border border-${st.c}-400/40 rounded-full backdrop-blur-sm`}>
                <span className={`w-1.5 h-1.5 bg-${st.c}-400 rounded-full ${proposal.status === 'accepted' ? 'animate-pulse' : ''}`}></span>
                <span className={`text-[10px] font-bold text-${st.c}-300 tracking-wider`}>{st.l.toUpperCase()}</span>
              </div>
            </div>

            <div className="mb-5">
              <h1 className="text-[24px] md:text-[30px] font-black leading-none tracking-tight mb-2">
                <span className="bg-gradient-to-r from-violet-200 via-white to-violet-200 bg-clip-text text-transparent">{proposal.customer}</span>
              </h1>
              <p className="text-[12px] text-white/70">{proposal.contact} · {proposal.segment} · {svcs.length} hizmet</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div className="p-2.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg">
                <div className="text-[9px] font-bold text-violet-300/80 uppercase tracking-widest">Gönderim</div>
                <div className="text-[11px] font-bold text-white mt-0.5">{sentDate}</div>
              </div>
              <div className={`p-2.5 bg-white/5 backdrop-blur-sm border ${daysLeft < 3 ? 'border-amber-400/40' : 'border-white/10'} rounded-lg`}>
                <div className={`text-[9px] font-bold ${daysLeft < 3 ? 'text-amber-300' : 'text-violet-300/80'} uppercase tracking-widest`}>Son Geçerlilik</div>
                <div className="text-[11px] font-bold text-white mt-0.5">{daysLeft > 0 ? `${daysLeft} gün kaldı` : 'Süresi doldu'}</div>
              </div>
              <div className="p-2.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg">
                <div className="text-[9px] font-bold text-violet-300/80 uppercase tracking-widest">1. Yıl Bedeli</div>
                <div className="text-[13px] font-bold bg-gradient-to-r from-amber-300 to-amber-100 bg-clip-text text-transparent mt-0.5">₺{Math.round(calc.year1Total).toLocaleString('tr-TR')}</div>
              </div>
              <div className={`p-2.5 bg-white/5 backdrop-blur-sm border ${calc.marginIsRed ? 'border-rose-400/40' : calc.marginIsYellow ? 'border-amber-400/40' : 'border-emerald-400/40'} rounded-lg`}>
                <div className={`text-[9px] font-bold ${calc.marginIsRed ? 'text-rose-300' : calc.marginIsYellow ? 'text-amber-300' : 'text-emerald-300'} uppercase tracking-widest`}>Karlılık</div>
                <div className={`text-[13px] font-bold ${calc.marginIsRed ? 'text-rose-300' : calc.marginIsYellow ? 'text-amber-300' : 'text-emerald-300'} mt-0.5`}>%{calc.overallMargin.toFixed(1)}</div>
              </div>
            </div>
          </div>
        </div>
        <div className={`h-0.5 bg-gradient-to-r from-violet-500 via-${st.c}-300 to-violet-500`}></div>
      </div>

      {['sent', 'opened', 'reviewing', 'accepted'].includes(proposal.status) ? (
        <ServiceDiscountEditor onGlobalDiscount={onGlobalDiscount} onServiceDiscount={onServiceDiscount} proposal={proposal} svcs={svcs} calc={calc} />
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700/40 flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <Icon className="text-violet-600 dark:text-violet-400 w-4 h-4"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></Icon>
              <h4 className="text-[14px] font-bold text-gray-900 dark:text-gray-100">Müşteri Aktivite Takibi</h4>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-full">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300">CANLI</span>
            </div>
          </div>
          <div className="p-5">
            <TrackingEvents events={proposal.trackingEvents} status={proposal.status} />
          </div>
        </div>

        <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-4">
          <h4 className="text-[13px] font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
            <Icon className="text-violet-600 dark:text-violet-400 w-3.5 h-3.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /></Icon>
            Gönderim Kanalları
          </h4>
          <div className="flex flex-wrap gap-1 mb-3">
            {proposal.channels.map((channel) => {
              const label = { email: 'E-posta', sms: 'SMS', whatsapp: 'WhatsApp' }[channel] ?? channel;
              return <span key={channel} className="px-2 py-0.5 bg-gray-100 dark:bg-[#17181f] border border-gray-200 dark:border-gray-600/50 rounded text-[10px] font-bold text-gray-700 dark:text-gray-300">{label}</span>;
            })}
          </div>
          <div className="pt-3 border-t border-gray-100 dark:border-gray-700/40">
            <div className="text-[10px] text-gray-500 dark:text-gray-400 mb-1">Özel Teklif Linki</div>
            <div className="flex items-center gap-1.5">
              <code className="flex-1 text-[11px] font-mono font-bold text-violet-700 dark:text-violet-300 truncate">{proposal.link}</code>
              <button onClick={() => onCopyLink(proposal.link)} className="w-6 h-6 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded flex items-center justify-center"><Icon className="w-3 h-3 text-gray-500"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></Icon></button>
            </div>
          </div>
        </div>
      </div>

      <ProposalActions calc={calc} onConvert={onConvert} onGoContracts={onGoContracts} onSimulateAccept={onSimulateAccept} proposal={proposal} />
    </div>
  );
}

function ServiceDiscountEditor({ proposal, svcs, calc, onServiceDiscount, onGlobalDiscount }: { proposal: Proposal; svcs: OfferService[]; calc: ReturnType<typeof computeProposalTotals>; onServiceDiscount: (proposalId: string, serviceId: string, value: number) => void; onGlobalDiscount: (proposalId: string, value: number) => void }) {
  return (
    <div className="bg-white dark:bg-[#1e1f26] border-2 border-violet-300 dark:border-violet-500/40 rounded-xl overflow-hidden shadow-lg">
      <div className="relative overflow-hidden bg-gradient-to-br from-violet-50 via-indigo-50 to-violet-50 dark:from-violet-500/10 dark:via-indigo-500/5 dark:to-violet-500/10 p-4 border-b border-violet-200 dark:border-violet-500/30">
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-violet-400/15 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md shrink-0">
              <Icon className="text-white w-5 h-5"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></Icon>
            </div>
            <div>
              <h4 className="text-[14px] font-bold text-violet-900 dark:text-violet-200">Hizmet Bazlı İskonto & Karlılık Takibi</h4>
              <p className="text-[11px] text-violet-700 dark:text-violet-400 mt-0.5">Her hizmet için ayrı indirim uygulayabilirsiniz · sistem min. karlılık altına düşmenizi engeller</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-[9px] font-bold text-violet-600 dark:text-violet-400 uppercase tracking-widest">Genel Karlılık</div>
              <div className={`text-[20px] font-black ${calc.marginIsRed ? 'text-rose-600 dark:text-rose-400' : calc.marginIsYellow ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'} leading-none`}>%{calc.overallMargin.toFixed(1)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-2">
        {svcs.map((svc) => <SingleServiceDiscount key={svc.id} onServiceDiscount={onServiceDiscount} proposal={proposal} svc={svc} />)}
      </div>

      <div className="p-4 bg-gray-50 dark:bg-[#17181f] border-t border-gray-200 dark:border-gray-700/40">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300">Üstüne Genel Ek İndirim</label>
              <span className="text-[14px] font-bold text-violet-700 dark:text-violet-300">%{proposal.globalDiscount || 0}</span>
            </div>
            <input type="range" min="0" max="20" step="1" value={proposal.globalDiscount || 0} onChange={(event) => onGlobalDiscount(proposal.id, Number(event.target.value))} className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-violet-600" />
            <div className="flex items-center justify-between text-[9px] text-gray-500 dark:text-gray-500 mt-1">
              <span>0%</span><span>5%</span><span>10%</span><span>15%</span><span>20%</span>
            </div>
          </div>

          <div className="p-3 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-lg">
            <div className="space-y-1 text-[10px]">
              <div className="flex items-center justify-between"><span className="text-gray-500 dark:text-gray-400">Orijinal</span><span className="font-bold text-gray-700 dark:text-gray-300 line-through">₺{Math.round(proposal.year1Total).toLocaleString('tr-TR')}</span></div>
              <div className="flex items-center justify-between"><span className="text-gray-500 dark:text-gray-400">Toplam İndirim</span><span className="font-bold text-rose-600 dark:text-rose-400">-₺{Math.round(proposal.year1Total - calc.year1Total).toLocaleString('tr-TR')}</span></div>
              <div className="flex items-center justify-between pt-1 border-t border-gray-200 dark:border-gray-700/40"><span className="text-[11px] font-bold text-gray-900 dark:text-gray-100">Yeni Toplam</span><span className="text-[13px] font-bold text-violet-700 dark:text-violet-300">₺{Math.round(calc.year1Total).toLocaleString('tr-TR')}</span></div>
            </div>
          </div>
        </div>

        {calc.marginIsRed ? (
          <div className="mt-3 p-3 bg-rose-50 dark:bg-rose-500/10 border-2 border-rose-300 dark:border-rose-500/40 rounded-lg flex items-start gap-2.5">
            <Icon className="text-rose-600 dark:text-rose-400 shrink-0 mt-0.5 w-4 h-4"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></Icon>
            <div className="flex-1">
              <p className="text-[12px] font-bold text-rose-900 dark:text-rose-200">Karlılık Sınırı İhlali</p>
              <p className="text-[11px] text-rose-700 dark:text-rose-400 mt-0.5">Bir veya daha fazla hizmette minimum karlılık sınırının altına düştünüz. Teklif onayı için indirimi azaltın veya müdür onayı isteyin.</p>
            </div>
          </div>
        ) : calc.marginIsYellow ? (
          <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/40 rounded-lg flex items-start gap-2.5">
            <Icon className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5 w-4 h-4"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></Icon>
            <div className="flex-1">
              <p className="text-[12px] font-bold text-amber-900 dark:text-amber-200">Dikkat · Karlılık Düşük</p>
              <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-0.5">Karlılığınız sınıra yakın. Ek indirim vermeden önce kontrol edin.</p>
            </div>
          </div>
        ) : (
          <div className="mt-3 p-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-300 dark:border-emerald-500/40 rounded-lg flex items-center gap-2.5">
            <Icon className="text-emerald-600 dark:text-emerald-400 shrink-0 w-4 h-4"><polyline points="20 6 9 17 4 12" /></Icon>
            <p className="text-[11px] font-bold text-emerald-900 dark:text-emerald-200">Karlılık Sağlıklı · Teklif onayına hazır</p>
          </div>
        )}
      </div>
    </div>
  );
}

function SingleServiceDiscount({ proposal, svc, onServiceDiscount }: { proposal: Proposal; svc: OfferService; onServiceDiscount: (proposalId: string, serviceId: string, value: number) => void }) {
  const orig = proposal.servicePrices?.[svc.id] ?? defaultServicePrice(proposal, svc.id);
  const discount = (proposal.serviceDiscounts || {})[svc.id] || 0;
  const adjOneTime = orig.oneTime * (1 - discount / 100);
  const adjMonthly = orig.monthly * (1 - discount / 100);
  const adjAnnual = adjOneTime + adjMonthly * 12;
  const marginInfo = computeMarginForService(adjAnnual, svc.id);
  const barColor: ColorName = marginInfo.isRed ? 'rose' : marginInfo.isYellow ? 'amber' : 'emerald';
  const textMap = {
    rose: 'text-rose-700 dark:text-rose-300',
    amber: 'text-amber-700 dark:text-amber-300',
    emerald: 'text-emerald-700 dark:text-emerald-300',
  };

  return (
    <div className="p-3 bg-gray-50 dark:bg-[#17181f] border border-gray-200 dark:border-gray-600/50 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        <div className="md:col-span-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-violet-100 dark:bg-violet-500/20 rounded-lg flex items-center justify-center shrink-0">
              <Icon className="text-violet-600 dark:text-violet-400 w-3.5 h-3.5">{svc.icon}</Icon>
            </div>
            <div className="min-w-0">
              <div className="text-[12px] font-bold text-gray-900 dark:text-gray-100 truncate">{svc.name}</div>
              <div className="text-[9px] text-gray-500 dark:text-gray-500">Maliyet: ₺{marginInfo.cost.toLocaleString('tr-TR')}</div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 text-center">
          <div className="text-[9px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">Orijinal</div>
          <div className={`text-[12px] font-bold text-gray-600 dark:text-gray-400 ${discount > 0 ? 'line-through' : ''}`}>₺{Math.round(orig.oneTime + orig.monthly * 12).toLocaleString('tr-TR')}</div>
        </div>

        <div className="md:col-span-3">
          <div className="flex items-center justify-between mb-1">
            <label className="text-[9px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">İskonto</label>
            <span className={`text-[13px] font-bold ${discount > 0 ? 'text-violet-700 dark:text-violet-300' : 'text-gray-500 dark:text-gray-500'}`}>%{discount}</span>
          </div>
          <input type="range" min="0" max="50" step="1" value={discount} onChange={(event) => onServiceDiscount(proposal.id, svc.id, Number(event.target.value))} className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-violet-600" />
        </div>

        <div className="md:col-span-2 text-center">
          <div className="text-[9px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">Final</div>
          <div className={`text-[12px] font-bold ${discount > 0 ? 'text-violet-700 dark:text-violet-300' : 'text-gray-900 dark:text-gray-100'}`}>₺{Math.round(adjAnnual).toLocaleString('tr-TR')}</div>
        </div>

        <div className="md:col-span-2 text-center">
          <div className="text-[9px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">Karlılık</div>
          <div className="flex items-center justify-center gap-1">
            <div className={`text-[14px] font-black ${textMap[barColor as keyof typeof textMap]}`}>%{marginInfo.margin.toFixed(1)}</div>
            {marginInfo.isRed ? <Icon className={`${textMap[barColor as keyof typeof textMap]} w-3 h-3 animate-pulse`}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /></Icon> : null}
          </div>
          <div className="text-[8px] text-gray-500 dark:text-gray-500 mt-0.5">min %{marginInfo.minMargin}</div>
        </div>
      </div>

      <div className="mt-2 relative h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div className={`absolute left-0 top-0 bottom-0 bg-gradient-to-r from-${barColor}-400 to-${barColor}-600 transition-all`} style={{ width: `${Math.min(100, Math.max(0, marginInfo.margin))}%` }}></div>
        <div className="absolute top-0 bottom-0 w-0.5 bg-gray-900 dark:bg-white opacity-50" style={{ left: `${marginInfo.minMargin}%` }} title="Min karlılık"></div>
      </div>
    </div>
  );
}

function TrackingEvents({ events, status }: { events: TrackingEvent[]; status: ProposalStatus }) {
  const pending: TrackingEvent[] = ['sent', 'opened', 'reviewing'].includes(status)
    ? [
      { type: 'reminder1', title: 'İlk hatırlatma', desc: 'Auto SMS + E-posta', time: 'T+3 gün', status: 'pending' },
      { type: 'reminder2', title: 'İkinci hatırlatma', desc: 'Telefon görev atamasi', time: 'T+7 gün', status: 'pending' },
      { type: 'expire', title: 'Link geçerlilik sonu', desc: 'Yeniden gönderim gerekli', time: 'T+14 gün', status: 'pending' },
    ]
    : [];
  const allEvents = events.concat(pending);

  return (
    <div className="relative">
      <div className="absolute left-[15px] top-3 bottom-3 w-0.5 bg-gradient-to-b from-emerald-300 via-sky-300 to-gray-200 dark:from-emerald-500/30 dark:via-sky-500/30 dark:to-gray-700 pointer-events-none"></div>
      <div className="space-y-2.5">
        {allEvents.map((ev, index) => {
          const isPending = ev.status === 'pending';
          const clr: ColorName = isPending ? 'gray' : ev.type === 'accepted' || ev.type === 'converted' ? 'emerald' : ev.type === 'rejected' ? 'rose' : ev.type === 'expired' ? 'amber' : ['opened', 'viewed'].includes(ev.type) ? 'sky' : 'violet';
          const cm = CM[clr] || CM.gray;
          const timeStr = isPending ? ev.time : ev.t ? new Date(ev.t).toLocaleString('tr-TR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' }) : '';
          return (
            <div key={`${ev.type}-${index}`} className="flex items-start gap-3 relative">
              <div className={`w-8 h-8 rounded-full ${isPending ? 'bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600' : `${cm.bg} ${BORDER_ACTIVE[clr]} border-2`} flex items-center justify-center shrink-0 relative z-10 ${!isPending ? 'shadow-sm' : ''}`}>
                <EventIcon type={ev.type} className={`${isPending ? 'text-gray-400' : cm.t} w-3.5 h-3.5`} />
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h5 className={`text-[12px] font-bold ${isPending ? 'text-gray-500 dark:text-gray-500' : 'text-gray-900 dark:text-gray-100'}`}>{ev.title}</h5>
                  <span className={`text-[9px] font-mono ${isPending ? 'text-gray-400' : `${cm.t} font-bold`}`}>{timeStr}</span>
                </div>
                <p className={`text-[10px] ${isPending ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>{ev.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProposalActions({ proposal, calc, onConvert, onGoContracts, onSimulateAccept }: { proposal: Proposal; calc: ReturnType<typeof computeProposalTotals>; onConvert: (id: string) => void; onGoContracts: () => void; onSimulateAccept: (id: string) => void }) {
  if (proposal.status === 'accepted') {
    const canConvert = !calc.marginIsRed;
    return (
      <div className="space-y-2">
        {!canConvert ? (
          <div className="p-3 bg-rose-50 dark:bg-rose-500/10 border border-rose-300 dark:border-rose-500/40 rounded-lg text-[11px] text-rose-800 dark:text-rose-300 flex items-center gap-2">
            <Icon className="w-3.5 h-3.5 shrink-0"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></Icon>
            <span>Karlılık sınır altında · indirimi düzenleyin veya müdür onayı alın</span>
          </div>
        ) : null}
        <button onClick={() => canConvert && onConvert(proposal.id)} disabled={!canConvert} className={`w-full relative overflow-hidden rounded-2xl border-2 ${canConvert ? 'border-emerald-400/60' : 'border-gray-300 dark:border-gray-700'} shadow-xl group ${canConvert ? '' : 'opacity-50 cursor-not-allowed'}`}>
          <div className={`relative ${canConvert ? 'bg-gradient-to-br from-[#0a2e1a] via-[#1a3530] to-[#0a2e1a] group-hover:from-[#0d3220]' : 'bg-gray-200 dark:bg-gray-800'} p-5 transition-colors`}>
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-emerald-500/30 rounded-full blur-3xl pointer-events-none"></div>
            <div className="relative flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-14 h-14 ${canConvert ? 'bg-gradient-to-br from-emerald-400 to-emerald-600' : 'bg-gray-400 dark:bg-gray-600'} rounded-xl flex items-center justify-center shadow-lg shrink-0`}>
                  <Icon className="text-white w-7 h-7"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></Icon>
                </div>
                <div className="text-left">
                  <div className={`text-[9px] font-bold tracking-[0.2em] ${canConvert ? 'text-emerald-300' : 'text-gray-500'} uppercase mb-1`}>Ana Aksiyon</div>
                  <div className={`text-[22px] font-black ${canConvert ? 'text-white' : 'text-gray-400'} leading-tight`}>
                    <span className={canConvert ? 'bg-gradient-to-r from-emerald-200 to-white bg-clip-text text-transparent' : ''}>Sözleşmeye Aktar</span>
                  </div>
                  <p className={`text-[11px] ${canConvert ? 'text-white/60' : 'text-gray-500'} mt-0.5`}>Kabul edilen teklif → Sözleşme Takibi'ne yönlendirilir</p>
                </div>
              </div>
              {canConvert ? (
                <div className="w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/20 group-hover:translate-x-1 transition-all shrink-0">
                  <Icon className="text-white w-5 h-5"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></Icon>
                </div>
              ) : null}
            </div>
          </div>
          {canConvert ? <div className="h-1 bg-gradient-to-r from-emerald-500 via-amber-300 to-emerald-500"></div> : null}
        </button>
      </div>
    );
  }

  if (proposal.status === 'converted') {
    return (
      <div className="p-4 bg-teal-50 dark:bg-teal-500/10 border border-teal-300 dark:border-teal-500/30 rounded-xl flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center shrink-0">
          <Icon className="text-white w-5 h-5"><path d="M17 1l4 4-4 4" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><path d="M7 23l-4-4 4-4" /><path d="M21 13v2a4 4 0 0 1-4 4H3" /></Icon>
        </div>
        <div className="flex-1">
          <p className="text-[13px] font-bold text-teal-900 dark:text-teal-200">Bu teklif sözleşmeye aktarıldı</p>
          <p className="text-[11px] text-teal-700 dark:text-teal-400 mt-0.5">Devamı için Sözleşme Takibi panosuna geçin</p>
        </div>
        <button onClick={onGoContracts} className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-[11px] font-bold transition-colors flex items-center gap-1.5">
          <Icon className="w-3.5 h-3.5"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></Icon>
          Sözleşme Takibine Git
        </button>
      </div>
    );
  }

  if (['sent', 'opened', 'reviewing'].includes(proposal.status)) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <button className="p-4 bg-white dark:bg-[#1e1f26] border border-violet-200 dark:border-violet-500/30 rounded-xl text-left hover:border-violet-400 transition-all">
          <div className="w-9 h-9 bg-violet-100 dark:bg-violet-500/20 rounded-lg flex items-center justify-center mb-2">
            <Icon className="text-violet-600 dark:text-violet-400 w-4 h-4"><path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4 20-7z" /></Icon>
          </div>
          <h5 className="text-[12px] font-bold text-gray-900 dark:text-gray-100">Hatırlatma Gönder</h5>
          <p className="text-[10px] text-gray-500 dark:text-gray-400">Müşteriyi takibe al</p>
        </button>
        <button className="p-4 bg-white dark:bg-[#1e1f26] border border-sky-200 dark:border-sky-500/30 rounded-xl text-left hover:border-sky-400 transition-all">
          <div className="w-9 h-9 bg-sky-100 dark:bg-sky-500/20 rounded-lg flex items-center justify-center mb-2">
            <Icon className="text-sky-600 dark:text-sky-400 w-4 h-4"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72" /></Icon>
          </div>
          <h5 className="text-[12px] font-bold text-gray-900 dark:text-gray-100">Telefon Görevi Aç</h5>
          <p className="text-[10px] text-gray-500 dark:text-gray-400">Müşteriyi arama planla</p>
        </button>
        <button onClick={() => onSimulateAccept(proposal.id)} className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-500/10 dark:to-teal-500/5 border border-emerald-300 dark:border-emerald-500/40 rounded-xl text-left hover:border-emerald-500 transition-all">
          <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center mb-2 shadow-sm">
            <Icon className="text-white w-4 h-4"><polyline points="20 6 9 17 4 12" /></Icon>
          </div>
          <h5 className="text-[12px] font-bold text-emerald-900 dark:text-emerald-200">Müşteri Onayı (Simülasyon)</h5>
          <p className="text-[10px] text-emerald-700 dark:text-emerald-400">Kabul senaryosunu dene</p>
        </button>
      </div>
    );
  }

  return null;
}
