"use client";

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  LayoutDashboard, Users, CalendarClock, Search, 
  TrendingUp, TrendingDown, Bell, MoreVertical, 
  LogIn, Receipt, Settings, ShieldAlert, UserCog
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Next.js'de searchParams kullanımı için Suspense sarmalı gereklidir
export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Učitavanje...</div>}>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const searchParams = useSearchParams();
  
  // URL'den rolü al (e.g., /dashboard?role=MASTER)
  const roleFromUrl = searchParams.get('role');
  const userRole: 'MASTER' | 'STAFF' = roleFromUrl === 'MASTER' ? 'MASTER' : 'STAFF';
  const isMaster = userRole === 'MASTER';

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-100">
      {/* --- SIDEBAR --- */}
      <aside className="w-72 border-r bg-white flex flex-col p-6 space-y-8 hidden md:flex text-slate-600">
        
        {/* LOGO BÖLÜMÜ (Simetrik Ölçek Korundu) */}
        <div className="flex flex-col items-center gap-3 px-2 mb-2">
          <div className="h-24 w-36 flex items-center justify-center">
            <SmilingTeethTeam className="h-full w-full" />
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-black tracking-tighter text-[#1e293b] uppercase">
              City<span className="text-[#3b82f6]">Dent</span>
            </span>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] mt-1">
              Sistem Uprave
            </span>
          </div>
        </div>

        {/* Pretraga (Arama) */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="Pretraga pacijenata..." className="pl-10 h-10 bg-slate-50 border-none text-sm focus-visible:ring-1 ring-blue-100 rounded-xl" />
        </div>

        {/* Navigacija */}
        <nav className="flex-1 space-y-2">
          <NavItem icon={<LayoutDashboard size={18}/>} label="Nadzorna ploča" active />
          <NavItem icon={<CalendarClock size={18}/>} label="Kalendar i Termini" />
          <NavItem icon={<Users size={18}/>} label="Baza Pacijenata" />
          <NavItem icon={<Receipt size={18}/>} label="Računi i Naplata" />
          
          {/* KOŞULLU RENDER: SADECE MASTER GÖREBİLİR */}
          {isMaster && (
            <>
              <div className="pt-6 pb-2 animate-in fade-in duration-500">
                <div className="flex items-center gap-2 px-4">
                  <ShieldAlert size={14} className="text-rose-500" />
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Master Opcije</p>
                </div>
              </div>
              <NavItem icon={<Settings size={18}/>} label="Cjenovnik i Postavke" isMasterOnly />
            </>
          )}
        </nav>
      </aside>

      {/* --- GLAVNI SADRŽAJ --- */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8 text-slate-500">
            <div>
              <h1 className="text-2xl font-bold text-blue-950 uppercase tracking-tighter">City Dental</h1>
              <p className="text-sm text-slate-400 font-medium italic">Dobrodošli u CityDent: Dom vašeg savršenog osmijeha.</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" className="h-10 w-10 rounded-full border-slate-200">
                  <Bell size={20} className="text-slate-500" />
              </Button>

              {/* DİNAMİK PROFİL BUTONU */}
              <Button 
                variant={isMaster ? "default" : "secondary"}
                className={`${isMaster ? 'bg-blue-950 hover:bg-blue-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'} rounded-xl px-5 py-2 h-auto flex items-center gap-2 shadow-sm transition-all font-semibold text-sm`}
              >
                {isMaster ? <UserCog size={18} className="text-blue-400" /> : <LogIn size={18} />}
                <span>{isMaster ? 'Dr. Master' : 'Staff Osoblje'}</span>
              </Button>
            </div>
        </header>

        {/* KPI KARTLARI (Rol bazlı kolon yapısı) */}
        <div className={`grid grid-cols-1 ${isMaster ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6 mb-8`}>
          
          {/* KOŞULLU RENDER: SADECE MASTER GÖREBİLİR (Gelir Kartı) */}
          {isMaster && (
            <Card className="border-none shadow-sm hover:shadow-md transition-shadow rounded-2xl animate-in zoom-in duration-300">
              <CardHeader className="pb-1 px-5 pt-5">
                <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ukupni prihodi</CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-5 pt-2">
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-black text-blue-950">15%</span>
                  <div className="flex items-center text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <TrendingUp size={14} className="mr-1" />
                      <span className="text-xs font-bold">Rast</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 mt-2 font-medium">U odnosu na prošlu sedmicu</p>
                <Button variant="link" className="text-blue-600 p-0 h-auto text-xs font-bold mt-3">Izvještaj prihoda →</Button>
              </CardContent>
            </Card>
          )}

          <Card className="border-none shadow-sm hover:shadow-md transition-shadow rounded-2xl">
            <CardHeader className="pb-1 px-5 pt-5">
              <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">Otkazani termini</CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5 pt-2">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-black text-blue-950">4%</span>
                <div className="flex items-center text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">
                    <TrendingDown size={14} className="mr-1" />
                    <span className="text-xs font-bold">Pad</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-2 font-medium">Zatvoreno 96 od 100 termina</p>
              <Button variant="link" className="text-blue-600 p-0 h-auto text-xs font-bold mt-3">Svi termini →</Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl">
            <CardHeader className="pb-1 px-5 pt-5 text-center">
              <CardTitle className="text-xs font-bold text-blue-100 uppercase tracking-wider">Dnevni cilj termina</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center px-5 pb-5 pt-2">
              <div className="relative h-20 w-36 flex items-end justify-center overflow-hidden">
                <div className="absolute inset-0 border-[10px] border-blue-500/30 rounded-full" />
                <div className="absolute inset-0 border-[10px] border-white rounded-full border-b-transparent border-l-transparent rotate-[45deg]" />
                <span className="text-2xl font-black mb-1">84%</span>
              </div>
              <Button variant="link" className="text-blue-100 p-0 h-auto text-xs font-bold mt-3">Detalji →</Button>
            </CardContent>
          </Card>
        </div>

        {/* Alt Bölüm: Hasta Listesi ve Grafik */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border-none shadow-sm overflow-hidden rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between bg-white border-b border-slate-50 px-6 py-4">
              <CardTitle className="text-lg font-bold text-blue-950">Nedavni Pacijenti</CardTitle>
              <Button variant="ghost" className="text-xs font-bold text-slate-500">Poredaj po: Najnovijim</Button>
            </CardHeader>
            <CardContent className="p-0">
               <PatientItem name="Sanjin Ruzic" description="Stomatološki pregled" avatar="SR" />
               <PatientItem name="Edin Hodžić" description="Čišćenje kamenca" active avatar="EH" />
               <PatientItem name="Amina Begić" description="Popravka zuba" avatar="AB" />
               <PatientItem name="Ajsa Jusić" description="Kontrola" avatar="AJ" />
               <div className="p-4 border-t border-slate-50">
                <Button variant="link" className="text-blue-600 p-0 h-auto text-xs font-bold">Svi pacijenti →</Button>
               </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm flex flex-col p-6 rounded-2xl bg-white">
              <CardTitle className="text-lg font-bold text-blue-950 mb-6">Aktivnost Klinike</CardTitle>
               <div className="flex-1 flex flex-col justify-end">
               <div className="h-44 w-full bg-gradient-to-t from-blue-50/30 to-transparent rounded-xl flex items-end gap-1.5 px-2">
                 {[40, 60, 45, 80, 55, 90, 70, 95].map((h, i) => (
                   <div key={i} style={{ height: `${h}%` }} className="flex-1 bg-blue-600/20 hover:bg-blue-600 rounded-t-sm transition-all cursor-pointer" />
                 ))}
               </div>
               <div className="flex justify-between mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                 <span>Pon</span><span>Sri</span><span>Pet</span>
               </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}

// --- ALT BİLEŞENLER ---

function SmilingTeethTeam({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 350 200" className={className}>
      <g transform="translate(5, 30) scale(0.8)">
        <path d="M50,50 C50,20 150,20 150,50 C150,75 165,90 160,115 C155,140 140,150 130,175 C125,188 120,195 110,195 C100,195 98,175 100,155 C102,175 100,195 90,195 C80,195 75,188 70,175 C60,150 45,140 40,115 C35,90 50,75 50,50 Z" fill="white" stroke="#cbd5e1" strokeWidth="4" />
        <circle cx="85" cy="70" r="4" fill="#1e293b" /><circle cx="115" cy="70" r="4" fill="#1e293b" />
        <path d="M85,90 Q100,105 115,90" fill="none" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
      </g>
      <g transform="translate(185, 30) scale(0.8)">
        <path d="M50,50 C50,20 150,20 150,50 C150,75 165,90 160,115 C155,140 140,150 130,175 C125,188 120,195 110,195 C100,195 98,175 100,155 C102,175 100,195 90,195 C80,195 75,188 70,175 C60,150 45,140 40,115 C35,90 50,75 50,50 Z" fill="white" stroke="#cbd5e1" strokeWidth="4" />
        <circle cx="85" cy="70" r="4" fill="#1e293b" /><circle cx="115" cy="70" r="4" fill="#1e293b" />
        <path d="M85,90 Q100,105 115,90" fill="none" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
      </g>
      <g transform="translate(75, 5) scale(1.0)">
        <path d="M50,50 C50,20 150,20 150,50 C150,75 165,90 160,115 C155,140 140,150 130,175 C125,188 120,195 110,195 C100,195 98,175 100,155 C102,175 100,195 90,195 C80,195 75,188 70,175 C60,150 45,140 40,115 C35,90 50,75 50,50 Z" fill="white" stroke="#3b82f6" strokeWidth="6" strokeLinejoin="round" />
        <circle cx="85" cy="70" r="5" fill="#1e293b" /><circle cx="115" cy="70" r="5" fill="#1e293b" />
        <path d="M80,95 Q100,115 120,95" fill="none" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function NavItem({ icon, label, active = false, isMasterOnly = false }: { icon: React.ReactNode, label: string, active?: boolean, isMasterOnly?: boolean }) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 
      ${active ? 'bg-blue-600 text-white shadow-md shadow-blue-100 font-semibold' : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600 font-semibold'}
      ${isMasterOnly ? 'hover:bg-rose-50 hover:text-rose-600' : ''}
    `}>
      {icon}
      <span className="text-sm tracking-tight flex-1">{label}</span>
      {isMasterOnly && <LockIcon size={14} className="text-rose-300" />}
    </div>
  );
}

function LockIcon({ size, className }: { size: number, className: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  );
}

function PatientItem({ name, description, active = false, avatar }: { name: string, description: string, active?: boolean, avatar: string }) {
  return (
    <div className={`flex items-center justify-between px-6 py-4 border-b border-slate-50 last:border-0 transition-all ${active ? 'bg-orange-50/30' : 'hover:bg-slate-50/50'}`}>
      <div className="flex items-center gap-4">
        <Avatar className="h-10 w-10">
          <AvatarFallback className={`${active ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'} text-xs font-bold`}>{avatar}</AvatarFallback>
        </Avatar>
        <div>
          <p className={`text-sm font-bold ${active ? 'text-blue-950' : 'text-slate-700'}`}>{name}</p>
          <p className="text-[11px] font-medium text-slate-400 italic">{description}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300"><MoreVertical size={16}/></Button>
      </div>
    </div>
  );
}