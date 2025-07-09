"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { loginSchema } from "@/app/lib/schemas/auth";

type FormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    const validatedFields = loginSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: "Campos inválidos field" };
    }

    console.log(values);

    startTransition(async () => {
      await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      }).then((callback) => {
        console.log(callback);

        if (callback?.error) {
          setError("Error en las credenciales");
        }

        if (callback?.ok && !callback?.error) {
          setSuccess("Login in successfully");
          router.push("/dashboard");
        }
      });
    });
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <section>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <h1 className="text-2xl font-bold text-center text-gray-800">Inicia Sesión</h1>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Correo Electrónico
              </label>
              <input
                id="email"
                type="email"
                {...register('email')}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                {...register('password')}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Success / Error Messages */}
            <div>
              {/* Ejemplo dinámico */}
              {error && <p className="text-sm text-red-600">{error}</p>}
              {success && <p className="text-sm text-green-600">{success}</p>}
            </div>

            {/* Submit Button */}
            <button
              disabled={isPending}
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              Iniciar Sesión
            </button>

            {/* Register Link */}
            <div className="text-center">
              <span className="text-sm text-gray-600">¿No tienes cuenta? </span>
              <Link href="/auth/register" className="text-sm font-medium text-blue-600 hover:underline">
                Regístrate
              </Link>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}