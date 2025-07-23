import prisma from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { FilterSchema, PaginationSchema } from "@/app/lib/schemas/common";
import { auth } from "@/app/lib/auth-credentials/auth";
import { CityWhereInput } from "@/app/lib/types/common";
import { cityFormSchema } from "@/app/lib/schemas/commonFormSchema";

// GET /api/city  --> Obtener todos las ciudades
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

    const where: CityWhereInput = {
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
          stateId: {
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
    const [city, total] = await Promise.all([
      prisma.city.findMany(query),
      prisma.city.count({ where }),
    ]);

    return NextResponse.json({
      status: 200,
      data: city,
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
      { error: "Error obteniendo ciudades" },
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
    const validatedData = cityFormSchema.parse(body);

    // 3. Crear categoría en Prisma
    const city = await prisma.city.create({
      data: {
        name: validatedData.name,
        code: validatedData.code,
        stateId: validatedData.stateid,
        createdById: createdById,
      },
    });

    return NextResponse.json({ data: city }, { status: 201 });
  } catch (error) {
    console.error("Error creando la Ciudad:", error);
    return NextResponse.json(
      { error: "Error creando La Ciudad" },
      { status: 500 }
    );
  }
}
