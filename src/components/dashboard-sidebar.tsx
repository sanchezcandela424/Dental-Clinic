"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image"; // Imported to handle optimized and responsive clinic logo
import {
    LayoutDashboard,
    Users,
    CalendarClock,
    Search,
    Receipt,
    ShieldAlert,
    Settings,
} from "lucide-react";

import { Input } from "@/components/ui/input";

type DashboardSidebarProps = {
    isMaster?: boolean;
};

export function DashboardSidebar({
                                     isMaster = true,
                                 }: DashboardSidebarProps) {
    const pathname = usePathname();
    return (
        <aside className="sticky top-0 hidden h-screen w-72 flex-col space-y-8 border-r bg-white p-6 text-slate-600 md:flex">

            {/* LOGO */}
            <div className="mb-2 flex flex-col items-center gap-3 px-2">

                <div className="relative flex h-24 w-36 items-center justify-center">
                    <Image 
                        src="/clinic-logo-v3.png" 
                        alt="Clinic Official Logo" 
                        fill
                        priority
                        className="object-contain"
                    />
                </div>

                <div className="flex flex-col items-center">

          <span className="text-2xl font-black uppercase tracking-tighter text-[#1e293b]">
            City<span className="text-[#3b82f6]">Dent</span>
          </span>

                    <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600">
            Sistem Uprave
          </span>

                </div>
            </div>

            {/* SEARCH */}
            <div className="relative">

                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <Input
                    placeholder="Pretraga pacijenata..."
                    className="ring-blue-100 h-10 rounded-xl border-none bg-slate-50 pl-10 text-sm focus-visible:ring-1"
                />

            </div>

            {/* NAVIGATION */}
            <nav className="flex-1 space-y-2">

                <Link href="/dashboard">
                    <NavItem
                        icon={<LayoutDashboard size={18} />}
                        label="Nadzorna ploča"
                        active={pathname === "/dashboard"}
                    />
                </Link>

               <Link href="/dashboard/appointments">
            <NavItem
                icon={<CalendarClock size={18} />}
                label="Kalendar i Termini"
                active={pathname === "/dashboard/appointments"}
            />
        </Link>

                <Link href="/dashboard/patients">
                    <NavItem
                        icon={<Users size={18} />}
                        label="Baza Pacijenata"
                        active={pathname.startsWith(
                            "/dashboard/patients"
                        )}
                    />
                </Link>

                <NavItem
                    icon={<Receipt size={18} />}
                    label="Računi i Naplata"
                />



            </nav>

        </aside>
    );
}

function NavItem({
                     icon,
                     label,
                     active = false,
                     isMasterOnly = false,
                 }: {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    isMasterOnly?: boolean;
}) {
    return (
        <div
            className={`flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200
        ${
                active
                    ? "bg-blue-600 font-semibold text-white shadow-md shadow-blue-100"
                    : "font-semibold text-slate-500 hover:bg-slate-50 hover:text-blue-600"
            }
        ${
                isMasterOnly
                    ? "hover:bg-rose-50 hover:text-rose-600"
                    : ""
            }
      `}
        >

            {icon}

            <span className="flex-1 text-sm tracking-tight">
        {label}
      </span>

            {isMasterOnly && (
                <LockIcon
                    size={14}
                    className="text-rose-300"
                />
            )}

        </div>
    );
}

function LockIcon({
                      size,
                      className,
                  }: {
    size: number;
    className: string;
}) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <rect
                x="3"
                y="11"
                width="18"
                height="11"
                rx="2"
                ry="2"
            />

            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
    );
}