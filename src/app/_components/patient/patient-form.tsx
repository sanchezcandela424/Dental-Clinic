"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import {
    patientSchema,
    type PatientFormData,
} from "~/lib/validators/patient";

type PatientFormProps = {
    patient?: PatientFormData;
    onSubmit: (data: PatientFormData) => void;
    isLoading?: boolean;
};

export function PatientForm({
                                patient,
                                onSubmit,
                                isLoading,
                            }: PatientFormProps) {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors },
     } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    mode: "onChange",
        reValidateMode: "onChange",
    defaultValues: patient ?? {
            fullName: "",
            email: "",
            phone: "",

            jmb: "",
            occupation: "",
            employmentStatus: "",

            address: "",

            allergiesFlag: false,
            allergiesDetails: "",

            anesthesiaHistoryFlag: false,
            anesthesiaComplications: "",

            medicationsFlag: false,
            medicationsDetails: "",

            previousDiseases: "",
            currentDisease: "",

            dateOfBirth: "",
            notes:"",
        },
    });
    useEffect(() => {
        reset(
            patient ?? {
                fullName: "",
                email: "",
                phone: "",

                jmb: "",
                occupation: "",
                employmentStatus: "",

                address: "",

                allergiesFlag: false,
                allergiesDetails: "",

                anesthesiaHistoryFlag: false,
                anesthesiaComplications: "",

                medicationsFlag: false,
                medicationsDetails: "",

                previousDiseases: "",
                currentDisease: "",

                dateOfBirth: "",

                notes: "",
            }
        );
    }, [patient, reset]);

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
        >

            {/* FULL NAME */}
            <div>
                <label className="text-sm text-gray-600">
                    Ime i prezime
                </label>

                <input
                    {...register("fullName")}
                    className={`mt-1 w-full rounded-xl border bg-white p-3 outline-none transition focus:ring-2 focus:ring-blue-400
        ${
                        errors.fullName
                            ? "border-red-400"
                            : "border-gray-200"
                    }`}
                />

                {errors.fullName && (
                    <p className="mt-1 text-sm text-red-500">
                        {errors.fullName.message}
                    </p>
                )}
            </div>

            {/* EMAIL */}
            <div>
                <label className="text-sm text-gray-600">
                    Email
                </label>

                <input
                    type="email"
                    {...register("email")}
                    className={`mt-1 w-full rounded-xl border bg-white p-3 outline-none transition focus:ring-2 focus:ring-blue-400
          ${
                        errors.email
                            ? "border-red-400"
                            : "border-gray-200"
                    }`}
                />

                {errors.email && (
                    <p className="mt-1 text-sm text-red-500">
                        {errors.email.message}
                    </p>
                )}
            </div>

            {/* PHONE */}
            <div>
                <label className="text-sm text-gray-600">
                    Telefon
                </label>

                <input
                    {...register("phone")}
                    placeholder="+38761123456"
                    className={`mt-1 w-full rounded-xl border bg-white p-3 outline-none transition focus:ring-2 focus:ring-blue-400
          ${
                        errors.phone
                            ? "border-red-400"
                            : "border-gray-200"
                    }`}
                />

                {errors.phone && (
                    <p className="mt-1 text-sm text-red-500">
                        {errors.phone.message}
                    </p>
                )}
            </div>

            {/* JMB */}
            <div>
                <label className="text-sm text-gray-600">
                    JMB
                </label>

                <input
                    {...register("jmb")}
                    className={`mt-1 w-full rounded-xl border bg-white p-3 outline-none transition focus:ring-2 focus:ring-blue-400
          ${
                        errors.jmb
                            ? "border-red-400"
                            : "border-gray-200"
                    }`}
                />

                {errors.jmb && (
                    <p className="mt-1 text-sm text-red-500">
                        {errors.jmb.message}
                    </p>
                )}
            </div>

            {/* OCCUPATION */}
            <div>
                <label className="text-sm text-gray-600">
                    Zanimanje
                </label>

                <input
                    {...register("occupation")}
                    className="mt-1 w-full rounded-xl border border-gray-200 bg-white p-3 outline-none transition focus:ring-2 focus:ring-blue-400"
                />
            </div>

            {/* EMPLOYMENT STATUS */}
            <div className="space-y-3">

                <label className="text-sm text-gray-600">
                    Status zaposlenja
                </label>

                <div className="flex flex-wrap gap-6 rounded-2xl border border-gray-200 bg-white p-4">

                    <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input
                            type="radio"
                            value="Zaposlen/a"
                            {...register("employmentStatus")}
                        />
                        Zaposlen/a
                    </label>

                    <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input
                            type="radio"
                            value="Nezaposlen/a"
                            {...register("employmentStatus")}
                        />
                        Nezaposlen/a
                    </label>

                    <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input
                            type="radio"
                            value="Student"
                            {...register("employmentStatus")}
                        />
                        Student
                    </label>

                    <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input
                            type="radio"
                            value="Penzioner"
                            {...register("employmentStatus")}
                        />
                        Penzioner
                    </label>

                </div>

            </div>

            {/* ADDRESS */}
            <div>
                <label className="text-sm text-gray-600">
                    Adresa
                </label>

                <input
                    {...register("address")}
                    className="mt-1 w-full rounded-xl border border-gray-200 bg-white p-3 outline-none transition focus:ring-2 focus:ring-blue-400"
                />
            </div>

            {/* DATE OF BIRTH */}
            <div>
                <label className="text-sm text-gray-600">
                    Datum rođenja
                </label>

                <input
                    type="text"
                    placeholder="dd.mm.gggg"
                    {...register("dateOfBirth")}
                    className="mt-1 w-full rounded-xl border border-gray-200 bg-white p-3 outline-none transition focus:ring-2 focus:ring-blue-400"
                />
            </div>

            {/* ANAMNEZA */}
            <div className="space-y-6 rounded-3xl bg-white p-6 shadow-sm">

                <h2 className="text-xl font-semibold">
                    Anamneza
                </h2>

                {/* ALLERGIES */}
                <div className="space-y-3">

                    <label className="text-sm font-medium text-gray-700">
                        Da li ste alergični?
                    </label>

                    <div className="flex items-center gap-6">

                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                checked={watch("allergiesFlag") === true}
                                onChange={() =>
                                    setValue("allergiesFlag", true, {
                                        shouldValidate: true,
                                    })
                                }
                            />
                            Da
                        </label>

                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                checked={watch("allergiesFlag") === false}
                                onChange={() =>
                                    setValue("allergiesFlag", false, {
                                        shouldValidate: true,
                                    })
                                }
                            />
                            Ne
                        </label>

                    </div>

                    {watch("allergiesFlag") && (
                        <>
                            <input
                                {...register("allergiesDetails")}
                                placeholder="Na šta ste alergični?"
                                className="w-full rounded-xl border border-gray-200 bg-white p-3 outline-none focus:ring-2 focus:ring-blue-400"
                            />

                            {errors.allergiesDetails && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.allergiesDetails.message}
                                </p>
                            )}
                        </>
                    )}



                </div>

                {/* ANESTHESIA */}
                <div className="space-y-3">

                    <label className="text-sm font-medium text-gray-700">
                        Da li ste ranije primali anesteziju?
                    </label>

                    <div className="flex items-center gap-6">

                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                checked={watch("anesthesiaHistoryFlag") === true}
                                onChange={() =>
                                    setValue(
                                        "anesthesiaHistoryFlag",
                                        true
                                    )
                                }
                            />
                            Da
                        </label>

                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                checked={watch("anesthesiaHistoryFlag") === false}
                                onChange={() =>
                                    setValue(
                                        "anesthesiaHistoryFlag",
                                        false
                                    )
                                }
                            />
                            Ne
                        </label>

                    </div>

                    {watch("anesthesiaHistoryFlag") && (
                        <input
                            {...register(
                                "anesthesiaComplications"
                            )}
                            placeholder="Da li je bilo problema?"
                            className="w-full rounded-xl border border-gray-200 bg-white p-3 outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    )}

                </div>

                {/* MEDICATION */}
                <div className="space-y-3">

                    <label className="text-sm font-medium text-gray-700">
                        Pijete li neke lijekove?
                    </label>

                    <div className="flex items-center gap-6">

                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                checked={watch("medicationsFlag") === true}
                                onChange={() =>
                                    setValue("medicationsFlag", true, {
                                        shouldValidate: true,
                                    })
                                }
                            />
                            Da
                        </label>

                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                checked={watch("medicationsFlag") === false}
                                onChange={() =>
                                    setValue("medicationsFlag", false, {
                                        shouldValidate: true,
                                    })
                                }
                            />
                            Ne
                        </label>

                    </div>

                    {watch("medicationsFlag") && (
                        <>
                            <input
                                {...register("medicationsDetails")}
                                placeholder="Koje lijekove pijete?"
                                className="w-full rounded-xl border border-gray-200 bg-white p-3 outline-none focus:ring-2 focus:ring-blue-400"
                            />

                            {errors.medicationsDetails && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.medicationsDetails.message}
                                </p>
                            )}
                        </>
                    )}

                </div>

                {/* PREVIOUS DISEASES */}
                <div>
                    <label className="text-sm text-gray-600">
                        Ranije bolesti
                    </label>

                    <textarea
                        {...register("previousDiseases")}
                        rows={3}
                        className="mt-1 w-full rounded-xl border border-gray-200 bg-white p-3 outline-none transition focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                {/* CURRENT DISEASE */}
                <div>
                    <label className="text-sm text-gray-600">
                        Sadašnja bolest
                    </label>

                    <textarea
                        {...register("currentDisease")}
                        rows={3}
                        className="mt-1 w-full rounded-xl border border-gray-200 bg-white p-3 outline-none transition focus:ring-2 focus:ring-blue-400"
                    />
                </div>

            </div>
            {/* NOTES */}
            <div>
                <label className="text-sm text-gray-600">
                    Interne napomene
                </label>

                <textarea
                    {...register("notes")}
                    rows={4}
                    placeholder="Dodajte interne napomene..."
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-white p-3 outline-none transition focus:ring-2 focus:ring-blue-400"
                />
            </div>
            {/* BUTTON */}
            <button
                type="submit"
                disabled={isLoading}
                className={`w-full rounded-xl px-4 py-3 font-medium text-white transition
        ${
                    isLoading
                        ? "cursor-not-allowed bg-blue-300"
                        : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
                {isLoading
                    ? "Spremanje..."
                    : patient
                        ? "Sačuvaj izmjene"
                        : "Kreiraj pacijenta"}
            </button>

        </form>
    );
}