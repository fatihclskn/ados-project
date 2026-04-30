import { type ReactNode, useMemo, useState } from 'react';

type ColorName = 'emerald' | 'amber' | 'rose' | 'sky' | 'violet' | 'indigo' | 'gray';

type Staff = {
  id: number;
  name: string;
  title: string;
  avatar: string;
  color: ColorName;
  leads: number;
  converted: number;
  totalSale: number;
  commRate: number;
  earned: number;
  approved: number;
  pending: number;
  paid: number;
};

type PrimRecord = {
  id: number;
  staffId: number;
  staffName: string;
  co: string;
  services: string[];
  saleAmount: number;
  commRate: number;
  earned: number;
  status: string;
  stClr: ColorName;
  payStatus: string;
  psClr: ColorName;
  contractDate: string;
  payDate: string;
  note: string;
};

const CM: Record<ColorName, { bg: string; t: string; bar: string }> = {
  emerald: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', t: 'text-emerald-700 dark:text-emerald-300', bar: 'bg-emerald-500' },
  amber: { bg: 'bg-amber-100 dark:bg-amber-900/30', t: 'text-amber-700 dark:text-amber-300', bar: 'bg-amber-500' },
  rose: { bg: 'bg-rose-100 dark:bg-rose-900/30', t: 'text-rose-700 dark:text-rose-300', bar: 'bg-rose-500' },
  sky: { bg: 'bg-sky-100 dark:bg-sky-900/30', t: 'text-sky-700 dark:text-sky-300', bar: 'bg-sky-500' },
  violet: { bg: 'bg-violet-100 dark:bg-violet-900/30', t: 'text-violet-700 dark:text-violet-300', bar: 'bg-violet-500' },
  indigo: { bg: 'bg-indigo-100 dark:bg-indigo-900/30', t: 'text-indigo-700 dark:text-indigo-300', bar: 'bg-indigo-500' },
  gray: { bg: 'bg-gray-100 dark:bg-gray-800', t: 'text-gray-600 dark:text-gray-400', bar: 'bg-gray-500' },
};

const P = {
  dollar: (
    <>
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </>
  ),
  upload: (
    <>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </>
  ),
  chk: <polyline points="20 6 9 17 4 12" />,
  eye: (
    <>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  info: (
    <>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </>
  ),
  x: (
    <>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </>
  ),
};

const STAFF: Staff[] = [
  { id: 1, name: 'Zeynep Acar', title: 'Pazarlama Uzmanı', avatar: 'ZA', color: 'violet', leads: 8, converted: 5, totalSale: 387000, commRate: 4, earned: 15480, approved: 2, pending: 3, paid: 10200 },
  { id: 2, name: 'Ayşe Demir', title: 'Dijital Pazarlama Uzmanı', avatar: 'AD', color: 'sky', leads: 6, converted: 4, totalSale: 312000, commRate: 4, earned: 12480, approved: 3, pending: 1, paid: 9360 },
  { id: 3, name: 'Mert Kaya', title: 'İçerik & Lead Uzmanı', avatar: 'MK', color: 'emerald', leads: 5, converted: 3, totalSale: 228000, commRate: 3.5, earned: 7980, approved: 2, pending: 1, paid: 4788 },
  { id: 4, name: 'Seda Yılmaz', title: 'Sosyal Medya Uzmanı', avatar: 'SY', color: 'amber', leads: 4, converted: 2, totalSale: 138000, commRate: 3, earned: 4140, approved: 1, pending: 1, paid: 2070 },
];

const INITIAL_PRIM_RECORDS: PrimRecord[] = [
  { id: 1, staffId: 1, staffName: 'Zeynep Acar', co: 'Teknosoft A.Ş.', services: ['SEO', 'Web Sitesi', 'Sosyal Medya'], saleAmount: 185000, commRate: 4, earned: 7400, status: 'Onaylandı', stClr: 'emerald', payStatus: 'Ödendi', psClr: 'emerald', contractDate: '18 Nis 2026', payDate: '22 Nis 2026', note: '' },
  { id: 2, staffId: 2, staffName: 'Ayşe Demir', co: 'Dijital Medya Ltd.', services: ['Google Ads', 'Meta Reklam'], saleAmount: 96000, commRate: 4, earned: 3840, status: 'Onaylandı', stClr: 'emerald', payStatus: 'Ödendi', psClr: 'emerald', contractDate: '19 Nis 2026', payDate: '22 Nis 2026', note: '' },
  { id: 3, staffId: 1, staffName: 'Zeynep Acar', co: 'Finans Tech Ltd.', services: ['SEO', 'Web Sitesi'], saleAmount: 78000, commRate: 4, earned: 3120, status: 'Onaylandı', stClr: 'emerald', payStatus: 'Bekliyor', psClr: 'amber', contractDate: '20 Nis 2026', payDate: '—', note: 'Finans aktarımı bekleniyor' },
  { id: 4, staffId: 2, staffName: 'Ayşe Demir', co: 'E-ticaret Pro', services: ['SEO', 'Google Ads', 'Sosyal Medya'], saleAmount: 144000, commRate: 4, earned: 5760, status: 'Onay Bekliyor', stClr: 'amber', payStatus: 'Bekliyor', psClr: 'gray', contractDate: '21 Nis 2026', payDate: '—', note: 'İmza süreci devam ediyor' },
  { id: 5, staffId: 3, staffName: 'Mert Kaya', co: 'Mobilya Dünyası Ltd.', services: ['Meta Reklam'], saleAmount: 36000, commRate: 3.5, earned: 1260, status: 'Onaylandı', stClr: 'emerald', payStatus: 'Ödendi', psClr: 'emerald', contractDate: '17 Nis 2026', payDate: '22 Nis 2026', note: '' },
  { id: 6, staffId: 3, staffName: 'Mert Kaya', co: 'Kafkas İnşaat', services: ['Marka & Kimlik', 'Web Sitesi'], saleAmount: 120000, commRate: 3.5, earned: 4200, status: 'Onay Bekliyor', stClr: 'amber', payStatus: 'Bekliyor', psClr: 'gray', contractDate: '22 Nis 2026', payDate: '—', note: 'Sözleşme imza bekleniyor' },
  { id: 7, staffId: 4, staffName: 'Seda Yılmaz', co: 'Hızlı Lojistik', services: ['SEO', 'Google Ads'], saleAmount: 54000, commRate: 3, earned: 1620, status: 'Onay Bekliyor', stClr: 'amber', payStatus: 'Bekliyor', psClr: 'gray', contractDate: '21 Nis 2026', payDate: '—', note: 'Sözleşme gönderildi' },
  { id: 8, staffId: 2, staffName: 'Ayşe Demir', co: 'Hızlı Lojistik', services: ['Web Sitesi', 'E-Bülten'], saleAmount: 54000, commRate: 4, earned: 2160, status: 'Onaylandı', stClr: 'emerald', payStatus: 'Ödendi', psClr: 'emerald', contractDate: '15 Nis 2026', payDate: '19 Nis 2026', note: '' },
  { id: 9, staffId: 4, staffName: 'Seda Yılmaz', co: 'Eğitim Platform A.Ş.', services: ['Sosyal Medya', 'E-Bülten'], saleAmount: 42000, commRate: 3, earned: 1260, status: 'Revize', stClr: 'rose', payStatus: 'Bekliyor', psClr: 'gray', contractDate: '—', payDate: '—', note: 'Teknik şartname eksik, revize gerekiyor' },
  { id: 10, staffId: 1, staffName: 'Zeynep Acar', co: 'Eğitim Platform A.Ş.', services: ['Sosyal Medya'], saleAmount: 42000, commRate: 4, earned: 1680, status: 'Onay Bekliyor', stClr: 'amber', payStatus: 'Bekliyor', psClr: 'gray', contractDate: '—', payDate: '—', note: '' },
];

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

function formatCurrency(value: number) {
  return `₺${value.toLocaleString('tr-TR')}`;
}

function shortStaffName(name: string) {
  if (name === 'Tümü') return 'Tümü';
  const parts = name.split(' ');
  return `${parts[0]} ${parts[1]?.charAt(0)}.`;
}

export default function PrimYonetimi() {
  const [selectedStaffFilter, setSelectedStaffFilter] = useState('Tümü');
  const [records, setRecords] = useState(INITIAL_PRIM_RECORDS);
  const [selectedRecord, setSelectedRecord] = useState<PrimRecord | null>(null);

  const totalEarned = records.reduce((sum, record) => sum + record.earned, 0);
  const totalPaid = records.filter((record) => record.payStatus === 'Ödendi').reduce((sum, record) => sum + record.earned, 0);
  const totalPending = totalEarned - totalPaid;
  const waitingApproval = records.filter((record) => record.status === 'Onay Bekliyor').length;
  const totalSale = records.reduce((sum, record) => sum + record.saleAmount, 0);
  const staffFilters = ['Tümü', ...STAFF.map((staff) => staff.name)];
  const filtered = useMemo(() => (selectedStaffFilter === 'Tümü' ? records : records.filter((record) => record.staffName === selectedStaffFilter)), [records, selectedStaffFilter]);

  function updateRecord(id: number, patch: Partial<PrimRecord>) {
    setRecords((current) => current.map((record) => (record.id === id ? { ...record, ...patch } : record)));
    setSelectedRecord((current) => (current?.id === id ? { ...current, ...patch } : current));
  }

  function approveRecord(id: number) {
    updateRecord(id, { status: 'Onaylandı', stClr: 'emerald', payStatus: 'Bekliyor', psClr: 'amber', note: 'Finans aktarımı bekleniyor' });
  }

  function rejectRecord(id: number) {
    updateRecord(id, { status: 'Revize', stClr: 'rose', payStatus: 'Bekliyor', psClr: 'gray', note: 'Prim kaydı revize için geri gönderildi' });
  }

  function payRecord(id: number) {
    updateRecord(id, { payStatus: 'Ödendi', psClr: 'emerald', payDate: '22 Nis 2026', note: '' });
  }

  const kpis = [
    { l: 'Toplam Prim Yükü', v: formatCurrency(totalEarned), c: 'violet' as ColorName },
    { l: 'Ödenen Prim', v: formatCurrency(totalPaid), c: 'emerald' as ColorName },
    { l: 'Bekleyen Prim', v: formatCurrency(totalPending), c: 'amber' as ColorName },
    { l: 'Onay Bekleyen', v: `${waitingApproval} Kayıt`, c: 'rose' as ColorName },
    { l: 'Prim Doğuran Satış', v: formatCurrency(totalSale), c: 'sky' as ColorName },
  ];

  return (
    <div className="relative space-y-4 md:space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-violet-100 dark:bg-violet-900/40 rounded-xl flex items-center justify-center shrink-0">
            <Icon className="text-violet-600 dark:text-violet-400 w-5 h-5">{P.dollar}</Icon>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[19px] font-bold text-gray-900 dark:text-gray-100 leading-tight">Prim Yönetimi</h1>
              <span className="flex items-center gap-1 px-2 py-0.5 bg-violet-100 dark:bg-violet-900/40 border border-violet-200 dark:border-violet-800/40 rounded-full">
                <Icon className="w-3 h-3 text-violet-600 dark:text-violet-400">{P.shield}</Icon>
                <span className="text-[9px] font-bold text-violet-700 dark:text-violet-300 uppercase tracking-wide">Direktör</span>
              </span>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">Pazarlama ekibinin yönlendirdiği ve işe dönüşen taleplerin prim takibi</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-[12px] font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <Icon>{P.upload}</Icon> Rapor İndir
          </button>
          <button
            onClick={() => records.filter((record) => record.status === 'Onay Bekliyor').forEach((record) => approveRecord(record.id))}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 dark:bg-gray-100 dark:text-gray-900 text-white text-[12px] font-semibold rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Icon className="text-white dark:text-gray-900 w-3.5 h-3.5">{P.chk}</Icon> Toplu Onayla
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {kpis.map((kpi) => {
          const tone = CM[kpi.c] || CM.gray;
          return (
            <div key={kpi.l} className="bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2.5 hover:shadow-sm dark:hover:border-gray-700 transition-all">
              <p className={`text-[17px] font-bold ${tone.t} leading-none mb-0.5`}>{kpi.v}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">{kpi.l}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {STAFF.map((staff) => {
          const tone = CM[staff.color] || CM.violet;
          const paidPct = staff.earned > 0 ? Math.round((staff.paid / staff.earned) * 100) : 0;
          return (
            <div key={staff.id} className="bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-800 rounded-xl p-4 hover:shadow-md dark:hover:border-gray-700 transition-all cursor-pointer" onClick={() => setSelectedStaffFilter(staff.name)}>
              <div className="flex items-start gap-2.5 mb-3">
                <div className={`w-9 h-9 ${tone.bg} rounded-full flex items-center justify-center shrink-0`}>
                  <span className={`text-[11px] font-bold ${tone.t}`}>{staff.avatar}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100 truncate">{staff.name}</p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-600 truncate">{staff.title}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-3 text-center">
                <div className="p-2 bg-gray-50 dark:bg-[#0a0a0c]/50 rounded-lg"><p className="text-[13px] font-bold text-gray-900 dark:text-gray-100">{staff.leads}</p><p className="text-[9px] text-gray-400 dark:text-gray-600">Yönlendirme</p></div>
                <div className="p-2 bg-gray-50 dark:bg-[#0a0a0c]/50 rounded-lg"><p className="text-[13px] font-bold text-emerald-600 dark:text-emerald-400">{staff.converted}</p><p className="text-[9px] text-gray-400 dark:text-gray-600">Dönüşüm</p></div>
              </div>
              <div className="mb-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">Hak Edilen Prim</span>
                  <span className={`text-[11px] font-bold ${tone.t}`}>{formatCurrency(staff.earned)}</span>
                </div>
                <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className={`h-full ${tone.bar} rounded-full transition-all`} style={{ width: `${paidPct}%` }} />
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[9px] text-gray-400 dark:text-gray-600">Ödenen: {formatCurrency(staff.paid)}</span>
                  <span className={`text-[9px] ${tone.t} font-medium`}>%{paidPct}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">{staff.approved > 0 ? <><span className="w-2 h-2 rounded-full bg-emerald-500" />{staff.approved} onaylı</> : null}</span>
                {staff.pending > 0 ? <><span className="mx-1 text-gray-300 dark:text-gray-700">·</span><span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" />{staff.pending} bekleyen</span></> : null}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100">Satış Ekibi Prim Hak Ediş Listesi</p>
            <div className="flex flex-wrap gap-1.5" id="primFilterBtns">
              {staffFilters.map((filter) => (
                <button key={filter} onClick={() => setSelectedStaffFilter(filter)} className={`pf-btn px-2.5 py-1 text-[10px] font-medium rounded-md transition-all ${selectedStaffFilter === filter ? 'bg-violet-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
                  {shortStaffName(filter)}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50/70 dark:bg-[#0a0a0c]/50">
                <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide">Pazarlama Personeli</th>
                <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide">Firma / İş</th>
                <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide">Hizmet</th>
                <th className="px-3 py-2.5 text-right text-[10px] font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide">Satış Tutarı</th>
                <th className="px-3 py-2.5 text-center text-[10px] font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide">Oran</th>
                <th className="px-3 py-2.5 text-right text-[10px] font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide">Hak Edilen Prim</th>
                <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide">Onay</th>
                <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide">Ödeme</th>
                <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide">Tarih</th>
                <th className="px-3 py-2.5 text-center text-[10px] font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filtered.map((record) => {
                const staff = STAFF.find((item) => item.id === record.staffId);
                const tone = CM[staff?.color || 'violet'];
                return (
                  <tr key={record.id} className="gr group">
                    <td className="px-3 py-3"><div className="flex items-center gap-2"><div className={`w-7 h-7 ${tone.bg} rounded-full flex items-center justify-center shrink-0`}><span className={`text-[9px] font-bold ${tone.t}`}>{staff?.avatar || '?'}</span></div><span className="text-[12px] font-medium text-gray-900 dark:text-gray-100">{record.staffName}</span></div></td>
                    <td className="px-3 py-3 text-[12px] text-gray-700 dark:text-gray-300">{record.co}</td>
                    <td className="px-3 py-3"><div className="flex flex-wrap gap-1">{record.services.slice(0, 2).map((service) => <Bdg key={service} color="indigo">{service}</Bdg>)}{record.services.length > 2 ? <span className="text-[10px] text-gray-400">+{record.services.length - 2}</span> : null}</div></td>
                    <td className="px-3 py-3 text-right text-[12px] font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(record.saleAmount)}</td>
                    <td className="px-3 py-3 text-center text-[12px] text-gray-600 dark:text-gray-400">%{record.commRate}</td>
                    <td className="px-3 py-3 text-right text-[13px] font-bold text-violet-700 dark:text-violet-300">{formatCurrency(record.earned)}</td>
                    <td className="px-3 py-3"><Bdg color={record.stClr}>{record.status}</Bdg></td>
                    <td className="px-3 py-3"><Bdg color={record.psClr}>{record.payStatus}</Bdg></td>
                    <td className="px-3 py-3 text-[10px] text-gray-400 dark:text-gray-600">{record.contractDate}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {record.status === 'Onay Bekliyor' ? (
                          <>
                            <button onClick={() => approveRecord(record.id)} className="px-2 py-1 text-[9px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors">Onayla</button>
                            <button onClick={() => rejectRecord(record.id)} className="px-2 py-1 text-[9px] font-bold bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 rounded-md hover:bg-rose-200 transition-colors">Reddet</button>
                          </>
                        ) : record.status === 'Onaylandı' && record.payStatus !== 'Ödendi' ? (
                          <button onClick={() => payRecord(record.id)} className="px-2 py-1 text-[9px] font-bold bg-violet-600 hover:bg-violet-700 text-white rounded-md transition-colors">Ödeme Yap</button>
                        ) : (
                          <button onClick={() => setSelectedRecord(record)} className="w-7 h-7 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-md transition-all" title="Detay">
                            <Icon>{P.eye}</Icon>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-800">
          {filtered.map((record) => {
            const staff = STAFF.find((item) => item.id === record.staffId);
            const tone = CM[staff?.color || 'violet'];
            return (
              <div key={record.id} className="p-3">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 ${tone.bg} rounded-full flex items-center justify-center shrink-0`}><span className={`text-[9px] font-bold ${tone.t}`}>{staff?.avatar || '?'}</span></div>
                    <div><p className="text-[12px] font-semibold text-gray-900 dark:text-gray-100">{record.staffName}</p><p className="text-[10px] text-gray-400 dark:text-gray-600">{record.co}</p></div>
                  </div>
                  <span className="text-[13px] font-bold text-violet-700 dark:text-violet-300">{formatCurrency(record.earned)}</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-2">{record.services.slice(0, 2).map((service) => <Bdg key={service} color="indigo">{service}</Bdg>)}</div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5"><Bdg color={record.stClr}>{record.status}</Bdg><Bdg color={record.psClr}>{record.payStatus}</Bdg></div>
                  <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-400">{formatCurrency(record.saleAmount)} · %{record.commRate}</span>
                </div>
                {record.note ? <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1.5">{record.note}</p> : null}
              </div>
            );
          })}
        </div>
        <div className="px-4 py-2.5 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-[#0a0a0c]/30">
          <span className="text-[11px] text-gray-500 dark:text-gray-500">{filtered.length} kayıt · Toplam prim: {formatCurrency(filtered.reduce((sum, record) => sum + record.earned, 0))}</span>
          <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400">
            <span>Ortalama prim oranı: <strong className="text-violet-600 dark:text-violet-400">%{(filtered.reduce((sum, record) => sum + record.commRate, 0) / filtered.length || 0).toFixed(1)}</strong></span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-900/10 dark:to-[#17171a] border border-violet-200 dark:border-violet-800/40 rounded-xl p-4">
          <p className="text-[11px] font-bold text-gray-900 dark:text-gray-100 mb-3">Prim &amp; Karlılık Özeti</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white/70 dark:bg-white/5 rounded-lg p-3"><p className="text-[9px] text-gray-400 dark:text-gray-600 uppercase tracking-wide mb-0.5">Toplam Yük</p><p className="text-[15px] font-bold text-gray-900 dark:text-gray-100">{formatCurrency(totalEarned)}</p></div>
            <div className="bg-white/70 dark:bg-white/5 rounded-lg p-3"><p className="text-[9px] text-gray-400 dark:text-gray-600 uppercase tracking-wide mb-0.5">Ödenen</p><p className="text-[15px] font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(totalPaid)}</p></div>
            <div className="bg-white/70 dark:bg-white/5 rounded-lg p-3"><p className="text-[9px] text-gray-400 dark:text-gray-600 uppercase tracking-wide mb-0.5">Bekleyen</p><p className="text-[15px] font-bold text-amber-600 dark:text-amber-400">{formatCurrency(totalPending)}</p></div>
            <div className="bg-white/70 dark:bg-white/5 rounded-lg p-3"><p className="text-[9px] text-gray-400 dark:text-gray-600 uppercase tracking-wide mb-0.5">Toplam Satış</p><p className="text-[15px] font-bold text-sky-600 dark:text-sky-400">{formatCurrency(totalSale)}</p></div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/10 dark:to-[#17171a] border border-emerald-200 dark:border-emerald-800/40 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-start gap-2 mb-3">
            <Icon className="text-emerald-600 dark:text-emerald-400 w-4 h-4 shrink-0 mt-0.5">{P.info}</Icon>
            <div><p className="text-[11px] font-bold text-gray-900 dark:text-gray-100 mb-0.5">Sistem Notu</p><p className="text-[11px] text-gray-600 dark:text-gray-400">Primler, ilgili iş operasyona geçtikten ve finans onay süreci netleştikten sonra kesinleşir. Onaylanan primler FinansPanosu'na otomatik aktarılır.</p></div>
          </div>
          <div className="flex items-center gap-2 p-2.5 bg-white/60 dark:bg-white/5 rounded-lg">
            <Icon className="w-3.5 h-3.5 text-violet-500 shrink-0">{P.shield}</Icon>
            <p className="text-[10px] text-gray-600 dark:text-gray-400">Bu ekran yalnızca <strong>Pazarlama Direktörü</strong> tarafından görüntülenebilir. Diğer personelin menüsünde gizlidir.</p>
          </div>
        </div>
      </div>

      {selectedRecord ? <PrimDetailModal record={selectedRecord} onClose={() => setSelectedRecord(null)} onApprove={approveRecord} onReject={rejectRecord} onPay={payRecord} /> : null}
    </div>
  );
}

function PrimDetailModal({ record, onClose, onApprove, onReject, onPay }: { record: PrimRecord; onClose: () => void; onApprove: (id: number) => void; onReject: (id: number) => void; onPay: (id: number) => void }) {
  const staff = STAFF.find((item) => item.id === record.staffId);
  const tone = CM[staff?.color || 'violet'];

  return (
    <div className="absolute inset-0 z-30 flex items-start justify-center pt-10 px-3 bg-white/70 dark:bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 ${tone.bg} rounded-full flex items-center justify-center shrink-0`}><span className={`text-[11px] font-bold ${tone.t}`}>{staff?.avatar || '?'}</span></div>
            <div><p className="text-[13px] font-bold text-gray-900 dark:text-gray-100">Prim Detayı</p><p className="text-[10px] text-gray-400 dark:text-gray-600">{record.staffName} · {record.co}</p></div>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 dark:text-gray-500 transition-colors">
            <Icon>{P.x}</Icon>
          </button>
        </div>
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div className="bg-gray-50 dark:bg-[#0a0a0c]/50 rounded-lg p-3"><p className="text-[9px] text-gray-400 dark:text-gray-600 uppercase tracking-wide mb-0.5">Satış Tutarı</p><p className="text-[13px] font-bold text-gray-900 dark:text-gray-100">{formatCurrency(record.saleAmount)}</p></div>
            <div className="bg-gray-50 dark:bg-[#0a0a0c]/50 rounded-lg p-3"><p className="text-[9px] text-gray-400 dark:text-gray-600 uppercase tracking-wide mb-0.5">Prim Oranı</p><p className="text-[13px] font-bold text-gray-900 dark:text-gray-100">%{record.commRate}</p></div>
            <div className="bg-gray-50 dark:bg-[#0a0a0c]/50 rounded-lg p-3"><p className="text-[9px] text-gray-400 dark:text-gray-600 uppercase tracking-wide mb-0.5">Hak Edilen</p><p className="text-[13px] font-bold text-violet-700 dark:text-violet-300">{formatCurrency(record.earned)}</p></div>
            <div className="bg-gray-50 dark:bg-[#0a0a0c]/50 rounded-lg p-3"><p className="text-[9px] text-gray-400 dark:text-gray-600 uppercase tracking-wide mb-0.5">Ödeme Tarihi</p><p className="text-[13px] font-bold text-gray-900 dark:text-gray-100">{record.payDate}</p></div>
          </div>
          <div className="bg-gray-50 dark:bg-[#0a0a0c]/50 rounded-lg p-3">
            <p className="text-[10px] text-gray-400 dark:text-gray-600 uppercase tracking-wide mb-1.5">Hizmetler</p>
            <div className="flex flex-wrap gap-1">{record.services.map((service) => <Bdg key={service} color="indigo">{service}</Bdg>)}</div>
          </div>
          <div className="flex items-center gap-2">
            <Bdg color={record.stClr}>{record.status}</Bdg>
            <Bdg color={record.psClr}>{record.payStatus}</Bdg>
            <span className="text-[10px] text-gray-400 dark:text-gray-600">{record.contractDate}</span>
          </div>
          {record.note ? <div className="flex items-start gap-2 p-2.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 rounded-lg"><Icon className="text-amber-600 dark:text-amber-400 w-3.5 h-3.5 shrink-0 mt-0.5">{P.info}</Icon><p className="text-[10px] text-amber-700 dark:text-amber-300">{record.note}</p></div> : null}
        </div>
        <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-2">
          {record.status === 'Onay Bekliyor' ? (
            <>
              <button onClick={() => { onReject(record.id); onClose(); }} className="px-3 py-1.5 text-[11px] font-bold bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 rounded-md hover:bg-rose-200 transition-colors">Reddet</button>
              <button onClick={() => { onApprove(record.id); onClose(); }} className="px-3 py-1.5 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors">Onayla</button>
            </>
          ) : record.status === 'Onaylandı' && record.payStatus !== 'Ödendi' ? (
            <button onClick={() => { onPay(record.id); onClose(); }} className="px-3 py-1.5 text-[11px] font-bold bg-violet-600 hover:bg-violet-700 text-white rounded-md transition-colors">Ödeme Yap</button>
          ) : null}
          <button onClick={onClose} className="px-3 py-1.5 text-[11px] font-medium bg-white dark:bg-[#0a0a0c] border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Kapat</button>
        </div>
      </div>
    </div>
  );
}
