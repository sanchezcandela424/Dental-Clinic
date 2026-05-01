"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type RegisterFormData,
  registerSchema,
} from "~/features/auth/schemas";

export function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
    setLoading(true);

    console.log(data);

    setTimeout(() => {
      router.push("/login");
    }, 1000);
  };

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4 py-10 flex justify-center overflow-y-auto">
      <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-2xl border border-gray-100">

        {/* HEADER */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold text-blue-600">
            City Dent
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Stomatološka ordinacija
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-5"
        >

          {/* NAME */}
          <div>
            <label className="text-sm text-gray-600">Ime i prezime</label>
            <input
              type="text"
              {...register("name")}
              className={`mt-1 w-full rounded-xl border p-3 focus:outline-none focus:ring-2 transition
                ${errors.name ? "border-red-400 focus:ring-red-400" : "border-gray-200 focus:ring-blue-400"}`}
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-sm text-gray-600">Email adresa</label>
            <input
              type="email"
              {...register("email")}
              className={`mt-1 w-full rounded-xl border p-3 focus:outline-none focus:ring-2 transition
                ${errors.email ? "border-red-400 focus:ring-red-400" : "border-gray-200 focus:ring-blue-400"}`}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm text-gray-600">Lozinka</label>
            <input
              type="password"
              {...register("password")}
              className={`mt-1 w-full rounded-xl border p-3 focus:outline-none focus:ring-2 transition
                ${errors.password ? "border-red-400 focus:ring-red-400" : "border-gray-200 focus:ring-blue-400"}`}
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <label className="text-sm text-gray-600">Potvrdite lozinku</label>
            <input
              type="password"
              {...register("confirmPassword")}
              className={`mt-1 w-full rounded-xl border p-3 focus:outline-none focus:ring-2 transition
                ${errors.confirmPassword ? "border-red-400 focus:ring-red-400" : "border-gray-200 focus:ring-blue-400"}`}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500 mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className={`mt-2 rounded-xl p-3 text-white font-medium transition
              ${loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {loading ? "Kreiranje računa..." : "Registracija"}
          </button>

        </form>

        {/* FOOTER */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Već imate račun?{" "}
          <Link
            href="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Prijavite se
          </Link>
        </p>

      </div>
    </div>
  );
}