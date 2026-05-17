"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { PatientForm } from "~/app/_components/patient/patient-form";
import type { PatientFormData } from "~/lib/validators/patient";

export default function CreatePatientPage() {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);

    const handleCreatePatient = async (
        data: PatientFormData
    ) => {
        try {
            setIsLoading(true);

            console.log("CREATE PATIENT:", data);

            alert("Pacijent uspješno kreiran!");

            await new Promise((resolve) =>
                setTimeout(resolve, 1000)
            );

            router.push("/dashboard/patients");
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-2xl py-10">
            <button
                onClick={() => window.history.back()}
                className="mb-6 rounded-xl bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm transition hover:bg-gray-100"
            >
                ← Nazad
            </button>
            <h1 className="mb-8 text-3xl font-semibold">
                Kreiraj pacijenta
            </h1>

            <PatientForm
                onSubmit={handleCreatePatient}
                isLoading={isLoading}
            />
        </div>
    );
}