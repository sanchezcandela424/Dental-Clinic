import { z } from "zod";

export const patientSchema = z.object({
    fullName: z
        .string()
        .min(2, "Ime i prezime mora imati najmanje 2 slova")
        .regex(
            /^[A-Za-zČĆŽŠĐčćžšđ\s]+$/,
            "Ime i prezime može sadržavati samo slova"
        ),

    email: z
        .string()
        .email("Unesite ispravnu email adresu")
        .optional()
        .or(z.literal("")),

    phone: z
        .string()
        .trim()
        .regex(
            /^\+[1-9]\d{8,14}$/,
            "Unesite validan broj telefona ")
        .optional()
        .or(z.literal("")),

    sex: z.enum(["M", "F"]).optional(),
    // PRISMA -> jmb
    jmb: z
        .string()
        .min(13, "JMB mora imati 13 cifara"),

    occupation: z.string().optional(),

    // PRISMA -> employmentStatus
    employmentStatus: z.string().optional(),

    address: z.string().optional(),
    notes:   z.string().optional(),

    dateOfBirth: z
        .string()
        .regex(
            /^\d{2}\.\d{2}\.\d{4}$/,
            "Unesite datum u formatu 01.01.2000"
        ),

    // ANAMNESIS
    allergiesFlag: z.boolean(),
    allergiesDetails: z.string().optional(),
    anesthesiaHistoryFlag: z.boolean(),
    anesthesiaComplications: z.string().optional(),
    medicationsFlag: z.boolean(),
    medicationsDetails: z.string().optional(),
    previousDiseases: z.string().optional(),
    currentDisease: z.string().optional(),

})
    .refine(
        (data) => !(data.allergiesFlag && !data.allergiesDetails?.trim()),
        { path: ["allergiesDetails"], message: "Unesite detalje alergije" }
    )
    .refine(
        (data) => !(data.medicationsFlag && !data.medicationsDetails?.trim()),
        { path: ["medicationsDetails"], message: "Unesite lijekove koje koristite" }
    );

export type PatientFormData = z.infer<typeof patientSchema>;