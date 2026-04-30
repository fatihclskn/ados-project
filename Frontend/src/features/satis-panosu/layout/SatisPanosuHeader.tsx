type SatisPanosuHeaderProps = {
  breadcrumb?: string;
  onOpenSidebar: () => void;
};

export default function SatisPanosuHeader({ breadcrumb = 'Satış · Genel Bakış', onOpenSidebar }: SatisPanosuHeaderProps) {
  return (
    <header className="h-12 bg-white dark:bg-[#17181f] border-b border-gray-200 dark:border-gray-600/50 flex items-center gap-3 px-4 shrink-0">
      <button onClick={onOpenSidebar} className="lg:hidden p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md text-gray-500 dark:text-gray-400">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
      <span className="flex-1 text-[12px] text-gray-500 dark:text-gray-400" id="bc">
        {breadcrumb}
      </span>
      <span className="text-[11px] text-gray-400 dark:text-gray-600 font-mono hidden sm:block">22 Nis 2026</span>
      <div className="flex items-center gap-1 px-2 py-1 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-md">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        <span className="text-[11px] text-emerald-700 dark:text-emerald-300 font-medium">Canlı</span>
      </div>
    </header>
  );
}
