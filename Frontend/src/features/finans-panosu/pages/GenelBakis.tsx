import { type ReactNode, useState } from 'react';

type ColorName = 'emerald' | 'amber' | 'rose' | 'red' | 'sky' | 'violet' | 'indigo' | 'teal' | 'pink' | 'gray';

const CM: Record<ColorName, { bg: string; t: string }> = {
  emerald: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', t: 'text-emerald-700 dark:text-emerald-300' },
  amber: { bg: 'bg-amber-100 dark:bg-amber-900/30', t: 'text-amber-700 dark:text-amber-300' },
  rose: { bg: 'bg-rose-100 dark:bg-rose-900/30', t: 'text-rose-700 dark:text-rose-300' },
  red: { bg: 'bg-red-100 dark:bg-red-900/30', t: 'text-red-700 dark:text-red-300' },
  sky: { bg: 'bg-sky-100 dark:bg-sky-900/30', t: 'text-sky-700 dark:text-sky-300' },
  violet: { bg: 'bg-violet-100 dark:bg-violet-900/30', t: 'text-violet-700 dark:text-violet-300' },
  indigo: { bg: 'bg-indigo-100 dark:bg-indigo-900/30', t: 'text-indigo-700 dark:text-indigo-300' },
  teal: { bg: 'bg-teal-100 dark:bg-teal-900/30', t: 'text-teal-700 dark:text-teal-300' },
  pink: { bg: 'bg-pink-100 dark:bg-pink-900/30', t: 'text-pink-700 dark:text-pink-300' },
  gray: { bg: 'bg-gray-100 dark:bg-gray-800', t: 'text-gray-600 dark:text-gray-400' },
};

function Svg({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      {children}
    </svg>
  );
}

function AliBerksoyCard() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-emerald-200/70 dark:border-emerald-500/30">
      <div className="relative bg-gradient-to-br from-emerald-50 via-white to-amber-50/60 dark:from-[#0f1a15] dark:via-[#0d1215] dark:to-[#1a1510] p-5 md:p-6">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-emerald-500/15 dark:bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-amber-500/10 dark:bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-emerald-400 rounded-2xl blur-lg opacity-30" />
              <div className="relative w-12 h-12 bg-gradient-to-br from-emerald-400 via-teal-500 to-sky-600 rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold text-[16px]">TH</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-[19px] font-black text-gray-900 dark:text-gray-100 leading-tight">İyi Günler, Kıdemli Muhasebe Direktörümüz Tülay Hanım</h2>
              </div>
              <div className="flex items-center gap-2 flex-wrap mt-1">
                <span className="text-[9px] font-bold tracking-widest text-emerald-700 dark:text-emerald-300 uppercase px-2 py-0.5 bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-400/30 rounded-full">KIDEMLİ MUHASEBE DİREKTÖRÜ</span>
                <span className="text-[11px] text-gray-500 dark:text-white/60">Perşembe, 23 Nisan 2026 · Ayın 23. günü · aylık kapanışa 7 gün</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="px-2.5 py-1.5 bg-white/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg">
              <p className="text-[9px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Kasa Toplam</p>
              <p className="text-[16px] font-black text-emerald-700 dark:text-emerald-300 font-mono leading-none">₺1.248.320</p>
            </div>
            <div className="px-2.5 py-1.5 bg-white/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg">
              <p className="text-[9px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Bu Ay Ciro</p>
              <p className="text-[16px] font-black text-amber-700 dark:text-amber-300 font-mono leading-none">₺684K</p>
            </div>
          </div>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-2 mt-4">
          <div className="flex items-start gap-2 p-2.5 bg-white/70 dark:bg-white/5 backdrop-blur-sm border border-emerald-200 dark:border-emerald-400/20 rounded-lg">
            <Svg className="text-emerald-600 dark:text-emerald-400 w-4 h-4 mt-0.5 shrink-0"><polyline points="20 6 9 17 4 12" /></Svg>
            <p className="text-[11px] text-gray-800 dark:text-white/90"><span className="font-bold">Tahsilat:</span> <span className="text-emerald-700 dark:text-emerald-400 font-semibold">%96</span> · son 24 saatte <span className="font-mono">₺142K</span> tahsil edildi</p>
          </div>
          <div className="flex items-start gap-2 p-2.5 bg-white/70 dark:bg-white/5 backdrop-blur-sm border border-amber-200 dark:border-amber-400/30 rounded-lg">
            <Svg className="text-amber-600 dark:text-amber-400 w-4 h-4 mt-0.5 shrink-0"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></Svg>
            <p className="text-[11px] text-gray-800 dark:text-white/90"><span className="font-bold">Gecikmiş:</span> 4 cari · <span className="font-mono text-amber-700 dark:text-amber-400">₺78K</span> · FastGrow 45 gün bekliyor</p>
          </div>
          <div className="flex items-start gap-2 p-2.5 bg-white/70 dark:bg-white/5 backdrop-blur-sm border border-rose-200 dark:border-rose-400/30 rounded-lg">
            <Svg className="text-rose-600 dark:text-rose-400 w-4 h-4 mt-0.5 shrink-0"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></Svg>
            <p className="text-[11px] text-gray-800 dark:text-white/90"><span className="font-bold">Ay sonuna:</span> 7 gün · <span className="font-mono">12 fatura</span> kesilecek · <span className="font-mono">3 hakediş</span> ödenecek</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MuhasebeAiAjan() {
  const suggestions = [
    { icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></>, q: 'Bu ay en çok alacaklı olduğumuz 3 müşteri kim?' },
    { icon: <><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></>, q: "Arma Digital için KDV'siz fatura toplamını göster" },
    { icon: <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />, q: 'Gecikmiş faturalar için hatırlatma e-postası taslağı hazırla' },
    { icon: <><polyline points="3 17 9 11 13 15 21 7" /><polyline points="14 7 21 7 21 14" /></>, q: "Bosch'un son 6 aylık ortalama aylık ciro değeri nedir?" },
    { icon: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>, q: 'Önümüzdeki 30 gün için nakit akış tahmini' },
    { icon: <><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></>, q: 'Nisan 2026 karlılık analizi (iki şirket ayrı)' },
  ];
  const [query, setQuery] = useState('');

  return (
    <div className="relative overflow-hidden rounded-2xl border border-violet-200/60 dark:border-violet-500/30 bg-gradient-to-br from-violet-50 via-white to-indigo-50/60 dark:from-[#15102a] dark:via-[#0d0f1a] dark:to-[#0f1428]">
      <div className="absolute -top-20 -right-20 w-72 h-72 bg-violet-500/10 dark:bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-16 w-64 h-64 bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative p-4 md:p-5">
        <div className="flex items-start justify-between gap-3 mb-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-violet-400 rounded-xl blur-md opacity-40 aig" />
              <div className="relative w-11 h-11 bg-gradient-to-br from-violet-500 via-indigo-500 to-sky-500 rounded-xl flex items-center justify-center">
                <Svg className="text-white w-5 h-5"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></Svg>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-[16px] font-black text-gray-900 dark:text-gray-100 leading-tight">Muhasebe AI Ajanı</h2>
                <span className="text-[9px] font-bold tracking-widest text-violet-700 dark:text-violet-300 uppercase px-2 py-0.5 bg-violet-100 dark:bg-violet-500/20 border border-violet-200 dark:border-violet-400/30 rounded-full">FINANSAGENT v2.8</span>
                <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 px-1.5 py-0.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded"><span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />AKTİF</span>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-white/60 mt-1">Paraşüt + banka + sözleşme + personel verilerine erişebilir · iki şirketi ayrı ayrı analiz edebilir · GPT-4 + Claude 4.7 fallback</p>
            </div>
          </div>
        </div>

        <div className="relative mb-3">
          <div className="relative bg-white dark:bg-[#17181f] border-2 border-violet-200 dark:border-violet-500/40 rounded-xl focus-within:border-violet-500 dark:focus-within:border-violet-400 transition-colors">
            <textarea
              id="aiQuery"
              rows={2}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Finans veya muhasebe sorunuzu yazın... örn: 'Mart ayında hangi müşteriden en fazla tahsilat yapıldı?'"
              className="w-full px-4 py-3 pr-32 text-[13px] bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 resize-none focus:outline-none"
            />
            <div className="absolute right-2 bottom-2 flex items-center gap-1">
              <button type="button" className="p-2 text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 rounded-md hover:bg-violet-50 dark:hover:bg-violet-500/10" title="Dosya ekle">
                <Svg className="w-4 h-4"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></Svg>
              </button>
              <button type="button" className="flex items-center gap-1.5 px-3 py-2 text-[11px] font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-lg shadow-sm">
                <Svg className="w-3.5 h-3.5"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></Svg>
                Sor
              </button>
            </div>
          </div>
        </div>

        <div>
          <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Hazır sorular · tek tıklamayla sor</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {suggestions.map((suggestion) => (
              <button key={suggestion.q} type="button" data-q={suggestion.q} onClick={() => setQuery(suggestion.q)} className="flex items-start gap-2 p-2.5 bg-white/70 dark:bg-white/5 backdrop-blur-sm border border-violet-100 dark:border-violet-500/20 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-500/10 hover:border-violet-300 dark:hover:border-violet-500/40 transition-all text-left">
                <Svg className="text-violet-600 dark:text-violet-400 w-3.5 h-3.5 shrink-0 mt-0.5">{suggestion.icon}</Svg>
                <span className="text-[11px] text-gray-700 dark:text-gray-300 leading-snug">{suggestion.q}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FinansKPIMatrix() {
  const d = {
    tahsilat: '₺642K',
    alacak: '₺312K',
    nakit: '₺1.248K',
    bosch: '₺284K',
    runway: '60 gün',
    gider: '₺420K',
    trendT: '+12%',
    trendA: '-8%',
    trendN: '+5%',
    trendB: '+18%',
    trendR: '±0',
    trendG: '+3%',
    sub_bank: '3 banka · Garanti + Enpara + TEB',
    sub_bosch: 'Toplam cironun %41',
    sub_gider: 'Personel %58 · Hizmet %24',
  };
  const kpis = [
    { l: 'Aylık Tahsilat', v: d.tahsilat, sub: 'Hedef: ₺680K · %94', clr: 'emerald' as const, trend: d.trendT },
    { l: 'Toplam Alacak', v: d.alacak, sub: '87 cari · 4 gecikmiş', clr: 'amber' as const, trend: d.trendA },
    { l: 'Nakit Pozisyon', v: d.nakit, sub: d.sub_bank, clr: 'sky' as const, trend: d.trendN },
    { l: 'Bosch Cirosu', v: d.bosch, sub: d.sub_bosch, clr: 'rose' as const, trend: d.trendB, highlight: true },
    { l: 'Runway', v: d.runway, sub: 'Nakit / aylık gider oranı', clr: 'indigo' as const, trend: d.trendR },
    { l: 'Bu Ay Gider', v: d.gider, sub: d.sub_gider, clr: 'violet' as const, trend: d.trendG },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3">
      {kpis.map((kpi) => {
        const cm = CM[kpi.clr];
        const trendColor = kpi.trend.startsWith('+') ? 'emerald' : kpi.trend.startsWith('-') ? 'rose' : 'gray';
        const tCm = CM[trendColor];
        return (
          <div key={kpi.l} className={`relative overflow-hidden bg-white dark:bg-[#1e1f26] border ${kpi.highlight ? 'border-rose-300 dark:border-rose-500/40' : 'border-gray-200 dark:border-gray-600/50'} rounded-xl p-3.5`}>
            {kpi.highlight ? <div className="absolute top-0 right-0 text-[8px] font-bold px-1.5 py-0.5 bg-rose-500 text-white rounded-bl-md">★ BOSCH</div> : null}
            <p className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">{kpi.l}</p>
            <div className="flex items-baseline gap-1.5">
              <p className={`text-[20px] font-bold ${cm.t} font-mono leading-none`}>{kpi.v}</p>
              {kpi.trend !== '—' ? <span className={`text-[9px] font-bold ${tCm.t} font-mono`}>{kpi.trend}</span> : null}
            </div>
            <p className="text-[9px] text-gray-400 dark:text-gray-500 mt-0.5">{kpi.sub}</p>
          </div>
        );
      })}
    </div>
  );
}

function BankaHesaplari() {
  const banks = [
    { id: 'garanti', name: 'Garanti Bankası', iban: 'TR•• •••• 0062 1234', bal: '₺684.420', bal2: '624K TRY · 42K USD · 18K EUR', color: 'emerald' as const, logo: 'GA' },
    { id: 'enpara', name: 'Enpara', iban: 'TR•• •••• 0111 8842', bal: '₺348.920', bal2: '348K TRY', color: 'violet' as const, logo: 'EN' },
    { id: 'teb', name: 'TEB', iban: 'TR•• •••• 0032 9451', bal: '₺214.980', bal2: '214K TRY', color: 'sky' as const, logo: 'TB' },
  ];

  return (
    <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700/40">
        <div className="flex items-center gap-2">
          <Svg className="text-emerald-600 dark:text-emerald-400 w-4 h-4"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /></Svg>
          <div>
            <h3 className="text-[13px] font-bold text-gray-900 dark:text-gray-100">Banka Hesapları</h3>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">3 hesap · Paraşüt ile senkron · son güncelleme 12dk önce</p>
          </div>
        </div>
        <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-300">TOPLAM ₺1.248.320</span>
      </div>
      <div className="divide-y divide-gray-100 dark:divide-gray-700/30">
        {banks.map((bank) => {
          const cm = CM[bank.color];
          return (
            <div key={bank.id} className="p-3.5 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors">
              <div className={`w-10 h-10 ${cm.bg} rounded-lg flex items-center justify-center shrink-0 border border-${bank.color}-200 dark:border-${bank.color}-500/30`}>
                <span className={`text-[11px] font-black ${cm.t}`}>{bank.logo}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100">{bank.name}</p>
                  <span className="text-[9px] font-mono text-gray-400 dark:text-gray-500">{bank.iban}</span>
                </div>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-mono mt-0.5">{bank.bal2}</p>
              </div>
              <div className="text-right shrink-0">
                <p className={`text-[14px] font-bold ${cm.t} font-mono leading-none`}>{bank.bal}</p>
                <button type="button" className={`text-[9px] font-semibold text-gray-500 dark:text-gray-400 hover:text-${bank.color}-600 dark:hover:text-${bank.color}-400 mt-1`}>Detay →</button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="p-3 bg-gray-50 dark:bg-[#17181f] border-t border-gray-100 dark:border-gray-700/40 flex items-center justify-between">
        <span className="text-[10px] text-gray-500 dark:text-gray-400">Bugünkü hareket: <span className="font-bold text-emerald-700 dark:text-emerald-300">+₺142K</span> tahsilat · <span className="font-bold text-rose-700 dark:text-rose-400">-₺68K</span> ödeme</span>
        <button type="button" className="flex items-center gap-1 px-2 py-1 text-[10px] font-semibold bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-emerald-50 dark:hover:bg-emerald-500/10">
          <Svg className="w-3 h-3"><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></Svg>
          Senkronize Et
        </button>
      </div>
    </div>
  );
}

function ParasutDurumu() {
  const rows = [
    { l: 'E-Fatura', v: '142', sClr: 'emerald' },
    { l: 'E-Arşiv', v: '86', sClr: 'emerald' },
    { l: 'Tahsilat', v: '%96', sClr: 'emerald' },
    { l: 'Cari', v: '87', sClr: 'emerald' },
    { l: 'GIB Onay Bekleyen', v: '3', sClr: 'amber' },
  ];

  return (
    <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700/40">
        <div className="flex items-center gap-2">
          <Svg className="text-teal-600 dark:text-teal-400 w-4 h-4"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></Svg>
          <h3 className="text-[13px] font-bold text-gray-900 dark:text-gray-100">Paraşüt Entegrasyon</h3>
        </div>
        <span className="flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />BAĞLI
        </span>
      </div>
      <div className="p-4 flex-1 space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 bg-gray-50 dark:bg-[#17181f] rounded">
            <p className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider">Son Sync</p>
            <p className="text-[13px] font-bold text-gray-900 dark:text-gray-100 font-mono mt-0.5">12 dk</p>
          </div>
          <div className="p-2 bg-gray-50 dark:bg-[#17181f] rounded">
            <p className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider">Bu Ay API</p>
            <p className="text-[13px] font-bold text-gray-900 dark:text-gray-100 font-mono mt-0.5">4.2K</p>
          </div>
        </div>
        <div className="space-y-1.5 pt-1">
          {rows.map((item) => (
            <div key={item.l} className="flex items-center justify-between text-[11px]">
              <span className="text-gray-600 dark:text-gray-400">{item.l}</span>
              <div className="flex items-center gap-2">
                <span className="font-bold font-mono text-gray-900 dark:text-gray-100">{item.v}</span>
                <span className={`w-1.5 h-1.5 bg-${item.sClr}-500 rounded-full`} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="p-3 bg-gray-50 dark:bg-[#17181f] border-t border-gray-100 dark:border-gray-700/40">
        <button type="button" className="w-full flex items-center justify-center gap-1.5 py-1.5 text-[10px] font-bold text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-500/10 rounded transition-colors">
          <Svg className="w-3 h-3"><polygon points="5 3 19 12 5 21 5 3" /></Svg>
          Paraşüt Panelini Aç
        </button>
      </div>
    </div>
  );
}

function BoschOzetKart() {
  return (
    <div className="relative overflow-hidden bg-white dark:bg-[#1a1215] border border-rose-300/60 dark:border-rose-500/40 rounded-xl">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-rose-500 via-red-500 to-rose-500" />
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-rose-500/8 dark:bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative p-5">
        <div className="flex items-start justify-between gap-3 mb-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-red-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-rose-500/20">
              <Svg className="text-white w-5 h-5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></Svg>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-[16px] font-black text-gray-900 dark:text-gray-100">Bosch Türkiye</h3>
                <span className="text-[9px] font-bold tracking-widest text-rose-700 dark:text-rose-300 uppercase px-2 py-0.5 bg-rose-100 dark:bg-rose-500/20 border border-rose-200 dark:border-rose-400/30 rounded-full">★ STRATEJİK MÜŞTERİ</span>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Arma Digital ana müşterisi · cironun <span className="font-bold text-rose-700 dark:text-rose-300">%41'i</span> · 6 aktif sözleşme · dedicated ekip</p>
            </div>
          </div>
          <button type="button" className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-md transition-all shrink-0">
            Bosch Hesabına Git <Svg className="w-3 h-3"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></Svg>
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            ['Bu Ay Ciro', '₺284K', '+%18 vs geçen ay', 'text-emerald-600 dark:text-emerald-400'],
            ['Aktif Sözleşme', '6', '2 aylık · 3 yıllık · 1 proje', 'text-gray-500'],
            ['Açık Fatura', '₺142K', '2 fatura · vade 15g', 'text-amber-600 dark:text-amber-400'],
            ['Tahsilat Oranı', '%100', 'Gecikme yok · A+ skoru', 'text-gray-500'],
          ].map(([label, value, sub, subClass]) => (
            <div key={label} className="p-2.5 bg-gray-50 dark:bg-[#0f0a0c] border border-rose-100 dark:border-rose-500/20 rounded-lg">
              <p className="text-[9px] font-semibold text-rose-700 dark:text-rose-300 uppercase tracking-wider mb-1">{label}</p>
              <p className={`text-[16px] font-black ${label === 'Tahsilat Oranı' ? 'text-emerald-700 dark:text-emerald-300' : 'text-gray-900 dark:text-gray-100'} font-mono leading-none`}>{value}</p>
              <p className={`text-[9px] ${subClass} mt-0.5`}>{sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AyinIlkHaftasi() {
  const tasks = [
    { task: 'Aylık müşterilerin faturalarının düzenlenmesi', done: true, date: '1-3 Nis', count: '142/142 fatura' },
    { task: 'Bir önceki ayın gelir-giderlerin çıkartılması', done: true, date: '2-4 Nis', count: 'Mart kapanış' },
    { task: 'Kasanın denkleştirilmesi', done: true, date: '4-5 Nis', count: '3 banka senkron' },
    { task: 'Mevcut ayın gelir-gider planlamasının yapılması', done: true, date: '5-7 Nis', count: 'Nisan bütçesi' },
  ];

  return (
    <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-gray-100 dark:border-gray-700/40">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Svg className="text-emerald-600 dark:text-emerald-400 w-4 h-4"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></Svg>
            <h3 className="text-[13px] font-bold text-gray-900 dark:text-gray-100">Ayın İlk Haftası</h3>
          </div>
          <span className="text-[9px] font-bold px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded">4/4 TAMAMLANDI</span>
        </div>
        <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">Nisan 2026 · geleneksel aylık kapanış rutini</p>
      </div>
      <div className="divide-y divide-gray-100 dark:divide-gray-700/30">
        {tasks.map((task) => (
          <div key={task.task} className="p-3 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
            <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
              <Svg className="text-white w-3 h-3"><polyline points="20 6 9 17 4 12" /></Svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-semibold text-gray-500 dark:text-gray-500 line-through">{task.task}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[9px] font-mono text-gray-400 dark:text-gray-500">{task.date}</span>
                <span className="text-[9px] text-gray-400">·</span>
                <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400">{task.count}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 bg-amber-50/50 dark:bg-amber-500/5 border-t border-amber-200/50 dark:border-amber-500/20 flex items-center gap-2">
        <Svg className="text-amber-600 dark:text-amber-400 w-3 h-3"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></Svg>
        <span className="text-[10px] text-amber-700 dark:text-amber-300"><span className="font-bold">Sonraki ay:</span> 1-7 Mayıs 2026 · aylık kapanış rutini tekrar başlar</span>
      </div>
    </div>
  );
}

function HaftalikOdemePlani() {
  type PaymentType = 'domain' | 'hosting' | 'freelance' | 'maas' | 'ssk' | 'kira' | 'vergi';
  type PaymentItem = { t: string; amt: string; type: PaymentType; critical?: boolean };
  const typeConf = {
    domain: { clr: 'violet' as const, lbl: 'Domain' },
    hosting: { clr: 'indigo' as const, lbl: 'Hosting' },
    freelance: { clr: 'sky' as const, lbl: 'Freelance' },
    maas: { clr: 'rose' as const, lbl: 'Maaş' },
    ssk: { clr: 'amber' as const, lbl: 'SSK' },
    kira: { clr: 'teal' as const, lbl: 'Kira' },
    vergi: { clr: 'rose' as const, lbl: 'Vergi' },
  };
  const odemeler: Array<{ day: string; date: string; items: PaymentItem[] }> = [
    { day: 'Pzt', date: '28 Nis', items: [{ t: 'Domain yenileme (3 domain)', amt: '₺4.8K', type: 'domain' as const }, { t: 'Cloudflare + Metunic', amt: '₺2.1K', type: 'hosting' as const }] },
    { day: 'Sal', date: '29 Nis', items: [{ t: 'Erhan Çalışkan hakediş', amt: '₺18K', type: 'freelance' as const }] },
    { day: 'Çar', date: '30 Nis', items: [{ t: 'Personel maaş (12 kişi)', amt: '₺186K', type: 'maas' as const, critical: true }] },
    { day: 'Per', date: '1 May', items: [{ t: 'SSK primleri', amt: '₺42K', type: 'ssk' as const, critical: true }, { t: 'Ofis kira', amt: '₺28K', type: 'kira' as const }] },
    { day: 'Cum', date: '2 May', items: [{ t: 'Uğur Erten hakediş', amt: '₺12K', type: 'freelance' as const }, { t: 'Vergi ödemeleri', amt: '₺34K', type: 'vergi' as const, critical: true }] },
  ];

  return (
    <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-gray-100 dark:border-gray-700/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Svg className="text-amber-600 dark:text-amber-400 w-4 h-4"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></Svg>
          <div>
            <h3 className="text-[13px] font-bold text-gray-900 dark:text-gray-100">Bu Haftaki Ödeme Planı</h3>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">28 Nis — 2 May · 8 ödeme kalemi</p>
          </div>
        </div>
        <span className="text-[10px] font-mono font-bold text-amber-700 dark:text-amber-300">TOPLAM ₺327K</span>
      </div>
      <div className="divide-y divide-gray-100 dark:divide-gray-700/30">
        {odemeler.map((day) => (
          <div key={day.day} className="p-3 hover:bg-gray-50 dark:hover:bg-white/5">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold font-mono text-gray-500 dark:text-gray-500 uppercase w-9">{day.day}</span>
              <span className="text-[9px] font-mono text-gray-400 dark:text-gray-500">{day.date}</span>
            </div>
            <div className="ml-11 space-y-1">
              {day.items.map((item) => {
                const type = typeConf[item.type];
                const tcm = CM[type.clr];
                return (
                  <div key={`${day.day}-${item.t}`} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`text-[8px] font-bold px-1 py-0.5 ${tcm.bg} ${tcm.t} rounded shrink-0`}>{type.lbl}</span>
                      <span className="text-[11px] text-gray-700 dark:text-gray-300 truncate">{item.t}</span>
                      {item.critical ? <span className="text-[8px] font-bold text-rose-600 dark:text-rose-400">●</span> : null}
                    </div>
                    <span className="text-[11px] font-bold font-mono text-gray-900 dark:text-gray-100 shrink-0">{item.amt}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FinansHareketleri() {
  const hareketler = [
    { time: '14:42', type: 'in', desc: 'Bosch Türkiye · Tahsilat #INV-2026-0142', amt: '+₺142.000', bank: 'Garanti', cat: 'Tahsilat' },
    { time: '13:28', type: 'out', desc: 'Metunic · Domain yenileme (armadigital.com)', amt: '-₺1.240', bank: 'Enpara', cat: 'Hosting' },
    { time: '11:15', type: 'in', desc: 'FastGrow · Kısmi tahsilat #INV-2026-0138', amt: '+₺24.500', bank: 'TEB', cat: 'Tahsilat' },
    { time: '10:02', type: 'out', desc: 'Erhan Çalışkan · Mart hakediş (freelance SEO)', amt: '-₺18.000', bank: 'Garanti', cat: 'Freelance' },
    { time: '09:45', type: 'out', desc: 'Paraşüt aylık abonelik', amt: '-₺890', bank: 'TEB', cat: 'SaaS' },
    { time: '09:12', type: 'in', desc: 'BigBrand · Peşinat faturası #INV-2026-0145', amt: '+₺48.000', bank: 'Garanti', cat: 'Peşinat' },
  ];

  return (
    <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-gray-100 dark:border-gray-700/40 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Svg className="text-indigo-600 dark:text-indigo-400 w-4 h-4"><line x1="22" y1="12" x2="2" y2="12" /><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /></Svg>
          <div>
            <h3 className="text-[13px] font-bold text-gray-900 dark:text-gray-100">Bugünkü Finans Hareketleri</h3>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">23 Nisan 2026 · son 6 işlem · Paraşüt senkron</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded">Giren: +₺214.500</span>
          <span className="text-[10px] font-semibold px-2 py-0.5 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 rounded">Çıkan: -₺20.130</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[11px]">
          <thead className="bg-gray-50 dark:bg-[#17181f]">
            <tr className="border-b border-gray-200 dark:border-gray-700/30">
              <th className="text-left px-3 py-2 font-semibold text-gray-500 dark:text-gray-400 w-14">Saat</th>
              <th className="text-left px-3 py-2 font-semibold text-gray-500 dark:text-gray-400">Açıklama</th>
              <th className="text-left px-3 py-2 font-semibold text-gray-500 dark:text-gray-400 hidden md:table-cell">Kategori</th>
              <th className="text-left px-3 py-2 font-semibold text-gray-500 dark:text-gray-400 hidden md:table-cell">Banka</th>
              <th className="text-right px-3 py-2 font-semibold text-gray-500 dark:text-gray-400">Tutar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700/30">
            {hareketler.map((hareket) => {
              const isIn = hareket.type === 'in';
              return (
                <tr key={`${hareket.time}-${hareket.desc}`} className="hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer">
                  <td className="px-3 py-2.5 font-mono text-gray-400 dark:text-gray-500">{hareket.time}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-full ${isIn ? 'bg-emerald-100 dark:bg-emerald-500/20' : 'bg-rose-100 dark:bg-rose-500/20'} flex items-center justify-center shrink-0`}>
                        <Svg className={`${isIn ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'} w-3 h-3`}>
                          {isIn ? <><line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" /></> : <><line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" /></>}
                        </Svg>
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">{hareket.desc}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 hidden md:table-cell"><span className="text-[10px] font-mono text-gray-500 dark:text-gray-500">{hareket.cat}</span></td>
                  <td className="px-3 py-2.5 hidden md:table-cell font-mono text-gray-500 dark:text-gray-500 text-[10px]">{hareket.bank}</td>
                  <td className={`px-3 py-2.5 text-right font-mono font-bold ${isIn ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-400'}`}>{hareket.amt}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="p-3 bg-gray-50 dark:bg-[#17181f] border-t border-gray-100 dark:border-gray-700/40 flex items-center justify-between">
        <span className="text-[10px] text-gray-500 dark:text-gray-400">Günlük toplam: <span className="font-bold text-emerald-700 dark:text-emerald-300">+₺194.370</span> net</span>
        <button type="button" className="text-[10px] font-semibold text-indigo-700 dark:text-indigo-300 hover:underline">Tümünü Gör →</button>
      </div>
    </div>
  );
}

export default function GenelBakis() {
  return (
    <>
      <AliBerksoyCard />
      <MuhasebeAiAjan />
      <FinansKPIMatrix />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
        <div className="lg:col-span-3"><BankaHesaplari /></div>
        <div className="lg:col-span-2"><ParasutDurumu /></div>
      </div>
      <BoschOzetKart />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <AyinIlkHaftasi />
        <HaftalikOdemePlani />
      </div>
      <FinansHareketleri />
    </>
  );
}
