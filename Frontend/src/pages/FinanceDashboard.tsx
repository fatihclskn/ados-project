import DashboardFrame from './DashboardFrame';
import html from './html/ADOS_Finans_Panosu_30.html?raw';

export default function FinanceDashboard() {
  return <DashboardFrame html={html} title="ADOS Finans Panosu" />;
}
