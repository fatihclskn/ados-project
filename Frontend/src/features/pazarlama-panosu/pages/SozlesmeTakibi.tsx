import { type ReactNode, useMemo, useState } from 'react';

type ColorName = 'emerald' | 'amber' | 'rose' | 'sky' | 'violet' | 'indigo' | 'gray';

type Contract = {
  id: number;
  co: string;
  rep: string;
  services: string[];
  amount: number;
  duration: string;
  contractStatus: string;
  csClr: ColorName;
  techSpec: string;
  tsClr: ColorName;
  custApproval: string;
  caClr: ColorName;
  financeStatus: string;
  fsClr: ColorName;
  lastAction: string;
  star: boolean;
  musNo: string | null;
  issue?: string;
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
  file: (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </>
  ),
  fileFold: (
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
  dollar: (
    <>
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </>
  ),
  alert: (
    <>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </>
  ),
  chk: <polyline points="20 6 9 17 4 12" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </>
  ),
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
  trend: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />,
  user: (
    <>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </>
  ),
};

const CONTRACTS: Contract[] = [
  { id: 1, co: 'Teknosoft A.Ş.', rep: 'Ahmet Yılmaz', services: ['SEO', 'Web Sitesi', 'Sosyal Medya'], amount: 185000, duration: '6 Ay', contractStatus: 'İmzalandı', csClr: 'emerald', techSpec: 'Hazır', tsClr: 'emerald', custApproval: 'Geldi', caClr: 'emerald', financeStatus: 'Bekliyor', fsClr: 'amber', lastAction: '2 saat önce', star: true, musNo: 'MUS-2024-1847' },
  { id: 2, co: 'Dijital Medya Ltd.', rep: 'Elif Kara', services: ['Google Ads', 'Meta Reklam'], amount: 96000, duration: '12 Ay', contractStatus: 'Finansa Aktarıldı', csClr: 'emerald', techSpec: 'Hazır', tsClr: 'emerald', custApproval: 'Geldi', caClr: 'emerald', financeStatus: 'Aktarıldı', fsClr: 'emerald', lastAction: '1 gün önce', star: false, musNo: 'MUS-2023-0921' },
  { id: 3, co: 'E-ticaret Pro', rep: 'Can Öztürk', services: ['SEO', 'Google Ads', 'Sosyal Medya'], amount: 144000, duration: '12 Ay', contractStatus: 'İmza Bekleniyor', csClr: 'violet', techSpec: 'Hazır', tsClr: 'emerald', custApproval: 'Bekliyor', caClr: 'amber', financeStatus: 'Bekliyor', fsClr: 'gray', lastAction: '3 saat önce', star: true, musNo: 'MUS-2024-2103' },
  { id: 4, co: 'Hızlı Lojistik', rep: 'Selin Demir', services: ['Web Sitesi', 'E-Bülten'], amount: 54000, duration: '6 Ay', contractStatus: 'Sözleşme Gönderildi', csClr: 'sky', techSpec: 'Hazır', tsClr: 'emerald', custApproval: 'Bekliyor', caClr: 'amber', financeStatus: 'Bekliyor', fsClr: 'gray', lastAction: '5 saat önce', star: false, musNo: 'MUS-2022-0145' },
  { id: 5, co: 'Finans Tech Ltd.', rep: 'Mehmet Yıldız', services: ['SEO', 'Web Sitesi'], amount: 78000, duration: '6 Ay', contractStatus: 'İmzalandı', csClr: 'emerald', techSpec: 'Hazır', tsClr: 'emerald', custApproval: 'Geldi', caClr: 'emerald', financeStatus: 'İşleniyor', fsClr: 'sky', lastAction: 'Bugün', star: true, musNo: 'MUS-2021-0672' },
  { id: 6, co: 'Eğitim Platform A.Ş.', rep: 'Deniz Kaya', services: ['Sosyal Medya', 'E-Bülten'], amount: 42000, duration: '3 Ay', contractStatus: 'Onay Bekliyor', csClr: 'amber', techSpec: 'Kontrol Gerekli', tsClr: 'amber', custApproval: 'Revize Gerekli', caClr: 'rose', financeStatus: 'Bekliyor', fsClr: 'gray', lastAction: '1 gün önce', star: false, issue: 'Eksik teknik şartname', musNo: 'MUS-2024-3078' },
  { id: 7, co: 'Mobilya Dünyası Ltd.', rep: 'Ayşe Çelik', services: ['Meta Reklam'], amount: 36000, duration: '6 Ay', contractStatus: 'İmzalandı', csClr: 'emerald', techSpec: 'Hazır', tsClr: 'emerald', custApproval: 'Geldi', caClr: 'emerald', financeStatus: 'Aktarıldı', fsClr: 'emerald', lastAction: '2 gün önce', star: false, musNo: 'MUS-2023-2244' },
  { id: 8, co: 'Kafkas İnşaat', rep: 'Ozan Kafkas', services: ['Marka & Kimlik', 'Web Sitesi'], amount: 120000, duration: '12 Ay', contractStatus: 'İmza Bekleniyor', csClr: 'violet', techSpec: 'Eksik', tsClr: 'rose', custApproval: 'Bekliyor', caClr: 'amber', financeStatus: 'Bekliyor', fsClr: 'gray', lastAction: '4 saat önce', star: true, issue: 'Eksik kaşe / vergi bilgisi', musNo: null },
];

const FILTERS = ['Tümü', 'Onay Bekliyor', 'Sözleşme Gönderildi', 'İmza Bekleniyor', 'İmzalandı', 'Finansa Aktarıldı', 'Sorunlu'];

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

function formatCurrency(value: number) {
  return `₺${value.toLocaleString('tr-TR')}`;
}

export default function SozlesmeTakibi() {
  const [activeFilter, setActiveFilter] = useState('Tümü');
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);

  const issues = CONTRACTS.filter((contract) => contract.issue);
  const filteredContracts = useMemo(() => {
    if (activeFilter === 'Tümü') return CONTRACTS;
    if (activeFilter === 'Sorunlu') return CONTRACTS.filter((contract) => contract.issue);
    return CONTRACTS.filter((contract) => contract.contractStatus === activeFilter);
  }, [activeFilter]);

  if (selectedContract) {
    return <ContractDetail contract={selectedContract} onBack={() => setSelectedContract(null)} />;
  }

  const kpis = [
    { l: 'Onay Bekleyen', v: CONTRACTS.filter((x) => x.contractStatus === 'Onay Bekliyor').length, c: 'amber' as ColorName },
    { l: 'Sözleşme Gönderildi', v: CONTRACTS.filter((x) => x.contractStatus === 'Sözleşme Gönderildi').length, c: 'sky' as ColorName },
    { l: 'İmza Bekleniyor', v: CONTRACTS.filter((x) => x.contractStatus === 'İmza Bekleniyor').length, c: 'violet' as ColorName },
    { l: 'İmzalandı', v: CONTRACTS.filter((x) => x.contractStatus === 'İmzalandı').length, c: 'emerald' as ColorName },
    { l: 'Finansa Aktarıldı', v: CONTRACTS.filter((x) => x.contractStatus === 'Finansa Aktarıldı').length, c: 'emerald' as ColorName },
    { l: 'Teknik Şartname Hazır', v: CONTRACTS.filter((x) => x.techSpec === 'Hazır').length, c: 'indigo' as ColorName },
  ];

  return (
    <div className="relative space-y-4 md:space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-violet-100 dark:bg-violet-900/40 rounded-xl flex items-center justify-center shrink-0">
            <Icon className="text-violet-600 dark:text-violet-400 w-5 h-5">{P.file}</Icon>
          </div>
          <div>
            <h1 className="text-[19px] font-bold text-gray-900 dark:text-gray-100 leading-tight">Sözleşme Takibi</h1>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">Satış onayı alınan işlerin sözleşme, teknik şartname, imza ve finans aktarım süreci</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setSelectedContract(CONTRACTS[0])} className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-[12px] font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <Icon>{P.eye}</Icon> Sözleşmeyi Gör
          </button>
          <button onClick={() => setSelectedContract(CONTRACTS.find((contract) => contract.contractStatus === 'İmzalandı') || CONTRACTS[0])} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 dark:bg-gray-100 dark:text-gray-900 text-white text-[12px] font-semibold rounded-lg hover:bg-gray-800 transition-colors">
            <Icon className="text-white dark:text-gray-900 w-3.5 h-3.5">{P.dollar}</Icon> Finansa Gönder
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
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

      {issues.length > 0 ? (
        <div className="flex items-start gap-3 p-3.5 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/40 rounded-xl">
          <Icon className="text-rose-500 dark:text-rose-400 w-4 h-4 shrink-0 mt-0.5">{P.alert}</Icon>
          <div className="flex-1">
            <p className="text-[12px] font-semibold text-rose-700 dark:text-rose-300 mb-1">Sorunlu Dosyalar / Eksik Belge — {issues.length} Kayıt</p>
            <div className="flex flex-wrap gap-2">
              {issues.map((contract) => (
                <span key={contract.id} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-rose-100 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800/40 rounded-lg text-[10px] font-medium text-rose-700 dark:text-rose-300">
                  <span className="font-bold">{contract.co}:</span> {contract.issue}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-1.5">
        {FILTERS.map((filter) => (
          <button key={filter} onClick={() => setActiveFilter(filter)} className={`cf-btn px-2.5 py-1 text-[11px] font-medium rounded-md transition-all ${activeFilter === filter ? 'bg-violet-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
            {filter}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50/70 dark:bg-[#0a0a0c]/50">
                <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide">Firma / Temsilci</th>
                <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide">Hizmet / Paket</th>
                <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide">Sözleşme</th>
                <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide">Teknik Şartname</th>
                <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide">Müşteri Onayı</th>
                <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide">Finans</th>
                <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide">Son</th>
                <th className="px-3 py-2.5 text-right text-[10px] font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredContracts.map((contract) => (
                <tr key={contract.id} className="gr group cursor-pointer" onClick={() => setSelectedContract(contract)}>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1.5">
                      {contract.star ? (
                        <Icon className="w-3 h-3 text-violet-500 fill-violet-500 shrink-0" fill="currentColor">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </Icon>
                      ) : (
                        <span className="w-3 h-3 shrink-0" />
                      )}
                      <div>
                        <p className="text-[12px] font-semibold text-gray-900 dark:text-gray-100 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">{contract.co}</p>
                        <p className="text-[10px] text-gray-400 dark:text-gray-600">{contract.rep}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-1">
                      {contract.services.slice(0, 2).map((service) => (
                        <Bdg key={service} color="indigo">{service}</Bdg>
                      ))}
                      {contract.services.length > 2 ? <span className="text-[10px] text-gray-400 dark:text-gray-600">+{contract.services.length - 2}</span> : null}
                    </div>
                  </td>
                  <td className="px-3 py-3"><Bdg color={contract.csClr}>{contract.contractStatus}</Bdg></td>
                  <td className="px-3 py-3"><Bdg color={contract.tsClr}>{contract.techSpec}</Bdg></td>
                  <td className="px-3 py-3"><Bdg color={contract.caClr}>{contract.custApproval}</Bdg></td>
                  <td className="px-3 py-3"><Bdg color={contract.fsClr}>{contract.financeStatus}</Bdg></td>
                  <td className="px-3 py-3"><span className="text-[10px] text-gray-400 dark:text-gray-600">{contract.lastAction}</span></td>
                  <td className="px-3 py-3">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          setSelectedContract(contract);
                        }}
                        className="px-2.5 py-1 text-[10px] font-bold bg-violet-600 hover:bg-violet-700 text-white rounded-md transition-colors"
                      >
                        Süreci Aç
                      </button>
                      <ActionIconButton title="Görüntüle" onClick={() => setSelectedContract(contract)}>
                        <Icon>{P.eye}</Icon>
                      </ActionIconButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-800">
          {filteredContracts.map((contract) => (
            <div key={contract.id} className="p-3 hover:bg-gray-50/70 dark:hover:bg-gray-800/30 transition-colors" onClick={() => setSelectedContract(contract)}>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <p className="text-[13px] font-semibold text-gray-900 dark:text-gray-100">{contract.co}</p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-600">{contract.rep}</p>
                </div>
                <Bdg color={contract.csClr}>{contract.contractStatus}</Bdg>
              </div>
              <div className="flex flex-wrap gap-1 mb-2">
                {contract.services.slice(0, 2).map((service) => (
                  <Bdg key={service} color="indigo">{service}</Bdg>
                ))}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Bdg color={contract.tsClr}>{contract.techSpec}</Bdg>
                <Bdg color={contract.caClr}>{contract.custApproval}</Bdg>
                <Bdg color={contract.fsClr}>{contract.financeStatus}</Bdg>
              </div>
              <button className="px-3 py-1.5 text-[11px] font-bold bg-violet-600 text-white rounded-lg w-full">Süreci Aç</button>
            </div>
          ))}
        </div>

        <div className="px-4 py-2.5 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-[#0a0a0c]/30">
          <span className="text-[11px] text-gray-500 dark:text-gray-500">{CONTRACTS.length} sözleşme takip ediliyor</span>
          <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-400">Toplam değer: {formatCurrency(CONTRACTS.reduce((sum, contract) => sum + contract.amount, 0))}</span>
        </div>
      </div>
    </div>
  );
}

function StepDone({ label, done, active }: { label: string; done: boolean; active: boolean }) {
  const cls = done ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700' : active ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-300 dark:border-indigo-700' : 'bg-gray-50 dark:bg-[#0a0a0c]/50 border-gray-200 dark:border-gray-800';
  const textCls = done ? 'text-emerald-900 dark:text-emerald-200' : active ? 'text-indigo-900 dark:text-indigo-200' : 'text-gray-500 dark:text-gray-500';
  const subCls = done ? 'text-emerald-700 dark:text-emerald-400' : active ? 'text-indigo-700 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-600';

  return (
    <div className={`flex items-center gap-2 p-2.5 rounded-lg border-2 ${cls}`}>
      <div className="shrink-0">
        {done ? <Icon className="w-4 h-4 text-emerald-600 dark:text-emerald-400">{P.chk}</Icon> : active ? <Icon className="w-4 h-4 text-indigo-600 dark:text-indigo-400">{P.clock}</Icon> : <Icon className="w-4 h-4 text-gray-400">{P.fileFold}</Icon>}
      </div>
      <div>
        <p className={`text-[11px] font-bold ${textCls}`}>{label}</p>
        <p className={`text-[9px] ${subCls}`}>{done ? 'Tamamlandı' : active ? 'İşlemde' : 'Bekliyor'}</p>
      </div>
    </div>
  );
}

function ContractDetail({ contract, onBack }: { contract: Contract; onBack: () => void }) {
  const [contractDocCreated, setContractDocCreated] = useState(false);
  const [contractSigned, setContractSigned] = useState(false);
  const [contractFinanceSent, setContractFinanceSent] = useState(false);

  return (
    <div className="relative space-y-4 md:space-y-5">
      <div className="flex items-center gap-1.5 text-[11px] text-gray-400 dark:text-gray-600 flex-wrap">
        <button className="hover:text-gray-600 dark:hover:text-gray-400 cursor-pointer" onClick={onBack}>Sözleşme Takibi</button>
        <span>/</span>
        <span className="text-gray-700 dark:text-gray-300 font-medium">Sözleşme & Teknik Şartname Onayı</span>
      </div>

      <div className="bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-800 rounded-xl p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-[16px] font-bold text-gray-900 dark:text-gray-100">Sözleşme &amp; Teknik Şartname Onayı</h2>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Pazarlama sorumlusu onay süreci — {contract.co}</p>
          </div>
          <button onClick={onBack} className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#0a0a0c] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-[12px] font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors self-start">
            <Icon>{P.back}</Icon> Geri Dön — Sözleşme Takibi
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <StepDone label="Döküman Oluştur" done={contractDocCreated} active={!contractDocCreated} />
        <StepDone label="Sözleşme Gönderildi" done={contractSigned} active={contractDocCreated && !contractSigned} />
        <StepDone label="İmzalandı" done={contractSigned} active={false} />
        <StepDone label="Finansa Aktarıldı" done={contractFinanceSent} active={contractSigned && !contractFinanceSent} />
      </div>

      <div className="bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-800 rounded-xl p-4">
        <p className="text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-3">Teklif Özeti</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
          <div className="flex items-start gap-2.5 p-3 bg-gray-50 dark:bg-[#0a0a0c]/50 rounded-lg">
            <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg flex items-center justify-center shrink-0"><Icon className="text-indigo-600 dark:text-indigo-400 w-4 h-4"><rect x="2" y="7" width="20" height="14" rx="1" /><path d="M2 7l10-5 10 5" /></Icon></div>
            <div><p className="text-[9px] text-gray-400 dark:text-gray-600 uppercase tracking-wide">Firma Adı</p><p className="text-[12px] font-bold text-gray-900 dark:text-gray-100">{contract.co}</p></div>
          </div>
          <div className="flex items-start gap-2.5 p-3 bg-gray-50 dark:bg-[#0a0a0c]/50 rounded-lg">
            <div className="w-8 h-8 bg-violet-100 dark:bg-violet-900/40 rounded-lg flex items-center justify-center shrink-0"><Icon className="text-violet-600 dark:text-violet-400 w-4 h-4"><polygon points="22.56 2.44 1.44 2.44 9.44 11.91 9.44 19 14.56 21 14.56 11.91 22.56 2.44" /></Icon></div>
            <div><p className="text-[9px] text-gray-400 dark:text-gray-600 uppercase tracking-wide">Seçilen Hizmetler</p><div className="flex flex-wrap gap-1 mt-0.5">{contract.services.map((service) => <Bdg key={service} color="indigo">{service}</Bdg>)}</div></div>
          </div>
          <div className="flex items-start gap-2.5 p-3 bg-gray-50 dark:bg-[#0a0a0c]/50 rounded-lg">
            <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg flex items-center justify-center shrink-0"><Icon className="text-emerald-600 dark:text-emerald-400 w-4 h-4">{P.dollar}</Icon></div>
            <div><p className="text-[9px] text-gray-400 dark:text-gray-600 uppercase tracking-wide">Onaylanan Fiyat</p><p className="text-[14px] font-bold text-gray-900 dark:text-gray-100">{formatCurrency(contract.amount)}</p></div>
          </div>
          <div className="flex items-start gap-2.5 p-3 bg-gray-50 dark:bg-[#0a0a0c]/50 rounded-lg">
            <div className="w-8 h-8 bg-sky-100 dark:bg-sky-900/40 rounded-lg flex items-center justify-center shrink-0"><Icon className="text-sky-600 dark:text-sky-400 w-4 h-4"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></Icon></div>
            <div><p className="text-[9px] text-gray-400 dark:text-gray-600 uppercase tracking-wide">Süre</p><p className="text-[12px] font-bold text-gray-900 dark:text-gray-100">{contract.duration}</p></div>
          </div>
          <div className="flex items-start gap-2.5 p-3 bg-gray-50 dark:bg-[#0a0a0c]/50 rounded-lg md:col-span-2">
            <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/40 rounded-lg flex items-center justify-center shrink-0"><Icon className="text-amber-600 dark:text-amber-400 w-4 h-4">{P.user}</Icon></div>
            <div><p className="text-[9px] text-gray-400 dark:text-gray-600 uppercase tracking-wide">Satış Temsilcisi</p><p className="text-[12px] font-bold text-gray-900 dark:text-gray-100">{contract.rep}</p></div>
          </div>
        </div>
        <div className="flex items-start gap-2 p-2.5 bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800/40 rounded-lg">
          <Icon className="text-sky-600 dark:text-sky-400 w-3.5 h-3.5 shrink-0 mt-0.5">{P.info}</Icon>
          <p className="text-[10px] text-sky-700 dark:text-sky-300">Bu bilgiler satış onayı sonrası kilitlenmiştir.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-800 rounded-xl p-4">
        <p className="text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-3">Müşteri Bilgileri</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <div><label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-500 mb-1">Firma Ünvanı</label><input type="text" defaultValue={`${contract.co} Teknoloji A.Ş.`} placeholder={`${contract.co} Teknoloji A.Ş.`} className="w-full px-3 py-2 text-[12px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0a0a0c] rounded-lg focus:outline-none focus:border-violet-500 text-gray-900 dark:text-gray-100" /></div>
          <div><label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-500 mb-1">Vergi Dairesi</label><input type="text" placeholder="Beşiktaş" className="w-full px-3 py-2 text-[12px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0a0a0c] rounded-lg focus:outline-none focus:border-violet-500 text-gray-900 dark:text-gray-100" /></div>
          <div><label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-500 mb-1">Vergi No</label><input type="text" placeholder="1234567890" className="w-full px-3 py-2 text-[12px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0a0a0c] rounded-lg focus:outline-none focus:border-violet-500 text-gray-900 dark:text-gray-100 font-mono" /></div>
          <div><label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-500 mb-1">Kaşe Bilgisi / Dosya Seç</label><label className="flex items-center gap-2 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"><Icon className="text-gray-400 w-3.5 h-3.5">{P.upload}</Icon><span className="text-[12px] text-gray-500 dark:text-gray-400">Dosya Seç</span><input type="file" className="hidden" /></label></div>
        </div>
        <div className="flex items-start gap-2 p-2.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 rounded-lg">
          <Icon className="text-amber-600 dark:text-amber-400 w-3.5 h-3.5 shrink-0 mt-0.5">{P.alert}</Icon>
          <p className="text-[10px] text-amber-700 dark:text-amber-300">Müşteriden yalnızca kaşe bilgileri talep edilir.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-800 rounded-xl p-4" id="docSection">
        <p className="text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-3">Döküman Oluşturma</p>
        <div className="flex items-start gap-2 p-2.5 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800/40 rounded-lg mb-3">
          <Icon className="text-indigo-600 dark:text-indigo-400 w-3.5 h-3.5 shrink-0 mt-0.5">{P.info}</Icon>
          <p className="text-[10px] text-indigo-700 dark:text-indigo-300"><strong>Sozlesme_ve_teknik_sartname.JSON</strong> çalıştırılır ve müşteri için dökümanlar otomatik hazırlanır.</p>
        </div>
        {!contractDocCreated ? (
          <button onClick={() => setContractDocCreated(true)} className="flex items-center gap-2 px-5 py-2.5 text-[12px] font-bold text-white bg-gray-900 dark:bg-gray-100 dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors shadow-sm">
            <Icon className="text-white dark:text-gray-900 w-3.5 h-3.5">{P.file}</Icon> Sözleşme ve Teknik Şartname Oluştur
          </button>
        ) : (
          <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/40 rounded-lg">
            <Icon className="text-emerald-600 dark:text-emerald-400 w-4 h-4 shrink-0">{P.chk}</Icon>
            <p className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">Sözleşme ve teknik şartname başarıyla oluşturuldu.</p>
          </div>
        )}
      </div>

      {contractDocCreated ? (
        <div className="bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-800 rounded-xl p-4" id="approvalSection">
          <p className="text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-3">Müşteri Onay Durumu</p>
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className={`p-3 rounded-lg border-2 ${contractSigned ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700' : 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-300 dark:border-indigo-700'}`}><div className="flex items-center gap-1.5 mb-0.5"><Icon className={`w-3.5 h-3.5 ${contractSigned ? 'text-emerald-600 dark:text-emerald-400' : 'text-indigo-600 dark:text-indigo-400'}`}>{P.chk}</Icon><span className="text-[11px] font-bold text-gray-900 dark:text-gray-100">Sözleşme Gönderildi</span></div><p className="text-[9px] text-gray-500 dark:text-gray-400">Müşteriye iletildi</p></div>
            <div className={`p-3 rounded-lg border-2 ${contractSigned ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700' : 'bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700'}`}><div className="flex items-center gap-1.5 mb-0.5">{contractSigned ? <Icon className="text-emerald-600 dark:text-emerald-400 w-3.5 h-3.5">{P.chk}</Icon> : <Icon className="text-amber-600 dark:text-amber-400 w-3.5 h-3.5">{P.clock}</Icon>}<span className="text-[11px] font-bold text-gray-900 dark:text-gray-100">İmza Bekleniyor</span></div><p className="text-[9px] text-gray-500 dark:text-gray-400">{contractSigned ? 'Tamamlandı' : 'İşlemde'}</p></div>
            <div className={`p-3 rounded-lg border-2 ${contractSigned ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700' : 'bg-gray-50 dark:bg-[#0a0a0c]/50 border-gray-200 dark:border-gray-800'}`}><div className="flex items-center gap-1.5 mb-0.5">{contractSigned ? <Icon className="text-emerald-600 dark:text-emerald-400 w-3.5 h-3.5">{P.chk}</Icon> : <Icon className="text-gray-400 w-3.5 h-3.5"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></Icon>}<span className={`text-[11px] font-bold ${contractSigned ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-600'}`}>İmzalandı</span></div><p className="text-[9px] text-gray-500 dark:text-gray-400">{contractSigned ? 'Tamamlandı' : 'Bekliyor'}</p></div>
          </div>
          <div className="flex items-start gap-2 p-2.5 bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800/40 rounded-lg mb-3">
            <Icon className="text-sky-600 dark:text-sky-400 w-3.5 h-3.5 shrink-0 mt-0.5">{P.info}</Icon>
            <p className="text-[10px] text-sky-700 dark:text-sky-300">İmzalı belgeler yüklendiğinde finans onayına aktarılır.</p>
          </div>
          {!contractSigned ? (
            <button onClick={() => setContractSigned(true)} className="flex items-center gap-2 px-5 py-2.5 text-[12px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm">
              <Icon className="text-white w-3.5 h-3.5">{P.upload}</Icon> İmzalı Belgeleri Yükle (Simüle Et)
            </button>
          ) : null}
        </div>
      ) : null}

      {contractSigned && !contractFinanceSent ? (
        <div className="bg-white dark:bg-[#17171a] border border-gray-200 dark:border-gray-800 rounded-xl p-4" id="financeSection">
          <p className="text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-3">Finansa Aktar</p>
          <div className="flex items-start gap-2 p-2.5 bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800/40 rounded-lg mb-3">
            <Icon className="text-violet-600 dark:text-violet-400 w-3.5 h-3.5 shrink-0 mt-0.5">{P.info}</Icon>
            <p className="text-[10px] text-violet-700 dark:text-violet-300">Finans, sözleşmede belirtilen ön ödeme koşullarına göre fatura keser ve tahsilatı başlatır.</p>
          </div>
          <button onClick={() => setContractFinanceSent(true)} className="flex items-center gap-2 px-5 py-2.5 text-[12px] font-bold text-white bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors shadow-sm">
            <Icon className="text-white w-3.5 h-3.5">{P.trend}</Icon> Finans Onayına Gönder
          </button>
        </div>
      ) : null}

      {contractFinanceSent ? (
        <>
          <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-emerald-900/20 dark:via-green-900/15 dark:to-[#17171a] border-2 border-emerald-300 dark:border-emerald-700 rounded-xl p-5">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl flex items-center justify-center shrink-0"><Icon className="text-emerald-600 dark:text-emerald-400 w-6 h-6">{P.chk}</Icon></div>
              <div><h3 className="text-[15px] font-bold text-gray-900 dark:text-gray-100">Finans Onayına Gönderildi</h3><p className="text-[11px] text-gray-600 dark:text-gray-400 mt-0.5">Süreç başarıyla tamamlandı</p></div>
            </div>
            <div className="bg-white/70 dark:bg-white/5 rounded-xl border border-emerald-200 dark:border-emerald-800/40 p-4">
              <p className="text-[11px] font-bold text-gray-900 dark:text-gray-100 mb-2">Sonraki Adımlar</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2"><Icon className="text-emerald-600 dark:text-emerald-400 w-3.5 h-3.5">{P.chk}</Icon><span className="text-[11px] text-gray-700 dark:text-gray-300">Görevler Planner'a aktarılır</span></div>
                <div className="flex items-center gap-2"><Icon className="text-emerald-600 dark:text-emerald-400 w-3.5 h-3.5">{P.chk}</Icon><span className="text-[11px] text-gray-700 dark:text-gray-300">Operasyon ekipleri bilgilendirilir</span></div>
                <div className="flex items-center gap-2"><Icon className="text-emerald-600 dark:text-emerald-400 w-3.5 h-3.5">{P.chk}</Icon><span className="text-[11px] text-gray-700 dark:text-gray-300">Proje "Operasyonda" durumuna geçer</span></div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-[#17171a] border border-green-200 dark:border-green-800/40 rounded-xl p-3 flex items-start gap-2">
            <Icon className="text-green-600 dark:text-green-400 w-4 h-4 shrink-0 mt-0.5">{P.info}</Icon>
            <div><p className="text-[11px] font-semibold text-gray-900 dark:text-gray-100 mb-0.5">Sistem Notu</p><p className="text-[10px] text-gray-600 dark:text-gray-400">Finans onayı verildiğinde sistem otomatik olarak Planner görev aktarım sürecini başlatır.</p></div>
          </div>
        </>
      ) : null}
    </div>
  );
}
