"use client";
 
import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import Link from "next/link";
 
 
const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
    SCHEDULED:   { label: "Zakazano",  color: "#3b82f6", bg: "bg-blue-50 text-blue-700 border-blue-200" },
    WAITING:     { label: "Čeka",      color: "#eab308", bg: "bg-yellow-50 text-yellow-700 border-yellow-200" },
    IN_PROGRESS: { label: "U toku",    color: "#f97316", bg: "bg-orange-50 text-orange-700 border-orange-200" },
    COMPLETED:   { label: "Završeno",  color: "#22c55e", bg: "bg-green-50 text-green-700 border-green-200" },
    CANCELLED:   { label: "Otkazano",  color: "#94a3b8", bg: "bg-gray-50 text-gray-400 border-gray-200" },
};
 
function formatTime(date: Date | string) {
    return new Date(date).toTimeString().slice(0, 5);
}
 
 
export default function DashboardPage() {
    const { data: session } = useSession();
    const { data: stats, isLoading } = api.appointment.getDashboardStats.useQuery();
 
    const utils = api.useUtils();
 
    const updateStatus = api.appointment.update.useMutation({
        onSuccess: () => {
            void utils.appointment.getDashboardStats.invalidate();
        },
    });
 
    const pieData = stats
        ? Object.entries(stats.statusCounts)
              .filter(([, count]) => count > 0)
              .map(([status, count]) => ({
                  name:  STATUS_CONFIG[status]?.label ?? status,
                  value: count,
                  color: STATUS_CONFIG[status]?.color ?? "#94a3b8",
              }))
        : [];
 
    return (
        <div className="p-6 space-y-6">
 
            <div>
                <h1 className="text-2xl font-bold text-slate-900">
                    Dobro jutro, {session?.user?.role === "MASTER" ? "Doktore" : ""}
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                    Pregled rada za danas
                </p>
            </div>
 
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    label="Ukupno termina"
                    value={isLoading ? "..." : String(stats?.total ?? 0)}
                    color="text-blue-600"
                    bg="bg-blue-50"
                />
                <StatCard
                    label="Danas"
                    value={isLoading ? "..." : String(stats?.todaysAppointments.length ?? 0)}
                    color="text-orange-600"
                    bg="bg-orange-50"
                />
                <StatCard
                    label="Završeno"
                    value={isLoading ? "..." : String(stats?.statusCounts.COMPLETED ?? 0)}
                    color="text-green-600"
                    bg="bg-green-50"
                />
                <StatCard
                    label="Novi pacijenti (ovaj mj.)"
                    value={isLoading ? "..." : String(stats?.newPatientsThisMonth ?? 0)}
                    color="text-purple-600"
                    bg="bg-purple-50"
                />
            </div>
 
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
 
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-slate-800 mb-4">
                        Termini po statusu
                    </h2>
 
                    {isLoading && (
                        <div className="flex items-center justify-center h-48 text-gray-400">
                            Učitavanje...
                        </div>
                    )}
 
                    {!isLoading && pieData.length === 0 && (
                        <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
                            Nema podataka za prikaz.
                        </div>
                    )}
 
                    {!isLoading && pieData.length > 0 && (
                        <div className="flex flex-col items-center">
                            <ResponsiveContainer width="100%" height={220}>
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={3}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={index} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value, name) => [value, name]}
                                        contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0" }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
 
                            {/* Legend */}
                            <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-2 w-full">
                                {pieData.map((entry) => (
                                    <div key={entry.name} className="flex items-center gap-2">
                                        <span
                                            className="w-3 h-3 rounded-full shrink-0"
                                            style={{ backgroundColor: entry.color }}
                                        />
                                        <span className="text-sm text-gray-600">{entry.name}</span>
                                        <span className="text-sm font-bold text-gray-800 ml-auto">
                                            {entry.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
 
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-slate-800">Termini danas</h2>
                        <Link
                            href="/dashboard/appointments"
                            className="text-sm text-blue-600 hover:underline"
                        >
                            Vidi sve →
                        </Link>
                    </div>
 
                    {isLoading && (
                        <p className="text-sm text-gray-400 text-center py-8">Učitavanje...</p>
                    )}
 
                    {!isLoading && stats?.todaysAppointments.length === 0 && (
                        <p className="text-sm text-gray-400 text-center py-8">
                            Nema zakazanih termina za danas.
                        </p>
                    )}
 
                    <div className="space-y-3">
                        {stats?.todaysAppointments.map((appt) => (
                            <div
                                key={appt.id}
                                className={`flex items-center justify-between p-3 rounded-xl border ${
                                    STATUS_CONFIG[appt.status]?.bg ?? ""
                                }`}
                            >
                                <div>
                                    <p className="font-semibold text-sm text-slate-800">
                                        {appt.patient.fullName}
                                    </p>
                                    <p className="text-xs opacity-70 mt-0.5">
                                        {formatTime(appt.startTime)} — {formatTime(appt.endTime)}
                                    </p>
                                </div>
 
                                <div className="flex items-center gap-2">
                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
                                        STATUS_CONFIG[appt.status]?.bg ?? ""
                                    }`}>
                                        {STATUS_CONFIG[appt.status]?.label}
                                    </span>
 
                                    {appt.status === "SCHEDULED" && (
                                        <button
                                            onClick={() => updateStatus.mutate({ id: appt.id, status: "WAITING" })}
                                            className="text-xs px-2 py-0.5 rounded-lg bg-white/70 hover:bg-white font-medium transition border"
                                        >
                                            → Čeka
                                        </button>
                                    )}
                                    {appt.status === "WAITING" && (
                                        <button
                                            onClick={() => updateStatus.mutate({ id: appt.id, status: "IN_PROGRESS" })}
                                            className="text-xs px-2 py-0.5 rounded-lg bg-white/70 hover:bg-white font-medium transition border"
                                        >
                                            → U toku
                                        </button>
                                    )}
                                    {appt.status === "IN_PROGRESS" && (
                                        <button
                                            onClick={() => updateStatus.mutate({ id: appt.id, status: "COMPLETED" })}
                                            className="text-xs px-2 py-0.5 rounded-lg bg-white/70 hover:bg-white font-medium transition border"
                                        >
                                            ✓ Završi
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
 
function StatCard({
    label,
    value,
    color,
    bg,
}: {
    label: string;
    value: string;
    color: string;
    bg:    string;
}) {
    return (
        <div className={`${bg} rounded-2xl p-5 border border-white`}>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
            <p className={`text-3xl font-black mt-1 ${color}`}>{value}</p>
        </div>
    );
}