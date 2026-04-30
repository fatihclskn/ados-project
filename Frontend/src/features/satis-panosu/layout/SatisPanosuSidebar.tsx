import { type ReactNode, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { clearAuthInfo } from '../../auth/utils/authStorage';

type NavItem = {
  id: string;
  label: string;
  badge: string;
  bclr: string;
  icon: ReactNode;
  route: string;
};

type SatisPanosuSidebarProps = {
  activeId?: string;
  isOpen?: boolean;
  isDark?: boolean;
  onSelect?: () => void;
  onToggleDark?: () => void;
};

const NAV: NavItem[] = [
  {
    id: 'overview',
    label: 'Genel Bakış',
    badge: '',
    bclr: '',
    route: '/dashboards/sales',
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
    id: 'datacontrol',
    label: 'Müşteri Data Kontrol',
    badge: '142',
    bclr: 'violet',
    route: '/dashboards/sales/customer-data-control',
    icon: (
      <>
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </>
    ),
  },
  {
    id: 'leads',
    label: 'Talep Havuzu',
    badge: '37',
    bclr: 'violet',
    route: '/dashboards/sales/request-pool',
    icon: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </>
    ),
  },
  {
    id: 'salesstart',
    label: 'Satış Başlat',
    badge: '18',
    bclr: 'emerald',
    route: '/dashboards/sales/start-sales',
    icon: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="12" y1="18" x2="12" y2="12" />
        <line x1="9" y1="15" x2="15" y2="15" />
      </>
    ),
  },
  {
    id: 'proposals',
    label: 'Teklif Takibi',
    badge: '14',
    bclr: 'violet',
    route: '/dashboards/sales/offers',
    icon: (
      <>
        <path d="M22 2L11 13" />
        <path d="M22 2l-7 20-4-9-9-4 20-7z" />
      </>
    ),
  },
  {
    id: 'commission',
    label: 'Prim Yönetimi',
    badge: '12',
    bclr: 'amber',
    route: '/dashboards/sales/commissions',
    icon: (
      <>
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </>
    ),
  },
  {
    id: 'contract',
    label: 'Sözleşme Takibi',
    badge: '9',
    bclr: 'sky',
    route: '/dashboards/sales/contracts',
    icon: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </>
    ),
  },
  {
    id: 'reports',
    label: 'Raporlar',
    badge: '',
    bclr: '',
    route: '/dashboards/sales/reports',
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18" />
        <path d="M9 21V9" />
      </>
    ),
  },
];

function Icon({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <svg className={`w-3.5 h-3.5 shrink-0 ${className ?? ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      {children}
    </svg>
  );
}

function NavBadge({ item }: { item: NavItem }) {
  if (!item.badge) return null;

  return (
    <span
      className={`text-[10px] font-bold bg-${item.bclr}-50 text-${item.bclr}-700 dark:bg-${item.bclr}-500/20 dark:text-${item.bclr}-300 border border-${item.bclr}-200/60 dark:border-${item.bclr}-500/30 rounded px-1.5 py-0.5 leading-none`}
    >
      {item.badge}
    </span>
  );
}

export default function SatisPanosuSidebar({ activeId = 'overview', isOpen = false, isDark = false, onSelect, onToggleDark }: SatisPanosuSidebarProps) {
  const navigate = useNavigate();
  const [role, setRole] = useState<'director' | 'staff'>('director');

  const sidebarClassName = `fixed lg:sticky top-0 left-0 h-screen z-50 bg-white dark:bg-[#17181f] border-r border-gray-200 dark:border-gray-600/50 flex flex-col ${
    isOpen ? '' : '-translate-x-full'
  } lg:translate-x-0 transition-transform duration-300`;

  function handleLogout() {
    clearAuthInfo();
    navigate('/login', { replace: true });
  }

  return (
    <aside id="sidebar" className={sidebarClassName} style={{ width: '240px' }}>
      <div className="flex flex-col px-4 border-b border-gray-100 dark:border-gray-600/50" style={{ paddingTop: '18px', paddingBottom: '14px' }}>
        <div className="flex items-center gap-1">
          {['A', 'D', 'O', 'S'].map((letter, index) => (
            <div key={letter} className={`rounded flex items-center justify-center ${index % 2 === 0 ? 'bg-[#2D3748]' : 'bg-[#4A5568]'}`} style={{ width: '28px', height: '28px' }}>
              <span className="text-white font-bold" style={{ fontSize: '12px' }}>
                {letter}
              </span>
            </div>
          ))}
        </div>
        <p className="text-gray-400 dark:text-gray-500 font-mono" style={{ marginTop: '6px', fontSize: '13px' }}>
          Satış Panosu
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto" style={{ padding: '14px 12px' }}>
        <p className="uppercase tracking-wider text-gray-400 dark:text-gray-600 font-semibold" style={{ fontSize: '11px', marginBottom: '8px', paddingLeft: '8px' }}>
          Menü
        </p>
        <ul className="space-y-0.5" id="navList">
          {NAV.map((item) => (
            <li key={item.id}>
              <NavLink
                to={item.route}
                end={item.id === 'overview'}
                onClick={onSelect}
                id={`nb-${item.id}`}
                className={({ isActive }) =>
                  `w-full flex items-center gap-2 px-2 py-2 rounded-md text-[12px] transition-colors ${
                    isActive || item.id === activeId ? 'nav-a' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`
                }
              >
                <Icon>{item.icon}</Icon>
                <span className="flex-1 text-left">{item.label}</span>
                <NavBadge item={item} />
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-gray-100 dark:border-gray-600/50" style={{ padding: '12px' }}>
        <div style={{ marginBottom: '10px' }}>
          <p className="uppercase tracking-wider text-gray-400 dark:text-gray-600 font-semibold" style={{ fontSize: '11px', marginBottom: '6px', paddingLeft: '4px' }}>
            PHASE‑1
          </p>
          <ul style={{ paddingLeft: '4px' }}>
            <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400" style={{ fontSize: '13px', marginBottom: '4px' }}>
              <span className="rounded-full bg-emerald-500" style={{ width: '6px', height: '6px', display: 'inline-block', boxShadow: '0 0 0 3px rgba(16,185,129,.2)', flexShrink: 0 }} />
              Sistem Sağlıklı
            </li>
            <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400" style={{ fontSize: '13px' }}>
              <span className="rounded-full bg-violet-500" style={{ width: '6px', height: '6px', display: 'inline-block', boxShadow: '0 0 0 3px rgba(139,92,246,.2)', flexShrink: 0 }} />
              AI Satış Asistanı Aktif
            </li>
          </ul>
        </div>

        <div style={{ marginBottom: '10px', paddingLeft: '4px' }}>
          <p className="text-gray-400 dark:text-gray-600 font-semibold uppercase tracking-wide" style={{ fontSize: '11px', marginBottom: '6px' }}>
            DEMO — ROL GÖRÜNÜMÜ
          </p>
          <div className="flex gap-1">
            <button
              id="roleDirector"
              onClick={() => setRole('director')}
              className={`flex-1 rounded-lg font-semibold transition-all ${role === 'director' ? 'bg-violet-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
              style={{ fontSize: '12px', padding: '4px 8px', border: 'none', cursor: 'pointer' }}
            >
              Direktör
            </button>
            <button
              id="roleStaff"
              onClick={() => setRole('staff')}
              className={`flex-1 rounded-lg font-semibold transition-all ${role === 'staff' ? 'bg-violet-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
              style={{ fontSize: '12px', padding: '4px 8px', border: 'none', cursor: 'pointer' }}
            >
              Temsilci
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between" style={{ paddingLeft: '4px' }}>
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-violet-600 flex items-center justify-center flex-shrink-0" style={{ width: '26px', height: '26px' }}>
              <span className="text-white font-bold" style={{ fontSize: '10px' }}>
                AY
              </span>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100" style={{ fontSize: '14px' }}>
                Ahmet Y.
              </p>
              <p className="text-gray-400 dark:text-gray-500" style={{ fontSize: '12px' }}>
                Satış Müdürü
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleLogout}
              title="Çıkış Yap"
              className="flex items-center justify-center rounded-md hover:bg-rose-50 dark:hover:bg-rose-500/10 text-gray-400 dark:text-gray-500 hover:text-rose-600 dark:hover:text-rose-300 transition-colors"
              style={{ width: '28px', height: '28px' }}
            >
              <svg style={{ width: '14px', height: '14px' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
            <button onClick={onToggleDark} className="flex items-center justify-center rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 dark:text-gray-500 transition-colors" style={{ width: '28px', height: '28px' }}>
              <svg id="iSun" className={isDark ? '' : 'hidden'} style={{ width: '14px', height: '14px' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
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
              <svg id="iMoon" className={isDark ? 'hidden' : ''} style={{ width: '14px', height: '14px' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
