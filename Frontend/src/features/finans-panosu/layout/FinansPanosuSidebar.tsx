import { type ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { clearAuthInfo } from '../../auth/utils/authStorage';

type NavItem = {
  id: string;
  label: string;
  badge: string;
  bclr: string;
  icon: ReactNode;
  route?: string;
};

type FinansPanosuSidebarProps = {
  activeId?: string;
  isOpen?: boolean;
  isDark?: boolean;
  onSelect?: () => void;
  onToggleDark?: () => void;
};

const NAV: NavItem[] = [
  {
    id: 'command',
    label: 'Genel Bakış',
    badge: '',
    bclr: '',
    route: '/dashboards/finance',
    icon: (
      <>
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
      </>
    ),
  },
  {
    id: 'financial',
    label: 'Fatura & Tahsilat',
    badge: '24',
    bclr: 'amber',
    route: '/dashboards/finance/invoice-collections',
    icon: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16l4-2 4 2 4-2 4 2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </>
    ),
  },
  {
    id: 'pipeline',
    label: 'Hizmet Anlaşmaları',
    badge: '87',
    bclr: 'sky',
    route: '/dashboards/finance/service-agreements',
    icon: (
      <>
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </>
    ),
  },
  {
    id: 'customers',
    label: 'Sözleşme İşlemleri',
    badge: '6',
    bclr: 'violet',
    route: '/dashboards/finance/contract-operations',
    icon: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </>
    ),
  },
  {
    id: 'operations',
    label: 'Kredi Kartları',
    badge: '4',
    bclr: 'indigo',
    route: '/dashboards/finance/credit-cards',
    icon: (
      <>
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="11" x2="22" y2="11" />
      </>
    ),
  },
  {
    id: 'vergi-ssk',
    label: 'Vergi / SSK',
    badge: '3',
    bclr: 'amber',
    route: '/dashboards/finance/tax-ssk',
    icon: (
      <>
        <line x1="19" y1="5" x2="5" y2="19" />
        <circle cx="6.5" cy="6.5" r="2.5" />
        <circle cx="17.5" cy="17.5" r="2.5" />
      </>
    ),
  },
  {
    id: 'domain',
    label: 'Domain / Hosting',
    badge: '8',
    bclr: 'teal',
    route: '/dashboards/finance/domain-hosting',
    icon: (
      <>
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </>
    ),
  },
  {
    id: 'approvals',
    label: 'Bosch Hesabı',
    badge: '5',
    bclr: 'indigo',
    route: '/dashboards/finance/bosch-account',
    icon: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M9 12l2 2 4-4" />
      </>
    ),
  },
  {
    id: 'reports',
    label: 'Banka Hesapları',
    badge: '3',
    bclr: '',
    route: '/dashboards/finance/bank-accounts',
    icon: (
      <>
        <path d="M3 21h18" />
        <path d="M3 10h18" />
        <path d="M5 6l7-4 7 4" />
        <path d="M4 10v11" />
        <path d="M20 10v11" />
        <path d="M8 14v3" />
        <path d="M12 14v3" />
        <path d="M16 14v3" />
      </>
    ),
  },
];

const ARCH_NAV: NavItem[] = [
  {
    id: 'orchestrator',
    label: 'Ortaklar Muhasebesi',
    badge: '2',
    bclr: 'violet',
    route: '/dashboards/finance/partners-accounting',
    icon: (
      <>
        <path d="M12 2v20" />
        <path d="M2 12h20" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
  },
  {
    id: 'json-agents',
    label: 'Ekip Yönetimi',
    badge: '12',
    bclr: 'indigo',
    route: '/dashboards/finance/team-management',
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
    id: 'ai-router',
    label: 'Raporlar',
    badge: '6',
    bclr: 'pink',
    route: '/dashboards/finance/reports',
    icon: (
      <>
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </>
    ),
  },
  {
    id: 'audit',
    label: 'Finans Ayarları',
    badge: '',
    bclr: '',
    route: '/dashboards/finance/settings',
    icon: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.65 1.65 0 0 0 15 19.4a1.65 1.65 0 0 0-1 .6l-.09.09a2 2 0 1 1-2.83-2.83l.09-.09A1.65 1.65 0 0 0 10.6 15a1.65 1.65 0 0 0-1.82-.33l-.11.05a2 2 0 1 1-1.54-3.69l.11-.05A1.65 1.65 0 0 0 8.6 9a1.65 1.65 0 0 0-.6-1l-.09-.09a2 2 0 1 1 2.83-2.83l.09.09A1.65 1.65 0 0 0 13 4.6a1.65 1.65 0 0 0 1-.6l.09-.09a2 2 0 1 1 2.83 2.83l-.09.09A1.65 1.65 0 0 0 15.4 9c0 .7.42 1.33 1.07 1.58l.11.05a2 2 0 1 1-1.54 3.69l-.11-.05A1.65 1.65 0 0 0 13.4 15z" />
      </>
    ),
  },
];

function Icon({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <svg className={`w-3.5 h-3.5 shrink-0 ${className}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      {children}
    </svg>
  );
}

function NavBadge({ item }: { item: NavItem }) {
  if (!item.badge) return null;

  return <span className={`text-[9px] font-mono bg-${item.bclr}-100 text-${item.bclr}-700 dark:bg-${item.bclr}-900/40 dark:text-${item.bclr}-300 rounded px-1`}>{item.badge}</span>;
}

function SidebarItem({ item, activeId, onSelect, archived = false }: { item: NavItem; activeId?: string; onSelect?: () => void; archived?: boolean }) {
  const activeClass = archived ? 'nav-arch' : 'nav-a';
  const inactiveClass = archived ? 'text-gray-600 dark:text-gray-400 hover:bg-violet-50 dark:hover:bg-violet-500/10' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50';
  const className = `w-full flex items-center gap-2 px-2 py-2 rounded-md text-[12px] transition-colors ${item.id === activeId ? activeClass : inactiveClass}`;

  if (item.route) {
    return (
      <NavLink
        to={item.route}
        end
        onClick={onSelect}
        id={`nb-${item.id}`}
        className={({ isActive }) => `w-full flex items-center gap-2 px-2 py-2 rounded-md text-[12px] transition-colors ${isActive || item.id === activeId ? activeClass : inactiveClass}`}
      >
        <Icon>{item.icon}</Icon>
        <span className="flex-1 text-left">{item.label}</span>
        <NavBadge item={item} />
      </NavLink>
    );
  }

  return (
    <button type="button" id={`nb-${item.id}`} onClick={onSelect} className={className}>
      <Icon>{item.icon}</Icon>
      <span className="flex-1 text-left">{item.label}</span>
      <NavBadge item={item} />
    </button>
  );
}

export default function FinansPanosuSidebar({ activeId = 'command', isOpen = false, isDark = false, onSelect, onToggleDark }: FinansPanosuSidebarProps) {
  const navigate = useNavigate();
  const sidebarClassName = `fixed lg:sticky top-0 left-0 h-screen z-50 bg-white dark:bg-[#17181f] border-r border-gray-200 dark:border-gray-600/50 flex flex-col ${
    isOpen ? '' : '-translate-x-full'
  } lg:translate-x-0 transition-transform duration-300`;

  function handleLogout() {
    clearAuthInfo();
    navigate('/login', { replace: true });
  }

  return (
    <aside id="sidebar" className={sidebarClassName} style={{ width: 250 }}>
      <div className="px-4 pt-5 pb-4 border-b border-gray-100 dark:border-gray-700/40">
        <div className="flex items-center gap-1">
          {['A', 'D', 'O', 'S'].map((letter, index) => (
            <div key={letter} className={`w-7 h-7 ${index % 2 === 0 ? 'bg-[#2D3748]' : 'bg-[#4A5568]'} dark:${index % 2 === 0 ? 'bg-gray-700' : 'bg-gray-600'} rounded flex items-center justify-center`}>
              <span className="text-white text-[11px] font-bold">{letter}</span>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-2 font-semibold">Finans Panosu</p>
        <p className="text-[10px] text-gray-400 dark:text-gray-500 font-mono">tulay.hanim · kıdemli muhasebe direktörü</p>
      </div>

      <nav className="flex-1 p-3.5 overflow-y-auto hs">
        <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold mb-2 px-2">Finans · Operasyon</p>
        <ul className="space-y-0.5" id="navList">
          {NAV.map((item) => (
            <li key={item.id}>
              <SidebarItem item={item} activeId={activeId} onSelect={onSelect} />
            </li>
          ))}
        </ul>

        <p className="text-[10px] uppercase tracking-wider text-violet-400 dark:text-violet-500 font-semibold mb-2 mt-5 px-2">Arma · Muhasebe</p>
        <ul className="space-y-0.5" id="archNavList">
          {ARCH_NAV.map((item) => (
            <li key={item.id}>
              <SidebarItem item={item} activeId={activeId} onSelect={onSelect} archived />
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-3 border-t border-gray-100 dark:border-gray-700/40 space-y-2.5">
        <div className="px-1">
          <p className="text-[9px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1.5">ADOS Sistem v4.1.0</p>
          <ul className="space-y-1">
            <li className="flex items-center gap-2 text-[11px] text-gray-600 dark:text-gray-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20" />
              Paraşüt · Bağlı
            </li>
            <li className="flex items-center gap-2 text-[11px] text-gray-600 dark:text-gray-400">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 ring-2 ring-amber-500/20" />3 banka · senkron 12dk
            </li>
            <li className="flex items-center gap-2 text-[11px] text-gray-600 dark:text-gray-400">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500 ring-2 ring-violet-500/20" />
              87 müşteri · 24 fatura
            </li>
          </ul>
        </div>

        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-amber-500 to-violet-600 rounded-full flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">T</span>
            </div>
            <div>
              <p className="text-[12px] font-semibold text-gray-900 dark:text-gray-100 leading-tight">Tülay Hanım</p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-tight">Kıdemli Muhasebe Direktörü</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleLogout}
              title="Çıkış Yap"
              className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-rose-50 dark:hover:bg-rose-500/10 text-gray-400 dark:text-gray-500 hover:text-rose-600 dark:hover:text-rose-300 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
            <button type="button" onClick={onToggleDark} title="Tema" className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 dark:text-gray-500 transition-colors">
              <svg id="iSun" className={`w-3.5 h-3.5 ${isDark ? '' : 'hidden'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
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
              <svg id="iMoon" className={`w-3.5 h-3.5 ${isDark ? 'hidden' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
