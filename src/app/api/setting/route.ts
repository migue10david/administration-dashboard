import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth-credentials/auth";

// GET /api/setting  --> Obtener configuracion
export async function GET() {
  const session = await auth();

  if (!session?.user?.id && session?.user?.role !== "ADMIN") {
    return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
    )    
  }

  try {
    const setting = await prisma.systemSetting.findFirst({ include: { city: true, state: true } });

    if (!setting) {
      return NextResponse.json(
        { success: false, error: "Configuracion no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(setting);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error al obtener la configuracion" },
      { status: 500 }
    );
  }
}
