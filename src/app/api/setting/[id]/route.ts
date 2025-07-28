import prisma from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/lib/auth-credentials/auth";
import { UpdateSystemSettingSchema } from "@/app/lib/schemas/commonFormSchema";
import { z } from "zod";

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

  try {
    // 2. Parsear cuerpo
    const body = await req.json();

    // 3. Validación parcial (schema diferente al POST)
    const validatedData = UpdateSystemSettingSchema.parse(body);

    

    // 4. Actualizar solo campos proporcionados
    const updSetting = await prisma.systemSetting.update({
      where: { id: id },
      data: {
        ...validatedData,
      },
    });

    return NextResponse.json(updSetting, { status: 200 });
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
