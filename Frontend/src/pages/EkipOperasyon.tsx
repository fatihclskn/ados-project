import { type FormEvent, type MouseEvent, useEffect, useRef, useState } from 'react';
import Layout from '../components/Layout';
import {
  createPersonnel,
  getPersonnel,
  getPersonnelById,
  updatePersonnel,
  updatePersonnelStatus,
  type CreatePersonnelPayload,
  type Personnel,
  type UpdatePersonnelPayload,
} from '../services/personnelApi';

type PersonnelRecord = Personnel &
  Record<string, unknown> & {
    FullName?: unknown;
    Email?: unknown;
    Phone?: unknown;
    Position?: unknown;
    Department?: unknown;
    Role?: unknown;
    IsActive?: unknown;
    HasAdosAccess?: unknown;
    MfaEnabled?: unknown;
    StartDate?: unknown;
    Id?: unknown;
  };
type ModalState = { type: 'detail'; name: string; role: string; unit: string; access: string; personnel?: Personnel } | { type: 'new' } | null;
type ToastState = { title: string; message: string; color: 'emerald' | 'rose' | 'amber' | 'sky' | 'violet' | 'gray' } | null;

const ROLE_OPTIONS = [
  'MasterAdmin',
  'GenelMudur',
  'Pazarlama',
  'PazarlamaYonetim',
  'Satis',
  'SatisYonetim',
  'Finans',
  'FinansYonetim',
];

export default function EkipOperasyon() {
  const contentRef = useRef<HTMLDivElement>(null);
  const [modal, setModal] = useState<ModalState>(null);
  const [toast, setToast] = useState<ToastState>(null);
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const personnelList = Array.isArray(personnel) ? personnel : [];
  const totalPersonnel = personnelList.length;
  const activePersonnel = personnelList.filter((person) => bool((person as PersonnelRecord).isActive ?? (person as PersonnelRecord).IsActive)).length;
  const inactivePersonnel = totalPersonnel - activePersonnel;
  const adosAccessCount = personnelList.filter((person) => bool((person as PersonnelRecord).hasAdosAccess ?? (person as PersonnelRecord).HasAdosAccess)).length;
  const plannerCount = totalPersonnel - adosAccessCount;
  const mfaCount = personnelList.filter((person) => bool((person as PersonnelRecord).mfaEnabled ?? (person as PersonnelRecord).MfaEnabled)).length;
  const uniqueRoleCount = new Set(personnelList.map((person) => getFieldText(person, 'role', 'Role')).filter(Boolean)).size;
  const departmentSummary = summarizeCounts(personnelList.map((person) => getFieldText(person, 'department', 'Department')));
  const roleSummary = summarizeCounts(personnelList.map((person) => getFieldText(person, 'role', 'Role')));

  useEffect(() => {
    let isMounted = true;

    getPersonnel()
      .then((items) => {
        if (isMounted) {
          setPersonnel(Array.isArray(items) ? items : []);
        }
      })
      .catch((error) => {
        if (isMounted) {
          setToast({
            title: 'Personel Verisi',
            message: error instanceof Error ? error.message : 'Personel listesi alınamadı.',
            color: 'amber',
          });
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const timer = toast ? window.setTimeout(() => setToast(null), 3000) : undefined;
    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [toast]);

  async function openPersonnelDetail(person: Personnel) {
    try {
      const freshPerson = await getPersonnelById(person.id);
      setModal({
        type: 'detail',
        name: freshPerson.fullName,
        role: freshPerson.position,
        unit: freshPerson.department,
        access: freshPerson.hasAdosAccess ? `${freshPerson.role} · ADOS Panel Kullanıcısı` : 'Planner Takibi',
        personnel: freshPerson,
      });
    } catch (error) {
      setModal({
        type: 'detail',
        name: person.fullName,
        role: person.position,
        unit: person.department,
        access: person.hasAdosAccess ? `${person.role} · ADOS Panel Kullanıcısı` : 'Planner Takibi',
        personnel: person,
      });
      setToast({
        title: 'Personel Detayı',
        message: error instanceof Error ? error.message : 'Detay verisi yenilenemedi.',
        color: 'amber',
      });
    }
  }

  async function handleUpdatePersonnel(id: number, payload: UpdatePersonnelPayload) {
    try {
      const updatedPerson = await updatePersonnel(id, payload);
      setPersonnel((currentPersonnel) => (Array.isArray(currentPersonnel) ? currentPersonnel : []).map((person) => (getFieldNumber(person, 'id', 'Id') === id ? updatedPerson : person)));
      setModal({
        type: 'detail',
        name: updatedPerson.fullName,
        role: updatedPerson.position,
        unit: updatedPerson.department,
        access: updatedPerson.hasAdosAccess ? `${updatedPerson.role} · ADOS Panel Kullanıcısı` : 'Planner Takibi',
        personnel: updatedPerson,
      });
      setToast({ title: 'Kaydedildi', message: `${updatedPerson.fullName} bilgileri database'e yazıldı.`, color: 'emerald' });
    } catch (error) {
      setToast({ title: 'Kaydedilemedi', message: error instanceof Error ? error.message : 'Güncelleme sırasında hata oluştu.', color: 'rose' });
    }
  }

  async function handleUpdatePersonnelStatus(id: number, isActive: boolean) {
    try {
      const updatedPerson = await updatePersonnelStatus(id, isActive);
      setPersonnel((currentPersonnel) => (Array.isArray(currentPersonnel) ? currentPersonnel : []).map((person) => (getFieldNumber(person, 'id', 'Id') === id ? updatedPerson : person)));
      setModal({
        type: 'detail',
        name: updatedPerson.fullName,
        role: updatedPerson.position,
        unit: updatedPerson.department,
        access: updatedPerson.hasAdosAccess ? `${updatedPerson.role} · ADOS Panel Kullanıcısı` : 'Planner Takibi',
        personnel: updatedPerson,
      });
      setToast({
        title: isActive ? 'Aktifleştirildi' : 'Pasifleştirildi',
        message: `${updatedPerson.fullName} durumu güncellendi.`,
        color: isActive ? 'emerald' : 'rose',
      });
    } catch (error) {
      setToast({ title: 'Durum Güncellenemedi', message: error instanceof Error ? error.message : 'İşlem sırasında hata oluştu.', color: 'rose' });
    }
  }

  function getPersonFromTarget(target: HTMLElement) {
    const firstTable = contentRef.current?.querySelector('table');
    const row = target.closest('tbody tr');
    if (!firstTable || !row || !firstTable.contains(row)) return null;
    const cells = Array.from(row.querySelectorAll('td'));
    return {
      name: cells[0]?.querySelector('p')?.textContent?.trim() || '',
      role: cells[1]?.querySelector('p')?.textContent?.trim() || 'Ekip Kullanıcısı',
      unit: cells[1]?.querySelectorAll('p')[1]?.textContent?.trim() || 'Operasyon',
      access: cells[4]?.textContent?.trim() || 'ADOS Panel Kullanıcısı',
    };
  }

  function handleContentClick(event: MouseEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement;
    const button = target.closest('button');
    const buttonText = button?.textContent?.trim() ?? '';

    if (buttonText.includes('Yeni Personel Ekle')) {
      setModal({ type: 'new' });
      return;
    }

    if (buttonText.includes('Rolleri') || buttonText.includes('Matrisi')) {
      setToast({ title: 'Rol Düzenleme', message: 'Roller & yetkiler matrisi düzenleme ekranı açılıyor · tam özellikli sürüm yakında', color: 'amber' });
      return;
    }

    if (buttonText.includes('Tam JSON')) {
      setToast({ title: 'Tam JSON', message: 'Operasyon_Ekip.JSON tam görünümü açılıyor', color: 'violet' });
      return;
    }

    const person = getPersonFromTarget(target);
    if (person?.name) {
      setModal({ type: 'detail', ...person });
      return;
    }

    if (buttonText.includes('Düzenle')) {
      setToast({ title: 'Rol Düzenleme', message: 'Roller & yetkiler matrisi düzenleme ekranı açılıyor · tam özellikli sürüm yakında', color: 'amber' });
    }
  }

  return (
    <Layout activeId="operations" breadcrumb="Genel Müdür · Ekip & Operasyon">
      <>
        <div className="relative">
        <div ref={contentRef} onClick={handleContentClick} className="space-y-5 md:space-y-6">
        {/* Başlık + CTA'lar */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg flex items-center justify-center">
                <svg className="text-indigo-600 dark:text-indigo-400 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <div>
                <h1 className="text-[19px] font-bold text-gray-900 dark:text-gray-100 leading-tight">Ekip & Operasyon</h1>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">Personel yönetimi · ADOS panel erişim & yetki · <span className="font-mono">Operasyon_Ekip.JSON v1.0.0</span></p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button onClick={() => undefined} className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-[11px] font-semibold rounded-md hover:bg-gray-50 dark:hover:bg-[#23242c] transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                Rolleri Düzenle
              </button>
              <button onClick={() => undefined} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 dark:bg-gray-100 dark:text-gray-900 text-white text-[11px] font-semibold rounded-md hover:opacity-90 transition-opacity">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
                Yeni Personel Ekle
              </button>
            </div>
          </div>
        
          {/* 6 KPI */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3">
            
            <div className="relative overflow-hidden bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-3.5 hover:shadow-sm hover:-translate-y-0.5 transition-all">
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-violet-500/5 rounded-full blur-xl pointer-events-none"></div>
              <div className="relative flex items-start justify-between mb-2">
                <div className="w-8 h-8 bg-violet-100 dark:bg-violet-900/30 rounded-lg flex items-center justify-center"><svg className="text-violet-700 dark:text-violet-300 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg></div>
                <span className="text-[9px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded">{activePersonnel}</span>
              </div>
              <div className="relative text-[22px] font-bold text-gray-900 dark:text-gray-50 leading-none mb-1">{totalPersonnel}</div>
              <div className="relative text-[11px] font-semibold text-gray-600 dark:text-gray-400 leading-tight">Toplam Personel</div>
              <div className="relative text-[9px] text-gray-400 dark:text-gray-500 mt-0.5">ADOS {adosAccessCount} · Planner {plannerCount}</div>
            </div>
            <div className="relative overflow-hidden bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-3.5 hover:shadow-sm hover:-translate-y-0.5 transition-all">
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-sky-500/5 rounded-full blur-xl pointer-events-none"></div>
              <div className="relative flex items-start justify-between mb-2">
                <div className="w-8 h-8 bg-sky-100 dark:bg-sky-900/30 rounded-lg flex items-center justify-center"><svg className="text-sky-700 dark:text-sky-300 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
                <span className="text-[9px] font-semibold text-gray-400 dark:text-gray-500 px-1.5 py-0.5">—</span>
              </div>
              <div className="relative text-[22px] font-bold text-gray-900 dark:text-gray-50 leading-none mb-1">{uniqueRoleCount}</div>
              <div className="relative text-[11px] font-semibold text-gray-600 dark:text-gray-400 leading-tight">Tanımlı Rol</div>
              <div className="relative text-[9px] text-gray-400 dark:text-gray-500 mt-0.5">{roleSummary || 'Rol yok'}</div>
            </div>
            <div className="relative overflow-hidden bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-3.5 hover:shadow-sm hover:-translate-y-0.5 transition-all">
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none"></div>
              <div className="relative flex items-start justify-between mb-2">
                <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center"><svg className="text-emerald-700 dark:text-emerald-300 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
                <span className="text-[9px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded">{inactivePersonnel}</span>
              </div>
              <div className="relative text-[22px] font-bold text-gray-900 dark:text-gray-50 leading-none mb-1">{activePersonnel}</div>
              <div className="relative text-[11px] font-semibold text-gray-600 dark:text-gray-400 leading-tight">Aktif Personel</div>
              <div className="relative text-[9px] text-gray-400 dark:text-gray-500 mt-0.5">Pasif {inactivePersonnel}</div>
            </div>
            <div className="relative overflow-hidden bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-3.5 hover:shadow-sm hover:-translate-y-0.5 transition-all">
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-teal-500/5 rounded-full blur-xl pointer-events-none"></div>
              <div className="relative flex items-start justify-between mb-2">
                <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center"><svg className="text-teal-700 dark:text-teal-300 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>
                <span className="text-[9px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded">{adosAccessCount}</span>
              </div>
              <div className="relative text-[22px] font-bold text-gray-900 dark:text-gray-50 leading-none mb-1">{adosAccessCount}</div>
              <div className="relative text-[11px] font-semibold text-gray-600 dark:text-gray-400 leading-tight">ADOS Erişimi</div>
              <div className="relative text-[9px] text-gray-400 dark:text-gray-500 mt-0.5">MFA {mfaCount}/{Math.max(adosAccessCount, 1)}</div>
            </div>
            <div className="relative overflow-hidden bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-3.5 hover:shadow-sm hover:-translate-y-0.5 transition-all">
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl pointer-events-none"></div>
              <div className="relative flex items-start justify-between mb-2">
                <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center"><svg className="text-indigo-700 dark:text-indigo-300 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div>
                <span className="text-[9px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded">+3</span>
              </div>
              <div className="relative text-[22px] font-bold text-gray-900 dark:text-gray-50 leading-none mb-1">{Object.keys(groupCounts(personnelList.map((person) => getFieldText(person, 'department', 'Department')))).length}</div>
              <div className="relative text-[11px] font-semibold text-gray-600 dark:text-gray-400 leading-tight">Departman</div>
              <div className="relative text-[9px] text-gray-400 dark:text-gray-500 mt-0.5">{departmentSummary || 'Departman yok'}</div>
            </div>
            <div className="relative overflow-hidden bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl p-3.5 hover:shadow-sm hover:-translate-y-0.5 transition-all">
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none"></div>
              <div className="relative flex items-start justify-between mb-2">
                <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center"><svg className="text-amber-700 dark:text-amber-300 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/></svg></div>
                <span className="text-[9px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 px-1.5 py-0.5 rounded">!</span>
              </div>
              <div className="relative text-[22px] font-bold text-gray-900 dark:text-gray-50 leading-none mb-1">{inactivePersonnel}</div>
              <div className="relative text-[11px] font-semibold text-gray-600 dark:text-gray-400 leading-tight">Pasif Personel</div>
              <div className="relative text-[9px] text-gray-400 dark:text-gray-500 mt-0.5">IsActive false</div>
            </div>
          </div>
        
          {/* ADOS Felsefesi Bilgi Bandı */}
          <div className="bg-gradient-to-br from-violet-50 via-white to-amber-50/50 dark:from-violet-500/5 dark:via-transparent dark:to-amber-500/5 border border-violet-200 dark:border-violet-500/20 rounded-xl p-3 flex items-start gap-2.5">
            <svg className="text-violet-600 dark:text-violet-400 w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            <div className="flex-1">
              <p className="text-[11px] text-gray-700 dark:text-gray-300"><span className="font-bold text-violet-700 dark:text-violet-300">ADOS felsefesi:</span> Bu panel sadece <span className="font-semibold">departman yöneticileri</span> ve <span className="font-semibold">yetki verilen kişiler</span> tarafından kullanılır. Diğer ekip üyeleri <span className="font-mono font-semibold">Microsoft Planner</span> üzerinden atanan görevlerle takip edilir. Tüm personel verisi bu sayfadan yönetilir, <span className="font-mono font-semibold">Operasyon_Ekip.JSON</span>'a yazılır.</p>
            </div>
          </div>
        
          {/* Personel Listesi */}
          <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700/40">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <svg className="text-indigo-600 dark:text-indigo-400 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  <div>
                    <h4 className="text-[13px] font-bold text-gray-900 dark:text-gray-100">Personel Listesi</h4>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">{totalPersonnel} kayıt · satıra tıklayın ya da Düzenle ile detay kartını açın</p>
                  </div>
                </div>
              </div>
            </div>
        
            {/* Personel Tablo */}
            <div>
              <table className="w-full text-[11px]">
                <thead className="bg-gray-50 dark:bg-[#17181f]">
                  <tr>
                    <th className="text-left px-3 py-2.5 text-[9px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Personel</th>
                    <th className="hidden md:table-cell text-left px-3 py-2.5 text-[9px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pozisyon · Birim</th>
                    <th className="hidden lg:table-cell text-left px-3 py-2.5 text-[9px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">İşe Başlama</th>
                    <th className="hidden lg:table-cell text-center px-3 py-2.5 text-[9px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Performans</th>
                    <th className="text-left px-3 py-2.5 text-[9px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">ADOS Erişim</th>
                    <th className="text-right px-3 py-2.5 text-[9px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700/40">
                  {personnelList.map((person, index) => {
                    const personId = getFieldNumber(person, 'id', 'Id');
                    const fullName = getFieldText(person, 'fullName', 'FullName') || 'İsimsiz Personel';
                    const position = getFieldText(person, 'position', 'Position') || 'Pozisyon yok';
                    const department = getFieldText(person, 'department', 'Department') || 'Birim yok';
                    const role = getFieldText(person, 'role', 'Role') || 'Rol yok';
                    const isActive = getFieldBool(person, 'isActive', 'IsActive');
                    const hasAdosAccess = getFieldBool(person, 'hasAdosAccess', 'HasAdosAccess');
                    const startDate = getFieldText(person, 'startDate', 'StartDate');
                    const initials = getInitials(fullName);

                    return (
                      <tr
                        key={personId || `${fullName}-${index}`}
                        className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
                        onClick={(event) => {
                          event.stopPropagation();
                          void openPersonnelDetail(person);
                        }}
                      >
                        <td className="px-3 py-2.5">
                          <div className="flex items-center gap-2.5">
                            <div className="relative shrink-0">
                              <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-lg flex items-center justify-center text-white text-[10px] font-bold">{initials}</div>
                              <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 ${isActive ? 'bg-emerald-500' : 'bg-gray-400'} rounded-full border-[1.5px] border-white dark:border-[#1e1f26]`}></span>
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">{fullName}</p>
                              <p className="text-[9px] text-gray-500 dark:text-gray-400 md:hidden">{position}</p>
                            </div>
                          </div>
                        </td>
                        <td className="hidden md:table-cell px-3 py-2.5">
                          <p className="text-gray-900 dark:text-gray-100">{position}</p>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400">{department}</p>
                        </td>
                        <td className="hidden lg:table-cell px-3 py-2.5 text-gray-600 dark:text-gray-400">
                          <p>{formatDate(startDate)}</p>
                          <p className="text-[9px] text-gray-400 dark:text-gray-500">Database kaydı</p>
                        </td>
                        <td className="hidden lg:table-cell px-3 py-2.5">
                          <div className="flex items-center justify-center gap-1.5">
                            <span className="text-emerald-700 dark:text-emerald-300 font-bold">{isActive ? 'Aktif' : 'Pasif'}</span>
                            <div className="w-12 h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600" style={{ width: isActive ? '100%' : '35%' }}></div></div>
                          </div>
                        </td>
                        <td className="px-3 py-2.5">
                          <div className="flex items-center gap-1.5"><span className="text-[10px] font-semibold px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded">{hasAdosAccess ? role : 'Planner'}</span><svg className="text-emerald-600 dark:text-emerald-400 w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>
                        </td>
                        <td className="px-3 py-2.5 text-right">
                          <button onClick={() => undefined} className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-semibold text-gray-600 dark:text-gray-400 hover:text-amber-700 dark:hover:text-amber-400 hover:bg-gray-50 dark:hover:bg-white/5 rounded transition-colors">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                            Düzenle
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {personnelList.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-3 py-8 text-center text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                        Sonuç bulunamadı
                      </td>
                    </tr>
                  ) : null}
                  {false ? (
                  <>
                  <tr className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer" onClick={() => undefined}>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="relative shrink-0">
                          <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center text-white text-[10px] font-bold">OA</div>
                          <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full border-[1.5px] border-white dark:border-[#1e1f26]"></span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">Osman Atasoy</p>
                          <p className="text-[9px] text-gray-500 dark:text-gray-400 md:hidden">Genel Müdür</p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-3 py-2.5">
                      <p className="text-gray-900 dark:text-gray-100">Genel Müdür</p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">Yönetim</p>
                    </td>
                    <td className="hidden lg:table-cell px-3 py-2.5 text-gray-600 dark:text-gray-400">
                      <p>2020</p>
                      <p className="text-[9px] text-gray-400 dark:text-gray-500">6 yıl 2 ay</p>
                    </td>
                    <td className="hidden lg:table-cell px-3 py-2.5">
                      <div className="flex items-center justify-center gap-1.5">
                        <span className="text-emerald-700 dark:text-emerald-300 font-bold">96</span>
                        <div className="w-12 h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600" style={{ width: '96%' }}></div></div>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1.5"><span className="text-[10px] font-semibold px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded">Genel Müdür</span><svg className="text-emerald-600 dark:text-emerald-400 w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <button onClick={() => undefined} className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-semibold text-gray-600 dark:text-gray-400 hover:text-amber-700 dark:hover:text-amber-400 hover:bg-gray-50 dark:hover:bg-white/5 rounded transition-colors">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        Düzenle
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer" onClick={() => undefined}>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="relative shrink-0">
                          <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-pink-600 rounded-lg flex items-center justify-center text-white text-[10px] font-bold">ZA</div>
                          <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-amber-500 rounded-full border-[1.5px] border-white dark:border-[#1e1f26]"></span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">Zeynep Acar</p>
                          <p className="text-[9px] text-gray-500 dark:text-gray-400 md:hidden">Pazarlama Direktörü</p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-3 py-2.5">
                      <p className="text-gray-900 dark:text-gray-100">Pazarlama Direktörü</p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">Pazarlama</p>
                    </td>
                    <td className="hidden lg:table-cell px-3 py-2.5 text-gray-600 dark:text-gray-400">
                      <p>2021</p>
                      <p className="text-[9px] text-gray-400 dark:text-gray-500">4 yıl 11 ay</p>
                    </td>
                    <td className="hidden lg:table-cell px-3 py-2.5">
                      <div className="flex items-center justify-center gap-1.5">
                        <span className="text-emerald-700 dark:text-emerald-300 font-bold">92</span>
                        <div className="w-12 h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600" style={{ width: '92%' }}></div></div>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1.5"><span className="text-[10px] font-semibold px-1.5 py-0.5 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 rounded">Birim Direktörü</span><svg className="text-emerald-600 dark:text-emerald-400 w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <button onClick={() => undefined} className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-semibold text-gray-600 dark:text-gray-400 hover:text-amber-700 dark:hover:text-amber-400 hover:bg-gray-50 dark:hover:bg-white/5 rounded transition-colors">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        Düzenle
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer" onClick={() => undefined}>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="relative shrink-0">
                          <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center text-white text-[10px] font-bold">ÇA</div>
                          <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full border-[1.5px] border-white dark:border-[#1e1f26]"></span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">Çiğdem Alataş</p>
                          <p className="text-[9px] text-gray-500 dark:text-gray-400 md:hidden">Satış Direktörü</p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-3 py-2.5">
                      <p className="text-gray-900 dark:text-gray-100">Satış Direktörü</p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">Satış</p>
                    </td>
                    <td className="hidden lg:table-cell px-3 py-2.5 text-gray-600 dark:text-gray-400">
                      <p>2020</p>
                      <p className="text-[9px] text-gray-400 dark:text-gray-500">5 yıl 8 ay</p>
                    </td>
                    <td className="hidden lg:table-cell px-3 py-2.5">
                      <div className="flex items-center justify-center gap-1.5">
                        <span className="text-emerald-700 dark:text-emerald-300 font-bold">95</span>
                        <div className="w-12 h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600" style={{ width: '95%' }}></div></div>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1.5"><span className="text-[10px] font-semibold px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded">Birim Direktörü</span><svg className="text-emerald-600 dark:text-emerald-400 w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <button onClick={() => undefined} className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-semibold text-gray-600 dark:text-gray-400 hover:text-amber-700 dark:hover:text-amber-400 hover:bg-gray-50 dark:hover:bg-white/5 rounded transition-colors">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        Düzenle
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer" onClick={() => undefined}>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="relative shrink-0">
                          <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center text-white text-[10px] font-bold">AB</div>
                          <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-amber-500 rounded-full border-[1.5px] border-white dark:border-[#1e1f26]"></span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">Ali Berksoy</p>
                          <p className="text-[9px] text-gray-500 dark:text-gray-400 md:hidden">Finans Direktörü</p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-3 py-2.5">
                      <p className="text-gray-900 dark:text-gray-100">Finans Direktörü</p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">Finans</p>
                    </td>
                    <td className="hidden lg:table-cell px-3 py-2.5 text-gray-600 dark:text-gray-400">
                      <p>2021</p>
                      <p className="text-[9px] text-gray-400 dark:text-gray-500">5 yıl 4 ay</p>
                    </td>
                    <td className="hidden lg:table-cell px-3 py-2.5">
                      <div className="flex items-center justify-center gap-1.5">
                        <span className="text-sky-700 dark:text-sky-300 font-bold">89</span>
                        <div className="w-12 h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-sky-400 to-sky-600" style={{ width: '89%' }}></div></div>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1.5"><span className="text-[10px] font-semibold px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded">Birim Direktörü</span><svg className="text-emerald-600 dark:text-emerald-400 w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <button onClick={() => undefined} className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-semibold text-gray-600 dark:text-gray-400 hover:text-amber-700 dark:hover:text-amber-400 hover:bg-gray-50 dark:hover:bg-white/5 rounded transition-colors">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        Düzenle
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer" onClick={() => undefined}>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="relative shrink-0">
                          <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-sky-600 rounded-lg flex items-center justify-center text-white text-[10px] font-bold">BY</div>
                          <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full border-[1.5px] border-white dark:border-[#1e1f26]"></span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">Berke Yılmaz</p>
                          <p className="text-[9px] text-gray-500 dark:text-gray-400 md:hidden">Ads & Prodüksiyon Direktörü</p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-3 py-2.5">
                      <p className="text-gray-900 dark:text-gray-100">Ads & Prodüksiyon Direktörü</p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">Operasyon</p>
                    </td>
                    <td className="hidden lg:table-cell px-3 py-2.5 text-gray-600 dark:text-gray-400">
                      <p>2021</p>
                      <p className="text-[9px] text-gray-400 dark:text-gray-500">4 yıl 5 ay</p>
                    </td>
                    <td className="hidden lg:table-cell px-3 py-2.5">
                      <div className="flex items-center justify-center gap-1.5">
                        <span className="text-sky-700 dark:text-sky-300 font-bold">87</span>
                        <div className="w-12 h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-sky-400 to-sky-600" style={{ width: '87%' }}></div></div>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1.5"><span className="text-[10px] font-semibold px-1.5 py-0.5 bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 rounded">Birim Direktörü</span><svg className="text-emerald-600 dark:text-emerald-400 w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <button onClick={() => undefined} className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-semibold text-gray-600 dark:text-gray-400 hover:text-amber-700 dark:hover:text-amber-400 hover:bg-gray-50 dark:hover:bg-white/5 rounded transition-colors">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        Düzenle
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer" onClick={() => undefined}>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="relative shrink-0">
                          <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center text-white text-[10px] font-bold">MK</div>
                          <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-gray-500 rounded-full border-[1.5px] border-white dark:border-[#1e1f26]"></span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">Mert Kaya</p>
                          <p className="text-[9px] text-gray-500 dark:text-gray-400 md:hidden">Satış Uzmanı</p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-3 py-2.5">
                      <p className="text-gray-900 dark:text-gray-100">Satış Uzmanı</p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">Satış</p>
                    </td>
                    <td className="hidden lg:table-cell px-3 py-2.5 text-gray-600 dark:text-gray-400">
                      <p>2022</p>
                      <p className="text-[9px] text-gray-400 dark:text-gray-500">4 yıl 2 ay</p>
                    </td>
                    <td className="hidden lg:table-cell px-3 py-2.5">
                      <div className="flex items-center justify-center gap-1.5">
                        <span className="text-sky-700 dark:text-sky-300 font-bold">85</span>
                        <div className="w-12 h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-sky-400 to-sky-600" style={{ width: '85%' }}></div></div>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1.5"><span className="text-[10px] font-semibold px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded">Satış Uzmanı</span><svg className="text-emerald-600 dark:text-emerald-400 w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <button onClick={() => undefined} className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-semibold text-gray-600 dark:text-gray-400 hover:text-amber-700 dark:hover:text-amber-400 hover:bg-gray-50 dark:hover:bg-white/5 rounded transition-colors">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        Düzenle
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer" onClick={() => undefined}>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="relative shrink-0">
                          <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center text-white text-[10px] font-bold">DA</div>
                          <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-amber-500 rounded-full border-[1.5px] border-white dark:border-[#1e1f26]"></span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">Deniz Arıcan</p>
                          <p className="text-[9px] text-gray-500 dark:text-gray-400 md:hidden">Satış Uzmanı</p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-3 py-2.5">
                      <p className="text-gray-900 dark:text-gray-100">Satış Uzmanı</p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">Satış</p>
                    </td>
                    <td className="hidden lg:table-cell px-3 py-2.5 text-gray-600 dark:text-gray-400">
                      <p>2022</p>
                      <p className="text-[9px] text-gray-400 dark:text-gray-500">3 yıl 8 ay</p>
                    </td>
                    <td className="hidden lg:table-cell px-3 py-2.5">
                      <div className="flex items-center justify-center gap-1.5">
                        <span className="text-amber-700 dark:text-amber-300 font-bold">78</span>
                        <div className="w-12 h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-amber-400 to-amber-600" style={{ width: '78%' }}></div></div>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1.5"><span className="text-[10px] font-semibold px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded">Satış Uzmanı</span><svg className="text-amber-500 w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div>
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <button onClick={() => undefined} className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-semibold text-gray-600 dark:text-gray-400 hover:text-amber-700 dark:hover:text-amber-400 hover:bg-gray-50 dark:hover:bg-white/5 rounded transition-colors">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        Düzenle
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer" onClick={() => undefined}>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="relative shrink-0">
                          <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-pink-600 rounded-lg flex items-center justify-center text-white text-[10px] font-bold">EK</div>
                          <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full border-[1.5px] border-white dark:border-[#1e1f26]"></span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">Elif Kara</p>
                          <p className="text-[9px] text-gray-500 dark:text-gray-400 md:hidden">Pazarlama Uzmanı</p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-3 py-2.5">
                      <p className="text-gray-900 dark:text-gray-100">Pazarlama Uzmanı</p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">Pazarlama</p>
                    </td>
                    <td className="hidden lg:table-cell px-3 py-2.5 text-gray-600 dark:text-gray-400">
                      <p>2022</p>
                      <p className="text-[9px] text-gray-400 dark:text-gray-500">3 yıl 11 ay</p>
                    </td>
                    <td className="hidden lg:table-cell px-3 py-2.5">
                      <div className="flex items-center justify-center gap-1.5">
                        <span className="text-emerald-700 dark:text-emerald-300 font-bold">90</span>
                        <div className="w-12 h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600" style={{ width: '90%' }}></div></div>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1.5"><span className="text-[10px] font-semibold px-1.5 py-0.5 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 rounded">Pazarlama Uzmanı</span><svg className="text-emerald-600 dark:text-emerald-400 w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <button onClick={() => undefined} className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-semibold text-gray-600 dark:text-gray-400 hover:text-amber-700 dark:hover:text-amber-400 hover:bg-gray-50 dark:hover:bg-white/5 rounded transition-colors">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        Düzenle
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer" onClick={() => undefined}>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="relative shrink-0">
                          <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-lg flex items-center justify-center text-white text-[10px] font-bold">HT</div>
                          <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full border-[1.5px] border-white dark:border-[#1e1f26]"></span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">Hasan Tekin</p>
                          <p className="text-[9px] text-gray-500 dark:text-gray-400 md:hidden">Ads Operatör</p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-3 py-2.5">
                      <p className="text-gray-900 dark:text-gray-100">Ads Operatör</p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">Operasyon</p>
                    </td>
                    <td className="hidden lg:table-cell px-3 py-2.5 text-gray-600 dark:text-gray-400">
                      <p>2023</p>
                      <p className="text-[9px] text-gray-400 dark:text-gray-500">3 yıl 3 ay</p>
                    </td>
                    <td className="hidden lg:table-cell px-3 py-2.5">
                      <div className="flex items-center justify-center gap-1.5">
                        <span className="text-sky-700 dark:text-sky-300 font-bold">82</span>
                        <div className="w-12 h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-sky-400 to-sky-600" style={{ width: '82%' }}></div></div>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1.5"><span className="text-[10px] font-semibold px-1.5 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded">Ads Operatör</span><svg className="text-emerald-600 dark:text-emerald-400 w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <button onClick={() => undefined} className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-semibold text-gray-600 dark:text-gray-400 hover:text-amber-700 dark:hover:text-amber-400 hover:bg-gray-50 dark:hover:bg-white/5 rounded transition-colors">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        Düzenle
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer" onClick={() => undefined}>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="relative shrink-0">
                          <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg flex items-center justify-center text-white text-[10px] font-bold">SG</div>
                          <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-gray-500 rounded-full border-[1.5px] border-white dark:border-[#1e1f26]"></span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">Selin Güneş</p>
                          <p className="text-[9px] text-gray-500 dark:text-gray-400 md:hidden">Finans Uzmanı</p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-3 py-2.5">
                      <p className="text-gray-900 dark:text-gray-100">Finans Uzmanı</p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">Finans</p>
                    </td>
                    <td className="hidden lg:table-cell px-3 py-2.5 text-gray-600 dark:text-gray-400">
                      <p>2022</p>
                      <p className="text-[9px] text-gray-400 dark:text-gray-500">3 yıl 5 ay</p>
                    </td>
                    <td className="hidden lg:table-cell px-3 py-2.5">
                      <div className="flex items-center justify-center gap-1.5">
                        <span className="text-sky-700 dark:text-sky-300 font-bold">88</span>
                        <div className="w-12 h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-sky-400 to-sky-600" style={{ width: '88%' }}></div></div>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1.5"><span className="text-[10px] font-semibold px-1.5 py-0.5 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded">Finans Uzmanı</span><svg className="text-emerald-600 dark:text-emerald-400 w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <button onClick={() => undefined} className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-semibold text-gray-600 dark:text-gray-400 hover:text-amber-700 dark:hover:text-amber-400 hover:bg-gray-50 dark:hover:bg-white/5 rounded transition-colors">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        Düzenle
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer" onClick={() => undefined}>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="relative shrink-0">
                          <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-pink-600 rounded-lg flex items-center justify-center text-white text-[10px] font-bold">SY</div>
                          <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-violet-500 rounded-full border-[1.5px] border-white dark:border-[#1e1f26]"></span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">Selin Yıldız</p>
                          <p className="text-[9px] text-gray-500 dark:text-gray-400 md:hidden">İçerik Editörü</p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-3 py-2.5">
                      <p className="text-gray-900 dark:text-gray-100">İçerik Editörü</p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">Pazarlama</p>
                    </td>
                    <td className="hidden lg:table-cell px-3 py-2.5 text-gray-600 dark:text-gray-400">
                      <p>2023</p>
                      <p className="text-[9px] text-gray-400 dark:text-gray-500">3 yıl 0 ay</p>
                    </td>
                    <td className="hidden lg:table-cell px-3 py-2.5">
                      <div className="flex items-center justify-center gap-1.5">
                        <span className="text-sky-700 dark:text-sky-300 font-bold">85</span>
                        <div className="w-12 h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-sky-400 to-sky-600" style={{ width: '85%' }}></div></div>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded">Planner</span>
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <button onClick={() => undefined} className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-semibold text-gray-600 dark:text-gray-400 hover:text-amber-700 dark:hover:text-amber-400 hover:bg-gray-50 dark:hover:bg-white/5 rounded transition-colors">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        Düzenle
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer" onClick={() => undefined}>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="relative shrink-0">
                          <div className="w-8 h-8 bg-gradient-to-br from-rose-400 to-rose-600 rounded-lg flex items-center justify-center text-white text-[10px] font-bold">MÇ</div>
                          <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-violet-500 rounded-full border-[1.5px] border-white dark:border-[#1e1f26]"></span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">Mehmet Çelik</p>
                          <p className="text-[9px] text-gray-500 dark:text-gray-400 md:hidden">Grafik Tasarımcı</p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-3 py-2.5">
                      <p className="text-gray-900 dark:text-gray-100">Grafik Tasarımcı</p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">Prodüksiyon</p>
                    </td>
                    <td className="hidden lg:table-cell px-3 py-2.5 text-gray-600 dark:text-gray-400">
                      <p>2023</p>
                      <p className="text-[9px] text-gray-400 dark:text-gray-500">2 yıl 10 ay</p>
                    </td>
                    <td className="hidden lg:table-cell px-3 py-2.5">
                      <div className="flex items-center justify-center gap-1.5">
                        <span className="text-sky-700 dark:text-sky-300 font-bold">87</span>
                        <div className="w-12 h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-sky-400 to-sky-600" style={{ width: '87%' }}></div></div>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded">Planner</span>
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <button onClick={() => undefined} className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-semibold text-gray-600 dark:text-gray-400 hover:text-amber-700 dark:hover:text-amber-400 hover:bg-gray-50 dark:hover:bg-white/5 rounded transition-colors">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        Düzenle
                      </button>
                    </td>
                  </tr>
                  </>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        
          {/* Roller & Yetkiler Matrisi */}
          <div className="bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-600/50 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700/40 flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <svg className="text-amber-600 dark:text-amber-400 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <div>
                  <h4 className="text-[13px] font-bold text-gray-900 dark:text-gray-100">Roller & Yetkiler Matrisi</h4>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">9 tanımlı rol · her rol için pano erişimi ve yetkinlik</p>
                </div>
              </div>
              <button onClick={() => undefined} className="text-[10px] font-semibold text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1">
                Matrisi Düzenle <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
            </div>
            <div>
              <table className="w-full text-[11px]">
                <thead className="bg-gray-50 dark:bg-[#17181f]">
                  <tr>
                    <th className="text-left px-3 py-2.5 text-[9px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rol</th>
                    <th className="text-center px-3 py-2.5 text-[9px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Kullanıcı</th>
                    <th className="text-left px-3 py-2.5 text-[9px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Seviye</th>
                    <th className="hidden md:table-cell text-left px-3 py-2.5 text-[9px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pano Erişimi</th>
                    <th className="hidden lg:table-cell text-left px-3 py-2.5 text-[9px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Yetkinlik</th>
                    <th className="text-right px-3 py-2.5 text-[9px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700/40">
                  
                  <tr className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-amber-100 dark:bg-amber-900/30 rounded flex items-center justify-center shrink-0"><svg className="text-amber-700 dark:text-amber-300 w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">Genel Müdür</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center"><span className="text-[12px] font-bold text-gray-900 dark:text-gray-100">1</span></td>
                    <td className="px-3 py-3"><span className="text-[10px] font-semibold px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded">Admin</span></td>
                    <td className="hidden md:table-cell px-3 py-3 text-gray-600 dark:text-gray-400">Tüm panolar + ADOS Mimar</td>
                    <td className="hidden lg:table-cell px-3 py-3 text-gray-500 dark:text-gray-500">Herşey</td>
                    <td className="px-3 py-3 text-right">
                      <button onClick={() => undefined} className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-semibold text-gray-600 dark:text-gray-400 hover:text-amber-700 dark:hover:text-amber-400 hover:bg-gray-50 dark:hover:bg-white/5 rounded transition-colors">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        Düzenle
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-violet-100 dark:bg-violet-900/30 rounded flex items-center justify-center shrink-0"><svg className="text-violet-700 dark:text-violet-300 w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">Sistem Mimarı</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center"><span className="text-[12px] font-bold text-gray-900 dark:text-gray-100">1</span></td>
                    <td className="px-3 py-3"><span className="text-[10px] font-semibold px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded">Admin</span></td>
                    <td className="hidden md:table-cell px-3 py-3 text-gray-600 dark:text-gray-400">Orchestrator · JSON · Prompt · Router</td>
                    <td className="hidden lg:table-cell px-3 py-3 text-gray-500 dark:text-gray-500">Sistem ayarları</td>
                    <td className="px-3 py-3 text-right">
                      <button onClick={() => undefined} className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-semibold text-gray-600 dark:text-gray-400 hover:text-amber-700 dark:hover:text-amber-400 hover:bg-gray-50 dark:hover:bg-white/5 rounded transition-colors">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        Düzenle
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-sky-100 dark:bg-sky-900/30 rounded flex items-center justify-center shrink-0"><svg className="text-sky-700 dark:text-sky-300 w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">Birim Direktörü</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center"><span className="text-[12px] font-bold text-gray-900 dark:text-gray-100">4</span></td>
                    <td className="px-3 py-3"><span className="text-[10px] font-semibold px-2 py-0.5 bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 rounded">Yönetici</span></td>
                    <td className="hidden md:table-cell px-3 py-3 text-gray-600 dark:text-gray-400">Kendi pano + Komuta Merkezi (okuma)</td>
                    <td className="hidden lg:table-cell px-3 py-3 text-gray-500 dark:text-gray-500">Birim operasyonları</td>
                    <td className="px-3 py-3 text-right">
                      <button onClick={() => undefined} className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-semibold text-gray-600 dark:text-gray-400 hover:text-amber-700 dark:hover:text-amber-400 hover:bg-gray-50 dark:hover:bg-white/5 rounded transition-colors">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        Düzenle
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-emerald-100 dark:bg-emerald-900/30 rounded flex items-center justify-center shrink-0"><svg className="text-emerald-700 dark:text-emerald-300 w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">Satış Uzmanı</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center"><span className="text-[12px] font-bold text-gray-900 dark:text-gray-100">11</span></td>
                    <td className="px-3 py-3"><span className="text-[10px] font-semibold px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded">Yazma</span></td>
                    <td className="hidden md:table-cell px-3 py-3 text-gray-600 dark:text-gray-400">Satış Panosu</td>
                    <td className="hidden lg:table-cell px-3 py-3 text-gray-500 dark:text-gray-500">Teklif · Müşteri</td>
                    <td className="px-3 py-3 text-right">
                      <button onClick={() => undefined} className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-semibold text-gray-600 dark:text-gray-400 hover:text-amber-700 dark:hover:text-amber-400 hover:bg-gray-50 dark:hover:bg-white/5 rounded transition-colors">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        Düzenle
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-pink-100 dark:bg-pink-900/30 rounded flex items-center justify-center shrink-0"><svg className="text-pink-700 dark:text-pink-300 w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">Pazarlama Uzmanı</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center"><span className="text-[12px] font-bold text-gray-900 dark:text-gray-100">7</span></td>
                    <td className="px-3 py-3"><span className="text-[10px] font-semibold px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded">Yazma</span></td>
                    <td className="hidden md:table-cell px-3 py-3 text-gray-600 dark:text-gray-400">Pazarlama Panosu</td>
                    <td className="hidden lg:table-cell px-3 py-3 text-gray-500 dark:text-gray-500">Kampanya · İçerik</td>
                    <td className="px-3 py-3 text-right">
                      <button onClick={() => undefined} className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-semibold text-gray-600 dark:text-gray-400 hover:text-amber-700 dark:hover:text-amber-400 hover:bg-gray-50 dark:hover:bg-white/5 rounded transition-colors">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        Düzenle
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-indigo-100 dark:bg-indigo-900/30 rounded flex items-center justify-center shrink-0"><svg className="text-indigo-700 dark:text-indigo-300 w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">Ads Operatör</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center"><span className="text-[12px] font-bold text-gray-900 dark:text-gray-100">6</span></td>
                    <td className="px-3 py-3"><span className="text-[10px] font-semibold px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded">Yazma</span></td>
                    <td className="hidden md:table-cell px-3 py-3 text-gray-600 dark:text-gray-400">Ads Operasyon Panosu</td>
                    <td className="hidden lg:table-cell px-3 py-3 text-gray-500 dark:text-gray-500">Reklam bütçe · Kreatif</td>
                    <td className="px-3 py-3 text-right">
                      <button onClick={() => undefined} className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-semibold text-gray-600 dark:text-gray-400 hover:text-amber-700 dark:hover:text-amber-400 hover:bg-gray-50 dark:hover:bg-white/5 rounded transition-colors">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        Düzenle
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-teal-100 dark:bg-teal-900/30 rounded flex items-center justify-center shrink-0"><svg className="text-teal-700 dark:text-teal-300 w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">Finans Uzmanı</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center"><span className="text-[12px] font-bold text-gray-900 dark:text-gray-100">4</span></td>
                    <td className="px-3 py-3"><span className="text-[10px] font-semibold px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded">Yazma</span></td>
                    <td className="hidden md:table-cell px-3 py-3 text-gray-600 dark:text-gray-400">Finans Panosu</td>
                    <td className="hidden lg:table-cell px-3 py-3 text-gray-500 dark:text-gray-500">Fatura · Tahsilat</td>
                    <td className="px-3 py-3 text-right">
                      <button onClick={() => undefined} className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-semibold text-gray-600 dark:text-gray-400 hover:text-amber-700 dark:hover:text-amber-400 hover:bg-gray-50 dark:hover:bg-white/5 rounded transition-colors">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        Düzenle
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-rose-100 dark:bg-rose-900/30 rounded flex items-center justify-center shrink-0"><svg className="text-rose-700 dark:text-rose-300 w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">Prodüksiyon</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center"><span className="text-[12px] font-bold text-gray-900 dark:text-gray-100">6</span></td>
                    <td className="px-3 py-3"><span className="text-[10px] font-semibold px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded">Yazma</span></td>
                    <td className="hidden md:table-cell px-3 py-3 text-gray-600 dark:text-gray-400">Prodüksiyon görevleri</td>
                    <td className="hidden lg:table-cell px-3 py-3 text-gray-500 dark:text-gray-500">Proje · Teslim</td>
                    <td className="px-3 py-3 text-right">
                      <button onClick={() => undefined} className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-semibold text-gray-600 dark:text-gray-400 hover:text-amber-700 dark:hover:text-amber-400 hover:bg-gray-50 dark:hover:bg-white/5 rounded transition-colors">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        Düzenle
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center shrink-0"><svg className="text-gray-600 dark:text-gray-400 w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">İzleyici</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center"><span className="text-[12px] font-bold text-gray-900 dark:text-gray-100">2</span></td>
                    <td className="px-3 py-3"><span className="text-[10px] font-semibold px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded">Okuma</span></td>
                    <td className="hidden md:table-cell px-3 py-3 text-gray-600 dark:text-gray-400">Komuta Merkezi (sadece okuma)</td>
                    <td className="hidden lg:table-cell px-3 py-3 text-gray-500 dark:text-gray-500">—</td>
                    <td className="px-3 py-3 text-right">
                      <button onClick={() => undefined} className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-semibold text-gray-600 dark:text-gray-400 hover:text-amber-700 dark:hover:text-amber-400 hover:bg-gray-50 dark:hover:bg-white/5 rounded transition-colors">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        Düzenle
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        
          {/* Operasyon_Ekip.JSON + Jenny AI */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
            <div className="lg:col-span-3 bg-white dark:bg-[#1e1f26] border border-violet-200 dark:border-violet-500/30 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-violet-100 dark:border-violet-500/20 bg-gradient-to-r from-violet-50 to-transparent dark:from-violet-500/10 flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-violet-100 dark:bg-violet-500/20 rounded-lg flex items-center justify-center">
                    <svg className="text-violet-600 dark:text-violet-400 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M4 4h16v16H4z"/><path d="M4 12h16"/><path d="M12 4v16"/></svg>
                  </div>
                  <div>
                    <h4 className="text-[13px] font-bold text-gray-900 dark:text-gray-100"><span className="font-mono">Operasyon_Ekip.JSON</span></h4>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">Tüm personel, rol, yetki ve erişim verisinin kaynağı · Master.JSON altında</p>
                  </div>
                </div>
                <button onClick={() => undefined} className="text-[10px] font-semibold text-violet-700 dark:text-violet-400 hover:underline flex items-center gap-1">
                  Tam JSON <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-[#0d0e13] font-mono text-[10px] leading-relaxed overflow-x-auto">
        <pre className="text-gray-700 dark:text-gray-300"><span className="text-violet-600 dark:text-violet-400">&#123;</span>
          <span className="text-sky-600 dark:text-sky-400">"schema"</span>: <span className="text-emerald-600 dark:text-emerald-400">"operasyon_ekip.v1"</span>,
          <span className="text-sky-600 dark:text-sky-400">"version"</span>: <span className="text-emerald-600 dark:text-emerald-400">"1.0.0"</span>,
          <span className="text-sky-600 dark:text-sky-400">"total_personnel"</span>: <span className="text-amber-600 dark:text-amber-400">12</span>,
          <span className="text-sky-600 dark:text-sky-400">"ados_users"</span>: <span className="text-amber-600 dark:text-amber-400">10</span>,
          <span className="text-sky-600 dark:text-sky-400">"planner_users"</span>: <span className="text-amber-600 dark:text-amber-400">2</span>,
          <span className="text-sky-600 dark:text-sky-400">"roles_count"</span>: <span className="text-amber-600 dark:text-amber-400">9</span>,
          <span className="text-sky-600 dark:text-sky-400">"active_sessions"</span>: <span className="text-amber-600 dark:text-amber-400">5</span>,
          <span className="text-sky-600 dark:text-sky-400">"personnel"</span>: <span className="text-violet-600 dark:text-violet-400">[</span>
            <span className="text-violet-600 dark:text-violet-400">&#123;</span> <span className="text-sky-600 dark:text-sky-400">"id"</span>: <span className="text-emerald-600 dark:text-emerald-400">"p001"</span>, <span className="text-sky-600 dark:text-sky-400">"name"</span>: <span className="text-emerald-600 dark:text-emerald-400">"Osman Atasoy"</span>, <span className="text-sky-600 dark:text-sky-400">"role"</span>: <span className="text-emerald-600 dark:text-emerald-400">"gm"</span>, <span className="text-sky-600 dark:text-sky-400">"ados_access"</span>: <span className="text-amber-600 dark:text-amber-400">true</span> <span className="text-violet-600 dark:text-violet-400">&#125;</span>,
            <span className="text-gray-400 dark:text-gray-600">// ... 11 kayıt daha</span>
          <span className="text-violet-600 dark:text-violet-400">]</span>,
          <span className="text-sky-600 dark:text-sky-400">"audit"</span>: <span className="text-emerald-600 dark:text-emerald-400">"Master.JSON#operasyon_ekip"</span>,
          <span className="text-sky-600 dark:text-sky-400">"last_updated"</span>: <span className="text-emerald-600 dark:text-emerald-400">"2026-04-23T18:42:00Z"</span>
        <span className="text-violet-600 dark:text-violet-400">&#125;</span></pre>
              </div>
            </div>
        
            {/* Jenny AI (ekip) */}
            <div className="lg:col-span-2 relative overflow-hidden rounded-xl border border-amber-200/70 dark:border-amber-500/30">
              <div className="relative bg-gradient-to-br from-amber-50 via-white to-violet-50 dark:from-[#1a1530] dark:via-[#0f0820] dark:to-[#1a0e3a] p-4 h-full">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none aig"></div>
                <div className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-amber-400 via-amber-500 to-violet-600 rounded-lg flex items-center justify-center">
                      <svg className="text-white w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                    </div>
                    <div>
                      <h5 className="text-[12px] font-bold text-gray-900 dark:text-white">Jenny'nin Ekip Yorumu</h5>
                      <p className="text-[9px] text-gray-500 dark:text-white/60"><span className="font-mono">Operasyon_Ekip.JSON v1.0.0</span></p>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="p-2 bg-white/70 dark:bg-white/5 border border-emerald-200 dark:border-emerald-400/30 rounded-lg">
                      <p className="text-[11px] text-gray-800 dark:text-white/90"><span className="font-bold text-emerald-700 dark:text-emerald-300">✓ İyi:</span> 12 personel · 10 ADOS kullanıcısı · ort. performans 88/100.</p>
                    </div>
                    <div className="p-2 bg-white/70 dark:bg-white/5 border border-amber-200 dark:border-amber-400/30 rounded-lg">
                      <p className="text-[11px] text-gray-800 dark:text-white/90"><span className="font-bold text-amber-700 dark:text-amber-300">⚠ Dikkat:</span> 1 ADOS kullanıcı MFA eksik · güvenlik riski.</p>
                    </div>
                    <div className="p-2 bg-white/70 dark:bg-white/5 border border-violet-200 dark:border-violet-400/30 rounded-lg">
                      <p className="text-[11px] text-gray-800 dark:text-white/90"><span className="font-bold text-violet-700 dark:text-violet-300">◆ Fırsat:</span> Planner'daki 2 kişiden 2'si için ADOS erişimi önerilir · analiz görünürlüğü.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {modal?.type === 'detail' ? (
          <PersonnelDetailModal
            name={modal.name}
            role={modal.role}
            unit={modal.unit}
            access={modal.access}
            personnel={modal.personnel}
            onClose={() => setModal(null)}
            onToast={setToast}
            onSave={handleUpdatePersonnel}
            onStatusChange={handleUpdatePersonnelStatus}
          />
        ) : null}
        {modal?.type === 'new' ? (
          <NewPersonnelModal
            onClose={() => setModal(null)}
            onSave={async (payload) => {
              try {
                const createdPerson = await createPersonnel(payload);
                const refreshedPersonnel = await getPersonnel();

                setPersonnel(Array.isArray(refreshedPersonnel) ? refreshedPersonnel : []);
                setModal(null);
                setToast({
                  title: 'Personel Eklendi',
                  message: `${createdPerson.fullName} database'e kaydedildi.`,
                  color: 'emerald',
                });
              } catch (error) {
                setToast({
                  title: 'Personel Eklenemedi',
                  message: error instanceof Error ? error.message : 'Kayıt sırasında hata oluştu.',
                  color: 'rose',
                });
              }
            }}
          />
        ) : null}
        <Toast toast={toast} onClose={() => setToast(null)} />
        </div>
      </>
    </Layout>
  );
}

function CloseIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function CheckIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function getInitials(value: string) {
  return value
    .split(/\s+/)
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toLocaleUpperCase('tr-TR');
}

function groupCounts(values: unknown[]) {
  return values.reduce<Record<string, number>>((counts, value) => {
    const text = getTextValue(value);
    if (!text) return counts;
    counts[text] = (counts[text] ?? 0) + 1;
    return counts;
  }, {});
}

function summarizeCounts(values: unknown[]) {
  return Object.entries(groupCounts(values))
    .sort(([, firstCount], [, secondCount]) => secondCount - firstCount)
    .slice(0, 3)
    .map(([name, count]) => `${name}: ${count}`)
    .join(' · ');
}

const bool = (value: unknown) => value === true || value === 'true' || value === 1 || value === '1';

function getFieldText(person: Personnel | PersonnelRecord | null | undefined, camelKey: string, pascalKey: string) {
  const record = (person ?? {}) as PersonnelRecord;
  return getTextValue(record[camelKey] ?? record[pascalKey]);
}

function getFieldBool(person: Personnel | PersonnelRecord | null | undefined, camelKey: string, pascalKey: string) {
  const record = (person ?? {}) as PersonnelRecord;
  return bool(record[camelKey] ?? record[pascalKey]);
}

function getFieldNumber(person: Personnel | PersonnelRecord | null | undefined, camelKey: string, pascalKey: string) {
  const record = (person ?? {}) as PersonnelRecord;
  const value = record[camelKey] ?? record[pascalKey];
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return 0;
}

function getTextValue(value: unknown) {
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

/*
      if (['false', '0', 'hayır', 'hayir', 'no'].includes(normalized)) return false;
    }
  }
  return false;
}

*/
function toUpdatePayload(person: Personnel): UpdatePersonnelPayload {
  return {
    fullName: person.fullName,
    email: person.email,
    password: null,
    phone: person.phone,
    position: person.position,
    department: person.department,
    startDate: person.startDate,
    birthDate: person.birthDate,
    salary: person.salary,
    reportsTo: person.reportsTo,
    role: person.role,
    isActive: person.isActive,
    hasAdosAccess: person.hasAdosAccess,
    accessLevel: person.accessLevel,
    panelAccess: person.panelAccess,
    mfaEnabled: person.mfaEnabled,
  };
}

function formatDate(value?: string | null) {
  if (!value) {
    return '—';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function formatSalary(value?: number | null) {
  if (value == null) {
    return '—';
  }

  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(value);
}

function PersonnelDetailModal({
  name,
  role,
  unit,
  access,
  personnel,
  onClose,
  onToast,
  onSave,
  onStatusChange,
}: {
  name: string;
  role: string;
  unit: string;
  access: string;
  personnel?: Personnel;
  onClose: () => void;
  onToast: (toast: ToastState) => void;
  onSave: (id: number, payload: UpdatePersonnelPayload) => Promise<void>;
  onStatusChange: (id: number, isActive: boolean) => Promise<void>;
}) {
  const initials = name
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toLocaleUpperCase('tr-TR');
  const effectiveRole = personnel?.role ?? role;
  const hasAdosAccess = personnel?.hasAdosAccess ?? !access.includes('Planner');
  const isActive = personnel?.isActive ?? true;

  return (
    <>
      <div className="modal-overlay absolute inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose}></div>
      <div className="modal-panel absolute inset-0 flex items-start justify-center p-4 pointer-events-none z-50">
        <div className="modal-scroll bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-xl w-full max-w-[780px] max-h-[90vh] overflow-y-auto pointer-events-auto">
          <div className="sticky top-0 z-10 bg-white dark:bg-[#1e1f26] border-b border-gray-100 dark:border-gray-700/60 p-5 flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-xl flex items-center justify-center text-white text-[16px] font-bold">
                  {initials}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white dark:border-[#1e1f26]"></span>
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-[18px] font-bold text-gray-900 dark:text-gray-100">{name}</h2>
                  <span className={`text-[9px] font-semibold px-1.5 py-0.5 ${isActive ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' : 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300'} rounded`}>
                    {isActive ? 'Aktif' : 'Pasif'}
                  </span>
                </div>
                <p className="text-[12px] text-gray-600 dark:text-gray-400">{personnel?.position ?? role} · {personnel?.department ?? unit}</p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500">
                  ID: <span className="font-mono">{personnel?.id ?? initials.toLocaleLowerCase('tr-TR')}</span> · {hasAdosAccess ? 'ADOS Panel Kullanıcısı' : 'Microsoft Planner Kullanıcısı'}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors p-1">
              <CloseIcon />
            </button>
          </div>

          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div className="p-3 bg-gradient-to-br from-emerald-50 to-transparent dark:from-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-lg">
                <p className="text-[9px] font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">Performans</p>
                <p className="text-[20px] font-black text-gray-900 dark:text-gray-100 leading-none mt-1">
                  88<span className="text-[11px] text-gray-400">/100</span>
                </p>
                <div className="h-1 bg-white/40 dark:bg-black/30 rounded-full overflow-hidden mt-2">
                  <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600" style={{ width: '88%' }}></div>
                </div>
              </div>
              <div className="p-3 bg-gradient-to-br from-sky-50 to-transparent dark:from-sky-500/10 border border-sky-200 dark:border-sky-500/30 rounded-lg">
                <p className="text-[9px] font-bold text-sky-700 dark:text-sky-300 uppercase tracking-wider">Mesai Sadakati</p>
                <p className="text-[20px] font-black text-gray-900 dark:text-gray-100 leading-none mt-1">
                  91<span className="text-[11px] text-gray-400">/100</span>
                </p>
                <div className="h-1 bg-white/40 dark:bg-black/30 rounded-full overflow-hidden mt-2">
                  <div className="h-full bg-gradient-to-r from-sky-400 to-sky-600" style={{ width: '91%' }}></div>
                </div>
              </div>
              <div className="p-3 bg-gradient-to-br from-amber-50 to-transparent dark:from-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-lg">
                <p className="text-[9px] font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider">Devam Oranı</p>
                <p className="text-[20px] font-black text-gray-900 dark:text-gray-100 leading-none mt-1">%96</p>
                <div className="h-1 bg-white/40 dark:bg-black/30 rounded-full overflow-hidden mt-2">
                  <div className="h-full bg-gradient-to-r from-amber-400 to-amber-600" style={{ width: '96%' }}></div>
                </div>
              </div>
              <div className="p-3 bg-gradient-to-br from-violet-50 to-transparent dark:from-violet-500/10 border border-violet-200 dark:border-violet-500/30 rounded-lg">
                <p className="text-[9px] font-bold text-violet-700 dark:text-violet-300 uppercase tracking-wider">NPS Puanı</p>
                <p className="text-[20px] font-black text-gray-900 dark:text-gray-100 leading-none mt-1">
                  8.7<span className="text-[11px] text-gray-400">/10</span>
                </p>
                <div className="h-1 bg-white/40 dark:bg-black/30 rounded-full overflow-hidden mt-2">
                  <div className="h-full bg-gradient-to-r from-violet-400 to-violet-600" style={{ width: '87%' }}></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-gray-50 dark:bg-[#17181f] border border-gray-200 dark:border-gray-700/40 rounded-lg p-4">
                <h3 className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Kişisel Bilgiler</h3>
                <div className="space-y-2 text-[12px]">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-gray-500 dark:text-gray-400 shrink-0">İşe Başlama</span>
                    <div className="text-right">
                      <p className="text-gray-900 dark:text-gray-100 font-semibold">{formatDate(personnel?.startDate)}</p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">Database alanı</p>
                    </div>
                  </div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-gray-500 dark:text-gray-400 shrink-0">Doğum Tarihi</span>
                    <p className="text-gray-900 dark:text-gray-100 font-semibold">
                      {formatDate(personnel?.birthDate)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-gray-500 dark:text-gray-400">E-posta</span>
                    <span className="text-gray-900 dark:text-gray-100 font-semibold font-mono text-[11px]">{personnel?.email ?? 'personel@arma.digital'}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-gray-500 dark:text-gray-400">Telefon</span>
                    <span className="text-gray-900 dark:text-gray-100 font-semibold font-mono text-[11px]">{personnel?.phone ?? '+90 5XX XXX XX XX'}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-200 dark:border-gray-700/50">
                    <span className="text-gray-500 dark:text-gray-400">Maaş</span>
                    <span className="text-gray-900 dark:text-gray-100 font-bold">{formatSalary(personnel?.salary)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-gray-500 dark:text-gray-400">Raporluğu</span>
                    <span className="text-gray-900 dark:text-gray-100 font-semibold">{personnel?.reportsTo ?? 'Osman Atasoy'}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-gray-500 dark:text-gray-400">Durum</span>
                    <span className="text-gray-900 dark:text-gray-100 font-semibold">{isActive ? 'Aktif' : 'Pasif'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-violet-50/50 dark:from-amber-500/5 dark:to-violet-500/5 border border-amber-200 dark:border-amber-500/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[10px] font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider">ADOS Panel Erişim</h3>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 ${isActive ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' : 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300'} rounded`}>{isActive ? 'AKTİF' : 'PASİF'}</span>
                </div>
                <div className="space-y-2 text-[12px]">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-gray-500 dark:text-gray-400">Rol</span>
                    <span className="text-gray-900 dark:text-gray-100 font-bold">{hasAdosAccess ? effectiveRole : '—'}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-gray-500 dark:text-gray-400">Yetki Seviyesi</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 rounded">{personnel?.accessLevel ?? (hasAdosAccess ? 'Yazma' : 'Planner')}</span>
                  </div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-gray-500 dark:text-gray-400 shrink-0">Pano Erişimleri</span>
                    <div className="text-right flex flex-wrap gap-1 justify-end">
                      <span className="text-[9px] font-semibold px-1.5 py-0.5 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700/60 text-gray-700 dark:text-gray-300 rounded">{personnel?.panelAccess ?? (hasAdosAccess ? 'Ekip & Operasyon' : 'Planner')}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-gray-500 dark:text-gray-400">MFA</span>
                    <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-300 font-semibold">
                      <CheckIcon className="w-3 h-3" />{personnel?.mfaEnabled ? 'Aktif' : 'Kapalı'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-gray-500 dark:text-gray-400">Son Giriş</span>
                    <span className="text-gray-900 dark:text-gray-100 font-semibold">{formatDate(personnel?.lastLoginAt) || 'Henüz yok'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-gray-50 dark:bg-[#17181f] border border-gray-200 dark:border-gray-700/40 rounded-lg p-4">
                <h3 className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Sorumluluklar</h3>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[10px] font-medium px-2 py-1 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700/60 text-gray-700 dark:text-gray-300 rounded">Operasyon takibi</span>
                  <span className="text-[10px] font-medium px-2 py-1 bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700/60 text-gray-700 dark:text-gray-300 rounded">Yetki yönetimi</span>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-[#17181f] border border-gray-200 dark:border-gray-700/40 rounded-lg p-4">
                <h3 className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Yetkinlikler</h3>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[10px] font-medium px-2 py-1 bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 rounded">ADOS Panel</span>
                  <span className="text-[10px] font-medium px-2 py-1 bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 rounded">Microsoft Planner</span>
                </div>
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 bg-white dark:bg-[#1e1f26] border-t border-gray-100 dark:border-gray-700/60 p-4 flex items-center justify-between gap-2 flex-wrap">
            <button onClick={onClose} className="px-3 py-2 text-[11px] font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">Kapat</button>
            <div className="flex items-center gap-2">
              <button onClick={() => personnel ? void onStatusChange(personnel.id, !isActive) : onToast({ title: 'Durum', message: 'Database kaydı bulunamadı.', color: 'amber' })} className="px-3 py-2 text-[11px] font-semibold text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-md transition-colors">{isActive ? 'Pasifleştir' : 'Aktifleştir'}</button>
              <button onClick={() => onToast({ title: 'Rol Değişikliği', message: `${name} için rol değişikliği ekranı açıldı`, color: 'sky' })} className="px-3 py-2 text-[11px] font-semibold text-sky-700 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-500/10 rounded-md transition-colors">Rolü Değiştir</button>
              <button onClick={() => personnel ? void onSave(personnel.id, toUpdatePayload(personnel)) : onToast({ title: 'Kaydedilemedi', message: 'Database kaydı bulunamadı.', color: 'amber' })} className="px-4 py-2 text-[11px] font-semibold bg-gray-900 dark:bg-gray-100 dark:text-gray-900 text-white rounded-md hover:opacity-90 transition-opacity">Kaydet</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function NewPersonnelModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (payload: CreatePersonnelPayload) => Promise<void>;
}) {
  const [adosAccess, setAdosAccess] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const fullName = String(form.get('fullName') || '').trim();
    const email = String(form.get('email') || '').trim();
    const password = String(form.get('password') || '');
    const salaryValue = String(form.get('salary') || '').trim();
    const birthDate = String(form.get('birthDate') || '').trim();

    if (!fullName || !email || !password) return;

    void onSave({
      fullName,
      email,
      password,
      phone: String(form.get('phone') || '').trim() || null,
      position: String(form.get('position') || '').trim(),
      department: String(form.get('department') || '').trim(),
      startDate: String(form.get('startDate') || ''),
      birthDate: birthDate || null,
      salary: salaryValue ? Number(salaryValue) : null,
      reportsTo: String(form.get('reportsTo') || '').trim() || null,
      role: String(form.get('role') || ''),
      hasAdosAccess: adosAccess,
      accessLevel: null,
      panelAccess: null,
      mfaEnabled: form.get('mfa') === 'on',
    });
  }

  return (
    <>
      <div className="modal-overlay absolute inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose}></div>
      <div className="modal-panel absolute inset-0 flex items-start justify-center p-4 pointer-events-none z-50">
        <div className="modal-scroll bg-white dark:bg-[#1e1f26] border border-gray-200 dark:border-gray-700 rounded-xl w-full max-w-[640px] max-h-[90vh] overflow-y-auto pointer-events-auto">
          <div className="sticky top-0 z-10 bg-white dark:bg-[#1e1f26] border-b border-gray-100 dark:border-gray-700/60 p-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-emerald-100 dark:bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <svg className="text-emerald-600 dark:text-emerald-400 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
              </div>
              <div>
                <h2 className="text-[15px] font-bold text-gray-900 dark:text-gray-100">Yeni Personel Ekle</h2>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">Kayıt <span className="font-mono">Operasyon_Ekip.JSON</span>'a eklenir</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1">
              <CloseIcon />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-5 space-y-5">
            <div>
              <h3 className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Temel Bilgiler</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormInput name="fullName" label="Ad Soyad *" placeholder="Ad Soyad" required />
                <FormInput name="position" label="Pozisyon *" placeholder="ör. Satış Uzmanı" required />
                <div>
                  <label className="block text-[11px] font-medium text-gray-700 dark:text-gray-300 mb-1">Birim *</label>
                  <select name="department" required className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-300 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:border-gray-900 dark:focus:border-gray-400">
                    <option value="">Seçiniz...</option>
                    <option value="Yönetim">Yönetim</option>
                    <option value="Pazarlama">Pazarlama</option>
                    <option value="Satış">Satış</option>
                    <option value="Finans">Finans</option>
                    <option value="Operasyon">Operasyon</option>
                    <option value="Prodüksiyon">Prodüksiyon</option>
                    <option value="Teknik">Teknik</option>
                  </select>
                </div>
                <FormInput name="startDate" label="İşe Başlama Tarihi *" type="date" defaultValue="2026-04-23" required />
                <FormInput name="birthDate" label="Doğum Tarihi" type="date" />
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">İletişim</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormInput name="email" label="E-posta *" type="email" placeholder="isim@arma.digital" required mono />
                <FormInput name="phone" label="Telefon" type="tel" placeholder="+90 5XX XXX XX XX" mono />
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Maaş & Sözleşme</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormInput name="salary" label="Brüt Maaş (₺)" type="number" placeholder="40000" />
                <div>
                  <label className="block text-[11px] font-medium text-gray-700 dark:text-gray-300 mb-1">Raporluğu</label>
                  <select name="reportsTo" className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-300 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:border-gray-900 dark:focus:border-gray-400">
                    <option value="">Seçiniz...</option>
                    <option value="Osman Atasoy">Osman Atasoy (Genel Müdür)</option>
                    <option value="Çiğdem Alataş">Çiğdem Alataş (Satış Direktörü)</option>
                    <option value="Berke Yılmaz">Berke Yılmaz (Ads & Prodüksiyon Direktörü)</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">ADOS Panel Erişimi</h3>
              <div className="bg-gray-50 dark:bg-[#17181f] border border-gray-200 dark:border-gray-700/40 rounded-lg p-3 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-gray-700 dark:text-gray-300 mb-1">Rol *</label>
                    <select name="role" required defaultValue="Pazarlama" className="w-full px-3 py-2 text-[12px] bg-white dark:bg-[#1e1f26] border border-gray-300 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:border-gray-900 dark:focus:border-gray-400">
                      {ROLE_OPTIONS.map((roleOption) => (
                        <option key={roleOption} value={roleOption}>{roleOption}</option>
                      ))}
                    </select>
                  </div>
                  <FormInput name="password" label="Şifre *" type="password" placeholder="Geçici şifre" required />
                </div>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input name="adosAccess" type="checkbox" onChange={(event) => setAdosAccess(event.currentTarget.checked)} className="mt-0.5 w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-amber-600 focus:ring-amber-500" />
                  <div>
                    <p className="text-[12px] font-semibold text-gray-900 dark:text-gray-100">ADOS Panel erişimi ver</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">İşaretlenmezse personel sadece Microsoft Planner ile takip edilir</p>
                  </div>
                </label>

                <div className={`${adosAccess ? '' : 'hidden '}pl-6 space-y-3 border-l-2 border-amber-300 dark:border-amber-500/30`}>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input name="mfa" type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-amber-600 focus:ring-amber-500" />
                    <span className="text-[11px] text-gray-700 dark:text-gray-300">MFA (iki adımlı doğrulama) zorunlu</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input name="sendInvite" type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-amber-600 focus:ring-amber-500" />
                    <span className="text-[11px] text-gray-700 dark:text-gray-300">E-posta davet gönder (kullanıcı adı + şifre oluşturma bağlantısı)</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white dark:bg-[#1e1f26] border-t border-gray-100 dark:border-gray-700/60 p-4 -mx-5 -mb-5 flex items-center justify-end gap-2">
              <button type="button" onClick={onClose} className="px-3 py-2 text-[11px] font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">İptal</button>
              <button type="submit" className="px-4 py-2 text-[11px] font-semibold bg-gray-900 dark:bg-gray-100 dark:text-gray-900 text-white rounded-md hover:opacity-90 transition-opacity flex items-center gap-1.5">
                <CheckIcon />
                Kaydet ve Operasyon_Ekip.JSON'a Yaz
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

function FormInput({
  name,
  label,
  type = 'text',
  placeholder,
  defaultValue,
  required,
  mono,
}: {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
  mono?: boolean;
}) {
  return (
    <div>
      <label className="block text-[11px] font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className={`w-full px-3 py-2 text-[12px] bg-white dark:bg-[#17181f] border border-gray-300 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:border-gray-900 dark:focus:border-gray-400${mono ? ' font-mono' : ''}`}
      />
    </div>
  );
}

function Toast({ toast, onClose }: { toast: ToastState; onClose: () => void }) {
  if (!toast) return null;

  const clrs = {
    emerald: { bg: '#10b981', bd: '#059669' },
    rose: { bg: '#f43f5e', bd: '#e11d48' },
    amber: { bg: '#f59e0b', bd: '#d97706' },
    sky: { bg: '#0ea5e9', bd: '#0284c7' },
    violet: { bg: '#8b5cf6', bd: '#7c3aed' },
    gray: { bg: '#6b7280', bd: '#4b5563' },
  };
  const color = clrs[toast.color] || clrs.emerald;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        minWidth: '280px',
        maxWidth: '400px',
        background: 'white',
        borderLeft: `4px solid ${color.bd}`,
        borderRadius: '10px',
        boxShadow: '0 8px 24px rgba(0,0,0,.15)',
        padding: '14px 16px',
        animation: 'toastSlide .3s ease-out',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: '13px', color: color.bg, marginBottom: '2px' }}>{toast.title}</div>
          <div style={{ fontSize: '11px', color: '#6b7280' }}>{toast.message}</div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: '16px' }}>×</button>
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, height: '2px', background: color.bg, borderRadius: '0 0 10px 10px', animation: 'toastProgress 3s linear' }}></div>
    </div>
  );
}
