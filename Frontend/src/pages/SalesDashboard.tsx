import DashboardFrame from './DashboardFrame';
import html from './html/ADOS_Satis_Panosu_v1_50.html?raw';

export default function SalesDashboard() {
  return <DashboardFrame html={html} title="ADOS Satış Panosu" />;
}
