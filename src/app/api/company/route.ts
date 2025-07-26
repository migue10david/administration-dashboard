import prisma from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { FilterSchema } from "@/app/lib/schemas/common";
import { CompanyWhereInput } from "@/app/lib/types/common";
import { companyFormSchema } from "@/app/lib/schemas/commonFormSchema";
import { auth } from "@/app/lib/auth-credentials/auth";

// GET /api/company  --> Obtener todas las compañias
export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, error: "No autorizado" },
      { status: 401 }
    );
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
    const where: CompanyWhereInput = {
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
    const [companies, total] = await Promise.all([
      prisma.company.findMany(query),
      prisma.company.count({ where }),
    ]);

    return pagination.page && pagination.limit
      ? NextResponse.json({
          status: 200,
          data: companies,
          meta: {
            total,
            page: pagination.page,
            limit: pagination.limit,
            totalPages: Math.ceil(total / pagination.limit),
          }
        })
      : NextResponse.json({
          status: 200,
          data: companies,
          meta: {
            total
          }
        });

  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error obteniendo compañias" },
      { status: 401 }
    );
  }
}

// POST /api/compania --> Crear una nueva compañia
export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, error: "No autorizado" },
      { status: 401 }
    );
  }

  const createdById = session.user.id;

  try {
    const body = await req.json();

    // 2. Validar con Zod
    const validatedData = companyFormSchema.parse(body);

    // 3. Crear categoría en Prisma
    const company = await prisma.company.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        createdById: createdById,
      },
    });

    return NextResponse.json({ data: company }, { status: 201 });
  } catch (error) {
    console.error("Error creando la Compañía:", error);
    return NextResponse.json(
      { error: "Error creando la Compañía" },
      { status: 500 }
    );
  }
}
