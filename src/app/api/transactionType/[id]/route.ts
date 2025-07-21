import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { z } from "zod";
import prisma from "@/app/lib/db";
import { checkTransactionTypeFormSchema } from "@/app/lib/schemas/commonFormSchema";
import { auth } from "@/app/lib/auth-credentials/auth";

// Obtener un tipo de transaccion por su ID
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
    const transactionType = await prisma.checkTransactionType.findUnique({
      where: { id: id },
    });

    if (!transactionType) {
      return NextResponse.json(
        { error: "País no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(transactionType);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error al obtener el tipo de transacción" },
      { status: 500 }
    );
  }
}

export async function PUT(
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

  const { id } = await params; // Safe to use
  const createdById = session.user.id;

  try {
    // Obtener y validar cuerpo
    const body = await req.json();
    const validatedData = checkTransactionTypeFormSchema.parse(body);

    const updTransactionType = await prisma.checkTransactionType.update({
      where: { id: id },
      data: {
        ...validatedData,
        createdById: createdById,
      },
    });

    return NextResponse.json({ data: updTransactionType }, { status: 200 });
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
        { status: 401}
      );
  }

  const { id } = await params; // Safe to use
  const createdById = session.user.id;

  try {
    const transactionType = await prisma.checkTransactionType.findUnique({
      where: { id: id },
    });

    if (!transactionType) {
      return NextResponse.json({
        success: true,
        message: "Tipo de transacción no encontrada",
      });
    }

    const updTransactionType = await prisma.checkTransactionType.update({
      where: { id: id },
      data: {
        createdById: createdById,
        isActive: !transactionType.isActive,
      },
    });

    return NextResponse.json({ data: updTransactionType }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function PATCH(
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

  const { id } = await params; // Safe to use
  const createdById = session.user.id;

  try {
    // 2. Parsear cuerpo
    const body = await req.json();

    // 3. Validación parcial (schema diferente al POST)
    const validatedData = checkTransactionTypeFormSchema.parse(body);

    // 4. Actualizar solo campos proporcionados
    const updTransactionType = await prisma.checkTransactionType.update({
      where: { id: id },
      data: {
        ...validatedData,
        createdById: createdById,
      },
    });

    return NextResponse.json(updTransactionType, { status: 200 });
  } catch (error) {
    // Manejo de errores específicos
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
