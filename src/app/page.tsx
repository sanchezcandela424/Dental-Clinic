"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from "next-auth/react"; 
import { 
  Lock, Mail, ShieldCheck, ArrowRight, 
  Stethoscope, UserCog, ClipboardList, ChevronLeft,
  Loader2 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<'MASTER' | 'STAFF' | null>(null);
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState(""); 
  const [loading, setLoading] = useState(false); 
  const [serverError, setServerError] = useState(""); 
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Temel kontrol: Alanlar boşsa işlem yapma
    if (!selectedRole || !email || !password) return;

    setLoading(true);
    setServerError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      // KRİTİK KONTROL: Sadece 'ok' true ise yönlendir
        if (result?.ok) {
            router.push(`/dashboard?role=${selectedRole}`);
        } else {
            if (result?.error === "ACCOUNT_INACTIVE") {
                setServerError("Vaš nalog je deaktiviran. Kontaktirajte administratora.");
            } else {
                setServerError("Neispravan email ili lozinka.");
            }
        }
    } catch (error) {
        setServerError("Došlo je do greške pri prijavi.");
    } finally {
        setLoading(false);
    }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans selection:bg-blue-100 relative overflow-hidden">
      
      {/* Dekoratif Arka Plan */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-50 rounded-full blur-3xl opacity-60 z-0" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-blue-50 rounded-full blur-3xl opacity-60 z-0" />

      <main className="flex-1 flex items-center justify-center p-6 z-10">
        <div className="w-full max-w-md space-y-8">
          
          {/* Logo ve Başlık */}
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="h-28 w-56 drop-shadow-sm">
              <SmilingTeethTeam className="h-full w-full" />
            </div>
            <div className="space-y-1">
              <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase">
                City<span className="text-blue-600">Dent</span>
              </h1>
              <p className="text-blue-500 font-bold tracking-[0.3em] text-[10px] uppercase">
                Internal Management System
              </p>
            </div>
          </div>

          {!selectedRole ? (
            /* Rol Seçim Ekranı */
            <div className="space-y-4 animate-in fade-in zoom-in duration-300">
              <h2 className="text-center text-xs font-bold text-slate-400 mb-6 uppercase tracking-[0.2em]">Odaberite ulogu za pristup</h2>
              
              <div className="grid grid-cols-1 gap-4">
                <RoleButton 
                  icon={<Stethoscope size={28} className="text-blue-600" />}
                  title="Master Ulaz"
                  description="Pristup za doktora"
                  onClick={() => setSelectedRole('MASTER')}
                />
                <RoleButton 
                  icon={<ClipboardList size={28} className="text-slate-500" />}
                  title="Staff Ulaz"
                  description="Pristup za osoblje"
                  onClick={() => setSelectedRole('STAFF')}
                />
              </div>
            </div>
          ) : (
            /* Giriş Formu Ekranı */
            <Card className="border-none shadow-2xl shadow-blue-100/50 rounded-[32px] p-2 bg-white/80 backdrop-blur-md animate-in slide-in-from-right duration-300">
              <CardHeader className="space-y-1 pb-6 pt-6">
                <button 
                  onClick={() => { setSelectedRole(null); setServerError(""); }}
                  className="flex items-center gap-1 text-[10px] font-bold text-blue-600 uppercase mb-4 hover:bg-blue-50 w-fit p-2 rounded-lg transition-all"
                >
                  <ChevronLeft size={14} /> Nazad
                </button>
                <CardTitle className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                  {selectedRole === 'MASTER' ? <UserCog className="text-blue-600" /> : <ClipboardList className="text-slate-500" />}
                  Prijava: {selectedRole === 'MASTER' ? 'Master' : 'Staff'}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-400 ml-1 tracking-widest">Email adresa</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <Input 
                        type="email"
                        required
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setServerError(""); }}
                        placeholder="example@citydent.com" 
                        className="pl-12 h-14 bg-slate-50/50 border-slate-100 rounded-2xl focus-visible:ring-blue-600 font-medium"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-400 tracking-widest ml-1">Lozinka</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <Input 
                        type="password"
                        required
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setServerError(""); }}
                        placeholder="••••••••" 
                        className="pl-12 h-14 bg-slate-50/50 border-slate-100 rounded-2xl focus-visible:ring-blue-600 font-medium"
                      />
                    </div>
                  </div>

                  {/* Hata Mesajı Gösterimi */}
                  {serverError && (
                    <div className="p-3 bg-red-50 rounded-xl border border-red-100 animate-in fade-in slide-in-from-top-1">
                      <p className="text-[10px] font-black text-red-500 uppercase tracking-widest text-center">
                        {serverError}
                      </p>
                    </div>
                  )}

                  <Button 
                    type="submit"
                    disabled={loading}
                    className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-xl shadow-blue-200 transition-all font-bold text-base gap-2 group"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <>
                        <span>Pristupi panelu</span>
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="pt-2 flex items-center justify-center gap-2">
                  <ShieldCheck size={14} className="text-emerald-500" />
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    AES-256 Sigurna veza
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <footer className="p-6 text-center z-10">
        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.4em]">
          CityDent IMS © 2026 | Sva prava zadržana
        </p>
      </footer>
    </div>
  );
}

function RoleButton({ icon, title, description, onClick }: { icon: React.ReactNode, title: string, description: string, onClick: () => void }) {
  return (
    <button 
      type="button"
      onClick={onClick}
      className="group flex items-center gap-6 p-6 bg-white hover:bg-blue-600 border border-slate-100 rounded-[28px] text-left transition-all hover:shadow-2xl hover:shadow-blue-200 hover:-translate-y-1"
    >
      <div className="h-16 w-16 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-white transition-colors">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-bold text-slate-900 group-hover:text-white transition-colors">{title}</h3>
        <p className="text-xs text-slate-500 group-hover:text-blue-100 transition-colors">{description}</p>
      </div>
      <ArrowRight className="ml-auto text-slate-300 group-hover:text-white transition-all opacity-0 group-hover:opacity-100" />
    </button>
  );
}

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