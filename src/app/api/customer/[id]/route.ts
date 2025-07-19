import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { z } from "zod";
import prisma from "@/app/lib/db";
import { UpdateClienteSchema } from "@/app/lib/schemas/customerFormSchema";
import { join } from 'path'
import { writeFile,  unlink } from 'fs/promises'
import { Prisma } from "@prisma/client";
import { auth } from "@/app/lib/auth-credentials/auth";

const UPLOADS_DIR = join(process.cwd(), 'public', 'uploads')

// Función para guardar el archivo en el sistema
async function saveFile(blob: Blob, fileName: string): Promise<string> {
  const buffer = Buffer.from(await blob.arrayBuffer())
  const filePath = join(process.cwd(), 'public', 'uploads', fileName)
  await writeFile(filePath, buffer)
  return `/uploads/${fileName}`
}

async function deleteUploadedFile(fileUrl: string) {
  try {
    const filename = fileUrl.split('/uploads/')[1]
    if (filename) {
      await unlink(join(UPLOADS_DIR, filename))
    }
  } catch (error) {
    console.error('Error deleting file:', error)
  }
}


// Obtener un juguete por ID
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
        checkTransaction: true,
        WireTransfer: true,
      },
    });

    if (!customer) {
      return NextResponse.json(
        { error: "Cliente no Encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(customer);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch cliente" },
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

    let imageUrl: string | null = null;

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
      dob: formData.get("dob"),
      ssn: formData.get("ssn"),
      dlid: formData.get("dlid"),
      imageUrl: imageUrl,
      percentage: formData.get("percentage"),
      type: formData.get("type"),
      notes: formData.get("notes"),
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

// Este debe ser para cambiar el estdo del juguete... ver para cuales puede pasar.
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
      include: { checkTransaction: true, WireTransfer: true },
    });

    if (!customer) {
      return NextResponse.json({
        success: true,
        message: "Cliente no encontrado",
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
        message: `Cliente inhabilitado`,
      });

    } catch (error) {
    console.error("Error en limpieza:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error al eliminar clientes",
        details: error instanceof Error ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
