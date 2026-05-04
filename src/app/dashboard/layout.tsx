"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AutoLogoutProvider from "@/app/_components/AutoLogoutProvider";

export default function DashboardLayout({
                                            children,
                                        }: {
    children: React.ReactNode;
}) {
    const { status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.replace("/auth/login");
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
            {children}
        </AutoLogoutProvider>
    );
}