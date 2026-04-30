import { type ReactNode, useMemo, useState } from 'react';
import Layout from '../components/Layout';

type Approval = {
  id: string;
  type: 'business' | 'system';
  kind: string;
  title: string;
  requester: string;
  reqAvatar: string;
  reqClr: string;
  amount: string;
  wait: string;
  waitScore: number;
  priority: 'urgent' | 'high' | 'normal' | 'low';
  impact: 'high' | 'medium' | 'low';
  urgency: 'high' | 'medium' | 'low';
  sla: string;
  trigger: { api: string; json: string; prompt: string; agent: string };
};

type FilterCategory = 'all' | 'urgent' | 'business' | 'system' | 'today';
type ToastState = { title: string; message: string; color: 'emerald' | 'rose' | 'amber' | 'sky' | 'violet' } | null;

const INITIAL_APPROVALS: Approval[] = [
  { id: 'a01', type: 'business', kind: 'Finans · Budget', title: 'Premium 360 için %18 iskonto onayı', requester: 'Çiğdem Alataş', reqAvatar: 'ÇA', reqClr: 'emerald', amount: '₺680K', wait: '2sa', waitScore: 2, priority: 'urgent', impact: 'high', urgency: 'high', sla: 'bugün 17:00', trigger: { api: 'POST /v1/approvals/discount/{id}/approve', json: 'Satis_Talimat.JSON#discount', prompt: 'prompt_discount_approval_v2', agent: 'ApprovalCoordinator' } },
  { id: 'a02', type: 'business', kind: 'Ads · Budget', title: 'Mayıs Google Ads bütçe artışı (acil)', requester: 'Berke Yılmaz', reqAvatar: 'BY', reqClr: 'sky', amount: '₺320K', wait: '1sa', waitScore: 1, priority: 'urgent', impact: 'high', urgency: 'high', sla: 'bugün 18:00', trigger: { api: 'POST /v1/ads/budget-increase', json: 'Google_ADS_Is_Surec.JSON', prompt: 'prompt_ads_budget_emergency_v1', agent: 'AdsAgent' } },
  { id: 'a03', type: 'system', kind: 'Sistem · Config', title: 'BigBrand Co AI token limiti artırma', requester: 'Jenny AI', reqAvatar: 'JA', reqClr: 'amber', amount: '₺12.3K', wait: '30dk', waitScore: 0.5, priority: 'urgent', impact: 'high', urgency: 'high', sla: 'bugün 19:00', trigger: { api: 'PUT /v1/ai-cost/limits/bigbrand', json: 'Maliyet_Analiz.JSON#limits', prompt: 'prompt_limit_override_v1', agent: 'CostAnalystAgent' } },
  { id: 'a04', type: 'business', kind: 'Satış · Sözleşme', title: 'İzmirgaz Premium 360 yıllık sözleşme', requester: 'Çiğdem Alataş', reqAvatar: 'ÇA', reqClr: 'emerald', amount: '₺680K', wait: '4sa', waitScore: 4, priority: 'high', impact: 'high', urgency: 'medium', sla: 'yarın 17:00', trigger: { api: 'POST /v1/contracts/sign', json: 'Satis_Talimat.JSON#contracts', prompt: 'prompt_contract_review_v2', agent: 'ContractAgent' } },
  { id: 'a05', type: 'business', kind: 'Ads · Budget', title: 'Mayıs Meta Ads bütçe revizyonu', requester: 'Berke Yılmaz', reqAvatar: 'BY', reqClr: 'sky', amount: '₺145K', wait: '4sa', waitScore: 4, priority: 'high', impact: 'high', urgency: 'medium', sla: '28 Nis', trigger: { api: 'POST /v1/ads/budget-adjust', json: 'Google_ADS_Is_Surec.JSON', prompt: 'prompt_ads_budget_v1_5', agent: 'AdsAgent' } },
  { id: 'a06', type: 'business', kind: 'HR · Bonus', title: 'Prodüksiyon ekibi Q1 performans bonusu', requester: 'Berke Yılmaz', reqAvatar: 'BY', reqClr: 'sky', amount: '₺84K', wait: '1g', waitScore: 24, priority: 'high', impact: 'high', urgency: 'medium', sla: '30 Nis', trigger: { api: 'POST /v1/hr/bonus', json: 'HR_Talimat.JSON', prompt: 'prompt_bonus_calc_v1', agent: '—' } },
  { id: 'a07', type: 'business', kind: 'Pazarlama · Budget', title: 'Q2 içerik ekibi bütçe artırımı', requester: 'Zeynep Acar', reqAvatar: 'ZA', reqClr: 'pink', amount: '₺65K', wait: '1g', waitScore: 24, priority: 'high', impact: 'high', urgency: 'medium', sla: '1 May', trigger: { api: 'POST /v1/budget/quarterly', json: 'Pazarlama_Talimat.JSON', prompt: 'prompt_q2_budget_v2', agent: '—' } },
  { id: 'a08', type: 'system', kind: 'Sistem · Orchestrator', title: 'Yeni müşteri onboarding akışı deploy', requester: 'Zeynep Acar', reqAvatar: 'ZA', reqClr: 'pink', amount: '—', wait: '2g', waitScore: 48, priority: 'high', impact: 'high', urgency: 'medium', sla: '5 May', trigger: { api: 'POST /v1/orchestrator/flows/deploy', json: 'Master.JSON#flows', prompt: 'prompt_onboarding_flow_v1', agent: 'Orchestrator' } },
  { id: 'a09', type: 'business', kind: 'Satış · İskonto', title: 'Orion Eğitim yenileme indirimi', requester: 'Çiğdem Alataş', reqAvatar: 'ÇA', reqClr: 'emerald', amount: '₺42K', wait: '5sa', waitScore: 5, priority: 'normal', impact: 'medium', urgency: 'medium', sla: '29 Nis', trigger: { api: 'POST /v1/approvals/renewal', json: 'Satis_Talimat.JSON#renewal', prompt: 'prompt_renewal_discount_v1', agent: 'ApprovalCoordinator' } },
  { id: 'a10', type: 'business', kind: 'Finans · İade', title: 'Gamma Tekstil acil iade süreci', requester: 'Ali Berksoy', reqAvatar: 'AB', reqClr: 'amber', amount: '₺28K', wait: '3sa', waitScore: 3, priority: 'normal', impact: 'medium', urgency: 'medium', sla: '27 Nis', trigger: { api: 'POST /v1/refunds', json: 'Finans_Talimat.JSON#refunds', prompt: 'prompt_refund_approval_v1', agent: 'FinanceAgent' } },
  { id: 'a11', type: 'business', kind: 'HR · İşe Alım', title: 'Junior Performance Marketing alımı', requester: 'Zeynep Acar', reqAvatar: 'ZA', reqClr: 'pink', amount: '—', wait: '2g', waitScore: 48, priority: 'normal', impact: 'medium', urgency: 'medium', sla: '3 May', trigger: { api: 'POST /v1/hr/open-position', json: 'HR_Talimat.JSON', prompt: 'prompt_job_description_v2', agent: '—' } },
  { id: 'a12', type: 'system', kind: 'Sistem · Prompt', title: 'SEO İçerik Prompt v3.2 → v3.3', requester: 'Ahmet Yılmaz', reqAvatar: 'AY', reqClr: 'violet', amount: '—', wait: '5sa', waitScore: 5, priority: 'normal', impact: 'medium', urgency: 'medium', sla: '28 Nis', trigger: { api: 'PUT /v1/prompts/seo-icerik-analiz', json: 'SEO_Icerik.JSON', prompt: 'prompt_seo_icerik_v3_3', agent: 'SeoAgent' } },
  { id: 'a13', type: 'system', kind: 'Sistem · AI Router', title: 'GPT-4 temperature 0.7 → 0.6', requester: 'AI Router', reqAvatar: 'AI', reqClr: 'indigo', amount: '—', wait: '1g', waitScore: 24, priority: 'normal', impact: 'low', urgency: 'medium', sla: '2 May', trigger: { api: 'PUT /v1/ai-router/models/gpt-4/config', json: 'AI_Router.JSON', prompt: '—', agent: 'AIRouter' } },
  { id: 'a14', type: 'system', kind: 'Sistem · Integration', title: 'Meta Ads API OAuth token yenileme', requester: 'Sistem', reqAvatar: 'SY', reqClr: 'teal', amount: '—', wait: '8sa', waitScore: 8, priority: 'normal', impact: 'low', urgency: 'medium', sla: 'yarın', trigger: { api: 'POST /v1/integrations/meta/refresh', json: 'Integrations.JSON', prompt: '—', agent: 'IntegrationHub' } },
  { id: 'a15', type: 'system', kind: 'Sistem · Cost', title: 'FastGrow günlük AI limit aşımı', requester: 'Sistem', reqAvatar: 'SY', reqClr: 'amber', amount: '₺10.5K', wait: '4sa', waitScore: 4, priority: 'normal', impact: 'low', urgency: 'medium', sla: 'bugün', trigger: { api: 'POST /v1/ai-cost/limit-override', json: 'Maliyet_Analiz.JSON', prompt: 'prompt_limit_override_v1', agent: 'CostAnalystAgent' } },
  { id: 'a16', type: 'system', kind: 'Sistem · JSON', title: 'Planner_Gorev_Aktarim.JSON review', requester: 'Berke Yılmaz', reqAvatar: 'BY', reqClr: 'sky', amount: '—', wait: '3g', waitScore: 72, priority: 'low', impact: 'low', urgency: 'low', sla: '10 May', trigger: { api: 'POST /v1/json/review', json: 'Planner_Gorev_Aktarim.JSON', prompt: '—', agent: 'Governance' } },
  { id: 'a17', type: 'system', kind: 'Sistem · Integration', title: 'LinkedIn Ads API kısa kesinti düzeltme', requester: 'Sistem', reqAvatar: 'SY', reqClr: 'teal', amount: '—', wait: '2g', waitScore: 48, priority: 'low', impact: 'low', urgency: 'low', sla: '5 May', trigger: { api: 'POST /v1/integrations/linkedin/retry', json: 'Integrations.JSON', prompt: '—', agent: 'IntegrationHub' } },
  { id: 'a18', type: 'system', kind: 'Sistem · Orchestrator', title: 'Lead-nurturing test akışı deploy', requester: 'Jenny AI', reqAvatar: 'JA', reqClr: 'amber', amount: '—', wait: '6sa', waitScore: 6, priority: 'low', impact: 'low', urgency: 'low', sla: '8 May', trigger: { api: 'POST /v1/orchestrator/flows/deploy', json: 'Lead_Nurture.JSON v0.9', prompt: 'prompt_nurture_flow_v1', agent: 'Orchestrator' } },
];

const recentDecisions = [
  { time: '14:32', action: 'approve', item: 'Google Ads kampanya', meta: 'ADS Agent · ₺120K' },
  { time: '13:58', action: 'approve', item: 'SEO Prompt v3.1 deploy', meta: 'Pazarlama · Ahmet Y.' },
  { time: '12:15', action: 'reject', item: 'Facebook Ads ekstra bütçe', meta: 'Ads · ₺80K · ROAS düşük' },
  { time: '11:45', action: 'approve', item: 'Junior Designer alımı', meta: 'Prodüksiyon · Berke Y.' },
  { time: '10:22', action: 'approve', item: 'Alpha Tekstil yıllık sözleşme', meta: 'Satış · ₺230K · Çiğdem A.' },
];

function Icon({ children, className }: { children: ReactNode; className: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      {children}
    </svg>
  );
}

export default function OnayKuyrugu() {
  const [approvals, setApprovals] = useState(INITIAL_APPROVALS);
  const [category, setCategory] = useState<FilterCategory>('all');
  const [detail, setDetail] = useState<Approval | null>(null);
  const [toast, setToast] = useState<ToastState>(null);

  const filtered = useMemo(() => {
    if (category === 'urgent') return approvals.filter((item) => item.priority === 'urgent');
    if (category === 'business') return approvals.filter((item) => item.type === 'business');
    if (category === 'system') return approvals.filter((item) => item.type === 'system');
    if (category === 'today') return approvals.filter((item) => item.waitScore <= 24);
    return approvals;
  }, [approvals, category]);

  const totals = {
    all: approvals.length,
    urgent: approvals.filter((item) => item.priority === 'urgent').length,
    business: approvals.filter((item) => item.type === 'business').length,
    system: approvals.filter((item) => item.type === 'system').length,
    today: approvals.filter((item) => item.waitScore <= 24).length,
    avgWait: approvals.length ? (approvals.reduce((sum, item) => sum + item.waitScore, 0) / approvals.length).toFixed(1) : '0.0',
  };

  const quadrants = {
    urgent: approvals.filter((item) => item.impact === 'high' && item.urgency === 'high').length,
    plan: approvals.filter((item) => item.impact === 'high' && item.urgency !== 'high').length,
    delegate: approvals.filter((item) => item.impact !== 'high' && item.urgency === 'high').length,
    observe: approvals.filter((item) => item.impact !== 'high' && item.urgency !== 'high').length,
  };

  function setApprovalsFilter(next: FilterCategory | 'plan' | 'delegate' | 'observe') {
    const map = { urgent: 'urgent', plan: 'business', delegate: 'today', observe: 'all' } as const;
    const mapped = map[next as keyof typeof map];
    setCategory((mapped ?? next) as FilterCategory);
  }

  function approveItem(item: Approval) {
    setApprovals((current) => current.filter((approval) => approval.id !== item.id));
    setDetail(null);
    setToast({ title: 'Onaylandı', message: `"${item.title}" · ${item.trigger.api} tetiklendi · audit log'a yazıldı`, color: 'emerald' });
  }

  function rejectItem(item: Approval) {
    setApprovals((current) => current.filter((approval) => approval.id !== item.id));
    setDetail(null);
    setToast({ title: 'Reddedildi', message: `"${item.title}" reddedildi · talep eden bilgilendiriliyor`, color: 'rose' });
  }

  return (
    <Layout activeId="approvals" breadcrumb="Genel Müdür · Onay Kuyruğu">
      <div className="relative">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-rose-100 dark:bg-rose-500/20 rounded-lg flex items-center justify-center">
              <Icon className="text-rose-600 dark:text-rose-400 w-4 h-4"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></Icon>
            </div>
            <div>
              <h1 className="text-[19px] font-bold text-gray-900 dark:text-gray-100 leading-tight">Onay Kuyruğu</h1>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">Yönetici kararları + ADOS sistem onayları · <span className="font-mono">Approval_Registry.JSON</span></p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={() => setToast({ title: 'Toplu Otomasyon', message: 'Düşük etki · düşük aciliyet 3 onay otomatik işlem için delege edildi', color: 'sky' })} className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-[11px] font-semibold rounded-md hover:bg-gray-50 dark:hover:bg-[#23242c] transition-colors">
              <Icon className="w-3.5 h-3.5"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></Icon>
              Otomatik Delege
            </button>
            <button onClick={() => setToast({ title: 'Raporu İndir', message: 'Onay kuyruğu raporu hazırlandı · PDF indiriliyor', color: 'emerald' })} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 dark:bg-gray-100 dark:text-gray-900 text-white text-[11px] font-semibold rounded-md hover:opacity-90 transition-opacity">
              <Icon className="w-3.5 h-3.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></Icon>
              Karar Raporu
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3 mt-5">
          <KpiCard label="Bekleyen Onay" value={String(totals.all)} sub={`${totals.business} iş · ${totals.system} sistem`} trend="+2" clr="rose" />
          <KpiCard label="Acil (SLA risk)" value={String(totals.urgent)} sub="12 saat içinde" trend="!" clr="amber" />
          <KpiCard label="İş Kararı" value={String(totals.business)} sub="Bütçe · sözleşme · HR" trend="—" clr="sky" />
          <KpiCard label="Sistem Onayı" value={String(totals.system)} sub="ADOS mimar kararı" trend="—" clr="violet" />
          <KpiCard label="Ort. Bekleme" value={`${totals.avgWait}sa`} sub="Karar süresi" trend="-0.8sa" clr="teal" />
          <KpiCard label="Bu Hafta Karar" value="42" sub="38 onay · 4 red" trend="+12" clr="emerald" />
        </div>

        <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden mt-5">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700/40 flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <Icon className="text-violet-600 dark:text-violet-400 w-4 h-4"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></Icon>
              <div>
                <h4 className="text-[13px] font-bold text-gray-900 dark:text-gray-100">Karar Önceliği Matrisi</h4>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">Eisenhower · etki × aciliyet · tıklayarak filtre uygulayın</p>
              </div>
            </div>
          </div>
          <div className="p-4">
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-8 flex items-center" style={{ width: '60px' }}>
                <span className="text-[9px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest -rotate-90 whitespace-nowrap">ETKİ</span>
              </div>
              <div className="grid grid-cols-2 gap-2 ml-14">
                <MatrixButton title="Planla" desc="Yüksek etki · Düşük aciliyet" value={quadrants.plan} sub="Takvimli karar · hafta içi inceleme" color="sky" onClick={() => setApprovalsFilter('plan')} />
                <MatrixButton title="Hemen Karar" desc="Yüksek etki · Yüksek aciliyet" value={quadrants.urgent} sub="Bugün karar verilmeli · SLA risk" color="rose" urgent onClick={() => setApprovalsFilter('urgent')} />
                <MatrixButton title="Gözlemle" desc="Düşük etki · Düşük aciliyet" value={quadrants.observe} sub="Otomatik onay · audit takibi" color="gray" onClick={() => setApprovalsFilter('observe')} />
                <MatrixButton title="Delege Et" desc="Düşük etki · Yüksek aciliyet" value={quadrants.delegate} sub="Birim yöneticisine devret · otomasyon" color="amber" onClick={() => setApprovalsFilter('delegate')} />
              </div>
              <div className="ml-14 mt-1 flex justify-between text-[9px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                <span>← Düşük Aciliyet</span>
                <span>Yüksek Aciliyet →</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden mt-5">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700/40">
            <div className="flex items-center justify-between gap-2 flex-wrap mb-3">
              <div className="flex items-center gap-2">
                <Icon className="text-rose-600 dark:text-rose-400 w-4 h-4"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></Icon>
                <div>
                  <h4 className="text-[13px] font-bold text-gray-900 dark:text-gray-100">Bekleyen Onaylar</h4>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">{filtered.length} kayıt · hover ile tetiklenen zinciri gör</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <FilterButton active={category === 'all'} onClick={() => setApprovalsFilter('all')}>Tümü ({totals.all})</FilterButton>
              <FilterButton active={category === 'urgent'} color="rose" onClick={() => setApprovalsFilter('urgent')}>Acil ({totals.urgent})</FilterButton>
              <FilterButton active={category === 'business'} color="sky" onClick={() => setApprovalsFilter('business')}>İş Kararı ({totals.business})</FilterButton>
              <FilterButton active={category === 'system'} color="violet" onClick={() => setApprovalsFilter('system')}>Sistem ({totals.system})</FilterButton>
              <FilterButton active={category === 'today'} color="amber" onClick={() => setApprovalsFilter('today')}>Bugün ({totals.today})</FilterButton>
            </div>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-gray-700/40">
            {filtered.length === 0 ? (
              <div className="p-8 text-center text-gray-400 dark:text-gray-500 text-[11px]">Filtreye uyan onay bulunamadı</div>
            ) : filtered.map((item) => (
              <ApprovalRow key={item.id} item={item} onApprove={approveItem} onReject={rejectItem} onDetail={setDetail} />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 mt-5">
          <div className="lg:col-span-3 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700/40 flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <Icon className="text-gray-600 dark:text-gray-400 w-4 h-4"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></Icon>
                <div>
                  <h4 className="text-[13px] font-bold text-gray-900 dark:text-gray-100">Son Kararlar</h4>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">Bugün · Osman Atasoy · tüm aksiyonlar audit log'da</p>
                </div>
              </div>
              <button onClick={() => setToast({ title: 'Audit Log', message: 'Tam audit log görünümü açılıyor', color: 'violet' })} className="text-[10px] font-semibold text-violet-700 dark:text-violet-400 hover:underline flex items-center gap-1">
                Tam Audit Log <Icon className="w-3 h-3"><polyline points="9 18 15 12 9 6" /></Icon>
              </button>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700/40">
              {recentDecisions.map((decision) => <DecisionRow key={`${decision.time}-${decision.item}`} decision={decision} />)}
            </div>
          </div>

          <div className="lg:col-span-2 relative overflow-hidden rounded-xl border border-amber-200/70 dark:border-amber-500/30">
            <div className="relative bg-gradient-to-br from-amber-50 via-white to-violet-50 dark:from-[#1a1530] dark:via-[#0f0820] dark:to-[#1a0e3a] p-4 h-full">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none aig"></div>
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-amber-400 via-amber-500 to-violet-600 rounded-lg flex items-center justify-center">
                    <Icon className="text-white w-4 h-4"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></Icon>
                  </div>
                  <div>
                    <h5 className="text-[12px] font-bold text-gray-900 dark:text-white">Jenny'nin Karar Yorumu</h5>
                    <p className="text-[9px] text-gray-500 dark:text-white/60"><span className="font-mono">Master.JSON#approvals</span></p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="p-2 bg-white/70 dark:bg-white/5 border border-emerald-200 dark:border-emerald-400/30 rounded-lg">
                    <p className="text-[11px] text-gray-800 dark:text-white/90"><span className="font-bold text-emerald-700 dark:text-emerald-300">✓ İyi:</span> Ort. bekleme {totals.avgWait}sa (-%16) · bu hafta 42 karar tamamlandı.</p>
                  </div>
                  <div className="p-2 bg-white/70 dark:bg-white/5 border border-rose-200 dark:border-rose-400/30 rounded-lg">
                    <p className="text-[11px] text-gray-800 dark:text-white/90"><span className="font-bold text-rose-700 dark:text-rose-300">⚠ Acil:</span> {totals.urgent} onay bugün SLA riski · ₺1M+ toplam etki.</p>
                  </div>
                  <div className="p-2 bg-white/70 dark:bg-white/5 border border-violet-200 dark:border-violet-400/30 rounded-lg">
                    <p className="text-[11px] text-gray-800 dark:text-white/90"><span className="font-bold text-violet-700 dark:text-violet-300">◆ Öneri:</span> {quadrants.delegate + quadrants.observe} düşük-etki onayı birim yöneticilerine delege edilebilir.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {detail ? <ApprovalDetailModal item={detail} onClose={() => setDetail(null)} onApprove={approveItem} onReject={rejectItem} /> : null}
        <Toast toast={toast} onClose={() => setToast(null)} />
      </div>
    </Layout>
  );
}

function KpiCard({ label, value, sub, trend, clr }: { label: string; value: string; sub: string; trend: string; clr: string }) {
  return (
    <div className="relative overflow-hidden bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-3.5 hover:shadow-sm hover:-translate-y-0.5 transition-all">
      <div className={`absolute -top-8 -right-8 w-24 h-24 bg-${clr}-500/5 rounded-full blur-xl pointer-events-none`}></div>
      <div className="relative flex items-start justify-between mb-2">
        <div className={`w-8 h-8 bg-${clr}-100 dark:bg-${clr}-900/30 rounded-lg flex items-center justify-center`}>
          <Icon className={`text-${clr}-700 dark:text-${clr}-300 w-4 h-4`}><circle cx="12" cy="12" r="10" /></Icon>
        </div>
        <span className="text-[9px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded">{trend}</span>
      </div>
      <div className="relative text-[22px] font-bold text-gray-900 dark:text-gray-50 leading-none mb-1">{value}</div>
      <div className="relative text-[11px] font-semibold text-gray-600 dark:text-gray-400 leading-tight">{label}</div>
      <div className="relative text-[9px] text-gray-400 dark:text-gray-500 mt-0.5">{sub}</div>
    </div>
  );
}

function MatrixButton({ title, desc, value, sub, color, urgent, onClick }: { title: string; desc: string; value: number; sub: string; color: string; urgent?: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`relative p-4 bg-gradient-to-br from-${color}-50 to-white dark:from-${color}-500/10 dark:to-transparent border-2 border-${color}-200 dark:border-${color}-500/30 rounded-lg text-left hover:border-${color}-400 dark:hover:border-${color}-500/50 transition-all group`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className={`text-[9px] font-bold text-${color}-700 dark:text-${color}-300 uppercase tracking-wider`}>{title}</span>
          {urgent ? <span className="text-[9px] font-bold bg-rose-600 text-white px-1.5 py-0.5 rounded tracking-wider animate-pulse">ACİL</span> : null}
        </div>
        <span className="text-[9px] text-gray-500 dark:text-gray-400">{desc}</span>
      </div>
      <p className={`text-[32px] font-black text-${color}-700 dark:text-${color}-300 leading-none`}>{value}</p>
      <p className="text-[10px] text-gray-600 dark:text-gray-400 mt-1">{sub}</p>
    </button>
  );
}

function FilterButton({ children, active, color = 'gray', onClick }: { children: ReactNode; active: boolean; color?: string; onClick: () => void }) {
  const activeClass = color === 'gray' ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 border-gray-900 dark:border-gray-100' : `bg-${color}-600 text-white border-${color}-600`;
  const inactiveClass = color === 'gray'
    ? 'bg-white dark:bg-[#17181f] text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700'
    : `bg-${color}-50 dark:bg-${color}-500/10 text-${color}-700 dark:text-${color}-300 border-${color}-200 dark:border-${color}-500/30 hover:bg-${color}-100 dark:hover:bg-${color}-500/20`;
  return <button onClick={onClick} className={`px-2.5 py-1 text-[10px] font-semibold rounded-full border ${active ? activeClass : inactiveClass} transition-colors`}>{children}</button>;
}

function ApprovalRow({ item, onApprove, onReject, onDetail }: { item: Approval; onApprove: (item: Approval) => void; onReject: (item: Approval) => void; onDetail: (item: Approval) => void }) {
  const isSystem = item.type === 'system';
  const prioClr = item.priority === 'urgent' ? 'rose' : item.priority === 'high' ? 'amber' : item.priority === 'normal' ? 'sky' : 'gray';
  const prioLbl = item.priority === 'urgent' ? 'ACİL' : item.priority === 'high' ? 'Yüksek' : item.priority === 'normal' ? 'Normal' : 'Düşük';
  return (
    <div className="relative group trigger-btn p-3.5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
      <div className="flex items-start gap-3">
        <div className="flex flex-col items-center gap-1.5 shrink-0">
          <div className={`w-9 h-9 bg-gradient-to-br from-${item.reqClr}-400 to-${item.reqClr}-600 rounded-lg flex items-center justify-center text-white text-[10px] font-bold`}>{item.reqAvatar}</div>
          {isSystem ? <span className="text-[8px] font-bold text-violet-700 dark:text-violet-300 px-1.5 py-0.5 bg-violet-100 dark:bg-violet-900/30 rounded">ADOS</span> : <span className="text-[8px] font-bold text-sky-700 dark:text-sky-300 px-1.5 py-0.5 bg-sky-100 dark:bg-sky-900/30 rounded">İŞ</span>}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-[9px] font-bold text-gray-700 dark:text-gray-300 px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">{item.kind}</span>
            {item.priority === 'urgent' ? <span className="text-[8px] font-bold bg-rose-600 text-white px-1.5 py-0.5 rounded tracking-wider animate-pulse">ACİL</span> : null}
            <span className={`text-[9px] font-semibold px-1.5 py-0.5 bg-${prioClr}-50 dark:bg-${prioClr}-900/30 text-${prioClr}-700 dark:text-${prioClr}-300 rounded`}>{prioLbl}</span>
            <span className="text-[9px] text-gray-500 dark:text-gray-400">SLA: {item.sla}</span>
          </div>
          <h5 className="text-[13px] font-bold text-gray-900 dark:text-gray-100 leading-snug">{item.title}</h5>
          <div className="flex items-center gap-2 flex-wrap mt-1 text-[10px] text-gray-500 dark:text-gray-400">
            <span>{item.requester}</span>
            <span>·</span>
            <span>{item.wait} bekliyor</span>
            {item.amount !== '—' ? <><span>·</span><span className="font-semibold text-gray-900 dark:text-gray-100">{item.amount}</span></> : null}
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={() => onApprove(item)} className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold rounded-md transition-colors">
            <Icon className="w-3 h-3"><polyline points="20 6 9 17 4 12" /></Icon>
            Onayla
          </button>
          <button onClick={() => onReject(item)} className="flex items-center gap-1 px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 text-[10px] font-bold rounded-md transition-colors">
            <Icon className="w-3 h-3"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Icon>
            Reddet
          </button>
          <button onClick={() => onDetail(item)} className="flex items-center justify-center p-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400 rounded-md transition-colors" title="Detay">
            <Icon className="w-3 h-3"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></Icon>
          </button>
        </div>
      </div>
      <TriggerPopover item={item} />
    </div>
  );
}

function TriggerPopover({ item }: { item: Approval }) {
  return (
    <div className="trigger-pop top-full right-0 mt-2 w-[280px] bg-[#0a0e1a] border border-amber-400/40 rounded-lg shadow-2xl overflow-hidden">
      <div className="p-2 bg-gradient-to-r from-amber-500/20 to-violet-500/20 border-b border-white/10 flex items-center gap-1.5">
        <Icon className="text-amber-300 w-3 h-3"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></Icon>
        <span className="text-[9px] font-bold tracking-widest text-amber-300 uppercase">Tetiklenen Zincir</span>
      </div>
      <div className="p-2.5 space-y-1.5 font-mono text-[10px]">
        <TriggerLine label="API" color="text-emerald-400" value={item.trigger.api} />
        <TriggerLine label="JSON" color="text-violet-400" value={item.trigger.json} />
        <TriggerLine label="PROMPT" color="text-sky-400" value={item.trigger.prompt} />
        <TriggerLine label="AGENT" color="text-pink-400" value={item.trigger.agent} />
      </div>
    </div>
  );
}

function TriggerLine({ label, color, value }: { label: string; color: string; value: string }) {
  return <div className="flex items-start gap-1.5"><span className={`w-12 ${color} font-bold shrink-0`}>{label}</span><span className="text-white/80 break-all">{value}</span></div>;
}

function ApprovalDetailModal({ item, onClose, onApprove, onReject }: { item: Approval; onClose: () => void; onApprove: (item: Approval) => void; onReject: (item: Approval) => void }) {
  return (
    <>
      <div className="modal-overlay absolute inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose}></div>
      <div className="modal-panel absolute inset-0 flex items-start justify-center p-4 pointer-events-none z-50">
        <div className="modal-scroll bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-xl w-full max-w-[680px] max-h-[90vh] overflow-y-auto pointer-events-auto">
          <div className="sticky top-0 z-10 bg-white dark:bg-[#1e1f26] border-b border-gray-100 dark:border-gray-700/60 p-5 flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 bg-gradient-to-br from-${item.reqClr}-400 to-${item.reqClr}-600 rounded-xl flex items-center justify-center text-white text-[14px] font-bold`}>{item.reqAvatar}</div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-[18px] font-bold text-gray-900 dark:text-gray-100">{item.title}</h2>
                  <span className="text-[9px] font-bold text-gray-700 dark:text-gray-300 px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">{item.kind}</span>
                </div>
                <p className="text-[12px] text-gray-600 dark:text-gray-400">{item.requester} · {item.wait} bekliyor · SLA: {item.sla}</p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500">ID: <span className="font-mono">{item.id}</span> · {item.type === 'system' ? 'ADOS sistem onayı' : 'Yönetici iş kararı'}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors p-1">
              <Icon className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Icon>
            </button>
          </div>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <InfoCard label="Tutar" value={item.amount} color="sky" />
              <InfoCard label="Öncelik" value={item.priority === 'urgent' ? 'ACİL' : item.priority} color="rose" />
              <InfoCard label="Etki" value={item.impact} color="violet" />
              <InfoCard label="Aciliyet" value={item.urgency} color="amber" />
            </div>
            <div className="bg-gray-50 dark:bg-[#17181f] border border-gray-200 dark:border-gray-700/40 rounded-lg p-4">
              <h3 className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Tetiklenen Zincir</h3>
              <div className="space-y-2 font-mono text-[11px]">
                <TriggerLine label="API" color="text-emerald-600 dark:text-emerald-400" value={item.trigger.api} />
                <TriggerLine label="JSON" color="text-violet-600 dark:text-violet-400" value={item.trigger.json} />
                <TriggerLine label="PROMPT" color="text-sky-600 dark:text-sky-400" value={item.trigger.prompt} />
                <TriggerLine label="AGENT" color="text-pink-600 dark:text-pink-400" value={item.trigger.agent} />
              </div>
            </div>
          </div>
          <div className="sticky bottom-0 bg-white dark:bg-[#1e1f26] border-t border-gray-100 dark:border-gray-700/60 p-4 flex items-center justify-between gap-2 flex-wrap">
            <button onClick={onClose} className="px-3 py-2 text-[11px] font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">Kapat</button>
            <div className="flex items-center gap-2">
              <button onClick={() => onReject(item)} className="px-3 py-2 text-[11px] font-semibold text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-md transition-colors">Reddet</button>
              <button onClick={() => onApprove(item)} className="px-4 py-2 text-[11px] font-semibold bg-emerald-600 text-white rounded-md hover:opacity-90 transition-opacity">Onayla</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function InfoCard({ label, value, color }: { label: string; value: string; color: string }) {
  return <div className={`p-3 bg-gradient-to-br from-${color}-50 to-transparent dark:from-${color}-500/10 border border-${color}-200 dark:border-${color}-500/30 rounded-lg`}><p className={`text-[9px] font-bold text-${color}-700 dark:text-${color}-300 uppercase tracking-wider`}>{label}</p><p className="text-[18px] font-black text-gray-900 dark:text-gray-100 leading-none mt-1">{value}</p></div>;
}

function DecisionRow({ decision }: { decision: { time: string; action: string; item: string; meta: string } }) {
  const isApprove = decision.action === 'approve';
  return (
    <div className="p-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex items-center gap-3">
      <div className={`${isApprove ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' : 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300'} w-7 h-7 rounded-lg flex items-center justify-center shrink-0`}>
        {isApprove ? <Icon className="w-3.5 h-3.5"><polyline points="20 6 9 17 4 12" /></Icon> : <Icon className="w-3.5 h-3.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Icon>}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[9px] font-mono text-gray-400 dark:text-gray-500">{decision.time}</span>
          <span className={`${isApprove ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'} text-[9px] font-bold uppercase tracking-wider`}>{isApprove ? 'Onaylandı' : 'Reddedildi'}</span>
        </div>
        <p className="text-[12px] font-semibold text-gray-900 dark:text-gray-100 truncate">{decision.item}</p>
        <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">{decision.meta}</p>
      </div>
    </div>
  );
}

function Toast({ toast, onClose }: { toast: ToastState; onClose: () => void }) {
  if (!toast) return null;
  const clrs = { emerald: { bg: '#10b981', bd: '#059669' }, rose: { bg: '#f43f5e', bd: '#e11d48' }, amber: { bg: '#f59e0b', bd: '#d97706' }, sky: { bg: '#0ea5e9', bd: '#0284c7' }, violet: { bg: '#8b5cf6', bd: '#7c3aed' } };
  const color = clrs[toast.color];
  return (
    <div style={{ position: 'absolute', bottom: '24px', right: '24px', zIndex: 9999, minWidth: '280px', maxWidth: '400px', background: 'white', borderLeft: `4px solid ${color.bd}`, borderRadius: '10px', boxShadow: '0 8px 24px rgba(0,0,0,.15)', padding: '14px 16px', animation: 'toastSlide .3s ease-out' }}>
      <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}><div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: '13px', color: color.bg, marginBottom: '2px' }}>{toast.title}</div><div style={{ fontSize: '11px', color: '#6b7280' }}>{toast.message}</div></div><button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: '16px' }}>×</button></div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, height: '2px', background: color.bg, borderRadius: '0 0 10px 10px', animation: 'toastProgress 3s linear' }}></div>
    </div>
  );
}
