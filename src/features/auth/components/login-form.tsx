"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type LoginFormData, loginSchema } from "~/features/auth/schemas";


export function LoginForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    if (loading) return;

    setLoading(true);
    setServerError("");

    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (!result || result.error) {
      setServerError("Neispravan email ili lozinka");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4">
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

          {/* EMAIL */}
          <div>
            <label className="text-sm text-gray-600">Email adresa</label>
            <input
              type="email"
              {...register("email", {
                onChange: () => setServerError(""),
              })}
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
              {...register("password", {
                onChange: () => setServerError(""),
              })}
              className={`mt-1 w-full rounded-xl border p-3 focus:outline-none focus:ring-2 transition
                ${errors.password ? "border-red-400 focus:ring-red-400" : "border-gray-200 focus:ring-blue-400"}`}
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* SERVER ERROR */}
          {serverError && (
            <p className="text-sm text-red-500 bg-red-50 p-3 rounded-xl">
              {serverError}
            </p>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className={`mt-2 rounded-xl p-3 text-white font-medium transition
              ${loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {loading ? "Prijavljivanje..." : "Prijava"}
          </button>

        </form>

        {/* FOOTER */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Nemate račun?{" "}
          <Link
            href="/register"
            className="text-blue-600 font-medium hover:underline"
          >
            Registrujte se
          </Link>
        </p>

      </div>
    </div>
  );
}