import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { z } from "zod";
import prisma from "@/app/lib/db";
import { UpdateClienteSchema } from "@/app/lib/schemas/customerFormSchema";
import { Prisma } from "@prisma/client";
import { auth } from "@/app/lib/auth-credentials/auth";
import { deleteUploadedFile, saveFile } from '@/app/lib/server/utils';


// Obtener un Cliente por ID
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
    const customer = await prisma.customer.findUnique({
      where: { id: id },
      include: {
        receivedTransfers: true,
      },
    });

    if (!customer) {
      return NextResponse.json(
        { error: "Beneficiario no Encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(customer);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch beneficiario" },
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

  const { id } = await params;
  const createdById = session.user.id;

  try {
    const currentCustomer = await prisma.customer.findUnique({
      where: { id: id },
    });

    if (!currentCustomer) {
      return NextResponse.json(
        { error: "Cliente no encontrado" },
        { status: 404 }
      );
    }

    const formData = await req.formData();

    // Obtener archivo (asumiendo que el campo se llama 'dniImage')
    const customerPhoto = formData.get("dniImage") as Blob | null;

    let imageUrl: string = "";

    // Procesar imagen si existe
    if (customerPhoto && customerPhoto.size > 0) {
      // Validar tipo de archivo
      if (!customerPhoto.type.startsWith("image/")) {
        return NextResponse.json(
          { success: false, error: "El archivo debe ser una imagen" },
          { status: 400 }
        );
      }

      // Validar tamaño del archivo (ejemplo: máximo 5MB)
      if (customerPhoto.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { success: false, error: "La imagen no puede exceder los 5MB" },
          { status: 400 }
        );
      }

      // Generar nombre único para el archivo
      const fileExtension = customerPhoto.type.split("/")[1] || "jpg";
      const fileName = `photo-${Date.now()}.${fileExtension}`;

      // Guardar archivo y obtener URL
      imageUrl = await saveFile(customerPhoto, fileName);
    }

    // Convertir el campo dob a Date
    const dobValue = formData.get('dob');
    let dobDate: Date | null = null;

    if (dobValue) {
      // Si es string ISO (desde JSON), convertir directamente
      if (typeof dobValue === 'string' && dobValue.includes('T')) {
        dobDate = new Date(dobValue);
      }
      // Si es string de formato local (desde formData)
      else if (typeof dobValue === 'string') {
        dobDate = new Date(dobValue);
      }
      // Verificar si la fecha es válida
      if (isNaN(dobDate?.getTime() ?? NaN)) {
        dobDate = null; // O manejar el error como prefieras
      }
    }

    // Convertir percentage a float
    const percentageValue = formData.get('percentage');
    const percentage = typeof percentageValue === 'string' 
      ? parseFloat(percentageValue)
      : 0;

    // Validar el rango
    if (isNaN(percentage)) {
      return NextResponse.json(
        { error: 'Porcentaje inválido' },
        { status: 400 }
      );
    }    

    // Validar con Zod
    const customerData = UpdateClienteSchema.parse({
      code: formData.get("code"),
      firstName: formData.get("firstName"),
      middleName: formData.get("middleName"),
      lastNameOne: formData.get("lastNameOne"),
      lastNameTwo: formData.get("lastNameTwo"),
      address: formData.get("address"),
      apartment: formData.get("apartment"),
      zipCode: formData.get("zipCode"),
      phone: formData.get("phone"),
      dob: dobDate,
      ssn: formData.get("ssn"),
      dlid: formData.get("dlid"),
      imageUrl: imageUrl,
      percentage: percentage,
      type: "RECIPIENT",
      notes: formData.get("notes") || "",
      countryId: formData.get("countryId"),
      stateId: formData.get("stateId"),
      cityId: formData.get("cityId"),
      statusId: formData.get("statusId"),
      createdById: createdById
    });

    // 5. Transacción para actualización atómica
    const updatedCustomer = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Eliminar archivos físicos
      if (currentCustomer.imageUrl) {
        await deleteUploadedFile(currentCustomer.imageUrl);
      }

      return await tx.customer.update({
        where: { id: id },
        data: {
          ...customerData,
        },
      });
    });

    return NextResponse.json({
      success: true,
      data: updatedCustomer,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Error de validacion",
          details: error.errors.map((e) => `${e.path}: ${e.message}`),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Este debe ser para cambiar el estdo del cliente... 
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return new Response("No autorizado", { status: 401 });
  }

  const { id } = await params;
  const createdById = session.user.id;

  try {
    const customer = await prisma.customer.findUnique({
      where: { id: id },
      include: { 
        checkTransaction: true, 
        sentTransfers: true 
      },
    });

    if (!customer) {
      return NextResponse.json({
        success: true,
        message: "Beneficirio no encontrado",
      });
    }

      const updCustomer = await prisma.customer.update({
        where: { id: id },
        data: {
          createdById: createdById,
          isActive: !customer.isActive,
        },
      });

      return NextResponse.json({
        success: true,
        deletedClient: updCustomer,
        message: `Beneficirio inhabilitado`,
      });

    } catch (error) {
    console.error("Error en limpieza:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error al eliminar Beneficiario",
        details: error instanceof Error ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
