import prisma from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { FilterSchema, PaginationSchema } from "@/app/lib/schemas/common";
import { WireTransferWhereInput } from "@/app/lib/types/common";
import { WireTransferFormSchema } from "@/app/lib/schemas/commonFormSchema";
import { auth } from "@/app/lib/auth-credentials/auth";

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

    const where: WireTransferWhereInput = {};

    // Filtro por texto (búsqueda)
    if (filters.search) {
      where.OR = [
        {
          customerId: {
            contains: filters.search as string,
            mode: "insensitive",
          },
          recipientId: {
            contains: filters.search as string,
            mode: "insensitive",
          },
          companyId: {
            contains: filters.search as string,
            mode: "insensitive",
          },
        },
      ];
    }

    // Consulta base
    const query = {
      where,
      skip: (pagination.page - 1) * pagination.limit,
      take: pagination.limit,
    };

    // Ejecutar consulta
    const [wireTransfers, total] = await Promise.all([
      prisma.wireTransfer.findMany(query),
      prisma.wireTransfer.count({ where }),
    ]);

    return NextResponse.json({
      status: 200,
      data: wireTransfers,
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
      { error: "Error obteniendo transferencias bancarias" },
      { status: 401 }
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
    const validatedData = WireTransferFormSchema.parse(body);

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
