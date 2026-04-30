import { useEffect, useRef, useState, type FormEvent, type MouseEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { apiFetch } from '../../../utils/api';
import { getStoredTheme, setStoredTheme } from '../../../utils/themeStorage';
import { getDefaultRoute, isAuthenticated, setAuthInfo, type AuthInfo } from '../utils/authStorage';
import LoginMascot from '../components/LoginMascot';
import '../styles/auth.css';

type FocusedField = 'email' | 'password' | null;

export default function Login() {
  const navigate = useNavigate();
  const emailRef = useRef<HTMLInputElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [focusedField, setFocusedField] = useState<FocusedField>(null);
  const [isDark, setIsDark] = useState(() => getStoredTheme() === 'dark');
  const [showPassword, setShowPassword] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('Şifre sıfırlama için sistem yöneticinize başvurunuz.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setStoredTheme(isDark ? 'dark' : 'light');
    emailRef.current?.focus();
  }, [isDark]);

  useEffect(() => {
    if (!showToast) {
      return;
    }

    const toastTimer = window.setTimeout(() => setShowToast(false), 3200);

    return () => window.clearTimeout(toastTimer);
  }, [showToast]);

  if (isAuthenticated()) {
    return <Navigate to={getDefaultRoute()} replace />;
  }

  function toggleDarkMode() {
    const nextDarkMode = !document.documentElement.classList.contains('dark');
    setStoredTheme(nextDarkMode ? 'dark' : 'light');
    setIsDark(nextDarkMode);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get('email') || '').trim();
    const password = String(formData.get('password') || '');

    try {
      const authInfo = await apiFetch<AuthInfo>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      setAuthInfo(authInfo);
      navigate(authInfo.defaultRoute, { replace: true });
    } catch (error) {
      setToastMessage(error instanceof Error ? error.message : 'Giriş yapılamadı.');
      setShowToast(true);
      setIsSubmitting(false);
    }
  }

  function showForgotPasswordToast() {
    setToastMessage('Şifre sıfırlama için sistem yöneticinize başvurunuz.');
    setShowToast(true);
  }

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    setMousePosition({
      x: Math.max(-1, Math.min(1, (event.clientX - centerX) / (rect.width / 2 || 1))),
      y: Math.max(-1, Math.min(1, (event.clientY - centerY) / (rect.height / 2 || 1))),
    });
  }

  return (
    <div
      className="auth-page min-h-screen bg-gray-50 dark:bg-[#0d0e13] text-gray-900 dark:text-gray-100"
      onMouseMove={handleMouseMove}
    >
      <button
        type="button"
        onClick={toggleDarkMode}
        className="fixed top-4 right-4 z-50 flex items-center justify-center rounded-md bg-white dark:bg-[#1e1f26] hover:bg-gray-50 dark:hover:bg-[#2a2b33] text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 transition-colors"
        style={{ width: '34px', height: '34px' }}
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

      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-[380px]">
          <div className="flex flex-col items-center mb-6">
            <LoginMascot focusedField={focusedField} mousePosition={mousePosition} />
            <div className="flex items-center gap-1.5 mb-4">
              <div className="rounded flex items-center justify-center bg-[#2D3748]" style={{ width: '34px', height: '34px' }}>
                <span className="text-white font-bold" style={{ fontSize: '15px' }}>A</span>
              </div>
              <div className="rounded flex items-center justify-center bg-[#4A5568]" style={{ width: '34px', height: '34px' }}>
                <span className="text-white font-bold" style={{ fontSize: '15px' }}>D</span>
              </div>
              <div className="rounded flex items-center justify-center bg-[#2D3748]" style={{ width: '34px', height: '34px' }}>
                <span className="text-white font-bold" style={{ fontSize: '15px' }}>O</span>
              </div>
              <div className="rounded flex items-center justify-center bg-[#4A5568]" style={{ width: '34px', height: '34px' }}>
                <span className="text-white font-bold" style={{ fontSize: '15px' }}>S</span>
              </div>
            </div>
            <h1 className="text-[20px] font-bold text-gray-900 dark:text-gray-100 tracking-tight">Komuta Merkezi</h1>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">Ajans Değil · İşletim Sistemi</p>
          </div>

          <div className="bg-white dark:bg-[#17181f] border border-gray-200 dark:border-gray-700/60 rounded-lg p-6">
            <div className="mb-5">
              <h2 className="text-[15px] font-semibold text-gray-900 dark:text-gray-100">Hoş Geldiniz</h2>
              <p className="text-[12px] text-gray-500 dark:text-gray-400 mt-0.5">Hesabınıza giriş yapın</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-medium text-gray-700 dark:text-gray-300 mb-1.5">E-posta</label>
                <input
                  ref={emailRef}
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@ados.local"
                  autoComplete="email"
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full px-3 py-2.5 text-[13px] bg-white dark:bg-[#1e1f26] border border-gray-300 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:border-gray-900 dark:focus:border-gray-400 transition-colors"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-medium text-gray-700 dark:text-gray-300">Şifre</label>
                  <button
                    type="button"
                    onClick={showForgotPasswordToast}
                    className="text-[11px] text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                  >
                    Şifremi unuttum
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full px-3 py-2.5 pr-10 text-[13px] bg-white dark:bg-[#1e1f26] border border-gray-300 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:border-gray-900 dark:focus:border-gray-400 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((currentValue) => !currentValue)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-0.5"
                  >
                    <svg
                      id="eyeOpen"
                      className={showPassword ? 'hidden' : ''}
                      width="15"
                      height="15"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    <svg
                      id="eyeClosed"
                      className={showPassword ? '' : 'hidden'}
                      width="15"
                      height="15"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer group pt-1">
                <input type="checkbox" id="remember" className="sr-only peer" />
                <span className="w-4 h-4 border border-gray-300 dark:border-gray-600 rounded peer-checked:bg-gray-900 dark:peer-checked:bg-gray-100 peer-checked:border-gray-900 dark:peer-checked:border-gray-100 flex items-center justify-center transition-colors">
                  <svg className="w-3 h-3 text-white dark:text-gray-900 hidden peer-checked:block" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span className="text-[11px] text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">Beni hatırla</span>
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-white text-white dark:text-gray-900 font-semibold text-[13px] rounded-md transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" strokeOpacity=".25" />
                      <path d="M12 2a10 10 0 0 1 10 10" />
                    </svg>
                    Giriş yapılıyor...
                  </>
                ) : (
                  <>
                    Giriş Yap
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700/60">
              <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                Üyelik sistemi bulunmamaktadır. Erişim için sistem yöneticiniz ile iletişime geçiniz.
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-col items-center gap-1 text-[10px] text-gray-400 dark:text-gray-600">
            <div className="flex items-center gap-2">
              <span>arma.digital</span>
              <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
              <span className="font-mono">ADOS v4.1.0</span>
              <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
              <span>© 2026</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              <span>Sistem operasyonel</span>
            </div>
          </div>
        </div>
      </div>

      <div id="toast" className={`fixed bottom-6 right-6 z-50 ${showToast ? '' : 'hidden'}`}>
        <div
          style={{
            background: isDark ? '#1e1f26' : 'white',
            border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
            borderRadius: '8px',
            padding: '12px 16px',
            maxWidth: '320px',
            fontSize: '12px',
            color: isDark ? '#d1d5db' : '#374151',
          }}
        >
          {toastMessage}
        </div>
      </div>
    </div>
  );
}
