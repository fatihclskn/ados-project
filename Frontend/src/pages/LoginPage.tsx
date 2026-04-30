import DashboardFrame from './DashboardFrame';
import html from './html/ADOS_Login_3.html?raw';

export default function LoginPage() {
  return <DashboardFrame html={html} title="ADOS Login" bridge="login" />;
}
