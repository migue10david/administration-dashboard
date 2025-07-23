import prisma from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { FilterSchema, PaginationSchema } from "@/app/lib/schemas/common";
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

    const pagination = PaginationSchema.parse({
      page: parseInt(searchParams.get("page") || "1"),
      limit: parseInt(searchParams.get("limit") || "10"),
    });

    const filters = FilterSchema.parse({
      search: searchParams.get("search") || undefined,
    });

    const where: StateWhereInput = {
      AND: [ ...(isAdmin === "ADMIN" ? [] : [{ isActive: true }])],
    };

    // Filtro por texto (búsqueda)
    if (filters.search) {
      where.OR = [
        {
          name: {
            contains: filters.search as string,
            mode: "insensitive",
          },
          code: {
            contains: filters.search as string,
            mode: "insensitive",
          },
          countryId: {
            contains: filters.search as string,
            mode: "insensitive",
          },
        }
      ];
    }

    // Consulta base
    const query = {
      where,
      skip: (pagination.page - 1) * pagination.limit,
      take: pagination.limit,
    };

    // Ejecutar consulta
    const [state, total] = await Promise.all([
      prisma.state.findMany(query),
      prisma.state.count({ where }),
    ]);

    return NextResponse.json({
      status: 200,
      data: state,
      meta: {
        total,
        page: pagination.page,
        llimit: pagination.limit,
        totalPages: Math.ceil(total / pagination.limit),
      },
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
