// middleware.ts - Versión corregida
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const token = request.cookies.get('authjs.session-token')?.value
  
  // 1. Configuración CORS para peticiones API
/*   if (pathname.startsWith('/api')) {
    const response = token 
      ? NextResponse.next() 
      : NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    // Headers CORS esenciales
    response.headers.set('Access-Control-Allow-Origin', request.headers.get('origin') || '*')
    response.headers.set('Access-Control-Allow-Credentials', 'true')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie')

    // Manejar petición OPTIONS (preflight)
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { 
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': request.headers.get('origin') || '*',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, Cookie',
          'Vary': 'Origin'
        }
      })
    }

    // Protección de rutas API
    if (!token && !pathname.startsWith('/api')) {
      return NextResponse.json(
        { error: 'Autenticación requerida' },
        { 
          status: 401,
          headers: {
            'Access-Control-Allow-Origin': request.headers.get('origin') || '*',
            'Access-Control-Allow-Credentials': 'true',
            'Content-Type': 'application/json'
          }
        }
      )
    }

    return response    

  }    
 */
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