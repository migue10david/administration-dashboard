import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // 👇 Solo revisa estos directorios durante el build y `next lint`
    dirs: ['src'], 
    // Opcional: Ignora ESLint en producción (útil para builds rápidos)
    ignoreDuringBuilds: false, 
  },
  typescript: {
    ignoreBuildErrors: false, // Opcional: Falla el build si hay errores de TypeScript
  },
  // Otras configuraciones de Next.js...
  reactStrictMode: true,
};

export default nextConfig;
