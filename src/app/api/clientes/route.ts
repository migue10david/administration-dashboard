import { prisma } from '@/app/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { ClientlFilterSchema, PaginationSchema } from '@/app/lib/schemas/common';
import { ClientWhereInput } from '@/app/lib/types/client';
import { writeFile, mkdir } from 'fs/promises'

async function ensureUploadsDirExists() {
  try {
    await mkdir(UPLOADS_DIR, { recursive: true })
  } catch (error) {
    console.error('Error creating uploads directory:', error)
  }
}

// GET /api/clientes
export async function GET(
  request: NextRequest
) {
  try {
    const { searchParams } = new URL(request.url!)

    const pagination = PaginationSchema.parse({
      page: parseInt(searchParams.get('page') || "1"),
      limit: parseInt(searchParams.get('limit') || "10")
    });

    const filters = ClientlFilterSchema.parse({
      search: searchParams.get('search') || undefined
    })

    const where: ClientWhereInput = {}

    // Filtro por texto (búsqueda)
    if (filters.search) {
      where.OR = [
        {
          nombre: {
            contains: filters.search as string,
            mode: 'insensitive',
          },
        },
        {
          direccion: {
            contains: filters.search as string,
            mode: 'insensitive',
          },
        },
        {
          telefono: {
            contains: filters.search as string,
            mode: 'insensitive',
          },
        },
      ];
    }

    // Consulta base
    const query = {
      where,
      include: { 
        cheques: true
      },
      skip: (pagination.page - 1) * pagination.limit,
      take: pagination.limit
    }

    // Ejecutar consulta
    const [clients, total] = await Promise.all([
      prisma.cliente.findMany(query),
      prisma.cliente.count({ where })
    ])    

    return NextResponse.json({
      status: 200,
      data: clients,
      meta: {
        total,
        page:pagination.page,
        llimit:pagination.limit,
        totalPages: Math.ceil(total / pagination.limit),
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Error obteniendo clientes' }, { status: 401 })
  }
}

// POST /api/clientes
export async function POST(req: NextRequest) {
  const clonedRequest = req.clone();
  let formData: FormData;


  try {
    const body = await req.json()
    const { nombre, direccion, telefono, nacionalidad } = body

    const cliente = await prisma.cliente.create({
      data: {
        nombre,
        direccion,
        telefono,
        nacionalidad,
      },
    })

    return NextResponse.json(cliente, { status: 201 })
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Error creating cliente' }, { status: 500 })
  }
}

