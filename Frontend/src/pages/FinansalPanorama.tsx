import Layout from '../components/Layout';

export default function FinansalPanorama() {
  return (
    <Layout activeId="financial" breadcrumb="Genel Müdür · Finansal Panorama">
      <>
{/* Başlık + Dönem Seçici */}
  <div className="flex items-center justify-between gap-3 flex-wrap">
    <div className="flex items-center gap-2.5">
      <div className="w-9 h-9 bg-emerald-100 dark:bg-emerald-500/20 rounded-lg flex items-center justify-center">
        <svg className="text-emerald-600 dark:text-emerald-400 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
      </div>
      <div>
        <h1 className="text-[19px] font-bold text-gray-900 dark:text-gray-100 leading-tight">Finansal Panorama</h1>
        <p className="text-[11px] text-gray-500 dark:text-gray-400">Ciro · Kar · Nakit · Alacaklar · CEO görünümü</p>
      </div>
    </div>
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700/40 rounded-lg">
        <button className="px-2.5 py-1 text-[10px] text-gray-500 dark:text-gray-400 font-semibold rounded-md">Bu Ay</button>
        <button className="px-2.5 py-1 text-[10px] bg-white dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold rounded-md">12 Ay</button>
        <button className="px-2.5 py-1 text-[10px] text-gray-500 dark:text-gray-400 font-semibold rounded-md">Yıllık</button>
      </div>
      <button onClick={() => undefined} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 dark:bg-gray-100 dark:text-gray-900 text-white text-[11px] font-bold rounded-lg hover:opacity-90 transition-opacity">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
        PDF İndir
      </button>
    </div>
  </div>

  {/* 6 KPI */}
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3">
    
    <div className="relative overflow-hidden bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-3.5 hover:shadow-sm hover:-translate-y-0.5 transition-all">
      <div className="absolute -top-8 -right-8 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none"></div>
      <div className="relative flex items-start justify-between mb-2">
        <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center"><svg className="text-emerald-700 dark:text-emerald-300 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div>
        <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded">+23.1%</span>
      </div>
      <div className="relative text-[22px] font-bold text-gray-900 dark:text-gray-50 leading-none mb-1">₺1.04M</div>
      <div className="relative text-[11px] font-semibold text-gray-600 dark:text-gray-400 leading-tight">Nisan Cirosu</div>
      <div className="relative text-[9px] text-gray-400 dark:text-gray-500 mt-0.5">+%23.1 yıl·yıl</div>
    </div>
    <div className="relative overflow-hidden bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-3.5 hover:shadow-sm hover:-translate-y-0.5 transition-all">
      <div className="absolute -top-8 -right-8 w-24 h-24 bg-violet-500/5 rounded-full blur-xl pointer-events-none"></div>
      <div className="relative flex items-start justify-between mb-2">
        <div className="w-8 h-8 bg-violet-100 dark:bg-violet-900/30 rounded-lg flex items-center justify-center"><svg className="text-violet-700 dark:text-violet-300 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg></div>
        <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded">+1.8%</span>
      </div>
      <div className="relative text-[22px] font-bold text-gray-900 dark:text-gray-50 leading-none mb-1">₺399K</div>
      <div className="relative text-[11px] font-semibold text-gray-600 dark:text-gray-400 leading-tight">Brüt Kar</div>
      <div className="relative text-[9px] text-gray-400 dark:text-gray-500 mt-0.5">%38.4 marj</div>
    </div>
    <div className="relative overflow-hidden bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-3.5 hover:shadow-sm hover:-translate-y-0.5 transition-all">
      <div className="absolute -top-8 -right-8 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none"></div>
      <div className="relative flex items-start justify-between mb-2">
        <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center"><svg className="text-emerald-700 dark:text-emerald-300 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div>
        <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded">+15.4%</span>
      </div>
      <div className="relative text-[22px] font-bold text-gray-900 dark:text-gray-50 leading-none mb-1">₺285K</div>
      <div className="relative text-[11px] font-semibold text-gray-600 dark:text-gray-400 leading-tight">Net Kar</div>
      <div className="relative text-[9px] text-gray-400 dark:text-gray-500 mt-0.5">%27.4 · vergi ard</div>
    </div>
    <div className="relative overflow-hidden bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-3.5 hover:shadow-sm hover:-translate-y-0.5 transition-all">
      <div className="absolute -top-8 -right-8 w-24 h-24 bg-teal-500/5 rounded-full blur-xl pointer-events-none"></div>
      <div className="relative flex items-start justify-between mb-2">
        <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center"><svg className="text-teal-700 dark:text-teal-300 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polygon points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div>
        <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded">+8.3%</span>
      </div>
      <div className="relative text-[22px] font-bold text-gray-900 dark:text-gray-50 leading-none mb-1">₺216K</div>
      <div className="relative text-[11px] font-semibold text-gray-600 dark:text-gray-400 leading-tight">MRR</div>
      <div className="relative text-[9px] text-gray-400 dark:text-gray-500 mt-0.5">87 aktif müşteri</div>
    </div>
    <div className="relative overflow-hidden bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-3.5 hover:shadow-sm hover:-translate-y-0.5 transition-all">
      <div className="absolute -top-8 -right-8 w-24 h-24 bg-sky-500/5 rounded-full blur-xl pointer-events-none"></div>
      <div className="relative flex items-start justify-between mb-2">
        <div className="w-8 h-8 bg-sky-100 dark:bg-sky-900/30 rounded-lg flex items-center justify-center"><svg className="text-sky-700 dark:text-sky-300 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3a4 4 0 0 0-8 0"/></svg></div>
        <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded">+₺340K</span>
      </div>
      <div className="relative text-[22px] font-bold text-gray-900 dark:text-gray-50 leading-none mb-1">₺2.8M</div>
      <div className="relative text-[11px] font-semibold text-gray-600 dark:text-gray-400 leading-tight">Nakit Pozisyon</div>
      <div className="relative text-[9px] text-gray-400 dark:text-gray-500 mt-0.5">60 gün runway</div>
    </div>
    <div className="relative overflow-hidden bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-3.5 hover:shadow-sm hover:-translate-y-0.5 transition-all">
      <div className="absolute -top-8 -right-8 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none"></div>
      <div className="relative flex items-start justify-between mb-2">
        <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center"><svg className="text-amber-700 dark:text-amber-300 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
        <span className="text-[9px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 px-1.5 py-0.5 rounded">-₺42K</span>
      </div>
      <div className="relative text-[22px] font-bold text-gray-900 dark:text-gray-50 leading-none mb-1">₺312K</div>
      <div className="relative text-[11px] font-semibold text-gray-600 dark:text-gray-400 leading-tight">Alacaklar</div>
      <div className="relative text-[9px] text-gray-400 dark:text-gray-500 mt-0.5">4 gecikmiş · 15K&gt;90g</div>
    </div>
  </div>

  {/* Nakit Pozisyon Şeridi (özel vurgu) */}
  <div className="bg-gradient-to-br from-emerald-50 via-white to-teal-50/50 dark:from-emerald-500/10 dark:via-transparent dark:to-teal-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-xl p-4 flex items-center justify-between gap-4 flex-wrap">
    <div className="flex items-center gap-3">
      <div className="relative">
        
        <div className="relative w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center">
          <svg className="text-white w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3a4 4 0 0 0-8 0"/><path d="M8 7V5"/><path d="M16 7V5"/></svg>
        </div>
      </div>
      <div>
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-[9px] font-bold tracking-widest text-emerald-700 dark:text-emerald-300 uppercase">Nakit Pozisyonu</span>
          <span className="flex items-center gap-1 px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-500/20 rounded-full">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
            <span className="text-[9px] font-bold text-emerald-700 dark:text-emerald-300 tracking-wider">SAĞLIKLI</span>
          </span>
        </div>
        <p className="text-[22px] font-black text-gray-900 dark:text-gray-100 leading-tight">₺2.8M <span className="text-[13px] font-semibold text-emerald-700 dark:text-emerald-300">· 60 gün runway</span></p>
        <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">Aylık gider ₺718K · Mayıs tahmini ₺1.12M ciro · pozitif kasa akışı</p>
      </div>
    </div>
    <div className="grid grid-cols-3 gap-3 text-right">
      <div>
        <p className="text-[9px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Banka</p>
        <p className="text-[14px] font-bold text-gray-900 dark:text-gray-100">₺2.12M</p>
      </div>
      <div>
        <p className="text-[9px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Pos Bakiye</p>
        <p className="text-[14px] font-bold text-gray-900 dark:text-gray-100">₺484K</p>
      </div>
      <div>
        <p className="text-[9px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Kasa</p>
        <p className="text-[14px] font-bold text-gray-900 dark:text-gray-100">₺196K</p>
      </div>
    </div>
  </div>

  {/* 12 Aylık Gelir-Gider Trendi */}
  <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
    <div className="p-4 border-b border-gray-100 dark:border-gray-700/40 flex items-center justify-between gap-2 flex-wrap">
      <div className="flex items-center gap-2">
        <svg className="text-emerald-600 dark:text-emerald-400 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>
        <div>
          <h4 className="text-[13px] font-bold text-gray-900 dark:text-gray-100">12 Aylık Gelir · Gider · Kar</h4>
          <p className="text-[10px] text-gray-500 dark:text-gray-400">Mayıs 2025 — Nisan 2026 · ₺K cinsinden</p>
        </div>
      </div>
      <div className="flex items-center gap-3 text-[10px]">
        <div className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gradient-to-br from-emerald-400 to-emerald-600"></span><span className="text-gray-600 dark:text-gray-400 font-medium">Gelir</span></div>
        <div className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gradient-to-br from-rose-400 to-rose-600"></span><span className="text-gray-600 dark:text-gray-400 font-medium">Gider</span></div>
        <div className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gradient-to-br from-violet-400 to-violet-600"></span><span className="text-gray-600 dark:text-gray-400 font-medium">Kar</span></div>
      </div>
    </div>
    <div className="p-4">
      <div className="flex items-end gap-1 h-44 pl-10 border-b border-l border-gray-200 dark:border-gray-700/40 relative">
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-[9px] text-gray-400 dark:text-gray-500 font-mono" style={{ width: '36px' }}>
          <span>₺1040K</span><span>₺780K</span><span>₺520K</span><span>₺260K</span><span>0</span>
        </div>
        <div className="absolute top-1/4 left-10 right-0 border-t border-dashed border-gray-200 dark:border-gray-700/30"></div>
        <div className="absolute top-2/4 left-10 right-0 border-t border-dashed border-gray-200 dark:border-gray-700/30"></div>
        <div className="absolute top-3/4 left-10 right-0 border-t border-dashed border-gray-200 dark:border-gray-700/30"></div>

        
          <div className="flex-1 flex items-end gap-0.5 relative h-full group justify-center">
            <div className="flex-1 max-w-[10px] rounded-t bg-gradient-to-t from-emerald-500 to-emerald-400 transition-all hover:brightness-110 relative" style={{ height: '60%' }}>
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-bold text-emerald-700 dark:text-emerald-300 opacity-0 group-hover:opacity-100 whitespace-nowrap">624</span>
            </div>
            <div className="flex-1 max-w-[10px] rounded-t bg-gradient-to-t from-rose-500 to-rose-400 transition-all hover:brightness-110 relative" style={{ height: '44.42307692307692%' }}>
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-bold text-rose-700 dark:text-rose-300 opacity-0 group-hover:opacity-100 whitespace-nowrap">462</span>
            </div>
            <div className="flex-1 max-w-[10px] rounded-t bg-gradient-to-t from-violet-500 to-violet-400 transition-all hover:brightness-110 relative" style={{ height: '15.576923076923077%' }}>
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-bold text-violet-700 dark:text-violet-300 opacity-0 group-hover:opacity-100 whitespace-nowrap">162</span>
            </div>
          </div>
          <div className="flex-1 flex items-end gap-0.5 relative h-full group justify-center">
            <div className="flex-1 max-w-[10px] rounded-t bg-gradient-to-t from-emerald-500 to-emerald-400 transition-all hover:brightness-110 relative" style={{ height: '62.69230769230769%' }}>
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-bold text-emerald-700 dark:text-emerald-300 opacity-0 group-hover:opacity-100 whitespace-nowrap">652</span>
            </div>
            <div className="flex-1 max-w-[10px] rounded-t bg-gradient-to-t from-rose-500 to-rose-400 transition-all hover:brightness-110 relative" style={{ height: '45.96153846153846%' }}>
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-bold text-rose-700 dark:text-rose-300 opacity-0 group-hover:opacity-100 whitespace-nowrap">478</span>
            </div>
            <div className="flex-1 max-w-[10px] rounded-t bg-gradient-to-t from-violet-500 to-violet-400 transition-all hover:brightness-110 relative" style={{ height: '16.73076923076923%' }}>
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-bold text-violet-700 dark:text-violet-300 opacity-0 group-hover:opacity-100 whitespace-nowrap">174</span>
            </div>
          </div>
          <div className="flex-1 flex items-end gap-0.5 relative h-full group justify-center">
            <div className="flex-1 max-w-[10px] rounded-t bg-gradient-to-t from-emerald-500 to-emerald-400 transition-all hover:brightness-110 relative" style={{ height: '65.1923076923077%' }}>
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-bold text-emerald-700 dark:text-emerald-300 opacity-0 group-hover:opacity-100 whitespace-nowrap">678</span>
            </div>
            <div className="flex-1 max-w-[10px] rounded-t bg-gradient-to-t from-rose-500 to-rose-400 transition-all hover:brightness-110 relative" style={{ height: '47.01923076923077%' }}>
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-bold text-rose-700 dark:text-rose-300 opacity-0 group-hover:opacity-100 whitespace-nowrap">489</span>
            </div>
            <div className="flex-1 max-w-[10px] rounded-t bg-gradient-to-t from-violet-500 to-violet-400 transition-all hover:brightness-110 relative" style={{ height: '18.173076923076923%' }}>
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-bold text-violet-700 dark:text-violet-300 opacity-0 group-hover:opacity-100 whitespace-nowrap">189</span>
            </div>
          </div>
          <div className="flex-1 flex items-end gap-0.5 relative h-full group justify-center">
            <div className="flex-1 max-w-[10px] rounded-t bg-gradient-to-t from-emerald-500 to-emerald-400 transition-all hover:brightness-110 relative" style={{ height: '68.46153846153847%' }}>
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-bold text-emerald-700 dark:text-emerald-300 opacity-0 group-hover:opacity-100 whitespace-nowrap">712</span>
            </div>
            <div className="flex-1 max-w-[10px] rounded-t bg-gradient-to-t from-rose-500 to-rose-400 transition-all hover:brightness-110 relative" style={{ height: '49.23076923076923%' }}>
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-bold text-rose-700 dark:text-rose-300 opacity-0 group-hover:opacity-100 whitespace-nowrap">512</span>
            </div>
            <div className="flex-1 max-w-[10px] rounded-t bg-gradient-to-t from-violet-500 to-violet-400 transition-all hover:brightness-110 relative" style={{ height: '19.230769230769234%' }}>
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-bold text-violet-700 dark:text-violet-300 opacity-0 group-hover:opacity-100 whitespace-nowrap">200</span>
            </div>
          </div>
          <div className="flex-1 flex items-end gap-0.5 relative h-full group justify-center">
            <div className="flex-1 max-w-[10px] rounded-t bg-gradient-to-t from-emerald-500 to-emerald-400 transition-all hover:brightness-110 relative" style={{ height: '71.63461538461539%' }}>
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-bold text-emerald-700 dark:text-emerald-300 opacity-0 group-hover:opacity-100 whitespace-nowrap">745</span>
            </div>
            <div className="flex-1 max-w-[10px] rounded-t bg-gradient-to-t from-rose-500 to-rose-400 transition-all hover:brightness-110 relative" style={{ height: '51.92307692307693%' }}>
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-bold text-rose-700 dark:text-rose-300 opacity-0 group-hover:opacity-100 whitespace-nowrap">540</span>
            </div>
            <div className="flex-1 max-w-[10px] rounded-t bg-gradient-to-t from-violet-500 to-violet-400 transition-all hover:brightness-110 relative" style={{ height: '19.71153846153846%' }}>
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-bold text-violet-700 dark:text-violet-300 opacity-0 group-hover:opacity-100 whitespace-nowrap">205</span>
            </div>
          </div>
          <div className="flex-1 flex items-end gap-0.5 relative h-full group justify-center">
            <div className="flex-1 max-w-[10px] rounded-t bg-gradient-to-t from-emerald-500 to-emerald-400 transition-all hover:brightness-110 relative" style={{ height: '75.1923076923077%' }}>
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-bold text-emerald-700 dark:text-emerald-300 opacity-0 group-hover:opacity-100 whitespace-nowrap">782</span>
            </div>
            <div className="flex-1 max-w-[10px] rounded-t bg-gradient-to-t from-rose-500 to-rose-400 transition-all hover:brightness-110 relative" style={{ height: '53.65384615384615%' }}>
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-bold text-rose-700 dark:text-rose-300 opacity-0 group-hover:opacity-100 whitespace-nowrap">558</span>
            </div>
            <div className="flex-1 max-w-[10px] rounded-t bg-gradient-to-t from-violet-500 to-violet-400 transition-all hover:brightness-110 relative" style={{ height: '21.53846153846154%' }}>
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-bold text-violet-700 dark:text-violet-300 opacity-0 group-hover:opacity-100 whitespace-nowrap">224</span>
            </div>
          </div>
          <div className="flex-1 flex items-end gap-0.5 relative h-full group justify-center">
            <div className="flex-1 max-w-[10px] rounded-t bg-gradient-to-t from-emerald-500 to-emerald-400 transition-all hover:brightness-110 relative" style={{ height: '79.23076923076923%' }}>
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-bold text-emerald-700 dark:text-emerald-300 opacity-0 group-hover:opacity-100 whitespace-nowrap">824</span>
            </div>
            <div className="flex-1 max-w-[10px] rounded-t bg-gradient-to-t from-rose-500 to-rose-400 transition-all hover:brightness-110 relative" style={{ height: '56.53846153846154%' }}>
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-bold text-rose-700 dark:text-rose-300 opacity-0 group-hover:opacity-100 whitespace-nowrap">588</span>
            </div>
            <div className="flex-1 max-w-[10px] rounded-t bg-gradient-to-t from-violet-500 to-violet-400 transition-all hover:brightness-110 relative" style={{ height: '22.692307692307693%' }}>
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-bold text-violet-700 dark:text-violet-300 opacity-0 group-hover:opacity-100 whitespace-nowrap">236</span>
            </div>
          </div>
          <div className="flex-1 flex items-end gap-0.5 relative h-full group justify-center">
            <div className="flex-1 max-w-[10px] rounded-t bg-gradient-to-t from-emerald-500 to-emerald-400 transition-all hover:brightness-110 relative" style={{ height: '83.65384615384616%' }}>
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-bold text-emerald-700 dark:text-emerald-300 opacity-0 group-hover:opacity-100 whitespace-nowrap">870</span>
            </div>
            <div className="flex-1 max-w-[10px] rounded-t bg-gradient-to-t from-rose-500 to-rose-400 transition-all hover:brightness-110 relative" style={{ height: '59.42307692307692%' }}>
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-bold text-rose-700 dark:text-rose-300 opacity-0 group-hover:opacity-100 whitespace-nowrap">618</span>
            </div>
            <div className="flex-1 max-w-[10px] rounded-t bg-gradient-to-t from-violet-500 to-violet-400 transition-all hover:brightness-110 relative" style={{ height: '24.23076923076923%' }}>
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-bold text-violet-700 dark:text-violet-300 opacity-0 group-hover:opacity-100 whitespace-nowrap">252</span>
            </div>
          </div>
          <div className="flex-1 flex items-end gap-0.5 relative h-full group justify-center">
            <div className="flex-1 max-w-[10px] rounded-t bg-gradient-to-t from-emerald-500 to-emerald-400 transition-all hover:brightness-110 relative" style={{ height: '87.6923076923077%' }}>
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-bold text-emerald-700 dark:text-emerald-300 opacity-0 group-hover:opacity-100 whitespace-nowrap">912</span>
            </div>
            <div className="flex-1 max-w-[10px] rounded-t bg-gradient-to-t from-rose-500 to-rose-400 transition-all hover:brightness-110 relative" style={{ height: '61.53846153846154%' }}>
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-bold text-rose-700 dark:text-rose-300 opacity-0 group-hover:opacity-100 whitespace-nowrap">640</span>
            </div>
            <div className="flex-1 max-w-[10px] rounded-t bg-gradient-to-t from-violet-500 to-violet-400 transition-all hover:brightness-110 relative" style={{ height: '26.153846153846157%' }}>
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-bold text-violet-700 dark:text-violet-300 opacity-0 group-hover:opacity-100 whitespace-nowrap">272</span>
            </div>
          </div>
          <div className="flex-1 flex items-end gap-0.5 relative h-full group justify-center">
            <div className="flex-1 max-w-[10px] rounded-t bg-gradient-to-t from-emerald-500 to-emerald-400 transition-all hover:brightness-110 relative" style={{ height: '91.92307692307692%' }}>
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-bold text-emerald-700 dark:text-emerald-300 opacity-0 group-hover:opacity-100 whitespace-nowrap">956</span>
            </div>
            <div className="flex-1 max-w-[10px] rounded-t bg-gradient-to-t from-rose-500 to-rose-400 transition-all hover:brightness-110 relative" style={{ height: '64.42307692307693%' }}>
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-bold text-rose-700 dark:text-rose-300 opacity-0 group-hover:opacity-100 whitespace-nowrap">670</span>
            </div>
            <div className="flex-1 max-w-[10px] rounded-t bg-gradient-to-t from-violet-500 to-violet-400 transition-all hover:brightness-110 relative" style={{ height: '27.500000000000004%' }}>
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-bold text-violet-700 dark:text-violet-300 opacity-0 group-hover:opacity-100 whitespace-nowrap">286</span>
            </div>
          </div>
          <div className="flex-1 flex items-end gap-0.5 relative h-full group justify-center">
            <div className="flex-1 max-w-[10px] rounded-t bg-gradient-to-t from-emerald-500 to-emerald-400 transition-all hover:brightness-110 relative" style={{ height: '95.96153846153847%' }}>
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-bold text-emerald-700 dark:text-emerald-300 opacity-0 group-hover:opacity-100 whitespace-nowrap">998</span>
            </div>
            <div className="flex-1 max-w-[10px] rounded-t bg-gradient-to-t from-rose-500 to-rose-400 transition-all hover:brightness-110 relative" style={{ height: '66.34615384615384%' }}>
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-bold text-rose-700 dark:text-rose-300 opacity-0 group-hover:opacity-100 whitespace-nowrap">690</span>
            </div>
            <div className="flex-1 max-w-[10px] rounded-t bg-gradient-to-t from-violet-500 to-violet-400 transition-all hover:brightness-110 relative" style={{ height: '29.615384615384617%' }}>
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-bold text-violet-700 dark:text-violet-300 opacity-0 group-hover:opacity-100 whitespace-nowrap">308</span>
            </div>
          </div>
          <div className="flex-1 flex items-end gap-0.5 relative h-full group justify-center">
            <div className="flex-1 max-w-[10px] rounded-t bg-gradient-to-t from-emerald-500 to-emerald-400 transition-all hover:brightness-110 relative" style={{ height: '100%' }}>
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-bold text-emerald-700 dark:text-emerald-300 opacity-0 group-hover:opacity-100 whitespace-nowrap">1040</span>
            </div>
            <div className="flex-1 max-w-[10px] rounded-t bg-gradient-to-t from-rose-500 to-rose-400 transition-all hover:brightness-110 relative" style={{ height: '69.03846153846153%' }}>
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-bold text-rose-700 dark:text-rose-300 opacity-0 group-hover:opacity-100 whitespace-nowrap">718</span>
            </div>
            <div className="flex-1 max-w-[10px] rounded-t bg-gradient-to-t from-violet-500 to-violet-400 transition-all hover:brightness-110 relative" style={{ height: '30.961538461538463%' }}>
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-bold text-violet-700 dark:text-violet-300 opacity-0 group-hover:opacity-100 whitespace-nowrap">322</span>
            </div>
          </div>
      </div>
      <div className="flex pl-10 mt-1">
        <div className="flex-1 text-center text-[9px] font-mono text-gray-500 dark:text-gray-500">May</div><div className="flex-1 text-center text-[9px] font-mono text-gray-500 dark:text-gray-500">Haz</div><div className="flex-1 text-center text-[9px] font-mono text-gray-500 dark:text-gray-500">Tem</div><div className="flex-1 text-center text-[9px] font-mono text-gray-500 dark:text-gray-500">Ağu</div><div className="flex-1 text-center text-[9px] font-mono text-gray-500 dark:text-gray-500">Eyl</div><div className="flex-1 text-center text-[9px] font-mono text-gray-500 dark:text-gray-500">Eki</div><div className="flex-1 text-center text-[9px] font-mono text-gray-500 dark:text-gray-500">Kas</div><div className="flex-1 text-center text-[9px] font-mono text-gray-500 dark:text-gray-500">Ara</div><div className="flex-1 text-center text-[9px] font-mono text-gray-500 dark:text-gray-500">Oca</div><div className="flex-1 text-center text-[9px] font-mono text-gray-500 dark:text-gray-500">Şub</div><div className="flex-1 text-center text-[9px] font-mono text-gray-500 dark:text-gray-500">Mar</div><div className="flex-1 text-center text-[9px] font-mono text-emerald-700 dark:text-emerald-300 font-bold">Nis</div>
      </div>
    </div>
    <div className="grid grid-cols-3 divide-x divide-gray-100 dark:divide-gray-700/40 border-t border-gray-100 dark:border-gray-700/40 bg-gray-50/50 dark:bg-[#17181f]/50">
      <div className="p-3 text-center">
        <p className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Yıllık Gelir</p>
        <p className="text-[15px] font-bold text-gray-900 dark:text-gray-100 mt-1">₺9.79M</p>
      </div>
      <div className="p-3 text-center">
        <p className="text-[9px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">Yıllık Gider</p>
        <p className="text-[15px] font-bold text-gray-900 dark:text-gray-100 mt-1">₺6.96M</p>
      </div>
      <div className="p-3 text-center">
        <p className="text-[9px] font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider">Yıllık Kar</p>
        <p className="text-[15px] font-bold text-gray-900 dark:text-gray-100 mt-1">₺2.83M</p>
      </div>
    </div>
  </div>

  {/* Gelir Kaynakları + Gider Kalemleri */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
    {/* Gelir Kaynakları */}
    <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-gray-100 dark:border-gray-700/40 flex items-center gap-2">
        <svg className="text-emerald-600 dark:text-emerald-400 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
        <div>
          <h4 className="text-[13px] font-bold text-gray-900 dark:text-gray-100">Gelir Kaynakları</h4>
          <p className="text-[10px] text-gray-500 dark:text-gray-400">Hizmet bazlı ciro dağılımı</p>
        </div>
      </div>
      <div className="p-4 space-y-2.5">
        
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold text-gray-700 dark:text-gray-300">Web Sitesi</span>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-sky-700 dark:text-sky-300">%27</span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 font-mono">₺281K</span>
            </div>
          </div>
          <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-sky-400 to-sky-600 rounded-full" style={{ width: '81%' }}></div></div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold text-gray-700 dark:text-gray-300">Google Ads</span>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300">%23</span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 font-mono">₺239K</span>
            </div>
          </div>
          <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full" style={{ width: '69%' }}></div></div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold text-gray-700 dark:text-gray-300">SEO Yönetim</span>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-violet-700 dark:text-violet-300">%18</span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 font-mono">₺187K</span>
            </div>
          </div>
          <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-violet-400 to-violet-600 rounded-full" style={{ width: '54%' }}></div></div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold text-gray-700 dark:text-gray-300">Meta Reklam</span>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300">%12</span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 font-mono">₺125K</span>
            </div>
          </div>
          <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full" style={{ width: '36%' }}></div></div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold text-gray-700 dark:text-gray-300">Prodüksiyon</span>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-rose-700 dark:text-rose-300">%11</span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 font-mono">₺114K</span>
            </div>
          </div>
          <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-rose-400 to-rose-600 rounded-full" style={{ width: '33%' }}></div></div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold text-gray-700 dark:text-gray-300">Diğer</span>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-gray-600 dark:text-gray-400">%9</span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 font-mono">₺94K</span>
            </div>
          </div>
          <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-gray-400 to-gray-600 rounded-full" style={{ width: '27%' }}></div></div>
        </div>
      </div>
    </div>

    {/* Gider Kalemleri */}
    <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-gray-100 dark:border-gray-700/40 flex items-center gap-2">
        <svg className="text-rose-600 dark:text-rose-400 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/></svg>
        <div>
          <h4 className="text-[13px] font-bold text-gray-900 dark:text-gray-100">Gider Kalemleri</h4>
          <p className="text-[10px] text-gray-500 dark:text-gray-400">Operasyonel gider yapısı</p>
        </div>
      </div>
      <div className="p-4 space-y-2.5">
        
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold text-gray-700 dark:text-gray-300">Maaş & Prim</span>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-violet-700 dark:text-violet-300">%52</span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 font-mono">₺373K</span>
            </div>
          </div>
          <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-violet-400 to-violet-600 rounded-full" style={{ width: '93.60000000000001%' }}></div></div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold text-gray-700 dark:text-gray-300">Yazılım & Araçlar</span>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-sky-700 dark:text-sky-300">%14</span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 font-mono">₺101K</span>
            </div>
          </div>
          <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-sky-400 to-sky-600 rounded-full" style={{ width: '25.2%' }}></div></div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold text-gray-700 dark:text-gray-300">AI Token & Servisler</span>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300">%8</span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 font-mono">₺57K</span>
            </div>
          </div>
          <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full" style={{ width: '14.4%' }}></div></div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold text-gray-700 dark:text-gray-300">Ofis & Faturalar</span>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-teal-700 dark:text-teal-300">%7</span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 font-mono">₺50K</span>
            </div>
          </div>
          <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-teal-400 to-teal-600 rounded-full" style={{ width: '12.6%' }}></div></div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold text-gray-700 dark:text-gray-300">Pazarlama</span>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-pink-700 dark:text-pink-300">%6</span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 font-mono">₺43K</span>
            </div>
          </div>
          <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-pink-400 to-pink-600 rounded-full" style={{ width: '10.8%' }}></div></div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold text-gray-700 dark:text-gray-300">Diğer</span>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-gray-600 dark:text-gray-400">%13</span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 font-mono">₺93K</span>
            </div>
          </div>
          <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-gray-400 to-gray-600 rounded-full" style={{ width: '23.400000000000002%' }}></div></div>
        </div>
      </div>
    </div>
  </div>

  {/* Alacak Yaşlandırma + Jenny AI Öngörüsü */}
  <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
    {/* Alacak Yaşlandırma */}
    <div className="lg:col-span-3 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-gray-100 dark:border-gray-700/40 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <svg className="text-amber-600 dark:text-amber-400 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <div>
            <h4 className="text-[13px] font-bold text-gray-900 dark:text-gray-100">Alacak Yaşlandırma</h4>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">Toplam ₺312K · 10 müşteri</p>
          </div>
        </div>
        <button onClick={() => undefined} className="text-[10px] font-bold text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1">Tahsilat Aç →</button>
      </div>
      <div className="p-3 grid grid-cols-2 md:grid-cols-4 gap-2">
        
        <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-500/30 rounded-lg">
          <p className="text-[9px] font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-widest mb-1">0-30 gün</p>
          <p className="text-[18px] font-bold text-gray-900 dark:text-gray-100 leading-none">₺180K</p>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">4 müşteri</p>
          <div className="h-1 bg-white/40 dark:bg-black/30 rounded-full overflow-hidden mt-2"><div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600" style={{ width: '57.692307692307686%' }}></div></div>
        </div>
        <div className="p-3 bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-500/30 rounded-lg">
          <p className="text-[9px] font-bold text-amber-700 dark:text-amber-300 uppercase tracking-widest mb-1">31-60 gün</p>
          <p className="text-[18px] font-bold text-gray-900 dark:text-gray-100 leading-none">₺85K</p>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">3 müşteri</p>
          <div className="h-1 bg-white/40 dark:bg-black/30 rounded-full overflow-hidden mt-2"><div className="h-full bg-gradient-to-r from-amber-400 to-amber-600" style={{ width: '27.24358974358974%' }}></div></div>
        </div>
        <div className="p-3 bg-gray-100 dark:bg-gray-800 border border-orange-200 dark:border-orange-500/30 rounded-lg">
          <p className="text-[9px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest mb-1">61-90 gün</p>
          <p className="text-[18px] font-bold text-gray-900 dark:text-gray-100 leading-none">₺32K</p>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">2 müşteri</p>
          <div className="h-1 bg-white/40 dark:bg-black/30 rounded-full overflow-hidden mt-2"><div className="h-full bg-gradient-to-r from-orange-400 to-orange-600" style={{ width: '10.256410256410255%' }}></div></div>
        </div>
        <div className="p-3 bg-rose-100 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-500/30 rounded-lg">
          <p className="text-[9px] font-bold text-rose-700 dark:text-rose-300 uppercase tracking-widest mb-1">90+ gün</p>
          <p className="text-[18px] font-bold text-gray-900 dark:text-gray-100 leading-none">₺15K</p>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">1 müşteri</p>
          <div className="h-1 bg-white/40 dark:bg-black/30 rounded-full overflow-hidden mt-2"><div className="h-full bg-gradient-to-r from-rose-400 to-rose-600" style={{ width: '4.807692307692308%' }}></div></div>
        </div>
      </div>
    </div>

    {/* Jenny AI Öngörüsü */}
    <div className="lg:col-span-2 relative overflow-hidden rounded-xl border border-amber-200/70 dark:border-amber-500/30">
      <div className="relative bg-gradient-to-br from-amber-50 via-white to-violet-50 dark:from-[#1a1530] dark:via-[#0f0820] dark:to-[#1a0e3a] p-4 h-full">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none aig"></div>
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <div className="relative">
              <div className="absolute inset-0 bg-amber-400 rounded-lg blur-md opacity-50 aig"></div>
              <div className="relative w-8 h-8 bg-gradient-to-br from-amber-400 via-amber-500 to-violet-600 rounded-lg flex items-center justify-center">
                <svg className="text-white w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              </div>
            </div>
            <div>
              <h5 className="text-[12px] font-bold text-gray-900 dark:text-white">Jenny'nin Finans Yorumu</h5>
              <p className="text-[9px] text-gray-500 dark:text-white/60 font-mono">Finans_Talimat.JSON v3.0.1</p>
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="p-2 bg-white/70 dark:bg-white/5 border border-emerald-200 dark:border-emerald-400/30 rounded-lg">
              <p className="text-[11px] text-gray-800 dark:text-white/90"><span className="font-bold text-emerald-700 dark:text-emerald-300">✓ İyi:</span> Mayıs'ta net kar marjı %27 → %31 yükselebilir (MRR ivmesi)</p>
            </div>
            <div className="p-2 bg-white/70 dark:bg-white/5 border border-amber-200 dark:border-amber-400/30 rounded-lg">
              <p className="text-[11px] text-gray-800 dark:text-white/90"><span className="font-bold text-amber-700 dark:text-amber-300">⚠ Dikkat:</span> 90+ gün alacak ₺15K · hukuki takip önerilir</p>
            </div>
            <div className="p-2 bg-white/70 dark:bg-white/5 border border-violet-200 dark:border-violet-400/30 rounded-lg">
              <p className="text-[11px] text-gray-800 dark:text-white/90"><span className="font-bold text-violet-700 dark:text-violet-300">◆ Fırsat:</span> Maaş giderleri %52 · freelance dönüşümü ile %46 hedeflenebilir</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
      </>
    </Layout>
  );
}
