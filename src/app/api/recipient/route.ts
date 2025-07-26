import prisma from '@/app/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { CustomerWhereInput } from '@/app/lib/types/customer';
import { CreateCustomerSchema } from '@/app/lib/schemas/customerFormSchema';
import { auth } from "@/app/lib/auth-credentials/auth";
import { ensureUploadsDirExists, saveFile } from '@/app/lib/server/utils';

// GET /api/recipient
export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, error: "No autorizado" },
      { status: 401 }
    );
  }

  const isAdmin = session.user.role;

  try {
    const { searchParams } = new URL(request.url!);
    
    // Paginación opcional
    const pageParam = searchParams.get('page');
    const limitParam = searchParams.get('limit');
    
    const pagination = {
      page: pageParam ? parseInt(pageParam) : undefined,
      limit: limitParam ? parseInt(limitParam) : undefined
    };

    const filters = {
      search: searchParams.get('search') || undefined
    };

    // Construcción del WHERE
    const where: CustomerWhereInput = {
      AND: [
        ...(isAdmin === "ADMIN" ? [] : [{ isActive: true }]),
        { type: "RECIPIENT" }
      ],
      ...(filters.search && {
        OR: [
          { code: { contains: filters.search, mode: 'insensitive' } },
          { firstName: { contains: filters.search, mode: 'insensitive' } },
          { middleName: { contains: filters.search, mode: 'insensitive' } },
          { lastNameOne: { contains: filters.search, mode: 'insensitive' } },
          { lastNameTwo: { contains: filters.search, mode: 'insensitive' } },
          { phone: { contains: filters.search, mode: 'insensitive' } }
        ]
      })
    };

    // Consulta base
    const baseQuery = { where };

    // Añadir paginación solo si vienen ambos parámetros
    const query = pagination.page && pagination.limit
      ? {
          ...baseQuery,
          skip: (pagination.page - 1) * pagination.limit,
          take: pagination.limit
        }
      : baseQuery;

    // Ejecutar consulta
    const [recipients, total] = await Promise.all([
      prisma.customer.findMany(query),
      prisma.customer.count({ where })
    ]);

    // Respuesta condicional
    return pagination.page && pagination.limit
      ? NextResponse.json({
          status: 200,
          data: recipients,
          meta: {
            total,
            page: pagination.page,
            limit: pagination.limit,
            totalPages: Math.ceil(total / pagination.limit),
          }
        })
      : NextResponse.json({
          status: 200,
          data: recipients,
          meta: {
            total
          }
        });

  } catch (error) {
    console.error('Error obteniendo beneficiarios:', error);
    return NextResponse.json(
      { error: 'Error obteniendo beneficiarios' }, 
      { status: 500 } // Cambiado a 500 para errores de servidor
    );
  }
}

// POST /api/recipient
export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      )    
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

    // Parsear datos del cliente
    const recipientData = CreateCustomerSchema.parse({
      code: formData.get('code'),
      firstName: formData.get('firstName'),
      middleName: formData.get('middleName'),
      lastNameOne: formData.get('lastNameOne'),
      lastNameTwo: formData.get('lastNameTwo'),
      address: formData.get('address'),
      apartment: formData.get('apartment'),
      zipCode: formData.get('zipCode'),
      phone: formData.get('phone'),
      dob: dobDate,
      ssn: formData.get('ssn'),
      dlid: formData.get('dlid'),
      imageUrl: imageUrl,
      percentage: percentage,
      type: "RECIPIENT",
      notes: formData.get('notes'),
      countryId: formData.get('countryId'),
      stateId: formData.get('stateId'),
      cityId: formData.get('cityId'),
      createdById: createdById
    });

    // Crear cliente con tipo explícito
    const customer = await prisma.customer.create({
      data: {
        ...recipientData,
      }
    });

    return NextResponse.json(customer, { status: 201 })
  } catch (error) {
    console.error('Error creando el beneficiario:', error)
    return NextResponse.json(
      { error: 'Error creando el beneficiario' },
      { status: 500 }
    )
  }
}