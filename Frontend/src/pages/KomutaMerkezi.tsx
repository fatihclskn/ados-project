import Layout from '../components/Layout';

export default function KomutaMerkezi() {
  return (
    <Layout activeId="command" breadcrumb="Genel Müdür · Komuta Merkezi">
      <>
<div className="relative overflow-hidden rounded-2xl border border-amber-200/70 dark:border-amber-500/30">
    <div className="relative bg-gradient-to-br from-amber-50 via-white to-violet-50 dark:from-[#1a1530] dark:via-[#0f0820] dark:to-[#1a0e3a] p-5 md:p-6">
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-amber-500/15 dark:bg-amber-500/20 rounded-full blur-3xl pointer-events-none aig"></div>
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-violet-500/10 dark:bg-violet-500/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(currentColor 1px,transparent 1px),linear-gradient(90deg,currentColor 1px,transparent 1px)', backgroundSize: '40px 40px', color: 'rgb(139,92,246)' }}></div>

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-5 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-amber-400 rounded-2xl blur-lg opacity-50 aig"></div>
              <div className="relative w-12 h-12 bg-gradient-to-br from-amber-400 via-amber-500 to-violet-600 rounded-2xl flex items-center justify-center">
                <svg className="text-white w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-[20px] font-black">
                  <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-violet-600 dark:from-amber-200 dark:via-white dark:to-violet-200 bg-clip-text text-transparent">Jenny</span>
                </h2>
                <span className="text-[9px] font-bold tracking-widest text-amber-700 dark:text-amber-300 uppercase px-2 py-0.5 bg-amber-100 dark:bg-amber-500/20 border border-amber-200 dark:border-amber-400/30 rounded-full">ADOS AI CEO</span>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-white/60 mt-0.5"><span className="font-mono">claude-opus-4.7</span> · <span className="font-mono">master-coord-v4.1</span> · 07:00 brifing</p>
            </div>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            <button className="px-3 py-1.5 text-[10px] font-semibold bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-white/70 rounded-lg transition-colors">Mod: Yönetici</button>
            <button className="px-3 py-1.5 text-[10px] font-semibold bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-white/70 rounded-lg transition-colors">Son 30 Gün</button>
          </div>
        </div>

        {/* Bugün Ne Kritik? */}
        <div className="mb-5">
          <h3 className="text-[11px] font-bold tracking-wider text-amber-700 dark:text-amber-300 uppercase mb-3">Bugün Ne Kritik?</h3>
          <div className="space-y-2">
            <div className="flex items-start gap-2.5 p-2.5 bg-white/70 dark:bg-white/5 backdrop-blur-sm border border-emerald-200 dark:border-emerald-400/20 rounded-lg">
              <svg className="text-emerald-600 dark:text-emerald-400 w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polyline points="20 6 9 17 4 12"/></svg>
              <p className="text-[12px] text-gray-800 dark:text-white/90"><span className="font-bold">Sistem:</span> Orchestrator <span className="text-emerald-700 dark:text-emerald-400 font-semibold">stabil</span> · Master.JSON v4.1.0 aktif · 9/11 entegrasyon bağlı</p>
            </div>
            <div className="flex items-start gap-2.5 p-2.5 bg-white/70 dark:bg-white/5 backdrop-blur-sm border border-amber-200 dark:border-amber-400/30 rounded-lg">
              <svg className="text-amber-600 dark:text-amber-400 w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <p className="text-[12px] text-gray-800 dark:text-white/90"><span className="font-bold">Risk:</span> 3 kritik onay · 2 riskli harcama (BigBrand ₺12.3K · FastGrow ₺10.5K) · Planner_Gorev_Aktarim.JSON review bekliyor</p>
            </div>
            <div className="flex items-start gap-2.5 p-2.5 bg-white/70 dark:bg-white/5 backdrop-blur-sm border border-violet-200 dark:border-violet-400/30 rounded-lg">
              <svg className="text-violet-600 dark:text-violet-300 w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              <p className="text-[12px] text-gray-800 dark:text-white/90"><span className="font-bold">Odak:</span> Önce onayları temizle · Ads bütçesi + Premium 360 %18 iskonto onayı ekip kararlarının kilit noktası</p>
            </div>
          </div>
        </div>

        {/* Jenny'nin Önerdiği 3 Aksiyon */}
        <div className="mb-5">
          <h3 className="text-[11px] font-bold tracking-wider text-amber-700 dark:text-amber-300 uppercase mb-3">Jenny'nin Önerdiği 3 Aksiyon</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {/* Action 1 */}
            <div className="relative group trigger-btn">
              <button className="w-full text-left p-3 bg-white dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-transparent border-l-4 border-l-rose-500 dark:border-l-rose-400 rounded-lg hover:bg-gray-50 dark:hover:bg-white/10 transition-all">
                <div className="flex items-start justify-between mb-1.5 gap-2">
                  <h4 className="text-[12px] font-bold text-gray-900 dark:text-white leading-tight">Kritik Onayları İncele (3)</h4>
                  <svg className="text-gray-400 dark:text-white/40 w-3 h-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
                </div>
                <p className="text-[10px] text-gray-500 dark:text-white/60 mb-1">Bütçe etkisi yüksek 3 onay bekliyor</p>
                <div className="mono-dim">POST /v1/approvals/queue · Master.JSON#approvals</div>
              </button>
              
  <div className="trigger-pop top-full right-0 mt-2 w-[280px] bg-[#0a0e1a] border border-amber-400/40 rounded-lg shadow-2xl overflow-hidden">
    <div className="p-2 bg-gradient-to-r from-amber-500/20 to-violet-500/20 border-b border-white/10 flex items-center gap-1.5">
      <svg className="text-amber-300 w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
      <span className="text-[9px] font-bold tracking-widest text-amber-300 uppercase">Tetiklenen Zincir</span>
    </div>
    <div className="p-2.5 space-y-1.5 font-mono text-[10px]">
      <div className="flex items-start gap-1.5">
        <span className="w-12 text-emerald-400 font-bold shrink-0">API</span>
        <span className="text-white/80 break-all">GET /v1/approvals?priority=high</span>
      </div>
      <div className="flex items-start gap-1.5">
        <span className="w-12 text-violet-400 font-bold shrink-0">JSON</span>
        <span className="text-white/80 break-all">Master.JSON → approvals[]</span>
      </div>
      <div className="flex items-start gap-1.5">
        <span className="w-12 text-sky-400 font-bold shrink-0">PROMPT</span>
        <span className="text-white/80 break-all">prompt_approval_summary_v3</span>
      </div>
      <div className="flex items-start gap-1.5">
        <span className="w-12 text-pink-400 font-bold shrink-0">AGENT</span>
        <span className="text-white/80 break-all">ApprovalCoordinator</span>
      </div>
    </div>
  </div>
            </div>
            {/* Action 2 */}
            <div className="relative group trigger-btn">
              <button className="w-full text-left p-3 bg-white dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-transparent border-l-4 border-l-amber-500 dark:border-l-amber-400 rounded-lg hover:bg-gray-50 dark:hover:bg-white/10 transition-all">
                <div className="flex items-start justify-between mb-1.5 gap-2">
                  <h4 className="text-[12px] font-bold text-gray-900 dark:text-white leading-tight">Riskli Harcamaları Kontrol</h4>
                  <svg className="text-gray-400 dark:text-white/40 w-3 h-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
                </div>
                <p className="text-[10px] text-gray-500 dark:text-white/60 mb-1">2 müşteri günlük limit aştı</p>
                <div className="mono-dim">POST /v1/ai-cost/analyze · Maliyet_Analiz.JSON</div>
              </button>
              
  <div className="trigger-pop top-full right-0 mt-2 w-[280px] bg-[#0a0e1a] border border-amber-400/40 rounded-lg shadow-2xl overflow-hidden">
    <div className="p-2 bg-gradient-to-r from-amber-500/20 to-violet-500/20 border-b border-white/10 flex items-center gap-1.5">
      <svg className="text-amber-300 w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
      <span className="text-[9px] font-bold tracking-widest text-amber-300 uppercase">Tetiklenen Zincir</span>
    </div>
    <div className="p-2.5 space-y-1.5 font-mono text-[10px]">
      <div className="flex items-start gap-1.5">
        <span className="w-12 text-emerald-400 font-bold shrink-0">API</span>
        <span className="text-white/80 break-all">POST /v1/ai-cost/risk-analysis</span>
      </div>
      <div className="flex items-start gap-1.5">
        <span className="w-12 text-violet-400 font-bold shrink-0">JSON</span>
        <span className="text-white/80 break-all">Maliyet_Analiz.JSON v1.8.2</span>
      </div>
      <div className="flex items-start gap-1.5">
        <span className="w-12 text-sky-400 font-bold shrink-0">PROMPT</span>
        <span className="text-white/80 break-all">prompt_cost_risk_detector_v1_8</span>
      </div>
      <div className="flex items-start gap-1.5">
        <span className="w-12 text-pink-400 font-bold shrink-0">AGENT</span>
        <span className="text-white/80 break-all">CostAnalystAgent</span>
      </div>
    </div>
  </div>
            </div>
            {/* Action 3 */}
            <div className="relative group trigger-btn">
              <button className="w-full text-left p-3 bg-white dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-transparent border-l-4 border-l-violet-500 dark:border-l-violet-400 rounded-lg hover:bg-gray-50 dark:hover:bg-white/10 transition-all">
                <div className="flex items-start justify-between mb-1.5 gap-2">
                  <h4 className="text-[12px] font-bold text-gray-900 dark:text-white leading-tight">Geciken İşleri Yeniden Dağıt</h4>
                  <svg className="text-gray-400 dark:text-white/40 w-3 h-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
                </div>
                <p className="text-[10px] text-gray-500 dark:text-white/60 mb-1">4 görev yeniden önceliklendirilecek</p>
                <div className="mono-dim">POST /v1/planner/redistribute · Planner_Gorev_Aktarim</div>
              </button>
              
  <div className="trigger-pop top-full right-0 mt-2 w-[280px] bg-[#0a0e1a] border border-amber-400/40 rounded-lg shadow-2xl overflow-hidden">
    <div className="p-2 bg-gradient-to-r from-amber-500/20 to-violet-500/20 border-b border-white/10 flex items-center gap-1.5">
      <svg className="text-amber-300 w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
      <span className="text-[9px] font-bold tracking-widest text-amber-300 uppercase">Tetiklenen Zincir</span>
    </div>
    <div className="p-2.5 space-y-1.5 font-mono text-[10px]">
      <div className="flex items-start gap-1.5">
        <span className="w-12 text-emerald-400 font-bold shrink-0">API</span>
        <span className="text-white/80 break-all">POST /v1/planner/redistribute-tasks</span>
      </div>
      <div className="flex items-start gap-1.5">
        <span className="w-12 text-violet-400 font-bold shrink-0">JSON</span>
        <span className="text-white/80 break-all">Planner_Gorev_Aktarim.JSON v1.5</span>
      </div>
      <div className="flex items-start gap-1.5">
        <span className="w-12 text-sky-400 font-bold shrink-0">PROMPT</span>
        <span className="text-white/80 break-all">prompt_task_reprioritize_v2</span>
      </div>
      <div className="flex items-start gap-1.5">
        <span className="w-12 text-pink-400 font-bold shrink-0">AGENT</span>
        <span className="text-white/80 break-all">PlannerHandoffAgent</span>
      </div>
    </div>
  </div>
            </div>
          </div>
        </div>

        {/* Jenny'ye Sor */}
        <div className="mb-3">
          <h3 className="text-[11px] font-bold tracking-wider text-amber-700 dark:text-amber-300 uppercase mb-2">Jenny'ye Sor · Komut Ver</h3>
          <div className="p-3 bg-white dark:bg-white/5 backdrop-blur-sm border border-amber-200 dark:border-amber-400/20 rounded-xl">
            <div className="flex items-center gap-2">
              <svg className="text-amber-500 dark:text-amber-400/60 w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <input type="text" placeholder="Örn: 'Bugün en kritik 5 onayı sırala' · 'Nisan için ciro forecast'ini özetle'" className="flex-1 bg-transparent border-none outline-none text-[12px] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40"/>
              <button onClick={() => undefined} className="shrink-0 w-8 h-8 bg-gradient-to-br from-amber-500 to-violet-600 hover:from-amber-400 hover:to-violet-500 rounded-lg flex items-center justify-center transition-all">
                <svg className="text-white w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-gray-100 dark:border-white/5">
              <button onClick={() => undefined} className="px-2 py-1 text-[10px] bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 rounded text-gray-700 dark:text-white/70 border border-gray-200 dark:border-white/10">Finans riskini özetle</button>
              <button onClick={() => undefined} className="px-2 py-1 text-[10px] bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 rounded text-gray-700 dark:text-white/70 border border-gray-200 dark:border-white/10">Tüm onayları göster</button>
              <button onClick={() => undefined} className="px-2 py-1 text-[10px] bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 rounded text-gray-700 dark:text-white/70 border border-gray-200 dark:border-white/10">Ekip yoğunluğu</button>
              <button onClick={() => undefined} className="px-2 py-1 text-[10px] bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 rounded text-gray-700 dark:text-white/70 border border-gray-200 dark:border-white/10">AI maliyet raporu</button>
            </div>
          </div>
        </div>

        {/* Son karar */}
        <div className="pt-3 border-t border-gray-200 dark:border-white/10 flex items-center justify-between gap-2 flex-wrap">
          <p className="text-[10px] text-gray-500 dark:text-white/50 flex items-center gap-1.5 font-mono">
            <span className="w-1.5 h-1.5 bg-emerald-500 dark:bg-emerald-400 rounded-full animate-pulse"></span>
            Son karar: Google Ads kampanya onaylandı (14:32) · ADS Agent · Master.JSON#ads.campaign_approvals
          </p>
          <button onClick={() => undefined} className="text-[10px] font-bold text-amber-700 dark:text-amber-300 hover:text-amber-800 dark:hover:text-amber-200 transition-colors">Audit Log →</button>
        </div>
      </div>
    </div>
    <div className="h-0.5 bg-gradient-to-r from-amber-500 via-violet-400 to-amber-500"></div>
  </div>
  
  <div className="space-y-3">
    {/* CEO KPI'ları */}
    <div>
      <div className="flex items-center gap-1.5 mb-2">
        <svg className="text-amber-500 w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        <span className="text-[10px] font-bold tracking-widest text-amber-700 dark:text-amber-400 uppercase">Operasyonel KPI · CEO Görünümü</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
    <div className="relative overflow-hidden bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-3.5 hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer">
      <div className="absolute -top-8 -right-8 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none"></div>
      
      <div className="relative flex items-start justify-between mb-2">
        <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center"><svg className="text-emerald-700 dark:text-emerald-300 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div>
        <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded">+%23.1</span>
      </div>
      <div className="relative text-[22px] font-bold text-gray-900 dark:text-gray-50 leading-none mb-1">₺1.04M</div>
      <div className="relative text-[11px] font-semibold text-gray-600 dark:text-gray-400 leading-tight">Aylık Ciro</div>
      <div className="relative text-[9px] text-gray-400 dark:text-gray-500 mt-0.5">Nisan · 23 gün</div>
    </div>
    <div className="relative overflow-hidden bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-3.5 hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer">
      <div className="absolute -top-8 -right-8 w-24 h-24 bg-sky-500/5 rounded-full blur-xl pointer-events-none"></div>
      
      <div className="relative flex items-start justify-between mb-2">
        <div className="w-8 h-8 bg-sky-100 dark:bg-sky-900/30 rounded-lg flex items-center justify-center"><svg className="text-sky-700 dark:text-sky-300 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div>
        <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded">+%18.4</span>
      </div>
      <div className="relative text-[22px] font-bold text-gray-900 dark:text-gray-50 leading-none mb-1">₺4.2M</div>
      <div className="relative text-[11px] font-semibold text-gray-600 dark:text-gray-400 leading-tight">Pipeline Değeri</div>
      <div className="relative text-[9px] text-gray-400 dark:text-gray-500 mt-0.5">178 teklif</div>
    </div>
    <div className="relative overflow-hidden bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-3.5 hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer">
      <div className="absolute -top-8 -right-8 w-24 h-24 bg-violet-500/5 rounded-full blur-xl pointer-events-none"></div>
      
      <div className="relative flex items-start justify-between mb-2">
        <div className="w-8 h-8 bg-violet-100 dark:bg-violet-900/30 rounded-lg flex items-center justify-center"><svg className="text-violet-700 dark:text-violet-300 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg></div>
        <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded">+%1.8</span>
      </div>
      <div className="relative text-[22px] font-bold text-gray-900 dark:text-gray-50 leading-none mb-1">%38.4</div>
      <div className="relative text-[11px] font-semibold text-gray-600 dark:text-gray-400 leading-tight">Brüt Kar Marjı</div>
      <div className="relative text-[9px] text-gray-400 dark:text-gray-500 mt-0.5">Hedef %35</div>
    </div>
    <div className="relative overflow-hidden bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-3.5 hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer">
      <div className="absolute -top-8 -right-8 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl pointer-events-none"></div>
      
      <div className="relative flex items-start justify-between mb-2">
        <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center"><svg className="text-indigo-700 dark:text-indigo-300 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg></div>
        <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded">+9</span>
      </div>
      <div className="relative text-[22px] font-bold text-gray-900 dark:text-gray-50 leading-none mb-1">87</div>
      <div className="relative text-[11px] font-semibold text-gray-600 dark:text-gray-400 leading-tight">Aktif Müşteri</div>
      <div className="relative text-[9px] text-gray-400 dark:text-gray-500 mt-0.5">Çeyrek: 78</div>
    </div></div>
    </div>
    {/* Mimar KPI'ları */}
    <div>
      <div className="flex items-center gap-1.5 mb-2">
        <svg className="text-violet-500 w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
        <span className="text-[10px] font-bold tracking-widest text-violet-700 dark:text-violet-400 uppercase">Sistem KPI · ADOS Mimar Görünümü</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
    <div className="relative overflow-hidden bg-white dark:bg-[#1e1f26] border border-violet-200 dark:border-violet-500/30 rounded-xl p-3.5 hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer">
      <div className="absolute -top-8 -right-8 w-24 h-24 bg-violet-500/5 rounded-full blur-xl pointer-events-none"></div>
      <div className="absolute top-0 right-0 px-1.5 py-0.5 bg-violet-500/10 border-l border-b border-violet-300/40 dark:border-violet-500/30 rounded-bl-md"><span className="text-[8px] font-bold text-violet-700 dark:text-violet-300 tracking-wider">CORE</span></div>
      <div className="relative flex items-start justify-between mb-2">
        <div className="w-8 h-8 bg-violet-100 dark:bg-violet-900/30 rounded-lg flex items-center justify-center"><svg className="text-violet-700 dark:text-violet-300 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg></div>
        <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded">+%8.3</span>
      </div>
      <div className="relative text-[22px] font-bold text-gray-900 dark:text-gray-50 leading-none mb-1">12.8M</div>
      <div className="relative text-[11px] font-semibold text-gray-600 dark:text-gray-400 leading-tight">AI Token · 7g</div>
      <div className="relative text-[9px] text-gray-400 dark:text-gray-500 mt-0.5">₺64.2K · ₺28.5/görev</div>
    </div>
    <div className="relative overflow-hidden bg-white dark:bg-[#1e1f26] border border-violet-200 dark:border-violet-500/30 rounded-xl p-3.5 hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer">
      <div className="absolute -top-8 -right-8 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl pointer-events-none"></div>
      <div className="absolute top-0 right-0 px-1.5 py-0.5 bg-violet-500/10 border-l border-b border-violet-300/40 dark:border-violet-500/30 rounded-bl-md"><span className="text-[8px] font-bold text-violet-700 dark:text-violet-300 tracking-wider">CORE</span></div>
      <div className="relative flex items-start justify-between mb-2">
        <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center"><svg className="text-indigo-700 dark:text-indigo-300 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 10v6M4.22 4.22l4.24 4.24m7.08 7.08 4.24 4.24M1 12h6m10 0h6M4.22 19.78l4.24-4.24m7.08-7.08 4.24-4.24"/></svg></div>
        <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded">✓ Up</span>
      </div>
      <div className="relative text-[22px] font-bold text-gray-900 dark:text-gray-50 leading-none mb-1">Stabil</div>
      <div className="relative text-[11px] font-semibold text-gray-600 dark:text-gray-400 leading-tight">Orchestrator</div>
      <div className="relative text-[9px] text-gray-400 dark:text-gray-500 mt-0.5">CPU %42 · RAM 12.4GB</div>
    </div>
    <div className="relative overflow-hidden bg-white dark:bg-[#1e1f26] border border-violet-200 dark:border-violet-500/30 rounded-xl p-3.5 hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer">
      <div className="absolute -top-8 -right-8 w-24 h-24 bg-sky-500/5 rounded-full blur-xl pointer-events-none"></div>
      <div className="absolute top-0 right-0 px-1.5 py-0.5 bg-violet-500/10 border-l border-b border-violet-300/40 dark:border-violet-500/30 rounded-bl-md"><span className="text-[8px] font-bold text-violet-700 dark:text-violet-300 tracking-wider">CORE</span></div>
      <div className="relative flex items-start justify-between mb-2">
        <div className="w-8 h-8 bg-sky-100 dark:bg-sky-900/30 rounded-lg flex items-center justify-center"><svg className="text-sky-700 dark:text-sky-300 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M4 4h16v16H4z"/><path d="M4 12h16"/><path d="M12 4v16"/></svg></div>
        <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded">+2</span>
      </div>
      <div className="relative text-[22px] font-bold text-gray-900 dark:text-gray-50 leading-none mb-1">18</div>
      <div className="relative text-[11px] font-semibold text-gray-600 dark:text-gray-400 leading-tight">Aktif Agent</div>
      <div className="relative text-[9px] text-gray-400 dark:text-gray-500 mt-0.5">15 aktif · 2 review</div>
    </div>
    <div className="relative overflow-hidden bg-white dark:bg-[#1e1f26] border border-violet-200 dark:border-violet-500/30 rounded-xl p-3.5 hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer">
      <div className="absolute -top-8 -right-8 w-24 h-24 bg-pink-500/5 rounded-full blur-xl pointer-events-none"></div>
      <div className="absolute top-0 right-0 px-1.5 py-0.5 bg-violet-500/10 border-l border-b border-violet-300/40 dark:border-violet-500/30 rounded-bl-md"><span className="text-[8px] font-bold text-violet-700 dark:text-violet-300 tracking-wider">CORE</span></div>
      <div className="relative flex items-start justify-between mb-2">
        <div className="w-8 h-8 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center"><svg className="text-pink-700 dark:text-pink-300 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div>
        <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded">%81.8</span>
      </div>
      <div className="relative text-[22px] font-bold text-gray-900 dark:text-gray-50 leading-none mb-1">9/11</div>
      <div className="relative text-[11px] font-semibold text-gray-600 dark:text-gray-400 leading-tight">API Sağlığı</div>
      <div className="relative text-[9px] text-gray-400 dark:text-gray-500 mt-0.5">2 kesinti · Meta, LinkedIn</div>
    </div></div>
    </div>
  </div>
  <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
    <div className="lg:col-span-3">
  <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden h-full">
    <div className="p-4 border-b border-gray-100 dark:border-gray-700/40">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <svg className="text-violet-600 dark:text-violet-400 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          <div>
            <h4 className="text-[13px] font-bold text-gray-900 dark:text-gray-100">Sistem Sağlığı</h4>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">8 bileşen · 7 sağlıklı · 1 uyarı</p>
          </div>
        </div>
        <button onClick={() => undefined} className="text-[10px] font-semibold text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1">
          Orchestrator Core <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>
    </div>
    <div className="divide-y divide-gray-100 dark:divide-gray-700/40">
      
      <div className="p-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <span className="w-2 h-2 bg-emerald-500 rounded-full block shrink-0"></span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[12px] font-semibold text-gray-900 dark:text-gray-100">Orchestrator</span>
                <span className="text-[9px] font-mono text-gray-400 dark:text-gray-500">v4.1.0</span>
              </div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">%42 CPU · 12.4GB RAM</p>
            </div>
          </div>
          <div className="text-right shrink-0 hidden md:block">
            <p className="text-[10px] text-gray-500 dark:text-gray-400 max-w-[220px] truncate">Master.JSON koordinasyonu aktif</p>
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded shrink-0">Sağlıklı</span>
        </div>
      </div>
      <div className="p-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <span className="w-2 h-2 bg-emerald-500 rounded-full block shrink-0"></span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[12px] font-semibold text-gray-900 dark:text-gray-100">Planner</span>
                <span className="text-[9px] font-mono text-gray-400 dark:text-gray-500">v3.0.1</span>
              </div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">184 aktif görev · 12 geciken</p>
            </div>
          </div>
          <div className="text-right shrink-0 hidden md:block">
            <p className="text-[10px] text-gray-500 dark:text-gray-400 max-w-[220px] truncate">8 departmana dağıtım yapıyor</p>
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded shrink-0">Sağlıklı</span>
        </div>
      </div>
      <div className="p-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <span className="w-2 h-2 bg-emerald-500 rounded-full block shrink-0"></span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[12px] font-semibold text-gray-900 dark:text-gray-100">AI Router</span>
                <span className="text-[9px] font-mono text-gray-400 dark:text-gray-500">v2.4.0</span>
              </div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">3 model aktif · routing ok</p>
            </div>
          </div>
          <div className="text-right shrink-0 hidden md:block">
            <p className="text-[10px] text-gray-500 dark:text-gray-400 max-w-[220px] truncate">GPT-4/Claude/Gemini yönlendirme</p>
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded shrink-0">Sağlıklı</span>
        </div>
      </div>
      <div className="p-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <span className="w-2 h-2 bg-emerald-500 rounded-full block shrink-0"></span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[12px] font-semibold text-gray-900 dark:text-gray-100">Prompt Engine</span>
                <span className="text-[9px] font-mono text-gray-400 dark:text-gray-500">v3.2.0</span>
              </div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">47 prompt · 6 versiyonlama</p>
            </div>
          </div>
          <div className="text-right shrink-0 hidden md:block">
            <p className="text-[10px] text-gray-500 dark:text-gray-400 max-w-[220px] truncate">Prompt Koleksiyonu servisleniyor</p>
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded shrink-0">Sağlıklı</span>
        </div>
      </div>
      <div className="p-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <span className="w-2 h-2 bg-emerald-500 rounded-full block shrink-0"></span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[12px] font-semibold text-gray-900 dark:text-gray-100">JSON Registry</span>
                <span className="text-[9px] font-mono text-gray-400 dark:text-gray-500">v4.0.0</span>
              </div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">18 agent · 6 ana JSON</p>
            </div>
          </div>
          <div className="text-right shrink-0 hidden md:block">
            <p className="text-[10px] text-gray-500 dark:text-gray-400 max-w-[220px] truncate">Master.JSON ana ağacı sağlıklı</p>
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded shrink-0">Sağlıklı</span>
        </div>
      </div>
      <div className="p-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <span className="w-2 h-2 bg-amber-500 rounded-full block shrink-0"></span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[12px] font-semibold text-gray-900 dark:text-gray-100">Integration Hub</span>
                <span className="text-[9px] font-mono text-gray-400 dark:text-gray-500">v2.1.2</span>
              </div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">9/11 bağlı · 2 kesinti</p>
            </div>
          </div>
          <div className="text-right shrink-0 hidden md:block">
            <p className="text-[10px] text-gray-500 dark:text-gray-400 max-w-[220px] truncate">Meta Ads API · LinkedIn OAuth yenilenmeli</p>
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded shrink-0">Uyarı</span>
        </div>
      </div>
      <div className="p-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <span className="w-2 h-2 bg-emerald-500 rounded-full block shrink-0"></span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[12px] font-semibold text-gray-900 dark:text-gray-100">Governance</span>
                <span className="text-[9px] font-mono text-gray-400 dark:text-gray-500">v1.7.0</span>
              </div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">18 onay kuyruğunda · 6 kritik</p>
            </div>
          </div>
          <div className="text-right shrink-0 hidden md:block">
            <p className="text-[10px] text-gray-500 dark:text-gray-400 max-w-[220px] truncate">Her aksiyon audit log'a yazılıyor</p>
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded shrink-0">Sağlıklı</span>
        </div>
      </div>
      <div className="p-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <span className="w-2 h-2 bg-emerald-500 rounded-full block shrink-0"></span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[12px] font-semibold text-gray-900 dark:text-gray-100">Audit Stream</span>
                <span className="text-[9px] font-mono text-gray-400 dark:text-gray-500">v1.5.0</span>
              </div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">Real-time event akışı · 8 son 1h</p>
            </div>
          </div>
          <div className="text-right shrink-0 hidden md:block">
            <p className="text-[10px] text-gray-500 dark:text-gray-400 max-w-[220px] truncate">TimescaleDB yazım gecikmesi &lt;50ms</p>
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded shrink-0">Sağlıklı</span>
        </div>
      </div>
    </div>
    <div className="p-3 border-t border-gray-100 dark:border-gray-700/40 bg-gray-50/50 dark:bg-[#17181f]/50 flex items-center justify-between gap-2">
      <p className="text-[10px] text-gray-500 dark:text-gray-400">Kapalı döngü: ölç → analiz → karar → aksiyon → ölçüm</p>
      <div className="flex items-center gap-1 text-[9px] text-gray-400 dark:text-gray-500">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        Son refresh · 12sn önce
      </div>
    </div>
  </div></div>
    <div className="lg:col-span-2">
  <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden h-full">
    <div className="p-4 border-b border-gray-100 dark:border-gray-700/40 bg-gradient-to-r from-amber-50/50 to-transparent dark:from-amber-500/5 flex items-center justify-between gap-2 flex-wrap">
      <div className="flex items-center gap-2">
        <svg className="text-amber-600 dark:text-amber-400 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        <div>
          <h4 className="text-[13px] font-bold text-gray-900 dark:text-gray-100">AI Tüketim & Maliyet</h4>
          <p className="text-[10px] text-gray-500 dark:text-gray-400">Son 7 gün · 3 model · 12.8M token</p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button className="px-2 py-1 text-[10px] bg-amber-600 text-white rounded font-semibold">7G</button>
        <button className="px-2 py-1 text-[10px] text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">30G</button>
      </div>
    </div>

    {/* Risk uyarısı */}
    <div className="p-2.5 bg-amber-50 dark:bg-amber-500/10 border-b border-amber-200/60 dark:border-amber-500/20 flex items-center gap-2">
      <svg className="text-amber-600 dark:text-amber-400 w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      <p className="text-[11px] text-amber-800 dark:text-amber-300"><span className="font-bold">Risk eşiği:</span> ₺10K/gün · bugün %64 doluluk</p>
    </div>

    <div className="p-4 space-y-3">
      {/* Model dağılımı */}
      <div>
        <h5 className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">Model Dağılımı</h5>
        <div className="space-y-1.5">
          
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold text-gray-700 dark:text-gray-300">Claude 4.7</span>
              <span className="text-[11px] font-bold text-violet-700 dark:text-violet-300">42%</span>
            </div>
            <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-violet-400 to-violet-600 rounded-full" style={{ width: '42%' }}></div></div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold text-gray-700 dark:text-gray-300">GPT-4</span>
              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300">35%</span>
            </div>
            <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full" style={{ width: '35%' }}></div></div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold text-gray-700 dark:text-gray-300">Gemini Pro</span>
              <span className="text-[11px] font-bold text-pink-700 dark:text-pink-300">23%</span>
            </div>
            <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-pink-400 to-pink-600 rounded-full" style={{ width: '23%' }}></div></div>
          </div>
        </div>
      </div>

      {/* Günlük maliyet */}
      <div className="pt-3 border-t border-gray-100 dark:border-gray-700/40">
        <h5 className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">Günlük Maliyet Trendi</h5>
        <div className="flex items-end gap-1 h-16">
          <div className="flex-1 flex flex-col items-center justify-end"><div className="w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t transition-all hover:opacity-80 relative group" style={{ height: '64.28571428571429%' }}><span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-bold text-emerald-700 dark:text-emerald-300 opacity-0 group-hover:opacity-100 whitespace-nowrap">₺45K</span></div></div><div className="flex-1 flex flex-col items-center justify-end"><div className="w-full bg-gradient-to-t from-amber-500 to-amber-400 rounded-t transition-all hover:opacity-80 relative group" style={{ height: '74.28571428571429%' }}><span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-bold text-amber-700 dark:text-amber-300 opacity-0 group-hover:opacity-100 whitespace-nowrap">₺52K</span></div></div><div className="flex-1 flex flex-col items-center justify-end"><div className="w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t transition-all hover:opacity-80 relative group" style={{ height: '68.57142857142857%' }}><span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-bold text-emerald-700 dark:text-emerald-300 opacity-0 group-hover:opacity-100 whitespace-nowrap">₺48K</span></div></div><div className="flex-1 flex flex-col items-center justify-end"><div className="w-full bg-gradient-to-t from-rose-500 to-rose-400 rounded-t transition-all hover:opacity-80 relative group" style={{ height: '87.14285714285714%' }}><span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-bold text-rose-700 dark:text-rose-300 opacity-0 group-hover:opacity-100 whitespace-nowrap">₺61K</span></div></div><div className="flex-1 flex flex-col items-center justify-end"><div className="w-full bg-gradient-to-t from-amber-500 to-amber-400 rounded-t transition-all hover:opacity-80 relative group" style={{ height: '82.85714285714286%' }}><span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-bold text-amber-700 dark:text-amber-300 opacity-0 group-hover:opacity-100 whitespace-nowrap">₺58K</span></div></div><div className="flex-1 flex flex-col items-center justify-end"><div className="w-full bg-gradient-to-t from-rose-500 to-rose-400 rounded-t transition-all hover:opacity-80 relative group" style={{ height: '100%' }}><span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-bold text-rose-700 dark:text-rose-300 opacity-0 group-hover:opacity-100 whitespace-nowrap">₺70K</span></div></div><div className="flex-1 flex flex-col items-center justify-end"><div className="w-full bg-gradient-to-t from-rose-500 to-rose-400 rounded-t transition-all hover:opacity-80 relative group" style={{ height: '91.42857142857143%' }}><span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-bold text-rose-700 dark:text-rose-300 opacity-0 group-hover:opacity-100 whitespace-nowrap">₺64K</span></div></div>
        </div>
        <div className="flex justify-between mt-1 text-[9px] text-gray-400 dark:text-gray-500">
          <span>7 gün önce</span><span>Bugün ₺64K</span>
        </div>
      </div>

      {/* Top & Risk */}
      <div className="pt-3 border-t border-gray-100 dark:border-gray-700/40 grid grid-cols-2 gap-2">
        <div className="p-2 bg-gray-50 dark:bg-[#17181f] rounded-lg">
          <p className="text-[9px] font-bold text-gray-500 dark:text-gray-400 uppercase mb-1 tracking-wider">Top Müşteri</p>
          <p className="text-[11px] font-bold text-gray-900 dark:text-gray-100">Acme Corp</p>
          <p className="text-[10px] text-gray-500 dark:text-gray-400">₺8.5K · 7g</p>
        </div>
        <div className="p-2 bg-rose-50 dark:bg-rose-500/10 border border-rose-200/50 dark:border-rose-500/30 rounded-lg">
          <p className="text-[9px] font-bold text-rose-600 dark:text-rose-400 uppercase mb-1 tracking-wider">Eşik Aşan</p>
          <p className="text-[11px] font-bold text-rose-900 dark:text-rose-200">BigBrand Co</p>
          <p className="text-[10px] text-rose-700 dark:text-rose-400">₺12.3K · +%23</p>
        </div>
      </div>
    </div>
  </div></div>
  </div>
  
  <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
    <div className="p-4 border-b border-gray-100 dark:border-gray-700/40 bg-gradient-to-r from-violet-50/50 via-transparent to-indigo-50/30 dark:from-violet-500/5 dark:to-indigo-500/5 flex items-center justify-between gap-2 flex-wrap">
      <div className="flex items-center gap-2">
        <div className="relative">
          <div className="absolute inset-0 bg-violet-500/30 rounded-lg blur-md aig"></div>
          <div className="relative w-9 h-9 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <svg className="text-white w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 10v6M4.22 4.22l4.24 4.24m7.08 7.08 4.24 4.24M1 12h6m10 0h6M4.22 19.78l4.24-4.24m7.08-7.08 4.24-4.24"/></svg>
          </div>
        </div>
        <div>
          <h4 className="text-[13px] font-bold text-gray-900 dark:text-gray-100">Orchestrator Core</h4>
          <p className="text-[10px] text-gray-500 dark:text-gray-400">Canlı JSON ağacı · her tetiklenme bu noktadan geçer</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 px-2 py-1 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-full">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
          <span className="text-[9px] font-bold text-emerald-700 dark:text-emerald-300">Master Aktif</span>
        </div>
        <button onClick={() => undefined} className="text-[10px] font-bold text-violet-700 dark:text-violet-400 hover:underline flex items-center gap-1 font-mono">
          /v1/orchestrator <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>
    </div>

    {/* JSON ağacı görseli */}
    <div className="p-4 relative overflow-hidden">
      {/* Flow background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%,#8b5cf6 0,transparent 50%),radial-gradient(circle at 80% 50%,#f59e0b 0,transparent 50%)' }}></div>

      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          
          <div className="group relative p-3 bg-gray-50 dark:bg-[#17181f] border border-gray-200 dark:border-gray-700/50 rounded-lg hover:border-violet-300 dark:hover:border-violet-500/50 transition-all cursor-pointer" onClick={() => undefined}>
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <svg className="text-violet-600 dark:text-violet-400 w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M4 4h16v16H4z"/><path d="M4 12h16"/><path d="M12 4v16"/></svg>
                <span className="text-[11px] font-bold text-gray-900 dark:text-gray-100 font-mono truncate">Master.JSON</span>
              </div>
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0 mt-1.5"></span>
            </div>
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-gray-500 dark:text-gray-500">v4.1.0</span>
              <span className="text-gray-500 dark:text-gray-500">24 prompt · 30dk</span>
            </div>
          </div>
          <div className="group relative p-3 bg-gray-50 dark:bg-[#17181f] border border-gray-200 dark:border-gray-700/50 rounded-lg hover:border-violet-300 dark:hover:border-violet-500/50 transition-all cursor-pointer" onClick={() => undefined}>
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <svg className="text-violet-600 dark:text-violet-400 w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M4 4h16v16H4z"/><path d="M4 12h16"/><path d="M12 4v16"/></svg>
                <span className="text-[11px] font-bold text-gray-900 dark:text-gray-100 font-mono truncate">Satis_Talimat.JSON</span>
              </div>
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0 mt-1.5"></span>
            </div>
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-gray-500 dark:text-gray-500">v2.1.4</span>
              <span className="text-gray-500 dark:text-gray-500">12 prompt · 2sa</span>
            </div>
          </div>
          <div className="group relative p-3 bg-gray-50 dark:bg-[#17181f] border border-gray-200 dark:border-gray-700/50 rounded-lg hover:border-violet-300 dark:hover:border-violet-500/50 transition-all cursor-pointer" onClick={() => undefined}>
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <svg className="text-violet-600 dark:text-violet-400 w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M4 4h16v16H4z"/><path d="M4 12h16"/><path d="M12 4v16"/></svg>
                <span className="text-[11px] font-bold text-gray-900 dark:text-gray-100 font-mono truncate">Google_ADS_Is_Surec.JSON</span>
              </div>
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0 mt-1.5"></span>
            </div>
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-gray-500 dark:text-gray-500">v2.3.7</span>
              <span className="text-gray-500 dark:text-gray-500">10 prompt · 4sa</span>
            </div>
          </div>
          <div className="group relative p-3 bg-gray-50 dark:bg-[#17181f] border border-gray-200 dark:border-gray-700/50 rounded-lg hover:border-violet-300 dark:hover:border-violet-500/50 transition-all cursor-pointer" onClick={() => undefined}>
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <svg className="text-violet-600 dark:text-violet-400 w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M4 4h16v16H4z"/><path d="M4 12h16"/><path d="M12 4v16"/></svg>
                <span className="text-[11px] font-bold text-gray-900 dark:text-gray-100 font-mono truncate">Maliyet_Analiz.JSON</span>
              </div>
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0 mt-1.5"></span>
            </div>
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-gray-500 dark:text-gray-500">v1.8.2</span>
              <span className="text-gray-500 dark:text-gray-500">8 prompt · 5sa</span>
            </div>
          </div>
          <div className="group relative p-3 bg-gray-50 dark:bg-[#17181f] border border-gray-200 dark:border-gray-700/50 rounded-lg hover:border-violet-300 dark:hover:border-violet-500/50 transition-all cursor-pointer" onClick={() => undefined}>
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <svg className="text-violet-600 dark:text-violet-400 w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M4 4h16v16H4z"/><path d="M4 12h16"/><path d="M12 4v16"/></svg>
                <span className="text-[11px] font-bold text-gray-900 dark:text-gray-100 font-mono truncate">Finans_Talimat.JSON</span>
              </div>
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0 mt-1.5"></span>
            </div>
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-gray-500 dark:text-gray-500">v3.0.1</span>
              <span className="text-gray-500 dark:text-gray-500">15 prompt · 1g</span>
            </div>
          </div>
          <div className="group relative p-3 bg-gray-50 dark:bg-[#17181f] border border-gray-200 dark:border-gray-700/50 rounded-lg hover:border-violet-300 dark:hover:border-violet-500/50 transition-all cursor-pointer" onClick={() => undefined}>
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <svg className="text-violet-600 dark:text-violet-400 w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M4 4h16v16H4z"/><path d="M4 12h16"/><path d="M12 4v16"/></svg>
                <span className="text-[11px] font-bold text-gray-900 dark:text-gray-100 font-mono truncate">Planner_Gorev_Aktarim.JSON</span>
              </div>
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full shrink-0 mt-1.5"></span>
            </div>
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-gray-500 dark:text-gray-500">v1.5.0</span>
              <span className="text-gray-500 dark:text-gray-500">6 prompt · 3g</span>
            </div>
          </div>
        </div>

        {/* Alt bilgi */}
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/40 grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="p-2 text-center bg-violet-50 dark:bg-violet-500/5 border border-violet-200/40 dark:border-violet-500/20 rounded">
            <div className="text-[16px] font-bold text-violet-700 dark:text-violet-300 leading-none">6</div>
            <div className="text-[9px] text-violet-600 dark:text-violet-400 uppercase tracking-wider mt-0.5">Core JSON</div>
          </div>
          <div className="p-2 text-center bg-indigo-50 dark:bg-indigo-500/5 border border-indigo-200/40 dark:border-indigo-500/20 rounded">
            <div className="text-[16px] font-bold text-indigo-700 dark:text-indigo-300 leading-none">18</div>
            <div className="text-[9px] text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mt-0.5">Agents</div>
          </div>
          <div className="p-2 text-center bg-sky-50 dark:bg-sky-500/5 border border-sky-200/40 dark:border-sky-500/20 rounded">
            <div className="text-[16px] font-bold text-sky-700 dark:text-sky-300 leading-none">75</div>
            <div className="text-[9px] text-sky-600 dark:text-sky-400 uppercase tracking-wider mt-0.5">Prompts</div>
          </div>
          <div className="p-2 text-center bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-200/40 dark:border-emerald-500/20 rounded">
            <div className="text-[16px] font-bold text-emerald-700 dark:text-emerald-300 leading-none">247</div>
            <div className="text-[9px] text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mt-0.5">Trigger/24h</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
    <div className="p-4 border-b border-gray-100 dark:border-gray-700/40 flex items-center justify-between gap-2 flex-wrap">
      <div className="flex items-center gap-2">
        <svg className="text-amber-600 dark:text-amber-400 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
        <div>
          <h4 className="text-[13px] font-bold text-gray-900 dark:text-gray-100">Birim Skorkartları</h4>
          <p className="text-[10px] text-gray-500 dark:text-gray-400">5 birim · canlı metrikler · detay için panoya git</p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-[10px] text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-emerald-500 rounded-full"></span>Sağlıklı: 3</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-amber-500 rounded-full"></span>Uyarı: 2</span>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-gray-700/40">
      
      <div className="p-4 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="w-9 h-9 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center shrink-0"><svg className="text-pink-700 dark:text-pink-300 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg></div>
            <div className="min-w-0">
              <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100 truncate">Pazarlama</p>
              <p className="text-[9px] text-gray-500 dark:text-gray-400 truncate">Zeynep A.</p>
            </div>
          </div>
          <div className="w-2 h-2 bg-emerald-500 rounded-full shrink-0 shadow-sm"></div>
        </div>
        <div className="grid grid-cols-2 gap-1.5 mb-3">
          <div className="p-2 bg-gray-50 dark:bg-[#17181f] rounded-md"><p className="text-[9px] text-gray-500 dark:text-gray-400 leading-tight">Lead</p><p className="text-[13px] font-bold text-gray-900 dark:text-gray-100 leading-tight mt-0.5">178</p></div><div className="p-2 bg-gray-50 dark:bg-[#17181f] rounded-md"><p className="text-[9px] text-gray-500 dark:text-gray-400 leading-tight">Kalifiye</p><p className="text-[13px] font-bold text-gray-900 dark:text-gray-100 leading-tight mt-0.5">37</p></div><div className="p-2 bg-gray-50 dark:bg-[#17181f] rounded-md"><p className="text-[9px] text-gray-500 dark:text-gray-400 leading-tight">CAC</p><p className="text-[13px] font-bold text-gray-900 dark:text-gray-100 leading-tight mt-0.5">₺1.2K</p></div><div className="p-2 bg-gray-50 dark:bg-[#17181f] rounded-md"><p className="text-[9px] text-gray-500 dark:text-gray-400 leading-tight">Kampanya</p><p className="text-[13px] font-bold text-gray-900 dark:text-gray-100 leading-tight mt-0.5">8</p></div>
        </div>
        <button onClick={() => undefined} className="w-full text-[10px] font-bold text-pink-700 dark:text-pink-300 hover:underline flex items-center justify-center gap-1 py-1.5 border border-pink-200/50 dark:border-pink-500/30 rounded-md hover:bg-pink-50 dark:hover:bg-pink-500/10 transition-colors">Panoya Git <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg></button>
      </div>
      <div className="p-4 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="w-9 h-9 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center shrink-0"><svg className="text-emerald-700 dark:text-emerald-300 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></div>
            <div className="min-w-0">
              <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100 truncate">Satış</p>
              <p className="text-[9px] text-gray-500 dark:text-gray-400 truncate">Çiğdem A.</p>
            </div>
          </div>
          <div className="w-2 h-2 bg-emerald-500 rounded-full shrink-0 shadow-sm"></div>
        </div>
        <div className="grid grid-cols-2 gap-1.5 mb-3">
          <div className="p-2 bg-gray-50 dark:bg-[#17181f] rounded-md"><p className="text-[9px] text-gray-500 dark:text-gray-400 leading-tight">Teklif</p><p className="text-[13px] font-bold text-gray-900 dark:text-gray-100 leading-tight mt-0.5">178</p></div><div className="p-2 bg-gray-50 dark:bg-[#17181f] rounded-md"><p className="text-[9px] text-gray-500 dark:text-gray-400 leading-tight">Kazanma</p><p className="text-[13px] font-bold text-gray-900 dark:text-gray-100 leading-tight mt-0.5">%42</p></div><div className="p-2 bg-gray-50 dark:bg-[#17181f] rounded-md"><p className="text-[9px] text-gray-500 dark:text-gray-400 leading-tight">MRR</p><p className="text-[13px] font-bold text-gray-900 dark:text-gray-100 leading-tight mt-0.5">₺216K</p></div><div className="p-2 bg-gray-50 dark:bg-[#17181f] rounded-md"><p className="text-[9px] text-gray-500 dark:text-gray-400 leading-tight">Pipeline</p><p className="text-[13px] font-bold text-gray-900 dark:text-gray-100 leading-tight mt-0.5">₺4.2M</p></div>
        </div>
        <button onClick={() => undefined} className="w-full text-[10px] font-bold text-emerald-700 dark:text-emerald-300 hover:underline flex items-center justify-center gap-1 py-1.5 border border-emerald-200/50 dark:border-emerald-500/30 rounded-md hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors">Panoya Git <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg></button>
      </div>
      <div className="p-4 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="w-9 h-9 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center shrink-0"><svg className="text-amber-700 dark:text-amber-300 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg></div>
            <div className="min-w-0">
              <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100 truncate">Finans</p>
              <p className="text-[9px] text-gray-500 dark:text-gray-400 truncate">Ali B.</p>
            </div>
          </div>
          <div className="w-2 h-2 bg-amber-500 rounded-full shrink-0 shadow-sm"></div>
        </div>
        <div className="grid grid-cols-2 gap-1.5 mb-3">
          <div className="p-2 bg-gray-50 dark:bg-[#17181f] rounded-md"><p className="text-[9px] text-gray-500 dark:text-gray-400 leading-tight">Tahsilat</p><p className="text-[13px] font-bold text-gray-900 dark:text-gray-100 leading-tight mt-0.5">%96</p></div><div className="p-2 bg-gray-50 dark:bg-[#17181f] rounded-md"><p className="text-[9px] text-gray-500 dark:text-gray-400 leading-tight">Alacak</p><p className="text-[13px] font-bold text-gray-900 dark:text-gray-100 leading-tight mt-0.5">₺312K</p></div><div className="p-2 bg-gray-50 dark:bg-[#17181f] rounded-md"><p className="text-[9px] text-gray-500 dark:text-gray-400 leading-tight">Gecikmiş</p><p className="text-[13px] font-bold text-gray-900 dark:text-gray-100 leading-tight mt-0.5">4</p></div><div className="p-2 bg-gray-50 dark:bg-[#17181f] rounded-md"><p className="text-[9px] text-gray-500 dark:text-gray-400 leading-tight">Runway</p><p className="text-[13px] font-bold text-gray-900 dark:text-gray-100 leading-tight mt-0.5">60g</p></div>
        </div>
        <button onClick={() => undefined} className="w-full text-[10px] font-bold text-amber-700 dark:text-amber-300 hover:underline flex items-center justify-center gap-1 py-1.5 border border-amber-200/50 dark:border-amber-500/30 rounded-md hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors">Panoya Git <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg></button>
      </div>
      <div className="p-4 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="w-9 h-9 bg-sky-100 dark:bg-sky-900/30 rounded-lg flex items-center justify-center shrink-0"><svg className="text-sky-700 dark:text-sky-300 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M3 3h18v18H3z"/><path d="M9 9l6 6M15 9l-6 6"/></svg></div>
            <div className="min-w-0">
              <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100 truncate">Ads Op.</p>
              <p className="text-[9px] text-gray-500 dark:text-gray-400 truncate">Berke Y.</p>
            </div>
          </div>
          <div className="w-2 h-2 bg-emerald-500 rounded-full shrink-0 shadow-sm"></div>
        </div>
        <div className="grid grid-cols-2 gap-1.5 mb-3">
          <div className="p-2 bg-gray-50 dark:bg-[#17181f] rounded-md"><p className="text-[9px] text-gray-500 dark:text-gray-400 leading-tight">Hesap</p><p className="text-[13px] font-bold text-gray-900 dark:text-gray-100 leading-tight mt-0.5">24</p></div><div className="p-2 bg-gray-50 dark:bg-[#17181f] rounded-md"><p className="text-[9px] text-gray-500 dark:text-gray-400 leading-tight">Spend</p><p className="text-[13px] font-bold text-gray-900 dark:text-gray-100 leading-tight mt-0.5">₺1.8M</p></div><div className="p-2 bg-gray-50 dark:bg-[#17181f] rounded-md"><p className="text-[9px] text-gray-500 dark:text-gray-400 leading-tight">ROAS</p><p className="text-[13px] font-bold text-gray-900 dark:text-gray-100 leading-tight mt-0.5">2.4x</p></div><div className="p-2 bg-gray-50 dark:bg-[#17181f] rounded-md"><p className="text-[9px] text-gray-500 dark:text-gray-400 leading-tight">CTR</p><p className="text-[13px] font-bold text-gray-900 dark:text-gray-100 leading-tight mt-0.5">%3.2</p></div>
        </div>
        <button onClick={() => undefined} className="w-full text-[10px] font-bold text-sky-700 dark:text-sky-300 hover:underline flex items-center justify-center gap-1 py-1.5 border border-sky-200/50 dark:border-sky-500/30 rounded-md hover:bg-sky-50 dark:hover:bg-sky-500/10 transition-colors">Panoya Git <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg></button>
      </div>
      <div className="p-4 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="w-9 h-9 bg-violet-100 dark:bg-violet-900/30 rounded-lg flex items-center justify-center shrink-0"><svg className="text-violet-700 dark:text-violet-300 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg></div>
            <div className="min-w-0">
              <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100 truncate">Prodüksiyon</p>
              <p className="text-[9px] text-gray-500 dark:text-gray-400 truncate">Berke Y.</p>
            </div>
          </div>
          <div className="w-2 h-2 bg-amber-500 rounded-full shrink-0 shadow-sm"></div>
        </div>
        <div className="grid grid-cols-2 gap-1.5 mb-3">
          <div className="p-2 bg-gray-50 dark:bg-[#17181f] rounded-md"><p className="text-[9px] text-gray-500 dark:text-gray-400 leading-tight">Proje</p><p className="text-[13px] font-bold text-gray-900 dark:text-gray-100 leading-tight mt-0.5">18</p></div><div className="p-2 bg-gray-50 dark:bg-[#17181f] rounded-md"><p className="text-[9px] text-gray-500 dark:text-gray-400 leading-tight">Teslim</p><p className="text-[13px] font-bold text-gray-900 dark:text-gray-100 leading-tight mt-0.5">12</p></div><div className="p-2 bg-gray-50 dark:bg-[#17181f] rounded-md"><p className="text-[9px] text-gray-500 dark:text-gray-400 leading-tight">Zamanında</p><p className="text-[13px] font-bold text-gray-900 dark:text-gray-100 leading-tight mt-0.5">%92</p></div><div className="p-2 bg-gray-50 dark:bg-[#17181f] rounded-md"><p className="text-[9px] text-gray-500 dark:text-gray-400 leading-tight">NPS</p><p className="text-[13px] font-bold text-gray-900 dark:text-gray-100 leading-tight mt-0.5">4.6</p></div>
        </div>
        <button onClick={() => undefined} className="w-full text-[10px] font-bold text-violet-700 dark:text-violet-300 hover:underline flex items-center justify-center gap-1 py-1.5 border border-violet-200/50 dark:border-violet-500/30 rounded-md hover:bg-violet-50 dark:hover:bg-violet-500/10 transition-colors">Panoya Git <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg></button>
      </div>
    </div>
  </div>
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
    
  <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
    <div className="p-4 border-b border-gray-100 dark:border-gray-700/40 flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-rose-100 dark:bg-rose-500/20 rounded-lg flex items-center justify-center"><svg className="text-rose-600 dark:text-rose-400 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div>
        <div>
          <h4 className="text-[13px] font-bold text-gray-900 dark:text-gray-100">Onay Kuyruğu · CEO + Mimar</h4>
          <p className="text-[10px] text-gray-500 dark:text-gray-400">18 bekleyen · 6 kritik · 3 iş + 8 bütçe + 7 sistem</p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button className="text-[9px] font-bold px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">Tümü</button>
        <button className="text-[9px] font-bold px-2 py-0.5 bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30 rounded-full">İş</button>
        <button className="text-[9px] font-bold px-2 py-0.5 bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300 rounded-full">Sistem</button>
      </div>
    </div>
    <div className="divide-y divide-gray-100 dark:divide-gray-700/40">
      
      <div className="relative group trigger-btn p-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
        <div className="flex items-start gap-2.5">
          <div className="w-9 h-9 bg-rose-100 dark:bg-rose-900/30 rounded-lg flex items-center justify-center shrink-0 "><svg className="text-rose-700 dark:text-rose-300 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg></div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
              <span className="text-[9px] font-bold text-rose-700 dark:text-rose-300 px-1.5 py-0.5 bg-rose-100 dark:bg-rose-900/30 rounded">Finans · Budget</span>
              <span className="text-[8px] font-bold bg-rose-600 text-white px-1.5 py-0.5 rounded tracking-wider animate-pulse">ACİL</span>
              
            </div>
            <h5 className="text-[12px] font-bold text-gray-900 dark:text-gray-100 leading-tight">Premium 360 için %18 iskonto onayı</h5>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">Çiğdem Alataş · 2sa · <span className="font-semibold text-rose-700 dark:text-rose-300">₺680K</span></p>
          </div>
          <div className="flex gap-1 shrink-0">
            <button onClick={() => undefined} className="w-7 h-7 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 rounded-md flex items-center justify-center transition-colors" title="Onayla"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polyline points="20 6 9 17 4 12"/></svg></button>
            <button className="w-7 h-7 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400 rounded-md flex items-center justify-center transition-colors" title="Detay"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button>
          </div>
        </div>
        
  <div className="trigger-pop top-full right-0 mt-2 w-[280px] bg-[#0a0e1a] border border-amber-400/40 rounded-lg shadow-2xl overflow-hidden">
    <div className="p-2 bg-gradient-to-r from-amber-500/20 to-violet-500/20 border-b border-white/10 flex items-center gap-1.5">
      <svg className="text-amber-300 w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
      <span className="text-[9px] font-bold tracking-widest text-amber-300 uppercase">Tetiklenen Zincir</span>
    </div>
    <div className="p-2.5 space-y-1.5 font-mono text-[10px]">
      <div className="flex items-start gap-1.5">
        <span className="w-12 text-emerald-400 font-bold shrink-0">API</span>
        <span className="text-white/80 break-all">POST /v1/approvals/discount/&#123;id&#125;/approve</span>
      </div>
      <div className="flex items-start gap-1.5">
        <span className="w-12 text-violet-400 font-bold shrink-0">JSON</span>
        <span className="text-white/80 break-all">Satis_Talimat.JSON#discount</span>
      </div>
      <div className="flex items-start gap-1.5">
        <span className="w-12 text-sky-400 font-bold shrink-0">PROMPT</span>
        <span className="text-white/80 break-all">prompt_discount_approval_v2</span>
      </div>
      <div className="flex items-start gap-1.5">
        <span className="w-12 text-pink-400 font-bold shrink-0">AGENT</span>
        <span className="text-white/80 break-all">ApprovalCoordinator</span>
      </div>
    </div>
  </div>
      </div>
      <div className="relative group trigger-btn p-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
        <div className="flex items-start gap-2.5">
          <div className="w-9 h-9 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center shrink-0 "><svg className="text-amber-700 dark:text-amber-300 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg></div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
              <span className="text-[9px] font-bold text-amber-700 dark:text-amber-300 px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/30 rounded">Ads · Budget</span>
              
              
            </div>
            <h5 className="text-[12px] font-bold text-gray-900 dark:text-gray-100 leading-tight">Mayıs Ads bütçesi revizyonu</h5>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">Berke Yılmaz · 4sa · <span className="font-semibold text-amber-700 dark:text-amber-300">₺145K</span></p>
          </div>
          <div className="flex gap-1 shrink-0">
            <button onClick={() => undefined} className="w-7 h-7 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 rounded-md flex items-center justify-center transition-colors" title="Onayla"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polyline points="20 6 9 17 4 12"/></svg></button>
            <button className="w-7 h-7 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400 rounded-md flex items-center justify-center transition-colors" title="Detay"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button>
          </div>
        </div>
        
  <div className="trigger-pop top-full right-0 mt-2 w-[280px] bg-[#0a0e1a] border border-amber-400/40 rounded-lg shadow-2xl overflow-hidden">
    <div className="p-2 bg-gradient-to-r from-amber-500/20 to-violet-500/20 border-b border-white/10 flex items-center gap-1.5">
      <svg className="text-amber-300 w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
      <span className="text-[9px] font-bold tracking-widest text-amber-300 uppercase">Tetiklenen Zincir</span>
    </div>
    <div className="p-2.5 space-y-1.5 font-mono text-[10px]">
      <div className="flex items-start gap-1.5">
        <span className="w-12 text-emerald-400 font-bold shrink-0">API</span>
        <span className="text-white/80 break-all">POST /v1/ads/budget-adjust</span>
      </div>
      <div className="flex items-start gap-1.5">
        <span className="w-12 text-violet-400 font-bold shrink-0">JSON</span>
        <span className="text-white/80 break-all">Google_ADS_Is_Surec.JSON</span>
      </div>
      <div className="flex items-start gap-1.5">
        <span className="w-12 text-sky-400 font-bold shrink-0">PROMPT</span>
        <span className="text-white/80 break-all">prompt_ads_budget_v1_5</span>
      </div>
      <div className="flex items-start gap-1.5">
        <span className="w-12 text-pink-400 font-bold shrink-0">AGENT</span>
        <span className="text-white/80 break-all">AdsAgent</span>
      </div>
    </div>
  </div>
      </div>
      <div className="relative group trigger-btn p-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
        <div className="flex items-start gap-2.5">
          <div className="w-9 h-9 bg-violet-100 dark:bg-violet-900/30 rounded-lg flex items-center justify-center shrink-0 border border-violet-200 dark:border-violet-500/30"><svg className="text-violet-700 dark:text-violet-300 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg></div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
              <span className="text-[9px] font-bold text-violet-700 dark:text-violet-300 px-1.5 py-0.5 bg-violet-100 dark:bg-violet-900/30 rounded">Prompt · Update</span>
              
              <span className="text-[8px] font-bold text-violet-700 dark:text-violet-300 px-1.5 py-0.5 bg-violet-100 dark:bg-violet-900/30 rounded">ADOS</span>
            </div>
            <h5 className="text-[12px] font-bold text-gray-900 dark:text-gray-100 leading-tight">SEO İçerik Prompt v3.2 → v3.3</h5>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">Ahmet Y. · 5sa · <span className="font-semibold text-violet-700 dark:text-violet-300">—</span></p>
          </div>
          <div className="flex gap-1 shrink-0">
            <button onClick={() => undefined} className="w-7 h-7 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 rounded-md flex items-center justify-center transition-colors" title="Onayla"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polyline points="20 6 9 17 4 12"/></svg></button>
            <button className="w-7 h-7 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400 rounded-md flex items-center justify-center transition-colors" title="Detay"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button>
          </div>
        </div>
        
  <div className="trigger-pop top-full right-0 mt-2 w-[280px] bg-[#0a0e1a] border border-amber-400/40 rounded-lg shadow-2xl overflow-hidden">
    <div className="p-2 bg-gradient-to-r from-amber-500/20 to-violet-500/20 border-b border-white/10 flex items-center gap-1.5">
      <svg className="text-amber-300 w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
      <span className="text-[9px] font-bold tracking-widest text-amber-300 uppercase">Tetiklenen Zincir</span>
    </div>
    <div className="p-2.5 space-y-1.5 font-mono text-[10px]">
      <div className="flex items-start gap-1.5">
        <span className="w-12 text-emerald-400 font-bold shrink-0">API</span>
        <span className="text-white/80 break-all">PUT /v1/prompts/seo-icerik-analiz</span>
      </div>
      <div className="flex items-start gap-1.5">
        <span className="w-12 text-violet-400 font-bold shrink-0">JSON</span>
        <span className="text-white/80 break-all">SEO_Icerik.JSON</span>
      </div>
      <div className="flex items-start gap-1.5">
        <span className="w-12 text-sky-400 font-bold shrink-0">PROMPT</span>
        <span className="text-white/80 break-all">prompt_seo_icerik_v3_3</span>
      </div>
      <div className="flex items-start gap-1.5">
        <span className="w-12 text-pink-400 font-bold shrink-0">AGENT</span>
        <span className="text-white/80 break-all">SeoAgent</span>
      </div>
    </div>
  </div>
      </div>
      <div className="relative group trigger-btn p-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
        <div className="flex items-start gap-2.5">
          <div className="w-9 h-9 bg-violet-100 dark:bg-violet-900/30 rounded-lg flex items-center justify-center shrink-0 border border-violet-200 dark:border-violet-500/30"><svg className="text-violet-700 dark:text-violet-300 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg></div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
              <span className="text-[9px] font-bold text-violet-700 dark:text-violet-300 px-1.5 py-0.5 bg-violet-100 dark:bg-violet-900/30 rounded">Orchestrator</span>
              
              <span className="text-[8px] font-bold text-violet-700 dark:text-violet-300 px-1.5 py-0.5 bg-violet-100 dark:bg-violet-900/30 rounded">ADOS</span>
            </div>
            <h5 className="text-[12px] font-bold text-gray-900 dark:text-gray-100 leading-tight">Yeni lead-nurturing akışı deploy</h5>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">Jenny AI · 6sa · <span className="font-semibold text-violet-700 dark:text-violet-300">—</span></p>
          </div>
          <div className="flex gap-1 shrink-0">
            <button onClick={() => undefined} className="w-7 h-7 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 rounded-md flex items-center justify-center transition-colors" title="Onayla"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polyline points="20 6 9 17 4 12"/></svg></button>
            <button className="w-7 h-7 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400 rounded-md flex items-center justify-center transition-colors" title="Detay"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button>
          </div>
        </div>
        
  <div className="trigger-pop top-full right-0 mt-2 w-[280px] bg-[#0a0e1a] border border-amber-400/40 rounded-lg shadow-2xl overflow-hidden">
    <div className="p-2 bg-gradient-to-r from-amber-500/20 to-violet-500/20 border-b border-white/10 flex items-center gap-1.5">
      <svg className="text-amber-300 w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
      <span className="text-[9px] font-bold tracking-widest text-amber-300 uppercase">Tetiklenen Zincir</span>
    </div>
    <div className="p-2.5 space-y-1.5 font-mono text-[10px]">
      <div className="flex items-start gap-1.5">
        <span className="w-12 text-emerald-400 font-bold shrink-0">API</span>
        <span className="text-white/80 break-all">POST /v1/orchestrator/flows/deploy</span>
      </div>
      <div className="flex items-start gap-1.5">
        <span className="w-12 text-violet-400 font-bold shrink-0">JSON</span>
        <span className="text-white/80 break-all">Lead_Nurture.JSON v0.9</span>
      </div>
      <div className="flex items-start gap-1.5">
        <span className="w-12 text-sky-400 font-bold shrink-0">PROMPT</span>
        <span className="text-white/80 break-all">prompt_nurture_flow_v1</span>
      </div>
      <div className="flex items-start gap-1.5">
        <span className="w-12 text-pink-400 font-bold shrink-0">AGENT</span>
        <span className="text-white/80 break-all">Orchestrator</span>
      </div>
    </div>
  </div>
      </div>
    </div>
    <div className="p-3 border-t border-gray-100 dark:border-gray-700/40 bg-gray-50/50 dark:bg-[#17181f]/50">
      <button onClick={() => undefined} className="w-full text-[11px] font-bold text-rose-700 dark:text-rose-300 hover:underline text-center">Tüm onayları görüntüle (18) →</button>
    </div>
  </div>
    
  <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
    <div className="p-4 border-b border-gray-100 dark:border-gray-700/40 bg-gradient-to-r from-amber-50/30 via-transparent to-violet-50/30 dark:from-amber-500/5 dark:to-violet-500/5 flex items-center justify-between gap-2 flex-wrap">
      <div className="flex items-center gap-2">
        <svg className="text-amber-600 dark:text-amber-400 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
        <div>
          <h4 className="text-[13px] font-bold text-gray-900 dark:text-gray-100">Hızlı Aksiyonlar</h4>
          <p className="text-[10px] text-gray-500 dark:text-gray-400">Her butonun arkasında ne var? · hover için üzerine gel</p>
        </div>
      </div>
      <span className="text-[9px] text-gray-400 dark:text-gray-500 hidden md:block">CEO + ADOS Mimarı · 6 aksiyon</span>
    </div>
    <div className="p-3 grid grid-cols-2 md:grid-cols-3 gap-2">
      
      <div className="relative group trigger-btn">
        <button onClick={() => undefined} className="w-full flex flex-col gap-2 p-3 bg-gray-50 hover:bg-gray-100 dark:bg-[#17181f] dark:hover:bg-[#1a1b22] rounded-lg border border-gray-200 dark:border-gray-700/50 hover:border-amber-300 dark:hover:border-amber-500/40 transition-all text-left min-h-[100px]">
          <div className="w-9 h-9 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center"><svg className="text-amber-700 dark:text-amber-300 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
          <div>
            <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100 leading-tight">Yeni Talimat / Brief</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">Master.JSON'a yeni modül ekle</p>
          </div>
          <div className="mt-auto flex items-center gap-1 text-[9px] text-amber-600 dark:text-amber-400 font-mono opacity-60 group-hover:opacity-100 transition-opacity">
            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            <span>Detay</span>
          </div>
        </button>
        
  <div className="trigger-pop top-full right-0 mt-2 w-[280px] bg-[#0a0e1a] border border-amber-400/40 rounded-lg shadow-2xl overflow-hidden">
    <div className="p-2 bg-gradient-to-r from-amber-500/20 to-violet-500/20 border-b border-white/10 flex items-center gap-1.5">
      <svg className="text-amber-300 w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
      <span className="text-[9px] font-bold tracking-widest text-amber-300 uppercase">Tetiklenen Zincir</span>
    </div>
    <div className="p-2.5 space-y-1.5 font-mono text-[10px]">
      <div className="flex items-start gap-1.5">
        <span className="w-12 text-emerald-400 font-bold shrink-0">API</span>
        <span className="text-white/80 break-all">POST /v1/json/master/modules</span>
      </div>
      <div className="flex items-start gap-1.5">
        <span className="w-12 text-violet-400 font-bold shrink-0">JSON</span>
        <span className="text-white/80 break-all">Master.JSON → modules[]</span>
      </div>
      <div className="flex items-start gap-1.5">
        <span className="w-12 text-sky-400 font-bold shrink-0">PROMPT</span>
        <span className="text-white/80 break-all">prompt_brief_creator_v3</span>
      </div>
      <div className="flex items-start gap-1.5">
        <span className="w-12 text-pink-400 font-bold shrink-0">AGENT</span>
        <span className="text-white/80 break-all">—</span>
      </div>
    </div>
  </div>
      </div>
      <div className="relative group trigger-btn">
        <button onClick={() => undefined} className="w-full flex flex-col gap-2 p-3 bg-gray-50 hover:bg-gray-100 dark:bg-[#17181f] dark:hover:bg-[#1a1b22] rounded-lg border border-gray-200 dark:border-gray-700/50 hover:border-violet-300 dark:hover:border-violet-500/40 transition-all text-left min-h-[100px]">
          <div className="w-9 h-9 bg-violet-100 dark:bg-violet-900/30 rounded-lg flex items-center justify-center"><svg className="text-violet-700 dark:text-violet-300 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>
          <div>
            <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100 leading-tight">Yeni Prompt Seti</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">Prompt Kütüphanesi'ne ekle</p>
          </div>
          <div className="mt-auto flex items-center gap-1 text-[9px] text-violet-600 dark:text-violet-400 font-mono opacity-60 group-hover:opacity-100 transition-opacity">
            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            <span>Detay</span>
          </div>
        </button>
        
  <div className="trigger-pop top-full right-0 mt-2 w-[280px] bg-[#0a0e1a] border border-amber-400/40 rounded-lg shadow-2xl overflow-hidden">
    <div className="p-2 bg-gradient-to-r from-amber-500/20 to-violet-500/20 border-b border-white/10 flex items-center gap-1.5">
      <svg className="text-amber-300 w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
      <span className="text-[9px] font-bold tracking-widest text-amber-300 uppercase">Tetiklenen Zincir</span>
    </div>
    <div className="p-2.5 space-y-1.5 font-mono text-[10px]">
      <div className="flex items-start gap-1.5">
        <span className="w-12 text-emerald-400 font-bold shrink-0">API</span>
        <span className="text-white/80 break-all">POST /v1/prompts</span>
      </div>
      <div className="flex items-start gap-1.5">
        <span className="w-12 text-violet-400 font-bold shrink-0">JSON</span>
        <span className="text-white/80 break-all">Prompt_Registry.JSON</span>
      </div>
      <div className="flex items-start gap-1.5">
        <span className="w-12 text-sky-400 font-bold shrink-0">PROMPT</span>
        <span className="text-white/80 break-all">—</span>
      </div>
      <div className="flex items-start gap-1.5">
        <span className="w-12 text-pink-400 font-bold shrink-0">AGENT</span>
        <span className="text-white/80 break-all">PromptEngine</span>
      </div>
    </div>
  </div>
      </div>
      <div className="relative group trigger-btn">
        <button onClick={() => undefined} className="w-full flex flex-col gap-2 p-3 bg-gray-50 hover:bg-gray-100 dark:bg-[#17181f] dark:hover:bg-[#1a1b22] rounded-lg border border-gray-200 dark:border-gray-700/50 hover:border-rose-300 dark:hover:border-rose-500/40 transition-all text-left min-h-[100px]">
          <div className="w-9 h-9 bg-rose-100 dark:bg-rose-900/30 rounded-lg flex items-center justify-center"><svg className="text-rose-700 dark:text-rose-300 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div>
          <div>
            <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100 leading-tight">Kritik Hata Çöz</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">Son hataları tara · fix öner</p>
          </div>
          <div className="mt-auto flex items-center gap-1 text-[9px] text-rose-600 dark:text-rose-400 font-mono opacity-60 group-hover:opacity-100 transition-opacity">
            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            <span>Detay</span>
          </div>
        </button>
        
  <div className="trigger-pop top-full right-0 mt-2 w-[280px] bg-[#0a0e1a] border border-amber-400/40 rounded-lg shadow-2xl overflow-hidden">
    <div className="p-2 bg-gradient-to-r from-amber-500/20 to-violet-500/20 border-b border-white/10 flex items-center gap-1.5">
      <svg className="text-amber-300 w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
      <span className="text-[9px] font-bold tracking-widest text-amber-300 uppercase">Tetiklenen Zincir</span>
    </div>
    <div className="p-2.5 space-y-1.5 font-mono text-[10px]">
      <div className="flex items-start gap-1.5">
        <span className="w-12 text-emerald-400 font-bold shrink-0">API</span>
        <span className="text-white/80 break-all">GET /v1/errors?severity=critical</span>
      </div>
      <div className="flex items-start gap-1.5">
        <span className="w-12 text-violet-400 font-bold shrink-0">JSON</span>
        <span className="text-white/80 break-all">Audit.JSON#errors</span>
      </div>
      <div className="flex items-start gap-1.5">
        <span className="w-12 text-sky-400 font-bold shrink-0">PROMPT</span>
        <span className="text-white/80 break-all">prompt_error_resolver_v2</span>
      </div>
      <div className="flex items-start gap-1.5">
        <span className="w-12 text-pink-400 font-bold shrink-0">AGENT</span>
        <span className="text-white/80 break-all">JennyAI</span>
      </div>
    </div>
  </div>
      </div>
      <div className="relative group trigger-btn">
        <button onClick={() => undefined} className="w-full flex flex-col gap-2 p-3 bg-gray-50 hover:bg-gray-100 dark:bg-[#17181f] dark:hover:bg-[#1a1b22] rounded-lg border border-gray-200 dark:border-gray-700/50 hover:border-emerald-300 dark:hover:border-emerald-500/40 transition-all text-left min-h-[100px]">
          <div className="w-9 h-9 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center"><svg className="text-emerald-700 dark:text-emerald-300 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/></svg></div>
          <div>
            <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100 leading-tight">Executive Rapor</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">Board meeting için PDF üret</p>
          </div>
          <div className="mt-auto flex items-center gap-1 text-[9px] text-emerald-600 dark:text-emerald-400 font-mono opacity-60 group-hover:opacity-100 transition-opacity">
            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            <span>Detay</span>
          </div>
        </button>
        
  <div className="trigger-pop top-full right-0 mt-2 w-[280px] bg-[#0a0e1a] border border-amber-400/40 rounded-lg shadow-2xl overflow-hidden">
    <div className="p-2 bg-gradient-to-r from-amber-500/20 to-violet-500/20 border-b border-white/10 flex items-center gap-1.5">
      <svg className="text-amber-300 w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
      <span className="text-[9px] font-bold tracking-widest text-amber-300 uppercase">Tetiklenen Zincir</span>
    </div>
    <div className="p-2.5 space-y-1.5 font-mono text-[10px]">
      <div className="flex items-start gap-1.5">
        <span className="w-12 text-emerald-400 font-bold shrink-0">API</span>
        <span className="text-white/80 break-all">POST /v1/reports/executive</span>
      </div>
      <div className="flex items-start gap-1.5">
        <span className="w-12 text-violet-400 font-bold shrink-0">JSON</span>
        <span className="text-white/80 break-all">Finans_Talimat.JSON#exec</span>
      </div>
      <div className="flex items-start gap-1.5">
        <span className="w-12 text-sky-400 font-bold shrink-0">PROMPT</span>
        <span className="text-white/80 break-all">prompt_exec_report_v4</span>
      </div>
      <div className="flex items-start gap-1.5">
        <span className="w-12 text-pink-400 font-bold shrink-0">AGENT</span>
        <span className="text-white/80 break-all">ReportBuilderAgent</span>
      </div>
    </div>
  </div>
      </div>
      <div className="relative group trigger-btn">
        <button onClick={() => undefined} className="w-full flex flex-col gap-2 p-3 bg-gray-50 hover:bg-gray-100 dark:bg-[#17181f] dark:hover:bg-[#1a1b22] rounded-lg border border-gray-200 dark:border-gray-700/50 hover:border-indigo-300 dark:hover:border-indigo-500/40 transition-all text-left min-h-[100px]">
          <div className="w-9 h-9 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center"><svg className="text-indigo-700 dark:text-indigo-300 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg></div>
          <div>
            <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100 leading-tight">Sistem Deploy</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">Staging → Production geçiş</p>
          </div>
          <div className="mt-auto flex items-center gap-1 text-[9px] text-indigo-600 dark:text-indigo-400 font-mono opacity-60 group-hover:opacity-100 transition-opacity">
            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            <span>Detay</span>
          </div>
        </button>
        
  <div className="trigger-pop top-full right-0 mt-2 w-[280px] bg-[#0a0e1a] border border-amber-400/40 rounded-lg shadow-2xl overflow-hidden">
    <div className="p-2 bg-gradient-to-r from-amber-500/20 to-violet-500/20 border-b border-white/10 flex items-center gap-1.5">
      <svg className="text-amber-300 w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
      <span className="text-[9px] font-bold tracking-widest text-amber-300 uppercase">Tetiklenen Zincir</span>
    </div>
    <div className="p-2.5 space-y-1.5 font-mono text-[10px]">
      <div className="flex items-start gap-1.5">
        <span className="w-12 text-emerald-400 font-bold shrink-0">API</span>
        <span className="text-white/80 break-all">POST /v1/deploy/production</span>
      </div>
      <div className="flex items-start gap-1.5">
        <span className="w-12 text-violet-400 font-bold shrink-0">JSON</span>
        <span className="text-white/80 break-all">Deploy_Config.JSON</span>
      </div>
      <div className="flex items-start gap-1.5">
        <span className="w-12 text-sky-400 font-bold shrink-0">PROMPT</span>
        <span className="text-white/80 break-all">—</span>
      </div>
      <div className="flex items-start gap-1.5">
        <span className="w-12 text-pink-400 font-bold shrink-0">AGENT</span>
        <span className="text-white/80 break-all">DeployAgent</span>
      </div>
    </div>
  </div>
      </div>
      <div className="relative group trigger-btn">
        <button onClick={() => undefined} className="w-full flex flex-col gap-2 p-3 bg-gray-50 hover:bg-gray-100 dark:bg-[#17181f] dark:hover:bg-[#1a1b22] rounded-lg border border-gray-200 dark:border-gray-700/50 hover:border-sky-300 dark:hover:border-sky-500/40 transition-all text-left min-h-[100px]">
          <div className="w-9 h-9 bg-sky-100 dark:bg-sky-900/30 rounded-lg flex items-center justify-center"><svg className="text-sky-700 dark:text-sky-300 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polygon points="5 3 19 12 5 21 5 3"/></svg></div>
          <div>
            <p className="text-[12px] font-bold text-gray-900 dark:text-gray-100 leading-tight">Agent Test Çalıştır</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">Herhangi bir agent'ı test et</p>
          </div>
          <div className="mt-auto flex items-center gap-1 text-[9px] text-sky-600 dark:text-sky-400 font-mono opacity-60 group-hover:opacity-100 transition-opacity">
            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            <span>Detay</span>
          </div>
        </button>
        
  <div className="trigger-pop top-full right-0 mt-2 w-[280px] bg-[#0a0e1a] border border-amber-400/40 rounded-lg shadow-2xl overflow-hidden">
    <div className="p-2 bg-gradient-to-r from-amber-500/20 to-violet-500/20 border-b border-white/10 flex items-center gap-1.5">
      <svg className="text-amber-300 w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
      <span className="text-[9px] font-bold tracking-widest text-amber-300 uppercase">Tetiklenen Zincir</span>
    </div>
    <div className="p-2.5 space-y-1.5 font-mono text-[10px]">
      <div className="flex items-start gap-1.5">
        <span className="w-12 text-emerald-400 font-bold shrink-0">API</span>
        <span className="text-white/80 break-all">POST /v1/agents/&#123;id&#125;/test</span>
      </div>
      <div className="flex items-start gap-1.5">
        <span className="w-12 text-violet-400 font-bold shrink-0">JSON</span>
        <span className="text-white/80 break-all">Agent_Registry.JSON</span>
      </div>
      <div className="flex items-start gap-1.5">
        <span className="w-12 text-sky-400 font-bold shrink-0">PROMPT</span>
        <span className="text-white/80 break-all">prompt_test_runner_v1</span>
      </div>
      <div className="flex items-start gap-1.5">
        <span className="w-12 text-pink-400 font-bold shrink-0">AGENT</span>
        <span className="text-white/80 break-all">TestRunner</span>
      </div>
    </div>
  </div>
      </div>
    </div>
  </div>
  </div>
  
  <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
    <div className="p-4 border-b border-gray-100 dark:border-gray-700/40 flex items-center justify-between gap-2 flex-wrap">
      <div className="flex items-center gap-2">
        <svg className="text-gray-600 dark:text-gray-400 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
        <div>
          <h4 className="text-[13px] font-bold text-gray-900 dark:text-gray-100">Audit Log · Son 24 Saat</h4>
          <p className="text-[10px] text-gray-500 dark:text-gray-400">Tüm sistem aktivitesi · TimescaleDB real-time</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 px-2 py-1 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-full">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
          <span className="text-[9px] font-bold text-emerald-700 dark:text-emerald-300">Canlı</span>
        </div>
        <button onClick={() => undefined} className="text-[10px] font-bold text-violet-700 dark:text-violet-400 hover:underline flex items-center gap-1">Tam Log →</button>
      </div>
    </div>
    <div>
      <table className="w-full text-[11px]">
        <thead className="bg-gray-50 dark:bg-[#17181f]">
          <tr>
            <th className="text-left px-3 py-2 text-[9px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Zaman</th>
            <th className="text-left px-3 py-2 text-[9px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Etiket</th>
            <th className="text-left px-3 py-2 text-[9px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">İşlem</th>
            <th className="hidden lg:table-cell text-left px-3 py-2 text-[9px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Modül</th>
            <th className="text-right px-3 py-2 text-[9px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Durum</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700/40">
          
          <tr className="hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer">
            <td className="px-3 py-2 font-mono text-gray-500 dark:text-gray-400">09:42</td>
            <td className="px-3 py-2"><span className="text-[9px] font-bold px-1.5 py-0.5 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded tracking-wider">AI</span></td>
            <td className="px-3 py-2 text-gray-900 dark:text-gray-100 font-semibold">Jenny → Sabah brifing üretildi<div className="lg:hidden text-[10px] font-normal text-gray-400 dark:text-gray-500 mt-0.5">JennyAI · Master.JSON</div></td>
            <td className="hidden lg:table-cell px-3 py-2 text-gray-500 dark:text-gray-500 text-[10px]">JennyAI · Master.JSON</td>
            <td className="px-3 py-2 text-right"><span className="text-[10px] font-semibold px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded whitespace-nowrap">Başarılı</span></td>
          </tr>
          <tr className="hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer">
            <td className="px-3 py-2 font-mono text-gray-500 dark:text-gray-400">09:15</td>
            <td className="px-3 py-2"><span className="text-[9px] font-bold px-1.5 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded tracking-wider">CONFIG</span></td>
            <td className="px-3 py-2 text-gray-900 dark:text-gray-100 font-semibold">AI Router · Claude 4.7 temperature 0.7→0.6<div className="lg:hidden text-[10px] font-normal text-gray-400 dark:text-gray-500 mt-0.5">AI Router · ai-router/config</div></td>
            <td className="hidden lg:table-cell px-3 py-2 text-gray-500 dark:text-gray-500 text-[10px]">AI Router · ai-router/config</td>
            <td className="px-3 py-2 text-right"><span className="text-[10px] font-semibold px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded whitespace-nowrap">Başarılı</span></td>
          </tr>
          <tr className="hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer">
            <td className="px-3 py-2 font-mono text-gray-500 dark:text-gray-400">08:58</td>
            <td className="px-3 py-2"><span className="text-[9px] font-bold px-1.5 py-0.5 bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 rounded tracking-wider">AGENT</span></td>
            <td className="px-3 py-2 text-gray-900 dark:text-gray-100 font-semibold">SEO Agent · 12 rapor üretti<div className="lg:hidden text-[10px] font-normal text-gray-400 dark:text-gray-500 mt-0.5">SEO Agent · prompt_seo_v3</div></td>
            <td className="hidden lg:table-cell px-3 py-2 text-gray-500 dark:text-gray-500 text-[10px]">SEO Agent · prompt_seo_v3</td>
            <td className="px-3 py-2 text-right"><span className="text-[10px] font-semibold px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded whitespace-nowrap">Başarılı</span></td>
          </tr>
          <tr className="hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer">
            <td className="px-3 py-2 font-mono text-gray-500 dark:text-gray-400">08:32</td>
            <td className="px-3 py-2"><span className="text-[9px] font-bold px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded tracking-wider">APPROVE</span></td>
            <td className="px-3 py-2 text-gray-900 dark:text-gray-100 font-semibold">Google Ads kampanya onaylandı<div className="lg:hidden text-[10px] font-normal text-gray-400 dark:text-gray-500 mt-0.5">ADS Agent · ads_approve</div></td>
            <td className="hidden lg:table-cell px-3 py-2 text-gray-500 dark:text-gray-500 text-[10px]">ADS Agent · ads_approve</td>
            <td className="px-3 py-2 text-right"><span className="text-[10px] font-semibold px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded whitespace-nowrap">Başarılı</span></td>
          </tr>
          <tr className="hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer">
            <td className="px-3 py-2 font-mono text-gray-500 dark:text-gray-400">07:58</td>
            <td className="px-3 py-2"><span className="text-[9px] font-bold px-1.5 py-0.5 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 rounded tracking-wider">PROMPT</span></td>
            <td className="px-3 py-2 text-gray-900 dark:text-gray-100 font-semibold">Prompt versiyonu güncellendi<div className="lg:hidden text-[10px] font-normal text-gray-400 dark:text-gray-500 mt-0.5">Prompt Engine · seo_v3.2→v3.3</div></td>
            <td className="hidden lg:table-cell px-3 py-2 text-gray-500 dark:text-gray-500 text-[10px]">Prompt Engine · seo_v3.2→v3.3</td>
            <td className="px-3 py-2 text-right"><span className="text-[10px] font-semibold px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded whitespace-nowrap">Başarılı</span></td>
          </tr>
          <tr className="hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer">
            <td className="px-3 py-2 font-mono text-gray-500 dark:text-gray-400">07:32</td>
            <td className="px-3 py-2"><span className="text-[9px] font-bold px-1.5 py-0.5 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 rounded tracking-wider">API</span></td>
            <td className="px-3 py-2 text-gray-900 dark:text-gray-100 font-semibold">Meta Ads API rate limit aşıldı<div className="lg:hidden text-[10px] font-normal text-gray-400 dark:text-gray-500 mt-0.5">Meta Integration</div></td>
            <td className="hidden lg:table-cell px-3 py-2 text-gray-500 dark:text-gray-500 text-[10px]">Meta Integration</td>
            <td className="px-3 py-2 text-right"><span className="text-[10px] font-semibold px-2 py-0.5 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 rounded whitespace-nowrap">Başarısız</span></td>
          </tr>
          <tr className="hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer">
            <td className="px-3 py-2 font-mono text-gray-500 dark:text-gray-400">07:00</td>
            <td className="px-3 py-2"><span className="text-[9px] font-bold px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded tracking-wider">ORCHESTRATE</span></td>
            <td className="px-3 py-2 text-gray-900 dark:text-gray-100 font-semibold">Yeni orchestration flow başlatıldı<div className="lg:hidden text-[10px] font-normal text-gray-400 dark:text-gray-500 mt-0.5">Orchestrator · lead_nurture</div></td>
            <td className="hidden lg:table-cell px-3 py-2 text-gray-500 dark:text-gray-500 text-[10px]">Orchestrator · lead_nurture</td>
            <td className="px-3 py-2 text-right"><span className="text-[10px] font-semibold px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded whitespace-nowrap">Başarılı</span></td>
          </tr>
          <tr className="hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer">
            <td className="px-3 py-2 font-mono text-gray-500 dark:text-gray-400">06:45</td>
            <td className="px-3 py-2"><span className="text-[9px] font-bold px-1.5 py-0.5 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded tracking-wider">JSON</span></td>
            <td className="px-3 py-2 text-gray-900 dark:text-gray-100 font-semibold">Planner_Gorev_Aktarim.JSON review gerekli<div className="lg:hidden text-[10px] font-normal text-gray-400 dark:text-gray-500 mt-0.5">Governance</div></td>
            <td className="hidden lg:table-cell px-3 py-2 text-gray-500 dark:text-gray-500 text-[10px]">Governance</td>
            <td className="px-3 py-2 text-right"><span className="text-[10px] font-semibold px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded whitespace-nowrap">Bekliyor</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
      </>
    </Layout>
  );
}
