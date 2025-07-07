"use client";

import Link from "next/link";

import { useForm } from "react-hook-form";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";

import { signIn } from "next-auth/react";
import { registroSchema } from "@/app/lib/schemas/auth";
import { registerActions } from "@/app/lib/actions/registerActions";

type FormData = z.infer<typeof registroSchema>;

export default function RegisterPage() {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(registroSchema),

    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const onSubmit = (values: z.infer<typeof registroSchema>) => {
    console.log(values);

    setError("");
    setSuccess("");

    startTransition(() => {
      registerActions(values).then((data) => {
        setError(data.error);
        setSuccess(data.success);
      });
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <h1 className="text-2xl font-bold text-center text-gray-800">Regístrate</h1>

          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              id="name"
              type="text"
              {...register('name')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

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

          {/* Error / Success Messages */}
          <div>
            {/* Ejemplo dinámico */}
            <p className="text-sm text-red-600">{error}</p>
            <p className="text-sm text-green-600">{success}</p>
          </div>

          {/* Submit Button */}
          <button
            disabled={isPending}
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            Registrarse
          </button>

          {/* Login Link */}
          <div className="text-center">
            <span className="text-sm text-gray-600">¿Ya tienes cuenta? </span>
            <Link href="/auth/login" className="text-sm font-medium text-blue-600 hover:underline">
              Iniciar Sesión
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}