import prisma from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { FilterSchema, PaginationSchema } from "@/app/lib/schemas/common";
import { auth } from "@/app/lib/auth-credentials/auth";
import { CountryWhereInput } from "@/app/lib/types/common";
import { countryFormSchema } from "@/app/lib/schemas/commonFormSchema";

// GET /api/country  --> Obtener todos los paises
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

    const where: CountryWhereInput = {
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
    const [country, total] = await Promise.all([
      prisma.country.findMany(query),
      prisma.country.count({ where }),
    ]);

    return NextResponse.json({
      status: 200,
      data: country,
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
      { error: "Error obteniendo compañias" },
      { status: 401 }
    );
  }
}

// POST /api/country --> Crear un nuevo pais
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
    const validatedData = countryFormSchema.parse(body);

    // 3. Crear categoría en Prisma
    const country = await prisma.country.create({
      data: {
        name: validatedData.name,
        code: validatedData.code,
        createdById: createdById,
      },
    });

    return NextResponse.json({ data: country }, { status: 201 });
  } catch (error) {
    console.error("Error creando el País:", error);
    return NextResponse.json(
      { error: "Error creando el País" },
      { status: 500 }
    );
  }
}
