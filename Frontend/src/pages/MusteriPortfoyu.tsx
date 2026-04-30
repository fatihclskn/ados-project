import Layout from '../components/Layout';

export default function MusteriPortfoyu() {
  return (
    <Layout activeId="customers" breadcrumb="Genel Müdür · Müşteri Portföyü">
      <>
{/* Başlık + Dönem */}
  <div className="flex items-center justify-between gap-3 flex-wrap">
    <div className="flex items-center gap-2.5">
      <div className="w-9 h-9 bg-violet-100 dark:bg-violet-500/20 rounded-lg flex items-center justify-center">
        <svg className="text-violet-600 dark:text-violet-400 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
      </div>
      <div>
        <h1 className="text-[19px] font-bold text-gray-900 dark:text-gray-100 leading-tight">Müşteri Portföyü</h1>
        <p className="text-[11px] text-gray-500 dark:text-gray-400">Segmentasyon · Sağlık · Churn riski · LTV analizi</p>
      </div>
    </div>
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700/40 rounded-lg">
        <button className="px-2.5 py-1 text-[10px] text-gray-500 dark:text-gray-400 font-semibold rounded-md">Çeyrek</button>
        <button className="px-2.5 py-1 text-[10px] bg-white dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 font-bold rounded-md">Bu Ay</button>
        <button className="px-2.5 py-1 text-[10px] text-gray-500 dark:text-gray-400 font-semibold rounded-md">Yıllık</button>
      </div>
      <button onClick={() => undefined} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 dark:bg-gray-100 dark:text-gray-900 text-white text-[11px] font-bold rounded-lg hover:opacity-90 transition-opacity">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
        Portföy Raporu
      </button>
    </div>
  </div>

  {/* 6 KPI */}
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3">
    
    <div className="relative overflow-hidden bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-3.5 hover:shadow-sm hover:-translate-y-0.5 transition-all">
      <div className="absolute -top-8 -right-8 w-24 h-24 bg-violet-500/5 rounded-full blur-xl pointer-events-none"></div>
      <div className="relative flex items-start justify-between mb-2">
        <div className="w-8 h-8 bg-violet-100 dark:bg-violet-900/30 rounded-lg flex items-center justify-center"><svg className="text-violet-700 dark:text-violet-300 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg></div>
        <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded">+9</span>
      </div>
      <div className="relative text-[22px] font-bold text-gray-900 dark:text-gray-50 leading-none mb-1">87</div>
      <div className="relative text-[11px] font-semibold text-gray-600 dark:text-gray-400 leading-tight">Aktif Müşteri</div>
      <div className="relative text-[9px] text-gray-400 dark:text-gray-500 mt-0.5">Çeyrek başı: 78</div>
    </div>
    <div className="relative overflow-hidden bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-3.5 hover:shadow-sm hover:-translate-y-0.5 transition-all">
      <div className="absolute -top-8 -right-8 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none"></div>
      <div className="relative flex items-start justify-between mb-2">
        <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center"><svg className="text-emerald-700 dark:text-emerald-300 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg></div>
        <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded">-%0.4</span>
      </div>
      <div className="relative text-[22px] font-bold text-gray-900 dark:text-gray-50 leading-none mb-1">%2.1</div>
      <div className="relative text-[11px] font-semibold text-gray-600 dark:text-gray-400 leading-tight">Churn Oranı</div>
      <div className="relative text-[9px] text-gray-400 dark:text-gray-500 mt-0.5">Hedef &lt;%3</div>
    </div>
    <div className="relative overflow-hidden bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-3.5 hover:shadow-sm hover:-translate-y-0.5 transition-all">
      <div className="absolute -top-8 -right-8 w-24 h-24 bg-sky-500/5 rounded-full blur-xl pointer-events-none"></div>
      <div className="relative flex items-start justify-between mb-2">
        <div className="w-8 h-8 bg-sky-100 dark:bg-sky-900/30 rounded-lg flex items-center justify-center"><svg className="text-sky-700 dark:text-sky-300 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div>
        <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded">+%12.3</span>
      </div>
      <div className="relative text-[22px] font-bold text-gray-900 dark:text-gray-50 leading-none mb-1">₺284K</div>
      <div className="relative text-[11px] font-semibold text-gray-600 dark:text-gray-400 leading-tight">Ort. LTV</div>
      <div className="relative text-[9px] text-gray-400 dark:text-gray-500 mt-0.5">Müşteri yaşam boyu</div>
    </div>
    <div className="relative overflow-hidden bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-3.5 hover:shadow-sm hover:-translate-y-0.5 transition-all">
      <div className="absolute -top-8 -right-8 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl pointer-events-none"></div>
      <div className="relative flex items-start justify-between mb-2">
        <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center"><svg className="text-indigo-700 dark:text-indigo-300 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
        <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded">+2 ay</span>
      </div>
      <div className="relative text-[22px] font-bold text-gray-900 dark:text-gray-50 leading-none mb-1">14 ay</div>
      <div className="relative text-[11px] font-semibold text-gray-600 dark:text-gray-400 leading-tight">Ort. Müşteri Yaşı</div>
      <div className="relative text-[9px] text-gray-400 dark:text-gray-500 mt-0.5">Retention yüksek</div>
    </div>
    <div className="relative overflow-hidden bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-3.5 hover:shadow-sm hover:-translate-y-0.5 transition-all">
      <div className="absolute -top-8 -right-8 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none"></div>
      <div className="relative flex items-start justify-between mb-2">
        <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center"><svg className="text-amber-700 dark:text-amber-300 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div>
        <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded">+6</span>
      </div>
      <div className="relative text-[22px] font-bold text-gray-900 dark:text-gray-50 leading-none mb-1">74</div>
      <div className="relative text-[11px] font-semibold text-gray-600 dark:text-gray-400 leading-tight">NPS Skoru</div>
      <div className="relative text-[9px] text-gray-400 dark:text-gray-500 mt-0.5">Sektör ort: 42</div>
    </div>
    <div className="relative overflow-hidden bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-3.5 hover:shadow-sm hover:-translate-y-0.5 transition-all">
      <div className="absolute -top-8 -right-8 w-24 h-24 bg-teal-500/5 rounded-full blur-xl pointer-events-none"></div>
      <div className="relative flex items-start justify-between mb-2">
        <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center"><svg className="text-teal-700 dark:text-teal-300 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21 12a9 9 0 1 1-6.219-8.56"/><polyline points="21 4 21 12 13 12"/></svg></div>
        <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded">+%0.4</span>
      </div>
      <div className="relative text-[22px] font-bold text-gray-900 dark:text-gray-50 leading-none mb-1">%97.9</div>
      <div className="relative text-[11px] font-semibold text-gray-600 dark:text-gray-400 leading-tight">Retention</div>
      <div className="relative text-[9px] text-gray-400 dark:text-gray-500 mt-0.5">Aylık · son 12 ay</div>
    </div>
  </div>

  {/* Segmentasyon + Sağlık Durumu */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
    {/* Müşteri Segmentasyonu */}
    <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-gray-100 dark:border-gray-700/40 flex items-center gap-2">
        <svg className="text-violet-600 dark:text-violet-400 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
        <div>
          <h4 className="text-[13px] font-bold text-gray-900 dark:text-gray-100">Müşteri Segmentasyonu</h4>
          <p className="text-[10px] text-gray-500 dark:text-gray-400">87 aktif müşteri · ₺5.71M yıllık ciro</p>
        </div>
      </div>
      <div className="p-4 space-y-2.5">
        
        <div>
          <div className="flex items-center justify-between mb-1.5 gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 bg-violet-100 dark:bg-violet-900/30 rounded-md flex items-center justify-center shrink-0"><svg className="text-violet-700 dark:text-violet-300 w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div>
              <div className="min-w-0">
                <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100">Premium 360</p>
                <p className="text-[9px] text-gray-500 dark:text-gray-400">8 müşteri · ort ₺350K/müşteri</p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[13px] font-bold text-violet-700 dark:text-violet-300">₺2.80M</p>
              <p className="text-[9px] text-gray-500 dark:text-gray-400">%49.0 ciro</p>
            </div>
          </div>
          <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-violet-400 to-violet-600 rounded-full" style={{ width: '49.0%' }}></div>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5 gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 bg-sky-100 dark:bg-sky-900/30 rounded-md flex items-center justify-center shrink-0"><svg className="text-sky-700 dark:text-sky-300 w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 3v18M16 3v18M3 8h18M3 16h18"/></svg></div>
              <div className="min-w-0">
                <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100">Kurumsal</p>
                <p className="text-[9px] text-gray-500 dark:text-gray-400">22 müşteri · ort ₺73K/müşteri</p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[13px] font-bold text-sky-700 dark:text-sky-300">₺1.60M</p>
              <p className="text-[9px] text-gray-500 dark:text-gray-400">%28.0 ciro</p>
            </div>
          </div>
          <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-sky-400 to-sky-600 rounded-full" style={{ width: '28.0%' }}></div>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5 gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 bg-emerald-100 dark:bg-emerald-900/30 rounded-md flex items-center justify-center shrink-0"><svg className="text-emerald-700 dark:text-emerald-300 w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/></svg></div>
              <div className="min-w-0">
                <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100">KOBİ</p>
                <p className="text-[9px] text-gray-500 dark:text-gray-400">38 müşteri · ort ₺23K/müşteri</p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[13px] font-bold text-emerald-700 dark:text-emerald-300">₺0.89M</p>
              <p className="text-[9px] text-gray-500 dark:text-gray-400">%15.6 ciro</p>
            </div>
          </div>
          <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full" style={{ width: '15.6%' }}></div>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5 gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 bg-amber-100 dark:bg-amber-900/30 rounded-md flex items-center justify-center shrink-0"><svg className="text-amber-700 dark:text-amber-300 w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg></div>
              <div className="min-w-0">
                <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100">Startup</p>
                <p className="text-[9px] text-gray-500 dark:text-gray-400">19 müşteri · ort ₺22K/müşteri</p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[13px] font-bold text-amber-700 dark:text-amber-300">₺0.42M</p>
              <p className="text-[9px] text-gray-500 dark:text-gray-400">%7.4 ciro</p>
            </div>
          </div>
          <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full" style={{ width: '7.4%' }}></div>
          </div>
        </div>
      </div>
    </div>

    {/* Müşteri Sağlık Durumu */}
    <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-gray-100 dark:border-gray-700/40 flex items-center gap-2">
        <svg className="text-emerald-600 dark:text-emerald-400 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
        <div>
          <h4 className="text-[13px] font-bold text-gray-900 dark:text-gray-100">Müşteri Sağlık Dağılımı</h4>
          <p className="text-[10px] text-gray-500 dark:text-gray-400">NPS + kullanım + ödeme davranışı skoruna göre</p>
        </div>
      </div>
      <div className="p-4">
        {/* Stacked bar */}
        <div className="h-8 flex rounded-lg overflow-hidden shadow-inner mb-4">
          <div className="bg-gradient-to-r from-emerald-400 to-emerald-600 flex items-center justify-center" style={{ width: '78%' }} title="Sağlıklı: 68"><span className="text-[10px] font-bold text-white drop-shadow">%78</span></div><div className="bg-gradient-to-r from-sky-400 to-sky-600 flex items-center justify-center" style={{ width: '16%' }} title="İzlemede: 14"><span className="text-[10px] font-bold text-white drop-shadow">%16</span></div><div className="bg-gradient-to-r from-amber-400 to-amber-600 flex items-center justify-center" style={{ width: '5%' }} title="Risk: 4"><span className="text-[10px] font-bold text-white drop-shadow">%5</span></div><div className="bg-gradient-to-r from-rose-400 to-rose-600 flex items-center justify-center" style={{ width: '1%' }} title="Kritik: 1"><span className="text-[10px] font-bold text-white drop-shadow">%1</span></div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          
          <div className="flex items-start gap-2 p-2 bg-gray-50 dark:bg-[#17181f] rounded-lg">
            <div className="w-7 h-7 bg-emerald-100 dark:bg-emerald-900/30 rounded-md flex items-center justify-center shrink-0"><svg className="text-emerald-700 dark:text-emerald-300 w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polyline points="20 6 9 17 4 12"/></svg></div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <p className="text-[11px] font-bold text-gray-900 dark:text-gray-100">Sağlıklı</p>
                <span className="text-[13px] font-black text-emerald-700 dark:text-emerald-300">68</span>
              </div>
              <p className="text-[9px] text-gray-500 dark:text-gray-400 leading-tight">Düzenli kullanım · NPS 8+</p>
            </div>
          </div>
          <div className="flex items-start gap-2 p-2 bg-gray-50 dark:bg-[#17181f] rounded-lg">
            <div className="w-7 h-7 bg-sky-100 dark:bg-sky-900/30 rounded-md flex items-center justify-center shrink-0"><svg className="text-sky-700 dark:text-sky-300 w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10"/><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <p className="text-[11px] font-bold text-gray-900 dark:text-gray-100">İzlemede</p>
                <span className="text-[13px] font-black text-sky-700 dark:text-sky-300">14</span>
              </div>
              <p className="text-[9px] text-gray-500 dark:text-gray-400 leading-tight">Proaktif takip · NPS 6-7</p>
            </div>
          </div>
          <div className="flex items-start gap-2 p-2 bg-gray-50 dark:bg-[#17181f] rounded-lg">
            <div className="w-7 h-7 bg-amber-100 dark:bg-amber-900/30 rounded-md flex items-center justify-center shrink-0"><svg className="text-amber-700 dark:text-amber-300 w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <p className="text-[11px] font-bold text-gray-900 dark:text-gray-100">Risk</p>
                <span className="text-[13px] font-black text-amber-700 dark:text-amber-300">4</span>
              </div>
              <p className="text-[9px] text-gray-500 dark:text-gray-400 leading-tight">Aksiyon gerekli · NPS 4-5</p>
            </div>
          </div>
          <div className="flex items-start gap-2 p-2 bg-gray-50 dark:bg-[#17181f] rounded-lg">
            <div className="w-7 h-7 bg-rose-100 dark:bg-rose-900/30 rounded-md flex items-center justify-center shrink-0"><svg className="text-rose-700 dark:text-rose-300 w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <p className="text-[11px] font-bold text-gray-900 dark:text-gray-100">Kritik</p>
                <span className="text-[13px] font-black text-rose-700 dark:text-rose-300">1</span>
              </div>
              <p className="text-[9px] text-gray-500 dark:text-gray-400 leading-tight">Acil müdahale · NPS &lt;4</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Risk Altındaki Müşteriler */}
  <div className="bg-white dark:bg-[#1e1f26] border border-amber-200 dark:border-amber-500/30 rounded-xl overflow-hidden">
    <div className="p-4 border-b border-amber-200 dark:border-amber-500/20 bg-gradient-to-r from-amber-50 to-transparent dark:from-amber-500/10 flex items-center justify-between gap-2 flex-wrap">
      <div className="flex items-center gap-2">
        <div className="relative">
          
          <div className="relative w-9 h-9 bg-gradient-to-br from-amber-400 to-rose-500 rounded-lg flex items-center justify-center">
            <svg className="text-white w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/></svg>
          </div>
        </div>
        <div>
          <h4 className="text-[13px] font-bold text-gray-900 dark:text-gray-100">Risk Altındaki Müşteriler</h4>
          <p className="text-[10px] text-gray-500 dark:text-gray-400">5 müşteri · ₺69K MRR risk · aksiyon gerektiriyor</p>
        </div>
      </div>
      <button onClick={() => undefined} className="text-[10px] font-bold text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1">CS Ekibine Gönder →</button>
    </div>
    <div className="divide-y divide-gray-100 dark:divide-gray-700/40">
      
      <div className="p-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
        <div className="flex items-start gap-3">
          <div className="shrink-0 flex flex-col items-center gap-1">
            <span className="text-[9px] font-bold px-2 py-0.5 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-500/40 rounded tracking-wider">KRİTİK</span>
            <div className="text-center">
              <p className="text-[9px] text-gray-500 dark:text-gray-400">Churn</p>
              <p className="text-[14px] font-black text-rose-700 dark:text-rose-300">%82</p>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <p className="text-[13px] font-bold text-gray-900 dark:text-gray-100">Gamma Tekstil</p>
              <span className="text-[9px] text-gray-500 dark:text-gray-400 font-mono">Kurumsal · 24 ay</span>
              <span className="text-[11px] font-bold text-gray-900 dark:text-gray-100 ml-auto">₺9K MRR</span>
            </div>
            <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-snug">Rekabet teklifi aldı · son görüşme olumsuz</p>
            <div className="flex items-center gap-1.5 mt-1.5 p-1.5 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded">
              <svg className="text-amber-600 dark:text-amber-400 w-3 h-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polyline points="20 6 9 17 4 12"/></svg>
              <p className="text-[10px] font-semibold text-amber-800 dark:text-amber-300">Osman Bey görüşme önerildi</p>
            </div>
          </div>
        </div>
      </div>
      <div className="p-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
        <div className="flex items-start gap-3">
          <div className="shrink-0 flex flex-col items-center gap-1">
            <span className="text-[9px] font-bold px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40 rounded tracking-wider">Risk</span>
            <div className="text-center">
              <p className="text-[9px] text-gray-500 dark:text-gray-400">Churn</p>
              <p className="text-[14px] font-black text-amber-700 dark:text-amber-300">%67</p>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <p className="text-[13px] font-bold text-gray-900 dark:text-gray-100">Orion Eğitim</p>
              <span className="text-[9px] text-gray-500 dark:text-gray-400 font-mono">Premium 360 · 11 ay</span>
              <span className="text-[11px] font-bold text-gray-900 dark:text-gray-100 ml-auto">₺18K MRR</span>
            </div>
            <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-snug">Yenileme görüşmesi 1 Mayıs · fiyat itirazı</p>
            <div className="flex items-center gap-1.5 mt-1.5 p-1.5 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded">
              <svg className="text-amber-600 dark:text-amber-400 w-3 h-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polyline points="20 6 9 17 4 12"/></svg>
              <p className="text-[10px] font-semibold text-amber-800 dark:text-amber-300">İndirim yetkisi + mentor toplantı</p>
            </div>
          </div>
        </div>
      </div>
      <div className="p-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
        <div className="flex items-start gap-3">
          <div className="shrink-0 flex flex-col items-center gap-1">
            <span className="text-[9px] font-bold px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40 rounded tracking-wider">Risk</span>
            <div className="text-center">
              <p className="text-[9px] text-gray-500 dark:text-gray-400">Churn</p>
              <p className="text-[14px] font-black text-amber-700 dark:text-amber-300">%58</p>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <p className="text-[13px] font-bold text-gray-900 dark:text-gray-100">Nova Digital</p>
              <span className="text-[9px] text-gray-500 dark:text-gray-400 font-mono">Kurumsal · 6 ay</span>
              <span className="text-[11px] font-bold text-gray-900 dark:text-gray-100 ml-auto">₺14K MRR</span>
            </div>
            <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-snug">Düşük platform kullanımı (%23) · aktif rapor yok</p>
            <div className="flex items-center gap-1.5 mt-1.5 p-1.5 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded">
              <svg className="text-amber-600 dark:text-amber-400 w-3 h-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polyline points="20 6 9 17 4 12"/></svg>
              <p className="text-[10px] font-semibold text-amber-800 dark:text-amber-300">CS ekibi 1:1 eğitim planladı</p>
            </div>
          </div>
        </div>
      </div>
      <div className="p-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
        <div className="flex items-start gap-3">
          <div className="shrink-0 flex flex-col items-center gap-1">
            <span className="text-[9px] font-bold px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40 rounded tracking-wider">Risk</span>
            <div className="text-center">
              <p className="text-[9px] text-gray-500 dark:text-gray-400">Churn</p>
              <p className="text-[14px] font-black text-gray-700 dark:text-gray-300">%51</p>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <p className="text-[13px] font-bold text-gray-900 dark:text-gray-100">Alpha Bilişim</p>
              <span className="text-[9px] text-gray-500 dark:text-gray-400 font-mono">KOBİ · 14 ay</span>
              <span className="text-[11px] font-bold text-gray-900 dark:text-gray-100 ml-auto">₺16K MRR</span>
            </div>
            <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-snug">NPS 3/10 · hizmet kalitesi şikayeti</p>
            <div className="flex items-center gap-1.5 mt-1.5 p-1.5 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded">
              <svg className="text-amber-600 dark:text-amber-400 w-3 h-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polyline points="20 6 9 17 4 12"/></svg>
              <p className="text-[10px] font-semibold text-amber-800 dark:text-amber-300">Hesap yöneticisi değişikliği</p>
            </div>
          </div>
        </div>
      </div>
      <div className="p-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
        <div className="flex items-start gap-3">
          <div className="shrink-0 flex flex-col items-center gap-1">
            <span className="text-[9px] font-bold px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40 rounded tracking-wider">Risk</span>
            <div className="text-center">
              <p className="text-[9px] text-gray-500 dark:text-gray-400">Churn</p>
              <p className="text-[14px] font-black text-gray-700 dark:text-gray-300">%45</p>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <p className="text-[13px] font-bold text-gray-900 dark:text-gray-100">Beta Medical</p>
              <span className="text-[9px] text-gray-500 dark:text-gray-400 font-mono">KOBİ · 18 ay</span>
              <span className="text-[11px] font-bold text-gray-900 dark:text-gray-100 ml-auto">₺12K MRR</span>
            </div>
            <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-snug">90+ gün ödeme gecikmesi · hukuki süreçte</p>
            <div className="flex items-center gap-1.5 mt-1.5 p-1.5 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded">
              <svg className="text-amber-600 dark:text-amber-400 w-3 h-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polyline points="20 6 9 17 4 12"/></svg>
              <p className="text-[10px] font-semibold text-amber-800 dark:text-amber-300">Finans takip + tahsilat planı</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Jenny AI Öngörüsü (müşteri) */}
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
            <h5 className="text-[12px] font-bold text-gray-900 dark:text-white">Jenny'nin Müşteri Yorumu</h5>
            <span className="text-[9px] font-mono text-gray-500 dark:text-white/60">Musteri_Portfoy.JSON v1.4.2</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="p-2.5 bg-white/70 dark:bg-white/5 border border-emerald-200 dark:border-emerald-400/30 rounded-lg">
              <p className="text-[11px] text-gray-800 dark:text-white/90"><span className="font-bold text-emerald-700 dark:text-emerald-300">✓ İyi:</span> Churn %2.1 (hedef %3) · NPS 74 sektör ort. %42'nin çok üstünde · %78 sağlıklı.</p>
            </div>
            <div className="p-2.5 bg-white/70 dark:bg-white/5 border border-amber-200 dark:border-amber-400/30 rounded-lg">
              <p className="text-[11px] text-gray-800 dark:text-white/90"><span className="font-bold text-amber-700 dark:text-amber-300">⚠ Dikkat:</span> Gamma Tekstil kritik · ₺9K MRR kaybı yakın · Osman Bey görüşme önerildi.</p>
            </div>
            <div className="p-2.5 bg-white/70 dark:bg-white/5 border border-violet-200 dark:border-violet-400/30 rounded-lg">
              <p className="text-[11px] text-gray-800 dark:text-white/90"><span className="font-bold text-violet-700 dark:text-violet-300">◆ Fırsat:</span> Premium 360 segmenti LTV ₺350K · upsell programıyla %35 büyütülebilir.</p>
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
