import { type ReactNode, useEffect, useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { getStoredTheme, setStoredTheme } from '../utils/themeStorage';

type LayoutProps = {
  children?: ReactNode;
  activeId?: string;
  breadcrumb?: string;
};

const ADOS_LAYOUT_CSS = `
html,body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;-webkit-font-smoothing:antialiased;}
.tab{font-variant-numeric:tabular-nums;}
.hs::-webkit-scrollbar{display:none;}.hs{-ms-overflow-style:none;scrollbar-width:none;}
@keyframes slide-up{from{transform:translateY(8px);opacity:0}to{transform:none;opacity:1}}
.su{animation:slide-up .3s cubic-bezier(.2,.7,.2,1) both;}
@keyframes ai-pulse{0%,100%{opacity:.25;transform:scale(1)}50%{opacity:.55;transform:scale(1.08)}}
.aig{animation:ai-pulse 3s ease-in-out infinite;}
@keyframes exec-shine{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
.exec-text{background-size:200% auto;animation:exec-shine 4s ease-in-out infinite;}
@keyframes pulse-ring{0%{transform:scale(.95);opacity:.8}50%{transform:scale(1.05);opacity:.4}100%{transform:scale(.95);opacity:.8}}
.pulse-ring{animation:pulse-ring 2.5s ease-in-out infinite;}
@keyframes flow-dash{to{stroke-dashoffset:-100}}
.flow-line{stroke-dasharray:8,4;animation:flow-dash 3s linear infinite;}
@keyframes scan-line{0%{top:0}100%{top:100%}}
.scan-anim::before{content:'';position:absolute;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,#f59e0b,transparent);animation:scan-line 3s linear infinite;pointer-events:none;}
button:focus-visible,input:focus-visible,select:focus-visible{outline:2px solid #f59e0b;outline-offset:2px;border-radius:6px;}

/* Font scale (pano ailemizle uyumlu) */
.text-\\[9px\\]{font-size:11px!important;}
.text-\\[10px\\]{font-size:12px!important;}
.text-\\[11px\\]{font-size:13px!important;}
.text-\\[12px\\]{font-size:14px!important;}
.text-\\[13px\\]{font-size:15px!important;}
.text-\\[14px\\]{font-size:16px!important;}
.text-\\[15px\\]{font-size:17px!important;}
.text-\\[19px\\]{font-size:21px!important;}
.text-\\[22px\\]{font-size:24px!important;}
.text-\\[26px\\]{font-size:28px!important;}
.text-\\[32px\\]{font-size:34px!important;}
tbody td{padding-top:12px!important;padding-bottom:12px!important;}
thead th{padding-top:10px!important;padding-bottom:10px!important;}
#navList button,#extraNavList button,#archNavList button{padding-top:7px!important;padding-bottom:7px!important;}
@media(max-width:767px){
  .text-\\[9px\\]{font-size:12px!important;}
  .text-\\[10px\\]{font-size:13px!important;}
  .text-\\[11px\\]{font-size:14px!important;}
  .text-\\[12px\\]{font-size:15px!important;}
  #sidebar{width:85vw!important;max-width:300px!important;}
}
.nav-a{background:linear-gradient(to right,rgba(245,158,11,.15),rgba(139,92,246,.08));color:#f59e0b;font-weight:600;border-left:2px solid #f59e0b;}
.dark .nav-a{background:linear-gradient(to right,rgba(245,158,11,.22),rgba(139,92,246,.15));color:#fbbf24;}
.nav-arch{background:linear-gradient(to right,rgba(139,92,246,.15),rgba(99,102,241,.08));color:#8b5cf6;font-weight:600;border-left:2px solid #8b5cf6;}
.dark .nav-arch{background:linear-gradient(to right,rgba(139,92,246,.25),rgba(99,102,241,.15));color:#a78bfa;}
@keyframes toastSlide{from{transform:translateX(60px);opacity:0;}to{transform:translateX(0);opacity:1;}}
@keyframes toastProgress{from{width:100%;}to{width:0%;}}

/* Modal system */
@keyframes modal-fade{from{opacity:0}to{opacity:1}}
@keyframes modal-slide{from{transform:translateY(20px) scale(.98);opacity:0}to{transform:translateY(0) scale(1);opacity:1}}
.modal-overlay{animation:modal-fade .2s ease-out;}
.modal-panel{animation:modal-slide .25s cubic-bezier(.2,.7,.2,1);}
.modal-scroll::-webkit-scrollbar{width:8px;}
.modal-scroll::-webkit-scrollbar-track{background:transparent;}
.modal-scroll::-webkit-scrollbar-thumb{background:rgba(156,163,175,.3);border-radius:4px;}
.modal-scroll::-webkit-scrollbar-thumb:hover{background:rgba(156,163,175,.5);}

/* Trigger popover */
.trigger-btn{position:relative;}
.trigger-btn .trigger-pop{position:absolute;z-index:40;opacity:0;visibility:hidden;pointer-events:none;transition:all .2s;transform:translateY(4px);}
.trigger-btn:hover .trigger-pop,.trigger-btn:focus-within .trigger-pop{opacity:1;visibility:visible;transform:translateY(0);pointer-events:auto;}

/* Glow */
.glow-amber{box-shadow:0 0 20px rgba(245,158,11,.3),0 0 40px rgba(245,158,11,.1);}
.glow-violet{box-shadow:0 0 20px rgba(139,92,246,.3),0 0 40px rgba(139,92,246,.1);}

/* Code-style */
.mono-dim{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:10px;color:#94a3b8;}
`;

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

export default function Layout({ children, activeId = 'command', breadcrumb }: LayoutProps) {
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
    <>
      <style>{ADOS_LAYOUT_CSS}</style>
      <div className="bg-[#fafafa] dark:bg-[#0d0e13] text-gray-900 dark:text-gray-100 tab" id="bd">
        <div className="flex h-screen overflow-hidden">
          <div
            id="ov"
            className={`fixed inset-0 bg-black/50 z-40 lg:hidden ${sidebarOpen ? '' : 'hidden'}`}
            onClick={() => setSidebarOpen(false)}
          />
          <Sidebar
            activeId={activeId}
            isOpen={sidebarOpen}
            isDark={isDark}
            onSelect={() => setSidebarOpen(false)}
            onToggleDark={() => setIsDark((current) => !current)}
          />
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <Header breadcrumb={breadcrumb} onOpenSidebar={() => setSidebarOpen(true)} />
            <main className="flex-1 overflow-y-auto">
              <div id="pg" className="max-w-[1500px] mx-auto p-5 md:p-6 lg:p-7 space-y-5 md:space-y-6 su">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
