import prisma from '@/app/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { FilterSchema, PaginationSchema } from '@/app/lib/schemas/common';
import { CompaniaWhereInput } from '@/app/lib/types/compania';
import { companiaFormSchema } from '@/app/lib/schemas/companiaFormSchema';

// GET /api/compania  --> Obtener todas las compañias
export async function GET(
  request: NextRequest
) {
  try {
    const { searchParams } = new URL(request.url!)

    const pagination = PaginationSchema.parse({
      page: parseInt(searchParams.get('page') || "1"),
      limit: parseInt(searchParams.get('limit') || "10")
    });

    const filters = FilterSchema.parse({
      search: searchParams.get('search') || undefined
    })

    const where: CompaniaWhereInput = {}

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
    const [companias, total] = await Promise.all([
      prisma.compania.findMany(query),
      prisma.compania.count({ where })
    ])    

    return NextResponse.json({
      status: 200,
      data: companias,
      meta: {
        total,
        page:pagination.page,
        llimit:pagination.limit,
        totalPages: Math.ceil(total / pagination.limit),
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Error obteniendo compañias' }, { status: 401 })
  }
}

// POST /api/compania --> Crear una nueva compañia
export async function POST(req: Request) {
  try {

    const body = await req.json();

    // 2. Validar con Zod
    const validatedData = companiaFormSchema.parse(body);

    // 3. Crear categoría en Prisma
    const compania = await prisma.compania.create({
      data: {
        name:validatedData.name,
        direccion: validatedData.direccion,
        telefono: validatedData.telefono,
        comentarios: validatedData.comentarios
      }      
    });

    return NextResponse.json(
      { data: compania },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creando el cliente:', error)
    return NextResponse.json(
      { error: 'Error creando el cliente' },
      { status: 500 }
    )
  }
}