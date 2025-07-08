// app/api/categories/[id]/route.ts
import { NextResponse } from "next/server";
import { NextRequest } from 'next/server';
import { z } from "zod";
import { prisma } from '@/app/lib/db'
import { companiaFormSchema } from '@/app/lib/schemas/companiaFormSchema';


// Obtener una categotia  por ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

  const { id } = await params;

  try {
    const compania = await prisma.compania.findUnique({
      where: { id: id },
    });

    if (!compania) {
      return NextResponse.json({ error: "Compañia no encontrada" }, { status: 404 });
    }

    return NextResponse.json(compania);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error al obtener la compañia" },
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
    // Obtener y validar cuerpo
    const body = await req.json();
    const validatedData = companiaFormSchema.parse(body);

    // Actualizar categoría
    const updatedCompania = await prisma.compania.update({
      where: { id: id },
      data: validatedData,
    });

    return NextResponse.json({ data: updatedCompania }, { status: 200 });
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
    const compania = await prisma.compania.findUnique({
      where: { id: id },
      include: { cheques: true }
    });

    if (!compania) {
      return NextResponse.json({
        success: true,
        message: "Compañia no encontrada",
      });
    }

    if (compania.cheques.length === 0) {
      await prisma.compania.delete({
        where: { id: id },
      });

      return NextResponse.json(
        { message: "Compañia eliminada" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Error al eliminar compañia",
          details: "La compañia tiene cheques asociados",
        },
        { status: 402 }
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
    // 2. Parsear cuerpo
    const body = await req.json();

    // 3. Validación parcial (schema diferente al POST)
    const validatedData = companiaFormSchema.parse(body);

    // 4. Actualizar solo campos proporcionados
    const updatedCompania = await prisma.compania.update({
      where: { id: id },
      data: validatedData, // Solo actualiza los campos enviados
    });

    return NextResponse.json(updatedCompania, { status: 200 });
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
