import DashboardFrame from './DashboardFrame';
import html from './html/ADOS_Genel_Mudur_Panosu_v2_20.html?raw';

export default function GeneralManagerDashboard() {
  return <DashboardFrame html={html} title="ADOS Genel Müdür Panosu" bridge="general-manager" />;
}
