import { prisma } from '@/app/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { FilterSchema, PaginationSchema } from '@/app/lib/schemas/common';
import { ChequeWhereInput } from '@/app/lib/types/cheque';
import { CreateChequeSchema } from '@/app/lib/schemas/chequeFormSchema';
import { EstadoCheque } from '@/app/lib/schemas/chequeFormSchema';

// GET /api/cheque  --> Obtener todos los cheques
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

    const where: ChequeWhereInput = {}

    // Filtro por texto (búsqueda)
    if (filters.search) {
      where.OR = [
        {
          clienteId: {
            contains: filters.search as string,
            mode: 'insensitive',
          },
        },
        {
          companiaId: {
            contains: filters.search as string,
            mode: 'insensitive',
          },
        }
      ];
    }

    // Consulta base
    const query = {
      where,
      skip: (pagination.page - 1) * pagination.limit,
      take: pagination.limit
    }

    // Ejecutar consulta
    const [cheques, total] = await Promise.all([
      prisma.cheque.findMany(query),
      prisma.cheque.count({ where })
    ])    

    return NextResponse.json({
      status: 200,
      data: cheques,
      meta: {
        total,
        page:pagination.page,
        llimit:pagination.limit,
        totalPages: Math.ceil(total / pagination.limit),
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Error obteniendo cheques' }, { status: 401 })
  }
}

// POST /api/cheque --> Crear un nuevo cheque
export async function POST(req: Request) {
  try {

    const body = await req.json();

    // 2. Validar con Zod
    const validatedData = CreateChequeSchema.parse(body);

    // 3. Crear cheques en Prisma
    const cheque = await prisma.cheque.create({
      data: {
        ...validatedData,
        estado: validatedData.estado as EstadoCheque
      }      
    });

    return NextResponse.json(
      { data: cheque },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creando el cheque:', error)
    return NextResponse.json(
      { error: 'Error creando el cheque' },
      { status: 500 }
    )
  }
}