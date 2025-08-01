import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { z } from "zod";
import prisma from "@/app/lib/db";
import { auth } from "@/app/lib/auth-credentials/auth";

// Obtener un pago de chaeque por ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user?.id) {
      return NextResponse.json(
        { error: "No Autorizado" },
        { status: 401 }
      );
  }

  const { id } = await params;

  try {
    const check = await prisma.checkTransaction.findUnique({
      where: { id: id },
      include: {
        customer: true,
      },
    });

    if (!check) {
      return NextResponse.json(
        { error: "Pago no Encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(check);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error al obtener el pago" },
      { status: 500 }
    );
  }
}

const CheckTransactionFormSchema = z.object({
    customerId: z.string(),
    checkTransactionTypeId: z.string(),
    number: z.string().min(1).max(10),
    amount: z.number(),
    feed: z.number()
})

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user?.id) {
      return NextResponse.json(
        { error: "No Autorizado" },
        { status: 502 }
      );
  }

  const { id } = await params; // Safe to use
  const createdById = session.user.id;

  try {
    // Obtener y validar cuerpo
    const body = await req.json();
    const validatedData = CheckTransactionFormSchema.parse(body);

    // validar que el cliente exista
    const customer = prisma.customer.findUnique({
      where: { id: validatedData.customerId },
    })
    
    if (!customer) {
      return NextResponse.json(
        { error: "Este cliente no existe" },
        { status: 402 }
      );
    }

    // Validar que el Transaction Type Exista
    const ttype = prisma.checkTransactionType.findUnique({
      where: { id: validatedData.checkTransactionTypeId },
    })
    
    if (!ttype) {
      return NextResponse.json(
        { error: "El tipo de transacción es incorrecto" },
        { status: 402 }
      );
    }

    const setting = prisma.systemSetting.findFirst();

    if (!setting) {
      return NextResponse.json(
        { error: "No se encontró la configuración" },
        { status: 402 }
      );
    }

    // Actualizar
    const updCheck = prisma.checkTransaction.update({
      where: { id: id },
      data: {
        ...validatedData,
        createdById: createdById,
      },
    });

    return NextResponse.json({ data: updCheck }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Error de validación",
          details: error.errors.map((e) => `${e.path}: ${e.message}`),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user?.id) {
      return NextResponse.json(
        { error: "No Autorizado" },
        { status: 502 }
      );
  }

  const { id } = await params; // Safe to use
  const createdById = session.user.id;

  try {
    const check = await prisma.checkTransaction.findUnique({
      where: { id: id },
    });

    if (!check) {
      return NextResponse.json({
        success: true,
        message: "Pago no Encontrado",
      });
    }

    const updCheck = await prisma.country.update({
      where: { id: id },
      data: {
        createdById: createdById,
        isActive: !check.isActive,
      },
    });

    return NextResponse.json({ data: updCheck }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
