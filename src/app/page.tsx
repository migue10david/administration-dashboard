import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-emerald-500 text-white">
      {/* Botón Login con efecto "hover" curioso */}
      <Link href="/auth/login">
        <button className="relative mb-6 px-8 py-4 text-2xl font-bold text-black bg-white border-2 border-white rounded-full overflow-hidden group">
          <span className="relative z-10">Login</span>
          <span className="absolute inset-0 bg-gray-300 transform origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-300 ease-in-out"></span>
        </button>
      </Link>

      {/* Botón Register que "persigue" al mouse */}
      <Link href="/auth/register" >
        <button className="px-8 py-4 text-2xl font-bold text-black bg-yellow-400 rounded-full hover:rotate-6 hover:scale-110 transition-all duration-200 shadow-[0_0_20px_5px_rgba(255,255,0,0.3)]">
          Register
        </button>
      </Link>
    </div>
  );
}