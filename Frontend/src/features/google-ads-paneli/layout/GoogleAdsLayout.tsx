import { type ReactNode, useEffect, useState } from 'react';
import GoogleAdsHeader from './GoogleAdsHeader';
import GoogleAdsSidebar from './GoogleAdsSidebar';
import { getStoredTheme, setStoredTheme } from '../../../utils/themeStorage';
import '../styles/google-ads.css';

type GoogleAdsLayoutProps = {
  children: ReactNode;
  activeId?: string;
  breadcrumb?: string;
};

type ToastState = {
  title: string;
  message: string;
  color: 'amber' | 'emerald' | 'rose' | 'sky' | 'violet';
} | null;

const toastColors = {
  amber: { bg: '#f59e0b', bd: '#d97706' },
  emerald: { bg: '#10b981', bd: '#059669' },
  rose: { bg: '#f43f5e', bd: '#e11d48' },
  sky: { bg: '#0ea5e9', bd: '#0284c7' },
  violet: { bg: '#8b5cf6', bd: '#7c3aed' },
};

export default function GoogleAdsLayout({ children, activeId = 'command', breadcrumb = 'ADS · Genel Bakış' }: GoogleAdsLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => getStoredTheme() === 'dark');
  const [toast, setToast] = useState<ToastState>(null);

  useEffect(() => {
    const scriptId = 'tailwind-cdn';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://cdn.tailwindcss.com';
      document.head.appendChild(script);
    }

    const win = window as typeof window & {
      tailwind?: {
        config: Record<string, unknown>;
      };
    };

    win.tailwind = win.tailwind || { config: {} };
    win.tailwind.config = {
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
  }, []);

  useEffect(() => {
    setStoredTheme(isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const toastColor = toast ? toastColors[toast.color] : null;

  return (
    <div className="google-ads-paneli bg-[#fafafa] dark:bg-[#0d0e13] text-gray-900 dark:text-gray-100 tab" id="bd">
      <div className="flex h-screen overflow-hidden">
        <div
          id="ov"
          className={`fixed inset-0 bg-black/50 z-40 lg:hidden ${sidebarOpen ? '' : 'hidden'}`}
          onClick={() => setSidebarOpen(false)}
        />
        <GoogleAdsSidebar
          activeId={activeId}
          isOpen={sidebarOpen}
          isDark={isDark}
          onClose={() => setSidebarOpen(false)}
          onToggleDark={() => setIsDark((current) => !current)}
        />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <GoogleAdsHeader
            breadcrumb={breadcrumb}
            onOpenSidebar={() => setSidebarOpen(true)}
            onJennyClick={() =>
              setToast({
                title: 'Jenny · ADOS AI CEO',
                message: 'Ben buradayım Osman Bey. Komuta Merkezi’nden bana soru sorabilirsiniz.',
                color: 'amber',
              })
            }
          />
          <main className="flex-1 overflow-y-auto">
            <div id="pg" className="max-w-[1500px] mx-auto p-5 md:p-6 lg:p-7 space-y-5 md:space-y-6 su">
              {children}
            </div>
          </main>
        </div>
      </div>
      {toast && toastColor ? (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 9999,
            minWidth: 280,
            maxWidth: 400,
            background: isDark ? '#1e1f26' : 'white',
            borderLeft: `4px solid ${toastColor.bd}`,
            borderRadius: 10,
            boxShadow: '0 8px 24px rgba(0,0,0,.15)',
            padding: '14px 16px',
            animation: 'toastSlide .3s ease-out',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'start', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: toastColor.bg, marginBottom: 2 }}>{toast.title}</div>
              <div style={{ fontSize: 11, color: '#6b7280' }}>{toast.message}</div>
            </div>
            <button type="button" onClick={() => setToast(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: 16 }}>
              ×
            </button>
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              height: 2,
              background: toastColor.bg,
              borderRadius: '0 0 10px 10px',
              animation: 'toastProgress 3s linear',
            }}
          />
        </div>
      ) : null}
    </div>
  );
}
