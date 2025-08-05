import prisma from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { FilterSchema, PaginationSchema } from "@/app/lib/schemas/common";
import { CheckTransactionFormSchema } from "@/app/lib/schemas/commonFormSchema";
import { auth } from "@/app/lib/auth-credentials/auth";
import { Prisma } from '@prisma/client';

// GET /api/checkTransaction  --> Obtener todas las transacciones de cheques
export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, error: "No autorizado" },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url!);

    const pagination = PaginationSchema.parse({
      page: parseInt(searchParams.get("page") || "1"),
      limit: parseInt(searchParams.get("limit") || "10"),
    });

    const filters = FilterSchema.parse({
      search: searchParams.get("search") || undefined,
    });

    const where: Prisma.CheckTransactionWhereInput = {
      isActive: true,
      OR: filters.search ? [] : undefined
    };    

    if (filters.search) {
      const searchTerm = filters.search;
      const numericValue = parseFloat(searchTerm);
      const isNumeric = !isNaN(numericValue);

      where.OR = [
        { number: { contains: searchTerm, mode: "insensitive" } },
        { customerId: { contains: searchTerm, mode: "insensitive" } },
        ...(isNumeric ? [{ amount: numericValue }] : []),
        {
          customer: {
            OR: [
              { firstName: { contains: searchTerm, mode: "insensitive" } },
              { middleName: { contains: searchTerm, mode: "insensitive" } },
              { lastNameOne: { contains: searchTerm, mode: "insensitive" } },
              { lastNameTwo: { contains: searchTerm, mode: "insensitive" } },             
            ]
          }
        }
      ];
    }

    // Consulta con tipado explícito
    const query: Prisma.CheckTransactionFindManyArgs = {
      where,
      skip: (pagination.page - 1) * pagination.limit,
      take: pagination.limit,
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            middleName: true,
            lastNameOne: true,
            lastNameTwo: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    };

    const [checks, total] = await Promise.all([
      prisma.checkTransaction.findMany(query),
      prisma.checkTransaction.count({ where }),
    ]);

    // Serializar fechas a ISO string para consistencia
    const serializedChecks = checks.map(check => ({
      ...check,
      createdAt: check.createdAt.toISOString(),
      updatedAt: check.updatedAt.toISOString(),
    }));

    return NextResponse.json({
      status: 200,
      success: true,
      data: serializedChecks,
      meta: {
        total,
        page: pagination.page,
        limit: pagination.limit,
        totalPages: Math.ceil(total / pagination.limit),
        // Incluir timestamp de generación para debugging
        generatedAt: new Date().toISOString()
      },
    });
  } catch (error) {
    console.error('Error en GET /api/check-transactions:', error);
    return NextResponse.json(
      { 
        success: false,
        error: "Error obteniendo transacciones",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}


// POST /api/checkTransaction --> Crear un nuevo pago por cheque
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
    const validatedData = CheckTransactionFormSchema.parse(body);

    // 3. Crear categoría en Prisma
    const check = await prisma.checkTransaction.create({
      data: {
        customerId: validatedData.customerId,
        checkTransactionTypeId: validatedData.checkTransactionTypeId,
        number: validatedData.number,
        amount: validatedData.amount,
        feed: validatedData.feed,
        createdById: createdById,
      },
    });

    return NextResponse.json({ data: check }, { status: 201 });
  } catch (error) {
    console.error("Error creando el pago del cheque:", error);
    return NextResponse.json(
      { error: "Error creando el pago del cheque" },
      { status: 500 }
    );
  }
}
