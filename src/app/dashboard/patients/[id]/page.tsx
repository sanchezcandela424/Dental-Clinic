"use client";

import Link from "next/link";

type PatientProfilePageProps = {
    params: {
        id: string;
    };
};

export default function PatientProfilePage({
                                               params,
                                           }: PatientProfilePageProps) {
    const patient = {
            fullName: "Ajla Hafizovic",
            email: "ajla1@gmail.com",
            phone: "+38761111222",
            address: "Sarajevo",
            jmb: "0101000123456",

            occupation: "Student",

            employmentStatus: "Student",


            notes: "Pacijent često kasni na termine.",



            dateOfBirth: "01.01.2000",

            totalVisits: 12,
            activeTreatments: 2,

            lastVisit: "14.05.2026",
            nextAppointment: "22.05.2026 u 14:30",

            allergiesFlag: true,
            allergiesDetails: "Penicilin",

            anesthesiaHistoryFlag: true,
            anesthesiaComplications:
                "Blaga mučnina nakon anestezije",

            medicationsFlag: true,
            medicationsDetails: "Brufen",

            previousDiseases:
                "Astma u djetinjstvu",

            currentDisease:
                "Upala desni",
        };
    const visits = [
        {
            title: "Kontrolni pregled",
            date: "14.05.2026",
            status: "Završeno",
        },
        {
            title: "Čišćenje kamenca",
            date: "01.04.2026",
            status: "Završeno",
        },
        {
            title: "Popravka zuba",
            date: "15.02.2026",
            status: "U toku",
        },
    ];

    const activeTreatments = [
        {
            title: "Ortodonska terapija",
            nextAppointment: "22.05.2026",
        },
        {
            title: "Izbjeljivanje zuba",
            nextAppointment: "28.05.2026",
        },
    ];

    const treatmentHistory = [
        {
            title: "Dental Cleaning",
            tooth: "Zub 14",
            price: 120,
            date: "14.11.2025",
            status: "Završeno",
        },
        {
            title: "Popravka zuba",
            tooth: "Zub 21",
            price: 180,
            date: "02.09.2025",
            status: "Završeno",
        },
        {
            title: "Vađenje zuba",
            tooth: "Zub 36",
            price: 90,
            date: "21.06.2025",
            status: "Završeno",
        },
    ];



    return (
        <div className="min-h-screen bg-gray-50 p-6">

            <div className="mx-auto max-w-5xl space-y-6">

                {/* BACK BUTTON */}
                <button
                    onClick={() => window.history.back()}
                    className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm transition hover:bg-gray-100"
                >
                    ← Nazad
                </button>

                {/* HEADER */}
                <div className="rounded-3xl bg-white p-6 shadow-sm">

                    <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">

                        <div className="flex items-center gap-4">

                            {/* AVATAR */}
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-2xl font-semibold text-blue-600">
                                {patient.fullName
                                    ?.split(" ")
                                    .map((name) => name.charAt(0))
                                    .slice(0, 2)
                                    .join("") ?? "P"}
                            </div>

                            <div>

                                <h1 className="text-3xl font-semibold">
                                    {patient.fullName}
                                </h1>

                                <p className="mt-1 text-gray-500">
                                    Profil pacijenta • Dr. Erdin
                                    Tatarević
                                </p>

                                {/* STATUS */}
                                <div className="mt-3 inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                                    Aktivan pacijent
                                </div>

                            </div>

                        </div>

                        {/* EDIT BUTTON */}
                        <Link
                            href={`/dashboard/patients/${params.id}/edit`}

                            className="rounded-xl bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
                        >
                            Uredi pacijenta
                        </Link>

                    </div>

                    {/* STATS */}
                    <div className="mt-6 grid gap-4 md:grid-cols-4">

                        <div className="rounded-2xl bg-gray-50 p-4">

                            <p className="text-sm text-gray-500">
                                Ukupno posjeta
                            </p>

                            <p className="mt-1 text-2xl font-semibold">
                                {patient.totalVisits}
                            </p>

                        </div>

                        <div className="rounded-2xl bg-gray-50 p-4">

                            <p className="text-sm text-gray-500">
                                Zadnja posjeta
                            </p>

                            <p className="mt-1 text-2xl font-semibold">
                                {patient.lastVisit}
                            </p>

                        </div>

                        <div className="rounded-2xl bg-gray-50 p-4">

                            <p className="text-sm text-gray-500">
                                Aktivni tretmani
                            </p>

                            <p className="mt-1 text-2xl font-semibold">
                                {patient.activeTreatments}
                            </p>

                        </div>

                        <div className="rounded-2xl bg-gray-50 p-4">

                            <p className="text-sm text-gray-500">
                                Sljedeći termin
                            </p>

                            <p className="mt-1 text-lg font-semibold">
                                {patient.nextAppointment}
                            </p>

                        </div>

                    </div>

                </div>

                {/* PERSONAL INFO */}
                <div className="rounded-3xl bg-white p-6 shadow-sm">

                    <h2 className="mb-4 text-xl font-semibold">
                        Lični podaci
                    </h2>

                    <div className="grid gap-4 md:grid-cols-3">

                        <div>
                            <p className="text-sm text-gray-500">
                                Email
                            </p>

                            <p className="font-medium">
                                {patient.email}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Telefon
                            </p>

                            <p className="font-medium">
                                {patient.phone}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Adresa
                            </p>

                            <p className="font-medium">
                                {patient.address}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                JMB
                            </p>

                            <p className="font-medium">
                                {patient.jmb}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Zanimanje
                            </p>

                            <p className="font-medium">
                                {patient.occupation}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Status zaposlenja
                            </p>

                            <p className="font-medium">
                                {patient.employmentStatus === "Zaposlen"
                                    ? "Zaposlen/a"
                                    : patient.employmentStatus === "Nezaposlen"
                                        ? "Nezaposlen/a"
                                        : patient.employmentStatus}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">
                                Datum rođenja
                            </p>

                            <p className="font-medium">
                                {patient.dateOfBirth}
                            </p>
                        </div>




                    </div>

                </div>

                {/* ACTIVE TREATMENTS */}
                <div className="rounded-3xl bg-white p-6 shadow-sm">

                    <h2 className="mb-5 text-xl font-semibold">
                        Aktivni tretmani
                    </h2>

                    <div className="space-y-4">

                        {activeTreatments.map(
                            (treatment, index) => (
                                <div
                                    key={index}
                                    className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
                                >

                                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">

                                        <div>
                                            <p className="font-medium">
                                                {treatment.title}
                                            </p>
                                        </div>

                                        <div className="text-sm text-gray-500">
                                            Sljedeći termin:{" "}
                                            <span className="font-medium text-gray-700">
                        {
                            treatment.nextAppointment
                        }
                      </span>
                                        </div>

                                    </div>

                                </div>
                            )
                        )}

                    </div>

                </div>

                {/* LAST VISITS */}
                <div className="rounded-3xl bg-white p-6 shadow-sm">

                    <h2 className="mb-5 text-xl font-semibold">
                        Zadnje posjete
                    </h2>

                    <div className="space-y-4">

                        {visits.map((visit, index) => (
                            <div
                                key={index}
                                className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
                            >

                                <div className="flex items-center justify-between">

                                    <div>

                                        <p className="font-medium">
                                            {visit.title}
                                        </p>

                                        <p className="mt-1 text-sm text-gray-500">
                                            {visit.date}
                                        </p>

                                    </div>

                                    <div
                                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                                            visit.status ===
                                            "Završeno"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-yellow-100 text-yellow-700"
                                        }`}
                                    >
                                        {visit.status}
                                    </div>

                                </div>

                            </div>
                        ))}

                    </div>

                </div>

                {/* TREATMENT HISTORY */}
                <div className="rounded-3xl bg-white p-6 shadow-sm">

                    <div className="mb-5 flex items-center justify-between">

                        <h2 className="text-xl font-semibold">
                            Historija tretmana
                        </h2>

                        <span className="text-sm text-gray-400">
              Raniji tretmani
            </span>

                    </div>

                    <div className="space-y-4">

                        {treatmentHistory.map(
                            (treatment, index) => (
                                <div
                                    key={index}
                                    className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
                                >

                                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                                        <div>

                                            <p className="font-medium">
                                                {treatment.title}
                                            </p>

                                            <p className="mt-1 text-sm text-gray-500">
                                                {treatment.date}
                                            </p>

                                        </div>

                                        <div className="flex flex-col items-end gap-2">

                                            <div className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                                                {treatment.status}
                                            </div>

                                            <p className="text-sm text-gray-500">
                                                {treatment.tooth}
                                            </p>

                                            <p className="font-medium text-gray-700">
                                                {treatment.price} KM
                                            </p>

                                        </div>

                                    </div>

                                </div>
                            )
                        )}

                    </div>

                </div>

                {/* ANAMNESIS */}
                <div className="rounded-3xl bg-white p-6 shadow-sm">

                    <h2 className="mb-4 text-xl font-semibold">
                        Anamneza
                    </h2>

                    <div className="grid gap-5 md:grid-cols-2">

                        <div className="rounded-2xl bg-gray-50 p-4">
                            <p className="text-sm text-gray-500">
                                Alergije
                            </p>

                            <p className="mt-1 font-medium">
                                {patient.allergiesFlag
                                    ? patient.allergiesDetails
                                    : "Nema alergija"}
                            </p>
                        </div>

                        <div className="rounded-2xl bg-gray-50 p-4">
                            <p className="text-sm text-gray-500">
                                Anestezija
                            </p>

                            <p className="mt-1 font-medium">
                                {patient.anesthesiaHistoryFlag
                                    ? patient.anesthesiaComplications
                                    : "Nije bilo komplikacija"}
                            </p>
                        </div>

                        <div className="rounded-2xl bg-gray-50 p-4">
                            <p className="text-sm text-gray-500">
                                Lijekovi
                            </p>

                            <p className="mt-1 font-medium">
                                {patient.medicationsFlag
                                    ? patient.medicationsDetails
                                    : "Ne koristi lijekove"}
                            </p>
                        </div>

                        <div className="rounded-2xl bg-gray-50 p-4">
                            <p className="text-sm text-gray-500">
                                Ranije bolesti
                            </p>

                            <p className="mt-1 font-medium">
                                {patient.previousDiseases ||
                                    "Nema evidentiranih bolesti"}
                            </p>
                        </div>

                        <div className="rounded-2xl bg-gray-50 p-4 md:col-span-2">
                            <p className="text-sm text-gray-500">
                                Sadašnja bolest
                            </p>

                            <p className="mt-1 font-medium">
                                {patient.currentDisease ||
                                    "Nema trenutnih bolesti"}
                            </p>
                        </div>

                    </div>

                </div>

                {/* NOTES */}
                <div className="rounded-3xl bg-white p-6 shadow-sm">

                    <h2 className="mb-4 text-xl font-semibold">
                        Interne napomene
                    </h2>

                    <p className="text-gray-700">
                        {patient.notes ||
                            "Nema internih napomena."}
                    </p>

                </div>

            </div>

        </div>
    );
}