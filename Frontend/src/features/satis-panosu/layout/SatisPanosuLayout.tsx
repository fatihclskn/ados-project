import { type ReactNode, useEffect, useState } from 'react';
import SatisPanosuHeader from './SatisPanosuHeader';
import SatisPanosuSidebar from './SatisPanosuSidebar';
import { getStoredTheme, setStoredTheme } from '../../../utils/themeStorage';
import '../styles/satis-panosu.css';

type SatisPanosuLayoutProps = {
  children: ReactNode;
  activeId?: string;
  breadcrumb?: string;
};

declare global {
  interface Window {
    tailwind?: {
      config?: unknown;
    };
  }
}

function ensureTailwindCdn() {
  if (document.querySelector('script[src="https://cdn.tailwindcss.com"]')) return;

  const script = document.createElement('script');
  script.src = 'https://cdn.tailwindcss.com';
  script.async = true;
  document.head.appendChild(script);
}

function configureTailwind() {
  window.tailwind = window.tailwind ?? {};
  window.tailwind.config = {
    darkMode: 'class',
    theme: {
      extend: {
        fontFamily: {
          sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
          mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
        },
      },
    },
  };
}

export default function SatisPanosuLayout({ children, activeId = 'overview', breadcrumb = 'Satış · Genel Bakış' }: SatisPanosuLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => getStoredTheme() === 'dark');

  useEffect(() => {
    configureTailwind();
    ensureTailwindCdn();
  }, []);

  useEffect(() => {
    setStoredTheme(isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <div className="bg-[#fafafa] dark:bg-[#0d0e13] text-gray-900 dark:text-gray-100 tab" id="bd">
      <div className="flex h-screen overflow-hidden">
        <div id="ov" className={`fixed inset-0 bg-black/50 z-40 lg:hidden ${sidebarOpen ? '' : 'hidden'}`} onClick={() => setSidebarOpen(false)} />
        <SatisPanosuSidebar
          activeId={activeId}
          isOpen={sidebarOpen}
          isDark={isDark}
          onSelect={() => setSidebarOpen(false)}
          onToggleDark={() => setIsDark((current) => !current)}
        />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <SatisPanosuHeader breadcrumb={breadcrumb} onOpenSidebar={() => setSidebarOpen(true)} />
          <main className="flex-1 overflow-y-auto">
            <div id="pg" className="max-w-[1440px] mx-auto p-5 md:p-6 lg:p-7 space-y-5 md:space-y-6 su">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
