"use client";

import { PatientForm } from "~/app/_components/patient/patient-form";

export default function EditPatientPage() {

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

    return (
        <div className="mx-auto max-w-2xl py-10">

            {/* BACK BUTTON */}
            <button
                onClick={() => window.history.back()}
                className="mb-6 rounded-xl bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm transition hover:bg-gray-100"
            >
                ← Nazad
            </button>

            <h1 className="mb-8 text-3xl font-semibold">
                Uredi pacijenta
            </h1>

            <PatientForm
                patient={patient}
                onSubmit={(data) => {
                    console.log(data);

                    alert("Pacijent uspješno uređen!");
                }}
            />

        </div>
    );
}