import { type ReactNode, useMemo, useState } from 'react';

type ColorName = 'gray' | 'sky' | 'violet' | 'emerald' | 'amber' | 'rose' | 'indigo';

type Staff = {
  id: number;
  name: string;
  title: string;
  avatar: string;
  color: Exclude<ColorName, 'gray' | 'rose' | 'indigo'>;
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
  status: 'Onaylandı' | 'Onay Bekliyor' | 'Revize';
  stClr: ColorName;
  payStatus: 'Ödendi' | 'Bekliyor';
  psClr: ColorName;
  contractDate: string;
  payDate: string;
  note: string;
};

const CM: Record<ColorName, { bg: string; t: string }> = {
  gray: { bg: 'bg-gray-50 dark:bg-gray-500/10', t: 'text-gray-700 dark:text-gray-300' },
  sky: { bg: 'bg-sky-50 dark:bg-sky-500/10', t: 'text-sky-700 dark:text-sky-300' },
  violet: { bg: 'bg-violet-50 dark:bg-violet-500/10', t: 'text-violet-700 dark:text-violet-300' },
  emerald: { bg: 'bg-emerald-50 dark:bg-emerald-500/10', t: 'text-emerald-700 dark:text-emerald-300' },
  amber: { bg: 'bg-amber-50 dark:bg-amber-500/10', t: 'text-amber-700 dark:text-amber-300' },
  rose: { bg: 'bg-rose-50 dark:bg-rose-500/10', t: 'text-rose-700 dark:text-rose-300' },
  indigo: { bg: 'bg-indigo-50 dark:bg-indigo-500/10', t: 'text-indigo-700 dark:text-indigo-300' },
};

const STAFF: Staff[] = [
  { id: 1, name: 'Zeynep Acar', title: 'Pazarlama Uzmanı', avatar: 'ZA', color: 'violet', leads: 8, converted: 5, totalSale: 387000, commRate: 4, earned: 15480, approved: 2, pending: 3, paid: 10200 },
  { id: 2, name: 'Ayşe Demir', title: 'Dijital Pazarlama Uzmanı', avatar: 'AD', color: 'sky', leads: 6, converted: 4, totalSale: 312000, commRate: 4, earned: 12480, approved: 3, pending: 1, paid: 9360 },
  { id: 3, name: 'Mert Kaya', title: 'İçerik & Lead Uzmanı', avatar: 'MK', color: 'emerald', leads: 5, converted: 3, totalSale: 228000, commRate: 3.5, earned: 7980, approved: 2, pending: 1, paid: 4788 },
  { id: 4, name: 'Seda Yılmaz', title: 'Sosyal Medya Uzmanı', avatar: 'SY', color: 'amber', leads: 4, converted: 2, totalSale: 138000, commRate: 3, earned: 4140, approved: 1, pending: 1, paid: 2070 },
];

const PRIM_RECORDS: PrimRecord[] = [
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

function Icon({ children, className = 'w-3.5 h-3.5' }: { children: ReactNode; className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      {children}
    </svg>
  );
}

function Bdg({ children, color }: { children: ReactNode; color: ColorName }) {
  const cm = CM[color] || CM.gray;
  return <span className={`px-1.5 py-0.5 ${cm.bg} ${cm.t} rounded text-[9px] font-medium whitespace-nowrap`}>{children}</span>;
}

function ABtn({ title, onClick }: { title: string; onClick?: () => void }) {
  return (
    <button title={title} onClick={onClick} className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors ">
      <Icon><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></Icon>
    </button>
  );
}

function staffColor(staffId: number): ColorName {
  return ({ 1: 'violet', 2: 'sky', 3: 'emerald', 4: 'amber' } as Record<number, ColorName>)[staffId] || 'violet';
}

function shortName(name: string) {
  if (name === 'Tümü') return 'Tümü';
  const [first, second] = name.split(' ');
  return `${first} ${second?.charAt(0) ?? ''}.`;
}

export default function PrimYonetimi() {
  const [records, setRecords] = useState<PrimRecord[]>(PRIM_RECORDS);
  const [selectedStaffFilter, setSelectedStaffFilter] = useState('Tümü');
  const [detailRecord, setDetailRecord] = useState<PrimRecord | null>(null);

  const totalEarned = records.reduce((s, x) => s + x.earned, 0);
  const totalPaid = records.filter((x) => x.payStatus === 'Ödendi').reduce((s, x) => s + x.earned, 0);
  const totalPending = totalEarned - totalPaid;
  const waitingApproval = records.filter((x) => x.status === 'Onay Bekliyor').length;
  const totalSale = records.reduce((s, x) => s + x.saleAmount, 0);

  const kpis = [
    { l: 'Toplam Prim Yükü', v: `₺${totalEarned.toLocaleString('tr-TR')}`, c: 'violet' as ColorName },
    { l: 'Ödenen Prim', v: `₺${totalPaid.toLocaleString('tr-TR')}`, c: 'emerald' as ColorName },
    { l: 'Bekleyen Prim', v: `₺${totalPending.toLocaleString('tr-TR')}`, c: 'amber' as ColorName },
    { l: 'Onay Bekleyen', v: `${waitingApproval} Kayıt`, c: 'rose' as ColorName },
    { l: 'Prim Doğuran Satış', v: `₺${totalSale.toLocaleString('tr-TR')}`, c: 'sky' as ColorName },
  ];

  const staffFilters = ['Tümü', ...STAFF.map((s) => s.name)];
  const filtered = useMemo(
    () => selectedStaffFilter === 'Tümü' ? records : records.filter((x) => x.staffName === selectedStaffFilter),
    [records, selectedStaffFilter],
  );

  const updateRecord = (recordId: number, patch: Partial<PrimRecord>) => {
    setRecords((current) => current.map((record) => record.id === recordId ? { ...record, ...patch } : record));
    setDetailRecord((current) => current?.id === recordId ? { ...current, ...patch } : current);
  };

  const approveAll = () => {
    setRecords((current) => current.map((record) => (
      record.status === 'Onay Bekliyor' ? { ...record, status: 'Onaylandı', stClr: 'emerald', payStatus: 'Bekliyor', psClr: 'amber' } : record
    )));
  };

  return (
    <div className="relative space-y-5 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-violet-100 dark:bg-violet-900/40 rounded-xl flex items-center justify-center shrink-0">
            <Icon className="text-violet-600 dark:text-violet-400 w-5 h-5"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></Icon>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[19px] font-bold text-gray-900 dark:text-gray-100 leading-tight">Prim Yönetimi</h1>
              <span className="flex items-center gap-1 px-2 py-0.5 bg-violet-100 dark:bg-violet-900/40 border border-violet-200 dark:border-violet-800/40 rounded-full">
                <Icon className="w-3 h-3 text-violet-600 dark:text-violet-400"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></Icon>
                <span className="text-[9px] font-bold text-violet-700 dark:text-violet-300 uppercase tracking-wide">Direktör</span>
              </span>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">Pazarlama ekibinin yönlendirdiği ve işe dönüşen taleplerin prim takibi</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-[12px] font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <Icon className="w-3.5 h-3.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></Icon> Rapor İndir
          </button>
          <button onClick={approveAll} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 dark:bg-gray-100 dark:text-gray-900 text-white text-[12px] font-semibold rounded-lg hover:bg-gray-800 transition-colors">
            <Icon className="text-white dark:text-gray-900"><polyline points="20 6 9 17 4 12" /></Icon> Toplu Onayla
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {kpis.map((k) => {
          const cm = CM[k.c] || CM.gray;
          return (
            <div key={k.l} className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl px-3 py-2.5 hover:shadow-sm dark:hover:border-gray-700 transition-all">
              <p className={`text-[17px] font-bold ${cm.t} leading-none mb-0.5`}>{k.v}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">{k.l}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {STAFF.map((s) => {
          const cm = CM[s.color] || CM.violet;
          const paidPct = s.earned > 0 ? Math.round((s.paid / s.earned) * 100) : 0;
          const barClr = { violet: 'bg-violet-500', sky: 'bg-sky-500', emerald: 'bg-emerald-500', amber: 'bg-amber-500' }[s.color] || 'bg-violet-500';
          return (
            <div key={s.id} className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-4 hover:shadow-md dark:hover:border-gray-700 transition-all cursor-pointer" onClick={() => setSelectedStaffFilter(s.name)}>
              <div className="flex items-start gap-2.5 mb-3">
                <div className={`w-9 h-9 ${cm.bg} rounded-full flex items-center justify-center shrink-0`}>
                  <span className={`text-[11px] font-bold ${cm.t}`}>{s.avatar}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100 truncate">{s.name}</p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-600 truncate">{s.title}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-3 text-center">
                <div className="p-2 bg-gray-50 dark:bg-[#161720]/50 rounded-lg">
                  <p className="text-[13px] font-bold text-gray-900 dark:text-gray-100">{s.leads}</p>
                  <p className="text-[9px] text-gray-400 dark:text-gray-600">Yönlendirme</p>
                </div>
                <div className="p-2 bg-gray-50 dark:bg-[#161720]/50 rounded-lg">
                  <p className="text-[13px] font-bold text-emerald-600 dark:text-emerald-400">{s.converted}</p>
                  <p className="text-[9px] text-gray-400 dark:text-gray-600">Dönüşüm</p>
                </div>
              </div>
              <div className="mb-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">Hak Edilen Prim</span>
                  <span className={`text-[11px] font-bold ${cm.t}`}>₺{s.earned.toLocaleString('tr-TR')}</span>
                </div>
                <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className={`h-full ${barClr} rounded-full transition-all`} style={{ width: `${paidPct}%` }}></div>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[9px] text-gray-400 dark:text-gray-600">Ödenen: ₺{s.paid.toLocaleString('tr-TR')}</span>
                  <span className={`text-[9px] ${cm.t} font-medium`}>%{paidPct}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">{s.approved > 0 ? <><span className="w-2 h-2 rounded-full bg-emerald-500"></span>{s.approved} onaylı</> : null}</span>
                {s.pending > 0 ? <><span className="mx-1 text-gray-300 dark:text-gray-700">·</span><span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400"></span>{s.pending} bekleyen</span></> : null}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-600/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100">Satış Ekibi Prim Hak Ediş Listesi</p>
            <div className="flex flex-wrap gap-1.5" id="primFilterBtns">
              {staffFilters.map((f) => (
                <button key={f} onClick={() => setSelectedStaffFilter(f)} className={`pf-btn px-2.5 py-1 text-[10px] font-medium rounded-md transition-all ${selectedStaffFilter === f ? 'bg-violet-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>{shortName(f)}</button>
              ))}
            </div>
          </div>
        </div>
        <div className="hidden md:block">
          <table className="w-full border-collapse">
            <thead><tr className="border-b border-gray-200 dark:border-gray-600/50 bg-gray-50/70 dark:bg-[#161720]/50">
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
            </tr></thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/40">
              {filtered.map((r) => {
                const staff = STAFF.find((s) => s.id === r.staffId);
                const cm = CM[staffColor(r.staffId)] || CM.violet;
                return (
                  <tr key={r.id} className="gr group">
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 ${cm.bg} rounded-full flex items-center justify-center shrink-0`}><span className={`text-[9px] font-bold ${cm.t}`}>{staff?.avatar || '?'}</span></div>
                        <span className="text-[12px] font-medium text-gray-900 dark:text-gray-100">{r.staffName}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-[12px] text-gray-700 dark:text-gray-300">{r.co}</td>
                    <td className="px-3 py-3"><div className="flex flex-wrap gap-1">{r.services.slice(0, 2).map((s) => <Bdg key={s} color="indigo">{s}</Bdg>)}{r.services.length > 2 ? <span className="text-[10px] text-gray-400">+{r.services.length - 2}</span> : null}</div></td>
                    <td className="px-3 py-3 text-right text-[12px] font-semibold text-gray-900 dark:text-gray-100">₺{r.saleAmount.toLocaleString('tr-TR')}</td>
                    <td className="px-3 py-3 text-center text-[12px] text-gray-600 dark:text-gray-400">%{r.commRate}</td>
                    <td className="px-3 py-3 text-right text-[13px] font-bold text-violet-700 dark:text-violet-300">₺{r.earned.toLocaleString('tr-TR')}</td>
                    <td className="px-3 py-3"><Bdg color={r.stClr}>{r.status}</Bdg></td>
                    <td className="px-3 py-3"><Bdg color={r.psClr}>{r.payStatus}</Bdg></td>
                    <td className="px-3 py-3 text-[10px] text-gray-400 dark:text-gray-600">{r.contractDate}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {r.status === 'Onay Bekliyor' ? (
                          <>
                            <button onClick={() => updateRecord(r.id, { status: 'Onaylandı', stClr: 'emerald', payStatus: 'Bekliyor', psClr: 'amber' })} className="px-2 py-1 text-[9px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors">Onayla</button>
                            <button onClick={() => updateRecord(r.id, { status: 'Revize', stClr: 'rose' })} className="px-2 py-1 text-[9px] font-bold bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 rounded-md hover:bg-rose-200 transition-colors">Reddet</button>
                          </>
                        ) : r.status === 'Onaylandı' && r.payStatus !== 'Ödendi' ? (
                          <button onClick={() => updateRecord(r.id, { payStatus: 'Ödendi', psClr: 'emerald', payDate: '25 Nis 2026' })} className="px-2 py-1 text-[9px] font-bold bg-violet-600 hover:bg-violet-700 text-white rounded-md transition-colors">Ödeme Yap</button>
                        ) : (
                          <ABtn title="Detay" onClick={() => setDetailRecord(r)} />
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-700/40">
          {filtered.map((r) => {
            const staff = STAFF.find((s) => s.id === r.staffId);
            const cm = CM[staffColor(r.staffId)] || CM.violet;
            return (
              <div key={r.id} className="p-3">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 ${cm.bg} rounded-full flex items-center justify-center shrink-0`}><span className={`text-[9px] font-bold ${cm.t}`}>{staff?.avatar || '?'}</span></div>
                    <div><p className="text-[12px] font-semibold text-gray-900 dark:text-gray-100">{r.staffName}</p><p className="text-[10px] text-gray-400 dark:text-gray-600">{r.co}</p></div>
                  </div>
                  <span className="text-[13px] font-bold text-violet-700 dark:text-violet-300">₺{r.earned.toLocaleString('tr-TR')}</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-2">{r.services.slice(0, 2).map((s) => <Bdg key={s} color="indigo">{s}</Bdg>)}</div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5"><Bdg color={r.stClr}>{r.status}</Bdg> <Bdg color={r.psClr}>{r.payStatus}</Bdg></div>
                  <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-400">₺{r.saleAmount.toLocaleString('tr-TR')} · %{r.commRate}</span>
                </div>
                {r.note ? <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1.5">{r.note}</p> : null}
              </div>
            );
          })}
        </div>
        <div className="px-4 py-2.5 border-t border-gray-100 dark:border-gray-600/50 flex items-center justify-between bg-gray-50/50 dark:bg-[#161720]/30">
          <span className="text-[11px] text-gray-500 dark:text-gray-500">{filtered.length} kayıt · Toplam prim: ₺{filtered.reduce((s, x) => s + x.earned, 0).toLocaleString('tr-TR')}</span>
          <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400">
            <span>Ortalama prim oranı: <strong className="text-violet-600 dark:text-violet-400">%{((filtered.reduce((s, x) => s + x.commRate, 0) / filtered.length) || 0).toFixed(1)}</strong></span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-900/10 dark:to-[#17171a] border border-violet-200 dark:border-violet-800/40 rounded-xl p-4">
          <p className="text-[11px] font-bold text-gray-900 dark:text-gray-100 mb-3">Prim &amp; Karlılık Özeti</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white/70 dark:bg-white/5 rounded-lg p-3"><p className="text-[9px] text-gray-400 dark:text-gray-600 uppercase tracking-wide mb-0.5">Toplam Yük</p><p className="text-[15px] font-bold text-gray-900 dark:text-gray-100">₺{totalEarned.toLocaleString('tr-TR')}</p></div>
            <div className="bg-white/70 dark:bg-white/5 rounded-lg p-3"><p className="text-[9px] text-gray-400 dark:text-gray-600 uppercase tracking-wide mb-0.5">Ödenen</p><p className="text-[15px] font-bold text-emerald-600 dark:text-emerald-400">₺{totalPaid.toLocaleString('tr-TR')}</p></div>
            <div className="bg-white/70 dark:bg-white/5 rounded-lg p-3"><p className="text-[9px] text-gray-400 dark:text-gray-600 uppercase tracking-wide mb-0.5">Bekleyen</p><p className="text-[15px] font-bold text-amber-600 dark:text-amber-400">₺{totalPending.toLocaleString('tr-TR')}</p></div>
            <div className="bg-white/70 dark:bg-white/5 rounded-lg p-3"><p className="text-[9px] text-gray-400 dark:text-gray-600 uppercase tracking-wide mb-0.5">Toplam Satış</p><p className="text-[15px] font-bold text-sky-600 dark:text-sky-400">₺{totalSale.toLocaleString('tr-TR')}</p></div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/10 dark:to-[#17171a] border border-emerald-200 dark:border-emerald-800/40 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-start gap-2 mb-3">
            <Icon className="text-emerald-600 dark:text-emerald-400 w-4 h-4 shrink-0 mt-0.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></Icon>
            <div><p className="text-[11px] font-bold text-gray-900 dark:text-gray-100 mb-0.5">Sistem Notu</p><p className="text-[11px] text-gray-600 dark:text-gray-400">Primler, ilgili iş operasyona geçtikten ve finans onay süreci netleştikten sonra kesinleşir. Onaylanan primler FinansPanosu'na otomatik aktarılır.</p></div>
          </div>
          <div className="flex items-center gap-2 p-2.5 bg-white/60 dark:bg-white/5 rounded-lg">
            <Icon className="w-3.5 h-3.5 text-violet-500 shrink-0"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></Icon>
            <p className="text-[10px] text-gray-600 dark:text-gray-400">Bu ekran yalnızca <strong>Pazarlama Direktörü</strong> tarafından görüntülenebilir. Diğer personelin menüsünde gizlidir.</p>
          </div>
        </div>
      </div>

      {detailRecord ? (
        <div className="absolute inset-0 z-20 flex items-start justify-center p-4 md:p-8 bg-black/20 dark:bg-black/40">
          <div className="w-full max-w-2xl bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl shadow-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700/40 flex items-center justify-between">
              <div>
                <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100">Prim Detayı</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">{detailRecord.staffName} · {detailRecord.co}</p>
              </div>
              <button onClick={() => setDetailRecord(null)} className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                <Icon><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Icon>
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <div className="bg-gray-50 dark:bg-[#161720]/50 rounded-lg p-3"><p className="text-[9px] text-gray-400 dark:text-gray-600 uppercase tracking-wide mb-0.5">Satış</p><p className="text-[13px] font-bold text-gray-900 dark:text-gray-100">₺{detailRecord.saleAmount.toLocaleString('tr-TR')}</p></div>
                <div className="bg-gray-50 dark:bg-[#161720]/50 rounded-lg p-3"><p className="text-[9px] text-gray-400 dark:text-gray-600 uppercase tracking-wide mb-0.5">Oran</p><p className="text-[13px] font-bold text-gray-900 dark:text-gray-100">%{detailRecord.commRate}</p></div>
                <div className="bg-violet-50 dark:bg-violet-500/10 rounded-lg p-3"><p className="text-[9px] text-violet-600 dark:text-violet-400 uppercase tracking-wide mb-0.5">Hak Edilen</p><p className="text-[13px] font-bold text-violet-700 dark:text-violet-300">₺{detailRecord.earned.toLocaleString('tr-TR')}</p></div>
                <div className="bg-gray-50 dark:bg-[#161720]/50 rounded-lg p-3"><p className="text-[9px] text-gray-400 dark:text-gray-600 uppercase tracking-wide mb-0.5">Tarih</p><p className="text-[13px] font-bold text-gray-900 dark:text-gray-100">{detailRecord.contractDate}</p></div>
              </div>
              <div className="flex flex-wrap gap-1">{detailRecord.services.map((service) => <Bdg key={service} color="indigo">{service}</Bdg>)}</div>
              {detailRecord.note ? <p className="text-[10px] text-amber-600 dark:text-amber-400">{detailRecord.note}</p> : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
