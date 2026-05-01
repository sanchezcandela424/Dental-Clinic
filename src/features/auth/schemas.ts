import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Unesite ispravnu email adresu"),
  password: z.string().min(6, "Lozinka mora imati najmanje 6 znakova"),
});

export type LoginFormData = z.infer<typeof loginSchema>;


export const registerSchema = z
  .object({
    name: z.string().min(2, "Ime mora imati najmanje 2 znaka"),
    email: z.string().email("Unesite ispravnu email adresu"),
    password: z.string().min(6, "Lozinka mora imati najmanje 6 znakova"),
    confirmPassword: z.string().min(6, "Potvrdite lozinku"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Lozinke se ne poklapaju",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;