import prisma from '@/app/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { FilterSchema, PaginationSchema } from '@/app/lib/schemas/common';
import { CustomerWhereInput } from '@/app/lib/types/customer';
import { CreateCustomerSchema } from '@/app/lib/schemas/customerFormSchema';
import { promises as fs } from 'fs'
import { join } from 'path'
import { writeFile } from 'fs/promises'
import { auth } from "@/app/lib/auth-credentials/auth";

// Función para asegurar que el directorio de uploads existe
async function ensureUploadsDirExists() {
  const uploadsDir = join(process.cwd(), 'public', 'uploads')
  try {
    await fs.access(uploadsDir)
  } catch (error) {
    console.log(error);
    await fs.mkdir(uploadsDir, { recursive: true })
  }
}

// Función para guardar el archivo en el sistema
async function saveFile(blob: Blob, fileName: string): Promise<string> {
  const buffer = Buffer.from(await blob.arrayBuffer())
  const filePath = join(process.cwd(), 'public', 'uploads', fileName)
  await writeFile(filePath, buffer)
  return `/uploads/${fileName}`
}

// GET /api/customer
export async function GET(
  request: NextRequest
) {
  const session = await auth();

  if (!session?.user?.id) {
    return new Response("No autorizado", { status: 401 });
  }

  const isAdmin = session.user.role;

  try {
    const { searchParams } = new URL(request.url!)

    const pagination = PaginationSchema.parse({
      page: parseInt(searchParams.get('page') || "1"),
      limit: parseInt(searchParams.get('limit') || "10")
    });

    const filters = FilterSchema.parse({
      search: searchParams.get('search') || undefined
    })

    const where: CustomerWhereInput = {
      AND: [ ...(isAdmin === "ADMIN" ? [] : [{ isActive: true }])],
    }

    // Filtro por texto (búsqueda)
    if (filters.search) {
      where.OR = [
        {
          code: {
            contains: filters.search as string,
            mode: 'insensitive',
          },
        },
        {
          firstName: {
            contains: filters.search as string,
            mode: 'insensitive',
          },
        },
        {
          middleName: {
            contains: filters.search as string,
            mode: 'insensitive',
          },
        },
        {
          lastNameOne: {
            contains: filters.search as string,
            mode: 'insensitive',
          },
        },
        {
          lastNameTwo: {
            contains: filters.search as string,
            mode: 'insensitive',
          },
        },        
        {
          phone: {
            contains: filters.search as string,
            mode: 'insensitive',
          },
        }
      ];
    }

    // Consulta base
    const query = {
      where,
      skip: (pagination.page - 1) * pagination.limit,
      take: pagination.limit
    }

    // Ejecutar consulta
    const [customers, total] = await Promise.all([
      prisma.customer.findMany(query),
      prisma.customer.count({ where })
    ])    

    return NextResponse.json({
      status: 200,
      data: customers,
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

// POST /api/customer
export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return new Response("No autorizado", { status: 401 });
  }

  const clonedRequest = req.clone()
  const createdById = session.user.id;

  try {
    await ensureUploadsDirExists()
    const formData = await clonedRequest.formData()

    // Obtener archivo (asumiendo que el campo se llama 'dniImage')
    const customerPhoto = formData.get('customerPhoto') as Blob | null

    let imageUrl: string | null = null

    // Procesar imagen si existe
    if (customerPhoto && customerPhoto.size > 0) {
      // Validar tipo de archivo
      if (!customerPhoto.type.startsWith('image/')) {
        return NextResponse.json(
          { success: false, error: 'El archivo debe ser una imagen' },
          { status: 400 }
        )
      }

      // Validar tamaño del archivo (ejemplo: máximo 5MB)
      if (customerPhoto.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { success: false, error: 'La foto no puede exceder los 5MB' },
          { status: 400 }
        )
      }

      // Generar nombre único para el archivo
      const fileExtension = customerPhoto.type.split('/')[1] || 'jpg'
      const fileName = `photo-${Date.now()}.${fileExtension}`

      // Guardar archivo y obtener URL
      imageUrl = await saveFile(customerPhoto, fileName)
    }

    // Parsear datos del cliente
    const clientData = CreateCustomerSchema.parse({
      code: formData.get('code'),
      firstName: formData.get('firstName'),
      middleName: formData.get('middleName'),
      lastNameOne: formData.get('lastNameOne'),
      lastNameTwo: formData.get('lastNameTwo'),
      address: formData.get('address'),
      apartment: formData.get('apartment'),
      zipCode: formData.get('zipCode'),
      phone: formData.get('phone'),
      dob: formData.get('dob'),
      ssn: formData.get('ssn'),
      dlid: formData.get('dlid'),
      imageUrl: imageUrl,
      percentage: formData.get('percentage'),
      type: formData.get('type'),
      notes: formData.get('notes'),
      countryId: formData.get('countryId'),
      stateId: formData.get('stateId'),
      cityId: formData.get('cityId'),
      statusId: formData.get('statusId'),
      createdById: createdById
    });

    // Crear cliente con tipo explícito
    const customer = await prisma.customer.create({
      data: {
        ...clientData,
      }
    });

    return NextResponse.json(customer, { status: 201 })
  } catch (error) {
    console.error('Error creando el cliente:', error)
    return NextResponse.json(
      { error: 'Error creando el cliente' },
      { status: 500 }
    )
  }
}