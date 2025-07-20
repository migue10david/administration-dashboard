// middleware.ts - Versión corregida
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const token = request.cookies.get('authjs.session-token')?.value

  // Excluir archivos estáticos y rutas de API
  if (pathname.startsWith('/_next') || pathname.includes('.') || pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  // Si está autenticado y trata de acceder a login/register
  console.log("token", token)
  if (token && (pathname.startsWith('/auth/login'))) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Si no está autenticado y trata de acceder a rutas protegidas
  if (!token && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  return NextResponse.next()
}