import { useEffect, useMemo, useState } from 'react';
import googleAdsHtml from '../../../pages/html/ADOS_Google_ADS_Panosu_13.html?raw';

type OriginalScreen = 'dashboard' | 'clients' | 'planner' | 'performance' | 'optimization' | 'sectors' | 'agent-settings' | 'general-settings';
type RuntimeView = OriginalScreen | { kind: 'client-detail'; id: string } | { kind: 'planner-detail'; id: string };
type ToastState = { title: string; message: string; color: string } | null;

type StubElement = {
  id?: string;
  innerHTML: string;
  textContent: string;
  className: string;
  style: Record<string, string>;
  disabled: boolean;
  value: string;
  parentElement: StubElement | null;
  children: StubElement[];
  classList: {
    add: (...names: string[]) => void;
    remove: (...names: string[]) => void;
    toggle: (name: string, force?: boolean) => boolean;
    contains: (name: string) => boolean;
  };
  appendChild: (child: StubElement) => StubElement;
  remove: () => void;
  querySelector: () => StubElement;
  querySelectorAll: () => StubElement[];
  scrollTo: () => void;
};

type OriginalRuntime = {
  elements: Map<string, StubElement>;
  body: StubElement;
  windowObj: Record<string, unknown>;
  renderDashboard: () => string;
  renderClients: () => string;
  renderClientDetay: (id: string) => string;
  renderPlanner: () => string;
  renderPlannerDetay: (id: string) => string;
  renderPerformance: () => string;
  renderOptimization: () => string;
  renderSectors: () => string;
  renderAgentSettings: () => string;
  renderGeneralSettings: () => string;
  openMusteriBaglaModal?: () => void;
  openClientExcelExportModal?: () => void;
  renderMusteriBaglaStep?: () => void;
  mbSelectClient?: (id: string) => void;
  mbNextStep?: () => void;
  mbPrevStep?: () => void;
  openBenchmarkModal?: () => void;
  startBenchmarkUpdate?: () => void;
  openYeniSektorModal?: () => void;
  renderYeniSektorModal?: () => void;
  toggleAjan?: (agent: string) => void;
  sectorStepNext?: () => void;
  sectorStepPrev?: () => void;
  sektorKaydet?: () => void;
  openSektorDetayModal?: (id: string) => void;
  openKeywordHavuzuModal?: (id: string) => void;
  kopyalaKeyword?: (text: string, tip: string) => void;
  indirKeywordCSV?: (id: string) => void;
  keywordMusteriUygula?: (id: string) => void;
  confirmKeywordUygula?: (id: string) => void;
  openSablonUygulaModal?: (id: string) => void;
  confirmSablonUygula?: (id: string) => void;
  ajanDurumToggle?: (id: string) => void;
  openAjanDuzenleModal?: (id: string) => void;
  apiLimitSec?: (limit: number) => void;
  toggleTempAyar?: (key: string) => void;
  ajanAyarlariKaydet?: (id: string) => void;
  openAjanLogModal?: (id: string) => void;
  indirAjanLogCSV?: (id: string) => void;
  openGlobalAyarlarModal?: () => void;
  toggleGlobalAyar?: (key: string) => void;
  globalAyarlarKaydet?: () => void;
  panelAyarDegistir?: (key: string, val: string) => void;
  bildirimKanalToggle?: (key: string) => void;
  bildirimTurToggle?: (key: string, checked: boolean) => void;
  bildirimSiklikDegistir?: (siklik: string) => void;
  openKullaniciModal?: (id?: string) => void;
  kullaniciKaydet?: (id?: string) => void;
  kullaniciSil?: (id: string) => void;
  openEntegrasyonModal?: (id: string) => void;
  entegrasyonToggle?: (id: string) => void;
  entegrasyonTest?: (id: string) => void;
  openSistemBilgisiModal?: () => void;
  openYedekAlModal?: () => void;
  yedekBaslat?: () => void;
};

declare global {
  interface Window {
    go?: (id: string) => void;
    setClientTab?: (tab: string) => void;
    showToast?: (title: string, message: string, color?: string) => void;
    closeModal?: () => void;
    openMusteriBaglaModal?: () => void;
    openClientExcelExportModal?: () => void;
    mbSelectClient?: (id: string) => void;
    mbNextStep?: () => void;
    mbPrevStep?: () => void;
    setOptFilter?: (filter: string) => void;
    optOnayla?: (id: string) => void;
    optReddet?: (id: string) => void;
    optDetayAc?: (id: string) => void;
    optTopluOnay?: () => void;
    setSectorFilter?: (filter: string) => void;
    openBenchmarkModal?: () => void;
    startBenchmarkUpdate?: () => void;
    openYeniSektorModal?: () => void;
    renderYeniSektorModal?: () => void;
    toggleAjan?: (agent: string) => void;
    sectorStepNext?: () => void;
    sectorStepPrev?: () => void;
    sektorKaydet?: () => void;
    openSektorDetayModal?: (id: string) => void;
    openKeywordHavuzuModal?: (id: string) => void;
    kopyalaKeyword?: (text: string, tip: string) => void;
    indirKeywordCSV?: (id: string) => void;
    keywordMusteriUygula?: (id: string) => void;
    confirmKeywordUygula?: (id: string) => void;
    openSablonUygulaModal?: (id: string) => void;
    confirmSablonUygula?: (id: string) => void;
    ajanDurumToggle?: (id: string) => void;
    openAjanDuzenleModal?: (id: string) => void;
    apiLimitSec?: (limit: number) => void;
    toggleTempAyar?: (key: string) => void;
    ajanAyarlariKaydet?: (id: string) => void;
    openAjanLogModal?: (id: string) => void;
    indirAjanLogCSV?: (id: string) => void;
    openGlobalAyarlarModal?: () => void;
    toggleGlobalAyar?: (key: string) => void;
    globalAyarlarKaydet?: () => void;
    panelAyarDegistir?: (key: string, val: string) => void;
    bildirimKanalToggle?: (key: string) => void;
    bildirimTurToggle?: (key: string, checked: boolean) => void;
    bildirimSiklikDegistir?: (siklik: string) => void;
    openKullaniciModal?: (id?: string) => void;
    kullaniciKaydet?: (id?: string) => void;
    kullaniciSil?: (id: string) => void;
    openEntegrasyonModal?: (id: string) => void;
    entegrasyonToggle?: (id: string) => void;
    entegrasyonTest?: (id: string) => void;
    openSistemBilgisiModal?: () => void;
    openYedekAlModal?: () => void;
    yedekBaslat?: () => void;
    render?: (id: string) => void;
    NEW_SECTOR_DATA?: unknown;
    NEW_SECTOR_STEP?: number;
  }
}

const CLIENT_TABS = ['ozet', 'kampanyalar', 'keywords', 'negatifler', 'raporlar', 'ajanlog'];

function makeStubElement(id?: string): StubElement {
  const classes = new Set<string>();
  let element: StubElement;

  element = {
    id,
    innerHTML: '',
    textContent: '',
    className: '',
    style: {},
    disabled: false,
    value: '',
    parentElement: null,
    children: [],
    classList: {
      add: (...names: string[]) => names.forEach((name) => classes.add(name)),
      remove: (...names: string[]) => names.forEach((name) => classes.delete(name)),
      toggle: (name: string, force?: boolean) => {
        const next = force ?? !classes.has(name);
        if (next) classes.add(name);
        else classes.delete(name);
        return next;
      },
      contains: (name: string) => classes.has(name),
    },
    appendChild: (child: StubElement) => {
      child.parentElement = element as StubElement;
      element.children.push(child);
      return child;
    },
    remove: () => {
      if (!element.parentElement) return;
      element.parentElement.children = element.parentElement.children.filter((child) => child !== element);
      element.parentElement = null;
    },
    querySelector: () => makeStubElement(),
    querySelectorAll: () => [],
    scrollTo: () => undefined,
  };

  return element;
}

function createOriginalRuntime(): OriginalRuntime {
  const scripts = Array.from(googleAdsHtml.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)).map((match) => match[1]);
  const appScript = scripts[scripts.length - 1];
  const elements = new Map<string, StubElement>();
  const bodyElement = makeStubElement('body');

  const getElement = (id: string) => {
    if (!elements.has(id)) elements.set(id, makeStubElement(id));
    return elements.get(id) as StubElement;
  };

  const documentStub = {
    documentElement: makeStubElement('html'),
    body: bodyElement,
    getElementById: getElement,
    querySelector: (selector?: string) => {
      if (selector === '.modal-overlay') {
        return bodyElement.children.find((child) => child.className.includes('modal-overlay')) ?? null;
      }
      return null;
    },
    querySelectorAll: () => [],
    createElement: () => makeStubElement(),
  };

  const windowObj: Record<string, unknown> = {
    innerWidth: 1280,
    CLIENT_TAB: 'ozet',
  };

  const factory = new Function(
    'window',
    'document',
    'setTimeout',
    'clearTimeout',
    'setInterval',
    'clearInterval',
    `${appScript}
    return {
      renderDashboard,
      renderClients,
      renderClientDetay,
      renderPlanner,
      renderPlannerDetay,
      renderPerformance,
      renderOptimization,
      renderSectors,
      renderAgentSettings,
      renderGeneralSettings,
      openMusteriBaglaModal: typeof openMusteriBaglaModal === 'function' ? openMusteriBaglaModal : undefined,
      openClientExcelExportModal: typeof openClientExcelExportModal === 'function' ? openClientExcelExportModal : undefined,
      renderMusteriBaglaStep: typeof renderMusteriBaglaStep === 'function' ? renderMusteriBaglaStep : undefined,
      mbSelectClient: typeof mbSelectClient === 'function' ? mbSelectClient : undefined,
      mbNextStep: typeof mbNextStep === 'function' ? mbNextStep : undefined,
      mbPrevStep: typeof mbPrevStep === 'function' ? mbPrevStep : undefined,
      openBenchmarkModal: typeof openBenchmarkModal === 'function' ? openBenchmarkModal : undefined,
      startBenchmarkUpdate: typeof startBenchmarkUpdate === 'function' ? startBenchmarkUpdate : undefined,
      openYeniSektorModal: typeof openYeniSektorModal === 'function' ? openYeniSektorModal : undefined,
      renderYeniSektorModal: typeof renderYeniSektorModal === 'function' ? renderYeniSektorModal : undefined,
      toggleAjan: typeof toggleAjan === 'function' ? toggleAjan : undefined,
      sectorStepNext: typeof sectorStepNext === 'function' ? sectorStepNext : undefined,
      sectorStepPrev: typeof sectorStepPrev === 'function' ? sectorStepPrev : undefined,
      sektorKaydet: typeof sektorKaydet === 'function' ? sektorKaydet : undefined,
      openSektorDetayModal: typeof openSektorDetayModal === 'function' ? openSektorDetayModal : undefined,
      openKeywordHavuzuModal: typeof openKeywordHavuzuModal === 'function' ? openKeywordHavuzuModal : undefined,
      kopyalaKeyword: typeof kopyalaKeyword === 'function' ? kopyalaKeyword : undefined,
      indirKeywordCSV: typeof indirKeywordCSV === 'function' ? indirKeywordCSV : undefined,
      keywordMusteriUygula: typeof keywordMusteriUygula === 'function' ? keywordMusteriUygula : undefined,
      confirmKeywordUygula: typeof confirmKeywordUygula === 'function' ? confirmKeywordUygula : undefined,
      openSablonUygulaModal: typeof openSablonUygulaModal === 'function' ? openSablonUygulaModal : undefined,
      confirmSablonUygula: typeof confirmSablonUygula === 'function' ? confirmSablonUygula : undefined,
      ajanDurumToggle: typeof ajanDurumToggle === 'function' ? ajanDurumToggle : undefined,
      openAjanDuzenleModal: typeof openAjanDuzenleModal === 'function' ? openAjanDuzenleModal : undefined,
      apiLimitSec: typeof apiLimitSec === 'function' ? apiLimitSec : undefined,
      toggleTempAyar: typeof toggleTempAyar === 'function' ? toggleTempAyar : undefined,
      ajanAyarlariKaydet: typeof ajanAyarlariKaydet === 'function' ? ajanAyarlariKaydet : undefined,
      openAjanLogModal: typeof openAjanLogModal === 'function' ? openAjanLogModal : undefined,
      indirAjanLogCSV: typeof indirAjanLogCSV === 'function' ? indirAjanLogCSV : undefined,
      openGlobalAyarlarModal: typeof openGlobalAyarlarModal === 'function' ? openGlobalAyarlarModal : undefined,
      toggleGlobalAyar: typeof toggleGlobalAyar === 'function' ? toggleGlobalAyar : undefined,
      globalAyarlarKaydet: typeof globalAyarlarKaydet === 'function' ? globalAyarlarKaydet : undefined,
      panelAyarDegistir: typeof panelAyarDegistir === 'function' ? panelAyarDegistir : undefined,
      bildirimKanalToggle: typeof bildirimKanalToggle === 'function' ? bildirimKanalToggle : undefined,
      bildirimTurToggle: typeof bildirimTurToggle === 'function' ? bildirimTurToggle : undefined,
      bildirimSiklikDegistir: typeof bildirimSiklikDegistir === 'function' ? bildirimSiklikDegistir : undefined,
      openKullaniciModal: typeof openKullaniciModal === 'function' ? openKullaniciModal : undefined,
      kullaniciKaydet: typeof kullaniciKaydet === 'function' ? kullaniciKaydet : undefined,
      kullaniciSil: typeof kullaniciSil === 'function' ? kullaniciSil : undefined,
      openEntegrasyonModal: typeof openEntegrasyonModal === 'function' ? openEntegrasyonModal : undefined,
      entegrasyonToggle: typeof entegrasyonToggle === 'function' ? entegrasyonToggle : undefined,
      entegrasyonTest: typeof entegrasyonTest === 'function' ? entegrasyonTest : undefined,
      openSistemBilgisiModal: typeof openSistemBilgisiModal === 'function' ? openSistemBilgisiModal : undefined,
      openYedekAlModal: typeof openYedekAlModal === 'function' ? openYedekAlModal : undefined,
      yedekBaslat: typeof yedekBaslat === 'function' ? yedekBaslat : undefined
    };`,
  );

  const exportedRuntime = factory(
    windowObj,
    documentStub,
    () => 0,
    () => undefined,
    () => 0,
    () => undefined,
  ) as Omit<OriginalRuntime, 'elements' | 'windowObj'>;

  return {
    ...exportedRuntime,
    elements,
    body: bodyElement,
    windowObj,
  };
}

function normalizeModalHtml(html: string) {
  return html
    .replace(/fixed inset-0/g, 'absolute inset-0')
    .replace(/z-50/g, 'z-[70]')
    .replace(/max-h-\[94vh\]/g, 'max-h-[88vh]');
}

function toastClasses(color: string) {
  const colors: Record<string, string> = {
    emerald: 'border-emerald-600 text-emerald-600',
    rose: 'border-rose-600 text-rose-600',
    amber: 'border-amber-600 text-amber-600',
    sky: 'border-sky-600 text-sky-600',
    violet: 'border-violet-600 text-violet-600',
  };

  return colors[color] ?? colors.emerald;
}

export default function OriginalGoogleAdsScreen({ initialScreen }: { initialScreen: OriginalScreen }) {
  const runtime = useMemo(() => createOriginalRuntime(), []);
  const [view, setView] = useState<RuntimeView>(initialScreen);
  const [clientTab, setClientTabState] = useState('ozet');
  const [modalHtml, setModalHtml] = useState('');
  const [toast, setToast] = useState<ToastState>(null);
  const [version, setVersion] = useState(0);

  const refreshRuntimeModal = () => {
    const modalRoot = runtime.elements.get('modalRoot');
    if (modalRoot?.innerHTML) {
      setModalHtml(normalizeModalHtml(modalRoot.innerHTML));
      return;
    }

    const bodyModal = [...runtime.body.children].reverse().find((child) => child.className.includes('modal-overlay'));
    setModalHtml(bodyModal ? normalizeModalHtml(`<div class="${bodyModal.className}">${bodyModal.innerHTML}</div>`) : '');
  };

  useEffect(() => {
    const previous = {
      go: window.go,
      setClientTab: window.setClientTab,
      showToast: window.showToast,
      closeModal: window.closeModal,
      openMusteriBaglaModal: window.openMusteriBaglaModal,
      openClientExcelExportModal: window.openClientExcelExportModal,
      mbSelectClient: window.mbSelectClient,
      mbNextStep: window.mbNextStep,
      mbPrevStep: window.mbPrevStep,
      setOptFilter: window.setOptFilter,
      optOnayla: window.optOnayla,
      optReddet: window.optReddet,
      optDetayAc: window.optDetayAc,
      optTopluOnay: window.optTopluOnay,
      setSectorFilter: window.setSectorFilter,
      openBenchmarkModal: window.openBenchmarkModal,
      startBenchmarkUpdate: window.startBenchmarkUpdate,
      openYeniSektorModal: window.openYeniSektorModal,
      renderYeniSektorModal: window.renderYeniSektorModal,
      toggleAjan: window.toggleAjan,
      sectorStepNext: window.sectorStepNext,
      sectorStepPrev: window.sectorStepPrev,
      sektorKaydet: window.sektorKaydet,
      openSektorDetayModal: window.openSektorDetayModal,
      openKeywordHavuzuModal: window.openKeywordHavuzuModal,
      kopyalaKeyword: window.kopyalaKeyword,
      indirKeywordCSV: window.indirKeywordCSV,
      keywordMusteriUygula: window.keywordMusteriUygula,
      confirmKeywordUygula: window.confirmKeywordUygula,
      openSablonUygulaModal: window.openSablonUygulaModal,
      confirmSablonUygula: window.confirmSablonUygula,
      ajanDurumToggle: window.ajanDurumToggle,
      openAjanDuzenleModal: window.openAjanDuzenleModal,
      apiLimitSec: window.apiLimitSec,
      toggleTempAyar: window.toggleTempAyar,
      ajanAyarlariKaydet: window.ajanAyarlariKaydet,
      openAjanLogModal: window.openAjanLogModal,
      indirAjanLogCSV: window.indirAjanLogCSV,
      openGlobalAyarlarModal: window.openGlobalAyarlarModal,
      toggleGlobalAyar: window.toggleGlobalAyar,
      globalAyarlarKaydet: window.globalAyarlarKaydet,
      panelAyarDegistir: window.panelAyarDegistir,
      bildirimKanalToggle: window.bildirimKanalToggle,
      bildirimTurToggle: window.bildirimTurToggle,
      bildirimSiklikDegistir: window.bildirimSiklikDegistir,
      openKullaniciModal: window.openKullaniciModal,
      kullaniciKaydet: window.kullaniciKaydet,
      kullaniciSil: window.kullaniciSil,
      openEntegrasyonModal: window.openEntegrasyonModal,
      entegrasyonToggle: window.entegrasyonToggle,
      entegrasyonTest: window.entegrasyonTest,
      openSistemBilgisiModal: window.openSistemBilgisiModal,
      openYedekAlModal: window.openYedekAlModal,
      yedekBaslat: window.yedekBaslat,
      render: window.render,
      NEW_SECTOR_DATA: window.NEW_SECTOR_DATA,
      NEW_SECTOR_STEP: window.NEW_SECTOR_STEP,
    };

    const clearRuntimeBodyModals = () => {
      runtime.body.children = runtime.body.children.filter((child) => !child.className.includes('modal-overlay'));
    };

    const syncSectorWizardFromRuntime = () => {
      window.NEW_SECTOR_DATA = runtime.windowObj.NEW_SECTOR_DATA;
      window.NEW_SECTOR_STEP = runtime.windowObj.NEW_SECTOR_STEP as number | undefined;
    };

    const syncSectorWizardToRuntime = () => {
      if (window.NEW_SECTOR_DATA) runtime.windowObj.NEW_SECTOR_DATA = window.NEW_SECTOR_DATA;
      if (window.NEW_SECTOR_STEP) runtime.windowObj.NEW_SECTOR_STEP = window.NEW_SECTOR_STEP;
    };

    const openRuntimeModal = (openFn?: () => void) => {
      clearRuntimeBodyModals();
      openFn?.();
      syncSectorWizardFromRuntime();
      refreshRuntimeModal();
    };

    window.go = (id: string) => {
      setModalHtml('');
      if (id === 'command') setView('dashboard');
      else if (id === 'clients') setView('clients');
      else if (id === 'planner') setView('planner');
      else if (id === 'performance') setView('performance');
      else if (id === 'optimization') setView('optimization');
      else if (id === 'sectors') setView('sectors');
      else if (id === 'agent-settings') setView('agent-settings');
      else if (id === 'general-settings') setView('general-settings');
      else if (id.startsWith('client-detay/')) {
        const [, clientId] = id.split('/');
        runtime.windowObj.CLIENT_TAB = 'ozet';
        setClientTabState('ozet');
        setView({ kind: 'client-detail', id: clientId });
      } else if (id.startsWith('planner-detay/')) {
        const [, taskId] = id.split('/');
        setView({ kind: 'planner-detail', id: taskId });
      } else {
        setToast({ title: 'Google Ads', message: `${id} ekranı sıradaki adımda bağlanacak`, color: 'sky' });
      }
    };

    window.setClientTab = (tab: string) => {
      const nextTab = CLIENT_TABS.includes(tab) ? tab : 'ozet';
      runtime.windowObj.CLIENT_TAB = nextTab;
      setClientTabState(nextTab);
    };

    window.showToast = (title: string, message: string, color = 'emerald') => {
      setToast({ title, message, color });
      window.setTimeout(() => setToast(null), 3000);
    };

    window.closeModal = () => {
      const modalRoot = runtime.elements.get('modalRoot');
      if (modalRoot) modalRoot.innerHTML = '';
      clearRuntimeBodyModals();
      setModalHtml('');
    };

    window.openMusteriBaglaModal = () => {
      runtime.openMusteriBaglaModal?.();
      refreshRuntimeModal();
    };

    window.openClientExcelExportModal = () => {
      runtime.openClientExcelExportModal?.();
      refreshRuntimeModal();
    };

    window.mbSelectClient = (id: string) => {
      runtime.mbSelectClient?.(id);
      refreshRuntimeModal();
    };

    window.mbNextStep = () => {
      runtime.mbNextStep?.();
      refreshRuntimeModal();
    };

    window.mbPrevStep = () => {
      runtime.mbPrevStep?.();
      refreshRuntimeModal();
    };

    window.setOptFilter = (filter: string) => {
      runtime.windowObj.OPT_FILTER = filter;
      setVersion((current) => current + 1);
    };

    window.optOnayla = (id: string) => {
      const optimizations = runtime.windowObj.ADS_OPTIMIZATIONS as Array<{ id: string; durum: string; baslik: string }> | undefined;
      const item = optimizations?.find((optimization) => optimization.id === id);
      if (!item) return;
      item.durum = 'onaylandi';
      setToast({ title: '✓ Onaylandı · API Push', message: `${item.id} · ${item.baslik} · Google Ads’e gönderildi`, color: 'emerald' });
      setVersion((current) => current + 1);
    };

    window.optReddet = (id: string) => {
      const optimizations = runtime.windowObj.ADS_OPTIMIZATIONS as Array<{ id: string; durum: string }> | undefined;
      const item = optimizations?.find((optimization) => optimization.id === id);
      if (!item) return;
      item.durum = 'reddedildi';
      setToast({ title: 'Reddedildi', message: `${item.id} reddedildi · ajan bu kalıbı öğrenecek`, color: 'amber' });
      setVersion((current) => current + 1);
    };

    window.optDetayAc = (id: string) => {
      setToast({ title: 'Detay Modal', message: `${id} detayı açılıyor · tam analiz, grafik, geçmiş`, color: 'violet' });
    };

    window.optTopluOnay = () => {
      const optimizations = runtime.windowObj.ADS_OPTIMIZATIONS as Array<{ durum: string; guvenSkoru: number }> | undefined;
      const highTrust = optimizations?.filter((optimization) => optimization.durum === 'bekliyor' && optimization.guvenSkoru >= 85) ?? [];
      if (highTrust.length === 0) {
        setToast({ title: 'Toplu Onay', message: 'Yüksek güvenli öneri yok', color: 'amber' });
        return;
      }
      highTrust.forEach((optimization) => {
        optimization.durum = 'onaylandi';
      });
      setToast({ title: `✓ ${highTrust.length} Öneri Onaylandı`, message: '%85+ güvenli öneriler toplu onaylandı · Google Ads’e push ediliyor', color: 'emerald' });
      setVersion((current) => current + 1);
    };

    window.render = (id: string) => {
      if (id === 'sectors') setView('sectors');
      if (id === 'agent-settings') setView('agent-settings');
      if (id === 'general-settings') setView('general-settings');
      setVersion((current) => current + 1);
      refreshRuntimeModal();
    };

    window.setSectorFilter = (filter: string) => {
      runtime.windowObj.SECTOR_FILTER = filter;
      setVersion((current) => current + 1);
    };

    window.openBenchmarkModal = () => openRuntimeModal(runtime.openBenchmarkModal);

    window.startBenchmarkUpdate = () => {
      runtime.startBenchmarkUpdate?.();
      refreshRuntimeModal();
      setToast({ title: 'Benchmark GÃ¼ncelleme', message: 'SektÃ¶r benchmark senkronizasyonu baÅŸlatÄ±ldÄ±', color: 'sky' });
    };

    window.openYeniSektorModal = () => openRuntimeModal(runtime.openYeniSektorModal);

    window.renderYeniSektorModal = () => {
      syncSectorWizardToRuntime();
      openRuntimeModal(runtime.renderYeniSektorModal);
    };

    window.toggleAjan = (agent: string) => {
      syncSectorWizardToRuntime();
      runtime.toggleAjan?.(agent);
      syncSectorWizardFromRuntime();
      refreshRuntimeModal();
    };

    window.sectorStepNext = () => {
      syncSectorWizardToRuntime();
      runtime.sectorStepNext?.();
      syncSectorWizardFromRuntime();
      refreshRuntimeModal();
    };

    window.sectorStepPrev = () => {
      syncSectorWizardToRuntime();
      runtime.sectorStepPrev?.();
      syncSectorWizardFromRuntime();
      refreshRuntimeModal();
    };

    window.sektorKaydet = () => {
      syncSectorWizardToRuntime();
      runtime.sektorKaydet?.();
      syncSectorWizardFromRuntime();
      refreshRuntimeModal();
      setToast({ title: 'SektÃ¶r Kaydedildi', message: 'Yeni sektÃ¶r ÅŸablonu ADOS kÃ¼tÃ¼phanesine eklendi', color: 'emerald' });
      setVersion((current) => current + 1);
    };

    window.openSektorDetayModal = (id: string) => openRuntimeModal(() => runtime.openSektorDetayModal?.(id));
    window.openKeywordHavuzuModal = (id: string) => openRuntimeModal(() => runtime.openKeywordHavuzuModal?.(id));

    window.kopyalaKeyword = (text: string, tip: string) => {
      runtime.kopyalaKeyword?.(text, tip);
      setToast({ title: 'KopyalandÄ±', message: `${tip} keyword listesi panoya kopyalandÄ±`, color: 'emerald' });
    };

    window.indirKeywordCSV = (id: string) => {
      setToast({ title: 'CSV Ä°ndir', message: `${id} keyword havuzu hazÄ±rlanÄ±yor`, color: 'emerald' });
    };

    window.keywordMusteriUygula = (id: string) => openRuntimeModal(() => runtime.keywordMusteriUygula?.(id));

    window.confirmKeywordUygula = (id: string) => {
      runtime.confirmKeywordUygula?.(id);
      clearRuntimeBodyModals();
      setModalHtml('');
      setToast({ title: 'UygulandÄ±', message: `${id} keyword havuzu seÃ§ili mÃ¼ÅŸterilere uygulanmak Ã¼zere hazÄ±rlandÄ±`, color: 'emerald' });
    };

    window.openSablonUygulaModal = (id: string) => openRuntimeModal(() => runtime.openSablonUygulaModal?.(id));

    window.confirmSablonUygula = (id: string) => {
      clearRuntimeBodyModals();
      setModalHtml('');
      setToast({ title: 'Åablon UygulandÄ±', message: `${id} sektÃ¶r ÅŸablonu uygulanmak Ã¼zere hazÄ±rlandÄ±`, color: 'emerald' });
      setVersion((current) => current + 1);
    };

    window.ajanDurumToggle = (id: string) => {
      runtime.ajanDurumToggle?.(id);
      clearRuntimeBodyModals();
      setModalHtml('');
      setToast({ title: 'Ajan Durumu GÃ¼ncellendi', message: `${id} durum dÃ¶ngÃ¼sÃ¼ uygulandÄ±`, color: 'violet' });
      setView('agent-settings');
      setVersion((current) => current + 1);
    };

    window.openAjanDuzenleModal = (id: string) => {
      runtime.windowObj.ACTIVE_AGENT_MODAL_ID = id;
      openRuntimeModal(() => runtime.openAjanDuzenleModal?.(id));
    };

    window.apiLimitSec = (limit: number) => {
      const agents = runtime.windowObj.ADS_AGENTS as Array<{ id: string; ayarlar: { apiHizLimiti: number } }> | undefined;
      const activeAgentId = runtime.windowObj.ACTIVE_AGENT_MODAL_ID as string | undefined;
      const agent = agents?.find((item) => item.id === activeAgentId);
      if (agent) agent.ayarlar.apiHizLimiti = limit;
      openRuntimeModal(() => (activeAgentId ? runtime.openAjanDuzenleModal?.(activeAgentId) : undefined));
    };

    window.toggleTempAyar = (key: string) => {
      const agents = runtime.windowObj.ADS_AGENTS as Array<{ id: string; ayarlar: { otomatikOptimize: boolean } }> | undefined;
      const activeAgentId = runtime.windowObj.ACTIVE_AGENT_MODAL_ID as string | undefined;
      const agent = agents?.find((item) => item.id === activeAgentId);
      if (key === 'otoOpt' && agent) agent.ayarlar.otomatikOptimize = !agent.ayarlar.otomatikOptimize;
      openRuntimeModal(() => (activeAgentId ? runtime.openAjanDuzenleModal?.(activeAgentId) : undefined));
    };

    window.ajanAyarlariKaydet = (id: string) => {
      clearRuntimeBodyModals();
      setModalHtml('');
      setToast({ title: 'Ayarlar Kaydedildi', message: `${id} ajan ayarlarÄ± gÃ¼ncellendi`, color: 'emerald' });
      setView('agent-settings');
      setVersion((current) => current + 1);
    };

    window.openAjanLogModal = (id: string) => openRuntimeModal(() => runtime.openAjanLogModal?.(id));

    window.indirAjanLogCSV = (id: string) => {
      setToast({ title: 'CSV Ä°ndir', message: `${id} ajan logu hazÄ±rlanÄ±yor`, color: 'emerald' });
    };

    window.openGlobalAyarlarModal = () => openRuntimeModal(runtime.openGlobalAyarlarModal);

    window.toggleGlobalAyar = (key: string) => {
      const globalSettings = runtime.windowObj.ADS_AGENT_GLOBAL as Record<string, boolean> | undefined;
      if (globalSettings && key in globalSettings) globalSettings[key] = !globalSettings[key];
      openRuntimeModal(runtime.openGlobalAyarlarModal);
    };

    window.globalAyarlarKaydet = () => {
      clearRuntimeBodyModals();
      setModalHtml('');
      setToast({ title: 'Global Ayarlar Kaydedildi', message: 'Ajan sistem kurallarÄ± gÃ¼ncellendi', color: 'emerald' });
      setView('agent-settings');
      setVersion((current) => current + 1);
    };

    window.panelAyarDegistir = (key: string, val: string) => {
      const settings = runtime.windowObj.ADS_SETTINGS as { panel?: Record<string, string> } | undefined;
      if (settings?.panel) settings.panel[key] = val;
      setToast({ title: 'Panel AyarÄ± GÃ¼ncellendi', message: `${key}: ${val}`, color: 'violet' });
      setView('general-settings');
      setVersion((current) => current + 1);
    };

    window.bildirimKanalToggle = (key: string) => {
      const settings = runtime.windowObj.ADS_SETTINGS as { bildirimler?: Record<string, boolean | string | Record<string, boolean>> } | undefined;
      if (settings?.bildirimler && typeof settings.bildirimler[key] === 'boolean') {
        settings.bildirimler[key] = !settings.bildirimler[key];
      }
      setToast({ title: 'Bildirim KanalÄ±', message: `${key} gÃ¼ncellendi`, color: 'sky' });
      setVersion((current) => current + 1);
    };

    window.bildirimTurToggle = (key: string, checked: boolean) => {
      const settings = runtime.windowObj.ADS_SETTINGS as { bildirimler?: { turler?: Record<string, boolean> } } | undefined;
      if (settings?.bildirimler?.turler) settings.bildirimler.turler[key] = checked;
      setToast({ title: 'Bildirim TÃ¼rÃ¼', message: `${key} ${checked ? 'aÃ§Ä±ldÄ±' : 'kapatÄ±ldÄ±'}`, color: checked ? 'emerald' : 'amber' });
      setVersion((current) => current + 1);
    };

    window.bildirimSiklikDegistir = (siklik: string) => {
      const settings = runtime.windowObj.ADS_SETTINGS as { bildirimler?: { siklik?: string } } | undefined;
      if (settings?.bildirimler) settings.bildirimler.siklik = siklik;
      setToast({ title: 'Bildirim SÄ±klÄ±ÄŸÄ±', message: `${siklik} olarak ayarlandÄ±`, color: 'sky' });
      setVersion((current) => current + 1);
    };

    window.openKullaniciModal = (id?: string) => openRuntimeModal(() => runtime.openKullaniciModal?.(id));

    window.kullaniciKaydet = (id?: string) => {
      runtime.kullaniciKaydet?.(id);
      clearRuntimeBodyModals();
      setModalHtml('');
      setToast({ title: id ? 'KullanÄ±cÄ± GÃ¼ncellendi' : 'Davet GÃ¶nderildi', message: 'KullanÄ±cÄ± ayarlarÄ± kaydedildi', color: 'emerald' });
      setView('general-settings');
      setVersion((current) => current + 1);
    };

    window.kullaniciSil = (id: string) => {
      const users = runtime.windowObj.ADS_USERS as Array<{ id: string; rol: string; ad: string }> | undefined;
      const user = users?.find((item) => item.id === id);
      if (user?.rol === 'Owner') {
        setToast({ title: 'Ä°zin Yok', message: 'Owner silinemez', color: 'rose' });
        return;
      }
      if (users && user) runtime.windowObj.ADS_USERS = users.filter((item) => item.id !== id);
      clearRuntimeBodyModals();
      setModalHtml('');
      setToast({ title: 'KullanÄ±cÄ± Silindi', message: `${user?.ad ?? id} kaldÄ±rÄ±ldÄ±`, color: 'amber' });
      setView('general-settings');
      setVersion((current) => current + 1);
    };

    window.openEntegrasyonModal = (id: string) => openRuntimeModal(() => runtime.openEntegrasyonModal?.(id));

    window.entegrasyonToggle = (id: string) => {
      const integrations = runtime.windowObj.ADS_INTEGRATIONS as Array<{ id: string; ad: string; durum: string; bagTarih?: string | null; hesap?: string | null }> | undefined;
      const integration = integrations?.find((item) => item.id === id);
      if (integration) {
        const nextConnected = integration.durum !== 'bagli';
        integration.durum = nextConnected ? 'bagli' : 'bagli_degil';
        integration.bagTarih = nextConnected ? '2026-04-24' : null;
        integration.hesap = nextConnected ? `${integration.id.toLowerCase()}-oauth` : null;
      }
      clearRuntimeBodyModals();
      setModalHtml('');
      setToast({ title: 'Entegrasyon GÃ¼ncellendi', message: `${integration?.ad ?? id} durumu deÄŸiÅŸtirildi`, color: 'emerald' });
      setView('general-settings');
      setVersion((current) => current + 1);
    };

    window.entegrasyonTest = (id: string) => {
      setToast({ title: 'Test BaÅŸarÄ±lÄ±', message: `${id} baÄŸlantÄ±sÄ± Ã§alÄ±ÅŸÄ±yor`, color: 'emerald' });
    };

    window.openSistemBilgisiModal = () => openRuntimeModal(runtime.openSistemBilgisiModal);
    window.openYedekAlModal = () => openRuntimeModal(runtime.openYedekAlModal);

    window.yedekBaslat = () => {
      runtime.yedekBaslat?.();
      refreshRuntimeModal();
      setToast({ title: 'Yedekleme BaÅŸladÄ±', message: 'Manuel yedekleme iÅŸlemi baÅŸlatÄ±ldÄ±', color: 'emerald' });
    };

    return () => {
      window.go = previous.go;
      window.setClientTab = previous.setClientTab;
      window.showToast = previous.showToast;
      window.closeModal = previous.closeModal;
      window.openMusteriBaglaModal = previous.openMusteriBaglaModal;
      window.openClientExcelExportModal = previous.openClientExcelExportModal;
      window.mbSelectClient = previous.mbSelectClient;
      window.mbNextStep = previous.mbNextStep;
      window.mbPrevStep = previous.mbPrevStep;
      window.setOptFilter = previous.setOptFilter;
      window.optOnayla = previous.optOnayla;
      window.optReddet = previous.optReddet;
      window.optDetayAc = previous.optDetayAc;
      window.optTopluOnay = previous.optTopluOnay;
      window.setSectorFilter = previous.setSectorFilter;
      window.openBenchmarkModal = previous.openBenchmarkModal;
      window.startBenchmarkUpdate = previous.startBenchmarkUpdate;
      window.openYeniSektorModal = previous.openYeniSektorModal;
      window.renderYeniSektorModal = previous.renderYeniSektorModal;
      window.toggleAjan = previous.toggleAjan;
      window.sectorStepNext = previous.sectorStepNext;
      window.sectorStepPrev = previous.sectorStepPrev;
      window.sektorKaydet = previous.sektorKaydet;
      window.openSektorDetayModal = previous.openSektorDetayModal;
      window.openKeywordHavuzuModal = previous.openKeywordHavuzuModal;
      window.kopyalaKeyword = previous.kopyalaKeyword;
      window.indirKeywordCSV = previous.indirKeywordCSV;
      window.keywordMusteriUygula = previous.keywordMusteriUygula;
      window.confirmKeywordUygula = previous.confirmKeywordUygula;
      window.openSablonUygulaModal = previous.openSablonUygulaModal;
      window.confirmSablonUygula = previous.confirmSablonUygula;
      window.ajanDurumToggle = previous.ajanDurumToggle;
      window.openAjanDuzenleModal = previous.openAjanDuzenleModal;
      window.apiLimitSec = previous.apiLimitSec;
      window.toggleTempAyar = previous.toggleTempAyar;
      window.ajanAyarlariKaydet = previous.ajanAyarlariKaydet;
      window.openAjanLogModal = previous.openAjanLogModal;
      window.indirAjanLogCSV = previous.indirAjanLogCSV;
      window.openGlobalAyarlarModal = previous.openGlobalAyarlarModal;
      window.toggleGlobalAyar = previous.toggleGlobalAyar;
      window.globalAyarlarKaydet = previous.globalAyarlarKaydet;
      window.panelAyarDegistir = previous.panelAyarDegistir;
      window.bildirimKanalToggle = previous.bildirimKanalToggle;
      window.bildirimTurToggle = previous.bildirimTurToggle;
      window.bildirimSiklikDegistir = previous.bildirimSiklikDegistir;
      window.openKullaniciModal = previous.openKullaniciModal;
      window.kullaniciKaydet = previous.kullaniciKaydet;
      window.kullaniciSil = previous.kullaniciSil;
      window.openEntegrasyonModal = previous.openEntegrasyonModal;
      window.entegrasyonToggle = previous.entegrasyonToggle;
      window.entegrasyonTest = previous.entegrasyonTest;
      window.openSistemBilgisiModal = previous.openSistemBilgisiModal;
      window.openYedekAlModal = previous.openYedekAlModal;
      window.yedekBaslat = previous.yedekBaslat;
      window.render = previous.render;
      window.NEW_SECTOR_DATA = previous.NEW_SECTOR_DATA;
      window.NEW_SECTOR_STEP = previous.NEW_SECTOR_STEP;
    };
  }, [runtime]);

  const html = useMemo(() => {
    if (view === 'dashboard') return runtime.renderDashboard();
    if (view === 'clients') return runtime.renderClients();
    if (view === 'planner') return runtime.renderPlanner();
    if (view === 'performance') return runtime.renderPerformance();
    if (view === 'optimization') return runtime.renderOptimization();
    if (view === 'sectors') return runtime.renderSectors();
    if (view === 'agent-settings') return runtime.renderAgentSettings();
    if (view === 'general-settings') return runtime.renderGeneralSettings();
    if (view.kind === 'planner-detail') return runtime.renderPlannerDetay(view.id);
    runtime.windowObj.CLIENT_TAB = clientTab;
    return runtime.renderClientDetay(view.id);
  }, [clientTab, runtime, version, view]);

  return (
    <div className="relative min-h-full">
      <div dangerouslySetInnerHTML={{ __html: html }} />

      {modalHtml ? (
        <div
          className="absolute inset-0 z-[70]"
          id="googleAdsContentModalRoot"
          dangerouslySetInnerHTML={{ __html: modalHtml }}
        />
      ) : null}

      {toast ? (
        <div className={`absolute bottom-6 right-6 z-[80] min-w-[280px] max-w-sm rounded-lg border-l-4 bg-white dark:bg-[#1e1f26] p-4 shadow-xl ${toastClasses(toast.color)}`}>
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <div className="text-[13px] font-bold">{toast.title}</div>
              <div className="mt-0.5 text-[11px] text-gray-500 dark:text-gray-400">{toast.message}</div>
            </div>
            <button className="text-[16px] text-gray-400" onClick={() => setToast(null)} type="button">
              ×
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
