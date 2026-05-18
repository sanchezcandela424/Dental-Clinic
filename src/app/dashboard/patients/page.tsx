"use client";

import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounce } from "~/hooks/use-debounce";
import { api } from "~/trpc/react";

import {
    Eye,
    Pencil,
    Trash2,
} from "lucide-react";

export default function PatientsPage() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Read parameters from URL to maintain single source of truth
    const urlSearch = searchParams.get("search") ?? "";
    const urlPage = Number(searchParams.get("page") ?? "1");
    const urlSortBy = searchParams.get("sortBy") ?? "createdAt";
    const urlSortOrder = searchParams.get("sortOrder") ?? "desc";

    // Local state for instant and fluid typing feedback
    const [searchInput, setSearchInput] = useState(urlSearch);
    const debouncedSearch = useDebounce(searchInput, 500);

    // Fetch real-time synchronized data from the tRPC backend
    const { data, isLoading } = api.patient.getPaginated.useQuery(
        {
            search: debouncedSearch,
            page: urlPage,
            limit: 8,
            sortBy: urlSortBy as "fullName" | "createdAt" | "dateOfBirth",
            sortOrder: urlSortOrder as "asc" | "desc",
        },
        {
            placeholderData: (previousData) => previousData,
        }
    );

    // Helper function to safely update URL search parameters
    const updateQueryParams = (params: Record<string, string | null>) => {
        const current = new URLSearchParams(Array.from(searchParams.entries()));
        
        Object.entries(params).forEach(([key, value]) => {
            if (value === null || value === "") {
                current.delete(key);
            } else {
                current.set(key, value);
            }
        });

        const searchStr = current.toString();
        const query = searchStr ? `?${searchStr}` : "";
        router.push(`${pathname}${query}`);
    };

    // Update URL query parameters whenever search input settles
    useEffect(() => {
        updateQueryParams({ search: debouncedSearch, page: "1" });
    }, [debouncedSearch]);

    const isSearching = searchInput !== debouncedSearch;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="mx-auto max-w-6xl space-y-6">

                {/* HEADER SECTION */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold">Baza Pacijenata</h1>
                        <p className="mt-1 text-gray-500">Pregled svih registrovanih pacijenata.</p>
                    </div>
                    <Link
                        href="/dashboard/patients/create"
                        className="rounded-xl bg-blue-600 px-5 py-3 text-white transition hover:bg-blue-700"
                    >
                        + Novi pacijent
                    </Link>
                </div>

                {/* CONTROLS AREA: SEARCH BAR AND SORTING OPTIONS */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 rounded-3xl bg-white p-5 shadow-sm">
                    {/* Search Field */}
                    <div className="sm:col-span-2">
                        <input
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Pretraži pacijente (Ime, JMB ili Telefon)..."
                            className="w-full rounded-xl border border-gray-200 p-3 outline-none transition focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    {/* Sorting Dropdown Menu */}
                    <div>
                        <select
                            value={`${urlSortBy}-${urlSortOrder}`}
                            onChange={(e) => {
                                const [sortBy, sortOrder] = e.target.value.split("-");
                                updateQueryParams({ sortBy, sortOrder, page: "1" });
                            }}
                            className="w-full rounded-xl border border-gray-200 p-3 outline-none bg-white transition focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="createdAt-desc">Najnoviji pacijenti</option>
                            <option value="createdAt-asc">Najstariji pacijenti</option>
                            <option value="fullName-asc">Ime (A-Z)</option>
                            <option value="fullName-desc">Ime (Z-A)</option>
                        </select>
                    </div>

                    {/* Loading State Feedback */}
                    {(isSearching || isLoading) && (
                        <p className="sm:col-span-3 text-sm text-gray-500 animate-pulse">
                            Pretraga u toku...
                        </p>
                    )}
                </div>

                {/* PATIENTS DATA TABLE */}
                <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
                    <table className="w-full">
                        <thead className="border-b bg-gray-50">
                            <tr className="text-left text-sm text-gray-500">
                                <th className="px-6 py-4">Pacijent</th>
                                <th className="px-6 py-4">JMB</th>
                                <th className="px-6 py-4">Telefon</th>
                                <th className="px-6 py-4">Akcije</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Render active list of patients retrieved from database */}
                            {!isLoading && data?.patients.map((patient) => (
                                <tr key={patient.id} className="border-b last:border-0 transition hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium">{patient.fullName}</td>
                                    <td className="px-6 py-4 text-gray-600">{patient.jmb}</td>
                                    <td className="px-6 py-4 text-gray-600">{patient.phone || "Nema telefona"}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            {/* Action links */}
                                            <Link href={`/dashboard/patients/${patient.id}`} className="text-blue-600 transition hover:text-blue-800" title="Profil">
                                                <Eye size={18} />
                                            </Link>
                                            <Link href={`/dashboard/patients/${patient.id}/edit`} className="text-gray-600 transition hover:text-gray-800" title="Uredi">
                                                <Pencil size={18} />
                                            </Link>
                                            <button
                                                onClick={() => alert("Brisanje pacijenta će biti implementirano u SCRUM-56.")}
                                                className="text-red-500 transition hover:text-red-700"
                                                title="Obriši"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {/* Fallback layout when query results return empty */}
                            {!isLoading && data?.patients.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                                        Nema pronađenih pacijenata.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* PAGINATION NAVIGATION INTERFACE */}
                {data?.meta && data.meta.totalPages > 1 && (
                    <div className="flex items-center justify-between rounded-3xl bg-white p-4 shadow-sm">
                        <button
                            onClick={() => updateQueryParams({ page: String(Math.max(urlPage - 1, 1)) })}
                            disabled={!data.meta.hasPreviousPage}
                            className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-medium transition hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-gray-100"
                        >
                            ◀ Prethodna
                        </button>

                        <span className="text-sm text-gray-600 font-medium">
                            Stranica {data.meta.currentPage} od {data.meta.totalPages}
                        </span>

                        <button
                            onClick={() => updateQueryParams({ page: String(Math.min(urlPage + 1, data.meta.totalPages)) })}
                            disabled={!data.meta.hasNextPage}
                            className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-medium transition hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-gray-100"
                        >
                            Sljedeća ▶
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}