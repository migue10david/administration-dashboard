import prisma from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { FilterSchema, PaginationSchema } from "@/app/lib/schemas/common";
import { CheckTransactionWhereInput } from "@/app/lib/types/common";
import { CheckTransactionFormSchema } from "@/app/lib/schemas/commonFormSchema";
import { auth } from "@/app/lib/auth-credentials/auth";

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

    const where: CheckTransactionWhereInput = {};

    // Filtro por texto (búsqueda)
    if (filters.search) {
      where.OR = [
        {
          number: {
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
    const [checks, total] = await Promise.all([
      prisma.checkTransaction.findMany(query),
      prisma.checkTransaction.count({ where }),
    ]);

    return NextResponse.json({
      status: 200,
      data: checks,
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
      { error: "Error obteniendo pagos de cheques" },
      { status: 401 }
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
