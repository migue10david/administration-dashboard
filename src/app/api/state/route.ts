import prisma from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { FilterSchema } from "@/app/lib/schemas/common";
import { auth } from "@/app/lib/auth-credentials/auth";
import { StateWhereInput } from "@/app/lib/types/common";
import { stateFormSchema } from "@/app/lib/schemas/commonFormSchema";

// GET /api/state  --> Obtener todos los estados
export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
    )    
  }

  const isAdmin = session.user.role;

  try {
    const { searchParams } = new URL(request.url!);

    // Paginación opcional
    const pageParam = searchParams.get('page');
    const limitParam = searchParams.get('limit');
    
    const pagination = {
      page: pageParam ? parseInt(pageParam) : undefined,
      limit: limitParam ? parseInt(limitParam) : undefined
    };

    const filters = FilterSchema.parse({
      search: searchParams.get("search") || undefined,
    });

    // Construcción del WHERE
    const where: StateWhereInput = {
      AND: [
        ...(isAdmin === "ADMIN" ? [] : [{ isActive: true }])
      ],
      ...(filters.search && {
        OR: [
          { code: { contains: filters.search, mode: 'insensitive' } },
          { name: { contains: filters.search, mode: 'insensitive' } },
          { countryId: { contains: filters.search, mode: 'insensitive' } }
        ]
      })
    };

    // Consulta base
    const baseQuery = { where };

    // Añadir paginación solo si vienen ambos parámetros
    const query = pagination.page && pagination.limit
      ? {
          ...baseQuery,
          skip: (pagination.page - 1) * pagination.limit,
          take: pagination.limit
        }
      : baseQuery;

    // Ejecutar consulta
    const [state, total] = await Promise.all([
      prisma.state.findMany(query),
      prisma.state.count({ where }),
    ]);

    // Respuesta condicional
    return pagination.page && pagination.limit
      ? NextResponse.json({
          status: 200,
          data: state,
          meta: {
            total,
            page: pagination.page,
            limit: pagination.limit,
            totalPages: Math.ceil(total / pagination.limit),
          }
        })
      : NextResponse.json({
          status: 200,
          data: state,
          meta: {
            total
          }
        });

  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error obteniendo estados" },
      { status: 401 }
    );
  }
}

// POST /api/state --> Crear un nuevo estado
export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
    )    
  }

  const createdById = session.user.id;

  try {
    const body = await req.json();

    // 2. Validar con Zod
    const validatedData = stateFormSchema.parse(body);

    // 3. Crear categoría en Prisma
    const state = await prisma.state.create({
      data: {
        name: validatedData.name,
        code: validatedData.code,
        countryId: validatedData.countryId,
        createdById: createdById,
      },
    });

    return NextResponse.json({ data: state }, { status: 201 });
  } catch (error) {
    console.error("Error creando el Estado:", error);
    return NextResponse.json(
      { error: "Error creando el Estado" },
      { status: 500 }
    );
  }
}
