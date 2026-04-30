import Layout from '../components/Layout';

export default function SatisPipeline() {
  return (
    <Layout activeId="pipeline" breadcrumb="Genel Müdür · Satış & Pipeline">
      <>
{/* Başlık + Dönem */}
  <div className="flex items-center justify-between gap-3 flex-wrap">
    <div className="flex items-center gap-2.5">
      <div className="w-9 h-9 bg-sky-100 dark:bg-sky-500/20 rounded-lg flex items-center justify-center">
        <svg className="text-sky-600 dark:text-sky-400 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
      </div>
      <div>
        <h1 className="text-[19px] font-bold text-gray-900 dark:text-gray-100 leading-tight">Satış & Pipeline</h1>
        <p className="text-[11px] text-gray-500 dark:text-gray-400">Pipeline değeri · Huni · Ekip · Yakın kapamalar</p>
      </div>
    </div>
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700/40 rounded-lg">
        <button className="px-2.5 py-1 text-[10px] text-gray-500 dark:text-gray-400 font-semibold rounded-md">7G</button>
        <button className="px-2.5 py-1 text-[10px] bg-white dark:bg-sky-500/20 text-sky-700 dark:text-sky-300 font-bold rounded-md">30G</button>
        <button className="px-2.5 py-1 text-[10px] text-gray-500 dark:text-gray-400 font-semibold rounded-md">3 Ay</button>
      </div>
      <button onClick={() => undefined} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 dark:bg-gray-100 dark:text-gray-900 text-white text-[11px] font-bold rounded-lg hover:opacity-90 transition-opacity">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
        Satış Panosuna Git
      </button>
    </div>
  </div>

  {/* 6 KPI */}
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3">
    
    <div className="relative overflow-hidden bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-3.5 hover:shadow-sm hover:-translate-y-0.5 transition-all">
      <div className="absolute -top-8 -right-8 w-24 h-24 bg-sky-500/5 rounded-full blur-xl pointer-events-none"></div>
      <div className="relative flex items-start justify-between mb-2">
        <div className="w-8 h-8 bg-sky-100 dark:bg-sky-900/30 rounded-lg flex items-center justify-center"><svg className="text-sky-700 dark:text-sky-300 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div>
        <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded">+%18.4</span>
      </div>
      <div className="relative text-[22px] font-bold text-gray-900 dark:text-gray-50 leading-none mb-1">₺4.2M</div>
      <div className="relative text-[11px] font-semibold text-gray-600 dark:text-gray-400 leading-tight">Pipeline Değeri</div>
      <div className="relative text-[9px] text-gray-400 dark:text-gray-500 mt-0.5">178 aktif teklif</div>
    </div>
    <div className="relative overflow-hidden bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-3.5 hover:shadow-sm hover:-translate-y-0.5 transition-all">
      <div className="absolute -top-8 -right-8 w-24 h-24 bg-violet-500/5 rounded-full blur-xl pointer-events-none"></div>
      <div className="relative flex items-start justify-between mb-2">
        <div className="w-8 h-8 bg-violet-100 dark:bg-violet-900/30 rounded-lg flex items-center justify-center"><svg className="text-violet-700 dark:text-violet-300 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg></div>
        <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded">+%12.3</span>
      </div>
      <div className="relative text-[22px] font-bold text-gray-900 dark:text-gray-50 leading-none mb-1">178</div>
      <div className="relative text-[11px] font-semibold text-gray-600 dark:text-gray-400 leading-tight">Aktif Teklif</div>
      <div className="relative text-[9px] text-gray-400 dark:text-gray-500 mt-0.5">Son 30 günde</div>
    </div>
    <div className="relative overflow-hidden bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-3.5 hover:shadow-sm hover:-translate-y-0.5 transition-all">
      <div className="absolute -top-8 -right-8 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none"></div>
      <div className="relative flex items-start justify-between mb-2">
        <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center"><svg className="text-emerald-700 dark:text-emerald-300 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polyline points="20 6 9 17 4 12"/></svg></div>
        <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded">+%3.2</span>
      </div>
      <div className="relative text-[22px] font-bold text-gray-900 dark:text-gray-50 leading-none mb-1">%42.3</div>
      <div className="relative text-[11px] font-semibold text-gray-600 dark:text-gray-400 leading-tight">Kazanma Oranı</div>
      <div className="relative text-[9px] text-gray-400 dark:text-gray-500 mt-0.5">Sektör ort %35</div>
    </div>
    <div className="relative overflow-hidden bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-3.5 hover:shadow-sm hover:-translate-y-0.5 transition-all">
      <div className="absolute -top-8 -right-8 w-24 h-24 bg-teal-500/5 rounded-full blur-xl pointer-events-none"></div>
      <div className="relative flex items-start justify-between mb-2">
        <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center"><svg className="text-teal-700 dark:text-teal-300 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg></div>
        <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded">+6</span>
      </div>
      <div className="relative text-[22px] font-bold text-gray-900 dark:text-gray-50 leading-none mb-1">18</div>
      <div className="relative text-[11px] font-semibold text-gray-600 dark:text-gray-400 leading-tight">Aylık Kapama</div>
      <div className="relative text-[9px] text-gray-400 dark:text-gray-500 mt-0.5">Nisan · 23 gün</div>
    </div>
    <div className="relative overflow-hidden bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-3.5 hover:shadow-sm hover:-translate-y-0.5 transition-all">
      <div className="absolute -top-8 -right-8 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl pointer-events-none"></div>
      <div className="relative flex items-start justify-between mb-2">
        <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center"><svg className="text-indigo-700 dark:text-indigo-300 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polygon points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div>
        <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded">+%8.3</span>
      </div>
      <div className="relative text-[22px] font-bold text-gray-900 dark:text-gray-50 leading-none mb-1">₺42K</div>
      <div className="relative text-[11px] font-semibold text-gray-600 dark:text-gray-400 leading-tight">MRR Yeni</div>
      <div className="relative text-[9px] text-gray-400 dark:text-gray-500 mt-0.5">Nisan eklenen</div>
    </div>
    <div className="relative overflow-hidden bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-3.5 hover:shadow-sm hover:-translate-y-0.5 transition-all">
      <div className="absolute -top-8 -right-8 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none"></div>
      <div className="relative flex items-start justify-between mb-2">
        <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center"><svg className="text-amber-700 dark:text-amber-300 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/></svg></div>
        <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded">+%6.1</span>
      </div>
      <div className="relative text-[22px] font-bold text-gray-900 dark:text-gray-50 leading-none mb-1">₺85K</div>
      <div className="relative text-[11px] font-semibold text-gray-600 dark:text-gray-400 leading-tight">Ort. Anlaşma</div>
      <div className="relative text-[9px] text-gray-400 dark:text-gray-500 mt-0.5">Kapanan başına</div>
    </div>
  </div>

  {/* Satış Hunisi */}
  <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
    <div className="p-4 border-b border-gray-100 dark:border-gray-700/40 flex items-center justify-between gap-2 flex-wrap">
      <div className="flex items-center gap-2">
        <svg className="text-violet-600 dark:text-violet-400 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
        <div>
          <h4 className="text-[13px] font-bold text-gray-900 dark:text-gray-100">Satış Hunisi · Uçtan Uca Akış</h4>
          <p className="text-[10px] text-gray-500 dark:text-gray-400">178 talep → 18 aktif sözleşme · 10.1% dönüşüm</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Toplam Değer</p>
        <p className="text-[18px] font-black text-emerald-700 dark:text-emerald-300 leading-none">₺4.2M</p>
      </div>
    </div>
    <div className="p-4 space-y-1.5">
      
        <div>
          <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-500/30 flex items-center justify-center text-[10px] font-bold text-gray-600 dark:text-gray-400">1</div>
              <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100">Talep Havuzu</p>
            </div>
            <div className="flex items-center gap-3 text-right">
              
              
              <span className="text-[14px] font-bold text-gray-900 dark:text-gray-100 min-w-[32px]">178</span>
            </div>
          </div>
          <div className="h-7 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
            <div className="h-full bg-gradient-to-r from-gray-400 to-gray-600 rounded-lg flex items-center justify-end pr-3 transition-all" style={{ width: '100%' }}><span className="text-[10px] font-bold text-white drop-shadow">%100</span></div>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-violet-100 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-500/30 flex items-center justify-center text-[10px] font-bold text-violet-700 dark:text-violet-300">2</div>
              <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100">Kalifiye</p>
            </div>
            <div className="flex items-center gap-3 text-right">
              <div><span className="text-[9px] text-gray-500 dark:text-gray-400">Dönüşüm </span><span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300">%79.8</span></div>
              <span className="text-[9px] font-bold text-rose-600 dark:text-rose-400">-36</span>
              <span className="text-[14px] font-bold text-gray-900 dark:text-gray-100 min-w-[32px]">142</span>
            </div>
          </div>
          <div className="h-7 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
            <div className="h-full bg-gradient-to-r from-violet-400 to-violet-600 rounded-lg flex items-center justify-end pr-3 transition-all" style={{ width: '79.8%' }}><span className="text-[10px] font-bold text-white drop-shadow">%79.8</span></div>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-sky-100 dark:bg-sky-900/30 border border-sky-200 dark:border-sky-500/30 flex items-center justify-center text-[10px] font-bold text-sky-700 dark:text-sky-300">3</div>
              <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100">Teklif Gönderildi</p>
            </div>
            <div className="flex items-center gap-3 text-right">
              <div><span className="text-[9px] text-gray-500 dark:text-gray-400">Dönüşüm </span><span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300">%82.4</span></div>
              <span className="text-[9px] font-bold text-rose-600 dark:text-rose-400">-25</span>
              <span className="text-[14px] font-bold text-gray-900 dark:text-gray-100 min-w-[32px]">117</span>
            </div>
          </div>
          <div className="h-7 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
            <div className="h-full bg-gradient-to-r from-sky-400 to-sky-600 rounded-lg flex items-center justify-end pr-3 transition-all" style={{ width: '65.7%' }}><span className="text-[10px] font-bold text-white drop-shadow">%65.7</span></div>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-indigo-100 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center text-[10px] font-bold text-indigo-700 dark:text-indigo-300">4</div>
              <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100">İnceleniyor</p>
            </div>
            <div className="flex items-center gap-3 text-right">
              <div><span className="text-[9px] text-gray-500 dark:text-gray-400">Dönüşüm </span><span className="text-[11px] font-bold text-rose-700 dark:text-rose-300">%49.6</span></div>
              <span className="text-[9px] font-bold text-rose-600 dark:text-rose-400">-59</span>
              <span className="text-[14px] font-bold text-gray-900 dark:text-gray-100 min-w-[32px]">58</span>
            </div>
          </div>
          <div className="h-7 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-lg flex items-center justify-end pr-3 transition-all" style={{ width: '32.6%' }}><span className="text-[10px] font-bold text-white drop-shadow">%32.6</span></div>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-500/30 flex items-center justify-center text-[10px] font-bold text-amber-700 dark:text-amber-300">5</div>
              <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100">Onaylandı</p>
            </div>
            <div className="flex items-center gap-3 text-right">
              <div><span className="text-[9px] text-gray-500 dark:text-gray-400">Dönüşüm </span><span className="text-[11px] font-bold text-amber-700 dark:text-amber-300">%55.2</span></div>
              <span className="text-[9px] font-bold text-rose-600 dark:text-rose-400">-26</span>
              <span className="text-[14px] font-bold text-gray-900 dark:text-gray-100 min-w-[32px]">32</span>
            </div>
          </div>
          <div className="h-7 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-lg flex items-center justify-end pr-3 transition-all" style={{ width: '18%' }}><span className="text-[10px] font-bold text-white drop-shadow">%18</span></div>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center text-[10px] font-bold text-emerald-700 dark:text-emerald-300">6</div>
              <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100">Aktif Sözleşme</p>
            </div>
            <div className="flex items-center gap-3 text-right">
              <div><span className="text-[9px] text-gray-500 dark:text-gray-400">Dönüşüm </span><span className="text-[11px] font-bold text-amber-700 dark:text-amber-300">%56.3</span></div>
              <span className="text-[9px] font-bold text-rose-600 dark:text-rose-400">-14</span>
              <span className="text-[14px] font-bold text-gray-900 dark:text-gray-100 min-w-[32px]">18</span>
            </div>
          </div>
          <div className="h-7 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-end pr-3 transition-all" style={{ width: '10.1%' }}><span className="text-[10px] font-bold text-white drop-shadow">%10.1</span></div>
          </div>
        </div>
    </div>
  </div>

  {/* Ekip Performansı + Bu Hafta Kapanacaklar */}
  <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
    {/* Ekip Performansı */}
    <div className="lg:col-span-3 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-gray-100 dark:border-gray-700/40 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <svg className="text-amber-600 dark:text-amber-400 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
          <div>
            <h4 className="text-[13px] font-bold text-gray-900 dark:text-gray-100">Satış Ekibi</h4>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">4 temsilci · liderlik tablosu</p>
          </div>
        </div>
      </div>
      <div className="divide-y divide-gray-100 dark:divide-gray-700/40">
        
        <div className="p-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-400 to-violet-600 rounded-xl flex items-center justify-center text-white text-[11px] font-bold">ÇA</div>
              <span className="absolute -top-1 -right-1 text-[14px]">🥇</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100">Çiğdem Alataş</p>
                <span className="text-[9px] font-bold px-1.5 py-0.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 rounded">%53.6 kazanma</span>
              </div>
              <div className="grid grid-cols-4 gap-2 mt-1.5">
                <div>
                  <p className="text-[9px] text-gray-500 dark:text-gray-400">Ciro</p>
                  <p className="text-[11px] font-bold text-gray-900 dark:text-gray-100">₺1284K</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-500 dark:text-gray-400">Kapama</p>
                  <p className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300">15</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-500 dark:text-gray-400">Pipeline</p>
                  <p className="text-[11px] font-bold text-gray-700 dark:text-gray-300">₺1420K</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-500 dark:text-gray-400">Prim</p>
                  <p className="text-[11px] font-bold text-amber-700 dark:text-amber-300">₺38.5K</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="p-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-sky-600 rounded-xl flex items-center justify-center text-white text-[11px] font-bold">BY</div>
              <span className="absolute -top-1 -right-1 text-[14px]">🥈</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100">Berke Yılmaz</p>
                <span className="text-[9px] font-bold px-1.5 py-0.5 bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 rounded">%47.8 kazanma</span>
              </div>
              <div className="grid grid-cols-4 gap-2 mt-1.5">
                <div>
                  <p className="text-[9px] text-gray-500 dark:text-gray-400">Ciro</p>
                  <p className="text-[11px] font-bold text-gray-900 dark:text-gray-100">₺938K</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-500 dark:text-gray-400">Kapama</p>
                  <p className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300">11</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-500 dark:text-gray-400">Pipeline</p>
                  <p className="text-[11px] font-bold text-gray-700 dark:text-gray-300">₺1180K</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-500 dark:text-gray-400">Prim</p>
                  <p className="text-[11px] font-bold text-amber-700 dark:text-amber-300">₺28.1K</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="p-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center text-white text-[11px] font-bold">MK</div>
              <span className="absolute -top-1 -right-1 text-[14px]">🥉</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100">Mert Kaya</p>
                <span className="text-[9px] font-bold px-1.5 py-0.5 bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 rounded">%47.4 kazanma</span>
              </div>
              <div className="grid grid-cols-4 gap-2 mt-1.5">
                <div>
                  <p className="text-[9px] text-gray-500 dark:text-gray-400">Ciro</p>
                  <p className="text-[11px] font-bold text-gray-900 dark:text-gray-100">₺742K</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-500 dark:text-gray-400">Kapama</p>
                  <p className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300">9</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-500 dark:text-gray-400">Pipeline</p>
                  <p className="text-[11px] font-bold text-gray-700 dark:text-gray-300">₺960K</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-500 dark:text-gray-400">Prim</p>
                  <p className="text-[11px] font-bold text-amber-700 dark:text-amber-300">₺22.3K</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="p-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center text-white text-[11px] font-bold">DA</div>
              
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100">Deniz Arıcan</p>
                <span className="text-[9px] font-bold px-1.5 py-0.5 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 rounded">%43.8 kazanma</span>
              </div>
              <div className="grid grid-cols-4 gap-2 mt-1.5">
                <div>
                  <p className="text-[9px] text-gray-500 dark:text-gray-400">Ciro</p>
                  <p className="text-[11px] font-bold text-gray-900 dark:text-gray-100">₺486K</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-500 dark:text-gray-400">Kapama</p>
                  <p className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300">7</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-500 dark:text-gray-400">Pipeline</p>
                  <p className="text-[11px] font-bold text-gray-700 dark:text-gray-300">₺640K</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-500 dark:text-gray-400">Prim</p>
                  <p className="text-[11px] font-bold text-amber-700 dark:text-amber-300">₺14.6K</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Bu Hafta Kapanacaklar */}
    <div className="lg:col-span-2 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-gray-100 dark:border-gray-700/40">
        <div className="flex items-center gap-2">
          <svg className="text-rose-600 dark:text-rose-400 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <div>
            <h4 className="text-[13px] font-bold text-gray-900 dark:text-gray-100">Bu Hafta Kapanacaklar</h4>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">5 sıcak fırsat · ₺1919K potansiyel</p>
          </div>
        </div>
      </div>
      <div className="divide-y divide-gray-100 dark:divide-gray-700/40">
        
        <div className="p-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-400 to-violet-600 rounded-lg flex items-center justify-center shrink-0 text-white text-[10px] font-bold">ÇA</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1 mb-0.5">
                <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100 truncate">Maya Kozmetik</p>
                <span className="text-[12px] font-bold text-gray-900 dark:text-gray-100 shrink-0">₺457K</span>
              </div>
              <div className="flex items-center justify-between gap-1 text-[10px]">
                <span className="text-gray-500 dark:text-gray-400 truncate">360 Dijital · Perş · 25 Nis</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-300 shrink-0">%85</span>
              </div>
              <div className="h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mt-1.5">
                <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600" style={{ width: '85%' }}></div>
              </div>
            </div>
          </div>
        </div>
        <div className="p-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-400 to-violet-600 rounded-lg flex items-center justify-center shrink-0 text-white text-[10px] font-bold">ÇA</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1 mb-0.5">
                <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100 truncate">Orion Eğitim · Yenileme</p>
                <span className="text-[12px] font-bold text-gray-900 dark:text-gray-100 shrink-0">₺504K</span>
              </div>
              <div className="flex items-center justify-between gap-1 text-[10px]">
                <span className="text-gray-500 dark:text-gray-400 truncate">SEO+Ads 12 ay · Salı · 29 Nis</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-300 shrink-0">%88</span>
              </div>
              <div className="h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mt-1.5">
                <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600" style={{ width: '88%' }}></div>
              </div>
            </div>
          </div>
        </div>
        <div className="p-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-sky-600 rounded-lg flex items-center justify-center shrink-0 text-white text-[10px] font-bold">BY</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1 mb-0.5">
                <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100 truncate">İzmirgaz A.Ş.</p>
                <span className="text-[12px] font-bold text-gray-900 dark:text-gray-100 shrink-0">₺680K</span>
              </div>
              <div className="flex items-center justify-between gap-1 text-[10px]">
                <span className="text-gray-500 dark:text-gray-400 truncate">Premium 360 · Cuma · 26 Nis</span>
                <span className="font-bold text-amber-700 dark:text-amber-300 shrink-0">%60</span>
              </div>
              <div className="h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mt-1.5">
                <div className="h-full bg-gradient-to-r from-amber-400 to-amber-600" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>
        </div>
        <div className="p-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center shrink-0 text-white text-[10px] font-bold">MK</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1 mb-0.5">
                <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100 truncate">Fresh Events Ltd</p>
                <span className="text-[12px] font-bold text-gray-900 dark:text-gray-100 shrink-0">₺186K</span>
              </div>
              <div className="flex items-center justify-between gap-1 text-[10px]">
                <span className="text-gray-500 dark:text-gray-400 truncate">Web + SEO · Cuma · 26 Nis</span>
                <span className="font-bold text-sky-700 dark:text-sky-300 shrink-0">%72</span>
              </div>
              <div className="h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mt-1.5">
                <div className="h-full bg-gradient-to-r from-sky-400 to-sky-600" style={{ width: '72%' }}></div>
              </div>
            </div>
          </div>
        </div>
        <div className="p-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center shrink-0 text-white text-[10px] font-bold">DA</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1 mb-0.5">
                <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100 truncate">Deha Teknoloji</p>
                <span className="text-[12px] font-bold text-gray-900 dark:text-gray-100 shrink-0">₺92K</span>
              </div>
              <div className="flex items-center justify-between gap-1 text-[10px]">
                <span className="text-gray-500 dark:text-gray-400 truncate">Google Ads · Pzt · 28 Nis</span>
                <span className="font-bold text-amber-700 dark:text-amber-300 shrink-0">%55</span>
              </div>
              <div className="h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mt-1.5">
                <div className="h-full bg-gradient-to-r from-amber-400 to-amber-600" style={{ width: '55%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Jenny AI Öngörüsü (satış) */}
  <div className="relative overflow-hidden rounded-xl border border-amber-200/70 dark:border-amber-500/30">
    <div className="relative bg-gradient-to-br from-amber-50 via-white to-violet-50 dark:from-[#1a1530] dark:via-[#0f0820] dark:to-[#1a0e3a] p-4">
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none aig"></div>
      <div className="relative flex items-start gap-3">
        <div className="relative shrink-0">
          <div className="absolute inset-0 bg-amber-400 rounded-lg blur-md opacity-50 aig"></div>
          <div className="relative w-9 h-9 bg-gradient-to-br from-amber-400 via-amber-500 to-violet-600 rounded-lg flex items-center justify-center">
            <svg className="text-white w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <h5 className="text-[12px] font-bold text-gray-900 dark:text-white">Jenny'nin Satış Yorumu</h5>
            <span className="text-[9px] font-mono text-gray-500 dark:text-white/60">Satis_Talimat.JSON v2.1.4</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="p-2.5 bg-white/70 dark:bg-white/5 border border-emerald-200 dark:border-emerald-400/30 rounded-lg">
              <p className="text-[11px] text-gray-800 dark:text-white/90"><span className="font-bold text-emerald-700 dark:text-emerald-300">✓ İyi:</span> Nisan kazanma oranı %42.3 · sektör ort. %35. Çiğdem %53.6 ile ekip lideri.</p>
            </div>
            <div className="p-2.5 bg-white/70 dark:bg-white/5 border border-amber-200 dark:border-amber-400/30 rounded-lg">
              <p className="text-[11px] text-gray-800 dark:text-white/90"><span className="font-bold text-amber-700 dark:text-amber-300">⚠ Dikkat:</span> Deniz Arıcan iskonto %10.3 (sektör %7) · mentor oturumu önerilir.</p>
            </div>
            <div className="p-2.5 bg-white/70 dark:bg-white/5 border border-violet-200 dark:border-violet-400/30 rounded-lg">
              <p className="text-[11px] text-gray-800 dark:text-white/90"><span className="font-bold text-violet-700 dark:text-violet-300">◆ Fırsat:</span> Premium 360 pipeline ₺1.2M · İzmirgaz'ın kapanması bu ay MRR'ı %18 büyütür.</p>
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
