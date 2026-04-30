import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

type DashboardFrameProps = {
  html: string;
  title: string;
  bridge?: 'login' | 'general-manager';
};

const panelRoutes: Record<string, string> = {
  'pano-pazarlama': '/marketing',
  'pano-satis': '/sales',
  'pano-finans': '/finance',
  'pano-ads': '/google-ads',
};

function scriptTag(source: string) {
  return `<script>${source.replace(/<\/script/gi, '<\\/script')}</script>`;
}

function injectBeforeBodyEnd(html: string, source: string) {
  const bridgeScript = scriptTag(source);
  return html.includes('</body>')
    ? html.replace('</body>', `${bridgeScript}</body>`)
    : `${html}${bridgeScript}`;
}

function withBridge(html: string, bridge?: DashboardFrameProps['bridge']) {
  const baseBridge = `
    window.__adosNavigate = function(path) {
      window.parent.postMessage({ type: 'ADOS_NAVIGATE', path: path }, '*');
    };
  `;

  if (bridge === 'login') {
    return injectBeforeBodyEnd(
      html,
      `${baseBridge}
      window.login = function() {
        var btn = document.querySelector('button[type="submit"]');
        if (btn) {
          btn.innerHTML = '<svg class="animate-spin w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke-opacity=".25"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>Giriş yapılıyor...';
          btn.disabled = true;
        }
        setTimeout(function(){ window.__adosNavigate('/general'); }, 500);
      };`,
    );
  }

  if (bridge === 'general-manager') {
    return injectBeforeBodyEnd(
      html,
      `${baseBridge}
      (function(){
        var routes = ${JSON.stringify(panelRoutes)};
        var originalGoToPanel = window.goToPanel;
        window.goToPanel = function(id) {
          if (routes[id]) {
            window.__adosNavigate(routes[id]);
            return;
          }
          if (typeof originalGoToPanel === 'function') {
            return originalGoToPanel.apply(this, arguments);
          }
        };
      })();`,
    );
  }

  return injectBeforeBodyEnd(html, baseBridge);
}

export default function DashboardFrame({ html, title, bridge }: DashboardFrameProps) {
  const navigate = useNavigate();
  const srcDoc = useMemo(() => withBridge(html, bridge), [html, bridge]);

  useEffect(() => {
    document.title = title;

    function onMessage(event: MessageEvent) {
      if (event.data?.type === 'ADOS_NAVIGATE' && typeof event.data.path === 'string') {
        navigate(event.data.path);
      }
    }

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [navigate, title]);

  return <iframe className="ados-frame" srcDoc={srcDoc} title={title} />;
}
