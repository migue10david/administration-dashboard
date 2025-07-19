import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { z } from "zod";
import prisma from "@/app/lib/db";
import { companyFormSchema } from "@/app/lib/schemas/companyFormSchema";
import { auth } from "@/app/lib/auth-credentials/auth";

// Obtener una Compañia por ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return new Response("No autorizado", { status: 401 });
  }

  const { id } = await params;

  try {
    const company = await prisma.company.findUnique({
      where: { id: id },
      include: {
        wireTransfer: true,
      },
    });

    if (!company) {
      return NextResponse.json(
        { error: "Compañia no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(company);
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
  const session = await auth();

  if (!session?.user?.id) {
    return new Response("No autorizado", { status: 401 });
  }

  const { id } = await params; // Safe to use
  const createdById = session.user.id;

  try {
    // Obtener y validar cuerpo
    const body = await req.json();
    const validatedData = companyFormSchema.parse(body);

    // Actualizar compañia
    const updCompany = await prisma.company.update({
      where: { id: id },
      data: {
        ...validatedData,
        createdById: createdById,
      },
    });

    return NextResponse.json({ data: updCompany }, { status: 200 });
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
    return new Response("No autorizado", { status: 401 });
  }

  const { id } = await params; // Safe to use
  const createdById = session.user.id;

  try {
    const company = await prisma.company.findUnique({
      where: { id: id },
      include: {
        wireTransfer: true,
      },
    });

    if (!company) {
      return NextResponse.json({
        success: true,
        message: "Compañia no encontrada",
      });
    }

    const updCompany = await prisma.company.update({
      where: { id: id },
      data: {
        createdById: createdById,
        isActive: !company.isActive,
      },
    });

    return NextResponse.json({ data: updCompany }, { status: 200 });
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
    return new Response("No autorizado", { status: 401 });
  }

  const { id } = await params; // Safe to use
  const createdById = session.user.id;

  try {
    // 2. Parsear cuerpo
    const body = await req.json();

    // 3. Validación parcial (schema diferente al POST)
    const validatedData = companyFormSchema.parse(body);

    // 4. Actualizar solo campos proporcionados
    const updCompany = await prisma.company.update({
      where: { id: id },
      data: {
        ...validatedData,
        createdById: createdById,
      },
    });

    return NextResponse.json(updCompany, { status: 200 });
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
