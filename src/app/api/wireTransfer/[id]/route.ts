import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { z } from "zod";
import prisma from "@/app/lib/db";
import { auth } from "@/app/lib/auth-credentials/auth";

// Obtener una transferencia de efectivo por ID
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
    const cash = await prisma.wireTransfer.findUnique({
      where: { id: id },
      include: {
        customer: true,
        recipient: true,
      },
    });

    if (!cash) {
      return NextResponse.json(
        { error: "Transferencia Bancaria no Encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(cash);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error al obtener el la transferencia" },
      { status: 500 }
    );
  }
}

const WireTransfertFormSchema = z.object({
    customerId: z.string(),
    recipientId: z.string(),
    companyId: z.string(),
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
    const validatedData = WireTransfertFormSchema.parse(body);

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

    // validar que el beneficiario exista
    const recipient = prisma.customer.findUnique({
      where: { id: validatedData.recipientId },
    })
    
    if (!recipient) {
      return NextResponse.json(
        { error: "Este beneficiario no existe" },
        { status: 402 }
      );
    }

    // Validar que la compañia exista
    const company = prisma.company.findUnique({
      where: { id: validatedData.companyId },
    })
    
    if (!company) {
      return NextResponse.json(
        { error: "La Compañia de envio no existe" },
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
    const updWire = prisma.wireTransfer.update({
      where: { id: id },
      data: {
        ...validatedData,
        createdById: createdById,
      },
    });

    return NextResponse.json({ data: updWire }, { status: 200 });
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
    const wireTransfer = await prisma.wireTransfer.findUnique({
      where: { id: id },
    });

    if (!wireTransfer) {
      return NextResponse.json({
        success: true,
        message: "Transferencia no Encontrada",
      });
    }

    const updWireTransfer = await prisma.wireTransfer.update({
      where: { id: id },
      data: {
        isActive: !wireTransfer.isActive,
        createdById: createdById,
      },
    });

    return NextResponse.json({ data: updWireTransfer }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
