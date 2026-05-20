"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { api } from "~/trpc/react";

function formatDate(date: Date | string): string {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
}

function formatDateTime(date: Date | string): string {
    const d = new Date(date);
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${formatDate(d)} u ${hours}:${minutes}`;
}

const APPOINTMENT_STATUS_LABELS: Record<string, string> = {
    SCHEDULED: "Zakazano",
    WAITING: "Čekanje",
    IN_PROGRESS: "U toku",
    COMPLETED: "Završeno",
    CANCELLED: "Otkazano",
};

const TREATMENT_STATUS_LABELS: Record<string, string> = {
    PLANNED: "Planirano",
    COMPLETED: "Završeno",
    INVOICED: "Fakturisano",
};

export default function PatientProfilePage() {
    const params = useParams<{ id: string }>();
    const patientId = params.id;

    const { data: patient, isLoading, isError } = api.patients.getById.useQuery(
        { id: patientId },
        { enabled: !!patientId }
    );

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="mx-auto max-w-5xl py-20 text-center text-gray-500">
                    Učitavanje...
                </div>
            </div>
        );
    }

    if (isError || !patient) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="mx-auto max-w-5xl py-20 text-center text-red-500">
                    Pacijent nije pronađen.
                </div>
            </div>
        );
    }

    const anamnesis = patient.anamnesis;
    const now = new Date();

    const completedAppointments = patient.appointments.filter(
        (a) => a.status === "COMPLETED"
    );
    const lastVisit = completedAppointments[0];

    const nextAppointment = patient.appointments
        .filter(
            (a) =>
                new Date(a.startTime) > now && a.status !== "CANCELLED"
        )
        .sort(
            (a, b) =>
                new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        )[0];

    const activeTreatments = patient.treatments.filter(
        (t) => t.status === "PLANNED"
    );
    const treatmentHistory = patient.treatments.filter(
        (t) => t.status !== "PLANNED"
    );

    const display = (value: string | null | undefined) => value?.trim() || "—";

    return (
        <div className="min-h-screen bg-gray-50 p-6">

            <div className="mx-auto max-w-5xl space-y-6">

                <button
                    onClick={() => window.history.back()}
                    className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm transition hover:bg-gray-100"
                >
                    ← Nazad
                </button>

                <div className="rounded-3xl bg-white p-6 shadow-sm">

                    <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">

                        <div className="flex items-center gap-4">

                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-2xl font-semibold text-blue-600">
                                {patient.fullName
                                    .split(" ")
                                    .map((name) => name.charAt(0))
                                    .slice(0, 2)
                                    .join("")}
                            </div>

                            <div>

                                <h1 className="text-3xl font-semibold">
                                    {patient.fullName}
                                </h1>

                                <p className="mt-1 text-gray-500">
                                    Profil pacijenta
                                </p>

                                <div className="mt-3 inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                                    Aktivan pacijent
                                </div>

                            </div>

                        </div>

                        <Link
                            href={`/dashboard/patients/${patientId}/edit`}
                            className="rounded-xl bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
                        >
                            Uredi pacijenta
                        </Link>

                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-4">

                        <div className="rounded-2xl bg-gray-50 p-4">
                            <p className="text-sm text-gray-500">
                                Ukupno posjeta
                            </p>
                            <p className="mt-1 text-2xl font-semibold">
                                {completedAppointments.length}
                            </p>
                        </div>

                        <div className="rounded-2xl bg-gray-50 p-4">
                            <p className="text-sm text-gray-500">
                                Zadnja posjeta
                            </p>
                            <p className="mt-1 text-2xl font-semibold">
                                {lastVisit
                                    ? formatDate(lastVisit.startTime)
                                    : "—"}
                            </p>
                        </div>

                        <div className="rounded-2xl bg-gray-50 p-4">
                            <p className="text-sm text-gray-500">
                                Aktivni tretmani
                            </p>
                            <p className="mt-1 text-2xl font-semibold">
                                {activeTreatments.length}
                            </p>
                        </div>

                        <div className="rounded-2xl bg-gray-50 p-4">
                            <p className="text-sm text-gray-500">
                                Sljedeći termin
                            </p>
                            <p className="mt-1 text-lg font-semibold">
                                {nextAppointment
                                    ? formatDateTime(nextAppointment.startTime)
                                    : "—"}
                            </p>
                        </div>

                    </div>

                </div>

                <div className="rounded-3xl bg-white p-6 shadow-sm">

                    <h2 className="mb-4 text-xl font-semibold">
                        Lični podaci
                    </h2>

                    <div className="grid gap-4 md:grid-cols-3">

                        <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium">{display(patient.email)}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Telefon</p>
                            <p className="font-medium">{display(patient.phone)}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Adresa</p>
                            <p className="font-medium">{display(patient.address)}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">JMB</p>
                            <p className="font-medium">{patient.jmb}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Zanimanje</p>
                            <p className="font-medium">{display(patient.occupation)}</p>
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
                                      : display(patient.employmentStatus)}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Datum rođenja
                            </p>
                            <p className="font-medium">
                                {formatDate(patient.dateOfBirth)}
                            </p>
                        </div>

                    </div>

                </div>

                <div className="rounded-3xl bg-white p-6 shadow-sm">

                    <h2 className="mb-5 text-xl font-semibold">
                        Aktivni tretmani
                    </h2>

                    {activeTreatments.length === 0 ? (
                        <p className="text-gray-500">Nema aktivnih tretmana.</p>
                    ) : (
                        <div className="space-y-4">
                            {activeTreatments.map((treatment) => (
                                <div
                                    key={treatment.id}
                                    className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
                                >
                                    <p className="font-medium">
                                        {treatment.therapy}
                                    </p>
                                    {treatment.diagnosis && (
                                        <p className="mt-1 text-sm text-gray-500">
                                            {treatment.diagnosis}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                </div>

                <div className="rounded-3xl bg-white p-6 shadow-sm">

                    <h2 className="mb-5 text-xl font-semibold">
                        Zadnje posjete
                    </h2>

                    {patient.appointments.length === 0 ? (
                        <p className="text-gray-500">Nema evidentiranih posjeta.</p>
                    ) : (
                        <div className="space-y-4">
                            {patient.appointments.map((visit) => (
                                <div
                                    key={visit.id}
                                    className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">Pregled</p>
                                            <p className="mt-1 text-sm text-gray-500">
                                                {formatDateTime(visit.startTime)}
                                            </p>
                                        </div>
                                        <div
                                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                visit.status === "COMPLETED"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                            }`}
                                        >
                                            {APPOINTMENT_STATUS_LABELS[visit.status] ??
                                                visit.status}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                </div>

                <div className="rounded-3xl bg-white p-6 shadow-sm">

                    <div className="mb-5 flex items-center justify-between">
                        <h2 className="text-xl font-semibold">
                            Historija tretmana
                        </h2>
                        <span className="text-sm text-gray-400">
                            Raniji tretmani
                        </span>
                    </div>

                    {treatmentHistory.length === 0 ? (
                        <p className="text-gray-500">Nema historije tretmana.</p>
                    ) : (
                        <div className="space-y-4">
                            {treatmentHistory.map((treatment) => (
                                <div
                                    key={treatment.id}
                                    className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
                                >
                                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                        <div>
                                            <p className="font-medium">
                                                {treatment.therapy}
                                            </p>
                                            <p className="mt-1 text-sm text-gray-500">
                                                {formatDate(treatment.treatmentDate)}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <div className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                                                {TREATMENT_STATUS_LABELS[treatment.status] ??
                                                    treatment.status}
                                            </div>
                                            <p className="text-sm text-gray-500">
                                                {treatment.toothNumber
                                                    ? `Zub ${treatment.toothNumber}`
                                                    : "—"}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {treatment.code}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                </div>

                <div className="rounded-3xl bg-white p-6 shadow-sm">

                    <h2 className="mb-4 text-xl font-semibold">Anamneza</h2>

                    <div className="grid gap-5 md:grid-cols-2">

                        <div className="rounded-2xl bg-gray-50 p-4">
                            <p className="text-sm text-gray-500">Alergije</p>
                            <p className="mt-1 font-medium">
                                {anamnesis?.allergiesFlag
                                    ? display(anamnesis.allergiesDetails)
                                    : "Nema alergija"}
                            </p>
                        </div>

                        <div className="rounded-2xl bg-gray-50 p-4">
                            <p className="text-sm text-gray-500">Anestezija</p>
                            <p className="mt-1 font-medium">
                                {anamnesis?.anesthesiaHistoryFlag
                                    ? display(anamnesis.anesthesiaComplications)
                                    : "Nije bilo komplikacija"}
                            </p>
                        </div>

                        <div className="rounded-2xl bg-gray-50 p-4">
                            <p className="text-sm text-gray-500">Lijekovi</p>
                            <p className="mt-1 font-medium">
                                {anamnesis?.medicationsFlag
                                    ? display(anamnesis.medicationsDetails)
                                    : "Ne koristi lijekove"}
                            </p>
                        </div>

                        <div className="rounded-2xl bg-gray-50 p-4">
                            <p className="text-sm text-gray-500">
                                Ranije bolesti
                            </p>
                            <p className="mt-1 font-medium">
                                {display(anamnesis?.previousDiseases) === "—"
                                    ? "Nema evidentiranih bolesti"
                                    : display(anamnesis?.previousDiseases)}
                            </p>
                        </div>

                        <div className="rounded-2xl bg-gray-50 p-4 md:col-span-2">
                            <p className="text-sm text-gray-500">
                                Sadašnja bolest
                            </p>
                            <p className="mt-1 font-medium">
                                {display(anamnesis?.currentDisease) === "—"
                                    ? "Nema trenutnih bolesti"
                                    : display(anamnesis?.currentDisease)}
                            </p>
                        </div>

                    </div>

                </div>

                <div className="rounded-3xl bg-white p-6 shadow-sm">

                    <h2 className="mb-4 text-xl font-semibold">
                        Interne napomene
                    </h2>

                    <p className="text-gray-700">
                        {display(patient.notes) === "—"
                            ? "Nema internih napomena."
                            : patient.notes}
                    </p>

                </div>

            </div>

        </div>
    );
}
