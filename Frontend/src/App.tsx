import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { type ReactNode } from 'react';
import AiYonetimi from './pages/AiYonetimi';
import Entegrasyonlar from './pages/Entegrasyonlar';
import FinansalPanorama from './pages/FinansalPanorama';
import Login from './features/auth/pages/Login';
import { getDefaultRoute, isAuthenticated, isRouteAllowed } from './features/auth/utils/authStorage';
import FinansPanosuLayout from './features/finans-panosu/layout/FinansPanosuLayout';
import BankaHesaplari from './features/finans-panosu/pages/BankaHesaplari';
import BoschHesabi from './features/finans-panosu/pages/BoschHesabi';
import DomainHosting from './features/finans-panosu/pages/DomainHosting';
import EkipYonetimi from './features/finans-panosu/pages/EkipYonetimi';
import FaturaTahsilati from './features/finans-panosu/pages/FaturaTahsilati';
import FinansAyarlari from './features/finans-panosu/pages/FinansAyarlari';
import FinansGenelBakis from './features/finans-panosu/pages/GenelBakis';
import HizmetAnlasmalari from './features/finans-panosu/pages/HizmetAnlasmalari';
import KrediKartlari from './features/finans-panosu/pages/KrediKartlari';
import OrtaklarMuhasebe from './features/finans-panosu/pages/OrtaklarMuhasebe';
import FinansRaporlar from './features/finans-panosu/pages/Raporlar';
import SozlesmeIslemleri from './features/finans-panosu/pages/SozlesmeIslemleri';
import VergiSsk from './features/finans-panosu/pages/VergiSsk';
import GoogleAdsLayout from './features/google-ads-paneli/layout/GoogleAdsLayout';
import GoogleAdsAjanAyarlari from './features/google-ads-paneli/pages/AjanAyarlari';
import GoogleAdsGenelAyarlar from './features/google-ads-paneli/pages/GenelAyarlar';
import GoogleAdsGenelBakis from './features/google-ads-paneli/pages/GenelBakis';
import GoogleAdsMusteriHesaplari from './features/google-ads-paneli/pages/MusteriHesaplari';
import GoogleAdsOptimizasyonOnerileri from './features/google-ads-paneli/pages/OptimizasyonOnerileri';
import GoogleAdsPerformansTakibi from './features/google-ads-paneli/pages/PerformansTakibi';
import GoogleAdsPlannerGorevleri from './features/google-ads-paneli/pages/PlannerGorevleri';
import GoogleAdsSektorler from './features/google-ads-paneli/pages/Sektorler';
import GenelAyarlar from './pages/GenelAyarlar';
import EkipOperasyon from './pages/EkipOperasyon';
import KomutaMerkezi from './pages/KomutaMerkezi';
import JsonAjanlari from './pages/JsonAjanlari';
import MusteriPortfoyu from './pages/MusteriPortfoyu';
import OnayKuyrugu from './pages/OnayKuyrugu';
import Orchestrator from './pages/Orchestrator';
import Panolar from './pages/Panolar';
import PazarlamaPanosuLayout from './features/pazarlama-panosu/layout/PazarlamaPanosuLayout';
import EBultenListeleri from './features/pazarlama-panosu/pages/EBultenListeleri';
import GenelBakis from './features/pazarlama-panosu/pages/GenelBakis';
import PazarlamaMusteriDataKontrol from './features/pazarlama-panosu/pages/MusteriDataKontrol';
import PazarlamaPrimYonetimi from './features/pazarlama-panosu/pages/PrimYonetimi';
import PazarlamaRaporlar from './features/pazarlama-panosu/pages/Raporlar';
import SatisaYonlendirme from './features/pazarlama-panosu/pages/SatisaYonlendirme';
import PazarlamaSozlesmeTakibi from './features/pazarlama-panosu/pages/SozlesmeTakibi';
import PazarlamaTalepHavuzu from './features/pazarlama-panosu/pages/TalepHavuzu';
import PromptKutuphane from './pages/PromptKutuphane';
import SatisPanosuLayout from './features/satis-panosu/layout/SatisPanosuLayout';
import MusteriDataKontrol from './features/satis-panosu/pages/MusteriDataKontrol';
import PrimYonetimi from './features/satis-panosu/pages/PrimYonetimi';
import Raporlar from './features/satis-panosu/pages/Raporlar';
import SatisBaslat from './features/satis-panosu/pages/SatisBaslat';
import SatisPanosuHome from './features/satis-panosu/pages/SatisPanosuHome';
import SozlesmeTakibi from './features/satis-panosu/pages/SozlesmeTakibi';
import TalepHavuzu from './features/satis-panosu/pages/TalepHavuzu';
import TeklifTakibi from './features/satis-panosu/pages/TeklifTakibi';
import SatisPipeline from './pages/SatisPipeline';
import StratejikRaporlar from './pages/StratejikRaporlar';

function salesPage(element: ReactNode, activeId: string, breadcrumb: string) {
  return (
    <SatisPanosuLayout activeId={activeId} breadcrumb={breadcrumb}>
      {element}
    </SatisPanosuLayout>
  );
}

function marketingPage(element: ReactNode, activeId: string, breadcrumb: string) {
  return (
    <PazarlamaPanosuLayout activeId={activeId} breadcrumb={breadcrumb}>
      {element}
    </PazarlamaPanosuLayout>
  );
}

function financePage(element: ReactNode, activeId: string, breadcrumb: string) {
  return (
    <FinansPanosuLayout activeId={activeId} breadcrumb={breadcrumb}>
      {element}
    </FinansPanosuLayout>
  );
}

function googleAdsPage(element: ReactNode, activeId: string, breadcrumb: string) {
  return (
    <GoogleAdsLayout activeId={activeId} breadcrumb={breadcrumb}>
      {element}
    </GoogleAdsLayout>
  );
}

function ProtectedRoute({ children }: { children: ReactNode }) {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!isRouteAllowed(location.pathname)) {
    return <Navigate to={getDefaultRoute()} replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />
      <Route path="/dashboard" element={<KomutaMerkezi />} />
      <Route path="/finance" element={<FinansalPanorama />} />
      <Route path="/sales" element={<SatisPipeline />} />
      <Route path="/customers" element={<MusteriPortfoyu />} />
      <Route path="/team" element={<EkipOperasyon />} />
      <Route path="/approvals" element={<OnayKuyrugu />} />
      <Route path="/strategic-reports" element={<StratejikRaporlar />} />
      <Route path="/orchestrator" element={<Orchestrator />} />
      <Route path="/json-agents" element={<JsonAjanlari />} />
      <Route path="/prompt-library" element={<PromptKutuphane />} />
      <Route path="/ai-management" element={<AiYonetimi />} />
      <Route path="/integrations" element={<Entegrasyonlar />} />
      <Route path="/settings" element={<GenelAyarlar />} />
      <Route path="/dashboards" element={<Panolar />} />
      <Route path="/dashboards/google-ads" element={googleAdsPage(<GoogleAdsGenelBakis />, 'command', 'ADS · Genel Bakış')} />
      <Route path="/dashboards/google-ads/customer-accounts" element={googleAdsPage(<GoogleAdsMusteriHesaplari />, 'clients', 'ADS · Müşteri Hesapları')} />
      <Route path="/dashboards/finance" element={financePage(<FinansGenelBakis />, 'command', 'Finans · Genel Bakış')} />
      <Route path="/dashboards/finance/invoice-collections" element={financePage(<FaturaTahsilati />, 'financial', 'Finans · Fatura & Tahsilat')} />
      <Route path="/dashboards/finance/service-agreements" element={financePage(<HizmetAnlasmalari />, 'pipeline', 'Finans · Hizmet Anlaşmaları')} />
      <Route path="/dashboards/finance/contract-operations" element={financePage(<SozlesmeIslemleri />, 'customers', 'Finans · Sözleşme İşlemleri')} />
      <Route path="/dashboards/finance/credit-cards" element={financePage(<KrediKartlari />, 'operations', 'Finans · Kredi Kartları')} />
      <Route path="/dashboards/finance/tax-ssk" element={financePage(<VergiSsk />, 'vergi-ssk', 'Finans · Vergi & SSK')} />
      <Route path="/dashboards/finance/domain-hosting" element={financePage(<DomainHosting />, 'domain', 'Finans · Domain & Hosting')} />
      <Route path="/dashboards/finance/bosch-account" element={financePage(<BoschHesabi />, 'approvals', 'Finans · Bosch Hesabı')} />
      <Route path="/dashboards/finance/bank-accounts" element={financePage(<BankaHesaplari />, 'reports', 'Finans · Banka Hesapları')} />
      <Route path="/dashboards/finance/partners-accounting" element={financePage(<OrtaklarMuhasebe />, 'orchestrator', 'Finans · Ortaklar Muhasebesi')} />
      <Route path="/dashboards/finance/team-management" element={financePage(<EkipYonetimi />, 'json-agents', 'Finans · Ekip Yönetimi')} />
      <Route path="/dashboards/finance/reports" element={financePage(<FinansRaporlar />, 'ai-router', 'Muhasebe · Raporlar')} />
      <Route path="/dashboards/finance/settings" element={financePage(<FinansAyarlari />, 'audit', 'Sistem · Finans Ayarları')} />
      <Route path="/dashboards/marketing" element={marketingPage(<GenelBakis />, 'overview', 'Pazarlama · Genel Bakış')} />
      <Route path="/dashboards/marketing/request-pool" element={marketingPage(<PazarlamaTalepHavuzu />, 'leads', 'Pazarlama · Talep Havuzu')} />
      <Route path="/dashboards/marketing/customer-data-control" element={marketingPage(<PazarlamaMusteriDataKontrol />, 'datacontrol', 'Pazarlama · Müşteri Data Kontrol')} />
      <Route path="/dashboards/marketing/newsletter-lists" element={marketingPage(<EBultenListeleri />, 'newsletter', 'Pazarlama · E-Bülten & Listeler')} />
      <Route path="/dashboards/marketing/sales-routing" element={marketingPage(<SatisaYonlendirme />, 'handoff', 'Pazarlama · Satışa Yönlendirme')} />
      <Route path="/dashboards/marketing/contracts" element={marketingPage(<PazarlamaSozlesmeTakibi />, 'contract', 'Pazarlama · Sözleşme Takibi')} />
      <Route path="/dashboards/marketing/commissions" element={marketingPage(<PazarlamaPrimYonetimi />, 'commission', 'Pazarlama · Prim Yönetimi')} />
      <Route path="/dashboards/marketing/reports" element={marketingPage(<PazarlamaRaporlar />, 'reports', 'Pazarlama · Raporlar')} />
      <Route
        path="/dashboards/sales"
        element={salesPage(<SatisPanosuHome />, 'overview', 'Satış · Genel Bakış')}
      />
      <Route path="/dashboards/sales/customer-data-control" element={salesPage(<MusteriDataKontrol />, 'datacontrol', 'Satış · Müşteri Data Kontrol')} />
      <Route path="/dashboards/sales/request-pool" element={salesPage(<TalepHavuzu />, 'leads', 'Satış · Talep Havuzu')} />
      <Route path="/dashboards/sales/start-sales" element={salesPage(<SatisBaslat />, 'salesstart', 'Satış · Satış Başlat')} />
      <Route path="/dashboards/sales/offers" element={salesPage(<TeklifTakibi />, 'proposals', 'Satış · Teklif Takibi')} />
      <Route path="/dashboards/sales/commissions" element={salesPage(<PrimYonetimi />, 'commission', 'Satış · Prim Yönetimi')} />
      <Route path="/dashboards/sales/contracts" element={salesPage(<SozlesmeTakibi />, 'contract', 'Satış · Sözleşme Takibi')} />
      <Route path="/dashboards/sales/reports" element={salesPage(<Raporlar />, 'reports', 'Satış · Raporlar')} />
      <Route path="/dashboards/google-ads/planner-tasks" element={googleAdsPage(<GoogleAdsPlannerGorevleri />, 'planner', 'ADS · Planner Görevleri')} />
      <Route path="/dashboards/google-ads/performance-tracking" element={googleAdsPage(<GoogleAdsPerformansTakibi />, 'performance', 'ADS · Performans Takibi')} />
      <Route path="/dashboards/google-ads/optimization-suggestions" element={googleAdsPage(<GoogleAdsOptimizasyonOnerileri />, 'optimization', 'ADS · Optimizasyon Önerileri')} />
      <Route path="/dashboards/google-ads/sectors" element={googleAdsPage(<GoogleAdsSektorler />, 'sectors', 'ADS · Sektörler')} />
      <Route path="/dashboards/google-ads/agent-settings" element={googleAdsPage(<GoogleAdsAjanAyarlari />, 'agent-settings', 'Sistem · Ajan Ayarları')} />
      <Route path="/dashboards/google-ads/settings" element={googleAdsPage(<GoogleAdsGenelAyarlar />, 'general-settings', 'Sistem · Genel Ayarlar')} />
      <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={isAuthenticated() ? <Navigate to={getDefaultRoute()} replace /> : <Login />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AppRoutes />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
