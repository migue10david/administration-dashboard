// middleware.ts - Versión corregida
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const token = request.cookies.get('authjs.session-token')?.value

  // Excluir rutas estáticas y APIs
  if (pathname.startsWith('/_next') || 
      pathname.includes('.') || 
      pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  // Manejo de rutas API
  if (pathname.startsWith('/api')) {
    if (!token) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }
    return NextResponse.next()
  }

  // Redirecciones para rutas de aplicación
  if (token && pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (!token && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  return NextResponse.next()
}