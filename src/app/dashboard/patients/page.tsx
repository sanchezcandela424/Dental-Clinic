"use client";

import Link from "next/link";
import { useState } from "react";
import { useDebounce } from "~/hooks/use-debounce";

import {
    Eye,
    Pencil,
    Trash2,
} from "lucide-react";

export default function PatientsPage() {
    const [search, setSearch] = useState("");

    const debouncedSearch =
        useDebounce(search);

    const isSearching =
        search !== debouncedSearch;

    const patients = [
        {
            id: 1,
            fullName: "Ajla Hafizovic",
            email: "ajla1@gmail.com",
            phone: "+387607383932",
        },
    ];

    const filteredPatients =
        patients.filter((patient) =>
            patient.fullName
                .toLowerCase()
                .includes(
                    debouncedSearch.toLowerCase()
                )
        );

    return (
        <div className="min-h-screen bg-gray-50 p-6">

            <div className="mx-auto max-w-6xl space-y-6">

                {/* HEADER */}
                <div className="flex items-center justify-between">

                    <div>

                        <h1 className="text-3xl font-semibold">
                            Baza Pacijenata
                        </h1>

                        <p className="mt-1 text-gray-500">
                            Pregled svih registrovanih pacijenata.
                        </p>

                    </div>

                    <Link
                        href="/dashboard/patients/create"
                        className="rounded-xl bg-blue-600 px-5 py-3 text-white transition hover:bg-blue-700"
                    >
                        + Novi pacijent
                    </Link>

                </div>

                {/* SEARCH */}
                <div className="rounded-3xl bg-white p-5 shadow-sm">

                    <input
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        placeholder="Pretraži pacijente..."
                        className="w-full rounded-xl border border-gray-200 p-3 outline-none transition focus:ring-2 focus:ring-blue-400"
                    />

                    {isSearching && (
                        <p className="mt-2 text-sm text-gray-500">
                            Pretraga...
                        </p>
                    )}

                </div>

                {/* PATIENTS TABLE */}
                <div className="overflow-hidden rounded-3xl bg-white shadow-sm">

                    <table className="w-full">

                        <thead className="border-b bg-gray-50">

                        <tr className="text-left text-sm text-gray-500">

                            <th className="px-6 py-4">
                                Pacijent
                            </th>

                            <th className="px-6 py-4">
                                Email
                            </th>

                            <th className="px-6 py-4">
                                Telefon
                            </th>

                            <th className="px-6 py-4">
                                Akcije
                            </th>

                        </tr>

                        </thead>

                        <tbody>

                        {filteredPatients.map(
                            (patient) => (
                                <tr
                                    key={patient.id}
                                    className="border-b last:border-0 transition hover:bg-gray-50"
                                >

                                    <td className="px-6 py-4 font-medium">
                                        {patient.fullName}
                                    </td>

                                    <td className="px-6 py-4 text-gray-600">
                                        {patient.email}
                                    </td>

                                    <td className="px-6 py-4 text-gray-600">
                                        {patient.phone}
                                    </td>

                                    <td className="px-6 py-4">

                                        <div className="flex items-center gap-4">

                                            {/* PROFILE */}
                                            <Link
                                                href={`/dashboard/patients/${patient.id}`}
                                                className="text-blue-600 transition hover:text-blue-800"
                                                title="Profil"
                                            >
                                                <Eye size={18} />
                                            </Link>

                                            {/* EDIT */}
                                            <Link
                                                href={`/dashboard/patients/${patient.id}/edit`}
                                                className="text-gray-600 transition hover:text-gray-800"
                                                title="Uredi"
                                            >
                                                <Pencil size={18} />
                                            </Link>

                                            {/* DELETE */}
                                            <button
                                                onClick={() => {
                                                    alert(
                                                        "Demo verzija bez baze podataka."
                                                    );
                                                }}
                                                className="text-red-500 transition hover:text-red-700"
                                                title="Obriši"
                                            >
                                                <Trash2 size={18} />
                                            </button>

                                        </div>

                                    </td>

                                </tr>
                            )
                        )}

                        {filteredPatients.length ===
                            0 && (
                                <tr>

                                    <td
                                        colSpan={4}
                                        className="px-6 py-10 text-center text-gray-500"
                                    >
                                        Nema pronađenih pacijenata.
                                    </td>

                                </tr>
                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
}