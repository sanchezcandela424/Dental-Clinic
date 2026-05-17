"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AutoLogoutProvider from "@/app/_components/AutoLogoutProvider";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
export default function DashboardLayout({
                                            children,
                                        }: {
    children: React.ReactNode;
}) {
    const { status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.replace("/");
        }
    }, [status, router]);


    if (status === "loading") {
        return <div className="p-10 text-center">Učitavanje...</div>;
    }


    if (status === "unauthenticated") {
        return null;
    }

    return (
        <AutoLogoutProvider>

            <div className="flex min-h-screen bg-[#F8FAFC]">

                <DashboardSidebar />

                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>

            </div>

        </AutoLogoutProvider>
    );
}