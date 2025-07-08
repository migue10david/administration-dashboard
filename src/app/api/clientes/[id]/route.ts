import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/app/lib/db";
import { UpdateClienteSchema } from "@/app/lib/schemas/clientFormSchema";
import { saveFile, deleteUploadedFile } from "../route";

// Obtener un juguete por ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const client = await prisma.cliente.findUnique({
      where: { id: id },
      include: {
        cheques: true,
      },
    });

    if (!client) {
      return NextResponse.json(
        { error: "Cliente no Encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(client);
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
  const { id } = await params;

  try {
    const currentClient = await prisma.cliente.findUnique({
      where: { id: id },
    });

    if (!currentClient) {
      return NextResponse.json(
        { error: "Juguete no encontrado" },
        { status: 404 }
      );
    }

    const formData = await req.formData();

    // Obtener archivo (asumiendo que el campo se llama 'dniImage')
    const dniImage = formData.get("dniImage") as Blob | null;

    let imageUrl: string | null = null;

    // Procesar imagen si existe
    if (dniImage && dniImage.size > 0) {
      // Validar tipo de archivo
      if (!dniImage.type.startsWith("image/")) {
        return NextResponse.json(
          { success: false, error: "El archivo debe ser una imagen" },
          { status: 400 }
        );
      }

      // Validar tamaño del archivo (ejemplo: máximo 5MB)
      if (dniImage.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { success: false, error: "La imagen no puede exceder los 5MB" },
          { status: 400 }
        );
      }

      // Generar nombre único para el archivo
      const fileExtension = dniImage.type.split("/")[1] || "jpg";
      const fileName = `dni-${Date.now()}.${fileExtension}`;

      // Guardar archivo y obtener URL
      imageUrl = await saveFile(dniImage, fileName);
    }

    // Validar con Zod
    const clientData = UpdateClienteSchema.parse({
      nombre: formData.get("nombre"),
      direccion: formData.get("direccion"),
      telefono: formData.get("telefono"),
      nacionalidad: formData.get("nacionalidad"),
      imageUrl: imageUrl,
    });

    // 5. Transacción para actualización atómica
    const updatedCliente = await prisma.$transaction(async (tx) => {
      // Eliminar archivos físicos
      await deleteUploadedFile(currentClient.imageUrl);

      return await tx.cliente.update({
        where: { id: id },
        data: {
          ...clientData,
        },
      });
    });

    return NextResponse.json({
      success: true,
      data: updatedCliente,
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
  const { id } = await params; // Safe to use

  try {
    const cliente = await prisma.cliente.findUnique({
      where: { id: id },
      include: { cheques: true },
    });

    if (!cliente) {
      return NextResponse.json({
        success: true,
        message: "Cliente no encontrado",
      });
    }

    // 2. Verificar si tiene cheques
    if (cliente.cheques.length === 0) {
      // 2. Eliminar archivos físicos y registros de la base de datos
      await deleteUploadedFile(cliente.imageUrl);

      const deletedClient = await prisma.cliente.delete({
        where: { id: id },
      });

      return NextResponse.json({
        success: true,
        deletedClient: deletedClient,
        message: `Cliente Eliminado`,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Error al eliminar clientes",
          details: "El cliente tiene cheques asociados",
        },
        { status: 402 }
      );
    }
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
