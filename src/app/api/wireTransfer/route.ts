import prisma from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { FilterSchema, PaginationSchema } from "@/app/lib/schemas/common";
import { auth } from "@/app/lib/auth-credentials/auth";
import { wireTransferFormSchema } from "@/app/lib/schemas/commonFormSchema";
import { Prisma } from '@prisma/client';

// GET /api/wiretransfer  --> Obtener todas las tansferencias bancarias
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

    const where: Prisma.WireTransferWhereInput = {
      isActive: true,
      OR: filters.search ? [] : undefined
    };    

    if (filters.search) {
      const searchTerm = filters.search;
      const numericValue = parseFloat(searchTerm);
      const isNumeric = !isNaN(numericValue);

      where.OR = [
        { recipientId: { contains: searchTerm, mode: "insensitive" } },
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
    const query: Prisma.WireTransferFindManyArgs = {
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

    const [wireTransfers, total] = await Promise.all([
      prisma.wireTransfer.findMany(query),
      prisma.wireTransfer.count({ where }),
    ]);

    // Serializar fechas a ISO string para consistencia
    const serializedTransfers = wireTransfers.map(transf => ({
      ...transf,
      createdAt: transf.createdAt.toISOString(),
      updatedAt: transf.updatedAt.toISOString(),
    }));

    return NextResponse.json({
      status: 200,
      success: true,
      data: serializedTransfers,
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
    console.error('Error en GET /api/wire-transactions:', error);
    return NextResponse.json(
      { 
        success: false,
        error: "Error obteniendo transferencias bancarias",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

// POST /api/wiretransfer --> Crear una nueva transferencia bancari
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
    const validatedData = wireTransferFormSchema.parse(body);

    // 3. Crear categoría en Prisma
    const wireTransfer = await prisma.wireTransfer.create({
      data: {
        customerId: validatedData.customerId,
        recipientId: validatedData.recipientId,
        companyId: validatedData.companyId,
        amount: validatedData.amount,
        feed: validatedData.feed,
        createdById: createdById
      },
    });

    return NextResponse.json({ data: wireTransfer }, { status: 201 });
  } catch (error) {
    console.error("Error creando la transferencia bancaria:", error);
    return NextResponse.json(
      { error: "Error creando la transferencia bancaria" },
      { status: 500 }
    );
  }
}
