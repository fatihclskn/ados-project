import { type ReactNode, useEffect, useState } from 'react';
import PazarlamaPanosuHeader from './PazarlamaPanosuHeader';
import PazarlamaPanosuSidebar from './PazarlamaPanosuSidebar';
import { getStoredTheme, setStoredTheme } from '../../../utils/themeStorage';
import '../styles/pazarlama-panosu.css';

type PazarlamaPanosuLayoutProps = {
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

export default function PazarlamaPanosuLayout({ children, activeId = 'overview', breadcrumb = 'Pazarlama · Genel Bakış' }: PazarlamaPanosuLayoutProps) {
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
    <div className="pazarlama-panosu bg-[#fafafa] dark:bg-[#0a0a0c] text-gray-900 dark:text-gray-100 tab" id="bd">
      <div className="flex h-screen overflow-hidden">
        <div id="ov" className={`fixed inset-0 bg-black/50 z-40 lg:hidden ${sidebarOpen ? '' : 'hidden'}`} onClick={() => setSidebarOpen(false)} />
        <PazarlamaPanosuSidebar activeId={activeId} isOpen={sidebarOpen} isDark={isDark} onSelect={() => setSidebarOpen(false)} onToggleDark={() => setIsDark((current) => !current)} />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <PazarlamaPanosuHeader breadcrumb={breadcrumb} onOpenSidebar={() => setSidebarOpen(true)} />
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
