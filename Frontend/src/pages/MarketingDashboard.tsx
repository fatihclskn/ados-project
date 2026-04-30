import DashboardFrame from './DashboardFrame';
import html from './html/ADOS_Pazarlama_Panosu_v2_13.html?raw';

export default function MarketingDashboard() {
  return <DashboardFrame html={html} title="ADOS Pazarlama Panosu" />;
}
