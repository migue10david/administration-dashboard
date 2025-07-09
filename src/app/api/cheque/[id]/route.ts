// app/api/categories/[id]/route.ts
import { NextResponse } from "next/server";
import { NextRequest } from 'next/server';
import { z } from "zod";
import { UpdateChequeSchema } from '@/app/lib/schemas/chequeFormSchema';
import prisma from "@/app/lib/db";

// Obtener un cheque por ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

  const { id } = await params;

  try {
    const cheque = await prisma.cheque.findUnique({
      where: { id: id },
    });

    if (!cheque) {
      return NextResponse.json({ error: "Cheque no encontrado" }, { status: 404 });
    }

    return NextResponse.json(cheque);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error al obtener el cheque" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

  const { id } = await params; // Safe to use

  try {
    const cheque = await prisma.cheque.findUnique({
      where: { id: id },
    });

    if (!cheque) {
      return NextResponse.json({ error: "Cheque no encontrado" }, { status: 404 });
    }

    if (cheque.estado === "PENDIENTE") {
        // Obtener y validar cuerpo
        const body = await req.json();
        const validatedData = UpdateChequeSchema.parse(body);

        // Actualizar categoría
        const updatedCheque = await prisma.cheque.update({
        where: { id: id },
        data: validatedData,
        });

        return NextResponse.json({ data: updatedCheque }, { status: 200 });
    } else {
      return NextResponse.json(
        {
          error: "Error",
          details: "El cheque ya fue procesado, no se puede modificar",
        },
        { status: 401 }
      );

    }

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

    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // Safe to use

  try {
    const cheque = await prisma.cheque.findUnique({
      where: { id: id },
    });

    if (!cheque) {
      return NextResponse.json({ error: "Cheque no encontrado" }, { status: 404 });
    }

    if (cheque.estado === "PENDIENTE") {
        await prisma.cheque.delete({
            where: { id: id },
        });

        return NextResponse.json(
            { message: "Cheque eliminado" },
            { status: 200 }
        );
    } else {
      return NextResponse.json(
        {
          error: "Error",
          details: "El cheque ya fue procesado, no se puede eliminar",
        },
        { status: 401 }
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // Safe to use

  try {
    const cheque = await prisma.cheque.findUnique({
      where: { id: id },
    });
    if (!cheque) {
      return NextResponse.json({ error: "Cheque no encontrado" }, { status: 404 });
    }

    if (cheque.estado === "PENDIENTE") {
        // 2. Parsear cuerpo
        const body = await req.json();

        // 3. Validación parcial (schema diferente al POST)
        const validatedData = UpdateChequeSchema.parse(body);

        // 4. Actualizar solo campos proporcionados
        const updatedCheque = await prisma.cheque.update({
        where: { id: id },
        data: validatedData, // Solo actualiza los campos enviados
        });

        return NextResponse.json(updatedCheque, { status: 200 });
    } else {
      return NextResponse.json(
        {
          error: "Error",
          details: "El cheque ya fue procesado, no se puede modificar",
        },
        { status: 401 }
      );
    }
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
