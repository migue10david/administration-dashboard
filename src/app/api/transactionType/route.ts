import prisma from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { FilterSchema } from "@/app/lib/schemas/common";
import { auth } from "@/app/lib/auth-credentials/auth";
import { CheckTransactionTypeWhereInput } from "@/app/lib/types/common";
import { checkTransactionTypeFormSchema } from "@/app/lib/schemas/commonFormSchema";

// GET /api/checkTransaction  --> Obtener todas los tipos de Transacciones
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
    const where: CheckTransactionTypeWhereInput = {
      AND: [
        ...(isAdmin === "ADMIN" ? [] : [{ isActive: true }])
      ],
      ...(filters.search && {
        OR: [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } },
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
    const [checkTransactionType, total] = await Promise.all([
      prisma.checkTransactionType.findMany(query),
      prisma.checkTransactionType.count({ where }),
    ]);

    return pagination.page && pagination.limit
      ? NextResponse.json({
          status: 200,
          data: checkTransactionType,
          meta: {
            total,
            page: pagination.page,
            limit: pagination.limit,
            totalPages: Math.ceil(total / pagination.limit),
          }
        })
      : NextResponse.json({
          status: 200,
          data: checkTransactionType,
          meta: {
            total
          }
        });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error obteniendo los tipos de trnsacciones" },
      { status: 401 }
    );
  }
}

// POST /api/checkTransaction --> Crear un nuevo tipo de transaccion
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
    const validatedData = checkTransactionTypeFormSchema.parse(body);

    // 3. Crear categoría en Prisma
    const checkTransactionType = await prisma.checkTransactionType.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        createdById: createdById,
      },
    });

    return NextResponse.json({ data: checkTransactionType }, { status: 201 });
  } catch (error) {
    console.error("Error creando el tipo de transaccion:", error);
    return NextResponse.json(
      { error: "Error creando el tipo de transaccion" },
      { status: 500 }
    );
  }
}
