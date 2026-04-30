import { NavLink, useNavigate } from 'react-router-dom';
import { type ReactNode } from 'react';
import { clearAuthInfo } from '../../auth/utils/authStorage';

type GoogleAdsSidebarProps = {
  activeId: string;
  isOpen: boolean;
  isDark: boolean;
  onClose: () => void;
  onToggleDark: () => void;
};

type NavItem = {
  id: string;
  label: string;
  badge?: string;
  bclr?: 'amber' | 'violet' | 'sky' | 'emerald' | 'teal';
  route?: string;
  arch?: boolean;
  icon: ReactNode;
};

const badgeClass = {
  amber: 'bg-amber-50 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 border border-amber-200/60 dark:border-amber-500/30',
  violet: 'bg-violet-50 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300 border border-violet-200/60 dark:border-violet-500/30',
  sky: 'bg-sky-50 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300 border border-sky-200/60 dark:border-sky-500/30',
  emerald: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-500/30',
  teal: 'bg-teal-50 text-teal-700 dark:bg-teal-500/20 dark:text-teal-300 border border-teal-200/60 dark:border-teal-500/30',
};

const NAV: NavItem[] = [
  {
    id: 'command',
    label: 'Genel Bakış',
    bclr: 'amber',
    route: '/dashboards/google-ads',
    icon: (
      <>
        <circle cx="12" cy="12" r="10" />
        <polygon points="10 8 16 12 10 16 10 8" />
      </>
    ),
  },
  {
    id: 'clients',
    label: 'Müşteri Hesapları',
    badge: '6',
    bclr: 'violet',
    route: '/dashboards/google-ads/customer-accounts',
    icon: (
      <>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
  },
  {
    id: 'planner',
    label: 'Planner Görevleri',
    badge: '4',
    bclr: 'sky',
    route: '/dashboards/google-ads/planner-tasks',
    icon: (
      <>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </>
    ),
  },
  {
    id: 'performance',
    label: 'Performans Takibi',
    bclr: 'emerald',
    route: '/dashboards/google-ads/performance-tracking',
    icon: (
      <>
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </>
    ),
  },
  {
    id: 'optimization',
    label: 'Optimizasyon Önerileri',
    badge: '12',
    bclr: 'amber',
    route: '/dashboards/google-ads/optimization-suggestions',
    icon: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />,
  },
  {
    id: 'sectors',
    label: 'Sektörler',
    badge: '8',
    bclr: 'teal',
    route: '/dashboards/google-ads/sectors',
    icon: (
      <>
        <path d="M3 3h18v18H3z" />
        <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
      </>
    ),
  },
];

const ARCH_NAV: NavItem[] = [
  {
    id: 'agent-settings',
    label: 'Ajan Ayarları',
    bclr: 'violet',
    arch: true,
    route: '/dashboards/google-ads/agent-settings',
    icon: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />,
  },
  {
    id: 'general-settings',
    label: 'Genel Ayarlar',
    arch: true,
    route: '/dashboards/google-ads/settings',
    icon: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </>
    ),
  },
];

function NavRow({ item, activeId, onClose }: { item: NavItem; activeId: string; onClose: () => void }) {
  const baseClass = 'w-full flex items-center gap-2 px-2 py-2 rounded-md text-[12px] transition-colors';
  const passiveClass = 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50';
  const activeClass = item.arch ? 'nav-arch' : 'nav-a';
  const isActive = item.id === activeId;
  const content = (
    <>
      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        {item.icon}
      </svg>
      <span className="flex-1 text-left">{item.label}</span>
      {item.badge && item.bclr ? (
        <span className={`text-[10px] font-bold ${badgeClass[item.bclr]} rounded px-1.5 py-0.5 leading-none`}>{item.badge}</span>
      ) : null}
    </>
  );

  if (item.route) {
    return (
      <li>
        <NavLink
          to={item.route}
          end={item.id === 'command'}
          onClick={onClose}
          className={({ isActive: routeActive }) => `${baseClass} ${routeActive ? activeClass : passiveClass}`}
        >
          {content}
        </NavLink>
      </li>
    );
  }

  return (
    <li>
      <button type="button" className={`${baseClass} ${isActive ? activeClass : passiveClass}`}>
        {content}
      </button>
    </li>
  );
}

export default function GoogleAdsSidebar({ activeId, isOpen, isDark, onClose, onToggleDark }: GoogleAdsSidebarProps) {
  const navigate = useNavigate();

  function handleLogout() {
    clearAuthInfo();
    navigate('/login', { replace: true });
  }

  return (
    <aside
      id="sidebar"
      className={`fixed lg:sticky top-0 left-0 h-screen z-50 bg-white dark:bg-[#17181f] border-r border-gray-200 dark:border-gray-600/50 flex flex-col ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } transition-transform duration-300`}
      style={{ width: 250 }}
    >
      <div className="flex flex-col px-4 border-b border-gray-100 dark:border-gray-600/50" style={{ paddingTop: 18, paddingBottom: 14 }}>
        <div className="flex items-center gap-1">
          {['A', 'D', 'O', 'S'].map((letter, index) => (
            <div
              key={letter}
              className={`rounded flex items-center justify-center ${index % 2 === 0 ? 'bg-[#2D3748]' : 'bg-[#4A5568]'}`}
              style={{ width: 28, height: 28 }}
            >
              <span className="text-white font-bold" style={{ fontSize: 12 }}>
                {letter}
              </span>
            </div>
          ))}
        </div>
        <p className="text-gray-400 dark:text-gray-500 font-mono" style={{ marginTop: 6, fontSize: 13 }}>
          Google ADS Panosu
        </p>
        <p
          className="text-gray-500 dark:text-gray-600"
          style={{ fontSize: 10, marginTop: 2, fontFamily: 'ui-monospace,Menlo,Consolas,monospace' }}
        >
          cigdem.alatas · performans pazarlama uzmanı
        </p>
      </div>

      <nav className="flex-1" style={{ padding: '14px 10px' }}>
        <div className="flex items-center gap-1.5 px-2 mb-2">
          <svg className="w-3 h-3 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
          <p className="uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold" style={{ fontSize: 10 }}>
            ADS · Operasyon
          </p>
        </div>
        <ul className="space-y-0.5" id="navList">
          {NAV.map((item) => (
            <NavRow key={item.id} item={item} activeId={activeId} onClose={onClose} />
          ))}
        </ul>

        <div className="flex items-center gap-1.5 px-2 mt-5 mb-2">
          <svg className="w-3 h-3 text-violet-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <line x1="3" y1="10" x2="21" y2="10" />
            <line x1="9" y1="4" x2="9" y2="20" />
          </svg>
          <p className="uppercase tracking-wider text-violet-600 dark:text-violet-400 font-bold" style={{ fontSize: 10 }}>
            ADOS · Sistem
          </p>
        </div>
        <ul className="space-y-0.5" id="archNavList">
          {ARCH_NAV.map((item) => (
            <NavRow key={item.id} item={item} activeId={activeId} onClose={onClose} />
          ))}
        </ul>
        <ul className="space-y-0.5 hidden" id="extraNavList" />
      </nav>

      <div className="border-t border-gray-100 dark:border-gray-600/50" style={{ padding: 12 }}>
        <div style={{ marginBottom: 10 }}>
          <div className="flex items-center justify-between mb-1" style={{ paddingLeft: 4 }}>
            <p className="uppercase tracking-wider text-gray-400 dark:text-gray-600 font-semibold" style={{ fontSize: 10 }}>
              ADOS · SİSTEM
            </p>
            <span className="text-[9px] font-mono text-gray-400 dark:text-gray-500">v4.1.0</span>
          </div>
          <ul style={{ paddingLeft: 4 }}>
            <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400" style={{ fontSize: 12, marginBottom: 4 }}>
              <span className="rounded-full bg-emerald-500" style={{ width: 6, height: 6, display: 'inline-block', boxShadow: '0 0 0 3px rgba(16,185,129,.2)', flexShrink: 0 }} />
              Google Ads API · Bağlı
            </li>
            <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400" style={{ fontSize: 12, marginBottom: 4 }}>
              <span className="rounded-full bg-amber-500" style={{ width: 6, height: 6, display: 'inline-block', boxShadow: '0 0 0 3px rgba(245,158,11,.2)', flexShrink: 0 }} />
              6 müşteri · ajan aktif
            </li>
            <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400" style={{ fontSize: 12 }}>
              <span className="rounded-full bg-violet-500" style={{ width: 6, height: 6, display: 'inline-block', boxShadow: '0 0 0 3px rgba(139,92,246,.2)', flexShrink: 0 }} />
              Planner · 4 görev bekliyor
            </li>
          </ul>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-600/50" style={{ paddingLeft: 4 }}>
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="rounded-full bg-gradient-to-br from-emerald-500 via-teal-500 to-sky-600 flex items-center justify-center flex-shrink-0" style={{ width: 30, height: 30 }}>
                <span className="text-white font-bold" style={{ fontSize: 10 }}>
                  ÇA
                </span>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-[#17181f]" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100" style={{ fontSize: 13 }}>
                Çiğdem Alataş
              </p>
              <p className="text-gray-400 dark:text-gray-500" style={{ fontSize: 11 }}>
                Performans Pazarlama Uzmanı
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleLogout}
              title="Çıkış Yap"
              className="flex items-center justify-center rounded-md hover:bg-rose-50 dark:hover:bg-rose-500/10 text-gray-400 dark:text-gray-500 hover:text-rose-600 dark:hover:text-rose-300 transition-colors"
              style={{ width: 28, height: 28 }}
            >
              <svg style={{ width: 14, height: 14 }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
            <button
              type="button"
              onClick={onToggleDark}
              className="flex items-center justify-center rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 dark:text-gray-500 transition-colors"
              style={{ width: 28, height: 28 }}
            >
              {isDark ? (
                <svg id="iSun" style={{ width: 14, height: 14 }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg id="iMoon" style={{ width: 14, height: 14 }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
