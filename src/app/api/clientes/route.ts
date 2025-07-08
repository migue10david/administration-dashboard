import { prisma } from '@/app/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { FilterSchema, PaginationSchema } from '@/app/lib/schemas/common';
import { ClientWhereInput } from '@/app/lib/types/client';
import { CreateClienteSchema } from '@/app/lib/schemas/clientFormSchema';

import { promises as fs } from 'fs'
import path from 'path'
import { unlink } from 'fs/promises'
import { join } from 'path'

const UPLOADS_DIR = join(process.cwd(), 'public', 'uploads')

// Función para asegurar que el directorio de uploads existe
async function ensureUploadsDirExists() {
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
  try {
    await fs.access(uploadsDir)
  } catch (error) {
    console.log(error);
    await fs.mkdir(uploadsDir, { recursive: true })
  }
}

// Función para guardar el archivo en el sistema
export async function saveFile(blob: Blob, fileName: string): Promise<string> {
  const buffer = Buffer.from(await blob.arrayBuffer())
  const filePath = path.join(process.cwd(), 'public', 'uploads', fileName)
  await fs.writeFile(filePath, buffer)
  return `/uploads/${fileName}`
}

export async function deleteUploadedFile(fileUrl: string) {
  try {
    const filename = fileUrl.split('/uploads/')[1]
    if (filename) {
      await unlink(join(UPLOADS_DIR, filename))
    }
  } catch (error) {
    console.error('Error deleting file:', error)
  }
}


// GET /api/clientes
export async function GET(
  request: NextRequest
) {
  try {
    const { searchParams } = new URL(request.url!)

    const pagination = PaginationSchema.parse({
      page: parseInt(searchParams.get('page') || "1"),
      limit: parseInt(searchParams.get('limit') || "10")
    });

    const filters = FilterSchema.parse({
      search: searchParams.get('search') || undefined
    })

    const where: ClientWhereInput = {}

    // Filtro por texto (búsqueda)
    if (filters.search) {
      where.OR = [
        {
          nombre: {
            contains: filters.search as string,
            mode: 'insensitive',
          },
        },
        {
          direccion: {
            contains: filters.search as string,
            mode: 'insensitive',
          },
        },
        {
          telefono: {
            contains: filters.search as string,
            mode: 'insensitive',
          },
        },
      ];
    }

    // Consulta base
    const query = {
      where,
      include: { 
        cheques: true
      },
      skip: (pagination.page - 1) * pagination.limit,
      take: pagination.limit
    }

    // Ejecutar consulta
    const [clients, total] = await Promise.all([
      prisma.cliente.findMany(query),
      prisma.cliente.count({ where })
    ])    

    return NextResponse.json({
      status: 200,
      data: clients,
      meta: {
        total,
        page:pagination.page,
        llimit:pagination.limit,
        totalPages: Math.ceil(total / pagination.limit),
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Error obteniendo clientes' }, { status: 401 })
  }
}

// POST /api/clientes
export async function POST(req: Request) {
  const clonedRequest = req.clone()

  try {
    await ensureUploadsDirExists()
    const formData = await clonedRequest.formData()

    // Obtener archivo (asumiendo que el campo se llama 'dniImage')
    const dniImage = formData.get('dniImage') as Blob | null

    let imageUrl: string | null = null

    // Procesar imagen si existe
    if (dniImage && dniImage.size > 0) {
      // Validar tipo de archivo
      if (!dniImage.type.startsWith('image/')) {
        return NextResponse.json(
          { success: false, error: 'El archivo debe ser una imagen' },
          { status: 400 }
        )
      }

      // Validar tamaño del archivo (ejemplo: máximo 5MB)
      if (dniImage.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { success: false, error: 'La imagen no puede exceder los 5MB' },
          { status: 400 }
        )
      }

      // Generar nombre único para el archivo
      const fileExtension = dniImage.type.split('/')[1] || 'jpg'
      const fileName = `dni-${Date.now()}.${fileExtension}`

      // Guardar archivo y obtener URL
      imageUrl = await saveFile(dniImage, fileName)
    }

    // Parsear datos del cliente
    const clientData = CreateClienteSchema.parse({
      nombre: formData.get('nombre'),
      direccion: formData.get('direccion'),
      telefono: formData.get('telefono'),
      nacionalidad: formData.get('nacionalidad'),
      imageUrl: imageUrl
    });

    // Crear cliente con tipo explícito
    const client = await prisma.cliente.create({
      data: {
        ...clientData,
      }
    });

    return NextResponse.json(client, { status: 201 })
  } catch (error) {
    console.error('Error creando el cliente:', error)
    return NextResponse.json(
      { error: 'Error creando el cliente' },
      { status: 500 }
    )
  }
}