import { NavLink, useNavigate } from 'react-router-dom';
import { clearAuthInfo, getAuthInfo } from '../features/auth/utils/authStorage';

type NavItem = {
  id: string;
  label: string;
  badge: string;
  bclr: string;
  icon: string;
};

type SidebarProps = {
  activeId?: string;
  isOpen?: boolean;
  isDark?: boolean;
  onSelect?: (id: string) => void;
  onToggleDark?: () => void;
};

const NAV: NavItem[] = [
  {
    id: 'command',
    label: 'Komuta Merkezi',
    badge: '',
    bclr: 'amber',
    icon: '<circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>',
  },
  {
    id: 'financial',
    label: 'Finansal Panorama',
    badge: '',
    bclr: 'emerald',
    icon: '<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
  },
  {
    id: 'pipeline',
    label: 'Satış & Pipeline',
    badge: '₺4.2M',
    bclr: 'sky',
    icon: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
  },
  {
    id: 'customers',
    label: 'Müşteri Portföyü',
    badge: '87',
    bclr: 'violet',
    icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  },
  {
    id: 'operations',
    label: 'Ekip & Operasyon',
    badge: '42',
    bclr: 'indigo',
    icon: '<rect x="3" y="3" width="18" height="18" rx="2"/>',
  },
  {
    id: 'approvals',
    label: 'Onay Kuyruğu',
    badge: '18',
    bclr: 'rose',
    icon: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
  },
  {
    id: 'reports',
    label: 'Stratejik Raporlar',
    badge: '',
    bclr: '',
    icon: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/>',
  },
];

const ARCH_NAV: NavItem[] = [
  {
    id: 'orchestrator',
    label: 'Orchestrator',
    badge: 'CORE',
    bclr: 'violet',
    icon: '<circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 10v6M4.22 4.22l4.24 4.24m7.08 7.08 4.24 4.24M1 12h6m10 0h6M4.22 19.78l4.24-4.24m7.08-7.08 4.24-4.24"/>',
  },
  {
    id: 'json-agents',
    label: 'JSON Ajanları',
    badge: '18',
    bclr: 'indigo',
    icon: '<path d="M4 4h16v16H4z"/><path d="M4 12h16"/><path d="M12 4v16"/>',
  },
  {
    id: 'prompts',
    label: 'Prompt Kütüphanesi',
    badge: '47',
    bclr: 'sky',
    icon: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  },
  {
    id: 'ai-router',
    label: 'AI Yönetimi',
    badge: '10',
    bclr: 'pink',
    icon: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>',
  },
  {
    id: 'integrations',
    label: 'Entegrasyonlar',
    badge: '23/27',
    bclr: 'teal',
    icon: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  },
  {
    id: 'audit',
    label: 'Genel Ayarlar',
    badge: '',
    bclr: '',
    icon: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  },
];

const EXTRA_NAV: NavItem[] = [
  {
    id: 'panels',
    label: 'Panolar',
    badge: '4',
    bclr: 'amber',
    icon: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>',
  },
];

const NAV_ROUTES: Partial<Record<string, string>> = {
  command: '/dashboard',
  financial: '/finance',
  pipeline: '/sales',
  customers: '/customers',
  operations: '/team',
  approvals: '/approvals',
  reports: '/strategic-reports',
  orchestrator: '/orchestrator',
  'json-agents': '/json-agents',
  prompts: '/prompt-library',
  'ai-router': '/ai-management',
  integrations: '/integrations',
  audit: '/settings',
  panels: '/dashboards',
};

function Icon({ icon, className }: { icon: string; className: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      dangerouslySetInnerHTML={{ __html: icon }}
    />
  );
}

function Badge({ item, compact = false }: { item: NavItem; compact?: boolean }) {
  if (!item.badge) return null;

  const emptyColorClass = 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
  const colorClass = item.bclr
    ? `bg-${item.bclr}-50 text-${item.bclr}-700 dark:bg-${item.bclr}-500/20 dark:text-${item.bclr}-300 border border-${item.bclr}-200/60 dark:border-${item.bclr}-500/30`
    : emptyColorClass;

  return (
    <span className={`${compact ? 'text-[9px]' : 'text-[10px]'} font-bold ${colorClass} rounded px-1.5 py-0.5 leading-none`}>
      {item.badge}
    </span>
  );
}

function NavButton({
  item,
  activeId,
  activeClassName,
  compactBadge,
  passive,
  onSelect,
}: {
  item: NavItem;
  activeId: string;
  activeClassName: string;
  compactBadge?: boolean;
  passive?: boolean;
  onSelect?: (id: string) => void;
}) {
  const inactiveClassName = 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50';
  const className = `w-full flex items-center gap-2 px-2 py-2 rounded-md text-[12px] transition-colors ${
    item.id === activeId ? activeClassName : inactiveClassName
  }`;
  const route = NAV_ROUTES[item.id];

  const content = (
    <>
      <Icon icon={item.icon} className="w-4 h-4 shrink-0" />
      <span className="flex-1 text-left">{item.label}</span>
      <Badge item={item} compact={compactBadge} />
    </>
  );

  return (
    <li>
      {route ? (
        <NavLink to={route} onClick={() => onSelect?.(item.id)} id={`nb-${item.id}`} className={className}>
          {content}
        </NavLink>
      ) : passive ? (
        <button type="button" id={`nb-${item.id}`} className={className}>
          {content}
        </button>
      ) : (
        <button type="button" onClick={() => onSelect?.(item.id)} id={`nb-${item.id}`} className={className}>
          {content}
        </button>
      )}
    </li>
  );
}

export default function Sidebar({
  activeId = 'command',
  isOpen = false,
  isDark = false,
  onSelect,
  onToggleDark,
}: SidebarProps) {
  const navigate = useNavigate();
  const authInfo = getAuthInfo();
  const fullName = authInfo?.fullName ?? 'ADOS Kullanıcısı';
  const role = authInfo?.role ?? 'Kullanıcı';
  const initials = fullName
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toLocaleUpperCase('tr-TR');
  const sidebarClassName = `fixed lg:sticky top-0 left-0 h-screen z-50 bg-white dark:bg-[#17181f] border-r border-gray-200 dark:border-gray-600/50 flex flex-col ${
    isOpen ? '' : '-translate-x-full'
  } lg:translate-x-0 transition-transform duration-300`;

  function handleLogout() {
    clearAuthInfo();
    navigate('/login', { replace: true });
  }

  return (
    <aside id="sidebar" className={sidebarClassName} style={{ width: '250px' }}>
      <div className="flex flex-col px-4 border-b border-gray-100 dark:border-gray-600/50" style={{ paddingTop: '18px', paddingBottom: '14px' }}>
        <div className="flex items-center gap-1">
          <div className="rounded flex items-center justify-center bg-[#2D3748]" style={{ width: '28px', height: '28px' }}>
            <span className="text-white font-bold" style={{ fontSize: '12px' }}>
              A
            </span>
          </div>
          <div className="rounded flex items-center justify-center bg-[#4A5568]" style={{ width: '28px', height: '28px' }}>
            <span className="text-white font-bold" style={{ fontSize: '12px' }}>
              D
            </span>
          </div>
          <div className="rounded flex items-center justify-center bg-[#2D3748]" style={{ width: '28px', height: '28px' }}>
            <span className="text-white font-bold" style={{ fontSize: '12px' }}>
              O
            </span>
          </div>
          <div className="rounded flex items-center justify-center bg-[#4A5568]" style={{ width: '28px', height: '28px' }}>
            <span className="text-white font-bold" style={{ fontSize: '12px' }}>
              S
            </span>
          </div>
        </div>
        <p className="text-gray-400 dark:text-gray-500 font-mono" style={{ marginTop: '6px', fontSize: '13px' }}>
          Komuta Merkezi
        </p>
        <p
          className="text-gray-500 dark:text-gray-600"
          style={{ fontSize: '10px', marginTop: '2px', fontFamily: 'ui-monospace,Menlo,Consolas,monospace' }}
        >
          osman.atasoy · ceo + architect
        </p>
      </div>

      <nav className="flex-1" style={{ padding: '14px 10px' }}>
        <div className="flex items-center gap-1.5 px-2 mb-2">
          <svg className="w-3 h-3 text-amber-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <p className="uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold" style={{ fontSize: '10px' }}>
            Yönetim · CEO
          </p>
        </div>
        <ul className="space-y-0.5" id="navList">
          {NAV.map((item) => (
            <NavButton key={item.id} item={item} activeId={activeId} activeClassName="nav-a" onSelect={onSelect} />
          ))}
        </ul>

        <div className="flex items-center gap-1.5 px-2 mt-5 mb-2">
          <svg className="w-3 h-3 text-violet-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
          <p className="uppercase tracking-wider text-violet-600 dark:text-violet-400 font-bold" style={{ fontSize: '10px' }}>
            ADOS · Mimar
          </p>
        </div>
        <ul className="space-y-0.5" id="archNavList">
          {ARCH_NAV.map((item) => (
            <NavButton key={item.id} item={item} activeId={activeId} activeClassName="nav-arch" compactBadge onSelect={onSelect} />
          ))}
        </ul>

        <ul className="space-y-0.5 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/40" id="extraNavList">
          {EXTRA_NAV.map((item) => (
            <NavButton key={item.id} item={item} activeId={activeId} activeClassName="nav-a" onSelect={onSelect} />
          ))}
        </ul>
      </nav>

      <div className="border-t border-gray-100 dark:border-gray-600/50" style={{ padding: '12px' }}>
        <div style={{ marginBottom: '10px' }}>
          <div className="flex items-center justify-between mb-1" style={{ paddingLeft: '4px' }}>
            <p className="uppercase tracking-wider text-gray-400 dark:text-gray-600 font-semibold" style={{ fontSize: '10px' }}>
              ADOS · SİSTEM
            </p>
            <span className="text-[9px] font-mono text-gray-400 dark:text-gray-500">v4.1.0</span>
          </div>
          <ul style={{ paddingLeft: '4px' }}>
            <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400" style={{ fontSize: '12px', marginBottom: '4px' }}>
              <span
                className="rounded-full bg-emerald-500"
                style={{ width: '6px', height: '6px', display: 'inline-block', boxShadow: '0 0 0 3px rgba(16,185,129,.2)', flexShrink: 0 }}
              />
              Orchestrator · Sağlıklı
            </li>
            <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400" style={{ fontSize: '12px', marginBottom: '4px' }}>
              <span
                className="rounded-full bg-amber-500"
                style={{ width: '6px', height: '6px', display: 'inline-block', boxShadow: '0 0 0 3px rgba(245,158,11,.2)', flexShrink: 0 }}
              />
              9/11 Entegrasyon
            </li>
            <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400" style={{ fontSize: '12px' }}>
              <span
                className="rounded-full bg-violet-500"
                style={{ width: '6px', height: '6px', display: 'inline-block', boxShadow: '0 0 0 3px rgba(139,92,246,.2)', flexShrink: 0 }}
              />
              18 Agent · 47 Prompt
            </li>
          </ul>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-600/50" style={{ paddingLeft: '4px' }}>
          <div className="flex items-center gap-2">
            <div className="relative">
              <div
                className="rounded-full bg-gradient-to-br from-amber-500 via-orange-500 to-violet-600 flex items-center justify-center flex-shrink-0"
                style={{ width: '30px', height: '30px' }}
              >
                <span className="text-white font-bold" style={{ fontSize: '10px' }}>
                  {initials}
                </span>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-[#17181f]" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100" style={{ fontSize: '13px' }}>
                {fullName}
              </p>
              <p className="text-gray-400 dark:text-gray-500" style={{ fontSize: '11px' }}>
                {role}
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
            <button
              onClick={onToggleDark}
              className="flex items-center justify-center rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 dark:text-gray-500 transition-colors"
              style={{ width: '28px', height: '28px' }}
            >
              <svg
                id="iSun"
                className={isDark ? '' : 'hidden'}
                style={{ width: '14px', height: '14px' }}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
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
              <svg
                id="iMoon"
                className={isDark ? 'hidden' : ''}
                style={{ width: '14px', height: '14px' }}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
